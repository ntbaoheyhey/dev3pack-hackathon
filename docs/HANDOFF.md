# Bàn giao chuyển tài liệu Solana về đúng repo

**Trạng thái: đủ nội dung Codex và Antigravity trên main repo đích. Người dùng hủy hoàn toàn kế hoạch revert. Chuyển Taskbar Hero về main chưa xong vì Git từ chối ghi đè thay đổi cục bộ.** Cập nhật 17/11/2026, Asia/Saigon.

## Nơi làm việc và ranh giới

- Repo đích: `/Users/bao/Documents/dev3pack-hackathon`, branch `main`, remote `https://github.com/ntbaoheyhey/dev3pack-hackathon.git`.
- Repo nguồn: `/Users/bao/Documents/ChatGPT/taskbar hero`, branch `codex/solana-learning-notes`, HEAD được kiểm kê `1c7e50250bcad01c7563dd36ddf54a9bb53b5755`; mốc trước học tập `6744e9b`.
- Chỉ thị mới nhất: **không revert gì cả**, giữ nguyên nhánh `codex/solana-learning-notes` làm bản lưu; chỉ chuyển workspace nguồn về nhánh chính. Không xóa, reset hoặc sửa sản phẩm. Repo đích được phép cập nhật và push main.
- Không thay AGENTS.md, note 000–001, README.md ở root hoặc các rule/config của repo đích. Chỉ ba file đã tồn tại được gộp: README học tập, template, DEVLOG.
- Note 002–014 và REVIEW là bản sao nguyên byte; tham chiếu bối cảnh repo nguồn được giữ làm lịch sử. Bàn giao hiện hành chỉ đặt ở `docs/HANDOFF.md`.

## Danh sách chính xác file nguồn và đích

Tổng cộng **18 file** phát sinh trong 18 commit tài liệu kể từ `6744e9b`: **12 file Codex tạo/chạm**, **6 file Antigravity tạo**. Tất cả 18 đường dẫn đều chưa tồn tại ở mốc trước nghiên cứu. `A` là thêm file, `M` là sửa; chỉ ghi các commit học tập đã kiểm kê.

| File tại nguồn | File tại đích | Nguồn gốc / phạm vi | Commit tác động |
| --- | --- | --- | --- |
| `docs/DEVLOG.md` | `docs/DEVLOG.md` | Codex tạo; có thể có cập nhật chung | A 302206f; M 02a087c; M e286552; M 2f170c4; M df362a2; M 6565fd6; M fd66c05; M baba05d; M af0c0db; M 16e6970 |
| `docs/learning/002-solana-basics.md` | `docs/learning/002-solana-basics.md` | Codex tạo; có thể có cập nhật chung | A 02a087c |
| `docs/learning/003-solana-toolchain.md` | `docs/learning/003-solana-toolchain.md` | Codex tạo; có thể có cập nhật chung | A e286552 |
| `docs/learning/004-anchor-a-to-z.md` | `docs/learning/004-anchor-a-to-z.md` | Codex tạo; có thể có cập nhật chung | A 2f170c4 |
| `docs/learning/005-solana-frontend.md` | `docs/learning/005-solana-frontend.md` | Antigravity tạo; chỉ copy | A 0dd238b |
| `docs/learning/006-token-and-nft.md` | `docs/learning/006-token-and-nft.md` | Antigravity tạo; chỉ copy | A ef8d9fd |
| `docs/learning/007-solana-program-security.md` | `docs/learning/007-solana-program-security.md` | Codex tạo; có thể có cập nhật chung | A df362a2 |
| `docs/learning/008-solana-mobile-seeker.md` | `docs/learning/008-solana-mobile-seeker.md` | Antigravity tạo; chỉ copy | A 9cf7483 |
| `docs/learning/009-tips-codex-antigravity.md` | `docs/learning/009-tips-codex-antigravity.md` | Codex tạo; có thể có cập nhật chung | A 6565fd6; M 47ea673; M 16e6970 |
| `docs/learning/010-solana-ai-tooling.md` | `docs/learning/010-solana-ai-tooling.md` | Codex tạo; có thể có cập nhật chung | A fd66c05 |
| `docs/learning/011-solana-learning-roadmap.md` | `docs/learning/011-solana-learning-roadmap.md` | Codex tạo; có thể có cập nhật chung | A baba05d |
| `docs/learning/012-winning-solana-hackathons.md` | `docs/learning/012-winning-solana-hackathons.md` | Antigravity tạo; chỉ copy | A e4d3618 |
| `docs/learning/013-hackathon-demo-video.md` | `docs/learning/013-hackathon-demo-video.md` | Antigravity tạo; chỉ copy | A 21481b2 |
| `docs/learning/014-sponsor-sdks.md` | `docs/learning/014-sponsor-sdks.md` | Antigravity tạo; chỉ copy | A a656f0b |
| `docs/learning/HANDOFF.md` | `docs/HANDOFF.md` | Codex tạo; có thể có cập nhật chung | A 6565fd6; M fd66c05; M baba05d; M 16e6970; M 1c7e502 |
| `docs/learning/README.md` | `docs/learning/README.md` | Codex tạo; có thể có cập nhật chung | A 302206f; M 02a087c; M e286552; M 2f170c4; M df362a2; M 6565fd6; M fd66c05; M baba05d; M af0c0db; M 16e6970 |
| `docs/learning/REVIEW-2026-11-17.md` | `docs/learning/REVIEW-2026-11-17.md` | Codex tạo; có thể có cập nhật chung | A 16e6970 |
| `docs/learning/_TEMPLATE.md` | `docs/learning/_TEMPLATE.md` | Codex tạo; có thể có cập nhật chung | A 302206f |

