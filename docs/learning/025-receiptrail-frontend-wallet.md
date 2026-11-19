# 025 — ReceiptRail Phase 5: Frontend, tích hợp ví và giao diện thanh toán

- **Ngày**: 2026-11-19, Asia/Ho_Chi_Minh
- **Agent**: Antigravity (trợ lý Codex)
- **Giai đoạn**: trước sự kiện; mốc viết **trước khi triển khai code UI**.

## Tóm tắt 3 dòng

Giao diện frontend phải phân định tuyệt đối giữa trạng thái hợp đồng on-chain (Open/Paid/Cancelled) và mức cam kết mạng (processed/confirmed/finalized), không suy diễn sự thành công khi RPC timeout.
Mọi số tiền SOL được xử lý nguyên vẹn bằng BigInt lamports (tối đa 9 chữ số lẻ), loại bỏ triệt để số thực Number để chống mất độ chính xác tài chính.
Tích hợp Wallet Standard chuẩn hóa vòng đời ví (connect/disconnect/reject/account-switch), tự động hủy bỏ điều khoản xác nhận khi đổi tài khoản và khóa broadcast thật trong môi trường local.

## Khái niệm chính

### 1. Ranh giới Mock và On-chain (Mock/Chain Boundary)
- Trong Phase 5 local, UI chạy ở chế độ **Local Demo / Mock Adapter** với nhãn cảnh báo rõ ràng (`MOCK / DEMO LOCAL`). Tuyệt đối không trình bày dữ liệu giả lập như giao dịch mạng thật.
- Adapter cung cấp interface chuẩn tách rời: UI chỉ giao tiếp qua contract interface (`ReceiptRailAdapter`), không phụ thuộc trực tiếp vào việc RPC thật hay Mock engine đang xử lý phía dưới. Khi Phase 6 kết nối RPC devnet thật, chỉ cần thay đổi adapter implementation mà không làm xáo trộn presentation logic.
- Khóa broadcast thật: Trong Phase 5 local, adapter không ký hay phát sóng transaction lên mạng Solana. Mọi thao tác tạo lệnh chỉ dừng ở mức kiểm tra điều khoản và dựng cấu trúc `TransactionInstruction` transport-neutral qua client sinh từ IDL của Codex.

### 2. Trạng thái Account (State) khác Mức xác nhận (Commitment)
- **Trạng thái Account on-chain** gồm 3 giá trị; Open có thể chuyển một lần sang Paid hoặc Cancelled: `Open (0)`, `Paid (1)`, `Cancelled (2)`.
- **Expired không phải là một trạng thái lưu trữ trên chain**: `Expired` là trạng thái hiển thị phái sinh của UI khi `status == Open && observedSlot >= expiresSlot`. Khi đã `Paid` hoặc `Cancelled` thì không bao giờ bị coi là `Expired`, kể cả khi slot hiện tại đã vượt qua `expiresSlot`.
- **Phân biệt với Commitment mạng**:
  - `processed`: Giao dịch đã được leader đưa vào block và thực thi (chưa có xác nhận của cluster, có thể bị rollback khi fork).
  - `confirmed`: Đã có đa số cụm validator xác nhận (supermajority voting).
  - `finalized`: Đã đạt mốc root, không thể rollback (trừ khi có sự kiện chia tách mạng mức nghiêm trọng).
- Decoder của client không tự ý gán nhãn `finalized`. UI phải hiển thị trạng thái account và commitment mạng ở hai chỉ số tách biệt. Một giao dịch có `status == Paid` kèm mức `confirmed` vẫn phải hiển thị nhãn "Chờ Finalized" thay vì tự xưng đã an toàn tuyệt đối.

### 3. Xử lý số tiền SOL: BigInt và Chuỗi thập phân, Không dùng JS Number
- Native SOL có đơn vị cơ sở là **lamport** ($1 \text{ SOL} = 10^9 \text{ lamports}$). Số tiền tối đa của `u64` là $18{,}446{,}744{,}073{,}709{,}551{,}615$ lamports ($\approx 18.4 \text{ tỷ SOL}$).
- JavaScript `Number` (IEEE 754 double precision) chỉ an toàn tới `Number.MAX_SAFE_INTEGER` ($9{,}007{,}199{,}254{,}740{,}991 \approx 9 \times 10^{15}$ lamports, tức khoảng 9 triệu SOL). Vượt qua ngưỡng này, JS Number sẽ làm tròn và mất bit thấp nhất, gây sai lệch số dư và thất bại khi đối chiếu số tiền.
- Quy tắc nghiêm ngặt:
  - Input SOL từ người dùng: Parse bằng phép tính chuỗi và số nguyên BigInt (phân tách phần nguyên và phần thập phân tối đa 9 chữ số). Từ chối ký tự mũ (`e`, `E`), số âm, khoảng trắng, NaN, và phần thập phân dài hơn 9 chữ số.
  - Sử dụng trực tiếp `parseSol(string): bigint` và `formatSol(bigint): string` từ `packages/receiptrail-client/index.mjs`.

