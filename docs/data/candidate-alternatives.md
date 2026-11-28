# Candidate Alternatives for C01, C02, C03 (T4)

> Ngày thu thập: 2026-11-17

## 1. Alternatives for C01 (x402/ReceiptRail)
- **Nỗi đau**: Khó khăn khi retry thanh toán do network blips/timeouts làm trùng lặp hoặc hiểu lầm trạng thái on-chain.
- **Alternatives**:
    - **Managed Facilitators**: Coinbase Developer Platform, PayAI.io, Roundhouse AI (giúp quản lý trạng thái, idempodency tốt hơn tự build).
    - **Protocol Alternatives**: Machine Payments Protocol (Stripe/Tempo) (dùng header thay thế x402), L402, hoặc xBoberPay (dùng payment channels để gom nhiều microtransactions, tránh mỗi lệnh là một tx on-chain).
    - **Self-hosted**: Tự implement middleware bằng cách dùng `paymentPayload` làm explicit idempotency key.

## 2. Alternatives for C02 (Jupiter Lend/ClusterProof)
- **Nỗi đau**: Sai lệch environment giữa Devnet/Mainnet, IDL mismatch.
- **Alternatives**:
    - **Local Validator Cloning (Khuyên dùng)**: Chạy `solana-test-validator` clone accounts trực tiếp từ Mainnet-beta.
    - **Testing trên Mainnet-beta**: Dùng ví burner với số vốn cực nhỏ (micro-transactions) để test thật.
    - **Mock Programs**: Tạo program giả lập các interface để test luồng tích hợp trong CI/CD.
    - **Simulators**: Dùng các công cụ như Surfpool để fork state Mainnet local.

## 3. Alternatives for C03 (Kora/NetPay Check)
- **Nỗi đau**: Sai lệch phí (gross/net) trong các instruction phức tạp.
- **Alternatives**:
    - **Custom Relayer Backend**: Tự build relayer dùng `simulateTransaction` để kiểm tra chi phí thực tế trước khi ký/submit.
    - **Explicit Compute Instructions**: Sử dụng `ComputeBudgetProgram` để set cứng `units` và `price`.
    - **Simulation-based Estimation**: Thay vì dùng công thức tĩnh, hãy chạy simulation ngay trước khi sign để biết `unitsConsumed` thực tế.
