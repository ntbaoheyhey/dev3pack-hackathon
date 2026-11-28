# Thẻ nhớ — Codex / ReceiptRail / Prompt 05

- **Đang làm.** C thực hiện [Prompt 05](../prompts/05-codex-final-submit.md) cho bộ nộp Dev3pack. [Nguồn quyền và giờ log](ideas/DECISION.md).
- Hạn tuyệt đối **14:00 ngày 29/11/2026 UTC+7**. Giao sớm trước 23:30 tối 28/11, bản cuối trước 11:30 ngày 29/11. Xong sớm thì giao ngay.
- Đã kiểm heartbeat `receiptrail-nh-c-gi-vi-t-nam-m-i-15-ph-t` ACTIVE đúng chat, mỗi 15 phút. Mission 01 PAUSED theo người dùng.
- `work` đã đồng bộ tại `adcc706`, tag hồi tố `hackathon-start` = `63f59ba` đã push. Hai commit tài liệu A viết 24/11 được gộp trong sự kiện.
- Baseline đạt 32 runtime, 23 client, 7 guard + 7 recovery, 61 web tests và web build. Program `8NGSPufBmGB1oHqaZpY1jhJYz1X4gqFiNXCQmxfapYko`.
- C phụ trách program/client/web/devnet, link, video và hồ sơ. Dùng signers cũ ngoài Git, cap tổng **0.5 SOL devnet**. Không mainnet, GUI, nộp form, đổi authority hay sửa Site ClusterProof.
- Đã lưu [bàn giao Mission 01](archive/2026-11-28-codex-mission01.md). Tài liệu lịch sử Phase 6 ở [bàn giao cũ](archive/2026-11-28-before-prompt05.md).

## Còn lại

1. Publish bản public từ source vừa kiểm. Site `appgprj_6b0ab845d4cc8191ba02d2acd5f4082b`, audience public, checkout `sandbox/sites/receiptrail-submission`, đã mở source. Kiểm desktop/mobile và mở hóa đơn thật khi chưa nối ví.
2. Xuất video + 6 ảnh và cover, README tiếng Anh, `docs/SUBMISSION.md`, giao sớm. File quay gốc và timeline trong `sandbox/prompt05/capture-1795864901516/` và `capture-1795865020397/`.
3. Kiểm clone sạch, CI, link, video, secret. Merge PR7, tag `submission-v1`, tắt lịch tự nhắc, bàn giao.

Đã xong E2E thật. [Đối soát finalized](evidence/phase6/e2e-devnet-2026-11-28T112558Z.json) có 6 giao dịch. Invoice `rZRAPpkLcfBcao5tMvdyZ1G7VzoDLcXiHZ7u4tPSZq2` được trả 50.000 lamports, retry 0 principal/5.000 phí. Gross 13.342.880 lamports cộng dự phòng 1.320.720 dưới cap 500.000. Bridge ký đã tắt, token local đã xóa. 67 web tests, 2 guard mới; giữ nguyên sai sót RPC 429 và kết quả thực trong evidence.
