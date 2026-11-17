# Thẻ nhớ — Codex / Prompt 03
- Trạng thái: **đang làm**, Phase **1 / D**; goal vẫn `active`, không có token budget; cập nhật 17/11/2026, Asia/Ho_Chi_Minh.
- Goal đã được tiếp tục sau lượt bàn giao; đang review/lưu spike rồi đồng bộ kết quả A để hoàn thiện r1.
- Vai: **trưởng nhóm**; Antigravity là trợ lý, nhận việc qua A-queue và trả A-done; không chờ trợ lý.
- Mục tiêu: >=3 ý tưởng ĐẠT có bằng chứng → SHORTLIST/PR → người dùng chọn → Phase 1–2; Phase 3 chỉ nếu được phép cài.
- Repo Codex: `/Users/bao/Documents/ChatGPT/dev3pack`, nhánh `work`, origin `https://github.com/ntbaoheyhey/dev3pack-hackathon.git`.
- HEAD đã push: `9fff38e`; remote-tracking `origin/work` là `2506180`, local sau 2 commit; phần mở rộng C03/review A **chưa commit**.
- Automation `dev3pack-nh-c-tr-ng-nh-m-m-i-15-ph-t`: đã view/đọc config lại, ACTIVE mỗi 15 phút vào chat `01a1e9c8-1b24-7911-91a4-4897fc175566`, đúng prompt; chưa quan sát scheduler gửi heartbeat.
- RUBRIC v1.2: weights P/S/N/F/R/D/V = 20/15/10/20/15/15/5; sàn 3/3/2/3/3/3/2; tổng >=75; F<=3 khi chưa spike; không biến U thành điểm đạt.
- Codex chấm kèm evidence, giáo viên review SHORTLIST khi PR mở; tối đa r0 rồi r1–r3; R/D4 trong PLAN chỉ nói về thiết kế.
- C01/C02/C03 vẫn r0: **66/69/64, đều chưa đạt**; review-C của A01/A02/A03: **42/40/37**, chưa commit; chưa chấm r1 Codex.
- Sở hữu C: RUBRIC, ideas/codex, cross-scores, SHORTLIST, IDEA, ARCHITECTURE, A-queue; không sửa A-done.
- Kết quả lưu: **16 test đạt**; C02 live read; C03 có **fee-only live quote** target 10000 → gross 10102, fee 102; không phải settlement.
- Tiếp theo: bảo toàn file chưa commit, cập nhật note/catalog/queue; commit rồi pull/rebase work, đọc kết quả A mới, hoàn thiện/chấm r1.
- Chưa chọn chính/dự phòng, chưa hỏi 2 câu chặng E; chưa được cài package/toolchain, tạo ví/keypair hoặc deploy.
- Cấm mainnet, secret trong Git, force-push, merge PR, sửa checkout Antigravity/Taskbar Hero hoặc tự gắn hoàn thành trước gate.
- Sau bước lớn: cập nhật thẻ/note/DEVLOG, commit nhỏ; pull --rebase và merge origin/main đã được cho phép, conflict file chung giữ cả hai bên.

## Còn lại — theo thứ tự khi tiếp tục

