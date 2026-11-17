# Hồ sơ review Phase 1–3 — Codex

17/11/2026 · trạng thái **đang làm**. Đây là đối chiếu của trưởng nhóm với Prompt03/ROADMAP; không thay chấm của giáo viên hoặc duyệt của người dùng. Lựa chọn ClusterProof chính/NetPay Check dự phòng và quyền cài đã được ghi trong [DECISION](../ideas/DECISION.md), không hỏi lại.

## Yêu cầu và bằng chứng

| Yêu cầu | Bằng chứng hiện hành | Kết luận |
| --- | --- | --- |
| Nhắc đúng chat mỗi15phút | Automation heartbeat đã view/config-read: ACTIVE, đúng prompt và chat; HANDOFF giữ ID | Đã cấu hình; chưa quan sát heartbeat phát ra |
| RUBRIC v1.2 giữ weights/floors/gates | [RUBRIC](../ideas/RUBRIC.md) mục1–5; 20/15/10/20/15/15/5, floors3/3/2/3/3/3/2, ngưỡng75, F≤3 nếu chưa spike | Codex đã chốt theo Prompt03; không tự đổi để nâng điểm |
| ≥3 ý tưởng PLAN đạt và review ứng viên A | [C01](../ideas/codex/01-receipt-rail.md), [C02](../ideas/codex/02-cluster-proof.md), [C03](../ideas/codex/03-netpay-check.md):75/79/77; [cross-scores](../ideas/cross-scores-codex.md):42/40/37; [SHORTLIST](../ideas/SHORTLIST.md) | Codex đã chấm có nguồn và giới hạn; giáo viên chấm SHORTLIST chưa có verdict |
| Dùng trợ lý, không chờ A | [A-queue](../tasks/A-queue.md)/[A-done](../tasks/A-done.md), findings T4/T6, tiếp nhận Dashboard; T9 browser/T10 architecture đã giao | Đã dùng; review độc lập mới còn mở |
| Phase1: đặc tả và người dùng duyệt | [IDEA](../IDEA.md):user stories/scope/Solana/demo/acceptance | Bản review đã có; người dùng chưa duyệt |
| Phase2: thiết kế đầy đủ | [ARCHITECTURE v0.3](../ARCHITECTURE.md):giải thích1trang/sơ đồ/account-PDA-instruction-event-IDL/off-chain/SDK/threat/UX/contract/ownership | Đã chốt thiết kế; review chéo, giáo viên chấm và người dùng đồng ý còn mở |
| Toolchain theo quyền đã cho | [note003](../learning/003-solana-toolchain.md), [build metadata](../evidence/phase3/build-metadata.json), [hello-check-r2](../evidence/phase3/hello-check-r2.txt) | Đã cài/build/IDL/6 runtime tests local; không cài lại |
| Hello program + transaction devnet thật | [inspect](../evidence/phase3/devnet-inspect-1794932899367.json):đúng genesis/slot523329001,payer0SOL,program chưa deploy,transactions=[] | Chưa đạt; funding cần người dùng |
| Web công khai + wallet lab | [Web](https://clusterproof-devnet-17nov26.anthony-robinson-125.chatgpt.site), [evidence](../evidence/phase3/web.md), [hosting](../evidence/phase3/web-hosting.json) | Public/build/browser đạt; no-wallet và fixture connector đã kiểm, extension thật chưa kiểm |
| CI xanh đúng source | [workflow](../../.github/workflows/ci.yml), [diagnostics7d27640](../evidence/phase3/ci-blocked-7d27640.json) | Chưa đạt: GitHub billing chặn trước job; local pass không thay Linux CI |
| PR work→main, không merge | [PR#7](https://github.com/ntbaoheyhey/dev3pack-hackathon/pull/7), HEAD/refs trong HANDOFF | PR đang mở; cập nhật code/docs/evidence theo checkpoint, không merge |
| An toàn và provenance | Keys ngoài Git, devnet/local only; templates/lock/license/evidence; [README](../../README.md) tách trước/trong sự kiện | Scope đã giữ; repo vẫn private/MIT, public-source gate trước nộp chưa đạt |
| NEXT và kết thúc goal | Prompt03 mục5 | Chưa viết NEXT final hoặc gọi xong khi Phase2/3 còn cổng chưa đạt |

## Review kỹ thuật của Codex

- Scope C02 dùng deployment Solana nên không tạo thêm account/PDA/instruction/event của đội. Lab counter/IDL là bài học pipeline riêng; không lấy6 runtime tests lab làm evidence rằng product parser đã đủ.
- Thiết kế v0.3 chốt paired finalized reads, pointer/slot checks, deadlines/byte limits, duplicate-key policy, ý nghĩa hash và replay. Baseline web chỉ metadata confirmed; README/UI không tuyên bố report MVP hoặc safety verdict.
- Đọc toàn web inspector, Dashboard, wallet provider và fixture; không thấy đường sign/send trong production web, không raw HTML từ RPC/input, endpoint devnet cố định. 8 tests bao phủ input/transport/failure; source code/config/tests trùng bản Sites được kiểm. Đây là review phạm vi baseline, không audit sản phẩm hay test ví thật.
- SDK wallet có warmup RPC; log local từng Failed to fetch. Đã sửa README/evidence để không gán quy tắc “chỉ đọc sau bấm” của trang chủ cho /lab. Giữ lỗi fixture typing/peer graph và kết quả pass ở artifacts khác nhau.
- CI chỉ checkout/build/test/upload .so/IDL/types, contents:read, actions pin SHA, không deployment hoặc secret lab signer trong jobs. Chưa chứng minh Linux execution vì billing chặn.

## Những quyết định cần review bên ngoài

1. Người dùng duyệt scope trong IDEA và bản giải thích một trang ở ARCHITECTURE mục1; yêu cầu này từ ROADMAP cổng Phase1/2, khác lựa chọn ý tưởng đã trả lời.
2. Giáo viên chấm lại SHORTLIST/RUBRIC và kiến trúc; A trả T10 findings. Chưa có verdict thì không tự ghi đã được duyệt.
3. Người dùng xử lý funding devnet và GitHub Billing & plans đã hỏi; sau đó C deploy/invoke/xác minh và theo CI đúng head. Không dùng mainnet hoặc bỏ jobs để tạo xanh.

Trong lúc các cổng còn mở, C hoàn tất review/docs/commit/PR và dùng kết quả A khi có; không chặn công việc bằng việc chờ A.
