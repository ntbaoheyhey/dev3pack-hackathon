# Hàng đợi việc của Antigravity (A)

**Chủ file: Codex. Chỉ nhận việc từ file này.** A sở hữu các report của mình, A-done và HANDOFF A; C không sửa thay các file đó. Chỉ làm tài liệu Phase2 ReceiptRail. Quyết định **“ReceiptRail chính, ClusterProof phụ” lúc00:07 ngày18/11/2026 UTC+7** ở [DECISION](../ideas/DECISION.md); **người dùng đã duyệt Phase2** bằng “duyệt phase 2”, log09:27:18.464 ngày18/11 UTC+7. Quyền A vẫn là tài liệu trong queue; không cài/code/tạo ví-keypair triển khai/build web/deploy/public hoặc tự mở Phase3.

**Làm tiếp T27 → T28.** T26 đã nộp tại62286cc/pull0a8a488; C đang review evidence mới. HANDOFF A đã chuyểnT27 đúng thứ tự; đây là báo cáo trạng thái, không chứng minh process đang chạy. GiữT27 reviewT24 vàT28 UXT25, không cấp lại hoặc bỏ các việc chưa nộp. Người dùng đã duyệt thiết kế, không cần hỏi lại; các tiêu chí review và quyền vận hành vẫn riêng. Queue cũ giữ ở [archive](../archive/A-queue-before-T21.md); task đã nộp bên dưới là lịch sử review.

## T21 — đã nộp; phần tên test đạt, phần còn thiếu chuyển T24

**Trạng thái: đã review6921d5a; T24 đã bổ sung một phần, phần còn thiếu qua T27.** Đầu ra: sửa [review A](../reviews/receiptrail-antigravity.md), phản hồi từng T13-R1–R4 và T18-R1–R3. Không sửa source để làm report đúng.

Đọc [IDEA](../IDEA.md), [ARCHITECTURE mục3–8](../ARCHITECTURE.md), [source](../../programs/receiptrail/src/lib.rs), [runtime tests](../../programs/receiptrail/tests/runtime.rs), [IDL](../idl/receiptrail.json), [log r2](../evidence/phase2/receiptrail-spike-r2.txt), [note023](../learning/023-receiptrail-phase2-spike.md). Source/tests/IDL từ8f84cfe chưa đổi; test_duplicate không tồn tại. Log nằm trong file evidence, không nằm trong runtime.rs.

1. Thay các tham chiếu giả/chung bằng đường dẫn đầy đủ + hàm/field + assertion đã đọc + dòng kết quả tương ứng trong log r2. Đọc log không ghi đã rerun test.
2. Bảng ba ca bắt buộc dùng đúng tên hàm: `insufficient_principal_cpi_leaves_invoice_open_and_balances_unchanged`; `two_pay_instructions_in_one_transaction_roll_back_the_first_transfer`; `create_pay_and_fresh_transaction_retry_transfers_principal_only_once`. Ghi state/principal trước-sau và ranh giới transaction. Hai pay trong cùng tx khác retry bằng tx mới; signer sai/expiry là ca khác. Snapshot không gồm fee payer riêng.
3. Ma trận đủ5nhóm: layout/seeds/canonical bump; signer/has_one/recipient/alias/owner/type/version; expiry boundary/cancel sau expiry/terminal init; duplicate/race/rollback; receipt/commitment/RPC/upgrade/rent/ID khác. Mỗi hàng có vị trí/assertion/log nếu có, kết luận trong phạm vi và phần chưa kiểm. Signer xác minh chữ ký, has_one đối chiếu field; không gộp hai cơ chế.
4. `Harness::send` gọi expire_blockhash trước mỗi submission; không durable nonce. Race chỉ hai thứ tự serial trong VM. Thu hẹp verdict về phạm vi đã đọc, không tự suy đủ điều kiện triển khai, cổng Phase2 hoặc coverage mạng.

**Tiêu chí nhận giữ làm tham chiếu:** mọi tên hàm dẫn tồn tại; ba ca đúng; ma trận có bằng chứng và giới hạn; từng finding được trả lời bằng mục cụ thể. Không chỉ thêm “Đạt”. T21–T25 đã nộp; theo thứ tự đang mởT26→T27→T28 ở đầu file.

## T22 — đã nộp; nhận phần cải thiện, phần còn thiếu chuyển T25

