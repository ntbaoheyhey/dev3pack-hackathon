# Hàng đợi Antigravity — đúng một lượt cuối T31/T32/T33

**Chủ file: Codex. Trạng thái: mới — một lượt cuối duy nhất, gộp cả ba task.** Chỉ đạo trực tiếp mới ở [DECISION](../ideas/DECISION.md#chỉ-đạo-mới-một-lượt-cuối-và-thực-hiện-p3-b--18112026) thay mọi yêu cầu sửa bổ sung trước đây. Sau lượt này C nhận phần đạt, ghi phần thiếu vào nợ tài liệu và đóng T31/T32/T33. **Không nộp vòng hai, không tạo task sửa mới, không tự quay lại queue lịch sử.**

Mốc nhận đầu vào: work4b3b144; T32/1b38e7e đã sửa phân biệt has_one/pubkey với Invoice PDA; T33/c249240 giữ phí/Terms/Unknown/reload recipient nhưng nhãn6002 fixed không sửa nội dung. T31 vẫn d4dcf3c. Đọc learning index và notes021/023 trước sửa. C làm P3-B độc lập, không chờ A.

## Một lượt cuối — T32 → T31 → T33, nộp một lần

Chỉ sửa ba report do A sở hữu; giữ phần đã đúng. Làm phần có thể hoàn tất trong lượt này; thiếu bằng chứng thì ghi rõ chưa kiểm/đề xuất nợ tài liệu, không giả đã đạt.

1. **T32:** giữ has_one so pubkey, seeds/bump của Invoice và merchant không ký pay; thêm data-empty, tên3test đầy đủ từ [yêu cầu đã giao](../archive/A-queue-before-final-pass-2026-11-18.md), assertion và log26/39/23–24. Snapshot runtime148–157 không gồm fee payer; retry signature khác228/không đổi233, two-pay250–257 rollback Open, insufficient268–269. Ma trận/từng finding còn thiếu ghi đúng phạm vi; không dùng verified thay assertion.
2. **T31:** giữ5URL/nhãn pain/Unknown/expiry; Paid là state, commitment riêng, expiry chỉ Open+slot>=expiry, đọc cùng PDA/program/cluster. Bổ sung provenance/cơ chế từ nguồn thật đã đọc; chưa đọc thì ghi nguồn gián tiếp/chưa kiểm, không bịa ngày. Không còn yêu cầu crawl vô hạn để đóng task.
3. **T33:** giữ phí/Terms/no-auto-retry/reload recipient; sửa Paid/commitment, vai Pay của payer và Expired có Open.6002 kiểm payer zero hoặc account data không rỗng, không tự là reconnect/missing;6008 là invoice.version. Các phần form/8bố cục/demo/SDK chưa đủ ghi nợ tài liệu;165giây chỉ kịch bản trên giấy.

**Nộp duy nhất:** cập nhật A-done dòng `LƯỢT CUỐI T31/T32/T33 — đã nộp`, ghi commit, phần đạt, phần thiếu/chưa kiểm; cập nhật HANDOFF A và push với `[skip ci]`. Sau nộp kết thúc các task này; C chỉ nhận/ghi nợ/đóng, không giao sửa bổ sung. Không sửa file C, cài/code UI/tạo ví/deploy/public hoặc mở phase mới. Các yêu cầu chi tiết cũ là [lịch sử](../archive/A-queue-before-final-pass-2026-11-18.md), không là vòng việc mới.
