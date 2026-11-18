# 021 — Kiểm chứng payment, cluster và token net

> Codex · trước sự kiện · Phase 1/D · nguồn đọc 17/11/2026 (Asia/Ho_Chi_Minh). Đặt chỗ ở commit bd2fc42 trước khi viết. Đây là nghiên cứu cho ba ứng viên, chưa phải sản phẩm được chọn.

## 1. Mục tiêu và điều cần nhớ

Ba lỗi khác nhau cần ba phép kiểm: trả lại cùng hóa đơn; nhầm cluster/deployment/IDL; nhầm số gửi với số token thực nhận. Không coi mọi retry là double-spend, địa chỉ khác nhau là lỗi IDL, hoặc mọi token đều có transfer fee.

Đọc cùng 004/006/007/015–020. RUBRIC v1.2 giữ nguyên thang điểm; học và ghi note này trước khi viết spike. Node 24.22.2 đã có; thử nghiệm chỉ dùng built-in, đọc devnet, không cài package/toolchain, tạo ví hay gửi transaction.

## 2. Phiên bản và bằng chứng kiểm tra

| Thành phần | Snapshot/quan sát | Mức kiểm chứng |
| --- | --- | --- |
| Node | v24.22.2 | Đã chạy --version |
| Devnet public RPC | getGenesisHash = EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG; getAccountInfo Token-2022 trả executable và loader v3, slot 523292719 | Hai lệnh đọc đã chạy; không chứng minh trustless RPC, IDL tương thích hoặc bytecode khớp source |
| Token-2022 fee source | blob b0b933fb4d158603a49f51aa64d7ccea0c657a6c, interface/src/extension/transfer_fee/mod.rs | Đã đọc hàm ceil, cap, inverse, epoch; chưa biên dịch Rust |
| Loader v3 state | blob 3bf81958e2b355d5c6b9eca8e266f9771d40c0de, anza-xyz/solana-sdk | Đã đọc state và tests serialized sizes 36/45 bytes |
| x402 payment-identifier | blob e85f0d53101aa7a4246b01d9f31f0e2b1ba24f12 | Đã đọc spec; chưa chạy x402 |
| Jupiter Lend README | blob e7f98afb5889d54857c7a78cd2e59ecdb6014300 | Maintainer xác nhận devnet May 2025 lệch IDL hiện tại |
| Raydium fee guide | blob 604c1836694897dd6985820c362db1c01f1ee299 | Đã đọc; snippet rounding/epoch mâu thuẫn token source, không dùng làm oracle tính đúng |

## 3. Kiến thức chính

### Payment: business ID khác transaction signature

[R1] mô tả retry khi không biết charge đã xong chưa; [R2] thảo luận app-layer context. Cả hai chứng minh workflow retry, không chứng minh merchant sẽ dùng custom program của đội. [R3] đã có fingerprint và cache; không được quảng bá lại tính năng đó như phát minh. [R4] reference giúp tìm giao dịch, không tự thực thi trạng thái hóa đơn một lần.

Hướng C01 cần invoice state dùng chung: merchant tạo điều khoản bất biến; payer đã chỉ định thanh toán; program chuyển tiền và ghi Paid trong cùng transaction. UI bị timeout thì đọc PDA lại. Hóa đơn Paid không được close/recreate, nếu không có tombstone bền vững khác. Chain không bảo đảm merchant giao hàng hoặc cache HTTP luôn phục hồi; các phần đó nằm ngoài cam kết. Phải giải thích rent và upgrade authority, không gọi đây là x402-compatible khi chưa test verifier [R5].

### Cluster: tên RPC, IDL và executable chưa đủ

[C1] là warning maintainer về lệch deployment thật; [C2] là báo cáo người tích hợp gặp mismatch (2024, chỉ dùng làm bằng chứng friction lịch sử). [C3] hướng dẫn verified build có kiểm binary; công cụ C02 chỉ báo readiness có giới hạn, không thay verified build.

