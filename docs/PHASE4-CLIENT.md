# ReceiptRail — hợp đồng client cho Phase 5 local

Codex · 19/11/2026 · contract v0.1. **Dùng được cho adapter local/mock; chưa có deployment ReceiptRail.** [Quyền hiện hành](ideas/DECISION.md), [note024](learning/024-receiptrail-program-client.md), [IDL](idl/receiptrail.json).

## Artifact và cách kiểm

`packages/receiptrail-client/index.mjs` + `index.d.mts` là API cho UI. `generated.mjs`/`.d.mts` sinh từ toàn IDL hiện hành:3instructions/1account/3events/9errors; không sửa tay. Generator local có phạm vi ReceiptRail, không phải Codama hoặc generator mọi Anchor IDL. Runtime chỉ dùng JavaScript chuẩn, không Buffer/Node/RPC/sign/send. Không có program override từ URL.

```sh
# Từ root repo, chỉ dùng toolchain/cache hiện có:
node scripts/generate-receiptrail-client.mjs --check
bash scripts/check-receiptrail-client.sh
```

[Lượt client r1](evidence/phase4/client-r1-2026-11-19.txt): **23/23 tests**, TypeScript strict và generated check exit0. Đối chiếu vectors Rust/real SBF, Anchor coder1.2.2, @solana/addresses4.0.0 và web3.js1.99.0. Vite8.3.8 bundle cho browser rồi chạy trong VM không Node globals/fetch; đây **chưa phải browser/wallet extension thật**. Không cài/thay manifest/lock, không gửi transaction. [Metadata/hashes](evidence/phase4/client-r1-metadata.json).

## Khởi tạo adapter

Ví dụ TypeScript cho A; điều chỉnh đường dẫn import tương đối từ file UI. `@solana/addresses4.0.0` là dependency transitive đã có trong lock/cache của apps/web; chưa nâng thành dependency trực tiếp hoặc cài mới. Nếu môi trường không resolve được, ghi blocker package/version, không tự npm install.

```ts
import { address, getAddressEncoder, getAddressDecoder, getProgramDerivedAddress } from '@solana/addresses';
import { createReceiptRailClient } from '../../../../packages/receiptrail-client/index.mjs';

const client = createReceiptRailClient({
  addressCodec: {
    encode: (value: string) => new Uint8Array(getAddressEncoder().encode(address(value))),
    decode: (value: Uint8Array) => getAddressDecoder().decode(value),
  },
  derivePda: ({ programAddress, seeds }) => getProgramDerivedAddress({
    programAddress: address(programAddress), seeds,
  }),
});
```

Adapter là code tin cậy của app, không nhận từ URL/JSON. Địa chỉ program hard-code từ IDL là **local-only** `troKmWNxjNucevGMKo9PnKdF5p6W91VDGJ2PsjYvCPg`, không có signer triển khai. Khi được phép deploy phải đổi identity có kiểm soát, build/test/sinh lại IDL/client, cập nhật allowlist và fixture cùng mốc; không ký bằng ID local này.

## API

| Hàm | Đầu vào / kết quả | Quy tắc |
| --- | --- | --- |
| `parseSol(string)` / `formatSol(bigint)` | SOL↔lamports chính xác | Tối đa9số lẻ; không Number/exponent/âm/khoảng trắng/leading-zero hoặc rounding. Parse0 hợp lệ để hiển thị; create yêu cầu>0 |
| `deriveInvoiceAddress(merchant, invoiceId)` | `{address,bump}` | invoiceId Uint8Array32bytes; seeds từ IDL, crypto dùng adapter |
| `decodeInvoice(account)` | Invoice typed | Envelope `{address,owner,executable:false,data}`; kiểm size131/discriminator/version/terms/state/canonical PDA+bump |
| `inspectInvoice(account,{walletAddress?,observedSlot?})` | invoice/expiry/displayStatus/canPay/canCancel | Slot chưa biết→Unknown expiry, không cho Pay. Paid/Cancelled không bị đổi thành Expired. Chưa kết nối ví vẫn đọc |
| `createInvoiceInstruction(input)` | `{invoiceAddress,bump,instruction}` | merchant/payer/invoiceId/amountLamports/expiresSlot/currentSlot; mọi u64 bigint; expiry phải>slot |
| `payInvoiceInstruction(input)` | instruction | envelope, signer, currentSlot bigint, confirmedTerms; đúng payer, Open, trước expiry |
| `cancelInvoiceInstruction(input)` | instruction | envelope, signer, confirmedTerms; đúng merchant, Open, kể cả đã expired |
| `getReceiptRailError(programAddress,code)` | `{code,name,msg}` hoặc null | Chỉ code nguyên trong namespace ReceiptRail; không phân loại bằng chuỗi log/hex trần |

Mọi hàm PDA/đọc/builder là async. Instruction trả `{programAddress,accounts:[{address,isSigner,isWritable}],data:Uint8Array}`. Đây là transport-neutral instruction, chưa phải transaction đã ký hoặc Kit instruction có signer object; Phase5 không chuyển sang broadcast. Generated wrappers cấp thấp chỉ encode ABI; UI nên dùng API `index.mjs` để có term/state checks.

Invoice đọc ra có `{address,version,bump,merchant,payer,invoiceId,amountLamports,expiresSlot,status,paidSlot}`. Paid tại slot0 vẫn hợp lệ nếu trước expiry; Open/Cancelled phải paidSlot0. `paidSlot` không phải slot RPC/context hoặc mức xác nhận. Decoder không biết commitment, tính mới/fork/RPC origin; adapter lưu các thứ này riêng và không suy finalized.

## Terms, ví và recovery

- `confirmedTerms` bắt buộc là snapshot đã cho người dùng xem: `{address,merchant,payer,invoiceId,amountLamports,expiresSlot}`. Copy Uint8Array khi lưu. Builders so lại toàn bộ terms với account; không chấp nhận đổi amount/recipient khi timeout. Đổi wallet/account hoặc terms thì UI bỏ xác nhận và yêu cầu xác nhận lại.
- API chụp input trước await để thay đổi object của caller không đổi instruction giữa lúc tính PDA. Kết quả typed array vẫn là dữ liệu của caller, không là chứng chỉ state; builder luôn đọc/kiểm envelope mới.
- `canPay`/`canCancel` chỉ là preflight UI trên dữ liệu đã đọc, không thay on-chain constraints hoặc xác minh chữ ký. Số dư/rent/phí/commitment/chain identity phải do adapter phù hợp xử lý; không dùng sample rent/CU VM làm báo giá mạng.
- Giữ cùng invoiceID/PDA khi Pending/Unknown. Không tự gửi/ký lại, đổi ID hoặc gọi timeout là thất bại. Paid+confirmed cần nhãn chờ finalized; logs/events không chứng minh payment thành công nếu transaction fail.
- Dữ liệu mock dùng [runtime ABI fixture](evidence/phase4/runtime-abi-r2.json) có nhãn. `cancelledHex` trong export là fixture riêng, không bằng chứng reset state. Không viết UI cho reset/close/update/refund vì program không hỗ trợ.

## A nhận T34

A dùng contract này để nối mock/local adapter và trả về các imports đã dùng, lệnh/test/build/browser evidence. Không sửa client/IDL/program; ghi finding cụ thể cho C. Tiêu chí của C: cùng invoice giữ terms khi đổi ví/timeout, amount không mất precision, vai/hạn đúng, không có đường sign/send thật. Còn cần A xác nhận sử dụng được;23tests của C không thay xác nhận này hoặc cổng CI/devnet.
