# Evidence Phase 1 — 17/11/2026

Nguồn nghiên cứu và phương pháp: [note 021](../../learning/021-payment-cluster-evidence.md). Script ở [research/phase1](../../../research/phase1). Chỉ Node built-in và RPC devnet read-only; không cài package, signer, keypair hoặc broadcast. JSON ở đây chỉ chứa dữ liệu công khai, không phải keypair.

| Lệnh đã chạy | Artifact | Kết quả / giới hạn |
| --- | --- | --- |
| `node --test research/phase1/spikes.test.mjs` | [spikes-tests-r1.txt](spikes-tests-r1.txt) | Exit 0, 9 nhóm pass; 5.940 inverse cases, 744 brute-force cases. Fixture + arithmetic, chưa kiểm payment on-chain. |
| `node research/phase1/cluster-proof.mjs` | [cluster-1794924487174.json](cluster-1794924487174.json) | Exit 0, 747 ms, slot 523293811; 5 mutations phát hiện. Live read + manifest fixture; baseline OBSERVED_ONLY, ABI UNKNOWN, source NOT_RUN. |
| `node research/phase1/probe-mints.mjs` | [mints-1794924488243.json](mints-1794924488243.json) | Exit 0; mint fee tìm được có transferHook, nên unsupported C03. Không dùng JSON Number để tính raw token u64. |

Ba artifact trên giữ nguyên snapshot lần đầu. Kết quả mở rộng C03:

| Lệnh đã chạy | Artifact | Kết quả / giới hạn |
| --- | --- | --- |
| `node --test research/phase1/spikes.test.mjs research/phase1/fee-mint.test.mjs research/phase1/replay-evidence.test.mjs` | [spikes-tests-r1-final.txt](spikes-tests-r1-final.txt) | 16 pass, 0 fail; arithmetic, parser âm, epoch window và replay raw snapshot. Không thực hiện transfer. |
| `node research/phase1/netpay-live.mjs HxDYFvcXnLuy4VdxXCooUXrch8DZW34oUteQ6N2EFxEr` | [netpay-1794925658391.json](netpay-1794925658391.json), [stdout](netpay-fee-only-r1-final.txt) | Exit 0; 283 ms, slot 523298709, epoch 1211. Target 10000 → gross 10102, fee 102, net 10000 raw units. Mint fee-only; `writesToChain:0`; 5 script hashes đã đối chiếu khớp. |

Không kiểm balance, token-account permission hoặc settlement. Quote có thể stale sau snapshot. JSON giữ raw base64 và nguồn RPC, không phải bằng chứng RPC trung thực. Log discovery có lỗi version/429/403; chạy không đối số vẫn gặp provider chặn, không tự retry. Artifact `netpay-1794925526177.json` là mint unsupported; `netpay-1794925600812.json` có lỗi report ghi đè address đã sửa trong artifact cuối, raw snapshot cũ vẫn dùng cho regression test. Không sửa lịch sử log.

Không dùng tests xanh hoặc snapshot hash để tuyên bố sản phẩm/verified build/Phase 3 đã hoàn tất. Đọc log trước chạy lại; chỉ mở rộng checks khi có code mới, lỗi hoặc nghi vấn chưa xử lý. Provenance mint và nguồn thuật toán nằm ở note 021.
