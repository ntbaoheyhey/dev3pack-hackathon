# DEVLOG

Mỗi dòng: ngày · ai làm (Mai / Codex / Antigravity) · việc · note đã cập nhật.

- 2026-11-17 · Codex · Nhận Prompt 03 trưởng nhóm, xác minh automation, đồng bộ main/work và giữ cả hai phía conflict DEVLOG; chuyển lịch sử HANDOFF vào archive, viết Thẻ nhớ, RUBRIC v1.2 giữ nguyên trọng số/ngưỡng, giao A T3/T4/T5 · Note 019 cập nhật quy trình evidence.

## 2026-11-17 — Claude (điều phối): Codex trưởng nhóm, Antigravity trợ lý; chống dừng và chống quên

- Chấm Phase 1 trên `work`: Codex xong 015/016/019, RUBRIC v1.1 có hiệu chỉnh, review A/C; chưa có ý tưởng của Codex. Antigravity: note 017/018/020 rất ngắn và thiếu nguồn; 3 ý tưởng 76/100 không hợp lệ (không link bằng chứng, F=4 khi chưa spike, một tổng tính sai); `GOAL_COMPLETE` sai.
- Người dùng đổi vai: Codex chủ trì, Antigravity là trợ lý nhận việc qua `docs/tasks/A-queue.md`, báo ở `docs/tasks/A-done.md`.
- Thêm `docs/STOP-CAUSES.md` (S1–S7 dừng, K1–K3 quên context); AGENTS.md thêm "Chống dừng giữa chừng" và "Chống quên context" (Thẻ nhớ đầu HANDOFF). Prompt 03 cho hai bên kèm nội dung tin nhắn tự nhắc 15 phút.

- 2026-11-17 · Codex · Tạo và xác minh automation heartbeat nhắc trưởng nhóm mỗi 15 phút vào chính chat theo nguyên văn người dùng; đã mở thẻ trong app, đối chiếu nội dung/lịch/trạng thái/chat đích, chưa quan sát lượt nhắc đầu tiên · Cập nhật note [009](learning/009-tips-codex-antigravity.md).

## 2026-11-17 — Claude (điều phối): luật làm cặp, không chờ nhau

- Người dùng phản ánh hai agent thay phiên dừng để chờ nhau; Codex không tạo Automation tự đánh thức nên dừng hẳn; Antigravity báo chờ 015/016 dù đã có trên `origin/work` (487d5cf).
- AGENTS.md thêm "Luật làm cặp": tự đánh thức bắt buộc và phải xác nhận, fetch trước khi nói thiếu, thiếu thì làm việc khác, review không chặn, chỉ người dùng mới chặn được việc.
- Prompt 02 hai bên: Codex là chủ và người quyết RUBRIC, chốt v1 không chờ duyệt; Antigravity góp ý bất đồng bộ; khi chờ người dùng thì làm việc đi trước.

## 2026-11-17 — Claude (điều phối): Phase 1 học cách chấm trước, vòng lặp tới ngưỡng

- Theo góp ý người dùng: Phase 1 phải học cách chấm ý tưởng và lập bộ chấm chung trước khi tìm ý tưởng; ý tưởng chỉ hợp lý khi vượt ngưỡng sau vòng lặp chấm–sửa.
- Thay prompt Phase 1 bằng một prompt lớn cho mỗi agent (`prompts/02-*-phase1.md`), chạy từ học cách chấm tới hết Phase 2, chỉ dừng một lần để người dùng chọn ý tưởng. Đặt chỗ note 015–020.

## 2026-11-17 — Claude (điều phối): lập ROADMAP 9 phase build app

