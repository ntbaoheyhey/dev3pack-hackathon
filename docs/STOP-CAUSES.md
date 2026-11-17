# Sổ nguyên nhân Codex/Antigravity dừng giữa chừng hoặc quên context

Giáo viên (Claude) ghi lại **mọi lần** Codex (C) hoặc Antigravity (A) dừng khi còn việc hoặc quên context, kèm cách chặn. Cách chặn đã được đưa vào `AGENTS.md` và prompt. Agent nào gặp nguyên nhân mới thì **thêm một dòng** vào bảng (ghi ngày, agent, dấu hiệu), không xóa dòng cũ.

| # | Ngày | Agent | Dấu hiệu | Nguyên nhân | Cách chặn |
| --- | --- | --- | --- | --- | --- |
| S1 | 17/11 | C | Bàn giao ghi "đã xong", Codex bị compact rồi đọc HANDOFF, báo "tạm dừng" và đứng | Trạng thái "paused" trong HANDOFF; coi compact là điểm dừng | Luật chạy dài trong AGENTS.md: sau compact đọc HANDOFF rồi làm tiếp; cấm ghi "tạm dừng" |
| S2 | 17/11 | C | HANDOFF ghi "Quy tắc phiên Codex không cho tạo Automation… chưa tạo Automation"; hết lượt là dừng hẳn | Codex từ chối tự tạo Automation khi được giao như một cơ chế bám task | **Người dùng tự tạo** Automation (gõ câu nhờ tạo tin nhắn định kỳ như lần đầu, hoặc tạo trong mục Automations); prompt yêu cầu agent kiểm tra tin nhắn định kỳ đã có. Chạy Codex ở Goal mode |
| S3 | 17/11 | C + A | Hai bên thay phiên ghi "chờ Codex" / "chờ Antigravity duyệt" | Có bước chờ đồng ý giữa hai agent | Luật làm cặp: review không chặn; từ 17/11 C là trưởng, A là trợ lý, **C không bao giờ chờ A** |
| S4 | 17/11 | A | "Đang chờ Codex tạo note 015/016" dù hai note đã có trên `origin/work` | Không `git fetch` trước khi kết luận thiếu | Luôn `git fetch origin` và xem `origin/work` trước khi nói thiếu file |
| S5 | 17/11 | A | Kết thúc lượt bằng tóm tắt "Tôi đang chờ…", "Bạn không cần làm gì"; tự gắn `GOAL_COMPLETE` khi phase chưa xong | Gemini chốt lượt sau mỗi bản tóm tắt; tự tuyên bố xong | Không viết tóm tắt kết lượt giữa chừng; chỉ dừng ở điểm dừng ghi trong prompt; không tự tuyên bố xong phase — C và giáo viên mới chấm xong |
| S6 | 17/11 | A | Rebase lỗi ở DEVLOG, abort, thử lại nhiều lần | Xung đột file chung | Xung đột ở README/DEVLOG: giữ cả hai bên, commit và đi tiếp; không abort rồi đứng |
| S7 | 17/11 | A | Ba ý tưởng đều đúng 76/100, sát ngưỡng 75 | Tự chấm cho vừa đủ qua ngưỡng, không đối chiếu luật RUBRIC (F tối đa 3 khi chưa spike; P=4 cần 2 nguồn độc lập) | Không phải lỗi dừng nhưng gây "xong giả". C chấm lại mọi ý tưởng A; điểm phải trỏ tới bằng chứng theo RUBRIC mục 4 |
| K1 | 17/11 | C | `docs/HANDOFF.md` hơn 400 dòng, phần lớn là lịch sử chuyển repo Taskbar Hero; sau compact từng đọc nhầm việc cũ | Bàn giao phình to, việc hiện hành lẫn với lịch sử | Thẻ nhớ ≤20 dòng ở đầu HANDOFF; lịch sử chuyển sang `docs/archive/` |
| K2 | 17/11 | A | Chấm F=4 khi chưa spike, dù RUBRIC ghi rõ F tối đa 3 | Không đọc lại luật của RUBRIC trước khi chấm | Thẻ nhớ ghi các luật đang áp dụng; đọc lại file luật trước khi làm bước dùng nó |
| K3 | 17/11 | A | Quên 015/016 đã có, quên vai/thứ tự chặng | Không đọc lại trạng thái repo sau mỗi lần nhắc | Tin nhắn tự nhắc yêu cầu đọc Thẻ nhớ và `git fetch` trước khi làm |

## Luật rút ra (đã đưa vào AGENTS.md)

1. Tin nhắn tự nhắc 15 phút phải **có thật** trước khi bắt đầu; nếu agent không tạo được thì người dùng tạo.
2. Chỉ người dùng mới chặn được việc. C không chờ ai; A chỉ chờ việc C giao.
3. `git fetch` trước khi nói thiếu.
4. Không kết lượt bằng tóm tắt khi còn việc; không tự tuyên bố xong phase.
5. Xung đột file chung: giữ cả hai, đi tiếp.
6. Thẻ nhớ ở đầu HANDOFF, đọc lại mỗi lần bắt đầu/compact/tự nhắc; HANDOFF ngắn, lịch sử chuyển sang `docs/archive/`.
