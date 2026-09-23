import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, MessageCircle, X, User, Loader2 } from 'lucide-react';
import { useStaggerReveal } from '../hooks/useReveal';

export default function ReviewsSection() {
  const { reviews, addReview, services } = useApp();
  useStaggerReveal([reviews]);

  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', service: '', rating: 5, comment: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.comment) return;

    setIsSubmitting(true);

    // Kirim data ulasan ke Supabase lewat AppContext
    const res = await addReview(form);

    setIsSubmitting(false);

    if (res?.success) {
      setSubmitted(true);
      setTimeout(() => {
        setModal(false);
        setSubmitted(false);
        setForm({ name: '', service: '', rating: 5, comment: '' });
      }, 2500);
    } else {
      alert('Gagal mengirim ulasan: ' + (res?.error || 'Terjadi kesalahan pada server'));
    }
  };

  return (
    <section className="reviews" id="reviews" style={{ padding: '10rem 6%', background: 'var(--bg-2)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', marginBottom: '4rem' }}>
          <div>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1rem' }}>Kata <span>Mereka</span></h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.4rem' }}>Cerita bahagia klien Norma Rias.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setModal(true)}>
            <Star size={16} fill="currentColor" /> Beri Ulasan
          </button>
        </div>

        {reviews.length === 0 ? (
          <p className="reveal" style={{ color: 'var(--text-muted)', fontSize: '1.4rem', textAlign: 'center', padding: '4rem 0' }}>
            Belum ada ulasan. Jadilah yang pertama memberikan ulasan!
          </p>
        ) : (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(32rem, 1fr))', gap: '2.5rem'
          }}>
            {reviews.map((r) => (
              <div key={r.id} className="reveal reveal-stagger" style={{
                background: 'var(--glass)', border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg)', padding: '2.5rem',
                display: 'flex', flexDirection: 'column', gap: '1.5rem',
                transition: 'transform 0.3s ease', transform: 'translateZ(0)'
              }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateZ(0)'}>
                <div style={{ display: 'flex', gap: '0.4rem', color: 'var(--gold)' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < r.rating ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <p style={{ color: 'var(--text-soft)', fontSize: '1.35rem', lineHeight: 1.8, fontStyle: 'italic', flex: 1 }}>
                  "{r.comment || r.komentar}"
                </p>
                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                  <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: 'var(--gold-glow)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 600 }}>
                    {(r.name || r.nama || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text)' }}>{r.name || r.nama}</div>
                    <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>{r.service || r.role || 'Pelanggan'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => !isSubmitting && setModal(false)}>
          <div className="modal" style={{ maxWidth: '50rem' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Beri Ulasan</h2>
              <button className="modal-close" onClick={() => !isSubmitting && setModal(false)}><X size={18} /></button>
            </div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '8rem', height: '8rem', borderRadius: '50%', background: 'rgba(212,168,67,0.1)', color: 'var(--gold)', marginBottom: '2rem' }}>
                  <Star size={36} fill="currentColor" />
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.6rem', fontWeight: 700, marginBottom: '1rem' }}>Terima Kasih!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.4rem' }}>Ulasan kamu sangat berarti bagi kami.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                <div className="form-group">
                  <label className="form-label">Nama Kamu *</label>
                  <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama lengkap" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Layanan yang dipesan</label>
                  <select className="form-select" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
                    <option value="">-- Bebas / Tidak spesifik --</option>
                    {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Rating *</label>
                  <div style={{ display: 'flex', gap: '1rem', color: 'var(--gold)' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button type="button" key={star} onClick={() => setForm({ ...form, rating: star })} style={{ background: 'none', color: 'inherit', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        <Star size={28} fill={form.rating >= star ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Ulasan / Komentar *</label>
                  <textarea className="form-textarea" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Ceritakan pengalaman kamu bersama Norma Rias..." required rows={4} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ marginTop: '1rem', padding: '1.4rem', justifyContent: 'center', opacity: isSubmitting ? 0.7 : 1 }}>
                  {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}