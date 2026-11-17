# 010 — AI tooling cho Solana: MCP, skills và cách kết nối

> Ngày kiểm tra: 2026-11-17 (Asia/Ho_Chi_Minh). Phạm vi: đánh giá và cấu hình tham khảo cho Codex/Antigravity.
> Trạng thái: đã đọc docs/source/metadata; **chưa cài skill/package, thêm MCP, cấp API key hoặc gọi tool của các server này**.

## 1. Mục tiêu và điều cần nhớ

Chọn công cụ theo việc cần làm: **skill** cung cấp quy trình và kiến thức đóng gói; **MCP** kết nối tới dữ liệu/hành động của một server. Cả hai có thể giúp tìm nguồn, nhưng không thay thế hiểu biết account/authority và test ở [004](004-anchor-a-to-z.md), [007](007-solana-program-security.md).

Đề xuất cho giai đoạn học: ưu tiên Solana Developer MCP và một bản Foundation skill đã review; thêm Helius khi có câu hỏi cần API/dữ liệu của họ. Đây là đánh giá của người viết từ phạm vi công cụ, chưa phải benchmark. Mọi lệnh cài/cấu hình trong note **chỉ tham khảo — chờ đồng ý trước khi chạy**; mục tiêu tài liệu không cần cài để hoàn thành.

## 2. Phiên bản và bằng chứng kiểm tra

| Thành phần | Phiên bản hoặc mốc tài liệu | Mức kiểm chứng |
| --- | --- | --- |
| Codex CLI / Node trên máy | **0.169.0-alpha.11.1 / 24.22.2** | Đã hỏi version; xem [003](003-solana-toolchain.md) |
| Solana Developer MCP | Endpoint `https://mcp.solana.com/mcp`; server version **chưa kiểm chứng** | Trang chính thức ngày 17/11 liệt kê 5 tools; chưa handshake hoặc gọi tool |
| Foundation `solana-dev` | Metadata **2.8.0**, snapshot **c9da2624cc6baca5c8c2123ea50d92ef19f1c917**, commit 04/11/2026 | Đọc SKILL.md và references; chưa cài/activate |
| `skills` CLI | **1.9.0**, Node >=22.20 | Đọc npm metadata và reference tại tag; không chạy `npx` |
| `helius-mcp` | **3.1.0** | Đọc npm/source/README; chưa chạy server |
| Helius skills | `svm` metadata **1.2.1**; các skill khác chưa chốt version riêng | Đọc source `main` ngày 17/11; không coi main là snapshot bất biến |
| Antigravity | Version trên máy **chưa kiểm chứng** | Đọc docs MCP/skills hiện hành; chưa xác nhận UI/config thực tế của người dùng |

