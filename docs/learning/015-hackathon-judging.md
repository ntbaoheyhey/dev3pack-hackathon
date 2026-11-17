# 015 — Tiêu chí chấm hackathon và cách giám khảo chấm thật

> Ngày đọc mọi nguồn dưới đây: **17/11/2026, Asia/Ho_Chi_Minh**. Codex; trước sự kiện; Phase 1/A. Đã đọc tài liệu, chưa có sản phẩm để chấm. Các tỷ lệ/ngưỡng sẽ là quyết định nội bộ, không phải xác suất thắng.

## 1. Mục tiêu và điều cần nhớ

Một bài thi cần qua ba câu hỏi: **hợp lệ không → người dùng nhận giá trị gì → bằng chứng nào cho thấy làm được**. Điểm tổng không cứu được vi phạm thể lệ. Chấm ý tưởng là đánh giá một kế hoạch có căn cứ; chấm bài đã build phải kiểm tra artifact thật. Không đổi “sẽ deploy” thành “đã deploy”.

Đọc sau 001/012. Kết quả cần dùng là định nghĩa tiêu chí và bằng chứng, chưa nghĩ ý tưởng ở chặng này.

## 2. Phiên bản và bằng chứng kiểm tra

| Nguồn | Mốc | Đã đọc / giới hạn |
| --- | --- | --- |
| Colosseum Renaissance / Breakout / Frontier | 2024 / 2025 / 2026 | Điều 8 của ba PDF official rules; sáu nhóm giống nhau, không thấy tỷ lệ trong điều này |
| Solana Foundation | Solana Season 2021; đồng thời là Host trong các PDF trên | Nguồn 2021 chỉ là lịch sử, không áp thể lệ cũ vào 2026 |
| Superteam Japan Frontier side track | 2026 | Listing chính thức, tiêu chí và điều kiện địa phương; không đại diện mọi Superteam |
| Dev3pack | FAQ hiện hành | Web extractor chỉ hiện câu hỏi; đọc câu trả lời trong JS công khai do chính `/faq` tải ngày 17/11 |
| ETHGlobal New York | 2026 | Trang hướng dẫn nộp/chấm của sự kiện |
| ETHShanghai | Bài BTC ETHPanda, 17/09/2025 | Tiêu chí và yêu cầu repo/demo; không suy trọng số |
| NASA Space Apps | Judging Guidance 2025 | PDF 4 trang, điều kiện tối thiểu và mô tả mức 1/3/5 |
| MLH | Organizer guide hiện hành, nhắc mùa 2026 | Hướng dẫn tổ chức chung, không phải luật Dev3pack |

Ba sự kiện lớn ngoài Solana đã đọc trực tiếp: **ETHGlobal New York 2026, ETHShanghai 2025, NASA Space Apps 2025**. Google Cloud ADK/Devpost được quét bổ sung nhưng trang rules trả 403 khi lấy phần chấm; không suy tiêu chí từ tên nền tảng.

## 3. Kiến thức chính

### 3.1. Ma trận văn bản chính thức

| Đơn vị / sự kiện | Văn bản nói gì | Áp dụng vào bộ chấm nội bộ |
| --- | --- | --- |
| Colosseum 2024–2026 | Functionality/code quality, impact/market, novelty, UX dùng hiệu năng Solana, open-source/composability, business plan | Tách giá trị sản phẩm, khác biệt, UX và kỹ thuật. “Có code Rust” không tự chứng minh chất lượng. [Renaissance §8][C24], [Breakout §8][C25], [Frontier §8][C26] |
| Solana Foundation | Season 2021 nêu functionality, impact, novelty, design/UX, composability; các PDF Colosseum 2024–2026 xác định Foundation là Host | Có nền tảng cho vai trò Solana thật, nhưng không nhập luật private repo hay tiếng Anh của Colosseum vào Dev3pack. [Foundation][SF] |
| Superteam Japan | Sáu nhóm tương tự; local judges riêng, có điều kiện cư trú và nộp cả hai nơi | Sponsor/local track là điều kiện riêng, không phải “thêm SDK sẽ thêm điểm”. [Listing][ST] |
| Dev3pack | Product + Technical; lọc top 100 rồi xem code, founder-market fit, live demo; signals gồm clarity, impact, demo, deployment, repo, Solana/SDK depth | Đặt điều kiện Solana/open source/video thật riêng. Không có trọng số hay số phút reviewer đọc repo được công bố trong FAQ. [FAQ][D] |
| ETHGlobal New York | Technicality, originality, practicality, usability, wow; phiên finalist 4 phút demo + 3 phút hỏi | Độ khó có ích phải đi cùng khả năng dùng được. Con số 7 phút chỉ của sự kiện này. [NY][E] |
| ETHShanghai | Chất lượng/hoàn thiện code, sáng tạo, vấn đề thật/giá trị hệ sinh thái, UX/an toàn, tiến độ trong hackathon | Khác biệt và an toàn có ý nghĩa sản phẩm; không tự gán bảng 35/30/... từ nơi khác cho BTC. [ETHPanda][SH] |
| NASA Space Apps | Impact, creativity, validity, relevance, presentation; kiểm yêu cầu tối thiểu trước, sau đó đánh giá tổng thể 1–5 | Học cách mô tả hành vi ở các mức điểm; không chuyển quy định dữ liệu NASA hay thời lượng của NASA sang Dev3pack. [Guidance][N] |

