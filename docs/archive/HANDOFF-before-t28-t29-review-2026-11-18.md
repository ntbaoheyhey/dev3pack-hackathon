> Lịch sử trước review T28/T29 ngày18/11/2026. Trạng thái hiện hành ở [HANDOFF](../HANDOFF.md).

# Thẻ nhớ — Codex / CI Phase3 đạt, hello cần funding
- Trạng thái **bị chặn (cần người dùng)** ở funding hello/ví thật; P3-A đạt, chưa hoàn thành Phase3 hoặc goal.
- C trưởng nhóm, sở hữu tài liệu chính/A-queue; A trợ lý qua queue. Repo /Users/bao/Documents/ChatGPT/dev3pack, branch work; không sửa checkout/file A.
- **“ReceiptRail chính, ClusterProof phụ” lúc00:07 ngày18/11/2026 UTC+7**; **“duyệt phase 2”** log09:27:18.464 UTC+7; nguồn đính chính trong DECISION.
- **“Đồng ý cả hai”** P3-A/P3-B, log10:13:11.851 ngày18/11 UTC+7. Hai câu duyệt không có giờ quyết định tự nêu; không hỏi lại quyền hoặc suy thêm quyền.
- P3-A: ba jobs/pins/locks trên GitHub Ubuntu24.04; không cài thêm local, thêm token/quyền, đổi billing/limit hoặc upload binary.
- **27cf7ac CI đạt:** PR44237534047/push44237529539 đều completed/success3jobs; mỗi run25runtime+8client+16research+8web=57tests, typecheck/build, sinh IDL và ReceiptRail cmp.
- Anchor source8d9d148/lock/version và archive SBFv1.57/SHA256 pass; evidence ci-passed-27cf7ac. Runs7210/b906/a114 đã terminal, không poll hoặc rerun như live.
- Bytecode hashes Linux khớp nhau/7210, khác macOS; chưa reproducible/verified build. Giữ binary macOS cho hello; source/tests/IDL/web/lab/locks không đổi.
- P3-B chỉ hello devnet/signers thử cũ/một buffer tạm/trần1.5SOL. **“chưa rảnh để chuyển sol devnet”**, log10:14:46.599 UTC+7: funding để sau, chưa tạo buffer/sign/send/deploy.
- Checkpointca5312c đã push; PR7 fetch11:46:11 UTC+7 xác minh headca5312c/work→main/open/merged=false/body khớp CI đạt. Snapshot lưu trước checkpoint bàn giao này, không chứng minh HEAD tài liệu đã chạy CI.
- T26/62286cc và T27/50718d0 đã review; T28 UX → T29 evidence/review còn mở. Fetch11:46 UTC+7 chưa report mới; không suy process live từ HANDOFF A.
- Automation15phút ACTIVE, đúng chat; checkpoint tài liệu/merge dùng [skip ci]. Không tạo CI thừa cho tài liệu; chỉ chạy khi có thay đổi cần kiểm trong P3-A.
- Giữ ClusterProof/source/web/lab/toolchain và thiết kế dự phòng, chưa duyệt. Không mở Phase4–6/deploy ReceiptRail/public mới/merge PR7/force-push/mainnet/secrets/đổi visibility.
- Bước tiếp: khi người dùng sẵn sàng funding/ví, recheck rồi làm hello đúng P3-B; đọc A-done/review report mới, không đợi A để làm phần độc lập.

## Bằng chứng hiện hành

[DECISION](../ideas/DECISION.md), [quyền/funding](../evidence/phase3/user-permission-2026-11-18.json), [CI27cf7ac đạt](../evidence/phase3/ci-passed-27cf7ac.json), [snapshot PR7](../evidence/phase3/pr7-ci-passed-snapshot.json), [phương án](../PHASE3-PLAN.md), [pipeline macOS](../evidence/phase3/offline-pipeline-metadata.json), [cổng](../reviews/phase1-3-gates.md), [audit](../reviews/prompt03-audit.md). [Bàn giao trước chốt CI](../archive/HANDOFF-before-ci-passed-2026-11-18.md) là lịch sử, không tái dùng trạng thái pending.

## Còn lại

1. **Hello sau funding:** quyền P3-B đã có; funding được người dùng để sau. Recheck genesis/balance/rent/fees/flags/hash và signers thử cũ/trần1.5SOL trước tạo buffer/ký/gửi. Deploy hello, kiểm executable/owner/programdata/authority/bytecode, initialize/increment và finalized. Preflight09:47:33 UTC+7 có payer0lamports/hello chưa deploy; không là số dư vừa đọc lại.
2. **A:** fetch/pull an toàn, đọc A-done và review T28/T29 khi có; chỉ nhận nội dung có bằng chứng. Không sửa report/A-done/HANDOFF A thay A hoặc coi report nộp là cổng đạt.
3. **Cổng:** giáo viên chấm/review chéo được nhận và connect/disconnect ví thật còn mở. Người dùng chưa có ví devnet sẵn sàng; giữ chưa kiểm. Không tự gọi Phase3/goal xong hoặc mở Phase4–6.

## Bị chặn và điều kiện tiếp tục

CI được người dùng yêu cầu tiếp tục lúc log10:35:20.180 UTC+7 đã đạt; billing/attestation/SBF cũ không còn là blocker. Funding hello/ví thật cần người dùng khi họ sẵn sàng; không thúc chuyển ngay, hỏi lại quyền P3-A/P3-B hoặc tự gọi faucet/deploy. Review A/giáo viên là cổng riêng. Không còn run CI live hoặc sửa code chưa kiểm; automation giữ ACTIVE để đọc tin mới và report đúng phạm vi.
