# Review Kiến trúc ReceiptRail (T13)

> Ngày review: 2026-11-18

## 1. Đối chiếu tài liệu
- **IDEA**: Đã đối chiếu với [IDEA](../IDEA.md).
- **ARCHITECTURE**: Đã đọc [ARCHITECTURE](../ARCHITECTURE.md) (mục 3-8).
- **Artifacts**: Đã đối chiếu với `programs/receiptrail/`, `tests/runtime.rs`, `idl/receiptrail.json`.

## 2. Findings (Nhóm)
- **Account 131 bytes / PDA**: Đã review logic khởi tạo trong `lib.rs` và `runtime.rs`. PDA được sử dụng đúng theo seeds.
- **Race Condition / Duplicate Tx**: Đã kiểm tra logic trong test `runtime.rs`. Việc sử dụng `nonce` và kiểm tra `status` trên PDA giúp ngăn chặn race condition.
- **Scope Receipt**: PDA lưu trữ thông tin thanh toán, đảm bảo `receipt` phản ánh đúng `settlement` on-chain.
- **Bằng chứng thiếu**: Cần kiểm tra kỹ hơn về logic rollback trong trường hợp thanh toán thất bại (đã ghi chú vào phần review).

## 3. Verdict
- Bản thiết kế `8f84cfe` là đầu vào hợp lệ. Các phần logic chính (PDA, trạng thái) đã khớp với `programs/receiptrail/`.
- Cần bổ sung giải thích rõ hơn về kịch bản rollback trong `ARCHITECTURE` để reviewer/A hiểu rõ hơn.
