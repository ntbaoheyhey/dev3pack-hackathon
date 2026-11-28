# Phase 6 — phương án tích hợp ReceiptRail trên devnet

Codex · 19/11/2026, cập nhật20/11 · **người dùng đã mở Phase6**, log lượt08:38:01 UTC+7. Được code/test local và CLI devnet với signers cũ, tổng cap0.05SOL; public mock riêng được duyệt, web giao dịch thật chưa được public. C phụ trách program/client/adapter; A phụ trách UX và e2e qua hàng đợi. [Quyền hiện tại](ideas/DECISION.md) · [Note RPC](learning/026-receiptrail-rpc-confirmation.md) · [Tự review bảo mật](reviews/receiptrail-security-r1.md). Các chữ “đề xuất/chưa duyệt” ở bản trình lịch sử bên dưới đã được thay đúng phạm vi DECISION, không bỏ các điều kiện kiểm trước send.

## 1. Kết quả và phạm vi đề xuất

Thay adapter mock bằng adapter devnet dùng client sinh từ IDL hiện hành. Người xem đọc hóa đơn không cần ví; Create, Pay và Cancel cần xem lại điều khoản rồi ký. Giữ chế độ mock riêng, nhãn và journal riêng; RPC lỗi không tự chuyển chế độ. MVP chưa cần backend hoặc indexer.

Dùng program đã triển khai `8NGSPufBmGB1oHqaZpY1jhJYz1X4gqFiNXCQmxfapYko`. Trước lượt thử, kiểm read-only genesis devnet, program executable, owner, authority và bytecode theo bằng chứng P4. Không nhận RPC hoặc program override từ URL hóa đơn. Không deploy/upgrade program, tạo signer, cài thêm, đổi authority, billing hoặc dùng mainnet.

| Bước sau khi được duyệt | Đầu ra | Điều kiện trước bước tiếp |
| --- | --- | --- |
| P6-1: đọc dữ liệu | C viết adapter query theo ví/PDA; A nối trạng thái đọc và lỗi | Tests bằng cache cho owner/PDA/schema, context/slot, stale response và RPC lỗi |
| P6-2: chuẩn bị giao dịch | Builder, journal, kiểm ngân sách, recovery; UI giữ terms snapshot | Unit và headless e2e localhost/mock; kiểm bytes ví trả; chưa gửi mạng |
| P6-3: CLI devnet có giới hạn | Dùng merchant/payer cũ, hóa đơn thử mới; lưu signatures và đối soát | Review/tests đạt; quyền P6, balance/rent/fee quote và reserve được ghi trước mỗi send |
| P6-4: ví extension | Người dùng tự thao tác account devnet đã có | Ghi ví/version/capability, expected/actual và signature; ví chưa có ghi chưa kiểm |
| P6-5: bản tích hợp công khai | Chốt artifact mới và trình quyền public bản devnet | Quyền public mock không cho phép tự thay bằng web giao dịch thật |

Mở Phase 6 cho phép bắt đầu tích hợp theo phạm vi được chọn; không có nghĩa cổng ra đã đạt. Cổng ra thật vẫn cần luồng ví thật trên link công khai đã được duyệt và bằng chứng giao dịch.

## 2. RPC và dữ liệu

