// Finish exactly the remaining Cancel after the four finalized P4-B smoke transactions.
// Default is read-only. Reconciliation never loads signers or retries a send.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import { createReceiptRailClient, PROGRAM_ADDRESS } from '../../packages/receiptrail-client/index.mjs';
import { anchor, RPC, GENESIS, PAYER, CAP_LAMPORTS, FUNDING, sha256, assertBudget, programDataAddress, verifyDeployment, publicEnvelope, toWeb3Instruction, assertDuplicateSimulation } from './checks.mjs';
import { assertPartialSmoke, assertInvoicePair, assertCancellationAccounting, broadcastOnce } from './cancel-recovery-guards.mjs';

const args = process.argv.slice(2);
assert(args.length <= 1 && (!args.length || ['--inspect', '--send-approved', '--reconcile'].includes(args[0])), 'MODE_REQUIRED');
const mode = args[0] ?? '--inspect';
const root = new URL('../../', import.meta.url), dir = new URL('docs/evidence/phase4/', root);
const file = name => new URL(name, dir);
const read = name => JSON.parse(fs.readFileSync(file(name), 'utf8'));
const json = value => JSON.stringify(value, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2) + '\n';
const write = (name, value, options) => fs.writeFileSync(file(name), json(value), options);
const partial = read('smoke-r1-partial.json'), identity = read('deployment-identity.json');
const deployed = read('deployment-finalized.json'), deploymentCi = read('ci-deployment.json');
const partialHash = sha256(fs.readFileSync(file('smoke-r1-partial.json')));
assertPartialSmoke(partial, PROGRAM_ADDRESS);
assertDuplicateSimulation(partial.duplicate, PROGRAM_ADDRESS);
assert.equal(identity.program, PROGRAM_ADDRESS); assert.equal(identity.feePayer, PAYER.toBase58());
assert.equal(deployed.status, 'DEPLOY_FINALIZED_BYTECODE_VERIFIED');
assert.equal(deployed.program, PROGRAM_ADDRESS);
assert.equal(partial.payerBaselineLamports, deployed.payerBaselineLamports);
assert.equal(partial.genesis, GENESIS); assert.equal(partial.capLamports, CAP_LAMPORTS);
assert.equal(partial.merchant, identity.merchant); assert.equal(partial.payer, identity.payer);
// The only existing executable input changed for recovery is the test runner.
for (const [name, hash] of Object.entries(deploymentCi.inputHashes)) {
  if (name !== 'scripts/check-receiptrail-client.sh') assert.equal(sha256(fs.readFileSync(new URL(name, root))), hash, `DEPLOYED_INPUT_CHANGED:${name}`);
}
let ci;
if (mode !== '--inspect') {
  ci = read('ci-smoke-recovery.json');
  assert.equal(ci.status, 'PASSED'); assert.equal(ci.program, PROGRAM_ADDRESS);
  assert.equal(ci.run.headSha, ci.headSha); assert.equal(ci.run.conclusion, 'success');
  assert.deepEqual(ci.run.jobs.map(j => j.name).sort(), ['anchor-lab', 'research', 'web']);
  assert(ci.run.jobs.every(j => j.conclusion === 'success'));
  const required = [...Object.keys(deploymentCi.inputHashes), 'tools/receiptrail-devnet/cancel-recovery.mjs',
    'tools/receiptrail-devnet/cancel-recovery-guards.mjs', 'tools/receiptrail-devnet/cancel-recovery.test.mjs'];
  for (const name of required) assert.equal(sha256(fs.readFileSync(new URL(name, root))), ci.inputHashes[name], `RECOVERY_CI_INPUT_CHANGED:${name}`);
}
for (const name of ['upload-pending.json', 'smoke-pending.json']) assert(!fs.existsSync(file(name)), 'UNRESOLVED_ORIGINAL_JOURNAL');
const reportName = 'cancel-recovery.json', pendingName = 'cancel-recovery-pending.json';
let recovery = mode === '--reconcile' ? read(reportName) : null;
if (mode !== '--reconcile') {
  assert(!fs.existsSync(file(reportName)) && !fs.existsSync(file(pendingName)), 'RECOVERY_STARTED_USE_RECONCILE');
  assert.equal(sha256(fs.readFileSync(file('smoke.json'))), partialHash, 'ORIGINAL_SMOKE_CHANGED');
} else {
  assert.equal(recovery.partialSha256, partialHash); assert.equal(recovery.program, PROGRAM_ADDRESS);
  assert.equal(recovery.ciHead, ci.headSha);
  assert.equal(recovery.entry.label, 'cancel-open-invoice');
  assert.equal(read(pendingName).signature, recovery.entry.signature, 'JOURNAL_SIGNATURE_MISMATCH');
}
const binary = fs.readFileSync(new URL('target/receiptrail-spike/receiptrail.so', root));
assert.equal(sha256(binary), deployed.binarySha256);
const { PublicKey, Transaction, VersionedTransaction, SystemProgram } = anchor.web3;
const program = new PublicKey(PROGRAM_ADDRESS);
assert.equal(new Set([PROGRAM_ADDRESS, identity.merchant, identity.payer, identity.buffer, PAYER.toBase58()]).size, 5);
const c = new anchor.web3.Connection(RPC, { commitment: 'finalized', disableRetryOnRateLimit: true,
  fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(15000) }) });
