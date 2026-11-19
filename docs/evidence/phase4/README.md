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

[Contract UI](../../PHASE4-CLIENT.md) đã được A dùng tại4d2e48a, C nhận phần import/parse/inspect; T34/T35/T36đãđóng, UIlocal266b30c đạt45tests/build+7repro; browser sau sửa chưa kiểm. CI Phase3 tại27cf7ac chỉ chứng minh bộ tests cũ. CI triển khai6d08e5c đạt, deployment finalized; smoke5tx đã đạt, tổng162tx finalized. Recovery đã có CI riêng; ví thật, verified build và public website mới chưa kiểm. [Phương án đã duyệt](../../PHASE4-PLAN.md); không mergePR7 hoặc mở lại T31–T33.

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

## Deploy và smoke hiện hành — đã hoàn tất

- [Final verification](final-verification.json)/[log](final-verification.log): **162tx finalized**, executable/ProgramData/authority/bytecode đúng, buffer consumed; Paid/Cancelled đúng terms, không transaction ngoài dự kiến. Debit **0.760701080SOL** = accounts0.759861080 + fees0.000840000; cap1.8SOL, payer còn1.087424119SOL.
- [Upload](upload.json)156tx và [deploy](deployment-finalized.json)157tx là checkpoints lịch sử bất biến. Binary local495e47… khác LinuxCI; không tuyên bố verified source build.
- [Smoke đầy đủ](smoke.json): fund/create/pay/create/cancel đều finalized; principal0.001SOL chuyển đúng một lần. Duplicate chỉ simulation6004/no-transfer, không broadcast. CU create1=10275/pay=6608/create2=8775/cancel=4346.
- [Partial bất biến](smoke-r1-partial.json) giữ lỗiRPC429 trước Cancel. [Recovery](cancel-recovery.json)/[send log](cancel-recovery-send.log): đúng1Cancel, fee10000lamports, Paid bytes và actors/rents không đổi. Journal đã reconcile; không gửi lại.
- [Manifest36inputs](ci-smoke-recovery.json), [push log](ci-smoke-recovery-push.log), [PR log](ci-smoke-recovery-pr.log):44495583542/44495594074 đều3jobs success tại e9a1603; program/IDL/client/binary giữ nguyên. Gate lưu trước ký Cancel.
- [Recovery local tests](cancel-recovery-local.log):23client+7guards+7recovery/generated/typecheck/syntax đạt. CI web ởe9a1603 là17tests; T35/21tests ở69e458a có evidence local riêng.

Cổng kỹ thuật Phase4 có bằng chứng program/devnet/CI/client/A acceptance; giáo viên chưa verdict. C đã review phần logic ví/giao dịch Phase5 theo [r3](../../reviews/receiptrail-phase5-r3.md); browser/demo sau sửa còn chưa kiểm; public/ví thật/Phase6 chưa được suy từ kết quả CLI này.
