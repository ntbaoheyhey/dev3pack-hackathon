# prompts/

Các prompt lớn giao cho agent. Đánh số theo đợt; mỗi đợt có 1 prompt cho Codex và 1 cho Antigravity.

| Đợt | Codex | Antigravity | Mục tiêu |
|---|---|---|---|
| 01 | [01-codex-learning.md](01-codex-learning.md) | [01-antigravity-learning.md](01-antigravity-learning.md) | Học nền tảng, chưa có ý tưởng, chưa code |
| 02 | [02-codex-phase1.md](02-codex-phase1.md) | [02-antigravity-phase1.md](02-antigravity-phase1.md) | Phase 1 trọn gói: học cách chấm → bộ chấm chung → học nguồn ý tưởng → vòng lặp ý tưởng tới ngưỡng |

Chạy song song được: hai prompt chia chủ đề không trùng nhau (chỉ chung note 009, mỗi bên viết phần của mình).

Từ đợt 02, mỗi đợt ứng với một phase trong [`docs/ROADMAP.md`](../docs/ROADMAP.md). Mỗi phase một prompt lớn cho mỗi agent; hai agent phối hợp qua file trên nhánh chung của phase.
