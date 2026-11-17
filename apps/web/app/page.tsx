import React from 'react';

export default function Dashboard() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>ClusterProof Dashboard</h1>
      <p>Trạng thái môi trường: <strong>Chưa kết nối</strong></p>
      <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '20px' }}>
        <h2>Thông tin Program</h2>
        <p>Đang tải dữ liệu từ on-chain...</p>
      </div>
    </div>
  );
}
