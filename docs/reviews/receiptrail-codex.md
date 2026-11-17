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

C01 nâng F3→4 theo D2 ở [mục9](../ideas/codex/01-receipt-rail.md), R/D giữ4 PLAN; không nâng R5 khi thiếu reviewer độc lập. T11/T14 đã có bản và được review bên dưới; T12 tại42c5523 chưa đạt, T13 chưa có verdict. Không lấy kết quả ClusterProof cũ thay review.

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
