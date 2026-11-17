# Prompt 02 — Antigravity: Phase 1 · Ý tưởng & spec (phần Antigravity)

> Cách dùng: mở repo `dev3pack-hackathon` trong Antigravity, chọn Gemini 3.8 Flash, mức **High**, chế độ **Planning**, dán toàn bộ phần dưới đường kẻ.
> Chạy **song song** với prompt 02 của Codex. Hai bên **không đọc bài của nhau** cho tới Bước 4.

---

Bạn là **học sinh Antigravity** trong đội thi Dev3pack Global Hackathon (27–29/11/2026, chỉ Solana). Giáo viên (Claude) đã lập lộ trình 9 phase để build một app hoàn chỉnh, bắt đầu từ bây giờ. Đây là **Phase 1 — Ý tưởng & spec**. Phần của bạn: nhìn từ góc **người dùng, sản phẩm, demo và thông tin cuộc thi**.

Giáo viên chỉ nói bạn cần học gì và cần nộp gì. **Bạn tự tìm tài liệu và tự học.**

## Bước 0 — Tự đánh thức (làm đầu tiên)

Tạo một tác vụ lên lịch lặp **mỗi 15 phút** nhắn vào chính chat này với nội dung:
> "Mấy giờ rồi? Đọc docs/HANDOFF.md và làm tiếp mục đầu tiên trong Còn lại của Phase 1. Không dừng nếu còn việc."

Khi xong toàn bộ prompt này thì tự hủy tác vụ đó.

## Bước 1 — Đọc trước

`AGENTS.md`, `.agents/rules/antigravity-role.md`, `docs/ROADMAP.md` (đặc biệt mục 1 và Phase 1), `docs/learning/README.md`, note 001, 008, 012, 013, 014. Làm việc trên nhánh `phase1/antigravity`. Codex cũng ghi `docs/HANDOFF.md`, nên bạn ghi kế hoạch và "Còn lại" của mình vào **`docs/HANDOFF-antigravity.md`** (tạo từ `docs/HANDOFF-TEMPLATE.md`), và tin nhắn tự đánh thức của bạn trỏ tới file này.

## Bước 2 — Tự học và ghi note

Số note đã được đặt chỗ sẵn trong mục lục. Viết theo `_TEMPLATE.md`, tiếng Việt, thuật ngữ giữ tiếng Anh.

**017 — Sản phẩm, demo và pitch của dự án thắng Solana 2025–2026.** Cần tìm hiểu:
- Dự án thắng/lọt top của Colosseum Frontier (06/2026), Cypherpunk (12/2025), Agent Hackathon, x402 Hackathon, Breakout, Superteam, hackathon Solana ở châu Á
- Mỗi dự án: giải vấn đề gì cho ai, video demo dựng ra sao, giây đầu tiên nói gì, landing/README trình bày thế nào
- Mẫu chung: điều gì làm giám khảo nhớ; lỗi hay gặp ở dự án không lọt top
- Xem video demo thật nếu tìm được (YouTube, X, Colosseum Arena), ghi link

**018 — Vấn đề thật ở Việt Nam và Đông Nam Á có thể giải bằng Solana.** Cần tìm hiểu:
- Nỗi đau thật của người dùng (thanh toán, kiều hối, sinh viên, freelancer, cộng đồng, sự kiện, game, nhà bán hàng nhỏ…) từ diễn đàn, Reddit, nhóm Facebook công khai, Tinh tế, VOZ, báo cáo thị trường
- Ai đang giải vấn đề đó (Web2 và Web3), họ còn thiếu gì
- Tình hình pháp lý crypto ở Việt Nam cuối 2026 ở mức đủ để tránh ý tưởng vướng luật
- Ghi rõ: cái nào có bằng chứng, cái nào là giả thuyết

**019 — Viết spec sản phẩm gọn cho hackathon.** Cần tìm hiểu:
- Cách viết one-liner, user story, phạm vi MVP và "không làm" sao cho làm xong trong vài ngày
- Mẫu spec/PRD ngắn từ các đội thắng hoặc từ cộng đồng sản phẩm

