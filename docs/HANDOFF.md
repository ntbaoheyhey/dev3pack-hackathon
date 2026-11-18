# Thẻ nhớ — Codex / tiếp tục CI Phase3
- Trạng thái **đang làm** theo tin “Đã mở CI, chạy tiếp Phase 3.”, giờ log10:35:20.180 ngày18/11 UTC+7. Chưa hoàn thành Phase3.
- C trưởng nhóm, sở hữu tài liệu chính/A-queue; A trợ lý qua queue. RUBRIC v1.2: điểm theo bằng chứng, chưa spike F≤3. Không sửa file/checkout A.
- “ReceiptRail chính, ClusterProof phụ” lúc00:07 ngày18/11/2026 UTC+7; duyệt Phase2 log09:27:18.464 UTC+7. Không hỏi lại.
- **“Đồng ý cả hai”** cho P3-A/P3-B, giờ log10:13:11.851 ngày18/11/2026 UTC+7; record lưu toàn văn câu hỏi, không có giờ quyết định tự nêu.
- P3-A: runner GitHub Ubuntu24.04/pins/locks đã trình; không cài thêm máy người dùng hoặc đổi billing/limit.
- P3-B: chỉ hello devnet/signers thử cũ/một buffer tạm/trần1.5SOL; chưa ReceiptRail/public web mới.
- **“chưa rảnh để chuyển sol devnet”**, log10:14:46.599 UTC+7: deploy sau funding; không thúc chuyển ngay, chưa tạo buffer/sign/send.
- Repo /Users/bao/Documents/ChatGPT/dev3pack, work; đã fast-forward7210aa6 (chỉ HANDOFF A). Code/pins/locks không đổi; queue nhắc skip marker.
- Runs a114a98 cancelled;7210aa6 push44231906106 đạt3jobs/57tests+build, PR44231910864 lỗi lấy attestation Anchor403. Evidence ci-resumed-7210aa6 lưu riêng, không còn blocker billing cũ.
- Record ci-resume-user và note022 lưu tin mới; giữ pins/locks; thay riêng installer đúng upstream source để xử lý403, không tự đổi billing/limit.
- Pipeline cache25runtime+8client pass cũ; source/tests/IDL/web/lab giữ nguyên. Workflow hash cũ trong metadata offline là snapshot trước mởguard.
- T26/T27 đã review; T28→T29 còn mở. Fetch cuối chưa có report mới; không suy process live từ HANDOFF A.
- PR7 đã sửa quyền/CI/funding; lần đọc lại trước checkpoint này xác nhận head3b92ce2/work→main/open/merged=false, body khớp, không có comments mới. Không merge.
- Đã pushb906a37 sửa installer, cùng source8d9d148/lock/Rust1.100.0; YAML/10bash blocks đạt. Theo dõi PR44233192373/job134562955349 và push44233187077/job134562937429; research/web đã pass, Anchor đang cài.
- Automation15phút ACTIVE; checkpoint tài liệu/merge dùng [skip ci], chỉ run cần thiết trong P3-A mới bỏ marker.
- Review chéo/giáo viên vẫn mở; ClusterProof dự phòng, chưa duyệt. Không mở Phase4–6/merge/force-push/mainnet/secrets/visibility.

## Bằng chứng hiện hành

[DECISION](ideas/DECISION.md), [record quyền/funding](evidence/phase3/user-permission-2026-11-18.json), [CI Linux và lỗi403](evidence/phase3/ci-resumed-7210aa6.json), [phương án](PHASE3-PLAN.md), [pipeline local](evidence/phase3/offline-pipeline-metadata.json), [audit](reviews/prompt03-audit.md). [Bàn giao trước quyền](archive/HANDOFF-before-p3-permission.md) là lịch sử, không tái hỏi P3-A/P3-B.

## Còn lại

1. **CI:** theo dõi hai runb906a37 ở Thẻ nhớ tới terminal, đọc logs. Push7210aa6 xanh/PR lỗi403 đã lưu evidence; chưa chứng minh patch mới đạt. Sau kết quả đồng bộ README/ROADMAP/PHASE3-PLAN/NEXT/mục lục003/022/cổng/audit/PR7, push checkpoint tài liệu có skip và xác minh PR open/chưa merge. Không tự đổi pins/locks/billing/quyền hoặc gọi skipped là đạt.
2. **Hello:** funding được người dùng để sau. Khi có đủ SOL devnet, recheck balance/rent/flags/hash/signers/trần1.5SOL rồi triển khai và kiểm initialize/increment/finalized; chưa tạo buffer/sign/send lúc này.
3. **A:** fetch và review T28/T29 khi nộp, nhận phần có bằng chứng; không sửa file A hoặc coi report nộp là đã qua cổng.
4. **Cổng:** review chéo được nhận, giáo viên chấm và ví thật vẫn mở. Không tự gọi Phase3/goal xong; NEXT/ROADMAP/PR7 theo evidence thật.

## Điều kiện và lịch sử

Người dùng yêu cầu chạy tiếp CI lúc log10:35:20.180 UTC+7; đã thực hiện trong P3-A và có steps chạy thật; billing cũ không còn là blocker. Funding hello vẫn để sau; review A/giáo viên/ví thật vẫn riêng. [Bàn giao trước khi tiếp tục](archive/HANDOFF-before-ci-resume-2026-11-18.md) giữ audit blocked cũ; không dùng lại số lượt audit đó sau tin tiếp tục. Automation15phút giữ ACTIVE, không hỏi lại quyền P3-A/P3-B.
