# Thẻ nhớ — Codex / Phase4 + Phase5 local đang làm
- Trạng thái **đang làm**; người dùng đã mở Phase4 ReceiptRail và Phase5 song song ngày19/11, giờ log13:25:47 UTC+7; nguyên văn tại DECISION/evidence phase4.
- C trưởng nhóm tại `/Users/bao/Documents/ChatGPT/dev3pack`, branch`work`; A trợ lý Phase5 qua T34 trong A-queue. Không sửa checkout/file bàn giao A.
- Phạm vi: code/test local bằng toolchain/cache hiện có. Không deploy ReceiptRail, public/update web, cài thêm, signer triển khai hoặc mergePR7.
- Automation15phút **ACTIVE**, action+config read-back đúng chat; evidence phase4/automation-active-2026-11-19.json. Không tạo trùng.
- ReceiptRail chính, ClusterProof phụ/chưa duyệt; Phase2/P3-A/P3-B đã có quyền và evidence riêng. Không phục hồi payload sai cũ.
- T31/T32/T33 đã đóng tại7857e9b; D01–D03 là nợ tài liệu. T34 là triển khai UI mới, không vòng sửa report.
- C sở hữu programs/tests/build/IDL/client và hồ sơ chính; A sở hữu apps/web/receiptrail, route/UI/tests, note025/evidence Phase5.
- Quyền/T34 push05f8e79, note024 push9124f04, runtime32/32 push2a3fd30. Client r1 đạt23/23 + generated/TypeScript/browser-target bundle; source/ABI không đổi.
- Client đã có packages/receiptrail-client + docs/PHASE4-CLIENT.md; A dùng trong T34, chưa có bài nộp/xác nhận mới. Không chờ A để làm phần C.
- Giữ source/web/lab ClusterProof đã có; mọi commit/merge lượt local dùng `[skip ci]`, không gán CI27cf7ac cho code mới.
- P3-B đã xong137tx finalized/counter1, debit0.651874801SOL; không gửi lại upload/deploy/smoke, buffer mới/close hoặc tăng trần.
- Ví extension thật chưa kiểm theo lựa chọn người dùng; mock wallet không thay xác nhận thật. Chưa verdict giáo viên, không tự chấm thay.
- Chỉ dừng khi có quyết định/quyền cần người dùng; chuẩn bị phương án cụ thể trước hỏi. Không tự mở Phase6 hoặc coi mở Phase4/5 là đã hoàn tất.

## Còn lại

1. Push checkpoint client23tests/contract/T34; kiểm remote/A-done và tích hợp an toàn khi A có kết quả.
2. Review local program/client theo invariant, ghi evidence và chuẩn bị phương án CI/deploy ReceiptRail cụ thể (chưa thực thi).
3. Dùng T34/review UI ví/thanh toán và phần chạm tiền/quyền khi có; không mở lại T31–T33 hoặc chờ A thụ động.
4. Cập nhật PR7 theo Phase4/5 đã mở/runtime32/client23/Automation ACTIVE; read-back, không merge.
5. Sau khi phần local độc lập xong, trình riêng quyền CI/deploy/public nếu cần; không suy quyền từ Phase3. Cập nhật notes/DEVLOG/Thẻ nhớ, push mỗi mốc.

## Giới hạn cần người dùng khi tới cổng

- Deploy ReceiptRail, public/update web, cài thêm, signer triển khai và merge chưa được phép. Hiện chưa chặn học/code/test local.
- Ví thật chưa sẵn sàng ở lần trước; kiểm connect/disconnect extension khi người dùng sẵn sàng, không dùng mock/CLI thay bằng chứng.
- Verdict giáo viên SHORTLIST/kiến trúc chưa có; không cản phần local đã được người dùng mở, không ghi verdict thay.

[P3-B](evidence/phase3/README.md), [quyết định](ideas/DECISION.md), [NEXT](NEXT.md), [bàn giao trước](archive/HANDOFF-before-phase4-5-2026-11-19.md). Checkout đồng bộ thêm0a08395 chỉ đổi HANDOFF A, không có code mới trước mốc này.
