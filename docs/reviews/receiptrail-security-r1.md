# ReceiptRail — tự review bảo mật r1

Codex · 19/11/2026 · theo [note 028](../learning/028-receiptrail-security-review.md) và [007](../learning/007-solana-program-security.md). **Chưa tìm thấy lỗi P0/P1 mới trong phạm vi source và assertions đã đối chiếu.** Đây là tự review của tác giả, không phải audit độc lập hoặc verdict giáo viên; không chứng minh không còn lỗ hổng.

## Phạm vi và bằng chứng

Đã đọc program, assertions runtime, contract client và review Phase 5 r3. Diff từ `6d08e5c` cho program/runtime/client/IDL/Cargo.lock rỗng. [Manifest r1](receiptrail-security-r1-manifest.json) lưu hashes, revision và evidence tham chiếu; các hashes được kiểm lại trong lượt hoàn thiện tài liệu. Không chạy lại suite không đổi, không gửi transaction hoặc upgrade.

CI revision triển khai `6d08e5c`, push run `44477944228`, đạt 3 jobs; recovery `e9a1603` đạt ở push và PR. Runtime có 32 tests (31 hành vi, 1 export vectors); client có 23 tests (22 API/ABI, 1 bundle smoke). [CI triển khai](../evidence/phase4/ci-deployment.json) · [CI recovery](../evidence/phase4/ci-smoke-recovery.json) · [P4-B final](../evidence/phase4/final-verification.json). Binary Linux CI khác macOS; deployment đã so bytecode với artifact macOS, **chưa verified/reproducible source build**.

## Checklist đã đối chiếu

Dòng source thuộc [lib.rs](../../programs/receiptrail/src/lib.rs); tên test và dòng thuộc [runtime.rs](../../programs/receiptrail/tests/runtime.rs) ở revision trong manifest.

| Nhóm | Source / invariant | Bằng chứng và giới hạn |
| --- | --- | --- |
| S01 — quyền | Create merchant Signer:108; Pay payer Signer:124; Cancel merchant Signer:137 | `payer_address_without_signature_is_rejected`:310; `merchant_address_without_signature_cannot_create_or_cancel`:318; `another_merchant_cannot_cancel`:334. `has_one` chỉ so key; Signer mới kiểm ký |
| S02 — owner/data | Invoice Account:122/136; payer owner/data:123; merchant SystemAccount/data:125–126 | `owner_and_discriminator_are_checked_before_payment`:404; `payer_with_data_or_wrong_owner_cannot_transfer`:487; `merchant_owner_and_data_are_checked_at_create_and_pay`:519 |
| S03 — recipient | Pay has_one payer/merchant:119–120; Cancel merchant:134 | `recipient_substitution_cannot_redirect_payment`:302; `wrong_payer_signer_cannot_pay`:294. Merchant nhận đúng key, không cần ký Pay |
| S04 — PDA | Namespace cố định, merchant 32 bytes và invoiceID 32 bytes; init canonical bump:109–110; seeds/stored bump:118/133 | `same_layout_at_wrong_pda_is_rejected`:427; `wrong_bump_and_version_are_rejected`:439; không ghép chuỗi seed biến độ dài |
| S05 — số học | amount u64 > 0:25; expiry u64 > slot:26; transfer lấy amount từ state:67–76 | `u64_boundaries_remain_exact_and_cannot_wrap_principal`:664. Kiểm 1 lamport, 2^53+1 và u64 max; số lớn giữ chính xác rồi thất bại vì thiếu tiền |
| S06 — input xấu | Handler không unwrap/expect/indexing theo input; Borsh dùng fields cố định | `truncated_instruction_and_account_data_fail_without_principal_changes`:602; `unknown_instruction_cannot_change_terms_or_terminal_state`:510 |
| S07 — reinit | Chỉ init ở Create, không update/init_if_needed; Pay/Cancel cần Open:64/93 | `open_invoice_cannot_change_terms_by_reinitialization`:654; `terminal_invoice_cannot_be_reinitialized_or_reset`:387 |
| S08 — close/revival | Không có close/realloc | Không áp dụng close; terminal/init trùng vẫn bị chặn. Cancel không hoàn rent |
| S09 — CPI | System program cố định:70 và Program<System>:127; không invoke_signed | `substituted_executable_cannot_replace_system_program`:462; không chuyển quyền signer tới program tùy ý |
| S10 — type/version/ABI | Account<Invoice>, version==1:121/135; fields:142–151 | Kiểm owner/discriminator/version sai; size 131 đối chiếu Rust/runtime/client. Filter RPC không thay decode |
| S11 — alias | Create payer khác merchant/invoice:28–37; Pay payer khác merchant:66 | `invalid_creation_terms_and_aliases_leave_no_invoice_or_rent_debit`:470. Hóa đơn khác vẫn có thể trả riêng |
| S12 — atomicity | CPI transfer:68–77, rồi Paid/paid_slot:80–81; runtime atomic transaction | `two_pay_instructions_in_one_transaction_roll_back_the_first_transfer`:259; `two_pay_rollback_charges_only_fee_payer`:815. Principal/state rollback, phí vẫn mất |
| Replay/phạm vi | Status Open:64/93, writable lock | Retry:202–255 có signature khác vẫn bị chặn; tests :709 và :740 chứng minh ID khác hoặc merchant khác tạo hóa đơn riêng |
| Slot/race | Pay slot < expiry:65; Cancel chỉ cần Open | `expiry_boundary_before_at_and_after`:342; Cancel expired:357; race:373 kiểm hai thứ tự serial, chưa stress race/reorg mạng |
| Tx/fee | Writable privileges và chữ ký crypto | Tests :556/:829; create+pay+pay:765 rollback cả create/rent. Helper reject:180–198 đo fee payer riêng; snapshot merchant/payer không bao gồm phí |
| Terms/UI | Client so terms; model khóa đồng bộ, chống stale response và xử lý raw wallet events | [Review r3](receiptrail-phase5-r3.md), 45 web tests và 7 reproductions. DOM thuộc T37; Node tests không chứng minh extension thật |

