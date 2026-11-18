# ReceiptRail — tự review Phase 2 của Codex

18/11/2026 · source/tests/IDL ở commit8f84cfe; chỉ tự review của tác giả, **không phải review độc lập hoặc duyệt của người dùng/giáo viên**. Đọc notes004/007/016/023 trước đối chiếu.

| Phần đã đối chiếu | Bằng chứng / kết luận có giới hạn |
| --- | --- |
| Authority và account | Signer+has_one, Account owner/discriminator, seeds namespace/fixed32byte fields/canonical init bump, version; tests wrong/missing signer/recipient/owner/type/PDA/bump đều fail trước chuyển principal |
| Tiền và atomicity | Amount đọc từ state; CPI chỉ System; data-empty System wallets; write Paid sau CPI. Test thiếu tiền và `[pay,pay]` rollback state/balances, fee payer riêng |
| Idempotency | Mỗi submission đổi blockhash; happy test assert signature khác, retry fail và snapshot không đổi. Không nhầm transaction replay với cùng invoice bằng tx mới |
| Lifecycle | Init mới, không update/reset/close/reopen; Paid/Cancelled terminal, expiry suy từ Open+Clock; cancel sau expiry được phép, cả2 thứ tự pay/cancel đã chạy |
| Input/alias | Amount>0, expiry tương lai, payer khác merchant/invoice/zero. Handler không unwrap/unchecked arithmetic; u64, system transfer xử lý balance; UI bigint mới là kế hoạch |
| IDL/ABI |3instructions, args/accounts order+signer/writable, PDA namespace, discriminators,9errors và layout131bytes khớp source/ARCHITECTURE; JSON assertions pass, hash lưu metadata |
| Build/quyền | Runner offline/locked và compiler cache trực tiếp, thiếu exe exit2. Source/test/lock/binary hash như log; không gọi wrapper sinh keypair, không cài/deploy |

Không thấy finding chặn bản Phase2 trong phạm vi đọc/chạy này; không thay audit. Giới hạn còn mở: signature verification bật theo LiteSVM default; fixtures malformed dùng set_account để thử boundary; không test network contention/upgrade attack/reorg/real wallet/browser. Program signer có thể là PDA khi gọi CPI hợp lệ, không tự suy mọi signer là ví người.

Rủi ro thiết kế cố ý: một PDA chỉ một principal, không chống merchant tạo invoiceID khác cho cùng order; rent terminal bị giữ; native SOL chưa stablecoin/x402; tin RPC/program/upgrade authority; receipt không chứng minh hàng đã giao. Mọi mở rộng/triển khai cần cổng riêng.

C01 nâng F3→4 theo D2 ở [mục9](../ideas/codex/01-receipt-rail.md), R/D giữ4 PLAN; không nâng R5 khi thiếu reviewer độc lập. T21 đã sửa đúng3tên test, T19 đạt riêng9/9 mã–tên IDL; các report chưa nhận đạt toàn bộ. Findings và hướng sửa ở cuối file; queue hiện hành: **T22 → T23 → T24**. Không lấy kết quả ClusterProof cũ thay review.

## Review đầu ra T11 — 18/11/2026, heartbeat01:25 UTC+7

Đã fetch/pull bản A **5b7abd5**, đọc [report19dòng](../data/receiptrail-evidence.md) và đối chiếu yêu cầu T11 với note021/ARCHITECTURE hiện hành. **Chưa nhận T11 là đạt.** Lượt này chỉ đánh giá nội dung report, chưa mở lại các URL; không khẳng định đã xác minh hoặc bác bỏ nội dung website mà A dẫn.

| Mục thiếu | Quan sát trong bản T11 | Yêu cầu bổ sung T14 |
| --- | --- | --- |
| Hai nguồn pain độc lập | Chỉ có một issue và một spec; spec mô tả cơ chế không tự là báo cáo sự cố của nhóm user thứ hai | Nguồn thứ hai độc lập, claim/phạm vi/ngày/đoạn nguồn kiểm được; ghi rõ lịch sử/EVM/Solana, không suy nhu cầu custom rail |
| Evidence alternatives | Có tên Stripe/Solana Pay/x402 nhưng Stripe và payment_identifier không có URL trong mục alternatives; thiếu giới hạn/trade-off | ≥3 URL nguồn đích đã đọc, mỗi claim có nguồn và giới hạn; tham khảo ledger note021 nhưng phải ghi đúng phần đã kiểm |
| “replay trap” | Report gán kết luận cho issue452 mà không dẫn đoạn cụ thể hoặc phân biệt EVM/Solana | Bổ sung phần nguồn hỗ trợ; không có thì thu hẹp diễn giải và ghi chưa xác minh, không biến thành lỗi Solana hiện hành |
| Negative evidence | Nhận định “nhiều hệ thống” bỏ reconciliation vì latency/payment channels không có nguồn | Bổ sung nguồn hoặc đổi nhãn giả thuyết cần kiểm; không dùng làm evidence chấm điểm |
| State machine | Pending→Submitted→Settled/Failed chưa tách trạng thái request khỏi Invoice | Giữ contract Open/Paid/Cancelled và Expired hiển thị. Request timeout là chưa xác định; mapping UI riêng, không tự kết luận Failed hoặc đổi contract |

Giữ điểm C01r2=79/F4 và thiết kế đã trình; report này chưa cung cấp evidence đủ để đổi điểm/phạm vi. A tiếp tục **T12→T13→T14** qua queue; C không sửa A-done/HANDOFF A hoặc thay report của A. Cổng người dùng/giáo viên vẫn mở, không thực hiện Phase3.

## Review đầu ra T14 — 18/11/2026, lượt heartbeat 02:25 UTC+7

Đã fetch/pull tới **33d2217**, đọc report T14 tại **b5092a4** và A-done. **T14 chưa đạt tiêu chí nhận**, dù A đã ghi xong. Những dòng được dẫn dưới đây thuộc report ở b5092a4; không dùng số dòng của bản sửa sau này. Đây là review evidence, không phải review chéo program hoặc lời duyệt Phase2.

Nguồn C đã mở trong lượt này:

