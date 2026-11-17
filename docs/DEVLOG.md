# DEVLOG

Mỗi dòng: ngày · ai làm (Mai / Codex / Antigravity) · việc · note đã cập nhật.

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
