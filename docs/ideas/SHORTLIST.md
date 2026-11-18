# SHORTLIST — ba ý tưởng ĐẠT PLAN

Codex · cập nhật18/11/2026 · RUBRIC v1.2. Người dùng đã chọn **“ReceiptRail chính, ClusterProof phụ” lúc00:07 ngày18/11/2026 UTC+7**, [nguyên văn/nguồn đính chính](DECISION.md). Không hỏi chọn lại. Điểm là đánh giá PLAN của Codex, chưa verdict giáo viên; người dùng đã duyệt Phase2 ReceiptRail, xem DECISION.

| Hạng điểm | Ý tưởng / vai trò | Một câu dễ hiểu | Điểm / vòng | Bằng chứng chính | Rủi ro chính |
| --- | --- | --- | --- | --- | --- |
| Đồng1 | [C01 ReceiptRail](codex/01-receipt-rail.md) — **chính** | Một hóa đơn giữ trạng thái chung để gửi lại giao dịch cũng không chuyển tiền gốc lần hai | **79/100, r2** | [19 runtime tests với bytecode thật](../evidence/phase2/receiptrail-spike-r2.txt), [hash/metrics](../evidence/phase2/receiptrail-build-metadata.json) | Chỉ cùng invoice; rent/upgrade, chưa browser/devnet/user validation; chưa stablecoin/x402 |
| Đồng1 | [C02 ClusterProof](codex/02-cluster-proof.md) — **dự phòng** | Trước khi nối app vào Solana, chỉ ra deployment lệch cấu hình và phần chưa kiểm chứng | **79/100, r1** | [Devnet read747ms,5 mutations](../evidence/phase1/cluster-1794924487174.json) | Không chứng minh ABI/source; lợi ích so CLI/script cần người dùng thử |
| 3 | [C03 NetPay Check](codex/03-netpay-check.md) — chưa chọn | Nhập số token muốn nhận để biết cần gửi bao nhiêu sau transfer fee | **77/100, r1** | [Raw mint/epoch live283ms, gross10102→fee102→net10000](../evidence/phase1/netpay-1794925658391.json) | Fee-only chưa settlement; Ryntra/SDK đã có nhiều phần tương tự |

C01/C02 hòa cả F/R/P theo luật tie-break; lựa chọn hiện hành là câu của người dùng, không suy từ thứ hạng. Đề xuất cũ của Codex “C02 chính, C03 dự phòng” đã được lựa chọn trực tiếp mới thay thế; nó chưa bao giờ thay cho câu chọn của người dùng. Hồ sơ ghi nhận sai trước đây được đính chính tại DECISION/K6.

Bản SHORTLIST cũ của Antigravity đã bị thay: thiếu nguồn kiểm được, F4 chưa có spike, phép tính sai và chưa được Codex chấm theo v1.2; [cross-scores](cross-scores-codex.md) giữ lý do từng bài.

## Cách chấm và giới hạn

| Ý tưởng / vòng | P | S | N | F | R | D | V | Tổng |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| C01 r2 | 4 | 4 | 4 | 4 | 4 | 4 | 3 | 79 |
| C02 r1 | 4 | 4 | 4 | 4 | 4 | 4 | 3 | 79 |
| C03 r1 | 4 | 4 | 3 | 4 | 4 | 4 | 3 | 77 |

C01 r0=66/r1=75 giữ trong hồ sơ; r2 **chỉ F3→4**, delta+4 từ spike D2 có log/CU/rent/thời gian và ngân sách, chưa F5. C02/C03 không đổi điểm hoặc chạy lại code trong bước này. Tất cả sàn và G1–G6 đạt ở PLAN theo Codex; conditions DELIVERY còn riêng. R/D4 là chất lượng thiết kế, không audit/video thật.

P4 dùng hai nguồn độc lập hỗ trợ workflow mỗi bài, chưa phỏng vấn/pilot; N4 C01/C02 dựa comparison có phép thử, chưa chứng minh lợi ích market. N C03 giữ3 vì overlap. Nếu giáo viên hạ P/F C01 một mức thì79→75; hạ N một mức thì79→77. P/F C03 giảm một mức thành73 và phải sửa tiếp. Không làm tròn/tăng điểm để giữ ngưỡng. Giáo viên chưa chấm lại shortlist này.

[Note021](../learning/021-payment-cluster-evidence.md)/[catalog Phase1](../evidence/phase1/README.md) giữ16 tests C02+C03 (5.940 inverse/744 brute-force cases). [Note023](../learning/023-receiptrail-phase2-spike.md)/[catalog Phase2](../evidence/phase2/README.md) ghi ReceiptRail19tests, generated IDL, log lỗi và giới hạn. Các ứng viên A giữ review42/40/37 ở [cross-scores](cross-scores-codex.md); không dùng nguồn sai do A gửi.

## Cổng còn cần

Bản [IDEA](../IDEA.md) và [ARCHITECTURE](../ARCHITECTURE.md) ReceiptRail đã được người dùng duyệt bằng câu “duyệt phase 2” (giờ log09:27:18.464 ngày18/11 UTC+7); review chéo/giáo viên chưa nhận đạt. ClusterProof giữ “dự phòng, chưa duyệt”. Toolchain/web đã có giữ nguyên; không xin cài lại, không cài thêm/deploy/public mới khi chưa có câu đồng ý nguyên văn kèm giờ. Repo MIT, không đổi visibility.

[PR#7](https://github.com/ntbaoheyhey/dev3pack-hackathon/pull/7) vẫn `work→main`, không merge. Không hỏi duyệt Phase2 lại; tiếp tục review và chuẩn bị Phase3 trong quyền hiện có. Cổng review/giáo viên và quyền vận hành không tự đóng từ lời duyệt.
