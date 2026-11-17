# AGENTS.md — luật chung cho mọi AI agent

File này được **cả Codex lẫn Google Antigravity** tự động đọc (Antigravity đọc `AGENTS.md` như rule `always_on`).
Luật riêng cho từng agent: Codex xem mục "Nếu bạn là Codex" bên dưới; Antigravity xem thêm `.agents/rules/`.

## Bối cảnh

- Dự án thi **Dev3pack Global Hackathon** (27–29/11/2026). **Chỉ Solana** — dự án không dùng Solana thì không có giải.
- Repo phải open source. README phải tách rõ việc làm **trước sự kiện** và **trong hackathon**.
- Người dùng giao tiếp bằng **tiếng Việt**. Trả lời và viết ghi chú bằng tiếng Việt; thuật ngữ kỹ thuật giữ tiếng Anh.
- Người dùng phải **hiểu và giải thích được** dự án khi chấm. Ưu tiên code dễ hiểu, giải thích "tại sao".

## Luật số 1: Học trước, làm sau, và ghi lại

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
5. Trước khi context đầy (hoặc sau mỗi mục lớn): cập nhật `docs/HANDOFF.md` để lần compact sau đọc lại là làm tiếp được.

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

| Việc | Agent chính |
|---|---|
| Solana program (Rust/Anchor), account model, PDA, bảo mật | **Codex** |
| Review code / audit bảo mật, debug lỗi khó, test | **Codex** |
| Frontend (Next.js/React), UI, wallet connect, trang demo | **Antigravity** |
| Prototype nhanh, thử nhiều ý tưởng, kiểm tra trên browser | **Antigravity** |
| Viết note học, README, script demo video | Cả hai (agent nào làm phần nào thì ghi phần đó) |

Khi một agent sửa vùng của agent kia: ghi rõ trong DEVLOG để agent kia đọc lại.

## Nếu bạn là Codex

- Bạn là "kỹ sư backend + reviewer": phụ trách `programs/` (Anchor) và review mọi thay đổi chạm vào tiền/quyền.
- Dùng reasoning cao (Extra High / Max) cho thiết kế program, bảo mật, debug khó. Việc lặt vặt hạ xuống Medium để tiết kiệm quota.
- Trước khi sửa frontend do Antigravity viết: đọc DEVLOG mới nhất.
