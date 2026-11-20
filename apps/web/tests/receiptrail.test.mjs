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
  formatWalletError,
  client,
  parseInvoiceIdHex,
  parseExpiryDelta,
} from '../src/receiptrail/adapter.ts';
import { registerMockWallets, resetMockWalletsForTest } from '../src/receiptrail/mock-wallets.ts';
import { getWallets } from '@wallet-standard/app';
import { getAddressDecoder } from '@solana/addresses';

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

test('P5-01: duplicate create rejects across all states (Open, Paid, Cancelled) without resetting ledger', async () => {
  const engine = new ReceiptRailMockEngine();
  const openAddr = 'EpQUeEpGPoZrDoffujf86a3GnKdBkX7RbvsbXkkfpodo';
  const openInspect = await engine.inspect(openAddr);
  assert.ok(openInspect);
  assert.equal(openInspect.invoice.status, 'Open');

  // Thử tạo trùng trên hóa đơn đang Open
  await assert.rejects(
    async () => {
      await engine.createInvoice({
        merchant: openInspect.invoice.merchant,
        payer: openInspect.invoice.payer,
        invoiceId: openInspect.invoice.invoiceId,
        amountLamports: 9_999_999_999n,
        expiresSlot: openInspect.invoice.expiresSlot + 500n,
      });
    },
    /đã tồn tại|không thể tạo lại/i
  );
  // Khẳng định trạng thái Open và terms không bị thay đổi
  const afterOpen = await engine.inspect(openAddr);
  assert.equal(afterOpen.invoice.amountLamports, openInspect.invoice.amountLamports);
  assert.equal(afterOpen.invoice.status, 'Open');

  // Thanh toán hóa đơn sang Paid
  await engine.payInvoice({
    invoiceAddress: openAddr,
    signer: DEFAULT_PAYER.address,
    confirmedTerms: openInspect.invoice,
  });
  const paidInspect = await engine.inspect(openAddr);
  assert.equal(paidInspect.invoice.status, 'Paid');
  assert.ok(paidInspect.invoice.paidSlot > 0n);

  // Thử tạo trùng trên hóa đơn đã Paid
  await assert.rejects(
    async () => {
      await engine.createInvoice({
        merchant: openInspect.invoice.merchant,
        payer: openInspect.invoice.payer,
        invoiceId: openInspect.invoice.invoiceId,
        amountLamports: 1_000_000n,
        expiresSlot: openInspect.invoice.expiresSlot + 500n,
      });
    },
    /đã tồn tại|không thể tạo lại/i
  );
  // Khẳng định trạng thái Paid không bị reset về Open
  const afterPaidAttempt = await engine.inspect(openAddr);
  assert.equal(afterPaidAttempt.invoice.status, 'Paid');
  assert.equal(afterPaidAttempt.invoice.paidSlot, paidInspect.invoice.paidSlot);

  // Tạo một hóa đơn mới và Cancel nó để test Cancelled state
  const cancelId = new Uint8Array(32);
  cancelId[0] = 0xca;
  cancelId[31] = 0xfe;
  const newCreated = await engine.createInvoice({
    merchant: DEFAULT_MERCHANT.address,
    payer: DEFAULT_PAYER.address,
    invoiceId: cancelId,
    amountLamports: 500_000_000n,
    expiresSlot: engine.currentSlot + 100n,
  });
  const inspectedNew = await engine.inspect(newCreated.invoiceAddress);
  await engine.cancelInvoice({
    invoiceAddress: newCreated.invoiceAddress,
    signer: DEFAULT_MERCHANT.address,
    confirmedTerms: inspectedNew.invoice,
  });
  const cancelledInspect = await engine.inspect(newCreated.invoiceAddress);
  assert.equal(cancelledInspect.invoice.status, 'Cancelled');

  // Thử tạo trùng trên hóa đơn đã Cancelled
  await assert.rejects(
    async () => {
      await engine.createInvoice({
        merchant: DEFAULT_MERCHANT.address,
        payer: DEFAULT_PAYER.address,
        invoiceId: cancelId,
        amountLamports: 1_000_000n,
        expiresSlot: engine.currentSlot + 200n,
      });
    },
    /đã tồn tại|không thể tạo lại/i
  );
  const afterCancelledAttempt = await engine.inspect(newCreated.invoiceAddress);
  assert.equal(afterCancelledAttempt.invoice.status, 'Cancelled');
});

