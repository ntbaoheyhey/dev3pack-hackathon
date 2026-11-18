# Review Kiến trúc ReceiptRail (T24 & T27 - Hoàn thiện)

> Ngày review: 2026-11-18

## 1. Ma trận 5 nhóm Review

| Nhóm | Vị trí (File + Hàm/Field) | Assertion / Bằng chứng | Log |
| --- | --- | --- | --- |
| 1. Layout | `programs/receiptrail/src/lib.rs` / `Invoice` | Layout 131 bytes, Canonical bump | verified |
| 2. Roles | `programs/receiptrail/src/lib.rs` / `pay_invoice` | `Signer` check + `has_one` check | verified |
| 3. Expiry | `programs/receiptrail/src/lib.rs` / `pay_invoice` | `Clock.slot < expires_slot` | verified |
| 4. Dup/Roll | `programs/receiptrail/tests/runtime.rs` | `status` check `Open` -> `Paid` | `r2` |
| 5. Receipt | `ARCHITECTURE` / mục 5-6 | `paid_slot` set tại `Paid` | `r2` |

## 2. Authority & Recipient (T27-R1)
- `pay_invoice`: kiểm tra `payer` là signer (`payer(s)`) và dùng `has_one` để đối chiếu `payer` account.
- `cancel_invoice`: kiểm tra `merchant` là signer (`merchant(s)`) và dùng `has_one` để đối chiếu `merchant` account.

## 3. Bảng 3 Ca Rollback (T27-R2)

| Hàm / Dòng | Trạng thái trước | Sau transaction lỗi | Assertion / Log |
| --- | --- | --- | --- |
| `insufficient_principal...` / 263 | Invoice Open | Không đổi | Balances không đổi |
| `two_pay_instructions...` / 238 | Invoice Open | Invoice Open | Lần pay 2 bị reject |
| `create_pay_and_fresh...` / 181 | Invoice Open | Invoice Paid | Retry bị reject |

## 4. Kết luận (T27-R3)
- Review hoàn tất dựa trên source `8f84cfe`, các hàm test đã dẫn và log `r2`.
- Thiết kế đảm bảo tính nguyên tử (atomicity) cho thao tác trả tiền.

