# ROADMAP — các phase để build một app hoàn chỉnh

Người điều phối: Claude (vai **giáo viên**). Học sinh: **Codex** (GPT-6 Astra Max, viết tắt **C**) và **Antigravity** (Gemini 3.8 Flash High, viết tắt **A**).
Ngày lập: **17/11/2026**, múi giờ Asia/Ho_Chi_Minh. Hackathon: **27–29/11/2026**, chỉ Solana, video demo dưới 3 phút.

**Build bắt đầu ngay từ bây giờ**, không chờ tới 27/11. Thể lệ cho phép code làm trước nếu README ghi rõ phần nào làm trước, phần nào làm trong sự kiện (mốc là tag `hackathon-start`, xem README).

File này là **lịch trình và đề bài**, không phải giáo trình. Giáo viên chỉ ghi: phase làm gì, *cần học gì* (chỉ liệt kê), phải nộp gì, thế nào là xong, ai chủ trì. Nội dung học do học sinh tự tìm và tự viết vào `docs/learning/`.

> Mọi agent: đọc file này trước khi nhận việc để biết **đang ở phase nào** và phần việc của mình. Trạng thái nằm ở mục cuối file.

> **Vai trò từ 17/11/2026:** Codex (C) là **trưởng nhóm, chủ trì mọi phase**. Antigravity (A) là **trợ lý của C** (crawl, gom bằng chứng, kiểm tra trên browser, UI từ Phase 5), nhận việc qua `docs/tasks/A-queue.md`. Ở các bảng dưới, phần ghi "A" nghĩa là việc C nên giao cho A qua hàng đợi; C chịu trách nhiệm kết quả. Nguyên nhân hai agent dừng giữa chừng và cách chặn: [`docs/STOP-CAUSES.md`](STOP-CAUSES.md).

---

## 1. Vòng lặp của mọi phase

Phase nào cũng đi đúng 5 bước, không nhảy cóc:

1. **Học**: học sinh tự nghiên cứu đúng các chủ đề phase cần (danh sách ở từng phase). Nguồn: docs và source chính thức trước; rồi paper, tạp chí, blog kỹ thuật, GitHub issues/discussions, Reddit, X, Hacker News, Stack Exchange, Discord công khai; Trung Quốc: Zhihu, Juejin, CSDN, V2EX, Linux.do, Bilibili, Xiaohongshu. Mỗi nhận định ghi nguồn và ngày đọc; nguồn bị chặn thì ghi là bị chặn, không bịa.
2. **Ghi note**: viết note mới theo `docs/learning/_TEMPLATE.md` (hoặc bổ sung note cũ 002–014). Để không trùng số: thêm dòng vào mục lục `docs/learning/README.md` và commit **trước** khi viết note.
3. **Làm**: thực hiện phần việc của phase, commit nhỏ, test thật.
4. **Review chéo**: học sinh kia review; người chủ trì sửa.
5. **Chấm**: giáo viên chấm theo "Cổng ra"; phase sau chỉ mở khi đạt. Cuối phase, học sinh viết vài dòng bằng lời thường cho người dùng hiểu (người dùng phải tự giải thích được dự án khi chấm).

---

## 2. Nhận xét phần đã học (002–014)

**Tốt:** 13 note đúng template, có nguồn và phiên bản, ghi rõ cái gì chưa kiểm chứng. Codex review chéo bắt được và đã sửa 9 lỗi thật (R01–R09). Đã có bộ phiên bản đề xuất (Anchor 1.2.2 / Agave 4.1.2 / platform-tools v1.57), checklist bảo mật S01–S12, kịch bản video 165 giây, checklist nộp bài.

**Còn mỏng — đã đưa vào các phase bên dưới:**

