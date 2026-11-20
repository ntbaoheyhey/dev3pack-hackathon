# Báo cáo Nghiệm thu T41 — Devnet Wallet Standard Connector & Panel

- **Thời gian**: 20/11/2026 (Asia/Ho_Chi_Minh)
- **Tác giả**: Antigravity (trợ lý Codex)
- **Task**: T41 thuộc Phase 6 (sau khi người dùng phê duyệt Phase 6 với trần 0.05 SOL tại `docs/ideas/DECISION.md`)
- **Đối chiếu hợp đồng C/A**: Giao thức kết nối ví Wallet Standard thực tế cho bản tích hợp local Phase 6.

---

## 1. Tóm tắt kết quả

1. **Khởi tạo Module Kết nối Devnet (`apps/web/src/receiptrail/devnet-wallet-connection.ts`)**:
   - Triển khai lớp `ReceiptRailDevnetWalletConnection` tuân thủ đúng giao diện yêu cầu: `subscribe`, `getSnapshot`, `connect(wallet)`, `disconnect()`, `destroy()`.
   - Snapshot bảo tồn nguyên vẹn đối tượng raw `Wallet` và `WalletAccount` (`selectedWallet`, `selectedAccount`) để Codex và adapter phía sau có thể trực tiếp kiểm tra các tính năng `wallet.features['solana:signTransaction']`, `wallet.features['solana:signAndSendTransaction']` và `supportedTransactionVersions`.
   - Khám phá ví động qua `@wallet-standard/app` (`getWallets()`), tự động cập nhật snapshot khi ví mới được cài đặt hoặc gỡ bỏ qua sự kiện `register` / `unregister`.
   - Quản lý thế hệ (`generation`) tăng đơn điệu trên mọi thay đổi về session, đổi tài khoản, đổi mạng, hoặc ngắt kết nối. Thao tác kết nối ví mới có cùng địa chỉ tài khoản (`account.address`) vẫn tăng `generation` để bảo đảm hủy bỏ triệt để các điều khoản đã duyệt trước đó.
   - Cơ chế phòng chống race condition: Bỏ qua kết quả kết nối muộn (late connect) nếu người dùng đã hủy hoặc chuyển sang ví khác trong lúc chờ popup.
   - Ràng buộc mạng nghiêm ngặt: Chỉ chấp nhận tài khoản có `chains` chứa `'solana:devnet'`. Nếu không có, hiển thị hướng dẫn người dùng chuyển mạng trong extension ví.
   - Xử lý từ chối đa dạng: Không giả định mã 4001 là duy nhất; hỗ trợ bắt lỗi cả mã 4001 (Phantom), lỗi chuỗi thuần (Solflare), và `WalletWindowClosedError` (Backpack).
   - Ranh giới an toàn: 0 lệnh gọi RPC warmup, 0 request mạng (`fetchCount === 0`), 0 logic ký hay gửi giao dịch trong connection.

2. **Component Giao diện (`apps/web/src/receiptrail/devnet-wallet-panel.tsx`)**:
   - Triển khai `DevnetWalletPanel` kết nối đồng bộ với store qua `useSyncExternalStore`.
   - Gắn nhãn `[DEVNET]` nổi bật trên toàn bộ panel và các nút bấm.
   - Khi không có ví: Hiển thị thông báo hướng dẫn cài đặt extension (Phantom, Solflare, Backpack), tuyệt đối không fallback về mock demo.
   - Hiển thị danh sách ví, trạng thái kết nối, địa chỉ rút gọn, mạng tài khoản và số thế hệ (`generation`).
   - Nút hành động chỉ phục vụ Chọn ví, Kết nối và Ngắt kết nối; không chứa bất kỳ nút bấm ký hay gửi giao dịch nào.

3. **Bộ Kiểm thử Hồi quy Toàn diện (`apps/web/tests/devnet-wallet.test.mjs`)**:
   - 9 test cases mới bao phủ 100% các yêu cầu hợp đồng C/A:
     - `discovery`: Khám phá động, đăng ký/hủy đăng ký ví và cách ly hoàn toàn khỏi demo fixtures.
     - `connect`: Kết nối thành công và giữ nguyên tham chiếu raw wallet/account.
     - `rejection`: Xử lý từ chối đa dạng (mã 4001, error string, window closed).
     - `unsupported chains`: Từ chối ví/tài khoản không có `solana:devnet` và dọn dẹp phiên mồ côi.
     - `same address different wallet`: Tăng `generation` khi kết nối cùng địa chỉ khác ví/session.
     - `events`: Lắng nghe sự kiện `standard:events` khi đổi account, đổi mạng ra ngoài devnet, hoặc ngắt kết nối.
     - `late connect`: Bỏ qua kết quả connect muộn khi phiên đã bị hủy.
     - `subscription cleanup & destroy`: Dọn dẹp listener, chống rò rỉ bộ nhớ, từ chối thao tác sau khi destroy.
     - `zero network calls`: Xác nhận 0 request fetch/mạng và không chứa API sign/send.

4. **Kết quả Lệnh & Build**:
   - `npm test`: **61/61 tests pass** sạch sẽ trong `apps/web` (251ms).
   - `npm run build`: TypeScript `tsc --noEmit` & Vite build thành công trong 164ms.
   - `npm run build:receiptrail-mock`: Build bản mock độc lập thành công trong 117ms.

---

## 2. Bảng đối chiếu Tệp & Checksums (SHA-256)

| Tệp | SHA-256 | Vai trò |
|---|---|---|
| `apps/web/src/receiptrail/devnet-wallet-connection.ts` | `3b995a8a905f896ae1538d6c421ee0fbc259e184f263a4e2f84270485701d093` | Lớp quản lý kết nối Wallet Standard trên Devnet |
| `apps/web/src/receiptrail/devnet-wallet-panel.tsx` | `00ba1b2a612e6e94ce2fed0fa72414fbb6a7361b4f7f110ac4afe8e0f3ac0f1e` | Component giao diện hiển thị ví Devnet |
| `apps/web/tests/devnet-wallet.test.mjs` | `fc998ff60929e5afcf083e1284a0a9d5232cb047799723123e96c343e828c940` | Bộ 9 bài kiểm thử hồi quy độc lập |
| `docs/learning/027-receiptrail-wallet-e2e.md` | Đã cập nhật mục 7 | Bài học & thiết kế kiến trúc trước khi code |
