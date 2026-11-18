# Thẻ nhớ — Codex / ReceiptRail sau duyệt Phase 2
- Trạng thái **đang làm** checkpoint bàn giao; goal **active**, chưa hoàn thành toàn goal.
- C trưởng nhóm; A trợ lý qua queue. C sở hữu tài liệu chính/programs, không sửa report/A-done/HANDOFF A.
- Quyết định: **“ReceiptRail chính, ClusterProof phụ” lúc 00:07 ngày 18/11/2026 UTC+7**; log xác nhận 00:08:31.389.
- Duyệt: **“duyệt phase 2”**, log nhận 09:27:18.464 ngày 18/11/2026 UTC+7; người dùng không tự nêu giờ quyết định. Không hỏi lại.
- Repo /Users/bao/Documents/ChatGPT/dev3pack, work; checkpoint đã push f8b6988, batch pipeline/review/plan đang chốt. Không sửa checkout A.
- IDEA/ARCHITECTURE ReceiptRail được người dùng duyệt; review chéo/giáo viên vẫn mở. ClusterProof dự phòng, chưa duyệt.
- Spike ReceiptRail 19/19 local, C01 r2=79/F4 PLAN; audit Prompt03 có 3 bài 79/79/77, A=42/40/37, chưa verdict giáo viên.
- Runner Phase3 offline mới build hello+ReceiptRail:25 runtime +8 client tests đạt; IDL/bytecode khớp artifacts cũ, Cargo.lock không đổi.
- CI YAML/10 shell blocks đã kiểm; ba guards vẫn false. Mọi commit VÀ merge dùng [skip ci]; local/skipped/blocked không là CI xanh.
- K9: merge7e654a0 thiếu marker gây hai runs; cả6jobs bị billing chặn trước steps. Không có bước cài chạy; không nói cancel thành công.
- T26/62286cc và T27/50718d0 đã review: nhận expiry>=, Signer/has_one; sáu findings quaT29. Queue T28→T29; không suy process live từ HANDOFF A.
- Preflight 09:47:33 UTC+7: đúng devnet, hello chưa deploy, payer0lamports; không đọc signer/gửi transaction.
- PHASE3-PLAN có P3-A (CI runner/pins) và P3-B (hello devnet/signers cũ/buffer tạm/trần1.5SOL); CHƯA có quyền hai mục.
- Automation action/config vừa kiểm ACTIVE15phút đúng chat01a1e9c8-1b24-7911-91a4-4897fc175566; không suy mọi lần gửi thành công.
- Bước tiếp: chốt commit/push [skip ci], cập nhật/xác minh PR7 rồi xin P3-A/P3-B; không cài/sign/deploy/public trước câu đồng ý đúng phạm vi.
- Giữ toolchain/source/web/lab cũ; không merge/force-push/mainnet/secrets hoặc sửa audit lịch sử.

## Bằng chứng hiện hành

[DECISION](ideas/DECISION.md), [record duyệt](evidence/phase2/user-approval-2026-11-18.json), [IDEA](IDEA.md), [ARCHITECTURE](ARCHITECTURE.md), [spike Phase2](evidence/phase2/README.md). [Pipeline/logs/hash](evidence/phase3/offline-pipeline-metadata.json), [note022](learning/022-phase2-3-independent-prep.md), [review T26/T27](reviews/receiptrail-codex.md#review-t26-và-t27--18112026-sau-duyệt-phase2), [audit Prompt03](reviews/prompt03-audit.md). Local pass không thay browser/RPC/devnet/CI hoặc independent review.

## Còn lại

1. Chốt checkpoint pipeline/review/audit/plan, push bằng [skip ci]; cập nhật PR7 và xác minh head/body/open/merged=false. Không merge.
2. Trình hai quyền cụ thể trong [PHASE3-PLAN](PHASE3-PLAN.md) sau checkpoint; ghi nguyên văn/giờ log/phạm vi trước thao tác phụ thuộc. Không hỏi duyệt Phase2 lại.
3. Khi A nộp T28/T29: fetch và review tài liệu, dùng phần đúng; không sửa file A, không chờ A để hoàn thành việc riêng.
4. Khi có quyền vận hành, làm đúng [NEXT](NEXT.md): CI cần billing/limit; hello cần devnet funding. Recheck trước thi hành, không dùng snapshot cũ để gửi giao dịch.
5. Giáo viên chấm SHORTLIST/kiến trúc và review chéo được nhận còn mở; không tự ghi toàn goal hoặc Phase3 xong.

## Bị chặn (cần người dùng) — phần vận hành

P3-A/P3-B chưa có câu đồng ý; đây là giới hạn trực tiếp **“cài thêm, deploy hay public thứ gì mới thì phải hỏi tôi trước”**, không phải thiếu lời duyệt Phase2. CI còn Billing & plans, payer0SOL, ví browser devnet chưa sẵn sàng. Phần đọc/review tài liệu vẫn được làm. Không mở guard, tạo buffer/sign/deploy hoặc public trong khi chờ; giữ automation ACTIVE và goal active.
