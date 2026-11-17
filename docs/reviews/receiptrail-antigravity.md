# Review Kiến trúc ReceiptRail (T21 - Rework R1–R4 & R1–R3)

> Ngày review: 2026-11-18

## 1. Ma trận 5 nhóm Review (T21)

| Nhóm | Vị trí (File + Hàm/Field) | Assertion / Bằng chứng | Finding |
| --- | --- | --- | --- |
| 1. Layout | `src/lib.rs` / `Invoice` | `131 bytes` (verified) | Đạt |
| 2. Signer | `src/lib.rs` / `pay_invoice` | `has_one` check signer/merchant/payer | Đạt |
| 3. Expiry | `src/lib.rs` / `pay_invoice` | `Clock.slot < expires_slot` | Đạt |
| 4. Dup/Roll | `tests/runtime.rs` / `two_pay_instructions_in_one_transaction_roll_back_the_first_transfer` | `status` check `Open` -> `Paid` | Đạt |
| 5. Receipt | `ARCHITECTURE` / mục 5-6 | `paid_slot` set tại `Paid` | Đạt |

## 2. Phản hồi cụ thể (T13 & T18)
- **T13-R1 (Nonce/Race)**: `Harness::send` sử dụng `recent_blockhash` để đảm bảo transaction duy nhất. Race condition chỉ xảy ra theo trình tự tuần tự (serial) trong VM. Không có nonce trong `Invoice` PDA.
- **T13-R2 (Nhóm review)**: Đã liệt kê chi tiết trong ma trận. PDA seeds tuân thủ `[b"invoice-v1", merchant_pubkey, invoice_id_32]`.
- **T13-R3 (Rollback)**:
    - Ca 1: `insufficient_principal_cpi_leaves_invoice_open_and_balances_unchanged` (log r2).
    - Ca 2: `two_pay_instructions_in_one_transaction_roll_back_the_first_transfer` (log r2).
    - Ca 3: `create_pay_and_fresh_transaction_retry_transfers_principal_only_once` (log r2).
- **T13-R4 (Receipt limit)**: Receipt chỉ chứng minh `settlement` on-chain, không chứng minh hàng đã giao.

## 3. Kết luận
- Review đã hoàn thiện dựa trên source `8f84cfe`, các hàm test đã dẫn và log `r2`.
- Thiết kế đảm bảo tính nguyên tử (atomicity) cho thao tác trả tiền.
