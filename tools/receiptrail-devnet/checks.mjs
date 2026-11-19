import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { anchor, LOADER, PAYER, GENESIS, RPC } from '../devnet-lab/client.mjs';
export { anchor, LOADER, PAYER, GENESIS, RPC };
export const CAP_LAMPORTS = 1_800_000_000;
export const FUNDING = Object.freeze({ merchant: 5_000_000, payer: 2_000_000 });
export const sha256 = value => createHash('sha256').update(value).digest('hex');
const { PublicKey } = anchor.web3;

export function assertBudget({ baseline, balance, nextDebit, reserve = 0, cap = CAP_LAMPORTS }) {
  for (const value of [baseline, balance, nextDebit, reserve, cap]) assert(Number.isSafeInteger(value) && value >= 0, 'INVALID_BUDGET');
  assert.equal(cap, CAP_LAMPORTS, 'UNAPPROVED_CAP');
  assert(balance <= baseline, 'UNEXPECTED_EXTERNAL_FUNDING_RECONCILE_FIRST');
  const spent = baseline - balance;
  assert(BigInt(spent) + BigInt(nextDebit) + BigInt(reserve) <= BigInt(cap), 'CAP_EXCEEDED');
  assert(BigInt(nextDebit) + BigInt(reserve) <= BigInt(balance), 'INSUFFICIENT_BUDGET_BALANCE');
  return { spent, projected: spent + nextDebit + reserve, remainingCap: cap - spent };
}

export function programDataAddress(program) {
  return PublicKey.findProgramAddressSync([new PublicKey(program).toBuffer()], LOADER)[0];
}

// Loader v3 v8.0.1; Write bytes are also checked against a finalized Agave CLI tx.
export function bufferWriteInstruction(buffer, binary, offset, length) {
  assert(Number.isSafeInteger(offset) && offset >= 0 && offset <= 0xffffffff);
  assert(Number.isSafeInteger(length) && length > 0 && length <= 960 && offset + length <= binary.length);
  const data = Buffer.alloc(16 + length);
  data.writeUInt32LE(1, 0); data.writeUInt32LE(offset, 4); data.writeBigUInt64LE(BigInt(length), 8);
  binary.copy(data, 16, offset, offset + length);
  return new anchor.web3.TransactionInstruction({ programId: LOADER,
    keys: [{ pubkey: new PublicKey(buffer), isSigner: false, isWritable: true }, { pubkey: PAYER, isSigner: true, isWritable: false }], data });
}

export function verifyBuffer(account, binaryLength) {
  assert(account?.owner.equals(LOADER) && !account.executable, 'INVALID_BUFFER_OWNER');
  assert(account.data.length === 37 + binaryLength && account.data.readUInt32LE(0) === 1, 'INVALID_BUFFER_LAYOUT');
  assert(account.data[4] === 1 && new PublicKey(account.data.subarray(5, 37)).equals(PAYER), 'WRONG_BUFFER_AUTHORITY');
  return account.data.subarray(37);
}

export function verifyDeployment({ program, authority, binary, programAccount, dataAccount }) {
  const dataAddress = programDataAddress(program);
  assert(programAccount?.owner.equals(LOADER) && programAccount.executable, 'INVALID_PROGRAM_OWNER_OR_EXECUTABLE');
  assert(programAccount.data.length === 36 && programAccount.data.readUInt32LE(0) === 2, 'INVALID_PROGRAM_LAYOUT');
  assert(new PublicKey(programAccount.data.subarray(4)).equals(dataAddress), 'WRONG_PROGRAMDATA_POINTER');
  assert(dataAccount?.owner.equals(LOADER) && !dataAccount.executable, 'INVALID_PROGRAMDATA_OWNER');
  assert(dataAccount.data.length === 45 + binary.length && dataAccount.data.readUInt32LE(0) === 3, 'INVALID_PROGRAMDATA_LAYOUT');
  assert(dataAccount.data[12] === 1 && new PublicKey(dataAccount.data.subarray(13, 45)).toBase58() === authority, 'WRONG_UPGRADE_AUTHORITY');
  assert(dataAccount.data.subarray(45).equals(binary), 'DEPLOYED_BYTES_MISMATCH');
  return {
    program, programData: dataAddress.toBase58(), authority,
    slot: dataAccount.data.readBigUInt64LE(4).toString(), binarySha256: sha256(binary),
    programLamports: programAccount.lamports, programDataLamports: dataAccount.lamports,
  };
}

export function toWeb3Instruction(instruction) {
  return new anchor.web3.TransactionInstruction({ programId: new PublicKey(instruction.programAddress),
    keys: instruction.accounts.map(a => ({ pubkey: new PublicKey(a.address), isSigner: a.isSigner, isWritable: a.isWritable })),
    data: Buffer.from(instruction.data),
  });
}

export function publicEnvelope(address, account) {
  assert(account, 'MISSING_INVOICE');
  return { address, owner: account.owner.toBase58(), executable: account.executable, data: new Uint8Array(account.data) };
}

export function assertDuplicateSimulation(value, program) {
  assert.deepEqual(value.err, { InstructionError: [0, { Custom: 6004 }] }, 'NOT_RECEIPTRAIL_ALREADY_PAID');
  assert(value.logs?.includes(`Program ${program} failed: custom program error: 0x1774`), 'WRONG_ERROR_ORIGIN');
  assert(!value.logs.some(line => line === `Program ${anchor.web3.SystemProgram.programId} invoke [2]`), 'UNEXPECTED_TRANSFER_ON_DUPLICATE');
}
