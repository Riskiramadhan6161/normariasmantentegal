import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Users, Award, CheckCircle, MessageCircle, X, User, Phone, Mail } from 'lucide-react';
import { useStaggerReveal } from '../hooks/useReveal';

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(price || 0);
}

const levelStyle = {
  Pemula:   { background: 'rgba(76,175,125,0.2)',  color: '#4caf7d', border: '1px solid rgba(76,175,125,0.35)' },
  Menengah: { background: 'rgba(240,160,64,0.2)',  color: '#f0a040', border: '1px solid rgba(240,160,64,0.35)' },
  Lanjutan: { background: 'rgba(155,174,230,0.2)', color: '#9baee6', border: '1px solid rgba(155,174,230,0.35)' },
};

export default function ClassesSection() {
  // Ambil classes dan berikan nilai default [] agar tidak undefined
  const { classes = [], sendClassWhatsApp } = useApp() || {};
  useStaggerReveal([classes]);

  const [selectedClass, setSelectedClass] = useState(null);
  const [regForm, setRegForm] = useState({ name: '', phone: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const openModal = (cls) => {
    setSelectedClass(cls);
    setRegForm({ name: '', phone: '', email: '' });
    setSubmitted(false);
  };
  const closeModal = () => setSelectedClass(null);

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (sendClassWhatsApp) {
        sendClassWhatsApp(selectedClass, regForm);
      }
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <section className="classes" id="classes">
      <div className="classes-inner">
        <h2 className="section-title reveal">Kelas <span>Makeup</span></h2>
        <div className="gold-divider reveal">
          <span className="gold-divider-icon">✦</span>
        </div>
        <p className="section-sub reveal" style={{ marginTop: '-3rem' }}>
          Pelajari seni rias langsung dari MUA profesional. Kelas tersedia untuk semua
          level — dari pemula hingga yang ingin naik level ke profesional.
        </p>

        {(!classes || classes.length === 0) ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.5rem', paddingTop: '4rem' }}>
            Belum ada kelas tersedia.
          </p>
        ) : (
          <div className="classes-grid">
            {classes.map((cls) => {
              const lvl = levelStyle[cls.level] || levelStyle.Pemula;
              return (
                <div className="class-card reveal reveal-stagger" key={cls.id || cls.name}>
                  <div className="class-card-img-wrap">
                    <img
                      className="class-card-img"
                      src={cls.image}
                      alt={cls.name}
                      loading="lazy"
                      onError={(e) => { e.target.src = 'https://placehold.co/400x240/0c1020/d4a843?text=Kelas'; }}
                    />
                    <div className="class-card-img-overlay" />
                    <span className="class-card-level" style={lvl}>
                      <Award size={11} /> {cls.level}
                    </span>
                    <span className="class-card-price-overlay">{formatPrice(cls.price)}</span>
                  </div>

                  <div className="class-card-body">
                    <h3 className="class-card-title">{cls.name}</h3>
                    <p className="class-card-desc">{cls.description}</p>

                    <div className="class-card-meta">
                      <span className="class-card-meta-item">
                        <Clock size={14} /> {cls.duration}
                      </span>
                      <span className="class-card-meta-item">
                        <Users size={14} /> Maks. {cls.quota} orang
                      </span>
                    </div>

                    <div className="class-card-schedule">
                      📅 {cls.schedule}
                    </div>

                    {cls.includes && (
                      <div className="class-card-includes">
                        <CheckCircle size={13} />
                        <span>{cls.includes}</span>
                      </div>
                    )}

                    <div className="class-card-footer">
                      <span className="class-card-price">{formatPrice(cls.price)}</span>
                      <button className="btn-wa-sm" onClick={() => openModal(cls)}>
                        <MessageCircle size={14} /> Daftar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Registrasi Modal ── */}
      {selectedClass && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" style={{ maxWidth: '54rem' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Daftar Kelas</h2>
              <button className="modal-close" onClick={closeModal}><X size={18} /></button>
            </div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{
                  width: '8rem', height: '8rem', borderRadius: '50%',
                  background: 'rgba(37,211,102,0.1)', border: '2px solid rgba(37,211,102,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 2rem', color: '#25d366',
                }}>
                  <MessageCircle size={36} />
                </div>
                <h3 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '2.6rem', fontWeight: 700, marginBottom: '1rem' }}>
                  Berhasil! 🎉
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.4rem', lineHeight: '1.8', marginBottom: '2.5rem' }}>
                  WhatsApp telah terbuka otomatis. Pemilik akan segera menghubungi kamu untuk konfirmasi pendaftaran.
                </p>
                <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn-wa" onClick={() => sendClassWhatsApp && sendClassWhatsApp(selectedClass, regForm)}>
                    <MessageCircle size={16} /> Buka WhatsApp
                  </button>
                  <button className="btn btn-ghost" onClick={closeModal}>Tutup</button>
                </div>
              </div>
            ) : (
              <>
                {/* Class Preview */}
                <div style={{
                  background: 'rgba(212,168,67,0.05)', border: '1px solid rgba(212,168,67,0.15)',
                  borderRadius: 'var(--radius)', padding: '1.8rem', marginBottom: '2.5rem',
                }}>
                  <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '2rem', fontWeight: 700, marginBottom: '0.8rem' }}>
                    {selectedClass.name}
                  </div>
                  <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-muted)', fontSize: '1.3rem', flexWrap: 'wrap' }}>
                    <span><Clock size={13} style={{ display: 'inline', marginRight: '0.4rem' }} />{selectedClass.duration}</span>
                    <span>📅 {selectedClass.schedule}</span>
                    <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{formatPrice(selectedClass.price)}</span>
                  </div>
                </div>

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                  <div className="form-group">
                    <label className="form-label"><User size={12} style={{ display: 'inline', marginRight: '0.4rem' }} />Nama Lengkap *</label>
                    <input className="form-input" placeholder="Nama kamu" value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                    <div className="form-group">
                      <label className="form-label"><Phone size={12} style={{ display: 'inline', marginRight: '0.4rem' }} />No. HP/WA *</label>
                      <input className="form-input" placeholder="08xxxxxxxxxx" value={regForm.phone}
                        onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label"><Mail size={12} style={{ display: 'inline', marginRight: '0.4rem' }} />Email</label>
                      <input className="form-input" type="email" placeholder="email@kamu.com" value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} />
                    </div>
                  </div>
                  <button type="submit" className="btn-wa" disabled={loading}
                    style={{ width: '100%', justifyContent: 'center', padding: '1.3rem' }}>
                    {loading ? 'Mengirim...' : (<><MessageCircle size={18} /> Daftar via WhatsApp</>)}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}