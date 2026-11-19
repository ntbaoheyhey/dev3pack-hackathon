export interface WalletIdentity {
  id: string; // e.g. "Tiệm Cà phê (Merchant):5jq4k5gG2xYdv7FrQdbrAQjUUHWajmrHpQtr2rhEeWbm"
  name: string;
  address: string;
  chains: readonly string[];
}

export interface CreateSnapshot {
  merchant: string;
  payer: string;
  amountLamports: bigint;
  expiresSlot: bigint;
  invoiceId: Uint8Array;
  invoiceIdHex: string;
  pdaAddress: string;
  pdaBump: number;
  rentDepositLamports: bigint;
  estimatedFeeLamports: bigint;
}

export interface PaySnapshot {
  invoiceAddress: string;
  merchant: string;
  payer: string;
  amountLamports: bigint;
  expiresSlot: bigint;
  invoiceId: Uint8Array;
  estimatedFeeLamports: bigint;
}

export interface CancelSnapshot {
  invoiceAddress: string;
  merchant: string;
  payer: string;
  amountLamports: bigint;
  expiresSlot: bigint;
  invoiceId: Uint8Array;
  estimatedFeeLamports: bigint;
}

export const RENT_DEPOSIT_LAMPORTS = 1_802_640n; // LiteSVM sample local measurement
export const ESTIMATED_FEE_LAMPORTS = 10_000n;
export const MAX_U64 = 18446744073709551615n;

export function parseSafeExpiryDelta(val: string): bigint {
  const clean = val.trim();
  if (!/^\d+$/.test(clean)) {
    throw new Error('Số slot hết hạn phải là số nguyên dương hợp lệ.');
  }
  const delta = BigInt(clean);
  if (delta <= 0n) {
    throw new Error('Hạn slot phải lớn hơn 0.');
  }
  if (delta > MAX_U64) {
    throw new Error('Hạn slot vượt quá giá trị tối đa của u64 (18,446,744,073,709,551,615).');
  }
  return delta;
}

export function computePreviewExpiry(
  currentSlot: bigint,
  deltaInput: string
): { slot: bigint | null; error: string | null } {
  try {
    const delta = parseSafeExpiryDelta(deltaInput);
    const targetSlot = currentSlot + delta;
    if (targetSlot > MAX_U64) {
      return { slot: null, error: 'Tổng slot tính toán vượt quá giới hạn u64' };
    }
    return { slot: targetSlot, error: null };
  } catch (err) {
    return { slot: null, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * ReceiptRailReviewController
 * Quản lý trạng thái review snapshots và lifecycle theo chuẩn production
 */
export class ReceiptRailReviewController {
  private activeWallet: WalletIdentity | null = null;
  private selectedInvoiceAddress: string | null = null;
  private inFlightSubmission = false;
  private requestId = 0;

  public createSnapshot: CreateSnapshot | null = null;
  public paySnapshot: PaySnapshot | null = null;
  public cancelSnapshot: CancelSnapshot | null = null;

  public onWalletChange(wallet: WalletIdentity | null): void {
    const currentId = this.activeWallet
      ? `${this.activeWallet.id}:${this.activeWallet.chains.join(',')}`
      : null;
    const nextId = wallet ? `${wallet.id}:${wallet.chains.join(',')}` : null;

    if (currentId !== nextId) {
      this.activeWallet = wallet;
      this.invalidateAllSnapshots();
    }
  }

  public onAccountsOrChainsChange(wallet: WalletIdentity | null): void {
    this.onWalletChange(wallet);
  }

  public onDisconnect(): void {
    this.activeWallet = null;
    this.invalidateAllSnapshots();
  }

  public onSelectInvoice(invoiceAddress: string): void {
    if (this.selectedInvoiceAddress !== invoiceAddress) {
      this.selectedInvoiceAddress = invoiceAddress;
      this.paySnapshot = null;
      this.cancelSnapshot = null;
    }
  }

  public onInputChange(): void {
    this.createSnapshot = null;
  }

  public invalidateAllSnapshots(): void {
    this.createSnapshot = null;
    this.paySnapshot = null;
    this.cancelSnapshot = null;
  }

  public confirmCreate(snapshot: CreateSnapshot): void {
    this.createSnapshot = snapshot;
  }

  public confirmPay(snapshot: PaySnapshot): void {
    this.paySnapshot = snapshot;
  }

  public confirmCancel(snapshot: CancelSnapshot): void {
    this.cancelSnapshot = snapshot;
  }

  public beginSubmission(): () => void {
    if (this.inFlightSubmission) {
      throw new Error('Thao tác đang được thực hiện (in-flight lock), vui lòng không bấm liên tiếp.');
    }
    this.inFlightSubmission = true;
    return () => {
      this.inFlightSubmission = false;
    };
  }

  public isSubmitting(): boolean {
    return this.inFlightSubmission;
  }

  public nextRequestId(): number {
    return ++this.requestId;
  }

  public isCurrentRequest(id: number): boolean {
    return this.requestId === id;
  }
}
