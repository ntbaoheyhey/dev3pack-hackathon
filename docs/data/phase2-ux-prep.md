# Phase 2/5 Prep: Solana Template & UI/UX (T5)

> Ngày thu thập: 2026-11-17

## 1. Template chính thức
- [Solana Next.js Template](https://github.com/solana-developers/solana-nextjs-template): 
    - Version: (Yêu cầu kiểm tra commit/package.json trong repo).
    - License: MIT.
    - Đặc điểm: Tích hợp sẵn wallet adapter, phù hợp làm UI shell.
- [Solana Vite Template](https://github.com/solana-developers/solana-vite-template):
    - Version: (Yêu cầu kiểm tra commit/package.json trong repo).
    - License: MIT.
    - Đặc điểm: Lightweight, build nhanh.

## 2. Wireframe / UI Flows
- **C01 (ReceiptRail)**: Wallet connect, hiển thị invoice trạng thái on-chain, nút "Recover Payment" (chỉ hiện khi timeout).
- **C02 (ClusterProof)**: Read-only Dashboard hiển thị current program state vs IDL, hiển thị warnings nếu lệch môi trường (Devnet warning).
- **C03 (NetPay Check)**: UI cho phép nhập số lượng token, hiển thị breakdown fee (gross/net) dựa trên logic extension, nút "Confirm & Send".

## 3. UI/UX cho Wallet (Reject/Retry/Cluster)
- Cần có các state: Loading, Success, Error, Rejected (Wallet reject).
- Retry policy: Chỉ cho phép retry các tx có idempotency key (đối với C01).

## 4. Checklist triển khai (Phase 3)
- [ ] UI Shell (ClusterProof dashboard).
- [ ] Wallet Connection (dùng wallet adapter).
- [ ] Integration với C02 (read-only state).
- [ ] Integration với C03 (fee breakdown UI).
