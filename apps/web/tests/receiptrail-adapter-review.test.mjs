import test from 'node:test';
import assert from 'node:assert/strict';
import { ReceiptRailMockEngine, DEFAULT_MERCHANT, DEFAULT_PAYER, OTHER_WALLET,
  MOCK_FEE_LAMPORTS, MOCK_RENT_LAMPORTS, parseExpiryDelta, serializeInvoiceData } from '../src/receiptrail/adapter.ts';

const open = 'EpQUeEpGPoZrDoffujf86a3GnKdBkX7RbvsbXkkfpodo';
const seededCancelled = '5BWMrebjJNr2yANMqzXSwdFjErkxT24TBqDHYjLvEv66';
const terms = async (e, addr = open) => (await e.inspect(addr)).invoice;
const pay = async (e, addr = open) => ({ invoiceAddress: addr, signer: DEFAULT_PAYER.address, confirmedTerms: await terms(e, addr) });
const create = (id, amount = 1_000_000n) => ({ merchant: DEFAULT_MERCHANT.address, payer: DEFAULT_PAYER.address,
  invoiceId: new Uint8Array(32).fill(id), amountLamports: amount, expiresSlot: 300n });
const successCount = results => results.filter(r => r.status === 'fulfilled').length;
const balances = s => s.balances;

test('mock concurrent pay commits principal once and charges only the submitted operation', async () => {
  const e = new ReceiptRailMockEngine();
  const input = await pay(e), before = await e.ledgerSnapshot();
  const results = await Promise.allSettled([e.payInvoice(input), e.payInvoice(input)]);
  assert.equal(successCount(results), 1);
  const after = await e.ledgerSnapshot();
  assert.equal(balances(before)[DEFAULT_PAYER.address] - balances(after)[DEFAULT_PAYER.address], input.confirmedTerms.amountLamports);
  assert.equal(balances(after)[DEFAULT_MERCHANT.address] - balances(before)[DEFAULT_MERCHANT.address], input.confirmedTerms.amountLamports);
  assert.equal(after.feesPaid - before.feesPaid, MOCK_FEE_LAMPORTS);
  assert.equal((await terms(e)).status, 'Paid');
  await assert.rejects(e.payInvoice(input), /INVOICE_NOT_OPEN/);
  assert.deepEqual(await e.ledgerSnapshot(), after);
});

test('mock pay/cancel race permits exactly one terminal transition in either order', async () => {
  for (const cancelFirst of [true, false]) {
    const e = new ReceiptRailMockEngine(), input = await pay(e), before = await e.ledgerSnapshot();
    const cancelInput = { ...input, signer: DEFAULT_MERCHANT.address };
    const results = await Promise.allSettled(cancelFirst
      ? [e.cancelInvoice(cancelInput), e.payInvoice(input)]
      : [e.payInvoice(input), e.cancelInvoice(cancelInput)]);
    assert.equal(successCount(results), 1);
    assert.equal((await terms(e)).status, cancelFirst ? 'Cancelled' : 'Paid');
    const after = await e.ledgerSnapshot();
    assert.equal(after.feesPaid - before.feesPaid, MOCK_FEE_LAMPORTS);
    if (cancelFirst) assert.deepEqual(after.balances, before.balances);
    assert.deepEqual(after.rents, before.rents);
  }
});

test('concurrent duplicate create cannot overwrite terms or charge a second rent', async () => {
  const e = new ReceiptRailMockEngine(), before = await e.ledgerSnapshot();
  const results = await Promise.allSettled([e.createInvoice(create(0x71, 1n)), e.createInvoice(create(0x71, 2n))]);
  assert.equal(successCount(results), 1);
  const index = results.findIndex(r => r.status === 'fulfilled');
  const addr = results[index].value.invoiceAddress;
  assert.equal((await terms(e, addr)).amountLamports, index === 0 ? 1n : 2n);
  const after = await e.ledgerSnapshot();
  assert.equal(before.balances[DEFAULT_MERCHANT.address] - after.balances[DEFAULT_MERCHANT.address], MOCK_RENT_LAMPORTS);
  assert.equal(after.feesPaid - before.feesPaid, MOCK_FEE_LAMPORTS);
});

