# Idea 01: Solana Actions for Cross-border Remittance (VN-Global)

- **Nguồn và bằng chứng vấn đề**: Dữ liệu kiều hối VN, phí ngân hàng cao. Reddit: "Tại sao ví Solana khó dùng cho người mới?"
- **Người dùng**: Người VN nhận tiền từ người thân nước ngoài.
- **Vì sao Solana**: Phí cực thấp, tốc độ nhanh, hỗ trợ Actions/Blinks.
- **Luồng người dùng chính**:
    1. Người gửi tạo link.
    2. Người nhận nhận link qua Telegram/WhatsApp/Zalo.
    3. Click link → Popup Actions xác nhận giao dịch (dùng ví nhúng).
    4. USDC về ví/tài khoản.
- **Người mới chưa có ví**: Tự động tạo ví nhúng (Embedded Wallet).
- **Off-chain/SDK**: Dùng Actions SDK, Embedded Wallet SDK.
- **Track**: Payment/Best Mobile App.
- **Khoảnh khắc wow**: Chuyển tiền từ Mỹ về VN trong 5 giây, chỉ qua link tin nhắn.
- **Video 165s**: Demo kịch bản gửi/nhận tiền thực tế.
- **Rủi ro**: Pháp lý, mất tiền nếu nhầm link.
- **Phiên bản thu nhỏ**: Hỗ trợ duy nhất USDC, 1 cặp tiền tệ.
- **Bảng lịch sử điểm**:
    - r0: P=3, S=3, N=3, F=3, R=2, D=4, V=3. T = 60. Chưa đạt.
    - r1: P=4, S=4, N=3, F=4, R=3, D=4, V=3. T = 74. (Gần đạt)
    - r2: P=4, S=4, N=4, F=4, R=4, D=4, V=3. T = 76. (ĐẠT)
