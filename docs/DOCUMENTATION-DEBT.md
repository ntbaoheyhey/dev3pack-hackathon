# Nợ tài liệu — ReceiptRail

18/11/2026 · C nhận đúng một lượt cuối A tại `7857e9b`, sau queue `7137ec0`. **T31/T32/T33 đã đóng theo chỉ đạo người dùng. Các khoản dưới đây không phải hàng đợi sửa hoặc vòng review mới; không chặn P3-B, không mở Phase 4.** [Snapshot nhận cuối](evidence/phase2/receiptrail-final-pass-2026-11-18.json).

| Khoản nợ | Phần nhận/giữ | Phần còn thiếu và giới hạn |
| --- | --- | --- |
| D01 — T31-E1/E2/E3 | Năm URL; nhãn Web API/GraphQL/EVM và không chứng minh double-pay Solana; Pending/Unknown không tự ký/retry; Expired có Open | Thiếu provenance/ngày đọc/cơ chế/trade-off cho từng claim, context PDA/program/cluster và bảng ba mốc expiry. Paid vẫn đồng nhất với Finalized; phản hồi nhóm không thay từng finding. Chưa crawl/pilot mới, không tăng điểm từ report. |
| D02 — T32-R1/R2/R3 | Payer ký pay, merchant nhận là SystemAccount; has_one so pubkey, seeds/bump kiểm Invoice; merchant ký cancel; log r2:26/39/23–24 đúng; giới hạn VM serial/chưa network | Thiếu data-empty/owner/version đầy đủ, ba tên test còn rút gọn và assertion thiếu vị trí. Snapshot runtime148–157 không có fee payer: không suy mọi số dư/phí không đổi. Retry: signature khác228/snapshot233; two-pay250–257 rollback toàn tx; insufficient268–269. Ma trận/verified/phản hồi nhóm chưa thay bằng chứng từng mục. |
| D03 — T33-R1/R2/R3 | Phí create/pay, terms bất biến/read-only, Unknown không tự retry, reload recipient; chín code-name khớp IDL; storyboard tổng165giây trên giấy | Paid là Invoice state, commitment riêng; Pay của payer, Expired chỉ Open+slot>=expiry.6002 là payer zero hoặc account data không rỗng, không tự là missing/reconnect;6008 là invoice.version. Form/validation/CTA/tám bố cục chưa đủ; bốn bullet lặp mobile không thành tám wireframe. Chưa demo browser timeout/duplicate-tx/receipt thật; SDK v1.9x/v0.2x/ngày thiếu nguồn không là bộ đã kiểm. |

Nguồn ưu tiên: [ARCHITECTURE](ARCHITECTURE.md), [IDEA](IDEA.md), [IDL](idl/receiptrail.json), [program](../programs/receiptrail/src/lib.rs), [runtime](../programs/receiptrail/tests/runtime.rs), [log r2](evidence/phase2/receiptrail-spike-r2.txt). Giữ nguyên report A để truy nguyên; không dùng câu sai trong report làm contract triển khai.

Lượt cuối T31/T33 chủ yếu đổi tiêu đề; T32 làm rõ has_one pubkey và lời phản hồi. A-done tự nhận sửa UX/provenance không đủ chứng minh các phần đó đạt. C nhận phần đúng ở trên, ghi thiếu sót tại đây và **đóng cả ba task**, không yêu cầu nộp lại. Không phải verdict giáo viên hoặc audit độc lập. Ví extension thật/chưa reproducible build là giới hạn Phase 3 riêng.

## Đối chiếu hiện hành theo Prompt 04 — 19/11/2026

C xử lý phần rẻ bằng source và evidence đã có; không sửa report lịch sử của A, không mở lại T31–T33 và không tăng điểm sản phẩm. Bảng phía trên giữ nguyên tình trạng ở lần nhận cuối.

| Khoản | Đã làm rõ trong tài liệu hiện hành | Nợ thực tế còn lại |
| --- | --- | --- |
| D01 | [Note 026](learning/026-receiptrail-rpc-confirmation.md): state khác commitment, Unknown chỉ là kết quả gửi chưa rõ. Phạm vi là `(genesis/cluster, program, merchant, invoiceID/PDA)`. Bảng expiry dưới đây và test `expiry_boundary_before_at_and_after` làm rõ ba mốc | Provenance/trade-off của các claim sản phẩm, pilot và nguồn pain độc lập vẫn thiếu; không lấy tài liệu kỹ thuật thay evidence thị trường |
| D02 | [Security r1](reviews/receiptrail-security-r1.md): owner/data/version/Signer/has_one, testnames và vị trí assertions; helper reject đo fee payer riêng. Bảng rollback dưới đây không suy từ snapshot thiếu fee | Chưa audit độc lập, chưa verified source build; tests race serial không là stress race/reorg mạng |
| D03 | [IDEA](IDEA.md), [ARCHITECTURE](ARCHITECTURE.md), client/IDL và UI hiện hành tách state/commitment; bảng role/error dưới đây sửa nghĩa 6002/6008 | T37 có patch in-memory; bản source thật cần T40 + kiểm C. Extension/thiết bị thật và demo thuyết trình đầy đủ chưa kiểm. Không sửa tám wireframe lịch sử để mở vòng mới |
| D04 — T37 | Nhận một lượt ở [review T37](reviews/receiptrail-phase5-t37.md). Video đo thật 33.08s, không gọi là video 165s hoàn chỉnh; hashes null không chứng minh snapshot | Report/harness T37 giữ nguyên để truy nguyên. Source snapshot và assertions thiếu do C bổ sung trong nghiệm thu T40; không yêu cầu nộp lại report |
| D05 — SR-01 | Comment local-only/no deployment keypair ở lib.rs:4 đã cũ sau P4-B | Sửa khi có lượt core tiếp theo; không upgrade program để sửa comment |

