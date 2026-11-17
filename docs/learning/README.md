# Ghi chú học Solana

Ngày bắt đầu: **17/11/2026**, múi giờ **Asia/Ho_Chi_Minh**. Mục tiêu: học nền tảng trước mốc hackathon **27–29/11/2026 do người dùng cung cấp**; chưa xác minh độc lập lịch và thể lệ sự kiện.

## Bối cảnh và phạm vi

Repo học tập chính thức là **`/Users/bao/Documents/dev3pack-hackathon`**, branch `main`. Người dùng xác nhận trước đó đã chọn nhầm workspace Taskbar Hero. Ngày 17/11/2026, Codex gộp tài liệu từ source commit `1c7e502` vào khung repo này tại `11cf2f2`.

Repo đích đã có [AGENTS.md](../../AGENTS.md), note 000–001, template và DEVLOG; nội dung đó được giữ. README học tập, template và DEVLOG được gộp, không ghi đè mất phần cũ. Bàn giao hiện hành nằm tại [docs/HANDOFF.md](../HANDOFF.md). Nội dung 000–001 chưa được xác minh lại trong lần chuyển này.

Các note 002–014 và REVIEW được copy nguyên byte. Tham chiếu “Taskbar Hero”, “repo hiện tại”, PATH/version hoặc kết quả của “phiên này” trong chúng mô tả bối cảnh lịch sử ở repo nguồn, không phải yêu cầu tiếp tục công việc ở repo đó. Khi làm việc mới, áp dụng AGENTS.md và repo đích ở trên. Trong workspace nguồn, AGENTS.md và note 000–001 từng không có; nhận định này không áp dụng cho repo đích.

Phần công việc Codex chỉ thêm tài liệu; không cài công cụ/skill/MCP, không tạo ví hay keypair, không gọi RPC mainnet, không triển khai program. Rust snippets của Codex chưa được biên dịch; không tạo `programs/` hoặc `app/`. Kết quả sandbox do Antigravity báo cáo trong phần riêng chưa được Codex tái chạy.

## Cách đọc

Các note chuyển từ nguồn dùng biến thể bảy mục trong [_TEMPLATE.md](_TEMPLATE.md): mục tiêu → phiên bản → kiến thức → ví dụ → tự kiểm tra → nguồn → giới hạn. Mẫu gốc của repo đích và note 000–001 được giữ nguyên. “Đã đối chiếu” nghĩa là đã đọc docs/source; “đã chạy” chỉ dùng khi có kết quả thực thi. Chi tiết phiên bản thực tế nằm ở note 003.

Đọc theo thứ tự: 002 → 003 → 004 → 007 (phần on-chain của Codex), 005 → 006 → 008 (phần frontend, token, mobile của Antigravity), 012 → 013 → 014 (chiến lược hackathon và SDKs), dùng 010 và 009 khi làm việc với AI, theo lịch 011.

Tiến độ và bước tiếp tục sau compact nằm trong [docs/HANDOFF.md](../HANDOFF.md).

**Kết quả rà soát:** bảy deliverable thuộc mục tiêu Codex đã đủ; phần Antigravity bổ sung còn lỗi code minh họa và nguồn trích cần sửa. Đọc [REVIEW-2026-11-17.md](REVIEW-2026-11-17.md) trước khi dùng các note làm hướng dẫn thực hành. Các trạng thái trong bảng dưới ghi theo tác giả, không có nghĩa mọi nhận định đã được xác minh độc lập.

## Mục lục

