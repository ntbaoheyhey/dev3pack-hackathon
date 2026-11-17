# Web Phase3 — bằng chứng Codex đã kiểm

Codex · 17/11/2026. Tích hợp Dashboard của A thành React/Vite static, không còn dùng bản nháp Next.js ở cuối file. Đây là baseline môi trường, chưa là ClusterProof MVP.

**[Web công khai](https://clusterproof-devnet-17nov26.anthony-robinson-125.chatgpt.site)** · **[Wallet lab](https://clusterproof-devnet-17nov26.anthony-robinson-125.chatgpt.site/lab/)**.

## Phạm vi đã chạy

Trang chủ chỉ đọc RPC khi người dùng bấm: validate32byte → genesis devnet → account metadata ở confirmed, hiển thị executable/owner/slot/time. Sai cluster dừng; timeout12giây, hủy/thử lại; không sign/send. Chưa đọc ProgramData/binary/authority hoặc so manifest/replay/export/ABI/source.

Wallet lab dùng Wallet Standard qua client1.7.0/react-hooks1.4.1. No-wallet và rediscovery đã kiểm; reject/retry/connect/disconnect kiểm bằng fixture local không keypair, không phải ví extension thật. Fixture không nằm trong dist.

## Source, build và hosting

| Bằng chứng | Kết quả |
| --- | --- |
| Template | solana-foundation/templates@9ec8eba94a98e22434356b6858defbb0e5ada8dc, kit/react-vite; attribution trong apps/web/THIRD_PARTY_NOTICES.md |
| [Install](web-ci-install-r3.txt) / [graph](web-peer-graph-r3.json) | npm ci exit0/audit0; React19.3.1, Vite8.3.8, TypeScript5.9.3 và graph tương thích; giữ TS7 conflict ở r1 |
| [Tests](web-tests-r3.txt) | 8 pass: input/cluster/read-only/provenance/missing/non-executable/malformed/RPC/network/timeout/cancel |
| [Build](web-build-r4.txt) | typecheck/Vite174 modules/static route exit0; giữ lỗi fixture typing r3 |
| [Hosting](web-hosting.json) | public, deployment succeeded; source f5223afb86ec0a8208715eec312e636b19da30ff, version1; project/deployment IDs và archive SHA256 trong JSON |
| [Source match](web-source-match.json) | Code/config/tests trùng commit Sites; README local bổ sung phạm vi SDK warmup sau xuất bản, được ghi riêng trong artifact; không dùng repo HEAD thay source SHA deployment |
| CI | Web job đã viết npm ci/test/build; CI head7d27640 bị Billing & plans chặn trước job, không có run Linux xanh |

## Browser đã quan sát

- Local: input sai không phát RPC; program lab chưa tồn tại tại slot523324017; no-wallet/tìm lại. Fixture đầu từ chối, lần sau chia sẻ địa chỉ, ngắt được.
- Mobile390×844 có scrollWidth390; desktop1280 không overflow. Screenshots: [home mobile](web-mobile-home.jpg), [lab mobile](web-mobile-lab.jpg), [home desktop](web-desktop-home.jpg), [fixture connected](web-wallet-fixture-connected.jpg). Lab mobile chụp trước sửa khoảng trắng heading.
- Public /: [inspection](web-public-inspection.txt), [ảnh](web-public-home.jpg), genesis devnet đúng, account lab chưa có tại slot523326604; /lab/: [no-wallet](web-public-lab.txt), deep link phục vụ được nhờ dist/lab/index.html.
- Console rejection đã thấy là fixture local cố ý từ chối. Log dev server còn ghi SDK cluster warmup Failed to fetch ở local lúc23:13:39; public core read sau đó có kết quả đúng. Không suy mọi RPC/lab warmup đều thành công, cũng không quy lỗi local thành production error. Không có ví extension thật trong browser kiểm thử; T9 giao A kiểm độc lập nếu có ví.

## Cổng còn mở

Web public không đóng toàn Phase3: còn program/transaction devnet xác nhận, CI xanh và kiểm extension thật. Giới hạn quota/CORS/wallet compatibility phải được ghi khi phát sinh; một lần public read không là uptime/SLA. Tài liệu acceptance sản phẩm nằm ở IDEA/ARCHITECTURE, chưa được gọi là đã triển khai.

<details>
<summary>Bản nháp T8 của Antigravity — giữ lịch sử, đã được thay bởi kết quả trên</summary>

# Web Hello Phase 3 (T8)

> Ngày tạo: 2026-11-17

## 1. Mục tiêu
- Xây dựng UI Shell cho ClusterProof.
- Trang lab devnet connect wallet (độc lập).

## 2. Kiến trúc (Phase 3)
- Framework: Next.js (theo khuyến nghị template).
- Wallet: Solana Wallet Adapter.
- UI: Shell cơ bản, ClusterProof dashboard shell.

## 3. Trạng thái
- Đã khởi tạo cấu trúc dự án.
- Đang thiết lập boilerplate web.

</details>
