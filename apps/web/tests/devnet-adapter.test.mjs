import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Keypair, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { PROGRAM_ADDRESS } from '../../../packages/receiptrail-client/index.mjs';
import { getPayInvoiceInstruction } from '../../../packages/receiptrail-client/generated.mjs';
import { addressCodec, client, readReceipt, listReceipts, isDuplicate, verifySigned, prepare, submit, checkAttempt, GENESIS } from '../src/receiptrail/devnet.ts';
import { ReceiptRailDevnetWalletConnection } from '../src/receiptrail/devnet-wallet-connection.ts';
const sample = JSON.parse(readFileSync(new URL('../src/receiptrail/sample.json', import.meta.url)));
const raw = { owner: new PublicKey(PROGRAM_ADDRESS), executable: false, data: Buffer.from(sample.data, 'base64') };
const blockhash = Keypair.generate().publicKey.toBase58();
const reply = (value = raw) => ({ context: { slot: sample.contextSlot }, value });
const rpc = { getGenesisHash: async () => GENESIS, getAccountInfoAndContext: async () => reply(), getSlot: async () => sample.contextSlot,
  getLatestBlockhash: async () => ({ blockhash, lastValidBlockHeight: 500 }), getFeeForMessage: async () => ({ value: 5000 }),
  simulateTransaction: async () => ({ value: { err: { InstructionError: [0, { Custom: 6004 }] }, logs: ['Program ' + PROGRAM_ADDRESS + ' failed: custom program error: 0x1774'] } }) };
test('live reader validates owner, full schema and the canonical invoice address', async () => {
  const result = await readReceipt(rpc, sample.address);
  assert.equal(result.invoice.status, 'Paid'); assert.equal(result.slot, sample.contextSlot);
  for (const bad of [{ ...raw, owner: Keypair.generate().publicKey }, { ...raw, data: raw.data.subarray(1) }, { ...raw, executable: true }]) {
    await assert.rejects(readReceipt({ getAccountInfoAndContext: async () => reply(bad) }, sample.address));
  }
  await assert.rejects(readReceipt(rpc, Keypair.generate().publicKey.toBase58()), /PDA/);
});
test('lists filter merchant and payer separately using IDL offsets and still decode each account', async () => {
  const { invoice } = await readReceipt(rpc, sample.address);
  for (const [role, offset] of [['merchant',10],['payer',42]]) {
    const listRpc = { getProgramAccounts: async (key, config) => {
      assert.equal(key.toBase58(), PROGRAM_ADDRESS); assert.equal(config.withContext,true);
      assert.deepEqual(config.filters[2], { memcmp: { offset, bytes: invoice[role] } });
      return reply([{ pubkey: new PublicKey(sample.address), account: raw }]);
    } };
    assert.equal((await listReceipts(listRpc, invoice[role], role))[0].address, sample.address);
  }
});
test('paid retry requires payer, unchanged terms, and a simulation error owned by ReceiptRail', async () => {
  const { invoice } = await readReceipt(rpc, sample.address);
  const intent = { action: 'retry', address: sample.address, terms: invoice };
  const quote = await prepare(rpc, invoice.payer, intent); assert.equal(quote.fee,5000); assert.equal(quote.rent,0);
  await assert.rejects(prepare(rpc, invoice.merchant, intent), /original payer/);
  await assert.rejects(prepare(rpc, invoice.payer, { ...intent, terms:{...invoice,amountLamports:10n} }), /terms/);
  assert.equal(isDuplicate({ InstructionError: [0,{Custom:6004}] },['Program another failed: custom program error: 0x1774']),false);
  await assert.rejects(prepare({ ...rpc, getGenesisHash:async ()=>'other' },invoice.payer,intent), /devnet/);
});
test('keeps the signed attempt before send and rechecks without a new transfer after a lost response', async () => {
  const signer = Keypair.generate(), sender=signer.publicKey.toBase58();
  const created = await client.createInvoiceInstruction({merchant:sender,payer:Keypair.generate().publicKey.toBase58(),amountLamports:1n,expiresSlot:100n,currentSlot:1n,invoiceId:new Uint8Array(32)});
  const unsigned = new Transaction({feePayer:signer.publicKey,recentBlockhash:blockhash}).add({
    programId:new PublicKey(PROGRAM_ADDRESS),keys:created.instruction.accounts.map(a=>({pubkey:new PublicKey(a.address),isSigner:a.isSigner,isWritable:a.isWritable})),data:Buffer.from(created.instruction.data)});
  const rawBytes = unsigned.serialize({requireAllSignatures:false,verifySignatures:false});
  unsigned.sign(signer); const signedBytes=unsigned.serialize();
  const account={address:sender,chains:['solana:devnet'],features:['solana:signTransaction']};
  const wallet={ features:{'solana:signTransaction':{supportedTransactionVersions:['legacy'],signTransaction:async()=>[{signedTransaction:signedBytes}]}} };
  const quote={unsigned:rawBytes,action:'create',signer:sender,address:created.invoiceAddress,lastValidBlockHeight:500,blockhash,fee:5000};
  const order=[]; const fake={getBlockHeight:async()=>10,sendRawTransaction:async()=>{order.push('send');throw Error('lost reply');},
    getSignatureStatuses:async()=>({value:[{confirmationStatus:'finalized',err:null}]})};
  const result=await submit(fake,quote,wallet,account,()=>true,a=>{assert(a.signature);order.push('persist');},false);
  assert.deepEqual(order,['persist','send']);assert.equal(result.unknown,true);
  assert.equal((await checkAttempt(fake,result.attempt)).state,'finalized');assert.deepEqual(order,['persist','send']);
  const altered=Transaction.from(signedBytes);altered.recentBlockhash=Keypair.generate().publicKey.toBase58();altered.sign(signer);
  assert.throws(()=>verifySigned(rawBytes,altered.serialize()),/different/);
});
test('wallet snapshots have stable identity until published changes', async () => {
  const c=new ReceiptRailDevnetWalletConnection([]);const first=c.getSnapshot();assert.equal(first,c.getSnapshot());
  await c.disconnect();assert.notEqual(first,c.getSnapshot());c.destroy();
});
