# ReceiptRail P4-B — vận hành có giới hạn

Chỉ dùng quyền đã ghi trong `docs/PHASE4-PLAN.md`: initial deploy + smoke devnet, trần tổng1.8SOL. Không phải quyền upgrade, mainnet, public web hoặc tạo thêm keys. Helpers không tạo keypair; đúng4keys đã tạo ngoài Git sau CI đầu đạt. Không chạy lệnh nếu record/journal cho thấy bước đã bắt đầu; đọc chain và đối soát trước.

## Trước broadcast

1. CI phải đạt đúng revision triển khai, đủ3jobs. Lưu `docs/evidence/phase4/ci-deployment.json`: `status: PASSED`, `program`, `headSha`, run/jobs/logs và `inputHashes` của source/build/IDL/client/helpers/locks. `localBinarySha256` lấy từ artifact đã chạy32runtime tests, không lấy binary CI để thay artifact chưa kiểm.
2. Đối chiếu source từng hash với Git blob của SHA CI và worktree. Không đổi dependencies/pins hoặc ghi PASSED vì run skipped/queued.
3. `node tools/receiptrail-devnet/deploy.mjs --inspect` chỉ đọc: cluster, account chưa tồn tại, balance, rent/peak budget và binary. Không đọc signer/ký/gửi.

## Các bước đã được P4-B cho phép

- `node tools/receiptrail-devnet/deploy.mjs --upload-approved`: tạo đúng buffer đã có key, upload từng chunk960bytes; journal trước gửi, ký một lần/preflight/maxRetries0/price0. Cuối cần finalized và byte-for-byte bằng binary. Không tự retry khi lỗi.
- `node tools/receiptrail-devnet/deploy.mjs --deploy-approved`: chỉ sau upload đạt; Agave4.1.2 với program/buffer/fee/authority tường minh, max-len bằng binary và max-sign-attempts1. Program đã tồn tại thì dừng, không upgrade. CLI exit0 chưa là finalized evidence.
- `node tools/receiptrail-devnet/verify.mjs --deployment`: không signer/broadcast; kiểm toàn signatures/meta/fees, executable/canonical ProgramData/authority/bytecode, buffer đã tiêu thụ, budget và hoạt động payer ngoài dự kiến. Có checkpoint read-only để tiếp tục sau lỗi RPC; không gửi lại deploy.
- `node tools/receiptrail-devnet/smoke.mjs --inspect`, rồi `--send-approved`: fund actors0.007SOL, create/pay, duplicate chỉ simulation, create/cancel; journal và kiểm finalized từng bước. Không chạy lại nếu report/journal tồn tại.
- `node tools/receiptrail-devnet/verify.mjs --all`: kiểm thêm5tx smoke, Paid/Cancelled, duplicate không được broadcast, đối soát debit = accounts giữ SOL + phí trong trần1.8SOL. Không sweep/close hoặc đổi authority.

Các record chứa public keys/signatures/hashes, không secret. Bytecode equality chứng minh bytes đã deploy bằng artifact local; **chưa phải verified source build**. Mock/CLI không chứng minh ví extension hoặc Phase5/6/public UI.
