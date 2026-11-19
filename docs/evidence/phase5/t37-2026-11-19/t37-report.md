# Báo cáo Kiểm thử Giao diện Browser Local và Video Demo (T37)

- **Ngày thực hiện**: 2026-11-19 (Asia/Ho_Chi_Minh)
- **Agent**: Antigravity (trợ lý Codex)
- **Nhiệm vụ**: T37 — Kiểm browser local và quay thử demo theo `docs/tasks/A-queue.md`
- **Môi trường**: Headless=true, localhost, ví mock; không broadcast mạng thật, không CUA/điều khiển chuột-phím người dùng.
- **Công cụ & Phiên bản**:
  - Node.js: `v24.22.2`
  - Playwright: `v1.65.0` (cache tại `/Users/bao/tools/cardrpg-look/npm/node_modules/playwright`)
  - Chromium: `156.0.8078.4` (cache tại `/Users/bao/Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`)
  - FFmpeg & FFprobe: `v9.0.2` (`/opt/homebrew/bin/ffmpeg`, `/opt/homebrew/bin/ffprobe`)
  - Vite Server: `http://127.0.0.1:4175/receiptrail/` (PID 57198)

---

## 1. Finding P5-F01: Lỗi Uncaught Base58 Decode Exception tại runtime `mock-wallets.ts`

Trong quá trình khởi chạy kiểm thử trực tiếp trên server localhost hiện hành (commit `78c340f`), phát hiện 1 lỗi implementation quan trọng trong file thuộc quyền sở hữu của Codex:

- **File**: `apps/web/src/receiptrail/mock-wallets.ts`, dòng 80.
- **Hiện tượng**:
  ```ts
  walletsApi.register(createMockWallet('Ví từ chối (Rejection Test)', '4uQeVj5tqViQh7yWWGStvfEG1Zmhx6uasJtWCJziofM', true));
  ```
  Chuỗi base58 `'4uQeVj5tqViQh7yWWGStvfEG1Zmhx6uasJtWCJziofM'` có độ dài 43 ký tự, khi giải mã qua `getAddressEncoder().encode(address(addr))` trong `createMockWallet` chỉ trả về **31 bytes** (thiếu 1 byte zero ở đầu đại diện bằng ký tự `'1'`).
- **Hậu quả trên Browser**:
  Tại `apps/web/src/receiptrail/ReceiptRailApp.tsx` dòng 14, lệnh `registerMockWallets()` được gọi ở module scope. Ngay khi trang web tải trong trình duyệt, hàm ném ngoại lệ:
  ```
  PAGE ERROR: Expected base58 encoded address to decode to a byte array of length 32. Actual length: 31.
  ```
  Lỗi này khiến React runtime dừng hoàn toàn trước khi mount, phần tử `#root` bị trống (`innerHTML = ""`).
- **Lý do unit test Node không bắt được**:
  Trong `apps/web/tests/receiptrail-confirmation.test.mjs`, các ca test chỉ gọi `createMockWallet('Merchant', DEFAULT_MERCHANT.address)` mà không gọi `registerMockWallets()`. File `ReceiptRailApp.tsx` không được import trong test runner của Node.
- **Ảnh bằng chứng lỗi trên bản gốc**:
  - Desktop 1440x900: [2026-11-19-baseline-unpatched-error-1440x900.png](screenshots/2026-11-19-baseline-unpatched-error-1440x900.png)
  - Mobile 375x812: [2026-11-19-baseline-unpatched-error-375x812.png](screenshots/2026-11-19-baseline-unpatched-error-375x812.png)
- **Khắc phục đề xuất cho Codex**:
  Thêm ký tự `'1'` vào đầu địa chỉ ví từ chối:
  `'4uQeVj5tqViQh7yWWGStvfEG1Zmhx6uasJtWCJziofM'` $\rightarrow$ `'14uQeVj5tqViQh7yWWGStvfEG1Zmhx6uasJtWCJziofM'`.
- **Harness kiểm tra**:
  Tuân thủ nguyên tắc không tự ý sửa file core do Codex sở hữu, script kiểm thử `run-t37.mjs` sử dụng cơ chế intercept route của Playwright (`page.route`) để sửa chuỗi này trong bộ nhớ khi serve vào browser, chứng minh toàn bộ 8 ca kiểm thử và luồng video hoạt động 100% đạt chuẩn khi lỗi này được fix.

---

