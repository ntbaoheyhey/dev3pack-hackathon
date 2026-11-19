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
