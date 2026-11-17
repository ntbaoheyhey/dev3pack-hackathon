# Lịch sử HANDOFF Codex trước Prompt 03

Snapshot ngày 17/11/2026; chỉ lưu lịch sử, không cấp quyền hoặc giao việc hiện hành. Nội dung được giữ, liên kết tương đối điều chỉnh theo vị trí archive.

# Bàn giao hiện hành — Prompt 02, Codex

- **Trạng thái:** đang làm. Cập nhật 17/11/2026 (Asia/Ho_Chi_Minh).
- **Phase:** 1, D độc lập: RUBRIC v1.1 đã chốt; 019 xong, review 020 C01–C04 đã viết. Codex là người gộp RUBRIC; Antigravity làm song song qua nhánh `work`.
- **Checkout Codex:** `/Users/bao/Documents/ChatGPT/dev3pack`; remote `https://github.com/ntbaoheyhey/dev3pack-hackathon.git`. Checkout `/Users/bao/Documents/dev3pack-hackathon` đang có việc của Antigravity: không sửa/stage file ở đó.
- Đã đọc AGENTS, ROADMAP đầy đủ, mục lục/template, note 001/002/004/007/012/014. Note 015/016/019 đã đặt chỗ trong main trước phiên này.
- Quy tắc phiên Codex không cho tạo Automation để bám một task tới mốc hoàn thành; **chưa tạo Automation**. Tiếp tục trong chat hiện tại, lưu checkpoint ở đây; không hứa có tự đánh thức sau khi chat kết thúc.
- Sở hữu: Codex sửa 015/016/019, reviews A/C/E-codex, draft Codex, RUBRIC, ideas/codex, cross-scores-codex, phần kỹ thuật ARCHITECTURE; A giữ 017/018/020, draft/review A, ideas/antigravity, SHORTLIST, IDEA. README học tập/DEVLOG thêm dòng, giữ cả hai khi xung đột. Không đọc `docs/ideas/antigravity/` trước 3 ý tưởng tự chấm đạt.
- Trước mỗi push có remote work: `git pull --rebase origin work`; không force-push, không merge PR. Khởi tạo work lần đầu từ origin/main nếu remote chưa có.

## Còn lại

- [x] A1: nghiên cứu và viết note 015 (rubric chính thức Colosseum 2024–2026, Superteam, Foundation, Dev3pack, >=3 sự kiện ngoài Solana; giám khảo, vòng lọc/final, kỹ thuật); kết thúc bằng Tiêu chí ứng viên.
- [x] A2: nghiên cứu và viết 016 (ước lượng, post-mortem/issues, dependencies devnet/wallet/SDK/CU, tiêu chí khả thi); kết thúc bằng Tiêu chí ứng viên.
- [x] A3: review 017/018 → `docs/reviews/A-codex.md`, không sửa note A.
- [x] B1: `docs/ideas/rubric-draft-codex.md` từ 015–018, thang mô tả, trọng số, loại thẳng, ngưỡng/sàn, số vòng sửa.
- [x] B2: chốt `docs/ideas/RUBRIC.md` v1.0 từ draft Codex và ứng viên 017/018; Codex quyết định theo Prompt 02 mới.
- [x] B3: đã thử 3 winners + 2 honorable mentions Frontier; khoảng điểm chồng lấp vì thiếu artifact. V1.1 sửa protocol evidence/mốc snapshot; không tuyên bố đã kiểm định khả năng dự đoán giải.
- [x] B4: áp dụng review bất đồng bộ; không cần A duyệt. Góp ý mới xử lý ở version sau; bất đồng lớn ghi Để người dùng quyết và chọn phương án chặt hơn.
- [x] C1: note 019 đã viết; RFP Airtable/Light docs thiếu được ghi rõ, Samui có tuyên bố ngừng duy trì; chưa chạy SDK.
- [x] C2: review 020 tại snapshot 57b0af3 → `docs/reviews/C-codex.md`, C01–C04 không chặn D.
- [ ] D1: độc lập đề xuất/chấm/sửa >=3 ý tưởng C qua ngưỡng, đủ nguồn/user/Solana/accounts/instructions/SDK/track/demo 165 giây/rủi ro/MVP/lịch sử điểm.
- [ ] D2: sau D1 mới đọc ý tưởng A, chấm tất cả bài chờ chấm chéo → `docs/ideas/cross-scores-codex.md`; sửa bài C nếu cross-score trượt. Mỗi bên >=3 ĐẠT hoặc chứng minh hết nguồn hợp lý.
- [ ] E1: kiểm kỹ thuật SHORTLIST của A → `docs/reviews/E-codex.md`.
- [ ] E2: mở/cập nhật PR work → main, không merge; báo top + điểm, hỏi đúng 2 câu: chính/dự phòng và đồng ý cài Solana toolchain cho Phase 3.
- [ ] E3: ghi `bị chặn (cần người dùng): chọn ý tưởng`, chờ câu trả lời ở chat này.
- [ ] Sau lựa chọn: ghi DECISION nếu A chưa ghi, review kỹ thuật IDEA do A viết; không coi chọn ý tưởng tự động là duyệt IDEA.
- [ ] Phase 2: đặt chỗ note mới trước khi viết; học account/PDA, G3 liên quan, off-chain/indexer, threat model và phối hợp/IDL.
- [ ] Phase 2: phần C của ARCHITECTURE (sơ đồ, accounts/seeds/instructions/errors/events, IDL nháp, off-chain, threat model, phối hợp, công việc phase 4–6); review phần UX A.
- [ ] Phase 2 gate: review chéo, giáo viên chấm, bản giải thích 1 trang và người dùng đồng ý; ghi rõ bằng chứng, không tự duyệt thay.
- [ ] Phase 3 chỉ nếu được đồng ý: đọc 003/cài đúng phiên bản, ghi version thực, framework program/CI, hello devnet; phối hợp A web live/CI. Không dùng ví có tiền thật, không commit keypair.
- [ ] Điểm dừng cuối: NEXT cho cả hai agent, cập nhật ROADMAP/DEVLOG/HANDOFF/PR; chỉ xong khi gate thật đạt; báo kết quả và việc cần người dùng. Không có Automation để hủy trong phiên Codex này.

## Bị chặn

Chưa có blocker cần người dùng. A01–A06 tiếp tục được theo dõi nhưng không chặn B/C/D. Không chờ draft/review A. Toolchain chưa được đồng ý, không cài trong Phase 1. Automation không được tạo do quy định app cho tác vụ cụ thể; đã báo người dùng ngay khi đối chiếu mục 0. Đã kiểm danh sách automation.toml: không có mục khớp dev3pack/chat này.

