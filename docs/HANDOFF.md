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
- Đã push spike **8f84cfe**, hồ sơ/điểm **b5cb544**, reviewT22 **4f12caa**; commit Thẻ nhớ cuối xem HEAD. PR7 body đã cập nhậtT22v2, fetch khớp/headbfa184c/open/merged=false trước checkpoint này; không merge.
- Pull **bfa184c**: T22v2 giữ **9/9 mã đúng**, thêm4mô tả màn/Explorer khi có signature;36dòng đầu giữ nguyên, CTA/state/8wireframes/demo/SDK chưa đạt. Đã reviewv2, bổ sungT25 hiện có. Chưa có kết quảT23/T24, HANDOFF A vẫnT23. Queue **T23 evidence → T24 review → T25 UX**; giữ score/contract/file A.
- Automation **ACTIVE mỗi15phút** tại lần action view/config05:19, đúng chat; nhận heartbeat scheduler **07:28:04.279 ngày18/11/2026 UTC+7**. Record chứng minh lượt này đã gửi; reminder không mở cổng duyệt hoặc Phase3.
- Push sau mỗi bước lớn bằng `[skip ci]`; workflow cũ tự cài nên không kích hoạt, không gọi CI xanh.
- Cài thêm/tạo ví-keypair triển khai/deploy/public mới hỏi trước; Phase3 chỉ mở sau duyệt Phase2. Không merge/force-push/mainnet/secrets.

## Bằng chứng hiện hành

[IDEA](IDEA.md), [ARCHITECTURE](ARCHITECTURE.md), [note023](learning/023-receiptrail-phase2-spike.md), [metadata](evidence/phase2/receiptrail-build-metadata.json), [tests r2](evidence/phase2/receiptrail-spike-r2.txt), [IDL](idl/receiptrail.json). Source/tests/IDL đã đối chiếu3hash lượt05:42; chưa có client/browser/RPC/devnet/CI ReceiptRail, review chéo A chưa nhận đạt. Không còn process build cần poll.

[Review T22v2](reviews/receiptrail-codex.md#bổ-sung-t22-v2--18112026-heartbeat0728-utc7) lưu hash49dòng/9mã đúng và phần cải thiện; snapshot42dòng củaT22 giữ lịch sử.5findings chưa đóng, nguồn SDK được dẫn không hỗ trợ lựa chọn đó. [Review T21](reviews/receiptrail-codex.md#review-t21--18112026-heartbeat0613-utc7) xác nhận3/3 tên có thật trong source/log; source/tests/IDL/thiết kế/điểm/evidence không đổi từ4f12caa. [Audit T18–T20](evidence/phase2/receiptrail-reviews-t18-t20-audit.json) giữ snapshot f49716a, không dùng lỗi tên test cũ như report hiện hành. [Audit T17](evidence/phase2/receiptrail-ux-t17-audit.json) giữ snapshot sai9/9 lịch sử, không dùng như kết quả UX hiện hành. Chỉ kiểm tài liệu/source đã có, không rerun tests.

## Còn lại và cổng chưa mở

1. **Người dùng duyệt** [IDEA](IDEA.md) và [giải thích kiến trúc một trang](ARCHITECTURE.md#1-giải-thích-một-trang-cho-người-dùng). Ghi nguyên văn + giờ/múi giờ khi thật sự có câu đồng ý, không ghi sẵn đã duyệt hoặc hỏi chọn ý tưởng lại.
2. Khi A có bản mới, review theo [queue T23→T24→T25](tasks/A-queue.md) và [bảng cổng](reviews/phase1-3-gates.md). T22v2 đã review; tiếp theo xem evidenceT23, giữT24/T25 đã giao, không tạo task UX trùng. Review tài liệu được phép tiếp tục; không chờ A để trình bản C hoặc tự đóng cổng A/giáo viên. Giữ phần3tên test/9mã đã đúng, không nhận tên đúng/checkbox/URL thay assertions hoặc bằng chứng nội dung.
3. Sau duyệt và các cổng cần thiết mới lập bước Phase3 cụ thể; hỏi riêng trước mọi cài thêm/tạo ví-keypair triển khai/deploy/public mới. Duyệt tài liệu không là quyền vận hành.

## Bị chặn (cần người dùng)

Artifact Phase2, test, push và mô tả PR7 đã hoàn tất để trình. Scope cần duyệt: native SOL, một payer/merchant mỗi invoice; create/pay/cancel/read; Open→Paid/Cancelled, Expired hiển thị; không close/reset/refund/stablecoin/x402. Chỉ bảo vệ cùng invoice, không chứng minh giao hàng hoặc ngăn merchant dùng ID khác; còn rent lâu dài và trust program/upgrade/RPC.

Trong lúc chưa có lời duyệt, **không code/tích hợp/triển khai theo ý tưởng hoặc mở Phase3**. Không chạy lại web/lab, funding/sign/send hoặc tự cài để làm CI xanh; CI legacy chưa wire runner ReceiptRail. Automation giữ ACTIVE theo yêu cầu, tin tự nhắc không mở khóa cổng. Review A chưa nhận đạt; giáo viên chưa có verdict. Nguồn đính chính ở [DECISION](ideas/DECISION.md), sự cố [K6](STOP-CAUSES.md); lịch sử dài ở [snapshot](archive/HANDOFF-before-phase2-review.md).
