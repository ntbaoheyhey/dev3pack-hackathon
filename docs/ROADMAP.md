# ROADMAP — từ học tới nộp bài Dev3pack

Người điều phối: Claude (vai **giáo viên**). Học sinh: **Codex** (GPT-6 Astra Max) và **Antigravity** (Gemini 3.8 Flash High).
Ngày lập: **17/11/2026**, múi giờ Asia/Ho_Chi_Minh. Hackathon: **27–29/11/2026**, chỉ Solana, video demo dưới 3 phút.

File này là **lịch trình và đề bài**, không phải giáo trình. Giáo viên chỉ ghi *cần học gì, cần làm ra gì, thế nào là xong*. Nội dung học do học sinh tự tìm (docs chính thức, source trên GitHub, paper, tạp chí, Reddit, X, Hacker News, diễn đàn và mạng xã hội Trung Quốc như Zhihu, Juejin, CSDN, V2EX, Linux.do, Bilibili…) rồi tự viết vào `docs/learning/`.

> Mọi agent: đọc file này trước khi nhận việc để biết **đang ở phase nào** và phần việc của mình. Trạng thái phase cập nhật ở bảng "Trạng thái hiện tại" cuối file.

---

## 1. Nhận xét bài làm đến 17/11 (giáo viên chấm)

### Điểm tốt

- Đủ 13 note (002–014), đúng template, có nguồn, phiên bản, bài tự kiểm tra và ghi rõ cái gì **chưa** kiểm chứng. Thói quen này phải giữ.
- Codex review chéo phần của Antigravity, bắt được 9 lỗi thật (R01–R09: lộ API key ElevenLabs ở browser, parse nhầm mã lỗi `0x1770`, nguồn gán sai, kịch bản video 180 giây…) và đã sửa hết.
- Đã có bộ phiên bản đề xuất (Anchor 1.2.2 / Agave 4.1.2 / platform-tools v1.57), checklist bảo mật S01–S12, kịch bản video 165 giây, checklist nộp bài.

### Chỗ còn mỏng (lý do có các phase dưới đây)

| # | Lỗ hổng | Mức rủi ro |
| --- | --- | --- |
| G1 | **Chưa làm tay gì cả.** Chưa cài Rust/Solana/Anchor, chưa compile dòng Rust nào, chưa deploy devnet, chưa build frontend thật. Mọi snippet đều "chưa chạy". Lỗi tương thích phiên bản sẽ lộ ra đúng lúc thi nếu không thử trước. | Rất cao |
| G2 | **Chưa nghĩ về sản phẩm.** Chưa có nghiên cứu vấn đề/người dùng, chưa phân tích dự án thắng gần đây (2025–2026), chưa có ý tưởng nào. | Cao |
| G3 | **Thiếu chủ đề kỹ thuật hay dùng khi thi**: đưa giao dịch lên chain ổn định (priority fee, blockhash hết hạn, retry), oracle, gọi DeFi có sẵn, đọc dữ liệu/indexing, thanh toán stablecoin, Solana Pay, Actions/Blinks, x402 và AI agent, ví nhúng/đăng nhập bằng ví cho người mới, upgrade authority. | Trung bình |
| G4 | **Chưa có quy trình phối hợp hai agent khi build**: nhánh nào, ai merge, IDL là "hợp đồng" giữa program và frontend ra sao. Sự cố ghi nhầm repo Taskbar Hero cho thấy cần luật rõ. | Cao |
| G5 | **Thông tin cuộc thi còn thiếu**: giờ UTC hạn nộp trên dashboard, partner tracks (công bố trước kickoff), local track $500 có Việt Nam không, nội dung bootcamp Rust của Dev3pack (2–27/11). | Trung bình |
| G6 | Note dài và rào đón nhiều, khó tra nhanh lúc đang thi. Cần sổ tay 1 trang. Note 000 chưa rà lại. | Thấp |
| G7 | Người dùng phải **tự giải thích được dự án** khi chấm, nhưng chưa có kế hoạch dạy lại cho người dùng. | Trung bình |

