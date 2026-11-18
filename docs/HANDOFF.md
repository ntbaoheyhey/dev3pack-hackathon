# Thẻ nhớ — Codex / Phase3 đã có quyền, còn billing và funding
- Trạng thái **bị chặn (cần người dùng)** ở billing CI/funding hello; tool đã trả goal **blocked** lúc10:31:15 ngày18/11 UTC+7 sau audit ba lượt. Chưa hoàn thành.
- C trưởng nhóm, sở hữu tài liệu chính/A-queue; A trợ lý qua queue. RUBRIC v1.2: điểm theo bằng chứng, chưa spike F≤3. Không sửa file/checkout A.
- “ReceiptRail chính, ClusterProof phụ” lúc00:07 ngày18/11/2026 UTC+7; duyệt Phase2 log09:27:18.464 UTC+7. Không hỏi lại.
- **“Đồng ý cả hai”** cho P3-A/P3-B, giờ log10:13:11.851 ngày18/11/2026 UTC+7; record lưu toàn văn câu hỏi, không có giờ quyết định tự nêu.
- P3-A: runner GitHub Ubuntu24.04/pins/locks đã trình; không cài thêm máy người dùng hoặc đổi billing/limit.
- P3-B: chỉ hello devnet/signers thử cũ/một buffer tạm/trần1.5SOL; chưa ReceiptRail/public web mới.
- **“chưa rảnh để chuyển sol devnet”**, log10:14:46.599 UTC+7: deploy sau funding; không thúc chuyển ngay, chưa tạo buffer/sign/send.
- Repo /Users/bao/Documents/ChatGPT/dev3pack, work; quyền fd78236, CI51bf866, bàn giao a2784dd/3b92ce2 đã push; checkpoint này chỉ đồng bộ trạng thái blocked.
- Hai runs44229364614/44229359109 completed/failure: cả6jobs bị Billing & plans chặn trước steps. Không có build/install/test chạy, không CI xanh.
- Note022/evidence ci-approved-51bf866-blocked giữ annotations/steps/HEAD. Không rerun cho tới billing/limit được xử lý, không tự đổi chi trả.
- Pipeline cache25runtime+8client pass cũ; source/tests/IDL/web/lab giữ nguyên. Workflow hash cũ trong metadata offline là snapshot trước mởguard.
- T26/T27 đã review; T28→T29 còn mở. Fetch cuối chưa có report mới; không suy process live từ HANDOFF A.
- PR7 đã sửa quyền/CI/funding; lần đọc lại trước checkpoint này xác nhận head3b92ce2/work→main/open/merged=false, body khớp, không có comments mới. Không merge.
- Bước tiếp: khi billing/funding có thay đổi thì kiểm lại rồi làm đúng P3-A/P3-B; fetch/review T28/T29 nếu có report mới, không hỏi lại quyền.
- Automation15phút ACTIVE; checkpoint tài liệu/merge dùng [skip ci], chỉ run cần thiết trong P3-A mới bỏ marker.
- Review chéo/giáo viên vẫn mở; ClusterProof dự phòng, chưa duyệt. Không mở Phase4–6/merge/force-push/mainnet/secrets/visibility.

## Bằng chứng hiện hành

[DECISION](ideas/DECISION.md), [record quyền/funding](evidence/phase3/user-permission-2026-11-18.json), [CI sau quyền](evidence/phase3/ci-approved-51bf866-blocked.json), [phương án](PHASE3-PLAN.md), [pipeline local](evidence/phase3/offline-pipeline-metadata.json), [audit](reviews/prompt03-audit.md). [Bàn giao trước quyền](archive/HANDOFF-before-p3-permission.md) là lịch sử, không tái hỏi P3-A/P3-B.

## Còn lại

1. **CI:** khi người dùng xử lý Billing & plans, kiểm lại điều kiện và chạy CI đúng revision hiện hành; theo dõi cả3jobs/steps thực. Không rerun lặp khi blocker không đổi. Quyền đã có, không xin lại; không đổi billing/limit hoặc visibility.
2. **Hello:** funding được người dùng để sau. Khi có đủ SOL devnet, recheck balance/rent/flags/hash/signers/trần1.5SOL rồi triển khai và kiểm initialize/increment/finalized; chưa tạo buffer/sign/send lúc này.
3. **A:** fetch và review T28/T29 khi nộp, nhận phần có bằng chứng; không sửa file A hoặc coi report nộp là đã qua cổng.
4. **Cổng:** review chéo được nhận, giáo viên chấm và ví thật vẫn mở. Không tự gọi Phase3/goal xong; NEXT/ROADMAP/PR7 theo evidence thật.

## Bị chặn (cần người dùng)

Thiếu quyền P3-A/P3-B đã giải quyết; không hỏi lại. Audit mới sau quyền gồm ba lượt liên tiếp còn cùng điều kiện billing/funding: (1) mở CI51bf866, quan sát failure trước steps và funding được người dùng để sau; (2) push a2784dd/3b92ce2, sửa PR nhưng hai điều kiện chưa đổi; (3) fetch lại work/origin-work3b92ce2 sạch, chưa T28/T29 hoặc verdict mới, đọc đúng hai run IDs và sáu job steps vẫn completed/failure/steps rỗng.

Lượt trước là **progress** vì đã chốt repo/PR. Lượt kiểm lại hiện tại không có hành động độc lập còn thiếu và không có process live để poll; không là verified wait. `update_goal` trả **blocked** lúc10:31:15 ngày18/11/2026 UTC+7. Đây là trạng thái cần người dùng hoặc thay đổi bên ngoài, không phải paused hay hoàn thành, không tái dùng audit thiếu quyền cũ. Automation15phút vẫn ACTIVE; khi có report A mới hoặc billing/funding thay đổi thì kiểm phần tương ứng theo NEXT và quyền đã lưu. Không tạo commit/rerun lặp chỉ để giả tiến triển.
