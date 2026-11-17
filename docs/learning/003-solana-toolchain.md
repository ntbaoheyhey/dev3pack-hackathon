# 003 — Toolchain Solana, phiên bản và cài đặt có kiểm soát

> Ngày kiểm tra: 2026-11-17 (Asia/Ho_Chi_Minh). Phạm vi: kiểm kê và hướng dẫn.
> Trạng thái: chỉ các lệnh xem phiên bản đã chạy; toàn bộ cài đặt/build/airdrop bên dưới chưa chạy.

## 1. Mục tiêu và điều cần nhớ

Biết vai trò từng công cụ, chọn một bộ phiên bản có căn cứ và chẩn đoán lỗi đúng lớp. **Rust trên máy, Rust đi kèm platform-tools, Agave CLI và Solana SDK crates không có cùng số phiên bản.** Cập nhật `rustup` không tự sửa compiler SBF cũ.

Đọc khoảng 20 phút sau [002](002-solana-basics.md). Mọi lệnh cài, nâng cấp, tải toolchain tự động hoặc đổi cấu hình đều **chỉ tham khảo — chờ người dùng đồng ý trước khi chạy**. Đây là yêu cầu từ goal objective, không phải một bước đã được cho phép.

## 2. Phiên bản và bằng chứng kiểm tra

### Máy hiện tại: kết quả thực tế

Đã dùng `command lookup` và `--version`, không đọc file ví/config chứa secret. PATH của phiên Codex có thể khác terminal người dùng; “không thấy” chưa chứng minh không tồn tại ở nơi khác.

| Thành phần | Kết quả ngày 17/11/2026 | Mức kiểm chứng |
| --- | --- | --- |
| Máy | macOS 27.2, arm64 | Hệ điều hành báo qua `platform` |
| Node.js | **v24.22.2** | Đã chạy `node --version` |
| pnpm | **10.28.0** | Đã chạy với `COREPACK_ENABLE_NETWORK=0` |
| Docker CLI | **29.9.2**, build `a82e528` | Chỉ `docker --version`; chưa kiểm tra daemon/image |
| Codex CLI | **0.169.0-alpha.11.1** | Đã chạy `codex --version` |
| rustc / cargo / rustup | Không thấy trong PATH | Chưa cài/chưa build |
| solana / anchor / avm | Không thấy trong PATH | Chưa cài/chưa test |
| surfpool / solana-verify | Không thấy trong PATH | Chưa cài/chưa verify |

### Bảng tương thích có căn cứ

| Mục đích | Rust host | Solana CLI (Agave) | Anchor CLI/crates | Platform-tools / SBPF | Kết luận |
| --- | --- | --- | --- | --- | --- |
| Bài học mới | `anchor-lang` khai báo MSRV **1.89**; host đề xuất **1.100.0** để đánh giá trong phiên cài | **4.1.2** | **1.2.2**, giữ CLI/`anchor-lang`/`anchor-spl` đồng bộ | **v1.57 / v3** | Bộ Agave/Anchor/platform là khuyến nghị release 1.2.2; host 1.100.0 là đề xuất, **chưa build xác nhận cả bộ** |
| Đọc project 1.1.x cũ | MSRV 1.89 theo matrix Foundation | **3.1.10** được matrix ghi CI-tested | **1.1.2** nếu dự án đã pin | Matrix ghi v1.52+; phải theo lockfile/template riêng | Chỉ tham khảo cho dự án cũ; không dùng để hạ baseline mới |
| Anchor **2.0.0-rc.2** | Chưa kiểm chứng trong phiên này | Docs nhắc cohort Agave 4.3 | Release candidate | Chưa kiểm chứng | Không chọn làm mặc định học trước hackathon |

