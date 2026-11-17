# Bộ chấm ý tưởng — RUBRIC v1.1

**Chốt quy tắc v1.1 ngày 17/11/2026 — chủ file: Codex.** Áp dụng chỉ thị người dùng và Prompt 02 đã cập nhật: Codex quyết định, review của Antigravity được xử lý bất đồng bộ. Không cần Antigravity duyệt để sang chặng C/D. Đây là rubric nội bộ, không phải trọng số chính thức của BTC.

Nguồn: [015](../learning/015-hackathon-judging.md), [016](../learning/016-technical-feasibility-risk.md), các tiêu chí hữu ích trong [017](../learning/017-khung-tham-dinh-y-tuong.md), [018](../learning/018-blockchain-solana-check.md). Giữ problem/feasibility/novelty/demo và phép thử trust; không dùng claim thiên kiến giám khảo thiếu nguồn hoặc thưởng tên Token-2022/PDA/Blinks. Findings còn mở tại [review A](../reviews/A-codex.md) là góp ý chất lượng, không chặn chủ file quyết định.

Đã chạy hiệu chỉnh 3 bài thắng + 2 honorable mentions ở mục 8. Dữ liệu công khai chưa đủ phân biệt hai nhóm; v1.1 bổ sung quy tắc bằng chứng bên dưới. Đây không phải mô hình dự đoán giải đã được xác thực.

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
| P | Vấn đề/người dùng và bằng chứng | 20 | 3 | 015 Colosseum/Dev3pack; giữ câu hỏi vấn đề từ 017, không kế thừa claim GV/YC thiếu nguồn |
| S | Solana tạo giá trị cần thiết | 15 | 3 | 015 composability/UX; 018 ownership/decentralization, bổ sung trust boundary từ 007/016 |
| N | Khác biệt so với lựa chọn hiện có | 10 | 2 | 015 ETHGlobal/ETHShanghai; 017 novelty |
| F | Khả thi trong phạm vi và dependency | 20 | 3 | 016 critical path, D0–D3 và thang thực thi |
| R | Rủi ro/an toàn và khả năng kiểm chứng | 15 | 3 | 016, 007; 015 code/repo/deployment |
| D | Demo/UX và khả năng giải thích | 15 | 3 | 015 Dev3pack/ETHGlobal/MLH; 017 demo |
| V | Phân phối và giá trị tiếp tục | 5 | 2 | 015 business/public-good adoption; 017 ecosystem value |
| | **Tổng** | **100** | | |

Điểm nguyên 0–5, không dùng 4,7 để tạo độ chính xác giả. `U` = thiếu thông tin, ghi khoảng điểm và phần cần kiểm, không điền 0 như lỗi đã chứng minh. Ý tưởng chưa có điểm chắc cho tiêu chí sàn thì chưa ĐẠT.

`T = (20P + 15S + 10N + 20F + 15R + 15D + 5V) / 5`.

Ngưỡng áp dụng: **T ≥75/100 và tất cả sàn đạt**, không gate fail/pending trọng yếu. Chưa chạy spike F tối đa 3, nên một kế hoạch nghiêm túc vẫn có thể vượt ngưỡng bằng bằng chứng vấn đề và thiết kế; không ép đội khai đã test để đạt 80–90. Mọi đề xuất tăng ngưỡng phải kiểm tra rằng PLAN chưa build vẫn có thể đạt mà không giả bằng chứng.

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
- Review bất đồng bộ, không chặn tiến độ. Chủ file xử lý ở v2/v3; bất đồng lớn ghi hai lập luận vào “Để người dùng quyết”, tạm dùng phương án chặt hơn. Không tự ghi A đã đồng ý.

## 6. Phương pháp hiệu chỉnh

