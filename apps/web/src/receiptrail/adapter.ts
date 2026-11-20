import { address, getAddressEncoder, getAddressDecoder, getProgramDerivedAddress } from '@solana/addresses';
import {
  createReceiptRailClient,
  PROGRAM_ADDRESS,
  parseSol,
  formatSol,
  getReceiptRailError,
  SYSTEM_PROGRAM,
  INVOICE_SIZE,
} from '../../../../packages/receiptrail-client/index.mjs';
import type {
  InvoiceRecord,
  InvoiceAccountEnvelope,
  InspectedInvoice,
  SimulatedFault,
  MockWalletAccount,
  InvoiceTerms,
  PendingRecord,
} from './types';

// Layout/discriminator are consumed from the generated IDL contract.
import { CONTRACT } from '../../../../packages/receiptrail-client/generated.mjs';
import { U64_MAX } from '../../../../packages/receiptrail-client/index.mjs';
type Field = { name: string; type: string; size: number; offset: number };
const invoiceSchema = (CONTRACT.structs as Record<string, { discriminator: number[]; size: number; fields: Field[] }>).Invoice;
export const INVOICE_DISCRIMINATOR = new Uint8Array(invoiceSchema.discriminator);
export const MOCK_RENT_LAMPORTS = 1_802_640n; // Local VM sample, not a devnet quote.
export const MOCK_FEE_LAMPORTS = 10_000n; // Separate synthetic fee payer; no real signer.

export const DEFAULT_MERCHANT: MockWalletAccount = {
  name: 'Tiệm Cà phê SOL (Merchant)',
  address: '5jq4k5gG2xYdv7FrQdbrAQjUUHWajmrHpQtr2rhEeWbm',
  role: 'merchant',
  balanceLamports: 15_000_000_000n, // 15 SOL
};

export const DEFAULT_PAYER: MockWalletAccount = {
  name: 'Alice (Payer chỉ định)',
  address: '3r3Q8mD7kEF1ssvkhGBdDD57FfN7MPgzHAvznfD6tQUc',
  role: 'payer',
  balanceLamports: 5_000_000_000n, // 5 SOL
};

export const OTHER_WALLET: MockWalletAccount = {
  name: 'Bob (Ví khác / Hacker)',
  address: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
  role: 'other',
  balanceLamports: 2_000_000_000n, // 2 SOL
};

export const MOCK_WALLETS = [DEFAULT_MERCHANT, DEFAULT_PAYER, OTHER_WALLET];

export const client = createReceiptRailClient({
  addressCodec: {
    encode: (val: string) => new Uint8Array(getAddressEncoder().encode(address(val))),
    decode: (bytes: Uint8Array) => getAddressDecoder().decode(bytes),
  },
  derivePda: ({ programAddress, seeds }) =>
    getProgramDerivedAddress({
      programAddress: address(programAddress),
      seeds,
    }),
});

const codec = {
  encode: (value: string) => new Uint8Array(getAddressEncoder().encode(address(value))),
  decode: (value: Uint8Array) => getAddressDecoder().decode(value),
};
function checkU64(value: bigint, label: string) {
  if (typeof value !== 'bigint' || value < 0n || value > U64_MAX) throw new Error(`INVALID_U64:${label}`);
  return value;
}
function cloneTerms(terms: InvoiceTerms): InvoiceTerms {
  return { address: terms.address, merchant: terms.merchant, payer: terms.payer,
    invoiceId: new Uint8Array(terms.invoiceId), amountLamports: terms.amountLamports, expiresSlot: terms.expiresSlot };
}
function copyAccount(acc: InvoiceAccountEnvelope): InvoiceAccountEnvelope {
  return { ...acc, data: new Uint8Array(acc.data) };
}

export function serializeInvoiceData(invoice: Omit<InvoiceRecord, 'address'>): Uint8Array {
  const statusCodes = { Open: 0, Paid: 1, Cancelled: 2 } as const; // Wire v1 u8, defined by program.
  const values: Record<string, unknown> = { version: invoice.version, bump: invoice.bump,
    merchant: invoice.merchant, payer: invoice.payer, invoice_id: invoice.invoiceId,
    amount_lamports: invoice.amountLamports, expires_slot: invoice.expiresSlot,
    status: statusCodes[invoice.status], paid_slot: invoice.paidSlot };
  if (invoiceSchema.size !== INVOICE_SIZE) throw new Error('MOCK_CONTRACT_SIZE_MISMATCH');
  const data = new Uint8Array(invoiceSchema.size);
  data.set(invoiceSchema.discriminator);
  const view = new DataView(data.buffer);
  for (const field of invoiceSchema.fields) {
    const value = values[field.name];
    if (field.type === 'u64') view.setBigUint64(field.offset, checkU64(value as bigint, field.name), true);
    else if (field.type === 'u8') {
      if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > 255) throw new Error(`INVALID_U8:${field.name}`);
      view.setUint8(field.offset, value);
    } else if (field.type === 'pubkey') data.set(codec.encode(value as string), field.offset);
    else if (field.type === 'bytes') {
      if (!(value instanceof Uint8Array) || value.length !== field.size) throw new Error(`INVALID_BYTES:${field.name}`);
      data.set(value, field.offset);
    } else throw new Error(`UNSUPPORTED_MOCK_FIELD:${field.type}`);
  }
  return data;
}

