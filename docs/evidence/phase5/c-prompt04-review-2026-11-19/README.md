# C nghiệm thu Prompt 04 — 20/11/2026

Source ứng dụng: 106a18e09854d18b47a9ab61f7ab2d9a61c491a8. Thư mục mang ngày bắt đầu19/11; thời điểm chạy thật nằm trong từng manifest. C đã kiểm PID57198/cwd của server4175 đúng checkout và HTTP200 trước chạy.

- [52 tests](web-tests.log), [TypeScript/Vite](web-build.log), [build mock riêng](mock-build.log) đạt.
- [Manifest 16 ca](manifest.json): 8 ca ở1440×900 và375×812, không sửa response/source, không pageerror, không request ngoài localhost. Steps nằm trong [harness](../../../../scripts/verify-receiptrail-phase5-browser.mjs); từng ca có expected/actual, ledger và screenshot.
- [Bổ sung đổi slot](slot-confirmation.json): 2 viewport; tick Create → +20slots → tick mất hiệu lực/submit khóa → xem terms mới và duyệt lại. [Script tái chạy](verify-slot-confirmation.mjs).
- [Video diễn tập](video/receiptrail-local-dry-run.webm): recordVideo/cache, ffprobe đo **162.12 giây**, SHA256 trong manifest. Không lời thoại; không phải video nộp hoàn chỉnh hoặc ví thật/devnet.
- [Artifact riêng](../mock-artifact-2026-11-20/artifact.json): source commit/hashes, ba output files, ZIP hash và 10 ca static trên hai viewport. Build lại từ source đã commit cho đúng hashes của artifact đã kiểm trước commit.
- [Validation](validation.json) nối kết logs/hashes; [Automation](automation.json) ACTIVE15phút đúng chat. Không chạy CI mới, program suite không đổi hoặc transaction mạng.

Bằng chứng T37 lịch sử qua route fix và T40 bootstrap được giữ riêng. Review cuối tại [r4](../../../reviews/receiptrail-phase5-r4.md). Viewport mobile không là điện thoại vật lý; kiểm focus/clipboard không là audit toàn bộ accessibility. Public mock/Phase6/mergePR7 vẫn cần quyết định.
