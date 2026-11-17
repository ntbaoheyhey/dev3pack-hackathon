# ARCHITECTURE — ClusterProof

Codex · 17/11/2026 · bản thiết kế v0.1 để review Phase2. Lựa chọn tại [DECISION](ideas/DECISION.md), scope [IDEA](IDEA.md). **Chưa được giáo viên/người dùng duyệt; chưa phải mô tả sản phẩm đã build.** Tài liệu học trước thiết kế: [021](learning/021-payment-cluster-evidence.md), [022](learning/022-phase2-3-independent-prep.md), 004/005/007/016.

## 1. Giải thích một trang

Một địa chỉ program đúng cú pháp chưa bảo đảm app đang nối đúng phiên bản. ClusterProof đọc deployment devnet rồi đặt cạnh manifest mà reviewer chọn. Mỗi field có expected, observed và kết quả; thiếu expected thì UNKNOWN. Hash IDL chỉ cho biết file nào đã đưa vào, không chứng minh binary dùng cùng ABI. Hash payload loader có padding không phải verified-build hash.

Core không viết chain và không giữ ví. Nó không thay Anchor verify/Solana Verify; khi cần source proof phải dùng phương pháp đó và kiểm provenance riêng. Manifest nhập từ cùng RPC không trở thành trusted chỉ vì khớp. Snapshot có thời điểm/slot, program có thể upgrade sau đó; người tích hợp phải đọc lại trước sử dụng. RPC timeout là chưa biết, không là program hỏng.

Ba phần: (1) validate input/provenance; (2) capture và parse bytes, compare fields; (3) report/replay/export. C sở hữu core/schema/tests; A làm UI theo contract. Program hello Phase3 chỉ để học build/test/deploy và wallet, không dùng làm cơ sở chứng nhận các program khác.

## 2. Sơ đồ và ranh giới

```mermaid
flowchart LR
  U[Builder / reviewer] --> I[Input ID + manifest + IDL optional]
  I --> V[Validate local input]
  V --> R[Devnet RPC adapter]
  R --> P[Program / ProgramData parser]
  P --> C[Compare expected and observed]
  V --> C
  C --> O[Report fields + unknown axes]
  O --> E[Export JSON]
  E --> L[Replay local snapshot]
  L --> O
```

Input và RPC không đáng tin tự động. Không backend bắt buộc, database/indexer/login/signer/transaction nào trong đường core. Web static client dùng endpoint devnet cấu hình cố định; secrets provider không được nhúng browser. Nếu public RPC quota/CORS không đáp ứng, phải chọn provider có public client policy hoặc proxy allowlist với secret phía server và review lại kiến trúc, không lách bằng arbitrary URL fetch.

## 3. Modules, runtime và phụ thuộc

| Module / vị trí dự kiến | Trách nhiệm | Chủ |
| --- | --- | --- |
| packages/cluster-proof-core | Types/schema, loader parser, hash meaning, comparison/replay | C |
| packages/cluster-proof-rpc | Timeout/size/safe integers/paired snapshot/genesis rules; dependency injected transport | C |
| apps/web | Input/report/replay/export; accessibility/mobile, explanation | A, C review report semantics |
| research/phase1 | Spike/evidence bất biến và oracle fixtures; chưa tự gọi product-ready | C |
| programs/phase3-hello + Anchor workspace | Lab hello và tests; không product dependency | C |
| docs/evidence/phase3 | Version/build/test/CI/devnet/public web evidence | C/A theo phần |

Chốt Node24 hiện có cho web/core. UI dùng React/Next hoặc Vite template được pin sau T5; trước scaffold cần lock dependency và cắt mainnet/default signing. Core không phụ thuộc Anchor client. Lab Anchor giữ bộ 003 đã được user cho phép; không trộn @anchor-lang/core/web3.js1.x với Kit8 types bằng cast. Bản v0.1 để ngỏ lựa chọn UI template giữa hai bản đã đọc; C chốt dựa T5 và build thực trước ghi kiến trúc final.

## 4. Account, PDA, instruction, event và IDL