## Findings và giới hạn còn lại

| ID / mức | Nội dung | Xử lý |
| --- | --- | --- |
| SR-01 · P3 | Comment lib.rs:4 nói local-only/no deployment keypair, sai sau P4-B | Nợ metadata; sửa cùng lượt core tiếp theo nếu có. Không upgrade chỉ vì comment |
| SR-02 · giới hạn thiết kế | Merchant có thể tạo ID mới cho cùng đơn hàng | README/UI phải nói chống trả lại **cùng invoice PDA**, không chống mọi duplicate order. Tests :709/:740 |
| SR-03 · trust vận hành | Upgrade authority còn một signer; binary chưa verified source build | Không tự revoke/rotate/upgrade. Trình quy trình riêng nếu cần |
| SR-04 · availability | Payer pubkey tại Create chưa chứng minh khả năng ký; rent giữ trong account terminal | Hiển thị payer/rent trước Create; Pay vẫn kiểm owner/data. Không tự đổi contract |
| SR-05 · chưa kiểm | Extension thật, reorg/RPC-origin recovery và Unknown mạng ngoài phạm vi VM | Ma trận Phase 6 phải bổ sung; CLI smoke P4-B không thay e2e browser |

Không có patch core hoặc upgrade trong report. Nếu gặp lỗi nghiêm trọng mới, ghi reproduction và trình phương án; Prompt 04 không cho quyền deploy lại.

## Review phần ví/giao dịch từ 266b30c

Review r3 là mốc logic266b30c. Đến source106a18e, đã thêm fixture32bytes, connector mock không RPC, registry lặp an toàn và entry artifact riêng. [Review r4](receiptrail-phase5-r4.md) bao phủ delta, 52 tests/build, 16 ca browser + 2 ca slot và 10 ca artifact; không coi r3 tự chứng minh phần mới.

20/11 kiểm lại 10hashes trong manifest r1 đều khớp: program/runtime/client/IDL/lock/adapter/confirmation/lifecycle không đổi. Các findings core và giới hạn verified build/upgrade authority giữ nguyên. Browser mock không thay kiểm ví thật hoặc mạng; không upgrade/transaction mới trong lượt này.
