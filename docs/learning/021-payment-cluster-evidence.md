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

Kế hoạch spike (chưa chạy khi viết note):

1. C02: đọc program thật devnet; dựng expected manifest cố ý sai từ snapshot, checker phải phát hiện sai genesis/address/owner/hash và giữ ABI = unknown. Timeout/null/unsupported không được coi là pass.
2. C03: module arithmetic dùng BigInt, oracle inverse độc lập; kiểm zero/100%/cap/rounding/overflow/epoch. Đọc một mint TransferFee trên devnet nếu tìm được qua số request giới hạn; không tạo token thay vì không tìm được.
3. Lưu lệnh, thời gian, public RPC metadata và kết quả dưới docs/evidence; file data dùng .json chỉ chứa dữ liệu công khai, không keypair. Script ở research/phase1, không scaffold app/product.
4. Chỉ nâng F lên 4 nếu spike đúng phần khó của phạm vi **read-only** đã chạy và có log. Không suy thành F4 cho custom program C01 hoặc Phase 3 đã hoàn thành.

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
| R4 | [Solana Pay spec](https://docs.solanapay.com/spec) | Reference là account key để tìm payment; đọc/spec làm baseline, không ngụ ý chưa ai có invoice app |
| R5 | [Exact SVM spec](https://github.com/x402-foundation/x402/blob/main/specs/schemes/exact/scheme_exact_svm.md) | Scheme/policy và outcome riêng; chưa chạy interoperability |
| C1 | [Jupiter Lend README](https://github.com/jup-ag/jupiter-lend) | Dòng devnet programs May 2025 không khớp IDL của repo |
| C2 | [Builder report, 2024](https://solana.stackexchange.com/questions/16906/different-program-id-on-devnet-than-in-lib-declare-id) | User báo DeclareProgramIdMismatch; một case, không thống kê tỷ lệ lỗi |
| C3 | [Verified builds](https://solana.com/docs/programs/verified-builds) | Trang lần mở trực tiếp timeout; phần indexed và repo source sẽ đối chiếu trước dùng chi tiết lệnh |
| C4 | [Loader state](https://github.com/anza-xyz/solana-sdk/blob/master/loader-v3-interface/src/state.rs) | Program/ProgramData và serialized header sizes; không chứng minh loader nào cũng tương tự |
| C5 | [getGenesisHash](https://solana.com/docs/rpc/http/getgenesishash), [getAccountInfo](https://solana.com/docs/rpc/http/getaccountinfo), [getTransaction](https://solana.com/docs/rpc/http/gettransaction), [clusters](https://solana.com/docs/references/clusters) | Methods, null/commitment, devnet và rate limits; public RPC là trust dependency |
| N1 | [Kora advisory GHSA-725g-w329-g7qr](https://github.com/solana-foundation/kora/security/advisories/GHSA-725g-w329-g7qr) | Case overcredit gross; kiểm patch hiện hành riêng nếu tích hợp Kora |
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
