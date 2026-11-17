# 022 — Chuẩn bị Phase 2/3: interface, test và môi trường

> Codex · 17/11/2026 · trước sự kiện. Đặt chỗ tại commit `1aa322a` trước khi viết. Ban đầu chuẩn bị độc lập ở chặng E; nay người dùng chọn ClusterProof chính/NetPay Check dự phòng và đồng ý cài toolchain, xem DECISION. **Chưa có build/deploy/CI mới tại lúc viết note.**

## 1. Mục tiêu và điều cần nhớ

Giữ contract giữa parser, report và UI ổn định để C/A không tự suy nghĩa MATCH/UNKNOWN khác nhau. Tách test model khỏi runtime, và tách kết quả nghiên cứu khỏi product acceptance. Phase3 hello Anchor là bài học chạy pipeline devnet, không thuộc logic core ClusterProof.

## 2. Nguồn/version đã kiểm

| Thành phần | Snapshot / trạng thái |
| --- | --- |
| Bộ toolchain | Note003: Rust1.100.0, Agave4.1.2, Anchor/AVM1.2.2, platform-tools v1.57, SBPFv3; người dùng đã cho phép cài, chưa build xác nhận |
| Anchor CI tại v1.2.2 | `.github/workflows/tests.yaml`, blob426a0c7f4206d8f77b8a151485eac119a185b99c: Agave4.1.2, Node22.22.3, Surfpool1.5.0; upstream config, không phải CI đội đã chạy |
| Máy/Node | Node24.22.2 đã dùng cho research suite; Rust/Agave/Anchor cần kiểm lại PATH trước cài |
| Next.js template | `solana-foundation/templates/kit/nextjs/package.json`, blobd032d077202d0b5deb56326fd856a9de9725a677: Node>=24, Kit^8.5.0, Next16.4.3, React19.2.8, RPC plugin^0.19.0; chưa cài, ranges chưa lock |
| React-Vite template | README blob274a65d0ddc51a3d177f691b606793f03ed0ddf0; React/Vite/Tailwind/react-hooks; chưa đọc đủ dependency graph |
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

### CI dự kiến, chưa bật workflow

1. `pull_request`/push theo nhánh, `permissions: contents: read`, không secret devnet signer trong PR jobs. Không checkout mã PR bằng `pull_request_target` có quyền cao.
2. Research/parser job dùng Node24 và lệnh `node --test` trên tests offline; không gọi script discovery/live.
3. Program job chỉ sau setup toolchain: pin versions + Cargo.lock, build thật, runtime tests offline. Local validator không clone/fork mainnet; dùng môi trường phù hợp SBPFv3.
4. Web job pin package manager/lockfile, build/typecheck/test với mocked RPC; config production không chứa server secret.
5. Action dependencies khóa bằng lockfile khi được hỗ trợ, hoặc full commit SHA đã kiểm; không tự điền SHA chưa biết. Cache key gồm OS/arch/toolchain/lockfile, không cache ví/keypair.
6. Artifact chỉ .so/IDL/test report public; không target/deploy keypair. Deploy devnet/web là bước riêng được kiểm quyền, không tự chạy từ PR người lạ.

[GitHub secure use](https://docs.github.com/en/actions/reference/security/secure-use) hỗ trợ least-privilege, cách tránh PR privileged checkout và khóa actions; đây là thiết kế của đội, chưa có run CI. YAML sẽ viết khi xác định setup chạy thật, không tạo workflow giả xanh bằng echo.

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

Chưa cài/build/deploy/CI mới tại checkpoint này. Hoàn thiện IDEA/ARCHITECTURE cho lựa chọn đã ghi, triển khai setup Phase3 song song; chỉ cập nhật cổng ra bằng logs/link/transaction thật và review cần thiết.

### Bài học / lỗi đã gặp

| Bẫy | Xử lý |
| --- | --- |
| Cho rằng template readme ít bước nghĩa không có remote network | Next template dùng mainnet fallback trong test; giữ offline/devnet và kiểm test setup trước chạy |
| Nhầm token fee với compute fee trong T4/T6 của A | So source Token-2022, không dùng ComputeBudget làm giải pháp net token |
| T5 đã có queue nhưng A chờ chỉ thị | Ghi rõ T5 được làm ngay; C tiếp tục chuẩn bị độc lập, không chờ |
| Kết quả build/version chưa có | Giữ D1, không đổi note003 thành đã cài chỉ từ sự đồng ý của người dùng |