- Chấm phần học 002–014: tốt về nguồn và ghi giới hạn; thiếu thực hành (chưa cài/compile/deploy), chưa có ý tưởng sản phẩm, thiếu một số chủ đề kỹ thuật, chưa có quy trình phối hợp khi build.
- Người dùng chốt: build ngay từ bây giờ, mỗi phase là một bước làm app; học sinh học đúng thứ phase cần rồi làm.
- Tạo `docs/ROADMAP.md`: 1 ý tưởng & spec → 2 kiến trúc → 3 môi trường (song song) → 4 program ∥ 5 frontend → 6 tích hợp → 7 hoàn thiện → 8 trong sự kiện → 9 demo & nộp. Mỗi phase có danh sách cần học, việc làm, cổng ra, người chủ trì. Ghi luật tự đánh thức mỗi 15 phút.
- AGENTS.md thêm bước 0 đọc ROADMAP; README trỏ tới ROADMAP.

## 2026-11-17 — Codex: sửa PR #1 và findings của phần Antigravity

**Trạng thái: xong.** R01–R09 đã sửa và push; các giới hạn kiểm chứng được giữ rõ trong REVIEW.

- Đã xác nhận đúng đường dẫn/remote; merge `origin/main` vào `prompts/01-learning`, không rebase; push merge `58ffb5a`. Giữ nội dung main, thêm luật đọc bàn giao và `docs/HANDOFF-TEMPLATE.md`.
- R01 · sửa 014 do Antigravity viết: giữ key ElevenLabs ở backend, thêm guard do app cung cấp, browser chỉ nhận audio; dẫn Authentication/Create speech. Chưa gọi API, chưa build/deploy mẫu.

- R02 · sửa 005: parse nguyên mã và program ID từ runtime log, tra map riêng theo IDL; CPI mơ hồ trả bằng chứng thay vì đoán. Kiểm tra 11 fixture Node offline, không gọi chain.

- R03 · sửa 009 do Antigravity bổ sung: nguồn trực tiếp cho từng cơ chế/lệnh, bỏ số liệu và mẹo gán nhầm forum; phân vai là quy ước repo, Codex có UI khi client cấp công cụ. Dùng skill openai-docs, đối chiếu nguồn Google/OpenAI và công cụ của phiên.

- R04 / Phần 3 · sửa 001, 012, 013, 014 theo Dev3pack trang chủ/FAQ đã đọc bằng browser: sponsors, giải, track, hai vòng chấm, video, form, deadline và code. Ghi rõ trọng số tự đề xuất; tách lịch sử Colosseum/Superteam, cập nhật nguồn pricing và bỏ thời gian tích hợp không đo. Kịch bản thời lượng/lời thoại tiếp tục xử lý riêng R07.

- R05 · sửa 006: destination withholding, hai đường harvest/withdraw và authority; bỏ con số rent thiếu cấu hình, bài 500.000 cNFT dưới 1 SOL ghi chưa đủ căn cứ. Ví dụ 10.000 raw units/1% tính trên giấy; không RPC.

- R06 · sửa 008: URL spec đúng, pin source protocol 3.0.2 (`2695142`), `accounts[0].address`, phân biệt raw base64 với Wallet Standard bytes; bỏ ví dụ ký/gửi trộn wrapper. Chưa cài/compile/kết nối ví; nhãn mobile là gợi ý chứ chưa phải điều kiện track.

- R07 · viết lại 013: bảng và script 15+20+80+30+20 = 165 giây, biên 15 giây; thay thành tích latency/rent/PDA/48h bằng placeholder cần bằng chứng. Chỉ kiểm thời lượng kế hoạch, chưa có video xuất.

- R08 · sửa 005 theo CLI README/manifest cùng commit Codama `141998e`, version source 2.0.0-rc.0: init → config renderer → run js; bỏ lệnh và tên generated suy đoán. JSON config parse được, chưa chạy CLI/codegen/cài package; bộ tương thích còn chưa kiểm chứng.

- R04 bổ sung · kiểm tra cấu trúc phát hiện phần 014 cũ bị giữ sót do tiêu đề SDK trùng chuỗi mục 4; đã xóa ma trận/bounty cũ để chỉ còn hướng dẫn đã kiểm chứng. Kiểm tra lại mọi nhận định bounty/Free Tier trong bản hiện hành.

- R09 · chuẩn hóa heading cấp hai mục 4 của 005/006/008/012/013/014 thành “Ví dụ hoặc quy trình tối thiểu”, giữ tiêu đề chuyên biệt cấp ba. Lượt đầu sửa năm file; lượt hoàn tất sửa 014 sau khi loại nội dung cũ, kiểm tra đủ sáu file.

