# 029 — Ma trận ví, thiết bị và phương pháp kiểm thử Bug Bash Phase 7

> **C hiệu chỉnh20/11:** xem [nhận T39](../reviews/receiptrail-t39-acceptance.md). Expired là Open+slot>=expiry, không dùng block height; Cancel không close/hoàn rent; discovery nhận registry ví chứ app không tự đăng ký extension thật. 44×44 là mục tiêu UX nội bộ. Không lấy số mẫu làm quote/quyền chi hoặc coi viewport/mock là ví/thiết bị thật.

- Antigravity · 19/11/2026 · học trước checklist `docs/PHASE7-BUG-BASH.md` theo task T39.

## Tóm tắt 3 dòng

Checklist bug bash bao phủ 10 chiều: thiết bị, 3 ví, a11y, tiền, hạn slot, double-click, Unknown, 429, commitment và mock label.
Toàn bộ ca kiểm thử thuộc phạm vi ví thật/devnet được gán mặc định "Chưa chạy", tách biệt tuyệt đối với local mock Phase 5.
Phân cấp lỗi P0/P1/P2/P3 rõ ràng; mỗi ca quy định bước tái hiện, điều kiện tiên quyết và yêu cầu bằng chứng đối soát.

## Khái niệm chính & 10 chiều kiểm thử

Tài liệu được xây dựng nhằm chuẩn bị cho đợt kiểm thử diện rộng (Bug Bash) trong Phase 7 của ReceiptRail, kế thừa các bài học từ T37 (kiểm thử headless, phát hiện P5-F01), T38 (nghiên cứu ví và ma trận lỗi Wallet Standard), T40 (sửa lỗi fixture 32 bytes) và phản biện/hiệu chỉnh của Codex tại [review T38](../reviews/receiptrail-t38-acceptance.md) cùng [note 028](028-receiptrail-security-review.md).

Bug bash không chỉ là kiểm tra luồng thông thường ("happy path"), mà tập trung vào các tình huống biên (edge cases), xung đột bất đồng bộ, ngắt kết nối mạng và hành vi khác biệt giữa các phần mềm ví mở rộng (extension) trên thiết bị thật.

### 10 chiều kiểm thử trọng yếu

