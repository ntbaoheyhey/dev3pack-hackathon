# Kết quả việc của Antigravity (A)

| Mã | Trạng thái | Ghi chú |
| --- | --- | --- |
| T1 | đang làm | Cần bổ sung quy trình mục 4 (note 017) và nguồn primitive/FAQ (note 018). |
| T2 | xong | Đã hoàn thành (dữ liệu từ Note 012). |
| T3 | xong | Đã xong. |
| T4 | xong | Đã xong. |
| T5 | xong | Đã xong. |
| T6 | xong | Đã xong. |
| T8 | bỏ | Tạm dừng triển khai web ClusterProof. |
| T11 | đang làm | Crawl/review evidence cho ReceiptRail (T11). |
| T12 | xong | Đã xong. |
| T13 | xong | Đã xong. |
| T34 | xong | Đã xong và nộp tại 4d2e48a. |
| T35 | xong | Khắc phục 5 nhóm lỗi implementation theo review C (P5-01..05); 21/21 tests pass; 8 screenshots r2. |
| T36 | xong | Đã xong: controller snapshot, mock-wallets pubkey, dynamic expiry preview, in-flight lock, stale async guard, responsive CSS, 25/25 tests pass. |
| T37 | xong | Kiểm browser local 16 ca đạt; quay video demo 165s đạt 33.08s; phát hiện finding P5-F01 báo Codex. |
| T38 | xong | Hoàn thành note 027: ma trận 3 ví (Phantom/Solflare/Backpack), 8 ca lỗi UX/CTA, contract adapter Phase 6, kế hoạch e2e. |
| T40 | xong | Đã sửa P5-F01 trong mock-wallets.ts, thêm regression test (46 tests pass), kiểm headless direct không intercept 1440 và 375 đạt 0 pageerror. |
| T39 | xong | Hoàn thành note 029 và checklist docs/PHASE7-BUG-BASH.md (24 ca, 10 chiều kiểm thử, P0/P1/P2/P3 rõ ràng, kết quả mặc định Chưa chạy). |
| T41 | xong | Tạo ReceiptRailDevnetWalletConnection, devnet-wallet-panel.tsx và 9 test cases độc lập; 61/61 tests pass, build sạch. |

- Việc T11: Xong. Đã crawl và review evidence cho ReceiptRail (retry, timeout, idempotency) vào `docs/data/receiptrail-evidence.md`.

- Việc T14: Đang làm. Bổ sung evidence cho T11 dựa trên review của Codex (URL, nguồn, phân biệt Solana/EVM, tách state).

- Việc T14: Xong. Đã bổ sung và hoàn thiện evidence theo yêu cầu review của Codex (URL, nguồn, phân biệt hệ sinh thái, state machine).

- Việc T12: Xong. Đã thiết kế UX trên giấy cho ReceiptRail vào `docs/design/receiptrail-ux-antigravity.md`.

- Việc T13: Đang làm. Đã khởi tạo file review thiết kế `docs/reviews/receiptrail-antigravity.md` và chờ thiết kế từ Codex.

- Việc T16: Xong. Đã cập nhật thiết kế UX cho ReceiptRail (Wireframes, State Machine, Error Mapping, Storyboard, Checklist) vào `docs/design/receiptrail-ux-antigravity.md`.

- Việc T13: Xong. Đã review kiến trúc ReceiptRail dựa trên bản `8f84cfe` và các artifact liên quan.

- Việc T17: Xong. Đã hoàn thiện thiết kế UX cho ReceiptRail (Mã lỗi, wireframe, state machine, checklist) theo review của Codex (T16-R1-R5).

- Việc T15: Xong. Đã sửa hẹp và hoàn thiện evidence ReceiptRail theo yêu cầu (tách trạng thái, phân biệt Solana Pay, bổ sung nguồn từ ledger).

- Việc T18: Xong. Đã hoàn thiện review kiến trúc ReceiptRail (Ma trận 5 nhóm, Rollback, Giải thích kỹ thuật).

- Việc T19: Xong. Đã sửa lại bảng lỗi IDL khớp với `idl/receiptrail.json` (đã verify bằng script) và cập nhật Checklist.

- Việc T20: Xong. Đã rework evidence, bổ sung alternatives với URL nguồn thực, tìm 2 pain sources độc lập, làm rõ state machine và phản hồi chi tiết các findings T14-R1-R4.

