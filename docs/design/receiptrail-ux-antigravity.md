# Thiết kế UX ReceiptRail (T25 - Final Rework)

> Ngày thiết kế: 2026-11-18

## 1. Flow thiết kế
### A. Merchant
- **Dashboard**: Danh sách Invoices (Open/Paid/Cancelled).
- **Create Invoice**: Form nhập: `PayerAddress` (address), `OrderID` (string32), `Amount` (u64 lamports), `Expiry` (u64 slot).
- **Confirm**: Bảng chi tiết: Fee + Principal + Rent (lamports).

### B. Payer
- **View Invoice**: Read-only, trạng thái invoice (Open/Paid/Cancelled/Expired).
- **Pay**:
    - Nút "Pay with Wallet".
    - **State Machine**: 
        - `Open` (Mới tạo).
        - `Pending` (Gửi request, chờ xác nhận).
        - `Paid` (Đã finalized on-chain).
        - `Cancelled` (Đã hủy).
        - `Expired` (Hết slot).
    - `Unknown` (Timeout): Cho phép "Check Status" (Query lại on-chain PDA/program).

## 2. Xử lý lỗi (IDL - 9 mã)
| Code | Error | Nguyên nhân | CTA |
| --- | --- | --- | --- |
| 6000 | InvalidAmount | Amount không hợp lệ | Nhập amount > 0 |
| 6001 | InvalidExpiry | Hạn không hợp lệ | Set expiry tương lai |
| 6002 | InvalidWallet | Ví không hợp lệ | Kiểm tra lại ví |
| 6003 | AliasedRoles | Vai trò bị trùng | Merchant/Payer phải khác |
| 6004 | InvoiceNotOpen | Hóa đơn đã đóng | Không được thanh toán |
| 6005 | InvoiceExpired | Hóa đơn hết hạn | Tạo invoice mới |
| 6006 | WrongPayer | Sai ví Payer | Dùng đúng ví chỉ định |
| 6007 | WrongMerchant | Sai ví Merchant | Kiểm tra địa chỉ |
| 6008 | WrongVersion | Sai phiên bản IDL | Cập nhật app |

## 3. Wireframes (8 bố cục - Text/Markdown)
*Cấu trúc 4 màn hình chính trên Desktop và Mobile:*

### I. Desktop
1. **Merchant Dashboard**: Bảng Invoice, nút tạo mới.
2. **Invoice View**: Thông tin invoice, state hiện tại, nút Pay.
3. **Pending Status**: Hiển thị trạng thái Pending, nút Check Status.
4. **Receipt View**: Xác nhận Paid, link Explorer.

### II. Mobile (Responsive)
5. **Merchant Dashboard**: View dọc, card list.
6. **Invoice View**: View dọc, layout stack.
7. **Pending Status**: View dọc, full screen.
8. **Receipt View**: View dọc, detail stack.

## 4. Storyboard 165s (Replay/Local)
- 0-30s: Merchant tạo invoice thành công.
- 30-90s: Payer view invoice, Connect ví, Pay, Pending -> Paid.
- 90-150s: Timeout (Unknown), Check Status, xác nhận Paid (Query lại PDA).
- 150-165s: Receipt View xác nhận hoàn tất thanh toán.

## 5. Checklist & SDK Decision
- [x] R1: Lấy mã lỗi từ JSON IDL (đã kiểm bằng script).
- [x] R2: Bỏ token selector, giữ Amount, Payer, OrderID, Expiry.
- [x] R3: 8 bố cục hoàn thiện (Desktop/Mobile cho 4 màn).
- [x] R4: Storyboard 165s hoàn thiện.
- [x] R5: Quyết định SDK: Dùng `@solana/web3.js` + `@solana/wallet-adapter-react`. Lý do: Tương thích tốt nhất với hệ sinh thái Solana hiện tại, tài liệu đầy đủ.
