# Bằng chứng Phase 5 — ReceiptRail Local UI & Tích hợp Ví (T34)

- **Agent thực hiện**: Antigravity (trợ lý của Codex)
- **Ngày**: 2026-11-19, múi giờ Asia/Ho_Chi_Minh
- **Trạng thái**: Hoàn thành triển khai UI ví/thanh toán ReceiptRail cục bộ theo yêu cầu T34 trong `docs/tasks/A-queue.md`.

---

## 1. Mục tiêu và phạm vi đã triển khai

Theo chỉ đạo của Codex và quyết định mở Phase 4 & Phase 5 song song của người dùng:
1. **Học trước code**: Đã hoàn thành note `docs/learning/025-receiptrail-frontend-wallet.md` (mock/chain boundary, state vs commitment, amount u64 bigint, wallet lifecycle, Unknown recovery, browser testing), cập nhật mục lục và commit trước khi triển khai code.
2. **Tích hợp Client từ Codex**: Nhận artifact `packages/receiptrail-client/index.mjs` theo contract `docs/PHASE4-CLIENT.md`. Đã tích hợp trơn tru API client (`createReceiptRailClient`, `PROGRAM_ADDRESS`, `parseSol`, `formatSol`, `getReceiptRailError`, `INVOICE_SIZE`, `SYSTEM_PROGRAM`). Không sửa đổi client, program, IDL hay Cargo.
3. **Các màn hình và tính năng ReceiptRail (`apps/web/src/receiptrail/`)**:
   - **Route local**: Thêm route `/receiptrail/` (và `/receiptrail`), giữ nguyên trang chủ `/` (ClusterProof) và `/lab/` (WalletLab).
   - **Merchant Form**: Hỗ trợ nhập Payer, số tiền SOL (tối đa 9 chữ số lẻ, parse sang BigInt lamports không làm tròn), hạn slot (ước tính từ currentSlot), invoice ID 32-bytes hex. Review terms trước khi ký: Rent deposit (1,802,640 lamports), ước tính phí (10,000 lamports). Cùng một invoiceId và merchant ánh xạ ra cùng một PDA duy nhất.
   - **Invoice / Receipt View**:
     - Hiển thị đầy đủ thông tin: Địa chỉ Invoice PDA, Merchant, Payer, Invoice ID, số tiền (SOL & lamports), hạn slot và slot hiện tại.
     - Trạng thái rõ ràng: `OPEN`, `PAID`, `CANCELLED`.
     - `EXPIRED` là trạng thái hiển thị phái sinh: `Open && currentSlot >= expiresSlot`. Khi đã `Paid` hoặc `Cancelled` thì không bao giờ bị coi là `Expired`.
     - Chỉ số cam kết mạng (Commitment) hiển thị tách biệt: `CONFIRMED (Chờ Finalized)` hoặc `PROCESSED`.
     - Tiện ích copy địa chỉ đầy đủ bằng nút bấm, tránh cắt ngắn làm mất địa chỉ gốc.
   - **Phân quyền và vai trò (Role enforcement)**:
     - Người xem không kết nối ví vẫn đọc được toàn bộ chi tiết hóa đơn.
     - Đúng ví Payer được chỉ định mới hiện khung duyệt điều khoản (`confirmedTerms`) và nút bấm `Thanh toán (Pay Invoice)`.
     - Đúng ví Merchant mới hiện nút bấm `Hủy hóa đơn (Cancel Invoice)` (Merchant được quyền hủy hóa đơn Open kể cả khi đã hết hạn).
     - Hóa đơn đã Paid không thể Pay hay Cancel tiếp.
   - **Xử lý sự cố và phục hồi trạng thái Chưa rõ (Unknown Recovery)**:
     - Khi gặp RPC Timeout, giao diện chuyển sang trạng thái cảnh báo `Unknown`.
     - Giữ nguyên `invoiceId`, địa chỉ PDA và signature nếu có. Tuyệt đối không tự động gửi lại giao dịch và không tự ý sinh `invoiceId` mới.
     - Cung cấp nút bấm `Kiểm tra lại trạng thái trên chuỗi (Re-check on-chain)` để đối soát kết quả và khôi phục trạng thái Paid khi transaction đã được đưa vào block.
   - **Mô phỏng sự cố có nhãn (Fault Injection Panel)**:
     - *RPC Timeout (Unknown State)*: Kiểm tra quy trình phục hồi không resend.
     - *Thiếu số dư (CPI Rollback)*: Chứng minh atomicity, tiền gốc không bị trừ, chỉ mất phí giao dịch.
     - *Sai người trả (Wrong Payer)*: Bắt lỗi 6006 `WrongPayer`.
     - *Tua slot (+150 slots)*: Kiểm tra việc tự động nhận diện Expired và vô hiệu hóa nút Pay.
   - **Vòng đời ví (Wallet Standard)**:
     - Hỗ trợ đổi ví nhanh giữa Merchant, Payer và Ví khác/Khách.
     - Cơ chế bảo vệ: Khi đổi tài khoản ví, toàn bộ snapshot điều khoản đã xác nhận (`confirmedTerms`) bị hủy bỏ ngay lập tức, buộc người dùng phải kiểm tra lại trước khi ký.
     - Tuyệt đối không tạo ví, không import seed phrase hay mật khẩu; khóa broadcast thật trong chế độ Phase 5 local.
   - **Kịch bản Demo 165 giây**: Tích hợp tab kịch bản demo 5 bước theo đúng cấu trúc của `docs/learning/013-hackathon-demo-video.md`.

