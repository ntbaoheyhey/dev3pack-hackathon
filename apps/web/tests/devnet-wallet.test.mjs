import test from 'node:test';
import assert from 'node:assert/strict';
import { address, getAddressEncoder } from '@solana/addresses';
import { ReceiptRailDevnetWalletConnection, formatWalletError } from '../src/receiptrail/devnet-wallet-connection.ts';
import { DEFAULT_MERCHANT, DEFAULT_PAYER, OTHER_WALLET } from '../src/receiptrail/adapter.ts';

function createTestWallet({
  name = 'Test Devnet Wallet',
  addressStr = DEFAULT_MERCHANT.address,
  chains = ['solana:devnet'],
  accountChains = ['solana:devnet'],
  rejectError = null,
  connectDelay = 0,
} = {}) {
  let currentAccount = {
    address: addressStr,
    publicKey: new Uint8Array(getAddressEncoder().encode(address(addressStr))),
    chains: [...accountChains],
    features: ['standard:connect', 'standard:disconnect', 'standard:events'],
  };

  let accounts = [];
  const eventListeners = new Set();
  let disconnectCallCount = 0;
  let connectCallCount = 0;

  const wallet = {
    version: '1.0.0',
    name,
    icon: 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=',
    chains: [...chains],
    get accounts() {
      return accounts;
    },
    get disconnectCallCount() {
      return disconnectCallCount;
    },
    get connectCallCount() {
      return connectCallCount;
    },
    setAccountAddress(nextAddress) {
      currentAccount = {
        ...currentAccount,
        address: nextAddress,
        publicKey: new Uint8Array(getAddressEncoder().encode(address(nextAddress))),
      };
      if (accounts.length) accounts = [currentAccount];
      for (const listener of eventListeners) {
        listener({ accounts });
      }
    },
    setChains(nextChains) {
      currentAccount = { ...currentAccount, chains: [...nextChains] };
      wallet.chains = [...nextChains];
      if (accounts.length) accounts = [currentAccount];
      for (const listener of eventListeners) {
        listener({ chains: [...nextChains] });
      }
    },
    triggerDisconnect() {
      accounts = [];
      for (const listener of eventListeners) {
        listener({ accounts: [] });
      }
    },
    features: {
      'standard:connect': {
        version: '1.0.0',
        connect: async () => {
          connectCallCount++;
          if (connectDelay > 0) {
            await new Promise(resolve => setTimeout(resolve, connectDelay));
          }
          if (rejectError) {
            throw rejectError;
          }
          accounts = [currentAccount];
          for (const listener of eventListeners) {
            listener({ accounts });
          }
          return { accounts };
        },
      },
      'standard:disconnect': {
        version: '1.0.0',
        disconnect: async () => {
          disconnectCallCount++;
          accounts = [];
          for (const listener of eventListeners) {
            listener({ accounts: [] });
          }
        },
      },
      'standard:events': {
        version: '1.0.0',
        on: (_event, listener) => {
          eventListeners.add(listener);
          return () => eventListeners.delete(listener);
        },
      },
    },
  };

  return wallet;
}

function createMockRegistry(initialWallets = []) {
  let wallets = [...initialWallets];
  const listeners = {
    register: new Set(),
    unregister: new Set(),
  };

  return {
    get: () => Object.freeze([...wallets]),
    on: (event, callback) => {
      if (!listeners[event]) return () => {};
      listeners[event].add(callback);
      return () => listeners[event].delete(callback);
    },
    register: (wallet) => {
      wallets = [...wallets, wallet];
      for (const cb of listeners.register) cb(wallet);
      return () => {
        wallets = wallets.filter(w => w !== wallet);
        for (const cb of listeners.unregister) cb(wallet);
      };
    },
  };
}

test('T41: discovery, dynamic register/unregister and isolation from demo fixtures', () => {
  const phantom = createTestWallet({ name: 'Phantom (Devnet)' });
  const registry = createMockRegistry([phantom]);

  const connection = new ReceiptRailDevnetWalletConnection(registry);
  try {
    const initial = connection.getSnapshot();
    assert.equal(initial.wallets.length, 1);
    assert.equal(initial.wallets[0].name, 'Phantom (Devnet)');
    assert.equal(initial.selectedWallet, null);
    assert.equal(initial.status, 'disconnected');

    // Register Solflare dynamically
    const solflare = createTestWallet({ name: 'Solflare (Devnet)' });
    const unregisterSolflare = registry.register(solflare);

    const afterRegister = connection.getSnapshot();
    assert.equal(afterRegister.wallets.length, 2);
    assert(afterRegister.wallets.includes(solflare));

    // Unregister Solflare
    unregisterSolflare();
    const afterUnregister = connection.getSnapshot();
    assert.equal(afterUnregister.wallets.length, 1);
    assert(!afterUnregister.wallets.includes(solflare));
  } finally {
    connection.destroy();
  }
});

