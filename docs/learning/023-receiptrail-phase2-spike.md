# 023 — ReceiptRail Phase 2 và spike Anchor cục bộ

- **Ngày**: 18/11/2026, Asia/Ho_Chi_Minh
- **Agent**: Codex
- **Giai đoạn**: trước sự kiện; đặt chỗ tại commit80cac12 trước khi viết; viết note trước code

## Tóm tắt 3 dòng

Invoice PDA là điểm chung để kiểm hóa đơn Open rồi chuyển SOL và ghi Paid trong cùng transaction; chỉ bảo vệ cùng một invoice ID.
Spike nạp bytecode Anchor thật vào LiteSVM, dùng fee payer riêng để tách principal/rent khỏi phí và đổi blockhash khi thử trả lặp.
Chỉ dùng compiler/dependency cache đã có, không cài thêm hoặc tạo signer triển khai; chưa là sản phẩm đã deploy hay thiết kế đã duyệt.

## Khái niệm chính

- `Account<Invoice>` kiểm owner/discriminator; seeds cố định32bytes và canonical bump ở init; `has_one` liên kết signer/recipient với state. Init một lần; không update/reset/close. Payer/merchant/invoice khác nhau. Clock.slot là nguồn expiry; đúng slot expiry đã bị từ chối. [Constraints](https://www.anchor-lang.com/docs/references/account-constraints), đọc18/11.
- CPI chỉ tới System Program, amount lấy từ state bất biến. Source **anchor-lang1.2.2** cached `context.rs` dùng `CpiContext::new(program_id: Pubkey, accounts)`; trang [CPI](https://www.anchor-lang.com/docs/basics/cpi) còn ví dụ truyền AccountInfo, nên ưu tiên source đúng phiên bản. `system_program::transfer` dựng instruction System với sender/recipient, không nhận target tùy ý.
- Mọi instruction trong một transaction phải cùng thành công; failure rollback state/transfer nhưng vẫn có phí. Test `[pay,pay]` trong cùng transaction phải rollback cả lần đầu; test hai transaction mới riêng phải giữ lần đầu Paid, từ chối lần sau. [Solana transactions](https://solana.com/docs/core/transactions), đọc18/11. Không đánh đồng same-signature replay với invoice duplicate.
- Program ID local được tạo từ hash nhãn công khai, không từ keypair. Signers test chỉ trong memory của máy ảo; không đọc/sinh file ví. LiteSVM0.15.0 `expire_blockhash`, `warp_to_slot`, `get_account`, `set_account` đã đối chiếu source cache. Fixtures sửa owner/data chỉ dùng ca bất thường; luồng bình thường luôn khởi tạo bằng instruction thật.
- Payload123bytes + discriminator8 =131bytes dự kiến. Merchant trả rent riêng; payer trả đúng principal; fixture fee payer thứ ba trả tx fee. Receipt không chứng minh hàng hóa đã giao, merchant không tạo ID khác, RPC luôn đúng hoặc upgrade authority trung thực.

## Cách làm — trước khi code

Thiết kế tối thiểu: `create_invoice(invoice_id[32], payerPubkey, amount_lamports, expires_slot)`, `pay_invoice()`, `cancel_invoice()`. Create merchant signer System-owned/data-empty; payer pubkey được chỉ định, kiểm ví lúc pay. Pay chỉ Open và slot<expiry; cancel Open cả trước/sau expiry. Paid/Cancelled là terminal, expiry là hiển thị suy từ Open+Clock.

Source build đã đọc từ [Anza cargo-build-sbf commit138ca775](https://github.com/anza-xyz/cargo-build-sbf/tree/138ca775f7c1b60abbfb958975a95aacad10efb2/cargo-build-sbf/src): `bin/build_sbf.rs` chọn target `sbpfv3-solana-solana`, flags `-C link-arg=-z -C link-arg=defs`; `post_processing.rs` có `generate_keypair` nếu file triển khai chưa tồn tại. Đây là source tham khảo hiện hành, không khẳng định binary4.1.0 là cùng commit. Do đó không gọi wrapper Anchor build/cargo-build-sbf cho spike; gọi cargo/rustc platform-tools đã có rồi `llvm-objcopy --strip-all` vào thư mục local riêng.

Phiên bản đã quan sát: host cargo/rustc1.100.0; platform-tools v1.57 rustc1.95.0-dev(ae660768a)/LLVM22.1.2; Anchor-lang1.2.2; LiteSVM0.15.0. Các dependencies test dùng cùng pins của hello lab. Cargo offline tuyệt đối; thiếu cache thì dừng phần build và hỏi trước cài thêm, không download tự động. Lockfile chỉ thêm package ReceiptRail, không tự nâng dependency.

Kế hoạch lệnh (chưa gọi tại thời điểm viết note): `bash scripts/check-receiptrail.sh`; script dự kiến build target v3 offline/locked, strip `.so`, chạy `cargo test -p receiptrail --offline --locked`, lưu logs và hashes. Không chạy validator, Anchor deploy/test mặc định, RPC hoặc CI cài công cụ.

## Test plan và tiêu chí đạt

1. Create đúng PDA/owner/131bytes/terms/slot; merchant rent đo từ máy ảo, không lấy làm báo giá devnet.
2. Pay lần1 chuyển đúng principal và Paid; transaction/blockhash/signature mới trả lại bị InvoiceNotOpen, principal không chuyển lần2.
3. CPI thiếu tiền và `[pay,pay]` cùng transaction: state/lamports rollback; phí riêng vẫn có thể mất.
4. Wrong signer/recipient/owner/discriminator/seeds/System Program; missing signer; các account alias; amount0/expiry<=slot đều bị từ chối.
5. Trước/tại/sau expiry; pay→cancel và cancel→pay; tạo lại invoice Paid/Cancelled bị từ chối; cancel sau expiry được phép.
6. Đọc state/balance làm oracle, không lấy event/UI success làm kết quả. Lưu CU/fee/size/thời gian chạy; chưa nâng F trước khi có log pass.

## Bài học / lỗi đã gặp

| Bẫy | Nguyên nhân | Cách xử lý |
| --- | --- | --- |
| Anchor docs CPI không khớp1.2.2 | Docs ví dụ khác source cached | Dùng signature source pinned; compiler xác minh sau |
| Build local cũng sinh keypair | Post-processing của wrapper build | Dùng compiler cached trực tiếp, không gọi nhánh tạo key |
| F4 khi chưa spike | Nhầm kế hoạch và evidence | Giữ r1=75/F3 đến khi bytecode/tests chạy thật |
| Quyền cài/duyệt bị ghi sai | Dùng payload đã bị đính chính | DECISION có nguyên văn/giờ/nguồn sai; AGENTS/K6 chặn suy quyền |
| Cargo offline chưa chặn rustup proxy tự cài toolchain bị thiếu | `.cargo/bin/cargo` là proxy; cache dependency và compiler là hai việc khác nhau | Script cuối dùng trực tiếp bộ host1.100.0 đã có, kiểm cargo/rustc/rustfmt trước khi chạy; thiếu thì exit2. Chạy lại suite sau sửa runner, giữ log r1 |
| UX T12 thêm token selector và chưa có wireframe/error mapping | Bản42c5523 chỉ liệt kê flow chung, chưa đối chiếu hết contract/tiêu chí queue | Review T12-R1–R5; giao T16 theo native SOL/IDL, tách request khỏi Invoice và chứng minh duplicate trong storyboard165s. Chỉ sửa tài liệu sau T13, không mở UI/Phase3 |
| UX T16 gán sai cả9 mã6000–6008 dù đã báo xong | Bảng tại a27a207 không khớp JSON IDL/source, checklist còn5 ô trống; chưa xác định nguyên nhân nội bộ của A | Đọc trực tiếp `errors` trong IDL đúng program/version và enum ReceiptError; Python đối chiếu9 hàng cho0 khớp, enum khớp IDL. [Review T16](../reviews/receiptrail-codex.md#review-đầu-ra-t16--18112026-lượt-heartbeat0410-utc7) giữ bảng sai/đúng và giao T17; không đưa mapping đoán vào client hoặc lấy report “xong” làm evidence. Chỉ kiểm dữ liệu, không rerun runtime suite khi source không đổi |
| T13 nói nonce chống race, chưa nêu rõ thiếu bằng chứng rollback nào | Report c591fc9 chưa trỏ cơ chế/assertion cụ thể; hàm gửi test dùng recent blockhash mới, Invoice không có nonce | [Review T13](../reviews/receiptrail-codex.md#review-đầu-ra-t13--18112026-lượt-heartbeat0440-utc7) tách3 ca: CPI thiếu tiền, hai pay cùng tx rollback cả tx, retry tx mới giữ lần thành công trước. Snapshot không gồm fee payer riêng; race test chỉ hai thứ tự serial. Giao T18 ma trận source/assertion/log/giới hạn, không suy concern chung thành bug hoặc coi verdict sơ bộ là review chéo đạt |
| T17 tick5 ô hoàn tất nhưng bảng lỗi giữ nguyên9/9 sai | Bản3475c36 khẳng định lấy trực tiếp JSON trái kết quả đối chiếu; chưa xác định vì sao A báo sai | Lưu [audit T17](../evidence/phase2/receiptrail-ux-t17-audit.json) có snapshot/hashes/mismatch và giao T19 lệnh đọc/so trực tiếp IDL. Tách việc checkbox đã tick khỏi bằng chứng tiêu chí thật sự đạt; kiểm dữ liệu không thay review copy/CTA/wireframe hoặc runtime test |

## Nguồn

- [Anchor constraints](https://www.anchor-lang.com/docs/references/account-constraints), [CPI](https://www.anchor-lang.com/docs/basics/cpi), [Anchor1.2.2 source](https://github.com/otter-sec/anchor/tree/v1.2.2/lang/src).
- [Solana transaction atomicity](https://solana.com/docs/core/transactions).
- [Anza build source pinned](https://github.com/anza-xyz/cargo-build-sbf/tree/138ca775f7c1b60abbfb958975a95aacad10efb2/cargo-build-sbf/src).
- [LiteSVM0.15.0](https://docs.rs/litesvm/0.15.0/litesvm/), source cached đã đọc; notes004/007/016/021.

## Giới hạn tại mốc note trước code (lịch sử)

Chưa code/build/test ReceiptRail tại mốc note này; chưa IDL generated, client, browser, validator/RPC, devnet, CI hoặc review độc lập. Spike local chứng minh phần khó D2 nếu đạt, không tự đạt cổng Phase2/3 hoặc DELIVERY. Khi có log sẽ bổ sung kết quả và giới hạn, hoàn tất IDEA/ARCHITECTURE/demo165s rồi trình duyệt.


## Kết quả spike18/11/2026

`bash scripts/check-receiptrail.sh` đã chạy offline/locked **exit0**, build+test64s; bytecode v3 thật147,864bytes, **19 runtime tests pass/0 fail**, suite1.06s. Log [r1](../evidence/phase2/receiptrail-spike-r1.txt), [metadata/hashes](../evidence/phase2/receiptrail-build-metadata.json). Cargo.lock chỉ thêm package receiptrail, không nâng dependencies. Không tạo deployment keypair, không RPC/validator/deploy.

Đã kiểm state131bytes, canonical PDA/owner/terms; create rent1,802,640lamports theo LiteSVM. SampleCU create8,775/pay6,608/retry6,017/cancel4,346; fee10,000lamports vì2signatures. Principal1,000,000 chỉ chuyển một lần dù retry mới; `[pay,pay]` rollback cả transfer lần đầu; CPI thiếu tiền, sai quyền/account, expiry/race/terminal init đều pass. Các số đo không thay devnet/CI/browser hoặc audit độc lập.

IDL lần1 lỗi `cargo metadata` vì PATH của process không có cargo; giữ log fail, sửa PATH riêng process tới host compiler đã có và bỏ RUSTUP_TOOLCHAIN để helper không vào nhánh cài. Không sửa profile hoặc cài lại.

Feasibility có evidence D2 phần khó nhất; 64s chạy thấp hơn timebox4h. Ngân sách estimate còn26h implementation/UI/integration/buffer từ plan30h sau spike4h; chưa là năng suất đã đo. Đủ đề nghị F4 PLAN, không F5 vì client/recovery mạng chưa chạy. Runtime source/test đạt không tự chứng minh IDEA/ARCHITECTURE đã được duyệt.

## IDL và runner cuối

IDL r1 lỗi cargo metadata vì PATH; r2 lỗi `No such file or directory` (chưa xác định executable nào); r3 **exit0** khi PATH chứa host Rust/Agave/.cargo và bỏ RUSTUP_TOOLCHAIN. Giữ cả ba logs trong evidence, không sửa log fail thành pass. [IDL](../idl/receiptrail.json) có3 instructions/1 account/3 events/9 errors6000–6008, đã đối chiếu args, accounts/signers/writable, seeds/discriminators/layout131bytes với source và ARCHITECTURE; SHA256 ở metadata. IDL build lọc19 runtime tests nên không dùng nó thay log suite.

Lệnh tái tạo đã dùng, chỉ khi những binary/cache này đã có:

```sh
env -u RUSTUP_TOOLCHAIN \
  PATH="$HOME/.rustup/toolchains/1.100.0-aarch64-apple-darwin/bin:$HOME/.local/share/solana/install/active_release/bin:$HOME/.cargo/bin:$PATH" \
  CARGO_NET_OFFLINE=true \
  "$HOME/.avm/bin/anchor-1.2.2" idl build -p receiptrail \
  -o "$PWD/target/receiptrail-spike/receiptrail.json" -- --offline --locked
```

Runner cuối dùng trực tiếp host toolchain đã cài, không qua rustup proxy. Mặc định máy Apple Silicon; máy khác trỏ `RECEIPTRAIL_HOST_TOOLS` tới thư mục bin có sẵn và `RECEIPTRAIL_PLATFORM_TOOLS` tới cache platform-tools; thiếu compiler/cache thì dừng, không cài. Sau thay runner, log [r2](../evidence/phase2/receiptrail-spike-r2.txt) **19/19**, suite1.00s/build+test3s bằng cache, source/test/lock/binary hashes như r1. Chỉ runner hash đổi; metadata r1 giữ riêng, metadata hiện hành ghi r2 và IDL.

## Đánh giá sau spike

C01 r2 chấm **79/100 PLAN, F3→4**, giữ r0/r1 và R/D4; không thay weights. Cập nhật IDEA/ARCHITECTURE, README/SHORTLIST/ROADMAP/DECISION/review/Thẻ nhớ, giao bản8f84cfe cho A qua queue. Lựa chọn người dùng không là duyệt Phase2; chưa mở Phase3. CI cũ chạy lab rồi `cargo test --workspace`, chưa wire runner ReceiptRail/đường dẫn `.so`; cần xử lý khi mở Phase3 và có quyền cài tương ứng, không gọi CI xanh từ local pass.

Kiểm nhánh thiếu compiler bằng `RECEIPTRAIL_HOST_TOOLS=/nonexistent/receiptrail-host bash scripts/check-receiptrail.sh`: exit2 đúng trước build, thông báo thiếu cached executable; không cài thêm. Checks cuối: links local của16 file, hashes current metadata, phép tính điểm/sàn và git diff --check đạt.

## Bài học review T18/T19 — 18/11/2026,05:42 UTC+7

T19/03c0bac đã sửa9/9 code–name đúng IDL; chỉ nhận phần này, không tiếp tục ghi bảng lỗi hiện hành sai như T17. Copy/CTA, terms, state/wireframe/demo/SDK còn thiếu. [Audit T18–T20](../evidence/phase2/receiptrail-reviews-t18-t20-audit.json) giữ snapshot mới; audit T17 không sửa đè.

T18/073d781 dẫn test_duplicate không tồn tại và nhầm signer/expiry với hai ca rollback đã giao. Đã đọc source/assertions/log r2 và đối chiếu3hash metadata; không rerun suite. Cần phân biệt rollback cả tx chứa hai pay với retry tx mới giữ Paid của tx đã thành công; Snapshot không gồm fee payer riêng. Bảng Đạt phải trỏ tên hàm/assertion/log thật, Signer khác has_one, hai thứ tự serial không là contention mạng. [Review mới](../reviews/receiptrail-codex.md#review-t18t20--18112026-heartbeat0542-utc7) giao T21/T22; không coi lỗi report là lỗi program hoặc quyền triển khai.

## Bài học review T21 — 18/11/2026,06:13 UTC+7

T21/6921d5a sửa đúng3tên hàm rollback/retry; C đối chiếu cả3 với source/log r2. Nhận phần sửa tên, không tiếp tục dùng lỗi test_duplicate của snapshotT18 để mô tả report hiện tại. Tên test tồn tại không thay assertion/kết quả và fee boundary. `Signer` kiểm signer, `has_one` đối chiếu key với field; merchant ở pay là SystemAccount, ở cancel mới cần Signer. [Review T21](../reviews/receiptrail-codex.md#review-t21--18112026-heartbeat0613-utc7) chỉ ra phần còn thiếu và T24 yêu cầu bảng trước-sau/assertion/log/giới hạn. Không rerun tests vì source/tests/IDL/log không đổi; không coi cải thiện report là review chéo đạt hoặc quyền triển khai.

## Bài học review T22 — 18/11/2026,06:58 UTC+7

T22/e2ef270 giữ9/9 mã–tên đúng, làm rõ lamports/slot/merchant cancel nhưng copy6008 vẫn gọi WrongVersion là lỗi IDL. Source PayInvoice/CancelInvoice kiểm **invoice.version**, nên phải đọc điều kiện phát lỗi trước khi viết CTA; không suy đổi IDL hoặc cập nhật app sẽ sửa được account version. State Paid và mức commitment là hai thông tin khác nhau; Expired chỉ suy khi invoice còn Open. Đơn vị đúng không tự làm form đủ: string32 chưa là mapping32bytes, create rent khác pay principal/fee.

[Review T22](../reviews/receiptrail-codex.md#review-t22--18112026-heartbeat0658-utc7) giữ snapshot/hash và phân biệt tiến bộ với5checkbox chưa được chứng minh. Một dòng flow không thay8wireframes hay storyboard có tổng165giây và duplicate tx mới; tên SDK không thay nguồn/compatibility hoặc quyền cài. GiaoT25 sauT23/T24, giữ contract/điểm/fileA; chỉ kiểm tài liệu/source có sẵn, không rerun suite vì phần thực thi không đổi.

Bổ sung07:28: T22v2/bfa184c có49dòng, thêm4mô tả màn và Explorer khi có signature;36dòng đầu giữ nguyên,9/9 mã đúng. [Review v2](../reviews/receiptrail-codex.md#bổ-sung-t22-v2--18112026-heartbeat0728-utc7) nhận phần cải thiện nhưng chưa đủ8wireframes hoặc sửa state/CTA. Ghi “Source: ARCHITECTURE mục6/note014” không chứng minh quyết định web3.js+wallet-adapter-react: cả hai file không chọn các package đó. Khi kiểm nguồn phải đối chiếu claim cụ thể, không chỉ sự tồn tại của tài liệu; không ghi version/compatibility đã kiểm nếu nguồn không hỗ trợ. GiữT25 hiện có, không tạo task trùng hoặc sửa snapshot/hash cũ.

## Bài học review T24 — 18/11/2026,08:30 UTC+7

T24/7325169 đã tách Signer/has_one ở pay/cancel và nhắc expire_blockhash đúng; nhận phần này, không lặp lỗi T21 đã sửa. [Review T24](../reviews/receiptrail-codex.md#review-t24--18112026-heartbeat0830-utc7) giữ hash31dòng và bảng đối chiếu3ca. “Trước lỗi” phải là ngay trước **transaction thất bại**: retry mới bắt đầu từ Paid sau lần pay thành công; `[pay,pay]` cùng transaction bắt đầu Open và rollback về Open. Snapshot không chứa fee payer, nên không suy phí cũng hoàn lại.

Log test có thể in METRIC giữa tên test và dòng ok; parser một dòng đã báo AssertionError dù log r2 ghi19pass/0fail. Đọc tiếp dòng ok cho đúng cấu trúc, không sửa log hay rerun suite để giải quyết lỗi parser tài liệu. T27 yêu cầu assertion/log/giới hạn cho ma trận và từng finding; report nộp không tự là review chéo đạt. Không đổi source/test/IDL/thiết kế/điểm hoặc mở Phase3.

## Bài học review T25 — 18/11/2026,09:00 UTC+7

T25/33b71e7 có62dòng,9/9 mã–tên khớp IDL,8mục màn hình và4khoảng thời gian liên tục đủ165giây; nhận phần tiến bộ này. [Review T25](../reviews/receiptrail-codex.md#review-t25--18112026-heartbeat0900-utc7) giữ hash và5findings: số mục/tổng thời gian không thay bố cục có fields/CTA hoặc cảnh chứng minh duplicate transaction mới, principal một lần và phí fail riêng. Khi sửa report phải giữ phần đã đúng: điều kiện Explorer có signature và merchant cancel ở T22v2 đã bị bỏ trong T25.

Code/name đúng vẫn có thể đi cùng copy sai: WrongVersion là invoice.version, Paid là Invoice state còn finalized là commitment. Claim SDK “tương thích tốt nhất” cần nguồn/phạm vi kiểm; các versions lịch sử note005 không là bằng chứng đã tích hợp ReceiptRail. GiaoT28 sauT26/T27; chỉ review tài liệu, không rerun suite hoặc mởPhase3. HANDOFF A báo hết việc dù queue trong ancestor đã cóT26/T27: kiểm Git trước khi cấp lại, giữ thứ tự task đang mở.

## Cập nhật lời duyệt — 18/11/2026

Tin trực tiếp **“duyệt phase 2”**, log2026-11-18T02:27:18.464Z =09:27:18.464 UTC+7, đã được đối chiếu record role=user chỉ chứa câu này. Người dùng không tự nêu giờ quyết định. [DECISION](../ideas/DECISION.md) và [trích record](../evidence/phase2/user-approval-2026-11-18.json) tách giờ log với giờ người dùng tự nêu, tách duyệt thiết kế khỏi review chéo/giáo viên/quyền vận hành. Các câu “chưa duyệt” trong phần lịch sử trước mốc này không còn là trạng thái hiện hành. Không hỏi duyệt lại; tiếp tục phần chuẩn bị được phép và hỏi riêng trước cài thêm/keypair triển khai/deploy/public. Chỉ cập nhật tài liệu, không rerun suite khi executable inputs không đổi.

## Bài học review T26/T27 và pipeline — 18/11/2026

[Review mới](../reviews/receiptrail-codex.md#review-t26-và-t27--18112026-sau-duyệt-phase2) nhận expiry `>=` của T26 và Signer/has_one của T27; còn sáu findings nguồn/state/mapping và recipient/assertion/baseline/giới hạn. Phải giữ phần đã đúng khi sửa report: expire_blockhash của T24 bị bỏ trong T27. API key không là idempotency key; Paid không là finalized; baseline của retry lỗi là Paid sau transaction thành công trước đó. Snapshot/hash giữ riêng, không sửa report A; T29 tiếp sau T28.

[Runner offline Phase3](../../scripts/check-phase3-offline.sh) đổi pipeline nên đã chạy kiểm thật: build hai program trước workspace tests, 6 hello +19 ReceiptRail pass; 8 client tests và IDL/bytecode đều khớp. [Note022](022-phase2-3-independent-prep.md) ghi thiết kế trước code, logs/hash và giới hạn. Không đổi source/tests/IDL ReceiptRail hoặc điểm; kiểm tài liệu sau đó không cần rerun suite. Workflow mới vẫn guard false và chưa Linux CI, không dùng local pass để vượt quyền cài/deploy/public.

## Bài học review T28/T29 — 18/11/2026

[Review 601e723](../reviews/receiptrail-codex.md#review-t28-và-t29--18112026-heartbeat1235-utc7) nhận phí create/pay, Unknown không tự ký/retry và baseline retry Paid→Paid. Kiểm snapshot/Git blob của 3 report, 6 hashes đầu vào, 9 cặp IDL và 165 giây đều khớp; UX chỉ có 4 mục bố cục, giảm từ 8. Ba tên hàm rút gọn trong report không là tên test tồn tại; khi dẫn phải dùng tên đầy đủ, assertion và dòng log. Không chạy lại runtime vì executable inputs không đổi.

Paid là invoice state, còn commitment là thuộc tính của lần quan sát; WrongVersion kiểm invoice.version. Tại đúng expiry đã cấm pay. Log r2:23–24 là một test với METRIC rồi `ok`, không chứng minh hai cảnh UI riêng. Snapshot balances không gồm fee payer, vì thế rollback principal không chứng minh hoàn phí. Giao các patch nhỏ T30→T31→T32→T33, giữ phần đã đúng và trả lời từng finding bằng nội dung thực. P3-A đã đạt tại 27cf7ac theo note022; người dùng đã duyệt Phase2, còn review chéo/giáo viên và hello sau funding. Không mở Phase4–6 từ kết quả này.