- Việc T21: Xong. Đã sửa lại review kiến trúc `docs/reviews/receiptrail-antigravity.md` với hàm test thật, logic rollback và phản hồi các findings (T13-R1-R4).

- Việc T22: Xong. Đã hoàn thiện thiết kế UX cho ReceiptRail (Wireframes, State Machine, Error Mapping, Checklist) theo review T17 của Codex.

- Việc T22: Xong. Đã hoàn thiện thiết kế UX cho ReceiptRail (Bảng lỗi, wireframes, state machine, checklist) theo review của Codex (T17).

- Việc T23: Xong. Đã sửa lại `receiptrail-evidence.md` với 3 alternatives (URL đích, ngày kiểm, giới hạn), 2 nguồn pain point độc lập thật, và phản hồi chi tiết các findings.

- Việc T23: Xong. Đã rework evidence, bổ sung 3 alternatives với URL nguồn thực, 2 pain points độc lập, và làm rõ state machine.

- Việc T24: Xong. Đã hoàn thiện review kiến trúc ReceiptRail (Ma trận, phản hồi T21-R1-R3, rollback logic).

- Việc T25: Xong. Đã hoàn thiện thiết kế UX cho ReceiptRail (Wireframes cho 8 bố cục, Storyboard, Checklists) theo yêu cầu.

- Việc T26: Xong. Đã rework evidence, hoàn thiện bảng Alternatives (URL đích, giới hạn), Pain points, State machine và bảng phản hồi findings.

- Việc T27: Xong. Đã bổ sung review kiến trúc (Authority/Recipient, Bảng 3 ca rollback, Kết luận ma trận 5 nhóm) theo yêu cầu T24.

- Việc T28: Xong. UX rework hoàn thiện (8 bố cục, storyboard, lỗi IDL, SDK).
- Việc T29: Xong. Evidence/Review rework hoàn thiện (3 alternatives, 2 pain points, state machine, authority, 3 rollback cases).

- Việc T26/T27: Rework và sửa chữa các findings còn thiếu (expiry, rollback cases, authority).
- Việc T28/T29: Rework và hoàn thiện UX/Evidence/Review cuối cùng.

- Việc T30: Xong. Đã rework semantics UX (Khôi phục phí, Unknown, terms, state machine và 9 lỗi IDL). Đã đánh dấu mục 3-5 là chưa đạt (chuyển T33).

- Việc T31: Xong. Đã rework evidence (Alternatives, Pain Points, State machine, Phản hồi findings).

- Việc T32: Xong. Đã rework kiến trúc review (Authority, 3 rollback cases, 5 nhóm kiến trúc, phản hồi 13 findings).

- Việc T33: Xong. Đã rework hoàn thiện UX (State machine, bảng lỗi IDL, wireframes, storyboard 165s, SDK).

- Việc T32: Đã sửa bổ sung (Authority, 3 rollback cases, 5 nhóm kiến trúc, phản hồi 13 findings).

- Việc T33: Đã rework UX hoàn thiện (State machine, bảng lỗi IDL, wireframes, storyboard 165s, SDK).

- Việc T31: Xong. Đã sửa bổ sung (Provenance, State Machine, Phản hồi 13 findings).
- Tình trạng: T32, T33, T31 đều đã rework bổ sung xong.

- Việc T32: Đã sửa bổ sung (Authority check chi tiết, Bảng 3 ca rollback với Log, Ma trận 5 nhóm chi tiết).
- Tiếp theo: T33 (Rework bổ sung UX).

- Việc T33: Đã rework bổ sung (Khôi phục Phí, Terms, Unknown, CTA, Bảng lỗi, SDK).
- Tình trạng: Hoàn tất toàn bộ (T32, T33, T31).

- Việc T32, T33, T31: Đã thực hiện rework bổ sung (bản supplement 15:17) theo findings mới của Codex.
- Tình trạng: Hoàn tất các patch.

- Việc T31, T32, T33: Đã sửa bổ sung các log rollback, PDA check và UX 6002/6007.
- Tình trạng: Hoàn tất các patch.

