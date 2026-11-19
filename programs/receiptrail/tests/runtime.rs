use anchor_lang::{
    prelude::{Clock, Pubkey},
    solana_program::{instruction::Instruction, system_program},
    AccountDeserialize, InstructionData, ToAccountMetas,
};
use litesvm::{types::TransactionResult, LiteSVM};
use receiptrail as rail;
use solana_keypair::Keypair;
use solana_message::{Message, VersionedMessage};
use solana_signer::Signer;
use solana_transaction::versioned::VersionedTransaction;

const AMOUNT: u64 = 1_000_000;
const EXPIRY: u64 = 200;
const INVOICE_ID: [u8; 32] = [42; 32];

#[derive(Clone, Copy)]
enum Actor {
    Merchant,
    Payer,
    Attacker,
    Both,
    None,
}

#[derive(Debug, PartialEq, Eq)]
struct Snapshot {
    invoice: Option<(Vec<u8>, Pubkey, u64)>,
    merchant: u64,
    payer: u64,
    attacker: u64,
}

struct Harness {
    svm: LiteSVM,
    fee: Keypair,
    merchant: Keypair,
    payer: Keypair,
    attacker: Keypair,
    invoice: Pubkey,
}

impl Harness {
    fn new() -> Self {
        let mut svm = LiteSVM::new();
        let path = std::env::var("RECEIPTRAIL_SO").unwrap_or_else(|_| {
            format!(
                "{}/../../target/receiptrail-spike/receiptrail.so",
                env!("CARGO_MANIFEST_DIR")
            )
        });
        let bytes = std::fs::read(path)
            .expect("Run scripts/check-receiptrail.sh to build the real SBF program");
        svm.add_program(rail::id(), &bytes).unwrap();
        svm.warp_to_slot(100);
        let fee = Keypair::new();
        let merchant = Keypair::new();
        let payer = Keypair::new();
        let attacker = Keypair::new();
        for key in [&fee, &merchant, &payer, &attacker] {
            svm.airdrop(&key.pubkey(), 1_000_000_000).unwrap();
        }
        let invoice = Pubkey::find_program_address(
            &[rail::INVOICE_SEED, merchant.pubkey().as_ref(), &INVOICE_ID],
            &rail::id(),
        )
        .0;
        Self {
            svm,
            fee,
            merchant,
            payer,
            attacker,
            invoice,
        }
    }

    fn opened() -> Self {
        let mut h = Self::new();
        let ix = h.create(AMOUNT, EXPIRY, h.payer.pubkey());
        h.send(vec![ix], Actor::Merchant).unwrap();
        h
    }

    fn create(&self, amount: u64, expiry: u64, payer: Pubkey) -> Instruction {
        self.create_with_id(INVOICE_ID, amount, expiry, payer)
    }

    fn create_with_id(
        &self,
        invoice_id: [u8; 32],
        amount: u64,
        expiry: u64,
        payer: Pubkey,
    ) -> Instruction {
        Instruction::new_with_bytes(
            rail::id(),
            &rail::instruction::CreateInvoice {
                invoice_id,
                payer,
                amount_lamports: amount,
                expires_slot: expiry,
            }
            .data(),
            rail::accounts::CreateInvoice {
                merchant: self.merchant.pubkey(),
                invoice: self.invoice,
                system_program: system_program::ID,
            }
            .to_account_metas(None),
        )
    }

    fn pay(&self) -> Instruction {
        Instruction::new_with_bytes(
            rail::id(),
            &rail::instruction::PayInvoice {}.data(),
            rail::accounts::PayInvoice {
                invoice: self.invoice,
                payer: self.payer.pubkey(),
                merchant: self.merchant.pubkey(),
                system_program: system_program::ID,
            }
            .to_account_metas(None),
        )
    }

    fn cancel(&self) -> Instruction {
        Instruction::new_with_bytes(
            rail::id(),
            &rail::instruction::CancelInvoice {}.data(),
            rail::accounts::CancelInvoice {
                invoice: self.invoice,
                merchant: self.merchant.pubkey(),
            }
            .to_account_metas(None),
        )
    }

