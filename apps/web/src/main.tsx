import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from '../app/page';
import './styles.css';

const WalletLab = lazy(() => import('./WalletLab'));
const isLab = window.location.pathname.replace(/\/$/, '') === '/lab';

function App() {
  return <>
    <a className="skip-link" href="#main">Đến nội dung</a>
    <header className="site-header">
      <a className="brand" href="/" aria-label="ClusterProof — trang chủ">
        <span className="brand-mark" aria-hidden="true">c<span>p</span></span>
        ClusterProof<span className="brand-label">DEVNET LAB</span>
      </a>
      <nav aria-label="Điều hướng chính">
        <a href="/" aria-current={!isLab ? 'page' : undefined}>Kiểm tra program</a>
        <a href="/lab" aria-current={isLab ? 'page' : undefined}>Kết nối ví</a>
      </nav>
    </header>
    <main id="main">
      {isLab ? <Suspense fallback={<p role="status">Đang mở trang kết nối ví…</p>}><WalletLab /></Suspense> : <Dashboard />}
    </main>
    <footer className="site-footer"><span>ClusterProof <span className="muted">/ Bản nền Phase 3</span></span><span>Solana Devnet · Dữ liệu chỉ đọc</span></footer>
  </>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