Đề xuất `https://api.devnet.solana.com`, không API key hoặc subscription mới. Một hàng đợi toàn app, tối đa 1 request/2 giây, cache/dedupe và ưu tiên detail/status. Với 429, tôn trọng `Retry-After`; backoff tự tính có jitter, tối đa 30 giây, còn thời gian máy chủ yêu cầu dài hơn thì đợi đủ hoặc để người dùng kiểm lại. Với 403, báo bị chặn. Không tự đổi provider để lách giới hạn. Public RPC không có SLA; nếu CORS/rate limit không đáp ứng, trình provider riêng. [Nguồn chính thức](https://solana.com/docs/references/clusters).

List dùng `getProgramAccounts` với `withContext`, base64, `dataSize=131`, discriminator và **merchant hoặc payer** lấy từ `CONTRACT` sinh. Không ghép hai filter thành OR giả hoặc quét toàn program mỗi tick. Detail dùng `getAccountInfo`; client kiểm owner, type, size, version, PDA và canonical bump. Filter không thay kiểm quyền/account. Giữ `contextSlot` và commitment riêng với Invoice; chưa biết clock thì khóa Pay. `minContextSlot` không chọn snapshot lịch sử. Subscription, nếu dùng, chỉ kích hoạt read-back. [getProgramAccounts](https://solana.com/docs/rpc/http/getprogramaccounts).

## 3. Ví và giao dịch

Ưu tiên Phantom nếu người dùng đã có extension/account devnet; Solflare và Backpack nằm trong ma trận T38. Không cài ví hoặc tạo/import account mới. Không yêu cầu seed hoặc mật khẩu. Không điều khiển màn hình người dùng.

- Dùng Wallet Standard discovery/connect/disconnect/events. Kiểm feature ở cả wallet và account, chain `solana:devnet`, version giao dịch được hỗ trợ. Dùng legacy/v0 theo cache và capability; không tự nâng phiên bản.
- Nếu có `solana:signTransaction`: build từ IDL, simulate, quote, review, khóa thao tác và ghi intent trước khi gọi ví. Sau ký, decode và so message/instructions/accounts/recipient/amount/fee với bản đã duyệt; ghi signature trước một lần gửi bytes đã kiểm.
- Nếu chỉ có `solana:signAndSendTransaction`: một nhánh riêng đã được test, ghi intent trước gọi ví, chỉ định devnet và tùy chọn `maxRetries: 0`, `skipPreflight: false` khi API hỗ trợ. Ví gửi trước khi app nhận kết quả; app không thể kiểm signed bytes trước broadcast. Đây là trust boundary cần hiển thị và kiểm riêng, không fallback tự động từ nhánh khác. Timeout có thể chưa có signature; giữ Unknown và đối soát PDA, không bịa txid.
- Wallet/account/chain/session đổi, kể cả đổi ví cùng address, phải bỏ terms đã xác nhận. URL không mang quyền ký. Trong flow hóa đơn chỉ cho 3 instructions ReceiptRail và ComputeBudget cần thiết; không chèn approve, đổi authority hoặc transfer khác.

[Note 026 và nguồn/types đã đọc](learning/026-receiptrail-rpc-confirmation.md). T38 đã nhận một lượt; [hiệu chỉnh và nguồn ba ví](reviews/receiptrail-t38-acceptance.md) áp dụng thay claims chưa chứng minh ở note 027. Ma trận extension thực tế còn chưa kiểm. Quyền headless của Prompt 04 chỉ bao gồm localhost/mock; không dùng quyền đó để ký devnet trong browser.

## 4. Unknown và thử lại

Journal browser không chứa secret; CLI journal nằm ngoài Git. Phạm vi khóa là `(genesis, program, invoicePDA, operation, wallet)`. Lưu intent/terms/blockhash/height và signature nếu có, u64 dưới dạng chuỗi. Không log signed bytes công khai. Reload phải đối soát chain trước khi mở lại thao tác.

| Quan sát | Hành vi cần có |
| --- | --- |
| Ví từ chối rõ trước gửi | Báo từ chối; không ghi Paid hoặc tự gọi ví lại |
| Mất phản hồi hoặc signAndSend timeout | Unknown; giữ invoice/terms/intent/signature nếu có; recheck chỉ đọc |
| Chain trả lỗi transaction | Hiển thị đúng namespace ReceiptRail/System; principal có thể rollback nhưng phí vẫn mất |
| Paid ở commitment confirmed | Hiển thị Paid và confirmed riêng, tiếp tục đọc finalized |
| Status null | Hỏi history và đọc PDA; thiếu bằng chứng vẫn Unknown |
| Block height vượt lastValidBlockHeight | Đối soát status/account; không đảo Paid thành failed hay tự ký/gửi mới |
| Người dùng muốn thử lại | Chỉ sau khi lượt cũ đã được đối soát, Invoice còn Open/chưa hết hạn, terms đúng và người dùng xác nhận lại; không tự đổi invoiceID |

Không durable nonce trong MVP. Block height của transaction khác `Clock.slot` của hạn hóa đơn. [Confirmation](https://solana.com/developers/cookbook/transactions/confirmation) · [status](https://solana.com/docs/rpc/http/getsignaturestatuses) · [retry](https://solana.com/developers/cookbook/transactions/retry).

## 5. Signers và trần đề xuất: 0.05 SOL devnet

**Đã được duyệt trần này20/11; chưa có khoản chi P6 khi ghi quyền.** Chỉ gửi sau review/tests, kiểm identity và reserve đúng quy trình. Tái dùng public identities từ [P4](evidence/phase4/deployment-identity.json):

| Vai | Public key / phạm vi |
| --- | --- |
| Nguồn funding/fee CLI | `GQRoDMoWFV2nhgwm3bZGvSCC1LSa2wRkLeeJg8NhbFM2` |
| Merchant CLI | `HtQYFnFqUrkAfnKLpLaTgZrvjivJ3ZWPTqsCv6Kru4y2` |
| Payer CLI | `DPKxAZhBq4aJYn4FbHFn19easT1KRcv31YNweGKZnyrc` |
| Program/buffer | Giữ file cũ ngoài Git; không dùng ký hoặc deploy trong P6 |
| Ví extension | Người dùng tự chọn account devnet đã có; chưa biết address, chưa nằm trong funding tự động |

Chỉ CLI đọc signers cũ sau quyền P6, không import key vào browser hoặc dựng dịch vụ HTTP ký tùy ý. Không đọc key trong lượt nghiên cứu này.

Ngân sách tính **tổng khoản chi từ mọi ví thử**, không bù khoản nhận trở lại. Mỗi transfer tính một lần tại nguồn; funding nội bộ cũng tính, rồi tính tiếp khoản chi về sau nên đây là trần bảo thủ.

| Khoản | Giới hạn |
| --- | ---: |
| Funding bổ sung cho 2 ví CLI cũ | 0.020000 SOL |
| Tối đa 6 Invoice, rent quote không quá 0.003 SOL/Invoice | 0.018000 SOL |
| Tối đa 6 Pay, principal không quá 0.001 SOL/lần | 0.006000 SOL |
| Tối đa 40 tx, gồm funding và failed tx; total fee không quá 0.000020 SOL/tx | 0.000800 SOL |
| Biên dự phòng, không tự nâng các hạn mức phía trên | 0.005200 SOL |
| **Trần tổng chi** | **0.050000 SOL** |

Trước mỗi send, lấy balance/rent/fee thực, kiểm từng hạn mức và ghi reserve vào journal. Unknown giữ reserve đến khi đối soát, không chi hai lần. Quote vượt giới hạn hoặc thiếu balance thì dừng nhánh gửi mạng; không tự airdrop/nâng cap. Đề xuất CU limit = simulation + 10%, tối đa 200k CU, total fee vẫn trong cap; quote lịch sử không bảo đảm inclusion. Đây là dự toán, chưa phải RPC quote hiện thời. [Fee structure](https://solana.com/docs/core/fees/fee-structure).

Wrong role/malformed/duplicate ưu tiên fixture và simulation. Lượt devnet dùng invoiceID mới gắn run ID, không chạy lại helper deploy/smoke P4-B hoặc 162 tx cũ. Bằng chứng gồm intent, instructions/recipient, một signature/send, finality, state và bảng đối soát mọi khoản chi.

## 6. Public mock để đóng cổng Phase 5 — quyết định riêng

Đề xuất Site mới **ReceiptRail Mock Demo**, audience **public — bất kỳ ai có URL đều xem được**. Không mời email. Chỉ mock có nhãn sát thao tác; không sign/send/RPC devnet. Không cập nhật Site ClusterProof hoặc dùng lại project ID của nó.

Source ứng dụng đã chốt tại **106a18e**. T40 sửa bootstrap; C tách connector mock không RPC và fixture registry lặp an toàn. Entry riêng chỉ ReceiptRail ở root, không bundle entry ClusterProof/lab. 52 tests/build, 16 ca source + 2 ca slot, 10 ca static và video162.12s đạt; xem [review r4](reviews/receiptrail-phase5-r4.md) và [bản trình Phase5](PHASE5-PLAN.md).

[Artifact/source hashes](evidence/phase5/mock-artifact-2026-11-20/artifact.json) giữ source commit và ba output hashes. ZIP local sandbox/artifacts/receiptrail-mock-2026-11-20.zip có SHA256 b9268dc6de8ac6aa94fae282b40a8c0ed96657ecc8249c7922d3f451edc2c3d4, chưa phải gói publication. Chưa đăng ký Site hoặc có URL ReceiptRail công khai.

Sau đồng ý, theo quy trình Sites: tạo một Site riêng; lưu ID trong snapshot riêng; chuẩn bị manifest/static dist và source đã kiểm không có secret; lưu version khớp snapshot; đặt đúng audience và deploy version đó; đọc lại status/audience/URL. Không tự cài dependencies hoặc thay billing. Bản mock không tự được thay bằng adapter thật từ quyền public mock.

## 7. Kiểm và tiêu chí nhận

| Lớp | Các trường hợp bắt buộc |
| --- | --- |
| Unit/integration bằng production adapter | Query/schema/owner/PDA; malformed/stale RPC; state khác commitment; u64/fees; ví trả bytes bị đổi; invalidation/disconnect/double click; reload journal; Unknown có/không signature; 429/403; blockhash hết hạn |
| Headless localhost/mock bằng cache | Create → review → Pay → receipt; duplicate; Cancel/Expired; cả hai Unknown; reject; account/chain change; reload; desktop/mobile/focus. Chặn request ngoài localhost |
| CLI sau quyền P6 | Kiểm intent/send/signature, finality/accounting/cap; Paid đúng terms, Cancel, duplicate simulation. Không gọi CLI là kiểm extension |
| Ví thật | Người dùng tự thao tác; lưu tên/version/capability/address/devnet/signature/bước/expected/actual. Ví và thiết bị chưa có ghi chưa kiểm |
| Cổng Phase 6 | Browser ký thật qua Site public đã được duyệt, logs và signatures khớp snapshot. Không tự kết luận từ mock hoặc CLI |

## 8. Ba quyết định hỏi gộp sau T37 review

1. Public mock trên Site riêng với audience và snapshot mục 6: đề xuất đồng ý **khi T37 đạt**, hoặc giữ local.
2. Mở Phase 6 theo phương án này, signers cũ và trần **0.05 SOL devnet**: đề xuất đồng ý, hoặc tiếp tục chỉ chuẩn bị. Không kèm upgrade/cài thêm/signer mới/public bản thật.
3. Merge PR #7 `work → main`: đề xuất **giữ PR mở** trong khi tích hợp, hoặc merge mốc hiện hành nếu người dùng muốn chốt. Không suy quyền merge từ duyệt hai mục trên.

Đây là các đề xuất của C, chưa phải quyết định của người dùng. Chỉ gửi câu hỏi khi T37 đã được review và artifact đủ cụ thể.
