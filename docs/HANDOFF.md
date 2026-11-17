# Thẻ nhớ — Codex / Prompt 03
- Trạng thái **đang làm**; goal active, không token budget; checkpoint 17/11/2026, Asia/Ho_Chi_Minh.
- Đã tiếp tục goal sau lượt bàn giao; đang làm setup Phase3, không đổi goal thành paused/complete.
- Codex trưởng nhóm; Antigravity trợ lý qua A-queue/A-done; không sửa A-done, không chờ A.
- Mục tiêu: hoàn tất Phase 1–2 và Phase 3 đã được phép; cập nhật PR work → main, không merge.
- Repo `/Users/bao/Documents/ChatGPT/dev3pack`, branch `work`; HEAD đã push **b897134**.
- Người dùng chốt **C02 ClusterProof chính, C03 NetPay Check dự phòng**; DECISION đã ghi, không hỏi lại.
- Đã cho phép Rust1.100.0, Agave4.1.2, AVM/Anchor1.2.2, platform-tools v1.57 và dependencies cần build.
- Phase1 còn cổng duyệt IDEA; Phase2 ARCHITECTURE v0.1 chưa duyệt; Phase3 đang setup, chưa đạt cổng ra.
- Rust/Agave/AVM/Anchor đều có log **exit_code=0**, version pass; phiên cài cũ đã kết thúc.
- Platform-tools v1.57 đang cài session58870; Anchor defaults build v1.57/v3. Chưa hello build/test/devnet hoặc CI/web live.
- Automation `dev3pack-nh-c-tr-ng-nh-m-m-i-15-ph-t`: lần view trước ACTIVE đúng chat mỗi15 phút; chưa quan sát heartbeat.
- RUBRIC v1.2: weights20/15/10/20/15/15/5, floors3/3/2/3/3/3/2, tổng≥75; F≤3 nếu chưa spike; không U→đạt/reset vòng.
- C02/C03/C01 r1 **79/77/75**, ĐẠT PLAN theo C, chưa giáo viên chấm; review-C A01/A02/A03 **42/40/37**.
- C sở hữu RUBRIC, ideas/codex, cross-scores, SHORTLIST, IDEA, ARCHITECTURE, A-queue; A nhận T8 apps/web.
- Tiếp theo: poll58870; scaffold hello chính thức single/LiteSVM0.15 tại tmp, keypair ngoài Git; build/test và devnet.
- Cấm mainnet/secrets/force-push/merge PR/sửa checkout A hoặc Taskbar Hero; cập nhật note/DEVLOG/Thẻ nhớ sau bước lớn.

## Còn lại

- [x] Ghi versions-initial.json, cập nhật note003/mục lục; AVM/Anchor1.2.2 version pass, đã đọc help/source.
- [ ] Hoàn tất platform-tools v1.57 (session58870) rồi build/test. Không cài lại Rust/Agave/AVM/Anchor theo snapshot cũ.
- [ ] Scaffold hello từ CLI/template chính thức đã kiểm; giữ keypair ngoài Git; build/test thật, deploy devnet và kiểm program ID + transaction success, CI thật. Chưa có bằng chứng hoàn tất các bước này.
- [ ] Fetch/pull an toàn trước khi kết luận thiếu kết quả A; đọc T6 V3 đã nhận tại2b61cf9, tìm T5/T8 mới, dùng kết quả và giao tiếp qua queue.
- [ ] Hoàn thiện IDEA/ARCHITECTURE (Next/Vite chưa chốt), bản giải thích một trang, review/cổng duyệt. Chọn C02 không đồng nghĩa duyệt mọi chi tiết.
- [ ] Cập nhật PR#7 theo DECISION, architecture và setup thực; body cũ vẫn nói chờ lựa chọn/note022 đặt chỗ. Đọc lại metadata/head/checks trước báo.
- [ ] Chỉ khi cổng Phase2 và Phase3 thật đạt: NEXT/ROADMAP/DEVLOG/HANDOFF/PR, completion audit; không complete goal chỉ vì shortlist/cài toolchain.

## Git và điều phối

