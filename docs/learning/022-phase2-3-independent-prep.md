# 022 — Chuẩn bị Phase 2/3: interface, test và môi trường

> Codex · 17/11/2026 · trước sự kiện. Đặt chỗ tại commit `1aa322a` trước khi viết. Ban đầu chuẩn bị độc lập ở chặng E; kết luận cũ về chọn ClusterProof/quyền cài sai, đã đính chính tại DECISION. ReceiptRail chính, ClusterProof phụ; tài liệu này giữ kiến thức/lịch sử ClusterProof; P3-A/P3-B được đồng ý ngày18/11 ở phần cập nhật cuối, không mở rộng phạm vi. **Cập nhật: Linux27cf7ac có push/PR đều đạt3jobs/57tests+build; web cũ giữ nguyên, devnet deploy/ví thật còn mở.** Phần kế hoạch product không tự trở thành tính năng đã triển khai.

## 1. Mục tiêu và điều cần nhớ

Giữ contract giữa parser, report và UI ổn định để C/A không tự suy nghĩa MATCH/UNKNOWN khác nhau. Tách test model khỏi runtime, và tách kết quả nghiên cứu khỏi product acceptance. Phase3 hello Anchor là bài học chạy pipeline devnet, không thuộc logic core ClusterProof.

## 2. Nguồn/version đã kiểm

| Thành phần | Snapshot / trạng thái |
| --- | --- |
| Bộ toolchain | Note003: Rust1.100.0, Agave4.1.2, Anchor/AVM1.2.2, platform-tools v1.57, SBPFv3; đã cài/build/IDL/6 runtime tests local |
| Anchor CI tại v1.2.2 | `.github/workflows/tests.yaml`, blob426a0c7f4206d8f77b8a151485eac119a185b99c: Agave4.1.2, Node22.22.3, Surfpool1.5.0; upstream config, không phải CI đội đã chạy |
| Máy/Node | Node24.22.2 dùng cho research/client/web; toolchain macOS arm64 đã kiểm, không sửa shell profile |
| Next.js template | `solana-foundation/templates/kit/nextjs/package.json`, blobd032d077202d0b5deb56326fd856a9de9725a677: Node>=24, Kit^8.5.0, Next16.4.3, React19.2.8, RPC plugin^0.19.0; chưa cài, ranges chưa lock |
| React-Vite template | Commit9ec8eba94a98e22434356b6858defbb0e5ada8dc; đã đọc source/license, dùng React/Vite/react-hooks với CSS riêng; pins/peer graph/build ở phần kết quả cuối note |
| License templates | Root MIT blob e7211b41d89893beb6e2c165c89f0461ee9139f5; phải giữ copyright/license khi dùng source |

