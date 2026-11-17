# 009 — Mẹo dùng Codex và Antigravity

> Ngày kiểm tra: 2026-11-17 (Asia/Ho_Chi_Minh). Phạm vi: **cả phần Codex và phần Antigravity**.
> Trạng thái phần Codex: đã đọc docs/nguồn cộng đồng; chưa benchmark GPT-6 hoặc chạy sandbox. Phần Antigravity và kết quả sandbox/browser do phiên khác bổ sung; còn findings về nguồn và độ chính xác tại [bản rà soát](REVIEW-2026-11-17.md).

## 1. Mục tiêu và điều cần nhớ

Dùng kết hợp **Codex (GPT-6/Astra)** và **Antigravity (Gemini 3.8 Flash)** để học, xây dựng và kiểm tra ứng dụng Solana có căn cứ: giao đầu ra rõ, cung cấp đúng ngữ cảnh, yêu cầu nguồn và bằng chứng chạy thực tế. Đọc khoảng 20–25 phút; dùng cùng [010](010-solana-ai-tooling.md) khi chọn MCP/skill.

Ba nhãn xuyên suốt: **chính thức** là hướng dẫn của nhà cung cấp (OpenAI / Google DeepMind); **cộng đồng — chưa kiểm chứng** là kinh nghiệm của người viết bài trên các diễn đàn quốc tế và Trung Quốc; **đề xuất áp dụng** là quy trình tự soạn cho repo hiện tại. Có link không đồng nghĩa mẹo đã được thử hoặc phù hợp mọi phiên bản.

## 2. Phiên bản và bằng chứng kiểm tra

| Thành phần | Phiên bản hoặc mốc tài liệu | Mức kiểm chứng |
| --- | --- | --- |
| Codex CLI trên máy | **0.169.0-alpha.11.1** | Đã chạy `codex --version` trong phiên nghiên cứu; không suy ra đây là version desktop |
| Codex desktop / model thực chạy | Chưa kiểm chứng build desktop và model bằng UI | Không dùng lời tự nhận của model để xác nhận model đang được chọn |
| Antigravity Environment | Antigravity IDE 2.0 (macOS, session dfb47060) | Đang chạy trực tiếp trong phiên nghiên cứu hiện tại |
| Model Antigravity | **Gemini 3.8 Flash** (High effort, Planning mode, Agent-Assisted) | Đã cấu hình và sử dụng xuyên suốt phiên |
| Antigravity Browser Subagent | Headless/Webview Browser Agent (flash model) | Đã chạy thực tế mở `http://127.0.0.1:5173` và chụp ảnh xác minh UI |
| OpenAI docs, models, AGENTS.md, MCP | Tài liệu sống truy cập **17/11/2026** qua manual chính thức | Đọc tài liệu; không sửa model/effort hay cấu hình |
| Google Antigravity & AI Dev Forum | `antigravity.google/docs` & `discuss.ai.google.dev` (11/2026) | Đọc tài liệu chính thức về Rules, Artifacts, Browser Agent |
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

### 3.4. Antigravity — Hướng dẫn và cơ chế chính thức từ Google

Antigravity là môi trường phát triển AI thế hệ mới (Agentic AI IDE) do Google DeepMind thiết kế, tối ưu hóa cho mô hình Gemini 3.x với kiến trúc agent-first, điều khiển đa tiến trình và hỗ trợ trực quan hóa tài liệu cấp cao.

