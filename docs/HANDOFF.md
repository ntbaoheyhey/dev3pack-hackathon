# Thẻ nhớ — Codex / Prompt 03
- Trạng thái **đang làm**; goal **active**, không token budget; bàn giao 17/11/2026, Asia/Ho_Chi_Minh.
- Lượt này chỉ lưu bàn giao theo yêu cầu; lượt tiếp tục thực thi bắt đầu từ Còn lại, không làm lại phần đã xong.
- Codex trưởng nhóm; Antigravity trợ lý qua A-queue/A-done; không sửa A-done/HANDOFF A, không chờ A, không tự spawn agent.
- Mục tiêu: hoàn tất Phase 1–2 và Phase 3 đã được phép; cập nhật PR work → main, không merge.
- Repo /Users/bao/Documents/ChatGPT/dev3pack, branch work; HEAD/origin-work local **8f30b60** đã push; package web còn untracked.
- Người dùng chọn **ClusterProof C02 chính, NetPay Check C03 dự phòng**, cho phép toolchain/dependencies; không hỏi lại.
- IDEA đã có; ARCHITECTURE **v0.2** để review; chưa duyệt tài liệu, Phase 1–3 chưa đạt đủ cổng ra.
- Rust1.100.0, Agave4.1.2, AVM/Anchor1.2.2, platform-tools v1.57 đã cài; không còn installer/process cần poll đã biết.
- Hello lab: check-lab r2 exit0 (fmt/SBFv3/generated IDL/**6 runtime tests**/lock); client devnet **8 tests** đạt, audit0.
- Devnet inspect cuối: payer0 lamports, PROGRAM_NOT_DEPLOYED, transactions=[]; câu hỏi nhận5SOL còn pending.
- CI bị GitHub Billing & plans chặn trước job ở cc8ab9c; câu hỏi xử lý billing pending; chưa có CI xanh ở head mới.
- Web: chốt React/Vite static, đã cài package/lock nhưng chưa review peer warnings/build/browser; chưa Site hay URL công khai.
- Automation dev3pack-nh-c-tr-ng-nh-m-m-i-15-ph-t: vừa view/config-read, ACTIVE mỗi15 phút đúng chat; chưa quan sát heartbeat.
- RUBRIC v1.2: weights20/15/10/20/15/15/5, floors3/3/2/3/3/3/2, tổng≥75; không gate fail/pending trọng yếu; F≤3 chưa spike.
- C02/C03/C01 r1 **79/77/75**, ĐẠT PLAN theo C; A01/A02/A03 review-C **42/40/37**; giữ r0, tối đa r1–r3.
- C sở hữu RUBRIC/ideas-C/SHORTLIST/IDEA/ARCHITECTURE/A-queue; C dựng baseline web, A tiếp tục browser/UX theo queue.
- Bước tới: giữ thay đổi local, sync an toàn, review peer graph/API và hoàn thiện Vite + wallet lab; chưa cần funding cho web.
- Cấm mainnet/fork-mainnet/secrets/force-push/merge PR/sửa checkout A hoặc Taskbar Hero; cập nhật note/DEVLOG/Thẻ nhớ sau bước lớn.

## Còn lại

