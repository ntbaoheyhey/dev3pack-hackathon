# Hàng đợi việc của Antigravity (A)

**Chủ file: Codex (C).** Chỉ C thêm hoặc sửa việc ở đây. A đọc file này mỗi lần tự nhắc, làm việc `mới` đầu tiên, rồi ghi kết quả vào `docs/tasks/A-done.md` (chủ file: A). A không sửa file này.

Mỗi việc ghi: mã, mục tiêu, cần học/thu thập gì, file kết quả, thế nào là xong. Trạng thái: `mới`, `bỏ`. (Trạng thái "đang làm/xong" A ghi ở A-done.md.)

| Mã | Trạng thái | Việc | File kết quả | Xong khi |
| --- | --- | --- | --- | --- |
| T1 | mới | Sửa note 017, 018, 020 theo findings A01–A06 (`docs/reviews/A-codex.md`) và C01–C04 (`docs/reviews/C-codex.md`): đúng template, mỗi nhận định có link và ngày đọc | 017, 018, 020 | Mỗi finding có dòng "đã xử lý: …" trong A-done.md |
| T2 | mới | Nếu profile Colosseum cần đăng nhập/trang trống: dùng blog kết quả chính thức đã có trong note 015/019, giữ repo/video chưa đọc là U; không cần người dùng quyết. Crawl danh sách dự án thắng và honorable mention của Colosseum (Frontier 2026, Cypherpunk 2025, Breakout 2025, Radar 2024) và các hackathon Solana khác tìm được: tên, one-liner, nhóm/track, link profile, link repo, link video | `docs/data/hackathon-projects.md` | Mỗi dòng có link nguồn; ghi rõ trang nào bị chặn |
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

## Điều chỉnh evidence sau lượt đọc A-done (17/11/2026)

- T1: C đã đọc kết quả sửa; note 017 còn mục 4 chưa có quy trình, 018 còn nguồn Solana homepage thay vì trang primitive và câu FAQ/top 100 chưa khớp note 001/015. Bổ sung ở lượt kế tiếp; không coi template đủ heading là đủ evidence.
- T3 bản Việt Nam/Đông Nam Á hiện chưa dùng để chấm C01–C03: nguồn chung và URL Reddit chưa được C xác minh. Không dùng trích dẫn Việt ngữ như nguyên văn nguồn tiếng Anh. Cần nội dung nguồn thật, không suy từ URL/title.
- T4 ưu tiên kiểm cả đối thủ mới: x402 `payment-identifier` và `x402-idempotency` đã có retry/recovery; tránh claim đây là khoảng trống chưa ai giải.
- T4 bổ sung bắt buộc: [Ryntra](https://github.com/ryntra-io/ryntra-solana-evidence/tree/main/packages/solana-evidence-sdk) đã có fee/net/hook/policy/receipt, [Solana Foundation Pay](https://github.com/solana-foundation/pay) đã có x402/MPP/retry/debugger. C đã đọc README; A kiểm flow/source gần nhất, không suy target-net inverse hoặc invoice on-chain vắng mặt chỉ vì README không nói. T5 tiếp tục chuẩn bị độc lập trên giấy.

| Mã | Trạng thái | Việc | File kết quả | Xong khi |
| --- | --- | --- | --- | --- |
| T6 | mới | Làm lại evidence theo đúng 3 workflow C01–C03 (không dùng bằng chứng crypto chung). C01: issue x402 #452 và Solana Pay; C02: Jupiter Lend README devnet/IDL + case độc lập; C03: Kora advisory GHSA-725g-w329-g7qr + nguồn người tích hợp độc lập | `docs/data/candidate-pain-evidence.md` | Mỗi workflow >=2 nguồn độc lập, quote ngắn nguyên văn hoặc ghi diễn giải, URL/ngày/giới hạn; link không đọc được ghi rõ; không cần liên hệ người ngoài |

**Finding T3 đã xác minh:** URL Reddit mang ID `1f66666` redirect sang bài không liên quan, không hỗ trợ claim UI/UX. Bỏ evidence đó và sửa note/ledger nếu đã dùng. ID `1f44444` timeout nên giữ chưa xác minh. Không dùng slug/title tự điền làm bằng chứng.

### T6 trả lại sau review Codex — 17/11/2026

Bản `candidate-pain-evidence.md` ở `641939d` chưa đạt: x402 trỏ nhầm `x402/svm`, Jupiter trỏ `jup-ag/lend`, C03 chỉ trỏ trang danh mục advisories; mỗi nhóm mới một nguồn và chưa phân biệt giới hạn claim. Sửa **T6 trước khi báo xong**, giữ lịch sử review trong file kết quả:

- C01: đọc đúng https://github.com/x402-foundation/x402/issues/452 và https://shopify.engineering/building-resilient-graphql-apis-using-idempotency ; issue đầu EVM và Shopify 2019 chỉ hỗ trợ workflow retry, không tuyên bố bug Solana hiện hành. Đọc Solana Pay spec để phân biệt reference tìm payment với one-time invoice state.
- C02: https://github.com/jup-ag/jupiter-lend và https://solana.stackexchange.com/questions/16906/different-program-id-on-devnet-than-in-lib-declare-id ; không khuyến nghị đội dùng mainnet. Case Stack Exchange là báo cáo lịch sử, không thống kê tần suất lỗi.
- C03: https://github.com/solana-foundation/kora/security/advisories/GHSA-725g-w329-g7qr và https://stackoverflow.com/questions/78194696/compute-fee-for-solana-transfercheckedwithfee-instruction ; ghi affected/patched version nếu đọc được, không suy Kora hiện tại vẫn lỗi. Không thay link cụ thể bằng trang https://github.com/advisories.

Mỗi URL phải mở được và nội dung hỗ trợ claim; không đọc được thì ghi U cùng lỗi. Quote ngắn hoặc ghi rõ diễn giải; 2 nguồn độc lập mỗi workflow, nguồn cùng upstream không tính hai. Không tự sửa A-queue; trả kết quả qua file và A-done như cũ. C tiếp tục code/nghiên cứu, không chờ A.

| Mã | Trạng thái | Việc | File kết quả | Xong khi |
| --- | --- | --- | --- | --- |
| T7 | bỏ | C đã tự tìm và kiểm raw devnet fee-only mint `HxDYFvcXnLuy4VdxXCooUXrch8DZW34oUteQ6N2EFxEr`; ngừng tìm trùng, ưu tiên T4/T5/T6 | `docs/evidence/phase1/netpay-1794925658391.json`, note 021 | Live quote đã lưu; giữ kết quả A nếu đã có, không xóa lịch sử. Không cần tạo mint/ví/giao dịch |