### State, commitment và expiry

Invoice lưu Open/Paid/Cancelled. Expired chỉ là Open khi `observedSlot >= expiresSlot`; Paid và Cancelled không đổi thành Expired. Pending/Unknown thuộc quá trình gửi. `confirmed`/`finalized` thuộc bằng chứng chain, không phải trạng thái hóa đơn.

| Mốc khi Invoice còn Open | Pay của đúng payer | Cancel của merchant |
| --- | --- | --- |
| slot < expiry | Có thể trả sau khi xác nhận terms | Được hủy |
| slot = expiry | Bị chặn 6005 InvoiceExpired | Được hủy |
| slot > expiry | Bị chặn 6005 InvoiceExpired | Được hủy |

Source: `lib.rs:64–65,93`; tests `runtime.rs:342–370`. Pay/Cancel vẫn cần các kiểm account và signer khác. Không biết slot hiện hành thì UI chưa được kết luận có thể Pay.

### Ba ca rollback và fee payer

| Ca | Tên test / vị trí assertion hiện hành | Kết luận đúng |
| --- | --- | --- |
| Pay bằng transaction mới sau Paid | `create_pay_and_fresh_transaction_retry_transfers_principal_only_once`, runtime:246–255 | Signature khác, InvoiceNotOpen, snapshot Invoice/principal giữ nguyên; snapshot này không gồm fee payer |
| Hai Pay trong cùng transaction | `two_pay_instructions_in_one_transaction_roll_back_the_first_transfer`, runtime:259–281; `two_pay_rollback_charges_only_fee_payer`, :815–826 | Cả transfer đầu và state rollback; test phí riêng chứng minh fee payer mất đúng metadata fee > 0 |
| Payer thiếu principal | `insufficient_principal_cpi_leaves_invoice_open_and_balances_unchanged`, runtime:284–291; helper reject :180–198 | Invoice vẫn Open/paid_slot=0, principal không đổi; helper so riêng phí đã trừ với failure.meta.fee |

Thêm test `create_then_pay_is_atomic_and_duplicate_pay_rolls_back_creation`, runtime:765–812: create+pay+pay thất bại để lại không Invoice, rent/principal rollback nhưng fee payer vẫn mất phí. Đối chiếu source với [CI triển khai](evidence/phase4/ci-deployment.json), không chạy lại mạng hoặc suite không đổi trong lượt dọn tài liệu.

### Vai và lỗi theo IDL hiện hành

Merchant ký Create và Cancel; payer được chỉ định ký Pay. Merchant nhận SOL ở Pay phải đúng account trong Invoice, không cần ký Pay. Người xem không ví vẫn đọc được.

| Code | Tên IDL | Ý nghĩa / CTA |
| --- | --- | --- |
| 6000 | InvalidAmount | Amount phải dương; sửa input và xác nhận lại |
| 6001 | InvalidExpiry | Expiry phải lớn hơn slot khi Create; đọc slot và review lại |
| 6002 | InvalidWallet | Payer zero tại Create, hoặc merchant/payer có data tại các constraint liên quan. Sai owner có thể là lỗi Anchor riêng; không gán mọi lỗi này thành “chưa kết nối ví” |
| 6003 | AliasedRoles | Payer trùng merchant hoặc invoice; sửa terms trước Create |
| 6004 | InvoiceNotOpen | Đã Paid/Cancelled; đọc receipt, không tự gửi lại |
| 6005 | InvoiceExpired | Open đã tới hạn; khóa Pay, merchant vẫn có thể Cancel |
| 6006 | WrongPayer | Signer payer không khớp Invoice; dùng đúng account, xem lại terms |
| 6007 | WrongMerchant | Account merchant không khớp Invoice; đọc lại recipient/role |
| 6008 | WrongVersion | `invoice.version` không được hỗ trợ; khóa thao tác, không phải lỗi RPC/SDK version |

Nguồn: [IDL](idl/receiptrail.json), [program](../programs/receiptrail/src/lib.rs), [client contract](PHASE4-CLIENT.md). Parser phải giữ namespace program; lỗi Anchor/System không tự mang code-name ReceiptRail.

D06 — T38: version/capability/events và lỗi extension thật chưa kiểm. C đã bổ sung [nguồn/hiệu chỉnh](reviews/receiptrail-t38-acceptance.md), nhận khung nghiên cứu một lượt và giữ giới hạn này; không mở vòng sửa report.
