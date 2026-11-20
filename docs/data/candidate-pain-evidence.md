# Evidence Report: Workflow Pain Points (C01, C02, C03) - V3

> Ngày thu thập: 2026-11-17

## 1. C01 — ReceiptRail (x402 & Solana Pay)
- **Nỗi đau**: Khó khăn trong việc phục hồi thanh toán, tránh trùng lặp tx khi timeout mạng.
- **Bằng chứng**:
    - [GitHub x402 issue #452](https://github.com/x402-foundation/x402/issues/452): Idempotent retry chuẩn hóa cho `/verify` và `/settle`.
    - [Shopify Engineering](https://shopify.engineering/building-resilient-graphql-apis-using-idempotency): (Sử dụng làm tham khảo tư duy idempotency keys, cần lưu ý áp dụng vào Solana Pay reference state quản lý, không áp dụng nguyên văn Shopify vào Solana).
- **Diễn giải**: Idempotency ở tầng Facilitator x402 và Reference tracking của Solana Pay là hai cơ chế riêng biệt để đảm bảo tính nhất quán.

## 2. C02 — ClusterProof (Jupiter Lend)
- **Nỗi đau**: IDL/Program deployment khác biệt giữa Devnet và Mainnet.
- **Bằng chứng**:
    - [Jupiter Lend Repo](https://github.com/jup-ag/jupiter-lend): Khuyến nghị test trực tiếp trên Mainnet-beta hoặc clone Mainnet (cách test an toàn hơn Devnet).
    - [StackExchange #16906](https://solana.stackexchange.com/questions/16906/different-program-id-on-devnet-than-in-lib-declare-id): Mismatched ID do environment configuration, cần override ID.
- **Diễn giải**: Đây là rào cản môi trường, cần clone state Mainnet để phát triển, không phải lỗi hệ thống.

## 3. C03 — NetPay Check (Fee calculation)
- **Nỗi đau**: Sai lệch fee (Token-2022 extension, transfer fee) dẫn đến số lượng token nhận không như ý.
- **Bằng chứng**:
    - [Kora GHSA-725g-w329-g7qr](https://github.com/solana-foundation/kora/security/advisories/GHSA-725g-w329-g7qr): Ghi nhận lỗ hổng đối chiếu fee (Patched/Affected: cần kiểm tra phiên bản tại thời điểm đọc, cụ thể là các phiên bản cũ).
    - [StackOverflow #78194696](https://stackoverflow.com/questions/78194696/compute-fee-for-solana-transfercheckedwithfee-instruction): Thảo luận về việc tính sai `transfer fee` cho `transferCheckedWithFee`, cần dùng source Token-2022 extension để đối chiếu logic.
- **Diễn giải**: Cần kiểm tra code đối chiếu phí dựa trên logic Token-2022, không dùng Explorer/SDK response một cách mù quáng.