- R04 bổ sung khi rà soát cuối · sửa cách gán “khuyến nghị chính thức Dev3pack 48h” trong 005 và lời hứa PWA đạt điểm tối đa/tiêu chí mobile bắt buộc trong 008. Đây là đề xuất nội bộ chưa đo; không suy thời gian tích hợp hoặc điểm giải từ lựa chọn framework.

- Hoàn tất nội dung · đồng bộ README và [REVIEW](learning/REVIEW-2026-11-17.md) với trạng thái/commit R01–R09; giữ snapshot cũ dưới nhãn lịch sử, chuẩn hóa “Bài học / lỗi đã gặp” và phân biệt sandbox Antigravity với kiểm tra Codex. Không đụng repo Taskbar Hero.
- Kiểm tra trước push · 27 Markdown tracked, 52 fenced blocks cân bằng, 103 link cục bộ có đích, 3 JSON parse được; sáu heading mục 4 và bảng/script 165 giây khớp. Mã parser cuối khớp mã đã đạt 11 fixture offline. Lịch sử HANDOFF/main, mục lục cũ và mẫu trống được bảo toàn; whitespace/scope đạt. Không chạy integration, cài đặt, RPC, keypair hoặc deploy; giới hạn còn lại ghi trong REVIEW.

- Push và xác minh · `d14a435fa70dee7f519291e8c0fd6606471f673a` đã lên `origin/prompts/01-learning`, local/remote khớp và working tree sạch. GitHub xác nhận PR #1 open/draft, merged=false, mergeable=true sau khi tính lại; main vẫn `ab3561207384aad7b62d282628a23446b54c02cb`. Bản ghi đóng task này chỉ cập nhật DEVLOG/HANDOFF, tiếp tục cùng nhánh; không merge PR.

## Trước sự kiện

- 2026-11-17 · Claude · Dựng khung repo, quy tắc "học trước, ghi lại", research Codex vs Antigravity · 000, 001

## Hackathon (27–29/11/2026)

_(bắt đầu sau tag `hackathon-start`)_

## Cần Codex

_(Antigravity ghi yêu cầu thay đổi program ở đây)_

## 2026-11-17 — Codex: chuyển bộ ghi chú về đúng repo

- Gộp toàn bộ 18 file tài liệu từ Taskbar Hero (snapshot `1c7e502`): 12 file Codex đã tạo/chạm và 6 note do Antigravity tạo. Bàn giao chuyển từ `docs/learning/HANDOFF.md` sang `docs/HANDOFF.md`.
- Giữ note 000–001 và AGENTS.md hiện hữu; gộp README, template và DEVLOG. Nội dung 13 note 002–014 và REVIEW được copy nguyên byte; tham chiếu workspace trong đó mang tính lịch sử.
- Có sửa mục lục chung và giữ phần Antigravity; không thay nội dung chuyên môn của agent kia. Chín findings vẫn còn mở. Kiểm tra bản sao/hash, link cục bộ và phạm vi diff trước commit/push main.
- Chưa revert repo nguồn: người dùng yêu cầu duyệt danh sách trước. Mười commit Codex được tách với tám commit Antigravity trong `docs/HANDOFF.md`; không tự mở rộng quyền xóa sang file agent khác tạo.
- Kiểm tra chuyển: 14 bản sao giống nguồn từng byte; ba file gộp còn đầy đủ nội dung cũ; bảy file tracked khác ở đích giữ nguyên hash. Kiểm tra 20 Markdown, 52 fenced blocks, 68 link cục bộ đạt; HEAD/status và hash 5.059 file đã kiểm kê ở nguồn không đổi.
- Commit chuyển `f9052dc` đã push main; xác nhận remote bằng `git ls-remote`. Cập nhật bàn giao: việc chuyển hoàn tất, chỉ còn chờ người dùng duyệt danh sách trước khi revert nguồn.

## 2026-11-17 — Codex: xác nhận phần Antigravity, hủy kế hoạch revert

