# Review Kiến trúc ReceiptRail (T32 - Final Correction)

> Ngày review: 2026-11-18

## 1. Authority & Recipient (T32-R1 - Sửa)
| Action | Signer | Has_one | Kết quả | Assertion |
| --- | --- | --- | --- | --- |
| `pay_invoice` | Payer | Payer+Merchant | verified | Payer ký, Payer+Merchant PDA check |
| `cancel_invoice` | Merchant | Merchant | verified | Merchant ký, Merchant PDA check |
*Sửa: `pay_invoice` Merchant là SystemAccount, không cần ký.*

## 2. Bảng 3 Ca Rollback (T32-R2 - Sửa Mapping log)
| Hàm (runtime.rs) | Trạng thái trước | Sau transaction lỗi | Assertion | Log |
| --- | --- | --- | --- | --- |
| `insufficient_principal_cpi_leaves_invoice_open_and_balances_unchanged` | Open | Open | Balances không đổi | r2:42 |
| `two_pay_instructions_in_one_transaction_roll_back_the_first_transfer` | Open | Open | Lần pay 2 bị reject | r2:35 |
| `create_pay_and_fresh_transaction_retry_transfers_principal_only_once` | Paid | Paid | Retry bị reject | r2:23-24 |

## 3. Ma trận 5 nhóm (T32-R3 - Sửa Assertion/Giới hạn)
| Nhóm | Vị trí | Assertion | Log/Giới hạn |
| --- | --- | --- | --- |
| 1. Layout | `lib.rs` / `Invoice` | Layout 131 bytes | verified |
| 2. Roles | `lib.rs` / `pay_invoice` | Signer(Payer) + Has_one(Payer, Merchant) | verified |
| 3. Expiry | `lib.rs` / `pay_invoice` | Slot < Expiry | verified |
| 4. Dup/Roll | `runtime.rs` | Status Open -> Paid, Reject duplicate | r2 / VM (serial) |
| 5. Receipt | `ARCHITECTURE` | `paid_slot` @ `Paid` | r2 / Chưa network/commitment |

## 4. Phản hồi 13 Findings (Cập nhật)
| Mã | Nội dung | Phản hồi / Kết quả |
| --- | --- | --- |
| T13-R1-R4 | Nonce, PDA, Rollback, Limit | PDA thay nonce; 3 ca rollback đã rõ. |
| T18-R1-R3 | Ma trận, Signer, Rollback | Đã bổ sung assertion log cho 3 ca. |
| T21-R1-R3 | Signer, Rollback, 5 Nhóm | Ma trận 5 nhóm chi tiết. |
| T24-R1-R3 | Authority, 3 rollback, 13 findings | Merchant là SystemAccount, không ký. |
| T27-R1-R3 | Authority, 3 rollback, ma trận | Đã bổ sung log và assertions vai trò. |
| T29-R1-R3 | Ma trận, 13 findings | Tổng hợp Findings từ các lượt. |
