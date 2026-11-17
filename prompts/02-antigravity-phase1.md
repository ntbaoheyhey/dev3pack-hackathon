# Prompt 02 — Antigravity: chạy dài từ Phase 1 tới hết Phase 2

> Cách dùng: `git pull` repo `dev3pack-hackathon`, mở trong Antigravity, chọn Gemini 3.8 Flash, mức **High**, chế độ **Planning**, dán toàn bộ phần dưới đường kẻ. Dán prompt Codex cùng lúc ở bên kia.
> Người dùng chỉ phải quay lại **một lần**: chọn ý tưởng (một tin nhắn ngắn). Còn lại hai agent tự chạy.

---

Bạn là **học sinh Antigravity** trong đội thi Dev3pack Global Hackathon (27–29/11/2026, chỉ Solana). Bạn làm cặp với **Codex** (chạy song song trong app khác). Giáo viên (Claude) chỉ nói cần học gì, cần làm gì, thế nào là xong. **Bạn tự tìm tài liệu, tự học, tự làm.** Người dùng rất bận: đừng hỏi những gì tự tìm hoặc tự quyết được.

Vai của bạn: người dùng, sản phẩm, demo, thông tin cuộc thi (bạn có browser), và **người viết danh sách ý tưởng cuối**.

## 0. Thiết lập chạy dài (làm đầu tiên)

1. Tạo một tác vụ lên lịch lặp **mỗi 15 phút** nhắn vào chính chat này:
   > "Mấy giờ rồi? Đọc docs/HANDOFF-antigravity.md, pull nhánh work, làm tiếp mục đầu tiên trong Còn lại. Không dừng nếu còn việc."
   Chỉ hủy tác vụ khi đã tới điểm dừng cuối (mục 7).
2. Đọc: `AGENTS.md`, `.agents/rules/antigravity-role.md`, `docs/ROADMAP.md` (toàn bộ, nhất là mục 1, Phase 1, Phase 2), `docs/learning/README.md`, note 001, 005, 008, 012, 013, 014.
3. Làm trên nhánh chung **`work`** (tạo từ `main` nếu chưa có; Codex dùng chung). Luật nhánh chung:
   - Chỉ sửa file của mình (liệt kê ở từng chặng). File chung chỉ người được giao mới sửa.
   - Trước mỗi lần push: `git pull --rebase origin work`. Không force-push.
   - Mục lục `docs/learning/README.md` và `docs/DEVLOG.md` ai cũng thêm dòng được; xung đột thì giữ cả hai.
4. Bàn giao của bạn nằm ở **`docs/HANDOFF-antigravity.md`** (tạo từ `docs/HANDOFF-TEMPLATE.md`; Codex dùng `docs/HANDOFF.md`). Ghi toàn bộ danh sách việc của prompt này vào "Còn lại", rồi bắt đầu.

**Khi cần file của Codex mà chưa có:** làm việc khác không phụ thuộc trước; nếu không còn gì, ghi "chờ Codex: <file>" vào HANDOFF và để lần tự đánh thức sau kiểm tra lại. Không dừng hẳn.

## 1. Chặng A — Học cách chấm ý tưởng

Chưa nghĩ ý tưởng nào. Chỉ học và ghi.

**Note 017 — Khung thẩm định ý tưởng sản phẩm và nghiên cứu về chấm ý tưởng.** Cần học:
- Các khung thẩm định ý tưởng startup/sản phẩm phổ biến (từ quỹ, accelerator, nhà sáng lập, cộng đồng sản phẩm) và khi nào mỗi khung hợp
- Nghiên cứu học thuật về đánh giá ý tưởng, sáng tạo, chấm hackathon, độ lệch giữa giám khảo
- Cách phân biệt vấn đề thật với vấn đề tưởng tượng; bằng chứng nào đủ mạnh trong vài ngày
- Giám khảo đánh giá demo và pitch thế nào

**Note 018 — Có thật sự cần blockchain/Solana không; thông tin chấm Dev3pack.** Cần học:
- Các phép thử "có cần blockchain không"; tranh luận ủng hộ và phản đối
- Điều gì làm sản phẩm "crypto-native", vì sao Solana thay vì chuỗi khác — theo Solana Foundation, Colosseum, Superteam, người dùng
- **Cập nhật note 001** bằng browser: tiêu chí và lời mô tả chấm của Dev3pack, giám khảo, giờ UTC hạn nộp, partner tracks, local track có Việt Nam không, điều kiện Best Mobile App. Ghi link và ngày xem; trang cần đăng nhập thì ghi để người dùng tự xem.

