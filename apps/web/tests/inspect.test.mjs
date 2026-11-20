import test from 'node:test';
import assert from 'node:assert/strict';
import { DEVNET_GENESIS, DEVNET_RPC, HELLO_PROGRAM, LOADER_V3, inspectProgram, isSolanaAddress } from '../src/lib/inspect.ts';

function transport(results) {
  const calls = [];
  const fetchImpl = async (url, options) => {
    const request = JSON.parse(options.body);
    calls.push({ url, ...request });
    return new Response(JSON.stringify({ jsonrpc: '2.0', id: request.id, result: results[calls.length - 1] }));
  };
  return { calls, fetchImpl };
}
const account = (value, slot = 123) => ({ context: { slot }, value });
const executable = { owner: LOADER_V3, executable: true };

test('base58 validates the decoded 32-byte address, including leading zero bytes', () => {
  assert.equal(isSolanaAddress(HELLO_PROGRAM), true);
  assert.equal(isSolanaAddress('1'.repeat(32)), true);
  for (const value of ['1'.repeat(44), 'z'.repeat(44), '0'.repeat(32), '<script>', '']) assert.equal(isSolanaAddress(value), false);
});
test('bad input makes no RPC request', async () => {
  await assert.rejects(inspectProgram('invalid', { fetchImpl: () => assert.fail('unexpected network') }), { code: 'INVALID_ADDRESS' });
});
test('wrong cluster stops before reading the program', async () => {
  const rpc = transport(['wrong-genesis']);
  await assert.rejects(inspectProgram(HELLO_PROGRAM, rpc), { code: 'WRONG_CLUSTER' });
  assert.equal(rpc.calls.length, 1);
});
test('successful observation uses fixed devnet RPC, confirmed reads, provenance and no writes', async () => {
  const rpc = transport([DEVNET_GENESIS, account(executable)]);
  const result = await inspectProgram(` ${HELLO_PROGRAM} `, { ...rpc, now: () => 0 });
  assert.deepEqual(result, { programId: HELLO_PROGRAM, state: 'executable', owner: LOADER_V3, slot: 123, observedAt: '1970-01-01T00:00:00.000Z' });
  assert.ok(rpc.calls.every((call) => call.url === DEVNET_RPC));
  assert.deepEqual(rpc.calls.map((call) => call.method), ['getGenesisHash', 'getAccountInfo']);
  assert.deepEqual(rpc.calls[1].params, [HELLO_PROGRAM, { commitment: 'confirmed', encoding: 'base64', dataSlice: { offset: 0, length: 0 } }]);
});
test('missing account and non-executable accounts are not successful deployment claims', async () => {
  const missing = await inspectProgram(HELLO_PROGRAM, transport([DEVNET_GENESIS, account(null)]));
  assert.equal(missing.state, 'missing');
  const wallet = await inspectProgram(HELLO_PROGRAM, transport([DEVNET_GENESIS, account({ owner: '1'.repeat(32), executable: false })]));
  assert.equal(wallet.state, 'not-executable');
});
test('malformed account, owner, slot and RPC envelopes fail closed', async () => {
  for (const value of [undefined, {}, account(executable, -1), account(executable, 1.5), account(executable, '123'), account({ ...executable, owner: 'oops' }), account({ ...executable, executable: 'true' })]) {
    await assert.rejects(inspectProgram(HELLO_PROGRAM, transport([DEVNET_GENESIS, value])), { code: 'BAD_RESPONSE' });
  }
  await assert.rejects(inspectProgram(HELLO_PROGRAM, { fetchImpl: async () => new Response('{"jsonrpc":"2.0","id":99,"result":"anything"}') }), { code: 'BAD_RESPONSE' });
});
test('RPC errors, HTTP failure, throttling and network failure remain explicit', async () => {
  for (const [status, code] of [[429, 'RATE_LIMIT'], [503, 'RPC_ERROR']]) await assert.rejects(inspectProgram(HELLO_PROGRAM, { fetchImpl: async () => new Response('', { status }) }), { code });
  await assert.rejects(inspectProgram(HELLO_PROGRAM, { fetchImpl: async () => new Response('{"jsonrpc":"2.0","id":1,"error":{"code":-32603}}') }), { code: 'RPC_ERROR' });
  await assert.rejects(inspectProgram(HELLO_PROGRAM, { fetchImpl: async () => { throw new TypeError('fetch failed'); } }), { code: 'NETWORK' });
});
test('cancellation and timeout cannot yield a ready result', async () => {
  const controller = new AbortController();
  const fetchImpl = (_url, { signal }) => new Promise((_resolve, reject) => { if (signal.aborted) reject(signal.reason); else signal.addEventListener('abort', () => reject(signal.reason), { once: true }); });
  const waiting = inspectProgram(HELLO_PROGRAM, { fetchImpl, signal: controller.signal });
  controller.abort();
  await assert.rejects(waiting, { code: 'CANCELLED' });
  const keepAlive = setInterval(() => {}, 50);
  try { await assert.rejects(inspectProgram(HELLO_PROGRAM, { fetchImpl, timeoutMs: 5 }), { code: 'TIMEOUT' }); } finally { clearInterval(keepAlive); }
});
