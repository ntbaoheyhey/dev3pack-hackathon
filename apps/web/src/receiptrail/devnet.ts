import { Buffer } from 'buffer';
import bs58 from 'bs58';
import { Connection, PublicKey, Transaction, TransactionInstruction, VersionedTransaction } from '@solana/web3.js';
import type { AccountInfo, Commitment } from '@solana/web3.js';
import type { Wallet, WalletAccount } from '@wallet-standard/base';
import type { SolanaSignTransactionFeature, SolanaSignAndSendTransactionFeature } from '@solana/wallet-standard-features';
import { createReceiptRailClient, INVOICE_SIZE, PROGRAM_ADDRESS } from '../../../../packages/receiptrail-client/index.mjs';
import type { Invoice, InvoiceTerms } from '../../../../packages/receiptrail-client/index.mjs';
import type { Instruction } from '../../../../packages/receiptrail-client/runtime.mjs';
import { CONTRACT, getPayInvoiceInstruction } from '../../../../packages/receiptrail-client/generated.mjs';

export const RPC = 'https://api.devnet.solana.com';
export const GENESIS = 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG';
export const explorer = (kind: 'address' | 'tx', value: string) =>
  'https://explorer.solana.com/' + kind + '/' + encodeURIComponent(value) + '?cluster=devnet';
export const addressCodec = { encode: (s: string) => new PublicKey(s).toBytes(), decode: (b: Uint8Array) => new PublicKey(b).toBase58() };
export const client = createReceiptRailClient({ addressCodec, derivePda: ({ programAddress, seeds }) => {
  const [key, bump] = PublicKey.findProgramAddressSync(seeds.map(seed => Buffer.from(seed)), new PublicKey(programAddress));
  return [key.toBase58(), bump];
} });
const schema = (CONTRACT.structs as { Invoice: { fields: { name: string; offset: number }[]; discriminator: number[] } }).Invoice;
const program = new PublicKey(PROGRAM_ADDRESS);
const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export function connectDevnet() {
  let previous: Promise<unknown> = Promise.resolve();
  let lastRequestAt = 0;
  return new Connection(RPC, { commitment: 'confirmed', disableRetryOnRateLimit: true, fetch: (url, init) => {
    const request = async () => {
      for (let n = 0; ; n++) {
        await sleep(Math.max(0, 900 - (Date.now() - lastRequestAt)));
        lastRequestAt = Date.now();
        const response = await fetch(url, { ...init, signal: AbortSignal.timeout(12000) });
        // HTTP 429 explicitly declined the request. A send retry uses the identical signed bytes.
        // Network timeouts remain Unknown and are never replayed by this transport.
        if (response.status !== 429 || n >= 3) return response;
        const header = response.headers.get('retry-after');
        const seconds = header ? Number(header) : NaN;
        const advised = Number.isFinite(seconds) ? seconds * 1000 : header ? Date.parse(header) - Date.now() : 0;
        const wait = Math.max(4000 * 2 ** n, advised || 0);
        if (wait > 30000) return response;
        await response.arrayBuffer();
        await sleep(wait);
      }
    };
    const result = previous.then(request);
    previous = result.catch(() => undefined);
    return result;
  } });
}
const verifiedConnections = new WeakMap<Connection, Promise<void>>();
export function verifyCluster(rpc: Connection) {
  const previous = verifiedConnections.get(rpc);
  if (previous) return previous;
  const check = rpc.getGenesisHash().then(hash => {
    if (hash !== GENESIS) throw new Error('The RPC endpoint did not identify itself as Solana devnet.');
  }).catch(e => { verifiedConnections.delete(rpc); throw e; });
  verifiedConnections.set(rpc, check); return check;
}
function envelope(address: string, raw: AccountInfo<Buffer>) {
  return { address, owner: raw.owner.toBase58(), executable: raw.executable, data: new Uint8Array(raw.data) };
}
export async function readReceipt(rpc: Connection, address: string, commitment: Commitment = 'confirmed', minContextSlot?: number) {
  const key = new PublicKey(address);
  if (key.toBase58() !== address) throw new Error('Enter a full, canonical Solana invoice address.');
  const { context, value } = await rpc.getAccountInfoAndContext(key, { commitment, minContextSlot });
  if (!value) throw new Error('No invoice was found at this address at ' + commitment + ' commitment.');
  const account = envelope(address, value);
  return { invoice: await client.decodeInvoice(account), account, slot: context.slot, commitment };
}
export async function listReceipts(rpc: Connection, address: string, role: 'merchant' | 'payer') {
  const offset = schema.fields.find(field => field.name === role)!.offset;
  const key = new PublicKey(address).toBase58();
  const { value } = await rpc.getProgramAccounts(program, { commitment: 'confirmed', withContext: true, filters: [
    { dataSize: INVOICE_SIZE }, { memcmp: { offset: 0, bytes: bs58.encode(Uint8Array.from(schema.discriminator)) } },
    { memcmp: { offset, bytes: key } },
  ] });
  return Promise.all(value.map(({ pubkey, account }) => client.decodeInvoice(envelope(pubkey.toBase58(), account))));
}
export type Action = 'create' | 'pay' | 'cancel' | 'retry';
export type Intent = { action: 'create'; merchant: string; payer: string; invoiceId: Uint8Array; amountLamports: bigint; expiresSlot: bigint }
  | { action: 'pay' | 'cancel' | 'retry'; address: string; terms: InvoiceTerms };