### 3.2. Giám khảo và BTC mô tả quá trình thật

[Workshop của Colosseum][CW] do Nate Levine, Matty Taylor và Clay Robbins hướng dẫn: pitch thường được xem đầu tiên để chọn bài xem sâu; technical demo giải thích stack, quyết định kiến trúc và phần Solana. Nguồn cũng đề cập phản hồi người dùng và trao đổi sau khi nộp. Đây là lời BTC về quy trình của họ, **không phải log thời gian của từng giám khảo**, không cho phép khẳng định mọi bài chỉ được xem vài chục giây.

[How to Win][CH] mô tả mục tiêu xây startup và ưu tiên một demo devnet thể hiện giá trị cốt lõi. [Superteam Argentina][SA] công khai tóm tắt điều họ thấy khi chấm; dùng như trải nghiệm địa phương, không như chính sách mọi sự kiện. Không đồng nhất lựa chọn vào accelerator với điểm thắng hackathon.

[MLH judging plan][M] đề xuất ba lượt reviewer, ngân sách mỗi bài 4 phút gồm 2 phút demo, 1 phút hỏi/chấm, 1 phút di chuyển; phần debrief nói 3 phút ở bàn, phù hợp với việc trừ phút di chuyển. MLH dùng stack ranking để giảm ảnh hưởng người chấm dễ/khó. Đây là hướng dẫn vận hành, không phải số đo Dev3pack.

Video workshop được liên kết từ bài Colosseum; **đã đọc bản tóm tắt BTC, chưa nghe toàn bộ video/podcast**, không bịa timestamp hay trích lời chưa nghe. Quét Reddit/X/Hacker News có dẫn lại workshop và các trải nghiệm khác; không lấy chúng thay văn bản BTC. Nhật ký quét mở rộng nằm ở 016.

### 3.3. Lọc ban đầu khác xem sâu thế nào?

Theo [Dev3pack FAQ][D], tất cả bài được chấm trước khi lọc top 100; vòng sau kiểm code và demo. Suy luận của Codex: vòng đầu cần người xem hiểu ngay ai dùng và kết quả quan trọng; vòng sâu cần bằng chứng tái kiểm tra. Không suy ra “vòng 1 không đọc code” hay phần trăm trọng số từ thứ tự signals.

Các nhóm cần phân biệt:

- **Bị loại theo luật:** sai chain, không open source, video không theo quy định, nộp sản phẩm người khác như của mình; đối chiếu 001 và FAQ. Không có partner bounty chính thức thì ghi “Solana chính”, không bịa track.
- **Có nguy cơ điểm thấp:** mô tả mơ hồ, pitch lặp lại buzzword, thiếu user/giá trị, demo không chứng minh luồng chính. Workshop Colosseum hỗ trợ các cảnh báo này; không có dữ liệu để gán tỷ lệ loại.
- **Chưa đủ bằng chứng:** live link hỏng/không truy cập được, deployment không xác minh được. Ghi `U` (unknown), không kết luận dự án gian lận hay code lỗi nếu chưa kiểm tra.

### 3.4. Chấm kỹ thuật theo hành vi, không theo độ dài repo

Đề xuất nội bộ từ tín hiệu functionality/repo/deployment của các nguồn trên và [007](007-solana-program-security.md):

