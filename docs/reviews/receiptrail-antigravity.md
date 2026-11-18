# Review Kiến trúc ReceiptRail (T32 - Rework Final)

> Ngày review: 2026-11-18

## 1. Authority & Recipient (T32-R1 - Chính xác hóa)
| Action | Signer | Has_one | Kết quả | Assertion |
| --- | --- | --- | --- | --- |
| `pay_invoice` | Payer | Payer (Signer), Merchant (SystemAccount) | verified | Payer ký, Payer+Merchant Has_one |
| `cancel_invoice` | Merchant | Merchant (Signer) | verified | Merchant ký, Merchant Has_one |
*Ghi chú: Merchant (SystemAccount) trong `pay_invoice` không ký.*

## 2. Bảng 3 Ca Rollback (T32-R2 - Log sửa)
| Hàm (runtime.rs) | Trạng thái trước | Sau transaction lỗi | Assertion | Log (r2) |
| --- | --- | --- | --- | --- |
| `insufficient_principal_cpi...` | Open | Open | Balances không đổi | 26 |
| `two_pay_instructions_in_one_transaction...` | Open | Open | Lần pay 2 bị reject | 39 |
| `create_pay_and_fresh_transaction...` | Paid | Paid | Retry bị reject | 23-24 |

## 3. Ma trận 5 nhóm (T32-R3)
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
| T18-R1-R3 | Ma trận, Signer, Rollback | Bổ sung log r2:26, 39, 23-24. |
| T21-R1-R3 | Signer, Rollback, 5 Nhóm | Ma trận 5 nhóm chi tiết từng file/hàm. |
| T24-R1-R3 | Authority, 3 rollback, 13 findings | Merchant là SystemAccount, Has_one, không ký. |
| T27-R1-R3 | Authority, 3 rollback, ma trận | Đã bổ sung log và assertions vai trò. |
| T29-R1-R3 | Ma trận, 13 findings | Tổng hợp Findings từ các lượt. |
