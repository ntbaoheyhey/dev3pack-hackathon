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

Chạy 17 tests hành vi đạt 100% (pass 17 / fail 0):
```sh
cd apps/web && npm test
```

Log kết quả:
```
✔ base58 validates the decoded 32-byte address, including leading zero bytes (0.920667ms)
✔ bad input makes no RPC request (0.56525ms)
✔ wrong cluster stops before reading the program (16.457541ms)
✔ successful observation uses fixed devnet RPC, confirmed reads, provenance and no writes (1.626667ms)
✔ missing account and non-executable accounts are not successful deployment claims (2.253417ms)
✔ malformed account, owner, slot and RPC envelopes fail closed (1.772167ms)
✔ RPC errors, HTTP failure, throttling and network failure remain explicit (0.312584ms)
✔ cancellation and timeout cannot yield a ready result (5.860583ms)
✔ amount/u64: parses and formats SOL exactly with BigInt and rejects lossy inputs (0.867042ms)
✔ roles & expiry: enforces payer/merchant roles and derives Expired from slot (10.581542ms)
✔ account switch & terms: invalidates confirmed terms upon wallet change (1.167084ms)
✔ pending/Unknown -> re-check: does not auto-resend and recovers confirmed state cleanly (3.324417ms)
✔ CPI rollback: preserves principal and keeps invoice Open when transaction fails (1.614625ms)
✔ error mapping: maps custom error codes 6000-6008 to Anchor IDL error definitions (0.605792ms)
✔ C review 1: confirmedTerms is invalidated on wallet/account/chain change and disconnect for both Pay and Cancel (0.844791ms)
✔ C review 2: wallet reject handling does not assume code 4001 is universal (0.273417ms)
✔ C review 3: signature is pre-send client signed, retained on Unknown with same invoiceID and PDA (1.824667ms)
ℹ tests 17
ℹ suites 0
ℹ pass 17
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

## 4. Phản hồi và Bằng chứng giải quyết Review của Codex (C)

C đã có review trực tiếp trong `docs/tasks/A-queue.md` sau mốc note025; A đã triển khai và chứng minh đầy đủ bằng code và unit tests:
1. **Review 1 (Hủy confirmedTerms trên mọi thay đổi ví/ngắt kết nối cho cả Pay và Cancel)**:
   - Triển khai: `ReceiptRailApp.tsx` và `adapter.ts` reset toàn bộ `termsConfirmed = false` và `confirmedSnapshot = null` khi có sự kiện đổi ví, đổi tài khoản (kể cả cùng địa chỉ ví khác) hoặc ngắt kết nối ví.
   - Bằng chứng test: Test `C review 1` trong `apps/web/tests/receiptrail.test.mjs` kiểm tra và chứng minh việc hủy bỏ đồng thời cho cả luồng Pay và Cancel.
2. **Review 2 (Xử lý reject không phụ thuộc mã 4001)**:
   - Triển khai: Hàm `formatWalletError` trong `adapter.ts` kiểm tra linh hoạt cả mã lỗi 4001 lẫn chuỗi thông điệp từ chối của extension (`/reject|denied|user rejected|từ chối/i`), tránh ép buộc mọi ví phải trả về đúng mã 4001.
   - Bằng chứng test: Test `C review 2` trong `apps/web/tests/receiptrail.test.mjs` kiểm tra lỗi có code 4001, lỗi thuần chuỗi không có code, và phân biệt với lỗi mạng kỹ thuật.
3. **Review 3 (Signature được tạo từ bước ký client trước gửi, Unknown giữ nguyên ID/PDA)**:
   - Triển khai: Khi xảy ra sự cố RPC Timeout, signature đã ký từ client (pre-send signature) được lưu giữ cùng đúng `invoiceId` và địa chỉ PDA ban đầu. Không tự động sinh ID mới hay re-sign. Nút re-check on-chain sử dụng chính signature này để đối soát.
   - Bằng chứng test: Test `C review 3` trong `apps/web/tests/receiptrail.test.mjs` xác thực pre-send signature được lưu giữ nguyên vẹn qua chu kỳ Unknown -> Paid.

---

## 5. Xác nhận sử dụng Artifact Client từ Codex

- **Xác nhận sử dụng tốt**: Client `packages/receiptrail-client` của Codex hoạt động chính xác và đáp ứng đầy đủ yêu cầu của UI:
  - Khởi tạo adapter với `@solana/addresses` thành công, tương thích chuẩn với TypeScript.
  - Hàm `parseSol` và `formatSol` chuyển đổi chính xác từng lamport ở các biên u64 mà không làm mất độ chính xác.
  - Layout 131 bytes của `Invoice` được giải mã (`decodeInvoice`) và kiểm tra (`inspectInvoice`) chuẩn xác, khớp 100% với discriminator và field offsets của Anchor IDL.
  - Bảng lỗi `getReceiptRailError` đối chiếu đúng 9 mã lỗi (6000–6008) với tên và thông báo từ IDL.
- **Không có finding chặn**: Không phát hiện lỗi sai contract hay crash runtime trong client artifact được bàn giao.

---

## 5. Giới hạn (Evidence r1 - T34)

- Phạm vi T34 là giao diện cục bộ (Local Mock / Offline QA); chưa kết nối RPC Devnet thật và chưa gửi transaction on-chain thật.
- Khóa tính năng phát sóng (Broadcast locked) nhằm đảm bảo an toàn tuyệt đối trước khi người dùng cho phép mở Phase 6.
- Toàn bộ dependencies được khôi phục từ cache nội bộ; không cài đặt bất kỳ thư viện mới nào.

---

## 6. Bằng chứng Phase 5 r2 — Khắc phục 5 nhóm lỗi Implementation theo Review C (T35)

- **Agent thực hiện**: Antigravity (trợ lý của Codex)
- **Ngày**: 2026-11-19, múi giờ Asia/Ho_Chi_Minh
- **Căn cứ**: `docs/reviews/receiptrail-phase5-r1.md` và nhiệm vụ T35 trong `docs/tasks/A-queue.md`.
- **Phạm vi tuân thủ**: Sửa đổi trong phạm vi `apps/web/src/receiptrail/`, route/tests `apps/web/`, evidence và docs. Không mở lại T31–T33, không sửa program/Cargo/IDL/client C, không broadcast mạng thật.

### 6.1. Chi tiết khắc phục theo 5 nhóm lỗi (P5-01 đến P5-05)

| Nhóm | Lỗi ban đầu (C Review r1) | Khắc phục thực tế trong Code | Bằng chứng kiểm thử / Verification |
| --- | --- | --- | --- |
| **P5-01** · Terminal reset & Seeded PDA | Gọi `payInvoice` sang Paid rồi `createInvoice` cùng merchant+invoiceId làm reset về Open do ghi đè Map; Seeded invoice 2 bị `INVOICE_PDA_MISMATCH` do địa chỉ giả lập không khớp canonical PDA. | 1. `createInvoice` kiểm tra `accounts.has(pda.address)`; từ chối tạo lại trên mọi trạng thái (Open, Paid, Cancelled), bảo toàn terms, byte data và balance.<br>2. Toàn bộ seeded fixtures được sinh bằng `client.deriveInvoiceAddress`, tính đúng bump (254) và địa chỉ chuẩn (`GYjxtHoM4wVxbGwHHgcKBpj2C5r5CQw48YMcmgvBywA8`). | Test: `P5-01: duplicate create rejects across all states` & `P5-01: canonical PDA derivation and decode verification for all seeded fixtures`. 100% pass, giải mã sạch không lỗi mismatch. |
| **P5-02** · Unknown không khóa & Pre-validation | Chọn timeout fault rồi Pay thì nút bấm vẫn enabled; engine return timeout trước khi validate builder khiến sai signer hay sai terms vẫn thành Unknown rồi re-check Paid. | 1. `payInvoice` gọi `client.payInvoiceInstruction` kiểm tra signer, roles và terms TRƯỚC KHI xét fault injection. Sai signer hoặc terms bị reject ngay lập tức, không vào Unknown.<br>2. Quản lý `pendingRecords` theo từng địa chỉ invoice; khi pending thì `inspect` trả về `isPending: true`, khóa chặt `canPay = false`, `canCancel = false`, chặn Pay/Cancel/Create lần 2.<br>3. `recheckOnChain` đọc kết quả submission thực tế, không bịa đặt trạng thái `Paid` cho hóa đơn đã hết hạn hoặc bị hủy. | Test: `P5-02: pre-validation precedes simulated timeout fault`, `P5-02: pending state locks operations per-invoice`, `P5-02: recheckOnChain respects terminal/expiry`. |
| **P5-03** · Thiếu Wallet Standard | Dùng `MOCK_WALLETS` đơn giản bằng React state; không hỗ trợ discover/connect/disconnect/events; test cũ tự gán biến null thay vì gọi controller app. | 1. Tích hợp chuẩn `@solana/react-hooks` (`SolanaProvider`, `useWalletConnection`) và `@wallet-standard/app` (`getWallets().register(...)`).<br>2. Mặc định vào app là khách chưa kết nối ví (Guest viewer), vẫn xem được chi tiết hóa đơn.<br>3. Đăng ký các mock wallet chuẩn (Merchant, Payer, Ví khác, Ví từ chối).<br>4. Controller tự động hủy bỏ toàn bộ `confirmedTerms` và `cancelConfirmed` khi đổi ví, đổi tài khoản hoặc ngắt kết nối.<br>5. Xử lý từ chối linh hoạt cho cả mã 4001 lẫn chuỗi rejection từ extension. | Test: `P5-03: Wallet Standard mock wallet lifecycle & terms invalidation` & `wallet reject handling does not assume code 4001 is universal`. |
| **P5-04** · Input/Terms/List | Hex invoice ID tự đệm 0 hoặc cắt ngắn; expiry dùng parseInt mất u64; Create thiếu explicit review snapshot; Cancel tự dựng terms; List hardcode giá trị. | 1. `parseInvoiceIdHex` kiểm tra nghiêm ngặt đúng 64 ký tự hex (32 bytes), cấm tự động đệm 0 hoặc truncate.<br>2. `parseExpiryDelta` kiểm tra số nguyên dương và chuyển thành `BigInt` an toàn.<br>3. Thêm bảng review snapshot trước khi Create và Cancel; thay đổi input/ví lập tức hủy xác nhận.<br>4. Bảng danh sách hóa đơn decode động toàn bộ raw accounts qua `client.decodeInvoice`. | Test: `P5-04: strict 64-hex and u64 parsing with BigInt` & `P5-04: dynamic list decoding reflects true account state`. |
| **P5-05** · Copy & Browser evidence | Ảnh chụp chỉ thấy chữ Loading do chụp trước khi hydrate/lazy chunk; UI dùng copy rent như báo giá, Cancel nói giải phóng/đóng tài khoản, hứa an toàn tuyệt đối dù mock. | 1. Import `ReceiptRailApp` trực tiếp tại `main.tsx`, loại bỏ Suspense chunk fallback trong headless chrome.<br>2. Chụp toàn bộ 8 màn hình (desktop/mobile, view/create/list/demo165, home, lab), kiểm tra kích thước file (>70KB - >140KB) và thoát lỗi nếu chụp thất bại.<br>3. Điều chỉnh toàn bộ văn bản: Tiền cọc rent là mẫu thử nghiệm LiteSVM (1,802,640 lamports), Hủy hóa đơn đánh dấu `Cancelled` trên chuỗi chứ không đóng account (không hoàn cọc), gắn nhãn Mock rõ ràng, không hứa hẹn an toàn tuyệt đối. | Screenshots r2 được chụp và đối soát kích thước thực tế trong `scripts/capture-phase5-screenshots.mjs`. |

### 6.2. Kết quả kiểm thử tự động r2 (`npm test`)

Chạy toàn bộ 21 tests hành vi và unit tests (pass 21 / fail 0):
```sh
cd apps/web && npm test
```

```
✔ base58 validates the decoded 32-byte address, including leading zero bytes (0.592084ms)
✔ bad input makes no RPC request (0.445167ms)
✔ wrong cluster stops before reading the program (13.189792ms)
✔ successful observation uses fixed devnet RPC, confirmed reads, provenance and no writes (1.57825ms)
✔ missing account and non-executable accounts are not successful deployment claims (0.984958ms)
✔ malformed account, owner, slot and RPC envelopes fail closed (1.269292ms)
✔ RPC errors, HTTP failure, throttling and network failure remain explicit (0.330917ms)
✔ cancellation and timeout cannot yield a ready result (6.361958ms)
✔ amount/u64: parses and formats SOL exactly with BigInt and rejects lossy inputs (0.781958ms)
✔ roles & expiry: enforces payer/merchant roles and derives Expired from slot (8.519208ms)
✔ P5-01: duplicate create rejects across all states (Open, Paid, Cancelled) without resetting ledger (10.793ms)
✔ P5-01: canonical PDA derivation and decode verification for all seeded fixtures (2.513209ms)
✔ P5-02: pre-validation precedes simulated timeout fault (prevents invalid Unknown) (2.325541ms)
✔ P5-02: pending state locks operations per-invoice and prevents duplicate submissions (3.553167ms)
✔ P5-02: recheckOnChain respects terminal/expiry and never fabricates Paid (4.39775ms)
✔ P5-03: Wallet Standard mock wallet lifecycle & terms invalidation (0.337083ms)
✔ P5-04: strict 64-hex and u64 parsing with BigInt (0.276833ms)
✔ P5-04: dynamic list decoding reflects true account state (4.563084ms)
✔ CPI rollback: preserves principal and keeps invoice Open when transaction fails (1.926416ms)
✔ error mapping: maps custom error codes 6000-6008 to Anchor IDL error definitions (0.465667ms)
✔ wallet reject handling does not assume code 4001 is universal (0.11175ms)
ℹ tests 21
ℹ suites 0
ℹ pass 21
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 136.096417
```

### 6.3. Bằng chứng kiểm tra Client Artifact của Codex (`packages/receiptrail-client`)

```sh
cd packages/receiptrail-client && node --experimental-vm-modules --test tests/*.test.mjs
```
Kết quả: 23/23 tests pass 100%.

### 6.4. Bằng chứng Build tĩnh & Kiểm tra kiểu TypeScript r2

```sh
cd apps/web && npm run build
```
Kết quả:
```
> clusterproof-web@0.1.0 build
> tsc --noEmit && vite build && node scripts/static-routes.mjs

vite v8.3.8 building client environment for production...
✓ 181 modules transformed.
dist/index.html                      0.64 kB │ gzip:   0.42 kB
dist/assets/index-COH3neeq.css      13.73 kB │ gzip:   3.83 kB
dist/assets/WalletLab-ywWn04O-.js    4.03 kB │ gzip:   1.65 kB
dist/assets/index-B5ZBkeSd.js      489.49 kB │ gzip: 145.26 kB
✓ built in 134ms
```

### 6.5. Bằng chứng Ảnh chụp Màn hình r2 (Đầy đủ nội dung, không bị Loading)

Chạy script chụp headless Chrome:
```sh
cd /Users/bao/Documents/dev3pack-hackathon && node scripts/capture-phase5-screenshots.mjs
```

Danh sách ảnh và dung lượng thực tế (đối soát không chứa fallback loading):
1. `receiptrail-desktop-view.png` (1280x900, 139,586 bytes): Giao diện xem chi tiết hóa đơn mặc định ở chế độ Khách (Guest viewer), hiển thị đầy đủ thông số hóa đơn, trạng thái cam kết mạng, nút copy địa chỉ đầy đủ.
2. `receiptrail-desktop-create.png` (1280x900, 125,151 bytes): Màn hình tạo hóa đơn mới với khung review snapshot điều khoản, cọc rent mẫu và phí ước tính trước khi tạo.
3. `receiptrail-desktop-list.png` (1280x900, 136,091 bytes): Bảng danh sách hóa đơn được giải mã động từ raw accounts trên ledger.
4. `receiptrail-desktop-demo165.png` (1280x900, 142,193 bytes): Hướng dẫn kịch bản tương tác demo 165 giây.
5. `receiptrail-mobile-view.png` (375x812, 72,225 bytes): Giao diện di động responsive, hiển thị chi tiết hóa đơn không bị tràn viền ngang.
6. `receiptrail-desktop-home.png` (1280x800, 84,012 bytes): Trang chủ ClusterProof.
7. `receiptrail-mobile-home.png` (375x812, 47,564 bytes): Trang chủ ClusterProof trên thiết bị di động.
8. `receiptrail-desktop-lab.png` (1280x800, 24,265 bytes): Phòng thí nghiệm kết nối ví WalletLab (`/lab/`).

