import {writeFile, readFile} from 'node:fs/promises';
import {rpc, RPC, TOKEN_2022, calls} from './rpc.mjs';
import {sha256, base58} from './cluster-proof.mjs';
import {quoteFeeMint, safeRpcInteger, validateSnapshotWindow} from './fee-mint.mjs';

const started = performance.now();
const targetNet = 10000n;
const knownHookMint = 'GE6q1pL6TjYkrc9jwpdCJAKqZDmAscVR7D9dV7MmXPpd';
const explicitMint = process.argv[2];
if (explicitMint && !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(explicitMint)) throw new Error('invalid_mint_address');
const candidates = new Set([knownHookMint]);
if (explicitMint) candidates.add(explicitMint);
const genesisHash = await rpc('getGenesisHash');
if (genesisHash !== 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG') throw new Error('unexpected_devnet_genesis');
let discovery = {mode: 'explicit_mint'};
if (!explicitMint) {
  const filters = [{dataSize: 278}, {memcmp: {offset: 165, bytes: base58(Buffer.from([1, 1, 0]))}}];
  const found = await rpc('getProgramAccounts', [TOKEN_2022, {encoding: 'base64', commitment: 'finalized', withContext: true, dataSlice: {offset: 0, length: 0}, filters}]);
  safeRpcInteger(found.context?.slot);
  if (!Array.isArray(found.value)) throw new Error('invalid_discovery_response');
  discovery = {mode: 'filtered_program_accounts', filters, context: found.context, returnedCount: found.value.length};
  for (const item of found.value.slice(0, 31)) candidates.add(item.pubkey);
}
const addresses = [...candidates].slice(0, 32);
const before = await rpc('getEpochInfo', [{commitment: 'finalized'}]);
safeRpcInteger(before.epoch); safeRpcInteger(before.absoluteSlot);
const snapshot = await rpc('getMultipleAccounts', [addresses, {encoding: 'base64', commitment: 'finalized', minContextSlot: before.absoluteSlot}]);
safeRpcInteger(snapshot.context?.slot);
if (snapshot.value?.length !== addresses.length) throw new Error('incomplete_mint_snapshot');
const after = await rpc('getEpochInfo', [{commitment: 'finalized', minContextSlot: snapshot.context.slot}]);
const epoch = validateSnapshotWindow(before, snapshot.context.slot, after);
const reports = addresses.map((mint, i) => {
  try { return {mint, ...quoteFeeMint(snapshot.value[i], epoch, targetNet)}; }
  catch (error) { return {mint, status: 'NOT_QUOTED', reason: error.message}; }
});
const supported = reports.filter(x => x.status === 'FEE_QUOTE_ONLY');
const hashes = {};
for (const name of ['rpc.mjs', 'cluster-proof.mjs', 'netpay.mjs', 'fee-mint.mjs', 'netpay-live.mjs']) hashes[name] = sha256(await readFile(new URL(name, import.meta.url)));
const result = {runAtUtc: new Date().toISOString(), node: process.version, rpc: RPC, genesisHash, durationMs: Math.round(performance.now() - started),
  scriptHashes: hashes, searchLimit: {filteredQueries: explicitMint ? 0 : 1, mintReads: 32, responseBytes: 6000000}, discovery, epochBefore: before, epochAfter: after,
  rawSnapshot: {addresses, ...snapshot}, reports, supportedQuoteCount: supported.length, rpcCalls: calls, writesToChain: 0,
  status: supported.length ? 'SUPPORTED_MINT_QUOTED' : 'NO_SUPPORTED_MINT_FOUND', trust: 'RPC observation only; quote is not transfer execution or independent source verification'};
const path = `docs/evidence/phase1/netpay-${Date.now()}.json`;
await writeFile(path, JSON.stringify(result, (_key, value) => typeof value === 'bigint' ? value.toString() : value, 2) + '\n', {flag: 'wx'});
console.log(JSON.stringify({path, durationMs: result.durationMs, slot: snapshot.context.slot, epoch: before.epoch, supportedQuoteCount: supported.length, reports}, (_key, value) => typeof value === 'bigint' ? value.toString() : value, 2));
if (!supported.length) process.exitCode = 2;
