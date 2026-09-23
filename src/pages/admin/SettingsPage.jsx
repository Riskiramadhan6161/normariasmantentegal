import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Phone, Save, MessageCircle, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings } = useApp();
  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const testWa = () => {
    const num = form.waNumber.replace(/\D/g, '');
    const msg = `Halo ${form.businessName}! Saya ingin bertanya mengenai layanan rias pengantin.`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      {saved && (
        <div className="toast toast-success" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <CheckCircle size={18} /> Pengaturan berhasil disimpan!
        </div>
      )}

      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '3.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          Pengaturan
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.4rem' }}>
          Konfigurasi nomor WhatsApp dan info bisnis kamu.
        </p>
      </div>

      <form onSubmit={handleSave}>
        <div className="settings-grid">
          {/* WA Settings */}
          <div className="settings-card">
            <h3 className="settings-card-title">
              <MessageCircle size={20} style={{ display: 'inline', marginRight: '0.8rem', color: '#25d366', verticalAlign: 'middle' }} />
              Integrasi WhatsApp
            </h3>
            <p className="settings-card-sub">
              Setiap pesanan dan pendaftaran kelas akan otomatis dikirim ke nomor WhatsApp ini.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
              <div className="form-group">
                <label className="form-label">Nomor WhatsApp Pemilik</label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: '1.4rem', top: '50%', transform: 'translateY(-50%)',
                    color: '#25d366', fontSize: '1.4rem', fontWeight: 600,
                  }}>+</span>
                  <input
                    className="form-input"
                    style={{ paddingLeft: '3rem' }}
                    value={form.waNumber}
                    onChange={(e) => setForm({ ...form, waNumber: e.target.value })}
                    placeholder="628xxxxxxxxxx"
                  />
                </div>
                <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                  Format internasional tanpa +, contoh: 628123456789
                </span>
              </div>

              {form.waNumber && (
                <div className="wa-preview">
                  <div className="wa-preview-label">✓ Nomor Aktif</div>
                  <div className="wa-preview-num">+{form.waNumber.replace(/\D/g, '')}</div>
                </div>
              )}

              <button
                type="button"
                className="btn-wa"
                onClick={testWa}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <MessageCircle size={16} /> Test WhatsApp Sekarang
              </button>
            </div>
          </div>

          {/* Business Info */}
          <div className="settings-card">
            <h3 className="settings-card-title">
              <Phone size={20} style={{ display: 'inline', marginRight: '0.8rem', color: 'var(--gold)', verticalAlign: 'middle' }} />
              Info Bisnis
            </h3>
            <p className="settings-card-sub">
              Nama bisnis yang akan tampil di pesan WhatsApp yang dikirimkan ke kamu.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
              <div className="form-group">
                <label className="form-label">Nama Bisnis</label>
                <input
                  className="form-input"
                  value={form.businessName}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  placeholder="Norma Rias"
                />
              </div>

              {/* Preview WA Message */}
              <div style={{
                background: 'rgba(37,211,102,0.05)', border: '1px solid rgba(37,211,102,0.15)',
                borderRadius: 'var(--radius)', padding: '2rem',
              }}>
                <div style={{ fontSize: '1.2rem', color: '#25d366', fontWeight: 600, marginBottom: '1.2rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Preview Pesan WA
                </div>
                <pre style={{
                  fontFamily: 'Poppins, sans-serif', fontSize: '1.3rem', color: 'var(--text-soft)',
                  lineHeight: 1.8, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>
{`🌸 *Pesanan Baru — ${form.businessName || 'Nama Bisnis'}* 🌸

👤 *Nama:* Nama Pelanggan
📧 *Email:* email@pelanggan.com
📱 *HP/WA:* 08xxxxxxxxxx
💄 *Layanan:* Jawa Tengah MakeUp
📅 *Tanggal:* 2026-08-17

_Dikirim via website ${form.businessName || 'Nama Bisnis'}_`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '1.3rem 4rem', fontSize: '1.5rem' }}>
            <Save size={18} /> Simpan Pengaturan
          </button>
        </div>
      </form>
    </div>
  );
}
