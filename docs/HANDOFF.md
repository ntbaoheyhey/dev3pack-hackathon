# Thẻ nhớ — Codex / P3-B đã kiểm, chốt hồ sơ trình Phase4
- Trạng thái **đang làm**: P3-B đã đạt, còn kiểm/push tài liệu và cập nhật/read-back PR7 rồi trình người dùng duyệt Phase4.
- C trưởng nhóm tại `/Users/bao/Documents/ChatGPT/dev3pack`, branch`work`; A trợ lý, queue trống, không sửa file/checkout A.
- ReceiptRail chính/ClusterProof phụ; Phase2 đã duyệt; P3-A/P3-B có quyền riêng. Nguyên văn/giờ ở DECISION, không phục hồi quyết định sai cũ.
- **T31/T32/T33 đã đóng** sau đúng lượt cuối7857e9b; nhận phần đạt, D01–D03 là nợ tài liệu, không mở vòng/task sửa.
- P3-B137/137tx finalized, meta.err=null; deploy/initialize/increment đúng hello, counter1, bytecode/authority khớp.
- Tổng debit **0.651874801SOL** = accounts0.651179801 + fees0.000695000; payer còn1.848125199, dưới trần1.5SOL.
- Record cuối: hello-devnet-final-verification-r2-2026-11-18.json; báo cáo docs/evidence/phase3/README.md. Finalizer session6752 đã exit0; không còn process P3-B chạy.
- Không gửi lại upload/deploy/smoke, không tạo lại buffer hoặc close riêng. Buffer loader đã tiêu thụ; hai pending journals không còn.
- Không nói đã capture account0: before null/after1; initialize có transaction/log, increment và account cuối finalized1.
- CI27cf7ac hai runs đạt3jobs/57tests/run; executable inputs không đổi. Checkpoint tài liệu không phải CI mới, dùng `[skip ci]`.
- Web/lab ClusterProof cũHTTP200; ví thật chưa kiểm theo lựa chọn người dùng. Hash Linux khác macOS, chưa verified/reproducible source build.
- Chưa verdict giáo viên; không tự đánh toàn goal/Phase3 xong từ P3-B. Người dùng yêu cầu trình duyệt trước mở Phase4.
- Không cài thêm/deploy ReceiptRail/public hoặc update web/merge PR7/mainnet/force-push/đổi authority/tăng trần.
- Automation15phút **PAUSED**, đã đọc app/config trong lượt này; giữ cấu hình, không tạo trùng hoặc tuyên bố ACTIVE.
- Bước tiếp theo: kiểm tài liệu/JSON/sources, push checkpoint; cập nhật/read-back PR7 đúng work→main/open/unmerged; trình Phase4 theo NEXT.

## Còn lại

1. Kiểm hồ sơ sau đối soát, push bằng `[skip ci]`; không chạy lại suite/CI hoặc ký thêm giao dịch cho thay đổi tài liệu.
2. Cập nhật mô tả PR7 bằng kết quả P3-B/chi phí/lượt cuối A/giới hạn, đọc lại body/head/base/open/chưa merge và lưu snapshot.
3. Trình người dùng duyệt Phase4 theo [NEXT](NEXT.md), rồi chỉ làm khi có câu duyệt đúng phạm vi. Các mục ví thật/giáo viên giữ thiếu bằng chứng; không tự tạo quyền hoặc mở vòng review A.

## Bằng chứng và quyền

- [Kết quả P3-B](evidence/phase3/README.md), [final137tx](evidence/phase3/hello-devnet-final-verification-r2-2026-11-18.json), [smoke](evidence/phase3/devnet-smoke-1795015356860.json).
- [Quyền/đính chính](ideas/DECISION.md), [phương án](PHASE3-PLAN.md), [nợ tài liệu](DOCUMENTATION-DEBT.md), [queue đã đóng](tasks/A-queue.md).
- Program `2yzxUQEpaeLmgCMhDipwnVL3DHsxez18KcePonqZRiXL`; payer/authority `GQRoDMoWFV2nhgwm3bZGvSCC1LSa2wRkLeeJg8NhbFM2`; counter `WPFLETxvxk2hq48C7YzC1VJVVZcEhzqF2tur6vBDvnB`; ProgramData `BJQzgSHrumuS7K9QFqpCTanzqm2whAEje51hwLavFJ32`.
- RPC devnet/genesis/binary hashes, signatures và hạch toán ở báo cáo. Signers/raw logs ngoài Git tại `/Users/bao/.local/share/dev3pack/devnet/`, directory0700/files0600; không print/commit contents.
- [CI](evidence/phase3/ci-rechecked-2026-11-18.json), [HTTP](evidence/phase3/existing-web-http-2026-11-18.json). [Bàn giao trước khi chốt](archive/HANDOFF-before-p3b-final-2026-11-18.md) là lịch sử, không rerun helpers có assert counter null hoặc smoke send.
