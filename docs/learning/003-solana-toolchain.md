# 003 — Toolchain Solana, phiên bản và cài đặt có kiểm soát

> Ngày kiểm tra: 2026-11-17 (Asia/Ho_Chi_Minh). Đính chính18/11: giữ bộ đã cài; cài thêm cần hỏi trước theo DECISION. Người dùng đã duyệt Phase2 ReceiptRail (DECISION, log09:27:18.464 ngày18/11 UTC+7); không suy quyền cài/deploy/public.
> Rust1.100.0, Agave4.1.2, AVM/Anchor1.2.2 và platform-tools v1.57 đã cài. Hello SBFv3 + IDL + 6 runtime tests đạt qua check-lab; chưa deploy, CI/web chưa được xác nhận.

## 1. Mục tiêu và điều cần nhớ

Biết vai trò từng công cụ, chọn một bộ phiên bản có căn cứ và chẩn đoán lỗi đúng lớp. **Rust trên máy, Rust đi kèm platform-tools, Agave CLI và Solana SDK crates không có cùng số phiên bản.** Cập nhật `rustup` không tự sửa compiler SBF cũ.

Đọc khoảng 20 phút sau [002](002-solana-basics.md). Ghi nhận quyền cài cũ sai/hết hiệu lực; xem [DECISION](../ideas/DECISION.md). Bộ đã cài được giữ nguyên theo câu mới; mọi cài thêm cần câu đồng ý mới trước khi thực hiện. Các ví dụ WSL/Docker/máy khác vẫn chỉ tham khảo; không tự nâng version hoặc thay cấu hình dự án khác.

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
| rustc / cargo / rustup | 1.100.0 / 1.100.0 / 1.29.3 | Install/version đạt; host tests đã chạy |
| solana / anchor / avm | 4.1.2 / 1.2.2 / 1.2.2 | Install/version đạt; hello SBFv3/IDL/LiteSVM đạt |
| SBF compiler | platform-tools v1.57, rustc 1.95.0-dev (ae660768a, 2026-08-17) | Install exit0, đã build .so; compiler độc lập host Rust |
| surfpool / solana-verify | Không thấy trong PATH | Chưa cài/chưa verify |

### Bảng tương thích có căn cứ

| Mục đích | Rust host | Solana CLI (Agave) | Anchor CLI/crates | Platform-tools / SBPF | Kết luận |
| --- | --- | --- | --- | --- | --- |
| Bài học mới | `anchor-lang` khai báo MSRV **1.89**; host đề xuất **1.100.0** để đánh giá trong phiên cài | **4.1.2** | **1.2.2**, giữ CLI/`anchor-lang`/`anchor-spl` đồng bộ | **v1.57 / v3** | Bộ Agave/Anchor/platform là khuyến nghị release 1.2.2; host 1.100.0 là đề xuất, **chưa build xác nhận cả bộ** |
| Đọc project 1.1.x cũ | MSRV 1.89 theo matrix Foundation | **3.1.10** được matrix ghi CI-tested | **1.1.2** nếu dự án đã pin | Matrix ghi v1.52+; phải theo lockfile/template riêng | Chỉ tham khảo cho dự án cũ; không dùng để hạ baseline mới |
| Anchor **2.0.0-rc.2** | Chưa kiểm chứng trong phiên này | Docs nhắc cohort Agave 4.3 | Release candidate | Chưa kiểm chứng | Không chọn làm mặc định học trước hackathon |

