# Thiết kế UX ReceiptRail (T22 - Final Rework)

> Ngày thiết kế: 2026-11-18

## 1. Flow thiết kế (Revised - T22)
### A. Merchant
- **Dashboard**: Danh sách Invoices (Open/Paid/Cancelled).
- **Create Invoice**: Form nhập: `PayerAddress` (address), `OrderID` (string32), `Amount` (u64 lamports), `Expiry` (u64 slot).
- **Confirm**: Hiển thị bảng chi tiết: Fee + Principal + Rent (lamports) trước khi sign.

### B. Payer
- **View Invoice**: Giao diện read-only, không yêu cầu ví.
- **Pay**:
    - Nút "Pay with Wallet" (đòi hỏi ví).
    - Hiển thị Fee/Principal/Rent.
    - **State Machine**: 
        - `Open` (Mới tạo).
        - `Pending` (Gửi request, chờ xác nhận).
        - `Paid` (Đã finalized on-chain).
        - `Cancelled` (Đã hủy bởi merchant).
        - `Expired` (Hết slot).
    - `Unknown` (Timeout): Cho phép "Check Status" (Query lại on-chain PDA/program).

## 2. Xử lý lỗi (IDL - 9 mã)
| Code | Error | Nguyên nhân | CTA |
| --- | --- | --- | --- |
| 6000 | InvalidAmount | Số tiền không hợp lệ | Nhập amount > 0 |
| 6001 | InvalidExpiry | Hạn không hợp lệ | Set expiry tương lai |
| 6002 | InvalidWallet | Ví không hợp lệ | Kiểm tra lại ví |
| 6003 | AliasedRoles | Vai trò bị trùng | Merchant/Payer phải khác |
| 6004 | InvoiceNotOpen | Hóa đơn đã đóng | Không được thanh toán |
| 6005 | InvoiceExpired | Hóa đơn hết hạn | Tạo invoice mới |
| 6006 | WrongPayer | Sai ví Payer | Dùng đúng ví chỉ định |
| 6007 | WrongMerchant | Sai ví Merchant | Kiểm tra địa chỉ |
| 6008 | WrongVersion | Sai phiên bản IDL | Cập nhật app |

## 3. Checklist T16-R1–R5 (Đã hoàn thiện T22)
- [x] R1: Lấy mã lỗi trực tiếp từ JSON IDL, mapping đúng 9 mã; copy/CTA khớp mục 5 ARCHITECTURE.
- [x] R2: Bỏ token selector, giữ Amount, Payer, OrderID, Expiry.
- [x] R3: 4 màn (Merchant, Invoice, Pending, Receipt), state machine tách biệt, bố cục desktop/mobile.
- [x] R4: Storyboard 165s: `Pay` -> `Pending` -> `Timeout(Unknown)` -> `Check Status` -> `Paid`.
- [x] R5: Quyết định SDK, checklist hoàn thiện: Dùng `@solana/web3.js` + `@solana/wallet-adapter-react`.
