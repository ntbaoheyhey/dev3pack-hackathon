# Thẻ nhớ — Codex / Phase6 ReceiptRail
- Trạng thái **đang làm**; ba quyết định đã có, không dùng blocker cũ để dừng.
- Quyền log lượt20/11/2026 08:38:01UTC+7: public mock riêng106a18e; mởPhase6 local/CLI devnet cap0.05SOL; PR7 giữ mở. Xem DECISION/evidence/phase6/permission-2026-11-20.json.
- ReceiptRail chính, ClusterProof phụ; giữ Site ClusterProof nguyên vẹn.
- Public chỉ snapshot mock riêng (không RPC/sign/send); SiteID chưa tạo. Bản thật phải trình riêng.
- P6 dùng program8NGSPufBmGB1oHqaZpY1jhJYz1X4gqFiNXCQmxfapYko, signers cũ ngoàiGit; không cài, tạo signer, deploy/upgrade, đổi authority, mergePR7 hoặc mởPhase7 thật.
- C chủ trì adapter/query/transaction/journal/budget/CLI; A nhậnT41 quaqueue (wallet connector/panel local), không chờA.
- A không sửa C code; C không sửa A-done/HANDOFFA/checkoutA.
- Browser QA chỉ headless cache localhost/vímock, không điều khiểnGUI hoặc kýdevnet trongbrowser.
- Automation15phút ACTIVE đúngchat, actionview+TOML đã kiểm20/11.
- Work trước lượt1429817 sạch/đồngbộ; mọi checkpoint dùng[skip ci].
- Mocksource106a18e:52tests,16source+2slot,10artifact; video162.12s; artifacthashes ởevidence/phase5/mock-artifact-2026-11-20/.
- P4-B162tx/debit0.760701080SOL đãxong, không chạy lại; capP6 riêng chưa chi.
- Goaltool còn objectivePrompt03/statusblocked cũ, không đại diện phạmvi hiện hành; lời duyệt mới cho phép làmPhase6.

## Còn lại

1. Commit/push quyền mới, T41 và bàn giao; public Site mock riêng theo Sites từ đúng ba artifact hashes đã kiểm. LưuID ngay sau create, đúngaudiencepublic, sourcehelper/save/deploy/readback.
2. Triển khai P6-1/P6-2: query client theoIDL, RPCqueue, transactionvalidation, journal/recovery, budget; học/cập nhật note026 trước code, tests bằngcache. Cung cấp contract choA và nhậnT41 mộtlượt.
3. Sau tests/review: P6-3 kiểmread-only program/genesis/authority/bytecode và balances; CLI devnet signerscũ, reserve trướcsend, tổngcap50,000,000lamports theoPHASE6-PLAN; lưu signatures/finality/accounting.
4. Chốt bản tích hợp local/evidence, cập nhật PR7/NEXT/ROADMAP/DEVLOG/Thẻ nhớ, push sau mốc lớn. Chuẩn bị bản cụ thể rồi hỏi gộp các cổng còn cần người dùng (víextension/publicwebthật); chưa tuyên bố Phase6 đạt.

## Bị chặn

Chưa có blocker cho phần đã được duyệt. Víextension/thiếtbịthật do người dùng tự thao tác và publicwebgiao dịchthật là cổng riêng ở cuối; không dùng để dừng code/test/CLI đã có quyền.