- Chỉ thị mới của người dùng thay thế kế hoạch trước: không revert; giữ nguyên nhánh `codex/solana-learning-notes` làm bản lưu, chỉ chuyển workspace Taskbar Hero về main.
- Đã đối chiếu đủ tám commit Antigravity: `0dd238b`, `ef8d9fd`, `9cf7483`, `e4d3618`, `21481b2`, `a656f0b`, `47ea673`, `af0c0db`. Bảy note khớp nguyên byte với nhánh lưu; 23 dòng thêm trong README/DEVLOG còn đủ. Toàn bộ nội dung đã có trong commit chuyển `f9052dc` trên main đích.
- Đã thử `git switch main` tại nguồn; Git từ chối vì tám file tracked đang sửa và năm file untracked trùng đường dẫn trên main. HEAD/status, nhánh lưu tại `1c7e502`, hash 4.590 file đang sửa/untracked giữ nguyên. Không stash, reset, force checkout hoặc xóa. Bước chuyển nhánh còn cần người dùng chọn cách giữ thay đổi cục bộ.
- Cập nhật HANDOFF và README để bỏ kế hoạch duyệt revert cũ. Giữ nội dung chuyên môn của Antigravity và các findings hiện hữu; không tuyên bố đã sửa findings hoặc đã chuyển nhánh thành công.

## 2026-11-17 — Codex: chốt giữ nguyên Taskbar Hero

- Người dùng hủy yêu cầu chuyển nhánh và từ chối stash/xóa; giữ nguyên Taskbar Hero như hiện tại. Không còn quyết định cần hỏi hoặc bước xử lý repo nguồn còn chờ.
- Xác nhận nhánh nguồn vẫn là `codex/solana-learning-notes` tại `1c7e502`; status và hash 4.590 file đang sửa/untracked khớp bản kiểm kê. Chỉ cập nhật HANDOFF và README ở repo đích để đóng việc chuyển tài liệu; các bản ghi chờ chuyển nhánh ở trên là lịch sử đã được thay thế.

## Nhật ký từ workspace nguồn — giữ lịch sử

Các mô tả dưới đây là sự kiện ở Taskbar Hero, không phải hành động đã chạy lại tại repo đích; trạng thái hiện hành xem `docs/HANDOFF.md`.

## 2026-11-17 — Khởi tạo ghi chú học Solana

