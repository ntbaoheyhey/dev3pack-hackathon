import type { Wallet, WalletAccount } from '@wallet-standard/base';
import type { StandardConnectFeature, StandardDisconnectFeature, StandardEventsFeature } from '@wallet-standard/features';
import { getWallets } from '@wallet-standard/app';

export interface DevnetWalletSnapshot {
  wallets: readonly Wallet[];
  selectedWallet: Wallet | null;
  selectedAccount: WalletAccount | null;
  generation: number;
  connecting: boolean;
  error: string | null;
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
}

export type WalletRegistryLike = {
  get: () => readonly Wallet[];
  on: (event: 'register' | 'unregister', callback: (...wallets: Wallet[]) => void) => () => void;
};

function isWalletRegistry(source: unknown): source is WalletRegistryLike {
  return (
    typeof source === 'object' &&
    source !== null &&
    'get' in source &&
    typeof (source as Record<string, unknown>).get === 'function' &&
    'on' in source &&
    typeof (source as Record<string, unknown>).on === 'function'
  );
}

export function formatWalletError(err: unknown): string {
  if (!err) return 'Lỗi kết nối ví không xác định.';
  if (typeof err === 'string') {
    if (/reject|cancel|denied|user closed|window closed/i.test(err)) {
      return 'Người dùng đã từ chối yêu cầu kết nối ví trên Devnet.';
    }
    return err;
  }
  const anyErr = err as { code?: number | string; message?: string; name?: string };
  if (anyErr.code === 4001 || anyErr.code === '4001') {
    return 'Người dùng đã từ chối yêu cầu kết nối ví trên Devnet (mã 4001).';
  }
  const message = anyErr.message || anyErr.name || '';
  if (/reject|cancel|denied|user closed|window closed/i.test(message)) {
    return 'Người dùng đã từ chối yêu cầu kết nối ví trên Devnet.';
  }
  return message || 'Lỗi kết nối ví.';
}

export class ReceiptRailDevnetWalletConnection {
  private wallets: readonly Wallet[] = [];
  private selectedWallet: Wallet | null = null;
  private selectedAccount: WalletAccount | null = null;
  private generation = 0;
  private connecting = false;
  private error: string | null = null;
  private status: DevnetWalletSnapshot['status'] = 'disconnected';

  private listeners = new Set<() => void>();
  private activeEventsStop: (() => void) | null = null;
  private registryStops: (() => void)[] = [];
  private isDestroyed = false;

  constructor(walletsSource?: WalletRegistryLike | readonly Wallet[]) {
    if (Array.isArray(walletsSource)) {
      this.wallets = [...walletsSource];
    } else if (isWalletRegistry(walletsSource)) {
      this.initRegistry(walletsSource);
    } else {
      try {
        const appWallets = getWallets();
        this.initRegistry(appWallets);
      } catch {
        this.wallets = [];
      }
    }
  }

  private initRegistry(registry: WalletRegistryLike) {
    this.wallets = [...registry.get()];

    const offRegister = registry.on('register', (...wallets: Wallet[]) => {
      if (this.isDestroyed) return;
      this.wallets = [...new Set([...this.wallets, ...wallets])];
      this.publish();
    });

    const offUnregister = registry.on('unregister', (...wallets: Wallet[]) => {
      if (this.isDestroyed) return;
      this.wallets = this.wallets.filter(wallet => !wallets.includes(wallet));
      if (this.selectedWallet && wallets.includes(this.selectedWallet)) {
        const name = this.selectedWallet.name;
        this.selectedWallet = null;
        this.selectedAccount = null;
        this.status = 'disconnected';
        this.error = 'Ví "' + name + '" đã được gỡ bỏ khỏi trình duyệt.';
        ++this.generation;
        this.cleanupActiveEvents();
      }
      this.publish();
    });

    this.registryStops.push(offRegister, offUnregister);
  }

  private snapshot: DevnetWalletSnapshot | null = null;

  getSnapshot = (): DevnetWalletSnapshot => {
    return this.snapshot ??= {
      wallets: this.wallets,
      selectedWallet: this.selectedWallet,
      selectedAccount: this.selectedAccount,
      generation: this.generation,
      connecting: this.connecting,
      error: this.error,
      status: this.status,
    };
  };

  private publish() {
    this.snapshot = null;
    for (const listener of this.listeners) {
      try {
        listener();
      } catch {
        // Safe guard against listener errors
      }
    }
  }