## Danh sách commit chính xác

Phân nhóm theo lịch sử phiên; các commit dùng chung danh tính Git nên không suy agent từ trường author Git.

| Commit | Agent theo lịch sử phiên | File thêm/sửa |
| --- | --- | --- |
| `302206f` | Codex | A `docs/DEVLOG.md`; A `docs/learning/README.md`; A `docs/learning/_TEMPLATE.md` |
| `02a087c` | Codex | M `docs/DEVLOG.md`; A `docs/learning/002-solana-basics.md`; M `docs/learning/README.md` |
| `e286552` | Codex | M `docs/DEVLOG.md`; A `docs/learning/003-solana-toolchain.md`; M `docs/learning/README.md` |
| `2f170c4` | Codex | M `docs/DEVLOG.md`; A `docs/learning/004-anchor-a-to-z.md`; M `docs/learning/README.md` |
| `df362a2` | Codex | M `docs/DEVLOG.md`; A `docs/learning/007-solana-program-security.md`; M `docs/learning/README.md` |
| `6565fd6` | Codex | M `docs/DEVLOG.md`; A `docs/learning/009-tips-codex-antigravity.md`; A `docs/learning/HANDOFF.md`; M `docs/learning/README.md` |
| `0dd238b` | Antigravity | A `docs/learning/005-solana-frontend.md` |
| `ef8d9fd` | Antigravity | A `docs/learning/006-token-and-nft.md` |
| `9cf7483` | Antigravity | A `docs/learning/008-solana-mobile-seeker.md` |
| `fd66c05` | Codex | M `docs/DEVLOG.md`; A `docs/learning/010-solana-ai-tooling.md`; M `docs/learning/HANDOFF.md`; M `docs/learning/README.md` |
| `e4d3618` | Antigravity | A `docs/learning/012-winning-solana-hackathons.md` |
| `21481b2` | Antigravity | A `docs/learning/013-hackathon-demo-video.md` |
| `a656f0b` | Antigravity | A `docs/learning/014-sponsor-sdks.md` |
| `baba05d` | Codex | M `docs/DEVLOG.md`; A `docs/learning/011-solana-learning-roadmap.md`; M `docs/learning/HANDOFF.md`; M `docs/learning/README.md` |
| `47ea673` | Antigravity | M `docs/learning/009-tips-codex-antigravity.md` |
| `af0c0db` | Antigravity | M `docs/DEVLOG.md`; M `docs/learning/README.md` |
| `16e6970` | Codex | M `docs/DEVLOG.md`; M `docs/learning/009-tips-codex-antigravity.md`; M `docs/learning/HANDOFF.md`; M `docs/learning/README.md`; A `docs/learning/REVIEW-2026-11-17.md` |
| `1c7e502` | Codex | M `docs/learning/HANDOFF.md` |

