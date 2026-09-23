import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, Phone, Calendar, MessageSquare, MessageCircle } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

export default function ContactSection() {
  const { services, addOrder, sendWhatsApp } = useApp();
  useReveal();

  const [form, setForm] = useState({
    name: '', email: '', phone: '', service: '', date: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.service) return;

    setLoading(true);

    try {
      // 1. Simpan pesanan ke database Supabase via addOrder
      if (typeof addOrder === 'function') {
        await addOrder(form);
      }

      // 2. Langsung buka WhatsApp
      if (typeof sendWhatsApp === 'function') {
        sendWhatsApp(form);
      }

      // 3. Ubah tampilan ke status berhasil
      setSubmitted(true);
    } catch (error) {
      console.error("Gagal mengirim pesanan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setForm({ name: '', email: '', phone: '', service: '', date: '', message: '' });
  };

  return (
    <section className="contact" id="contact">
      <div className="contact-inner">
        <h2 className="section-title reveal"><span>Kontak</span> & Pesan</h2>
        <div className="gold-divider reveal">
          <span className="gold-divider-icon">✦</span>
        </div>
        <p className="section-sub reveal" style={{ marginTop: '-3rem' }}>
          Isi form di bawah ini — pesanan kamu langsung terkirim ke WhatsApp kami secara otomatis.
        </p>

        <div className="contact-row reveal">
          <iframe
            className="contact-map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.651768007041!2d109.15474117475715!3d-6.9321593930677325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6fb9a9c44163df%3A0xa74784a13c411d46!2sNorma%20Rias!5e0!3m2!1sid!2sid!4v1790151544636!5m2!1sid!2sid"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Norma Rias"
          />

          <div className="contact-form-wrap">
            {submitted ? (
              <div className="contact-success">
                <div className="contact-success-icon">
                  <MessageCircle size={36} />
                </div>
                <h3>Pesanan Terkirim! 🎉</h3>
                <p>
                  Terima kasih <strong style={{ color: 'var(--text)' }}>{form.name}</strong>!
                  Pesanan telah tersimpan dan WhatsApp sudah terbuka otomatis. Jika belum, klik tombol di bawah.
                </p>
                <button
                  className="btn-wa"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => sendWhatsApp(form)}
                >
                  <MessageCircle size={18} /> Buka WhatsApp
                </button>
                <button
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                  onClick={handleReset}
                >
                  Pesan Lagi
                </button>
              </div>
            ) : (
              <>
                <h3 className="contact-form-title">Form Pemesanan</h3>
                <p className="contact-form-sub">
                  Pesanan akan langsung terkirim ke WhatsApp kami secara otomatis.
                </p>
                <div className="wa-badge">
                  <MessageCircle size={15} />
                  Terhubung ke WhatsApp Pemilik
                </div>

                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">
                      <User size={11} style={{ display: 'inline', marginRight: '0.4rem' }} />
                      Nama Lengkap *
                    </label>
                    <input className="form-input" name="name" placeholder="Nama kamu" value={form.name} onChange={handleChange} required />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                    <div className="form-group">
                      <label className="form-label">
                        <Mail size={11} style={{ display: 'inline', marginRight: '0.4rem' }} />Email
                      </label>
                      <input className="form-input" type="email" name="email" placeholder="email@kamu.com" value={form.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        <Phone size={11} style={{ display: 'inline', marginRight: '0.4rem' }} />No. HP/WA *
                      </label>
                      <input className="form-input" name="phone" placeholder="08xxxxxxxxxx" value={form.phone} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Pilih Layanan *</label>
                    <select className="form-select" name="service" value={form.service} onChange={handleChange} required>
                      <option value="">-- Pilih layanan --</option>
                      {services && services.map((s) => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Calendar size={11} style={{ display: 'inline', marginRight: '0.4rem' }} />
                      Tanggal Acara
                    </label>
                    <input className="form-input" type="date" name="date" value={form.date} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <MessageSquare size={11} style={{ display: 'inline', marginRight: '0.4rem' }} />
                      Pesan Tambahan
                    </label>
                    <textarea className="form-textarea" name="message" placeholder="Ceritakan keinginan kamu..." value={form.message} onChange={handleChange} rows={3} />
                  </div>

                  <button type="submit" className="btn-wa" disabled={loading}
                    style={{ width: '100%', justifyContent: 'center', padding: '1.3rem' }}>
                    {loading ? 'Menyimpan...' : (<><MessageCircle size={18} /> Kirim via WhatsApp</>)}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}