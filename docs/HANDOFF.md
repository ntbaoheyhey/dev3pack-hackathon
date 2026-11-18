# Thẻ nhớ — Codex / chốt review T33 và T31v2, CI đạt
- Trạng thái **đang làm**: chốt reviewT33/T31v2/PR; hello/ví thật cần người dùng. P3-A đạt, Phase3/goal chưa xong; không bỏ bước chốt vì funding.
- C trưởng nhóm, sở hữu tài liệu chính/A-queue; A qua queue. Repo /Users/bao/Documents/ChatGPT/dev3pack, branch work; không sửa checkout/file A.
- **“ReceiptRail chính, ClusterProof phụ” lúc00:07 ngày18/11/2026 UTC+7**; **“duyệt phase 2”** log09:27:18.464 UTC+7; nguồn đính chính tại DECISION.
- **“Đồng ý cả hai”** P3-A/P3-B, log10:13:11.851 ngày18/11 UTC+7. Hai câu duyệt không có giờ quyết định tự nêu; không hỏi lại hoặc suy quyền.
- P3-A chỉ ba jobs/pins/locks trên GitHub Ubuntu24.04; không cài thêm local/token/quyền/billing/limit/upload binary.
- **27cf7ac CI đạt:** PR44237534047/push44237529539 đều completed/success3jobs;57tests/run (25runtime+8client+16research+8web), typecheck/build, sinh IDL/ReceiptRail cmp.
- Anchor source8d9d148/lock/version và SBFv1.57/SHA256 đạt; runs cũ terminal, không poll/rerun như live. HEAD tài liệu không là revision có CI.
- Linux bytecode hashes khớp nhau, khác macOS; chưa reproducible/verified build. Giữ binary macOS dự kiến hello; executable inputs không đổi.
- P3-B chỉ hello devnet/signers thử cũ/một buffer tạm/trần1.5SOL. **“chưa rảnh để chuyển sol devnet”** log10:14:46.599 UTC+7: funding để sau; chưa tạo buffer/ký/gửi/deploy.
- **T33/6ef9815 nhận một phần**: hai bảng/9mã/4khoảng165giây; state/vai/CTA còn sai, form/phí/Terms/no-auto-retry từng có bị mất.4mục chưa là8bố cục;9nhóm findings còn mở.
- **T31v2/4e4a004 nhận Request/Unknown không tự ký/retry**; provenance/state/phản hồi/bảng expiry chưa đạt. Snapshot riêng, không sửa report A hoặc dùng lỗi Request mất của bản cũ.
- **T32/c801580 nhận một phần**: merchant không ký pay/3tên hàm/baseline đúng, thiếu assertions/log/giới hạn. A làm T32→T33→T31 sửa bổ sung cùng ID; không suy process live.
- **Review T31/T32 đã push3e8f536/a86e9b6/e6953c3.** PR read-back13:55:21 UTC+7 head e6953c3/work→main/open/merged=false/body khớp; snapshot riêng, comments/reviews rỗng.
- Automation15phút ACTIVE/đúng chat, đã kiểm action/config trong lượt này; checkpoint tài liệu và merge dùng [skip ci].
- Giữ ClusterProof source/web/lab/toolchain, thiết kế dự phòng/chưa duyệt. Cấm Phase4–6/deploy ReceiptRail/public mới/mergePR7/force-push/mainnet/secrets/đổi visibility.
- Bước ngay: T33 đã push7d0f06e/be8ee8d; chốt bổ sungT31v2 rồi cập nhật/read-back PR và lưu snapshot. Rồi hello sau funding/review A khi có bản mới; không rerun suites cho tài liệu.

## Bằng chứng hiện hành

[DECISION](ideas/DECISION.md), [quyền/funding](evidence/phase3/user-permission-2026-11-18.json), [CI27cf7ac](evidence/phase3/ci-passed-27cf7ac.json), [PR T31–T32](evidence/phase3/pr7-review-t31-t32-snapshot.json), [reviewT31v2](evidence/phase2/receiptrail-t31-v2-review.json), [reviewT32](evidence/phase2/receiptrail-t32-review.json), [reviewT33](evidence/phase2/receiptrail-t33-review.json), [findings C](reviews/receiptrail-codex.md#review-t33--18112026-heartbeat1428-utc7), [plan](PHASE3-PLAN.md), [cổng](reviews/phase1-3-gates.md), [audit](reviews/prompt03-audit.md). [PR T28/T29](evidence/phase3/pr7-review-t28-t29-snapshot.json) và [PR T30](evidence/phase3/pr7-review-t30-snapshot.json) giữ lịch sử, không sửa đè.

## Còn lại

1. **Chốt T33/T31v2:** kiểm links/hashes/diff, commit/push [skip ci], cập nhật/read-back PR7 work→main/open/merged=false/body và snapshot; không rerun suite/CI.
2. **Hello sau funding:** quyền P3-B đã có; người dùng để funding sau. Recheck genesis/balance/rent/fees/flags/hash/signers cũ/trần1.5SOL trước tạo buffer/ký/gửi; deploy hello, kiểm executable/owner/programdata/authority/bytecode, initialize/increment/finalized. Preflight09:47:33 UTC+7 payer0lamports/hello chưa deploy là lịch sử, chưa đọc lại.
3. **A:** fetch/pull an toàn, đọc A-done và review T33/T31–T32 bổ sung khi có; chỉ nhận phần có bằng chứng, không sửa file A thay A hoặc đợi A để làm phần độc lập.
4. **Cổng:** giáo viên/review chéo được nhận và connect/disconnect ví thật còn mở; người dùng chưa có ví devnet sẵn sàng. Không tự gọi Phase3/goal xong hoặc mở Phase4–6.

## Bị chặn và điều kiện tiếp tục

Funding hello/ví thật cần người dùng khi họ sẵn sàng; không thúc chuyển ngay, hỏi lại quyền hoặc tự faucet/deploy. CI đã đạt, không có run live cần theo dõi. Review A/giáo viên là cổng riêng; tiếp tục khi có report/verdict mới. Hồ sơ T31/T32 đã push và PR đã read-back13:55:21 UTC+7/body khớp, snapshot giữ head e6953c3; checkpoint lưu snapshot về sau chỉ là tài liệu. Automation giữ ACTIVE. ReviewT33 còn bước chốt ở mục1; chưa được ghi chỉ còn cần funding. Phase3/goal chưa xong; không mở Phase4–6.
