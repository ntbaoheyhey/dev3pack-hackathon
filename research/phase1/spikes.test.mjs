import test from 'node:test';
import assert from 'node:assert/strict';
import {base58, programPointer, programData, compareManifest} from './cluster-proof.mjs';
import {LOADER} from './rpc.mjs';
import {U64_MAX, feeFor, grossFor, netFor, epochFee} from './netpay.mjs';
const c = (bps, maxFee) => ({bps: BigInt(bps), maxFee: BigInt(maxFee)});
const account = (bytes, executable = false, owner = LOADER) => ({owner, executable, data: [bytes.toString('base64'), 'base64']});
test('base58 known vectors, including leading zeros', () => {
  assert.equal(base58(Buffer.alloc(32)), '11111111111111111111111111111111');
  assert.equal(base58(Buffer.from([0, 0, 1])), '112');
  assert.equal(base58(Buffer.from('Hello World')), 'JxF12TrwUP45BMd');
});
test('loader validates type/length/owner/executable, extracts pointer', () => {
  const b = Buffer.alloc(36); b.writeUInt32LE(2);
  assert.equal(programPointer(account(b, true)), '11111111111111111111111111111111');
  for (const invalid of [null, account(b), account(b, true, 'wrong'), account(b.subarray(1), true)]) assert.throws(() => programPointer(invalid));
  b.writeUInt32LE(3); assert.throws(() => programPointer(account(b, true)));
});
test('ProgramData metadata and payload hashes distinguish upgrade from code', () => {
  const b = Buffer.alloc(49); b.writeUInt32LE(3); b.writeBigUInt64LE(42n, 4); b[45] = 127;
  const first = programData(account(b));
  assert.equal(first.upgradeAuthority, null); assert.equal(first.upgradeSlot, '42');
  b.writeBigUInt64LE(43n, 4); const second = programData(account(b));
  assert.equal(first.payloadSha256WithPadding, second.payloadSha256WithPadding);
  assert.notEqual(first.accountSha256, second.accountSha256);
  b[48] = 1; assert.notEqual(second.payloadSha256WithPadding, programData(account(b)).payloadSha256WithPadding);
  b[12] = 2; assert.throws(() => programData(account(b)));
  assert.throws(() => programData(account(Buffer.alloc(45))));
});
test('missing manifest/IDL never becomes ABI verification', () => {
  const r = compareManifest({programId: 'p'}, {programId: 'p'});
  assert.equal(r.checks.find(x => x.field === 'idlSha256').status, 'UNKNOWN');
  assert.equal(r.abiCompatibility, 'UNKNOWN'); assert.equal(r.sourceVerification, 'NOT_RUN');
  assert.equal(compareManifest({programId: 'p'}, {programId: 'other'}).mismatchCount, 1);
});
test('rounding, max cap, zero and integer precision counterexamples', () => {
  assert.equal(feeFor(101n, c(100, 100)), 2n); assert.equal(netFor(101n, c(100, 100)), 99n);
  assert.equal(grossFor(100n, c(100, 100)), 102n); assert.equal(feeFor(10000n, c(9000, 3)), 3n);
  assert.equal(grossFor(0n, c(10000, 100)), 0n); assert.equal(grossFor(1n, c(10000, 100)), 101n);
  assert.equal(feeFor(9007199254740993n, c(1, U64_MAX)), 900719925475n);
});
test('invalid/overflow input rejected, no silent Number coercion', () => {
  assert.throws(() => grossFor(U64_MAX, c(1, 1)));
  assert.equal(grossFor(U64_MAX, c(0, 0)), U64_MAX);
  for (const value of [-1n, U64_MAX + 1n, 12, '12']) assert.throws(() => feeFor(value, c(10, 2)));
  for (const config of [c(-1, 0), c(10001, 0), c(10, -1), c(10, U64_MAX + 1n)]) assert.throws(() => grossFor(0n, config));
});
test('epoch switch uses newer epoch, not older epoch', () => {
  const older = {...c(100, 100), epoch: 0n}, newer = {...c(200, 100), epoch: 10n};
  assert.equal(feeFor(101n, epochFee(9n, older, newer)), 2n);
  assert.equal(feeFor(101n, epochFee(10n, older, newer)), 3n);
  assert.equal(feeFor(101n, epochFee(11n, older, newer)), 3n);
});
function inverseOracle(net, config) {
  if (config.bps === 0n || net === 0n) return net;
  if (config.bps === 10000n) return net + config.maxFee;
  const numerator = net * 10000n, denominator = 10000n - config.bps;
  const raw = (numerator + denominator - 1n) / denominator;
  return raw - net >= config.maxFee ? net + config.maxFee : raw;
}
test('binary-search quote agrees with upstream inverse formula over 5,940 cases', () => {
  let count = 0;
  for (const bps of [0, 1, 99, 100, 999, 2500, 5000, 9999, 10000]) for (const cap of [0, 1, 2, 7, 100, 100000]) for (let i = 0n; i < 110n; i++) {
    const config = c(bps, cap), target = i * i * 10001n;
    assert.equal(grossFor(target, config), inverseOracle(target, config)); count++;
  }
  assert.equal(count, 5940);
});
test('independent brute-force enumeration proves minimal gross on small domain', () => {
  for (const bps of [0, 1, 100, 3333, 9999, 10000]) for (const cap of [0, 1, 3, 20]) for (let target = 0n; target <= 30n; target++) {
    // Dùng phép chia có dư thay công thức ceil trong implementation.
    const config = c(bps, cap); let expected = 0n;
    while (true) {
      const product = expected * BigInt(bps);
      let fee = product / 10000n + (product % 10000n === 0n ? 0n : 1n);
      if (fee > BigInt(cap)) fee = BigInt(cap);
      if (expected - fee >= target) break;
      expected++;
    }
    assert.equal(grossFor(target, config), expected);
  }
});
