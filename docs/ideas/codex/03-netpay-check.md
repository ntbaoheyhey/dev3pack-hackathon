# C03 — NetPay Check: nhập số muốn nhận, kiểm số cần gửi

Codex · 17/11/2026 · RUBRIC v1.2 · **PLAN r1 — ĐẠT theo Codex, 77/100; chưa được giáo viên duyệt**. C03 là công cụ quote fee-only Token-2022 read-only. Có parser/arithmetic/live snapshot, chưa payment settlement hoặc UI hoàn chỉnh. Nguồn/SHA tại [021](../../learning/021-payment-cluster-evidence.md).

## 1. Người dùng, workflow và bằng chứng

Builder làm invoice/token payment hoặc người kiểm một transfer cần phân biệt số gửi gross với phần nhận spendable sau transfer fee. Workflow hiện tại thường nhập gross rồi đọc fee/net hoặc tự dùng SDK; khi muốn nhận đúng target phải tính ngược, xử lý ceil/cap/epoch và nhận biết loại mint ngoài scope.

| Nguồn đọc 17/11/2026 | Claim hỗ trợ | Giới hạn |
| --- | --- | --- |
| [Kora GHSA-725g-w329-g7qr](https://github.com/solana-foundation/kora/security/advisories/GHSA-725g-w329-g7qr) | Case credit gross mà chưa trừ transfer fee | Affected2.2.0, patched field None ở bản đọc; không khẳng định mọi bản Kora hiện hành lỗi hoặc đội sẽ tích hợp Kora |
| [Builder rounding report, 20/03/2024](https://stackoverflow.com/questions/78194696/compute-fee-for-solana-transfercheckedwithfee-instruction) | Người tích hợp gặp sai lệch raw token fee | Là transfer fee, **không compute-unit fee**; case lịch sử không phải API oracle |
| [Token-2022 source](https://github.com/solana-program/token-2022/blob/main/interface/src/extension/transfer_fee/mod.rs), blob b0b933fb4d158603a49f51aa64d7ccea0c657a6c | Ceil/cap/inverse và chọn schedule theo epoch | Cơ chế đã có, không phải sáng chế toán mới của đội |

Kora và report builder độc lập về vấn đề gross/net. Chưa có quan sát người dùng thử giải pháp. Phép kiểm lợi ích: 5 integrator làm 6 case (ceil, cap, epoch boundary, max u64, target không thể đạt, hook). So thao tác tính SDK/preview gross hiện tại với input target net. Đo chọn đúng gross và số case bị đánh dấu hỗ trợ sai; giữ chính xác câu trả lời quan trọng hơn tốc độ.

## 2. Alternatives và phần trùng lặp

| Lựa chọn | Đã giải tốt | Flow đề xuất / giới hạn comparison |
| --- | --- | --- |
| [Token-2022 fee module](https://github.com/solana-program/token-2022/blob/main/interface/src/extension/transfer_fee/mod.rs) | Có tính fee và inverse; đúng integer/epoch | C03 đóng gói user flow target net + provenance snapshot; không claim inverse mới hoặc tốt hơn source |
| [Ryntra SDK](https://github.com/ryntra-io/ryntra-solana-evidence/blob/main/packages/solana-evidence-sdk/README.md), blob eeab3768aabd819e42d75feaadeb4de5e5a66586 | Mint inspection, fee/net preview, hooks, policy và receipt verification; interface minh họa amountRaw | Đối thủ gần, scope rộng hơn. Chưa xác minh toàn repo có target-net inverse; không lấy điều chưa tìm thấy làm khoảng trống. C03 chỉ kiểm workflow target/minimal gross/replay rõ ràng |
| [Raydium guide](https://github.com/raydium-io/raydium-docs-v1/blob/main/algorithms/token-2022-transfer-fees.mdx), blob604c1836694897dd6985820c362db1c01f1ee299 | Hướng dẫn người tích hợp xử lý fee | Snippet rounding/epoch đã đối chiếu thấy khác upstream; C03 đưa counterexamples, không suy mọi code Raydium tính sai |
| [Solana transfer-fee guide](https://solana.com/docs/tokens/extensions/transfer-fees) + Explorer | Giải thích cấu hình/withholding, quan sát state/transaction | Baseline đọc/áp dụng guide cần thao tác tay; C03 không xác nhận transaction từ việc quote. Chưa chạy benchmark ví/Explorer, không nói mọi wallet thiếu preview |

N=3: đã so lựa chọn gần và có workflow/test cụ thể, nhưng overlap với Ryntra/SDK lớn và lợi ích khác biệt chưa rõ. Không nâng lên4 chỉ vì có thêm bảng. Nếu người dùng chọn, phải kiểm Ryntra source/interface sâu hơn trước khi bỏ công làm UI trùng lặp; có thể đóng góp upstream nếu phù hợp, không đổi mục tiêu thành fork rồi nhận là sản phẩm mới.

## 3. Vì sao Solana; on/off-chain và định dạng kết quả

Fee schedule/epoch thuộc Token-2022 mint trên Solana; một DB cấu hình bên ngoài có thể stale. Tool đọc mint và epoch trực tiếp, dùng integer cho raw units; không tạo token/program/PDA mới. Core là áp dụng đúng Solana token semantics cho user input, không thêm chain để trang trí. RPC vẫn là nguồn được tin trong một snapshot, không có cryptographic state proof.

Luồng dự kiến: chọn devnet + mint → nhập target raw hoặc decimal được parse exact → đọc epoch trước/mint/epoch sau → báo gross/fee/net, authority và slot/hash → export/replay. Không ví, không ký/gửi, không swap. Output phải ghi **chỉ tính transfer fee**, chưa kiểm sender/recipient token-account state, balance, freeze, memo/CPI policy hay settlement. Network fee SOL/CU không được cộng nhầm vào raw token fee.

| Account/dữ liệu | Kiểm tra / mức thực thi |
| --- | --- |
| Mint Token-2022 | Owner/program ID đúng, executable=false, initialized/COption/padding/type/TLV; parse raw base64 bằng BigInt, đã chạy |
| TransferFeeConfig | TLV1, 108bytes, authorities/withheld, older/newer schedule u64/bps; malformed/duplicate/unsupported reject, đã test |
| Epoch/slot RPC | Safe integer không âm, đọc before≤mint context≤after, cùng epoch; đổi epoch→yêu cầu đọc lại, đã test |
| Token accounts | **Không đọc/không chứng minh**; UI không xuất verdict transfer-ready |
| Quote record | target/gross/fee/net dạng chuỗi raw, decimals, mint address, mintConfig, selected schedule, hash/slot/time và mode live/replay |

Không instruction on-chain hoặc PDA của đội; việc ghi quote JSON local không phải receipt chứng minh thanh toán. MVP hỗ trợ **mint chỉ có TransferFeeConfig**; metadata/hook/confidential/extension khác trả unsupported, không đồng nghĩa những extension đó nguy hiểm. Fee authority có thể thay config; snapshot không cam kết quote tương lai.

## 4. Thuật toán và evidence D2

`fee(g)=min(ceil(g*bps/10000),cap)`, `net(g)=g-fee(g)`; tìm gross nhỏ nhất thỏa `net(g)≥target` trong u64. Binary search có oracle là inverse source và brute force miền nhỏ; reject target không thể đạt. UI parse decimal bằng chuỗi + decimals, không Number; phần UI chưa viết. Chọn newer khi current epoch≥newer.epoch, không nhầm older.

[16 tests](../../evidence/phase1/spikes-tests-r1-final.txt): tổng suite C02+C03, gồm 5.940 inverse cases, 744 brute force, parser âm, epoch/slot và replay. Không 16 live transfers. [Live artifact cuối](../../evidence/phase1/netpay-1794925658391.json), [stdout](../../evidence/phase1/netpay-fee-only-r1-final.txt): mint `HxDYFvcXnLuy4VdxXCooUXrch8DZW34oUteQ6N2EFxEr`, 283 ms, slot 523298709, epoch 1211; target 10000 → gross 10102 / fee 102 / net 10000 raw. Mint 6 decimals, 100 bps, cap 1000000000000. Hash và provenance Day50/53 ở note 021; 5 script hashes khớp worktree lúc review.

Mint có hook trả `unsupported_extensions:14`. Phép đọc không signer, writesToChain0. Discovery mặc định bị403 nên explicit mint là đường sample; không dựng mint giả thay live. Snapshot positive đầu có lỗi field config ghi đè address, đã sửa `mintConfig` và regression test; giữ artifact cũ. Đây là một phép đo read-only, không p95/confirmation benchmark.

## 5. Threat model, transitions và tests

Tài sản bảo vệ: quyết định số token và độ chính xác của lời giải thích, không giữ tiền/key. Attacker điều khiển input/mint bytes/metadata hoặc nguồn RPC. Không tự tin dữ liệu từ fixture/Explorer hơn primitive source.

| Bước / lỗi | Invariant / kiểm chứng / fallback |
| --- | --- |
| Input target/mint | Exact units, u64, valid32-byte key; reject scientific notation/decimal quá precision/âm; integer checks đã có, decimal UI cần tests |
| Raw mint→parsed | Owner/type/init/length/COption/zero padding/TLV duplicates/truncation/unknown reject; parser tests đã chạy; không tin jsonParsed Number cho u64 |
| Before→snapshot→after | Safe slot/epoch, không đổi epoch; error không trở thành quote. RPC retry có giới hạn do user yêu cầu, không retry storm |
| Parsed→quote | ceil/cap, gross minimal, target reachable; inverse và brute-force độc lập, kể cả100% fee/cap/zero/u64 overflow |
| Quote→hiển thị/export | Giữ address riêng với mintConfig; raw string và decimals song song, không gọi net là “đã nhận”; regression address đã có |
| Config đổi/stale | Render slot/time/authority, nút đọc lại; không hard-code TTL thành đảm bảo. Trước transfer người tích hợp phải re-read/revalidate ngoài scope |
| Hook/unknown extension | UNSUPPORTED kèm code, không đoán fee-only rồi cho transfer-ready; không tự fetch hook program ngoài scope |
| Replay / RPC lỗi | File snapshot có nhãn REPLAY, export hash/time; không trộn với LIVE. Lỗi read giữ input và báo chưa có quote |

Kiểm độc lập sau build UI: fixture không dùng chung hàm format/parse để tạo expected; replay raw mint và giữ boundary fee-only; test không import RPC vào unit path. 16 test không chứng minh R5 vì chưa reviewer độc lập, frontend chưa có và sample coverage hữu hạn. R4 là thiết kế transitions + negative plan + primitive đã đọc.

## 6. Dependencies, scope, critical path và kill

| Dependency | D-level | Rủi ro và fallback |
| --- | --- | --- |
| Node24.22.2, BigInt và parser built-in | D2, tests/raw replay | C giữ oracle fixtures; nếu browser thiếu BigInt thì báo unsupported, không fallback float |
| Token-2022 devnet mint/epoch RPC | D2 explicit sample thật, source layout đã đọc | Fee config có thể đổi, mint mẫu không phải controlled by team. Nhập mint fee-only khác có provenance; chưa tạo mint trước quyền; failure báo rõ |
| Fee arithmetic/inverse upstream | D2 đối chiếu 5.940 cases+brute force, chưa Rust compile | Pin source blob và fixtures; không upgrade semantics silently |
| Web/UI/static hosting | D1 note 005/template, chưa chạy | A làm exact decimal/replay UX theo contract; C review raw amounts và boundary. CLI prototype không thay gate web sau chọn |
| Wallet/payment SDK | Không dùng | Không có signer/settlement path; không cần SDK để demo read-only |

MVP: một mint + một target, fee-only, hai mode live/replay có nhãn, export và giải thích ceil/cap/epoch. Ngoài scope: payment execution, hooks, routing/swap, wallet permission analysis, network fee estimate, mainnet và price conversion. Giới hạn này phải hiện trong product flow vì ảnh hưởng quyết định của người dùng.

Ước lượng thêm 3h schema/exact input +5h UI +4h test/demo +8h buffer =**20 giờ công**; critical path schema→browser parser/format→live/replay→user test. Phần raw fee/epoch đã D2, nhưng chưa cả flow D3. Kill: bất kỳ case u64/epoch/minimal-gross sai phải sửa trước; không có live supported mint thì chưa live acceptance; nếu 5 integrator dùng SDK/Ryntra đã giải cùng workflow và không thấy lợi ích đo được thì bỏ sản phẩm độc lập, không claim calculator mới.

## 7. Demo 165 giây và phân phối

| Giây | Hành động / evidence |
| --- | --- |
| 0–20 | Muốn nhận một số token, nhưng gross không bằng net; nói rõ fee token khác fee SOL |
| 20–55 | Đọc mint devnet đã có, nhập target; show gross/fee/net với raw units và slot |
| 55–85 | Counterexample fixture gross 101/1%: ceil fee 2 nên net 99; tìm gross tối thiểu cho target 100; banner fixture |
| 85–115 | Epoch boundary từ fixture và mint hook live bị unsupported; không giả một epoch thật vừa chuyển |
| 115–140 | RPC lỗi có chủ ý rồi mở replay snapshot có hash/time, giữ nhãn stale/replay |
| 140–165 | Boundary không settlement/balance, sources/tests và cách dùng output trong bài học/integration |

Chưa quay video, chưa thử người xem. Một form, một kết quả và expandable explanation; không bắt connect ví. Nếu người dùng hiểu net là tiền chắc chắn nhận được, UX chưa đạt dù số học đúng.

5 user dự kiến: 2 integrator Token-2022, 2 builder invoice/paymaster, 1 người viết tutorial. Kênh: cộng đồng Solana developer/Superteam và thảo luận nguồn khi được phép outreach; **chưa gửi tin/issue**. Metric: giải đúng6 cases, hiểu boundary, số request muốn dùng trong integration; không dùng stars làm product proof. OSS MIT, hosting tĩnh/RPC theo nhu cầu, không thu custody; chi phí provider có thể xuất hiện nếu scale, chưa báo giá. V3 là kế hoạch, không traction.

## 8. Gates và điểm r1

| Gate | PLAN | Lý do |
| --- | --- | --- |
| G1 | pass | Core dựa Token-2022 mint/epoch thật, không cần program mới |
| G2 | pass | Code tự viết, source docs có link, MIT/public trước nộp |
| G3 | pass | 165s, fixture/live/replay rõ, chưa video |
| G4 | pass | Supported mint/epoch/quote D2; UI D1; discovery không bắt buộc, không signer/SDK ngoài |
| G5 | pass | Reject unsupported, exact integers, no signing; scope/unknown không bị che |
| G6 | pass | Solana track và before/during disclosure; chưa claim partner eligibility |

| Mã | Điểm | Evidence / trần |
| --- | ---: | --- |
| P | 4 | Mục1: advisory + builder report độc lập, workflow/metric; chưa user validation |
| S | 4 | Mục3: mint/epoch semantics, DB stale và trust/boundary; chưa integration xác nhận5 |
| N | 3 | Mục2: có alternatives/flow, overlap với Ryntra/SDK chưa đủ chứng minh khác biệt mức4 |
| F | 4 | Mục4/6: integer/TLV/epoch/live D2 và ngân sách; chưa UI/settlement D3 |
| R | 4 | Mục5: transitions/input/stale/unsupported/replay và oracle; không audit5 |
| D | 4 | Mục7: nhịp165s, counterexample hữu ích và recovery; chưa user-tested5 |
| V | 3 | Mục7: 5 người/kênh/metric; không adoption |

| Vòng | P | S | N | F | R | D | V | Tổng | Thay đổi |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| r0 | 4 | 4 | 2 | 3 | 3 | 3 | 2 | 64 | Chưa đạt |
| r1 | 4 | 4 | 3 | 4 | 4 | 4 | 3 | **77** | So competitors, spike raw/live, threat/demo/distribution; ĐẠT PLAN theo Codex |

Tổng `(80+60+30+80+60+60+15)/5=77`, mọi sàn đạt. Nếu P hoặc F phải giảm một mức, tổng 73 và phải sửa/chấm lại, không giữ nhãn ĐẠT. R2–r3 còn để xử lý findings vật chất; không reset ID. ĐẠT PLAN không phải payment product hay Phase 3 hoàn thành.