test('T41: connect preserves exact raw wallet and account references on Devnet', async () => {
  const phantom = createTestWallet({ name: 'Phantom', addressStr: DEFAULT_MERCHANT.address });
  const registry = createMockRegistry([phantom]);
  const connection = new ReceiptRailDevnetWalletConnection(registry);

  let notified = 0;
  const unsubscribe = connection.subscribe(() => { notified++; });

  try {
    assert.equal(connection.getSnapshot().status, 'disconnected');
    await connection.connect(phantom);

    const snapshot = connection.getSnapshot();
    assert.equal(snapshot.status, 'connected');
    assert.equal(snapshot.connecting, false);
    assert.equal(snapshot.error, null);
    assert.equal(snapshot.selectedWallet, phantom); // Raw wallet reference identity
    assert.equal(snapshot.selectedAccount.address, DEFAULT_MERCHANT.address);
    assert(snapshot.selectedAccount.chains.includes('solana:devnet'));
    assert(snapshot.generation > 0);
    assert(notified >= 2); // connecting -> connected
  } finally {
    unsubscribe();
    connection.destroy();
  }
});

test('T41: rejection handles diverse errors without assuming code 4001', async () => {
  // Test 1: Phantom code 4001
  const phantomErr = Object.assign(new Error('User rejected the request'), { code: 4001 });
  const phantomReject = createTestWallet({ name: 'Phantom Reject', rejectError: phantomErr });

  // Test 2: Solflare string error without code
  const solflareErr = new Error('User rejected the connection');
  const solflareReject = createTestWallet({ name: 'Solflare Reject', rejectError: solflareErr });

  // Test 3: Backpack window closed error
  const backpackErr = new Error('WalletWindowClosedError: User denied the request');
  const backpackReject = createTestWallet({ name: 'Backpack Reject', rejectError: backpackErr });

  const registry = createMockRegistry([phantomReject, solflareReject, backpackReject]);
  const connection = new ReceiptRailDevnetWalletConnection(registry);

  try {
    // 1. Phantom reject
    await assert.rejects(connection.connect(phantomReject));
    let snapshot = connection.getSnapshot();
    assert.equal(snapshot.status, 'error');
    assert.match(snapshot.error, /từ chối/i);

    // 2. Solflare reject
    await assert.rejects(connection.connect(solflareReject));
    snapshot = connection.getSnapshot();
    assert.equal(snapshot.status, 'error');
    assert.match(snapshot.error, /từ chối/i);

    // 3. Backpack reject
    await assert.rejects(connection.connect(backpackReject));
    snapshot = connection.getSnapshot();
    assert.equal(snapshot.status, 'error');
    assert.match(snapshot.error, /từ chối/i);
  } finally {
    connection.destroy();
  }
});

test('T41: unsupported chains reject safely and provide clear guidance', async () => {
  // Wallet advertising only mainnet
  const mainnetWallet = createTestWallet({
    name: 'Mainnet Only Wallet',
    chains: ['solana:mainnet'],
    accountChains: ['solana:mainnet'],
  });

  // Wallet advertising devnet on wallet, but account only has mainnet
  const mainnetAccountWallet = createTestWallet({
    name: 'Mainnet Account Wallet',
    chains: ['solana:devnet'],
    accountChains: ['solana:mainnet'],
  });

  const registry = createMockRegistry([mainnetWallet, mainnetAccountWallet]);
  const connection = new ReceiptRailDevnetWalletConnection(registry);

  try {
    // Should reject wallet that doesn't support devnet
    await assert.rejects(connection.connect(mainnetWallet), /solana:devnet/);
    assert.equal(connection.getSnapshot().status, 'error');
    assert.match(connection.getSnapshot().error, /solana:devnet/);

    // Should reject account without devnet
    await assert.rejects(connection.connect(mainnetAccountWallet), /solana:devnet/);
    assert.equal(connection.getSnapshot().status, 'error');
    assert.match(connection.getSnapshot().error, /solana:devnet/);
    assert.equal(mainnetAccountWallet.disconnectCallCount, 1); // Orphan cleaned up
  } finally {
    connection.destroy();
  }
});

test('T41: same address with different wallet or new session increments generation', async () => {
  const walletA = createTestWallet({ name: 'Wallet A', addressStr: DEFAULT_PAYER.address });
  const walletB = createTestWallet({ name: 'Wallet B', addressStr: DEFAULT_PAYER.address });
  const registry = createMockRegistry([walletA, walletB]);
  const connection = new ReceiptRailDevnetWalletConnection(registry);

  try {
    await connection.connect(walletA);
    const gen1 = connection.getSnapshot().generation;
    assert.equal(connection.getSnapshot().selectedAccount.address, DEFAULT_PAYER.address);
    assert.equal(connection.getSnapshot().selectedWallet.name, 'Wallet A');

    // Connect Wallet B with identical address
    await connection.connect(walletB);
    const gen2 = connection.getSnapshot().generation;
    assert(gen2 > gen1, 'Generation must increment when switching wallet even with same address');
    assert.equal(connection.getSnapshot().selectedAccount.address, DEFAULT_PAYER.address);
    assert.equal(connection.getSnapshot().selectedWallet.name, 'Wallet B');

    // Re-connect Wallet A
    await connection.connect(walletA);
    const gen3 = connection.getSnapshot().generation;
    assert(gen3 > gen2, 'Generation must increment on re-connection to create a new session');
  } finally {
    connection.destroy();
  }
});

