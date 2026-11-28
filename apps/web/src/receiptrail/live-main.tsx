import './browser-globals.ts';
import { createRoot } from 'react-dom/client';
import { LiveApp } from './live-app.tsx';
async function start() {
  if (import.meta.env.DEV && location.hostname === '127.0.0.1' && new URLSearchParams(location.search).get('demoWallet') === '1') {
    const { registerRecordingWallets } = await import('./recording-wallet.ts');
    await registerRecordingWallets();
  }
  createRoot(document.getElementById('root')!).render(<LiveApp/>);
}
void start().catch(() => { document.getElementById('root')!.textContent = 'Could not start ReceiptRail. Reload the page to try again.'; });
