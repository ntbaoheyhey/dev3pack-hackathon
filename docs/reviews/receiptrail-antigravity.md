# Review Kiến trúc ReceiptRail (T32 - Rework Final)

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

## 3. Ma trận 5 nhóm (T32-R3)
| Nhóm | Vị trí | Assertion | Log |
| --- | --- | --- | --- |
| 1. Layout | `lib.rs` / `Invoice` | Layout 131 bytes, Canonical bump | verified |
| 2. Roles | `lib.rs` / `pay_invoice` | `Signer` + `has_one` | verified |
| 3. Expiry | `lib.rs` / `pay_invoice` | `Clock.slot < expires_slot` | verified |
| 4. Dup/Roll | `runtime.rs` | `status` Open -> Paid | `r2` |
| 5. Receipt | `ARCHITECTURE` | `paid_slot` @ `Paid` | `r2` |

## 4. Phản hồi 13 Findings (T13, T18, T21, T24, T27, T29)
| Mã | Nội dung | Trạng thái |
| --- | --- | --- |
| T13-R1-R4 | Nonce, PDA, Rollback, Limit | Đã giải quyết / Đang theo dõi |
| T18-R1-R3 | Ma trận, Signer, Rollback | Đã giải quyết |
| T21-R1-R3 | Signer, Rollback, 5 Nhóm | Đã giải quyết |
| T24-R1-R3 | Authority, 3 rollback, 13 findings | Đã hoàn thiện |
| T27-R1-R3 | Authority, 3 rollback, ma trận | Đã hoàn thiện |
| T29-R1-R3 | Ma trận, 13 findings | Đã tổng hợp |
