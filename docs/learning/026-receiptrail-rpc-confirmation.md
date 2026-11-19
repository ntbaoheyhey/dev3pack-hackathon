# 026 — ReceiptRail: RPC, xác nhận và phục hồi giao dịch

- Ngày đọc: 19/11/2026, Asia/Ho_Chi_Minh. Codex; trước sự kiện.
- Phạm vi: học và thiết kế theo Prompt 04, **chưa chạy adapter devnet hoặc mở Phase 6 thật**. Mọi con số cấu hình dưới đây là đề xuất nội bộ nếu không dẫn nguồn khác.

## Tóm tắt 3 dòng

Đọc account đúng program/PDA và giữ slot/commitment cùng dữ liệu; Paid không tự có nghĩa finalized.
Timeout chỉ làm kết quả chưa rõ; giữ cùng invoice, đối soát trước mọi ý định gửi lại.
MVP dùng RPC devnet trực tiếp, chưa cần backend/indexer hoặc secret trong browser.

## Khái niệm chính

### Tìm hóa đơn và đọc bằng chứng

`getProgramAccounts` lọc account theo program với `dataSize`/`memcmp`; `withContext` cho slot của response. Đây không phải API phân trang lịch sử. Với ReceiptRail hiện hành, metadata sinh từ IDL cho size 131, merchant offset 10, payer 42, status 122, discriminator offset 0. Chọn filter merchant **hoặc** payer theo vai, tránh ghép hai điều kiện thành OR giả; sau RPC vẫn decode owner/type/version/PDA/bump bằng client. Không chép offset vào UI: lấy `CONTRACT` sinh. [RPC chính thức](https://solana.com/docs/rpc/http/getprogramaccounts), [contract repo](../PHASE4-CLIENT.md).

Đề xuất: list theo ví khi người dùng yêu cầu, chi tiết đọc một PDA bằng getAccountInfo; cache riêng `(genesis, program, address, commitment)`. `minContextSlot` là sàn slot node có thể trả, không phải chọn snapshot lịch sử hay bảo đảm mọi response cùng một fork. Không ghi đè dữ liệu mới bằng response slot thấp. Mỗi receipt giữ riêng state, contextSlot, confirmationStatus và signature nếu đã biết. [getAccountInfo](https://solana.com/docs/rpc/http/getaccountinfo), [getSignatureStatuses](https://solana.com/docs/rpc/http/getsignaturestatuses).

### Xác nhận, hết hạn, Unknown

Blockhash lifetime dùng cặp blockhash/lastValidBlockHeight từ `getLatestBlockhash`, đối chiếu **block height**, không dùng invoice expiry slot hoặc đồng hồ 60 giây để kết luận transaction hết hạn. Blockhash hết hạn không phủ nhận transaction đã vào một block trước đó và đang tăng commitment. [API](https://solana.com/docs/rpc/http/getlatestblockhash), [hướng dẫn confirmation](https://solana.com/developers/cookbook/transactions/confirmation).

Issue gốc [solana#23949](https://github.com/solana-labs/solana/issues/23949) (2022, lịch sử, đã đóng) giải thích lỗi timeout cố định và khác biệt giữa đã vào block với finalized. Không suy phiên bản SDK cache hiện nay còn nguyên lỗi đó. Chính sách ReceiptRail được chọn bảo thủ: không tự ký mới hoặc gửi lại khi timeout; nút kiểm tra lại chỉ đọc. Kết quả status=null không chứng minh chưa thực thi; thử history và account cùng PDA, giữ Unknown nếu RPC lag/không đủ dữ liệu. [Retry guide](https://solana.com/developers/cookbook/transactions/retry), [status API](https://solana.com/docs/rpc/http/getsignaturestatuses).

Trước gọi ví ghi journal không secret: operation, genesis/program, invoiceID/PDA, terms, wallet identity, blockhash/height, status. Nếu `signTransaction` có sẵn: nhận signed bytes, **kiểm lại message/instructions/accounts/fee** vì API cho phép ví trả transaction đã sửa; lấy signature và ghi trước gửi. Nếu chỉ có `signAndSendTransaction`: ví gửi trước khi app nhận signature, timeout có thể **không có signature**; phục hồi bằng cùng PDA, không bịa txid và không tự chuyển sang một phương thức ký khác. Phần đọc lại không gọi sign/send.

### Ví, mạng và phí

Cache `@solana/wallet-standard-features` 1.5.0 có hai feature tách biệt, input serialized bytes, account, chain; signTransaction trả signedTransaction, signAndSend trả signature bytes. Kiểm feature cả wallet lẫn account, chain `solana:devnet` và transaction version được hỗ trợ. Không giả định mọi extension/mobile có cùng capability. [Source chính thức](https://github.com/anza-xyz/wallet-standard), [Phantom Wallet Standard](https://docs.phantom.com/developer-powertools/wallet-standard).

Phantom công bố 4001 rejection, 4100 unauthorized, 4900 disconnected, -32002 request đang mở, -32003 transaction rejected, -32603 internal. Đây là mapping riêng Phantom, không chuẩn hóa mọi lỗi Solflare/Backpack thành 4001. SDK cache/raw events và notes 025/027 quyết định invalidation; đổi ví/account/chain phải bỏ terms đã duyệt. [Phantom errors](https://docs.phantom.com/solana/errors), [sign/send](https://docs.phantom.com/solana/sending-a-transaction). Docs provider và Wallet Standard có phạm vi khác nhau; capability thực mới quyết định đường gọi.

`getRecentPrioritizationFees` là mẫu lịch sử, có thể lọc writable accounts; không hứa tx sẽ vào block. Legacy/v0 priority fee tính trên **CU limit được yêu cầu**, không chỉ CU đã dùng. Đề xuất simulate rồi thêm 10% biên CU, cap 200k CU/tx và tổng fee 20k lamports/tx; nếu vượt cần chặn và trình, không tăng tự động. Fee/rent quote thực trước ký, không dùng sample VM làm báo giá. [Fee structure](https://solana.com/docs/core/fees/fee-structure), [fee samples](https://solana.com/docs/rpc/http/getrecentprioritizationfees).

### RPC và backend

Endpoint đề xuất `https://api.devnet.solana.com`, genesis allowlist từ evidence P4; không URL/program override từ query string. Tài liệu hiện nêu 100 requests/10s/IP, 40 requests/10s/method và 40 connections, đồng thời cảnh báo giới hạn có thể đổi; 403 có thể bị chặn, 429 theo Retry-After. Đây không phải SLA. [Clusters](https://solana.com/docs/references/clusters).

Chọn một hàng đợi RPC toàn app, tối đa 1 request/2 giây, cache/dedupe reads, backoff 429 có jitter/cap 30 giây (tôn trọng Retry-After dài hơn) và cho dừng; không vòng retry submit. Ưu tiên status+detail, không quét toàn program mỗi tick. Backend/indexer chưa cần cho vài hóa đơn demo; nếu public endpoint chặn hoặc cần lịch sử quy mô lớn, lập phương án provider/server riêng, không đưa API key vào bundle. Đây là quyết định thiết kế C, chưa phải benchmark.

## Cách làm — đặc tả chưa thực thi

1. Kiểm genesis/program/account + wallet capability; đọc terms/slot/fee/rent mới.
2. Snapshot terms → simulate → xem lại → khóa đồng bộ → journal → gọi ví đúng một lần.
3. Kiểm signed message nếu có → ghi signature → gửi một lần → theo dõi status/account; ghi lỗi chain riêng với lỗi vận chuyển.
4. Unknown/reload → chỉ đọc journal+chain. Muốn ký mới sau blockhash hết hạn cần read-back, terms mới được xác nhận và thao tác rõ của người dùng; không tự đổi invoiceID.

## Bài học / lỗi đã gặp

| Bẫy | Cách tránh |
| --- | --- |
| signAndSend timeout chưa có signature | Journal trước gọi ví; account reconciliation, không dựng signature giả |
| Slot hóa đơn lẫn blockheight giao dịch | Lưu hai trường riêng; expiry theo Clock.slot, tx lifetime theo height |
| Filter đúng rồi bỏ decode | RPC không thay owner/discriminator/PDA/version checks |
| Signed bytes mặc nhiên giống preview | So lại instruction/message sau ví trả; không broadcast bytes ngoài allowlist |
| Nguồn web tool đầu trả404 | Dùng connector search_service và nguồn chính thức; không bịa nội dung nguồn lỗi |

## Nguồn và giới hạn

Các link trên đã đọc 19/11/2026; API sống cần kiểm lại lúc triển khai. Source cache 1.5.0 đã đọc, không cài/nâng. Issue 2022 chỉ hỗ trợ bài học lịch sử. Chưa có bằng chứng compatibility 3 ví, CORS từ Site public, RPC throughput, backend hay transaction mới. T38 của A bổ sung ma trận ví/e2e; [PHASE6-PLAN](../PHASE6-PLAN.md) là bản xin quyền, chưa được duyệt.

### Bổ sung sau nhận T38

Không lấy signature bằng `slice(1,65)` như parser tổng quát. Đã đọc cache `@solana/client/node_modules/@solana/transactions/dist/types/codecs/transaction-codec.d.ts` và `signatures.d.ts`: `getTransactionDecoder` giải wire bytes, `getSignatureFromTransaction` lấy signature fee payer từ transaction. Cần kiểm đủ chữ ký và so message trước send; chưa thực thi ví thật. [Hiệu chỉnh T38](../reviews/receiptrail-t38-acceptance.md) tách nguồn extension/SDK/deeplink, chặn tạo ví và tự retry ngoài quyền.
