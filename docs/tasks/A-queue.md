# Hàng đợi Antigravity — Phase 5 ReceiptRail local

**Chủ file: Codex. T34: đang làm, A đã nhận tại c1446c2.** Người dùng đã mở Phase4 và Phase5 song song; [nguyên văn/quyền](../ideas/DECISION.md). Fetch/pull `work`, đọc Thẻ nhớ/AGENTS/ROADMAP và note liên quan trước làm. **Tiếp tục T34; không chờ C deploy.** C làm Phase4 song song.

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
