import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parseFeeMint, quoteFeeMint, validateSnapshotWindow} from './fee-mint.mjs';
import {netFor} from './netpay.mjs';

// Replay snapshot live đã lưu, không gọi network. Địa chỉ lấy từ source Day 50/53.
test('captured devnet bytes give independently calculated fee-only quote with address retained', async () => {
  const evidence = JSON.parse(await readFile(new URL('../../docs/evidence/phase1/netpay-1794925600812.json', import.meta.url), 'utf8'));
  const mint = 'HxDYFvcXnLuy4VdxXCooUXrch8DZW34oUteQ6N2EFxEr';
  const index = evidence.rawSnapshot.addresses.indexOf(mint);
  assert.notEqual(index, -1);
  const account = evidence.rawSnapshot.value[index];
  const epoch = validateSnapshotWindow(evidence.epochBefore, evidence.rawSnapshot.context.slot, evidence.epochAfter);
  const report = {mint, ...quoteFeeMint(account, epoch, 10000n)};
  assert.equal(report.mint, mint); // Chặn lỗi object spread ghi đè address bằng config.
  assert.equal(report.mintConfig.decimals, 6);
  assert.equal(report.selectedFee.bps, 100n);
  assert.equal(report.selectedFee.maxFee, 1000000000000n);
  assert.equal(report.gross, 10102n); assert.equal(report.fee, 102n); assert.equal(report.net, 10000n);
  assert.equal(netFor(report.gross - 1n, report.selectedFee), 9999n);
  const hookIndex = evidence.rawSnapshot.addresses.indexOf('GE6q1pL6TjYkrc9jwpdCJAKqZDmAscVR7D9dV7MmXPpd');
  assert.notEqual(hookIndex, -1);
  assert.throws(() => parseFeeMint(evidence.rawSnapshot.value[hookIndex]), /unsupported_extensions:14/);
});
