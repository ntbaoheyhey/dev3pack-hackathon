import assert from 'node:assert/strict';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { anchor, RPC, GENESIS, assertDuplicateSimulation, programDataAddress, verifyDeployment } from './checks.mjs';
import { PROGRAM_ADDRESS } from '../../packages/receiptrail-client/index.mjs';
import { inspectIntent, reserve } from './recording-guard.mjs';
import { append, entries, identity, loadSigner, local, root } from './recording-files.mjs';

const { Connection, PublicKey, VersionedTransaction } = anchor.web3;
const rpc = new Connection(RPC, 'confirmed');
assert.equal(await rpc.getGenesisHash(), GENESIS);
const program = new PublicKey(PROGRAM_ADDRESS);
const deployment = await rpc.getMultipleAccountsInfo([program, programDataAddress(program)], 'finalized');
verifyDeployment({ program: PROGRAM_ADDRESS, authority: identity.feePayer, binary: fs.readFileSync(path.join(root, 'target/receiptrail-spike/receiptrail.so')), programAccount: deployment[0], dataAccount: deployment[1] });
const allowedOrigin = 'http://127.0.0.1:4317';
const token = randomBytes(32).toString('hex');
const tokenPath = path.join(local, 'recording-token');
let busy = false;
const server = createServer(async (req, res) => {
  const reply = (status, body) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)); };
  if (req.headers.host !== '127.0.0.1:4318' || req.headers.origin !== allowedOrigin) return reply(403, 'Local recording origin required.');
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin); res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') { res.writeHead(204, { 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' }); return res.end(); }
  const auth = Buffer.from(req.headers.authorization ?? '');
  const expected = Buffer.from('Bearer ' + token);
  if (req.method !== 'POST' || auth.length !== expected.length || !timingSafeEqual(auth, expected)) return reply(403, 'Recording authorization required.');
  if (req.url === '/actors') return reply(200, ['merchant','payer'].map(role => ({ role, address: identity[role] })));
  if (req.url !== '/sign') return reply(404, 'Unknown request.');
  if (busy) return reply(409, 'Another signature is in progress.');
  busy = true;
  try {
    let size = 0; const chunks = [];
    for await (const chunk of req) { size += chunk.length; assert(size < 4096, 'Request too large.'); chunks.push(chunk); }
    const { address, bytes } = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    const prior = entries();
    const rent = await rpc.getMinimumBalanceForRentExemption(131, 'confirmed');
    const plan = await inspectIntent({ bytes: Buffer.from(bytes, 'base64'), address, identity, entries: prior, slot: await rpc.getSlot('confirmed'), rent,
      readAccount: s => rpc.getAccountInfo(new PublicKey(s), 'confirmed') });
    const fee = (await rpc.getFeeForMessage(plan.tx.compileMessage(), 'confirmed')).value;
    assert(Number.isSafeInteger(fee) && fee > 0 && fee <= 20000, 'Fee quote invalid or expired.');
    const reserved = fee + plan.principal + plan.rent;
    reserve(prior, reserved);
    const sim = await rpc.simulateTransaction(new VersionedTransaction(plan.tx.compileMessage()), { commitment: 'confirmed', sigVerify: false });
    if (plan.action === 'retry') assertDuplicateSimulation(sim.value, PROGRAM_ADDRESS); else assert.equal(sim.value.err, null, 'Simulation failed.');
    const signer = loadSigner(address === identity.merchant ? 'merchant' : 'payer');
    plan.tx.sign(signer);
    const serialized = plan.tx.serialize();
    const signature = anchor.utils.bytes.bs58.encode(plan.tx.signature);
    const entry = { at: new Date().toISOString(), action: plan.action, invoice: plan.invoice, signer: address, signature,
      blockhash: plan.tx.recentBlockhash, fee, reserved, rent: plan.rent, principal: plan.principal };
    append(entry);
    reply(200, { signed: serialized.toString('base64') });
    console.log(entry.action, entry.invoice, signature);
  } catch (err) { reply(400, err instanceof Error ? err.message : 'Recording request declined.'); }
  finally { busy = false; }
});
server.listen(4318, '127.0.0.1', () => {
  fs.mkdirSync(local, { recursive: true }); fs.writeFileSync(tokenPath, token, { mode: 0o600 }); fs.chmodSync(tokenPath, 0o600);
  console.log('Recording wallet ready on localhost.');
});
for (const event of ['SIGINT','SIGTERM']) process.on(event, () => { fs.rmSync(tokenPath, { force: true }); server.close(() => process.exit(0)); });
