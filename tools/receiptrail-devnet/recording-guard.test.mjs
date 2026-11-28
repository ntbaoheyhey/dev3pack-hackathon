import test from 'node:test';
import assert from 'node:assert/strict';
import { anchor, toWeb3Instruction } from './checks.mjs';
import { createReceiptRailClient } from '../../packages/receiptrail-client/index.mjs';
import { inspectIntent, reserve, CAP } from './recording-guard.mjs';
const { PublicKey, Keypair, Transaction, SystemProgram } = anchor.web3;
const merchant=Keypair.generate().publicKey,payer=Keypair.generate().publicKey;
const identity={merchant:merchant.toBase58(),payer:payer.toBase58()};
const client=createReceiptRailClient({addressCodec:{encode:s=>new PublicKey(s).toBytes(),decode:b=>new PublicKey(b).toBase58()},derivePda:({programAddress,seeds})=>{
  const [p,b]=PublicKey.findProgramAddressSync(seeds.map(s=>Buffer.from(s)),new PublicKey(programAddress));return [p.toBase58(),b];}});
async function create(amount) {
  const c=await client.createInvoiceInstruction({merchant:identity.merchant,payer:identity.payer,invoiceId:new Uint8Array(32),amountLamports:amount,currentSlot:50n,expiresSlot:10000n});
  return new Transaction({feePayer:merchant,recentBlockhash:Keypair.generate().publicKey.toBase58()}).add(toWeb3Instruction(c.instruction));
}
const inspect=(tx,extra={})=>inspectIntent({bytes:tx.serialize({requireAllSignatures:false,verifySignatures:false}),address:identity.merchant,identity,entries:[],slot:50,rent:1300000,...extra});
test('recording signs only the two designated actors and bounded ReceiptRail terms',async()=>{
  const tx=await create(50000n);assert.equal((await inspect(tx)).action,'create');
  await assert.rejects(inspect(await create(100001n)),/amount/);
  await assert.rejects(inspect(tx,{address:identity.payer}),/one unsigned/);
  tx.add(SystemProgram.transfer({fromPubkey:merchant,toPubkey:payer,lamports:1}));await assert.rejects(inspect(tx),/one unsigned/);
});
test('gross budget includes rent, principal, funding, fee and existing reservations',()=>{
  assert.equal(reserve([{reserved:8000000}],1315720+5000),9320720);
  assert.throws(()=>reserve([{reserved:CAP-4999}],5000),/exhausted/);
});
