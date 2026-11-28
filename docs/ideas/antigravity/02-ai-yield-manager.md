# Idea 02: AI Agent-driven Yield Manager on Solana

- **Nguồn và bằng chứng vấn đề**: Người dùng DeFi mất thời gian theo dõi farm, quản lý rủi ro thủ công.
- **Người dùng**: Người chơi DeFi, muốn tối ưu hóa yield.
- **Vì sao Solana**: Tốc độ xử lý lệnh cực nhanh, phí thấp, cộng đồng DeFi mạnh.
- **Luồng người dùng chính**:
    1. Người dùng nạp USDC/SOL vào ví quản lý.
    2. Agent AI phân tích các pool yield (Jupiter, Kamino).
    3. Agent tự động thực hiện lệnh rebalance/farm để tối ưu APY.
    4. Người dùng rút tiền bất cứ lúc nào.
- **Người mới chưa có ví**: Tự động tạo ví nhúng, người dùng nạp tiền qua fiat-on-ramp (nếu được hỗ trợ).
- **Off-chain/SDK**: Dùng AI Agent framework (ví dụ: LangChain, Solana Web3.js), Kamino SDK.
- **Track**: DeFi/AI.
- **Khoảnh khắc wow**: APY tăng tự động mà không cần can thiệp thủ công.
- **Video 165s**: Demo Agent tự rebalance giữa các pool.
- **Rủi ro**: Rủi ro hợp đồng thông minh, Agent hành động sai.
- **Phiên bản thu nhỏ**: Chỉ quản lý một cặp (USDC/SOL).
- **Bảng lịch sử điểm**:
    - r0: P=3, S=3, N=3, F=2, R=2, D=3, V=3. T = 58. Chưa đạt.
    - r1: P=4, S=4, N=3, F=3, R=3, D=3, V=3. T = 70. (Cần nâng F và D)
    - r2: P=4, S=4, N=4, F=4, R=3, D=4, V=3. T = 76. (ĐẠT)
