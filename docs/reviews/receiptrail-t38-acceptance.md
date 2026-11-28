# ReceiptRail — nhận T38 một lượt và hiệu chỉnh contract nghiên cứu

Codex · 19/11/2026 · bài A `11d58b1`, [note 027](../learning/027-receiptrail-wallet-e2e.md). Nhận bộ 8 tình huống lỗi, phân biệt mock/extension và khung bằng chứng e2e. Các nhận định sau chưa đủ hoặc sai; dùng hiệu chỉnh này cùng [026](../learning/026-receiptrail-rpc-confirmation.md)/[PHASE6-PLAN](../PHASE6-PLAN.md) khi triển khai. Không yêu cầu A nộp lại report, không mở quyền mới.

| Nội dung T38 | Hiệu chỉnh áp dụng |
| --- | --- |
| Versions v24.x/v1.x/v0.1.x và hành vi cụ thể của ba extension | Chưa có evidence version/run thực. Ghi chưa xác định, không nhận là compatibility đã kiểm. Tên/slugs không phải ID Wallet Standard cố định; discovery và capability thực quyết định |
| Mọi ví đều có cả signTransaction/signAndSend | Kiểm wallet.features, account.features/chains và supportedTransactionVersions; không giả định có cả hai. SignAndSend có thể gửi trước khi app nhận signature |
| `signedBytes.slice(1, 65)` | Không nhận là parser tổng quát. Dùng codec SDK đúng version, kiểm signed message/required signatures và lấy signature fee payer. Cache đã đối chiếu `getTransactionDecoder` + `getSignatureFromTransaction` tại `@solana/client/node_modules/@solana/transactions/dist/types/{codecs/transaction-codec,signatures}.d.ts`; chưa gọi ký hoặc gửi |
| Timeout 60s, 151 slots là kết luận hết hạn | Đây không phải điều kiện quyết định. So block height với lastValidBlockHeight và đối soát status/history/account; hết blockhash không phủ nhận tx đã vào block trước đó |
| Unknown “khóa vĩnh viễn”, mất phản hồi luôn có pre-send signature | Khóa đến khi đủ bằng chứng; signAndSend có thể chưa trả signature. Giữ intent/PDA, không bịa txid; không tự đổi ID hoặc ký lại |
| 429 đưa transaction vào hàng đợi gửi lại, online tự thử lại | Backoff chỉ đọc; tôn trọng Retry-After. Lượt submit chưa rõ vẫn Unknown. Sự kiện online không kích hoạt sign/send |
| Regex rejection → “chưa trừ tiền” | Chỉ kết luận reject trước gửi khi có bằng chứng của đúng bước. Lỗi sau broadcast không chứng minh chưa thực thi; message/regex chỉ giúp diễn đạt, không quyết định trạng thái tiền |
| Tạo hai ví devnet và xin faucet trong bước chuẩn bị | Không được làm theo quyền hiện hành. Chỉ signers/account cũ theo PHASE6-PLAN; thiếu thì ghi chưa kiểm. Không tạo/import signer hoặc xin faucet tự động |
| `docs.backpack.exchange` làm bằng chứng ví | Không nhận: đây không phải nguồn chứng minh Wallet Standard của Backpack Wallet. Nguồn wallet đúng bên dưới, nhưng deeplink không chứng minh extension |

## Ma trận nguồn có thể dùng — đọc 19/11/2026

| Ví | Nguồn chính thức đã đối chiếu | Điều chứng minh / chưa chứng minh |
| --- | --- | --- |
| Phantom | [Wallet Standard](https://docs.phantom.com/developer-powertools/wallet-standard), [errors](https://docs.phantom.com/solana/errors) | Có Wallet Standard; hai features ký là riêng và capability cần kiểm theo account. Errors thuộc API Phantom, không chuẩn hóa mọi ví; version/account extension trên máy chưa kiểm |
| Solflare | [Tích hợp](https://docs.solflare.com/solflare/technical/integrate-solflare), [SDK](https://docs.solflare.com/solflare/technical/integrate-solflare/solflare-wallet-sdk) | Docs SDK phân biệt ký và ký/gửi. Không đủ suy API SDK này chính là Wallet Standard đang cài hoặc hành vi mọi version; extension chưa kiểm |
| Backpack | [Wallet docs](https://docs.backpack.app/), [SignTransaction](https://docs.backpack.app/deeplinks/provider-methods/signtransaction), [SignAndSendTransaction](https://docs.backpack.app/deeplinks/provider-methods/signandsendtransaction) | Deeplink phân biệt trả transaction đã ký với gửi rồi trả signature. Không chứng minh feature/version extension, code lỗi hay mạng thực trên máy. llms.txt không đọc được qua tool, không suy nội dung |

Điểm chung: dùng discovery Wallet Standard cache; ví không đủ capability thì khóa thao tác và giải thích. Không đổi sang window provider hoặc cài SDK mới để lấp một ô trong ma trận. Cần ghi version/capability/events/actual khi người dùng tự kiểm ví sau quyền P6.

## Nợ còn lại D06

Version/capability/reject/chain events của extension và thiết bị thật chưa có evidence. Giữ dưới nhãn chưa kiểm; nhận T38 cho kế hoạch học, không đóng cổng ví thật hoặc Phase 6. T39 là checklist độc lập, không là một vòng sửa T38.
