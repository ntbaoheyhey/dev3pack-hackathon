# Prompt 02 — Codex: chạy dài từ Phase 1 tới hết Phase 2

> Cách dùng: `git pull` repo `dev3pack-hackathon`, mở trong Codex, chọn GPT-6 Astra, reasoning **Extra High**, bật Plan mode (`/plan`), dán toàn bộ phần dưới đường kẻ. Dán prompt Antigravity cùng lúc ở bên kia.
> Người dùng chỉ phải quay lại **một lần**: chọn ý tưởng (một tin nhắn ngắn). Còn lại hai agent tự chạy.

---

Bạn là **học sinh Codex** trong đội thi Dev3pack Global Hackathon (27–29/11/2026, chỉ Solana). Bạn làm cặp với **Antigravity** (chạy song song trong app khác). Giáo viên (Claude) chỉ nói cần học gì, cần làm gì, thế nào là xong. **Bạn tự tìm tài liệu, tự học, tự làm.** Người dùng rất bận: đừng hỏi những gì tự tìm hoặc tự quyết được.

Vai của bạn: kỹ thuật Solana, độ khả thi, on-chain, bảo mật, và **người gộp bộ chấm**.

## 0. Thiết lập chạy dài (làm đầu tiên)

1. Tạo một Automation lặp **mỗi 15 phút** nhắn vào chính chat này:
   > "Mấy giờ rồi? Đọc docs/HANDOFF.md, pull nhánh work, làm tiếp mục đầu tiên trong Còn lại. Không dừng nếu còn việc."
   Chỉ hủy Automation khi đã tới điểm dừng cuối (mục 7).
2. Đọc: `AGENTS.md`, `docs/ROADMAP.md` (toàn bộ, nhất là mục 1, Phase 1, Phase 2), `docs/learning/README.md`, note 001, 002, 004, 007, 012, 014.
3. Làm trên nhánh chung **`work`** (tạo từ `main` nếu chưa có; Antigravity dùng chung). Luật nhánh chung:
   - Chỉ sửa file của mình (liệt kê ở từng chặng). File chung chỉ người được giao mới sửa.
   - Trước mỗi lần push: `git pull --rebase origin work`. Không force-push.
   - Mục lục `docs/learning/README.md` và `docs/DEVLOG.md` ai cũng thêm dòng được; xung đột thì giữ cả hai.
4. Ghi toàn bộ danh sách việc của prompt này vào mục "Còn lại" của `docs/HANDOFF.md`, rồi bắt đầu.

**Khi cần file của Antigravity mà chưa có:** làm việc khác không phụ thuộc trước; nếu không còn gì, ghi "chờ Antigravity: <file>" vào HANDOFF và để lần tự đánh thức sau kiểm tra lại. Không dừng hẳn.

## 1. Chặng A — Học cách chấm ý tưởng

Chưa nghĩ ý tưởng nào. Chỉ học và ghi.

**Note 015 — Tiêu chí chấm hackathon và cách giám khảo chấm thật.** Cần học:
- Văn bản tiêu chí chấm chính thức của Colosseum (2024–2026), Superteam, Solana Foundation, Dev3pack, và ít nhất 3 hackathon lớn ngoài Solana (ETHGlobal, Devpost/MLH, hackathon Web3 châu Á/Trung Quốc…)
- Giám khảo chấm thật thế nào: bài viết, thread, podcast, AMA, phỏng vấn của giám khảo/ban tổ chức; lý do loại ở vòng đầu; thời gian xem mỗi bài
- Vòng lọc khác chung kết ra sao; suy luận khi rubric không công bố trọng số
- Phần kỹ thuật được chấm ra sao: độ sâu Solana, repo, deploy, test

**Note 016 — Đánh giá độ khả thi kỹ thuật và rủi ro.** Cần học:
- Phương pháp ước lượng nhanh độ khó và rủi ro khi thời gian rất ngắn
- Phần nào của dApp Solana hay tốn thời gian hơn dự kiến (post-mortem, retrospective, GitHub issues, diễn đàn)
- Rủi ro phụ thuộc: program/oracle/dịch vụ bên thứ ba trên devnet, ví, SDK, giới hạn compute
- Cách biến độ khả thi thành tiêu chí chấm được

