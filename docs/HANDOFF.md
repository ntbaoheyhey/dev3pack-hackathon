# Thẻ nhớ — Codex / Prompt 03
- Trạng thái **đang làm**; goal **active**, không token budget; checkpoint 17/11/2026, Asia/Ho_Chi_Minh.
- Codex trưởng nhóm; Antigravity trợ lý qua A-queue/A-done; không sửa A-done/HANDOFF A, không chờ A, không tự spawn agent.
- Mục tiêu: hoàn tất Phase 1–2 và Phase 3 đã được phép; cập nhật PR work → main, không merge.
- Repo /Users/bao/Documents/ChatGPT/dev3pack, branch work; commit web **f7a1a43234a104e87345fe3f2539c0a5737abc66** đã push; xem git log -1 cho HEAD tài liệu mới hơn.
- Người dùng chọn **ClusterProof C02 chính, NetPay Check C03 dự phòng**, cho phép toolchain/dependencies; không hỏi lại.
- IDEA + ARCHITECTURE **v0.3** đã có bản cụ thể trong PR; câu hỏi duyệt IDEA/giải thích kiến trúc đã gửi, pending; giáo viên chưa có verdict được xác nhận.
- Toolchain đúng bộ đã cài; hello check-lab r2 exit0: SBFv3/IDL/**6 runtime tests**; client **8 tests**/audit0.
- Web đã public tại URL trong mục Bằng chứng; **8 tests**, clean npm ci/audit0, peer graph sạch, typecheck/build r4 exit0.
- Core web chỉ metadata confirmed; product design paired ProgramData finalized chưa triển khai. /lab không sign/send, fixture đã kiểm, ví extension thật chưa kiểm.
- Devnet inspect slot**523329001**: payer0 lamports, PROGRAM_NOT_DEPLOYED,transactions=[]; funding5SOL pending.
- CI commit web f7a1a43: run**44127842904**, web/research/anchor-lab đều bị Billing & plans chặn trước job; billing pending.
- README/IDEA/ARCHITECTURE/ROADMAP/note022/mục lục/evidence đã đồng bộ; PR#7 đã thêm web live/tests/giới hạn/cổng mở.
- Đã giao **T9** browser/mobile/ví thật và **T10** review kiến trúc; dùng baseline đã push, không tạo Next/Site song song.
- Automation dev3pack-nh-c-tr-ng-nh-m-m-i-15-ph-t vẫn ACTIVE15phút đúng chat/prompt; đã view/config-read, chưa quan sát heartbeat.
- RUBRIC v1.2: weights20/15/10/20/15/15/5, floors3/3/2/3/3/3/2, tổng≥75; không gate fail/pending trọng yếu; F≤3 chưa spike.
- C02/C03/C01 r1 PLAN **79/77/75**; review-C A01/A02/A03 **42/40/37**; giữ r0, tối đa r1–r3.
- Bước tới: kiểm phản hồi người dùng/cổng review và funding/billing; fetch trước dùng A-done; xem Còn lại, không chạy lại việc đã xong.
- Cấm mainnet/fork-mainnet/secrets/force-push/merge PR/sửa checkout A hoặc Taskbar Hero; không gọi NEXT final hoặc phase xong khi thiếu cổng.

## Còn lại

1. Đọc câu trả lời duyệt IDEA/ARCHITECTURE đã gửi và verdict giáo viên nếu có; ghi vào DECISION/tài liệu đúng phạm vi được duyệt, không coi lựa chọn C02 hoặc quyền cài là duyệt mọi tài liệu. Xem [hồ sơ review/cổng](reviews/phase1-3-gates.md). Funding/billing đã hỏi từ trước, không hỏi lại chỉ vì compact.
2. Fetch origin, đọc A-done/remote trước kết luận thiếu kết quả T9/T10; dùng findings thật và tự sửa phần C, không chờ A. Nếu không có kết quả mới thì không dựng lại UI/hosting hoặc mở phase sau để né cổng.
3. Funding có thật: kiểm đúng genesis/balance/rent/authority; tạo buffer signer riêng ngoài Git rồi deploy devnet program đúng ID; chạy inspect/smoke và lưu transaction/log/state xác nhận. Không resend mù hoặc xóa journal. Chỉ nhận lời “đã nạp” chưa đủ, cần inspect thực.
4. Billing được xử lý: kiểm/rerun CI đúng head mới, theo tới terminal và sửa lỗi thực. Ba jobs chưa từng khởi chạy ở snapshot cuối; không bỏ job để tạo xanh, local pass không thay CI.
5. Cập nhật review/PR/HANDOFF theo tiến triển. Chỉ khi mọi requirement trong hồ sơ review và Prompt03 đạt mới viết NEXT cuối, ROADMAP/HANDOFF xong, goal complete và hủy automation; không merge PR.

## Bằng chứng và Git

