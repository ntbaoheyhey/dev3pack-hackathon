# ReceiptRail Evidence Report (T15 - Bổ sung hẹp & Rework)

> Ngày cập nhật: 2026-11-18

## 1. Phân tách trạng thái Invoice (T15)
- **State Machine Rework**:
    - `Invoice Status`:
        - `Open`: Vừa tạo, chưa thanh toán.
        - `Paid`: Đã nhận thanh toán (Settled on-chain).
        - `Cancelled`: Người dùng đã hủy.
        - `Expired`: Hết hạn (tự suy từ `slot`).
    - `Request Status`:
        - `Pending`: Đang đợi thanh toán.
        - `Unknown`: Timeout từ client (phải query on-chain để xác định là `Paid`, `Open` hay `Cancelled`).

## 2. Alternatives & Pain Points (Review)
| Alternative | Claim | Giới hạn |
| --- | --- | --- |
| Stripe | Idempotency Key cơ chế trung tâm | Không dùng on-chain trực tiếp. |
| Solana Pay | Reference account | Dễ bị nhầm với Solana Foundation Pay. |
| x402 | Payment Identifier (Application level) | Phụ thuộc vào implementation của API. |

## 3. Xác nhận từ Ledger/Note021
- **Phân biệt**: Đã tách biệt Solana Pay (cơ chế cơ bản) và Solana Foundation Pay (cơ chế đầy đủ).
- **Issue452**: Ghi nhận giới hạn là vấn đề của EVM, cần tránh nhầm lẫn với Solana nonce.
- **Nguồn mới**: Đã bổ sung dữ liệu đối chiếu từ ledger local (Note021) để củng cố evidence cho pain points.
