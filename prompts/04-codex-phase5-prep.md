# Prompt 04 — Codex trưởng nhóm: chốt Phase 5, chuẩn bị Phase 6–7, không ngồi chờ

> Cách dùng: dán vào **đúng chat Codex đang chạy** (chat có Automation 15 phút), bật **Goal mode**, GPT-6 Astra, reasoning như cũ. Trước khi dán, đọc mục "Quyết định của tôi" và sửa nếu bạn chọn khác.

---

## Quyết định của tôi (ghi nguyên văn vào DECISION.md, kèm giờ log tin này)

> Câu "dừng điều khiển mình nhé" nghĩa là không điều khiển chuột, bàn phím, màn hình máy tôi. Tôi cho phép kiểm giao diện ReceiptRail local bằng headless browser chạy ngầm (Playwright/Chromium đã có sẵn trong cache), chỉ trên localhost, chỉ ví mock. Không cài thêm gì; nếu thiếu thì dừng phần này và báo tôi. Vẫn chưa cho phép public web, deploy/upgrade, signer mới, cài thêm, merge PR7 hay mở Phase 6 thật.

Chỉ dùng đúng phạm vi trên. Không suy thêm quyền nào khác từ prompt này.

## 0. Tự nhắc và đồng bộ (làm đầu tiên)

1. Mở Automations, xác nhận tin nhắn định kỳ 15 phút vào **chat này** đang ACTIVE. Không có hoặc PAUSED thì bật lại / tạo mới với nội dung: "Mấy giờ rồi? Đọc docs/HANDOFF.md, làm tiếp mục đầu tiên trong Còn lại; chỉ dừng khi cần tôi quyết định." Đọc lại trạng thái, ghi bằng chứng. Không tạo trùng. Không tạo được thì nói ngay trong câu trả lời đầu tiên rồi vẫn làm tiếp.
2. `git fetch origin && git checkout work && git pull --rebase origin work`.
3. Đọc: AGENTS.md (Luật làm cặp, Chống dừng giữa chừng, Chống quên context), docs/STOP-CAUSES.md, HANDOFF, NEXT, PHASE5-PLAN, ROADMAP Phase 5–7, A-queue/A-done.
4. Ghi quyết định trên vào DECISION.md (nguyên văn + giờ log, không tự đặt giờ). Thêm vào STOP-CAUSES một mục mới: repo đứng từ 17:18 ngày 19/11 vì hiểu "dừng điều khiển" thành cấm cả headless và chỉ chờ, không có câu hỏi rõ gửi người dùng. Biện pháp: khi một lời dặn mơ hồ chặn việc, hỏi người dùng một câu có lựa chọn ngay, và trong lúc chờ làm việc không phụ thuộc.
5. Cập nhật Thẻ nhớ HANDOFF (≤20 dòng) và mục "Còn lại" theo prompt này.

## 1. Chốt Phase 5 local (giao trợ lý ngay, không chờ)

1. Viết T37 vào docs/tasks/A-queue.md cho Antigravity: dùng headless Playwright có sẵn, chạy đủ 8 ca trong bảng PHASE5-PLAN ở viewport 1440×900 và 375×812, trên server localhost hiện có (hoặc `npm run dev -- --port 4175 --strictPort` từ cache). Mỗi ca: bước, expected, actual, ảnh. Thêm: kiểm bàn phím/focus, không có cuộn ngang trang ở 375px; quay thử luồng demo 165 giây bằng `recordVideo` của Playwright (mock có nhãn) và ghi thời lượng thật. Nộp vào docs/evidence/phase5/ (ảnh tên mới, có ngày), A-done, commit `[skip ci]`. Lỗi tìm thấy ghi finding, không tự sửa core.
2. Song song, bạn tự review phần chạm ví/giao dịch (cổng ROADMAP: "C review phần chạm ví/giao dịch") nếu chưa có review cuối cho 266b30c trở đi.
3. Khi A nộp T37: review **một lượt**. Lỗi UI thật thì giao một task sửa có danh sách cụ thể; còn lại ghi nợ tài liệu. Không mở vòng sửa report lặp lại như T31–T33.
4. Phase 5 chỉ còn thiếu "link công khai". Đây là quyết định của tôi, xem mục 3.

