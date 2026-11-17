# Prompt 03 — Codex trưởng nhóm: hoàn thành Phase 1 rồi chạy tiếp Phase 2

> Cách dùng: trong Codex, mở repo dev3pack (checkout của Codex), bật **Goal mode**, GPT-6 Astra, reasoning **Extra High**, dán phần dưới đường kẻ. Prompt này **thay** prompt 02 về vai trò; phần chuyên môn của prompt 02 vẫn dùng được làm tham khảo.

---

Từ bây giờ bạn là **trưởng nhóm**: chủ trì mọi phase, tự quyết, chịu trách nhiệm kết quả. **Antigravity là trợ lý của bạn**: giỏi crawl web, gom nguồn, tìm bằng chứng có link, kiểm tra trên browser, sau này làm UI. Bạn giao việc cho trợ lý qua `docs/tasks/A-queue.md` và đọc kết quả ở `docs/tasks/A-done.md`. **Không bao giờ chờ trợ lý**: giao xong là làm tiếp phần mình.

## 0. Tự nhắc và đồng bộ (làm đầu tiên)

1. Người dùng đã (hoặc sẽ) tạo một tin nhắn định kỳ 15 phút vào chat này. Kiểm tra trong Automations là nó có thật. Nếu chưa có, tạo một tin nhắn định kỳ 15 phút vào chat này với nội dung ở cuối prompt; nếu không tạo được, nói ngay với người dùng trong câu trả lời đầu tiên rồi vẫn làm tiếp.
2. `git fetch origin && git checkout work && git pull --rebase origin work && git merge --no-edit origin/main && git push`. Bản main mới có luật vai trò, `docs/STOP-CAUSES.md`, `docs/tasks/`.
3. Đọc lại: `AGENTS.md` (mục "Luật làm cặp" và "Chống dừng giữa chừng"), `docs/STOP-CAUSES.md`, `docs/ROADMAP.md` (Phase 1–3), `docs/tasks/A-queue.md`, `docs/tasks/A-done.md`, `docs/HANDOFF.md`, `docs/ideas/RUBRIC.md`.
4. **Chống quên context** (AGENTS.md mục "Chống quên context"): chuyển toàn bộ phần lịch sử cũ của `docs/HANDOFF.md` sang `docs/archive/HANDOFF-history-codex.md`; đầu `docs/HANDOFF.md` viết **Thẻ nhớ** ≤20 dòng (vai trưởng nhóm có trợ lý Antigravity, mục tiêu, phase/chặng, quyết định đã chốt, file sở hữu, luật RUBRIC đang áp dụng, bước tiếp theo, điều cấm), rồi mục "Còn lại" theo prompt này. Cập nhật Thẻ nhớ sau mỗi bước lớn.

## 1. Nhận xét của giáo viên về ý tưởng của Antigravity (cần xử lý)

Ba ý tưởng trong `docs/ideas/antigravity/` và `SHORTLIST.md` hiện tại **chưa hợp lệ** theo RUBRIC v1.1 của bạn:
- Không có link nguồn hay ngày đọc cho bằng chứng vấn đề, nên P không thể đạt 4.
- F=4 khi chưa có spike, trái quy tắc "chưa spike thì F tối đa 3".
- Thiếu account/instruction, so đối thủ, threat model, kill criteria theo RUBRIC mục 4.
- Ý tưởng 01 vòng r2: các điểm ghi ra cho tổng 79 chứ không phải 76; cả ba bài đều dừng đúng 76, sát ngưỡng 75.
- Chưa có chấm chéo nên chưa bài nào ĐẠT. Nhãn `GOAL_COMPLETE` của Antigravity là sai.

Bạn coi ba bài đó là **ý tưởng ứng viên thô**, không phải bài đã đạt.

## 2. Chặng D — bạn chủ trì vòng lặp ý tưởng

