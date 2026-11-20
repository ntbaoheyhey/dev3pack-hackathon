import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ReceiptRailApp from './ReceiptRailApp';
import '../styles.css';

const root = document.getElementById('root');
if (!root) throw new Error('Thiếu vùng hiển thị ReceiptRail.');
createRoot(root).render(<StrictMode>
  <a className="skip-link" href="#main">Đến nội dung</a>
  <main id="main"><ReceiptRailApp /></main>
</StrictMode>);
