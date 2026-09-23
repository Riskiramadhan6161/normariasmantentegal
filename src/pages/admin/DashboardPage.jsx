import React from 'react';
import { useApp } from '../../context/AppContext';
import { Scissors, ClipboardList, Clock, CheckCircle, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const statusBadge = (s) => {
  const map = { 
    Pending: 'badge-pending', 
    Diproses: 'badge-process', 
    Selesai: 'badge-done', 
    Dibatalkan: 'badge-cancel' 
  };
  return <span className={`badge ${map[s] || 'badge-pending'}`}>{s || 'Pending'}</span>;
};

export default function DashboardPage() {
  const context = useApp() || {};
  const services = context.services || [];
  const orders = context.orders || [];
  const classes = context.classes || [];
  const navigate = useNavigate();

  const pending = orders.filter((o) => o?.status === 'Pending').length;
  const done    = orders.filter((o) => o?.status === 'Selesai').length;

  const stats = [
    {
      num: services.length, 
      lbl: 'Total Layanan',
      icon: <Scissors size={24} color="#07090f" />,
      bg: 'linear-gradient(135deg, #d4a843, #b38728)',
      path: '/admin/services',
    },
    {
      num: classes.length, 
      lbl: 'Total Kelas',
      icon: <GraduationCap size={24} color="#07090f" />,
      bg: 'linear-gradient(135deg, #c97b8f, #a0506a)',
      path: '/admin/classes',
    },
    {
      num: orders.length, 
      lbl: 'Total Pesanan',
      icon: <ClipboardList size={24} color="#fff" />,
      bg: 'linear-gradient(135deg, #9baee6, #6a7dbf)',
      path: '/admin/orders',
    },
    {
      num: pending, 
      lbl: 'Pesanan Pending',
      icon: <Clock size={24} color="#07090f" />,
      bg: 'linear-gradient(135deg, #f0a040, #c07820)',
      path: '/admin/orders',
    },
    {
      num: done, 
      lbl: 'Pesanan Selesai',
      icon: <CheckCircle size={24} color="#fff" />,
      bg: 'linear-gradient(135deg, #4caf7d, #2e8a58)',
      path: '/admin/orders',
    },
  ];

  const recentOrders = [...orders].reverse().slice(0, 6);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '3.5rem' }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif", 
          fontSize: '3rem',
          color: '#ffffff',
          fontWeight: 700, 
          marginBottom: '0.5rem',
        }}>
          Selamat Datang! 👑
        </h1>
        <p style={{ color: '#8a94a6', fontSize: '1.2rem' }}>
          Kelola semua layanan, kelas, dan pesanan Norma Rias dari sini.
        </p>
      </div>

      {/* Grid Statistik */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {stats.map((s) => (
          <div 
            key={s.lbl} 
            onClick={() => navigate(s.path)}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '1.2rem',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.2rem',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
          >
            <div style={{ 
              background: s.bg, 
              padding: '1rem', 
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{s.num}</div>
              <div style={{ fontSize: '0.9rem', color: '#8a94a6' }}>{s.lbl}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pesanan Terbaru */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '1.5rem',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.3rem' }}>Pesanan Terbaru</h2>
            <p style={{ color: '#8a94a6', fontSize: '0.9rem' }}>6 pesanan terakhir yang masuk</p>
          </div>
          <button 
            onClick={() => navigate('/admin/orders')}
            style={{
              background: 'transparent',
              border: '1px solid #d4a843',
              color: '#d4a843',
              padding: '0.5rem 1rem',
              borderRadius: '0.6rem',
              cursor: 'pointer'
            }}
          >
            Lihat Semua
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#8a94a6', padding: '2rem' }}>
            Belum ada pesanan masuk.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#8a94a6' }}>
                  <th style={{ padding: '1rem' }}>Nama</th>
                  <th style={{ padding: '1rem' }}>Layanan</th>
                  <th style={{ padding: '1rem' }}>Tanggal Acara</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id || Math.random()} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{o.name || o.customer_name || '—'}</td>
                    <td style={{ padding: '1rem', color: '#8a94a6' }}>{o.service || o.service_title || '—'}</td>
                    <td style={{ padding: '1rem', color: '#8a94a6' }}>{o.date || o.event_date || '—'}</td>
                    <td style={{ padding: '1rem' }}>{statusBadge(o.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}