    fn send(&mut self, ixs: Vec<Instruction>, actor: Actor) -> TransactionResult {
        // A new blockhash/signature for EVERY submission, including duplicate-pay tests.
        self.svm.expire_blockhash();
        let msg = Message::new_with_blockhash(
            &ixs,
            Some(&self.fee.pubkey()),
            &self.svm.latest_blockhash(),
        );
        let mut signers = vec![&self.fee];
        match actor {
            Actor::Merchant => signers.push(&self.merchant),
            Actor::Payer => signers.push(&self.payer),
            Actor::Attacker => signers.push(&self.attacker),
            Actor::Both => {
                signers.push(&self.merchant);
                signers.push(&self.payer);
            }
            Actor::None => (),
        }
        let tx = VersionedTransaction::try_new(VersionedMessage::Legacy(msg), &signers).unwrap();
        self.svm.send_transaction(tx)
    }

    fn snapshot(&self) -> Snapshot {
        Snapshot {
            invoice: self
                .svm
                .get_account(&self.invoice)
                .map(|a| (a.data, a.owner, a.lamports)),
            merchant: self.svm.get_balance(&self.merchant.pubkey()).unwrap(),
            payer: self.svm.get_balance(&self.payer.pubkey()).unwrap(),
            attacker: self.svm.get_balance(&self.attacker.pubkey()).unwrap(),
        }
    }

    fn state(&self) -> rail::Invoice {
        let account = self.svm.get_account(&self.invoice).unwrap();
        rail::Invoice::try_deserialize(&mut account.data.as_slice()).unwrap()
    }

    fn reject(&mut self, ix: Instruction, actor: Actor, reason: &str) {
        let before = self.snapshot();
        let fee_before = self.svm.get_balance(&self.fee.pubkey()).unwrap();
        let failure = self.send(vec![ix], actor).unwrap_err();
        assert_eq!(
            fee_before - self.svm.get_balance(&self.fee.pubkey()).unwrap(),
            failure.meta.fee,
            "rollback must not be described as refunding transaction fees"
        );
        assert!(
            failure.meta.logs.iter().any(|s| s.contains(reason)),
            "expected {reason}; {failure:?}"
        );
        assert_eq!(
            self.snapshot(),
            before,
            "failed instruction changed invoice or principal"
        );
    }
}

#[test]
fn create_pay_and_fresh_transaction_retry_transfers_principal_only_once() {
    let mut h = Harness::new();
    let before_create = h.snapshot();
    let create = h
        .send(
            vec![h.create(AMOUNT, EXPIRY, h.payer.pubkey())],
            Actor::Merchant,
        )
        .unwrap();
    let account = h.svm.get_account(&h.invoice).unwrap();
    let rent = h.svm.minimum_balance_for_rent_exemption(131);
    assert_eq!(account.owner, rail::id());
    assert_eq!(account.data.len(), 131);
    assert_eq!(account.lamports, rent);
    assert_eq!(before_create.merchant - h.snapshot().merchant, rent);
    assert_eq!(before_create.payer, h.snapshot().payer);
    let state = h.state();
    assert_eq!(
        (state.version, state.status, state.paid_slot),
        (1, rail::OPEN, 0)
    );
    assert_eq!(state.invoice_id, INVOICE_ID);
    assert_eq!(state.payer, h.payer.pubkey());
    assert_eq!(state.merchant, h.merchant.pubkey());
    assert_eq!(state.amount_lamports, AMOUNT);
    assert_eq!(state.expires_slot, EXPIRY);
    let (_, bump) = Pubkey::find_program_address(
        &[
            rail::INVOICE_SEED,
            h.merchant.pubkey().as_ref(),
            &INVOICE_ID,
        ],
        &rail::id(),
    );
    assert_eq!(state.bump, bump);
    let before_pay = h.snapshot();
    let pay = h.send(vec![h.pay()], Actor::Payer).unwrap();
    assert_eq!(h.snapshot().merchant - before_pay.merchant, AMOUNT);
    assert_eq!(before_pay.payer - h.snapshot().payer, AMOUNT);
    assert_eq!(h.svm.get_account(&h.invoice).unwrap().lamports, rent);
    let paid = h.state();
    assert_eq!(paid.status, rail::PAID);
    assert_eq!(paid.paid_slot, 100);
    assert_eq!(paid.invoice_id, state.invoice_id);
    assert_eq!(paid.expires_slot, state.expires_slot);
    let once = h.snapshot();
    let retry = h.send(vec![h.pay()], Actor::Payer).unwrap_err();
    assert_ne!(pay.signature, retry.meta.signature);
    assert!(
        retry.meta.logs.iter().any(|s| s.contains("InvoiceNotOpen")),
        "{retry:?}"
    );
    assert_eq!(h.snapshot(), once);
    println!("METRIC create_cu={} pay_cu={} retry_cu={} create_fee={} pay_fee={} retry_fee={} rent_lamports={} principal_delta={} invoice_bytes=131 paid_slot=100", create.compute_units_consumed, pay.compute_units_consumed, retry.meta.compute_units_consumed, create.fee, pay.fee, retry.meta.fee, rent, AMOUNT);
}

