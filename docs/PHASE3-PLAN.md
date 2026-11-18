# Phase 3 — phương án sau duyệt thiết kế

18/11/2026 · ReceiptRail chính, ClusterProof phụ. Người dùng đã nói **“duyệt phase 2”**, giờ log 09:27:18.464 UTC+7; không hỏi lại. [DECISION](ideas/DECISION.md) vẫn yêu cầu đồng ý riêng trước cài thêm, tạo ví/keypair triển khai, deploy/public.

## Phần đã chuẩn bị và kiểm được

- [Runner offline](../scripts/check-phase3-offline.sh): hai program cùng pipeline; **25 runtime tests và 8 client tests đạt**. Hai IDL và bytecode khớp artifacts cũ. [Metadata/logs](evidence/phase3/offline-pipeline-metadata.json) ghi macOS arm64/cache; Linux CI mới được ghi riêng bên dưới.
- [Workflow](../.github/workflows/ci.yml): revision27cf7ac đạt cả ba jobs trên Linux ở PR44237534047 và push44237529539. Mỗi run25runtime+8client+16research+8web/typecheck/build, sinh hai IDL và ReceiptRail IDL cmp ([evidence](evidence/phase3/ci-passed-27cf7ac.json)). Source/locks/web/lab giữ nguyên; không upload binary artifact.
- [Preflight 09:47:33 UTC+7](evidence/phase3/preflight-after-phase2-approval.json): đúng devnet, hello chưa deploy, payer 0 lamports. Không đọc signer hoặc gửi airdrop/transaction.
- [Review T30](reviews/receiptrail-codex.md#review-t30--18112026-heartbeat1327-utc7) nhận một phần; [T31/e483529](reviews/receiptrail-codex.md#review-t31--18112026) chưa đạt provenance/state/phản hồi. [T32/c801580](reviews/receiptrail-codex.md#review-t32--18112026) nhận merchant không ký pay/3tên hàm/baseline, còn assertions/log/giới hạn. [T33/6ef9815](reviews/receiptrail-codex.md#review-t33--18112026-heartbeat1428-utc7) nhận hai bảng/9mã/165giây trên giấy, còn state/vai/form/phí/bố cục/demo/SDK. Giữ9nhóm findings; A làm T31→T32→T33 sửa bổ sung cùng ID. Giáo viên chưa có verdict; lời duyệt người dùng là cổng riêng.

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

Đã lưu quyền/push fd78236 trước mở guard. Lịch sử51bf866 bị billing chặn, a114a98 cancelled và PR7210aa6 attestation403 được giữ riêng. Patchb906a37 build AVM/Anchor1.2.2 từ cùng SHA8d9d148/lock bằng cargo1.100.0 đã qua cài/version nhưng lỗi lấy SBF qua API ([evidence](evidence/phase3/ci-anchor-source-b906a37.json)). Patch27cf7ac tải đúng archive platform-tools v1.57, kiểm SHA256 trước extract; hai run đã completed/success, xác minh logs ngày18/11 lúc11:41:50 UTC+7. YAML/10shell blocks/scope diff được kiểm trước push; không thêm token/quyền hoặc cài local. Checkpoint tài liệu dùng skip không tự là một run CI xanh. Quyền CI không mở deploy.

Hai bytecode hashes Linux khớp giữa push/PR27cf7ac và Linux7210aa6, khác bản macOS/cache. Chưa kết luận nguyên nhân hoặc reproducible/verified build; giữ binary macOS đã chuẩn bị trong P3-B. Hello IDL được sinh/dùng trong client tests, workflow chỉ cmp ReceiptRail IDL với bản đã track.

## P3-B — đã được phép, chờ funding để deploy hello

**Đã được người dùng đồng ý** bằng cùng câu trả lời P3-A/P3-B. Tin sau đó **“chưa rảnh để chuyển sol devnet”**, giờ log 10:14:46.599 UTC+7, để bước deploy sau khi có funding. Chỉ triển khai hello của Phase 3, không deploy ReceiptRail core hoặc publish web mới.

- Program ID đã có: `2yzxUQEpaeLmgCMhDipwnVL3DHsxez18KcePonqZRiXL`; payer/upgrade authority dự kiến `GQRoDMoWFV2nhgwm3bZGvSCC1LSa2wRkLeeJg8NhbFM2`.
- Khi funding sẵn sàng, kiểm public key từ signers thử cũ ngoài Git có khớp hai địa chỉ trên theo quyền đã có. Không in secret hoặc import ví browser. Nếu thiếu/sai signer thì dừng, không tự tạo payer/program mới.
- Đã có quyền tạo **một buffer keypair tạm ngoài Git**, thư mục 0700/file 0600, nhưng chưa tạo; chỉ thực hiện sau preflight đủ funding. Không in seed vào chat/log hoặc tạo ví mới cho người dùng.
- CLI `--buffer`, `--program-id`, `--fee-payer`, `--upgrade-authority`, `--max-len`, `--max-sign-attempts`, `--use-rpc` đã kiểm bằng help. Binary hello 127,672 bytes có hash trong metadata. Dùng devnet rõ ràng, `--max-len 127672`, compute unit price 0, tối đa một lần ký lại; giữ upgrade authority tại payer thử.
- Rent snapshot program + programdata + buffer là **1.29969768 SOL**, estimate bảo thủ trước phí/counter. **Trần đã duyệt 1.5 SOL devnet** cho deploy + initialize/increment; recheck balance/rent/fee/flags trước gửi, dừng nếu vượt. Payer 0 SOL tại preflight09:47:33 UTC+7; chưa kiểm lại số dư, funding được người dùng để sau; không mua SOL hoặc dùng mainnet.
- Sau deploy: đọc genesis/executable/owner/programdata/authority/bytecode; chạy client initialize/increment đã có, lưu chữ ký/log/state và xác nhận finalized. Timeout giữ pending journal để đối soát, không ký lại mù quáng; không tự close buffer hoặc tăng trần.

Chỉ nhận khi program đúng devnet, transaction success có log/state/commitment và bytecode/authority khớp; chữ ký đơn lẻ không đủ. Quyền hello không mở ReceiptRail deployment hoặc Phase 4.

## Web và ví

Giữ site ClusterProof và /lab đã public; không publish/update web mới trong phiếu này. Browser/fixture cũ không thay kiểm connect/disconnect ví thật. Người dùng đã nói chưa có ví devnet sẵn sàng; giữ bước này chưa kiểm đến khi họ sẵn sàng, không hỏi mật khẩu/seed. Web ReceiptRail ở phase sau cần phạm vi public riêng.

## Điều kiện kết thúc

[ROADMAP](ROADMAP.md) yêu cầu hello devnet + transaction thật, web live/luồng ví và CI xanh; [bảng cổng](reviews/phase1-3-gates.md) giữ review/giáo viên riêng. Phương án và local tests chưa là Phase 3 hoàn thành hoặc quyền thi hành. [NEXT](NEXT.md) ghi việc sau câu trả lời.