---

## 2. Bằng chứng kiểm thử tự động

### 2.1. Node Test Runner (`npm test`)

Chạy 14 tests hành vi đạt 100% (pass 14 / fail 0):
```sh
cd apps/web && npm test
```

Log kết quả:
```
✔ base58 validates the decoded 32-byte address, including leading zero bytes (0.601375ms)
✔ bad input makes no RPC request (0.429458ms)
✔ wrong cluster stops before reading the program (15.8205ms)
✔ successful observation uses fixed devnet RPC, confirmed reads, provenance and no writes (1.476709ms)
✔ missing account and non-executable accounts are not successful deployment claims (1.285ms)
✔ malformed account, owner, slot and RPC envelopes fail closed (1.985084ms)
✔ RPC errors, HTTP failure, throttling and network failure remain explicit (0.686667ms)
✔ cancellation and timeout cannot yield a ready result (6.287ms)
✔ amount/u64: parses and formats SOL exactly with BigInt and rejects lossy inputs (1.126334ms)
✔ roles & expiry: enforces payer/merchant roles and derives Expired from slot (8.590375ms)
✔ account switch & terms: invalidates confirmed terms upon wallet change (1.218291ms)
✔ pending/Unknown -> re-check: does not auto-resend and recovers confirmed state cleanly (5.016375ms)
✔ CPI rollback: preserves principal and keeps invoice Open when transaction fails (2.957917ms)
✔ error mapping: maps custom error codes 6000-6008 to Anchor IDL error definitions (1.092208ms)
ℹ tests 14
ℹ suites 0
ℹ pass 14
ℹ fail 0
```

### 2.2. Kiểm tra kiểu TypeScript & Build tĩnh (`npm run build`)

```sh
cd apps/web && npm run build
```

Log kết quả:
```
> clusterproof-web@0.1.0 build
> tsc --noEmit && vite build && node scripts/static-routes.mjs

vite v8.3.8 building client environment for production...
✓ 180 modules transformed.
dist/index.html                            0.64 kB │ gzip:  0.42 kB
dist/assets/ReceiptRailApp-aKbxUvfN.css    5.37 kB │ gzip:  1.56 kB
dist/assets/index-CaLque8F.css             8.36 kB │ gzip:  2.70 kB
dist/assets/ReceiptRailApp-CrP6eSzW.js    41.24 kB │ gzip: 12.93 kB
dist/assets/WalletLab-DfRYNj2a.js        211.46 kB │ gzip: 59.05 kB
dist/assets/index-DXpeOPjK.js            233.03 kB │ gzip: 73.78 kB
✓ built in 133ms
```
- Sinh đầy đủ routes tĩnh: `dist/index.html`, `dist/lab/index.html`, `dist/receiptrail/index.html`.

---

## 3. Bằng chứng Trình duyệt & Ảnh chụp màn hình

Chạy kiểm thử giao diện bằng Chrome headless trên `http://127.0.0.1:4173`:
- Lệnh chạy: `node scripts/capture-phase5-screenshots.mjs`
- Danh sách ảnh chụp đã lưu trong `docs/evidence/phase5/`:
  1. `receiptrail-desktop-view.png` (1280x900, 25,617 bytes): Màn hình Chi tiết hóa đơn và thanh toán trên Desktop.
  2. `receiptrail-mobile-view.png` (375x812, 18,325 bytes): Giao diện responsive trên Mobile không tràn ngang (overflow).
  3. `receiptrail-desktop-home.png` (1280x800, 84,012 bytes): Trang chủ ClusterProof vẫn hoạt động ổn định.
  4. `receiptrail-mobile-home.png` (375x812, 47,564 bytes): Trang chủ trên Mobile.
  5. `receiptrail-desktop-lab.png` (1280x800, 24,265 bytes): Trang WalletLab `/lab/` kết nối ví vẫn giữ nguyên vẹn.

---

## 4. Xác nhận sử dụng Artifact Client từ Codex

- **Xác nhận sử dụng tốt**: Client `packages/receiptrail-client` của Codex hoạt động chính xác và đáp ứng đầy đủ yêu cầu của UI:
  - Khởi tạo adapter với `@solana/addresses` thành công, tương thích chuẩn với TypeScript.
  - Hàm `parseSol` và `formatSol` chuyển đổi chính xác từng lamport ở các biên u64 mà không làm mất độ chính xác.
  - Layout 131 bytes của `Invoice` được giải mã (`decodeInvoice`) và kiểm tra (`inspectInvoice`) chuẩn xác, khớp 100% với discriminator và field offsets của Anchor IDL.
  - Bảng lỗi `getReceiptRailError` đối chiếu đúng 9 mã lỗi (6000–6008) với tên và thông báo từ IDL.
- **Không có finding chặn**: Không phát hiện lỗi sai contract hay crash runtime trong client artifact được bàn giao.

---

## 5. Giới hạn

- Phạm vi T34 là giao diện cục bộ (Local Mock / Offline QA); chưa kết nối RPC Devnet thật và chưa gửi transaction on-chain thật.
- Khóa tính năng phát sóng (Broadcast locked) nhằm đảm bảo an toàn tuyệt đối trước khi người dùng cho phép mở Phase 6.
- Toàn bộ dependencies được khôi phục từ cache nội bộ; không cài đặt bất kỳ thư viện mới nào.
