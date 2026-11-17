# 019 — Nguồn ý tưởng trong hệ sinh thái Solana

> Codex · trước sự kiện · Phase 1/C. Mọi nguồn dưới đây được đọc hoặc thử truy cập **17/11/2026, Asia/Ho_Chi_Minh**. Đây là nghiên cứu tài liệu và metadata; chưa phỏng vấn user, chạy SDK, tạo ví hay gửi transaction. Số note đã được đặt chỗ trong mục lục trước khi viết.

## 1. Mục tiêu và điều cần nhớ

Tìm một **workflow có vấn đề được chứng minh**, rồi mới chọn primitive. RFS cho biết hệ sinh thái muốn gì; GitHub issue cho biết một tích hợp gặp gì; repo archive cho biết một nhánh code không còn được duy trì. Không nguồn nào tự chứng minh toàn bộ thị trường hoặc bảo đảm đội này làm xong.

Đọc cùng 015/016 và [RUBRIC v1](../ideas/RUBRIC.md). Chưa dùng ý tưởng của Antigravity; chỉ mở thư mục đó sau ba bài Codex tự chấm đạt.

## 2. Phiên bản và bằng chứng kiểm tra

| Nguồn | Snapshot / mốc | Điều thực sự đã kiểm |
| --- | --- | --- |
| Solana RFS | Trang hiện hành, 11 requests | Đọc nội dung được search index trả về; lần HTTP trực tiếp mới trả 429 |
| Foundation funding | Trang hiện hành | HTTP đọc được các loại grant và tiêu chí; bảng RFP Airtable timeout, chưa đọc từng RFP |
| Colosseum | Frontier 2026, Renaissance 2024; accelerator/Eternal hiện hành | Đọc kết quả và cơ chế chương trình; không tự nộp application |
| Superteam | Handbook/Build; bài 16/09/2026; bounty đã có kết quả | Đọc nguồn chính thức; không lấy bounty cũ làm bounty đang mở |
| P-Token | Upgrade page + SIMD-0266 | Đối chiếu trạng thái activation với thiết kế replacement; chưa kiểm feature qua RPC |
| Light | Website hiện hành; trang docs cũ | Website thông báo joining Helius; hai URL docs cũ trả 404; chưa xác nhận SDK/devnet hiện tại |
| x402 | Solana docs V2 + repo x402-foundation | Đã đọc headers, roles, verification và issue metadata; chưa chạy protocol |
| Samui / Facto | GitHub metadata, README hiện tại | Archive flag và giới hạn cụ thể bên dưới; không chạy hoặc fork làm bài thi |

## 3. Kiến thức chính

### 3.1. Bản đồ nguồn nhu cầu của hệ sinh thái

