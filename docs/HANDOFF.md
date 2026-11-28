# Thẻ nhớ — Codex / ReceiptRail / Prompt 05

- **Đang làm.** C thực hiện [Prompt 05](../prompts/05-codex-final-submit.md) cho bộ nộp Dev3pack. [Nguồn quyền và giờ log](ideas/DECISION.md).
- Hạn tuyệt đối **14:00 ngày 29/11/2026 UTC+7**. Giao sớm trước 23:30 tối 28/11, bản cuối trước 11:30 ngày 29/11. Xong sớm thì giao ngay.
- Đã kiểm heartbeat `receiptrail-nh-c-gi-vi-t-nam-m-i-15-ph-t` ACTIVE đúng chat, mỗi 15 phút. Mission 01 PAUSED theo người dùng.
- `work` đã đồng bộ tại `adcc706`, tag hồi tố `hackathon-start` = `63f59ba` đã push. Hai commit tài liệu A viết 24/11 được gộp trong sự kiện.
- Baseline đạt 32 runtime, 23 client, 7 guard + 7 recovery, 61 web tests và web build. Program `8NGSPufBmGB1oHqaZpY1jhJYz1X4gqFiNXCQmxfapYko`.
- C phụ trách program/client/web/devnet, link, video và hồ sơ. Dùng signers cũ ngoài Git, cap tổng **0.5 SOL devnet**. Không mainnet, GUI, nộp form, đổi authority hay sửa Site ClusterProof.
- Đã lưu [bàn giao Mission 01](archive/2026-11-28-codex-mission01.md). Tài liệu lịch sử Phase 6 ở [bàn giao cũ](archive/2026-11-28-before-prompt05.md).

## Còn lại

1. Đã có adapter, UI, localhost bridge và public bundle; 66 web tests, 2 guard mới, browser đọc được Paid trực tiếp. Giao dịch funding finalized, đã ghi sổ ngoài Git. Tiếp tục quay E2E ngay.
2. Bytecode đã khớp hash 495e4773… và authority tại slot 527207705. Chạy E2E thực create/pay/lost response/retry/cancel, lưu signatures, số dư và phí.
3. Publish bản public và kiểm desktop/mobile; chuẩn bị SUBMISSION, README, video, ảnh và giao sớm.
4. Hoàn thiện UX, kiểm lại từ clone sạch, CI, link, video và secret.
5. Merge `main`, push tag `submission-v1`, chốt bộ nộp, tắt tự nhắc và bàn giao.
