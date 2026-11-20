import test from 'node:test';
import assert from 'node:assert/strict';
import { createWalletStandardConnector } from '@solana/client';
import { ReceiptRailMockWalletConnection } from '../src/receiptrail/mock-wallet-connection.ts';
import { createMockWallet, registerMockWallets, resetMockWalletsForTest } from '../src/receiptrail/mock-wallets.ts';
import { getWallets } from '@wallet-standard/app';
import { DEFAULT_MERCHANT, DEFAULT_PAYER } from '../src/receiptrail/adapter.ts';

function setup() {
  const merchant = createMockWallet('mock merchant', DEFAULT_MERCHANT.address);
  const payer = createMockWallet('mock payer', DEFAULT_PAYER.address);
  const reject = createMockWallet('mock reject', DEFAULT_MERCHANT.address, true);
  const connection = new ReceiptRailMockWalletConnection([merchant, payer, reject]);
  const stop = connection.subscribe(() => {});
  return { merchant, payer, reject, connection, stop };
}

test('repeated fixture registration retains four exact fixtures and excludes same-name external wallets', () => {
  resetMockWalletsForTest();
  const external = createMockWallet('Tiệm Cà phê (Merchant)', DEFAULT_MERCHANT.address);
  const unregister = getWallets().register(external);
  try {
    const first = registerMockWallets();
    const second = registerMockWallets();
    assert.equal(second, first);
    assert.equal(second.length, 4);
    assert(!second.includes(external));
    assert(second.every(wallet => getWallets().get().includes(wallet)));
    resetMockWalletsForTest();
    assert(getWallets().get().includes(external));
    assert(first.every(wallet => !getWallets().get().includes(wallet)));
  } finally { resetMockWalletsForTest(); unregister(); }
});

test('mock wallet connect/switch/disconnect/rejection never constructs a network request', async () => {
  const previousFetch = globalThis.fetch;
  let requests = 0;
  globalThis.fetch = async () => { requests++; throw new Error('network prohibited'); };
  const { connection, stop } = setup();
  try {
    assert.equal(connection.getSnapshot().status, 'disconnected');
    await connection.connect(connection.connectors[0].id);
    assert.equal(connection.getSnapshot().wallet.account.address, DEFAULT_MERCHANT.address);
    await connection.connect(connection.connectors[1].id);
    assert.equal(connection.getSnapshot().wallet.account.address, DEFAULT_PAYER.address);
    await connection.disconnect();
    assert.equal(connection.getSnapshot().wallet, null);
    await assert.rejects(connection.connect(connection.connectors[2].id), /rejected/);
    assert.equal(connection.getSnapshot().status, 'error');
    assert.equal(requests, 0);
  } finally { stop(); globalThis.fetch = previousFetch; }
});

test('external connector IDs cannot invoke an extension from the mock connection', async () => {
  const { connection, stop } = setup();
  try {
    const external = createMockWallet('external extension', DEFAULT_MERCHANT.address);
    let calls = 0; external.features['standard:connect'].connect = async () => { calls++; throw new Error('unexpected extension'); };
    await assert.rejects(connection.connect(createWalletStandardConnector(external).id), /ví mock/);
    assert.equal(calls, 0); assert.equal(connection.getSnapshot().status, 'disconnected');
  } finally { stop(); }
});

test('raw account and chain-only changes replace the snapshot; disconnect clears it', async () => {
  const { connection, merchant, stop } = setup();
  try {
    await connection.connect(connection.connectors[0].id); const before = connection.getSnapshot();
    merchant.setAccountAddress(DEFAULT_PAYER.address);
    assert.notEqual(connection.getSnapshot(), before);
    assert.equal(connection.getSnapshot().wallet.account.address, DEFAULT_PAYER.address);
    const changed = connection.getSnapshot(); merchant.setChains(['solana:mainnet']);
    assert.notEqual(connection.getSnapshot(), changed);
    await merchant.features['standard:disconnect'].disconnect();
    assert.equal(connection.getSnapshot().status, 'disconnected');
  } finally { stop(); }
});

test('late connect completion cannot revive a disconnected session', async () => {
  const { connection, merchant, stop } = setup();
  const original = merchant.features['standard:connect'].connect;
  let release;
  merchant.features['standard:connect'].connect = async () => { await new Promise(resolve => { release = resolve; }); return original(); };
  try {
    const pending = connection.connect(connection.connectors[0].id);
    while (!release) await new Promise(resolve => setTimeout(resolve, 0));
    await connection.disconnect(); release(); await pending;
    assert.equal(connection.getSnapshot().wallet, null); assert.equal(merchant.accounts.length, 0);
  } finally { stop(); }
});

test('subscribe cleanup and remount preserve a usable connection without duplicate notifications', async () => {
  const { connection, merchant, stop } = setup(); stop();
  let notifications = 0; const unsubscribe = connection.subscribe(() => { notifications++; });
  await connection.connect(connection.connectors[0].id);
  const before = notifications; merchant.setChains(['solana:devnet']);
  assert.equal(notifications, before + 1);
  unsubscribe(); const after = notifications; merchant.setChains(['solana:mainnet']);
  assert.equal(notifications, after);
});
