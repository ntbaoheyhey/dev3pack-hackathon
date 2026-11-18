# Thẻ nhớ — Codex / P3-B hello và đóng vòng review
- Trạng thái **đang làm**: đã tiếp tục P3-B; retry r2 hết lượt ghi dữ liệu, đang đối soát/resume cùng buffer. Chưa mở Phase 4.
- C trưởng nhóm tại `/Users/bao/Documents/ChatGPT/dev3pack`, branch `work`; A qua A-queue, không sửa file/checkout A.
- ReceiptRail chính/ClusterProof phụ; Phase 2 đã duyệt. Nguyên văn/giờ và quyền P3-A/P3-B ở DECISION; không phục hồi quyết định ClusterProof sai.
- Tin mới: đúng một lượt cuối gộp T31/T32/T33, nhận phần đạt/ghi nợ tài liệu/đóng; không mở vòng sửa. Record user-funded-final-review-2026-11-18.json.
- Queue cuối đã push qua `7137ec0`; `bbecb24`/`e376f9e` có trước queue, không tự tính là lượt nộp cuối. Chưa nhận/đóng ba task.
- Preflight 21:51:38 ngày 18/11/2026 UTC+7: payer GQRo…NhbFM2 có 2.5 SOL, đúng genesis devnet, hello chưa deploy. Không còn blocker funding cũ.
- P3-B chỉ hello 2yzx…RiXL, signers thử cũ, **một buffer đã tạo** ngoài Git; trần 1.5 SOL cho deploy + initialize/increment.
- Buffer **qSWzcDdMP7m2GhyE2tgaZ5FnHzAtgvMjZwGkQok9s6D** phải tái dùng; không chạy lại đoạn tạo keypair hoặc tạo buffer thứ hai.
- Preflight binary/signers/modes đạt; dự toán bảo thủ 1.3147424 SOL là estimate, chưa phải chi phí thực. Evidence hello-devnet-preflight-2026-11-18.json.
- Lần deploy 21:52:21 UTC+7 exit 1 do đặt `--fee-payer` ở root; không có signature trong evidence. Chưa đối soát chain sau lỗi.
- R2 22:01:10 UTC+7 lỗi Max retries; finalized22:01:37: buffer đã funded649452600lamports/14trong133chunks, payer1850467400; program chưa deploy. Không tạo/allocate buffer lại.
- R3 bắt đầu22:03:15 UTC+7, process39714/session95982; precheck14/133chunks/totalbudget1.312542401SOL. Poll handle/evidence trước mọi retry, không khởi động trùng. Giữ flags/checks/trần.
- Sau gửi: kiểm finalized, loader/ProgramData/authority/bytecode, initialize 0 → increment 1 và tổng chi phí; timeout đối soát, không ký lại mù quáng.
- CI `27cf7ac` đạt 3 jobs/57 tests mỗi run; HEAD tài liệu không là revision CI, không chạy lại khi executable inputs không đổi.
- Web/lab/toolchain ClusterProof giữ nguyên; ví thật chưa kiểm. Không deploy ReceiptRail/public/cài thêm/merge PR7/mainnet/force-push/close buffer/đổi authority.
- Automation 15 phút hiện **PAUSED** theo config app đọc lại21:59, khác hồ sơ cũ; giữ nguyên cấu hình. Checkpoint/merge dùng `[skip ci]`; không tạo bản trùng.
- Khi chốt P3-B và lượt cuối A: đồng bộ notes/cổng/ROADMAP/PR7, push, trình Phase 4. Không lấy review tài liệu làm blocker triển khai.

## Trạng thái thực thi đã bàn giao

