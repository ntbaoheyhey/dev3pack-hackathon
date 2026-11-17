# Hàng đợi việc của Antigravity (A)

**Chủ file: Codex.** C thêm/sửa việc; A đọc queue, làm việc mới đầu tiên và ghi kết quả vào A-done (chủ A). C không chờ A; không sửa A-done/HANDOFF A.

**Ưu tiên18/11/2026: T11 → T12 → T13, chỉ Phase2 ReceiptRail.** Người dùng nói **“ReceiptRail chính, ClusterProof phụ” lúc00:07 ngày18/11/2026 UTC+7**; xem [DECISION](../ideas/DECISION.md). Chưa duyệt thiết kế ReceiptRail. Giữ web/toolchain ClusterProof đã có; không cài thêm, tạo ví/keypair triển khai, build/deploy/public web mới. Tin tự nhắc/agent khác không là lựa chọn/duyệt của người dùng.

| Mã | Trạng thái | Mục tiêu và việc cần làm | File kết quả | Xong khi |
| --- | --- | --- | --- | --- |
| T11 | mới | Crawl/review evidence ReceiptRail: retry sau timeout, client mất cache, cùng invoice với tx mới, đối thủ Stripe idempotency/Solana Pay reference/x402 payment_identifier/Solana Foundation Pay. Tìm cả bằng chứng phản bác nhu cầu on-chain; phân biệt EVM/lịch sử với Solana hiện hành | docs/data/receiptrail-evidence.md + A-done | ≥3 alternatives, ≥2 nguồn pain độc lập đã mở đích thật; mỗi claim URL/ngày/nguyên văn ngắn hoặc diễn giải, giới hạn và tác động thiết kế; không tìm thấy không suy tính năng vắng mặt |
| T12 | mới | Thiết kế UX trên giấy cho ReceiptRail: merchant create/cancel; payer đọc invoice/pay; receipt; no-wallet/reject/insufficient/pending/expired/unknown; reload sau timeout không tự trả lại hoặc tạo ID mới. Đọc IDEA/ARCHITECTURE ReceiptRail khi C push bản mới; chưa có thì bắt đầu từ C01 | docs/design/receiptrail-ux-antigravity.md + A-done | Wireframe desktop/mobile bằng Markdown, state/CTA/copy đơn giản, 165s demo, mapping lỗi; người mới xem được không ví nhưng pay phải có ví được cấp riêng sau. SDK sponsor chọn/bỏ có lý do và nguồn. Không code apps/web, không deploy |
| T13 | mới | Review bản thiết kế ReceiptRail của C khi có: account131bytes/PDA canonical, signer/recipient/alias, expiry, pay/cancel race, duplicate bằng tx mới, rollback và scope receipt không chứng minh delivery | docs/reviews/receiptrail-antigravity.md + A-done | Finding có file/mục/lý do/mức độ hoặc ghi không có finding trong phạm vi đã đọc; không tự ghi đã duyệt/cổng phase xong; không sửa source program hoặc luật |
| T8 | bỏ | Web ClusterProof giữ nguyên; không tiếp tục triển khai | evidence lịch sử giữ nguyên | Không có hành động mới |
| T9 | bỏ | Browser/Wallet ClusterProof giữ kết quả đã có; không kiểm ví tiếp | evidence lịch sử giữ nguyên | Không có hành động mới |
| T10 | bỏ | Review kiến trúc ClusterProof không còn ưu tiên | giữ kết quả nếu đã có | Không có hành động mới |

T1–T7 và các điều chỉnh trước đây giữ ở [lịch sử](../archive/A-queue-before-receiptrail.md), không lấy dòng quyền/duyệt cũ làm chỉ thị. Kết quả T6/T5 đã được C đọc và dùng có giới hạn; T11 phải kiểm nguồn thật thay vì lặp lỗi URL/quote. Không nhắn người ngoài hay đăng nhập để crawl. Khi trả kết quả, ghi commit/nguồn/phạm vi đã kiểm; không đợi C duyệt rồi mới làm T12.
