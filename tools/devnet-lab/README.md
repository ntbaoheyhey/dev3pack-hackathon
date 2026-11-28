# Client hello lab devnet

Lab riêng, không thuộc core ClusterProof. Chỉ RPC devnet cố định, kiểm genesis trước đọc deployment; dùng generated IDL trong target/idl. Public program/payer/PDA cố định trong client.mjs. Không nhận endpoint/signing target từ tham số.

```sh
npm ci --ignore-scripts --no-fund --prefix tools/devnet-lab
npm test --prefix tools/devnet-lab
npm run inspect --prefix tools/devnet-lab
```

Inspect không đọc keypair hoặc ký; exit2 khi chưa deploy, exit1 khi kiểm thất bại. 8 tests offline kiểm generated instructions/privileges, layout/authority/count, sai cluster và binary/upgrade authority của deployment mô phỏng; không chứng minh transaction devnet thành công.

Sau khi payer có SOL, build/deploy bằng bộ CLI đã được phép; chỉ dùng địa chỉ/keypair lab trong HANDOFF. Program/payer/buffer keypair ở ngoài repo. Truyền --buffer với keypair riêng để CLI không sinh/in recovery phrase của buffer ngẫu nhiên khi lỗi. Không dùng --final, --skip-preflight, mainnet hoặc ví có tài sản thật. Flags đã kiểm qua solana program deploy --help.

Sau deploy, inspect phải xác nhận executable/loader, upgrade authority, deployed bytes khớp binary local (padding0 được chấp nhận), rồi mới chạy:

```sh
npm run smoke --prefix tools/devnet-lab
```

Lệnh --send kiểm payer file0600 ngoài repo, balance/rent, counter authority và limit10, rồi initialize nếu chưa có và increment một lần. Không gọi từ CI. Lưu signature trước broadcast vào journal public; giữ khi timeout để kiểm status/blockhash trước quyết định gửi lại. Không xóa journal để vượt lỗi. Khi xác nhận, lưu logs/slot/fee và kiểm count tăng đúng1; signature đơn lẻ chưa đủ.

Dependency: Anchor core1.2.2/web3.js1.99.0; overrides **toml5.0.1, jayson5.0.0**. Jayson5 giữ HTTP browser-client API web3 dùng, bỏ uuid/stream-json; thay đổi TCP/TLS delimiter không dùng ở lab. Đã kiểm source, full import, TOML parse, 8 tests và RPC inspect; npm audit0 tại17/11/2026. Thử overrides stream-json3.9/uuid11 trước đó làm import server Jayson4 hỏng, nên đã thay cả Jayson sau review API. Không chạy audit fix --force.
