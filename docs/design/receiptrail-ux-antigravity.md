# Thiết kế UX ReceiptRail (T16 - Sửa đổi theo Review)

> Ngày thiết kế: 2026-11-18

## 1. Flow thiết kế (Revised)
### A. Merchant
- **Dashboard**: Hiển thị bảng danh sách Invoices (Open/Paid/Cancelled).
- **Create Invoice**: Form nhập: Payer Address, ID (Business/Order ID), Amount (Token Selector), Expiry (Slot/Time).
- **Confirm**: Hiển thị Review (Rent/Fee) trước khi ký.

### B. Payer
- **View Invoice**: Giao diện không cần ví (Read-only) để xem thông tin.
- **Pay**:
    - Nút "Pay with Wallet" (yêu cầu ví).
    - Hiển thị đầy đủ Fees/Terms/Rent.
    - Xử lý các state: `Pending` (Gửi request), `Paid` (On-chain confirmed), `Unknown` (Timeout).
- **Reload**: Nếu `Unknown` (Timeout), cho phép người dùng click "Check Status" để query lại on-chain.

## 2. Xử lý lỗi (Error Mapping & IDL)
| Code | Error | Nguyên nhân | CTA |
| --- | --- | --- | --- |
| 6000 | InvalidOwner | Payer không khớp | Check lại địa chỉ |
| 6001 | InvoiceExpired | Đã quá expiry | Tạo invoice mới |
| 6002 | InvoicePaid | Đã thanh toán | Không làm gì |
| 6003 | InsufficientBalance | Không đủ token | Nạp token |
| 6004 | InvalidAmount | Amount <= 0 | Nhập lại |
| 6005 | InvalidToken | Sai mint | Kiểm tra Token |
| 6006 | ReplayTx | Trùng tx | ID đã tồn tại |
| 6007 | InvalidSigner | Signer không khớp | Kiểm tra lại ví |
| 6008 | ProgramMismatch | IDL mismatch | Kiểm tra env |

## 3. Storyboard (165s)
- **0s-30s**: Merchant tạo invoice (nhập amount, token, expiry).
- **30s-90s**: Payer vào view invoice, connect ví, thực hiện thanh toán (Pending -> Paid).
- **90s-150s**: Timeout/Unknown state, người dùng reload/check status, hệ thống query on-chain thành công.
- **150s-165s**: Receipt hiển thị đầy đủ, check lại tx on-chain.

## 4. Checklist R1-R5 (T16)
- [ ] R1: Wireframe đầy đủ (Merchant, Invoice, Pending, Receipt) trên Desktop + Mobile.
- [ ] R2: Tách biệt trạng thái `Request`, `Invoice`, `Expired` và `Unknown`.
- [ ] R3: Đảm bảo đọc trạng thái từ PDA, không thay bằng reference.
- [ ] R4: Bảng lỗi IDL 6000-6008 có copy/CTA chi tiết.
- [ ] R5: Demo replay tx, storyboard đạt 165s, decision về SDK được ghi rõ nguồn.
