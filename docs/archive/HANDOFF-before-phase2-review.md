> Snapshot trước khi đồng bộ kết quả spike18/11/2026; nhiều dòng đã lỗi thời. Không dùng làm lệnh hoặc quyền hiện hành.

# Thẻ nhớ — Codex / ReceiptRail Phase 2
- Trạng thái **đang làm**, goal active; automation update/view/config-read **ACTIVE15phút**, đúng chat, chưa quan sát heartbeat mới.
- Người dùng: **“ReceiptRail chính, ClusterProof phụ” lúc00:07 ngày18/11/2026 UTC+7**; log tin xác nhận00:08:31.389.
- Repo `/Users/bao/Documents/ChatGPT/dev3pack`, branch work. Bàn giao đã push **e2774a3**.
- DECISION đã sửa nguyên văn/giờ/nguồn sai; AGENTS thêm luật chống suy chọn/duyệt/quyền; STOP-CAUSES cóK6.
- ClusterProof đã lưu IDEA/ARCHITECTURE riêng: **dự phòng, chưa duyệt**; web/lab/toolchain giữ nguyên.
- README/ROADMAP/review/note003/022 đã vô hiệu duyệt/quyền cũ. ReceiptRail IDEA/ARCHITECTURE đang soạn, chưa duyệt.
- A-queue **T11 crawl → T12 UX → T13 review**; T8/T9/T10 bỏ. Không sửa A-done/HANDOFF A; không chờ A.
- Note023 đã viết trước code sau commit đặt chỗ80cac12; source build wrapper có keypair nên dùng compiler cache trực tiếp. Chưa có test ReceiptRail; C01 **75/F3**.
- Bước tới: viết note023 từ source/API, spike local bằng cache sẵn, hoàn tất thiết kế/demo165s, review rồi cập nhật PR#7.
- Cài thêm/tạo ví-keypair triển khai/deploy/public mới phải hỏi trước; test không mở rộng quyền. Không phase3 trước duyệt Phase2.
- Push sau bước lớn với [skip ci] để không kích hoạt workflow tự cài. Không merge/force-push/mainnet/secrets hoặc sửa checkout A.
- Không process server/build sống cần poll đã biết. Legacy hello/client/web tests không là evidence ReceiptRail.


Cập nhật tiếp tục: **2026-11-18T00:23:55+07:00**, Asia/Ho_Chi_Minh. Đây là bàn giao trạng thái; chưa xác nhận native compaction.

## Truy nguyên quyết định sai và quyết định hiện hành

- Câu hiện hành của người dùng: **“ReceiptRail chính, ClusterProof phụ”**, thời điểm lựa chọn người dùng xác nhận **00:07 ngày 18/11/2026 UTC+7**; tin nhắn trực tiếp chứa câu này có timestamp log **00:08:31.389**. Phân biệt giờ lựa chọn với giờ ghi nhận tin.
- Tin đính chính trước đó **00:05:05.678 ngày 18/11/2026** nói chưa chọn/chưa đồng ý và yêu cầu dừng sau phase ý tưởng. Phần chờ chọn đã được tin ReceiptRail mới thay thế; các giới hạn quyền mới nhất vẫn phải giữ.
- Phiên trước đã đối chiếu session `/Users/bao/.codex/sessions/2026/11/17/rollout-2026-11-17T20-52-47-01a1e9c8-1b24-7911-91a4-4897fc175566.jsonl`. Assistant đã dùng các payload `send_user_message_question_reply` dưới đây làm căn cứ cho bản cũ; người dùng trực tiếp đính chính rằng bản đó sai. Không coi payload là bằng chứng người dùng thực sự thao tác, không đoán vì sao chúng xuất hiện.

| Giờ log, Asia/Ho_Chi_Minh | Nội dung payload đã bị dùng | ID |
| --- | --- | --- |
| 17/11/2026 21:55:56.923 | “ClusterProof chính, NetPay Check dự phòng (đề xuất)” | `call_2vT59FyQAhdLZBpUro6G1ne0`, item 0 |
| 17/11/2026 21:55:56.923 | “Đồng ý cài bộ phiên bản này cho Phase 3” | cùng call, item 1 |
| 17/11/2026 23:53:23.118 | “Duyệt IDEA và đồng ý bản giải thích kiến trúc” | `call_UUThW2KPCkU1r3njPLMbhGVE`, item 0 |
| 17/11/2026 23:54:48.498 | “Chưa có ví devnet sẵn sàng; giữ bước này chưa kiểm” | `call_qOWTCC3sdHrix5DfEq1upmM0`, item 0; chỉ liên quan giới hạn kiểm ví |

