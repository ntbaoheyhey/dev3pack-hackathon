# Evidence Phase4 ReceiptRail — local, CI và P4-B

19/11/2026 · Codex. Người dùng mở Phase4/5 local, nguyên văn ở [record](user-approval-2026-11-19.json); [Automation ACTIVE](automation-active-2026-11-19.json),15phút/đúng chat. P4-A/P4-B được đồng ý tại [record riêng](user-permission-p4ab-2026-11-19.json); không suy quyền public/upgrade/Phase6.

| Mốc | Bằng chứng | Kết quả / giới hạn |
| --- | --- | --- |
| Runtime r2, commit2a3fd30 | [Log](runtime-r2-2026-11-19.txt)/[metadata](runtime-r2-metadata.json) |32/32tests với real SBF,31tests hành vi+1exportABI; source/bytecode/ABI program không đổi. Offline/locked, phí/rollback/roles/readonly/u64/lifecycle |
| Runtime r1 | [Log29/32](runtime-r1-2026-11-19.txt) |3expectations tầng lỗi khác source/runtime, đã sửa tests theo evidence; không sửa program |
| IDL | [Log build](idl-build-2026-11-19.txt), [Rust ABI](runtime-abi-r2.json) | Anchor sinh local, cmp byte-identical. Vectors public; cancel export dùng fixture Open, không là proof reset |
| Client r1, commit4148906 | [Log](client-r1-2026-11-19.txt)/[metadata](client-r1-metadata.json) |23/23tests, TypeScript strict/generated check, Anchor coder/Kit/web3 đối chiếu. Browser-target Vite bundle + VM không Node globals; chưa browser/extension thật |
| Review C | [Ma trận](../../reviews/receiptrail-phase4-local.md) | Tự review với source/test cụ thể, không audit độc lập hoặc verdict giáo viên |
| Dự toán read-only | [Quote r2](devnet-rent-quote-r2-2026-11-19.json) | Đúng genesis, payer1.848125199SOL; peak dự phòng1.531889040SOL, cap1.8SOL tại mốc quote còn là đề xuất, sau đó được đồng ý bằng record riêng. Chưa signer/sign/send |
| Quote r1 fail closed | [Record](devnet-rent-quote-2026-11-19.json) | C chép thiếu expected genesis; guard dừng ngay sau1read. R2 lấy expected từ record Phase3 đã kiểm, không đổi allowlist theo response |

[Contract UI](../../PHASE4-CLIENT.md) đã được A dùng tại4d2e48a, C nhận phần import/parse/inspect; chưa nhận toàn UI, T35 đang sửa theo review. CI Phase3 tại27cf7ac chỉ chứng minh bộ tests cũ. CI triển khai6d08e5c đạt, deployment finalized; smoke còn đúng1Cancel sauRPC429. Recovery mới cần CI riêng; ví thật, verified build và public website mới chưa kiểm. [Phương án đã duyệt](../../PHASE4-PLAN.md); không mergePR7 hoặc mở lại T31–T33.

## Identity triển khai sau CI đầu
- [CI đầu](ci-initial.json) và [log Anchor](ci-initial-anchor.log): push44475988734 đạt tại8df85c0 trước tạo keys; PR44475994937 cũng đạt.
- [Public identity](deployment-identity.json): đúng4keys đã tạo ngoài Git sau CI đầu; [local metadata](deployment-local-metadata.json).
- [Runtime](runtime-deployment-identity.log)32, [client/guards](client-deployment-identity.log)23/7 đạt; [IDL r2](idl-deployment-identity-r2.log) sinh bằng cache. [IDL fail](idl-deployment-identity.log) thiếu PATH được giữ nguyên.
- Fixture hiện hành ở [docs/fixtures](../../fixtures/receiptrail-abi.json); runtime-abi-r2 cũ giữ nguyên lịch sử.

## CI revision triển khai và preflight

- [Manifest](ci-deployment.json), [push log](ci-deployment-push.log): push44477944228 tại6d08e5c đạt đủ3jobs;32runtime ReceiptRail,6runtime hello (5+1),23client ReceiptRail,7guards,8client hello,8web,16research. Generated IDL/TypeScript/build đạt.
- [PR log](ci-deployment-pr-cancelled.log): run44477949631 cancelled trong prerequisite; không là CI xanh. Gate P4-B dựa exact-source push run, không phải merge verdict.
-33input hashes khớp Git blob6d08e5c/worktree tại thời điểm deploy. Runner hiện đã đổi cho recovery, không gán CI cũ cho helper mới. Artifact local đã runtime-test hash495e47… khác LinuxCI26db68…; chưa verified/reproducible source build.
- [Inspect trước upload](inspection-before-upload.json): đúng genesis, balance1.848125199SOL, peak1.531889040SOL<cap1.8. Upload bắt đầu15:58UTC+7; kết quả finalized và phần còn thiếu xem bên dưới.

## Deploy và smoke hiện hành

- [Upload](upload.json):156tx finalized gồm create-buffer+155writes, byte-identical, phí785000lamports.
- [Deploy CLI](deploy-cli.json)/[đối soát deployment](deployment-finalized.json):157tx finalized, executable/ProgramData/authority/bytecode đúng, buffer consumed; debit753656080lamports=accounts752861080+fees795000. Không deploy lại.
- [Smoke partial bất biến](smoke-r1-partial.json):4tx finalized fund/create/pay/create; principal1000000lamports chuyển đúng một lần. Duplicate chỉ simulation6004/no-transfer. RPC429 xảy ra trước ký/gửi Cancel; chưa có Cancel journal. [Smoke hiện hành](smoke.json) chưa đủ để đóngP4-B.
- [Recovery inspect](cancel-recovery-inspection.json):16:20UTC+7 đối chiếu live4tx/history/account/Paid+Open/terms, balance1087434119lamports; Cancel dự kiến chỉ thêm10000fee.
- [Local tests recovery](cancel-recovery-local.log):23client+7guards+7recovery, generated/typecheck/syntax đạt. Helper e9a1603 đang CI riêng: push44495583542/PR44495594074; chưa ký Cancel. Không tái dùng manifest6d08e5c để chứng minh helper mới.
