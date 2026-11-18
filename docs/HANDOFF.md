# Thẻ nhớ — Codex / P3-B sau CLI deploy, chờ kiểm chứng
- Trạng thái **đang làm**: CLI hello r4 exit 0; P3-B chưa xong vì chưa kiểm finalized sau deploy hoặc chạy smoke. Chưa mở Phase 4.
- Lượt bàn giao này chỉ lưu trạng thái; không chạy thêm RPC/giao dịch. Các bước thực thi dưới đây dành cho lượt tiếp tục.
- C trưởng nhóm tại `/Users/bao/Documents/ChatGPT/dev3pack`, branch `work`; không sửa checkout/file do A sở hữu.
- ReceiptRail chính/ClusterProof phụ; Phase 2 đã duyệt. Nguyên văn/giờ và quyền P3-A/P3-B ở DECISION; không phục hồi quyết định ClusterProof sai.
- **T31/T32/T33 đã đóng** sau lượt cuối A `7857e9b`; nhận phần đạt, D01–D03 ở DOCUMENTATION-DEBT. Không mở thêm vòng sửa/task bổ sung.
- Nền Git `6e26051`; fetch lúc bàn giao không có commit mới. Phần đóng A và evidence mới được lưu cùng checkpoint tài liệu này.
- P3-B chỉ hello `2yzx…RiXL`, signers thử cũ, một buffer `qSWz…9s6D`; trần **1.500.000.000 lamports**, gồm deploy và initialize/increment.
- Paced r2 đã xong 102/102 writes, tất cả finalized; buffer đủ 133/133 chunks, payload khớp binary. Session6853 đã terminal.
- Trước deploy cuối: payer1.849.872.400lamports, debit650.127.600 = buffer649.452.600 + phí675.000; **chưa là chi phí P3-B cuối**.
- CLI r4 chạy22:14:19–22:14:21 ngày18/11/2026 UTC+7, exit0; signature ở evidence hello-devnet-deploy-r4-2026-11-18.json. Session66421 đã terminal.
- **Không chạy lại upload/deploy thành công, không tạo lại buffer.** Trước gửi tiếp: đối soát chain, hai pending journals và ngân sách.
- Bước tiếp theo: đọc helper `/tmp/dev3pack-verify-hello-deploy.mjs`, kiểm finalized/ProgramData/authority/bytecode; chỉ sau đạt mới smoke `--send` một lần.
- Sau smoke dùng helper finalize để đối soát signatures/meta.err/fees và counter1. Không suy đã quan sát account0 nếu chỉ có before null/after1.
- CI `27cf7ac` đạt3jobs/57tests mỗi run; HEAD tài liệu không là revision CI. Web/lab cũ HTTP200 lúc22:09:50; ví thật chưa kiểm.
- Không deploy ReceiptRail/cài thêm/public hoặc update web/merge PR7/mainnet/force-push/close buffer/đổi authority/tăng trần.
- Automation15phút **PAUSED** theo lần đọc app21:59; giữ cấu hình, không tạo trùng hoặc tuyên bố ACTIVE. Task không được đánh xong.
- Chốt P3-B rồi cập nhật notes/cổng/ROADMAP/PHASE3-PLAN/PR7, push `[skip ci]`, trình người dùng duyệt Phase4; không mở Phase4 trước duyệt.

## Trạng thái đã lưu

[Paced r2](evidence/phase3/hello-buffer-paced-upload-r2-2026-11-18.json) có status `FINALIZED_BUFFER_VERIFIED`, kết thúc22:13:25 UTC+7. Lượt này ghi102chunks còn thiếu, phí510.000lamports; cộng165.000lamports từ các lượt CLI trước thành675.000lamports. R2/r3 CLI Max retries và lần simulation SignatureFailure vẫn giữ lịch sử riêng; không kết luận lỗi mạng/rate-limit khi chưa có chứng cứ. Lỗi simulation do wipe input chung với signer đã sửa bằng copy và kiểm chữ ký offline; không broadcast hoặc phát sinh phí ở lần lỗi đó.

[CLI r4](evidence/phase3/hello-devnet-deploy-r4-2026-11-18.json) có status `CLI_SUCCESS_PENDING_CHAIN_VERIFICATION`, exit0. Deploy signature: `4bsAQ4JYw52KTv1EjcWZ4mJJNzr4KRTqnznDQEP5d95SBNcADMRrersNNADscEpFJgVNqP6vZNxbc28qV7UgHUDq`. [Precheck r4](evidence/phase3/hello-devnet-recheck-r4-2026-11-18.json) đủ133/133chunks,0writes còn thiếu; dự toán bảo thủ1.311352401SOL, **không là chi phí thực sau deploy**. Chưa kiểm finalized/meta.err/ProgramData/authority/bytecode sau r4; chưa initialize/increment.

A nộp `7857e9b` lúc22:10:31 UTC+7, sau queue `7137ec0`; đã fast-forward đến `6e26051`. C đã nhận phần đạt, lưu [snapshot cuối](evidence/phase2/receiptrail-final-pass-2026-11-18.json), [queue lịch sử](archive/A-queue-final-pass-2026-11-18.md), ghi [D01–D03](DOCUMENTATION-DEBT.md) và [đóng queue](tasks/A-queue.md). Nợ tài liệu không là task sửa hoặc blocker P3-B; không sửa ba report/A-done/HANDOFF A, không mở review mới. Chưa có verdict giáo viên/audit độc lập.

