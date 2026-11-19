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
