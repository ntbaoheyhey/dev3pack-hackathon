# Phase 5 — bản local để kiểm và cổng tiếp theo

**Bản code local đã hợp nhất tại266b30c**, thêm tiêu đề/metadata riêng cho route ReceiptRail khi chuẩn bị artifact. Logic ví/giao dịch đã kiểm:45tests và7ca tái hiện lỗi đều đạt; TypeScript/Vite build đạt. T34/T35/T36 đã đóng, không yêu cầu A nộp lại. [Review r3](reviews/receiptrail-phase5-r3.md), [artifact/hashes](evidence/phase5/local-artifact-2026-11-19.json).

## Bản cụ thể có thể xem

- Mở thủ công [ReceiptRail local](http://127.0.0.1:4175/receiptrail/) trên máy đang chạy repo. Server Vite có sẵn được kiểm qua PID/cwd và HTTP200; C không mở hoặc điều khiển browser.
- Source ởapps/web trên work. Bản build nằm tạiapps/web/dist; ZIP local tại sandbox/artifacts/receiptrail-phase5-local-2026-11-19.zip, hash và18source inputs trong manifest. ZIP chỉ gồm dist+README; đây là bản xem local, chưa phải gói deploy Sites.
- Nếu server cũ đã tắt, dùng cache đã có: từapps/web chạy npm run dev -- --port 4175 --strictPort, rồi tự mở đường dẫn trên. Không cần cài thêm.
- Toàn bộ ReceiptRail ởroute này là **mock**; không ký/gửi transaction hoặc chuyển SOL. Public ClusterProof hiện có không bị cập nhật.

## Những bước cần kiểm bằng browser

Đây là kế hoạch kiểm, **chưa được thực hiện sau bản sửa**. Node tests/HTTP200 không thay bằng chứng thao tác React/DOM hoặc layout.

| Ca | Thao tác thủ công với ví mock | Kết quả cần thấy |
| --- | --- | --- |
| Khách xem | Mở route, xem chi tiết/danh sách, copy địa chỉ | Đọc không cần ví; thấy đủ terms/PDA/ID và nhãn mock; không có quyền Pay/Cancel |
| Create | Kết nối Tiệm Cà phê; chọn mẫu Cà phê; xem rồi xác nhận terms, tạo | Preview đúng amount/expiry/ID/PDA; tạo xong chọn đúng hóa đơn mới |
| Sửa sau xác nhận | Tick Create rồi sửa amount/preset/slot; thử submit | Tick mất hiệu lực; phải xem/xác nhận lại |
| Pay và ví | Kết nối Alice; tick terms; đổi ví/ngắt ví rồi kết nối lại | Tick mất hiệu lực. Xác nhận lại, Pay một lần→Paid; nút trả lần nữa bị khóa |
| Unknown đã xử lý | TạoIDkhác; chọn “đã xử lý, mất phản hồi”; Alice Pay | Unknown giữ cùngPDA/mã mock; recheck đọc Paid, không chuyển thêm |
| Unknown bị drop | TạoIDkhác; chọn “request bị drop”; Alice Pay rồi recheck | VẫnOpen hoặcExpired theo slot; không tự trả hoặc đổiID |
| Cancel/rollback | Merchant hủyOpen kể cả expired; ca riêng chọnCPI rollback khiPay | Cancelled giữrent; rollback giữprincipal/Open nhưng phí mock bị trừ, thông báo rõ |
| Mobile/bàn phím | Viewport375×812; tab focus/copy/đọc table | Trang không cắt nội dung; table cuộn trong vùng riêng; đầy đủ địa chỉ/terms, focus nhìn thấy |

Sườn demo165giây:35s vấn đề/nhãn mock,30s Create,35s Pay/receipt,35s Unknown/recheck,30s lỗi/giới hạn. Đây là kịch bản, chưa có video hoặc số đo chạy thực tế165s. Các ca đầy đủ ở bảng có thể kiểm riêng ngoài video.

## Cổng còn cần người dùng

Người dùng đã nói **“dừng điều khiển mình nhé, đã ổn rồi mà”**; vì vậy C chỉCLI/repo. Bước kế tiếp là **người dùng tự kiểm bản local**, hoặc chỉ khi người dùng cho phép rõ mới kiểm browserlocalhost. Không tự bật CUA/headless hoặc lấy lời “tiếp tục” làm mở quyền này.

Sau khi có kết quả browser/demo và C review, mới trình phương án public cụ thể. Định hướng dự kiến là một Site ReceiptRail riêng trên Sites, không cập nhật SiteClusterProof đangpublic; source snapshot và audience phải được trình tại cổng đó. **Hiện chưa đăng ký/upload/sync source/deploy/public Site nào**, chưa có URLReceiptRailpublic. Không dùng quyềnP4-B cho website.

Phase6 tích hợp devnet thật là quyết định riêng sauPhase5: cần plan về ví/transaction/RPC/recovery và trần thử mạng trước khi làm. Chưa mởPhase6, cài thêm, deploy/upgrade program, tạo thêm signer hoặc mergePR7. Ví extension thật và verdict giáo viên vẫn chưa có.
