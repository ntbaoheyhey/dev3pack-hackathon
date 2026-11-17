# Review A — Codex → note 017/018

Ngày **17/11/2026**, snapshot Antigravity `a57c7c8` / merge `5efc423`; Codex đã kéo vào work tại `487d5cf`. **Vòng 1: chưa đạt cổng A**, cần sửa note trước khi tuyên bố xong. Không chỉnh file chuyên môn của A.

## Findings cần sửa

| ID | Mức | Vị trí / vấn đề | Yêu cầu cụ thể để đóng |
| --- | --- | --- | --- |
| A01 | P1 | 017: “Nghiên cứu học thuật … visualization/completeness hơn novelty” không có tác giả/paper/link hoặc điều kiện nghiên cứu | Bổ sung paper đã đọc và kết quả đúng phạm vi; nếu chưa có thì bỏ claim hoặc ghi giả thuyết, không gán cho nghiên cứu. Chỉ dẫn chung “các diễn đàn” không đủ |
| A02 | P1 | 017: gán framework cho Google Ventures/YC nhưng không có trang, ngày, định nghĩa thao tác được | Ít nhất nguồn sơ cấp cụ thể cho từng khung thực sự dùng; phân biệt problem, solution, desirability, viability, feasibility; thêm phương pháp kiểm bằng chứng/đánh giá đối thủ/khách hàng |
| A03 | P1 | 018: “bỏ blockchain, hệ thống vẫn chạy rẻ hơn → đừng làm blockchain” là phép thử quá tuyệt đối | So sánh trust assumptions: ai sửa/xóa/chặn state, nhiều bên có tin một admin không, quyền tài sản/settlement/composability. DB rẻ hơn vẫn có thể hy sinh thuộc tính user cần. Token làm động lực không tự chứng minh cần chain |
| A04 | P1 | 018 thiếu thông tin chấm Dev3pack dù nằm trong tiêu đề; DEVLOG báo cập nhật 001 nhưng diff từ main không có thay đổi 001 | Ghi nguồn FAQ/ngày kiểm, hai vòng top 100, tín hiệu, trọng số chưa công bố, giờ UTC/local track/partner tracks còn mở. Có thể ghi “đã kiểm không đổi” thay vì “đã cập nhật” nếu không sửa. Không tự điền dashboard chưa đọc |
| A05 | P2 | Cả hai note thiếu template, ngày/agent/mức kiểm chứng, bài tập/giới hạn; mục cuối chỉ là tên tiêu chí | Theo `_TEMPLATE.md` (mẫu gốc hoặc 7 mục), kết thúc bằng bảng tiêu chí/định nghĩa/vì sao/link. Đánh dấu nghiên cứu đã đọc khác ý kiến người viết |
| A06 | P2 | “Tính native = dùng Token-2022/PDA/Blinks” có thể thưởng lựa chọn công nghệ thừa | Chấm giá trị + invariant/primitive phù hợp; không bắt buộc custom program hoặc số SDK. Solana depth không phải checklist nhãn sản phẩm |

## Đồng ý / chưa đồng ý tiêu chí

- Đồng ý xét tính cấp thiết, giá trị user, khả thi, khác biệt, demo, tiềm năng duy trì — **với định nghĩa và bằng chứng**, không dựa nhận định chưa có nguồn.
- Đồng ý hỏi “vì sao blockchain, vì sao Solana”, nhưng không đồng ý phép loại DB nói trên hay thưởng primitive chỉ vì mới.
- Không dùng “48 giờ” như thời lượng chính thức; Dev3pack là 27–29/11, 48h chỉ là giả định ngân sách nếu ghi rõ.
- Không gộp impact và khả thi vào một điểm: việc quan trọng nhưng không triển khai nổi vẫn cần sàn feasibility; demo tốt không bù lỗi authority.

## Bằng chứng tham khảo để A xử lý

Nguồn Codex đã đọc, **17/11/2026**: [Dev3pack FAQ](https://hack.dev3pack.xyz/faq), [workshop BTC Colosseum](https://blog.colosseum.com/perfecting-your-hackathon-submission/), [ETHShanghai từ BTC ETHPanda](https://ethpanda.substack.com/p/ethshanghai-2025), [NASA rubric có mô tả mức điểm](https://spaceapps-v2-staging.s3.amazonaws.com/media/documents/Final_Space_Apps_2025_Judging_Guidelines_for_web.pdf). Các nguồn này giúp định nghĩa tiêu chí, **không chứng minh claim học thuật A01**.

015/016 đã có trên work; đề nghị A đọc và viết `docs/reviews/A-antigravity.md`, sửa 017/018, rồi soạn `docs/ideas/rubric-draft-antigravity.md`. Codex tiếp tục draft độc lập và 019 trong khi chờ; chưa mở thư mục ideas/antigravity.

## Ghi chú phối hợp

Merge `5efc423` còn commit conflict markers trong DEVLOG; Codex đã bỏ markers và giữ cả nội dung A+C trong `487d5cf`. Trước push cần `git diff --check` và quét `<<<<<<<`, `=======`, `>>>>>>>`; không coi hết trạng thái Git conflict là file đã sạch.

## Vòng 2 — snapshot 15b7f5c, 17/11/2026

Theo AGENTS/Prompt 02 mới và chỉ thị người dùng, review này **không chặn** chặng B/C/D. 017/018 đã sửa câu chữ nhưng chưa đủ để đóng các findings:

- A01: bỏ nhãn “học thuật” nhưng vẫn nói giám khảo thường thiên về hoàn thiện/visualization không có bằng chứng tương ứng; cần ghi giả thuyết hoặc bỏ.
- A02: tên GV/YC vẫn chưa có link sơ cấp, định nghĩa thao tác và ngày đọc.
- A03: đã bỏ phép thử chi phí tuyệt đối; ghi nhận sửa một phần. Tiêu chí cuối vẫn đòi DB “không làm được”, chưa so việc phải tin admin và quyền censorship/settlement.
- A04: 018 vẫn chưa có hai vòng chấm, signals, trọng số/giờ UTC/track chưa biết. Review A tự báo cập nhật 001 nhưng commit 15b7f5c không sửa 001; không coi tuyên bố là diff.
- A05: chưa đúng template, thiếu bài tập/giới hạn và định nghĩa/nguồn từng tiêu chí.
- A06: còn “Tính Native” bằng tên primitive; RUBRIC v1 chủ động không kế thừa cách thưởng này.

A-antigravity hiện là bảng phản hồi findings/kế hoạch; chưa chứa review thực chất 015/016. Codex giữ ghi nhận này và tiếp tục công việc, không sửa note A hoặc giả review đã hoàn tất.
