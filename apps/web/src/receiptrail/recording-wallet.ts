import { getWallets } from '@wallet-standard/app';
import type { Wallet, WalletAccount } from '@wallet-standard/base';
import type { SolanaSignTransactionInput } from '@solana/wallet-standard-features';
import { Buffer } from 'buffer';
import bs58 from 'bs58';

async function bridge<T>(path: string, payload: unknown): Promise<T> {
  const token = sessionStorage.getItem('receiptrail-recording-token');
  if (!token) throw new Error('Local recording session is unavailable.');
  const result = await fetch('http://127.0.0.1:4318/' + path, { method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(payload) });
  if (!result.ok) throw new Error('Recording wallet: ' + await result.text());
  return result.json();
}
type Actor = { role: string; address: string };
function makeWallet(actor: Actor): Wallet {
  const chain = 'solana:devnet' as const;
  const account: WalletAccount = { address: actor.address, publicKey: bs58.decode(actor.address), chains: [chain], features: ['solana:signTransaction'] };
  let accounts: readonly WalletAccount[] = [];
  const listeners = new Set<(p: { accounts: readonly WalletAccount[] }) => void>();
  function change(value: readonly WalletAccount[]) { accounts = value; for (const listener of listeners) listener({ accounts }); }
  return { version: '1.0.0', name: 'Local demo wallet, devnet · ' + actor.role, icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aJ6cAAAAASUVORK5CYII=',
    chains: [chain], get accounts() { return accounts; }, features: {
      'standard:connect': { version: '1.0.0', connect: async () => { change([account]); return { accounts }; } },
      'standard:disconnect': { version: '1.0.0', disconnect: async () => change([]) },
      'standard:events': { version: '1.0.0', on: (_: string, fn: (p: { accounts: readonly WalletAccount[] }) => void) => { listeners.add(fn); return () => listeners.delete(fn); } },
      'solana:signTransaction': { version: '1.0.0', supportedTransactionVersions: ['legacy'], signTransaction: async (input: SolanaSignTransactionInput) => {
        if (input.account !== account || !accounts.includes(account) || input.chain !== chain) throw new Error('Recording wallet account or network changed.');
        const data = await bridge<{ signed: string }>('sign', { address: actor.address, bytes: Buffer.from(input.transaction).toString('base64') });
        return [{ signedTransaction: new Uint8Array(Buffer.from(data.signed, 'base64')) }];
      } },
    } };
}
export async function registerRecordingWallets() {
  if (!import.meta.env.DEV || location.origin !== 'http://127.0.0.1:4317') throw new Error('Local recording origin required.');
  const actors = await bridge<Actor[]>('actors', {});
  getWallets().register(...actors.map(makeWallet));
}