## 2. Kết quả Kiểm thử 8 Ca trên 2 Viewports (16 kết quả)

Toàn bộ 16 ca kiểm thử được thực thi tự động qua script tái chạy độc lập `run-t37.mjs`:

| STT | Ca kiểm thử | Viewport | Các bước thực hiện | Kết quả kỳ vọng (Expected) | Kết quả thực tế (Actual) | Trạng thái | Ảnh bằng chứng |
|:---:|---|:---:|---|---|---|:---:|---|
| 1 | Khách xem (Guest) | 1440×900 | Mở URL `/receiptrail/`, đọc chi tiết và trạng thái ví mặc định | Không cần ví; thấy đủ terms/PDA/ID và nhãn mock; không có quyền Pay/Cancel | Hiển thị "Chưa kết nối ví (Khách xem)". Nút Pay/Cancel không xuất hiện. Thông báo: "Chưa kết nối ví... Hãy kết nối ví Alice..." | **PASS** | [Ảnh 1440](screenshots/2026-11-19-case1-guest-view-1440x900.png) |
| 2 | Khách xem (Guest) | 375×812 | Mở URL `/receiptrail/` trên mobile, kiểm tra layout và quyền | Đọc không cần ví; layout responsive vừa vặn không tràn; không nút Pay/Cancel | Layout co giãn dọc chuẩn mobile, avatar '?', thông báo hướng dẫn rõ ràng | **PASS** | [Ảnh 375](screenshots/2026-11-19-case1-guest-view-375x812.png) |
| 3 | Create (Merchant) | 1440×900 | Kết nối Tiệm Cà phê; chuyển tab Tạo; chọn Mẫu Cà phê (0.001 SOL) | Preview đúng amount/expiry/ID/PDA; tính đủ rent mock và fee | Preview hiển thị: Merchant `5jq4k5...`, Payer `3r3Q8m...`, tiền gốc `0.001 SOL` (`1000000 lamports`), Hạn slot, Rent mock `1,802,640 lamports`, Fee `10,000 lamports` | **PASS** | [Ảnh 1440](screenshots/2026-11-19-case2-merchant-create-1440x900.png) |
| 4 | Create (Merchant) | 375×812 | Kết nối Merchant; tab Tạo; chọn mẫu Cà phê trên mobile | Form vừa vặn trên 375px; preview đầy đủ terms không bị cắt | Form co giãn dọc, quick-fill buttons xuống dòng mượt mà, preview terms đầy đủ | **PASS** | [Ảnh 375](screenshots/2026-11-19-case2-merchant-create-375x812.png) |
| 5 | Sửa sau xác nhận | 1440×900 | Tick chọn xác nhận Create; sửa Amount từ `0.001` sang `0.005` | Tick mất hiệu lực ngay lập tức; nút Create bị disabled | Tick trước khi sửa: `true`; tick sau khi sửa: `false`; nút Create bị khóa: `true` | **PASS** | [Ảnh 1440](screenshots/2026-11-19-case3-edit-invalidate-1440x900.png) |
| 6 | Sửa sau xác nhận | 375×812 | Tick Create trên mobile rồi sửa input; kiểm tra trạng thái nút | Tick mất hiệu lực; nút bị vô hiệu hóa an toàn | Checkbox tự động uncheck, nút Create xám và disabled | **PASS** | [Ảnh 375](screenshots/2026-11-19-case3-edit-invalidate-375x812.png) |
| 7 | Pay và ví | 1440×900 | Kết nối Alice; tick xác nhận; ngắt ví rồi kết nối lại Alice; tick lại và bấm Pay | Tick mất hiệu lực khi ngắt/đổi ví; Pay 1 lần thành công chuyển sang PAID; nút Pay bị khóa vĩnh viễn | Tick trước ngắt ví: `true`; sau kết nối lại: `false`. Sau Pay: badge `PAID`, commitment `CONFIRMED`, nút Pay biến mất, hiển thị biên lai slot | **PASS** | [Ảnh 1440](screenshots/2026-11-19-case4-payer-pay-1440x900.png) |
| 8 | Pay và ví | 375×812 | Thực hiện chu trình Pay và ngắt ví trên mobile viewport 375px | Reset terms an toàn trên mobile; biên lai thanh toán rõ ràng | Thao tác mượt mà, badge PAID nổi bật, không lỗi layout | **PASS** | [Ảnh 375](screenshots/2026-11-19-case4-payer-pay-375x812.png) |
| 9 | Unknown đã xử lý | 1440×900 | Tạo hóa đơn mới; chọn sự cố "Mock: đã xử lý, mất phản hồi"; Alice Pay; bấm Re-check | Hiện cảnh báo Unknown với mã request mock; nút thao tác bị khóa; recheck chuyển sang PAID mà không chuyển tiền thêm | Cảnh báo Unknown hiện kèm mã `mock-pay-2`. Bấm recheck: badge chuyển sang `PAID`, notice: "Đọc lại dữ liệu mock: Paid, kết quả request: confirmed... Không gửi lại giao dịch." | **PASS** | [Ảnh 1440](screenshots/2026-11-19-case5-unknown-handled-1440x900.png) |
| 10 | Unknown đã xử lý | 375×812 | Kiểm tra kịch bản Unknown đã xử lý trên mobile 375px | Hộp cảnh báo Unknown và nút recheck hiển thị vừa vặn | Alert Unknown màu vàng cam cảnh báo nổi bật, nút recheck thao tác tốt | **PASS** | [Ảnh 375](screenshots/2026-11-19-case5-unknown-handled-375x812.png) |
| 11 | Unknown bị drop | 1440×900 | Tạo đơn mới; chọn sự cố "Mock: request bị drop"; Alice Pay; bấm Re-check | Hiện cảnh báo Unknown; recheck giữ nguyên OPEN hoặc EXPIRED; không tự trả, không đổi ID | Cảnh báo Unknown xuất hiện. Sau recheck: trạng thái giữ `OPEN`, notice: "Đọc lại dữ liệu mock: Open, kết quả request: dropped... Không gửi lại giao dịch." | **PASS** | [Ảnh 1440](screenshots/2026-11-19-case6-unknown-dropped-1440x900.png) |
| 12 | Unknown bị drop | 375×812 | Kiểm tra Unknown bị drop trên mobile 375px | Recheck đọc trạng thái Open an toàn; không crash | Trạng thái hiển thị OPEN đúng slot, không trừ tiền, không đổi PDA | **PASS** | [Ảnh 375](screenshots/2026-11-19-case6-unknown-dropped-375x812.png) |
| 13 | Cancel & Rollback | 1440×900 | Merchant kết nối ví, mở hóa đơn Open; tick xác nhận và bấm Hủy | Trạng thái chuyển sang CANCELLED; rent mock giữ trong tài khoản | Badge chuyển `CANCELLED`, notice: "Đã hủy trên dữ liệu mock. Mã mock: mock-cancel-5." Rent được bảo toàn | **PASS** | [Ảnh 1440](screenshots/2026-11-19-case7-cancel-rollback-1440x900.png) |
| 14 | Cancel & Rollback | 375×812 | Merchant hủy hóa đơn trên mobile | Layout nút hủy và checkbox vừa vặn; chuyển Cancelled | Thao tác hủy an toàn, hiển thị rõ ràng trên mobile | **PASS** | [Ảnh 375](screenshots/2026-11-19-case7-cancel-rollback-375x812.png) |
| 15 | Mobile, Overflow, A11y | 1440×900 | Kiểm tra phím Tab, focus hiển thị, nút Copy và bảng danh sách | Focus nhìn thấy rõ; copy địa chỉ đẩy thông báo notice thành công | Focus chuyển qua các tab và nút bấm; nút Copy hiển thị: "Đã copy đầy đủ vào bộ nhớ tạm." | **PASS** | [Ảnh 1440](screenshots/2026-11-19-case8-mobile-keyboard-1440x900.png) |
| 16 | Mobile, Overflow, A11y | 375×812 | Đo scrollWidth toàn trang so với clientWidth; kiểm tra vùng cuộn riêng của bảng | `document.body.scrollWidth <= 375px`; bảng hóa đơn cuộn ngang trong vùng riêng | `body.scrollWidth = 375px`, `clientWidth = 375px` (0px tràn trang). Bảng `.rr-table-wrapper` có `scrollWidth = 965px` cuộn ngang riêng biệt | **PASS** | [Ảnh 375](screenshots/2026-11-19-case8-mobile-keyboard-375x812.png) |

