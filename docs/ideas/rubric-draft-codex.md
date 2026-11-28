# Bộ chấm ý tưởng — nháp Codex v0.1

**17/11/2026. Chưa phải RUBRIC được hai bên duyệt.** Dựa trên [015](../learning/015-hackathon-judging.md), [016](../learning/016-technical-feasibility-risk.md) và các ứng viên có thể giữ từ [017](../learning/017-khung-tham-dinh-y-tuong.md), [018](../learning/018-blockchain-solana-check.md). Findings A01–A06 trong [review A](../reviews/A-codex.md) đang chờ A sửa; không coi claim thiếu nguồn là sự thật.

Mục đích là **chọn việc phù hợp với đội và thời gian**, không dự đoán chắc giải. Trọng số, sàn, số vòng sửa dưới đây là đề xuất nội bộ. Phase 1 đánh giá **PLAN**; bài đã build đánh giá **DELIVERY**. Cùng tên tiêu chí nhưng không so trực tiếp điểm của hai chế độ.

## 1. Eligibility và điều kiện loại thẳng

| Gate | Loại khi | Phân biệt kế hoạch với giao hàng |
| --- | --- | --- |
| G1 — Solana | Luồng cốt lõi không dùng Solana hoặc chain chỉ trang trí, không nêu được thuộc tính có ích | PLAN: nêu primitive và trust assumptions; DELIVERY: tx/state đúng cluster |
| G2 — Open source/provenance | Không có quyền dùng tài liệu/code hoặc từ chối open source; nộp fork người khác như sản phẩm mình | Repo hiện private không loại ý tưởng nếu có kế hoạch license/public trước nộp; chưa xác nhận repo đã public |
| G3 — Demo trung thực | Luồng chỉ có slide/mock nhưng được trình bày như chạy thật; không có cách thu hẹp demo dưới 3 phút | PLAN: kịch bản ≤165s; DELIVERY: kiểm video thực và link |
| G4 — Phụ thuộc chặn đường | Dependency bắt buộc không có devnet/không truy cập được/không tương thích và không có fallback giữ giá trị | Không dùng mainnet có tiền thật để né blocker; quyền cài toolchain chờ người dùng ở chặng E |
| G5 — An toàn tối thiểu | Thiết kế giữ secret trên client, rút tài sản trái quyền, tin oracle/agent tùy ý hoặc rủi ro nghiêm trọng không có giảm thiểu | Chưa test khác đã chứng minh lỗi. Kế hoạch test không xóa lỗi logic đã nhìn thấy |
| G6 — Có thể nộp hợp lệ | Vi phạm điều kiện chính thức được xác nhận, giả bằng chứng, không phân biệt trước/trong sự kiện | Giờ UTC/partner track chưa công bố là mục cần kiểm, không tự điền và cũng không loại mọi ý tưởng |

`pass`, `fail`, `pending` phải kèm lý do. `fail` → bỏ hoặc sửa trước khi tính ĐẠT; `pending` trọng yếu chưa có đường xử lý → chờ, không ĐẠT. Không cộng eligibility vào tổng để che lỗi.

## 2. Điểm và trọng số

| Mã | Tiêu chí | Trọng số | Sàn | Nguồn gốc |
| --- | --- | ---: | ---: | --- |
| P | Vấn đề/người dùng và bằng chứng | 20 | 3 | 015 Colosseum/Dev3pack; 017 problem–solution fit, chờ nguồn cụ thể |
| S | Solana tạo giá trị cần thiết | 15 | 3 | 015 composability/UX; 018 phép thử trust đã được yêu cầu sửa |
| N | Khác biệt so với lựa chọn hiện có | 10 | 2 | 015 ETHGlobal/ETHShanghai; 017 novelty |
| F | Khả thi trong phạm vi và dependency | 20 | 3 | 016 critical path, D0–D3 và thang thực thi |
| R | Rủi ro/an toàn và khả năng kiểm chứng | 15 | 3 | 016, 007; 015 code/repo/deployment |
| D | Demo/UX và khả năng giải thích | 15 | 3 | 015 Dev3pack/ETHGlobal/MLH; 017 demo |
| V | Phân phối và giá trị tiếp tục | 5 | 2 | 015 business/public-good adoption; 017 ecosystem value |
| | **Tổng** | **100** | | |

