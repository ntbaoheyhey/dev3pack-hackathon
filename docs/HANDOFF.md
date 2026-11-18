# Thẻ nhớ — Codex / Phase3 trong quyền đã duyệt
- Trạng thái **đang làm**; goal active theo người dùng, chưa hoàn thành toàn goal.
- C trưởng nhóm; A trợ lý qua queue. Không sửa report/A-done/HANDOFF A hoặc checkout của A.
- “ReceiptRail chính, ClusterProof phụ” lúc00:07 ngày18/11/2026 UTC+7; duyệt Phase2 log09:27:18.464 UTC+7. Không hỏi lại.
- Quyền mới **“Đồng ý cả hai”** cho P3-A/P3-B, giờ log10:13:11.851 ngày18/11/2026 UTC+7; không có giờ quyết định tự nêu. DECISION/record giữ nguyên câu hỏi.
- P3-A: chỉ runner GitHub Ubuntu24.04, pins/locks đã trình, được mở3jobs; không cài thêm máy người dùng hoặc đổi billing/limit.
- P3-B: chỉ hello devnet, signers thử cũ/một buffer tạm/trần1.5SOL; chưa ReceiptRail/public web mới.
- Người dùng nói **“chưa rảnh để chuyển sol devnet”**, log10:14:46.599 UTC+7: làm CI trước, deploy sau funding; không thúc chuyển ngay.
- Repo /Users/bao/Documents/ChatGPT/dev3pack, work; pipeline fed3cb3, bàn giao75f3aa7; quyền mới đang checkpoint.
- Pipeline cache25 runtime+8client tests đạt; IDL/bytecode khớp, source/tests/web/lab cũ giữ nguyên. Không lấy local làm CI xanh.
- Bước tiếp: push quyền bằng [skip ci], kiểm/mở đúng3guards rồi push commit CI không skip; theo dõi run/jobs/annotations thật.
- K9 cũ: hai runs bị billing chặn trước steps. Quyền P3-A không chứng minh billing đã được xử lý.
- T26/T27 đã review; T28→T29 còn mở. Fetch cuối chưa có report mới; không coi HANDOFF A là process live.
- Review chéo/giáo viên vẫn mở; ClusterProof dự phòng, chưa duyệt. Phase4–6 chưa mở.
- Automation15phút ACTIVE; checkpoint tài liệu/merge dùng [skip ci], chỉ run cần thiết trong P3-A mới bỏ marker.
- Không merge/force-push/mainnet/secrets/đổi visibility hoặc mở rộng quyền ngoài P3-A/P3-B.

## Bằng chứng và bước còn lại

[DECISION](ideas/DECISION.md), [record quyền mới](evidence/phase3/user-permission-2026-11-18.json), [phương án](PHASE3-PLAN.md), [pipeline](evidence/phase3/offline-pipeline-metadata.json), [audit](reviews/prompt03-audit.md). Lịch sử trước quyền ở [archive](archive/HANDOFF-before-p3-permission.md).

1. Ghi/push quyền trước mở CI. Kiểm YAML/command wiring và giữ pins/locks; mở ba guards, push commit cần run. Theo dõi đúng SHA, lấy jobs/steps/annotations; failed/skipped không đạt.
2. Nếu CI vẫn bị billing chặn, lưu evidence và nhờ người dùng xử lý billing/limit khi họ sẵn sàng; không tự đổi chi trả hoặc rerun vô ích.
3. P3-B đã có quyền, **funding được người dùng để sau**. Chỉ deploy/test hello khi đủ SOL và đã recheck rent/balance/flags/hash/signers/trần1.5SOL. Chưa tạo buffer hoặc ký giao dịch trong lúc thiếu funding.
4. Khi A nộp T28/T29: fetch, review tài liệu và dùng phần đúng; không đợi A cho CI. Cổng giáo viên/review chéo vẫn riêng.
5. Đồng bộ kết quả vào NEXT/ROADMAP/DEVLOG/PR7, không merge; không tự gọi Phase3/goal hoàn thành trước đủ cổng.

## Cần người dùng / giới hạn còn lại

Thiếu quyền P3-A/P3-B **đã giải quyết**, không dùng blocker cũ. Funding hello được người dùng để sau; billing cần kiểm run mới, ví thật vẫn chưa kiểm. Quyền CI không cho phép deploy/public web hoặc cài thêm máy người dùng. Lời đồng ý không thay evidence CI/devnet hay verdict giáo viên.
