import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import {
  createReceiptRailClient, parseSol, formatSol, getReceiptRailError, U64_MAX, PROGRAM_ADDRESS, SYSTEM_PROGRAM, IDL_SHA256,
} from '../index.mjs';
import * as generated from '../generated.mjs';

const root = new URL('../../../', import.meta.url);
const webRequire = createRequire(new URL('apps/web/package.json', root));
const labRequire = createRequire(new URL('tools/devnet-lab/package.json', root));
const anchor = labRequire('@anchor-lang/core');
const kit = webRequire('@solana/addresses');
const { PublicKey } = anchor.web3;
const fixture = JSON.parse(readFileSync(new URL('docs/evidence/phase4/runtime-abi-r2.json', root), 'utf8'));
const idlSource = readFileSync(new URL('docs/idl/receiptrail.json', root), 'utf8');
const idl = JSON.parse(idlSource);
const coder = new anchor.BorshCoder(idl);
const fromHex = s => new Uint8Array(Buffer.from(s, 'hex'));
const toHex = data => Buffer.from(data).toString('hex');
const adapter = {
  addressCodec: {
    encode: value => new Uint8Array(kit.getAddressEncoder().encode(kit.address(value))),
    decode: value => kit.getAddressDecoder().decode(value),
  },
  derivePda: input => kit.getProgramDerivedAddress(input),
};
const client = createReceiptRailClient(adapter);
const terms = {
  address: fixture.invoiceAddress, merchant: fixture.merchant, payer: fixture.payer,
  invoiceId: fromHex(fixture.invoiceIdHex), amountLamports: BigInt(fixture.amountLamports), expiresSlot: BigInt(fixture.expiresSlot),
};
const createInput = () => ({ ...terms, invoiceId: new Uint8Array(terms.invoiceId), currentSlot: 100n });
const account = (state = 'open') => ({ address: terms.address, owner: PROGRAM_ADDRESS, executable: false, data: fromHex(fixture[`${state}Hex`]) });
const action = (state = 'open') => ({ account: account(state), signer: terms.payer, confirmedTerms: { ...terms, invoiceId: new Uint8Array(terms.invoiceId) }, currentSlot: 100n });
function compareIx(actual, expected) {
  assert.equal(actual.programAddress, expected.programAddress);
  assert.deepEqual(actual.accounts, expected.accounts);
  assert.equal(toHex(actual.data), expected.dataHex);
}
function normalize(value) {
  if (anchor.BN.isBN(value)) return BigInt(value.toString(10));
  if (value instanceof PublicKey) return value.toBase58();
  if (Array.isArray(value) || value instanceof Uint8Array) return new Uint8Array(value);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, normalize(v)]));
  return value;
}

test('all ABI entries are generated and source hash matches the checked-in Anchor IDL', () => {
  assert.equal(IDL_SHA256, createHash('sha256').update(idlSource).digest('hex'));
  assert.equal(PROGRAM_ADDRESS, fixture.programAddress);
  assert.deepEqual(Object.keys(generated.CONTRACT.instructions).sort(), idl.instructions.map(i => i.name).sort());
  assert.deepEqual(Object.keys(generated.CONTRACT.structs).sort(), idl.types.map(t => t.name).sort());
  assert.deepEqual(generated.CONTRACT.errors, idl.errors);
});

test('canonical PDA agrees with Rust, Kit and independent web3.js derivation', async () => {
  const result = await client.deriveInvoiceAddress(terms.merchant, terms.invoiceId);
  const [address, bump] = PublicKey.findProgramAddressSync([Buffer.from('invoice-v1'), new PublicKey(terms.merchant).toBuffer(), Buffer.from(terms.invoiceId)], new PublicKey(PROGRAM_ADDRESS));
  assert.equal(result.address, fixture.invoiceAddress);
  assert.deepEqual(result, { address: address.toBase58(), bump });
  assert.equal(result.bump, 252);
  assert.notEqual((await client.deriveInvoiceAddress(terms.payer, terms.invoiceId)).address, terms.address);
  assert.notEqual((await client.deriveInvoiceAddress(terms.merchant, new Uint8Array(32))).address, terms.address);
});