---

## 3. Đo lường Responsive, Bàn phím & Chống Tràn Trang (Overflow)

- **Đo lường độ rộng khung nhìn (Viewport 375×812)**:
  - `document.body.scrollWidth`: **375px**
  - `document.documentElement.clientWidth`: **375px**
  - **Kết luận**: Không xảy ra hiện tượng tràn ngang màn hình (zero horizontal window overflow). Trang web khớp 100% chiều rộng di động.
- **Vùng cuộn riêng của Bảng Danh sách (`.rr-table-wrapper`)**:
  - `tableWrapper.scrollWidth`: **965px**
  - `tableWrapper.clientWidth`: **277px**
  - **Kết luận**: Nhờ class `.rr-table-wrapper` có thuộc tính `overflow-x: auto; width: 100%`, toàn bộ dữ liệu PDA, người nhận, người trả, số tiền và trạng thái được cuộn mượt mà bên trong khối bảng mà không làm xô lệch khung giao diện chính.
- **Điều hướng Bàn phím & Trợ năng (A11y)**:
  - Phím `Tab` và `Shift+Tab` di chuyển focus tuần tự qua: Skip-link $\rightarrow$ Nút Copy ví $\rightarrow$ Các nút kết nối Wallet Standard $\rightarrow$ Mock bar (+20 slots, +150 slots, select sự cố) $\rightarrow$ Các tab điều hướng $\rightarrow$ Form inputs và checkboxes.
  - Vùng focus có viền tương phản cao nhìn thấy rõ ràng.
