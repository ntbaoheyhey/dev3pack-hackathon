# NEXT — ReceiptRail sau duyệt Phase 2

18/11/2026 · Người dùng đã nói **“duyệt phase 2”**, giờ log 09:27:18.464 UTC+7; không có giờ quyết định tự nêu. [DECISION](ideas/DECISION.md) giữ lời duyệt và phạm vi quyền. Không hỏi chọn ý tưởng hoặc duyệt Phase 2 lại.

Phần chuẩn bị trong quyền hiện có đã có [runner offline](../scripts/check-phase3-offline.sh), 25 runtime tests, 8 client tests, đối chiếu IDL/bytecode và [audit Prompt03](reviews/prompt03-audit.md). Kết quả local không đóng cổng CI/devnet/review. Bước phụ thuộc tiếp theo cần người dùng chọn phạm vi tại [PHASE3-PLAN](PHASE3-PLAN.md):

1. **P3-A — CI:** chỉ sau câu đồng ý cài bộ pins/dependencies trên runner GitHub mới mở ba job guards. Người dùng xử lý billing/limit nếu vẫn chặn; C không tự đổi hạn mức. Kiểm đúng HEAD và tất cả steps thực chạy; skipped/blocked không là CI xanh.
2. **P3-B — hello devnet:** chỉ sau câu đồng ý dùng signers thử cũ, tạo một buffer keypair tạm và deploy/test hello trong trần 1.5 SOL devnet. Cần funding vì lần kiểm 09:47:33 UTC+7 payer có 0 lamports. Recheck balance/rent/flags trước thi hành; không deploy ReceiptRail core hoặc public web mới.
3. **Antigravity:** T28 UX → T29 sửa evidence/review, theo [A-queue](tasks/A-queue.md). C đã nhận phần sửa đúng của T26/T27 và ghi sáu findings; chưa nhận review chéo đạt. Khi A nộp, fetch và review tài liệu trong quyền hiện có; không cần chờ quyền vận hành để đọc report.
4. **Giáo viên:** [SHORTLIST](ideas/SHORTLIST.md) và [bảng cổng](reviews/phase1-3-gates.md) sẵn sàng chấm. Chưa có verdict, không suy từ lời duyệt thiết kế của người dùng. Phase 4–6 chưa mở.

Khi có câu trả lời, ghi nguyên văn, giờ log/múi giờ và đúng phạm vi vào DECISION **trước** thao tác tương ứng; câu trả lời một mục không cấp quyền mục khác. Nếu chưa có trả lời, chỉ tiếp tục review/đồng bộ được phép, không cài/sign/deploy/public. Giữ source/web/lab/toolchain ClusterProof và nhãn dự phòng, chưa duyệt. Không merge [PR #7](https://github.com/ntbaoheyhey/dev3pack-hackathon/pull/7), force-push hoặc mainnet; mọi commit **và merge** dùng `[skip ci]` đến khi quyền CI được ghi và guard được review.
