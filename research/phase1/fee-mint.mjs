// Layout/source và policy đã ghi trước code tại docs/learning/021-payment-cluster-evidence.md.
// Chỉ quote mint Token-2022 fee-only, không xác nhận khả năng transfer/settlement.
import {TOKEN_2022} from './rpc.mjs';
import {bytesOf, base58, sha256} from './cluster-proof.mjs';
import {u64, validateFee, epochFee, grossFor, feeFor, netFor} from './netpay.mjs';

function optionalKey(data, offset, cOption = false) {
  if (cOption) {
    const tag = data.readUInt32LE(offset);
    if (tag !== 0 && tag !== 1) throw new Error('invalid_authority_option');
    return tag === 0 ? null : base58(data.subarray(offset + 4, offset + 36));
  }
  const key = data.subarray(offset, offset + 32);
  return key.every(x => x === 0) ? null : base58(key);
}
function readFee(data, offset) {
  const result = {epoch: data.readBigUInt64LE(offset), maxFee: data.readBigUInt64LE(offset + 8), bps: BigInt(data.readUInt16LE(offset + 16))};
  validateFee(result);
  return result;
}
export function parseFeeMint(account) {
  if (account?.owner !== TOKEN_2022 || account?.executable !== false) throw new Error('unsupported_owner_or_executable');
  const data = bytesOf(account);
  if (data.length < 82 || data.length === 355 || data.length > 65536) throw new Error('invalid_mint_length');
  if (data[45] !== 1) throw new Error('mint_not_initialized');
  const mintAuthority = optionalKey(data, 0, true);
  const freezeAuthority = optionalKey(data, 46, true);
  if (data.length === 82) throw new Error('no_transfer_fee_config');
  if (data.length < 166 || data[165] !== 1 || data.subarray(82, 165).some(x => x !== 0)) throw new Error('invalid_mint_padding_or_type');
  const extensions = new Map();
  let offset = 166;
  while (offset < data.length) {
    // Policy chặt hơn unpack upstream: không cho dữ liệu ẩn sau zero terminator.
    if (data.subarray(offset).every(x => x === 0)) break;
    if (offset + 4 > data.length) throw new Error('truncated_tlv_header');
    const type = data.readUInt16LE(offset), length = data.readUInt16LE(offset + 2);
    if (type === 0 || extensions.has(type)) throw new Error('duplicate_or_invalid_tlv_type');
    const end = offset + 4 + length;
    if (end > data.length) throw new Error('truncated_tlv_value');
    extensions.set(type, data.subarray(offset + 4, end));
    offset = end;
  }
  const unsupported = [...extensions.keys()].filter(type => type !== 1);
  if (unsupported.length) throw new Error(`unsupported_extensions:${unsupported.join(',')}`);
  const feeData = extensions.get(1);
  if (!feeData) throw new Error('no_transfer_fee_config');
  if (feeData.length !== 108) throw new Error('invalid_transfer_fee_config_length');
  const older = readFee(feeData, 72), newer = readFee(feeData, 90);
  if (newer.epoch < older.epoch) throw new Error('unordered_fee_epochs');
  return {
    decimals: data[44], supply: data.readBigUInt64LE(36), mintAuthority, freezeAuthority,
    configAuthority: optionalKey(feeData, 0), withdrawAuthority: optionalKey(feeData, 32),
    withheldAmount: feeData.readBigUInt64LE(64), older, newer,
    extensionTypes: [...extensions.keys()], mintDataSha256: sha256(data),
  };
}

export function safeRpcInteger(value) {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error('unsafe_rpc_integer');
  return value;
}
export function validateSnapshotWindow(before, contextSlot, after) {
  const slot = safeRpcInteger(contextSlot);
  safeRpcInteger(before.epoch); safeRpcInteger(after.epoch);
  if (safeRpcInteger(before.absoluteSlot) > slot || safeRpcInteger(after.absoluteSlot) < slot) throw new Error('non_monotonic_snapshot');
  if (before.epoch !== after.epoch) throw new Error('epoch_changed_reread');
  return BigInt(before.epoch);
}
export function quoteFeeMint(account, epoch, targetNet) {
  u64(epoch); u64(targetNet);
  const mint = parseFeeMint(account);
  const selectedFee = epochFee(epoch, mint.older, mint.newer);
  const gross = grossFor(targetNet, selectedFee);
  return {status: 'FEE_QUOTE_ONLY', epoch, targetNet, gross, fee: feeFor(gross, selectedFee), net: netFor(gross, selectedFee), selectedFee, mintConfig: mint,
    limitation: 'Mint fee schedule only; accounts, balance, freeze, memo/CPI requirements and settlement NOT_CHECKED. Snapshot can become stale.'};
}
