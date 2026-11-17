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

Số đo VM: account131bytes, rent1,802,640lamports, principal1,000,000 trả1lần, CU create8,775/pay6,608/retry6,017/cancel4,346, fee10,000 do2signatures. Không suy thành phí/latency devnet hoặc benchmark mạng. Chưa UI/wallet/RPC recovery/load, CI/devnet hoặc audit độc lập.