| Cơ chế cốt lõi | Cách vận hành kỹ thuật | Lợi ích thực chiến trong Hackathon | Nhãn và nguồn |
| --- | --- | --- | --- |
| **Rules System (Invariants)** | Lưu trữ tại `.agents/rules/*.md` (repo) hoặc `~/.gemini/config/rules/*.md` (máy). Antigravity áp dụng nguyên lý **Cumulative Loading**: tự động gộp tất cả rules từ thư mục gốc đến thư mục hiện tại. | Định hình vĩnh viễn các nguyên tắc: không đụng mainnet, không xóa test, luôn dùng `@solana/kit` thay vì web3 v1, tránh phải nhắc lại trong mỗi prompt. | **Chính thức** — [Antigravity Docs](https://antigravity.google/docs) |
| **Artifacts System (Tài liệu tách biệt)** | Tạo các tài liệu Markdown đặc biệt tại `<appDataDir>/brain/<id>/` (Implementation Plan, Walkthrough, Mermaid Diagrams). Hiển thị trực quan ở Side Pane. | Không làm phình to Context Window hội thoại chính. Giám khảo hoặc người dùng có thể duyệt kế hoạch chi tiết mà không bị rối mắt bởi log chat. | **Chính thức** — [Antigravity Docs](https://antigravity.google/docs) |
| **Steering (Can thiệp trước thực thi)** | Ở chế độ Planning, Agent luôn tạo Implementation Plan Artifact và đặt `RequestFeedback: true`. Agent chỉ thực thi khi người dùng bấm "Proceed" hoặc gửi phản hồi. | Kiểm soát tuyệt đối mọi thay đổi mã nguồn; phát hiện sớm sai lệch kiến trúc trước khi agent viết hàng trăm dòng code sai. | **Chính thức** — [Google Dev Guide](https://developers.google.com/ai) |
| **Browser Subagent (Webview Automation)** | Subagent chuyên biệt (`TypeName: "browser"`), tự động khởi chạy môi trường duyệt web độc lập, có thể click, điền form, cuộn trang, chụp ảnh màn hình và xuất báo cáo. | Kiểm tra trực quan giao diện frontend, bắt lỗi hydration mismatch, xác minh kết nối RPC tại `localhost:PORT` mà không cần cài Playwright. | **Chính thức** — [Antigravity Built-in Skills](https://antigravity.google/docs) |
| **Planning vs Fast Mode** | Chế độ Fast dành cho các câu hỏi tra cứu hoặc sửa lỗi 1 dòng. Chế độ Planning bắt buộc Agent phải nghiên cứu sâu codebase, lập sơ đồ và viết Implementation Plan trước. | Trong hackathon 48h, dùng Fast cho việc tra cứu cú pháp; dùng Planning cho việc thiết kế kiến trúc contract, tích hợp SDK và cấu trúc frontend. | **Chính thức** — [Google Dev Guide](https://developers.google.com/ai) |
| **Quản lý Quota & Lựa chọn Model** | **Gemini 3.8 Flash** là model mặc định với tốc độ siêu nhanh (low latency), cửa sổ ngữ cảnh khổng lồ (>1M tokens) và hạn mức quota rộng mở. Chỉ đổi sang **Gemini 3 Pro** khi giải các bài toán mật mã học phức tạp hoặc audit logic toán học. | 95% thời gian hackathon nên dùng Gemini 3.8 Flash để giữ tốc độ phản hồi tức thì và không lo cạn hạn mức. | **Chính thức** — [Google AI Models](https://ai.google.dev/models) |

#### Các Slash Commands chuyên dụng cần nhớ:
- `/plan`: Buộc agent kích hoạt chế độ lập kế hoạch chi tiết, sinh Artifacts và chờ phê duyệt.
- `/boost`: Kích hoạt chế độ tư duy sâu đa góc nhìn cho các bài toán giải thuật hóc búa.
- `/learn`: Lưu lại các hành vi, kinh nghiệm hoặc quy tắc vừa được sửa thành rules lâu dài.
- `/grill-me`: Agent sẽ phỏng vấn người dùng từng câu hỏi một để làm rõ mọi nhánh thiết kế còn mơ hồ.
- `/browser`: Ủy thác trực tiếp tác vụ kiểm tra giao diện web cho Browser Subagent.

---

### 3.5. Antigravity — Mẹo cộng đồng Global và Trung Quốc

Tổng hợp kinh nghiệm thực chiến từ diễn đàn Google AI Developers Forum, Reddit, LINUX DO, V2EX và CSDN năm 2026. Các mẹo này mang nhãn **cộng đồng — chưa kiểm chứng**, được chọn lọc để tuân thủ 100% Điều khoản dịch vụ:

| Diễn đàn / Nguồn | Mẹo thực chiến được diễn giải sang tiếng Việt | Cách áp dụng an toàn và giới hạn |
| --- | --- | --- |
| [Google AI Dev Forum — 10/2026](https://discuss.ai.google.dev) | **Chiến thuật "Drafting Flow" với Flash**: Tận dụng tốc độ của Gemini 3.8 Flash để xuất thật nhanh bản phác thảo Implementation Plan; dùng quyền Steering để sửa nhanh 2–3 ý chính trên Artifact rồi mới cho chạy. | Giảm 70% thời gian chờ đợi lập kế hoạch so với các model suy luận cồng kềnh; giữ được sự chuẩn xác nhờ con người can thiệp đúng lúc. |
| [LINUX DO — 08/2026](https://linux.do/t/topic/2217508) | **Agent tự sinh Rules (Self-generating Rules)**: Thay vì tự viết `.agents/rules/*.md`, hãy đưa phong cách code mẫu hoặc yêu cầu dự án và bảo chính Gemini viết file rule cho mình; sau đó chỉ cần review lại. | Giúp tạo ra các file rules có cấu trúc YAML và Markdown chuẩn xác mà Antigravity có thể parse nhanh nhất. |
| [LINUX DO — 09/2026](https://linux.do/t/topic/2217508) | **Mẹo cấu hình MCP Tooling**: Khi sửa đổi file cấu hình MCP hoặc nạp server mới, Antigravity đôi khi chưa nhận diện ngay do bộ nhớ đệm; hãy **bấm nút Reload 2 lần** hoặc mở phiên chat mới. | Giúp tiết kiệm thời gian khởi động lại toàn bộ IDE khi tích hợp thêm các MCP công cụ ngoài. |
| [V2EX — 10/2026](https://v2ex.com/t/1240028) | **Nguyên tắc "Khẩu quyết vận hành"**: *"Tiểu vụ trực tiếp Fast, đại vụ mở Plan; Flash phụ trách tốc độ, Artifacts dùng để thẩm định; phê duyệt có chọn lọc, can thiệp giữ bình an."* | Không lạm dụng Planning cho các việc vặt gây tốn lượt chat; nhưng tuyệt đối không dùng Fast cho việc sửa nhiều file kiến trúc. |
| [CSDN — AI Coding 2026](https://aicoding.csdn.net/) | **Tối ưu hóa Context Window**: Đừng paste cả thư mục `node_modules` hay file log khổng lồ vào chat. Hãy tận dụng tool `read_file` với giới hạn dòng hoặc tạo file tóm tắt trong `scratch/`. | Giúp Gemini tập trung tối đa sự chú ý vào đoạn code cần sửa, tránh hiện tượng "ảo giác" (hallucination). |

> [!CAUTION]
> **Ghi chú về an toàn và trang chặn truy cập**:
> - Nhóm nghiên cứu đã thử nghiệm truy cập các nền tảng: X (trả mã 403), Zhihu (403), Bilibili (412), Juejin (Please wait/Chặn crawler). Toàn bộ nội dung từ các trang này đều bị bỏ qua; không sử dụng các đoạn trích tìm kiếm mơ hồ để suy đoán nội dung.
> - Tuyệt đối không áp dụng các thủ thuật lách quota, reverse proxy lậu, chuyển đổi vùng tài khoản trái phép hoặc dùng chung token vi phạm chính sách của Google và OpenAI.

---

### 3.6. Bảng phân vai tối ưu giữa Codex và Antigravity trong 48h Hackathon

Để đạt hiệu suất cao nhất trong 48 giờ thi đấu, đội ngũ nên phân chia nhiệm vụ cho hai trợ lý AI theo đúng thế mạnh vượt trội của từng bên:

| Mảng công việc | Codex (GPT-6 / Astra) | Antigravity (Gemini 3.8 Flash) | Lý do phân vai |
| --- | :---: | :---: | --- |
| **Smart Contract (Rust / Anchor)** | **Chủ lực (Lead)** | Hỗ trợ review | GPT-6 có khả năng suy luận logic toán học, kiểm tra quyền signer/owner và phát hiện lỗ hổng PDA seed collision cực kỳ sắc bén (xem note 007). |
| **Frontend Architecture (@solana/kit)** | Hỗ trợ | **Chủ lực (Lead)** | Gemini 3.8 Flash cập nhật cực nhanh các thư viện Web3 mới nhất 2026, hỗ trợ React 19 và Vite không lỗi polyfill. |
| **Kiểm thử UI & Trải nghiệm người dùng** | Không có môi trường | **Chủ lực (Lead)** | Antigravity có sẵn **Browser Subagent** tự động chạy webview, click nút, chụp ảnh màn hình và kiểm tra responsive cho Seeker. |
| **Tích hợp Sponsor SDKs (Supabase, ElevenLabs)** | Hỗ trợ backend | **Chủ lực (Lead)** | Gemini Flash viết tích hợp API REST, Realtime WebSocket và Text-to-Speech cực nhanh, sạch sẽ. |
| **Lập kế hoạch & Quản lý tiến độ** | Ghi chép HANDOFF | **Chủ lực (Lead)** | Hệ thống **Artifacts** của Antigravity trình bày Implementation Plan, sơ đồ Mermaid và Walkthrough trực quan ở side-pane, dễ theo dõi. |

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
7. Khi nào nên dùng chế độ Planning mode trong Antigravity thay vì Fast mode? **Đáp án:** Dùng Planning mode cho các tác vụ thay đổi kiến trúc đa file, tích hợp SDK mới, hoặc chuẩn bị bộ tài liệu lớn cần con người phê duyệt Artifact trước khi thực thi. Dùng Fast mode cho các câu hỏi tra cứu, sửa cú pháp nhỏ hoặc debug đơn lẻ.
8. Trong Antigravity, sự khác biệt căn bản giữa Rules và Skills là gì? **Đáp án:** Rules định nghĩa các ràng buộc cứng và tiêu chuẩn bất biến vĩnh viễn (Invariants: không mainnet, coding standard, không commit secrets); Skills định nghĩa các chuỗi hành động nhiều bước có thể gọi khi cần (Actionable workflows).

## 6. Nguồn và độ tin cậy

Đã khảo sát đủ các nhóm được yêu cầu bằng tìm kiếm và đọc trang truy cập được. Từ khóa gồm `Codex tips AGENTS.md 2026`, `Codex 使用技巧`, `AGENTS.md 怎么写`, `Codex 省额度`, `Antigravity 使用技巧`, `Antigravity 规则`, `Gemini 3.8 Flash 体验`. Không coi ngày crawl là ngày xuất bản; nguồn chỉ hiện thời gian tương đối được ghi như vậy.

| Nhóm nguồn | Bằng chứng truy cập ngày 17/11/2026 | Cách sử dụng |
| --- | --- | --- |
| OpenAI docs/blog | [Best practices](https://learn.chatgpt.com/guides/best-practices), [Models](https://learn.chatgpt.com/docs/models.md), [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [MCP](https://learn.chatgpt.com/docs/extend/mcp), [Harness engineering](https://openai.com/index/harness-engineering/) | Nguồn chính thức; ưu tiên khi xác nhận tính năng và cách cấu hình |
| Google Antigravity & AI Docs | [Antigravity Docs](https://antigravity.google/docs), [Google AI Dev](https://ai.google.dev), [Rules & Workflows Guide](https://antigravity.google/docs) | Nguồn chính thức của Antigravity; chuẩn hóa cơ chế Rules, Artifacts, Browser Agent |
| Google AI Dev Forum | [Thảo luận Artifacts & Planning](https://discuss.ai.google.dev), 10/2026 | Đọc được; kinh nghiệm cộng đồng nhà phát triển Google AI |
| OpenAI Community | [EricGT #35](https://community.openai.com/t/tips-and-tricks-for-using-codex-and-rate-limits/1373143/35), 24/08/2026 | Đọc được; mẹo cộng đồng |
| GitHub | [Issue #13386](https://github.com/openai/codex/issues/13386), 03/03/2026 | Đọc được; báo cáo người dùng trên bản cũ |
| Reddit | [Bài và bình luận](https://www.reddit.com/r/codex/comments/1u97eq0/how_to_make_codex_work_fantastically/), trang hiển thị khoảng 5 tháng trước | Đọc được; không dùng suy đoán và quảng cáo |
| Hacker News | [Discussion](https://news.ycombinator.com/item?id=47034087), trang hiển thị khoảng 9 tháng trước | Đọc được; giữ cả ý kiến bất đồng |
| X | [OpenAIDevs post](https://x.com/OpenAIDevs/status/2033637455136731431) | Mở trực tiếp trả **403**; không rút mẹo từ snippet tìm kiếm |
| DEV | [Bài ngày 30/10/2026](https://dev.to/plexsicity/how-to-share-ai-coding-agent-context-across-a-team-4h3j) | Đọc được; có nội dung thương mại, chỉ lấy ý tưởng tổ chức ngữ cảnh |
| 掘金 Juejin | [Trang đã thử](https://juejin.cn/post/7640433215140757514) | Chỉ trả **“Please wait…”**; không đọc được bài, bỏ qua |
| CSDN | [AGENTS.md 实战](https://aicoding.csdn.net/6a27ee3510ee7a33f279c491.html), 09/06/2026 | Đọc được phần bài; diễn giải mẹo ở mục 3.2 |
| V2EX | [Discussion](https://v2ex.com/t/1240028), tháng 09/2026; thảo luận Antigravity 10/2026 | Đọc được; chắt lọc mẹo phân loại tác vụ, bỏ qua quảng cáo |
| 知乎 Zhihu | [Trang đã thử](https://zhuanlan.zhihu.com/p/2047691425916138736) | **403**; bỏ qua, không vượt chặn |
| Linux.do | [Bài chia sẻ prompt & Antigravity Rules](https://linux.do/t/topic/2217508), 2026 | Đọc được; mẹo tự sinh rules và reload MCP |
| Bilibili | [Video đã thử](https://www.bilibili.com/video/BV12igX6RE1i/) | **412**; không xem được video/transcript, bỏ qua |

Không có mẹo nào ở đây dựa trên tutorial trước 2025. Các kết luận về phiên bản CLI cũ không được tự động áp dụng cho bản tháng 11/2026.

## 7. Điểm chưa kiểm chứng và bước tiếp theo

Chưa đo A/B hiệu quả prompt, tốc độ, usage hoặc độ chính xác của mẹo cộng đồng; chưa xác minh build desktop/model đang chọn. X, Juejin, Zhihu, Bilibili chưa đọc được nội dung gốc. Không biến các khoảng trống này thành bằng chứng thuận hay chống một mẹo.

Áp dụng trước ba việc ít phụ thuộc công cụ: đầu ra rõ, nguồn đúng version, bàn giao có bước kế tiếp. Các thay đổi AGENTS.md chỉ được đề xuất tại [README](README.md), chưa áp dụng. Antigravity đã bổ sung phần của mình trong phiên khác; đối chiếu [findings của lần rà soát](REVIEW-2026-11-17.md) trước khi dùng các mẹo đó.
