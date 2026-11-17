# 011 — Lộ trình học Solana từ 17 đến 26/11/2026

> Ngày lập/kiểm tra: 2026-11-17 (Asia/Ho_Chi_Minh). Phạm vi: chuẩn bị kiến thức, chưa chọn ý tưởng hay viết code sản phẩm.
> Trạng thái: lịch đề xuất; **chưa đánh dấu bài tập hoặc lab nào đã hoàn thành**. Mốc hackathon 27–29/11/2026 do người dùng cung cấp, chưa xác minh độc lập thể lệ/lịch.

## 1. Mục tiêu và điều cần nhớ

Đến hết **26/11/2026**, có thể giải thích account model, review một instruction Anchor nhỏ, chọn đúng nguồn/version và mô tả cách test/deploy devnet có kiểm soát. Mục tiêu là nền tảng để chọn thiết kế sau này, không phải phải có dApp trong mười ngày.

Giả định **90 phút/ngày**: 25 phút đọc, 40 phút làm bài, 15 phút tự giải thích không nhìn tài liệu, 10 phút ghi chỗ chưa hiểu. Ngày khó có thể thêm 30 phút. Nếu chỉ có 45 phút, ưu tiên bài tập và đáp án ở mục 4; bỏ phần mở rộng, không bỏ kiểm tra quyền.

Toàn bộ lịch có đường học **trên giấy/Markdown**, không cần cài, ví hay RPC. Lab thực hành chỉ là lựa chọn cho phiên riêng sau khi người dùng đồng ý cài đặt và chốt sandbox/signers. Không dùng việc chưa cài làm lý do dừng hoàn thiện tài liệu.

## 2. Phiên bản và bằng chứng kiểm tra

| Thành phần | Baseline cho lịch học | Mức kiểm chứng |
| --- | --- | --- |
| Thời gian | 17–26/11/2026, đủ **10 ngày**, Asia/Ho_Chi_Minh | Lịch tự soạn theo mốc người dùng |
| Anchor / Agave / platform-tools / SBPF | **1.2.2 / 4.1.2 / v1.57 / v3** | Theo release notes; chưa cài/build |
| Rust host | **1.100.0** là phương án để đánh giá; Anchor MSRV khai báo 1.89 | Metadata chính thức; chưa xác nhận cả dependency graph |
| Node / pnpm / Codex CLI | **24.22.2 / 10.28.0 / 0.169.0-alpha.11.1** | Đã kiểm kê version trong [003](003-solana-toolchain.md) |
| Test/codegen | LiteSVM 0.15.0 theo Anchor template; Surfpool 1.5.0 theo CI; Codama và adapter xem 004 | Đọc nguồn, chưa chạy |
| AI tooling | Foundation skill 2.8.0 tại snapshot đã ghi; Helius MCP 3.1.0; Antigravity version chưa rõ | Xem bằng chứng/giới hạn ở [010](010-solana-ai-tooling.md) |

