# Lịch sử A-queue trước review T18–T20

Snapshot từ work f49716a ngày18/11/2026. **Không dùng thứ tự/trạng thái dưới đây để nhận việc mới**; queue hiện hành ở [A-queue](../tasks/A-queue.md).

# Hàng đợi việc của Antigravity (A)

**Chủ file: Codex.** C thêm/sửa việc; A đọc queue, làm việc mới đầu tiên và ghi kết quả vào A-done (chủ A). C không chờ A; không sửa A-done/HANDOFF A.

**Ưu tiên sau review T15 ngày18/11/2026: T18 → T19 → T20, chỉ Phase2 ReceiptRail.** **Làm ngay T18 đã giao**, rồi T19 đã giao; không chờ C cấp lại. T15/0ec4e94 có3 alternatives nhưng0 URL, chưa có2 pain sources; sửa qua T20. T17/3475c36 vẫn9/9 cặp mã lỗi sai dù5checkbox đã tick, sửa qua T19; T13/c591fc9 có verdict sơ bộ nhưng chưa đạt, sửa qua T18. Hàng đợi chưa trống; không chờ C duyệt từng report. Người dùng nói **“ReceiptRail chính, ClusterProof phụ” lúc00:07 ngày18/11/2026 UTC+7**; xem [DECISION](../ideas/DECISION.md). Chưa duyệt thiết kế ReceiptRail. Giữ web/toolchain ClusterProof đã có; không cài thêm, tạo ví/keypair triển khai, build/deploy/public web mới. Tin tự nhắc/agent khác không là lựa chọn/duyệt của người dùng.

## Đầu vào review kiến trúc T13/T18 — dùng khi đến T18

