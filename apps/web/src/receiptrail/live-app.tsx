import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { FormEvent } from 'react';
import { Buffer } from 'buffer';
import { formatSol, parseSol, PROGRAM_ADDRESS } from '../../../../packages/receiptrail-client/index.mjs';
import type { Invoice } from '../../../../packages/receiptrail-client/index.mjs';
import { checkAttempt, client, connectDevnet, explorer, GENESIS, listReceipts, prepare, readReceipt, submit, verifyCluster } from './devnet.ts';
import type { Action, Attempt, Intent, Quote } from './devnet.ts';
import { ReceiptRailDevnetWalletConnection } from './devnet-wallet-connection.ts';
import { DevnetWalletPanel } from './devnet-wallet-panel.tsx';
import sample from './sample.json';
import './live.css';

const rpc = connectDevnet();
const walletConnection = new ReceiptRailDevnetWalletConnection();
const journalKey = 'receiptrail:' + GENESIS + ':' + PROGRAM_ADDRESS + ':attempts:v1';
const short = (s: string) => s.slice(0, 7) + '…' + s.slice(-6);
const describe = (e: unknown) => e instanceof Error ? e.message : String(e);
const verbs: Record<Action, string> = { create: 'Create invoice', pay: 'Pay invoice', cancel: 'Cancel invoice', retry: 'Retry payment' };
type Page = 'receipt' | 'create' | 'find';
type Receipt = { invoice: Invoice; slot: number; commitment: string; cached?: string };
function readJournal(): Attempt[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(journalKey) ?? '[]');
    return Array.isArray(value) ? value.filter(a => a && Object.hasOwn(verbs, a.action) && typeof a.address === 'string' && typeof a.blockhash === 'string') : [];
  } catch { return []; }
}
function shareLink(address: string) {
  const url = new URL(location.pathname, location.origin);
  url.searchParams.set('invoice', address);
  return url.href;
}
function RailMark() { return <span className="railmark" aria-hidden="true"><i/><i/><i/></span>; }
function ChainLink({ kind, value, children }: { kind: 'address' | 'tx'; value: string; children: React.ReactNode }) {
  return <a href={explorer(kind, value)} target="_blank" rel="noreferrer">{children} <span aria-hidden="true">↗</span></a>;
}

