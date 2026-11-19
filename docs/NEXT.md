# NEXT — Phase4 CI và devnet đã duyệt; Phase5 local song song

Người dùng mở Phase4/5 rồi trả lời **“Đồng ý cả P4-A và P4-B”**, log13:55:34.348UTC+7 ngày19/11/2026; [DECISION](ideas/DECISION.md)/[record](evidence/phase4/user-permission-p4ab-2026-11-19.json). Không hỏi lại. Automation15phút ACTIVE.

1. CI đầu8df85c0 đã đạt cả push/PR; đúng4keys đã tạo ngoài Git. Không chạy lại bước tạo keys.
2. Revision triển khai6d08e5c đạt3jobs ở push44477944228; PR44477949631 cancelled. Manifest33input hashes và preflight đã đạt/push a302ba9; tiếp tục upload/deploy theo Thẻ nhớ.
3. P4-B ReceiptRail initial deploy+CLI smoke trên devnet, **trần1.8SOL**, đúng [PHASE4-PLAN](PHASE4-PLAN.md), journal/đối soát/finalized; không mở upgrade mới hoặc auto-resend.
4. A tiếp tục T34 local UI/ví/mock theo [queue](tasks/A-queue.md)/[client contract](PHASE4-CLIENT.md); C review khi nộp. Chưa có bài nộp mới, không lấy client tests của C thay acceptance UI.
5. Chốt docs/PR7/push sau mốc; không merge. T31/T32/T33 vẫn đóng/nợD01–D03, không mở vòng sửa.

Còn cần quyền riêng: public/update web, cài thêm máy người dùng, signer ngoài4được duyệt, vượt trần, upgrade mới, mergePR7 hoặc Phase6. Ví thật/giáo viên còn riêng. Mở phase/quyền triển khai không có nghĩa các cổng thực thi đã đạt.

Mốc identity19/11: CI đầu8df85c0 đạt cả hai runs; đúng4keys đã tạo ngoài Git sau gate. Runtime32/client23/guards7 đạt với identity mới, [metadata](evidence/phase4/deployment-local-metadata.json). Theo Thẻ nhớ để kiểm CI revision triển khai trước broadcast; không tạo lại keys.