- [x402 issue452](https://github.com/x402-foundation/x402/issues/452), body qua GitHub connector: issue lập 11/10/2025, nói EIP-3009/ERC-3009; nonce đã dùng khiến retry cùng payload trả `AuthorizationUsed` và app khó phân biệt đã settle với thất bại. Body không chứng minh cùng payload bị trừ tiền hai lần hoặc lỗi Solana hiện hành; chưa đọc lại comments hay chạy implementation.
- URL A dẫn `https://solanapay.com/spec` không truy cập được bằng công cụ; đây là giới hạn lượt đọc, không kết luận website đã chết. Đã mở [Solana Pay spec v1.1, mục Reference](https://solana.com/docs/tools/solana-pay/specification/version1-1#reference): reference có thể không unique, dùng `getSignaturesForAddress` để tìm transactions. Suy luận review: tra cứu reference riêng lẻ chưa chứng minh cơ chế chặn thanh toán lần hai.

| Finding | Vị trí report b5092a4 | Kết luận và cách sửa |
| --- | --- | --- |
| T14-R1 — cao: trộn state và sai đường đối soát ReceiptRail | Dòng19–23 | `Open→Pending→Settled` và gọi `Open/Paid/Cancelled/Unknown` là request state mâu thuẫn [ARCHITECTURE](../ARCHITECTURE.md). Tách ba phần: Invoice chỉ Open/Paid/Cancelled; Expired là nhãn suy từ Open+slot; request/Unknown là quan sát UI. ReceiptRail đọc Invoice PDA đã biết, signature nếu có; chưa tích hợp Solana Pay reference. Không tự đổi contract theo report. |
| T14-R2 — cao: nguồn không đủ cho claim idempotent | Dòng9,12,17 | Câu Solana Foundation Pay “đảm bảo idempotent” chưa có nguồn riêng và đang lẫn với Solana Pay spec. Ghi đúng cơ chế/giới hạn, dẫn implementation phù hợp hoặc ghi chưa xác minh; bỏ khái quát EVM chỉ dùng hash/Solana dùng reference nếu không có nguồn. |
| T14-R3 — vừa: vẫn thiếu nguồn pain độc lập | Dòng6–12 | Vẫn một issue và một spec; spec không là báo cáo pain độc lập thứ hai. Issue452 chỉ hỗ trợ tình huống retry/unknown ở phạm vi đã nêu. Cần nguồn thứ hai thật hoặc ghi chưa tìm thấy; không chuyển thành bằng chứng double-payment Solana. |
| T14-R4 — vừa: alternatives chưa kiểm được | Dòng15–17 | Mục alternatives chỉ có hai tên, thiếu URL đích cho cả Stripe và Solana Foundation Pay; chưa có bảng ít nhất ba alternatives với ngày đọc, claim, giới hạn và tác động thiết kế. Note021 có ledger để A đối chiếu; không coi ledger cũ là đã mở nguồn mới. |

Điểm đã cải thiện: bỏ claim latency/payment channels và “replay trap” không có nguồn; timeout không còn tự gọi Failed. Các điểm này chưa đủ đóng R1–R4. Giữ C01r2=79/F4, IDEA/ARCHITECTURE và source/tests hiện hành; không chạy lại tests vì không sửa code. Giao sửa hẹp **T15**, sau **T12→T13**; không mở Phase3 hoặc hỏi duyệt lặp lại. C không sửa report/A-done/HANDOFF của A.

## Review đầu ra T12 — 18/11/2026, lượt heartbeat 02:55 UTC+7

Đã fetch/pull tới **60f3efc**, đọc [bản UX25dòng](../design/receiptrail-ux-antigravity.md) tại **42c5523**. Đối chiếu T12 với [IDEA](../IDEA.md), [ARCHITECTURE mục4–6](../ARCHITECTURE.md), IDL đã mô tả trong kiến trúc và phần liên quan notes005/013/014/023. **T12 chưa đạt tiêu chí nhận**; các số dòng dưới đây là bản42c5523. Chỉ review tài liệu, chưa có UI/browser hoặc review program độc lập.

| Finding | Vị trí bản42c5523 | Phần phải sửa trước khi nhận UX |
| --- | --- | --- |
| T12-R1 — cao: form vượt phạm vi và thiếu terms | Dòng7–12 | “Chọn token” không khớp MVP native SOL. Form cần payer được chỉ định, mã invoice ổn định, số SOL, hạn theo slot và merchant/recipient; có bước xem lại terms bất biến, rent/phí trước ký. Ghi rõ merchant ký create/cancel, payer đúng chỉ định ký pay; không dùng “owner” mơ hồ. Không thêm SPL/token selector hoặc quyền ví mới. |
| T12-R2 — vừa: thiếu wireframe và tách state | Mục1–2, dòng13/16/19 | Chưa có bố cục desktop/mobile, màn receipt hoặc bảng CTA theo từng state. Danh sách đang trộn Pending với Invoice; cần tách request/Unknown, Invoice Open/Paid/Cancelled và Expired hiển thị. Thể hiện confirmed/finalized theo ARCHITECTURE, đọc PDA khi reload. No Wallet cần luồng xem không ví và chỉ kết nối ví sẵn có khi ký; không biến cài ví thành điều kiện xem invoice. |
| T12-R3 — vừa: error mapping mới là tên nhóm | Dòng15–19 | Chưa map9 lỗi6000–6008 của ReceiptRail tới copy tiếng Việt/CTA. Bổ sung namespace program ID, nhóm Anchor/System/fee/wallet reject/RPC unknown riêng; balance precheck chỉ hỗ trợ UX, vẫn cần xử lý lỗi trả về. Phải chỉ rõ khi nào không hiện Pay/không tự retry. |
| T12-R4 — vừa: demo thiếu bằng chứng giá trị chính | Dòng21–25 | Tổng30+60+60+15 đúng165s, nhưng reject/reload chung chưa chứng minh transaction mới bị chặn trên cùng invoice. Cần pay→mất response có nhãn→đọc cùng PDA→thử pay bằng tx mới→InvoiceNotOpen và principal chỉ một amount; tách phí fail, nhãn local/replay/devnet và giới hạn. Dùng storyboard IDEA đã trình làm cơ sở; không thực thi demo lúc này. |
| T12-R5 — vừa: thiếu quyết định SDK có nguồn | Toàn file | Chưa có phần chọn/bỏ SDK theo tiêu chí T12. Đối chiếu lựa chọn tái dùng React/Vite/Wallet Standard trong ARCHITECTURE với note014; ghi lý do/nguồn và giới hạn cho sponsor SDK bỏ khỏi core. Chỉ tài liệu, không cài/tạo key/tích hợp. |

Điểm dùng được: có flow merchant/payer, nhận biết reject/thiếu tiền/timeout và ghi không tự trả lại hoặc tạo ID mới. C giữ các điểm này làm tiêu chí sửa, chưa nhận bản25dòng như thiết kế UX hoàn tất. Giao **T16** trả lời từng R1–R5 và checklist nhận; ưu tiên **T13→T16→T15** để review kiến trúc vẫn đi trước. Giữ IDEA/ARCHITECTURE, score và source/tests; không đổi file UX/A-done/HANDOFF của A. Phase2 chưa qua cổng duyệt.

## Đối chiếu trạng thái T13 — 18/11/2026, lượt heartbeat03:25 UTC+7

Đã pull **8d4d30a**. [Khung review của A](receiptrail-antigravity.md) ghi chưa có thiết kế, dự kiến chờ bản như `IDEA-clusterproof-draft.md`; chưa có finding hoặc verdict theo nhóm được giao. `git ls-tree` xác nhận IDEA/ARCHITECTURE/IDL ReceiptRail và source/tests đều tracked; `git log` xác nhận hai tài liệu thiết kế từ **8f84cfe**, `git merge-base --is-ancestor 8f84cfe HEAD` exit0. Vì vậy thiếu đầu vào không phải blocker đã được chứng minh trong repo chung.

Đã bổ sung bảng đầu vào cụ thể và thứ tự đọc cho T13 trong [A-queue](../tasks/A-queue.md); A tiếp tục task đang làm, tự sửa câu chờ sai trong file của mình. Nhãn chưa duyệt không chặn bước review tài liệu đã giao. C không sửa file review/A-done/HANDOFF A, không nhận khung này như review chéo hoàn tất và không tự kết luận thay A. Ghi sự cố K7 tại [STOP-CAUSES](../STOP-CAUSES.md); Cổng người dùng/giáo viên giữ nguyên.

## Review đầu ra T16 — 18/11/2026, lượt heartbeat04:10 UTC+7

Fetch/pull xác nhận `work` ở **5313746**; [bản UX43dòng tại a27a207](https://github.com/ntbaoheyhey/dev3pack-hackathon/blob/a27a20786db78990495e8af1d24e1e2822e4663b/docs/design/receiptrail-ux-antigravity.md) chưa đổi. A-done ghi T16 xong, nhưng **T16 chưa đạt tiêu chí nhận**. Các số dòng dưới đây thuộc snapshot a27a207. C đã đọc IDEA/ARCHITECTURE, notes005/009/023, JSON IDL và enum `ReceiptError` trong source; chỉ review tài liệu, không chạy lại runtime suite.

### Đối chiếu lỗi T16 với IDL

Python standard library đọc `errors` từ [IDL](../idl/receiptrail.json), lấy các hàng6000–6008 của bản UX và đối chiếu tên enum [ReceiptError](../../programs/receiptrail/src/lib.rs): **9 hàng đã kiểm, 0 hàng khớp; thứ tự/tên enum source khớp IDL**. Bảng sai chưa được đưa vào contract/client. Đây là kiểm dữ liệu của report, không phải kết quả runtime tests mới.

| Code | Tên trong UX a27a207 — sai | Tên đúng trong IDL/source |
| ---: | --- | --- |
| 6000 | InvalidOwner | InvalidAmount |
| 6001 | InvoiceExpired | InvalidExpiry |
| 6002 | InvoicePaid | InvalidWallet |
| 6003 | InsufficientBalance | AliasedRoles |
| 6004 | InvalidAmount | InvoiceNotOpen |
| 6005 | InvalidToken | InvoiceExpired |
| 6006 | ReplayTx | WrongPayer |
| 6007 | InvalidSigner | WrongMerchant |
| 6008 | ProgramMismatch | WrongVersion |

### Findings T16

| Finding | Vị trí bản a27a207 | Phần cần sửa qua T17 |
| --- | --- | --- |
| T16-R1 — cao: bảng lỗi không khớp hợp đồng | Dòng20–30 | Cả9 cặp mã–tên sai; ví dụ6001 là InvalidExpiry khi create, không phải InvoiceExpired, còn6006 là WrongPayer, không phải ReplayTx. Viết lại copy/CTA theo bảng IDL và ARCHITECTURE mục5; namespace program ID + code, tách lỗi Anchor/System/fee/wallet/RPC. Không tự tạo ID mới sau timeout, không tự trả lại hoặc suy Paid từ mã lỗi. |
| T16-R2 — cao: vẫn vượt scope native SOL | Dòng8,26,28,33 | Token Selector, mint/token và nhập token trong demo không có trong contract. Form/copy/storyboard dùng SOL, payer/merchant/invoiceID/amount/expiry rõ ràng, xem lại terms bất biến. Phân biệt merchant trả rent lúc create với principal/fee lúc pay, không để nhãn Fees/Terms/Rent chung thay thông tin cụ thể. |
| T16-R3 — vừa: chưa có wireframe và bảng state/CTA | Dòng5–18,39–41 | Flow bullets chưa là bố cục4màn desktop/mobile. Pending/Unknown phải là request observation riêng; Invoice chỉ Open/Paid/Cancelled, Expired suy từ Open+slot. Ghi commitment confirmed/finalized và đọc đúng Invoice PDA/program/cluster khi Check Status/reload; chữ “query on-chain” chưa đủ. Nêu CTA không ký lại khi chưa xác định kết quả. |
| T16-R4 — vừa: demo chưa chứng minh chặn duplicate tx mới | Dòng32–36 | Tổng165s đúng, nhưng chỉ create/pay/timeout/reload/receipt. Thêm cảnh cùng PDA, transaction/signature mới bị InvoiceNotOpen; principal chỉ chuyển một amount và phí fail tách riêng. Ghi demo dự kiến hoặc replay local, chưa là ví/RPC/devnet thật. |
| T16-R5 — vừa: thiếu SDK decision và chưa tự kiểm đầu ra | Dòng38–43, toàn file | Không có phần chọn/bỏ SDK kèm nguồn; cả5 checkbox vẫn bỏ trống dù A-done ghi xong. Đối chiếu ARCHITECTURE mục6 và note014, ghi phần đã mở nguồn/chưa kiểm, không cài/tích hợp. Checklist phải trỏ đúng mục đã làm; mục thiếu vẫn ghi chưa đạt. |

Điểm cải thiện có thể giữ: thêm payer/ID, bước review rent/fee, xem không ví và nút Check Status. Các điểm này chưa đóng T12-R1–R5 hoặc T16-R1–R5. T13 vẫn là khung8d4d30a chưa có verdict; T15 đã có trong queue, nên dòng “hết việc/chờ C giao T15” ở HANDOFF A/5313746 không khớp danh sách đang mở. Parent của a27a207 là ed9a070, đã chứa bảng đầu vào T13; không suy đoán lý do A bỏ qua.

C giao **T17** sửa UX theo IDL và checklist cụ thể, ưu tiên **T13→T17→T15**; ghi sự cố **K8** và bài học note023. Không sửa file UX/review/A-done/HANDOFF của A, source/tests/IDL, IDEA/ARCHITECTURE hoặc điểm79/F4. Review tài liệu đã giao được tiếp tục; cổng người dùng/giáo viên chưa mở, không thực hiện Phase3.

## Review đầu ra T13 — 18/11/2026, lượt heartbeat04:40 UTC+7

Đã fetch/pull **1f59e03**, đọc [report18dòng tại c591fc9](https://github.com/ntbaoheyhey/dev3pack-hackathon/blob/c591fc90c2da6457d0ea4b6e7cec3b4633f20647/docs/reviews/receiptrail-antigravity.md). A đã bỏ câu chờ thiết kế, xác nhận đúng bộ8f84cfe và có verdict sơ bộ; **C chưa nhận T13 đạt review chéo**. Các số dòng report dưới đây thuộc c591fc9. C đọc lại source/tests, ARCHITECTURE mục3–8, notes007/023 và log r2; không chạy lại tests hoặc sửa contract.

Kiểm dữ liệu: source/tests/IDL khớp cả3 SHA256 trong metadata;4 hàm retry/rollback/pay-cancel được dẫn có trong source và log r2 đã đạt. Không có token `nonce` trong3 file đã kiểm; kết luận về cơ chế còn dựa việc đọc handler/harness bên dưới, không chỉ tìm kiếm từ khóa.

| Finding | Vị trí report c591fc9 | Kết luận và phần cần bổ sung |
| --- | --- | --- |
| T13-R1 — cao: cơ chế nonce/race chưa có căn cứ | Dòng12 | Report không chỉ rõ nonce nào. Invoice/source không có field hoặc instruction nonce; `Harness::send` đổi recent blockhash mỗi submission, không dùng durable nonce. Chống trả lặp cùng PDA ở đây dựa Open check, Invoice writable và CPI+Paid atomic; test retry assert signature mới. Test race chỉ chạy hai thứ tự pay→cancel/cancel→pay trong VM, chưa chứng minh network contention. Sửa diễn giải và trỏ hàm/assertion, không thêm nonce vào thiết kế để khớp report. |
| T13-R2 — vừa: thiếu kết luận theo từng nhóm đã giao | Dòng8,11,17 và toàn file | Có câu PDA đúng seeds nhưng chưa chỉ seeds/canonical bump/layout; thiếu signer/recipient/alias, owner/discriminator/version, expiry boundary/cancel sau expiry và terminal init. Dùng đường dẫn đầy đủ `programs/receiptrail/src/lib.rs`, `programs/receiptrail/tests/runtime.rs`, `docs/idl/receiptrail.json`; mỗi nhóm cần vị trí kiểm được, finding có mức độ hoặc không thấy finding trong phạm vi cụ thể. Không đánh đạt toàn logic từ câu chung. |
| T13-R3 — vừa: đề nghị rollback chưa chỉ rõ thiếu gì | Dòng14,18 | ARCHITECTURE mục4/7/8 và runtime tests đã mô tả/kiểm CPI thiếu tiền, hai pay cùng transaction và retry transaction mới. Đây hiện là yêu cầu giải thích, chưa là bằng chứng lỗi program hoặc thiếu test. C bổ sung bảng đối chiếu bên dưới; A nêu assertion/điều kiện cụ thể còn thiếu nếu vẫn có concern. |
| T13-R4 — vừa: receipt cần giới hạn kiểm chứng rõ | Dòng13 | Thu hẹp kết luận tới state/transfer cùng invoice dưới logic hiện hành; phân biệt local VM với client/RPC/commitment chưa kiểm. Receipt không chứng minh delivery, không chống merchant dùng invoiceID khác, không loại bỏ trust upgrade authority/RPC. Trỏ ranh giới ở IDEA và ARCHITECTURE mục1/6–8. |

### Giải thích rollback cho T13

Các hàm dưới đây ở [runtime.rs](../../programs/receiptrail/tests/runtime.rs), source không đổi từ8f84cfe. [Log r2](../evidence/phase2/receiptrail-spike-r2.txt) đã lưu kết quả đạt của chúng; đây là đọc lại bằng chứng cũ, không phải run mới.

| Tình huống | Hàm/assertion đã có | Kết quả được chứng minh local |
| --- | --- | --- |
| CPI thiếu principal | `insufficient_principal_cpi_leaves_invoice_open_and_balances_unchanged`, dòng263; helper `reject` dòng165 so Snapshot trước/sau | Payer còn AMOUNT−1; transfer lỗi, invoice vẫn Open/paid_slot0, data/owner/rent và principal balances giữ nguyên |
| `[pay,pay]` trong một transaction | `two_pay_instructions_in_one_transaction_roll_back_the_first_transfer`, dòng238 | Có inner instruction, lần pay thứ hai lỗi InvoiceNotOpen; Snapshot khôi phục về trước cả transaction, Open/paid_slot0. Lần pay riêng sau đó thành công, merchant chỉ nhận AMOUNT |
| Pay thành công rồi retry transaction mới | `create_pay_and_fresh_transaction_retry_transfers_principal_only_once`, dòng181; `send` dòng129 | Signature lần retry khác, lỗi InvoiceNotOpen; Snapshot giữ trạng thái Paid sau lần thành công. Chỉ transaction retry thất bại, không hoàn tác transaction trước đã thành công |

Snapshot gồm Invoice(data/owner/lamports) và số dư merchant/payer/attacker, **không gồm fee payer riêng**; không suy mọi lamport đều hoàn lại khi lỗi. `pay_invoice` dòng61–88 kiểm Open trước CPI, ghi Paid sau CPI thành công. Runtime rollback của cả transaction khác với việc handler gặp lỗi trước khi ghi Paid. `pay_cancel_race_is_safe_in_both_serial_orders` dòng352 chỉ kiểm hai thứ tự tuần tự; RPC/reorg/contended execution và browser vẫn chưa kiểm.

Đã giao **T18** hoàn thiện T13 bằng ma trận bằng chứng; ưu tiên **T17→T15→T18** để A tiếp tục phần UX/evidence đã được giao, không phải chờ C cấp lại T17. HANDOFF A/1f59e03 vẫn ghi hết việc/chờ giao T17 dù queue có từ3c51181; ghi tái diễn K8. Giữ nguyên file A, IDEA/ARCHITECTURE/source/tests/IDL và điểm79/F4. Verdict sơ bộ không đóng cổng review chéo, giáo viên hoặc người dùng; không mở Phase3.

## Review đầu ra T17 — 18/11/2026, lượt heartbeat05:10 UTC+7

Pull **adfe081**, đọc [UX tại3475c36](https://github.com/ntbaoheyhey/dev3pack-hackathon/blob/3475c363b75ef1b6a9090a3ab8f6e579b63e9a17/docs/design/receiptrail-ux-antigravity.md), A-done và HANDOFF A. **T17 chưa đạt; không đóng T16-R1–R5.** Python đọc JSON IDL và các hàng UX: **9 hàng, 0 khớp; toàn bộ cặp code–name giữ nguyên từ T16/a27a207**, trong khi5checkbox đã đánh `[x]`. [Kết quả đối chiếu](../evidence/phase2/receiptrail-ux-t17-audit.json) lưu commit, hashes, từng cặp sai/đúng và giới hạn; đây là kiểm tài liệu, không runtime suite.

| Tiêu chí | Quan sát tại3475c36 | Kết luận / yêu cầu T19 |
| --- | --- | --- |
| T16-R1 — chưa đạt | Dòng22–30 sai cả9 cặp; dòng33 lại khẳng định lấy trực tiếp IDL và copy/CTA khớp | Không có bằng chứng cho checkbox này. Lấy `errors` từ JSON, đối chiếu bằng lệnh trong queue; bảng đúng đã có ở review T16/ARCHITECTURE mục5. Giữ nhóm program/Anchor/System/fee/wallet/RPC riêng. |
| T16-R2 — sửa một phần | Bỏ Token Selector ở form, thêm kiểu u64/slot (dòng8); copy vẫn nói token/mint (dòng25,27). Amount chưa ghi đơn vị SOL/lamports; OrderID string chưa nêu mapping ổn định sang invoice_id32; thiếu merchant và terms cụ thể | Giữ cải thiện nhưng chưa đóng finding. Bổ sung đơn vị, recipient và bước review terms/rent/fee; không đổi type/args của contract để khớp form. |
| T16-R3 — chưa đạt | Dòng16 ghép `Open→Pending→Paid/Cancelled/Expired`; dòng35 khẳng định4màn và state tách biệt. Chưa có wireframe desktop/mobile hoặc bảng CTA/commitment/PDA | Tách Invoice/request/Expired rõ ràng, viết bố cục thực tế; xem không ví và Check Status là phần dùng được, chưa đủ nhận. |
| T16-R4 — chưa đạt | Bảng thời lượng của T16 đã bị bỏ; dòng36 chỉ có chuỗi pay/timeout/check/paid kèm nhãn165s | Chưa có storyboard chia thời gian, không có duplicate cùng PDA bằng tx mới hoặc principal/fee proof. Viết lại đủ cảnh và nhãn dự kiến/local, không coi checkbox là demo. |
| T16-R5 — chưa đạt | Dòng37 đánh dấu đã có SDK decision, nhưng toàn file không có mục chọn/bỏ SDK hoặc nguồn | Bổ sung quyết định có nguồn/giới hạn và link tới từng mục đã làm. Sửa checklist theo evidence, phần thiếu phải để chưa đạt. |

Giao **T19** sửa UX, bắt đầu từ dữ liệu IDL và checklist kiểm được; thứ tự **T15→T18→T19**, T15/T18 đã có quyền làm tài liệu. HANDOFF A/adfe081 vẫn ghi hết việc/chờ C giao T15; parent của3475c36 là138ef25, đã chứa T15/T18, ghi tái diễn K8. Không sửa file A hoặc đưa mapping/state sai vào IDEA/ARCHITECTURE/source/IDL, không đổi điểm. Cổng Phase2 giữ nguyên; không cài/code/deploy/public hoặc rerun runtime suite.

## Review đầu ra T15 — 18/11/2026, 05:21 UTC+7

Đã fetch/pull tới **7ae2643**, đọc [report T15 tại 0ec4e94](https://github.com/ntbaoheyhey/dev3pack-hackathon/blob/0ec4e94b696769861d6b4ec67f77f36f384c746c/docs/data/receiptrail-evidence.md), A-done và HANDOFF A. **T15 chưa đạt; không đóng T14-R1–R4.** Các dòng dưới đây thuộc snapshot 0ec4e94. Python standard library kiểm report có **26 dòng, 3 hàng alternatives, 0 URL HTTP(S)**; SHA256 `870c015d78317f61934593c0e571782f36d6fb4b5e71acd22011fe26bc0d3ba1`. Hai URL trong T14/b5092a4 cũng đã bị bỏ. Đếm URL chỉ kiểm khả năng truy nguồn của tài liệu, không xác minh nội dung website; C chưa mở lại nguồn bên ngoài trong lượt này.

| Finding trước | Quan sát T15 | Kết luận và phần cần sửa qua T20 |
| --- | --- | --- |
| T14-R1 — sửa một phần | Dòng7–14 đã tách Invoice/Request, ghi Expired suy từ slot; vẫn đặt Expired dưới Invoice Status, Cancelled là “người dùng đã hủy”, Unknown chỉ nói query on-chain | Invoice lưu đúng Open/Paid/Cancelled; Expired là nhãn `Open && observed_slot >= expires_slot`. Chỉ merchant ký cancel. Chỉ rõ đọc Invoice PDA đã lưu cùng program/cluster/commitment, signature nếu có; không dùng reference thay PDA, không tự ký lại khi Unknown. |
| T14-R2 — sửa một phần | Dòng24–25 bỏ câu bảo đảm idempotent, nhận biết issue452 thuộc EVM; đổi thành Solana Pay “cơ bản”/Solana Foundation Pay “đầy đủ” nhưng không có nguồn hay cơ chế | Bỏ nhãn khái quát không kiểm được; mô tả riêng hai dự án bằng nguồn đích. Issue452 cần URL, claim/giới hạn nonce đã dùng theo review T14; không suy double-payment hoặc lỗi Solana hiện hành. |
| T14-R3 — chưa đạt | Dòng26 chỉ khẳng định đã bổ sung ledger; không nêu tác giả, URL, đoạn nguồn hay hai pain reports | Liệt kê từng nguồn độc lập thật, claim và giới hạn. Note021 là đầu mối tra nguồn, không phải nguồn pain mới của A; thiếu nguồn thứ hai thì ghi tiêu chí chưa đạt. |
| T14-R4 — chưa đạt | Dòng17–21 có ba alternatives nhưng cả ba thiếu URL/ngày mở/tác động thiết kế; “dễ bị nhầm” không phải giới hạn cơ chế Solana Pay | Mỗi alternative cần URL nguồn đích, ngày thực sự mở, cơ chế được nguồn hỗ trợ, giới hạn và tác động tới ReceiptRail. Đọc note cũ không được ghi như đã crawl nguồn mới. |

Giữ phần cải thiện: tách hai nhóm state và thu hẹp issue452 về EVM. Report chưa đủ evidence để đổi điểm79/F4 hoặc thiết kế. `git diff 8f84cfe HEAD` xác nhận source/tests/IDL ReceiptRail không đổi; không rerun runtime tests. Không sửa report/A-done/HANDOFF A, IDEA/ARCHITECTURE hoặc score.

HANDOFF A/7ae2643 ghi “T15 xong. Hết việc” trong khi T18/T19 đã có tại f0c5527, ancestor của 0ec4e94; ghi tái diễn K8. A tiếp tục **T18 → T19 → T20**: giữ hai việc đã giao, sửa evidence sau đó bằng bảng nguồn cụ thể. Không cần C cấp lại quyền tài liệu; thiếu nguồn không là quyền cài/deploy/public hoặc tự đóng cổng Phase2. Cổng người dùng/giáo viên giữ nguyên.

## Review T18–T20 — 18/11/2026, heartbeat05:42 UTC+7

Pull **f49716a** gồm [T18/073d781](https://github.com/ntbaoheyhey/dev3pack-hackathon/blob/073d78190a394df2bb7f8112033537470e99cb1d/docs/reviews/receiptrail-antigravity.md), [T19/03c0bac](https://github.com/ntbaoheyhey/dev3pack-hackathon/blob/03c0bac0edb9a59f0ba8ea75c7820978b4eba742/docs/design/receiptrail-ux-antigravity.md), [T20/337322b](https://github.com/ntbaoheyhey/dev3pack-hackathon/blob/337322bdd75998ba435a9bb82c91313304b34c19/docs/data/receiptrail-evidence.md). **Chưa nhận ba task đạt toàn bộ.** Số dòng bên dưới thuộc từng snapshot này. [Audit T18–T20](../evidence/phase2/receiptrail-reviews-t18-t20-audit.json) lưu commits/hashes, tên test,9 cặp lỗi và5 URL. Source/tests/IDL vẫn khớp3 hashes metadata; C đọc các assertions và log r2 cũ, **không rerun runtime suite**. Audit T17 giữ nguyên như snapshot lịch sử.

### T18: có ma trận nhưng chưa truy được bằng chứng

| Finding | Quan sát tại073d781 | Phần cần sửa T21 |
| --- | --- | --- |
| T18-R1 — cao: dẫn test không tồn tại | Dòng12 dẫn `test_duplicate`; không có hàm này trong runtime.rs hoặc log r2. Dòng27 gọi runtime.rs là nơi chứa log | Dẫn tên hàm thật, assertion cụ thể và đường dẫn log thật. Bảng3 ca đã có ở mục giải thích rollback của C; không đổi source/test để khớp report. |
| T18-R2 — cao: đối chiếu sai ba ca rollback | Dòng21–24 nói đối chiếu review C nhưng thay hai pay cùng tx/retry mới bằng signer sai/expiry; “không có thay đổi on-chain” không tách phí | Ba ca đúng: CPI thiếu principal; `[pay,pay]` rollback cả tx; retry tx mới giữ Paid của tx trước. Signer/expiry là ca âm khác. Snapshot không chứa fee payer riêng, không nói mọi lamport đều hoàn lại. |
| T18-R3 — vừa: ma trận/giới hạn chưa đủ | Dòng9–13 chỉ kết luận Đạt; thiếu seeds/authority/owner/type/version/expiry boundary/terminal/receipt trust và assertion/log cụ thể. Dòng10 gộp has_one với signer; dòng28 kết luận đủ triển khai và xử lý race | Phân biệt `Signer` với `has_one`; ghi phần thực sự kiểm và phần chưa kiểm ở từng nhóm. `send` gọi expire_blockhash trước mỗi submission; test race chỉ hai thứ tự serial. Không suy thành review chéo đã đạt, quyền triển khai hoặc coverage mạng. Trả lời T13-R1–R4 đúng mã. |

Điểm tiến bộ: bỏ claim nonce, mô tả Open check và CPI+Paid cùng transaction. Giữ cải thiện này; không xem năm ô Đạt là bằng chứng cho toàn bộ phạm vi. Review C vẫn là tự review, không thay review độc lập.

### T19: nhận9/9 cặp mã–tên; phần UX còn mở

Python đọc JSON IDL và bảng UX: **9 hàng,9 khớp**,5checkbox đã tick. Đây là tiến bộ đã kiểm độc lập; C không xác nhận A thực sự chạy script chỉ từ câu báo trong A-done (chưa có output kèm report). Không yêu cầu sửa lại các tên lỗi đã đúng.

| Tiêu chí | Kết luận tại03c0bac | Phần còn thiếu T22 |
| --- | --- | --- |
| T16-R1 | Đạt phần code/name; chưa đạt copy/CTA và namespace | Dòng23/27 đề nghị tạo invoice mới thiếu điều kiện;6001 phải xác định create cũ chưa thành công,6005 liên hệ merchant.6004 cần đọc lại Paid/Cancelled;6008 phải không ký. Tách program ID+code và Anchor/System/fee/wallet/RPC theo ARCHITECTURE mục5. |
| T16-R2 | Bỏ token/mint là tiến bộ; form vẫn chưa đủ | Dòng8 không có đơn vị SOL/lamports, mapping OrderID string→invoice_id32 ổn định hoặc merchant. Thiếu terms bất biến và phân biệt rent create/principal+fee pay. |
| T16-R3 | Chưa đạt | Dòng16 vẫn ghép Open→Pending→Paid/Cancelled/Expired; chưa có bố cục desktop/mobile4màn, bảng CTA/commitment/PDA. Checkbox dòng36 không thay wireframe. |
| T16-R4 | Chưa đạt | Dòng37 chỉ chuỗi flow gắn nhãn165s; thiếu chia thời gian, duplicate tx/signature mới cùng PDA và principal một amount/phí fail. |
| T16-R5 | Chưa đạt | Dòng38 vẫn tick SDK hoàn thiện nhưng không có mục chọn/bỏ hoặc nguồn. Sửa checklist theo từng phần thực có, không đóng toàn UX từ9/9 mã. |

### T20: nguồn đã có, diễn giải/phản hồi chưa đạt

C đã mở lại **5 đích thật** trong lượt này: Shopify/Stripe/Solana Pay bằng web, issue452 và payment_identifier qua GitHub connector. Việc C truy cập được không chứng minh A đã đọc chúng; ngày truy cập A trong report là lời A báo. Không chạy các implementation hoặc khẳng định lỗi còn tồn tại ở phiên bản hiện hành.

| Nguồn đã đọc | Kết luận được nguồn hỗ trợ / giới hạn |
| --- | --- |
| [Shopify, Todd Jefferson,27/08/2019](https://shopify.engineering/building-resilient-graphql-apis-using-idempotency) | Payment Service giải quyết outcome chưa rõ sau timeout và nguy cơ charge lại; bài của Money Infrastructure, không báo cáo lỗi “trùng đơn” cụ thể hay nhu cầu Solana/custom program. |
| [x402 issue452,winor30,11/10/2025](https://github.com/x402-foundation/x402/issues/452) | Body nói EIP/ERC-3009: nonce đã dùng khiến retry trả AuthorizationUsed, app khó phân biệt đã settle với thất bại. Không chứng minh cùng payload bị trừ tiền hai lần hoặc lỗi Solana hiện hành; lượt này đọc body, không comments. |
| [Stripe idempotent requests](https://docs.stripe.com/api/idempotent_requests) | API v1 lưu status/body sau khi execution bắt đầu; cùng key trả kết quả đã lưu, so parameters, key có thể bị prune sau ít nhất24h. Không khái quát các chi tiết v1 sang v2 hoặc thành cam kết invoice on-chain. |
| [Solana Pay spec v1.1,Reference](https://solana.com/docs/tools/solana-pay/specification/version1-1#reference) | Reference phục vụ tra cứu transaction và không bắt buộc unique; không tự enforce trạng thái Invoice Paid. Giới hạn cần so sánh là cơ chế này, không chỉ việc khác tên Solana Foundation Pay. |
| [x402 payment_identifier](https://github.com/x402-foundation/x402/blob/main/specs/extensions/payment_identifier.md),blob e85f0d53101aa7a4246b01d9f31f0e2b1ba24f12 | Spec có idempotency key, cached response, fingerprint bind terms và409 khi khác payload. Chưa chạy implementation; không được quảng bá retry/dedup như phần chưa có ở x402. |

Shopify và issue452 là hai nguồn độc lập về bài toán retry/outcome, **không là hai bằng chứng Solana double-payment hoặc adoption ReceiptRail**. Report T20 chưa diễn giải đúng giới hạn này, nên không nhận checkbox/báo “xong” thay phần còn thiếu.

| Finding | Quan sát tại337322b | Phần cần sửa T23 |
| --- | --- | --- |
| T20-R1 — vừa: thiếu claim/giới hạn/tác động thiết kế | Dòng8–10 có URL/ngày, nhưng chỉ nhãn cơ chế và giới hạn chung | Bổ sung cơ chế nguồn thật hỗ trợ, giới hạn đúng và tác động so sánh ReceiptRail; không suy có URL là claim đã được chứng minh. |
| T20-R2 — cao: pain bị diễn giải thiếu/sai phạm vi | Dòng15 gọi “trùng đơn”, dòng16 chỉ “Replay trap”/Blockchain-x402, bỏ nhãn EVM củaT15 | Ghi tác giả/ngày bài/ngày đọc, nội dung outcome/nonce đúng ở trên; phân biệt lịch sử/EVM, không gọi lỗi Solana hiện hành. |
| T20-R3 — vừa: đổi mã finding và chưa có bảng state | Dòng19–22 gán R1=Alternatives/R2=Pain/R3=Replay/R4=State, sai mã T14 gốc; dòng22 khẳng định tách state nhưng mục state/PDA/authority/commitment không còn | Trả lời đúng T14-R1=state/PDA,R2=idempotency claims,R3=pain,R4=alternatives và trỏ vị trí thực. Viết bảng Invoice/request/Expired/CTA; câu xác nhận chưa thay nội dung. |

Đã giao **T21 → T22 → T23**, chỉ sửa tài liệu A; queue hiện hành rút gọn, bản cũ giữ archive. K8 ghi claim test/checklist/findings không khớp evidence; lần này A đã nộp cả ba việc đang mở, nên **không coi câu hết việc ở f49716a là bỏ sót task chưa nộp**. Các báo “xong” vẫn chưa tương đương C nhận đạt. Giữ IDEA/ARCHITECTURE/source/IDL/điểm, không mở Phase3 hoặc cổng người dùng/giáo viên.

## Review T21 — 18/11/2026, heartbeat06:13 UTC+7

Pull **d5436c2**, đọc [T21/6921d5a](https://github.com/ntbaoheyhey/dev3pack-hackathon/blob/6921d5a96124f82815b56631dff82949199b947e/docs/reviews/receiptrail-antigravity.md). Snapshot26dòng có SHA256 `6aca1f3434fe5245f1ef21e77fd73c3f4eee70b1d3e52e5a9bec3b55620575d5`. Python đối chiếu3tên ở dòng19–21 với [runtime.rs](../../programs/receiptrail/tests/runtime.rs) và [log r2](../evidence/phase2/receiptrail-spike-r2.txt): **3/3 tồn tại và có trong log**; hàm lần lượt ở dòng263/238/181. `test_duplicate` đã bỏ; nhận phần sửa tên test này, không tiếp tục mô tả report hiện hành còn tên giả. Source/tests/IDL/log không đổi từ checkpoint5725b75; chỉ đọc lại source/assertions, không rerun suite.

**T21 chưa nhận đạt toàn bộ.** Ma trận vẫn chưa có assertion/log đủ kiểm, mô tả has_one sai vai trò; ba tên đúng chưa giải thích ranh giới rollback hoặc giới hạn phí. Những câu “Đạt/đã hoàn thiện” ở report không thay review chéo theo cổng ra.

| Finding | Vị trí6921d5a | Phần còn thiếu qua T24 |
| --- | --- | --- |
| T21-R1 — cao: nhầm authority checks | Dòng10 vẫn ghi has_one check signer/merchant/payer | Trong `PayInvoice`, `payer: Signer` kiểm signer; has_one so public key với field invoice, merchant là `SystemAccount`, không cần signer cho pay. `CancelInvoice` dùng merchant Signer+has_one. Dẫn đúng struct/field và test thiếu chữ ký/sai payer/recipient; không coi has_one tự chứng minh chữ ký. |
| T21-R2 — vừa: tên đúng nhưng thiếu assertion/kết quả/fee boundary | Dòng9–13,18–21 chỉ ghi kích thước/điều kiện/tên test; dòng12 dùng Open→Paid cho cả rollback | Bảng3ca phải có trạng thái/principal trước-sau, assertion, dòng log và phần không kiểm. Hai pay cùng tx trả về Open; retry tx mới giữ Paid của tx trước. Snapshot không gồm fee payer. Hoàn thiện5nhóm đã giao, gồm canonical bump, owner/type/version, cancel sau expiry/terminal và receipt trust. |
| T21-R3 — vừa: giới hạn freshness/race/receipt chưa rõ | Dòng16 chỉ nói recent_blockhash đảm bảo duy nhất; dòng22 gọi settlement on-chain, chỉ loại trừ delivery | Dẫn expire_blockhash mỗi submission và assert signature khác; chỉ hai thứ tự serial được test, không nói mọi race chỉ xảy ra tuần tự trong VM. Receipt trong evidence hiện là local; cần commitment/RPC/upgrade/rent và giới hạn cùng invoiceID. Bỏ câu đủ review nếu các phần còn thiếu; phản hồi cả T18-R1–R3 ngoài T13-R1–R4. |

Giữ tiến bộ: seeds được nêu, ba ca đúng tên, bỏ nonce và lời đủ điều kiện triển khai. Không đóng toàn T18-R1/R2 chỉ từ tên đúng vì đường dẫn/log/assertion và phạm vi còn thiếu. HANDOFF A/d5436c2 đã ghi đang tiếp tục **T22**, đúng queue; không ghi thêm lỗi “hết việc” cho lượt này. C giao T24 sau T22/T23, không làm A bỏ việc UX đang thực hiện. Giữ report A, thiết kế C/contract/điểm; cổng giáo viên/người dùng chưa mở.

## Review T22 — 18/11/2026, heartbeat06:58 UTC+7

Fetch/pull tại **3d7ca13**, đọc [UX T22/e2ef270](https://github.com/ntbaoheyhey/dev3pack-hackathon/blob/e2ef270338a205b8be3a32400a74f660b0b90d2e/docs/design/receiptrail-ux-antigravity.md). Snapshot42dòng có SHA256 `4a1956a6999a446eb6d494124ed9c8af640d5a6d7584cf98d4de9ad43cd105df`. Python đối chiếu bảng với [IDL](../idl/receiptrail.json): **9/9 mã–tên đúng**,5checkbox tick,0 URL HTTP(S). Đã đọc cả42dòng và đối chiếu [ARCHITECTURE mục4–6](../ARCHITECTURE.md), [source](../../programs/receiptrail/src/lib.rs), [demo IDEA](../IDEA.md); số đếm không thay review nội dung. Source/tests/IDL/thiết kế/điểm/evidence không đổi từf96e9d2; không rerun runtime suite hoặc kiểm browser.

**Nhận phần cải thiện:** amount đã ghi u64 lamports, expiry là u64 slot; CTA6000/6001 chỉ rõ amount>0/hạn tương lai; Cancelled ghi do merchant; Unknown nhắc PDA/program; tiêu đề đã đổi T22. Giữ phần9/9 code–name đã đạt từT19. **Chưa nhận toàn bộ UX**, vì checklist dòng38–42 vẫn khẳng định những nội dung chưa có hoặc chưa đúng:

| Finding | Bằng chứng trong T22 | Nội dung cần sửa / tiêu chí nhận |
| --- | --- | --- |
| T22-R1 — cao: copy/CTA chưa theo contract | Dòng31–35:6004 thiếu đọc lại state;6005 dẫn thẳng sang tạo invoice mới;6007 thiếu dừng/tải lại;6008 bị gọi là sai phiên bản IDL. Không có namespace hoặc nhóm lỗi ngoài custom. | Source dòng121/135 kiểm `invoice.version == VERSION`, không kiểm phiên bản IDL. Lỗi6008 cần dừng ký khi không hỗ trợ, không suy đổi IDL/cập nhật app sẽ giải quyết.6004 đọc Paid/Cancelled,6005 dừng pay/liên hệ merchant; điều khoản mới là việc riêng, không đổi ID để retry.6007 dừng/tải lại recipient. Bảng đủ program ID+code; Anchor/System/fee/wallet/RPC có xử lý riêng, Unknown không tự gửi lại. |
| T22-R2 — vừa: form/tiền chưa đủ để triển khai | Dòng8 ghi OrderID(string32) nhưng không mapping tới invoice_id[32]; dòng9/15 gom Fee/Principal/Rent. Merchant/recipient, terms bất biến và chuyển SOL→integer chưa được diễn đạt. | Ghi cách tạo/lưu/tái dùng đúng32bytes cho cùng đơn; phân biệt chuỗi với bytes. Hiện merchant/payer/amount/expiry trước ký; amount SOL parse bằng integer tối đa9số thập phân, u64 không JS Number. Merchant trả rent+fee khi create; pay chuyển principal+fee, không tạo lại rent invoice. Terms sau create không đổi. |
| T22-R3 — cao: state/commitment vẫn trộn, thiếu wireframes | Dòng16–22 đặt Pending cùng Open/Paid/Cancelled, định nghĩa Paid là finalized và Expired chỉ là hết slot. Dòng40 gọi đủ4màn/desktop-mobile nhưng chưa có8bố cục. | Tách Invoice Open/Paid/Cancelled, Expired chỉ khi Open và slot>=expiry; request Pending/Unknown riêng. Paid đọc ở confirmed vẫn cần nhãn commitment/chờ finalized. Mỗi4màn có desktop/mobile, nguồn cùng PDA+program+cluster, commitment và CTA; Unknown đọc lại, không tự ký/gửi hoặc đổi invoiceID; receipt không suy signature từ account. |
| T22-R4 — vừa: storyboard mới là một chuỗi tên trạng thái | Dòng41 không chia thời lượng, không có duplicate tx mới/principal/fee proof. | Bảng cảnh/thời gian/hành động/bằng chứng cộng165giây; mất response giả lập có nhãn, đọc cùng PDA; tx/signature mới bị InvoiceNotOpen, principal chỉ một amount và phí fail riêng. Ghi kế hoạch/replay local, không khai wallet/RPC/devnet thật. |
| T22-R5 — vừa: lựa chọn SDK/checklist chưa có căn cứ | Dòng42 chỉ nêu web3.js+wallet-adapter-react;0 URL, không phiên bản, lý do chọn/bỏ hoặc giới hạn; cả5ô vẫn tick. | Bảng SDK/phiên bản hay mốc source/lý do chọn-bỏ/nguồn/ngày đọc/giới hạn; đối chiếu React/Vite/Wallet Standard trong ARCHITECTURE mục6. Chưa kiểm tương thích thì ghi chưa kiểm, không lấy version lịch sử note005 làm bằng chứng đã chạy. Checklist trỏ mục thực có và phản hồi T16-R1–R5 cùng T22-R1–R5; thiếu thì đánh chưa đạt. |

Không nhận dòng42 thành quyết định kỹ thuật mới hoặc quyền cài. C giao **T25** sửa các phần trên **sau T23→T24**, giữ thứ tự hai việc đã giao. HANDOFF A/3d7ca13 đã ghi đang làmT23 đúng queue; không có lỗi “hết việc” trong lượt này. C giữ file A/audit lịch sử/IDEA/ARCHITECTURE/source/IDL/điểm79/F4, ghi K8 về checklist chưa được chứng minh; cổng review chéo/giáo viên/người dùng chưa mở.

### Bổ sung T22 v2 — 18/11/2026, heartbeat07:28 UTC+7

Pull **bfa184c**, đọc [UX49dòng tại commit này](https://github.com/ntbaoheyhey/dev3pack-hackathon/blob/bfa184cb41cb2120dce13115f0e9b061579e4991/docs/design/receiptrail-ux-antigravity.md), SHA256 `28a9cd372916b4e67470c92d53ceb10d79d61b2552288a7285753d05d327bbbf`. Python kiểm **9/9 mã–tên đúng**,5checkbox tick,0URL HTTP(S); **36dòng đầu giữ nguyên** so với e2ef270. Snapshot42dòng/hashes ở review06:58 là lịch sử, không sửa đè để mô tả bản49dòng.

Nhận phần bổ sung dòng37–42: đã liệt kê4màn cùng nội dung ngắn; receipt chỉ dẫn Explorer khi có signature. Đây vẫn là4mô tả một dòng, chưa có8bố cục desktop/mobile, vị trí fields, CTA theo trạng thái hoặc nguồn/commitment từng màn. T22-R3 cải thiện một phần; không còn mô tả file hiện hành là hoàn toàn không có danh sách màn hình.

T22-R1/R2 và phần state củaR3 giữ nguyên vì36dòng đầu không đổi:6008 vẫn gọi sai phiên bản IDL,6005 vẫn dẫn tạo invoice mới, Pending/Paid/Expired vẫn trộn request/state/commitment; mapping32bytes và tách rent/principal/fee còn thiếu. Dòng48 vẫn chỉ là chuỗi trạng thái, chưa có storyboard thời lượng/bằng chứng theoR4.

Dòng49 bổ sung “Source: ARCHITECTURE mục6 và note014”, nhưng [ARCHITECTURE mục6](../ARCHITECTURE.md#6-off-chain-retry-và-ux) chọn React/Vite/Wallet Standard hiện có, chưa chọn web3.js+wallet-adapter-react; [note014](../learning/014-sponsor-sdks.md) bàn chọn/bỏ sponsor SDK, không quyết định hai package đó. Đã đọc nội dung liên quan và kiểm cả hai file không nêu tên hai package; không coi ghi tên tài liệu là chứng minh compatibility, version hay lý do chọn. **T22-R5 còn mở**;5checkbox vẫn chưa phản ánh phần thiếu.

Giữ **T23→T24→T25**, bổ sung v2 vào T25 hiện có, không tạo task UX trùng. Parent4f12caa của bfa184c đã có queue này; commit mới là nộp lạiT22, chưa có kết quảT23/T24. HANDOFF A vẫn ghi đang làmT23; không suy “hết việc” hoặc nguyên nhân nội bộ. Source/tests/IDL/thiết kế/điểm/evidence không đổi từ4f12caa, chỉ review tài liệu; các cổng duyệt và giới hạn vận hành giữ nguyên.

## Review T23 — 18/11/2026, heartbeat07:58 UTC+7

Pull **a9c7db9**, đọc [reportT23/a82490a](https://github.com/ntbaoheyhey/dev3pack-hackathon/blob/a82490aba1ab3e04ac79d7abcdef1af4aa3f723d/docs/data/receiptrail-evidence.md),27dòng,5URL đích, SHA256 `981e58fbdb7c41f57dbae8f78fbf8d06cae69caed014a58aaa2a41c4a8d5aac9`. C mở lại cả5nguồn: Stripe/Shopify/Solana Pay qua web, issue452 và payment_identifier qua GitHub. Spec vẫn là blob `e85f0d53101aa7a4246b01d9f31f0e2b1ba24f12`; chỉ đọc body issue, không comments hoặc chạy implementation. Ngày kiểm trong report là lời A báo; việc C mở được không xác minh A đã crawl.

**Nhận phần cải thiện:** đã có cột tác động alternatives; tác giả/ngày Shopify và issue452 khớp nguồn; issue452 ghi rõ EIP-3009/EVM, không phải Solana hiện tại. Mục3 đã có nhóm Invoice và request riêng, Expired ghi suy từ Open+slot, đường đọc là Invoice PDA. Không tiếp tục mô tả report hiện hành thiếu hoàn toàn các mục này nhưT20. **Chưa nhậnT23 toàn bộ**:

| Finding | Quan sát tại a82490a | Cần sửa / bằng chứng đối chiếu |
| --- | --- | --- |
| T23-R1 — vừa: bảng alternatives thiếu cơ chế và dùng sai thuật ngữ | Dòng8 chỉ ghi server-side, so PDA với API key; dòng9 ghi “Không unique”; dòng10 chỉ application-level. | [Stripe](https://docs.stripe.com/api/idempotent_requests) dùng **idempotency key**, khác khóa xác thực API; cần phân biệt v1 lưu response sau execution/retention và v2 retry semantics. [Solana Pay Reference](https://solana.com/docs/tools/solana-pay/specification/version1-1#reference) **không bắt buộc** unique, có thể unique; dùng tra cứu transaction, không tự cưỡng chế Invoice Paid. [x402 spec](https://github.com/x402-foundation/x402/blob/main/specs/extensions/payment_identifier.md) đã có key/cache/fingerprint/409 tại resource server/facilitator. So sánh phải nêu cơ chế và giới hạn cụ thể; PDA cần program state/invariant, không tự chứng minh giá trị vượt alternatives. |
| T23-R2 — cao: diễn giải pain vẫn chưa khớp nguồn | Dòng15 giữ “Idempotency lỗi gây trùng đơn”; dòng16 mới chỉ “Replay trap”; chưa có ngày A đọc từng pain source. | [Shopify](https://shopify.engineering/building-resilient-graphql-apis-using-idempotency) mô tả charge outcome chưa rõ sau timeout và nguy cơ charge lại nếu retry thiếu idempotency, không báo một lỗi trùng đơn cụ thể. [Issue452](https://github.com/x402-foundation/x402/issues/452) mô tả nonce đã tiêu thụ→AuthorizationUsed khiến app khó phân biệt đã settle với lỗi; không chứng minh trừ tiền hai lần. Giữ tác giả/ngày đã đúng, thêm nội dung/giới hạn/ngày thực đọc; hai nguồn về retry không chứng minh adoption ReceiptRail. |
| T23-R3 — vừa: gộp/sai mã finding và state thiếu điều kiện/CTA | Dòng24 gộpT14-R1/R4 thành alternatives;25 gộpR2/R3 thành pain;26 đổiT20-R1 thành State/PDA. Dòng19–21 chưa có merchant authority, commitment, cluster/program hoặc xử lý Unknown. | T14: **R1=state/PDA,R2=idempotency claim,R3=pain,R4=alternatives**; T20: **R1=alternatives,R2=pain,R3=mapping findings/state**. Trả từng ID bằng vị trí đã sửa. Expired chỉ là hiển thị khi Open và observed_slot>=expires_slot; merchant cancel, Paid có commitment riêng; request Pending/Unknown không thay Invoice state. Đọc cùng PDA/program/cluster/owner/commitment, signature nếu có; Unknown không tự ký/gửi hoặc tạo ID mới. |

C giao **T26** sửaT23 **sau T24→T25**; giữ hai việc đã giao. HANDOFF A/a9c7db9 đã chuyển đang làmT24 đúng queue, không có lỗi hết việc. Source/tests/IDL/IDEA/ARCHITECTURE/điểm/logs spike/audit và hai report UX/reviewA không đổi từcf62e05; không rerun suite hoặc mở Phase3. Không tăng điểm từ việc thêm URL/cột/tác giả và không nhận báo nộp thành cổng duyệt.

### Bổ sung T23 v2 trước checkpoint

Trong lúc kiểm PR, remote lên **2f1cde0**; đã fetch/pull fast-forward, giữ8fileC đang sửa. [Report769d365](https://github.com/ntbaoheyhey/dev3pack-hackathon/blob/769d365fa9c33040e947650403a5154e1479cbf8/docs/data/receiptrail-evidence.md) vẫn27dòng/5URL, SHA256 `55e0724d55bb00ebff0101ecb5770940837faab9bc30c4763afecd616a26a5a1`. Snapshot a82490a bên trên giữ lịch sử; nhận cải thiện dòng9 từ “Không unique” sang “Không đảm bảo tính duy nhất”. Cơ chế còn thiếu trongR1, painR2 và mappingR3 chưa sửa; không coi phần từ ngữ đúng hơn là toàn bảng đã đạt.

Dòng19 có lỗi mới thuộc **T23-R3**: Expired dùng `slot > expiry` và Paid được định nghĩa “Đã finalized”. [Source](../../programs/receiptrail/src/lib.rs) dòng65 yêu cầu `slot < expires_slot`; [test expiry_boundary_before_at_and_after](../../programs/receiptrail/tests/runtime.rs) dòng321 thử expiry−1/expiry/expiry+1, đúng expiry đã trả InvoiceExpired và giữ Open; [log r2](../evidence/phase2/receiptrail-spike-r2.txt) dòng25 ghi pass. Vì vậy hiển thị Expired phải là Open và `observed_slot >= expires_slot`; state Paid tách khỏi commitment như ARCHITECTURE mục1/6. Đây là đọc code/assertion/log cũ, không chạy lại test hoặc đổi contract.

T26 tiếp tục trên bản769d365, bổ sung bảng3mốc expiry và commitment/CTA; không tạo task trùng. HANDOFF A/2f1cde0 vẫnT24, chưa có kết quảT24/T25. Giữ số điểm và cổng; không nhập lỗi report vào thiết kế/source.

## Review T24 — 18/11/2026, heartbeat08:30 UTC+7

Fetch/pull **6eee5ac1876c1ffbe91479b8bfdac9f5b09470bc**, đọc toàn bộ [report T24/7325169](https://github.com/ntbaoheyhey/dev3pack-hackathon/blob/73251698715d1d0876f1e8d3f6165d88732dde6a/docs/reviews/receiptrail-antigravity.md): 31 dòng, SHA256 `6a2155e29439d284d2a6ce5e3f4b5fc885f304e5d16b7ee90705d32471c99247`. Report hiện hành khác T21 hợp lệ do A nộp T24; không tiếp tục khẳng định report review A bất biến từ cf62e05. Snapshot T21/T23 bên trên giữ đúng mốc lịch sử.

**Nhận phần cải thiện:** dòng17–18 tách payer Signer/has_one ở pay và merchant Signer/has_one ở cancel; dòng24 nói hai pay cùng transaction trở về Open; dòng27 dẫn `expire_blockhash`, không durable nonce. Không dùng lại lỗi “has_one kiểm chữ ký” của T21 để mô tả bản mới. **Chưa nhận toàn bộ T24** vì các kết luận vẫn thiếu bằng chứng và ranh giới dưới đây.

| Finding | Vị trí report T24 | Kết luận và phần còn thiếu qua T27 |
| --- | --- | --- |
| T24-R1 — vừa: authority/recipient chưa đủ bằng chứng | Dòng10,17–18 | Phần đã sửa đúng, nhưng thiếu merchant ở pay là `SystemAccount` nhận principal, không phải signer; `has_one = merchant` khóa recipient. [Source](../../programs/receiptrail/src/lib.rs) dòng116–137; [tests](../../programs/receiptrail/tests/runtime.rs) dòng273/281/289/297/313 và helper `reject`165. Dẫn điều kiện lỗi WrongPayer/WrongMerchant/AccountNotSigner cùng assertion Snapshot và dòng log22/28/33/35/42, không chỉ ghi verified. |
| T24-R2 — vừa: baseline retry và bảng rollback chưa kiểm được | Dòng21–25 | Ba số dòng263/238/181 đúng, tên rút gọn bằng `...` nên cần ghi đủ. Dòng25 ghi trước Open nhưng **ngay trước transaction retry thất bại invoice đã Paid**; Open là trước transaction pay thành công trước đó. Cần tách hai transaction và principal, assertion/log như bảng dưới; Snapshot không gồm fee payer. |
| T24-R3 — vừa: ma trận/giới hạn và phản hồi chưa đủ | Dòng9–13,27,30–31 | Năm nhóm chỉ ghi verified/r2, thiếu dẫn chứng từng nhóm và phần chưa kiểm. `send`129–145 gọi expire_blockhash131; signature khác được assert228; race352 chỉ hai thứ tự serial. `paid_slot` local không xác nhận RPC/commitment/upgrade/rent hay ngăn merchant dùng ID khác. Phản hồi từng T13-R1–R4, T18-R1–R3, T21-R1–R3 bằng vị trí thực; câu “review hoàn tất” chưa đủ đóng cổng review chéo. |

Bảng đối chiếu đọc từ [runtime.rs](../../programs/receiptrail/tests/runtime.rs) và [log r2](../evidence/phase2/receiptrail-spike-r2.txt), **không chạy test mới**:

| Hàm đầy đủ / dòng source | Ngay trước transaction thất bại | Assertion và kết quả sau lỗi | Dòng log r2 |
| --- | --- | --- | --- |
| `insufficient_principal_cpi_leaves_invoice_open_and_balances_unchanged` /263 | Open/paid_slot0; payer chỉ còn AMOUNT−1 | `reject`165–176 kiểm insufficient lamports và Snapshot bằng trước;269 giữ Open/0. Principal và Invoice data/owner/rent không đổi | 26: ok |
| `two_pay_instructions_in_one_transaction_roll_back_the_first_transfer` /238 | Open/paid_slot0, trước cả transaction chứa `[pay,pay]` | 241 lỗi InvoiceNotOpen;250–254 có inner instruction;255–257 Snapshot bằng trước, Open/0. Transfer đầu bị rollback;258–259 một pay riêng sau đó mới chuyển AMOUNT | 39: ok |
| `create_pay_and_fresh_transaction_retry_transfers_principal_only_once` /181 | **Paid/paid_slot100**, merchant đã nhận AMOUNT, payer đã trả AMOUNT từ transaction thành công ở217–225; baseline `once`226 | 227–233 retry bằng transaction mới lỗi InvoiceNotOpen;228 assert signature khác;233 Snapshot bằng `once`. Không hoàn tác transaction trước; không chuyển principal lần hai | 23: METRIC, **24: ok** |

Snapshot26–31/148–157 chỉ gồm Invoice(data/owner/lamports), merchant/payer/attacker; fee payer riêng được chọn ở134 và không nằm trong Snapshot. Các assertions trên không chứng minh hoàn lại phí thất bại. Log r2 dòng23/29 in METRIC trước dòng ok kế tiếp; script đối chiếu ban đầu đòi một dòng nên AssertionError. Đã sửa parser đọc hai dòng và đối chiếu đủ **19 kết quả trong log hiện có**, ba ca đúng source263/238/181 và log26/39/23–24. Đây là sửa cách kiểm tài liệu, không phải runtime failure hoặc suite vừa chạy lại.

HANDOFF A tại6eee5ac ghi T24 đã nộp, **đang T25**. Giữ T25/T26, giao **T27 sau T26** để hoàn thiện phần còn thiếu; không yêu cầu A làm lại các phần đã đúng. C giữ source/tests/IDL/IDEA/ARCHITECTURE/điểm/logs và file A; không rerun runtime suite, không mở Phase3 hoặc tự nhận cổng người dùng/giáo viên đạt.

## Review T25 — 18/11/2026, heartbeat09:00 UTC+7

Pull **9e7275e554333ae5b07817a7a602cbee3f9069fb**, đọc toàn bộ [UX T25/33b71e7](https://github.com/ntbaoheyhey/dev3pack-hackathon/blob/33b71e7a7c953f59ad9631aeae8f612f2086c02a/docs/design/receiptrail-ux-antigravity.md): 62 dòng, SHA256 `f6fd23abdccb8151eaa3a34a886f345f3fa53a2588d96831263d3a5fe6d22a9c`. Python đọc JSON [IDL](../idl/receiptrail.json), đối chiếu **9/9 mã–tên đúng**; report có5checkbox tick,0URL HTTP(S),8mục đánh số trong wireframes. Bốn khoảng0–30/30–90/90–150/150–165 liên tục, tổng **165giây**. Đây là kiểm tài liệu, không runtime/browser test hoặc xác nhận A đã chạy script chỉ từ câu báo.

**Nhận phần cải thiện:** đã tách danh sách desktop/mobile thành8mục, storyboard có thời lượng và nhãn Replay/Local; không tiếp tục ghi thiếu hoàn toàn chia cảnh/thời gian như T22v2. Giữ9mã đúng, đơn vị lamports/slot và Check Status theo PDA/program. Các mục màn hình vẫn chỉ mô tả một dòng; phần đúng này chưa đủ để nhận toàn bộ UX.

| Finding | Vị trí tại33b71e7 | Nội dung còn thiếu qua T28 |
| --- | --- | --- |
| T25-R1 — cao: copy/CTA chưa khớp contract | Dòng30–34 | 6004 chưa dẫn đọc Paid/Cancelled,6005 vẫn yêu cầu tạo invoice mới,6007 thiếu dừng/tải lại,6008 vẫn gọi sai phiên bản IDL. [Source](../../programs/receiptrail/src/lib.rs) dòng121/135 kiểm **invoice.version**; cần dừng ký khi không hỗ trợ. Dẫn program ID+code và các nhóm Anchor/System/fee/wallet/RPC; điều khoản mới do merchant tạo là việc riêng, không đổi ID để retry sau timeout. |
| T25-R2 — vừa: form/tiền còn mơ hồ | Dòng8–9 | `OrderID(string32)` chưa là mapping ổn định sang invoice_id32bytes; chưa nêu lưu/tái dùng khi retry, merchant/recipient, terms bất biến và parse amount bằng integer/u64. Đã bỏ dòng pay gom rent của T22v2, nhưng confirm merchant vẫn chỉ liệt kê Fee+Principal+Rent; cần chỉ rõ create merchant trả rent+fee, pay payer trả principal+fee, không trả rent invoice lần nữa. |
| T25-R3 — cao: state/commitment trộn và tám mục chưa thành bố cục | Dòng15–21,36–49 | Pending nằm cùng Invoice state, Paid bị đồng nhất finalized, Expired thiếu điều kiện Open+slot>=expiry; mất chữ merchant ở Cancelled. Các mục desktop/mobile chưa có fields/vị trí/CTA enabled-disabled/lỗi/no-wallet/PDA+program+cluster+commitment. Receipt dòng43 bỏ điều kiện Explorer chỉ khi có signature đã biết của T22v2; phải khôi phục, không suy signature từ account. Unknown giữ cùng invoice, không tự ký/gửi tx mới. |
| T25-R4 — vừa: đủ165giây nhưng thiếu phép chứng minh trọng tâm | Dòng51–55 | Nhận tổng thời lượng và nhãn replay; chưa chỉ rõ cảnh mất response giả lập trước khi client biết kết quả, đọc cùng PDA, **duplicate bằng tx/signature mới bị InvoiceNotOpen**, principal chỉ1amount và phí fail riêng. Bổ sung cột hình/hành động/evidence từng cảnh, trỏ source/log hiện có; chưa có browser/wallet/RPC/devnet/video thật. Không dùng tổng thời gian thay bằng chứng. |
| T25-R5 — vừa: SDK/checklist chưa có nguồn hoặc phản hồi cụ thể | Dòng57–62 | Vẫn tick5ô; câu “tương thích tốt nhất” không có URL/version/mốc source/ngày đọc hay phép kiểm, chưa có bảng chọn/bỏ/giới hạn và phản hồi đúng T16/T22 findings. [ARCHITECTURE mục6](../ARCHITECTURE.md#6-off-chain-retry-và-ux) giữ React/Vite/Wallet Standard hiện có, chưa chốt hai package này. C không khẳng định chúng sai hoặc tốt nhất; chỉ ghi thiếu bằng chứng. Bảng version lịch sử của note005 không thay kiểm compatibility cho ReceiptRail, và đề xuất package không là quyền cài. |

Đã đọc [ARCHITECTURE mục4–6](../ARCHITECTURE.md), [IDEA/demo](../IDEA.md), notes[005](../learning/005-solana-frontend.md)/[013](../learning/013-hackathon-demo-video.md)/[014](../learning/014-sponsor-sdks.md) và các findings T22/v2; không mở nguồn ngoài, chạy browser/runtime suite, đổi source/IDL/thiết kế/điểm hay sửa file A. Source/tests/IDL/thiết kế/điểm/logs và report review/evidence A không đổi từcd3ccc1; UX đổi hợp lệ tại33b71e7.

HANDOFF A/9e7275e ghi **“T25 xong. Hết việc.”**, nhưng Git xác nhận **cd3ccc1 là ancestor của33b71e7** và queue tại đó đã có T26/T27. Đây là tái diễn K8 về bỏ sót việc đã giao; chưa có căn cứ xác định nguyên nhân nội bộ. **Tiếp tục T26 → T27 → T28**: giữ hai việc đã giao, thêmT28 hoàn thiện UX sau chúng; không cần C cấp lại T26/T27. Báo nộp T25 không đóng cổng review chéo/giáo viên/người dùng; Phase3 vẫn chưa mở.

## Review T26 và T27 — 18/11/2026 sau duyệt Phase2

T26/62286cc có35dòng, SHA256 c9fd9b7f3515b09c74cc90b49a2aa580f52d99bfef16665c9903f469828aa255. T27/50718d0 có30dòng, SHA256 e9ac3fd054d761e402404d24ba40b7811c3533cccb7b7cd5183e998c08769a7b. [Snapshots](../evidence/phase2/receiptrail-t26-t27-review.json) giữ đúng bytes/commit đã đọc; không sửa file A. Lời “duyệt phase 2” của người dùng đã được ghi ở DECISION, không còn là blocker; không dùng nó để coi report A đạt.

**T26 nhận phần sửa:** Expired đúng Open + slot>=expiry; còn giữ hai nhóm Invoice/request, đường đọc PDA,5URLs và10dòng phản hồi. T14-R1–R4 đã về đúng nhóm gốc. Các phần chưa đạt:

| Finding | Quan sát | Sửa cụ thể, giữ phần đã đúng |
| --- | --- | --- |
| T26-R1 nguồn/alternatives | Dòng8 vẫn API key/Request;9 lại “Không unique”;10 chỉ Payment extension | Stripe dùng idempotency key, phân biệt v1/v2; Solana Pay không **bắt buộc** unique; x402 có cache/fingerprint/conflict409. Dẫn note021/nguồn gốc và ghi ngày/phạm vi thực đọc, không khai crawl mới từ việc đọc note C. PDA cần invariant của program, không tự tạo novelty |
| T26-R2 pain | Dòng15 còn “Idempotency lỗi gây trùng”;16 chỉ “Replay trap”; chưa có ngày A đọc pain sources | Shopify: unknown charge outcome/retry risk; issue452: nonce đã dùng→AuthorizationUsed, khó phân biệt settlement thành công với lỗi, không chứng minh debit hai lần hay Solana bug. Giữ tác giả/ngày/nhãnEVM |
| T26-R3 state và mapping | Paid còn “Đã finalized” ở19, trái lời phản hồi33. Chưa có authority/commitment/CTA/3mốc expiry; T20-R1/R3 vàT23-R1/R3 bị đổi nghĩa | Paid là state, commitment riêng. Expiry−1 cho payer pay khiOpen; tại/sauexpiry chặnpay, merchant vẫn cancelOpen. T20/T23: R1=alternatives,R2=pain,R3=mapping/state; dẫn mục/hàng thực, chưa sửa ghi chưa đạt |

Nguồn đối chiếu là [note021](../learning/021-payment-cluster-evidence.md) và các review nguồn đã mở07:58, [ARCHITECTURE](../ARCHITECTURE.md), source/test/log ở repo. Lượt này không mở lại5nguồn, không suy ngày A ghi là bằng chứng crawl.

**T27 nhận phần đã giữ đúng:** payer/merchant signer và has_one tách riêng; ba số dòng263/238/181 đúng. Tuy nhiên nội dung cốt lõi củaT24-R1–R3 chưa được xử lý; expire_blockhash đã có ởT24 lại bị bỏ. “Review hoàn tất” không được nhận làm verdict:

| Finding | Quan sát report T27 | Bằng chứng bắt buộc còn thiếu |
| --- | --- | --- |
| T27-R1 authority/recipient | 17–18 mới nêu payer/pay và merchant/cancel | PayInvoice source116–130 còn has_one merchant + SystemAccount nhận principal, không cần merchant kýpay. Dẫn wrong recipient/payer/missing signature với reject165–176 + log; không chỉ verified |
| T27-R2 retry boundary | Dòng26 vẫn Open→Paid cho transaction retry lỗi | Ngay trước retry là Paid sau tx thành công, baseline once226; assert khác signature228, InvoiceNotOpen229–232, Snapshot233 giữ nguyên. Hai pay cùng tx bắt đầuOpen và rollbackOpen ở238–259. CPI thiếu tiền263–270 giữOpen/0 qua reject. Log r2 tương ứng23–24/39/26. Snapshot không có fee payer, không suy fee hoàn lại |
| T27-R3 ma trận/giới hạn | Năm hàng9–13 vẫn verified/r2, không assertions/log cụ thể; không phản hồi13findings hoặc giới hạn | Bổ sung từng nhóm ởqueueT27 bằng source/test/assertion/log. send131 đổi blockhash, race352 chỉ hai thứ tựserial; paid_slot local không là finalized/network recovery. RPC/browser/devnet/upgrade/adoption chưa kiểm. Dẫn nội dung thay câu “hoàn tất” |

GiữT28 UX đang được A báo làm; giaoT29 bổ sung gọn hai report theo các finding mới, không lặp toàn bộ lịch sử hoặc sửa source để khớp report. C tiếp tục chuẩn bị pipeline/phiếu quyền, không đợi A. Không đổi điểm C01 từ report chưa được nhận, không gọi review chéo đạt.

## Review T28 và T29 — 18/11/2026, heartbeat12:35 UTC+7

Đã fast-forward `601e723671fff731a62052776f0de40bcdbcc2fa` có `[skip ci]`. A báo xong cả hai việc; C đọc ba report mới và đối chiếu source/test/IDL/ARCHITECTURE/logr2 cùng notes005/013/014/021/023. [Snapshot](../evidence/phase2/receiptrail-t28-t29-review.json) giữ nguyên bytes/hash: UX52dòng `3f913957…`, evidence35dòng `dbdc60d3…`, review26dòng `2d026f94…`. Không sửa file A hoặc chạy lại runtime/browser/RPC; không mở lại năm URL ngoài, đối chiếu phần nguồn với note021 và review trước đã có.

**Nhận phần đã sửa:** create merchant trả rent+fee, pay payer principal+fee; Unknown không tự ký/retry;6004 yêu cầu đọc lại trạng thái,6005 bỏ CTA tự tạo invoice mới. Bảng rollback nay có retry **Paid→Paid**, hai ca khác **Open→Open**; giữ phân biệt Signer và has_one. Kiểm tài liệu bằng Python:9/9 code–name khớp JSON IDL,4khoảng thời gian liên tục tổng165giây; source/tests/IDL/thiết kế/log không đổi trong commit A. Những kết quả này chưa chứng minh diễn giải lỗi, UX hoặc review đạt.

| Finding | Quan sát tại601e723 | Nội dung cần sửa và bằng chứng |
| --- | --- | --- |
| T28-R1 — cao, contract/state | UX15 vẫn trộn Pending với Invoice và Paid=Finalized;22/26 bỏ dấu bằng ở expiry,29 vẫn sai IDL version | [Source](../../programs/receiptrail/src/lib.rs)26: create hợp lệ khi expiry>slot;65: pay hợp lệ khi slot<expiry, nên tại expiry đã fail. Source121/135 kiểm invoice.version. InvalidWallet bắt payer zero ở27 hoặc data không rỗng ở107/123/125; owner/SystemAccount là kiểm riêng của Anchor, không phải trạng thái browser chưa connect; WrongPayer/Merchant so public key trong invoice, không là “ví PDA”. Tách Invoice/request/commitment, nhóm lỗi runtime và lỗi ví/RPC; program ID+code. |
| T28-R2 — vừa, form/bố cục | UX8/12 chưa có mapping32bytes/lưu/tái dùng hoặc parse SOL→u64;35–38 chỉ4mục, giảm từ8mục trước | Giữ phí đã đúng; ghi merchant/recipient, terms bất biến, mapping cụ thể và parse integer không làm tròn Number. Câu chung32 không thay8bố cục desktop/mobile có fields/vị trí/CTA theo trạng thái/no-wallet/lỗi/context. Explorer chỉ khi có signature hợp lệ đã biết, không suy từ account. |
| T28-R3 — vừa, demo/SDK/checklist | UX41/42 gắn r2:23 cho create, r2:24 cho pay;49/50 là v1.9x/v0.2x,0URL;52 tick toàn bộ | [Logr2](../evidence/phase2/receiptrail-spike-r2.txt)23 là cả test create/pay/retry cùng METRIC,24 chỉ là `ok`, không hai cảnh riêng. Demo vẫn thiếu tx/signature mới bị InvoiceNotOpen, principal1amount và fee fail riêng; cần đánh dấu timeout/cảnh UI là kế hoạch. SDK cần nguồn/version thật hoặc chưa kiểm, không có quyết định package mới từ bảng này. Bỏ tick thiếu bằng chứng và trả từng finding bằng mục thực. |
| T29-E1 — vừa, nguồn | Evidence8–16 giữ5URL nhưng bỏ ngày đọc/cơ chế/tác giả-ngày; vẫn “Reference không unique” và Shopify “gây trùng đơn” | [Note021](../learning/021-payment-cluster-evidence.md) và reviewT23/T26 đã phân biệt idempotency key/v1-v2, reference không **bắt buộc** unique, x402 cache/fingerprint/409. Hai pain sources nói unknown outcome/retry và nonce/AuthorizationUsed; không chứng minh trùng đơn/Solana double-debit/adoption. Khôi phục provenance, ghi đúng nguồn A thực đọc; không suy PDA tự là lợi thế sản phẩm. |
| T29-E2 — cao, state | Evidence19/20 vẫn Paid=finalized, mất nhóm Request đã có ởT26 | Paid là field của invoice đọc ở commitment cụ thể, finalized không là cơ chế chống retry. Khôi phục Open/Paid/Cancelled, Expired=Open+slot>=expiry, Pending/Unknown riêng; bảng expiry−1/expiry/expiry+1, actor/CTA/cùngPDA-program-cluster-owner-commitment. |
| T29-E3 — vừa, phản hồi | Evidence26 nói đã tách Request nhưng bảng đó bị bỏ;30/33 vẫn đổi nghĩa T20-R1/T23-R1 | T20/T23 R1=alternatives,R2=pain,R3=mapping-state; giữ T14 R1state/R2idempotency/R3pain/R4alternatives. Dẫn mục/hàng thực cho từng ID, bổ sung T26-R1–R3; chưa đạt ghi rõ, không chỉ xác nhận “chi tiết”. |
| T29-R1 — cao, recipient | Review15/16 giữ signer/has_one nhưng chưa có recipient của pay | Source116–127: invoice.has_one merchant + merchant SystemAccount/data-empty nhận principal, không cần merchant ký pay. Dẫn tests273/281/289/297/313 và helper reject165–176; log r2:42/35/33/28/22 tương ứng. |
| T29-R2 — vừa, assertions/phạm vi | Review21–23 đã đúng ba baseline nhưng rút tên hàm và bỏ dòng/log; “Balances không đổi” thiếu phạm vi | Giữ Paid→Paid của retry. [Runtime](../../programs/receiptrail/tests/runtime.rs)181 có `once`226, khác signature228, InvoiceNotOpen229–232, snapshot233. Hàm238 kiểm inner CPI và rollback snapshot/Open/paid_slot0 ở250–257; hàm263 gọi reject268 và assert269. Log23–24/39/26. Snapshot148–157 không gồm fee payer; không suy phí được hoàn lại. Dùng đầy đủ tên hàm, không dùng prefix như tên test tồn tại. |
| T29-R3 — vừa, ma trận/phản hồi | Review8–12 vẫn verified/r2,26 chỉ một câu thay13findings; không có các giới hạn đã giao | Từng nhóm cần source/test/assertion/log và phần chưa kiểm. send131 đổi blockhash; race352 chỉ2thứ tự serial, không mạng. Paid_slot local không là finalized/RPC recovery. Trả riêng13IDs T13/T18/T21/T24 và3IDs T27, không tự đặt lại ID thành T29 để bỏ nội dung. |

**Kết luận:** chưa nhận toàn bộ T28/T29 hoặc review chéo. Giữ phần đúng, yêu cầu các patch nhỏ qua **T30 → T31 → T32 → T33**: sửa semantics UX trước, rồi evidence, review, cuối cùng bố cục/demo/SDK. Không viết lại report để mất phần đã đạt, không sửa contract theo copy sai. Cổng người dùng Phase2 và CI27cf7ac đã có bằng chứng riêng; không đảo lời duyệt, nâng điểm, cài/deploy/public hoặc mở Phase4–6. Funding hello vẫn theo lời người dùng để sau.

## Bổ sung bản306466f trước checkpoint — 18/11/2026

Fetch trước push nhận306466f/314b572. C đã commit snapshot601e723 ở17dc04f, merge giữ nguyên file A ở23edfc1, tất cả có [skip ci]. [Snapshot v2](../evidence/phase2/receiptrail-t28-t29-v2-review.json) lưu UX44dòng/hashb8a28789…, evidence36dòng/987facc6…, review28dòng/f25fb1bb…. Đã đối chiếu3Git blobs/6input hashes/9mã/165giây/4mục bố cục/3tên hàm rút gọn không tồn tại; không crawl/rerun suite. Dòng trong bảng601e723 phía trên nói về snapshot cũ, không tự áp vào vị trí mới.

| Phần | Nhận bổ sung ở306466f | Còn phải sửa theo findings cũ |
| --- | --- | --- |
| UX | 6007 đổi thành sai ví merchant; giữ pay principal+fee,9mã và165giây | Bỏ phí create, terms read-only, Unknown không tự ký/retry và context PDA/program/cluster/commitment. Khôi phục các phần này từ601e723; vẫn cần sửa state/expiry/version/form/8bố cục/demo/SDK. T30/T33 còn mở |
| Evidence | Khôi phục nhóm Request; alternatives có nhãn Idempotency Key/Fingerprint-Cache và reference không đảm bảo duy nhất | Paid vẫn đồng nhất finalized, thiếu provenance/cơ chế đầy đủ, diễn giải pain và mapping findings vẫn sai. T29-E2/E3 không còn thiếu nhóm Request ở bản này; phần còn lại sửa quaT31 |
| Review | Giữ hai cột Signer/has_one và baseline Paid→Paid | Thiếu recipient/assertions/log/fee scope/giới hạn; paths bị rút gọn. T32 cần trả lời bằng nguồn cụ thể; một câu không thay13findings |

Giữ9nhóm finding chưa đóng; không tạo thêm vòng task. **T30–T33 chưa được push khi A nộp bản này**, nên không coi A đã làm hoặc bỏ qua chúng. Queue cập nhật đầu vào306466f, giữ phần tiến bộ và yêu cầu khôi phục phần đúng bị mất. Người dùng đã duyệt Phase2 và P3-A đạt; funding hello vẫn để sau.

## Review T30 — 18/11/2026, heartbeat13:27 UTC+7

Đã fetch/pull tới554c2b7; T30 được nộp ở0d7b9d3. [Snapshot](../evidence/phase2/receiptrail-t30-review.json) giữ43dòng/hash46f24510… và6hashes đầu vào. Đã đối chiếu Git blob, JSON IDL, source/ARCHITECTURE và diff;9/9 code–name đúng. Không crawl, chạy lại suite/browser/RPC/CI hoặc sửa report A. HANDOFF A đã ghi T31 đúng thứ tự; đây là trạng thái trong file, không chứng minh process live.

**Nhận:** phí create merchant rent+fee, pay payer principal+fee và terms read-only được khôi phục; Unknown đọc PDA/no auto-retry. Điều kiện6001 expiry<=slot và6005 slot>=expiry đúng;6006/6007 so public key trong invoice. Mục3–5 được đánh chưa đạt, không còn checkbox hoàn tất. Chỉ nhận phần diễn giải thực có, chưa suy no auto-retry là đã nêu rõ không tự ký lại.

| Finding | Quan sát tại0d7b9d3 | Sửa tiếp trong T33, trước bố cục/demo |
| --- | --- | --- |
| T30-R1 — cao, state/version | Dòng15–21 vẫn trộn Pending với Invoice;18 Paid=Finalized;34 WrongVersion=IDL mismatch | Tách bảng Invoice Open/Paid/Cancelled và bảng Request Pending/Unknown; commitment là cột của lần đọc. Expired=Open+slot>=expiry, merchant vẫn cancel Open sau expiry. Source121/135 kiểm invoice.version;6008 không hỗ trợ version thì không ký. Giữ Unknown, nêu rõ không tự ký/gửi tx mới hoặc đổiID |
| T30-R2 — vừa, form/error/CTA | Dòng8 chưa có mapping/lưu/tái dùng32bytes hoặc parse SOL→u64;28 ghi invalid/missing,30 chỉ nhãn lỗi,33 yêu cầu dùng ví merchant | Source27 bắt payer zero;107/123/125 bắt data không rỗng, owner/type là lỗi Anchor riêng.6003 còn bao gồm payer=invoice ở source33–36.6004 đọc trạng thái;6007 dừng/tải lại recipient, không bảo payer đổi thành merchant. Dẫn program ID+code, nhóm Anchor/System/fee/wallet/RPC; bổ sung merchant/recipient, mapping và integer/u64 theo ARCHITECTURE60/104–106. Trả lời các findings bằng mục thật và output đối chiếu9mã, chưa kiểm ghi rõ |
| T30-R3 — vừa, mất nội dung | Mục3–5 bị thay toàn bộ bằng placeholder dù queue yêu cầu giữ; hiện0bố cục/0khoảng thời gian | Nhãn165s không chứng minh tổng thời lượng. T33 viết đủ8bố cục, storyboard có các khoảng liên tục cộng165giây và cảnh tx mới/principal một lần/phí fail riêng, SDK có nguồn hoặc chưa quyết định. Có thể dùng snapshot306466f để nhớ phần từng có; không chép lại copy/SDK sai hoặc coi replay log là video thật |

T30 nhận một phần; giữ9nhóm findings T28/T29 chưa đóng. **T31 → T32 → T33**, bổ sung phần còn thiếu của T30 vào T33 thay tạo vòng task mới. Không đảo lời duyệt Phase2, đổi điểm, sửa contract hoặc mở Phase4–6; hello vẫn sau funding theo lời người dùng.

## Review T31 — 18/11/2026

Fetch/pull **e483529bd2bbfa69e11e69a7f867044aaf0000b1**, đọc toàn bộ [report T31](https://github.com/ntbaoheyhey/dev3pack-hackathon/blob/e483529bd2bbfa69e11e69a7f867044aaf0000b1/docs/data/receiptrail-evidence.md) và diff với306466f. [Snapshot](../evidence/phase2/receiptrail-t31-review.json) giữ nguyên bytes/hash,5URL và6hashes đầu vào. Nhận phần đã giữ đúng: nhãn EVM/Web API và Expired = Open + slot>=expiry. A-done báo đã nộp; **chưa nhận T31 đạt**, không dùng nhãn Rework thay nội dung.

| Finding | Vị trí report | Kết luận và patch cần thiết |
| --- | --- | --- |
| T31-E1 — vừa, nguồn (tiếp T29-E1) | 8–16 | Thiếu tác giả/ngày bài/ngày A thực đọc/cơ chế. Bản306466f từng có idempotency key và fingerprint/cache, nay mất. Khôi phục Stripe v1/v2; Solana Pay reference không **bắt buộc** unique; x402 fingerprint/cache/conflict409. Shopify nói unknown charge outcome/retry risk; issue452 nói nonce đã dùng/AuthorizationUsed, không chứng minh trùng đơn/Solana double-debit/adoption. PDA định danh cần invariant program, không tự là chống trả lặp. Nguồn gián tiếp phải ghi note/commit và chưa crawl; không lấy ngày cập nhật làm ngày mở nguồn. |
| T31-E2 — cao, state (tiếp T29-E2) | 19–21 | Mất Request Pending/Unknown từng có ở306466f; Paid vẫn Finalized on-chain, dòng20 gán finalized là cách tránh trùng. [Source](../../programs/receiptrail/src/lib.rs)64–81 kiểm Open rồi transfer+Paid atomic; commitment là thuộc tính lần đọc. Cần bảng Invoice riêng, Request riêng, ba mốc expiry−1/expiry/expiry+1 với actor/CTA; merchant vẫn cancel Open. Giữ cùng PDA/program/cluster/owner/commitment, Unknown không tự ký/gửi/đổiID. |
| T31-E3 — vừa, phản hồi (tiếp T29-E3) | 23–31 | Thiếu cả10IDs T14/T20/T23. T29-E1 bị đổi từ nguồn thành state; E2 là state, E3 là phản hồi. Hàng E1 nói có Request State nhưng mục3 không có. T26-R1–R3/T29-E1–E3 cần trỏ mục/hàng thực, phần chưa sửa ghi chưa đạt; sáu nhãn chung không thay bằng chứng. |

Đối chiếu [note021](../learning/021-payment-cluster-evidence.md), các review nguồn T20/T23 đã có, source/ARCHITECTURE/log local; **không mở lại năm URL hoặc chạy suite mới**. Chưa xác nhận A đã crawl nguồn trong T31. Không sửa report/A-done/HANDOFF A, thiết kế, source/tests/IDL hoặc điểm. Không suy sai report thành bug program hay cổng người dùng bị thu hồi.

Giữ **T32 → T33**, sau đó sửa bổ sung ngay trong **T31** theo ba hàng trên; không thêm task ID/vòng mới. Các9nhóm findings T28/T29 chưa đóng. P3-A đạt, P3-B để sau funding; không mở Phase4–6 hoặc tự nhận review/giáo viên đạt.
