# ReceiptRail — nhận T37 một lượt

Codex · 19/11/2026 · bài A tại `7676053`, baseline `78c340f`. [Report A](../evidence/phase5/t37-2026-11-19/t37-report.md) được giữ nguyên; đây là lượt review duy nhất, không yêu cầu sửa/nộp lại report.

**Nhận finding P5-F01; chưa nhận bản gốc là đạt browser.** C tái hiện bằng headless Chromium/cache, chỉ localhost/mock, không đổi source hoặc response: [baseline C](../evidence/phase5/c-prompt04-review-2026-11-19/baseline.json). Địa chỉ ví từ chối giải mã thành 31 bytes làm `registerMockWallets()` ném lỗi trước React mount; root trống. Đây là lỗi chặn mọi màn hình và phải sửa trước public.

A kiểm 16 ca bằng cách intercept module rồi thêm ký tự `1` vào địa chỉ. Kết quả đó là bằng chứng có điều kiện cho phương án sửa, không chứng minh snapshot Git hiện tại đã chạy. Không gọi 45 Node tests/build là bằng chứng bootstrap browser. C đã nhận trách nhiệm thiếu kiểm này.

## Nhận và xử lý

| Phần | Kết luận |
| --- | --- |
| P5-F01 / ảnh baseline | Nhận. T40 sửa đúng fixture + regression khởi tạo tất cả ví; không đổi program/client/IDL |
| Create, reset terms, Pay, hai Unknown, Cancel và responsive | Nhận làm bằng chứng có điều kiện. C kiểm lại trên source thực sau patch, không route rewrite |
| Video | File thật 33.08 giây, trong trần 165 giây; là diễn tập UI nhanh, không video thuyết trình hoàn chỉnh hoặc bản source chưa sửa đã chạy |
| Source hashes null | Nợ D04. Script lấy repoRoot thiếu một cấp nên không gắn source. Không yêu cầu A nộp lại report cũ; snapshot mới C đo hashes thật |
| Cancel expired/CPI rollback, clipboard contents, focus | Script chỉ kiểm Cancel Open, notice Copy và ghi activeElement; chưa đủ chứng minh toàn bộ expected. C bổ sung các kiểm hành vi này khi nghiệm thu patch, không mở vòng report |
| Script ghi passCount nhưng không fail process khi ca false | Nợ D04 của harness cũ; lần kiểm C dùng assertions thật và exit khác 0 khi lỗi |

## Task sửa duy nhất: T40

A được giao sửa `mock-wallets.ts` và regression cho toàn bộ đăng ký fixture, chạy tests/build bằng cache. Kiểm trang không bị trắng và không có pageerror trên cả hai viewport **không intercept sửa response**; chặn request ngoài localhost. C sở hữu harness kiểm bổ sung và chốt snapshot; A tiếp tục T38/T39. T37 đóng ở mức nhận báo cáo, Phase 5 local chỉ chốt sau patch và kiểm trực tiếp.
