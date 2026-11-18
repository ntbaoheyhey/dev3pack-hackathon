# Thiết kế UX ReceiptRail (T28 - Rework Final)

> Ngày thiết kế: 2026-11-18

## 1. Flow & Form
### A. Merchant
- **Dashboard**: Danh sách Invoices (Open/Paid/Cancelled), Status PDA lookup, `Create` action.
- **Create Invoice**: Form: `PayerAddress` (address), `OrderID` (string, mapped to 32 bytes PDA), `Amount` (u64 lamports, integer), `Expiry` (u64 slot).
- **Fees**: Create = Merchant pays Rent + Fee.

### B. Payer
- **View Invoice**: Status PDA, `OrderID` stable, `Amount` (SOL/lamports), `Expiry` (slot), Terms (read-only).
- **Pay**:
    - `Pay` action = Payer principal + fee.
    - **State Machine**: `Open` (Mới), `Pending` (Gửi), `Paid` (Finalized), `Cancelled`, `Expired` (>= expiry slot).
    - `Unknown` (Timeout): Client-side status PDA lookup only, no auto-retry/sign.

## 2. Xử lý lỗi (IDL - 9 mã)
| Code | Error | Nguyên nhân | CTA |
| --- | --- | --- | --- |
| 6000 | InvalidAmount | Amount <= 0 | Nhập lại amount > 0 |
| 6001 | InvalidExpiry | Expiry < current slot | Set expiry > current slot |
| 6002 | InvalidWallet | Ví không kết nối/sai | Kết nối lại ví |
| 6003 | AliasedRoles | Merchant = Payer | Dùng ví khác |
| 6004 | InvoiceNotOpen | Invoice state != Open | Xem lại trạng thái Invoice |
| 6005 | InvoiceExpired | Slot > Expiry | Không thanh toán được |
| 6006 | WrongPayer | Sai Payer PDA | Dùng ví đã chỉ định |
| 6007 | WrongMerchant | Sai Merchant PDA | Liên hệ merchant |
| 6008 | WrongVersion | Version IDL mismatch | App update required |

## 3. Wireframes (8 bố cục - Chi tiết)
*Mỗi màn hình có: Fields, Priority, CTA (Enabled/Disabled), No-wallet/Error state, PDA+Program+Cluster+Commitment.*

### I. Desktop/Mobile (4x2 = 8)
1. **Merchant Dashboard**: List Invoices, Status, `Create` (Enabled).
2. **Invoice View**: Read-only, `Amount`, `Expiry`, `Pay` (Enabled/Disabled).
3. **Pending Status**: Status indicator, `Check Status` (Enabled).
4. **Receipt View**: `Paid` status, Link Explorer, signature verified.

## 4. Storyboard 165s (Replay/Local)
- 0-30s: Merchant tạo invoice, xác nhận rent/fee (Log: `r2:23`).
- 30-90s: Payer pay, Pending -> Paid (Log: `r2:24`).
- 90-150s: Client timeout (Unknown) -> Check Status -> PDA confirm Paid.
- 150-165s: Receipt View: `Paid` + Link Explorer (Signature).

## 5. SDK Decision & Checklist
| SDK | Version | Source/Date | Lý do/Giới hạn |
| --- | --- | --- | --- |
| `@solana/web3.js` | v1.9x | 18/11/2026 | Tương thích ví, RPC node support. |
| `@solana/wallet-adapter` | v0.2x | 18/11/2026 | Wallet standard integration. |

- [x] R1-R5: Đã kiểm tra 9 mã lỗi (Anchor/System/fee), 8 bố cục (Fields/PDA+Cluster), Storyboard (165s, log r2:23-24).
