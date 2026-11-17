import {createHash} from 'node:crypto';
import {writeFile, readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {rpc, calls, RPC, TOKEN_2022, LOADER} from './rpc.mjs';
export const sha256 = data => createHash('sha256').update(data).digest('hex');
export function base58(bytes) {
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let value = BigInt('0x' + (Buffer.from(bytes).toString('hex') || '0'));
  let encoded = '';
  while (value > 0n) { encoded = alphabet[Number(value % 58n)] + encoded; value /= 58n; }
  let zeros = 0;
  for (const byte of bytes) { if (byte !== 0) break; zeros++; }
  return '1'.repeat(zeros) + encoded;
}
export function bytesOf(account) {
  if (!account || !Array.isArray(account.data) || account.data[1] !== 'base64') throw new Error('missing_account_or_encoding');
  const encoded = account.data[0];
  if (typeof encoded !== 'string' || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(encoded)) throw new Error('invalid_base64');
  return Buffer.from(encoded, 'base64');
}
export function programPointer(account) {
  if (account?.owner !== LOADER || account?.executable !== true) throw new Error('unsupported_loader_or_not_executable');
  const data = bytesOf(account);
  if (data.length !== 36 || data.readUInt32LE(0) !== 2) throw new Error('invalid_program_layout');
  return base58(data.subarray(4, 36));
}
export function programData(account) {
  if (account?.owner !== LOADER || account?.executable !== false) throw new Error('invalid_programdata_owner');
  const data = bytesOf(account);
  if (data.length <= 45 || data.readUInt32LE(0) !== 3) throw new Error('invalid_programdata_layout');
  const option = data[12];
  if (option !== 0 && option !== 1) throw new Error('invalid_authority_option');
  return {upgradeSlot: data.readBigUInt64LE(4).toString(), upgradeAuthority: option === 1 ? base58(data.subarray(13, 45)) : null, dataLength: data.length,
    accountSha256: sha256(data), payloadSha256WithPadding: sha256(data.subarray(45)), hashMeaning: 'snapshot bytes; NOT verified-build/source hash'};
}
export function compareManifest(observed, expected) {
  const fields = ['genesisHash', 'programId', 'programDataAddress', 'owner', 'upgradeSlot', 'upgradeAuthority', 'accountSha256', 'payloadSha256WithPadding', 'idlSha256'];
  const checks = fields.map(field => ({field, status: !Object.hasOwn(expected, field) || !Object.hasOwn(observed, field) ? 'UNKNOWN' : observed[field] === expected[field] ? 'MATCH' : 'MISMATCH'}));
  return {checks, mismatchCount: checks.filter(c => c.status === 'MISMATCH').length, abiCompatibility: 'UNKNOWN', sourceVerification: 'NOT_RUN', trust: 'matches supplied manifest only; RPC and manifest provenance remain external assumptions'};
}
export async function captureProgram(programId = TOKEN_2022) {
  const genesisHash = await rpc('getGenesisHash');
  const first = await rpc('getAccountInfo', [programId, {encoding: 'base64', commitment: 'finalized'}]);
  const programDataAddress = programPointer(first.value);
  // Cùng một response/context; xác nhận pointer không đổi giữa discovery và đọc snapshot.
  const paired = await rpc('getMultipleAccounts', [[programId, programDataAddress], {encoding: 'base64', commitment: 'finalized', minContextSlot: first.context.slot}]);
  if (!Number.isSafeInteger(paired.context?.slot) || paired.context.slot < first.context.slot || paired.value?.length !== 2) throw new Error('invalid_snapshot_context');
  if (programPointer(paired.value[0]) !== programDataAddress) throw new Error('program_pointer_changed');
  return {rpc: RPC, genesisHash, programId, programDataAddress, owner: paired.value[0].owner, contextSlot: paired.context.slot,
    ...programData(paired.value[1]), baselineTrust: 'OBSERVED_ONLY', abiCompatibility: 'UNKNOWN', sourceVerification: 'NOT_RUN'};
}
async function main() {
  const started = performance.now();
  const observed = await captureProgram();
  const baseline = {...observed};
  const mutations = ['genesisHash', 'programId', 'owner', 'upgradeSlot', 'payloadSha256WithPadding'].map(field => {
    const result = compareManifest(observed, {...baseline, [field]: 'deliberately-wrong-fixture'});
    if (result.mismatchCount !== 1 || result.abiCompatibility !== 'UNKNOWN') throw new Error(`missed ${field}`);
    return {field, detected: true};
  });
  const result = {runAtUtc: new Date().toISOString(), node: process.version, durationMs: Math.round(performance.now() - started), scriptSha256: sha256(await readFile(new URL(import.meta.url))), observed, baselineCheck: compareManifest(observed, baseline), fixtureMutations: mutations, rpcCalls: calls, writesToChain: 0};
  const path = `docs/evidence/phase1/cluster-${Date.now()}.json`;
  await writeFile(path, JSON.stringify(result, null, 2) + '\n', {flag: 'wx'});
  console.log(JSON.stringify({path, durationMs: result.durationMs, slot: observed.contextSlot, bytes: observed.dataLength, mutationsDetected: mutations.length, abi: 'UNKNOWN'}));
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
