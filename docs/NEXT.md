# NEXT — trình duyệt Phase 4 ReceiptRail

**P3-A/P3-B đã có bằng chứng trong phạm vi được phép.** [Báo cáo hello devnet](evidence/phase3/README.md) ghi deploy/initialize/increment finalized, counter1, bytecode/authority và toàn bộ chi phí dưới trần1.5SOL. T31/T32/T33 đã đóng; D01–D03 là [nợ tài liệu](DOCUMENTATION-DEBT.md), không hàng đợi sửa.

## Cần người dùng

Duyệt mở Phase4 ReceiptRail theo [ARCHITECTURE mục9](ARCHITECTURE.md#9-phân-công-và-cổng-phase-tiếp-theo), trước tiên trong phạm vi code/test cục bộ bằng toolchain/cache hiện có. Đây là cổng mới theo tin yêu cầu kết thúc P3-B rồi trình Phase4; chưa có câu duyệt Phase4. Không hỏi duyệt lại Phase2 hoặc P3-A/P3-B.

Ví extension connect/disconnect vẫn chưa kiểm theo lựa chọn người dùng; làm khi họ có ví devnet sẵn sàng. CLI smoke không thay kiểm ví thật. Giáo viên chưa có verdict SHORTLIST/kiến trúc; không tự ghi đạt. Không yêu cầu A sửa/nộp lại T31/T32/T33.

## Phạm vi dự kiến sau duyệt, chưa thực thi

- C hoàn thiện/harden program ReceiptRail native SOL từ spike đã có: create/pay/cancel/read, invariants quyền/recipient/expiry/replay/lifecycle; giữ phạm vi IDEA/ARCHITECTURE đã duyệt.
- C bổ sung/chạy test có ý nghĩa cho phần thay đổi, đo CU/resources, sinh và đối chiếu IDL/client contract; dùng cache hiện có. CI chỉ trong ba jobs/pins/locks đã cho phép; thiếu dependency/phạm vi cài mới thì trình phương án cụ thể.
- A hiện không có việc mới. Sau khi Phase4 được mở, chỉ giao công việc mới đúng phạm vi được duyệt; không biến D01–D03 thành vòng sửa các task đã đóng.
- Trước deploy ReceiptRail: chuẩn bị binary/identity/authority, simulation, ngân sách và kế hoạch rollback/kiểm chứng để người dùng duyệt riêng. Quyền hello1.5SOL không chuyển sang ReceiptRail. Cài thêm, tạo signer triển khai, public/update web vẫn cần câu đồng ý đúng phạm vi.

Giữ ClusterProof dự phòng/chưa duyệt và web/lab/toolchain hiện có. Không mở Phase4–6, gửi thêm hello, deploy ReceiptRail, public web, mainnet, force-push hoặc merge PR7 trước đúng quyền. Automation15phút hiện PAUSED theo cấu hình đã đọc; không tuyên bố đang chạy hoặc tạo bản trùng.