**Product core: không custom program/PDA/instruction/event/IDL mới.** Program account loader-v3 có pointer ProgramData; parser kiểm owner/type/executable/size. ProgramData có upgrade slot/authority và bytes executable+padding. Đọc program và ProgramData cùng getMultipleAccounts, giữ context slot và xác nhận pointer không đổi. Loader khác→unsupported; không suy PDA tự tính từ program name.

Input IDL là artifact exact bytes, có address/schema checks và hash; provenance có thể thiếu. Event/IDL không chứng minh state đã commit hoặc ABI đúng; source attestation chưa là tính năng MVP. RPC chỉ getGenesisHash/getAccountInfo/getMultipleAccounts; không getProgramAccounts scan toàn cluster.

Lab Phase3 có instruction hello (tên cuối theo source đã build), program ID thật sau tạo keypair lab, log/response để test invocation; không nhận user funds hoặc lưu dữ liệu sản phẩm. IDL lab sinh từ build, không viết JSON giả làm generated IDL. Fee payer/program keypair dành riêng devnet, ngoài Git; quyền upgrade chưa revoke. Test lab không được dùng nâng F/R của feature product chưa triển khai.

## 5. Contract v1 dự thảo

| Thành phần | Fields / nghĩa |
| --- | --- |
| Input | schemaVersion=1, cluster=devnet, programId(base58 32bytes), optional expected manifest, optional IDL bytes; manifest max64KiB, IDL max1MiB (ngân sách đề xuất, chưa benchmark) |
| Expected | genesisHash/programId/programDataAddress/owner/upgradeSlot/upgradeAuthority/accountSha256/payloadSha256WithPadding/idlSha256; provenance repo/commit/reviewer label; thiếu field hợp lệ nhưng UNKNOWN |
| Observation | rpcHost, genesisHash, programId, programDataAddress, owner, executable, contextSlot safe integer, commitment=finalized, runAtUtc, upgradeSlot dạng chuỗi u64, authority|null, length và hashMeaning |
| Check | field, expected?, observed?, status MATCH/MISMATCH/UNKNOWN, reason; null authority là giá trị biết được, khác field thiếu |
| Report | schemaVersion, mode LIVE/REPLAY, capture status, observation, checks, abiCompatibility=UNKNOWN/sourceVerification=NOT_RUN, expectationTrust OBSERVED_ONLY/USER_ACCEPTED, warnings; USER_ACCEPTED không là cryptographic trust |
| Error | stable code, userMessage, retryable, optional safe details; không URL chứa credential/stack trace trong export |

Số u64 raw dùng string, không JSON Number đã làm tròn. Slot API bắt buộc safe integer; export format exact byte/hash rõ canonicalization, không gán integrity proof khi chưa có raw data. Product replay phải chứa raw accounts hoặc tham chiếu byte artifact xác minh được, giới hạn total8MiB và đọc streaming; spike hiện chỉ reject response>6MB sau load, cần harden trước product. Schema hiện là draft contract, chưa validator chạy.

Không all-green safety verdict. Summary chỉ đếm mismatch/missing, luôn hiển thị ABI/source axes. IDL hash missing hoặc expected unknown không thành mismatch giả. Label debug kỹ thuật nằm trong phần mở rộng; câu chính giải thích hành động tiếp theo.

## 6. State/UX và phục hồi

| UI state | Trigger | Next / điều không được làm |
| --- | --- | --- |
| idle/editing | Nhập ID/manifest | Validate, lỗi field hiển thị tại chỗ |
| capturing | Validate pass, user nhấn Kiểm tra | Disable duplicate request; AbortController timeout/cancel; không ký hoặc tự retry nền |
| report | Capture/compare xong | Có slot/time, mismatch/missing; export/re-read có chủ ý |
| unsupported | Loader/type ngoài scope | Giải thích chưa hỗ trợ, không tô program nguy hiểm |
| error | Null/RPC/malformed/pointer đổi | Giữ input; retry nếu lý do cho phép, không copy report cũ thành kết quả mới |
| replay | User chọn snapshot local | Banner REPLAY + capture time, không nút gợi ý đây là trạng thái chain hiện hành |

