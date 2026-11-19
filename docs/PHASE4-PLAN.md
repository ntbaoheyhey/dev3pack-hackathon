# Phương án cổng CI và devnet ReceiptRail — chưa được phép thực thi

Codex · 19/11/2026. Phase4/5 **đã mở local**, nguyên văn tại [DECISION](ideas/DECISION.md). Mọi mục P4-A/P4-B dưới đây là đề xuất cần câu đồng ý riêng; không lấy quyền hello/P3-A cũ để thực hiện. Public web/Phase6/mergePR7 chưa nằm trong phương án này.

## Phần đã sẵn sàng để review

- Program create/pay/cancel/read và invariants:32runtime tests local đạt, không đổi logic/wire contract; [review](reviews/receiptrail-phase4-local.md)/[evidence](evidence/phase4/README.md).
- Client sinh toàn IDL:23tests local + TypeScript/generated/browser-target bundle đạt; [API bàn giao A](PHASE4-CLIENT.md). Không RPC/sign/send.
- Binary local hiện147,864bytes, SHA256 `962b721ae089a77123283bfe1dde0233284b2a793d692cc0abc53e2a8b6eab5a`. ID local hiện không có deployment keypair; chưa thể deploy nguyên identity này.
- T34 UI/ví đã giao A và có contract; chưa nhận bài nộp/xác nhận mới. Không dùng kết quả client của C thay browser/T34.

## P4-A — CI đúng source Phase4

Cho phép áp [patch cụ thể](proposals/phase4-ci.patch) vào `.github/workflows/ci.yml` và chạy đúng3jobs hiện có trên GitHub runner. Patch chỉ thêm check client ReceiptRail vào `anchor-lab`: cài `apps/web` từ lockfile bằng `npm ci --ignore-scripts --no-fund`, rồi chạy `bash scripts/check-receiptrail-client.sh`; job này đã cài lab từ lockfile. Không thêm action/job/permission/secret hoặc upload/deploy artifact.

Giữ pins/lockfiles Phase3: Ubuntu24.04, Node24.22.2, Rust1.100.0/rustfmt/clippy, Agave4.1.2, Anchor/AVM1.2.2 commit8d9d148, platform-tools v1.57 archive đã pin SHA256; dependencies đúng Cargo.lock và hai package-lock.json. Runner có thể cài lại bộ này; **không cài thêm máy người dùng, đổi billing/limit hoặc versions**. Các bước cài gốc xem [workflow](../.github/workflows/ci.yml)/[P3-A](PHASE3-PLAN.md).

Patch đã qua `git apply --check`, còn nằm trong docs, chưa áp/kích CI. Sau đồng ý: áp patch, kiểm diff, commit không skip để tạo run; đọc jobs/logs theo SHA thật và ghi số tests thực. Local macOS không chứng minh LinuxCI. Checkpoint tài liệu vẫn `[skip ci]`; nếu bị lỗi cần dependency/version ngoài bộ này thì trình lại.

## P4-B — deploy ReceiptRail và smoke có giới hạn

**Đề xuất trần mới:1.8SOL devnet**, riêng cho ReceiptRail gồm cả rent giữ trong accounts, funding actors và phí; không phải quyền1.5SOL của hello. Dự toán đọc RPC công khai, chưa đọc/tạo signer, ký/gửi hoặc mô phỏng giao dịch mạng: [quote r2](evidence/phase4/devnet-rent-quote-r2-2026-11-19.json). Đúng devnet genesis; payer cũ `GQRoDMoWFV2nhgwm3bZGvSCC1LSa2wRkLeeJg8NhbFM2` còn **1.848125199SOL** ở slot523906333. Quote phải kiểm lại sau build và ngay trước gửi; không là cam kết giá hay quyền chi.

| Khoản bảo thủ theo binary hiện tại | SOL devnet |
| --- | ---: |
| ProgramData147909bytes |0.752027960 |
| Buffer tạm, dự trù cùng rent ProgramData |0.752027960 |
| Program36bytes |0.000833120 |
| Funding hai actors thử: merchant0.005, payer0.002 |0.007000000 |
| Phí + dự phòng |0.020000000 |
| **Tổng dự phòng đỉnh** | **1.531889040** |

