import { createWalletStandardConnector } from '@solana/client';
import type { WalletSession } from '@solana/client';
import { getWallets } from '@wallet-standard/app';
import type { Wallet } from '@wallet-standard/base';
import type { StandardEventsFeature } from '@wallet-standard/features';
import { address, getAddressEncoder } from '@solana/addresses';

// SDK 1.7.0 drops account.chains from WalletSession. Inspect the registered wallet
// too; never infer devnet support from an address or the app's RPC endpoint.
export function receiptRailWallet(session: WalletSession | null | undefined, wallets = getWallets().get()) {
  const connectedAddress = session?.account.address ?? null;
  const matches = session ? wallets.filter(w => createWalletStandardConnector(w).id === session.connector.id) : [];
  const raw = matches.length === 1 ? matches[0] : null;
  const account = raw?.accounts.find(a => a.address === connectedAddress);
  let keyMatches = false;
  if (account && connectedAddress) {
    try {
      const expected = getAddressEncoder().encode(address(connectedAddress));
      keyMatches = account.publicKey.length === 32 && expected.every((b, i) => b === account.publicKey[i])
        && session?.account.publicKey?.length === 32 && expected.every((b, i) => b === session.account.publicKey?.[i]);
    } catch { /* Invalid wallet metadata must not enable an action. */ }
  }
  return { address: connectedAddress, raw,
    chainAllowed: !!(keyMatches && raw?.chains.includes('solana:devnet') && account?.chains.includes('solana:devnet')) };
}

// Invalidate synchronously, including chain-only events ignored by the SDK.
// No connect, sign, send or browser automation is performed here.
export function watchReceiptRailWallets(invalidate: () => void, api = getWallets()) {
  const off = new Map<Wallet, () => void>();
  const attach = (...wallets: Wallet[]) => {
    for (const wallet of wallets) {
      if (off.has(wallet)) continue;
      const events = wallet.features['standard:events'] as StandardEventsFeature['standard:events'] | undefined;
      if (events) off.set(wallet, events.on('change', invalidate));
    }
  };
  attach(...api.get());
  const unregister = api.on('unregister', (...wallets) => {
    for (const wallet of wallets) { off.get(wallet)?.(); off.delete(wallet); }
    invalidate();
  });
  const register = api.on('register', (...wallets) => { attach(...wallets); invalidate(); });
  return () => { register(); unregister(); for (const stop of off.values()) stop(); off.clear(); };
}
