# Ghi chú học Solana

Ngày bắt đầu: **17/11/2026**, múi giờ **Asia/Ho_Chi_Minh**. Mục tiêu: học nền tảng trước hackathon **27–29/11/2026**. Codex đã đọc trang chủ/FAQ Dev3pack bằng browser ngày 17/11/2026; thể lệ và giới hạn kiểm chứng nằm ở [001](001-hackathon-rules.md).

## Bối cảnh và phạm vi

Repo học tập chính thức là **`/Users/bao/Documents/dev3pack-hackathon`**. Lần sửa R01–R09 làm trên nhánh `prompts/01-learning` cho PR #1. Người dùng xác nhận trước đó đã chọn nhầm workspace Taskbar Hero. Ngày 17/11/2026, Codex gộp tài liệu từ source commit `1c7e502` vào khung repo này tại `11cf2f2`; lịch sử chuyển vào `main` được giữ bên dưới.

Repo đích đã có [AGENTS.md](../../AGENTS.md), note 000–001, template và DEVLOG; nội dung đó được giữ trong lần chuyển. README học tập, template và DEVLOG được gộp, không ghi đè mất phần cũ. Bàn giao hiện hành nằm tại [docs/HANDOFF.md](../HANDOFF.md). Sau lần chuyển, note 001 đã được sửa theo thể lệ chính thức; note 000 chưa được rà soát lại.

Các note 002–014 và REVIEW được copy nguyên byte **tại thời điểm chuyển**; những note có findings nay đã được sửa, xem commit trong [REVIEW](REVIEW-2026-11-17.md). Tham chiếu “Taskbar Hero”, “repo hiện tại”, PATH/version hoặc kết quả của “phiên này” trong phần lịch sử mô tả bối cảnh repo nguồn, không phải yêu cầu tiếp tục công việc ở đó. Khi làm việc mới, áp dụng AGENTS.md và repo đích ở trên. Trong workspace nguồn, AGENTS.md và note 000–001 từng không có; nhận định này không áp dụng cho repo đích.

Phần công việc Codex chỉ thêm tài liệu; không cài công cụ/skill/MCP, không tạo ví hay keypair, không gọi RPC mainnet, không triển khai program. Rust snippets của Codex chưa được biên dịch; không tạo `programs/` hoặc `app/`. Kết quả sandbox do Antigravity báo cáo trong phần riêng chưa được Codex tái chạy.

Prompt giao việc cho từng agent nằm trong `prompts/`.

## Cách đọc

Các note chuyển từ nguồn dùng biến thể bảy mục trong [_TEMPLATE.md](_TEMPLATE.md): mục tiêu → phiên bản → kiến thức → ví dụ → tự kiểm tra → nguồn → giới hạn. Mẫu gốc của repo đích và note 000–001 được giữ nguyên. “Đã đối chiếu” nghĩa là đã đọc docs/source; “đã chạy” chỉ dùng khi có kết quả thực thi. Chi tiết phiên bản thực tế nằm ở note 003.

Đọc theo thứ tự: 002 → 003 → 004 → 007 (phần on-chain của Codex), 005 → 006 → 008 (phần frontend, token, mobile của Antigravity), 012 → 013 → 014 (chiến lược hackathon và SDKs), dùng 010 và 009 khi làm việc với AI, theo lịch 011.

Tiến độ và bước tiếp tục sau compact nằm trong [docs/HANDOFF.md](../HANDOFF.md).

**Kết quả sửa tài liệu:** R01–R09 đã được xử lý; bảng commit, kiểm tra và giới hạn nằm ở [REVIEW-2026-11-17.md](REVIEW-2026-11-17.md). Parser R02 có 11 fixture offline; các snippet SDK/backend/mobile/codegen chưa được kiểm thử tích hợp. Báo cáo sandbox của Antigravity được giữ dưới nhãn lịch sử, không phải bằng chứng Codex chạy lại. Việc đóng findings không xác nhận toàn bộ nhận định trong 13 note hoặc các phiên bản kế thừa đã được kiểm chứng độc lập.

## Mục lục

