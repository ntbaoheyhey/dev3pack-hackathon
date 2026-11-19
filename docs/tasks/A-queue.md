# Hàng đợi Antigravity — Phase 5 ReceiptRail local

## Hiện hành — Prompt 04, 19/11/2026 23:10:07.582 UTC+7

Thứ tự mới **T37 → T38 → T39**. Quyền trong [DECISION](../ideas/DECISION.md): headless có sẵn, localhost, ví mock; không điều khiển màn hình/chuột/bàn phím máy người dùng. Không cài, public, deploy/upgrade, signer mới, merge PR7 hoặc Phase 6 thật. Các đoạn T34–T36 bên dưới là lịch sử đã đóng; lệnh cấm headless cũ đã được thay đúng phạm vi này. C nghiên cứu/review song song, không chờ A.

### T37 — Kiểm browser local và quay thử demo (mới)

- Đọc notes025/013 và PHASE5-PLAN trước làm. Dùng Playwright/Chromium/ffmpeg đã có trong cache; ghi đường dẫn và phiên bản thật. Thiếu thành phần thì báo tên và dừng phần đó, tiếp tục T38; không tải/install/npx.
- Server localhost hiện có tại `http://127.0.0.1:4175/receiptrail/`; kiểm source đang phục vụ khớp bản work đã pull. Nếu server tắt, chạy `npm run dev -- --port 4175 --strictPort` trong apps/web bằng cache. Headless=true; chỉ localhost và ví mock; chặn request ra mạng trong browser. Không CUA/browser hiển thị, không ví extension thật.
- Chạy đủ **8 ca** trong bảng [PHASE5-PLAN](../PHASE5-PLAN.md) ở **1440×900 và 375×812** (16 kết quả). Mỗi ca ghi bước cụ thể, expected, actual, PASS/FAIL và ảnh tên mới có ngày/viewport/case. Không sửa core hoặc đánh dấu đạt bằng HTTP200/ảnh Loading.
- Kiểm Tab/Shift+Tab, focus nhìn thấy, clipboard, full address; ở375px đo scrollWidth không vượt clientWidth của trang (bảng được cuộn trong vùng riêng). Các ca Unknown phải kiểm cả đã xử lý và bị drop, không chỉ nhãn.
- Quay thử luồng demo bằng Playwright `recordVideo`, mock có nhãn; sườn165giây, ghi thời lượng **file thật**, không đổi metadata để giả thời lượng. Lưu video khi context đóng xong; quá165giây ghi thực tế/finding. Không dùng sleep dài chặn cập nhật tiến độ.
- Nộp `docs/evidence/phase5/t37-YYYY-MM-DD/` gồm script tái chạy, report16ca, ảnh/video, log, manifest source hashes và command/version/duration. Cập nhật note025/DEVLOG/A-done/HANDOFF A, commit/push `[skip ci]`.
- Lỗi UI thật ghi reproduction/finding. C review **một lượt**: nếu cần sẽ giao đúng một task sửa implementation có danh sách; thiếu report nhẹ thành nợ tài liệu, không vòng nộp lại vô hạn.

### T38 — Học trước Phase 6 phía A (mới, sau T37)

- Viết note027 `docs/learning/027-receiptrail-wallet-e2e.md` (C đã giữ số trong mục lục): Wallet Standard Phantom/Solflare/Backpack devnet, signTransaction/signAndSendTransaction, reject/errors thực tế, account/network change, Unknown và blockhash expiry; phân biệt API/docs với điều đã kiểm thật.
- Nguồn chính thức/source/issue gốc, URL/ngày đọc/version; nguồn cộng đồng chỉ bổ trợ, không suy mọi ví dùng4001. Lập bảng feature/capability cần kiểm cho từng ví và phương án test e2e headless/mock so với extension thật.
- Nêu contract adapter cần từ C, UX cho 429/offline/lag/status-null/reject, không tự gửi lại. Không code adapter thật, cài ví, import signer hay ký/gửi transaction. Thiếu nguồn ghi giới hạn.
- Xong khi có ma trận ít nhất3ví,8ca lỗi với expected/CTA, kế hoạch e2e có bước và evidence; cập nhật DEVLOG/A-done và push `[skip ci]`. C nhận phần dùng được, không vòng sửa report.

### T39 — Checklist bug bash Phase 7 (mới, sau T38)

- Viết `docs/PHASE7-BUG-BASH.md` và note029 `docs/learning/029-receiptrail-bug-bash.md`: desktop/mobile,3ví, bàn phím/a11y, amount/expiry/terms/role, double click, reload/Unknown, network/rate limit, state/commitment, mock labels và link đúng cluster.
- Mỗi ca có precondition/bước/expected/severity/evidence/owner; cột kết quả mặc định **chưa chạy**, không đánh dấu kiểm điện thoại/ví thật bằng headless giả lập. Tách local/mock được phép khỏi phase devnet/public chờ duyệt.
- Tiêu chí nhận: tối thiểu20ca, P0/P1 chặn release rõ, manifest snapshot và mẫu báo lỗi tái hiện được; học/nguồn trước checklist, DEVLOG/A-done/push `[skip ci]`. Không sửa core hay tự mở phase.