test('lost response commits at submission; repeated recheck never executes payment or changes bytes/balances', async () => {
  const e = new ReceiptRailMockEngine(), input = await pay(e);
  e.simulatedFault = 'timeout_unknown';
  const res = await e.payInvoice(input);
  assert.equal(res.status, 'Unknown');
  assert.equal((await terms(e)).status, 'Paid');
  const account = await e.getAccount(open), money = await e.ledgerSnapshot();
  assert.equal(e.getPendingRecord(open).signature, res.signature);
  await assert.rejects(e.payInvoice(input), /Pending/);
  e.warpSlot(150n);
  for (let i = 0; i < 2; i++) {
    const read = await e.recheckOnChain(open);
    assert.equal(read.status, 'Paid'); assert.equal(read.signature, res.signature); assert.equal(read.outcome, 'confirmed');
    assert.deepEqual(await e.getAccount(open), account);
    assert.deepEqual(await e.ledgerSnapshot(), money);
  }
  assert.equal(e.isPending(open), false);
});

test('dropped timeout stays Open/Expired after reconciliation and spends no principal or fee', async () => {
  const e = new ReceiptRailMockEngine(), input = await pay(e), account = await e.getAccount(open), money = await e.ledgerSnapshot();
  e.simulatedFault = 'timeout_dropped';
  const res = await e.payInvoice(input);
  assert.equal(res.status, 'Unknown'); assert.equal(e.isPending(open), true);
  e.warpSlot(150n);
  const read = await e.recheckOnChain(open);
  assert.equal(read.status, 'Open'); assert.equal(read.outcome, 'dropped'); assert.equal(read.signature, res.signature);
  assert.deepEqual(await e.getAccount(open), account); assert.deepEqual(await e.ledgerSnapshot(), money);
  assert.equal((await e.inspect(open, DEFAULT_PAYER.address)).displayStatus, 'Expired');
  await assert.rejects(e.payInvoice(input), /INVOICE_EXPIRED/);
  assert.deepEqual(await e.ledgerSnapshot(), money);
});

test('unknown record, caller terms, returned accounts and snapshots cannot mutate engine state', async () => {
  const e = new ReceiptRailMockEngine(), original = await pay(e);
  const input = { ...original, confirmedTerms: { ...original.confirmedTerms, invoiceId: new Uint8Array(original.confirmedTerms.invoiceId) } };
  const originalId = new Uint8Array(input.confirmedTerms.invoiceId);
  e.simulatedFault = 'timeout_unknown';
  const sending = e.payInvoice(input);
  input.confirmedTerms.invoiceId.fill(0); input.confirmedTerms.amountLamports = 99n; input.signer = OTHER_WALLET.address;
  await sending;
  const pending = e.getPendingRecord(open);
  assert.deepEqual(pending.confirmedTerms.invoiceId, originalId); assert.equal(pending.confirmedTerms.amountLamports, 1_000_000n);
  pending.confirmedTerms.invoiceId.fill(0);
  assert.deepEqual(e.getPendingRecord(open).confirmedTerms.invoiceId, originalId);
  e.getRawAccount(open).data.fill(0);
  const state = await e.ledgerSnapshot(); state.balances[DEFAULT_PAYER.address] = 0n;
  assert.equal((await terms(e)).status, 'Paid');
  assert.notEqual((await e.ledgerSnapshot()).balances[DEFAULT_PAYER.address], 0n);
});

test('create snapshots inputs before async PDA derivation', async () => {
  const e = new ReceiptRailMockEngine(), input = create(0x72);
  const creating = e.createInvoice(input);
  input.invoiceId.fill(0); input.amountLamports = 2n; input.merchant = OTHER_WALLET.address;
  const result = await creating, actual = await terms(e, result.invoiceAddress);
  assert.deepEqual(actual.invoiceId, new Uint8Array(32).fill(0x72));
  assert.equal(actual.amountLamports, 1_000_000n); assert.equal(actual.merchant, DEFAULT_MERCHANT.address);
});