Chọn trước ba bài thắng và hai bài được xác nhận ngoài nhóm giải/top của **cùng một sự kiện Solana** nếu có dữ liệu. Định nghĩa top rõ (ví dụ nhóm nhận giải chính; honorable mention không tự đồng nghĩa dự án tệ). Dùng tài liệu ở lúc thi, đánh U khi thiếu code/demo; không lấy thành tích startup sau thi làm điểm.

Ghi từng tiêu chí, nguồn nhãn, nguồn sản phẩm, mode DELIVERY và khoảng điểm thiếu bằng chứng. Nếu thang không phân biệt bằng chứng rõ với pitch rỗng, sửa mô tả tiêu chí rồi chấm lại toàn bộ. Nếu hai nhóm vẫn chồng lấp vì dữ liệu/small sample hoặc rubric chọn khả thi cho đội khác rubric giải thưởng, phải báo giới hạn, **không bẻ điểm để khớp nhãn thắng**. Cần thêm thử độ nhạy tăng/giảm 5 điểm trọng số giữa P/F/D, giữ tổng 100, và hai case đối chứng trên giấy (blockchain trang trí, dependency chặn demo).

Hiệu chỉnh phải ghi cả dữ liệu thiếu và giới hạn; không dùng giải thưởng làm bằng chứng thay cho source/demo. Chỉ “ĐẠT” cuối sau cả self-score và cross-score; thiếu cross-score giữ nhãn “chờ chấm chéo”.

## 7. Lịch sử và để người dùng quyết

| Phiên bản | Thay đổi | Chủ quyết định |
| --- | --- | --- |
| v1.0 — 17/11/2026 | Chốt thang 0–5, weights, gates, floors, threshold 75, r0–r3 từ draft v0.1; review bất đồng bộ | Codex theo chỉ thị người dùng |
| v1.1 — 17/11/2026 | Sau hiệu chỉnh: tách trần điểm chứng minh được khỏi khoảng U; khóa mốc artifact; không lấy website hậu cuộc thi hoặc claim traction làm evidence đã kiểm | Codex; không đổi weights/ngưỡng để khớp người thắng |

Chưa có bất đồng rubric lớn được gửi; không tạo quyết định giả cần người dùng. ROADMAP dòng B còn ghi hai bên đồng ý là mô tả cũ; dùng Prompt 02 và AGENTS mới cho quyền quyết định. Các cổng người dùng/giáo viên ở Phase 1–2 vẫn giữ nguyên.


## 8. Hiệu chỉnh thực tế — Frontier 2026, đọc 17/11/2026

### 8.1. Nhãn và nguồn sản phẩm

