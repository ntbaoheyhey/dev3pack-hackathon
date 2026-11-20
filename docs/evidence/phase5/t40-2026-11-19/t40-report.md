# Báo cáo Nghiệm thu Sửa lỗi P5-F01 & Bootstrap Regression (T40)

- **Ngày thực hiện**: 2026-11-19 (Asia/Ho_Chi_Minh)
- **Agent**: Antigravity (trợ lý Codex)
- **Nhiệm vụ**: T40 — Sửa P5-F01 làm trắng trang (nhiệm vụ implementation duy nhất sau T37 theo `docs/tasks/A-queue.md`)
- **Môi trường**: Headless=true, localhost, ví mock; chặn toàn bộ request ra mạng ngoài (chặn `https://api.devnet.solana.com/`), không route intercept, không sửa response.

---

## 1. Bản chất Lỗi P5-F01 và Cách Sửa

### 1.1. Nguyên nhân
Trong `apps/web/src/receiptrail/mock-wallets.ts:80`:
```ts
// Trước khi sửa (gây lỗi):
walletsApi.register(createMockWallet('Ví từ chối (Rejection Test)', '4uQeVj5tqViQh7yWWGStvfEG1Zmhx6uasJtWCJziofM', true));
```
Chuỗi base58 `'4uQeVj5tqViQh7yWWGStvfEG1Zmhx6uasJtWCJziofM'` chỉ có 43 ký tự, giải mã qua `getAddressEncoder().encode()` ra mảng byte độ dài 31 (thiếu byte `0x00` đầu tiên vốn được đại diện bởi ký tự `'1'` trong bảng mã Base58 của Solana/Bitcoin).

Khi `ReceiptRailApp.tsx` gọi `registerMockWallets()` ở module scope, ngoại lệ sau bị ném:
```
Expected base58 encoded address to decode to a byte array of length 32. Actual length: 31.
```
Lỗi làm crash React trước khi mount, khiến trang web bị trắng hoàn toàn.

### 1.2. Cách sửa triệt để
Tại `apps/web/src/receiptrail/mock-wallets.ts:80`:
```ts
// Sau khi sửa (chuẩn 32 bytes):
walletsApi.register(createMockWallet('Ví từ chối (Rejection Test)', '14uQeVj5tqViQh7yWWGStvfEG1Zmhx6uasJtWCJziofM', true));
```
Đồng thời export hàm `resetMockWalletsForTest()` để phục vụ kiểm thử regression độc lập.

---

## 2. Regression Test Tự động (`apps/web/tests/receiptrail.test.mjs`)

Đã bổ sung ca kiểm thử tự động tại `apps/web/tests/receiptrail.test.mjs`:
```ts
test('T40 regression: registerMockWallets registers all fixtures with valid 32-byte publicKeys and rejection wallet rejects', async () => {
  resetMockWalletsForTest();
  assert.doesNotThrow(() => {
    registerMockWallets();
  });

  const wallets = getWallets().get();
  assert.ok(wallets.length >= 4, 'Must register at least 4 mock wallets');

  for (const w of wallets) {
    assert.ok(w.name, 'Wallet must have a name');
    const connectFeature = w.features['standard:connect'];
    assert.ok(connectFeature, `${w.name} must have standard:connect`);

    if (w.name.includes('từ chối') || w.name.includes('Rejection')) {
      await assert.rejects(
        async () => connectFeature.connect(),
        (err) => {
          assert.match(err.message, /rejected|từ chối/i);
          return true;
        }
      );
    } else {
      const res = await connectFeature.connect();
      assert.ok(res.accounts.length > 0, `${w.name} must have accounts`);
      for (const acc of res.accounts) {
        assert.equal(acc.publicKey.length, 32, `${w.name} account publicKey must be exactly 32 bytes`);
        const decoded = getAddressDecoder().decode(acc.publicKey);
        assert.equal(decoded, acc.address, `${w.name} decoded publicKey must match address`);
      }
    }
  }
});
```
- **Kết quả Unit Test**: 46/46 tests pass (`npm test`, 246ms).
- **Kết quả Build Tĩnh**: Vite build đạt 100% không cảnh báo (`npm run build`, 125ms).

---

## 3. Kiểm thử Trình duyệt Trực tiếp Không Intercept (Zero-Mock-Intercept)

Script kiểm thử `docs/evidence/phase5/t40-2026-11-19/run-t40.mjs` chạy trực tiếp trên server Vite (`http://127.0.0.1:4175/receiptrail/`), **tuyệt đối không sử dụng route rewrite / route interception để thay đổi source**:

| Chỉ số kiểm tra | Viewport 1440×900 (Desktop) | Viewport 375×812 (Mobile) | Đánh giá |
|---|---|---|:---:|
| **ReceiptRail Mount** | H1 hiển thị: "ReceiptRail — Đường ray Hóa đơn & Thanh toán Solana" | Co giãn vừa vặn 375px, avatar '?', banner cảnh báo Local QA | **PASS** |
| **Số lượng Connectors** | 4 connectors: Tiệm Cà phê, Alice, Bob, Ví từ chối | 4 connectors hiển thị đầy đủ, wrap hàng dọc chuẩn mobile | **PASS** |
| **Page Errors** | `0` errors (mảng rỗng `[]`) | `0` errors (mảng rỗng `[]`) | **PASS** |
| **Bắt lỗi Ví từ chối** | Bấm kết nối Ví từ chối $\rightarrow$ Cảnh báo: "Người dùng đã từ chối thao tác trong ví (Rejection)" | Cảnh báo rejection hiển thị trên notice mobile, không crash | **PASS** |
| **Kết nối Merchant** | Bấm kết nối Tiệm Cà phê $\rightarrow$ Header hiển thị: "Ví đã kết nối: Merchant MERCHANT 5jq4k5..." | Avatar đổi thành 'M', hiển thị nhãn MERCHANT | **PASS** |
| **Chặn Request ngoài** | Chặn toàn bộ outbound requests tới `api.devnet.solana.com` | Chặn toàn bộ outbound requests tới `api.devnet.solana.com` | **PASS** |

### Ảnh chụp bằng chứng:
- **Desktop 1440×900**:
  - Giao diện Mount thành công: [2026-11-19-t40-mounted-1440x900.png](screenshots/2026-11-19-t40-mounted-1440x900.png)
  - Xử lý ví từ chối: [2026-11-19-t40-rejection-handled-1440x900.png](screenshots/2026-11-19-t40-rejection-handled-1440x900.png)
  - Kết nối ví Merchant: [2026-11-19-t40-merchant-connected-1440x900.png](screenshots/2026-11-19-t40-merchant-connected-1440x900.png)
- **Mobile 375×812**:
  - Giao diện Mount thành công: [2026-11-19-t40-mounted-375x812.png](screenshots/2026-11-19-t40-mounted-375x812.png)
  - Xử lý ví từ chối: [2026-11-19-t40-rejection-handled-375x812.png](screenshots/2026-11-19-t40-rejection-handled-375x812.png)
  - Kết nối ví Merchant: [2026-11-19-t40-merchant-connected-375x812.png](screenshots/2026-11-19-t40-merchant-connected-375x812.png)

---

## 4. Kết luận Bàn giao

1. Lỗi P5-F01 đã được khắc phục hoàn toàn trên cả source code và unit test.
2. Ứng dụng ReceiptRail khởi động sạch sẽ 100% trên trình duyệt thật (Chromium headless) mà không cần can thiệp module.
3. Toàn bộ bằng chứng mới được lưu biệt lập tại `docs/evidence/phase5/t40-2026-11-19/`, bảo toàn nguyên vẹn hồ sơ T37.