| Note | Nội dung | Tác giả / Trạng thái |
| --- | --- | --- |
| [000 — Codex vs Antigravity: điểm mạnh và chia việc](000-ai-tools-codex-vs-antigravity.md) | Nội dung gốc của repo đích, giữ nguyên | xong — theo mục lục ban đầu; chưa rà soát lại |
| [001 — Luật hackathon Dev3pack](001-hackathon-rules.md) | Lịch, sponsors/supporters, giải, track, chấm, video, form và code | Claude; Codex sửa R04 — đã đọc trang chủ/FAQ ngày 17/11/2026; giờ UTC trên dashboard còn chưa kiểm chứng |
| [002 — Solana căn bản](002-solana-basics.md) | Account, transaction, PDA, CPI, fees, cluster; bài đọc 15 phút | Codex — Đã đối chiếu docs; chưa chạy on-chain |
| [003 — Toolchain](003-solana-toolchain.md) | Kiểm kê máy, bảng tương thích, lệnh cài và lỗi macOS/WSL | Codex — Bộ đã cài; SBFv3/IDL/6 runtime tests local đạt; chưa deploy/CI |
| [004 — Anchor từ A đến Z](004-anchor-a-to-z.md) | Macro/constraints, IDL/Codama, ví dụ counter, test/deploy/verify | Codex — Lab phase3-hello đã build/IDL/6 runtime tests; snippet study-counter chưa chạy |
| [005 — Frontend Solana](005-solana-frontend.md) | Kit/Wallet Standard, parser theo program ID + mã, Codama init/config/run có mốc source | Antigravity; Codex sửa R02/R08/R09 — 11 fixture offline đạt; codegen/SDK chưa chạy, sandbox cũ chỉ là báo cáo lịch sử |
| [006 — Token & NFT](006-token-and-nft.md) | Token-2022: destination withholding, harvest/withdraw và authority; ngân sách NFT theo cấu hình | Antigravity; Codex sửa R05/R09 — đã đối chiếu nguồn Transfer Fees; chưa chạy on-chain, ngân sách 500.000 cNFT dưới 1 SOL chưa đủ căn cứ |
| [007 — Bảo mật program](007-solana-program-security.md) | 12 lỗi/checks, mỗi mục có ví dụ sai/đúng và test âm | Codex — Checklist + 5 test âm lab đạt; chưa bao phủ toàn checklist/audit |
| [008 — Solana Mobile (Seeker)](008-solana-mobile-seeker.md) | MWA authorize theo protocol package 3.0.2, account/encoding và gợi ý mobile | Antigravity; Codex sửa R06/R09 — đã đọc spec/source; chưa compile/chạy ví/thiết bị, chưa xác nhận điều kiện mobile track |
| [009 — Mẹo Codex/Antigravity](009-tips-codex-antigravity.md) | Rules, Artifacts, Browser và slash commands có nguồn cụ thể; tách mẹo Codex khỏi nguồn gán nhầm Antigravity | Codex & Antigravity; sửa R03 — đã đọc nguồn, chưa benchmark model/quota; UI phụ thuộc công cụ và client |
| [010 — AI tooling Solana](010-solana-ai-tooling.md) | So sánh MCP/skills, cấu hình Codex/Antigravity, quyền và nguồn phiên bản | Codex — Chưa cài/kết nối; có mẫu devnet/read-only |
| [011 — Lộ trình học](011-solana-learning-roadmap.md) | Đủ 17–26/11, bài tập/đáp án từng ngày, đề tổng hợp và nhánh lab có điều kiện | Codex — Lịch đề xuất; chưa đánh dấu bài học/lab hoàn thành |
| [012 — Chuẩn bị bài thi Dev3pack](012-winning-solana-hackathons.md) | Thể lệ chính thức, trọng số tự đề xuất, lịch sử Colosseum/Superteam có cảnh báo, checklist/form/README | Antigravity; Codex sửa R04/R09 — đã đối chiếu Dev3pack; checklist chưa thử bằng bài thi thật |
| [013 — Video demo tối đa 165 giây](013-hackathon-demo-video.md) | 15 + 20 + 80 + 30 + 20 = 165 giây; placeholder yêu cầu số đo/log thật | Antigravity; Codex sửa R04/R07/R09 — bảng và script khớp; chưa có video xuất, latency/rent/test/deployment chưa đo |
| [014 — SDK nhà tài trợ](014-sponsor-sdks.md) | Chọn SDK theo sản phẩm, pricing có nguồn, ElevenLabs/Firecrawl giữ key phía server | Antigravity; Codex sửa R01/R04/R09 — đã đọc docs/pricing; chưa tích hợp, không suy bounty từ số SDK |
| [015 — Tiêu chí chấm hackathon và cách giám khảo chấm thật](015-hackathon-judging.md) | Đối chiếu nguồn chính thức 2024–2026, quy trình chấm, tiêu chí ứng viên | Codex — đã nghiên cứu; chờ review chéo |
| [016 — Đánh giá độ khả thi kỹ thuật và rủi ro của ý tưởng](016-technical-feasibility-risk.md) | Critical path, dependency D0–D3, issue thực tế, ngưỡng feasibility | Codex — đã nghiên cứu; chưa chạy spike |
| [017 — Khung thẩm định ý tưởng sản phẩm và nghiên cứu về chấm ý tưởng](017-khung-tham-dinh-y-tuong.md) | Đặt chỗ cho Phase 1 chặng A | Antigravity — xong theo báo cáo A; Codex đang review |
| [018 — Có thật sự cần blockchain/Solana không; thông tin chấm Dev3pack](018-blockchain-solana-check.md) | Đặt chỗ cho Phase 1 chặng A | Antigravity — xong theo báo cáo A; Codex đang review |
| [019 — Nguồn ý tưởng trong hệ sinh thái Solana](019-solana-idea-sources.md) | RFS/RFP/funding, dự án thật/archived, P-Token/Light/x402, evidence filtering | Codex — đã nghiên cứu; chưa spike |
| [020 — Nguồn vấn đề thật của người dùng](020-nguon-van-de-that.md) | Bản đầu của A; review C01–C04 tại reviews/C-codex | Antigravity — cần bổ sung nguồn cụ thể; review không chặn |