**Trạng thái: đã reviewe2ef270 và bảnv2/bfa184c, chưa nhận toàn bộ.** [Review T22](../reviews/receiptrail-codex.md#review-t22--18112026-heartbeat0658-utc7) giữ hai snapshot/hash/đối chiếu9/9. Bảnv2 thêm4mô tả màn/Explorer có signature, nhưng36dòng đầu chưa đổi và hai tài liệu được dẫn không chọn hai package SDK đó. Năm findings T22-R1–R5 còn mở, tiếp tục quaT25 sauT24; không nộp lạiT22 dưới tên task cũ để coi như đã đóngT25.

## T23 — đã nộp; nhận phần cải thiện, phần còn thiếu chuyển T26

**Trạng thái: đã reviewa82490a vàv2/769d365, chưa nhận toàn bộ.** [Review T23](../reviews/receiptrail-codex.md#review-t23--18112026-heartbeat0758-utc7) lưu hai hash27dòng/5URL; C mở lại cả5đích ở lượt07:58. Nhận metadata/nhãnEVM/nhóm state/PDA và cách nói uniqueness củav2; cònT23-R1–R3, đặc biệt expiry/commitment ởv2. T25 đã nộp, sửa evidence quaT26 ngay; không đổi điểm hoặc thiết kế.

## T24 — bổ sung authority, assertion và giới hạn còn thiếu của T21

**Trạng thái: đã nộp7325169, C nhận phần Signer/has_one/expire_blockhash; chưa nhận toàn bộ.** [Review T24](../reviews/receiptrail-codex.md#review-t24--18112026-heartbeat0830-utc7) giữ hash31dòng và ba findings. Bảng retry chưa lấy Paid làm baseline trước tx lỗi, thiếu recipient/assertion/log/fee/giới hạn; phần còn thiếu quaT27 sauT26. Các yêu cầu T24 bên dưới giữ để truy lịch sử, không làm lại task cũ hoặc bỏ T26.

1. Viết riêng pay/cancel: account nào phải ký, account nào nhận tiền, Signer và has_one kiểm gì. Đọc struct PayInvoice/CancelInvoice, không viết has_one kiểm chữ ký. Trỏ test missing signature/wrong payer/recipient và assertion cụ thể.
2. Thay danh sách3tên bằng bảng với cột **hàm + dòng; trạng thái/principal trước; sau tx fail; assertion đã đọc; file log + dòng kết quả; điều chưa kiểm**. Dùng đúng3hàm T21 đã dẫn. Đối chiếu Snapshot/reject: không gồm fee payer riêng; `[pay,pay]` và retry tx mới khác ranh giới transaction. Đọc log không khai rerun.
3. Điền5nhóm của T21 bằng vị trí/assertion/kết quả và giới hạn; chưa kiểm một nhóm thì ghi chưa kiểm, không “Đạt” suông. Dẫn expire_blockhash/khác signature, chỉ2thứ tự serial; receipt local/commitment/RPC/upgrade/rent/merchant dùng ID khác. Trả lời T13-R1–R4,T18-R1–R3,T21-R1–R3 bằng vị trí đã sửa; phần chưa đạt ghi rõ.

**Nhận khi:** người đọc kiểm được từng kết luận trên source/log hiện có; chỉ3tên tồn tại không đủ. Không cài/rerun runtime tests/sửa source/IDL/thiết kế C hoặc mở Phase3. C chưa nhận toàn bộ review; người dùng đã duyệt Phase2 riêng.

## T25 — sửa UX theo năm findings T22, có nội dung để kiểm

**Trạng thái: đã nộp33b71e7; nhận9mã,8mục màn hình và tổng165giây, chưa nhận toàn bộ.** [Review T25](../reviews/receiptrail-codex.md#review-t25--18112026-heartbeat0900-utc7) còn5findings; sửa quaT28 sauT26/T27. Các tiêu chí dưới giữ làm tham chiếu, không nộp lại T25 để bỏ qua hai việc đang mở. Chỉ sửa [UX A](../design/receiptrail-ux-antigravity.md), không code UI. Đọc [review T22](../reviews/receiptrail-codex.md#review-t22--18112026-heartbeat0658-utc7), [ARCHITECTURE mục4–6](../ARCHITECTURE.md), [IDEA/demo165s](../IDEA.md), notes[005](../learning/005-solana-frontend.md)/[013](../learning/013-hackathon-demo-video.md)/[014](../learning/014-sponsor-sdks.md).

**Áp dụng trên bảnv2/bfa184c:** giữ4mô tả màn và điều kiện Explorer có signature, phát triển thành8bố cục ở mục3 bên dưới. ARCHITECTURE mục6/note014 không quyết định web3.js+wallet-adapter-react; nếu đề xuất hai package này phải có nguồn/phiên bản/lý do/compatibility thật, hoặc ghi chưa quyết định và giới hạn. Không chỉ thêm tên tài liệu vào checklist. Đây là bổ sungT25 hiện có, không tạo lại task UX;T24/T25 vẫn trướcT26.

Nộp đủ các mục dưới trong file UX; mỗi mục có nội dung, không chỉ câu đã hoàn thiện:

| Mục phải viết | Nội dung và bằng chứng để C nhận |
| --- | --- |
| 1. Form và tiền — T22-R2 | Merchant/recipient, payer, mapping OrderID→32bytes ổn định/lưu/tái dùng, SOL→lamports bằng integer/u64, expiry slot và terms bất biến. Tách create=merchant rent+fee; pay=principal+fee, không thêm rent invoice. Không token selector. |
| 2. State và lỗi — T22-R1/R3 | Hai bảng riêng: Invoice Open/Paid/Cancelled (Expired=Open+slot>=expiry) và request Pending/Unknown, commitment là nhãn riêng.9mã lỗi theo program ID+code;6004 đọc state,6005 không trả/liên hệ merchant,6007 dừng/tải lại,6008 invoice.version không hỗ trợ→không ký. Thêm nhóm Anchor/System/fee/wallet/RPC; timeout không đổi invoiceID hoặc tự ký/gửi tx mới. |
| 3. Wireframes — T22-R3 | **8 bố cục text/Markdown**: merchant, invoice, pending/check status, receipt, mỗi màn desktop và mobile. Mỗi bố cục có fields, vị trí/ưu tiên, CTA enabled/disabled, lỗi/no-wallet, cùng PDA+program+cluster+commitment; receipt không suy signature từ account. Không chỉ liệt kê4tên màn. |
| 4. Storyboard — T22-R4 | Bảng thời gian bắt đầu/kết thúc, hình, hành động, evidence; cộng165giây. Có mất response giả lập, đọc cùng PDA, duplicate tx/signature mới→InvoiceNotOpen, principal1amount và phí fail riêng. Ghi rõ dự kiến/replay local; chưa browser/wallet/RPC/devnet thật. |
| 5. SDK và phản hồi — T22-R5 | Bảng chọn/bỏ, phiên bản/mốc source, URL/ngày thực đọc, lý do cho ReceiptRail và giới hạn tương thích. Đối chiếu React/Vite/Wallet Standard hiện có; không tự chọn package mới thành quyền cài. Không chép version lịch sử note005 thành bằng chứng đã kiểm. Checklist T16-R1–R5 và T22-R1–R5 trỏ mục thực có, thiếu đánh chưa đạt. |

Trước nộp: đọc lại8bố cục, cộng thời lượng, kiểm9mã theo JSON bằng [lệnh đọc/so IDL](../archive/A-queue-before-T21.md#t19--sửa-ux-và-kiểm-bảng-lỗi-trước-khi-đánh-dấu-đạt), lưu output/phạm vi thật. Không gọi kiểm tài liệu là runtime/browser test; không cài hoặc rerun suite. Những mục chưa làm phải ghi chưa đạt, không tick toàn bộ chỉ vì đã sửa một phần. Cổng Phase2 vẫn cần review và người dùng/giáo viên, báo nộp không tự mở Phase3.

## T26 — hoàn thiện cơ chế nguồn và phản hồi còn thiếu của T23

**Trạng thái: đã nộp62286cc; C đang review, không làm lại task cũ. Tiếp tụcT27.** Sửa [evidence A](../data/receiptrail-evidence.md) dựa trên [review T23](../reviews/receiptrail-codex.md#review-t23--18112026-heartbeat0758-utc7), [review T20](../reviews/receiptrail-codex.md#t20-nguồn-đã-có-diễn-giảiphản-hồi-chưa-đạt), [note021](../learning/021-payment-cluster-evidence.md), [ARCHITECTURE mục4–6](../ARCHITECTURE.md). Giữ5URL và tác giả/ngày đã đúng; không đổi điểm/contract/fileC.

**Bản đầu vào mới nhất769d365:** giữ cách nói “không đảm bảo tính duy nhất” đã cải thiện. Sửa dòng19: tại đúng expiry đã hết hạn pay; viết bảng3hàng expiry−1/expiry/expiry+1 với state/CTA và nguồn test321/logr2:25 đã đọc, không rerun. Paid là state, confirmed/finalized là nhãn commitment riêng. Đây là bổ sungT26 hiện có.

1. **Bảng3alternatives:** nguồn/ngày A thực đọc, cơ chế cụ thể, giới hạn và tác động. Sửa API key thành idempotency key đúng nghĩa; phân biệt Stripev1/v2. Reference là không bắt buộc unique; x402 đã có cache/fingerprint/409. Nêu điều program/PDA mới cưỡng chế và giới hạn cùng invoice, không suy PDA tự tạo lợi thế sản phẩm. Thiếu nguồn ghi chưa kiểm.
2. **Bảng2pain sources:** tác giả/ngày bài/ngày đọc, vấn đề đúng nguồn, điều nguồn không chứng minh. Shopify là unknown charge/retry risk; issue452 là nonce đã dùng/AuthorizationUsed và phân biệt settlement với lỗi. Không gọi trùng đơn hay Solana double-payment; không suy adoption. Chỉ đọc note C thì ghi đó là phạm vi, không khai crawl mới.
3. **Bảng state và CTA:** Invoice Open/Paid/Cancelled; Expired=Open+observed_slot>=expires_slot, merchant cancel; request Pending/Unknown riêng. Cùng PDA/program/cluster/owner/commitment và signature nếu có; không tự ký/gửi/đổiID. Paid không đồng nghĩa finalized. Trỏ thiết kế hiện hành, không sửa contract.
4. **Bảng phản hồi10dòng:** mỗiT14-R1–R4,T20-R1–R3,T23-R1–R3 một dòng riêng, đúng nghĩa gốc trong review; có mục/hàng đã sửa, evidence và giới hạn còn lại. Không gộpR1/R4 hoặc đổiT20-R1 thànhState/PDA; phần thiếu phải ghi chưa đạt.

**Nhận khi:** đọc nội dung kiểm được từng claim/finding, không chỉ URL/cột/báo xong. A tự cập nhật A-done/HANDOFF theo phạm vi thật; không chạy implementation/runtime suite, cài, code/deploy/public hoặc mởPhase3. C đã mở nguồn không thay lời duyệt người dùng.

## T27 — hoàn thiện bằng chứng review sau T24

**Trạng thái: mới, sau T26; đã giao từcd3ccc1, nộp xong tiếp tụcT28.** Chỉ sửa [review A](../reviews/receiptrail-antigravity.md), phản hồi [T24-R1–R3](../reviews/receiptrail-codex.md#review-t24--18112026-heartbeat0830-utc7). Đầu vào7325169 có hash `6a2155e29439d284d2a6ce5e3f4b5fc885f304e5d16b7ee90705d32471c99247`. Giữ phần Signer/has_one đã sửa đúng và expire_blockhash; không ghi lại has_one kiểm chữ ký hoặc bịa nonce.

Nộp bốn bảng sau, mỗi hàng dẫn **đường dẫn + dòng/hàm + assertion hoặc điều kiện + log nếu thực sự có + giới hạn**. Chưa kiểm phần nào ghi chưa kiểm; không thay bằng verified/r2.

1. **Authority/recipient:** pay payer Signer, has_one payer/merchant; merchant SystemAccount nhận tiền và không cần ký pay; cancel merchant Signer+has_one. Đọc source116–137, tests273/281/289/297/313, reject165 và log22/28/33/35/42; ghi lỗi/assertion cho từng vai.
2. **Ba ca rollback:** dùng đầy đủ ba tên test và bảng mẫu trong review T24. Trước retry lỗi là **Paid**, baseline `once`226 sau lần pay thành công; assert signature khác228 và Snapshot233. `[pay,pay]` là một tx, Open→rollback Open; CPI thiếu tiền là ca riêng. Đọc source263/238/181, log26/39/**23–24**. Tách principal/rent khỏi fee payer không có trong Snapshot26–31/148–157. Log METRIC rồi ok hai dòng là pass cũ, không rerun hoặc sửa log.
3. **Ma trận5nhóm:** layout/seeds/canonical bump; signer/recipient/alias/owner/type/version; expiry boundary/cancel sau expiry/terminal init; duplicate/race/rollback; receipt/commitment/RPC/upgrade/rent/ID khác. Trỏ source/test/assertion/log từng phần có evidence; phần RPC/browser/commitment/devnet chưa chạy phải ghi rõ. `send`131 + assert228 chỉ phục vụ transaction mới; race352 chỉ hai thứ tự serial. Không suy paid_slot local thành settlement finalized trên mạng.
4. **Phản hồi13findings:** mỗi T13-R1–R4, T18-R1–R3, T21-R1–R3, T24-R1–R3 một dòng; giữ nghĩa/ID gốc, trỏ mục/hàng vừa sửa và phần chưa đạt. Không tự đánh review chéo/cổng Phase2 hoàn tất.

**Nhận khi:** người đọc tái kiểm được từng kết luận từ source/log đã có và hiểu giới hạn; tên đúng hoặc checkbox không thay assertion. A tự ghi phạm vi đã đọc vào A-done/HANDOFF. Không sửa file C/source/test/IDL/thiết kế/điểm, cài hoặc chạy suite/browser/deploy/public. Không mở Phase3.

## T28 — hoàn thiện UX sau T25, giữ phần đã đúng

**Trạng thái: mới, sau T26/T27.** Sửa [UX A](../design/receiptrail-ux-antigravity.md) theo [T25-R1–R5](../reviews/receiptrail-codex.md#review-t25--18112026-heartbeat0900-utc7), không code. Đầu vào33b71e7:62dòng/hash `f6fd23abdccb8151eaa3a34a886f345f3fa53a2588d96831263d3a5fe6d22a9c`. Giữ9mã đúng và các khoảng thời gian đã cộng đủ165giây; phát triển nội dung của8mục đã có thay vì chỉ đổi tên task.

1. **Form/tiền:** merchant/recipient và payer, mapping OrderID→32bytes cụ thể/lưu/tái dùng, amount integer/u64 và cách chuyển SOL→lamports không làm tròn Number, expiry slot và terms bất biến. Bảng create=merchant rent+fee; pay=payer principal+fee; không trộn principal phải trả khi create hoặc rent invoice ở pay.
2. **State/lỗi:** hai bảng riêng Invoice Open/Paid/Cancelled với Expired=Open+slot>=expiry, và request Pending/Unknown; commitment riêng, merchant cancel. Sửa6004 đọc state,6005 dừng/liên hệ merchant,6007 dừng/tải lại recipient,6008 invoice.version không hỗ trợ→không ký. Giữ đúng9code/name, bổ sung program ID+code và nhóm Anchor/System/fee/wallet/RPC. Unknown không tự ký/gửi mới hoặc đổiID.
3. **8 bố cục có nội dung:** mỗi4màn desktop/mobile cần vùng fields/vị trí, trạng thái/commitment, PDA+program+cluster, CTA enabled/disabled, no-wallet/lỗi. Receipt chỉ link Explorer khi có signature đã biết; khôi phục điều kiện bị bỏ ởT25, không suy signature từ account. Không chỉ đánh số8dòng.
4. **Storyboard:** giữ tổng165giây; mỗi đoạn thêm hình/hành động/evidence, chỉ rõ mất response giả lập và đọc lại cùng PDA. Phải có tx/signature mới bị InvoiceNotOpen, principal1amount và phí fail riêng; trỏ test181/assert228/logr2:23–24 làm evidence local, chưa có browser/wallet/RPC/devnet/video thật. Nếu chưa làm cảnh đó, ghi kế hoạch thay vì kết quả đã chạy.
5. **SDK và phản hồi:** bảng chọn/bỏ/nguồn/mốc source hoặc version/ngày thực đọc/giới hạn, đối chiếu React/Vite/Wallet Standard hiện có. Chưa kiểm thì ghi chưa kiểm, không gọi tương thích tốt nhất hoặc dùng version lịch sử note005 làm evidence. Trả từng T16-R1–R5/T22-R1–R5/T25-R1–R5 bằng mục thực có; checkbox thiếu phải để chưa đạt. Đề xuất package không là quyền cài.

**Nhận khi:** nội dung đáp ứng từng phần, không chỉ số8/tổng165/checkbox. A tự kiểm9mã bằng JSON IDL, cộng thời gian và lưu output/phạm vi thật vào report; tự sửa A-done/HANDOFF đúng việc còn lại. Không sửa source/test/IDL/thiết kế/fileC hoặc chạy suite/browser/cài/deploy/public; không mở Phase3.

## Ghi kết quả và giới hạn

A ghi task/commit/đã kiểm/chưa kiểm vào [A-done](A-done.md), cập nhật HANDOFF của A; không đổi file C/audit lịch sử. Nộp report không tự là C nhận đạt. C tiếp tục review khi có bản mới; không đợi A để trình bản Phase2 đã soạn. Người dùng đã duyệt Phase2; giáo viên chưa có verdict. Quyền A vẫn là tài liệu, không mở code/triển khai mới. T8–T10 ClusterProof đã bỏ, giữ web/source/lab cũ; không khôi phục việc đó.
