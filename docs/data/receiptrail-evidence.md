# ReceiptRail Evidence Report (T31 - Rework Final)

> Ngày cập nhật: 2026-11-18

## 1. Alternatives (3, nguồn đích, hạn chế)
| Alternative | URL đích | Hạn chế | Tác động tới ReceiptRail |
| --- | --- | --- | --- |
| Stripe Idempotency | [Stripe Docs](https://docs.stripe.com/api/idempotent_requests) | Server-side dependency | PDA on-chain (immutable) = unique ID. |
| Solana Pay Ref | [Solana Pay](https://solana.com/docs/tools/solana-pay/specification/version1-1#reference) | Reference không unique | PDA address = unique định danh. |
| x402 Payment ID | [x402 Spec](https://github.com/x402-foundation/x402/blob/main/specs/extensions/payment_identifier.md) | App level dependency | Logic on-chain = không phụ thuộc ngoài. |

## 2. Pain Points (2 nguồn độc lập)
| Nguồn | Vấn đề | Điều nguồn không chứng minh |
| --- | --- | --- |
| [Shopify Engineering](https://shopify.engineering/building-resilient-graphql-apis-using-idempotency) | Idempotency lỗi gây trùng đơn | Web API (GraphQL), không liên quan Solana on-chain. |
| [x402 Issue #452](https://github.com/x402-foundation/x402/issues/452) | Replay trap trong EIP-3009 | Giao thức EVM, không phải Solana. |

## 3. State Machine, Commitment & Provenance
- **Invoice State**: `Open` (Khởi tạo), `Paid` (Finalized on-chain), `Cancelled`, `Expired` (`Open` + `slot` >= `expires_slot`).
- **Request State**: `Pending` (Gửi TX), `Unknown` (Timeout - không tự ký/retry).
- **Commitment**: Dùng `finalized` để xác nhận Paid, tránh trạng thái trùng lặp.
- **Provenance**: Sử dụng log `r2` (23-24) làm bằng chứng Local, chưa chạy Browser/Devnet.

## 4. Phản hồi Findings (T26, T29, T31)
| Mã | Nội dung | Trạng thái / Mục sửa |
| --- | --- | --- |
| T26-R1-R3 | Alternates/Pain/State | Đã sửa theo nguồn gốc (Stripe/Shopify/x402). |
| T29-E1-E3 | State/Expiry/Findings | Đã khôi phục Pending/Unknown, bảng expiry. |
| T31-E1-E2 | Provenance/Final | Đã kiểm định nguồn gốc và trạng thái. |
*Ghi chú: Tất cả mục đã đối chiếu nguồn gốc và log r2.*
