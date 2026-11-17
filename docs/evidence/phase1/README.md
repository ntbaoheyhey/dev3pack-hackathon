# Evidence Phase 1 — 17/11/2026

Nguồn nghiên cứu và phương pháp: [note 021](../../learning/021-payment-cluster-evidence.md). Script ở [research/phase1](../../../research/phase1). Chỉ Node built-in và RPC devnet read-only; không cài package, signer, keypair hoặc broadcast. JSON ở đây chỉ chứa dữ liệu công khai, không phải keypair.

| Lệnh đã chạy | Artifact | Kết quả / giới hạn |
| --- | --- | --- |
| `node --test research/phase1/spikes.test.mjs` | [spikes-tests-r1.txt](spikes-tests-r1.txt) | Exit 0, 9 nhóm pass; 5.940 inverse cases, 744 brute-force cases. Fixture + arithmetic, chưa kiểm payment on-chain. |
| `node research/phase1/cluster-proof.mjs` | [cluster-1794924487174.json](cluster-1794924487174.json) | Exit 0, 747 ms, slot 523293811; 5 mutations phát hiện. Live read + manifest fixture; baseline OBSERVED_ONLY, ABI UNKNOWN, source NOT_RUN. |
| `node research/phase1/probe-mints.mjs` | [mints-1794924488243.json](mints-1794924488243.json) | Exit 0; mint fee tìm được có transferHook, nên unsupported C03. Không dùng JSON Number để tính raw token u64. |

Ba artifact trên giữ nguyên snapshot lần đầu. C03 chưa có live quote mint được hỗ trợ. Không dùng tests xanh hoặc snapshot hash để tuyên bố sản phẩm/verified build/Phase 3 đã hoàn tất. Đọc log trước chạy lại; chỉ mở rộng checks khi có code mới, lỗi hoặc nghi vấn chưa xử lý.
