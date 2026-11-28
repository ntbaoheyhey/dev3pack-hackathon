# IDEA — ReceiptRail

Codex · 18/11/2026 · **người dùng đã duyệt Phase2: “duyệt phase 2”**, giờ log09:27:18.464 ngày18/11/2026 UTC+7; không có giờ quyết định tự nêu. Người dùng chọn **“ReceiptRail chính, ClusterProof phụ” lúc00:07 ngày18/11/2026 UTC+7**; [DECISION](ideas/DECISION.md) ghi nguyên văn, giờ và đính chính nguồn cũ. [ClusterProof](IDEA-clusterproof-draft.md) giữ làm **dự phòng, chưa duyệt**.

## Một câu dễ hiểu

ReceiptRail giúp người trả và người bán nhìn chung trạng thái một hóa đơn SOL: sau timeout có thể đọc lại, và cùng hóa đơn không chuyển tiền gốc lần thứ hai dù gửi một giao dịch mới.

## Người dùng và vấn đề

Builder checkout/API có nhiều client hoặc relayer cần đối soát cùng một invoice. Sau khi bấm trả mà mất phản hồi, họ chưa biết nên chờ hay gửi lại. Chữ ký transaction chỉ nhận dạng một lần gửi; một transaction mới không tự biết đơn hàng trước đã trả.

