# 004 — Anchor từ A đến Z: lý thuyết và ví dụ tối thiểu

> Ngày kiểm tra: 2026-11-17 (Asia/Ho_Chi_Minh). Phạm vi: học, không tạo project sản phẩm.
> Trạng thái: ví dụ counter bên dưới chưa chạy. Phase3 đã được phép; đang dựng hello từ template chính thức Anchor1.2.2, xem phần bổ sung cuối note.

## 1. Mục tiêu và điều cần nhớ

Hiểu luồng **Rust → kiểm tra accounts → handler → IDL → client → test → devnet → verify**. Anchor sinh nhiều kiểm tra nhưng không tự biết luật nghiệp vụ của ứng dụng. Đọc sau [002](002-solana-basics.md) và [003](003-solana-toolchain.md); khoảng 25–35 phút, có thể chia hai buổi.

Ví dụ counter chỉ để học authority và PDA, không phải ý tưởng sản phẩm. Không có `programs/`, `app/` hoặc sandbox nào được tạo trong phiên này.

## 2. Phiên bản và bằng chứng kiểm tra

| Thành phần | Phiên bản hoặc mốc tài liệu | Mức kiểm chứng |
| --- | --- | --- |
| Anchor CLI / `anchor-lang` | **1.2.2**, release 28/10/2026 | Đọc release, source tag và docs; chưa cài |
| Agave / platform-tools / SBPF | **4.1.2 / v1.57 / v3** | Khuyến nghị release, chưa build |
| Anchor TS client | **`@anchor-lang/core` 1.2.2**, Node >=20.18 | Đọc package manifest; vẫn dùng web3.js 1.x |
| LiteSVM Rust | **0.15.0** trong template mới của Anchor 1.2.2 | Release notes xác nhận; không tự thay bằng latest |
| Surfpool | **1.5.0** trong CI Anchor v1.2.2 | Đọc workflow, không chạy integration |
| Mollusk | **0.16.2** trong matrix Foundation đã đọc | Chưa kiểm chứng tổ hợp dependency với ví dụ này |
| Codama / adapter / JS renderer | **1.11.0 / 1.5.6 / 2.9.0** | Metadata npm truy cập 17/11; chưa cài hoặc chạy codegen |

