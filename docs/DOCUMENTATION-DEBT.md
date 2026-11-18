# Nợ tài liệu — ReceiptRail

18/11/2026 · C nhận đúng một lượt cuối A tại `7857e9b`, sau queue `7137ec0`. **T31/T32/T33 đã đóng theo chỉ đạo người dùng. Các khoản dưới đây không phải hàng đợi sửa hoặc vòng review mới; không chặn P3-B, không mở Phase 4.** [Snapshot nhận cuối](evidence/phase2/receiptrail-final-pass-2026-11-18.json).

| Khoản nợ | Phần nhận/giữ | Phần còn thiếu và giới hạn |
| --- | --- | --- |
| D01 — T31-E1/E2/E3 | Năm URL; nhãn Web API/GraphQL/EVM và không chứng minh double-pay Solana; Pending/Unknown không tự ký/retry; Expired có Open | Thiếu provenance/ngày đọc/cơ chế/trade-off cho từng claim, context PDA/program/cluster và bảng ba mốc expiry. Paid vẫn đồng nhất với Finalized; phản hồi nhóm không thay từng finding. Chưa crawl/pilot mới, không tăng điểm từ report. |
| D02 — T32-R1/R2/R3 | Payer ký pay, merchant nhận là SystemAccount; has_one so pubkey, seeds/bump kiểm Invoice; merchant ký cancel; log r2:26/39/23–24 đúng; giới hạn VM serial/chưa network | Thiếu data-empty/owner/version đầy đủ, ba tên test còn rút gọn và assertion thiếu vị trí. Snapshot runtime148–157 không có fee payer: không suy mọi số dư/phí không đổi. Retry: signature khác228/snapshot233; two-pay250–257 rollback toàn tx; insufficient268–269. Ma trận/verified/phản hồi nhóm chưa thay bằng chứng từng mục. |
| D03 — T33-R1/R2/R3 | Phí create/pay, terms bất biến/read-only, Unknown không tự retry, reload recipient; chín code-name khớp IDL; storyboard tổng165giây trên giấy | Paid là Invoice state, commitment riêng; Pay của payer, Expired chỉ Open+slot>=expiry.6002 là payer zero hoặc account data không rỗng, không tự là missing/reconnect;6008 là invoice.version. Form/validation/CTA/tám bố cục chưa đủ; bốn bullet lặp mobile không thành tám wireframe. Chưa demo browser timeout/duplicate-tx/receipt thật; SDK v1.9x/v0.2x/ngày thiếu nguồn không là bộ đã kiểm. |

Nguồn ưu tiên: [ARCHITECTURE](ARCHITECTURE.md), [IDEA](IDEA.md), [IDL](idl/receiptrail.json), [program](../programs/receiptrail/src/lib.rs), [runtime](../programs/receiptrail/tests/runtime.rs), [log r2](evidence/phase2/receiptrail-spike-r2.txt). Giữ nguyên report A để truy nguyên; không dùng câu sai trong report làm contract triển khai.

Lượt cuối T31/T33 chủ yếu đổi tiêu đề; T32 làm rõ has_one pubkey và lời phản hồi. A-done tự nhận sửa UX/provenance không đủ chứng minh các phần đó đạt. C nhận phần đúng ở trên, ghi thiếu sót tại đây và **đóng cả ba task**, không yêu cầu nộp lại. Không phải verdict giáo viên hoặc audit độc lập. Ví extension thật/chưa reproducible build là giới hạn Phase 3 riêng.
