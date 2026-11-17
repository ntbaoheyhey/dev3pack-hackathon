# Review Kiến trúc ReceiptRail (T18 - Hoàn thiện)

> Ngày review: 2026-11-18

## 1. Ma trận 5 nhóm Review (T18-R1–R4)

| Nhóm | Vị trí (File + Hàm/Field) | Finding / Mức độ | Trạng thái |
| --- | --- | --- | --- |
| 1. Layout/PDA | `src/lib.rs` / `Invoice` struct, `runtime.rs` / `seeds` | Layout 131 bytes đúng; PDA canonical bump verified trong `lib.rs` | Đạt |
| 2. Roles/Signer | `src/lib.rs` / `create_invoice`, `pay_invoice` | `has_one` check signer/merchant/payer hợp lệ | Đạt |
| 3. Expiry | `src/lib.rs` / `pay_invoice` | `Clock.slot` so sánh với `expires_slot` đúng | Đạt |
| 4. Duplicate/Rollback | `tests/runtime.rs` / `test_duplicate` | `status` check `Open` -> `Paid` ngăn trùng; Rollback hoạt động đúng với `transaction` | Đạt |
| 5. Receipt/RPC | `ARCHITECTURE` / mục 5-6 | `paid_slot` ghi tại `Paid`, `commitment` lưu ý trong `ARCHITECTURE` | Đạt |

## 2. Giải thích kiến trúc
- **Harness::send**: Sử dụng để gửi transaction trong test, tự động lấy `recent blockhash`.
- **Invoice Open check**: `pay_invoice` kiểm tra `Invoice::status == Open` trước khi xử lý, ngăn việc trả cho invoice đã Paid hoặc Cancelled.
- **CPI+Paid**: Chuyển SOL và đánh dấu `Paid` diễn ra trong cùng một transaction (atomic).

## 3. Rollback
- Đối chiếu 3 ca rollback trong `receiptrail-codex.md`:
    - Ca 1 (CPI fail): Đã kiểm tra qua `runtime.rs` test case, transaction thất bại hoàn toàn, không có thay đổi on-chain.
    - Ca 2 (Signer sai): Đã kiểm tra, transaction bị reject ngay lập tức.
    - Ca 3 (Expiry): Đã kiểm tra, `pay` bị từ chối do `slot` vượt quá `expiry`.

## 4. Kết luận
- Review hoàn tất dựa trên source `8f84cfe`, các assertions và log test trong `runtime.rs`.
- Thiết kế đủ điều kiện làm nền tảng triển khai, tuân thủ yêu cầu về tính nhất quán (atomicity) và xử lý race condition.
