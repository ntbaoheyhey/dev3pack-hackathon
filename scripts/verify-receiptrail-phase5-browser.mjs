// Local-only browser evidence. Requires cached Playwright/Chromium; never installs.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pw = process.env.RECEIPTRAIL_PLAYWRIGHT ?? '/Users/bao/.npm/_npx/9833c18b2d85bc59/node_modules/playwright/index.mjs';
const exe = process.env.RECEIPTRAIL_CHROMIUM ?? '/Users/bao/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell';
assert(existsSync(pw) && existsSync(exe), 'Missing cache: stop, do not install.');
const { chromium } = await import(pathToFileURL(pw).href);
const target = process.env.RECEIPTRAIL_QA_URL ?? 'http://127.0.0.1:4175/receiptrail/';
const origin = new URL(target).origin;
assert(['127.0.0.1', 'localhost', '[::1]'].includes(new URL(target).hostname));
const out = path.resolve(root, process.env.RECEIPTRAIL_QA_OUT ?? 'docs/evidence/phase5/c-prompt04-review-2026-11-19');
mkdirSync(path.join(out, 'screenshots'), { recursive: true });
const sourcePaths = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', 'apps/web/src', 'apps/web/package.json', 'apps/web/package-lock.json', 'apps/web/tsconfig.json', 'apps/web/vite*.ts', 'apps/web/receiptrail-mock', 'apps/web/tests', 'apps/web/scripts', 'packages/receiptrail-client', 'scripts/verify-receiptrail-phase5-browser.mjs'], { cwd: root, encoding: 'utf8' }).trim().split('\n').sort();
const hashes = () => Object.fromEntries(sourcePaths.map(p => [p, createHash('sha256').update(readFileSync(path.join(root, p))).digest('hex')]));
const manifest = { at: new Date().toISOString(), head: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), target,
  workingTree: execFileSync('git', ['status','--short'], {cwd:root,encoding:'utf8'}), headless: true, mockOnly: true, sourceRewrite: false, playwright: JSON.parse(readFileSync(path.join(path.dirname(pw), 'package.json'))).version,
  node: process.version, sourceHashes: hashes(), results: [], browserErrors: [], blockedRequests: [], video: null };