### Giáo viên tự nghiên cứu thêm (17/11) — gợi ý hướng, học sinh phải tự kiểm chứng sâu

- **Solana Frontier Hackathon** (Colosseum, công bố 26/06/2026): quán quân CrowdBrain (robotics DePIN). Top 25 gom quanh: prediction market, stablecoin/thanh toán xuyên biên giới cho thị trường mới nổi (KinnectFi cho kiều bào Philippines, Stablecorp cho founder Ấn Độ, DashX), RWA, agent/analytics, game thẻ bài (TCG). Có giải riêng **University Award** và **Public Good Award**. BTC khen "tốc độ thực thi, insight, founder-market fit, biết ưu tiên". [Nguồn](https://blog.colosseum.com/announcing-the-winners-of-the-solana-frontier-hackathon/)
- **Cypherpunk Hackathon** (19/12/2025): quán quân là ví cứng Solana kèm app; các nhánh Consumer, DeFi, Infrastructure, RWA, Stablecoin, Undefined. [Nguồn](https://blog.colosseum.com/cypherpunk-winners-stamp-light-token-firedancer/)
- **Agent Hackathon** (03/2026) và Solana x402 Hackathon: AI agent + thanh toán máy-với-máy đang là hướng nóng. [Nguồn](https://blog.colosseum.com/agent-hackathoin-ptoken-seeker-grants/), [x402](https://solana.com/x402/hackathon)
- **Thay đổi hạ tầng cần biết**: P-Token (SIMD-266) thay SPL Token, giảm CU mạnh, đổi địa chỉ CPI; Light Token tài trợ rent cho token account. Học sinh phải kiểm tra trạng thái hiện tại trên devnet/mainnet. Cùng nguồn trên.
- **Solana Mobile Builder Grants**: yêu cầu mobile-first, dùng MWA và Seed Vault — gợi ý tiêu chí của giải Best Mobile App (chưa phải thể lệ Dev3pack).
- **Template chính thức**: [templates.solana.com](https://templates.solana.com/) có Next.js + Anchor, React Vite + Anchor, gill… Nên dùng làm khung thay vì dựng từ số 0.
- **Dev3pack**: trang chủ có Solana Rust Bootcamp 2–27/11 (tiếng Anh/Tây Ban Nha) và local track $500 "ở một số quốc gia". [hack.dev3pack.xyz](https://hack.dev3pack.xyz/)

Những điểm trên là **gợi ý hướng** cho P1 và P3, không phải kết luận.

---

## 2. Bản đồ phase

```
P1 Học bổ sung ──► P2 Lab thực hành ──► P4 Chuẩn bị & tổng duyệt ──► P5 Build (27–29/11) ──► P6 Demo & nộp
        └──────────► P3 Ý tưởng (chạy song song cuối P2) ──┘
```

| Phase | Mục tiêu một câu | Mốc mềm | Cổng ra (xong khi) |
| --- | --- | --- | --- |
| **P1** Học bổ sung | Lấp G3, G5 và bắt đầu G2 bằng nghiên cứu | 17–19/11 | Note 015–025 có trong repo, được chéo review |
| **P2** Lab thực hành | Biến lý thuyết thành một dApp devnet chạy thật | 19–23/11 | Program devnet + frontend live + test xanh + bảng phiên bản đã chạy |
| **P3** Ý tưởng | Chọn 1 ý tưởng + 1 dự phòng có căn cứ | 21–24/11 | `docs/IDEA.md` được người dùng duyệt |
| **P4** Chuẩn bị & tổng duyệt | Thiết kế xong trên giấy, khung repo sẵn, đã tập dượt | 24–26/11 | Checklist "Sẵn sàng" đủ, buổi tập dượt đã ghi bài học |
| **P5** Build | Làm sản phẩm trong sự kiện | 27–29/11 | Đóng băng tính năng, chạy được luồng demo trên devnet |
| **P6** Demo & nộp | Video ≤165 giây, README, nộp form sớm | 29/11 | Đã nộp, có ảnh chụp xác nhận |

Mốc ngày là **mềm**: phase sau chỉ mở khi cổng ra của phase trước đạt (trừ P3 được chạy song song). Nếu trễ, cắt phạm vi, không dời ngày thi.

Hai mốc cứng: **26/11 tối** đóng băng mọi việc chuẩn bị; **hạn nộp 29/11** (giờ UTC phải đọc trên dashboard).

---

## 3. Chi tiết từng phase

### P1 — Học bổ sung (17–19/11)

**Mục tiêu:** lấp các chủ đề còn thiếu và gom dữ liệu cho việc chọn ý tưởng. Chỉ đọc và viết note, chưa cài đặt.

Mỗi chủ đề là một note theo `_TEMPLATE.md`. Số note đã chia sẵn để hai agent không ghi đè nhau.

| Note | Chủ đề cần tự học | Chủ trì | Review chéo |
| --- | --- | --- | --- |
| 015 | Đưa giao dịch lên chain chắc chắn: compute budget, priority fee, blockhash hết hạn, retry, mức xác nhận, lỗi hay gặp lúc mạng nghẽn | Codex | Antigravity |
| 016 | Gọi program có sẵn: oracle (Pyth, Switchboard), swap/aggregator (Jupiter), CPI vào Token/Token-2022, tình trạng P-Token và Light Token | Codex | Antigravity |
| 017 | Đọc dữ liệu: RPC methods, filter `getProgramAccounts`, event/log, indexer, DAS API, webhook | Codex | Antigravity |
| 018 | Thanh toán và agent: stablecoin (USDC, PYUSD…), Solana Pay, x402, bộ công cụ AI agent trên Solana | Codex | Antigravity |
| 019 | Vòng đời program: upgrade authority, multisig, verified build, đóng program/thu hồi rent | Codex | Antigravity |
| 020 | Người mới vào app: ví nhúng, đăng nhập bằng ví (Sign-In With Solana), fee payer/gasless, thông điệp lỗi dễ hiểu | Antigravity | Codex |
| 021 | Actions và Blinks: cách hoạt động, ví nào hỗ trợ, có hợp để demo không | Antigravity | Codex |
| 022 | Hạ tầng web: deploy frontend (Vercel…), backend nhẹ giữ secret, Supabase auth + ví, biến môi trường | Antigravity | Codex |
| 023 | Giao diện nhanh mà đẹp: bộ UI kit, mẫu dashboard/landing của dự án thắng, chuẩn mobile-first | Antigravity | Codex |
| 024 | Phân tích dự án thắng 2025–2026 (Frontier, Cypherpunk, Agent, x402, Breakout, Superteam) — Codex: dùng tính năng Solana nào, độ sâu kỹ thuật; Antigravity: vấn đề, người dùng, demo, pitch | Cả hai | Nhau |
| 025 | Thông tin cuộc thi còn thiếu (G5) + nội dung bootcamp Dev3pack + local track Việt Nam + vấn đề thật ở Việt Nam/Đông Nam Á có thể giải bằng Solana | Antigravity (có browser) | Codex |

Thêm: Antigravity rà lại note **000** (G6). Ai có quyền mở browser của người dùng thì thử lại các nguồn Trung Quốc từng bị chặn ở 009.

**Cổng ra P1:** 11 note có mặt, mục lục `docs/learning/README.md` cập nhật, mỗi note có ít nhất một nhận xét chéo được xử lý, DEVLOG ghi đủ. Giáo viên chấm trước khi mở P2.

### P2 — Lab thực hành (19–23/11)

**Mục tiêu:** chạy thật một dApp nhỏ end-to-end trên devnet để lộ hết lỗi môi trường **trước** ngày thi, và đo tốc độ làm việc thật của hai agent.

**Cần người dùng trước khi bắt đầu:** đồng ý cài toolchain trên máy theo bộ phiên bản ở 003; tạo ví devnet (không dùng ví có tiền thật); tài khoản Vercel/Supabase nếu dùng.

Code lab để ở `labs/` trong repo (công khai, README ghi rõ là làm **trước** sự kiện).

| Lab | Việc | Chủ trì |
| --- | --- | --- |
| L0 | Cài toolchain đúng phiên bản đã chọn, ghi lại phiên bản **đã chạy** vào 003 | Codex |
| L1 | Program nhỏ (có PDA, authority, một lỗi tự định nghĩa), test thành công + test âm theo 007, deploy devnet | Codex |
| L2 | Sinh client từ IDL, ghi lại lệnh thật đã chạy | Codex |
| L3 | Khung frontend từ template chính thức: kết nối ví devnet, gọi L1, hiển thị trạng thái giao dịch và lỗi thân thiện (005) | Antigravity |
| L4 | Deploy frontend lên link công khai; thử trên điện thoại (MWA hoặc PWA) | Antigravity |
| L5 | Một spike SDK nhà tài trợ qua backend (khả năng cao là Supabase), không lộ key | Antigravity, Codex review |
| L6 | CI chạy build + test program; Antigravity tự test luồng chính trên browser | Codex + Antigravity |
| L7 | Ghi thời gian thật của từng lab → ước lượng làm được bao nhiêu trong 48 giờ | Cả hai |

**Cổng ra P2:** có program ID devnet và chữ ký giao dịch thật, link frontend chạy, log test xanh, bảng phiên bản đã chạy, mục "Bài học / lỗi đã gặp" trong các note liên quan được cập nhật.

### P3 — Ý tưởng (21–24/11, song song cuối P2)

**Mục tiêu:** chọn ý tưởng có căn cứ, không chọn theo cảm hứng.

1. Mỗi học sinh **độc lập** đề xuất 5 ý tưởng (không xem bài nhau trước), dựa trên 024 và 025. Mỗi ý tưởng một trang: vấn đề, người dùng cụ thể, vì sao cần Solana, dùng tính năng Solana nào, có hợp sponsor/track nào, "khoảnh khắc wow" trong video, làm được trong 48 giờ không (dựa trên số đo L7), rủi ro lớn nhất.
2. Chấm chéo bằng bảng tự chấm ở 012, rồi gộp thành 3 ý tưởng tốt nhất.
3. **Người dùng chọn** 1 ý tưởng chính + 1 dự phòng.
4. Nếu partner track được công bố trước kickoff và hợp hơn, xét lại ở P4.

**Cổng ra P3:** `docs/IDEA.md` một trang được người dùng duyệt.

### P4 — Chuẩn bị & tổng duyệt (24–26/11)

**Mục tiêu:** vào ngày thi chỉ còn việc code, không còn việc nghĩ.

| Việc | Chủ trì |
| --- | --- |
| Thiết kế program trên giấy: account, PDA, instruction, mô hình đe dọa theo 007 | Codex |
| "Hợp đồng" IDL nháp giữa program và frontend | Codex, Antigravity duyệt |
| Luồng người dùng + wireframe + storyboard video 165 giây (013) | Antigravity |
| Chia việc build thành mốc nhỏ có chủ, ước lượng theo L7 | Cả hai |
| Quy trình phối hợp khi build (G4): nhánh, PR, ai merge, xử lý xung đột, HANDOFF | Codex viết, Antigravity duyệt |
| Khung repo dự án + README tách "trước sự kiện / trong sự kiện" | Antigravity |
| Sổ tay 1 trang cho mỗi agent (lệnh hay dùng, phiên bản, lỗi đã gặp) | Mỗi agent tự viết |
| **Tập dượt**: một buổi 4–6 giờ làm một tính năng nhỏ đúng quy trình thi (tự đánh thức, HANDOFF, review chéo, deploy) rồi ghi bài học | Cả hai |
| Kiểm tra lại dashboard: giờ hạn nộp, partner tracks, form | Antigravity |
| Bản giải thích dự án cho người dùng (G7) | Cả hai |

Nguyên tắc: trước sự kiện chỉ chuẩn bị **khung và thiết kế**; logic sản phẩm viết trong sự kiện. Thể lệ cho phép code có trước nếu README ghi rõ, nhưng làm vậy giữ phần "làm trong sự kiện" rõ ràng khi chấm.

**Cổng ra P4:** checklist "Sẵn sàng" (thiết kế, IDL nháp, storyboard, khung repo, quy trình, sổ tay, tập dượt xong, hạn nộp đã xác nhận) đủ trước 26/11 tối.

### P5 — Build (27–29/11)

**Mục tiêu:** có luồng demo chạy thật trên devnet càng sớm càng tốt, rồi mới thêm thắt.

| Mốc | Nội dung | Chủ trì |
| --- | --- | --- |
| M1 | Program lõi + test + deploy devnet | Codex |
| M2 | "Bộ xương chạy được": frontend gọi được program, luồng chính đi hết trên link công khai | Antigravity |
| M3 | Tính năng tạo điểm nhấn + tích hợp sponsor (nếu có) | Cả hai |
| M4 | Codex review bảo mật theo 007; Antigravity bắt lỗi trên browser và điện thoại | Cả hai |
| Đóng băng | Sáng 29/11: ngừng thêm tính năng, chỉ sửa lỗi chặn demo | — |

Luật trong lúc build: không làm hỏng `main`; deploy lại sau mỗi mốc; cập nhật HANDOFF sau mỗi mốc; luôn bật tự đánh thức.

### P6 — Demo & nộp (29/11)

| Việc | Chủ trì |
| --- | --- |
| Quay video ≤165 giây theo storyboard, số liệu trong lời thoại phải đo thật | Antigravity |
| README cuối, ảnh chụp, địa chỉ contract, link live, phần "trước/trong sự kiện" | Antigravity, Codex kiểm tra phần kỹ thuật |
| Kiểm tra cuối: repo public, không có secret/keypair, link chạy, contract đúng cluster | Codex |
| Nộp form 5 bước, **chừa ít nhất 3 giờ** trước hạn | Người dùng |
| Ôn giải thích dự án cho vòng chấm | Người dùng, có tài liệu từ P4 |

---

## 4. Cách giao việc và chấm bài

- **Mỗi phase một prompt** (đặt trong `prompts/`), giáo viên viết khi mở phase. Prompt chỉ nêu: mục tiêu, danh sách cần học/làm, sản phẩm phải nộp, cổng ra. Không viết sẵn nội dung.
- **Nguồn học sinh phải tự khai thác**: docs và source chính thức trước; sau đó paper, tạp chí, blog kỹ thuật, GitHub issues/discussions, Reddit, X, Hacker News, Stack Exchange, Discord công khai; Trung Quốc: Zhihu, Juejin, CSDN, V2EX, Linux.do, Bilibili, Xiaohongshu. Mỗi nhận định ghi nguồn và ngày đọc; nguồn bị chặn thì ghi là bị chặn, không bịa.
- **Tự đánh thức khi chạy lâu** (không cần watchdog): đầu mỗi task dài, học sinh tự tạo tác vụ lặp **mỗi 15 phút** nhắn vào chính chat của mình, kiểu: *"Mấy giờ rồi? Đọc docs/HANDOFF.md và làm tiếp mục đầu tiên trong Còn lại."* Codex dùng Automations; Antigravity dùng tác vụ lên lịch trong chat. Xong hết việc thì tự hủy tác vụ.
- **Chấm bài**: hết mỗi phase, học sinh mở PR; học sinh kia review chéo; giáo viên chấm theo cổng ra rồi mới mở phase sau.
- **Việc cần người dùng** (cài đặt, tạo tài khoản/ví, chọn ý tưởng, nộp form) ghi vào mục "Bị chặn" của HANDOFF, không tự làm.
- **Người dùng học song song**: theo nhịp ở [011](learning/011-solana-learning-roadmap.md); cuối mỗi phase, học sinh viết một trang giải thích bằng lời thường cho người dùng.

---

## 5. Trạng thái hiện tại

| Phase | Trạng thái | Ghi chú |
| --- | --- | --- |
| P0 Học nền (002–014) | xong | PR #1, REVIEW R01–R09 đã sửa |
| P1 | chờ mở | Giáo viên viết prompt P1 |
| P2 | chưa mở | Cần người dùng đồng ý cài toolchain |
| P3 | chưa mở | |
| P4 | chưa mở | |
| P5 | chưa mở | 27–29/11 |
| P6 | chưa mở | 29/11 |