#[test]
fn two_pay_instructions_in_one_transaction_roll_back_the_first_transfer() {
    let mut h = Harness::opened();
    let before = h.snapshot();
    let failure = h.send(vec![h.pay(), h.pay()], Actor::Payer).unwrap_err();
    assert!(
        failure
            .meta
            .logs
            .iter()
            .any(|s| s.contains("InvoiceNotOpen")),
        "{failure:?}"
    );
    assert!(failure
        .meta
        .inner_instructions
        .iter()
        .any(|ixs| !ixs.is_empty()));
    assert_eq!(h.snapshot(), before);
    assert_eq!(h.state().status, rail::OPEN);
    assert_eq!(h.state().paid_slot, 0);
    h.send(vec![h.pay()], Actor::Payer).unwrap();
    assert_eq!(h.snapshot().merchant - before.merchant, AMOUNT);
}

#[test]
fn insufficient_principal_cpi_leaves_invoice_open_and_balances_unchanged() {
    let mut h = Harness::opened();
    let mut payer = h.svm.get_account(&h.payer.pubkey()).unwrap();
    payer.lamports = AMOUNT - 1;
    h.svm.set_account(h.payer.pubkey(), payer).unwrap();
    h.reject(h.pay(), Actor::Payer, "insufficient lamports");
    assert_eq!((h.state().status, h.state().paid_slot), (rail::OPEN, 0));
}

#[test]
fn wrong_payer_signer_cannot_pay() {
    let mut h = Harness::opened();
    let mut ix = h.pay();
    ix.accounts[1].pubkey = h.attacker.pubkey();
    h.reject(ix, Actor::Attacker, "WrongPayer");
}

#[test]
fn recipient_substitution_cannot_redirect_payment() {
    let mut h = Harness::opened();
    let mut ix = h.pay();
    ix.accounts[2].pubkey = h.attacker.pubkey();
    h.reject(ix, Actor::Payer, "WrongMerchant");
}

#[test]
fn payer_address_without_signature_is_rejected() {
    let mut h = Harness::opened();
    let mut ix = h.pay();
    ix.accounts[1].is_signer = false;
    h.reject(ix, Actor::None, "AccountNotSigner");
}

#[test]
fn merchant_address_without_signature_cannot_create_or_cancel() {
    let mut h = Harness::new();
    let mut ix = h.create(AMOUNT, EXPIRY, h.payer.pubkey());
    ix.accounts[0].is_signer = false;
    h.reject(ix, Actor::None, "AccountNotSigner");
    h.send(
        vec![h.create(AMOUNT, EXPIRY, h.payer.pubkey())],
        Actor::Merchant,
    )
    .unwrap();
    let mut ix = h.cancel();
    ix.accounts[1].is_signer = false;
    h.reject(ix, Actor::None, "AccountNotSigner");
}

#[test]
fn another_merchant_cannot_cancel() {
    let mut h = Harness::opened();
    let mut ix = h.cancel();
    ix.accounts[1].pubkey = h.attacker.pubkey();
    h.reject(ix, Actor::Attacker, "WrongMerchant");
}

