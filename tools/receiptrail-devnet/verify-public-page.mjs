import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { root } from './recording-files.mjs';
const [site] = process.argv.slice(2);
assert(/^https:\/\/[a-z0-9.-]+\/?$/.test(site));
const sample = JSON.parse(fs.readFileSync(path.join(root,'apps/web/src/receiptrail/sample.json')));
const { chromium } = await import(pathToFileURL(process.env.RECEIPTRAIL_PLAYWRIGHT || path.join(process.env.HOME,'.npm/_npx/9833c18b2d85bc59/node_modules/playwright/index.mjs')));
const browser = await chromium.launch({executablePath:process.env.RECEIPTRAIL_CHROMIUM || undefined});
const checks = [];
const errors = [];
const out = path.join(root,'demo/images');
fs.mkdirSync(out,{recursive:true});
try {
  for (const [width,height] of [[1280,720],[375,812]]) {
    const context=await browser.newContext({viewport:{width,height}});
    const page=await context.newPage();
    page.on('pageerror',e=>errors.push(e.message));
    page.setDefaultTimeout(60000);
    const url = new URL(site); url.searchParams.set('invoice',sample.address);
    const main=await page.goto(url.href,{waitUntil:'domcontentloaded'});
    console.log('public guest',width,main.status(),new URL(page.url()).host);
    assert.equal(main.status(),200);
    const status=page.getByTestId('receipt-status');await status.waitFor();
    assert.match(await status.innerText(),/Paid/);
    const live=page.getByText('READ FROM DEVNET',{exact:true});
    if(!await live.isVisible()) { await page.getByRole('button',{name:'Recheck receipt',exact:true}).click(); }
    await live.waitFor();
    assert.equal(await page.locator('button.wallet-button').innerText(),'Connect wallet');
    assert(await page.getByRole('link',{name:/Rejected retry/}).getAttribute('href').then(h=>h.includes(sample.retry.signature)));
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
    assert(!overflow,'Horizontal overflow.');
    const filename=width===1280?path.join(out,'01-live.png'):path.join(root,'docs/evidence/phase6/public-mobile-2026-11-28.png');
    await page.screenshot({path:filename});
    await page.getByRole('button',{name:'Find',exact:true}).click();
    await page.getByLabel('Invoice account').fill(sample.address);
    await page.getByRole('button',{name:'Open receipt',exact:true}).click();
    await status.waitFor();assert.match(await status.innerText(),/Paid/);
    await page.getByRole('button',{name:'Connect wallet',exact:true}).click();
    assert(await page.getByRole('dialog').isVisible());
    assert(await page.getByText('No Wallet Standard wallet detected.',{exact:false}).isVisible());
    await page.keyboard.press('Escape');assert(!await page.getByRole('dialog').isVisible());
    checks.push({width,height,origin:main.url(),status:main.status(),paid:true,walletRequired:false,liveRpc:true,overflow,pageErrors:[...errors],
      reopenedByAddress:true,publicWalletPanel:true,screenshot:path.relative(root,filename)});
    await context.close();
  }
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(root,'docs/evidence/phase6/public-browser-2026-11-28.json'),JSON.stringify({at:new Date().toISOString(),site,invoice:sample.address,browser:browser.version(),checks},null,2)+'\n');
} finally {await browser.close();}
