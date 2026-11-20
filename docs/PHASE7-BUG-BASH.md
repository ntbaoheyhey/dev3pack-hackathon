# ReceiptRail — Kế hoạch & Checklist Bug Bash Phase 7

> **C nhận một lượt20/11, T39 đóng.** Dùng [hiệu chỉnh bắt buộc](reviews/receiptrail-t39-acceptance.md): Cancel không close/hoàn rent; expiry dùng slot>=hạn; ngân sách theo PHASE6-PLAN chưa duyệt. Các số mẫu/câu gốc bên dưới không là contract hoặc quyền chi. T37 không chứng minh source nguyên bản đạt.

- Tác giả: Antigravity (trợ lý Codex) · Ngày lập: 19/11/2026 · Thuộc nhiệm vụ T39.
- Tài liệu học trước: [Note 029 — Ma trận ví, thiết bị và phương pháp kiểm thử Bug Bash](learning/029-receiptrail-bug-bash.md).
- Ranh giới thực thi: Toàn bộ các ca trong checklist thuộc môi trường ví thật/devnet/thiết bị thật có trạng thái mặc định là **"⏳ Chưa chạy (Chờ Phase 7)"**. Tuyệt đối không tự ý chạy khi chưa có quyết định mở Phase 6/7 từ người dùng.

---

## 1. Mục tiêu và Nguyên tắc kiểm thử

1. **Bảo vệ tài sản và tính toàn vẹn sổ cái**: Không cho phép bất kỳ lỗi nào làm thất thoát SOL, sai lệch số dư lamports, hoặc ghi đè trạng thái hóa đơn on-chain.
2. **Trải nghiệm thực tế trên ví thật**: Kiểm tra đa dạng 3 ví Wallet Standard (Phantom, Solflare, Backpack) trên cả máy tính (Desktop) và điện thoại di động (Mobile).
3. **Xử lý sự cố mạng bất thường**: Đảm bảo hệ thống sống sót và phục hồi mượt mà khi gặp HTTP 429 Rate Limit, RPC timeout, mất mạng đột ngột hoặc người dùng tải lại trang (F5).
4. **Phân định ranh giới rõ ràng**:
   - **Phần A (Local Mock & Test Harness)**: Đã kiểm chứng trong Phase 5 (16 ca headless T37, 46 Node.js unit tests T40, direct browser mount 0 errors).
   - **Phần B (Devnet, Extension Ví & Thiết bị thật)**: Dành riêng cho Phase 7 sau khi người dùng phê duyệt Phase 6 (devnet integration).

---

## 2. Tiêu chuẩn phân cấp mức độ nghiêm trọng (Severity)

- **P0 — Blocker (Chặn phát hành)**: Mất tiền, sai lệch lamports, ghi đè hóa đơn đã có, ký giao dịch ngoài ý muốn, hoặc crash module scope làm trắng trang.
- **P1 — Critical (Chặn phát hành)**: Vi phạm vai trò (Viewer/Payer hủy được đơn, Viewer thanh toán được), kẹt luồng thao tác không thể phục hồi, mất vết signature/invoiceId sau timeout.
- **P2 — Major (Cần khắc phục)**: Tràn layout ngang trên mobile (< 375px), mất focus ring bàn phím, hiển thị nhầm lẫn giữa Account State và Cluster Commitment.
- **P3 — Minor (Tối ưu hóa)**: Lỗi chính tả, copy nhãn chưa tối ưu, giao diện lệch 1-2px không ảnh hưởng công năng.

---

## 3. Checklist Bug Bash 24 ca kiểm thử chi tiết

