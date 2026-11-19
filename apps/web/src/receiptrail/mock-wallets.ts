import { getWallets } from '@wallet-standard/app';
import { DEFAULT_MERCHANT, DEFAULT_PAYER, OTHER_WALLET } from './adapter.ts';

let registered = false;

export function createMockWallet(
  name: string,
  addr: string,
  shouldReject = false
) {
  const account = {
    address: addr,
    publicKey: new Uint8Array(32),
    chains: ['solana:devnet'] as const,
    features: ['standard:connect', 'standard:disconnect', 'standard:events'] as const,
  };

  let accounts: typeof account[] = [];
  const listeners = new Set<(event: { accounts: typeof account[] }) => void>();

  return {
    version: '1.0.0' as const,
    name,
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=' as const,
    chains: ['solana:devnet'] as const,
    get accounts() {
      return accounts;
    },
    features: {
      'standard:connect': {
        version: '1.0.0',
        connect: async () => {
          if (shouldReject) {
            throw Object.assign(new Error('User rejected the connection request in extension window'), {
              code: 4001,
            });
          }
          accounts = [account];
          for (const l of listeners) l({ accounts });
          return { accounts };
        },
      },
      'standard:disconnect': {
        version: '1.0.0',
        disconnect: async () => {
          accounts = [];
          for (const l of listeners) l({ accounts });
        },
      },
      'standard:events': {
        version: '1.0.0',
        on: (_event: string, listener: (event: { accounts: typeof account[] }) => void) => {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
      },
    },
  };
}

export function registerMockWallets() {
  if (registered) return;
  registered = true;

  const walletsApi = getWallets();
  walletsApi.register(createMockWallet('Tiệm Cà phê (Merchant)', DEFAULT_MERCHANT.address));
  walletsApi.register(createMockWallet('Alice (Payer chỉ định)', DEFAULT_PAYER.address));
  walletsApi.register(createMockWallet('Bob (Ví khác / Hacker)', OTHER_WALLET.address));
  walletsApi.register(createMockWallet('Ví từ chối (Rejection Test)', '4uQeVj5tqViQh7yWWGStvfEG1Zmhx6uasJtWCJziofM', true));
}
