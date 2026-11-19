# Thẻ nhớ — Codex / Phase4 + Phase5 local đang làm
- Trạng thái **đang làm**; người dùng đã mở Phase4 ReceiptRail và Phase5 song song ngày19/11, giờ log13:25:47 UTC+7; nguyên văn tại DECISION/evidence phase4.
- C trưởng nhóm tại `/Users/bao/Documents/ChatGPT/dev3pack`, branch`work`; A trợ lý Phase5 qua T34 trong A-queue. Không sửa checkout/file bàn giao A.
- P4-A/P4-B đã đồng ý “Đồng ý cả P4-A và P4-B”, log13:55:34.348UTC+7: CI đúng pins; sau CI4keypairs ngoài Git, ReceiptRail deploy+smoke/cap1.8SOL. Chưa public/cài local/mergePR7/Phase6.
- Automation15phút **ACTIVE**, action+config read-back đúng chat; evidence phase4/automation-active-2026-11-19.json. Không tạo trùng.
- ReceiptRail chính, ClusterProof phụ/chưa duyệt; Phase2/P3-A/P3-B đã có quyền và evidence riêng. Không phục hồi payload sai cũ.
- T31/T32/T33 đã đóng tại7857e9b; D01–D03 là nợ tài liệu. T34 là triển khai UI mới, không vòng sửa report.
- C sở hữu programs/tests/build/IDL/client và hồ sơ chính; A sở hữu apps/web/receiptrail, route/UI/tests, note025/evidence Phase5.
- Quyền/T34 push05f8e79, note024 push9124f04, runtime32/32 push2a3fd30. Client r1 đạt23/23 + generated/TypeScript/browser-target bundle; source/ABI không đổi.
- Client/contract đã push4148906; T34 chưa có bài nộp/xác nhận mới. Review local xong, PHASE4-PLAN đã được đồng ý; bước kế áp patch/run CI, chưa tạo signers.
- Giữ source/web/lab ClusterProof đã có; mọi commit/merge lượt local dùng `[skip ci]`, không gán CI27cf7ac cho code mới.
- P3-B đã xong137tx finalized/counter1, debit0.651874801SOL; không gửi lại upload/deploy/smoke, buffer mới/close hoặc tăng trần.
- Ví extension thật chưa kiểm theo lựa chọn người dùng; mock wallet không thay xác nhận thật. Chưa verdict giáo viên, không tự chấm thay.
- Chỉ dừng khi có quyết định/quyền cần người dùng; chuẩn bị phương án cụ thể trước hỏi. Không tự mở Phase6 hoặc coi mở Phase4/5 là đã hoàn tất.

## Còn lại

1. Quyền mới đã push28c1e3f; patch CI4dòng đã áp/review YAML+run blocks, đang commit không skip/push chạy CI. Theo dõi SHA/jobs/logs thật, không dừng giữa run; chưa tạo4keypairs.
2. Sau CI đầu đạt: tạo đúng4keypairs ngoài Git theo PHASE4-PLAN, đổi identity/build/test/IDL/client; chạy CI revision mới trước broadcast.
3. Preflight/budget <=1.8SOL, deploy/smoke/journal/finalized/đối soát theo plan. Không auto-resend/đổi buffer/authority hoặc tạo thêm signer.
4. T34 tiếp tục local; nhận bài nộp và review tiền/quyền khi có. Chưa A xác nhận; không mở lại T31–T33.
5. Cập nhật notes/DEVLOG/Thẻ nhớ/PR7 và push mỗi mốc. Public/Phase6/merge cần quyền riêng, không hỏi P4-A/B lại.

## Giới hạn cần người dùng khi tới cổng

- P4-A/P4-B đã có quyền theo plan; chỉ public/update web, cài thêm local, signer ngoài4đã duyệt, vượt1.8SOL, upgrade mới, merge/Phase6 còn cần người dùng.
- Ví thật chưa sẵn sàng ở lần trước; kiểm connect/disconnect extension khi người dùng sẵn sàng, không dùng mock/CLI thay bằng chứng.
- Verdict giáo viên SHORTLIST/kiến trúc chưa có; không cản phần local đã được người dùng mở, không ghi verdict thay.

[P3-B](evidence/phase3/README.md), [quyết định](ideas/DECISION.md), [NEXT](NEXT.md), [bàn giao trước](archive/HANDOFF-before-phase4-5-2026-11-19.md). Checkout đồng bộ thêm0a08395 chỉ đổi HANDOFF A, không có code mới trước mốc này.
