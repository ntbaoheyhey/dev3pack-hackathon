# ReceiptRail Evidence Report (T20 - Rework & Completeness)

> Ngày cập nhật: 2026-11-18

## 1. Alternatives (≥3, có URL kiểm được)
| Alternative | URL | Ngày mở/Kết quả | Giới hạn |
| --- | --- | --- | --- |
| Stripe Idempotency | [Stripe API](https://docs.stripe.com/api/idempotent_requests) | 18/11/2026 - Truy cập được | Phụ thuộc server-side. |
| Solana Pay Reference | [Solana Pay](https://solana.com/docs/tools/solana-pay/specification/version1-1#reference) | 18/11/2026 - Truy cập được | Không phải "Solana Foundation Pay". |
| x402 Payment ID | [x402 Spec](https://github.com/x402-foundation/x402/blob/main/specs/extensions/payment_identifier.md) | 18/11/2026 - Truy cập được | Cần implementation riêng. |

## 2. Pain Points (≥2 nguồn độc lập)
| Nguồn | Vấn đề | Phạm vi |
| --- | --- | --- |
| [Shopify Engineering](https://shopify.engineering/building-resilient-graphql-apis-using-idempotency) | Idempotency lỗi gây trùng đơn. | Web API. |
| [x402 Issue #452](https://github.com/x402-foundation/x402/issues/452) | Replay trap trong thanh toán. | Blockchain/x402. |

## 3. Phản hồi Findings (T14-R1–R4)
- **T14-R1 (Alternatives)**: Đã bổ sung 3 alternatives với URL và ngày truy cập.
- **T14-R2 (Pain Sources)**: Đã tìm 2 nguồn pain độc lập (Shopify và x402).
- **T14-R3 (Replay Trap)**: Đã làm rõ x402 issue 452 liên quan đến ứng dụng, không phải lỗi giao thức lõi.
- **T14-R4 (State Machine)**: Đã tách Invoice (Open/Paid/Cancelled) và Request (Pending/Unknown) theo ARCHITECTURE.
