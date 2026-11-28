# ClusterProof web — bản nền Phase 3

React/Vite static, Node24.22.2. Khởi đầu từ cấu trúc chính thức `solana-foundation/templates`, `kit/react-vite` tại commit `9ec8eba94a98e22434356b6858defbb0e5ada8dc`; giữ attribution trong THIRD_PARTY_NOTICES.md. Tích hợp và sửa Dashboard của Antigravity tại `app/page.tsx`; chưa mở rộng thành sản phẩm Phase5/6.

```sh
npm ci --ignore-scripts --no-fund
npm test
npm run build
npm run dev
```

- `/`: đọc genesis rồi account qua RPC devnet cố định, không wallet/sign/send. Chỉ quan sát tồn tại/executable/owner/slot, chưa đối chiếu binary/ProgramData/authority/ABI/source. Không có nhãn tổng quát “an toàn” hoặc MATCH.
- `/lab`: Wallet Standard auto-discovery + `useWalletConnection`, connect/disconnect; không đọc seed/private key, không ký hay gửi giao dịch. “Tìm lại ví” tạo provider mới khi ví được đăng ký muộn.
- Trang chủ không tự đọc RPC khi mở; chỉ nút Kiểm tra gửi request. Timeout12giây, có hủy/thử lại, không fallback giả. Wallet SDK được lazy-load riêng cho lab và có thể warmup RPC khi khởi tạo provider; warmup không ký/gửi giao dịch.
- Backend/secrets/biến môi trường không cần thiết. Static host phải phục vụ `/lab`; gói xuất bản thêm `dist/lab/index.html` từ entry chung nếu host không có SPA fallback.
- Test fixtures kiểm đúng32byte, sai cluster dừng trước đọc account, provenance/confirmed, missing/non-executable, schema lỗi và HTTP429/network/timeout/cancel. Chúng không chứng minh devnet live hay ví extension thật đã kết nối.

Đã học/kiểm API trước code tại note022; kết quả build/browser/deploy được cập nhật trong `docs/evidence/phase3` và HANDOFF.