const browser = await chromium.launch({ headless: true, executablePath: exe });
manifest.chromium = browser.version();
let sequence = 90;
const names = { merchant: 'Kết nối Tiệm Cà phê (Merchant)', payer: 'Kết nối Alice (Payer chỉ định)', other: 'Kết nối Bob (Ví khác / Hacker)' };
const button = (p, text) => p.getByRole('button', { name: text, exact: true });
const check = p => p.locator('.rr-action-box input[type="checkbox"]');
const badge = p => p.locator('.rr-badges .rr-badge').first();
async function status(p, expected) { await p.waitForFunction(e => document.querySelector('.rr-badges .rr-badge')?.textContent === e, expected); }
async function connect(p, role) {
  const disconnect = button(p, 'Ngắt kết nối ví');
  if (await disconnect.count()) { await disconnect.click(); await disconnect.waitFor({ state: 'hidden' }); }
  await button(p, names[role]).click();
  await disconnect.waitFor();
  await p.waitForFunction(() => !document.querySelector('.rr-wallet-actions button:disabled'));
}
async function newPage(viewport, recordVideo) {
  const context = await browser.newContext({ viewport, serviceWorkers: 'block', permissions: ['clipboard-read', 'clipboard-write'], ...(recordVideo ? { recordVideo } : {}) });
  await context.route('**/*', route => {
    if (new URL(route.request().url()).origin === origin) return route.continue();
    manifest.blockedRequests.push(route.request().url()); return route.abort();
  });
  const p = await context.newPage(); p.setDefaultTimeout(12000);
  p.on('pageerror', e => manifest.browserErrors.push(e.message));
  await p.goto(target, { waitUntil: 'domcontentloaded' });
  await p.locator('.rr-card-title').waitFor();
  assert.equal(await p.locator('.rr-wallet-actions button').count(), 4, 'All four mock fixtures must mount.');
  assert.match(await p.locator('.rr-banner-warning').innerText(), /Không ký hoặc gửi giao dịch/);
  return { context, p };
}
async function pda(p) { return p.locator('.rr-card-heading .rr-detail-value').evaluate(e => Array.from(e.childNodes).filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent).join('').match(/PDA:\s*(\w+)/)[1]); }
async function ledger(p) {
  return p.evaluate(async () => {
    const url = performance.getEntriesByType('resource').map(e => e.name).find(n => new URL(n).pathname === '/src/receiptrail/adapter.ts');
    if (!url) throw new Error('Missing observed production adapter module URL');
    const { mockEngine } = await import(url);
    return JSON.parse(JSON.stringify(await mockEngine.ledgerSnapshot(), (_, v) => typeof v === 'bigint' ? v.toString() : v));
  });
}
async function invoice(p) {
  const address = await pda(p);
  return p.evaluate(async address => {
    const url = performance.getEntriesByType('resource').map(e => e.name).find(n => new URL(n).pathname === '/src/receiptrail/adapter.ts');
    if (!url) throw new Error('Missing observed production adapter module URL');
    const { mockEngine } = await import(url);
    const data = await mockEngine.inspect(address); if (!data) throw new Error('UI/ledger address mismatch');
    return JSON.parse(JSON.stringify(data.invoice, (_, v) => typeof v === 'bigint' ? v.toString() : v));
  }, address);
}
async function create(p) {
  await connect(p, 'merchant');
  await button(p, 'Tạo Hóa đơn mới (Merchant)').click();
  await button(p, 'Mẫu: Cà phê (0.001 SOL)').click();
  const id = (++sequence).toString(16).padStart(2, '0').repeat(32);
  await p.locator('#invoice-id-input').fill(id);
  await p.waitForFunction(id => document.querySelector('.rr-action-box dl')?.textContent.includes(id), id);
  await check(p).check(); await p.locator('button[type="submit"]').click(); await status(p, 'OPEN');
  const inv = await invoice(p); assert.equal(inv.amountLamports, '1000000');
  return inv;
}
async function pay(p) { await check(p).check(); await p.locator('.rr-btn-pay').click(); }
async function saved(p, vp, id, expected, actual) {
  const file = `screenshots/${vp.width}x${vp.height}-${id}.png`;
  await p.screenshot({ path: path.join(out, file), fullPage: true });
  manifest.results.push({ id, viewport: vp, expected, actual, pass: true, screenshot: file });
  console.log(`PASS ${vp.width}x${vp.height} ${id}`);
}
try {
  for (const vp of [{ width: 1440, height: 900 }, { width: 375, height: 812 }]) {
    const { context, p } = await newPage(vp);
    try {
      assert.match(await p.locator('.rr-wallet-meta').innerText(), /Chưa kết nối ví/);
      assert.equal(await p.locator('.rr-btn-pay,.rr-btn-cancel').count(), 0);
      const initial = await invoice(p);
      assert.equal(initial.status, 'Open');
      await p.locator('.rr-card-heading .rr-copy-btn').click();
      assert.equal(await p.evaluate(() => navigator.clipboard.readText()), initial.address);
      await saved(p, vp, '01-guest', 'Guest sees full terms and PDA; cannot Pay/Cancel; copy exact PDA', { address: initial.address, state: initial.status, clipboardExact: true });

      const created = await create(p);
      assert.equal(created.payer, initial.payer); assert.equal(created.merchant, initial.merchant);
      await saved(p, vp, '02-create', 'Merchant review then Create selects the new canonical Invoice', created);

      await button(p, 'Tạo Hóa đơn mới (Merchant)').click();
      const checks = [];
      for (const [id, value] of [['#amount-input', '0.005'], ['#expiry-input', '130']]) {
        await check(p).check(); await p.locator(id).fill(value);
        await p.waitForFunction(() => !document.querySelector('.rr-action-box input[type="checkbox"]')?.checked);
        assert(await p.locator('button[type="submit"]').isDisabled()); checks.push(id);
      }
      await check(p).check(); await button(p, 'Mẫu: Cà phê (0.001 SOL)').click();
      assert.equal(await check(p).isChecked(), false); assert(await p.locator('button[type="submit"]').isDisabled());
      await saved(p, vp, '03-edit', 'Amount, expiry and preset changes consume approval', { checked: false, submitDisabled: true, fields: [...checks, 'preset'] });
      await button(p, 'Chi tiết Hóa đơn').click();

      await connect(p, 'payer'); await check(p).check();
      await connect(p, 'other'); assert.equal(await p.locator('.rr-btn-pay').count(), 0);
      await connect(p, 'payer'); assert.equal(await check(p).isChecked(), false);
      await check(p).check(); await connect(p, 'payer'); assert.equal(await check(p).isChecked(), false);
      const before = await ledger(p); await pay(p); await status(p, 'PAID'); const after = await ledger(p);
      assert.equal(BigInt(before.balances[created.payer]) - BigInt(after.balances[created.payer]), 1000000n);
      assert.equal(BigInt(after.balances[created.merchant]) - BigInt(before.balances[created.merchant]), 1000000n);
      assert.equal(await p.locator('.rr-btn-pay,.rr-btn-cancel').count(), 0);
      await saved(p, vp, '04-pay-wallet', 'Switch/disconnect invalidate; one Pay moves principal once; terminal disables actions', { before, after, state: (await invoice(p)).status });

      for (const [fault, finalState, id] of [['timeout_unknown', 'PAID', '05-unknown-processed'], ['timeout_dropped', 'OPEN', '06-unknown-dropped']]) {
        const inv = await create(p); await connect(p, 'payer'); await p.locator('#fault-select').selectOption(fault);
        const start = await ledger(p); await pay(p); await p.locator('.rr-alert-unknown').waitFor();
        const sig = await p.locator('.rr-alert-unknown code').innerText();
        for (const action of await p.locator('.rr-btn-pay,.rr-btn-cancel').all()) assert(await action.isDisabled());
        assert.equal(await pda(p), inv.address);
        const processed = await ledger(p);
        if (fault === 'timeout_dropped') assert.deepEqual(processed, start);
        else assert.equal(BigInt(start.balances[inv.payer]) - BigInt(processed.balances[inv.payer]), 1000000n);
        await p.getByRole('button', { name: /Kiểm tra lại dữ liệu mock/ }).click(); await status(p, finalState);
        await p.locator('.rr-alert-unknown').waitFor({ state: 'hidden' });
        assert.equal(await pda(p), inv.address); assert.deepEqual(await ledger(p), processed);
        assert.match(await p.locator('.notice').innerText(), new RegExp(sig));
        await saved(p, vp, id, 'Unknown locks actions, preserves PDA/signature; recheck is read-only', { address: inv.address, sig, state: finalState, ledgerAfterSubmit: processed, ledgerUnchangedOnRecheck: true });
      }

      await p.locator('#fault-select').selectOption('none'); await connect(p, 'merchant');
      const cancelBefore = await ledger(p); await check(p).check(); await p.locator('.rr-btn-cancel').click(); await status(p, 'CANCELLED');
      const cancelAfter = await ledger(p); assert.deepEqual(cancelAfter.balances, cancelBefore.balances); assert.deepEqual(cancelAfter.rents, cancelBefore.rents);
      const expired = await create(p); await button(p, '+150 slots (Gây Expired)').click(); await status(p, 'EXPIRED');
      const expiredBefore = await ledger(p); await check(p).check(); await p.locator('.rr-btn-cancel').click(); await status(p, 'CANCELLED');
      const expiredAfter = await ledger(p); assert.deepEqual(expiredAfter.balances, expiredBefore.balances); assert.deepEqual(expiredAfter.rents, expiredBefore.rents);
      const rollback = await create(p); await connect(p, 'payer'); await p.locator('#fault-select').selectOption('cpi_rollback');
      const rollbackBefore = await ledger(p); await pay(p); await p.getByRole('status').filter({ hasText: 'Thao tác mock thất bại' }).waitFor(); await status(p, 'OPEN');
      const rollbackAfter = await ledger(p); assert.deepEqual(rollbackAfter.balances, rollbackBefore.balances); assert.deepEqual(rollbackAfter.rents, rollbackBefore.rents);
      assert.equal(BigInt(rollbackAfter.feesPaid) - BigInt(rollbackBefore.feesPaid), 10000n);
      await saved(p, vp, '07-cancel-expired-rollback', 'Cancel Open/Expired keeps principal and rent; failed CPI keeps Open/principal and charges only mock fee', { expiredAddress: expired.address, rollbackAddress: rollback.address, cancelBefore, cancelAfter, expiredBefore, expiredAfter, rollbackBefore, rollbackAfter });

      await p.getByRole('button', { name: /^Danh sách Hóa đơn/ }).click();
      const overflow = await p.evaluate(() => { const t = document.querySelector('.rr-table-wrapper'); return { page: document.documentElement.scrollWidth, client: document.documentElement.clientWidth, table: t.scrollWidth, tableClient: t.clientWidth }; });
      assert(overflow.page <= overflow.client, JSON.stringify(overflow));
      if (vp.width === 375) assert(overflow.table > overflow.tableClient);
      await p.keyboard.press('Tab');
      const forward = await p.evaluate(() => { const e=document.activeElement,s=getComputedStyle(e); return { tag:e.tagName,focusVisible:e.matches(':focus-visible'),outline:s.outlineStyle,width:s.outlineWidth }; });
      assert.equal(forward.focusVisible, true); assert.notEqual(forward.outline, 'none'); assert.notEqual(forward.width, '0px');
      await p.keyboard.press('Shift+Tab');
      assert(await p.evaluate(() => document.activeElement.matches(':focus-visible')));
      await button(p, 'Chi tiết Hóa đơn').click(); await p.locator('.rr-card-heading .rr-copy-btn').click();
      assert.equal(await p.evaluate(() => navigator.clipboard.readText()), rollback.address);
      await p.getByRole('button', { name: 'Copy địa chỉ ví', exact:true }).click();
      assert.equal(await p.evaluate(() => navigator.clipboard.readText()), rollback.payer);
      await saved(p, vp, '08-layout-keyboard-clipboard', 'No page overflow; internal table scroll; visible Tab/Shift+Tab focus; exact PDA and wallet clipboard', { overflow, forward, clipboardExact:true });
    } finally { await context.close(); }
  }
  if (process.env.RECEIPTRAIL_QA_VIDEO !== '0') {
    const { context, p } = await newPage({ width:1440,height:900 }, { dir:path.join(out,'video'),size:{width:1440,height:900} });
    const video = p.video(); const started = Date.now();
    async function at(seconds,label) {
      while (Date.now()-started < seconds*1000) await p.waitForTimeout(Math.min(20000,seconds*1000-(Date.now()-started)));
      console.log(`VIDEO ${seconds}s ${label}`);
    }
    try {
      await at(0,'mock label and problem');
      await button(p,'Kịch bản Demo 165s').click();
      await at(15,'read terms'); await button(p,'Chi tiết Hóa đơn').click();
      await at(35,'merchant create'); const inv=await create(p); await status(p,'OPEN');
      await at(60,'payer pay'); await connect(p,'payer'); await pay(p); await status(p,'PAID');
      await at(85,'lost response'); await create(p); await connect(p,'payer'); await p.locator('#fault-select').selectOption('timeout_unknown'); await pay(p); await p.locator('.rr-alert-unknown').waitFor();
      await at(105,'read-only recovery'); await p.getByRole('button',{name:/Kiểm tra lại dữ liệu mock/}).click(); await status(p,'PAID');
      await at(115,'receipts and limitations'); await p.getByRole('button',{name:/^Danh sách Hóa đơn/}).click();
      await at(145,'mock storyboard and next steps'); await button(p,'Kịch bản Demo 165s').click();
      await at(162,'end');
    } finally { await context.close(); }
    const videoPath=path.join(out,'video','receiptrail-local-dry-run.webm'); await video.saveAs(videoPath);
    const duration=Number(execFileSync('/opt/homebrew/bin/ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',videoPath],{encoding:'utf8'}).trim());
    assert(duration>0 && duration<=165, `Actual video duration ${duration}s outside limit`);
    manifest.video={path:path.relative(out,videoPath),durationSeconds:duration,sha256:createHash('sha256').update(readFileSync(videoPath)).digest('hex'),note:'UI dry run, no narration; all local/mock, no source rewrite. Not a devnet e2e or final submission video.'};
  }
  assert.equal(manifest.results.length,16); assert.deepEqual(manifest.browserErrors,[]); assert.deepEqual(manifest.blockedRequests,[]);
  assert.deepEqual(hashes(),manifest.sourceHashes,'Source changed during run');
  manifest.passed=true;
} catch(error) {
  manifest.passed=false;manifest.error=String(error.stack??error);process.exitCode=1;console.error(error);
} finally {
  await browser.close(); manifest.finishedAt=new Date().toISOString();
  writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
}
console.log(JSON.stringify({passed:manifest.passed,cases:manifest.results.length,video:manifest.video?.durationSeconds}));