| STT | Chiều kiểm thử | Khái niệm & Yêu cầu kỹ thuật | Rủi ro nếu bỏ sót |
|---|---|---|---|
| 1 | **Thiết bị & Viewport** | Kiểm thử trên Desktop (1440×900, 1920×1080) và Mobile (375×812, 412×915). Toàn trang không tràn ngang (`scrollWidth === clientWidth`, 0px window overflow); bảng dữ liệu dài phải cuộn trong container riêng (`.rr-table-wrapper`). Touch target tối thiểu 44×44px theo chuẩn WCAG. | Tràn layout trên mobile, người dùng không thể nhấn nút thanh toán hoặc đọc chi tiết hóa đơn. |
| 2 | **3 Ví Wallet Standard** | Khảo sát Phantom, Solflare, Backpack. Kiểm tra discovery qua `getWallets().register()`, capability `wallet.features` (`standard:connect`, `solana:signTransaction`, `solana:signAndSendTransaction`). Xử lý reject không phụ thuộc mã 4001; nhận diện chuyển đổi account (`standard:events`). | Crash ứng dụng khi gặp ví không trả mã 4001 hoặc ví không hỗ trợ đủ tính năng ký. |
| 3 | **Bàn phím & Accessibility (a11y)** | Duyệt toàn bộ luồng bằng phím `Tab` / `Shift+Tab`. Focus ring hiển thị rõ nét trên mọi trường input, button. Vùng thông báo trạng thái có thuộc tính `aria-live="polite"`. Nút sao chép địa chỉ công khai có nhãn trợ năng. Tương phản màu đạt chuẩn WCAG 2.1 AA. | Người dùng khiếm thị hoặc người dùng bàn phím chuyên biệt bị kẹt, không thể thao tác. |
| 4 | **Tính toán Tiền tệ (Amount)** | Sử dụng BigInt lamports (1 SOL = $10^9$ lamports). Kiểm tra chuỗi nhập liệu thập phân tối đa 9 chữ số. Chặn số âm, số 0, số mũ khoa học (`1e-9`), số có quá 9 chữ số thập phân (`0.0000000001`), chuỗi rác (`abc`). Không dùng `parseFloat` gây sai số IEEE 754. | Sai lệch số dư lamports, giao dịch bị từ chối on-chain hoặc người dùng thanh toán sai số tiền. |
| 5 | **Thời hạn & Phân quyền Vai trò** | Slot hạn tính theo block height/slot hiện tại (`current_slot + duration`). Trạng thái Expired tự động suy diễn khi `current_slot > expiry_slot`. Phân quyền nghiêm ngặt: Chỉ Merchant được Cancel, chỉ Payer được Pay; Guest/Viewer không ví chỉ đọc; hóa đơn Paid bị khóa hoàn toàn. | Merchant không thể thu hồi hóa đơn hết hạn; người lạ thanh toán thay hoặc hủy hóa đơn của người khác. |
| 6 | **Khóa tương tác & Double Submit** | In-flight submission lock: Khi người dùng nhấn Create/Pay/Cancel, nút tương tác phải bị `disabled` ngay lập tức trước khi await bất kỳ Promise nào. Chặn hoàn toàn double-click hoặc race-condition gửi 2 lệnh liên tiếp. Snapshot duyệt terms bất biến. | Gửi giao dịch trùng lặp, trừ tiền 2 lần hoặc tốn 2 lần phí rent hóa đơn. |
| 7 | **Khả năng phục hồi (Resilience)** | Khi tải lại trang (F5 / reload) hoặc gián đoạn phiên, hóa đơn và trạng thái phiên được khôi phục. Tình huống Unknown (timeout mạng sau khi ký) giữ nguyên bộ nhận diện `(merchant, invoiceId, PDA)` và signature; nút "Kiểm tra lại" (Recheck) có tính lũy đẳng (idempotent), không tự sinh ID mới. | Người dùng hoang mang khi bị trừ tiền nhưng trang báo lỗi, sau đó tạo lại hóa đơn mới dẫn đến trả 2 lần. |
| 8 | **Mạng & Rate Limiting (429)** | Khi RPC trả về HTTP 429 Too Many Requests hoặc mạng mất kết nối (`navigator.onLine === false`), hệ thống hiển thị thông báo rõ ràng, thực hiện backoff đọc trạng thái (tôn trọng header `Retry-After`), tuyệt đối không tự động phát sóng lại giao dịch cũ. | Bị RPC block IP vĩnh viễn; giao dịch bị kẹt không có phản hồi cho người dùng. |
| 9 | **Trạng thái vs Cam kết mạng** | Phân tách hiển thị độc lập: (1) Trạng thái Account State on-chain (`Open`, `Paid`, `Cancelled`), và (2) Cấp độ cam kết xác nhận mạng (`Processed`, `Confirmed`, `Finalized`). Không bao giờ ghi nhãn Paid slot là "Finalized" khi cluster mới ở mức Confirmed. | Nhầm lẫn về tính an toàn thanh toán; merchant giải phóng hàng hóa khi giao dịch có nguy cơ bị rollback do reorg. |
| 10 | **Nhãn Mock & Explorer Link** | Trong môi trường thử nghiệm/mock, toàn bộ nhãn phải hiển thị rõ `[MOCK TESTNET]` hoặc `[MOCK WALLET]`, không giả mạo là tiền thật. Các liên kết kiểm tra giao dịch trên Solana Explorer phải gắn đúng cluster devnet/custom RPC (`?cluster=devnet`), không trỏ về mainnet-beta. | Đánh lừa người dùng hoặc giám khảo về tính chất tiền tệ; liên kết explorer dẫn đến trang 404 trên mainnet. |

---

## Phân cấp mức độ nghiêm trọng (Severity Matrix)

Định nghĩa mức độ lỗi áp dụng đồng bộ trong checklist Phase 7, tuân thủ nguyên tắc an toàn tài sản và trải nghiệm người dùng:

- **P0 — Blocker (Chặn phát hành)**:
  - Nguy cơ thất thoát SOL / lamports của người dùng hoặc merchant.
  - Vi phạm bất biến sổ cái (ghi đè hóa đơn đã có, thanh toán 2 lần cho cùng một hóa đơn).
  - Uncaught Exception gây crash module scope làm trắng trang (như lỗi P5-F01 đã bắt ở T37).
  - Gửi giao dịch thật ra mainnet ngoài ý muốn hoặc ký giao dịch mà không có sự đồng ý của ví.

- **P1 — Critical (Lỗi nghiêm trọng, chặn phát hành)**:
  - Cho phép thao tác thanh toán / hủy khi vi phạm vai trò (Payer hủy được đơn, Viewer trả được đơn).
  - Lỗi bất đồng bộ làm kẹt luồng thanh toán vĩnh viễn không có đường phục hồi.
  - Tự động thay đổi bộ nhận diện `(merchant, invoiceId, PDA)` sau khi timeout, làm mất vết giao dịch.
  - Bỏ qua bước xác nhận điều khoản (terms review) trước khi gọi ví ký.

