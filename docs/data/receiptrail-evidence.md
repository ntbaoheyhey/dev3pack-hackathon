# ReceiptRail Evidence Report (T31 - Rework)

> Ngày cập nhật: 2026-11-18

## 1. Alternatives (3, nguồn đích, hạn chế)
| Alternative | URL đích | Hạn chế | Tác động tới ReceiptRail |
| --- | --- | --- | --- |
| Stripe Idempotency | [Stripe Docs](https://docs.stripe.com/api/idempotent_requests) | Server-side dependency | ReceiptRail dùng PDA on-chain (immutable) làm định danh duy nhất. |
| Solana Pay Ref | [Solana Pay](https://solana.com/docs/tools/solana-pay/specification/version1-1#reference) | Reference không unique | ReceiptRail định danh hóa đơn bằng PDA address (duy nhất). |
| x402 Payment ID | [x402 Spec](https://github.com/x402-foundation/x402/blob/main/specs/extensions/payment_identifier.md) | App level dependency | Logic on-chain cố định, không phụ thuộc protocol ngoài. |

## 2. Pain Points (2 nguồn độc lập)
| Nguồn | Vấn đề | Điều nguồn không chứng minh |
| --- | --- | --- |
| [Shopify Engineering](https://shopify.engineering/building-resilient-graphql-apis-using-idempotency) | Idempotency lỗi gây trùng đơn | Web API (GraphQL), không liên quan Solana on-chain. |
| [x402 Issue #452](https://github.com/x402-foundation/x402/issues/452) | Replay trap trong EIP-3009 | Giao thức EVM, không phải Solana. |

## 3. State, Commitment & PDA
- **Invoice State**: `Open` (Khởi tạo), `Paid` (Finalized on-chain), `Cancelled`, `Expired` (`Open` + `slot` >= `expires_slot`).
- **Commitment**: Dùng `finalized` để xác nhận Paid, tránh trạng thái trùng lặp.
- **PDA Logic**: PDA address làm định danh duy nhất cho mỗi Invoice.

## 4. Bảng phản hồi Findings (T26, T29)
| Mã | Nội dung | Mục sửa |
| --- | --- | --- |
| T26-R1 | Alternatives | 3 alternatives với giới hạn kỹ thuật |
| T26-R2 | Pain sources | Phân biệt EVM vs Solana |
| T26-R3 | State/PDA | PDA làm nguồn định danh duy nhất |
| T29-E1 | State machine | Invoice State, Request State |
| T29-E2 | Expiry/Commitment | Expiry nhãn, Paid finalized |
| T29-E3 | Tổng hợp | Hoàn thiện bảng phản hồi findings |
