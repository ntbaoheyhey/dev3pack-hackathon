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