| Điều cần chứng minh | Ở ý tưởng | Ở bài đã xây |
| --- | --- | --- |
| Solana tạo giá trị | Nêu ai cần cùng kiểm chứng trạng thái/quyền, vì sao DB không đáp ứng tương đương | Transaction + state trước/sau, giải thích invariant |
| Program đúng | Account/instruction phác thảo; ai ký, ai giữ quyền | Source/IDL cùng version, test âm và log |
| Chạy được | Dependency matrix, đường rút gọn, kế hoạch spike | Build/test có lệnh và kết quả; program ID/cluster/live URL |
| Demo thật | Kịch bản 165 giây với đầu vào/kết quả kiểm chứng | Video luồng thật, mở explorer, không dùng mock gắn nhãn on-chain |
| Repo có thể xem lại | License/provenance và kế hoạch tài liệu | Commit history, README chạy lại, secrets ngoài Git |

Độ sâu là chọn primitive phù hợp và kiểm soát quyền/trạng thái; một flow SPL Token chuẩn có thể hợp lý hơn một custom program thừa. Chưa có căn cứ rằng BTC bắt buộc số instruction, số test, nhiều SDK hoặc chương trình tùy viết.

## 4. Ví dụ hoặc quy trình tối thiểu

Quy trình **đề xuất**, chưa phải rubric đã gộp:

1. Xác minh eligibility; đánh dấu `pass / fail / pending`, không cho điểm bù lỗi loại thẳng.
2. Hai reviewer tự đọc cùng snapshot, chấm từng tiêu chí 0–5 và dẫn chứng. `U` khác 0: U là không biết, 0 là có bằng chứng không đạt.
3. Ở vòng ý tưởng, chấm kế hoạch bằng chứng; ở vòng giao hàng, yêu cầu artifact. Không trộn hai chế độ trong một bảng xếp hạng.
4. So độ chênh từng tiêu chí trước tổng điểm. Chênh >=2/5 thì đọc lại bằng chứng và ghi lý do; không lấy trung bình để che bất đồng.
5. Nếu chưa biết trọng số BTC, chọn trọng số nội bộ công khai, thử độ nhạy và hiệu chỉnh bằng bài có thật. Không điều chỉnh riêng để ý tưởng yêu thích thắng.

Ví dụ giả định: A có trình bày 5/5 nhưng không giải thích quyền rút vault; tổng cao vẫn phải sửa hoặc loại vì rủi ro. B không có oracle nhưng chứng minh thanh toán/đối soát cần state chung có thể có điểm kỹ thuật tốt. Đây chỉ là ví dụ đánh giá, không phải đề xuất sản phẩm chặng D.

## 5. Tự kiểm tra

1. Có được suy mọi rubric Colosseum là “đồng trọng số”? **Không**; điều 8 ba bản đã đọc chỉ liệt kê tiêu chí.
2. NASA có ngưỡng tối thiểu nên Dev3pack áp cùng video 30 giây? **Không**, luật theo từng sự kiện.
3. 4 phút MLH có phải thời gian đọc bài Dev3pack? **Không**.
4. Bài thắng chứng minh người dùng sẵn sàng trả tiền? **Không**; cần bằng chứng khách hàng riêng.
5. Một idea chưa deploy được 0 điểm feasibility? **Không tự động**; feasibility ý tưởng đánh giá thiết kế/phụ thuộc, nhưng không cho điểm đã thực thi.

## 6. Nguồn và độ tin cậy

Toàn bộ link đọc **17/11/2026**; mốc 2021/2024 là lịch sử, có thể khác luật hiện hành. Các bảng/quy trình đánh giá là tổng hợp của Codex, không trích rubric nguyên văn.

