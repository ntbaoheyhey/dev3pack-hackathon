# Thiết kế UX ReceiptRail (T33 - Rework Final)

> Ngày thiết kế: 2026-11-18

## 1. Flow & State Machine
### Bảng 1: Invoice State
| State | Điều kiện | Merchant CTA |
| --- | --- | --- |
| `Open` | Mới khởi tạo | Cancel, Pay (nếu chưa hết hạn) |
| `Paid` | Finalized on-chain | None |
| `Cancelled` | Đã hủy | None |
| `Expired` | `slot` >= `expiry slot` | Merchant vẫn cancel được |

### Bảng 2: Request State
| State | Điều kiện | Payer CTA |
| --- | --- | --- |
| `Pending` | TX đã gửi, chờ xác nhận | Check Status |
| `Unknown` | Timeout (không xác định) | Check Status (PDA lookup) |

## 2. Xử lý lỗi (IDL - 9 mã)
| Code | Error | Nguyên nhân | CTA |
| --- | --- | --- | --- |
| 6000 | InvalidAmount | Amount <= 0 | Nhập amount > 0 |
| 6001 | InvalidExpiry | Expiry <= current slot | Set expiry > current slot |
| 6002 | InvalidWallet | Program-side: account invalid | Kiểm tra ví/account |
| 6003 | AliasedRoles | Payer == Merchant | Dùng ví khác |
| 6004 | InvoiceNotOpen | Invoice state != Open | Kiểm tra trạng thái hóa đơn |
| 6005 | InvoiceExpired | Current slot >= Expiry | Tạo hóa đơn mới |
| 6006 | WrongPayer | Payer Pubkey != Invoice Payer | Dùng đúng ví Payer |
| 6007 | WrongMerchant | Merchant Pubkey != Invoice Merchant | Liên hệ Merchant |
| 6008 | WrongVersion | Version không hỗ trợ | Cập nhật App/Không ký |

## 3. Wireframes (8 bố cục - Desktop/Mobile)
1. **Merchant Dashboard**: List, Status PDA, `Create` (Enabled).
2. **Invoice View**: Read-only, `Amount`, `Expiry`, `Pay` (Enabled/Disabled).
3. **Pending Status**: Indicator, `Check Status` (Enabled).
4. **Receipt View**: `Paid`, Link Explorer (verified signature).
*Lặp lại cho Mobile Responsive (4 màn x 2 = 8).*

## 4. Storyboard (165s Replay)
- 0-30s: Create Invoice (Merchant signs, PDA confirmed).
- 30-90s: Payer Connect -> Pay -> Pending -> Finalized Paid.
- 90-150s: Timeout/Unknown state -> Client PDA check -> Paid confirmed.
- 150-165s: Receipt Final View.

## 5. SDK & Checklist
| SDK | Version | Source/Date | Lý do |
| --- | --- | --- | --- |
| `@solana/web3.js` | v1.9x | 18/11/2026 | Tương thích RPC, Wallet Adapter. |
| `@solana/wallet-adapter` | v0.2x | 18/11/2026 | Tiêu chuẩn Wallet. |

- [x] Đã rework hoàn thiện theo findings T30-R1-R3.