export function LiveApp() {
  const initial = new URLSearchParams(location.search).get('invoice') || sample.address;
  const [address, setAddress] = useState(initial);
  const [lookup, setLookup] = useState('');
  const [page, setPage] = useState<Page>('receipt');
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [reading, setReading] = useState(false);
  const [readError, setReadError] = useState('');
  const [notice, setNotice] = useState('');
  const [walletOpen, setWalletOpen] = useState(false);
  const wallet = useSyncExternalStore(walletConnection.subscribe, walletConnection.getSnapshot);
  const actor = wallet.selectedAccount?.address;
  const [payer, setPayer] = useState('');
  const [amount, setAmount] = useState('');
  const [role, setRole] = useState<'merchant' | 'payer'>('payer');
  const [walletSearch, setWalletSearch] = useState('');
  const [found, setFound] = useState<Invoice[] | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [lost, setLost] = useState(false);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const request = useRef(0);
  const [attempts, setAttempts] = useState<Attempt[]>(readJournal);
  const quoteGeneration = useRef(-1);
  const dialog = useRef<HTMLDialogElement>(null);
  const walletDialog = useRef<HTMLDialogElement>(null);
  const current = receipt?.invoice;
  const history = attempts.filter(a => a.address === address).slice().reverse();
  const unknown = history.some(a => a.state === 'unknown');
  const display = current?.status === 'Open' && BigInt(receipt?.slot ?? 0) >= current.expiresSlot ? 'Expired' : current?.status;
  const demo = address === sample.address;
  const payTx = history.find(a => a.action === 'pay' && a.signature && ['confirmed','finalized'].includes(a.state))?.signature || (demo ? sample.paySignature : null);

  function save(a: Attempt) {
    const all = readJournal();
    const matching = (item: Attempt) => item.address === a.address && item.signer === a.signer && item.action === a.action && item.blockhash === a.blockhash;
    const next = [...all.filter(item => !matching(item)), a];
    localStorage.setItem(journalKey, JSON.stringify(next));
    setAttempts(next);
  }
  const refresh = useCallback(async (target: string) => {
    const id = ++request.current;
    setReading(true); setReadError('');
    try {
      await verifyCluster(rpc);
      const data = await readReceipt(rpc, target, target === sample.address ? 'finalized' : 'confirmed');
      if (id === request.current) setReceipt(data);
    } catch (e) {
      if (id !== request.current) return;
      setReadError(describe(e));
      if (target === sample.address) {
        const invoice = await client.decodeInvoice({ ...sample, data: new Uint8Array(Buffer.from(sample.data, 'base64')) });
        if (id === request.current) setReceipt({ invoice, slot: sample.contextSlot, commitment: sample.commitment, cached: sample.observedAt });
      } else { setReceipt(null); }
    } finally { if (id === request.current) setReading(false); }
  }, []);
  useEffect(() => { setReceipt(null); void refresh(address); return () => { request.current++; }; }, [address, refresh]);
  useEffect(() => { setQuote(null); setFound(null); }, [wallet.generation]);
  useEffect(() => { const el = dialog.current; if (quote && el && !el.open) el.showModal(); else if (!quote && el?.open) el.close(); }, [quote]);
  useEffect(() => { const el = walletDialog.current; if (walletOpen && el && !el.open) el.showModal(); else if (!walletOpen && el?.open) el.close(); }, [walletOpen]);
  useEffect(() => {
    const listener = () => { setAddress(new URLSearchParams(location.search).get('invoice') || sample.address); setPage('receipt'); setQuote(null); };
    window.addEventListener('popstate', listener); return () => window.removeEventListener('popstate', listener);
  }, []);
  function select(target: string) {
    const url = new URL(location.href); url.searchParams.set('invoice', target);
    window.history.replaceState(null, '', url); setAddress(target); setPage('receipt'); setQuote(null);
  }
  function navigate(next: Page) { setPage(next); setNotice(''); setQuote(null); }
  async function run(job: () => Promise<void>) {
    if (busyRef.current) return;
    busyRef.current = true; setBusy(true); setNotice('');
    try { await job(); } catch (e) { setNotice(describe(e)); }
    finally { busyRef.current = false; setBusy(false); }
  }
  async function review(intent: Intent) {
    if (!actor) { setWalletOpen(true); return; }
    const gen = wallet.generation;
    const next = await prepare(rpc, actor, intent);
    if (walletConnection.getSnapshot().generation !== gen) throw new Error('The selected wallet changed. Review again.');
    quoteGeneration.current = gen; setQuote(next);
  }
  function create(e: FormEvent) {
    e.preventDefault(); void run(async () => {
      if (!actor) { setWalletOpen(true); return; }
      const slot = await rpc.getSlot('confirmed');
      await review({ action: 'create', merchant: actor, payer: payer.trim(), invoiceId: crypto.getRandomValues(new Uint8Array(32)),
        amountLamports: parseSol(amount), expiresSlot: BigInt(slot) + 10000n });
    });
  }
  async function checkAll(target: string) {
    for (const a of readJournal().filter(item => item.address === target && ['unknown','confirmed'].includes(item.state))) {
      const next = await checkAttempt(rpc, a);
      if (next.state !== a.state) save(next);
    }
    await refresh(target);
  }
  async function approve() {
    if (!quote || !wallet.selectedAccount || !wallet.selectedWallet) return;
    const pending = quote;
    const gen = quoteGeneration.current;
    setQuote(null);
    const result = await submit(rpc, pending, wallet.selectedWallet, wallet.selectedAccount,
      () => walletConnection.getSnapshot().generation === gen, save, pending.action === 'pay' && lost);
    select(pending.address); setLost(false);
    if (result.unknown) {
      setNotice(pending.action === 'pay' && lost ? 'Simulated lost response. Payment status is unknown. Recheck this invoice before paying again.' : 'The network response is uncertain. Recheck this invoice and signature.');
      return;
    }
    setNotice('Submitted to Solana. Checking the transaction…');
    for (let i = 0; i < 9; i++) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      const next = await checkAttempt(rpc, result.attempt);
      if (next.state !== 'unknown') {
        save(next); await refresh(pending.address);
        if (next.state === 'failed') {
          setNotice(pending.action === 'retry' ? 'Retry rejected. Inspect the failed transaction on Explorer. The receipt remains Paid.' : 'The transaction failed on chain. Check its details on Explorer.');
        } else { setNotice(verbs[pending.action] + ' confirmed on devnet.'); }
        return;
      }
    }
    setNotice('Awaiting confirmation. Use Recheck receipt for the latest result.');
  }
  function action(kind: 'pay' | 'cancel' | 'retry') {
    if (current) void run(() => review({ action: kind, address, terms: current }));
  }

  return <div className="live-shell">
    <a className="skip" href="#content">Skip to receipt</a>
    <header className="top"><button className="brand" onClick={() => { setNotice(''); select(sample.address); }}><RailMark/>ReceiptRail</button>
      <div className="top-actions"><span className="network"><i/> Solana devnet</span><button className="wallet-button" onClick={() => setWalletOpen(true)}>{actor ? short(actor) : 'Connect wallet'}</button></div></header>
    <main id="content"><div className="intro"><div><h1>{page === 'receipt' ? 'Payment receipt' : page === 'create' ? 'Create an invoice' : 'Find an invoice'}</h1>
      <p>{page === 'receipt' ? 'A shared record of what settled on Solana.' : page === 'create' ? 'Set the payer, amount and expiry before you ask for a signature.' : 'Open a receipt by address or find invoices for a wallet.'}</p></div>
      <nav aria-label="Workspace">{(['receipt','create','find'] as const).map((p, i) => <button aria-current={page === p ? 'page' : undefined} className={page === p ? 'active' : ''} key={p} onClick={() => navigate(p)}>{['Receipt','Create','Find'][i]}</button>)}</nav></div>
    {notice && <p className="feedback" role="status">{notice}</p>}
    {page === 'receipt' && <div className="workspace"><section className="ticket" aria-label="Invoice receipt">
      <div className="paperhead"><span><RailMark/> RECEIPTRAIL</span><span>{demo ? 'DEMO INVOICE' : 'SOL INVOICE'}</span></div>
      {current && receipt ? <><div className="ticket-amount"><span className="label">Invoice amount</span><div className="amount">{formatSol(current.amountLamports)} <small>SOL</small></div>
        <span data-testid="receipt-status" className={'stamp state-' + display}>{display === 'Paid' ? '✓ ' : ''}{display}</span></div>
        <div className="perforation"/><dl className="fields"><dt>Invoice account</dt><dd><ChainLink kind="address" value={address}>{short(address)}</ChainLink></dd>
        <dt>Merchant</dt><dd><ChainLink kind="address" value={current.merchant}>{short(current.merchant)}</ChainLink></dd>
        <dt>Payer</dt><dd><ChainLink kind="address" value={current.payer}>{short(current.payer)}</ChainLink></dd>
        {current.status === 'Paid' && <><dt>Paid at slot</dt><dd>{current.paidSlot.toLocaleString('en-US')}</dd></>}
        <dt>Expiry slot</dt><dd>{current.expiresSlot.toLocaleString('en-US')}</dd>
        <dt>Commitment</dt><dd>{receipt.commitment}</dd></dl>
        <div className="ticket-foot"><div className="receipt-stripes" aria-hidden="true"/><span>{receipt.cached ? 'CACHED SNAPSHOT' : 'READ FROM DEVNET'}</span></div>
        {receipt.cached && <p className="notice">Cached at {receipt.cached}. RPC is unavailable. Recheck for live data.</p>}
      </> : <div className="empty" role="status"><h2>{reading ? 'Reading Solana devnet…' : 'Receipt unavailable'}</h2><p>{reading ? 'Checking the invoice account and its program owner.' : readError}</p></div>}
      </section><aside><section className="side-card"><h2>Verify this payment</h2><p>{current?.status === 'Paid' ? 'The invoice is settled. Both parties can check the same receipt, even after a lost response.' : 'Read the invoice account and confirm the wallet, amount and settlement status.'}</p>
        <div className="buttons"><button className="primary" disabled={busy || reading} onClick={() => void run(() => checkAll(address))}>{reading ? 'Reading devnet…' : 'Recheck receipt'}</button>
        <ChainLink kind="address" value={address}>Open on Explorer</ChainLink>{payTx && <ChainLink kind="tx" value={payTx}>Payment transaction</ChainLink>}
        <button className="text-button" onClick={() => void run(async () => { await navigator.clipboard.writeText(shareLink(address)); setNotice('Receipt link copied.'); })}>Copy receipt link</button></div></section>
        {current && <section className="side-card"><h2>Payment actions</h2>{!actor ? <><p>Connect the merchant or designated payer wallet to act on this invoice.</p><button onClick={() => setWalletOpen(true)}>Choose wallet</button></> :
        <><p className="subtle">{actor === current.payer ? 'Connected as payer' : actor === current.merchant ? 'Connected as merchant' : 'Connected as a viewer'}</p>
        {actor === current.payer && display === 'Open' && <><label className="check"><input type="checkbox" checked={lost} onChange={e => setLost(e.target.checked)}/> Simulate lost response after payment</label><button disabled={busy || unknown || !!receipt?.cached} onClick={() => action('pay')}>Review payment</button></>}
        {actor === current.merchant && current.status === 'Open' && <button disabled={busy || unknown || !!receipt?.cached} onClick={() => action('cancel')}>Review cancellation</button>}
        {actor === current.payer && current.status === 'Paid' && <><p>Test a second transaction against this paid invoice. A rejected transaction can still incur a network fee.</p><button disabled={busy || unknown || !!receipt?.cached} onClick={() => action('retry')}>Retry payment (new transaction)</button></>}
        </>}</section>}</aside>
      {history.length > 0 && <section className="activity"><h2>Transaction history</h2><p>Attempts saved in this browser for this invoice.</p><ul>{history.map(a => <li key={a.action + a.blockhash}><strong>{verbs[a.action]}</strong><span>{a.state === 'failed' && a.action === 'retry' ? 'Rejected on chain' : a.state}</span>{a.signature && <ChainLink kind="tx" value={a.signature}>{short(a.signature)}</ChainLink>}</li>)}</ul></section>}
    </div>}
    {page === 'create' && <section className="form-card"><form onSubmit={create}><h2>Invoice terms</h2><label>Merchant wallet<input readOnly value={actor || 'Connect your devnet wallet'}/></label><label>Payer address<input required value={payer} onChange={e => setPayer(e.target.value)} placeholder="Solana public address" autoComplete="off" spellCheck={false}/></label>
      <label>Amount in SOL<input required inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.001"/></label>
      <p>Expires 10,000 slots after preparation. The exact slot, network fee and account rent appear in your review.</p>
      <button className="primary" disabled={busy} type="submit">{busy ? 'Preparing…' : 'Review invoice'}</button></form></section>}
    {page === 'find' && <div className="find-grid"><form className="form-card" onSubmit={e => { e.preventDefault(); setNotice(''); select(lookup.trim()); }}><h2>Open by invoice address</h2><label>Invoice account<input value={lookup} required onChange={e => setLookup(e.target.value)} spellCheck={false} placeholder="Solana invoice address"/></label><button className="primary">Open receipt</button></form>
      <form className="form-card" onSubmit={e => { e.preventDefault(); setFound(null); void run(async () => setFound(await listReceipts(rpc, walletSearch.trim() || actor || '', role))); }}><h2>Find by wallet</h2><label>Wallet address<input value={walletSearch} onChange={e => setWalletSearch(e.target.value)} required={!actor} placeholder={actor || 'Solana public address'}/></label>
      <label>Wallet role<select value={role} onChange={e => setRole(e.target.value as 'merchant' | 'payer')}><option value="payer">Payer</option><option value="merchant">Merchant</option></select></label><button disabled={busy}>Find invoices</button>
      {found && <ul>{found.length ? found.map(f => <li key={f.address}><button type="button" onClick={() => select(f.address)}>{short(f.address)} · {f.status} · {formatSol(f.amountLamports)} SOL</button></li>) : <li>No invoices found.</li>}</ul>}</form></div>}
    </main><footer><span><RailMark/> ReceiptRail</span><span>Native SOL · Devnet</span><a href="./mock/">Mock sandbox</a><a href="https://github.com/ntbaoheyhey/dev3pack-hackathon">Source ↗</a></footer>
    <dialog ref={walletDialog} onCancel={() => setWalletOpen(false)}><DevnetWalletPanel connection={walletConnection}/><button onClick={() => setWalletOpen(false)}>Close wallet panel</button></dialog>
    <dialog ref={dialog} onCancel={() => setQuote(null)}>{quote && <><h2>{verbs[quote.action]} review</h2><p>Solana devnet · Review these terms before signing.</p><dl className="review-fields">
      <dt>Invoice</dt><dd>{quote.address}</dd><dt>Merchant</dt><dd>{quote.merchant}</dd><dt>Payer</dt><dd>{quote.payer}</dd>
      <dt>Invoice amount</dt><dd>{formatSol(quote.amount)} SOL</dd><dt>Expiry slot</dt><dd>{quote.expiry.toString()}</dd>
      <dt>Network fee</dt><dd>{formatSol(BigInt(quote.fee))} SOL</dd><dt>Account rent</dt><dd>{formatSol(BigInt(quote.rent))} SOL</dd></dl>
      {quote.action === 'retry' && <p className="notice">Simulation returned InvoiceNotOpen. Signing sends a fresh transaction to demonstrate rejection. Budget for the network fee.</p>}
      <div className="buttons"><button className="primary" disabled={busy} onClick={() => void run(approve)}>Sign and submit</button><button onClick={() => setQuote(null)}>Back</button></div></>}</dialog>
  </div>;
}
