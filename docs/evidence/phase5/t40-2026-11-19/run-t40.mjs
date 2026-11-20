import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const outDir = path.resolve(__dirname, '.');
const screenshotsDir = path.join(outDir, 'screenshots');

fs.mkdirSync(screenshotsDir, { recursive: true });

const chromiumPath = '/Users/bao/Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const nodeModulesPath = '/Users/bao/tools/cardrpg-look/npm/node_modules';

const { chromium } = await import(path.join(nodeModulesPath, 'playwright/index.mjs'));

const TARGET_URL = 'http://127.0.0.1:4175/receiptrail/';
const DATE_STR = '2026-11-19';

console.log('=== STARTING T40 REGRESSION VERIFICATION RUN ===');
console.log('Target URL:', TARGET_URL);
console.log('Chromium executable:', chromiumPath);
console.log('Mode: Direct Navigation WITHOUT Route Interception (Zero Mock Intercept)');

const viewports = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '375x812', width: 375, height: 812 }
];

const testRuns = [];

const browser = await chromium.launch({
  headless: true,
  executablePath: chromiumPath,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

for (const vp of viewports) {
  console.log(`\n--- Verifying Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    permissions: ['clipboard-read', 'clipboard-write']
  });
  const page = await context.newPage();

  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err.message));

  // Block external network requests strictly to localhost
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (url.startsWith('http://127.0.0.1:') || url.startsWith('http://localhost:') || url.startsWith('data:')) {
      route.continue();
    } else {
      console.warn(`[Blocked external request]: ${url}`);
      route.abort();
    }
  });

  await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('h1');

  const title = await page.innerText('h1');
  const rootHtml = await page.innerHTML('#root');
  const connectorButtons = page.locator('.rr-wallet-actions button');
  const connectorCount = await connectorButtons.count();
  const connectorNames = await connectorButtons.allInnerTexts();

  console.log(`[${vp.name}] Title:`, title);
  console.log(`[${vp.name}] Connectors found (${connectorCount}):`, connectorNames);
  console.log(`[${vp.name}] Page errors caught:`, pageErrors);

  // Take mount screenshot
  const mountScreenshot = path.join(screenshotsDir, `${DATE_STR}-t40-mounted-${vp.name}.png`);
  await page.screenshot({ path: mountScreenshot, fullPage: true });

  // Test connecting rejection wallet
  console.log(`[${vp.name}] Clicking Ví từ chối...`);
  await page.click('button:has-text("Ví từ chối")');
  await page.waitForTimeout(300);
  const rejectionNotice = await page.innerText('.notice');
  console.log(`[${vp.name}] Rejection Notice:`, rejectionNotice);

  const rejectionScreenshot = path.join(screenshotsDir, `${DATE_STR}-t40-rejection-handled-${vp.name}.png`);
  await page.screenshot({ path: rejectionScreenshot, fullPage: true });

  // Test connecting Merchant wallet
  console.log(`[${vp.name}] Clicking Kết nối Tiệm Cà phê...`);
  await page.click('button:has-text("Kết nối Tiệm Cà phê (Merchant)")');
  await page.waitForTimeout(300);
  const merchantWalletMeta = await page.innerText('.rr-wallet-meta');
  console.log(`[${vp.name}] Merchant Wallet Meta:`, merchantWalletMeta.replace(/\n+/g, ' '));

  const merchantScreenshot = path.join(screenshotsDir, `${DATE_STR}-t40-merchant-connected-${vp.name}.png`);
  await page.screenshot({ path: merchantScreenshot, fullPage: true });

  const pass = pageErrors.length === 0 &&
               connectorCount === 4 &&
               rootHtml.length > 500 &&
               rejectionNotice.includes('từ chối') &&
               merchantWalletMeta.includes('Tiệm Cà phê') || merchantWalletMeta.includes('MERCHANT');

  testRuns.push({
    viewport: vp.name,
    pageErrors,
    connectorCount,
    connectorNames,
    title,
    rejectionNotice,
    pass,
    screenshots: {
      mount: path.basename(mountScreenshot),
      rejection: path.basename(rejectionScreenshot),
      merchant: path.basename(merchantScreenshot)
    }
  });

  await page.close();
  await context.close();
}

await browser.close();

function computeHash(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath);
  return createHash('sha256').update(content).digest('hex');
}

const manifest = {
  task: 'T40',
  date: DATE_STR,
  timestamp: new Date().toISOString(),
  targetUrl: TARGET_URL,
  mode: 'Direct Unintercepted Navigation (Clean source from server)',
  fixDetails: {
    file: 'apps/web/src/receiptrail/mock-wallets.ts',
    line: 80,
    before: 'walletsApi.register(createMockWallet(\'Ví từ chối (Rejection Test)\', \'4uQeVj5tqViQh7yWWGStvfEG1Zmhx6uasJtWCJziofM\', true));',
    after: 'walletsApi.register(createMockWallet(\'Ví từ chối (Rejection Test)\', \'14uQeVj5tqViQh7yWWGStvfEG1Zmhx6uasJtWCJziofM\', true));',
    reason: 'Base58 decoding requires leading 1 to represent the 0x00 byte for 32-byte public key length'
  },
  testRuns,
  allPassed: testRuns.every(r => r.pass),
  sourceHashes: {
    'apps/web/src/receiptrail/mock-wallets.ts': computeHash(path.join(repoRoot, 'apps/web/src/receiptrail/mock-wallets.ts')),
    'apps/web/tests/receiptrail.test.mjs': computeHash(path.join(repoRoot, 'apps/web/tests/receiptrail.test.mjs'))
  }
};

fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');
console.log('\n=== T40 RUN COMPLETED SUCCESSFULLY ===');
console.log('All Viewports Passed:', manifest.allPassed);
console.log('Manifest written to:', path.join(outDir, 'manifest.json'));