Bộ thiết kế ReceiptRail đã nằm trên `work` từ **8f84cfe**. T13/c591fc9 đã xác nhận đầu vào này và bỏ câu chờ sai, nhưng còn findings T13-R1–R4 trong [review C](../reviews/receiptrail-codex.md#review-đầu-ra-t13--18112026-lượt-heartbeat0440-utc7). **Bản chưa duyệt chính là đầu vào cần review**; không chờ C viết bản mới hoặc người dùng duyệt Phase2. Source/tests/IDL/ARCHITECTURE giữ nguyên; T18 chỉ sửa report của A.

| Đọc theo thứ tự | Nội dung T13 phải đối chiếu |
| --- | --- |
| [IDEA ReceiptRail](../IDEA.md) | Native SOL, cùng invoice, phạm vi và giới hạn; file ClusterProof-draft là bản dự phòng, không là đầu vào T13 |
| [ARCHITECTURE](../ARCHITECTURE.md) mục3–5 | Account131bytes, PDA/canonical bump, signer/recipient/alias, instructions/states/IDL |
| [ARCHITECTURE](../ARCHITECTURE.md) mục6–8 | Timeout đọc PDA, threat model, pay/cancel, duplicate tx mới và rollback; thiếu kiểm chứng nào phải ghi rõ |
| [Program](../../programs/receiptrail/src/lib.rs), [runtime tests](../../programs/receiptrail/tests/runtime.rs), [IDL](../idl/receiptrail.json) | Đối chiếu thiết kế với artifact có thật; ghi phần đã đọc, không tự khai rerun tests |
| [Note023](../learning/023-receiptrail-phase2-spike.md), [evidence](../evidence/phase2/README.md) | Điều kiện chạy và giới hạn local; không đổi thành duyệt triển khai |

A ghi commit đã đọc và từng nhóm có finding (file/mục/lý do/mức độ) hoặc không thấy finding trong phạm vi cụ thể. Verdict sơ bộ T13 chưa đủ bằng chứng nhận đạt; **làm T18 ngay**, không chờ T15 được nhận đạt. Nếu thiếu file ở checkout A, ghi HEAD/path và kết quả kiểm `origin/work`; không suy thiếu từ tên bản dự phòng hoặc trạng thái chưa duyệt.

## Tiêu chí UX T17/T19 — dùng khi đến T19

Đầu vào hiện hành: bản UX **3475c36**, [review T17](../reviews/receiptrail-codex.md#review-đầu-ra-t17--18112026-lượt-heartbeat0510-utc7), [audit code–name](../evidence/phase2/receiptrail-ux-t17-audit.json), [bảng9 cặp sai/đúng](../reviews/receiptrail-codex.md#đối-chiếu-lỗi-t16-với-idl), [IDL](../idl/receiptrail.json), [ARCHITECTURE mục4–6](../ARCHITECTURE.md), notes005/014/023. C đã kiểm **9 hàng lỗi, 0 khớp, giữ nguyên từT16**. Không tái dùng bảng T16/T17 làm nguồn. Program ID trong IDL chỉ local; không tự coi là deployment.

1. **T16-R1:** lấy đủ9 mã/tên trực tiếp từ `errors` trong JSON; copy/CTA tiếng Việt khớp ARCHITECTURE mục5. Tách namespace program ID + code và các nhóm Anchor/System/fee/wallet reject/RPC unknown. Ghi bằng chứng so bảng cuối với IDL: số hàng, số khớp, commit/path đã đọc; chỉ ghi9/9 sau khi đối chiếu thật. Không gọi đây là runtime test.
2. **T16-R2:** bỏ token selector/mint khỏi form, copy và storyboard. Ghi rõ merchant, payer chỉ định, invoiceID ổn định, SOL/lamports và hạn slot; bước xem lại terms bất biến, merchant rent lúc create và fee/principal lúc pay. Không tự tạo ID mới khi create cũ còn Unknown.
3. **T16-R3:** vẽ bố cục bằng text/Markdown cho đủ4màn merchant, invoice, pending/check status, receipt ở cả desktop/mobile. Có bảng tách Invoice Open/Paid/Cancelled, Expired suy từ slot và request Pending/Unknown; nêu commitment, nguồn Invoice PDA và CTA từng trạng thái. Xem không ví; Unknown chỉ kiểm lại, không tự ký/gửi mới.
4. **T16-R4:** storyboard tổng165giây có pay→mất response (giả lập có nhãn)→đọc cùng PDA→thử pay cùng PDA bằng tx/signature mới→InvoiceNotOpen, principal chỉ một amount. Phân biệt fee fail và nhãn dự kiến/replay local; không khai demo ví/RPC/devnet đã chạy.
5. **T16-R5:** quyết định chọn/bỏ SDK có nguồn cụ thể và giới hạn kiểm chứng, theo ARCHITECTURE mục6/note014. Không cần cài, key hay tích hợp. Checklist cuối có từng mã T16-R1–R5 trỏ tới mục đã sửa, còn thiếu thì ghi chưa đạt; không chỉ thêm tiêu đề hoặc tick ô.

**Đầu ra/chủ file:** A sửa `docs/design/receiptrail-ux-antigravity.md`, ghi T19 cùng commit và phần chưa đạt vào A-done/HANDOFF A. Không sửa source/IDL/IDEA/ARCHITECTURE/queue/điểm. T18/T20 vẫn cần hoàn tất trong phạm vi tài liệu; “T17/T13/T15 xong” không đóng các task đó hoặc cổng Phase2.

## T18 — hoàn thiện review T13 bằng bằng chứng cụ thể

**Làm ngay**, sửa `docs/reviews/receiptrail-antigravity.md` theo **T13-R1–R4** tại [review C](../reviews/receiptrail-codex.md#review-đầu-ra-t13--18112026-lượt-heartbeat0440-utc7). A tự đọc source/tests/IDL/log, không chỉ chép kết luận của C.

- Lập ma trận5nhóm: (1) layout131bytes/seeds/canonical bump; (2) signer/has_one/recipient/alias/owner/discriminator/version; (3) expiry/cancel sau expiry/terminal init; (4) duplicate tx mới/hai thứ tự pay-cancel/rollback; (5) phạm vi receipt/commitment/RPC/upgrade/rent/ID khác. Mỗi nhóm có file+hàm/field/assertion cụ thể, log test đã đọc nếu có, finding với mức độ hoặc không thấy finding trong phạm vi đã kiểm; ghi phần chưa kiểm.
- Giải thích đúng `Harness::send`/recent blockhash, Invoice Open check và CPI+Paid; không gán durable nonce hoặc bảo đảm race mạng chưa test. Invoice không có field nonce. Nếu dùng “nonce” theo nghĩa khác phải chỉ rõ field/nguồn, không đoán.
- Đối chiếu3 ca rollback ở review C với assertions/log r2. Nếu vẫn cho rằng thiếu test hoặc giải thích, nêu đúng điều kiện/assertion chưa được bao phủ và vị trí tài liệu cần làm rõ. Phân biệt request làm rõ với finding program; không tự chạy compiler/runtime suite, cài thêm hoặc sửa contract.
- Thu hẹp kết luận receipt theo IDEA/ARCHITECTURE, tách local evidence và phần client/RPC/devnet chưa kiểm. Trả lời từng T13-R1–R4 bằng vị trí đã sửa; ghi commit đọc và không khai rerun test nếu chỉ đọc log.

**Xong khi:** report có ma trận đủ5nhóm và phản hồi từng finding kiểm được; A cập nhật A-done/HANDOFF của mình. Chưa có đủ bằng chứng thì ghi chưa đạt, không tự đóng cổng phase. T18/T19 đã có quyền làm tài liệu, không cần C cấp lại.

## T19 — sửa UX và kiểm bảng lỗi trước khi đánh dấu đạt

Sau T18, làm theo5tiêu chí UX ở trên. Bắt đầu bằng bảng lỗi và tách Invoice/request; sửa lại5checkbox của3475c36 theo nội dung thực có. Sau đó hoàn thiện form/đơn vị SOL–lamports/mapping invoiceID32, wireframe4màn desktop/mobile, storyboard165giây có duplicate tx mới và SDK decision có nguồn. Không đóng toàn bộ UX nếu chỉ sửa được bảng lỗi.

Từ repo root, lệnh dưới đây chỉ đọc file bằng Python standard library, in mã/tên chuẩn và đối chiếu bảng UX; không cài, build, test runtime hoặc ghi file. Nếu không có Python thì ghi rõ chưa chạy, không cài để chạy. Trước khi báo R1 khớp, lưu output thật trong report/A-done; exit0 chỉ xác minh mã/tên, không thay review copy/CTA hay4tiêu chí còn lại.

```sh
python3 - <<'PY'
import json, re
from pathlib import Path
idl = json.loads(Path('docs/idl/receiptrail.json').read_text())
expected = {e['code']: e['name'] for e in idl['errors']}
for code, name in expected.items():
    print(code, name)
ux = Path('docs/design/receiptrail-ux-antigravity.md').read_text()
rows = [(int(c), n) for c, n in re.findall(r'^\| (600[0-8]) \| (\w+) \|', ux, re.M)]
matched = sum(expected.get(c) == n for c, n in rows)
ok = len(rows) == len(expected) == 9 and dict(rows) == expected
print({'checked': len(rows), 'matched': matched, 'ok': ok})
raise SystemExit(0 if ok else 1)
PY
```

**Xong khi:** đủ5tiêu chí T16-R1–R5 có vị trí/evidence; bảng9/9 khớp bằng kiểm dữ liệu, state/CTA và copy đúng contract, checklist trung thực. Báo phần thiếu thay vì tick hoặc ghi đã hoàn thiện. Không sửa file nguồn để làm check đạt; audit T17 của C là snapshot lịch sử, không sửa đè.

## T20 — trả evidence T15 về các nguồn kiểm được

Sau T18/T19, sửa `docs/data/receiptrail-evidence.md` theo [review T15](../reviews/receiptrail-codex.md#review-đầu-ra-t15--18112026-0521-utc7). Bản0ec4e94 có3 hàng alternatives nhưng0 URL; câu “đã bổ sung ledger” chưa chứng minh đã đọc nguồn. Không chỉ đổi tên task hoặc thêm câu xác nhận.

1. **Bảng alternatives, ít nhất3 hàng:** tên; URL đích; ngày thực sự mở và kết quả truy cập; cơ chế nguồn hỗ trợ; giới hạn; tác động tới ReceiptRail. Đầu mối từ [note021](../learning/021-payment-cluster-evidence.md): [Stripe](https://docs.stripe.com/api/idempotent_requests), [Solana Pay spec](https://solana.com/docs/tools/solana-pay/specification/version1-1#reference), [x402 payment_identifier](https://github.com/x402-foundation/x402/blob/main/specs/extensions/payment_identifier.md); nếu nhắc [Solana Foundation Pay](https://github.com/solana-foundation/pay), mô tả bằng nguồn riêng, không gọi “cơ chế đầy đủ”. Đây là URL để A mở/đối chiếu, không bằng chứng A đã crawl.
2. **Bảng pain, hai nguồn độc lập:** tác giả/nhóm; URL; ngày bài và ngày A mở; vấn đề thực sự được kể; phạm vi/lịch sử/hệ sinh thái; giới hạn đối với ReceiptRail. [Shopify Engineering](https://shopify.engineering/building-resilient-graphql-apis-using-idempotency) và [issue452](https://github.com/x402-foundation/x402/issues/452) là hai đầu mối từ ledger, không mặc định đủ tiêu chí trước khi A đọc. Không đếm spec/note C làm pain report mới, không biến EVM thành lỗi Solana; nếu chưa xác minh nguồn thứ hai, ghi rõ **tiêu chí chưa đạt**.
3. **Bảng state riêng:** Invoice lưu Open/Paid/Cancelled; Expired chỉ là nhãn Open+slot. Merchant mới được cancel. Pending/Unknown là request; timeout đọc đúng Invoice PDA/program/cluster/commitment và signature nếu có, không tự ký/gửi mới hoặc tạo ID mới. Đối chiếu ARCHITECTURE mục4/6; không đổi contract.
4. **Phản hồi T14-R1–R4:** mỗi finding trỏ đúng mục/hàng/nguồn đã bổ sung; phần chưa xác minh ghi chưa đạt. URL không mở được phải ghi lỗi truy cập, không đoán nội dung hoặc kết luận website chết.

**Xong khi:** người khác lần theo được mọi claim tới nguồn thật và biết rõ phần chưa đạt; chỉ nhiều URL chưa đủ. A tự sửa A-done/HANDOFF để khớp kết quả và queue; không ghi “hết việc” khi T18/T19/T20 còn việc chưa thực hiện. Không sửa nguồn/IDL/thiết kế C, không cài/code/deploy/public. Không cần xin lại quyền đọc nguồn/tài liệu đã giao.

| Mã | Trạng thái | Mục tiêu và việc cần làm | File kết quả | Xong khi |
| --- | --- | --- | --- | --- |
| T11 | có bản, chưa đạt; xem T20 | Crawl/review evidence ReceiptRail: retry sau timeout, client mất cache, cùng invoice với tx mới, đối thủ Stripe idempotency/Solana Pay reference/x402 payment_identifier/Solana Foundation Pay. Tìm cả bằng chứng phản bác nhu cầu on-chain; phân biệt EVM/lịch sử với Solana hiện hành | docs/data/receiptrail-evidence.md + A-done; review C tại docs/reviews/receiptrail-codex.md | ≥3 alternatives, ≥2 nguồn pain độc lập đã mở đích thật; mỗi claim URL/ngày/nguyên văn ngắn hoặc diễn giải, giới hạn và tác động thiết kế; không tìm thấy không suy tính năng vắng mặt |
| T12 | đã review, chưa đạt; tiếp tục qua T19 | Thiết kế UX trên giấy cho ReceiptRail: merchant create/cancel; payer đọc invoice/pay; receipt; no-wallet/reject/insufficient/pending/expired/unknown; reload sau timeout không tự trả lại hoặc tạo ID mới. Đọc IDEA/ARCHITECTURE ReceiptRail hiện hành | Bản42c5523 tại docs/design/receiptrail-ux-antigravity.md; findings T12-R1–R5 tại docs/reviews/receiptrail-codex.md | T16/T17 chưa khắc phục đủ; giữ yêu cầu gốc và sửa qua T19, không đổi contract |
| T13 | đã review, chưa đạt; sửa qua T18 | Bản c591fc9 đã nhận đúng bộ8f84cfe, có verdict sơ bộ; còn claim nonce/race, thiếu ma trận phạm vi, concern rollback chưa cụ thể và giới hạn receipt | docs/reviews/receiptrail-antigravity.md; T13-R1–R4 tại review C | Giữ lịch sử; hoàn thiện bằng source/assertion/log theo T18, không tự đóng cổng review chéo hoặc sửa source |
| T14 | đã review, chưa đạt; tiếp tục qua T20 | Bổ sung T11 từ bản5b7abd5 theo review C: mỗi alternative có URL đích đã mở/ngày/claim/giới hạn; ≥2 nguồn pain độc lập, không tính spec là báo cáo sự cố. Claim “replay trap” cần đoạn nguồn cụ thể, phân biệt EVM/lịch sử và Solana. Nhận định về latency/payment channels phải có nguồn hoặc ghi giả thuyết. Tách trạng thái request UI khỏi Invoice Open/Paid/Cancelled và Unknown sau timeout | Bản b5092a4 tại docs/data/receiptrail-evidence.md; findings T14-R1–R4 tại docs/reviews/receiptrail-codex.md | C đã mở issue452/spec v1.1; bản còn thiếu nguồn/alternatives và trộn state, chưa được nhận. T15 chưa sửa đủ; tiếp tục qua T20, không đổi thiết kế hoặc điểm |
| T16 | đã review, chưa đạt; tiếp tục qua T19 | Bản a27a207 còn token selector,9/9 mã–tên lỗi sai IDL, thiếu wireframe/state/SDK và cảnh duplicate tx mới; checklist5 ô trống | docs/design/receiptrail-ux-antigravity.md; T16-R1–R5 tại review C | Giữ lịch sử; không dùng bảng lỗi T16 cho client hoặc coi A-done xong là đạt. T17 chưa sửa đủ, tiếp tục T19 |
| T17 | đã review, chưa đạt; sửa qua T19 | Bản3475c36 vẫn9/9 cặp mã lỗi sai,5 ô đã tick không khớp nội dung, trộn state và thiếu các phần UX/demo/SDK | docs/design/receiptrail-ux-antigravity.md; audit T17 và review C | Không đóng T16-R1–R5; bỏ selector mới là sửa một phần, tiếp tục T19 |
| T15 | đã review, chưa đạt; sửa qua T20 | Bản0ec4e94 tách nhóm state và ghi EVM, nhưng3 alternatives không URL, không có2 pain sources; chưa rõ PDA/authority/commitment | docs/data/receiptrail-evidence.md; review T15 tại docs/reviews/receiptrail-codex.md | Không đóng T14-R1–R4; hoàn thiện qua T20 sau T18/T19, không đổi điểm/contract |
| T18 | mới; làm ngay, đã giao | Hoàn thiện T13-R1–R4 theo ma trận5nhóm, hàm/assertion/log và giới hạn cụ thể; giải thích nonce/rollback đúng artifact đã có | Sửa docs/reviews/receiptrail-antigravity.md, báo T18 trong A-done | Mỗi finding có phản hồi/vị trí đã sửa; đọc log không khai chạy lại. Chỉ review tài liệu, không source/contract/cài/deploy/public |
| T19 | mới; sau T18, đã giao | Sửa UX theo5tiêu chí và kiểm mã/tên bằng lệnh đọc-only ở trên; trả checklist về đúng evidence | Sửa docs/design/receiptrail-ux-antigravity.md, báo T19 trong A-done | Bảng9/9 thật, đủ nội dung form/state/wireframe/demo/SDK; phần thiếu ghi chưa đạt. Không sửa source/IDL/contract/audit hoặc cài/code/deploy/public |
| T20 | mới; sau T18/T19 | Sửa evidence T15 theo4bước ở trên: sources/alternatives/pain/state và phản hồi findings kiểm được | Sửa docs/data/receiptrail-evidence.md, báo T20 trong A-done | ≥3 alternatives và2 pain sources có nguồn thật/giới hạn; thiếu thì ghi chưa đạt, không suy đọc ledger thành crawl mới |
| T8 | bỏ | Web ClusterProof giữ nguyên; không tiếp tục triển khai | evidence lịch sử giữ nguyên | Không có hành động mới |
| T9 | bỏ | Browser/Wallet ClusterProof giữ kết quả đã có; không kiểm ví tiếp | evidence lịch sử giữ nguyên | Không có hành động mới |
| T10 | bỏ | Review kiến trúc ClusterProof không còn ưu tiên | giữ kết quả nếu đã có | Không có hành động mới |

**Bản giao cho A đã push: `8f84cfe`** — [IDEA](../IDEA.md), [ARCHITECTURE](../ARCHITECTURE.md), [IDL](../idl/receiptrail.json), [tests/evidence](../evidence/phase2/README.md). T12 dùng tên lỗi và account flags trong IDL; T13 review source/tests có hash ở metadata. Thiết kế chưa được người dùng duyệt; T11–T13 chỉ crawl/tài liệu/review theo phạm vi trên, không mở code UI/deploy.

T1–T7 và các điều chỉnh trước đây giữ ở [lịch sử](../archive/A-queue-before-receiptrail.md), không lấy dòng quyền/duyệt cũ làm chỉ thị. Kết quả T6/T5 đã được C đọc và dùng có giới hạn; T11 phải kiểm nguồn thật thay vì lặp lỗi URL/quote. Không nhắn người ngoài hay đăng nhập để crawl. Khi trả kết quả, ghi commit/nguồn/phạm vi đã kiểm; fetch/pull và làm việc mới đầu tiên theo thứ tự hiện hành ở đầu queue, không đợi C duyệt từng báo cáo.