Nguồn template hiện [nextjs](https://solana.com/developers/templates/nextjs) mô tả Kit8/v1 transactions và test runtime `@solana/surfpool`1.7.0 có **mainnet remote fallback** cho Memo. Không chạy nguyên template test trong scope chỉ devnet/local. Core C02 không cần wallet/plugin transaction; chọn phần UI đơn giản sau kiểm version. Node22 upstream CI và Node24 web phải tách job nếu chọn template, không ép cùng version rồi gọi compatible.

## 3. Contract và mẫu account/PDA

**Mẫu record độc lập, chưa code:** mỗi account thiết kế phải có owner, namespace seeds cố định, canonical bump, signer/authority relation, version/discriminator, byte-size và lifecycle. Bảng transition phải có precondition/effect/error và state giữ nguyên khi fail; close cần chỉ rõ tombstone nếu chống replay. Mẫu cụ thể và ví dụ counter ở note004/007, không copy vào ClusterProof khi sản phẩm không cần state mới.

ClusterProof chỉ đọc Program và ProgramData loader-v3, không PDA của đội. Contract giữa C/A:

- Input: schemaVersion, programId, cluster=`devnet`, expected manifest optional, idl exact bytes optional. URL RPC không là input mở cho server gọi tùy ý.
- Observation: genesis/program/loader/pointer, slot/commitment/time, upgrade authority/slot, account/payload hashes có meaning, IDL artifact hash nếu có.
- Check: field, expected, observed, status MATCH/MISMATCH/UNKNOWN, reason và source-of-expectation. Thiếu evidence không suy MATCH.
- Report: mode LIVE/REPLAY, capture status, checks; abiCompatibility UNKNOWN và sourceVerification NOT_RUN khi chưa có bằng chứng độc lập. Không boolean `safe=true` hoặc `compatible=true` tổng quát.
- Error giữ code và thông điệp người dùng: invalid input, missing account, unsupported loader, malformed bytes, RPC timeout/rate limit, changed pointer, unsafe/non-monotonic slot. UI không cần đọc stack trace.

IDL của hello được sinh từ build; IDL hash/model hand-drawn chưa là generated client. C cung cấp fixtures và error meanings; A không sửa parser/interface âm thầm, thay đổi contract phải commit/version cùng tests.

## 4. Test harness, CI và kế hoạch cài cụ thể

### Harness trên giấy

| Lớp | Thiết lập / oracle | Acceptance |
| --- | --- | --- |
| Parser unit offline | Byte vectors hợp lệ/sai owner/type/layout, fixed expected hashes | Đúng field, reject malformed; không import module tự gọi RPC |
| Snapshot replay | Dữ liệu public đã lưu, provenance/hash/time cố định | Result giống expected; banner REPLAY, không báo fresh |
| RPC adapter | Fake transport cho timeout/null/403/429/slot đi lùi/pointer đổi | Fail rõ, không optimistic match hoặc retry vô hạn |
| UI/contract | Fixture MATCH/MISMATCH/UNKNOWN/ERROR, thao tác theo role/label | Người dùng thấy lý do, giữ input khi lỗi, export giữ provenance |
| Hello runtime | Build .so thực, local offline runtime và generated IDL | Invoke thành công; test signer nếu instruction có quyền; không dùng fixture-only để gọi runtime pass |
| Devnet smoke | Sau quyền Phase3: cluster/program/tx thật, đọc lại account/log | Program executable đúng cluster, transaction success; không chỉ có chữ ký |

Research suite 16 tests đã có nhưng chưa thay các test product/UI/runtime ở trên. Khi sửa code mới thì chạy đúng lớp liên quan; không rerun RPC hoặc full suite chỉ vì viết thêm note.

### Thiết kế CI và workflow đã viết

1. `pull_request`/push theo nhánh, `permissions: contents: read`, không secret devnet signer trong PR jobs. Không checkout mã PR bằng `pull_request_target` có quyền cao.
2. Research/parser job dùng Node24 và lệnh `node --test` trên tests offline; không gọi script discovery/live.
3. Program job chỉ sau setup toolchain: pin versions + Cargo.lock, build thật, runtime tests offline. Local validator không clone/fork mainnet; dùng môi trường phù hợp SBPFv3.
4. Web job pin package manager/lockfile, build/typecheck/test với mocked RPC; config production không chứa server secret.
5. Action dependencies khóa bằng lockfile khi được hỗ trợ, hoặc full commit SHA đã kiểm; không tự điền SHA chưa biết. Cache key gồm OS/arch/toolchain/lockfile, không cache ví/keypair.
6. Artifact chỉ .so/IDL/test report public; không target/deploy keypair. Deploy devnet/web là bước riêng được kiểm quyền, không tự chạy từ PR người lạ.

[GitHub secure use](https://docs.github.com/en/actions/reference/security/secure-use) hỗ trợ least-privilege, cách tránh PR privileged checkout và khóa actions. Workflow đã viết tại .github/workflows/ci.yml với research, anchor-lab/client và web; actions pin full SHA. Sau push commit web f7a1a43, run44127842904 có cả3 jobs bị Billing & plans chặn trước khi chạy; đã lưu từng annotation trong ci-blocked-f7a1a43.json. Local pass chưa chứng minh Linux CI xanh.

### Phiếu cài trước đây — kết luận chấp thuận sai, hết hiệu lực

Thứ tự: kiểm PATH/OS/Xcode và dung lượng → tải installer chính thức ra file tạm/đọc → Rust host1.100.0 → Agave4.1.2 → AVM/Anchor1.2.2 → build tools v1.57/SBPFv3 → kiểm version + build/test hello. Cài dưới user directories, không sửa checkout Antigravity/Taskbar Hero; không nâng Node/pnpm sẵn có chỉ vì template latest. Lệnh tham khảo và URL ở note003; khi source/version hiện hành khác phải ghi lại và xử lý, không ngầm đổi bộ.

Rust dùng ~/.cargo và ~/.rustup; Agave theo user install active_release; PATH chỉ thêm đúng binary của task. Mọi cài thêm/download dependency hiện phải hỏi trước theo DECISION18/11; phần installer là lịch sử, không được chạy lại. Nếu thiếu cache cho spike local thì ghi gói/phiên bản cần thiết. Không tự bypass prompt quản trị.

Sau build: lưu OS/arch/version thực, source/lockfile và log. Keypair phát sinh khi scaffold/build không được Git-track; signer dành riêng devnet giữ ngoài source, không in secret, không lấy ví tài sản thật. Quyền vận hành hiện hành theo DECISION18/11: cài thêm/tạo signer triển khai/deploy/public phải hỏi riêng; Prompt03 và duyệt Phase2 không cấp quyền đó.

## 5. Tự kiểm tra

- Report mọi field MATCH có chứng minh ABI? Không; ABI/source là trục riêng.
- Hello tx có signature là đủ? Không; phải kiểm status/error/cluster/program và log/state thật.
- Template chính thức có được chạy tests nguyên bản? Không suy; phải đọc remote fallback và signer behavior trong phiên bản được pin.
- Node24 đã chạy parser có xác nhận Anchor CI? Không; compiler/runtime khác.
- C02 cần invoice PDA? Không; ví dụ account chỉ phục vụ học, không gắn state thừa vào sản phẩm.

## 6. Nguồn

Đọc 17/11/2026: [Anchor CI v1.2.2](https://github.com/otter-sec/anchor/blob/v1.2.2/.github/workflows/tests.yaml), [Anchor CLI](https://www.anchor-lang.com/docs/references/cli), [CPI](https://www.anchor-lang.com/docs/basics/cpi), [constraints](https://www.anchor-lang.com/docs/references/account-constraints), [GitHub secure use](https://docs.github.com/en/actions/reference/security/secure-use), [templates](https://solana.com/developers/templates), [Next package](https://github.com/solana-foundation/templates/blob/main/kit/nextjs/package.json), [Vite README](https://github.com/solana-foundation/templates/blob/main/kit/react-vite/README.md), [license](https://github.com/solana-foundation/templates/blob/main/LICENSE). Nguồn kỹ thuật là primary; contract/budget/harness là đề xuất của C.

## 7. Giới hạn và bước tiếp theo

Phần kế hoạch bên trên được viết trước setup. Cập nhật 17/11: toolchain/check-lab r2 đạt (SBFv3/IDL/6 runtime tests), client8/web8 tests đạt, web đã public. Workflow đã viết nhưng CI bị billing chặn; payer0SOL nên chưa deploy program hoặc gửi transaction devnet. Ghi nhận duyệt trước đây sai/hết hiệu lực; ClusterProof là dự phòng, chưa duyệt. Chỉ cập nhật cổng ra bằng logs/link/transaction thật và review cần thiết.

### Bài học / lỗi đã gặp

| Bẫy | Xử lý |
| --- | --- |
| Cho rằng template readme ít bước nghĩa không có remote network | Next template dùng mainnet fallback trong test; giữ offline/devnet và kiểm test setup trước chạy |
| Nhầm token fee với compute fee trong T4/T6 của A | So source Token-2022, không dùng ComputeBudget làm giải pháp net token |
| T5 đã có queue nhưng A chờ chỉ thị | Ghi rõ T5 được làm ngay; C tiếp tục chuẩn bị độc lập, không chờ |
| Kết quả build/version chưa có | Giữ D1, không đổi note003 thành đã cài chỉ từ sự đồng ý của người dùng |
| Script pass local nhưng chưa có CI | Giữ cổng CI mở tới run thật trên đúng commit, không suy pass Linux từ macOS |
| SDK cùng tên họ Solana nhưng major khác | npm metadata client1.7.0 dùng Kit^5.0.0; không ghép với Kit8 template bằng cast, kiểm graph/lock/build trước chốt |

Client lab tách tại tools/devnet-lab, dùng @anchor-lang/core1.2.2 với web3.js1.99.0 do lockfile resolve, không trộn Kit. Source tag1.2.2 xác nhận Program(idl, provider), accountsStrict và Node Wallet; test codec/instruction phải dùng generated IDL thật. Npm audit ban đầu báo6 findings (4 moderate/2 high): toml, stream-json, uuid và đường phụ thuộc. Không dùng audit fix --force (đề xuất hạ core về0.0.0 không phù hợp). Đã xem đường gọi: web3 dùng jayson browser client/JSON.parse/uuid.v4; TOML chỉ ở workspace local, smoke không dùng workspace; stream-json nằm utility server của jayson. Đánh giá overrides có pin toml5.0.1, stream-json3.9.0, uuid11.1.1 rồi chạy lại import/codec/RPC và audit; chỉ ghi khắc phục khi có output thật.


Kết quả client 17/11: 8 tests đạt (client-tests-r3.txt), RPC inspect đúng genesis devnet/slot523319341, payer0SOL và program chưa deploy; chưa ký/broadcast. Bộ override cuối là **toml5.0.1 + jayson5.0.0**, npm audit0 và npm ci/test đạt. Override stream-json3.9 riêng làm Jayson4 full import lỗi subpath ESM; đã bỏ. Source Jayson5 README nêu bỏ uuid/stream-json, thay TCP/TLS delimiter (không dùng bởi HTTP browser-client web3); đã kiểm API request, full import và TOML parse. Advisory: [toml](https://github.com/advisories/GHSA-h895-cgqg-jf52), [stream-json](https://github.com/advisories/GHSA-mjw6-4jj6-33hc), [uuid](https://github.com/advisories/GHSA-w5hq-g745-h8pq), đọc17/11. Audit0 không thay audit sản phẩm.

Template web đã kiểm tại commit **9ec8eba94a98e22434356b6858defbb0e5ada8dc** của solana-foundation/templates: kit/react-vite package blob0ff1f8f9e0dafd25c2411a03e29e21d5aad910e6, providers blob044359dc6b31fd273fa1eb8617e1398e42a2bb47, App blob6fb4edec20918366c3f93f99a452a80b7178807a, LICENSE MIT blobe7211b41d89893beb6e2c165c89f0461ee9139f5. Provider dùng createClient endpoint devnet + autoDiscover, SolanaProvider và useWalletConnection. Chọn React/Vite static cho core, wallet chỉ /lab; pin stable dependencies thay ranges RC trong template rồi build/browser thật.

Trước triển khai web (17/11): đọc README và declarations đã cài của client1.7.0/react-hooks1.4.1 (`dist/types/ui.d.ts`, `wallet/types.d.ts`, `wallet/connectors.d.ts`). `useWalletConnection` trả connectors/connect/disconnect/wallet/status/currentConnector/isReady; wallet account chỉ chứng minh địa chỉ được chia sẻ, không chứng minh ví đang chọn devnet. Provider cố định RPC devnet; lab không gọi sign/send. Core Phase3 chỉ đọc genesis và account executable/owner tại confirmed slot; không gọi kết quả đó là deployment MATCH hoặc verified build. Unknown/timeout/RPC error phải hiển thị là chưa xác minh, không dùng fallback giả xanh.

Peer graph thực phát hiện TypeScript7.0.2 trái peer `^5.0.0` của Kit5. Đã pin TypeScript5.9.3; npm install exit0/audit0, không dùng --force/legacy-peer-deps. `web-peer-graph-r1.json` giữ lỗi gốc; r2 kiểm lại toàn graph. Kế hoạch kiểm tra: RPC fixtures kiểm wrong-genesis/missing account/bad response/timeout; browser kiểm nhập liệu, no-wallet và đường retry; connect/reject/disconnect dùng Wallet Standard thật khi có ví hoặc đánh dấu kiểm bằng test double, không giả đã có ví thật.

### Kết quả web đã thực hiện — 17/11/2026

- Pins cuối: React/react-dom19.3.1, client1.7.0/react-hooks1.4.1, Vite8.3.8/plugin-react6.3.0, TypeScript5.9.3; toàn bộ lockfile ở apps/web. [Clean install](../evidence/phase3/web-ci-install-r3.txt) exit0/audit0, [peer graph r3](../evidence/phase3/web-peer-graph-r3.json) sạch. Còn deprecation token-2022 và optional fsevents script warning; không dùng chúng làm lý do bỏ kiểm peer.
- [8 tests](../evidence/phase3/web-tests-r3.txt) kiểm decoded32byte, dừng sai genesis, metadata/confirmed/provenance, missing/non-executable, malformed/429/network/timeout/cancel. [Build r4](../evidence/phase3/web-build-r4.txt) typecheck + Vite174 modules + static route exit0. R3 fail vì fixture features bị suy string[]; sửa literal types bằng as const, giữ log lỗi.
- CUA local đã kiểm invalid input, RPC devnet thật, no-wallet/tìm lại và mobile390×844/desktop1280. Fixture Wallet Standard không keypair kiểm reject→retry→connect→disconnect; đây không phải bằng chứng ví extension thật. Fixture chỉ là HTML dev, không là production build entry.
- [Web công khai](https://clusterproof-devnet-17nov26.anthony-robinson-125.chatgpt.site) và /lab/ đã chạy; public RPC slot523326604 đúng genesis, program chưa tồn tại. [Hosting record](../evidence/phase3/web-hosting.json) giữ source commit Sites f5223af, project/version/deployment và archive hash. Code/config/tests trùng byte source đã xuất bản; README local được bổ sung phạm vi SDK warmup và ghi riêng trong [source match](../evidence/phase3/web-source-match.json). Không coi Git HEAD repo chính là source SHA Sites.
- Core baseline chỉ đọc account metadata ở confirmed; product design yêu cầu paired ProgramData ở finalized, manifest diff/replay/export còn Phase4–6. Connect ví không đổi network của extension; lab không sign/send. Static host cần dist/lab/index.html cho deep link, không chỉ kiểm nút điều hướng từ trang chủ.

Bài học: chỉ sửa phiên bản bị peer conflict sau đọc dependency graph; giữ bằng chứng fail và pass riêng. Kiểm endpoint công khai thật vì local build không chứng minh static route/CORS. Wallet fixture giúp kiểm recovery nhưng không đóng cổng compatibility của ví thật. Chi tiết và screenshots ở [web.md](../evidence/phase3/web.md).

### Bổ sung từ Chrome native và duyệt người dùng — 17/11/2026

Core được Wallet Standard nhận diện ở public /lab/; request mở cửa sổ Core nhưng yêu cầu mật khẩu. Sau request không thành công, UI trở về chưa kết nối và cho thử lại. Không xác định nguyên nhân kết thúc request nên không gọi explicit reject đã đạt. Người dùng chưa có ví devnet sẵn sàng, giữ connect/disconnect thật chưa kiểm; không dùng fixture hoặc discovery để gọi compatibility end-to-end. [Evidence](../evidence/phase3/web-native-core.md).

Bài học: mỗi cổng cần bằng chứng đúng phạm vi. Kết luận duyệt cũ sai/hết hiệu lực theo DECISION18/11; chỉ ghi quyết định từ nguyên văn/giờ và không suy sang cổng khác. Inspect16:55:40Z/slot523335879 vẫn payer0lamports và chưa deploy, đã lưu artifact; không cần chạy lại build/tests khi source không đổi.

## Chuẩn bị sau duyệt Phase2 và sửa CI tự chạy — 18/11/2026

Người dùng đã duyệt Phase2 bằng tin trực tiếp “duyệt phase 2” (log09:27:18.464 UTC+7), nhưng cài thêm/keypair triển khai/deploy/public vẫn cần câu đồng ý riêng. Đọc note này trước sửa workflow; không chạy các lệnh cài lịch sử.

Merge7e654a0 sau checkpointfcc9f61 không có [skip ci], đã kích hoạt push run44224621982 và PR run44224628416. C thử hủy push run; nó đã completed trước lệnh hủy. Đã đọc cả6 jobs/annotations: steps rỗng và Billing & plans báo job không bắt đầu. [Evidence](../evidence/phase3/ci-merge-7e654a0-blocked.json) giữ kết quả; không có bước cài nào chạy, không gọi CI xanh.

Đối chiếu [GitHub skip workflows](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/skip-workflow-runs) và [contexts/job if](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts#determining-when-to-use-contexts), đọc18/11: skip marker chỉ áp dụng commit phù hợp; job-level if được xét trước khi gửi job tới runner. Vì thế ghi [skip ci] cả vào commit merge và thêm điều kiện false ở cả3 jobs của workflow cũ cho tới khi có lời đồng ý vận hành. Cổng này không là cơ chế cấp quyền: chỉ mở bằng thay đổi có review sau câu đồng ý, không tự bật từ reminder hoặc lời duyệt thiết kế. Job skipped không chứng minh build/test đã chạy.

Workflow cũ còn cần tích hợp runner ReceiptRail: check-lab chạy cargo test --workspace, trong khi ReceiptRail cần target/receiptrail-spike/receiptrail.so. Không bật lại workflow trước khi sửa đường build và xác minh flags không sinh signer triển khai; toàn bộ package/toolchain đã pin phải nằm trong phạm vi xin phép CI. Có thể chuẩn bị patch và kiểm cú pháp local, chưa được thực thi các installer hoặc upload artifact mới.

### Runner Phase3 offline — thiết kế trước code

Đã đọc hai tests hello hiện hành: include_bytes dựa trên CARGO_TARGET_TMPDIR/../deploy/phase3_hello.so; ReceiptRail đọc RECEIPTRAIL_SO. Vì vậy có thể giữ nguyên toàn bộ source/tests/lab/web, build hai .so bằng cargo/rustc platform-tools trực tiếp vào target/phase3-offline/build, strip vào target/phase3-offline/deploy rồi cargo test --workspace --target-dir target/phase3-offline. Đặt RECEIPTRAIL_SO tới bytecode ReceiptRail cùng thư mục. Không đọc target/deploy/*keypair hoặc gọi Anchor build/cargo-build-sbf post-processing.

Runner mới scripts/check-phase3-offline.sh dùng host/platform cache trực tiếp giống runner023, offline/locked, kiểm executable trước chạy, không installer/RPC/sign/deploy. Test signers chỉ trong memory LiteSVM. Thiếu cache phải fail rõ; Cargo.lock phải giữ nguyên. Test cần thiết cho thay đổi pipeline: nhánh thiếu compiler exit2 và thực chạy cả25runtime tests (6hello+19ReceiptRail), kiểm .so đúng ID, không dùng lại log cũ để gọi runner mới đạt. Bytecode đầu ra mới không thay artifact Phase2 đã lưu.

CI đề xuất sau quyền: cài đúng bộ pins hiện có trong runner Linux, cargo fetch --locked để warm cache, trỏ PHASE3_HOST_TOOLS tới rustup which của1.100.0, chạy runner mới; sinh IDL qua binary Anchor1.2.2 trực tiếp với offline/locked; kiểm client/tests/web như trước. Bỏ bước upload artifact mới trong đề xuất; build/test không deploy web/program. Guard false vẫn giữ; Linux/CI chưa được xác minh bằng local macOS.

### Kết quả runner và preflight — 18/11/2026

[Runner mới](../../scripts/check-phase3-offline.sh) exit0, build+test64s bằng cache:6hello+19ReceiptRail=25runtime tests/0fail. Nhánh thiếu host compiler exit2 trước build. Hai .so byte-identical với artifacts đã có (hello127,672bytes, ReceiptRail147,864bytes); Cargo.lock không đổi. Sinh lại hai IDL bằng Anchor1.2.2/offline/locked đều exit0, cmp byte-identical;8client tests đạt. [Metadata](../evidence/phase3/offline-pipeline-metadata.json) và4logs giữ nguồn/hash/kết quả. Đây là kiểm pipeline mới, không chạy lại vì sửa tài liệu. Không installer/keypair triển khai/deploy.

CI đã chuyển sang runner mới, warm Cargo.lock cache **chỉ sau quyền cài trên runner**, copy riêng hello .so vào đường dẫn client cũ và sinh/đối chiếu IDL. Không sửa source/tests/lab/web; bỏ upload artifact mới. Cả3guards vẫn false; chỉ kiểm YAML/command wiring local, chưa Linux CI.

[Preflight read-only](../evidence/phase3/preflight-after-phase2-approval.json) lúc09:47:33 UTC+7: đúng genesis devnet, slot523484369, payer0lamports, hello chưa có account. RPC trả rent program36bytes=833120; programdata45+127672=649452600; buffer37+127672=649411960lamports. Layout headers đã đối chiếu source solana-loader-v3-interface cached. Tổng dự phòng cả3accounts1.29969768SOL là estimate bảo thủ, chưa gồm phí/counter; không là báo giá deploy cuối. [Kế hoạch Phase3](../PHASE3-PLAN.md) đề xuất trần1.5SOL devnet và dừng nếu vượt. Chỉ chạy CLI --help để kiểm flags, chưa đọc/dùng signer cũ.

## Mở CI sau quyền cụ thể — 18/11/2026

Người dùng trả lời “Đồng ý cả hai” cho P3-A/P3-B (giờ log10:13:11.851 UTC+7); DECISION/evidence giữ toàn văn câu hỏi và câu trả lời. Kế hoạch trước sửa workflow: chỉ bỏ ba guards false, giữ SHA actions/pins/lockfiles và command blocks đã kiểm; push quyền trước bằng skip marker, rồi commit mở CI không skip để tạo run. Không dùng rerun của commit cũ còn guard false. Theo dõi run/job handles thật, chỉ gọi CI đạt khi steps thực chạy/pass. Billing chặn thì lưu annotation, không lặp rerun hoặc tự đổi limit.

Tin “chưa rảnh để chuyển sol devnet” (log10:14:46.599 UTC+7) để funding/deploy sau; không suy câu đồng ý thành đã có tiền. Bài học: tách thiếu quyền, thiếu funding và lỗi runner; gỡ đúng blocker đã giải quyết, không hỏi lại quyền hoặc đánh hoàn thành từ lời đồng ý. Không tạo buffer/sign/send khi chưa đủ funding.

### Kết quả P3-A sau lời đồng ý

Quyền được push fd78236 trước thay workflow. Commit51bf866 chỉ bỏ ba guards; so YAML parsed object trước/sau xác nhận pins và command blocks không đổi, 10 shell blocks qua bash -n. Không rerun local suite vì program/test/script không đổi; hash workflow trong metadata offline là snapshot trước mở guard, không sửa đè lịch sử.

[Evidence CI sau quyền](../evidence/phase3/ci-approved-51bf866-blocked.json) gắn đúng HEAD51bf866: runs44229364614/44229359109 đều completed/failure. Đọc cả sáu check annotations và job steps: tất cả bị Billing & plans chặn trước bắt đầu, steps rỗng. Không có installer/build/test chạy; không là lỗi compiler đã quan sát hoặc CI xanh. Không rerun cho tới external state đổi, không tự đổi billing/limit.

Funding được người dùng để sau; chưa đọc/dùng signers, tạo buffer hoặc gửi giao dịch trong lượt này. Bài học: quyền P3-A/P3-B đã có thì không hỏi lại, nhưng consent không sửa được quota/billing hoặc cấp tiền. Run terminal là bằng chứng failure cần xử lý, không được gọi là verified wait chỉ vì còn việc.

Bài học khi tiếp tục bàn giao: kiểm `git status` và body/head PR trước khi kết luận chỉ còn blocker bên ngoài. Ở HEAD51bf866 vẫn có 12 file tài liệu/evidence chưa commit và PR7 còn câu chưa có quyền; ghi các việc chốt này vào đầu Còn lại, push bằng [skip ci], rồi kiểm lại PR. Lượt chỉ tóm tắt bàn giao không là tiến triển hay bằng chứng đã push; xem STOP-CAUSES K10.

Lượt kiểm lại18/11: diagnostics gắn với HEAD PR3b92ce2 từ chối hai run của51bf866 bằng “The workflow is not for this pull request revision”. Đây là sai phạm vi truy vấn, không là bằng chứng job đã dừng. Đã dùng GitHub `fetch_workflow_run_jobs` theo hai run IDs và `fetch_workflow_job_steps` theo sáu job IDs: tất cả completed/failure, steps rỗng; không rerun. HEAD tài liệu dùng skip marker không có checks, không được coi là CI xanh. Khi mọi chuẩn bị đã push mà billing/funding vẫn giữ nguyên qua ba lượt, trạng thái goal blocked chỉ ghi nhu cầu thay đổi bên ngoài, không mở rộng quyền hoặc đóng cổng.

### Tiếp tục P3-A khi người dùng báo mở CI

Tin trực tiếp “Đã mở CI, chạy tiếp Phase 3.” có giờ log10:35:20.180 ngày18/11 UTC+7; DECISION/record tách giờ log khỏi giờ quyết định chưa được người dùng nêu. Kế hoạch trước thao tác: lưu/push record bằng [skip ci]; do HEAD hiện tại chỉ có checkpoint skip và workflow không có dispatch, tạo commit chạy CI riêng không skip rồi push. Giữ nguyên ba jobs/pins/locks/commands; nhận run IDs từ API, theo dõi từng job và đọc steps/logs khi fail. Chỉ sửa từ lỗi thực, không tự đổi bộ phiên bản hoặc cài thêm local. Funding hello vẫn để sau, không tự tạo signer/send/deploy. Một run có steps thực mới chứng minh runner đã hoạt động; việc được yêu cầu tiếp tục chưa chứng minh pass.

Run a114a98 đã thực thi: log PR research16/16 và web8/8+typecheck/build đạt, Anchor đang cài thì cả hai run bị cancelled. Git/CI xác nhận commit7210aa6 (chỉ HANDOFF A, thiếu skip) và hai runs mới trên cùng workflow; config `cancel-in-progress: true` giải thích khả năng run mới hủy run cũ, log không có lỗi compiler đã quan sát. Theo dõi handles mới, không restart chỉ vì log cũ kết thúc. C đã nhắc skip marker qua A-queue; không sửa source/locks hay file A. Logs/steps được giữ để chốt evidence sau khi run hiện hành terminal.
### CI Linux sau mở billing — lỗi attestation và cách sửa trước code

18/11/2026: push run44231906106 tại7210aa6 đã completed/success cả3jobs:25runtime(6hello+19ReceiptRail),8client,16research,8web+typecheck/build; ReceiptRail IDL cmp đạt. PR run44231910864 cùng SHA thất bại ở `avm install 1.2.2`: tải attestation cho binary digest `e2c35a973bcfe476f3a89b120e99820f917229faf33d3e71f6625bd94199e741` trả403. Chưa có body/headers để khẳng định rate limit; đây là lỗi lấy chứng thực, không chứng minh bytecode lỗi hay compiler sai. Runs a114a98 trước đó cancelled khi commit7210aa6 tạo run mới, giữ riêng lịch sử.

Đã đọc source upstream commit `8d9d1488d9b8af41b266d7513eea2e668adf15a2`: [attestation.rs:74–105](https://github.com/otter-sec/anchor/blob/8d9d1488d9b8af41b266d7513eea2e668adf15a2/avm/src/attestation.rs#L74), HTTP_CLIENT trong avm/src/lib.rs và cli/Cargo.toml. Client không đọc GITHUB_TOKEN; thêm biến token không sửa được đường request này. Source chính thức đã mở bằng GitHub connector ngày18/11; web tool lỗi route404, không dùng nó làm bằng chứng đã đọc trang.

Kế hoạch sửa trong P3-A: thay bước tải binary Anchor bằng `cargo +1.100.0 install --git ... --rev 8d9d148... --locked avm anchor-cli --root "$RUNNER_TEMP/anchor-1.2.2" --target-dir "$RUNNER_TEMP/anchor-build"`, trỏ ANCHOR_BIN tới binary trực tiếp và kiểm version1.2.2. Giữ AVM1.2.2/Agave4.1.2/platform-tools1.57/Node24.22.2, ba jobs và mọi lockfile; chỉ runner GitHub. Build từ cùng source/lock upstream đã duyệt, không dùng `--skip-attestation`, không thêm token/quyền hoặc installer local. Kiểm YAML/bash trước push; cần hai run mới build/IDL/runtime/client/web đạt mới nhận patch. Không coi push7210aa6 xanh là bằng chứng patch tương lai đã chạy.

Bài học bổ sung khi đọc log7210aa6: Cargo.lock và runner hash khớp local, nhưng hai hash bytecode Linux khác snapshot macOS; ghi chúng trong evidence theo host/run. Chưa xác định nguyên nhân hoặc chứng nhận reproducible build. Không thay binary hello macOS trong kế hoạch deploy, không upload binary hoặc lấy test pass làm bằng chứng source-to-chain.

Lúc job134562955349 còn in_progress, endpoint tải log trả404 BlobNotFound. Đây là chưa có log tải về, không là job failure hoặc lý do restart. Dùng run jobs/job steps để theo dõi; chỉ lấy logs sau terminal, kiểm isError trước đọc structuredContent.

### Sửa tải platform-tools sau log b906a37 — trước code

Hai runb906a37 đã terminal/failure: AVM/Anchor1.2.2 build từ source8d9d148 và kiểm version đạt; bước `cargo build-sbf --tools-version v1.57 --install-only` lỗi `Failed to parse Github response: error decoding response body`. Runtime/IDL/client của revision này chưa chạy; research16/web8+build đạt. Chưa có status/body response để khẳng định nguyên nhân sâu hơn; không gọi là compiler lỗi hoặc CI xanh.

Đã đọc [release v1.57](https://github.com/anza-xyz/platform-tools/releases/tag/v1.57) qua API chính thức18/11: asset523147257 `platform-tools-linux-x86_64.tar.bz2`,531380716bytes, SHA256 `b0f7af104adf726fff2a6a09ea2eb2f2d2965c92295f4d7388c08d140e0c2b00`. [build.sh](https://github.com/anza-xyz/platform-tools/blob/v1.57/build.sh#L201), blob a7fb849afb07ce17c33757111c2528088ae51cb8, đóng gói từ deploy bằng tar với root `.`; bên trong có rust/ và llvm/. Source AVM8d9d148/platform_tools.rs đối chiếu tên asset, cache Solana và tar extraction.

Kế hoạch sửa chỉ runner: thay lệnh cài SBF qua API bằng HTTPS release URL cố định, curl retry hữu hạn, **sha256sum check trước giải nén**, giữ cache `$HOME/.cache/solana/v1.57/platform-tools` cho runner hiện có. Assert host x86_64 và in rustc version; không dùng latest, không thêm token/quyền/pin/dependency, không tải/cài compiler local. Giữ installer Anchor đã pass. Kiểm YAML/bash/scope rồi chạy CI mới; pipeline/tests mới quyết định kết quả, không dùng pass7210aa6 thay thế.

### Kết quả CI27cf7ac — 18/11/2026

[PR44237534047](https://github.com/ntbaoheyhey/dev3pack-hackathon/actions/runs/44237534047) và [push44237529539](https://github.com/ntbaoheyhey/dev3pack-hackathon/actions/runs/44237529539) đều completed/success. [Evidence](../evidence/phase3/ci-passed-27cf7ac.json) kiểm logs/steps lúc11:41:50 UTC+7: mỗi run6hello+19ReceiptRail runtime,8client,16research,8web =57tests, typecheck/build, sinh hai IDL và cmp ReceiptRail IDL. PR checkout synthetic merge63f8a462; run head27cf7ac, không có nghĩa PR đã merge. Push checkout27cf7ac.

Hai installers đã qua: AVM/anchor-cli1.2.2 build đúng source8d9d148/lock, assertion Anchor version đạt; archive v1.57 hash b0f7af10… trả OK trước extract. Host Rust/cargo1.100.0; SBF rustc1.95.0-dev ae660768a; Node24.22.2. Agave installer pin4.1.2 step thành công nhưng không có `solana --version` độc lập trong log; không nâng mức kiểm chứng. Hello IDL được sinh và dùng bởi client tests, không có cmp hello với artifact macOS trong CI.

Cargo.lock và runner hashes khớp local. Bytecode hello f81e2962…/ReceiptRail41ff32ec… khớp cả hai run và Linux7210aa6, vẫn khác macOS9b5483f7…/962b721a…. Đây là kết quả của các runs đã quan sát, chưa chứng nhận reproducible/source-to-chain; không thay binary macOS trong phương án P3-B. Không đổi source/tests/IDL/web/lab/locks hay cài thêm local trong sửa CI; không rerun local suites chỉ để chốt tài liệu.

Bài học: chỉ đóng mục CI khi đúng revision có cả jobs/steps/logs đạt; không lấy pass cũ hoặc checkpoint skip làm bằng chứng mới. Giữ failure/cancellation cũ để truy nguyên. P3-A đã đạt, funding hello được người dùng để sau; không tự mở Phase4–6 hoặc gọi toàn Phase3 hoàn tất. Sau push checkpoint tài liệu có skip phải sửa/read-back body PR7 và lưu snapshot cụ thể, không bỏ bước này khỏi Thẻ nhớ.

Bổ sung chốt hồ sơ14:44:05 UTC+7 ngày18/11: review T31v2 đã push e48172b, PR7 read-back đúng body/head/work→main/open/chưa merge; [snapshot T33/T31v2](../evidence/phase3/pr7-review-t33-t31-v2-snapshot.json) giữ riêng với ba snapshot PR cũ. Gỡ mục chốt PR đã xong khỏi Còn lại; funding/ví thật và review chéo/giáo viên vẫn mở. Revision CI vẫn27cf7ac, không tự gán checks của revision đó cho HEAD tài liệu.

Bổ sung chốt hồ sơ16:26:10 UTC+7 ngày18/11: review580b903 đã pushf412393, PR7 đọc lại khớp body/head/work→main/open/chưa merge; [snapshot mới](../evidence/phase3/pr7-review-580b903-snapshot.json) giữ riêng với PR trung gian16:19:09 và các bản trước. HEAD PR có thể thay đổi do A push trong lúc chốt body: phải ghi riêng checkpoint mà body mô tả và HEAD thật, rồi review patch mới trước cập nhật kết luận. Đã gỡ bước chốt khỏi Còn lại; funding/ví thật và review chéo/giáo viên vẫn mở, CI vẫn27cf7ac.

Bổ sung chốt16:55:47 UTC+7 ngày18/11: review16:47 gặp non-fast-forward do A nộp26fe656; đã merge/push0e59f65 với [skip ci],giữ cả hai phía,rồi review/push36ac581. [PR read-back](../evidence/phase3/pr7-review-1647-snapshot.json) khớp body/head/work→main/open/chưa merge,comments/reviews rỗng. Lưu snapshot riêng và gỡ bước chốt; CI vẫn27cf7ac,funding/ví thật/review còn mở,không rerun suite khi executable inputs không đổi.

## Kế hoạch P3-B sau funding — 18/11/2026

Tin người dùng yêu cầu triển khai hello/trần1.5SOL và một lượt cuối tài liệu được lưu trong DECISION; giờ quyết định/log chưa xác định, giờ C ghi nhận tách riêng. Inspect21:48:35 UTC+7 xác nhận genesis devnet,2.5SOL/hello chưa deploy. Trước ký: đọc help CLI4.1.2,kiểm signer thử cũ/public keys/file modes,binary macOS hash/size và dự phòng rent+fee+counter dưới trần. Dùng buffer keypair chỉ tạo một lần ngoài Git, explicit devnet/fee payer/authority/program/max-len127672/CUprice0/max-sign-attempts1/use-rpc. Không gọi wrapper build/cài/keypair mới khác. Sau deploy đọc finalized/programdata/authority/bytecode, chạy client smoke có journal và xác minh initialize/increment finalized, báo chi phí. Web docs tool lỗi route_not_found; đối chiếu CLI help/source chính thức, không gọi lỗi công cụ là nội dung trang. T31–T33 không chặn triển khai hoặc được mở thêm vòng sửa; phần thiếu thành nợ tài liệu.

Preflight21:51:38 UTC+7: đúng2.5SOL,signers/modes0700/0600 và binary macOS127672bytes/hash9b5483f7…khớp. Đọc [Agave4.1.2 program.rs](https://github.com/anza-xyz/agave/blob/v4.1.2/cli/src/program.rs#L2521): CLI tính chunk từ packet trừ baseline và1byte; với payer=authority, baseline271bytes/chunk960, tối đa133write messages. Buffer được cấp **rent programdata**649452600, cao hơn rent tối thiểu buffer649411960; dự phòng phải dùng số lớn hơn. Quote3signatures15000lamports/message ×274attempts, cộng rent/counter/reserve0.01SOL cho tổng1.3147424SOL. Đây là trần dự toán bảo thủ, không phải chi phí đã tiêu. Đã tạo duy nhất buffer tạm ngoài Git sau mọi assert,không in secret. CLI giữ fee check/preflight/feature verify,giáCU0,max-len127672,max-sign-attempts1,use-rpc; không skip hoặc final/đổi authority.

### Bài học / lỗi đã gặp — parser deploy và bàn giao 18/11/2026

Lần deploy 21:52:21 UTC+7 exit 1 sau khoảng 30 ms: `Found argument '--fee-payer' which wasn't expected, or isn't valid in this context`. Flag được đặt ở root trước `program deploy`; help local Agave4.1.2 xác nhận `--fee-payer` thuộc subcommand. [Evidence lỗi đầu](../evidence/phase3/hello-devnet-deploy-2026-11-18.json) giữ nguyên; chưa có signature hoặc bằng chứng transaction được gửi. Lượt bàn giao chỉ đọc help/cập nhật tài liệu, chưa retry hoặc kiểm chain sau lỗi.

Khi tiếp tục, đối soát genesis/balance/program/buffer/pending journal trước khi sửa vị trí flag rồi gửi lại. Tái dùng buffer `qSWzcDdMP7m2GhyE2tgaZ5FnHzAtgvMjZwGkQok9s6D`; không chạy lại đoạn tạo keypair. Evidence/log r2 phải riêng, giữ checks và trần 1.5 SOL. Client smoke kiểm confirmed nên cần xác minh finalized riêng. Dự toán 1.3147424 SOL không là chi phí thực.

Bàn giao phải gỡ trạng thái funding/review hết hiệu lực khỏi NEXT/PHASE3-PLAN, không chỉ thêm cuối HANDOFF. Queue cuối xuất bản qua7137ec0; bbecb24/e376f9e có trước nên chưa chứng minh A nộp lượt cuối mới. Sau lần nộp đó chỉ nhận phần đạt, ghi nợ tài liệu và đóng T31/T32/T33; không mở thêm vòng sửa. Snapshot cũ giữ nguyên revision; helper kiểm tài liệu ép vòng sửa cũ phải đổi phạm vi, không sửa lịch sử để làm pass.

### P3-B r2 — ghi buffer một phần, 22:01 ngày18/11/2026 UTC+7

CLI exit1 sau69giây: `Data writes to account failed: Custom error: Max retries exceeded`. Đối soát finalized: buffer owner loader-v3/authority đúng/127709bytes/649452600lamports,14/133chunks khớp binary; program/counter chưa tồn tại, payer1850467400lamports.15signatures finalized không lỗi; delta649532600 gồm buffer rent và80000lamports phí. Không kết luận nguyên nhân RPC rate-limit khi log không có status429.

Đã đọc source Agave4.1.2 program.rs:1379–1409,2556–2607,3130–3238: buffer đã có thì không allocate lại, chỉ viết các chunk khác binary. Kế hoạch resume cùng buffer sau kiểm state/ngân sách và blockhash; giữ flags/max-sign-attempts1, không bỏ preflight/feature/fee checks hoặc tăng trần. Mỗi retry ghi evidence/log riêng, chỉ ký sau đối soát lần trước; chưa chứng minh deploy thành công. Web tool vẫn lỗi route_not_found, dùng source chính thức đã tải có hash trong preflight.

### Điều chỉnh cách gửi buffer sau r3 — trước khi chạy

R3 lặp cùng lỗi; finalized22:05:21 cho thấy31/133chunks,32tx thành công, buffer giữ649452600lamports và tổng phí165000lamports. Không đổi max-sign-attempts hoặc lặp burst tiếp. Chỉ thay bước ghi102chunks còn thiếu bằng client gửi từng write có nhịp, cùng authority/buffer/binary; deploy cuối vẫn CLI với toàn bộ feature/preflight/fee checks.

Đọc crate primary đã cache `solana-loader-v3-interface8.0.1/src/instruction.rs` enum Write và fn write: buffer writable, authority signer; đối chiếu với transaction CLI finalized lưu trong hello-buffer-cli-write-sample.json. Kiểm opcode/offset/length/data và roundtrip khớp byte-for-byte, giữ ComputeBudget từ sample (price0). Mỗi transaction lấy blockhash/quote fee, chỉ ký một lần, ghi pending journal trước broadcast, preflight bật/maxRetries0, chờ confirmed và pacing. Lỗi/timeout giữ journal rồi đối soát; không tự gửi lại. Cuối batch phải kiểm tất cả finalized và payload hash khớp binary trước CLI deploy. Không tạo keypair/allocate/close/đổi authority hoặc cài dependency. Mức kiểm chứng là giao thức write từ source+tx thật; không gọi đây là test ReceiptRail hay verified build.

Paced upload lần đầu: simulateTransaction với sigVerify trả SignatureFailure trước sendRawTransaction. Nguyên nhân helper: Keypair.fromSecretKey giữ tham chiếu Uint8Array; fill(0) trên input đã xóa secret của signer trong memory, file keypair không đổi. Đối soát finalized payer/buffer không đổi, signature status null; lưu journal lỗi riêng. Sửa bằng copy input trước fromSecretKey rồi mới wipe bản đầu, thêm Transaction.from(serialized).verifySignatures() offline trước mọi broadcast. Giữ kiểm preflight; đây là lỗi helper, chưa phát sinh phí hay transaction mới.

### Bàn giao sau CLI r4 — 18/11/2026

[Paced r2](../evidence/phase3/hello-buffer-paced-upload-r2-2026-11-18.json) đã hoàn tất102/102writes lúc22:13:25 UTC+7; tất cả finalized, buffer payload khớp binary macOS. Phí lượt này510.000lamports; tổng phí trước r4 là675.000lamports. Payer1.849.872.400lamports so baseline2.500.000.000: debit650.127.600 gồm buffer649.452.600 và phí675.000. Đây là số đo trước deploy cuối, chưa phải chi phí P3-B cuối.

[CLI r4](../evidence/phase3/hello-devnet-deploy-r4-2026-11-18.json) chạy22:14:19–22:14:21 UTC+7, exit0 với signature trong record; status `CLI_SUCCESS_PENDING_CHAIN_VERIFICATION`. Không chạy lại upload/deploy hoặc tạo buffer mới. Chưa kiểm finalized/meta.err/ProgramData/authority/payload sau r4, chưa initialize/increment. Helper verify/finalize trong `/tmp` đã có nhưng chưa chạy; phải đọc trước dùng, đối soát pending journals/ngân sách rồi mới gửi smoke một lần. Không lấy exit0 thay bằng chứng on-chain hoặc coi dự toán là chi phí thực.

Bài học bàn giao: cập nhật HANDOFF và NEXT cùng lúc, gỡ chỉ dẫn retry/process handle đã terminal và review đã đóng khỏi phần hiện hành. T31/T32/T33 đã nhận đúng một lượt cuối A7857e9b, phần thiếu thành D01–D03 trong DOCUMENTATION-DEBT; không biến nợ tài liệu thành vòng sửa mới. Lượt bàn giao chỉ lưu/kiểm tài liệu, chưa RPC hoặc gửi giao dịch tiếp; không gán CI27cf7ac cho checkpoint tài liệu hay gọi Phase3 hoàn tất.
