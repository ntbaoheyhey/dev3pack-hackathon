# ReceiptRail demo script

English narration and on-screen captions. The merchant and payer used a local Wallet Standard wallet on Solana devnet. The public application contains no recording wallet. RPC waiting time is edited.

| Time | Scene | Narration and captions |
| --- | --- | --- |
| 0:00–0:11 | A missing response | A payer sends SOL, then the checkout loses its response. Has the merchant been paid? ReceiptRail gives both parties one invoice they can open to find out. |
| 0:11–0:23 | Create the invoice | The merchant enters the designated payer and an amount. The review shows the exact invoice address, expiry slot, network fee and account rent before the wallet signs. |
| 0:23–0:37 | Review and pay | Here the payer authorizes fifty thousand lamports. This is a local Wallet Standard wallet signing a real transaction on Solana devnet. We enable the lost response demonstration before paying. |
| 0:37–0:50 | Simulated lost response | The network accepted the transaction. We deliberately hide the response in the interface. The browser keeps the invoice address and signature. The next action is to recheck this same receipt. |
| 0:50–1:00 | Read the shared receipt | Recheck reads the account. Its status is Paid. The payer and merchant can open the same address, including from a browser with no wallet connected. |
| 1:00–1:13 | Try a fresh transaction | The original payer now tries a second transaction with a new blockhash. The review shows the expected program rejection and the fee that sending this demonstration can still cost. |
| 1:13–1:24 | Check the rejected retry | The chain finalized the rejection with Invoice Not Open. The merchant gained zero lamports on the retry. Only the five thousand lamport network fee was charged to the payer. |
| 1:24–1:39 | How the program enforces it | The Anchor program checks the payer and invoice state. It records Paid in the same atomic transaction as the transfer. The runtime tests cover rollback, wrong signers, expiry and duplicate payment. |
| 1:39–1:52 | Limits and verification | ReceiptRail supports native SOL on devnet. Merchants must map each order to one invoice ID. Open the public demo and follow the payment and rejected retry links to verify the result yourself. |
