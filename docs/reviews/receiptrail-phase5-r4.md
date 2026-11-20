# C review Phase 5 local — r4, 20/11/2026

**Phần local/mock đạt các ca trong PHASE5-PLAN tại source106a18e. Cổng public còn chưa đạt vì chưa có quyền hoặc link ReceiptRail công khai.** Đây không phải verdict giáo viên, audit độc lập hoặc ví thật.

## Phần thay đổi đã review

T37 được nhận đúng một lượt: fixture31bytes làm trắng trang đã giao T40. T40/51ee3b2 sửa fixture32bytes và regression gọi đăng ký thật; không giữ route rewrite như bằng chứng source đạt. C nhận T38/T39 một lượt, hiệu chỉnh tại reviews và chuyển giới hạn thành D06/D07; không mở lại vòng sửa report.

C bổ sung ReceiptRailMockWalletConnection dùng connector Wallet Standard độc lập, không createClient/provider/RPC warmup. ReceiptRailApp chỉ chọn fixture trả về trực tiếp, không chọn extension theo tên hoặc hiệu registry trước/sau. Đăng ký lặp lại giữ bốn object ổn định, reset test unregister đúng fixture. Store theo dõi account/chain/disconnect và generation chống kết quả connect muộn; terms vẫn qua model confirmation và raw events.

Entry/config riêng chỉ mount ReceiptRail ở root; không có entry ClusterProof/lab hoặc flow ví thật. CSS dùng lại để giữ giao diện. Đây là artifact local để trình public, chưa là bản đã phát hành.

## Bằng chứng

| Phần | Kết quả và giới hạn |
| --- | --- |
| Tests | 52/52: 45 tests nền + regressionT40 + 6 tests connector/registry. Kiểm không request, ví ngoài, account/chain, late connect và cleanup/remount; TypeScript/Vite build chung và riêng đạt |
| Source browser | 16/16 ca ở1440×900 và375×812; guest/copy, Create, sửa terms, switch/disconnect/Pay1lần, hai Unknown, CancelOpen/Expired, CPIrollback, focus và overflow |
| Slot | 2/2 ca bổ sung: đổi slot sau tick Create hủy duyệt và cập nhật expiry, cần duyệt lại |
| Sổ cái mock | Pay chuyển đúng principal một lần; recheck không đổi ledger; Cancel giữ principal/rent; CPIrollback giữOpen/principal/rent, chỉ tăng phí mock10000lamports |
| Artifact static | 10/10 ca root/guest/reject/Create/Pay/terminal/Unknown/CancelExpired/layout/reload; 0pageerror,0externalrequest. Ba file output khớp build lại từ commit |
| Video | 162.12s đo bằngffprobe, recordVideo trên source thật; diễn tập UI không lời thoại, không video nộp cuối |
| Core | 10hashes security-r1 và diff program/client/IDL/Cargo.lock so6d08e5c không đổi; không chạy lại suite hoặc deploy/smoke |

[Logs, manifests, screenshots và video](../evidence/phase5/c-prompt04-review-2026-11-19/README.md) · [artifact](../evidence/phase5/mock-artifact-2026-11-20/artifact.json). Các ảnh desktop/mobile đã được C xem trực tiếp; tab và bảng cuộn trong vùng riêng.

## Giới hạn còn lại

Chỉ mock in-memory; reload reset ledger, chưa journal ví thật. Không chứng minh Phantom/Solflare/Backpack, thiết bị vật lý, WCAG/contrast đầy đủ, reorg/RPC hoặc browser-to-chain. Không đổi adapter tiền/client/program/authority. Public mock, tích hợpPhase6 và mergePR7 là ba quyết định riêng theo Prompt04; giữ SiteClusterProof cũ.
