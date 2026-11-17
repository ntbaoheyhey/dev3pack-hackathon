# Thẻ nhớ — Codex / Prompt 03
- Trạng thái **đang làm**; goal **active**, không token budget; checkpoint 17/11/2026, Asia/Ho_Chi_Minh.
- Đã tiếp tục goal: check-lab r2 exit0; đang commit/sync và kiểm CI, song song chuẩn bị client devnet.
- Codex trưởng nhóm; Antigravity trợ lý qua A-queue/A-done; không sửa A-done, không chờ A.
- Mục tiêu: hoàn tất Phase 1–2 và Phase 3 đã được phép; cập nhật PR work → main, không merge.
- Repo /Users/bao/Documents/ChatGPT/dev3pack, branch work; HEAD/origin-work local **a7b8af1**; còn nhiều file chưa commit.
- Người dùng chọn **ClusterProof C02 chính, NetPay Check C03 dự phòng**, đã cho phép toolchain/dependencies; không hỏi lại.
- IDEA/ARCHITECTURE v0.1 đã có nhưng chưa duyệt; Phase 1–3 chưa đạt đủ cổng ra.
- Rust1.100.0, Agave4.1.2, AVM/Anchor1.2.2, platform-tools v1.57 đã cài; mọi phiên cài đã kết thúc.
- Hello counter lab riêng: SBFv3 .so 127672 bytes, **6 runtime tests pass**, IDL build exit0; chưa deploy.
- check-lab r2 chạy trọn exit0 (fmt/SBF/IDL/6 tests/lock); CI đã viết, đang chuẩn bị push để chạy thật.
- Payer devnet lần đọc cuối 0 SOL; câu hỏi nhận 5 SOL đang pending. Chưa có transaction/deploy/web live/CI xanh.
- Automation dev3pack-nh-c-tr-ng-nh-m-m-i-15-ph-t: lần view trước ACTIVE mỗi15 phút đúng chat; chưa quan sát heartbeat; giữ nguyên.
- RUBRIC v1.2: weights20/15/10/20/15/15/5, floors3/3/2/3/3/3/2, tổng≥75; F≤3 chưa spike; giữ r0, tối đa r1–r3.
- C02/C03/C01 r1 **79/77/75**, ĐẠT PLAN theo C, chưa giáo viên duyệt; review-C A01/A02/A03 **42/40/37**.
- C sở hữu RUBRIC, ideas/codex, cross-scores, SHORTLIST, IDEA, ARCHITECTURE, A-queue; T6 V3 đã review, A ưu tiên T5→T8.
- Bước tới: commit lab/docs/logs, pull rebase 3 commit A, merge main/push; theo CI và làm client smoke devnet.
- Cấm mainnet/secrets/force-push/merge PR/sửa checkout A hoặc Taskbar Hero; cập nhật note/DEVLOG/Thẻ nhớ sau bước lớn.

## Còn lại

1. Commit/pull-rebase/merge-main/push lab + docs; theo CI tới kết quả thật. Đã kiểm IDL/hash và check-lab r2 exit0; npm session21555 terminal exit0, không poll lại. Client1.7.0 dùng Kit^5.0.0, hooks peer React>=18, Vite8.3.8 Node^20.19 hoặc>=22.12.
2. Notes003/004/007/022, mục lục, README/ROADMAP đã cập nhật kết quả local; bổ sung run CI/devnet/web khi có evidence. Giữ hello-build exit1 và hello-check-r1 lỗi Bash; check-r2 mới là full pipeline local exit0. Chưa deploy/CI/web pass.
3. Chuẩn bị client devnet smoke từ generated IDL/API đã kiểm; **tools/devnet-lab chưa tạo/cài**. Khi balance có thật, deploy/invoke và lưu program/account/status/log/signature xác nhận; signature đơn lẻ chưa đủ. Đọc câu trả lời funding đang pending trước khi hỏi lại.
4. Fetch/pull an toàn, dùng kết quả A-done/T5/T8 nếu có; giao bổ sung qua A-queue. Chốt web template/pins, build/browser/public hosting; không lấy việc chưa nhận kết quả A làm blocker. Chỉ xin tài khoản khi artifact đã review được.
5. Hoàn thiện IDEA/ARCHITECTURE và bản giải thích một trang; xử lý review/giáo viên chấm/người dùng duyệt đúng cổng. Chọn ý tưởng không đồng nghĩa duyệt tài liệu.
6. Viết lại PR#7 title/body theo lựa chọn, architecture và setup thực; kiểm head/checks/mergeability. Chỉ sau completion audit đạt toàn scope mới viết NEXT cuối, cập nhật ROADMAP/DEVLOG/HANDOFF, complete goal và hủy automation ở điểm dừng cuối. Không merge PR.

