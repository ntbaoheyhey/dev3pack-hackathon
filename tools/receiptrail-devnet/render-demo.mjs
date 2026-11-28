import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { local, root } from './recording-files.mjs';
const [evidenceFile] = process.argv.slice(2);
const record = JSON.parse(fs.readFileSync(evidenceFile));
const { chromium } = await import(pathToFileURL(process.env.RECEIPTRAIL_PLAYWRIGHT || path.join(process.env.HOME,'.npm/_npx/9833c18b2d85bc59/node_modules/playwright/index.mjs')));
const dir = path.join(local,'render'), images=path.join(root,'demo/images');
fs.mkdirSync(dir,{recursive:true});fs.mkdirSync(images,{recursive:true});
const tracks=fs.readdirSync(local).filter(n=>n.startsWith('capture-')&&fs.existsSync(path.join(local,n,'timeline.json')))
  .map(n=>({...JSON.parse(fs.readFileSync(path.join(local,n,'timeline.json'))),dir:path.join(local,n)}))
  .filter(x=>x.paid===record.demoInvoice);
const lookup=name=>{
  const track=tracks.find(t=>t.marks.some(m=>m.name===name));assert(track,'Missing captured scene '+name);
  return {track, sec:track.marks.find(m=>m.name===name).seconds};};
const still=(mark,file)=>path.join(lookup(mark).track.dir,file+'.png');
const movie=(first,last,pad=1)=>{const a=lookup(first),b=lookup(last);assert.equal(a.track.dir,b.track.dir);
  return {video:a.track.video,start:Math.max(0,a.sec-0.2),length:Math.max(1,b.sec-a.sec+pad)};};
