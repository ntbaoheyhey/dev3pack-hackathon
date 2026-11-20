// Read-only, checkpointed verification. Never loads a signer or broadcasts.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import { PROGRAM_ADDRESS, createReceiptRailClient } from '../../packages/receiptrail-client/index.mjs';
import { anchor, RPC, GENESIS, PAYER, LOADER, CAP_LAMPORTS, sha256, assertBudget, programDataAddress, verifyDeployment, publicEnvelope } from './checks.mjs';
const args = process.argv.slice(2);
assert(args.length === 1 && ['--deployment', '--all'].includes(args[0]), 'MODE_REQUIRED');
const all = args[0] === '--all';
const root = new URL('../../', import.meta.url), dir = new URL('docs/evidence/phase4/', root);
const read = name => JSON.parse(fs.readFileSync(new URL(name, dir), 'utf8'));
const identity = read('deployment-identity.json'), ci = read('ci-deployment.json'), upload = read('upload.json'), deploy = read('deploy-cli.json');
assert.equal(ci.status, 'PASSED'); assert.equal(ci.program, PROGRAM_ADDRESS); assert.equal(identity.program, PROGRAM_ADDRESS);
assert.equal(upload.status, 'FINALIZED_BUFFER_VERIFIED'); assert.equal(upload.program, PROGRAM_ADDRESS);
assert.equal(deploy.status, 'CLI_SUCCESS_PENDING_FINALIZED_VERIFICATION'); assert.equal(deploy.result.programId, PROGRAM_ADDRESS);
const binary = fs.readFileSync(new URL('target/receiptrail-spike/receiptrail.so', root));
assert.equal(sha256(binary), ci.localBinarySha256); assert.equal(sha256(binary), upload.binarySha256);
const smoke = all ? read('smoke.json') : null;
if (smoke) { assert.equal(smoke.status, 'FINALIZED_SMOKE_VERIFIED'); assert.equal(smoke.program, PROGRAM_ADDRESS); }
for (const name of ['upload-pending.json', 'smoke-pending.json']) assert(!fs.existsSync(new URL(name, dir)), 'PENDING_JOURNAL_RECONCILE_FIRST');
const signatures = [...upload.transactions.map(t => t.signature), deploy.result.signature, ...(smoke?.transactions.map(t => t.signature) ?? [])];
assert.equal(new Set(signatures).size, signatures.length);
const { PublicKey, SystemProgram, ComputeBudgetProgram } = anchor.web3;
const program = new PublicKey(PROGRAM_ADDRESS), buffer = new PublicKey(identity.buffer);
const c = new anchor.web3.Connection(RPC, { commitment: 'finalized', disableRetryOnRateLimit: true,
  fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(15000) }) });
