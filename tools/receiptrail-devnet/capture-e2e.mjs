import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { entries, identity, local, root } from './recording-files.mjs';
const pw = process.env.RECEIPTRAIL_PLAYWRIGHT ?? path.join(process.env.HOME, '.npm/_npx/9833c18b2d85bc59/node_modules/playwright/index.mjs');
const { chromium } = await import(pathToFileURL(pw));
const capture = path.join(local, 'capture-' + Date.now());
const out = path.join(root, 'demo/images');
fs.mkdirSync(capture, { recursive:true }); fs.mkdirSync(out, { recursive:true });
const browser = await chromium.launch({ executablePath:process.env.RECEIPTRAIL_CHROMIUM || undefined });
const context = await browser.newContext({ viewport:{width:1280,height:720},recordVideo:{dir:capture,size:{width:1280,height:720}} });
const token = fs.readFileSync(path.join(local,'recording-token'),'utf8');
await context.addInitScript(value => { if (location.origin === 'http://127.0.0.1:4317') sessionStorage.setItem('receiptrail-recording-token',value); }, token);
const page = await context.newPage(); page.setDefaultTimeout(80000);
const start = Date.now(), marks=[], errors=[], network=[];
page.on('response', async response => {
  if(response.url() !== 'https://api.devnet.solana.com/' && response.url() !== 'https://api.devnet.solana.com') return;
  try { const method=response.request().postDataJSON()?.method; const code=response.status(); const body=await response.json(); network.push({at:Date.now()-start,method,code,rpcError:body.error?.message});
    if(code>=400 || method==='sendTransaction') console.log('RPC',method,code,body.error?.message || 'accepted'); } catch {}
});
page.on('pageerror', e=>errors.push(e.message));
function mark(name) { marks.push({name,seconds:(Date.now()-start)/1000}); console.log(name); }
const btn=name=>page.getByRole('button',{name,exact:true});
const knownCreates=()=>entries().filter(e=>e.action==='create');
let paid=knownCreates()[0]?.invoice, cancelled=knownCreates()[1]?.invoice;
const launchUrl = address => 'http://127.0.0.1:4317/?demoWallet=1' + (address ? '&invoice='+address : '');
const status=page.getByTestId('receipt-status');
async function shot(name) {
  await page.evaluate(()=>window.scrollTo(0,0)); await page.screenshot({path:path.join(capture,name+'.png')});
  await page.waitForTimeout(1100);
}
async function wallet(role) {
  await page.locator('.wallet-button').click();
  const disconnect=btn('Disconnect wallet'); if (await disconnect.isVisible()) await disconnect.click();
  await btn('Local demo wallet, devnet · '+role).click();
  await disconnect.waitFor(); await btn('Close wallet panel').click();
}
async function review(button) {
  for (let i=0;i<3;i++) {
    await btn(button).click();
    const completed=await Promise.race([
      page.getByRole('button',{name:'Sign and submit'}).waitFor({timeout:55000}).then(()=>true).catch(()=>false),
      page.locator('.feedback').filter({hasText:/429|rate limit|fetch failed|network request|blockhash not found/i}).waitFor({timeout:55000}).then(()=>false).catch(()=>false)
    ]);
    if(completed) return;
    if(i===2) throw Error('Could not prepare '+button+': '+await page.locator('body').innerText().then(s=>s.slice(0,340)));
    await page.waitForTimeout(12500);
  }
}
async function sign(expectAction) {
  const n=entries().filter(e=>e.action===expectAction).length;
  await btn('Sign and submit').click();
  await page.waitForFunction(()=>!document.querySelector('dialog[open]'));
  const deadline=Date.now()+75000;
  while(Date.now()<deadline) {
    const candidate=entries().filter(e=>e.action===expectAction)[n];
    if(candidate) return candidate;
    const msg=await page.locator('.feedback').first().textContent({timeout:400}).catch(()=>'');
    if (/Recording wallet:|expired|changed|signing|Simulation failed/i.test(msg)) throw Error(msg);
    await page.waitForTimeout(800);
  }
  throw Error('No signed attempt. Inspect the ledger before continuing.');
}
async function createInvoice(forCancel) {
  await wallet('merchant'); await btn('Create').click();
  await page.getByLabel('Payer address').fill(identity.payer);
  await page.getByLabel('Amount in SOL').fill('0.00005');
  mark(forCancel?'create-second':'create-form'); if(!forCancel) await shot('02-create');
  await review('Review invoice'); if(!forCancel) {mark('create-review');await shot('review');}
  const attempt=await sign('create');
  await page.waitForURL(url=>url.searchParams.get('invoice')===attempt.invoice,{timeout:70000});
  await status.filter({hasText:'Open'}).waitFor();
  return attempt.invoice;
}
try {
  await page.goto(launchUrl(paid)); await status.waitFor(); mark('intro'); await shot('intro');
  if(!paid) paid=await createInvoice(false);
  else { await page.goto(launchUrl(paid)); await status.waitFor(); }
  console.log('primary invoice',paid);
  await wallet('payer');
  if(!entries().some(e=>e.action==='pay'&&e.invoice===paid)) {
    await page.getByLabel('Simulate lost response after payment').check(); mark('pay-form');
    await review('Review payment');mark('pay-review');await shot('pay-review');
    await sign('pay'); await page.getByRole('status').filter({hasText:/Simulated lost response/}).waitFor();
    mark('unknown');await shot('03-unknown');
    await btn('Recheck receipt').click();
  }
  for(let i=0;i<5;i++) {
    if((await status.textContent().catch(()=>''))?.includes('Paid')) break;
    await page.waitForTimeout(2200);await btn('Recheck receipt').click();
  }
  await status.filter({hasText:'Paid'}).waitFor();mark('paid');await shot('04-paid');
  if(!entries().some(e=>e.action==='retry'&&e.invoice===paid)) {
    await btn('Recheck receipt').click(); await review('Retry payment (new transaction)');mark('retry-review');await shot('retry-review');
    await sign('retry'); await page.getByRole('status').filter({hasText:/Retry rejected/}).waitFor();mark('retry-rejected');await shot('05-retry');
  }
  if(!cancelled) cancelled=await createInvoice(true); else await page.goto(launchUrl(cancelled));
  if(!entries().some(e=>e.action==='cancel'&&e.invoice===cancelled)) {
    await wallet('merchant'); await review('Review cancellation');await sign('cancel');
  }
  await status.filter({hasText:'Cancelled'}).waitFor();mark('cancelled');await shot('06-cancelled');
  assert.deepEqual(errors,[]);
} catch(e) {
  await page.screenshot({path:path.join(capture,'failure.png')}).catch(()=>{});
  console.error((await page.locator('body').innerText().catch(()=>'' )).slice(0,2200));throw e;
} finally {
  const video=page.video();await context.close();await browser.close();
  const file=await video.path();
  fs.writeFileSync(path.join(capture,'timeline.json'),JSON.stringify({start:new Date(start).toISOString(),video:file,marks,errors,network,paid,cancelled},null,2)+'\n');
  console.log('Capture:',capture);
}