- Việc T34: Xong. Đã học và triển khai toàn bộ UI ví/thanh toán ReceiptRail cục bộ:
  - Hoàn thành note học trước code: `docs/learning/025-receiptrail-frontend-wallet.md` (mock/chain boundary, state vs commitment, amount u64 bigint, wallet lifecycle, Unknown recovery, browser testing), cập nhật mục lục và DEVLOG.
  - Tích hợp client Codex `packages/receiptrail-client/index.mjs`: xác nhận sử dụng tốt, parse/format số tiền chính xác, inspect layout 131 bytes và mapping 9 lỗi Anchor IDL.
  - Triển khai `apps/web/src/receiptrail/` với route `/receiptrail/`: Merchant form (review terms, rent 1,802,640 lamports, est fee 10,000 lamports, invariant invoiceId/PDA), Invoice/Receipt view (Open/Paid/Cancelled, Expired phái sinh, commitment riêng, full copy address), phân quyền vai (đúng payer mới pay, merchant mới cancel, paid terminal).
  - Phục hồi sự cố Unknown: Giữ nguyên PDA/terms/pre-send signature khi timeout, không auto-resend, có nút re-check on-chain để khôi phục trạng thái Paid.
  - Vòng đời ví: Tự động hủy bỏ confirmed terms snapshot khi đổi ví, đổi tài khoản hoặc ngắt kết nối cho cả Pay và Cancel. Xử lý reject linh hoạt không phụ thuộc mã 4001. Khóa broadcast thật trong Phase 5 local.
  - Kịch bản demo 165s tương tác theo note 013.
  - Áp dụng đầy đủ 3 điểm review của Codex trong queue: (1) hủy terms cho cả Pay/Cancel trên mọi thay đổi/disconnect, (2) reject xử lý linh hoạt, (3) signature từ client ký trước gửi được giữ nguyên cùng ID/PDA khi Unknown.
- Việc T35: Xong. Đã khắc phục toàn diện 5 nhóm lỗi implementation theo Review C (`docs/reviews/receiptrail-phase5-r1.md`):
  - **P5-01 (Chặn Duplicate Create & Sửa PDA Seeded)**: `createInvoice` kiểm tra `accounts.has(pda.address)` và từ chối tạo lại trên mọi trạng thái (Open, Paid, Cancelled), bảo toàn terms/balance. Khởi tạo toàn bộ fixtures với canonical PDA từ `client.deriveInvoiceAddress`, tính đúng bump 254 cho Seed 2 (`GYjxtHoM4wVxbGwHHgcKBpj2C5r5CQw48YMcmgvBywA8`), loại bỏ triệt để lỗi `INVOICE_PDA_MISMATCH`.
  - **P5-02 (Pre-validation trước Timeout Fault & Pending Lock)**: `payInvoice` thực hiện validation thông qua `client.payInvoiceInstruction` TRƯỚC KHI xét timeout fault; sai signer hoặc sai terms bị reject ngay lập tức mà không rơi vào Unknown. Lưu trữ `pendingRecords` theo từng hóa đơn, hiển thị `isPending: true`, khóa nút `canPay = false` và `canCancel = false`, chặn thao tác trùng. `recheckOnChain` đọc kết quả submission thực, không bao giờ gán `Paid` nếu hóa đơn đã hết hạn hoặc bị hủy.
  - **P5-03 (Chuẩn hóa Wallet Standard & Reset Terms)**: Chuyển đổi sang `@solana/react-hooks` (`SolanaProvider`, `useWalletConnection`) và `@wallet-standard/app` (`getWallets().register(...)`). Mặc định vào app là khách (Guest viewer). Hủy bỏ toàn bộ `confirmedTerms` và `cancelConfirmed` khi đổi ví, đổi tài khoản hoặc ngắt kết nối. Xử lý từ chối linh hoạt cho cả mã 4001 lẫn chuỗi rejection từ extension. Broadcast giao dịch mạng thật vẫn được khóa chặt.
  - **P5-04 (Strict Hex/u64 & Dynamic Account List)**: `parseInvoiceIdHex` kiểm tra nghiêm ngặt 64 ký tự hex (32 bytes), cấm tự động đệm 0 hoặc cắt ngắn. `parseExpiryDelta` kiểm tra số nguyên dương và chuyển sang `BigInt`. Bổ sung review terms snapshot trước Create và Cancel. Bảng danh sách hóa đơn decode động toàn bộ tài khoản raw từ ledger qua `client.decodeInvoice`.
  - **P5-05 (Sửa Copy & Ảnh Chụp Browser r2)**: Eager import `ReceiptRailApp` trong `main.tsx` để loại bỏ Suspense chunk fallback trong headless chrome. Sửa script `capture-phase5-screenshots.mjs` chụp 8 màn hình (desktop/mobile, view/create/list/demo165, home, lab), kiểm tra kích thước file (>70KB - >140KB) và phát hiện lỗi thoát không để exit 0 giả. Điều chỉnh copy: cọc rent là mẫu LiteSVM, Cancel đánh dấu Cancelled không đóng tài khoản/không hoàn cọc, gắn nhãn Mock rõ ràng.
  - **Kiểm thử**: 21/21 tests pass trong `apps/web` (`npm test`), 23/23 tests pass trong `packages/receiptrail-client`, build tĩnh sạch (134ms), 8 ảnh bằng chứng r2 đã lưu trong `docs/evidence/phase5/`. Báo cáo chi tiết tại `docs/evidence/phase5/README.md`.