#[test]
fn expiry_boundary_before_at_and_after() {
    for slot in [EXPIRY - 1, EXPIRY, EXPIRY + 1] {
        let mut h = Harness::opened();
        h.svm.warp_to_slot(slot);
        if slot < EXPIRY {
            h.send(vec![h.pay()], Actor::Payer).unwrap();
            assert_eq!((h.state().status, h.state().paid_slot), (rail::PAID, slot));
        } else {
            h.reject(h.pay(), Actor::Payer, "InvoiceExpired");
            assert_eq!(h.state().status, rail::OPEN);
        }
    }
}

#[test]
fn merchant_can_cancel_expired_open_invoice_without_moving_principal() {
    let mut h = Harness::opened();
    h.svm.warp_to_slot(EXPIRY);
    let before = h.snapshot();
    let cancelled = h.send(vec![h.cancel()], Actor::Merchant).unwrap();
    assert_eq!(h.state().status, rail::CANCELLED);
    assert_eq!(h.state().paid_slot, 0);
    assert_eq!(h.snapshot().merchant, before.merchant);
    assert_eq!(h.snapshot().payer, before.payer);
    println!(
        "METRIC cancel_cu={} cancel_fee={}",
        cancelled.compute_units_consumed, cancelled.fee
    );
}

#[test]
fn pay_cancel_race_is_safe_in_both_serial_orders() {
    let mut paid = Harness::opened();
    paid.send(vec![paid.pay()], Actor::Payer).unwrap();
    paid.reject(paid.cancel(), Actor::Merchant, "InvoiceNotOpen");
    assert_eq!(paid.state().status, rail::PAID);
    let mut cancelled = Harness::opened();
    cancelled
        .send(vec![cancelled.cancel()], Actor::Merchant)
        .unwrap();
    cancelled.reject(cancelled.pay(), Actor::Payer, "InvoiceNotOpen");
    assert_eq!(cancelled.state().status, rail::CANCELLED);
}

#[test]
fn terminal_invoice_cannot_be_reinitialized_or_reset() {
    for paid in [true, false] {
        let mut h = Harness::opened();
        if paid {
            h.send(vec![h.pay()], Actor::Payer).unwrap();
        } else {
            h.send(vec![h.cancel()], Actor::Merchant).unwrap();
        }
        h.reject(
            h.create(AMOUNT + 1, EXPIRY + 1, h.attacker.pubkey()),
            Actor::Merchant,
            "already in use",
        );
    }
}

#[test]
fn owner_and_discriminator_are_checked_before_payment() {
    for owner in [true, false] {
        let mut h = Harness::opened();
        let mut account = h.svm.get_account(&h.invoice).unwrap();
        if owner {
            account.owner = system_program::ID;
        } else {
            account.data[0] ^= 255;
        }
        h.svm.set_account(h.invoice, account).unwrap();
        h.reject(
            h.pay(),
            Actor::Payer,
            if owner {
                "AccountOwnedByWrongProgram"
            } else {
                "AccountDiscriminatorMismatch"
            },
        );
    }
}

#[test]
fn same_layout_at_wrong_pda_is_rejected() {
    let mut h = Harness::opened();
    let forged = Pubkey::new_unique();
    let account = h.svm.get_account(&h.invoice).unwrap();
    h.svm.set_account(forged, account.clone()).unwrap();
    let mut ix = h.pay();
    ix.accounts[0].pubkey = forged;
    h.reject(ix, Actor::Payer, "ConstraintSeeds");
    assert_eq!(h.svm.get_account(&forged).unwrap(), account);
}

#[test]
fn wrong_bump_and_version_are_rejected() {
    for bump in [true, false] {
        let mut h = Harness::opened();
        let mut account = h.svm.get_account(&h.invoice).unwrap();
        if bump {
            account.data[9] = account.data[9].wrapping_sub(1);
        } else {
            account.data[8] = 99;
        }
        h.svm.set_account(h.invoice, account).unwrap();
        h.reject(
            h.pay(),
            Actor::Payer,
            if bump {
                "ConstraintSeeds"
            } else {
                "WrongVersion"
            },
        );
    }
}

#[test]
fn substituted_executable_cannot_replace_system_program() {
    let mut h = Harness::opened();
    let mut ix = h.pay();
    ix.accounts[3].pubkey = rail::id();
    h.reject(ix, Actor::Payer, "InvalidProgramId");
}

