import {
  CONTRACT, PROGRAM_ADDRESS, decodeInvoiceData,
  getCreateInvoiceInstruction, getPayInvoiceInstruction, getCancelInvoiceInstruction,
} from './generated.mjs';
import { addressBytes, bytes, check, u64, U64_MAX } from './runtime.mjs';

export { PROGRAM_ADDRESS, IDL_SHA256 } from './generated.mjs';
export { U64_MAX } from './runtime.mjs';
export const SYSTEM_PROGRAM = '11111111111111111111111111111111';
export const INVOICE_SIZE = CONTRACT.structs.Invoice.size;

// Decimal strings only: no float, exponent, implicit trimming or rounding of money.
export function parseSol(value) {
  check(typeof value === 'string' && value.length <= 30 && /^(0|[1-9][0-9]*)(\.[0-9]{1,9})?$/.test(value), 'INVALID_SOL');
  const [whole, fraction = ''] = value.split('.');
  const result = BigInt(whole) * 1_000_000_000n + BigInt(fraction.padEnd(9, '0'));
  check(result <= U64_MAX, 'SOL_OVERFLOW');
  return result;
}

export function formatSol(lamports) {
  u64(lamports, 'lamports');
  const fraction = (lamports % 1_000_000_000n).toString().padStart(9, '0').replace(/0+$/, '');
  return `${lamports / 1_000_000_000n}${fraction ? `.${fraction}` : ''}`;
}

export function getReceiptRailError(programAddress, code) {
  if (programAddress !== PROGRAM_ADDRESS || !Number.isSafeInteger(code)) return null;
  return CONTRACT.errors.find(error => error.code === code) ?? null;
}

function equalBytes(a, b) { return a.length === b.length && a.every((v, i) => v === b[i]); }
function copyTerms(value) {
  check(value && typeof value === 'object', 'MISSING_CONFIRMED_TERMS');
  return {
    address: value.address, merchant: value.merchant, payer: value.payer,
    invoiceId: bytes(value.invoiceId, 32, 'invoiceId'),
    amountLamports: u64(value.amountLamports, 'amountLamports'),
    expiresSlot: u64(value.expiresSlot, 'expiresSlot'),
  };
}
function assertConfirmed(invoice, terms) {
  check(['address', 'merchant', 'payer', 'amountLamports', 'expiresSlot'].every(k => invoice[k] === terms[k])
    && equalBytes(invoice.invoiceId, terms.invoiceId), 'TERMS_CHANGED');
}