const frame = (p) => ({image:p});
for(const [target,mark,file] of [['02-create','create-form','02-create'],['03-unknown','unknown','03-unknown'],['04-paid','paid','04-paid'],['05-retry','retry-rejected','05-retry']]) {
  fs.copyFileSync(still(mark,file),path.join(images,target+'.png'));
}
const browser=await chromium.launch({executablePath:process.env.RECEIPTRAIL_CHROMIUM || undefined});
const page=await browser.newPage({viewport:{width:1280,height:720},deviceScaleFactor:1});
const graphicCss='*{box-sizing:border-box}body{margin:0;font:22px Inter,Helvetica Neue,Arial,sans-serif;color:#173b2e;background:#f6f7ef}main{padding:64px;height:100vh}.brand{font-weight:750;letter-spacing:-.055em}.k{font:600 16px ui-monospace,Menlo,monospace;text-transform:uppercase;letter-spacing:.08em;color:#426952}h1{font-size:56px;letter-spacing:-.065em;margin:24px 0 32px}h2{font-size:28px;margin:0 0 16px;letter-spacing:-.04em}.flow{display:flex;gap:17px}.card{flex:1;background:#fffef8;border:1px solid #c6d1c3;border-radius:18px;padding:26px}.card p{line-height:1.45;font-size:21px}.proof{margin-top:32px;background:#173b2e;color:#eff4dd;padding:24px 28px;border-radius:16px;line-height:1.55}.mono{font-family:ui-monospace,Menlo,monospace}';
const head='<meta charset="utf-8"><style>'+graphicCss+'</style>';
await page.setContent(head+'<main><div class="brand">ReceiptRail <span class="k"> / Solana devnet</span></div><h1>Why a second payment stops</h1><div class="flow"><section class="card"><h2>Create</h2><p>The merchant fixes the payer, amount and expiry in one invoice account.</p></section><section class="card"><h2>Pay</h2><p>On an open invoice, the program transfers SOL and records Paid in the same transaction.</p></section><section class="card"><h2>Retry</h2><p>A new transaction reads Paid and returns <strong>InvoiceNotOpen</strong> before transferring SOL.</p></section></div><div class="proof">Observed on the same invoice: <strong>50,000 lamports paid once</strong> · <strong>0 principal on retry</strong><br>Rejected transaction fee: 5,000 lamports · Finalized on Solana devnet</div></main>');
await page.screenshot({path:path.join(images,'06-architecture.png')});
await page.setViewportSize({width:1080,height:1080});
await page.setContent(head+'<style>body{background:#193c32;color:#f5f6e8}main{padding:98px}.t{display:inline-grid;gap:12px;transform:skew(-14deg)}.t i{background:#dbeeb9;width:138px;height:19px;border-radius:6px}.t i:nth-child(2){width:104px}.t i:nth-child(3){width:124px}h1{font-size:108px;margin:42px 0 10px}p{font-size:36px;line-height:1.3;margin:0;color:#dfe8cc}.receipt{margin:88px 0 0 62px;transform:rotate(-4deg);background:#fffef4;color:#193c32;border-radius:18px;padding:38px 46px;width:685px;box-shadow:10px 18px #0e3026}.receipt b{display:block;font-size:70px;letter-spacing:-.06em}.settled{border-top:3px dashed #aebda6;padding-top:24px;font-size:25px;margin-top:22px}</style><main><div class="t"><i></i><i></i><i></i></div><h1>ReceiptRail</h1><p>A shared receipt for SOL payments.</p><div class="receipt"><span class="k">Solana devnet / invoice</span><b>0.00005 SOL</b><div class="settled">✓ Paid &nbsp; · &nbsp; One settled transfer</div></div></main>');
await page.screenshot({path:path.join(images,'cover.png')});
await page.setViewportSize({width:1280,height:720});
const liveImage=path.join(images,'01-live.png');
assert(fs.existsSync(liveImage),'Capture the public guest page before rendering.');
const scenes=[
 {title:'A missing response', src:frame(liveImage), text:'A payer sends SOL, then the checkout loses its response. Has the merchant been paid? ReceiptRail gives both parties one invoice they can open to find out.'},
 {title:'Create the invoice',src:movie('create-form','create-review',1.1),text:'The merchant enters the designated payer and an amount. The review shows the exact invoice address, expiry slot, network fee and account rent before the wallet signs.'},
 {title:'Review and pay',src:movie('pay-form','pay-review',1.3),text:'Here the payer authorizes fifty thousand lamports. This is a local Wallet Standard wallet signing a real transaction on Solana devnet. We enable the lost response demonstration before paying.'},
 {title:'Simulated lost response',src:frame(still('unknown','03-unknown')),text:'The network accepted the transaction. We deliberately hide the response in the interface. The browser keeps the invoice address and signature. The next action is to recheck this same receipt.'},
 {title:'Read the shared receipt',src:frame(still('paid','04-paid')),text:'Recheck reads the account. Its status is Paid. The payer and merchant can open the same address, including from a browser with no wallet connected.'},
 {title:'Try a fresh transaction',src:frame(still('retry-review','retry-review')),text:'The original payer now tries a second transaction with a new blockhash. The review shows the expected program rejection and the fee that sending this demonstration can still cost.'},
 {title:'Check the rejected retry',src:movie('retry-rejected','retry-rejected',1.0),text:'The chain finalized the rejection with Invoice Not Open. The merchant gained zero lamports on the retry. Only the five thousand lamport network fee was charged to the payer.'},
 {title:'How the program enforces it',src:frame(path.join(images,'06-architecture.png')),text:'The Anchor program checks the payer and invoice state. It records Paid in the same atomic transaction as the transfer. The runtime tests cover rollback, wrong signers, expiry and duplicate payment.'},
 {title:'Limits and verification',src:frame(liveImage),text:'ReceiptRail supports native SOL on devnet. Merchants must map each order to one invoice ID. Open the public demo and follow the payment and rejected retry links to verify the result yourself.'}
];
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const run=(cmd,args)=>execFileSync(cmd,args,{stdio:['ignore','pipe','pipe']});
const duration=file=>Number(run('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nk=1:nw=1',file]).toString().trim());
let elapsed=0;const parts=[],script=[],subtitles=[];
const time=(seconds)=>{const n=Math.floor(seconds);return Math.floor(n/60)+':'+String(n%60).padStart(2,'0');};
try{
  for(const [i,scene] of scenes.entries()){
    const name=String(i+1).padStart(2,'0'), voice=path.join(dir,name+'.aiff'), overlay=path.join(dir,name+'.png'), part=path.join(dir,name+'.mp4');
    run('say',['-v','Samantha','-r','145','-o',voice,scene.text]);
    const seconds=Math.ceil((duration(voice)+1.15)*25)/25;
    await page.setContent('<style>*{box-sizing:border-box}html,body{margin:0;background:transparent;font:20px Inter,Helvetica,Arial,sans-serif;color:#fffef4}.captions{position:fixed;left:0;right:0;bottom:0;height:110px;background:#122c23;padding:10px 48px}.title{font-size:14px;font-weight:bold;color:#c5e9aa;letter-spacing:.04em;display:flex;justify-content:space-between}.body{font-size:20px;line-height:1.28;margin-top:7px;max-width:1185px}</style><div class="captions"><div class="title"><span>'+esc(scene.title)+'</span><span>Local demo wallet, devnet · Edited for time</span></div><div class="body">'+esc(scene.text)+'</div></div>');
    await page.screenshot({path:overlay,omitBackground:true});
    const input=scene.src.image?['-loop','1','-framerate','25','-i',scene.src.image]:['-ss',String(scene.src.start),'-t',String(Math.min(scene.src.length,seconds)),'-i',scene.src.video];
    run('ffmpeg',['-hide_banner','-loglevel','error','-y',...input,'-loop','1','-framerate','25','-i',overlay,'-i',voice,
      '-filter_complex','[0:v]fps=25,scale=1088:612,pad=1280:720:96:0:color=0x122c23,tpad=stop_mode=clone:stop_duration='+seconds+'[base];[base][1:v]overlay=0:0:format=auto,format=yuv420p[v]',
      '-map','[v]','-map','2:a:0','-af','apad','-t',String(seconds),'-c:v','libx264','-preset','veryfast','-crf','20','-c:a','aac','-b:a','112k','-ar','48000','-ac','1',part]);
    parts.push('file '+name+'.mp4');script.push('| '+time(elapsed)+'–'+time(elapsed+seconds)+' | '+scene.title+' | '+scene.text+' |');
    subtitles.push({start:elapsed,end:elapsed+seconds,title:scene.title,text:scene.text});
    elapsed+=seconds;
  }
} finally {await browser.close();}
fs.writeFileSync(path.join(dir,'parts.txt'),parts.join('\n')+'\n');
const dest=path.join(root,'demo/receiptrail-demo.mp4');
run('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',path.join(dir,'parts.txt'),'-c','copy','-movflags','+faststart',dest]);
assert(duration(dest)<=170,'Export exceeds 170 seconds.');
fs.writeFileSync(path.join(root,'demo/SCRIPT.md'),'# ReceiptRail demo script\n\nEnglish narration and on-screen captions. The merchant and payer used a local Wallet Standard wallet on Solana devnet. The public application contains no recording wallet. RPC waiting time is edited.\n\n| Time | Scene | Narration and captions |\n| --- | --- | --- |\n'+script.join('\n')+'\n');
fs.writeFileSync(path.join(dir,'chapters.json'),JSON.stringify(subtitles,null,2)+'\n');
console.log('Exported',dest,duration(dest),'seconds',fs.statSync(dest).size,'bytes');
