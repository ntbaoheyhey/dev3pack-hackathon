import test from 'node:test';
import assert from 'node:assert/strict';
import { assertPartialSmoke, assertInvoicePair, assertCancellationAccounting, broadcastOnce } from './cancel-recovery-guards.mjs';

function partial() {
  return { program: 'receipt', status: 'FAILED_OR_UNCONFIRMED_RECONCILE_BEFORE_RETRY',
    transactions: ['fund-two-actors', 'create-paid-invoice', 'pay-once', 'create-cancelled-invoice'].map((label, i) =>
      ({ label, signature: `signature${i}`, status: 'FINALIZED_SUCCESS', broadcastStarted: true, feeLamports: i === 0 ? 5000 : 10000 })),
    duplicate: { status: 'SIMULATED_NOT_SENT', signature: 'unsent-negative-simulation' } };
}
test('recovery accepts only the four completed operations and never a fifth or unresolved send', () => {
  assertPartialSmoke(partial(), 'receipt');
  for (const mutate of [r => r.transactions.pop(), r => r.transactions.push({ label: 'cancel-open-invoice' }),
    r => r.transactions[3].status = 'BROADCAST_STARTED', r => r.transactions.reverse(),
    r => r.transactions[3].signature = r.transactions[2].signature, r => r.program = 'other']) {
    const r = partial(); mutate(r); assert.throws(() => assertPartialSmoke(r, 'receipt'));
  }
});
test('recovery rejects a sent duplicate or changed fee history', () => {
  for (const mutate of [r => r.duplicate.status = 'BROADCAST_STARTED', r => r.duplicate.signature = 'signature0',
    r => r.transactions[0].feeLamports = 10000]) {
    const r = partial(); mutate(r); assert.throws(() => assertPartialSmoke(r, 'receipt'));
  }
});
const identity = { merchant: 'merchant', payer: 'payer' };
const smoke = { invoicePaid: 'paid', invoiceCancelled: 'cancel', expiresSlot: '1000' };
const paid = { address: 'paid', ...identity, amountLamports: 1_000_000n, expiresSlot: 1000n, status: 'Paid', paidSlot: 900n };
const open = { ...paid, address: 'cancel', status: 'Open', paidSlot: 0n };
test('cancel requires the original terms and Open state; expired Open remains cancellable', () => {
  assertInvoicePair(paid, open, identity, smoke, 'Open');
  for (const change of [{ status: 'Paid' }, { status: 'Cancelled' }, { amountLamports: 2n },
    { merchant: 'intruder' }, { payer: 'intruder' }, { expiresSlot: 1001n }, { address: 'another' }]) {
    assert.throws(() => assertInvoicePair(paid, { ...open, ...change }, identity, smoke, 'Open'));
  }
  assertInvoicePair(paid, { ...open, status: 'Cancelled' }, identity, smoke, 'Cancelled');
});
test('cancel reconciliation permits only the 10000 fee, preserves actors/rents and paid bytes', () => {
  const before = { feePayer: 100000, merchant: 4, payer: 2, paidInvoiceRent: 1, cancelInvoiceRent: 1, paidInvoiceBytes: 'unchanged' };
  const after = { ...before, feePayer: 90000 };
  assertCancellationAccounting(before, after);
  for (const key of ['feePayer', 'merchant', 'payer', 'paidInvoiceRent', 'cancelInvoiceRent']) {
    assert.throws(() => assertCancellationAccounting(before, { ...after, [key]: after[key] + 1 }));
  }
  assert.throws(() => assertCancellationAccounting(before, { ...after, paidInvoiceBytes: 'changed' }));
});

function broadcastHarness(overrides = {}) {
  const calls = [], entry = { status: 'SIGNED_NOT_SENT', signature: 'fixed-signature', broadcastStarted: false };
  const options = { entry,
    persistNew: async () => { calls.push(['exclusive', structuredClone(entry)]); },
    persist: async () => { calls.push(['persist', structuredClone(entry)]); },
    simulate: async () => { calls.push(['simulate']); return { err: null }; },
    send: async () => { calls.push(['send']); return entry.signature; }, ...overrides };
  return { calls, entry, options };
}
test('Cancel persists exact signature before simulation and broadcast; one send only', async () => {
  const h = broadcastHarness(); await broadcastOnce(h.options);
  assert.deepEqual(h.calls.map(c => c[0]), ['exclusive', 'simulate', 'persist', 'persist', 'send']);
  assert.equal(h.calls[0][1].signature, 'fixed-signature');
  assert.equal(h.calls[0][1].broadcastStarted, false);
  assert.equal(h.calls[3][1].broadcastStarted, true);
  assert.equal(h.calls[3][1].status, 'BROADCAST_STARTED');
  await assert.rejects(broadcastOnce(h.options));
  assert.equal(h.calls.filter(c => c[0] === 'send').length, 1);
});
test('existing journal or failed simulation never broadcasts', async () => {
  for (const overrides of [
    { persistNew: async () => { throw new Error('EEXIST'); } },
    { simulate: async () => ({ err: { InstructionError: [0, 'Custom'] } }) },
    { simulate: async () => { throw new Error('429'); } },
  ]) {
    const h = broadcastHarness(overrides); await assert.rejects(broadcastOnce(h.options));
    assert(!h.calls.some(c => c[0] === 'send')); assert.equal(h.entry.broadcastStarted, false);
  }
});
test('unknown send, wrong RPC signature and persistence failure cannot trigger an automatic resend', async () => {
  for (const wrongSignature of [false, true]) {
    let sends = 0;
    const h = broadcastHarness({ send: async () => { sends++; if (wrongSignature) return 'different'; throw new Error('timeout after possible send'); } });
    await assert.rejects(broadcastOnce(h.options));
    assert.equal(h.entry.status, 'BROADCAST_STARTED'); assert.equal(h.entry.signature, 'fixed-signature');
    await assert.rejects(broadcastOnce(h.options)); assert.equal(sends, 1);
  }
  const h = broadcastHarness({ persist: async () => { throw new Error('disk error'); } });
  await assert.rejects(broadcastOnce(h.options)); assert(!h.calls.some(c => c[0] === 'send'));
});
