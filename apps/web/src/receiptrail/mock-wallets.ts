import { address, getAddressEncoder } from '@solana/addresses';
import { getWallets } from '@wallet-standard/app';
import { DEFAULT_MERCHANT, DEFAULT_PAYER, OTHER_WALLET } from './adapter.ts';

let registered = false;

type ChainIdentifier = `${string}:${string}`;

export function createMockWallet(
  name: string,
  addr: string,
  shouldReject = false,
  initialChains: readonly ChainIdentifier[] = ['solana:devnet']
) {
  const encodePubkey = (a: string) => new Uint8Array(getAddressEncoder().encode(address(a)));

  let currentChains: ChainIdentifier[] = [...initialChains];
  let account = {
    address: addr,
    publicKey: encodePubkey(addr),
    chains: currentChains,
    features: ['standard:connect', 'standard:disconnect', 'standard:events'] as const,
  };

  let accounts: typeof account[] = [];
  type ChangeEvent = { accounts?: typeof account[]; chains?: readonly ChainIdentifier[] };
  const listeners = new Set<(event: ChangeEvent) => void>();

  const emitChange = (change: ChangeEvent) => {
    for (const l of listeners) {
      try {
        l(change);
      } catch {
        // ignore listener errors
      }
    }
  };

  return {
    version: '1.0.0' as const,
    name,
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=' as const,
    get chains(): readonly ChainIdentifier[] {
      return currentChains;
    },
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
          emitChange({ accounts });
          return { accounts };
        },
      },
      'standard:disconnect': {
        version: '1.0.0',
        disconnect: async () => {
          accounts = [];
          emitChange({ accounts });
        },
      },
      'standard:events': {
        version: '1.0.0',
        on: (_event: string, listener: (event: ChangeEvent) => void) => {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
      },
    },
    // Helper để test phát sinh sự kiện account change hoặc chain change
    switchAccount(newAddr: string) {
      account = {
        address: newAddr,
        publicKey: encodePubkey(newAddr),
        chains: currentChains,
        features: ['standard:connect', 'standard:disconnect', 'standard:events'] as const,
      };
      if (accounts.length > 0) {
        accounts = [account];
        emitChange({ accounts });
      }
    },
    switchChains(newChains: ChainIdentifier[]) {
      currentChains = [...newChains];
      emitChange({ chains: currentChains });
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
