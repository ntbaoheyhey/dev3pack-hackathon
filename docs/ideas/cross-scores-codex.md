# Codex chấm lại ứng viên Antigravity — 17/11/2026

RUBRIC **v1.2, PLAN**; snapshot bài A ở `3a6359b` (không sửa file của A). Đây là đánh giá mức bằng chứng của bản đề xuất, không phải kết luận các thị trường không có nhu cầu. Nhãn ĐẠT cũ bị rút: từng bài thiếu nguồn trực tiếp, đặc tả account/instruction, dependency và kiểm chứng F4. Không dùng dữ liệu T3/T6 sai URL để vá điểm.

## 1. Kiểm phép tính lịch sử

| Bài | Vòng | Vector P/S/N/F/R/D/V của A | A ghi | Tính đúng theo weights |
| --- | --- | --- | ---: | ---: |
| A01 Remittance | r0 | 3/3/3/3/2/4/3 | 60 | 60 |
| A01 | r1 | 4/4/3/4/3/4/3 | 74 | 74 |
| A01 | r2 | 4/4/4/4/4/4/3 | 76 | **79** |
| A02 Yield | r0 | 3/3/3/2/2/3/3 | 58 | **53** |
| A02 | r1 | 4/4/3/3/3/3/3 | 70 | **67** |
| A02 | r2 | 4/4/4/4/3/4/3 | 76 | 76 |
| A03 RWA | r0 | 3/3/3/2/2/3/3 | 58 | **53** |
| A03 | r1 | 4/3/4/3/3/4/3 | 70 | **69** |
| A03 | r2 | 4/4/4/4/3/4/3 | 76 | 76 |

Phép tính đúng không xác nhận điểm đầu vào. A01=79 vẫn chưa đạt vì thiếu evidence; không sửa 76→79 rồi coi xong.

## 2. Chấm từ phần thực sự có trong ba bản

| Tiêu chí | A01 — Remittance | A02 — Yield | A03 — RWA |
| --- | --- | --- | --- |
| P | **2** — nêu người nhận VN, nhưng “dữ liệu kiều hối/Reddit” không có URL/ngày/nội dung kiểm được | **2** — nhóm user DeFi rõ, chưa có nguồn trực tiếp cho workflow mất thời gian | **2** — nghệ nhân/nhà đầu tư rõ, claim thiếu vốn chưa có nguồn |
| S | **3** — USDC settlement là job on-chain phù hợp; chưa so ngân hàng/rail khác và trust boundary để lên 4 | **3** — thực thi trên pool Solana cần chain; chưa có account/CPI/quyền agent và so custodial manager | **2** — token không tự bảo đảm quyền với tài sản thật; thiếu cầu nối quyền sở hữu và so DB do người giữ tài sản quản lý |
| N | **2** — biến thể VN + link, không so remittance/Solana Pay/checkout | **1** — chưa chỉ ra đóng góp so vault/automation có sẵn | **1** — chưa chỉ ra khác biệt ngoài fractional NFT |
| F | **2** — có flow; embedded wallet/off-ramp/dependency chưa chứng minh, chưa có accounts/instructions | **2** — flow có, nhưng devnet/IDL/liquidity/quyền agent chưa kiểm; Jupiter warning ở note 016/021 là phản ví dụ cho giả định SDK tồn tại là đủ | **2** — flow có; custody, redemption, registry và token rule chưa xác định |
| R | **2** — chỉ liệt kê pháp lý/nhầm link, chưa có signer/claim/expiry/recovery policy | **2** — chỉ liệt kê smart-contract/AI sai, thiếu limits, allowlist, revoke và invariant rút | **2** — chỉ liệt kê pháp lý/tài sản hỏng, thiếu nguồn quyền và quy trình tranh chấp |
| D | **2** — có flow nhưng “5 giây” chưa đo, storyboard 165s và lỗi chưa phân bổ | **2** — “APY tăng” chưa có phép đo/baseline, storyboard và failure path thiếu | **2** — “sở hữu từ $1” chưa phân biệt token receipt với legal ownership, storyboard thiếu |
| V | **1** — có nhóm người dùng, chưa có kênh cụ thể/kế hoạch 5 người đầu | **1** — nhóm DeFi chung, chưa có đường tiếp cận và metric | **1** — nhóm nghệ nhân chung, chưa có đối tác/kênh và metric |
| **Tổng có bằng chứng trong bản** | **42/100** | **40/100** | **37/100** |
| **Kết luận** | **CHƯA ĐẠT** — P/F/R/D/V dưới sàn | **CHƯA ĐẠT** — P/N/F/R/D/V dưới sàn | **CHƯA ĐẠT** — P/S/N/F/R/D/V dưới sàn |

Nguồn để chấm các dòng là chính phần “Nguồn”, “Luồng”, “Off-chain/SDK”, “Video”, “Rủi ro” và “Phiên bản thu nhỏ” trong ba file [antigravity](antigravity/). Không gọi thiếu nguồn là bằng chứng ý tưởng sai. Đây là vòng **review-C**, không reset lịch sử r0–r2; nếu giữ cùng idea ID chỉ còn r3 theo RUBRIC.

## 3. Gates và quyết định

G2/G6 có đường đáp ứng chung (code của đội, license/public và ghi trước/trong sự kiện); chưa xác nhận delivery. G3 chỉ pass khi lời hứa 5s/APY/$1 được đổi thành mục tiêu đo và storyboard trung thực. Không suy track partner từ tên bài.

| Bài | Gates còn thiếu trọng yếu | Quyết định và lý do |
| --- | --- | --- |
| A01 | G4 pending: embedded wallet/off-ramp, recovery và đường đi tiền chưa đủ D1; G5 pending: chưa xác định quyền claim/signature và chống link giả | **Không đưa bản này vào shortlist; giữ vấn đề để nghiên cứu sau.** Nếu bỏ fiat/onboarding và chỉ chuyển devnet USDC giữa hai ví đã có thì phải đánh giá giá trị còn lại và alternatives, không mặc định bản nhỏ đạt. Chưa có cơ sở phân bổ r3 vào bài này thay ba ứng viên Codex có evidence sát workflow hơn. |
| A02 | G4 pending: deployment/IDL/liquidity chưa kiểm; G5 pending: agent thực thi/rút tài sản chưa có policy hay test; không chứng minh bug thực thi vì chưa có code | **Bỏ khỏi vòng chọn hiện tại.** Tự động quản lý tài sản + CPI ngoài + oracle/SDK là nhiều dependency chưa kiểm; đổi thành dashboard không thực thi sẽ là job/cơ chế khác, cần ID mới, không coi đã hoàn thành Yield Manager. |
| A03 | G1/G4/G5 pending: quyền với tài sản ngoài chain, người giữ tài sản và phương án thực thi/redemption chưa xác định | **Bỏ khỏi vòng chọn hiện tại.** Mint token không chứng minh quyền ngoài đời. Đổi thành receipt quyên góp sẽ thay bản chất fractional ownership; không gọi là cùng sản phẩm đã đạt. |

Không đưa ra kết luận pháp lý theo quốc gia hay lời khuyên đầu tư; đây là các requirement chưa được đặc tả. Không có việc nào cần người dùng quyết ngay để C tiếp tục D. Giáo viên review SHORTLIST qua PR, không chờ A phê duyệt.
