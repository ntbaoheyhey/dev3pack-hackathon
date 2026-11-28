import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PROGRAM_ADDRESS } from '../../packages/receiptrail-client/index.mjs';
import { anchor, GENESIS, RPC, PAYER, programDataAddress, sha256, verifyDeployment } from './checks.mjs';

const root = new URL('../../', import.meta.url);
const read = (name) => JSON.parse(readFileSync(new URL('docs/evidence/phase4/' + name, root), 'utf8'));
const { PublicKey, Connection } = anchor.web3;
const identity = read('deployment-identity.json');
const binary = readFileSync(new URL('target/receiptrail-spike/receiptrail.so', root));
assert.equal(sha256(binary), read('ci-deployment.json').localBinarySha256);
const rpc = new Connection(RPC, 'finalized');
assert.equal(await rpc.getGenesisHash(), GENESIS);
const program = new PublicKey(PROGRAM_ADDRESS);
const addresses = [program, programDataAddress(program), PAYER, new PublicKey(identity.merchant), new PublicKey(identity.payer)];
const { context, value } = await rpc.getMultipleAccountsInfoAndContext(addresses, 'finalized');
const verified = verifyDeployment({ program: PROGRAM_ADDRESS, authority: identity.feePayer, binary, programAccount: value[0], dataAccount: value[1] });
console.log(JSON.stringify({
  observedAt: new Date().toISOString(), commitment: 'finalized', rpc: RPC, genesis: GENESIS, observedSlot: context.slot,
  executable: value[0].executable, ...verified, prompt05CapLamports: 500_000_000,
  balances: ['feeAuthority', 'merchant', 'payer'].map((role, i) => ({ role, address: addresses[i + 2].toBase58(), lamports: value[i + 2]?.lamports ?? 0 })),
  invoiceRentLamports: await rpc.getMinimumBalanceForRentExemption(131, 'finalized')
}, null, 2));
