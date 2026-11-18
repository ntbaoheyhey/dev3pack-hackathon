# Hàng đợi việc của Antigravity (A)

**Chủ file: Codex. Chỉ nhận việc từ file này.** A sở hữu các report của mình, A-done và HANDOFF A; C không sửa thay các file đó. Chỉ làm tài liệu Phase2 ReceiptRail. Quyết định **“ReceiptRail chính, ClusterProof phụ” lúc00:07 ngày18/11/2026 UTC+7** ở [DECISION](../ideas/DECISION.md); **người dùng đã duyệt Phase2** bằng “duyệt phase 2”, log09:27:18.464 ngày18/11 UTC+7. C đã được đồng ý P3-A/P3-B lúc log10:13:11.851 UTC+7, chỉ CI/hello theo DECISION; funding hello để sau. Quyền A vẫn là tài liệu trong queue; không cài/code/tạo ví-keypair triển khai/build web/deploy/public hoặc tự mở Phase3.

**Làm tiếp T30 → T31 → T32 → T33.** T28/T29 tại601e723 đã được C review: nhận phí create/pay, Unknown không tự ký/retry và baseline retry Paid→Paid; chưa nhận toàn bộ. [Review12:35](../reviews/receiptrail-codex.md#review-t28-và-t29--18112026-heartbeat1235-utc7) có9findings và snapshot. Giữ phần đã đúng, làm patch nhỏ theo từng task, không viết lại toàn report hoặc chỉ tick “hoàn tất”. Người dùng đã duyệt Phase2 riêng; chưa đóng review/giáo viên. Mọi commit/merge dùng [skip ci]; quyền A vẫn chỉ tài liệu.

**Lưu ý CI18/11:** commit7210aa6 chỉ sửa HANDOFF A nhưng thiếu `[skip ci]`, tạo hai run mới khi Anchor còn build; hai run a114a98 đã bị cancelled. Mọi commit tài liệu/HANDOFF của A **phải có `[skip ci]`**, kể cả commit merge. P3-A đã đạt hai runs27cf7ac; không còn CI live. Thứ tự đang giao **T30 → T31 → T32 → T33**, không chỉ đổi Thẻ nhớ rồi coi report đã nộp. Không sửa workflow/file C hoặc tạo thêm run.

**Đầu vào cập nhật306466f:** [review bổ sung](../reviews/receiptrail-codex.md#bổ-sung-bản306466f-trước-checkpoint--18112026) nhận Request và copy6007 đã sửa, nhưng UX bỏ phí create/Unknown/terms/context từng đúng. T30–T33 chưa được công bố khi A nộp bản này; vẫn làm bốn task dưới, không nộp lại tên T26–T29. Dòng dẫn trong review601e723 là snapshot lịch sử; đọc bản mới theo nội dung/source.

Lịch sử yêu cầu T21–T29 đã chuyển vào [archive](../archive/A-queue-before-T30.md). Phần dưới chỉ liệt kê việc đang giao.

## T30 — sửa semantics UX trước, giữ phí và Unknown đã đúng

**Trạng thái: mới, làm đầu tiên.** Chỉ sửa mục1–2 và trạng thái checklist của [UX A](../design/receiptrail-ux-antigravity.md); giữ mục3–5 để T33 bổ sung, đánh chưa đạt thay vì xóa. Đầu vào306466f/hashb8a28789…; đọc T28-R1/R2 trong [review12:35](../reviews/receiptrail-codex.md#review-t28-và-t29--18112026-heartbeat1235-utc7), [ARCHITECTURE4–6](../ARCHITECTURE.md), [source](../../programs/receiptrail/src/lib.rs)24–37/61–81/107–137 và JSON IDL. Không code/rerun suite/cài.

- Khôi phục từ601e723: create=merchant rent+fee, Unknown không tự ký/retry và terms read-only; giữ pay=payer principal+fee. Viết **hai bảng** Invoice Open/Paid/Cancelled (Expired=Open+slot>=expiry) và request Pending/Unknown; commitment là cột riêng, merchant vẫn cancel Open khi hết hạn. Không định nghĩa Paid bằng finalized.
- Giữ9code–name từ IDL, sửa **nguyên nhân/CTA**:6001 khi expiry<=current slot;6005 khi current slot>=expiry;6008 là invoice.version không hỗ trợ→không ký.6002 là điều kiện ví/địa chỉ trong program (zero/data), lỗi owner/type của Anchor tách riêng; no-wallet của browser không tự là6002.6006/6007 so payer/merchant public key trong invoice;6007 dừng/tải lại recipient. Tra program ID+code, nhóm Anchor/System/fee/wallet/RPC riêng; giữ6004 đọc state và6005 không đổiID để retry.
- Bổ sung merchant/recipient, mapping OrderID→32bytes cụ thể/lưu/tái dùng, SOL→lamports bằng integer/u64 và terms bất biến; nếu chưa quyết định thuật toán mapping thì ghi rõ đề xuất/chưa chốt thay vì nói đã có.
- Nộp ba dòng phản hồi T28-R1 và phần form T28-R2, còn wireframes/demo/SDK đánh chưa đạt/chuyểnT33. Đọc/so9mã JSON và lưu output thực; code–name đúng không chứng minh nguyên nhân/CTA đúng. Không tick chungR1–R5.

**Xong khi:** state và nguyên nhân/CTA6001/6002/6005/6006/6007/6008 được đối chiếu nguồn và bảng state thực có; phần phí/Unknown không bị mất. Sau nộp làm tiếpT31, không đợi C duyệt.

## T31 — sửa evidence, khôi phục provenance và state

**Trạng thái: mới, sauT30.** Chỉ sửa [evidence A](../data/receiptrail-evidence.md) từ306466f/hash987facc6…; đọc T29-E1–E3 và [note021](../learning/021-payment-cluster-evidence.md). Giữ5URL; không giảm bảng thành nhãn chung hoặc tự nhận crawl mới khi chỉ đọc note.

1. Ba alternatives có cơ chế/nguồn/ngày A thực đọc/giới hạn/tác động: Stripe idempotency key, v1/v2; Solana Pay reference **không bắt buộc unique**; x402 fingerprint/cache/conflict409. PDA định danh cần invariant program mới chống trả cùng invoice; không tự suy lợi thế market.
2. Hai pain sources có tác giả/ngày bài/ngày đọc và điều nguồn không chứng minh. Shopify là unknown charge/retry risk; issue452 là nonce đã dùng/AuthorizationUsed, phân biệt settlement và lỗi. Khôi phục metadata đã đúng ởT26; không viết trùng đơn/Solana double-debit/adoption khi nguồn không chứng minh. Nếu chưa mở URL thì nêu nguồn gián tiếp và chưa crawl.
3. Giữ Request Pending/Unknown đã khôi phục ở306466f. Paid là state, commitment riêng; bảng expiry−1/expiry/expiry+1 với actor/CTA và cùngPDA/program/cluster/owner/commitment. Tại/sau expiry chặn pay, merchant vẫn cancelOpen; không tự ký/gửi/đổiID.
4. Đúng10IDs gốc: T14R1state/R2idempotency/R3pain/R4alternatives; T20/T23 R1alternatives/R2pain/R3mapping-state. Trả thêmT26-R1–R3/T29-E1–E3 bằng mục/hàng thực; chưa đủ ghi chưa đạt. Không nhận “đã tách” khi bảng còn thiếu.

**Xong khi:** mỗi claim/ID trỏ nội dung kiểm được, provenance thật; không đổi điểm/thiết kế hoặc mở quyền. Sau nộp làm tiếpT32.

## T32 — review bằng assertion, giữ baseline Paid→Paid

**Trạng thái: mới, sauT31.** Chỉ sửa [review A](../reviews/receiptrail-antigravity.md) từ306466f/hashf25fb1bb…; đọc T29-R1–R3, source/test/log đã dẫn ở [review12:35](../reviews/receiptrail-codex.md#review-t28-và-t29--18112026-heartbeat1235-utc7). Không chạy code hoặc sửa source để khớp báo cáo.

- Pay: payer Signer/has_one payer; merchant SystemAccount recipient/data-empty/has_one merchant, không ký pay. Cancel: merchant Signer/has_one merchant. Bảng source line/test đầy đủ/assertion/log cho từng vai; helper reject165–176 và log r2:42/35/33/28/22.
- Ba hàng dùng **tên hàm đầy đủ** trong runtime.rs:181 `create_pay_and_fresh_transaction_retry_transfers_principal_only_once`,238 `two_pay_instructions_in_one_transaction_roll_back_the_first_transfer`,263 `insufficient_principal_cpi_leaves_invoice_open_and_balances_unchanged`. Giữ Paid→Paid/Open→Open/Open→Open; thêm `once`226, signature khác228, snapshot233; inner CPI250–254/snapshot255/Open256/paid_slot257; reject268/tuple269. Log23–24 là **một test**,39/26 là hai ca còn lại. Snapshot148–157 không gồm fee payer, không suy phí fail được hoàn.
- Thay verified/r2 trong5nhóm bằng file/hàm/assertion/log thực và giới hạn. send131 đổi blockhash; race352 là2thứ tự serial; chưa browser/RPC/devnet/commitment/recovery/upgrade/adoption. Không ghi “đã kiểm” phần chưa đọc.
- Trả từng13IDs T13/T18/T21/T24, rồiT27-R1–R3/T29-R1–R3 bằng mục/hàng có thật; không một câu thay cả13. Không tự đóng review chéo/cổng giáo viên.

**Xong khi:** người đọc tái đối chiếu được authority,3ca và5nhóm, hiểu giới hạn. Sau nộp làm tiếpT33.

## T33 — hoàn thiện bố cục, storyboard và SDK sau sửa semantics

**Trạng thái: mới, sauT32.** Chỉ sửa mục3–5 [UX A](../design/receiptrail-ux-antigravity.md), giữ nguyên phần đã đúng củaT30. Đọc T28-R2/R3, [ARCHITECTURE6](../ARCHITECTURE.md#6-off-chain-retry-và-ux), [IDEA](../IDEA.md), notes005/013/014.

- Viết8bố cục riêng cho4màn desktop/mobile, mỗi bố cục có vùng fields/ưu tiên, CTA theo state/no-wallet/lỗi và PDA+program+cluster+commitment. Một câu chung và phép4x2 không thay nội dung. Receipt chỉ Explorer khi signature hợp lệ đã biết; không suy từ account.
- Storyboard giữ165giây, thêm hình/hành động/evidence, mất response giả lập→đọc cùngPDA, tx/signature mới bị InvoiceNotOpen, principal1amount và fee fail riêng. r2:23–24 cùng một test/METRIC+ok, không là hai cảnh create/pay riêng. UI/timeout/video chưa chạy phải ghi kế hoạch/replay, không gọi kết quả browser/devnet.
- Bảng SDK chọn/bỏ hoặc chưa quyết định, version/mốc source chính xác+URL/ngày thực đọc/giới hạn; so React/Vite/Wallet Standard hiện có. Không dùng v1.9x/v0.2x làm version đã kiểm, không suy quyền cài từ đề xuất. Giữ giới hạn lịch sử note005.
- Trả từngT16/T22/T25-R1–R5 vàT28-R2/R3 bằng mục thực; mục còn thiếu không tick. Tự cộng thời lượng và ghi đúng phạm vi kiểm tài liệu.

**Xong khi:** nội dung đủ tái kiểm, không chỉ số8/tổng165/checkbox. Chưa code UI/browser/cài/deploy/public; nộp rồi A tự cập nhật trạng thái đúng phạm vi.

## Ghi kết quả và giới hạn

A ghi task/commit/đã kiểm/chưa kiểm vào [A-done](A-done.md), cập nhật HANDOFF của A; không đổi file C/audit lịch sử. Nộp report không tự là C nhận đạt. C tiếp tục review khi có bản mới; không đợi A để trình bản Phase2 đã soạn. Người dùng đã duyệt Phase2; giáo viên chưa có verdict. Quyền A vẫn là tài liệu, không mở code/triển khai mới. T8–T10 ClusterProof đã bỏ, giữ web/source/lab cũ; không khôi phục việc đó.
