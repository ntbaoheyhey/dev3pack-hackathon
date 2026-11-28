import {writeFile} from 'node:fs/promises';
import {rpc, TOKEN_2022, calls} from './rpc.mjs';
const genesis = await rpc('getGenesisHash');
const recent = await rpc('getSignaturesForAddress', [TOKEN_2022, {limit: 8, commitment: 'finalized'}]);
const mints = new Set();
for (const row of recent.filter(x => !x.err)) {
  const tx = await rpc('getTransaction', [row.signature, {encoding: 'jsonParsed', commitment: 'finalized', maxSupportedTransactionVersion: 0}]);
  for (const balance of [...(tx?.meta?.preTokenBalances ?? []), ...(tx?.meta?.postTokenBalances ?? [])]) if (balance.programId === TOKEN_2022) mints.add(balance.mint);
  for (const ix of tx?.transaction?.message?.instructions ?? []) if (ix.programId === TOKEN_2022 && ix.parsed?.info?.mint) mints.add(ix.parsed.info.mint);
}
const observed = [];
for (const mint of [...mints].slice(0, 12)) {
  const info = await rpc('getAccountInfo', [mint, {encoding: 'jsonParsed', commitment: 'finalized'}]);
  observed.push({mint, ...info});
}
const path = `docs/evidence/phase1/mints-${Date.now()}.json`;
await writeFile(path, JSON.stringify({runAtUtc: new Date().toISOString(), genesis, recent, observed, rpcCalls: calls, writesToChain: 0}, null, 2) + '\n', {flag: 'wx'});
console.log(JSON.stringify({path, observed: observed.map(x => ({mint: x.mint, type: x.value?.data?.parsed?.type, extensions: x.value?.data?.parsed?.info?.extensions}))}, null, 2));
