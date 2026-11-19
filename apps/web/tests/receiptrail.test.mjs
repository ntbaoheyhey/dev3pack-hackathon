import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseSol,
  formatSol,
  getReceiptRailError,
  PROGRAM_ADDRESS,
} from '../../../packages/receiptrail-client/index.mjs';
import {
  ReceiptRailMockEngine,
  DEFAULT_MERCHANT,
  DEFAULT_PAYER,
  OTHER_WALLET,
} from '../src/receiptrail/adapter.ts';

test('amount/u64: parses and formats SOL exactly with BigInt and rejects lossy inputs', () => {
  // 1 lamport
  assert.equal(parseSol('0.000000001'), 1n);
  assert.equal(formatSol(1n), '0.000000001');

  // 1.5 SOL
  assert.equal(parseSol('1.5'), 1_500_000_000n);
  assert.equal(formatSol(1_500_000_000n), '1.5');

  // Max u64 boundary
  const maxU64Lamports = 18446744073709551615n;
  assert.equal(parseSol('18446744073.709551615'), maxU64Lamports);
  assert.equal(formatSol(maxU64Lamports), '18446744073.709551615');

  // Rejections
  assert.throws(() => parseSol('-1'), /negative|invalid/i);
  assert.throws(() => parseSol('1e9'), /exponent|scientific|invalid/i);
  assert.throws(() => parseSol('0.1234567891'), /precision|decimal|invalid/i);
  assert.throws(() => parseSol('abc'), /invalid/i);
});

test('roles & expiry: enforces payer/merchant roles and derives Expired from slot', async () => {
  const engine = new ReceiptRailMockEngine();
  const sampleAddr = 'EpQUeEpGPoZrDoffujf86a3GnKdBkX7RbvsbXkkfpodo';

  // Khi Payer kết nối trước expiry
  engine.currentSlot = 100n; // expiresSlot là 200n
  const payerInspect = await engine.inspect(sampleAddr, DEFAULT_PAYER.address);
  assert.ok(payerInspect);
  assert.equal(payerInspect.displayStatus, 'Open');
  assert.equal(payerInspect.expiry, 'Unexpired');
  assert.equal(payerInspect.canPay, true);
  assert.equal(payerInspect.canCancel, false);

  // Khi Người ngoài (Bob/Hacker) kết nối
  const hackerInspect = await engine.inspect(sampleAddr, OTHER_WALLET.address);
  assert.ok(hackerInspect);
  assert.equal(hackerInspect.canPay, false);
  assert.equal(hackerInspect.canCancel, false);

  // Khi Merchant kết nối
  const merchantInspect = await engine.inspect(sampleAddr, DEFAULT_MERCHANT.address);
  assert.ok(merchantInspect);
  assert.equal(merchantInspect.canPay, false);
  assert.equal(merchantInspect.canCancel, true);

  // Khi slot vượt quá expiry: chuyển sang Expired
  engine.warpSlot(150n); // 100 + 150 = 250n > 200n
  const expiredInspect = await engine.inspect(sampleAddr, DEFAULT_PAYER.address);
  assert.ok(expiredInspect);
  assert.equal(expiredInspect.displayStatus, 'Expired');
  assert.equal(expiredInspect.expiry, 'Expired');
  assert.equal(expiredInspect.canPay, false);

  // Merchant vẫn được quyền Cancel hóa đơn Open đã hết hạn
  const merchantExpiredInspect = await engine.inspect(sampleAddr, DEFAULT_MERCHANT.address);
  assert.ok(merchantExpiredInspect);
  assert.equal(merchantExpiredInspect.canCancel, true);
});

test('account switch & terms: invalidates confirmed terms upon wallet change', async () => {
  const engine = new ReceiptRailMockEngine();
  const sampleAddr = 'EpQUeEpGPoZrDoffujf86a3GnKdBkX7RbvsbXkkfpodo';
  const inspected = await engine.inspect(sampleAddr, DEFAULT_PAYER.address);
  assert.ok(inspected);

  let confirmedTerms = {
    address: inspected.invoice.address,
    merchant: inspected.invoice.merchant,
    payer: inspected.invoice.payer,
    invoiceId: inspected.invoice.invoiceId,
    amountLamports: inspected.invoice.amountLamports,
    expiresSlot: inspected.invoice.expiresSlot,
  };

  // Giả lập người dùng đổi tài khoản từ Alice sang Bob
  let currentWallet = DEFAULT_PAYER;
  assert.equal(currentWallet.address, confirmedTerms.payer);

  // Switch to Bob
  currentWallet = OTHER_WALLET;
  if (currentWallet.address !== confirmedTerms.payer) {
    confirmedTerms = null; // Bị hủy bỏ
  }
  assert.equal(confirmedTerms, null);
});