1. Lượt tiếp tục: đọc Thẻ nhớ/luật/ROADMAP/A-done; inspect worktree, fetch trước khi kết luận thiếu kết quả A. Giữ package web và tài liệu bàn giao chưa commit, commit theo đường dẫn khi phù hợp rồi pull --rebase origin work, merge origin/main/push đã được phép. Conflict tài liệu chung giữ cả hai phía. Không cài lại toolchain/client hoặc poll session đã terminal.
2. Review peer graph web và API thực trong package bằng rg --files (tránh zsh glob không khớp). Hoàn thiện Vite entry/config/tsconfig/CSS, tích hợp Dashboard A và trạng thái trung thực; core không cần ví, /lab connect/disconnect thật, không giả transaction. Test phù hợp, typecheck/build/browser/mobile, lưu evidence; dùng review A qua queue, không chờ A.
3. Sau build, đọc lại Sites skill khi cần và dùng workflow static hosting: checkout xuất bản riêng chỉ chứa source web đã sanitized; tạo đúng một Site, persist project_id ngay, credential chỉ memory/stdin; package/push source đúng SHA rồi save/deploy. Không gửi toàn repo/keypair. Chưa có Site/credential/manifest/URL để tái sử dụng.
4. Khi funding có thật: tạo buffer signer riêng ngoài repo, kiểm genesis/balance/rent/authority, deploy đúng program devnet rồi inspect/smoke. Lưu status/log/account/state delta/transaction xác nhận, không chỉ signature; không xóa journal hoặc resend mù. Đọc câu trả lời pending trước khi hỏi lại.
5. Khi billing được xử lý: inspect/rerun CI đúng head mới, theo tới kết quả và sửa lỗi thật. Local macOS pass chưa chứng minh workflow Linux chạy. Cập nhật notes003/004/007/009/022, mục lục/README/ROADMAP bằng evidence thực; ROADMAP còn v0.1 và mục lục022 còn mô tả cũ cần đồng bộ.
6. Hoàn thiện bản cụ thể IDEA/ARCHITECTURE + giải thích một trang, xử lý review/giáo viên chấm/người dùng duyệt đúng cổng. Cập nhật PR#7 theo web/CI/devnet thực, kiểm head/checks/mergeability. Chỉ sau completion audit đủ toàn scope mới NEXT cuối, HANDOFF xong, goal complete và hủy automation; không merge PR.

## Git, PR và phối hợp

