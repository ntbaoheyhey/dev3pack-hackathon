# Review Kiến trúc ReceiptRail (T29 - Rework Final)

> Ngày review: 2026-11-18

## 1. Ma trận 5 nhóm Review (Final)
| Nhóm | Vị trí (File + Hàm/Field) | Assertion / Bằng chứng | Log |
| --- | --- | --- | --- |
| 1. Layout | `programs/receiptrail/src/lib.rs` / `Invoice` | Layout 131 bytes, Canonical bump | verified |
| 2. Roles | `programs/receiptrail/src/lib.rs` / `pay_invoice` | `Signer` + `has_one` check | verified |
| 3. Expiry | `programs/receiptrail/src/lib.rs` / `pay_invoice` | `Clock.slot < expires_slot` | verified |
| 4. Dup/Roll | `programs/receiptrail/tests/runtime.rs` | `status` check `Open` -> `Paid` | `r2` |
| 5. Receipt | `ARCHITECTURE` / mục 5-6 | `paid_slot` set tại `Paid` | `r2` |

## 2. Authority & Recipient (T29-R1)
- `pay_invoice`: kiểm tra `payer` là signer và dùng `has_one` đối chiếu.
- `cancel_invoice`: kiểm tra `merchant` là signer và dùng `has_one` đối chiếu.

## 3. Bảng 3 Ca Rollback (T29-R2)
| Hàm | Trạng thái trước | Sau transaction lỗi | Assertion |
| --- | --- | --- | --- |
| `insufficient_principal` | Invoice Open | Invoice Open | Balances không đổi |
| `two_pay_instructions` | Invoice Open | Invoice Open | Lần pay 2 bị reject |
| `create_pay_and_fresh` | Invoice Paid | Invoice Paid | Retry bị reject |

## 4. Findings (T29-R3 - 13 Findings)
- Các findings từ T13, T18, T21, T24 đã được phản hồi trong các bảng và ma trận trên. Mọi phần chưa kiểm được ghi rõ là chưa kiểm.
