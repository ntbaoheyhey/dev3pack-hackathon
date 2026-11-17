import { useState } from 'react';
import { autoDiscover, createClient } from '@solana/client';
import { SolanaProvider, useWalletConnection } from '@solana/react-hooks';
import { DEVNET_RPC } from './lib/inspect.ts';

function WalletPanel({ rediscover }: { rediscover: () => void }) {
  const { connectors, connect, disconnect, wallet, status, currentConnector, isReady } = useWalletConnection();
  const [message, setMessage] = useState('');
  const [disconnecting, setDisconnecting] = useState(false);
  const ready = connectors.filter((connector) => connector.ready !== false && connector.isSupported());
  async function connectWallet(id: string) {
    setMessage('');
    try { await connect(id); }
    catch { setMessage('Chưa kết nối được ví. Nếu bạn đã từ chối, chọn ví để thử lại khi sẵn sàng.'); }
  }
  async function disconnectWallet() {
    setDisconnecting(true); setMessage('');
    try { await disconnect(); setMessage('Đã ngắt kết nối ví.'); }
    catch { setMessage('Chưa ngắt được kết nối. Hãy thử lại hoặc ngắt trong ví.'); }
    finally { setDisconnecting(false); }
  }
  return <section className="panel wallet-panel" aria-labelledby="wallet-title">
    <div className="panel-heading"><span className="step">01</span><h2 id="wallet-title">Kết nối ví của bạn</h2><span className="badge">DEVNET RPC</span></div>
    <div aria-live="polite" className="wallet-state">
      {status === 'connected' && wallet ? <>
        <span className="result-label observed">ĐÃ KẾT NỐI</span><h3>{currentConnector?.name ?? wallet.connector.name}</h3>
        <p className="address connected-address">{wallet.account.address}</p>
        <p>Ví đã chia sẻ địa chỉ với trang lab. Bạn chưa gửi giao dịch nào qua trang này.</p>
        <button className="secondary" disabled={disconnecting} onClick={() => void disconnectWallet()}>{disconnecting ? 'Đang ngắt…' : 'Ngắt kết nối'}</button>
      </> : !isReady ? <p>Đang tìm ví…</p> : <>
        <span className="result-label unknown">CHƯA KẾT NỐI</span>
        <h3>{ready.length ? 'Chọn ví để tiếp tục' : 'Chưa tìm thấy ví trong trình duyệt'}</h3>
        <p>{ready.length ? 'Cho phép chia sẻ địa chỉ trong cửa sổ ví. Bạn có thể từ chối hoặc ngắt kết nối bất cứ lúc nào.' : 'Mở trang này trong trình duyệt có ví hỗ trợ Wallet Standard, rồi tìm lại ví.'}</p>
        <div className="wallet-options">{ready.map((connector) => <button className="secondary" key={connector.id} disabled={status === 'connecting'} onClick={() => void connectWallet(connector.id)}>{status === 'connecting' ? 'Đang chờ ví…' : `Kết nối ${connector.name}`}</button>)}</div>
        {status !== 'connecting' && <button className="text-button" onClick={rediscover}>Tìm lại ví ↻</button>}
      </>}
      {message && <p role="status" className="notice">{message}</p>}
    </div>
  </section>;
}

function ConnectedLab({ rediscover }: { rediscover: () => void }) {
  const [client] = useState(() => createClient({ endpoint: DEVNET_RPC, walletConnectors: autoDiscover() }));
  return <SolanaProvider client={client}><WalletPanel rediscover={rediscover} /></SolanaProvider>;
}

export default function WalletLab() {
  const [revision, setRevision] = useState(0);
  return <>
    <section className="intro compact"><p className="eyebrow"><span className="dot" /> DEVNET LAB</p><h1>Một kết nối.<br /><span>Bắt đầu thật rõ ràng.</span></h1><p className="lead">Thử kết nối và ngắt ví. Trang này chỉ lấy địa chỉ công khai,<br className="desktop-break" /> không yêu cầu ký hay gửi giao dịch.</p></section>
    <div className="workspace"><ConnectedLab key={revision} rediscover={() => setRevision((value) => value + 1)} /><aside className="side-notes"><section className="scope-card"><p className="eyebrow">TRƯỚC KHI KẾT NỐI</p><h2>Ví nằm <br />trong tay bạn.</h2><p>Lab dùng RPC Devnet. Kết nối ví không tự đổi mạng đang chọn trong ứng dụng ví của bạn.</p><p>Không nhập seed phrase hoặc private key vào trang web.</p><a className="light-link" href="/">← Kiểm tra program không cần ví</a></section></aside></div>
  </>;
}
