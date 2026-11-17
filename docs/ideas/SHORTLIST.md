# SHORTLIST — Prompt 03, Phase 1/E

Codex · 17/11/2026 · RUBRIC v1.2 · **3 ý tưởng ĐẠT PLAN theo Codex; chưa được giáo viên hoặc người dùng duyệt**.

Bản shortlist cũ của Antigravity đã bị thay vì thiếu evidence/thiết kế bắt buộc, F4 chưa spike và có sai phép tính; [review-C](cross-scores-codex.md) giữ lịch sử và lý do giữ/bỏ từng ứng viên.

## Danh sách để chọn

| Hạng | Ý tưởng | Một câu dễ hiểu | Điểm / vòng | Đã kiểm thật | Rủi ro quyết định |
| --- | --- | --- | --- | --- | --- |
| 1 | [C02 ClusterProof](codex/02-cluster-proof.md) | Trước khi nối app vào Solana, chỉ ra deployment nào lệch cấu hình và phần nào vẫn chưa được kiểm chứng | **79/100, r1** | Đọc program devnet 747 ms; 5 manifest mutations nhận ra | Không chứng minh ABI/source; giá trị so CLI/script cần người dùng thử |
| 2 | [C03 NetPay Check](codex/03-netpay-check.md) | Nhập số token muốn nhận để biết cần gửi bao nhiêu sau transfer fee | **77/100, r1** | Raw mint/epoch live 283 ms, gross 10102 → fee 102 → net 10000; arithmetic/parser/replay | Chỉ fee-only, không settlement; Ryntra/SDK đã có nhiều phần tương tự |
| 3 | [C01 ReceiptRail](codex/01-receipt-rail.md) | Một invoice giữ trạng thái chung để retry không chuyển principal lần thứ hai | **75/100, r1** | Đã đọc primitive và thiết kế transitions; **chưa chạy custom program** | Rent/upgrade authority; native SOL demo, chưa x402/stablecoin; điểm sát ngưỡng |

Đề xuất **C02 chính, C03 dự phòng** vì phần khó read-only đã có evidence và ít dependency triển khai. C01 đáng chọn nếu người dùng muốn học/build program thanh toán và chấp nhận thời gian test lớn hơn. Đây là ưu tiên theo khả thi và khả năng giải thích; không dự đoán giải hackathon. Read-only product vẫn dùng state Solana ở core, không cần program riêng; Phase 3 hello Anchor vẫn là bài học theo ROADMAP nếu được cho phép.

## Cách chấm và giới hạn

| Ý tưởng | P | S | N | F | R | D | V | Tổng |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| C02 | 4 | 4 | 4 | 4 | 4 | 4 | 3 | 79 |
| C03 | 4 | 4 | 3 | 4 | 4 | 4 | 3 | 77 |
| C01 | 4 | 4 | 4 | 3 | 4 | 4 | 3 | 75 |

Mỗi bài có 8 mục: nguồn/workflow, alternatives, trust, accounts/instructions hoặc lý do không cần, dependencies D0–D3, transitions/test plan, scope/critical path/kill, storyboard165s/distribution và điểm/gates. Tất cả sàn đạt và G1–G6 pass ở mức PLAN có điều kiện giao hàng nêu rõ. Không dùng điểm U. R/D4 là thiết kế, không audit/video đã chạy; F C01 giữ3. N C03 giữ3 do overlap chưa làm rõ.

P4 dựa hai nguồn trực tiếp độc lập cho workflow trong mỗi bài, không interview và không tỷ lệ lỗi hiện tại; nguồn lịch sử đã ghi tuổi. N4 C01/C02 là comparison có flow/experiment kiểm được, chưa chứng minh lợi ích thực tế. Nếu giáo viên giảm N C01 xuống3 thì tổng 73 và phải sửa tiếp, không tự giữ nhãn đạt. Nếu P/F C03 giảm một mức thì tổng 73. Lịch sử r0 và r1 giữ nguyên, còn r2–r3 để xử lý findings.

## Bằng chứng kiểm tra

- [Note021](../learning/021-payment-cluster-evidence.md) và [catalog](../evidence/phase1/README.md) phân biệt source, fixture, live read và sản phẩm.
- [Suite đã chạy](../evidence/phase1/spikes-tests-r1-final.txt): **16 test pass, 0 fail** (tổng C02+C03), 5.940 inverse cases và 744 brute-force cases. Lượt viết shortlist chỉ đối chiếu log/hash, không chạy lại vì code không đổi.
- [C02 artifact](../evidence/phase1/cluster-1794924487174.json): observed baseline, ABI UNKNOWN/source NOT_RUN.
- [C03 artifact](../evidence/phase1/netpay-1794925658391.json): raw bytes/epoch/slot và writesToChain=0; không transfer.
- Đã tính lại bảng r0/r1 bằng công thức RUBRIC, kiểm sàn và đường dẫn local. Kiểm toán logic/market không được thay bằng script kiểm tổng.
- GitHub metadata ngày 17/11/2026 xác nhận repo hiện **private**, có LICENSE MIT. G2 PLAN pass nhờ yêu cầu/kế hoạch public trước nộp; chưa public thì chưa gate delivery, không đổi visibility trong bước chọn ý tưởng.

## Quyết định còn cần

1. Người dùng chọn **một ý tưởng chính và một dự phòng**; ghi DECISION sau câu trả lời, không tự chọn thay.
2. Người dùng cho biết **có đồng ý cài bộ toolchain Solana cho Phase 3** theo [note003](../learning/003-solana-toolchain.md) hay không: Rust 1.100.0, Agave 4.1.2, AVM/Anchor 1.2.2, platform-tools v1.57 và dependencies cần cho build; Node/pnpm hiện có giữ nguyên. Bộ này là đề xuất đã đọc nguồn, chưa build xác nhận.

Đã mở [PR #7](https://github.com/ntbaoheyhey/dev3pack-hackathon/pull/7), `work → main`, **chưa merge**, giáo viên chưa review. Hai câu chọn chính/dự phòng và quyền cài đã gửi trong chat; chưa có câu trả lời tại checkpoint này. Việc lựa chọn không tự thay cổng người dùng duyệt IDEA và ARCHITECTURE. C tiếp tục chuẩn bị account/PDA/test/CI/kế hoạch cài trên giấy trong lúc chờ; không cài, tạo ví/keypair hoặc deploy trước quyền tương ứng.
