import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { anchor, RPC, GENESIS, assertDuplicateSimulation, publicEnvelope } from './checks.mjs';
import { entries, identity, root } from './recording-files.mjs';
import { CAP } from './recording-guard.mjs';
import { client } from '../../apps/web/src/receiptrail/devnet.ts';
import { PROGRAM_ADDRESS } from '../../packages/receiptrail-client/index.mjs';

const { Connection, PublicKey } = anchor.web3;
const rpc = new Connection(RPC,{commitment:'finalized',disableRetryOnRateLimit:true});
async function read(fn) {
  for(let i=0;;i++) {
    try { return await fn(); } catch(e) { if(i>=5) throw e; await delay(Math.min(12000,1500*2**i)); }
  }
}
assert.equal(await read(()=>rpc.getGenesisHash()),GENESIS);
const all=entries(), actual=all.filter(a=>!a.notBroadcast&&!a.unobserved);
const signatures=actual.map(a=>a.signature);
assert.equal(new Set(signatures).size,signatures.length);
let statuses;
for(let n=0;n<30;n++){
  statuses=(await read(()=>rpc.getSignatureStatuses(signatures,{searchTransactionHistory:true}))).value;
  if(statuses.every(x=>x?.confirmationStatus==='finalized')) break;
  await delay(2500);
}
assert(statuses.every(x=>x?.confirmationStatus==='finalized'),'Pending attempt: reconcile without sending.');
const txs=[];
for(const [i,entry] of actual.entries()){
  await delay(900);
  const tx=await read(()=>rpc.getTransaction(entry.signature,{commitment:'finalized',maxSupportedTransactionVersion:0}));
  assert(tx?.meta,'Transaction metadata unavailable.');
  const {meta}=tx;
  const keys=tx.transaction.message.staticAccountKeys.map(k=>k.toBase58());
  const balance=(address)=>{const pos=keys.indexOf(address);assert(pos>=0,'Account missing from transaction.');return {before:meta.preBalances[pos],after:meta.postBalances[pos],delta:meta.postBalances[pos]-meta.preBalances[pos]};};
  const fee=meta.fee;assert.equal(fee,entry.fee);
  let principal=0,rent=0,funding=0,bals={};
  if(entry.action==='fund'){
    funding=entry.transfers.reduce((sum,t)=>sum+t.lamports,0);
    bals.feeAuthority=balance(identity.feePayer);assert.equal(bals.feeAuthority.delta,-fee-funding);
    for(const t of entry.transfers){bals[t.role]=balance(t.address);assert.equal(bals[t.role].delta,t.lamports);}
  } else {
    assert(keys.includes(PROGRAM_ADDRESS));
    const ix=tx.transaction.message.compiledInstructions;assert.equal(ix.length,1);assert.equal(keys[ix[0].programIdIndex],PROGRAM_ADDRESS);
    bals.signer=balance(entry.signer);bals.invoice=balance(entry.invoice);
    if(entry.action==='create'){rent=bals.invoice.delta;assert.equal(rent,entry.rent);assert.equal(bals.signer.delta,-rent-fee);}
    if(entry.action==='pay'){principal=entry.principal;bals.merchant=balance(identity.merchant);assert.equal(bals.merchant.delta,principal);assert.equal(bals.signer.delta,-principal-fee);assert.equal(bals.invoice.delta,0);}
    if(entry.action==='retry'){
      assertDuplicateSimulation({err:meta.err,logs:meta.logMessages},PROGRAM_ADDRESS);
      bals.merchant=balance(identity.merchant);assert.equal(bals.merchant.delta,0);assert.equal(bals.invoice.delta,0);assert.equal(bals.signer.delta,-fee);
    }
    if(entry.action==='cancel'){assert.equal(bals.signer.delta,-fee);assert.equal(bals.invoice.delta,0);}
  }
  if(entry.action!=='retry')assert.equal(meta.err,null);
  assert.deepEqual(meta.err,statuses[i].err);
  const gross=principal+funding+rent+fee;assert.equal(gross,entry.reserved);
  txs.push({action:entry.action,invoice:entry.invoice,signature:entry.signature,blockhash:tx.transaction.message.recentBlockhash,
    slot:tx.slot,confirmationStatus:'finalized',err:meta.err,programError:entry.action==='retry'?'InvoiceNotOpen':undefined,
    feeLamports:fee,principalLamports:principal,rentLamports:rent,fundingLamports:funding,grossLamports:gross,balances:bals,
    explorer:'https://explorer.solana.com/tx/'+entry.signature+'?cluster=devnet'});
}
const pay=txs.find(t=>t.action==='pay'),retry=txs.find(t=>t.action==='retry'&&t.invoice===pay?.invoice),cancel=txs.find(t=>t.action==='cancel');
assert(pay&&retry&&cancel&&new Set([pay.invoice,cancel.invoice]).size===2);
assert.notEqual(pay.blockhash,retry.blockhash);
assert.equal(txs.filter(t=>t.action==='pay'&&t.invoice===pay.invoice).length,1);
const addresses=[pay.invoice,cancel.invoice,identity.feePayer,identity.merchant,identity.payer];
const {context,value}=await read(()=>rpc.getMultipleAccountsInfoAndContext(addresses.map(a=>new PublicKey(a)),'finalized'));
const invoices=await Promise.all(addresses.slice(0,2).map((a,i)=>client.decodeInvoice(publicEnvelope(a,value[i]))));
assert.equal(invoices[0].status,'Paid');assert.equal(invoices[0].paidSlot,BigInt(pay.slot));assert.equal(invoices[1].status,'Cancelled');
const pre=JSON.parse(fs.readFileSync(path.join(root,'docs/evidence/phase6/preflight-2026-11-28.json')));
const balances=addresses.slice(2).map((address,i)=>({address,before:pre.balances.find(a=>a.address===address).lamports,after:value[i+2].lamports}));
const cost=txs.reduce((a,t)=>a+t.grossLamports,0);assert(cost<=CAP);
const date=new Date().toISOString();
const record={observedAt:date,rpc:RPC,genesis:GENESIS,program:PROGRAM_ADDRESS,observedSlot:context.slot,commitment:'finalized',source:'Wallet Standard via loopback on Chromium; funding via CLI',
  budget:{capLamports:CAP,grossSpentLamports:cost,unobservedReservedLamports:all.filter(a=>a.unobserved).reduce((sum,a)=>sum+a.reserved,0),feeLamports:txs.reduce((a,t)=>a+t.feeLamports,0),rentLamports:txs.reduce((a,t)=>a+t.rentLamports,0),principalLamports:pay.principalLamports,
    fundingLamports:txs.reduce((a,t)=>a+t.fundingLamports,0),unit:'lamports, 1 SOL = 1,000,000,000 lamports'},
  accounting:'Gross counts internal funding, fees, account rent, and principal separately. Failed retry paid its network fee and transferred zero principal.',
  unobservedAttempts:all.filter(a=>a.unobserved).map(a=>({invoice:a.invoice,signature:a.signature,reserved:a.reserved,...a.reconciliation})),
  localPrebroadcastFailures:all.filter(a=>a.notBroadcast).map(e=>({reason:e.reason,feeLamports:0})),
  demoInvoice:pay.invoice,cancelledInvoice:cancel.invoice,balances,
  invoices:invoices.map(a=>({...a,invoiceId:Buffer.from(a.invoiceId).toString('hex'),explorer:'https://explorer.solana.com/address/'+a.address+'?cluster=devnet'})),transactions:txs};
const file=path.join(root,'docs/evidence/phase6/e2e-devnet-'+date.slice(0,19).replaceAll(':','')+'Z.json');
fs.writeFileSync(file,JSON.stringify(record,(_,v)=>typeof v==='bigint'?v.toString():v,2)+'\n',{flag:'wx'});
console.log(file,record.demoInvoice,cost);
