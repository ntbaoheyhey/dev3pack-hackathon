# 016 — Đánh giá độ khả thi kỹ thuật và rủi ro

> Codex, trước sự kiện, Phase 1/A. Mọi nguồn được đọc/quét **17/11/2026 (Asia/Ho_Chi_Minh)**. Phạm vi: phương pháp và kiểm tra tài liệu; chưa cài toolchain, chưa có spike on-chain. Ước lượng bên dưới là ngân sách lập kế hoạch, không phải thời gian đã đo.

## 1. Mục tiêu và điều cần nhớ

Khả thi nghĩa là đội này có thể hoàn thành **một luồng giá trị chạy thật trong thời gian còn lại**, kể cả tích hợp và sửa lỗi. Không suy thời gian từ số dòng code hoặc lời hứa của AI. Phải biết dependency nào quyết định thành bại, thử phần khó sớm, và có phiên bản thu nhỏ vẫn giữ giá trị cốt lõi.

Đọc cùng 003/004/007/014. Không có số liệu năng suất của đội nên chưa được gọi khoảng ước lượng là P80/P90 hay xác suất thành công.

## 2. Phiên bản và bằng chứng kiểm tra

| Thành phần / nguồn | Mốc quan sát | Mức kiểm chứng |
| --- | --- | --- |
| Anchor release | 1.2.2; Agave 4.1.2/platform-tools v1.57/SBPF v3 được khuyến nghị | [Release][A] đã đọc; chưa cài hoặc chứng minh tương thích cả frontend |
| Anchor issue #3629 | 30/03/2025, Apple Silicon, CLI 0.29.0 + Solana 2.1.17 | [Issue][I] và phản hồi maintainer; lỗi lịch sử, không khẳng định bản hiện tại còn lỗi |
| Jupiter Lend | README hiện tại; SDK 0.4.0, reference Anchor 0.31.1 | [README][J] nói devnet May 2025 không khớp IDL hiện tại; chưa gọi RPC |
| Pyth | URL Core cũ chuyển tới Pro/Lazer | [Docs đích][P] đã đọc, không mặc định mẫu Pull cũ tương đương Pro |
| Solana confirmation/RPC/CU | Docs hiện hành | [Confirmation][T], [Clusters][R], [Fees][F]; chưa đo devnet |
| HackRep | arXiv nộp 31/03/2026, MSR/ACM 2026 | Đã đọc abstract và trang hội nghị; chưa phân tích dataset |
| Ước lượng theo lớp tham chiếu | Flyvbjerg, arXiv 2013 | Đã đọc abstract; nghiên cứu hạ tầng, áp dụng vào software là suy luận phương pháp, không phải hệ số đã kiểm định |

## 3. Kiến thức chính

### 3.1. Ước lượng nhanh mà không tự tin quá mức

[Flyvbjerg][RC] nêu rủi ro của dự báo lạc quan và việc đối chiếu kết quả của dự án tương tự. **Áp dụng đề xuất của Codex:**

1. Chốt một câu acceptance: ai thao tác, state gì đổi, ai xác minh được, điều gì xảy ra khi hỏng. Tách phần bắt buộc và phần trang trí.
2. Chia thành work package: account/invariant, instruction/test, client serialization, wallet, web state, confirm/retry, deploy, demo. Mỗi gói có người làm và input/output.
3. Với mỗi gói ghi `thuận lợi / cơ sở / bất lợi`, lý do và reference gần nhất. Không lấy một tutorial EVM để ước lượng Anchor. Nếu chưa có reference, ghi `U` và đặt spike.
4. Lập đồ thị phụ thuộc và tính critical path. Hai agent không tự động giảm một nửa thời gian: frontend vẫn phụ thuộc contract/client và có thời gian review/tích hợp.
5. Kiểm cả tổng giờ công lẫn thời gian lịch. Trừ phần cài môi trường, học, hội ý, sửa, quay video. Chừa buffer có chủ ý; con số do đội chọn, không viện dẫn thành quy luật.
6. Timebox spike theo câu hỏi có thể bác bỏ; quá timebox thì dùng fallback hoặc giảm phạm vi. Không tiếp tục chỉ vì đã đầu tư nhiều giờ.

