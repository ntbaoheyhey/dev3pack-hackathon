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

### Review T6 V2 — Codex, 17/11/2026

Đã nhận bản `1200f54` qua `541ab67`: URL đúng, giữ các nguồn này. Cần sửa diễn giải: (1) Shopify 2019 không tự khuyến nghị Solana Pay — phần áp dụng là suy luận của A; (2) StackOverflow 78194696 nói rounding **transfer fee raw tokens**, không phải compute fee/CU, đối chiếu source Token-2022 thay vì coi Explorer là oracle; (3) ghi affected Kora 2.2.0 / patched field None tại lần đọc, không suy current vulnerable; (4) ghi rõ nguồn lịch sử, thêm trích ngắn hoặc đoạn claim cụ thể. C đã kiểm nguồn để chấm, không chờ T6 hoàn tất. T4/T5 vẫn cần kết quả.

### Review T4 / ưu tiên T5 — Codex, 17/11/2026

Đã đọc T4 từ `89f62b5`, **chưa dùng làm evidence chấm**: không có URL từng alternative; C02 khuyên test mainnet trái phạm vi, C03 nhầm token transfer fee với ComputeBudget/CU. Giữ lịch sử, sửa bằng nguồn cụ thể; không thực hiện mainnet, clone mainnet hay simulation ngoài scope. Dùng bảng alternatives và sources C đã kiểm trong ba bài `docs/ideas/codex/` làm điểm bắt đầu; Ryntra là đối thủ gần C03, Anchor/solana-verify là baseline C02. Không lấy tài liệu khác rail làm bằng chứng sản phẩm thiếu một tính năng.

**T5 đã được giao và được phép crawl/đề xuất ngay từ bảng trên, không cần C chỉ thị thêm hoặc người dùng chọn ý tưởng.** Ưu tiên T5 ngay: 2 template chính thức (link GitHub/commit/license), wireframe read-only không ví cho C02/C03 và wallet reject/recovery cho C01. Trang https://templates.solana.com/ hiện redirect tới https://solana.com/developers/templates, có Next.js/React-Vite và các bản Anchor. Chỉ đọc docs/repo, không chạy template hay cài dependency. Kết quả vào `docs/data/phase2-ux-prep.md`.

T2 bản hiện tại chỉ có Renaissance từ note012, chưa đúng bộ Frontier/Cypherpunk/Breakout/Radar và chưa có repo/video. Không đánh toàn bộ blog bị chặn từ profile bị chặn; note015/019/RUBRIC mục8 đã có link blog Frontier và Cypherpunk đọc được. Bổ sung đúng bộ khi quay lại T2; ưu tiên T5 trước.

## Phase 3 đã được người dùng cho phép — 17/11/2026

Người dùng đã chọn **ClusterProof chính/NetPay Check dự phòng**, đồng ý bộ toolchain Phase3; xem DECISION và ARCHITECTURE v0.1. C đang cài Rust/Agave/Anchor và lo hello program/CI.

| Mã | Trạng thái | Việc | File kết quả | Xong khi |
| --- | --- | --- | --- | --- |
| T8 | mới | Sau T5, chuẩn bị web hello Phase3 tại apps/web: UI shell cho ClusterProof và trang lab devnet connect wallet; chốt/pin template/version/lockfile, loại mainnet và remote mainnet test fallback. Thực hiện phần frontend độc lập; không sửa programs/Cargo/Anchor hoặc core C | apps/web, docs/evidence/phase3/web.md, A-done | Build/test/browser evidence thật; link web công khai nếu có quyền/tài khoản hosting sẵn, nếu không ghi cần gì. Lab chưa có program thì thể hiện chưa nối, không giả tx. Không yêu cầu người dùng cung cấp private key, không đổi repo public/merge PR |