- **Tiện ích Copy Bộ nhớ tạm (Clipboard)**:
  - Nút Copy PDA và địa chỉ ví hoạt động hoàn hảo thông qua `navigator.clipboard.writeText`.
  - Thông báo hiển thị tức thì trên thanh Notice: `"Đã copy đầy đủ vào bộ nhớ tạm."` mà không làm reload trang.

---

## 4. Video Demo Quay thử 165 Giây (Note 013)

- **File video xuất**: `docs/evidence/phase5/t37-2026-11-19/video/2026-11-19-receiptrail-demo-165s.webm`
- **Kích thước file**: 4,743,342 bytes (~4.74 MB)
- **Độ phân giải**: 1440×900 (16:9, chuẩn demo desktop)
- **Đo lường thời lượng thực tế qua `ffprobe`**:
  ```bash
  ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 2026-11-19-receiptrail-demo-165s.webm
  ```
  **Kết quả đo thật**: **33.08 giây**.
- **So sánh với Sườn 165 giây (Note 013)**:
  - Sườn 165 giây của Note 013 là kịch bản lý thuyết tối đa (trần 2:45 phút).
  - Bản quay thử tự động thực hiện trọn vẹn 5 phân đoạn trong 33.08 giây:
    1. *Đoạn 1 (Hook & Vấn đề)*: Mở tab Kịch bản Demo 165s, nêu bẫy trả trùng và timeout mạng.
    2. *Đoạn 2 (Merchant Tạo Đơn)*: Kết nối ví Tiệm Cà phê, điền mẫu Cà phê 0.001 SOL, preview terms và PDA, bấm tạo đơn.
    3. *Đoạn 3 (Payer Thanh toán)*: Ngắt ví Merchant, kết nối Alice (Payer), duyệt checkbox terms snapshot, thanh toán mock 1 lần chuyển sang PAID.
    4. *Đoạn 4 (Unknown & Recheck)*: Tạo đơn mới, mô phỏng lỗi Timeout rớt mạng, giao diện chuyển trạng thái cảnh báo Unknown khóa nút, bấm Recheck đối soát khôi phục trạng thái.
    5. *Đoạn 5 (Rollback & Sổ cái)*: Chọn mô phỏng thiếu số dư CPI Rollback, mở tab Danh sách hóa đơn kiểm tra toàn bộ sổ cái raw accounts đã decode.
  - Tuân thủ nguyên tắc: **ghi thời lượng file thật, không sửa đổi metadata để giả thời lượng**.

---

## 5. Script Tái chạy & Bàn giao Artifacts

- Toàn bộ chu trình kiểm thử và tạo bằng chứng được đóng gói trọn vẹn trong file:
  `docs/evidence/phase5/t37-2026-11-19/run-t37.mjs`
- Lệnh chạy lại:
  ```bash
  node docs/evidence/phase5/t37-2026-11-19/run-t37.mjs
  ```
- File `manifest.json` lưu trữ đầy đủ chữ ký SHA-256 của các file nguồn, kết quả từng test case, thời lượng video và log phiên bản công cụ.
