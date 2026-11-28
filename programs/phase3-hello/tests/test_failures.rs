use {
    anchor_lang::{
        prelude::Pubkey,
        solana_program::{instruction::Instruction, system_program},
        AccountDeserialize, InstructionData, ToAccountMetas,
    },
    litesvm::LiteSVM,
    solana_keypair::Keypair,
    solana_message::{Message, VersionedMessage},
    solana_signer::Signer,
    solana_transaction::versioned::VersionedTransaction,
};

struct Harness {
    svm: LiteSVM,
    payer: Keypair,
    counter: Pubkey,
}

fn transaction(svm: &mut LiteSVM, payer: &Keypair, ix: Instruction) -> VersionedTransaction {
    // Mỗi giao dịch có blockhash mới: không nhầm replay rejection với lỗi program.
    svm.expire_blockhash();
    let msg = Message::new_with_blockhash(&[ix], Some(&payer.pubkey()), &svm.latest_blockhash());
    VersionedTransaction::try_new(VersionedMessage::Legacy(msg), &[payer]).unwrap()
}

fn initialize(payer: Pubkey, counter: Pubkey) -> Instruction {
    Instruction::new_with_bytes(
        phase3_hello::id(),
        &phase3_hello::instruction::Initialize {}.data(),
        phase3_hello::accounts::Initialize {
            payer,
            counter,
            system_program: system_program::ID,
        }
        .to_account_metas(None),
    )
}

fn increment(authority: Pubkey, counter: Pubkey) -> Instruction {
    Instruction::new_with_bytes(
        phase3_hello::id(),
        &phase3_hello::instruction::Increment {}.data(),
        phase3_hello::accounts::Increment { counter, authority }.to_account_metas(None),
    )
}

fn initialized() -> Harness {
    let payer = Keypair::new();
    let counter = Pubkey::find_program_address(
        &[phase3_hello::constants::COUNTER_SEED],
        &phase3_hello::id(),
    )
    .0;
    let mut svm = LiteSVM::new();
    let bytes = include_bytes!(concat!(
        env!("CARGO_TARGET_TMPDIR"),
        "/../deploy/phase3_hello.so"
    ));
    svm.add_program(phase3_hello::id(), bytes).unwrap();
    svm.airdrop(&payer.pubkey(), 1_000_000_000).unwrap();
    let tx = transaction(&mut svm, &payer, initialize(payer.pubkey(), counter));
    let result = svm.send_transaction(tx).unwrap();
    assert!(result
        .logs
        .iter()
        .any(|line| line.contains("Counter initialized")));
    let account = svm.get_account(&counter).unwrap();
    assert_eq!(account.owner, phase3_hello::id());
    assert_eq!(account.data.len(), 48);
    Harness {
        svm,
        payer,
        counter,
    }
}

fn assert_rejected(h: &mut Harness, tx: VersionedTransaction, reason: &str) {
    let before = h.svm.get_account(&h.counter).unwrap();
    let failure = h.svm.send_transaction(tx).unwrap_err();
    assert!(
        failure.meta.logs.iter().any(|line| line.contains(reason)),
        "{failure:?}"
    );
    let after = h.svm.get_account(&h.counter).unwrap();
    assert_eq!(after.data, before.data);
    assert_eq!(after.lamports, before.lamports);
    assert_eq!(after.owner, before.owner);
}

#[test]
fn another_signer_cannot_increment() {
    let mut h = initialized();
    let bob = Keypair::new();
    h.svm.airdrop(&bob.pubkey(), 1_000_000_000).unwrap();
    let ix = increment(bob.pubkey(), h.counter);
    let tx = transaction(&mut h.svm, &bob, ix);
    assert_rejected(&mut h, tx, "Error Code: Unauthorized");
}

#[test]
fn authority_address_without_signature_is_rejected() {
    let mut h = initialized();
    let bob = Keypair::new();
    h.svm.airdrop(&bob.pubkey(), 1_000_000_000).unwrap();
    let mut ix = increment(h.payer.pubkey(), h.counter);
    ix.accounts
        .iter_mut()
        .find(|a| a.pubkey == h.payer.pubkey())
        .unwrap()
        .is_signer = false;
    let tx = transaction(&mut h.svm, &bob, ix);
    assert_rejected(&mut h, tx, "Error Code: AccountNotSigner");
}

#[test]
fn counter_cannot_be_reset_by_initializing_again() {
    let mut h = initialized();
    let tx = transaction(&mut h.svm, &h.payer, increment(h.payer.pubkey(), h.counter));
    h.svm.send_transaction(tx).unwrap();
    let tx = transaction(
        &mut h.svm,
        &h.payer,
        initialize(h.payer.pubkey(), h.counter),
    );
    assert_rejected(&mut h, tx, "already in use");
}

#[test]
fn maximum_is_enforced_without_mutating_counter() {
    let mut h = initialized();
    for _ in 0..phase3_hello::constants::MAX_COUNT {
        let tx = transaction(&mut h.svm, &h.payer, increment(h.payer.pubkey(), h.counter));
        h.svm.send_transaction(tx).unwrap();
    }
    let account = h.svm.get_account(&h.counter).unwrap();
    let state =
        phase3_hello::state::Counter::try_deserialize(&mut account.data.as_slice()).unwrap();
    assert_eq!(state.count, phase3_hello::constants::MAX_COUNT);
    let tx = transaction(&mut h.svm, &h.payer, increment(h.payer.pubkey(), h.counter));
    assert_rejected(&mut h, tx, "Error Code: CounterOverflow");
}

#[test]
fn unknown_instruction_cannot_modify_counter() {
    let mut h = initialized();
    let ix = Instruction::new_with_bytes(phase3_hello::id(), &[255; 8], vec![]);
    let tx = transaction(&mut h.svm, &h.payer, ix);
    assert_rejected(&mut h, tx, "Error Code: InstructionFallbackNotFound");
}