Ví dụ **tự soạn**: các gói A=3/5/9h, B=2/4/8h, C=2/3/6h. Nếu B và C đều cần A, lịch cơ sở là `5 + max(4,3) = 9h`, giờ công là `5+4+3 = 12h`, chưa gồm review/tích hợp. Khoảng xấu của gói không phải phân phối xác suất độc lập. Công thức PERT có thể cho trung bình giả nhưng không tạo bằng chứng; không cần dùng khi đầu vào chưa đáng tin.

### 3.2. Những phần Solana dễ tốn thời gian

| Rủi ro | Bằng chứng trực tiếp | Phép kiểm cần làm khi được phép | Cách giảm phạm vi |
| --- | --- | --- | --- |
| Toolchain/host Rust khác compiler SBF | Maintainer trong [#3629][I] giải thích CLI cũ gọi build-bpf và bộ Solana không tương thích | In version thực, build một program nhỏ với bộ 003 | Pin cả bộ, không đổi `latest` trong lúc debug |
| SDK/client và IDL lệch nhau | [Jupiter Lend][J] nêu khác biệt devnet/IDL và reference Anchor 0.31.1 | Pin deployment + IDL + SDK; encode/decode và smoke đúng cluster | Loại CPI ngoài khỏi đường chính nếu chưa có devnet phù hợp |
| Transaction ký xong nhưng không confirmed | [Confirmation][T]: expiry, commitment và RPC chậm/lệch | Lưu signature/lastValidBlockHeight; kiểm status trước build lại; thử user ký chậm | Ít bước ký, UI pending/expired rõ ràng, idempotency theo nghiệp vụ |
| RPC/faucet không ổn định | [Clusters][R] cảnh báo public rate limit có thể đổi; devnet phục vụ thử nghiệm | Backoff, endpoint dự phòng đúng cluster; chuẩn bị SOL thử trước demo | Không cần indexer riêng/stream hàng loạt cho MVP nhỏ |
| Compute, kích thước tx, write locks | [Fees][F] nêu trần CU và công thức; runtime tùy định dạng tx | Simulate instruction thật, kiểm bytes/accounts/CU; benchmark theo số lượng tăng | Giới hạn batch, tách per-user state; không hứa TPS từ marketing |
| Oracle không chỉ là một API giá | [Pyth][P] hiện mô tả SDK/message verification + stream + đưa update vào tx | Kiểm feed/cluster/program, publish time, confidence, staleness, fee/auth | Nếu giá không thiết yếu, bỏ oracle; không thay giá giả rồi gọi “real-time” |
| Wallet/browser/mobile | [MWA spec][W] và 008 cho biết đây là giao thức với capability/session | Thử đúng wallet/device, account chọn, cluster, từ chối ký, session hết hạn | Web desktop trước; không tự gắn nhãn đủ mobile prize |
| CPI/token/lifecycle | 007 và [Anchor constraints][C] | Sai signer/owner/mint, replay, close/recreate, overflow, stale reload | Một token program/mint có kiểm tra; tránh hỗ trợ mọi extension ngay |
| Hai agent tích hợp trễ | [Superteam Argentina][S] nêu coordination và scope quá rộng là lỗi thường gặp | Khóa version IDL, fixtures, error codes và review contract trước | Một luồng dọc nhỏ với stub ghi nhãn rõ, thay stub theo hợp đồng |

[Linux.do retrospective][L] là tác giả tự kể một thử nghiệm 48h: lỗi giao tiếp giữa các module và danh sách phần chưa xong vẫn còn dù đã dùng nhiều AI. Chỉ lấy bài học giới hạn scope/interface từ trải nghiệm đó; không dùng benchmark model hay phần trăm của bài như số đo cho đội. Đây không phải post-mortem Solana.

Không tìm được một post-mortem có dữ liệu đại diện cho “dApp Solana trung bình tốn X giờ”. Các issue cụ thể chứng minh **loại lỗi có thể xảy ra**, không chứng minh tần suất hoặc ETA.

### 3.3. Dependency register bắt buộc

Mỗi dependency có một dòng:

| Trường | Nội dung cần ghi |
| --- | --- |
| Vai trò | Tại sao luồng chính cần dependency này; có bỏ được không |
| Định danh | Repo/tag/package; program ID/mint/cluster nếu có; không đoán từ tên |
| Bằng chứng | Nguồn đã đọc, ngày, sample chạy hay chưa, log/tx nếu có |
| Hạn chế | Auth, quota, faucet, upgrade, licensing, wallet/device, dữ liệu/giá stale |
| Mức rủi ro | Thấp/vừa/cao với lý do; unknown ghi U |
| Spike | Một điều cần chứng minh, timebox, người chịu trách nhiệm |
| Fallback / kill | Thay thế nào giữ giá trị; điều kiện cắt bỏ hoặc bỏ ý tưởng |

`D0`: mới nêu tên; `D1`: đã đọc docs/deployment metadata; `D2`: sample cùng phiên bản chạy; `D3`: luồng tích hợp và lỗi phục hồi đã chạy. Các mức này là ký hiệu nội bộ. Dependency bắt buộc chỉ có D0 mà không fallback là blocker, không được đếm như “tích hợp đơn giản”.

### 3.4. Rủi ro biến thành tiêu chí chấm được

Điểm feasibility dự kiến ở Phase 1, thang 0–5:

| Điểm | Mô tả |
| --- | --- |
| 0 | Mâu thuẫn kỹ thuật/không có đường thực thi hoặc phạm vi bắt buộc vượt giới hạn đã biết |
| 1 | Nhiều dependency chưa kiểm tra; thiếu account/flow và không có fallback |
| 2 | Flow hợp lý nhưng còn một dependency trọng yếu U hoặc đường rút gọn mất giá trị |
| 3 | Account/instruction + phạm vi nhỏ rõ; dependency chính D1, có negative-test plan và fallback; chưa chạy |
| 4 | Điều kiện mức 3 cộng spike D2 của phần rủi ro lớn nhất, có số đo và ngân sách còn dư |
| 5 | Luồng quan trọng D3, lỗi phục hồi được chứng minh, chi phí/compute/giới hạn được đo; có khả năng tái chạy |

Chưa cài toolchain thì không dùng lời “agent làm nhanh” để tự chấm 4–5. Kế hoạch tốt vẫn có thể đạt 3; bộ chấm tổng phải cho ý tưởng mới có cơ hội mà không giả bằng chứng. Ở Phase 2/3 thay placeholder bằng kết quả thật rồi đánh giá lại.

Security tách khỏi số instruction: liệt kê tài sản/quyền, ai đáng tin, invariant, misuse case, rollback/refund. Critical risk như rút tiền không đúng authority hoặc phụ thuộc giá không xác thực chặn đi tiếp cho tới khi có thiết kế giảm rủi ro; test chưa chạy phải giữ nhãn.

## 4. Ví dụ hoặc quy trình tối thiểu

**Bài tập trên giấy, không tạo program:** review một state machine giả định `Created → Active → Finished/Cancelled`.

- Mỗi transition ghi signer, account owner/PDA relation, precondition, effect và error.
- Liệt kê trường hợp sai authority, gọi lặp, hết hạn, thiếu tiền storage/fee, API timeout, tab đóng sau khi gửi tx.
- Tách sự kiện bên ngoài và state đã confirmed. Backend báo “xong” không thay bằng chứng chain.
- Spike mẫu sau khi được đồng ý: tạo state → gọi đúng → gọi sai → gửi lại cùng operation ID → đọc state. Kết quả mong đợi: sai/lặp không gây tác động kinh tế hai lần.
- Kill switch kế hoạch: nếu dependency D0 không có devnet tương thích và không có bản nhỏ tự chủ thì ý tưởng không được thông qua chỉ nhờ điểm demo cao.

## 5. Tự kiểm tra

1. SDK có function và devnet có address là đủ? **Không**, version/state/liquidity/API có thể lệch; Jupiter README là phản ví dụ.
2. RPC trả signature là payment thành công? **Không**, cần status/commitment và error.
3. 1,4 triệu CU là ngân sách phải đặt cho mọi tx? **Không**, là trần docs; đo luồng thật, định dạng v1 có fee model riêng.
4. Có thể cộng giờ của hai agent rồi chia đôi ETA? **Không**, phải xét dependencies, availability và integration.
5. Một paper dự báo đúng công trình xây dựng cho phép nói hackathon có 80% thành công? **Không**, khác miền và không có dữ liệu hiệu chỉnh.

## 6. Nguồn và độ tin cậy

Ngày đọc/quét của tất cả mục: **17/11/2026**. Nguồn kỹ thuật là maintainer/docs chính thức; anecdote không làm căn cứ xác nhận API.

- [A — Anchor 1.2.2][A], [I — maintainer issue #3629][I], [C — constraints][C].
- [T — Solana confirmation][T], [R — clusters][R], [F — fees][F], [W — MWA spec][W].
- [J — Jupiter Lend integration README][J], [P — Pyth Pro Solana docs][P].
- [RC — Flyvbjerg 2013 abstract][RC]: nghiên cứu cũ và khác miền; dùng làm lý do kiểm tra reference class, không lấy hệ số dự báo.
- [HackRep, arXiv 2026](https://arxiv.org/abs/2603.29672), [MSR 2026 entry](https://2026.msrconf.org/details/msr-2026-data-and-tool-showcase-track/2/HackRep-A-Large-Scale-Dataset-of-GitHub-Hackathon-Projects): dữ liệu nghiên cứu continuation; chưa đọc/phân tích toàn dataset.
- [L — Linux.do 48h retrospective][L], [S — Superteam Argentina][S]: trải nghiệm/tổng hợp, không định lượng năng suất đội.

### Nhật ký quét nguồn mở rộng (cùng ngày)

| Nhóm / truy vấn đã dùng | Kết quả và giới hạn |
| --- | --- |
| Docs/blog Colosseum, Solana, Superteam; `hackathon judging criteria 2025 2026` | Các nguồn chính thức trong 015 và bảng trên đã đọc; tách sự kiện và thời điểm |
| Google Scholar `hackathon project continuation Nolte` | Trang tìm kiếm không truy cập được bằng công cụ; không giả đã đọc kết quả Scholar |
| arXiv `hackathon continuation`, `reference class forecasting` | Đọc abstract HackRep và Flyvbjerg, ghi giới hạn |
| ACM DOI `10.1145/3793302.3793305` | Công cụ không truy cập được; dùng bản tác giả arXiv + trang MSR, không tuyên bố đọc bản ACM |
| IEEE `software effort estimation`, document `10989401` | Search thấy abstract; open trả HTTP 418, chưa đọc toàn bài, không dùng kết quả mô hình |
| Journal/PMC `hack your organizational innovation` | Metadata bài Heller et al. 2023/DOI thấy được; lần tìm nội dung lại CAPTCHA. Không rút hiệu ứng định lượng từ phần chưa đọc |
| GitHub issues/discussions `anchor build Agave 2025`, `Jupiter devnet IDL` | Đọc issue #3629/README; không chạy workaround lịch sử |
| Reddit `Colosseum judges` | Có bài [dẫn workshop 2025](https://www.reddit.com/r/solana/comments/1khwqiq); quay về bài BTC, không dùng votes làm bằng chứng nhu cầu |
| X / YouTube `Solana hackathon judge submission` | Workshop được link từ BTC; [bài Superteam](https://superteam.ar/stack/hackathon) dẫn thread Josip. Chưa đọc được toàn thread/nghe video; không bịa transcript |
| Hacker News `hackathon judge` | Tìm thấy [thảo luận về bất nhất đánh giá](https://news.ycombinator.com/item?id=48946010); chưa kiểm chứng claim trong thread, không làm căn cứ điểm |
| Zhihu / Juejin / CSDN `Solana 黑客松 复盘`, `Solana 开发 坑` | Đã tìm bằng tiếng Trung, chưa tìm được nguồn trực tiếp đủ mạnh để đưa claim kỹ thuật vào note; không đồng nhất “không có nguồn dùng được” với “website bị chặn” |
| V2EX `黑客松 复盘`, `Solana 黑客松` | Kết quả phần lớn tuyển dụng/trải nghiệm nghề nghiệp; không lấy làm nghiên cứu latency hoặc tỷ lệ lỗi |
| Linux.do `黑客松 复盘` | Đọc [retrospective][L], giới hạn anecdote đã nêu |
| Bilibili `Solana 训练营` | Mở [video OpenBuild](https://www.bilibili.com/video/BV1ty6jBZE2D/) trả HTTP 412; chỉ có metadata tìm kiếm, chưa xem |

## 7. Điểm chưa kiểm chứng và bước tiếp theo

Chưa có giờ làm của người dùng, môi trường đã build, wallet/device thật, CU/latency và devnet availability. Không suy “không mainnet” thành tự động có thanh khoản hoặc program đối tác trên devnet. Sau khi người dùng chọn ý tưởng và cho phép cài, chạy spike đúng dependency rồi chỉnh kiến trúc/điểm.

### Bài học / lỗi đã gặp

| Bẫy đã gặp khi nghiên cứu | Xử lý |
| --- | --- |
| URL confirmation trong note nền timeout | Tìm trang cookbook hiện hành, không suy cơ chế đã đổi vì URL lỗi |
| Pyth URL Core redirect sang Pro | Ghi đúng tài liệu đã đọc; chưa kết luận tương thích API cũ |
| Một bộ IDL có cả address devnet | Đọc warning trong README; địa chỉ không xác nhận đồng bộ deployment |
| Search trả nhiều bản sao tiếng Trung | Ưu tiên tác giả/maintainer, ghi truy vấn chưa có nguồn đủ mạnh |

[A]: https://www.anchor-lang.com/docs/updates/release-notes/1-2-2
[I]: https://github.com/otter-sec/anchor/issues/3629
[C]: https://www.anchor-lang.com/docs/references/account-constraints
[J]: https://github.com/jup-ag/jupiter-lend
[T]: https://solana.com/developers/cookbook/transactions/confirmation
[R]: https://solana.com/docs/references/clusters
[F]: https://solana.com/docs/core/fees
[P]: https://docs.pyth.network/pro/use-prices-on-blockchain/solana
[W]: https://solana-mobile.github.io/mobile-wallet-adapter/spec/spec.html
[RC]: https://arxiv.org/abs/1302.3642
[L]: https://linux.do/t/topic/1550346
[S]: https://superteam.ar/stack/hackathon

## Tiêu chí ứng viên cho bộ chấm

| Tiêu chí | Định nghĩa | Vì sao | Nguồn (đọc 17/11/2026) |
| --- | --- | --- | --- |
| Khả thi theo phạm vi | Critical path, ngân sách, người làm, bản thu nhỏ giữ giá trị | Ngăn kế hoạch to nhưng không thể tích hợp | [RC][RC], [S][S]; phương pháp áp dụng tự đề xuất |
| Dependency có bằng chứng | D0–D3, đúng cluster/version, fallback có thể hoạt động | SDK tồn tại chưa đủ | [J][J], [I][I], [P][P] |
| An toàn theo thiết kế | Authority/invariant/lifecycle + test âm; không có critical risk chưa giảm thiểu | Bảo vệ tiền/quyền và tính đúng | [C][C], 007 |
| Khả năng phục hồi demo | Reject ký, expiry, RPC timeout, retry/idempotency và đọc lại state | Happy path không đại diện điều kiện demo | [T][T], [R][R] |
| Độ tin cậy bằng chứng | Phân biệt kế hoạch/docs/spike/end-to-end; U khác lỗi thật | Không tự nâng điểm bằng lời hứa | [I][I], HackRep; quy tắc đánh giá nội bộ |