- [ ] Kiểm status/HEAD, đọc Thẻ nhớ/AGENTS/ROADMAP/hàng đợi; bảo toàn toàn bộ file chưa commit trước fetch/pull. Lượt bàn giao này chỉ đọc local, không đồng bộ remote. Review diff/log đã lưu; không chạy lại tests hoặc RPC khi chưa có thay đổi, lỗi hoặc nghi vấn mới.
- [ ] Cập nhật note [021](learning/021-payment-cluster-evidence.md), mục lục và [catalog evidence](evidence/phase1/README.md) với **16 test/live quote cuối** cùng giới hạn; ghi nguồn/đối thủ Ryntra và Solana Foundation Pay bên dưới. C03 parser/live đã làm, không mở lại việc tìm mint. T7 phải ghi C đã tìm được mint; bổ sung Ryntra/Pay vào T4, giữ T4/T5 và kiểm T6 sau đồng bộ.
- [ ] Stage đường dẫn cụ thể sau review, commit nhỏ để giữ code/evidence; fetch, pull --rebase origin work, merge origin/main nếu cần, push work theo quyền đã có. Remote-tracking `2506180` có ba file A mới: HANDOFF-antigravity, candidate-pain-evidence, A-done; **chưa đọc nội dung mới**, phải đọc trước dùng. Không sửa A-done thay trợ lý; conflict file chung giữ cả hai bên.
- [ ] D1: hoàn thiện >=3 bài theo RUBRIC mục 4: user/workflow, nguồn, alternatives, trust boundary, accounts/PDA/instructions, dependencies D0–D3, threat model/transitions/negative tests, scope/critical path/kill criteria, demo 165s, phân phối và evidence từng điểm. Chấm r1 trung thực; nghiên cứu/sửa/bỏ theo giới hạn r1–r3, không nâng điểm cho đủ ngưỡng.
- [ ] D2: rà lại bản `ideas/cross-scores-codex.md` đã viết và phép tính, bổ sung evidence mới nếu phù hợp, rồi commit. Review-C hiện **42/40/37**, đều chưa đạt; không reset r0–r2. A01 giữ vấn đề để nghiên cứu sau, không shortlist; A02/A03 bỏ vòng chọn hiện tại.
- [ ] E1–E2 khi >=3 bài đạt: viết lại SHORTLIST và dòng lý do thay bản A; kiểm PR hiện có rồi mở/cập nhật `work → main`, không merge. Hỏi đúng 2 câu: **chọn ý tưởng chính/dự phòng** và **đồng ý cài toolchain cho Phase 3 không**.
- [ ] E3 trong lúc chờ: chuẩn bị độc lập mẫu account/PDA, test harness/CI và kế hoạch cài trên giấy; dùng kết quả T5 về template/UX/onboarding. Chỉ ghi bị chặn cần người dùng khi đã hết phần độc lập.
- [ ] Sau lựa chọn: ghi DECISION → IDEA; học/đặt chỗ note trước làm → ARCHITECTURE đầy đủ, giải thích 1 trang và các cổng người dùng/giáo viên. Phase 3 chỉ khi được phép: bộ phiên bản đã chốt, hello devnet, CI/web live, evidence thật.
- [ ] Điểm dừng cuối: NEXT, ROADMAP, DEVLOG, HANDOFF, PR; chỉ đánh xong khi cổng Phase 2 và Phase 3 nếu có thực sự đạt. Không complete goal tại điểm chọn ý tưởng.

## Bằng chứng và công việc đang dở

**Git/điều phối:** HEAD `9fff38e6f0140e682256281b39001e9e8958d918` (`test(research): preserve read-only cluster and fee spike evidence`) đã push ở lượt trước. Các commit trước: `3a6359b` (bản rebase của `700b641`), `bd2fc42`, `fde1167`, `1dd0ab4`. Remote-tracking đã fetch ở lượt trước là `250618084bd6f48f5cbc47d3fba6741ff6aec675`, chưa pull; `origin/main` local là `b9c91b0`. Lượt bàn giao không fetch/pull/commit/push. Chưa mở PR trong phần công việc đã quan sát; kiểm lại trước tạo. Không tạo automation trùng hoặc hủy lịch khi chỉ bàn giao.

**File chưa commit, giữ nguyên:** trước lượt bàn giao có 4 tracked file sửa (`docs/learning/021-payment-cluster-evidence.md`, `docs/tasks/A-queue.md`, `research/phase1/cluster-proof.mjs`, `research/phase1/rpc.mjs`) cùng `docs/ideas/cross-scores-codex.md`, 4 module/test mới (`fee-mint.mjs`, `fee-mint.test.mjs`, `netpay-live.mjs`, `replay-evidence.test.mjs`) và các JSON/log C03 dưới `docs/evidence/phase1/`. Lượt này chỉ bổ sung HANDOFF và DEVLOG; không commit thay phần code còn cần review. `netpay.mjs`, `spikes.test.mjs`, `probe-mints.mjs` và evidence lần đầu đã có trong `9fff38e`, không còn là untracked. Không có process/tool đang chạy được biết; fetch session `95276` ở lượt trước đã exit 0.

