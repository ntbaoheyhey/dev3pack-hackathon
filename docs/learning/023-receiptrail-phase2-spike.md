# 023 — ReceiptRail Phase 2 và spike Anchor cục bộ

- **Ngày**: 18/11/2026, Asia/Ho_Chi_Minh
- **Agent**: Codex
- **Giai đoạn**: trước sự kiện; đặt chỗ tại commit80cac12 trước khi viết; viết note trước code

## Tóm tắt 3 dòng

Invoice PDA là điểm chung để kiểm hóa đơn Open rồi chuyển SOL và ghi Paid trong cùng transaction; chỉ bảo vệ cùng một invoice ID.
Spike nạp bytecode Anchor thật vào LiteSVM, dùng fee payer riêng để tách principal/rent khỏi phí và đổi blockhash khi thử trả lặp.
Chỉ dùng compiler/dependency cache đã có, không cài thêm hoặc tạo signer triển khai; chưa là sản phẩm đã deploy hay thiết kế đã duyệt.

## Khái niệm chính

- `Account<Invoice>` kiểm owner/discriminator; seeds cố định32bytes và canonical bump ở init; `has_one` liên kết signer/recipient với state. Init một lần; không update/reset/close. Payer/merchant/invoice khác nhau. Clock.slot là nguồn expiry; đúng slot expiry đã bị từ chối. [Constraints](https://www.anchor-lang.com/docs/references/account-constraints), đọc18/11.
- CPI chỉ tới System Program, amount lấy từ state bất biến. Source **anchor-lang1.2.2** cached `context.rs` dùng `CpiContext::new(program_id: Pubkey, accounts)`; trang [CPI](https://www.anchor-lang.com/docs/basics/cpi) còn ví dụ truyền AccountInfo, nên ưu tiên source đúng phiên bản. `system_program::transfer` dựng instruction System với sender/recipient, không nhận target tùy ý.
- Mọi instruction trong một transaction phải cùng thành công; failure rollback state/transfer nhưng vẫn có phí. Test `[pay,pay]` trong cùng transaction phải rollback cả lần đầu; test hai transaction mới riêng phải giữ lần đầu Paid, từ chối lần sau. [Solana transactions](https://solana.com/docs/core/transactions), đọc18/11. Không đánh đồng same-signature replay với invoice duplicate.
- Program ID local được tạo từ hash nhãn công khai, không từ keypair. Signers test chỉ trong memory của máy ảo; không đọc/sinh file ví. LiteSVM0.15.0 `expire_blockhash`, `warp_to_slot`, `get_account`, `set_account` đã đối chiếu source cache. Fixtures sửa owner/data chỉ dùng ca bất thường; luồng bình thường luôn khởi tạo bằng instruction thật.
- Payload123bytes + discriminator8 =131bytes dự kiến. Merchant trả rent riêng; payer trả đúng principal; fixture fee payer thứ ba trả tx fee. Receipt không chứng minh hàng hóa đã giao, merchant không tạo ID khác, RPC luôn đúng hoặc upgrade authority trung thực.

## Cách làm — trước khi code

Thiết kế tối thiểu: `create_invoice(invoice_id[32], payerPubkey, amount_lamports, expires_slot)`, `pay_invoice()`, `cancel_invoice()`. Create merchant signer System-owned/data-empty; payer pubkey được chỉ định, kiểm ví lúc pay. Pay chỉ Open và slot<expiry; cancel Open cả trước/sau expiry. Paid/Cancelled là terminal, expiry là hiển thị suy từ Open+Clock.

Source build đã đọc từ [Anza cargo-build-sbf commit138ca775](https://github.com/anza-xyz/cargo-build-sbf/tree/138ca775f7c1b60abbfb958975a95aacad10efb2/cargo-build-sbf/src): `bin/build_sbf.rs` chọn target `sbpfv3-solana-solana`, flags `-C link-arg=-z -C link-arg=defs`; `post_processing.rs` có `generate_keypair` nếu file triển khai chưa tồn tại. Đây là source tham khảo hiện hành, không khẳng định binary4.1.0 là cùng commit. Do đó không gọi wrapper Anchor build/cargo-build-sbf cho spike; gọi cargo/rustc platform-tools đã có rồi `llvm-objcopy --strip-all` vào thư mục local riêng.

Phiên bản đã quan sát: host cargo/rustc1.100.0; platform-tools v1.57 rustc1.95.0-dev(ae660768a)/LLVM22.1.2; Anchor-lang1.2.2; LiteSVM0.15.0. Các dependencies test dùng cùng pins của hello lab. Cargo offline tuyệt đối; thiếu cache thì dừng phần build và hỏi trước cài thêm, không download tự động. Lockfile chỉ thêm package ReceiptRail, không tự nâng dependency.

Kế hoạch lệnh (chưa gọi tại thời điểm viết note): `bash scripts/check-receiptrail.sh`; script dự kiến build target v3 offline/locked, strip `.so`, chạy `cargo test -p receiptrail --offline --locked`, lưu logs và hashes. Không chạy validator, Anchor deploy/test mặc định, RPC hoặc CI cài công cụ.

## Test plan và tiêu chí đạt

1. Create đúng PDA/owner/131bytes/terms/slot; merchant rent đo từ máy ảo, không lấy làm báo giá devnet.
2. Pay lần1 chuyển đúng principal và Paid; transaction/blockhash/signature mới trả lại bị InvoiceNotOpen, principal không chuyển lần2.
3. CPI thiếu tiền và `[pay,pay]` cùng transaction: state/lamports rollback; phí riêng vẫn có thể mất.
4. Wrong signer/recipient/owner/discriminator/seeds/System Program; missing signer; các account alias; amount0/expiry<=slot đều bị từ chối.
5. Trước/tại/sau expiry; pay→cancel và cancel→pay; tạo lại invoice Paid/Cancelled bị từ chối; cancel sau expiry được phép.
6. Đọc state/balance làm oracle, không lấy event/UI success làm kết quả. Lưu CU/fee/size/thời gian chạy; chưa nâng F trước khi có log pass.

## Bài học / lỗi đã gặp

| Bẫy | Nguyên nhân | Cách xử lý |
| --- | --- | --- |
| Anchor docs CPI không khớp1.2.2 | Docs ví dụ khác source cached | Dùng signature source pinned; compiler xác minh sau |
| Build local cũng sinh keypair | Post-processing của wrapper build | Dùng compiler cached trực tiếp, không gọi nhánh tạo key |
| F4 khi chưa spike | Nhầm kế hoạch và evidence | Giữ r1=75/F3 đến khi bytecode/tests chạy thật |
| Quyền cài/duyệt bị ghi sai | Dùng payload đã bị đính chính | DECISION có nguyên văn/giờ/nguồn sai; AGENTS/K6 chặn suy quyền |

## Nguồn

- [Anchor constraints](https://www.anchor-lang.com/docs/references/account-constraints), [CPI](https://www.anchor-lang.com/docs/basics/cpi), [Anchor1.2.2 source](https://github.com/otter-sec/anchor/tree/v1.2.2/lang/src).
- [Solana transaction atomicity](https://solana.com/docs/core/transactions).
- [Anza build source pinned](https://github.com/anza-xyz/cargo-build-sbf/tree/138ca775f7c1b60abbfb958975a95aacad10efb2/cargo-build-sbf/src).
- [LiteSVM0.15.0](https://docs.rs/litesvm/0.15.0/litesvm/), source cached đã đọc; notes004/007/016/021.

## Giới hạn và bước tiếp theo

Chưa code/build/test ReceiptRail tại mốc note này; chưa IDL generated, client, browser, validator/RPC, devnet, CI hoặc review độc lập. Spike local chứng minh phần khó D2 nếu đạt, không tự đạt cổng Phase2/3 hoặc DELIVERY. Khi có log sẽ bổ sung kết quả và giới hạn, hoàn tất IDEA/ARCHITECTURE/demo165s rồi trình duyệt.
