# ReceiptRail UX Design (T12)

> Ngày thiết kế: 2026-11-18

## 1. Flow thiết kế
### A. Merchant
- Create Invoice: Chọn token, nhập số lượng, set expiry time.
- Cancel: Hủy invoice chưa thanh toán (cần sign bằng owner).

### B. Payer
- View Invoice: Xem số tiền, token, trạng thái.
- Pay: Kết nối ví (wallet adapter), ký giao dịch thanh toán.
- Statuses: Open, Pending (đã broadcast), Paid (settled), Expired, Cancelled.

## 2. Xử lý lỗi (Error Mapping)
- No Wallet: Hiện thông báo yêu cầu cài đặt/kết nối ví.
- Rejected: Hiện thông báo "Transaction rejected by user".
- Insufficient Balance: Check balance trước khi pay.
- Timeout (Unknown): Reload status on-chain, không tự trả lại hay tạo ID mới.

## 3. Demo kế hoạch (165s)
- **0s-30s**: Merchant tạo invoice.
- **30s-90s**: Payer scan/truy cập, pay và chờ xác nhận.
- **90s-150s**: Xử lý lỗi (ví dụ: reject), reload state.
- **150s-165s**: Kiểm tra trạng thái cuối trên on-chain.
