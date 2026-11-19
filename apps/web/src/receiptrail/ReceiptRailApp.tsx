import { useState, useEffect, useRef, useMemo } from 'react';
import { autoDiscover, createClient } from '@solana/client';
import { SolanaProvider, useWalletConnection } from '@solana/react-hooks';
import { DEVNET_RPC } from '../lib/inspect';
import {
  mockEngine,
  client,
  parseSol,
  formatSol,
  parseInvoiceIdHex,
  formatWalletError,
  DEFAULT_MERCHANT,
  DEFAULT_PAYER,
} from './adapter.ts';
import {
  ReceiptRailReviewController,
  computePreviewExpiry,
  RENT_DEPOSIT_LAMPORTS,
  ESTIMATED_FEE_LAMPORTS,
  type WalletIdentity,
} from './controller.ts';
import { registerMockWallets } from './mock-wallets.ts';
import type {
  InspectedInvoice,
  SimulatedFault,
  InvoiceAccountEnvelope,
  InvoiceRecord,
} from './types';
import './receiptrail.css';

// Đăng ký các mock wallets vào Wallet Standard chuẩn
registerMockWallets();

function ReceiptRailInner() {
  const { connectors, connect, disconnect, wallet } = useWalletConnection();
  const controllerRef = useRef<ReceiptRailReviewController>(new ReceiptRailReviewController());
  const controller = controllerRef.current;

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
  const [decodeErrors, setDecodeErrors] = useState<{ address: string; error: string }[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>(
    'EpQUeEpGPoZrDoffujf86a3GnKdBkX7RbvsbXkkfpodo'
  );
  const [inspected, setInspected] = useState<InspectedInvoice | null>(null);

  // Review confirmation flags (synced with controller snapshots)
  const [termsConfirmed, setTermsConfirmed] = useState(false);
  const [cancelConfirmed, setCancelConfirmed] = useState(false);
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

  // Build wallet identity
  const currentWalletIdentity = useMemo<WalletIdentity | null>(() => {
    if (!wallet) return null;
    return {
      id: `${wallet.connector.id}:${wallet.account.address}`,
      name: wallet.connector.name,
      address: wallet.account.address,
      chains: ['solana:devnet'],
    };
  }, [wallet]);

  // P5-03 / T36: Reset snapshots when wallet identity (including same address but different instance) or chains change
  useEffect(() => {
    controller.onWalletChange(currentWalletIdentity);
    setTermsConfirmed(false);
    setCancelConfirmed(false);
    setCreateConfirmed(false);
  }, [currentWalletIdentity, controller]);

  // When selected invoice changes, invalidate pay & cancel snapshots in controller
  useEffect(() => {
    controller.onSelectInvoice(selectedAddress);
    setTermsConfirmed(false);
    setCancelConfirmed(false);
  }, [selectedAddress, controller]);

  // Compute dynamic preview expiry slot
  const previewExpiry = useMemo(() => {
    return computePreviewExpiry(currentSlot, expiryDeltaInput);
  }, [currentSlot, expiryDeltaInput]);

  // When form inputs change, invalidate create snapshot
  const handleInputChange = (field: 'payer' | 'amount' | 'expiry' | 'id', val: string) => {
    controller.onInputChange();
    setCreateConfirmed(false);
    if (field === 'payer') setPayerInput(val);
    else if (field === 'amount') setAmountInput(val);
    else if (field === 'expiry') setExpiryDeltaInput(val);
    else if (field === 'id') setInvoiceIdHexInput(val);
  };

  // Refresh current invoice and decode all invoices in list with stale request guard
  const refreshData = async () => {
    const reqId = controller.nextRequestId();
    try {
      const list = await mockEngine.listInvoices();
      if (!controller.isCurrentRequest(reqId)) return;

      setInvoices(list);

      const decodedList: InvoiceRecord[] = [];
      const errorsList: { address: string; error: string }[] = [];

      for (const acc of list) {
        try {
          const dec = await client.decodeInvoice(acc);
          decodedList.push(dec as InvoiceRecord);
        } catch (err) {
          errorsList.push({
            address: acc.address,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }

      if (!controller.isCurrentRequest(reqId)) return;
      setDecodedInvoices(decodedList);
      setDecodeErrors(errorsList);

      if (selectedAddress) {
        const insp = await mockEngine.inspect(selectedAddress, connectedAddress ?? undefined);
        if (!controller.isCurrentRequest(reqId)) return;
        setInspected(insp);
      }
    } catch (err) {
      if (controller.isCurrentRequest(reqId)) {
        setActionMessage({
          text: `Lỗi làm mới dữ liệu sổ cái: ${err instanceof Error ? err.message : String(err)}`,
          type: 'error',
        });
      }
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
      controller.onDisconnect();
      setTermsConfirmed(false);
      setCancelConfirmed(false);
      setCreateConfirmed(false);
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

  // Create Invoice: Double-submit lock + snapshot verification
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionMessage(null);

    if (!connectedAddress) {
      setActionMessage({ text: 'Vui lòng kết nối ví Merchant trước khi tạo hóa đơn.', type: 'error' });
      return;
    }

    if (!createConfirmed || !controller.createSnapshot) {
      setActionMessage({ text: 'Vui lòng đánh dấu xác nhận xem trước điều khoản trước khi tạo.', type: 'error' });
      return;
    }

    let releaseLock: () => void;
    try {
      releaseLock = controller.beginSubmission();
    } catch (err) {
      setActionMessage({ text: err instanceof Error ? err.message : String(err), type: 'error' });
      return;
    }

    setIsProcessing(true);

    try {
      const snapshot = controller.createSnapshot;

      const res = await mockEngine.createInvoice({
        merchant: snapshot.merchant,
        payer: snapshot.payer,
        invoiceId: snapshot.invoiceId,
        amountLamports: snapshot.amountLamports,
        expiresSlot: snapshot.expiresSlot,
      });

      setSelectedAddress(res.invoiceAddress);
      setActiveTab('view');
      controller.invalidateAllSnapshots();
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
      releaseLock();
      setIsProcessing(false);
    }
  };

  // Pay Invoice: Double-submit lock + snapshot verification
  const handlePayInvoice = async () => {
    if (!inspected) return;
    if (!connectedAddress) {
      setActionMessage({ text: 'Vui lòng kết nối ví Payer để thanh toán.', type: 'error' });
      return;
    }
    if (!termsConfirmed || !controller.paySnapshot) {
      setActionMessage({ text: 'Vui lòng đánh dấu xác nhận các điều khoản trước khi thanh toán.', type: 'error' });
      return;
    }

    let releaseLock: () => void;
    try {
      releaseLock = controller.beginSubmission();
    } catch (err) {
      setActionMessage({ text: err instanceof Error ? err.message : String(err), type: 'error' });
      return;
    }

    setIsProcessing(true);
    setActionMessage(null);

    try {
      const snapshot = controller.paySnapshot;
      const res = await mockEngine.payInvoice({
        invoiceAddress: snapshot.invoiceAddress,
        signer: connectedAddress,
        confirmedTerms: {
          address: snapshot.invoiceAddress,
          merchant: snapshot.merchant,
          payer: snapshot.payer,
          invoiceId: snapshot.invoiceId,
          amountLamports: snapshot.amountLamports,
          expiresSlot: snapshot.expiresSlot,
        },
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
      releaseLock();
      setIsProcessing(false);
    }
  };

  // Cancel Invoice: Double-submit lock + snapshot verification (do not build terms on click!)
  const handleCancelInvoice = async () => {
    if (!inspected) return;
    if (!connectedAddress) {
      setActionMessage({ text: 'Vui lòng kết nối ví Merchant để hủy hóa đơn.', type: 'error' });
      return;
    }
    if (!cancelConfirmed || !controller.cancelSnapshot) {
      setActionMessage({ text: 'Vui lòng đánh dấu xác nhận hủy hóa đơn trước khi thực hiện.', type: 'error' });
      return;
    }

    let releaseLock: () => void;
    try {
      releaseLock = controller.beginSubmission();
    } catch (err) {
      setActionMessage({ text: err instanceof Error ? err.message : String(err), type: 'error' });
      return;
    }

    setIsProcessing(true);
    setActionMessage(null);

    try {
      const snapshot = controller.cancelSnapshot;
      const res = await mockEngine.cancelInvoice({
        invoiceAddress: snapshot.invoiceAddress,
        signer: connectedAddress,
        confirmedTerms: {
          address: snapshot.invoiceAddress,
          merchant: snapshot.merchant,
          payer: snapshot.payer,
          invoiceId: snapshot.invoiceId,
          amountLamports: snapshot.amountLamports,
          expiresSlot: snapshot.expiresSlot,
        },
      });

      setActionMessage({
        text: `Đã hủy hóa đơn thành công! Chữ ký: ${res.signature}. Trạng thái đổi thành CANCELLED trên mock ledger.`,
        type: 'success',
      });
      setCancelConfirmed(false);
      controller.cancelSnapshot = null;
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setActionMessage({ text: `Hủy thất bại: ${msg}`, type: 'error' });
    } finally {
      releaseLock();
      setIsProcessing(false);
    }
  };

  // Re-check on chain (Unknown Recovery)
  const handleRecheckOnChain = async () => {
    if (!selectedAddress) return;
    let releaseLock: () => void;
    try {
      releaseLock = controller.beginSubmission();
    } catch (err) {
      setActionMessage({ text: err instanceof Error ? err.message : String(err), type: 'error' });
      return;
    }

    setIsProcessing(true);
    try {
      const res = await mockEngine.recheckOnChain(selectedAddress);
      setActionMessage({
        text: `Đã đối soát trạng thái sổ cái: Hóa đơn hiện là ${res.status.toUpperCase()}! (Chữ ký: ${res.signature ?? 'N/A'})`,
        type: 'success',
      });
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setActionMessage({ text: `Lỗi đối soát: ${msg}`, type: 'error' });
    } finally {
      releaseLock();
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
                'Chưa kết nối ví (Chế độ Khách xem)'
              )}
            </h4>
            <p>
              {connectedAddress ? (
                <>
                  {connectedAddress}
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
                'Bạn có thể xem chi tiết mọi hóa đơn công khai mà không cần kết nối ví.'
              )}
            </p>
          </div>
        </div>

        <div className="rr-wallet-actions">
          {connectedAddress ? (
            <button type="button" className="secondary-button" onClick={handleDisconnect}>
              Ngắt kết nối
            </button>
          ) : (
            connectors.map((c) => (
              <button
                key={c.id}
                type="button"
                className="secondary-button"
                disabled={isConnecting}
                onClick={() => handleConnect(c.id)}
              >
                {c.name}
              </button>
            ))
          )}
        </div>
      </section>

      {/* Mock Controls & Fault Injection Bar */}
      <section className="rr-mock-bar" aria-label="Bảng điều khiển thử nghiệm lỗi">
        <div className="rr-mock-slot">
          <strong>Slot hiện tại:</strong> <span className="mono">{currentSlot.toString()}</span>
          <button type="button" className="text-button" onClick={() => handleWarpSlot(1n)}>
            +1 slot
          </button>
          <button type="button" className="text-button" onClick={() => handleWarpSlot(50n)}>
            +50 slots
          </button>
          <button type="button" className="text-button" onClick={() => handleWarpSlot(150n)}>
            +150 slots (Tua hết hạn)
          </button>
        </div>

        <div className="rr-mock-fault">
          <label htmlFor="sim-fault-select">
            <strong>Mô phỏng sự cố:</strong>
          </label>
          <select
            id="sim-fault-select"
            value={simulatedFault}
            onChange={(e) => handleFaultChange(e.target.value as SimulatedFault)}
          >
            <option value="none">Bình thường (None)</option>
            <option value="timeout_unknown">RPC Timeout (Rơi vào Unknown)</option>
            <option value="cpi_rollback">Thiếu số dư (CPI Rollback)</option>
            <option value="duplicate_pay">Thanh toán trùng (Duplicate Pay)</option>
            <option value="wrong_payer">Sai người trả (Wrong Payer)</option>
          </select>
        </div>
      </section>

      {/* Alert Action Message */}
      {actionMessage && (
        <div
          className={`notice-banner ${actionMessage.type}`}
          role="status"
          aria-live="polite"
          style={{ marginBottom: '24px' }}
        >
          {actionMessage.text}
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="rr-tabs" aria-label="Phân hướng màn hình ReceiptRail">
        <button
          type="button"
          className={`rr-tab-btn ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          1. Chi tiết &amp; Thanh toán
        </button>
        <button
          type="button"
          className={`rr-tab-btn ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          2. Tạo hóa đơn mới (Merchant)
        </button>
        <button
          type="button"
          className={`rr-tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          3. Danh sách Sổ cái ({invoices.length})
        </button>
        <button
          type="button"
          className={`rr-tab-btn ${activeTab === 'demo165' ? 'active' : ''}`}
          onClick={() => setActiveTab('demo165')}
        >
          4. Kịch bản Demo 165s
        </button>
      </nav>

      {/* TAB 1: VIEW & PAY INVOICE */}
      {activeTab === 'view' && inspected && (
        <div className="rr-card">
          <div className="rr-card-heading">
            <div>
              <h2 className="rr-card-title">Hóa đơn: {inspected.invoice.address.slice(0, 12)}...</h2>
              <div style={{ fontSize: '0.85rem', color: '#5c756b', marginTop: '4px' }}>
                Hóa đơn được mã hóa trên sổ cái ReceiptRail
              </div>
            </div>

            <div className="rr-badges">
              {/* Status Badge */}
              <span
                className={`rr-badge ${
                  inspected.invoice.status === 'Paid'
                    ? 'rr-badge-paid'
                    : inspected.invoice.status === 'Cancelled'
                    ? 'rr-badge-cancelled'
                    : inspected.expiry === 'Expired'
                    ? 'rr-badge-expired'
                    : 'rr-badge-open'
                }`}
              >
                {inspected.displayStatus.toUpperCase()}
              </span>

              {/* Commitment Badge */}
              <span className="rr-badge rr-badge-confirmed">
                {inspected.commitment === 'confirmed' ? 'CONFIRMED (Chờ Finalized)' : 'PROCESSED'}
              </span>

              {/* Pending Badge */}
              {inspected.isPending && (
                <span className="rr-badge rr-badge-expired" style={{ background: '#fef08a', color: '#854d0e' }}>
                  PENDING / UNKNOWN
                </span>
              )}
            </div>
          </div>

          {/* Unknown Recovery Alert */}
          {inspected.isPending && (
            <div className="rr-alert-unknown" role="alert">
              <h4>Giao dịch đang ở trạng thái Chưa rõ (Unknown / Pending)</h4>
              <p>
                Giao dịch gửi trước đó gặp sự cố mạng (Timeout). Hệ thống đã lưu chữ ký đã ký{' '}
                <span className="mono">{pendingSignature ?? 'N/A'}</span>. Mọi thao tác
                thanh toán trùng hoặc hủy đều bị khóa nhằm tránh double-spend. Vui lòng bấm đối soát để kiểm tra trạng thái
                sổ cái thực tế.
              </p>
              <button
                type="button"
                className="secondary-button"
                disabled={isProcessing}
                onClick={handleRecheckOnChain}
              >
                {isProcessing ? 'Đang đối soát...' : 'Kiểm tra lại trên chuỗi (Re-check on-chain) ↻'}
              </button>
            </div>
          )}

          {/* Details Grid */}
          <div className="rr-grid-details">
            <div className="rr-detail-item">
              <div className="rr-detail-label">Địa chỉ Hóa đơn (PDA)</div>
              <div className="rr-detail-value mono">
                {inspected.invoice.address}
                <button
                  type="button"
                  className="rr-copy-btn"
                  onClick={() => copyToClipboard(inspected.invoice.address)}
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="rr-detail-item">
              <div className="rr-detail-label">Người nhận (Merchant)</div>
              <div className="rr-detail-value mono">
                {inspected.invoice.merchant}
                <button
                  type="button"
                  className="rr-copy-btn"
                  onClick={() => copyToClipboard(inspected.invoice.merchant)}
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="rr-detail-item">
              <div className="rr-detail-label">Người trả chỉ định (Payer)</div>
              <div className="rr-detail-value mono">
                {inspected.invoice.payer}
                <button
                  type="button"
                  className="rr-copy-btn"
                  onClick={() => copyToClipboard(inspected.invoice.payer)}
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="rr-detail-item">
              <div className="rr-detail-label">Số tiền yêu cầu thanh toán</div>
              <div className="rr-detail-value">
                <span style={{ fontSize: '1.25rem', color: '#164b3f' }}>
                  {formatSol(inspected.invoice.amountLamports)} SOL
                </span>
                <span style={{ fontSize: '0.8rem', color: '#6b8277', marginLeft: '6px' }}>
                  ({inspected.invoice.amountLamports.toString()} lamports)
                </span>
              </div>
            </div>

            <div className="rr-detail-item">
              <div className="rr-detail-label">Hạn thanh toán (Expires Slot)</div>
              <div className="rr-detail-value">
                Slot {inspected.invoice.expiresSlot.toString()}
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: currentSlot >= inspected.invoice.expiresSlot ? '#dc2626' : '#15803d',
                    marginLeft: '6px',
                  }}
                >
                  ({currentSlot >= inspected.invoice.expiresSlot ? 'Đã hết hạn' : 'Còn hiệu lực'})
                </span>
              </div>
            </div>

            <div className="rr-detail-item">
              <div className="rr-detail-label">Invoice ID (32-bytes hex)</div>
              <div className="rr-detail-value mono" style={{ fontSize: '0.75rem' }}>
                {Array.from(inspected.invoice.invoiceId)
                  .map((b) => b.toString(16).padStart(2, '0'))
                  .join('')}
              </div>
            </div>
          </div>

          {/* Action Box based on role & state */}
          <div className="rr-action-box">
            {inspected.invoice.status === 'Paid' ? (
              <div>
                <p style={{ color: '#15803d', fontWeight: 600 }}>
                  Hóa đơn này đã được thanh toán thành công tại Slot {inspected.invoice.paidSlot.toString()}.
                </p>
                <p style={{ fontSize: '0.85rem', color: '#4b6b61' }}>
                  Biên nhận bất biến đã được ghi nhận trên sổ cái. Không thể thao tác lại.
                </p>
              </div>
            ) : inspected.invoice.status === 'Cancelled' ? (
              <div>
                <p style={{ color: '#b91c1c', fontWeight: 600 }}>
                  Hóa đơn này đã bị hủy (CANCELLED) bởi Merchant.
                </p>
                <p style={{ fontSize: '0.85rem', color: '#4b6b61' }}>
                  Hóa đơn đã đóng trên sổ cái. Tiền cọc thuê tài khoản không hoàn lại tự động trong kịch bản mock.
                </p>
              </div>
            ) : inspected.expiry === 'Expired' ? (
              <div>
                <p style={{ color: '#b45309', fontWeight: 600, marginBottom: '8px' }}>
                  Hóa đơn đã hết hạn thanh toán (Slot {inspected.invoice.expiresSlot.toString()} &lt; Slot hiện tại{' '}
                  {currentSlot.toString()}). Người trả không thể thanh toán tiếp.
                </p>
                {isMerchant && (
                  <div>
                    <label className="rr-checkbox-label" style={{ marginBottom: '12px' }}>
                      <input
                        type="checkbox"
                        checked={cancelConfirmed}
                        disabled={inspected.isPending}
                        onChange={(e) => {
                          setCancelConfirmed(e.target.checked);
                          if (e.target.checked) {
                            controller.confirmCancel({
                              invoiceAddress: inspected.invoice.address,
                              merchant: inspected.invoice.merchant,
                              payer: inspected.invoice.payer,
                              amountLamports: inspected.invoice.amountLamports,
                              expiresSlot: inspected.invoice.expiresSlot,
                              invoiceId: inspected.invoice.invoiceId,
                              estimatedFeeLamports: ESTIMATED_FEE_LAMPORTS,
                            });
                          } else {
                            controller.cancelSnapshot = null;
                          }
                        }}
                      />
                      <span>
                        Xác nhận hủy hóa đơn hết hạn này (Snapshot: {inspected.invoice.address.slice(0, 8)}... ; Phí mock: ~10,000 lamports)
                      </span>
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
                              controller.confirmPay({
                                invoiceAddress: inspected.invoice.address,
                                merchant: inspected.invoice.merchant,
                                payer: inspected.invoice.payer,
                                amountLamports: inspected.invoice.amountLamports,
                                expiresSlot: inspected.invoice.expiresSlot,
                                invoiceId: inspected.invoice.invoiceId,
                                estimatedFeeLamports: ESTIMATED_FEE_LAMPORTS,
                              });
                            } else {
                              controller.paySnapshot = null;
                            }
                          }}
                        />
                        <span>
                          Tôi đã kiểm tra kỹ: Người nhận ({inspected.invoice.merchant.slice(0, 6)}...), Số tiền (
                          {formatSol(inspected.invoice.amountLamports)} SOL), Hạn (Slot {inspected.invoice.expiresSlot.toString()}), Phí mock (~10,000 lamports)
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
                      Bạn đang kết nối ví <strong>Merchant</strong>. Bạn có quyền hủy hóa đơn này nếu người mua chưa thanh toán.
                    </p>
                    <label className="rr-checkbox-label" style={{ marginBottom: '12px' }}>
                      <input
                        type="checkbox"
                        checked={cancelConfirmed}
                        disabled={inspected.isPending}
                        onChange={(e) => {
                          setCancelConfirmed(e.target.checked);
                          if (e.target.checked) {
                            controller.confirmCancel({
                              invoiceAddress: inspected.invoice.address,
                              merchant: inspected.invoice.merchant,
                              payer: inspected.invoice.payer,
                              amountLamports: inspected.invoice.amountLamports,
                              expiresSlot: inspected.invoice.expiresSlot,
                              invoiceId: inspected.invoice.invoiceId,
                              estimatedFeeLamports: ESTIMATED_FEE_LAMPORTS,
                            });
                          } else {
                            controller.cancelSnapshot = null;
                          }
                        }}
                      />
                      <span>Xác nhận hủy hóa đơn này (Chuyển sang Cancelled trên sổ cái; tiền cọc rent không tự hoàn).</span>
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
                  handleInputChange('amount', '0.001');
                  handleInputChange('payer', DEFAULT_PAYER.address);
                  handleInputChange('expiry', '100');
                  handleInputChange('id', '3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a');
                }}
              >
                Mẫu: Cà phê (0.001 SOL)
              </button>
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  handleInputChange('amount', '1.5');
                  handleInputChange('payer', DEFAULT_PAYER.address);
                  handleInputChange('expiry', '200');
                  handleInputChange('id', '4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b');
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
                onChange={(e) => handleInputChange('payer', e.target.value)}
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
                onChange={(e) => handleInputChange('amount', e.target.value)}
              />
              <div className="rr-form-help">
                Chuyển đổi sang BigInt lamports không làm tròn (1 SOL = 1,000,000,000 lamports)
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
                onChange={(e) => handleInputChange('expiry', e.target.value)}
              />
              <div className="rr-form-help">
                {previewExpiry.slot !== null ? (
                  <>Hạn slot ước tính: Slot {previewExpiry.slot.toString()} (Slot quan sát: {currentSlot.toString()} + {expiryDeltaInput.trim()} slots)</>
                ) : (
                  <span style={{ color: '#dc2626' }}>{previewExpiry.error}</span>
                )}
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
                onChange={(e) => handleInputChange('id', e.target.value)}
              />
              <div className="rr-form-help">
                Định danh duy nhất 32 bytes (64 ký tự hex). Không tự ý đệm 0 hay cắt ngắn.
              </div>
            </div>

            {/* P5-04 / T36: Explicit Create Review Snapshot with dynamic values */}
            <div className="rr-action-box" style={{ marginBottom: '20px' }}>
              <div style={{ fontWeight: 600, marginBottom: '6px' }}>Xem trước chi phí &amp; Điều khoản tạo:</div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#4b6b61', marginBottom: '12px' }}>
                <li>Người tạo (Merchant): <span className="mono">{connectedAddress ?? DEFAULT_MERCHANT.address}</span></li>
                <li>Người trả (Payer): <span className="mono">{payerInput.trim() || 'N/A'}</span></li>
                <li>Số tiền: <strong>{amountInput.trim() || '0'} SOL</strong></li>
                <li>
                  Hạn slot: {previewExpiry.slot !== null ? `Slot ${previewExpiry.slot.toString()}` : 'Lỗi slot'}
                </li>
                <li>Invoice ID hex: <span className="mono" style={{ fontSize: '0.75rem' }}>{invoiceIdHexInput.trim()}</span></li>
                <li>Tiền cọc tài khoản (Rent deposit): 1,802,640 lamports (số đo LiteSVM mẫu cục bộ; không hoàn tự động khi Cancel).</li>
                <li>Ước tính phí mạng (Transaction Fee): ~10,000 lamports.</li>
              </ul>
              <label className="rr-checkbox-label">
                <input
                  type="checkbox"
                  checked={createConfirmed}
                  disabled={previewExpiry.slot === null}
                  onChange={async (e) => {
                    const isChecked = e.target.checked;
                    setCreateConfirmed(isChecked);
                    if (isChecked && previewExpiry.slot !== null) {
                      try {
                        const lamports = parseSol(amountInput);
                        const idBytes = parseInvoiceIdHex(invoiceIdHexInput);
                        const merchantAddr = connectedAddress ?? DEFAULT_MERCHANT.address;
                        const pda = await client.deriveInvoiceAddress(merchantAddr, idBytes);
                        controller.confirmCreate({
                          merchant: merchantAddr,
                          payer: payerInput.trim(),
                          amountLamports: lamports,
                          expiresSlot: previewExpiry.slot,
                          invoiceId: idBytes,
                          invoiceIdHex: invoiceIdHexInput.trim(),
                          pdaAddress: pda.address,
                          pdaBump: pda.bump,
                          rentDepositLamports: RENT_DEPOSIT_LAMPORTS,
                          estimatedFeeLamports: ESTIMATED_FEE_LAMPORTS,
                        });
                      } catch (err) {
                        setCreateConfirmed(false);
                        controller.createSnapshot = null;
                        setActionMessage({
                          text: `Không thể khóa snapshot: ${err instanceof Error ? err.message : String(err)}`,
                          type: 'error',
                        });
                      }
                    } else {
                      controller.createSnapshot = null;
                    }
                  }}
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

      {/* TAB 3: LIST INVOICES — P5-04 / T36: Decoded Invoices + Error boundary */}
      {activeTab === 'list' && (
        <div className="rr-card">
          <div className="rr-card-heading">
            <h2 className="rr-card-title">Sổ cái Hóa đơn Cục bộ ({decodedInvoices.length})</h2>
            <button type="button" className="text-button" onClick={refreshData}>
              Làm mới ↻
            </button>
          </div>

          {decodeErrors.length > 0 && (
            <div className="notice-banner error" role="alert" style={{ marginBottom: '16px' }}>
              <strong>Phát hiện {decodeErrors.length} tài khoản không thể giải mã:</strong>
              <ul style={{ margin: '4px 0 0', paddingLeft: '20px' }}>
                {decodeErrors.map((err) => (
                  <li key={err.address}>
                    <span className="mono">{err.address}</span>: {err.error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rr-table-wrapper">
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
            <h4>Đoạn 2: Merchant tạo Hóa đơn qua ReceiptRail PDA (0:35 - 1:05 · 30s)</h4>
            <p>
              Merchant mở tab "Tạo Hóa đơn", nhập ví Payer (Alice), số tiền 0.001 SOL, hạn 100 slots. Hệ thống tính PDA duy nhất và ký gửi tiền thuê rent an toàn theo mẫu LiteSVM.
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
            <h4>Đoạn 5: Kiểm tra Rollback &amp; Phân quyền (2:15 - 2:45 · 30s)</h4>
            <p>
              Thử nghiệm trả lần 2 hoặc ví Bob (người ngoài) cố tình thanh toán thay: Hệ thống từ chối ngay lập tức với mã lỗi Anchor IDL. Giao dịch được kiểm soát chặt chẽ theo phân quyền và logic idempotency của program.
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
