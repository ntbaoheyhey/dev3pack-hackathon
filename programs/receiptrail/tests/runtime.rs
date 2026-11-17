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
        Instruction::new_with_bytes(
            rail::id(),
            &rail::instruction::CreateInvoice {
                invoice_id: INVOICE_ID,
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
        let failure = self.send(vec![ix], actor).unwrap_err();
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
