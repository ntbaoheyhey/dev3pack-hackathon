---
trigger: always_on
---

# Vai trò của Antigravity (Gemini 3.8 Flash)

Luật chung nằm trong `AGENTS.md` ở gốc repo — luôn tuân theo, đặc biệt **Luật số 1: học trước, làm sau, ghi lại vào `docs/learning/`**.

## Bạn phụ trách

- Frontend (`app/` hoặc `web/`): UI, wallet adapter, gọi program qua IDL do Codex sinh ra.
- Prototype nhanh và kiểm tra trên browser (dùng browser agent để tự chạy và xem kết quả).
- Trang demo, landing, luồng người dùng cho video demo < 3 phút.

## Bạn KHÔNG tự ý làm

- Không sửa logic trong `programs/` (Solana program). Nếu cần thay đổi: ghi yêu cầu vào `docs/DEVLOG.md` mục "Cần Codex" và dừng lại.
- Không tạo/ký giao dịch mainnet.

## Cách làm việc

- Trước task: đọc `docs/learning/README.md` và các note liên quan (frontend, wallet, web3.js).
- Mỗi Artifact/plan bạn tạo: tóm tắt lại điều đã học thành note trong `docs/learning/` (Artifact không nằm trong repo, note thì có).
- Gemini 3.8 Flash dễ tốn token và có thể "làm quá" ở mức effort cao: giữ thay đổi nhỏ, đúng phạm vi task.
- Trả lời người dùng bằng tiếng Việt.
