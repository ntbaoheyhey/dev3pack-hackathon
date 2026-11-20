// Browser-safe Borsh subset. Schema and public wrappers are generated from the Anchor IDL.
export const U64_MAX = (1n << 64n) - 1n;
export function check(value, code) { if (!value) throw new Error(code); }
export function deepFreeze(value) {
  for (const child of Object.values(value)) if (child && typeof child === 'object') deepFreeze(child);
  return Object.freeze(value);
}
export function u64(value, name = 'u64') {
  check(typeof value === 'bigint' && value >= 0n && value <= U64_MAX, `INVALID_U64:${name}`);
  return value;
}
export function bytes(value, length, name = 'bytes') {
  check(value instanceof Uint8Array && value.length === length, `INVALID_BYTES:${name}`);
  return new Uint8Array(value);
}
export function addressBytes(codec, value) {
  check(typeof value === 'string', 'INVALID_ADDRESS');
  const encoded = bytes(codec.encode(value), 32, 'address');
  check(codec.decode(encoded) === value, 'NON_CANONICAL_ADDRESS');
  return encoded;
}
function exactKeys(value, names, code) {
  check(value && typeof value === 'object' && !Array.isArray(value), code);
  check(Object.keys(value).every(key => names.includes(key)), code);
}
export function encodeFields(schema, value, codec) {
  exactKeys(value, schema.fields.map(f => f.name), 'UNKNOWN_ARGUMENT');
  const output = new Uint8Array(schema.size);
  output.set(schema.discriminator);
  const view = new DataView(output.buffer);
  for (const field of schema.fields) {
    const v = value[field.name];
    if (field.type === 'u64') view.setBigUint64(field.offset, u64(v, field.name), true);
    else if (field.type === 'u8') {
      check(typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 255, `INVALID_U8:${field.name}`);
      view.setUint8(field.offset, v);
    } else if (field.type === 'pubkey') output.set(addressBytes(codec, v), field.offset);
    else if (field.type === 'bytes') output.set(bytes(v, field.size, field.name), field.offset);
    else throw new Error('UNSUPPORTED_FIELD_TYPE');
  }
  return output;
}
export function decodeFields(schema, input, codec) {
  const data = bytes(input, schema.size, 'account_or_event');
  check(schema.discriminator.every((v, i) => data[i] === v), 'DISCRIMINATOR_MISMATCH');
  const view = new DataView(data.buffer);
  const result = {};
  for (const field of schema.fields) {
    if (field.type === 'u64') result[field.name] = view.getBigUint64(field.offset, true);
    else if (field.type === 'u8') result[field.name] = view.getUint8(field.offset);
    else if (field.type === 'pubkey') {
      const value = codec.decode(data.slice(field.offset, field.offset + field.size));
      addressBytes(codec, value);
      result[field.name] = value;
    } else if (field.type === 'bytes') result[field.name] = data.slice(field.offset, field.offset + field.size);
    else throw new Error('UNSUPPORTED_FIELD_TYPE');
  }
  return result;
}
export function makeInstruction(programAddress, schema, input, codec) {
  exactKeys(input, ['accounts', 'args'], 'UNKNOWN_INSTRUCTION_INPUT');
  exactKeys(input.accounts, schema.accounts.map(a => a.name), 'UNKNOWN_ACCOUNT');
  const accounts = schema.accounts.map(account => {
    const address = input.accounts[account.name] ?? account.address;
    addressBytes(codec, address);
    if (account.address) check(address === account.address, 'FIXED_ACCOUNT_MISMATCH');
    return { address, isSigner: account.signer, isWritable: account.writable };
  });
  return { programAddress, accounts, data: encodeFields(schema, input.args ?? {}, codec) };
}
