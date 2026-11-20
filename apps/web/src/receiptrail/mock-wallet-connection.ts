import { createWalletStandardConnector } from '@solana/client';
import type { WalletSession } from '@solana/client';
import type { Wallet } from '@wallet-standard/base';
import type { StandardEventsFeature } from '@wallet-standard/features';
import { address } from '@solana/addresses';

// Wallet-only connection state. No RPC client, provider, transport or signing API.
export class ReceiptRailMockWalletConnection {
  readonly connectors;
  private readonly wallets: readonly Wallet[];
  private active: Wallet | null = null;
  private generation = 0;
  private state: { wallet: WalletSession | null; status: 'disconnected' | 'connecting' | 'connected' | 'error' } = { wallet: null, status: 'disconnected' };
  private listeners = new Set<() => void>();
  private stops: (() => void)[] = [];

  constructor(wallets: readonly Wallet[]) {
    this.wallets = [...wallets];
    this.connectors = this.wallets.map(w => createWalletStandardConnector(w));
  }
  getSnapshot = () => this.state;
  private publish(wallet: WalletSession | null, status: typeof this.state.status) {
    this.state = { wallet, status }; for (const listener of this.listeners) listener();
  }
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    if (this.listeners.size === 1) {
      this.stops = this.wallets.map(raw => {
        const events = raw.features['standard:events'] as StandardEventsFeature['standard:events'] | undefined;
        return events?.on('change', () => {
          if (this.active !== raw || !this.state.wallet) return;
          const account = raw.accounts[0];
          if (!account) { ++this.generation; this.active = null; this.publish(null, 'disconnected'); return; }
          try {
            this.publish({ ...this.state.wallet, account: { address: address(account.address), publicKey: new Uint8Array(account.publicKey), label: account.label } }, 'connected');
          } catch { ++this.generation; this.active = null; this.publish(null, 'error'); }
        }) ?? (() => {});
      });
    }
    return () => {
      this.listeners.delete(listener);
      if (!this.listeners.size) { this.stops.forEach(stop => stop()); this.stops = []; }
    };
  };
  connect = async (id: string) => {
    const index = this.connectors.findIndex(c => c.id === id);
    if (index < 0) throw new Error('Chỉ được kết nối ví mock ReceiptRail trong chế độ này.');
    const generation = ++this.generation;
    const previous = this.state.wallet;
    this.active = null; this.publish(null, 'connecting');
    try {
      await previous?.disconnect();
      if (generation !== this.generation) return;
      const session = await this.connectors[index].connect();
      if (generation !== this.generation) { await session.disconnect(); return; }
      this.active = this.wallets[index]; this.publish(session, 'connected');
    } catch (error) {
      if (generation === this.generation) this.publish(null, 'error');
      throw error;
    }
  };
  disconnect = async () => {
    ++this.generation;
    const previous = this.state.wallet;
    this.active = null; this.publish(null, 'disconnected');
    await previous?.disconnect();
  };
}
