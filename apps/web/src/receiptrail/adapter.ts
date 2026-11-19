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
} from './types';

// Discriminator Anchor cố định cho struct Invoice: [51, 194, 250, 114, 6, 104, 18, 164]
const INVOICE_DISCRIMINATOR = new Uint8Array([51, 194, 250, 114, 6, 104, 18, 164]);

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
  public currentSlot: bigint = 100n;
  public simulatedFault: SimulatedFault = 'none';
  public lastSignature: string | null = null;
  public pendingUnknownAddress: string | null = null;

  constructor() {
    this.seedDefaultInvoices();
  }

  private seedDefaultInvoices() {
    // Invoice 1: Hóa đơn Open tiêu chuẩn từ fixture
    const invoiceId1 = new Uint8Array(32).fill(0x2a); // '***...'
    const bump1 = 255;
    const address1 = 'EpQUeEpGPoZrDoffujf86a3GnKdBkX7RbvsbXkkfpodo';
    const data1 = serializeInvoiceData({
      version: 1,
      bump: bump1,
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

    // Invoice 2: Hóa đơn đã Paid tại slot 80
    const invoiceId2 = new Uint8Array(32).fill(0x2b);
    const bump2 = 254;
    const address2 = '9a7xKx9n5sC1jP3qL7wR2tM4vN8bX6yZ1uE3dF5gH7jK';
    const data2 = serializeInvoiceData({
      version: 1,
      bump: bump2,
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
    return {
      invoice: res.invoice as InvoiceRecord,
      expiry: res.expiry,
      displayStatus: res.displayStatus,
      canPay: res.canPay,
      canCancel: res.canCancel,
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

    // Kiểm tra mô phỏng sự cố (Fault Injection)
    if (this.simulatedFault === 'timeout_unknown') {
      const mockSig = 'mock-timeout-sig-' + Date.now().toString(36);
      this.lastSignature = mockSig;
      this.pendingUnknownAddress = input.invoiceAddress;
      // Không đổi status ngay, đưa vào Unknown
      return { signature: mockSig, status: 'Unknown' };
    }

    if (this.simulatedFault === 'cpi_rollback') {
      // Bắt chước lỗi CPI thiếu tiền: transaction rollback, principal không đổi, chỉ mất phí
      throw new Error(
        'LỖI MÔ PHỎNG ROLLBACK: CPI Transfer thất bại do số dư không đủ. Giao dịch đã bị rollback toàn bộ, tiền gốc không bị trừ, chỉ mất phí giao dịch.'
      );
    }

    if (this.simulatedFault === 'wrong_payer') {
      // Gọi builder với signer sai để chứng minh client/program chặn
      await client.payInvoiceInstruction({
        account: acc,
        signer: OTHER_WALLET.address, // Ví sai
        confirmedTerms: input.confirmedTerms,
        currentSlot: this.currentSlot,
      });
    }

    // Luồng thanh toán chuẩn
    await client.payInvoiceInstruction({
      account: acc,
      signer: input.signer,
      confirmedTerms: input.confirmedTerms,
      currentSlot: this.currentSlot,
    });

    // Cập nhật trạng thái sang Paid
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

    const sig = 'mock-pay-sig-' + Math.random().toString(36).substring(2, 10);
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

    const sig = 'mock-cancel-sig-' + Math.random().toString(36).substring(2, 10);
    this.lastSignature = sig;
    return { signature: sig };
  }

  public async recheckOnChain(
    addr: string
  ): Promise<{ status: 'Paid' | 'Open' | 'Cancelled'; signature: string | null }> {
    // Khi người dùng bấm kiểm tra lại on-chain sau timeout:
    // Nếu trước đó đang ở pendingUnknown, mô phỏng việc transaction thực ra đã được cluster confirm
    const acc = await this.getAccount(addr);
    if (!acc) throw new Error('Không tìm thấy hóa đơn');

    if (this.pendingUnknownAddress === addr) {
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
      this.accounts.set(addr, {
        address: addr,
        owner: PROGRAM_ADDRESS,
        executable: false,
        data: updatedData,
      });
      this.pendingUnknownAddress = null;
      return { status: 'Paid', signature: this.lastSignature };
    }

    const decoded = await client.decodeInvoice(acc);
    return { status: decoded.status, signature: this.lastSignature };
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
