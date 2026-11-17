# ReceiptRail Evidence Report (T14 - Bổ sung & Hoàn thiện)

> Ngày thu thập: 2026-11-18

## 1. Nỗi đau: Timeout và Sự cố Retry (ReceiptRail)
- **Nỗi đau**: Sự không nhất quán giữa client và facilitator khi xảy ra sự cố mạng (timeout), dẫn đến nguy cơ double-payment hoặc hiểu lầm trạng thái giao dịch on-chain.
- **Bằng chứng**:
    - [GitHub x402 issue #452](https://github.com/x402-foundation/x402/issues/452): Idempotent retry chuẩn hóa cho `/verify` và `/settle`. Phân biệt: vấn đề này xảy ra ở tầng ứng dụng (Application Level), không phải lỗi giao thức Solana lõi.
    - [Solana Pay Specification](https://solanapay.com/spec): Cơ chế `reference` key để đối chiếu (reconcile) giao dịch on-chain giúp giải quyết vấn đề timeout, đảm bảo tính toàn vẹn (integrity) của thanh toán.
    - **Phân biệt hệ sinh thái**: 
        - **EVM**: Thường dùng transaction hash làm identifier.
        - **Solana**: Dùng `reference` key inject vào tx (giải pháp được khuyến nghị) để query transaction status kể cả khi client timeout không nhận được response.

## 2. Alternatives & State Machine
- **Alternatives**:
    - Stripe: Sử dụng `Idempotency-Key` header (giải pháp tập trung).
    - Solana Foundation Pay: Tích hợp sẵn cơ chế kiểm tra `reference` + transaction status để đảm bảo idempotent.
- **State Machine (Đề xuất)**:
    - `Open` (Mới tạo) -> `Pending` (Đã gửi request thanh toán) -> `Settled` (Thanh toán thành công on-chain) / `Expired` (Hết thời hạn) / `Cancelled` (Người dùng hủy).
    - **Timeout handling**: Khi timeout, luôn chuyển về trạng thái query on-chain qua `reference` để xác định trạng thái thực sự (`Settled` hay vẫn `Pending`), không tự động chuyển thành `Failed`.

## 3. Xác nhận
- Đã tách biệt trạng thái yêu cầu (`Open/Paid/Cancelled/Unknown`) thay vì đánh đồng timeout là thất bại.
- Đã làm rõ sự khác biệt giữa các cơ chế idempotent của x402 (tập trung vào API) và Solana Pay (tập trung vào on-chain artifact).
