# Lịch sử phân công T36 — đã đóng

## T36 — UI/lifecycle local theo phần thiếu cụ thể (mới, làm ngay)

[Review r2](../reviews/receiptrail-phase5-r2.md) nhận phần đạt của T35; [repro7ca](../reviews/receiptrail-phase5-r2-repro.json) là lỗi hiện tại. Không mở lại T31–T33 hoặc sửa reportT35 cho đẹp. C chịu trách nhiệm `adapter.ts`, `types.ts` và **file test mới** `receiptrail-adapter-review.test.mjs`; A không sửa3file này trong T36. C giữ API async hiện tại và public mockEngine/client/roles; sẽ ghi contract mới khi push.

**Cập nhật phân chia16:57UTC+7:** C đã xong adapter và tiếp tục phần chạm ví/terms để không chờ trợ lý: C nhận `ReceiptRailApp.tsx`, `mock-wallets.ts`, module confirmation/lifecycle và các tests JS liên quan. **A chỉ sửa `receiptrail.css`, note025 và evidence Phase5/DEVLOG/A-done/HANDOFF A** trong lượt này; không sửa TSX/adapter/types/controllers/tests C. Nếu đã có patch TSX đang làm, giữ lại và báo diff trong A-done để C tích hợp, không ghi đè. A không cần làm lại7repro hoặc reportT35.

A làm ngay responsive theo ảnh cũ và sửa note025 ở mục4, chạy build bằng cache và ghi đúng giới hạn ở mục5. Các mục1–3/copy trongTSX bên dưới C nhận làm; đây là phân chia implementation, không mở vòng sửa report cũ.

1. Tách production controller/hook quản lý snapshot Create/Pay/Cancel; test gọi chính code dùng bởi app. Reset khi đổi wallet identity kể cả cùngaddress, accounts/chains/disconnect, đổi invoice, sửa input/preset/slot thay terms. Submit dùng snapshot đã duyệt, không tự dựng Cancel terms tại click. Chặn double submit ngay trước await; stale async results không thay selection/ví mới.
2. Wallet Standard mock publicKey phải encode đúng address. Test connector production của SDK, account/chain change, disconnected/guest/reject không cần browser. Không gọi sign/send feature hoặc tự mở extension. Nếu SDK không expose chains thì subscribe standard:events trong lifecycle; ghi đúng giới hạn.
3. Review đầy đủ merchant/payer/amount/expiry/ID/PDA/rent/fee mock trước Create; preview expiry đúng input và giới hạn u64; thay input mất xác nhận. Catch lỗi list/detail rõ ràng, không nuốt decode hoặc unhandled promise.
4. Sửa responsive theo ảnh mobile375×812 hiện có (cắt ngang); wallet/controls/banner/details/list cần wrap/min-width phù hợp, giữ full-address/copy. Sửa copy mock sát action/receipt/storyboard, bỏ bảo vệ tuyệt đối và “on-chain” khi đọc mock. Cập nhật note025 (reject không luôn4001, signature có trước send, recheck chỉ đọc).
5. Chạy tests/build bằng cache; giữ log/test names/giới hạn thật. Theo yêu cầu dừng điều khiển giao diện, **không CUA/browser automation/headless/mouse-keyboard** trong T36, không tạo ảnh mới; dùng source/CLI và ảnh có sẵn. Ghi rõ browser sau sửa còn chưa kiểm, không suy tests/build = responsive đã xác minh. Không public/install/Phase6.

Push mốc nhỏ `[skip ci]`, ghi A-done/HANDOFF A đúng sở hữu. C không chờ A và tiếp tục phần adapter/review. Nếu thấy vấn đề client C, ghi finding, không sửa program/IDL/generated client/locks.

### Bàn giao adapter C trong T36 — đã kiểm32tests/build

C đã sửa `adapter.ts`, `types.ts`, thêm11tests production trong `receiptrail-adapter-review.test.mjs`; giữ API async chính. A fetch/pull rồi tiếp tục phần UI, không cần sửa lại adapter.

- `timeout_unknown`: ledger đã Paid và chuyển principal một lần, chỉ response mất; `isPending=true` giữ khóa tới recheck. Account state và trạng thái request vẫn tách biệt. `recheckOnChain` không đổi bytes/balances, trả thêm `outcome: confirmed|failed|dropped|none`; signature theoinvoice, seed chưa có transaction trảnull.
- `timeout_dropped`: request không thực thi, ledgerOpen/khôngphí, Unknown đến recheck; sau expiry giữExpired. Thêm nhãn mock tương ứng nếu hiển thị dropdown; không gán mọirecheck là thành côngPaid.
- `ledgerSnapshot()` trả copies của balances/rents/feePayerLamports/feesPaid; `MOCK_RENT_LAMPORTS` và `MOCK_FEE_LAMPORTS` là số mẫu local, khôngquote. Có thể hiển thị tách principal/fee/rent để giải thích rollback. Cancel chỉ đổi trạngthái, giữrent.
- Allasync read/mutate đợi seeded PDA derive hoàn tất; `getRawAccount` sync trảcopy (test dùng sau awaitlist). Parseexpiry chặn>u64; UI còn cần kiểm currentSlot+delta và preview đúngsnapshot.
- Mutex theoinvoice trước await, inputs/returnedPending deep copy invoiceId, concurrency create/pay/cancel/sharedpayer đã test; program/IDL/client/36inputs P4-B không đổi. 32webtests+buildđạt, repro6/7đãsửa, cònmockpubkey0 thuộcA. PhầnUIterms/lifecycle/stale/mobile/copy cầnA xửlý như5mục trên.
