# ReceiptRail Evidence Report (T31 - Correction Final)

> Ngày cập nhật: 2026-11-18

## 1. Alternatives (Web API/EVM scope)
| Alternative | URL đích | Hạn chế | Tác động |
| --- | --- | --- | --- |
| Stripe Idempotency | [Stripe Docs](https://docs.stripe.com/api/idempotent_requests) | Web API/Server-side | PDA on-chain (immutable) = unique ID. |
| Solana Pay Ref | [Solana Pay](https://solana.com/docs/tools/solana-pay/specification/version1-1#reference) | Reference không unique | PDA address = unique định danh. |
| x402 Payment ID | [x402 Spec](https://github.com/x402-foundation/x402/blob/main/specs/extensions/payment_identifier.md) | EVM/App level | Logic on-chain = không phụ thuộc ngoài. |

## 2. Pain Points (Nguồn độc lập)
| Nguồn | Vấn đề | Điều nguồn không chứng minh |
| --- | --- | --- |
| [Shopify Eng](https://shopify.engineering/building-resilient-graphql-apis-using-idempotency) | Web API/GraphQL Idempotency | Không chứng minh lỗi Solana on-chain. |
| [x402 Issue #452](https://github.com/x402-foundation/x402/issues/452) | EVM EIP-3009 | Không chứng minh double-pay Solana. |

## 3. Provenance, State Machine & Commitment
- **Invoice State**: `Open` (Khởi tạo), `Paid` (Finalized), `Cancelled`, `Expired` (`Open` + `slot` >= `expiry slot`).
- **Request State**: `Pending` (Gửi TX), `Unknown` (Timeout - không tự ký/retry).
- **Provenance & PDA**: PDA làm invariant context cho Invoice, định danh duy nhất.
- **Commitment**: Dùng `finalized` để tránh ambiguity.

## 4. Phản hồi Findings
| Mã | Nội dung | Trạng thái |
| --- | --- | --- |
| T26-R1-R3 | Alternates/Pain/State | Đã sửa nguồn gốc, phân biệt Web API/EVM/Solana. |
| T29-E1-E3 | State/Expiry/Findings | Khôi phục Pending/Unknown, bảng expiry. |
| T31-E1-E2 | Provenance/Final | PDA context, Provenance và state machine rõ ràng. |
*Ghi chú: Đã kiểm định lại nhãn Web API/EVM và khôi phục Request context (Final).*