- [C24 — Renaissance official rules, §8][C24]; [C25 — Breakout official rules, §8][C25]; [C26 — Frontier official rules, §8][C26].
- [SF — Solana Foundation, Season winners][SF]; [ST — Superteam Japan Frontier][ST].
- [D — Dev3pack FAQ][D]. Đã đọc dữ liệu câu trả lời từ chunk công khai `0thwfx_~hqd~4.js`, deployment `dpl_AXFjpWNqcCf6BuopDyABQ9AztSU2`; tên chunk có thể thay đổi. Không truy cập dashboard đăng nhập.
- [CW — Workshop submission Colosseum][CW]; [CH — How to Win][CH]; [SA — Superteam Argentina][SA].
- [E — ETHGlobal New York 2026][E]; [SH — ETHPanda ETHShanghai 2025][SH]; [N — NASA 2025 Judging Guidance][N]; [M — MLH organizer source][M].
- [Google Cloud ADK rules trên Devpost](https://googlecloudmultiagents.devpost.com/rules): tìm thấy nguồn chính thức nhưng lấy phần nội dung trả 403; không dùng để điền trọng số/tiêu chí.

## 7. Điểm chưa kiểm chứng và bước tiếp theo

Chưa có trọng số chính thức Dev3pack, thời gian giám khảo mỗi bài, giờ UTC nộp, partner tracks và điều kiện local Việt Nam. A phụ trách cập nhật 001/018. Chưa có evidence về độ chính xác dự đoán giải của bộ chấm nội bộ. Hiệu chỉnh cần cả bài thắng và bài không top có nhãn đáng tin, tránh chấm theo danh tiếng hiện tại.

### Bài học / lỗi đã gặp

| Bẫy | Cách xử lý |
| --- | --- |
| FAQ web extractor chỉ có câu hỏi | Đọc data công khai mà trang tải, ghi rõ phương thức; không đoán câu trả lời |
| Search snippet khẳng định rubric có trọng số | Đọc §8 PDF gốc; không lặp khẳng định chưa thấy trong nguồn |
| Pitch hướng startup ở Colosseum bị dùng thành luật video Dev3pack | Giữ mapping theo từng sự kiện và áp FAQ Dev3pack |
| Nguồn Devpost/PMC có lúc trả HTML có lúc 403/CAPTCHA | Ghi giới hạn truy cập, không coi kết quả tìm kiếm là đã đọc toàn văn |

[C24]: https://arena.colosseum.org/rules/Renaissance%20Hackathon%20Official%20Rules%202024.pdf
[C25]: https://colosseum.com/files/Breakout%20Hackathon%20Official%20Rules%202025.pdf
[C26]: https://colosseum.com/legal/Solana%20Frontier%20Hackathon%20Rules.pdf
[SF]: https://solana.com/news/announcing-winners-of-the-solana-season-hackathon
[ST]: https://superteam.fun/earn/listing/superteam-japan-frontier-hackathon-side-track
[D]: https://hack.dev3pack.xyz/faq
[CW]: https://blog.colosseum.com/perfecting-your-hackathon-submission/
[CH]: https://blog.colosseum.com/how-to-win-a-colosseum-hackathon/
[SA]: https://superteam.ar/stack/hackathon
[E]: https://ethglobal.com/events/newyork2026/info/details
[SH]: https://ethpanda.substack.com/p/ethshanghai-2025
[N]: https://spaceapps-v2-staging.s3.amazonaws.com/media/documents/Final_Space_Apps_2025_Judging_Guidelines_for_web.pdf
[M]: https://github.com/MLH/mlh-hackathon-organizer-guide/blob/master/general-information/judging-and-submissions/judging-plan.md

## Tiêu chí ứng viên cho bộ chấm

| Tiêu chí | Định nghĩa để chấm | Vì sao | Nguồn (đọc 17/11/2026) |
| --- | --- | --- | --- |
| Eligibility | Solana, open source, provenance, video thật hợp lệ | Cổng bắt buộc, không cộng điểm | [D][D], 001 |
| Vấn đề và giá trị | User/job cụ thể, vấn đề có bằng chứng, lợi ích quan sát được | Tránh lời hứa thị trường không kiểm tra | [CW][CW], [C26][C26] |
| Khác biệt | So sánh giải pháp gần nhất và cải tiến có ý nghĩa | Không đồng nhất mới với phức tạp | [E][E], [SH][SH] |
| Solana cần thiết | Primitive tạo quyền/khả năng kiểm chứng hoặc composability cho user | Tránh thêm blockchain làm trang trí | [ST][ST], [D][D] |
| Khả thi và chất lượng kỹ thuật | Có đường làm xong, kiểm dependencies, test và rủi ro | Thuyết trình không bù code không chạy | [C25][C25], 016 khi hoàn tất |
| Demo/UX | Luồng giá trị dễ hiểu, lỗi có lối thoát, kết quả có thể kiểm chứng | Hợp cả vòng lọc lẫn vòng sâu | [D][D], [E][E], [M][M] |
| Tiếp tục và phân phối | Đường tiếp cận user, hypothesis bền vững, nguồn lực phù hợp | Giải thưởng không chứng minh product-market fit | [CH][CH], [C26][C26] |
