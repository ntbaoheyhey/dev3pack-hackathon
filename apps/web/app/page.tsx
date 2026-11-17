import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { HELLO_PROGRAM, InspectionError, LOADER_V3, inspectProgram } from '../src/lib/inspect.ts';
import type { Inspection } from '../src/lib/inspect.ts';

export default function Dashboard() {
  const [programId, setProgramId] = useState('');
  const [result, setResult] = useState<Inspection | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);

  async function check(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    const request = new AbortController();
    controller.current = request;
    setBusy(true); setResult(null); setError('');
    try { setResult(await inspectProgram(programId, { signal: request.signal })); }
    catch (cause) { setError(cause instanceof InspectionError ? cause.message : 'Chưa thể kiểm tra. Hãy thử lại.'); }
    finally { setBusy(false); }
  }
  function changeInput(value: string) { setProgramId(value); setResult(null); setError(''); }
  const title = result?.state === 'executable' ? 'Program đã có trên Devnet'
    : result?.state === 'missing' ? 'Chưa tìm thấy program trên Devnet'
    : 'Account này không phải program executable';

  return <>
    <section className="intro">
      <p className="eyebrow"><span className="dot" /> KIỂM TRA TRƯỚC KHI TÍCH HỢP</p>
      <h1>Đúng cluster.<br /><span>Đúng nơi bắt đầu.</span></h1>
      <p className="lead">Kiểm tra program bạn sắp dùng trên Solana Devnet.<br className="desktop-break" /> Bắt đầu bằng Program ID, không cần kết nối ví.</p>
    </section>
    <div className="workspace">
      <section className="panel checker" aria-labelledby="check-title">
        <div className="panel-heading"><span className="step">01</span><h2 id="check-title">Kiểm tra program</h2><span className="badge">DEVNET</span></div>
        <form onSubmit={check} aria-busy={busy}>
          <label htmlFor="program-id">Program ID</label>
          <p className="field-hint" id="program-hint">Dán địa chỉ program muốn kiểm tra.</p>
          <input id="program-id" value={programId} onChange={(event) => changeInput(event.target.value)} placeholder="Ví dụ: 2yzxUQEpaeLmgCMh…" autoComplete="off" autoCapitalize="off" spellCheck={false} maxLength={100} disabled={busy} aria-describedby={`program-hint${error ? ' inspection-error' : ''}`} aria-invalid={!!error} />
          <div className="input-actions"><button type="button" className="text-button" disabled={busy} onClick={() => changeInput(HELLO_PROGRAM)}>Dùng program của lab <span aria-hidden="true">↗</span></button><span className="micro">Đọc dữ liệu · Không ký giao dịch</span></div>
          <button className="primary" disabled={busy || !programId.trim()} type="submit">{busy ? 'Đang kiểm tra Devnet…' : error ? 'Thử lại' : 'Kiểm tra trên Devnet'}<span aria-hidden="true">→</span></button>
          {busy && <button type="button" className="text-button cancel" onClick={() => controller.current?.abort()}>Hủy kiểm tra</button>}
        </form>
        <div className="result-area" aria-live="polite" aria-atomic="true">
          {error ? <div className="notice error" id="inspection-error"><strong>Chưa thể xác minh</strong><p>{error}</p></div>
            : busy ? <div className="empty-state"><span className="scan-icon" aria-hidden="true">↻</span><h3>Đang đọc dữ liệu</h3><p>Xác nhận cluster trước, sau đó đọc account của program.</p></div>
            : result ? <div className="inspection-result">
              <span className={`result-label ${result.state === 'executable' ? 'observed' : 'unknown'}`}>{result.state === 'executable' ? 'ĐÃ QUAN SÁT' : 'CHƯA SẴN SÀNG'}</span>
              <h3>{title}</h3>
              <p>{result.state === 'executable' ? 'Account có cờ executable. Điều này chưa chứng minh đúng binary, ABI hoặc mức độ an toàn.' : result.state === 'missing' ? 'RPC không tìm thấy account tại địa chỉ này. Kiểm tra lại địa chỉ hoặc trạng thái deploy.' : 'Địa chỉ tồn tại nhưng không có cờ executable. Hãy dùng địa chỉ program thay vì ví hoặc tài khoản dữ liệu.'}</p>
              <dl className="observations"><div><dt>Cluster</dt><dd>Devnet · genesis đã đối chiếu</dd></div><div><dt>Slot</dt><dd>{result.slot.toLocaleString('en-US')} · confirmed</dd></div><div><dt>Program ID</dt><dd className="address">{result.programId}</dd></div>{result.owner && <div><dt>Owner</dt><dd className="address">{result.owner}{result.owner === LOADER_V3 ? ' · Loader v3' : ' · Chưa phân tích owner này'}</dd></div>}<div><dt>Đọc lúc</dt><dd>{new Date(result.observedAt).toLocaleString('vi-VN')} (giờ thiết bị)</dd></div></dl>
              <a className="text-link" href={`https://explorer.solana.com/address/${result.programId}?cluster=devnet`} target="_blank" rel="noreferrer">Xem địa chỉ trên Explorer <span aria-hidden="true">↗</span></a>
            </div>
            : <div className="empty-state"><span className="scan-icon" aria-hidden="true">⌕</span><h3>Chưa có kết quả kiểm tra</h3><p>Nhập Program ID để đọc trạng thái hiện tại trên Devnet.</p></div>}
        </div>
      </section>
      <aside className="side-notes">
        <section className="scope-card"><p className="eyebrow">BẢN NỀN / PHASE 3</p><h2>Biết mình <br />đã kiểm tra gì.</h2><p>Trong bản này, mỗi kết quả đến từ lần đọc RPC bạn vừa yêu cầu.</p><ul className="check-list"><li><span aria-hidden="true">✓</span> Đúng cluster Devnet</li><li><span aria-hidden="true">✓</span> Account có tồn tại</li><li><span aria-hidden="true">✓</span> Cờ executable và owner</li></ul><div className="scope-limits"><span>CHƯA XÁC MINH</span><p>Binary · ABI · source code<br />Quyền upgrade · an toàn program</p></div></section>
        <section className="lab-link"><span className="lab-icon" aria-hidden="true">↗</span><h2>Thử kết nối ví</h2><p>Trang lab riêng để kiểm tra luồng kết nối và ngắt ví.</p><a className="text-link" href="/lab">Mở Devnet lab →</a></section>
      </aside>
    </div>
  </>;
}