test('different invoices cannot spend more than a shared payer balance during concurrent execution', async () => {
  const e = new ReceiptRailMockEngine();
  const a = await e.createInvoice(create(0x73, 4_000_000_000n)), b = await e.createInvoice(create(0x74, 4_000_000_000n));
  const ia = await pay(e, a.invoiceAddress), ib = await pay(e, b.invoiceAddress), before = await e.ledgerSnapshot();
  const results = await Promise.allSettled([e.payInvoice(ia), e.payInvoice(ib)]);
  assert.equal(successCount(results), 1);
  const after = await e.ledgerSnapshot();
  assert.equal(before.balances[DEFAULT_PAYER.address] - after.balances[DEFAULT_PAYER.address], 4_000_000_000n);
  assert.equal(after.balances[DEFAULT_MERCHANT.address] - before.balances[DEFAULT_MERCHANT.address], 4_000_000_000n);
  assert.equal(after.feesPaid - before.feesPaid, 2n * MOCK_FEE_LAMPORTS);
  assert.deepEqual([(await terms(e, a.invoiceAddress)).status, (await terms(e, b.invoiceAddress)).status].sort(), ['Open', 'Paid']);
});

test('forced rollback keeps both principals, account bytes and rent; fee is separately observable', async () => {
  const e = new ReceiptRailMockEngine(), input = await pay(e), before = await e.ledgerSnapshot(), account = await e.getAccount(open);
  e.simulatedFault = 'cpi_rollback';
  await assert.rejects(e.payInvoice(input), /ROLLBACK/);
  const after = await e.ledgerSnapshot();
  assert.deepEqual(after.balances, before.balances); assert.deepEqual(after.rents, before.rents);
  assert.deepEqual(await e.getAccount(open), account);
  assert.equal(before.feePayerLamports - after.feePayerLamports, MOCK_FEE_LAMPORTS);
  assert.equal((await e.recheckOnChain(open)).outcome, 'failed');
});

test('signature belongs only to its invoice, and expired cancel does not refund rent', async () => {
  const e = new ReceiptRailMockEngine(), a = await e.payInvoice(await pay(e));
  assert.equal((await e.recheckOnChain(open)).signature, a.signature);
  assert.equal((await e.recheckOnChain(seededCancelled)).signature, null);
  const b = await e.createInvoice(create(0x75)), input = await terms(e, b.invoiceAddress), before = await e.ledgerSnapshot();
  e.warpSlot(300n);
  const cancelled = await e.cancelInvoice({ invoiceAddress: b.invoiceAddress, signer: DEFAULT_MERCHANT.address, confirmedTerms: input });
  assert.equal((await e.recheckOnChain(b.invoiceAddress)).signature, cancelled.signature);
  const after = await e.ledgerSnapshot();
  assert.deepEqual(after.balances, before.balances); assert.deepEqual(after.rents, before.rents);
  assert.equal(after.feesPaid - before.feesPaid, MOCK_FEE_LAMPORTS);
});

test('strict mock serialization rejects truncation and u64 overflow; invalid signer changes no ledger', async () => {
  assert.throws(() => parseExpiryDelta('18446744073709551616'), /INVALID_U64/);
  const e = new ReceiptRailMockEngine(), invoice = await terms(e), before = await e.ledgerSnapshot();
  assert.throws(() => serializeInvoiceData({ ...invoice, invoiceId: new Uint8Array(33) }), /INVALID_BYTES/);
  assert.throws(() => serializeInvoiceData({ ...invoice, amountLamports: 2n ** 64n }), /INVALID_U64/);
  assert.throws(() => e.warpSlot(2n ** 64n), /INVALID_U64/);
  e.simulatedFault = 'wrong_payer';
  await assert.rejects(e.payInvoice(await pay(e)), /WRONG_PAYER/);
  assert.deepEqual(await e.ledgerSnapshot(), before);
});
