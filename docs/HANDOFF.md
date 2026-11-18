# Thẻ nhớ — Codex / chốt review T31–T32, CI đạt
- Trạng thái **đang làm**: chốt checkpoint/read-back PR T31–T32; funding hello/ví thật cần người dùng. P3-A đạt, Phase3/goal chưa xong.
- C trưởng nhóm, sở hữu tài liệu chính/A-queue; A qua queue. Repo /Users/bao/Documents/ChatGPT/dev3pack, branch work; không sửa checkout/file A.
- **“ReceiptRail chính, ClusterProof phụ” lúc00:07 ngày18/11/2026 UTC+7**; **“duyệt phase 2”** log09:27:18.464 UTC+7; nguồn đính chính tại DECISION.
- **“Đồng ý cả hai”** P3-A/P3-B, log10:13:11.851 ngày18/11 UTC+7. Hai câu duyệt không có giờ quyết định tự nêu; không hỏi lại hoặc suy quyền.
- P3-A chỉ ba jobs/pins/locks trên GitHub Ubuntu24.04; không cài thêm local/token/quyền/billing/limit/upload binary.
- **27cf7ac CI đạt:** PR44237534047/push44237529539 đều completed/success3jobs;57tests/run (25runtime+8client+16research+8web), typecheck/build, sinh IDL/ReceiptRail cmp.
- Anchor source8d9d148/lock/version và SBFv1.57/SHA256 đạt; runs cũ terminal, không poll/rerun như live. HEAD tài liệu không là revision có CI.
- Linux bytecode hashes khớp nhau, khác macOS; chưa reproducible/verified build. Giữ binary macOS dự kiến hello; executable inputs không đổi.
- P3-B chỉ hello devnet/signers thử cũ/một buffer tạm/trần1.5SOL. **“chưa rảnh để chuyển sol devnet”** log10:14:46.599 UTC+7: funding để sau; chưa tạo buffer/ký/gửi/deploy.
- T28/T29 tại601e723/306466f có9nhóm findings còn mở. T30/0d7b9d3 nhận phí/terms/Unknown/expiry; state/version/form/CTA và mục3–5 chưa đủ.
- **T31/e483529 đã review:** giữ5URL/EVM/expiry nhưng mất Request/cơ chế; provenance/state/phản hồi chưa đạt. Snapshot riêng, không sửa report A.
- **T32/c801580 nhận một phần**: merchant không ký pay/3tên hàm/baseline đúng, thiếu assertions/log/giới hạn. A làm T33 rồi sửa hẹp T31/T32 cùng ID; không suy process live.
- Checkpoint T30 **991896f đã push**; PR read-back13:47:22 UTC+7 head e483529/work→main/open/merged=false/bodyT30 đúng. Body tại snapshot chưa chứa reviewT31.
- Automation15phút ACTIVE/đúng chat, đã kiểm action/config trong lượt này; checkpoint tài liệu và merge dùng [skip ci].
- Giữ ClusterProof source/web/lab/toolchain, thiết kế dự phòng/chưa duyệt. Cấm Phase4–6/deploy ReceiptRail/public mới/mergePR7/force-push/mainnet/secrets/đổi visibility.
- Bước ngay: reviewT31 đã push3e8f536/mergea86e9b6; chốt reviewT32, cập nhật/read-back PR7 và lưu snapshot. Rồi hello sau funding/review A khi có; không bỏ việc chốt vì funding.

## Bằng chứng hiện hành

[DECISION](ideas/DECISION.md), [quyền/funding](evidence/phase3/user-permission-2026-11-18.json), [CI27cf7ac](evidence/phase3/ci-passed-27cf7ac.json), [PR T30](evidence/phase3/pr7-review-t30-snapshot.json), [reviewT31](evidence/phase2/receiptrail-t31-review.json), [reviewT32](evidence/phase2/receiptrail-t32-review.json), [findings C](reviews/receiptrail-codex.md#review-t32--18112026), [plan](PHASE3-PLAN.md), [cổng](reviews/phase1-3-gates.md), [audit](reviews/prompt03-audit.md). [PR T28/T29](evidence/phase3/pr7-review-t28-t29-snapshot.json) giữ lịch sử, không sửa đè.

## Còn lại

1. **Chốt T31–T32:** kiểm links/anchors/hashes/diff, commit/push [skip ci]; cập nhật/read-back PR7 work→main/open/merged=false/body, lưu snapshot mới và chốt Thẻ nhớ. Không rerun suite/CI cho tài liệu.
2. **Hello sau funding:** quyền P3-B đã có; người dùng để funding sau. Recheck genesis/balance/rent/fees/flags/hash/signers cũ/trần1.5SOL trước tạo buffer/ký/gửi; deploy hello, kiểm executable/owner/programdata/authority/bytecode, initialize/increment/finalized. Preflight09:47:33 UTC+7 payer0lamports/hello chưa deploy là lịch sử, chưa đọc lại.
3. **A:** fetch/pull an toàn, đọc A-done và review T32/T33/T31 bổ sung khi có; chỉ nhận phần có bằng chứng, không sửa file A thay A hoặc đợi A để làm phần độc lập.
4. **Cổng:** giáo viên/review chéo được nhận và connect/disconnect ví thật còn mở; người dùng chưa có ví devnet sẵn sàng. Không tự gọi Phase3/goal xong hoặc mở Phase4–6.

## Bị chặn và điều kiện tiếp tục

Funding hello/ví thật cần người dùng khi họ sẵn sàng; không thúc chuyển ngay, hỏi lại quyền hoặc tự faucet/deploy. CI đã đạt, không có run live cần theo dõi. Review A/giáo viên là cổng riêng; tiếp tục review khi có report mới. Automation giữ ACTIVE. T30 đã chốt read-back; T31 đã push, T32 còn checkpoint và PR cả hai ở mục1 nên chưa được ghi chỉ còn cần funding.
