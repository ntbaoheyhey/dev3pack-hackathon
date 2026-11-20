import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import { anchor, RPC, GENESIS, PROGRAM, PAYER, COUNTER, ROOT, loadIdl, programFromIdl, instruction, decodeCounter, inspect } from './client.mjs';

const args = process.argv.slice(2);
if (args.length > 1 || (args.length === 1 && args[0] !== '--send')) throw new Error('Usage: node smoke.mjs [--send]');
const send = args[0] === '--send';
const connection = new anchor.web3.Connection(RPC, {
  commitment: 'confirmed', disableRetryOnRateLimit: true, confirmTransactionInitialTimeout: 45_000,
  fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(15_000) }),
});
const program = programFromIdl(loadIdl(), connection);
const evidenceDir = new URL('docs/evidence/phase3/', ROOT);
const record = { at: new Date().toISOString(), rpc: RPC, expectedGenesis: GENESIS, programId: PROGRAM.toBase58(), payer: PAYER.toBase58(), counter: COUNTER.toBase58(), mode: send ? 'SEND' : 'INSPECT', transactions: [] };
const logFile = new URL(`devnet-${send ? 'smoke' : 'inspect'}-${Date.now()}.json`, evidenceDir);
const save = () => fs.writeFileSync(logFile, JSON.stringify(record, null, 2) + '\n');

try {
  record.before = await inspect(connection, program);
  save();
  if (!send) {
    console.log(JSON.stringify(record, null, 2));
    process.exitCode = record.before.ready ? 0 : 2;
  } else {
    if (!record.before.ready) throw new Error(record.before.reason);
    if (record.before.counter?.count === '10') throw new Error('COUNTER_AT_LIMIT');
    const neededRent = record.before.counter ? 0 : await connection.getMinimumBalanceForRentExemption(48, 'confirmed');
    if (record.before.balance < neededRent + 100_001) throw new Error('INSUFFICIENT_DEVNET_SOL');

    const journal = new URL('devnet-lab-pending.json', evidenceDir);
    if (fs.existsSync(journal)) throw new Error('REVIEW_PENDING_TRANSACTION_BEFORE_RESEND');
    const keyFile = path.join(os.homedir(), '.local/share/dev3pack/devnet/payer-keypair.json');
    if (fs.statSync(keyFile).mode & 0o077) throw new Error('PAYER_FILE_PERMISSIONS_TOO_OPEN');
    const signer = anchor.web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync(keyFile, 'utf8'))));
    if (!signer.publicKey.equals(PAYER)) throw new Error('PAYER_KEY_MISMATCH');

    async function sendInstruction(name) {
      const block = await connection.getLatestBlockhash('confirmed');
      const tx = new anchor.web3.Transaction({ feePayer: PAYER, recentBlockhash: block.blockhash }).add(await instruction(program, name));
      tx.sign(signer);
      // Lưu signature trước broadcast: timeout không dẫn tới gửi giao dịch mới mù quáng.
      const signature = anchor.utils.bytes.bs58.encode(tx.signature);
      const entry = { name, signature, ...block, status: 'SIGNED_NOT_CONFIRMED' };
      record.transactions.push(entry);
      fs.writeFileSync(journal, JSON.stringify({ ...entry, evidence: fileURLToPath(logFile) }, null, 2) + '\n', { flag: 'wx' });
      save();
      const returned = await connection.sendRawTransaction(tx.serialize(), { skipPreflight: false, preflightCommitment: 'confirmed', maxRetries: 0 });
      if (returned !== signature) throw new Error('SIGNATURE_MISMATCH');
      const confirmation = await connection.confirmTransaction({ signature, ...block }, 'confirmed');
      if (confirmation.value.err) throw new Error('TRANSACTION_FAILED');
      let transaction;
      for (let attempt = 0; attempt < 8; attempt++) {
        transaction = await connection.getTransaction(signature, { commitment: 'confirmed', maxSupportedTransactionVersion: 0 });
        if (transaction) break;
        await delay(500);
      }
      if (!transaction?.meta || transaction.meta.err || !transaction.meta.logMessages?.some(line => line === `Program ${PROGRAM.toBase58()} success`)) throw new Error('MISSING_SUCCESS_EVIDENCE');
      entry.status = 'CONFIRMED_SUCCESS';
      entry.slot = transaction.slot;
      entry.logs = transaction.meta.logMessages;
      entry.feeLamports = transaction.meta.fee;
      entry.computeUnitsConsumed = transaction.meta.computeUnitsConsumed;
      save();
      fs.unlinkSync(journal);
    }

    if (!record.before.counter) await sendInstruction('initialize');
    await sendInstruction('increment');
    const account = await connection.getAccountInfo(COUNTER, 'confirmed');
    if (!account) throw new Error('MISSING_COUNTER_AFTER_TRANSACTION');
    record.after = decodeCounter(program, account);
    const expected = BigInt(record.before.counter?.count ?? '0') + 1n;
    if (record.after.count !== expected.toString()) throw new Error('COUNTER_DELTA_MISMATCH');
    record.status = 'VERIFIED';
    save();
    console.log(JSON.stringify(record, null, 2));
  }
} catch (error) {
  record.status = 'FAILED_OR_UNCONFIRMED';
  record.error = error.message;
  save();
  console.error(record.error, fileURLToPath(logFile));
  process.exitCode = 1;
}