| # | Lỗ hổng | Xử lý ở |
| --- | --- | --- |
| G1 | Chưa làm tay gì: chưa cài toolchain, chưa compile, chưa deploy, chưa build frontend | Phase 2 trở đi |
| G2 | Chưa có ý tưởng, chưa phân tích người dùng hay dự án thắng gần đây | Phase 1 |
| G3 | Thiếu chủ đề: đưa giao dịch lên chain ổn định, oracle, gọi DeFi có sẵn, đọc dữ liệu/indexing, thanh toán stablecoin, Solana Pay, Actions/Blinks, x402 và AI agent, ví nhúng, upgrade authority | Rải vào phase 3–7 theo nhu cầu của ý tưởng |
| G4 | Chưa có quy trình phối hợp hai agent khi code chung repo | Phase 2 |
| G5 | Chưa rõ giờ UTC hạn nộp, partner tracks, local track Việt Nam | Phase 1, kiểm lại ở phase 8 |
| G6 | Note dài, khó tra nhanh; note 000 chưa rà lại | Sổ tay 1 trang ở phase 7 |

**Giáo viên nghiên cứu thêm (17/11) — gợi ý hướng, học sinh tự kiểm chứng:**

- Solana Frontier Hackathon (Colosseum, 26/06/2026): top 25 gom quanh prediction market, stablecoin/thanh toán xuyên biên giới cho thị trường mới nổi (KinnectFi cho kiều bào Philippines, Stablecorp cho Ấn Độ, DashX), RWA, AI agent/analytics, game thẻ bài. Có University Award và Public Good Award. [Nguồn](https://blog.colosseum.com/announcing-the-winners-of-the-solana-frontier-hackathon/)
- Cypherpunk (12/2025): quán quân là ví cứng Solana kèm app. [Nguồn](https://blog.colosseum.com/cypherpunk-winners-stamp-light-token-firedancer/)
- Agent Hackathon (03/2026), x402 Hackathon: AI agent và thanh toán máy-với-máy đang nóng. [Nguồn](https://blog.colosseum.com/agent-hackathoin-ptoken-seeker-grants/), [x402](https://solana.com/x402/hackathon)
- Hạ tầng mới: P-Token (SIMD-266) thay SPL Token ở địa chỉ mới, Light Token tài trợ rent token account — cần kiểm trạng thái hiện tại.
- Solana Mobile Builder Grants yêu cầu mobile-first, MWA, Seed Vault (gợi ý cho giải Best Mobile App, chưa phải thể lệ Dev3pack).
- Template chính thức: [templates.solana.com](https://templates.solana.com/) (Next.js + Anchor, React Vite + Anchor, gill…).
- Dev3pack có Solana Rust Bootcamp 2–27/11 và local track $500 "ở một số quốc gia". [hack.dev3pack.xyz](https://hack.dev3pack.xyz/)

---

## 3. Bản đồ phase

```
1 Ý tưởng & spec ─► 2 Kiến trúc ─┬─► 4 Program on-chain ─┐
   (song song) 3 Môi trường ─────┤                       ├─► 6 Tích hợp ─► 7 Hoàn thiện ─► 8 Trong sự kiện ─► 9 Demo & nộp
                                 └─► 5 Frontend & ví ────┘
```

| # | Phase | Chủ trì | Mốc mềm | Cổng ra |
| --- | --- | --- | --- | --- |
| 1 | Ý tưởng & spec sản phẩm (học chấm → bộ chấm → vòng lặp tới ngưỡng) | C + A | 17–19/11 | Người dùng duyệt `docs/IDEA.md` |
| 2 | Kiến trúc & thiết kế | C (on-chain), A (UX) | 18–19/11 | `docs/ARCHITECTURE.md` được duyệt |
| 3 | Môi trường & khung repo (song song phase 1–2) | C (toolchain, CI), A (web) | 17–19/11 | Hello program trên devnet + web live + CI xanh |
| 4 | Program on-chain | C | 19–22/11 | Test xanh, deploy devnet, client sinh từ IDL |
| 5 | Frontend & ví (song song phase 4) | A | 19–22/11 | Mọi màn hình chạy với dữ liệu giả |
| 6 | Tích hợp end-to-end + off-chain | C + A | 22–24/11 | Luồng chính chạy thật trên devnet qua link công khai |
| 7 | Hoàn thiện: bảo mật, lỗi, README | C + A | 24–26/11 | Không còn lỗi nghiêm trọng, sẵn sàng demo |
| 8 | Trong sự kiện | C + A | 27–29/11 | Tính năng điểm nhấn + đóng băng sáng 29/11 |
| 9 | Demo & nộp | A (video), C (kiểm tra), người dùng (nộp) | 29/11 | Đã nộp, có ảnh xác nhận |

Ngày là mốc **mềm**. Trễ thì cắt phạm vi, không dời ngày thi. Hai mốc cứng: **hết 26/11** có bản chạy được hoàn chỉnh; **hạn nộp 29/11** (giờ UTC đọc trên dashboard).

---

## 4. Chi tiết từng phase

### Phase 1 — Ý tưởng & spec sản phẩm

**Mục tiêu:** có ý tưởng **đạt ngưỡng điểm** của bộ chấm chung, rồi người dùng chọn.

**Nguyên tắc:** không đi tìm ý tưởng khi chưa biết chấm ý tưởng thế nào; một ý tưởng chỉ được coi là hợp lý khi **vượt ngưỡng điểm** sau vòng lặp chấm–sửa. Toàn bộ chặng A–E, tiếp theo là Phase 2 (và Phase 3 nếu người dùng đồng ý cài), nằm trong **một prompt lớn cho mỗi agent** (`prompts/02-*-phase1.md`); hai agent phối hợp qua file trên nhánh chung `work`. Người dùng chỉ quay lại một lần để chọn ý tưởng.

| Chặng | Việc | Chủ trì | Xong khi |
| --- | --- | --- | --- |
| **A** | Học cách chấm ý tưởng | C (015, 016), A (017, 018 + cập nhật 001) | Note có mục "Tiêu chí ứng viên", đã review chéo |
| **B** | Bộ chấm chung + ngưỡng đạt | C quyết (A góp nháp) | `docs/ideas/RUBRIC.md` đã thử chấm dự án có thật — **xong, v1.1** |
| **C** | Học nơi tìm ý tưởng | C (019), A (020) | Note xong, review chéo |
| **D** | Vòng lặp ý tưởng | C (A crawl bằng chứng theo hàng đợi) | Ít nhất 3 ý tưởng vượt ngưỡng RUBRIC, mỗi điểm có bằng chứng; ý tưởng cũ của A được C chấm lại |
| **E** | Danh sách cuối | C | `docs/ideas/SHORTLIST.md`, mở PR, hỏi người dùng |

**Cần học ở chặng A:** tiêu chí chấm chính thức và cách giám khảo chấm thật (Solana, Colosseum, Superteam, Dev3pack và hackathon lớn khác); cách đánh giá độ khả thi và rủi ro kỹ thuật trong thời gian ngắn; khung thẩm định ý tưởng sản phẩm/startup và nghiên cứu học thuật về chấm ý tưởng; phép thử "có cần blockchain/Solana không"; thông tin chấm của Dev3pack.

**Cần học ở chặng C:** kho ý tưởng và danh sách "mong muốn" của hệ sinh thái (RFP, request for startups, danh sách ý tưởng), dự án thắng và dự án bị bỏ dở, nơi người dùng than phiền (Việt Nam, Trung Quốc, global), xu hướng cuối 2026, cách tìm vấn đề thật thay vì nghĩ ra từ đầu.

**Vòng lặp ở chặng D:**

```
lấy ý tưởng từ nguồn (có bằng chứng) → chấm bằng RUBRIC
   ├─ vượt ngưỡng → gửi bên kia chấm chéo → vượt ngưỡng → ĐẠT
   │                                       └─ không vượt → quay lại sửa
   └─ không vượt → tìm tiêu chí yếu nhất → nghiên cứu thêm / sửa ý tưởng / thay ý tưởng → chấm lại
```

Mỗi vòng ghi lại điểm và thay đổi. Ý tưởng sửa quá số vòng tối đa (đặt trong RUBRIC) mà vẫn không vượt thì bỏ, ghi lý do.

**Sau Phase 1 prompt:** người dùng chọn 1 ý tưởng chính + 1 dự phòng từ SHORTLIST; sau đó viết `docs/IDEA.md` (one-liner, người dùng, vấn đề, user stories, phạm vi MVP, ngoài phạm vi, luồng demo 165 giây).

**Cổng ra Phase 1:** người dùng duyệt `docs/IDEA.md`.

### Phase 2 — Kiến trúc & thiết kế

**Mục tiêu:** bản vẽ đủ chi tiết để hai học sinh code song song mà không giẫm chân nhau.

**Cần học** (chọn đúng phần ý tưởng cần):
- Mẫu thiết kế account/PDA cho bài toán tương tự trong các repo open source — C
- Chủ đề G3 mà ý tưởng dùng tới: token/stablecoin, Solana Pay, oracle, gọi DeFi có sẵn, Actions/Blinks, x402/agent, nén state — C (on-chain), A (phía người dùng)
- Chia việc on-chain và off-chain; khi nào cần backend, indexer — C
- Mô hình đe dọa cho program (bổ sung 007) — C
- Luồng người dùng, wireframe, người mới chưa có ví (ví nhúng, đăng nhập bằng ví, fee payer) — A
- SDK nhà tài trợ hợp với ý tưởng (014): chọn hoặc bỏ có lý do — A
- Quy trình hai agent cùng code một repo: nhánh, PR, ai merge, IDL là "hợp đồng" giữa program và frontend — C viết, A duyệt

**Làm:** `docs/ARCHITECTURE.md` gồm sơ đồ hệ thống; account, PDA seeds, instruction, error, event; IDL nháp; phần off-chain; mô hình đe dọa; luồng màn hình + wireframe; quy trình phối hợp; danh sách việc phase 4–6 chia theo người.

**Cổng ra:** review chéo xong, giáo viên chấm, người dùng đọc bản giải thích 1 trang và đồng ý.

### Phase 3 — Môi trường & khung repo (song song phase 1–2)

**Mục tiêu:** đường ống chạy từ đầu đến cuối dù chưa có tính năng: build → test → deploy devnet → web công khai.

**Cần người dùng:** đồng ý cài toolchain trên máy; tạo ví devnet riêng (không dùng ví có tiền thật); tài khoản Vercel (hoặc tương đương), Supabase nếu dùng.

**Cần học:**
- Cài bộ phiên bản đã chọn ở 003 và lỗi cài hay gặp trên macOS — C
- Template chính thức và cấu trúc thư mục program + web trong một repo — C + A
- CI cho Anchor (build, test) trên GitHub Actions — C
- Deploy web, biến môi trường, giữ secret ngoài repo — A
- Ví devnet, airdrop/faucet, quản lý keypair an toàn — C

**Làm:** cài toolchain và ghi phiên bản **đã chạy** vào 003; khung repo từ template; program "hello" deploy devnet; web "hello" kết nối ví, deploy link công khai; CI xanh; README ghi phần làm trước sự kiện.

**Cổng ra:** program ID devnet + chữ ký giao dịch thật, link web chạy, CI xanh.

### Phase 4 — Program on-chain (C)

**Mục tiêu:** toàn bộ logic on-chain của MVP, có test, trên devnet.

**Cần học:**
- Phần Anchor mà thiết kế dùng tới (constraints, CPI, token, close account…) — tự đào sâu từ 004
- Test thật: LiteSVM / Mollusk / Surfpool hoặc tương đương, test âm theo 007
- Đưa giao dịch lên chain ổn định: compute budget, priority fee, blockhash, retry, mức xác nhận
- Program gọi tới (nếu có): oracle, Token-2022/P-Token, DeFi
- Sinh client từ IDL (Codama) và cách bàn giao cho A
- Upgrade authority, verified build

**Làm:** viết từng instruction kèm test thành công và test âm; deploy devnet; sinh client; ghi "hợp đồng" IDL cho A; đo CU.

**Cổng ra:** test xanh trong CI, program trên devnet, client đã sinh, A xác nhận dùng được.

### Phase 5 — Frontend & ví (A, song song phase 4)

**Mục tiêu:** mọi màn hình của luồng demo chạy được với dữ liệu giả, sẵn sàng cắm client thật.

**Cần học:**
- @solana/kit, Wallet Standard, kết nối ví (đào sâu 005)
- Trải nghiệm người mới: ví nhúng, đăng nhập bằng ví, thông báo trạng thái và lỗi dễ hiểu
- Bộ UI kit giúp làm nhanh mà đẹp; tham khảo giao diện dự án thắng
- Mobile: PWA hoặc MWA nếu nhắm giải mobile (008)
- Actions/Blinks nếu ý tưởng dùng
- Tự test bằng browser agent

**Làm:** các màn hình theo wireframe, chạy với client giả theo IDL nháp; responsive; quay thử luồng demo.

**Cổng ra:** đi hết luồng demo bằng dữ liệu giả trên link công khai; C review phần chạm ví/giao dịch.

### Phase 6 — Tích hợp end-to-end + off-chain (C + A)

**Mục tiêu:** luồng chính chạy thật trên devnet, người lạ mở link là dùng được.

**Cần học:**
- Đọc dữ liệu on-chain: RPC methods, filter, event/log, indexer/webhook nếu cần — C
- Backend nhẹ giữ secret, Supabase (auth + ví, realtime) hoặc SDK sponsor đã chọn — A, C review bảo mật
- Xử lý lỗi thật từ chain và từ ví — A
- Test end-to-end tự động qua browser — A

**Làm:** thay client giả bằng client thật; nối backend/sponsor SDK; test end-to-end; deploy lại.

**Cổng ra:** luồng demo chạy thật trên devnet qua link công khai, có log/chữ ký làm bằng chứng.

### Phase 7 — Hoàn thiện (C + A)

**Mục tiêu:** bản đủ chắc để demo và nộp, trước 27/11.

**Cần học:**
- Cách review bảo mật Solana program (vượt 007, xem audit report công khai) — C
- Bug bash trên nhiều ví, trình duyệt, điện thoại — A
- README tốt cho giám khảo (012) — A

**Làm:** C review bảo mật toàn bộ, sửa lỗi; A bắt lỗi trên browser và điện thoại; README đầy đủ (kiến trúc, chạy local, phần làm trước sự kiện); mỗi agent viết sổ tay 1 trang (lệnh hay dùng, phiên bản, lỗi đã gặp); A rà lại note 000; viết bản nháp kịch bản video theo 013; người dùng tập giải thích dự án.

**Cổng ra:** không còn lỗi nghiêm trọng, README xong, tạo tag `hackathon-start` lúc mở màn 27/11.

### Phase 8 — Trong sự kiện (27–29/11)

**Mục tiêu:** phần làm trong sự kiện có giá trị thật, rồi đóng băng.

**Cần học:** partner tracks vừa công bố và yêu cầu của chúng; phản hồi từ mentor (nếu có).

**Làm:** tính năng điểm nhấn đã để dành; điều chỉnh theo partner track nếu hợp; mọi thay đổi ghi vào phần "trong hackathon" của README; deploy lại sau mỗi mốc; đóng băng sáng 29/11, chỉ sửa lỗi chặn demo.

**Cổng ra:** bản cuối trên devnet (hoặc mainnet nếu người dùng đồng ý), link live ổn định.

### Phase 9 — Demo & nộp (29/11)

**Cần học:** quay/dựng video ngắn có số liệu thật (013); form nộp 5 bước.

**Làm:** A quay video ≤165 giây; C kiểm tra cuối (repo public, không có secret/keypair, contract đúng cluster, link chạy); A hoàn thiện README, ảnh chụp; **người dùng nộp form, chừa ít nhất 3 giờ trước hạn**.

**Cổng ra:** đã nộp, có ảnh chụp xác nhận.

---

## 5. Cách giao việc

- **Ít prompt, chạy dài**: mỗi agent nhận một prompt lớn chạy qua nhiều phase, chỉ dừng ở chỗ thật sự cần người dùng. Cuối mỗi đợt, agent tự viết `docs/NEXT.md` cho đợt sau, để người dùng chỉ cần nhắn "Đọc docs/NEXT.md và làm tiếp". Prompt chỉ nêu mục tiêu, cần học gì, việc làm, sản phẩm nộp, cổng ra; không viết sẵn nội dung.
- **Tự đánh thức khi chạy lâu** (không cần watchdog): đầu mỗi task dài, học sinh tự tạo tác vụ lặp **mỗi 15 phút** nhắn vào chính chat của mình, kiểu: *"Mấy giờ rồi? Đọc docs/HANDOFF.md và làm tiếp mục đầu tiên trong Còn lại."* Codex dùng Automations; Antigravity dùng tác vụ lên lịch trong chat. Xong hết việc thì tự hủy.
- **Phase song song** (3 với 1–2; 4 với 5): mỗi agent làm trên nhánh riêng, merge qua PR, ghi DEVLOG khi chạm vùng của agent kia.
- **Việc cần người dùng** (cài đặt, tài khoản, ví, chọn ý tưởng, nộp form) ghi vào mục "Bị chặn" của `docs/HANDOFF.md`, không tự làm.

---

## 6. Trạng thái hiện tại

| Phase | Trạng thái | Ghi chú |
| --- | --- | --- |
| Nền (002–014) | xong | PR #1, REVIEW R01–R09 đã sửa |
| 1 Ý tưởng & spec | người dùng đã duyệt IDEA ReceiptRail qua lời duyệt Phase2 | “ReceiptRail chính, ClusterProof phụ” lúc00:07; tin “duyệt phase 2” log09:27:18.464 ngày18/11 UTC+7. RUBRIC/SHORTLIST còn chờ verdict giáo viên, xem DECISION |
| 2 Kiến trúc | người dùng đã duyệt · review chéo/giáo viên còn mở | IDEA/ARCHITECTURE/IDL/demo165giây,19 runtime tests local; C01r2=79/F4. T30/0d7b9d3 nhận một phần; T31/e483529 chưa đạt nguồn/state/phản hồi.9nhóm finding chưa đóng; T32→T33 rồi sửa hẹp T31 cùng task. Không suy lời duyệt người dùng thành review/giáo viên đã đạt |
| 3 Môi trường | CI Linux đạt · chờ funding hello và ví thật | P3-A/P3-B đã có quyền. Revision27cf7ac: PR44237534047/push44237529539 đều đạt3jobs/57tests+build và ReceiptRail IDL cmp. [Evidence](evidence/phase3/ci-passed-27cf7ac.json), [Plan](PHASE3-PLAN.md). Hello chưa deploy, ví thật chưa kiểm; funding được người dùng để sau, Phase3 chưa xong |
| 4 Program | chưa mở | |
| 5 Frontend | chưa mở | |
| 6 Tích hợp | chưa mở | |
| 7 Hoàn thiện | chưa mở | |
| 8 Trong sự kiện | chưa mở | 27–29/11 |
| 9 Demo & nộp | chưa mở | 29/11 |