#[test]
fn invalid_creation_terms_and_aliases_leave_no_invoice_or_rent_debit() {
    for case in 0..6 {
        let mut h = Harness::new();
        let (amount, expiry, payer, error) = match case {
            0 => (0, EXPIRY, h.payer.pubkey(), "InvalidAmount"),
            1 => (AMOUNT, 100, h.payer.pubkey(), "InvalidExpiry"),
            2 => (AMOUNT, 99, h.payer.pubkey(), "InvalidExpiry"),
            3 => (AMOUNT, EXPIRY, h.merchant.pubkey(), "AliasedRoles"),
            4 => (AMOUNT, EXPIRY, h.invoice, "AliasedRoles"),
            _ => (AMOUNT, EXPIRY, Pubkey::default(), "InvalidWallet"),
        };
        h.reject(h.create(amount, expiry, payer), Actor::Merchant, error);
        assert!(h.svm.get_account(&h.invoice).is_none());
    }
}

#[test]
fn payer_with_data_or_wrong_owner_cannot_transfer() {
    for owner in [true, false] {
        let mut h = Harness::opened();
        let mut account = h.svm.get_account(&h.payer.pubkey()).unwrap();
        if owner {
            account.owner = rail::id();
        } else {
            account.data = vec![1];
        }
        h.svm.set_account(h.payer.pubkey(), account).unwrap();
        h.reject(
            h.pay(),
            Actor::Payer,
            if owner {
                "ConstraintOwner"
            } else {
                "InvalidWallet"
            },
        );
    }
}

#[test]
fn unknown_instruction_cannot_change_terms_or_terminal_state() {
    let mut h = Harness::opened();
    let ix = Instruction::new_with_bytes(rail::id(), &[255; 8], h.pay().accounts);
    h.reject(ix, Actor::Payer, "InstructionFallbackNotFound");
    let clock = h.svm.get_sysvar::<Clock>();
    assert_eq!(clock.slot, 100);
}

#[test]
fn merchant_owner_and_data_are_checked_at_create_and_pay() {
    for paying in [false, true] {
        for wrong_owner in [false, true] {
            let mut h = if paying {
                Harness::opened()
            } else {
                Harness::new()
            };
            let mut merchant = h.svm.get_account(&h.merchant.pubkey()).unwrap();
            if wrong_owner {
                merchant.owner = rail::id();
            } else {
                merchant.data = vec![1];
            }
            h.svm.set_account(h.merchant.pubkey(), merchant).unwrap();
            // Anchor init CPI runs before the remaining merchant constraints.
            let reason = match (paying, wrong_owner) {
                (false, false) => "must not carry data",
                (false, true) => "spent from the balance of an account it does not own",
                (true, false) => "InvalidWallet",
                (true, true) => "AccountNotSystemOwned",
            };
            if paying {
                h.reject(h.pay(), Actor::Payer, reason);
            } else {
                h.reject(
                    h.create(AMOUNT, EXPIRY, h.payer.pubkey()),
                    Actor::Merchant,
                    reason,
                );
                assert!(h.svm.get_account(&h.invoice).is_none());
            }
        }
    }
}

#[test]
fn required_writable_privileges_cannot_be_removed() {
    for index in 0..3 {
        let mut h = Harness::opened();
        let mut ix = h.pay();
        ix.accounts[index].is_writable = false;
        h.reject(ix, Actor::Payer, "ConstraintMut");
    }
    let mut h = Harness::new();
    let mut ix = h.create(AMOUNT, EXPIRY, h.payer.pubkey());
    ix.accounts[0].is_writable = false;
    h.reject(ix, Actor::Merchant, "writable privilege escalated");
    let mut h = Harness::opened();
    let mut ix = h.cancel();
    ix.accounts[0].is_writable = false;
    h.reject(ix, Actor::Merchant, "ConstraintMut");
}

