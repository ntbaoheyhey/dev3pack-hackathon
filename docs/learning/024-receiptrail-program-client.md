# 024 — ReceiptRail Phase4: program, kiểm thử và client từ IDL

- **Ngày**: 19/11/2026, Asia/Ho_Chi_Minh
- **Agent**: Codex; trước sự kiện
- Đặt chỗ tại `05f8e79`; note này viết **trước code Phase4**. Chưa có kết quả test mới tại mốc viết.

## Tóm tắt 3 dòng

Một Invoice PDA chỉ chuyển principal một lần; rollback không hoàn phí transaction.
Client phải encode/decode từ IDL, kiểm owner/size/seed/version và giữ số u64 bằng bigint; mock UI không chứng minh giao dịch thật.
Lượt này chỉ local bằng cache đã có; giữ wire contract v0.1 và hỏi riêng trước cài/deploy/public.

## Khái niệm chính

- Đọc source `Account::try_from` Anchor1.2.2: owner trước deserialize, discriminator/type không thay seeds/authority. Source program hiện dùng `Signer`, `SystemAccount`, `Program<System>`, init canonical bump, `has_one`, Clock.slot. Không có close/update/reset. [Source pinned](https://github.com/otter-sec/anchor/blob/v1.2.2/lang/src/accounts/account.rs); fetched19/11, hashes ở [record](../evidence/phase4/primary-sources-2026-11-19.json).
- Runtime19tests từ Phase2 đã có nền; cần bổ sung độc lập: phí lúc fail, readonly/account substitution ở create/cancel, input u64 lớn, nhiều invoice/merchant, `[create,pay,pay]` rollback và trạng thái bất biến. Không đổi logic chỉ để có diff khi chưa tìm ra lỗi thật.
- LiteSVM0.15.0/source cache: send_transaction xác minh signature mặc định; `expire_blockhash` phân biệt transaction mới. `Keypair::new_from_array` từ solana-keypair3.1.2 dùng fixture công khai trong memory, không tạo signer triển khai. Không xuất secret. Runtime trả metadata.fee/CU để đối soát fee payer riêng.
- @solana/addresses4.0.0 có codec address và `getProgramDerivedAddress({programAddress,seeds})`; source pinned kiểm hash/curve và canonical bump. Dùng adapter injected từ thư viện sẵn có, không tự viết crypto. [Source v4.0.0](https://github.com/anza-xyz/kit/blob/v4.0.0/packages/addresses/src/program-derived-address.ts), fetched19/11; typings cache đã đọc. Kit transitive của @solana/client là5.5.1, không trộn các type nominal vào API chung.
- Codama/renderer hiện **không có trong node_modules hai app hiện hành**; không cài trong quyền local. Học pipeline từ note004; dùng generator local đọc toàn bộ ABI ReceiptRail từ IDL hiện có, sinh wrappers/types/metadata và runtime codec dependency-free. Đây là client sinh từ IDL cho toàn contract hiện tại, không gọi là Codama hoặc generator mọi Anchor IDL. Gặp type/seed không hỗ trợ thì fail, không bỏ qua. Nếu sau này cần Codama, trình package/version riêng.
- Client chỉ xây instruction/đọc account với adapter, không network/sign/broadcast. Address/curve dùng thư viện đã có qua injection; test với web3.js1.99.0 và @solana/addresses4.0.0. API trả data Uint8Array, account metas, bigint; browser không phụ thuộc Buffer/Node.
- Đọc invoice cần owner/program allowlist, exact131bytes/discriminator, version1, canonical PDA+bump, terms/state invariants. State Paid khác commitment; contextSlot không đồng nghĩa paid_slot. Slot chưa biết thì không tự kết luận Expired. Error custom chỉ map khi programId đúng.
- Amount SOL parse bằng số nguyên, <=9 chữ số lẻ, không exponent/âm/NaN/JS Number hoặc vượt u64. Không làm tròn tiền. Terms và invoiceID không thay đổi khi timeout.

## Cách làm — kế hoạch trước code

1. Mở rộng runtime harness và chạy `bash scripts/check-receiptrail.sh` offline/locked, lưu đầy đủ failure/pass logs; giữ format/source/lock hashes.
2. Tạo fixture ABI **từ Rust + bytecode thật**: bytes instructions/accounts/metas/PDA/fields/events; fixture chỉ chứa public bytes, đối chiếu client thay vì chỉ round-trip chính implementation.
3. Sinh lại Anchor IDL local bằng CLI/cache đã kiểm ở note023 (không wrapper build/test sinh keypair), cmp với contract; thay ABI phải báo A cùng commit.
4. Generator `scripts/generate-receiptrail-client.mjs` -> `packages/receiptrail-client/generated.*`, ghi IDL hash và check mode deterministic. Runtime local -> `index.mjs` + types. Không package install hoặc sửa lock để tránh lỗi.
5. Client tests đối chiếu vector Rust/Anchor coder, toàn u64/amount boundaries, malformed account/address/owner/PDA/version/status, signer/writable metas và code+program. Test adapter addresses thật; không tắt crypto check.
6. Giao API tại `docs/PHASE4-CLIENT.md`; A dùng mock trong T34 trước, nối client khi artifact đạt. C review source và hành vi tiền/quyền mới của UI, không mở lại T31–T33.

## Bài học / lỗi đã gặp

| Bẫy | Xử lý |
| --- | --- |
| Web tool trả route_not_found | Đọc trực tiếp source chính thức qua HTTPS và source/typing đúng version đã cache; lưu hash, không nói docs trả404 |
| Snapshot principal không gồm fee payer | Mở rộng assertions với fee riêng; failed instruction có thể đã tính fee, không gọi rollback là hoàn phí |
| Hai bộ Kit/Anchor types khác nhau | API bytes/string/bigint thuần; adapter kiểm bằng hai thư viện, tránh dependency mới |
| Codegen bỏ qua field/seed mới | Validate schema và fail closed; check generated file so IDL hash, cross-language fixtures |

## Nguồn

- [Anchor1.2.2 Account source](https://github.com/otter-sec/anchor/blob/v1.2.2/lang/src/accounts/account.rs), [IDL](https://www.anchor-lang.com/docs/basics/idl); note004/007/023 đã đọc.
- [Kit4.0.0 PDA](https://github.com/anza-xyz/kit/blob/v4.0.0/packages/addresses/src/program-derived-address.ts), source/typings4.0.0 đã đối chiếu.
- [LiteSVM0.15.0](https://docs.rs/litesvm/0.15.0/litesvm/), [Keypair3.1.2](https://docs.rs/solana-keypair/3.1.2/solana_keypair/struct.Keypair.html); source cache đã đọc.
- [Codama](https://github.com/codama-idl/codama); học pipeline note004, chưa cài/chạy Codama.

## Giới hạn

Chưa có test/code mới ở mốc note. Local VM/codec không chứng minh devnet/RPC/extension wallet/verified build; codegen không thay deployment identity. Phase4/5 đã mở local, cổng CI/devnet/public/giáo viên vẫn riêng. Không cài thêm, deploy, public hoặc mergePR7.

### Client r1 đạt — 19/11/2026

[Contract bàn giao](../PHASE4-CLIENT.md), [log](../evidence/phase4/client-r1-2026-11-19.txt):23/23tests, TypeScript strict và generated check exit0.3instructions/1account/3events/9errors sinh từ IDL; đối chiếu bytes/metas/events/accounts với Rust/real SBF và Anchor coder, PDA với Kit4.0.0/web3.js1.99.0. Bundle Vite8.3.8 chạy trong VM không Node globals/network, chưa browser extension. Client giữ u64 bigint, canonical PDA, owner/size/version/state, terms snapshot trước await, vai/hạn và error namespace. Không cài Codama/dependency, không đổi program hoặc IDL.

Bài học: harness đầu trỏ root thừa `../` làm module not found; sửa path tới cache hiện có, không cài package để che lỗi. Ca wrong-address dùng payer trùng role bị chặn ALIASED_ROLES trước PDA; đổi fixture sang địa chỉ độc lập để thực sự test PDA, giữ ca alias riêng. Không nới decoder hoặc sửa program để ép khớp kỳ vọng. Paid ở slot0 hợp lệ; hủy Open hết hạn hợp lệ. TypeScript không tự chứng minh JS implementation đúng, nên giữ cross-language byte tests và runtime negative tests.

### Runtime r1 — test expectation và thứ tự Anchor

32 tests chạy,29 đạt/3 fail vì tên lỗi kỳ vọng khác source/runtime: init CPI chạy trước constraints còn lại của merchant, readonly create bị runtime PrivilegeEscalation, discriminator thiếu byte rơi vào InstructionFallbackNotFound. Các ca reject vẫn chặn thực thi; sửa expectation theo đúng tầng lỗi, giữ assertions principal/account và phí, không đổi program để làm khớp test. Giữ log r1 nguyên vẹn và kiểm lại các ca đã fail.

### Runtime r2 đạt — 19/11/2026

[Log](../evidence/phase4/runtime-r2-2026-11-19.txt)/[metadata](../evidence/phase4/runtime-r2-metadata.json):32/32runtime,2.91s suite/8s toàn lệnh, offline/locked. Đã thêm phí ở mọi reject và rollback tạo+trả, u64 boundaries, readonly/merchant/cancel/malformed, signature crypto, immutable terms và namespace nhiều invoices. Source Anchor `try_accounts.rs:274–308` xác nhận init_fields trước access_checks, nên r1 expectation được sửa theo tầng lỗi thực, không sửa program. Chưa phát hiện lỗi logic cần đổi wire contract; program/IDL hiện giữ nguyên. [Vectors](../evidence/phase4/runtime-abi-r2.json) chứa instructions/metas/account/event thật cho client đối chiếu, chỉ public bytes. Fixture cancel export phục hồi Open để dùng cùng địa chỉ; tests cancel thông thường vẫn create thật, không dùng export để chứng minh lifecycle.

### Review và phương án cổng sau local

Tự review S01–S12/threat model có đường source/tests ở `reviews/receiptrail-phase4-local.md`; không tìm thấy lỗi program mới trong phạm vi này, không gọi audit độc lập. Chuẩn bị patch CI4dòng chưa áp; quote read-only devnet không signer/sign/send cho PHASE4-PLAN. Lần quote đầu chép thiếu expected genesis nên guard chặn sau1read; sửa bằng expected từ record Phase3 đã kiểm, không nới guard hay lấy response làm allowlist. R2rent devnet khác VM, phải đọc lại sau đổi identity/build và trước gửi. Trần1.8SOL chỉ là đề xuất, không tái dùng quyền1.5SOL hello. Verified source build/upgrade authority/CI/browser còn cổng riêng.

P4-A/P4-B đã đồng ý log13:55:34.348UTC+7. Áp đúng patch4dòng, YAML/permissions/3jobs và bash -n cho toàn run blocks đạt; không installer local. Chạy CI đầu trước tạo4keypairs, sau đổi identity phải CI đúng revision mới trước broadcast.

### P4-B helpers — học trước code

Đọc source cache `solana-loader-v3-interface8.0.1` state/instruction, web3.js1.99.0 typings và journal/upload-r2/verification-source hello đã kiểm. Loader v3 Program36bytes/tag2 trỏ canonical ProgramData; ProgramData45bytes metadata/tag3, option authority tại12/pubkey13..45, payload sau45; Buffer37bytes/tag1/authority5..37. So đúng IDL+bytecode+authority, không coi đúng executable là đủ. RPC simulate VersionedTransaction dùng sigVerify:true; không replaceRecentBlockhash đồng thời. Đọc docs Solana HTTPS bị429 và web tool route_not_found, giữ record, dùng cache pinned/source cũ đã kiểm.

Helper smoke sẽ kiểm genesis trước ký, budget từ baseline+reserve, copy secret trước zeroize, journal signature trước broadcast, preflight true/maxRetries0, không gửi lại khi journal tồn tại. Chỉ fund hai actors0.007SOL/create1/pay1/simulate duplicate/create2/cancel2; kiểm finalized/state/balance/meta. Local tests kiểm budget, loader/account bytes, terms và error program namespace trước dùng mạng. Default inspect không sign/send.

Helpers P4-B đã viết checks.mjs/smoke.mjs:5tests budget/loader/ABI/error-origin đạt; smoke mới node --check, chưa mạng. Default inspect không ký/gửi; send yêu cầu manifest/CI-input hashes/deployment-finalized/journal trống. Duplicate chỉ simulation, blockhash finalized khớp bank simulation; fund1tx +4tx sản phẩm, không broadcast retry. Đã thêm checks vào runner client cho CI revision triển khai; CI8df85c0 đang chạy chưa có helpers này.

Chuẩn bị đổi deployment identity: tách fixture ABI hiện hành sang docs/fixtures/receiptrail-abi.json, giữ runtime-abi-r2.json/evidence/hash cũ bất biến. Client tests dùng canonical fixture và bump từ bytes Rust, không hard-code252 cho một PDA cũ. Sau đổi ID phải export fixture thật lại; không sửa bytes để làm test xanh.

### Chuẩn bị upload ReceiptRail có nhịp
Đọc lại create_buffer/write trong source cache loader-v3-interface8.0.1 (instruction.rs264–307) và wire transaction CLI hello đã finalized. InitializeBuffer tag0, buffer writable + authority readonly; Write tag1/offset u32/length u64 + bytes, buffer writable/authority signer. Tạo buffer đã duyệt bằng SystemProgram.createAccount + InitializeBuffer, rồi gửi từng chunk960bytes có journal/preflight và giáCU0 để tránh burst đã lỗi ở hello. CLI Agave4.1.2 vẫn kiểm feature/bytecode và thực hiện deploy cuối, max-len bằng binary. Chỉ dùng4keys đã duyệt, không tự tạo trong helper, không auto-resend hoặc upgrade. Nếu journal/report tồn tại phải đối soát trước; CI phải chứa source helpers mới trước broadcast.

CI đầu8df85c0 đạt3jobs ở push44475988734 và PR44475994937; log Anchor chứng minh32ReceiptRail+6hello runtime,8hello-client,23ReceiptRail-client. Sau đó mới tạo đúng4keys ngoài Git0700/0600; public identity8NGSPufBmGB1oHqaZpY1jhJYz1X4gqFiNXCQmxfapYko. Đổi declare_id/Anchor config, xuất lại fixture thật từ Rust, sinh IDL/client và chạy32/23/7checks đều đạt. Logic và wire fields không đổi. IDL lần đầu thiếu Agave/.cargo trong PATH; dùng nguyên lệnh note023 thì r2 đạt, giữ cả hai logs. Bộ helper upload/CLI/verify chưa mạng; CI revision mới phải đạt trước broadcast.

### Cổng CI triển khai đã đạt — 19/11/2026 15:57 UTC+7

Push44477944228 tại6d08e5c đạt đủ3jobs; runtime32ReceiptRail + hello5+1, client23/guards7 đạt. PR44477949631 cancelled lúc cài prerequisite; ghi riêng, không gọi PR xanh. Manifest `evidence/phase4/ci-deployment.json` đối chiếu33input hashes với Git blob6d08e5c và worktree, binary local khớp metadata/tests. LinuxCI hash26db68… khác local495e47…; triển khai artifact local đã kiểm theo plan, không gọi verified source build. Script thu log đầu kỳ vọng hello6 trong một suite nên assert chặn trước tạo manifest; đọc log thấy tách5+1, sửa phép kiểm, không gửi mạng khi manifest thiếu.

Inspect read-only15:57UTC+7: slot523938219, đúng genesis, program/buffer/actors chưa tồn tại, balance1.848125199SOL, peak1.531889040SOL<1.8. Dùng đúng4keys đã tạo; journal/report phải đối soát trước resume. A đã nhậnT34 tại c1446c2; chưa có UI/client acceptance.

Upload P4-B hoàn tất 2026-11-19T09:07:31.793Z:1create-buffer+155writes,156statuses finalized; buffer payload byte-identical495e47…; rent buffer752027960lamports, fees785000lamports, balance1095312239. Không retry/key mới; T34 nộp4d2e48a không đổi33inputs triển khai. Tiếp theo initial deployCLI rồi finalized verification.

Deploy đã đối soát157tx finalized (156upload+1deploy), program executable/ProgramData canonical/authority GQ/bytecode495e47… đúng, buffer consumed. Debit753656080lamports=accounts752861080+fees795000; không activity ngoài dự kiến. Evidence deployment-finalized.json. Smoke inspect đã kiểm lại deployment/budget, chưa fund actors tại checkpoint; tiếp theo5tx bounded và duplicate chỉ simulation.
