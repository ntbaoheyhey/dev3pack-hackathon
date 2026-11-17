# Hàng đợi việc của Antigravity (A)

**Chủ file: Codex (C).** Chỉ C thêm hoặc sửa việc ở đây. A đọc file này mỗi lần tự nhắc, làm việc `mới` đầu tiên, rồi ghi kết quả vào `docs/tasks/A-done.md` (chủ file: A). A không sửa file này.

Mỗi việc ghi: mã, mục tiêu, cần học/thu thập gì, file kết quả, thế nào là xong. Trạng thái: `mới`, `bỏ`. (Trạng thái "đang làm/xong" A ghi ở A-done.md.)

| Mã | Trạng thái | Việc | File kết quả | Xong khi |
| --- | --- | --- | --- | --- |
| T1 | mới | Sửa note 017, 018, 020 theo findings A01–A06 (`docs/reviews/A-codex.md`) và C01–C04 (`docs/reviews/C-codex.md`): đúng template, mỗi nhận định có link và ngày đọc | 017, 018, 020 | Mỗi finding có dòng "đã xử lý: …" trong A-done.md |
| T2 | mới | Crawl danh sách dự án thắng và honorable mention của Colosseum (Frontier 2026, Cypherpunk 2025, Breakout 2025, Radar 2024) và các hackathon Solana khác tìm được: tên, one-liner, nhóm/track, link profile, link repo, link video | `docs/data/hackathon-projects.md` | Mỗi dòng có link nguồn; ghi rõ trang nào bị chặn |
| T3 | mới | Crawl bằng chứng nỗi đau người dùng (trích dẫn ngắn + link + ngày) cho các vấn đề Codex liệt kê trong mục "Cần bằng chứng" bên dưới; nếu mục đó trống, crawl theo note 020 cho Việt Nam/Đông Nam Á | `docs/data/user-pain-evidence.md` | Mỗi vấn đề ít nhất 3 nguồn độc lập, ghi rõ nguồn nào yếu |

## Việc bổ sung của trưởng nhóm (17/11/2026)

| Mã | Trạng thái | Việc | File kết quả | Xong khi |
| --- | --- | --- | --- | --- |
| T4 | mới | So sánh cụ thể ba nhóm C01/C02/C03 ở dưới; ưu tiên tìm đối thủ đã giải đúng flow, ghi negative evidence và giới hạn docs | `docs/data/candidate-alternatives.md` | Mỗi nhóm >=3 lựa chọn, URL/ngày/flow, không suy thiếu tính năng từ việc không tìm thấy |
| T5 | mới | Chuẩn bị Phase 2/5: template web Solana chính thức, mẫu UI dự án thắng, onboarding người mới; chỉ crawl/đề xuất, chưa cài hoặc build | `docs/data/phase2-ux-prep.md` | >=2 template có repo/version/license nếu đọc được; 3 flow và reject/retry/cluster; không tạo tài khoản hay ví |

## Cần bằng chứng (C cập nhật)

Ưu tiên T3: **C01 — ReceiptRail** (tên làm việc): merchant/API bị retry thanh toán, timeout sau settlement, đối soát theo business operation ID. Cần nguồn trực tiếp từ maintainer/user; phân biệt replay cùng tx với hai tx mới trả cùng invoice. So Solana Pay reference, x402 V2 payment identifier/recovery và checkout tập trung. Nếu upstream đã giải đúng flow thì ghi rõ để C bỏ/thu hẹp, không chỉ gom bằng chứng thuận.

**C02 — ClusterProof**: builder tích hợp SDK/IDL nhưng deployment devnet khác version hoặc program không đúng cluster; cần ít nhất hai nguồn độc lập có case/README cụ thể. So Anchor IDL/address, Solana Explorer/CLI và công cụ verified build; tìm phần đã làm tốt để tránh lặp.

**C03 — NetPay Check**: người gửi/nhận token có TransferFee hiểu nhầm gross/net, thay fee theo epoch, Token-2022 extension khiến thanh toán không đúng số nhận. Cần issue/guide trực tiếp, không suy mọi token có phí. So wallet preview, Explorer, SDK calculate fee và checkout.

Mỗi nguồn: URL cụ thể, ngày đọc, tác giả/đơn vị, claim hỗ trợ, trích ngắn, nguồn độc lập hay cùng upstream, giới hạn. Không cần liên hệ người ngoài hoặc đăng nhập; không tạo giao dịch. C đang kiểm primitive/threat model và chấm, không chờ kết quả.
