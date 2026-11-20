import React, { useSyncExternalStore } from 'react';
import type { ReceiptRailDevnetWalletConnection } from './devnet-wallet-connection.ts';
import type { Wallet } from '@wallet-standard/base';

export interface DevnetWalletPanelProps {
  connection: ReceiptRailDevnetWalletConnection;
  className?: string;
}

function shortenAddress(addr: string): string {
  if (!addr || addr.length <= 12) return addr || '';
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

export const DevnetWalletPanel: React.FC<DevnetWalletPanelProps> = ({ connection, className = '' }) => {
  const snapshot = useSyncExternalStore(connection.subscribe, connection.getSnapshot);

  const handleConnect = async (wallet: Wallet) => {
    try {
      await connection.connect(wallet);
    } catch {
      // Error is captured and published in snapshot
    }
  };

  const handleDisconnect = async () => {
    try {
      await connection.disconnect();
    } catch {
      // Error is captured in snapshot
    }
  };

  return (
    <section
      className={`rr-devnet-wallet-panel ${className}`}
      aria-labelledby="rr-devnet-wallet-heading"
      style={{
        border: '1px solid #0284c7',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: '#f0f9ff',
        color: '#0c4a6e',
        marginTop: '12px',
        marginBottom: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3 id="rr-devnet-wallet-heading" style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
          <span
            style={{
              backgroundColor: '#0284c7',
              color: '#ffffff',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 700,
              marginRight: '8px',
              letterSpacing: '0.5px',
            }}
          >
            DEVNET
          </span>
          Ví Wallet Standard (Solana Devnet)
        </h3>
        {snapshot.status === 'connected' && (
          <span
            style={{
              backgroundColor: '#16a34a',
              color: '#ffffff',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            ● Đã kết nối
          </span>
        )}
      </div>

      {snapshot.error && (
        <div
          role="alert"
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #ef4444',
            color: '#b91c1c',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '0.875rem',
            marginBottom: '12px',
          }}
        >
          <strong>Lỗi ví: </strong>
          {snapshot.error}
        </div>
      )}

      {snapshot.status === 'connected' && snapshot.selectedWallet && snapshot.selectedAccount ? (
        <div style={{ fontSize: '0.875rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 12px', marginBottom: '12px' }}>
            <span style={{ fontWeight: 600 }}>Ví:</span>
            <span>{snapshot.selectedWallet.name}</span>

            <span style={{ fontWeight: 600 }}>Địa chỉ:</span>
            <span style={{ wordBreak: 'break-all', fontFamily: 'monospace' }} title={snapshot.selectedAccount.address}>
              {snapshot.selectedAccount.address} ({shortenAddress(snapshot.selectedAccount.address)})
            </span>

            <span style={{ fontWeight: 600 }}>Mạng tài khoản:</span>
            <span>{snapshot.selectedAccount.chains?.join(', ') || 'solana:devnet'}</span>

            <span style={{ fontWeight: 600 }}>Generation:</span>
            <span style={{ fontFamily: 'monospace' }}>#{snapshot.generation}</span>
          </div>

          <button
            type="button"
            onClick={handleDisconnect}
            style={{
              backgroundColor: '#dc2626',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 14px',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Ngắt kết nối [Devnet]
          </button>
        </div>
      ) : (
        <div>
          {snapshot.connecting && (
            <div
              style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #3b82f6',
                color: '#1d4ed8',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '0.875rem',
                marginBottom: '12px',
              }}
            >
              Đang chờ xác nhận trên extension ví...
            </div>
          )}

          {snapshot.wallets.length === 0 ? (
            <div
              style={{
                padding: '12px',
                backgroundColor: '#ffffff',
                border: '1px dashed #94a3b8',
                borderRadius: '6px',
                fontSize: '0.875rem',
                color: '#475569',
              }}
            >
              <p style={{ margin: '0 0 6px 0', fontWeight: 600 }}>Chưa phát hiện ví Wallet Standard nào trên trình duyệt.</p>
              <p style={{ margin: 0, fontSize: '0.8125rem' }}>
                Vui lòng cài đặt và bật extension ví hỗ trợ mạng Solana Devnet (như Phantom, Solflare hoặc Backpack). Chế độ này
                không fallback về ví mock.
              </p>
            </div>
          ) : (
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '0.875rem', fontWeight: 500 }}>
                Chọn một ví để kết nối tới Solana Devnet:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {snapshot.wallets.map((wallet) => {
                  const supportsDevnet = !wallet.chains || wallet.chains.length === 0 || wallet.chains.includes('solana:devnet');
                  return (
                    <button
                      key={wallet.name}
                      type="button"
                      disabled={snapshot.connecting || !supportsDevnet}
                      onClick={() => handleConnect(wallet)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: supportsDevnet ? '#0284c7' : '#cbd5e1',
                        color: supportsDevnet ? '#ffffff' : '#64748b',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        cursor: supportsDevnet && !snapshot.connecting ? 'pointer' : 'not-allowed',
                      }}
                      title={supportsDevnet ? `Kết nối với ${wallet.name}` : `${wallet.name} không hỗ trợ solana:devnet`}
                    >
                      {wallet.icon && (
                        <img
                          src={wallet.icon}
                          alt=""
                          width={16}
                          height={16}
                          style={{ borderRadius: '2px', display: 'inline-block' }}
                        />
                      )}
                      <span>{wallet.name}</span>
                      {!supportsDevnet && <span style={{ fontSize: '0.75rem' }}>(Không hỗ trợ Devnet)</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
