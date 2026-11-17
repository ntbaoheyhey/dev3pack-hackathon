# C02 — ClusterProof: kiểm deployment trước khi nối client

Codex · 17/11/2026 · RUBRIC v1.2 · **PLAN r1 — ĐẠT theo Codex, 79/100; chưa được giáo viên duyệt**. Có spike đọc devnet, chưa có web/CLI sản phẩm hoàn chỉnh. Ledger: [021](../../learning/021-payment-cluster-evidence.md), [catalog](../../evidence/phase1/README.md).

## 1. Người dùng và evidence vấn đề

Builder hoặc reviewer sắp nối một client/IDL vào program Solana cần biết mình đang nhìn đúng deployment và những phần nào **chưa** được chứng minh. Hiện họ đọc README, đổi RPC/ID, xem Explorer, fetch IDL rồi thử transaction; một địa chỉ tồn tại hoặc IDL hash khớp không chứng minh ABI tương thích.

| Nguồn, đọc 17/11/2026 | Claim trực tiếp | Giới hạn |
| --- | --- | --- |
| [Jupiter Lend README](https://github.com/jup-ag/jupiter-lend), blob e7f98afb5889d54857c7a78cd2e59ecdb6014300 | Maintainer nêu devnet programs May2025 không khớp IDL hiện tại | Một dependency cụ thể; không suy mọi devnet sai, không lấy mainnet để né scope |
| [Builder report, 2024](https://solana.stackexchange.com/questions/16906/different-program-id-on-devnet-than-in-lib-declare-id) | Người tích hợp gặp DeclareProgramIdMismatch | Báo cáo lịch sử, không phải bug consensus hoặc thống kê tần suất |
| [Verified builds](https://solana.com/docs/programs/verified-builds) | Deployment giữa các cluster có thể khác nhau; verify cần đúng binary/source/network | Chứng minh cơ chế kiểm có sẵn, không phải khách hàng đã muốn ClusterProof |

Hai nguồn đầu độc lập hỗ trợ friction khi xác định deployment. Chưa phỏng vấn builder. Phép kiểm lợi ích sau UI: 5 builder được cùng bộ manifest đúng/sai và IDL chưa attested; so workflow CLI/Explorer hiện tại với report một màn hình. Đo mismatch bỏ sót, số lần kết luận sai ABI đã kiểm, thời gian tìm đúng field; không hứa tiết kiệm X phút.

## 2. So lựa chọn hiện có

| Lựa chọn đã đọc | Đã giải tốt | Flow C02 bổ sung / đánh đổi |
| --- | --- | --- |
| [Anchor CLI: idl/account/verify](https://www.anchor-lang.com/docs/references/cli) | Fetch/decode IDL/accounts, verify bytecode/artifact; không nên xây lại compiler/verifier | Một report theo manifest khóa genesis/ID/loader/ProgramData/upgrade/IDL artifact, giữ UNKNOWN riêng. Không thay kết quả Anchor verify bằng hash tự tính |
| [Solana Verify CLI](https://solana.com/docs/programs/verified-builds) | Reproducible binary/source comparison, nguồn và version có thể pin | C02 không cần build để chỉ ra mismatch cấu hình; sourceVerification=NOT_RUN cho tới có attestation riêng. Khi cần source proof, dùng verifier sẵn có |
| [Solana RPC account view](https://solana.com/docs/rpc/http/getaccountinfo) + [Explorer devnet](https://explorer.solana.com/?cluster=devnet) | Người dùng xem account/cluster/metadata, tự đối chiếu | Baseline so sánh là **quy trình đọc tay các field**, không khẳng định Explorer không có mọi loại report. C02 xuất cùng snapshot và checklist expected/observed/missing để review/CI |
| Script tự viết trong repo | Đội có thể tự pin IDs, RPC và hash, ít dependency | C02 đóng gói schema/report/replay và trạng thái evidence; nếu script nội bộ đã đủ thì không cần chuyển sản phẩm |

Khác biệt có thể kiểm là **manifest diff dùng cho review với provenance và UNKNOWN giữ riêng**, không phải phát minh verification hay đoán ABI từ IDL. Thử một manifest bị thay genesis/ID/hash và một thiếu IDL: report phải chỉ đúng field, không tô xanh toàn bộ. So ≥3 lựa chọn/workflow và cách thử cụ thể hỗ trợ N4 PLAN; chưa đo lợi ích hoặc có moat/adoption, không N5.

## 3. Solana, kiến trúc và account model

Core là đọc executable/program deployment trên Solana để tránh tích hợp nhầm state; DB lưu tên program không thay được account hiện tại. Không cần program mới, PDA riêng hoặc transaction mới. G1 nằm ở Solana runtime state đang kiểm, không ở việc ghi thêm receipt lên chain.

Luồng: chọn manifest được reviewer chấp nhận → nhập program/IDL artifact → đọc devnet → compare → report và export JSON. Off-chain toàn bộ parser/hash/UX; chain là nguồn observation, **không phải RPC trustless proof**. Manifest và RPC cùng sai vẫn có thể MATCH; nguồn manifest phải được ghi (repo/commit/người chấp nhận), cùng-RPC baseline chỉ OBSERVED_ONLY. Không lấy URL RPC do người khác đưa để gọi từ backend tùy ý; MVP khóa devnet endpoint, không signer.

| Account / dữ liệu | Cách đọc và giới hạn |
| --- | --- |
| Program | `getAccountInfo`, owner loader-v3, executable=true, tag/layout; lấy pointer ProgramData |
| Program + ProgramData | `getMultipleAccounts` cùng context; xác nhận pointer không đổi từ discovery; minContextSlot không đi lùi |
| ProgramData | Owner loader-v3, tag/header, upgrade slot/authority, length; hash toàn account tách payload có padding |
| IDL file local | Hash exact bytes, size/schema/version validation trong MVP; **hash không chứng minh ABI on-chain** |
| Manifest local | schemaVersion, genesisHash, programId, loader/ProgramData, expected upgrade/hash và idlSha256 nếu có; expected thiếu→UNKNOWN |

Loader v3 source và header 36/45 bytes đã đối chiếu trong note 021. Loader khác→UNSUPPORTED, không suy lỗi deployment. ProgramData lấy pointer do loader lưu, không tự đoán PDA seeds từ tên. RPC hiện dùng getGenesisHash/getAccountInfo/getMultipleAccounts; không gọi CPI/tx/signature, không thay dữ liệu trên chain.

Report planned gồm trường kiểm, expected/observed, nguồn expected, endpoint host, commitment/slot/time và hashMeaning. Kết quả từng field: MATCH/MISMATCH/UNKNOWN; kết quả capture: OBSERVED/UNSUPPORTED/ERROR. ABI compatibility và source verification là hai trục riêng; không có nhãn “an toàn” từ việc mọi field MATCH. Export snapshot là bytes/report quan sát, không ký attestation của nhà phát hành.

## 4. Spike D2 đã chạy và phần còn thiếu

[cluster-1794924487174.json](../../evidence/phase1/cluster-1794924487174.json): `node research/phase1/cluster-proof.mjs`, 747 ms, slot 523293811, ProgramData 711053 bytes của Token-2022 devnet. Phát hiện 5 **fixture mutations** ở expected manifest: genesis, programId, owner, upgradeSlot, payload hash. Không upgrade/mutate program thật. Baseline cùng RPC là OBSERVED_ONLY, ABI UNKNOWN, source NOT_RUN. Một lần đo không phải latency guarantee.

[16-test log](../../evidence/phase1/spikes-tests-r1-final.txt) bao gồm base58 vectors, loader owner/type/length, hash metadata/payload và missing manifest/IDL. Đây là tổng suite C02+C03, không phải 16 test riêng C02. Script lúc capture và current export-only change được lưu bằng Git/hash; không coi script hash mới là hash của lần chạy cũ.

Chưa có upload UI, schema validator hoàn chỉnh, CLI args/exit contract, multi-endpoint consistency hoặc source attestation. F4 dựa phần khó **read-only capture/parse/compare**, không dựa sản phẩm end-to-end hay custom program.

## 5. Threat model và transition/test plan

Tài sản bảo vệ: quyết định tích hợp đúng deployment và việc không phát hành report gây hiểu nhầm. Attacker có thể gửi manifest/IDL giả, bytes sai, RPC URL chứa key hoặc dữ liệu rất lớn. Không có funds/key để custody.

| Transition / lỗi | Invariant / test / fallback |
| --- | --- |
| Input→validated | Giới hạn size, base58 decode32 bytes, schemaVersion rõ, u64 dạng string; unknown field không tự thành trusted. Path/URL không tự thực thi hoặc fetch |
| Validated→capture | Endpoint devnet allowlist; timeout/null/HTTP error không trở thành MATCH; hiển thị error có thời điểm. Không retry dồn dập |
| Discovery→paired read | Program pointer/owner/type phải nhất quán; slot là safe integer không lùi; thay pointer→reject/re-read giới hạn một lần |
| Capture→comparison | Chỉ so fields có cả expected/observed; thiếu→UNKNOWN; hash payload có padding không gọi verified-build hash |
| Comparison→export | Giữ provenance/time/slot và meaning; label đủ cả ABI/source. Không export endpoint có credentials; không gán attestation/signature giả |
| Upgrade sau snapshot | Report cũ vẫn là observation tại slot cũ; re-read trước tích hợp. Đổi upgrade authority/slot được hiện riêng, không trộn metadata với payload hash |
| Malicious RPC hoặc manifest | MATCH không xác nhận truth; reviewer chọn nguồn expected, so endpoint độc lập khi cần. Dữ liệu không đồng nhất→không kết luận |
| Replay offline | Dùng snapshot đã lưu và hash; banner REPLAY, không giả live hoặc fresh |

Acceptance độc lập: known loader vectors + reviewed source layout; 5 sai lệch expected chỉ ra đúng field; thiếu IDL/attestation luôn UNKNOWN; malformed/truncated/oversized/null và slot không an toàn trả lỗi. Actual hash comparison dùng byte fixture cố định; không kiểm bằng snapshot được tạo từ cùng hàm rồi gọi proof độc lập. Live test đã chạy là observation, không chứng minh RPC trung thực. R4 là thiết kế đầy đủ; chưa independent audit nên không R5.

## 6. Dependency, scope và ngân sách

| Dependency | D-level / evidence | Rủi ro và fallback |
| --- | --- | --- |
| Node24.22.2 built-in | D2, suite và spike chạy | C giữ module không package; browser hash/parser phải test cùng vectors trước dùng |
| Public devnet RPC + loader-v3 | D2, artifact đọc thật/source | Quota/upgrade/staleness; lỗi rõ, endpoint devnet khác do người dùng cấu hình có kiểm, snapshot replay chỉ phục vụ explain |
| Expected manifest/IDL artifact | D1 schema thiết kế; fixture compare D2 | Không có trusted expected vẫn report observed-only; không tuyên bố compatibility. Reviewer chỉ nhập artifact có provenance |
| Static UI/hosting | D1 theo note 005/template docs; chưa build | A, web chỉ đọc; CLI/export là bản kiểm logic trước UI, không thay gate web khi đã chọn |
| solana-verify/Anchor verify | D1 tài liệu, **optional** | Chưa cài; link sang verifier khi người dùng cần source proof, không là critical dependency của C02 |

Scope MVP: một program loader-v3 mỗi report, một IDL file tùy chọn, devnet, share/download JSON và manual manifest. Ngoài scope: mainnet, scan hàng nghìn program, security audit, automatic ABI compatibility, monitoring/alerts liên tục, deploy/upgrade/signing.

Ước lượng 4h schema/parser hardening + 5h UI/CLI + 3h tests/recovery/demo + **8h buffer =20 giờ công**. C làm parser/report/tests, A làm màn hình/UX; đi từ schema→capture→comparison→UI→demo. Phần khó đã spike D2, còn thời gian dự phòng là kế hoạch, không throughput đo được.

Kill criteria: report không giữ UNKNOWN riêng hoặc chưa có cách phân biệt trusted manifest với observed baseline thì chưa release; nếu 5 builder dùng CLI đã tìm đúng mọi field với công sức tương đương và không muốn export/review, không thêm dashboard để cứu ý tưởng. Loader chưa hỗ trợ phải unsupported; không chuyển mainnet để có demo đẹp.

## 7. Demo 165 giây và 5 user đầu

| Giây | Hành động / evidence |
| --- | --- |
| 0–20 | Tình huống README/IDL khác deployment, nguồn Jupiter gắn nhãn case lịch sử |
| 20–50 | Nhập program devnet + manifest, capture live có slot/time; chọn report observed-only nếu expected chưa trusted |
| 50–85 | Thay expected hash/genesis bằng fixture sai có nhãn; report khoanh mismatch, không nói chain bị hack |
| 85–115 | Bỏ IDL/attestation: ABI UNKNOWN dù program tồn tại; nêu verifier sẵn có để kiểm source |
| 115–140 | Simulate RPC timeout hoặc replay artifact đã lưu với banner; export report để reviewer đọc |
| 140–165 | Giải thích một màn hình expected/observed/unknown và trust boundary; links source/tests |

Chưa có video/UX chạy; action plan tối đa nhập, kiểm, export; không ví/login. Recovery giữ input và chỉ retry khi người dùng yêu cầu, không quét nền. Snapshot latency747 ms chỉ là một observation, không hứa tốc độ demo.

5 user dự kiến: 2 maintainer SDK/IDL, 2 builder hackathon vừa nối program, 1 reviewer qua Solana Stack Exchange/Superteam hoặc cộng đồng developer. Chưa nhắn ai; chuẩn bị bài thử 3 manifest có consent sau khi user cho phép outreach. Metric: mismatch recall, false confidence ABI, task completion/time, số người muốn dùng report trong PR. OSS MIT, web tĩnh và public RPC giới hạn; không có SLA, không hứa doanh thu, paid integration chỉ là giả thuyết sau nhu cầu. V3 chưa adoption.

## 8. Gates và điểm

| Gate | PLAN | Lý do |
| --- | --- | --- |
| G1 | pass | Core đọc Solana executable/deployment; không cần program mới để có giá trị |
| G2 | pass | Source tự viết/MIT, plan public trước nộp; license nguồn trích/link rõ |
| G3 | pass | Storyboard165s, live/fixture/replay phân biệt; chưa video |
| G4 | pass | Capture/compare D2, UI D1; verifier optional, không yêu cầu quyền signer/toolchain để chạy read-only core |
| G5 | pass | No signer/tx, threat/report honesty/size/URL boundaries ở mục5; chưa audit |
| G6 | pass | Track Solana, phân biệt trước/trong hackathon; partner/giờ UTC chưa tự gán |

| Mã | Điểm | Evidence / trần |
| --- | ---: | --- |
| P | 4 | Mục1: Jupiter và builder report độc lập, có workflow/metric; chưa user experiment |
| S | 4 | Mục3: runtime state không thay bằng DB tên, trust RPC/manifest rõ; chưa integration xác nhận mức5 |
| N | 4 | Mục2: ≥3 alternatives, manifest/provenance/UNKNOWN workflow kiểm được; không source-verifier novelty |
| F | 4 | Mục4/6: capture/compare D2 có log747 ms và phạm vi20h; chưa end-to-end D3 |
| R | 4 | Mục5: transition/stale/manifest/RPC/replay/oracle rõ; PLAN, chưa audit |
| D | 4 | Mục7: 165s, mismatch/unknown/recovery ít thao tác; chưa test người xem |
| V | 3 | Mục7: 5 người đầu/kênh/metric; chưa liên hệ hoặc adoption |

| Vòng | P | S | N | F | R | D | V | Tổng | Thay đổi |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| r0 | 4 | 4 | 3 | 3 | 3 | 4 | 2 | 69 | Chưa đạt; chưa spike |
| r1 | 4 | 4 | 4 | 4 | 4 | 4 | 3 | **79** | Spike + comparison + risk/transitions + phân phối; ĐẠT PLAN theo Codex |

Tổng `(80+60+40+80+60+60+15)/5=79`; sàn đạt, không gate pending trọng yếu trong phạm vi PLAN. Nếu N giảm3 còn77; nếu F giảm3 còn75; cả hai giảm còn73 nên phải review lại. ĐẠT không có nghĩa verified build hay Phase 1/2 đã xong.
