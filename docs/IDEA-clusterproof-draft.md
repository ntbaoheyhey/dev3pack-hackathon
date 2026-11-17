# IDEA — ClusterProof (dự phòng, chưa duyệt)

Codex · bản ClusterProof giữ từ17/11/2026, đính chính18/11/2026: **dự phòng, chưa duyệt**. Các ghi chép lựa chọn chính/duyệt trước đây sai và hết hiệu lực; nguồn ở [DECISION](ideas/DECISION.md). Giữ thiết kế và evidence, không tiếp tục triển khai.

## Nói trong một câu

ClusterProof giúp builder kiểm deployment Solana trước khi nối app: chỉ ra chỗ khác với cấu hình đã chọn và chỗ chưa có bằng chứng.

## Người dùng và vấn đề

Builder/reviewer có một program ID, RPC và có thể một IDL nhưng không chắc các artifact cùng deployment. Một client trỏ nhầm cluster, program nâng cấp hoặc IDL không có provenance có thể làm thử nghiệm thất bại và gây tin tưởng sai. Hai nguồn trực tiếp và giới hạn ở [C02 mục1](ideas/codex/02-cluster-proof.md): Jupiter Lend README và báo cáo DeclareProgramIdMismatch năm2024. Không khẳng định mọi SDK/devnet đều lỗi; chưa có interview/pilot.

## User stories

1. Khi tích hợp một program, tôi đưa program ID và manifest đã được đội review để xem field nào khớp/khác/thiếu, thay vì chỉ thấy account tồn tại.
2. Khi chưa có manifest hoặc IDL đáng tin, tôi vẫn xem observation tại slot cụ thể nhưng được báo rõ chưa xác nhận ABI/source.
3. Khi RPC lỗi, tôi giữ input và xem lỗi dễ hiểu; có thể mở snapshot cũ với nhãn replay và thời điểm, không nhầm với live.
4. Khi gửi một review, tôi tải JSON chứa provenance và từng check để người khác đối chiếu cùng evidence.

## Phạm vi MVP

- Devnet, một program loader-v3 mỗi lần; đọc genesis, program và ProgramData cùng context hợp lệ.
- Manifest local có schema/version/provenance, IDL local optional; check expected/observed, upgrade metadata và hashes có meaning.
- Ba màn hình/trạng thái chính: nhập và kiểm, report, replay/export; không ví/login/signing cho product core.
- Trạng thái từng field MATCH/MISMATCH/UNKNOWN; capture ERROR/UNSUPPORTED tách khỏi comparison. ABI UNKNOWN/source NOT_RUN khi chưa verify độc lập.
- Giới hạn input/response, timeout, slot/pointer consistency và thông báo không suy RPC trung thực.

Ngoài phạm vi: mainnet, tạo/upgrade program trong product, ký/gửi transaction, audit, tự kết luận ABI compatible, reproducible build service, multi-program scan, monitor nền và SaaS backend. Phase3 hello Anchor + wallet connection là bài học pipeline riêng, không thêm custody/state vào product core.

## Vì sao dùng Solana

Dữ liệu cần kiểm chính là deployment state của runtime Solana; DB metadata ngoài chain không thay observation mới. Tool không tạo program/PDA của đội vì chưa có state nghiệp vụ cần ghi. Trust còn ở RPC, manifest được reviewer chọn và upgrade authority; MATCH chỉ khớp cấu hình, không là bảo đảm an toàn hoặc source verification.

## Luồng dùng và demo165s

Nhập ID/manifest → kiểm devnet → đọc report có slot/time → mở field mismatch/unknown → export. Khi lỗi: giữ input, giải thích lý do, retry có chủ ý hoặc replay gắn nhãn. User không cần biết cấu trúc ProgramData để làm bước đầu; phần giải thích mở rộng giúp học sinh giải thích được dự án.

Demo: 0–20s vấn đề;20–50s đọc live;50–85s expected manifest sai có nhãn fixture;85–115s thiếu IDL vẫn UNKNOWN;115–140s timeout/replay/export;140–165s giải thích giới hạn. Đây là script để xây, chưa video. Chỉ hiển thị live nếu gọi RPC thật; replay không thay gate live.

## Tiêu chí nghiệm thu và bằng chứng hiện có

| Yêu cầu | Bằng chứng cần trước gọi MVP xong | Hiện có |
| --- | --- | --- |
| Đọc program đúng scope | Devnet hash/account/owner/type/pointer/slot/time và failure cases | Spike live slot523293811/747ms, chưa product adapter đầy đủ |
| Manifest diff | Fixture independent cho từng field, thiếu→UNKNOWN | 5 mutations đã chạy, schema product chưa triển khai |
| Không gây hiểu nhầm proof | UI tests/5-user task không diễn giải MATCH thành ABI/source proof | Contract/plan; chưa người dùng thử |
| Recovery/export | UI test invalid/timeout/stale/replay; export giữ provenance | Artifact JSON nghiên cứu; chưa UI |
| Chạy công khai | Link web, version/source và offline/live checks rõ | [Baseline Phase3 đã public](https://clusterproof-devnet-17nov26.anthony-robinson-125.chatgpt.site); [source/build/browser evidence](evidence/phase3/web.md), chưa web product đầy đủ |

Ghi nhận duyệt trước đây sai, hết hiệu lực theo DECISION. Bản này **dự phòng, chưa duyệt**; verdict giáo viên về SHORTLIST, review chéo và chấm kiến trúc vẫn còn mở. Repo hiện private/MIT; phải public trước nộp theo yêu cầu dự án.
