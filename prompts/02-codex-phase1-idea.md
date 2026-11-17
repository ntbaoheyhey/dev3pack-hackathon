# Prompt 02 — Codex: Phase 1 · Ý tưởng & spec (phần Codex)

> Cách dùng: mở repo `dev3pack-hackathon` trong Codex, chọn GPT-6 Astra, reasoning **Extra High**, bật Plan mode (`/plan`), dán toàn bộ phần dưới đường kẻ.
> Chạy **song song** với prompt 02 của Antigravity. Hai bên **không đọc bài của nhau** cho tới Bước 4.

---

Bạn là **học sinh Codex** trong đội thi Dev3pack Global Hackathon (27–29/11/2026, chỉ Solana). Giáo viên (Claude) đã lập lộ trình 9 phase để build một app hoàn chỉnh, bắt đầu từ bây giờ. Đây là **Phase 1 — Ý tưởng & spec**. Phần của bạn: nhìn từ góc **kỹ thuật Solana và độ khả thi**.

Giáo viên chỉ nói bạn cần học gì và cần nộp gì. **Bạn tự tìm tài liệu và tự học.**

## Bước 0 — Tự đánh thức (làm đầu tiên)

Tạo một Automation lặp **mỗi 15 phút** nhắn vào chính chat này với nội dung:
> "Mấy giờ rồi? Đọc docs/HANDOFF.md và làm tiếp mục đầu tiên trong Còn lại của Phase 1. Không dừng nếu còn việc."

Khi xong toàn bộ prompt này thì tự hủy Automation đó.

## Bước 1 — Đọc trước

`AGENTS.md`, `docs/ROADMAP.md` (đặc biệt mục 1 và Phase 1), `docs/learning/README.md`, note 001, 002, 012, 014. Làm việc trên nhánh `phase1/codex`. Ghi kế hoạch và danh sách "Còn lại" vào `docs/HANDOFF.md` trước khi bắt đầu.

## Bước 2 — Tự học và ghi note

Số note đã được đặt chỗ sẵn trong mục lục. Viết theo `_TEMPLATE.md`, tiếng Việt, thuật ngữ giữ tiếng Anh.

**015 — Phân tích kỹ thuật dự án thắng Solana 2025–2026.** Cần tìm hiểu:
- Dự án thắng/lọt top của Colosseum Frontier (06/2026), Cypherpunk (12/2025), Agent Hackathon (03/2026), Solana x402 Hackathon, Breakout, Superteam, và các hackathon Solana khác bạn tìm được trong 2025–2026
- Mỗi dự án: dùng tính năng Solana nào (PDA, token, Token-2022, cNFT, oracle, CPI vào DeFi, Actions/Blinks, Solana Pay, x402, mobile…), on-chain làm gì và off-chain làm gì, repo có công khai không
- Mẫu chung: tính năng nào hay xuất hiện ở dự án thắng, tính năng nào chỉ để "trang trí"
- Hạ tầng mới đáng dùng: trạng thái hiện tại của P-Token, Light Token, và những thay đổi khác cuối 2026

**016 — Ước lượng độ khó kỹ thuật trên Solana.** Cần tìm hiểu:
- Những phần nào hay tốn thời gian hơn dự kiến khi build dApp Solana (theo post-mortem, Reddit, X, Zhihu, Juejin, CSDN, V2EX, GitHub issues…)
- Cách chia ý tưởng thành phần on-chain tối thiểu và phần off-chain
- Rủi ro thường gặp: phụ thuộc program bên thứ ba trên devnet, oracle trên devnet, giới hạn compute, ví không hỗ trợ tính năng
- Một thang đo độ khó đơn giản (ví dụ 1–5) để chấm ý tưởng ở Bước 3

Nguồn: docs và source chính thức trước; rồi blog Colosseum/Solana, paper, GitHub, Reddit, X, Hacker News; Trung Quốc: Zhihu, Juejin, CSDN, V2EX, Linux.do, Bilibili (tìm bằng tiếng Trung). Mỗi nhận định ghi link và ngày đọc. Trang bị chặn thì ghi là bị chặn, không đoán nội dung.

## Bước 3 — Đề xuất 5 ý tưởng (độc lập)

Viết `docs/ideas/codex.md`. **Không mở `docs/ideas/antigravity.md`** trước khi file của bạn đã commit.

Ràng buộc chung cho mọi ý tưởng:
- Solana là phần **không thể thiếu**, không phải gắn thêm cho có.
- Đội gồm hai AI agent và một người không chuyên; có khoảng 9 ngày build + 3 ngày sự kiện.
- Demo được một luồng thật trên devnet trong **165 giây**.
- Không làm thứ cần giấy phép tài chính để demo, không đụng tiền thật của người dùng.

Mỗi ý tưởng một mục, đủ các ý:
1. Tên tạm + one-liner (một câu: cái gì, cho ai, giải quyết gì)
2. Người dùng cụ thể và vấn đề của họ (có bằng chứng hay chỉ là giả thuyết — ghi rõ)
3. Vì sao cần Solana
4. Phần on-chain tối thiểu: account, instruction chính (phác thảo, chưa code)
5. Phần off-chain và SDK nhà tài trợ hợp lý (nếu có)
6. Track/giải có thể nhắm (Best App, Best Mobile, local track…)
7. "Khoảnh khắc wow" trong video
8. Độ khó theo thang ở note 016, rủi ro lớn nhất và cách giảm
9. Phiên bản thu nhỏ nếu bị trễ

## Bước 4 — Chấm chéo

Sau khi `docs/ideas/codex.md` đã commit **và** `docs/ideas/antigravity.md` đã có trên `main` hoặc nhánh `phase1/antigravity` (fetch để kiểm tra; nếu chưa có thì ghi vào HANDOFF và chờ tới lần tự đánh thức sau):

Viết `docs/ideas/scores-codex.md`: chấm **cả 10 ý tưởng** (5 của bạn, 5 của Antigravity) theo bảng tự chấm ở note 012 mục 3.2, cộng thêm cột "Độ khó" theo note 016. Mỗi điểm có một câu lý do. Cuối file: top 3 bạn đề xuất và vì sao, kèm lỗ hổng kỹ thuật của từng ý tưởng mà Antigravity có thể chưa thấy.

## Bước 5 — Nộp bài

- Cập nhật mục lục `docs/learning/README.md` (trạng thái note 015, 016), thêm mục vào `docs/DEVLOG.md`.
- Mỗi note và mỗi file ý tưởng một commit, message rõ ràng.
- Trước khi mở PR: merge `origin/main` vào nhánh của bạn; nếu xung đột ở README/DEVLOG thì giữ cả hai bên.
- Push nhánh `phase1/codex`, mở PR vào `main`. **Không tự merge**; giáo viên sẽ chấm và merge.
- Cập nhật `docs/HANDOFF.md` trạng thái `xong`.

## Ranh giới

- Phase này **không code, không cài đặt gì**, không tạo ví hay keypair.
- Không bịa: thứ gì không chắc thì ghi "chưa kiểm chứng".
- Không quyết định thay người dùng: người dùng chọn ý tưởng sau khi giáo viên gộp kết quả.

## Báo cáo cuối (tiếng Việt, gửi người dùng)

- 3 điều quan trọng nhất học được ở 015 và 016
- Top 3 ý tưởng bạn đề xuất, mỗi cái một câu
- Câu hỏi bạn muốn người dùng trả lời (tối đa 3)
- Vài dòng bằng lời thường giải thích các ý tưởng cho người không chuyên
