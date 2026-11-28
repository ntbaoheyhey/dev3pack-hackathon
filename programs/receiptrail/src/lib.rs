use anchor_lang::prelude::*;
use anchor_lang::system_program::{self, Transfer};

// Public hash-derived identifier for local VM tests only. No deployment keypair exists.
declare_id!("8NGSPufBmGB1oHqaZpY1jhJYz1X4gqFiNXCQmxfapYko");

pub const INVOICE_SEED: &[u8] = b"invoice-v1";
pub const VERSION: u8 = 1;
pub const OPEN: u8 = 0;
pub const PAID: u8 = 1;
pub const CANCELLED: u8 = 2;

#[program]
pub mod receiptrail {
    use super::*;

    pub fn create_invoice(
        ctx: Context<CreateInvoice>,
        invoice_id: [u8; 32],
        payer: Pubkey,
        amount_lamports: u64,
        expires_slot: u64,
    ) -> Result<()> {
        let slot = Clock::get()?.slot;
        require!(amount_lamports > 0, ReceiptError::InvalidAmount);
        require!(expires_slot > slot, ReceiptError::InvalidExpiry);
        require_keys_neq!(payer, Pubkey::default(), ReceiptError::InvalidWallet);
        require_keys_neq!(
            payer,
            ctx.accounts.merchant.key(),
            ReceiptError::AliasedRoles
        );
        require_keys_neq!(
            payer,
            ctx.accounts.invoice.key(),
            ReceiptError::AliasedRoles
        );
        let invoice = &mut ctx.accounts.invoice;
        invoice.set_inner(Invoice {
            version: VERSION,
            bump: ctx.bumps.invoice,
            merchant: ctx.accounts.merchant.key(),
            payer,
            invoice_id,
            amount_lamports,
            expires_slot,
            status: OPEN,
            paid_slot: 0,
        });
        emit!(InvoiceCreated {
            invoice: invoice.key(),
            merchant: invoice.merchant,
            payer,
            invoice_id,
            amount_lamports,
            expires_slot,
        });
        Ok(())
    }

    pub fn pay_invoice(ctx: Context<PayInvoice>) -> Result<()> {
        let slot = Clock::get()?.slot;
        let invoice = &ctx.accounts.invoice;
        require!(invoice.status == OPEN, ReceiptError::InvoiceNotOpen);
        require!(slot < invoice.expires_slot, ReceiptError::InvoiceExpired);
        require_keys_neq!(invoice.payer, invoice.merchant, ReceiptError::AliasedRoles);
        let amount_lamports = invoice.amount_lamports;
        system_program::transfer(
            CpiContext::new(
                system_program::ID,
                Transfer {
                    from: ctx.accounts.payer.to_account_info(),
                    to: ctx.accounts.merchant.to_account_info(),
                },
            ),
            amount_lamports,
        )?;
        // CPI + state persist together, or the runtime rolls back the whole transaction.
        let invoice = &mut ctx.accounts.invoice;
        invoice.status = PAID;
        invoice.paid_slot = slot;
        emit!(InvoicePaid {
            invoice: invoice.key(),
            payer: invoice.payer,
            amount_lamports,
            paid_slot: slot
        });
        Ok(())
    }

    pub fn cancel_invoice(ctx: Context<CancelInvoice>) -> Result<()> {
        let invoice = &mut ctx.accounts.invoice;
        require!(invoice.status == OPEN, ReceiptError::InvoiceNotOpen);
        invoice.status = CANCELLED;
        emit!(InvoiceCancelled {
            invoice: invoice.key(),
            merchant: invoice.merchant,
            cancelled_slot: Clock::get()?.slot
        });
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(invoice_id: [u8; 32])]
pub struct CreateInvoice<'info> {
    #[account(mut, owner = system_program::ID, constraint = merchant.data_is_empty() @ ReceiptError::InvalidWallet)]
    pub merchant: Signer<'info>,
    #[account(init, payer = merchant, space = 8 + Invoice::INIT_SPACE,
        seeds = [INVOICE_SEED, merchant.key().as_ref(), invoice_id.as_ref()], bump)]
    pub invoice: Account<'info, Invoice>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PayInvoice<'info> {
    #[account(mut,
        seeds = [INVOICE_SEED, invoice.merchant.as_ref(), invoice.invoice_id.as_ref()], bump = invoice.bump,
        has_one = payer @ ReceiptError::WrongPayer,
        has_one = merchant @ ReceiptError::WrongMerchant,
        constraint = invoice.version == VERSION @ ReceiptError::WrongVersion)]
    pub invoice: Account<'info, Invoice>,
    #[account(mut, owner = system_program::ID, constraint = payer.data_is_empty() @ ReceiptError::InvalidWallet)]
    pub payer: Signer<'info>,
    #[account(mut, constraint = merchant.data_is_empty() @ ReceiptError::InvalidWallet)]
    pub merchant: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CancelInvoice<'info> {
    #[account(mut,
        seeds = [INVOICE_SEED, invoice.merchant.as_ref(), invoice.invoice_id.as_ref()], bump = invoice.bump,
        has_one = merchant @ ReceiptError::WrongMerchant,
        constraint = invoice.version == VERSION @ ReceiptError::WrongVersion)]
    pub invoice: Account<'info, Invoice>,
    pub merchant: Signer<'info>,
}

#[account]
#[derive(InitSpace, Debug, PartialEq, Eq)]
pub struct Invoice {
    pub version: u8,
    pub bump: u8,
    pub merchant: Pubkey,
    pub payer: Pubkey,
    pub invoice_id: [u8; 32],
    pub amount_lamports: u64,
    pub expires_slot: u64,
    pub status: u8,
    pub paid_slot: u64,
}

#[error_code]
pub enum ReceiptError {
    #[msg("Invoice amount must be positive")]
    InvalidAmount,
    #[msg("Expiry must be a future slot")]
    InvalidExpiry,
    #[msg("Wallet must be a nonzero system wallet without data")]
    InvalidWallet,
    #[msg("Payer, merchant and invoice must be distinct")]
    AliasedRoles,
    #[msg("Invoice is already paid or cancelled")]
    InvoiceNotOpen,
    #[msg("Invoice has expired")]
    InvoiceExpired,
    #[msg("Signer is not the payer named on this invoice")]
    WrongPayer,
    #[msg("Merchant does not match this invoice")]
    WrongMerchant,
    #[msg("Unsupported invoice version")]
    WrongVersion,
}

#[event]
pub struct InvoiceCreated {
    pub invoice: Pubkey,
    pub merchant: Pubkey,
    pub payer: Pubkey,
    pub invoice_id: [u8; 32],
    pub amount_lamports: u64,
    pub expires_slot: u64,
}
#[event]
pub struct InvoicePaid {
    pub invoice: Pubkey,
    pub payer: Pubkey,
    pub amount_lamports: u64,
    pub paid_slot: u64,
}
#[event]
pub struct InvoiceCancelled {
    pub invoice: Pubkey,
    pub merchant: Pubkey,
    pub cancelled_slot: u64,
}