test('P5-01: canonical PDA derivation and decode verification for all seeded fixtures', async () => {
  const engine = new ReceiptRailMockEngine();
  const list = await engine.listInvoices();
  assert.ok(list.length >= 2, 'Cần ít nhất 2 seeded invoice');

  for (const item of list) {
    const rawAccount = engine.getRawAccount(item.address);
    assert.ok(rawAccount, `Account envelope phải tồn tại cho ${item.address}`);

    // Giải mã qua client.decodeInvoice - không được văng INVOICE_PDA_MISMATCH
    const decoded = await client.decodeInvoice(rawAccount);
    assert.equal(decoded.address, item.address);
    assert.ok(decoded.merchant);
    assert.ok(decoded.payer);

    // Kiểm tra PDA khớp chuẩn theo client derivation
    const derived = await client.deriveInvoiceAddress(decoded.merchant, decoded.invoiceId);
    assert.equal(decoded.address, derived.address);
    assert.equal(decoded.bump, derived.bump);
  }
});

test('P5-02: pre-validation precedes simulated timeout fault (prevents invalid Unknown)', async () => {
  const engine = new ReceiptRailMockEngine();
  const sampleAddr = 'EpQUeEpGPoZrDoffujf86a3GnKdBkX7RbvsbXkkfpodo';
  const inspected = await engine.inspect(sampleAddr);
  assert.ok(inspected);

  // Kích hoạt simulated fault là timeout_unknown
  engine.simulatedFault = 'timeout_unknown';

  // Ca 1: Sai người ký (Merchant cố tình bấm Pay thay vì Payer Alice)
  await assert.rejects(
    async () => {
      await engine.payInvoice({
        invoiceAddress: sampleAddr,
        signer: DEFAULT_MERCHANT.address, // Sai signer
        confirmedTerms: inspected.invoice,
      });
    },
    /WRONG_PAYER|WrongPayer|không phải payer/i
  );

  // Ca 2: Hacker Bob cố tình bấm Pay
  await assert.rejects(
    async () => {
      await engine.payInvoice({
        invoiceAddress: sampleAddr,
        signer: OTHER_WALLET.address,
        confirmedTerms: inspected.invoice,
      });
    },
    /WRONG_PAYER|WrongPayer|không phải payer/i
  );

  // Ca 3: Terms mismatch (amount khác)
  const tamperedTerms = { ...inspected.invoice, amountLamports: 999_999_999n };
  await assert.rejects(
    async () => {
      await engine.payInvoice({
        invoiceAddress: sampleAddr,
        signer: DEFAULT_PAYER.address,
        confirmedTerms: tamperedTerms,
      });
    },
    /khác với dữ liệu|TERMS_CHANGED/i
  );

  // Khẳng định hóa đơn không bao giờ bị rơi vào trạng thái Unknown hay pending khi bị reject sớm
  const afterCheck = await engine.inspect(sampleAddr);
  assert.equal(afterCheck.isPending, false);
  assert.equal(afterCheck.invoice.status, 'Open');
});

test('P5-02: pending state locks operations per-invoice and prevents duplicate submissions', async () => {
  const engine = new ReceiptRailMockEngine();
  const sampleAddr = 'EpQUeEpGPoZrDoffujf86a3GnKdBkX7RbvsbXkkfpodo';
  const secondAddr = 'GYjxtHoM4wVxbGwHHgcKBpj2C5r5CQw48YMcmgvBywA8';
  const inspected = await engine.inspect(sampleAddr, DEFAULT_PAYER.address);
  assert.ok(inspected);

  // Bật timeout để tạo pending
  engine.simulatedFault = 'timeout_unknown';
  const payRes = await engine.payInvoice({
    invoiceAddress: sampleAddr,
    signer: DEFAULT_PAYER.address,
    confirmedTerms: inspected.invoice,
  });

  assert.equal(payRes.status, 'Unknown');
  const midInspect = await engine.inspect(sampleAddr, DEFAULT_PAYER.address);
  assert.equal(midInspect.isPending, true);
  assert.equal(midInspect.canPay, false, 'Khi pending, canPay phải bị khóa');
  assert.equal(midInspect.canCancel, false, 'Khi pending, canCancel phải bị khóa');

  // Thao tác Pay lần 2 bị chặn
  await assert.rejects(
    async () => {
      await engine.payInvoice({
        invoiceAddress: sampleAddr,
        signer: DEFAULT_PAYER.address,
        confirmedTerms: inspected.invoice,
      });
    },
    /chờ xử lý|khóa|Chờ xác nhận/i
  );

  // Thao tác Cancel trên hóa đơn đang pending bị chặn
  await assert.rejects(
    async () => {
      await engine.cancelInvoice({
        invoiceAddress: sampleAddr,
        signer: DEFAULT_MERCHANT.address,
        confirmedTerms: inspected.invoice,
      });
    },
    /chờ xử lý|khóa|Chờ xác nhận/i
  );

  // Thao tác Create duplicate trên hóa đơn đang pending bị chặn
  await assert.rejects(
    async () => {
      await engine.createInvoice({
        merchant: inspected.invoice.merchant,
        payer: inspected.invoice.payer,
        invoiceId: inspected.invoice.invoiceId,
        amountLamports: inspected.invoice.amountLamports,
        expiresSlot: inspected.invoice.expiresSlot + 100n,
      });
    },
    /chờ xử lý|đã tồn tại|không thể tạo lại/i
  );

  // Cross-invoice: Hóa đơn thứ 2 không bị ảnh hưởng, không bị pending
  const secondInspect = await engine.inspect(secondAddr);
  assert.equal(secondInspect.isPending, false);

  // Re-check đối soát thành công giải phóng pending và chuyển sang Paid
  const recheckRes = await engine.recheckOnChain(sampleAddr);
  assert.equal(recheckRes.status, 'Paid');
  const finalInspect = await engine.inspect(sampleAddr, DEFAULT_PAYER.address);
  assert.equal(finalInspect.isPending, false);
  assert.equal(finalInspect.invoice.status, 'Paid');
});