---

## Lịch sử T34–T36 (đã đóng)

**Chủ file: Codex. T34/T35/T36 đã nhận phần đạt và đóng; không có vòng sửa report mới.** Người dùng đã mở Phase4 và Phase5; [nguyên văn/quyền](../ideas/DECISION.md). Fetch/pull `work`, đọc Thẻ nhớ/AGENTS/ROADMAP/note trước làm. P4-B đã hoàn tất162tx finalized, không chạy lại. Không tự mở task mới khi hàng đợi trống.

## T36 — Đã nhận và đóng sau hợp nhất

A nộp a88ce9e/64b2573, bàn giao17ed43c. C nhậnCSS/tablewrapper/note025; hợp nhất logic ví/terms bằng modelC theo phânchia093e36b. [Review r3](../reviews/receiptrail-phase5-r3.md):45tests/build+7repro đạt local, browser sau sửa chưa kiểm. Không nộp lạiT36, không sửa tiếp TSX/controller/tests hoặc chụp browser. PatchA và [queue cũ](../archive/A-queue-T36-implementation-2026-11-19.md) được giữ làm lịch sử.

Hiện không có task implementation mới choA. C chuẩn bị hồ sơ/artifact và cổng người dùng. Chưa public/cài/Phase6; yêu cầu dừng điều khiểnGUI vẫn áp dụng. A không tự đóng toànPhase5 hoặc suy quyền từ việcT36đóng.

## T35 — Đã nộp69e458a; review r2 nhận phần đạt, T36 xử lý implementation còn thiếu

Nguồn cụ thể: [review C](../reviews/receiptrail-phase5-r1.md),5nhóm P5-01…05 có reproduction/acceptance. Đây là sửa code mới, không vòng report T31–T33. Giữ đúng sở hữu T34/local/cache; không cài/deploy/public/Phase6. Đọc/cập nhật note025 và source cache trước sửa.

- Chặn duplicate create/terminal reset; derive valid fixtures từ client/IDL; lấy layout/discriminator từ CONTRACT sinh, không tự chép.
- Validate trước fault, pending per-invoice/khóa thao tác; Unknown recovery không fabricate terminal sau expiry/cancel, không đổi signature/PDA/terms.
- Tích hợp Wallet Standard discover/connect/disconnect/events với mock wallet cùng interface; kiểm reject/no-wallet, đổi wallet cùng address, accounts/chains, mọi reset terms; khóa sign/send mạng. Không thay bằng3nút đổi role.
- Input strict hex/u64; review snapshot trước create/cancel; list/selected detail đúng account; error boundary và stale async guard.
- Sửa copy mock/rent/cancel và browser sau content ready, thao tác desktop/mobile; báo command/output/expected-actual thật, không báo ảnh Loading là đủ demo.

Sản phẩm: code/tests + evidence phase5 r2 + note025/DEVLOG/A-done, push `[skip ci]`; C nhận khi có. Tests gọi production adapter/lifecycle/controller, không tự gán biến trong test để chứng minh UI. Client API của C đã được nhận, không sửa C inputs/locks. C tiếp tục P4-B độc lập.

## T34 — Học rồi triển khai UI ví/thanh toán ReceiptRail

### Mục tiêu và phạm vi

Làm các màn hình ReceiptRail của [IDEA](../IDEA.md)/[ARCHITECTURE](../ARCHITECTURE.md) với mock adapter có nhãn rõ, đi được demo165giây trên localhost. Tích hợp chọn/kết nối/ngắt Wallet Standard bằng dependencies đã có, kiểm bằng mock wallet; chưa gửi giao dịch thật. Giữ trang ClusterProof và `/lab/` hiện có; thêm route local `/receiptrail/`. Không đổi hosting/public site.

### Học trước code

- Đọc notes005/007/013/023, [IDL](../idl/receiptrail.json) và ARCHITECTURE mục3–8; report UX cũ là tài liệu tham khảo có nợ D03, không lấy câu sai làm contract.
- Kiểm phiên bản/source cache của React/Vite, @solana/client/react-hooks và Wallet Standard hiện có. Không npm install/npx/tải browser hoặc dependency. Nếu cache thiếu, ghi tên/version/lệnh cần và làm phần độc lập tiếp.
- C đã giữ chỗ **note025**: `docs/learning/025-receiptrail-frontend-wallet.md`. Viết học trước code: mock/chain boundary, state khác commitment, amount bigint/decimal, wallet lifecycle/no-wallet/reject/account change, Unknown recovery và kiểm browser. Dẫn docs/source chính thức có version; cập nhật mục lục và DEVLOG.

### Sản phẩm triển khai