test('T41: events dynamically update account, non-devnet chain, and wallet disconnect', async () => {
  const wallet = createTestWallet({ name: 'Event Wallet', addressStr: DEFAULT_MERCHANT.address });
  const registry = createMockRegistry([wallet]);
  const connection = new ReceiptRailDevnetWalletConnection(registry);

  try {
    await connection.connect(wallet);
    const beforeGen = connection.getSnapshot().generation;

    // 1. Account switch
    wallet.setAccountAddress(OTHER_WALLET.address);
    assert.equal(connection.getSnapshot().selectedAccount.address, OTHER_WALLET.address);
    assert(connection.getSnapshot().generation > beforeGen);

    // 2. Chain switch to non-devnet
    const genBeforeChain = connection.getSnapshot().generation;
    wallet.setChains(['solana:mainnet']);
    assert.equal(connection.getSnapshot().status, 'disconnected');
    assert.equal(connection.getSnapshot().selectedWallet, null);
    assert.match(connection.getSnapshot().error, /không phải Solana Devnet/);
    assert(connection.getSnapshot().generation > genBeforeChain);

    // Reconnect and test external disconnect
    wallet.setChains(['solana:devnet']);
    await connection.connect(wallet);
    assert.equal(connection.getSnapshot().status, 'connected');

    wallet.triggerDisconnect();
    assert.equal(connection.getSnapshot().status, 'disconnected');
    assert.equal(connection.getSnapshot().selectedWallet, null);
  } finally {
    connection.destroy();
  }
});

test('T41: late connect response from abandoned request cannot revive disconnected session', async () => {
  let releaseConnect;
  const delayedWallet = createTestWallet({
    name: 'Delayed Wallet',
    addressStr: DEFAULT_PAYER.address,
  });

  const originalConnect = delayedWallet.features['standard:connect'].connect;
  delayedWallet.features['standard:connect'].connect = async () => {
    await new Promise(resolve => { releaseConnect = resolve; });
    return originalConnect();
  };

  const registry = createMockRegistry([delayedWallet]);
  const connection = new ReceiptRailDevnetWalletConnection(registry);

  try {
    // Initiate connection
    const connectPromise = connection.connect(delayedWallet);
    while (!releaseConnect) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    // User cancels/disconnects while popup was open
    await connection.disconnect();
    assert.equal(connection.getSnapshot().status, 'disconnected');
    assert.equal(connection.getSnapshot().selectedWallet, null);

    // Delayed promise now resolves
    releaseConnect();
    await connectPromise;

    // Must remain disconnected and must clean up orphan session
    assert.equal(connection.getSnapshot().status, 'disconnected');
    assert.equal(connection.getSnapshot().selectedWallet, null);
    assert(delayedWallet.disconnectCallCount >= 1, 'Orphan connection must be disconnected');
  } finally {
    connection.destroy();
  }
});

test('T41: subscription cleanup and destroy prevent memory leaks and reject post-destroy actions', async () => {
  const wallet = createTestWallet({ name: 'Cleanup Wallet' });
  const registry = createMockRegistry([wallet]);
  const connection = new ReceiptRailDevnetWalletConnection(registry);

  let notified = 0;
  const unsubscribe = connection.subscribe(() => { notified++; });

  await connection.connect(wallet);
  const countAtConnect = notified;

  unsubscribe();
  wallet.setAccountAddress(OTHER_WALLET.address);
  assert.equal(notified, countAtConnect, 'Unsubscribed listener must receive no more notifications');

  // Destroy connection
  connection.destroy();
  assert.equal(connection.getSnapshot().status, 'disconnected');

  // Any subsequent connect must reject immediately
  await assert.rejects(connection.connect(wallet), /Connection đã bị đóng/);
});

test('T41: zero network/fetch calls and zero sign/send API on devnet connection', async () => {
  const previousFetch = globalThis.fetch;
  let fetchCount = 0;
  globalThis.fetch = async () => {
    fetchCount++;
    throw new Error('NETWORK_ACCESS_PROHIBITED');
  };

  const wallet = createTestWallet({ name: 'Zero Net Wallet' });
  const registry = createMockRegistry([wallet]);
  const connection = new ReceiptRailDevnetWalletConnection(registry);

  try {
    // Assert no sign/send on connection contract
    assert.equal(typeof connection.signTransaction, 'undefined');
    assert.equal(typeof connection.sendTransaction, 'undefined');
    assert.equal(typeof connection.signAndSendTransaction, 'undefined');

    // Run connection lifecycle
    await connection.connect(wallet);
    wallet.setAccountAddress(OTHER_WALLET.address);
    await connection.disconnect();

    // Verify 0 network requests
    assert.equal(fetchCount, 0, 'Devnet wallet connection must perform zero network/RPC requests');
  } finally {
    connection.destroy();
    globalThis.fetch = previousFetch;
  }
});