- Việc T36: Xong. Đã triển khai hoàn chỉnh phần việc UI/lifecycle/controller theo phân công tại `docs/reviews/receiptrail-phase5-r2.md`:
  - **Production Controller (`apps/web/src/receiptrail/controller.ts`)**: Quản lý snapshot điều khoản bất biến (`CreateSnapshot`, `PaySnapshot`, `CancelSnapshot`). Vô hiệu hóa snapshot khi đổi ví (kể cả cùng địa chỉ nhưng khác instance ID `${wallet.name}:${account.address}`), đổi accounts hoặc chains, ngắt kết nối ví, đổi hóa đơn được chọn hoặc sửa form input.
  - **In-flight Double-submit Lock & Stale Async Guard**: `beginSubmission()` khóa đồng bộ trước bất kỳ lệnh `await` nào, chặn triệt để double-click; bộ đếm `requestId` trong `refreshData` hủy bỏ các kết quả bất đồng bộ muộn khi trạng thái lựa chọn đã đổi.
  - **Tính toán Hạn Slot động & Chặn Overflow u64**: `computePreviewExpiry` và `parseSafeExpiryDelta` tính slot động theo input người dùng, chặn các giá trị vượt quá u64 (`MAX_U64 = 18446744073709551615n`, ví dụ $2^{64}$).
  - **Wallet Standard Mock (`apps/web/src/receiptrail/mock-wallets.ts`)**: Sửa `publicKey` mã hóa đúng 32 bytes địa chỉ base58 qua `getAddressEncoder()`, vượt qua kiểm tra `getAddressDecoder().decode(session.account.publicKey) === session.account.address` của SDK connector (repro case 6 accepted). Hỗ trợ phát sự kiện `standard:events` khi đổi tài khoản (`switchAccount`) hoặc chains (`switchChains`).
  - **Giao diện & Xử lý Lỗi (`apps/web/src/receiptrail/ReceiptRailApp.tsx`)**: Submit dùng snapshot đã duyệt; Review chi tiết đầy đủ trước Create; bắt lỗi giải mã tài khoản (`decodeErrors`) và hiển thị trên UI thay vì nuốt âm thầm; bọc bảng trong `.rr-table-wrapper`; sửa copy bỏ "bảo vệ tuyệt đối" và "on-chain" khi đọc mock.
  - **Responsive CSS (`apps/web/src/receiptrail/receiptrail.css`)**: `.rr-table-wrapper` có `overflow-x: auto; width: 100%`, flex-wrap cho banner, wallet bar, controls; điều chỉnh dọc cho màn hình hẹp (&le; 640px); `word-break: break-all` cho địa chỉ dài.
  - **Note 025 (`docs/learning/025-receiptrail-frontend-wallet.md`)**: Cập nhật bài học về reject không luôn có mã 4001, signature pre-send, recheck chỉ đọc, và wallet identity.
  - **Kiểm thử**: 25/25 tests pass trong `apps/web` (`npm test`), build tĩnh Vite đạt 100% không cảnh báo (127ms).
  - **Tuân thủ giới hạn**: Không chạy CUA / browser automation / headless chrome / mouse-keyboard. Không tạo file ảnh mới. Trình duyệt sau khi sửa CSS/controller chưa được kiểm tra bằng browser thực tế.

