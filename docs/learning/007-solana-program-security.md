# 007 — Checklist bảo mật Solana program

> Ngày kiểm tra: 2026-11-17 (Asia/Ho_Chi_Minh). Phạm vi: review phòng thủ và bài tập.
> Trạng thái: đối chiếu Anchor 1.2.2/docs/source; snippet chưa compile, chưa khai thác hoặc test on-chain.

## 1. Mục tiêu và điều cần nhớ

Giả định người gọi điều khiển instruction args và danh sách account, có thể bỏ qua UI của bạn. Mỗi instruction phải chứng minh: **đúng owner, đúng type, đúng địa chỉ/quan hệ, đúng signer và đúng trạng thái nghiệp vụ**. Một kiểm tra không thay thế tất cả những kiểm tra còn lại.

Đọc sau [004](004-anchor-a-to-z.md). Dùng checklist này cho mọi program sau này, nhưng không gọi đây là audit hoàn chỉnh hoặc bằng chứng code an toàn.

## 2. Phiên bản và bằng chứng kiểm tra

| Thành phần | Phiên bản hoặc mốc tài liệu | Mức kiểm chứng |
| --- | --- | --- |
| Anchor | **1.2.2** | Docs + source tag của `Account<T>`/release; chưa chạy |
| Rust arithmetic | Docs **1.100.0** truy cập 17/11/2026 | `checked_add`/`checked_sub`; không phải Rust đã cài |
| Solana PDA/CPI | Docs sống truy cập 17/11/2026 | Không xác minh feature set cluster |
| Foundation security reference | Commit **c9da2624cc6baca5c8c2123ea50d92ef19f1c917**, 04/11/2026 | Đọc tham khảo, đối chiếu lại chi tiết với Anchor hiện tại |