test('P5-02: recheckOnChain respects terminal/expiry and never fabricates Paid', async () => {
  const engine = new ReceiptRailMockEngine();
  const sampleAddr = 'EpQUeEpGPoZrDoffujf86a3GnKdBkX7RbvsbXkkfpodo';
  const inspected = await engine.inspect(sampleAddr, DEFAULT_PAYER.address);

  // Hóa đơn bị hủy trước đó
  await engine.cancelInvoice({
    invoiceAddress: sampleAddr,
    signer: DEFAULT_MERCHANT.address,
    confirmedTerms: inspected.invoice,
  });

  // Recheck không bao giờ biến một hóa đơn Cancelled thành Paid
  const recheckCancelled = await engine.recheckOnChain(sampleAddr);
  assert.equal(recheckCancelled.status, 'Cancelled');
  const checkCancelled = await engine.inspect(sampleAddr);
  assert.equal(checkCancelled.invoice.status, 'Cancelled');

  // Tạo hóa đơn mới đã hết hạn (expired)
  const expId = new Uint8Array(32);
  expId[0] = 0xee;
  expId[31] = 0x01;
  engine.currentSlot = 500n;
  const expCreated = await engine.createInvoice({
    merchant: DEFAULT_MERCHANT.address,
    payer: DEFAULT_PAYER.address,
    invoiceId: expId,
    amountLamports: 100_000_000n,
    expiresSlot: 510n, // currentSlot 500n < expiresSlot 510n
  });
  engine.warpSlot(50n); // currentSlot = 550n > 510n

  const expInspect = await engine.inspect(expCreated.invoiceAddress);
  assert.equal(expInspect.displayStatus, 'Expired');

  // Recheck không tạo Paid cho hóa đơn đã hết hạn
  const recheckExp = await engine.recheckOnChain(expCreated.invoiceAddress);
  assert.notEqual(recheckExp.status, 'Paid');
});

test('P5-04: strict 64-hex and u64 parsing with BigInt', () => {
  // Hex hợp lệ 64 ký tự (32 bytes)
  const validHex = '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff';
  const parsedBytes = parseInvoiceIdHex(validHex);
  assert.equal(parsedBytes.length, 32);
  assert.equal(parsedBytes[0], 0x11);
  assert.equal(parsedBytes[31], 0xff);

  // Có tiền tố 0x vẫn hợp lệ
  const parsedWithPrefix = parseInvoiceIdHex(`0x${validHex}`);
  assert.equal(parsedWithPrefix.length, 32);

  // Thiếu ký tự (63 ký tự) - Cấm tự padding 0
  assert.throws(
    () => parseInvoiceIdHex('11223344556677889900aabbccddeeff11223344556677889900aabbccddeef'),
    /đúng 64 ký tự hex/i
  );

  // Dư ký tự (66 ký tự) - Cấm tự cắt ngắn (truncate)
  assert.throws(
    () => parseInvoiceIdHex(`${validHex}aa`),
    /đúng 64 ký tự hex/i
  );

  // Chứa ký tự không phải hex
  assert.throws(
    () => parseInvoiceIdHex('zz223344556677889900aabbccddeeff11223344556677889900aabbccddeeff'),
    /đúng 64 ký tự hex/i
  );

  // Expiry delta: số nguyên dương hợp lệ
  assert.equal(parseExpiryDelta('100'), 100n);
  assert.equal(parseExpiryDelta('18446744073709551615'), 18446744073709551615n);

  // Expiry delta lỗi: số âm, 0, số thập phân, chữ
  assert.throws(() => parseExpiryDelta('0'), /lớn hơn 0/i);
  assert.throws(() => parseExpiryDelta('-10'), /hợp lệ/i);
  assert.throws(() => parseExpiryDelta('10.5'), /hợp lệ/i);
  assert.throws(() => parseExpiryDelta('slot100'), /hợp lệ/i);
});

