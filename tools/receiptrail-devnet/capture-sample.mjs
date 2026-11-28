import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { anchor, GENESIS, RPC, publicEnvelope } from './checks.mjs';
import { createReceiptRailClient, PROGRAM_ADDRESS } from '../../packages/receiptrail-client/index.mjs';
const [invoiceAddress, signature] = process.argv.slice(2);
const { PublicKey, Connection } = anchor.web3;
const rpc = new Connection(RPC, 'finalized');
assert.equal(await rpc.getGenesisHash(), GENESIS);
const { context, value } = await rpc.getAccountInfoAndContext(new PublicKey(invoiceAddress), 'finalized');
const codec = { encode: s => new PublicKey(s).toBytes(), decode: b => new PublicKey(b).toBase58() };
const client = createReceiptRailClient({ addressCodec: codec, derivePda: ({ programAddress, seeds }) => {
  const [key, bump] = PublicKey.findProgramAddressSync(seeds.map(b => Buffer.from(b)), new PublicKey(programAddress));
  return [key.toBase58(), bump];
} });
const invoice = await client.decodeInvoice(publicEnvelope(invoiceAddress, value));
const tx = await rpc.getTransaction(signature, { commitment: 'finalized', maxSupportedTransactionVersion: 0 });
assert(tx?.meta && !tx.meta.err && invoice.status === 'Paid' && BigInt(tx.slot) === invoice.paidSlot);
assert(tx.transaction.message.staticAccountKeys.some(k => k.toBase58() === invoiceAddress));
const data = { address: invoiceAddress, program: PROGRAM_ADDRESS, genesis: GENESIS, paySignature: signature, observedAt: new Date().toISOString(),
  contextSlot: context.slot, commitment: 'finalized', owner: value.owner.toBase58(), executable: value.executable, data: value.data.toString('base64') };
writeFileSync(new URL('../../apps/web/src/receiptrail/sample.json', import.meta.url), JSON.stringify(data, null, 2) + '\n');
console.log(invoiceAddress, invoice.status, 'finalized at slot', invoice.paidSlot.toString());
