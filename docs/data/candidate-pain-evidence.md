# Evidence Report: Workflow Pain Points (C01, C02, C03) - V2

> Ngày thu thập: 2026-11-17

## 1. C01 — ReceiptRail (x402 & Solana Pay)
- **Nỗi đau**: Xử lý tình trạng retry thanh toán hoặc timeout khi gọi endpoint settlement trong các ứng dụng agentic/micro-payment, dễ dẫn đến trạng thái không nhất quán giữa client và facilitator.
- **Bằng chứng**:
    - [GitHub x402 issue #452](https://github.com/x402-foundation/x402/issues/452): Thảo luận về việc chuẩn hóa hành vi idempotent cho các endpoint `/verify` và `/settle` trong x402 để tránh replay trap, không phải bug của Solana mà là lỗi triển khai ứng dụng nếu không kiểm soát idempotency.
    - [Shopify Engineering Blog](https://shopify.engineering/building-resilient-graphql-apis-using-idempotency): Đề xuất mô hình sử dụng idempotency keys (UUID) để đảm bảo tính nhất quán cho các mutation quan trọng, áp dụng tốt cho các hệ thống như Solana Pay reference (khi dùng reference key để query giao dịch thay vì chỉ dựa vào payload payload settlement).
- **Phân biệt**: Solana Pay dùng `reference` (public key) để query on-chain, trong khi x402 invoice settlement thường là một-lần-dùng-được, cần sự nhất quán ở tầng Application.

## 2. C02 — ClusterProof (Jupiter Lend)
- **Nỗi đau**: Sự khác biệt giữa môi trường Devnet và Mainnet, khiến việc testing SDK/IDL trên Devnet dẫn đến sai sót khi deploy thực tế.
- **Bằng chứng**:
    - [Jupiter Lend Repository README](https://github.com/jup-ag/jupiter-lend): Thừa nhận các devnet programs đã lỗi thời và khuyến nghị test bằng cách clone Mainnet-beta.
    - [Solana StackExchange](https://solana.stackexchange.com/questions/16906/different-program-id-on-devnet-than-in-lib-declare-id): Giải thích nguyên nhân mismatch thường gặp do khác biệt environment keys, không phải lỗi hệ thống mà do lệch sync state, khuyến nghị override program ID cục bộ.

## 3. C03 — NetPay Check (Fee calculation)
- **Nỗi đau**: Sai lệch trong tính toán phí (gross/net) hoặc sai lệch do epoch/extension khi xử lý Token-2022, gây hiểu lầm số token người nhận thực tế.
- **Bằng chứng**:
    - [Kora GHSA-725g-w329-g7qr](https://github.com/solana-foundation/kora/security/advisories/GHSA-725g-w329-g7qr): Báo cáo lỗi đối chiếu phí trong thư viện (cần kiểm tra version cụ thể).
    - [StackOverflow](https://stackoverflow.com/questions/78194696/compute-fee-for-solana-transfercheckedwithfee-instruction): Thảo luận về khó khăn trong việc dự tính chính xác `compute fee` cho `transferCheckedWithFee`, cần dùng Explorer/SDK trả về thực tế để đối chiếu thay vì dự đoán.
- **Lưu ý**: Đây là những issue cụ thể đã được ghi nhận, không khẳng định Kora hiện tại vẫn tồn tại lỗi.