| Mã ca | Phân nhóm | Điều kiện tiên quyết | Các bước thực hiện | Hành vi kỳ vọng (Expected) | Mức độ | Bằng chứng cần nộp | Người phụ trách | Kết quả |
|---|---|---|---|---|---|---|---|---|
| **BB-01** | Ví & Kết nối | Đã cài Phantom extension; mở web ReceiptRail. | 1. Nhấn nút "Connect Wallet".<br>2. Chọn ví Phantom trong danh sách.<br>3. Chấp nhận kết nối trên popup ví. | Kết nối thành công; địa chỉ ví hiển thị dạng rút gọn; avatar hiển thị vai trò (Payer/Merchant/Guest); không có lỗi console. | P1 | Ảnh chụp popup ví + giao diện đã kết nối. | QA / Tester | ⏳ Chưa chạy (Chờ Phase 7) |
| **BB-02** | Ví & Kết nối | Đã cài Solflare extension; đang mở web. | 1. Nhấn "Connect Wallet".<br>2. Chọn Solflare.<br>3. Nhấn "Reject" / Từ chối trên popup ví. | Ứng dụng bắt được lỗi từ chối, hiển thị thông báo "Người dùng đã từ chối kết nối"; giao diện không crash; trạng thái ví vẫn là Chưa kết nối. | P1 | Ảnh chụp thông báo từ chối + console log không có uncaught exception. | QA / Tester | ⏳ Chưa chạy (Chờ Phase 7) |
| **BB-03** | Ví & Kết nối | Đã kết nối Backpack; mở 1 hóa đơn Open. | 1. Mở extension Backpack.<br>2. Chuyển sang một account/địa chỉ khác trong cùng ví. | Ứng dụng nhận diện sự kiện `standard:events`; tự động hủy bỏ các điều khoản đã xác nhận (confirmed terms); cập nhật lại vai trò tương ứng với tài khoản mới. | P1 | Video thao tác đổi account và phản hồi ngay lập tức của UI. | QA / Tester | ⏳ Chưa chạy (Chờ Phase 7) |
| **BB-04** | Ví & Kết nối | Đang kết nối ví bất kỳ. | 1. Nhấn nút "Disconnect" / Ngắt kết nối trên thanh tiêu đề. | Ngắt kết nối an toàn; xóa toàn bộ session ví; avatar trở về Guest; các nút hành động Pay/Cancel bị ẩn hoặc chuyển sang yêu cầu kết nối ví. | P2 | Ảnh chụp giao diện trước và sau khi Disconnect. | QA / Tester | ⏳ Chưa chạy (Chờ Phase 7) |
| **BB-05** | Ví & Kết nối | Trình duyệt không cài bất kỳ extension ví nào. | 1. Truy cập trang `/receiptrail/`.<br>2. Kiểm tra danh sách connectors. | Hiển thị thông báo rõ ràng "Không tìm thấy ví Wallet Standard nào. Vui lòng cài đặt Phantom, Solflare hoặc Backpack"; các nút Pay/Cancel hướng dẫn người dùng kết nối. | P2 | Ảnh chụp màn hình thông báo không có ví. | QA / Tester | ⏳ Chưa chạy (Chờ Phase 7) |
| **BB-06** | Ví & Kết nối | Ví đang trỏ sang mạng Mainnet-beta. | 1. Kết nối ví đang ở Mainnet-beta.<br>2. Kiểm tra cảnh báo mạng. | Ứng dụng phát hiện chain mismatch; hiển thị cảnh báo "Vui lòng chuyển mạng ví sang Solana Devnet"; khóa mọi thao tác ký giao dịch để bảo vệ tiền thật. | P0 | Ảnh chụp cảnh báo sai mạng và nút ký bị vô hiệu hóa. | QA / Tester | ⏳ Chưa chạy (Chờ Phase 7) |
| **BB-07** | Tạo đơn (Merchant) | Kết nối ví Merchant; mở form tạo hóa đơn. | 1. Nhập số tiền `0` hoặc `-1.5` hoặc chuỗi `abc`.<br>2. Nhập số tiền có 10 chữ số thập phân (`0.0000000001`). | Trường nhập liệu báo đỏ; hiển thị lỗi "Số tiền phải là số dương hợp lệ, tối đa 9 chữ số thập phân (lamports)"; nút "Tạo hóa đơn" bị vô hiệu hóa. | P1 | Ảnh chụp validation lỗi trên form. | QA / Tester | ⏳ Chưa chạy (Chờ Phase 7) |
| **BB-08** | Tạo đơn (Merchant) | Kết nối ví Merchant; số dư devnet > 0.05 SOL. | 1. Nhập địa chỉ Payer hợp lệ (32 bytes base58).<br>2. Nhập số tiền `0.05` SOL.<br>3. Chọn hạn thanh toán 1000 slots.<br>4. Nhấn "Review Terms". | Hiển thị bảng tóm tắt: Payer, Merchant, Số tiền (50,000,000 lamports), Hạn slot dự kiến, Phí rent dự kiến (~0.0014 SOL), Phí mạng (~0.000005 SOL). Dữ liệu bất biến. | P1 | Ảnh chụp snapshot điều khoản trước khi tạo. | QA / Tester | ⏳ Chưa chạy (Chờ Phase 7) |
| **BB-09** | Tạo đơn (Merchant) | Đang hiển thị bảng tóm tắt điều khoản hóa đơn. | 1. Nhấn nút "Xác nhận & Tạo hóa đơn".<br>2. Ký giao dịch trên popup extension ví. | Nút bấm lập tức chuyển sang trạng thái "Đang xử lý..." và bị disabled (chống double-click); sau khi confirmed, hóa đơn xuất hiện trong danh sách với trạng thái `Open`. | P0 | Video quá trình tạo đơn và transaction signature trên Devnet Explorer. | QA / Tester | ⏳ Chưa chạy (Chờ Phase 7) |
| **BB-10** | Tạo đơn (Merchant) | Form tạo đơn đang mở. | 1. Thử tạo 2 hóa đơn liên tiếp với cùng một `invoiceId` chuỗi ngẫu nhiên. | Hệ thống phát hiện trùng lặp PDA; từ chối tạo mới và giữ nguyên dữ liệu hóa đơn cũ; không trừ phí rent lần thứ hai. | P0 | Console log hoặc thông báo lỗi trùng lặp PDA. | QA / Tester | ⏳ Chưa chạy (Chờ Phase 7) |
| **BB-11** | Tạo đơn (Merchant) | Đang mở bảng xác nhận điều khoản tạo đơn. | 1. Thay đổi số tiền trong ô input hoặc đổi ví trong extension. | Snapshot điều khoản đã duyệt lập tức bị hủy bỏ (`invalidated`); yêu cầu người dùng phải xem lại điều khoản mới từ đầu trước khi tạo. | P1 | Video thao tác thay đổi input làm vô hiệu hóa nút xác nhận cũ. | QA / Tester | ⏳ Chưa chạy (Chờ Phase 7) |
| **BB-12** | Thanh toán (Payer) | Kết nối ví không phải Payer (ví của người lạ). | 1. Mở hóa đơn `Open` do Merchant tạo cho ví khác.<br>2. Kiểm tra quyền thao tác. | Nút "Thanh toán" bị ẩn hoặc disabled kèm chú thích "Chỉ người trả tiền (Payer) đã chỉ định mới có quyền thanh toán hóa đơn này". | P1 | Ảnh chụp giao diện người lạ xem hóa đơn. | QA / Tester | ⏳ Chưa chạy (Chờ Phase 7) |
| **BB-13** | Thanh toán (Payer) | Kết nối đúng ví Payer; số dư SOL đủ thanh toán. | 1. Mở hóa đơn `Open`.<br>2. Nhấn "Xem điều khoản thanh toán".<br>3. Kiểm tra thông tin hiển thị. | Hiển thị chi tiết số tiền SOL bị trừ, người nhận (Merchant), số slot còn lại trước khi hết hạn; yêu cầu người dùng bấm xác nhận trước khi gọi ví. | P1 | Ảnh chụp modal xác nhận thanh toán của Payer. | QA / Tester | ⏳ Chưa chạy (Chờ Phase 7) |
| **BB-14** | Thanh toán (Payer) | Đang mở modal thanh toán; đã xác nhận điều khoản. | 1. Nhấn "Thanh toán ngay".<br>2. Khi popup ví mở lên, nhấn "Từ chối" (Reject). | Ứng dụng bắt lỗi reject; hiển thị thông báo "Giao dịch bị từ chối bởi người dùng"; hóa đơn vẫn giữ nguyên trạng thái `Open`; không trừ tiền tài khoản. | P1 | Ảnh chụp thông báo từ chối ký và hóa đơn vẫn Open. | QA / Tester | ⏳ Chưa chạy (Chờ Phase 7) |
| **BB-15** | Thanh toán (Payer) | Đang thanh toán; mô phỏng timeout mạng sau khi ký. | 1. Nhấn thanh toán, ví đã ký và phát sóng nhưng mạng bị ngắt.<br>2. Không nhận được phản hồi xác nhận từ RPC. | Ứng dụng chuyển sang trạng thái `Unknown (Đang chờ xác minh)`; giữ nguyên `invoiceId`, `PDA` và signature (nếu có); hiển thị nút "Kiểm tra lại trên chuỗi". Không tự ý trừ tiền lần 2 hoặc tạo ID mới. | P0 | Ảnh chụp màn hình trạng thái Unknown và nút Recheck. | QA / Tester | ⏳ Chưa chạy (Chờ Phase 7) |
| **BB-16** | Thanh toán (Payer) | Hóa đơn đang ở trạng thái `Unknown`. | 1. Nhấn nút "Kiểm tra lại trên chuỗi" (Recheck). | Thực hiện truy vấn đọc trạng thái tài khoản từ RPC devnet; nếu tài khoản đã chuyển sang `Paid`, cập nhật giao diện thành Paid; nếu chưa, giữ nguyên trạng thái chờ. Tính lũy đẳng tuyệt đối. | P0 | Log truy vấn RPC và giao diện chuyển thành Paid. | QA / Tester | ⏳ Chưa chạy (Chờ Phase 7) |
| **BB-17** | Hủy đơn (Merchant) | Kết nối ví Merchant; có hóa đơn `Open`. | 1. Nhấn nút "Hủy hóa đơn".<br>2. Xem bảng tóm tắt hủy.<br>3. Xác nhận và ký trên ví. | Nút bị khóa chống bấm đúp; giao dịch hủy thành công; hóa đơn chuyển sang trạng thái `Cancelled`; tiền cọc rent được hoàn trả về ví Merchant (nếu theo cơ chế thu hồi rent). | P1 | Tx signature hủy hóa đơn trên Devnet Explorer. | QA / Tester | ⏳ Chưa chạy (Chờ Phase 7) |
| **BB-18** | Hủy đơn (Merchant) | Hóa đơn `Open` đã quá hạn slot (`current_slot > expiry_slot`). | 1. Kiểm tra trạng thái hóa đơn hiển thị.<br>2. Merchant thực hiện hủy hóa đơn đã Expired. | Giao diện hiển thị nhãn `Expired (Hết hạn)`; Merchant vẫn có quyền gọi hàm Cancel để giải phóng và đóng tài khoản; Payer bị cấm thanh toán hóa đơn này. | P1 | Ảnh chụp hóa đơn Expired và thao tác Cancel thành công. | QA / Tester | ⏳ Chưa chạy (Chờ Phase 7) |
| **BB-19** | Hủy đơn | Hóa đơn đã ở trạng thái `Paid`. | 1. Merchant hoặc Payer cố gắng nhấn nút Hủy hóa đơn. | Thao tác bị cấm hoàn toàn; nút Hủy bị ẩn hoặc vô hiệu hóa vĩnh viễn; giao dịch đã hoàn tất và không thể bị đảo ngược trên hợp đồng. | P0 | Ảnh chụp hóa đơn Paid không có nút Hủy. | QA / Tester | ⏳ Chưa chạy (Chờ Phase 7) |
| **BB-20** | Phục hồi & Tải lại | Đang ở giữa phiên thanh toán hoặc tạo đơn. | 1. Nhấn F5 / Reload trang trình duyệt. | Trình duyệt nạp lại an toàn; kết nối ví tự động phục hồi nếu có quyền; danh sách hóa đơn tải lại chính xác từ on-chain/cache; không bị crash màn hình trắng. | P1 | Video reload trang F5 và ứng dụng mount mượt mà. | QA / Tester | ⏳ Chưa chạy (Chờ Phase 7) |
| **BB-21** | Mạng & Tải (429) | Mô phỏng RPC node trả về HTTP 429 Too Many Requests. | 1. Thực hiện truy vấn đọc hóa đơn liên tục.<br>2. Nhận mã lỗi 429 từ RPC. | Ứng dụng hiển thị cảnh báo "Hệ thống mạng đang quá tải, tạm dừng truy vấn trong giây lát"; thực hiện backoff đọc; không tự động spam request; không ảnh hưởng tiền bạc. | P2 | Console log bắt mã 429 và thông báo thân thiện trên giao diện. | QA / Tester | ⏳ Chưa chạy (Chờ Phase 7) |
| **BB-22** | Trạng thái & Cam kết | Hóa đơn vừa được xác nhận ở mức `Confirmed`. | 1. Quan sát phần hiển thị trạng thái và cam kết mạng. | Hiển thị rõ 2 trường thông tin độc lập: Trạng thái sổ cái `Account State: Paid` và Cam kết mạng `Commitment: Confirmed (Đang chờ Finalized)`. Không hiển thị nhầm lẫn. | P2 | Ảnh chụp phần hiển thị trạng thái và cam kết mạng. | QA / Tester | ⏳ Chưa chạy (Chờ Phase 7) |
| **BB-23** | Giao diện Di động | Mở ứng dụng trên điện thoại di động (viewport 375×812). | 1. Cuộn trang từ đầu đến cuối.<br>2. Kiểm tra tràn ngang màn hình.<br>3. Kiểm tra bảng danh sách hóa đơn. | Toàn trang không tràn ngang (`scrollWidth === 375px`); bảng danh sách hóa đơn cuộn riêng biệt trong vùng bảng (`.rr-table-wrapper`); touch target các nút >= 44×44px. | P2 | Ảnh chụp toàn trang trên thiết bị di động và video cuộn bảng riêng. | QA / Tester | ⏳ Chưa chạy (Chờ Phase 7) |
| **BB-24** | Trợ năng (a11y) & Bàn phím | Mở ứng dụng bằng bàn phím (không dùng chuột). | 1. Sử dụng phím `Tab` và `Shift+Tab` để duyệt từ đầu trang đến cuối trang.<br>2. Nhấn `Enter` / `Space` để kích hoạt nút bấm.<br>3. Kiểm tra vùng thông báo. | Mọi phần tử tương tác đều có vòng viền tiêu điểm (focus ring) rõ ràng; thứ tự di chuyển phím Tab tuần tự; vùng thông báo trạng thái có `aria-live`; sao chép địa chỉ ví có phản hồi âm thanh/văn bản. | P2 | Video duyệt toàn bộ giao diện chỉ bằng bàn phím. | QA / Tester | ⏳ Chưa chạy (Chờ Phase 7) |

