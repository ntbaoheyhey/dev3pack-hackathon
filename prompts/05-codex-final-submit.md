# Prompt 05 — Codex: hoàn thành ReceiptRail và chuẩn bị bộ nộp bài (28–29/11/2026)

> Người dùng dán nguyên văn toàn bộ file này vào chat Codex, bật **Goal mode**. Prompt được viết ngày 28/11/2026 theo yêu cầu của người dùng.
>
> **Hạn nộp là 14:00 Chủ nhật 29/11/2026, giờ Việt Nam (07:00 UTC).** Giao bộ nộp sớm lúc 23:30 tối 28/11. Dành 6 giờ sáng hôm sau để hoàn thiện trải nghiệm và bàn giao bản cuối chậm nhất 11:30.

---

## 0. Nguồn quyền của prompt này

Yêu cầu gốc của người dùng (nguyên văn, trong project chat với Claude, 28/11/2026 17:50 UTC+7):

> context là mai mình không rảnh, nên giờ bạn cần viết một big prompt để codex tự hoàn thành tất cả mọi thứ nhé, ra sản phẩm để mình đem nộp luôn

Người dùng cập nhật hạn nộp trong chat Codex. Tin nhắn được ghi lúc **18:01:58.786 ngày 28/11/2026 (UTC+7)**.

> hạn cuối nộp là 14h chiều mai, điều chỉnh thời gian cho phù hợp nhé, prompt cụ thể chưa chỉnh. chỉnh để có thêm thời gian chỉnh chủ sản phẩm

Việc người dùng tự dán Prompt 05 vào chat này là lời giao việc cho phạm vi ở **mục 3**. Ghi vào `docs/ideas/DECISION.md`: câu nguyên văn trên (nguồn: project chat với Claude), và "Người dùng dán Prompt 05 vào chat Codex" kèm **giờ log thật** của message dán prompt (lấy từ log, không tự đặt giờ). Không viết thêm câu nào như thể người dùng đã nói. Không suy quyền ngoài mục 3.

Người dùng sẽ không có mặt ngày 29/11, nên mọi lựa chọn trong phạm vi mục 3 Codex tự quyết và ghi lý do; không chờ câu trả lời.

---

## 1. Khởi động ngay khi nhận việc

1. **Tự nhắc mỗi 15 phút.** Tạm dừng automation cũ của Mission 01 (`dev3pack-bu-i-h-c-nghi-n-c-u-m-i-15-ph-t`) nếu còn chạy. Tạo script mỗi 15 phút nhắn thẳng vào **chính chat này** hỏi mấy giờ rồi, kèm câu: "Mấy giờ rồi? Đọc Thẻ nhớ trong docs/HANDOFF.md, git fetch, làm tiếp mục đầu tiên trong Còn lại của Prompt 05." Đọc lại cấu hình, ghi tên/ID và trạng thái ACTIVE vào Thẻ nhớ. Chưa thấy ACTIVE thì chưa làm bước 2. Chỉ tắt ở mục 5.7.
2. **Đồng bộ repo.** Codex đang ở `/Users/bao/Documents/ChatGPT/dev3pack`, nhánh `codex/mission-01-research`, có file chưa commit.
   - Commit phần dở của Mission 01 trên nhánh đó (local, không cần push). File `docs/evidence/phase5/mock-site-2026-11-20.json` thuộc sản phẩm: mang sang `work`.
   - `git checkout work && git fetch origin && git merge --ff-only origin/work`.
   - Antigravity có 2 commit docs chưa push ở `/Users/bao/Documents/dev3pack-hackathon` nhánh `work` (`bc73c65`, `58b4e00`). Lấy về: `git fetch /Users/bao/Documents/dev3pack-hackathon work` rồi merge; xung đột thì giữ cả hai bên.
   - Chạy test hiện có một lần để biết điểm xuất phát (`bash scripts/check-receiptrail.sh`, `bash scripts/check-receiptrail-client.sh`, `cd apps/web && npm test && npm run build`). Ghi kết quả vào Thẻ nhớ.
