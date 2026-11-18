# Thẻ nhớ — Codex / CI đạt, review đã bàn giao
- Trạng thái **bị chặn (cần người dùng)** ở funding hello/ví thật; review/queue đã push và PR đã đọc lại. P3-A đạt, chưa hoàn thành Phase3 hoặc goal.
- C trưởng nhóm, sở hữu tài liệu chính/A-queue; A trợ lý qua queue. Repo /Users/bao/Documents/ChatGPT/dev3pack, branch work; không sửa checkout/file A.
- **“ReceiptRail chính, ClusterProof phụ” lúc00:07 ngày18/11/2026 UTC+7**; **“duyệt phase 2”** log09:27:18.464 UTC+7; nguồn đính chính trong DECISION.
- **“Đồng ý cả hai”** P3-A/P3-B, log10:13:11.851 ngày18/11 UTC+7. Hai câu duyệt không có giờ quyết định tự nêu; không hỏi lại quyền hoặc suy thêm quyền.
- P3-A: ba jobs/pins/locks trên GitHub Ubuntu24.04; không cài thêm local, thêm token/quyền, đổi billing/limit hoặc upload binary.
- **27cf7ac CI đạt:** PR44237534047/push44237529539 đều completed/success3jobs; mỗi run25runtime+8client+16research+8web=57tests, typecheck/build, sinh IDL và ReceiptRail cmp.
- Anchor source8d9d148/lock/version và archive SBFv1.57/SHA256 pass; evidence ci-passed-27cf7ac. Runs cũ đã terminal, không poll/rerun như live.
- Bytecode hashes Linux khớp nhau/7210, khác macOS; chưa reproducible/verified build. Giữ binary macOS cho hello; source/tests/IDL/web/lab/locks không đổi.
- P3-B chỉ hello devnet/signers thử cũ/một buffer tạm/trần1.5SOL. **“chưa rảnh để chuyển sol devnet”**, log10:14:46.599 UTC+7: funding để sau, chưa tạo buffer/sign/send/deploy.
- **T28/T29 tại601e723 đã review:** nhận phí create/pay, Unknown không tự ký/retry và baseline retry Paid→Paid; còn9findings. Snapshot3reports/6hashes/9mã/165giây đã kiểm, UX4mục.
- Bản306466f đến trước push: đã merge23edfc1, review bổ sung nhận Request/copy6007; UX lại mất phí create/Unknown/terms/context. Snapshot v2 giữ riêng; chưa đóng9findings.
- A làm **T30→T31→T32→T33**: semantics/form UX, evidence, review assertions, bố cục/demo/SDK. Queue cũ T21–T29 đã archive; không sửa report/A-done/HANDOFF A hoặc suy process live.
- Checkpointb1804eb đã push; PR7 read-back12:53:40 UTC+7: headb1804eb/work→main/open/merged=false/body khớp. Snapshot lưu riêng; checkpoint bàn giao sau đó không là revision có CI.
- Automation15phút ACTIVE, đúng chat, đã kiểm action/config18/11; checkpoint tài liệu/merge dùng [skip ci]. HEAD tài liệu không là revision đã chạy CI.
- Giữ ClusterProof/source/web/lab/toolchain và thiết kế dự phòng, chưa duyệt. Không mở Phase4–6/deploy ReceiptRail/public mới/merge PR7/force-push/mainnet/secrets/đổi visibility.
- Bước tiếp: đọc A-done/review T30–T33 khi có bản mới; khi người dùng sẵn sàng funding/ví, recheck rồi làm hello đúng P3-B. Không đợi A để làm phần độc lập.

## Bằng chứng hiện hành

[DECISION](ideas/DECISION.md), [quyền/funding](evidence/phase3/user-permission-2026-11-18.json), [CI27cf7ac đạt](evidence/phase3/ci-passed-27cf7ac.json), [snapshot PR7 sau review](evidence/phase3/pr7-review-t28-t29-snapshot.json), [phương án](PHASE3-PLAN.md), [snapshot review601e723](evidence/phase2/receiptrail-t28-t29-review.json), [bản306466f](evidence/phase2/receiptrail-t28-t29-v2-review.json), [findings C](reviews/receiptrail-codex.md#review-t28-và-t29--18112026-heartbeat1235-utc7), [cổng](reviews/phase1-3-gates.md), [audit](reviews/prompt03-audit.md). [Bàn giao trước review](archive/HANDOFF-before-t28-t29-review-2026-11-18.md) là lịch sử; T28/T29 không còn là việc chưa nộp.

## Còn lại

1. **Hello sau funding:** quyền P3-B đã có; funding được người dùng để sau. Recheck genesis/balance/rent/fees/flags/hash và signers thử cũ/trần1.5SOL trước tạo buffer/ký/gửi. Deploy hello, kiểm executable/owner/programdata/authority/bytecode, initialize/increment và finalized. Preflight09:47:33 UTC+7 có payer0lamports/hello chưa deploy; không là số dư vừa đọc lại.
2. **A:** fetch/pull an toàn, đọc A-done và review T30–T33 khi có. Chỉ nhận nội dung có bằng chứng; không sửa file A thay A hoặc coi report nộp là cổng đạt.
3. **Cổng:** giáo viên chấm/review chéo được nhận và connect/disconnect ví thật còn mở. Người dùng chưa có ví devnet sẵn sàng; giữ chưa kiểm. Không tự gọi Phase3/goal xong hoặc mở Phase4–6.

## Bị chặn và điều kiện tiếp tục

Funding hello/ví thật cần người dùng khi họ sẵn sàng; không thúc chuyển ngay, hỏi lại quyền P3-A/P3-B hoặc tự gọi faucet/deploy. Checkpoint reviewb1804eb đã push, PR7 đã cập nhật/read-back12:53:40 UTC+7 và snapshot được lưu. Review A/giáo viên là cổng riêng; tiếp tục khi có report mới. CI đã đạt và không còn run live cần theo dõi. Automation giữ ACTIVE; chưa có hành động độc lập cụ thể khác trong phạm vi Phase3 hiện tại.
