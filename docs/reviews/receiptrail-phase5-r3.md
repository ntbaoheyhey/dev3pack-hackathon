# Review C — T36 hợp nhất, Phase5 local

> Lịch sử trước Prompt04. Kết quả hiện hành có browser/artifact xem [r4](receiptrail-phase5-r4.md); các giới hạn chưa browser bên dưới thuộc mốc r3.

C nhận CSS, table wrapper, nội dung note025 về reject/signature/recheck từ T36A (`a88ce9e`, `64b2573`, bàn giao `17ed43c`). Nhận client artifact củaC đã được A sử dụng; không mở vòng report T31–T33. T36 đóng ở bản hợp nhất này; không yêu cầu A nộp lại.

C giữ implementation `confirmation.ts`/`wallet-lifecycle.ts` và wiring React từ checkpoint `9e1d59e`, đúng phânchia queue `093e36b`. A vẫn sửa TSX/controller/mock-wallet dù queue đã chuyển sangC; Git giữ đầy đủ patchA. Không giữ hai controller production song song: bảnA lưu snapshot bằng reference, gán `chains: ['solana:devnet']` cứng trongTSX, chưa subscribe raw chain events, và guard requestId chưa bảo vệ kết quả submit. Các ca test hữu ích củaA đã được bao phủ bằng production model/SDK tests củaC; không giữ test cho module không được UI dùng.

| Yêu cầu | Implementation/evidence hiện hành |
| --- | --- |
| Xác nhận Create/Pay/Cancel đúng terms | React dùng model/executeConfirmedOperation, copy invoiceId trước await; Cancel không dựng terms mới lúc click; chỉ action đúng role/invoice có thể confirm |
| Đổi wallet/account/chain/disconnect/selection/input/slot | Session identity và context revision; raw standard:events invalidate đồng bộ, cả chain-only SDK bỏ qua; register/unregister cleanup |
| Wallet metadata | Address encoder tạo publicKey đúng32bytes; kiểm lại raw+session bytes/devnet support. Không có feature sign/send trong mock |
| Double submit và kết quả muộn | Lock trước await/consume approvals; stale read theo channel/revision, operation theo identity/revision; invalidation không mở khóa thao tác còn chạy |
| Create preview | Đủ merchant/payer/amount/expiry/ID/PDA/rent/fee; expiry dùng delta nhập thật và chặn sum>u64; input/preset/slot đổi phải duyệt lại |
| Lỗi và provenance | Decode thất bại hiển thị rõ; clipboard catch; pending signature theo invoice; recheck chỉ đọc mock, outcome dropped/failed khác Paid |
| Copy và responsive | Mock nhãn sát CTA/receipt/storyboard, bỏ cam kết tuyệt đối; table scroll region và wrap/min-width/focus từCSS A+C. **Chưa kiểm render sau sửa** |

Kiểm bằngcache/CLI trên cây hợp nhất: [45/45tests](receiptrail-phase5-r3-tests.log) =8ClusterProof+12ReceiptRail nền+11adapter money/state+14confirmation/SDK; [TypeScript/Vite](receiptrail-phase5-r3-build.log) exit0; [7/7repro](receiptrail-phase5-r3-repro.json) đạt. Test lifecycle cũ tự gán biến đã được thay bằng tests production. [Manifest](receiptrail-phase5-r3-manifest.json) giữ hashes chính xác và36inputsP4-B không đổi. Kết quả này không phải CI revision mới.

**Giới hạn:** tests chạy model/submit/SDK trong Node, không thực thi toàn chuỗi React event/DOM. Không browser/headless/ảnh mới theo lời dừngGUI; ảnh r2 là lịch sử (mobile từng cắt ngang), không chứng minh CSS mới. Ví extension thật chưa kiểm. Không gọi Phase5 hoàn tất theo ROADMAP vì còn browser/demo và link công khai chưa được phép. C tiếp tục hồ sơ/artifact/phương án cổng cần người dùng; không chạy thêm deployP4-B.