- **P2 — Major (Lỗi lớn, cần khắc phục trước khi demo)**:
  - Giao diện bị vỡ layout, tràn ngang màn hình trên mobile (< 375px).
  - Không thể điều hướng bằng bàn phím (mất focus ring, kẹt tab navigation).
  - Nhầm lẫn cấp độ cam kết (hiển thị slot là Finalized trong khi chưa qua finalized commitment).
  - Lỗi hiển thị sai số thập phân hoặc cắt ngắn chuỗi địa chỉ ví gây hiểu lầm.

- **P3 — Minor (Lỗi nhỏ, tối ưu hóa)**:
  - Lỗi chính tả, copy text chưa trực quan.
  - Nút bấm chưa căn lề chuẩn 1-2px nhưng không ảnh hưởng chức năng.
  - Thiếu tooltip hướng dẫn cho các thuật ngữ chuyên sâu (rent-exempt, slot duration).

---

## Mẫu báo cáo lỗi tái hiện được (Bug Report Template)

Khi phát hiện lỗi trong quá trình chạy Bug Bash, người kiểm thử ghi nhận theo biểu mẫu chuẩn sau:

```markdown
### [BUG-ID] [P0/P1/P2/P3] Tiêu đề ngắn gọn mô tả lỗi

- **Phân loại**: [Wallet / Business / Responsive / a11y / Network]
- **Môi trường**: 
  - Thiết bị: [ví dụ: MacBook Pro 14" M1 / iPhone 13 Safari / Pixel 7 Chrome]
  - Trình duyệt & Phiên bản: [ví dụ: Chrome 130.0.6723.92]
  - Phần mềm ví & Phiên bản: [ví dụ: Phantom Extension 24.18.0]
  - Mạng / Cluster: [Localhost Mock / Devnet]
- **Điều kiện tiên quyết**: [Trạng thái ban đầu, số dư ví, tài khoản đang chọn]
- **Các bước tái hiện**:
  1. Truy cập `...`
  2. Kết nối ví `...`
  3. Nhập giá trị `...`
  4. Nhấn nút `...`
- **Kết quả thực tế (Actual)**: [Mô tả chi tiết hành vi sai, thông báo lỗi trong console, ảnh chụp màn hình/video]
- **Kết quả kỳ vọng (Expected)**: [Hành vi đúng theo đặc tả hệ thống]
- **Bằng chứng**: 
  - Ảnh / Video: `docs/evidence/...`
  - Console Log / Network Payload: `...`
- **Đánh giá ảnh hưởng**: [Ảnh hưởng đến tiền bạc, trải nghiệm hoặc tiến độ release]
```

---

## Nguồn tham khảo chính thức

- [Solana Wallet Standard Specification](https://github.com/wallet-standard/wallet-standard) (v1.1.1, đối chiếu 2026-11).
- [W3C WAI-ARIA Authoring Practices Guide 1.2](https://www.w3.org/WAI/ARIA/apg/) (đối chiếu 2026-11).
- [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/TR/WCAG21/) (Level AA conformance).
- [Solana Transaction Confirmation & Commitment Guide](https://solana.com/developers/guides/advanced/confirmation) (đối chiếu 2026-11).
- [Apple Human Interface Guidelines — Touch Targets](https://developer.apple.com/design/human-interface-guidelines/inputs/touch/) (tối thiểu 44×44pt).
- [Google Material Design — Accessibility Touch Targets](https://m3.material.io/foundations/accessible-design/accessibility-basics) (tối thiểu 48×48dp).
- [ReceiptRail Client & Architecture Specifications (`docs/ARCHITECTURE.md`, `docs/PHASE4-CLIENT.md`)](../../docs/ARCHITECTURE.md).

---

## Giới hạn tại mốc ghi chú

- Mọi ca kiểm thử trong tài liệu `docs/PHASE7-BUG-BASH.md` đi kèm thuộc phần ví thật, devnet và thiết bị phần cứng được đánh dấu mặc định là **"⏳ Chưa chạy (Chờ Phase 7)"**.
- Antigravity tuân thủ nghiêm ngặt ranh giới đã thỏa thuận: Không tự ý cài đặt extension ví bên ngoài, không tạo ví devnet mới, không kích hoạt phát sóng mạng thật khi người dùng chưa cấp quyền Phase 6/7.
- Các kết quả đã kiểm chứng thành công trong Phase 5 (16 ca headless T37, 46 Node.js unit tests T40, direct browser mount 0 errors) được lưu trữ độc lập tại `docs/evidence/phase5/` và không bị nhầm lẫn với checklist Phase 7.
