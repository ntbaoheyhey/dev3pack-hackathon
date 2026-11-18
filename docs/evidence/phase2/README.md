# ReceiptRail Phase 2 — bằng chứng local

18/11/2026 · Codex · trước sự kiện. Chỉ LiteSVM/cached compiler; không validator/RPC/deploy, không file ví mới. Program ID là định danh local.

| Artifact | Kết quả và giới hạn |
| --- | --- |
| [spike r1](receiptrail-spike-r1.txt) |19/19 runtime tests, suite1.06s/build+test64s, bytecode SBFv3 thật |
| [spike r2](receiptrail-spike-r2.txt) |19/19, suite1.00s/build+test3s bằng cache; runner gọi trực tiếp host compiler tránh rustup proxy; source/bytecode không đổi |
| [metadata hiện hành](receiptrail-build-metadata.json), [metadata r1](receiptrail-build-metadata-r1.json) |Hash source/tests/script/lock/binary, version/CU/rent/principal, layout/IDL hash; metadata r1 là snapshot runner cũ |
| [IDL r1](receiptrail-idl-r1.txt), [r2](receiptrail-idl-r2.txt), [r3](receiptrail-idl-r3.txt) |Hai lần lỗi giữ nguyên; r3 exit0 sau sửa PATH process. Không dùng19 tests filtered-out ở IDL thay runtime suite |
| [IDL JSON](../../idl/receiptrail.json) |3 instructions/1 account/3 events/9 custom errors; đã đối chiếu source/ARCHITECTURE |

Review tài liệu: [audit UX T17](receiptrail-ux-t17-audit.json) lưu bản3475c36, hash UX/IDL và9 cặp code–name: **0/9 khớp**, giữ nguyên bảng T16 dù5checkbox đã tick. Chỉ kiểm dữ liệu/report; không thêm runtime tests, không chứng minh copy/CTA hoặc wireframe đạt. Kết luận chi tiết ở [review T17](../../reviews/receiptrail-codex.md#review-đầu-ra-t17--18112026-lượt-heartbeat0510-utc7).

Tái chạy: `bash scripts/check-receiptrail.sh` với bộ toolchain/cache đã có. Xem [note023](../../learning/023-receiptrail-phase2-spike.md) cho đường dẫn override, lệnh IDL và nguyên nhân không dùng build wrapper sinh keypair. Thiếu cache phải hỏi trước cài, không tự download.

Số đo VM: account131bytes, rent1,802,640lamports, principal1,000,000 trả1lần, CU create8,775/pay6,608/retry6,017/cancel4,346, fee10,000 do2signatures. Không suy thành phí/latency devnet hoặc benchmark mạng. Tại mốc spike chưa có CI; [CI27cf7ac đã đạt](../phase3/ci-passed-27cf7ac.json) được lưu riêng. UI/wallet/RPC recovery/load, devnet và audit độc lập còn chưa kiểm.

[Audit review T18–T20](receiptrail-reviews-t18-t20-audit.json), snapshot f49716a: T19 có9/9 mã–tên khớp IDL; T18 dẫn test_duplicate không có trong source/log; T20 có5URL. Source/tests/IDL khớp3hash metadata. C đọc source/log cũ và5nguồn bên ngoài để review nội dung, không chạy runtime suite mới; counts không tự đóng tiêu chí UX/review/evidence. Audit T17 giữ kết quả lịch sử tại3475c36, không phải bảng lỗi UX hiện tại.

[Review T28/T29](receiptrail-t28-t29-review.json) giữ 3 report tại601e723 cùng hashes/Git blob, 6 hashes đầu vào và phạm vi kiểm tài liệu. Nhận phí/Unknown/baseline retry Paid→Paid; 9/9 cặp IDL, 165giây, 4 mục wireframe và 0/3 tên hàm rút gọn khớp source. Còn 9 findings, giao T30–T33; không crawl/rerun runtime hoặc tự đóng review chéo. [Kết luận C](../../reviews/receiptrail-codex.md#review-t28-và-t29--18112026-heartbeat1235-utc7).

[Bản bổ sung306466f](receiptrail-t28-t29-v2-review.json): UX44dòng/evidence36/review28;3snapshot/6hashes/9mã/165giây/4mục đã đối chiếu. Request và copy6007 cải thiện, UX lại bỏ phí create/Unknown/terms/context. Findings giữ9nhóm, queueT30–T33 cập nhật đầu vào; snapshot601e723 vẫn là lịch sử độc lập.

[Review T30/0d7b9d3](receiptrail-t30-review.json):43dòng,9/9 code–name,6input hashes khớp; nhận phí/terms/Unknown và expiry đúng biên. State/version/form/CTA còn thiếu, mục3–5 thành placeholder nên0bố cục/0khoảng thời gian, không xác nhận165giây ở bản mới. T31→T32→T33, T33 bao gồm phần T30 chưa đạt; không runtime/browser/CI mới.

[Review T31/e483529](receiptrail-t31-review.json): giữ5URL/nhãnEVM/expiry; thiếu provenance/state/phản hồi, mất Request và cơ chế từng có. Snapshot nguyên văn/hash khớp Git blob,6input hashes không đổi. Không crawl/runtime/browser/CI mới; T32/T33 tiếp tục, phầnT31 chưa đạt sửa trong cùng task.

[Review T32/c801580](receiptrail-t32-review.json):36dòng,3tên hàm đầy đủ khớp source/log r2,6input hashes khớp. Nhận merchant không ký pay và baseline retry/rollback; recipient/assertions/log/fee boundary/ma trận/phản hồi còn thiếu. Không runtime/browser/CI mới; T33 tiếp tục rồi sửa hẹp T31/T32 cùng task ID.

[Review T33/6ef9815](receiptrail-t33-review.json):54dòng/6input hashes/9mã đúng; hai bảng Invoice/Request,4mục màn hình,4khoảng liên tục đủ165giây trên giấy,0URL. Nhận phần cải thiện; state/vai/CTA, form/phí bị mất,8bố cục/demo/SDK/phản hồi vẫn chưa đạt. T31→T32 rồi sửa hẹp T33 cùng ID; không runtime/browser/CI mới.
