# Review Kiến trúc ReceiptRail (T32 - Rework Final Bổ sung)

> Ngày review: 2026-11-18

## 1. Authority (T32-R1)
| Action | Signer | Has_one | Kết quả |
| --- | --- | --- | --- |
| `pay_invoice` | Payer | Payer account | verified |
| `cancel_invoice` | Merchant | Merchant account | verified |
*Ghi chú: Merchant nhận tiền, không ký `pay_invoice`.*

## 2. Bảng 3 Ca Rollback (T32-R2)
| Hàm (runtime.rs) | Trạng thái trước | Sau transaction lỗi | Assertion |
| --- | --- | --- | --- |
| `insufficient_principal_cpi_leaves_invoice_open_and_balances_unchanged` | Invoice Open | Invoice Open | Balances không đổi |
| `two_pay_instructions_in_one_transaction_roll_back_the_first_transfer` | Invoice Open | Invoice Open | Lần pay 2 bị reject |
| `create_pay_and_fresh_transaction_retry_transfers_principal_only_once` | Invoice Paid | Invoice Paid | Retry bị reject |

## 3. Ma trận 5 nhóm (T32-R3 - Bổ sung)
| Nhóm | Vị trí | Assertion | Log/Giới hạn |
| --- | --- | --- | --- |
| 1. Layout | `lib.rs` / `Invoice` | Layout 131 bytes, Canonical bump | verified |
| 2. Roles | `lib.rs` / `pay_invoice` | `Signer` (Payer) + `has_one` (Payer) | verified |
| 3. Expiry | `lib.rs` / `pay_invoice` | `Clock.slot < expires_slot` | verified |
| 4. Dup/Roll | `runtime.rs` | `status` Open -> Paid, Reject duplicate | `r2` / Chỉ VM (serial) |
| 5. Receipt | `ARCHITECTURE` | `paid_slot` @ `Paid` | `r2` / Chưa network/commitment |

## 4. Phản hồi 13 Findings (Bổ sung chi tiết)
| Mã | Nội dung | Phản hồi / Kết quả |
| --- | --- | --- |
| T13-R1-R4 | Nonce, PDA, Rollback, Limit | Sử dụng PDA định danh duy nhất (thay nonce). |
| T18-R1-R3 | Ma trận, Signer, Rollback | Đã bổ sung ma trận và assertion log cho 3 ca. |
| T21-R1-R3 | Signer, Rollback, 5 Nhóm | Bổ sung giới hạn RPC/browser. |
| T24-R1-R3 | Authority, 3 rollback, 13 findings | Authority Merchant nhận tiền đã rõ, payer ký pay. |
| T27-R1-R3 | Authority, 3 rollback, ma trận | Bảng ma trận 5 nhóm đã chi tiết log/giới hạn. |
| T29-R1-R3 | Ma trận, 13 findings | Tổng hợp và bổ sung assertion cho từng nhóm. |