#[test]
fn cancel_checks_owner_discriminator_seeds_and_version() {
    for case in 0..4 {
        let mut h = Harness::opened();
        let mut account = h.svm.get_account(&h.invoice).unwrap();
        let reason = match case {
            0 => {
                account.owner = system_program::ID;
                "AccountOwnedByWrongProgram"
            }
            1 => {
                account.data[0] ^= 255;
                "AccountDiscriminatorMismatch"
            }
            2 => {
                account.data[9] = account.data[9].wrapping_sub(1);
                "ConstraintSeeds"
            }
            _ => {
                account.data[8] = 2;
                "WrongVersion"
            }
        };
        h.svm.set_account(h.invoice, account).unwrap();
        h.reject(h.cancel(), Actor::Merchant, reason);
    }
}

#[test]
fn truncated_instruction_and_account_data_fail_without_principal_changes() {
    for paying in [false, true] {
        let mut h = if paying {
            Harness::opened()
        } else {
            Harness::new()
        };
        let mut ix = if paying {
            h.pay()
        } else {
            h.create(AMOUNT, EXPIRY, h.payer.pubkey())
        };
        ix.data.truncate(if paying { 7 } else { 20 });
        h.reject(
            ix,
            if paying {
                Actor::Payer
            } else {
                Actor::Merchant
            },
            if paying {
                "InstructionFallbackNotFound"
            } else {
                "InstructionDidNotDeserialize"
            },
        );
    }
    for size in [7, 130] {
        for cancel in [false, true] {
            let mut h = Harness::opened();
            let mut account = h.svm.get_account(&h.invoice).unwrap();
            account.data.truncate(size);
            h.svm.set_account(h.invoice, account).unwrap();
            let ix = if cancel { h.cancel() } else { h.pay() };
            h.reject(
                ix,
                if cancel {
                    Actor::Merchant
                } else {
                    Actor::Payer
                },
                if size == 7 {
                    "AccountDiscriminatorNotFound"
                } else {
                    "AccountDidNotDeserialize"
                },
            );
        }
    }
}

#[test]
fn open_invoice_cannot_change_terms_by_reinitialization() {
    let mut h = Harness::opened();
    h.reject(
        h.create(AMOUNT + 1, EXPIRY + 1, h.attacker.pubkey()),
        Actor::Merchant,
        "already in use",
    );
}

#[test]
fn u64_boundaries_remain_exact_and_cannot_wrap_principal() {
    for amount in [1, 9_007_199_254_740_993, u64::MAX] {
        let mut h = Harness::new();
        h.send(
            vec![h.create(amount, u64::MAX, h.payer.pubkey())],
            Actor::Merchant,
        )
        .unwrap();
        assert_eq!(h.state().amount_lamports, amount);
        assert_eq!(h.state().expires_slot, u64::MAX);
        let before = h.snapshot();
        if amount == 1 {
            h.send(vec![h.pay()], Actor::Payer).unwrap();
            assert_eq!(h.snapshot().merchant - before.merchant, 1);
            assert_eq!(before.payer - h.snapshot().payer, 1);
        } else {
            h.reject(h.pay(), Actor::Payer, "insufficient lamports");
        }
    }
}

#[test]
fn terms_are_immutable_after_pay_or_cancel() {
    for cancel in [false, true] {
        let mut h = Harness::opened();
        let before = h.state();
        if cancel {
            h.send(vec![h.cancel()], Actor::Merchant).unwrap();
        } else {
            h.send(vec![h.pay()], Actor::Payer).unwrap();
        }
        let mut after = h.state();
        assert_eq!(
            after.status,
            if cancel { rail::CANCELLED } else { rail::PAID }
        );
        assert_eq!(after.paid_slot, if cancel { 0 } else { 100 });
        // Only these two fields may change; compare every other serialized field.
        after.status = before.status;
        after.paid_slot = before.paid_slot;
        assert_eq!(after, before);
    }
}