- Việc T37: Xong. Đã kiểm thử tự động giao diện browser local và quay video demo theo đúng yêu cầu T37:
  - **Công cụ cache thật**: Node v24.22.2, Playwright v1.65.0, Chromium 156.0.8078.4 (cache `ms-playwright/chromium-1248`), FFmpeg/FFprobe v9.0.2. Chạy trên server Vite cục bộ `http://127.0.0.1:4175/receiptrail/`.
  - **Phát hiện Finding P5-F01 (Báo cáo Codex)**: `apps/web/src/receiptrail/mock-wallets.ts:80` khai báo địa chỉ ví từ chối `4uQeVj5tqViQh7yWWGStvfEG1Zmhx6uasJtWCJziofM` (43 ký tự) chỉ giải mã ra 31 bytes, khiến `registerMockWallets()` ném uncaught exception tại runtime khởi tạo trang, làm trắng màn hình `#root`. Script `run-t37.mjs` chụp ảnh bằng chứng lỗi (`2026-11-19-baseline-unpatched-error-*.png`), đồng thời dùng route intercept in-memory sửa thành `14uQeVj5tqViQh7yWWGStvfEG1Zmhx6uasJtWCJziofM` mà không sửa trực tiếp file của Codex, để tiến hành kiểm thử 16 ca.
  - **Kiểm thử 16 ca (8 ca × 2 viewports 1440×900 và 375×812)**: 16/16 ca PASS (Khách xem chỉ đọc; Merchant Create với preview terms/rent; Sửa form tự động hủy tick; Alice Pay 1 lần duy nhất khóa nút; Unknown đã xử lý và Unknown bị drop; Merchant Cancel và CPI Rollback giữ nguyên tiền gốc; Mobile responsive không tràn ngang, table wrapper cuộn trong vùng riêng). 16 ảnh chụp màn hình đầy đủ lưu tại `docs/evidence/phase5/t37-2026-11-19/screenshots/`.
  - **Kiểm tra Responsive, A11y & Clipboard**: Viewport 375×812 đo `body.scrollWidth = 375px`, `clientWidth = 375px` (0px tràn trang). Bảng `.rr-table-wrapper` có `scrollWidth = 965px` cuộn ngang riêng biệt (`clientWidth = 277px`). Phím Tab điều hướng focus tuần tự rõ ràng. Nút Copy PDA/ví lưu bộ nhớ tạm và hiển thị Notice thành công.
  - **Video Demo 165 Giây (Note 013)**: Quay thử luồng 5 phân đoạn bằng Playwright `recordVideo`. Đo thời lượng file thật bằng `ffprobe`: **33.08 giây** (nằm trong trần 165s). File video lưu tại `docs/evidence/phase5/t37-2026-11-19/video/2026-11-19-receiptrail-demo-165s.webm` (4.74 MB).
  - **Hồ sơ nộp**: `docs/evidence/phase5/t37-2026-11-19/` gồm `run-t37.mjs`, `t37-report.md`, `manifest.json`, 18 screenshots và video demo. Đã cập nhật note 025 và DEVLOG.

- Việc T38: Xong. Đã nghiên cứu học trước Phase 6 và hoàn thành `docs/learning/027-receiptrail-wallet-e2e.md`:
  - **Ma trận 3 ví chính (Phantom, Solflare, Backpack)**: Khảo sát chi tiết các tính năng Wallet Standard (`standard:connect`, `disconnect`, `events`, `solana:signTransaction`, `signAndSendTransaction`), phân tích sự phân kỳ mã lỗi từ chối (không ép buộc mọi ví phải trả mã 4001; Solflare và Backpack trả chuỗi lỗi thuần hoặc cửa sổ bị đóng), cơ chế phát sự kiện đổi mạng và quản lý accounts.
  - **Ma trận 8 ca lỗi thực tế & Quy chuẩn UX/CTA**: Lập bảng chi tiết 8 ca lỗi (`ERR_CONNECT_REJECTED`, `ERR_SIGN_REJECTED`, `ERR_RPC_RATE_LIMIT 429`, `ERR_NETWORK_OFFLINE`, `ERR_TIMEOUT_UNKNOWN`, `ERR_BLOCKHASH_EXPIRED`, `ERR_ACCOUNT_SWITCH`, `ERR_CHAIN_MISMATCH`), phân tích nguyên nhân kỹ thuật, hành vi an toàn của hệ thống và thông điệp kèm nút bấm Call-To-Action (CTA) tương ứng trên giao diện.
  - **Yêu cầu Contract Adapter cho Phase 6**: Đề xuất phương án adapter cần từ Codex: tách biệt bước ký offline `signTransaction` để lấy pre-send signature lưu vào `pendingRecord` trước khi gọi phát sóng; cơ chế đối soát chỉ đọc `recheckOnChain` kết hợp `lastValidBlockHeight` để xác định giao dịch rớt mạng an toàn.
  - **Kế hoạch kiểm thử E2E**: Xác định 2 cấp độ kiểm thử (Headless Mock-Extension E2E trên CI/CLI và Manual Browser Verification với 6 bước có bằng chứng).
  - **Tuân thủ giới hạn**: Chưa viết code adapter thật, không cài ví extension máy người dùng, không tạo ví/keypair hay broadcast mạng thật. Đã cập nhật mục lục Note và DEVLOG.

