import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { anchor, LOADER, PAYER, assertBudget, programDataAddress, verifyDeployment, toWeb3Instruction, assertDuplicateSimulation } from './checks.mjs';
import { bufferWriteInstruction, verifyBuffer } from './checks.mjs';
const { PublicKey, SystemProgram } = anchor.web3;
const vector = JSON.parse(readFileSync(new URL('../../docs/fixtures/receiptrail-abi.json', import.meta.url), 'utf8'));

test('buffer writes match a finalized Agave CLI transaction wire format', () => {
  const sample = JSON.parse(readFileSync(new URL('../../docs/evidence/phase3/hello-buffer-cli-write-sample.json', import.meta.url)));
  const message = sample.transaction.transaction.message;
  const ix = message.instructions[0];
  const bytes = Buffer.from(anchor.utils.bytes.bs58.decode(ix.data));
  const offset = bytes.readUInt32LE(4), length = Number(bytes.readBigUInt64LE(8));
  const binary = Buffer.alloc(offset + length); bytes.copy(binary, offset, 16);
  const actual = bufferWriteInstruction(message.accountKeys[ix.accounts[0]], binary, offset, length);
  assert(actual.data.equals(bytes)); assert.equal(actual.programId.toBase58(), message.accountKeys[ix.programIdIndex]);
  assert.deepEqual(actual.keys.map(a => a.pubkey.toBase58()), ix.accounts.map(i => message.accountKeys[i]));
  assert.deepEqual(actual.keys.map(a => [a.isSigner, a.isWritable]), [[false, true], [true, false]]);
  for (const [o, n] of [[-1, 1], [0, 961], [binary.length, 1], [0, 0], [1.1, 1]]) assert.throws(() => bufferWriteInstruction(PAYER, binary, o, n));
});

test('buffer verification rejects foreign authority, wrong owner and partial account layout', () => {
  const data = Buffer.alloc(40); data.writeUInt32LE(1); data[4] = 1; PAYER.toBuffer().copy(data, 5);
  const account = { owner: LOADER, executable: false, data };
  assert.equal(verifyBuffer(account, 3).length, 3);
  assert.throws(() => verifyBuffer(account, 4), /INVALID_BUFFER_LAYOUT/);
  assert.throws(() => verifyBuffer({ ...account, owner: SystemProgram.programId }, 3), /INVALID_BUFFER_OWNER/);
  data[5] ^= 1; assert.throws(() => verifyBuffer(account, 3), /WRONG_BUFFER_AUTHORITY/);
});

test('budget counts previous debit, next operation and reserve under the exact approved cap', () => {
  const result = assertBudget({ baseline: 1_848_125_199, balance: 1_800_000_000, nextDebit: 752_027_960, reserve: 20_000_000 });
  assert.equal(result.projected, 820_153_159);
  assert.throws(() => assertBudget({ baseline: 2_000_000_000, balance: 500_000_000, nextDebit: 300_000_001 }), /CAP_EXCEEDED/);
  assert.throws(() => assertBudget({ baseline: 100, balance: 99, nextDebit: 100 }), /INSUFFICIENT_BUDGET_BALANCE/);
  assert.throws(() => assertBudget({ baseline: 100, balance: 101, nextDebit: 0 }), /EXTERNAL_FUNDING/);
  assert.throws(() => assertBudget({ baseline: 100, balance: 100, nextDebit: 0, cap: 2_000_000_000 }), /UNAPPROVED_CAP/);
  assert.throws(() => assertBudget({ baseline: Number.MAX_SAFE_INTEGER + 1, balance: 100, nextDebit: 0 }), /INVALID_BUDGET/);
});

