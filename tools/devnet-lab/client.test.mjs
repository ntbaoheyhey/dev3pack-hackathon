import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { anchor, GENESIS, LOADER, ROOT, PROGRAM, PAYER, COUNTER, loadIdl, programFromIdl, instruction, decodeCounter, inspect } from './client.mjs';

const program = programFromIdl(loadIdl(), {});
const discriminator = createHash('sha256').update('account:Counter').digest().subarray(0, 8);
function fixture(count = 1n) {
  const data = Buffer.alloc(48);
  discriminator.copy(data);
  data.writeBigUInt64LE(count, 8);
  PAYER.toBuffer().copy(data, 16);
  return { owner: PROGRAM, executable: false, data, lamports: 1_224_961 };
}

test('generated initialize IDL builds the Rust instruction and exact account privileges', async () => {
  const ix = await instruction(program, 'initialize');
  assert(ix.programId.equals(PROGRAM));
  assert.equal(ix.data.toString('hex'), 'afaf6d1f0d989bed');
  assert.deepEqual(ix.keys.map(k => [k.pubkey.toBase58(), k.isSigner, k.isWritable]), [
    [PAYER.toBase58(), true, true], [COUNTER.toBase58(), false, true], [anchor.web3.SystemProgram.programId.toBase58(), false, false],
  ]);
});

test('generated increment requires the authority signer and exact discriminator', async () => {
  const ix = await instruction(program, 'increment');
  assert.equal(ix.data.toString('hex'), '0b12680968ae3b21');
  assert.deepEqual(ix.keys.map(k => [k.pubkey.toBase58(), k.isSigner, k.isWritable]), [
    [COUNTER.toBase58(), false, true], [PAYER.toBase58(), true, false],
  ]);
});

test('generated account decoder reads independent Rust-layout bytes and max count', () => {
  assert.deepEqual(decodeCounter(program, fixture()), { count: '1', authority: PAYER.toBase58(), lamports: 1_224_961 });
  assert.equal(decodeCounter(program, fixture(10n)).count, '10');
});

test('bytes with the wrong owner or authority never become valid counter state', () => {
  const wrongOwner = fixture();
  wrongOwner.owner = anchor.web3.SystemProgram.programId;
  assert.throws(() => decodeCounter(program, wrongOwner), /COUNTER_OWNER_MISMATCH/);
  const wrongAuthority = fixture();
  PROGRAM.toBuffer().copy(wrongAuthority.data, 16);
  assert.throws(() => decodeCounter(program, wrongAuthority), /COUNTER_AUTHORITY_MISMATCH/);
});

test('malformed layout, account type and counter above limit are rejected', () => {
  const short = fixture(); short.data = short.data.subarray(0, 47);
  assert.throws(() => decodeCounter(program, short), /COUNTER_SIZE_MISMATCH/);
  const wrongType = fixture(); wrongType.data.fill(0, 0, 8);
  assert.throws(() => decodeCounter(program, wrongType));
  assert.throws(() => decodeCounter(program, fixture(11n)), /COUNTER_COUNT_OUT_OF_RANGE/);
});

test('wrong cluster is rejected before balance, deployment or signing work', async () => {
  let balanceReads = 0;
  await assert.rejects(inspect({ getGenesisHash: async () => 'not-devnet', getBalance: async () => { balanceReads++; } }, program), /NOT_DEVNET/);
  assert.equal(balanceReads, 0);
});

function deployedFixture() {
  const dataAddress = new anchor.web3.PublicKey(Buffer.alloc(32, 7));
  const programData = Buffer.concat([Buffer.alloc(45), fs.readFileSync(new URL('target/deploy/phase3_hello.so', ROOT)), Buffer.alloc(16)]);
  programData.writeUInt32LE(3);
  programData[12] = 1;
  PAYER.toBuffer().copy(programData, 13);
  const programBytes = Buffer.alloc(36);
  programBytes.writeUInt32LE(2);
  dataAddress.toBuffer().copy(programBytes, 4);
  const transport = {
    getGenesisHash: async () => GENESIS,
    getBalance: async () => 10_000_000,
    getAccountInfoAndContext: async () => ({ context: { slot: 42 }, value: { owner: LOADER, executable: true, data: programBytes } }),
    getAccountInfo: async key => key.equals(dataAddress) ? { owner: LOADER, executable: false, data: programData } : fixture(3n),
  };
  return { transport, programData };
}

test('readiness checks the actual local binary plus zero padding and counter state', async () => {
  const { transport } = deployedFixture();
  const result = await inspect(transport, program);
  assert.equal(result.ready, true);
  assert.equal(result.counter.count, '3');
  assert.equal(result.genesis, GENESIS);
});

test('a different deployed binary or upgrade authority prevents readiness', async () => {
  const binary = deployedFixture();
  binary.programData[45] ^= 1;
  await assert.rejects(inspect(binary.transport, program), /DEPLOYED_BYTES_MISMATCH/);
  const authority = deployedFixture();
  authority.programData[13] ^= 1;
  await assert.rejects(inspect(authority.transport, program), /UPGRADE_AUTHORITY_MISMATCH/);
});
