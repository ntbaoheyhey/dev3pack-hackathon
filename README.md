# ReceiptRail — Dev3pack Hackathon 2026

ReceiptRail giúp người bán và người trả đọc chung trạng thái một hóa đơn SOL: sau timeout có thể kiểm tra lại, và cùng hóa đơn không chuyển tiền gốc lần thứ hai dù gửi transaction mới. Người dùng chọn **“ReceiptRail chính, ClusterProof phụ” lúc 00:07 ngày 18/11/2026 UTC+7**; [DECISION](docs/ideas/DECISION.md) ghi nguyên văn, giờ và đính chính kết luận cũ.

**Người dùng đã duyệt Phase2 ReceiptRail: “duyệt phase 2”**, log nhận09:27:18.464 ngày18/11/2026 UTC+7 (người dùng không tự nêu giờ quyết định). [IDEA](docs/IDEA.md) · [Giải thích kiến trúc một trang](docs/ARCHITECTURE.md#1-giải-thích-một-trang-cho-người-dùng) · [Bằng chứng local](docs/evidence/phase2/README.md). T31/T32/T33 đã đóng sau lượt cuối, phần thiếu ở [nợ tài liệu](docs/DOCUMENTATION-DEBT.md); giáo viên chưa có verdict. P3-A/P3-B có bằng chứng; người dùng đã mở Phase4/5 local song song ngày19/11 theo [NEXT](docs/NEXT.md). P4-A/P4-B đã được đồng ý riêng: CI đúng pins và ReceiptRail initial deploy/smoke devnet trong1.8SOL, đúng4keys ngoài Git; [phương án](docs/PHASE4-PLAN.md). Public/update web, cài thêm local, upgrade mới, Phase6 và mergePR7 chưa được cho phép.

## ReceiptRail đã có gì

| Phần | Kết quả hiện hành | Giới hạn |
| --- | --- | --- |
| Thiết kế | Account/PDA, create/pay/cancel, trạng thái, lỗi/events/IDL, threat model, wireframe/test plan, storyboard165giây | Chưa UI/video ReceiptRail; nợ tài liệu được giữ riêng, chưa verdict giáo viên |
| Spike Anchor | Native SOL, invoice131bytes, điều khoản bất biến; chuyển tiền và Paid cùng transaction | Local-only, không escrow/refund/stablecoin/x402 |
| Kiểm thử | **32/32 runtime + 23/23 client + 7/7 deployment guards local và CI6d08e5c**, [evidence Phase4](docs/evidence/phase4/README.md); rollback/phí, sai quyền/account, u64, expiry/lifecycle và cross-language ABI | PushCI44477944228 đủ3jobs đạt; PRrun riêng cancelled. Chưa browser/ví thật/RPC recovery hoặc audit độc lập; P4-B đang upload, chưa chốt deploy |
| IDL | [JSON generated](docs/idl/receiptrail.json),3 instructions/1 account/3 events/9 errors; [client generated](docs/PHASE4-CLIENT.md) + types đã bàn giao A trong T34 | A đã nhậnT34; deployment identity [8NGSP…pYko](docs/evidence/phase4/deployment-identity.json) đã qua CI, chưa A xác nhận UI tích hợp |
| Chấm ý tưởng | [C01 r2](docs/ideas/codex/01-receipt-rail.md): **79/100 PLAN, F3→4** nhờ spike D2 | R/D giữ4 PLAN, chưa verdict giáo viên hoặc DELIVERY |

Merchant tạo hóa đơn với payer, amount và expiry. Payer ký đúng ví, program chỉ nhận Open còn hạn, chuyển SOL đúng merchant rồi ghi Paid. Merchant có thể hủy Open. Paid/Cancelled không reset/close/reopen; rent tiếp tục nằm trong account. Cơ chế chỉ chống trả lại **cùng invoice PDA**; merchant vẫn có thể tạo ID khác cho cùng đơn hàng. Receipt không chứng minh giao hàng, và vẫn có trust vào program/upgrade authority/RPC.

## Tái chạy spike cục bộ

Dùng bộ **đã cài**: host Rust1.100.0, platform-tools v1.57, Anchor-lang1.2.2, LiteSVM0.15.0 và dependency cache. Script thiếu binary/cache sẽ dừng; không chạy installer, build wrapper sinh signer, validator hoặc deploy.

```sh
bash scripts/check-receiptrail.sh
bash scripts/check-receiptrail-client.sh
```

Script mặc định đường dẫn Apple Silicon của máy hiện tại; có thể trỏ `RECEIPTRAIL_HOST_TOOLS` và `RECEIPTRAIL_PLATFORM_TOOLS` tới bộ có sẵn ở máy khác. [Note023](docs/learning/023-receiptrail-phase2-spike.md) có lệnh sinh IDL riêng và bài học. [Metadata](docs/evidence/phase2/receiptrail-build-metadata.json) ghi hashes, versions, logs/CU/rent. R1 build+test64s/suite1.06s; r2 bằng cache3s/suite1.00s sau siết runner, cùng source/bytecode. Đây là số đo VM, không báo giá/latency mạng.

[Runner Phase3 offline](scripts/check-phase3-offline.sh) đã build hello và ReceiptRail trước workspace tests: **25 runtime + 8 client tests đạt** bằng cache macOS; hai IDL/bytecode khớp artifacts macOS cũ, Cargo.lock giữ nguyên. [Metadata local](docs/evidence/phase3/offline-pipeline-metadata.json) giữ phạm vi ban đầu.

**CI Linux đạt trên `27cf7ac`:** [PR CI](https://github.com/ntbaoheyhey/dev3pack-hackathon/actions/runs/44237534047) và [push CI](https://github.com/ntbaoheyhey/dev3pack-hackathon/actions/runs/44237529539) đều thành công cả ba jobs. Mỗi run đạt **25 runtime + 8 client + 16 research + 8 web tests**, typecheck/build, sinh hai IDL và đối chiếu ReceiptRail IDL. [Evidence từng run](docs/evidence/phase3/ci-passed-27cf7ac.json) lưu steps/logs/hashes: Anchor1.2.2 build từ source/lock đã pin, archive SBFv1.57 qua SHA256 trước giải nén. Hai run có cùng bytecode hashes, khác snapshot macOS; chưa chứng nhận reproducible build. Lịch sử [attestation403/cancellation](docs/evidence/phase3/ci-resumed-7210aa6.json) và [installer SBF lỗi ở b906a37](docs/evidence/phase3/ci-anchor-source-b906a37.json) được giữ riêng.

P3-A/P3-B được đồng ý riêng bằng **“Đồng ý cả hai”**, giờ log10:13:11.851 ngày18/11 UTC+7. [Phương án Phase3](docs/PHASE3-PLAN.md) giới hạn cài/build trên runner và hello devnet; funding đã được người dùng bổ sung. [P3-B đã kiểm](docs/evidence/phase3/README.md): hello deploy/initialize/increment finalized, counter1, tổng giảm số dư0.651874801SOL dưới trần1.5SOL, trong đó phí0.000695000SOL. Checkpoint tài liệu/merge dùng `[skip ci]`; không gọi HEAD tài liệu có skip là một lượt CI xanh. Quyền này không mở cài thêm máy người dùng, deploy ReceiptRail hoặc public web mới.

## ClusterProof dự phòng và lịch sử lab

[IDEA ClusterProof](docs/IDEA-clusterproof-draft.md)/[ARCHITECTURE ClusterProof](docs/ARCHITECTURE-clusterproof-draft.md) giữ nhãn **“dự phòng, chưa duyệt”**. Source, toolchain, lab và [web công khai hiện có](https://clusterproof-devnet-17nov26.anthony-robinson-125.chatgpt.site) được giữ nguyên. [Wallet lab](https://clusterproof-devnet-17nov26.anthony-robinson-125.chatgpt.site/lab/) chỉ connect/disconnect, không ký/gửi; Core discovery/request đã quan sát, connect/disconnect thật còn chưa kiểm.

Logs lịch sử [Phase3](docs/evidence/phase3/) ghi hello6/client8/web8 tests local, generated IDL và web build/browser. Hello counter ID [`2yzxUQEpaeLmgCMhDipwnVL3DHsxez18KcePonqZRiXL`](https://explorer.solana.com/address/2yzxUQEpaeLmgCMhDipwnVL3DHsxez18KcePonqZRiXL?cluster=devnet) đã deploy và smoke finalized theo [báo cáo P3-B](docs/evidence/phase3/README.md); không là program sản phẩm ReceiptRail. Preflight0SOL buổi sáng là lịch sử. CI bị Billing & plans chặn là lịch sử; kết quả Linux mới được tách theo revision/run ở trên. Các kết quả này không được dùng thay evidence ReceiptRail. [Audit Prompt03](docs/reviews/prompt03-audit.md) tách phần đã nộp khỏi các cổng còn mở.

## Công việc trước sự kiện và trong hackathon

Mốc phân chia là tag **hackathon-start**, sẽ tạo lúc mở màn27/11/2026; chưa tạo trước sự kiện.

### Trước 27/11/2026

- Notes, RUBRICv1.2, shortlist/nguồn và lựa chọn ReceiptRail chính/ClusterProof phụ; sửa hồ sơ lựa chọn/duyệt sai.
- Spike/parser/read-only C02/C03; toolchain, hello lab, client và web nền ClusterProof từ template chính thức.
- ReceiptRail Phase2: IDEA/ARCHITECTURE, Anchor spike/19 tests, generated IDL, demo165giây trên giấy, crawl/UX/review giao A.
- Phase4/5: runtime32/client23/guards7 và CI6d08e5c đạt; P4-B đang upload có journal, đúng cap1.8SOL. A nhậnT34 và đã nộp note025 trước code; UI/ví chưa có bài nộp được xác nhận.
- Commits và giới hạn ở [DEVLOG](docs/DEVLOG.md), [ROADMAP](docs/ROADMAP.md), [cổng duyệt](docs/reviews/phase1-3-gates.md).

### Trong 27–29/11/2026

Chưa có công việc trong sự kiện tại ngày19/11. Ghi tính năng/commit thực khi làm; không gọi code chuẩn bị trước là code trong hackathon.

## Làm việc và license

Codex trưởng nhóm/backend/reviewer; Google Antigravity trợ lý qua [A-queue](docs/tasks/A-queue.md)/[A-done](docs/tasks/A-done.md). Tuân [AGENTS](AGENTS.md), [HANDOFF](docs/HANDOFF.md). [PR#7](https://github.com/ntbaoheyhey/dev3pack-hackathon/pull/7) để review, không merge. [MIT](LICENSE); không đổi visibility repo trong bước này.
