// CLI/source review only. No browser, wallet signature or network request.
// Exit 1 denotes reproduced acceptance failures, not a passing product test.
import assert from 'node:assert/strict';
import { ReceiptRailMockEngine, DEFAULT_MERCHANT, DEFAULT_PAYER, parseExpiryDelta } from '../../apps/web/src/receiptrail/adapter.ts';
import { createMockWallet } from '../../apps/web/src/receiptrail/mock-wallets.ts';
import { createWalletStandardConnector } from '../../apps/web/node_modules/@solana/client/dist/index.node.mjs';
import { getAddressDecoder } from '../../apps/web/node_modules/@solana/addresses/dist/index.node.mjs';

globalThis.fetch = async () => { throw new Error('NETWORK_FORBIDDEN_IN_LOCAL_REVIEW'); };
const open = 'EpQUeEpGPoZrDoffujf86a3GnKdBkX7RbvsbXkkfpodo';
const cancelled = '5BWMrebjJNr2yANMqzXSwdFjErkxT24TBqDHYjLvEv66';
const observations = [];
const payInput = async engine => ({ invoiceAddress: open, signer: DEFAULT_PAYER.address, confirmedTerms: (await engine.inspect(open)).invoice });

{
  const engine = new ReceiptRailMockEngine();
  const input = await payInput(engine);
  const results = await Promise.allSettled([engine.payInvoice(input), engine.payInvoice(input)]);
  observations.push({ case: 'concurrent-pay', expected: 'Exactly one submission succeeds', actual: results, accepted: results.filter(r => r.status === 'fulfilled').length === 1 });
}
{
  const engine = new ReceiptRailMockEngine();
  const input = await payInput(engine);
  const results = await Promise.allSettled([engine.payInvoice(input), engine.cancelInvoice({ ...input, signer: DEFAULT_MERCHANT.address })]);
  observations.push({ case: 'concurrent-pay-cancel', expected: 'One terminal transition; the second operation rejects', actual: { results, finalState: (await engine.inspect(open)).invoice.status }, accepted: results.filter(r => r.status === 'fulfilled').length === 1 });
}
{
  const engine = new ReceiptRailMockEngine();
  const input = { merchant: DEFAULT_MERCHANT.address, payer: DEFAULT_PAYER.address, invoiceId: new Uint8Array(32).fill(0x7d), amountLamports: 1n, expiresSlot: 200n };
  const results = await Promise.allSettled([engine.createInvoice(input), engine.createInvoice({ ...input, amountLamports: 2n })]);
  observations.push({ case: 'concurrent-create', expected: 'Exactly one create; immutable terms', actual: results, accepted: results.filter(r => r.status === 'fulfilled').length === 1 });
}
{
  const engine = new ReceiptRailMockEngine();
  const input = await payInput(engine);
  engine.simulatedFault = 'timeout_unknown';
  const submission = await engine.payInvoice(input);
  const before = await engine.getAccount(open);
  engine.warpSlot(150n);
  const result = await engine.recheckOnChain(open);
  const after = await engine.getAccount(open);
  observations.push({ case: 'recheck-is-observational', expected: 'Recheck observes the ledger outcome determined by submission; it does not create Paid', actual: { submission, result, accountBytesChangedByRead: !Buffer.from(before.data).equals(Buffer.from(after.data)), paidSlot: (await engine.inspect(open)).invoice.paidSlot }, accepted: Buffer.from(before.data).equals(Buffer.from(after.data)) });
}
{
  const engine = new ReceiptRailMockEngine();
  const submission = await engine.payInvoice(await payInput(engine));
  const other = await engine.recheckOnChain(cancelled);
  observations.push({ case: 'signature-scoped-to-invoice', expected: 'A seeded Cancelled invoice must not inherit another invoice payment signature', actual: { paidInvoice: open, paidSignature: submission.signature, inspectedInvoice: cancelled, result: other }, accepted: other.signature !== submission.signature });
}
{
  const wallet = createMockWallet('Review mock', DEFAULT_PAYER.address);
  const connector = createWalletStandardConnector(wallet);
  const session = await connector.connect(); // Production SDK connector, no DOM/browser.
  const publicKeyAddress = getAddressDecoder().decode(session.account.publicKey);
  observations.push({ case: 'mock-wallet-public-key', expected: 'WalletAccount publicKey encodes its address', actual: { address: session.account.address, publicKeyAddress, connectorAccepted: true }, accepted: publicKeyAddress === session.account.address });
  await session.disconnect();
  assert.equal(wallet.accounts.length, 0);
}
{
  let rejected = false;
  try { parseExpiryDelta('18446744073709551616'); } catch { rejected = true; }
  observations.push({ case: 'expiry-delta-u64', expected: 'Reject a delta beyond u64 before confirmation', actual: { rejected }, accepted: rejected });
}
console.log(JSON.stringify({ reviewedSource: '69e458acd2f14df6c94b1ae2d1a0c5b4d60e563c', scope: 'CLI production adapter and SDK connector only; no UI/browser/extension evidence', observations }, (_, value) => typeof value === 'bigint' ? value.toString() : value, 2));
process.exitCode = observations.every(o => o.accepted) ? 0 : 1;
