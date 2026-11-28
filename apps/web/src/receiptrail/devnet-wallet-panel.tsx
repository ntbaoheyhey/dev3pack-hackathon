import { useSyncExternalStore } from 'react';
import type { ReceiptRailDevnetWalletConnection } from './devnet-wallet-connection.ts';

export function DevnetWalletPanel({ connection, className = '' }: { connection: ReceiptRailDevnetWalletConnection; className?: string }) {
  const state = useSyncExternalStore(connection.subscribe, connection.getSnapshot);
  return <section className={'wallet-panel ' + className} aria-label="Wallet Standard">
    <h2>Wallet connection</h2>
    {state.selectedAccount && <div><p><strong>{state.selectedWallet?.name}</strong></p><p className="address">{state.selectedAccount.address}</p><button onClick={() => void connection.disconnect()}>Disconnect wallet</button></div>}
    {!state.selectedAccount && <p>Choose a wallet on Solana devnet. You can read any invoice without connecting.</p>}
    {!state.selectedAccount && !state.wallets.length && <p className="notice">No Wallet Standard wallet detected. Enable devnet in Phantom, Solflare or Backpack, then reopen this page.</p>}
    {!state.selectedAccount && state.wallets.map(wallet => <button key={wallet.name} disabled={state.connecting || !wallet.chains.includes('solana:devnet')} onClick={() => void connection.connect(wallet).catch(() => {})}>{wallet.name}</button>)}
    {state.connecting && <p role="status">Approve the connection in your wallet…</p>}
    {state.error && <p role="alert">Could not connect. Check the wallet network and try again. <small>{state.error}</small></p>}
  </section>;
}
