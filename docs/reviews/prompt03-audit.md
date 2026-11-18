# Audit Prompt 03 — checkpoint sau duyệt Phase 2

Codex · 18/11/2026. Đây là đối chiếu yêu cầu với hồ sơ trong repo, không phải verdict giáo viên. **Goal chưa hoàn thành**: P3-A đạt cả push/PR CI Linux27cf7ac; P3-B có quyền nhưng funding/devnet/review còn mở. Tin **“duyệt phase 2”** đã được ghi đúng [nguyên văn/giờ log](../ideas/DECISION.md), không hỏi lại.

## Đối chiếu từng yêu cầu

| Yêu cầu Prompt03 | Bằng chứng | Kết luận và giới hạn |
| --- | --- | --- |
| 0.1 Nhắc 15 phút đúng chat | Automation `dev3pack-nh-c-tr-ng-nh-m-m-i-15-ph-t`: action view và config ACTIVE, interval 15, chat `01a1e9c8-1b24-7911-91a4-4897fc175566` | Đã kiểm lại; không suy mọi lần scheduler đã gửi thành công |
| 0.2–4 Đồng bộ, luật, Thẻ nhớ ngắn | [AGENTS](../../AGENTS.md), [HANDOFF](../HANDOFF.md), [lịch sử bàn giao](../archive/HANDOFF-history-codex.md), [STOP-CAUSES](../STOP-CAUSES.md) | Làm trên work; fetch trước review, giữ lịch sử; không merge PR. K9 bổ sung skip marker cho cả commit merge và job guards |
| 1 Xử lý nhận xét bài A | [Cross-scores](../ideas/cross-scores-codex.md) | Bỏ nhãn ĐẠT cũ, sửa phép tính, đánh giá evidence/account/dependency/threat model; giữ file A |
| 2.1 RUBRIC v1.2 | [RUBRIC](../ideas/RUBRIC.md), [kiểm số liệu](../evidence/phase3/goal-audit-2026-11-18.json) | Codex chấm bằng chứng, A trợ lý, giáo viên chấm qua PR; weights/floors khớp v1.1 tại 3bb7003 |
| 2.2/2.5 Ít nhất ba bài ĐẠT PLAN | [C01](../ideas/codex/01-receipt-rail.md), [C02](../ideas/codex/02-cluster-proof.md), [C03](../ideas/codex/03-netpay-check.md) | 79/79/77, mỗi bài có user/workflow, nguồn/ngày, alternatives, account/instruction, dependencies, threat model, demo, kill criteria và điểm từng vòng. ĐẠT theo Codex, chưa giáo viên/DELIVERY |
| 2.3 Dùng trợ lý và kết quả | [Queue](../tasks/A-queue.md), [A-done](../tasks/A-done.md), [review C](receiptrail-codex.md) | Đã giao crawl/UX/review và đối chiếu report với source/log; chỉ nhận phần có chứng cứ. T30 nhận một phần; T31v2/4e4a004 nhận Request/Unknown, còn nguồn/state/phản hồi; [T32/c801580](../evidence/phase2/receiptrail-t32-review.json) nhận merchant không ký pay/3tên hàm/baseline, còn assertions/log/giới hạn.9nhóm findings còn mở; T32→T33→T31 sửa bổ sung cùng ID; T33 nhận một phần, đã chốt PR và snapshot14:44:05 UTC+7 |
| 2.4 Chấm lại ba ứng viên A | Cross-scores và snapshot 3a6359b | Tính lại 42/40/37; cả ba dưới sàn, có lý do không chọn/giữ vấn đề/bỏ. Ba file nguồn khớp snapshot |
| 3.1 SHORTLIST và lịch sử thay bản A | [SHORTLIST](../ideas/SHORTLIST.md) | Có một câu, điểm, evidence, rủi ro mỗi bài; bổ sung dòng bản A bị thay vì thiếu evidence/F4/phép tính; giữ r0/r1/r2 |
| 3.2 PR work → main, không merge | [PR #7](https://github.com/ntbaoheyhey/dev3pack-hackathon/pull/7), [snapshot T33/T31v2](../evidence/phase3/pr7-review-t33-t31-v2-snapshot.json) | Đã push7d0f06e/be8ee8d/e48172b; read-back14:44:05 UTC+7 bodyT33/T31v2/T32/queueT32→T33→T31/work→main/open/merged=false/head e48172b. Comments/reviews rỗng; giữ ba snapshots cũ. Checkpoint lưu snapshot về sau không là revision đã chạy CI |
| 3.3 Chọn chính/phụ và quyền cài | [DECISION](../ideas/DECISION.md), STOP-CAUSES K6 | Payload cũ bị người dùng đính chính đã vô hiệu. Hiện ReceiptRail chính, ClusterProof phụ; giữ bộ đã cài. Không dùng prompt cũ để mở rộng quyền |
| 3.4 Chuẩn bị độc lập khi chờ | [Note022](../learning/022-phase2-3-independent-prep.md), [kế hoạch Phase3](../PHASE3-PLAN.md) | Runner cache/offline và phương án cụ thể đã chuẩn bị; không installer/sign/deploy/public mới |
| 4 Phase1–2 và spike sớm | [IDEA](../IDEA.md), [ARCHITECTURE](../ARCHITECTURE.md), [note023](../learning/023-receiptrail-phase2-spike.md), [catalog Phase2](../evidence/phase2/README.md) | Account/PDA/instructions/state/test plan/demo 165 giây và Anchor spike thật; người dùng duyệt. Review chéo/giáo viên chưa nhận đạt |
| 4 Phase3 có điều kiện | [Metadata offline](../evidence/phase3/offline-pipeline-metadata.json), [CI27cf7ac](../evidence/phase3/ci-passed-27cf7ac.json), PHASE3-PLAN | 25runtime+8client local đạt; Linux push/PR27cf7ac đều đạt3jobs/57tests+build/ReceiptRail IDL cmp. Giữ web cũ; chưa hello devnet/tx/ví thật. P3-A/P3-B có quyền; funding được người dùng để sau |
| 5 Điểm dừng cuối | [NEXT](../NEXT.md), [ROADMAP](../ROADMAP.md), [DEVLOG](../DEVLOG.md), [bảng cổng](phase1-3-gates.md) | Hồ sơ đã cập nhật nhưng chưa được ghi goal/Phase3 xong; cần đúng quyền và evidence còn thiếu |

## Điểm và bằng chứng đã kiểm

| Bài | Vector P/S/N/F/R/D/V | Tổng | Bằng chứng quyết định và giới hạn |
| --- | --- | ---: | --- |
| C01 r2 | 4/4/4/4/4/4/3 | 79 | 19 runtime tests Anchor bytecode thật; chỉ F3→4 từ r1. Hai nguồn pain khác hệ sinh thái hỗ trợ workflow, chưa pilot; native SOL/cùng invoice, chưa browser/RPC recovery |
| C02 r1 | 4/4/4/4/4/4/3 | 79 | Capture devnet đọc 747 ms và năm mutations; không chứng minh ABI/source hoặc lợi ích market |
| C03 r1 | 4/4/3/4/4/4/3 | 77 | Raw mint/epoch và quote fee-only 283 ms, năm script hashes khớp; chưa settlement, overlap SDK/Ryntra nên N3 |
| A01/A02/A03 | Xem cross-scores | 42/40/37 | Chấm phần thực sự có, không biến thiếu evidence thành kết luận thị trường không cần |

[Audit JSON](../evidence/phase3/goal-audit-2026-11-18.json) lưu phép tính/sàn, ba snapshot A, năm hash scripts và log 16 tests Phase1. [Catalog Phase1](../evidence/phase1/README.md) và từng bảng điểm trỏ nguồn cụ thể. R/D4 là chất lượng PLAN, không chứng nhận audit/demo thật. Kiểm số học và links không thay chất lượng nguồn hoặc user validation; nguồn lịch sử không được gọi là crawl mới trong lượt này.

## Các cổng chưa đóng

T28/T29 tại601e723 đã nộp; C nhận phí/Unknown/baseline retry Paid→Paid. [Review T28/T29](receiptrail-codex.md#review-t28-và-t29--18112026-heartbeat1235-utc7) và [snapshot](../evidence/phase2/receiptrail-t28-t29-review.json) giữ9findings: semantics/form/bố cục/demo/SDK, provenance/state/phản hồi, recipient/assertions/ma trận. T30/0d7b9d3 đã khôi phục phí/terms/Unknown/expiry nhưng state/version/form/CTA vẫn thiếu và mục3–5 thành placeholder ([review T30](receiptrail-codex.md#review-t30--18112026-heartbeat1327-utc7)). [T31v2/4e4a004](receiptrail-codex.md#bổ-sung-t31-v2-trước-checkpoint--18112026) nhận Request/Unknown không tự ký/retry, còn provenance/state/phản hồi. [T33/6ef9815](receiptrail-codex.md#review-t33--18112026-heartbeat1428-utc7) nhận hai bảng/9mã/165giây trên giấy, còn state/vai/form/phí/bố cục/demo/SDK. Tiếp tục T32→T33→T31 sửa bổ sung cùng ID; không dùng checklist thay evidence. Không tự nhận review độc lập đạt hoặc suy A bỏ sót task chưa nộp.

Người dùng duyệt Phase2 không là quyền cài/deploy/public. [P3-A/P3-B](../PHASE3-PLAN.md) đã được đồng ý riêng bằng “Đồng ý cả hai”; [CI27cf7ac](../evidence/phase3/ci-passed-27cf7ac.json) push/PR đều đạt, phần CI đã đóng. Funding hello được người dùng để sau. Web ClusterProof cũ được giữ, chưa có web ReceiptRail. Cổng giáo viên và bài tập ví thật vẫn mở. Hashes Linux khác macOS, chưa verified build; không thay binary dự kiến deploy. Repo có MIT và kế hoạch public trước nộp; không đổi visibility trong checkpoint này.