## Xác nhận đủ phần Antigravity và giữ nhánh lưu

Đã đối chiếu đủ tám commit Antigravity trên nhánh lưu: `0dd238b` (005), `ef8d9fd` (006), `9cf7483` (008), `e4d3618` (012), `21481b2` (013), `a656f0b` (014), `47ea673` (009), `af0c0db` (README/DEVLOG). Nội dung của chúng đã nằm trong commit chuyển `f9052dc` trên main repo đích; không chép trùng hoặc replay patch lên bản đã có.

- Bảy file 005, 006, 008, 009, 012, 013, 014 khớp từng byte với snapshot hiện tại của `codex/solana-learning-notes`.
- Cả 23 dòng thêm không rỗng của commit `af0c0db` trong README/DEVLOG đều hiện diện trong bản gộp.
- Nhánh nguồn `codex/solana-learning-notes` vẫn ở `1c7e50250bcad01c7563dd36ddf54a9bb53b5755`; không thêm commit, revert, reset hoặc push nguồn.
- Người dùng đã hủy đề xuất revert trước đây. Không xin duyệt hoặc thực hiện lại danh sách revert cũ.

## Bước chuyển nhánh đang bị Git chặn

Đã thử đúng `git switch main`, không dùng force/merge/discard. Git báo sẽ ghi đè các file sau và hủy thao tác:

| Loại | File nguồn gây chặn |
| --- | --- |
| Đã tracked, đang sửa | `packages/game-rules/src/v2/index.ts` |
| Đã tracked, đang sửa | `supabase/functions/boss-fight/deno.json` |
| Đã tracked, đang sửa | `supabase/functions/equip/deno.json` |
| Đã tracked, đang sửa | `supabase/functions/game-state/deno.json` |
| Đã tracked, đang sửa | `supabase/functions/idle-claim/deno.json` |
| Đã tracked, đang sửa | `supabase/functions/relic-forge/deno.json` |
| Đã tracked, đang sửa | `supabase/functions/relic-mint-report/deno.json` |
| Đã tracked, đang sửa | `supabase/functions/upgrade/deno.json` |
| Untracked, trùng đường dẫn trên main | `packages/game-rules/src/v2/forge/craft.ts` |
| Untracked, trùng đường dẫn trên main | `packages/game-rules/src/v2/forge/forge.test.ts` |
| Untracked, trùng đường dẫn trên main | `packages/game-rules/src/v2/forge/index.ts` |
| Untracked, trùng đường dẫn trên main | `packages/game-rules/src/v2/forge/relic.ts` |
| Untracked, trùng đường dẫn trên main | `packages/game-rules/src/v2/forge/salvage.ts` |

Sau lần thử, HEAD/status không đổi; hash cả 4.590 file đang sửa/untracked đã kiểm kê đều khớp. Local main là `683ad5322859f08128efda1e536d2c8acf4f2ba1`; chưa pull hoặc di chuyển ref đó.

Vì người dùng giới hạn thao tác nguồn ở chuyển nhánh và cấm xóa/reset, không tự stash/commit/di chuyển các file sản phẩm. Cần người dùng chọn cách giữ thay đổi chưa commit trước khi thử lại. Phương án có thể xin phép: stash riêng 13 file gây chặn (gồm năm file untracked), giữ stash nguyên, rồi chạy `git switch main`; không tự apply/drop stash và không đổi nhánh lưu. Phương án này **chưa được cho phép hoặc thực hiện**.

## Kiểm tra lần chuyển và bước tiếp tục

Commit chuyển tài liệu `f9052dc` đã push tới `origin/main` của repo đích; `git ls-remote` xác nhận remote main trùng HEAD sau push. Commit này chỉ thay đổi 18 file tài liệu. Không push hoặc thay đổi HEAD repo nguồn.

Bản kiểm kê/hash trước chuyển lưu tạm tại `/tmp/solana-docs-migration-source.json` và `/tmp/solana-docs-migration-target.json`; kết quả kiểm tra tại `/tmp/solana-docs-migration-validation.json`. Không coi file `/tmp` là artifact bền vững. Kết luận đã xác nhận trước commit:

- 14 file (13 note 002–014 và REVIEW) giống nguồn từng byte; đủ 15 note 000–014 sau gộp.
- Nội dung nguyên bản của cả ba file trùng tên còn nguyên trong bản gộp; cả hai template được giữ đầy đủ.
- Bảy file tracked khác của repo đích giữ nguyên SHA-256, gồm AGENTS.md, 000–001 và README ở root.
- 20 file Markdown được kiểm tra: 52 fenced blocks cân bằng, 68 link cục bộ có đích; whitespace check đạt. Một link sandbox `/tmp` chỉ tồn tại trên máy hiện tại, không phải artifact Git.
- Toàn bộ 5.059 file tracked/untracked đã kiểm kê ở nguồn giữ nguyên hash; HEAD và status nguồn không đổi. Chưa thực hiện bất kỳ revert nào.

Sau compact: đọc phần hiện hành này trước. Nội dung cả hai agent đã ở repo đích; chỉ còn giải quyết cách giữ 13 file gây chặn rồi chuyển workspace nguồn về main khi được cho phép. Không revert, không copy trùng tài liệu, không force checkout hoặc tự stash. Trạng thái chờ quyết định chỉ áp dụng bước chuyển nhánh.

## Bài học / lỗi đã gặp

Chọn nhầm workspace khiến ghi chú nằm trong repo sản phẩm. Đã gộp vào repo học tập thật, giữ lịch sử và nội dung có sẵn; người dùng chọn giữ nguyên nhánh nguồn làm bản lưu. Chuyển nhánh có thể bị chặn bởi thay đổi chưa commit, kể cả khi chỉ chuyển tài liệu. Không dùng force để vượt chặn và không nâng kết quả “đã đọc” thành “đã chạy”.

---

## Bàn giao nghiên cứu gốc — chỉ lưu lịch sử

Phần dưới mô tả công việc đã hoàn tất ở Taskbar Hero. Đường dẫn làm việc và trạng thái duyệt của mục chuyển tài liệu là phần hiện hành ở trên; không tiếp tục task tại repo nguồn theo lời nhắc lịch sử bên dưới. Chỉ đổi cấp heading và link REVIEW tương đối để phù hợp vị trí bàn giao mới.

## Bàn giao mục tiêu học Solana

**Trạng thái: hoàn tất bộ tài liệu và rà soát.** Commit rà soát `16e6970` đã được xác nhận; phản hồi báo cáo cuối bằng tiếng Việt là bước kết thúc phiên. Cập nhật: 17/11/2026 (Asia/Ho_Chi_Minh).

Người dùng yêu cầu tiếp tục ngay; compact không phải lý do dừng. Không hỏi lại về phạm vi đã được đồng ý. Sau mỗi mục lớn cập nhật file này; chỉ dừng khi hoàn tất hoặc có bước thật sự cần người dùng quyết định/cài đặt.

### Phạm vi đã đồng ý

- Repo: `/Users/bao/Documents/ChatGPT/taskbar hero`; branch `codex/solana-learning-notes`.
- Viết tiếng Việt trong `docs/learning`, theo template mới đã được người dùng chấp thuận. Không có note 000–001 hay AGENTS.md gốc; không tự tạo nội dung giả định hoặc sửa AGENTS.md.
- Chỉ nghiên cứu/tài liệu. Không sửa sản phẩm, không tạo root `programs/` hoặc `app/`, không cài đặt, không tạo keypair, không gọi mainnet, không deploy. Lệnh thực hành chỉ để tham khảo.
- Mỗi note một commit, kèm README/DEVLOG và bản cập nhật bàn giao. Stage đường dẫn cụ thể, giữ thay đổi chưa commit của người dùng. Không push.
- Goal objective: `/Users/bao/.codex/attachments/d0ed648e-f01a-4e19-965a-3a21acfa2705/goal-objective.md`.

### Tiến độ và việc kế tiếp

