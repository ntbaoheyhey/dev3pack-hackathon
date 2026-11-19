// Completes the PHASE5-PLAN slot-change row without modifying the running app.
import assert from 'node:assert/strict';
import { writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/Users/bao/.npm/_npx/9833c18b2d85bc59/node_modules/playwright/index.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../../../..');
const hash=f=>createHash('sha256').update(readFileSync(path.join(root,f))).digest('hex');
const sources=['apps/web/src/receiptrail/ReceiptRailApp.tsx','apps/web/src/receiptrail/confirmation.ts','apps/web/src/receiptrail/mock-wallet-connection.ts'];
const report={at:new Date().toISOString(),head:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),sourceHashes:Object.fromEntries(sources.map(f=>[f,hash(f)])),headless:true,mockOnly:true,sourceRewrite:false,cases:[],errors:[],blockedRequests:[]};
const browser=await chromium.launch({headless:true,executablePath:'/Users/bao/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
try {
  for(const width of [1440,375]) {
    const context=await browser.newContext({viewport:{width,height:width===375?812:900},serviceWorkers:'block'});
    await context.route('**/*',route=>{
      if(new URL(route.request().url()).origin==='http://127.0.0.1:4175') return route.continue();
      report.blockedRequests.push(route.request().url());return route.abort();
    });
    const p=await context.newPage();p.on('pageerror',e=>report.errors.push(e.message));
    try {
      await p.goto('http://127.0.0.1:4175/receiptrail/');
      await p.getByRole('button',{name:'Kết nối Tiệm Cà phê (Merchant)',exact:true}).click();
      await p.getByRole('button',{name:'Tạo Hóa đơn mới (Merchant)',exact:true}).click();
      const check=p.locator('.rr-action-box input[type="checkbox"]'),submit=p.locator('button[type="submit"]');
      await check.check();assert.equal(await submit.isDisabled(),false);
      const before=await p.locator('.rr-action-box dl').innerText();
      await p.getByRole('button',{name:'+20 slots',exact:true}).click();
      await p.waitForFunction(()=>!document.querySelector('.rr-action-box input[type="checkbox"]')?.checked);
      assert.equal(await submit.isDisabled(),true);
      const after=await p.locator('.rr-action-box dl').innerText();assert.notEqual(after,before);
      await check.check();assert.equal(await submit.isDisabled(),false);
      report.cases.push({width,steps:['review Create','approve','advance20slots','observe invalidation','review and approve again'],expected:'slot change consumes approval and refreshes expiry before submit',before,after,pass:true});
    } finally { await context.close(); }
  }
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.blockedRequests,[]);report.passed=true;
} catch(e){report.passed=false;report.error=String(e.stack??e);process.exitCode=1;}
finally {await browser.close();writeFileSync(path.join(here,'slot-confirmation.json'),JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify({passed:report.passed,cases:report.cases.length,error:report.error}));