Hai nguồn độc lập trong [C01](ideas/codex/01-receipt-rail.md) hỗ trợ workflow retry: [x402 issue452](https://github.com/x402-foundation/x402/issues/452) là case EVM, [Shopify Engineering2019](https://shopify.engineering/building-resilient-graphql-apis-using-idempotency) là nguồn lịch sử tập trung. **Chưa có phỏng vấn/pilot xác nhận builder cần rail on-chain này.** T11 giao A kiểm tiếp bằng chứng và phản bác nhu cầu.

## Vì sao dùng Solana; khi nào dùng DB là đủ

Merchant tạo invoice PDA chứa điều khoản bất biến; program chuyển SOL và ghi Paid trong cùng transaction. Các client biết địa chỉ invoice có thể đọc chung state, kể cả mất cache response. Đây là việc cần chain trong thiết kế này; không thêm token/NFT để trang trí.

Nếu mọi bên đã tin cùng một merchant backend, DB với unique operation key có thể rẻ và đơn giản hơn. ReceiptRail đổi lại bằng rent cho mỗi invoice, phí transaction, confirmation và việc tin program/upgrade authority/RPC. Nó không bảo đảm giao hàng, refund hoặc merchant không tạo ID khác cho cùng đơn hàng.

| Alternative | Đã giải quyết | Phần ReceiptRail cần chứng minh thêm |
| --- | --- | --- |
| [Stripe idempotency](https://docs.stripe.com/api/idempotent_requests) | Retry trong payment service, consistency theo key | State cùng invoice cho client độc lập đọc, đổi lại rent/program dependency |
| [Solana Pay reference](https://solana.com/docs/tools/solana-pay/specification/version1-1) | Mã reference để tìm transaction, request/QR | Reference có thể không unique; thêm Open→Paid với chuyển SOL ở program. Không nói merchant app không thể tự dedup |
| [x402 payment_identifier](https://github.com/x402-foundation/x402/blob/main/specs/extensions/payment_identifier.md) | Fingerprint, dedup/cache và conflict cho cùng ID | Không tuyên bố phát minh retry. MVP ReceiptRail là rail riêng, **chưa x402-compatible** |

Nguồn alternatives được đối chiếu18/11; sự khác biệt là giả thuyết sản phẩm cần user thử, không phải lợi thế thị trường đã đo.

## User stories và phạm vi MVP

| Vai | Muốn làm | Điều kiện nhận |
| --- | --- | --- |
| Merchant | Tạo hóa đơn với người trả, số SOL và hạn | Một ID/PDA, điều khoản không sửa; hiển thị rent/phí trước ký |
| Payer | Kiểm người nhận/số tiền/hạn rồi trả | Đúng ví đã chỉ định, Open và còn hạn; chỉ chuyển đúng principal trong state |
| Payer/client khác | Mất response, mở lại link hóa đơn | Đọc Paid/Open/Cancelled/Expired; chưa rõ từ RPC thì báo chưa xác định, không tự tạo ID mới |
| Merchant | Hủy hóa đơn chưa trả | Chỉ merchant ký; Open→Cancelled kể cả đã hết hạn; Paid không hủy |
| Reviewer | Thử gửi pay lần2 bằng transaction mới | Bị từ chối, tổng principal cho PDA vẫn một amount; phí của lần fail tính riêng |

MVP tương lai sau duyệt: **native SOL trên devnet**, một merchant/payer được chỉ định mỗi invoice, create/pay/cancel/read receipt, UI tĩnh và wallet adapter có sẵn. Không backend giữ signer, không indexer bắt buộc; cần giữ mapping đơn hàng→invoice ổn định ở phía merchant.

Ngoài phạm vi: escrow/refund, chia tiền, SPL/Token-2022/stablecoin, fiat, recurring/batch, x402/MPP adapter, AI agent tự trả, mainnet hoặc lời hứa giao hàng. Không close/reset/reopen invoice; rent account terminal tiếp tục bị giữ để chống tạo lại. Mở rộng các mục này cần thiết kế/review mới.

## Demo 165 giây — storyboard, chưa có video/UI ReceiptRail

| Thời gian | Người xem thấy gì | Bằng chứng dự kiến |
| --- | --- | --- |
| 0–20s | Một hóa đơn, bấm trả rồi mất response; vấn đề là không biết kết quả | Nói rõ devnet/native SOL và cùng invoice, không mọi đơn hàng |
| 20–45s | Merchant tạo; payer kiểm recipient/amount/expiry | Một invoice address, điều khoản bất biến, phí/rent tách riêng |
| 45–80s | Pay lần1; fault injection làm mất response có nhãn; mở lại cùng link | Đọc Paid từ PDA, trạng thái commitment rõ |
| 80–110s | Gửi pay lần2 với blockhash/transaction mới | InvoiceNotOpen; principal delta đúng một amount, không giấu fee fail |
| 110–140s | Sai payer hoặc pay/cancel race | Test log thật; nếu dùng replay phải ghi replay, không giả live |
| 140–165s | Giới hạn, source, test và cách dùng | Rent/upgrade/no delivery/no stablecoin; không nói audit hoặc production-ready |

Tổng **165 giây**. Hiện có spike local và log thật; wallet/browser/recovery mạng chưa làm. Bản quay sau duyệt cần đo thời lượng và gắn nhãn fault injection/local/devnet đúng thực tế.

## Acceptance và cổng duyệt

- Phần khó local: create→pay→giao dịch mới retry fail→read; principal/balance/state là oracle. [Spike](evidence/phase2/receiptrail-spike-r1.txt) có **19 runtime tests pass**, gồm rollback, expiry, authority, account substitution, lifecycle và hai thứ tự pay/cancel.
- Có thiết kế đầy đủ ở [ARCHITECTURE](ARCHITECTURE.md), note học trước code [023](learning/023-receiptrail-phase2-spike.md), hàng đợi crawl/UX/review cho A.
- Giữ điểm r1=75/F3 trong lịch sử; chấm r2 dựa spike trong C01. Chưa đủ integration/recovery/user validation để F5 hoặc DELIVERY.
- Cổng người dùng: duyệt phạm vi IDEA và bản giải thích kiến trúc. Review chéo/giáo viên ghi riêng khi có kết quả; chưa đánh đạt thay họ.
- **Dừng sau khi trình Phase2; chỉ qua Phase3 sau duyệt.** Mọi cài thêm, tạo ví/keypair triển khai, deploy/public mới cần câu đồng ý trước. Toolchain/web ClusterProof cũ giữ nguyên; PR#7 không merge.