test('P5-04: dynamic list decoding reflects true account state', async () => {
  const engine = new ReceiptRailMockEngine();
  const customId = new Uint8Array(32);
  customId[0] = 0x55;
  customId[31] = 0xaa;

  const created = await engine.createInvoice({
    merchant: DEFAULT_MERCHANT.address,
    payer: DEFAULT_PAYER.address,
    invoiceId: customId,
    amountLamports: 750_000_000n, // 0.75 SOL
    expiresSlot: engine.currentSlot + 350n,
  });

  const list = await engine.listInvoices();
  const decodedList = await Promise.all(list.map((acc) => client.decodeInvoice(acc)));
  const found = decodedList.find((item) => item.address === created.invoiceAddress);
  assert.ok(found, 'Hóa đơn mới tạo phải có trong danh sách dynamic đã giải mã');
  assert.equal(found.amountLamports, 750_000_000n);
  assert.equal(found.payer, DEFAULT_PAYER.address);
  assert.equal(found.merchant, DEFAULT_MERCHANT.address);
  assert.equal(found.status, 'Open');
  assert.equal(found.expiresSlot, engine.currentSlot + 350n);
});

test('CPI rollback: preserves principal and keeps invoice Open when transaction fails', async () => {
  const engine = new ReceiptRailMockEngine();
  const sampleAddr = 'EpQUeEpGPoZrDoffujf86a3GnKdBkX7RbvsbXkkfpodo';
  const inspected = await engine.inspect(sampleAddr, DEFAULT_PAYER.address);
  assert.ok(inspected);

  const confirmedTerms = inspected.invoice;

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

test('wallet reject handling does not assume code 4001 is universal', () => {
  // Ca a: Lỗi chuẩn có code 4001
  const errWithCode4001 = Object.assign(new Error('User rejected the request'), { code: 4001 });
  assert.match(formatWalletError(errWithCode4001), /từ chối/i);

  // Ca b: Lỗi từ chối không có code 4001 (thông điệp lỗi từ chối thuần)
  const errWithoutCode = new Error('The user denied transaction signature');
  assert.match(formatWalletError(errWithoutCode), /từ chối/i);

  // Ca c: Lỗi kỹ thuật khác không phải reject
  const networkErr = new Error('Connection refused at RPC endpoint');
  assert.equal(formatWalletError(networkErr), 'Connection refused at RPC endpoint');
});

test('T40 regression: registerMockWallets registers all fixtures with valid 32-byte publicKeys and rejection wallet rejects', async () => {
  resetMockWalletsForTest();
  // Call registerMockWallets() - must not throw base58 31-bytes exception
  assert.doesNotThrow(() => {
    registerMockWallets();
  });

  const wallets = getWallets().get();
  assert.ok(wallets.length >= 4, 'Must register at least 4 mock wallets');

  let foundRejectionWallet = false;
  for (const w of wallets) {
    assert.ok(w.name, 'Wallet must have a name');
    const connectFeature = w.features['standard:connect'];
    assert.ok(connectFeature, `${w.name} must have standard:connect`);

    if (w.name.includes('từ chối') || w.name.includes('Rejection')) {
      foundRejectionWallet = true;
      // Rejection wallet must reject
      await assert.rejects(
        async () => connectFeature.connect(),
        (err) => {
          assert.match(err.message, /rejected|từ chối/i);
          return true;
        }
      );
    } else {
      const res = await connectFeature.connect();
      assert.ok(res.accounts.length > 0, `${w.name} must have accounts`);
      for (const acc of res.accounts) {
        assert.equal(acc.publicKey.length, 32, `${w.name} account publicKey must be exactly 32 bytes`);
        const decoded = getAddressDecoder().decode(acc.publicKey);
        assert.equal(decoded, acc.address, `${w.name} decoded publicKey must match address`);
      }
    }
  }

  assert.ok(foundRejectionWallet, 'Must verify the rejection wallet fixture');
});
