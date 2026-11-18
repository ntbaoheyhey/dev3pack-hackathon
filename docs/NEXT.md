# NEXT — sau khi người dùng duyệt Phase 2 ReceiptRail

18/11/2026 · **đang làm**. Người dùng đã nói **“duyệt phase 2”**; giờ log09:27:18.464 UTC+7, không có giờ quyết định tự nêu. [DECISION](ideas/DECISION.md) là hồ sơ quyền hiện hành. Không hỏi chọn ý tưởng hoặc duyệt lại.

1. **Codex:** đồng bộ PR7/Thẻ nhớ và push lời duyệt; review evidenceT26, giữT27/T28. Hoàn thiện audit mục tiêu Prompt03 và hồ sơ cổng giáo viên.
2. **Codex, chuẩn bị Phase3:** đọc workflow/scripts/cache hiện có, thiết kế pipeline build→test→devnet→web, chuẩn bị thay đổi CI và phiếu quyền cụ thể. Chỉ đọc/local bằng cache trong quyền đã có; local pass không thay CI/deploy.
3. **Antigravity:** T27 review source/assertion/log vàT28 UX, theo [A-queue](tasks/A-queue.md); C không đợi A để làm phần chuẩn bị. A không sửa file C hoặc mở UI/deploy.
4. **Cần người dùng sau khi phương án cụ thể:** quyền cho mỗi cài thêm, tạo ví/keypair triển khai, deploy hoặc public mới; tài khoản/funding hoặc ví devnet riêng nếu phương án cần. Người dùng duyệt Phase2 không tự chấp thuận các thao tác này.
5. **Cổng ROADMAP còn mở:** review chéo được nhận, giáo viên chấm; Phase3 phải có program ID + tx thật trên devnet, web và ví được kiểm trong phạm vi, CI xanh. Chỉ chuyển sang Phase4–6 khi đạt cổng tương ứng.

Giữ ClusterProof dự phòng/chưa duyệt và toolchain/web/lab cũ. Không merge [PR7](https://github.com/ntbaoheyhey/dev3pack-hackathon/pull/7), không mainnet hoặc secrets trong Git. [Bảng cổng](reviews/phase1-3-gates.md) và [HANDOFF](HANDOFF.md) được cập nhật sau bước lớn; file này không tuyên bố Phase3 đã hoàn tất.
