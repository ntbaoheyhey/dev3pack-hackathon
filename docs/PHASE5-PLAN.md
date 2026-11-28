# Phase 5 — local đã kiểm, trình cổng public mock

Cập nhật 20/11/2026. **Source ứng dụng 106a18e đạt phần local/mock**: 52 tests, TypeScript/Vite build, 16 ca browser + 2 ca đổi slot, 10 ca static artifact và video diễn tập 162.12 giây. [Review C r4](reviews/receiptrail-phase5-r4.md) · [Logs/ảnh/video/manifests](evidence/phase5/c-prompt04-review-2026-11-19/README.md). T37–T40 đã nhận/đóng, không mở thêm vòng report.

## Bản cụ thể để xem và duyệt

- [ReceiptRail local](http://127.0.0.1:4175/receiptrail/) dùng server Vite trong checkout C; chỉ mock, không kết nối ví thật/ký/gửi/RPC devnet.
- Bản **chỉ ReceiptRail** có entry riêng tại apps/web/receiptrail-mock/index.html; root mở ReceiptRail, không có trang ClusterProof/lab. Build bằng cache: từ apps/web chạy npm run build:receiptrail-mock. Output apps/web/dist-receiptrail-mock gồm một HTML, một JS và một CSS.
- ZIP để xem local: sandbox/artifacts/receiptrail-mock-2026-11-20.zip, 134030 bytes, SHA256 b9268dc6de8ac6aa94fae282b40a8c0ed96657ecc8249c7922d3f451edc2c3d4. Đây không phải package publication hoặc bản đã upload.
- Xem [ảnh desktop](evidence/phase5/mock-artifact-2026-11-20/screenshots/1440-guest-reject.png) và [ảnh mobile](evidence/phase5/mock-artifact-2026-11-20/screenshots/375-create-pay-terminal.png) của đúng artifact riêng.
- [Source/output/archive hashes](evidence/phase5/mock-artifact-2026-11-20/artifact.json), [10 ca static và ảnh](evidence/phase5/mock-artifact-2026-11-20/manifest.json). Artifact đã được kiểm trước source commit; build lại từ106a18e cho đúng ba output hashes.
- Xem root của artifact bằng server tĩnh localhost, từ repo: python3 -m http.server 4176 --bind 127.0.0.1 --directory apps/web/dist-receiptrail-mock. Server4176 của C chỉ phục vụ QA và được đóng cuối lượt; server4175 có sẵn được giữ.

## Tám ca đã kiểm trên source thật

Mỗi ca chạy ở 1440×900 và 375×812, không rewrite module/response. [Manifest](evidence/phase5/c-prompt04-review-2026-11-19/manifest.json) chứa expected/actual/ledger và đường dẫn ảnh; [harness](../scripts/verify-receiptrail-phase5-browser.mjs) giữ các bước và assertions.

| Ca | Thao tác | Kết quả thực |
| --- | --- | --- |
| Khách xem | Không kết nối, đọc terms/PDA, copy | Đọc được, không Pay/Cancel, clipboard đúng toàn PDA |
| Create | Merchant chọn mẫu, xem terms, xác nhận và tạo | Amount 1000000 lamports, đúng merchant/payer/ID/PDA, chọn đúng hóa đơn mới |
| Sửa sau duyệt | Tick rồi sửa amount/expiry/preset; bổ sung +20slots | Tick mất hiệu lực, submit khóa; phải xem/duyệt lại. Hai ca slot trong [bằng chứng bổ sung](evidence/phase5/c-prompt04-review-2026-11-19/slot-confirmation.json) |
| Pay và ví | Tick, đổi/ngắt/kết nối lại, duyệt lại rồi Pay | Tick cũ mất hiệu lực; principal chuyển đúng một lần, Paid không còn Pay/Cancel |
| Unknown đã xử lý | Mô phỏng mất phản hồi sau xử lý, recheck | Giữ PDA/mã mock, đọc Paid, ledger không thay khi recheck |
| Unknown bị drop | Mô phỏng request bị drop, recheck | Vẫn Open theo slot; không chuyển tiền hoặc đổi ID |
| Cancel/rollback | Cancel Open và Expired; ca riêng CPI rollback | Cancel giữ rent/principal; rollback giữ Open/principal/rent, chỉ phí mock tăng10000 |
| Mobile/bàn phím | Danh sách, Tab/Shift+Tab, copy PDA/ví | Không tràn trang375px; bảng cuộn riêng; focus thấy được; clipboard chính xác |

0 pageerror và 0 request ngoài localhost trong tất cả lượt browser C. Static artifact kiểm thêm guest/reject/Create/Pay/terminal/hai Unknown/CancelExpired/layout/reload trên cả hai viewport. Không dùng viewport để nhận là điện thoại vật lý hoặc ví extension đã kiểm.

## Video và giới hạn

[Diễn tập UI 162.12 giây](evidence/phase5/c-prompt04-review-2026-11-19/video/receiptrail-local-dry-run.webm) được recordVideo bằng cache, đo ffprobe sau khi đóng context. Không lời thoại, không phải video nộp hoàn chỉnh hoặc browser-to-devnet. [Kịch bản 165 giây](DEMO-165S-DRAFT.md) giữ lời thoại và phần trước/trong hackathon.

Mock ledger ở RAM và reset khi reload. Extension thật, thiết bị vật lý, journal/network/reorg và audit toàn bộ accessibility còn chưa kiểm. T37 lịch sử có route fix/video33.08s; không dùng kết quả đó thay bằng chứng source hiện hành. Core/client/adapter tiền không đổi.

## Ba quyết định trình riêng

1. **Public mock:** đề xuất tạo Site mới tên ReceiptRail Mock Demo, audience public — bất kỳ ai có URL đều xem được. Chỉ artifact mock đã kiểm; không sign/send/RPC devnet. Không cập nhật Site ClusterProof. Chưa đăng ký Site, upload hoặc có URL ReceiptRail công khai.
2. **Mở Phase 6:** theo [PHASE6-PLAN](PHASE6-PLAN.md), đề xuất trần tổng chi 0.05 SOL devnet, dùng signers CLI cũ; không tạo signer/cài thêm/deploy/upgrade/đổi authority. Web giao dịch thật sẽ trình public riêng.
3. **PR #7:** đề xuất giữ mở để review, không merge khi chưa có câu đồng ý riêng.

Quyền headless từ [Prompt04/DECISION](ideas/DECISION.md) không mở ba quyền trên. Chỉ phần local đã kiểm; Phase5 theo ROADMAP còn cổng link công khai.
