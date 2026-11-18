# Hàng đợi việc của Antigravity (A)

**Chủ file: Codex. Chỉ nhận việc từ file này.** A sở hữu các report của mình, A-done và HANDOFF A; C không sửa thay các file đó. Chỉ làm tài liệu Phase2 ReceiptRail. Quyết định **“ReceiptRail chính, ClusterProof phụ” lúc00:07 ngày18/11/2026 UTC+7** ở [DECISION](../ideas/DECISION.md); thiết kế chưa duyệt. Không cài/code/tạo ví-keypair triển khai/build web/deploy/public hoặc mở Phase3.

**Tiếp tục T23 → T24 → T25.** A đã nộpT22 và ghi đang làmT23 tại3d7ca13; giữ evidence rồi review kiến trúc trước. T22 giữ9/9 mã–tên đúng, đã rõ lamports/slot/merchant cancel nhưng CTA/state/wireframe/demo/SDK còn thiếu; sửa quaT25. T21 đã sửa đúng3tên test nhưng còn authority/assertions/giới hạn. Nguồn kết luận: [review T22](../reviews/receiptrail-codex.md#review-t22--18112026-heartbeat0658-utc7), [review T21](../reviews/receiptrail-codex.md#review-t21--18112026-heartbeat0613-utc7), [review T18–T20](../reviews/receiptrail-codex.md#review-t18t20--18112026-heartbeat0542-utc7). Queue cũ giữ ở [archive](../archive/A-queue-before-T21.md); các task đã nộp bên dưới là lịch sử review, không làm lại trước việc đang mở.

## T21 — đã nộp; phần tên test đạt, phần còn thiếu chuyển T24

**Trạng thái: đã review6921d5a, chưa nhận toàn bộ; tiếp tục qua T24 sau T22/T23.** Đầu ra: sửa [review A](../reviews/receiptrail-antigravity.md), phản hồi từng T13-R1–R4 và T18-R1–R3. Không sửa source để làm report đúng.

Đọc [IDEA](../IDEA.md), [ARCHITECTURE mục3–8](../ARCHITECTURE.md), [source](../../programs/receiptrail/src/lib.rs), [runtime tests](../../programs/receiptrail/tests/runtime.rs), [IDL](../idl/receiptrail.json), [log r2](../evidence/phase2/receiptrail-spike-r2.txt), [note023](../learning/023-receiptrail-phase2-spike.md). Source/tests/IDL từ8f84cfe chưa đổi; test_duplicate không tồn tại. Log nằm trong file evidence, không nằm trong runtime.rs.

1. Thay các tham chiếu giả/chung bằng đường dẫn đầy đủ + hàm/field + assertion đã đọc + dòng kết quả tương ứng trong log r2. Đọc log không ghi đã rerun test.
2. Bảng ba ca bắt buộc dùng đúng tên hàm: `insufficient_principal_cpi_leaves_invoice_open_and_balances_unchanged`; `two_pay_instructions_in_one_transaction_roll_back_the_first_transfer`; `create_pay_and_fresh_transaction_retry_transfers_principal_only_once`. Ghi state/principal trước-sau và ranh giới transaction. Hai pay trong cùng tx khác retry bằng tx mới; signer sai/expiry là ca khác. Snapshot không gồm fee payer riêng.
3. Ma trận đủ5nhóm: layout/seeds/canonical bump; signer/has_one/recipient/alias/owner/type/version; expiry boundary/cancel sau expiry/terminal init; duplicate/race/rollback; receipt/commitment/RPC/upgrade/rent/ID khác. Mỗi hàng có vị trí/assertion/log nếu có, kết luận trong phạm vi và phần chưa kiểm. Signer xác minh chữ ký, has_one đối chiếu field; không gộp hai cơ chế.
4. `Harness::send` gọi expire_blockhash trước mỗi submission; không durable nonce. Race chỉ hai thứ tự serial trong VM. Thu hẹp verdict về phạm vi đã đọc, không tự suy đủ điều kiện triển khai, cổng Phase2 hoặc coverage mạng.

**Tiêu chí nhận giữ làm tham chiếu cho T24:** mọi tên hàm dẫn tồn tại; ba ca đúng; ma trận có bằng chứng và giới hạn; từng finding được trả lời bằng mục cụ thể. Không chỉ thêm “Đạt”. T21/T22 đã nộp; theo thứ tự đang mởT23→T24→T25 ở đầu file.

## T22 — đã nộp; nhận phần cải thiện, phần còn thiếu chuyển T25

**Trạng thái: đã reviewe2ef270, chưa nhận toàn bộ.** [Review T22](../reviews/receiptrail-codex.md#review-t22--18112026-heartbeat0658-utc7) giữ snapshot/hash/đối chiếu9/9, nhận lamports/slot/merchant cancel/PDA-program và nhãnT22. Năm findings T22-R1–R5 còn mở, không coi5checkbox là đã có wireframes/storyboard/SDK. A đang làmT23; tiếp tụcT24 rồi sửa UX quaT25, không chờ C cấp lại.

## T23 — hoàn thiện evidence theo đúng nguồn và đúng mã finding

**Trạng thái: đang làm theo HANDOFF A/3d7ca13.** Đầu ra: sửa [evidence A](../data/receiptrail-evidence.md). Đọc [review T20](../reviews/receiptrail-codex.md#t20-nguồn-đã-có-diễn-giảiphản-hồi-chưa-đạt), [note021](../learning/021-payment-cluster-evidence.md). Giữ5 URL đúng, sửa diễn giải; không đổi điểm/IDEA/ARCHITECTURE. Nộp xong tiếp tụcT24.

- Bảng alternatives ≥3hàng: URL/ngày A thực sự mở; cơ chế nguồn hỗ trợ; giới hạn kỹ thuật; tác động tới ReceiptRail. Không dùng “không phải Solana Foundation Pay” thay giới hạn reference. Phân biệt Stripe API v1/v2; x402 đã có idempotency/fingerprint/cache, chưa test implementation.
- Bảng2pain sources: tác giả, ngày bài/ngày A đọc, vấn đề thực kể, phạm vi và giới hạn. Shopify nói unknown charge/risks retry, không phải báo cáo trùng đơn cụ thể; issue452 nói EIP/ERC-3009/nonce đã dùng, không chứng minh double-payment Solana hiện hành. Hai URL không chứng minh adoption/custom rail. A tự mở nguồn; nếu chỉ đọc review C thì ghi đúng, không khai crawl mới.
- Viết bảng state/PDA/authority/commitment thật: Invoice Open/Paid/Cancelled; Expired=Open+slot; merchant cancel; Pending/Unknown request; đọc cùng PDA/program/cluster/commitment và signature nếu có. Không tự ký/gửi hoặc tạo ID mới.
- Phản hồi **đúng mã gốc**: T14-R1=state/PDA; R2=claim idempotency; R3=pain; R4=alternatives. Thêm T20-R1–R3; mỗi dòng trỏ mục/hàng/nguồn đã sửa. Thiếu evidence ghi chưa đạt.

**Nhận khi:** claim kiểm được theo nguồn và đúng phạm vi, đủ bảng và phản hồi; không chỉ xác nhận đã sửa. Report C đã mở5nguồn không thay A tự kiểm hoặc lời duyệt người dùng.

## T24 — bổ sung authority, assertion và giới hạn còn thiếu của T21

**Trạng thái: mới, sau T23.** Sửa [review A](../reviews/receiptrail-antigravity.md) theo T21-R1–R3 ở [review C](../reviews/receiptrail-codex.md#review-t21--18112026-heartbeat0613-utc7). Giữ3tên test đúng; không chỉ đổi tiêu đề/tên task. Nộp xong tiếp tụcT25.

1. Viết riêng pay/cancel: account nào phải ký, account nào nhận tiền, Signer và has_one kiểm gì. Đọc struct PayInvoice/CancelInvoice, không viết has_one kiểm chữ ký. Trỏ test missing signature/wrong payer/recipient và assertion cụ thể.
2. Thay danh sách3tên bằng bảng với cột **hàm + dòng; trạng thái/principal trước; sau tx fail; assertion đã đọc; file log + dòng kết quả; điều chưa kiểm**. Dùng đúng3hàm T21 đã dẫn. Đối chiếu Snapshot/reject: không gồm fee payer riêng; `[pay,pay]` và retry tx mới khác ranh giới transaction. Đọc log không khai rerun.
3. Điền5nhóm của T21 bằng vị trí/assertion/kết quả và giới hạn; chưa kiểm một nhóm thì ghi chưa kiểm, không “Đạt” suông. Dẫn expire_blockhash/khác signature, chỉ2thứ tự serial; receipt local/commitment/RPC/upgrade/rent/merchant dùng ID khác. Trả lời T13-R1–R4,T18-R1–R3,T21-R1–R3 bằng vị trí đã sửa; phần chưa đạt ghi rõ.

**Nhận khi:** người đọc kiểm được từng kết luận trên source/log hiện có; chỉ3tên tồn tại không đủ. Không cài/rerun runtime tests/sửa source/IDL/thiết kế C hoặc mở Phase3. C chưa nhận toàn bộ review và người dùng chưa duyệt.

## T25 — sửa UX theo năm findings T22, có nội dung để kiểm

**Trạng thái: mới, sau T23/T24.** Chỉ sửa [UX A](../design/receiptrail-ux-antigravity.md), không code UI. Đọc [review T22](../reviews/receiptrail-codex.md#review-t22--18112026-heartbeat0658-utc7), [ARCHITECTURE mục4–6](../ARCHITECTURE.md), [IDEA/demo165s](../IDEA.md), notes[005](../learning/005-solana-frontend.md)/[013](../learning/013-hackathon-demo-video.md)/[014](../learning/014-sponsor-sdks.md). Giữ9/9 mã–tên đúng và phần cải thiện đã nhận.

Nộp đủ các mục dưới trong file UX; mỗi mục có nội dung, không chỉ câu đã hoàn thiện:

| Mục phải viết | Nội dung và bằng chứng để C nhận |
| --- | --- |
| 1. Form và tiền — T22-R2 | Merchant/recipient, payer, mapping OrderID→32bytes ổn định/lưu/tái dùng, SOL→lamports bằng integer/u64, expiry slot và terms bất biến. Tách create=merchant rent+fee; pay=principal+fee, không thêm rent invoice. Không token selector. |
| 2. State và lỗi — T22-R1/R3 | Hai bảng riêng: Invoice Open/Paid/Cancelled (Expired=Open+slot>=expiry) và request Pending/Unknown, commitment là nhãn riêng.9mã lỗi theo program ID+code;6004 đọc state,6005 không trả/liên hệ merchant,6007 dừng/tải lại,6008 invoice.version không hỗ trợ→không ký. Thêm nhóm Anchor/System/fee/wallet/RPC; timeout không đổi invoiceID hoặc tự ký/gửi tx mới. |
| 3. Wireframes — T22-R3 | **8 bố cục text/Markdown**: merchant, invoice, pending/check status, receipt, mỗi màn desktop và mobile. Mỗi bố cục có fields, vị trí/ưu tiên, CTA enabled/disabled, lỗi/no-wallet, cùng PDA+program+cluster+commitment; receipt không suy signature từ account. Không chỉ liệt kê4tên màn. |
| 4. Storyboard — T22-R4 | Bảng thời gian bắt đầu/kết thúc, hình, hành động, evidence; cộng165giây. Có mất response giả lập, đọc cùng PDA, duplicate tx/signature mới→InvoiceNotOpen, principal1amount và phí fail riêng. Ghi rõ dự kiến/replay local; chưa browser/wallet/RPC/devnet thật. |
| 5. SDK và phản hồi — T22-R5 | Bảng chọn/bỏ, phiên bản/mốc source, URL/ngày thực đọc, lý do cho ReceiptRail và giới hạn tương thích. Đối chiếu React/Vite/Wallet Standard hiện có; không tự chọn package mới thành quyền cài. Không chép version lịch sử note005 thành bằng chứng đã kiểm. Checklist T16-R1–R5 và T22-R1–R5 trỏ mục thực có, thiếu đánh chưa đạt. |

Trước nộp: đọc lại8bố cục, cộng thời lượng, kiểm9mã theo JSON bằng [lệnh đọc/so IDL](../archive/A-queue-before-T21.md#t19--sửa-ux-và-kiểm-bảng-lỗi-trước-khi-đánh-dấu-đạt), lưu output/phạm vi thật. Không gọi kiểm tài liệu là runtime/browser test; không cài hoặc rerun suite. Những mục chưa làm phải ghi chưa đạt, không tick toàn bộ chỉ vì đã sửa một phần. Cổng Phase2 vẫn cần review và người dùng/giáo viên, báo nộp không tự mở Phase3.

## Ghi kết quả và giới hạn

A ghi task/commit/đã kiểm/chưa kiểm vào [A-done](A-done.md), cập nhật HANDOFF của A; không đổi file C/audit lịch sử. Nộp report không tự là C nhận đạt. C tiếp tục review khi có bản mới; không đợi A để trình bản Phase2 đã soạn. Người dùng/giáo viên chưa duyệt; không mở code/triển khai mới. T8–T10 ClusterProof đã bỏ, giữ web/source/lab cũ; không khôi phục việc đó.
