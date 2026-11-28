# Chrome native / Core — quan sát Wallet Standard

Codex · 17/11/2026 · khoảng23:52–23:54 Asia/Ho_Chi_Minh. Nguồn: CUA native accessibility state trong lượt tiếp tục goal tại HEAD050e030; chỉ ghi phần liên quan lab, không lưu thông tin tài khoản trình duyệt.

URL: https://clusterproof-devnet-17nov26.anthony-robinson-125.chatgpt.site/lab/

## Những gì đã quan sát

1. Chrome native mở public /lab/ thành công. Trang hiển thị **CHƯA KẾT NỐI**, **Kết nối Core**, **Tìm lại ví ↻**. Toolbar Core báo có quyền truy cập site. Đây là bằng chứng connector discovery có ví thật, khác IAB không có extension ở lượt trước.
2. Bấm Kết nối Core: nút chuyển thành **Đang chờ ví…** và bị disable.
3. Cửa sổ **Core** xuất hiện, route permissions của extension. UI có **Enter your password**, **Login** disabled, **Forgot password?**. Không nhập mật khẩu, seed hoặc private key; chưa chọn account/approve.
4. Ở lần quan sát kế tiếp, lab trở lại **CHƯA KẾT NỐI**; nút **Kết nối Core** và **Tìm lại ví ↻** được bật. Thông báo: **“Chưa kết nối được ví. Nếu bạn đã từ chối, chọn ví để thử lại khi sẵn sàng.”** Không xác định nguyên nhân request kết thúc; không gọi đây là ca bấm Reject trong ví đã unlock.
5. Đã gửi completion_summary cho đoạn CUA này. Không còn thao tác UI hoặc request mà agent đang chờ xử lý.

## Phạm vi bằng chứng

- Đạt: public deep link trên Chrome native, Core discovery, mở request và UI phục hồi sau request không thành công.
- **Chưa kiểm:** account Solana devnet riêng, approve thành công, địa chỉ trả về, explicit reject khi đã unlock, retry thành công và disconnect với extension thật.
- Không sign/send, không có transaction từ web. Các ca reject→retry→connect→disconnect trước đó vẫn chỉ là fixture local.
- Ảnh main lab đã được hiển thị trong phiên CUA; không có file screenshot mới được lưu kèm artifact này. Các mô tả trên dựa trên AX state đã quan sát, không suy từ screenshot rằng ví đã unlock.

## Quyết định người dùng

Payload `send_user_message_question_reply`, `call_qOWTCC3sdHrix5DfEq1upmM0` item0, log **17/11/2026 23:54:48.498 UTC+7** ghi: **“Chưa có ví devnet sẵn sàng; giữ bước này chưa kiểm”**. Đây là nguồn assistant đã dựa vào, không suy thành quyền tạo ví/triển khai. Giữ các mục kết nối thật mở, không tự tạo/import ví, cài extension khác hoặc dùng ví có tài sản thật để đóng gate. Xem [DECISION](../../ideas/DECISION.md).