test('three high-level builders match Rust runtime instruction bytes, order and signer/writable privileges', async () => {
  const created = await client.createInvoiceInstruction(createInput());
  assert.equal(created.invoiceAddress, terms.address);
  compareIx(created.instruction, fixture.create);
  compareIx(await client.payInvoiceInstruction(action()), fixture.pay);
  compareIx(await client.cancelInvoiceInstruction({ ...action(), signer: terms.merchant }), fixture.cancel);
});

test('instruction serialization agrees with independent Anchor coder across u64 boundaries', async () => {
  for (const amount of [1n, 255n, 256n, (1n << 53n) + 1n, U64_MAX]) {
    const result = await client.createInvoiceInstruction({ ...createInput(), amountLamports: amount, expiresSlot: U64_MAX });
    const encoded = coder.instruction.encode('create_invoice', {
      invoice_id: [...terms.invoiceId], payer: new PublicKey(terms.payer), amount_lamports: new anchor.BN(amount.toString()), expires_slot: new anchor.BN(U64_MAX.toString()),
    });
    assert.equal(toHex(result.instruction.data), encoded.toString('hex'));
  }
  for (const [name, vector] of [['pay_invoice', fixture.pay], ['cancel_invoice', fixture.cancel]]) {
    assert.equal(coder.instruction.encode(name, {}).toString('hex'), vector.dataHex);
  }
});

test('Open, Paid and Cancelled decode exactly as Anchor on real runtime account bytes', async () => {
  for (const state of ['open', 'paid', 'cancelled']) {
    const envelope = account(state);
    const low = generated.decodeInvoiceData(envelope.data, adapter.addressCodec);
    assert.deepEqual(low, normalize(coder.accounts.decode('Invoice', Buffer.from(envelope.data))));
    const decoded = await client.decodeInvoice(envelope);
    assert.equal(decoded.status.toLowerCase(), state);
    assert.equal(decoded.amountLamports, terms.amountLamports);
    assert.equal(decoded.merchant, terms.merchant);
    assert.equal(decoded.payer, terms.payer);
    assert.equal(decoded.paidSlot, state === 'paid' ? 100n : 0n);
  }
});

test('three emitted runtime events decode exactly as the independent Anchor event coder', () => {
  for (const [name, key] of [['InvoiceCreated', 'created'], ['InvoicePaid', 'paid'], ['InvoiceCancelled', 'cancelled']]) {
    const encoded = fixture[`${key}EventBase64`];
    const decoded = generated[`decode${name}Event`](new Uint8Array(Buffer.from(encoded, 'base64')), adapter.addressCodec);
    const independent = coder.events.decode(encoded);
    assert.equal(independent.name, name);
    assert.deepEqual(decoded, normalize(independent.data));
    assert.equal(decoded.invoice, terms.address);
  }
});

test('one lamport and max u64 SOL inputs preserve every digit without rounding', () => {
  const cases = [['0', 0n], ['0.000000001', 1n], ['1.0100', 1_010_000_000n], ['9007199.254740993', 9_007_199_254_740_993n], ['18446744073.709551615', U64_MAX]];
  for (const [text, amount] of cases) {
    assert.equal(parseSol(text), amount);
    assert.equal(parseSol(formatSol(amount)), amount);
  }
  assert.equal(formatSol(1n), '0.000000001');
  assert.equal(formatSol(1_010_000_000n), '1.01');
});

test('ambiguous, float, exponent, negative, overprecision and overflow amounts are rejected', () => {
  for (const input of ['', ' ', ' 1', '1 ', '1e3', '-1', '+1', 'NaN', 'Infinity', '.1', '1.', '01', '1,1', '1.0000000001', 1, 1n, null, '0'.repeat(1000), '18446744073.709551616']) {
    assert.throws(() => parseSol(input), /INVALID_SOL|SOL_OVERFLOW/, String(input));
  }
  for (const input of [1, -1n, U64_MAX + 1n, '1']) assert.throws(() => formatSol(input), /INVALID_U64/);
});

