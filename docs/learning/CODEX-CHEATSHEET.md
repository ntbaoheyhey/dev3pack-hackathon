# Sổ tay Codex — ReceiptRail (1 trang)

19/11/2026 · trước sự kiện. Đọc Thẻ nhớ và DECISION trước lệnh có tác dụng ngoài máy.

| Việc | Lệnh / chỗ tra | Lỗi cần tránh |
| --- | --- | --- |
| Đồng bộ | `git fetch origin`, `git status --short --branch`, xem diff trước pull/merge | Giữ việc A; không force push; checkpoint/merge dùng `[skip ci]` |
| Bàn giao | `docs/HANDOFF.md`, `docs/NEXT.md`, A-queue/A-done | C không chờ A; tự nhắc không là quyền mới |
| Program offline | `bash scripts/check-receiptrail.sh` | Thiếu cache thì dừng nhánh, không chạy installer/deploy wrapper |
| Client | `bash scripts/check-receiptrail-client.sh`; `node scripts/generate-receiptrail-client.mjs --check` | Không sửa generated tay hoặc đổi IDL cho khớp report |
| Web | Tại `apps/web`: `npm test`, `npm run build` | Node tests không thay DOM hoặc ví thật |
| Local | Tại `apps/web`: `npm run dev -- --port 4175 --strictPort` | Tái dùng server có sẵn; headless chỉ localhost/mock bằng cache |
| Tài liệu | `git diff --check`, kiểm link/file và manifest hashes | Không gán CI cũ cho code mới |

**Cache đã kiểm:** Rust 1.100.0; Agave 4.1.2; Anchor 1.2.2; platform-tools v1.57; Node 24.22.2; React 19.3.1; Vite 8.3.8; @solana/client 1.7.0; react-hooks 1.4.1; Wallet Standard features 1.5.0. Không dùng `latest`/`npx` để sửa lỗi resolve.

**Invoice:** 131 bytes; namespace `invoice-v1`, merchant và invoiceID 32 bytes. Open → Paid/Cancelled; terminal không reset/close. Expired = Open và slot ≥ expiry. Paid khác finalized. Merchant ký Create/Cancel, payer ký Pay. `has_one` so pubkey; `Signer` kiểm quyền ký. Amount dùng bigint/u64, tách principal/rent/fee.

**Unknown:** giữ PDA/terms/signature nếu có; recheck chỉ đọc. Không ký/gửi lại vì timeout 60 giây; block height khác slot. Đổi wallet/account/chain/session thì bỏ xác nhận. SignAndSend có thể timeout trước khi nhận signature; không bịa txid.

**Đã xong P4-B:** 162 tx finalized, debit 0.760701080 SOL dưới trần 1.8 SOL; không chạy lại deploy/smoke/recovery. Program devnet `8NGSPufBmGB1oHqaZpY1jhJYz1X4gqFiNXCQmxfapYko`. Private keys ngoài Git, không đưa vào browser.

**Cổng hiện hành:** hỏi gộp public mock / Phase 6 thật / merge PR #7 sau T37 review và plan cụ thể. Chưa cài thêm, tạo signer, upgrade hoặc đổi authority. Giữ automation 15 phút ACTIVE đến khi người dùng bảo dừng.

[026 — RPC](026-receiptrail-rpc-confirmation.md) · [028 — security](028-receiptrail-security-review.md) · [PHASE6-PLAN](../PHASE6-PLAN.md).
