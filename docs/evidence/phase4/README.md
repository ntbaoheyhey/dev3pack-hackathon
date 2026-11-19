# Evidence Phase4 ReceiptRail local

19/11/2026 · Codex. Người dùng mở Phase4/5 local, nguyên văn ở [record](user-approval-2026-11-19.json); [Automation ACTIVE](automation-active-2026-11-19.json),15phút/đúng chat. Không suy quyền CI/deploy/public mới.

| Mốc | Bằng chứng | Kết quả / giới hạn |
| --- | --- | --- |
| Runtime r2, commit2a3fd30 | [Log](runtime-r2-2026-11-19.txt)/[metadata](runtime-r2-metadata.json) |32/32tests với real SBF,31tests hành vi+1exportABI; source/bytecode/ABI program không đổi. Offline/locked, phí/rollback/roles/readonly/u64/lifecycle |
| Runtime r1 | [Log29/32](runtime-r1-2026-11-19.txt) |3expectations tầng lỗi khác source/runtime, đã sửa tests theo evidence; không sửa program |
| IDL | [Log build](idl-build-2026-11-19.txt), [Rust ABI](runtime-abi-r2.json) | Anchor sinh local, cmp byte-identical. Vectors public; cancel export dùng fixture Open, không là proof reset |
| Client r1, commit4148906 | [Log](client-r1-2026-11-19.txt)/[metadata](client-r1-metadata.json) |23/23tests, TypeScript strict/generated check, Anchor coder/Kit/web3 đối chiếu. Browser-target Vite bundle + VM không Node globals; chưa browser/extension thật |
| Review C | [Ma trận](../../reviews/receiptrail-phase4-local.md) | Tự review với source/test cụ thể, không audit độc lập hoặc verdict giáo viên |
| Dự toán read-only | [Quote r2](devnet-rent-quote-r2-2026-11-19.json) | Đúng genesis, payer1.848125199SOL; peak dự phòng1.531889040SOL, đề xuất cap1.8SOL **chưa được đồng ý**. Chưa signer/sign/send |
| Quote r1 fail closed | [Record](devnet-rent-quote-2026-11-19.json) | C chép thiếu expected genesis; guard dừng ngay sau1read. R2 lấy expected từ record Phase3 đã kiểm, không đổi allowlist theo response |

[Contract UI](../../PHASE4-CLIENT.md) đã giao trong T34; chưa có bài nộp/xác nhận dùng được của A. CI Phase3 tại27cf7ac chỉ chứng minh bộ tests cũ, không áp cho executable inputs Phase4. Chưa ReceiptRail devnet, UI/RPC recovery hoặc ví thật, verified build, public website mới. [Phương án cổng](../../PHASE4-PLAN.md) trình riêng; không mergePR7 hoặc mở lại T31–T33.
