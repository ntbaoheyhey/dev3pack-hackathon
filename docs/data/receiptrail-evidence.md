# ReceiptRail Evidence Report (T31 - Rework Final)

> Ngày cập nhật: 2026-11-18

## 1. Alternatives (Nguồn chính xác)
| Alternative | URL đích | Hạn chế | Tác động |
| --- | --- | --- | --- |
| Stripe Idempotency | [Stripe Docs](https://docs.stripe.com/api/idempotent_requests) | Server-side dependency | PDA on-chain (immutable) = unique ID. |
| Solana Pay Ref | [Solana Pay](https://solana.com/docs/tools/solana-pay/specification/version1-1#reference) | Reference không unique | PDA address = unique định danh. |
| x402 Payment ID | [x402 Spec](https://github.com/x402-foundation/x402/blob/main/specs/extensions/payment_identifier.md) | App level dependency | Logic on-chain = không phụ thuộc ngoài. |

## 2. Pain Points (Nguồn độc lập)
| Nguồn | Vấn đề | Điều nguồn không chứng minh |
| --- | --- | --- |
| [Shopify Eng](https://shopify.engineering/building-resilient-graphql-apis-using-idempotency) | Idempotency lỗi gây trùng | Không chứng minh lỗi Solana. |
| [x402 Issue #452](https://github.com/x402-foundation/x402/issues/452) | Replay trap trong EIP-3009 | Không chứng minh double-pay Solana. |

## 3. State Machine & Request
- **Invoice State**: `Open` (Khởi tạo), `Paid` (Finalized), `Cancelled`, `Expired` (`Open` + `slot` >= `expiry slot`).
- **Request State**: `Pending` (Gửi TX), `Unknown` (Timeout - không tự ký/retry).
- **Commitment**: Dùng `finalized` để tránh ambiguity.
- **PDA**: Định danh duy nhất, không dùng Solana Pay reference.

## 4. Phản hồi Findings (T26, T29, T31)
| Mã | Nội dung | Mục sửa |
| --- | --- | --- |
| T26-R1 | Alternatives | 3 alternatives với giới hạn kỹ thuật |
| T26-R2 | Pain sources | Phân biệt EVM vs Solana |
| T26-R3 | State/PDA | PDA làm nguồn định danh duy nhất |
| T29-E1 | State machine | Invoice State, Request State (Pending/Unknown) |
| T29-E2 | Expiry/Commitment | Expiry là nhãn, Paid là state |
| T29-E3 | Tổng hợp | Hoàn thiện bảng phản hồi 13 findings |
| T31-E1 | Provenance | Khôi phục Request Pending/Unknown |
| T31-E2 | Expiry | Bảng expiry-1/expiry/expiry+1 |
