export type InvoiceStatus = 'Open' | 'Paid' | 'Cancelled';
export type DisplayStatus = 'Open' | 'Paid' | 'Cancelled' | 'Expired';
export type ExpiryStatus = 'Unknown' | 'Expired' | 'Unexpired';
export type CommitmentLevel = 'processed' | 'confirmed' | 'finalized';

export interface InvoiceTerms {
  readonly address: string;
  readonly merchant: string;
  readonly payer: string;
  readonly invoiceId: Uint8Array;
  readonly amountLamports: bigint;
  readonly expiresSlot: bigint;
}

export interface InvoiceRecord extends InvoiceTerms {
  readonly version: 1;
  readonly bump: number;
  readonly status: InvoiceStatus;
  readonly paidSlot: bigint;
}

export interface InvoiceAccountEnvelope {
  address: string;
  owner: string;
  executable: boolean;
  data: Uint8Array;
}

export interface InspectedInvoice {
  invoice: InvoiceRecord;
  expiry: ExpiryStatus;
  displayStatus: DisplayStatus;
  canPay: boolean;
  canCancel: boolean;
  commitment: CommitmentLevel;
}

export type SimulatedFault =
  | 'none'
  | 'timeout_unknown'
  | 'cpi_rollback'
  | 'duplicate_pay'
  | 'wrong_payer';

export interface MockWalletAccount {
  name: string;
  address: string;
  role: 'merchant' | 'payer' | 'other';
  balanceLamports: bigint;
}
