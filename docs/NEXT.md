# NEXT — Phase 4 ReceiptRail và Phase 5 song song

Người dùng đã duyệt mở hai phase ngày19/11/2026, giờ log13:25:47 UTC+7; [nguyên văn](ideas/DECISION.md). **Đang làm code/test local bằng toolchain/cache hiện có**, không hỏi lại cổng mở phase. Automation15phút đã đọc lại ACTIVE.

## Việc đang làm

- C: program local32/32 và generated client23/23 + TypeScript/bundle đã đạt; [evidence](evidence/phase4/README.md)/[review](reviews/receiptrail-phase4-local.md). Client/contract đã push4148906, bàn giao A; chuẩn bị cổng tiếp theo ở [PHASE4-PLAN](PHASE4-PLAN.md).
- A: T34 ở [A-queue](tasks/A-queue.md), note025 trước code; UI ví/thanh toán responsive/mock có nhãn, Wallet Standard và local browser tests. C đọc A-done và review phần tiền/quyền; không chờ A.
- Giữ T31/T32/T33 đóng và D01–D03 là nợ tài liệu; không mở vòng sửa report cũ.

## Cổng còn cần quyền riêng

Chưa deploy ReceiptRail, public/update web, cài thêm, tạo signer triển khai hay mergePR7. Chuẩn bị binary/identity/authority, simulation, ngân sách và kế hoạch kiểm chứng trước trình deploy; thiếu dependency thì nêu package/version/lý do cụ thể. Quyền hello1.5SOL không chuyển sang ReceiptRail. Commit/merge local dùng `[skip ci]`, không tự chạy CI cài đặt từ lời duyệt local.

[PHASE4-PLAN](PHASE4-PLAN.md) có patch CI chưa áp và đề xuất ReceiptRail devnet cap1.8SOL/four signers ngoài Git. Quote read-only peak1.531889040SOL, payer1.848125199SOL; chưa lời đồng ý/cài/ký/gửi. Public web trình sau T34 có artifact local và C review.

Các cổng ROADMAP vẫn gồm CI/devnet/client dùng được cho Phase4 và UI demo/link công khai cho Phase5; chưa hoàn tất khi chỉ đạt local. Ví extension thật và verdict giáo viên còn riêng; mock/CLI không thay bằng chứng này. Giữ ClusterProof dự phòng/chưa duyệt, source/web/lab/toolchain hiện có; không mở Phase6 tự động.
