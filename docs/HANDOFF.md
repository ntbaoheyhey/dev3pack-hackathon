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
- Đã push spike **8f84cfe**, hồ sơ/điểm **b5cb544**, reviewT22v2 **cf62e05**; checkpoint này lưu reviewT23/v2/T24 và queueT26/T27. PR7 body đã đồng bộ và fetch khớp ởhead6eee5ac/open/merged=false trước checkpoint; không merge.
- Pull **6eee5ac**: T24/7325169 đã nộp; nhận Signer/has_one/expire_blockhash. Còn recipient/assertion, baseline retry phải Paid, fee và ma trận/giới hạn; giaoT27. A đangT25 đúng queue; tiếp tục **T25 UX → T26 evidence → T27 review**. C sở hữu queue/review C/notes/bàn giao, không sửa file A.
- T23/v2 đã review: nhận metadata/EVM/state/PDA/uniqueness; còn cơ chế/pain/mapping, expiry `>` và Paid=finalized. T26 sửa; snapshot cũ giữ nguyên. Không chờ A để trình bản C đã có.
- Automation **ACTIVE mỗi15phút** tại lần action view/config05:19, đúng chat; nhận heartbeat scheduler **08:30:34.904 ngày18/11/2026 UTC+7**. Record chứng minh lượt này đã gửi; reminder không mở cổng duyệt hoặc Phase3.
- Push sau mỗi bước lớn bằng `[skip ci]`; workflow cũ tự cài nên không kích hoạt, không gọi CI xanh.
- Cài thêm/tạo ví-keypair triển khai/deploy/public mới hỏi trước; Phase3 chỉ mở sau duyệt Phase2. Không merge/force-push/mainnet/secrets.

## Bằng chứng hiện hành

[IDEA](IDEA.md), [ARCHITECTURE](ARCHITECTURE.md), [note023](learning/023-receiptrail-phase2-spike.md), [metadata](evidence/phase2/receiptrail-build-metadata.json), [tests r2](evidence/phase2/receiptrail-spike-r2.txt), [IDL](idl/receiptrail.json). Source/tests/IDL đã đối chiếu3hash lượt05:42; chưa có client/browser/RPC/devnet/CI ReceiptRail, review chéo A chưa nhận đạt. Không còn process build cần poll.

[Review T24](reviews/receiptrail-codex.md#review-t24--18112026-heartbeat0830-utc7) giữ hash31dòng/3findings và bảng3ca: CPI thiếu tiền giữ Open; hai pay cùng tx rollback về Open; retry tx mới giữ Paid của tx trước. Script đọc log đã xử lý METRIC + ok hai dòng, đối chiếu19 kết quả cũ; lỗi parser ban đầu không là runtime failure. [Review T23](reviews/receiptrail-codex.md#review-t23--18112026-heartbeat0758-utc7) lưu hai hash27dòng/5URL/3findings, [bổ sungv2](reviews/receiptrail-codex.md#bổ-sung-t23-v2-trước-checkpoint) đối chiếu source65/test321/logr2:25; nguồn ở [note021](learning/021-payment-cluster-evidence.md), lượt08:30 không mở lại nguồn ngoài. [Review T22v2](reviews/receiptrail-codex.md#bổ-sung-t22-v2--18112026-heartbeat0728-utc7) giữ9mã/4mô tả màn đã đúng. Source/tests/IDL/thiết kế/điểm/logs spike và UX không đổi từcf62e05; report review A đổi hợp lệ tại7325169. Từ mốc pull6eee5ac, C chỉ sửa9file tài liệu của C; giữ file A và [audit T18–T20](evidence/phase2/receiptrail-reviews-t18-t20-audit.json)/[T17](evidence/phase2/receiptrail-ux-t17-audit.json), không rerun suite.

## Còn lại và cổng chưa mở

1. **Người dùng duyệt** [IDEA](IDEA.md) và [giải thích kiến trúc một trang](ARCHITECTURE.md#1-giải-thích-một-trang-cho-người-dùng). Ghi nguyên văn + giờ/múi giờ khi thật sự có câu đồng ý, không ghi sẵn đã duyệt hoặc hỏi chọn ý tưởng lại.
2. Khi A có bản mới, review theo [queue T25→T26→T27](tasks/A-queue.md) và [bảng cổng](reviews/phase1-3-gates.md). T24 đã review; không làm lại T23/T24 khi nội dung không đổi, tiếp theo xem UX T25. Review tài liệu đã giao được phép tiếp tục; không chờ A để trình bản C hoặc tự đóng cổng A/giáo viên. Giữ phần đã đúng, không nhận tên/checkbox/URL thay assertions hoặc bằng chứng nội dung.
3. Sau duyệt và các cổng cần thiết mới lập bước Phase3 cụ thể; hỏi riêng trước mọi cài thêm/tạo ví-keypair triển khai/deploy/public mới. Duyệt tài liệu không là quyền vận hành.

## Bị chặn (cần người dùng)

Artifact Phase2, test, push và mô tả PR7 đã hoàn tất để trình. Scope cần duyệt: native SOL, một payer/merchant mỗi invoice; create/pay/cancel/read; Open→Paid/Cancelled, Expired hiển thị; không close/reset/refund/stablecoin/x402. Chỉ bảo vệ cùng invoice, không chứng minh giao hàng hoặc ngăn merchant dùng ID khác; còn rent lâu dài và trust program/upgrade/RPC.

Trong lúc chưa có lời duyệt, **không code/tích hợp/triển khai theo ý tưởng hoặc mở Phase3**. Không chạy lại web/lab, funding/sign/send hoặc tự cài để làm CI xanh; CI legacy chưa wire runner ReceiptRail. Automation giữ ACTIVE theo yêu cầu, tin tự nhắc không mở khóa cổng. Review A chưa nhận đạt; giáo viên chưa có verdict. Nguồn đính chính ở [DECISION](ideas/DECISION.md), sự cố [K6](STOP-CAUSES.md); lịch sử dài ở [snapshot](archive/HANDOFF-before-phase2-review.md).