| [021 — Kiểm chứng payment, cluster và token net](021-payment-cluster-evidence.md) | Evidence C01–C03, RPC read-only và parser mint/u64; Ryntra/Pay alternatives | Codex — 16 test đạt, C02 live read và C03 fee-only live quote; chưa settlement/custom program |

| [022 — Chuẩn bị độc lập Phase 2/3](022-phase2-3-independent-prep.md) | Contract/harness, toolchain/client, React/Vite/Wallet Standard và hosting | Codex — hello6/client8/web8 tests đạt local; web public/build/browser đã có evidence; CI billing/devnet funding và review còn mở |

| [023 — ReceiptRail Phase2 và spike Anchor local](023-receiptrail-phase2-spike.md) | Account/PDA, payment atomicity, build offline không signer triển khai và LiteSVM | Codex — bytecode Anchor1.2.2 local,19 runtime tests pass; build offline không deployment keypair; chưa integration/devnet |

## Bài học / lỗi đã gặp

Đã chọn nhầm workspace khi bắt đầu nghiên cứu. Trước task tiếp theo, đối chiếu đường dẫn, remote, AGENTS.md và mục lục. Quyết định cuối cùng của người dùng là **giữ nguyên Taskbar Hero**, không chuyển nhánh, stash, revert, xóa hoặc reset. Việc chuyển tài liệu đã hoàn tất; nhánh `codex/solana-learning-notes` ở nguồn được giữ làm bản lưu. Đã đối chiếu đủ phần Antigravity: 005, 006, 008, 009, 012, 013, 014 và các cập nhật README/DEVLOG đều có trong bản chuyển `f9052dc`. Lần chuyển không cài công cụ hoặc chạy lại lab. REVIEW giữ snapshot nguồn dưới nhãn lịch sử và bổ sung kết quả sửa hiện hành; không trộn số lượng file/link hoặc bằng chứng giữa các lần kiểm tra.

Lần sửa R01–R09 cho thấy cần gắn nhận định với đúng nguồn/version và phân biệt đọc source, fixture offline, báo cáo agent khác, kiểm thử tích hợp. Đóng một finding tài liệu không có nghĩa ví dụ đã chạy với dịch vụ hoặc sản phẩm đã đạt điều kiện giải.

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
