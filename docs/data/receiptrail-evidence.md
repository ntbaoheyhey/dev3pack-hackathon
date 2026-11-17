# ReceiptRail Evidence Report (T11)

> Ngày thu thập: 2026-11-18

## 1. Nỗi đau: Timeout và Sự cố Retry (ReceiptRail)
- **Nỗi đau**: Sự không nhất quán giữa client và facilitator khi xảy ra sự cố mạng (timeout), dẫn đến nguy cơ double-payment hoặc hiểu lầm trạng thái giao dịch on-chain.
- **Bằng chứng**:
    - [GitHub x402 issue #452](https://github.com/x402-foundation/x402/issues/452): Xác nhận vấn đề về "replay trap" trong các implementation cũ của x402, nơi việc retry một cách ngây thơ có thể gây lỗi hoặc hiểu lầm trạng thái đã settle.
    - [Solana Pay Specification](https://solanapay.com/spec): Tài liệu thiết kế reference key, công cụ cốt lõi để đối chiếu (reconcile) giao dịch on-chain mà không phụ thuộc vào phản hồi HTTP của client, giải quyết vấn đề timeout trong quá trình thanh toán.
- **Phân bác (Negative Evidence)**: Nhiều hệ thống không dùng on-chain reconciliation vì độ trễ (latency) khi query network, thay vào đó chấp nhận rủi ro ở tầng ứng dụng (Application Level) hoặc dùng cách khác (payment channels) thay vì đợi confirmation trực tiếp.

## 2. Alternatives cho ReceiptRail (Stripe, x402, Solana Pay)
- **Stripe Idempotency**: Sử dụng `Idempotency-Key` header để đảm bảo các yêu cầu gửi lại không bị xử lý trùng.
- **Solana Pay Reference**: Sử dụng khóa công khai (reference key) làm định danh on-chain để query trạng thái settlement chính xác, thay vì chỉ dựa vào payload ban đầu.
- **x402 `payment_identifier`**: Sử dụng `payment_identifier` (hoặc payload) như một idempotency key ở tầng ứng dụng (application-level) để cache kết quả settlement.

## 3. Tác động thiết kế
- Cần thiết kế state machine: `Pending` -> `Submitted` -> `Settled/Failed`.
- Phải ưu tiên đối chiếu on-chain qua reference/transaction hash nếu nhận được timeout response từ facilitator, thay vì thử gửi lại lệnh tạo tx mới.
