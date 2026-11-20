// P4-B only: a single buffer, paced upload, then the pinned Agave deploy command.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { PROGRAM_ADDRESS } from '../../packages/receiptrail-client/index.mjs';
import { anchor, RPC, GENESIS, LOADER, PAYER, FUNDING, CAP_LAMPORTS, sha256, assertBudget, programDataAddress, bufferWriteInstruction, verifyBuffer } from './checks.mjs';

const root = new URL('../../', import.meta.url);
const evidence = new URL('docs/evidence/phase4/', root);
const file = name => new URL(name, evidence);
const read = name => JSON.parse(fs.readFileSync(file(name), 'utf8'));
const json = value => JSON.stringify(value, null, 2) + '\n';
const writeNew = (name, value) => fs.writeFileSync(file(name), json(value), { flag: 'wx' });
const args = process.argv.slice(2);
assert(args.length === 1 && ['--inspect', '--upload-approved', '--deploy-approved'].includes(args[0]), 'EXPLICIT_MODE_REQUIRED');
const identity = read('deployment-identity.json');
const ci = read('ci-deployment.json');
assert.equal(ci.status, 'PASSED'); assert.equal(ci.program, PROGRAM_ADDRESS);
assert.equal(identity.program, PROGRAM_ADDRESS); assert.equal(identity.feePayer, PAYER.toBase58());
for (const [name, hash] of Object.entries(ci.inputHashes)) assert.equal(sha256(fs.readFileSync(new URL(name, root))), hash, `CI_INPUT_CHANGED:${name}`);
for (const name of ['programs/receiptrail/src/lib.rs', 'tools/receiptrail-devnet/deploy.mjs', 'tools/receiptrail-devnet/checks.mjs']) assert(Object.hasOwn(ci.inputHashes, name));
const binaryPath = new URL('target/receiptrail-spike/receiptrail.so', root);
const binary = fs.readFileSync(binaryPath);
assert.equal(sha256(binary), ci.localBinarySha256, 'BINARY_CHANGED_AFTER_CI');
const { PublicKey, Transaction, VersionedTransaction, TransactionInstruction, SystemProgram, ComputeBudgetProgram } = anchor.web3;
const program = new PublicKey(PROGRAM_ADDRESS), buffer = new PublicKey(identity.buffer);
assert.equal(new Set([identity.program, identity.buffer, identity.merchant, identity.payer, identity.feePayer]).size, 5);
const c = new anchor.web3.Connection(RPC, { commitment: 'finalized', disableRetryOnRateLimit: true,
  fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(15000) }) });
assert.equal(await c.getGenesisHash(), GENESIS, 'NOT_DEVNET');
const state = await c.getMultipleAccountsInfoAndContext([PAYER, program, programDataAddress(program), buffer,
  new PublicKey(identity.merchant), new PublicKey(identity.payer)], { commitment: 'finalized' });
assert(state.value[0]?.owner.equals(SystemProgram.programId) && !state.value[0].executable, 'INVALID_FEE_PAYER');
assert(state.value.slice(1, 3).every(a => a === null), 'PROGRAM_EXISTS_NO_UPGRADE_PERMISSION');
assert(state.value.slice(4).every(a => a === null), 'ACTORS_ALREADY_FUNDED_RECONCILE_FIRST');
const dataRent = await c.getMinimumBalanceForRentExemption(45 + binary.length, 'finalized');
const programRent = await c.getMinimumBalanceForRentExemption(36, 'finalized');
const reserve = FUNDING.merchant + FUNDING.payer + 20_000_000;
const journal = file('upload-pending.json');
assert(!fs.existsSync(journal), 'PENDING_TRANSACTION_RECONCILE_FIRST');
const uploaded = fs.existsSync(file('upload.json')) ? read('upload.json') : null;
const baseline = uploaded?.payerBaselineLamports ?? state.value[0].lamports;
const budget = assertBudget({ baseline, balance: state.value[0].lamports,
  nextDebit: (state.value[3] ? 0 : dataRent) + dataRent + programRent, reserve });
const inspection = { at: new Date().toISOString(), status: 'INSPECTED_NO_SIGN_SEND', genesis: GENESIS,
  program: PROGRAM_ADDRESS, buffer: identity.buffer, ciHead: ci.headSha, observationSlot: state.context.slot,
  payerBaselineLamports: baseline, balanceLamports: state.value[0].lamports, binarySha256: sha256(binary), binaryBytes: binary.length,
  dataRentLamports: dataRent, programRentLamports: programRent, reserveLamports: reserve, capLamports: CAP_LAMPORTS, budget };
