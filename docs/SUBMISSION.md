# ReceiptRail — bộ nộp Dev3pack

Hạn đóng form là **14:00 Chủ nhật 29/11/2026 giờ Việt Nam** (07:00 UTC). Có thể nộp tối 28/11. Mục tiêu dự phòng là bấm Submit trước 13:00 ngày 29/11.

## 1. Project

| Trường | Nội dung để điền |
| --- | --- |
| Name | ReceiptRail |
| One-liner | Shared Solana invoices that settle once, even when a payer retries after a lost response. |
| Category | Payments. Nếu form chỉ có Infrastructure thì chọn Infrastructure. |
| Contract address | `8NGSPufBmGB1oHqaZpY1jhJYz1X4gqFiNXCQmxfapYko` |
| Network | Solana devnet |
| Hub | Chọn hub mà bạn thực sự tham gia. |

**Description**

ReceiptRail lets a merchant and a payer verify whether a SOL invoice settled after a checkout loses its network response. The merchant creates an invoice with a designated payer, an amount and an expiry slot. Both parties can open its shareable receipt in a browser, including on a device without a wallet.

The Solana program checks the payer and the invoice state before transferring funds. It records payment in the same transaction as the transfer. If the payer signs a fresh transaction for the same paid invoice, the program returns InvoiceNotOpen. The public demo links directly to a finalized payment of 50,000 lamports and a separate rejected retry. The merchant received zero additional lamports on that retry. The payer paid a network fee of 5,000 lamports.

The demo includes a labeled lost-response scenario, a read-only recovery action, invoice cancellation and independent Explorer links. The open-source repository includes the Anchor program, the IDL-generated client, browser and runtime tests, and a transaction-by-transaction balance reconciliation. This release supports native SOL on devnet. Merchants remain responsible for mapping each business order to one invoice ID.

## 2. Images

Dùng [cover vuông](../demo/images/cover.png) ở trường logo/cover. Với gallery, tải ảnh theo thứ tự dưới đây. Nếu form giới hạn số ảnh, ưu tiên trang live, hóa đơn Paid và lần retry bị từ chối.

1. [Trang live khi chưa kết nối ví](../demo/images/01-live.png)
2. [Người bán tạo hóa đơn](../demo/images/02-create.png)
3. [Giả lập mất phản hồi](../demo/images/03-unknown.png)
4. [Biên nhận Paid và Explorer](../demo/images/04-paid.png)
5. [Retry bị từ chối](../demo/images/05-retry.png)
6. [Cách program chặn lần trả thứ hai](../demo/images/06-architecture.png)

## 3. Links & video

| Trường | Giá trị |
| --- | --- |
| Live demo | [ReceiptRail trên devnet](https://receiptrail-devnet.mistyaura.chatgpt.site/) |
| Repository | [Repo public trên GitHub](https://github.com/ntbaoheyhey/dev3pack-hackathon) |
| Demo video | Upload [MP4](../demo/receiptrail-demo.mp4) rồi điền link YouTube Unlisted/Public hoặc Loom của bạn vào `VIDEO_URL`. |
| Demo invoice | [Hóa đơn đã Paid trên Explorer](https://explorer.solana.com/address/rZRAPpkLcfBcao5tMvdyZ1G7VzoDLcXiHZ7u4tPSZq2?cluster=devnet) |

## 4. Team

Đối chiếu tên, tài khoản và thành viên thực tế của đội trong dashboard. Người duy trì repo là `ntbaoheyhey`.

## 5. Review & submit

Trước khi gửi, mở link video ở cửa sổ riêng tư, kiểm ảnh bìa và đối chiếu 5 ký tự cuối của program ID là `apYko`. Sau khi bấm Submit, lưu ảnh màn hình hoặc mã xác nhận của dashboard.

## Việc người dùng cần làm

1. Upload [video MP4](../demo/receiptrail-demo.mp4) lên YouTube hoặc Loom và sao chép link xem.
2. Đăng nhập [cổng Dev3pack](https://hack.dev3pack.xyz). Dán phần Project, chọn hub, tải ảnh ở mục 2 và dán ba link ở mục 3.
3. Xác nhận thành viên, mở thử link video, bấm **Submit** và lưu xác nhận. Dành khoảng 15 phút thao tác cộng thời gian upload/xử lý video.

## Nếu giám khảo hỏi

**Khi nào dùng database là đủ?** Nếu một bên điều hành cả checkout và giao hàng, unique key cho đơn hàng và transaction trong database thường đủ. ReceiptRail phục vụ trường hợp nhiều bên độc lập cần tự kiểm cùng một giao dịch SOL.

**Điều gì chặn trả hai lần?** Program kiểm payer và trạng thái Open trước khi chuyển SOL. Chuyển tiền và ghi Paid nằm trong cùng transaction. Trong lần quay, retry bằng blockhash khác bị chặn với `InvoiceNotOpen`, số dư người bán tăng thêm 0 và payer trả 5.000 lamports phí. [Giao dịch retry](https://explorer.solana.com/tx/ig5D6PzpyunRL5CjzHX9GqNFwxUvAtNRK8WrvKToSZeMi9824mensd1fmtVyDpnYr6LB47ApJHFAsade91KWARe?cluster=devnet)

**Nếu người bán tạo invoice ID khác cho cùng đơn?** ID mới cho ra địa chỉ khác và có thể được thanh toán riêng. Người bán cần lưu ánh xạ duy nhất từ mã đơn kinh doanh đến invoice ID ban đầu để mọi lần thử dùng cùng địa chỉ.

**Rent và phí khác nhau thế nào?** Mỗi tài khoản hóa đơn giữ 1.315.720 lamports rent trong lần đo. Phí mạng của mỗi giao dịch đã ghi nhận là 5.000 lamports. Bản này chưa có instruction đóng tài khoản để lấy lại rent. [Bảng số dư và phí](evidence/phase6/e2e-devnet-2026-11-28T112558Z.json)

**Ai có thể thay đổi program?** Upgrade authority hiện còn hiệu lực. Bytecode đọc từ devnet khớp bản build tại thời điểm kiểm tra. Chữ ký của người dùng vẫn cần cho các lệnh trả tiền theo bản program hiện tại. [Kết quả kiểm bytecode và authority](evidence/phase6/preflight-2026-11-28.json)
