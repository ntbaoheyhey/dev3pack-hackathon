# 028 — Học audit công khai trước tự review ReceiptRail

- Codex · 19/11/2026 · trước sự kiện; học trước báo cáo `receiptrail-security-r1.md`.

## Tóm tắt 3 dòng

Review tách thiết kế sản phẩm khỏi kiểm signer/owner/account/bytes ở implementation.
Replay cần state nghiệp vụ; chữ ký transaction khác không thay kiểm cùng hóa đơn.
Đối chiếu từng điều với source, assertion và log; tự review không là audit độc lập.

## Khái niệm chính

Đã đọc báo cáo [Wormhole NTT — OtterSec](https://github.com/wormhole-foundation/wormhole-audits/blob/main/2024-03-28-ottersec-solana-ntt.pdf), bìa 28/03/2024, file PDF có 14 trang đánh số và bìa. Đây là audit **dự án khác, lịch sử 2024**, không chứng nhận ReceiptRail. Phụ lục B tách design/implementation; dùng cách phân tích đó để bổ sung note 007.

Những bài học từ báo cáo: trang 5 ADV-00 cần định danh đã dùng để chặn replay; trang 7 SUG-00 kiểm quyền sở hữu account nguồn; trang 9 SUG-02 kiểm recipient; trang 10–11 SUG-03 đối chiếu kích thước serialize đầy đủ; trang 12 SUG-04 kiểm program đích. Không áp nguyên bản cách sửa SPL/ATA cho ứng dụng native SOL. [PDF gốc](https://raw.githubusercontent.com/wormhole-foundation/wormhole-audits/main/2024-03-28-ottersec-solana-ntt.pdf).

Áp vào ReceiptRail (suy luận C): namespace `(program, merchant, invoiceID)` và status Open chống trả lần hai cùng PDA; không chống merchant tạo ID khác cho cùng đơn. Payer signer+has_one và merchant SystemAccount+has_one ngăn đổi người trả/nhận. `Program<System>` cùng CPI ID cố định ngăn arbitrary CPI. Size 131/discriminator/offset phải khớp Rust/IDL/client, không lấy bytes trông giống làm đúng owner. [Constraints Anchor](https://www.anchor-lang.com/docs/references/account-constraints), [Account types](https://www.anchor-lang.com/docs/references/account-types), [note 007](007-solana-program-security.md).

## Cách làm — checklist được dùng

| Nhóm | Kiểm cụ thể | Bằng chứng cần |
| --- | --- | --- |
| Thiết kế | duy nhất theo PDA; terms bất biến; không refund/escrow; rent và authority trust | state machine + test alternateID/terminal |
| Quyền | signer khác pubkey relation; owner/type/recipient/data-empty | source constraints + negative assertions |
| PDA/ABI | namespace/fixed 32 bytes/canonical bump/version/131 bytes | Rust vectors, codec độc lập và wrong PDA test |
| Tiền | u64, amount>0, alias, CPI target, atomic principal/state, phí rollback | tests boundaries/CPI failure/two-Pay + fee payer |
| Thời gian | slot trước/tại/sau expiry; cancel expired; race hai thứ tự | explicit slot tests; không giả là test mạng race |
| Vòng đời | init không reinit; no close/realloc; terminal không reset | create duplicate/terminal/update tests |
| Vận hành | deployment identity/binary/upgrade authority, keys ngoài Git | evidence đã lưu; không tự upgrade/revoke |
| UI/RPC | terms snapshot, stale async, raw wallet events, Unknown | review r3 + T37; ví thật/Phase 6 riêng |

Severity nội bộ: P0 mất tiền/quyền trực tiếp; P1 vi phạm invariant với điều kiện thực tế; P2 availability/misleading UX; P3 tài liệu. Không nâng/hạ severity để gọi đủ cổng. Không phát hiện exploit không đồng nghĩa không có lỗi.

## Bài học / lỗi đã gặp

| Bẫy | Cách xử lý |
| --- | --- |
| Tải PDF trả octet-stream làm tool đọc lỗi | curl đọc tài liệu và pdftotext có sẵn; không cài; chỉ lưu hash/URL, không commit toàn PDF |
| PDF dùng font giãn chữ | Đọc cả raw/layout và mục/page; không chép OCR thành code hoặc suy finding không thấy |
| Comment “local only/no deployment keypair” đã cũ | Tách metadata/tài liệu với code runtime; ghi finding P3, không tự upgrade để sửa comment |
| Snapshot merchant/payer không có fee payer | Kiểm test phí riêng tại runtime:815 và create/pay rollback:765, không nói fail hoàn mọi phí |

## Nguồn và giới hạn

Nguồn trên đọc 19/11/2026. Báo cáo 2024 chỉ gợi checklist; ReceiptRail dùng Anchor 1.2.2 và program đã deploy ở P4, không dùng phiên bản trong audit. Đối chiếu source cùng revision triển khai 6d08e5c và CI recovery e9a1603; không chạy lại suite không đổi chỉ để tạo số test mới. [Báo cáo r1](../reviews/receiptrail-security-r1.md) ghi kết quả và các giới hạn còn mở.
