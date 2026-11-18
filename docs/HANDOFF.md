# Thẻ nhớ — Codex / ReceiptRail sau duyệt Phase 2
- Trạng thái **đang làm**; goal **active**, không còn blocker thiếu duyệt người dùng. Chưa hoàn thành toàn goal.
- Vai: C trưởng nhóm, A trợ lý qua queue; C sở hữu tài liệu chính/programs, không sửa report/A-done/HANDOFF A.
- Quyết định: **“ReceiptRail chính, ClusterProof phụ” lúc00:07 ngày18/11/2026 UTC+7**; log xác nhận00:08:31.389.
- Duyệt mới: **“duyệt phase 2”**, log nhận09:27:18.464 ngày18/11/2026 UTC+7; người dùng không tự nêu giờ quyết định. Xem DECISION; không hỏi lại.
- Repo /Users/bao/Documents/ChatGPT/dev3pack, branch work; merge7e654a0 cóT27/50718d0, không sửa checkout A.
- IDEA/ARCHITECTURE ReceiptRail đã được người dùng duyệt; review chéo/giáo viên vẫn còn mở, không tự ghi đạt.
- Spike8f84cfe: Anchor1.2.2/SBFv3/LiteSVM,19/19 runtime tests; IDLr3 đã đối chiếu, C01r2=79/F4 PLAN.
- CI đã thêm guard false cho3jobs: merge7e654a0 thiếu [skip ci] gây2runs, cả6jobs bị billing chặn trước steps; evidence/K9 đã ghi. Không có bước cài chạy; mọi commit/merge dùng [skip ci].
- T26/62286cc vàT27/50718d0 đã nộp; C đang review. HANDOFF A báoT28, không coi file trạng thái là process live.
- Lời duyệtfcc9f61 đã push tại merge7e654a0. Bước tiếp: push guard CI/PR; reviewT26/T27; chuẩn bị Phase3 và audit goal theo NEXT.
- Automation action view/config vừa xác minh **ACTIVE mỗi15phút**, đúng chat01a1e9c8-1b24-7911-91a4-4897fc175566; không suy mọi lượt đã gửi.
- ClusterProof giữ **dự phòng, chưa duyệt**; toolchain/source/web/lab giữ nguyên.
- Cài thêm/tạo ví-keypair triển khai/deploy/public mới phải hỏi trước bằng đề xuất cụ thể; duyệt Phase2 không cấp các quyền đó.
- Không merge/force-push/mainnet/secrets. Không sửa lịch sử/audit cũ; snapshot trước duyệt đã archive.

## Bằng chứng hiện hành

[DECISION](ideas/DECISION.md), [record duyệt](evidence/phase2/user-approval-2026-11-18.json), [IDEA](IDEA.md), [ARCHITECTURE](ARCHITECTURE.md), [note023](learning/023-receiptrail-phase2-spike.md), [metadata](evidence/phase2/receiptrail-build-metadata.json), [tests r2](evidence/phase2/receiptrail-spike-r2.txt), [IDL](idl/receiptrail.json). Các kết quả local không thay browser/RPC/devnet/CI hoặc review độc lập. [Snapshot trước lời duyệt](archive/HANDOFF-before-phase2-user-approval.md) chỉ là lịch sử.

## Còn lại

1. Push guard CI/K9 bằng [skip ci], đồng bộ PR7 và xác minh head/body.
2. Review T26/T27 theo source/log đã dẫn; giữT28 và giao sửa phần còn thiếu. T26 sửa expiry nhưng Paid/nguồn/mapping còn sai; T27 vẫn baseline retry Open và chưa đủ assertions.
3. Chuẩn bị Phase3 trong quyền hiện có: đọc workflow/scripts/cache, xác định thay đổi CI cần thiết và kế hoạch hello devnet/web/wallet cụ thể. Không thực thi installer/sign/deploy/public.
4. Audit RUBRIC v1.2/3 bài ĐẠT/chấm ứng viên A/SHORTLIST và các cổng ROADMAP. Chuẩn bị hồ sơ cho giáo viên; không coi approval người dùng là verdict giáo viên.
5. Theo [NEXT](NEXT.md), sau khi đề xuất vận hành đủ cụ thể mới xin đúng quyền còn thiếu; không hỏi chọn ý tưởng hoặc duyệt Phase2 lại.

## Cổng cần người dùng và bằng chứng còn thiếu

Review chéo và verdict giáo viên chưa nhận đạt; cài thêm/keypair triển khai/deploy/public chưa có câu đồng ý mới. Chưa ReceiptRail client/browser/RPC recovery/devnet/CI. Những cổng này không chặn đọc/review/chuẩn bị độc lập. PR7 vẫn open, không merge; head/body cần đồng bộ sau checkpoint. CI guard chưa mở, [K9](evidence/phase3/ci-merge-7e654a0-blocked.json) giữ bằng chứng không bước cài nào chạy.