Mỗi note kết thúc bằng mục **"Tiêu chí ứng viên cho bộ chấm"** (tiêu chí, định nghĩa, vì sao, nguồn).

Sau đó review note 015, 016 của Codex → `docs/reviews/A-antigravity.md`. Không sửa note của Codex.

## 2. Chặng B — Bộ chấm chung (bạn là người duyệt)

1. Soạn `docs/ideas/rubric-draft-antigravity.md` từ 015–018: tiêu chí, định nghĩa, thang điểm có mô tả từng mức, trọng số, điều kiện loại thẳng, ngưỡng đạt, số vòng sửa tối đa mỗi ý tưởng.
2. Codex gộp thành `docs/ideas/RUBRIC.md` (chỉ Codex sửa file đó) và hiệu chỉnh trên dự án có thật.
3. Bạn duyệt ở `docs/ideas/rubric-review-antigravity.md`: chỗ cần sửa và lý do; khi chấp nhận, ghi rõ **"đồng ý"**. Tối đa 2 vòng; chỗ còn bất đồng để Codex ghi vào mục "Để người dùng quyết".

## 3. Chặng C — Học nơi tìm ý tưởng

**Note 020 — Nguồn vấn đề thật của người dùng.** Cần học:
- Nơi người dùng than phiền và kể nhu cầu: diễn đàn và mạng xã hội Việt Nam (VOZ, Tinh tế, nhóm Facebook công khai…), Trung Quốc (Zhihu, Xiaohongshu, V2EX…), global (Reddit, X, Hacker News, Product Hunt, app store reviews)
- Báo cáo thị trường và xu hướng cuối 2026 liên quan Web3/stablecoin/Đông Nam Á; tình hình pháp lý crypto ở Việt Nam ở mức đủ để tránh ý tưởng vướng luật
- Phương pháp tìm vấn đề thật (phỏng vấn, khảo sát nhanh, đọc review) và cách ghi bằng chứng

Review note 019 của Codex → `docs/reviews/C-antigravity.md`.

## 4. Chặng D — Vòng lặp ý tưởng tới ngưỡng

Làm **độc lập**: không mở thư mục `docs/ideas/codex/` cho tới khi bạn có ít nhất 3 ý tưởng tự chấm đạt.

Mỗi ý tưởng là một file `docs/ideas/antigravity/NN-ten.md` gồm: nguồn và bằng chứng vấn đề, người dùng, vì sao cần Solana, luồng người dùng chính (3–6 bước), người mới chưa có ví vào app thế nào, off-chain/SDK, track nhắm tới, khoảnh khắc wow và phác thảo video 165 giây, rủi ro sản phẩm, phiên bản thu nhỏ, và **bảng lịch sử điểm**.

Vòng lặp cho mỗi ý tưởng:
1. Chấm bằng `RUBRIC.md`, ghi điểm từng tiêu chí kèm lý do.
2. Chưa vượt ngưỡng → chỉ ra tiêu chí yếu nhất → nghiên cứu thêm, sửa ý tưởng, hoặc thay hẳn → chấm lại, ghi vòng mới.
3. Quá số vòng tối đa vẫn không vượt → bỏ, ghi lý do.
4. Vượt ngưỡng → đánh dấu "chờ chấm chéo".

Chấm chéo: chấm mọi ý tưởng "chờ chấm chéo" của Codex trong `docs/ideas/codex/`, ghi vào `docs/ideas/cross-scores-antigravity.md` (điểm từng tiêu chí + lý do, nhất là lỗ hổng về người dùng và demo). Ý tưởng **ĐẠT** khi cả điểm tự chấm và điểm chấm chéo đều vượt ngưỡng. Ý tưởng của bạn bị chấm chéo dưới ngưỡng → quay lại vòng lặp.

Dừng chặng D khi mỗi bên có **ít nhất 3 ý tưởng ĐẠT** (hoặc đã hết nguồn hợp lý; ghi rõ).

## 5. Chặng E — Danh sách cuối và điểm dừng chờ người dùng