Thiết kế spike: khóa endpoint devnet, đọc genesis, account owner/executable, pointer ProgramData, metadata upgrade slot/authority; đọc lại program và ProgramData cùng getMultipleAccounts để giảm race; giữ context slot và hash **toàn account** tách khỏi hash payload sau header. Source [C4] cho header 45 bytes; hash đó không tự là verified-build hash (có thể có padding). IDL hash là hash artifact người dùng đưa, **không thể từ IDL hash suy ABI khớp bytecode**. Nhãn unknown cho attestation thiếu, mismatch cho expected manifest lệch; không tô xanh chung mọi field.

Hash genesis do RPC trả là định danh quan sát, không phải bằng chứng RPC trung thực. Baseline expected phải đến từ manifest được review độc lập; đọc lần đầu từ cùng RPC chỉ được ghi observed-baseline, không được gọi trusted verification. Hỗ trợ loader v3 trước; loader lạ trả unsupported. Snapshot có thể stale ngay khi upgrade; đọc lại trước tích hợp, không cam kết tương thích tương lai.

### Token net: integer, epoch và policy rõ ràng

[N1] cho một trường hợp kiểm payment bằng gross thay net; đây là advisory về phiên bản được nêu, không tuyên bố Kora hiện tại còn lỗi. [N2] là báo cáo rounding thực tế năm 2024; cơ chế hiện tại phải kiểm bằng source [N3]. [N4] là lựa chọn có sẵn cần so, đồng thời cho thấy không thể chép mọi snippet kể cả trong docs maintainer.

Theo source [N3]: `fee = min(ceil(gross * bps / 10000), maxFee)`; dùng integer lớn và kiểm miền u64, không Float/Number cho raw token units. Chọn newer fee khi `epoch >= newer.epoch`, ngược lại older. Withheld chưa phải spendable và chưa tự vào treasury (006). Tìm gross nhỏ nhất để net >= target bằng binary search u64, đối chiếu công thức inverse của upstream và brute force miền nhỏ; không gọi mô hình tự so với chính nó là test độc lập.

C03 chỉ báo giá gross/net với config mint live + epoch + slot; mint không hỗ trợ/hook/confidential thì unsupported, không đoán. Quote không phải kết quả thanh toán; TTL/epoch change phải re-read. Không tuyên bố mọi USDC có transfer fee. MVP không swap, không khuyến nghị yield, không ký transaction. Kế hoạch acceptance gồm quote case cơ bản và phản ví dụ khiến dùng floor/epoch sai cho kết quả sai.

## 4. Ví dụ hoặc quy trình tối thiểu

Các số sau là phép tính minh họa: gross 101, bps 100, cap 100 → fee 2, net 99; dùng floor sẽ báo sai net 100. Target 100 với cùng config cần gross 102. Đổi newer fee từ 100 sang 200 bps ở epoch 10 phải đổi quote ở đúng epoch 10.

Kế hoạch spike ban đầu (viết trước code; kết quả thực hiện bên dưới):

1. C02: đọc program thật devnet; dựng expected manifest cố ý sai từ snapshot, checker phải phát hiện sai genesis/address/owner/hash và giữ ABI = unknown. Timeout/null/unsupported không được coi là pass.
2. C03: module arithmetic dùng BigInt, oracle inverse độc lập; kiểm zero/100%/cap/rounding/overflow/epoch. Đọc một mint TransferFee trên devnet nếu tìm được qua số request giới hạn; không tạo token thay vì không tìm được.
3. Lưu lệnh, thời gian, public RPC metadata và kết quả dưới docs/evidence; file data dùng .json chỉ chứa dữ liệu công khai, không keypair. Script ở research/phase1, không scaffold app/product.
4. Chỉ nâng F lên 4 nếu spike đúng phần khó của phạm vi **read-only** đã chạy và có log. Không suy thành F4 cho custom program C01 hoặc Phase 3 đã hoàn thành.

### Kết quả spike lần đầu — 17/11/2026

Log/artifact tại [evidence/phase1](../evidence/phase1/README.md). `node --test research/phase1/spikes.test.mjs` đạt 9 nhóm, gồm 5.940 case đối chiếu inverse và 744 case brute force; đây là fixture/arithmetic. C02 đã đọc Token-2022 devnet tại slot 523293811 trong 747 ms và phát hiện 5 manifest mutations. Cùng-RPC baseline chỉ là `OBSERVED_ONLY`; ABI `UNKNOWN`, source verification `NOT_RUN`, không gọi hash payload có padding là verified-build hash.