## Còn lại — khi tiếp tục

1. Đọc AGENTS/ROADMAP/learning và trạng thái queue đã đóng; inspect Git, fetch/đồng bộ giữ cả hai phía. Không khởi động lại sessions6853/66421/37765/51317: tất cả đã terminal. Đọc hai helper trong `/tmp` trước dùng; chúng đã có nhưng **chưa chạy**, cần kiểm lại nếu file thay đổi/mất.
2. Chạy read-only `/tmp/dev3pack-verify-hello-deploy.mjs`: r4 finalized/meta/log, genesis, executable/loader, ProgramData PDA/authority/payload hash, payer và ngân sách smoke. Dự kiến ghi `hello-devnet-deploy-finalized-2026-11-18.json`. Nếu buffer/counter không khớp giả định thì đối soát, không tự close/redeploy.
3. Kiểm `docs/evidence/phase3/devnet-lab-pending.json` và `hello-buffer-upload-pending.json`. Chỉ sau bước2 đạt, chạy `node tools/devnet-lab/smoke.mjs --send` đúng một lần. Client dùng confirmed và journal; lỗi/timeout phải đối soát, không ký/gửi lại mù quáng.
4. Chạy `/tmp/dev3pack-finalize-hello-evidence.mjs docs/evidence/phase3/devnet-smoke-<timestamp>.json`: đối chiếu toàn bộ signatures từ r3/paced/deploy/smoke, fees từ metadata, payer debit với tiền giữ trong program/ProgramData/counter, count1/authority/hash. Theo dõi đúng live handle nếu chạy lâu. Không ghi đã quan sát count0 giữa hai instructions khi smoke chỉ ghi before null/after1.
5. Chốt evidence/chi phí thực ≤1.5SOL; cập nhật notes003/022/mục lục/DEVLOG, HANDOFF/NEXT/PHASE3-PLAN/ROADMAP/bảng cổng/audit/catalog liên quan. Một số hồ sơ vẫn giữ funding/review cũ. Helper `/tmp/dev3pack-check-docs.py` có tiêu chí vòng review cũ: kiểm có phạm vi, không sửa snapshot lịch sử để làm pass. Push sau bước lớn bằng `[skip ci]`.
6. Cập nhật/read-back PR7: body/head/work→main/open/chưa merge. Body hiện chưa cập nhật funding, lượt cuối A hoặc r4. Trình người dùng kết quả P3-B với signatures/Explorer/chi phí/giới hạn để duyệt Phase4. Chưa triển khai Phase4 hoặc đánh toàn goal complete khi cổng còn thiếu bằng chứng.

## Địa chỉ và giới hạn

- RPC `https://api.devnet.solana.com`; genesis `EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG`.
- Payer/upgrade authority `GQRoDMoWFV2nhgwm3bZGvSCC1LSa2wRkLeeJg8NhbFM2`; program `2yzxUQEpaeLmgCMhDipwnVL3DHsxez18KcePonqZRiXL`; buffer `qSWzcDdMP7m2GhyE2tgaZ5FnHzAtgvMjZwGkQok9s6D`; counter `WPFLETxvxk2hq48C7YzC1VJVVZcEhzqF2tur6vBDvnB`.
- Baseline2.500.000.000lamports. Binary `target/deploy/phase3_hello.so`,127672bytes, SHA256 `9b5483f7335a294b125ba458bcbcbdc9e222b605a2c67d7fabc76c132a23da54`. Không thay binary macOS bằng Linux; chưa reproducible/verified source build.
- Signers/raw logs ngoài Git tại `/Users/bao/.local/share/dev3pack/devnet/`, directory0700/files0600. Giữ nguyên `payer-keypair.json`, `phase3-hello-keypair.json`, `hello-buffer-2026-11-18-keypair.json`; không in/commit contents hoặc seed.
- CLI `/Users/bao/.local/share/solana/install/active_release/bin/solana`. Không rerun `/tmp/dev3pack-resume-hello.mjs` hoặc `/tmp/dev3pack-paced-hello-upload.mjs` sau thành công. Source upload lịch sử đã lưu trong evidence, bản đầu có bug.
- [Quyền](ideas/DECISION.md), [P3-A/P3-B](evidence/phase3/user-permission-2026-11-18.json), [tin funding/lượt cuối](evidence/phase3/user-funded-final-review-2026-11-18.json), [plan](PHASE3-PLAN.md). Tin funding chưa xác định giờ quyết định/log; `recorded_at_utc` chỉ là giờ C ghi hồ sơ.
- [CI recheck](evidence/phase3/ci-rechecked-2026-11-18.json): sáu jobs của hai run27cf7ac success. [HTTP](evidence/phase3/existing-web-http-2026-11-18.json): web cũ và lab200; không là browser/wallet test. Không chạy lại suite/CI cho checkpoint tài liệu.