export function parseInvoiceIdHex(hex: string): Uint8Array {
  const clean = hex.trim().replace(/^0x/i, '');
  if (!/^[0-9a-fA-F]{64}$/.test(clean)) {
    throw new Error('Invoice ID phải đúng 64 ký tự hex (32 bytes). Không tự ý đệm 0 hay cắt ngắn.');
  }
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    bytes[i] = parseInt(clean.substr(i * 2, 2), 16);
  }
  return bytes;
}

export function parseExpiryDelta(val: string): bigint {
  const clean = val.trim();
  if (!/^\d+$/.test(clean)) {
    throw new Error('Số slot hết hạn phải là số nguyên dương hợp lệ.');
  }
  const delta = BigInt(clean);
  if (delta <= 0n) throw new Error('Hạn slot phải lớn hơn 0.');
  return checkU64(delta, 'expiry delta');
}

export function formatWalletError(err: unknown): string {
  if (!err) return 'Lỗi ví không xác định';
  if (typeof err === 'object') {
    const anyErr = err as Record<string, unknown>;
    // Hỗ trợ cả mã 4001 lẫn chuỗi rejection từ Wallet Standard/extension thực tế không ép mã 4001
    if (anyErr.code === 4001 || /reject|denied|user rejected|từ chối/i.test(String(anyErr.message || ''))) {
      return 'Người dùng đã từ chối thao tác trong ví (Rejection)';
    }
    if (typeof anyErr.message === 'string') return anyErr.message;
  }
  return String(err);
}

export class ReceiptRailMockEngine {
  private accounts = new Map<string, InvoiceAccountEnvelope>();
  private pendingRecords = new Map<string, PendingRecord>();
  private busy = new Set<string>();
  private receipts = new Map<string, { signature: string; outcome: 'confirmed' | 'failed' | 'dropped' }>();
  private balances = new Map(MOCK_WALLETS.map(w => [w.address, w.balanceLamports]));
  private rents = new Map<string, bigint>();
  private feePayerLamports = 1_000_000_000n;
  private feesPaid = 0n;
  private sequence = 0;
  private ready: Promise<void>;
  public currentSlot: bigint = 100n;
  public simulatedFault: SimulatedFault = 'none';

  constructor() { this.ready = this.seedDefaultInvoices(); }

  private async seedDefaultInvoices() {
    const seeds = [
      { id: 0x2a, amount: 1_000_000n, expires: 200n, status: 'Open', paid: 0n },
      { id: 0x2b, amount: 2_500_000_000n, expires: 250n, status: 'Paid', paid: 80n },
      { id: 0x2c, amount: 500_000_000n, expires: 300n, status: 'Cancelled', paid: 0n },
    ] as const;
    for (const seed of seeds) {
      const invoiceId = new Uint8Array(32).fill(seed.id);
      const { address: pda, bump } = await client.deriveInvoiceAddress(DEFAULT_MERCHANT.address, invoiceId);
      this.accounts.set(pda, { address: pda, owner: PROGRAM_ADDRESS, executable: false,
        data: serializeInvoiceData({ version: 1, bump, merchant: DEFAULT_MERCHANT.address,
          payer: DEFAULT_PAYER.address, invoiceId, amountLamports: seed.amount,
          expiresSlot: seed.expires, status: seed.status, paidSlot: seed.paid }) });
      this.rents.set(pda, MOCK_RENT_LAMPORTS);
    }
    // These three fixtures are an initial ledger snapshot, not transactions replayed here.
  }

  private async exclusive<T>(addr: string, action: () => Promise<T>): Promise<T> {
    if (this.busy.has(addr) || this.pendingRecords.has(addr)) {
      throw new Error('Hóa đơn đang chờ xử lý / Chờ xác nhận (Pending/Unknown). Thao tác bị khóa đến khi đối soát.');
    }
    this.busy.add(addr); // Synchronous reservation before the first await.
    try { await this.ready; return await action(); }
    finally { this.busy.delete(addr); }
  }

