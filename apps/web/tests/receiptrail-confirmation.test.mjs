import test from 'node:test';
import assert from 'node:assert/strict';
import { createWalletStandardConnector } from '@solana/client';
import { getWallets } from '@wallet-standard/app';
import { getAddressDecoder } from '@solana/addresses';
import { ReceiptRailConfirmations, buildCreateReview, executeConfirmedOperation } from '../src/receiptrail/confirmation.ts';
import { receiptRailWallet, watchReceiptRailWallets } from '../src/receiptrail/wallet-lifecycle.ts';
import { createMockWallet } from '../src/receiptrail/mock-wallets.ts';
import { ReceiptRailMockEngine, DEFAULT_MERCHANT, DEFAULT_PAYER, OTHER_WALLET,
  MOCK_FEE_LAMPORTS, MOCK_RENT_LAMPORTS, formatWalletError } from '../src/receiptrail/adapter.ts';
import { U64_MAX } from '../../../packages/receiptrail-client/index.mjs';

const open = 'EpQUeEpGPoZrDoffujf86a3GnKdBkX7RbvsbXkkfpodo';
const fields = () => ({ payer: DEFAULT_PAYER.address, amount: '0.001', expiryDelta: '123', invoiceId: '79'.repeat(32) });
const context = (address = DEFAULT_PAYER.address) => ({ walletIdentity: {}, address, chainAllowed: true,
  walletEvent: 0, selectedAddress: open, formKey: JSON.stringify(fields()), slot: 100n });
const invoice = async engine => (await engine.inspect(open)).invoice;

test('create review uses exact input expiry, amount, full ID and canonical PDA before the first await', async () => {
  const input = fields();
  const reviewing = buildCreateReview(input, DEFAULT_MERCHANT.address, 100n);
  input.amount = '50'; input.expiryDelta = '1'; input.invoiceId = '00'.repeat(32); input.payer = OTHER_WALLET.address;
  const review = await reviewing;
  assert.equal(review.expiresSlot, 223n); assert.equal(review.amountLamports, 1_000_000n);
  assert.equal(review.payer, DEFAULT_PAYER.address); assert.deepEqual(review.invoiceId, new Uint8Array(32).fill(0x79));
  const engine = new ReceiptRailMockEngine(), model = new ReceiptRailConfirmations(), ctx = context(DEFAULT_MERCHANT.address);
  model.confirm('create', review, ctx);
  review.amountLamports = 2n; review.invoiceId.fill(0);
  const operation = model.begin('create', ctx);
  const created = await executeConfirmedOperation(engine, operation);
  const actual = (await engine.inspect(created.invoiceAddress)).invoice;
  assert.equal(actual.amountLamports, 1_000_000n); assert.equal(actual.expiresSlot, 223n);
  assert.deepEqual(actual.invoiceId, new Uint8Array(32).fill(0x79));
  assert.equal(created.invoiceAddress, operation.review.invoiceAddress);
  model.finish(operation); assert.equal(model.has('create', ctx), false);
});

test('create review rejects expiry sum overflow, malformed ID, aliases and imprecise amounts', async () => {
  const base = fields();
  await assert.rejects(buildCreateReview({ ...base, expiryDelta: '2' }, DEFAULT_MERCHANT.address, U64_MAX - 1n), /u64/);
  await assert.rejects(buildCreateReview(base, DEFAULT_MERCHANT.address, -1n), /u64/);
  await assert.rejects(buildCreateReview({ ...base, expiryDelta: (U64_MAX + 1n).toString() }, DEFAULT_MERCHANT.address, 0n));
  await assert.rejects(buildCreateReview({ ...base, invoiceId: '79' }, DEFAULT_MERCHANT.address, 100n));
  await assert.rejects(buildCreateReview({ ...base, payer: DEFAULT_MERCHANT.address }, DEFAULT_MERCHANT.address, 100n));
  await assert.rejects(buildCreateReview({ ...base, amount: '0.0000000001' }, DEFAULT_MERCHANT.address, 100n));
  const exact = await buildCreateReview({ ...base, expiryDelta: '1', amount: '0.000000001' }, DEFAULT_MERCHANT.address, U64_MAX - 1n);
  assert.equal(exact.expiresSlot, U64_MAX); assert.equal(exact.amountLamports, 1n);
});