async function readRpc(fn) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try { return await fn(); } catch (error) { if (attempt === 3) throw error; await delay(5000 * (attempt + 1)); }
  }
}
assert.equal(await readRpc(() => c.getGenesisHash()), GENESIS, 'NOT_DEVNET');
const statuses = (await readRpc(() => c.getSignatureStatuses(signatures, { searchTransactionHistory: true }))).value;
assert(statuses.every(s => s?.confirmationStatus === 'finalized' && s.err === null), 'NOT_ALL_FINALIZED_SUCCESS');
const name = all ? 'final-verification.json' : 'deployment-finalized.json', destination = new URL(name, dir);
let record;
if (fs.existsSync(destination)) {
  record = read(name); assert.equal(record.program, PROGRAM_ADDRESS); assert.equal(record.binarySha256, sha256(binary));
  assert.deepEqual(record.signatures, signatures);
  assert(!['P4_B_VERIFIED_FINALIZED_WITHIN_CAP', 'DEPLOY_FINALIZED_BYTECODE_VERIFIED'].includes(record.status), 'ALREADY_VERIFIED');
} else {
  const previous = all ? read('deployment-finalized.json') : null;
  if (previous) { assert.equal(previous.status, 'DEPLOY_FINALIZED_BYTECODE_VERIFIED'); assert.deepEqual(previous.signatures, signatures.slice(0, previous.signatures.length)); }
  record = { startedAt: new Date().toISOString(), status: 'VERIFYING_FINALIZED', program: PROGRAM_ADDRESS, genesis: GENESIS, ciHead: ci.headSha,
    payerBaselineLamports: upload.payerBaselineLamports, binarySha256: sha256(binary), capLamports: CAP_LAMPORTS, signatures,
    transactions: previous?.transactions ?? [] };
  fs.writeFileSync(destination, JSON.stringify(record, null, 2) + '\n', { flag: 'wx' });
}
assert.deepEqual(record.transactions.map(t => t.signature), signatures.slice(0, record.transactions.length), 'INVALID_CHECKPOINT');
const save = () => fs.writeFileSync(destination, JSON.stringify(record, null, 2) + '\n');
try {
  for (const signature of signatures.slice(record.transactions.length)) {
    await delay(1500);
    const tx = await readRpc(() => c.getTransaction(signature, { commitment: 'finalized', maxSupportedTransactionVersion: 0 }));
    assert(tx?.meta && tx.meta.err === null, 'MISSING_SUCCESS_META');
    const m = tx.transaction.message; assert(m.accountKeys[0].equals(PAYER));
    const invoked = m.instructions.map(ix => m.accountKeys[ix.programIdIndex].toBase58());
    assert(invoked.every(p => [LOADER, program, SystemProgram.programId, ComputeBudgetProgram.programId].some(a => a.toBase58() === p)));
    for (const ix of m.instructions) if (m.accountKeys[ix.programIdIndex].equals(ComputeBudgetProgram.programId)) {
      const data = Buffer.from(anchor.utils.bytes.bs58.decode(ix.data)); if (data[0] === 3) assert.equal(data.readBigUInt64LE(1), 0n);
    }
    assert.equal(tx.meta.fee, m.header.numRequiredSignatures * 5000, 'UNEXPECTED_FEE');
    record.transactions.push({ signature, slot: tx.slot, confirmationStatus: 'finalized', err: tx.meta.err, feeLamports: tx.meta.fee,
      payerDebitLamports: tx.meta.preBalances[0] - tx.meta.postBalances[0], computeUnitsConsumed: tx.meta.computeUnitsConsumed,
      programs: invoked, transactionJsonSha256: sha256(JSON.stringify(tx)) }); save();
    if (record.transactions.length % 20 === 0) console.log(JSON.stringify({ verified: record.transactions.length, total: signatures.length }));
  }
  const addresses = [PAYER, program, programDataAddress(program), buffer, new PublicKey(identity.merchant), new PublicKey(identity.payer)];
  if (smoke) addresses.push(new PublicKey(smoke.invoicePaid), new PublicKey(smoke.invoiceCancelled));
  const state = await readRpc(() => c.getMultipleAccountsInfoAndContext(addresses, { commitment: 'finalized' }));
  record.deployment = verifyDeployment({ program: PROGRAM_ADDRESS, authority: PAYER.toBase58(), binary, programAccount: state.value[1], dataAccount: state.value[2] });
  assert.equal(state.value[3], null, 'BUFFER_NOT_CONSUMED');
  if (!smoke) assert(state.value.slice(4).every(a => a === null), 'ACTORS_ALREADY_FUNDED');
  const fees = record.transactions.reduce((n, t) => n + t.feeLamports, 0);
  const summedDebit = record.transactions.reduce((n, t) => n + t.payerDebitLamports, 0);
  const held = state.value.slice(1).reduce((n, a) => n + (a?.lamports ?? 0), 0);
  const debit = upload.payerBaselineLamports - state.value[0].lamports;
  assert.equal(debit, held + fees); assert.equal(summedDebit, debit);
  assertBudget({ baseline: upload.payerBaselineLamports, balance: state.value[0].lamports, nextDebit: 0 });
  const history = await readRpc(() => c.getSignaturesForAddress(PAYER, { limit: 300 }, 'finalized'));
  const relevant = history.filter(t => t.slot >= Math.min(...record.transactions.map(t => t.slot)));
  assert.equal(relevant.length, signatures.length, 'UNEXPECTED_FEE_PAYER_ACTIVITY'); assert(relevant.every(t => signatures.includes(t.signature)));
  if (smoke) {
    const client = createReceiptRailClient({ addressCodec: { encode: value => new PublicKey(value).toBytes(), decode: value => new PublicKey(value).toBase58() },
      derivePda: ({ programAddress, seeds }) => { const [key, bump] = PublicKey.findProgramAddressSync(seeds.map(s => Buffer.from(s)), new PublicKey(programAddress)); return [key.toBase58(), bump]; } });
    const paid = await client.decodeInvoice(publicEnvelope(smoke.invoicePaid, state.value[6]));
    const cancelled = await client.decodeInvoice(publicEnvelope(smoke.invoiceCancelled, state.value[7]));
    assert.equal(paid.status, 'Paid'); assert.equal(cancelled.status, 'Cancelled');
    for (const invoice of [paid, cancelled]) { assert.equal(invoice.merchant, identity.merchant); assert.equal(invoice.payer, identity.payer); assert.equal(invoice.amountLamports, 1_000_000n); }
    record.invoices = { paid: smoke.invoicePaid, paidStatus: paid.status, cancelled: smoke.invoiceCancelled, cancelledStatus: cancelled.status };
    assert.equal((await readRpc(() => c.getSignatureStatuses([smoke.duplicate.signature], { searchTransactionHistory: true }))).value[0], null, 'DUPLICATE_WAS_BROADCAST');
  }
  record.accounting = { initialPayerLamports: upload.payerBaselineLamports, finalPayerLamports: state.value[0].lamports,
    totalFeesLamports: fees, totalHeldInAccountsLamports: held, totalPayerDebitLamports: debit, summedTransactionPayerDebitsLamports: summedDebit,
    remainingUnderCapLamports: CAP_LAMPORTS - debit, unexpectedTransactions: 0 };
  record.observationSlot = state.context.slot; record.completedAt = new Date().toISOString();
  record.status = all ? 'P4_B_VERIFIED_FINALIZED_WITHIN_CAP' : 'DEPLOY_FINALIZED_BYTECODE_VERIFIED'; save();
  console.log(JSON.stringify({ status: record.status, transactions: signatures.length, accounting: record.accounting }));
} catch (error) { record.status = 'VERIFICATION_INCOMPLETE_READ_ONLY_RESUME'; record.error = error.message; save(); throw error; }