- Đã đọc goal objective; kiểm tra file nền và thay đổi chưa commit. Người dùng xác nhận dùng repo hiện tại và template mới vì bộ tài liệu đầu vào chưa tồn tại.
- Tạo `docs/learning/_TEMPLATE.md` và README. Phạm vi chỉ tài liệu; chưa cài đặt, tạo ví, chạy program hoặc deploy. Các thay đổi sản phẩm có sẵn được giữ nguyên.
- Note 002: giải thích account/owner/authority, transaction, PDA/CPI, phí và cluster; phân biệt công thức fee legacy/v0 với v1, thêm bài tự kiểm tra và nguồn chính thức.
- Note 003: kiểm kê Node 24.22.2/pnpm 10.28.0; Rust/Solana/Anchor chưa thấy trong PATH. Đối chiếu Anchor 1.2.2 → Agave 4.1.2/platform-tools v1.57; ghi Rust stable manifest 1.100.0 và giới hạn chưa build. Không chạy installer hoặc airdrop.
- Note 004: lý thuyết Anchor 1.2.2, counter PDA/authority trong Markdown, IDL/Codama, test plan LiteSVM/Mollusk/Surfpool offline và quy trình deploy/verify devnet. Không tạo sandbox hay keypair; không khai là đã compile/test.
- Note 007: checklist 12 lỗi program, mỗi lỗi có snippet Anchor sai/đúng và hướng test âm; làm rõ owner/type/authority, re-init/recreate, duplicate mutable và reload sau CPI. Snippets chưa compile.
- Note 009: hoàn thiện phần Codex với nguồn chính thức và mẹo cộng đồng global/Trung Quốc, mỗi mẹo có link và nhãn độ tin cậy; ghi X/Zhihu 403, Bilibili 412, Juejin chặn nội dung. Giữ phần Antigravity cho Antigravity; không đoán quota hay cài plugin. Tạo HANDOFF.md với trạng thái đang làm để tiếp tục sau compact.
- Note 010: đánh giá Solana MCP, Foundation skill 2.8.0, Helius MCP 3.1.0 và skills; thêm cấu hình tham khảo cho Codex/Antigravity. Ghi rõ auto-install của skill không vượt yêu cầu xin phép, Helius cần cấu hình devnet/read-only, và svm cần MCP dù knowledge không cần API key. Không cài hay kết nối server.
- Note 011: lập lịch đủ 17–26/11/2026, giả định 90 phút/ngày; mỗi ngày có bài tập và đáp án, thêm đề tổng hợp và phương án học trên giấy khi chưa cài. Lab/devnet chỉ là lựa chọn có điều kiện; không đánh dấu người dùng đã học xong.
- Note 005 (Antigravity): phân tích chi tiết @solana/kit (chuẩn 2026) vs web3.js v1, Wallet Standard, Codama client, cam kết vòng đời transaction (processed/confirmed/finalized), bộ parse lỗi thân thiện; giải thích chuyên sâu lý do chọn Vite (SPA) thay vì Next.js (SSR hydration mismatch). Đã thiết lập sandbox thử nghiệm tại /tmp/sandbox-frontend-solana với Vite 8.3 + React 19 + @solana/kit 8.6.0, kiểm tra giao diện và mô phỏng lỗi thành công qua Browser Subagent.
- Note 006 (Antigravity): so sánh SPL Token cổ điển vs Token-2022 (Transfer Fee, Transfer Hook, Confidential Transfers, Non-transferable, Default freeze, Metadata pointer); phân tích bước chuyển từ Legacy Metaplex (4 accounts) sang Metaplex Core (1 account duy nhất, tiết kiệm 83% rent) và Bubblegum cNFT (Concurrent Merkle Tree nén hàng triệu NFT). Kèm ma trận quyết định chọn công nghệ cho 48h hackathon.
- Note 008 (Antigravity): phân tích kiến trúc di động Solana Mobile Stack, giao thức Mobile Wallet Adapter (MWA) qua Android Intent, chính sách dApp Store 0% fee cho thiết bị Seeker; đánh giá rủi ro kỹ thuật trong 48h và đề xuất chiến lược Mobile-first PWA có hỗ trợ MWA để đảm bảo 100% giám khảo trải nghiệm được mà không bị kẹt lỗi build native APK.
- Note 012 (Antigravity): giải mã công thức chiến thắng của các quán quân Colosseum (Ore, Urani); đối chiếu chi tiết 6 tiêu chí chấm của Dev3pack (Product clarity, Impact, Demo, Deployment, Repo quality, Solana depth); thiết lập bảng checklist hành động T-24h/12h/4h/0h và cung cấp mẫu README chuẩn giành giải.
- Note 013 (Antigravity): xây dựng công thức video pitch 3 phút (Hook 20s -> Problem/Solution 30s -> Live Demo 75s -> Solana Depth 30s -> Vision 25s), công cụ quay dựng (Screen Studio, OBS, CapCut), nhận diện 5 lỗi tử huyệt; cung cấp kịch bản mẫu điền sẵn chỗ trống (Ready-to-fill Script Template) song ngữ Anh-Việt.
- Note 014 (Antigravity): phân tích chuyên sâu 4 SDK nhà tài trợ (Supabase, ElevenLabs, Firecrawl, Solana Mobile) gồm tính năng thực tế trong app Solana, hạn mức Free Tier, độ khó và thời gian tích hợp 48h; đề xuất chiến lược "Ghép Lego" (Lego Stacking) phối hợp cả 4 SDK vào 1 ý tưởng để tối đa hóa điểm Bounty.
- Note 009 (Antigravity bổ sung): hoàn thiện phần Antigravity với tài liệu chính thức từ Google DeepMind (Rules vs Skills, Cumulative loading, Artifacts system, Steering, Browser subagent, Planning vs Fast, Slash commands /plan, /boost, /learn, /grill-me, /browser, quota và đổi model Flash vs Pro) kết hợp mẹo thực chiến cộng đồng Global và Trung Quốc (LINUX DO, V2EX, CSDN). Ghi nhận các trang bị chặn bot (X 403, Zhihu 403, Bilibili 412, Juejin chặn content). Bổ sung bảng phân vai tối ưu giữa Codex và Antigravity trong 48h hackathon.
- Cập nhật mục lục README.md đồng bộ toàn bộ 13 ghi chú nghiên cứu (002–014).
- Rà soát cuối của Codex: bảy deliverable đúng bảy mục template; 2 JSON + 2 TOML parse thành công, link nội bộ có đích; kiểm tra lịch đủ 10 ngày và S01–S12. Tám file sản phẩm tracked sửa sẵn giữ nguyên SHA-256. Sửa link Best practices .md trả 404 sang HTML; không build/cài/deploy.
- Trong lúc làm, Antigravity bổ sung sáu note và phần riêng của 009. Codex giữ nguyên phần chuyên môn đó, ghi chín findings trong `docs/learning/REVIEW-2026-11-17.md`, gồm API key ElevenLabs trong browser, nhầm mã lỗi 0x1770, nguồn Antigravity không khớp, thể lệ/bounty thiếu nguồn và các ví dụ cần sửa. Review hoàn tất không có nghĩa findings đã được xử lý.
- Kiểm tra lại bản sửa cuối: 18 file Markdown, 49 fenced blocks cân bằng, 61 đường dẫn cục bộ tồn tại; 2 JSON + 2 TOML hợp lệ. Một đường dẫn sandbox nằm trong `/tmp`, chỉ chứng minh tồn tại tại thời điểm kiểm tra. Bảy note Codex đúng template; hash của cả 8 file sản phẩm sửa sẵn tiếp tục khớp baseline.
2026-11-17, Antigravity, đã xong Chặng A (cập nhật 001, tạo 017, 018), chờ Codex tạo 015, 016 để review.

