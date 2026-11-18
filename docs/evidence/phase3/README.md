# Phase 3 — kết quả P3-A và P3-B

Codex · 22:31:59 ngày18/11/2026 UTC+7. **P3-B hello đã kiểm finalized và trong trần1.5SOL devnet.** Phase4 chưa mở; đây không phải ReceiptRail đã triển khai hoặc verdict giáo viên.

[Program hello trên Explorer](https://explorer.solana.com/address/2yzxUQEpaeLmgCMhDipwnVL3DHsxez18KcePonqZRiXL?cluster=devnet) · [Đối soát cuối](hello-devnet-final-verification-r2-2026-11-18.json) · [Quyền và phạm vi](../../PHASE3-PLAN.md).

- [deploy finalized](https://explorer.solana.com/tx/4bsAQ4JYw52KTv1EjcWZ4mJJNzr4KRTqnznDQEP5d95SBNcADMRrersNNADscEpFJgVNqP6vZNxbc28qV7UgHUDq?cluster=devnet)
- [initialize finalized](https://explorer.solana.com/tx/5yrSMhEwi7ycY5VMwjRXWLXe1AUwUcNd1cxE4Ykm2k8RFKsRgjXEH8zms7gtRw9RHskUFXaZQBrLcXj6YZcSBgPD?cluster=devnet)
- [increment finalized](https://explorer.solana.com/tx/3GePXNnLf9GAX8yevBKhFpGwZfhaZFV7fC9AkTs2K5PjYGJ1kr4BxuxFfZkfoBpLicuvNu8PLryEYGPPHSybvouY?cluster=devnet)

Đã kiểm137giao dịch của toàn P3-B: finalized, meta.err=null, fee payer đúng, top-level instructions chỉ gọi loader/system/compute-budget/hello, priority fee0; lịch sử payer từ mốc bắt đầu khớp danh sách, không có giao dịch ngoài dự kiến. Tổng debit từng transaction khớp chênh lệch số dư và tổng SOL giữ trong accounts cộng fees. Counter chưa tồn tại trước smoke; initialize có log thành công, increment có log count1; account finalized cuối có count1/authority đúng. Không có capture account finalized ở count0 giữa hai instructions.

| Khoản | Lamports | SOL devnet |
| --- | ---: | ---: |
| Payer ban đầu | 2500000000 | 2.500000000 |
| Payer còn lại | 1848125199 | 1.848125199 |
| Program account | 833120 | 0.000833120 |
| ProgramData | 649452600 | 0.649452600 |
| Counter, gồm1lamport chuyển trong initialize | 894081 | 0.000894081 |
| Tổng SOL giữ trong accounts | 651179801 | 0.651179801 |
| Tổng phí137giao dịch | 695000 | 0.000695000 |
| **Tổng giảm số dư payer** | **651874801** | **0.651874801** |
| Còn dưới trần1.5SOL | 848125199 | 0.848125199 |

Giảm số dư bao gồm SOL nằm trong accounts, không phải toàn bộ bị đốt làm phí. Buffer duy nhất đã được loader tiêu thụ trong deploy; không gửi lệnh close riêng. Upgrade authority vẫn là payer thử `GQRoDMoWFV2nhgwm3bZGvSCC1LSa2wRkLeeJg8NhbFM2`. ProgramData `BJQzgSHrumuS7K9QFqpCTanzqm2whAEje51hwLavFJ32`; deployed payload khớp byte-for-byte artifact macOS127672bytes/hash `9b5483f7335a294b125ba458bcbcbdc9e222b605a2c67d7fabc76c132a23da54`. Đây là kiểm binary, chưa là reproducible/verified source build; hashes Linux khác macOS.

## Bằng chứng và lịch sử

| Record | Phạm vi |
| --- | --- |
| [Preflight](hello-devnet-preflight-2026-11-18.json) | Baseline2.5SOL, genesis/signers/modes/binary/cap |
| [R4 CLI](hello-devnet-deploy-r4-2026-11-18.json), [deploy finalized](hello-devnet-deploy-finalized-2026-11-18.json) | Exit0 rồi kiểm transaction/ProgramData/authority/bytecode |
| [Paced upload r2](hello-buffer-paced-upload-r2-2026-11-18.json) | 102writes còn thiếu, finalized payload; các lỗi/parser/r2/r3 trước được giữ riêng |
| [Smoke](devnet-smoke-1795015356860.json) | Hai transaction confirmed, before null/after1; finalized được kiểm riêng ở record cuối |
| [Đối soát đầu bị429](hello-devnet-final-verification-2026-11-18.json), [r2 hoàn tất](hello-devnet-final-verification-r2-2026-11-18.json) | Giữ10metadata đã kiểm; resume đọc phần còn lại với pacing3.5s/backoff, không gửi lại |
| [Source verify](hello-devnet-verify-deploy-source.txt), [finalize r1](hello-devnet-finalize-source.txt), [r2](hello-devnet-finalize-r2-source.txt) | Snapshot byte-identical của helpers read-only; không chạy lại smoke/upload/deploy |
| [CI27cf7ac](ci-passed-27cf7ac.json), [read-back sáu jobs](ci-rechecked-2026-11-18.json) | Hai runs đạt3jobs/57tests mỗi run+typecheck/build/IDL; checkpoint tài liệu không tự là revision CI |
| [HTTP web/lab](existing-web-http-2026-11-18.json) | Hai route cũ200 lúc22:09:50 UTC+7, không publish/update hoặc kiểm ví thật |

P3-A là runner GitHub với pins/locks đã duyệt. Local25runtime+8client và Linux57tests/run đã có log; executable inputs vẫn khớp27cf7ac trong lượt chốt, không rerun CI cho tài liệu. Không cài thêm local, deploy ReceiptRail, đổi authority, tạo thêm keypair hoặc public web mới.

T31/T32/T33 đã đóng sau lượt cuối7857e9b; phần thiếu là [nợ tài liệu D01–D03](../../DOCUMENTATION-DEBT.md), không queue sửa mới. Ví extension connect/disconnect vẫn chưa kiểm theo lựa chọn người dùng; CLI smoke không thay bài kiểm này. Giáo viên chưa có verdict. [NEXT](../../NEXT.md) là phần trình duyệt Phase4; không suy quyền mới từ P3-B.
