# Thẻ nhớ — Codex / ReceiptRail Phase 2
- Trạng thái **đang làm**; goal active. Automation action view/config **ACTIVE mỗi15phút**, đúng chat; chưa thấy heartbeat mới.
- Quyết định: **“ReceiptRail chính, ClusterProof phụ” lúc00:07 ngày18/11/2026 UTC+7**; log tin xác nhận00:08:31.389.
- Repo `/Users/bao/Documents/ChatGPT/dev3pack`, branch `work`; không sửa checkout A.
- DECISION/AGENTS/K6 đã sửa; không dùng question_reply cũ hoặc reminder/agent làm quyền người dùng.
- ClusterProof: giữ IDEA/ARCHITECTURE riêng **dự phòng, chưa duyệt**, toolchain/web/lab giữ nguyên.
- ReceiptRail IDEA/ARCHITECTURE đã viết đủ Phase2/demo165s; **chưa duyệt**.
- Spike Anchor1.2.2/LiteSVM: bytecode thật, **19/19 runtime tests**,131bytes, principal trả1lần, duplicate tx mới/rollback/expiry/authority.
- Runner offline dùng compiler cache trực tiếp; r1 build+test64s, r2 cached3s, bytecode hash như nhau; IDLr3 exit0 đã copy/đối chiếu.
- C01 còn75/F3 trên giấy; bước tới chấm r2 theo evidence, đồng bộ README/SHORTLIST/review và PR7.
- A-queue T11 crawl→T12 UX→T13 review đã giao; fetch gần nhất chưa có kết quả mới. Không chờ A.
- Push sau mỗi bước lớn bằng `[skip ci]`; workflow cũ tự cài nên không kích hoạt, không gọi CI xanh.
- Cài thêm/tạo ví-keypair triển khai/deploy/public mới hỏi trước; Phase3 chỉ mở sau duyệt Phase2. Không merge/force-push/mainnet/secrets.

## Bằng chứng hiện hành

[IDEA](IDEA.md), [ARCHITECTURE](ARCHITECTURE.md), [note023](learning/023-receiptrail-phase2-spike.md), [metadata](evidence/phase2/receiptrail-build-metadata.json), [tests r2](evidence/phase2/receiptrail-spike-r2.txt), [IDL](idl/receiptrail.json). Source/tests/lock hash đã khớp log. Chưa có client/browser/RPC/devnet/CI/review độc lập ReceiptRail. Không còn process build cần poll.

## Còn lại

1. Commit/push bước spike+tài liệu/IDL/evidence.
2. Chấm C01 r2; đồng bộ SHORTLIST/README/review/ROADMAP/DECISION, giữ lịch sử r0/r1.
3. Fetch A-done, dùng kết quả nếu có; cập nhật mô tả PR7, không merge.
4. Trình người dùng duyệt bản Phase2 cụ thể. Không làm việc phụ thuộc ý tưởng/Phase3 trong lúc chờ duyệt.

## Cần người dùng ở cổng sau

Duyệt IDEA và giải thích ARCHITECTURE ReceiptRail trước Phase3; review A/giáo viên chưa có verdict. Lựa chọn ý tưởng không là duyệt thiết kế hoặc quyền vận hành. Nguồn đính chính đầy đủ ở [DECISION](ideas/DECISION.md), sự cố [K6](STOP-CAUSES.md); lịch sử dài ở [snapshot](archive/HANDOFF-before-phase2-review.md).
