# Thẻ nhớ — Codex / chốt reviewT32 và T33 bổ sung, P3-A đạt
- Trạng thái **đang làm**: chốt reviewT32/3083ce4 và T33/509adac/PR. P3-A đạt,Phase3/goal chưa xong; funding/ví thật và9findings/review chéo/giáo viên còn mở.
- C trưởng nhóm, sở hữu tài liệu chính/A-queue; A qua queue. Repo /Users/bao/Documents/ChatGPT/dev3pack, branch work; không sửa checkout/file A.
- **“ReceiptRail chính, ClusterProof phụ” lúc00:07 ngày18/11/2026 UTC+7**; **“duyệt phase 2”** log09:27:18.464 UTC+7; nguồn đính chính tại DECISION.
- **“Đồng ý cả hai”** P3-A/P3-B, log10:13:11.851 ngày18/11 UTC+7. Hai câu duyệt không có giờ quyết định tự nêu; không hỏi lại hoặc suy quyền.
- P3-A chỉ ba jobs/pins/locks trên GitHub Ubuntu24.04; không cài thêm local/token/quyền/billing/limit/upload binary.
- **27cf7ac CI đạt:** PR44237534047/push44237529539 đều completed/success3jobs;57tests/run (25runtime+8client+16research+8web), typecheck/build, sinh IDL/ReceiptRail cmp.
- Anchor source8d9d148/lock/version và SBFv1.57/SHA256 đạt; runs cũ terminal, không poll/rerun như live. HEAD tài liệu không là revision có CI.
- Linux bytecode hashes khớp nhau, khác macOS; chưa reproducible/verified build. Giữ binary macOS dự kiến hello; executable inputs không đổi.
- P3-B chỉ hello devnet/signers thử cũ/một buffer tạm/trần1.5SOL. **“chưa rảnh để chuyển sol devnet”** log10:14:46.599 UTC+7: funding để sau; chưa tạo buffer/ký/gửi/deploy.
- **T33/509adac nhận phí create/pay,Terms,no-auto-retry,reload recipient**; state/vai/Open/form/bố cục/demo/SDK vẫn thiếu,6002 lùi về reconnect.9mã/165giây trên giấy đúng.
- **T31/d40492b giữ Request/Unknown và nhãn Web API/EVM**; nguồn/state/PDA context/phản hồi/bảng expiry chưa đạt;3dòng nhóm không thay từng finding.
- **T32/3083ce4 nhận has_one payer+merchant/sig khác**, giữ3tên hàm/baseline/VM serial;2/3log sai,recipient/assertions/phí/phản hồi thiếu. A làm T31→T32→T33 mới/cùng ID; không suy process live.
- **Review15:17 đã pushce01c8d.** PR read-back15:23:46 UTC+7 head ce01c8d/work→main/open/merged=false/body khớp; snapshot riêng, comments/reviews rỗng.
- Automation15phút ACTIVE/đúng chat, kiểm action/config14:42 UTC+7; checkpoint tài liệu và merge dùng [skip ci].
- Giữ ClusterProof source/web/lab/toolchain, thiết kế dự phòng/chưa duyệt. Cấm Phase4–6/deploy ReceiptRail/public mới/mergePR7/force-push/mainnet/secrets/đổi visibility.
- Bước ngay: reviewT32 đã push2432524/5dba9d9; kiểm/commit/push T33 mới, cập nhật/read-back PR và lưu snapshot; rồi hello sau funding/review A khi có bản mới. Không rerun suites/CI cho tài liệu.

## Bằng chứng hiện hành

[DECISION](ideas/DECISION.md), [quyền/funding](evidence/phase3/user-permission-2026-11-18.json), [CI27cf7ac](evidence/phase3/ci-passed-27cf7ac.json), [PR review15:17](evidence/phase3/pr7-review-supplement-1517-snapshot.json), [T32 mới](evidence/phase2/receiptrail-t32-3083ce4-review.json), [T33 mới](evidence/phase2/receiptrail-t33-509adac-review.json), [ba report15:17](evidence/phase2/receiptrail-supplement-1517-review.json), [findings C](reviews/receiptrail-codex.md#bổ-sung-t33509adac-trước-chốt-pr--18112026), [plan](PHASE3-PLAN.md), [cổng](reviews/phase1-3-gates.md), [audit](reviews/prompt03-audit.md). [PR T28/T29](evidence/phase3/pr7-review-t28-t29-snapshot.json), [PR T30](evidence/phase3/pr7-review-t30-snapshot.json) và [PR T31–T32](evidence/phase3/pr7-review-t31-t32-snapshot.json), [PR T33/T31v2](evidence/phase3/pr7-review-t33-t31-v2-snapshot.json) giữ lịch sử, không sửa đè.

## Còn lại

1. **Chốt review15:47:** kiểm links/hashes/diff, commit/push [skip ci], cập nhật/read-back PR7 và snapshot riêng; không rerun suites/CI.
2. **Hello sau funding:** quyền P3-B đã có; người dùng để funding sau. Recheck genesis/balance/rent/fees/flags/hash/signers cũ/trần1.5SOL trước tạo buffer/ký/gửi; deploy hello, kiểm executable/owner/programdata/authority/bytecode, initialize/increment/finalized. Preflight09:47:33 UTC+7 payer0lamports/hello chưa deploy là lịch sử, chưa đọc lại.
3. **A:** fetch/pull an toàn, đọc A-done và review T31→T32→T33 bổ sung khi có; chỉ nhận phần có bằng chứng, không sửa file A thay A hoặc đợi A để làm phần độc lập.
4. **Cổng:** giáo viên/review chéo được nhận và connect/disconnect ví thật còn mở; người dùng chưa có ví devnet sẵn sàng. Không tự gọi Phase3/goal xong hoặc mở Phase4–6.

## Bị chặn và điều kiện tiếp tục

Funding hello/ví thật cần người dùng khi họ sẵn sàng; không thúc chuyển ngay, hỏi lại quyền hoặc tự faucet/deploy. CI đã đạt, không có run live cần theo dõi. Review A/giáo viên là cổng riêng; tiếp tục khi có report/verdict mới. Review15:17 đã pushce01c8d và PR read-back15:23:46 UTC+7/body khớp, snapshot giữ head ce01c8d; checkpoint lưu snapshot về sau chỉ là tài liệu. Automation ACTIVE. Review15:47 còn bước chốt ở mục1, không bỏ vì funding. Phase3/goal chưa xong; không mở Phase4–6.