## Kiểm tra / bằng chứng

Chưa viết hoặc chạy code sản phẩm. Kiểm tra tài liệu sau mỗi chặng: nguồn cụ thể + ngày đọc, link cục bộ, cấu trúc, phép tính điểm, whitespace. Repo private hiện tại phải đáp ứng open source trước khi nộp; không tự đổi visibility khi chưa tới bước được giao.

---

## Lịch sử bàn giao trước Prompt 02 (không phải công việc hiện hành)

> **Luật đọc bàn giao:** Sau compact, nếu còn việc thì đọc phần hiện hành và làm tiếp ngay. Trạng thái chỉ dùng `đang làm` | `bị chặn (cần người dùng)` | `xong`; không ghi "tạm dừng" trừ khi người dùng yêu cầu. Mẫu trống: [HANDOFF-TEMPLATE.md](../HANDOFF-TEMPLATE.md).

# Bàn giao hiện hành — sửa PR #1 và R01–R09

- **Trạng thái:** xong. Cập nhật 17/11/2026, Asia/Ho_Chi_Minh.
- Repo duy nhất: `/Users/bao/Documents/dev3pack-hackathon`; remote `https://github.com/ntbaoheyhey/dev3pack-hackathon.git`; nhánh `prompts/01-learning`.
- Chỉ tài liệu; không cài đặt, tạo keypair, deploy, mainnet, sửa Taskbar Hero, merge PR hoặc push main/force-push.
- Đã xong: merge `origin/main` và push `58ffb5a`; giữ nội dung main/mục lục, tách mẫu trống. Đã sửa R01–R09, bảng commit và giới hạn nằm trong [REVIEW](../learning/REVIEW-2026-11-17.md); R04 có ba commit `2e6889c`, `4bc4cd6`, `057085d`, R09 có `dd78420`, `c583fb6`.
- README/REVIEW đã đồng bộ; mục bài học đúng template; báo cáo sandbox cũ được gắn nhãn lịch sử. Kiểm tra 27 Markdown, 52 fences, 103 link cục bộ, 3 JSON, sáu heading mục 4, video 165 giây và phạm vi tài liệu đạt; parser cuối khớp mã đã đạt 11 fixture offline.
- Đã push toàn bộ nội dung sửa tại `d14a435fa70dee7f519291e8c0fd6606471f673a`; local/remote khớp, working tree sạch. PR #1: open, draft, merged=false, mergeable=true sau khi GitHub tính lại. Main vẫn ở `ab3561207384aad7b62d282628a23446b54c02cb`, là ancestor của nhánh; không push main. Commit chứa bản ghi xong này chỉ đóng trạng thái HANDOFF/DEVLOG.
- Còn lại: không có trong phạm vi sửa tài liệu PR #1. Các bước thực hành và thông tin chưa công bố bên dưới không phải việc cần tự thực hiện để đóng task.
- Đã đọc trang chủ/FAQ Dev3pack bằng browser. Chưa kiểm giờ UTC trên dashboard, partner tracks/bounty cuối cùng; chưa có video, số đo sản phẩm hoặc kiểm thử SDK/MWA/backend/codegen tích hợp.
- Bị chặn: không có. Task sửa tài liệu đã xong; không mở lại lịch sử chuyển repo hoặc tự bắt đầu lab.

---

## Lịch sử chuyển tài liệu — giữ nguyên nội dung main

Phần dưới chỉ là lịch sử; quyền push main và các lời nhắc kết thúc phiên cũ không áp dụng cho task hiện hành.

# Bàn giao chuyển tài liệu Solana về đúng repo

**Trạng thái: hoàn tất chuyển tài liệu Codex và Antigravity lên main repo đích. Người dùng quyết định giữ nguyên Taskbar Hero như hiện tại; không còn bước chuyển nhánh hoặc quyết định nào đang chờ.** Cập nhật 17/11/2026, Asia/Saigon.

## Nơi làm việc và ranh giới

- Repo đích: `/Users/bao/Documents/dev3pack-hackathon`, branch `main`, remote `https://github.com/ntbaoheyhey/dev3pack-hackathon.git`.
- Repo nguồn: `/Users/bao/Documents/ChatGPT/taskbar hero`, branch `codex/solana-learning-notes`, HEAD được kiểm kê `1c7e50250bcad01c7563dd36ddf54a9bb53b5755`; mốc trước học tập `6744e9b`.
- Chỉ thị cuối cùng: **giữ nguyên Taskbar Hero như hiện tại**, kể cả nhánh `codex/solana-learning-notes` và các thay đổi chưa commit. Không chuyển nhánh, stash, revert, xóa, reset hoặc sửa sản phẩm. Repo đích được phép cập nhật và push main.
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

## Lịch sử thử chuyển nhánh — yêu cầu đã hủy

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

Người dùng đã trả lời dứt khoát: không cần chuyển nhánh, không stash, không xóa; giữ nguyên Taskbar Hero. Vì vậy kết quả Git từ chối ở trên chỉ là lịch sử, không còn là việc bị chặn cần xử lý. Không thử lại hoặc xin duyệt phương án stash đã được bỏ.

## Kiểm tra lần chuyển và bước tiếp tục

Commit chuyển tài liệu `f9052dc` đã push tới `origin/main` của repo đích; `git ls-remote` xác nhận remote main trùng HEAD sau push. Commit này chỉ thay đổi 18 file tài liệu. Không push hoặc thay đổi HEAD repo nguồn.

Bản kiểm kê/hash trước chuyển lưu tạm tại `/tmp/solana-docs-migration-source.json` và `/tmp/solana-docs-migration-target.json`; kết quả kiểm tra tại `/tmp/solana-docs-migration-validation.json`. Không coi file `/tmp` là artifact bền vững. Kết luận đã xác nhận trước commit:

- 14 file (13 note 002–014 và REVIEW) giống nguồn từng byte; đủ 15 note 000–014 sau gộp.
- Nội dung nguyên bản của cả ba file trùng tên còn nguyên trong bản gộp; cả hai template được giữ đầy đủ.
- Bảy file tracked khác của repo đích giữ nguyên SHA-256, gồm AGENTS.md, 000–001 và README ở root.
- 20 file Markdown được kiểm tra: 52 fenced blocks cân bằng, 68 link cục bộ có đích; whitespace check đạt. Một link sandbox `/tmp` chỉ tồn tại trên máy hiện tại, không phải artifact Git.
- Toàn bộ 5.059 file tracked/untracked đã kiểm kê ở nguồn giữ nguyên hash; HEAD và status nguồn không đổi. Chưa thực hiện bất kỳ revert nào.