  private signature(action: string) { return `mock-${action}-${++this.sequence}`; }
  private chargeFee() {
    if (this.feePayerLamports < MOCK_FEE_LAMPORTS) throw new Error('MOCK_FEE_PAYER_INSUFFICIENT');
    this.feePayerLamports -= MOCK_FEE_LAMPORTS;
    this.feesPaid += MOCK_FEE_LAMPORTS;
  }
  private accountOrThrow(addr: string) {
    const acc = this.accounts.get(addr);
    if (!acc) throw new Error('Không tìm thấy hóa đơn trong mock ledger');
    return copyAccount(acc);
  }

  public async getAccount(addr: string): Promise<InvoiceAccountEnvelope | null> {
    await this.ready;
    const acc = this.accounts.get(addr);
    return acc ? copyAccount(acc) : null;
  }
  public async listInvoices(): Promise<InvoiceAccountEnvelope[]> {
    await this.ready;
    return [...this.accounts.values()].map(copyAccount);
  }
  public isPending(addr: string): boolean { return this.pendingRecords.has(addr) || this.busy.has(addr); }
  public getPendingRecord(addr: string): PendingRecord | null {
    const r = this.pendingRecords.get(addr);
    return r ? { ...r, confirmedTerms: cloneTerms(r.confirmedTerms) } : null;
  }
  public getRawAccount(addr: string): InvoiceAccountEnvelope | undefined {
    const acc = this.accounts.get(addr);
    return acc ? copyAccount(acc) : undefined;
  }
  public async ledgerSnapshot() {
    await this.ready;
    return { balances: Object.fromEntries(this.balances), rents: Object.fromEntries(this.rents),
      feePayerLamports: this.feePayerLamports, feesPaid: this.feesPaid };
  }

  public async inspect(addr: string, walletAddress?: string): Promise<InspectedInvoice | null> {
    const acc = await this.getAccount(addr);
    if (!acc) return null;
    const res = await client.inspectInvoice(acc, { walletAddress, observedSlot: this.currentSlot });
    const pending = this.isPending(addr);
    return { invoice: res.invoice as InvoiceRecord, expiry: res.expiry, displayStatus: res.displayStatus,
      canPay: !pending && res.canPay, canCancel: !pending && res.canCancel, isPending: pending,
      commitment: pending ? 'processed' : res.invoice.status === 'Open' ? 'processed' : 'confirmed' };
  }

  public async createInvoice(input: { merchant: string; payer: string; invoiceId: Uint8Array;
    amountLamports: bigint; expiresSlot: bigint }): Promise<{ invoiceAddress: string; bump: number }> {
    const snapshot = { ...input, invoiceId: new Uint8Array(input.invoiceId) };
    const pda = await client.deriveInvoiceAddress(snapshot.merchant, snapshot.invoiceId);
    return this.exclusive(pda.address, async () => {
      if (this.accounts.has(pda.address)) throw new Error('Hóa đơn đã tồn tại; không thể tạo lại hoặc reset trạng thái.');
      const result = await client.createInvoiceInstruction({ ...snapshot, currentSlot: this.currentSlot });
      const data = serializeInvoiceData({ ...snapshot, version: 1, bump: result.bump, status: 'Open', paidSlot: 0n });
      this.chargeFee();
      const balance = this.balances.get(snapshot.merchant) ?? 0n;
      if (balance < MOCK_RENT_LAMPORTS) throw new Error('Mock merchant không đủ số dư để đặt rent; chỉ phí mock bị trừ.');
      this.balances.set(snapshot.merchant, balance - MOCK_RENT_LAMPORTS);
      this.rents.set(pda.address, MOCK_RENT_LAMPORTS);
      this.accounts.set(pda.address, { address: pda.address, owner: PROGRAM_ADDRESS, executable: false, data });
      this.receipts.set(pda.address, { signature: this.signature('create'), outcome: 'confirmed' });
      return { invoiceAddress: result.invoiceAddress, bump: result.bump };
    });
  }