// The adapter is trusted application code, never a value supplied by a share link.
// This client has no RPC, signing, sending, randomness or deployment override.
export function createReceiptRailClient({ addressCodec, derivePda }) {
  check(addressCodec && typeof addressCodec.encode === 'function' && typeof addressCodec.decode === 'function'
    && typeof derivePda === 'function', 'INVALID_ADAPTER');
  addressBytes(addressCodec, PROGRAM_ADDRESS);

  async function deriveInvoiceAddress(merchant, invoiceId) {
    const merchantBytes = addressBytes(addressCodec, merchant);
    const id = bytes(invoiceId, 32, 'invoiceId');
    const result = await derivePda({ programAddress: PROGRAM_ADDRESS, seeds: [new Uint8Array(CONTRACT.seed), merchantBytes, id] });
    check(Array.isArray(result) && result.length === 2, 'INVALID_PDA_RESULT');
    const [address, bump] = result;
    addressBytes(addressCodec, address);
    check(Number.isInteger(bump) && bump >= 0 && bump <= 255, 'INVALID_PDA_BUMP');
    return Object.freeze({ address, bump });
  }

  function validateTerms(value, invoiceAddress) {
    addressBytes(addressCodec, value.merchant);
    addressBytes(addressCodec, value.payer);
    check(value.merchant !== SYSTEM_PROGRAM && value.payer !== SYSTEM_PROGRAM, 'INVALID_WALLET');
    check(value.payer !== value.merchant && value.payer !== invoiceAddress && value.merchant !== invoiceAddress, 'ALIASED_ROLES');
    check(u64(value.amountLamports, 'amountLamports') > 0n, 'INVALID_AMOUNT');
    check(u64(value.expiresSlot, 'expiresSlot') > 0n, 'INVALID_EXPIRY');
  }

  async function decodeInvoice(account) {
    check(account && typeof account === 'object', 'MISSING_ACCOUNT');
    // Snapshot before the first await. Caller mutations cannot change checked bytes/identity.
    const { address, owner, executable } = account;
    check(owner === PROGRAM_ADDRESS, 'INVOICE_OWNER_MISMATCH');
    check(executable === false, 'INVOICE_EXECUTABLE');
    addressBytes(addressCodec, address);
    const raw = decodeInvoiceData(account.data, addressCodec);
    check(raw.version === 1, 'WRONG_VERSION');
    check(raw.status === 0 || raw.status === 1 || raw.status === 2, 'INVALID_STATUS');
    check(raw.status === 1 ? raw.paid_slot < raw.expires_slot : raw.paid_slot === 0n, 'INVALID_PAID_SLOT');
    const invoice = {
      address, version: raw.version, bump: raw.bump, merchant: raw.merchant, payer: raw.payer,
      invoiceId: raw.invoice_id, amountLamports: raw.amount_lamports, expiresSlot: raw.expires_slot,
      status: ['Open', 'Paid', 'Cancelled'][raw.status], paidSlot: raw.paid_slot,
    };
    validateTerms(invoice, address);
    const canonical = await deriveInvoiceAddress(invoice.merchant, invoice.invoiceId);
    check(address === canonical.address && invoice.bump === canonical.bump, 'INVOICE_PDA_MISMATCH');
    return Object.freeze(invoice);
  }

  async function createInvoiceInstruction(input) {
    const { merchant, payer, amountLamports, expiresSlot, currentSlot } = input;
    const invoiceId = bytes(input.invoiceId, 32, 'invoiceId');
    u64(currentSlot, 'currentSlot');
    validateTerms({ merchant, payer, amountLamports, expiresSlot });
    check(expiresSlot > currentSlot, 'INVALID_EXPIRY');
    const { address, bump } = await deriveInvoiceAddress(merchant, invoiceId);
    validateTerms({ merchant, payer, amountLamports, expiresSlot }, address);
    return {
      invoiceAddress: address, bump,
      instruction: getCreateInvoiceInstruction({ accounts: { merchant, invoice: address }, args: {
        invoice_id: invoiceId, payer, amount_lamports: amountLamports, expires_slot: expiresSlot,
      } }, addressCodec),
    };
  }

  async function payInvoiceInstruction({ account, signer, confirmedTerms, currentSlot }) {
    const terms = copyTerms(confirmedTerms);
    addressBytes(addressCodec, signer);
    u64(currentSlot, 'currentSlot');
    const invoice = await decodeInvoice(account);
    assertConfirmed(invoice, terms);
    check(invoice.status === 'Open', 'INVOICE_NOT_OPEN');
    check(currentSlot < invoice.expiresSlot, 'INVOICE_EXPIRED');
    check(signer === invoice.payer, 'WRONG_PAYER');
    return getPayInvoiceInstruction({ accounts: { invoice: invoice.address, payer: signer, merchant: invoice.merchant } }, addressCodec);
  }

  async function cancelInvoiceInstruction({ account, signer, confirmedTerms }) {
    const terms = copyTerms(confirmedTerms);
    addressBytes(addressCodec, signer);
    const invoice = await decodeInvoice(account);
    assertConfirmed(invoice, terms);
    check(invoice.status === 'Open', 'INVOICE_NOT_OPEN');
    check(signer === invoice.merchant, 'WRONG_MERCHANT');
    // Expiry does not prevent cancelling an Open invoice. No principal/refund instruction.
    return getCancelInvoiceInstruction({ accounts: { invoice: invoice.address, merchant: signer } }, addressCodec);
  }

  async function inspectInvoice(account, { walletAddress, observedSlot } = {}) {
    if (walletAddress !== undefined) addressBytes(addressCodec, walletAddress);
    if (observedSlot !== undefined) u64(observedSlot, 'observedSlot');
    const invoice = await decodeInvoice(account);
    const expiry = observedSlot === undefined ? 'Unknown' : observedSlot >= invoice.expiresSlot ? 'Expired' : 'Unexpired';
    return {
      invoice, expiry,
      displayStatus: invoice.status === 'Open' && expiry === 'Expired' ? 'Expired' : invoice.status,
      canPay: invoice.status === 'Open' && expiry === 'Unexpired' && walletAddress === invoice.payer,
      canCancel: invoice.status === 'Open' && walletAddress === invoice.merchant,
    };
  }

  return Object.freeze({ deriveInvoiceAddress, decodeInvoice, createInvoiceInstruction, payInvoiceInstruction, cancelInvoiceInstruction, inspectInvoice });
}
