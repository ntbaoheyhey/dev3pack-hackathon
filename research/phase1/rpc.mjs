// Spike nghiên cứu chỉ đọc devnet; không nhận endpoint tùy ý hoặc signer.
export const RPC = 'https://api.devnet.solana.com';
export const TOKEN_2022 = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';
export const LOADER = 'BPFLoaderUpgradeab1e11111111111111111111111';
const allowed = new Set(['getGenesisHash', 'getAccountInfo', 'getMultipleAccounts', 'getEpochInfo', 'getSignaturesForAddress', 'getTransaction']);
export const calls = [];
export async function rpc(method, params = []) {
  if (!allowed.has(method)) throw new Error('RPC method ngoài phạm vi read-only');
  const start = performance.now();
  const response = await fetch(RPC, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({jsonrpc: '2.0', id: calls.length + 1, method, params}), signal: AbortSignal.timeout(20000)});
  if (!response.ok) throw new Error(`RPC HTTP ${response.status}; không tự retry dồn dập`);
  const body = await response.text();
  if (body.length > 6_000_000) throw new Error('RPC response vượt giới hạn spike');
  const data = JSON.parse(body);
  calls.push({method, durationMs: Math.round(performance.now() - start)});
  if (data.error) throw new Error(`RPC ${data.error.code}: ${data.error.message}`);
  if (!Object.hasOwn(data, 'result')) throw new Error('RPC thiếu result');
  return data.result;
}