async function readRpc(fn) {
  for (let attempt = 0; attempt < 4; attempt++) {
    await delay(2000 + attempt * 5000);
    try { return await fn(); } catch (error) {
      if (attempt === 3 || !/429|408|502|503|504|fetch failed|timeout|timed out/i.test(String(error))) throw error;
    }
  }
}
const codec = { encode: v => new PublicKey(v).toBytes(), decode: v => new PublicKey(v).toBase58() };
const client = createReceiptRailClient({ addressCodec: codec, derivePda: ({ programAddress, seeds }) => {
  const [address, bump] = PublicKey.findProgramAddressSync(seeds.map(s => Buffer.from(s)), new PublicKey(programAddress));
  return [address.toBase58(), bump];
} });
async function snapshot(expectedStatus) {
  const keys = [PAYER, program, programDataAddress(program), new PublicKey(identity.buffer), new PublicKey(identity.merchant),
    new PublicKey(identity.payer), new PublicKey(partial.invoicePaid), new PublicKey(partial.invoiceCancelled)];
  const { value: a, context } = await readRpc(() => c.getMultipleAccountsInfoAndContext(keys, { commitment: 'finalized' }));
  verifyDeployment({ program: PROGRAM_ADDRESS, authority: PAYER.toBase58(), binary, programAccount: a[1], dataAccount: a[2] });
  assert.equal(a[3], null, 'BUFFER_NOT_CONSUMED');
  for (const account of [a[0], a[4], a[5]]) assert(account && account.owner.equals(SystemProgram.programId) && !account.executable && account.data.length === 0, 'ACTOR_ACCOUNT_CHANGED');
  const paid = await client.decodeInvoice(publicEnvelope(partial.invoicePaid, a[6]));
  const otherEnvelope = publicEnvelope(partial.invoiceCancelled, a[7]);
  const other = await client.decodeInvoice(otherEnvelope);
  assertInvoicePair(paid, other, identity, partial, expectedStatus);
  for (const [invoice, label] of [[paid, 'paid'], [other, 'cancelled']]) {
    assert.equal(Buffer.from(invoice.invoiceId).toString('hex'), sha256(`${PROGRAM_ADDRESS}:${identity.merchant}:phase4-${label}-v1`));
  }
  return { slot: context.slot, paid, other, otherEnvelope, balances: { feePayer: a[0].lamports, merchant: a[4].lamports,
    payer: a[5].lamports, paidInvoiceRent: a[6].lamports, cancelInvoiceRent: a[7].lamports, paidInvoiceBytes: a[6].data.toString('hex') } };
}
async function checkHistory(extra = []) {
  const expected = [...deployed.signatures, ...partial.transactions.map(t => t.signature), ...extra];
  const history = await readRpc(() => c.getSignaturesForAddress(PAYER, { limit: 300 }, 'finalized'));
  const firstSlot = Math.min(...deployed.transactions.map(t => t.slot));
  const relevant = history.filter(t => t.slot >= firstSlot);
  assert.equal(relevant.length, expected.length, 'UNEXPECTED_FEE_PAYER_ACTIVITY');
  assert(relevant.every(t => expected.includes(t.signature) && t.err === null));
}
async function reconcile() {
  const entry = recovery.entry;
  let status;
  for (let i = 0; i < 25; i++) {
    status = (await readRpc(() => c.getSignatureStatuses([entry.signature], { searchTransactionHistory: true }))).value[0];
    assert(!status?.err, 'CANCEL_FAILED_KEEP_JOURNAL');
    if (status?.confirmationStatus === 'finalized') break;
  }
  assert.equal(status?.confirmationStatus, 'finalized', 'CANCEL_UNKNOWN_KEEP_JOURNAL_NO_RESEND');
  const tx = await readRpc(() => c.getTransaction(entry.signature, { commitment: 'finalized', maxSupportedTransactionVersion: 0 }));
  assert(tx?.meta && tx.meta.err === null && tx.meta.fee === 10000, 'INVALID_CANCEL_META');
  const m = tx.transaction.message;
  assert(m.accountKeys[0].equals(PAYER));
  assert.equal(m.instructions.length, 1); assert(m.accountKeys[m.instructions[0].programIdIndex].equals(program));
  assert.equal(tx.meta.preBalances[0] - tx.meta.postBalances[0], 10000);
  const after = await snapshot('Cancelled');
  assertCancellationAccounting(recovery.before, after.balances);
  await checkHistory([entry.signature]);
  assert.equal((await readRpc(() => c.getSignatureStatuses([partial.duplicate.signature], { searchTransactionHistory: true }))).value[0], null, 'DUPLICATE_WAS_SENT');
  Object.assign(entry, { status: 'FINALIZED_SUCCESS', slot: status.slot, feeLamports: tx.meta.fee, logs: tx.meta.logMessages,
    computeUnitsConsumed: tx.meta.computeUnitsConsumed, transactionJsonSha256: sha256(JSON.stringify(tx)) });
  recovery.status = 'FINALIZED_CANCEL_RECOVERED'; recovery.after = after.balances; recovery.endedAt = new Date().toISOString();
  write(reportName, recovery);
  const smoke = { ...partial, status: 'FINALIZED_SMOKE_VERIFIED', transactions: [...partial.transactions, entry],
    recovery: { file: reportName, partialFile: 'smoke-r1-partial.json', partialSha256: partialHash, ciHead: ci.headSha },
    errorHistory: [partial.error], endedAt: recovery.endedAt,
    final: { paid: after.paid, cancelled: after.other, payerLamports: after.balances.feePayer,
      budget: assertBudget({ baseline: deployed.payerBaselineLamports, balance: after.balances.feePayer, nextDebit: 0 }), smokeFeesLamports: 45000 } };
  delete smoke.error; write('smoke.json', smoke);
  fs.unlinkSync(file(pendingName));
  console.log(JSON.stringify({ status: recovery.status, signature: entry.signature, slot: entry.slot, smokeTransactions: smoke.transactions.length }));
}
try {
  assert.equal(await readRpc(() => c.getGenesisHash()), GENESIS, 'NOT_DEVNET');
  const statuses = (await readRpc(() => c.getSignatureStatuses(partial.transactions.map(t => t.signature), { searchTransactionHistory: true }))).value;
  assert(statuses.every(s => s?.confirmationStatus === 'finalized' && s.err === null), 'PRIOR_TX_NOT_FINALIZED');
  for (const entry of partial.transactions) {
    const tx = await readRpc(() => c.getTransaction(entry.signature, { commitment: 'finalized', maxSupportedTransactionVersion: 0 }));
    assert(tx?.meta && tx.meta.err === null); assert.equal(tx.slot, entry.slot);
    assert(tx.transaction.message.accountKeys[0].equals(PAYER)); assert.equal(tx.meta.fee, entry.feeLamports);
    assert.deepEqual(tx.meta.logMessages, entry.logs);
    assert.equal(tx.meta.preBalances[0] - tx.meta.postBalances[0], entry.feeLamports + (entry.label === 'fund-two-actors' ? 7000000 : 0));
  }
  if (mode === '--reconcile') {
    await reconcile();
  } else {
    await checkHistory();
    const before = await snapshot('Open');
    const b = before.balances;
    assert.equal(b.feePayer, deployed.accounting.finalPayerLamports - 7035000);
    assert.equal(b.merchant, FUNDING.merchant + 1000000 - b.paidInvoiceRent - b.cancelInvoiceRent);
    assert.equal(b.payer, FUNDING.payer - 1000000);
    assertBudget({ baseline: deployed.payerBaselineLamports, balance: b.feePayer, nextDebit: 10000, reserve: 60000 });
    assert.equal((await readRpc(() => c.getSignatureStatuses([partial.duplicate.signature], { searchTransactionHistory: true }))).value[0], null, 'DUPLICATE_WAS_SENT');
    if (mode === '--inspect') {
      const inspection = { status: 'INSPECTED_CANCEL_ONLY_NO_SIGN_SEND', at: new Date().toISOString(), program: PROGRAM_ADDRESS,
        partialSha256: partialHash, slot: before.slot, balances: b, expectedAdditionalFee: 10000 };
      write('cancel-recovery-inspection.json', inspection); console.log(json(inspection));
    } else {
      const ix = await client.cancelInvoiceInstruction({ account: before.otherEnvelope, signer: identity.merchant, confirmedTerms: before.other });
      const block = await readRpc(() => c.getLatestBlockhash('confirmed'));
      const tx = new Transaction({ feePayer: PAYER, recentBlockhash: block.blockhash }).add(toWeb3Instruction(ix));
      const message = tx.compileMessage();
      assert.equal((await readRpc(() => c.getFeeForMessage(message, 'confirmed'))).value, 10000, 'FEE_CHANGED');
      assert.equal(await readRpc(() => c.getBalance(PAYER, 'finalized')), b.feePayer, 'BALANCE_CHANGED');
      function loadSigner(relative, expected) {
        const filename = path.join(os.homedir(), '.local/share/dev3pack/devnet', relative);
        assert(fs.lstatSync(filename).isFile() && (fs.statSync(filename).mode & 0o777) === 0o600, 'KEY_FILE_MODE');
        assert((fs.statSync(path.dirname(filename)).mode & 0o777) === 0o700, 'KEY_DIRECTORY_MODE');
        const bytes = Uint8Array.from(JSON.parse(fs.readFileSync(filename, 'utf8')));
        const signer = anchor.web3.Keypair.fromSecretKey(Uint8Array.from(bytes)); bytes.fill(0);
        assert.equal(signer.publicKey.toBase58(), expected, 'KEY_PUBLIC_MISMATCH'); return signer;
      }
      const signers = [loadSigner('payer-keypair.json', PAYER.toBase58()), loadSigner('receiptrail/merchant-keypair.json', identity.merchant)];
      const signed = new VersionedTransaction(message);
      try { signed.sign(signers); } finally { for (const signer of signers) signer.secretKey.fill(0); }
      assert(Transaction.from(signed.serialize()).verifySignatures(), 'INVALID_SIGNATURE');
      const entry = { label: 'cancel-open-invoice', signature: anchor.utils.bytes.bs58.encode(signed.signatures[0]), ...block,
        feeQuoteLamports: 10000, status: 'SIGNED_NOT_SENT', broadcastStarted: false };
      recovery = { at: new Date().toISOString(), program: PROGRAM_ADDRESS, partialSha256: partialHash, ciHead: ci.headSha,
        status: 'RUNNING', before: b, entry };
      await broadcastOnce({ entry,
        persistNew: () => { write(pendingName, entry, { flag: 'wx' }); write(reportName, recovery, { flag: 'wx' }); },
        persist: () => { write(pendingName, entry); write(reportName, recovery); },
        simulate: async () => (await readRpc(() => c.simulateTransaction(signed, { commitment: 'confirmed', sigVerify: true }))).value,
        send: async () => { await delay(2000); return c.sendRawTransaction(signed.serialize(), { skipPreflight: false, preflightCommitment: 'confirmed', maxRetries: 0 }); },
      });
      await reconcile();
    }
  }
} catch (error) {
  if (recovery && fs.existsSync(file(reportName))) { recovery.status = 'RECOVERY_INCOMPLETE_RECONCILE_ONLY'; recovery.error = error.message; write(reportName, recovery); }
  throw error;
}
