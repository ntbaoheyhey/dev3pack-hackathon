// Scope: quote TransferFee integer; không ký/gửi hoặc xác nhận settlement.
export const U64_MAX = (1n << 64n) - 1n;
export function u64(value) {
  if (typeof value !== 'bigint' || value < 0n || value > U64_MAX) throw new RangeError('u64 bigint required');
  return value;
}
export function validateFee(config) {
  if (!config || typeof config.bps !== 'bigint' || config.bps < 0n || config.bps > 10000n) throw new RangeError('bps outside 0..10000');
  u64(config.maxFee);
  return config;
}
export function feeFor(gross, config) {
  u64(gross); validateFee(config);
  const rounded = (gross * config.bps + 9999n) / 10000n;
  return rounded < config.maxFee ? rounded : config.maxFee;
}
export function netFor(gross, config) { return u64(gross) - feeFor(gross, config); }
export function grossFor(targetNet, config) {
  u64(targetNet); validateFee(config);
  if (netFor(U64_MAX, config) < targetNet) throw new RangeError('unreachable_net_u64');
  let lo = targetNet, hi = U64_MAX;
  while (lo < hi) {
    const mid = lo + (hi - lo) / 2n;
    if (netFor(mid, config) >= targetNet) hi = mid; else lo = mid + 1n;
  }
  return lo;
}
export function epochFee(epoch, older, newer) {
  u64(epoch); u64(older.epoch); u64(newer.epoch); validateFee(older); validateFee(newer);
  if (newer.epoch < older.epoch) throw new RangeError('unordered_fee_epochs');
  return epoch >= newer.epoch ? newer : older;
}
// Oracle độc lập theo công thức inverse upstream, chỉ dùng trong test.
// Implementation chính dùng binary search và được đối chiếu thêm brute force.
