# ReceiptRail — nháp video 165 giây

Codex · 19/11/2026 · trước sự kiện. Đây là kịch bản và lời thoại cho bản 165 giây, **chưa phải video thuyết trình hoàn chỉnh**. T37 có bản diễn tập UI 33.08 giây qua route fix; chưa chứng minh source chưa sửa chạy được. T37 quay thử bằng Playwright recordVideo/cache, chỉ localhost/mock; ghi duration của file thật khi context đã đóng. Bản quay thử không có lời thoại không được gọi là video nộp bài hoàn chỉnh.

| Thời gian | Thao tác / hình | Lời thoại tiếng Việt đề xuất |
| --- | --- | --- |
|0:00–0:15 (15s)|Hóa đơn Open và nhãn MOCK rõ|“Khi thanh toán mất phản hồi, người trả thường không biết nên thử lại hay chờ. ReceiptRail giúp hai bên kiểm tra cùng một hóa đơn.”|
|0:15–0:35 (20s)|Merchant, payer, amount, expiry, invoiceID/PDA đầy đủ|“Mỗi hóa đơn có người nhận, người trả, số SOL và hạn đã chốt. Bản giao diện đang xem dùng dữ liệu giả, không chuyển SOL.”|
|0:35–1:00 (25s)|Mock Tiệm Cà phê → mẫu → review → Create|“Người bán xem lại điều khoản trước khi tạo. Sửa số tiền hoặc đổi ví làm mất xác nhận cũ.”|
|1:00–1:25 (25s)|Mock Alice → review → Pay → receipt Paid|“Đúng người trả mới được thanh toán. Cùng hóa đơn đã Paid không được trả lần nữa.” Không nói đây là transaction devnet.|
|1:25–1:55 (30s)|Hóa đơn khác; lỗi mô phỏng đã xử lý/mất phản hồi → Unknown → recheck|“Mất phản hồi chưa có nghĩa thất bại. Tôi kiểm tra lại cùng hóa đơn; app không tự tạo một lần trả mới.” Hiển thị outcome thực từ mock.|
|1:55–2:25 (30s)|Bảng bằng chứng P4-B đã lưu, program ID/cluster và codeguard; vẫn phân biệt video mock|“Program native SOL đã được kiểm riêng trên devnet. Chuyển tiền và ghi Paid cùng thành công hoặc cùng rollback; phí transaction có thể vẫn mất. Đây là bằng chứng backend, chưa phải UI nối mạng thật.”|
|2:25–2:45 (20s)|Repo/giới hạn/trước–trong sự kiện; link public chỉ khi có thật|“Giới hạn là cùng invoice PDA; ID mới vẫn là hóa đơn khác. Phần này chuẩn bị trước hackathon. Code open source; UI thật và link công khai sẽ ghi theo kết quả được kiểm.”|

Tổng 15 + 20 + 25 + 25 + 30 + 30 + 20 = 165 giây. Không dùng tổng trên giấy thay duration của file. Nếu thao tác chậm, rút lời/chuyển cảnh và quay lại trong lượt implementation cần thiết; không chỉnh metadata để giả 165 giây. Log thao tác/ảnh T37 là bằng chứng riêng, không cần nhét đủ 16 ca vào video.

## Khi Phase 6 đã được duyệt và chạy thật

Thay đoạn mock bằng **bản ghi thao tác ví thật của người dùng** và status/signature thực; dùng chương trình/Explorer đúng devnet. Chưa có quyền điều khiển màn hình hoặc ký thật từ Prompt 04. Đừng dựng click/confirmation giả. Đo latency riêng nếu muốn nói về tốc độ; video cắt chờ không là phép đo. Link ReceiptRail/public và video phải lấy URL thật sau duyệt, không bịa placeholder thành link đã sống.

## Kiểm trước nộp

Đọc [note 013](learning/013-hackathon-demo-video.md): bản xuất gồm intro/outro ≤ 165 giây, dưới 3 phút theo FAQ đã kiểm 17/11; âm/chữ rõ; mock/commitment/cluster đúng; không seed/key; repo/public links mở được với audience đã duyệt; tách code trước/trong sự kiện. Chưa có verdict giáo viên hoặc bản video cuối trong tài liệu này.
