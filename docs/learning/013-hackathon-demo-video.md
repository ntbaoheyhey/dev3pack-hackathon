# 013 — Kịch Bản Video Demo Dưới 3 Phút: Công Thức Thuyết Phục Giám Khảo

> Ngày kiểm tra: 2026-11-17 (Asia/Ho_Chi_Minh). Phạm vi: nghệ thuật làm video pitch, cấu trúc thời gian và template kịch bản mẫu.
> Trạng thái: thể lệ đã đối chiếu bằng browser với [Dev3pack trang chủ](https://hack.dev3pack.xyz) và [FAQ](https://hack.dev3pack.xyz/faq) ngày **17/11/2026**; cấu trúc quay là đề xuất của repo, chưa sản xuất video.

---

## 1. Mục tiêu và điều cần nhớ

Sau bài học này, bạn có thể:
1. Tuân thủ giới hạn dưới 3 phút và trình bày sản phẩm thật theo FAQ Dev3pack; không có nguồn cho tỷ lệ quyết định ấn tượng.
2. Nắm vững cấu trúc thời gian "bất di bất dịch": **Hook (20s) &rarr; Vấn đề/Giải pháp (30s) &rarr; Demo thật (75s) &rarr; Điểm Solana sâu (30s) &rarr; Kết luận (25s)**.
3. Chọn lựa và sử dụng đúng các công cụ quay dựng nhanh (Screen Studio, Loom, CapCut).
4. Nhận biết và triệt tiêu 5 lỗi "tử huyệt" khiến video bị loại sớm.
5. Sử dụng ngay **Template kịch bản mẫu điền sẵn chỗ trống** (kèm lời thoại tiếng Anh chuyên nghiệp) ; thời gian sản xuất chưa kiểm chứng vì chưa quay thử.

Thời lượng đọc: khoảng 15 phút.

---

## 2. Phiên bản và bằng chứng kiểm tra

| Thành phần | Tiêu chuẩn / Phiên bản | Mức kiểm chứng |
| --- | --- | --- |
| **Thời lượng tối đa** | **< 3:00 phút (nghiêm ngặt)** | [FAQ Dev3pack](https://hack.dev3pack.xyz/faq): quá 3 phút bị loại khỏi giải |
| **Độ phân giải & Tỷ lệ** | 1080p, 16:9 là đề xuất quay | BTC không công bố bắt buộc 60fps; ưu tiên chữ đọc được |
| **Nền tảng và ngôn ngữ** | YouTube, Loom hoặc link công khai; ngôn ngữ nào cũng được | Theo FAQ; phụ đề tiếng Anh là tùy chọn hỗ trợ |
| **Công cụ quay dựng** | Dùng công cụ đội đã có | Chưa kiểm chứng version/license/hiệu quả; không bắt buộc mua hay cài thêm |

---

## 3. Kiến thức chính

### 3.1. Demo thật và điều kiện xét giải

Theo [FAQ](https://hack.dev3pack.xyz/faq), video phải cho thấy sản phẩm hoạt động, không dùng pitch deck thay demo. **Quá 3 phút bị loại khỏi giải**, không chỉ bị trừ điểm. Giám khảo dùng Product/Technical rubric hai vòng: lọc top 100 rồi xem code, founder-market fit và live demo. Không công bố trọng số.

Mọi dự án mặc định vào track Solana; partner tracks còn chờ công bố trước kickoff. Chưa có track DePIN/AI Agent hoặc bounty riêng của sponsor. Chỉ minh họa SDK có vai trò thật trong sản phẩm, không hứa điểm/giải từ số SDK. Điều kiện nộp và năm bước form xem [001](001-hackathon-rules.md), [012](012-winning-solana-hackathons.md).

### 3.2. Cấu trúc kịch bản chuẩn 3 phút (The 3-Minute Formula)

```mermaid
flowchart LR
    A["0:00 - 0:20 (20s)<br>THE HOOK<br>Nêu nỗi đau giật mình"] --> B["0:20 - 0:50 (30s)<br>PROBLEM & SOLUTION<br>Giới thiệu tên & giá trị"]
    B --> C["0:50 - 2:05 (75s)<br>LIVE DEMO (CORE LOOP)<br>Thao tác thật mượt mà"]
    C --> D["2:05 - 2:35 (30s)<br>SOLANA DEPTH<br>Explorer & Sponsor SDKs"]
    D --> E["2:35 - 3:00 (25s)<br>VISION & OUTRO<br>Đội ngũ & Call to action"]
```

#### Phân đoạn 1: The Hook (0:00 – 0:20) — 20 giây
- **Mục tiêu**: Bắt lấy sự chú ý ngay lập tức.
- **Hành động hình ảnh**: Mở đầu bằng một hình ảnh số liệu biết nói hoặc câu hỏi trực diện.
- **Lời thoại mẫu**: *"Mỗi ngày, có hàng trăm triệu USD bị thất thoát trên các giao thức DeFi chỉ vì giao dịch chậm và trượt giá cao. Người dùng nhỏ lẻ luôn là người chịu thiệt hại cuối cùng."*
- **Tuyệt đối tránh**: *"Xin chào ban giám khảo, tôi tên là Nguyễn Văn A, hôm nay tôi xin đại diện nhóm..."* (Lãng phí thời gian quý giá!).

#### Phân đoạn 2: Problem & Solution (0:20 – 0:50) — 30 giây
- **Mục tiêu**: Định vị sản phẩm là giải pháp duy nhất giải quyết triệt để nỗi đau trên.
- **Hành động hình ảnh**: Hiển thị Logo, khẩu hiệu và giao diện trang chủ ấn tượng của ứng dụng.
- **Lời thoại mẫu**: *"Đó là lý do chúng tôi xây dựng [Tên dự án]. [Tên dự án] là giao thức định tuyến thanh khoản tức thời đầu tiên trên Solana, tận dụng tốc độ sub-second để triệt tiêu trượt giá và bảo vệ người dùng."*

#### Phân đoạn 3: The Live Demo (0:50 – 2:05) — 75 giây (Trọng tâm)
- **Mục tiêu**: Chứng minh sản phẩm thật 100%, không phải đồ họa dựng sẵn.
- **Hành động hình ảnh**:
  1. Người dùng bấm "Connect Wallet" &rarr; ví kết nối ngay lập tức.
  2. Người dùng nhập số liệu và bấm nút thực hiện hành động chính.
  3. Cửa sổ ví mở ra, người dùng bấm "Approve".
  4. Trạng thái chuyển mượt mà: `pending` &rarr; `confirmed` &rarr; số dư hoặc bảng xếp hạng cập nhật ngay tức thì.
- **Lưu ý**: Hãy chuẩn bị sẵn một kịch bản quay thành công (Happy Path). Nếu mạng Devnet chập chờn, hãy dùng bản ghi hình dự phòng mượt mà đã quay trước đó.

#### Phân đoạn 4: Solana & Sponsor Depth (2:05 – 2:35) — 30 giây
- **Mục tiêu**: Cho thấy vai trò thật của Solana/SDK; không cam kết điểm hay bounty chưa công bố.
- **Hành động hình ảnh**: Chuyển tab sang màn hình Solana Explorer và backend dashboard.
- **Lời thoại mẫu**: *"Để đạt được điều này, chúng tôi đã xây dựng smart contract bằng Anchor trên Solana Devnet. Đây là transaction vừa hoàn thành: sử dụng PDA để quản lý trạng thái phi tập trung và Token-2022 Transfer Fee để chia sẻ doanh thu tự động. Đồng thời, chúng tôi tích hợp Supabase để đồng bộ hóa bảng xếp hạng theo thời gian thực và ElevenLabs để tạo giọng nói AI tương tác."*

#### Phân đoạn 5: Vision & Outro (2:35 – 3:00) — 25 giây
- **Mục tiêu**: Kết thúc chuyên nghiệp, để lại ấn tượng tốt đẹp.
- **Hành động hình ảnh**: Màn hình tổng kết hiển thị tên đội thi, link live app và mã QR để giám khảo trải nghiệm.
- **Lời thoại mẫu**: *"Toàn bộ hệ sinh thái này được đội ngũ chúng tôi hoàn thành trong 48 giờ. Chúng tôi đã mở mã nguồn hoàn toàn trên GitHub và triển khai bản live trên Vercel. Cảm ơn Ban giám khảo Dev3pack, hãy truy cập [đường dẫn app] để trực tiếp trải nghiệm ngay bây giờ!"*

---

### 3.3. Công cụ quay dựng — lựa chọn nội bộ

Dùng công cụ đội đã có để quay màn hình và lời thoại; xuất thử một clip rồi kiểm tra chữ, âm lượng và tổng thời lượng. Các version, giá/license, auto-caption và thời gian tiết kiệm của Screen Studio/OBS/CapCut **chưa kiểm chứng trong phiên này**; không dùng tỷ lệ hay số giây ở bản cũ để dự toán.

#### Tham khảo, có thể lỗi thời — Colosseum/Superteam 2024–2025

Bản cũ chỉ dẫn homepage Colosseum/Superteam, chưa có permalink video/hướng dẫn hỗ trợ một “công thức chuẩn”. Bỏ cách gán đó; không suy luật Dev3pack từ các giải khác. Trường hợp lịch sử có nguồn cụ thể được tách tại mục 3.3 của [012](012-winning-solana-hackathons.md).

### 3.4. Năm lỗi "tử huyệt" khiến video demo bị đánh trượt

1. **Video lố thời gian (Ví dụ 3 phút 08 giây)**: Bị loại khỏi điều kiện xét giải theo FAQ Dev3pack.
2. **Chỉ trình chiếu Slide PowerPoint**: Giám khảo muốn xem **sản phẩm thật đang chạy**, không ai muốn xem slide lý thuyết trong 3 phút.
3. **Âm thanh tồi tệ**: Tiếng nói lí nhí, tiếng quạt gió laptop rè rè, hoặc bật nhạc nền EDM đinh tai át mất tiếng thuyết minh.
4. **Demo bị đơ / văng lỗi (Crash)**: Bấm nút giao dịch mà vòng xoay cứ quay mãi hoặc hiện popup đỏ rực mà không có lời giải thích hay phương án dự phòng.
5. **Chữ/âm thanh không rõ**: Khó kiểm chứng demo. Phụ đề tiếng Anh có thể giúp người xem, nhưng không bắt buộc; FAQ chấp nhận mọi ngôn ngữ.

---

## 4. Template Kịch Bản Mẫu Điền Sẵn Chỗ Trống (Ready-to-fill Script)

> Hãy sao chép kịch bản dưới đây, điền các thông tin trong ngoặc vuông `[...]` và dùng phần mềm quay video đọc theo:

```text
[0:00 - 0:20] THE HOOK
Visual: Quay màn hình giao diện Web3 thông thường bị chậm, nghẽn mạng hoặc biểu đồ trượt giá.
Voiceover (English):
"Have you ever tried trading on decentralized platforms, only to lose money to high slippage, failed transactions, and terrible user experience? In Web3 today, user adoption is broken because speed and simplicity are missing."

[0:20 - 0:50] PROBLEM & SOLUTION
Visual: Chuyển mượt sang trang chủ sản phẩm của bạn, hiển thị logo [Tên Dự Án] và khẩu hiệu.
Voiceover (English):
"Welcome to [Tên Dự Án] — the first [mô tả giải pháp trong 3 từ] built specifically for the high-speed Solana ecosystem. We combine Solana's sub-second finality with smart routing to deliver zero-friction experiences for everyday users."

[0:50 - 2:05] LIVE PRODUCT DEMO
Visual: Quay thao tác chuột: Bấm Connect Wallet -> Chọn tính năng chính -> Bấm Execute -> Popup ví hiện lên -> Bấm Approve -> Giao diện cập nhật thành công.
Voiceover (English):
"Let’s see it in action. Right here on our live deployment, I connect my wallet with just one click.
Now, I want to [thực hiện hành động chính: ví dụ: mint an in-game asset / swap token / create an autonomous agent].
I input the parameters and click [Tên nút bấm].
Watch how seamlessly the transaction is dispatched. In less than 400 milliseconds, our transaction hits the 'processed' state, and right now, it is fully 'confirmed' on Solana Devnet. The UI updates instantly without any page refresh."

[2:05 - 2:35] SOLANA & SPONSOR DEPTH
Visual: Mở tab Solana Explorer hiển thị Transaction Hash và tab Supabase/Dashboard.
Voiceover (English):
"Under the hood, this isn't just a Web2 wrapper. Our custom Anchor program manages states through Program Derived Addresses (PDAs), ensuring complete non-custodial security.
We also leverage [nêu công nghệ: Token-2022 Transfer Fees / Metaplex Core] to optimize storage rent by 80%.
On the backend, we integrated Supabase for instant real-time data sync, and ElevenLabs to provide dynamic voice interactions."

[2:35 - 3:00] VISION & OUTRO
Visual: Quay lại màn hình chính của App, hiện Slide kết thúc với GitHub repo URL, Live Demo link và tên team.
Voiceover (English):
"Our team built, tested, and deployed this complete system during the 48 hours of Dev3pack Hackathon. The entire codebase is open-sourced on GitHub, and the live demo is available at [domain của app].
Thank you for watching, and we can’t wait for you to try [Tên Dự Án] today!"
```

---

## 5. Tự kiểm tra

1. **Tại sao bạn không nên dành 30 giây đầu tiên để giới thiệu lý lịch các thành viên trong đội?**
   - *Đáp án*: Vì giám khảo quan tâm nhất đến **vấn đề và sản phẩm**. 20 giây đầu tiên là cơ hội duy nhất để thu hút sự chú ý (The Hook). Giới thiệu thành viên nên để ngắn gọn ở 15 giây cuối cùng hoặc ghi trong mô tả bài nộp.

2. **Nếu mạng Solana Devnet bị lag đúng lúc bạn đang quay màn hình demo, bạn nên làm gì?**
   - *Đáp án*: Luôn chuẩn bị sẵn một cảnh quay "Happy Path" thành công từ trước. Khi dựng video, bạn có thể ghép đoạn quay thành công đó vào để đảm bảo nhịp điệu video mượt mà, không để video bị đơ nhiều phút chờ đợi.

3. **Yếu tố nào giúp video demo của bạn ghi điểm tối đa ở các hạng mục giải thưởng của Nhà tài trợ (Sponsors)?**
   - *Đáp án*: Dành riêng phân đoạn từ 2:05 – 2:35 để trình chiếu trực tiếp Explorer, dashboard và nhắc tên chính xác cách bạn sử dụng SDK của nhà tài trợ (Supabase, ElevenLabs, Firecrawl, MWA) vào giải pháp.

---

## 6. Nguồn và độ tin cậy

- [Dev3pack trang chủ](https://hack.dev3pack.xyz), [FAQ](https://hack.dev3pack.xyz/faq) — đã mở bằng browser **17/11/2026**, nguồn cho thể lệ video/chấm/track.
- [Solana Transaction Confirmation](https://solana.com/developers/guides/advanced/confirmation) — phân biệt commitment; số đo của sản phẩm phải có bằng chứng riêng.
- Mọi mốc quay và lời thoại là đề xuất nội bộ; dữ liệu Colosseum/Superteam cũ không phải căn cứ thể lệ Dev3pack.

## 7. Điểm chưa kiểm chứng và bước tiếp theo

Chưa có video xuất thực tế, số đo latency/rent, test, deployment hoặc giới hạn thời gian chính xác từ dashboard. YouTube/Loom/link công khai và mọi ngôn ngữ **đã được FAQ xác nhận**, không còn là điều chưa rõ. Chưa biết partner tracks/bounty cuối cùng.

Khi có sản phẩm: điền bằng chứng, quay thử, kiểm duration của file đã xuất và link công khai; không tự cài tool hoặc deploy trong task tài liệu.
