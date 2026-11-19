import type { AddressCodec, Instruction } from './runtime.mjs';
export type { AddressCodec, Instruction, AccountMeta } from './runtime.mjs';
export { PROGRAM_ADDRESS, IDL_SHA256 } from './generated.mjs';
export { U64_MAX } from './runtime.mjs';
export declare const SYSTEM_PROGRAM: '11111111111111111111111111111111';
export declare const INVOICE_SIZE: number;
export declare function parseSol(value: string): bigint;
export declare function formatSol(lamports: bigint): string;
export interface ReceiptRailError { readonly code: number; readonly name: string; readonly msg: string; }
export declare function getReceiptRailError(programAddress: string, code: number): ReceiptRailError | null;
export interface PdaInput { programAddress: string; seeds: Uint8Array[]; }
export interface ClientAdapter {
  addressCodec: AddressCodec;
  derivePda(input: PdaInput): Promise<readonly [string, number]> | readonly [string, number];
}
export interface InvoiceAccount { address: string; owner: string; executable: boolean; data: Uint8Array; }
export interface InvoiceTerms {
  readonly address: string;
  readonly merchant: string;
  readonly payer: string;
  readonly invoiceId: Uint8Array;
  readonly amountLamports: bigint;
  readonly expiresSlot: bigint;
}
export interface Invoice extends InvoiceTerms {
  readonly version: 1;
  readonly bump: number;
  readonly status: 'Open' | 'Paid' | 'Cancelled';
  readonly paidSlot: bigint;
}
export interface CreateInvoiceInput {
  merchant: string; payer: string; invoiceId: Uint8Array;
  amountLamports: bigint; expiresSlot: bigint; currentSlot: bigint;
}
export interface InvoiceActionInput { account: InvoiceAccount; signer: string; confirmedTerms: InvoiceTerms; }
export interface ReceiptRailClient {
  deriveInvoiceAddress(merchant: string, invoiceId: Uint8Array): Promise<Readonly<{ address: string; bump: number }>>;
  decodeInvoice(account: InvoiceAccount): Promise<Invoice>;
  createInvoiceInstruction(input: CreateInvoiceInput): Promise<{ invoiceAddress: string; bump: number; instruction: Instruction }>;
  payInvoiceInstruction(input: InvoiceActionInput & { currentSlot: bigint }): Promise<Instruction>;
  cancelInvoiceInstruction(input: InvoiceActionInput): Promise<Instruction>;
  inspectInvoice(account: InvoiceAccount, context?: { walletAddress?: string; observedSlot?: bigint }): Promise<{
    invoice: Invoice; expiry: 'Unknown' | 'Expired' | 'Unexpired'; displayStatus: 'Open' | 'Paid' | 'Cancelled' | 'Expired'; canPay: boolean; canCancel: boolean;
  }>;
}
export declare function createReceiptRailClient(adapter: ClientAdapter): ReceiptRailClient;
