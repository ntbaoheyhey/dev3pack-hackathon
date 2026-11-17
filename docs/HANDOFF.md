# Thẻ nhớ — Codex / Prompt 03
- Trạng thái: **đang làm**, Phase **1 / D**; goal vẫn `active`, không có token budget; cập nhật 17/11/2026, Asia/Ho_Chi_Minh.
- Lượt tiếp tục đã mở lại công việc theo goal; bàn giao trước đã xong, không còn giới hạn chỉ ghi bàn giao.
- Vai: **trưởng nhóm**; Antigravity là trợ lý, nhận việc qua A-queue và trả A-done; không chờ trợ lý.
- Mục tiêu: >=3 ý tưởng ĐẠT có bằng chứng → SHORTLIST/PR → người dùng chọn → Phase 1–2; Phase 3 chỉ nếu được phép cài.
- Repo Codex: `/Users/bao/Documents/ChatGPT/dev3pack`, nhánh `work`, origin `https://github.com/ntbaoheyhey/dev3pack-hackathon.git`.
- HEAD đã push: `3a6359b`; spike/evidence đang **untracked, chưa commit**; bảo toàn trước khi pull ở lượt tiếp tục.
- Automation `dev3pack-nh-c-tr-ng-nh-m-m-i-15-ph-t`: đã tạo/view ACTIVE mỗi 15 phút vào chat `01a1e9c8-1b24-7911-91a4-4897fc175566`; chưa quan sát scheduler chạy.
- RUBRIC v1.2: weights P/S/N/F/R/D/V = 20/15/10/20/15/15/5; sàn 3/3/2/3/3/3/2; tổng >=75; F<=3 khi chưa spike; không biến U thành điểm đạt.
- Codex chấm kèm evidence, giáo viên review SHORTLIST khi PR mở; tối đa r0 rồi r1–r3; R/D4 trong PLAN chỉ nói về thiết kế.
- C01/C02/C03 mới là r0: **66/69/64, đều chưa đạt**; A01–A03 là ứng viên thô, nhãn ĐẠT/GOAL_COMPLETE cũ không hợp lệ.
- Sở hữu C: RUBRIC, ideas/codex, cross-scores, SHORTLIST, IDEA, ARCHITECTURE, A-queue; không sửa A-done.
- Đã chạy 9 nhóm test đạt và C02 đọc devnet; C03 mới arithmetic/probe, mint tìm được có transferHook nên unsupported cho quote đầy đủ.
- Tiếp theo: snapshot spike đã review cơ bản, pull work; bổ sung parser mint nhị phân/u64 cho C03, test live có giới hạn rồi viết/chấm r1.
- Chưa chọn chính/dự phòng, chưa hỏi 2 câu chặng E; chưa được cài package/toolchain, tạo ví/keypair hoặc deploy.
- Cấm mainnet, secret trong Git, force-push, merge PR, sửa checkout Antigravity/Taskbar Hero hoặc tự gắn hoàn thành trước gate.
- Sau bước lớn: cập nhật thẻ/note/DEVLOG, commit nhỏ; pull --rebase và merge origin/main đã được cho phép, conflict file chung giữ cả hai bên.

## Còn lại — theo thứ tự khi tiếp tục