| Note | Nội dung | Tác giả / Trạng thái |
| --- | --- | --- |
| [000 — Codex vs Antigravity: điểm mạnh và chia việc](000-ai-tools-codex-vs-antigravity.md) | Nội dung gốc của repo đích, giữ nguyên | xong — theo mục lục ban đầu; chưa rà soát lại |
| [001 — Luật hackathon Dev3pack](001-hackathon-rules.md) | Nội dung gốc của repo đích, giữ nguyên | xong — theo mục lục ban đầu; chưa rà soát lại |
| [002 — Solana căn bản](002-solana-basics.md) | Account, transaction, PDA, CPI, fees, cluster; bài đọc 15 phút | Codex — Đã đối chiếu docs; chưa chạy on-chain |
| [003 — Toolchain](003-solana-toolchain.md) | Kiểm kê máy, bảng tương thích, lệnh cài và lỗi macOS/WSL | Codex — Chưa cài; lệnh cài chờ đồng ý |
| [004 — Anchor từ A đến Z](004-anchor-a-to-z.md) | Macro/constraints, IDL/Codama, ví dụ counter, test/deploy/verify | Codex — Code và quy trình chưa chạy |
| [005 — Frontend Solana](005-solana-frontend.md) | So sánh @solana/kit vs web3.js, Wallet Standard, Codama client, vòng đời tx, parse lỗi, Vite vs Next.js | Antigravity — Đã chạy sandbox Vite 8.3 + @solana/kit 8.6.0 + Browser subagent |
| [006 — Token & NFT](006-token-and-nft.md) | SPL Token vs Token-2022 (Transfer Fee, Hook, Confidential), Metaplex Core (1 account) vs Bubblegum cNFT, Decision Matrix | Antigravity — Đã đối chiếu docs chính thức Solana & Metaplex |
| [007 — Bảo mật program](007-solana-program-security.md) | 12 lỗi/checks, mỗi mục có ví dụ sai/đúng và test âm | Codex — Checklist review; chưa compile/test |
| [008 — Solana Mobile (Seeker)](008-solana-mobile-seeker.md) | Mobile Wallet Adapter (MWA), React Native/Expo, dApp Store 0% fee, tiêu chí giải Seeker, đánh giá khả thi 48h (PWA-first) | Antigravity — Đã đối chiếu docs Solana Mobile; phân tích rủi ro kỹ thuật |
| [009 — Mẹo Codex/Antigravity](009-tips-codex-antigravity.md) | Cẩm nang tối ưu Codex (GPT-6) & Antigravity (Gemini 3.8 Flash): Rules, Artifacts, Browser Agent, mẹo global & Trung Quốc (Linux.do, V2EX, CSDN) | Codex & Antigravity — Đã đối chiếu docs & cộng đồng; lọc trang chặn bot |
| [010 — AI tooling Solana](010-solana-ai-tooling.md) | So sánh MCP/skills, cấu hình Codex/Antigravity, quyền và nguồn phiên bản | Codex — Chưa cài/kết nối; có mẫu devnet/read-only |
| [011 — Lộ trình học](011-solana-learning-roadmap.md) | Đủ 17–26/11, bài tập/đáp án từng ngày, đề tổng hợp và nhánh lab có điều kiện | Codex — Lịch đề xuất; chưa đánh dấu bài học/lab hoàn thành |
| [012 — Thắng hackathon Solana](012-winning-solana-hackathons.md) | Phân tích quán quân Colosseum (Ore, Urani), đối chiếu 6 tiêu chí Dev3pack, checklist nộp bài T-24h/12h/4h/0h, template README | Antigravity — Đã đối chiếu giải đấu quốc tế; checklist hành động chuẩn |
| [013 — Video demo < 3 phút](013-hackathon-demo-video.md) | Công thức 3 phút (Hook 20s &rarr; Problem 30s &rarr; Demo 75s &rarr; Solana 30s &rarr; Vision 25s), công cụ quay dựng, 5 lỗi tử huyệt, template kịch bản điền sẵn | Antigravity — Đã đối chiếu chuẩn Colosseum/Superteam; kịch bản song ngữ |
| [014 — SDK nhà tài trợ](014-sponsor-sdks.md) | Phân tích Supabase, ElevenLabs, Firecrawl, Solana Mobile: tính năng, Free Tier, độ khó 48h, ma trận đối chiếu & chiến lược "Ghép Lego" săn Bounty | Antigravity — Đã đối chiếu docs 4 nhà tài trợ; code mẫu tối thiểu |

## Bài học / lỗi đã gặp

