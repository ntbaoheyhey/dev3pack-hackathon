import test from 'node:test';
import assert from 'node:assert/strict';
import {TOKEN_2022} from './rpc.mjs';
import {parseFeeMint, quoteFeeMint, validateSnapshotWindow} from './fee-mint.mjs';
import {U64_MAX} from './netpay.mjs';

function fixture() {
  const data = Buffer.alloc(278);
  data[44] = 6; data[45] = 1; data[165] = 1;
  data.writeBigUInt64LE(9007199254740993n, 36);
  data.writeUInt16LE(1, 166); data.writeUInt16LE(108, 168);
  data.writeBigUInt64LE(7n, 234); // withheld at 170 + 64
  data.writeBigUInt64LE(0n, 242); data.writeBigUInt64LE(100n, 250); data.writeUInt16LE(100, 258);
  data.writeBigUInt64LE(10n, 260); data.writeBigUInt64LE(U64_MAX, 268); data.writeUInt16LE(200, 276);
  return data;
}
const account = data => ({owner: TOKEN_2022, executable: false, data: [data.toString('base64'), 'base64']});
test('raw layout retains u64 precision, authorities, cap and epoch schedule', () => {
  const raw = fixture(), mint = parseFeeMint(account(raw));
  assert.equal(mint.supply, 9007199254740993n); assert.equal(mint.newer.maxFee, U64_MAX);
  assert.equal(mint.withheldAmount, 7n); assert.equal(mint.mintAuthority, null);
  assert.equal(quoteFeeMint(account(raw), 9n, 100n).gross, 102n);
  assert.equal(quoteFeeMint(account(raw), 10n, 100n).gross, 103n);
  assert.equal(quoteFeeMint(account(raw), 10n, 100n).status, 'FEE_QUOTE_ONLY');
});
test('owner, executable, initialized, COption, padding and account type are checked', () => {
  assert.throws(() => parseFeeMint({...account(fixture()), owner: 'wrong'}));
  assert.throws(() => parseFeeMint({...account(fixture()), executable: true}));
  for (const [offset, value] of [[45, 0], [0, 2], [46, 2], [82, 1], [165, 2]]) {
    const raw = fixture(); raw[offset] = value; assert.throws(() => parseFeeMint(account(raw)));
  }
  assert.throws(() => parseFeeMint(account(Buffer.alloc(355))), /invalid_mint_length/);
  assert.throws(() => parseFeeMint({owner: TOKEN_2022, executable: false, data: ['not-base64!', 'base64']}), /invalid_base64/);
});
test('unknown or hook extensions never return an optimistic quote', () => {
  for (const type of [14, 4, 18, 65535]) {
    const tail = Buffer.alloc(8); tail.writeUInt16LE(type); tail.writeUInt16LE(4, 2);
    assert.throws(() => quoteFeeMint(account(Buffer.concat([fixture(), tail])), 10n, 100n), /unsupported_extensions/);
  }
});
test('truncated/duplicate TLVs and hidden data after zero marker are rejected', () => {
  assert.throws(() => parseFeeMint(account(fixture().subarray(0, 277))), /truncated_tlv_value/);
  assert.throws(() => parseFeeMint(account(Buffer.concat([fixture(), fixture().subarray(166)]))), /duplicate_or_invalid/);
  for (const tail of [Buffer.from([1]), Buffer.from([1, 0, 0]), Buffer.from([0, 0, 0, 0, 1])]) {
    assert.throws(() => parseFeeMint(account(Buffer.concat([fixture(), tail]))));
  }
  assert.equal(parseFeeMint(account(Buffer.concat([fixture(), Buffer.alloc(5)]))).older.bps, 100n);
});
test('missing fees, malformed fee values and reversed fee epochs are rejected', () => {
  assert.throws(() => parseFeeMint(account(fixture().subarray(0, 82))), /no_transfer_fee/);
  const size = Buffer.concat([fixture(), Buffer.alloc(1)]); size.writeUInt16LE(109, 168);
  assert.throws(() => parseFeeMint(account(size)), /invalid_transfer_fee_config_length/);
  const bps = fixture(); bps.writeUInt16LE(10001, 276);
  assert.throws(() => parseFeeMint(account(bps)), /bps outside/);
  const epochs = fixture(); epochs.writeBigUInt64LE(11n, 242);
  assert.throws(() => parseFeeMint(account(epochs)), /unordered_fee_epochs/);
});
test('snapshot must be monotonic and within one epoch, and reject rounded RPC numbers', () => {
  const before = {epoch: 10, absoluteSlot: 100}, after = {epoch: 10, absoluteSlot: 105};
  assert.equal(validateSnapshotWindow(before, 102, after), 10n);
  assert.throws(() => validateSnapshotWindow(before, 102, {...after, epoch: 11}), /epoch_changed/);
  assert.throws(() => validateSnapshotWindow(before, 99, after), /non_monotonic/);
  assert.throws(() => validateSnapshotWindow(before, 106, after), /non_monotonic/);
  for (const epoch of [Number.MAX_SAFE_INTEGER + 1, -1, 1.5, '10']) assert.throws(() => validateSnapshotWindow({...before, epoch}, 102, after), /unsafe_rpc_integer/);
});
