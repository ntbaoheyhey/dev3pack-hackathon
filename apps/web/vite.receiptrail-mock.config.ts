import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Separate local output: the existing ClusterProof build and Site stay intact.
export default defineConfig({
  root: './receiptrail-mock',
  plugins: [react()],
  build: { outDir: '../dist-receiptrail-mock', emptyOutDir: true, sourcemap: false },
});