## 2026-11-17 — Codex: bắt đầu Prompt 02 trên work

- Khôi phục checkout rỗng tại `/Users/bao/Documents/ChatGPT/dev3pack` từ đúng remote; tạo work từ main. Giữ checkout Antigravity riêng, không sửa thay đổi chưa commit của A.
- Đọc roadmap/template/note nền, ghi toàn bộ checklist A–E/Phase 2/Phase 3 có điều kiện vào HANDOFF; 015/016/019 đã được đặt chỗ trước.
- Không tạo Automation theo ràng buộc phiên về theo dõi task tới mốc; tiếp tục hiện tại và lưu checkpoint. Chưa cài toolchain, tạo ví, chạy on-chain hay mở mainnet.

## 2026-11-17 — Codex: note 015 và 016

- 015 đối chiếu official rules Colosseum 2024/2025/2026, Foundation/Superteam, Dev3pack và ETHGlobal/ETHShanghai/NASA; phân biệt luật, workshop BTC, suy luận nội bộ. FAQ Dev3pack đọc từ JS công khai.
- 016 ghi risk register, critical path, dependency D0–D3, ví dụ issue Anchor và cảnh báo devnet/IDL Jupiter, nhật ký quét nguồn global/Trung Quốc/học thuật và giới hạn truy cập. Chưa cài hoặc chạy spike.
- Cập nhật mục lục/HANDOFF; 015/016 chờ Antigravity review.

2026-11-17, Codex: review 017/018 tại 5efc423, A01–A06 còn mở trong reviews/A-codex.md; sửa markers DEVLOG và giữ cả phần A+C khi rebase, không sửa note A.

2026-11-17, Codex: soạn rubric-draft-codex v0.1, 7 tiêu chí/100%, threshold 75 + sàn/gates, 3 vòng sửa, PLAN khác DELIVERY; chờ gộp draft A và hiệu chỉnh, chưa phát sinh ý tưởng.

## 2026-11-17 — Codex: áp dụng luật làm cặp mới, chốt RUBRIC v1