- HEAD và origin/work local: `b897134fbec81f32e58e160522b985f08ef6205e`; origin/main local: `b9c91b0d0cb191e6f0aa348d0540ffa83985c908`. Lượt bàn giao không fetch/pull/commit/push.
- Gần nhất: b897134 IDEA/ARCHITECTURE/setup; a64638a DECISION/note022; 2b61cf9 T6 V3 của A. 6731c5b đã lưu C03 parser/evidence; 1aa322a r1/SHORTLIST/đặt chỗ022. SHA trước rebase c5ce35e/22b60db không phải HEAD hiện tại.
- [PR#7](https://github.com/ntbaoheyhey/dev3pack-hackathon/pull/7): open, draft=false, merged=false, mergeable=true ở lần inspect **trước** push b897134; chưa kiểm lại từ đó. Repo private, MIT; chưa đổi visibility.
- Chưa commit: `docs/evidence/phase3/agave-install.txt`, `avm-install.txt`; lượt này sửa HANDOFF/DEVLOG và lưu snapshot cũ vào archive. Rust log đã commit. Giữ tất cả logs.
- Automation đã view ở lượt trước với thread `01a1e9c8-1b24-7911-91a4-4897fc175566`; không tạo trùng/hủy khi bàn giao. Không suy lịch ACTIVE là đã quan sát tin nhắn chạy thật.

## Toolchain: đã quan sát và chưa làm

Máy macOS27.2 arm64, Node24.22.2, Xcode CLT tại `/Library/Developer/CommandLineTools`; lượt setup kiểm còn213.9GiB. Cài với `--no-modify-path`, chưa sửa shell profile; dùng binary tuyệt đối hoặc task PATH.

| Thành phần | Kết quả thực | Log / bước còn lại |
| --- | --- | --- |
| Rust | rustc1.100.0 (0ef1bc386,2026-11-09), cargo1.100.0 (3acc79c0c,2026-11-05), rustup1.29.3; minimal + rustfmt/clippy; session51182 exit0 | [rust-install](evidence/phase3/rust-install.txt); binary tại `/Users/bao/.cargo/bin/` |
| Agave | Installer4.1.2 exit0; đã kiểm solana-cli4.1.2 (src182084b8,featc763ae0a) ở lượt setup; session91211 đã xong | [agave-install](evidence/phase3/agave-install.txt); `/Users/bao/.local/share/solana/install/active_release/bin/solana` |
| AVM | Lượt bàn giao poll session50517: Installed avm1.2.2, log exit_code=0; source otter-sec/anchor tagv1.2.2 rev8d9d1488, --locked | [avm-install](evidence/phase3/avm-install.txt); `/Users/bao/.cargo/bin/avm`; chưa --version/help. Warning yoke-derive0.8.3 yanked không làm install fail |
| Anchor/platform-tools | Chưa cài/chọn Anchor1.2.2 hoặc xác nhận platform-tools v1.57; chưa scaffold/build/test | Đọc help/source phù hợp trước lệnh; giữ bộ đã được cho phép |

Không còn process cài đang chạy được biết sau khi đọc log AVM exit0. Lượt bàn giao chỉ đọc output tiến trình có sẵn; không bắt đầu cài mới.

Script metadata lượt setup lỗi ngay `import tomllib` với `ModuleNotFoundError`; chưa tạo `docs/evidence/phase3/versions-initial.json`, chưa cập nhật note003/HANDOFF theo script đó. **Note003 và dòng mục lục “chưa cài/chờ đồng ý” đã lỗi thời**; quyền đã có và trạng thái thực ở bảng trên. Khi tiếp tục dùng parser sẵn có/đọc chọn lọc, không cần thêm dependency chỉ để ghi metadata. Installer/manifest ở `/tmp/dev3pack-toolchain-20261117/`; manifest Rust ngày2026-11-12.

Chưa tạo signer/keypair, ký, broadcast, deploy hoặc scaffold program trong phần đã quan sát. Hello Phase3 là lab riêng; product core C02 read-only, không custom program/PDA/signer. Signer devnet riêng giữ ngoài Git; nếu thiếu tài khoản/quyền thực sự thì ghi đúng blocker.

## Sản phẩm, evidence và trợ lý

- [DECISION](ideas/DECISION.md) đã ghi lựa chọn/quyền cài. [IDEA](IDEA.md)/[ARCHITECTURE](ARCHITECTURE.md) v0.1: C02 loader-v3/devnet/read-only; manifest diff MATCH/MISMATCH/UNKNOWN, ABI UNKNOWN/source NOT_RUN. Chưa duyệt chi tiết; chưa có generated IDL hay web URL được xác nhận.
- [Note021](learning/021-payment-cluster-evidence.md)/[catalog](evidence/phase1/README.md): `spikes-tests-r1-final.txt` **16 pass,0 fail**, 5.940 inverse cases/744 brute-force cases, parser negatives/epoch/slot/replay. Lệnh đã chạy: `node --test research/phase1/spikes.test.mjs research/phase1/fee-mint.test.mjs research/phase1/replay-evidence.test.mjs`; không rerun ở lượt bàn giao.
- C02 `cluster-1794924487174.json`:747ms,slot523293811,ProgramData711053 bytes,5 manifest mutations. Baseline OBSERVED_ONLY, ABI UNKNOWN/source NOT_RUN; payload hash gồm padding, không phải verified-build hash.
- C03 `netpay-1794925658391.json`/`netpay-fee-only-r1-final.txt`:283ms,slot523298709,epoch1211; target10000→gross10102/fee102/net10000 raw units; mint `HxDYFvcXnLuy4VdxXCooUXrch8DZW34oUteQ6N2EFxEr`,decimals6,100bps,cap1000000000000. Năm script hashes khớp,writesToChain0; chưa balance/permission/settlement.
- Discovery không đối số còn403; chỉ explicit mint khi có lý do kiểm lại. Snapshot `netpay-1794925600812.json` lỗi report ghi đè address đã sửa bằng mintConfig/replay test; giữ artifact lỗi. Ryntra có fee/net/hook/policy/receipt; Foundation Pay có x402/MPP/retry/debugger; không claim novelty từ tính năng chưa tìm thấy.
- A01 giữ vấn đề nghiên cứu sau, A02/A03 bỏ vòng hiện tại. Điểm lịch sử đã sửa, không reset vòng. C01 r1 sát ngưỡng75; N4→3 sẽ còn73; F3 vì invoice program chưa chạy.
- T6 **V3 đã pull tại2b61cf9 nhưng C chưa đọc nội dung**. T4 tại89f62b5 thiếu URL, nhầm token transfer fee với ComputeBudget/CU, khuyên mainnet ngoài scope; đã trả queue, không dùng chấm. T2 cần thay Renaissance bằng bộ Frontier/Cypherpunk/Breakout/Radar.
- T5 đã nhắc làm ngay; T8 giao A apps/web, web hello/devnet wallet lab, pin/build/browser/live link nếu có hosting; chưa quan sát output T5/T8, phải fetch trước kết luận thiếu.
- [Note022](learning/022-phase2-3-independent-prep.md) đã viết sau đặt chỗ1aa322a: contract/account/PDA/harness/CI/phiếu cài. Next template official Kit^8.5.0/Next16.4.3/React19.2.8/Node≥24; Surfpool1.7.0 test có mainnet remote fallback, không chạy nguyên trạng. Core C02 không cần wallet/plugin transaction; template/license/SHA ở note022.

## Bị chặn và cổng duyệt

Chưa có blocker cần người dùng cho bước setup kế tiếp; không hỏi lại hai quyết định đã trả lời. IDEA cần người dùng duyệt; Phase2 cần review/giáo viên chấm/bản giải thích một trang được đồng ý; Phase3 cần program ID+transaction thật, web live và CI xanh. Chưa đánh dấu cổng nào đạt chỉ từ lựa chọn hay cài xong AVM.

Goal đã tiếp tục sau bàn giao. Metadata tomllib đã xử lý bằng standard library, note003/mục lục đã cập nhật. T6 V3 đã đọc/ghi review trong queue; T5/T8 ưu tiên, sau fetch chưa có commit mới. Các bảng chi tiết checkpoint trước bên trên giữ lịch sử; phiên cài hiện hành duy nhất là58870. Lịch sử ở [archive](archive/HANDOFF-history-codex.md); không đọc snapshot cũ thành hiện trạng.
