# Hàng đợi Antigravity — Phase 6 ReceiptRail

## T42 — Đối chiếu nguồn Dev3Pack cho Mission 01 (mới, 24/11)

Tìm nguồn công khai của BTC cho kỳ Global Hackathon 2026: giờ đóng form theo múi giờ, điều kiện đội và sở hữu trí tuệ, partner tracks đã công bố, tutorial hoặc video chính thức. Tìm thêm một bài viết gốc tiếng Trung về triển khai thanh toán Solana hoặc bài chia sẻ của đội thi để đối chiếu. Đọc trực tiếp nguồn đã chọn. Ghi URL, ngày xuất bản nếu có, ngày đọc, câu hỏi nguồn trả lời, chủ thể có thẩm quyền và điều còn thiếu.

Đầu ra duy nhất là `research/mission-01/nguon-tu-antigravity.md` và dòng kết quả trong A-done. Chỉ nghiên cứu nguồn công khai. Dùng bản đọc web đã có, không đăng nhập dashboard, hỏi BTC, chạy sản phẩm, ký/gửi giao dịch, cài đặt hoặc sửa mã nguồn. Không điền giờ từ countdown nếu không có timezone. Hoàn thành khi có bảng bằng chứng hoặc ghi được trang cụ thể đã tra và mức truy cập. C tiếp tục phần đối chiếu độc lập.

## T43 — Nghiên cứu trải nghiệm đọc receipt bằng bàn phím (sau T42, 24/11)

Kiểm câu hỏi mới trong Mission 01: ở viewport 320 CSS px hoặc khi nội dung được zoom, người xem chưa nối ví có đọc đúng trạng thái, số tiền và phân biệt dữ liệu mock không? Dùng bản snapshot frontend mock sẵn có của nhóm trên localhost và Chromium/Playwright headless đã cache. Ghi lại đúng revision, viewport, phương thức zoom (nếu có), thứ tự focus và thông báo đọc được khi thao tác chỉ bằng bàn phím. Đối chiếu với WCAG Reflow/Focus Visible ở mức quan sát, không tuyên bố audit trợ năng hay thử trên người thật. Nếu UI không có một hành động, ghi quan sát đó.

Phạm vi chỉ quan sát localhost/ví mock, cấm request ra ngoài trong phiên browser. Không điều khiển GUI, không cài browser hoặc dependency, không mở extension, không ký hoặc gửi, không sửa mã frontend và không public. File kết quả `research/mission-01/qa-ban-phim-tu-antigravity.md`, tối đa một bảng ngắn có expected/actual và một liên kết bằng chứng cho mỗi finding. C chỉ nhận báo cáo để học và đánh giá, không mở phase sửa sản phẩm.

## T41 — Wallet Standard cho bản tích hợp local (mới,20/11)

Người dùng đã mở Phase6 theo DECISION, log lượt08:38:01UTC+7; PR7 giữ mở. C đang public snapshot mock106a18e riêng và làm adapter/journal/CLI. A làm task này ngay, không chờ C; không thay bundle public mock hoặc mở lại T37–T40.

