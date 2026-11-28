import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { anchor } from './checks.mjs';
import { CAP } from './recording-guard.mjs';
export const root = fileURLToPath(new URL('../../', import.meta.url));
export const local = path.join(root, 'sandbox/prompt05');
export const identity = JSON.parse(fs.readFileSync(path.join(root, 'docs/evidence/phase4/deployment-identity.json'), 'utf8'));
const ledger = path.join(local, 'recording-ledger.json');
export function entries() {
  if (!fs.existsSync(ledger)) return [];
  const data = JSON.parse(fs.readFileSync(ledger, 'utf8'));
  assert(data.cap === CAP && Array.isArray(data.entries));
  return data.entries;
}
export function append(entry) {
  const all = entries(); assert(!all.some(e => e.signature === entry.signature), 'Signature already reserved.');
  fs.mkdirSync(local, { recursive: true });
  const tmp = ledger + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify({ cap: CAP, entries: [...all, entry] }, null, 2) + '\n', { mode: 0o600 });
  fs.renameSync(tmp, ledger);
}
export function loadSigner(role) {
  assert(['merchant', 'payer', 'feePayer'].includes(role));
  const base = path.join(os.homedir(), '.local/share/dev3pack/devnet');
  const file = role === 'feePayer' ? path.join(base, 'payer-keypair.json') : path.join(base, 'receiptrail', role + '-keypair.json');
  assert.equal(fs.lstatSync(path.dirname(file)).mode & 0o777, 0o700);
  const stat = fs.lstatSync(file); assert(stat.isFile() && (stat.mode & 0o777) === 0o600);
  const raw = Uint8Array.from(JSON.parse(fs.readFileSync(file, 'utf8')));
  try {
    const signer = anchor.web3.Keypair.fromSecretKey(Uint8Array.from(raw));
    assert.equal(signer.publicKey.toBase58(), identity[role], 'Public identity mismatch.');
    return signer;
  } finally { raw.fill(0); }
}
