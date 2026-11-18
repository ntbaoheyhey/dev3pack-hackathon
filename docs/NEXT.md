# NEXT — thực hiện P3-A, để P3-B sau funding

18/11/2026 · Người dùng đã duyệt Phase2 và trả lời **“Đồng ý cả hai”** cho P3-A/P3-B, giờ log10:13:11.851 UTC+7. [DECISION](ideas/DECISION.md)/[record](evidence/phase3/user-permission-2026-11-18.json) giữ nguyên văn và phạm vi; không hỏi lại.

1. **Codex — P3-A:** đã push quyền fd78236, mở ba jobs tại51bf866, giữ pins/lockfiles. [Hai runs mới](evidence/phase3/ci-approved-51bf866-blocked.json) đều bị Billing & plans chặn trước mọi step. Khi người dùng xử lý billing/limit mới chạy lại đúng revision; không rerun vô ích hoặc tự đổi chi trả. Local25 runtime/client8 không thay Linux CI.
2. **Codex — P3-B:** đã có quyền hello devnet/signers thử cũ/một buffer tạm/trần1.5SOL. Người dùng nói **“chưa rảnh để chuyển sol devnet”**, log10:14:46.599 UTC+7: deploy sau funding, không thúc chuyển ngay. Recheck trước thi hành theo [PHASE3-PLAN](PHASE3-PLAN.md); không deploy ReceiptRail hoặc public web mới.
3. **Antigravity:** T28 UX → T29 evidence/review theo [A-queue](tasks/A-queue.md). Quyền A vẫn là tài liệu, không mở UI/deploy/CI; C review khi có report mới.
4. **Giáo viên:** [SHORTLIST](ideas/SHORTLIST.md) và [bảng cổng](reviews/phase1-3-gates.md) còn chờ verdict; không suy từ lời duyệt thiết kế/quyền vận hành. Phase4–6 chưa mở.

Giữ toolchain/source/web/lab ClusterProof và nhãn dự phòng, chưa duyệt. Không merge PR7/force-push/mainnet/đổi visibility. Chỉ commit cần chạy CI trong quyền P3-A mới bỏ skip marker; checkpoint tài liệu và merge tiếp tục dùng [skip ci]. [HANDOFF](HANDOFF.md) ghi trạng thái hiện hành.
