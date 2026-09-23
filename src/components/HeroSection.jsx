import { Sparkles } from 'lucide-react';

export default function HeroSection() {
  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="hero" id="home">
      <div className="hero-overlay" />
      <div className="hero-fade-bottom" />

      <div className="hero-content">
        <div className="hero-text-wrap">
          <div className="hero-eyebrow reveal">
            <Sparkles size={14} />
            Professional Makeup Artist
          </div>

          <h1 className="reveal">
            Buat Cantik<br />
            Hari Bahagia <em>Kamu</em>
          </h1>

          <p className="reveal">
            Sebagai MUA profesional, Norma hadir untuk menciptakan penampilan
            sempurna di setiap momen spesial — pernikahan, wisuda, dan acara
            istimewa kamu.
          </p>

          <div className="hero-buttons reveal">
            <button className="btn btn-primary" onClick={() => scrollTo('#contact')}>
              Pesan Sekarang
            </button>
            <button className="btn btn-outline" onClick={() => scrollTo('#services')}>
              Lihat Layanan
            </button>
          </div>
        </div>
      </div>

      {/* Floating stats — desktop */}
      <div className="hero-stats">
        {[
          { num: '10+', lbl: 'Tahun Pengalaman' },
          { num: '500+', lbl: 'Klien Puas' },
          { num: '5★', lbl: 'Rating Klien' },
        ].map((s) => (
          <div key={s.lbl} className="hero-stat">
            <span className="hero-stat-num">{s.num}</span>
            <span className="hero-stat-lbl">{s.lbl}</span>
          </div>
        ))}
      </div>

      <div className="hero-scroll-indicator" onClick={() => scrollTo('#about')} style={{ cursor: 'pointer' }}>
        <span>Scroll</span>
        <div className="hero-scroll-line" />
      </div>
    </section>
  );
}