**Cập nhật note 001** (không tạo note mới) bằng browser: giờ UTC hạn nộp trên dashboard (nếu xem được), partner tracks đã công bố chưa, local track $500 có Việt Nam không, điều kiện giải Best Mobile App, nội dung Solana Rust Bootcamp của Dev3pack. Mỗi thông tin ghi link và ngày xem. Trang cần đăng nhập thì ghi rõ để người dùng tự xem.

Nguồn: docs chính thức trước; rồi blog Colosseum/Solana, YouTube, X, Reddit, Hacker News, Product Hunt, diễn đàn và mạng xã hội Việt Nam; Trung Quốc: Zhihu, Juejin, CSDN, V2EX, Linux.do, Bilibili, Xiaohongshu. Trang bị chặn thì ghi là bị chặn, không đoán nội dung.

## Bước 3 — Đề xuất 5 ý tưởng (độc lập)

Viết `docs/ideas/antigravity.md`. **Không mở `docs/ideas/codex.md`** trước khi file của bạn đã commit.

Ràng buộc chung cho mọi ý tưởng:
- Solana là phần **không thể thiếu**, không phải gắn thêm cho có.
- Đội gồm hai AI agent và một người không chuyên; có khoảng 9 ngày build + 3 ngày sự kiện.
- Demo được một luồng thật trên devnet trong **165 giây**.
- Không làm thứ cần giấy phép tài chính để demo, không đụng tiền thật của người dùng.

Mỗi ý tưởng một mục, đủ các ý:
1. Tên tạm + one-liner (một câu: cái gì, cho ai, giải quyết gì)
2. Người dùng cụ thể và vấn đề của họ (có bằng chứng hay chỉ là giả thuyết — ghi rõ)
3. Vì sao cần Solana
4. Luồng người dùng chính (3–6 bước, từ mở app tới kết quả)
5. Phần off-chain và SDK nhà tài trợ hợp lý (nếu có)
6. Track/giải có thể nhắm (Best App, Best Mobile, local track…)
7. "Khoảnh khắc wow" trong video, phác 165 giây theo note 013
8. Người mới chưa có ví thì vào app thế nào
9. Rủi ro sản phẩm lớn nhất và phiên bản thu nhỏ nếu bị trễ

## Bước 4 — Chấm chéo

Sau khi `docs/ideas/antigravity.md` đã commit **và** `docs/ideas/codex.md` đã có trên `main` hoặc nhánh `phase1/codex` (fetch để kiểm tra; nếu chưa có thì ghi vào HANDOFF và chờ tới lần tự đánh thức sau):

Viết `docs/ideas/scores-antigravity.md`: chấm **cả 10 ý tưởng** (5 của bạn, 5 của Codex) theo bảng tự chấm ở note 012 mục 3.2. Mỗi điểm có một câu lý do. Cuối file: top 3 bạn đề xuất và vì sao, kèm lỗ hổng về người dùng/demo của từng ý tưởng mà Codex có thể chưa thấy.

## Bước 5 — Nộp bài

- Cập nhật mục lục `docs/learning/README.md` (trạng thái note 017, 018, 019 và 001), thêm mục vào `docs/DEVLOG.md`.
- Mỗi note và mỗi file ý tưởng một commit, message rõ ràng.
- Trước khi mở PR: merge `origin/main` vào nhánh của bạn; nếu xung đột ở README/DEVLOG thì giữ cả hai bên.
- Push nhánh `phase1/antigravity`, mở PR vào `main`. **Không tự merge**; giáo viên sẽ chấm và merge.
- Cập nhật `docs/HANDOFF-antigravity.md` trạng thái `xong`.

## Ranh giới

- Phase này **không code, không cài đặt gì**, không tạo ví hay keypair, không tạo `app/`.
- Không bịa: thứ gì không chắc thì ghi "chưa kiểm chứng". Không gắn mẹo hay số liệu cho nguồn không nói điều đó.
- Giữ đúng phạm vi, không viết dài thừa.
- Không quyết định thay người dùng: người dùng chọn ý tưởng sau khi giáo viên gộp kết quả.

## Báo cáo cuối (tiếng Việt, gửi người dùng)

- 3 điều quan trọng nhất học được ở 017, 018, 019
- Thông tin cuộc thi mới tìm được (hạn nộp, tracks)
- Top 3 ý tưởng bạn đề xuất, mỗi cái một câu
- Câu hỏi bạn muốn người dùng trả lời (tối đa 3)