  public async payInvoice(input: { invoiceAddress: string; signer: string; confirmedTerms: InvoiceTerms }):
    Promise<{ signature: string; status: 'Confirmed' | 'Unknown' }> {
    const snapshot = { ...input, confirmedTerms: cloneTerms(input.confirmedTerms) };
    const fault = this.simulatedFault;
    return this.exclusive(snapshot.invoiceAddress, async () => {
      const acc = this.accountOrThrow(snapshot.invoiceAddress);
      const slot = checkU64(this.currentSlot, 'bank slot');
      await client.payInvoiceInstruction({ account: acc,
        signer: fault === 'wrong_payer' ? OTHER_WALLET.address : snapshot.signer,
        confirmedTerms: snapshot.confirmedTerms, currentSlot: slot });
      const decoded = await client.decodeInvoice(acc);
      const sig = this.signature('pay');
      if (fault === 'timeout_dropped') {
        this.receipts.set(snapshot.invoiceAddress, { signature: sig, outcome: 'dropped' });
        this.pendingRecords.set(snapshot.invoiceAddress, { signature: sig,
          confirmedTerms: cloneTerms(snapshot.confirmedTerms), submittedSlot: slot, targetStatus: 'Open' });
        return { signature: sig, status: 'Unknown' };
      }
      const payerBalance = this.balances.get(decoded.payer) ?? 0n;
      const merchantBalance = this.balances.get(decoded.merchant) ?? 0n;
      this.chargeFee();
      if (fault === 'cpi_rollback' || payerBalance < decoded.amountLamports || merchantBalance + decoded.amountLamports > U64_MAX) {
        this.receipts.set(snapshot.invoiceAddress, { signature: sig, outcome: 'failed' });
        throw new Error('LỖI MÔ PHỎNG ROLLBACK: số dư không đủ hoặc overflow; ledger/principal giữ nguyên, chỉ trừ phí mock.');
      }
      const data = serializeInvoiceData({ ...decoded, version: 1, status: 'Paid', paidSlot: slot });
      // Atomic mock commit: no await between balances and account transition.
      this.balances.set(decoded.payer, payerBalance - decoded.amountLamports);
      this.balances.set(decoded.merchant, merchantBalance + decoded.amountLamports);
      this.accounts.set(snapshot.invoiceAddress, { ...acc, data });
      this.receipts.set(snapshot.invoiceAddress, { signature: sig, outcome: 'confirmed' });
      if (fault === 'timeout_unknown') {
        // Transaction committed; only the response is lost. Recheck will not execute it.
        this.pendingRecords.set(snapshot.invoiceAddress, { signature: sig,
          confirmedTerms: cloneTerms(snapshot.confirmedTerms), submittedSlot: slot, targetStatus: 'Paid' });
        return { signature: sig, status: 'Unknown' };
      }
      return { signature: sig, status: 'Confirmed' };
    });
  }

  public async cancelInvoice(input: { invoiceAddress: string; signer: string; confirmedTerms: InvoiceTerms }): Promise<{ signature: string }> {
    const snapshot = { ...input, confirmedTerms: cloneTerms(input.confirmedTerms) };
    return this.exclusive(snapshot.invoiceAddress, async () => {
      const acc = this.accountOrThrow(snapshot.invoiceAddress);
      await client.cancelInvoiceInstruction({ account: acc, signer: snapshot.signer, confirmedTerms: snapshot.confirmedTerms });
      const decoded = await client.decodeInvoice(acc);
      const data = serializeInvoiceData({ ...decoded, version: 1, status: 'Cancelled', paidSlot: 0n });
      this.chargeFee();
      this.accounts.set(snapshot.invoiceAddress, { ...acc, data });
      const sig = this.signature('cancel');
      this.receipts.set(snapshot.invoiceAddress, { signature: sig, outcome: 'confirmed' });
      return { signature: sig }; // Rent stays in the account; no refund or principal move.
    });
  }

  public async recheckOnChain(addr: string): Promise<{ status: 'Paid' | 'Open' | 'Cancelled'; signature: string | null;
    outcome: 'confirmed' | 'failed' | 'dropped' | 'none' }> {
    await this.ready;
    if (this.busy.has(addr)) throw new Error('Thao tác mock còn đang xử lý; kiểm tra lại sau.');
    const acc = this.accountOrThrow(addr);
    const receipt = this.receipts.get(addr);
    const pending = this.pendingRecords.get(addr);
    const decoded = await client.decodeInvoice(acc);
    // No account/balance mutation, signature regeneration or implicit resend.
    if (pending && receipt?.signature === pending.signature && this.pendingRecords.get(addr)?.signature === pending.signature) {
      this.pendingRecords.delete(addr);
    }
    return { status: decoded.status, signature: receipt?.signature ?? null, outcome: receipt?.outcome ?? 'none' };
  }

  public warpSlot(delta: bigint) {
    checkU64(delta, 'slot delta');
    this.currentSlot = checkU64(this.currentSlot + delta, 'slot');
  }
  public resetSlot() { this.currentSlot = 100n; }
}

export const mockEngine = new ReceiptRailMockEngine();
export { parseSol, formatSol, getReceiptRailError, PROGRAM_ADDRESS, SYSTEM_PROGRAM };