- Chạy đúng fetch/checkout work/pull --rebase/merge origin/main/push theo yêu cầu; merge 47ea9eb đã lên work.
- Đọc lại AGENTS/Prompt 02; chốt RUBRIC v1.0, review A vòng 2; tiếp tục hiệu chỉnh rồi C/D, không lấy đồng thuận A làm blocker.
- Không tạo Automation theo dõi task tới hoàn thành do quy định app; đã kiểm danh sách cấu hình và không có mục Dev3pack/chat này, đã báo người dùng. Không hứa có lịch tự thức.
- Chỉ sửa tài liệu; không cài toolchain, chạy spike, tạo ví, gọi RPC hay deploy.

## 2026-11-17 — Codex: hiệu chỉnh RUBRIC v1.1

- Đối chiếu ba winners/hai honorable mentions Frontier, profile/website/repo thật; Flovia README pin commit trong ngày cuối thi. Bốn README khác trả 404, không suy đã bỏ dự án.
- Khoảng U chồng lấp: công khai không đủ phân biệt winners; sửa protocol evidence ở v1.1, không bẻ weights/ngưỡng hoặc gán điểm giả. Kiểm Python khoảng tổng/độ nhạy và hai gate controls; không spike.
- Sang C/D ngay theo luật chủ file quyết định, review A xử lý bất đồng bộ.

## 2026-11-17 — Codex: hoàn thành C, mở D độc lập

- Viết 019 đúng số đã đặt chỗ; nguồn RFS/funding/accelerator, kết quả thi, Samui unmaintained và Facto archived, P-Token/Light/x402 và evidence filtering. Phân biệt source docs với thực thi.
- Sửa nhận định P-Token tentative trong phân tích 019: replacement implementation Tokenkeg; không bắt client chuyển program ID. Không tự sửa ROADMAP giáo viên.
- Review 020 C01–C04; tiếp nhận draft A vào RUBRIC mục 9, weights/ngưỡng đồng quy nhưng giữ các phân biệt PLAN/private nghiên cứu/primitive.
- Bắt đầu D; chưa mở docs/ideas/antigravity. Chưa code/install/tx/deploy.

- 2026-11-17 · Codex · Nghiên cứu riêng C01–C03; phát hiện x402 đã có idempotency, nguồn T3 sai đích và snippet fee/epoch khác upstream; chỉ đọc RPC devnet, chưa cài/tx · Viết note 021 trước spike, thêm K4 STOP-CAUSES, giao A sửa nguồn.
- 2026-11-17 · Codex · Theo yêu cầu chỉ bàn giao: cập nhật HANDOFF với HEAD `3a6359b`, file spike/evidence chưa commit, log 9 test đạt và giới hạn live C02/C03; giữ goal active và automation hiện có. Không triển khai hoặc chạy lại test trong lượt này; note 021/mục lục chưa cập nhật kết quả spike, đã ghi vào Còn lại.
- 2026-11-17 · Codex · Tiếp tục goal, review snapshot spike read-only và ghi catalog evidence; đọc source layout mint/TLV/u64 trước mở rộng C03, trả lại T6 sai URL/thiếu nguồn. Cập nhật note 021/mục lục/HANDOFF; automation view/config vẫn ACTIVE đúng chat, fetch không có thay đổi work.
- 2026-11-17 · Codex · Theo yêu cầu chỉ bàn giao: cập nhật HANDOFF với HEAD `9fff38e`, remote-tracking `2506180` chưa pull, phần mở rộng C03/review A chưa commit, log **16 test đạt**, fee-only live quote cuối và 5 script hashes khớp artifact. View/config automation ACTIVE mỗi 15 phút đúng chat/prompt; giữ goal active. Chỉ kiểm dữ liệu local, không chạy lại test/RPC hoặc đồng bộ Git; cập nhật note 021/mục lục/catalog/queue và commit còn ở Còn lại.