- [ ] Kiểm status/HEAD, đọc Thẻ nhớ/AGENTS/ROADMAP/A-done; bảo toàn spike và evidence chưa commit trước fetch/pull. Lượt bàn giao chỉ đọc local, không đồng bộ remote. Review code và log đã lưu; không chạy lại toàn bộ test nếu không có thay đổi, lỗi hoặc nghi vấn mới.
- [ ] Hoàn thiện spike C03: parse mint/epoch không mất chính xác u64 qua JSON Number, reject hook/extension ngoài scope. Tìm mint fee-only bằng số request giới hạn hoặc ghi đúng giới hạn, không tự tạo mint. Chưa nâng F chỉ từ arithmetic đạt và đọc được mint unsupported.
- [ ] Cập nhật note [021](learning/021-payment-cluster-evidence.md), mục lục, evidence summary, DEVLOG/HANDOFF; commit/push nhỏ sau review. Note/mục lục hiện vẫn ghi chuẩn bị spike. C3 verified-build source đã đọc qua GitHub sau timeout, cần ghi lại; Solana Pay website trả 502, cần đọc spec repo thật trước dùng chi tiết chưa xác minh.
- [ ] D1: hoàn thiện >=3 bài theo RUBRIC mục 4: user/workflow, nguồn, alternatives, trust boundary, accounts/PDA/instructions, dependencies D0–D3, threat model/transitions/negative tests, scope/critical path/kill criteria, demo 165s, phân phối và evidence từng điểm. Chấm r1 trung thực; nghiên cứu/sửa/bỏ theo giới hạn r1–r3, không nâng điểm cho đủ ngưỡng.
- [ ] D2: chấm lại cả 3 bài A trong `ideas/cross-scores-codex.md`, ghi giữ/nâng cấp/bỏ. A01 r2 tính đúng **79, không phải 76**, nhưng P4/F4 thiếu evidence nên không đạt chỉ nhờ sửa tổng.
- [ ] E1–E2 khi >=3 bài đạt: viết lại SHORTLIST và dòng lý do thay bản A; kiểm PR hiện có rồi mở/cập nhật `work → main`, không merge. Hỏi đúng 2 câu: **chọn ý tưởng chính/dự phòng** và **đồng ý cài toolchain cho Phase 3 không**.
- [ ] E3 trong lúc chờ: chuẩn bị độc lập mẫu account/PDA, test harness/CI và kế hoạch cài trên giấy; dùng kết quả T5 về template/UX/onboarding. Chỉ ghi bị chặn cần người dùng khi đã hết phần độc lập.
- [ ] Sau lựa chọn: ghi DECISION → IDEA; học/đặt chỗ note trước làm → ARCHITECTURE đầy đủ, giải thích 1 trang và các cổng người dùng/giáo viên. Phase 3 chỉ khi được phép: bộ phiên bản đã chốt, hello devnet, CI/web live, evidence thật.
- [ ] Điểm dừng cuối: NEXT, ROADMAP, DEVLOG, HANDOFF, PR; chỉ đánh xong khi cổng Phase 2 và Phase 3 nếu có thực sự đạt. Không complete goal tại điểm chọn ý tưởng.

## Bằng chứng và công việc đang dở

**Git/điều phối:** đã push `1dd0ab4` (automation), `fde1167` (vai trò/RUBRIC/HANDOFF), `bd2fc42` (đặt chỗ 021/giao việc), `3a6359b` (021/ba bài r0/findings). Commit cuối là bản rebase của `700b641` sau cập nhật A tại `641939d`; conflict DEVLOG giữ cả hai bên. Lần query gần nhất không có PR mở; cần kiểm lại trước khi tạo. Không tạo automation trùng hoặc hủy lịch khi chỉ bàn giao.

**File chưa commit, giữ nguyên:** `research/phase1/{rpc,cluster-proof,netpay,spikes.test,probe-mints}.mjs` và ba file evidence dưới đây. Không có process/tool đang chạy được biết tại điểm bàn giao; lượt ghi bàn giao không khởi chạy spike hay test mới.

| Bằng chứng đã lưu | Kết quả và giới hạn |
| --- | --- |
| [spikes-tests-r1.txt](evidence/phase1/spikes-tests-r1.txt) — `node --test research/phase1/spikes.test.mjs` | Exit 0 ở lượt trước; đọc lại log tại bàn giao: **9 pass, 0 fail**, gồm 5.940 case so inverse upstream và brute force miền nhỏ. Đây là fixture/arithmetic, không phải payment settlement. |
| [cluster-1794924487174.json](evidence/phase1/cluster-1794924487174.json) — `node research/phase1/cluster-proof.mjs` | Exit 0; Token-2022 devnet, **747 ms**, slot **523293811**, ProgramData **711053 bytes**; phát hiện 5 manifest mutations. Baseline từ cùng RPC là `OBSERVED_ONLY`, ABI `UNKNOWN`, source verification `NOT_RUN`; hash payload có padding không phải verified-build hash. |
| [mints-1794924488243.json](evidence/phase1/mints-1794924488243.json) — `node research/phase1/probe-mints.mjs` | Exit 0; tối đa 8 transaction/12 mint. Mint `GE6q1pL6TjYkrc9jwpdCJAKqZDmAscVR7D9dV7MmXPpd` có fee 100 bps, cap 1000000000000, old/new epoch 1193 **và transferHook**; ngoài scope C03. **Chưa có live quote mint/epoch được hỗ trợ thành công.** |