- A sở hữu `apps/web/src/receiptrail/`, route/wiring/CSS/tests cần thiết của `apps/web/`, note025 và `docs/evidence/phase5/`; không sửa programs/Cargo/IDL/client C/queue/DECISION/HANDOFF C.
- Merchant form: payer, SOL tối đa9 chữ số thập phân, expiry slot; review terms + rent + fee trước thao tác; cùng invoiceID/PDA cho recovery, không tự tạo ID mới khi timeout.
- Invoice/receipt: đầy đủ merchant/payer/amount/expiry/address; Open/Paid/Cancelled, Expired là Open đã quá slot. Commitment hiển thị riêng. Người xem không ví vẫn đọc; đúng payer mới Pay, merchant mới Cancel; merchant được Cancel Open đã expired, Paid không Pay/Cancel.
- Pending/Unknown: giữ invoice/signature nếu có, nút kiểm tra lại; không tự ký/gửi lại hoặc coi timeout là thất bại. Mock fault-injection có nhãn, rollback/principal/fee tách riêng; không trình mock là devnet thật.
- Wallet: tái dùng Wallet Standard được cài; connect/disconnect, no-wallet, reject, account change làm mất terms đã xác nhận. Không tự tạo/import ví, không xin seed/mật khẩu; khóa broadcast thật trong chế độ Phase5 local.
- Adapter có interface riêng để C nối client sinh từ IDL ở Phase4; không tự hard-code layout/discriminator/errors theo trí nhớ. Có thể dùng fixture typed theo contract hiện hành, không chờ client C.
- Responsive mobile/desktop, bàn phím/label/focus/status dễ đọc; giữ full address/copy, tránh lộ dữ liệu thử như tài sản thật.

### Kiểm và tiêu chí nhận

1. Chạy test/build bằng cache (`npm test`, `npm run build` nếu scripts hiện có); không cài thêm. Test hành vi: amount/u64, vai/expiry, rejected connect/sign, account switch, pending/Unknown→read/Paid, không auto-resend.
2. Chạy browser localhost, chụp đủ màn hình chính ở mobile/desktop; ghi URL, viewport, bước, expected/actual. Demo165giây là kịch bản/quay thử mock có nhãn; chưa public hoặc tuyên bố devnet/payment thật.
3. Ghi kết quả/commit/lệnh/test/log/ảnh/giới hạn vào `docs/evidence/phase5/README.md` và A-done; cập nhật HANDOFF A. Không tự đóng phase hoặc sửa core nếu thấy lỗi, ghi finding cụ thể cho C.
4. Push mốc note trước code, rồi UI/test sau mỗi bước lớn; mọi commit/merge dùng `[skip ci]`. Thiếu quyền public/deploy/install ghi rõ, không tự vượt.

P4-A/P4-B đã được đồng ý cho **C chạy CI và CLI deploy/smoke**; phạm vi T34 của A vẫn UI/ví/mock local, không public hoặc broadcast thật. C sẽ cập nhật identity/IDL/client trước deploy; A import artifact C, không hard-code programID/layout.

## Bàn giao client từ C — 19/11

Client đã có tại `packages/receiptrail-client/index.mjs` + types, contract [PHASE4-CLIENT](../PHASE4-CLIENT.md). C kiểm23/23tests, generated/TypeScript/browser-target bundle local; không network/sign/send. **Trong T34**, dùng API cho amount/PDA/owner/terms/role/expiry; giữ mock label/broadcast khóa. Trả về imports, test/build/browser evidence và xác nhận dùng được hoặc finding cụ thể. Đây là bàn giao artifact cho T34, không mở task/vòng sửa T31–T33.

Identity P4-B đã đổi sau CI đầu đạt: import PROGRAM_ADDRESS mới từ client/IDL cùng checkpoint, không giữ ID local cũ. Runtime32/client23 local đã kiểm sau đổi ID; chưa devnet broadcast ở mốc này.

## Review để áp dụng ngay trong T34 (C, sau note025)

C đã đọc note025 tại6b33dbf; tiếp tục code/test, không dừng để làm một vòng report. Khi triển khai: (1) bỏ confirmedTerms trên mọi thay đổi wallet/account/chain/disconnect cho cả Pay và Cancel; ví dụ effect chỉ so `connectedAddress !== confirmedTerms.payer` không bao phủ merchant và thay wallet cùng địa chỉ; (2) Wallet Standard `StandardConnectMethod` không quy định mọi reject có code4001 trong typings cache, nên giữ xử lý lỗi unknown/reject theo nguồn thật và không ép mọi ví theo4001; (3) signature là từ ký transaction trước gửi, không phải RPC cấp mới; Unknown giữ signature đã có và cùng invoiceID/PDA. Chứng minh ba ca này bằng test hành vi trong lần nộp T34, không broadcast thật.

## Lịch sử đã đóng

T31/T32/T33 đóng sau đúng lượt cuối `7857e9b`; [nợ D01–D03](../DOCUMENTATION-DEBT.md). Không mở vòng sửa/nộp lại/task bổ sung cho ba report cũ. [Queue trước Phase5](../archive/A-queue-closed-before-phase5-2026-11-19.md) là lịch sử. T34 là triển khai mới đã được người dùng yêu cầu, không sửa ba report cũ để trả nợ.
