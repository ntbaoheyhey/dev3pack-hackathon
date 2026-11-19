# Hàng đợi Antigravity — Phase 5 ReceiptRail local

**Chủ file: Codex. T35 đã review; T36 mới — A sửa UI/lifecycle, C sửa mock adapter tiền/trạng thái song song.** Người dùng đã mở Phase4 và Phase5; [nguyên văn/quyền](../ideas/DECISION.md). Fetch/pull `work`, đọc Thẻ nhớ/AGENTS/ROADMAP/note trước làm. P4-B đã hoàn tất162tx finalized, không chạy lại. Không cần chờ C để bắt đầu phần A.

## T36 — UI/lifecycle local theo phần thiếu cụ thể (mới, làm ngay)

[Review r2](../reviews/receiptrail-phase5-r2.md) nhận phần đạt của T35; [repro7ca](../reviews/receiptrail-phase5-r2-repro.json) là lỗi hiện tại. Không mở lại T31–T33 hoặc sửa reportT35 cho đẹp. C chịu trách nhiệm `adapter.ts`, `types.ts` và **file test mới** `receiptrail-adapter-review.test.mjs`; A không sửa3file này trong T36. C giữ API async hiện tại và public mockEngine/client/roles; sẽ ghi contract mới khi push.

A sở hữu `ReceiptRailApp.tsx`, `mock-wallets.ts`, CSS, production lifecycle/controller mới nếu cần, `tests/receiptrail.test.mjs` và test UI mới, note025/evidence Phase5. Đọc DEVLOG và review trước sửa.

1. Tách production controller/hook quản lý snapshot Create/Pay/Cancel; test gọi chính code dùng bởi app. Reset khi đổi wallet identity kể cả cùngaddress, accounts/chains/disconnect, đổi invoice, sửa input/preset/slot thay terms. Submit dùng snapshot đã duyệt, không tự dựng Cancel terms tại click. Chặn double submit ngay trước await; stale async results không thay selection/ví mới.
2. Wallet Standard mock publicKey phải encode đúng address. Test connector production của SDK, account/chain change, disconnected/guest/reject không cần browser. Không gọi sign/send feature hoặc tự mở extension. Nếu SDK không expose chains thì subscribe standard:events trong lifecycle; ghi đúng giới hạn.
3. Review đầy đủ merchant/payer/amount/expiry/ID/PDA/rent/fee mock trước Create; preview expiry đúng input và giới hạn u64; thay input mất xác nhận. Catch lỗi list/detail rõ ràng, không nuốt decode hoặc unhandled promise.
4. Sửa responsive theo ảnh mobile375×812 hiện có (cắt ngang); wallet/controls/banner/details/list cần wrap/min-width phù hợp, giữ full-address/copy. Sửa copy mock sát action/receipt/storyboard, bỏ bảo vệ tuyệt đối và “on-chain” khi đọc mock. Cập nhật note025 (reject không luôn4001, signature có trước send, recheck chỉ đọc).
5. Chạy tests/build bằng cache; giữ log/test names/giới hạn thật. Theo yêu cầu dừng điều khiển giao diện, **không CUA/browser automation/headless/mouse-keyboard** trong T36, không tạo ảnh mới; dùng source/CLI và ảnh có sẵn. Ghi rõ browser sau sửa còn chưa kiểm, không suy tests/build = responsive đã xác minh. Không public/install/Phase6.

Push mốc nhỏ `[skip ci]`, ghi A-done/HANDOFF A đúng sở hữu. C không chờ A và tiếp tục phần adapter/review. Nếu thấy vấn đề client C, ghi finding, không sửa program/IDL/generated client/locks.

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