3. **Thẻ nhớ mới.** Viết lại đầu `docs/HANDOFF.md`: Thẻ nhớ ≤ 20 dòng cho Prompt 05 (mục tiêu, giờ mốc, phạm vi mục 3, automation ID, commit hiện tại) + danh sách **Còn lại** theo thứ tự thời gian trong bảng mục 5. Chuyển Thẻ nhớ Mission 01 vào `docs/archive/`. Trạng thái `đang làm`.

## 2. Điểm xuất phát (đã kiểm ngày 28/11)

- Ý tưởng: **ReceiptRail** (người dùng chọn lúc 00:07 ngày 18/11; ClusterProof chỉ là dự phòng, không làm).
- Program Anchor `programs/receiptrail` đã deploy devnet: **`8NGSPufBmGB1oHqaZpY1jhJYz1X4gqFiNXCQmxfapYko`** (P4-B, 162 tx finalized). IDL ở `docs/idl/receiptrail.json`, client sinh ở `packages/receiptrail-client`, 32 runtime + 23 client tests.
- Signers devnet cũ ngoài Git ở `~/.local/share/dev3pack/devnet/receiptrail/` (merchant `HtQY…u4y2`, payer `DPKx…nyrc`, fee/upgrade authority `GQRo…bFM2`).
- Web `apps/web`: UI ReceiptRail chạy **mock** (52 tests), wallet panel Wallet Standard T41 (9 tests). **Chưa có adapter devnet thật** (P6-1/P6-2 trong `docs/PHASE6-PLAN.md` chưa làm). Site "ReceiptRail Mock Demo" đã tạo nhưng `published=false`.
- Còn thiếu để nộp: luồng thật trên devnet qua UI, link live công khai, README cho giám khảo, video < 3 phút, ảnh, text form nộp, tag `hackathon-start`, merge vào `main`.
- Từ 20/11 tới 28/11 sản phẩm đứng yên (Codex đi học Mission 01). Không quay lại Mission 01 trong prompt này.

## 3. Phạm vi được giao trong Prompt 05

**Được làm, không cần hỏi lại:**