- **Học trước:** notes025–027, reviewT38 và PHASE6-PLAN; kiểm source/types cache, ghi bài học note027 trước code. Không cài/download/npx, không ký/gửi RPC thật hoặc import signers.
- **Phạm vi A:** tạo `apps/web/src/receiptrail/devnet-wallet-connection.ts`, `devnet-wallet-panel.tsx` và test riêng `apps/web/tests/devnet-wallet.test.mjs`. Dùng Wallet Standard discovery/connect/disconnect/events với wallet registry thật; tests dùng fixtures/mock, không đăng ký bốn demo wallets trong production connector.
- **Contract C/A:** export `ReceiptRailDevnetWalletConnection` với `subscribe`, `getSnapshot`, `connect(wallet)`, `disconnect()`, `destroy()`. Snapshot gồm danh sách wallets, wallet/account đã chọn (hoặc null), `generation` tăng khi account/chain/session đổi, `connecting`, thông báo lỗi. Giữ nguyên raw wallet/account để C kiểm feature/chain/transaction version. Component panel nhận connection và chỉ chọn/kết nối/ngắt ví, nhãn devnet; không tự gọi sign/send, không fallback mock khi thiếu ví.
- **Yêu cầu:** cùng address khác wallet/session vẫn invalidate; disconnect/account/chain đổi phải báo ngay, bỏ kết quả connect muộn; chỉ account có `solana:devnet`, kiểm chains/features ở cả wallet/account; không giả mọi reject=4001; no-wallet/unsupported chain có hướng dẫn rõ. Không tự mở popup khi mount, không RPC warmup, không truy cập chuột/phím/màn hình người dùng.
- **Không sửa phần C:** program/client/IDL, adapter.ts, confirmation.ts, wallet-lifecycle.ts, mock entry, ReceiptRailApp.tsx, devnet adapter/journal/budget/CLI. C nối panel vào entry local riêng sau khi nhận. Nếu cần contract đổi, ghi lý do vào A-done, không đoán API.
- **Xong:** tests có discovery/register/unregister, connect/reject, events account/chain/disconnect, connect muộn, reload subscription cleanup, không RPC/sign/send; typecheck/build cache; evidence/report một lượt có commands/results, note027/DEVLOG/A-done; commit/push `[skip ci]`. C nhận phần đạt, lỗi implementation giao sửa cụ thể, thiếu report nhẹ thành nợ. Không tự tuyên bố toàn Phase6 đạt.

## Lịch sử trước quyền20/11

**Cập nhật C20/11:** đã nhận T40 (`51ee3b2`), T38 (`11d58b1`) và T39 (`a074779`). Ba task đóng sau một lượt nhận; hiệu chỉnh T38/T39 trong `docs/reviews/`, phần chưa kiểm là D06/D07. Không mở thêm vòng report. C đã chốt source106a18e và evidence681ae03:52tests,16ca source+2ca slot,10ca artifact và video162.12s; đã trình ba quyết định, chưa có trả lời. Chưa có task phụ thuộc Phase6/public được phép chạy; các phân công cũ bên dưới là lịch sử.

## Lịch sử giao Prompt 04 — đã nhận/đóng T37–T40

Thứ tự khi giao là **T40 → T38 → T39**; hiện cả ba đã đóng. T37 đã được C review một lượt và đóng báo cáo; xem [review T37](../reviews/receiptrail-phase5-t37.md). Quyền trong [DECISION](../ideas/DECISION.md): headless có sẵn, localhost, ví mock; không điều khiển màn hình/chuột/bàn phím máy người dùng. Không cài, public, deploy/upgrade, signer mới, merge PR7 hoặc Phase 6 thật. Các đoạn T34–T36 bên dưới là lịch sử đã đóng; lệnh cấm headless cũ đã được thay đúng phạm vi này. C nghiên cứu/review song song, không chờ A.

### T40 — Sửa P5-F01 (đã nhận/đóng)

Đây là **một task sửa implementation** sau T37, không vòng sửa report. C giao lại cho A quyền sửa hẹp `apps/web/src/receiptrail/mock-wallets.ts`, regression test tương ứng và note025. Không sửa adapter/confirmation/program/client/IDL.

**Phân công C bổ sung trong cùng T40:** kiểm trực tiếp phát hiện `createClient` tự gọi getLatestBlockhash lúc khởi tạo dù mock. C sở hữu `ReceiptRailApp.tsx` và module kết nối mock riêng để bỏ RPC warmup/giới hạn đúng fixtures, cùng harness kiểm nguồn thật/public entry. A tiếp tục fixture/registration regression/bootstrap; không sửa các file C đang xử lý. Đây là sửa ranh giới mock, không mở adapter devnet hoặc thêm vòng report.