### 4. Vòng đời Ví theo chuẩn Wallet Standard (Wallet Lifecycle)
- Chuẩn **Wallet Standard** (đặc tả `@wallet-standard/base`, `@wallet-standard/features` v1.1.1):
  - `standard:connect`: Yêu cầu kết nối và chia sẻ danh sách tài khoản công khai (`WalletAccount`). Người dùng có thể chấp thuận hoặc từ chối (`reject`). Lưu ý quan trọng: `StandardConnectMethod` không quy định mọi reject phải có mã số `code: 4001`. Các extension thực tế có thể trả về `Error('User rejected the request')` thuần chuỗi không có code. Do đó frontend cần kiểm tra linh hoạt cả mã lỗi 4001 lẫn regex chuỗi từ chối (`/reject|denied|user rejected|từ chối/i`), tránh crash hoặc bỏ sót lỗi khi ví không gắn mã 4001.
  - `standard:disconnect`: Ngắt kết nối sạch, xóa tài khoản đang chọn.
  - `standard:events`: Lắng nghe sự kiện `change` (thay đổi accounts hoặc chains).
- **Trường hợp không có ví (No-wallet)**: UI hiển thị thông báo hướng dẫn, không làm treo ứng dụng. Cho phép người dùng xem toàn bộ chi tiết hóa đơn mà không bắt buộc phải có ví (Guest viewer).
- **Từ chối kết nối hoặc từ chối ký (Reject)**: Bắt lỗi sạch sẽ, hiển thị thông báo thân thiện (ví dụ: "Người dùng đã từ chối thao tác trong ví (Rejection)"), cho phép thử lại khi người dùng sẵn sàng, không hiển thị crash hay stack trace kỹ thuật.
- **Đổi tài khoản và định danh ví (Account & Wallet Identity Change)**:
  - Khi người dùng đổi tài khoản hoặc đổi sang ví khác (kể cả cùng địa chỉ ví khác), hoặc thay đổi chains, hoặc ngắt kết nối: toàn bộ điều khoản và snapshot đã xác nhận (`createSnapshot`, `paySnapshot`, `cancelSnapshot`) phải bị hủy bỏ ngay lập tức.
  - Không được chỉ phụ thuộc vào `connectedAddress` đơn thuần; phải theo dõi chính session object, address và sự kiện raw Wallet Standard. Chuỗi tên/address/chain không phân biệt hai lần kết nối cùng ví hoặc hai wallet cùng tên; SDK1.7.0 còn bỏ chains khỏi session. Implementation hợp nhất tại `confirmation.ts` + `wallet-lifecycle.ts`.
  - Người dùng buộc phải kiểm tra lại hóa đơn với tư cách tài khoản mới trước khi được phép ký/thanh toán.
- **Bảo mật**: UI không tạo private key, không import file ví, không yêu cầu seed phrase hay mật khẩu. Khóa tính năng phát sóng thật trong môi trường local Phase 5.

### 5. Cơ chế phục hồi sự cố và trạng thái Chưa rõ (Unknown Recovery)
- Trong môi trường mạng phân tán Solana, khi gửi giao dịch gặp timeout hoặc RPC rớt kết nối, trạng thái giao dịch là **Unknown** (Chưa rõ). Giao dịch có thể đã được validator đưa vào block thành công hoặc đã bị drop.
- **Nguồn gốc chữ ký (Signature Origin)**: Trong luồng gửi giao dịch Solana, chữ ký giao dịch (signature) được tạo ra từ **bước ký offline của client trước khi phát sóng** (pre-send signature), KHÔNG PHẢI do RPC cấp mới sau khi nhận. Khi xảy ra Timeout / Unknown, client lưu giữ chính chữ ký này cùng đúng `invoiceId` và địa chỉ PDA ban đầu để phục vụ đối soát.
- **Không bao giờ coi timeout là thất bại**:
  - Không tự động gửi lại giao dịch mới (auto-resend).
  - Không tự ý sinh `invoiceId` mới khi chưa có xác nhận từ merchant/payer. Cùng một hóa đơn phải giữ nguyên `invoiceId` và địa chỉ PDA.
  - Giữ lại signature và cung cấp nút bấm "Kiểm tra lại trạng thái trên chuỗi" (Re-check on-chain).
