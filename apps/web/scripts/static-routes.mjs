import { mkdir, copyFile } from 'node:fs/promises';
await mkdir(new URL('../dist/lab/', import.meta.url), { recursive: true });
await copyFile(new URL('../dist/index.html', import.meta.url), new URL('../dist/lab/index.html', import.meta.url));

await mkdir(new URL('../dist/receiptrail/', import.meta.url), { recursive: true });
await copyFile(new URL('../dist/index.html', import.meta.url), new URL('../dist/receiptrail/index.html', import.meta.url));
