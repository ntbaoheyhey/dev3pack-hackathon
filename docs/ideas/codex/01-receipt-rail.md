# C01 — ReceiptRail: một invoice, một lần chuyển tiền

Codex · cập nhật18/11/2026 · RUBRIC v1.2 · **PLAN r2 — ĐẠT theo Codex, 79/100; F=4 sau spike, chưa được giáo viên duyệt**. Người dùng chọn “ReceiptRail chính, ClusterProof phụ” lúc00:07 ngày18/11 UTC+7; [DECISION](../DECISION.md). Thiết kế Phase2 chưa duyệt.

**Mục1–8 giữ snapshot r1 ngày17/11**: các câu “chưa chạy/chưa cài/chưa IDL” chỉ mô tả mốc r1. Trạng thái hiện hành và delta r2 nằm ở mục9; không sửa điểm lịch sử. Nguồn/primitive tại [021](../../learning/021-payment-cluster-evidence.md), phương pháp [016](../../learning/016-technical-feasibility-risk.md).

## 1. Người dùng, vấn đề và phép kiểm lợi ích

Người dùng đầu tiên là builder làm checkout/API trả phí trên Solana, có nhiều client hoặc relayer cùng xử lý một invoice. Hiện họ gửi payment, gặp timeout rồi phải quyết định đợi, query hay tạo transaction mới. Signature định danh transaction; nó không thay business invoice ID. ReceiptRail cho merchant công bố điều khoản bất biến và cho các bên đọc chung trạng thái invoice để phục hồi sau timeout.