| Bằng chứng đã lưu | Kết quả và giới hạn |
| --- | --- |
| [spikes-tests-r1-final.txt](evidence/phase1/spikes-tests-r1-final.txt) — `node --test research/phase1/spikes.test.mjs research/phase1/fee-mint.test.mjs research/phase1/replay-evidence.test.mjs` | Exit 0 ở lượt nghiên cứu trước; đọc lại log tại bàn giao: **16 pass, 0 fail**, gồm 5.940 inverse cases, 744 brute-force cases, parser negatives, epoch checks và replay raw devnet snapshot. Không compile Rust hoặc thực hiện transfer. Log 9 test lần đầu vẫn giữ nguyên. |
| [cluster-1794924487174.json](evidence/phase1/cluster-1794924487174.json) — `node research/phase1/cluster-proof.mjs` | Exit 0; Token-2022 devnet, **747 ms**, slot **523293811**, ProgramData **711053 bytes**; phát hiện 5 manifest mutations. Baseline từ cùng RPC là `OBSERVED_ONLY`, ABI `UNKNOWN`, source verification `NOT_RUN`; hash payload có padding không phải verified-build hash. |
| [mints-1794924488243.json](evidence/phase1/mints-1794924488243.json) — `node research/phase1/probe-mints.mjs` | Snapshot discovery lần đầu: mint `GE6q1pL6TjYkrc9jwpdCJAKqZDmAscVR7D9dV7MmXPpd` có fee **và transferHook**, ngoài scope. Lần chạy cuối vẫn từ chối đúng `unsupported_extensions:14`. |
| [netpay-1794925658391.json](evidence/phase1/netpay-1794925658391.json), [stdout cuối](evidence/phase1/netpay-fee-only-r1-final.txt) — `node research/phase1/netpay-live.mjs HxDYFvcXnLuy4VdxXCooUXrch8DZW34oUteQ6N2EFxEr` | Exit 0; **283 ms**, slot **523298709**, epoch **1211**. Mint fee-only: target **10000**, gross **10102**, fee **102**, net **10000** raw units; decimals 6, fee 100 bps, cap 1000000000000, old/new epoch 1083. `writesToChain:0`; quote không kiểm token-account permission, balance hoặc settlement. |

`rpc.mjs` cố định devnet, allowlist **7 RPC read-only** (thêm getProgramAccounts), giới hạn response 6 MB. `cluster-proof.mjs` chỉ đổi export `bytesOf` để dùng chung. `fee-mint.mjs` đọc base64/TLV trực tiếp, BigInt/u64; kiểm owner/initialized/COption/padding/type/TLV length và duplicate/fee schedule; reject extension ngoài scope. `netpay-live.mjs` đọc epoch trước/sau mint, yêu cầu safe integers, slot đơn điệu và không đổi epoch. Lượt bàn giao đã đối chiếu **5 script hashes khớp** artifact cuối; mint data hash `d115098b26d4231b8f61a66d80b39b31508b7c0dbdf6bcade810f0f0d4411086`. Không cài gì, không signer/broadcast; chưa phải sản phẩm hoàn chỉnh.

**Giữ lịch sử lỗi:** discovery transaction từng trả RPC `-32015` (yêu cầu version 1), rồi HTTP 429; filtered getProgramAccounts trả HTTP 403. Chạy `netpay-live.mjs` không đối số vẫn đi qua discovery bị chặn; khi cần kiểm lại dùng explicit mint nêu trên. Mint pmAMM `4F6PM96JJxngmHnZLBh9n58RH4aTVNWvDs2nuwrT5BP7` có extension ngoài scope: artifact `netpay-1794925526177.json`, exit 2. Snapshot positive đầu `netpay-1794925600812.json` có lỗi report `{mint, ...quote}` ghi đè address bằng config (raw snapshot vẫn giữ địa chỉ); đã đổi field thành `mintConfig`, thêm regression replay test và chạy lại thành artifact cuối. Không xóa/sửa snapshot cũ.

| Ý tưởng r0 | P/S/N/F/R/D/V | Tổng | Giới hạn cần giữ |
| --- | --- | --- | --- |
| [C01 ReceiptRail](ideas/codex/01-receipt-rail.md) | 4/4/3/3/3/3/2 | 66 | Invoice state/Paid atomic, không close/recreate mất dấu; custom program chưa chạy, chưa chứng minh x402 interoperability. |
| [C02 ClusterProof](ideas/codex/02-cluster-proof.md) | 4/4/3/3/3/4/2 | 69 | Kiểm cluster/program/ProgramData theo manifest; ABI/source compatibility vẫn UNKNOWN, không thay verified builds. |
| [C03 NetPay Check](ideas/codex/03-netpay-check.md) | 4/4/2/3/3/3/2 | 64 | Quote gross/net integer theo cap/epoch, không ký/gửi; quote không phải settlement, extension ngoài scope phải unsupported. |

## Trợ lý và chất lượng nguồn

