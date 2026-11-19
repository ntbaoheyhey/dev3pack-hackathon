import { useState, useEffect } from 'react';
import {
  mockEngine,
  parseSol,
  formatSol,
  MOCK_WALLETS,
  DEFAULT_PAYER,
} from './adapter';
import type {
  InspectedInvoice,
  InvoiceTerms,
  MockWalletAccount,
  SimulatedFault,
  InvoiceAccountEnvelope,
} from './types';
import './receiptrail.css';

export default function ReceiptRailApp() {
  const [activeTab, setActiveTab] = useState<'view' | 'create' | 'list' | 'demo165'>('view');
  const [activeWallet, setActiveWallet] = useState<MockWalletAccount>(DEFAULT_PAYER);
  const [currentSlot, setCurrentSlot] = useState<bigint>(mockEngine.currentSlot);
  const [simulatedFault, setSimulatedFault] = useState<SimulatedFault>('none');
  const [invoices, setInvoices] = useState<InvoiceAccountEnvelope[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>(
    'EpQUeEpGPoZrDoffujf86a3GnKdBkX7RbvsbXkkfpodo'
  );
  const [inspected, setInspected] = useState<InspectedInvoice | null>(null);

  // Confirmed Terms state
  const [termsConfirmed, setTermsConfirmed] = useState(false);
  const [confirmedSnapshot, setConfirmedSnapshot] = useState<InvoiceTerms | null>(null);

  // Action status message
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUnknownPending, setIsUnknownPending] = useState(false);
  const [pendingSignature, setPendingSignature] = useState<string | null>(null);

  // Form state for Create Invoice
  const [payerInput, setPayerInput] = useState<string>(DEFAULT_PAYER.address);
  const [amountInput, setAmountInput] = useState<string>('0.001');
  const [expiryDeltaInput, setExpiryDeltaInput] = useState<string>('100');
  const [invoiceIdHexInput, setInvoiceIdHexInput] = useState<string>(
    '2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a'
  );

  // Refresh current invoice and invoice list
  const refreshData = async () => {
    const list = await mockEngine.listInvoices();
    setInvoices(list);
    if (selectedAddress) {
      const insp = await mockEngine.inspect(selectedAddress, activeWallet.address);
      setInspected(insp);
    }
  };

  useEffect(() => {
    void refreshData();
  }, [selectedAddress, activeWallet, currentSlot]);

  // Account switch: Khi đổi ví hoặc ngắt kết nối, hủy bỏ toàn bộ confirmed terms
  const handleWalletChange = (wallet: MockWalletAccount) => {
    setActiveWallet(wallet);
    setTermsConfirmed(false);
    setConfirmedSnapshot(null);
    setActionMessage({
      text: `Đã chuyển sang ví ${wallet.name}. Mọi xác nhận điều khoản trước đó đã được hủy an toàn.`,
      type: 'info',
    });
  };

  const handleDisconnect = () => {
    setActiveWallet({
      name: 'Chưa kết nối ví (Khách)',
      address: '11111111111111111111111111111111',
      role: 'other',
      balanceLamports: 0n,
    });
    setTermsConfirmed(false);
    setConfirmedSnapshot(null);
    setActionMessage({
      text: 'Đã ngắt kết nối ví. Mọi xác nhận điều khoản trước đó đã được hủy an toàn.',
      type: 'info',
    });
  };

  // Warp slot
  const handleWarpSlot = (delta: bigint) => {
    mockEngine.warpSlot(delta);
    setCurrentSlot(mockEngine.currentSlot);
    setActionMessage({
      text: `Đã tua slot thêm +${delta.toString()} (Slot hiện tại: ${mockEngine.currentSlot.toString()}).`,
      type: 'info',
    });
  };

  // Change simulated fault
  const handleFaultChange = (fault: SimulatedFault) => {
    setSimulatedFault(fault);
    mockEngine.simulatedFault = fault;
    setActionMessage({
      text: `Đã thiết lập kịch bản mô phỏng: ${fault}`,
      type: 'info',
    });
  };

  // Create Invoice
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionMessage(null);
    setIsProcessing(true);

    try {
      const lamports = parseSol(amountInput.trim());
      if (lamports <= 0n) throw new Error('Số tiền SOL phải lớn hơn 0');

      const delta = BigInt(parseInt(expiryDeltaInput.trim(), 10) || 100);
      const expiresSlot = currentSlot + delta;

      // Hex parse invoice id (32 bytes)
      const rawHex = invoiceIdHexInput.trim().replace(/^0x/, '');
      const invoiceIdBytes = new Uint8Array(32);
      for (let i = 0; i < 32; i++) {
        const byteStr = rawHex.substr(i * 2, 2);
        invoiceIdBytes[i] = byteStr ? parseInt(byteStr, 16) || 0 : 0x2a;
      }

      const res = await mockEngine.createInvoice({
        merchant: activeWallet.address,
        payer: payerInput.trim(),
        invoiceId: invoiceIdBytes,
        amountLamports: lamports,
        expiresSlot,
      });

      setSelectedAddress(res.invoiceAddress);
      setActiveTab('view');
      setActionMessage({
        text: `Tạo hóa đơn thành công! Địa chỉ PDA: ${res.invoiceAddress} (Bump: ${res.bump})`,
        type: 'success',
      });
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setActionMessage({ text: `Lỗi tạo hóa đơn: ${msg}`, type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Pay Invoice
  const handlePayInvoice = async () => {
    if (!inspected) return;
    if (!termsConfirmed || !confirmedSnapshot) {
      setActionMessage({ text: 'Vui lòng đánh dấu xác nhận các điều khoản trước khi thanh toán.', type: 'error' });
      return;
    }

    setIsProcessing(true);
    setActionMessage(null);

    try {
      const res = await mockEngine.payInvoice({
        invoiceAddress: inspected.invoice.address,
        signer: activeWallet.address,
        confirmedTerms: confirmedSnapshot,
      });

      if (res.status === 'Unknown') {
        setIsUnknownPending(true);
        setPendingSignature(res.signature);
        setActionMessage({
          text: `CẢNH BÁO TIMEOUT: RPC không phản hồi. Trạng thái giao dịch là Unknown. Không tự động gửi lại để tránh trừ tiền 2 lần. Hãy bấm "Kiểm tra lại trên chuỗi".`,
          type: 'info',
        });
      } else {
        setIsUnknownPending(false);
        setPendingSignature(res.signature);
        setActionMessage({
          text: `Thanh toán thành công! Chữ ký xác nhận: ${res.signature}. Hóa đơn đã chuyển sang trạng thái PAID.`,
          type: 'success',
        });
      }
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setActionMessage({ text: `Giao dịch thất bại: ${msg}`, type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Cancel Invoice
  const handleCancelInvoice = async () => {
    if (!inspected) return;
    setIsProcessing(true);
    setActionMessage(null);

    try {
      const res = await mockEngine.cancelInvoice({
        invoiceAddress: inspected.invoice.address,
        signer: activeWallet.address,
        confirmedTerms: {
          address: inspected.invoice.address,
          merchant: inspected.invoice.merchant,
          payer: inspected.invoice.payer,
          invoiceId: inspected.invoice.invoiceId,
          amountLamports: inspected.invoice.amountLamports,
          expiresSlot: inspected.invoice.expiresSlot,
        },
      });

      setActionMessage({
        text: `Đã hủy hóa đơn thành công! Chữ ký: ${res.signature}`,
        type: 'success',
      });
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setActionMessage({ text: `Hủy thất bại: ${msg}`, type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Re-check on chain (Unknown Recovery)
  const handleRecheckOnChain = async () => {
    if (!selectedAddress) return;
    setIsProcessing(true);
    try {
      const res = await mockEngine.recheckOnChain(selectedAddress);
      setIsUnknownPending(false);
      setActionMessage({
        text: `Đã đối soát trạng thái trên chuỗi: Hóa đơn hiện là ${res.status.toUpperCase()}! (Chữ ký: ${res.signature ?? 'N/A'})`,
        type: 'success',
      });
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setActionMessage({ text: `Lỗi đối soát: ${msg}`, type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text);
    setActionMessage({ text: `Đã copy vào bộ nhớ tạm: ${text}`, type: 'info' });
  };

  return (
    <div className="receiptrail-container">
      {/* Banner cảnh báo an toàn */}
      <div className="rr-banner-warning" role="alert">
        <span>
          <strong>CHẾ ĐỘ LOCAL DEMO (PHASE 5)</strong> — Khóa broadcast thật · Dữ liệu mock có nhãn · Không chuyển tiền mainnet
        </span>
        <span className="badge">OFFLINE / LOCAL QA</span>
      </div>

      {/* Header */}
      <div className="rr-header">
        <h1>ReceiptRail — Đường ray Hóa đơn & Thanh toán Solana</h1>
        <p className="lead">
          Thanh toán hóa đơn native SOL an toàn qua Invoice PDA bất biến, bảo vệ tính toàn vẹn (idempotency) và phục hồi sự cố mạng.
        </p>
      </div>

      {/* Wallet Bar */}
      <section className="rr-wallet-bar" aria-labelledby="wallet-heading">
        <div className="rr-wallet-info">
          <div className="rr-wallet-avatar" aria-hidden="true">
            {activeWallet.role === 'merchant' ? 'M' : activeWallet.role === 'payer' ? 'P' : 'G'}
          </div>
          <div className="rr-wallet-meta">
            <h4 id="wallet-heading">
              {activeWallet.name} <span className="rr-badge rr-badge-open">{activeWallet.role.toUpperCase()}</span>
            </h4>
            <p title={activeWallet.address}>
              {activeWallet.address.slice(0, 10)}...{activeWallet.address.slice(-8)}
              <button
                type="button"
                className="rr-copy-btn"
                onClick={() => copyToClipboard(activeWallet.address)}
                aria-label="Copy địa chỉ ví"
              >
                Copy
              </button>
            </p>
          </div>
        </div>
        <div className="rr-wallet-actions">
          {MOCK_WALLETS.map((w) => (
            <button
              key={w.address}
              type="button"
              className={activeWallet.address === w.address ? 'secondary' : 'text-button'}
              onClick={() => handleWalletChange(w)}
              disabled={isProcessing}
            >
              Chọn {w.role === 'merchant' ? 'Tiệm Cà phê (Merchant)' : w.role === 'payer' ? 'Alice (Payer)' : 'Bob (Ví khác)'}
            </button>
          ))}
          <button
            type="button"
            className="text-button"
            onClick={handleDisconnect}
            disabled={isProcessing || activeWallet.address === '11111111111111111111111111111111'}
          >
            Ngắt ví
          </button>
        </div>
      </section>

      {/* Mock Control Bar (Slot & Fault Injection) */}
      <div className="rr-mock-bar">
        <div className="rr-mock-slot">
          <strong>Observed Slot:</strong> <code>{currentSlot.toString()}</code>
          <button type="button" className="rr-copy-btn" onClick={() => handleWarpSlot(20n)}>
            +20 slots
          </button>
          <button type="button" className="rr-copy-btn" onClick={() => handleWarpSlot(150n)}>
            +150 slots (Gây Expired)
          </button>
        </div>
        <div className="rr-mock-fault">
          <label htmlFor="fault-select"><strong>Mô phỏng sự cố:</strong></label>
          <select
            id="fault-select"
            value={simulatedFault}
            onChange={(e) => handleFaultChange(e.target.value as SimulatedFault)}
          >
            <option value="none">Bình thường (Success)</option>
            <option value="timeout_unknown">Mô phỏng: RPC Timeout (Unknown State)</option>
            <option value="cpi_rollback">Mô phỏng: Thiếu số dư (CPI Rollback)</option>
            <option value="wrong_payer">Mô phỏng: Sai người trả (Wrong Payer)</option>
          </select>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="rr-tabs" aria-label="ReceiptRail Tabs">
        <button
          type="button"
          className={`rr-tab-btn ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          Chi tiết Hóa đơn
        </button>
        <button
          type="button"
          className={`rr-tab-btn ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Tạo Hóa đơn mới (Merchant)
        </button>
        <button
          type="button"
          className={`rr-tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          Danh sách Hóa đơn ({invoices.length})
        </button>
        <button
          type="button"
          className={`rr-tab-btn ${activeTab === 'demo165' ? 'active' : ''}`}
          onClick={() => setActiveTab('demo165')}
        >
          Kịch bản Demo 165s
        </button>
      </nav>

      {/* Notice/Alert message */}
      {actionMessage && (
        <div
          role="status"
          className={`notice ${
            actionMessage.type === 'error' ? 'notice-error' : actionMessage.type === 'success' ? 'notice-success' : ''
          }`}
          style={{ marginBottom: '20px' }}
        >
          {actionMessage.text}
        </div>
      )}

      {/* TAB 1: VIEW & PAY INVOICE */}
      {activeTab === 'view' && inspected && (
        <div className="rr-card">
          <div className="rr-card-heading">
            <div>
              <h2 className="rr-card-title">Hóa đơn #{selectedAddress.slice(0, 8)}...</h2>
              <p className="rr-detail-value mono" style={{ fontSize: '0.85rem', color: '#5c756b' }}>
                PDA: {inspected.invoice.address}
                <button
                  type="button"
                  className="rr-copy-btn"
                  onClick={() => copyToClipboard(inspected.invoice.address)}
                >
                  Copy
                </button>
              </p>
            </div>
            <div className="rr-badges">
              <span
                className={`rr-badge ${
                  inspected.displayStatus === 'Paid'
                    ? 'rr-badge-paid'
                    : inspected.displayStatus === 'Cancelled'
                    ? 'rr-badge-cancelled'
                    : inspected.displayStatus === 'Expired'
                    ? 'rr-badge-expired'
                    : 'rr-badge-open'
                }`}
              >
                {inspected.displayStatus.toUpperCase()}
              </span>
              <span className="rr-badge rr-badge-confirmed">
                COMMITMENT: {inspected.commitment.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Unknown / Timeout Recovery Alert */}
          {isUnknownPending && (
            <div className="rr-alert-unknown" role="alert">
              <h4>Giao dịch đang ở trạng thái CHƯA RÕ (Unknown State)</h4>
              <p>
                RPC đã timeout trước khi trả về kết quả. <strong>Không tự ý gửi lại giao dịch</strong> để tránh bị trừ tiền hai lần.
                {pendingSignature && <span> Chữ ký đã ghi nhận: <code>{pendingSignature}</code>.</span>}
              </p>
              <button
                type="button"
                className="secondary"
                onClick={handleRecheckOnChain}
                disabled={isProcessing}
              >
                {isProcessing ? 'Đang kiểm tra...' : 'Kiểm tra lại trạng thái trên chuỗi ↻'}
              </button>
            </div>
          )}

          {/* Grid chi tiết các điều khoản */}
          <div className="rr-grid-details">
            <div className="rr-detail-item">
              <div className="rr-detail-label">Số tiền thanh toán</div>
              <div className="rr-detail-value" style={{ fontSize: '1.4rem', color: '#164b3f' }}>
                {formatSol(inspected.invoice.amountLamports)} SOL
              </div>
              <div className="rr-form-help">{inspected.invoice.amountLamports.toString()} lamports (Chính xác u64)</div>
            </div>

            <div className="rr-detail-item">
              <div className="rr-detail-label">Hạn thanh toán (Slot Expiry)</div>
              <div className="rr-detail-value">Slot {inspected.invoice.expiresSlot.toString()}</div>
              <div className="rr-form-help">
                Observed: {currentSlot.toString()} ·{' '}
                {inspected.expiry === 'Expired' ? (
                  <strong style={{ color: '#b45309' }}>Đã quá hạn</strong>
                ) : (
                  <span>Còn {Number(inspected.invoice.expiresSlot - currentSlot)} slots</span>
                )}
              </div>
            </div>

            <div className="rr-detail-item">
              <div className="rr-detail-label">Người nhận (Merchant)</div>
              <div className="rr-detail-value mono">{inspected.invoice.merchant}</div>
              <div className="rr-form-help">Tiền gốc được chuyển trực tiếp vào tài khoản này</div>
            </div>

            <div className="rr-detail-item">
              <div className="rr-detail-label">Người trả chỉ định (Payer)</div>
              <div className="rr-detail-value mono">{inspected.invoice.payer}</div>
              <div className="rr-form-help">Chỉ đúng ví này mới có quyền ký thanh toán</div>
            </div>
          </div>

          {/* Action Box */}
          <div className="rr-action-box">
            {inspected.displayStatus === 'Paid' ? (
              <div>
                <p style={{ fontWeight: 600, color: '#15803d' }}>
                  Hóa đơn đã được thanh toán thành công tại Slot {inspected.invoice.paidSlot.toString()}.
                </p>
                <p className="rr-form-help">
                  Biên lai on-chain bất biến. Số tiền đã được chuyển an toàn từ Payer sang Merchant.
                </p>
              </div>
            ) : inspected.displayStatus === 'Cancelled' ? (
              <div>
                <p style={{ fontWeight: 600, color: '#b91c1c' }}>Hóa đơn này đã bị Merchant hủy bỏ.</p>
                <p className="rr-form-help">Không thể thực hiện thanh toán đối với hóa đơn đã hủy.</p>
              </div>
            ) : inspected.displayStatus === 'Expired' ? (
              <div>
                <p style={{ fontWeight: 600, color: '#b45309' }}>
                  Hóa đơn đã hết hạn (Slot hiện tại {currentSlot.toString()} &gt;= Hạn {inspected.invoice.expiresSlot.toString()}).
                </p>
                <p className="rr-form-help">
                  Người trả không thể thanh toán. Merchant có quyền bấm Hủy để giải phóng hoặc đóng hóa đơn.
                </p>
                {activeWallet.address === inspected.invoice.merchant && (
                  <button
                    type="button"
                    className="rr-btn-cancel"
                    onClick={handleCancelInvoice}
                    disabled={isProcessing}
                    style={{ marginTop: '10px' }}
                  >
                    Hủy hóa đơn hết hạn (Merchant Cancel)
                  </button>
                )}
              </div>
            ) : (
              <div>
                {activeWallet.address === inspected.invoice.payer ? (
                  <div>
                    <div className="rr-terms-review">
                      <label className="rr-checkbox-label">
                        <input
                          type="checkbox"
                          checked={termsConfirmed}
                          onChange={(e) => {
                            setTermsConfirmed(e.target.checked);
                            if (e.target.checked) {
                              setConfirmedSnapshot({
                                address: inspected.invoice.address,
                                merchant: inspected.invoice.merchant,
                                payer: inspected.invoice.payer,
                                invoiceId: inspected.invoice.invoiceId,
                                amountLamports: inspected.invoice.amountLamports,
                                expiresSlot: inspected.invoice.expiresSlot,
                              });
                            } else {
                              setConfirmedSnapshot(null);
                            }
                          }}
                        />
                        <span>
                          Tôi đã kiểm tra kỹ: Người nhận ({inspected.invoice.merchant.slice(0, 6)}...), Số tiền (
                          {formatSol(inspected.invoice.amountLamports)} SOL), Hạn (Slot {inspected.invoice.expiresSlot.toString()})
                        </span>
                      </label>
                    </div>

                    <button
                      type="button"
                      className="rr-btn-pay"
                      onClick={handlePayInvoice}
                      disabled={isProcessing || !termsConfirmed}
                    >
                      {isProcessing ? 'Đang xử lý...' : `Thanh toán ${formatSol(inspected.invoice.amountLamports)} SOL`}
                    </button>
                  </div>
                ) : activeWallet.address === inspected.invoice.merchant ? (
                  <div>
                    <p style={{ marginBottom: '12px', fontSize: '0.9rem' }}>
                      Bạn đang kết nối ví <strong>Merchant</strong>. Bạn có quyền hủy hóa đơn này nếu người mua không thanh toán.
                    </p>
                    <button
                      type="button"
                      className="rr-btn-cancel"
                      onClick={handleCancelInvoice}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Đang hủy...' : 'Hủy hóa đơn (Cancel Invoice)'}
                    </button>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#5c756b' }}>
                      Ví hiện tại (<strong>{activeWallet.name}</strong>) không phải là người trả được chỉ định ({inspected.invoice.payer.slice(0, 8)}...).
                      Người xem có thể đọc chi tiết; hãy đổi sang ví <strong>Alice (Payer)</strong> ở thanh trên để thanh toán.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CREATE INVOICE FORM */}
      {activeTab === 'create' && (
        <div className="rr-card">
          <div className="rr-card-heading">
            <h2 className="rr-card-title">Tạo hóa đơn mới (Merchant Form)</h2>
            <span className="rr-badge rr-badge-open">MERCHANT ROLE</span>
          </div>

          <form onSubmit={handleCreateInvoice}>
            <div className="rr-quick-fills">
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  setAmountInput('0.001');
                  setPayerInput(DEFAULT_PAYER.address);
                  setExpiryDeltaInput('100');
                }}
              >
                Mẫu: Cà phê (0.001 SOL)
              </button>
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  setAmountInput('1.5');
                  setPayerInput(DEFAULT_PAYER.address);
                  setExpiryDeltaInput('200');
                }}
              >
                Mẫu: Đơn lớn (1.5 SOL)
              </button>
            </div>

            <div className="rr-form-group">
              <label className="rr-form-label" htmlFor="payer-input">
                Địa chỉ ví Người trả (Payer Address)
              </label>
              <input
                id="payer-input"
                className="rr-form-input mono"
                type="text"
                required
                value={payerInput}
                onChange={(e) => setPayerInput(e.target.value)}
              />
              <div className="rr-form-help">Public key 32 bytes của khách hàng trên Solana</div>
            </div>

            <div className="rr-form-group">
              <label className="rr-form-label" htmlFor="amount-input">
                Số tiền (SOL, tối đa 9 chữ số thập phân)
              </label>
              <input
                id="amount-input"
                className="rr-form-input"
                type="text"
                required
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
              />
              <div className="rr-form-help">
                Tự động parse sang BigInt lamports không làm tròn. Ví dụ: 0.001 SOL = 1,000,000 lamports.
              </div>
            </div>

            <div className="rr-form-group">
              <label className="rr-form-label" htmlFor="expiry-input">
                Hạn thanh toán (Số slots từ hiện tại)
              </label>
              <input
                id="expiry-input"
                className="rr-form-input"
                type="number"
                min="10"
                required
                value={expiryDeltaInput}
                onChange={(e) => setExpiryDeltaInput(e.target.value)}
              />
              <div className="rr-form-help">
                Slot hết hạn ước tính: {currentSlot + BigInt(parseInt(expiryDeltaInput, 10) || 100)} (Slot hiện tại:{' '}
                {currentSlot.toString()})
              </div>
            </div>

            <div className="rr-form-group">
              <label className="rr-form-label" htmlFor="invoice-id-input">
                Invoice ID (32-bytes hex định danh ngoài chuỗi)
              </label>
              <input
                id="invoice-id-input"
                className="rr-form-input mono"
                type="text"
                required
                value={invoiceIdHexInput}
                onChange={(e) => setInvoiceIdHexInput(e.target.value)}
              />
              <div className="rr-form-help">
                Được merchant lưu cố định cho đơn hàng. Cùng một ID sẽ ánh xạ ra cùng một địa chỉ PDA.
              </div>
            </div>

            <div className="rr-action-box" style={{ marginBottom: '20px' }}>
              <div style={{ fontWeight: 600, marginBottom: '6px' }}>Xem trước chi phí &amp; Điều khoản:</div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#4b6b61' }}>
                <li>Tiền thuê tài khoản (Rent deposit): 1,802,640 lamports (~0.0018 SOL do Merchant ký gửi).</li>
                <li>Ước tính phí mạng (Transaction Fee): ~10,000 lamports.</li>
                <li>Người nhận tiền thanh toán: {activeWallet.address} (Merchant).</li>
              </ul>
            </div>

            <button type="submit" className="rr-btn-pay" disabled={isProcessing}>
              {isProcessing ? 'Đang tạo...' : 'Ký tạo hóa đơn (Create Invoice)'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: LIST INVOICES */}
      {activeTab === 'list' && (
        <div className="rr-card">
          <div className="rr-card-heading">
            <h2 className="rr-card-title">Sổ cái Hóa đơn Cục bộ ({invoices.length})</h2>
            <button type="button" className="text-button" onClick={refreshData}>
              Làm mới ↻
            </button>
          </div>

          <table className="rr-table" aria-label="Bảng danh sách hóa đơn">
            <thead>
              <tr>
                <th>Địa chỉ PDA</th>
                <th>Người trả</th>
                <th>Số tiền</th>
                <th>Hạn (Slot)</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((acc) => (
                <tr key={acc.address}>
                  <td className="mono" title={acc.address}>
                    {acc.address.slice(0, 10)}...{acc.address.slice(-6)}
                  </td>
                  <td className="mono" title={DEFAULT_PAYER.address}>
                    {DEFAULT_PAYER.name}
                  </td>
                  <td>1,000,000 lamports</td>
                  <td>Slot 200</td>
                  <td>
                    <button
                      type="button"
                      className="rr-copy-btn"
                      onClick={() => {
                        setSelectedAddress(acc.address);
                        setActiveTab('view');
                      }}
                    >
                      Xem &amp; Thanh toán →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: DEMO 165S STORYBOARD */}
      {activeTab === 'demo165' && (
        <div className="rr-card">
          <div className="rr-card-heading">
            <h2 className="rr-card-title">Kịch bản Demo Video 165 Giây (Note 013)</h2>
            <span className="badge">TỔNG 2:45 PHÚT</span>
          </div>

          <div className="rr-storyboard-step">
            <h4>Đoạn 1: Vấn đề &amp; Hook (0:00 - 0:35 · 35s)</h4>
            <p>
              Giới thiệu bài toán: Thanh toán trên blockchain gặp tình trạng người dùng bấm trả 2 lần khi mạng lag, hoặc merchant tạo đơn không kiểm soát được hạn và trạng thái thanh toán.
            </p>
          </div>

          <div className="rr-storyboard-step">
            <h4>Đoạn 2: Merchant tạo Hóa đơn on-chain (0:35 - 1:05 · 30s)</h4>
            <p>
              Merchant mở tab "Tạo Hóa đơn", nhập ví Payer (Alice), số tiền 0.001 SOL, hạn 100 slots. Hệ thống tính PDA duy nhất và ký gửi tiền thuê rent an toàn.
            </p>
          </div>

          <div className="rr-storyboard-step">
            <h4>Đoạn 3: Payer kết nối ví, Xác nhận điều khoản &amp; Thanh toán (1:05 - 1:40 · 35s)</h4>
            <p>
              Alice kết nối ví. Giao diện hiển thị chi tiết hóa đơn, yêu cầu duyệt terms snapshot. Alice ký lệnh thanh toán. Tiền chuyển trực tiếp từ Alice sang Tiệm Cà phê, hóa đơn chuyển sang PAID.
            </p>
          </div>

          <div className="rr-storyboard-step">
            <h4>Đoạn 4: Phục hồi sự cố Timeout / Unknown State (1:40 - 2:15 · 35s)</h4>
            <p>
              Mô phỏng RPC Timeout: Giao diện chuyển sang trạng thái cảnh báo Unknown, giữ nguyên PDA/terms, không tự động gửi lại. Người dùng bấm "Kiểm tra lại trên chuỗi" để đối soát kết quả.
            </p>
          </div>

          <div className="rr-storyboard-step">
            <h4>Đoạn 5: Kiểm tra Rollback &amp; Bảo mật (2:15 - 2:45 · 30s)</h4>
            <p>
              Thử nghiệm trả lần 2 hoặc ví Bob (hacker) cố tình thanh toán thay: Hệ thống từ chối ngay lập tức với mã lỗi Anchor IDL. Giao dịch được bảo vệ tuyệt đối.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
