# Prompt 01 — Codex: Học nền tảng on-chain (chưa code sản phẩm)

> Cách dùng: mở repo trong Codex, chọn GPT-6 (bản mạnh nhất bạn có, ưu tiên Astra), reasoning **High** hoặc **Extra High**, bật Plan mode (`/plan`), dán toàn bộ phần dưới đây.

---

Bạn là kỹ sư Solana kiêm người hướng dẫn cho mình. Mình chuẩn bị thi **Dev3pack Global Hackathon (27–29/11/2026, chỉ Solana)**. Hiện tại **chưa có ý tưởng sản phẩm và chưa viết code sản phẩm**. Nhiệm vụ lần này chỉ là **nghiên cứu và ghi chép** để sau này làm đúng và làm tốt.

## Bước 0 — Đọc trước
Đọc `AGENTS.md`, `docs/learning/README.md`, `docs/learning/_TEMPLATE.md`, `docs/learning/000-*.md`, `docs/learning/001-*.md`. Tuân thủ toàn bộ luật trong `AGENTS.md`.

## Mục tiêu
Viết các note sau trong `docs/learning/`, mỗi note theo đúng `_TEMPLATE.md`, bằng tiếng Việt (thuật ngữ giữ tiếng Anh), mỗi note có **ít nhất 1 link docs chính thức** và ghi rõ **phiên bản** công cụ đã kiểm tra (ngày 2026-11):

1. **002 — Solana căn bản**: account model (khác EVM thế nào), program là account, owner, rent, transaction/instruction, signer, CPI, PDA (seeds, bump), compute units, priority fee, devnet vs mainnet. Viết sao cho mình (người mới) đọc 15 phút là giải thích lại được cho giám khảo.
2. **003 — Toolchain**: cài Rust, Solana CLI (Agave), Anchor (dùng avm), Node/pnpm, ví devnet, airdrop/faucet. Ghi **bảng phiên bản tương thích** (Rust ↔ Solana CLI ↔ Anchor), các lỗi cài đặt hay gặp trên macOS/Windows (WSL) và cách sửa. Nếu máy mình chưa cài: liệt kê lệnh, **hỏi mình trước khi chạy lệnh cài đặt**.
3. **004 — Anchor từ A đến Z (ở mức lý thuyết + ví dụ tối thiểu)**: cấu trúc project, `#[program]`, `#[derive(Accounts)]`, constraints (`init`, `seeds`, `has_one`, `signer`…), error, event, IDL, client generation (Codama), test (LiteSVM/Mollusk cho unit, Surfpool hoặc `anchor test` cho integration), deploy lên devnet, verify build. Có thể tạo một project nháp trong thư mục `sandbox/` (đã gitignore nếu cần) để thử, nhưng **không** tạo `programs/` thật.
4. **007 — Bảo mật Solana program**: checklist các lỗi kinh điển (missing signer check, missing owner check, account substitution, PDA seed collision, arithmetic overflow, `unwrap()` panic, re-init, close account sai, CPI tới program giả, type cosplay…). Mỗi lỗi: ví dụ ngắn sai/đúng bằng Anchor. Đây sẽ là checklist review cho mọi code sau này.
5. **010 — AI tooling cho Solana**: tìm hiểu và đánh giá
   - Solana Developer MCP (`https://mcp.solana.com/`)
   - Skill chính thức: `npx skills add solana-foundation/solana-dev-skill` (cài vào `.agents/skills/`)
   - Helius MCP / skills, các skill Solana khác nếu có
   Ghi cách cài cho **Codex** và **Antigravity**, cái nào đáng dùng, rủi ro gì. **Hỏi mình trước khi cài** bất cứ thứ gì.
6. **009 — Mẹo dùng Codex (phần của Codex)**: tìm mẹo tối ưu Codex/GPT-6 trên mạng xã hội **và** diễn đàn, cả global lẫn **Trung Quốc**:
   - Global: docs/blog OpenAI, OpenAI Community forum, GitHub (openai/codex issues/discussions), Reddit, Hacker News, X, dev.to
   - Trung Quốc: 掘金 Juejin, CSDN, V2EX, 知乎 Zhihu, Linux.do, Bilibili (tìm bằng từ khóa tiếng Trung, ví dụ `Codex 使用技巧`, `AGENTS.md 怎么写`, `Codex 省额度`)
   - Dịch sang tiếng Việt, **ghi link nguồn cho từng mẹo**, đánh dấu mẹo nào là chính thức / mẹo cộng đồng chưa kiểm chứng.
   - **Bỏ qua** mọi mẹo lách quota, reverse proxy, chia sẻ tài khoản hay vi phạm điều khoản dịch vụ.
   - Nếu trang nào bắt đăng nhập/chặn bot thì bỏ qua và ghi lại.
   - Viết vào phần "Codex" của note `009-tips-codex-antigravity.md` (Antigravity sẽ viết phần của nó).

## Sản phẩm phụ
- `docs/learning/011-solana-learning-roadmap.md`: lộ trình học 27/11 trở về trước (từ hôm nay 17/11 → 26/11), mỗi ngày làm gì, có bài tập nhỏ để tự kiểm tra.
- Đề xuất chỉnh `AGENTS.md` nếu bạn thấy luật nào thừa/thiếu (chỉ **đề xuất** trong báo cáo, không tự sửa).
- Cập nhật mục lục `docs/learning/README.md` và thêm dòng vào `docs/DEVLOG.md`.

## Ranh giới
- Không viết code sản phẩm, không tạo `programs/` hay `app/`.
- Không đụng mainnet, không tạo hay commit keypair.
- Không bịa API: thứ gì không chắc thì kiểm tra docs/source và ghi link; nếu vẫn không chắc thì ghi "chưa kiểm chứng".
- Ưu tiên nguồn mới (2026). Thông tin cũ hơn 2025 phải ghi chú có thể đã lỗi thời.

## Xong khi
- Có đủ note 002, 003, 004, 007, 010, 011 và phần Codex của 009, đúng template, có nguồn.
- Mục lục và DEVLOG đã cập nhật, commit với message rõ ràng (vd `docs(learning): add 002 solana basics`), mỗi note một commit.
- Báo cáo cuối cho mình (tiếng Việt): đã viết gì, 5 điều quan trọng nhất mình cần nhớ, câu hỏi bạn muốn mình trả lời, và đề xuất bước tiếp theo.