1. Sửa địa chỉ fixture ví từ chối thành pubkey hợp lệ 32 bytes; phương án A đã tìm là thêm `1` thành `14uQeVj5tqViQh7yWWGStvfEG1Zmhx6uasJtWCJziofM`. Đây chỉ là public fixture, không tạo keypair hoặc signer.
2. Thêm regression thực gọi `registerMockWallets()` trên registry mới, kiểm tất cả ví đăng ký có address/publicKey đúng 32 bytes và ví từ chối vẫn reject. Test phải bắt được lỗi baseline; không chỉ gọi helper với merchant hợp lệ.
3. Chạy web tests/build bằng cache; mở headless localhost/mock ở 1440×900 và 375×812, kiểm ReceiptRail mount + 4 mock connectors và không có pageerror. **Không intercept sửa source/response**, chặn request ngoài localhost. Lưu log/kết quả/ảnh mới dưới `docs/evidence/phase5/t40-YYYY-MM-DD/`, không ghi đè T37.
4. Ghi note025/DEVLOG/A-done, commit/push `[skip ci]`, rồi tiếp tục T38/T39. Không sửa report T37 hoặc tự nhận Phase 5 xong. C đang viết harness bổ sung 8 ca và chốt artifact, A không trùng việc đó.

### T37 — Đã review và đóng báo cáo (lịch sử yêu cầu)

- Đọc notes025/013 và PHASE5-PLAN trước làm. Dùng Playwright/Chromium/ffmpeg đã có trong cache; ghi đường dẫn và phiên bản thật. Thiếu thành phần thì báo tên và dừng phần đó, tiếp tục T38; không tải/install/npx.
- Server localhost hiện có tại `http://127.0.0.1:4175/receiptrail/`; kiểm source đang phục vụ khớp bản work đã pull. Nếu server tắt, chạy `npm run dev -- --port 4175 --strictPort` trong apps/web bằng cache. Headless=true; chỉ localhost và ví mock; chặn request ra mạng trong browser. Không CUA/browser hiển thị, không ví extension thật.
- Chạy đủ **8 ca** trong bảng [PHASE5-PLAN](../PHASE5-PLAN.md) ở **1440×900 và 375×812** (16 kết quả). Mỗi ca ghi bước cụ thể, expected, actual, PASS/FAIL và ảnh tên mới có ngày/viewport/case. Không sửa core hoặc đánh dấu đạt bằng HTTP200/ảnh Loading.
- Kiểm Tab/Shift+Tab, focus nhìn thấy, clipboard, full address; ở375px đo scrollWidth không vượt clientWidth của trang (bảng được cuộn trong vùng riêng). Các ca Unknown phải kiểm cả đã xử lý và bị drop, không chỉ nhãn.
- Quay thử luồng demo bằng Playwright `recordVideo`, mock có nhãn; sườn165giây, ghi thời lượng **file thật**, không đổi metadata để giả thời lượng. Lưu video khi context đóng xong; quá165giây ghi thực tế/finding. Không dùng sleep dài chặn cập nhật tiến độ.
- Nộp `docs/evidence/phase5/t37-YYYY-MM-DD/` gồm script tái chạy, report16ca, ảnh/video, log, manifest source hashes và command/version/duration. Cập nhật note025/DEVLOG/A-done/HANDOFF A, commit/push `[skip ci]`.
- Lỗi UI thật ghi reproduction/finding. C review **một lượt**: nếu cần sẽ giao đúng một task sửa implementation có danh sách; thiếu report nhẹ thành nợ tài liệu, không vòng nộp lại vô hạn.

### T38 — Học trước Phase 6 phía A (đã nhận/đóng)

- Viết note027 `docs/learning/027-receiptrail-wallet-e2e.md` (C đã giữ số trong mục lục): Wallet Standard Phantom/Solflare/Backpack devnet, signTransaction/signAndSendTransaction, reject/errors thực tế, account/network change, Unknown và blockhash expiry; phân biệt API/docs với điều đã kiểm thật.
- Nguồn chính thức/source/issue gốc, URL/ngày đọc/version; nguồn cộng đồng chỉ bổ trợ, không suy mọi ví dùng4001. Lập bảng feature/capability cần kiểm cho từng ví và phương án test e2e headless/mock so với extension thật.
- Nêu contract adapter cần từ C, UX cho 429/offline/lag/status-null/reject, không tự gửi lại. Không code adapter thật, cài ví, import signer hay ký/gửi transaction. Thiếu nguồn ghi giới hạn.
- Xong khi có ma trận ít nhất3ví,8ca lỗi với expected/CTA, kế hoạch e2e có bước và evidence; cập nhật DEVLOG/A-done và push `[skip ci]`. C nhận phần dùng được, không vòng sửa report.

### T39 — Checklist bug bash Phase 7 (đã nhận/đóng)

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
