# ClusterProof — Dev3pack Hackathon 2026

ClusterProof giúp builder kiểm deployment Solana devnet trước khi tích hợp: so observation với manifest đã chọn, chỉ rõ field khác và field chưa đủ bằng chứng. Không cần ví cho sản phẩm core. MATCH không chứng minh ABI tương thích hoặc source đã verified.

Ý tưởng chính đã được chọn; NetPay Check là dự phòng. [IDEA](docs/IDEA.md) và [ARCHITECTURE](docs/ARCHITECTURE.md) đang chờ cổng review/duyệt. Repo có [MIT License](LICENSE), hiện chưa đổi visibility thành public.

## Trạng thái và bằng chứng

| Phần | Đã có | Còn thiếu |
| --- | --- | --- |
| Nghiên cứu | 16 offline tests, C02 devnet observation và C03 fee-only live quote | Chưa phải MVP/UI hoàn chỉnh |
| Hello lab Phase3 | Anchor1.2.2/SBFv3, generated IDL, 6 runtime tests local | Deploy devnet, transaction xác nhận, CI xanh |
| Web | Đã giao A React/Vite static shell và wallet lab riêng | Build/browser/public URL |
| Demo video / pitch | Kịch bản học tập và kế hoạch | Video <3 phút, link demo/pitch thật |

Program ID dành cho lab: **2yzxUQEpaeLmgCMhDipwnVL3DHsxez18KcePonqZRiXL** — **chưa deploy** tại checkpoint này. Đây là counter hello từ template Anchor, không là program sản phẩm ClusterProof.

Logs và hashes tại [docs/evidence/phase3](docs/evidence/phase3/); check local cuối [hello-check-r2.txt](docs/evidence/phase3/hello-check-r2.txt) exit0. CI chưa được xác nhận từ run thật.

## Chạy local

Máy cần Rust1.100.0, Agave4.1.2, Anchor1.2.2 và platform-tools v1.57; cách cài và lỗi thực tế ở [note003](docs/learning/003-solana-toolchain.md). Node24.22.2 dùng cho research. Không cần keypair cho build/test:

~~~sh
node --test research/phase1/spikes.test.mjs research/phase1/fee-mint.test.mjs research/phase1/replay-evidence.test.mjs
ANCHOR_BIN="$HOME/.avm/bin/anchor-1.2.2" bash scripts/check-lab.sh --ci
~~~

PATH cần chứa cargo và Agave bin; script pin SBFv3/v1.57, sinh IDL rồi test LiteSVM offline. CI chỉ upload .so/IDL/types; không upload keypair. Deploy là bước riêng chỉ devnet, signer lab ngoài repo. Không chạy template có mainnet fallback.

## Kiến trúc

Input program ID + manifest/IDL optional → validate → RPC devnet/loader-v3 parser → compare fields → report/replay/export. Chưa cần backend, database hoặc signer trong đường sản phẩm. UI static ở apps/web do Antigravity phụ trách; core/schema/tests do Codex phụ trách. Sơ đồ, threat model, state và contract tại [ARCHITECTURE](docs/ARCHITECTURE.md).

## Công việc trước sự kiện và trong hackathon

Mốc phân chia là tag **hackathon-start**, sẽ tạo lúc mở màn 27/11/2026; chưa tạo trước sự kiện.

### Trước 27/11/2026

- Học và viết notes; lập RUBRIC v1.2, shortlist, chọn ClusterProof/NetPay Check.
- Spike/parser/evidence read-only và tests; thiết kế IDEA/ARCHITECTURE.
- Cài toolchain, build hello lab từ template Anchor1.2.2 và test; chuẩn bị CI/web.
- Các commit và trạng thái cụ thể ở [DEVLOG](docs/DEVLOG.md), [ROADMAP](docs/ROADMAP.md).

### Trong 27–29/11/2026

Chưa có công việc trong sự kiện tại ngày17/11. Ghi tính năng và commit thực khi thực hiện; không gọi code chuẩn bị trước là code trong hackathon.

## Làm việc và license

Codex trưởng nhóm/backend/reviewer; Google Antigravity trợ lý qua [A-queue](docs/tasks/A-queue.md)/[A-done](docs/tasks/A-done.md). Mọi agent học trước, làm sau và ghi lại theo [AGENTS.md](AGENTS.md). Công việc kế tiếp ở [HANDOFF](docs/HANDOFF.md). [MIT](LICENSE).
