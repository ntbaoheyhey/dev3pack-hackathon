# ReceiptRail Phase 4 — kết quả để duyệt

**P4-A/P4-B đã hoàn tất trong phạm vi được đồng ý.** Program ReceiptRail có create/pay/cancel; client sinh từ IDL đã được Antigravity dùng. Kết quả dưới đây là bằng chứng kỹ thuật, chưa phải verdict giáo viên hoặc quyền mở Phase 6.

| Cổng kỹ thuật của ROADMAP | Bằng chứng đã có |
| --- | --- |
| Test xanh trong CI | Revision triển khai6d08e5c:32 runtime ReceiptRail,23 client,7 deployment guards. Push44477944228 đủ3jobs đạt; PR44477949631 cancelled được ghi riêng. Recovery e9a1603: thêm7 recovery tests; cả push44495583542 và PR44495594074 đủ3jobs đạt |
| Program trên devnet | Program8NGSPufBmGB1oHqaZpY1jhJYz1X4gqFiNXCQmxfapYko; executable, ProgramData canonical, authority và bytecode được đối chiếu.162 transaction finalized/meta.err=null |
| Luồng sản phẩm | Fund actors, Create→Pay→Paid; duplicate cùngPDA chỉ simulation, bị6004 và không broadcast; Create khác→Cancel→Cancelled. Principal0.001SOL chuyển đúng một lần |
| Client sinh và bàn giao |3instructions/1account/3events/9errors + types;23tests cross-language API/ABI/bundle. A nhận dùng tại4d2e48a, C review import/parse/inspect và UI tiếp tục dùng client này |
| Trần P4-B1.8SOL | Debit0.760701080SOL =0.759861080 giữ trong accounts +0.000840000 phí. Payer còn1.087424119SOL tại observation slot523949181; không phải số dư đọc mới hôm sau |

Chốt bằng chứng lúc **16:41:01 ngày19/11/2026 UTC+7**. Đúng4keypairs ngoài Git đã tạo sau CI đầu đạt; không thêm signer, upgrade, đổi authority, close/sweep hoặc gửi lại. RPC429 trước Cancel được xử lý bằng helper riêng có CI, chỉ1Cancel rồi đọc đối soát; partial lỗi vẫn được giữ.

[Final verification](evidence/phase4/final-verification.json) chứa162metadata/signatures và hạch toán; [smoke](evidence/phase4/smoke.json), [Cancel recovery](evidence/phase4/cancel-recovery.json), [CI triển khai](evidence/phase4/ci-deployment.json), [CI recovery](evidence/phase4/ci-smoke-recovery.json), [index đầy đủ](evidence/phase4/README.md). C đã đọc lại số lượng, uniqueness/finalized/errors, tổng phí/debit/held, labels smoke, principal và duplicate-not-sent khi viết báo cáo này; không gửi hoặc chạy smoke lại.

CU đo trên devnet: create1=10275, pay=6608, create2=8775, cancel=4346. Đây là số đo của các transaction đã lưu, không dự báo chi phí mọi trường hợp. Bytecode triển khai macOS hash495e4773… khác LinuxCI: đã đối chiếu bytecode tải lên, **chưa verified/reproducible source build**.

Người dùng có thể giải thích: “Người bán tạo hóa đơn có người trả, số tiền và hạn slot cố định. Người trả chỉ thanh toán khi hóa đơn còn Open và chưa hết hạn. Chuyển tiền và đổi Paid nằm trong cùng transaction. Kiểm tra lại sau mất phản hồi chỉ đọc cùng hóa đơn, không tự trả lần nữa.”

Giới hạn sản phẩm: chỉ chống trả lại cùng invoicePDA; merchant có thể tạoIDkhác. Không escrow/refund/stablecoin, không chứng minh giao hàng. Rent vẫn giữ sau Paid/Cancelled; upgrade authority và RPC còn là trust assumptions. Chưa chứng minh ví extension thật, network race/reorg hoặc audit độc lập. Phase5 local xem [review r3](reviews/receiptrail-phase5-r3.md); chưa public web/Phase6/mergePR7.
