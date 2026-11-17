# 012 — Chuẩn bị bài thi Solana theo thể lệ Dev3pack

> Ngày kiểm tra: **17/11/2026** (Asia/Ho_Chi_Minh). Đã mở [trang chủ](https://hack.dev3pack.xyz) và [FAQ](https://hack.dev3pack.xyz/faq) bằng browser để đọc nội dung render bằng JavaScript. Kinh nghiệm thi đấu bên dưới là đề xuất của repo; chưa build/test/deploy sản phẩm.

## 1. Mục tiêu và điều cần nhớ

Phân biệt điều kiện BTC công bố với checklist tự đề xuất; chuẩn bị một demo thật, repo open source và bằng chứng kỹ thuật có thể kiểm tra. Sự kiện diễn ra **27–29/11/2026**, trang chủ mô tả ba ngày; “48h” trong kế hoạch của đội chỉ là ngân sách làm việc nội bộ, không phải giới hạn BTC đã công bố.

## 2. Phiên bản và bằng chứng kiểm tra

| Nguồn | Mốc / phạm vi | Mức kiểm chứng |
| --- | --- | --- |
| [Dev3pack trang chủ](https://hack.dev3pack.xyz) | 17/11/2026 | Đã đọc lịch, nhà tài trợ, supporters, giải |
| [Dev3pack FAQ](https://hack.dev3pack.xyz/faq) | 17/11/2026 | Đã mở các câu hỏi về track, chấm, nộp bài, video và code |
| [Colosseum Renaissance winners](https://blog.colosseum.com/announcing-the-winners-of-the-solana-renaissance-hackathon/) | Sự kiện **2024** | Tham khảo lịch sử; không phải thể lệ Dev3pack 2026 |
| Checklist và bảng tự chấm | Đề xuất của repo | Chưa thử bằng bài thi thực tế; không cam kết điểm hoặc giải |

## 3. Kiến thức chính

### 3.1. Thể lệ Dev3pack đã kiểm tra

Theo [FAQ](https://hack.dev3pack.xyz/faq), ngày 17/11/2026:

- Track chính là **Solana**; mọi dự án mặc định tham gia track này. Partner tracks và số tiền sẽ được công bố trước kickoff. Hiện **chưa có track DePIN hay AI Agent được công bố**, chưa có bounty riêng cho từng sponsor. Nếu bổ sung partner track, chỉ đăng ký nơi dự án thật sự dùng công nghệ đó; giám khảo kiểm điều kiện.
- Chấm **hai vòng**, dùng rubric **Product và Technical**. Vòng 1 lọc **top 100**; vòng 2 xem code, founder-market fit và kiểm tra live demo.
- Tín hiệu gồm eligibility compliance, product clarity, real-world impact, demo quality, deployment, repo quality, Solana/SDK depth. **BTC không công bố trọng số**.
- Video phải **dưới 3 phút**, quá 3 phút mất điều kiện xét giải; phải cho thấy sản phẩm hoạt động, không thay bằng pitch deck. YouTube, Loom hoặc link công khai khác đều được; ngôn ngữ nào cũng được.
- Devnet hoặc mainnet đều được; repo này vẫn mặc định devnet. Bắt buộc open source. AI được phép nếu đội hiểu, demo và giải thích được sản phẩm. Code cũ của chính đội được dùng khi README phân biệt trước/trong sự kiện; nộp fork dự án hackathon của người khác như của mình bị loại.
- Hạn nộp **Chủ nhật 29/11/2026**; **giờ UTC xem dashboard**, chưa điền giờ nếu chưa thấy thông báo chính thức.

Theo [trang chủ](https://hack.dev3pack.xyz), kiểm tra cùng ngày:

| Loại | Nội dung công bố |
| --- | --- |
| Nhà tài trợ | Firecrawl, ElevenLabs, Supabase, Solana Mobile, Solana |
| Supporters | Blockchain Developer Report, Bonfires |
| Giải chung | **$10,000+ Best App Overall on Solana** |
| Địa phương | **$500 local tracks**, chỉ tại một số quốc gia |
| Mobile | **Seeker Phones** cho **Best Mobile App Built on Solana Mobile** |
| Perks | **$2,500+ perks/sinh viên**, không đồng nhất với tiền mặt |
| Sau sự kiện | Suất **Bridge Accelerator**, bắt đầu từ **7/12/2026**; top teams được mời |

Có giải mobile không có nghĩa mọi PWA/tích hợp MWA mặc nhiên đủ điều kiện; cần đối chiếu yêu cầu cụ thể khi BTC công bố.

### 3.2. Bảng tự chấm — trọng số tự đề xuất, BTC không công bố

Điều kiện hợp lệ là cổng kiểm tra riêng, không được bù bằng điểm cao. Các tỷ lệ sau chỉ giúp đội ưu tiên công sức; **không phải rubric có trọng số chính thức**.

| Tín hiệu | Trọng số tự đề xuất | Bằng chứng đội nên chuẩn bị |
| --- | --- | --- |
| Product clarity | 20% | Một câu: sản phẩm gì, cho ai, giải vấn đề nào |
| Real-world impact | 20% | Phỏng vấn/nhu cầu thật, phân biệt số đo và giả thuyết |
| Demo quality | 20% | Một luồng thao tác thật, video theo [013](013-hackathon-demo-video.md) |
| Deployment | 15% | Link truy cập được, program/contract address đúng cluster |
| Repo quality | 10% | README, license phù hợp, lệnh chạy đã thử và kết quả test thật |
| Solana/SDK depth | 15% | Giải thích vai trò on-chain và SDK phục vụ sản phẩm; không đếm SDK để suy bounty |
| **Tổng tự đề xuất** | **100%** | Không dùng bảng này để suy điểm BTC |

### 3.3. Tham khảo, có thể lỗi thời — Colosseum/Superteam 2024–2025

[Thông báo Renaissance 2024 của Colosseum](https://blog.colosseum.com/announcing-the-winners-of-the-solana-renaissance-hackathon/) xác nhận Ore là Grand Champion, Urani đứng đầu DeFi & Payments và Blockmesh đứng đầu DePIN. Nguồn này hỗ trợ **kết quả giải và mô tả sản phẩm**, không chứng minh mọi đội có cùng demo/repo, hiệu suất TPS, chi phí mint hay lý do họ thắng.

Các nhận định cũ về Radar 2024–2025 và “chuẩn Superteam” chưa có permalink cụ thể hỗ trợ nên đã bỏ khỏi hướng dẫn. **Chưa kiểm chứng** chúng như dữ liệu nghiên cứu. Tuyệt đối không suy track DePIN/AI Agent, giới hạn video, trọng số hoặc bounty Dev3pack từ sự kiện khác.

Đề xuất của repo: chọn một nhu cầu thật, hoàn thiện luồng chính, cho người đọc cách kiểm tra kết quả. Đây là gợi ý thực hành, không phải công thức bảo đảm thắng giải.

### 3.4. Checklist chuẩn bị nộp bài — lịch tự đề xuất

T là giờ đóng form được dashboard xác nhận; các mốc dưới không phải quy định BTC.

| Mốc | Việc cần hoàn tất |
| --- | --- |
| T−24h | Chốt luồng chính, hạn chế tính năng mới; chạy test/build phù hợp và ghi kết quả |
| T−12h | Kiểm tra deployment/link trên thiết bị thực; README có cluster, program ID, phạm vi trước/trong sự kiện |
| T−4h | Xuất video **≤165 giây** theo 013; kiểm tra âm thanh, nội dung thật, link công khai |
| T−2h | Điền đủ năm bước form; người khác mở thử repo/live/video |
| T−45 phút | Nộp, lưu xác nhận của portal; đây là biên tự đề xuất, không đợi T−0 |

**Năm bước form theo [FAQ](https://hack.dev3pack.xyz/faq):**

1. Project: tên, one-liner, category tùy chọn, contract address, hub, mô tả.
2. Images: ảnh dự án.
3. Links & video: demo video, repository, live link.
4. Team: xác nhận thành viên.
5. Review & submit: kiểm tra rồi nộp.

Không tự áp giới hạn 100 ký tự, quy tắc MIT bắt buộc hay “private = 0 điểm”: FAQ chỉ xác nhận các trường/điều kiện nêu trên. Repo phải open source và reviewer truy cập được.

## 4. Ví dụ hoặc quy trình tối thiểu

### README tối thiểu có thể kiểm tra

Template dưới chưa phải bằng chứng dự án đã xây xong; thay mọi chỗ trống bằng dữ liệu thật, không dùng badge “verified” khi chưa verify.

````markdown
# [Tên dự án]
> [Sản phẩm] giúp [đối tượng] giải quyết [vấn đề].

- Live app: [điền link]
- Video demo: [điền link công khai, thời lượng thực ≤165 giây]
- Repo: [điền link open source và license]
- Cluster / Program ID / Explorer: [điền dữ liệu thực]

## Vấn đề, người dùng và bằng chứng
[Điền nhu cầu, phản hồi hoặc số đo; ghi rõ giả thuyết chưa thử.]

## Kiến trúc và cách demo
[Luồng thao tác, phần on-chain/off-chain, SDK sử dụng và mục đích.]

## Chạy thử và kiểm tra
[Prerequisites, phiên bản khóa trong lockfile, biến môi trường chỉ ghi tên.]
[Lệnh đã thực sự thử, kết quả và giới hạn; không dán secret.]

## Trước và trong sự kiện
- Trước: [commit/phạm vi đã có]
- Trong: [commit/phần thực hiện trong hackathon]
- AI/tools: [cách sử dụng và phần đội có thể giải thích]

## Giới hạn và hướng tiếp theo
[Lỗi còn biết, số đo chưa có, phần chưa triển khai.]
````

## 5. Tự kiểm tra

1. Sáu tỷ lệ 20/20/20/15/10/15 có phải BTC công bố? **Không**, là trọng số tự đề xuất; eligibility vẫn phải đạt.
2. Dùng bốn SDK có bốn bounty không? **Không**. Chưa có bounty riêng được công bố; cần điều kiện partner track thật.
3. Video 3:00 có nên nộp? **Không**; FAQ yêu cầu dưới 3 phút, kế hoạch repo ≤165 giây để chừa biên.
4. Chỉ mã nguồn riêng tư có đáp ứng yêu cầu không? **Không**; open source là bắt buộc, không tự suy cách tính điểm phạt.

## 6. Nguồn và độ tin cậy

- [Dev3pack trang chủ](https://hack.dev3pack.xyz) và [FAQ](https://hack.dev3pack.xyz/faq) — nguồn chính thức, đọc bằng browser **17/11/2026**.
- [Colosseum Renaissance winners](https://blog.colosseum.com/announcing-the-winners-of-the-solana-renaissance-hackathon/) — nguồn lịch sử năm 2024, chỉ dùng trong mục tham khảo.
- Checklist, trọng số và template là đề xuất nội bộ, chưa đo hiệu quả.

## 7. Điểm chưa kiểm chứng và bước tiếp theo

Chưa có giờ UTC từ dashboard, partner tracks/bounty cụ thể hoặc trọng số BTC. Kiểm tra lại trang chính thức trước kickoff và trước khi nộp. Chưa có sản phẩm, test, video hoặc deployment trong task tài liệu này.

**Bài học / lỗi đã gặp:** không gán nguồn homepage cho luật cụ thể; tách kết quả giải cũ, đề xuất nội bộ và điều kiện BTC hiện hành.
