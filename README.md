# ReceiptRail — Dev3pack Hackathon 2026

ReceiptRail là hướng chính được người dùng chọn lúc00:07 ngày18/11/2026: **“ReceiptRail chính, ClusterProof phụ”**. ReceiptRail đề xuất hóa đơn SOL chỉ trả được một lần cho cùng invoice PDA, có trạng thái chung để đọc lại sau timeout. Phase2 đang làm; IDEA/ARCHITECTURE **chưa duyệt**, xem [DECISION](docs/ideas/DECISION.md).

Bản [IDEA ClusterProof](docs/IDEA-clusterproof-draft.md)/[ARCHITECTURE ClusterProof](docs/ARCHITECTURE-clusterproof-draft.md) là **dự phòng, chưa duyệt**. Giữ toolchain, web và lab đã có; cài thêm/deploy/public mới cần hỏi trước. Repo có MIT, chưa đổi visibility. Phần web/lab bên dưới là bằng chứng lịch sử ClusterProof, không phải ReceiptRail đã triển khai.

**[Mở web công khai](https://clusterproof-devnet-17nov26.anthony-robinson-125.chatgpt.site)** · **[Thử kết nối ví](https://clusterproof-devnet-17nov26.anthony-robinson-125.chatgpt.site/lab/)**. Bản hiện tại là nền Phase3: kiểm genesis devnet và trạng thái account theo yêu cầu; chưa có manifest diff, ProgramData, replay/export hoặc xác minh ABI/source của MVP.

## Trạng thái và bằng chứng

| Phần | Đã có | Còn thiếu |
| --- | --- | --- |
| Nghiên cứu | 16 offline tests, C02 devnet observation và C03 fee-only live quote | Chưa phải MVP/UI hoàn chỉnh |
| Hello lab Phase3 | Anchor1.2.2/SBFv3, generated IDL, 6 runtime tests local và 8 client tests | Deploy devnet, transaction xác nhận, CI xanh |
| Web | React/Vite static công khai; 8 tests/build và desktop/mobile; /lab nhận Core, request mở được | Review A; connect/disconnect thật chưa kiểm vì người dùng chưa có ví devnet sẵn sàng; chưa là MVP |
| Demo video / pitch | Kịch bản học tập và kế hoạch | Video <3 phút, link demo/pitch thật |

Program ID dành cho lab: **2yzxUQEpaeLmgCMhDipwnVL3DHsxez18KcePonqZRiXL** — **chưa deploy** tại checkpoint này. Đây là counter hello từ template Anchor, không là program sản phẩm ClusterProof.

Logs và hashes tại [docs/evidence/phase3](docs/evidence/phase3/); [hello-check-r2.txt](docs/evidence/phase3/hello-check-r2.txt) và [web-build-r4.txt](docs/evidence/phase3/web-build-r4.txt) exit0. [Bằng chứng web](docs/evidence/phase3/web.md) phân biệt RPC live với fixture ví. [CI ở commit web f7a1a43](https://github.com/ntbaoheyhey/dev3pack-hackathon/actions/runs/44127842904) có cả ba jobs bị GitHub Billing & plans chặn trước khi chạy; local pass chưa là CI xanh.

## Chạy local

Máy cần Rust1.100.0, Agave4.1.2, Anchor1.2.2 và platform-tools v1.57; cách cài và lỗi thực tế ở [note003](docs/learning/003-solana-toolchain.md). Node24.22.2 dùng cho research. Các lệnh dưới đây là lịch sử lab/web, có bước cài/build; không tự chạy khi chưa được phép cài thêm. Spike ReceiptRail sẽ có lệnh offline riêng:

~~~sh
node --test research/phase1/spikes.test.mjs research/phase1/fee-mint.test.mjs research/phase1/replay-evidence.test.mjs
ANCHOR_BIN="$HOME/.avm/bin/anchor-1.2.2" bash scripts/check-lab.sh --ci
npm ci --ignore-scripts --no-fund --prefix apps/web
npm test --prefix apps/web
npm run build --prefix apps/web
npm run dev --prefix apps/web
~~~

PATH cần chứa cargo và Agave bin; script pin SBFv3/v1.57, sinh IDL rồi test LiteSVM offline. CI chỉ upload .so/IDL/types; không upload keypair. Deploy là bước riêng chỉ devnet, signer lab ngoài repo. Không chạy template có mainnet fallback.

## Kiến trúc

Thiết kế MVP: input program ID + manifest/IDL optional → validate → RPC devnet/loader-v3 parser → compare fields → report/replay/export. Không cần backend, database hoặc signer trong đường sản phẩm. Codex đã tích hợp baseline apps/web từ Dashboard A; Antigravity kiểm browser/UX và phụ trách UI các phase tiếp theo, Codex phụ trách core/schema/tests. Thiết kế dự phòng tại [ARCHITECTURE ClusterProof](docs/ARCHITECTURE-clusterproof-draft.md); thiết kế ReceiptRail đang được viết tại [ARCHITECTURE](docs/ARCHITECTURE.md).

## Công việc trước sự kiện và trong hackathon

Mốc phân chia là tag **hackathon-start**, sẽ tạo lúc mở màn 27/11/2026; chưa tạo trước sự kiện.

### Trước 27/11/2026

- Học và viết notes; lập RUBRIC v1.2, shortlist, lựa chọn ReceiptRail chính/ClusterProof phụ; các ghi nhận lựa chọn trước đó đã đính chính.
- Spike/parser/evidence read-only và tests; thiết kế IDEA/ARCHITECTURE.
- Cài toolchain, build hello lab từ template Anchor1.2.2 và test; viết CI và xuất bản web nền React/Vite từ template chính thức. Devnet deploy và CI xanh còn mở.
- Các commit và trạng thái cụ thể ở [DEVLOG](docs/DEVLOG.md), [ROADMAP](docs/ROADMAP.md).

### Trong 27–29/11/2026

Chưa có công việc trong sự kiện tại ngày17/11. Ghi tính năng và commit thực khi thực hiện; không gọi code chuẩn bị trước là code trong hackathon.

## Làm việc và license

Codex trưởng nhóm/backend/reviewer; Google Antigravity trợ lý qua [A-queue](docs/tasks/A-queue.md)/[A-done](docs/tasks/A-done.md). Mọi agent học trước, làm sau và ghi lại theo [AGENTS.md](AGENTS.md). Công việc kế tiếp ở [HANDOFF](docs/HANDOFF.md). [MIT](LICENSE).
