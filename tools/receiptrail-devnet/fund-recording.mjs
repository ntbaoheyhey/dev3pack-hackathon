import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import { anchor, RPC, GENESIS } from './checks.mjs';
import { entries, append, identity, loadSigner } from './recording-files.mjs';
import { reserve } from './recording-guard.mjs';
const { PublicKey, Connection, Transaction, SystemProgram, VersionedTransaction } = anchor.web3;
const rpc = new Connection(RPC, 'confirmed');
assert.equal(await rpc.getGenesisHash(), GENESIS);
const prior = entries();
let receipt = prior.find(e => e.action === 'fund');
if (!receipt) {
  assert(prior.every(e => e.action === 'fund-invalid-local' && e.reserved === 0), 'Reconcile previous recording entries first.');
  const funding = new PublicKey(identity.feePayer);
  const block = await rpc.getLatestBlockhash('confirmed');
  const tx = new Transaction({ feePayer: funding, recentBlockhash: block.blockhash });
  const transfers = [];
  for (const [role, target] of [['merchant', 10000000], ['payer', 5000000]]) {
    const recipient = new PublicKey(identity[role]);
    const lamports = Math.max(0, target - await rpc.getBalance(recipient, 'finalized'));
    if (lamports) { transfers.push({ role, address: identity[role], lamports }); tx.add(SystemProgram.transfer({ fromPubkey: funding, toPubkey: recipient, lamports })); }
  }
  if (!transfers.length) { console.log('Both recording accounts are already funded.'); process.exit(0); }
  const amount = transfers.reduce((sum, t) => sum + t.lamports, 0);
  assert(amount <= 15000000);
  const fee = (await rpc.getFeeForMessage(tx.compileMessage())).value;
  assert(Number.isSafeInteger(fee) && fee > 0 && fee <= 20000);
  reserve(prior, amount + fee);
  assert(await rpc.getBalance(funding, 'finalized') > amount + fee);
  const simulation = await rpc.simulateTransaction(new VersionedTransaction(tx.compileMessage()), { sigVerify: false, commitment: 'confirmed' });
  assert.equal(simulation.value.err, null);
  if (!process.argv.includes('--send')) { console.log(JSON.stringify({ transfers, fee, action: 'quote' })); process.exit(0); }
  tx.sign(loadSigner('feePayer'));
  const serialized = tx.serialize();
  const signature = anchor.utils.bytes.bs58.encode(tx.signature);
  receipt = { action: 'fund', at: new Date().toISOString(), transfers, fee, reserved: amount + fee, signature, ...block };
  append(receipt);
  assert.equal(await rpc.sendRawTransaction(serialized, { maxRetries: 0 }), signature);
}
for (let i = 0; i < 45; i++) {
  const status = (await rpc.getSignatureStatuses([receipt.signature], { searchTransactionHistory: true })).value[0];
  assert(!status?.err);
  if (status?.confirmationStatus === 'finalized') { console.log('Funding finalized', receipt.signature); process.exit(0); }
  await delay(1100);
}
throw Error('Funding pending. Re-run to check the existing signature.');