- **[Web công khai](https://clusterproof-devnet-17nov26.anthony-robinson-125.chatgpt.site)** và **[/lab/](https://clusterproof-devnet-17nov26.anthony-robinson-125.chatgpt.site/lab/)**. [web.md](evidence/phase3/web.md) chứa tests/build/browser/limitations và nguồn template; [source match](evidence/phase3/web-source-match.json) xác nhận code/config/tests trùng source Sites, chỉ README local bổ sung nghĩa SDK warmup.
- Commit web **f7a1a43234a104e87345fe3f2539c0a5737abc66** đã push; trước là7d27640, client8f30b60, labcc8ab9c. Origin/main đã bao gồm b9c91b0d0cb191e6f0aa348d0540ffa83985c908; A nhận đến d4fec17. Không dùng SHA trước rebase ce6e0d5/35613b3. Dùng git status/log để kiểm HEAD tài liệu, không suy trạng thái từ checkpoint cũ.
- [PR#7](https://github.com/ntbaoheyhey/dev3pack-hackathon/pull/7) đã cập nhật title “feat: ClusterProof spec, hello lab và web devnet công khai”, body có link live/tests/gates. Update trả headf7a1a43, stateopen; chưa merge. Repo vẫn private/MIT; public-source gate trước nộp còn mở.
- **Hosting đã terminal succeeded**, không poll/tạo lại: project appgprj_6afc7bde680481919ba3e40a9d098155; source **f5223afb86ec0a8208715eec312e636b19da30ff**; version1/deployment appgdep_6afc7e25272081918ac0aeda0eee730b. Exact version ID/hash/paths trong [web-hosting.json](evidence/phase3/web-hosting.json).
- Checkout Sites **/Users/bao/Documents/ChatGPT/dev3pack/sandbox/sites/clusterproof-phase3**, identity .openai/hosting.json; cần credential mới thì lấy cho cùng project, chỉ memory/stdin. Skill đã đọc/announce: **/Users/bao/.codex/plugins/cache/openai-curated-remote/sites/1.1.6/skills/sites/SKILL.md**. CUA đã markDeliverable/completion_summary; nếu dùng tiếp, đọc lại documentation theo công cụ.
- Toolchain macOSarm64: Rust1.100.0 ở /Users/bao/.cargo/bin; Agave4.1.2 ở /Users/bao/.local/share/solana/install/active_release/bin; Anchor1.2.2 ở /Users/bao/.avm/bin/anchor-1.2.2; platform-tools v1.57 ở /Users/bao/.cache/solana/v1.57. Không sửa shell profile/không nâng v1.58.
- [hello-check-r2](evidence/phase3/hello-check-r2.txt) exit0:fmt/SBFv3/IDL/6 runtime tests/lock; [build metadata](evidence/phase3/build-metadata.json) có source/hashes. [Client tests](evidence/phase3/client-tests-r3.txt)8pass, core1.2.2/web3.js1.99.0, overrides toml5.0.1+jayson5.0.0/audit0. Chưa deploy/send.
- [Web tests](evidence/phase3/web-tests-r3.txt)8pass; [build r4](evidence/phase3/web-build-r4.txt)exit0; TypeScript5.9.3 sau peer conflict TS7; giữ logs fail riêng. Public read slot523326604; mobile390×844/desktop1280 đã kiểm. Không rerun code tests vì chỉ sửa docs khi runtime source không đổi.
- Research giữ16tests,5.940 inverse/744 brute-force; [note021](learning/021-payment-cluster-evidence.md)/[catalog](evidence/phase1/README.md) có sources/read-only evidence/giới hạn. PLAN không là audit/delivery.
- Dev server session**65878** đã revalidate live rồi dừng Ctrl-C, **exit130**; không còn handle cần poll đã biết. Sites workflow45815/exec cellg21:194 cũng terminal. Log local có SDK warmup Failed to fetch và fixture rejection; đã ghi rõ trong web.md, không suy thành production error hoặc toàn bộ RPC pass.

## Cần người dùng và trạng thái goal

- **Funding devnet:** [inspect cuối](evidence/phase3/devnet-inspect-1794932899367.json) đúng genesis/slot523329001,payer0SOL,program chưa deploy,transactions=[]; exit2 có chủ ý. Payer **GQRoDMoWFV2nhgwm3bZGvSCC1LSa2wRkLeeJg8NhbFM2**; program **2yzxUQEpaeLmgCMhDipwnVL3DHsxez18KcePonqZRiXL**; counter PDA **WPFLETxvxk2hq48C7YzC1VJVVZcEhzqF2tur6vBDvnB**.
- Signers ngoài Git tại **/Users/bao/.local/share/dev3pack/devnet/**: payer-keypair.json và phase3-hello-keypair.json, directory0700/files0600. Không đọc/in secret. Buffer signer chưa tạo; dùng file riêng ngoài Git khi deploy để tránh recovery phrase của random buffer xuất log.
- **GitHub Billing & plans:** [run44127842904](https://github.com/ntbaoheyhey/dev3pack-hackathon/actions/runs/44127842904), commitf7a1a43; [diagnostics](evidence/phase3/ci-blocked-f7a1a43.json) có annotation cả3jobs chưa khởi chạy vì account payments/spending limit. Cần người dùng xử lý; không phải assertion code fail.
- **Duyệt:** câu hỏi async mới cho IDEA và bản giải thích ARCHITECTURE v0.3 đã accepted, chưa có trả lời lúc checkpoint. Giáo viên cần chấm SHORTLIST/kiến trúc; A review T9/T10 không thay verdict giáo viên/người dùng.
- Lượt này có tiến bộ thực: commit/push web, cập nhật PR/docs/evidence/queue và kiểm blockers. Goal vẫn active; chưa đủ điều kiện blocked audit3lượt liên tiếp. Không tự complete/paused/hủy automation khi chỉ gặp các cổng trên. Automation giữ đúng chat **01a1e9c8-1b24-7911-91a4-4897fc175566**; snapshot trước ở [archive](archive/HANDOFF-history-codex.md).