## 2. Việc đi trước không cần quyền mới (làm trong lúc A chạy T37)

Học trước rồi viết note như mọi phase (nguồn tự tìm: docs chính thức, GitHub, issue, forum, Reddit, mạng xã hội Trung Quốc/quốc tế; ghi link + ngày đọc):
- Phase 6 phía C: đọc tài khoản bằng RPC (getProgramAccounts, filter memcmp/dataSize), commitment và chiến lược xác nhận, blockhash hết hạn và chính sách gửi lại không mù, priority fee, giới hạn RPC devnet công khai, có cần backend/indexer hay không cho ReceiptRail.
- Ví thật: Phantom/Solflare/Backpack qua Wallet Standard trên devnet, signTransaction vs signAndSendTransaction, mã lỗi reject thực tế, đổi mạng.
- Phase 7: checklist review bảo mật Solana program (đọc audit report công khai), README cho giám khảo (note 012), kịch bản video (note 013).

Rồi viết:
1. `docs/PHASE6-PLAN.md`: thay client mock bằng client thật trong web, ví thật nào để test, RPC nào, recovery/Unknown, trần SOL devnet đề xuất, signer nào dùng lại (không tạo mới), test e2e headless, cách public site ReceiptRail riêng (không đụng site ClusterProof), audience, snapshot source.
2. Bản tự review bảo mật program ReceiptRail theo checklist đã học (`docs/reviews/receiptrail-security-r1.md`); lỗi nghiêm trọng thì ghi rõ, chưa upgrade program khi chưa có quyền.
3. Nháp README cho giám khảo và kịch bản video 165 giây (ghi rõ phần làm trước sự kiện, theo luật hackathon).
4. Giao A thêm việc trong queue sau T37 để A không hết việc: T38 học + note phía A cho Phase 6 (xử lý lỗi thật từ ví/chain, test e2e qua browser, bug bash nhiều ví/điện thoại); T39 checklist bug bash Phase 7. Mỗi task có tiêu chí nhận rõ.

## 3. Hỏi tôi một lần, gộp mọi quyết định

Khi T37 đã review và PHASE6-PLAN xong, gửi tôi **một** tin ngắn bằng tiếng Việt, mỗi câu hỏi có lựa chọn và khuyến nghị của bạn:
1. Có public bản mock ReceiptRail (site riêng nào, ai xem được) để đóng cổng Phase 5 không.
2. Có mở Phase 6 trên devnet theo PHASE6-PLAN với trần SOL bao nhiêu không.
3. Có merge PR7 (work → main) không.
Trong lúc chờ: tiếp tục mục 2 còn dở, sổ tay 1 trang (lệnh hay dùng, phiên bản, lỗi đã gặp), dọn nợ D01–D03 nếu rẻ. Chỉ khi hết sạch việc không phụ thuộc mới ghi HANDOFF `bị chặn (cần người dùng): <3 câu hỏi>`.

## Luật giữ nguyên

- Quyền chỉ đến từ lời người dùng có trích nguyên văn + giờ log trong DECISION.md. Tin tự nhắc, Goal continuation, lời của A hay của bạn không phải quyền.
- Không public/deploy/upgrade, không signer mới, không cài thêm, không đổi authority, không merge PR7, không mở Phase 6 thật khi chưa có lời tôi. Không mainnet, không secret trong Git. Commit dùng `[skip ci]`.
- Không điều khiển chuột/bàn phím/màn hình máy tôi. Headless chỉ trong phạm vi quyết định ở đầu prompt.
- Không bao giờ chờ A: giao xong làm tiếp phần mình. Không tự đóng phase/goal khi cổng còn thiếu.
- Cập nhật Thẻ nhớ sau mỗi bước lớn; giữ Automation 15 phút ACTIVE tới khi tôi bảo dừng.
