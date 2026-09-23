import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Trash2, X, ClipboardList, ChevronDown } from 'lucide-react';

const STATUSES = ['Semua', 'Pending', 'Diproses', 'Selesai', 'Dibatalkan'];
const STATUS_OPTIONS = ['Pending', 'Diproses', 'Selesai', 'Dibatalkan'];

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    return iso;
  }
}

export default function OrdersAdminPage() {
  const context = useApp() || {};
  const orders = context.orders || [];
  const updateOrderStatus = context.updateOrderStatus || (() => {});
  const deleteOrder = context.deleteOrder || (() => {});

  const [filter, setFilter] = useState('Semua');
  const [delConfirm, setDelConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = filter === 'Semua' 
    ? orders 
    : orders.filter((o) => (o?.status || 'Pending') === filter);

  const sorted = [...filtered].reverse();

  const handleStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      await updateOrderStatus(id, status);
      showToast(`Status berhasil diperbarui ke "${status}"`);
    } catch (err) {
      showToast('Gagal memperbarui status pesanan.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      setDelConfirm(null);
      showToast('Pesanan berhasil dihapus!', 'error');
    } catch (err) {
      showToast('Gagal menghapus pesanan.', 'error');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      {toast && (
        <div style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          zIndex: 9999,
          background: toast.type === 'error' ? '#ef4444' : '#10b981',
          color: '#ffffff',
          padding: '1rem 1.8rem',
          borderRadius: '0.8rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          fontWeight: 600,
          fontSize: '1.2rem'
        }}>
          {toast.msg}
        </div>
      )}

      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', color: '#fff', marginBottom: '0.4rem' }}>
          Manajemen Pesanan
        </h1>
        <p style={{ color: '#8a94a6', fontSize: '1.4rem' }}>
          {orders.length} total pesanan masuk
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        {STATUSES.map((s) => {
          const count = s === 'Semua' 
            ? orders.length 
            : orders.filter((o) => (o?.status || 'Pending') === s).length;

          const isActive = filter === s;

          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '0.6rem 1.4rem',
                borderRadius: '0.8rem',
                border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
                background: isActive ? 'linear-gradient(135deg, #d4a843 0%, #b38728 100%)' : 'rgba(255, 255, 255, 0.05)',
                color: isActive ? '#000000' : '#ffffff',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
            >
              {s}
              <span style={{
                background: isActive ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)',
                borderRadius: '99px',
                padding: '0.1rem 0.6rem',
                fontSize: '1.1rem',
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tabel Pesanan */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '1.5rem',
        padding: '1.5rem',
        overflow: 'hidden'
      }}>
        {sorted.length === 0 ? (
          <div style={{ padding: '5rem', textAlign: 'center' }}>
            <ClipboardList size={48} color="#8a94a6" style={{ margin: '0 auto 1.5rem', display: 'block' }} />
            <p style={{ color: '#8a94a6', fontSize: '1.5rem' }}>
              {filter === 'Semua' ? 'Belum ada pesanan masuk.' : `Tidak ada pesanan dengan status "${filter}".`}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ffffff', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#8a94a6' }}>
                  <th style={{ padding: '1rem' }}>#</th>
                  <th style={{ padding: '1rem' }}>Pelanggan</th>
                  <th style={{ padding: '1rem' }}>Kontak</th>
                  <th style={{ padding: '1rem' }}>Layanan</th>
                  <th style={{ padding: '1rem' }}>Tgl Acara</th>
                  <th style={{ padding: '1rem' }}>Dipesan</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((o, idx) => {
                  const name = o?.name || o?.customer_name || 'Tanpa Nama';
                  const email = o?.email || '—';
                  const phone = o?.phone || '—';
                  const service = o?.service || o?.service_title || '—';
                  const date = o?.date || o?.event_date || '—';
                  const createdAt = o?.createdAt || o?.created_at;
                  const currentStatus = o?.status || 'Pending';

                  return (
                    <tr key={o?.id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '1rem', color: '#8a94a6', fontSize: '1.2rem' }}>
                        {sorted.length - idx}
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 600 }}>{name}</td>
                      <td style={{ padding: '1rem', color: '#8a94a6', fontSize: '1.2rem' }}>
                        <div>{email}</div>
                        <div style={{ color: '#d4a843' }}>{phone}</div>
                      </td>
                      <td style={{ padding: '1rem', color: '#d4a843', fontWeight: 500 }}>{service}</td>
                      <td style={{ padding: '1rem', color: '#8a94a6' }}>{date}</td>
                      <td style={{ padding: '1rem', color: '#8a94a6', fontSize: '1.2rem' }}>{formatDate(createdAt)}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <select
                            disabled={updatingId === o?.id}
                            value={currentStatus}
                            onChange={(e) => handleStatus(o?.id, e.target.value)}
                            style={{
                              padding: '0.5rem 2.5rem 0.5rem 1rem',
                              fontSize: '1.2rem',
                              borderRadius: '0.6rem',
                              background: 'rgba(0, 0, 0, 0.4)',
                              border: '1px solid',
                              borderColor: 
                                currentStatus === 'Pending' ? '#f0a040' :
                                currentStatus === 'Diproses' ? '#8399e6' :
                                currentStatus === 'Selesai' ? '#4caf7d' : '#e05252',
                              color: 
                                currentStatus === 'Pending' ? '#f0a040' :
                                currentStatus === 'Diproses' ? '#8399e6' :
                                currentStatus === 'Selesai' ? '#4caf7d' : '#e05252',
                              appearance: 'none',
                              cursor: 'pointer',
                              outline: 'none'
                            }}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s} style={{ background: '#161b2e', color: '#ffffff' }}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={12} style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#8a94a6' }} />
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <button
                          onClick={() => setDelConfirm(o)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid #ef4444',
                            color: '#ef4444',
                            padding: '0.6rem',
                            borderRadius: '0.6rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Hapus Pesanan"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm Delete Modal */}
      {delConfirm && (
        <div 
          onClick={() => setDelConfirm(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#161b2e',
              border: '1px solid rgba(212, 168, 67, 0.3)',
              borderRadius: '1.5rem',
              padding: '2.5rem',
              maxWidth: '400px',
              width: '100%'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.8rem', color: '#fff' }}>Hapus Pesanan?</h2>
              <button onClick={() => setDelConfirm(null)} style={{ background: 'none', border: 'none', color: '#8a94a6', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <p style={{ color: '#8a94a6', fontSize: '1.3rem', marginBottom: '2rem' }}>
              Hapus pesanan dari <strong style={{ color: '#fff' }}>{delConfirm?.name || delConfirm?.customer_name || 'Pelanggan'}</strong> untuk layanan{' '}
              <strong style={{ color: '#d4a843' }}>{delConfirm?.service || delConfirm?.service_title || 'Layanan'}</strong>?
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setDelConfirm(null)}
                style={{
                  padding: '0.8rem 1.5rem',
                  borderRadius: '0.8rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'transparent',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                Batal
              </button>
              <button 
                onClick={() => handleDelete(delConfirm.id)}
                style={{
                  padding: '0.8rem 1.5rem',
                  borderRadius: '0.8rem',
                  border: 'none',
                  background: '#ef4444',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Trash2 size={16} /> Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}