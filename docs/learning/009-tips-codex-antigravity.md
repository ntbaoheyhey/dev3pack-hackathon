# 009 — Mẹo dùng Codex và Antigravity

> Ngày kiểm tra: 2026-11-17 (Asia/Ho_Chi_Minh). Phạm vi: **cả phần Codex và phần Antigravity**.
> Trạng thái phần Codex: đã đọc docs/nguồn cộng đồng; chưa benchmark GPT-6 hoặc chạy sandbox. Phần Antigravity đã sửa nguồn theo R03; chỉ giữ cơ chế có trang docs riêng. Kết quả sandbox của phiên khác chưa được Codex tái chạy; xem [bản rà soát](REVIEW-2026-11-17.md).

## 1. Mục tiêu và điều cần nhớ

Dùng kết hợp **Codex (GPT-6/Astra)** và **Antigravity (Gemini 3.8 Flash)** để học, xây dựng và kiểm tra ứng dụng Solana có căn cứ: giao đầu ra rõ, cung cấp đúng ngữ cảnh, yêu cầu nguồn và bằng chứng chạy thực tế. Đọc khoảng 20–25 phút; dùng cùng [010](010-solana-ai-tooling.md) khi chọn MCP/skill.

Ba nhãn xuyên suốt: **chính thức** là hướng dẫn của nhà cung cấp (OpenAI / Google DeepMind); **cộng đồng — chưa kiểm chứng** là kinh nghiệm của người viết bài trên các diễn đàn quốc tế và Trung Quốc; **đề xuất áp dụng** là quy trình tự soạn cho repo hiện tại. Có link không đồng nghĩa mẹo đã được thử hoặc phù hợp mọi phiên bản.

## 2. Phiên bản và bằng chứng kiểm tra

| Thành phần | Phiên bản hoặc mốc tài liệu | Mức kiểm chứng |
| --- | --- | --- |
| Codex CLI trên máy | **0.169.0-alpha.11.1** | Đã chạy `codex --version` trong phiên nghiên cứu; không suy ra đây là version desktop |
| Codex desktop / model thực chạy | Chưa kiểm chứng build desktop và model bằng UI | Không dùng lời tự nhận của model để xác nhận model đang được chọn |
| Antigravity Environment | Phiên trước báo IDE 2.0 | Chưa kiểm chứng độc lập build; không coi là môi trường của phiên Codex sửa note |
| Model Antigravity | Phiên trước báo Gemini 3.8 Flash | Chưa kiểm chứng model/effort bằng UI; không suy ra quota hoặc benchmark |
| Antigravity Browser Subagent | Phiên trước báo mở localhost và chụp UI | Chưa tái chạy; khả dụng phụ thuộc surface/version/account theo docs Browser use |
| OpenAI docs, models, AGENTS.md, MCP | Tài liệu sống truy cập **17/11/2026** qua manual chính thức | Đọc tài liệu; không sửa model/effort hay cấu hình |
| Google Antigravity docs | Các trang Rules, Artifacts, Browser, slash commands; 17/11/2026 | Đã đọc nguồn từng tính năng; không dùng homepage diễn đàn làm bằng chứng |
| Mẹo cộng đồng Global & Trung Quốc | Các bài viết năm **2026** (Reddit, HN, Linux.do, CSDN, V2EX) | Đã đối chiếu; chi tiết link và nhãn kiểm chứng ở mục 6 |
| GitHub issue #13386 | Báo cáo **03/03/2026**, CLI **0.108.0-alpha.3**, GPT-5.3 | Báo cáo lịch sử; không kết luận lỗi còn tồn tại ở CLI hiện tại |

