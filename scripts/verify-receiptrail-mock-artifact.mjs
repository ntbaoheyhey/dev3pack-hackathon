// Verify the exact standalone static build locally, without source rewriting.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'docs/evidence/phase5/mock-artifact-2026-11-20');
const dist = path.join(root, 'apps/web/dist-receiptrail-mock');
const pw = process.env.RECEIPTRAIL_PLAYWRIGHT ?? '/Users/bao/.npm/_npx/9833c18b2d85bc59/node_modules/playwright/index.mjs';
const executablePath = process.env.RECEIPTRAIL_CHROMIUM ?? '/Users/bao/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const url = process.env.RECEIPTRAIL_MOCK_URL ?? 'http://127.0.0.1:4176/';
assert(['127.0.0.1', 'localhost', '[::1]'].includes(new URL(url).hostname));
assert(existsSync(pw) && existsSync(executablePath), 'Missing cache; do not install');
const sha = file => createHash('sha256').update(readFileSync(file)).digest('hex');
function files(dir) { return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(path.join(dir,e.name)) : [path.join(dir,e.name)]); }
const hashes = () => Object.fromEntries(files(dist).map(f => [path.relative(dist,f),sha(f)]));
mkdirSync(path.join(out, 'screenshots'), { recursive: true });
const report = { at:new Date().toISOString(), head:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(), url, headless:true, sourceRewrite:false, mockOnly:true, artifactHashes:hashes(), cases:[], errors:[], blockedRequests:[], responses:[] };
assert(Object.keys(report.artifactHashes).every(f => f === 'index.html' || /^assets\/index-[\w-]+\.(js|css)$/.test(f)), 'Unexpected route or asset in standalone build');
assert.match(readFileSync(path.join(dist,'index.html'),'utf8'), /ReceiptRail/);
const { chromium } = await import(pathToFileURL(pw).href);
const browser = await chromium.launch({ headless:true, executablePath });
report.chromium = browser.version();
let id = 160;
const names = { merchant:'Kết nối Tiệm Cà phê (Merchant)', payer:'Kết nối Alice (Payer chỉ định)' };
const button = (p,name) => p.getByRole('button',{name,exact:true});
const check = p => p.locator('.rr-action-box input[type="checkbox"]');
async function state(p,want) { await p.waitForFunction(w => document.querySelector('.rr-badges .rr-badge')?.textContent === w,want); }
async function connect(p,role) {
  const off=button(p,'Ngắt kết nối ví'); if(await off.count()) { await off.click(); await off.waitFor({state:'hidden'}); }
  await button(p,names[role]).click(); await off.waitFor();
  await p.waitForFunction(() => !document.querySelector('.rr-wallet-actions button:disabled'));
}
async function create(p) {
  await connect(p,'merchant'); await button(p,'Tạo Hóa đơn mới (Merchant)').click();
  await button(p,'Mẫu: Cà phê (0.001 SOL)').click();
  const value=(++id).toString(16).repeat(32); await p.locator('#invoice-id-input').fill(value);
  await p.waitForFunction(v => document.querySelector('.rr-action-box dl')?.textContent.includes(v),value);
  await check(p).check(); await p.locator('button[type="submit"]').click(); await state(p,'OPEN');
}
async function pay(p) { await check(p).check(); await p.locator('.rr-btn-pay').click(); }
async function save(p,vp,name,actual) {
  const screenshot=`screenshots/${vp.width}-${name}.png`;
  await p.screenshot({path:path.join(out,screenshot),fullPage:true});
  report.cases.push({viewport:vp,name,pass:true,actual,screenshot}); console.log(`PASS static ${vp.width} ${name}`);
}
try {
  for(const vp of [{width:1440,height:900},{width:375,height:812}]) {
    const context=await browser.newContext({viewport:vp,serviceWorkers:'block',permissions:['clipboard-read','clipboard-write']});
    await context.route('**/*',route => {
      if(new URL(route.request().url()).origin === new URL(url).origin) return route.continue();
      report.blockedRequests.push(route.request().url()); return route.abort();
    });
    const p=await context.newPage(); p.setDefaultTimeout(12000);
    p.on('pageerror',error=>report.errors.push(error.message));
    p.on('response',response=>report.responses.push({url:response.url(),status:response.status()}));
    try {
      await p.goto(url); await p.locator('.rr-card-title').waitFor();
      assert.match(await p.title(),/ReceiptRail/);
      assert.equal(await p.locator('.rr-wallet-actions button').count(),4);
      assert.equal(await p.getByRole('link',{name:'Kiểm tra program',exact:true}).count(),0);
      assert.equal(await p.locator('a[href="/lab"]').count(),0);
      assert.match(await p.locator('.rr-banner-warning').innerText(),/Không ký hoặc gửi giao dịch/);
      assert.equal(await p.locator('.rr-btn-pay,.rr-btn-cancel').count(),0);
      await button(p,'Kết nối Ví từ chối (Rejection Test)').click();
      await p.getByRole('status').filter({hasText:/từ chối/}).waitFor();
      await save(p,vp,'guest-reject',{fixtures:4,realWalletFlow:false});
      await create(p); await connect(p,'payer'); await pay(p); await state(p,'PAID');
      assert.equal(await p.locator('.rr-btn-pay,.rr-btn-cancel').count(),0);
      await save(p,vp,'create-pay-terminal',{state:'Paid',payAgain:false});
      for(const [fault,want] of [['timeout_unknown','PAID'],['timeout_dropped','OPEN']]) {
        await create(p); await connect(p,'payer'); await p.locator('#fault-select').selectOption(fault); await pay(p);
        await p.locator('.rr-alert-unknown').waitFor();
        const signature=await p.locator('.rr-alert-unknown code').innerText();
        await p.getByRole('button',{name:/Kiểm tra lại dữ liệu mock/}).click(); await state(p,want);
        await p.locator('.rr-alert-unknown').waitFor({state:'hidden'});
        assert((await p.locator('.notice').innerText()).includes(signature));
        await save(p,vp,fault,{state:want,signature});
      }
      await p.locator('#fault-select').selectOption('none'); await connect(p,'merchant');
      await button(p,'+150 slots (Gây Expired)').click(); await state(p,'EXPIRED');
      await check(p).check(); await p.locator('.rr-btn-cancel').click(); await state(p,'CANCELLED');
      await p.getByRole('button',{name:/^Danh sách Hóa đơn/}).click();
      const overflow=await p.evaluate(()=>({page:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
      assert(overflow.page<=overflow.client,JSON.stringify(overflow));
      await p.keyboard.press('Tab'); assert(await p.evaluate(()=>document.activeElement.matches(':focus-visible')));
      await save(p,vp,'cancel-expired-layout',{state:'Cancelled',overflow});
      await p.reload(); await p.locator('.rr-card-title').waitFor();
      assert.equal(await p.locator('.rr-wallet-actions button').count(),4);
      assert.match(await p.locator('.rr-wallet-meta').innerText(),/Chưa kết nối ví/);
    } finally { await context.close(); }
  }
  assert.equal(report.cases.length,10); assert.deepEqual(report.errors,[]); assert.deepEqual(report.blockedRequests,[]);
  assert(report.responses.every(r=>r.status===200)); assert.deepEqual(hashes(),report.artifactHashes);
  report.passed=true;
} catch(error) { report.passed=false;report.error=String(error.stack??error);process.exitCode=1;console.error(error); }
finally { await browser.close(); report.finishedAt=new Date().toISOString(); writeFileSync(path.join(out,'manifest.json'),JSON.stringify(report,null,2)+'\n'); }
console.log(JSON.stringify({passed:report.passed,cases:report.cases.length}));
