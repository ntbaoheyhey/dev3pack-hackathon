import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
export const anchor = require('@anchor-lang/core');
const { PublicKey } = anchor.web3;

export const RPC = 'https://api.devnet.solana.com';
export const GENESIS = 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG';
export const PROGRAM = new PublicKey('2yzxUQEpaeLmgCMhDipwnVL3DHsxez18KcePonqZRiXL');
export const PAYER = new PublicKey('GQRoDMoWFV2nhgwm3bZGvSCC1LSa2wRkLeeJg8NhbFM2');
export const LOADER = new PublicKey('BPFLoaderUpgradeab1e11111111111111111111111');
export const COUNTER = PublicKey.findProgramAddressSync([Buffer.from('counter')], PROGRAM)[0];
export const ROOT = new URL('../../', import.meta.url);

function check(condition, code) {
  if (!condition) throw new Error(code);
}

export function loadIdl() {
  const idl = JSON.parse(fs.readFileSync(new URL('target/idl/phase3_hello.json', ROOT), 'utf8'));
  check(idl.address === PROGRAM.toBase58(), 'IDL_PROGRAM_MISMATCH');
  for (const name of ['initialize', 'increment']) {
    const ix = idl.instructions.find(i => i.name === name);
    const expected = createHash('sha256').update(`global:${name}`).digest().subarray(0, 8);
    check(ix && Buffer.from(ix.discriminator).equals(expected) && ix.args.length === 0, 'IDL_INSTRUCTION_MISMATCH');
  }
  return idl;
}

export function programFromIdl(idl, connection) {
  return new anchor.Program(idl, { connection });
}

export async function instruction(program, name) {
  if (name === 'initialize') {
    return program.methods.initialize().accountsStrict({
      payer: PAYER, counter: COUNTER, systemProgram: anchor.web3.SystemProgram.programId,
    }).instruction();
  }
  check(name === 'increment', 'UNKNOWN_INSTRUCTION');
  return program.methods.increment().accountsStrict({ counter: COUNTER, authority: PAYER }).instruction();
}

export function decodeCounter(program, account) {
  check(account.owner.equals(PROGRAM) && !account.executable, 'COUNTER_OWNER_MISMATCH');
  check(account.data.length === 48, 'COUNTER_SIZE_MISMATCH');
  const state = program.coder.accounts.decode('counter', account.data);
  check(state.authority.equals(PAYER), 'COUNTER_AUTHORITY_MISMATCH');
  const count = BigInt(state.count.toString());
  check(count >= 0n && count <= 10n, 'COUNTER_COUNT_OUT_OF_RANGE');
  return { count: count.toString(), authority: state.authority.toBase58(), lamports: account.lamports };
}

// Kiểm cluster trước mọi bước dùng signer; không nhận endpoint từ input/ENV.
export async function inspect(connection, program) {
  const genesis = await connection.getGenesisHash();
  check(genesis === GENESIS, 'NOT_DEVNET');
  const balance = await connection.getBalance(PAYER, 'confirmed');
  const result = await connection.getAccountInfoAndContext(PROGRAM, 'confirmed');
  check(Number.isSafeInteger(result.context.slot), 'INVALID_SLOT');
  if (!result.value) return { ready: false, reason: 'PROGRAM_NOT_DEPLOYED', genesis, balance, slot: result.context.slot };
  const deployed = result.value;
  check(deployed.executable && deployed.owner.equals(LOADER), 'INVALID_DEPLOYED_PROGRAM');
  check(deployed.data.length === 36 && deployed.data.readUInt32LE(0) === 2, 'INVALID_PROGRAM_LAYOUT');
  const dataAddress = new PublicKey(deployed.data.subarray(4, 36));
  const data = await connection.getAccountInfo(dataAddress, 'confirmed');
  check(data && data.owner.equals(LOADER) && !data.executable && data.data.length >= 45 && data.data.readUInt32LE(0) === 3, 'INVALID_PROGRAM_DATA');
  check(data.data[12] === 1 && new PublicKey(data.data.subarray(13, 45)).equals(PAYER), 'UPGRADE_AUTHORITY_MISMATCH');
  const binary = fs.readFileSync(new URL('target/deploy/phase3_hello.so', ROOT));
  const payload = data.data.subarray(45);
  check(payload.subarray(0, binary.length).equals(binary) && payload.subarray(binary.length).every(byte => byte === 0), 'DEPLOYED_BYTES_MISMATCH');
  const account = await connection.getAccountInfo(COUNTER, 'confirmed');
  return { ready: true, genesis, balance, slot: result.context.slot, programData: dataAddress.toBase58(), counter: account ? decodeCounter(program, account) : null };
}
