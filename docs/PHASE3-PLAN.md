# Phase 3 — phương án sau duyệt thiết kế

18/11/2026 · ReceiptRail chính, ClusterProof phụ. Người dùng đã nói **“duyệt phase 2”**, giờ log 09:27:18.464 UTC+7; không hỏi lại. [DECISION](ideas/DECISION.md) vẫn yêu cầu đồng ý riêng trước cài thêm, tạo ví/keypair triển khai, deploy/public.

## Phần đã chuẩn bị và kiểm được

- [Runner offline](../scripts/check-phase3-offline.sh): hai program cùng pipeline; **25 runtime tests và 8 client tests đạt**. Hai IDL và bytecode khớp artifacts cũ. [Metadata/logs](evidence/phase3/offline-pipeline-metadata.json) ghi macOS arm64/cache; Linux CI mới được ghi riêng bên dưới.
- [Workflow](../.github/workflows/ci.yml): ba jobs đã thực thi trên Linux. Push7210aa6 đạt25runtime+8client+16research+8web/typecheck/build/ReceiptRail IDL cmp; PR7210aa6 lỗi lấy attestation403 ([evidence](evidence/phase3/ci-resumed-7210aa6.json)). Patchb906a37 build cùng source8d9d148/lock đang được kiểm ở PR44233192373/push44233187077. Giữ source/web/lab; không upload binary artifact.
- [Preflight 09:47:33 UTC+7](evidence/phase3/preflight-after-phase2-approval.json): đúng devnet, hello chưa deploy, payer 0 lamports. Không đọc signer hoặc gửi airdrop/transaction.
- [Review T26/T27](reviews/receiptrail-codex.md#review-t26-và-t27--18112026-sau-duyệt-phase2) chưa nhận toàn bộ; A tiếp tục T28 → T29. Giáo viên chưa có verdict; lời duyệt người dùng là cổng riêng.

## P3-A — đã được phép CI trên runner GitHub

**Đã được người dùng đồng ý** bằng “Đồng ý cả hai”, giờ log 10:13:11.851 ngày 18/11/2026 UTC+7; [record](evidence/phase3/user-permission-2026-11-18.json). Phạm vi là mở ba guards của patch đã chuẩn bị và chạy CI trên PR #7 với bộ sau:

| Thành phần | Phạm vi đề nghị |
| --- | --- |
| Runner | GitHub Ubuntu 24.04 tạm thời |
| Gói hệ thống | build-essential, pkg-config, libssl-dev, libudev-dev, clang, cmake từ repository Ubuntu tại lúc chạy; chưa lock từng version apt |
| Toolchain | Rust 1.100.0/rustfmt/clippy; Agave 4.1.2; AVM/Anchor 1.2.2 tại commit 8d9d148; platform-tools v1.57 |
| JS và dependencies | Node 24.22.2; Cargo.lock và hai package-lock hiện có trong repo; Actions giữ SHA pin |
| Công việc | Build/test/research/client/web và sinh/đối chiếu IDL |

Chỉ cài trên runner, không cài thêm máy người dùng; không deploy program/web, upload binary artifact hoặc dùng secrets/keypair. Nếu cần đổi pins/dependency ngoài lock thì trình lại. [K9](evidence/phase3/ci-merge-7e654a0-blocked.json) giữ lỗi Billing & plans lịch sử. Sau tin “Đã mở CI, chạy tiếp Phase 3.” (log10:35:20.180 UTC+7), runner đã hoạt động; không còn yêu cầu người dùng sửa billing theo evidence cũ. C không đổi hạn mức/chi trả.

Đã lưu quyền/push fd78236 trước mở guard. Lịch sử51bf866 bị billing chặn và a114a98 cancelled được giữ riêng. Patchb906a37 chỉ đổi cách cài AVM/Anchor: cargo1.100.0 build cả hai từ cùng SHA8d9d148 với lock upstream vào RUNNER_TEMP, kiểm binary Anchor1.2.2, không bỏ kiểm chứng binary tải về hoặc thêm token/quyền. YAML/10shell blocks/scope diff đã kiểm trước push; chờ hai run terminal. Chỉ nhận khi cả3jobs thực chạy/pass trên đúng revision và có steps/logs; checkpoint tài liệu có skip không tự có chứng nhận CI. Quyền CI không mở deploy.

## P3-B — đã được phép, chờ funding để deploy hello

**Đã được người dùng đồng ý** bằng cùng câu trả lời P3-A/P3-B. Tin sau đó **“chưa rảnh để chuyển sol devnet”**, giờ log 10:14:46.599 UTC+7, để bước deploy sau khi có funding. Chỉ triển khai hello của Phase 3, không deploy ReceiptRail core hoặc publish web mới.

- Program ID đã có: `2yzxUQEpaeLmgCMhDipwnVL3DHsxez18KcePonqZRiXL`; payer/upgrade authority dự kiến `GQRoDMoWFV2nhgwm3bZGvSCC1LSa2wRkLeeJg8NhbFM2`.
- Sau đồng ý mới kiểm public key từ signers thử cũ ngoài Git có khớp hai địa chỉ trên. Không in secret hoặc import ví browser. Nếu thiếu/sai signer thì dừng, không tự tạo payer/program mới.
- Cần **một buffer keypair tạm ngoài Git**, thư mục 0700/file 0600; tạo chỉ sau câu đồng ý. Không in seed vào chat/log hoặc tạo ví mới cho người dùng.
- CLI `--buffer`, `--program-id`, `--fee-payer`, `--upgrade-authority`, `--max-len`, `--max-sign-attempts`, `--use-rpc` đã kiểm bằng help. Binary hello 127,672 bytes có hash trong metadata. Dùng devnet rõ ràng, `--max-len 127672`, compute unit price 0, tối đa một lần ký lại; giữ upgrade authority tại payer thử.
- Rent snapshot program + programdata + buffer là **1.29969768 SOL**, estimate bảo thủ trước phí/counter. Đề xuất **trần 1.5 SOL devnet** cho deploy + initialize/increment; recheck balance/rent/fee/flags trước gửi, dừng nếu vượt. Payer hiện 0 SOL, cần người dùng cấp SOL devnet sau khi cho phép; không mua SOL hoặc dùng mainnet.
- Sau deploy: đọc genesis/executable/owner/programdata/authority/bytecode; chạy client initialize/increment đã có, lưu chữ ký/log/state và xác nhận finalized. Timeout giữ pending journal để đối soát, không ký lại mù quáng; không tự close buffer hoặc tăng trần.

Chỉ nhận khi program đúng devnet, transaction success có log/state/commitment và bytecode/authority khớp; chữ ký đơn lẻ không đủ. Quyền hello không mở ReceiptRail deployment hoặc Phase 4.

## Web và ví

Giữ site ClusterProof và /lab đã public; không publish/update web mới trong phiếu này. Browser/fixture cũ không thay kiểm connect/disconnect ví thật. Người dùng đã nói chưa có ví devnet sẵn sàng; giữ bước này chưa kiểm đến khi họ sẵn sàng, không hỏi mật khẩu/seed. Web ReceiptRail ở phase sau cần phạm vi public riêng.

## Điều kiện kết thúc

[ROADMAP](ROADMAP.md) yêu cầu hello devnet + transaction thật, web live/luồng ví và CI xanh; [bảng cổng](reviews/phase1-3-gates.md) giữ review/giáo viên riêng. Phương án và local tests chưa là Phase 3 hoàn thành hoặc quyền thi hành. [NEXT](NEXT.md) ghi việc sau câu trả lời.
