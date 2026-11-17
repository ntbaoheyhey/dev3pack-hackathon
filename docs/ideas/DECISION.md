# Quyết định sản phẩm — ReceiptRail

## Quyết định hiện hành của người dùng

**Chính: ReceiptRail (C01). Dự phòng: ClusterProof (C02).**

- Nguyên văn người dùng: **“ReceiptRail chính, ClusterProof phụ”**.
- Giờ lựa chọn do người dùng xác nhận: **00:07 ngày 18/11/2026, Asia/Ho_Chi_Minh (UTC+7)**.
- Tin trực tiếp chứa lời xác nhận được ghi nhận trong log lúc **00:08:31.389 ngày 18/11/2026 UTC+7**. Giờ ghi nhận khác giờ lựa chọn, không thay giờ người dùng đã nói.
- Đây là lựa chọn ý tưởng và yêu cầu làm Phase 2; **chưa phải duyệt IDEA/ARCHITECTURE ReceiptRail hoặc cho phép Phase 3**. Xong bản thiết kế và spike local phải trình người dùng duyệt.

Tin 00:05:05.678 ngày18/11 yêu cầu ghi “chưa có quyết định của người dùng” đã được tin xác nhận ReceiptRail mới thay thế. Không hỏi chọn lại; không giữ “chưa có quyết định” làm trạng thái hiện hành.

## Đính chính bản cũ — sai, hết hiệu lực

Các dòng cũ dưới đây **SAI** và không được dùng làm lựa chọn hoặc quyền hiện hành:

| Dòng/kết luận cũ | Trạng thái đính chính |
| --- | --- |
| “Chính: C02 ClusterProof” | **Sai**. Người dùng xác nhận chưa từng chọn ClusterProof làm chính; chính là ReceiptRail |
| “Dự phòng: C03 NetPay Check” | **Sai**. Dự phòng hiện hành là ClusterProof |
| “Đồng ý cài toolchain Solana cho Phase 3” | Kết luận chấp thuận cũ **sai/hết hiệu lực**. Giữ bộ đã cài theo câu mới, không dùng làm quyền cài thêm |
| “Cổng người dùng duyệt phạm vi IDEA đã đạt” và đã đồng ý ARCHITECTURE v0.3 mục1 | **Sai/hết hiệu lực**. ClusterProof chỉ là “dự phòng, chưa duyệt”; ReceiptRail phải trình duyệt mới |

**Assistant đã dựa vào những tin nào:** các payload `send_user_message_question_reply` xuất hiện trong chat, cụ thể:

| Giờ log UTC+7 | Nội dung nguyên văn payload | questionItemId |
| --- | --- | --- |
| 17/11/2026 21:55:56.923 | “ClusterProof chính, NetPay Check dự phòng (đề xuất)” | `call_2vT59FyQAhdLZBpUro6G1ne0`, item0 |
| 17/11/2026 21:55:56.923 | “Đồng ý cài bộ phiên bản này cho Phase 3” | `call_2vT59FyQAhdLZBpUro6G1ne0`, item1 |
| 17/11/2026 23:53:23.118 | “Duyệt IDEA và đồng ý bản giải thích kiến trúc” | `call_UUThW2KPCkU1r3njPLMbhGVE`, item0 |

Assistant đã đưa các nội dung này vào DECISION và lan sang IDEA/ARCHITECTURE, ROADMAP, README, note003/022, hồ sơ review, A-queue và HANDOFF. **Đó là lỗi ghi nhận quyết định của assistant**: người dùng đã trực tiếp đính chính, nên các kết luận cũ phải bị vô hiệu. Không khẳng định payload chứng minh người dùng thực sự chọn trong UI; chưa biết vì sao chúng xuất hiện. Không suy thêm quyền deploy/public từ các payload trên.

Nguồn đối chiếu: session local `rollout-2026-11-17T20-52-47-01a1e9c8-1b24-7911-91a4-4897fc175566.jsonl`, chỉ các record liên quan; snapshot sai giữ ở [archive HANDOFF](../archive/HANDOFF-history-codex.md). Sự cố ghi tại [STOP-CAUSES K6](../STOP-CAUSES.md).

## Phạm vi được yêu cầu hiện tại

Nguyên văn trong tin trực tiếp ghi nhận **18/11/2026 00:08:31.389 UTC+7**:

> Toolchain đã cài và web ClusterProof đã public thì giữ nguyên, nhưng cài thêm, deploy hay public thứ gì mới thì phải hỏi tôi trước.

> Giữ IDEA/ARCHITECTURE ClusterProof làm bản dự phòng, ghi “dự phòng, chưa duyệt”.

> Sau đó làm Phase 2 cho ReceiptRail theo docs/ROADMAP.md: viết docs/IDEA.md và docs/ARCHITECTURE.md mới cho ReceiptRail (account, PDA, instruction, trạng thái hóa đơn, test plan, demo 165 giây).

> Ưu tiên spike sớm một program Anchor tối thiểu chạy test cục bộ để nâng F từ 3.

> Xong Phase 2 thì trình tôi duyệt rồi mới qua Phase 3.

Thực hiện thiết kế, spike/test **cục bộ** bằng toolchain/cache có sẵn; không tự cài dependency hoặc sinh signer triển khai. Test fixtures/key material chỉ tồn tại trong bộ nhớ máy ảo, không là ví được tạo cho người dùng. Mọi cài thêm, tạo ví/keypair triển khai, deploy hoặc public mới cần câu đồng ý nguyên văn kèm giờ, đúng phạm vi. Không mainnet, không secret trong Git, không đổi visibility repo hoặc merge [PR #7](https://github.com/ntbaoheyhey/dev3pack-hackathon/pull/7).

## Trạng thái duyệt

- IDEA/ARCHITECTURE ReceiptRail: **đang soạn, chưa duyệt**.
- [IDEA ClusterProof](../IDEA-clusterproof-draft.md), [ARCHITECTURE ClusterProof](../ARCHITECTURE-clusterproof-draft.md): **dự phòng, chưa duyệt**; giữ source/web/lab hiện có.
- Review A và verdict giáo viên: chỉ ghi khi có kết quả thật; không thay duyệt người dùng.
- Payload ví lúc17/11 23:54:48.498, `call_qOWTCC3sdHrix5DfEq1upmM0`, item0: “Chưa có ví devnet sẵn sàng; giữ bước này chưa kiểm”. Đây là giới hạn kiểm ví, không phải quyền tạo/import ví. Core connect/disconnect thật vẫn chưa kiểm, không thuộc spike ReceiptRail.
