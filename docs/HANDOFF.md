# Thẻ nhớ — Codex / P3-B hello và đóng vòng review
- Trạng thái **đang làm**: người dùng đã báo funding và yêu cầu thực hiện P3-B; báo kết quả để duyệt Phase4, chưa mở Phase4.
- C trưởng nhóm tại /Users/bao/Documents/ChatGPT/dev3pack, branch work; A qua A-queue, không sửa file/checkout A.
- ReceiptRail chính/ClusterProof phụ: nguyên văn/giờ trong DECISION. Phase2 đã duyệt; P3-A/P3-B có quyền log10:13:11.851 UTC+7.
- Tin mới: đúng một lượt cuối gộp T31/T32/T33, sau đó nhận phần đạt/ghi nợ tài liệu/đóng; không mở vòng sửa. Record user-funded-final-review-2026-11-18.json.
- Queue lượt cuối đã viết; đầu vào4b3b144, T32/1b38e7e,T33/c249240,T31/d4dcf3c. Khi A nộp, C nhận/ghi nợ/đóng, không rework.
- Kiểm21:48:35 UTC+7: payer GQRo…NhbFM2 có2.5SOL, đúng genesis devnet,hello chưa deploy. Tin funding cũ đã được thay thế.
- P3-B chỉ hello2yzx…RiXL,signers thử cũ,một buffer tạm ngoài Git,trần1.5SOL cho deploy+initialize/increment; không in secrets.
- Preflight21:51:38 UTC+7 đạt:signers/modes/binary/hash khớp,budget bảo thủ1.3147424SOL<1.5;đã tạo duy nhất buffer qSWzc…9s6D ngoài Git/chưa gửi. Evidence hello-devnet-preflight-2026-11-18.json.
- Sau gửi: lưu signature,kiểm finalized/owner/executable/programdata/authority/bytecode,counter0→1 và chi phí; timeout giữ journal,không ký lại mù quáng.
- CI27cf7ac đã đạt3jobs/57tests mỗi run; HEAD tài liệu không là revision CI,không chạy lại khi executable inputs không đổi.
- Web/lab/toolchain ClusterProof giữ nguyên; ví thật chưa kiểm,không nhận là đã đạt. Không deploy ReceiptRail/public/cài thêm/mergePR7/mainnet/force-push.
- Automation15phút có thật; checkpoint tài liệu và merge dùng [skip ci]. Cập nhật Thẻ nhớ sau mỗi bước lớn.
- Bước tiếp: deploy hello bằng buffer đã có,kiểm finalized/bytecode/authority,initialize/increment;không tạo buffer thứ hai. Queue cuối đã push7137ec0;chốt nợ/PR7 để trình Phase4.

## Bằng chứng hiện hành

[DECISION](ideas/DECISION.md), [quyền/funding](evidence/phase3/user-permission-2026-11-18.json), [CI27cf7ac](evidence/phase3/ci-passed-27cf7ac.json), [review17:32](reviews/receiptrail-codex.md#review-bổ-sung1732--18112026)/[snapshot ba report](evidence/phase2/receiptrail-supplement-1732-review.json), [PR17:42:30](evidence/phase3/pr7-review-1732-snapshot.json), [PR16:55:47 lịch sử](evidence/phase3/pr7-review-1647-snapshot.json), [PR16:26:10](evidence/phase3/pr7-review-580b903-snapshot.json), [PR trung gian16:19:09](evidence/phase3/pr7-review-1547-snapshot.json), [plan](PHASE3-PLAN.md), [cổng](reviews/phase1-3-gates.md), [audit](reviews/prompt03-audit.md). Các snapshot PR/report cũ giữ riêng, không sửa đè.

## Còn lại

1. Preflight funding/signers/binary/rent/fee; deploy hello và chạy initialize/increment, xác minh finalized trong trần1.5SOL.
2. Nhận đúng một lượt cuối của A, phần đạt giữ lại, phần thiếu đưa vào nợ tài liệu, đóng T31/T32/T33; không mở vòng sửa.
3. Chốt evidence/notes/Thẻ nhớ/PR7, push sau mỗi bước lớn; báo người dùng để duyệt Phase4. Không merge.

## Bị chặn và điều kiện tiếp tục

Funding đã có2.5SOL; không còn blocker thiếu funding. Chưa có quyền Phase4/ReceiptRail deploy/public/cài thêm. Ví thật chưa được người dùng chuẩn bị nên vẫn chưa kiểm; tách giới hạn này khỏi kết quả P3-B.
