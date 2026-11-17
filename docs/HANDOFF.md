# Thẻ nhớ — Codex / Prompt 03
- Trạng thái **đang làm**, Phase **1/E**; goal active, không token budget; 17/11/2026 Asia/Ho_Chi_Minh.
- Trưởng nhóm; Antigravity là trợ lý qua A-queue/A-done; không sửa A-done, không chờ A.
- Mục tiêu: ≥3 ý tưởng ĐẠT có evidence → SHORTLIST/PR → người dùng chọn → Phase 1–2; Phase 3 có điều kiện.
- Repo `/Users/bao/Documents/ChatGPT/dev3pack`, branch `work`, origin `ntbaoheyhey/dev3pack-hackathon`.
- HEAD đã push **1aa322a**: r1/SHORTLIST/note022 đặt chỗ; đã pull/rebase kết quả A tới 89f62b5; main đã đồng bộ.
- Automation `dev3pack-nh-c-tr-ng-nh-m-m-i-15-ph-t` ACTIVE mỗi 15 phút đúng chat; đã view, chưa quan sát heartbeat.
- RUBRIC v1.2: weights 20/15/10/20/15/15/5, floors 3/3/2/3/3/3/2, tổng ≥75, không gate fail/pending trọng yếu.
- F≤3 khi chưa spike; R/D4 PLAN là thiết kế; không U thành điểm đạt; tối đa r0 rồi r1–r3, không reset ID.
- C02/C03/C01 r1 **79/77/75**, ĐẠT PLAN theo C; chưa giáo viên/người dùng duyệt. Review-C A01/A02/A03: 42/40/37, không shortlist.
- Evidence: 16 test đạt, C02 live 747 ms, C03 fee-only live 283 ms; không settlement/custom program/Phase 3.
- Note 021/mục lục/catalog đã cập nhật; T7 bỏ vì C đã tìm mint; T6 V2 đã đọc, còn diễn giải cần sửa.
- Sở hữu C: RUBRIC, ideas/codex, cross-scores, SHORTLIST, IDEA, ARCHITECTURE, A-queue.
- PR #7 đã mở/chưa merge. Người dùng đã chọn C02 chính/C03 dự phòng và cho phép cài toolchain Phase3; DECISION đã ghi, note022 đã viết.
- Cấm mainnet/secrets/force push/merge PR/sửa checkout A hoặc Taskbar Hero. Học trước, cập nhật note/DEVLOG/Thẻ nhớ sau bước lớn.

## Còn lại

- [x] Hoàn thiện C01–C03 đủ RUBRIC mục 4, chấm r1 có evidence; F C01=3, N C03=3; kiểm công thức/sàn/links.
- [ ] Khi ≥3 đạt PLAN: viết lại SHORTLIST (ghi vì sao thay bản A), mở/cập nhật PR work → main, không merge; hỏi đúng hai câu chọn chính/dự phòng và quyền cài toolchain.
- [ ] Trong lúc chờ: account/PDA, test harness/CI và kế hoạch cài trên giấy; dùng T4/T5 khi có, chuẩn bị độc lập ngay.
- [ ] Sau quyết định: DECISION → IDEA (người dùng duyệt), ARCHITECTURE/giải thích một trang và cổng review. Phase 3 chỉ khi được phép.
- [ ] Cuối thật: NEXT/ROADMAP/DEVLOG/HANDOFF/PR; chỉ complete khi cổng Phase 2 và Phase 3 nếu có đã đạt.

## Evidence và giới hạn hiện hành

- [Catalog](evidence/phase1/README.md), [note 021](learning/021-payment-cluster-evidence.md): 16 tests ở spikes-tests-r1-final.txt; không cần rerun khi code không đổi.
- C02: cluster-1794924487174.json, slot 523293811, ProgramData 711053 bytes; 5 manifest mutations. OBSERVED_ONLY/ABI UNKNOWN/source NOT_RUN; payload hash có padding.
- C03: netpay-1794925658391.json; mint HxDYFvcXnLuy4VdxXCooUXrch8DZW34oUteQ6N2EFxEr, slot 523298709, epoch 1211; target 10000→gross 10102 / fee 102 / net 10000. Raw bytes, 5 script hashes khớp; writesToChain0. Chưa account permission/balance/settlement.
- Discovery không đối số còn bị 403, không retry; khi có lý do mới dùng explicit mint. Snapshot positive đầu có lỗi report ghi đè mint đã sửa; giữ nguyên artifact lịch sử và replay regression.
- Ryntra đã có fee/net/hook/policy/receipt, Solana Foundation Pay đã có x402/MPP/retry/debugger. Nguồn và SHA ở note 021. Không tuyên bố novelty từ feature chưa tìm thấy.
- T6 V2 đã nhận: URL đúng, còn nhầm compute fee với transfer fee và suy luận Shopify. Queue đã ghi sửa; dùng nguồn C tự kiểm. T4 đã đọc (89f62b5) nhưng không dùng chấm: thiếu URL, nhầm transfer fee/CU, khuyên mainnet ngoài scope; queue đã trả lại. T5 đã nhắc làm ngay, không chờ chọn ý tưởng.
- A01 giữ vấn đề để nghiên cứu sau, không shortlist; A02/A03 bỏ vòng chọn. Phép tính lịch sử đã sửa ở cross-scores.

## Bị chặn

Người dùng đã trả lời: C02 chính/C03 dự phòng, đồng ý cài toolchain Phase3. Tiếp tục IDEA/ARCHITECTURE + setup; chỉ hỏi thêm nếu có blocker thật hoặc tới cổng duyệt tài liệu hoàn chỉnh. Không cài hoặc tạo ví trước quyền; chưa tuyên bố phase xong. Lịch sử checkpoint ở [archive](archive/HANDOFF-history-codex.md).