## Git và trạng thái chưa commit

- HEAD và origin/work local cùng **a7b8af13e38eda40f93da22da12c3c00010973f8** (chore(toolchain): record authorized installs and prepare hello lab); origin/main local **b9c91b0d0cb191e6f0aa348d0540ffa83985c908**. Lần sync trước up-to-date; lượt bàn giao chỉ đọc refs/status, không fetch/pull/commit/push.
- Commit trước: b897134 IDEA/ARCHITECTURE; a64638a DECISION/note022; 2b61cf9 T6 V3; 6731c5b C03 parser/evidence (đã lưu, không còn untracked như snapshot cũ).
- Chưa commit từ phần triển khai: docs/learning/004-anchor-a-to-z.md; Anchor.toml, Cargo.toml, Cargo.lock, rust-toolchain.toml, programs/phase3-hello/, scripts/check-lab.sh, .github/workflows/ci.yml; logs phase3 platform-tools-install.txt, hello-build.txt, hello-tests.txt, hello-idl.txt, devnet-airdrop.txt. Lượt bàn giao thêm HANDOFF/archive/DEVLOG/note009/STOP-CAUSES. Giữ toàn bộ thay đổi và logs.
- [PR#7](https://github.com/ntbaoheyhey/dev3pack-hackathon/pull/7): lần inspect gần nhất tại head a7b8af1 **open, draft=false, merged=false, mergeable=false**; chưa rõ conflict thật hay trạng thái đang tính lại. Không dùng giá trị true cũ. Body/title còn mô tả shortlist/chờ lựa chọn/chưa cài, cần cập nhật.
- Repo private, LICENSE MIT; chưa đổi visibility. Checkout A /Users/bao/Documents/dev3pack-hackathon không thuộc phạm vi sửa.
- Automation đúng ID **dev3pack-nh-c-tr-ng-nh-m-m-i-15-ph-t**, chat **01a1e9c8-1b24-7911-91a4-4897fc175566**; ID thiếu chữ m trước -i là sai. View/config trước xác nhận ACTIVE; không tạo trùng/hủy trong lượt bàn giao.

## Toolchain, lab và bằng chứng đã có

Máy macOS27.2 arm64, Node24.22.2. Chưa sửa shell profile; dùng task PATH/binary tuyệt đối. Logs trong docs/evidence/phase3/ và metadata versions-initial.json; lỗi Python tomllib đã xử lý bằng standard library.

| Thành phần | Trạng thái và đường dẫn |
| --- | --- |
| Host Rust | rustc/cargo **1.100.0**, rustup1.29.3, rustfmt/clippy; /Users/bao/.cargo/bin/ |
| Agave | solana-cli **4.1.2**; /Users/bao/.local/share/solana/install/active_release/bin/ |
| AVM / Anchor | **1.2.2**, cài có attestation; binary trực tiếp /Users/bao/.avm/bin/anchor-1.2.2 |
| Platform-tools | **v1.57**, log exit0; SBF rustc **1.95.0-dev (ae660768a 2026-08-17)** tại /Users/bao/.cache/solana/v1.57/platform-tools/rust/bin/rustc |

Host compiler khác SBF compiler. cargo-build-sbf đi cùng Agave báo4.1.0/defaultv1.54; build đã pin v1.57/v3. AVM reminder latestv1.58 không thay bộ được phép.

- Scaffold Anchor chính thức tại /tmp/dev3pack-phase3-20261117/phase3-hello, source revision **8d9d1488d9b8af41b266d7513eea2e668adf15a2**, single/LiteSVM/no-install/no-git/no-security-metadata. Source đọc thêm tại /Users/bao/.cargo/git/checkouts/anchor-0977bcaec406b76e/8d9d148/.
- Template single thực tế là **counter**: initialize/increment, PDA seed counter, authority, MAX_COUNT10, CPI chuyển1lamport ngoài rent; Counter48 bytes. Chỉ là hello lab Phase3; sản phẩm ClusterProof vẫn read-only, không custom program/PDA/signer.
- Host template1.89.0 đã đổi1.100.0. Lock template chứa anchor-lang1.2.0 đã nâng riêng lên1.2.2; pins LiteSVM0.15.0, message4.3.0, transaction4.1.5, signer3.0.1, keypair3.1.2.
- Program ID **2yzxUQEpaeLmgCMhDipwnVL3DHsxez18KcePonqZRiXL**, chưa deploy. Program keypair ngoài repo: /Users/bao/.local/share/dev3pack/devnet/phase3-hello-keypair.json; payer /Users/bao/.local/share/dev3pack/devnet/payer-keypair.json. Directory0700/files0600; target/deploy/phase3_hello-keypair.json symlink ra ngoài repo, target đã check-ignore. Không đọc/in secret.
- Payer public address **GQRoDMoWFV2nhgwm3bZGvSCC1LSa2wRkLeeJg8NhbFM2**. CLI xin2SOL thất bại, balance lần cuối0SOL. Faucet form5SOL không qua Cloudflare; CUA đã completion_summary, tab IAB1/browser2 tại faucet.solana.com đã handoff. Câu hỏi async nhờ nhận5SOL còn pending; không suy yêu cầu bàn giao là đã nạp.

| Evidence | Kết quả đã quan sát / giới hạn |
| --- | --- |
| target/deploy/phase3_hello.so | SBFv3 thật, **127672 bytes**; chưa đối chiếu/hash lại ở checkpoint này |
| [hello-tests.txt](evidence/phase3/hello-tests.txt) | cargo test --locked --workspace exit0, **6 runtime tests pass**: initialize/increment và5 test âm (authority sai, thiếu signer, init lại, vượtMAX_COUNT, discriminator sai); kiểm log lỗi và counter data/lamports/owner không đổi. Session35265 kết thúc |
| [hello-build.txt](evidence/phase3/hello-build.txt) | Giữ hai lỗi: một separator truyền --locked sai tới cargo-build-sbf; hai separator build được SBF nhưng truyền --locked vào IDL test executable. Log combined cuối **exit1**, không gọi toàn pipeline xanh |
| [hello-idl.txt](evidence/phase3/hello-idl.txt) | anchor idl build -p phase3_hello -o target/idl/phase3_hello.json -t target/types/phase3_hello.ts -- --locked **exit0**, session74680 kết thúc. Chưa đọc lại/hash IDL artifacts; source idl/src/build.rs giải thích cargo_args |
| scripts/check-lab.sh | fmt-check → build --no-idl … -- -- --locked → IDL -- --locked → runtime tests → kiểm Cargo.lock không đổi; --ci thêm ignore-keys. **Chưa chạy trọn** |
| .github/workflows/ci.yml | Ubuntu24.04; research Node24.22.2 offline, Anchor job pin toolchain/source, gọi script; upload chỉ .so/IDL/types. contents:read, không secrets/deploy/pull_request_target; checkout7.0.1/setup-node7.1.0/upload-artifact7.0.2 pin full SHA đã xác minh. **Chưa commit/push/run** |

Npm metadata session21555 đã terminal exit0; client1.7.0 dùng Kit^5.0.0, hooks1.4.1 peerReact>=18, Vite8.3.8 Node^20.19 hoặc>=22.12. Build/check session44811 đã terminal, log r2 exit0. Không có process sống cần poll ở checkpoint này. Registry trước xác nhận client1.7.0/hooks1.4.1/Vite8.3.8/React19.3.1/Kit8.6.0; **chưa chọn/cài web stack**. Template Vite official có ranges RC, Next template có mainnet fallback; không chạy nguyên trạng.

## Sản phẩm, Phase 1 và trợ lý

- [DECISION](ideas/DECISION.md) đã ghi lựa chọn/quyền cài. [IDEA](IDEA.md)/[ARCHITECTURE](ARCHITECTURE.md) v0.1: C02 devnet/loader-v3/read-only, MATCH/MISMATCH/UNKNOWN; ABI UNKNOWN/source NOT_RUN. Chưa được duyệt.
- [Note021](learning/021-payment-cluster-evidence.md)/[catalog](evidence/phase1/README.md): spikes-tests-r1-final.txt **16 pass,0 fail**, 5.940 inverse/744 brute-force cases, parser/epoch/slot/replay. Không rerun chỉ vì bàn giao. R/D4 PLAN không là audit/delivery; giữ evidence và giới hạn của RUBRIC.
- C02 cluster-1794924487174.json:747ms,slot523293811,ProgramData711053 bytes,5 mutations. Hash gồm padding, không verified build. C03 netpay-1794925658391.json:283ms,slot523298709,epoch1211,target10000→gross10102/fee102/net10000; mint HxDYFvcXnLuy4VdxXCooUXrch8DZW34oUteQ6N2EFxEr, writesToChain0. Chưa settlement/balance/permission. Discovery không đối số còn403; giữ artifact lỗi lịch sử.
- C01 F3 vì invoice program chưa chạy; C03 N3 vì overlap Ryntra/SDK. Không reset ID/vòng hoặc dùng điểm PLAN thay cổng duyệt.
- **T5 tại5d8f4a0/T8 tại782d1db đã fetch/đọc**, còn thiếu source/version template, chưa apps/web tracked; queue đã review và chốt React-Vite static. **T6 V3 đã đọc và review**, không còn pending đọc: đã sửa transfer fee, còn thiếu Kora affected2.2.0/patched fieldNone và giới hạn EVM/Shopify2019; vẫn khuyên clone mainnet. Queue đã ghi không áp dụng mainnet và ưu tiên **T5→T8**, rồi sửa T4/T6/T2. Lần fetch trước chưa có commit A mới sau2b61cf9; chưa quan sát T5/T8, fetch lại trước kết luận thiếu.

## Bị chặn và cổng duyệt

- **Funding devnet cần người dùng, chỉ chặn deploy/invoke**: pending yêu cầu nhận5SOL vào payer trên. Lượt bàn giao không poll/airdrop/RPC lại; còn việc độc lập nên chưa đánh goal blocked.
- Phase1 cần người dùng duyệt IDEA; Phase2 cần review, giáo viên chấm và người dùng đồng ý bản giải thích; Phase3 cần program ID + transaction devnet xác nhận, web công khai và CI xanh. Không tuyên bố đạt từ cài xong hoặc tests local.
- Giữ goal active/automation hiện có. [Prompt03](../prompts/03-codex-lead.md), [ROADMAP](ROADMAP.md), [A-queue](tasks/A-queue.md), [A-done](tasks/A-done.md). Snapshot cũ ở [archive](archive/HANDOFF-history-codex.md) chỉ là lịch sử.