`rpc.mjs` cố định devnet và allowlist sáu RPC read-only; `cluster-proof.mjs` kiểm loader v3/ProgramData/manifest; `netpay.mjs` dùng BigInt/u64, ceil/cap và binary search. Chưa cài gì, không signer, không broadcast, không chain writes. Các script chưa được review xong; giữ riêng kết quả fixture, live read và sản phẩm hoàn chỉnh.

| Ý tưởng r0 | P/S/N/F/R/D/V | Tổng | Giới hạn cần giữ |
| --- | --- | --- | --- |
| [C01 ReceiptRail](ideas/codex/01-receipt-rail.md) | 4/4/3/3/3/3/2 | 66 | Invoice state/Paid atomic, không close/recreate mất dấu; custom program chưa chạy, chưa chứng minh x402 interoperability. |
| [C02 ClusterProof](ideas/codex/02-cluster-proof.md) | 4/4/3/3/3/4/2 | 69 | Kiểm cluster/program/ProgramData theo manifest; ABI/source compatibility vẫn UNKNOWN, không thay verified builds. |
| [C03 NetPay Check](ideas/codex/03-netpay-check.md) | 4/4/2/3/3/3/2 | 64 | Quote gross/net integer theo cap/epoch, không ký/gửi; quote không phải settlement, extension ngoài scope phải unsupported. |

## Trợ lý và chất lượng nguồn

- Đã giao T2 dùng blog kết quả chính thức thay profile Colosseum bị chặn; T4 >=3 alternatives mỗi nhóm, có bằng chứng phủ định; T5 template/UX Phase 2/5 trên giấy; T6 evidence đúng ba workflow, >=2 nguồn độc lập/nhóm.
- A-done local tại bàn giao: T1/T2 đang làm, T3 xong, T4/T5 mới; bảng ghi T6 đang làm nhưng dòng cuối báo xong. **Đọc/kiểm nội dung T6 trước khi dùng chấm**, không tự sửa A-done.
- T3 chưa dùng chấm: Reddit ID `1f66666` redirect sang bài không liên quan; `1f44444` timeout nên chỉ ghi chưa xác minh. Finding đã ở STOP-CAUSES K4/note 021/queue; không suy mọi nguồn A đều sai.
- x402 đã có payment-identifier/fingerprint/cache và retry; không lấy cache làm novelty C01. Raydium guide rounding/epoch mâu thuẫn Token-2022 upstream; dùng source upstream. Jupiter Lend README xác nhận devnet May 2025 lệch IDL hiện tại. Link và blob SHA ở note 021.

## Bị chặn

Chưa cần người dùng quyết định ở bước hiện tại. Goal đã tiếp tục sau lượt ghi bàn giao. Quyền cài và lựa chọn sản phẩm sẽ hỏi ở chặng E sau khi có shortlist review được.

## Tham chiếu

- [Prompt 03](../prompts/03-codex-lead.md), [RUBRIC v1.2](ideas/RUBRIC.md), [ROADMAP](ROADMAP.md), [A-queue](tasks/A-queue.md), [A-done](tasks/A-done.md).
- Lịch sử trước Prompt 03 ở [archive](archive/HANDOFF-history-codex.md), không đọc thành việc hiện hành. Không mở lại việc chuyển repo đã hoàn tất.
- Công cụ: `web__run` từng trả `route_not_found`; connector dùng được là `mcp__codex_apps__search_service_web_run` (`system2_search_query`), GitHub `fetch_file`/`fetch_issue`/`fetch_issue_comments`. Ưu tiên `structuredContent` để tránh output lặp.
