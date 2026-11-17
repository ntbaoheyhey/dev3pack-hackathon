# Evidence Report: Workflow Pain Points (C01, C02, C03)

> Ngày thu thập: 2026-11-17

## 1. C01 — ReceiptRail (x402 Issue #452 & Solana Pay)
- **Nỗi đau**: Khó khăn trong việc phục hồi thanh toán khi xảy ra sự cố mạng (timeout/network blips) dẫn đến trùng lặp hoặc hiểu lầm trạng thái giao dịch.
- **Bằng chứng**: Specification update về idempotent retry cho các endpoint `/verify` và `/settle` trong giao thức x402 để xử lý tình trạng timeout, giúp ứng dụng không rơi vào "replay trap" khi giao dịch thực tế đã thành công trên chain nhưng client không nhận được phản hồi.
- **Nguồn**: [GitHub x402 issue #452](https://github.com/x402/svm/issues/452) (Truy cập: 2026-11-17).
- **Trạng thái**: Đã có quy chuẩn idempotent, ứng dụng cần áp dụng đúng SDK để tránh lỗi.

## 2. C02 — ClusterProof (Jupiter Lend)
- **Nỗi đau**: Mismatch giữa IDL devnet và chương trình thực tế trên cluster, dẫn đến lỗi khi tích hợp SDK hoặc gọi program.
- **Bằng chứng**: README và các hướng dẫn tích hợp chính thức của `@jup-ag/lend` thừa nhận devnet programs đã cũ (tháng 5/2025) và khuyên người dùng nên test trên Mainnet-beta hoặc local validator clone Mainnet.
- **Nguồn**: [Jupiter Lend Repository README](https://github.com/jup-ag/lend) (Truy cập: 2026-11-17).
- **Trạng thái**: Cần tuân thủ cách clone Mainnet để test thay vì tin tưởng devnet.

## 3. C03 — NetPay Check (Fee calculation)
- **Nỗi đau**: Sai lệch trong tính toán phí (gross/net) hoặc thay đổi fee theo epoch, dẫn đến người nhận không đủ số token dự kiến.
- **Bằng chứng**: Các advisory về lỗi tính toán phí trong các thư viện xử lý token extension hoặc thanh toán, nhấn mạnh việc cần kiểm tra đối chiếu trực tiếp với Explorer và SDK logic. (Lưu ý: GHSA-725g-w329-g7qr được ghi nhận là lỗi đối chiếu fee trong các thư viện xử lý token extension).
- **Nguồn**: [Advisory Databases / Developer Integration Guides](https://github.com/advisories) (Truy cập: 2026-11-17).
- **Trạng thái**: Cần đối chiếu logic fee với Explorer thay vì chỉ dựa vào SDK response.
