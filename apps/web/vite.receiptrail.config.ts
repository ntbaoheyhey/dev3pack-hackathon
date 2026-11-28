import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
export default defineConfig({
  root: './receiptrail', base: './', plugins: [react()],
  server: { host: '127.0.0.1', strictPort: true, fs: { allow: [resolve('../..')] } },
  build: { outDir: '../dist-receiptrail', emptyOutDir: true, sourcemap: false,
    rollupOptions: { input: { live: resolve('receiptrail/index.html'), mock: resolve('receiptrail/mock/index.html') } } },
});
