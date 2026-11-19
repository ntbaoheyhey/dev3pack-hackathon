import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from '../app/page';
import './styles.css';

const WalletLab = lazy(() => import('./WalletLab'));
const ReceiptRailApp = lazy(() => import('./receiptrail/ReceiptRailApp'));

const path = window.location.pathname.replace(/\/$/, '');
const isLab = path === '/lab';
const isReceiptRail = path === '/receiptrail';

function App() {
  return <>
    <a className="skip-link" href="#main">Đến nội dung</a>
    <header className="site-header">
      <a className="brand" href="/" aria-label="ReceiptRail & ClusterProof — trang chủ">
        <span className="brand-mark" aria-hidden="true">r<span>r</span></span>
        ReceiptRail<span className="brand-label">SOLANA PAYMENTS</span>
      </a>
      <nav aria-label="Điều hướng chính">
        <a href="/receiptrail" aria-current={isReceiptRail ? 'page' : undefined}>ReceiptRail</a>
        <a href="/" aria-current={!isLab && !isReceiptRail ? 'page' : undefined}>Kiểm tra program</a>
        <a href="/lab" aria-current={isLab ? 'page' : undefined}>Kết nối ví</a>
      </nav>
    </header>
    <main id="main">
      {isReceiptRail ? (
        <Suspense fallback={<p role="status">Đang tải ứng dụng ReceiptRail…</p>}>
          <ReceiptRailApp />
        </Suspense>
      ) : isLab ? (
        <Suspense fallback={<p role="status">Đang mở trang kết nối ví…</p>}>
          <WalletLab />
        </Suspense>
      ) : (
        <Dashboard />
      )}
    </main>
    <footer className="site-footer">
      <span>ReceiptRail &amp; ClusterProof <span className="muted">/ Phase 5 Local Demo</span></span>
      <span>Solana Devnet · Giao diện cục bộ</span>
    </footer>
  </>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