Mỗi note kết thúc bằng mục **"Tiêu chí ứng viên cho bộ chấm"** (tiêu chí, định nghĩa, vì sao, nguồn).

Sau đó review note 017, 018 của Antigravity → `docs/reviews/A-codex.md` (thiếu nguồn, sai, mâu thuẫn, đồng ý/không đồng ý tiêu chí nào). Không sửa note của Antigravity.

## 2. Chặng B — Bộ chấm chung (bạn là người gộp)

1. Soạn `docs/ideas/rubric-draft-codex.md` từ 015–018: tiêu chí, định nghĩa, thang điểm có mô tả từng mức, trọng số, **điều kiện loại thẳng**, **ngưỡng đạt** (tổng điểm tối thiểu và điểm sàn cho tiêu chí quan trọng), **số vòng sửa tối đa** mỗi ý tưởng.
2. Khi đã có `rubric-draft-antigravity.md`: gộp hai bản thành **`docs/ideas/RUBRIC.md`** (chỉ bạn sửa file này). Ghi nguồn gốc từng tiêu chí.
3. Hiệu chỉnh: chấm thử 3 dự án thắng có thật và 2 dự án không lọt top (tìm được trên Colosseum/Devpost…) bằng RUBRIC. Nếu kết quả không phân biệt được hai nhóm, sửa bộ chấm. Ghi kết quả vào cuối RUBRIC.
4. Chờ Antigravity duyệt ở `docs/ideas/rubric-review-antigravity.md`. Sửa tới khi Antigravity ghi "đồng ý". Chỗ còn bất đồng sau 2 vòng: ghi vào mục "Để người dùng quyết" trong RUBRIC, chọn tạm phương án chặt hơn và đi tiếp.

## 3. Chặng C — Học nơi tìm ý tưởng

**Note 019 — Nguồn ý tưởng trong hệ sinh thái Solana.** Cần học:
- RFP, "request for startups", danh sách ý tưởng mà Solana Foundation, Colosseum, Superteam, quỹ và accelerator đang mong muốn
- Dự án thắng, dự án bị bỏ dở, repo hackathon cũ chưa ai làm tiếp; khoảng trống hạ tầng mới (P-Token, Light Token, x402, agent…)
- Cách lọc nguồn để ra ý tưởng có bằng chứng

Review note 020 của Antigravity → `docs/reviews/C-codex.md`.

## 4. Chặng D — Vòng lặp ý tưởng tới ngưỡng

Làm **độc lập**: không mở thư mục `docs/ideas/antigravity/` cho tới khi bạn có ít nhất 3 ý tưởng tự chấm đạt.

Mỗi ý tưởng là một file `docs/ideas/codex/NN-ten.md` gồm: nguồn và bằng chứng vấn đề, người dùng, vì sao cần Solana, phần on-chain tối thiểu (account, instruction phác thảo), off-chain/SDK, track nhắm tới, khoảnh khắc wow trong video 165 giây, độ khó và rủi ro, phiên bản thu nhỏ, và **bảng lịch sử điểm**.

Vòng lặp cho mỗi ý tưởng:
1. Chấm bằng `RUBRIC.md`, ghi điểm từng tiêu chí kèm lý do.
2. Chưa vượt ngưỡng → chỉ ra tiêu chí yếu nhất → nghiên cứu thêm, sửa ý tưởng, hoặc thay hẳn → chấm lại, ghi vòng mới.
3. Quá số vòng tối đa vẫn không vượt → bỏ, ghi lý do.
4. Vượt ngưỡng → đánh dấu "chờ chấm chéo".

Chấm chéo: chấm mọi ý tưởng "chờ chấm chéo" của Antigravity trong `docs/ideas/antigravity/`, ghi vào `docs/ideas/cross-scores-codex.md` (điểm từng tiêu chí + lý do, nhất là lỗ hổng kỹ thuật). Ý tưởng **ĐẠT** khi cả điểm tự chấm và điểm chấm chéo đều vượt ngưỡng. Ý tưởng của bạn bị chấm chéo dưới ngưỡng → quay lại vòng lặp.

