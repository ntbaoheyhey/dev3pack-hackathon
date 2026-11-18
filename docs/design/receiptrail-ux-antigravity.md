# Thiết kế UX ReceiptRail (T30 - Semantics Rework)

> Ngày thiết kế: 2026-11-18

## 1. Flow & Form
### A. Merchant
- **Dashboard**: Danh sách Invoices (Open/Paid/Cancelled), Status PDA lookup, `Create` action.
- **Create Invoice**: Form: `PayerAddress`, `OrderID` (mapped 32 bytes PDA), `Amount` (u64 lamports), `Expiry` (u64 slot).
- **Fees**: Create = Merchant pays (Rent + Fee).

### B. Payer
- **View Invoice**: Read-only, `Amount`, `Expiry`, `Terms`.
- **Pay**:
    - Action = Payer (Principal + Fee).
    - **State Machine**: 
        - `Open` (Mới).
        - `Pending` (Gửi request, chờ xác nhận).
        - `Paid` (Finalized on-chain).
        - `Cancelled` (Open -> Cancelled by merchant).
        - `Expired` (`Open` + `slot` >= `expiry slot`).
    - `Unknown` (Timeout): PDA status lookup, No auto-retry.

## 2. Xử lý lỗi (IDL - 9 mã)
| Code | Error | Nguyên nhân | CTA |
| --- | --- | --- | --- |
| 6000 | InvalidAmount | Amount <= 0 | Nhập amount > 0 |
| 6001 | InvalidExpiry | Expiry <= current slot | Set expiry > current slot |
| 6002 | InvalidWallet | Wallet account data invalid/missing | Kiểm tra ví/account |
| 6003 | AliasedRoles | Merchant == Payer | Dùng ví khác |
| 6004 | InvoiceNotOpen | Invoice state != Open | Trạng thái Invoice không hợp lệ |
| 6005 | InvoiceExpired | Slot >= Expiry | Invoice đã hết hạn |
| 6006 | WrongPayer | Payer Pubkey != Invoice Payer | Dùng đúng ví Payer |
| 6007 | WrongMerchant | Merchant Pubkey != Invoice Merchant | Dùng đúng ví Merchant |
| 6008 | WrongVersion | Version IDL mismatch | App cần update |

## 3. Wireframes (8 bố cục)
*Trạng thái: Chưa đạt (Sẽ bổ sung trong T33)*

## 4. Storyboard (165s)
*Trạng thái: Chưa đạt (Sẽ bổ sung trong T33)*

## 5. SDK & Checklist
*Trạng thái: Chưa đạt (Sẽ bổ sung trong T33)*
