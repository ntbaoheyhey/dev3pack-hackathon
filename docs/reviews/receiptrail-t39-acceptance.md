# C nhận T39 một lượt — 20/11/2026

Nhận checklist24ca và note029 từ `a074779`. **T39 đóng**, không yêu cầu A sửa report hoặc mở thêm vòng. Nhận ma trận ví/thiết bị, steps/expected/evidence, severity và trạng thái chưa chạy. Đây là kế hoạch, không phải kết quả Phase7 hoặc quyền mở phase.

Các hiệu chỉnh sau ưu tiên hơn câu gốc củaA khi dùng checklist:

| Vị trí | Hiệu chỉnh theo contract/plan hiện hành |
| --- | --- |
| BB-08 | Không dùng amount0.05/rent~0.0014/fee~0.000005 làm quote hoặc quyền chi. PlanP6 đề xuất Pay≤0.001SOL, rent≤0.003/Invoice, total fee≤0.000020/tx và tổng0.05; tất cả cần duyệt và quote thực. |
| BB-10/14 | Duplicate không tạo rent mới nhưng tx đã vào chain có thể mất phí. Chỉ rejection rõ trước gửi mới kết luận chưa broadcast; signAndSend mất phản hồi phải Unknown. |
| BB-17/18, note029 mục5 | Cancel chỉ đánh dấu Cancelled, **không close/hoàn rent**. Expired khi Open và `currentSlot >= expiresSlot`; dùng Clock.slot, không block height. Merchant vẫn Cancel được trước/bằng/sau hạn. |
| BB-16/20 | Reload giữ journal/PDA rồi đối soát status/account/expiry; Open/null không chứng minh chưa xử lý. Không tự reconnect/sign/retry. Mock reset khi reload là dữ liệu giả trong RAM, không chứng minh persistence/devnet. |
| BB-23/24 | 44×44px là mục tiêu UX nội bộ; viewport375 không là thiết bị vật lý, vài bước Tab không chứng minh toàn bộ WCAG/contrast. Cổng chưa kiểm tiếp tục ghi chưa kiểm. |
| T37/T40 | T37 qua route rewrite, video33.08s; T40 kiểm bootstrap/reject/connect, không là đầy đủ16ca. Snapshot/source/hashes và kiểm đầy đủ củaC được dẫn riêng. |

Nguồn: [program](../../programs/receiptrail/src/lib.rs), [runtime](../../programs/receiptrail/tests/runtime.rs), [PHASE6-PLAN](../PHASE6-PLAN.md), [review T37](receiptrail-phase5-t37.md), [T38](receiptrail-t38-acceptance.md). Không sửa core hoặc chạy mạng trong lần nhận này. Ví thật/mobile vật lý, contrast/a11y đầy đủ và browser-to-chain thànhD07, không mở task sửa report.