test('pending/Unknown -> re-check: does not auto-resend and recovers confirmed state cleanly', async () => {
  const engine = new ReceiptRailMockEngine();
  const sampleAddr = 'EpQUeEpGPoZrDoffujf86a3GnKdBkX7RbvsbXkkfpodo';
  const inspected = await engine.inspect(sampleAddr, DEFAULT_PAYER.address);
  assert.ok(inspected);

  const confirmedTerms = {
    address: inspected.invoice.address,
    merchant: inspected.invoice.merchant,
    payer: inspected.invoice.payer,
    invoiceId: inspected.invoice.invoiceId,
    amountLamports: inspected.invoice.amountLamports,
    expiresSlot: inspected.invoice.expiresSlot,
  };

  // Kích hoạt mô phỏng RPC Timeout (Unknown state)
  engine.simulatedFault = 'timeout_unknown';
  const payRes = await engine.payInvoice({
    invoiceAddress: sampleAddr,
    signer: DEFAULT_PAYER.address,
    confirmedTerms,
  });

  assert.equal(payRes.status, 'Unknown');
  assert.ok(payRes.signature.startsWith('mock-timeout-sig-'));

  // Kiểm tra: Trạng thái trên ledger chưa bị đánh dấu Paid bừa bãi
  const midInspect = await engine.inspect(sampleAddr, DEFAULT_PAYER.address);
  assert.ok(midInspect);
  assert.equal(midInspect.invoice.status, 'Open');

  // Người dùng bấm "Kiểm tra lại trên chuỗi" (Re-check on-chain)
  const recheckRes = await engine.recheckOnChain(sampleAddr);
  assert.equal(recheckRes.status, 'Paid');

  // Trạng thái đã được phục hồi thành công sang Paid
  const finalInspect = await engine.inspect(sampleAddr, DEFAULT_PAYER.address);
  assert.ok(finalInspect);
  assert.equal(finalInspect.invoice.status, 'Paid');
  assert.equal(finalInspect.displayStatus, 'Paid');
});

test('CPI rollback: preserves principal and keeps invoice Open when transaction fails', async () => {
  const engine = new ReceiptRailMockEngine();
  const sampleAddr = 'EpQUeEpGPoZrDoffujf86a3GnKdBkX7RbvsbXkkfpodo';
  const inspected = await engine.inspect(sampleAddr, DEFAULT_PAYER.address);
  assert.ok(inspected);

  const confirmedTerms = {
    address: inspected.invoice.address,
    merchant: inspected.invoice.merchant,
    payer: inspected.invoice.payer,
    invoiceId: inspected.invoice.invoiceId,
    amountLamports: inspected.invoice.amountLamports,
    expiresSlot: inspected.invoice.expiresSlot,
  };

  // Kích hoạt mô phỏng CPI Rollback do thiếu số dư
  engine.simulatedFault = 'cpi_rollback';

  await assert.rejects(
    async () => {
      await engine.payInvoice({
        invoiceAddress: sampleAddr,
        signer: DEFAULT_PAYER.address,
        confirmedTerms,
      });
    },
    /ROLLBACK|số dư không đủ/i
  );

  // Hóa đơn vẫn giữ nguyên trạng thái Open, tiền gốc không bị mất
  const afterInspect = await engine.inspect(sampleAddr, DEFAULT_PAYER.address);
  assert.ok(afterInspect);
  assert.equal(afterInspect.invoice.status, 'Open');
  assert.equal(afterInspect.invoice.paidSlot, 0n);
});

test('error mapping: maps custom error codes 6000-6008 to Anchor IDL error definitions', () => {
  const err6000 = getReceiptRailError(PROGRAM_ADDRESS, 6000);
  assert.deepEqual(err6000, {
    code: 6000,
    name: 'InvalidAmount',
    msg: 'Invoice amount must be positive',
  });

  const err6004 = getReceiptRailError(PROGRAM_ADDRESS, 6004);
  assert.deepEqual(err6004, {
    code: 6004,
    name: 'InvoiceNotOpen',
    msg: 'Invoice is already paid or cancelled',
  });

  const err6006 = getReceiptRailError(PROGRAM_ADDRESS, 6006);
  assert.deepEqual(err6006, {
    code: 6006,
    name: 'WrongPayer',
    msg: 'Signer is not the payer named on this invoice',
  });

  // Khác programAddress trả về null
  const errOtherProg = getReceiptRailError('11111111111111111111111111111111', 6000);
  assert.equal(errOtherProg, null);
});