export interface Quote {
  action: Action; signer: string; address: string; merchant: string; payer: string; amount: bigint; expiry: bigint;
  fee: number; rent: number; invoiceId?: string; unsigned: Uint8Array; lastValidBlockHeight: number; blockhash: string;
}
export function isDuplicate(err: unknown, logs: readonly string[] | null | undefined) {
  const detail = (err as { InstructionError?: unknown[] } | null)?.InstructionError;
  return detail?.[0] === 0 && (detail[1] as { Custom?: number })?.Custom === 6004 &&
    Boolean(logs?.some(line => line === 'Program ' + PROGRAM_ADDRESS + ' failed: custom program error: 0x1774'));
}
function webInstruction(ix: Instruction) {
  return new TransactionInstruction({ programId: new PublicKey(ix.programAddress), data: Buffer.from(ix.data),
    keys: ix.accounts.map(a => ({ pubkey: new PublicKey(a.address), isSigner: a.isSigner, isWritable: a.isWritable })) });
}
export async function prepare(rpc: Connection, signer: string, intent: Intent, previousBlockhash?: string): Promise<Quote> {
  await verifyCluster(rpc);
  const slot = BigInt(await rpc.getSlot('confirmed'));
  let ix: Instruction, address: string;
  let terms: Pick<Invoice, 'merchant' | 'payer' | 'amountLamports' | 'expiresSlot'>;
  if (intent.action === 'create') {
    if (signer !== intent.merchant) throw new Error('Connect the merchant wallet to create this invoice.');
    const created = await client.createInvoiceInstruction({ ...intent, currentSlot: slot });
    ix = created.instruction; address = created.invoiceAddress; terms = intent;
  } else {
    address = intent.address;
    const { invoice, account } = await readReceipt(rpc, address);
    terms = invoice;
    const input = { account, signer, confirmedTerms: intent.terms };
    if (intent.action === 'retry') {
      if (invoice.status !== 'Paid' || signer !== invoice.payer) throw new Error('The retry demonstration requires a paid invoice and its original payer.');
      if (invoice.address !== intent.terms.address || invoice.merchant !== intent.terms.merchant || invoice.payer !== intent.terms.payer ||
          invoice.amountLamports !== intent.terms.amountLamports || invoice.expiresSlot !== intent.terms.expiresSlot ||
          !Buffer.from(invoice.invoiceId).equals(Buffer.from(intent.terms.invoiceId))) throw new Error('Invoice terms have changed.');
      ix = getPayInvoiceInstruction({ accounts: { invoice: address, payer: signer, merchant: invoice.merchant } }, addressCodec);
    } else {
      ix = intent.action === 'pay' ? await client.payInvoiceInstruction({ ...input, currentSlot: slot }) : await client.cancelInvoiceInstruction(input);
    }
  }
  let block = await rpc.getLatestBlockhash('confirmed');
  for (let i = 0; block.blockhash === previousBlockhash && i < 4; i++) { await sleep(650); block = await rpc.getLatestBlockhash('confirmed'); }
  if (block.blockhash === previousBlockhash) throw new Error('Wait for a fresh blockhash and review the retry again.');
  const { blockhash, lastValidBlockHeight } = block;
  const tx = new Transaction({ feePayer: new PublicKey(signer), recentBlockhash: blockhash }).add(webInstruction(ix));
  const message = tx.compileMessage();
  const simulation = (await rpc.simulateTransaction(new VersionedTransaction(message), { commitment: 'confirmed', sigVerify: false })).value;
  if (intent.action === 'retry') {
    if (!isDuplicate(simulation.err, simulation.logs)) throw new Error('The simulation did not prove InvoiceNotOpen. Refresh the invoice.');
  } else if (simulation.err) {
    throw new Error('Simulation failed before signing: ' + JSON.stringify(simulation.err));
  }
  const fee = (await rpc.getFeeForMessage(message, 'confirmed')).value;
  if (fee === null || !Number.isSafeInteger(fee)) throw new Error('Fee quote expired. Review the transaction again.');
  const rent = intent.action === 'create' ? await rpc.getMinimumBalanceForRentExemption(INVOICE_SIZE, 'confirmed') : 0;
  return { action: intent.action, signer, address, merchant: terms.merchant, payer: terms.payer, amount: terms.amountLamports,
    expiry: terms.expiresSlot, fee, rent, blockhash, lastValidBlockHeight, invoiceId: intent.action === 'create' ? Buffer.from(intent.invoiceId).toString('hex') : undefined,
    unsigned: tx.serialize({ requireAllSignatures: false, verifySignatures: false }) };
}
export interface Attempt {
  action: Action; address: string; signer: string; signature: string | null; blockhash: string; lastValidBlockHeight: number;
  at: string; state: 'unknown' | 'confirmed' | 'finalized' | 'failed' | 'expired' | 'reconciled'; fee: number;
  error?: string; chargedFee?: number; slot?: number; createTerms?: { invoiceId: string; payer: string; amount: string; expiry: string };
}
export function verifySigned(quoted: Uint8Array, signed: Uint8Array) {
  const expected = Transaction.from(quoted);
  const actual = Transaction.from(signed);
  if (!actual.serializeMessage().equals(expected.serializeMessage()) || !actual.signature || !actual.verifySignatures()) {
    throw new Error('The wallet returned a different message or an invalid signature.');
  }
  return bs58.encode(actual.signature);
}
export async function submit(rpc: Connection, quote: Quote, wallet: Wallet, account: WalletAccount,
  current: () => boolean, persist: (attempt: Attempt) => void, simulateLostResponse: boolean) {
  if (account.address !== quote.signer || !account.chains.includes('solana:devnet') || !current()) throw new Error('Wallet changed. Review terms again.');
  const sign = wallet.features['solana:signTransaction'] as SolanaSignTransactionFeature['solana:signTransaction'] | undefined;
  const signSend = wallet.features['solana:signAndSendTransaction'] as SolanaSignAndSendTransactionFeature['solana:signAndSendTransaction'] | undefined;
  const useSign = account.features.includes('solana:signTransaction') && sign?.supportedTransactionVersions.includes('legacy');
  const useSend = account.features.includes('solana:signAndSendTransaction') && signSend?.supportedTransactionVersions.includes('legacy');
  if (!useSign && !useSend) throw new Error('This account does not support signing legacy devnet transactions.');
  if (await rpc.getBlockHeight('confirmed') > quote.lastValidBlockHeight || !current()) throw new Error('The review expired. Review terms again.');
  const input = { account, chain: 'solana:devnet' as const, transaction: quote.unsigned };
  const options = { skipPreflight: quote.action === 'retry', preflightCommitment: 'confirmed' as const, maxRetries: 0 };
  const attempt: Attempt = { action: quote.action, signer: quote.signer, address: quote.address, signature: null,
    blockhash: quote.blockhash, lastValidBlockHeight: quote.lastValidBlockHeight, at: new Date().toISOString(), state: 'unknown', fee: quote.fee, createTerms: quote.invoiceId ? { invoiceId: quote.invoiceId, payer: quote.payer, amount: quote.amount.toString(), expiry: quote.expiry.toString() } : undefined };
  if (useSign && sign) {
    const [result] = await sign.signTransaction(input);
    if (!current()) throw new Error('Wallet changed while signing. Review again.');
    attempt.signature = verifySigned(quote.unsigned, result.signedTransaction);
    persist({ ...attempt });
    try {
      const signature = await rpc.sendRawTransaction(result.signedTransaction, options);
      if (signature !== attempt.signature) return { attempt, unknown: true, simulated: false };
    } catch { return { attempt, unknown: true, simulated: false }; }
  } else if (signSend) {
    persist({ ...attempt });
    try {
      const [result] = await signSend.signAndSendTransaction({ ...input, options });
      attempt.signature = bs58.encode(result.signature);
      persist({ ...attempt });
    } catch { return { attempt, unknown: true, simulated: false }; }
  }
  return { attempt, unknown: simulateLostResponse, simulated: simulateLostResponse };
}
export async function checkAttempt(rpc: Connection, attempt: Attempt) {
  const result = attempt.signature ? (await rpc.getSignatureStatuses([attempt.signature], { searchTransactionHistory: true })).value[0] : null;
  if (!result) {
    if (await rpc.getBlockHeight('finalized') <= attempt.lastValidBlockHeight) return attempt;
    const account = await rpc.getAccountInfoAndContext(new PublicKey(attempt.address), 'finalized');
    if (!account.value) return { ...attempt, state: attempt.action === 'create' ? 'expired' as const : 'unknown' as const };
    const invoice = await client.decodeInvoice(envelope(attempt.address, account.value));
    const expected = attempt.action === 'pay' ? 'Paid' : attempt.action === 'cancel' ? 'Cancelled' : null;
    if (attempt.action === 'create' || invoice.status === expected) return { ...attempt, state: 'reconciled' as const, slot: account.context.slot };
    if (invoice.status === 'Open' && (attempt.action === 'pay' || attempt.action === 'cancel')) return { ...attempt, state: 'expired' as const };
    return attempt;
  }
  if (!['confirmed', 'finalized'].includes(result.confirmationStatus ?? '')) return attempt;
  const state: Attempt['state'] = result.err ? 'failed' : result.confirmationStatus === 'finalized' ? 'finalized' : 'confirmed';
  if (state === 'failed' && attempt.signature) {
    const tx = await rpc.getTransaction(attempt.signature, { commitment: 'confirmed', maxSupportedTransactionVersion: 0 });
    const error = tx?.meta && isDuplicate(tx.meta.err, tx.meta.logMessages) ? 'InvoiceNotOpen' : JSON.stringify(result.err);
    return { ...attempt, state, error, chargedFee: tx?.meta?.fee, slot: result.slot };
  }
  return { ...attempt, state, slot: result.slot };
}
