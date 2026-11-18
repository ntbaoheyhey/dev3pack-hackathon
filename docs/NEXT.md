# NEXT — kiểm chứng P3-B sau CLI deploy

18/11/2026 · ReceiptRail chính, ClusterProof phụ; Phase2 đã duyệt. Quyền P3-A/P3-B **“Đồng ý cả hai”**, giờ log10:13:11.851 UTC+7, ở [DECISION](ideas/DECISION.md)/[record](evidence/phase3/user-permission-2026-11-18.json). [Tin funding/lượt cuối](evidence/phase3/user-funded-final-review-2026-11-18.json) thay blocker funding và vòng sửa cũ; giờ quyết định/log tin này chưa xác định.

Lượt hiện tại chỉ chốt bàn giao. Khi tiếp tục, đọc [Thẻ nhớ](HANDOFF.md) trước thực thi:

1. **CLI hello r4 đã exit0; không deploy/upload lại.** [Evidence r4](evidence/phase3/hello-devnet-deploy-r4-2026-11-18.json) chưa có kiểm finalized sau deploy. Đọc rồi chạy helper read-only `/tmp/dev3pack-verify-hello-deploy.mjs`, kiểm signature/meta.err/ProgramData/authority/bytecode và ngân sách. Không tạo thêm buffer hoặc close buffer.
2. Sau kiểm đạt, đối soát hai pending journals rồi chạy smoke `--send` một lần; đối soát finalized và chi phí bằng helper finalize nêu trong HANDOFF. Timeout phải kiểm trạng thái thay vì ký lại. Trần toàn P3-B **1.5SOL**; debit650.127.600lamports trước r4 chưa là chi phí cuối.
3. **T31/T32/T33 đã đóng** sau đúng lượt cuối A `7857e9b`; phần thiếu là [nợ tài liệu D01–D03](DOCUMENTATION-DEBT.md). Không mở vòng sửa hoặc task bổ sung, không chờ A.
4. Chốt notes/evidence/cổng/ROADMAP/PHASE3-PLAN và mô tả PR7, push `[skip ci]`, read-back PR open/chưa merge. Trình người dùng duyệt Phase4 sau kết quả P3-B; chưa mở Phase4.

P3-A đạt tại `27cf7ac`: hai runs,3jobs/57tests mỗi run+build/IDL; HEAD tài liệu không tự là revision CI. Web/lab cũ HTTP200, ví thật chưa kiểm; chưa có verdict giáo viên hoặc reproducible build. Automation15phút **PAUSED** theo lần đọc app21:59; giữ cấu hình. Giữ web/toolchain/thiết kế ClusterProof dự phòng chưa duyệt; không cài thêm, deploy ReceiptRail, public/update web, mainnet, force-push hoặc merge PR7.
