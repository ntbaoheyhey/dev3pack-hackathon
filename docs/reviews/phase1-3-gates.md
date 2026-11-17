# Hồ sơ review Phase 1–3 — ReceiptRail

18/11/2026 · **bản Phase2 đã soạn xong để trình, chưa qua cổng duyệt**. Lựa chọn **“ReceiptRail chính, ClusterProof phụ” lúc00:07 UTC+7**, [DECISION](../ideas/DECISION.md). Các kết luận lựa chọn/duyệt/quyền cũ **sai/hết hiệu lực**, giữ lịch sử có nhãn trong Git/archive.

| Yêu cầu | Bằng chứng hiện hành | Trạng thái |
| --- | --- | --- |
| Nhắc15phút đúng chat | Automation action view/config ACTIVE15phút kiểm lúc05:19, đúng thread; record scheduler 2026-11-17T22:10:02.670Z | Đã nhận heartbeat lúc05:10:02.670 ngày18/11 UTC+7; không suy mọi lượt gửi đều thành công |
| RUBRIC/3 ứng viên đạt | C01r2=79/F4, C02r1=79, C03r1=77; giữ lịch sử r0/r1 | PLAN theo Codex, chưa giáo viên chấm/DELIVERY |
| Quyết định/nguyên văn/giờ/nguồn | DECISION, AGENTS, STOP-CAUSES K6; DEVLOG cũ đã gắn nhãn sai | Đã sửa, không suy quyền |
| ClusterProof dự phòng | IDEA/ARCHITECTURE-clusterproof-draft | Dự phòng, chưa duyệt; source/web/lab/toolchain giữ nguyên |
| IDEA/ARCHITECTURE ReceiptRail | Account/PDA/instructions/states/errors/events,IDL,wireframe/threat model/test plan/demo165s | Đã viết để trình; chưa duyệt |
| Spike local | [19tests r2](../evidence/phase2/receiptrail-spike-r2.txt),[metadata/IDL](../evidence/phase2/receiptrail-build-metadata.json) | Anchor bytecode thật chạy LiteSVM; F4 D2, không browser/RPC/devnet |
| Tự review C | [Phạm vi và giới hạn](receiptrail-codex.md) | Đã đọc source/test/IDL, không thấy blocker trong phạm vi; không phải independent audit |
| Giao A | [Queue](../tasks/A-queue.md); pull7ae2643, review T15/0ec4e94 tại [review C](receiptrail-codex.md) | Chưa nhận đạt: T15 có3 alternatives nhưng0 URL, không có2 pain sources; T13/T17 còn findings. Thứ tự T18 review → T19 UX → T20 evidence; hai việc đầu đã giao, không chờ cấp lại |
| Review chéo | [Report T13](receiptrail-antigravity.md) tại c591fc9; có verdict sơ bộ | Chưa nhận đạt: nonce/race chưa có căn cứ, thiếu ma trận phạm vi, rollback/scope chưa rõ. C đã trả lời bằng source/assertion/log; giao T18, không tự đóng cổng |
| Giáo viên | Chấm SHORTLIST/kiến trúc | Chưa có verdict; không tự đánh đạt |
| Người dùng | Duyệt IDEA và giải thích ARCHITECTURE một trang | Đang trình, chưa có câu đồng ý; không mở Phase3 |
| Phase3/vận hành | Hello/client/web logs cũ giữ nguyên; CI/devnet còn mở | Không cài thêm/tạo ví-keypair triển khai/deploy/public mới trước câu đồng ý riêng |
| PR7 | Body ReceiptRail đã cập nhật T15/T20, fetch đọc lại khớp/open/merged=false/head7ae2643 trước checkpoint review | Open, merged=false; không merge; commit review/bàn giao nối tiếp |

**Đề nghị duyệt cụ thể:** native SOL, một payer/merchant trên mỗi invoice; create/pay/cancel/read; Open→Paid/Cancelled và Expired hiển thị; không close/reset/refund/stablecoin/x402. Cùng invoice chỉ chuyển principal1lần, vẫn có phí fail và rent lâu dài. Spike local là evidence phần lõi, UI/RPC recovery/devnet/CI/video chưa có.

Theo ROADMAP, Phase2 cần review chéo, giáo viên chấm và người dùng đồng ý. Theo yêu cầu hiện hành, hoàn tất artifact rồi trình duyệt và dừng công việc phụ thuộc ý tưởng. Không suy việc push hoặc lựa chọn ReceiptRail thành bất kỳ cổng nào đã được duyệt.