for (const action of ['create', 'pay', 'cancel']) {
  test(`${action}: every wallet identity, account, chain, event, invoice, form or slot change consumes approval`, async () => {
    const engine = new ReceiptRailMockEngine();
    const review = action === 'create' ? await buildCreateReview(fields(), DEFAULT_MERCHANT.address, 100n) : await invoice(engine);
    const address = action === 'pay' ? DEFAULT_PAYER.address : DEFAULT_MERCHANT.address;
    const changes = [{ walletIdentity: {} }, { address: OTHER_WALLET.address }, { address: null },
      { chainAllowed: false }, { walletEvent: 1 }, { selectedAddress: 'other' }, { formKey: 'edited or preset' }, { slot: 101n }];
    for (const change of changes) {
      const model = new ReceiptRailConfirmations(), ctx = context(address);
      model.confirm(action, review, ctx); assert.equal(model.has(action, ctx), true);
      assert.equal(model.has(action, { ...ctx, ...change }), false);
      assert.throws(() => model.begin(action, { ...ctx, ...change }), /xác nhận lại/);
      assert.throws(() => model.begin(action, ctx), /xác nhận lại/); // Returning does not revive approval.
    }
  });
}

test('approval rejects guest, wrong role, unsupported chain, wrong invoice and wrong review kind', async () => {
  const model = new ReceiptRailConfirmations(), inv = await invoice(new ReceiptRailMockEngine());
  assert.throws(() => model.confirm('pay', inv, context(null)));
  assert.throws(() => model.confirm('pay', inv, context(DEFAULT_MERCHANT.address)));
  assert.throws(() => model.confirm('cancel', inv, context(DEFAULT_PAYER.address)));
  assert.throws(() => model.confirm('pay', inv, { ...context(), chainAllowed: false }));
  assert.throws(() => model.confirm('pay', inv, { ...context(), selectedAddress: 'different' }));
  assert.throws(() => model.confirm('create', inv, context(DEFAULT_MERCHANT.address)));
});

test('production submit consumes reviewed pay terms, locks synchronously and moves principal once', async () => {
  const engine = new ReceiptRailMockEngine(), model = new ReceiptRailConfirmations(), ctx = context();
  const original = await invoice(engine), terms = { ...original, invoiceId: new Uint8Array(original.invoiceId) };
  model.confirm('pay', terms, ctx);
  terms.invoiceId.fill(0); terms.amountLamports = 99n;
  const before = await engine.ledgerSnapshot(), operation = model.begin('pay', ctx);
  assert.equal(model.busy, true);
  const running = executeConfirmedOperation(engine, operation);
  assert.throws(() => model.begin('pay', ctx), /đang xử lý/);
  assert.throws(() => model.confirm('pay', original, ctx), /đang xử lý/);
  const result = await running;
  assert.equal(result.status, 'Confirmed'); assert.equal(model.isCurrent(operation), true);
  const after = await engine.ledgerSnapshot();
  assert.equal(before.balances[DEFAULT_PAYER.address] - after.balances[DEFAULT_PAYER.address], original.amountLamports);
  assert.equal(after.feesPaid - before.feesPaid, MOCK_FEE_LAMPORTS);
  model.finish(operation); assert.equal(model.busy, false);
  assert.throws(() => model.begin('pay', ctx), /xác nhận lại/);
});

test('cancel submits the reviewed snapshot and keeps principal and rent, including expired Open', async () => {
  const engine = new ReceiptRailMockEngine(), model = new ReceiptRailConfirmations(), ctx = context(DEFAULT_MERCHANT.address);
  engine.warpSlot(150n); ctx.slot = engine.currentSlot;
  const source = await invoice(engine), review = { ...source, invoiceId: new Uint8Array(source.invoiceId) };
  const before = await engine.ledgerSnapshot();
  model.confirm('cancel', review, ctx); review.expiresSlot = 999n; review.invoiceId.fill(0);
  const op = model.begin('cancel', ctx);
  await executeConfirmedOperation(engine, op); model.finish(op);
  assert.equal((await invoice(engine)).status, 'Cancelled');
  const after = await engine.ledgerSnapshot();
  assert.deepEqual(after.balances, before.balances); assert.deepEqual(after.rents, before.rents);
  assert.equal(after.rents[open], MOCK_RENT_LAMPORTS); assert.equal(after.feesPaid - before.feesPaid, MOCK_FEE_LAMPORTS);
});

test('wallet/selection change suppresses an in-flight result without unlocking a second submission', async () => {
  const engine = new ReceiptRailMockEngine(), model = new ReceiptRailConfirmations(), ctx = context();
  const inv = await invoice(engine); model.confirm('pay', inv, ctx);
  const op = model.begin('pay', ctx), running = executeConfirmedOperation(engine, op);
  const next = { ...ctx, walletIdentity: {}, selectedAddress: 'new' }; model.sync(next);
  assert.equal(model.isCurrent(op), false); assert.equal(model.busy, true);
  assert.throws(() => model.confirm('pay', inv, ctx), /đang xử lý/);
  model.finish({ ...op, id: op.id + 1 }); assert.equal(model.busy, true);
  await running; assert.equal(model.isCurrent(op), false);
  model.finish(op); assert.equal(model.busy, false);
});

