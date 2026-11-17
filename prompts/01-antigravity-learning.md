# Prompt 01 — Antigravity: Học frontend, ví và cách thắng hackathon (chưa code sản phẩm)

> Cách dùng: mở repo trong Antigravity, chọn **Gemini 3.8 Flash**, effort **High**, chế độ **Planning** (không dùng Fast), chế độ agent **Agent-Assisted** (hỏi trước khi chạy lệnh nhạy cảm). Dán toàn bộ phần dưới đây.

---

Bạn là kỹ sư frontend Web3 kiêm người nghiên cứu cho mình. Mình chuẩn bị thi **Dev3pack Global Hackathon (27–29/11/2026, chỉ Solana)**. Hiện tại **chưa có ý tưởng sản phẩm và chưa viết code sản phẩm**. Nhiệm vụ lần này chỉ là **nghiên cứu và ghi chép**.

## Bước 0 — Đọc trước
Đọc `AGENTS.md`, `.agents/rules/antigravity-role.md`, `docs/learning/README.md`, `docs/learning/_TEMPLATE.md`, `docs/learning/000-*.md`, `docs/learning/001-*.md`. Tuân thủ toàn bộ luật.

Codex đang viết song song các note on-chain (002, 003, 004, 007, 010, 011). **Không viết đè** các note đó; nếu cần tham chiếu thì link tới.

## Mục tiêu
Viết các note sau trong `docs/learning/` theo đúng `_TEMPLATE.md`, tiếng Việt (thuật ngữ giữ tiếng Anh), mỗi note có link nguồn và ghi phiên bản thư viện (2026-11):

1. **005 — Frontend Solana**: so sánh `@solana/kit` vs `@solana/web3.js` (bản nào là mặc định năm 2026), wallet connection (`@solana/kit-plugin-wallet`, `@solana/react`, Wallet Standard, wallet adapter), gọi program Anchor từ frontend qua IDL / client sinh bằng Codama, xử lý trạng thái giao dịch (pending/confirmed/failed), hiển thị lỗi thân thiện. Stack gợi ý (Next.js hay Vite) và lý do. Có thể làm demo nháp trong `sandbox/` và **tự chạy, tự mở browser kiểm tra**, rồi ghi lại điều học được (không tạo `app/` thật).
2. **006 — Token & NFT**: SPL Token vs Token-2022 (extensions nổi bật), Metaplex (Core, Bubblegum/cNFT), khi nào nên dùng. Chỉ mức hiểu và chọn công nghệ.
3. **008 — Solana Mobile (Seeker)**: Mobile Wallet Adapter, React Native/Expo template, dApp Store, điều kiện để nhắm giải Seeker. Đánh giá: với 48 giờ, làm mobile có khả thi không.
4. **012 — Cách thắng hackathon Solana**: nghiên cứu các dự án thắng giải gần đây (Colosseum, Solana hackathons, Superteam…): họ giải bài toán gì, demo thế nào, repo trông ra sao. Đối chiếu với tiêu chí chấm của Dev3pack trong note 001 (product clarity, impact, demo, deployment, repo quality, độ sâu Solana/SDK). Rút ra checklist "những thứ phải có trước giờ nộp".
5. **013 — Video demo < 3 phút**: cấu trúc kịch bản (hook → vấn đề → demo thật → điểm Solana → kết), công cụ quay/dựng, lỗi hay gặp. Kèm một **template kịch bản** điền sẵn chỗ trống.
6. **014 — SDK nhà tài trợ**: Supabase, ElevenLabs, Firecrawl, Solana Mobile: mỗi cái làm được gì trong một app Solana, free tier, độ khó tích hợp trong 48 giờ.
7. **009 — Mẹo dùng Antigravity (phần của Antigravity)**: tìm mẹo tối ưu Antigravity + Gemini 3.8 Flash trên mạng xã hội **và** diễn đàn, cả global lẫn **Trung Quốc**:
   - Global: docs Antigravity (`antigravity.google/docs`), Google AI Developers Forum (`discuss.ai.google.dev`), Reddit, Hacker News, X, dev.to, Medium
   - Trung Quốc: 掘金 Juejin, CSDN, V2EX, 知乎 Zhihu, Linux.do, Bilibili (từ khóa ví dụ `Antigravity 使用技巧`, `Antigravity 规则`, `Gemini 3.8 Flash 体验`)
   - Dịch sang tiếng Việt, **ghi link nguồn cho từng mẹo**, đánh dấu chính thức / cộng đồng chưa kiểm chứng.
   - Chú ý các chủ đề: rules & workflows, Knowledge, Artifacts, Browser Agent, Planning vs Fast, `/boost`, quản lý quota, khi nào nên đổi model.
   - **Bỏ qua** mọi mẹo lách quota, reverse proxy, đổi vùng tài khoản, chia sẻ tài khoản hay vi phạm điều khoản dịch vụ.
   - Trang bắt đăng nhập/chặn bot thì bỏ qua và ghi lại.
   - Viết vào phần "Antigravity" của `009-tips-codex-antigravity.md` (Codex viết phần của nó; nếu file đã có thì chỉ thêm phần của bạn).

## Sản phẩm phụ
- Đề xuất thêm rule/workflow cho `.agents/rules/` nếu thấy hữu ích (chỉ **đề xuất** trong báo cáo, không tự sửa).
- Cập nhật mục lục `docs/learning/README.md` và thêm dòng vào `docs/DEVLOG.md`.

## Ranh giới
- Không viết code sản phẩm, không tạo `app/` hay `programs/`.
- Không ký giao dịch mainnet, không tạo hay commit keypair/seed phrase.
- Không đăng nhập hay tạo tài khoản ở bất kỳ dịch vụ nào khi chưa hỏi mình.
- Không bịa: không chắc thì ghi "chưa kiểm chứng". Ưu tiên nguồn 2026.
- Giữ thay đổi nhỏ, đúng phạm vi; mỗi note một commit (vd `docs(learning): add 005 solana frontend`).

## Chạy dài
- Dùng `docs/HANDOFF.md` để bàn giao giữa các lần compact. Sau compact: đọc HANDOFF rồi **làm tiếp ngay**, không dừng để báo cáo. Chỉ dừng khi xong hết hoặc bị chặn bởi việc cần mình.

## Xong khi
- Có đủ note 005, 006, 008, 012, 013, 014 và phần Antigravity của 009, đúng template, có nguồn.
- Mục lục và DEVLOG đã cập nhật.
- Báo cáo cuối cho mình (tiếng Việt): đã viết gì, 5 điều quan trọng nhất, 3 hướng ý tưởng đáng cân nhắc dựa trên research (chỉ gợi ý, chưa chọn), câu hỏi cho mình, bước tiếp theo.