- HEAD/origin-work local **8f30b60352a267ba9539c852b1a474aff8fe45fa**, client đã push; lab trước **cc8ab9c51cf195ae1f46373238e055a9a688e76d**; đã pull A đến **d4fec17**. Không dùng SHA trước rebase ce6e0d5/35613b3. Origin/main local **b9c91b0d0cb191e6f0aa348d0540ffa83985c908**. Lượt bàn giao chỉ kiểm refs/status local, không fetch/pull/commit/push.
- Trước bàn giao chỉ untracked **apps/web/package.json** và **apps/web/package-lock.json**; dependencies đã cài. Lượt này sửa HANDOFF/archive/note009/DEVLOG, chưa commit. Giữ các thay đổi khi sync.
- [PR#7](https://github.com/ntbaoheyhey/dev3pack-hackathon/pull/7): title “feat: ClusterProof spec và hello lab Phase 3 có kiểm thử”, body đã cập nhật lựa chọn/lab/gates. Lần inspect tại cc8ab9c: open, draft=false, merged=false, **mergeable=true**; chưa inspect metadata sau push8f30b60. Repo vẫn private/MIT; chưa đổi visibility.
- Automation **dev3pack-nh-c-tr-ng-nh-m-m-i-15-ph-t**, chat **01a1e9c8-1b24-7911-91a4-4897fc175566**: lượt này view thành công, file cấu hình ACTIVE/15phút/đúng prompt; không thay đổi/tạo trùng/hủy, chưa quan sát heartbeat.
- A T5 tại5d8f4a0, T8 ghi chú và Dashboard14 dòng tại **apps/web/app/page.tsx** (d4fec17) đã nhận. Dashboard nói đang tải dù chưa RPC; cần sửa khi tích hợp. Evidence A còn Next.js/chưa build. Queue/DEVLOG đã giao C dựng Vite, A kiểm no-wallet/reject/retry/connected/disconnected/mobile; không dựng Next song song. T6V3 đã review, phần sửa nguồn còn trong queue.

## Bằng chứng đã có — không chạy lại chỉ vì bàn giao

- Máy macOS27.2 arm64, Node24.22.2; không sửa shell profile. Rust/cargo1.100.0 và rustup1.29.3 tại **/Users/bao/.cargo/bin/**; Agave4.1.2 tại **/Users/bao/.local/share/solana/install/active_release/bin/**; Anchor trực tiếp **/Users/bao/.avm/bin/anchor-1.2.2**, AVM1.2.2; SBF rustc1.95.0-dev ở **/Users/bao/.cache/solana/v1.57/platform-tools/rust/bin/rustc**. Không nâng theo reminder v1.58.
- Anchor scaffold/source revision **8d9d1488d9b8af41b266d7513eea2e668adf15a2**, source tại **/Users/bao/.cargo/git/checkouts/anchor-0977bcaec406b76e/8d9d148/**. Hello counter: initialize/increment, seed counter, authority, MAX_COUNT10, size48 bytes, CPI1lamport ngoài rent; lab riêng, core ClusterProof không custom program/PDA/signer.
- [hello-check-r2.txt](evidence/phase3/hello-check-r2.txt): scripts/check-lab.sh trọn **exit0**, fmt→SBFv3→generated IDL→6 runtime tests→Cargo.lock không đổi. Sửa Bash3.2 array rỗng bằng build_args có phần tử và checksum lockfile; build --no-idl … -- -- --locked, IDL riêng -- --locked, CI thêm --ignore-keys. .so127672 bytes; IDL/address/instructions/layout và hashes đã kiểm, [build-metadata.json](evidence/phase3/build-metadata.json) lưu toolchain/source/hash.
- Runtime: initialize/increment + sai authority, thiếu signer, init lại, vượtMAX_COUNT, discriminator instruction sai. Test âm kiểm đúng lỗi và counter data/lamports/owner không đổi; chưa là audit toàn S01–S12. Giữ [hello-build.txt](evidence/phase3/hello-build.txt) exit1 và [hello-check-r1.txt](evidence/phase3/hello-check-r1.txt) lỗi Bash; không sửa lịch sử thành xanh.
- **tools/devnet-lab/** đã commit: client.mjs/smoke.mjs/client.test.mjs/README/package/lock; core1.2.2 + web3.js1.99.0 dùng generated IDL. [client-tests-r3.txt](evidence/phase3/client-tests-r3.txt) **8 pass**, clean npm ci/test pass. Inspect mặc định chỉ đọc, không đọc signer; kiểm genesis/executable/loader/binary/padding/upgrade authority/counter owner-layout-authority-count.
- Smoke có --send kiểm payer0600/balance/rent, initialize nếu cần và increment1; journal signature ghi **trước broadcast**, giữ khi chưa xác nhận, không resend mù; kiểm transaction/log/state delta. **Chưa deploy/send.** Bộ override cuối toml5.0.1 + jayson5.0.0, audit0; bộ stream-json3.9/uuid11 trên Jayson4 đã bỏ do ESM subpath. Đã kiểm Jayson5 HTTP browser-client API/full import/TOML parse/tests/RPC; TCP/TLS delimiter đổi ngoài đường lab.
- [devnet-inspect-1794930590109.json](evidence/phase3/devnet-inspect-1794930590109.json): đúng genesis devnet, slot **523319341**, payer **0 lamports**, **PROGRAM_NOT_DEPLOYED**, transactions=[], exit2 có chủ ý. Đây là snapshot cuối, không phải polling mới trong lượt bàn giao.
- Nghiên cứu Phase1 giữ nguyên **16 tests pass**, 5.940 inverse/744 brute-force cases. C02 live747ms; C03 live283ms, target10000→gross10102/fee102/net10000, writesToChain0. Chưa settlement/balance/permission; R/D4 PLAN không là audit/delivery; giữ lỗi discovery403 lịch sử. Chi tiết [note021](learning/021-payment-cluster-evidence.md), [catalog](evidence/phase1/README.md).

## Web và hosting đang dở

- [ARCHITECTURE v0.2](ARCHITECTURE.md): React/Vite static, core devnet/loader-v3/read-only; MATCH/MISMATCH/UNKNOWN, ABI UNKNOWN/source NOT_RUN; wallet chỉ /lab. Template **solana-foundation/templates@9ec8eba94a98e22434356b6858defbb0e5ada8dc**, kit/react-vite; đã đọc package/main/providers/App/vite config/LICENSE, giữ MIT attribution. Provider createClient(devnet, autoDiscover), SolanaProvider/useWalletConnection; ranges RC của template không phải pins hiện hành.
- Package đã tạo/cài: React/react-dom19.3.1, client1.7.0, react-hooks1.4.1; Vite8.3.8, plugin-react6.3.0, TypeScript7.0.2, typesReact/react-dom19.3.0. Client/hooks dùng Kit5, không trộn Kit8. Install233 packages/audit0 nhưng **ERESOLVE peer warnings chưa review**. Chưa Vite entry/tsconfig/CSS/tests/build/browser.
- Đã đọc/announce Sites skill và references/preview/local.md ở phiên triển khai trước; **chưa create Site/project_id/credential/manifest/deployment, chưa mở preview/server/browser**. Skill: **/Users/bao/.codex/plugins/cache/openai-curated-remote/sites/1.1.6/skills/sites/SKILL.md**; helpers **/Users/bao/.codex/plugins/cache/openai-curated-remote/sites/1.1.6/scripts/**. Dự kiến checkout xuất bản riêng, sanitized, không để helper đụng repo chính.
- Các session install/fetch/query cuối **57789/95456/67355** đã terminal; check/build44811 và npm21555 cũng terminal. Không có process sống/port preview đã biết; lượt này không mở thêm. Web tool web__run trước trả route_not_found; connector **mcp__codex_apps__search_service_web_run** dùng được. GitHub connector hoạt động, ưu tiên structuredContent.

## Bị chặn và cổng duyệt

- **Funding chỉ chặn deploy/invoke**: yêu cầu nhận5SOL còn pending, không hỏi lại ngay. Program **2yzxUQEpaeLmgCMhDipwnVL3DHsxez18KcePonqZRiXL**, payer **GQRoDMoWFV2nhgwm3bZGvSCC1LSa2wRkLeeJg8NhbFM2**, counter PDA **WPFLETxvxk2hq48C7YzC1VJVVZcEhzqF2tur6vBDvnB**. Airdrop2SOL thử lại thất bại trong [devnet-airdrop-retry.txt](evidence/phase3/devnet-airdrop-retry.txt).
- Signer ngoài Git tại **/Users/bao/.local/share/dev3pack/devnet/payer-keypair.json** và **phase3-hello-keypair.json**, directory0700/files0600; target keypair là symlink bị ignore. **Buffer signer chưa tạo**; dùng file riêng ngoài repo khi deploy để tránh CLI in recovery phrase của buffer ngẫu nhiên lúc lỗi. Không đọc/in secret.
- **CI cần người dùng xử lý Billing & plans/spending limit**: [run44117454541](https://github.com/ntbaoheyhey/dev3pack-hackathon/actions/runs/44117454541), headcc8ab9c, check anchor134159317045/research134159316479; job bị chặn trước khi chạy, không phải assertion code fail. [ci-blocked.json](evidence/phase3/ci-blocked.json) lưu annotation. Câu hỏi async đã accepted, chưa trả lời; workflow nay thêm npm ci/client tests nhưng chưa có CI xanh ở head8f30b60.
- Phase1 cần duyệt [IDEA](IDEA.md); Phase2 cần review/giáo viên chấm/người dùng đồng ý bản giải thích; Phase3 cần **program + transaction devnet xác nhận, web công khai, CI xanh**. Chọn C02/C03 và quyền cài trong [DECISION](ideas/DECISION.md) không thay các cổng này.
- Còn việc web độc lập nên goal vẫn active, chưa ở impasse đủ ba lượt để đánh blocked. Không hủy automation khi chỉ bàn giao. [Prompt03](../prompts/03-codex-lead.md), [ROADMAP](ROADMAP.md), [A-queue](tasks/A-queue.md), [A-done](tasks/A-done.md); snapshot cũ ở [archive](archive/HANDOFF-history-codex.md) chỉ là lịch sử.
