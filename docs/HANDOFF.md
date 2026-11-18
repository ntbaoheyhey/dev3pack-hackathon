# Thẻ nhớ — Codex / ReceiptRail Phase 2
- Trạng thái **bị chặn (cần người dùng)**: bản Phase2 đã soạn/test/push để trình duyệt. Goal đã chuyển **blocked** sau ba lượt cùng thiếu lời duyệt Phase2; chưa hoàn thành toàn goal.
- Quyết định: **“ReceiptRail chính, ClusterProof phụ” lúc00:07 ngày18/11/2026 UTC+7**; log tin xác nhận00:08:31.389.
- Repo `/Users/bao/Documents/ChatGPT/dev3pack`, branch `work`; không sửa checkout A.
- DECISION/AGENTS/K6 đã sửa; không dùng question_reply cũ hoặc reminder/agent làm quyền người dùng.
- ClusterProof: giữ IDEA/ARCHITECTURE riêng **dự phòng, chưa duyệt**, toolchain/web/lab giữ nguyên.
- ReceiptRail IDEA/ARCHITECTURE đã viết đủ Phase2/demo165s; **chưa duyệt**.
- Spike Anchor1.2.2/LiteSVM: bytecode thật, **19/19 runtime tests**,131bytes, principal trả1lần, duplicate tx mới/rollback/expiry/authority.
- Runner offline dùng compiler cache trực tiếp; r1 build+test64s, r2 cached3s, bytecode hash như nhau; IDLr3 exit0 đã copy/đối chiếu.
- C01 r2 **79/100/F4 PLAN** dựa19tests/D2; r0/r1 giữ. README/SHORTLIST/review/ROADMAP/DECISION đã đồng bộ.
- Đã push spike **8f84cfe**, hồ sơ/điểm **b5cb544**, reviewT23/v2/T24 và queueT26/T27 tại **cd3ccc1**. Checkpoint này reviewT25/giaoT28; PR7 body đã đồng bộ, fetch khớp/head9e7275e/open/merged=false trước checkpoint, không merge.
- Pull **9e7275e**: T25/33b71e7 đã nộp; nhận9mã đúng,8mục màn hình và4khoảng đủ165giây. Còn5findings copy/state/form/bố cục/demo/SDK; sửa quaT28. A ghi hết việc nhưngT26/T27 đã có trong ancestorcd3ccc1; queue **T26 evidence → T27 review → T28 UX**, làmT26 ngay. C không sửa file A.
- T24 đã review: nhận Signer/has_one/expire_blockhash, còn recipient/assertion/baseline retry/fee/ma trận/giới hạn quaT27; không rerun suite.
- T23/v2 đã review: nhận metadata/EVM/state/PDA/uniqueness; còn cơ chế/pain/mapping, expiry `>` và Paid=finalized. T26 sửa; snapshot cũ giữ nguyên. Không chờ A để trình bản C đã có.
- Automation **ACTIVE mỗi15phút** tại lần action view/config05:19, đúng chat; nhận heartbeat scheduler **09:00:35.054 ngày18/11/2026 UTC+7**. Record chứng minh lượt này đã gửi; reminder không mở cổng duyệt hoặc Phase3.
- Push sau mỗi bước lớn bằng `[skip ci]`; workflow cũ tự cài nên không kích hoạt, không gọi CI xanh.
- Cài thêm/tạo ví-keypair triển khai/deploy/public mới hỏi trước; Phase3 chỉ mở sau duyệt Phase2. Không merge/force-push/mainnet/secrets.

## Bằng chứng hiện hành

[IDEA](IDEA.md), [ARCHITECTURE](ARCHITECTURE.md), [note023](learning/023-receiptrail-phase2-spike.md), [metadata](evidence/phase2/receiptrail-build-metadata.json), [tests r2](evidence/phase2/receiptrail-spike-r2.txt), [IDL](idl/receiptrail.json). Source/tests/IDL đã đối chiếu3hash lượt05:42; chưa có client/browser/RPC/devnet/CI ReceiptRail, review chéo A chưa nhận đạt. Không còn process build cần poll.

[Review T25](reviews/receiptrail-codex.md#review-t25--18112026-heartbeat0900-utc7) giữ hash62dòng/9mã đúng/8mục/165giây/5findings,0URL; tổng thời gian không thay cảnh chứng minh duplicate tx mới/principal/phí. [Review T24](reviews/receiptrail-codex.md#review-t24--18112026-heartbeat0830-utc7) giữ bảng3ca/assertions/log cũ, không phải suite mới. [Review T23/v2](reviews/receiptrail-codex.md#review-t23--18112026-heartbeat0758-utc7) giữ2hash/5URL và lỗi expiry/commitment; nguồn ở [note021](learning/021-payment-cluster-evidence.md). Source/tests/IDL/thiết kế/điểm/logs spike và report review/evidence A không đổi từcd3ccc1; UX đổi hợp lệ tại33b71e7. Từ pull9e7275e, C chỉ sửa8file tài liệu của C; giữ file A và [audit T18–T20](evidence/phase2/receiptrail-reviews-t18-t20-audit.json)/[T17](evidence/phase2/receiptrail-ux-t17-audit.json). Lượt09:00 không mở nguồn ngoài, chạy browser hoặc rerun runtime suite.

## Còn lại và cổng chưa mở

1. **Người dùng duyệt** [IDEA](IDEA.md) và [giải thích kiến trúc một trang](ARCHITECTURE.md#1-giải-thích-một-trang-cho-người-dùng). Ghi nguyên văn + giờ/múi giờ khi thật sự có câu đồng ý, không ghi sẵn đã duyệt hoặc hỏi chọn ý tưởng lại.
2. Khi A có bản mới, review theo [queue T26→T27→T28](tasks/A-queue.md) và [bảng cổng](reviews/phase1-3-gates.md). T25 đã review; tiếp theo xem evidence T26, không làm lại T23/T24/T25 khi nội dung không đổi hoặc giao trùng việc. Review tài liệu đã giao được phép tiếp tục; không chờ A để trình bản C hoặc tự đóng cổng A/giáo viên. Giữ phần đã đúng, không nhận số mục/giây/checkbox thay nội dung hoặc bằng chứng.
3. Sau duyệt và các cổng cần thiết mới lập bước Phase3 cụ thể; hỏi riêng trước mọi cài thêm/tạo ví-keypair triển khai/deploy/public mới. Duyệt tài liệu không là quyền vận hành.

## Bị chặn (cần người dùng)

Artifact Phase2, test, push và mô tả PR7 đã hoàn tất để trình. Scope cần duyệt: native SOL, một payer/merchant mỗi invoice; create/pay/cancel/read; Open→Paid/Cancelled, Expired hiển thị; không close/reset/refund/stablecoin/x402. Chỉ bảo vệ cùng invoice, không chứng minh giao hàng hoặc ngăn merchant dùng ID khác; còn rent lâu dài và trust program/upgrade/RPC.

Trong lúc chưa có lời duyệt, **không code/tích hợp/triển khai theo ý tưởng hoặc mở Phase3**. Không chạy lại web/lab, funding/sign/send hoặc tự cài để làm CI xanh; CI legacy chưa wire runner ReceiptRail. Automation giữ ACTIVE theo yêu cầu, tin tự nhắc không mở khóa cổng. Review A chưa nhận đạt; giáo viên chưa có verdict. Nguồn đính chính ở [DECISION](ideas/DECISION.md), sự cố [K6](STOP-CAUSES.md); lịch sử dài ở [snapshot](archive/HANDOFF-before-phase2-review.md).
