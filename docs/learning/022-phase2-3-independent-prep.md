# 022 — Chuẩn bị Phase 2/3: interface, test và môi trường

> Codex · 17/11/2026 · trước sự kiện. Đặt chỗ tại commit `1aa322a` trước khi viết. Ban đầu chuẩn bị độc lập ở chặng E; người dùng đã chọn ClusterProof chính/NetPay Check dự phòng và đồng ý cài toolchain, xem DECISION. **Cập nhật: hello/client/web đã build/test local, web đã public; devnet deploy và CI xanh còn mở.** Phần kế hoạch product không tự trở thành tính năng đã triển khai.

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

[GitHub secure use](https://docs.github.com/en/actions/reference/security/secure-use) hỗ trợ least-privilege, cách tránh PR privileged checkout và khóa actions. Workflow đã viết tại .github/workflows/ci.yml với research, anchor-lab/client và web; actions pin full SHA. Run44120999655 ở head7d27640 bị Billing & plans chặn trước job; local pass chưa chứng minh Linux CI xanh. Job web sẽ được chạy khi push phần web và GitHub cho phép khởi chạy.

### Phiếu cài đã được người dùng chấp thuận

Thứ tự: kiểm PATH/OS/Xcode và dung lượng → tải installer chính thức ra file tạm/đọc → Rust host1.100.0 → Agave4.1.2 → AVM/Anchor1.2.2 → build tools v1.57/SBPFv3 → kiểm version + build/test hello. Cài dưới user directories, không sửa checkout Antigravity/Taskbar Hero; không nâng Node/pnpm sẵn có chỉ vì template latest. Lệnh tham khảo và URL ở note003; khi source/version hiện hành khác phải ghi lại và xử lý, không ngầm đổi bộ.

Rust dùng ~/.cargo và ~/.rustup; Agave theo user install active_release; PATH chỉ thêm đúng binary của task. Installer có thể cần network/download dependencies đã được cho phép. Nếu thiếu system privilege/đăng nhập hoặc toolchain yêu cầu thao tác ngoài quyền cài đã có thì ghi blocker cụ thể. Không tự bypass prompt quản trị.

Sau build: lưu OS/arch/version thực, source/lockfile và log. Keypair phát sinh khi scaffold/build không được Git-track; signer dành riêng devnet giữ ngoài source, không in secret, không lấy ví tài sản thật. Scope vận hành devnet/hosting theo Prompt03; chỗ cần tài khoản người dùng phải báo đúng nhu cầu, không giả deploy thành công.

## 5. Tự kiểm tra

- Report mọi field MATCH có chứng minh ABI? Không; ABI/source là trục riêng.
- Hello tx có signature là đủ? Không; phải kiểm status/error/cluster/program và log/state thật.
- Template chính thức có được chạy tests nguyên bản? Không suy; phải đọc remote fallback và signer behavior trong phiên bản được pin.
- Node24 đã chạy parser có xác nhận Anchor CI? Không; compiler/runtime khác.
- C02 cần invoice PDA? Không; ví dụ account chỉ phục vụ học, không gắn state thừa vào sản phẩm.

## 6. Nguồn

Đọc 17/11/2026: [Anchor CI v1.2.2](https://github.com/otter-sec/anchor/blob/v1.2.2/.github/workflows/tests.yaml), [Anchor CLI](https://www.anchor-lang.com/docs/references/cli), [CPI](https://www.anchor-lang.com/docs/basics/cpi), [constraints](https://www.anchor-lang.com/docs/references/account-constraints), [GitHub secure use](https://docs.github.com/en/actions/reference/security/secure-use), [templates](https://solana.com/developers/templates), [Next package](https://github.com/solana-foundation/templates/blob/main/kit/nextjs/package.json), [Vite README](https://github.com/solana-foundation/templates/blob/main/kit/react-vite/README.md), [license](https://github.com/solana-foundation/templates/blob/main/LICENSE). Nguồn kỹ thuật là primary; contract/budget/harness là đề xuất của C.

## 7. Giới hạn và bước tiếp theo

Phần kế hoạch bên trên được viết trước setup. Cập nhật 17/11: toolchain/check-lab r2 đạt (SBFv3/IDL/6 runtime tests), client8/web8 tests đạt, web đã public. Workflow đã viết nhưng CI bị billing chặn; payer0SOL nên chưa deploy program hoặc gửi transaction devnet. IDEA/ARCHITECTURE còn cần review/duyệt; chỉ cập nhật cổng ra bằng logs/link/transaction thật và review cần thiết.

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