#[test]
fn different_invoice_ids_are_independent_and_each_can_pay_once() {
    let mut h = Harness::opened();
    let first = h.invoice;
    let id = [43; 32];
    h.invoice = Pubkey::find_program_address(
        &[rail::INVOICE_SEED, h.merchant.pubkey().as_ref(), &id],
        &rail::id(),
    )
    .0;
    assert_ne!(first, h.invoice);
    h.send(
        vec![h.create_with_id(id, AMOUNT, EXPIRY, h.payer.pubkey())],
        Actor::Merchant,
    )
    .unwrap();
    let second = h.invoice;
    let before = h.snapshot();
    h.send(vec![h.pay()], Actor::Payer).unwrap();
    assert_eq!(h.state().invoice_id, id);
    h.invoice = first;
    assert_eq!(h.state().status, rail::OPEN);
    h.send(vec![h.pay()], Actor::Payer).unwrap();
    assert_eq!(h.snapshot().merchant - before.merchant, AMOUNT * 2);
    assert_eq!(before.payer - h.snapshot().payer, AMOUNT * 2);
    for address in [first, second] {
        h.invoice = address;
        h.reject(h.pay(), Actor::Payer, "InvoiceNotOpen");
    }
}

#[test]
fn same_invoice_id_at_another_merchant_is_a_distinct_invoice() {
    let mut h = Harness::opened();
    let first = h.invoice;
    let original = h.svm.get_account(&first).unwrap();
    std::mem::swap(&mut h.merchant, &mut h.attacker);
    h.invoice = Pubkey::find_program_address(
        &[
            rail::INVOICE_SEED,
            h.merchant.pubkey().as_ref(),
            &INVOICE_ID,
        ],
        &rail::id(),
    )
    .0;
    assert_ne!(first, h.invoice);
    h.send(
        vec![h.create(AMOUNT, EXPIRY, h.payer.pubkey())],
        Actor::Merchant,
    )
    .unwrap();
    h.send(vec![h.pay()], Actor::Payer).unwrap();
    assert_eq!(h.svm.get_account(&first).unwrap(), original);
}

#[test]
fn create_then_pay_is_atomic_and_duplicate_pay_rolls_back_creation() {
    let mut success = Harness::new();
    let before = success.snapshot();
    let rent = success.svm.minimum_balance_for_rent_exemption(131);
    let fee_before = success.svm.get_balance(&success.fee.pubkey()).unwrap();
    let meta = success
        .send(
            vec![
                success.create(AMOUNT, EXPIRY, success.payer.pubkey()),
                success.pay(),
            ],
            Actor::Both,
        )
        .unwrap();
    assert_eq!(success.state().status, rail::PAID);
    assert_eq!(success.snapshot().merchant, before.merchant - rent + AMOUNT);
    assert_eq!(success.snapshot().payer, before.payer - AMOUNT);
    assert_eq!(
        fee_before - success.svm.get_balance(&success.fee.pubkey()).unwrap(),
        meta.fee
    );

    let mut h = Harness::new();
    let before = h.snapshot();
    let fee_before = h.svm.get_balance(&h.fee.pubkey()).unwrap();
    let failure = h
        .send(
            vec![h.create(AMOUNT, EXPIRY, h.payer.pubkey()), h.pay(), h.pay()],
            Actor::Both,
        )
        .unwrap_err();
    assert!(failure
        .meta
        .logs
        .iter()
        .any(|line| line.contains("InvoiceNotOpen")));
    assert_eq!(h.snapshot(), before);
    assert!(h.svm.get_account(&h.invoice).is_none());
    assert_eq!(
        fee_before - h.svm.get_balance(&h.fee.pubkey()).unwrap(),
        failure.meta.fee
    );
    assert!(failure.meta.fee > 0);
    println!(
        "METRIC create_pay_cu={} create_pay_fee={} rollback_create_pay_pay_fee={}",
        meta.compute_units_consumed, meta.fee, failure.meta.fee
    );
}

#[test]
fn two_pay_rollback_charges_only_fee_payer() {
    let mut h = Harness::opened();
    let before = h.snapshot();
    let fee_before = h.svm.get_balance(&h.fee.pubkey()).unwrap();
    let failure = h.send(vec![h.pay(), h.pay()], Actor::Payer).unwrap_err();
    assert_eq!(h.snapshot(), before);
    assert_eq!(
        fee_before - h.svm.get_balance(&h.fee.pubkey()).unwrap(),
        failure.meta.fee
    );
    assert!(failure.meta.fee > 0);
}