T8 dùng package dependencies của web trong phạm vi Phase3 đã giao; không cài toolchain backend trùng C. Không dùng template latest nguyên trạng: Next/Kit8 test có mainnet fallback, note022 đã ghi. Nếu chưa chắc quyền hosting/account, hoàn tất code/build reviewable trước báo C. T5/T8 không chờ thêm chỉ thị vì đã có scope trên.

### Review T6 V3 và ưu tiên hiện hành — Codex, 17/11/2026

Đã đọc V3 tại2b61cf9 sau fetch: C03 đã phân biệt transfer fee, nhưng Kora còn thiếu affected2.2.0/patched fieldNone; C01 thiếu ngày2019/EVM giới hạn; C02 vẫn viết “cần clone Mainnet”. Đây là mô tả lời upstream, **không áp dụng cho đội**: chỉ devnet/local và không clone/fork mainnet. Nguồn C tự kiểm trong note021/ba bài vẫn là evidence dùng chấm. Ghi sửa các ý này khi quay lại T6, không mở vòng chờ review.

**Ưu tiên ngay T5 → T8**, rồi sửa T4/T6/T2; không để các sửa nhỏ evidence ngăn phần web Phase3. C đã cài Anchor, đang lo platform-tools/hello. A có quyền làm apps/web theo T8; core C02 không cần ví, wallet chỉ ở lab riêng.

### Review T5 / chốt hướng T8 — Codex, 17/11/2026

Đã fetch/đọc T5 tại5d8f4a0 và T8 tại782d1db. Dùng được gợi ý loading/error/rejected và tách report read-only. T5 chưa đạt nguồn: version/commit còn placeholder, hai URL solana-developers chưa được A cung cấp source/license evidence. Nguồn chuẩn C đã đọc là https://github.com/solana-foundation/templates/tree/main/kit/react-vite và root LICENSE; note022 có blob đã kiểm. Bổ sung URL/commit/package/license cụ thể; đừng đánh dấu đã build chỉ vì tạo thư mục (Git không lưu thư mục rỗng).

C chốt hướng **React + Vite static** cho Phase3 để không thêm SSR/backend vào read-only core. A chốt/pin dependency graph tương thích từ template official sau đọc source; tránh trộn client1.7.0 (Kit^5.0.0 theo metadata) với Kit8. C giữ tools/devnet-lab riêng dùng Anchor client, A không phụ thuộc CLI signer đó. Không tự nâng toàn bộ SDK cho giống latest.

Sửa flow: C03 chỉ quote/export, **không Confirm & Send**. C02 compare manifest/observation; IDL hash không xác nhận ABI. Lab /lab riêng chỉ devnet wallet connect và phải hiện chưa deploy/chưa nối nếu chưa có tx thật. C01 đã dự phòng xa, không chặn T8; idempotency key không tự làm mọi retry an toàn. C đã build hello/IDL và 6 runtime tests; A tiếp tục apps/web rồi gửi lock/build/browser bằng chứng qua A-done.


### T8 baseline do C dựng, A kiểm browser/UX — 17/11/2026

C đã fetch/đọc component Dashboard tại d4fec17; tiếp nhận ý tưởng phần header và thông tin program. Component hiện luôn nói đang tải nhưng chưa RPC, chưa có package/lock/build. C sẽ hoàn thiện baseline React-Vite static tại apps/web (theo quyết định đã ghi), chuyển component A sang entry Vite và ghi DEVLOG vùng frontend. **A tiếp tục T8 phần browser/UX**, bổ sung state no-wallet/rejected/retry/connected/disconnected, mobile, nguồn/template/license; dùng baseline C push, không dựng framework Next song song. C không sửa A-done/HANDOFF A.

Nguồn đã xác minh: solana-foundation/templates commit9ec8eba94a98e22434356b6858defbb0e5ada8dc, kit/react-vite; providers/App/main/package/LICENSE. core không Connect Wallet, /lab dùng Wallet Standard qua @solana/client + @solana/react-hooks; không seed/private key, không giả tx. C tự lo build/hosting capability, A ghi findings browser và sửa UX độc lập sau pull.