if (args[0] === '--inspect') {
  console.log(json(inspection));
  process.exit(0);
}
const folder = path.join(os.homedir(), '.local/share/dev3pack/devnet/receiptrail');
assert(fs.lstatSync(folder).isDirectory() && (fs.statSync(folder).mode & 0o777) === 0o700, 'KEY_DIRECTORY_MODE');
const feeFile = path.join(os.homedir(), '.local/share/dev3pack/devnet/payer-keypair.json');
const keyFile = role => path.join(folder, `${role}-keypair.json`);
function signer(name, expected) {
  assert(fs.lstatSync(name).isFile() && (fs.statSync(name).mode & 0o777) === 0o600, 'KEY_FILE_MODE');
  const bytes = Uint8Array.from(JSON.parse(fs.readFileSync(name, 'utf8')));
  const result = anchor.web3.Keypair.fromSecretKey(Uint8Array.from(bytes)); bytes.fill(0);
  assert.equal(result.publicKey.toBase58(), expected, 'KEY_PUBLIC_MISMATCH'); return result;
}
const feeSigner = signer(feeFile, PAYER.toBase58());
for (const role of ['program', 'buffer', 'merchant', 'payer']) signer(keyFile(role), identity[role]);

if (args[0] === '--upload-approved') {
  assert.equal(uploaded, null, 'UPLOAD_ALREADY_STARTED_RECONCILE_FIRST');
  assert.equal(state.value[3], null, 'BUFFER_EXISTS_RECONCILE_FIRST');
  const record = { ...inspection, status: 'UPLOADING', transactions: [], expectedWrites: Math.ceil(binary.length / 960) };
  writeNew('upload.json', record);
  const save = () => fs.writeFileSync(file('upload.json'), json(record));
  async function sendOne(label, instructions, signers, debit = 0, chunk) {
    assert(!fs.existsSync(journal), 'PENDING_TRANSACTION_RECONCILE_FIRST');
    const block = await c.getLatestBlockhash('confirmed');
    const tx = new Transaction({ feePayer: PAYER, recentBlockhash: block.blockhash }).add(...instructions);
    const message = tx.compileMessage();
    const fee = (await c.getFeeForMessage(message, 'confirmed')).value;
    assert.equal(fee, signers.length * 5000, 'UNEXPECTED_FEE');
    assertBudget({ baseline, balance: baseline - record.transactions.reduce((sum, t) => sum + t.feeQuoteLamports + t.debitLamports, 0),
      nextDebit: debit + fee, reserve: dataRent + programRent + reserve });
    const signed = new VersionedTransaction(message); signed.sign(signers);
    assert(Transaction.from(signed.serialize()).verifySignatures(), 'INVALID_SIGNATURE');
    assert(signed.serialize().length <= 1232, 'PACKET_TOO_LARGE');
    const signature = anchor.utils.bytes.bs58.encode(signed.signatures[0]);
    const entry = { label, ...chunk, signature, ...block, feeQuoteLamports: fee, debitLamports: debit, broadcastStarted: false, status: 'SIGNED_NOT_SENT' };
    record.transactions.push(entry); fs.writeFileSync(journal, json(entry), { flag: 'wx' }); save();
    if (record.transactions.length <= 2) {
      const simulation = await c.simulateTransaction(signed, { commitment: 'confirmed', sigVerify: true });
      entry.simulation = simulation.value; save(); assert.equal(simulation.value.err, null, 'SIMULATION_FAILED');
    }
    entry.broadcastStarted = true; entry.status = 'BROADCAST_STARTED'; fs.writeFileSync(journal, json(entry)); save();
    assert.equal(await c.sendRawTransaction(signed.serialize(), { skipPreflight: false, preflightCommitment: 'confirmed', maxRetries: 0 }), signature);
    let status;
    for (let attempt = 0; attempt < 25; attempt++) {
      await delay(1500);
      status = (await c.getSignatureStatuses([signature], { searchTransactionHistory: true })).value[0];
      assert(!status?.err, 'TRANSACTION_FAILED');
      if (['confirmed', 'finalized'].includes(status?.confirmationStatus)) break;
    }
    assert(['confirmed', 'finalized'].includes(status?.confirmationStatus), 'UNKNOWN_KEEP_JOURNAL');
    entry.status = 'CONFIRMED_SUCCESS'; entry.slot = status.slot; save(); fs.unlinkSync(journal);
  }
  try {
    await sendOne('create-buffer', [SystemProgram.createAccount({ fromPubkey: PAYER, newAccountPubkey: buffer,
      lamports: dataRent, space: 37 + binary.length, programId: LOADER }),
    new TransactionInstruction({ programId: LOADER, keys: [{ pubkey: buffer, isSigner: false, isWritable: true },
      { pubkey: PAYER, isSigner: false, isWritable: false }], data: Buffer.alloc(4) })],
    [feeSigner, signer(keyFile('buffer'), identity.buffer)], dataRent);
    verifyBuffer(await c.getAccountInfo(buffer, 'confirmed'), binary.length);
    for (let offset = 0; offset < binary.length; offset += 960) {
      await delay(1700);
      const length = Math.min(960, binary.length - offset);
      await sendOne('write-buffer', [bufferWriteInstruction(buffer, binary, offset, length),
        ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 0 }), ComputeBudgetProgram.setComputeUnitLimit({ units: 10000 })],
      [feeSigner], 0, { offset, length });
      if (record.transactions.length % 10 === 0) console.log(json({ uploadedWrites: record.transactions.length - 1, total: record.expectedWrites }));
    }
    let statuses;
    for (let attempt = 0; attempt < 30; attempt++) {
      statuses = (await c.getSignatureStatuses(record.transactions.map(t => t.signature), { searchTransactionHistory: true })).value;
      assert(statuses.every(s => !s?.err), 'UPLOAD_TRANSACTION_FAILED');
      if (statuses.every(s => s?.confirmationStatus === 'finalized')) break;
      await delay(2000);
    }
    assert(statuses.every(s => s?.confirmationStatus === 'finalized'), 'UPLOAD_NOT_FINALIZED');
    const after = await c.getMultipleAccountsInfoAndContext([PAYER, buffer, program], { commitment: 'finalized' });
    assert(verifyBuffer(after.value[1], binary.length).equals(binary), 'BUFFER_BYTES_MISMATCH');
    assert.equal(after.value[2], null); assert.equal(after.value[1].lamports, dataRent);
    const fees = record.transactions.reduce((sum, t) => sum + t.feeQuoteLamports, 0);
    assert.equal(baseline - after.value[0].lamports, dataRent + fees, 'UPLOAD_DEBIT_MISMATCH');
    record.status = 'FINALIZED_BUFFER_VERIFIED'; record.endedAt = new Date().toISOString();
    record.after = { slot: after.context.slot, payerLamports: after.value[0].lamports, bufferLamports: dataRent, feesLamports: fees, payloadSha256: sha256(verifyBuffer(after.value[1], binary.length)) };
    record.finalizedStatuses = statuses; save(); console.log(json({ status: record.status, after: record.after }));
  } catch (error) {
    record.status = 'FAILED_OR_UNCONFIRMED_RECONCILE_BEFORE_RETRY'; record.error = error.message; save(); throw error;
  }
} else {
  assert.equal(uploaded?.status, 'FINALIZED_BUFFER_VERIFIED');
  assert.equal(uploaded.binarySha256, sha256(binary));
  assert.equal(uploaded.program, PROGRAM_ADDRESS); assert.equal(uploaded.buffer, identity.buffer);
  assert(verifyBuffer(state.value[3], binary.length).equals(binary), 'BUFFER_BYTES_MISMATCH');
  const cli = path.join(os.homedir(), '.local/share/solana/install/active_release/bin/solana');
  const run = promisify(execFile);
  const version = (await run(cli, ['--version'])).stdout.trim(); assert(version.startsWith('solana-cli 4.1.2 '), 'CLI_VERSION');
  const commandArgs = ['--url', RPC, '--commitment', 'finalized', '--keypair', feeFile, '--output', 'json',
    'program', 'deploy', fileURLToPath(binaryPath), '--program-id', keyFile('program'), '--buffer', keyFile('buffer'),
    '--upgrade-authority', feeFile, '--fee-payer', feeFile, '--max-len', String(binary.length), '--with-compute-unit-price', '0', '--max-sign-attempts', '1', '--use-rpc'];
  const record = { ...inspection, status: 'CLI_STARTED_RECONCILE_BEFORE_RETRY', version, commandArgs, startedAt: new Date().toISOString() };
  writeNew('deploy-cli.json', record);
  try {
    const result = await run(cli, commandArgs, { cwd: fileURLToPath(root), timeout: 180000, maxBuffer: 2 * 1024 * 1024 });
    record.result = JSON.parse(result.stdout); record.stdoutSha256 = sha256(result.stdout); record.stderrSha256 = sha256(result.stderr);
    assert.equal(record.result.programId, PROGRAM_ADDRESS); assert(record.result.signature);
    record.status = 'CLI_SUCCESS_PENDING_FINALIZED_VERIFICATION'; record.exitCode = 0;
  } catch (error) {
    record.status = 'CLI_FAILED_OR_UNKNOWN_RECONCILE_BEFORE_RETRY'; record.exitCode = error.code ?? null;
    record.error = error.message; record.stdout = error.stdout ?? ''; record.stderr = error.stderr ?? ''; process.exitCode = 1;
  }
  record.endedAt = new Date().toISOString(); fs.writeFileSync(file('deploy-cli.json'), json(record));
  console.log(json({ status: record.status, result: record.result, error: record.error }));
}
