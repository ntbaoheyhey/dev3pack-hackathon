// Explicitly gated CLI smoke. Never imported by the frontend.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { createReceiptRailClient, PROGRAM_ADDRESS } from '../../packages/receiptrail-client/index.mjs';
import { getPayInvoiceInstruction } from '../../packages/receiptrail-client/generated.mjs';
import { anchor, RPC, GENESIS, PAYER, CAP_LAMPORTS, FUNDING, sha256, assertBudget, programDataAddress, verifyDeployment, publicEnvelope, toWeb3Instruction, assertDuplicateSimulation } from './checks.mjs';

const root = new URL('../../', import.meta.url);
const evidence = new URL('docs/evidence/phase4/', root);
const read = name => JSON.parse(fs.readFileSync(new URL(name, evidence), 'utf8'));
const args = process.argv.slice(2);
assert(args.length === 1 && ['--inspect', '--send-approved'].includes(args[0]), 'Usage: node tools/receiptrail-devnet/smoke.mjs --inspect|--send-approved');
const send = args[0] === '--send-approved';
const identity = read('deployment-identity.json');
const deployment = read('deployment-finalized.json');
const ci = read('ci-deployment.json');
assert.equal(identity.program, PROGRAM_ADDRESS, 'IDENTITY_IDL_MISMATCH');
assert.equal(identity.feePayer, PAYER.toBase58());
assert.equal(ci.status, 'PASSED');
assert.equal(ci.program, PROGRAM_ADDRESS);
assert.equal(deployment.status, 'DEPLOY_FINALIZED_BYTECODE_VERIFIED');
assert.equal(deployment.program, PROGRAM_ADDRESS);
for (const [file, expected] of Object.entries(ci.inputHashes)) assert.equal(sha256(fs.readFileSync(new URL(file, root))), expected, `CI_INPUT_CHANGED:${file}`);
assert(Object.hasOwn(ci.inputHashes, 'programs/receiptrail/src/lib.rs'));
assert(Object.hasOwn(ci.inputHashes, 'tools/receiptrail-devnet/smoke.mjs'));
const binary = fs.readFileSync(new URL('target/receiptrail-spike/receiptrail.so', root));
assert.equal(sha256(binary), deployment.binarySha256);
const { PublicKey, Transaction, VersionedTransaction, SystemProgram } = anchor.web3;
const c = new anchor.web3.Connection(RPC, { commitment: 'finalized', disableRetryOnRateLimit: true,
  fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(15000) }),
});
assert.equal(await c.getGenesisHash(), GENESIS, 'NOT_DEVNET');
const program = new PublicKey(PROGRAM_ADDRESS);
const merchant = new PublicKey(identity.merchant);
const payer = new PublicKey(identity.payer);
assert.equal(new Set([program.toBase58(), merchant.toBase58(), payer.toBase58(), identity.buffer, PAYER.toBase58()]).size, 5, 'ALIASED_IDENTITIES');
const accounts = await c.getMultipleAccountsInfoAndContext([program, programDataAddress(program)], { commitment: 'finalized' });
verifyDeployment({ program: PROGRAM_ADDRESS, authority: PAYER.toBase58(), binary, programAccount: accounts.value[0], dataAccount: accounts.value[1] });
const balance = await c.getBalance(PAYER, 'finalized');
assertBudget({ baseline: deployment.payerBaselineLamports, balance, nextDebit: FUNDING.merchant + FUNDING.payer, reserve: 100_000 });
if (!send) {
  console.log(JSON.stringify({ status: 'INSPECTED_NO_SIGN_SEND', program: PROGRAM_ADDRESS, slot: accounts.context.slot, balance, capLamports: CAP_LAMPORTS }));
} else {
  const report = new URL('smoke.json', evidence);
  const journal = new URL('smoke-pending.json', evidence);
  assert(!fs.existsSync(report) && !fs.existsSync(journal), 'SMOKE_ALREADY_STARTED_RECONCILE_BEFORE_RETRY');
  const folder = path.join(os.homedir(), '.local/share/dev3pack/devnet/receiptrail');
  assert(fs.lstatSync(folder).isDirectory() && (fs.statSync(folder).mode & 0o777) === 0o700, 'KEY_DIRECTORY_MODE');
  function signer(file, expected) {
    assert(fs.lstatSync(file).isFile() && (fs.statSync(file).mode & 0o777) === 0o600, 'KEY_FILE_MODE');
    const original = Uint8Array.from(JSON.parse(fs.readFileSync(file, 'utf8')));
    const result = anchor.web3.Keypair.fromSecretKey(Uint8Array.from(original));
    original.fill(0);
    assert.equal(result.publicKey.toBase58(), expected, 'KEY_PUBLIC_MISMATCH');
    return result;
  }
  const feeSigner = signer(path.join(os.homedir(), '.local/share/dev3pack/devnet/payer-keypair.json'), PAYER.toBase58());
  const merchantSigner = signer(path.join(folder, 'merchant-keypair.json'), identity.merchant);
  const payerSigner = signer(path.join(folder, 'payer-keypair.json'), identity.payer);
  const addressCodec = { encode: value => new PublicKey(value).toBytes(), decode: value => new PublicKey(value).toBase58() };
  const client = createReceiptRailClient({ addressCodec, derivePda: ({ programAddress, seeds }) => {
    const [key, bump] = PublicKey.findProgramAddressSync(seeds.map(s => Buffer.from(s)), new PublicKey(programAddress));
    return [key.toBase58(), bump];
  } });
  const startSlot = await c.getSlot('finalized');
  const invoiceId = label => new Uint8Array(Buffer.from(sha256(`${PROGRAM_ADDRESS}:${identity.merchant}:phase4-${label}-v1`), 'hex'));
  const expiresSlot = BigInt(startSlot) + 100_000n;
  const first = await client.createInvoiceInstruction({ merchant: identity.merchant, payer: identity.payer, invoiceId: invoiceId('paid'), amountLamports: 1_000_000n, expiresSlot, currentSlot: BigInt(startSlot) });
  const second = await client.createInvoiceInstruction({ merchant: identity.merchant, payer: identity.payer, invoiceId: invoiceId('cancelled'), amountLamports: 1_000_000n, expiresSlot, currentSlot: BigInt(startSlot) });
  const existing = await c.getMultipleAccountsInfo([merchant, payer, new PublicKey(first.invoiceAddress), new PublicKey(second.invoiceAddress)], 'finalized');
  assert(existing.every(value => value === null), 'ACTORS_OR_INVOICES_EXIST_RECONCILE_BEFORE_SMOKE');
  const record = { at: new Date().toISOString(), mode: 'APPROVED_P4B_SMOKE', program: PROGRAM_ADDRESS, genesis: GENESIS, ciHead: ci.headSha,
    payerBaselineLamports: deployment.payerBaselineLamports, capLamports: CAP_LAMPORTS, merchant: identity.merchant, payer: identity.payer,
    invoicePaid: first.invoiceAddress, invoiceCancelled: second.invoiceAddress, expiresSlot: expiresSlot.toString(), transactions: [], status: 'RUNNING' };
  const json = value => JSON.stringify(value, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2) + '\n';
  fs.writeFileSync(report, json(record), { flag: 'wx' });
  const save = () => fs.writeFileSync(report, json(record));
  async function sendOne(label, instructions, signers, possibleDebit = 0) {
    assert(!fs.existsSync(journal), 'PENDING_TRANSACTION_REQUIRES_RECONCILIATION');
    assert(record.transactions.length < 5, 'SMOKE_TRANSACTION_LIMIT');
    const block = await c.getLatestBlockhash('confirmed');
    const tx = new Transaction({ feePayer: PAYER, recentBlockhash: block.blockhash }).add(...instructions);
    const message = tx.compileMessage();
    const fee = (await c.getFeeForMessage(message, 'confirmed')).value;
    assert(Number.isSafeInteger(fee) && fee > 0 && fee <= 15000, 'UNEXPECTED_FEE');
    assertBudget({ baseline: deployment.payerBaselineLamports, balance: await c.getBalance(PAYER, 'finalized'), nextDebit: fee + possibleDebit, reserve: 60_000 });
    const signed = new VersionedTransaction(message); signed.sign(signers);
    assert(Transaction.from(signed.serialize()).verifySignatures(), 'INVALID_CRYPTO_SIGNATURE');
    const signature = anchor.utils.bytes.bs58.encode(signed.signatures[0]);
    const entry = { label, signature, ...block, feeQuoteLamports: fee, broadcastStarted: false, status: 'SIGNED_NOT_SENT' };
    record.transactions.push(entry); fs.writeFileSync(journal, json(entry), { flag: 'wx' }); save();
    const simulation = await c.simulateTransaction(signed, { commitment: 'confirmed', sigVerify: true });
    entry.simulation = simulation.value; save(); assert.equal(simulation.value.err, null, 'SIMULATION_FAILED_NOT_SENT');
    entry.broadcastStarted = true; entry.status = 'BROADCAST_STARTED'; fs.writeFileSync(journal, json(entry)); save();
    assert.equal(await c.sendRawTransaction(signed.serialize(), { skipPreflight: false, preflightCommitment: 'confirmed', maxRetries: 0 }), signature);
    let status;
    for (let i = 0; i < 25; i++) {
      await delay(1500);
      status = (await c.getSignatureStatuses([signature], { searchTransactionHistory: true })).value[0];
      assert(!status?.err, 'TRANSACTION_FAILED');
      if (status?.confirmationStatus === 'finalized') break;
    }
    assert.equal(status?.confirmationStatus, 'finalized', 'UNKNOWN_KEEP_JOURNAL');
    const txMeta = await c.getTransaction(signature, { commitment: 'finalized', maxSupportedTransactionVersion: 0 });
    assert(txMeta?.meta && txMeta.meta.err === null, 'MISSING_FINALIZED_META');
    assert.equal(txMeta.meta.fee, fee, 'FEE_QUOTE_MISMATCH');
    Object.assign(entry, { status: 'FINALIZED_SUCCESS', slot: status.slot, feeLamports: txMeta.meta.fee, logs: txMeta.meta.logMessages, computeUnitsConsumed: txMeta.meta.computeUnitsConsumed });
    save(); fs.unlinkSync(journal); console.log(JSON.stringify({ label, signature, slot: entry.slot, status: entry.status }));
  }
  async function invoice(address) {
    const envelope = publicEnvelope(address, await c.getAccountInfo(new PublicKey(address), 'finalized'));
    return { envelope, state: await client.decodeInvoice(envelope) };
  }
  try {
    await sendOne('fund-two-actors', [SystemProgram.transfer({ fromPubkey: PAYER, toPubkey: merchant, lamports: FUNDING.merchant }), SystemProgram.transfer({ fromPubkey: PAYER, toPubkey: payer, lamports: FUNDING.payer })], [feeSigner], FUNDING.merchant + FUNDING.payer);
    await sendOne('create-paid-invoice', [toWeb3Instruction(first.instruction)], [feeSigner, merchantSigner]);
    const open = await invoice(first.invoiceAddress); assert.equal(open.state.status, 'Open');
    const beforePay = { merchant: await c.getBalance(merchant, 'finalized'), payer: await c.getBalance(payer, 'finalized') };
    const pay = await client.payInvoiceInstruction({ account: open.envelope, signer: identity.payer, confirmedTerms: open.state, currentSlot: BigInt(await c.getSlot('finalized')) });
    await sendOne('pay-once', [toWeb3Instruction(pay)], [feeSigner, payerSigner]);
    const paid = await invoice(first.invoiceAddress); assert.equal(paid.state.status, 'Paid');
    const afterPay = { merchant: await c.getBalance(merchant, 'finalized'), payer: await c.getBalance(payer, 'finalized') };
    assert.equal(afterPay.merchant - beforePay.merchant, 1_000_000); assert.equal(beforePay.payer - afterPay.payer, 1_000_000);
    record.principal = { beforePay, afterPay, amountLamports: 1_000_000 }; save();
    // Deliberately use raw generated ABI for a negative simulation; never broadcast this retry.
    const duplicateIx = getPayInvoiceInstruction({ accounts: { invoice: first.invoiceAddress, payer: identity.payer, merchant: identity.merchant } }, addressCodec);
    const block = await c.getLatestBlockhash('finalized');
    const duplicate = new VersionedTransaction(new Transaction({ feePayer: PAYER, recentBlockhash: block.blockhash }).add(toWeb3Instruction(duplicateIx)).compileMessage());
    duplicate.sign([feeSigner, payerSigner]); assert(Transaction.from(duplicate.serialize()).verifySignatures());
    const duplicateSignature = anchor.utils.bytes.bs58.encode(duplicate.signatures[0]);
    assert.notEqual(duplicateSignature, record.transactions.find(t => t.label === 'pay-once').signature);
    const simulation = await c.simulateTransaction(duplicate, { commitment: 'finalized', sigVerify: true });
    assertDuplicateSimulation(simulation.value, PROGRAM_ADDRESS);
    record.duplicate = { status: 'SIMULATED_NOT_SENT', signature: duplicateSignature, ...simulation.value }; save();
    assert.equal(await c.getBalance(merchant, 'finalized'), afterPay.merchant); assert.equal(await c.getBalance(payer, 'finalized'), afterPay.payer);
    await sendOne('create-cancelled-invoice', [toWeb3Instruction(second.instruction)], [feeSigner, merchantSigner]);
    const cancelOpen = await invoice(second.invoiceAddress);
    const beforeCancel = { merchant: await c.getBalance(merchant, 'finalized'), payer: await c.getBalance(payer, 'finalized') };
    const cancel = await client.cancelInvoiceInstruction({ account: cancelOpen.envelope, signer: identity.merchant, confirmedTerms: cancelOpen.state });
    await sendOne('cancel-open-invoice', [toWeb3Instruction(cancel)], [feeSigner, merchantSigner]);
    const cancelled = await invoice(second.invoiceAddress); assert.equal(cancelled.state.status, 'Cancelled'); assert.equal(cancelled.state.paidSlot, 0n);
    assert.equal(await c.getBalance(merchant, 'finalized'), beforeCancel.merchant); assert.equal(await c.getBalance(payer, 'finalized'), beforeCancel.payer);
    const finalBalance = await c.getBalance(PAYER, 'finalized');
    record.final = { paid: (await invoice(first.invoiceAddress)).state, cancelled: cancelled.state, payerLamports: finalBalance,
      budget: assertBudget({ baseline: deployment.payerBaselineLamports, balance: finalBalance, nextDebit: 0 }),
      smokeFeesLamports: record.transactions.reduce((n, t) => n + t.feeLamports, 0) };
    record.status = 'FINALIZED_SMOKE_VERIFIED'; record.endedAt = new Date().toISOString(); save();
    console.log(JSON.stringify({ status: record.status, transactions: record.transactions.length, payerLamports: finalBalance, evidence: fileURLToPath(report) }));
  } catch (error) {
    record.status = 'FAILED_OR_UNCONFIRMED_RECONCILE_BEFORE_RETRY'; record.error = error.message; save();
    console.error(record.error); process.exitCode = 1;
  }
}