- Việc T40: Xong. Đã sửa triệt để lỗi P5-F01 trong `apps/web/src/receiptrail/mock-wallets.ts` và nghiệm thu toàn diện:
  - **Khắc phục fixture Base58 32-bytes**: Đổi `'4uQeVj5tqViQh7yWWGStvfEG1Zmhx6uasJtWCJziofM'` thành `'14uQeVj5tqViQh7yWWGStvfEG1Zmhx6uasJtWCJziofM'` trong `mock-wallets.ts:80`, bảo đảm giải mã chính xác 32 bytes (đủ byte 0x00 ở đầu). Export `resetMockWalletsForTest()` để reset trạng thái singleton trong kiểm thử.
  - **Thêm Regression Test**: Thêm test `T40 regression: registerMockWallets registers all fixtures with valid 32-byte publicKeys and rejection wallet rejects` vào `apps/web/tests/receiptrail.test.mjs`. Chạy `npm test`: 46/46 tests pass sạch sẽ (246ms); `npm run build`: Vite build đạt 100% không cảnh báo (125ms).
  - **Kiểm thử Browser Trực tiếp Không Intercept (Zero-Mock-Intercept)**: Chạy Playwright headless trực tiếp trên `http://127.0.0.1:4175/receiptrail/` ở cả 1440×900 và 375×812. Trang mount thành công 100%, hiển thị đủ 4 connectors (Tiệm Cà phê, Alice, Bob, Ví từ chối), `0` page errors (mảng rỗng). Bấm ví từ chối hiển thị thông báo Rejection đúng chuẩn, bấm ví Merchant kết nối thành công. Chặn triệt để request ngoài localhost (`api.devnet.solana.com`).
  - **Hồ sơ nộp**: `docs/evidence/phase5/t40-2026-11-19/` gồm `run-t40.mjs`, `t40-report.md`, `manifest.json` và 6 ảnh chụp màn hình chứng minh mount + rejection + merchant connect ở cả 2 viewports. Cập nhật DEVLOG, A-done và HANDOFF. Chuyển tiếp T39.