Anchor 1.2.2 có thêm bảo vệ khi close vào chính nó và khi account đổi owner trong lúc xử lý; không nên viết note dựa hoàn toàn vào tutorial cũ. [Release 1.2.2](https://www.anchor-lang.com/docs/updates/release-notes/1-2-2)

## 3. Kiến thức chính

### Checklist dùng khi review

Mỗi ô chỉ đánh dấu sau khi có đường dẫn code hoặc test chứng minh. `N/A` phải giải thích.

- [ ] S01 — Mọi hành động đặc quyền có signer và liên kết authority.
- [ ] S02 — Data account có owner check; deserialize không được coi là owner check.
- [ ] S03 — Account đúng user/vault/pool/mint; chống account substitution.
- [ ] S04 — Seeds có namespace và encoding không mơ hồ; canonical bump lúc init.
- [ ] S05 — Arithmetic/cast/rounding có quy tắc và kiểm tra overflow/underflow.
- [ ] S06 — Input không tin cậy không đi vào `unwrap`, `expect` hoặc indexing có thể panic.
- [ ] S07 — Initialize/update tách rõ; không reset state khi account đã tồn tại.
- [ ] S08 — Close đúng authority/recipient; đã xét revival và close rồi recreate.
- [ ] S09 — CPI target đúng ID, account/token program đúng; không truyền PDA signer dư quyền.
- [ ] S10 — Account type/discriminator đúng; không type cosplay bằng layout giống nhau.
- [ ] S11 — Vai trò cần khác nhau không nhận cùng một account mutable.
- [ ] S12 — Sau CPI, dữ liệu đọc lại không stale; invariant trước/sau được kiểm tra.

Ngoài phạm vi snippet: account size/realloc, oracle freshness, slippage, replay/idempotency, Token-2022 extensions, upgrade authority và dependency supply chain cần review theo sản phẩm cụ thể. Không tự thêm token/DeFi logic trước khi có ý tưởng.

## 4. Ví dụ hoặc quy trình tối thiểu

**Tất cả là đoạn trích độc lập trong Anchor, không phải một file có thể copy rồi compile.** Field snippets đặt trong `#[derive(Accounts)]`; handler snippets đặt trong hàm trả `Result<()>`. Các kiểu `Vault`, `Config` là data struct có `#[account]` do ví dụ giả định; `Vault` có `authority: Pubkey`, `balance: u64`. `ReviewError` là enum tự định nghĩa bằng `#[error_code]` với các variant được dùng. Phải ghép đủ constraints liên quan khi triển khai thật; nhãn “đúng” chỉ sửa lỗi đang minh họa.

### S01 — Missing signer check

So khớp public key không chứng minh chủ key đã cho phép. Giữ `has_one = authority` trên vault nhưng thay field như sau:

```rust
// SAI: attacker có thể truyền địa chỉ authority thật mà không có chữ ký.
/// CHECK: minh họa thiếu signer check, không dùng trong code thật.
pub authority: UncheckedAccount<'info>,

// ĐÚNG cho quyền signer; vẫn cần has_one/seeds liên kết với vault.
pub authority: Signer<'info>,
```

Test âm: đưa đúng key authority nhưng không ký; hoặc Bob ký thay Alice. Phải lỗi và state giữ nguyên. `Signer` trong CPI có thể là PDA signer hợp lệ, không nhất thiết chữ ký ngoài cùng. [Account types](https://www.anchor-lang.com/docs/references/account-types)

### S02 — Missing owner check

Attacker có thể đưa bytes giống account của bạn từ program khác. `try_deserialize` đọc bytes không tự kiểm tra `AccountInfo.owner`.

```rust
// SAI: field unchecked rồi chỉ deserialize payload trong handler.
/// CHECK: ví dụ sai vì thiếu owner check.
pub vault: UncheckedAccount<'info>,
// Vault::try_deserialize(&mut &data[..])? không đủ để xác nhận owner.

// ĐÚNG: với Vault là #[account] của program này.
pub vault: Account<'info, Vault>,
```

Nếu cần unchecked cho ABI ngoài, bổ sung `owner = expected_program` và kiểm tra layout/type/address riêng; owner đúng vẫn chưa đủ. Test âm: bytes/discriminator giống hệt nhưng owner khác. [Source `Account::try_from`](https://github.com/otter-sec/anchor/blob/v1.2.2/lang/src/accounts/account.rs)

### S03 — Account substitution / data matching

Account do đúng program sở hữu có thể thuộc user hoặc pool khác. Ràng buộc signer với state:

```rust
// SAI: một signer bất kỳ có thể được ghép với vault của Alice.
#[account(mut)]
pub vault: Account<'info, Vault>,
pub authority: Signer<'info>,

// ĐÚNG: field Vault.authority phải bằng key signer.
#[account(mut, has_one = authority)]
pub vault: Account<'info, Vault>,
pub authority: Signer<'info>,
```

Nếu thiết kế có một PDA vault/user thì thêm seeds đúng namespace; nếu token thì còn kiểm tra mint, token authority và token program. Test âm: account của user B, vault cùng type ở pool khác, mint khác. [Constraints](https://www.anchor-lang.com/docs/references/account-constraints)

### S04 — PDA seed collision và bump tùy ý

Đây thường là **trùng biểu diễn đầu vào**, không phải phá SHA-256. Seed strings độ dài thay đổi có thể ghép thành cùng bytes.

```rust
// SAI về thiết kế: ["ab", "c"] và ["a", "bc"] mơ hồ.
#[account(seeds = [b"order", left.as_bytes(), right.as_bytes()], bump)]
pub order: Account<'info, Order>,

// ĐÚNG theo thiết kế order/user có order_id u64:
// struct Accounts khai báo #[instruction(order_id: u64)]
#[account(
    seeds = [b"order", authority.key().as_ref(), &order_id.to_le_bytes()],
    bump,
    has_one = authority
)]
pub order: Account<'info, Order>,
pub authority: Signer<'info>,
```

Cần init với cùng schema seeds, canonical `bump` rồi lưu `ctx.bumps.order` nếu muốn dùng lại; không nhận một bump khác chỉ vì nó cũng off-curve. Seed string tùy ý phải có encoding không mơ hồ hoặc hash cấu trúc có độ dài rõ ràng. Test hai cặp chuỗi ở trên, ID biên và bump không canonical. [PDA derivation](https://solana.com/docs/core/pda/pda-derivation)

### S05 — Arithmetic overflow / underflow

```rust
// SAI: kết quả phụ thuộc overflow-checks/build hoặc wrap không mong muốn.
vault.balance += amount;

// ĐÚNG: lỗi có ý nghĩa, không commit số dư sai.
vault.balance = vault.balance.checked_add(amount)
    .ok_or(error!(ReviewError::Overflow))?;
```

Tương tự dùng `checked_sub`, `checked_mul`, kiểm tra mẫu số khác 0, `try_from` khi thu hẹp kiểu và quy tắc làm tròn. `saturating_*` chỉ đúng nếu saturation thật sự là nghiệp vụ; không dùng để che thiếu tiền. Test `u64::MAX + 1`, trừ lớn hơn balance, zero và rounding. [Rust checked arithmetic](https://doc.rust-lang.org/std/primitive.u64.html#method.checked_add)

### S06 — `unwrap()` panic

```rust
// SAI: bytes là input không tin cậy; rỗng sẽ panic.
let tag = *bytes.first().unwrap();

// ĐÚNG: trả Anchor error, bytes: &[u8].
let tag = bytes.first().copied()
    .ok_or(error!(ReviewError::EmptyInput))?;
```

Panic có thể làm transaction fail và gây DoS cho luồng nghiệp vụ; không thay `unwrap()` bằng `expect()` rồi gọi là sửa. `unwrap()` trong test fixture có thể phù hợp để test fail nhanh, khác production handler. Test input rỗng, buffer thiếu và enum tag không hợp lệ. [Anchor errors](https://www.anchor-lang.com/docs/features/errors)

### S07 — Re-initialization

`init_if_needed` không mặc nhiên là bug. Bug xuất hiện khi dùng lại account nhưng handler vẫn reset authority/balance hoặc không kiểm tra invariant.

```rust
// SAI nếu handler luôn ghi vault.authority = authority.key(); balance = 0.
#[account(init_if_needed, payer = authority, space = 8 + Vault::INIT_SPACE)]
pub vault: Account<'info, Vault>,

// ĐÚNG cho luồng chỉ được initialize khi account chưa tồn tại.
#[account(init, payer = authority, space = 8 + Vault::INIT_SPACE)]
pub vault: Account<'info, Vault>,
```

Cả hai snippet còn cần payer `mut Signer`, System Program, `InitSpace` và seeds nếu là PDA. Bản sai cần feature `init-if-needed` để compile. `init` ngăn init lại account đang tồn tại, **không ngăn close rồi recreate**; nếu invariant “mỗi user chỉ claim một lần suốt đời”, cần state bền vững khác giữ dấu claim. Test init hai lần và close→recreate, không chỉ test account rỗng. [Constraints](https://www.anchor-lang.com/docs/references/account-constraints)

### S08 — Close sai / account revival

```rust
// SAI nếu coi việc rút hết lamports là đã đóng account đầy đủ.
let all = ctx.accounts.vault.to_account_info().lamports();
ctx.accounts.vault.sub_lamports(all)?;
ctx.accounts.authority.add_lamports(all)?;
// Data/lifecycle chưa được xử lý; có thể bị cấp lamports lại trong transaction.

// ĐÚNG: field trong Accounts, để Anchor xử lý close.
#[account(mut, has_one = authority, close = authority)]
pub vault: Account<'info, Vault>,
#[account(mut)]
pub authority: Signer<'info>,
```

Chọn recipient theo nghiệp vụ, không nhận arbitrary destination vì “chỉ hoàn rent”. Rà CPI/account references sau close và invariant chống recreate. Anchor 1.2.2 chặn close vào chính account đó; vẫn cần test recipient sai, refund trong cùng transaction và tái sử dụng sau close. [Close constraint](https://www.anchor-lang.com/docs/references/account-constraints), [release fix](https://www.anchor-lang.com/docs/updates/release-notes/1-2-2)

### S09 — CPI tới program giả

```rust
// SAI: CPI dùng key của account do caller chọn mà không pin ID.
/// CHECK: ví dụ sai, chưa xác minh CPI target.
pub system_program: UncheckedAccount<'info>,

// ĐÚNG nếu CPI phải gọi System Program.
pub system_program: Program<'info, System>,
```

Với SPL Token truyền thống dùng `Program<'info, Token>` từ `anchor_spl::token`; khi hỗ trợ Token-2022 có chủ ý dùng `Interface<TokenInterface>` và ràng buộc token account/mint phù hợp. Chỉ kiểm tra `executable` vẫn cho phép program giả. Test program executable sai ID; chỉ cấp writable/PDA signer cần thiết cho CPI. [Anchor CPI](https://www.anchor-lang.com/docs/basics/cpi), [Program/Interface types](https://www.anchor-lang.com/docs/references/account-types)

### S10 — Type cosplay

Owner đúng nhưng type sai vẫn nguy hiểm: một `UserProfile` có layout gần `Config` không được dùng thay config quản trị.

```rust
// SAI: owner check có, nhưng handler chỉ đọc bytes theo layout Config.
/// CHECK: ví dụ sai vì chưa xác minh account type/discriminator.
#[account(owner = crate::ID)]
pub config: UncheckedAccount<'info>,

// ĐÚNG khi Config là #[account] với discriminator riêng.
pub config: Account<'info, Config>,
```

Không dùng `try_from_unchecked` để bỏ qua discriminator, không tùy biến hai type có cùng discriminator. Sau type check vẫn cần seeds/address cho đúng singleton config. Test account khác type cùng owner và cùng độ dài dữ liệu. [Source `Account<T>`](https://github.com/otter-sec/anchor/blob/v1.2.2/lang/src/accounts/account.rs)

### S11 — Duplicate mutable accounts

```rust
// SAI nếu nghiệp vụ yêu cầu hai vault khác nhau nhưng lại cho alias.
#[account(mut)]
pub source: Account<'info, Vault>,
#[account(mut, dup)]
pub destination: Account<'info, Vault>,

// ĐÚNG: không bật dup và thể hiện invariant hai địa chỉ khác nhau.
#[account(mut)]
pub source: Account<'info, Vault>,
#[account(mut, constraint = destination.key() != source.key())]
pub destination: Account<'info, Vault>,
```

Anchor hiện mặc định chặn duplicate mutable cho các type serialize-on-exit, nhưng không bao trùm `UncheckedAccount`, `Signer`, `AccountLoader`… Đừng thêm `dup` chỉ để test pass. Các checks owner/authority của chuyển tiền vẫn bắt buộc, không được bỏ vì snippet trên ngắn. Test cùng pubkey ở hai vai trò. [Constraint `dup`](https://www.anchor-lang.com/docs/references/account-constraints)

### S12 — Stale data sau CPI

```rust
// SAI: CPI đã đổi token account, bản Rust deserialize trước CPI còn cũ.
let after = ctx.accounts.token.amount;

// ĐÚNG: token là typed Account của SPL Token, sau CPI đã xác minh.
ctx.accounts.token.reload()?;
let after = ctx.accounts.token.amount;
```

Reload không thay thế CPI target/owner check hoặc assert delta. Đừng reload account của mình trước khi persist những thay đổi in-memory cần giữ; phải biết ai đang là owner và ai sửa state. Test CPI thay đổi balance, kiểm tra state thật sau giao dịch. [Source `reload()`](https://github.com/otter-sec/anchor/blob/v1.2.2/lang/src/accounts/account.rs)

## 5. Tự kiểm tra

Lấy counter trong [004](004-anchor-a-to-z.md), đánh dấu checklist và viết lý do:

| Thử trên giấy | Kết quả mong đợi |
| --- | --- |
| Bob ký, truyền counter Alice | Seeds/authority check từ chối |
| Alice đúng key nhưng không signer | Signer check từ chối |
| Counter bytes hợp lệ, owner giả | Typed account từ chối |
| Account khác discriminator | Deserialize/type check từ chối |
| Increment `u64::MAX` | `Overflow`, giữ state |
| Init lại counter đang tồn tại | Không reset value/authority |

Tiêu chí đạt: với từng lỗi, chỉ ra **ai điều khiển input → kiểm tra nào từ chối → state phải giữ gì**. Khi có toolchain, viết negative tests trước; “transaction fail” thôi chưa đủ, phải kiểm tra lỗi đúng nguyên nhân và state không đổi.

## 6. Nguồn và độ tin cậy

- Chính thức: [Anchor account types](https://www.anchor-lang.com/docs/references/account-types), [constraints](https://www.anchor-lang.com/docs/references/account-constraints), [errors](https://www.anchor-lang.com/docs/features/errors), [CPI](https://www.anchor-lang.com/docs/basics/cpi).
- Maintainer pinned: [`Account<T>` source v1.2.2](https://github.com/otter-sec/anchor/blob/v1.2.2/lang/src/accounts/account.rs), [release 1.2.2](https://www.anchor-lang.com/docs/updates/release-notes/1-2-2).
- Chính thức: [Solana PDA derivation](https://solana.com/docs/core/pda/pda-derivation), [CPI privilege model](https://solana.com/docs/core/cpi), [Rust checked arithmetic](https://doc.rust-lang.org/std/primitive.u64.html#method.checked_add).
- Foundation: [security reference tại commit đã đọc](https://github.com/solana-foundation/solana-dev-skill/blob/c9da2624cc6baca5c8c2123ea50d92ef19f1c917/skills/solana-dev/references/security.md). Một số câu rút gọn ở nguồn dễ hiểu quá mức (như coi mọi `init_if_needed` là lỗi); note này bổ sung điều kiện và đối chiếu Anchor.

Truy cập 17/11/2026. Trang tham chiếu “Sealevel Attacks” trên Anchor không đọc được qua công cụ web lần này; không dùng nội dung chưa đọc làm bằng chứng. Không lấy snippet từ tutorial trước 2025 làm API hiện hành.

## 7. Điểm chưa kiểm chứng và bước tiếp theo

Chưa compile snippets, chạy test/fuzz hoặc audit sản phẩm. Các kiểu/biến giả định được ghi ở đầu mục 4; không tuyên bố đây là chương trình hoàn chỉnh.

Khi có thiết kế thật, bổ sung invariant kinh tế, state machine, lifecycle, threat model và test tương ứng. Việc security checklist tồn tại trong repo không chứng minh code đã tuân thủ; mỗi PR cần bằng chứng cụ thể.

### Lab Phase3 đã chạy — 17/11/2026

Counter lab có 6 runtime tests đạt trong [hello-check-r2.txt](../evidence/phase3/hello-check-r2.txt). Test âm: Bob ký nhưng sai authority (S03), đúng địa chỉ nhưng không signer (S01), initialize lại sau increment (S07), vượt MAX_COUNT10 (S05), instruction discriminator không tồn tại. Mỗi ca kiểm log lỗi đúng và data/lamports/owner của counter không đổi. Test discriminator instruction không thay test type cosplay account S10; chưa tuyên bố đã kiểm hết S01–S12 hoặc audit.

Signer đúng chưa đủ: handler vẫn so authority với state; typed Counter kiểm owner/type và PDA constraint kiểm seed. MAX_COUNT chặn trước phép cộng. Singleton seed cho lab có rủi ro ai initialize trước giữ authority, nên client phải kiểm và báo khác owner-authority thay vì reset. Không close/recreate, không token/DeFi, không dùng lab làm bằng chứng an toàn product ClusterProof.
