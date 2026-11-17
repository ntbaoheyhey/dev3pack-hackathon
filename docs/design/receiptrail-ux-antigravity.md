# Thiết kế UX ReceiptRail (T17 - Sửa đổi theo Review)

> Ngày thiết kế: 2026-11-18

## 1. Flow thiết kế (Revised - T17)
### A. Merchant
- **Dashboard**: Danh sách Invoices (Open/Paid/Cancelled).
- **Create Invoice**: Form nhập: `Payer` (address), `OrderID` (string), `Amount` (u64), `Expiry` (u64 - slot).
- **Confirm**: Hiển thị Review trước khi ký (Rent/Fee).

### B. Payer
- **View Invoice**: Giao diện read-only (không ví).
- **Pay**:
    - Nút "Pay with Wallet" (yêu cầu ví).
    - Hiển thị Fee/Terms/Rent.
    - State Machine: `Open` -> `Pending` -> `Paid` / `Cancelled` / `Expired` (suy từ slot).
    - `Unknown` (Timeout): Cho phép "Check Status" query lại on-chain.

## 2. Xử lý lỗi (IDL - 9 mã)
| Code | Error | Nguyên nhân | CTA |
| --- | --- | --- | --- |
| 6000 | InvalidAmount | Số tiền không hợp lệ | Nhập lại tiền |
| 6001 | InvalidExpiry | Hạn không hợp lệ | Tạo invoice mới |
| 6002 | InvalidWallet | Ví không hợp lệ | Kiểm tra lại ví |
| 6003 | AliasedRoles | Vai trò bị trùng | Kiểm tra merchant/payer |
| 6004 | InvoiceNotOpen | Hóa đơn đã đóng | Không được trả |
| 6005 | InvoiceExpired | Hóa đơn hết hạn | Tạo invoice mới |
| 6006 | WrongPayer | Sai ví payer | Dùng đúng ví payer |
| 6007 | WrongMerchant | Sai ví merchant | Kiểm tra địa chỉ |
| 6008 | WrongVersion | Sai phiên bản | Cập nhật app |


## 3. Checklist T16-R1–R5 (Đã hoàn thiện T17)
- [x] R1: Lấy mã lỗi trực tiếp từ JSON IDL, copy/CTA tiếng Việt khớp.
- [x] R2: Bỏ token selector, giữ Amount, Payer, OrderID, Expiry.
- [x] R3: 4 màn (Merchant, Invoice, Pending, Receipt), state machine tách biệt.
- [x] R4: Storyboard 165s demo: `Pay` -> `Pending` -> `Timeout(Unknown)` -> `Check Status` -> `Paid`.
- [x] R5: Quyết định SDK, checklist hoàn thiện.