Điểm nguyên 0–5, không dùng 4,7 để tạo độ chính xác giả. `U` = thiếu thông tin, ghi khoảng điểm và phần cần kiểm, không điền 0 như lỗi đã chứng minh. Ý tưởng chưa có điểm chắc cho tiêu chí sàn thì chưa ĐẠT.

`T = (20P + 15S + 10N + 20F + 15R + 15D + 5V) / 5`.

Ngưỡng đề xuất: **T ≥75/100 và tất cả sàn đạt**, không gate fail/pending trọng yếu. Chưa chạy spike F tối đa 3, nên một kế hoạch nghiêm túc vẫn có thể vượt ngưỡng bằng bằng chứng vấn đề và thiết kế; không ép đội khai đã test để đạt 80–90. Nếu A muốn ngưỡng cao hơn, cần xem có vô tình chỉ cho bài đã build đạt Phase 1 hay không.

## 3. Mô tả từng mức (PLAN)

| Mã | 0 | 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- | --- |
| P | Không có user/job | Nói user chung chung | User rõ nhưng nguồn chỉ trend/marketing | Có workflow và một nguồn trực tiếp về vấn đề, giả định ghi rõ | Ít nhất hai nguồn độc lập hỗ trợ workflow/vấn đề; biết giải pháp hiện tại và phép kiểm lợi ích | Phản hồi/quan sát trực tiếp từ nhóm user mục tiêu xác nhận mức độ đau và thử nghiệm giải pháp; không chỉ TAM |
| S | Không dùng Solana | Gắn tx/NFT cho có | Nêu rẻ/nhanh nhưng DB tin cậy làm tương đương | Có nhu cầu settlement/quyền/state chung/composability và primitive phù hợp | So DB/giải pháp chain hiện tại, chỉ ra trust boundary và lợi ích người dùng; on/off-chain hợp lý | Ngoài mức 4 có bằng chứng user/tích hợp xác nhận thuộc tính này cần thiết |
| N | Sao chép không đóng góp | Đổi tên/giao diện | Có biến thể nhưng chưa so đối thủ | So ít nhất hai giải pháp gần nhất và một hạn chế cụ thể | So ít nhất ba lựa chọn, khác biệt gắn job/flow có thể kiểm, không claim “đầu tiên” thiếu căn cứ | Khác biệt đã được user/experiment xác nhận có tác dụng so baseline |
| F | Bất khả thi đã biết | Chưa chia scope/dependencies | Có flow nhưng dependency quan trọng U | Scope/accounts/instructions/critical path rõ, dependencies D1, fallback giữ giá trị; chưa chạy | Spike phần khó D2 có log, thời gian và ngân sách còn dư | Đường chính D3 cả failure/recovery, đo được chi phí/CU và chạy lại được |
| R | Lỗi quyền/secret nghiêm trọng chưa giảm thiểu | Chưa nhận diện tài sản/quyền | Nêu rủi ro nhưng không có xử lý cụ thể | Threat model nhỏ + invariants + negative-test plan và limitation rõ | Mức 3 cộng rà các transition, replay, lifecycle, dữ liệu ngoài, kiểm chứng độc lập và fallback; nguồn primitive đã đối chiếu | Tests/spike chứng minh invariant quan trọng; reviewer độc lập đã kiểm và không còn finding nghiêm trọng |
| D | Không có flow | Chỉ pitch | Mock nhiều bước hoặc không thấy giá trị | Storyboard ≤165s, có user action và kết quả/luồng lỗi, phân biệt mock/thật | Nhịp demo rõ, wow là kết quả hữu ích kiểm chứng được, thao tác ít và có recovery; script đủ để xây | Prototype/luồng đã thử với người xem, có thời lượng/feedback; không chỉ tự viết script |
| V | Không có đường dùng | Nói “viral” | Có nhóm/kênh cụ thể, mô hình tiếp tục là giả thuyết | Có phương án tiếp cận 5 user đầu tiên và metric kiểm tiếp; không giả đã liên hệ | Có tín hiệu adoption trực tiếp hoặc kênh hợp tác cụ thể; chi phí duy trì được giải thích | Có pilot/commitment hoặc usage kiểm chứng và phương án vận hành phù hợp |

