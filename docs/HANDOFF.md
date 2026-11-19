# Thẻ nhớ — Codex / Phase4 + Phase5 local đang làm
- Trạng thái **đang làm**; người dùng đã mở Phase4 ReceiptRail và Phase5 song song ngày19/11, giờ log13:25:47 UTC+7; nguyên văn tại DECISION/evidence phase4.
- C trưởng nhóm tại `/Users/bao/Documents/ChatGPT/dev3pack`, branch`work`; A trợ lý Phase5 qua T34 trong A-queue. Không sửa checkout/file bàn giao A.
- P4-A/P4-B đã đồng ý “Đồng ý cả P4-A và P4-B”, log13:55:34.348UTC+7: CI đúng pins; sau CI4keypairs ngoài Git, ReceiptRail deploy+smoke/cap1.8SOL. Chưa public/cài local/mergePR7/Phase6.
- Automation15phút **ACTIVE**, action+config read-back đúng chat; evidence phase4/automation-active-2026-11-19.json. Không tạo trùng.
- ReceiptRail chính, ClusterProof phụ/chưa duyệt; Phase2/P3-A/P3-B đã có quyền và evidence riêng. Không phục hồi payload sai cũ.
- T31/T32/T33 đã đóng tại7857e9b; D01–D03 là nợ tài liệu. T34 là triển khai UI mới, không vòng sửa report.
- C sở hữu programs/tests/build/IDL/client và hồ sơ chính; A sở hữu apps/web/receiptrail, route/UI/tests, note025/evidence Phase5.
- Quyền/T34 push05f8e79, note024 push9124f04, runtime32/32 push2a3fd30. Client r1 đạt23/23 + generated/TypeScript/browser-target bundle; source/ABI không đổi.
- Client/contract đã push4148906; helpers push39ad3ee đã xác minh trên origin/work. T34 chưa có bài nộp mới. CI đầu8df85c0 đạt cả push/PR; đã tạo đúng4keys ngoài Git. Identity8NGSP…pYko có record; chưa broadcast.
- Giữ source/web/lab ClusterProof đã có; checkpoint tài liệu dùng `[skip ci]`; CI được mở đúng P4-A, không gán CI cũ cho revision mới.
- P3-B đã xong137tx finalized/counter1, debit0.651874801SOL; không gửi lại upload/deploy/smoke, buffer mới/close hoặc tăng trần.
- Ví extension thật chưa kiểm theo lựa chọn người dùng; mock wallet không thay xác nhận thật. Chưa verdict giáo viên, không tự chấm thay.
- Chỉ dừng khi có quyết định/quyền cần người dùng; chuẩn bị phương án cụ thể trước hỏi. Không tự mở Phase6 hoặc coi mở Phase4/5 là đã hoàn tất.

## Còn lại

1. Identity triển khai đã đổi sang8NGSPufBmGB1oHqaZpY1jhJYz1X4gqFiNXCQmxfapYko; runtime32/client23/guards7 local đạt. Push source/IDL/client/fixture/helpers rồi kiểm CI đúng revision trước broadcast.
2. Sau CI triển khai đạt, ghi ci-deployment.json với inputHashes/localBinarySha256 từ metadata; chạy deploy.mjs --inspect rồi --upload-approved. Không tạo keys mới hoặc dùng identity cũ. Helpers upload/CLI/verify đã chuẩn bị, chưa mạng.
3. Upload đạt thì deploy.mjs --deploy-approved; verify.mjs --deployment kiểm toàn tx/binary/authority, rồi smoke inspect/send, verify --all. Cap1.8SOL; journal/report tồn tại thì đối soát, không auto-resend/upgrade.
4. T34 tiếp tục local; nhận bài nộp và review tiền/quyền khi có. Chưa A xác nhận; không mở lại T31–T33.
5. Cập nhật notes/DEVLOG/Thẻ nhớ/PR7 và push mỗi mốc. Public/Phase6/merge cần quyền riêng, không hỏi P4-A/B lại.

## Giới hạn cần người dùng khi tới cổng

- P4-A/P4-B đã có quyền theo plan; chỉ public/update web, cài thêm local, signer ngoài4đã duyệt, vượt1.8SOL, upgrade mới, merge/Phase6 còn cần người dùng.
- Ví thật chưa sẵn sàng ở lần trước; kiểm connect/disconnect extension khi người dùng sẵn sàng, không dùng mock/CLI thay bằng chứng.
- Verdict giáo viên SHORTLIST/kiến trúc chưa có; không cản phần local đã được người dùng mở, không ghi verdict thay.

[P3-B](evidence/phase3/README.md), [quyết định](ideas/DECISION.md), [NEXT](NEXT.md), [bàn giao trước](archive/HANDOFF-before-phase4-5-2026-11-19.md). Checkout đồng bộ thêm0a08395 chỉ đổi HANDOFF A, không có code mới trước mốc này.