test('create rejects invalid amount, stale expiry, zero or aliased wallets before building', async () => {
  for (const amountLamports of [0n, -1n, U64_MAX + 1n, 1, '1']) await assert.rejects(client.createInvoiceInstruction({ ...createInput(), amountLamports }));
  for (const expiresSlot of [0n, 99n, 100n]) await assert.rejects(client.createInvoiceInstruction({ ...createInput(), expiresSlot }), /INVALID_EXPIRY/);
  for (const payer of [SYSTEM_PROGRAM, terms.merchant, terms.address]) await assert.rejects(client.createInvoiceInstruction({ ...createInput(), payer }), /INVALID_WALLET|ALIASED_ROLES/);
  await assert.rejects(client.createInvoiceInstruction({ ...createInput(), merchant: SYSTEM_PROGRAM }), /INVALID_WALLET/);
  await assert.rejects(client.createInvoiceInstruction({ ...createInput(), currentSlot: undefined }), /INVALID_U64/);
});

test('owner, executable, length, type and version are all required for an invoice', async () => {
  await assert.rejects(client.decodeInvoice({ ...account(), owner: SYSTEM_PROGRAM }), /INVOICE_OWNER_MISMATCH/);
  for (const executable of [true, undefined]) await assert.rejects(client.decodeInvoice({ ...account(), executable }), /INVOICE_EXECUTABLE/);
  for (const length of [0, 8, 130, 132, 1024]) await assert.rejects(client.decodeInvoice({ ...account(), data: new Uint8Array(length) }), /INVALID_BYTES/);
  const type = account(); type.data[0] ^= 1;
  await assert.rejects(client.decodeInvoice(type), /DISCRIMINATOR_MISMATCH/);
  const version = account(); version.data[8] = 2;
  await assert.rejects(client.decodeInvoice(version), /WRONG_VERSION/);
});

test('wrong address, seed merchant/id and noncanonical bump do not pass owner/type checks alone', async () => {
  await assert.rejects(client.decodeInvoice({ ...account(), address: PROGRAM_ADDRESS }), /INVOICE_PDA_MISMATCH/);
  for (const offset of [9, 10, 74]) {
    const forged = account(); forged.data[offset] ^= 1;
    await assert.rejects(client.decodeInvoice(forged), /INVOICE_PDA_MISMATCH/);
  }
});

test('decoded account terms enforce positive amount/expiry and distinct nonzero wallets', async () => {
  for (const offset of [106, 114]) {
    const forged = account(); forged.data.fill(0, offset, offset + 8);
    await assert.rejects(client.decodeInvoice(forged), /INVALID_AMOUNT|INVALID_EXPIRY/);
  }
  for (const payer of [SYSTEM_PROGRAM, terms.merchant, terms.address]) {
    const forged = account(); forged.data.set(adapter.addressCodec.encode(payer), 42);
    await assert.rejects(client.decodeInvoice(forged), /INVALID_WALLET|ALIASED_ROLES/);
  }
});

test('unknown status and impossible paid slots are rejected; a payment at slot zero is valid', async () => {
  for (const status of [3, 255]) {
    const forged = account(); forged.data[122] = status;
    await assert.rejects(client.decodeInvoice(forged), /INVALID_STATUS/);
  }
  for (const state of ['open', 'cancelled']) {
    const forged = account(state); new DataView(forged.data.buffer).setBigUint64(123, 1n, true);
    await assert.rejects(client.decodeInvoice(forged), /INVALID_PAID_SLOT/);
  }
  for (const slot of [200n, U64_MAX]) {
    const forged = account('paid'); new DataView(forged.data.buffer).setBigUint64(123, slot, true);
    await assert.rejects(client.decodeInvoice(forged), /INVALID_PAID_SLOT/);
  }
  const paidAtZero = account('paid'); paidAtZero.data.fill(0, 123);
  assert.equal((await client.decodeInvoice(paidAtZero)).paidSlot, 0n);
});