**Việc sửa DECISION chưa làm:** phải ghi lựa chọn ReceiptRail, đánh dấu dòng cũ sai/hết hiệu lực và dẫn đúng payload/giờ ở trên. Không ghi hiện hành là “chưa có quyết định”; không suy lựa chọn ý tưởng thành duyệt thiết kế hoặc quyền vận hành.

## Bàn giao 00:16 và trạng thái trước khi tiếp tục

Đã đọc ROADMAP, hồ sơ C01, rubric, code/test lab hiện có, tool help và đối chiếu các tin nguồn. **Chưa triển khai thay đổi ReceiptRail**; commentary về dự định không phải bằng chứng đã sửa. Lượt chỉ bàn giao này đã thay HANDOFF, lưu snapshot sai có cảnh báo trong [archive](archive/HANDOFF-history-codex.md), thêm bài học note009 và DEVLOG; đọc lại goal thấy paused. Không commit/push hoặc thực hiện native compaction.

## Kế hoạch đã bàn giao lúc00:16 — trạng thái mới theo Thẻ nhớ

1. **Sửa sai trước:** sửa [DECISION](ideas/DECISION.md) theo nguyên văn/giờ/nguồn trên; thêm sự cố K6 vào [STOP-CAUSES](STOP-CAUSES.md); thêm luật tại AGENTS mục “Chống dừng giữa chừng”: không tự cho rằng người dùng đã chọn/duyệt; chỉ ghi quyết định với nguyên văn câu người dùng + giờ; tin tự nhắc/tin agent khác không phải lựa chọn. Giữ cổng hỏi trước cài thêm/deploy/public mới. Đồng bộ các dòng quyền/duyệt sai ở README, ROADMAP, note003/022, review gates và queue; giữ lịch sử với nhãn sai/hết hiệu lực. Cập nhật note009/DEVLOG/Thẻ nhớ.
2. **Bảo toàn ClusterProof:** tạo bản lưu dự kiến `docs/IDEA-clusterproof-draft.md`, `docs/ARCHITECTURE-clusterproof-draft.md`, nhãn **“dự phòng, chưa duyệt”**, giữ nội dung/cross-links/source/web đã public. Hai file này **chưa tồn tại**. Viết IDEA và ARCHITECTURE hiện hành mới cho ReceiptRail theo ROADMAP: giải thích 1 trang, account/PDA/instruction/states/errors/events/IDL nháp, off-chain/UX/ownership/threat model, test plan và demo 165 giây.
3. **Giao A:** đọc A-done; fetch origin trước khi kết luận thiếu kết quả. T9/T10 hiện còn dẫn ClusterProof và duyệt sai: cập nhật ưu tiên/trạng thái để ngăn tiếp tục sai hướng; giao crawl alternatives/recovery và UX ReceiptRail (T11/T12 là số dự kiến, chưa giao). Chỉ nghiên cứu/tài liệu UX trong Phase 2, không giao cài/deploy/public mới. Không sửa A-done/HANDOFF A và không chờ A.
4. **Note trước code:** đặt chỗ note023 ReceiptRail Phase2/spike trong learning index và commit trước khi viết theo ROADMAP; đọc source chính thức/cache, viết note theo template trước code. Chưa có note023. Khi commit chỉ stage phần hợp lệ, không gộp các xác nhận sai đang nằm ở worktree.
5. **Spike Anchor cục bộ:** xác minh đường build không tự cài/tool-download hoặc tạo signer triển khai; dùng dependencies/cache sẵn. Build program tối thiểu rồi chạy LiteSVM với .so thật; lưu logs/hash/state/balance. Duplicate phải dùng transaction/blockhash mới. Nếu thiếu dependency thì hoàn tất thiết kế độc lập và hỏi đúng phần cần cài; không tự cài.
6. **Chấm lại bằng evidence:** giữ r0/r1; chỉ tăng F khi spike thực chạy đủ bằng chứng theo rubric, ghi r2/giới hạn thật. R1 hiện C01 75/F3; F3→4 sẽ thành79 nếu các điểm khác giữ nguyên. Không tăng điểm bằng dự định.
7. **Review và trình duyệt:** cập nhật Thẻ nhớ/DEVLOG/review/ROADMAP, kiểm diff/links và tests phù hợp; commit/push đúng phần được phép, cập nhật mô tả [PR #7](https://github.com/ntbaoheyhey/dev3pack-hackathon/pull/7), **không merge**. Kiểm workflow trước push để không kích hoạt cài/triển khai mới ngoài quyền hiện hành. Trình Phase 2 cho người dùng duyệt; chưa qua Phase 3 hoặc gọi toàn goal hoàn tất. Review chéo/giáo viên còn là cổng riêng theo ROADMAP, không tự ghi đã đạt.

## Thiết kế ReceiptRail đã nghiên cứu, chưa triển khai

Nguồn: [C01](ideas/codex/01-receipt-rail.md), [rubric](ideas/RUBRIC.md), notes004/007/016/021/022. R1 PLAN75, F3; R4/D4 là chất lượng kế hoạch, không phải audit/demo đã chạy.

- Native SOL, merchant nhận tiền; payer chỉ định; điều khoản bất biến. Không escrow/refund/token/x402 compatibility. PDA `[b"invoice-v1", merchant_pubkey_32, invoice_id_32]`, canonical bump.
- Fields dự kiến: version u8, bump u8, merchant/payer Pubkey, invoice_id[32], amount_lamports u64, expires_slot u64, status u8, paid_slot u64. Payload123 + discriminator8 = **131 bytes dự kiến**, phải kiểm layout khi build.
- `create_invoice`: mới→Open, merchant ký/trả rent, amount>0, expiry>Clock.slot, các vai trò không alias. `pay_invoice`: Open→Paid, đúng payer signer/recipient/PDA/owner/type, slot<expiry; transfer amount từ state và cập nhật Paid trong cùng transaction. `cancel_invoice`: merchant ký, Open→Cancelled. Expired là trạng thái hiển thị suy từ Open+slot, không reopen.
- Không update/reset/close/recreate. Chống trả lặp chỉ cho cùng invoice PDA; không ngăn merchant tạo ID khác cho cùng đơn hàng.
- Tests: payment lần2 với transaction/blockhash mới và principal chuyển đúng một lần; sai signer/recipient/owner/type/seeds; thiếu tiền CPI phải rollback; expiry trước/tại/sau; hai thứ tự pay/cancel; terminal invoice không tái tạo. Tách principal khỏi fee/rent, đọc state/balance làm oracle.
- Demo165s và comparison Stripe/Solana Pay/x402 đã có ở C01. RUBRIC v1.2 weights20/15/10/20/15/15/5, floors3/3/2/3/3/3/2, tổng≥75; giữ lịch sử r0, tối đa r1–r3.

## Công cụ và giới hạn vận hành

- Giữ toolchain: Rust1.100.0, Agave release4.1.2, Anchor `/Users/bao/.avm/bin/anchor-1.2.2`, platform-tools `/Users/bao/.cache/solana/v1.57/platform-tools/rust/bin/`. Không sửa shell profile/cài lại/nâng version.
- Root Cargo workspace `programs/*`, edition2021/rust-version1.89.0. Cache: anchor-lang1.2.2, LiteSVM0.15.0, solana-message4.3.0, transaction4.1.5, signer3.0.1, keypair3.1.2. Existing `programs/phase3-hello` tests dùng signers trong memory và `expire_blockhash()`. CPI Anchor1.2.2: `CpiContext::new(system_program::ID, accounts)` theo mẫu đã đọc.
- `cargo-build-sbf --help` báo binary4.1.0/default tools v1.54, khác release Agave4.1.2. Có `--offline`, `--skip-tools-install`, `--tools-version`, `--arch`; Anchor có `--ignore-keys`, `--no-idl`, `-p` nhưng **chưa xác minh việc tự sinh keypair**. Chưa build ReceiptRail.
- Source cache để đọc: `/Users/bao/.cargo/git/checkouts/anchor-0977bcaec406b76e/8d9d148/cli/src/lib.rs`; `/Users/bao/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/litesvm-0.15.0/src/lib.rs`.
- `web__run` lượt trước lỗi404 route_not_found; đã tìm tool search-service fallback nhưng chưa gọi. Nguồn dự định: Anchor `/docs/basics/cpi`, `/docs/references/account-constraints`, Solana `/docs/core/transactions`; chưa gọi không được ghi đã đọc.
- Signers legacy nằm ngoài Git tại `/Users/bao/.local/share/dev3pack/devnet/`; **không đọc/in/dùng cho spike ReceiptRail**, không tạo keypair triển khai mới. Không funding/RPC writes/deploy ở task hiện tại.
- Automation `dev3pack-nh-c-tr-ng-nh-m-m-i-15-ph-t`, chat `01a1e9c8-1b24-7911-91a4-4897fc175566`: đã được người dùng yêu cầu bật lại, update/view/config-read ACTIVE mỗi15phút đúng chat; chưa quan sát heartbeat mới. Goal đã active theo người dùng.

## Git và bằng chứng lịch sử giữ nguyên

- HEAD và origin/work local cùng `050e0307fc9c983baaae0d68076d351cb14da134`; **chưa fetch trong lượt chỉ bàn giao**. Commit web đã push `f7a1a43234a104e87345fe3f2539c0a5737abc66`. Origin/main biết gần nhất `b9c91b0d0cb191e6f0aa348d0540ffa83985c908`.
- Các file bẩn từ trước: README; IDEA/ARCHITECTURE/DEVLOG/HANDOFF/ROADMAP; archive/HANDOFF-history-codex; evidence/phase3/web; ideas/DECISION; learning009/022; reviews/phase1-3-gates; tasks/A-queue. Untracked: `docs/evidence/phase3/devnet-inspect-1794934540316.json`, `docs/evidence/phase3/web-native-core.md`. Bảo toàn, sửa các câu xác nhận sai trước commit. Lượt bàn giao chỉ thay HANDOFF/archive/note009/DEVLOG.
- PR #7 lần kiểm trước open, draft=false, merged=false, base main/head050e030; title/body còn ClusterProof và quyền cài, **chưa sửa cho ReceiptRail**. Không kiểm GitHub lại trong lượt này.
- [Web ClusterProof giữ nguyên](https://clusterproof-devnet-17nov26.anthony-robinson-125.chatgpt.site), [hosting metadata](evidence/phase3/web-hosting.json). Project `appgprj_6afc7bde680481919ba3e40a9d098155`, deployment succeeded `appgdep_6afc7e25272081918ac0aeda0eee730b`, source `f5223afb86ec0a8208715eec312e636b19da30ff`. Không tạo/poll/redeploy.
- Legacy hello6/client8/web8 tests đã đạt theo logs; research16tests. Không phải tests ReceiptRail. [CI run44128739391](https://github.com/ntbaoheyhey/dev3pack-hackathon/actions/runs/44128739391) bị billing trước jobs; local pass không thay CI và không suy tình trạng billing hiện tại từ run cũ.
- [Devnet inspect cuối](evidence/phase3/devnet-inspect-1794934540316.json) 2026-11-17T16:55:40.315Z, slot523335879, payer0/program chưa deploy/transactions=[]; giữ evidence, không tiếp tục deploy. Core discovery/request/recovery đã ghi ở [evidence](evidence/phase3/web-native-core.md), connect/disconnect thật chưa kiểm; CUA đã completion_summary.
- Dev server5177/session65878 đã exit130; Sites workflow45815/exec cellg21:194 terminal. Không còn process cần poll đã biết từ bàn giao trước, lượt này không restart chúng.

## Cần người dùng

Yêu cầu chỉ bàn giao đã kết thúc; đang làm Phase 2 theo tin người dùng mới nhất. Chưa phát hiện blocker kỹ thuật mới. Khi tiếp tục, làm phần sửa hồ sơ/thiết kế/spike local được yêu cầu. **Sau Phase 2 phải có người dùng duyệt trước Phase 3**; mọi cài thêm/deploy/public mới phải hỏi trước với nội dung cụ thể. Không hỏi chọn ý tưởng lại, không dùng lời tự nhắc hoặc quyết định của agent thay cho câu người dùng.