- **Đối soát chỉ quan sát (Observational Re-check)**:
  - Thao tác Re-check on-chain phải là hành động đọc quan sát thuần túy (read-only observation).
  - Re-check không được tự ý biến đổi byte dữ liệu hoặc tự động gán `Paid` nếu giao dịch chưa được đưa vào sổ cái thực tế, hoặc nếu hóa đơn đã bị hủy (Cancelled) hay đã hết hạn (Expired) trước đó.
- **Mô phỏng sự cố (Mock Fault-Injection)**:
  - Để kiểm tra khả năng phục hồi của UI trong demo 165 giây, adapter cung cấp các kịch bản mô phỏng lỗi có nhãn rõ:
    1. *Mô phỏng Timeout / RPC Dropped*: Chuyển sang trạng thái Pending/Unknown, giữ nguyên invoice và cho phép bấm re-check để lấy trạng thái Paid thật nếu giao dịch đã được xác nhận.
    2. *Mô phỏng Rollback do thiếu số dư*: Kiểm tra rollback atomicity (principal không bị trừ, chỉ mất phí transaction).
    3. *Mô phỏng Trả trùng (Duplicate Pay)*: Kiểm tra thông báo lỗi `InvoiceNotOpen (6004)`.
    4. *Mô phỏng Sai người trả (Wrong Payer)*: Báo lỗi `WrongPayer (6006)` khi ví đang kết nối không trùng với `payer` ghi trên hóa đơn.

### 6. Kiểm thử Giao diện trên Trình duyệt (Browser Testing)
- Kiểm thử hiển thị responsive đa kích thước: Desktop ($1280 \times 800$) và Mobile ($375 \times 812$).
- Kiểm tra trợ năng (Accessibility): Nhãn form (`<label htmlFor=...`), thông báo trạng thái `aria-live="polite"`, nút bấm có focus rõ ràng, độ tương phản màu sắc đạt chuẩn WCAG.
- Hỗ trợ copy địa chỉ PDA/ví đầy đủ bằng nút tiện ích, tránh cắt ngắn địa chỉ mà không cung cấp chuỗi gốc.

## Cách làm (Code mẫu tối thiểu)

### 1. Khởi tạo Client và Adapter từ Packages có sẵn

```ts
// apps/web/src/receiptrail/adapter.ts
import { address, getAddressEncoder, getAddressDecoder, getProgramDerivedAddress } from '@solana/addresses';
import { createReceiptRailClient, PROGRAM_ADDRESS } from '../../../../packages/receiptrail-client/index.mjs';

export const receiptRailClient = createReceiptRailClient({
  addressCodec: {
    encode: (val: string) => new Uint8Array(getAddressEncoder().encode(address(val))),
    decode: (bytes: Uint8Array) => getAddressDecoder().decode(bytes),
  },
  derivePda: ({ programAddress, seeds }) => getProgramDerivedAddress({
    programAddress: address(programAddress),
    seeds,
  }),
});
```

### 2. Parse số tiền SOL an toàn bằng BigInt

```ts
import { parseSol, formatSol } from '../../../../packages/receiptrail-client/index.mjs';

// Parse đầu vào từ text box người dùng
try {
  const amountLamports: bigint = parseSol(inputString.trim());
  if (amountLamports <= 0n) throw new Error('Số tiền phải lớn hơn 0');
} catch (err) {
  // Bắt lỗi không hợp lệ (số âm, float quá 9 chữ số, ký tự lạ)
}
```

### 3. Xử lý đổi tài khoản ví làm mất Confirmed Terms & Snapshots

```ts
// Các API production trong confirmation.ts, không phải snippet giả state riêng.
const model = new ReceiptRailConfirmations();
model.sync(context); // wallet identity/address/event/chain/selection/form/slot
model.confirm('pay', reviewedInvoice, context); // copy cả invoiceId
const operation = model.begin('pay', context); // consume approval + khóa ngay
try { await executeConfirmedOperation(mockEngine, operation); }
finally { model.finish(operation); }
// React kiểm model.isCurrent(operation) trước hiển thị kết quả.
// Raw standard:events gọi invalidate() đồng bộ, kể cả chain-only event.
```

## Bài học / lỗi đã gặp

