# ReceiptRail — Dev3pack Hackathon 2026

ReceiptRail giúp người bán và người trả đọc chung trạng thái một hóa đơn SOL: sau timeout có thể kiểm tra lại, và cùng hóa đơn không chuyển tiền gốc lần thứ hai dù gửi transaction mới. Người dùng chọn **“ReceiptRail chính, ClusterProof phụ” lúc 00:07 ngày 18/11/2026 UTC+7**; [DECISION](docs/ideas/DECISION.md) ghi nguyên văn, giờ và đính chính kết luận cũ.

**Người dùng đã duyệt Phase2 ReceiptRail: “duyệt phase 2”**, log nhận09:27:18.464 ngày18/11/2026 UTC+7 (người dùng không tự nêu giờ quyết định). [IDEA](docs/IDEA.md) · [Giải thích kiến trúc một trang](docs/ARCHITECTURE.md#1-giải-thích-một-trang-cho-người-dùng) · [Bằng chứng local](docs/evidence/phase2/README.md). Review chéo/giáo viên còn mở; tiếp tục chuẩn bị Phase3 trong quyền hiện có theo [NEXT](docs/NEXT.md). Cài thêm, tạo ví/keypair triển khai, deploy hoặc public mới phải hỏi riêng trước.

## ReceiptRail đã có gì

| Phần | Kết quả hiện hành | Giới hạn |
| --- | --- | --- |
| Thiết kế | Account/PDA, create/pay/cancel, trạng thái, lỗi/events/IDL, threat model, wireframe/test plan, storyboard165giây | Chưa UI/video ReceiptRail; review chéo/giáo viên còn mở |
| Spike Anchor | Native SOL, invoice131bytes, điều khoản bất biến; chuyển tiền và Paid cùng transaction | Local-only, không escrow/refund/stablecoin/x402 |
| Kiểm thử | **19/19 runtime tests**, bytecode SBFv3 thật trong LiteSVM; tx mới retry, rollback, sai quyền/account, expiry/race/lifecycle | Chưa browser/wallet/RPC recovery, devnet, CI hoặc audit độc lập |
| IDL | [JSON generated](docs/idl/receiptrail.json),3 instructions/1 account/3 events/9 errors; đã đối chiếu source | Chưa client UI tích hợp; program ID chỉ local |
| Chấm ý tưởng | [C01 r2](docs/ideas/codex/01-receipt-rail.md): **79/100 PLAN, F3→4** nhờ spike D2 | R/D giữ4 PLAN, chưa verdict giáo viên hoặc DELIVERY |

Merchant tạo hóa đơn với payer, amount và expiry. Payer ký đúng ví, program chỉ nhận Open còn hạn, chuyển SOL đúng merchant rồi ghi Paid. Merchant có thể hủy Open. Paid/Cancelled không reset/close/reopen; rent tiếp tục nằm trong account. Cơ chế chỉ chống trả lại **cùng invoice PDA**; merchant vẫn có thể tạo ID khác cho cùng đơn hàng. Receipt không chứng minh giao hàng, và vẫn có trust vào program/upgrade authority/RPC.

## Tái chạy spike cục bộ

Dùng bộ **đã cài**: host Rust1.100.0, platform-tools v1.57, Anchor-lang1.2.2, LiteSVM0.15.0 và dependency cache. Script thiếu binary/cache sẽ dừng; không chạy installer, build wrapper sinh signer, validator hoặc deploy.

```sh
bash scripts/check-receiptrail.sh
```

Script mặc định đường dẫn Apple Silicon của máy hiện tại; có thể trỏ `RECEIPTRAIL_HOST_TOOLS` và `RECEIPTRAIL_PLATFORM_TOOLS` tới bộ có sẵn ở máy khác. [Note023](docs/learning/023-receiptrail-phase2-spike.md) có lệnh sinh IDL riêng và bài học. [Metadata](docs/evidence/phase2/receiptrail-build-metadata.json) ghi hashes, versions, logs/CU/rent. R1 build+test64s/suite1.06s; r2 bằng cache3s/suite1.00s sau siết runner, cùng source/bytecode. Đây là số đo VM, không báo giá/latency mạng.

[Runner Phase3 offline](scripts/check-phase3-offline.sh) đã build cả hello và ReceiptRail trước workspace tests: **25 runtime tests + 8 client tests đạt**; hai IDL/bytecode khớp artifacts cũ, Cargo.lock giữ nguyên. [Metadata/logs](docs/evidence/phase3/offline-pipeline-metadata.json) ghi phạm vi macOS/cache; chưa Linux CI. Workflow đã nối runner mới; P3-A/P3-B được đồng ý bằng **“Đồng ý cả hai”**, giờ log10:13:11.851 ngày18/11 UTC+7. Đã mở ba guards tại51bf866, nhưng [hai CI runs](docs/evidence/phase3/ci-approved-51bf866-blocked.json) bị Billing & plans chặn trước mọi step. Checkpoint tài liệu/merge vẫn dùng `[skip ci]` để tránh chạy thừa. **Skipped/blocked không là CI xanh.** [Phương án Phase3](docs/PHASE3-PLAN.md) giữ đúng quyền CI và hello devnet; người dùng **“chưa rảnh để chuyển sol devnet”**, nên deploy để sau funding. Không mở quyền deploy ReceiptRail/public web mới.

## ClusterProof dự phòng và lịch sử lab

[IDEA ClusterProof](docs/IDEA-clusterproof-draft.md)/[ARCHITECTURE ClusterProof](docs/ARCHITECTURE-clusterproof-draft.md) giữ nhãn **“dự phòng, chưa duyệt”**. Source, toolchain, lab và [web công khai hiện có](https://clusterproof-devnet-17nov26.anthony-robinson-125.chatgpt.site) được giữ nguyên. [Wallet lab](https://clusterproof-devnet-17nov26.anthony-robinson-125.chatgpt.site/lab/) chỉ connect/disconnect, không ký/gửi; Core discovery/request đã quan sát, connect/disconnect thật còn chưa kiểm.

Logs lịch sử [Phase3](docs/evidence/phase3/) ghi hello6/client8/web8 tests local, generated IDL và web build/browser. Hello counter ID `2yzxUQEpaeLmgCMhDipwnVL3DHsxez18KcePonqZRiXL` chưa deploy ở [preflight 18/11, 09:47:33 UTC+7](docs/evidence/phase3/preflight-after-phase2-approval.json), payer 0 lamports; không là program sản phẩm ReceiptRail. CI cũ bị Billing & plans chặn trước jobs, chưa có Linux CI xanh. Các kết quả này không được dùng thay evidence ReceiptRail. [Audit Prompt03](docs/reviews/prompt03-audit.md) tách phần đã nộp khỏi các cổng còn mở.

## Công việc trước sự kiện và trong hackathon

Mốc phân chia là tag **hackathon-start**, sẽ tạo lúc mở màn27/11/2026; chưa tạo trước sự kiện.

### Trước 27/11/2026

- Notes, RUBRICv1.2, shortlist/nguồn và lựa chọn ReceiptRail chính/ClusterProof phụ; sửa hồ sơ lựa chọn/duyệt sai.
- Spike/parser/read-only C02/C03; toolchain, hello lab, client và web nền ClusterProof từ template chính thức.
- ReceiptRail Phase2: IDEA/ARCHITECTURE, Anchor spike/19 tests, generated IDL, demo165giây trên giấy, crawl/UX/review giao A.
- Commits và giới hạn ở [DEVLOG](docs/DEVLOG.md), [ROADMAP](docs/ROADMAP.md), [cổng duyệt](docs/reviews/phase1-3-gates.md).

### Trong 27–29/11/2026

Chưa có công việc trong sự kiện tại ngày18/11. Ghi tính năng/commit thực khi làm; không gọi code chuẩn bị trước là code trong hackathon.

## Làm việc và license

Codex trưởng nhóm/backend/reviewer; Google Antigravity trợ lý qua [A-queue](docs/tasks/A-queue.md)/[A-done](docs/tasks/A-done.md). Tuân [AGENTS](AGENTS.md), [HANDOFF](docs/HANDOFF.md). [PR#7](https://github.com/ntbaoheyhey/dev3pack-hackathon/pull/7) để review, không merge. [MIT](LICENSE); không đổi visibility repo trong bước này.