Sau compact: mục chuyển tài liệu đã hoàn tất theo quyết định cuối cùng của người dùng. Nội dung cả hai agent đã ở repo đích; Taskbar Hero được giữ nguyên. Không mở lại việc chuyển nhánh, stash hoặc revert và không hỏi lại về các bước đã hủy. Công việc học tập tiếp theo thực hiện tại dev3pack-hackathon khi được giao.

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
- Đọc [REVIEW-2026-11-17.md](../learning/REVIEW-2026-11-17.md): chín findings thuộc phần bổ sung chưa được Codex sửa. Không nhầm “review xong” với “mọi note đều đúng”.
- Bảy note Codex đạt cấu trúc template; 34 fenced blocks cân bằng, 2 JSON + 2 TOML parse được; link nội bộ tồn tại. Đây không phải build/test Solana.
- Các file `/tmp/solana-learning-validation.json`, `/tmp/solana-learning-final-validation.json` và `/tmp/solana-learning-external-links.json` lưu output kiểm tra tạm; kết luận bền vững nằm trong REVIEW. Link Best practices đã đổi sang HTML truy cập được. Một link cục bộ tới sandbox `/tmp` chỉ được kiểm tra tồn tại, không phải bằng chứng đã chạy.

Commit `16e6970` chỉ gồm năm file tài liệu; kiểm tra staged scope và whitespace đạt. Không push. Không còn note hoặc bước rà soát nào trong phạm vi Codex cần thực hiện lại.

Nếu compact trước khi báo cáo được gửi: đọc file này, REVIEW, `git status` và `git log`; gửi báo cáo cuối, không làm lại các note. Nếu đã có phản hồi kết thúc, mục tiêu này đã hoàn tất. Sửa chín findings phần Antigravity hoặc bắt đầu lab là phạm vi tiếp theo; không tự cài đặt. Compact không phải lý do dừng một mục tiêu còn đang làm.


## Checkpoint trước r1 — 17/11/2026 (lịch sử, đã thay)

# Thẻ nhớ — Codex / Prompt 03
- Trạng thái: **đang làm**, Phase **1 / D**; goal vẫn `active`, không có token budget; cập nhật 17/11/2026, Asia/Ho_Chi_Minh.
- Goal đã được tiếp tục sau lượt bàn giao; đang review/lưu spike rồi đồng bộ kết quả A để hoàn thiện r1.
- Vai: **trưởng nhóm**; Antigravity là trợ lý, nhận việc qua A-queue và trả A-done; không chờ trợ lý.
- Mục tiêu: >=3 ý tưởng ĐẠT có bằng chứng → SHORTLIST/PR → người dùng chọn → Phase 1–2; Phase 3 chỉ nếu được phép cài.
- Repo Codex: `/Users/bao/Documents/ChatGPT/dev3pack`, nhánh `work`, origin `https://github.com/ntbaoheyhey/dev3pack-hackathon.git`.
- HEAD đã push: `9fff38e`; remote-tracking `origin/work` là `2506180`, local sau 2 commit; phần mở rộng C03/review A **chưa commit**.
- Automation `dev3pack-nh-c-tr-ng-nh-m-m-i-15-ph-t`: đã view/đọc config lại, ACTIVE mỗi 15 phút vào chat `01a1e9c8-1b24-7911-91a4-4897fc175566`, đúng prompt; chưa quan sát scheduler gửi heartbeat.
- RUBRIC v1.2: weights P/S/N/F/R/D/V = 20/15/10/20/15/15/5; sàn 3/3/2/3/3/3/2; tổng >=75; F<=3 khi chưa spike; không biến U thành điểm đạt.
- Codex chấm kèm evidence, giáo viên review SHORTLIST khi PR mở; tối đa r0 rồi r1–r3; R/D4 trong PLAN chỉ nói về thiết kế.
- C01/C02/C03 vẫn r0: **66/69/64, đều chưa đạt**; review-C của A01/A02/A03: **42/40/37**, chưa commit; chưa chấm r1 Codex.
- Sở hữu C: RUBRIC, ideas/codex, cross-scores, SHORTLIST, IDEA, ARCHITECTURE, A-queue; không sửa A-done.
- Kết quả lưu: **16 test đạt**; C02 live read; C03 có **fee-only live quote** target 10000 → gross 10102, fee 102; không phải settlement.
- Tiếp theo: bảo toàn file chưa commit, cập nhật note/catalog/queue; commit rồi pull/rebase work, đọc kết quả A mới, hoàn thiện/chấm r1.
- Chưa chọn chính/dự phòng, chưa hỏi 2 câu chặng E; chưa được cài package/toolchain, tạo ví/keypair hoặc deploy.
- Cấm mainnet, secret trong Git, force-push, merge PR, sửa checkout Antigravity/Taskbar Hero hoặc tự gắn hoàn thành trước gate.
- Sau bước lớn: cập nhật thẻ/note/DEVLOG, commit nhỏ; pull --rebase và merge origin/main đã được cho phép, conflict file chung giữ cả hai bên.

## Còn lại — theo thứ tự khi tiếp tục

