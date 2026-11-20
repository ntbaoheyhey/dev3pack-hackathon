import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { build } from '../../../apps/web/node_modules/vite/dist/node/index.js';

test('browser-target bundle runs with no Node globals, RPC, wallet or signing capability', async () => {
  const root = new URL('../../../', import.meta.url);
  const result = await build({
    configFile: false, root: fileURLToPath(root), publicDir: false, logLevel: 'silent',
    build: { write: false, target: 'es2022', minify: false, lib: {
      entry: fileURLToPath(new URL('../index.mjs', import.meta.url)), formats: ['es'], fileName: 'receiptrail-client',
    } },
  });
  const chunks = (Array.isArray(result) ? result : [result]).flatMap(r => r.output).filter(v => v.type === 'chunk');
  assert.equal(chunks.length, 1);
  assert.deepEqual(chunks[0].imports, []);
  const context = vm.createContext({ Uint8Array, DataView });
  const module = new vm.SourceTextModule(chunks[0].code, { context });
  await module.link(() => { throw new Error('UNEXPECTED_EXTERNAL_IMPORT'); });
  await module.evaluate();
  const api = module.namespace;
  assert.equal(api.parseSol('0.000000001'), 1n);
  assert.equal(api.formatSol(18_446_744_073_709_551_615n), '18446744073.709551615');
  const require = createRequire(new URL('apps/web/package.json', root));
  const kit = require('@solana/addresses');
  const client = api.createReceiptRailClient({
    addressCodec: { encode: value => new Uint8Array(kit.getAddressEncoder().encode(kit.address(value))), decode: value => kit.getAddressDecoder().decode(value) },
    derivePda: input => kit.getProgramDerivedAddress(input),
  });
  const fixture = JSON.parse(readFileSync(new URL('docs/fixtures/receiptrail-abi.json', root), 'utf8'));
  const data = new Uint8Array(Buffer.from(fixture.paidHex, 'hex'));
  const invoice = await client.decodeInvoice({ address: fixture.invoiceAddress, owner: fixture.programAddress, executable: false, data });
  assert.equal(invoice.status, 'Paid');
  assert.equal(invoice.amountLamports, 1_000_000n);
  assert.equal(vm.runInContext('typeof process + ":" + typeof Buffer + ":" + typeof fetch', context), 'undefined:undefined:undefined');
});
