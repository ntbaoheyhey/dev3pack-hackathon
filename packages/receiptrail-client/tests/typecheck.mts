import { address, getAddressEncoder, getAddressDecoder, getProgramDerivedAddress } from '../../../apps/web/node_modules/@solana/addresses/dist/types/index.js';
import { createReceiptRailClient, parseSol, type InvoiceAccount, type InvoiceTerms } from '../index.mjs';
import { getCreateInvoiceInstruction, decodeInvoicePaidEvent } from '../generated.mjs';

const addressCodec = {
  encode: (value: string) => new Uint8Array(getAddressEncoder().encode(address(value))),
  decode: (value: Uint8Array) => getAddressDecoder().decode(value),
};
const client = createReceiptRailClient({
  addressCodec,
  derivePda: ({ programAddress, seeds }) => getProgramDerivedAddress({ programAddress: address(programAddress), seeds }),
});
declare const account: InvoiceAccount;
declare const terms: InvoiceTerms;
const invoice = await client.decodeInvoice(account);
const exact: bigint = invoice.amountLamports;
await client.createInvoiceInstruction({ ...terms, amountLamports: exact, currentSlot: 1n });
await client.payInvoiceInstruction({ account, signer: terms.payer, confirmedTerms: terms, currentSlot: 1n });
await client.cancelInvoiceInstruction({ account, signer: terms.merchant, confirmedTerms: terms });
getCreateInvoiceInstruction({ accounts: { merchant: terms.merchant, invoice: terms.address }, args: {
  invoice_id: terms.invoiceId, payer: terms.payer, amount_lamports: parseSol('1'), expires_slot: 2n,
} }, addressCodec);
const paid: bigint = decodeInvoicePaidEvent(new Uint8Array(), addressCodec).paid_slot;
void paid;
// @ts-expect-error A floating point Number cannot become an amount.
parseSol(0.1);
// @ts-expect-error Requires a slot in bigint and a confirmed terms snapshot.
await client.payInvoiceInstruction({ account, signer: terms.payer, currentSlot: 1 });
// @ts-expect-error Decoder requires an owner, address and executable flag, not just bytes.
await client.decodeInvoice(new Uint8Array());