- [ ] Kiểm status/HEAD, đọc Thẻ nhớ/AGENTS/ROADMAP/hàng đợi; bảo toàn toàn bộ file chưa commit trước fetch/pull. Lượt bàn giao này chỉ đọc local, không đồng bộ remote. Review diff/log đã lưu; không chạy lại tests hoặc RPC khi chưa có thay đổi, lỗi hoặc nghi vấn mới.
- [ ] Cập nhật note [021](learning/021-payment-cluster-evidence.md), mục lục và [catalog evidence](evidence/phase1/README.md) với **16 test/live quote cuối** cùng giới hạn; ghi nguồn/đối thủ Ryntra và Solana Foundation Pay bên dưới. C03 parser/live đã làm, không mở lại việc tìm mint. T7 phải ghi C đã tìm được mint; bổ sung Ryntra/Pay vào T4, giữ T4/T5 và kiểm T6 sau đồng bộ.
- [ ] Stage đường dẫn cụ thể sau review, commit nhỏ để giữ code/evidence; fetch, pull --rebase origin work, merge origin/main nếu cần, push work theo quyền đã có. Remote-tracking `2506180` có ba file A mới: HANDOFF-antigravity, candidate-pain-evidence, A-done; **chưa đọc nội dung mới**, phải đọc trước dùng. Không sửa A-done thay trợ lý; conflict file chung giữ cả hai bên.
- [ ] D1: hoàn thiện >=3 bài theo RUBRIC mục 4: user/workflow, nguồn, alternatives, trust boundary, accounts/PDA/instructions, dependencies D0–D3, threat model/transitions/negative tests, scope/critical path/kill criteria, demo 165s, phân phối và evidence từng điểm. Chấm r1 trung thực; nghiên cứu/sửa/bỏ theo giới hạn r1–r3, không nâng điểm cho đủ ngưỡng.
- [ ] D2: rà lại bản `ideas/cross-scores-codex.md` đã viết và phép tính, bổ sung evidence mới nếu phù hợp, rồi commit. Review-C hiện **42/40/37**, đều chưa đạt; không reset r0–r2. A01 giữ vấn đề để nghiên cứu sau, không shortlist; A02/A03 bỏ vòng chọn hiện tại.
- [ ] E1–E2 khi >=3 bài đạt: viết lại SHORTLIST và dòng lý do thay bản A; kiểm PR hiện có rồi mở/cập nhật `work → main`, không merge. Hỏi đúng 2 câu: **chọn ý tưởng chính/dự phòng** và **đồng ý cài toolchain cho Phase 3 không**.
- [ ] E3 trong lúc chờ: chuẩn bị độc lập mẫu account/PDA, test harness/CI và kế hoạch cài trên giấy; dùng kết quả T5 về template/UX/onboarding. Chỉ ghi bị chặn cần người dùng khi đã hết phần độc lập.
- [ ] Sau lựa chọn: ghi DECISION → IDEA; học/đặt chỗ note trước làm → ARCHITECTURE đầy đủ, giải thích 1 trang và các cổng người dùng/giáo viên. Phase 3 chỉ khi được phép: bộ phiên bản đã chốt, hello devnet, CI/web live, evidence thật.
- [ ] Điểm dừng cuối: NEXT, ROADMAP, DEVLOG, HANDOFF, PR; chỉ đánh xong khi cổng Phase 2 và Phase 3 nếu có thực sự đạt. Không complete goal tại điểm chọn ý tưởng.

## Bằng chứng và công việc đang dở

**Git/điều phối:** HEAD `9fff38e6f0140e682256281b39001e9e8958d918` (`test(research): preserve read-only cluster and fee spike evidence`) đã push ở lượt trước. Các commit trước: `3a6359b` (bản rebase của `700b641`), `bd2fc42`, `fde1167`, `1dd0ab4`. Remote-tracking đã fetch ở lượt trước là `250618084bd6f48f5cbc47d3fba6741ff6aec675`, chưa pull; `origin/main` local là `b9c91b0`. Lượt bàn giao không fetch/pull/commit/push. Chưa mở PR trong phần công việc đã quan sát; kiểm lại trước tạo. Không tạo automation trùng hoặc hủy lịch khi chỉ bàn giao.

**File chưa commit, giữ nguyên:** trước lượt bàn giao có 4 tracked file sửa (`docs/learning/021-payment-cluster-evidence.md`, `docs/tasks/A-queue.md`, `research/phase1/cluster-proof.mjs`, `research/phase1/rpc.mjs`) cùng `docs/ideas/cross-scores-codex.md`, 4 module/test mới (`fee-mint.mjs`, `fee-mint.test.mjs`, `netpay-live.mjs`, `replay-evidence.test.mjs`) và các JSON/log C03 dưới `docs/evidence/phase1/`. Lượt này chỉ bổ sung HANDOFF và DEVLOG; không commit thay phần code còn cần review. `netpay.mjs`, `spikes.test.mjs`, `probe-mints.mjs` và evidence lần đầu đã có trong `9fff38e`, không còn là untracked. Không có process/tool đang chạy được biết; fetch session `95276` ở lượt trước đã exit 0.

| Bằng chứng đã lưu | Kết quả và giới hạn |
| --- | --- |
| [spikes-tests-r1-final.txt](evidence/phase1/spikes-tests-r1-final.txt) — `node --test research/phase1/spikes.test.mjs research/phase1/fee-mint.test.mjs research/phase1/replay-evidence.test.mjs` | Exit 0 ở lượt nghiên cứu trước; đọc lại log tại bàn giao: **16 pass, 0 fail**, gồm 5.940 inverse cases, 744 brute-force cases, parser negatives, epoch checks và replay raw devnet snapshot. Không compile Rust hoặc thực hiện transfer. Log 9 test lần đầu vẫn giữ nguyên. |
| [cluster-1794924487174.json](evidence/phase1/cluster-1794924487174.json) — `node research/phase1/cluster-proof.mjs` | Exit 0; Token-2022 devnet, **747 ms**, slot **523293811**, ProgramData **711053 bytes**; phát hiện 5 manifest mutations. Baseline từ cùng RPC là `OBSERVED_ONLY`, ABI `UNKNOWN`, source verification `NOT_RUN`; hash payload có padding không phải verified-build hash. |
| [mints-1794924488243.json](evidence/phase1/mints-1794924488243.json) — `node research/phase1/probe-mints.mjs` | Snapshot discovery lần đầu: mint `GE6q1pL6TjYkrc9jwpdCJAKqZDmAscVR7D9dV7MmXPpd` có fee **và transferHook**, ngoài scope. Lần chạy cuối vẫn từ chối đúng `unsupported_extensions:14`. |
| [netpay-1794925658391.json](evidence/phase1/netpay-1794925658391.json), [stdout cuối](evidence/phase1/netpay-fee-only-r1-final.txt) — `node research/phase1/netpay-live.mjs HxDYFvcXnLuy4VdxXCooUXrch8DZW34oUteQ6N2EFxEr` | Exit 0; **283 ms**, slot **523298709**, epoch **1211**. Mint fee-only: target **10000**, gross **10102**, fee **102**, net **10000** raw units; decimals 6, fee 100 bps, cap 1000000000000, old/new epoch 1083. `writesToChain:0`; quote không kiểm token-account permission, balance hoặc settlement. |

