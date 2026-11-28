import assert from 'node:assert/strict';
import { anchor, publicEnvelope, toWeb3Instruction } from './checks.mjs';
import { PROGRAM_ADDRESS, createReceiptRailClient } from '../../packages/receiptrail-client/index.mjs';
import { CONTRACT, getPayInvoiceInstruction } from '../../packages/receiptrail-client/generated.mjs';
const { PublicKey, Transaction } = anchor.web3;
const codec = { encode: s => new PublicKey(s).toBytes(), decode: b => new PublicKey(b).toBase58() };
const client = createReceiptRailClient({ addressCodec: codec, derivePda: ({ programAddress, seeds }) => {
  const [key, bump] = PublicKey.findProgramAddressSync(seeds.map(seed => Buffer.from(seed)), new PublicKey(programAddress));
  return [key.toBase58(), bump];
} });
export const CAP = 500_000_000;
export function reserve(entries, cost) {
  assert(Number.isSafeInteger(cost) && cost >= 0);
  const total = entries.reduce((sum, e) => { assert(Number.isSafeInteger(e.reserved) && e.reserved >= 0); return sum + e.reserved; }, cost);
  assert(total <= CAP && entries.length < 65, 'Recording budget exhausted.');
  return total;
}
export async function inspectIntent({ bytes, address, identity, entries, slot, readAccount, rent }) {
  assert(bytes.length <= 1232 && [identity.merchant, identity.payer].includes(address), 'Unexpected signer.');
  const tx = Transaction.from(bytes);
  assert(tx.feePayer?.toBase58() === address && tx.signatures.length === 1 && !tx.signature && tx.instructions.length === 1, 'Expected one unsigned receipt instruction.');
  const [ix] = tx.instructions;
  assert(ix.programId.toBase58() === PROGRAM_ADDRESS, 'Unexpected program.');
  const match = Object.entries(CONTRACT.instructions).find(([, s]) => ix.data.length === s.size && ix.data.subarray(0, 8).equals(Buffer.from(s.discriminator)));
  assert(match, 'Unknown receipt instruction.');
  let expected, invoice, principal = 0, accountRent = 0, action;
  if (match[0] === 'create_invoice') {
    assert(address === identity.merchant, 'Merchant required.');
    const get = name => match[1].fields.find(f => f.name === name).offset;
    const amount = ix.data.readBigUInt64LE(get('amount_lamports')), expiry = ix.data.readBigUInt64LE(get('expires_slot'));
    const payer = new PublicKey(ix.data.subarray(get('payer'), get('payer') + 32)).toBase58();
    assert(payer === identity.payer && amount > 0n && amount <= 100_000n, 'Recording amount or payer outside approved terms.');
    assert(expiry > BigInt(slot) && expiry <= BigInt(slot) + 12_000n, 'Unexpected expiry.');
    const result = await client.createInvoiceInstruction({ merchant: address, payer, invoiceId: ix.data.subarray(get('invoice_id'), get('invoice_id') + 32),
      amountLamports: amount, expiresSlot: expiry, currentSlot: BigInt(slot) });
    invoice = result.invoiceAddress; expected = result.instruction; action = 'create'; accountRent = rent;
    assert(!entries.some(e => e.action === 'create' && e.invoice === invoice), 'Invoice already signed.');
    assert(rent > 0 && rent <= 3_000_000, 'Unexpected rent.');
  } else {
    invoice = ix.keys[0].pubkey.toBase58();
    assert(entries.some(e => e.action === 'create' && e.invoice === invoice), 'This invoice is outside the recording session.');
    const account = publicEnvelope(invoice, await readAccount(invoice));
    const state = await client.decodeInvoice(account);
    assert(state.merchant === identity.merchant && state.payer === identity.payer && state.amountLamports <= 100_000n, 'Unexpected actors or amount.');
    const input = { account, signer: address, confirmedTerms: state };
    if (match[0] === 'cancel_invoice') { expected = await client.cancelInvoiceInstruction(input); action = 'cancel'; }
    else if (state.status === 'Paid') {
      assert(address === identity.payer && entries.some(e => e.action === 'pay' && e.invoice === invoice && e.blockhash !== tx.recentBlockhash), 'Paid retry must use a fresh blockhash.');
      expected = getPayInvoiceInstruction({ accounts: { invoice, payer: address, merchant: state.merchant } }, codec); action = 'retry';
    } else {
      expected = await client.payInvoiceInstruction({ ...input, currentSlot: BigInt(slot) }); action = 'pay'; principal = Number(state.amountLamports);
    }
  }
  const rebuilt = new Transaction({ feePayer: new PublicKey(address), recentBlockhash: tx.recentBlockhash }).add(toWeb3Instruction(expected));
  assert(rebuilt.serializeMessage().equals(tx.serializeMessage()), 'Instruction or account metadata differs from IDL.');
  return { tx, invoice, action, principal, rent: accountRent };
}