Wireframe: header Devnet + mục đích; form Program ID, expected manifest/IDL optional; nút Kiểm tra. Report gồm câu ngắn “2 mục khác / 1 mục chưa đủ dữ liệu”, bảng expandable expected/observed, thẻ ABI và source riêng, thời điểm + Export/Đọc lại. Lỗi có một hành động phục hồi. C02 core không hiện Connect Wallet; lab Phase3 đặt trang riêng `/lab` với giải thích đây là bài học, devnet-only. T5 cung cấp mẫu UX nhưng không tự đổi contract.

## 7. Threat model và test matrix

| Threat | Boundary / test oracle |
| --- | --- |
| Fake expected manifest | Provenance user-accepted, không tự trust; test expected thiếu/giả và OBSERVED_ONLY |
| Malicious/stale RPC | Owner/layout/genesis/slot/pointer checks, finalization; không cryptographic proof, compare endpoint độc lập là mở rộng |
| Upgrade giữa hai đọc | Re-read cùng pair và so pointer; test adapter trả pointer khác, reject |
| Hash gây nhầm source/ABI | UI/schema tests luôn giữ unknown axes, hashMeaning exact; review text không chứa kết luận an toàn |
| Oversized/invalid local files | Bound bytes trước parse; JSON depth/shape/type constraints, no eval; fuzz truncation/duplicate keys policy ở validator |
| SSRF/credential leak | Core browser endpoint allowlist; không server fetch arbitrary URI hoặc xuất full private RPC URL |
| Script injection từ labels | React text rendering, không raw HTML; file names/provenance là data |
| Secret/privileged CI | Không wallet/keys trong PR jobs; least privilege và pinned deps; không upload target/deploy keypair |
| Replay bị trình là live | Mode/time immutable trong report, snapshot file integrity check; UI acceptance |

Unit/runtime/UI/live layers theo note022. C02 actual spike chỉ bao phủ một phần parser/compare; mỗi task phải bổ sung tests đúng requirement, không chỉ unit mirror implementation. Tests âm xác nhận lỗi đúng nguyên nhân và state/output không optimistic. Không R5/audit claim trước reviewer độc lập.

## 8. Chia việc và quy trình phối hợp

| Phase / việc | C | A | Done evidence |
| --- | --- | --- | --- |
| 2 | Schema/parser/account model/threat/review | T5: templates/flows/onboarding | Architecture review + người dùng đồng ý |
| 3 | Toolchain, hello program/test/devnet, CI | T8: web hello + devnet wallet lab/public deploy, cần tài khoản báo đúng blocker | Versions/logs, programID+tx, web URL, CI xanh |
| 4 | Harden product core/RPC/schema, tests | Chuẩn bị UI theo contract | Core test/failure cases; không tạo on-chain product dư |
| 5 | Review amount/hash/cluster/security | Input/report/replay/export UI + browser tests | Mock và live rõ, responsive |
| 6 | Integration/adapters/recovery | Wire core và deploy web | E2E đúng scope devnet/unknown |
| 7 | Security/source/release review | Bug bash/README/video draft | Không critical findings, người dùng giải thích được |

Chủ file tự review/commit nhỏ, không chờ A đồng ý. A trả file/commit/tests qua A-done; C fetch/pull trước kết luận thiếu. Phase3 A sở hữu apps/web, C sở hữu Anchor/Cargo/programs; root package/workspace change cần ghi queue tránh giẫm file. Contract changes version/diff và giữ fixture cũ cho regression. Không force-push, không merge PR7 tự động.

## 9. Rủi ro còn mở và cổng ra

Cần build xác nhận toolchain trên arm64; UI template version chưa lock; provider/CORS cần live web test; repo private chưa delivery open-source; user/giáo viên chưa duyệt IDEA/architecture này. Chưa có hosting account đã xác nhận, không giả deploy tự động được. Nếu phụ thuộc hosting/permission cần người dùng thì vẫn làm hết local/CI/prep trước hỏi.

Phase2 chỉ đánh đạt khi bản final không còn lựa chọn kỹ thuật trọng yếu mở, review giáo viên/xử lý findings và người dùng đọc bản giải thích đồng ý. Phase3 chỉ đạt khi có version thực + hello build/test, devnet programID/tx thật, web hello công khai và CI xanh. DECISION không thay các bằng chứng này. Kế hoạch tiếp theo ở HANDOFF, chỉ viết NEXT final khi các cổng thật đạt.
