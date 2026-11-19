import { client, parseSol, parseExpiryDelta, parseInvoiceIdHex } from './adapter.ts';
import type { ReceiptRailMockEngine } from './adapter.ts';
import { U64_MAX } from '../../../../packages/receiptrail-client/index.mjs';
import type { InvoiceTerms } from './types.ts';

export interface ConfirmationContext {
  walletIdentity: unknown;
  address: string | null;
  chainAllowed: boolean;
  walletEvent: number;
  selectedAddress: string;
  formKey: string;
  slot: bigint;
}
export interface CreateReview {
  merchant: string;
  payer: string;
  invoiceId: Uint8Array;
  amountLamports: bigint;
  expiresSlot: bigint;
  invoiceAddress: string;
  bump: number;
}
export type Action = 'pay' | 'cancel' | 'create';
type Review = InvoiceTerms | CreateReview;
export type Operation = { id: number; revision: number; action: Action; signer: string; review: Review };
type ReadToken = { channel: string; sequence: number; revision: number };
const copy = <T extends Review>(value: T): T => ({ ...value, invoiceId: new Uint8Array(value.invoiceId) });

export async function buildCreateReview(fields: { payer: string; amount: string; expiryDelta: string; invoiceId: string }, merchant: string, slot: bigint): Promise<CreateReview> {
  // Copy and parse before the first await. Never derive an approval from later form values.
  const expiresSlot = slot + parseExpiryDelta(fields.expiryDelta);
  if (expiresSlot > U64_MAX || slot < 0n) throw new Error('Hạn slot vượt giới hạn u64.');
  const snapshot = { merchant, payer: fields.payer.trim(), invoiceId: parseInvoiceIdHex(fields.invoiceId),
    amountLamports: parseSol(fields.amount), expiresSlot };
  const result = await client.createInvoiceInstruction({ ...snapshot, currentSlot: slot });
  return { ...snapshot, invoiceAddress: result.invoiceAddress, bump: result.bump };
}

// The React app uses this same model. No test-only controller, wallet signing or network.
export class ReceiptRailConfirmations {
  private context: ConfirmationContext | null = null;
  private revision = 0;
  private sequence = 0;
  private reads = new Map<string, number>();
  private approvals = new Map<Action, Review>();
  private active: Operation | null = null;

  public get busy() { return this.active !== null; }

  public matches(next: ConfirmationContext) {
    const prev = this.context;
    return !!prev && (Object.keys(next) as (keyof ConfirmationContext)[]).every(k => prev[k] === next[k]);
  }
  public sync(next: ConfirmationContext) {
    if (this.matches(next)) return false;
    this.context = { ...next };
    this.invalidate();
    return true;
  }
  public invalidate() {
    this.revision++;
    this.approvals.clear();
    this.reads.clear();
    // Keep an in-flight lock until its own finally block finishes.
  }
  public has(action: Action, context: ConfirmationContext) { return this.matches(context) && this.approvals.has(action); }
  public clear(action: Action) { this.approvals.delete(action); }
  public confirm(action: Action, review: Review, context: ConfirmationContext) {
    this.sync(context);
    if (!context.address || !context.chainAllowed) throw new Error('Kết nối ví hỗ trợ devnet trước khi xác nhận.');
    if (this.active) throw new Error('Một thao tác còn đang xử lý.');
    if ((action === 'create') !== ('invoiceAddress' in review)) throw new Error('Sai loại điều khoản xác nhận.');
    const expectedSigner = action === 'pay' ? (review as InvoiceTerms).payer : review.merchant;
    if (expectedSigner !== context.address) throw new Error('Ví hiện tại không có vai trò cho thao tác này.');
    if (action !== 'create' && (review as InvoiceTerms).address !== context.selectedAddress) throw new Error('Hóa đơn đã thay đổi; hãy xem lại điều khoản.');
    this.approvals.set(action, copy(review));
  }
  public begin(action: Action, context: ConfirmationContext): Operation {
    this.sync(context);
    if (this.active) throw new Error('Một thao tác còn đang xử lý.');
    const review = this.approvals.get(action);
    if (!review || !context.address || !context.chainAllowed) throw new Error('Điều khoản hoặc ví đã thay đổi; hãy xác nhận lại.');
    const token = { id: ++this.sequence, revision: this.revision, action, signer: context.address, review: copy(review) };
    this.active = token; // Synchronous, before any caller await.
    this.approvals.clear();
    this.reads.clear();
    return { ...token, review: copy(token.review) };
  }
  public finish(token: Operation) { if (this.active?.id === token.id) this.active = null; }
  public isCurrent(token: Operation) { return token.revision === this.revision && this.active?.id === token.id; }
  public beginRead(channel: string, context: ConfirmationContext): ReadToken {
    this.sync(context);
    const sequence = ++this.sequence;
    this.reads.set(channel, sequence);
    return { channel, sequence, revision: this.revision };
  }
  public isCurrentRead(token: ReadToken) {
    return token.revision === this.revision && this.reads.get(token.channel) === token.sequence;
  }
}

// Both the React handlers and Node tests execute this production path. No input
// is read from the live form/selection after approval or after an await.
export async function executeConfirmedOperation(engine: ReceiptRailMockEngine, operation: Operation) {
  const review = copy(operation.review);
  if (operation.action === 'create') {
    if (!('invoiceAddress' in review)) throw new Error('Thiếu điều khoản tạo hóa đơn.');
    return engine.createInvoice(review);
  }
  if (!('address' in review)) throw new Error('Thiếu điều khoản hóa đơn.');
  const input = { invoiceAddress: review.address, signer: operation.signer, confirmedTerms: review };
  return operation.action === 'pay' ? engine.payInvoice(input) : engine.cancelInvoice(input);
}