`rpc.mjs` cố định devnet, allowlist **7 RPC read-only** (thêm getProgramAccounts), giới hạn response 6 MB. `cluster-proof.mjs` chỉ đổi export `bytesOf` để dùng chung. `fee-mint.mjs` đọc base64/TLV trực tiếp, BigInt/u64; kiểm owner/initialized/COption/padding/type/TLV length và duplicate/fee schedule; reject extension ngoài scope. `netpay-live.mjs` đọc epoch trước/sau mint, yêu cầu safe integers, slot đơn điệu và không đổi epoch. Lượt bàn giao đã đối chiếu **5 script hashes khớp** artifact cuối; mint data hash `d115098b26d4231b8f61a66d80b39b31508b7c0dbdf6bcade810f0f0d4411086`. Không cài gì, không signer/broadcast; chưa phải sản phẩm hoàn chỉnh.

**Giữ lịch sử lỗi:** discovery transaction từng trả RPC `-32015` (yêu cầu version 1), rồi HTTP 429; filtered getProgramAccounts trả HTTP 403. Chạy `netpay-live.mjs` không đối số vẫn đi qua discovery bị chặn; khi cần kiểm lại dùng explicit mint nêu trên. Mint pmAMM `4F6PM96JJxngmHnZLBh9n58RH4aTVNWvDs2nuwrT5BP7` có extension ngoài scope: artifact `netpay-1794925526177.json`, exit 2. Snapshot positive đầu `netpay-1794925600812.json` có lỗi report `{mint, ...quote}` ghi đè address bằng config (raw snapshot vẫn giữ địa chỉ); đã đổi field thành `mintConfig`, thêm regression replay test và chạy lại thành artifact cuối. Không xóa/sửa snapshot cũ.

| Ý tưởng r0 | P/S/N/F/R/D/V | Tổng | Giới hạn cần giữ |
| --- | --- | --- | --- |
| [C01 ReceiptRail](ideas/codex/01-receipt-rail.md) | 4/4/3/3/3/3/2 | 66 | Invoice state/Paid atomic, không close/recreate mất dấu; custom program chưa chạy, chưa chứng minh x402 interoperability. |
| [C02 ClusterProof](ideas/codex/02-cluster-proof.md) | 4/4/3/3/3/4/2 | 69 | Kiểm cluster/program/ProgramData theo manifest; ABI/source compatibility vẫn UNKNOWN, không thay verified builds. |
| [C03 NetPay Check](ideas/codex/03-netpay-check.md) | 4/4/2/3/3/3/2 | 64 | Quote gross/net integer theo cap/epoch, không ký/gửi; quote không phải settlement, extension ngoài scope phải unsupported. |

## Trợ lý và chất lượng nguồn

- Đã giao T2 dùng blog kết quả chính thức thay profile Colosseum bị chặn; T4 >=3 alternatives mỗi nhóm, có bằng chứng phủ định; T5 template/UX Phase 2/5 trên giấy; T6 evidence đúng ba workflow, >=2 nguồn độc lập/nhóm. Queue local đã trả T6 vì URL sai/thiếu nguồn và thêm T7 tìm mint; nay **C tự tìm được fee-only mint**, cần cập nhật T7 để tránh trùng việc.
- Remote-tracking `2506180` đã có kết quả mới trong `docs/HANDOFF-antigravity.md`, `docs/data/candidate-pain-evidence.md`, `docs/tasks/A-done.md`; chưa đọc nội dung mới. Trạng thái A-done local cũ không đại diện kết quả remote. **Đọc/kiểm nội dung T6 trước khi dùng chấm**, không tự sửa A-done.
- T3 chưa dùng chấm: Reddit ID `1f66666` redirect sang bài không liên quan; `1f44444` timeout nên chỉ ghi chưa xác minh. Finding đã ở STOP-CAUSES K4/note 021/queue; không suy mọi nguồn A đều sai.
- x402 đã có payment-identifier/fingerprint/cache và retry; không lấy cache làm novelty C01. Raydium guide rounding/epoch mâu thuẫn Token-2022 upstream; dùng source upstream. Jupiter Lend README xác nhận devnet May 2025 lệch IDL hiện tại. Link và blob SHA ở note 021.
- Cross-scores đã sửa phép tính lịch sử: A01 r2 **79** thay 76; A02 r0/r1 **53/67** thay 58/70; A03 r0/r1 **53/69** thay 58/70. Sửa tổng không chứng minh điểm đầu vào; review-C không reset lịch sử vòng sửa.

**Nguồn đã đọc ở lượt nghiên cứu trước, cần đưa vào note/ledger/comparison:**

