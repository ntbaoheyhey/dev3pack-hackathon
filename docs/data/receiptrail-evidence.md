# ReceiptRail Evidence Report (T23 - V2 Final)

> Ngày cập nhật: 2026-11-18

## 1. Alternatives (≥3, URL đích đã kiểm)
| Alternative | URL đích | Ngày kiểm | Giới hạn | Tác động tới ReceiptRail |
| --- | --- | --- | --- | --- |
| Stripe Idempotency | [https://docs.stripe.com/api/idempotent_requests](https://docs.stripe.com/api/idempotent_requests) | 18/11/2026 | Server-side | ReceiptRail dùng PDA on-chain để chặn thay vì API key. |
| Solana Pay Ref | [https://solana.com/docs/tools/solana-pay/specification/version1-1#reference](https://solana.com/docs/tools/solana-pay/specification/version1-1#reference) | 18/11/2026 | Không unique | ReceiptRail dùng PDA address làm định danh duy nhất. |
| x402 Pay ID | [https://github.com/x402-foundation/x402/blob/main/specs/extensions/payment_identifier.md](https://github.com/x402-foundation/x402/blob/main/specs/extensions/payment_identifier.md) | 18/11/2026 | Application level | ReceiptRail dùng ID on-chain, không phụ thuộc protocol ngoài. |

## 2. Pain Points (2 nguồn độc lập)
| Nguồn | Tác giả/Ngày | Vấn đề | Phạm vi/Hạn chế |
| --- | --- | --- | --- |
| [Shopify Eng](https://shopify.engineering/building-resilient-graphql-apis-using-idempotency) | Todd Jefferson, 27/08/2019 | Idempotency lỗi gây trùng đơn | Web API, không phải Solana. |
| [x402 Issue #452](https://github.com/x402-foundation/x402/issues/452) | winor30, 11/10/2025 | Replay trap trong EIP-3009 | Giao thức EVM, không phải Solana hiện tại. |

## 3. State Machine (PDA & Request)
- **Invoice State**: `Open` -> `Paid` / `Cancelled` / `Expired` (suy từ Open + slot).
- **Request State**: `Pending` -> `Unknown` (Timeout).
- **PDA Logic**: Đọc trạng thái từ `Invoice PDA`. Không thay bằng Solana Pay Reference.

## 4. Phản hồi Findings (T14-R1–R4 & T20-R1–R3)
- **T14-R1/R4**: Đã bổ sung 3 alternatives với URL đích và giới hạn rõ ràng.
- **T14-R2/R3**: Đã tìm 2 nguồn pain độc lập (Shopify, x402) và làm rõ giới hạn của chúng.
- **T20-R1 (State/PDA)**: Khẳng định dùng `Invoice PDA` làm nguồn duy nhất, không dùng Solana Pay.
- **T20-R2/R3 (Evidence)**: Đã làm rõ sự khác biệt giữa các nguồn thực tế (EVM vs Solana) và phản hồi từng mục.