- Đã giao T2 dùng blog kết quả chính thức thay profile Colosseum bị chặn; T4 >=3 alternatives mỗi nhóm, có bằng chứng phủ định; T5 template/UX Phase 2/5 trên giấy; T6 evidence đúng ba workflow, >=2 nguồn độc lập/nhóm. Queue local đã trả T6 vì URL sai/thiếu nguồn và thêm T7 tìm mint; nay **C tự tìm được fee-only mint**, cần cập nhật T7 để tránh trùng việc.
- Remote-tracking `2506180` đã có kết quả mới trong `docs/HANDOFF-antigravity.md`, `docs/data/candidate-pain-evidence.md`, `docs/tasks/A-done.md`; chưa đọc nội dung mới. Trạng thái A-done local cũ không đại diện kết quả remote. **Đọc/kiểm nội dung T6 trước khi dùng chấm**, không tự sửa A-done.
- T3 chưa dùng chấm: Reddit ID `1f66666` redirect sang bài không liên quan; `1f44444` timeout nên chỉ ghi chưa xác minh. Finding đã ở STOP-CAUSES K4/note 021/queue; không suy mọi nguồn A đều sai.
- x402 đã có payment-identifier/fingerprint/cache và retry; không lấy cache làm novelty C01. Raydium guide rounding/epoch mâu thuẫn Token-2022 upstream; dùng source upstream. Jupiter Lend README xác nhận devnet May 2025 lệch IDL hiện tại. Link và blob SHA ở note 021.
- Cross-scores đã sửa phép tính lịch sử: A01 r2 **79** thay 76; A02 r0/r1 **53/67** thay 58/70; A03 r0/r1 **53/69** thay 58/70. Sửa tổng không chứng minh điểm đầu vào; review-C không reset lịch sử vòng sửa.

**Nguồn đã đọc ở lượt nghiên cứu trước, cần đưa vào note/ledger/comparison:**

- [Ryntra SDK README](https://github.com/ryntra-io/ryntra-solana-evidence/blob/main/packages/solana-evidence-sdk/README.md), blob `eeab3768aabd819e42d75feaadeb4de5e5a66586`: inspect mint, fee/net preview, hooks, policy và receipt verification; đối thủ trực tiếp C03. README có `amountRaw`; chưa xác minh toàn repo có/không target-net inverse, **không tăng N bằng giả định đối thủ thiếu tính năng**.
- [Solana Foundation Pay README](https://github.com/solana-foundation/pay), blob `28c35e34cb5f053343937efe9b5862769fae96a0`: CLI x402/MPP, wallet authorization/debugger đã có. [Solana Pay spec v1.1](https://solana.com/docs/tools/solana-pay/specification/version1-1) và [verified builds](https://solana.com/docs/programs/verified-builds) đã đọc được trên trang chính thức; ghi đè nhận định timeout/502 còn lỗi thời trong note. Reference không nhất thiết unique, giúp tìm giao dịch, không tự enforce invoice chỉ trả một lần.
- [Kora advisory](https://github.com/solana-foundation/kora/security/advisories/GHSA-725g-w329-g7qr): affected **2.2.0**, patched field **None**; không suy mọi phiên bản hiện hành còn lỗi. Shopify 2019, x402 #452 (EVM, open), mismatch/rounding reports 2024 chỉ chứng minh case lịch sử, không thành tỷ lệ lỗi hiện tại.
- Mint provenance: [Day 50](https://github.com/gopichandchalla16/100-days-of-solana/blob/main/day-50/README.md), blob `22ee400f239112cd17631fdef936c7d4260efc80`; [Day 53](https://github.com/gopichandchalla16/100-days-of-solana/blob/main/day-53/README.md), blob `c8c67020ecb5cf85fbc6a7a8c7dda7919daf6535`. Chỉ lấy địa chỉ rồi kiểm raw devnet, không chạy lệnh tạo token từ nguồn.

## Bị chặn

Chưa có blocker cần người dùng ở bước hiện tại; goal đã tiếp tục sau bàn giao. Quyền cài và lựa chọn sản phẩm sẽ hỏi đúng hai câu ở chặng E sau khi có shortlist review được. LICENSE MIT đã xác nhận ở lượt trước; visibility repo chưa được xác minh từ kết quả đã đọc.

## Tham chiếu

- [Prompt 03](../prompts/03-codex-lead.md), [RUBRIC v1.2](ideas/RUBRIC.md), [ROADMAP](ROADMAP.md), [A-queue](tasks/A-queue.md), [A-done](tasks/A-done.md).
- Lịch sử trước Prompt 03 ở [archive](archive/HANDOFF-history-codex.md), không đọc thành việc hiện hành. Không mở lại việc chuyển repo đã hoàn tất.
- Công cụ: `web__run` từng trả `route_not_found`; connector dùng được là `mcp__codex_apps__search_service_web_run` (`system2_search_query`), GitHub `fetch_file`/`fetch_issue`/`fetch_issue_comments`. Ưu tiên `structuredContent` để tránh output lặp.