Probe mint tìm được TransferFee 100 bps nhưng đi kèm transferHook: **unsupported cho quote C03**, không biến việc đọc mint thành live quote thành công. Chưa cài package/toolchain, tạo keypair, ký hoặc gửi transaction.

### Thiết kế parser C03 trước khi mở rộng code

Đã đọc [mint layout](https://github.com/solana-program/token-2022/blob/main/interface/src/state.rs) (blob `8c94447787faee9ef05ba752392df6db2d00cb1d`) và [extension layout](https://github.com/solana-program/token-2022/blob/main/interface/src/extension/mod.rs) (blob `12f066a14f0db3ee65543a48919a82a870db44a6`) ngày 17/11/2026. Mint base là 82 bytes; với extension, padding đến 165 phải zero, byte account type ở 165 phải Mint=1; TLV bắt đầu 166 với type/length u16 little-endian. Loại buffer 355 bytes (multisig), base chưa initialized, owner sai, TLV trùng/cắt ngắn hoặc extension chưa hỗ trợ.

Theo source N3, TransferFeeConfig type=1, dữ liệu 108 bytes: hai authority 32 bytes, withheld u64, older/newer fee mỗi 18 bytes (epoch u64, cap u64, bps u16). Đọc raw base64 và `readBigUInt64LE`, giữ raw units/epoch dạng BigInt rồi serialize chuỗi; **không lấy JSON Number đã bị làm tròn rồi ép BigInt**. Epoch/slot từ RPC phải là safe integer không âm, nếu không từ chối. Đọc epoch trước/sau mint, reject khi epoch đổi; giữ slot/hash/time và ghi dữ liệu có thể stale sau snapshot.

Spike hỗ trợ mint chỉ có TransferFeeConfig; metadata/hook/extension khác hiện trả unsupported. Đây là policy phạm vi chặt, không tuyên bố các extension đều nguy hiểm. Quote chỉ tính fee schedule, không kiểm balance, trạng thái token account, memo/CPI policy, freeze/transfer permission hay xác nhận thanh toán.

Discovery qua transaction gặp HTTP 429 sau lỗi version. Đã đọc [getProgramAccounts](https://solana.com/docs/rpc/http/getprogramaccounts) và [getEpochInfo](https://solana.com/docs/rpc/http/getepochinfo) ngày 17/11/2026: đổi discovery sang một query filtered size=278 (166+4+108), Mint type và TransferFeeConfig; `dataSlice` rỗng chỉ lấy địa chỉ, đọc lại tối đa 32 mint. Allowlist tăng lên bảy method **read-only**. Response vẫn giới hạn 6 MB; provider có thể không cho index query, khi đó ghi lỗi thay vì query toàn bộ hay tự tạo token. Sau discovery, explicit mint chỉ cần bốn RPC đọc để chạy lại quote.

### Kết quả mở rộng C03 — 17/11/2026

`node --test research/phase1/spikes.test.mjs research/phase1/fee-mint.test.mjs research/phase1/replay-evidence.test.mjs` đã đạt **16 test, 0 fail**; log [spikes-tests-r1-final.txt](../evidence/phase1/spikes-tests-r1-final.txt). Gồm 5.940 inverse cases, 744 brute-force cases, parser âm, epoch/slot và replay raw bytes devnet. Lượt tiếp tục đã review code và đối chiếu 5 script hashes với artifact; không chạy lại khi code không đổi. Không compile Rust, không kiểm payment settlement.

Lệnh `node research/phase1/netpay-live.mjs HxDYFvcXnLuy4VdxXCooUXrch8DZW34oUteQ6N2EFxEr` đã exit 0: [artifact cuối](../evidence/phase1/netpay-1794925658391.json), 283 ms, slot 523298709, epoch 1211. Target 10000 raw units cần gross 10102, fee 102, net 10000; decimals 6, 100 bps, cap 1000000000000. Đây là **fee-only quote**, không phải việc tiền đã đến. Mint hook vẫn bị từ chối `unsupported_extensions:14`; không coi authority có thể đổi config hoặc mint supply là đã được loại bỏ.

Địa chỉ lấy từ repo tác giả [Day 50](https://github.com/gopichandchalla16/100-days-of-solana/blob/main/day-50/README.md) (blob `22ee400f239112cd17631fdef936c7d4260efc80`) và [Day 53](https://github.com/gopichandchalla16/100-days-of-solana/blob/main/day-53/README.md) (`c8c67020ecb5cf85fbc6a7a8c7dda7919daf6535`), rồi kiểm raw RPC độc lập. Không chạy lệnh tạo token trong nguồn. Hash mint cuối `d115098b26d4231b8f61a66d80b39b31508b7c0dbdf6bcade810f0f0d4411086`; `writesToChain:0`.

Discovery mặc định còn bị provider từ chối (403); dùng explicit mint khi có lý do chạy lại. Snapshot `netpay-1794925526177.json` ghi mint pmAMM unsupported; `netpay-1794925600812.json` giữ lỗi field report ghi đè address, raw bytes vẫn đúng. Đã sửa `mintConfig` và có regression test; giữ cả lịch sử và artifact cuối. Giới hạn response 6 MB được kiểm sau khi đọc body, chưa phải streaming memory cap của sản phẩm.

### Alternatives mới và giới hạn claim

[Ryntra SDK README](https://github.com/ryntra-io/ryntra-solana-evidence/blob/main/packages/solana-evidence-sdk/README.md), blob `eeab3768aabd819e42d75feaadeb4de5e5a66586`, đã có inspect mint, fee/net preview, hook/policy và xác minh receipt; đây là đối thủ trực tiếp C03. Interface minh họa nhận `amountRaw`; chưa kiểm toàn repo có target-net inverse hay không. Không quảng bá tính fee hoặc phân biệt unknown như tính năng chưa ai làm. C03 chỉ có thể kiểm lợi ích của workflow nhập số muốn nhận, chứng minh gross tối thiểu, snapshot replay và reject policy cụ thể so các baseline.

[Solana Foundation Pay README](https://github.com/solana-foundation/pay), blob `28c35e34cb5f053343937efe9b5862769fae96a0`, đã có x402/MPP, wallet authorization, retry và debugger. Không gọi retry/debugger là đóng góp C01. C01 chỉ khác ở điều khoản invoice và trạng thái Paid dùng chung on-chain; chưa chứng minh tương thích x402 hoặc nhu cầu chấp nhận rent/custom program. Cả hai README được đọc lại ngày 17/11/2026; đọc docs không phải chạy đối thủ.

Đã đọc được [Solana Pay spec v1.1](https://solana.com/docs/tools/solana-pay/specification/version1-1) và [verified builds](https://solana.com/docs/programs/verified-builds) ở lượt nghiên cứu trước; timeout/502 là lịch sử công cụ. Reference không bắt buộc unique và chỉ giúp tìm giao dịch, không tự enforce one-time invoice. Kora advisory nêu affected 2.2.0, patched field None; không suy mọi bản hiện hành còn lỗi.

## 5. Tự kiểm tra

- x402 chưa có idempotency? Sai, [R3] đã có; phải so state/trust boundary cụ thể.
- Program account 36 bytes chứa toàn code? Không, loader v3 trỏ ProgramData.
- Hai hash IDL bằng nhau chứng minh code on-chain tương thích? Không.
- Tính 101 * 1% bằng floor có đúng token fee? Không, source dùng ceil.
- Thay current RPC data bằng fixture rồi gọi live test? Không; ghi rõ fixture và live riêng.
- Có hai link Reddit nghĩa hai nguồn độc lập? Không; phải đọc đích, nội dung và nguồn gốc.

## 6. Nguồn và độ tin cậy

Mọi nguồn đọc 17/11/2026. Nguồn trước 2025 được ghi rõ tuổi; dùng cho trải nghiệm lịch sử, API lấy source/docs hiện hành. Không có phỏng vấn, khách hàng hay pilot của đội.

| ID | Nguồn | Claim và giới hạn |
| --- | --- | --- |
| R1 | [Shopify Engineering, 27/08/2019](https://shopify.engineering/building-resilient-graphql-apis-using-idempotency) | Nhóm Payment Service giải quyết charge retry/unknown state; lịch sử, khác rail Solana |
| R2 | [x402 issue 452](https://github.com/x402-foundation/x402/issues/452) | Reporter và maintainer bàn retry/app context; issue ban đầu EVM, không coi là lỗi Solana hiện hành |
| R3 | [payment_identifier spec](https://github.com/x402-foundation/x402/blob/main/specs/extensions/payment_identifier.md) | Fingerprint bind terms và cache, kiểm tình huống duplicate/conflict |
| R4 | [Solana Pay spec v1.1](https://solana.com/docs/tools/solana-pay/specification/version1-1) | Đã đọc chính thức; reference để tìm payment, không bắt buộc unique, không tự enforce one-time invoice |
| R5 | [Exact SVM spec](https://github.com/x402-foundation/x402/blob/main/specs/schemes/exact/scheme_exact_svm.md) | Scheme/policy và outcome riêng; chưa chạy interoperability |
| C1 | [Jupiter Lend README](https://github.com/jup-ag/jupiter-lend) | Dòng devnet programs May 2025 không khớp IDL của repo |
| C2 | [Builder report, 2024](https://solana.stackexchange.com/questions/16906/different-program-id-on-devnet-than-in-lib-declare-id) | User báo DeclareProgramIdMismatch; một case, không thống kê tỷ lệ lỗi |
| C3 | [Verified builds](https://solana.com/docs/programs/verified-builds) | Đã đọc chính thức sau lần timeout; kiểm reproducible binary/source, khác readiness manifest và quan sát RPC |
| C4 | [Loader state](https://github.com/anza-xyz/solana-sdk/blob/master/loader-v3-interface/src/state.rs) | Program/ProgramData và serialized header sizes; không chứng minh loader nào cũng tương tự |
| C5 | [getGenesisHash](https://solana.com/docs/rpc/http/getgenesishash), [getAccountInfo](https://solana.com/docs/rpc/http/getaccountinfo), [getTransaction](https://solana.com/docs/rpc/http/gettransaction), [clusters](https://solana.com/docs/references/clusters) | Methods, null/commitment, devnet và rate limits; public RPC là trust dependency |
| N1 | [Kora advisory GHSA-725g-w329-g7qr](https://github.com/solana-foundation/kora/security/advisories/GHSA-725g-w329-g7qr) | Case overcredit gross; affected 2.2.0, patched field None trong bản đọc; không suy mọi bản hiện hành còn lỗi |
| N2 | [Builder rounding report, 20/03/2024](https://stackoverflow.com/questions/78194696/compute-fee-for-solana-transfercheckedwithfee-instruction) | User báo lệch một raw unit; câu trả lời dẫn source, không thay source hiện hành |
| N3 | [Token-2022 fee source](https://github.com/solana-program/token-2022/blob/main/interface/src/extension/transfer_fee/mod.rs) | ceil/cap/inverse/epoch là oracle để đối chiếu thuật toán đề xuất |
| N4 | [Raydium guide](https://github.com/raydium-io/raydium-docs-v1/blob/main/algorithms/token-2022-transfer-fees.mdx) | Integrator phải phân biệt gross/net; snippet floor/older epoch sai với N3, không dùng để xác nhận API |
| N5 | [Transfer Fees](https://solana.com/docs/tokens/extensions/transfer-fees) | Withholding và authorities; không suy token mọi loại đều có extension |

## 7. Điểm chưa kiểm chứng và bước tiếp theo

Chưa có compile/deploy program, wallet flow, demo video, phép đo lợi ích user, verified build hay interview. Snapshot source/slot chỉ hỗ trợ phạm vi được ghi; không thay audit.

### Bài học / lỗi đã gặp

| Bẫy/lỗi thật | Xử lý |
| --- | --- |
| Công cụ web mặc định trả route_not_found | Chuyển connector search_service; lỗi công cụ không phải trang nguồn bị chặn |
| Gọi nhầm payment-identifier.md | 404; đọc directory rồi dùng payment_identifier.md, không bịa file |
| T3 của A có URL Reddit title sai đích | URL ID 1f66666 redirect sang bài hoàn toàn không liên quan; loại khỏi evidence, giao A sửa. URL 1f44444 timeout: ghi chưa xác minh, không khẳng định nội dung |
| Docs Raydium snippet dùng floor và condition epoch khác source | Ghi rõ mâu thuẫn, chọn source token; spike phải có counterexample 101/1% |
| Chưa có spike nhưng cần >=3 ý tưởng đạt | Giữ F3; làm thử đúng phạm vi bằng công cụ có sẵn hoặc sửa/bỏ ý tưởng, không nâng điểm bằng lời hứa |
| jsonParsed có thể chứa u64 dưới dạng JSON Number | Parser quote đọc mint base64; kiểm safe integer với slot/epoch. Snapshot jsonParsed cũ chỉ phục vụ tìm địa chỉ, không làm oracle số tiền |
| T6 trợ lý báo xong nhưng URL sai repo và thiếu nguồn độc lập | Trả lại T6 với URL chuẩn và tiêu chí kiểm nội dung; không lấy status xong thay xác minh evidence |
| Live discovery trả RPC -32015: transaction version 1 không được chấp nhận khi maxSupportedTransactionVersion=0 | RPC nêu rõ tham số cần là 1. Chỉ yêu cầu server trả jsonParsed để lấy địa chỉ mint, không tự deserialize/ký v1; quote vẫn đọc raw mint riêng. Ghi lỗi rồi chạy lại sau thay đổi, không gọi lần lỗi là live pass |
| Discovery getTransaction tiếp tục gặp HTTP 429 | Lưu log lỗi; đổi sang query filtered getProgramAccounts ít request. Không retry dồn dập và không coi failure là lỗi thuật toán fee |
| Query getProgramAccounts bị HTTP 403 | Không lặp query hay né quota; dùng địa chỉ đã công bố trong repo tác giả rồi đọc trực tiếp mint/epoch, vẫn cùng RPC devnet |
| Báo cáo quote dùng `{mint, ...quote}` làm config ghi đè địa chỉ mint | Đổi field config thành mintConfig; thêm regression test replay raw snapshot live giữ đúng địa chỉ. Snapshot đầu vẫn giữ nguyên, ghi rõ lỗi báo cáo; không sửa lịch sử artifact |

### Bổ sung thiết kế r1 — đọc 17/11/2026

ReceiptRail dùng native SOL cho demo cùng một invoice PDA, không tự nhận x402-compatible. [Solana transaction](https://solana.com/docs/core/transactions) xác nhận state rollback khi instruction fail (network fee vẫn có thể tính); [Anchor CPI](https://www.anchor-lang.com/docs/basics/cpi) có System transfer và [constraints](https://www.anchor-lang.com/docs/references/account-constraints) có init/seeds/signer/has_one/address. Đây là D1, chưa compile. Quyết định: merchant tạo điều khoản bất biến, payer được chỉ định ký pay; pay chuyển tiền rồi ghi Paid trong một transaction; không cung cấp close/update/reset. Chống merchant tạo **invoice ID khác cho cùng đơn** vẫn thuộc tầng ứng dụng, không được gọi invariant một lần toàn hệ thống kinh doanh. Upgrade authority và RPC là trust assumptions còn lại.

[Stripe idempotency API](https://docs.stripe.com/api/idempotent_requests) giải quyết retry trong dịch vụ Stripe; API v1 có retention của key và so parameters. So sánh C01 phải nói rõ chi phí rent/program/confirmation so với DB có unique key; DB là lựa chọn tốt nếu tất cả bên cùng tin operator. Không có bằng chứng user đòi custom program, nên S không lên 5 và V không là adoption.

C02 dùng [Anchor CLI](https://www.anchor-lang.com/docs/references/cli) và [verified builds](https://solana.com/docs/programs/verified-builds) làm baseline thật: IDL/verify đã tồn tại. C02 là manifest diff và snapshot có giới hạn, không phát minh source verification. Khả năng chứng minh ABI chưa có; UI phải giữ UNKNOWN kể cả mọi trường quan sát MATCH. Source verification chỉ mở rộng sau khi được phép toolchain, không là dependency đường demo read-only.

Review T6 bản 1200f54: đường dẫn đã đúng, nhưng diễn giải Shopify→Solana Pay là suy luận của A; StackOverflow nói rounding **token transfer fee**, không phải compute fee/CU. Không dùng lời diễn giải này thay source. Đã ghi yêu cầu sửa vào A-queue, C tiếp tục dùng ledger chính thức và artifact tự kiểm.

Review T4 tại `89f62b5`: danh sách không URL chưa đủ kiểm chứng; các lựa chọn ComputeBudget/unitsConsumed không giải token net, còn test mainnet nằm ngoài quyền. C đã giữ điểm dựa nguồn trực tiếp, không dùng report này làm evidence thuận. A được yêu cầu sửa, tiếp tục T5 đã giao; việc thiếu chất lượng crawl không chặn C hoàn thiện comparison riêng.

### Bài học từ review T11 — 18/11/2026

Bản A5b7abd5 có một issue và một spec, chưa đủ hai nguồn pain độc lập theo queue; alternatives thiếu URL và negative evidence chưa có nguồn. Status “xong” trong A-done không thay tiêu chí nhận. C ghi [findings](../reviews/receiptrail-codex.md), giao T14 bổ sung sau UX/review T12–T13; chưa mở lại URL trong lượt review này, không dùng report nâng điểm. State request Pending/Submitted/Unknown phải phân biệt Invoice Open/Paid/Cancelled; timeout không tự chứng minh payment thất bại. Giữ thiết kế Phase2 đã trình và cổng duyệt, không mở việc triển khai mới.

### Bài học từ review T14 — 18/11/2026

T14 tại b5092a4 vẫn trộn state request với Invoice và dùng reference thay đường đọc PDA của ReceiptRail. C đã mở body [issue452](https://github.com/x402-foundation/x402/issues/452) và [spec v1.1](https://solana.com/docs/tools/solana-pay/specification/version1-1#reference); giới hạn và findings tại [review T14](../reviews/receiptrail-codex.md). Không biến primitive tra cứu thành invariant chống trả lặp. Claim “đã tách state” phải khớp bảng/state machine thực tế, không chỉ câu xác nhận cuối báo cáo. Giao T15 sửa sau T12/T13; giữ điểm và cổng duyệt hiện hành.

### Bài học từ review T15 — 18/11/2026

T15/0ec4e94 đã tách nhóm Invoice/request và ghi issue452 thuộc EVM, nhưng report26dòng có3 alternatives và **0 URL HTTP(S)**; hai URL của T14 đã bị bỏ. Câu “đã bổ sung dữ liệu từ ledger” không chứng minh đã mở nguồn hoặc có2 pain reports độc lập. [Review T15](../reviews/receiptrail-codex.md#review-đầu-ra-t15--18112026-0521-utc7) ghi hash/phạm vi kiểm; C chỉ đọc report/ledger/thiết kế và đếm URL, không mở lại nguồn ngoài hoặc chạy runtime tests trong lượt này.

Tiêu chí sửa qua T20: mỗi claim trỏ URL đích, ngày thực sự mở, nội dung hỗ trợ và giới hạn; nguồn chưa truy cập phải ghi chưa xác minh. Giữ ngày của lượt đọc cũ riêng với ngày báo cáo, không coi note C là nguồn pain mới của A. Ba tên alternatives không thay ba nguồn có bằng chứng, và nhiều URL cũng không tự chứng minh nội dung. State hiển thị Expired cần điều kiện Open+slot; cancel thuộc merchant, đường đọc ReceiptRail là Invoice PDA cùng program/cluster/commitment. Giữ thiết kế và điểm hiện hành, không suy báo “xong” thành đạt.

### Bài học review T20 — 18/11/2026,05:42 UTC+7

T20/337322b đã có5 URL. C mở cả5đích thật; tác giả/ngày/phạm vi và kết luận hẹp nằm trong [review T20](../reviews/receiptrail-codex.md#t20-nguồn-đã-có-diễn-giảiphản-hồi-chưa-đạt). Shopify/issue452 độc lập về retry/outcome, không là evidence Solana double-payment hoặc adoption. Stripe hiện phân biệt API v1/v2; không áp dụng chi tiết retention/response v1 cho mọi API. payment_identifier đọc blob e85f0d53101aa7a4246b01d9f31f0e2b1ba24f12 có fingerprint/cache; chưa chạy implementation. Không suy A đã mở nguồn từ việc C truy cập được.

Report đổi mã R1–R4 và chỉ nói đã tách state nhưng không còn bảng/PDA/authority/commitment. Phản hồi review phải giữ ID gốc và trỏ nội dung thực; URL đúng chỉ là điều kiện ban đầu, không thay đọc/diễn giải. Giao T23, không tăng điểm hoặc đổi thiết kế; các phần thiếu được ghi rõ thay vì tick nhận toàn report.

### Bài học review T23 — 18/11/2026,07:58 UTC+7

T23/a82490a thêm đúng tác giả/ngày, nhãnEVM, nhóm Invoice/request và PDA; C mở lại5nguồn, issue chỉ đọc body, spec giữ blob e85f0d53101aa7a4246b01d9f31f0e2b1ba24f12. [Review T23](../reviews/receiptrail-codex.md#review-t23--18112026-heartbeat0758-utc7) ghi phần nhận vàT23-R1–R3 còn mở. Bảng có metadata đầy đủ hơn vẫn cần cơ chế/diễn giải đúng nguồn; idempotency key khác khóa xác thực API, và điều không bị bắt buộc không có nghĩa không thể xảy ra. Giữ từng findingID và trỏ evidence cụ thể thay gộp các nhóm khác nghĩa.

C không suy ngày A ghi là đã crawl, hai nguồn độc lập là adoption, hoặc bảng state ngắn đã bao phủ authority/commitment/Unknown. GiaoT26 sauT24/T25; giữ score79/F4, thiết kế và logs spike, không chạy implementation hoặc mởPhase3.

BảnT23v2/769d365 đến trước checkpoint: nhận cách nói “không đảm bảo tính duy nhất”, nhưng dòng19 dùng expiry `>` và Paid=finalized. Đọc source dòng65/test321/logr2:25 xác nhận đúng expiry đã cấm pay, vì thế hiển thị dùng Open+`>=`; state và commitment phải tách. [Bổ sung v2](../reviews/receiptrail-codex.md#bổ-sung-t23-v2-trước-checkpoint) giữ hash mới riêng, cập nhậtT26 hiện có, không rerun suite hoặc sửa code theo lỗi tài liệu.

### Bài học review T29 — 18/11/2026

T29/601e723 giữ 5 URL nhưng bỏ metadata nguồn và nhóm Request từng có; các câu “đã tách” trong phản hồi không khớp nội dung. [Snapshot](../evidence/phase2/receiptrail-t28-t29-review.json) giữ nguyên report; [review C](../reviews/receiptrail-codex.md#review-t28-và-t29--18112026-heartbeat1235-utc7) mở T29-E1–E3, giao T31 khôi phục provenance, cơ chế alternatives và state/commitment. Lượt này chỉ đối chiếu note, review cũ và source/log local, không crawl lại 5 URL. Giữ ID findings và dẫn mục thực có; khi patch phải kiểm cả phần từng được nhận để tránh mất bằng chứng. Không đổi điểm, thiết kế hoặc gọi report nộp là review đạt.

Bản306466f đến trước push khôi phục Request và nhãn idempotency key/fingerprint-cache; nhận phần này trong [review bổ sung](../reviews/receiptrail-codex.md#bổ-sung-bản306466f-trước-checkpoint--18112026). State/commitment, provenance/pain/mapping vẫn chưa đủ; không tiếp tục mô tả Request hiện hành là mất. Giữ snapshot601e723 riêng, cập nhật đầu vàoT31.

### Bài học review T31 — 18/11/2026

[T31/e483529](../reviews/receiptrail-codex.md#review-t31--18112026) giữ5URL/nhãnEVM/expiry đúng nhưng lại bỏ Request và cơ chế idempotency key/fingerprint-cache của306466f. Paid=finalized còn sai; bảng phản hồi ghi Request đã có trái nội dung, đổi nghĩa T29-E1 và thiếu10IDs gốc. [Snapshot](../evidence/phase2/receiptrail-t31-review.json) giữ đúng bytes/hash/6inputs; chỉ đối chiếu note/review nguồn cũ và source local, không crawl lại hoặc suy A đã mở nguồn.

Patch cần giữ phần đã nhận và so với revision trước; ngày cập nhật không là ngày truy cập, số URL không là provenance, PDA định danh không tự thực thi invariant. Giữ T32/T33 và phần sửa hẹp T31 cùng ID, không thêm vòng task; không đổi điểm/cổng/quyền hoặc rerun suite cho tài liệu.
