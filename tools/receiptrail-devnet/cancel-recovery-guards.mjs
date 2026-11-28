import assert from 'node:assert/strict';

const labels = ['fund-two-actors', 'create-paid-invoice', 'pay-once', 'create-cancelled-invoice'];
export function assertPartialSmoke(smoke, program) {
  assert.equal(smoke.program, program);
  assert.equal(smoke.status, 'FAILED_OR_UNCONFIRMED_RECONCILE_BEFORE_RETRY');
  assert.equal(smoke.transactions.length, 4, 'EXACTLY_FOUR_COMPLETED_OPERATIONS_REQUIRED');
  assert.deepEqual(smoke.transactions.map(t => t.label), labels, 'UNEXPECTED_OPERATION_ORDER');
  assert.equal(new Set(smoke.transactions.map(t => t.signature)).size, 4, 'DUPLICATE_SIGNATURE');
  for (const t of smoke.transactions) {
    assert.equal(t.status, 'FINALIZED_SUCCESS', 'UNRESOLVED_PRIOR_TRANSACTION');
    assert.equal(t.broadcastStarted, true);
    assert.equal(t.feeLamports, t.label === 'fund-two-actors' ? 5000 : 10000);
  }
  assert.equal(smoke.duplicate?.status, 'SIMULATED_NOT_SENT');
  assert(!smoke.transactions.some(t => t.signature === smoke.duplicate.signature));
}

export function assertInvoicePair(paid, other, identity, smoke, expectedOtherStatus) {
  assert.equal(paid.status, 'Paid');
  assert.equal(other.status, expectedOtherStatus, 'CANCEL_TARGET_NOT_IN_EXPECTED_STATE');
  assert.equal(paid.address, smoke.invoicePaid); assert.equal(other.address, smoke.invoiceCancelled);
  for (const invoice of [paid, other]) {
    assert.equal(invoice.merchant, identity.merchant);
    assert.equal(invoice.payer, identity.payer);
    assert.equal(invoice.amountLamports, 1_000_000n);
    assert.equal(invoice.expiresSlot, BigInt(smoke.expiresSlot));
  }
  assert.equal(other.paidSlot, 0n);
}

export function assertCancellationAccounting(before, after) {
  assert.equal(before.feePayer - after.feePayer, 10000, 'CANCEL_DEBIT_MUST_ONLY_BE_FEE');
  for (const key of ['merchant', 'payer', 'paidInvoiceRent', 'cancelInvoiceRent']) {
    assert.equal(before[key], after[key], `UNEXPECTED_CANCEL_BALANCE_CHANGE:${key}`);
  }
  assert.equal(before.paidInvoiceBytes, after.paidInvoiceBytes, 'PAID_INVOICE_CHANGED');
}

// Persist the signature BEFORE any send. A failed/unknown send never gets retried here.
// The caller supplies the already signed bytes; this function cannot sign or regenerate them.
export async function broadcastOnce({ entry, persistNew, persist, simulate, send }) {
  assert.equal(entry.status, 'SIGNED_NOT_SENT');
  assert.equal(entry.broadcastStarted, false);
  await persistNew(); // exclusive creation must reject any pre-existing journal
  entry.simulation = await simulate();
  await persist();
  assert.equal(entry.simulation.err, null, 'SIMULATION_FAILED_NOT_SENT');
  entry.broadcastStarted = true;
  entry.status = 'BROADCAST_STARTED';
  await persist();
  assert.equal(await send(), entry.signature, 'RPC_SIGNATURE_MISMATCH_RECONCILE');
}