| Lỗi / bẫy | Nguyên nhân | Cách khắc phục |
|---|---|---|
| Mất độ chính xác khi dùng `parseFloat` với SOL | `parseFloat('0.000000001') * 1e9` bị làm tròn sai số IEEE 754 | Parse chuỗi trực tiếp sang BigInt lamports qua `parseSol` |
| Coi timeout mạng là thanh toán thất bại | RPC quá tải hoặc drop response nhưng transaction đã được đóng vào block | Chuyển trạng thái sang Unknown, giữ nguyên PDA/terms, cung cấp nút kiểm tra lại |
| Đổi ví nhưng vẫn giữ nút bấm thanh toán | Người dùng đổi ví trong extension nhưng state của UI vẫn giữ terms của ví cũ | Lắng nghe event `change` của Wallet Standard và xóa ngay `confirmedTerms` |
| Tự sinh invoiceId mới khi gặp lỗi | Tưởng nhầm phải retry từ đầu, dẫn đến người dùng có thể bị thanh toán 2 lần | Giữ nguyên bộ `(merchant, invoiceId, PDA)` duy nhất cho phiên thanh toán |
| Hiển thị Paid slot là finalized | `paid_slot` chỉ là slot ghi nhận trong account state, không phản ánh cluster commitment | Hiển thị tách bạch `Account State: Paid` và `Network Status: Confirmed (Chờ Finalized)` |
| Lỗi độ dài địa chỉ base58 31-bytes gây crash module scope | Địa chỉ base58 thiếu ký tự '1' đại diện byte 0 ở đầu (43 ký tự thay vì 44) khiến `getAddressEncoder().encode()` ném exception | Kiểm tra độ dài byte array (phải đủ 32 bytes) trước khi truyền vào decoder/encoder của `@solana/addresses` |

### Bài học kiểm thử browser T37 (2026-11-19)

Kiểm thử headless browser tự động trên 2 viewports (1440×900 và 375×812) phát hiện lỗi runtime uncaught exception P5-F01 tại `mock-wallets.ts:80` (địa chỉ ví từ chối `4uQeVj5tqViQh7yWWGStvfEG1Zmhx6uasJtWCJziofM` chỉ giải mã ra 31 bytes). Khi được sửa thành `14uQeVj5tqViQh7yWWGStvfEG1Zmhx6uasJtWCJziofM`, 16/16 ca kiểm thử đạt 100%. Đo lường di động chứng minh `body.scrollWidth` đạt đúng 375px (không tràn trang), bảng danh sách hóa đơn cuộn riêng (`scrollWidth = 965px`). Video demo 165s được ghi hình thực tế và đo qua `ffprobe` đạt 33.08 giây.

## Nguồn

- [Solana Wallet Standard Specification](https://github.com/wallet-standard/wallet-standard) (v1.1.1, đối chiếu 2026-11).
- [Solana Transaction Confirmation & Commitment Guide](https://solana.com/developers/guides/advanced/confirmation) (đối chiếu 2026-11).
- [Anchor 1.2.2 IDL & Account Specifications](https://www.anchor-lang.com/docs/basics/idl).
- [ReceiptRail Client Contract v0.1 (`docs/PHASE4-CLIENT.md`)](../../docs/PHASE4-CLIENT.md).
- [ReceiptRail Architecture Document (`docs/ARCHITECTURE.md`)](../../docs/ARCHITECTURE.md).

## Giới hạn tại mốc ghi chú

- Mọi thao tác trong Phase 5 local được thực hiện với Mock Adapter và local test harness; chưa kết nối RPC Devnet trực tiếp và chưa phát sóng transaction thật.
- Trình kiểm thử sử dụng Node.js test runner kết hợp với Vite preview/dev server cục bộ; chưa bao gồm các ví extension bên thứ ba trên môi trường production.
- Không tự ý cài đặt thêm dependency ngoài cache sẵn có của repo.

### C tích hợp T36 vào19/11

Nhận CSS/note từ a88ce9e và signature fix64b2573; dùng một production model củaC theo phânchia093e36b. ControllerA lưu snapshot bằng reference và gán devnet cứng trongUI nên không dùng song song; tests thay bằng production model/submit/SDK đã tích hợp. `controller.ts` cũ giữ trong Git history a88ce9e, không phải module hiện hành. Nhận định T36A về25tests là báo cáo lịch sử; kiểm bản hợp nhất xem reviewC r3. Không browser/headless/ảnh mới theo yêu cầu người dùng; CSS mới chỉ được kiểm source/build, chưa chứng minh responsive bằng render.

### Bài học C: SDK khởi tạo vẫn gọi RPC dù các nút dùng mock (19/11)

Headless C chặn được 4 request devnet trong 16 ca. Source cache @solana/client1.7.0, `dist/index.node.mjs:2926–2973` cho thấy createClient luôn gọi setCluster; setCluster:426–447 dựng lại RPC rồi warmup bằng getLatestBlockhash. Truyền rpcClient riêng cũng bị thay, nên không dùng như cơ chế tắt mạng. ReceiptRail mock chuyển sang connector Wallet Standard độc lập, không khởi tạo RPC client/provider; chỉ 4 fixture có tham chiếu nội bộ được chọn. Không vá global fetch hoặc giả RPC trả thành công. Node/headless phải kiểm không phát request, lifecycle/account/chain vẫn hủy terms; adapter tiền và program giữ nguyên.
