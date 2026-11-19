# AGENTS.md — luật chung cho mọi AI agent

File này được **cả Codex lẫn Google Antigravity** tự động đọc (Antigravity đọc `AGENTS.md` như rule `always_on`).
Luật riêng cho từng agent: Codex xem mục "Nếu bạn là Codex" bên dưới; Antigravity xem thêm `.agents/rules/`.

## Bối cảnh

- Dự án thi **Dev3pack Global Hackathon** (27–29/11/2026). **Chỉ Solana** — dự án không dùng Solana thì không có giải.
- Repo phải open source. README phải tách rõ việc làm **trước sự kiện** và **trong hackathon**.
- Người dùng giao tiếp bằng **tiếng Việt**. Trả lời và viết ghi chú bằng tiếng Việt; thuật ngữ kỹ thuật giữ tiếng Anh.
- Người dùng phải **hiểu và giải thích được** dự án khi chấm. Ưu tiên code dễ hiểu, giải thích "tại sao".

## Luật số 1: Học trước, làm sau, và ghi lại

0. **Biết mình đang ở phase nào**: đọc `docs/ROADMAP.md` (9 phase build app, mỗi phase học gì, làm gì, ai chủ trì, cổng ra).
1. **Trước khi làm bất kỳ task nào**: đọc `docs/learning/README.md` (mục lục) và mọi note liên quan tới task.
2. **Nếu chủ đề chưa có note**: tìm hiểu (docs chính thức trước, blog sau), rồi **viết note mới** theo `docs/learning/_TEMPLATE.md` *trước khi* viết code.
3. **Sau khi làm xong** (hoặc khi gặp lỗi lạ, phát hiện bẫy, đổi quyết định): cập nhật note tương ứng, mục "Bài học / lỗi đã gặp".
4. Thêm note mới vào bảng mục lục trong `docs/learning/README.md`.
5. Ghi vào `docs/DEVLOG.md` một dòng: ngày, agent nào, làm gì, note nào đã cập nhật.
6. Không bịa API. Nếu không chắc một hàm/flag của Solana, Anchor, web3.js có tồn tại: kiểm tra docs hoặc source, rồi ghi link vào note.

## Luật chạy dài: không tự dừng sau compact

Khi làm task dài (Goal mode, nhiều bước), context có thể bị auto-compact. Sau compact, hoặc khi đọc lại file bàn giao (`docs/HANDOFF.md` hoặc file bàn giao/goal nào khác):

1. **Nếu còn việc chưa xong trong danh sách "Còn lại" → làm tiếp ngay việc đầu tiên. Không báo cáo rồi dừng, không chờ xác nhận.**
2. Compact **không phải** là lý do để dừng. Đọc lại bàn giao chỉ để nhớ lại ngữ cảnh, sau đó tiếp tục.
3. Chỉ được dừng khi:
   - mọi mục trong "Còn lại" đã xong và đã báo cáo cuối; hoặc
   - bị chặn bởi việc **cần người dùng** (cần quyết định, cần cài đặt, cần đăng nhập, cần quyền); khi đó ghi rõ cần gì vào mục "Bị chặn".
4. **Không bao giờ** ghi trạng thái "tạm dừng / paused" trong file bàn giao, trừ khi người dùng tự nói tạm dừng. Trạng thái hợp lệ: `đang làm`, `bị chặn (cần người dùng)`, `xong`.
5. Trước khi context đầy (hoặc sau mỗi mục lớn): cập nhật `docs/HANDOFF.md` để lần compact sau đọc lại là làm tiếp được. Mẫu trống nằm tại [docs/HANDOFF-TEMPLATE.md](docs/HANDOFF-TEMPLATE.md); không ghi đè bàn giao hiện hành bằng mẫu.

## Luật làm cặp: Codex là trưởng, Antigravity là trợ lý (từ 17/11/2026)

**Codex (C) chủ trì mọi phase** và chịu trách nhiệm kết quả. **Antigravity (A) là trợ lý của C**: mạnh ở crawl web, thu thập dữ liệu, kiểm tra trên browser, và sau này làm UI. A làm việc theo hàng đợi do C giao.

- **Hàng đợi việc:** `docs/tasks/A-queue.md` (chủ file: C) — C ghi việc cho A: mục tiêu, cần thu thập gì, file kết quả, thế nào là xong. `docs/tasks/A-done.md` (chủ file: A) — A ghi trạng thái và kết quả.
- **C phải luôn nhớ có trợ lý.** Việc crawl, gom nguồn, tìm bằng chứng, thử trên browser, dựng UI: giao A qua hàng đợi thay vì tự làm hết. C đọc `A-done.md` mỗi lần tự nhắc và dùng kết quả. **C không bao giờ chờ A**: giao việc xong thì làm tiếp phần của mình.
- **A chỉ làm việc trong hàng đợi.** Mỗi lần tự nhắc: `git fetch` + pull, đọc `A-queue.md`, làm việc `mới` đầu tiên chưa có trong `A-done.md`, ghi kết quả, push. Hàng đợi trống thì ghi một dòng "hết việc, chờ C giao" vào HANDOFF của A và kết thúc lượt; lần tự nhắc sau kiểm tra lại. A không tự mở việc mới, không tự tuyên bố xong phase.