- [Ryntra SDK README](https://github.com/ryntra-io/ryntra-solana-evidence/blob/main/packages/solana-evidence-sdk/README.md), blob `eeab3768aabd819e42d75feaadeb4de5e5a66586`: inspect mint, fee/net preview, hooks, policy và receipt verification; đối thủ trực tiếp C03. README có `amountRaw`; chưa xác minh toàn repo có/không target-net inverse, **không tăng N bằng giả định đối thủ thiếu tính năng**.
- [Solana Foundation Pay README](https://github.com/solana-foundation/pay), blob `28c35e34cb5f053343937efe9b5862769fae96a0`: CLI x402/MPP, wallet authorization/debugger đã có. [Solana Pay spec v1.1](https://solana.com/docs/tools/solana-pay/specification/version1-1) và [verified builds](https://solana.com/docs/programs/verified-builds) đã đọc được trên trang chính thức; ghi đè nhận định timeout/502 còn lỗi thời trong note. Reference không nhất thiết unique, giúp tìm giao dịch, không tự enforce invoice chỉ trả một lần.
- [Kora advisory](https://github.com/solana-foundation/kora/security/advisories/GHSA-725g-w329-g7qr): affected **2.2.0**, patched field **None**; không suy mọi phiên bản hiện hành còn lỗi. Shopify 2019, x402 #452 (EVM, open), mismatch/rounding reports 2024 chỉ chứng minh case lịch sử, không thành tỷ lệ lỗi hiện tại.
- Mint provenance: [Day 50](https://github.com/gopichandchalla16/100-days-of-solana/blob/main/day-50/README.md), blob `22ee400f239112cd17631fdef936c7d4260efc80`; [Day 53](https://github.com/gopichandchalla16/100-days-of-solana/blob/main/day-53/README.md), blob `c8c67020ecb5cf85fbc6a7a8c7dda7919daf6535`. Chỉ lấy địa chỉ rồi kiểm raw devnet, không chạy lệnh tạo token từ nguồn.

## Bị chặn

Chưa có blocker cần người dùng ở bước hiện tại; goal đã tiếp tục sau bàn giao. Quyền cài và lựa chọn sản phẩm sẽ hỏi đúng hai câu ở chặng E sau khi có shortlist review được. LICENSE MIT đã xác nhận ở lượt trước; visibility repo chưa được xác minh từ kết quả đã đọc.

## Tham chiếu

- [Prompt 03](../prompts/03-codex-lead.md), [RUBRIC v1.2](ideas/RUBRIC.md), [ROADMAP](ROADMAP.md), [A-queue](tasks/A-queue.md), [A-done](tasks/A-done.md).
- Lịch sử trước Prompt 03 ở [archive](archive/HANDOFF-history-codex.md), không đọc thành việc hiện hành. Không mở lại việc chuyển repo đã hoàn tất.
- Công cụ: `web__run` từng trả `route_not_found`; connector dùng được là `mcp__codex_apps__search_service_web_run` (`system2_search_query`), GitHub `fetch_file`/`fetch_issue`/`fetch_issue_comments`. Ưu tiên `structuredContent` để tránh output lặp.


---

## Snapshot trước bàn giao b897134 — 17/11/2026

Trạng thái cũ dưới đây đã được thay bởi HANDOFF hiện hành; Agave và AVM nay có log exit0.

# Thẻ nhớ — Codex / Prompt 03
- Trạng thái **đang làm**, Phase **1/E**; goal active, không token budget; 17/11/2026 Asia/Ho_Chi_Minh.
- Trưởng nhóm; Antigravity là trợ lý qua A-queue/A-done; không sửa A-done, không chờ A.
- Mục tiêu: ≥3 ý tưởng ĐẠT có evidence → SHORTLIST/PR → người dùng chọn → Phase 1–2; Phase 3 có điều kiện.
- Repo `/Users/bao/Documents/ChatGPT/dev3pack`, branch `work`, origin `ntbaoheyhey/dev3pack-hackathon`.
- HEAD đã push **1aa322a**: r1/SHORTLIST/note022 đặt chỗ; đã pull/rebase kết quả A tới 89f62b5; main đã đồng bộ.
- Automation `dev3pack-nh-c-tr-ng-nh-m-m-i-15-ph-t` ACTIVE mỗi 15 phút đúng chat; đã view, chưa quan sát heartbeat.
- RUBRIC v1.2: weights 20/15/10/20/15/15/5, floors 3/3/2/3/3/3/2, tổng ≥75, không gate fail/pending trọng yếu.
- F≤3 khi chưa spike; R/D4 PLAN là thiết kế; không U thành điểm đạt; tối đa r0 rồi r1–r3, không reset ID.
- C02/C03/C01 r1 **79/77/75**, ĐẠT PLAN theo C; chưa giáo viên/người dùng duyệt. Review-C A01/A02/A03: 42/40/37, không shortlist.
- Evidence: 16 test đạt, C02 live 747 ms, C03 fee-only live 283 ms; không settlement/custom program/Phase 3.
- Note 021/mục lục/catalog đã cập nhật; T7 bỏ vì C đã tìm mint; T6 V2 đã đọc, còn diễn giải cần sửa.
- Sở hữu C: RUBRIC, ideas/codex, cross-scores, SHORTLIST, IDEA, ARCHITECTURE, A-queue.
- PR #7 đã mở/chưa merge. Người dùng đã chọn C02 chính/C03 dự phòng và cho phép cài toolchain Phase3; DECISION đã ghi, note022 đã viết.
- Đang cài: Rust1.100.0 đã exit0; Agave4.1.2 exec session `91211`, theo log phase3; không khởi chạy lại nếu session còn sống.
- Cấm mainnet/secrets/force push/merge PR/sửa checkout A hoặc Taskbar Hero. Học trước, cập nhật note/DEVLOG/Thẻ nhớ sau bước lớn.

## Còn lại

- [x] Hoàn thiện C01–C03 đủ RUBRIC mục 4, chấm r1 có evidence; F C01=3, N C03=3; kiểm công thức/sàn/links.
- [x] SHORTLIST/PR#7 đã có; user chọn C02 chính/C03 dự phòng, đồng ý cài Phase3; DECISION ghi xong.
- [x] Note022 đã viết contract/account/PDA/test harness/CI/kế hoạch cài.
- [ ] Cài tiếp Agave/AVM/Anchor/platform-tools, hello build/test/devnet + CI; dùng process handle sống, không restart do timeout. Cập nhật note003 bằng output thật.
- [ ] Sau quyết định: DECISION → IDEA (người dùng duyệt), ARCHITECTURE/giải thích một trang và cổng review. Phase 3 chỉ khi được phép.
- [ ] Cuối thật: NEXT/ROADMAP/DEVLOG/HANDOFF/PR; chỉ complete khi cổng Phase 2 và Phase 3 nếu có đã đạt.

## Evidence và giới hạn hiện hành

- [Catalog](evidence/phase1/README.md), [note 021](learning/021-payment-cluster-evidence.md): 16 tests ở spikes-tests-r1-final.txt; không cần rerun khi code không đổi.
- C02: cluster-1794924487174.json, slot 523293811, ProgramData 711053 bytes; 5 manifest mutations. OBSERVED_ONLY/ABI UNKNOWN/source NOT_RUN; payload hash có padding.
- C03: netpay-1794925658391.json; mint HxDYFvcXnLuy4VdxXCooUXrch8DZW34oUteQ6N2EFxEr, slot 523298709, epoch 1211; target 10000→gross 10102 / fee 102 / net 10000. Raw bytes, 5 script hashes khớp; writesToChain0. Chưa account permission/balance/settlement.
- Discovery không đối số còn bị 403, không retry; khi có lý do mới dùng explicit mint. Snapshot positive đầu có lỗi report ghi đè mint đã sửa; giữ nguyên artifact lịch sử và replay regression.
- Ryntra đã có fee/net/hook/policy/receipt, Solana Foundation Pay đã có x402/MPP/retry/debugger. Nguồn và SHA ở note 021. Không tuyên bố novelty từ feature chưa tìm thấy.
- T6 V2 đã nhận: URL đúng, còn nhầm compute fee với transfer fee và suy luận Shopify. Queue đã ghi sửa; dùng nguồn C tự kiểm. T4 đã đọc (89f62b5) nhưng không dùng chấm: thiếu URL, nhầm transfer fee/CU, khuyên mainnet ngoài scope; queue đã trả lại. T5 đã nhắc làm ngay, không chờ chọn ý tưởng.
- A01 giữ vấn đề để nghiên cứu sau, không shortlist; A02/A03 bỏ vòng chọn. Phép tính lịch sử đã sửa ở cross-scores.

## Bị chặn

Người dùng đã trả lời: C02 chính/C03 dự phòng, đồng ý cài toolchain Phase3. Tiếp tục IDEA/ARCHITECTURE + setup; chỉ hỏi thêm nếu có blocker thật hoặc tới cổng duyệt tài liệu hoàn chỉnh. Không cài hoặc tạo ví trước quyền; chưa tuyên bố phase xong. Lịch sử checkpoint ở [archive](archive/HANDOFF-history-codex.md).


---

## Snapshot trước bàn giao a7b8af1 — 17/11/2026

Bản dưới đây đã lỗi thời, chỉ giữ lịch sử. Checkpoint hiện hành nằm trong docs/HANDOFF.md: platform-tools đã cài, hello đã build/test, IDL đã sinh; không khởi động lại phiên cài cũ.

# Thẻ nhớ — Codex / Prompt 03
- Trạng thái **đang làm**; goal active, không token budget; checkpoint 17/11/2026, Asia/Ho_Chi_Minh.
- Đã tiếp tục goal sau lượt bàn giao; đang làm setup Phase3, không đổi goal thành paused/complete.
- Codex trưởng nhóm; Antigravity trợ lý qua A-queue/A-done; không sửa A-done, không chờ A.
- Mục tiêu: hoàn tất Phase 1–2 và Phase 3 đã được phép; cập nhật PR work → main, không merge.
- Repo `/Users/bao/Documents/ChatGPT/dev3pack`, branch `work`; HEAD đã push **b897134**.
- Người dùng chốt **C02 ClusterProof chính, C03 NetPay Check dự phòng**; DECISION đã ghi, không hỏi lại.
- Đã cho phép Rust1.100.0, Agave4.1.2, AVM/Anchor1.2.2, platform-tools v1.57 và dependencies cần build.
- Phase1 còn cổng duyệt IDEA; Phase2 ARCHITECTURE v0.1 chưa duyệt; Phase3 đang setup, chưa đạt cổng ra.
- Rust/Agave/AVM/Anchor đều có log **exit_code=0**, version pass; phiên cài cũ đã kết thúc.
- Platform-tools v1.57 đang cài session58870; Anchor defaults build v1.57/v3. Chưa hello build/test/devnet hoặc CI/web live.
- Automation `dev3pack-nh-c-tr-ng-nh-m-m-i-15-ph-t`: lần view trước ACTIVE đúng chat mỗi15 phút; chưa quan sát heartbeat.
- RUBRIC v1.2: weights20/15/10/20/15/15/5, floors3/3/2/3/3/3/2, tổng≥75; F≤3 nếu chưa spike; không U→đạt/reset vòng.
- C02/C03/C01 r1 **79/77/75**, ĐẠT PLAN theo C, chưa giáo viên chấm; review-C A01/A02/A03 **42/40/37**.
- C sở hữu RUBRIC, ideas/codex, cross-scores, SHORTLIST, IDEA, ARCHITECTURE, A-queue; A nhận T8 apps/web.
- Tiếp theo: poll58870; scaffold hello chính thức single/LiteSVM0.15 tại tmp, keypair ngoài Git; build/test và devnet.
- Cấm mainnet/secrets/force-push/merge PR/sửa checkout A hoặc Taskbar Hero; cập nhật note/DEVLOG/Thẻ nhớ sau bước lớn.

## Còn lại

- [x] Ghi versions-initial.json, cập nhật note003/mục lục; AVM/Anchor1.2.2 version pass, đã đọc help/source.
- [ ] Hoàn tất platform-tools v1.57 (session58870) rồi build/test. Không cài lại Rust/Agave/AVM/Anchor theo snapshot cũ.
- [ ] Scaffold hello từ CLI/template chính thức đã kiểm; giữ keypair ngoài Git; build/test thật, deploy devnet và kiểm program ID + transaction success, CI thật. Chưa có bằng chứng hoàn tất các bước này.
- [ ] Fetch/pull an toàn trước khi kết luận thiếu kết quả A; đọc T6 V3 đã nhận tại2b61cf9, tìm T5/T8 mới, dùng kết quả và giao tiếp qua queue.
- [ ] Hoàn thiện IDEA/ARCHITECTURE (Next/Vite chưa chốt), bản giải thích một trang, review/cổng duyệt. Chọn C02 không đồng nghĩa duyệt mọi chi tiết.
- [ ] Cập nhật PR#7 theo DECISION, architecture và setup thực; body cũ vẫn nói chờ lựa chọn/note022 đặt chỗ. Đọc lại metadata/head/checks trước báo.
- [ ] Chỉ khi cổng Phase2 và Phase3 thật đạt: NEXT/ROADMAP/DEVLOG/HANDOFF/PR, completion audit; không complete goal chỉ vì shortlist/cài toolchain.

## Git và điều phối

- HEAD và origin/work local: `b897134fbec81f32e58e160522b985f08ef6205e`; origin/main local: `b9c91b0d0cb191e6f0aa348d0540ffa83985c908`. Lượt bàn giao không fetch/pull/commit/push.
- Gần nhất: b897134 IDEA/ARCHITECTURE/setup; a64638a DECISION/note022; 2b61cf9 T6 V3 của A. 6731c5b đã lưu C03 parser/evidence; 1aa322a r1/SHORTLIST/đặt chỗ022. SHA trước rebase c5ce35e/22b60db không phải HEAD hiện tại.
- [PR#7](https://github.com/ntbaoheyhey/dev3pack-hackathon/pull/7): open, draft=false, merged=false, mergeable=true ở lần inspect **trước** push b897134; chưa kiểm lại từ đó. Repo private, MIT; chưa đổi visibility.
- Chưa commit: `docs/evidence/phase3/agave-install.txt`, `avm-install.txt`; lượt này sửa HANDOFF/DEVLOG và lưu snapshot cũ vào archive. Rust log đã commit. Giữ tất cả logs.
- Automation đã view ở lượt trước với thread `01a1e9c8-1b24-7911-91a4-4897fc175566`; không tạo trùng/hủy khi bàn giao. Không suy lịch ACTIVE là đã quan sát tin nhắn chạy thật.

## Toolchain: đã quan sát và chưa làm

Máy macOS27.2 arm64, Node24.22.2, Xcode CLT tại `/Library/Developer/CommandLineTools`; lượt setup kiểm còn213.9GiB. Cài với `--no-modify-path`, chưa sửa shell profile; dùng binary tuyệt đối hoặc task PATH.

| Thành phần | Kết quả thực | Log / bước còn lại |
| --- | --- | --- |
| Rust | rustc1.100.0 (0ef1bc386,2026-11-09), cargo1.100.0 (3acc79c0c,2026-11-05), rustup1.29.3; minimal + rustfmt/clippy; session51182 exit0 | [rust-install](evidence/phase3/rust-install.txt); binary tại `/Users/bao/.cargo/bin/` |
| Agave | Installer4.1.2 exit0; đã kiểm solana-cli4.1.2 (src182084b8,featc763ae0a) ở lượt setup; session91211 đã xong | [agave-install](evidence/phase3/agave-install.txt); `/Users/bao/.local/share/solana/install/active_release/bin/solana` |
| AVM | Lượt bàn giao poll session50517: Installed avm1.2.2, log exit_code=0; source otter-sec/anchor tagv1.2.2 rev8d9d1488, --locked | [avm-install](evidence/phase3/avm-install.txt); `/Users/bao/.cargo/bin/avm`; chưa --version/help. Warning yoke-derive0.8.3 yanked không làm install fail |
| Anchor/platform-tools | Chưa cài/chọn Anchor1.2.2 hoặc xác nhận platform-tools v1.57; chưa scaffold/build/test | Đọc help/source phù hợp trước lệnh; giữ bộ đã được cho phép |

Không còn process cài đang chạy được biết sau khi đọc log AVM exit0. Lượt bàn giao chỉ đọc output tiến trình có sẵn; không bắt đầu cài mới.

Script metadata lượt setup lỗi ngay `import tomllib` với `ModuleNotFoundError`; chưa tạo `docs/evidence/phase3/versions-initial.json`, chưa cập nhật note003/HANDOFF theo script đó. **Note003 và dòng mục lục “chưa cài/chờ đồng ý” đã lỗi thời**; quyền đã có và trạng thái thực ở bảng trên. Khi tiếp tục dùng parser sẵn có/đọc chọn lọc, không cần thêm dependency chỉ để ghi metadata. Installer/manifest ở `/tmp/dev3pack-toolchain-20261117/`; manifest Rust ngày2026-11-12.

Chưa tạo signer/keypair, ký, broadcast, deploy hoặc scaffold program trong phần đã quan sát. Hello Phase3 là lab riêng; product core C02 read-only, không custom program/PDA/signer. Signer devnet riêng giữ ngoài Git; nếu thiếu tài khoản/quyền thực sự thì ghi đúng blocker.

## Sản phẩm, evidence và trợ lý

- [DECISION](ideas/DECISION.md) đã ghi lựa chọn/quyền cài. [IDEA](IDEA.md)/[ARCHITECTURE](ARCHITECTURE.md) v0.1: C02 loader-v3/devnet/read-only; manifest diff MATCH/MISMATCH/UNKNOWN, ABI UNKNOWN/source NOT_RUN. Chưa duyệt chi tiết; chưa có generated IDL hay web URL được xác nhận.
- [Note021](learning/021-payment-cluster-evidence.md)/[catalog](evidence/phase1/README.md): `spikes-tests-r1-final.txt` **16 pass,0 fail**, 5.940 inverse cases/744 brute-force cases, parser negatives/epoch/slot/replay. Lệnh đã chạy: `node --test research/phase1/spikes.test.mjs research/phase1/fee-mint.test.mjs research/phase1/replay-evidence.test.mjs`; không rerun ở lượt bàn giao.
- C02 `cluster-1794924487174.json`:747ms,slot523293811,ProgramData711053 bytes,5 manifest mutations. Baseline OBSERVED_ONLY, ABI UNKNOWN/source NOT_RUN; payload hash gồm padding, không phải verified-build hash.
- C03 `netpay-1794925658391.json`/`netpay-fee-only-r1-final.txt`:283ms,slot523298709,epoch1211; target10000→gross10102/fee102/net10000 raw units; mint `HxDYFvcXnLuy4VdxXCooUXrch8DZW34oUteQ6N2EFxEr`,decimals6,100bps,cap1000000000000. Năm script hashes khớp,writesToChain0; chưa balance/permission/settlement.
- Discovery không đối số còn403; chỉ explicit mint khi có lý do kiểm lại. Snapshot `netpay-1794925600812.json` lỗi report ghi đè address đã sửa bằng mintConfig/replay test; giữ artifact lỗi. Ryntra có fee/net/hook/policy/receipt; Foundation Pay có x402/MPP/retry/debugger; không claim novelty từ tính năng chưa tìm thấy.
- A01 giữ vấn đề nghiên cứu sau, A02/A03 bỏ vòng hiện tại. Điểm lịch sử đã sửa, không reset vòng. C01 r1 sát ngưỡng75; N4→3 sẽ còn73; F3 vì invoice program chưa chạy.
- T6 **V3 đã pull tại2b61cf9 nhưng C chưa đọc nội dung**. T4 tại89f62b5 thiếu URL, nhầm token transfer fee với ComputeBudget/CU, khuyên mainnet ngoài scope; đã trả queue, không dùng chấm. T2 cần thay Renaissance bằng bộ Frontier/Cypherpunk/Breakout/Radar.
- T5 đã nhắc làm ngay; T8 giao A apps/web, web hello/devnet wallet lab, pin/build/browser/live link nếu có hosting; chưa quan sát output T5/T8, phải fetch trước kết luận thiếu.
- [Note022](learning/022-phase2-3-independent-prep.md) đã viết sau đặt chỗ1aa322a: contract/account/PDA/harness/CI/phiếu cài. Next template official Kit^8.5.0/Next16.4.3/React19.2.8/Node≥24; Surfpool1.7.0 test có mainnet remote fallback, không chạy nguyên trạng. Core C02 không cần wallet/plugin transaction; template/license/SHA ở note022.

## Bị chặn và cổng duyệt

Chưa có blocker cần người dùng cho bước setup kế tiếp; không hỏi lại hai quyết định đã trả lời. IDEA cần người dùng duyệt; Phase2 cần review/giáo viên chấm/bản giải thích một trang được đồng ý; Phase3 cần program ID+transaction thật, web live và CI xanh. Chưa đánh dấu cổng nào đạt chỉ từ lựa chọn hay cài xong AVM.

Goal đã tiếp tục sau bàn giao. Metadata tomllib đã xử lý bằng standard library, note003/mục lục đã cập nhật. T6 V3 đã đọc/ghi review trong queue; T5/T8 ưu tiên, sau fetch chưa có commit mới. Các bảng chi tiết checkpoint trước bên trên giữ lịch sử; phiên cài hiện hành duy nhất là58870. Lịch sử ở [archive](archive/HANDOFF-history-codex.md); không đọc snapshot cũ thành hiện trạng.