MSRV là mức Rust tối thiểu của một crate, **không bảo đảm toàn bộ dependency graph/CLI build được bằng đúng mức đó**. Bằng chứng chính: [release 1.2.2](https://www.anchor-lang.com/docs/updates/release-notes/1-2-2), [`lang/Cargo.toml` tại tag v1.2.2](https://github.com/otter-sec/anchor/blob/v1.2.2/lang/Cargo.toml), [matrix của Solana Foundation](https://github.com/solana-foundation/solana-dev-skill/blob/c9da2624cc6baca5c8c2123ea50d92ef19f1c917/skills/solana-dev/references/compatibility-matrix.md).

Rust **1.100.0** được xác minh bằng [stable manifest chính thức](https://static.rust-lang.org/dist/channel-rust-stable.toml): ngày manifest **12/11/2026**, chuỗi `1.100.0 (0ef1bc386 2026-11-09)`. Đó là kiểm tra metadata, không phải `rustc` đã cài. Không gọi 1.99 từ bài tháng 10 là “latest” ngày 17/11.

**Xử lý nguồn không đồng bộ:** matrix Foundation còn ghi latest Anchor 1.2.1 và platform-tools v1.52+; release notes **1.2.2** mới hơn chốt **v1.57**. Trang cài Anchor cũng có ví dụ output Rust 1.85.0 cũ. Ưu tiên tag/release tương ứng, không ghép các ví dụ output thành một bộ “đã test”.

Node/pnpm: manifest [`@anchor-lang/core@1.2.2`](https://github.com/otter-sec/anchor/blob/v1.2.2/ts/packages/anchor/package.json) yêu cầu Node **>=20.18**; máy hiện tại đáp ứng. [pnpm 10](https://pnpm.io/10.x/installation) hỗ trợ Node 24. Chưa chạy TypeScript client với bộ này; không nâng pnpm chỉ để giống dòng latest của website.

## 3. Kiến thức chính

### Mỗi công cụ làm gì?

| Công cụ | Vai trò |
| --- | --- |
| `rustup`, `rustc`, `cargo` | Quản lý Rust host, biên dịch, dependency/test trên máy |
| Agave `solana` CLI | RPC, cluster, account, deploy và công cụ phát triển Solana |
| `cargo build-sbf`, platform-tools | Biên dịch program thành bytecode SBF/SBPF bằng compiler chuyên dụng |
| AVM | Chọn Anchor version; bản mới còn giải quyết toolchain liên quan |
| Anchor CLI + Rust crates | Macro, build/IDL, test, deploy; không chỉ một binary |
| Node/pnpm | Chạy client/codegen/test TypeScript, quản lý dependencies JS |
| LiteSVM/Mollusk | Test program trong process, không cần RPC server đầy đủ |
| Surfpool | RPC local phục vụ integration test; phải kiểm soát nguồn upstream |
| Ví devnet | Ký giao dịch thử; khác program ID keypair và upgrade authority |

**AVM 1.2.2 có thể tự cài Solana CLI/platform-tools và chọn nightly phục vụ IDL** khi gọi `anchor` qua AVM. Vì vậy `anchor build` không phải thao tác “chỉ đọc”; `anchor init`/build còn có thể tạo program keypair. Không chạy thử trong phiên tài liệu này. [Release 1.2.2](https://www.anchor-lang.com/docs/updates/release-notes/1-2-2)

### Lỗi thường gặp và cách khoanh vùng

Các cách sửa sau là hướng dẫn, chưa tái hiện trên máy người dùng. Thay đổi hệ thống vẫn cần đồng ý.

| Dấu hiệu | Kiểm tra trước | Hướng sửa |
| --- | --- | --- |
| `command not found` | `command -v cargo solana avm anchor`; shell mới có đọc PATH không | Nạp `. "$HOME/.cargo/env"`; thêm đúng `active_release/bin` từ installer; mở lại terminal |
| macOS `xcrun`, thiếu SDK/`cc` | `xcode-select -p` | Cài Command Line Tools bằng `xcode-select --install`; không chỉnh SDK path ngẫu nhiên |
| Apple Silicon sai kiến trúc | `uname -m`, `file` binary, terminal có chạy Rosetta không | Dùng bộ arm64 nhất quán; không trộn Homebrew Intel và ARM vô tình |
| Linux/WSL thiếu linker/OpenSSL | Log compile và `pkg-config --version` | Cài dependency build của distro rồi thử lại; không chạy Cargo bằng sudo |
| `GLIBC_2.39 not found` | `ldd --version`, distro WSL | Chọn Ubuntu phù hợp hoặc build CLI từ source; không thay libc hệ thống thủ công |
| Windows tool chạy bên ngoài WSL | Đường dẫn `node`, `cargo`, `solana`; repo trên `/mnt/c`? | Dùng cùng Ubuntu/WSL2, ưu tiên repo trong filesystem Linux; tránh trộn binary Windows/Linux |
| `edition2024`, Rust quá cũ trong SBF | So sánh `rustc --version` với `cargo build-sbf --version`/log platform-tools | Chọn platform-tools đúng release; đừng chỉ `rustup update` rồi cho là xong |
| `solana-*` type mismatch | `cargo tree -d`, manifest và lockfile | Đồng bộ cohort SDK; không thêm mọi crate với `latest` |
| CLI/crate/TS Anchor lệch phiên bản | `anchor --version`, manifest, `pnpm list` | Pin đúng 1.2.2; TS hiện là `@anchor-lang/core`, không mặc định tên package cũ |
| `Stack offset ... exceeded` | Log function, account struct lớn | Rà kích thước stack/constraint; cân nhắc `Box<Account<...>>` hay chia handler, không chỉ tăng heap |
| Node/Corepack lỗi chữ ký hoặc pnpm tự tải | `node --version`, `pnpm --version`, packageManager | Kiểm tra docs pnpm, pin package manager; sửa installer có phê duyệt, không tắt bảo vệ hệ thống |
| RPC `429`, airdrop fail | Cluster, address công khai, quota faucet | Chờ/backoff; dùng faucet chính thức hoặc local test; không lặp request dồn dập |

Nguồn hướng dẫn: [Anchor installation](https://www.anchor-lang.com/docs/installation), [Anza installation](https://docs.anza.xyz/cli/install), [Foundation common errors](https://github.com/solana-foundation/solana-dev-skill/blob/c9da2624cc6baca5c8c2123ea50d92ef19f1c917/skills/solana-dev/references/common-errors.md), [WSL setup](https://learn.microsoft.com/en-us/windows/wsl/install). Bảng chứa cả chẩn đoán do người viết tổng hợp, không phải lỗi đã gặp trên máy này.

## 4. Ví dụ hoặc quy trình tối thiểu

### A. Kế hoạch cài Rust → Agave → AVM, chưa thực hiện

**Chỉ tham khảo — chờ đồng ý trước khi chạy.** Mẫu cho macOS/Ubuntu WSL. Tải script, đọc nội dung rồi mới thực thi; không gộp cả bộ thành một installer khó kiểm tra.

```sh
# Chưa chạy. Sau khi đồng ý, tải và kiểm tra installer Rust.
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs -o /tmp/solana-study-rustup.sh
# Đọc /tmp/solana-study-rustup.sh trước bước sau.
sh /tmp/solana-study-rustup.sh --default-toolchain 1.100.0
. "$HOME/.cargo/env"
rustc --version
cargo --version

# Chưa chạy. Pin Agave theo Anchor release notes.
curl -sSfL https://release.anza.xyz/v4.1.2/install -o /tmp/solana-study-agave-install.sh
# Đọc script trước bước sau.
sh /tmp/solana-study-agave-install.sh
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
solana --version

# Chưa chạy. Cài AVM từ tag đã kiểm tra, giữ Cargo.lock upstream.
cargo install --git https://github.com/otter-sec/anchor --tag v1.2.2 --locked avm
avm install 1.2.2
avm use 1.2.2
avm --version
anchor --version
```

Không chạy `agave-install update` ngay sau pin vì có thể đổi version. `--locked` giúp giữ dependency resolution của tag, nhưng vẫn cần kiểm tra build thật trên host. Không tự đặt `NO_DNA=1` hoặc bypass prompt khi người dùng chưa cho phép.

Phần bổ sung cho máy khác, **cũng chưa chạy**:

```powershell
# Windows PowerShell quản trị: chỉ khi chọn dùng WSL2.
wsl --install -d Ubuntu-24.04
```

```sh
# Ubuntu/WSL: chỉ sau khi đồng ý cài dependency hệ thống.
sudo apt-get update
sudo apt-get install -y build-essential pkg-config libssl-dev libudev-dev clang cmake
```

Trên macOS, dùng Command Line Tools nếu thiếu. Với Node/pnpm, **máy hiện tại đã có nên không cần cài**. Máy mới có Homebrew có thể dùng `brew install node@24`, nạp PATH theo output Homebrew, rồi `npm install --global pnpm@10.28.0`; với WSL dùng phương thức cài Linux được [Node.js](https://nodejs.org/en/download) hỗ trợ, không chạy lệnh brew của macOS. Tất cả là phương án có điều kiện, không phải đã thực hiện.

### B. Ví devnet và airdrop

Phiên này **không tạo keypair**, kể cả keypair nháp. Trong phiên thực hành riêng, người dùng chọn ví thử có sẵn hoặc tự tạo ví devnet riêng, giữ seed phrase ngoài repo/chat. Không dùng ví tài sản thật cho bài học. Chỉ cần cung cấp **public address**, không gửi file JSON/private key.

CLI muốn ký cần một signer đã có được cấu hình đúng; ví browser không tự trở thành signer của CLI. Không hướng dẫn xuất private key của ví browser vào project. Program ID keypair và fee-payer keypair cũng không phải một khái niệm.

Các lệnh sau chỉ dành cho phiên thực hành được cho phép, với public address thật do người dùng thay:

```sh
DEVNET_STUDY_ADDRESS='THAY_BANG_PUBLIC_ADDRESS_DEVNET'
solana balance "$DEVNET_STUDY_ADDRESS" --url devnet
solana airdrop 2 "$DEVNET_STUDY_ADDRESS" --url devnet
solana balance "$DEVNET_STUDY_ADDRESS" --url devnet
```

`airdrop` là yêu cầu làm thay đổi số dư devnet, chưa được thực hiện. Chỉ định `--url devnet` ở từng lệnh giúp tránh lệ thuộc default cluster. [Faucet chính thức](https://faucet.solana.com/) là lựa chọn cho người dùng mở bằng tay; giao diện có quota và có thể cần GitHub để tăng hạn mức. Không bảo đảm luôn nhận được 2 SOL. Khi bị giới hạn, chờ hoặc dùng local test; không mua “devnet SOL”.

### C. Ghi lại bộ đã thực sự chạy

Sau phiên cài được chấp thuận, cập nhật bảng bằng output `rustc`, `cargo`, `solana`, `avm`, `anchor`, Node/pnpm và platform-tools thực dùng. Ghi cả OS/arch, lockfile và một kết quả build/test tối thiểu. Không đánh dấu bộ “compatible” chỉ vì tất cả lệnh `--version` đều thành công.

## 5. Tự kiểm tra

1. Rust host mới nhưng SBF báo compiler cũ: kiểm tra gì? **Platform-tools/compiler SBF**, không chỉ rustup.
2. `solana` CLI 4.1.2 có buộc mọi crate là `4.1.2`? **Không**, các dòng version độc lập; Anchor có cohort riêng.
3. Node trên máy có đủ yêu cầu manifest Anchor TS 1.2.2? **Có theo engines**, nhưng chưa chứng minh test client pass.
4. `anchor init` có phù hợp giới hạn “không tạo keypair” của phiên này? **Không chạy**, vì scaffold có thể sinh keypair/toolchain.
5. Ghi một phiếu cài đặt gồm version, nơi cài, thay đổi PATH và kiểm tra sau cài. **Đạt** khi chỉ rõ đâu là nguồn khuyến nghị và đâu cần chạy để xác nhận.

## 6. Nguồn và độ tin cậy

- Maintainer, tag 28/10/2026: [Anchor 1.2.2](https://www.anchor-lang.com/docs/updates/release-notes/1-2-2), [MSRV](https://github.com/otter-sec/anchor/blob/v1.2.2/lang/Cargo.toml), [Node engines](https://github.com/otter-sec/anchor/blob/v1.2.2/ts/packages/anchor/package.json).
- Chính thức: [Rust installation](https://rust-lang.org/tools/install/), [stable manifest](https://static.rust-lang.org/dist/channel-rust-stable.toml), [Anza install](https://docs.anza.xyz/cli/install), [Anchor AVM](https://www.anchor-lang.com/docs/references/avm).
- Chính thức: [pnpm 10 installation](https://pnpm.io/10.x/installation), [Node downloads](https://nodejs.org/en/download), [Microsoft WSL](https://learn.microsoft.com/en-us/windows/wsl/install), [Solana faucet](https://faucet.solana.com/).
- Foundation skill snapshot **c9da2624cc6baca5c8c2123ea50d92ef19f1c917**, 04/11/2026: [compatibility matrix](https://github.com/solana-foundation/solana-dev-skill/blob/c9da2624cc6baca5c8c2123ea50d92ef19f1c917/skills/solana-dev/references/compatibility-matrix.md). Có nội dung cũ hơn release hiện tại; đã ghi chỗ khác biệt, không coi mọi hàng là đã chạy tại máy người dùng.

Các trang sống truy cập 17/11/2026; thời điểm truy cập không phải ngày xuất bản. Không dùng tutorial trước 2025 làm hướng dẫn cài hiện tại.

## 7. Điểm chưa kiểm chứng và bước tiếp theo

Chưa kiểm chứng Rust host 1.100.0 + Agave 4.1.2 + Anchor 1.2.2 bằng build/test, chưa chạy Docker daemon, chưa biết Antigravity version hay ví devnet của người dùng. Không tự đổi config của Taskbar Hero để pin Solana.

Nếu người dùng muốn thực hành, trình lại danh sách cài ở mục 4A và xin đồng ý cho các tải phụ thuộc phát sinh. Tạo sandbox và ví là phạm vi riêng cần chốt; đọc [004](004-anchor-a-to-z.md) trước để biết những file build có thể sinh.