Không tự nâng theo `latest` trong thời gian học. Khi bắt đầu lab, kiểm tra lại release và ghi version thực dùng; chỉ sửa bảng thành “đã chạy” sau khi có log. Nguồn baseline: [Anchor 1.2.2](https://www.anchor-lang.com/docs/updates/release-notes/1-2-2).

## 3. Kiến thức chính

### Lịch mười ngày

| Ngày | Chủ đề và tài liệu | Việc cần làm trong buổi | Sản phẩm để tự review |
| --- | --- | --- | --- |
| **17/11/2026** | Account model, EVM ↔ Solana — [002](002-solana-basics.md) | Vẽ wallet/program/data account; ghi owner và authority, giải thích rent | Một sơ đồ và lời giải thích 60 giây |
| **18/11/2026** | Transaction, signer, CU, fee, cluster — 002 | Phân biệt instruction/transaction, atomicity và confirmation; tính phí legacy/v0 | Một trace giao dịch hai instruction và phép tính phí |
| **19/11/2026** | PDA, seeds, bump, CPI — 002 + [007 S04/S09](007-solana-program-security.md) | Thiết kế seeds không mơ hồ; vẽ CPI tạo account; liệt kê quyền mỗi bên | Sơ đồ account/PDA/CPI và ba tình huống sai |
| **20/11/2026** | Toolchain — [003](003-solana-toolchain.md) | Đọc bảng version; phân biệt Rust host/SBF; phân loại lệnh chỉ đọc/cài/ghi chain | Phiếu kế hoạch cài và ba cách khoanh vùng lỗi; chưa cài |
| **21/11/2026** | Anchor macros/constraints — [004](004-anchor-a-to-z.md) | Đọc counter theo initialize/increment; tính space; giải thích error/event | Annotation trên giấy: constraint nào bảo vệ invariant nào |
| **22/11/2026** | Quyền và identity — 007 S01–S04, S09–S10 | Review signer, owner, substitution, seeds, CPI target và type | Sáu negative tests, mỗi test đổi đúng một yếu tố |
| **23/11/2026** | State lifecycle và số học — 007 S05–S08, S11–S12 | Review overflow, panic, re-init, close, alias, stale state; chọn VM harness | Sáu test nữa và bảng state trước/sau |
| **24/11/2026** | IDL, Codama, client và integration — 004 | Vẽ pipeline codegen; phân biệt LiteSVM/Mollusk/Surfpool/devnet; xử lý lỗi RPC | Test plan nối client tới program, có success và failure |
| **25/11/2026** | AI tooling + deploy/verify trên giấy — [009](009-tips-codex-antigravity.md), [010](010-solana-ai-tooling.md), 004 mục D | Review config MCP, source labels; viết runbook devnet và nhận diện bước cần cho phép | Một prompt có tiêu chí đạt và runbook chưa thực thi |
| **26/11/2026** | Tổng hợp và diễn tập | Làm đề mục 5, trình bày 3 phút, chọn ba khoảng trống cần ôn | Bản giải thích cho giám khảo, danh sách bằng chứng/chưa kiểm chứng |

### Mốc học trước khi chuyển tiếp

- Sau 19/11: giải thích đúng owner/authority/signer và “tính PDA chưa tạo account”. Nếu còn nhầm, làm lại sơ đồ trước khi đọc thêm SDK.
- Sau 23/11: mỗi lỗi bảo mật có một input đối kháng và invariant phải giữ; không chỉ nói “cần check thêm”.
- Sau 26/11: nói rõ kiến thức đã hiểu và lab chưa chạy. Chưa có build/test thực tế thì không giới thiệu là “program đã được kiểm thử”.

Đây là tiêu chí học tự soạn, không phải yêu cầu hoặc thang điểm của hackathon.

## 4. Ví dụ hoặc quy trình tối thiểu

### Bài tập từng ngày và đáp án gợi ý

| Ngày | Bài tập nhỏ, không cần cài | Đáp án/tiêu chí đạt |
| --- | --- | --- |
| **17/11** | Alice có profile account do program P quản lý; Bob biết địa chỉ. Ai được sửa data và Alice chứng minh quyền ra sao? | Runtime cho **P** sửa data thuộc P, với điều kiện runtime hợp lệ. P phải kiểm tra authority là Alice và signer. Biết địa chỉ không đủ quyền. Phân biệt tiền storage với phí giao dịch. |
| **18/11** | Hai instruction trong một transaction: init thành công, update thất bại. Với legacy/v0, limit 300.000 CU và giá 2.000 micro-lamports/CU, tính priority fee. | State của cả transaction rollback; phí vẫn có thể bị thu. Priority fee **600 lamports**, tính theo limit. RPC trả signature chưa chứng minh confirmed. Không áp công thức CU-price này cho v1. |
| **19/11** | So seeds `["ab", "c"]` với `["a", "bc"]`. Thiết kế PDA order theo user và số thứ tự. Có cần private key PDA không? | Tránh ranh giới chuỗi mơ hồ bằng prefix cố định + pubkey + `u64` encoding cố định. Canonical bump lúc init; program ID tham gia derivation. PDA không có private key; `invoke_signed` cấp signer cho PDA đúng của caller. |
| **20/11** | Máy có Rust host mới nhưng SBF báo compiler cũ. Lập kế hoạch cài và phân loại `node --version`, `npx skills add`, `anchor init`, `solana airdrop`. | Kiểm tra **platform-tools** và release cohort. Xem version Node là kiểm kê; `npx` có thể tải/chạy package; `anchor init` có thể tạo keypair; airdrop thay đổi devnet. Ba thao tác sau chưa được chạy trong mục tiêu này. |
| **21/11** | Counter chứa pubkey authority, `u64 value`, `u8 bump`; dùng discriminator mặc định 8 byte. Tính space và giải thích `has_one` so với `Signer`. | **32 + 8 + 1 + 8 = 49 byte**. `has_one` liên kết field với key; `Signer` kiểm tra signer privilege. Cần chứng minh cả quyền ký và quan hệ. `mut` không tự cấp authority. |
| **22/11** | Viết sáu ca: thiếu chữ ký, owner sai, vault user khác, seeds sai, CPI program giả, type sai. | Mỗi ca chỉ rõ check tương ứng: signer, owner, relation, seeds, program ID/executable, discriminator. Typed account đúng owner/type vẫn cần đúng identity. State trước/sau không đổi khi bị từ chối. |
| **23/11** | Giải thích vì sao `checked_add`, `init`, `close`, chống alias và `reload()` giải các vấn đề khác nhau. Thêm ca input rỗng. | Overflow phải trả lỗi; `init` không reset account đang có nhưng chưa chống close→recreate; close đúng authority/recipient; vai trò phải khác không được alias; reload đọc state sau CPI. Input rỗng trả error thay vì panic. |
| **24/11** | IDL đổi arg từ `u64` sang kiểu khác nhưng client chưa regenerate. Nêu cách phát hiện mà không deploy. | Đối chiếu IDL/generated types, test encode/decode và program ID; compile/test client đúng SDK. LiteSVM/Mollusk kiểm tra program, integration kiểm tra cả client/RPC. Không trộn tùy ý Anchor web3.js 1.x với Kit types. |
| **25/11** | Một config Helius bỏ network/read-only; AI nói “đã verify nên an toàn”. Nêu lỗi và runbook đúng. | Default mainnet là không phù hợp; chỉ chọn devnet/read-only và tool cần dùng sau khi được phép cấu hình. Verify chỉ so artifact/source theo quy trình, không chứng minh an toàn. Test trước, pin source/build, deploy đúng artifact, verify đúng devnet. |
| **26/11** | Trình bày counter trong 3 phút: state, quyền, transaction/PDA, test, giới hạn. Nhờ người khác đóng vai Bob. | Trả lời được Bob không ký Alice nhưng có đúng key; account cùng type sai user; overflow; close→recreate. Không gọi snippet là sản phẩm đã deploy; nêu ba khoảng trống thật và cách kiểm chứng. |

### Nhánh lab có điều kiện

**Chỉ tham khảo — chờ đồng ý trước khi chạy.** Không có lab nào dưới đây được thực hiện trong phiên nghiên cứu:

| Khi có đủ điều kiện | Lab nhỏ có thể làm sau này | Nếu chưa được phép/thiếu công cụ |
| --- | --- | --- |
| Sau 20/11, đã duyệt installer và tải phụ thuộc | Cài đúng bộ 003; ghi OS/arch/version và build log | Review kế hoạch cài, giải ba lỗi giả định từ 003 |
| Sau 23/11, đã chốt sandbox, cách xử lý keypair và test harness | Chuyển counter 004 thành sandbox; chạy một success và ít nhất ba negative tests | Viết fixtures/state trước/sau, error mong đợi; không tạo project |
| Sau 24/11, có local setup được duyệt | Generate client, chạy integration với Surfpool offline hoặc local validator đã cấu hình | Vẽ request/response flow, xác định điểm lệch IDL, signature, confirmation |
| Sau 25/11, đã cho phép MCP hoặc devnet tương ứng | Thử docs MCP; hoặc devnet smoke/verify với signer có sẵn và artifact đã duyệt | Review config/runbook bằng checklist; không kết nối server, airdrop hay deploy |

Chấp thuận cài một công cụ không mặc nhiên cho phép tạo ví, tải mọi Docker image, ký transaction hoặc deploy. Không dùng ví tài sản thật. Trong mục tiêu hiện tại, **không tạo keypair**, kể cả nháp; không đặt `programs/`/`app/` ở root repo.

### Phiếu ghi kết quả học

Mẫu tự soạn để điền sau buổi học, không chứa kết quả giả định:

```text
Ngày / thời lượng:
Note, version và nguồn đã đọc:
Tôi giải thích được:
Bài tập đã làm và đáp án của tôi:
Lệnh thực sự đã chạy (nếu có), kết quả và nơi lưu log:
Chỉ mới đọc/chưa chạy:
Câu còn vướng và bước tiếp theo:
```

## 5. Tự kiểm tra

Đề tổng hợp ngày 26/11, tự trả lời trước khi xem cột cuối. Mỗi câu một điểm; đề xuất đạt **ít nhất 8/10**, đồng thời phải trả lời đúng các câu về quyền, cluster và độ tin cậy bằng chứng (1, 2, 8, 9, 10).

| # | Câu hỏi | Đáp án ngắn |
| --- | --- | --- |
| 1 | Owner có phải người giữ ví không? | Không; account owner là program. Authority là quy tắc/state nghiệp vụ |
| 2 | Signer có đủ quyền sửa mọi vault không? | Không; cần quan hệ với vault và các invariant khác |
| 3 | PDA đã được suy ra nhưng fetch không thấy account: có mâu thuẫn không? | Không; derivation không tạo account |
| 4 | Callee CPI tự tăng quyền writable được không? | Không; runtime ngăn privilege escalation |
| 5 | Transaction fail sau khi log event: client nên báo thành công không? | Không; kiểm tra transaction result và state/commitment |
| 6 | `u64::MAX + 1` nên xử lý thế nào? | `checked_add` trả lỗi, state không wrap |
| 7 | Unit test VM pass có thay integration client/RPC không? | Không; các lớp kiểm tra khác nhau |
| 8 | Server read-only có chắc không truy vấn mainnet không? | Không; quyền ghi và network là hai cấu hình riêng |
| 9 | Bytecode verified có nghĩa đã audit bảo mật không? | Không; cần review invariants và tests |
| 10 | Chỉ đọc release notes có được nói build/test pass không? | Không; cần thực thi và bằng chứng kết quả |

Nếu chưa đạt, dùng 30 phút ôn đúng nhóm câu sai rồi diễn giải lại. Không bù phần kiến thức yếu bằng việc cài thêm công cụ hoặc deploy gấp.

## 6. Nguồn và độ tin cậy

- Chính thức: [Solana accounts](https://solana.com/docs/core/accounts), [PDA](https://solana.com/docs/core/pda), [CPI](https://solana.com/docs/core/cpi), [fees](https://solana.com/docs/core/fees).
- Maintainer: [Anchor release 1.2.2](https://www.anchor-lang.com/docs/updates/release-notes/1-2-2), [constraints](https://www.anchor-lang.com/docs/references/account-constraints), [verifiable builds](https://www.anchor-lang.com/docs/references/verifiable-builds).
- Bằng chứng chi tiết và giới hạn nằm ở [002](002-solana-basics.md), [003](003-solana-toolchain.md), [004](004-anchor-a-to-z.md), [007](007-solana-program-security.md), [009](009-tips-codex-antigravity.md), [010](010-solana-ai-tooling.md).

Truy cập/đối chiếu 17/11/2026. Lịch, thời lượng, bài tập và ngưỡng tự đánh giá là đề xuất của người viết, không được công bố bởi Solana hoặc ban tổ chức. Không có nguồn trước 2025 được dùng làm đặc tả toolchain hiện tại.

## 7. Điểm chưa kiểm chứng và bước tiếp theo

Chưa biết thời lượng học thật, mức Rust hiện có, client Antigravity và lựa chọn ví/devnet của người dùng. Lịch không phụ thuộc các câu trả lời đó để bắt đầu phần đọc. Chưa xác minh độc lập lịch/thể lệ hackathon; cần tài liệu ban tổ chức trước khi quyết định phạm vi dự thi.

Bước tiếp theo là làm bài ngày 17/11, tự giải thích owner/authority rồi ghi câu còn vướng. Nếu muốn thực hành, chốt riêng danh sách cài và phạm vi sandbox/signers. Chưa có ý tưởng sản phẩm không phải khoảng trống cần tự lấp bằng code trong repo Taskbar Hero.
