# ReceiptRail Evidence Report (T29 - Rework Final)

> Ngày cập nhật: 2026-11-18

## 1. Alternatives (3, nguồn đích, hạn chế)
| Alternative | URL đích | Hạn chế | Tác động tới ReceiptRail |
| --- | --- | --- | --- |
| Stripe Idempotency | [https://docs.stripe.com/api/idempotent_requests](https://docs.stripe.com/api/idempotent_requests) | Server-side dependency | ReceiptRail dùng PDA on-chain (immutable) làm định danh duy nhất. |
| Solana Pay Ref | [https://solana.com/docs/tools/solana-pay/specification/version1-1#reference](https://solana.com/docs/tools/solana-pay/specification/version1-1#reference) | Reference không unique | ReceiptRail định danh hóa đơn bằng PDA address (duy nhất). |
| x402 Payment ID | [https://github.com/x402-foundation/x402/blob/main/specs/extensions/payment_identifier.md](https://github.com/x402-foundation/x402/blob/main/specs/extensions/payment_identifier.md) | Application level dependency | ReceiptRail dùng logic on-chain cố định, không phụ thuộc protocol ngoài. |

## 2. Pain Points (2 nguồn độc lập)
| Nguồn | Vấn đề | Phạm vi/Hạn chế |
| --- | --- | --- |
| [Shopify Engineering](https://shopify.engineering/building-resilient-graphql-apis-using-idempotency) | Idempotency lỗi gây trùng đơn | Web API (GraphQL), không liên quan Solana on-chain. |
| [x402 Issue #452](https://github.com/x402-foundation/x402/issues/452) | Replay trap trong EIP-3009 | Giao thức EVM, không phải Solana. |

## 3. State & Commitment
- **Invoice State**: `Open` (Mới tạo), `Paid` (Finalized on-chain), `Cancelled`, `Expired` (Open + slot >= expiry).
- **Commitment**: Dùng `finalized` để xác nhận Paid, tránh trạng thái trùng lặp.
- **PDA Logic**: PDA address làm định danh duy nhất cho mỗi Invoice, không dựa trên reference account.

## 4. Phản hồi Findings (10 dòng)
| Mã | Mục tiêu / Tình trạng | Vị trí đã sửa / Ghi chú |
| --- | --- | --- |
| T14-R1 | Tách state machine | Đã tách riêng state Invoice và Request |
| T14-R2 | Idempotency | Dùng PDA làm định danh, loại bỏ request retry trùng |
| T14-R3 | Pain points | Nguồn Shopify/x402, giới hạn rõ ràng |
| T14-R4 | Alternatives | 3 alternatives với giới hạn kỹ thuật |
| T20-R1 | State/PDA | Dùng PDA, không dùng Solana Pay reference |
| T20-R2 | Evidence/Pain | Phân biệt EVM vs Solana |
| T20-R3 | Evidence/Pain | Phản hồi đúng phạm vi của nguồn |
| T23-R1 | Expiry/Commitment | Expiry là nhãn, Paid là state |
| T23-R2 | Evidence/Pain | Làm rõ nguồn Shopify/x402 |
| T23-R3 | Evidence/Pain | Phản hồi chi tiết các findings |