test('read generations reject older detail/preview results and invalidate on context change or submission', async () => {
  const model = new ReceiptRailConfirmations(), ctx = context();
  const old = model.beginRead('data', ctx), preview = model.beginRead('preview', ctx);
  const newer = model.beginRead('data', ctx);
  assert.equal(model.isCurrentRead(old), false); assert.equal(model.isCurrentRead(newer), true);
  assert.equal(model.isCurrentRead(preview), true); // Independent channels.
  model.sync({ ...ctx, address: null });
  assert.equal(model.isCurrentRead(newer), false); assert.equal(model.isCurrentRead(preview), false);
  const current = model.beginRead('data', ctx);
  model.confirm('pay', await invoice(new ReceiptRailMockEngine()), ctx); model.begin('pay', ctx);
  assert.equal(model.isCurrentRead(current), false);
  const unmounted = model.beginRead('data', ctx); model.invalidate();
  assert.equal(model.isCurrentRead(unmounted), false);
});

test('SDK connector receives matching public key bytes; mock exposes no signing or sending', async () => {
  const raw = createMockWallet('ReceiptRail test public key', DEFAULT_PAYER.address), api = getWallets();
  const unregister = api.register(raw);
  try {
    const session = await createWalletStandardConnector(raw).connect();
    assert.equal(getAddressDecoder().decode(session.account.publicKey), DEFAULT_PAYER.address);
    assert.equal(receiptRailWallet(session).chainAllowed, true);
    for (const feature of ['signMessage', 'signTransaction', 'sendTransaction']) assert.equal(session[feature], undefined);
    raw.accounts[0].publicKey.fill(0);
    assert.equal(receiptRailWallet(session).chainAllowed, false);
    await session.disconnect(); assert.equal(receiptRailWallet(session).chainAllowed, false);
  } finally { unregister(); }
});

test('raw chain-only events invalidate approval even when SDK account callback is silent', async () => {
  const raw = createMockWallet('ReceiptRail test chains', DEFAULT_PAYER.address), api = getWallets();
  const unregister = api.register(raw), model = new ReceiptRailConfirmations();
  let calls = 0, sdkCalls = 0;
  const stop = watchReceiptRailWallets(() => { calls++; model.invalidate(); });
  try {
    const session = await createWalletStandardConnector(raw).connect();
    const offSdk = session.onAccountsChanged(() => sdkCalls++);
    const ctx = { ...context(), walletIdentity: session };
    model.confirm('pay', await invoice(new ReceiptRailMockEngine()), ctx);
    const before = calls;
    raw.setChains(['solana:mainnet']);
    assert.equal(calls, before + 1); assert.equal(sdkCalls, 0);
    assert.equal(receiptRailWallet(session).chainAllowed, false);
    assert.throws(() => model.begin('pay', ctx), /xác nhận lại/);
    raw.setChains(['solana:devnet']);
    assert.equal(receiptRailWallet(session).chainAllowed, true);
    assert.equal(model.has('pay', ctx), false); offSdk(); await session.disconnect();
  } finally { stop(); unregister(); }
});

test('SDK account switch, disconnect, register/unregister and listener cleanup invalidate safely', async () => {
  const raw = createMockWallet('ReceiptRail test accounts', DEFAULT_PAYER.address), api = getWallets();
  let calls = 0; const stop = watchReceiptRailWallets(() => calls++), unregister = api.register(raw);
  try {
    let session = await createWalletStandardConnector(raw).connect();
    const off = session.onAccountsChanged(accounts => { session = accounts.length ? { ...session, account: accounts[0] } : null; });
    raw.setAccountAddress(OTHER_WALLET.address);
    assert.equal(session.account.address, OTHER_WALLET.address);
    assert.equal(getAddressDecoder().decode(session.account.publicKey), OTHER_WALLET.address);
    assert.equal(receiptRailWallet(session).chainAllowed, true);
    await raw.features['standard:disconnect'].disconnect(); assert.equal(session, null);
    assert.equal(receiptRailWallet(session).chainAllowed, false); off();
    const before = calls; unregister(); assert.equal(calls, before + 1);
    stop(); const after = calls; raw.setChains(['solana:devnet']); assert.equal(calls, after);
  } finally { stop(); unregister(); }
});

test('rejected real SDK connect is handled without assuming every wallet uses error 4001', async () => {
  const raw = createMockWallet('ReceiptRail test rejection', DEFAULT_PAYER.address, true);
  await assert.rejects(createWalletStandardConnector(raw).connect(), error => /từ chối/.test(formatWalletError(error)));
  assert.match(formatWalletError(new Error('Request denied')), /từ chối/);
  assert.match(formatWalletError(new Error('Device unavailable')), /Device unavailable/);
  assert.equal(receiptRailWallet(null).chainAllowed, false);
});
