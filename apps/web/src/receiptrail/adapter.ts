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

// Discriminator Anchor cố định cho struct Invoice: [51, 194, 250, 114, 6, 104, 18, 164]
export const INVOICE_DISCRIMINATOR = new Uint8Array([51, 194, 250, 114, 6, 104, 18, 164]);

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

export function serializeInvoiceData(invoice: {
  version: 1;
  bump: number;
  merchant: string;
  payer: string;
  invoiceId: Uint8Array;
  amountLamports: bigint;
  expiresSlot: bigint;
  status: 'Open' | 'Paid' | 'Cancelled';
  paidSlot: bigint;
}): Uint8Array {
  const data = new Uint8Array(INVOICE_SIZE);
  // Discriminator
  data.set(INVOICE_DISCRIMINATOR, 0);
  // version
  data[8] = 1;
  // bump
  data[9] = invoice.bump;
  // merchant pubkey
  const merchantBytes = new Uint8Array(getAddressEncoder().encode(address(invoice.merchant)));
  data.set(merchantBytes, 10);
  // payer pubkey
  const payerBytes = new Uint8Array(getAddressEncoder().encode(address(invoice.payer)));
  data.set(payerBytes, 42);
  // invoiceId (32 bytes)
  data.set(invoice.invoiceId.slice(0, 32), 74);
  // amountLamports (u64 little endian)
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  view.setBigUint64(106, invoice.amountLamports, true);
  // expiresSlot (u64 little endian)
  view.setBigUint64(114, invoice.expiresSlot, true);
  // status (0 = Open, 1 = Paid, 2 = Cancelled)
  const statusCode = invoice.status === 'Open' ? 0 : invoice.status === 'Paid' ? 1 : 2;
  data[122] = statusCode;
  // paidSlot (u64 little endian)
  view.setBigUint64(123, invoice.paidSlot, true);

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
  return delta;
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
  public currentSlot: bigint = 100n;
  public simulatedFault: SimulatedFault = 'none';
  public lastSignature: string | null = null;

  constructor() {
    this.seedDefaultInvoices();
  }

  private seedDefaultInvoices() {
    // Invoice 1 (Open): id 32 bytes 0x2a -> PDA EpQUeEpGPoZrDoffujf86a3GnKdBkX7RbvsbXkkfpodo, bump 255
    const invoiceId1 = new Uint8Array(32).fill(0x2a);
    const address1 = 'EpQUeEpGPoZrDoffujf86a3GnKdBkX7RbvsbXkkfpodo';
    const data1 = serializeInvoiceData({
      version: 1,
      bump: 255,
      merchant: DEFAULT_MERCHANT.address,
      payer: DEFAULT_PAYER.address,
      invoiceId: invoiceId1,
      amountLamports: 1_000_000n, // 0.001 SOL
      expiresSlot: 200n,
      status: 'Open',
      paidSlot: 0n,
    });
    this.accounts.set(address1, {
      address: address1,
      owner: PROGRAM_ADDRESS,
      executable: false,
      data: data1,
    });

    // Invoice 2 (Paid): id 32 bytes 0x2b -> PDA GYjxtHoM4wVxbGwHHgcKBpj2C5r5CQw48YMcmgvBywA8, bump 254 (derived canonical PDA)
    const invoiceId2 = new Uint8Array(32).fill(0x2b);
    const address2 = 'GYjxtHoM4wVxbGwHHgcKBpj2C5r5CQw48YMcmgvBywA8';
    const data2 = serializeInvoiceData({
      version: 1,
      bump: 254,
      merchant: DEFAULT_MERCHANT.address,
      payer: DEFAULT_PAYER.address,
      invoiceId: invoiceId2,
      amountLamports: 2_500_000_000n, // 2.5 SOL
      expiresSlot: 250n,
      status: 'Paid',
      paidSlot: 80n,
    });
    this.accounts.set(address2, {
      address: address2,
      owner: PROGRAM_ADDRESS,
      executable: false,
      data: data2,
    });

    // Invoice 3 (Cancelled): id 32 bytes 0x2c -> PDA 5BWMrebjJNr2yANMqzXSwdFjErkxT24TBqDHYjLvEv66, bump 255 (derived canonical PDA)
    const invoiceId3 = new Uint8Array(32).fill(0x2c);
    const address3 = '5BWMrebjJNr2yANMqzXSwdFjErkxT24TBqDHYjLvEv66';
    const data3 = serializeInvoiceData({
      version: 1,
      bump: 255,
      merchant: DEFAULT_MERCHANT.address,
      payer: DEFAULT_PAYER.address,
      invoiceId: invoiceId3,
      amountLamports: 500_000_000n, // 0.5 SOL
      expiresSlot: 300n,
      status: 'Cancelled',
      paidSlot: 0n,
    });
    this.accounts.set(address3, {
      address: address3,
      owner: PROGRAM_ADDRESS,
      executable: false,
      data: data3,
    });
  }

  public async getAccount(addr: string): Promise<InvoiceAccountEnvelope | null> {
    const acc = this.accounts.get(addr);
    if (!acc) return null;
    return {
      address: acc.address,
      owner: acc.owner,
      executable: acc.executable,
      data: new Uint8Array(acc.data),
    };
  }

  public async listInvoices(): Promise<InvoiceAccountEnvelope[]> {
    return Array.from(this.accounts.values()).map((acc) => ({
      address: acc.address,
      owner: acc.owner,
      executable: acc.executable,
      data: new Uint8Array(acc.data),
    }));
  }

  public isPending(addr: string): boolean {
    return this.pendingRecords.has(addr);
  }

  public getPendingRecord(addr: string): PendingRecord | null {
    const r = this.pendingRecords.get(addr);
    return r ? { ...r } : null;
  }

  public getRawAccount(addr: string): InvoiceAccountEnvelope | undefined {
    return this.accounts.get(addr);
  }

  public async inspect(
    addr: string,
    walletAddress?: string
  ): Promise<InspectedInvoice | null> {
    const acc = await this.getAccount(addr);
    if (!acc) return null;
    const res = await client.inspectInvoice(acc, {
      walletAddress,
      observedSlot: this.currentSlot,
    });

    const pending = this.pendingRecords.has(addr);
    return {
      invoice: res.invoice as InvoiceRecord,
      expiry: res.expiry,
      displayStatus: res.displayStatus,
      canPay: pending ? false : res.canPay,
      canCancel: pending ? false : res.canCancel,
      isPending: pending,
      commitment: res.invoice.status === 'Paid' ? 'confirmed' : 'processed',
    };
  }

  public async createInvoice(input: {
    merchant: string;
    payer: string;
    invoiceId: Uint8Array;
    amountLamports: bigint;
    expiresSlot: bigint;
  }): Promise<{ invoiceAddress: string; bump: number }> {
    // P5-01: Kiểm tra chống Duplicate Create / Terminal Reset
    const pda = await client.deriveInvoiceAddress(input.merchant, input.invoiceId);
    if (this.accounts.has(pda.address)) {
      const existing = this.accounts.get(pda.address)!;
      const decoded = await client.decodeInvoice(existing);
      throw new Error(
        `Hóa đơn đã tồn tại tại địa chỉ ${pda.address} (Trạng thái: ${decoded.status}). Không thể tạo lại (chống reset trạng thái).`
      );
    }

    const result = await client.createInvoiceInstruction({
      ...input,
      currentSlot: this.currentSlot,
    });

    const data = serializeInvoiceData({
      version: 1,
      bump: result.bump,
      merchant: input.merchant,
      payer: input.payer,
      invoiceId: input.invoiceId,
      amountLamports: input.amountLamports,
      expiresSlot: input.expiresSlot,
      status: 'Open',
      paidSlot: 0n,
    });

    this.accounts.set(result.invoiceAddress, {
      address: result.invoiceAddress,
      owner: PROGRAM_ADDRESS,
      executable: false,
      data,
    });

    return { invoiceAddress: result.invoiceAddress, bump: result.bump };
  }

  public async payInvoice(input: {
    invoiceAddress: string;
    signer: string;
    confirmedTerms: InvoiceTerms;
  }): Promise<{ signature: string; status: 'Confirmed' | 'Unknown' }> {
    const acc = await this.getAccount(input.invoiceAddress);
    if (!acc) throw new Error('Không tìm thấy tài khoản hóa đơn trên chuỗi');

    // P5-02: Khóa thao tác nếu hóa đơn này đang pending/unknown
    if (this.pendingRecords.has(input.invoiceAddress)) {
      throw new Error(
        'Giao dịch cho hóa đơn này đang ở trạng thái Chờ xác nhận (Pending/Unknown). Thao tác bị khóa cho đến khi đối soát lại.'
      );
    }

    // P5-02: BẮT BUỘC validate với client builder TRƯỚC MỌI FAULT INJECTION
    await client.payInvoiceInstruction({
      account: acc,
      signer: input.signer,
      confirmedTerms: input.confirmedTerms,
      currentSlot: this.currentSlot,
    });

    // Xử lý mô phỏng sự cố sau khi đã vượt qua validation hợp lệ
    if (this.simulatedFault === 'timeout_unknown') {
      const mockSig = 'mock-timeout-sig-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      this.lastSignature = mockSig;
      this.pendingRecords.set(input.invoiceAddress, {
        signature: mockSig,
        confirmedTerms: { ...input.confirmedTerms },
        submittedSlot: this.currentSlot,
        targetStatus: 'Paid',
      });
      return { signature: mockSig, status: 'Unknown' };
    }

    if (this.simulatedFault === 'cpi_rollback') {
      throw new Error(
        'LỖI MÔ PHỎNG ROLLBACK: CPI Transfer thất bại do số dư không đủ. Giao dịch đã bị rollback toàn bộ, tiền gốc không bị trừ, chỉ mất phí giao dịch.'
      );
    }

    // Luồng thanh toán chuẩn thành công
    const decoded = await client.decodeInvoice(acc);
    const updatedData = serializeInvoiceData({
      version: 1,
      bump: decoded.bump,
      merchant: decoded.merchant,
      payer: decoded.payer,
      invoiceId: decoded.invoiceId,
      amountLamports: decoded.amountLamports,
      expiresSlot: decoded.expiresSlot,
      status: 'Paid',
      paidSlot: this.currentSlot,
    });

    this.accounts.set(input.invoiceAddress, {
      address: input.invoiceAddress,
      owner: PROGRAM_ADDRESS,
      executable: false,
      data: updatedData,
    });

    const sig = 'mock-pay-sig-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    this.lastSignature = sig;
    return { signature: sig, status: 'Confirmed' };
  }

  public async cancelInvoice(input: {
    invoiceAddress: string;
    signer: string;
    confirmedTerms: InvoiceTerms;
  }): Promise<{ signature: string }> {
    const acc = await this.getAccount(input.invoiceAddress);
    if (!acc) throw new Error('Không tìm thấy hóa đơn');

    // Khóa thao tác nếu đang pending
    if (this.pendingRecords.has(input.invoiceAddress)) {
      throw new Error('Hóa đơn đang ở trạng thái Chờ xác nhận (Pending/Unknown). Thao tác hủy bị khóa.');
    }

    await client.cancelInvoiceInstruction({
      account: acc,
      signer: input.signer,
      confirmedTerms: input.confirmedTerms,
    });

    const decoded = await client.decodeInvoice(acc);
    const updatedData = serializeInvoiceData({
      version: 1,
      bump: decoded.bump,
      merchant: decoded.merchant,
      payer: decoded.payer,
      invoiceId: decoded.invoiceId,
      amountLamports: decoded.amountLamports,
      expiresSlot: decoded.expiresSlot,
      status: 'Cancelled',
      paidSlot: 0n,
    });

    this.accounts.set(input.invoiceAddress, {
      address: input.invoiceAddress,
      owner: PROGRAM_ADDRESS,
      executable: false,
      data: updatedData,
    });

    const sig = 'mock-cancel-sig-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    this.lastSignature = sig;
    return { signature: sig };
  }

  public async recheckOnChain(
    addr: string
  ): Promise<{ status: 'Paid' | 'Open' | 'Cancelled'; signature: string | null }> {
    const acc = await this.getAccount(addr);
    if (!acc) throw new Error('Không tìm thấy hóa đơn trên chuỗi');

    const pending = this.pendingRecords.get(addr);
    if (!pending) {
      const decoded = await client.decodeInvoice(acc);
      return { status: decoded.status, signature: this.lastSignature };
    }

    const decoded = await client.decodeInvoice(acc);

    // P5-02: Kiểm tra nếu hóa đơn đã bị Cancel trước khi đối soát
    if (decoded.status === 'Cancelled') {
      this.pendingRecords.delete(addr);
      throw new Error('Đối soát thất bại: Hóa đơn đã bị Cancel trước khi giao dịch được xác nhận.');
    }

    // P5-02: Kiểm tra nếu lúc gửi giao dịch đã quá hạn
    if (pending.submittedSlot >= decoded.expiresSlot) {
      this.pendingRecords.delete(addr);
      throw new Error(
        `Đối soát thất bại: Giao dịch được gửi tại slot ${pending.submittedSlot} đã vượt quá hạn slot ${decoded.expiresSlot}. Không thể thanh toán.`
      );
    }

    // Thành công: chuyển sang Paid tại submittedSlot
    const updatedData = serializeInvoiceData({
      version: 1,
      bump: decoded.bump,
      merchant: decoded.merchant,
      payer: decoded.payer,
      invoiceId: decoded.invoiceId,
      amountLamports: decoded.amountLamports,
      expiresSlot: decoded.expiresSlot,
      status: 'Paid',
      paidSlot: pending.submittedSlot,
    });

    this.accounts.set(addr, {
      address: addr,
      owner: PROGRAM_ADDRESS,
      executable: false,
      data: updatedData,
    });

    this.pendingRecords.delete(addr);
    return { status: 'Paid', signature: pending.signature };
  }

  public warpSlot(delta: bigint) {
    this.currentSlot += delta;
  }

  public resetSlot() {
    this.currentSlot = 100n;
  }
}

export const mockEngine = new ReceiptRailMockEngine();
export { parseSol, formatSol, getReceiptRailError, PROGRAM_ADDRESS, SYSTEM_PROGRAM };