- [Preflight](evidence/phase3/hello-devnet-preflight-2026-11-18.json): genesis `EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG`, baseline payer **2,500,000,000 lamports**, binary macOS `target/deploy/phase3_hello.so` **127,672 bytes**, SHA256 `9b5483f7335a294b125ba458bcbcbdc9e222b605a2c67d7fabc76c132a23da54`. Không thay bằng binary Linux.
- [Lần deploy đầu](evidence/phase3/hello-devnet-deploy-2026-11-18.json) exit 1 sau khoảng 30 ms: `Found argument '--fee-payer' which wasn't expected, or isn't valid in this context`. Parser từ chối trước thực thi; chưa có bằng chứng giao dịch được gửi, nhưng phải đọc lại chain trước retry. Help local xác nhận `--fee-payer` là option của `program deploy`.
- Payer/upgrade authority `GQRoDMoWFV2nhgwm3bZGvSCC1LSa2wRkLeeJg8NhbFM2`; program `2yzxUQEpaeLmgCMhDipwnVL3DHsxez18KcePonqZRiXL`; counter PDA `WPFLETxvxk2hq48C7YzC1VJVVZcEhzqF2tur6vBDvnB`.
- Signers ở `/Users/bao/.local/share/dev3pack/devnet/`: `payer-keypair.json`, `phase3-hello-keypair.json`, **`hello-buffer-2026-11-18-keypair.json`**. Không in nội dung/seed hoặc commit. Raw logs lần đầu cùng thư mục, tên `hello-deploy-2026-11-18.stdout.log`/`.stderr.log`; public evidence đã lọc.
- CLI `/Users/bao/.local/share/solana/install/active_release/bin/solana`; giữ RPC `https://api.devnet.solana.com`, commitment `finalized`, `--max-len 127672`, `--with-compute-unit-price 0`, `--max-sign-attempts 1`, `--use-rpc`, fee payer/authority/program signer cũ. Không bỏ preflight/feature/fee checks.
- Không còn process/session deploy từ lượt trước. Chưa chạy retry, initialize/increment hoặc kiểm finalized mới. Client `tools/devnet-lab/smoke.mjs --send` dùng confirmed và pending journal `docs/evidence/phase3/devnet-lab-pending.json`; cần đối soát journal và xác minh finalized riêng.

## Còn lại — khi tiếp tục

1. Đọc AGENTS/ROADMAP/learning/queue, fetch và kiểm Git mới. Đọc lại genesis/balance/program/buffer/journal, kiểm ngân sách còn lại; **tái dùng buffer hiện có**. Sửa vị trí flag, retry deploy với evidence/log **r2 riêng**. Không ghi đè failure/preflight hoặc tự ký lại khi trạng thái chưa rõ.
2. Xác minh deploy finalized, executable/loader/ProgramData/authority/bytecode; initialize 0 rồi increment 1. Kiểm `meta.err`, logs, authority/count, signatures và chi phí từ baseline 2.5 SOL; toàn P3-B không quá 1.5 SOL.
3. Nhận đúng một lượt cuối của A theo [queue](tasks/A-queue.md): tìm dòng `LƯỢT CUỐI T31/T32/T33 — đã nộp` và commit sau queue `7137ec0`. `bbecb24` chưa được C review đầy đủ và có trước queue mới. Nhận phần đạt, phần thiếu đưa vào **nợ tài liệu**, đóng cả ba task; không tạo vòng/task sửa nữa, không chờ A để làm P3-B.
4. Chốt evidence, notes003/022 và mục lục, DEVLOG, HANDOFF/NEXT/ROADMAP/bảng cổng/PHASE3-PLAN, mô tả PR7. Một số hồ sơ/cổng vẫn giữ review/funding cũ; đối chiếu chỉ đạo mới, không phục hồi vòng sửa. Push `[skip ci]`, read-back PR và kiểm Git đồng bộ; báo người dùng duyệt Phase 4, không merge.

## Bằng chứng và giới hạn

[DECISION](ideas/DECISION.md), [quyền P3-A/P3-B](evidence/phase3/user-permission-2026-11-18.json), [tin funding/một lượt cuối](evidence/phase3/user-funded-final-review-2026-11-18.json), [PHASE3-PLAN](PHASE3-PLAN.md), [CI27cf7ac](evidence/phase3/ci-passed-27cf7ac.json). Tin funding mới chưa xác định giờ quyết định/giờ log; `recorded_at_utc` chỉ là giờ C ghi hồ sơ.

PR7 chưa merge theo lần kiểm trước; body/snapshot [17:42:30](evidence/phase3/pr7-review-1732-snapshot.json) chưa cập nhật funding/lượt cuối/P3-B. Snapshots cũ giữ nguyên lịch sử. `/tmp/dev3pack-check-docs.py` còn tiêu chí vòng review cũ: cập nhật phạm vi kiểm hoặc dùng kiểm tài liệu có phạm vi, không sửa snapshot để làm pass.

Funding đã có; không còn blocker thiếu SOL ở lần kiểm cuối. Ví extension thật chưa kiểm; CI/CLI funding không thay kiểm connect/disconnect. Phase 4 và triển khai ReceiptRail/public/cài mới chưa được duyệt. Lượt bàn giao không thay automation hoặc mở rộng quyền.