Đây là tổng bảo thủ tính cả buffer lẫn ProgramData cùng lúc, khác debit cuối; không tính số liệu VM làm giá devnet. Funding actors bao gồm rent hai invoice131bytes (0.001315720SOL mỗi account theo quote) và principal0.001SOL, không cộng lần hai. Ví dụ SOL ở đây chỉ tài sản thử devnet.

Nếu được đồng ý P4-B, cho phép **tạo đúng4keypairs** ngoài Git:1program ReceiptRail,1buffer tạm duy nhất,1merchant thử và1payer thử. Lưu trong thư mục0700/files0600 dưới `~/.local/share/dev3pack/devnet/receiptrail/`; không import vào extension hoặc in secret. Fee payer/upgrade authority dùng signer thử GQ cũ; không đổi/revoke authority hoặc tái dùng hello buffer/program signer. Công khai public keys và source identity trước broadcast; không tự tạo thêm khi retry.

Trình tự sau quyền:

1. Sinh identity, cập nhật `declare_id`, IDL/client/allowlist/fixtures; build và chạy lại32runtime+23client bằng cache vì executable input đã đổi. Ghi hash/size mới, giữ source/IDL/client nhất quán; không chạy `anchor build/test` có bước sinh signer ngầm.
2. P4-A phải xanh cho revision triển khai trước broadcast. Recheck genesis, số dư, program chưa tồn tại, keys/authority/binary/CLI flags; quote rent/fee mới. Nếu tổng dự phòng>1.8SOL hoặc balance không đủ thì dừng trình người dùng, không tự top-up/airdrop hoặc tăng trần.
3. Deploy bằng Agave4.1.2 đã cài, max-len đúng bytecode, priority fee0, preflight bật; journal signature/chunks và chỉ dùng buffer đã tạo. Tái dùng bài học/source upload hello đã kiểm, đối soát finalized trước retry; lỗi/timeout giữ cùng buffer, không ký/broadcast mù quáng. Không close riêng hoặc reset hello.
4. Đọc lại loader/ProgramData/executable/authority/bytecode; chốt tất cả tx deploy finalized/meta.err. Không gọi byte-identical là verified source build.
5. Fund hai actors trong0.007SOL. Smoke CLI: tạo invoice1 amount0.001SOL→pay→đọc Paid; thử duplicate bằng **simulation** để chứng minh từ chối, không cố phát giao dịch lỗi; tạo invoice2→cancel→đọc Cancelled. Fee payer GQ tách actors để đối soát principal/rent/phí; maximum5transactions sản phẩm sau funding (create1,pay1,create2,cancel2 và một slot dự phòng chỉ nếu journal xác định giao dịch cũ chưa xảy ra). Không wallet browser/public UI/Phase6 từ quyền này.
6. Lưu signatures/slots/logs và đối soát toàn bộ deploy+fund+smoke finalized, payer debit và số SOL giữ trong accounts. Không sweep/close hoặc deploy lại sau khi đạt. Nếu lỗi logic cần thay code, dừng đợt deploy để review trước một upgrade mới.

**Điều kiện thực thi:** P4-B cần lời đồng ý riêng và P4-A đạt revision tương ứng. Nếu chỉ đồng ý P4-A thì chỉ CI; nếu chỉ đồng ý P4-B thì có thể chuẩn bị identity/build local nhưng chưa broadcast tới khi có CI được phép và đạt. Có thể duyệt cả hai để xử lý tuần tự, vẫn không mở public/Phase6/merge.

## Việc public/ví thật để riêng

Chỉ trình public web sau T34 có artifact local, browser evidence và C review tiền/quyền. Lúc đó nêu source snapshot/URL/hosting cụ thể. Core/extension connect-disconnect thật vẫn chưa kiểm theo lựa chọn người dùng; không xin seed/mật khẩu hoặc tự tạo ví cho người dùng. Giáo viên chưa verdict; không tự đóng toàn phase/goal.
