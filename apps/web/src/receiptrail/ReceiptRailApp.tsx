import { useState, useEffect } from 'react';
import { autoDiscover, createClient } from '@solana/client';
import { SolanaProvider, useWalletConnection } from '@solana/react-hooks';
import { DEVNET_RPC } from '../lib/inspect';
import {
  mockEngine,
  client,
  parseSol,
  formatSol,
  parseInvoiceIdHex,
  parseExpiryDelta,
  formatWalletError,
  DEFAULT_MERCHANT,
  DEFAULT_PAYER,
} from './adapter';
import { registerMockWallets } from './mock-wallets';
import type {
  InspectedInvoice,
  InvoiceTerms,
  SimulatedFault,
  InvoiceAccountEnvelope,
  InvoiceRecord,
} from './types';
import './receiptrail.css';

// Đăng ký các mock wallets vào Wallet Standard chuẩn
registerMockWallets();

function ReceiptRailInner() {
  const { connectors, connect, disconnect, wallet, status } = useWalletConnection();
  const initialTab = (() => {
    if (typeof window === 'undefined') return 'view';
    const t = new URLSearchParams(window.location.search).get('tab');
    if (t === 'create' || t === 'list' || t === 'demo165') return t;
    return 'view';
  })();
  const [activeTab, setActiveTab] = useState<'view' | 'create' | 'list' | 'demo165'>(initialTab);
  const [currentSlot, setCurrentSlot] = useState<bigint>(mockEngine.currentSlot);
  const [simulatedFault, setSimulatedFault] = useState<SimulatedFault>('none');
  const [invoices, setInvoices] = useState<InvoiceAccountEnvelope[]>([]);
  const [decodedInvoices, setDecodedInvoices] = useState<InvoiceRecord[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>(
    'EpQUeEpGPoZrDoffujf86a3GnKdBkX7RbvsbXkkfpodo'
  );
  const [inspected, setInspected] = useState<InspectedInvoice | null>(null);

  // Confirmed Terms state
  const [termsConfirmed, setTermsConfirmed] = useState(false);
  const [confirmedSnapshot, setConfirmedSnapshot] = useState<InvoiceTerms | null>(null);

  // Cancel Confirmation state
  const [cancelConfirmed, setCancelConfirmed] = useState(false);

  // Create Confirmation state
  const [createConfirmed, setCreateConfirmed] = useState(false);

  // Action status message
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [pendingSignature, setPendingSignature] = useState<string | null>(null);

  // Form state for Create Invoice
  const [payerInput, setPayerInput] = useState<string>(DEFAULT_PAYER.address);
  const [amountInput, setAmountInput] = useState<string>('0.001');
  const [expiryDeltaInput, setExpiryDeltaInput] = useState<string>('100');
  const [invoiceIdHexInput, setInvoiceIdHexInput] = useState<string>(
    '2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a'
  );

  const connectedAddress = wallet?.account.address ?? null;

  // P5-03: Reset confirmed terms on ANY wallet/account change or disconnect
  useEffect(() => {
    setTermsConfirmed(false);
    setConfirmedSnapshot(null);
    setCancelConfirmed(false);
  }, [connectedAddress]);

  // Refresh current invoice and decode all invoices in list
  const refreshData = async () => {
    const list = await mockEngine.listInvoices();
    setInvoices(list);

    const decodedList: InvoiceRecord[] = [];
    for (const acc of list) {
      try {
        const dec = await client.decodeInvoice(acc);
        decodedList.push(dec as InvoiceRecord);
      } catch {
        // bỏ qua nếu account lỗi
      }
    }
    setDecodedInvoices(decodedList);

    if (selectedAddress) {
      const insp = await mockEngine.inspect(selectedAddress, connectedAddress ?? undefined);
      setInspected(insp);
    }
  };

  useEffect(() => {
    void refreshData();
  }, [selectedAddress, connectedAddress, currentSlot]);

  // Connect wallet
  const handleConnect = async (connectorId: string) => {
    setIsConnecting(true);
    setActionMessage(null);
    try {
      await connect(connectorId);
      setActionMessage({ text: 'Đã kết nối ví thành công qua chuẩn Wallet Standard.', type: 'info' });
    } catch (err) {
      setActionMessage({ text: formatWalletError(err), type: 'error' });
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const handleDisconnect = async () => {
    setActionMessage(null);
    try {
      await disconnect();
      setActionMessage({ text: 'Đã ngắt kết nối ví. Giao diện chuyển sang chế độ Khách xem.', type: 'info' });
    } catch (err) {
      setActionMessage({ text: formatWalletError(err), type: 'error' });
    }
  };

  // Warp slot
  const handleWarpSlot = (delta: bigint) => {
    mockEngine.warpSlot(delta);
    setCurrentSlot(mockEngine.currentSlot);
    setActionMessage({
      text: `Đã tua slot thêm +${delta.toString()} (Slot quan sát: ${mockEngine.currentSlot.toString()}).`,
      type: 'info',
    });
  };

  // Change simulated fault
  const handleFaultChange = (fault: SimulatedFault) => {
    setSimulatedFault(fault);
    mockEngine.simulatedFault = fault;
    setActionMessage({
      text: `Đã thiết lập kịch bản mô phỏng lỗi: ${fault}`,
      type: 'info',
    });
  };

  // Create Invoice
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionMessage(null);

    if (!connectedAddress) {
      setActionMessage({ text: 'Vui lòng kết nối ví Merchant trước khi tạo hóa đơn.', type: 'error' });
      return;
    }

    if (!createConfirmed) {
      setActionMessage({ text: 'Vui lòng đánh dấu xác nhận xem trước điều khoản trước khi tạo.', type: 'error' });
      return;
    }

    setIsProcessing(true);

    try {
      const lamports = parseSol(amountInput);
      if (lamports <= 0n) throw new Error('Số tiền SOL phải lớn hơn 0');

      const delta = parseExpiryDelta(expiryDeltaInput);
      const expiresSlot = currentSlot + delta;

      // P5-04: Strict 64 hex invoice ID parsing
      const invoiceIdBytes = parseInvoiceIdHex(invoiceIdHexInput);

      const res = await mockEngine.createInvoice({
        merchant: connectedAddress,
        payer: payerInput.trim(),
        invoiceId: invoiceIdBytes,
        amountLamports: lamports,
        expiresSlot,
      });

      setSelectedAddress(res.invoiceAddress);
      setActiveTab('view');
      setCreateConfirmed(false);
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
    if (!connectedAddress) {
      setActionMessage({ text: 'Vui lòng kết nối ví Payer để thanh toán.', type: 'error' });
      return;
    }
    if (!termsConfirmed || !confirmedSnapshot) {
      setActionMessage({ text: 'Vui lòng đánh dấu xác nhận các điều khoản trước khi thanh toán.', type: 'error' });
      return;
    }

    setIsProcessing(true);
    setActionMessage(null);

    try {
      const res = await mockEngine.payInvoice({
        invoiceAddress: inspected.invoice.address,
        signer: connectedAddress,
        confirmedTerms: confirmedSnapshot,
      });

      if (res.status === 'Unknown') {
        setPendingSignature(res.signature);
        setActionMessage({
          text: `CẢNH BÁO TIMEOUT: RPC không phản hồi. Trạng thái giao dịch là Unknown. Chữ ký đã được lưu từ bước ký trước gửi: ${res.signature}. Thao tác trên hóa đơn này đang bị khóa để bảo vệ an toàn. Bấm "Kiểm tra lại trên chuỗi" để đối soát.`,
          type: 'info',
        });
      } else {
        setPendingSignature(res.signature);
        setActionMessage({
          text: `Thanh toán thành công! Chữ ký: ${res.signature}. Hóa đơn đã chuyển sang trạng thái PAID trên mock ledger.`,
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
    if (!connectedAddress) {
      setActionMessage({ text: 'Vui lòng kết nối ví Merchant để hủy hóa đơn.', type: 'error' });
      return;
    }
    if (!cancelConfirmed) {
      setActionMessage({ text: 'Vui lòng đánh dấu xác nhận hủy hóa đơn trước khi thực hiện.', type: 'error' });
      return;
    }

    setIsProcessing(true);
    setActionMessage(null);

    try {
      const res = await mockEngine.cancelInvoice({
        invoiceAddress: inspected.invoice.address,
        signer: connectedAddress,
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
        text: `Đã hủy hóa đơn thành công! Chữ ký: ${res.signature}. Trạng thái đổi thành CANCELLED.`,
        type: 'success',
      });
      setCancelConfirmed(false);
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

  // Tính toán role hiện tại của ví kết nối
  const isMerchant = inspected ? connectedAddress === inspected.invoice.merchant : false;
  const isPayer = inspected ? connectedAddress === inspected.invoice.payer : false;

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
        <h1>ReceiptRail — Đường ray Hóa đơn &amp; Thanh toán Solana</h1>
        <p className="lead">
          Thanh toán hóa đơn native SOL an toàn qua Invoice PDA bất biến, bảo vệ tính toàn vẹn (idempotency) và phục hồi sự cố mạng.
        </p>
      </div>

      {/* Wallet Bar: Tích hợp Wallet Standard thật */}
      <section className="rr-wallet-bar" aria-labelledby="wallet-heading">
        <div className="rr-wallet-info">
          <div className="rr-wallet-avatar" aria-hidden="true">
            {connectedAddress ? (isMerchant ? 'M' : isPayer ? 'P' : 'W') : '?'}
          </div>
          <div className="rr-wallet-meta">
            <h4 id="wallet-heading">
              {connectedAddress ? (
                <>
                  Ví đã kết nối: {isMerchant ? 'Merchant' : isPayer ? 'Payer chỉ định' : 'Ví bên ngoài'}
                  <span className="rr-badge rr-badge-open" style={{ marginLeft: '8px' }}>
                    {isMerchant ? 'MERCHANT' : isPayer ? 'PAYER' : 'OTHER'}
                  </span>
                </>
              ) : (
                'Chưa kết nối ví (Khách xem)'
              )}
            </h4>
            <p title={connectedAddress ?? 'Chưa kết nối'}>
              {connectedAddress ? (
                <>
                  {connectedAddress.slice(0, 10)}...{connectedAddress.slice(-8)}
                  <button
                    type="button"
                    className="rr-copy-btn"
                    onClick={() => copyToClipboard(connectedAddress)}
                    aria-label="Copy địa chỉ ví"
                  >
                    Copy
                  </button>
                </>
              ) : (
                'Mở ở chế độ chỉ đọc. Chọn ví Wallet Standard để thao tác.'
              )}
            </p>
          </div>
        </div>
        <div className="rr-wallet-actions">
          {connectors
            .filter((c) => c.ready !== false && c.isSupported())
            .map((connector) => (
              <button
                key={connector.id}
                type="button"
                className={connectedAddress && connector.name.includes(isMerchant ? 'Merchant' : isPayer ? 'Payer' : '') ? 'secondary' : 'text-button'}
                onClick={() => handleConnect(connector.id)}
                disabled={isConnecting || isProcessing}
              >
                {status === 'connecting' ? 'Đang chờ...' : `Kết nối ${connector.name}`}
              </button>
            ))}
          {connectedAddress && (
            <button
              type="button"
              className="text-button"
              onClick={handleDisconnect}
              disabled={isProcessing}
            >
              Ngắt kết nối ví
            </button>
          )}
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

          {/* P5-02: Unknown / Timeout Recovery Alert */}
          {inspected.isPending && (
            <div className="rr-alert-unknown" role="alert">
              <h4>Giao dịch đang ở trạng thái CHƯA RÕ (Unknown State)</h4>
              <p>
                RPC đã timeout trước khi trả về xác nhận. Chữ ký đã được lưu từ bước ký trước gửi:{' '}
                <code>{pendingSignature ?? mockEngine.getPendingRecord(inspected.invoice.address)?.signature ?? 'N/A'}</code>.
              </p>
              <p>
                <strong>Mọi thao tác thanh toán hay hủy trên hóa đơn này đang bị khóa</strong> để chống trùng lặp giao dịch.
                Hãy bấm nút bên dưới để đối soát kết quả trên chuỗi.
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
                  Biên lai thanh toán cục bộ (Local Mock / Phase 5) — Ghi nhận Paid tại Slot {inspected.invoice.paidSlot.toString()}.
                </p>
                <p className="rr-form-help">
                  Trạng thái Paid là vĩnh viễn (terminal state), không thể trả lại hay hủy bỏ.
                </p>
              </div>
            ) : inspected.displayStatus === 'Cancelled' ? (
              <div>
                <p style={{ fontWeight: 600, color: '#b91c1c' }}>Hóa đơn này đã bị Merchant hủy bỏ (Cancelled).</p>
                <p className="rr-form-help">Hóa đơn đã bị khóa vĩnh viễn, không thể thanh toán tiếp.</p>
              </div>
            ) : inspected.displayStatus === 'Expired' ? (
              <div>
                <p style={{ fontWeight: 600, color: '#b45309' }}>
                  Hóa đơn đã hết hạn (Slot hiện tại {currentSlot.toString()} &gt;= Hạn {inspected.invoice.expiresSlot.toString()}).
                </p>
                <p className="rr-form-help">
                  Người trả không thể thanh toán. Merchant có quyền bấm Hủy để đổi trạng thái sang Cancelled.
                </p>
                {isMerchant && (
                  <div style={{ marginTop: '12px' }}>
                    <label className="rr-checkbox-label" style={{ marginBottom: '10px' }}>
                      <input
                        type="checkbox"
                        checked={cancelConfirmed}
                        onChange={(e) => setCancelConfirmed(e.target.checked)}
                        disabled={inspected.isPending}
                      />
                      <span>Xác nhận hủy hóa đơn hết hạn này (Trạng thái chuyển sang Cancelled, rent không tự hoàn)</span>
                    </label>
                    <button
                      type="button"
                      className="rr-btn-cancel"
                      onClick={handleCancelInvoice}
                      disabled={isProcessing || !cancelConfirmed || inspected.isPending}
                    >
                      Hủy hóa đơn hết hạn (Merchant Cancel)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {isPayer ? (
                  <div>
                    <div className="rr-terms-review">
                      <label className="rr-checkbox-label">
                        <input
                          type="checkbox"
                          checked={termsConfirmed}
                          disabled={inspected.isPending}
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
                      disabled={isProcessing || !termsConfirmed || inspected.isPending}
                    >
                      {inspected.isPending ? 'Đang bị khóa (Unknown)' : isProcessing ? 'Đang xử lý...' : `Thanh toán ${formatSol(inspected.invoice.amountLamports)} SOL`}
                    </button>
                  </div>
                ) : isMerchant ? (
                  <div>
                    <p style={{ marginBottom: '12px', fontSize: '0.9rem' }}>
                      Bạn đang kết nối ví <strong>Merchant</strong>. Bạn có quyền hủy hóa đơn này nếu người mua không thanh toán.
                    </p>
                    <label className="rr-checkbox-label" style={{ marginBottom: '12px' }}>
                      <input
                        type="checkbox"
                        checked={cancelConfirmed}
                        disabled={inspected.isPending}
                        onChange={(e) => setCancelConfirmed(e.target.checked)}
                      />
                      <span>Xác nhận hủy hóa đơn này (Chuyển sang Cancelled; rent không tự hoàn trả).</span>
                    </label>
                    <button
                      type="button"
                      className="rr-btn-cancel"
                      onClick={handleCancelInvoice}
                      disabled={isProcessing || !cancelConfirmed || inspected.isPending}
                    >
                      {inspected.isPending ? 'Đang bị khóa (Unknown)' : isProcessing ? 'Đang hủy...' : 'Hủy hóa đơn (Cancel Invoice)'}
                    </button>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#5c756b' }}>
                      {connectedAddress ? (
                        <>Ví hiện tại không phải là người trả được chỉ định ({inspected.invoice.payer.slice(0, 8)}...). Hãy kết nối ví <strong>Alice (Payer)</strong> để thanh toán.</>
                      ) : (
                        <>Chưa kết nối ví (Khách xem chi tiết). Hãy kết nối ví <strong>Alice (Payer)</strong> ở góc phải để thanh toán.</>
                      )}
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
                  setInvoiceIdHexInput('3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a');
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
                  setInvoiceIdHexInput('4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b');
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
                Parse an toàn sang BigInt lamports. Ví dụ: 0.001 SOL = 1,000,000 lamports.
              </div>
            </div>

            <div className="rr-form-group">
              <label className="rr-form-label" htmlFor="expiry-input">
                Hạn thanh toán (Số slots từ hiện tại, số nguyên dương)
              </label>
              <input
                id="expiry-input"
                className="rr-form-input"
                type="text"
                required
                value={expiryDeltaInput}
                onChange={(e) => setExpiryDeltaInput(e.target.value)}
              />
              <div className="rr-form-help">
                Hạn slot ước tính: Slot {(currentSlot + 100n).toString()} (Observed Slot: {currentSlot.toString()})
              </div>
            </div>

            <div className="rr-form-group">
              <label className="rr-form-label" htmlFor="invoice-id-input">
                Invoice ID (Đúng 64 ký tự hex định danh ngoài chuỗi)
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
                Định danh duy nhất 32 bytes. Không tự ý đệm 0 hay cắt ngắn.
              </div>
            </div>

            {/* P5-04: Explicit Create Review Snapshot */}
            <div className="rr-action-box" style={{ marginBottom: '20px' }}>
              <div style={{ fontWeight: 600, marginBottom: '6px' }}>Xem trước chi phí &amp; Điều khoản tạo:</div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#4b6b61', marginBottom: '12px' }}>
                <li>Người tạo (Merchant): {connectedAddress ?? DEFAULT_MERCHANT.address}</li>
                <li>Người trả (Payer): {payerInput || 'N/A'}</li>
                <li>Tiền thuê tài khoản (Rent deposit): 1,802,640 lamports (số đo LiteSVM mẫu cục bộ; không hoàn tự động khi Cancel).</li>
                <li>Ước tính phí mạng (Transaction Fee): ~10,000 lamports.</li>
              </ul>
              <label className="rr-checkbox-label">
                <input
                  type="checkbox"
                  checked={createConfirmed}
                  onChange={(e) => setCreateConfirmed(e.target.checked)}
                />
                <span>Tôi đã kiểm tra kỹ toàn bộ điều khoản trên trước khi ký tạo hóa đơn</span>
              </label>
            </div>

            <button type="submit" className="rr-btn-pay" disabled={isProcessing || !createConfirmed}>
              {isProcessing ? 'Đang tạo...' : 'Ký tạo hóa đơn (Create Invoice)'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: LIST INVOICES — P5-04: Decoded Invoices */}
      {activeTab === 'list' && (
        <div className="rr-card">
          <div className="rr-card-heading">
            <h2 className="rr-card-title">Sổ cái Hóa đơn Cục bộ ({decodedInvoices.length})</h2>
            <button type="button" className="text-button" onClick={refreshData}>
              Làm mới ↻
            </button>
          </div>

          <table className="rr-table" aria-label="Bảng danh sách hóa đơn">
            <thead>
              <tr>
                <th>Địa chỉ PDA</th>
                <th>Người nhận (Merchant)</th>
                <th>Người trả (Payer)</th>
                <th>Số tiền</th>
                <th>Hạn (Slot)</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {decodedInvoices.map((inv) => (
                <tr key={inv.address}>
                  <td className="mono" title={inv.address}>
                    {inv.address.slice(0, 8)}...{inv.address.slice(-6)}
                  </td>
                  <td className="mono" title={inv.merchant}>
                    {inv.merchant.slice(0, 6)}...
                  </td>
                  <td className="mono" title={inv.payer}>
                    {inv.payer.slice(0, 6)}...
                  </td>
                  <td>
                    <strong>{formatSol(inv.amountLamports)} SOL</strong>
                    <div style={{ fontSize: '0.75rem', color: '#6b8277' }}>{inv.amountLamports.toString()} lamports</div>
                  </td>
                  <td>Slot {inv.expiresSlot.toString()}</td>
                  <td>
                    <span
                      className={`rr-badge ${
                        inv.status === 'Paid'
                          ? 'rr-badge-paid'
                          : inv.status === 'Cancelled'
                          ? 'rr-badge-cancelled'
                          : currentSlot >= inv.expiresSlot
                          ? 'rr-badge-expired'
                          : 'rr-badge-open'
                      }`}
                    >
                      {currentSlot >= inv.expiresSlot && inv.status === 'Open' ? 'EXPIRED' : inv.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="rr-copy-btn"
                      onClick={() => {
                        setSelectedAddress(inv.address);
                        setActiveTab('view');
                      }}
                    >
                      Xem chi tiết →
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

export default function ReceiptRailApp() {
  const [solanaClient] = useState(() =>
    createClient({ endpoint: DEVNET_RPC, walletConnectors: autoDiscover() })
  );

  return (
    <SolanaProvider client={solanaClient}>
      <ReceiptRailInner />
    </SolanaProvider>
  );
}