MSRV là mức Rust tối thiểu của một crate, **không bảo đảm toàn bộ dependency graph/CLI build được bằng đúng mức đó**. Bằng chứng chính: [release 1.2.2](https://www.anchor-lang.com/docs/updates/release-notes/1-2-2), [`lang/Cargo.toml` tại tag v1.2.2](https://github.com/otter-sec/anchor/blob/v1.2.2/lang/Cargo.toml), [matrix của Solana Foundation](https://github.com/solana-foundation/solana-dev-skill/blob/c9da2624cc6baca5c8c2123ea50d92ef19f1c917/skills/solana-dev/references/compatibility-matrix.md).

Rust **1.100.0** được xác minh bằng [stable manifest chính thức](https://static.rust-lang.org/dist/channel-rust-stable.toml): ngày manifest **12/11/2026**, chuỗi `1.100.0 (0ef1bc386 2026-11-09)`; nay `rustc --version` đã khớp. Output OS/arch/cargo/rustup/solana/AVM/Node tại [versions-initial.json](../evidence/phase3/versions-initial.json); logs cài cùng thư mục. Version pass chưa chứng minh cả bộ build tương thích.

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

### A. Kế hoạch gốc Rust → Agave → AVM và trạng thái thực

Các lệnh mẫu dưới được viết trước khi có quyền; lệnh thật/log Phase3 được lưu riêng. Đã tải/đọc installer, cài dưới user directories với `--no-modify-path`; chưa sửa shell profile. AVM install1.2.2 không dùng `--skip-attestation`. Dùng task PATH thay vì đổi PATH của dự án khác.

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

Lịch sử17/11: assistant đã suy Phase3 hello/devnet nằm trong scope; kết luận quyền này sai/hết hiệu lực theo DECISION18/11. Đã tạo payer/program keypair riêng tại `~/.local/share/dev3pack/devnet/` ngoài Git (directory0700/files0600); target tham chiếu program keypair qua symlink bị ignore. Không dùng ví tài sản thật hoặc xuất secret của ví browser. Chỉ lưu public address trong evidence; không in secret/seed vào log.

CLI muốn ký cần một signer đã có được cấu hình đúng; ví browser không tự trở thành signer của CLI. Không hướng dẫn xuất private key của ví browser vào project. Program ID keypair và fee-payer keypair cũng không phải một khái niệm.

Các lệnh sau chỉ dành cho phiên thực hành được cho phép, với public address thật do người dùng thay:

```sh
DEVNET_STUDY_ADDRESS='THAY_BANG_PUBLIC_ADDRESS_DEVNET'
solana balance "$DEVNET_STUDY_ADDRESS" --url devnet
solana airdrop 2 "$DEVNET_STUDY_ADDRESS" --url devnet
solana balance "$DEVNET_STUDY_ADDRESS" --url devnet
```

`airdrop` làm thay đổi số dư devnet. Lần xin2SOL đã thất bại, xem [log](../evidence/phase3/devnet-airdrop.txt); lần đọc balance sau đó0SOL. Câu hỏi nhờ người dùng nhận5SOL còn pending. Chỉ định `--url devnet` ở từng lệnh giúp tránh default cluster. [Faucet chính thức](https://faucet.solana.com/) có quota/Cloudflare; không bảo đảm nhận được SOL. Không mua “devnet SOL”.

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

Đã kiểm bộ Rust host1.100.0 + Agave4.1.2 + Anchor1.2.2 + platform-tools v1.57 bằng build/IDL/6 LiteSVM tests: [hello-check-r2](../evidence/phase3/hello-check-r2.txt), exit0. Chưa xác nhận deploy/CI, chưa chạy Docker daemon. Các bảng/lệnh kế hoạch gốc ở trên chỉ là lịch sử nghiên cứu, không thay log thực hành này.

Câu lịch sử “Tiếp tục theo quyền Phase3 đã có” sai/hết hiệu lực; không dùng làm quyền hiện hành. Giữ bộ đã cài, chỉ chuẩn bị local bằng cache và hỏi riêng trước cài thêm/keypair triển khai/deploy/public. Đọc [004](004-anchor-a-to-z.md), dùng scaffold chính thức Anchor1.2.2, template single + LiteSVM0.15.0 cho hello tối thiểu, không clone RPC mainnet. Giữ signer lab ngoài Git; nếu hosting/faucet cần tài khoản thì ghi nhu cầu thực sau khi hoàn tất phần độc lập.

### Bài học / lỗi đã gặp — Phase3

- Python máy không có `tomllib`; script metadata lỗi ngay import, không có output. Đã ghi metadata bằng standard library có sẵn, không thêm dependency cho việc này.
- AVM1.2.2 nhắc latest platform-tools v1.58 dù cohort được chọn là v1.57. Đây là reminder (source `avm/src/lib.rs` tại tagv1.2.2), không là yêu cầu nâng. Đã đọc help và gọi `cargo-build-sbf --tools-version v1.57 --install-only`.
- Agave solana-cli4.1.2 đi cùng cargo-build-sbf4.1.0/default v1.54; pin `--tools-version v1.57 --arch v3` cho build. Không suy số version của CLI chính là compiler SBF.
- Log AVM có warning dependency yoke-derive0.8.3 yanked nhưng install exit0. Giữ lockfile upstream và log, không tắt kiểm tra nguồn gốc.
- Bash3.2 trên macOS với `set -u` báo unbound variable khi expand array rỗng. Script dùng build_args luôn có phần tử; kiểm lockfile bằng checksum trước/sau nên vẫn phát hiện thay đổi trước lần commit đầu.
- Forward `--locked` cho build SBF và IDL khác nhau: build `--no-idl … -- -- --locked`, rồi `anchor idl build … -- --locked`. Giữ hello-build.txt exit1 lịch sử; hello-check-r2.txt mới chứng minh toàn quy trình exit0.

Bài học18/11: version/build logs chứng minh phần đã chạy, không chứng minh người dùng đã duyệt việc cài. Nguồn payload và đính chính ở DECISION; không tái dùng quyền cũ.