  subscribe = (listener: () => void): (() => void) => {
    if (this.isDestroyed) return () => {};
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private cleanupActiveEvents() {
    if (this.activeEventsStop) {
      try {
        this.activeEventsStop();
      } catch {}
      this.activeEventsStop = null;
    }
  }

  connect = async (wallet: Wallet): Promise<void> => {
    if (this.isDestroyed) {
      throw new Error('Connection đã bị đóng (destroyed).');
    }

    if (!wallet) {
      throw new Error('Cần cung cấp ví Wallet Standard hợp lệ.');
    }

    const connectFeature = wallet.features['standard:connect'] as StandardConnectFeature['standard:connect'] | undefined;
    if (!connectFeature || typeof connectFeature.connect !== 'function') {
      const err = new Error(`Ví "${wallet.name}" không hỗ trợ Wallet Standard feature "standard:connect".`);
      this.error = err.message;
      this.status = 'error';
      this.publish();
      throw err;
    }

    // Kiểm tra chains trên wallet nếu ví đã khai báo trước
    if (wallet.chains && wallet.chains.length > 0 && !wallet.chains.includes('solana:devnet')) {
      const err = new Error(`Ví "${wallet.name}" không hỗ trợ mạng Solana Devnet (solana:devnet). Vui lòng chuyển mạng trong extension ví.`);
      this.error = err.message;
      this.status = 'error';
      this.publish();
      throw err;
    }

    // Invalidate session trước đó: luôn tăng generation
    const connectGen = ++this.generation;
    const previousWallet = this.selectedWallet;
    this.selectedWallet = null;
    this.selectedAccount = null;
    this.connecting = true;
    this.error = null;
    this.status = 'connecting';
    this.cleanupActiveEvents();
    this.publish();

    // Dọn dẹp phiên trước nếu có
    if (previousWallet) {
      const prevDisconnect = previousWallet.features['standard:disconnect'] as StandardDisconnectFeature['standard:disconnect'] | undefined;
      try {
        await prevDisconnect?.disconnect();
      } catch {}
    }

    // Kiểm tra race: nếu có thao tác disconnect/connect khác xen vào
    if (connectGen !== this.generation || this.isDestroyed) {
      return;
    }

    let output: { accounts?: readonly WalletAccount[] };
    try {
      output = await connectFeature.connect();
    } catch (err: unknown) {
      if (connectGen === this.generation && !this.isDestroyed) {
        this.connecting = false;
        this.status = 'error';
        this.error = formatWalletError(err);
        this.publish();
      }
      throw err;
    }

    // Kiểm tra race sau khi popup người dùng đóng
    if (connectGen !== this.generation || this.isDestroyed) {
      // Bỏ kết quả connect muộn và ngắt kết nối phiên mồ côi
      const orphanDisconnect = wallet.features['standard:disconnect'] as StandardDisconnectFeature['standard:disconnect'] | undefined;
      try {
        await orphanDisconnect?.disconnect();
      } catch {}
      return;
    }

    // Kiểm tra accounts
    const accounts = (output && output.accounts && output.accounts.length > 0)
      ? output.accounts
      : wallet.accounts;

    if (!accounts || accounts.length === 0) {
      const err = new Error(`Ví "${wallet.name}" không cấp quyền cho bất kỳ tài khoản nào.`);
      this.connecting = false;
      this.status = 'error';
      this.error = err.message;
      this.publish();
      throw err;
    }

    // Chỉ chọn account có solana:devnet
    const devnetAccount = accounts.find(acc => acc.chains && acc.chains.includes('solana:devnet'));
    if (!devnetAccount) {
      const err = new Error(`Tài khoản trong ví "${wallet.name}" chưa bật mạng Solana Devnet (solana:devnet). Vui lòng chuyển mạng sang Devnet trong extension ví.`);
      this.connecting = false;
      this.status = 'error';
      this.error = err.message;
      this.publish();

      const orphanDisconnect = wallet.features['standard:disconnect'] as StandardDisconnectFeature['standard:disconnect'] | undefined;
      try {
        await orphanDisconnect?.disconnect();
      } catch {}
      throw err;
    }

    // Kết nối thành công
    this.selectedWallet = wallet;
    this.selectedAccount = devnetAccount;
    this.connecting = false;
    this.error = null;
    this.status = 'connected';
    // Luôn tăng generation khi hoàn tất kết nối phiên/tài khoản mới để invalidate state cũ
    ++this.generation;

    // Đăng ký standard:events change listener
    const events = wallet.features['standard:events'] as StandardEventsFeature['standard:events'] | undefined;
    if (events && typeof events.on === 'function') {
      try {
        this.activeEventsStop = events.on('change', (properties) => {
          if (this.isDestroyed || this.selectedWallet !== wallet) return;

          // Xử lý thay đổi accounts
          if (properties.accounts !== undefined) {
            const nextDevnetAccount = properties.accounts.find(acc => acc.chains && acc.chains.includes('solana:devnet'));
            if (!nextDevnetAccount) {
              this.selectedWallet = null;
              this.selectedAccount = null;
              this.status = 'disconnected';
              this.error = 'Tài khoản đã ngắt kết nối hoặc không còn hỗ trợ Solana Devnet.';
              ++this.generation;
              this.cleanupActiveEvents();
              this.publish();
              return;
            }
            if (nextDevnetAccount !== this.selectedAccount) {
              this.selectedAccount = nextDevnetAccount;
              ++this.generation;
              this.publish();
            }
          }

          // Xử lý thay đổi chains
          if (properties.chains !== undefined) {
            if (!properties.chains.includes('solana:devnet')) {
              this.selectedWallet = null;
              this.selectedAccount = null;
              this.status = 'disconnected';
              this.error = 'Mạng ví đã chuyển sang mạng không phải Solana Devnet.';
              ++this.generation;
              this.cleanupActiveEvents();
              this.publish();
              return;
            }
            ++this.generation;
            this.publish();
          }

          // Xử lý thay đổi features
          if (properties.features !== undefined) {
            ++this.generation;
            this.publish();
          }
        });
      } catch {}
    }

    this.publish();
  };

  disconnect = async (): Promise<void> => {
    ++this.generation;
    this.connecting = false;
    this.error = null;
    this.status = 'disconnected';
    const previousWallet = this.selectedWallet;
    this.selectedWallet = null;
    this.selectedAccount = null;
    this.cleanupActiveEvents();
    this.publish();

    if (previousWallet) {
      const disconnectFeature = previousWallet.features['standard:disconnect'] as StandardDisconnectFeature['standard:disconnect'] | undefined;
      try {
        await disconnectFeature?.disconnect();
      } catch {}
    }
  };

  destroy = (): void => {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    ++this.generation;
    this.connecting = false;
    this.selectedWallet = null;
    this.selectedAccount = null;
    this.status = 'disconnected';

    this.cleanupActiveEvents();

    for (const stop of this.registryStops) {
      try {
        stop();
      } catch {}
    }
    this.registryStops = [];

    this.listeners.clear();
  };
}