---

## 4. Bảng đối chiếu Nguồn & Snapshot Manifest

| Thành phần | Đường dẫn tệp / Tham chiếu | Commit / Trạng thái đối chiếu | Ghi chú |
|---|---|---|---|
| Contract Client v0.1 | `packages/receiptrail-client/index.mjs` | `6d08e5c` (23 tests pass) | Sinh từ Anchor IDL, cố định discriminator và PDA derivation |
| Web Application | `apps/web/src/receiptrail/` | `51ee3b2` (46 tests pass) | Đã sửa P5-F01, direct browser mount 0 errors |
| Anchor IDL | `idl/receiptrail.json` | `6d08e5c` | Contract định nghĩa các tài khoản và mã lỗi 6000-6008 |
| Bằng chứng Phase 5 (T37) | `docs/evidence/phase5/t37-2026-11-19/` | `7676053` | 16 ca headless, video demo 33.08s |
| Bằng chứng Phase 5 (T40) | `docs/evidence/phase5/t40-2026-11-19/` | `51ee3b2` | Sửa fixture 32 bytes, 6 ảnh chụp trực tiếp |
| Nghiên cứu Ví (T38) | `docs/learning/027-receiptrail-wallet-e2e.md` | `11d58b1` | Ma trận 3 ví và 8 ca lỗi thực tế |
| Hướng dẫn Bug Bash (T39) | `docs/learning/029-receiptrail-bug-bash.md` | Bản lập hiện hành | 10 chiều kiểm thử và phương pháp phân cấp severity |

---

## 5. Quy trình thực hiện khi mở Phase 7

1. **Chuẩn bị môi trường**:
   - Chỉ bắt đầu khi người dùng có chỉ đạo chính thức mở Phase 6/7 trong `docs/ideas/DECISION.md`.
   - Sử dụng ví thử nghiệm Devnet có sẵn, không chứa tài sản thật; nạp đủ số dư testnet lamports để trả phí mạng và rent.
2. **Tiến hành kiểm thử**:
   - Người kiểm thử nhận ca theo mã từ `BB-01` đến `BB-24`.
   - Thực hiện từng bước theo đúng mô tả; thu thập đầy đủ bằng chứng (screenshot, video, console logs, transaction ID trên Devnet Explorer).
3. **Báo cáo và xử lý lỗi**:
   - Nếu phát hiện lỗi P0 hoặc P1: Lập tức dừng luồng liên quan, tạo bug report theo mẫu tại note 029 và thông báo cho Codex trưởng nhóm.
   - Khi hoàn thành ca đạt chuẩn: Cập nhật cột kết quả thành `✅ ĐẠT` kèm liên kết đến tệp bằng chứng.
