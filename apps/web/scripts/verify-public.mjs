import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
const dist = new URL('../dist-receiptrail/', import.meta.url);
const markers = ['127.0.0.1:4318', 'receiptrail-recording-token', 'Local demo wallet, devnet', 'registerRecordingWallets', 'demoWallet', 'merchant-keypair.json', 'payer-keypair.json'];
for (const file of await readdir(new URL('assets/', dist))) {
  assert(!file.endsWith('.map'), 'Unexpected public sourcemap.');
  const data = await readFile(new URL('assets/' + file, dist), 'utf8');
  for (const marker of markers) assert(!data.includes(marker), file + ': recording-only marker ' + marker);
}
for (const page of ['index.html', 'mock/index.html']) {
  const parent = new URL(page, dist);
  const html = await readFile(parent, 'utf8');
  const scripts = [...html.matchAll(/src="([^"]+\.js)"/g)];
  assert(scripts.length > 0);
  for (const [, src] of scripts) await readFile(new URL(src, parent));
}
console.log('Public entry points and recording-wallet exclusion verified.');