Đã chọn nhầm workspace khi bắt đầu nghiên cứu. Trước task tiếp theo, đối chiếu đường dẫn, remote, AGENTS.md và mục lục. Quyết định cuối cùng của người dùng là **giữ nguyên Taskbar Hero**, không chuyển nhánh, stash, revert, xóa hoặc reset. Việc chuyển tài liệu đã hoàn tất; nhánh `codex/solana-learning-notes` ở nguồn được giữ làm bản lưu. Đã đối chiếu đủ phần Antigravity: 005, 006, 008, 009, 012, 013, 014 và các cập nhật README/DEVLOG đều có trong bản chuyển `f9052dc`. Lần chuyển không cài công cụ hoặc chạy lại lab. REVIEW là snapshot ở nguồn; số lượng file/link trong đó không mô tả bộ đích sau khi gộp.

## Đề xuất cho AGENTS.md — chưa áp dụng

Các đề xuất dưới đây thuộc lịch sử ở Taskbar Hero. Repo đích hiện có AGENTS.md và nhiều luật tương ứng; lần chuyển không sửa file đó. Cụm “chưa có file gốc” bên dưới chỉ nói về workspace nguồn.

Vì chưa có file gốc, chưa thể kết luận luật nào thừa. Đề xuất tạo một file ngắn trong phiên riêng nếu người dùng muốn:

1. Ghi phạm vi học Solana ở `docs/learning`; không tự chuyển đổi code Taskbar Hero.
2. Đọc README/template trước khi viết note; ghi ngày, phiên bản và mức kiểm chứng cho mỗi ví dụ.
3. Hỏi trước mọi cài đặt, kể cả tải toolchain tự động, `npx`, skill, MCP và Docker image.
4. Chỉ local/devnet khi được cho phép; không tạo/commit keypair; không đưa secret vào chat hoặc log.
5. Không sửa thay đổi sẵn có; stage đường dẫn cụ thể; mỗi note một commit.
6. Kiểm tra link, cấu trúc và `git diff --check` cho tài liệu; chỉ ghi test/build thành công khi thực sự chạy.
7. Đưa kiến thức Solana dài vào note 002/007 thay vì chép toàn bộ vào AGENTS.md. Pin phiên bản khi bắt đầu thực hành; không mặc định `latest`.

Các đề xuất trên là kết luận của phiên nghiên cứu, không phải quy định đã tồn tại trong repo.

## Mục lục ban đầu của repo đích — giữ lịch sử

Bảng dưới được giữ đầy đủ để không mất kế hoạch cũ. Trạng thái “cần học/để sau” nói về kế hoạch ban đầu; bảng hiện hành ở trên ghi trạng thái tài liệu, không chứng minh người dùng đã học hoặc chạy lab xong.

<details>
<summary>Nội dung README trước khi gộp</summary>

# docs/learning — Sổ tay học tập

Mọi thứ đã học về Solana, công cụ, và cách làm việc với AI đều ghi ở đây, để người và agent (Codex, Antigravity) đọc lại.

**Quy tắc**: một chủ đề = một file, đặt tên `NNN-ten-chu-de.md`, viết theo [`_TEMPLATE.md`](_TEMPLATE.md), rồi thêm vào bảng dưới.

## Mục lục

| # | Chủ đề | Trạng thái | Cập nhật |
|---|---|---|---|
| 000 | [Codex vs Antigravity: điểm mạnh và chia việc](000-ai-tools-codex-vs-antigravity.md) | xong | 2026-11-17 |
| 001 | [Luật hackathon Dev3pack](001-hackathon-rules.md) | xong | 2026-11-17 |
| 002 | Solana căn bản: account, program, PDA, rent, transaction | cần học | |
| 003 | Cài toolchain: Rust, Solana CLI, Anchor, devnet faucet | cần học | |
| 004 | Anchor: viết, test, deploy program đầu tiên lên devnet | cần học | |
| 005 | Frontend: wallet adapter + gọi program qua IDL | cần học | |
| 006 | Token / NFT (SPL Token, Token-2022, Metaplex) — nếu cần | cần học | |
| 007 | Bảo mật Solana program: lỗi thường gặp | cần học | |
| 008 | Solana Mobile (Seeker) — nếu nhắm giải mobile | cần học | |
| 009 | Mẹo dùng Codex / Antigravity từ MXH & diễn đàn (global + Trung Quốc: X, Reddit, HN, Juejin, CSDN, Zhihu, V2EX, Linux.do…) — giao Codex tự tìm | để sau | |

</details>