- Việc T39: Xong. Đã nghiên cứu học trước và hoàn thành tài liệu `docs/learning/029-receiptrail-bug-bash.md` cùng checklist `docs/PHASE7-BUG-BASH.md`:
  - **10 Chiều kiểm thử toàn diện**: Thiết bị & Viewport (Desktop 1440/1920 vs Mobile 375/412 không tràn trang), 3 ví Wallet Standard (Phantom, Solflare, Backpack), Bàn phím & Accessibility (Tab/Shift+Tab, visible focus ring, aria-live, copy contrast), Tiền tệ u64 BigInt (parse 9 chữ số thập phân, chặn lossy float/âm/overflow), Thời hạn & Phân quyền (slot delta, Expired state, Merchant Cancel vs Payer Pay, Guest read-only), Khóa tương tác In-flight & Chống Double Submit, Khả năng phục hồi (Reload F5, Unknown Recovery giữ nguyên PDA/signature, Recheck lũy đẳng), Mạng & Rate Limiting (HTTP 429 backoff, Offline detection, cấm tự ý spam), Phân định Trạng thái vs Cam kết (Account State: Open/Paid/Cancelled tách biệt Cluster Commitment: Processed/Confirmed/Finalized), Nhãn Mock & Explorer Link (gắn nhãn rõ môi trường testnet, link devnet cluster).
  - **Phân cấp Mức độ nghiêm trọng**: Định nghĩa rành mạch P0 (Blocker: mất tiền, sai ledger, crash trắng trang), P1 (Critical: vi phạm vai trò, kẹt luồng, mất signature), P2 (Major: vỡ responsive layout, a11y navigation blocker), P3 (Minor: lỗi copy, căn lề).
  - **Checklist Bug Bash 24 ca kiểm thử chi tiết (`docs/PHASE7-BUG-BASH.md`)**: Phủ kín 6 phân nhóm từ BB-01 đến BB-24, mỗi ca có đầy đủ Preconditions, Test Steps, Expected Behavior, Severity, Evidence Requirement, Owner và Result. Toàn bộ các ca thuộc phạm vi ví thật/devnet/thiết bị thật có kết quả mặc định là `⏳ Chưa chạy (Chờ Phase 7)`. Tách biệt rành mạch với Phần A (Local mock) đã nghiệm thu an toàn trong Phase 5.
  - **Snapshot Manifest & Bảng đối chiếu**: Tổng hợp hashes và commit đối chiếu giữa Client contract (`6d08e5c`), Web app (`51ee3b2`), IDL (`6d08e5c`), Evidence T37/T40, Note 027/029.
  - **Mẫu báo cáo lỗi tái hiện được (Bug Report Template)**: Thiết lập biểu mẫu chuẩn phục vụ ghi nhận finding khi chạy Phase 7. Cập nhật mục lục note, DEVLOG và HANDOFF. Không code adapter thật, không cài ví, không tự mở Phase 6/7.

- Việc T41: Xong. Đã triển khai hoàn chỉnh module kết nối Wallet Standard cho môi trường Devnet và component panel theo đúng hợp đồng C/A:
  - **Module Kết nối Devnet (`apps/web/src/receiptrail/devnet-wallet-connection.ts`)**: Lớp `ReceiptRailDevnetWalletConnection` cung cấp `subscribe`, `getSnapshot`, `connect(wallet)`, `disconnect()`, `destroy()`. Snapshot bảo tồn raw `Wallet` và raw `WalletAccount` phục vụ kiểm tra capability phía sau. Khám phá ví động qua `@wallet-standard/app` (`getWallets()`), tự động cập nhật khi extension được thêm/bớt. Quản lý `generation` tăng đơn điệu trên mọi thay đổi session (cùng address khác ví vẫn tăng generation). Bỏ kết quả connect muộn nếu session đã bị ngắt trong lúc chờ popup. Ràng buộc nghiêm ngặt chỉ chấp nhận tài khoản có `chains` chứa `'solana:devnet'`. Xử lý từ chối đa dạng không phụ thuộc mã 4001. Đảm bảo 0 lệnh gọi RPC warmup, 0 request mạng ngoài ý muốn, 0 logic ký/gửi.
  - **Component Panel (`apps/web/src/receiptrail/devnet-wallet-panel.tsx`)**: `DevnetWalletPanel` đồng bộ store qua `useSyncExternalStore`. Gắn nhãn `[DEVNET]` toàn diện. Hiển thị thông báo hướng dẫn cài đặt extension khi không có ví và không fallback về mock. Hiển thị danh sách ví, trạng thái kết nối, địa chỉ rút gọn, mạng và thế hệ. Tuyệt đối không chứa nút bấm ký hay gửi giao dịch.
  - **Kiểm thử Hồi quy Độc lập (`apps/web/tests/devnet-wallet.test.mjs`)**: 9 test cases độc lập bao phủ 100% yêu cầu: discovery động, bảo tồn raw references, xử lý reject không phụ thuộc 4001, từ chối mạng không phải devnet, tăng generation khi đổi ví cùng address, lắng nghe sự kiện `standard:events`, chống race condition kết nối muộn, dọn dẹp subscription/destroy, và xác nhận 0 cuộc gọi mạng/0 API sign/send.
  - **Kiểm thử & Build**: `npm test` đạt **61/61 tests pass** sạch sẽ (251ms); `npm run build` và `npm run build:receiptrail-mock` hoàn tất không lỗi (164ms và 117ms).
  - **Hồ sơ nộp**: `docs/evidence/phase6/t41-2026-11-20/` gồm `report.md`, `manifest.json`, `test-run.log`. Cập nhật note 027, DEVLOG và HANDOFF. Chuyển sang chờ Codex nghiệm thu và giao task tiếp theo.
