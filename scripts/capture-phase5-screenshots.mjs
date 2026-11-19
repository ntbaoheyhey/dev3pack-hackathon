import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../apps/web/dist');
const evidenceDir = path.resolve(__dirname, '../docs/evidence/phase5');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  let filePath = path.join(distDir, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    filePath = path.join(distDir, 'index.html');
  }

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(4173, '127.0.0.1', async () => {
  console.log('Static server running asynchronously on http://127.0.0.1:4173');
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

  const targets = [
    {
      name: 'receiptrail-desktop-view.png',
      url: 'http://127.0.0.1:4173/receiptrail/?tab=view',
      width: 1280,
      height: 900,
    },
    {
      name: 'receiptrail-desktop-create.png',
      url: 'http://127.0.0.1:4173/receiptrail/?tab=create',
      width: 1280,
      height: 900,
    },
    {
      name: 'receiptrail-desktop-list.png',
      url: 'http://127.0.0.1:4173/receiptrail/?tab=list',
      width: 1280,
      height: 900,
    },
    {
      name: 'receiptrail-desktop-demo165.png',
      url: 'http://127.0.0.1:4173/receiptrail/?tab=demo165',
      width: 1280,
      height: 900,
    },
    {
      name: 'receiptrail-mobile-view.png',
      url: 'http://127.0.0.1:4173/receiptrail/',
      width: 375,
      height: 812,
    },
    {
      name: 'receiptrail-desktop-home.png',
      url: 'http://127.0.0.1:4173/',
      width: 1280,
      height: 800,
    },
    {
      name: 'receiptrail-mobile-home.png',
      url: 'http://127.0.0.1:4173/',
      width: 375,
      height: 812,
    },
    {
      name: 'receiptrail-desktop-lab.png',
      url: 'http://127.0.0.1:4173/lab/',
      width: 1280,
      height: 800,
    },
  ];

  let hasError = false;

  for (const t of targets) {
    const out = path.join(evidenceDir, t.name);
    console.log(`Taking screenshot ${t.name} (${t.width}x${t.height})...`);
    try {
      await execFileAsync(chromePath, [
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        `--window-size=${t.width},${t.height}`,
        '--run-all-compositor-stages-before-draw',
        `--screenshot=${out}`,
        t.url,
      ], { timeout: 15000 });

      if (!fs.existsSync(out)) {
        throw new Error(`Output file ${out} was not created`);
      }
      const stats = fs.statSync(out);
      if (stats.size < 5000) {
        throw new Error(`Output file ${out} is suspiciously small: ${stats.size} bytes`);
      }
      console.log(`Saved ${t.name}: ${stats.size} bytes`);
    } catch (err) {
      console.error(`Failed ${t.name}:`, err.message);
      hasError = true;
    }
  }

  server.close(() => {
    if (hasError) {
      console.error('Screenshot capture failed for one or more targets.');
      process.exit(1);
    }
    console.log('All screenshots completed successfully with content verified.');
    process.exit(0);
  });
});
