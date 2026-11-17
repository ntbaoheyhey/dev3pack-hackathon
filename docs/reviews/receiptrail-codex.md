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

C01 nâng F3→4 theo D2 ở [mục9](../ideas/codex/01-receipt-rail.md), R/D giữ4 PLAN; không nâng R5 khi thiếu reviewer độc lập. T11 đã có bản tại5b7abd5 và được review bên dưới; T12/T13 chưa có kết quả xác nhận. Không lấy kết quả ClusterProof cũ thay review.

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