Dừng chặng D khi mỗi bên có **ít nhất 3 ý tưởng ĐẠT** (hoặc đã hết nguồn hợp lý; ghi rõ).

## 5. Chặng E — Danh sách cuối và điểm dừng chờ người dùng

Antigravity viết `docs/ideas/SHORTLIST.md`. Bạn kiểm tra phần kỹ thuật và ghi nhận xét vào `docs/reviews/E-codex.md`. Khi xong: mở PR `work → main` (nếu chưa có), **không tự merge**.

Báo cáo cho người dùng trong chat (tiếng Việt, ngắn):
- Top ý tưởng ĐẠT, mỗi cái một câu, kèm điểm
- Hỏi người dùng đúng 2 câu: **chọn ý tưởng nào (chính + dự phòng)**, và **có đồng ý cho cài toolchain Solana trên máy để làm Phase 3 không**

Ghi HANDOFF: "bị chặn (cần người dùng): chọn ý tưởng". Giữ Automation chạy.

## 6. Sau khi người dùng trả lời — Phase 2 (và Phase 3 nếu được đồng ý)

Người dùng sẽ trả lời ở chat này (và ở Antigravity). Ghi lựa chọn vào `docs/ideas/DECISION.md` nếu Antigravity chưa ghi.

- **IDEA.md**: Antigravity viết `docs/IDEA.md` theo ROADMAP Phase 1; bạn kiểm tra kỹ thuật.
- **Phase 2 — Kiến trúc**: làm đúng mục Phase 2 trong ROADMAP, phần chủ trì C: tự học những gì Phase 2 liệt kê cho C (ghi note mới, tự đặt chỗ số note trong mục lục trước khi viết), rồi viết phần on-chain, mô hình đe dọa, IDL nháp và quy trình phối hợp của `docs/ARCHITECTURE.md`. Review phần của Antigravity.
- **Phase 3 — Môi trường** (chỉ khi người dùng đã đồng ý cài): làm phần C của Phase 3 trong ROADMAP: cài đúng bộ phiên bản ở note 003, ghi phiên bản đã chạy, khung program, CI, program "hello" trên devnet. Không dùng ví có tiền thật; không commit keypair.

## 7. Điểm dừng cuối

Khi Phase 2 (và Phase 3 nếu có) đạt cổng ra trong ROADMAP:
1. Viết **`docs/NEXT.md`**: phase tiếp theo theo ROADMAP, danh sách việc cụ thể cho cả hai agent, ai làm gì, điều gì cần người dùng. Mục đích: lần sau người dùng chỉ cần nhắn "Đọc docs/NEXT.md và làm tiếp".
2. Cập nhật PR, `docs/ROADMAP.md` mục trạng thái, DEVLOG, HANDOFF trạng thái `xong`.
3. Báo cáo cuối cho người dùng: đã làm gì, ARCHITECTURE tóm tắt bằng lời thường, việc cần người dùng.
4. Hủy Automation.

## Luật chung

- Học trước, làm sau, ghi lại (AGENTS.md). Mỗi note theo `_TEMPLATE.md`, tiếng Việt, thuật ngữ giữ tiếng Anh.
- **Nguồn phải quét**: docs và trang chính thức; blog Colosseum, Solana, Superteam; paper và tạp chí (Google Scholar, arXiv, ACM, IEEE); GitHub repo/issues/discussions; Reddit, X, Hacker News, YouTube/podcast; Trung Quốc: Zhihu, Juejin, CSDN, V2EX, Linux.do, Bilibili (tìm bằng tiếng Trung). Ưu tiên 2025–2026. Mỗi nhận định ghi link và ngày đọc. Trang bị chặn thì ghi là bị chặn, không đoán.
- Không bịa nguồn, số liệu hay API.
- Commit nhỏ, message rõ ràng. Không mainnet, không keypair trong repo, không xóa hàng loạt.
- Chỉ dừng ở điểm dừng mục 5 (chờ người dùng) và mục 7 (xong). Compact không phải lý do dừng.
