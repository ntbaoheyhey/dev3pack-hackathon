// Local browser integration fixture. This HTML is not a Vite build entry and is not published.
// No keypair or signer exists. Exercise the real Wallet Standard connector and production WalletLab.
import { createRoot } from 'react-dom/client';
import { getWallets } from '@wallet-standard/app';
import WalletLab from '../src/WalletLab';
import '../src/styles.css';

const account = {
  address: '11111111111111111111111111111111',
  publicKey: new Uint8Array(32),
  chains: ['solana:devnet'] as const,
  features: ['solana:signTransaction'] as const,
};
let rejectNext = true;
let accounts: typeof account[] = [];
const listeners = new Set<(event: { accounts: typeof account[] }) => void>();
const fixture = {
  version: '1.0.0' as const,
  name: 'Fixture Devnet — test only',
  icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=' as const,
  chains: ['solana:devnet'] as const,
  get accounts() { return accounts; },
  features: {
    'standard:connect': { version: '1.0.0', connect: async () => {
      if (rejectNext) { rejectNext = false; throw Object.assign(new Error('Fixture user rejection'), { code: 4001 }); }
      accounts = [account];
      for (const listener of listeners) listener({ accounts });
      return { accounts };
    } },
    'standard:disconnect': { version: '1.0.0', disconnect: async () => {
      accounts = [];
      for (const listener of listeners) listener({ accounts });
    } },
    'standard:events': { version: '1.0.0', on: (_event: string, listener: (event: { accounts: typeof account[] }) => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    } },
    'solana:signTransaction': { version: '1.0.0', supportedTransactionVersions: ['legacy', 0], signTransaction: async () => {
      throw new Error('Signing is forbidden in this fixture');
    } },
  },
};
getWallets().register(fixture);
createRoot(document.getElementById('root')!).render(<main>
  <p role="note">LOCAL QA FIXTURE — ví giả không có keypair. Lần connect đầu từ chối, lần sau chấp nhận. Không phải bằng chứng ví extension thật.</p>
  <WalletLab />
</main>);