“Top” ở đây = Grand Champion hoặc danh sách 25 winners; không gồm honorable mentions. [Kết quả chính thức](https://blog.colosseum.com/announcing-the-winners-of-the-solana-frontier-hackathon/) xác nhận ba bài CrowdBrain, Flovia, Sudont thuộc nhóm giải và Portara, Surgepay thuộc honorable mentions. Honorable mention **không có nghĩa sản phẩm tệ**. Chọn mẫu theo độ đa dạng workflow và khả năng truy xuất nguồn, không chọn theo điểm mong muốn; năm mẫu quá ít để suy xác suất thắng.

| ID / nhãn | Artifact đọc và claim có thể dùng | Giới hạn |
| --- | --- | --- |
| W1 CrowdBrain — Grand Champion | [Profile](https://colosseum.com/arena/projects/crowdbrain) mô tả huấn luyện operator, QA và điều phối robot; [website tác giả](https://crowdbrain.ai/) cho workflow cụ thể | Website hiện tại có thể đã phát triển sau thi; không đưa số đo/site hiện tại vào điểm lúc thi. Link repo `CrowdBrain/application` lấy trực tiếp từ HTML profile, đọc README trả 404; chưa xem hết video |
| W2 Flovia — Winner | [Profile](https://colosseum.com/arena/projects/flovia); [README tại 910afcc](https://github.com/flovia/poc/blob/910afccbd1a85e7a055b08af39f44046d6cb2ede/README.md), commit 11/05/2026: discovery/source/intelligence/BFF/frontend, mặc định fixtures và offline verification | Đây là commit trong ngày cuối hackathon, chưa chứng minh đúng commit đã nộp. Đọc lệnh test không phải đã chạy. Fixture-backed không bị gọi là gian lận vì tác giả khai rõ |
| W3 Sudont — Winner | [Profile](https://colosseum.com/arena/projects/sudont) và mô tả BTC: execution firewall/local RPC cho Solana; HTML profile trỏ `sudont-labs/sudont-core` | README trả 404; website lỗi TLS với client đang dùng. Không kết luận repo bị xóa hay program có bug |
| H1 Portara — Honorable Mention | [Profile](https://colosseum.com/arena/projects/portara): agent thực thi chiến lược dài hạn với risk layer; HTML trỏ `Boole-Digital/PortaraTrade` | README trả 404. Website hiện tại [portara.xyz](https://portara.xyz/) chuyển nội dung sang Boole; không dùng tính năng mới để chấm lại bài tháng 5 |
| H2 Surgepay — Honorable Mention | [Profile](https://colosseum.com/arena/projects/surgepay:-whatsapp-first-remittance.-us-india.-in-seconds.-no-fees.-google-rates): remittance US–India qua WhatsApp/USDC/LP; [website](https://www.surgepay.money/) | Traction là tác giả tự báo, chưa kiểm. Repo profile trỏ `Surge-pay/surgepay-backend`, README 404; không nhầm với dự án SurgePay trên Base/Stellar |

Các link website/repo được lấy từ HTML công khai của profile bằng HTTP read-only khi web extractor chỉ hiện nhãn “Repository”. Không đăng nhập, không gửi form, không chạy source của dự án. Lỗi 404 có thể là access/path, không chứng minh abandoned. Tool web có lỗi redirect/409; đó là giới hạn công cụ, không phải bằng chứng mọi site bị chặn.

### 8.2. Chấm DELIVERY với evidence còn thiếu

Bảng dùng **khoảng khả dĩ U[a,b]**, không dùng midpoint làm điểm thật. Các cận hẹp phản ánh phần đã đọc (user/flow rõ), không xác nhận tác giả đã đạt mức cao. `U[0,5]` là thiếu artifact, **không phải 0 điểm**. Không có bài nào được gắn fail chất lượng chỉ vì hồ sơ công khai thiếu dữ liệu. Phép thử này kiểm khả năng ra quyết định từ evidence, không tái hiện bí mật đánh giá của BTC.

| Bài | P | S | N | F | R | D | V | Tổng khả dĩ /100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| W1 CrowdBrain | U[2,4] | U[0,5] | U[0,5] | U[0,5] | U[0,5] | U[0,5] | U[1,4] | 9–95 |
| W2 Flovia | U[2,4] | U[2,4] | U[0,5] | U[2,4] | U[0,5] | U[2,4] | U[1,4] | 29–85 |
| W3 Sudont | U[1,4] | U[2,5] | U[0,5] | U[0,5] | U[0,5] | U[0,5] | U[0,5] | 10–96 |
| H1 Portara | U[2,4] | U[0,5] | U[0,5] | U[0,5] | U[0,5] | U[0,5] | U[1,4] | 9–95 |
| H2 Surgepay | U[2,4] | U[2,4] | U[0,5] | U[0,5] | U[0,5] | U[0,5] | U[2,4] | 16–92 |

Lý do từng chiều: P bị giới hạn bởi chủ yếu mô tả của đội, chưa có dữ liệu khách hàng độc lập; N chưa có comparison cùng thời điểm; F/R thiếu log kiểm thử và artifact security; D chưa kiểm video end-to-end. S của Flovia có kiến trúc onchain signals nhưng README khai fixtures, Sudont có job Solana đặc thù, Surgepay mô tả settlement; chưa được suy thành tx thực. V của Surgepay có workflow referral/receiver tự báo, không tự nâng 5 vì con số traction.

**Kết quả vòng đầu: không phân biệt đáng tin hai nhóm.** Khoảng chồng lấp quá rộng; đổi trọng số sẽ không tạo ra bằng chứng còn thiếu. Không tuyên bố đã đạt “predictive validation”.

### 8.3. Sửa sau hiệu chỉnh và áp dụng lại

V1.1 bổ sung bốn quy tắc bắt buộc:

1. **Khóa artifact/mốc:** ghi idea version, rubric version, commit/ngày nguồn. Nguồn sau thời điểm thi chỉ là context, không chấm retro thành tích mới.
2. **Tách evidence khỏi lời kể:** traction, test pass, latency và audit chỉ được dùng mức cao khi có artifact tương ứng; lời quảng cáo không phải independent evidence. Đối với PLAN, R/D=4 vẫn chỉ là chất lượng thiết kế.
3. **Khoảng chưa quyết định được:** khi thiếu evidence ảnh hưởng floor hoặc ngưỡng 75, ghi `CHƯA ĐỦ BẰNG CHỨNG`, không xếp giữa khoảng, không gọi fail thật. Khi chấm ý tưởng của đội phải bổ sung evidence hoặc thu nhỏ; không dùng unknown để tự đạt.
4. **DELIVERY khác PLAN:** F=3 trong PLAN chỉ là D1; DELIVERY muốn xác nhận đường chính phải có source/commit và kết quả chạy tương ứng. D=4 trong DELIVERY đòi video/flow thật và recovery; R=4 đòi kiểm source/transitions cùng snapshot. Không chuyển điểm thiết kế thành điểm giao hàng.

Áp dụng lại năm bài: **5/5 chưa đủ evidence để quyết định theo rubric nội bộ**, không có thứ hạng giả và không gán nguyên nhân họ thắng/thua. B vẫn chốt quy tắc và sang C/D theo chỉ thị người dùng; phần kiểm định dự đoán giải còn giới hạn được công khai. Không tiếp tục săn source vô hạn chỉ để ép khớp nhãn.

### 8.4. Độ nhạy và đối chứng

Đã tính lại các khoảng bằng Python offline: chuyển 5 điểm trọng số P→F, F→D và D→P (tổng luôn 100) vẫn có giao giữa tất cả khoảng; không thể kết luận người thắng chỉ nhờ đổi weights. Đây là phép tính tài liệu, không phải spike Solana.

Hai đối chứng tự soạn: (a) todo app một admin với NFT trang trí, `S=1/G1 fail`, bị loại dù UI đẹp; (b) demo bắt buộc CPI vào dependency chưa có deployment/IDL phù hợp và không có fallback, `F=1/G4 fail`, bị loại dù thị trường hấp dẫn. Các đối chứng kiểm gates có hoạt động, **không được thay thế hai bài thật không top**.

## 9. Tiếp nhận draft Antigravity — snapshot 57b0af3

Đã đọc `rubric-draft-antigravity.md` ngày 17/11/2026. Trọng số, ngưỡng 75 và tối đa ba lần sửa khớp v1; tiếp nhận đây là phần đồng quy, không giả đã có review toàn bộ rubric.

Không nhận ba cách diễn đạt: (1) private repo nghiên cứu bị loại ngay — G2 yêu cầu kế hoạch public trước nộp; (2) 48h là thời lượng chính thức — chỉ được dùng như ngân sách giả định, ngày thi là 27–29/11; (3) PLAN mức 3 phải demo chạy và Solana=checklist primitive — giữ bảng PLAN/evidence và trust boundary của v1.1. Draft A chưa mô tả mức 0/2/4 theo từng tiêu chí; dùng thang đầy đủ hiện hành.

Không thay weights, floors hoặc định nghĩa sau khi có ý tưởng; việc đối chiếu này diễn ra trước chặng D. Chưa có bất đồng lớn cần người dùng xử lý.
