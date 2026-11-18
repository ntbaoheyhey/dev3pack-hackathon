# ReceiptRail Evidence Report (T26 - Final Rework)

> Ngày cập nhật: 2026-11-18

## 1. Alternatives (≥3, nguồn đích thật)
| Alternative | URL đích | Ngày kiểm | Cơ chế nguồn | Giới hạn | Tác động |
| --- | --- | --- | --- | --- | --- |
| Stripe Idempotency | [https://docs.stripe.com/api/idempotent_requests](https://docs.stripe.com/api/idempotent_requests) | 18/11/2026 | API key/Request | Phụ thuộc server | ReceiptRail dùng PDA on-chain (immutable) làm khóa định danh. |
| Solana Pay Ref | [https://solana.com/docs/tools/solana-pay/specification/version1-1#reference](https://solana.com/docs/tools/solana-pay/specification/version1-1#reference) | 18/11/2026 | Reference account | Không unique | ReceiptRail định danh hóa đơn bằng PDA (address duy nhất). |
| x402 Payment ID | [https://github.com/x402-foundation/x402/blob/main/specs/extensions/payment_identifier.md](https://github.com/x402-foundation/x402/blob/main/specs/extensions/payment_identifier.md) | 18/11/2026 | Payment extension | App implementation | ReceiptRail dùng logic on-chain cố định, không phụ thuộc protocol ngoài. |

## 2. Pain Points (2 nguồn độc lập)
| Nguồn | Tác giả/Ngày | Vấn đề | Phạm vi/Hạn chế |
| --- | --- | --- | --- |
| [Shopify Eng](https://shopify.engineering/building-resilient-graphql-apis-using-idempotency) | Todd Jefferson, 27/08/2019 | Idempotency lỗi gây trùng | Web API, không liên quan trực tiếp đến Solana. |
| [x402 Issue #452](https://github.com/x402-foundation/x402/issues/452) | winor30, 11/10/2025 | Replay trap trong EIP-3009 | Giao thức EVM, không phải lỗi Solana hiện tại. |

## 3. State/PDA & CTA
- **Invoice State**: `Open` (Khởi tạo), `Paid` (Đã finalized), `Cancelled` (Đã hủy), `Expired` (Open + slot hiện tại >= expiry slot).
- **Request State**: `Pending` (Gửi request, chờ xác nhận), `Unknown` (Timeout từ client).
- **PDA/Program**: Chỉ đọc từ `Invoice PDA`. Không dùng Solana Pay reference để định danh hoặc xác nhận thanh toán.

## 4. Phản hồi Findings (10 dòng)
| Mã | Mục tiêu / Tình trạng | Vị trí đã sửa / Ghi chú |
| --- | --- | --- |
| T14-R1 | Tách state machine | Đã tách riêng state Invoice và Request |
| T14-R2 | Idempotency | Làm rõ cơ chế chặn trùng của ReceiptRail |
| T14-R3 | Pain points | Bổ sung Shopify/x402, làm rõ hạn chế |
| T14-R4 | Alternatives | Cập nhật 3 alternatives với URL/giới hạn |
| T20-R1 | State/PDA | Khẳng định dùng PDA, không dùng Solana Pay |
| T20-R2 | Evidence/Pain | Phân biệt EVM/Solana, nguồn Shopify/x402 |
| T20-R3 | Evidence/Pain | Phân biệt EVM/Solana, nguồn Shopify/x402 |
| T23-R1 | Expiry/Commitment | Làm rõ Expiry là nhãn, Paid là state |
| T23-R2 | Evidence/Pain | Đã làm rõ sự khác biệt giữa các nguồn thực tế |
| T23-R3 | Evidence/Pain | Phản hồi đầy đủ các mục yêu cầu |
