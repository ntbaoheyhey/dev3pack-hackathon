import { useState, useEffect, useRef } from 'react';
import { autoDiscover, createClient } from '@solana/client';
import { SolanaProvider, useWalletConnection } from '@solana/react-hooks';
import { DEVNET_RPC } from '../lib/inspect';
import { mockEngine, client, formatSol, formatWalletError, DEFAULT_PAYER,
  MOCK_RENT_LAMPORTS, MOCK_FEE_LAMPORTS } from './adapter';
import { registerMockWallets } from './mock-wallets';
import { ReceiptRailConfirmations, buildCreateReview, executeConfirmedOperation } from './confirmation';
import type { ConfirmationContext, CreateReview, Action, Operation } from './confirmation';
import { receiptRailWallet, watchReceiptRailWallets } from './wallet-lifecycle';
import type { InspectedInvoice, SimulatedFault, InvoiceAccountEnvelope, InvoiceRecord } from './types';
import './receiptrail.css';

registerMockWallets();
const hex = (bytes: Uint8Array) => Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
const messageOf = (error: unknown) => error instanceof Error ? error.message : String(error);

function ReceiptRailInner() {
  const { connectors, connect, disconnect, wallet, status } = useWalletConnection();
  const [activeTab, setActiveTab] = useState<'view' | 'create' | 'list' | 'demo165'>(() => {
    const t = typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get('tab');
    return t === 'create' || t === 'list' || t === 'demo165' ? t : 'view';
  });
  const [confirmations] = useState(() => new ReceiptRailConfirmations());
  const [currentSlot, setCurrentSlot] = useState(mockEngine.currentSlot);
  const [simulatedFault, setSimulatedFault] = useState<SimulatedFault>('none');
  const [invoices, setInvoices] = useState<InvoiceAccountEnvelope[]>([]);
  const [decodedInvoices, setDecodedInvoices] = useState<InvoiceRecord[]>([]);
  const [selectedAddress, setSelectedAddress] = useState('EpQUeEpGPoZrDoffujf86a3GnKdBkX7RbvsbXkkfpodo');
  const [detail, setDetail] = useState<{ value: InspectedInvoice; context: ConfirmationContext } | null>(null);
  const [preview, setPreview] = useState<{ value: CreateReview; token: ReturnType<ReceiptRailConfirmations['beginRead']> } | null>(null);
  const [previewError, setPreviewError] = useState('');
  const [dataError, setDataError] = useState('');
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [reload, setReload] = useState(0);
  const [walletEvent, setWalletEvent] = useState(0);
  const [, renderApproval] = useState(0);
  const mounted = useRef(false);
  const connecting = useRef(false);
  const reconciling = useRef(false);
  const eventSequence = useRef(0);
  const session = useRef(wallet);
  session.current = wallet;

  const [payerInput, setPayerInput] = useState(DEFAULT_PAYER.address);
  const [amountInput, setAmountInput] = useState('0.001');
  const [expiryDeltaInput, setExpiryDeltaInput] = useState('100');
  const [invoiceIdHexInput, setInvoiceIdHexInput] = useState('2a'.repeat(32));
  const { address: connectedAddress, chainAllowed } = receiptRailWallet(wallet);
  const formKey = JSON.stringify([payerInput, amountInput, expiryDeltaInput, invoiceIdHexInput]);
  const context: ConfirmationContext = { walletIdentity: wallet, address: connectedAddress,
    chainAllowed: chainAllowed && status === 'connected', walletEvent,
    selectedAddress, formKey, slot: currentSlot };
  const latest = useRef(context);
  latest.current = context;
  const currentContext = (): ConfirmationContext => {
    const raw = receiptRailWallet(session.current);
    return { ...latest.current, walletIdentity: session.current, address: raw.address,
      chainAllowed: raw.chainAllowed && latest.current.chainAllowed,
      walletEvent: eventSequence.current, slot: mockEngine.currentSlot };
  };
  const invalidate = () => {
    confirmations.invalidate();
    setActionMessage(null);
    renderApproval(n => n + 1);
    setReload(n => n + 1);
  };
  const edit = (change: () => void) => { invalidate(); change(); };

  useEffect(() => {
    mounted.current = true;
    const oldTitle = document.title;
    document.title = 'ReceiptRail · Demo hóa đơn SOL cục bộ';
    const off = watchReceiptRailWallets(() => {
      confirmations.invalidate(); // Before React renders the new wallet/chain.
      setWalletEvent(++eventSequence.current);
      setActionMessage(null);
    });
    return () => { mounted.current = false; off(); confirmations.invalidate(); document.title = oldTitle; };
  }, [confirmations]);

  const readCurrent = (token: ReturnType<ReceiptRailConfirmations['beginRead']>) => {
    confirmations.sync(currentContext());
    return mounted.current && confirmations.isCurrentRead(token);
  };
  const operationCurrent = (token: Operation) => {
    confirmations.sync(currentContext());
    return mounted.current && confirmations.isCurrent(token);
  };
  const refreshData = async () => {
    const ctx = currentContext();
    const token = confirmations.beginRead('data', ctx);
    setDataError('');
    try {
      const list = await mockEngine.listInvoices();
      // A malformed account is a visible failure, never silently dropped.
      const decoded = await Promise.all(list.map(acc => client.decodeInvoice(acc)));
      const value = await mockEngine.inspect(ctx.selectedAddress, ctx.address ?? undefined);
      if (!value) throw new Error('Không tìm thấy hóa đơn đang chọn trong dữ liệu mock.');
      if (!readCurrent(token)) return;
      confirmations.clear('pay'); confirmations.clear('cancel');
      setInvoices(list); setDecodedInvoices(decoded as InvoiceRecord[]);
      setDetail({ value, context: ctx });
    } catch (error) {
      if (!readCurrent(token)) return;
      setDetail(null); setInvoices([]); setDecodedInvoices([]);
      setDataError(`Không đọc được dữ liệu mock: ${messageOf(error)}`);
    }
  };
  useEffect(() => {
    confirmations.sync(currentContext());
    void refreshData();
  }, [wallet, connectedAddress, chainAllowed, status, walletEvent, selectedAddress, currentSlot, formKey, reload]);

  useEffect(() => {
    const ctx = currentContext();
    const token = confirmations.beginRead('preview', ctx);
    setPreview(null); setPreviewError('');
    if (!ctx.address || !ctx.chainAllowed) {
      setPreviewError('Kết nối ví hỗ trợ devnet để xem trước điều khoản tạo hóa đơn.');
      return;
    }
    void buildCreateReview({ payer: payerInput, amount: amountInput, expiryDelta: expiryDeltaInput,
      invoiceId: invoiceIdHexInput }, ctx.address, ctx.slot).then(value => {
      if (readCurrent(token)) setPreview({ value, token });
    }).catch(error => { if (readCurrent(token)) setPreviewError(messageOf(error)); });
  }, [wallet, connectedAddress, chainAllowed, status, walletEvent, formKey, currentSlot, selectedAddress, reload]);

  const inspected = detail && detail.context.walletIdentity === context.walletIdentity
    && detail.context.walletEvent === context.walletEvent && detail.context.address === context.address
    && detail.context.selectedAddress === selectedAddress && detail.context.slot === currentSlot ? detail.value : null;
  const createReview = preview && confirmations.matches(context) && confirmations.isCurrentRead(preview.token) ? preview.value : null;
  const termsConfirmed = confirmations.has('pay', context);
  const cancelConfirmed = confirmations.has('cancel', context);
  const createConfirmed = confirmations.has('create', context);
  const approve = (action: Action, checked: boolean) => {
    try {
      const ctx = currentContext();
      confirmations.sync(ctx);
      if (!checked) confirmations.clear(action);
      else if (action === 'create' && createReview && preview && confirmations.isCurrentRead(preview.token)) {
        confirmations.confirm(action, createReview, ctx);
      } else if (action !== 'create' && inspected && !inspected.isPending
        && (action === 'pay' ? inspected.canPay : inspected.canCancel)) {
        confirmations.confirm(action, inspected.invoice, ctx);
      } else throw new Error('Điều khoản chưa sẵn sàng; hãy xem lại hóa đơn.');
    } catch (error) { setActionMessage({ text: messageOf(error), type: 'error' }); }
    renderApproval(n => n + 1);
  };

  const handleConnect = async (connectorId: string) => {
    if (connecting.current || confirmations.busy || reconciling.current) return;
    connecting.current = true; invalidate(); setIsConnecting(true);
    try { await connect(connectorId); }
    catch (error) { if (mounted.current) setActionMessage({ text: formatWalletError(error), type: 'error' }); }
    finally { connecting.current = false; if (mounted.current) setIsConnecting(false); }
  };
  const handleDisconnect = async () => {
    if (connecting.current) return;
    connecting.current = true; invalidate(); setIsConnecting(true);
    try { await disconnect(); }
    catch (error) { if (mounted.current) setActionMessage({ text: formatWalletError(error), type: 'error' }); }
    finally { connecting.current = false; if (mounted.current) setIsConnecting(false); }
  };
  const handleWarpSlot = (delta: bigint) => {
    invalidate();
    try { mockEngine.warpSlot(delta); setCurrentSlot(mockEngine.currentSlot); }
    catch (error) { setActionMessage({ text: messageOf(error), type: 'error' }); }
  };
  const handleFaultChange = (fault: SimulatedFault) => {
    invalidate(); setSimulatedFault(fault); mockEngine.simulatedFault = fault;
  };

  const submit = async (action: Action) => {
    let operation: Operation;
    try {
      if (connecting.current || reconciling.current) throw new Error('Một thao tác còn đang xử lý.');
      operation = confirmations.begin(action, currentContext()); // Locks before the first await.
    } catch (error) { setActionMessage({ text: messageOf(error), type: 'error' }); return; }
    setIsProcessing(true); setActionMessage(null); renderApproval(n => n + 1);
    try {
      const result = await executeConfirmedOperation(mockEngine, operation);
      if (!operationCurrent(operation)) return;
      if ('invoiceAddress' in result) {
        setSelectedAddress(result.invoiceAddress); setActiveTab('view');
        setActionMessage({ text: `Đã tạo hóa đơn mock: ${result.invoiceAddress}.`, type: 'success' });
      } else if ('status' in result && result.status === 'Unknown') {
        setActionMessage({ text: `Mô phỏng mất phản hồi: Unknown. Mã mock ${result.signature}. Kiểm tra lại dữ liệu mock, không tự gửi lại.`, type: 'info' });
      } else {
        setActionMessage({ text: `Đã ${action === 'pay' ? 'thanh toán' : 'hủy'} trên dữ liệu mock. Mã mock: ${result.signature}.`, type: 'success' });
      }
    } catch (error) {
      if (operationCurrent(operation)) setActionMessage({ text: `Thao tác mock thất bại: ${messageOf(error)}`, type: 'error' });
    } finally {
      confirmations.finish(operation);
      if (mounted.current) { setIsProcessing(false); setReload(n => n + 1); }
    }
  };
  const handleCreateInvoice = (event: React.FormEvent) => { event.preventDefault(); void submit('create'); };
  const handlePayInvoice = () => { void submit('pay'); };
  const handleCancelInvoice = () => { void submit('cancel'); };
  const handleRecheckOnChain = async () => {
    if (reconciling.current || confirmations.busy || connecting.current) return;
    reconciling.current = true; invalidate(); setIsProcessing(true);
    const ctx = currentContext(), token = confirmations.beginRead('recheck', ctx);
    try {
      const res = await mockEngine.recheckOnChain(ctx.selectedAddress);
      if (readCurrent(token)) setActionMessage({ text: `Đọc lại dữ liệu mock: ${res.status}, kết quả request: ${res.outcome}; mã mock: ${res.signature ?? 'chưa có'}. Không gửi lại giao dịch.`, type: 'info' });
    } catch (error) {
      if (readCurrent(token)) setActionMessage({ text: `Lỗi đối soát mock: ${messageOf(error)}`, type: 'error' });
    } finally {
      reconciling.current = false;
      if (mounted.current) { setIsProcessing(false); setReload(n => n + 1); }
    }
  };
  const copyToClipboard = async (text: string) => {
    const token = confirmations.beginRead('clipboard', currentContext());
    try {
      await navigator.clipboard.writeText(text);
      if (readCurrent(token)) setActionMessage({ text: 'Đã copy đầy đủ vào bộ nhớ tạm.', type: 'info' });
    } catch (error) {
      if (readCurrent(token)) setActionMessage({ text: `Không copy được: ${messageOf(error)}`, type: 'error' });
    }
  };
  const isMerchant = inspected ? connectedAddress === inspected.invoice.merchant : false;
  const isPayer = inspected ? connectedAddress === inspected.invoice.payer : false;

  return (
    <div className="receiptrail-container">
      {/* Banner cảnh báo an toàn */}
      <div className="rr-banner-warning" role="alert">
        <span>
          <strong>CHẾ ĐỘ LOCAL DEMO (PHASE 5)</strong> — Dữ liệu mô phỏng · Không ký hoặc gửi giao dịch · Không chuyển SOL thật
        </span>
        <span className="badge">OFFLINE / LOCAL QA</span>
      </div>

      {/* Header */}
      <div className="rr-header">
        <h1>ReceiptRail — Đường ray Hóa đơn &amp; Thanh toán Solana</h1>
        <p className="lead">
          Demo hóa đơn SOL: tạo một lần, chỉ người trả chỉ định mới trả được, kiểm tra lại khi mất phản hồi.
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
                className={connector.id === wallet?.connector.id ? 'secondary' : 'text-button'}
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
              disabled={isConnecting}
            >
              Ngắt kết nối ví
            </button>
          )}
        </div>
      </section>

      {connectedAddress && !context.chainAllowed && <p role="alert" className="notice notice-error">Ví hoặc tài khoản chưa xác nhận hỗ trợ devnet; chỉ được xem dữ liệu mock.</p>}
      {connectors.length === 0 && <p role="status">Chưa tìm thấy ví Wallet Standard. Bạn vẫn có thể xem hóa đơn.</p>}
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
            <option value="timeout_unknown">Mock: đã xử lý, mất phản hồi (Unknown)</option>
            <option value="timeout_dropped">Mock: request bị drop, chưa xử lý (Unknown)</option>
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

      {dataError && <div role="alert" className="notice notice-error">{dataError}<button type="button" onClick={() => { void refreshData(); }}>Đọc lại dữ liệu mock</button></div>}
      {activeTab === 'view' && !inspected && !dataError && <p role="status">Đang đọc hóa đơn mock…</p>}
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
                COMMITMENT MÔ PHỎNG: {inspected.commitment.toUpperCase()}
              </span>
            </div>
          </div>

          {/* P5-02: Unknown / Timeout Recovery Alert */}
          {inspected.isPending && (
            <div className="rr-alert-unknown" role="alert">
              <h4>Giao dịch đang ở trạng thái CHƯA RÕ (Unknown State)</h4>
              <p>
                Mô phỏng mất phản hồi. Mã request mock của hóa đơn này:{' '}
                <code>{mockEngine.getPendingRecord(inspected.invoice.address)?.signature ?? 'N/A'}</code>.
              </p>
              <p>
                <strong>Mọi thao tác thanh toán hay hủy trên hóa đơn này đang bị khóa</strong> để chống trùng lặp giao dịch.
                Hãy đọc lại dữ liệu mock để đối soát; thao tác này không tạo giao dịch mới.
              </p>
              <button
                type="button"
                className="secondary"
                onClick={handleRecheckOnChain}
                disabled={isProcessing}
              >
                {isProcessing ? 'Đang kiểm tra...' : 'Kiểm tra lại dữ liệu mock ↻'}
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
                  <span>{currentSlot < inspected.invoice.expiresSlot ? `Còn ${(inspected.invoice.expiresSlot - currentSlot).toString()} slots` : 'Đã qua hạn slot'}</span>
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

          <div className="rr-detail-item"><div className="rr-detail-label">Invoice ID</div><div className="rr-detail-value mono">{hex(inspected.invoice.invoiceId)}</div></div>
          <p className="rr-form-help">Phí mock mỗi thao tác đã xử lý: {MOCK_FEE_LAMPORTS.toString()} lamports từ fee payer thử riêng. Rent mock giữ trong tài khoản: {MOCK_RENT_LAMPORTS.toString()} lamports; Cancel không hoàn rent. Lỗi mô phỏng CPI giữ tiền gốc, vẫn trừ phí mock.</p>
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
                        onChange={(e) => approve('cancel', e.target.checked)}
                        disabled={isProcessing || !context.chainAllowed || inspected.isPending}
                      />
                      <span>Xác nhận hủy hóa đơn hết hạn này (Trạng thái chuyển sang Cancelled, rent không tự hoàn)</span>
                    </label>
                    <button
                      type="button"
                      className="rr-btn-cancel"
                      onClick={handleCancelInvoice}
                      disabled={isProcessing || !context.chainAllowed || !cancelConfirmed || !inspected.canCancel}
                    >
                      Hủy hóa đơn hết hạn (mock)
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
                          disabled={isProcessing || !context.chainAllowed || inspected.isPending}
                          onChange={(e) => approve('pay', e.target.checked)}
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
                      disabled={isProcessing || !context.chainAllowed || !termsConfirmed || !inspected.canPay}
                    >
                      {inspected.isPending ? 'Đang bị khóa (Unknown)' : isProcessing ? 'Đang xử lý...' : `Thanh toán mock ${formatSol(inspected.invoice.amountLamports)} SOL`}
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
                        disabled={isProcessing || !context.chainAllowed || inspected.isPending}
                        onChange={(e) => approve('cancel', e.target.checked)}
                      />
                      <span>Xác nhận hủy hóa đơn này (Chuyển sang Cancelled; rent không tự hoàn trả).</span>
                    </label>
                    <button
                      type="button"
                      className="rr-btn-cancel"
                      onClick={handleCancelInvoice}
                      disabled={isProcessing || !context.chainAllowed || !cancelConfirmed || !inspected.canCancel}
                    >
                      {inspected.isPending ? 'Đang bị khóa (Unknown)' : isProcessing ? 'Đang hủy...' : 'Hủy hóa đơn mock (Cancel Invoice)'}
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
                  invalidate();
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
                  invalidate();
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
                onChange={(e) => edit(() => setPayerInput(e.target.value))}
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
                onChange={(e) => edit(() => setAmountInput(e.target.value))}
              />
              <div className="rr-form-help">
                Nhập số chính xác, không làm tròn. Ví dụ: 0.001 SOL = 1,000,000 lamports.
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
                onChange={(e) => edit(() => setExpiryDeltaInput(e.target.value))}
              />
              <div className="rr-form-help">
                Hạn slot: {createReview?.expiresSlot.toString() ?? 'chưa có điều khoản hợp lệ'} (slot mock: {currentSlot.toString()})
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
                onChange={(e) => edit(() => setInvoiceIdHexInput(e.target.value))}
              />
              <div className="rr-form-help">
                Định danh duy nhất 32 bytes. Không tự ý đệm 0 hay cắt ngắn.
              </div>
            </div>

            {/* P5-04: Explicit Create Review Snapshot */}
            <div className="rr-action-box" style={{ marginBottom: '20px' }}>
              <div style={{ fontWeight: 600, marginBottom: '6px' }}>Xem trước chi phí &amp; Điều khoản tạo:</div>
              {previewError && <p role="alert" className="notice notice-error">{previewError}</p>}
              {createReview ? (
                <dl className="rr-grid-details">
                  <div><dt>Merchant</dt><dd className="mono">{createReview.merchant}</dd></div>
                  <div><dt>Payer</dt><dd className="mono">{createReview.payer}</dd></div>
                  <div><dt>Tiền gốc</dt><dd>{formatSol(createReview.amountLamports)} SOL ({createReview.amountLamports.toString()} lamports)</dd></div>
                  <div><dt>Hạn slot</dt><dd>{createReview.expiresSlot.toString()}</dd></div>
                  <div><dt>Invoice ID</dt><dd className="mono">{hex(createReview.invoiceId)}</dd></div>
                  <div><dt>PDA</dt><dd className="mono">{createReview.invoiceAddress}</dd></div>
                </dl>
              ) : !previewError && <p role="status">Đang tính điều khoản tạo hóa đơn…</p>}
              <p className="rr-form-help">Rent mock: {MOCK_RENT_LAMPORTS.toString()} lamports từ merchant; Cancel không hoàn rent. Phí mock: {MOCK_FEE_LAMPORTS.toString()} lamports từ fee payer thử riêng; đây là số mẫu local, không phải báo giá mạng.</p>
              <label className="rr-checkbox-label">
                <input
                  type="checkbox"
                  checked={createConfirmed}
                  disabled={isProcessing || !createReview || !context.chainAllowed}
                  onChange={(e) => approve('create', e.target.checked)}
                />
                <span>Tôi đã kiểm tra đầy đủ điều khoản trên để tạo hóa đơn mock</span>
              </label>
            </div>

            <button type="submit" className="rr-btn-pay" disabled={isProcessing || !createConfirmed || !context.chainAllowed || !createReview}>
              {isProcessing ? 'Đang tạo...' : 'Tạo hóa đơn mock (Create Invoice)'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: LIST INVOICES — P5-04: Decoded Invoices */}
      {activeTab === 'list' && (
        <div className="rr-card">
          <div className="rr-card-heading">
            <h2 className="rr-card-title">Sổ cái Hóa đơn Cục bộ ({decodedInvoices.length})</h2>
            <button type="button" className="text-button" onClick={() => { void refreshData(); }} disabled={isProcessing}>
              Làm mới ↻
            </button>
          </div>

          <div className="rr-table-wrapper" tabIndex={0} role="region" aria-label="Danh sách hóa đơn, cuộn ngang để xem đủ cột">
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
                        invalidate();
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
            <h4>Đoạn 2: Merchant tạo hóa đơn mock (0:35 - 1:05 · 30s)</h4>
            <p>
              Merchant mở tab "Tạo Hóa đơn", nhập ví Payer (Alice), số tiền 0.001 SOL, hạn 100 slots. Demo tính PDA duy nhất và trừ rent trên số dư mock; không ký hay gửi lên mạng.
            </p>
          </div>

          <div className="rr-storyboard-step">
            <h4>Đoạn 3: Payer kết nối ví, Xác nhận điều khoản &amp; Thanh toán (1:05 - 1:40 · 35s)</h4>
            <p>
              Alice kết nối ví. Giao diện hiển thị chi tiết hóa đơn, yêu cầu duyệt terms snapshot. Alice bấm thanh toán mock. Số dư giả của Alice và Tiệm Cà phê thay đổi một lần, hóa đơn mock thành PAID.
            </p>
          </div>

          <div className="rr-storyboard-step">
            <h4>Đoạn 4: Phục hồi sự cố Timeout / Unknown State (1:40 - 2:15 · 35s)</h4>
            <p>
              Mô phỏng RPC Timeout: Giao diện chuyển sang trạng thái cảnh báo Unknown, giữ nguyên PDA/terms, không tự động gửi lại. Người dùng bấm "Kiểm tra lại dữ liệu mock" để đối soát kết quả.
            </p>
          </div>

          <div className="rr-storyboard-step">
            <h4>Đoạn 5: Kiểm tra Rollback &amp; Bảo mật (2:15 - 2:45 · 30s)</h4>
            <p>
              Màn hình khóa Pay trên hóa đơn Paid và ví sai vai. Bộ test local riêng thử duplicate, sai payer và rollback; UI không phát giao dịch lỗi để minh họa. Mã lỗi và số dư mock cho thấy phạm vi được kiểm; đây chưa phải thử ví hay thanh toán trên mạng.
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