| Nguồn sơ cấp | Cách sử dụng | Điều không được suy |
| --- | --- | --- |
| [Solana Request for Startups](https://solana.com/request-for-startups) | 11 hướng gồm stablecoin utility, agent security, inference marketplace, markets, collectibles và distribution. Chọn một user/job nhỏ trong hướng lớn | Không phải đơn đặt hàng của khách hàng; không phải lời hứa grant hoặc track Dev3pack |
| [Foundation Grants and Funding](https://solana.org/grants-funding) | Phân biệt public-good grant, convertible grant và RFP; học cách đặt milestones, open contribution và ngân sách | Không mặc định sản phẩm thương mại được standard grant hoặc đã có nguồn vốn |
| [RFP directory được Foundation liên kết](https://airtable.com/apppDmK2Pin9WX8jV/shrR0uMKu4N57TGW7/tbli2ERM3sdhyHJYB) | Điểm bắt đầu để kiểm từng sponsor/problem/acceptance khi truy cập được | Lần đọc timeout: chưa có nội dung RFP, không tự điền danh sách từ trí nhớ |
| [Colosseum accelerator](https://colosseum.com/accelerator), [Eternal](https://colosseum.com/eternal) | Cho thấy hướng startup có sản phẩm, iteration và khả năng tiếp tục; giải hackathon và xét accelerator là các bước khác nhau | Winning không tự đảm bảo admission. Không áp điều kiện đầu tư hoặc lịch Colosseum vào Dev3pack |
| [Superteam Build handbook](https://docs.superteam.fun/the-superteam-handbook/products/superteam-build) | Kho định hướng RFP theo DeFi/NFT/DAO/payments; chuyển từng gợi ý thành giả thuyết user | UI [ideas](https://superteam.fun/build/ideas) chưa trả card cụ thể trong lượt đọc; không bịa nội dung card |
| [Superteam: What to Build in Solana DeFi, 16/09/2026](https://blog.superteam.fun/p/what-to-build-in-solana-defi-10-ideas) | Nguồn gợi ý từ founder/builder, nhấn mạnh bắt đầu bằng phạm vi nhỏ | Bài nói rõ quan điểm tác giả; số market/volume là bối cảnh, không phải adoption của ý tưởng đội |
| [Superteam narrative detection bounty](https://superteam.fun/earn/listing/develop-a-narrative-detection-and-idea-generation-tool) | Ví dụ request cụ thể: signal, giải thích, reproducibility và 3–5 đề xuất có nguồn | Listing đã có winners; không coi còn mở hoặc đúng đối tượng Dev3pack |
| [Solana Incubator](https://incubator.solanalabs.com/) | Kênh chương trình hỗ trợ khác, cần kiểm cohort/deadline riêng | Search hiện nhắc cohort bắt đầu tháng 3/2026; không nói đang nhận hồ sơ tháng 11 |

Đối với quỹ/accelerator, câu hỏi có ích là “họ ưu tiên loại evidence nào và hỗ trợ gì?”. Không suy một theme đang được đầu tư thành lý do người dùng phải chuyển sang sản phẩm mới.

### 3.2. Học từ bài thắng mà không sao chép

[Frontier results](https://blog.colosseum.com/announcing-the-winners-of-the-solana-frontier-hackathon/) cung cấp nhãn công khai; [Renaissance results](https://blog.colosseum.com/announcing-the-winners-of-the-solana-renaissance-hackathon/) còn nêu rõ honorable mentions không nhận giải. Dùng nhãn để chọn mẫu, rồi đọc profile/repo/demo riêng. Chi tiết năm mẫu và các giới hạn nằm ở RUBRIC mục 8.

Bài học **suy luận của Codex**, không phải lý do chính thức BTC cho điểm: một job hẹp có thể trình bày rõ hơn một “super app”; developer tool có thể lấy workflow làm demo; marketplace thật thường cần cả hai phía và hạ tầng bên ngoài. Không lấy website sau cuộc thi làm bằng chứng tại thời điểm thi. Không fork bài cũ rồi nộp như của mình.

### 3.3. Repo cũ: phân biệt ngừng duy trì, archive và thất bại thị trường

| Repo / evidence | Có thể kết luận | Không thể kết luận |
| --- | --- | --- |
| [samui-build/samui-wallet](https://github.com/samui-build/samui-wallet), README blob `dec12e0`; GitHub API `archived=true`, `pushed_at=2026-10-25T20:18:52Z` | README tác giả ghi đây là software hackathon thử nghiệm không còn duy trì, có hạn chế an toàn, không dự định fixes/releases. Đây là bằng chứng trực tiếp về ngừng phát triển **repo này** | Không suy ví Solana hết nhu cầu; không dùng code giữ key chưa audit làm nền MVP |
| [notuslabs/facto](https://github.com/notuslabs/facto), README blob `e63ae0c`; API `archived=true`, `pushed_at=2026-09-22T18:24:14Z` | Repo credit/crowdfunding có README/luồng dev local; hiện được archive. [Renaissance results](https://blog.colosseum.com/announcing-the-winners-of-the-solana-renaissance-hackathon/) liệt kê Facto trong honorable mentions | Chưa biết vì sao archive, có chuyển repo hay ngừng công ty không; không gọi mất PMF hoặc thất bại. License cần đọc riêng trước tái sử dụng |
| `elmosmokinweed/p2p-solana` | GitHub search cho archive flag; đọc `README.md` trả 404 | Chưa có product evidence để rút khoảng trống hay chấm điểm |
| Bốn repo Frontier không lấy được README | Chỉ biết quyền/path đọc hiện tại không thành công | 404 không phải bằng chứng bị bỏ dở |

`pushed_at` là metadata của repo, không phải ngày commit logic cuối cùng hoặc ngày archive. Không biến “ít commits” thành “không còn ai dùng”. Nguồn dự án cũ dùng để tìm constraint chưa giải quyết, không dùng làm danh sách code để chép.

### 3.4. Hạ tầng mới và phần cần kiểm trước khi chọn

| Hạ tầng | Evidence hiện có | Cách dùng / loại rủi ro |
| --- | --- | --- |
| [P-Token upgrade](https://solana.com/upgrades/p-token) | Trang hiện ghi mainnet/devnet activation completed, tương thích instruction cũ và cần cập nhật indexing | Phải kiểm decoder/log assumptions. Các con số CU của nguồn không phải số đo của đội |
| [SIMD-0266](https://github.com/solana-foundation/solana-improvement-documents/blob/main/proposals/0266-efficient-token-program.md) | Thiết kế thay implementation Tokenkeg; địa chỉ ptok là account nạp code trước replacement. Giữ account/instruction layout; thêm batch/withdraw_excess_lamports/unwrap_lamports | Sửa nhận định tentative của ROADMAP: không bắt dApp chuyển sang “địa chỉ token program mới”. Không dựa log tên instruction để suy state. Header SIMD còn Review; trạng thái rollout đọc từ upgrade page, hai loại evidence khác nhau |
| [Light Protocol](https://www.lightprotocol.com/) và [Solana roundup tháng 3/2026](https://solana.com/de/news/solana-ecosystem-roundup-march-2026) | Roundup công bố SDK payments; website hiện thông báo joining Helius. Hai URL Light payment/wallet guide tìm được đều 404 khi mở trực tiếp | Tiết kiệm rent là hướng cần nghiên cứu, **không chọn làm dependency bắt buộc D1 chỉ nhờ headline**. Chưa xác nhận current SDK/devnet/RPC. Fallback SPL ATA thường phải tính chi phí thật |
| [x402 V2 trên Solana](https://solana.com/docs/payments/agentic-payments/x402) | Phân biệt client/server/facilitator, V2 headers/CAIP-2, exact và upto có yêu cầu support riêng | Tạo đường xác minh amount/mint/payTo/replay/settlement. Facilitator trả supported không thay smoke. Không gọi custom PDA payment là tương thích exact nếu chưa chứng minh instruction layout |
| [Agentic payments](https://solana.com/docs/payments/agentic-payments) | MPP và x402 là giao thức thanh toán khác nhau; MCP là giao diện tools/resources | Không trộn headers; MVP chọn một flow. Agent không được có quyền vô hạn chỉ vì được gọi là autonomous |

### 3.5. Biến nguồn thành ý tưởng có thể bác bỏ

1. Ghi **claim ledger**: claim → người phát biểu → link/mốc → mức trực tiếp → điều chưa biết. Hai bài chép cùng thông cáo chỉ là một nguồn.
2. Lấy user cụ thể và công việc hiện tại. Ít nhất một nguồn trực tiếp về friction; RFS chỉ là tín hiệu hướng. Public issue là báo cáo một case, không phải tỷ lệ lỗi toàn mạng.
3. Tìm ít nhất ba cách hiện có, gồm cách tập trung hoặc làm thủ công. Nếu họ đã làm tốt đúng flow, thu nhỏ vào thiếu sót kiểm được hoặc bỏ ý tưởng.
4. Vẽ trust boundary. Nếu một DB/adapter giải quyết cùng thuộc tính mà không mất quyền user cần, không thêm chain để trang trí. Nếu on-chain state quyết định tiền/quyền, ghi invariant.
5. Lập dependency D0–D3 và kill criteria theo 016. Chưa cài toolchain thì F không quá 3; chọn primitive dễ kiểm và một failure path thật.
6. Viết acceptance và demo 165 giây trước mở rộng scope. Sau này đo test/latency/CU thật, không mượn số marketing.
7. Chấm bằng RUBRIC; lưu r0–r3 kể cả bài bị bỏ. Một ý tưởng “chờ chấm chéo” chưa phải “ĐẠT”.

## 4. Ví dụ hoặc quy trình tối thiểu

**Ví dụ nghiên cứu, chưa phải implementation:** một issue báo retry có thể trả phí hai lần. Đọc cả body/comments và commit version, kiểm rail EVM/Solana, xem core đã sửa chưa. Ghi rõ lỗi có ở transaction replay, business purchase ID hay delivery recovery. Chỉ đề xuất giải pháp khi biết gap nào còn tồn tại; đừng bán lại tính năng library đã có.

Mẫu evidence card: `user/job | nguồn trực tiếp | workflow hiện tại | ba alternatives | trust delta | D1 dependencies | phép đo lợi ích | kill condition`. Mẫu này tự soạn; chưa chạy mã hay gửi khảo sát.

## 5. Tự kiểm tra

- RFS stablecoin đủ để P=4? **Không**, cần evidence về workflow/vấn đề từ các nguồn độc lập.
- Archive flag chứng minh thất bại thị trường? **Không**. Samui có tuyên bố unmaintained; Facto chỉ đủ kết luận repo archived.
- Mọi x402 exact client gọi được custom escrow program? **Không**; verifier kiểm layout, phải chứng minh interoperability hoặc ghi ngoài MVP.
- P-Token buộc tạo mint ở program ID mới? **Không theo thiết kế replacement đã đọc**; kiểm lại đúng cluster khi được phép thử.
- Light docs cũ 404 nghĩa Light không còn hoạt động? **Không**; chỉ chứng minh URL không truy cập được, cần current documentation.

## 6. Nguồn và độ tin cậy

Nguồn chính thức/maintainer được liên kết cạnh claim. GitHub metadata đọc qua connector, website công khai qua web/HTTP; không dùng private token hoặc gửi dữ liệu người dùng ra ngoài. Các lập luận lựa chọn/scope là tổng hợp của Codex.

Quét rộng theo prompt: nhật ký docs, paper/arXiv/ACM/IEEE/Scholar, Reddit/X/HN/YouTube và Trung Quốc có ở [016](016-technical-feasibility-risk.md). Lượt C bổ sung queries bằng tiếng Trung `Solana 支付 重复 交易`, `Solana 开发 支付 失败`, `Solana 支付 开发`. [Linux.do thread 2236665](https://linux.do/t/topic/2236665) là người làm sản phẩm hỏi tích hợp USDC/USDT, chỉ là một nhu cầu cá nhân; Juejin có bài idempotency nhưng không được dùng để xác nhận API Solana. Kết quả Zhihu lần này không đủ trực tiếp; không nói website bị chặn. [HackRep abstract](https://arxiv.org/abs/2603.29672) đã đọc ở 016; chưa tải/phân tích dataset và không suy tỷ lệ continuation.

## 7. Điểm chưa kiểm chứng và bước tiếp theo

Chưa đọc bảng RFP Airtable, chưa có interview/usage của user mục tiêu, chưa chứng minh SDK/devnet hiện tại, chưa smoke bất cứ dependency nào. Nội dung Light mới cần kiểm thêm nếu muốn dùng. Bước tiếp theo là chặng D độc lập, tạo các evidence cards và so alternatives trước tự chấm.

### Bài học / lỗi đã gặp

| Bẫy | Cách sửa |
| --- | --- |
| RFS được coi là customer demand | Tách người tài trợ hệ sinh thái với người thực hiện workflow |
| Website hiện tại khác bản dự thi | Pin artifact đúng ngày hoặc ghi U, không cộng thành tích hậu thi |
| Nhiều dự án cùng tên SurgePay/Portara | Theo link trong profile của đúng sự kiện |
| Web tool trả 409, HTTP Solana 429 | Ghi lỗi công cụ/truy cập cụ thể; đọc nguồn indexed/maintainer thay thế, không suy site bị chặn toàn bộ |
| Primitive mới thành dependency không kiểm | D0 giữ D0; MVP có fallback được mô tả và tính lại chi phí |