test('generated decode reads u64 above Number safety and rejects trailing event bytes/type confusion', () => {
  const envelope = account(); new DataView(envelope.data.buffer).setBigUint64(106, U64_MAX, true);
  assert.equal(generated.decodeInvoiceData(envelope.data, adapter.addressCodec).amount_lamports, U64_MAX);
  const event = new Uint8Array(Buffer.from(fixture.paidEventBase64, 'base64'));
  assert.throws(() => generated.decodeInvoicePaidEvent(new Uint8Array([...event, 0]), adapter.addressCodec), /INVALID_BYTES/);
  event[0] ^= 1;
  assert.throws(() => generated.decodeInvoicePaidEvent(event, adapter.addressCodec), /DISCRIMINATOR_MISMATCH/);
});

test('a changed confirmed term or account cannot silently become a different payment', async () => {
  for (const changed of [{ address: terms.payer }, { merchant: terms.payer }, { payer: terms.merchant }, { invoiceId: new Uint8Array(32) }, { amountLamports: 2n }, { expiresSlot: 201n }]) {
    await assert.rejects(client.payInvoiceInstruction({ ...action(), confirmedTerms: { ...terms, ...changed } }), /TERMS_CHANGED/);
    await assert.rejects(client.cancelInvoiceInstruction({ ...action(), signer: terms.merchant, confirmedTerms: { ...terms, ...changed } }), /TERMS_CHANGED/);
  }
  await assert.rejects(client.payInvoiceInstruction({ ...action(), confirmedTerms: undefined }), /MISSING_CONFIRMED_TERMS/);
  const changedAccount = account(); new DataView(changedAccount.data.buffer).setBigUint64(106, 2n, true);
  await assert.rejects(client.payInvoiceInstruction({ ...action(), account: changedAccount }), /TERMS_CHANGED/);
});

test('wrong signer, unknown clock, expiry boundary and terminal state block pay; expired Open can cancel', async () => {
  await assert.rejects(client.payInvoiceInstruction({ ...action(), signer: terms.merchant }), /WRONG_PAYER/);
  await assert.rejects(client.cancelInvoiceInstruction(action()), /WRONG_MERCHANT/);
  await assert.rejects(client.payInvoiceInstruction({ ...action(), currentSlot: undefined }), /INVALID_U64/);
  compareIx(await client.payInvoiceInstruction({ ...action(), currentSlot: 199n }), fixture.pay);
  for (const currentSlot of [200n, 201n, U64_MAX]) await assert.rejects(client.payInvoiceInstruction({ ...action(), currentSlot }), /INVOICE_EXPIRED/);
  for (const state of ['paid', 'cancelled']) {
    await assert.rejects(client.payInvoiceInstruction(action(state)), /INVOICE_NOT_OPEN/);
    await assert.rejects(client.cancelInvoiceInstruction({ ...action(state), signer: terms.merchant }), /INVOICE_NOT_OPEN/);
  }
  compareIx(await client.cancelInvoiceInstruction({ ...action(), currentSlot: 500n, signer: terms.merchant }), fixture.cancel);
});

test('inspection distinguishes expiry, role and terminal state without inventing commitment', async () => {
  const unknown = await client.inspectInvoice(account());
  assert.equal(unknown.expiry, 'Unknown'); assert.equal(unknown.canPay, false); assert.equal(unknown.canCancel, false);
  assert.equal('commitment' in unknown, false);
  const payer = await client.inspectInvoice(account(), { walletAddress: terms.payer, observedSlot: 199n });
  assert.equal(payer.canPay, true); assert.equal(payer.canCancel, false);
  const expired = await client.inspectInvoice(account(), { walletAddress: terms.merchant, observedSlot: 200n });
  assert.equal(expired.displayStatus, 'Expired'); assert.equal(expired.canPay, false); assert.equal(expired.canCancel, true);
  const paid = await client.inspectInvoice(account('paid'), { walletAddress: terms.payer, observedSlot: 500n });
  assert.equal(paid.displayStatus, 'Paid'); assert.equal(paid.canPay, false); assert.equal(paid.canCancel, false);
});

