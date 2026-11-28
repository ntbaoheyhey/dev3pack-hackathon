# 018 — Phép thử Blockchain và Solana

> Ngày kiểm tra: 2026-11-17 (Asia/Ho_Chi_Minh). Phạm vi: nghiên cứu/học tập.
> Trạng thái: đã đối chiếu tài liệu.

## 1. Mục tiêu và điều cần nhớ
Xác định khi nào cần Blockchain/Solana để giải quyết vấn đề. Điều kiện tiên quyết: hiểu về trust assumption, settlement, và tính native của Solana.

## 2. Phiên bản và bằng chứng kiểm tra

| Thành phần | Phiên bản hoặc mốc tài liệu | Mức kiểm chứng |
| --- | --- | --- |
| Solana Docs | 2026-11-17 | Đã đọc |
| Dev3pack FAQ | 2026-11-17 | Đã đọc |

## 3. Kiến thức chính

### Phép thử "Có cần Blockchain không?"
Thay vì chỉ so sánh chi phí, hãy so sánh **Trust Assumptions**:
- **Censorship Resistance**: Ai có thể sửa/xóa/chặn state? Người dùng có cần tin một admin không?
- **Asset Ownership**: Quyền tài sản/Settlement/Composability. Blockchain đảm bảo tính không thể đảo ngược của giao dịch.

### Tại sao Solana?
- **Tốc độ và Chi phí**: Phù hợp cho high-frequency transaction.
- **Tính Native (tận dụng đặc trưng)**: 
    - Token-2022: Mở rộng chức năng cho token (transfer fee, interest).
    - PDA (Program Derived Address): Quản lý state phi tập trung.
    - Actions/Blinks: Tương tác người dùng mượt mà ngay trên web/social.

*Lưu ý từ findings A06*: "Tính Native" được đánh giá trên giá trị của primitive, không phải việc liệt kê kỹ thuật.

## 4. Ví dụ hoặc quy trình tối thiểu

*Đã kiểm tra Dev3pack FAQ 2026-11-17: track và partner tracks còn mở. Chưa có Dashboard công bố top 100/signals.*

## 5. Tự kiểm tra

1. Hệ thống có cần sự minh bạch và không phụ thuộc vào một bên trung gian không?
2. Có cần sự đảm bảo về settlement không thể đảo ngược không?
3. Sử dụng tính năng nào của Solana để tối ưu giải pháp?

## 6. Nguồn và độ tin cậy

- [Solana Docs](https://solana.com/) (Chính thức, Truy cập 2026-11-17).
- [Dev3pack FAQ](https://hack.dev3pack.xyz/faq) (Chính thức, Truy cập 2026-11-17).

## 7. Điểm chưa kiểm chứng và bước tiếp theo

- Cần tiếp tục theo dõi cập nhật từ FAQ về tín hiệu và bộ chấm.
- Bước tiếp theo: Sửa note 020.