#[test]
fn bad_cryptographic_signature_is_rejected_before_execution() {
    let mut h = Harness::new();
    let before = h.snapshot();
    let fee_before = h.svm.get_balance(&h.fee.pubkey()).unwrap();
    let ix = h.create(AMOUNT, EXPIRY, h.payer.pubkey());
    let message =
        Message::new_with_blockhash(&[ix], Some(&h.fee.pubkey()), &h.svm.latest_blockhash());
    let mut tx =
        VersionedTransaction::try_new(VersionedMessage::Legacy(message), &[&h.fee, &h.merchant])
            .unwrap();
    tx.signatures[1] = Default::default();
    let failure = h.svm.send_transaction(tx).unwrap_err();
    assert_eq!(format!("{:?}", failure.err), "SignatureFailure");
    assert_eq!(h.snapshot(), before);
    assert_eq!(h.svm.get_balance(&h.fee.pubkey()).unwrap(), fee_before);
}

fn hex(bytes: &[u8]) -> String {
    bytes.iter().map(|b| format!("{b:02x}")).collect()
}

fn instruction_json(ix: &Instruction) -> String {
    let accounts = ix
        .accounts
        .iter()
        .map(|a| {
            format!(
                r#"{{"address":"{}","isSigner":{},"isWritable":{}}}"#,
                a.pubkey, a.is_signer, a.is_writable
            )
        })
        .collect::<Vec<_>>()
        .join(",");
    format!(
        r#"{{"programAddress":"{}","dataHex":"{}","accounts":[{}]}}"#,
        ix.program_id,
        hex(&ix.data),
        accounts
    )
}

#[test]
fn export_rust_abi_and_runtime_accounts_for_browser_client() {
    let mut h = Harness::new();
    let create = h.create(AMOUNT, EXPIRY, h.payer.pubkey());
    let pay = h.pay();
    let cancel = h.cancel();
    let created = h.send(vec![create.clone()], Actor::Merchant).unwrap();
    let open = h.svm.get_account(&h.invoice).unwrap();
    let paid_meta = h.send(vec![pay.clone()], Actor::Payer).unwrap();
    let paid = h.svm.get_account(&h.invoice).unwrap();
    // Restore the known Open fixture solely to export the cancel ABI from the same public addresses.
    // Normal cancel lifecycle tests above use real create, without resetting terminal state.
    h.svm.set_account(h.invoice, open.clone()).unwrap();
    let cancelled_meta = h.send(vec![cancel.clone()], Actor::Merchant).unwrap();
    let cancelled = h.svm.get_account(&h.invoice).unwrap();
    let event = |logs: &[String]| {
        logs.iter()
            .find_map(|line| line.strip_prefix("Program data: "))
            .unwrap()
            .to_string()
    };
    let json = format!(
        r#"{{"origin":"Rust InstructionData/ToAccountMetas + real SBF LiteSVM accounts","programAddress":"{}","merchant":"{}","payer":"{}","invoiceAddress":"{}","invoiceIdHex":"{}","amountLamports":"{}","expiresSlot":"{}","observedSlot":"100","create":{},"pay":{},"cancel":{},"openHex":"{}","paidHex":"{}","cancelledHex":"{}","createdEventBase64":"{}","paidEventBase64":"{}","cancelledEventBase64":"{}"}}"#,
        rail::id(),
        h.merchant.pubkey(),
        h.payer.pubkey(),
        h.invoice,
        hex(&INVOICE_ID),
        AMOUNT,
        EXPIRY,
        instruction_json(&create),
        instruction_json(&pay),
        instruction_json(&cancel),
        hex(&open.data),
        hex(&paid.data),
        hex(&cancelled.data),
        event(&created.logs),
        event(&paid_meta.logs),
        event(&cancelled_meta.logs)
    );
    if let Ok(path) = std::env::var("RECEIPTRAIL_ABI_OUT") {
        std::fs::write(path, format!("{json}\n")).unwrap();
    }
    assert_eq!(open.data.len(), 131);
    assert_eq!(paid.data.len(), 131);
    assert_eq!(cancelled.data.len(), 131);
    println!(
        "METRIC abi_vectors=3 instruction_lengths={},{},{} account_bytes=131",
        create.data.len(),
        pay.data.len(),
        cancel.data.len()
    );
}