[CI tại tag v1.2.2](https://github.com/otter-sec/anchor/blob/v1.2.2/.github/workflows/tests.yaml) còn pin Node 22.22.3; máy hiện tại Node 24.22.2 chỉ mới kiểm tra `--version`. Không gọi môi trường này là đã pass CI. Codama `main` đang có CLI 2.0.0-rc.0 trong source; **main không phải npm stable**.

## 3. Kiến thức chính

### Cấu trúc một project Anchor — chỉ là sơ đồ

```text
sandbox/study-counter/          # vị trí giả định, chưa được tạo
  Anchor.toml                  # cluster, toolchain, programs, scripts
  Cargo.toml / Cargo.lock       # Rust workspace và dependency resolution
  programs/study-counter/      # chỉ nằm trong sandbox khi được cho phép
    Cargo.toml
    src/lib.rs
  tests/                       # hoặc test crate theo template được chọn
  target/idl/                  # IDL sinh từ build
  target/types/                # kiểu TS tùy template/client
  target/deploy/               # .so và có thể có program keypair
  target/verifiable/           # artifact từ reproducible build
```

Vị trí test và artifact phụ thuộc template. `anchor init`/build có thể sinh keypair và tải dependencies; vì ranh giới phiên này cấm tạo keypair nên chỉ xem sơ đồ. Nếu làm sandbox sau này, phải chốt ignore và cách giữ keys trước, không tạo `programs/` ở root repo Taskbar Hero. [Program structure](https://www.anchor-lang.com/docs/basics/program-structure), [CLI](https://www.anchor-lang.com/docs/references/cli)

### Macro, account type và constraints

`#[program]` đặt trên module chứa instruction handlers. `Context<T>` đưa các account đã được xử lý qua `T: Accounts` vào handler. `#[derive(Accounts)]` sinh logic đọc/kiểm tra danh sách account. `#[account]` mô tả data account và cơ chế serialization/discriminator. `remaining_accounts` vẫn cần được tự kiểm tra đầy đủ. [Program structure](https://www.anchor-lang.com/docs/basics/program-structure)

| Khai báo | Chứng minh điều gì? | Chưa chứng minh điều gì? |
| --- | --- | --- |
| `Signer<'info>` / `signer` | Account có signer privilege | Có phải authority hợp lệ của state không |
| `Account<'info, T>` | Owner đúng theo T, deserialize/type discriminator hợp lệ | Đúng account của user/pool/order cần xử lý không |
| `Program<'info, System>` | Đúng program ID và executable | Mọi CPI đều đúng logic nghiệp vụ không |
| `mut` | Writable và write-back khi phù hợp | Quyền kinh tế/quyền người dùng |
| `init, payer, space` | Tạo/khởi tạo account, cấp tiền và dung lượng | Không có bug trong handler initialize |
| `seeds, bump` | Địa chỉ PDA đúng theo derivation | Người gọi được phép hành động không |
| `has_one = authority` | Field trong state khớp key authority truyền vào | Authority có signer hay không |
| `address = ...` / `owner = ...` | Đúng key / đúng program owner | Hai điều này không thay thế cho nhau |
| `constraint = ...` | Biểu thức tùy chỉnh đúng | Tính đầy đủ của toàn bộ invariant |
| `close = recipient` | Đóng và chuyển lamports theo cơ chế Anchor | Recipient có được phép nhận, account có được tái tạo không |

Đọc từng cơ chế tại [Account constraints](https://www.anchor-lang.com/docs/references/account-constraints) và [Account types](https://www.anchor-lang.com/docs/references/account-types). Không dùng `UncheckedAccount` chỉ để hết lỗi compile; phải giải thích đầy đủ kiểm tra bằng comment `CHECK` và code.

### Error, event và IDL

Handler trả `Result<()>`. Dùng `#[error_code]`, `#[msg(...)]`, `require!` hoặc `error!` để trả lỗi có ý nghĩa; business input sai không nên gây `unwrap()` panic. Không hard-code error number trong client nếu đã có IDL/generated constants. [Errors](https://www.anchor-lang.com/docs/features/errors)

`#[event]` + `emit!` phát dữ liệu vào logs. `emit_cpi!` dùng self-CPI, cần feature/account setup tương ứng và tốn thêm compute. Logs có thể bị provider cắt; event nhìn thấy trong transaction thất bại không chứng minh state đã commit. Client/indexer phải kiểm tra transaction success, commitment và xử lý trùng. [Events](https://www.anchor-lang.com/docs/features/events)

IDL là mô tả JSON của instruction, accounts, args, types và errors — không phải chương trình thực thi. `anchor build` sinh `target/idl/<name>.json`; feature `idl-build` trong Cargo cần được cấu hình đúng. IDL có thể được công bố qua Program Metadata; file do người lạ gửi vẫn phải kiểm tra program ID và build tương ứng. [IDL](https://www.anchor-lang.com/docs/basics/idl)

### Codama và client

Luồng học: Anchor IDL → adapter Codama → Codama IDL/visitors → client được generate. Codama CLI nhận đường dẫn Anchor IDL và chuyển đổi; renderer quyết định SDK/client đầu ra. Không sửa tay file generated rồi quên regenerate khi ABI thay đổi. [Codama README](https://github.com/codama-idl/codama), [Anchor adapter](https://github.com/codama-idl/codama/tree/main/packages/nodes-from-anchor)

Đừng trộn hai kiểu client: `@anchor-lang/core@1.2.2` vẫn phụ thuộc web3.js 1.x, trong khi client mới theo Kit có kiểu address/signer khác. Chọn renderer/SDK cùng một nhánh và test decode account + encode instruction. Không giả định `PublicKey`, `Address`, `BN` và `bigint` thay thế nhau tự động.

## 4. Ví dụ hoặc quy trình tối thiểu

### A. Counter có authority và PDA

**Đoạn trích tự soạn, chưa biên dịch; không phải project hoàn chỉnh.** Để ghép vào sandbox sau này cần manifest, `declare_id!` với **program ID thật của sandbox**, IDL feature và test harness. Không dùng System Program ID làm ID của program riêng. Không tạo ID/keypair trong phiên này.

```rust
use anchor_lang::prelude::*;

#[program]
pub mod study_counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.authority = ctx.accounts.authority.key();
        counter.value = 0;
        counter.bump = ctx.bumps.counter;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.value = counter.value.checked_add(1)
            .ok_or(error!(StudyError::Overflow))?;
        emit!(Incremented {
            counter: counter.key(),
            value: counter.value,
        });
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + Counter::INIT_SPACE,
        seeds = [b"study-counter", authority.key().as_ref()],
        bump
    )]
    pub counter: Account<'info, Counter>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    pub authority: Signer<'info>,
    #[account(
        mut,
        seeds = [b"study-counter", authority.key().as_ref()],
        bump = counter.bump,
        has_one = authority
    )]
    pub counter: Account<'info, Counter>,
}

#[account]
#[derive(InitSpace)]
pub struct Counter {
    pub authority: Pubkey,
    pub value: u64,
    pub bump: u8,
}

#[event]
pub struct Incremented {
    pub counter: Pubkey,
    pub value: u64,
}

#[error_code]
pub enum StudyError {
    #[msg("Counter overflow")]
    Overflow,
}
```

Payload có 32 + 8 + 1 = **41 byte**; cộng discriminator mặc định 8 byte thành **49 byte**. Con số 8 ở đây là lựa chọn default của ví dụ, không khẳng định mọi Anchor account đều dùng 8 byte. `InitSpace` tính payload chứ không tự cấp lamports. Bump lưu khi `init` đã được lấy từ canonical derivation; không nhận bump tùy ý từ client. [Account space](https://www.anchor-lang.com/docs/references/space)

Trong initialize, `init` làm CPI đến System Program. Nếu tự viết CPI khác, dùng `CpiContext` và `with_signer` khi cần PDA signer; account đích và program đích phải được validate. Xem [Anchor CPI](https://www.anchor-lang.com/docs/basics/cpi).

### B. Codegen: lệnh để đánh giá trong sandbox sau này

**Chỉ tham khảo — chờ đồng ý cài/chạy.** Không chạy các lệnh ở root sản phẩm. Các version dưới được xác nhận tồn tại trên npm, chưa chứng minh tương thích cả bộ với Anchor IDL của ví dụ.

```sh
pnpm add -D codama@1.11.0 @codama/nodes-from-anchor@1.5.6 @codama/renderers-js@2.9.0
pnpm exec codama init
# Chọn target/idl/study_counter.json và preset JavaScript.
# Đọc config sinh ra; xác nhận đường dẫn output nằm trong sandbox.
pnpm exec codama run js
```

Tên script `js` phải tồn tại trong config đã sinh. Visitor chưa có có thể khiến CLI hỏi cài dependency; phải duyệt danh sách trước. Cần test round-trip serialization và program ID, không suy ra tên generated API chỉ từ tên Rust handler.

### C. Ba lớp test

| Lớp | Công cụ | Bài thử counter | Giới hạn |
| --- | --- | --- | --- |
| Unit/in-process | LiteSVM | Nạp `.so`, cấp state giả lập, gửi transaction, assert state/error/CU | Mô phỏng không kiểm tra RPC/network thực |
| Instruction-level | Mollusk | Đưa instruction + accounts rõ ràng, assert kết quả và state | Không có validator/AccountsDB đầy đủ; fixture có thể không giống state hợp lệ |
| Integration local | Surfpool + client, hoặc `anchor test` | RPC, IDL/client, nhiều instruction, confirm và fetch lại | Feature set/upstream phải kiểm soát |
| Smoke devnet | CLI/client + devnet | Deploy đã duyệt, gửi một luồng hợp lệ và một luồng sai quyền | Không thay cho security tests; phụ thuộc faucet/RPC |

Đây là **test plan**, không phải kết quả test:

1. Initialize của Alice: authority đúng, value 0, bump đúng, owner program đúng.
2. Alice increment: value từ 0 lên 1; event khớp state đã commit.
3. Bob ký và đưa account Alice: bị từ chối; value không đổi.
4. Account đúng layout nhưng owner sai hoặc PDA sai: bị từ chối trước handler.
5. `value == u64::MAX`: trả `Overflow`, state không wrap về 0.
6. Initialize lại PDA đang tồn tại: lỗi; không reset state.

Không tắt signature checks trong test sai quyền rồi kết luận signer bảo vệ được. Fixture sửa trực tiếp state nên được ghép thêm test khởi tạo qua instruction thật. Nguồn: [LiteSVM](https://www.anchor-lang.com/docs/testing/litesvm), [Mollusk](https://www.anchor-lang.com/docs/testing/mollusk).

`anchor test` mặc định dùng Surfpool cho localnet khi cần local network; một số Rust template chạy VM trong process nên không cần local validator. Để giữ ranh giới không đọc mainnet, phương án **cho phiên được phép chạy** là:

```sh
# Hai terminal riêng, chỉ sau khi cấu hình sandbox và signer đã được duyệt.
surfpool start --offline --no-deploy
anchor test --provider.cluster localnet --skip-local-validator

# Hoặc dùng solana-test-validator do Anchor quản lý, không clone account từ xa.
anchor test --provider.cluster localnet --validator legacy
```

Đây là hai lựa chọn, không chạy đồng thời. Kiểm tra scripts/runbooks không còn remote clone/fork; `--offline` là không dùng remote datasource, không phải lời hứa mọi script tùy chỉnh đều offline. [Surfpool CLI](https://solana.com/docs/tools/surfpool/toolchain/cli), [Anchor test](https://www.anchor-lang.com/docs/references/cli)

### D. Devnet deploy và verify build

Quy trình lý thuyết sau chỉ dùng khi **đã có sự cho phép thực hành, signer và program ID devnet**:

1. Chốt source commit, `Cargo.lock`, Anchor/platform-tools/SBPF, features và Docker image phù hợp kiến trúc.
2. Chạy test lỗi quyền và kiểm tra `declare_id!`, Anchor.toml, IDL address khớp. Đảm bảo fee payer/upgrade authority là lựa chọn có chủ ý.
3. Build verifiable trong program crate của sandbox; deploy **chính artifact verifiable** lên devnet.
4. Xem program/upgrade authority/transaction trên explorer chọn devnet. Verify bytecode từ source và đúng cluster; đối chiếu IDL nếu có công bố.

Lệnh minh họa từ docs, **chưa chạy**, placeholder phải thay bằng ID đã được duyệt:

```sh
# Đứng trong program crate của sandbox (thư mục chứa Cargo.toml của program).
anchor build --verifiable
anchor --provider.cluster devnet program deploy --verifiable
anchor --provider.cluster devnet verify -p study_counter <DEVNET_PROGRAM_ID>
```

Docker có thể tải image; không được xem đó là bước cài đặt đã được duyệt tự động. `anchor build` thông thường ghi `.so` ở `target/deploy`, còn verifiable ở `target/verifiable`. Verify artifact A trong khi đã deploy artifact B là sai quy trình. [Verifiable builds](https://www.anchor-lang.com/docs/references/verifiable-builds)

Verify thành công chỉ nói binary/IDL khớp theo phép kiểm tra đó, **không chứng minh program không có lỗ hổng**. Public verification service có thể hỗ trợ cluster khác nhau; chưa xác minh dịch vụ nào nhận devnet trong phiên này. Không revoke upgrade authority như một “bước dọn dẹp” tự động.

## 5. Tự kiểm tra

1. Bỏ `has_one` nhưng giữ `Signer`: đủ chưa? **Không thể kết luận**, phải chứng minh quan hệ bằng seeds/constraint khác; không được chỉ dựa signer.
2. Sửa data mà bỏ `mut`: chuyện gì? **Không đáp ứng writable/write-back yêu cầu**; phải khai báo đúng.
3. IDL có làm enforce authorization không? **Không**, runtime/program kiểm tra; client UI có thể bị bỏ qua.
4. Hai instruction, instruction sau fail nhưng log trước có event: có được hiển thị “thành công”? **Không**, xem kết quả transaction.
5. Tự vẽ luồng IDL → Codama → client và nêu nơi kiểm tra program ID. **Đạt** khi không nhầm codegen với deploy.
6. Viết bảng sáu test ở mục C với state trước/sau; không cần cài gì để làm bài này.

## 6. Nguồn và độ tin cậy

- Maintainer: [Anchor release 1.2.2](https://www.anchor-lang.com/docs/updates/release-notes/1-2-2), [CI pinned versions](https://github.com/otter-sec/anchor/blob/v1.2.2/.github/workflows/tests.yaml).
- Chính thức: [Program structure](https://www.anchor-lang.com/docs/basics/program-structure), [Constraints](https://www.anchor-lang.com/docs/references/account-constraints), [Types](https://www.anchor-lang.com/docs/references/account-types), [Space](https://www.anchor-lang.com/docs/references/space), [CPI](https://www.anchor-lang.com/docs/basics/cpi).
- Chính thức: [Errors](https://www.anchor-lang.com/docs/features/errors), [Events](https://www.anchor-lang.com/docs/features/events), [IDL](https://www.anchor-lang.com/docs/basics/idl), [CLI](https://www.anchor-lang.com/docs/references/cli), [Verifiable builds](https://www.anchor-lang.com/docs/references/verifiable-builds).
- Maintainer: [Codama](https://github.com/codama-idl/codama), metadata phiên bản [codama 1.11.0](https://registry.npmjs.org/codama/1.11.0), [adapter 1.5.6](https://registry.npmjs.org/@codama%2fnodes-from-anchor/1.5.6), [renderer 2.9.0](https://registry.npmjs.org/@codama%2frenderers-js/2.9.0).
- Chính thức: [LiteSVM](https://www.anchor-lang.com/docs/testing/litesvm), [Mollusk](https://www.anchor-lang.com/docs/testing/mollusk), [Surfpool CLI](https://solana.com/docs/tools/surfpool/toolchain/cli).

Truy cập 17/11/2026; docs sống có thể cập nhật sau tag. Ví dụ và test plan là nội dung tự soạn, không phải output test có sẵn.

## 7. Điểm chưa kiểm chứng và bước tiếp theo

Chưa compile Rust snippet, generate client, chạy unit/integration, deploy hoặc verify. Các bước đó cần toolchain/signers và có thể tạo keypair; chưa nằm trong hành động đã thực hiện.

Đọc [007](007-solana-program-security.md), dùng checklist để review ví dụ trên giấy. Quyền Phase3 đã có ở DECISION; counter không tự trở thành tính năng ClusterProof.

### Chuẩn bị hello Phase3 trước scaffold — 17/11/2026

Đã đọc help `anchor init/build` từ binary1.2.2 và source `cli/src/template.rs` tại tagv1.2.2/rev8d9d1488. Chọn single-file hello, `--test-template litesvm`, `--no-install`, `--no-git`, `--no-security-metadata`: lab ít code, không phải template production. LiteSVM template0.15.0 kèm Cargo.lock upstream; chạy VM trong process, không cần validator hay mainnet fork.

Scaffold tại thư mục tạm, đọc kết quả trước đưa manifests/program/tests vào repo. Pin Anchor1.2.2/Agave4.1.2; build platform-tools v1.57/SBPFv3. Fee payer devnet và program keypair để ngoài repo; target keypair chỉ symlink bị ignore. Test phải nạp .so thật, gọi initialize và assert thành công/log; thêm instruction discriminator sai bị reject để chứng minh dispatch, không gọi đó là audit quyền của sản phẩm. Build sinh IDL thật; địa chỉ IDL/declare_id/config phải khớp program keypair public address. Chưa scaffold/build/test ở lúc viết đoạn này.