test('custom errors are scoped to ReceiptRail program and integer code, never substring log matching', () => {
  for (const error of idl.errors) assert.deepEqual(getReceiptRailError(PROGRAM_ADDRESS, error.code), error);
  for (const code of [6009, 1, '6004', '0x1774', 6000.5, NaN]) assert.equal(getReceiptRailError(PROGRAM_ADDRESS, code), null);
  assert.equal(getReceiptRailError(SYSTEM_PROGRAM, 6004), null);
});

test('malformed addresses, bytes, argument names and fixed System account fail closed', async () => {
  for (const merchant of ['', '0OIl', '1'.repeat(33), 42, null]) await assert.rejects(client.deriveInvoiceAddress(merchant, terms.invoiceId));
  for (const id of [new Uint8Array(31), new Uint8Array(33), [], terms.invoiceIdHex]) await assert.rejects(client.deriveInvoiceAddress(terms.merchant, id), /INVALID_BYTES/);
  assert.throws(() => generated.getPayInvoiceInstruction({ accounts: { invoice: terms.address, payer: terms.payer, merchant: terms.merchant, system_program: terms.merchant } }, adapter.addressCodec), /FIXED_ACCOUNT_MISMATCH/);
  assert.throws(() => generated.getPayInvoiceInstruction({ accounts: { invoice: terms.address, payer: terms.payer, merchant: terms.merchant }, args: { amount: 1n } }, adapter.addressCodec), /UNKNOWN_ARGUMENT/);
  assert.throws(() => generated.getPayInvoiceInstruction({ accounts: { invoice: terms.address, payer: terms.payer, merchant: terms.merchant, extra: terms.payer } }, adapter.addressCodec), /UNKNOWN_ACCOUNT/);
});

test('async derivation snapshots confirmed terms, account bytes and create input before yielding', async () => {
  const input = createInput();
  const pendingCreate = client.createInvoiceInstruction(input);
  input.invoiceId.fill(1); input.merchant = terms.payer; input.amountLamports = 2n;
  compareIx((await pendingCreate).instruction, fixture.create);
  const pay = action(); const pendingPay = client.payInvoiceInstruction(pay);
  pay.account.data.fill(0); pay.account.address = terms.payer; pay.confirmedTerms.invoiceId.fill(0);
  compareIx(await pendingPay, fixture.pay);
});

test('unsupported adapter output and noncanonical address codec are rejected', async () => {
  const invalid = createReceiptRailClient({ ...adapter, derivePda: async () => [terms.address, -1] });
  await assert.rejects(invalid.deriveInvoiceAddress(terms.merchant, terms.invoiceId), /INVALID_PDA_BUMP/);
  assert.throws(() => createReceiptRailClient({ ...adapter, addressCodec: { ...adapter.addressCodec, decode: () => terms.payer } }), /NON_CANONICAL_ADDRESS/);
});

test('independent web3.js adapter also consumes the same client and produces the Rust create instruction', async () => {
  const independent = createReceiptRailClient({
    addressCodec: { encode: value => new PublicKey(value).toBytes(), decode: data => new PublicKey(data).toBase58() },
    derivePda: ({ programAddress, seeds }) => {
      const [key, bump] = PublicKey.findProgramAddressSync(seeds.map(s => Buffer.from(s)), new PublicKey(programAddress));
      return [key.toBase58(), bump];
    },
  });
  compareIx((await independent.createInvoiceInstruction(createInput())).instruction, fixture.create);
  assert.equal((await independent.decodeInvoice(account('paid'))).paidSlot, 100n);
});
