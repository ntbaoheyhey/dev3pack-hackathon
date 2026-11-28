export const DEVNET_RPC = 'https://api.devnet.solana.com';
export const DEVNET_GENESIS = 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG';
export const LOADER_V3 = 'BPFLoaderUpgradeab1e11111111111111111111111';
export const HELLO_PROGRAM = '2yzxUQEpaeLmgCMhDipwnVL3DHsxez18KcePonqZRiXL';

export type Inspection = {
  programId: string;
  observedAt: string;
  slot: number;
  state: 'missing' | 'executable' | 'not-executable';
  owner: string | null;
};

const messages = {
  INVALID_ADDRESS: 'Program ID phải là địa chỉ Solana base58 dài đúng 32 byte.',
  WRONG_CLUSTER: 'RPC trả về cluster khác Devnet. Đã dừng kiểm tra.',
  RATE_LIMIT: 'Devnet đang giới hạn lượt đọc. Hãy đợi một chút rồi thử lại.',
  RPC_ERROR: 'RPC chưa trả được dữ liệu. Hãy thử lại sau.',
  BAD_RESPONSE: 'Dữ liệu RPC chưa hợp lệ. Chưa thể xác minh program.',
  NETWORK: 'Không kết nối được Devnet. Kiểm tra mạng rồi thử lại.',
  TIMEOUT: 'Devnet phản hồi quá chậm. Bạn có thể thử lại.',
  CANCELLED: 'Đã hủy kiểm tra. Bạn có thể sửa Program ID rồi thử lại.',
} as const;

export class InspectionError extends Error {
  code: keyof typeof messages;
  constructor(code: keyof typeof messages) {
    super(messages[code]);
    this.name = 'InspectionError';
    this.code = code;
  }
}

// Base58 length alone is insufficient: a 44-character string can decode to 33 bytes.
export function isSolanaAddress(value: string): boolean {
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value)) return false;
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let number = 0n;
  for (const char of value) number = number * 58n + BigInt(alphabet.indexOf(char));
  let bytes = 0;
  while (number > 0n) { bytes++; number >>= 8n; }
  return bytes + (value.match(/^1*/)?.[0].length ?? 0) === 32;
}

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export async function inspectProgram(
  input: string,
  options: { fetchImpl?: typeof fetch; signal?: AbortSignal; timeoutMs?: number; now?: () => number } = {},
): Promise<Inspection> {
  const programId = input.trim();
  if (!isSolanaAddress(programId)) throw new InspectionError('INVALID_ADDRESS');
  const timeout = AbortSignal.timeout(options.timeoutMs ?? 12_000);
  const signal = options.signal ? AbortSignal.any([options.signal, timeout]) : timeout;
  const transport = options.fetchImpl ?? fetch;
  async function rpc(method: string, params: unknown[], id: number) {
    const response = await transport(DEVNET_RPC, {
      method: 'POST', headers: { 'content-type': 'application/json' }, signal,
      body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
    });
    if (response.status === 429) throw new InspectionError('RATE_LIMIT');
    if (!response.ok) throw new InspectionError('RPC_ERROR');
    let envelope: unknown;
    try { envelope = await response.json(); } catch { throw new InspectionError('BAD_RESPONSE'); }
    if (!record(envelope) || envelope.jsonrpc !== '2.0' || envelope.id !== id) throw new InspectionError('BAD_RESPONSE');
    if (envelope.error) throw new InspectionError('RPC_ERROR');
    if (!Object.hasOwn(envelope, 'result')) throw new InspectionError('BAD_RESPONSE');
    return envelope.result;
  }
  try {
    const genesis = await rpc('getGenesisHash', [], 1);
    if (genesis !== DEVNET_GENESIS) throw new InspectionError('WRONG_CLUSTER');
    const result = await rpc('getAccountInfo', [programId, {
      commitment: 'confirmed', encoding: 'base64', dataSlice: { offset: 0, length: 0 },
    }], 2);
    if (!record(result) || !record(result.context) || !Number.isSafeInteger(result.context.slot)
      || (result.context.slot as number) < 0 || !Object.hasOwn(result, 'value')) throw new InspectionError('BAD_RESPONSE');
    const base = { programId, slot: result.context.slot as number, observedAt: new Date((options.now ?? Date.now)()).toISOString() };
    if (result.value === null) return { ...base, state: 'missing', owner: null };
    if (!record(result.value) || typeof result.value.executable !== 'boolean'
      || typeof result.value.owner !== 'string' || !isSolanaAddress(result.value.owner)) throw new InspectionError('BAD_RESPONSE');
    return { ...base, state: result.value.executable ? 'executable' : 'not-executable', owner: result.value.owner };
  } catch (error) {
    if (error instanceof InspectionError) throw error;
    if (options.signal?.aborted) throw new InspectionError('CANCELLED');
    if (timeout.aborted) throw new InspectionError('TIMEOUT');
    throw new InspectionError('NETWORK');
  }
}