Yêu cầu ban đầu ưu tiên GPT-6/Astra và High/Extra High được giữ nguyên, không tự chuyển model. Tài liệu hiện tại khuyên chọn effort theo độ khó; với Astra, điểm bắt đầu gợi ý là Light (`low`), tăng khi cần. Đó là lựa chọn để người dùng cân nhắc, không phải bằng chứng High/Extra High luôn tốt hơn hay luôn cần thiết. Tên/khả dụng model phụ thuộc client và tài khoản. [OpenAI Models](https://learn.chatgpt.com/docs/models.md)

## 3. Kiến thức chính

### 3.1. Codex — hướng dẫn chính thức

| Mẹo | Áp dụng vào việc học Solana | Nhãn và nguồn |
| --- | --- | --- |
| Giao kết quả, phạm vi và tiêu chí đạt | Nêu note cần viết, phiên bản cần kiểm tra, thư mục được sửa và cách xác nhận hoàn tất. Chia việc dài thành đầu ra có thể review. | **Chính thức** — [Best practices](https://learn.chatgpt.com/guides/best-practices) |
| Giữ luật bền vững trong AGENTS.md ngắn | Ghi lệnh kiểm tra và ranh giới repo; dẫn tới note dài. Quyết định riêng của một buổi nằm trong prompt hoặc bàn giao. | **Chính thức** — [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) |
| Tổ chức tri thức thành tài liệu dễ tìm | README dẫn tới bài học và bằng chứng; cập nhật tài liệu khi quyết định đổi. Tránh nhiều bản mô tả mâu thuẫn. | **Chính thức, kinh nghiệm đội OpenAI** — [Harness engineering, 11/02/2026](https://openai.com/index/harness-engineering/) |
| Chọn effort theo bài toán | Bài dịch ngắn và review authority/CPI có độ khó khác nhau. Đánh giá bằng chất lượng đầu ra, thời gian và usage thực tế. | **Chính thức** — [Models](https://learn.chatgpt.com/docs/models.md) |
| Cho agent cách kiểm tra kết quả | Chỉ rõ kiểm tra link cho tài liệu, negative tests cho program; yêu cầu phân biệt “đã đọc” và “đã chạy”. | **Chính thức** — [Best practices](https://learn.chatgpt.com/guides/best-practices) |
| Thêm MCP khi cần dữ liệu/công cụ bên ngoài | Dùng Solana docs MCP cho nguồn hiện hành; kiểm tra tool nào được phép gọi. Có kết nối không có nghĩa mọi hành động đã được đồng ý. | **Chính thức** — [MCP](https://learn.chatgpt.com/docs/extend/mcp) |

### 3.2. Codex — mẹo cộng đồng global và Trung Quốc

Các hàng sau đều là **cộng đồng — chưa kiểm chứng**. Bản dịch là diễn giải ngắn, không sao chép nguyên prompt của tác giả. Khuyến nghị áp dụng vào repo là đánh giá của người viết note.

| Nguồn | Mẹo được diễn giải sang tiếng Việt | Cách áp dụng và giới hạn |
| --- | --- | --- |
| [OpenAI Community — EricGT, 24/08/2026](https://community.openai.com/t/tips-and-tricks-for-using-codex-and-rate-limits/1373143/35) | Kiểm kê môi trường trước khi làm: OS, PATH, dependency, lệnh test; tách yêu cầu ổn định khỏi trạng thái tạm thời. | Dùng bảng kiểm kê ở 003. Bài trên forum OpenAI vẫn là bài của thành viên, không tự trở thành chính sách OpenAI. |
| [Reddit — How to make Codex work fantastically](https://www.reddit.com/r/codex/comments/1u97eq0/how_to_make_codex_work_fantastically/) | Giữ hướng dẫn gọn, giao yêu cầu có ngữ cảnh; một bình luận đề nghị branch và commit nhỏ để dễ review. | Mỗi note một commit. Không nhận các suy đoán về chất lượng model, lý do model hành xử hay tỷ lệ cải thiện làm sự thật. |
| [Hacker News — thảo luận về AGENTS.md](https://news.ycombinator.com/item?id=47034087) | Hướng dẫn có ích khi chứa tri thức đặc thù mà agent khó tự tìm; người tham gia bất đồng về hiệu quả. | Chỉ thêm luật giúp tránh lỗi đã thấy. Không áp các phần trăm của nghiên cứu model cũ cho GPT-6. |
| [GitHub openai/codex #13386](https://github.com/openai/codex/issues/13386) | Khi nghi hướng dẫn bị thiếu, kiểm tra kích thước/phạm vi file và tạo trường hợp tái hiện nhỏ. | Issue báo hiện tượng truncation trên bản cũ; không coi nó là lỗi đã xác nhận của 0.169.0-alpha.11.1. |
| [DEV — Daniel Imaino, 30/10/2026](https://dev.to/plexsicity/how-to-share-ai-coding-agent-context-across-a-team-4h3j) | Tách luật ổn định khỏi quyết định, bài học và việc đang mở. | Áp dụng bằng README/DEVLOG/HANDOFF tại repo. Bài có quảng bá dịch vụ memory; không cần cài dịch vụ để dùng ý tưởng này. |
| [CSDN — AGENTS.md 实战, 09/06/2026](https://aicoding.csdn.net/6a27ee3510ee7a33f279c491.html) | Chuyển những quy tắc phải nhắc đi nhắc lại vào một AGENTS.md tối thiểu của project. | Ví dụ “không tự thêm dependency” phù hợp phiên học này. Cơ chế thực tế vẫn đối chiếu docs OpenAI, không dùng bài cộng đồng làm đặc tả. |
| [V2EX — thảo luận tháng 09/2026](https://v2ex.com/t/1240028) | Kiểm tra model được chọn khi mở chat mới và chọn mức phù hợp công việc. | Không lấy usage của người khác làm dự toán quota, giá hay lời hứa tiết kiệm. Không sử dụng quảng cáo dịch vụ trong bình luận. |
| [Linux.do — alex_huang, 21/05/2026](https://linux.do/t/topic/2217508) | Đọc call path trước khi sửa; thay đổi vừa đủ; báo trung thực bước đã kiểm tra và chỗ chưa kiểm tra. | Áp dụng vào phạm vi tài liệu và kiểm tra diff. Bài thử GPT-5.4 High; tranh luận “global prompt trống tốt nhất” chưa có kết luận chung. |

### 3.3. Codex — tối ưu công việc có thể đo

**Đề xuất áp dụng**, không phải cam kết tiết kiệm quota: chọn một bài quen thuộc, giữ cùng đầu vào và tiêu chí đạt; ghi model/effort thực chọn, thời gian, số vòng sửa và lỗi còn lại. Chỉ đổi một yếu tố mỗi lần. Bài đối chiếu PDA hoặc review năm ca sai quyền phù hợp hơn việc so hai yêu cầu khác hẳn nhau.

Đưa đúng file và đoạn log liên quan; giữ nguyên lỗi cùng version thay vì dán toàn bộ repo. Khi compact, bàn giao phải giữ mục tiêu, ranh giới, file/commit đã xong, bằng chứng và bước kế tiếp. Compact không làm task hoàn thành hay hủy yêu cầu tiếp tục. Đây là quy ước cho mục tiêu hiện tại, không phải bảo đảm rằng mọi client giữ nguyên mọi chi tiết hội thoại.

Không thu thập hoặc hướng dẫn lách quota, reverse proxy, chia sẻ tài khoản hay vượt kiểm soát truy cập. Không cài thêm memory/MCP/plugin chỉ vì bài viết quảng bá.

### 3.4. Antigravity — cơ chế có nguồn chính thức cụ thể

Mỗi hàng dưới có trang tài liệu hỗ trợ trực tiếp, truy cập 17/11/2026. Đây là **đã đọc docs**, chưa phải đã chạy trong môi trường Antigravity của repo. Tài liệu sống có thể thay đổi theo surface/version/account.

| Cơ chế / mẹo | Nội dung được nguồn hỗ trợ và giới hạn | Nguồn trực tiếp |
| --- | --- | --- |
| Rules | `AGENTS.md`/`GEMINI.md` và `.agents/rules/` được tìm từ workspace lên repo root; rules cộng dồn. `rules/*.md` cần frontmatter `trigger`; không suy rằng mọi thư mục con đều được tự nạp. | [Rules](https://antigravity.google/docs/rules) |
| Phân biệt rule và skill | Rule lưu ràng buộc; skill lưu quy trình nhiều bước. Áp dụng quy tắc “không mainnet” của repo trong hướng dẫn bền vững. | [Rules — Rule vs Skill](https://antigravity.google/docs/rules) |
| Artifacts | Dùng plan, diff, sơ đồ, ảnh/recording để review đầu ra và phản hồi. Không có căn cứ cho lời hứa artifact không tốn context hoặc đường dẫn nội bộ cố định ở mọi client. | [Artifacts](https://antigravity.google/docs/artifacts) |
| `/plan` | Nghiên cứu và lập kế hoạch có thể review trước thực thi; dùng khi cần chốt yêu cầu/kiến trúc. Không khái quát thành mọi task đều chờ cùng một cờ nội bộ `RequestFeedback`. | [Plan](https://antigravity.google/docs/plan/) |
| Browser / `/browser` | Có thể mở trang, thao tác app, xem lỗi và chụp ảnh. Browser tích hợp và Chrome subagent có điều kiện khác nhau theo version, tài khoản và surface; kiểm tra mục Availability trước dùng. | [Browser use](https://antigravity.google/docs/browser) |
| `/boost` | Quy trình nhiều agent cho tác vụ khó; tài liệu ghi thuộc paid plans. Chưa đo tốc độ/chất lượng, không mặc định là lựa chọn tốt cho mọi việc. | [Boost](https://antigravity.google/docs/boost/) |
| `/learn` | Đề xuất lưu bài học thành rule hoặc skill để người dùng review; không đồng nghĩa tự ghi mọi lời sửa thành rule ngay lập tức. | [Learn](https://antigravity.google/docs/commands/learn/) |
| `/grill-me` | Phỏng vấn từng câu để làm rõ yêu cầu, đọc code trước với điều có thể tự tìm; có thể phối hợp `/plan`. | [Grill me](https://antigravity.google/docs/commands/grill-me/) |

**Chưa kiểm chứng:** quota/model mặc định, context window, hiệu quả chia thời gian giữa Flash/Pro và mức tăng tốc. Chưa có phép đo cùng đầu vào/điều kiện; bỏ các tỷ lệ phần trăm và khuyến nghị tuyệt đối ở bản cũ. Chỉ chọn model sau khi kiểm tra UI/docs của tài khoản thực tế.

### 3.5. Antigravity — loại bỏ mẹo cộng đồng gán sai nguồn

Không giữ mẹo chỉ dẫn homepage hoặc bài nói về sản phẩm khác:

| Nguồn cũ | Kết quả đối chiếu / quyết định |
| --- | --- |
| [Linux.do 2217508](https://linux.do/t/topic/2217508) | Bài về Codex/AGENTS.md ngày 21/05/2026, không hỗ trợ mẹo Antigravity tự sinh rules hoặc “Reload 2 lần”. Bỏ cả hai cách gán; muốn lưu bài học thì tham khảo `/learn` chính thức ở trên. |
| [V2EX 1240028](https://v2ex.com/t/1240028) | Thảo luận model/usage Codex tháng 09/2026, không chứng minh khẩu quyết Antigravity tháng 10. Bỏ khẩu quyết. |
| Google AI Dev Forum, CSDN homepage | Không có permalink bài/bình luận hỗ trợ Drafting Flow hay tối ưu context được gán. **Chưa kiểm chứng**, không dùng làm hướng dẫn tính năng hoặc số liệu. |

Đề xuất của repo: giao đầu ra rõ, chỉ đưa ngữ cảnh liên quan, review kế hoạch và bằng chứng chạy. Đây là quy trình tự đề xuất, không gán cho một tác giả cộng đồng và không hứa tiết kiệm quota. Lịch sử trang bị chặn ở mục 6 được giữ; không suy nội dung từ snippet tìm kiếm.

### 3.6. Phân công theo quy ước repo, chưa phải benchmark model

| Mảng công việc | Phân công đề xuất | Căn cứ / giới hạn |
| --- | --- | --- |
| Rust/Anchor, review quyền và bảo mật | Codex chính, Antigravity hỗ trợ | Theo [AGENTS.md](../../AGENTS.md); chất lượng phải chứng minh bằng review/test cụ thể |
| Frontend và SDK | Antigravity chính, Codex có thể sửa/review theo nhiệm vụ | Quy ước phối hợp, không có bằng chứng model nào luôn nhanh/chính xác hơn |
| Kiểm tra UI | Agent đang có browser/computer-use phù hợp | Codex **có thể có công cụ UI** tùy client/quyền. Phiên sửa này có `cua_repl` và đã dùng browser đọc Dev3pack, không chạy lab frontend. [Codex browser](https://learn.chatgpt.com/docs/browser?surface=app); [Antigravity browser](https://antigravity.google/docs/browser) |
| Kế hoạch và bàn giao | Cả hai cập nhật docs/DEVLOG/HANDOFF | Chọn theo người phụ trách và công cụ có thật, không theo bảng ưu thế model chưa đo |

## 4. Ví dụ hoặc quy trình tối thiểu

Hai prompt sau tự soạn cho việc học, chưa được dùng làm benchmark. Không có lệnh cài đặt hoặc thay đổi cấu hình.

### Prompt nghiên cứu có phạm vi

```text
Đọc docs/learning/README.md và _TEMPLATE.md.
Giải thích owner, signer và authority bằng một ví dụ counter PDA.
Chỉ sửa note được chỉ định; không sửa code sản phẩm, không cài gì,
không tạo keypair, không gọi mainnet hoặc deploy.
Đối chiếu docs/source Anchor 1.2.2. Với mỗi nhận định về API,
ghi link và nói rõ đã đọc nguồn hay đã chạy thử.
Thêm ba câu hỏi tự kiểm tra và đáp án; kiểm tra link và Markdown diff.
Nếu nguồn mâu thuẫn, nêu khác biệt và căn cứ chọn, không đoán API.
```

### Prompt review bảo mật trên giấy

```text
Review đoạn Anchor được cung cấp theo note 007, chỉ phân tích.
Với mỗi finding: chỉ rõ account/instruction bị ảnh hưởng,
điều kiện khai thác, invariant bị phá và một negative test.
Phân biệt lỗi có căn cứ, câu hỏi cần thêm code và đoạn đã an toàn.
Không coi Signer là đủ nếu chưa kiểm tra quan hệ với authority.
Không khai test pass khi chưa có log chạy. Không cài hoặc deploy.
```

Chu trình đề xuất: đọc file/version → chốt đầu ra → xử lý một mục có thể review → kiểm tra phù hợp → commit đường dẫn cụ thể → cập nhật bàn giao. Khi bị thiếu compiler, hoàn thành phần phân tích rồi ghi rõ phần chưa chạy, không tự cài để “làm cho test xanh”.

## 5. Tự kiểm tra

1. Bài trên OpenAI Community là hướng dẫn chính thức không? **Không tự động**; xem người đăng và đối chiếu docs sản phẩm.
2. Reddit nói model X/effort Y tốt nhất: có đủ để đổi cấu hình không? **Không**; đó là kinh nghiệm theo bối cảnh khác, cần thử có tiêu chí và tôn trọng lựa chọn của người dùng.
3. Trang trả 403 nhưng search có snippet: có được viết “đã đọc bài” không? **Không**; ghi không truy cập được và bỏ mẹo chưa xem.
4. Làm gọn prompt bằng cách xóa ranh giới “không mainnet” có hợp lý không? **Không**; bớt nội dung thừa nhưng giữ mục tiêu và giới hạn quan trọng.
5. Bài tập: viết prompt review `increment` gồm đầu vào, scope, ba ca sai quyền, nguồn và đầu ra. **Đạt** khi có tiêu chí kiểm tra và không cấp quyền cài/deploy ngoài ý định.
6. Bài tập: lập phiếu so sánh hai lần chạy cùng bài. **Đáp án gợi ý:** cùng code/version; ghi model/effort, thời gian, số finding đúng/sai, số vòng sửa; không kết luận từ tốc độ đơn lẻ.
7. Khi nào cân nhắc `/plan` trong Antigravity? **Đáp án:** Khi cần nghiên cứu và review kế hoạch trước sửa, theo [docs Plan](https://antigravity.google/docs/plan/); không tự gán các chế độ hoặc cơ chế phê duyệt khác nếu chưa kiểm tra surface.
8. Trong Antigravity, sự khác biệt căn bản giữa Rules và Skills là gì? **Đáp án:** Rules định nghĩa các ràng buộc cứng và tiêu chuẩn bất biến vĩnh viễn (Invariants: không mainnet, coding standard, không commit secrets); Skills định nghĩa các chuỗi hành động nhiều bước có thể gọi khi cần (Actionable workflows).

## 6. Nguồn và độ tin cậy

Đã khảo sát đủ các nhóm được yêu cầu bằng tìm kiếm và đọc trang truy cập được. Từ khóa gồm `Codex tips AGENTS.md 2026`, `Codex 使用技巧`, `AGENTS.md 怎么写`, `Codex 省额度`, `Antigravity 使用技巧`, `Antigravity 规则`, `Gemini 3.8 Flash 体验`. Không coi ngày crawl là ngày xuất bản; nguồn chỉ hiện thời gian tương đối được ghi như vậy.

| Nhóm nguồn | Bằng chứng truy cập ngày 17/11/2026 | Cách sử dụng |
| --- | --- | --- |
| OpenAI docs/blog | [Best practices](https://learn.chatgpt.com/guides/best-practices), [Models](https://learn.chatgpt.com/docs/models.md), [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [MCP](https://learn.chatgpt.com/docs/extend/mcp), [Harness engineering](https://openai.com/index/harness-engineering/) | Nguồn chính thức; ưu tiên khi xác nhận tính năng và cách cấu hình |
| Google Antigravity docs | Permalink từng tính năng tại mục 3.4 | Đã đọc trang chi tiết ngày 17/11/2026; giới hạn theo surface/version |
| Google AI Dev Forum | Bản cũ chỉ dẫn homepage | Chưa kiểm chứng bài cụ thể; đã bỏ mẹo gán cho forum |
| OpenAI Community | [EricGT #35](https://community.openai.com/t/tips-and-tricks-for-using-codex-and-rate-limits/1373143/35), 24/08/2026 | Đọc được; mẹo cộng đồng |
| GitHub | [Issue #13386](https://github.com/openai/codex/issues/13386), 03/03/2026 | Đọc được; báo cáo người dùng trên bản cũ |
| Reddit | [Bài và bình luận](https://www.reddit.com/r/codex/comments/1u97eq0/how_to_make_codex_work_fantastically/), trang hiển thị khoảng 5 tháng trước | Đọc được; không dùng suy đoán và quảng cáo |
| Hacker News | [Discussion](https://news.ycombinator.com/item?id=47034087), trang hiển thị khoảng 9 tháng trước | Đọc được; giữ cả ý kiến bất đồng |
| X | [OpenAIDevs post](https://x.com/OpenAIDevs/status/2033637455136731431) | Mở trực tiếp trả **403**; không rút mẹo từ snippet tìm kiếm |
| DEV | [Bài ngày 30/10/2026](https://dev.to/plexsicity/how-to-share-ai-coding-agent-context-across-a-team-4h3j) | Đọc được; có nội dung thương mại, chỉ lấy ý tưởng tổ chức ngữ cảnh |
| 掘金 Juejin | [Trang đã thử](https://juejin.cn/post/7640433215140757514) | Chỉ trả **“Please wait…”**; không đọc được bài, bỏ qua |
| CSDN | [AGENTS.md 实战](https://aicoding.csdn.net/6a27ee3510ee7a33f279c491.html), 09/06/2026 | Đọc được phần bài; diễn giải mẹo ở mục 3.2 |
| V2EX | [Discussion](https://v2ex.com/t/1240028), tháng 09/2026 | Nguồn Codex ở mục 3.2; không hỗ trợ mẹo Antigravity |
| 知乎 Zhihu | [Trang đã thử](https://zhuanlan.zhihu.com/p/2047691425916138736) | **403**; bỏ qua, không vượt chặn |
| Linux.do | [Bài chia sẻ Codex AGENTS.md](https://linux.do/t/topic/2217508), 21/05/2026 | Nguồn Codex ở mục 3.2; không hỗ trợ reload MCP của Antigravity |
| Bilibili | [Video đã thử](https://www.bilibili.com/video/BV12igX6RE1i/) | **412**; không xem được video/transcript, bỏ qua |

Không có mẹo nào ở đây dựa trên tutorial trước 2025. Các kết luận về phiên bản CLI cũ không được tự động áp dụng cho bản tháng 11/2026.

## 7. Điểm chưa kiểm chứng và bước tiếp theo

Chưa đo A/B hiệu quả prompt, tốc độ, usage hoặc độ chính xác của mẹo cộng đồng; chưa xác minh build desktop/model đang chọn. X, Juejin, Zhihu, Bilibili chưa đọc được nội dung gốc. Không biến các khoảng trống này thành bằng chứng thuận hay chống một mẹo.

Áp dụng trước ba việc ít phụ thuộc công cụ: đầu ra rõ, nguồn đúng version, bàn giao có bước kế tiếp. Luật chạy tiếp sau compact đã nằm trong [AGENTS.md](../../AGENTS.md). R03 đã sửa nguồn phần Antigravity; các kết quả sandbox do phiên trước báo cáo vẫn chưa được tái chạy.

### Bài học / lỗi đã gặp

Permalink phải hỗ trợ đúng sản phẩm và đúng mẹo được gán. Tài liệu tính năng, trải nghiệm cộng đồng và phép đo model/quota là các mức bằng chứng khác nhau; công cụ UI phải xét theo client/quyền thực tế, không gán giới hạn chung cho tên agent.

Ngày 17/11/2026, Codex đã tạo automation `Dev3pack — nhắc trưởng nhóm mỗi 15 phút` theo nguyên văn người dùng bằng công cụ chính thức `mcp__codex_app__automation_update`, loại `heartbeat` gắn với chat hiện tại. Đã mở lại thẻ automation trong app và đọc cấu hình lưu cục bộ: trạng thái `ACTIVE`, chu kỳ 15 phút, đúng nội dung và chat đích. Đây là bằng chứng đã tạo và kiểm tra cấu hình; chưa quan sát lượt nhắc đầu tiên. Khi cần nhắc vào cùng chat, dùng heartbeat và kiểm tra chat đích sau khi tạo; chỉ nói “đã tạo” khi công cụ trả thành công, không suy ra từ ý định hoặc lời hứa của agent.


Ngày 17/11/2026, khi bàn giao tại HEAD a7b8af1, HANDOFF còn trộn bảng setup cũ với ghi chú mới ở cuối: platform-tools đã exit0, hello runtime tests đã đạt và IDL đã sinh nhưng bước tiếp theo vẫn là poll installer cũ. Đã chuyển nguyên snapshot sang archive và viết lại phần hiện hành từ refs/status/logs cùng bàn giao phiên trước. Bài học: thay thông tin đã lỗi thời ngay trong Thẻ nhớ và Còn lại; giữ rõ exit code của từng bước, process còn cần poll, file chưa commit và cổng chưa đạt. Lưu HANDOFF không tự chứng minh chat đã compact; yêu cầu chỉ bàn giao trong một lượt không đổi goal thành complete/paused.
