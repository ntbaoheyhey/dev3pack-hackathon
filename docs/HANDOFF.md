# Thẻ nhớ — Codex / ReceiptRail Phase 2
- Trạng thái **bị chặn (cần người dùng)**: bản Phase2 đã soạn/test/push để trình duyệt. Goal vẫn active, không tự đổi paused/complete.
- Quyết định: **“ReceiptRail chính, ClusterProof phụ” lúc00:07 ngày18/11/2026 UTC+7**; log tin xác nhận00:08:31.389.
- Repo `/Users/bao/Documents/ChatGPT/dev3pack`, branch `work`; không sửa checkout A.
- DECISION/AGENTS/K6 đã sửa; không dùng question_reply cũ hoặc reminder/agent làm quyền người dùng.
- ClusterProof: giữ IDEA/ARCHITECTURE riêng **dự phòng, chưa duyệt**, toolchain/web/lab giữ nguyên.
- ReceiptRail IDEA/ARCHITECTURE đã viết đủ Phase2/demo165s; **chưa duyệt**.
- Spike Anchor1.2.2/LiteSVM: bytecode thật, **19/19 runtime tests**,131bytes, principal trả1lần, duplicate tx mới/rollback/expiry/authority.
- Runner offline dùng compiler cache trực tiếp; r1 build+test64s, r2 cached3s, bytecode hash như nhau; IDLr3 exit0 đã copy/đối chiếu.
- C01 r2 **79/100/F4 PLAN** dựa19tests/D2; r0/r1 giữ. README/SHORTLIST/review/ROADMAP/DECISION đã đồng bộ.
- Đã push spike **8f84cfe**, hồ sơ/điểm **b5cb544**; commit Thẻ nhớ cuối xem HEAD. PR7 title/body đã sửa ReceiptRail, đọc lại open/merged=false/head b5cb544 trước commit cuối.
- A-queue T11 crawl→T12 UX→T13 review đã giao; fetch gần nhất chưa có kết quả mới. Không chờ A.
- Automation action view/config **ACTIVE mỗi15phút**, đúng chat; chưa quan sát heartbeat mới. Khi tự nhắc, chưa có duyệt mới thì không mở việc phụ thuộc ý tưởng/Phase3.
- Push sau mỗi bước lớn bằng `[skip ci]`; workflow cũ tự cài nên không kích hoạt, không gọi CI xanh.
- Cài thêm/tạo ví-keypair triển khai/deploy/public mới hỏi trước; Phase3 chỉ mở sau duyệt Phase2. Không merge/force-push/mainnet/secrets.

## Bằng chứng hiện hành

[IDEA](IDEA.md), [ARCHITECTURE](ARCHITECTURE.md), [note023](learning/023-receiptrail-phase2-spike.md), [metadata](evidence/phase2/receiptrail-build-metadata.json), [tests r2](evidence/phase2/receiptrail-spike-r2.txt), [IDL](idl/receiptrail.json). Source/tests/lock hash đã khớp log. Chưa có client/browser/RPC/devnet/CI/review độc lập ReceiptRail. Không còn process build cần poll.

## Còn lại — cần câu trả lời trước khi thực hiện

1. **Người dùng duyệt** [IDEA](IDEA.md) và [giải thích kiến trúc một trang](ARCHITECTURE.md#1-giải-thích-một-trang-cho-người-dùng). Ghi nguyên văn + giờ/múi giờ khi thật sự có câu đồng ý, không ghi sẵn đã duyệt hoặc hỏi chọn ý tưởng lại.
2. Review A/giáo viên theo [bảng cổng](reviews/phase1-3-gates.md) còn mở; không tự đóng thay. Chưa có kết quả A không trì hoãn trình bản hiện tại.
3. Sau duyệt và các cổng cần thiết mới lập bước Phase3 cụ thể; hỏi riêng trước mọi cài thêm/tạo ví-keypair triển khai/deploy/public mới. Duyệt tài liệu không là quyền vận hành.

## Bị chặn (cần người dùng)

Artifact Phase2, test, push và mô tả PR7 đã hoàn tất để trình. Scope cần duyệt: native SOL, một payer/merchant mỗi invoice; create/pay/cancel/read; Open→Paid/Cancelled, Expired hiển thị; không close/reset/refund/stablecoin/x402. Chỉ bảo vệ cùng invoice, không chứng minh giao hàng hoặc ngăn merchant dùng ID khác; còn rent lâu dài và trust program/upgrade/RPC.

Trong lúc chưa có lời duyệt, **không code/tích hợp/triển khai theo ý tưởng hoặc mở Phase3**. Không chạy lại web/lab, funding/sign/send hoặc tự cài để làm CI xanh; CI legacy chưa wire runner ReceiptRail. Automation giữ ACTIVE theo yêu cầu, tin tự nhắc không mở khóa cổng. Review A/giáo viên chưa có verdict. Nguồn đính chính ở [DECISION](ideas/DECISION.md), sự cố [K6](STOP-CAUSES.md); lịch sử dài ở [snapshot](archive/HANDOFF-before-phase2-review.md).