- 2026-11-17 · Codex · Tiếp tục Prompt 03 sau bàn giao: review parser/epoch/replay C03, đối chiếu 5 hashes; cập nhật note 021, mục lục và catalog với 16 test/live quote đã lưu, bổ sung Ryntra/Pay và giới hạn. Dừng T7 trùng việc trong A-queue; giữ review-C A01/A02/A03 42/40/37, không reset lịch sử. Không cài/toolchain/chain writes, không rerun khi code không đổi.

- 2026-11-17 · Codex · Hoàn thiện ba bài PLAN r1 theo RUBRIC v1.2: C02 79, C03 77, C01 75; từng điểm có nguồn/thiết kế/artifact, F C01 giữ3 và N C03 giữ3. Viết lại SHORTLIST, dùng T6 V2 sau kiểm nguồn, ghi repo private và cổng public trước nộp. Kiểm công thức/sàn/local links/diff; note021 bổ sung constraints/atomicity/alternatives. Đặt chỗ note022 trước viết cho chuẩn bị account/PDA/test/CI/cài trên giấy; chưa cài/ký/deploy.

- 2026-11-17 · Codex · Người dùng chọn ClusterProof chính/NetPay Check dự phòng và cho phép Rust1.100.0/Agave4.1.2/AVM-Anchor1.2.2/platform-tools v1.57; đã ghi DECISION, viết note022 (đặt chỗ 1aa322a). PR#7 mở/chưa merge, kiểm metadata mergeable. Máy có Xcode tools và 213.9GB trống; tải/đọc installer chính thức, bắt đầu cài Rust, chưa coi setup xong. Giao A T5 làm ngay và sửa T4 nhầm fee/mainnet.

- 2026-11-17 · Codex · Viết IDEA và ARCHITECTURE v0.1 cho ClusterProof (chưa duyệt); giao A T8 web hello/devnet lab. Rust1.100.0 cài thành công/đã kiểm rustc; Agave đang cài, logs tại docs/evidence/phase3. Không đồng nhất hello lab với product program và không gọi score PLAN là gate phase hoàn tất.


- 2026-11-17 · Codex · Theo yêu cầu chỉ bàn giao: lưu HEAD b897134, C02 chính/C03 dự phòng và quyền cài đã có; đọc output AVM session50517/log xác nhận exit0, Agave cũng exit0. Cập nhật HANDOFF/archive với cổng chưa đạt, logs chưa commit và lỗi metadata tomllib; giữ goal active/automation hiện có. Không cài/build/test/deploy hoặc đồng bộ Git; note003/mục lục còn cần cập nhật từ output thật.

- 2026-11-17 · Codex · Tiếp tục goal: view/config automation đúng ACTIVE15phút/chat; fetch không có commit A mới, đọc T6V3 và ghi review/ưu tiên T5→T8. Rust/Agave/AVM version pass, cài Anchor1.2.2 exit0/version pass; pin platform-tools v1.57 đang cài (không theo reminder latestv1.58). Viết metadata thực, cập nhật note003/004/mục lục và kế hoạch LiteSVM/keypair trước scaffold; chưa build/deploy.

- 2026-11-17 · Codex · Theo yêu cầu chỉ bàn giao: đối chiếu HEAD/origin-work a7b8af1 và logs platform-tools/hello, lưu 6 runtime tests đạt, IDL exit0 nhưng combined build exit1; giữ danh sách file chưa commit, npm session21555, funding pending và cổng Phase1–3 chưa đạt. Viết lại HANDOFF, archive snapshot cũ, cập nhật note009 và STOP-CAUSES K5; goal vẫn active, automation giữ nguyên. Không cài/build/test/deploy hoặc đồng bộ Git trong lượt bàn giao.

- 2026-11-17 · Codex · Tiếp tục goal: kiểm IDL/address/layout và hashes, sửa Bash3.2 array rỗng/lock check; check-lab r2 exit0 với SBFv3/IDL/6 runtime tests. Cập nhật notes003/004/007/022, mục lục/README/ROADMAP, giữ logs lỗi; fetch T5/T8 và review qua queue, chốt hướng React-Vite static, chưa chạm apps/web. Automation view/config ACTIVE đúng chat; npm21555 terminal. CI/devnet/web chưa đạt.