| Nguồn trực tiếp | Claim được hỗ trợ | Giới hạn |
| --- | --- | --- |
| [x402 issue #452](https://github.com/x402-foundation/x402/issues/452), tác giả issue/maintainer | Người tích hợp đặt câu hỏi về idempotency của verify/settle và retry | Case ban đầu EVM, không phải bằng chứng Solana double-spend; thảo luận không xác nhận nhu cầu rail mới |
| [Shopify Engineering, 27/08/2019](https://shopify.engineering/building-resilient-graphql-apis-using-idempotency) | Đội payment thật cần phục hồi request mutation khi response bị mất | Hệ thống tập trung, nguồn lịch sử; không phải tích hợp Solana hoặc số liệu tỷ lệ lỗi hiện tại |
| [Solana Pay spec v1.1](https://solana.com/docs/tools/solana-pay/specification/version1-1) | Reference giúp tìm transaction; merchant cần xác minh payment | Reference có thể không unique, không tự enforce invoice chỉ trả một lần |

Hai nguồn đầu độc lập, hỗ trợ workflow retry/unknown outcome. **Giả thuyết sản phẩm chưa được xác nhận:** builder chấp nhận rent, program dependency và confirmation để có state dùng chung. Không có interview/pilot.

Phép kiểm sau build: cùng 10 tình huống timeout/concurrent retry, so baseline Solana Pay + merchant DB có unique operation key với ReceiptRail. Đo số lần chuyển principal cho cùng invoice ID, số bước để client mới tìm lại kết quả, thời gian và chi phí storage/tx; không tự đặt số tiết kiệm. Thành công tối thiểu: chỉ một payment principal, phục hồi được từ PDA khi mất cache client. Nếu DB của operator đáp ứng đầy đủ trust của cả hai bên, khuyên dùng DB.

## 2. Alternatives và đóng góp có thể kiểm

| Lựa chọn đã đọc | Đã giải tốt | Khác biệt cụ thể đề xuất / phép thử |
| --- | --- | --- |
| [Stripe idempotency](https://docs.stripe.com/api/idempotent_requests) | Retry và parameter consistency trong cùng payment service; API v1 có key retention | ReceiptRail cho client đọc invoice state trên chain thay vì chỉ tin operator. Thử client mới không có cache; đổi lại phải trả rent và tin program/chain |
| Solana Pay reference (spec trên) | Request/QR và tìm transaction, dễ dùng rail sẵn có | Hai transaction mới cùng reference không bị spec biến thành một invoice transition. Thử hai payer submissions cùng PDA; không nói Solana Pay app không thể tự bổ sung dedup |
| [x402 payment_identifier](https://github.com/x402-foundation/x402/blob/main/specs/extensions/payment_identifier.md) | Fingerprint ràng buộc terms, cached response và xử lý retry/conflict | ReceiptRail đặt điều kiện Open→Paid cùng chuyển principal trong program, thay vì novelty là HTTP retry/cache. Thử thay facilitator/cache mà vẫn đọc được invoice; **chưa tương thích x402 verifier** |
| [Solana Foundation Pay](https://github.com/solana-foundation/pay) | CLI x402/MPP, authorization, retry, payment debugger | Không xây lại gateway/debugger. ReceiptRail là rail invoice riêng; integration với Pay là nghiên cứu sau, README không đủ chứng minh Pay thiếu mọi invoice mechanism |

Khác biệt r1 là **state chung của cùng một invoice, điều khoản bất biến và kiểm duplicate principal**, không phải thuật toán idempotency mới. Bảng so ≥3 lựa chọn và phép thử gắn workflow hỗ trợ N4 trong PLAN; chưa có experiment/user xác nhận khác biệt hữu ích, không N5, không claim “đầu tiên”.

## 3. Vì sao Solana và trust boundary

DB + unique key là tốt nếu merchant là nơi mọi bên tin để đối soát. Với các client/relayer độc lập, invoice PDA do cùng program kiểm soát cho mọi bên một điểm đọc và một transition được thực thi chung. [Atomic transaction](https://solana.com/docs/core/transactions) cho phép chuyển SOL và cập nhật state cùng thành công hoặc rollback; phí mạng có thể vẫn bị tính khi fail. PDA không làm merchant trung thực hoặc bảo đảm giao hàng.

On-chain: điều khoản, quyền pay/cancel, state Paid. Off-chain: mapping đơn hàng→invoice ID, UI, retry/confirmation và cung cấp hàng hóa. Merchant vẫn có thể tạo **ID khác cho cùng đơn hàng**; invariant của MVP chỉ là một payment cho cùng PDA. RPC có thể sai/chậm; upgrade authority có thể thay logic. Hiển thị program ID/cluster/authority và yêu cầu review release; devnet không tuyên bố trustless production. Không indexer, oracle hoặc AI agent được quyền rút tiền.

## 4. Scope, account và instruction dự kiến

MVP: native SOL devnet, một merchant wallet, payer được chỉ định, create/pay/cancel/read receipt. Không escrow, refund tự động, stablecoin/Token-2022, fiat, cross-chain, batch, recurring payment hoặc x402 compatibility. Đây là giới hạn từ thiết kế r1 để chứng minh core invoice; stablecoin sẽ cần thiết kế và chấm lại, không ngầm coi đã có.

| Account | Owner / định danh / quyền |
| --- | --- |
| Invoice | Program của đội; PDA seeds `[b"invoice-v1", merchant_pubkey_32, invoice_id_32]`, canonical bump. invoice_id là bytes cố định không chứa dữ liệu cá nhân |
| Merchant/recipient | System wallet, ký create/cancel, trả rent lúc create; địa chỉ recipient chính là merchant, bất biến |
| Payer | Địa chỉ ghi khi create; ký pay, System-owned/data empty cho SOL transfer; phải khác merchant và invoice |
| System program | Pin ID/type bằng Anchor; chỉ CPI transfer/create, không cho caller chọn executable tùy ý |
| Clock | Sysvar đọc slot cho expiry và paid slot, không tin timestamp client |

Invoice fields dự kiến: version u8, bump u8, merchant Pubkey, payer Pubkey, invoice_id [u8;32], amount_lamports u64, expires_slot u64, status u8 (Open/Paid/Cancelled), paid_slot u64. Payload 123 bytes; với discriminator mặc định 8 bytes là 131 bytes, **chưa đo rent**. Không lưu secret, chữ ký transaction hoặc URL callback trong account. Paid là state authority; event chỉ là chỉ mục hỗ trợ.

| Instruction / transition | Signer, precondition | Effect và lỗi cần phân biệt |
| --- | --- | --- |
| create_invoice: chưa có→Open | Merchant ký; ID/PDA mới; amount>0; expiry>Clock.slot; merchant≠payer | Init một lần; lưu toàn bộ terms. Duplicate ID, invalid amount/expiry, thiếu rent đều fail |
| pay_invoice: Open→Paid | Payer ký, khớp field; owner/type/seeds đúng; slot<expiry; recipient==merchant; amount đọc từ state | CPI SOL transfer đúng amount, sau đó ghi Paid/paid_slot cùng transaction. Sai quyền/recipient/đã trả/hết hạn/thiếu balance trả lỗi; principal không đổi nếu transaction fail |
| cancel_invoice: Open→Cancelled | Merchant ký, đúng quan hệ | Không chuyển principal; Paid không cancel; cùng race pay/cancel chỉ transition được chấp nhận trước mới có hiệu lực |
| read | Không signer, đúng cluster/program | Đọc state; Open quá hạn hiển thị expired, không tạo quyền pay mới |

Không instruction update terms, reset, close hoặc reopen. Giữ account terminal để chống close→recreate; rent tích lũy là trade-off công khai. Chưa có program ID thật, IDL hoặc client đã sinh. D1 được đối chiếu [Anchor CPI](https://www.anchor-lang.com/docs/basics/cpi), [constraints](https://www.anchor-lang.com/docs/references/account-constraints), [004](../../learning/004-anchor-a-to-z.md), [007](../../learning/007-solana-program-security.md); bảng là thiết kế, không API đã compile.

## 5. Threat model, transitions và acceptance tests

Tài sản: principal SOL, rent, tính đúng của receipt. Attacker điều khiển args/accounts, mở nhiều tab, gọi thẳng program, phát lại transaction hoặc thay blockhash. Merchant/backend/UI/RPC có thể lỗi hoặc độc hại; wallet ký không thay checks program.

| Invariant / tình huống | Giảm thiểu và test bắt buộc sau cấp quyền |
| --- | --- |
| Cùng PDA không chuyển principal hai lần | Open check + writable invoice + atomic transfer/state; hai tx với blockhash khác, thứ hai fail và merchant principal delta chỉ một amount (tách fee/rent) |
| Terms/quyền không đổi | Pay đọc terms đã lưu; signer/has_one/seeds/owner/discriminator/recipient checks; thay payer, merchant, owner, type, ID và amount trong client phải không đổi state |
| Transfer fail không thành Paid | Thiếu SOL hoặc CPI error: Invoice vẫn Open, không dựa event trong failed transaction; test state và balances |
| Lifecycle không hồi sinh | Init cùng ID sau Paid/Cancelled bị từ chối; không close/reset; test cả cancel→create và paid→create |
| Expiry và race | Slot trước/tại/sau expiry; hai thứ tự pay/cancel; cấm terminal→Open và terminal→terminal khác |
| Alias và số nguyên | Reject payer==merchant/invoice; u64 amount, checked arithmetic khi kiểm delta, không JS Number cho lamports |
| Timeout/confirmation | Lưu invoice ID, signature và lastValidBlockHeight; đọc signature status/PDA trước ký lại, không tạo invoice ID mới để né pending. Khi RPC không xác nhận thì hiển thị chưa biết |
| Privacy và upgrade | ID opaque, không PII trong memo/state; không coi receipt bảo đảm hàng hóa. Authority/key management phải được user chốt ở Phase 3; không revoke tự động |

Oracle độc lập: sau transaction finalized đọc lại balances (tách phí/rent), owner/PDA/terms/state; không dùng UI status làm test oracle. Negative tests chạy qua initialization thật, không chỉ fixture set thẳng state. Đây là **plan**, chưa invariant nào của custom program được test; R4 đánh độ đầy đủ thiết kế, không audit.

## 6. Dependency, critical path và kill criteria

| Dependency | Mức / evidence | Rủi ro, người làm và fallback |
| --- | --- | --- |
| Anchor 1.2.2, Agave 4.1.2, platform-tools v1.57 | D1, note 003/004 và docs CPI/constraints đã đọc; chưa cài | C, 4h spike sau quyền cài: create→pay→retry fail→read. Không được phép cài thì chưa build C01, trình user chọn read-only dự phòng; không giả F4 |
| System program/PDA/atomicity | D1, docs trên; native devnet rail | C, không CPI ngoài. Nếu invariant double principal/rollback thất bại thì sửa trước hoặc bỏ C01 |
| Devnet RPC/faucet | D1 cho payment, các read của đội đã chạy D2 | Chuẩn bị SOL thử sau quyền ví; timeout hiển thị pending, endpoint khác chỉ khi đúng cluster/được cấu hình. Replay log chỉ để giải thích, không thay live acceptance |
| Wallet + web/client | D1 theo note 005, client @anchor-lang/core1.2.2 cần web3.js1.x | A theo contract C review. Nếu wallet integration chậm, dùng client test devnet để kiểm core; vẫn phải hoàn thiện user flow mới gọi MVP xong |
| Mapping invoice và tiếp tục app | D1 thiết kế ở mục3–5 | Không indexer/database bắt buộc cho demo; URL opaque chứa invoice address, query chain. Backend vẫn phải map order ổn định |

Ngân sách ước lượng: 4h spike + 8h program/test + 6h UI + 4h tích hợp/demo, thêm 8h buffer; **30 giờ công**, không cam kết elapsed hay năng suất đã đo. Critical path: quyền/môi trường→invariant test→IDL→UI→recovery→demo. Tối đa 2 ngày build sau chọn; nếu hết 4h spike chưa chứng minh duplicate/rollback thì đánh lại F, không tiếp tục mở features. Nếu 5 builder đều chỉ cần DB/cache và không cần independent read, bỏ hướng shared receipt thay vì thêm token để làm đẹp pitch.

## 7. Demo 165 giây và phân phối

| Giây | Hành động / kết quả / loại evidence |
| --- | --- |
| 0–20 | Một invoice và tình huống mất response; nói rõ devnet/native SOL và invoice≠đơn hàng |
| 20–45 | Merchant tạo terms; payer kiểm recipient/amount/expiry; một invoice address |
| 45–80 | Payer pay; app cố ý mất response (fault injection ghi nhãn), mở lại bằng cùng invoice ID và đọc Paid |
| 80–110 | Gửi pay lần hai với tx mới; show lỗi AlreadyPaid và principal delta một amount, fee fail nói riêng |
| 110–140 | Một case sai payer hoặc cancel race từ test log thật; không dựng log giả |
| 140–165 | Trust/upgrade/rent/không bảo đảm hàng hóa; đưa link source, tests và bước áp dụng |

Storyboard là PLAN, chưa có video hoặc số đo. Nếu RPC lỗi khi quay: quay lại live khi hoạt động; có thể trình replay đã gắn nhãn nhưng không ghi demo live đạt. Hai màn hình chính: terms/pay và receipt/recovery, không bắt người dùng hiểu PDA trước khi trả.

5 user đầu dự kiến: 2 builder x402, 2 builder Solana Pay, 1 mentor payment từ cộng đồng developer/Superteam. Chuẩn bị link demo + tình huống timeout, xin thử tự nguyện qua kênh công khai sau khi có user cho phép gửi; **chưa liên hệ ai**. Metric: hoàn thành recovery không trợ giúp, hiểu đúng boundary cùng invoice, nhu cầu so DB, willingness chịu rent. OSS MIT; duy trì web tĩnh + RPC và versioned program, không hứa doanh thu. V3 là kế hoạch tiếp cận/metric, không adoption.

## 8. Gates và điểm r1

| Gate | PLAN | Evidence / điều kiện giao hàng |
| --- | --- | --- |
| G1 | pass | State và native SOL atomic là core, mục3–5; không thêm NFT trang trí |
| G2 | pass | Code tự viết, repo MIT, public trước nộp; chưa nhận visibility như evidence sản phẩm |
| G3 | pass | Storyboard165s, fault injection/replay phân biệt; chưa có video |
| G4 | pass (PLAN) | Dependencies D1, không mandatory external CPI; quyền toolchain là điểm hỏi E theo rubric, phải có trước build |
| G5 | pass (PLAN) | Invariants/transition/negative tests + no close, không giữ signer phía server; chưa test/audit |
| G6 | pass (PLAN) | Track chính Solana; README tách trước/trong sự kiện; không claim partner prize, lịch/eligibility cuối kiểm lại trước nộp |

| Điểm | Giá trị | Bằng chứng và trần |
| --- | ---: | --- |
| P | 4 | Mục1: Shopify/x402 độc lập về workflow, alternatives và phép kiểm; chưa user research để P5 |
| S | 4 | Mục3: so DB/chain, chia on/off-chain và trust; chưa integration xác nhận để S5 |
| N | 4 | Mục2: ≥3 alternatives, khác biệt same-invoice transition và thí nghiệm; chưa xác nhận lợi ích N5 |
| F | 3 | Mục4/6: D1, scope/critical path/fallback; **custom program chưa chạy** |
| R | 4 | Mục5: transition/replay/lifecycle/dữ liệu ngoài/oracle; chỉ chất lượng PLAN |
| D | 4 | Mục7: 165s, recovery, ít màn hình, kết quả kiểm được; chưa prototype/người xem |
| V | 3 | Mục7: 5 người đầu và metric; chưa liên hệ/adoption |

| Vòng | P | S | N | F | R | D | V | Tổng | Thay đổi / kết luận |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| r0 | 4 | 4 | 3 | 3 | 3 | 3 | 2 | 66 | Phác thảo, chưa đạt |
| r1 | 4 | 4 | 4 | 3 | 4 | 4 | 3 | **75** | Bổ sung comparison/transition/recovery/distribution; F giữ3. ĐẠT PLAN theo Codex, còn r2–r3 nếu review yêu cầu |

Tổng `(80+60+40+60+60+60+15)/5=75`; mọi sàn đạt. Đây là bài sát ngưỡng: nếu reviewer không chấp nhận N4 hoặc P4, phải rút khỏi danh sách đạt và sửa tiếp; không làm tròn hay tự tăng F. Không suy ĐẠT PLAN thành Phase 1/2 hoàn tất.

## 9. Vòng r2 — spike đã chạy, 18/11/2026

Điểm yếu nhất r1 là F3: custom program chưa chạy. Commit **8f84cfe** bổ sung [source](../../../programs/receiptrail/src/lib.rs), [19 runtime tests](../../../programs/receiptrail/tests/runtime.rs), [runner offline](../../../scripts/check-receiptrail.sh), [IDL generated](../../idl/receiptrail.json), [IDEA](../../IDEA.md), [ARCHITECTURE](../../ARCHITECTURE.md) và [note023](../../learning/023-receiptrail-phase2-spike.md). Đây là cùng job/cơ chế C01, không reset idea ID hoặc vòng chấm.

**Evidence D2:** bytecode SBFv3 Anchor1.2.2 thực chạy trong LiteSVM0.15.0; create→pay→pay bằng transaction/blockhash/signature mới fail→read/balances. [r1](../../evidence/phase2/receiptrail-spike-r1.txt)19/19, suite1.06s/build+test64s; sau siết runner tránh rustup proxy, [r2](../../evidence/phase2/receiptrail-spike-r2.txt)19/19, suite1.00s/build+test3s bằng cache. Source/test/lock/bytecode hashes không đổi; [metadata](../../evidence/phase2/receiptrail-build-metadata.json) có metrics và IDL hash.

Đã đo account131bytes, rent1,802,640lamports trong VM, principal1,000,000 chỉ chuyển một lần. CU mẫu create8,775/pay6,608/retry6,017/cancel4,346. Test `[pay,pay]` rollback cả transfer đầu; CPI thiếu tiền, signer/recipient/owner/type/PDA/bump/version/program sai, expiry và cả2 thứ tự pay/cancel đều pass. Fee payer riêng tách phí/rent khỏi principal. Không dùng same-signature replay hoặc UI làm oracle.

| Dependency / ngân sách hiện hành | Đã chứng minh | Còn phải làm sau duyệt |
| --- | --- | --- |
| Anchor/System/PDA/atomicity | D2 local với bytecode thật, IDL và log; dùng bộ cache đã có | Harden/resource tests, review độc lập; ID deployment chỉ sau quyền tương ứng |
| Wallet/client/UI/RPC recovery | D1 thiết kế, wireframe và error contract trong ARCHITECTURE | Tích hợp và failure/recovery mạng thật; chưa D3 |
| Thời gian | Spike hoàn tất trong timebox4h;64s là thời gian build/test máy, **không phải tổng công viết/review** | Ước lượng sau spike:8h program/test +6h UI +4h integration/demo +8h buffer =26giờ công; chưa năng suất đo hoặc cam kết lịch |
| Kill criteria | Giữ invariant principal/rollback và test khi sửa source | Nếu không giữ invariant thì sửa trước tính năng; nếu user chỉ cần DB/cache thì kiểm lại giá trị sản phẩm |

| Tiêu chí | r1→r2 | Bằng chứng / trần |
| --- | --- | --- |
| P | 4→4 | Hai nguồn độc lập/workflow ở mục1; chưa interview/pilot |
| S | 4→4 | So DB và trust boundary mục3; chưa user xác nhận cần chain |
| N | 4→4 | ≥3 alternatives mục2, experiment có thể kiểm; chưa đo lợi ích |
| F | **3→4** | D2 của invariant khó nhất, log/số đo/timebox và ngân sách ở trên; chưa browser/RPC recovery D3 nên không5 |
| R | 4→4 | Threat model/transition mục5 + ARCHITECTURE/test; **chưa reviewer độc lập**, không5 |
| D | 4→4 | Storyboard165s và recovery trong IDEA; chưa UI/video/người xem, không5 |
| V | 3→3 | Kế hoạch5 builder/metric mục7; chưa liên hệ/adoption |

`T=(20×4+15×4+10×4+20×4+15×4+15×4+5×3)/5=79`. **Delta +4 chỉ từ F**, không đổi weights/floors/ngưỡng. Lịch sử r0=66, r1=75 giữ nguyên; r2=79, còn tối đa r3 nếu review yêu cầu. Mọi sàn đạt.

G1–G6 vẫn pass **PLAN**: primitive thực thi là core; code tự viết/MIT và kế hoạch open source; demo gắn nhãn; dependency bắt buộc có đường xử lý; kiểm quyền/lifecycle/atomicity đã chạy local; README tách trước/trong sự kiện. Không dùng PLAN pass thay gate DELIVERY/public repo/video/CI/devnet. Toolchain/web cũ giữ nguyên; thêm cài/deploy/public phải hỏi trước.

Rủi ro còn lại: rent terminal tích lũy; program/upgrade/RPC trust; merchant tạo ID khác cho cùng đơn hàng; native SOL chưa stablecoin/x402; nhu cầu market chưa xác nhận. Review A/giáo viên và duyệt IDEA/ARCHITECTURE người dùng còn mở. Không suy ĐẠT79 thành qua Phase2/3.
