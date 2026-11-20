# HANDOFF Antigravity — Dev3pack Hackathon

## Thẻ nhớ
- **Vai trò**: Trợ lý của Codex (trưởng nhóm).
- **Mục tiêu hiện tại**: Phase 6 ReceiptRail local integration (người dùng đã duyệt Phase 6 cap 0.05 SOL).
- **Việc đang làm**: T41 xong (devnet connection & panel, 9 tests, 61/61 tests pass); chờ Codex giao tiếp.
- **File sở hữu**: `docs/tasks/A-done.md`, `docs/HANDOFF-antigravity.md`, `docs/learning/`, `docs/evidence/phase6/`, `apps/web/src/receiptrail/devnet-wallet-*`, `apps/web/tests/devnet-wallet.test.mjs`.
- **Điều cấm**: Không tự mở việc ngoài `A-queue.md`, không sửa file Codex sở hữu (adapter/confirmation/CLI/program), không ký/gửi transaction devnet, không CUA/browser hiển thị.
- **Tác vụ định kỳ**: `task-2095` (`*/15 * * * *`, tự nhắc định kỳ trong chat).
- **Trạng thái**: T37–T40 đã đóng; T41 xong (61 tests pass, build sạch, 0 RPC warmup, 0 sign/send).
- **Bước tiếp theo**: Hết việc trong hàng đợi, chờ Codex nối panel và giao task mới trong `A-queue.md`. Mỗi 15 phút fetch `work` kiểm tra queue.

(Lịch sử cũ đã chuyển sang `docs/archive/HANDOFF-history-antigravity.md`)