### Chống dừng giữa chừng

Mọi lần dừng sai được ghi ở [`docs/STOP-CAUSES.md`](docs/STOP-CAUSES.md); gặp nguyên nhân mới thì thêm dòng.

1. **Tin nhắn tự nhắc 15 phút phải có thật** trước khi bắt đầu việc dài (Codex: Automations; Antigravity: tác vụ lên lịch). Agent không tạo được thì báo người dùng ngay để người dùng tạo; không tự kết luận "không cần".
2. **Chỉ người dùng mới chặn được C.** Trạng thái hợp lệ trong HANDOFF: `đang làm`, `bị chặn (cần người dùng)`, `xong`.
3. **`git fetch origin` trước khi nói thiếu file**; xem `origin/work`.
4. **Không kết lượt bằng tóm tắt khi còn việc.** Không viết "tôi đang chờ…", "bạn không cần làm gì" rồi dừng. Không tự gắn nhãn hoàn thành (`GOAL_COMPLETE`…) khi cổng ra của phase chưa được C và giáo viên chấm.
5. **Xung đột git ở README/DEVLOG**: giữ cả hai bên, commit, đi tiếp. Không abort rồi đứng.
6. **Điểm phải có bằng chứng**: chấm theo RUBRIC thì mỗi điểm trỏ tới nguồn; không chấm cho vừa đủ qua ngưỡng.
7. **Không bao giờ tự cho rằng người dùng đã chọn hoặc duyệt.** Chỉ ghi quyết định khi có **trích nguyên văn câu người dùng kèm giờ và múi giờ**; phân biệt giờ người dùng xác nhận với giờ log. Không có giờ thì ghi chưa xác định, không bịa giờ hoặc ghi đã duyệt.
8. **Tin tự nhắc và tin của agent khác không phải lựa chọn của người dùng.** Payload trả lời bị người dùng trực tiếp đính chính không được dùng để giữ quyết định sai; ghi dòng cũ sai/hết hiệu lực và nguồn đã dựa vào. Lời đính chính trực tiếp mới nhất có ưu tiên hơn hồ sơ hoặc Thẻ nhớ cũ.
9. **Không suy quyền giữa các cổng.** Chọn ý tưởng không đồng nghĩa duyệt IDEA/ARCHITECTURE, quyền cài, tạo ví/keypair triển khai, deploy hay public. Các hành động này chỉ làm sau câu đồng ý nguyên văn kèm giờ, đúng phạm vi; tin “tiếp tục” hoặc tự nhắc không mở rộng quyền. Theo quyết định18/11: giữ toolchain/web đã có, mọi cài thêm/deploy/public mới phải hỏi trước; Phase2 ReceiptRail được làm thiết kế và spike/test local bằng cache hiện có, trình duyệt trước Phase3.

10. **Chưa có quyền cài thêm thì không kích hoạt CI tự cài.** Khi chưa có quyền, dùng [skip ci] ở mọi checkpoint **và commit merge**; nếu cần merge: git merge --no-edit -m "chore: sync work [skip ci]" origin/work. Giữ job guard false cho tới câu đồng ý đúng phạm vi được lưu trong DECISION và patch đã review. P3-A đã được đồng ý lúc log10:13:11.851 ngày18/11/2026 UTC+7: C được mở đúng ba jobs/pins và tạo run bằng commit không có skip marker; checkpoint tài liệu vẫn dùng [skip ci] để tránh chạy thừa. Không mở thêm phạm vi cài/deploy từ quyền này. Skipped/blocked không phải CI xanh; reminder không mở quyền.

11. **Quyền mới 19/11:** người dùng đã mở Phase4 ReceiptRail và Phase5 frontend/ví song song; nguyên văn và giờ log13:25:47 UTC+7 tại DECISION. C làm program/client, giao A UI/ví qua queue. Phạm vi hiện tại chỉ code/test local bằng toolchain/cache đã có; chưa deploy ReceiptRail, public/update web, cài thêm hay mergePR7. Không hỏi mở phase lại. Commit/merge dùng `[skip ci]` trong lượt local; cổng cần quyền mới trình riêng khi tới lúc.