function deploymentFixture() {
  const program = vector.programAddress;
  const binary = Buffer.from([1, 2, 3, 4, 5]);
  const programBytes = Buffer.alloc(36); programBytes.writeUInt32LE(2); programDataAddress(program).toBuffer().copy(programBytes, 4);
  const data = Buffer.concat([Buffer.alloc(45), binary]); data.writeUInt32LE(3); data.writeBigUInt64LE(500n, 4); data[12] = 1; PAYER.toBuffer().copy(data, 13);
  return { program, authority: PAYER.toBase58(), binary,
    programAccount: { owner: LOADER, executable: true, data: programBytes, lamports: 833120 },
    dataAccount: { owner: LOADER, executable: false, data, lamports: 752027960 },
  };
}

test('deployment verifier checks canonical loader pair, authority and exact bytecode', () => {
  const f = deploymentFixture(); const result = verifyDeployment(f);
  assert.equal(result.programData, programDataAddress(f.program).toBase58()); assert.equal(result.slot, '500');
  const binary = deploymentFixture(); binary.dataAccount.data[45] ^= 1;
  assert.throws(() => verifyDeployment(binary), /DEPLOYED_BYTES_MISMATCH/);
  const authority = deploymentFixture(); authority.dataAccount.data[13] ^= 1;
  assert.throws(() => verifyDeployment(authority), /WRONG_UPGRADE_AUTHORITY/);
  const pointer = deploymentFixture(); pointer.programAccount.data[4] ^= 1;
  assert.throws(() => verifyDeployment(pointer), /WRONG_PROGRAMDATA_POINTER/);
});

test('short, forged-owner, oversized or revoked-authority deployment accounts are rejected', () => {
  for (const size of [0, 4, 35, 37]) { const f = deploymentFixture(); f.programAccount.data = Buffer.alloc(size); assert.throws(() => verifyDeployment(f), /INVALID_PROGRAM_LAYOUT/); }
  const wrongOwner = deploymentFixture(); wrongOwner.dataAccount.owner = SystemProgram.programId;
  assert.throws(() => verifyDeployment(wrongOwner), /INVALID_PROGRAMDATA_OWNER/);
  const executable = deploymentFixture(); executable.programAccount.executable = false;
  assert.throws(() => verifyDeployment(executable), /INVALID_PROGRAM_OWNER_OR_EXECUTABLE/);
  const revoked = deploymentFixture(); revoked.dataAccount.data[12] = 0;
  assert.throws(() => verifyDeployment(revoked), /WRONG_UPGRADE_AUTHORITY/);
  const oversized = deploymentFixture(); oversized.dataAccount.data = Buffer.concat([oversized.dataAccount.data, Buffer.alloc(1)]);
  assert.throws(() => verifyDeployment(oversized), /INVALID_PROGRAMDATA_LAYOUT/);
});

test('transport conversion retains every Rust account privilege and makes an independent data copy', () => {
  for (const name of ['create', 'pay', 'cancel']) {
    const source = { ...vector[name], data: new Uint8Array(Buffer.from(vector[name].dataHex, 'hex')) };
    const ix = toWeb3Instruction(source);
    assert.equal(ix.programId.toBase58(), vector.programAddress);
    assert.deepEqual(ix.keys.map(k => ({ address: k.pubkey.toBase58(), isSigner: k.isSigner, isWritable: k.isWritable })), vector[name].accounts);
    assert.equal(ix.data.toString('hex'), vector[name].dataHex); source.data.fill(0);
    assert.equal(ix.data.toString('hex'), vector[name].dataHex);
  }
});

test('duplicate simulation requires structured error plus the ReceiptRail origin and no transfer', () => {
  const sample = { err: { InstructionError: [0, { Custom: 6004 }] }, logs: [`Program ${vector.programAddress} failed: custom program error: 0x1774`] };
  assertDuplicateSimulation(sample, vector.programAddress);
  assert.throws(() => assertDuplicateSimulation({ ...sample, err: null }, vector.programAddress));
  assert.throws(() => assertDuplicateSimulation(sample, PAYER.toBase58()), /WRONG_ERROR_ORIGIN/);
  assert.throws(() => assertDuplicateSimulation({ ...sample, logs: [...sample.logs, `Program ${SystemProgram.programId} invoke [2]`] }, vector.programAddress), /UNEXPECTED_TRANSFER/);
});
