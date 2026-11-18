# Review Kiến trúc ReceiptRail (T32 - Supplement Patch)

> Ngày review: 2026-11-18

## 1. Authority & Recipient (T32-R1 - Bổ sung)
| Action | Signer | Has_one | Kết quả | Assertion |
| --- | --- | --- | --- | --- |
| `pay_invoice` | Payer | Payer+Merchant | verified | Payer ký, Payer+Merchant tồn tại |
| `cancel_invoice` | Merchant | Merchant | verified | Merchant ký, Merchant tồn tại |

## 2. Bảng 3 Ca Rollback (T32-R2 - Bổ sung log/assertion)
| Hàm (runtime.rs) | Trạng thái trước | Sau transaction lỗi | Assertion | Log |
| --- | --- | --- | --- | --- |
| `insufficient_principal_cpi_leaves_invoice_open_and_balances_unchanged` | Invoice Open | Invoice Open | Balances không đổi | r2:42 |
| `two_pay_instructions_in_one_transaction_roll_back_the_first_transfer` | Invoice Open | Invoice Open | Lần pay 2 bị reject | r2:35 |
| `create_pay_and_fresh_transaction_retry_transfers_principal_only_once` | Invoice Paid | Invoice Paid | Retry bị reject, sig khác | r2:23-24 |

## 3. Ma trận 5 nhóm (T32-R3 - Bổ sung)
| Nhóm | Vị trí | Assertion / Kết quả | Log/Giới hạn |
| --- | --- | --- | --- |
| 1. Layout | `lib.rs` / `Invoice` | Layout 131 bytes, Canonical bump | verified |
| 2. Roles | `lib.rs` / `pay_invoice` | Signer/Has_one | verified |
| 3. Expiry | `lib.rs` / `pay_invoice` | Slot < Expiry | verified |
| 4. Dup/Roll | `runtime.rs` | Status Open -> Paid, Reject duplicate | r2 / VM (serial) |
| 5. Receipt | `ARCHITECTURE` | `paid_slot` @ `Paid` | r2 / Chưa network |

## 4. Phản hồi 13 Findings (Bổ sung chi tiết)
| Mã | Nội dung | Phản hồi / Kết quả |
| --- | --- | --- |
| T13-R1-R4 | Nonce, PDA, Rollback, Limit | Sử dụng PDA thay nonce; 3 ca rollback đã rõ. |
| T18-R1-R3 | Ma trận, Signer, Rollback | Bổ sung log r2:42, 35, 23-24 cho assertion. |
| T21-R1-R3 | Signer, Rollback, 5 Nhóm | Ma trận 5 nhóm chi tiết từng file/hàm. |
| T24-R1-R3 | Authority, 3 rollback, 13 findings | Merchant nhận tiền, không ký pay. |
| T27-R1-R3 | Authority, 3 rollback, ma trận | Đã bổ sung log và assertions cho các role. |
| T29-R1-R3 | Ma trận, 13 findings | Tổng hợp Findings từ các lượt. |
