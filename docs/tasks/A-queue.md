# Hàng đợi việc của Antigravity (A)

**Chủ file: Codex. Chỉ nhận việc từ file này.** A sở hữu các report của mình, A-done và HANDOFF A; C không sửa thay các file đó. Chỉ làm tài liệu Phase2 ReceiptRail. Quyết định **“ReceiptRail chính, ClusterProof phụ” lúc00:07 ngày18/11/2026 UTC+7** ở [DECISION](../ideas/DECISION.md); thiết kế chưa duyệt. Không cài/code/tạo ví-keypair triển khai/build web/deploy/public hoặc mở Phase3.

**Làm ngay T21 → T22 → T23.** Ba task T18/T19/T20 đã được C review, chưa nhận đạt toàn bộ. T19 đã đạt riêng9/9 mã–tên lỗi; giữ phần đúng. Nguồn kết luận: [review mới](../reviews/receiptrail-codex.md#review-t18t20--18112026-heartbeat0542-utc7), [audit snapshot](../evidence/phase2/receiptrail-reviews-t18-t20-audit.json). Queue cũ và yêu cầu chi tiết giữ ở [archive](../archive/A-queue-before-T21.md), không lặp việc cũ theo nhãn mới/xong ở đó.

## T21 — sửa review kiến trúc bằng assertion và log thật

**Trạng thái: mới, làm ngay.** Đầu ra: sửa [review A](../reviews/receiptrail-antigravity.md), phản hồi từng T13-R1–R4 và T18-R1–R3. Không sửa source để làm report đúng.

Đọc [IDEA](../IDEA.md), [ARCHITECTURE mục3–8](../ARCHITECTURE.md), [source](../../programs/receiptrail/src/lib.rs), [runtime tests](../../programs/receiptrail/tests/runtime.rs), [IDL](../idl/receiptrail.json), [log r2](../evidence/phase2/receiptrail-spike-r2.txt), [note023](../learning/023-receiptrail-phase2-spike.md). Source/tests/IDL từ8f84cfe chưa đổi; test_duplicate không tồn tại. Log nằm trong file evidence, không nằm trong runtime.rs.

1. Thay các tham chiếu giả/chung bằng đường dẫn đầy đủ + hàm/field + assertion đã đọc + dòng kết quả tương ứng trong log r2. Đọc log không ghi đã rerun test.
2. Bảng ba ca bắt buộc dùng đúng tên hàm: `insufficient_principal_cpi_leaves_invoice_open_and_balances_unchanged`; `two_pay_instructions_in_one_transaction_roll_back_the_first_transfer`; `create_pay_and_fresh_transaction_retry_transfers_principal_only_once`. Ghi state/principal trước-sau và ranh giới transaction. Hai pay trong cùng tx khác retry bằng tx mới; signer sai/expiry là ca khác. Snapshot không gồm fee payer riêng.
3. Ma trận đủ5nhóm: layout/seeds/canonical bump; signer/has_one/recipient/alias/owner/type/version; expiry boundary/cancel sau expiry/terminal init; duplicate/race/rollback; receipt/commitment/RPC/upgrade/rent/ID khác. Mỗi hàng có vị trí/assertion/log nếu có, kết luận trong phạm vi và phần chưa kiểm. Signer xác minh chữ ký, has_one đối chiếu field; không gộp hai cơ chế.
4. `Harness::send` gọi expire_blockhash trước mỗi submission; không durable nonce. Race chỉ hai thứ tự serial trong VM. Thu hẹp verdict về phạm vi đã đọc, không tự suy đủ điều kiện triển khai, cổng Phase2 hoặc coverage mạng.

**Nhận khi:** mọi tên hàm dẫn tồn tại; ba ca đúng; ma trận có bằng chứng và giới hạn; từng finding được trả lời bằng mục cụ thể. Không chỉ thêm “Đạt”. Sau khi nộp tiếp tục T22, không chờ C cấp lại.

## T22 — hoàn thiện UX ngoài phần mã–tên đã đạt

**Trạng thái: mới, sau T21.** Đầu ra: sửa [UX A](../design/receiptrail-ux-antigravity.md), phản hồi từng T16-R1–R5 ở review T19. Đầu vào [ARCHITECTURE mục4–6](../ARCHITECTURE.md), [IDEA/demo165s](../IDEA.md), notes[005](../learning/005-solana-frontend.md)/[013](../learning/013-hackathon-demo-video.md)/[014](../learning/014-sponsor-sdks.md).

1. Giữ9/9 code–name đã khớp; sửa copy/CTA theo ARCHITECTURE mục5, nhất là6001/6004/6005/6008. Namespace program ID+code; nhóm Anchor/System/fee/wallet/RPC riêng. Không tự tạo invoice mới sau timeout/expiry hoặc ký khi chưa hỗ trợ version. Có thể chạy lại [lệnh đọc/so IDL](../archive/A-queue-before-T21.md#t19--sửa-ux-và-kiểm-bảng-lỗi-trước-khi-đánh-dấu-đạt) nếu sửa bảng, kèm output thật; không gọi đây là runtime test.
2. Form có merchant/payer, invoiceID32 ổn định (ghi mapping từ OrderID), amount SOL và lamports/u64, expiry slot; xem lại terms bất biến. Merchant trả rent create; tách principal và phí khi pay. Native SOL, không token/mint selector.
3. Viết **8 bố cục bằng text/Markdown:4màn × desktop/mobile** (merchant, invoice, pending/check status, receipt). Có bảng Invoice Open/Paid/Cancelled; Expired suy từ Open+slot; request Pending/Unknown riêng. Ghi CTA, nguồn Invoice PDA/program/cluster và commitment; xem không ví, Unknown không tự ký/gửi tx mới.
4. Storyboard chia thời gian cộng **165giây**, có mất response giả lập có nhãn, đọc cùng PDA, duplicate bằng tx/signature mới bị InvoiceNotOpen, principal một amount và phí fail riêng. Chỉ dự kiến/replay local, chưa khai ví/RPC/devnet thật.
5. Mục chọn/bỏ SDK có nguồn cụ thể và giới hạn; checklist mỗi R1–R5 trỏ nội dung thực có, thiếu thì chưa đạt. Sửa nhãn T17 cũ trong report. Không chỉ tick ô hoặc liệt kê tên màn hình.

**Nhận khi:** đủ nội dung trên;9/9 mã đúng không tự đóng UX. Sau khi nộp tiếp tục T23.

## T23 — hoàn thiện evidence theo đúng nguồn và đúng mã finding

**Trạng thái: mới, sau T22.** Đầu ra: sửa [evidence A](../data/receiptrail-evidence.md). Đọc [review T20](../reviews/receiptrail-codex.md#t20-nguồn-đã-có-diễn-giảiphản-hồi-chưa-đạt), [note021](../learning/021-payment-cluster-evidence.md). Giữ5 URL đúng, sửa diễn giải; không đổi điểm/IDEA/ARCHITECTURE.

- Bảng alternatives ≥3hàng: URL/ngày A thực sự mở; cơ chế nguồn hỗ trợ; giới hạn kỹ thuật; tác động tới ReceiptRail. Không dùng “không phải Solana Foundation Pay” thay giới hạn reference. Phân biệt Stripe API v1/v2; x402 đã có idempotency/fingerprint/cache, chưa test implementation.
- Bảng2pain sources: tác giả, ngày bài/ngày A đọc, vấn đề thực kể, phạm vi và giới hạn. Shopify nói unknown charge/risks retry, không phải báo cáo trùng đơn cụ thể; issue452 nói EIP/ERC-3009/nonce đã dùng, không chứng minh double-payment Solana hiện hành. Hai URL không chứng minh adoption/custom rail. A tự mở nguồn; nếu chỉ đọc review C thì ghi đúng, không khai crawl mới.
- Viết bảng state/PDA/authority/commitment thật: Invoice Open/Paid/Cancelled; Expired=Open+slot; merchant cancel; Pending/Unknown request; đọc cùng PDA/program/cluster/commitment và signature nếu có. Không tự ký/gửi hoặc tạo ID mới.
- Phản hồi **đúng mã gốc**: T14-R1=state/PDA; R2=claim idempotency; R3=pain; R4=alternatives. Thêm T20-R1–R3; mỗi dòng trỏ mục/hàng/nguồn đã sửa. Thiếu evidence ghi chưa đạt.

**Nhận khi:** claim kiểm được theo nguồn và đúng phạm vi, đủ bảng và phản hồi; không chỉ xác nhận đã sửa. Report C đã mở5nguồn không thay A tự kiểm hoặc lời duyệt người dùng.

## Ghi kết quả và giới hạn

A ghi task/commit/đã kiểm/chưa kiểm vào [A-done](A-done.md), cập nhật HANDOFF của A; không đổi file C/audit lịch sử. Nộp report không tự là C nhận đạt. C tiếp tục review khi có bản mới; không đợi A để trình bản Phase2 đã soạn. Người dùng/giáo viên chưa duyệt; không mở code/triển khai mới. T8–T10 ClusterProof đã bỏ, giữ web/source/lab cũ; không khôi phục việc đó.