Foundation skill còn có matrix ghi Anchor 1.2.1 là latest, trong khi [release Anchor 1.2.2](https://www.anchor-lang.com/docs/updates/release-notes/1-2-2) đã mới hơn. Dùng bộ phiên bản có căn cứ ở 003; skill chính thức vẫn có thể chậm cập nhật. Không suy ra toàn bộ API trong skill đã được kiểm thử trên máy này.

## 3. Kiến thức chính

### So sánh để chọn

| Công cụ | Khi đáng dùng | Giới hạn/rủi ro cần kiểm tra |
| --- | --- | --- |
| [Solana Developer MCP](https://mcp.solana.com/) | Tra docs, tìm API và nhận gợi ý sửa Rust | Server từ xa; không gửi secret. Gợi ý autofixer cần review/test |
| [Foundation solana-dev](https://github.com/solana-foundation/solana-dev-skill) | Quy trình phát triển, references theo lớp client/program/test/security | Có lựa chọn stack riêng và mục auto-install MCP; phải kiểm soát theo yêu cầu phiên |
| [Helius MCP](https://github.com/helius-labs/core-ai/tree/main/helius-mcp) | Khi cần dữ liệu/API Helius hoặc kiến thức qua `heliusKnowledge` | Server đầy đủ có quyền ghi và mặc định mainnet; xem cấu hình hạn chế ở mục 4 |
| [Helius skills](https://github.com/helius-labs/core-ai/tree/main/helius-skills) | `svm` cho kiến trúc; `helius` cho dịch vụ Helius | Script cài hướng Claude; phải chọn đúng host và đọc prerequisites từng skill |
| [Skill web3.js migration](https://github.com/solana-foundation/solana-web3.js/blob/main/skills/web3js-v1-to-v3-migration/SKILL.md) | Chỉ khi thật sự có code web3.js v1 cần chuyển v3 | Foundation references có dẫn tới skill; chưa review toàn bộ nội dung/version, chưa cần cho buổi học này |

### Solana MCP: nguồn sống và kiểm tra program

Server dùng Streamable HTTP, không cần API key. Các tên tool được trang công bố là `list_sections`, `get_documentation`, `Solana_Documentation_Search`, `Solana_Expert__Ask_For_Help`, `program_autofixer`. Tool cuối phân tích Rust Anchor/Pinocchio và đề xuất sửa. [Solana MCP](https://mcp.solana.com/)

**Đánh giá của người viết:** dùng truy xuất tài liệu trước; chỉ gửi đoạn code phù hợp khi đã rõ phạm vi dữ liệu. “Không tìm thấy lỗi” không phải chứng nhận audit. Nếu tool đề xuất thay seeds/authority, quay lại invariant và negative tests; không tự áp mọi patch hoặc lặp vô hạn chỉ để đạt một cờ kết quả.

### Foundation skill: đọc cả phần thực thi

Snapshot đã đọc có hướng dẫn tự cài MCP nếu chưa thấy tool, dùng `npx mcp-remote` cho Codex, và gợi ý prefix `NO_DNA=1` cho CLI. Đây là chỉ dẫn của skill, **không phải quyền cài đặt được cấp trong phiên này**. Kết nối HTTP trực tiếp được trang Solana MCP hiện tại hỗ trợ nên không cần thêm bridge npm cho client có HTTP. [SKILL.md tại snapshot](https://github.com/solana-foundation/solana-dev-skill/blob/c9da2624cc6baca5c8c2123ea50d92ef19f1c917/skills/solana-dev/SKILL.md)

**Đề xuất cho phiên thực hành:** giữ điều kiện xin phép cài, không tự tạo signer và không gọi mainnet. Review references liên quan trước khi cho phép thực thi. Các guardrails của snapshot về ký giao dịch và dữ liệu on-chain không làm mất nhu cầu kiểm tra scripts, config và nguồn upstream. Không sửa AGENTS.md trong phiên này.

### Helius: phân biệt docs MCP với server vận hành

[Repo Helius core-ai](https://github.com/helius-labs/core-ai) phân biệt docs MCP trên website với package `helius-mcp` có công cụ vận hành. Không giả định hai server có cùng quyền. README package ghi mặc định **mainnet-beta**, đổi bằng `HELIUS_NETWORK=devnet`.

`--read-only` hoặc `HELIUS_MCP_READ_ONLY=1` loại các action ghi như transfer, tạo keypair, signup/billing, sửa webhook và `setHeliusApiKey`; API key phải được cấp qua environment nếu action cần nó. Đây là cam kết trong README, **chưa được kiểm thử ở đây**. Read-only vẫn có thể gửi dữ liệu truy vấn tới dịch vụ và tiêu thụ quota. [Helius MCP README](https://github.com/helius-labs/core-ai/blob/main/helius-mcp/README.md)

**Mâu thuẫn tài liệu đã thấy:** README thư mục skills mô tả `svm` dùng nguồn công khai, nhưng [SKILL.md của svm](https://github.com/helius-labs/core-ai/blob/main/helius-skills/svm/SKILL.md) yêu cầu Helius MCP và route qua `heliusKnowledge`. Phân biệt **không cần API key cho knowledge** với **không cần MCP**. Installer mặc định dùng `.claude/skills`; không chạy installer đó rồi kết luận đã cấu hình Codex/Antigravity.

## 4. Ví dụ hoặc quy trình tối thiểu

**Toàn bộ ví dụ dưới đây chưa chạy, chỉ tham khảo — chờ đồng ý trước khi cài hoặc lưu config.** Không có file cấu hình thật nào được tạo. Review phạm vi project/global và nội dung sẽ thay đổi trước khi áp dụng.

### A. Solana Developer MCP cho Codex

Lệnh được trang Solana hướng dẫn:

```sh
codex mcp add solana-mcp --url https://mcp.solana.com/mcp
codex mcp list
```

Nếu chọn config theo project, dùng `.codex/config.toml`; cấu hình cá nhân ở `~/.codex/config.toml`. Đây là phương án thay cho lệnh add, không cần làm cả hai:

```toml
[mcp_servers.solana_mcp]
url = "https://mcp.solana.com/mcp"
enabled_tools = ["list_sections", "get_documentation", "Solana_Documentation_Search", "Solana_Expert__Ask_For_Help"]
```

Allowlist trên là lựa chọn cho buổi học chỉ đọc. Khi cần review Rust, cân nhắc thêm `program_autofixer` sau khi đã chốt dữ liệu được gửi. `mcp list` chỉ cho thấy cấu hình; cần kết nối và gọi thử mới xác nhận server hoạt động. Cấu trúc TOML/allowlist theo [OpenAI MCP](https://learn.chatgpt.com/docs/extend/mcp); endpoint/lệnh theo [Solana MCP](https://mcp.solana.com/).

### B. Solana Developer MCP cho Antigravity

Docs hiện tại dùng `.agents/mcp_config.json` theo workspace hoặc `~/.gemini/config/mcp_config.json` cho global. Trong IDE: **MCP Servers → Manage MCP Servers → View raw config**. Gộp entry vào `mcpServers` hiện có, không ghi đè server khác. [Google MCP](https://antigravity.google/docs/mcp)

```json
{
  "mcpServers": {
    "solana-docs": {
      "serverUrl": "https://mcp.solana.com/mcp",
      "enabledTools": [
        "list_sections",
        "get_documentation",
        "Solana_Documentation_Search",
        "Solana_Expert__Ask_For_Help"
      ]
    }
  }
}
```

`serverUrl` và `enabledTools` là schema của Antigravity, không chép tên key TOML của Codex sang JSON. Version/UI người dùng chưa được xác nhận; chỉ ghi connected sau khi thực sự kết nối và thấy tool.

### C. Foundation skill cho cả hai client

Lệnh upstream được yêu cầu nghiên cứu:

```sh
# Chưa chạy; có thể tải/chạy npm package và ghi thư mục skill.
npx skills add solana-foundation/solana-dev-skill
```

Phương án có pin, đích project, chọn đúng một skill và agent; **là lựa chọn thay thế, không chạy nối tiếp cả hai**:

```sh
npx skills@1.9.0 add solana-foundation/solana-dev-skill@c9da2624cc6baca5c8c2123ea50d92ef19f1c917 --skill solana-dev --agent codex --copy
```

CLI reference 1.9.0 mô tả pin tag/commit, `--skill`, `--agent`, `--copy`; mặc định project, `-g` mới là global. Không thêm `--all`/`--yes`. Node máy này đáp ứng engines, nhưng lệnh chưa được kiểm thử. [skills CLI reference](https://github.com/vercel-labs/skills/blob/v1.9.0/docs/commands.md)

Kiểm tra kết quả mong đợi:

```text
.agents/skills/solana-dev/
  SKILL.md
  references/
```

Codex đọc project `.agents/skills/`; Antigravity hiện cũng dùng thư mục này nên có thể dùng cùng bản đã review, không cần thêm bản global. Nếu cài thủ công sau khi được phép, copy **cả** `skills/solana-dev/`, không chỉ SKILL.md. [Foundation installation](https://github.com/solana-foundation/solana-dev-skill#installation), [OpenAI skills](https://learn.chatgpt.com/docs/build-skills), [Google skills](https://antigravity.google/docs/skills)

Antigravity còn hỗ trợ legacy `.agent/skills`, nhưng docs hiện tại ưu tiên `.agents/skills`; personal path là `~/.gemini/config/skills/`. Kiểm tra host nhận skill và references trước khi dùng. Việc cài skill không có nghĩa đã được phép làm các bước auto-install bên trong.

### D. Helius MCP: mẫu chỉ đọc kiến thức, network devnet

**Cấu hình đề xuất của người viết, chưa kiểm thử.** Bắt đầu chỉ cho phép `heliusKnowledge`; khi cần blockchain data, review action/cluster và mở thêm tool cụ thể. Không dùng signup, billing, keygen hoặc gửi transaction trong bài học này.

Codex, entry TOML:

```toml
[mcp_servers.helius_study]
command = "npx"
args = ["--yes", "helius-mcp@3.1.0", "--read-only"]
enabled_tools = ["heliusKnowledge"]
env_vars = ["HELIUS_API_KEY"]

[mcp_servers.helius_study.env]
HELIUS_NETWORK = "devnet"
HELIUS_MCP_READ_ONLY = "1"
```

`env_vars` chuyển biến đã có trong environment của Codex; không đặt secret vào TOML tracked. Knowledge không cần API key theo `svm` docs; trường forwarding chỉ hữu ích nếu sau này mở action cần key. `npx --yes` phù hợp process stdio không tương tác **sau khi cài/chạy đã được chấp thuận**, không phải bỏ qua bước xin phép hiện tại. Nó có thể tải package khi server khởi động. [OpenAI MCP](https://learn.chatgpt.com/docs/extend/mcp), [Helius README](https://github.com/helius-labs/core-ai/blob/main/helius-mcp/README.md)

Antigravity, entry JSON:

```json
{
  "mcpServers": {
    "helius-study": {
      "command": "npx",
      "args": ["--yes", "helius-mcp@3.1.0", "--read-only"],
      "env": {
        "HELIUS_NETWORK": "devnet",
        "HELIUS_MCP_READ_ONLY": "1"
      },
      "enabledTools": ["heliusKnowledge"]
    }
  }
}
```

Schema stdio/env/allowlist theo [Google MCP](https://antigravity.google/docs/mcp). Không thêm giá trị API key mẫu vào file project. Cách GUI của người dùng nhận secret chưa được kiểm chứng; nếu mở action cần key, phải xác nhận cơ chế truyền environment/secret của client trước, không đoán cú pháp nội suy.

### E. Helius skills và kiểm tra sau kết nối

Sau khi review source và được phép cài, copy thư mục skill tự chứa (SKILL.md + references) như `helius-skills/svm/` hoặc `helius-skills/helius/` vào `.agents/skills/<tên-skill>/` cho cả Codex/Antigravity. Không dùng script mặc định Claude. Chốt commit nguồn ở thời điểm cài; đọc prerequisites vì skill có thể yêu cầu MCP hoặc API key. [Helius skills](https://github.com/helius-labs/core-ai/tree/main/helius-skills)

Kịch bản kiểm chứng tương lai, không phải kết quả đã đạt:

1. Kiểm tra danh sách server và tools thực tế có khớp allowlist không; kết nối lỗi thì không bật thêm quyền để “thử cho được”.
2. Hỏi một câu có thể đối chiếu độc lập, ví dụ owner khác authority thế nào; yêu cầu link tài liệu rồi tự mở nguồn.
3. Kiểm tra skill được nhận cùng references, và yêu cầu “không cài/không mainnet” vẫn được tuân thủ.
4. Nếu mở công cụ dữ liệu Helius sau này: dùng public address devnet có sẵn, xác nhận cluster và action hỗ trợ devnet. Không chuyển sang mainnet khi endpoint devnet thiếu tính năng.
5. Ghi version, tool được gọi, kết quả, lỗi và dữ liệu đã gửi. Nếu bỏ thử nghiệm, gỡ đúng entry/skill mới thêm; giữ cấu hình khác.

## 5. Tự kiểm tra

1. Cài skill có đồng nghĩa đã kết nối server MCP? **Không.** Một bên là nội dung/quy trình, một bên là kết nối công cụ.
2. Foundation skill yêu cầu auto-install nhưng người dùng cấm cài chưa xin phép: làm gì? **Giữ yêu cầu người dùng**, ghi bước cài để duyệt sau.
3. Helius read-only có tự chọn devnet không? **Không**; cấu hình network riêng và kiểm tra thực tế trước truy vấn chain.
4. `svm` không cần API key có nghĩa không cần Helius MCP? **Không theo SKILL.md đã đọc**; nó dùng knowledge qua MCP.
5. Bài tập: sửa trên giấy config Helius thiếu network và không có read-only. **Đáp án:** pin package, thêm devnet + read-only, allowlist theo nhu cầu và tách secret khỏi file tracked; không chạy config.
6. Autofixer báo sạch có thay negative tests không? **Không**; xem checklist 007 và hành vi state trước/sau trong test plan.

## 6. Nguồn và độ tin cậy

- Chính thức Solana: [MCP setup/tool catalog](https://mcp.solana.com/); trang sống ngày 17/11/2026, không có server version đã xác minh.
- Solana Foundation: [README](https://github.com/solana-foundation/solana-dev-skill), [SKILL.md snapshot 2.8.0](https://github.com/solana-foundation/solana-dev-skill/blob/c9da2624cc6baca5c8c2123ea50d92ef19f1c917/skills/solana-dev/SKILL.md), [routing tới migration skill](https://github.com/solana-foundation/solana-dev-skill/blob/c9da2624cc6baca5c8c2123ea50d92ef19f1c917/skills/solana-dev/references/kit-web3-interop.md).
- Maintainer CLI: [commands tag v1.9.0](https://github.com/vercel-labs/skills/blob/v1.9.0/docs/commands.md), [npm skills 1.9.0](https://registry.npmjs.org/skills/1.9.0).
- Helius chính thức: [core-ai](https://github.com/helius-labs/core-ai), [MCP README](https://github.com/helius-labs/core-ai/blob/main/helius-mcp/README.md), [npm helius-mcp 3.1.0](https://registry.npmjs.org/helius-mcp/3.1.0), [skills README](https://github.com/helius-labs/core-ai/blob/main/helius-skills/README.md), [svm SKILL.md](https://github.com/helius-labs/core-ai/blob/main/helius-skills/svm/SKILL.md).
- OpenAI chính thức: [MCP](https://learn.chatgpt.com/docs/extend/mcp), [skills](https://learn.chatgpt.com/docs/build-skills). Google chính thức: [MCP](https://antigravity.google/docs/mcp), [skills](https://antigravity.google/docs/skills).

Các trang/source trên được truy cập 17/11/2026. Nguồn `main` và trang sống có thể đổi sau phiên này; cấu hình tổng hợp do người viết đề xuất chưa chạy. Không dựa trên tutorial trước 2025 để khẳng định schema hiện hành.

## 7. Điểm chưa kiểm chứng và bước tiếp theo

Chưa biết Antigravity version, secret handling thực tế của GUI, MCP handshake/tool schema trả về, API quota của người dùng hoặc tính năng Helius nào khả dụng trên devnet. Chưa cài `skills`, Foundation/Helius skill, npm server hay thay config. Skill migration mới được nhận diện từ reference chính thức, chưa review sâu.

Khi bắt đầu phiên thực hành được đồng ý, review snapshot → chọn scope → cài đúng một công cụ → kiểm tra kết nối/read-only/cluster → ghi bằng chứng. Nếu chưa cài, vẫn làm đầy đủ bài tập lý thuyết của [011](011-solana-learning-roadmap.md). Không tự áp đề xuất AGENTS.md hay auto-install của bên thứ ba.
