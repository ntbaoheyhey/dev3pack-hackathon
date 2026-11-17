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