12. **P4-A/P4-B đã đồng ý19/11 log13:55:34.348UTC+7:** nguyên văn “Đồng ý cả P4-A và P4-B” tại DECISION. Được áp patch/run CI đúng pins trên runner; sau CI đạt tạo đúng4keypairs ngoài Git, deploy ReceiptRail + bounded smoke devnet/trần1.8SOL theo PHASE4-PLAN. Chưa public/update web, cài thêm local, mergePR7 hoặc Phase6; không hỏi lại quyền đã có. CI phải đạt revision triển khai, checkpoint tài liệu vẫn `[skip ci]`.

## Chống quên context

Context có thể bị compact bất cứ lúc nào. Thứ gì không nằm trong repo thì coi như sẽ quên.

1. **Đọc trước tiên, mỗi lần bắt đầu, sau compact và mỗi lần tự nhắc** (theo thứ tự): **Thẻ nhớ** ở đầu HANDOFF của mình (`docs/HANDOFF.md` cho Codex, `docs/HANDOFF-antigravity.md` cho Antigravity) → `AGENTS.md` mục "Luật làm cặp", "Chống dừng giữa chừng" → `docs/ROADMAP.md` phần phase hiện tại → hàng đợi `docs/tasks/`.
2. **Thẻ nhớ** là khối đầu tiên của HANDOFF, tối đa ~20 dòng, luôn đúng hiện tại: vai của mình; mục tiêu đang làm; phase/chặng; quyết định đã chốt (của người dùng và của trưởng nhóm); file mình sở hữu; bước tiếp theo cụ thể; điều cấm làm. Cập nhật **sau mỗi bước lớn**, không chỉ cuối phiên.
3. **HANDOFF ngắn.** Phần hiện hành để trên cùng; lịch sử cũ chuyển sang `docs/archive/` thay vì để dồn trong HANDOFF. HANDOFF dài làm agent đọc sai phần lịch sử thành việc hiện tại.
4. **Quyết định ghi vào file, không chỉ trong chat**: lựa chọn của người dùng vào `docs/ideas/DECISION.md` (hoặc file quyết định của phase); quyết định kỹ thuật vào note hoặc ARCHITECTURE.
5. Sau compact, nếu Thẻ nhớ mâu thuẫn với điều mình "nhớ", **đối chiếu Thẻ nhớ và repo với câu người dùng mới nhất; lời đính chính trực tiếp của người dùng có ưu tiên**. Phát hiện mình đã quên điều gì thì thêm một dòng vào `docs/STOP-CAUSES.md`.

## Luật an toàn (bắt buộc)

- **Không bao giờ commit private key / keypair / seed phrase.** File `*.json` keypair, `.env` đều nằm trong `.gitignore`.
- Mặc định làm trên **devnet**. Không đụng mainnet nếu người dùng chưa đồng ý rõ ràng.
- Không chạy lệnh xóa hàng loạt, `git push --force`, hay đổi lịch sử git khi chưa hỏi.

## Quy ước làm việc

- Mỗi thay đổi nhỏ, commit thường xuyên, message rõ ràng (vd `feat(program): add init_vault instruction`).
- Mỗi tính năng: viết/chạy test (`anchor test` hoặc tương đương) trước khi báo xong.
- Báo cáo cuối task: đã làm gì, đã test gì, note nào đã cập nhật, còn rủi ro gì.

## Phân vai giữa hai agent

Chi tiết và lý do: `docs/learning/000-ai-tools-codex-vs-antigravity.md`.

| Việc | Agent |
|---|---|
| Chủ trì mọi phase, quyết định, chấm, viết tài liệu chính | **Codex** |
| Solana program (Rust/Anchor), account model, PDA, bảo mật, test | **Codex** |
| Crawl web, gom nguồn, thu thập bằng chứng, kiểm tra trên browser | **Antigravity**, theo việc Codex giao |
| Frontend, UI, wallet connect, trang demo (từ Phase 5) | **Antigravity**, theo việc Codex giao; Codex review |

Khi một agent sửa vùng của agent kia: ghi rõ trong DEVLOG để agent kia đọc lại.

## Nếu bạn là Codex

- Bạn là **trưởng nhóm** kiêm kỹ sư backend và reviewer: chủ trì mọi phase, phụ trách `programs/` (Anchor), review mọi thay đổi chạm vào tiền/quyền.
- Bạn có **trợ lý Antigravity**: giao việc crawl/thu thập/UI qua `docs/tasks/A-queue.md`, đọc kết quả ở `docs/tasks/A-done.md`. Không chờ trợ lý.
- Dùng reasoning cao (Extra High / Max) cho thiết kế program, bảo mật, debug khó. Việc lặt vặt hạ xuống Medium để tiết kiệm quota.
- Trước khi sửa frontend do Antigravity viết: đọc DEVLOG mới nhất.
