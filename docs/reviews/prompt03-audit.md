# Audit Prompt 03 — checkpoint sau P3-B

Codex · 18/11/2026. Đây là đối chiếu yêu cầu với hồ sơ trong repo, không phải verdict giáo viên. **P3-A/P3-B đạt phạm vi đã được phép**; T31/T32/T33 đã đóng sau một lượt cuối với nợ tài liệu. Goal tổng chưa tự đánh hoàn thành: ví thật/giáo viên còn thiếu bằng chứng, Phase4 cần người dùng duyệt. Tin **“duyệt phase 2”** đã được ghi đúng [nguyên văn/giờ log](../ideas/DECISION.md), không hỏi lại.

## Đối chiếu từng yêu cầu

| Yêu cầu Prompt03 | Bằng chứng | Kết luận và giới hạn |
| --- | --- | --- |
| 0.1 Nhắc15phút đúng chat | [Config hiện hành](../evidence/phase3/automation-state-2026-11-18.json), heartbeat17:32:40.755UTC+7 lịch sử | Automation có thật, hiện PAUSED; không suy ACTIVE từ lịch sử |
| 0.2–4 Đồng bộ, luật, Thẻ nhớ ngắn | [AGENTS](../../AGENTS.md), [HANDOFF](../HANDOFF.md), [lịch sử bàn giao](../archive/HANDOFF-history-codex.md), [STOP-CAUSES](../STOP-CAUSES.md) | Làm trên work; fetch trước review, giữ lịch sử; không merge PR. K9 bổ sung skip marker cho cả commit merge và job guards |
| 1 Xử lý nhận xét bài A | [Cross-scores](../ideas/cross-scores-codex.md) | Bỏ nhãn ĐẠT cũ, sửa phép tính, đánh giá evidence/account/dependency/threat model; giữ file A |
| 2.1 RUBRIC v1.2 | [RUBRIC](../ideas/RUBRIC.md), [kiểm số liệu](../evidence/phase3/goal-audit-2026-11-18.json) | Codex chấm bằng chứng, A trợ lý, giáo viên chấm qua PR; weights/floors khớp v1.1 tại 3bb7003 |
| 2.2/2.5 Ít nhất ba bài ĐẠT PLAN | [C01](../ideas/codex/01-receipt-rail.md), [C02](../ideas/codex/02-cluster-proof.md), [C03](../ideas/codex/03-netpay-check.md) | 79/79/77, mỗi bài có user/workflow, nguồn/ngày, alternatives, account/instruction, dependencies, threat model, demo, kill criteria và điểm từng vòng. ĐẠT theo Codex, chưa giáo viên/DELIVERY |
| 2.3 Dùng trợ lý/kết quả | [Lượt cuối7857e9b](../evidence/phase2/receiptrail-final-pass-2026-11-18.json), [queue](../tasks/A-queue.md), [nợ D01–D03](../DOCUMENTATION-DEBT.md) | Nhận phần đạt, đóng T31/T32/T33 đúng một lượt cuối; không mở vòng/task sửa bổ sung |
| 2.4 Chấm lại ba ứng viên A | Cross-scores và snapshot 3a6359b | Tính lại 42/40/37; cả ba dưới sàn, có lý do không chọn/giữ vấn đề/bỏ. Ba file nguồn khớp snapshot |
| 3.1 SHORTLIST và lịch sử thay bản A | [SHORTLIST](../ideas/SHORTLIST.md) | Có một câu, điểm, evidence, rủi ro mỗi bài; bổ sung dòng bản A bị thay vì thiếu evidence/F4/phép tính; giữ r0/r1/r2 |
| 3.2 PR work→main, không merge | [PR7](https://github.com/ntbaoheyhey/dev3pack-hackathon/pull/7) | Cập nhật/read-back body sau checkpoint P3-B; giữ open/unmerged, snapshots cũ là lịch sử |
| 3.3 Chọn chính/phụ và quyền cài | [DECISION](../ideas/DECISION.md), STOP-CAUSES K6 | Payload cũ bị người dùng đính chính đã vô hiệu. Hiện ReceiptRail chính, ClusterProof phụ; giữ bộ đã cài. Không dùng prompt cũ để mở rộng quyền |
| 3.4 Chuẩn bị độc lập khi chờ | [Note022](../learning/022-phase2-3-independent-prep.md), [PHASE3-PLAN](../PHASE3-PLAN.md) | Runner cache/offline và phương án đã chuẩn bị trước quyền; CI/deploy chỉ thực thi sau quyền riêng |
| 4 Phase1–2/spike sớm | [IDEA](../IDEA.md), [ARCHITECTURE](../ARCHITECTURE.md), [note023](../learning/023-receiptrail-phase2-spike.md), [evidence Phase2](../evidence/phase2/README.md) | Thiết kế đủ account/PDA/instructions/state/test/demo165s,19runtime bytecode thật; người dùng đã duyệt, A đóng với nợ, giáo viên chưa verdict |
| 4 Phase3 có điều kiện | [Local pipeline](../evidence/phase3/offline-pipeline-metadata.json), [CI](../evidence/phase3/ci-passed-27cf7ac.json), [P3-B](../evidence/phase3/README.md), [HTTP](../evidence/phase3/existing-web-http-2026-11-18.json) | Local25runtime+8client; Linux57tests/run; hello137tx finalized/counter1/debit0.651874801SOL; web cũ200, ví thật chưa kiểm |
| 5 Điểm dừng cuối | [NEXT](../NEXT.md), [ROADMAP](../ROADMAP.md), [DEVLOG](../DEVLOG.md), [HANDOFF](../HANDOFF.md) | P3-B xong để trình Phase4 theo yêu cầu mới; không mở Phase4 hoặc tự đánh mọi cổng goal đạt |

## Điểm và bằng chứng đã kiểm

| Bài | Vector P/S/N/F/R/D/V | Tổng | Bằng chứng quyết định và giới hạn |
| --- | --- | ---: | --- |
| C01 r2 | 4/4/4/4/4/4/3 | 79 | 19 runtime tests Anchor bytecode thật; chỉ F3→4 từ r1. Hai nguồn pain khác hệ sinh thái hỗ trợ workflow, chưa pilot; native SOL/cùng invoice, chưa browser/RPC recovery |
| C02 r1 | 4/4/4/4/4/4/3 | 79 | Capture devnet đọc 747 ms và năm mutations; không chứng minh ABI/source hoặc lợi ích market |
| C03 r1 | 4/4/3/4/4/4/3 | 77 | Raw mint/epoch và quote fee-only 283 ms, năm script hashes khớp; chưa settlement, overlap SDK/Ryntra nên N3 |
| A01/A02/A03 | Xem cross-scores | 42/40/37 | Chấm phần thực sự có, không biến thiếu evidence thành kết luận thị trường không cần |

[Audit JSON](../evidence/phase3/goal-audit-2026-11-18.json) lưu phép tính/sàn, ba snapshot A, năm hash scripts và log 16 tests Phase1. [Catalog Phase1](../evidence/phase1/README.md) và từng bảng điểm trỏ nguồn cụ thể. R/D4 là chất lượng PLAN, không chứng nhận audit/demo thật. Kiểm số học và links không thay chất lượng nguồn hoặc user validation; nguồn lịch sử không được gọi là crawl mới trong lượt này.

## Cổng cần người dùng và giới hạn còn lại

Người dùng yêu cầu kết thúc P3-B rồi trình duyệt Phase4. Phạm vi tiếp theo được trình tại [NEXT](../NEXT.md); chưa có câu đồng ý mở Phase4. Ví extension thật vẫn chưa kiểm theo lựa chọn người dùng; CLI hello không thay connect/disconnect. Giáo viên chưa có verdict SHORTLIST/kiến trúc; không tự chấm thay hoặc lấy duyệt người dùng làm verdict đó.

T31/T32/T33 đã đóng theo một lượt cuối7857e9b, nhận phần đúng và chuyển thiếu sót thành D01–D03. Không tiếp tục vòng review hoặc dùng khoản nợ chặn P3-B; không sửa report A. Các snapshots28bản trước vẫn là lịch sử đúng revision; không sửa chúng để khớp report mới.

P3-A/P3-B dùng quyền riêng trong DECISION. P3-B có đầy đủ finalized/fees/accounts evidence; không gửi thêm hello hoặc tạo buffer mới. Bytecode macOS khớp chain, Linux khác macOS; chưa verified source build. Giữ web/toolchain/thiết kế ClusterProof dự phòng. Không tự cài thêm, deploy ReceiptRail, public/update web hoặc mergePR7.