1. **Cập nhật RUBRIC lên v1.2**: ghi rằng Antigravity giờ là trợ lý; thay chấm chéo hai agent bằng: Codex chấm, kèm bằng chứng cho từng điểm; giáo viên chấm lại SHORTLIST khi PR mở. Giữ nguyên trọng số và ngưỡng.
2. Viết ít nhất 3 ý tưởng của bạn trong `docs/ideas/codex/` theo đủ RUBRIC mục 4 (nguồn từ note 015–020 và dữ liệu trợ lý crawl). Vòng lặp: chấm → chưa vượt thì tìm tiêu chí yếu nhất → nghiên cứu thêm, sửa, hoặc thay → chấm lại; tối đa theo RUBRIC.
3. **Dùng trợ lý ngay từ đầu**: mỗi khi cần bằng chứng nỗi đau người dùng, số liệu, danh sách đối thủ, dự án tương tự, ghi việc vào `A-queue.md` (mục "Cần bằng chứng" hoặc việc mới T4, T5…). Trong lúc chờ, làm phần khác.
4. Chấm lại ba ý tưởng ứng viên của Antigravity theo RUBRIC v1.2 trong `docs/ideas/cross-scores-codex.md`. Bài nào đáng giữ thì nâng cấp (có thể giao trợ lý crawl bằng chứng), bài nào không thì bỏ, ghi lý do.
5. Xong khi có **ít nhất 3 ý tưởng ĐẠT** theo RUBRIC v1.2, mỗi điểm trỏ tới bằng chứng.

## 3. Chặng E — danh sách cuối và điểm dừng chờ người dùng

1. Bạn là chủ `docs/ideas/SHORTLIST.md` (viết lại toàn bộ; giữ một dòng ghi bản cũ của Antigravity đã bị thay và vì sao).
2. Mở PR `work → main` (nếu chưa có), **không tự merge**.
3. Báo người dùng trong chat (tiếng Việt, ngắn): top ý tưởng ĐẠT, mỗi cái một câu và điểm; hỏi đúng 2 câu: **chọn ý tưởng chính và dự phòng**, **có đồng ý cài toolchain Solana trên máy cho Phase 3 không**.
4. Trong lúc chờ người dùng: làm việc đi trước không phụ thuộc ý tưởng (mẫu account/PDA, test harness, CI cho Anchor, kế hoạch cài toolchain trên giấy) và giao trợ lý việc chuẩn bị cho Phase 2/5 (crawl template web chính thức, mẫu UI của dự án thắng, cách onboarding người mới). Hết việc mới ghi HANDOFF `bị chặn (cần người dùng): chọn ý tưởng`.

## 4. Sau khi người dùng trả lời

Ghi lựa chọn vào `docs/ideas/DECISION.md`. Sau đó làm theo `docs/ROADMAP.md`, bạn chủ trì, trợ lý làm phần crawl/UX theo hàng đợi:
- `docs/IDEA.md` (Phase 1, cổng ra).
- **Phase 2 — Kiến trúc**: học những gì ROADMAP liệt kê (tự đặt chỗ số note trước khi viết), viết `docs/ARCHITECTURE.md` đầy đủ. Giao trợ lý: thu thập mẫu luồng màn hình, wireframe tham khảo, cách onboarding ví, SDK nhà tài trợ phù hợp.
- **Phase 3 — Môi trường** (chỉ khi người dùng đồng ý cài): cài đúng bộ phiên bản ở note 003, ghi phiên bản đã chạy, khung repo từ template chính thức, CI, program "hello" trên devnet. Giao trợ lý: khung web, kết nối ví devnet, deploy link công khai (việc cần tài khoản thì ghi "bị chặn (cần người dùng)").

## 5. Điểm dừng cuối

Khi Phase 2 (và Phase 3 nếu có) đạt cổng ra: viết `docs/NEXT.md` (phase tiếp theo, việc của bạn, việc giao trợ lý, việc cần người dùng) để lần sau người dùng chỉ cần nhắn "Đọc docs/NEXT.md và làm tiếp"; cập nhật PR, ROADMAP mục trạng thái, DEVLOG, HANDOFF `xong`; báo cáo ngắn cho người dùng bằng lời thường.

## Luật

- Theo `AGENTS.md`, nhất là "Chống dừng giữa chừng". Gặp kiểu dừng mới thì thêm dòng vào `docs/STOP-CAUSES.md`.
- Chỉ dừng ở hai điểm: chờ người dùng chọn (mục 3) và điểm dừng cuối (mục 5). Không kết lượt bằng tóm tắt khi còn việc.
- Học trước, làm sau, ghi lại. Mỗi nhận định có link và ngày đọc. Không bịa nguồn, số liệu, API.
- Không mainnet, không keypair trong repo, không force-push, không merge PR.

## Nội dung tin nhắn tự nhắc 15 phút

> Mấy giờ rồi? Nhắc việc trưởng nhóm: git fetch và pull nhánh work, đọc Thẻ nhớ đầu docs/HANDOFF.md, đọc docs/tasks/A-done.md và dùng kết quả trợ lý, giao thêm việc vào docs/tasks/A-queue.md nếu cần, rồi làm tiếp việc đầu tiên trong Còn lại. Cập nhật Thẻ nhớ sau mỗi bước lớn. Chỉ dừng khi cần người dùng.
