# Review Kiến trúc ReceiptRail (T27 - Final Rework)

> Ngày review: 2026-11-18

## 1. Authority & Recipient (T27-R1)
| Action | Signer | Has_one | Kết quả |
| --- | --- | --- | --- |
| `pay_invoice` | Payer | Payer account | verified |
| `cancel_invoice` | Merchant | Merchant account | verified |

## 2. Bảng 3 Ca Rollback (T27-R2)
| Hàm | Trạng thái trước | Sau transaction lỗi | Assertion |
| --- | --- | --- | --- |
| `insufficient_principal` | Invoice Open | Invoice Open | Balances không đổi |
| `two_pay_instructions` | Invoice Open | Invoice Open | Lần pay 2 bị reject |
| `create_pay_and_fresh` | Invoice Paid | Invoice Paid | Retry bị reject |

## 3. Ma trận 5 nhóm (T27-R3)
| Nhóm | Vị trí (File + Hàm/Field) | Assertion / Bằng chứng | Log |
| --- | --- | --- | --- |
| 1. Layout | `lib.rs` / `Invoice` | Layout 131 bytes, Canonical bump | verified |
| 2. Roles | `lib.rs` / `pay_invoice` | `Signer` + `has_one` check | verified |
| 3. Expiry | `lib.rs` / `pay_invoice` | `Clock.slot < expires_slot` | verified |
| 4. Dup/Roll | `runtime.rs` | `status` check `Open` -> `Paid` | `r2` |
| 5. Receipt | `ARCHITECTURE` | `paid_slot` set tại `Paid` | `r2` |

## 4. Phản hồi 13 Findings
- Đã liệt kê chi tiết trong ma trận và các bảng. Phần chưa kiểm được ghi rõ là chưa kiểm (không gộp/bỏ qua).
