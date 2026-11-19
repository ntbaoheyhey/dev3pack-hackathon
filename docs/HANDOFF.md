# Thẻ nhớ — Codex / P4-B xong, Phase5 local đang làm
- Trạng thái **đang làm**; người dùng đã mở Phase4 ReceiptRail và Phase5 song song ngày19/11, giờ log13:25:47 UTC+7; nguyên văn tại DECISION/evidence phase4.
- Người dùng yêu cầu “dừng điều khiển mình nhé, đã ổn rồi mà”; C đã dừng điều khiển giao diện. Chỉ CLI/repo trong phạm vi cũ; không dùng CUA/browser/mouse-keyboard nếu chưa được yêu cầu lại.
- C trưởng nhóm tại `/Users/bao/Documents/ChatGPT/dev3pack`, branch`work`; A đã nộp T35 tại69e458a; C đã pull/test21+build đạt, đang review source. Không sửa checkout/file bàn giao A.
- P4-A/P4-B đã đồng ý “Đồng ý cả P4-A và P4-B”, log13:55:34.348UTC+7: CI đúng pins; sau CI4keypairs ngoài Git, ReceiptRail deploy+smoke/cap1.8SOL. Chưa public/cài local/mergePR7/Phase6.
- Automation15phút **ACTIVE**, action+config read-back đúng chat; evidence phase4/automation-active-2026-11-19.json. Không tạo trùng.
- ReceiptRail chính, ClusterProof phụ/chưa duyệt; Phase2/P3-A/P3-B đã có quyền và evidence riêng. Không phục hồi payload sai cũ.
- T31/T32/T33 đã đóng tại7857e9b; D01–D03 là nợ tài liệu. T34 là triển khai UI mới, không vòng sửa report.
- C sở hữu programs/tests/build/IDL/client và hồ sơ chính; A sở hữu apps/web/receiptrail, route/UI/tests, note025/evidence Phase5.
- Quyền/T34 push05f8e79, note024 push9124f04, runtime32/32 push2a3fd30. Client r1 đạt23/23 + generated/TypeScript/browser-target bundle; source/ABI không đổi.
- CI triển khai6d08e5c đạt đủ3jobs ở push44477944228; PR44477949631 cancelled, không gọi xanh. 33input hashes khớp tại deploy; runner đổi cho recovery mới, CI riêng e9a1603 đã đạt; binary local495e47… giữ nguyên.
- P4-B hoàn tất16:41UTC+7:162tx finalized, Paid/Cancelled đúng, duplicate simulation đạt; debit0.760701080SOL<cap1.8. Không gửi lại. T35 nộp69e458a, C đang review implementation; không GUI.
- Giữ source/web/lab ClusterProof đã có; checkpoint tài liệu dùng `[skip ci]`; CI được mở đúng P4-A, không gán CI cũ cho revision mới.
- P3-B đã xong137tx finalized/counter1, debit0.651874801SOL; không gửi lại upload/deploy/smoke, buffer mới/close hoặc tăng trần.
- Ví extension thật chưa kiểm theo lựa chọn người dùng; mock wallet không thay xác nhận thật. Chưa verdict giáo viên, không tự chấm thay.
- Chỉ dừng khi có quyết định/quyền cần người dùng; chuẩn bị phương án cụ thể trước hỏi. Không tự mở Phase6 hoặc coi mở Phase4/5 là đã hoàn tất.

## Còn lại

1. P4-B **đã hoàn tất**, final-verification.json:162tx finalized/debit0.760701080SOL<1.8/không activity lạ; không còn send/deploy/reconcile cần chạy. Cancel recovery CI e9a1603 hai runs đạt3jobs/36inputs; không gán CI này cho source UI69e458a.
2. Review T35 source69e458a:21tests/build local đạt; nhận các fix duplicate-create/fixture/validation/pending/strict-hex/list. C đang tái hiện phần thiếu wallet identity/terms, concurrent submit và read-only recovery bằng CLI/source; không dùng GUI/headless. Giao implementation còn thiếu qua A-queue/Git, không mở lại T31–T33.
3. Đồng bộ kết quả review vào notes/DEVLOG/Thẻ nhớ/PR7; push sau mỗi mốc. Phase5 public/ví thật/giáo viên còn cổng riêng. Chưa hỏi public trước artifact/review đủ cụ thể.

## Giới hạn cần người dùng khi tới cổng

- P4-A/P4-B đã có quyền theo plan; chỉ public/update web, cài thêm local, signer ngoài4đã duyệt, vượt1.8SOL, upgrade mới, merge/Phase6 còn cần người dùng.
- Ví thật chưa sẵn sàng ở lần trước; kiểm connect/disconnect extension khi người dùng sẵn sàng, không dùng mock/CLI thay bằng chứng.
- Verdict giáo viên SHORTLIST/kiến trúc chưa có; không cản phần local đã được người dùng mở, không ghi verdict thay.

[P3-B](evidence/phase3/README.md), [quyết định](ideas/DECISION.md), [NEXT](NEXT.md), [bàn giao trước](archive/HANDOFF-before-phase4-5-2026-11-19.md). Checkout đồng bộ thêm0a08395 chỉ đổi HANDOFF A, không có code mới trước mốc này.
