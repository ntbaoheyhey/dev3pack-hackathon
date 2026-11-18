# ReceiptRail Evidence Report (T26 - Final Rework)

> Ngày cập nhật: 2026-11-18

## 1. Bảng 3 Alternatives
| Alternative | URL nguồn đích | Cơ chế cụ thể | Giới hạn kỹ thuật | Tác động tới ReceiptRail |
| --- | --- | --- | --- | --- |
| Stripe Idempotency | [Stripe Docs](https://docs.stripe.com/api/idempotent_requests) | Idempotency Key | Phụ thuộc Server | Dùng PDA on-chain làm định danh cố định |
| Solana Pay Ref | [Solana Pay](https://solana.com/docs/tools/solana-pay/specification/version1-1#reference) | Reference Account | Không đảm bảo duy nhất | Dùng PDA làm định danh duy nhất (address) |
| x402 Payment ID | [x402 Spec](https://github.com/x402-foundation/x402/blob/main/specs/extensions/payment_identifier.md) | Fingerprint/Cache | App-level only | Logic on-chain cố định, không tùy biến ngoài |

## 2. Bảng 2 Pain Sources
| Nguồn (Tác giả/Ngày) | Vấn đề | Điều nguồn không chứng minh |
| --- | --- | --- |
| [Shopify Eng](https://shopify.engineering/building-resilient-graphql-apis-using-idempotency) | Idempotency lỗi gây trùng | Không phải báo cáo lỗi trùng đơn Solana |
| [x402 Issue #452](https://github.com/x402-foundation/x402/issues/452) | Replay trap trong EIP-3009 | Không chứng minh double-payment trên Solana |

## 3. State, PDA & CTA
- **Invoice State**: `Open` (Khởi tạo), `Paid` (Finalized), `Cancelled`, `Expired` (`Open` + `slot` >= `expires_slot`).
- **Request State**: `Pending` (Gửi request), `Unknown` (Timeout).
- **Commitment**: Dùng `finalized` xác nhận Paid, không dùng `confirmed` để tránh ambiguity.
- **CTA**: Merchant: `Create`, `Cancel`. Payer: `Pay`, `Check Status` (PDA lookup).

## 4. Bảng phản hồi 10 Findings (T14, T20, T23)
| Mã | Nội dung | Trạng thái / Mục sửa |
| --- | --- | --- |
| T14-R1 | Tách state machine | Đã tách riêng state Invoice và Request |
| T14-R2 | Idempotency | Dùng PDA định danh, loại bỏ request trùng |
| T14-R3 | Pain points | Bổ sung Shopify/x402, giới hạn rõ ràng |
| T14-R4 | Alternatives | 3 alternatives với giới hạn kỹ thuật |
| T20-R1 | State/PDA | PDA làm nguồn định danh duy nhất |
| T20-R2 | Pain sources | Phân biệt EVM vs Solana |
| T20-R3 | Pain sources | Phản hồi đầy đủ các phạm vi thực |
| T23-R1 | Expiry/Commitment | Expiry là nhãn, Paid là state finalized |
| T23-R2 | Pain sources | Làm rõ nguồn Shopify/x402 |
| T23-R3 | Pain sources | Phản hồi chi tiết các findings |