- Viết, sửa, refactor code trong repo; thêm dependency npm/cargo cần cho sản phẩm (ghi phiên bản, lockfile).
- Cài công cụ dev miễn phí, phổ biến, từ nguồn chính thức nếu thiếu (ví dụ `ffmpeg` qua Homebrew để ghép video). Ghi lệnh đã chạy vào DEVLOG.
- Gửi giao dịch **devnet** bằng signers cũ ở trên. Trần tổng chi cho Prompt 05: **0.5 SOL devnet**. Được gọi `requestAirdrop` devnet nếu thiếu; bị rate limit thì giảm số lần thử, không lách.
- Upgrade program trên devnet bằng upgrade authority cũ **chỉ khi** có lỗi nghiêm trọng được test chứng minh. Không đổi program ID, không đổi/revoke authority.
- Tạo **một ví demo devnet mới** (keypair ngoài Git, thư mục 0700) nếu cần cho video; không bao giờ commit secret.
- Publish **công khai** web ReceiptRail bản devnet (Sites như ClusterProof, hoặc GitHub Pages qua Actions). Giữ nguyên site ClusterProof.
- Push `work`, tạo tag, mở và **merge PR `work` → `main`** (PR #7 hoặc PR mới). Chạy CI.
- Headless browser (Playwright/Chromium đã cache) trên localhost và trên link live của dự án; quay video/ảnh bằng headless.

**Không được làm** (nếu cần thì đưa vào checklist cho người dùng ở `docs/SUBMISSION.md`):

- Mainnet, tiền thật, mua dịch vụ, tạo tài khoản ở bất kỳ dịch vụ nào, đăng nhập bằng tài khoản người dùng (dashboard Dev3pack, YouTube, Loom, X…).
- Bấm nộp form hackathon, gửi tin nhắn/email thay người dùng.
- Điều khiển chuột/bàn phím/màn hình GUI của người dùng.
- Ghi vào DECISION hay README lời duyệt nào người dùng không nói. Mọi lời duyệt trích nguyên văn kèm giờ log.

## 4. Luật chạy cho prompt này

- **Tự quyết trong phạm vi mục 3** theo hướng "nộp được, đúng sự thật, đơn giản"; ghi lựa chọn + lý do 1 dòng vào DEVLOG. Việc ngoài phạm vi thì đưa vào checklist người dùng và làm tiếp phần khác. Gặp chặn thì ghi vào "Bị chặn", **làm tiếp mọi việc khác**, dùng phương án dự phòng (mục 7).
- **Không vòng review dài.** Mỗi việc tự review đúng 1 lượt, sửa, đi tiếp. Không viết note học dài; cần tra API thì đọc docs/source, ghi 3–5 dòng vào note liên quan.
- **Không quay lại nghiên cứu.** Không Mission 01, không chấm lại ý tưởng, không ClusterProof.
- Ưu tiên hoàn thành một lượt create → pay → retry bị chặn → đọc receipt trên devnet, mở được qua link live. Quay luôn lượt chạy đạt để tối 28/11 đã có video cho bộ nộp sớm. Dành thời gian bổ sung cho những chỗ người dùng dễ trả nhầm, bỏ cuộc hoặc khó kiểm chứng biên nhận.
- **Viết tiếng Việt có dấu cách bình thường**, không viết dính chữ kiểu "capP6riêngchưachi". README và text nộp bài viết **tiếng Anh** (giám khảo toàn cầu), có thể thêm bản tiếng Việt ngắn.
- **Commit nhỏ, push sau mỗi mốc** lên `work`. Commit code cuối không dùng `[skip ci]`.
- Sau compact hoặc khi tin tự nhắc tới: đọc Thẻ nhớ, `git fetch`, làm tiếp mục đầu tiên trong Còn lại. Compact không phải lý do dừng. Không ghi "tạm dừng".
- Mỗi lần dừng/quên mới: thêm 1 dòng vào `docs/STOP-CAUSES.md`.
- Antigravity **không tham gia** đợt này (người dùng không có mặt để dán prompt cho A). Không chờ, không giao việc cho A.

## 5. Lịch làm việc và bàn giao (giờ Việt Nam, UTC+7)

Hạn nộp người dùng cung cấp là **14:00 ngày 29/11/2026**, tức **07:00 UTC cùng ngày**. Bàn giao bản cuối **chậm nhất 11:30** để người dùng có 2 giờ 30 phút cho việc tải video, điền form và xử lý sự cố. Các khung dưới là ngân sách thời gian. Xong sớm thì chuyển ngay sang việc kế tiếp.

| Ngày | Giờ Việt Nam | Việc | Kết quả cần có |
| --- | --- | --- | --- |
| 28/11 | 18:00–18:30 | Khởi động và đánh dấu đầu sự kiện (1, 5.0) | Kiểm tra tự nhắc, đồng bộ `work`, ghi kết quả test ban đầu và push tag `hackathon-start`. |
| 28/11 | 18:30–22:00 | Hoàn thành luồng devnet qua UI (5.1) | Trên localhost tạo, trả và đọc được hóa đơn. Test adapter và ví demo đạt. |
| 28/11 | 22:00–23:00 | Chạy E2E, mở link live và thu hình (5.2–5.3, 5.5) | Lưu invoice Paid, chữ ký và link Explorer. Mở link công khai bằng cửa sổ chưa nối ví. Lưu cảnh thật và ảnh cho bộ nộp sớm. |
| 28/11 | 23:00–23:30 | **Bàn giao bộ nộp sớm** (5.4–5.5, 6) | Merge bản chạy được vào `main`. Gửi ngay trong chat link demo, README, nội dung form, ảnh và đường dẫn MP4 ≤ 170 giây để người dùng có thể upload và nộp tối nay. |
| 28 → 29/11 | 23:30–01:00 | Hoàn thiện README tiếng Anh và đối chiếu bộ nộp sớm (5.4–5.5) | README đủ 9 mục, link đúng invoice trong video, phụ đề đọc được. Lưu SHA của bản đã bàn giao. |
| 29/11 | **01:00–04:00** | **Hoàn thiện trải nghiệm thanh toán** (5.1–5.2) | Thử mất phản hồi và tải lại trang. Người trả tìm lại đúng hóa đơn, thấy Paid, phân biệt được tiền gốc với phí khi retry và mở được giao dịch trên Explorer. Sửa chỗ dễ khiến người dùng bấm trả lần nữa. |
| 29/11 | **04:00–07:00** | **Hoàn thiện giao diện desktop và mobile** (5.3, 5.6) | Mở link như giám khảo lần đầu ở 375 px và 1440 px. Sửa chữ bị cắt, nút khó bấm, trạng thái đang tải hoặc lỗi RPC khó hiểu. Người chưa nối ví đọc được số tiền, trạng thái và bằng chứng. |
| 29/11 | 07:00–09:00 | Chốt giao diện, dựng video và ảnh cuối (5.4–5.5) | Video có phụ đề khớp giao diện đã sửa, `ffprobe` đo ≤ 170 giây. Đủ ảnh, cover và nội dung form tiếng Anh. |
| 29/11 | 09:00–10:45 | Chạy thử toàn bài và sửa lỗi chặn nộp (5.6) | Từ clone sạch, chạy Quick start và tests. Mở link live và Explorer, phát MP4 đến hết, thử trên hai viewport rồi kiểm lại các lỗi vừa sửa. |
| 29/11 | **10:45–11:30** | **Đóng băng và bàn giao bản cuối** (5.7) | Chốt `main`, kiểm CI, push tag `submission-v1` và gửi `docs/SUBMISSION.md` cùng link, video, ảnh trong chat. |
| 29/11 | 11:30–13:00 | Người dùng upload video, điền form và bấm Submit | Mục tiêu nộp trước 13:00 và lưu xác nhận. Có thể thực hiện ngay từ bộ bàn giao tối 28/11. |
| 29/11 | 13:00–14:00 | Dự phòng cho người nộp | Còn một giờ nếu video xử lý lâu, link cần sửa hoặc form cần gửi lại. Form đóng lúc **14:00**. |

Nếu trễ, dùng phương án mục 7 và rút gọn lồng tiếng, chuyển cảnh hoặc ảnh phụ trước. Giữ bằng chứng trả tiền một lần, bộ nộp sớm và mốc 11:30. Sau 07:00 chỉ sửa sản phẩm khi lỗi cản luồng demo hoặc nộp bài. Nếu bản sửa đổi cảnh đã quay, cập nhật đúng cảnh đó và kiểm lại file xuất.

### 5.0 Tag và minh bạch trước/trong sự kiện

- Tag `hackathon-start` chưa từng được tạo. Tạo **annotated tag** trỏ vào commit cuối trước 27/11/2026 00:00 UTC+7 trên lịch sử `work` (hiện là `63f59ba`, 24/11; kiểm lại bằng `git log --before`). Message tag ghi: "Created retroactively on 28/11/2026; points to the last commit before the event started." Push tag.
- README có mục **Built before vs during the hackathon**: trước = mọi thứ tới tag (ý tưởng, program, deploy devnet, client, UI mock); trong 27–29/11 = các commit sau tag (adapter devnet, UI thật, live link, README, video). Liệt kê theo `git log hackathon-start..main`, không thổi phồng.

### 5.1 Adapter devnet và UI thật (lõi của bài)

Theo `docs/PHASE6-PLAN.md` nhưng **gọn lại cho kịp giờ**:

- **Đọc:** `getAccountInfo` cho một invoice PDA (kiểm owner = program, size, discriminator, PDA/bump); `getProgramAccounts` lọc theo merchant hoặc payer cho danh sách. RPC mặc định `https://api.devnet.solana.com`, hàng đợi nhẹ + backoff cho 429. Người xem không có ví vẫn đọc được hóa đơn qua link `?invoice=<PDA>`.
- **Ghi:** create / pay / cancel build bằng client sinh từ IDL, simulate trước, hiển thị terms + phí + rent trước khi ký, ký qua Wallet Standard (Phantom/Solflare/Backpack trên devnet) bằng panel T41 có sẵn.
- **Điểm nhấn retry:** sau khi pay thành công, nút "Retry payment (new transaction)" gửi pay lần 2 với blockhash mới. Program trả `InvoiceNotOpen`; UI hiển thị rõ tiền gốc chỉ chuyển 1 lần, phí của giao dịch lỗi tính riêng. Thêm chế độ "simulate lost response" có nhãn rõ: sau khi gửi, UI giả mất phản hồi, trạng thái Unknown, rồi đọc lại PDA thấy Paid. Đây là câu chuyện của sản phẩm, phải chạy thật trên devnet.
- **Ví demo cho quay video:** headless không có extension. Làm một Wallet Standard wallet **chỉ có trong build local** (`?demoWallet=1` trên localhost; cờ build tắt ở bản public), ký bằng keypair devnet ngoài Git qua một bridge Node bind `127.0.0.1`, chỉ chấp nhận giao dịch tới program ReceiptRail/System/ComputeBudget, chỉ devnet. Có test chứng minh bundle public **không chứa** demo wallet. Video có nhãn "Local demo wallet, devnet".
- Giữ chế độ mock riêng, nhãn rõ, không tự rơi về mock khi RPC lỗi.
- Tests: unit cho adapter (decode, kiểm owner/PDA, map lỗi), test cho guard của demo wallet, chạy lại toàn bộ suite web + client + runtime. Test cũ sai vì đổi hành vi thì sửa test và ghi lý do.

### 5.2 E2E trên devnet

- Kiểm read-only trước: program executable, authority, bytecode khớp evidence P4, số dư các ví.
- Chạy luồng thật qua UI localhost bằng demo wallet (Playwright): create → pay → retry bị chặn → lost-response → đọc lại Paid → create rồi cancel. Nếu UI lỗi, chạy một lượt qua CLI có sẵn.
- Lưu `docs/evidence/phase6/e2e-devnet-<giờ>.json`: signatures, slot, finality, Explorer links (`https://explorer.solana.com/tx/<sig>?cluster=devnet`), số dư trước/sau, tổng chi so với trần 0.5 SOL. Chọn **1 invoice Paid** làm "demo invoice" cố định cho README/video/link live.

### 5.3 Link live công khai

- Build bản public (không demo wallet), publish công khai. Ưu tiên Sites như ClusterProof (có thể dùng lại project mock đã tạo, đổi nội dung sang bản devnet và đổi tiêu đề). Không được thì GitHub Pages qua workflow Actions từ `main`.
- Trang mở được **không cần ví**: hiển thị demo invoice Paid đọc trực tiếp từ devnet, nút Explorer, giải thích 3 dòng. Có ví devnet thì tạo/trả hóa đơn được.
- Kiểm bằng headless: trang tải, 0 page error, đọc được demo invoice từ devnet. Lưu ảnh và URL vào evidence.

### 5.4 README cho giám khảo (tiếng Anh, trên `main`)

Viết lại `README.md` (chuyển README tiếng Việt hiện tại sang `docs/README-vi.md`). Dùng `docs/README-JUDGES-DRAFT.md` làm nguyên liệu. Các mục theo thứ tự:

1. Tên + one-liner + links: **Live demo**, **Demo video** (placeholder `VIDEO_URL`, người dùng điền sau khi upload), **Program ID** (Explorer devnet), **Demo invoice** (Explorer).
2. Problem (3–4 câu): mất phản hồi sau khi trả → không biết đã trả chưa → trả 2 lần.
3. How it works: sơ đồ mermaid (merchant tạo PDA → payer pay → Paid + transfer cùng tx → retry bị `InvoiceNotOpen` → mọi client đọc chung PDA). Bảng account/instructions/errors từ IDL.
4. Why Solana, và **when a database is enough** (trung thực, đã có trong IDEA.md).
5. Quick start: chạy web local, chạy tests, dùng với Phantom devnet. Lệnh copy-paste được.
6. Tests & evidence: số tests thật, link CI, link evidence devnet.
7. Security notes & limitations: không audit, devnet only, native SOL only, không refund/escrow, trust vào upgrade authority/RPC.
8. **Built before vs during the hackathon** (5.0); ghi rõ có dùng AI tools (Codex, Antigravity, Claude).
9. Team, license MIT.

Ngắn, scan được trong 2 phút. Không dùng mã nội bộ (P4-B, T41, D06…) trong README chính.

### 5.5 Video demo ≤ 2:50 (luật: quá 3:00 bị loại)

- Kịch bản dựa `docs/DEMO-165S-DRAFT.md`, cập nhật theo luồng thật: 0:00 vấn đề → 0:20 merchant tạo invoice → 0:45 payer trả, mất phản hồi giả lập có nhãn → 1:15 đọc lại thấy Paid, Explorer → 1:40 retry bằng giao dịch mới bị chặn, tiền gốc chỉ 1 lần → 2:10 code/tests/program ID → 2:30 giới hạn + link. Lưu `demo/SCRIPT.md` (lời thoại tiếng Anh + phụ đề).
- Quay bằng Playwright headless (recordVideo, 1280×720 hoặc 1920×1080) trên localhost với demo wallet, giao dịch **thật trên devnet**. Phụ đề hiện trong trang (caption overlay chỉ ở chế độ quay) để video vẫn hiểu được khi không có tiếng.
- Lồng tiếng: `say` của macOS (giọng tiếng Anh) tạo audio từ SCRIPT, ghép bằng `ffmpeg`. Không làm được thì xuất video có phụ đề, không tiếng, và ghi lại.
- Xuất `demo/receiptrail-demo.mp4` (H.264 + AAC). Đo bằng `ffprobe`, phải **≤ 170 giây**; ghi vào evidence. File > 50 MB thì không commit (thêm vào `.gitignore`), ghi đường dẫn tuyệt đối trong SUBMISSION.md.
- Ảnh cho form: 4–6 ảnh PNG 1920×1080 hoặc 1280×720 trong `demo/images/` (trang live, tạo invoice, Paid + Explorer, retry bị chặn, sơ đồ kiến trúc), cộng 1 ảnh vuông làm logo/cover.

### 5.6 Bug bash và kiểm cuối

Dùng `docs/PHASE7-BUG-BASH.md`, chỉ các mục ảnh hưởng giám khảo:

- `git clone` sạch vào thư mục tạm, làm theo Quick start trong README: chạy được, tests xanh.
- CI trên `main` xanh (hoặc ghi rõ job nào đỏ và vì sao).
- Link live mở trên Chromium headless desktop và viewport điện thoại, 0 page error.
- Mọi link trong README và SUBMISSION.md trả 200 (trừ placeholder video).
- Không có secret trong Git: tìm keypair JSON dạng mảng 64 số, `PRIVATE`, `.env` trong các commit trong sự kiện.
- Video ≤ 170 s, mở được, nội dung thật.

### 5.7 Đóng băng và bàn giao chậm nhất 11:30 ngày 29/11

- Merge `work` → `main`, tag `submission-v1` trên `main`, push.
- `docs/SUBMISSION.md` bản cuối (mục 6). Cập nhật DEVLOG, ROADMAP (trạng thái phase 6–9), Thẻ nhớ: trạng thái `xong, chờ người dùng nộp`.
- Tắt tin tự nhắc 15 phút, đọc lại thấy đã tắt, ghi vào Thẻ nhớ.
- Báo cáo cuối trong chat bằng tiếng Việt, ≤ 15 dòng: link live, program ID, demo invoice, video ở đâu, việc người dùng cần làm (copy từ mục 6), giới hạn còn lại.

## 6. `docs/SUBMISSION.md` — bộ nộp bài cho người dùng

Viết để người dùng chỉ cần **copy-paste**, theo 5 bước form Dev3pack (FAQ kiểm 28/11):

1. **Project:** Name; One-liner (≤ 100 ký tự); Category gợi ý (Payments / Infrastructure); **Contract address** = program ID devnet; Hub (người dùng chọn); Description (150–250 từ, tiếng Anh).
2. **Images:** danh sách file trong `demo/images/` theo thứ tự upload.
3. **Links & video:** Demo video = `VIDEO_URL` (người dùng upload); Repo = `https://github.com/ntbaoheyhey/dev3pack-hackathon`; Live link = URL ở 5.3.
4. **Team:** người dùng tự xác nhận.
5. **Review & submit:** người dùng tự bấm.

Cuối file, ghi các thao tác người dùng cần làm, khoảng 15 phút thao tác cộng thời gian upload và xử lý video. Có thể nộp ngay từ tối 28/11. Với bản cuối, mục tiêu là bấm Submit trước **13:00 ngày 29/11**, hạn đóng form là **14:00 giờ Việt Nam**.

1. Upload `demo/receiptrail-demo.mp4` lên YouTube (Unlisted hoặc Public) hoặc Loom; copy link.
2. Đăng nhập `hack.dev3pack.xyz` và mở form của dự án. Mốc 14:00 giờ Việt Nam tương ứng 07:00 UTC nếu dashboard hiển thị giờ UTC.
3. Điền form 5 bước bằng nội dung ở trên, upload ảnh, dán link video, bấm Submit, chụp màn hình xác nhận.
4. (Tuỳ chọn) Thay `VIDEO_URL` trong README bằng link video.
5. (Tuỳ chọn) Mở link live bằng Phantom ở devnet để tự thử 1 lần.

Thêm mục **"Nếu giám khảo hỏi"**: 5 câu hỏi khó dễ gặp (vì sao không dùng DB, chống trả 2 lần thế nào, chuyện gì khi merchant tạo ID khác, rent, upgrade authority), mỗi câu trả lời 2–3 dòng tiếng Việt dễ hiểu, để người dùng tự giải thích được dự án.

**Mốc 23:30 tối 28/11.** Gửi `SUBMISSION.md` v1 cùng MP4 xem được, ảnh và link đã thử. Giữ lại bộ này để người dùng có thể nộp sớm ngay cả khi bản sáng hôm sau còn đang sửa. Nếu phải dùng evidence cũ hoặc link mock, ghi nhãn theo mục 7. Nếu còn thiếu video hay trường bắt buộc, gửi phần đã có đúng mốc, ghi rõ phần thiếu và bổ sung ngay khi xong.

## 7. Dự phòng khi bị chặn

| Bị chặn | Làm gì |
| --- | --- |
| Thiếu SOL devnet, airdrop lỗi | Dùng phần còn lại cho luồng ngắn nhất (1 create + 1 pay + 1 retry). Không đủ: dùng evidence P4-B đã có (tx thật) cho video/README, ghi rõ; thêm việc tuỳ chọn cho người dùng "nạp devnet SOL ở faucet.solana.com cho ví `GQRo…bFM2`" |
| RPC public devnet 429 / CORS | Backoff, giảm request; UI hiện demo invoice từ snapshot có nhãn "cached at <time>". Không đăng ký RPC trả phí |
| Sites/GitHub Pages không publish được | Dùng Site mock đã được duyệt public (nhãn mock rõ) làm live link tạm, video là bằng chứng chính; ghi giới hạn |
| Ví extension không test được | Ghi "tested with a local Wallet Standard demo wallet; browser extension flow not verified" trong README, không giả |
| Không ghép được audio | Video có phụ đề, không tiếng |
| CI đỏ do môi trường runner | Ghi rõ trong README, kèm log test local |

Không ô nào trong bảng là lý do để dừng cả prompt.

## 8. Định nghĩa xong

Chỉ báo xong (và tắt tin tự nhắc) khi tất cả đúng:

- [ ] `main` chứa bản nộp; tag `hackathon-start` và `submission-v1` đã push.
- [ ] Ít nhất 1 luồng create → pay → retry bị chặn thật trên devnet, Explorer links trong README.
- [ ] Link live công khai mở được không cần ví (hoặc ghi rõ dự phòng mục 7).
- [ ] README tiếng Anh đủ 9 mục 5.4, có mục Built before vs during.
- [ ] `demo/receiptrail-demo.mp4` ≤ 170 s và ảnh trong `demo/images/`.
- [ ] `docs/SUBMISSION.md` copy-paste được, checklist người dùng ≤ 5 bước.
- [ ] Không secret trong Git; tests xanh (hoặc lỗi được ghi rõ).
- [ ] DECISION.md chỉ chứa lời duyệt nguyên văn có thật; Thẻ nhớ trạng thái `xong, chờ người dùng nộp`.

Bắt đầu ngay với mục 1.