| Mục | Trạng thái / bằng chứng |
| --- | --- |
| Template, README, DEVLOG | Xong — `302206f` |
| 002 | Xong — `02a087c` |
| 003 | Xong — `e286552` |
| 004 | Xong — `2f170c4` |
| 007 | Xong — `df362a2` |
| 009, chỉ phần Codex | Xong — `6565fd6`; Antigravity bổ sung sau ở `47ea673`; xem REVIEW để biết findings |
| 010 | Xong — `fd66c05`; không cài/kết nối |
| 011 | Xong — `baba05d`; đủ 10 ngày và đáp án |
| Kiểm tra toàn bộ | Xong — `16e6970`; 18 file Markdown, 49 fenced blocks cân bằng, 61 đường dẫn cục bộ tồn tại; 2 JSON + 2 TOML hợp lệ; hash 8 file tracked khớp baseline. Chín findings phần Antigravity được ghi trong REVIEW, chưa sửa |
| Báo cáo cuối | Đã chuẩn bị nội dung cho phản hồi kết thúc: đủ phạm vi Codex, 5 điều cần nhớ, bước học tiếp, quyết định cho phiên thực hành, đề xuất AGENTS.md chưa áp dụng và findings phần bổ sung |

### Bằng chứng cần giữ

- Node 24.22.2, pnpm 10.28.0, Codex CLI 0.169.0-alpha.11.1 đã được hỏi phiên bản. Rust/Solana/Anchor chưa thấy trong PATH; không cài gì.
- Baseline tài liệu: Anchor 1.2.2 → Agave 4.1.2 / platform-tools v1.57 / SBPF v3. Rust host 1.100.0 là đề xuất từ manifest; chưa build cả bộ.
- Mọi Rust snippet và lab đều chưa compile/test/deploy. Không được đổi thành “đã chạy”.
- Solana MCP: `https://mcp.solana.com/mcp`; cấu hình HTTP trực tiếp. Skill Foundation có đoạn auto-install; yêu cầu người dùng phải đồng ý trước cài đặt vẫn ưu tiên.
- Helius MCP 3.1.0: mặc định mainnet; hướng dẫn cần `HELIUS_NETWORK=devnet` và `--read-only`, chưa kết nối thử.
- Nguồn cộng đồng 009 phải ghi chưa kiểm chứng. X/Zhihu bị 403, Bilibili 412, Juejin chỉ trả “Please wait…”; không vượt chặn hoặc dùng snippet tìm kiếm làm nội dung đã đọc.
- Hash 8 file tracked sửa sẵn: `/tmp/solana-learning-original-changes.json`. So sánh trước khi kết thúc. Các file/zip untracked cũ không thuộc scope.
- Tài liệu OpenAI đã đọc qua skill `openai-docs`; cache hiện tại: `/var/folders/lc/mz_cryms1dx3rc8w3gy5ksfw0000gp/T/openai-docs-cache/codex-manual.md`.

### Thay đổi đồng thời và kết quả kiểm tra

- Antigravity thêm 005, 006, 008, 012, 013, 014; bổ sung 009 và README/DEVLOG trong lúc Codex làm. Các commit đó được giữ nguyên.
- Đọc [REVIEW-2026-11-17.md](learning/REVIEW-2026-11-17.md): chín findings thuộc phần bổ sung chưa được Codex sửa. Không nhầm “review xong” với “mọi note đều đúng”.
- Bảy note Codex đạt cấu trúc template; 34 fenced blocks cân bằng, 2 JSON + 2 TOML parse được; link nội bộ tồn tại. Đây không phải build/test Solana.
- Các file `/tmp/solana-learning-validation.json`, `/tmp/solana-learning-final-validation.json` và `/tmp/solana-learning-external-links.json` lưu output kiểm tra tạm; kết luận bền vững nằm trong REVIEW. Link Best practices đã đổi sang HTML truy cập được. Một link cục bộ tới sandbox `/tmp` chỉ được kiểm tra tồn tại, không phải bằng chứng đã chạy.

Commit `16e6970` chỉ gồm năm file tài liệu; kiểm tra staged scope và whitespace đạt. Không push. Không còn note hoặc bước rà soát nào trong phạm vi Codex cần thực hiện lại.

Nếu compact trước khi báo cáo được gửi: đọc file này, REVIEW, `git status` và `git log`; gửi báo cáo cuối, không làm lại các note. Nếu đã có phản hồi kết thúc, mục tiêu này đã hoàn tất. Sửa chín findings phần Antigravity hoặc bắt đầu lab là phạm vi tiếp theo; không tự cài đặt. Compact không phải lý do dừng một mục tiêu còn đang làm.