Mức 4 R/D là **chất lượng thiết kế**, không chứng nhận program an toàn/demo đã chạy. DELIVERY đòi artifact ở P/S/N/F/R/D/V tương ứng; thiếu artifact đánh U, không giữ nguyên điểm kế hoạch.

## 4. Bằng chứng bắt buộc mỗi ý tưởng

Nguồn + ngày + claim được hỗ trợ; user/job/workflow hiện tại; so đối thủ; vì sao Solana; account/PDA/instruction phác thảo; off-chain/SDK + dependency register; track chính Solana (partner chỉ nếu đã công bố); demo 165s; risk/negative tests; scope nhỏ; critical path và kill criteria; bảng điểm theo vòng.

Mỗi ô điểm dẫn tới đoạn/bằng chứng, ví dụ `F=3: có D1 cho token/system, chưa smoke nên không 4`. Không dùng cùng một blog sao chép thành hai nguồn độc lập. Public RFP chứng minh tổ chức muốn một hướng, không chứng minh khách hàng sẽ dùng sản phẩm cụ thể.

## 5. Vòng sửa và chấm chéo

- Ban đầu `r0`, tối đa **3 vòng sửa r1–r3**; tổng tối đa 4 lần tự chấm. Thay user/job/cơ chế cốt lõi tạo idea ID mới, lưu bài cũ với lý do bỏ; không reset chỉ để lách giới hạn.
- Mỗi vòng chọn tiêu chí yếu nhất, ghi nghiên cứu/thay đổi và delta điểm. Quá r3 chưa đạt thì bỏ.
- Hai bên chấm độc lập cùng version RUBRIC và idea snapshot. Chỉ ĐẠT khi **cả tự chấm lẫn chấm chéo** qua tổng, sàn, gates; không lấy trung bình cứu điểm trượt.
- Sau sửa phần vật chất phải chấm chéo version mới. Đổi rubric phải chấm lại mọi bài đang shortlist.
- Xếp shortlist theo `min(tự chấm, chấm chéo)`, rồi F/R/P khi hòa; khác biệt >=2 ở tiêu chí hoặc >=10 tổng phải giải thích trước khi chốt.
- Bất đồng rubric sau tối đa 2 vòng: ghi hai lập luận và tạm dùng phương án chặt hơn; không tự ghi A “đồng ý”.

## 6. Kế hoạch hiệu chỉnh

Chọn trước ba bài thắng và hai bài được xác nhận ngoài nhóm giải/top của **cùng một sự kiện Solana** nếu có dữ liệu. Định nghĩa top rõ (ví dụ nhóm nhận giải chính; honorable mention không tự đồng nghĩa dự án tệ). Dùng tài liệu ở lúc thi, đánh U khi thiếu code/demo; không lấy thành tích startup sau thi làm điểm.

Ghi từng tiêu chí, nguồn nhãn, nguồn sản phẩm, mode DELIVERY và khoảng điểm thiếu bằng chứng. Nếu thang không phân biệt bằng chứng rõ với pitch rỗng, sửa mô tả tiêu chí rồi chấm lại toàn bộ. Nếu hai nhóm vẫn chồng lấp vì dữ liệu/small sample hoặc rubric chọn khả thi cho đội khác rubric giải thưởng, phải báo giới hạn, **không bẻ điểm để khớp nhãn thắng**. Cần thêm thử độ nhạy tăng/giảm 5 điểm trọng số giữa P/F/D, giữ tổng 100, và hai case đối chứng trên giấy (blockchain trang trí, dependency chặn demo).

Chưa hiệu chỉnh và chưa có draft/review A: **không dùng nháp này để gắn nhãn ĐẠT cuối cho ý tưởng.**
