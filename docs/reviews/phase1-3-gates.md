# Hồ sơ review Phase 1–3 — ReceiptRail

18/11/2026 · **người dùng đã duyệt Phase2; review chéo/giáo viên còn mở**. [DECISION](../ideas/DECISION.md) giữ lựa chọn “ReceiptRail chính, ClusterProof phụ” lúc00:07 UTC+7, lời duyệt và nguồn kết luận sai cũ.

| Yêu cầu | Bằng chứng hiện hành | Trạng thái |
| --- | --- | --- |
| Nhắc15phút đúng chat | Action/config ACTIVE kiểm14:42; heartbeat thực nhận16:17:09.954 UTC+7 ngày18/11 | Đang bật; không suy mọi lượt scheduler đều gửi thành công |
| RUBRIC/3 ứng viên đạt | C01r2=79/F4, C02r1=79, C03r1=77; giữ lịch sử r0/r1 | PLAN theo Codex, chưa giáo viên chấm/DELIVERY; [audit từng yêu cầu](prompt03-audit.md) và [kiểm số liệu](../evidence/phase3/goal-audit-2026-11-18.json) đã có |
| Quyết định/nguyên văn/giờ/nguồn | DECISION, AGENTS, STOP-CAUSES K6 | Đã đính chính và ghi lời duyệt mới, không suy quyền |
| ClusterProof dự phòng | IDEA/ARCHITECTURE-clusterproof-draft | Dự phòng, chưa duyệt; source/web/lab/toolchain giữ nguyên |
| IDEA/ARCHITECTURE ReceiptRail | Account/PDA/instructions/states/errors/events,IDL,wireframe/threat model/test plan/demo165s | Người dùng đã duyệt Phase2 |
| Spike local | [19tests r2](../evidence/phase2/receiptrail-spike-r2.txt),[metadata/IDL](../evidence/phase2/receiptrail-build-metadata.json) | Anchor bytecode thật chạy LiteSVM; F4 D2, không browser/RPC/devnet |
| Tự review C | [Phạm vi và giới hạn](receiptrail-codex.md) | Đã đọc source/test/IDL, không thấy blocker trong phạm vi; không phải independent audit |
| Giao A | [Queue](../tasks/A-queue.md), [review580b903](receiptrail-codex.md#review-580b903--18112026)/[snapshot](../evidence/phase2/receiptrail-supplement-580b903-review.json) | Bản580b903: nhận SystemAccount/giới hạn commitment; T32 vẫn2log sai và mất signature khác/canonical bump. T33 lại bỏ phí/Terms/no-auto-retry/reload, state/vai/form/bố cục/demo/SDK chưa đạt. T31 giữ Unknown/expiry nhưng provenance/state/context/phản hồi thiếu.9findings mở; T31→T32→T33 cùng ID. HANDOFF A ghi xong không là C nhận đạt hoặc process live |
| Review chéo | T32/580b903, source/runtime/log r2 và snapshot cùng revision | Nhận SystemAccount/merchant không ký pay/giới hạn commitment;1/3log đúng, data-empty/assertions/phí/ma trận/phản hồi chưa đủ. T32 sửa sauT31,trướcT33,cùng ID; chưa nhận đạt |
| Giáo viên | Chấm SHORTLIST/kiến trúc | Chưa có verdict; không tự đánh đạt |
| Người dùng | Nguyên văn “duyệt phase 2”, [record](../evidence/phase2/user-approval-2026-11-18.json) | Giờ log09:27:18.464 ngày18/11 UTC+7, người dùng không tự nêu giờ quyết định; không hỏi lại |
| Phase3/vận hành | [Pipeline offline](../evidence/phase3/offline-pipeline-metadata.json), [CI27cf7ac](../evidence/phase3/ci-passed-27cf7ac.json), [P3-A/P3-B](../PHASE3-PLAN.md) | 25runtime+8client local đạt; Linux PR44237534047/push44237529539 đều đạt3jobs/57tests+build/ReceiptRail IDL cmp. P3-A đạt, P3-B có quyền nhưng funding để sau; chưa hello deploy/ví thật, chưa đóng Phase3 |
| PR7 | [Snapshot16:19:09 UTC+7](../evidence/phase3/pr7-review-1547-snapshot.json): head64e9393/work→main/open/merged=false | Body khớp checkpoint8b412df/T32-3083ce4/T33-509adac; report580b903 vừa tới cần cập nhật riêng. Comments/reviews rỗng. Không lấy HEAD tài liệu thay revision CI; không merge |

**Phạm vi đã được người dùng duyệt:** native SOL, một payer/merchant trên mỗi invoice; create/pay/cancel/read; Open→Paid/Cancelled và Expired hiển thị; không close/reset/refund/stablecoin/x402. Cùng invoice chỉ chuyển principal1lần, vẫn có phí fail và rent lâu dài. Spike và Linux tests là evidence phần lõi; UI/RPC recovery/devnet/video chưa có. CI27cf7ac có bằng chứng riêng; hashes Linux khác macOS, chưa chứng nhận reproducible build.

Theo ROADMAP, Phase2 cần review chéo, giáo viên chấm và người dùng đồng ý. Cổng người dùng có bằng chứng riêng, không suy hai cổng kia đã đạt. Tiếp tục review và chuẩn bị Phase3 trong quyền hiện có theo [NEXT](../NEXT.md).
