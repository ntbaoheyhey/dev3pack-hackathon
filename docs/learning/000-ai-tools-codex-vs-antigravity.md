# 000 — Codex vs Antigravity: điểm mạnh và chia việc

- **Ngày**: 2026-11-17
- **Người/agent viết**: Claude (research web)
- **Giai đoạn**: trước sự kiện

## Tóm tắt 3 dòng

**Codex + GPT-6 (Extra High/Max)**: suy luận sâu, hợp với Solana program, bảo mật, debug khó. Chậm và tốn quota.
**Antigravity + Gemini 3.8 Flash (high)**: nhanh, rẻ, mạnh ở vòng lặp "làm → chạy → xem browser → sửa"; hợp frontend, prototype, demo. Yếu hơn ở task agentic khó.
→ Codex giữ "não" on-chain + review; Antigravity giữ "mặt tiền" frontend + demo.

## Kiểm chứng tên model (17/11/2026)

- **GPT-6**: có thật, chạy trong Codex. Là một *họ* model: **GPT-6 Sol** (rẻ), **GPT-6 Astra** (mạnh nhất, đắt), **GPT-6.1 Sol** (mới hơn), có nhắc tới Luna. → Cần xem trong Codex mình đang chọn đúng biến thể nào.
- **Mức reasoning trong Codex**: Low/Light, Medium, High, **Extra High (xhigh)**, **Max**, Ultra. "Extra High" và "Max" là hai mức khác nhau: xhigh cho việc rủi ro cao (bảo mật, migration); Max dồn sâu cho *một* bài toán đơn lẻ rất khó; Ultra chạy nhiều subagent song song.
- **Gemini 3.8 Flash**: có thật, ra 02/09/2026, có trong Antigravity. Dùng "effort level" (high = tốt hơn nhưng tốn token hơn).

## Codex + GPT-6 (Extra High / Max)

**Mạnh**
- Suy luận sâu, khám phá codebase lâu, chạy nhiều lệnh để tự kiểm chứng.
- Hợp việc "sai là mất tiền": logic program, PDA/seed, kiểm tra signer/owner, review bảo mật.
- Astra: FuncPass 82.1%, SecPass 34.6% (Endor Labs) — cao nhất họ GPT-6. Sol: code ngắn gọn hơn ~27%, ít bug tổng hơn.

**Yếu**
- Chậm, tốn quota (giới hạn theo cửa sổ 5 giờ + tuần). Max/xhigh lãng phí nếu prompt mơ hồ.
- GPT-6 Sol: mật độ lỗ hổng bảo mật tăng ~60% so với Astra, pass rate 83% (≈1/6 lời giải fail test), comment ít (1.3%) → **luôn bắt viết test và giải thích**.
- Ở mức cao dễ time out task dài.

**Mẹo**: lên plan ở High/xhigh, code ở Medium, review bảo mật ở xhigh/Max. Không để Max làm việc vặt.

## Antigravity + Gemini 3.8 Flash (high)

**Mạnh**
- Nhanh, rẻ ($0.75/$3.75 per 1M token tới 31/12/2026).
- DeepSWE v1.1 73.7% (ngang model lớn), Terminal-Bench 2.1 89.4%.
- **Phụ thuộc harness theo hướng tốt**: trong Antigravity mạnh hơn hẳn ở app chat, vì có vòng lặp tự chạy, tự xem browser, tự sửa. Demo ấn tượng: app bản đồ 3D, tracker ISS gọi API live.
- Chống prompt injection tốt hơn bản trước.

**Yếu**
- Task agentic khó: Terminal-Bench 4.0 chỉ 19.1%, kém xa Opus 5 / GPT-5.6 Soul.
- Tốn token hơn bản trước tới ~30%; effort high càng tốn.
- Hay có lỗi chi tiết hình ảnh (3D glitch), landing page đôi khi trông "giả".
- Một số người báo chạy rất lâu trên Antigravity.

## Đề xuất chia việc cho dự án Solana

| Giai đoạn | Codex (GPT-6, xhigh/Max) | Antigravity (Gemini 3.8 Flash, high) |
|---|---|---|
| Học | Note sâu: account model, PDA, Anchor constraints, bảo mật | Note: wallet adapter, web3.js/kit, UI flow; làm demo nhỏ để hiểu |
| Thiết kế | Thiết kế account/instruction, viết spec `docs/spec.md` | Wireframe UI, luồng người dùng cho video demo |
| Build | `programs/` + test Anchor, deploy devnet | `app/`: frontend gọi program qua IDL, chạy thử trên browser |
| Kiểm tra | Review bảo mật toàn bộ, kể cả code frontend ký giao dịch | Test E2E trên browser, quay màn hình |
| Nộp bài | Kiểm README kỹ thuật | Landing/live link, kịch bản video |

**Nguyên tắc chéo**: agent này viết, agent kia review. Code Antigravity chạm tới giao dịch → Codex review. Program của Codex → Antigravity viết UI dùng thử để phát hiện chỗ khó dùng.

## Nguồn

- https://kingy.ai/news/openai-codex-reasoning-levels-low-medium-high-extra-high/
- https://note.com/sponge841841/n/nf10c007c04cc?hl=en
- https://www.endorlabs.com/learn/gpt-6-sol-on-codex-average-scores-quarter-the-cost
- https://www.sonarsource.com/blog/open-ai-gpt-6-sol-evaluation/
- https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/
- https://www.mindstudio.ai/blog/gemini-3-8-flash-harness-demos
- https://antigravity.google/docs/rules.md