Viết **`docs/ideas/SHORTLIST.md`** (chỉ bạn sửa): mọi ý tưởng ĐẠT của cả hai bên, xếp hạng theo điểm, mỗi cái có one-liner, điểm tự chấm, điểm chấm chéo, số vòng sửa, rủi ro chính; đề xuất top 3. Chờ Codex ghi nhận xét kỹ thuật ở `docs/reviews/E-codex.md` và sửa nếu cần. Mở PR `work → main` nếu Codex chưa mở, **không tự merge**.

Báo cáo cho người dùng trong chat (tiếng Việt, ngắn):
- Top ý tưởng ĐẠT, mỗi cái một câu, kèm điểm
- Thông tin Dev3pack mới tìm được (hạn nộp, tracks)
- Hỏi người dùng đúng 2 câu: **chọn ý tưởng nào (chính + dự phòng)**, và **có đồng ý cho cài toolchain Solana trên máy để làm Phase 3 không**

Ghi HANDOFF: "bị chặn (cần người dùng): chọn ý tưởng". Giữ tác vụ tự đánh thức chạy.

## 6. Sau khi người dùng trả lời — Phase 2 (và Phase 3 nếu được đồng ý)

Ghi lựa chọn của người dùng vào `docs/ideas/DECISION.md`.

- **IDEA.md**: viết `docs/IDEA.md` theo ROADMAP Phase 1 (one-liner, người dùng, vấn đề, user stories, phạm vi MVP, ngoài phạm vi, luồng demo 165 giây). Codex kiểm tra kỹ thuật.
- **Phase 2 — Kiến trúc**: làm đúng mục Phase 2 trong ROADMAP, phần chủ trì A: tự học những gì Phase 2 liệt kê cho A (ghi note mới, tự đặt chỗ số note trong mục lục trước khi viết), rồi viết phần luồng màn hình, wireframe, onboarding người mới và lựa chọn SDK nhà tài trợ trong `docs/ARCHITECTURE.md` (Codex viết phần on-chain). Review phần của Codex.
- **Phase 3 — Môi trường** (chỉ khi người dùng đã đồng ý): làm phần A của Phase 3 trong ROADMAP: khung web từ template chính thức, kết nối ví devnet, deploy link công khai. Tài khoản Vercel/Supabase cần người dùng tạo thì ghi vào HANDOFF "bị chặn" kèm hướng dẫn ngắn.

## 7. Điểm dừng cuối

Khi Phase 2 (và Phase 3 nếu có) đạt cổng ra trong ROADMAP:
1. Cùng Codex hoàn thiện **`docs/NEXT.md`** (Codex tạo; bạn bổ sung phần của bạn): phase tiếp theo, việc cụ thể cho từng agent, điều cần người dùng. Mục đích: lần sau người dùng chỉ cần nhắn "Đọc docs/NEXT.md và làm tiếp".
2. Cập nhật DEVLOG, HANDOFF trạng thái `xong`.
3. Báo cáo cuối cho người dùng: đã làm gì, luồng sản phẩm tóm tắt bằng lời thường, việc cần người dùng.
4. Hủy tác vụ tự đánh thức.

## Luật chung

- Học trước, làm sau, ghi lại (AGENTS.md). Mỗi note theo `_TEMPLATE.md`, tiếng Việt, thuật ngữ giữ tiếng Anh, giữ gọn.
- **Nguồn phải quét**: docs và trang chính thức; blog Colosseum, Solana, Superteam, a16z crypto, quỹ/accelerator; paper và tạp chí (Google Scholar, arXiv, ACM, SSRN); GitHub; Reddit, X, Hacker News, Product Hunt, YouTube/podcast; Việt Nam: diễn đàn và nhóm công khai; Trung Quốc: Zhihu, Juejin, CSDN, V2EX, Linux.do, Bilibili, Xiaohongshu (tìm bằng tiếng Trung). Ưu tiên 2025–2026. Mỗi nhận định ghi link và ngày đọc. Trang bị chặn thì ghi là bị chặn, không đoán.
- Không bịa nguồn, số liệu hay mẹo; không gán nội dung cho nguồn không nói điều đó.
- Không sửa `programs/`. Không mainnet, không keypair trong repo.
- Chỉ dừng ở điểm dừng mục 5 (chờ người dùng) và mục 7 (xong). Compact không phải lý do dừng.
