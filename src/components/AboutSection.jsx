import { CheckCircle, Sparkles } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

const features = [
  'Pengalaman lebih dari 10 tahun di bidang rias pengantin',
  'Menggunakan produk makeup premium & tahan lama seharian',
  'Riasan disesuaikan dengan kepribadian & tema pernikahan',
  'Tersedia layanan on-site ke lokasi acara kamu',
];

export default function AboutSection() {
  useReveal();

  return (
    <section className="about" id="about">
      <div className="about-row">
        {/* Image */}
        <div className="about-img-wrap reveal reveal-left">
          <div className="about-accent-box" />
          <div className="about-img-frame">
            <img
              src="/img/norma.jpg"
              alt="Norma — MUA Profesional"
              loading="lazy"
            />
          </div>
          <div className="about-badge">
            <span className="about-badge-num">10+</span>
            <span className="about-badge-lbl">Tahun<br />Pengalaman</span>
          </div>
        </div>

        {/* Text */}
        <div className="about-text reveal reveal-right">
          <div className="about-tag">
            <Sparkles size={14} />
            Tentang Kami
          </div>
          <h2>
            Kenapa Memilih<br />
            <em>Norma Rias?</em>
          </h2>
          <p>
            Sebagai Makeup Artist profesional, saya Norma mengkhususkan diri dalam
            menciptakan penampilan sempurna yang sesuai dengan gaya dan kepribadian
            unik kamu — untuk pernikahan, wisuda, foto profesional, dan acara istimewa.
          </p>
          <p>
            Dengan sentuhan artistik dan dedikasi penuh, setiap klien tampil percaya
            diri dan memesona di momen terpenting mereka.
          </p>

          <div className="about-features">
            {features.map((f, i) => (
              <div key={i} className="about-feature">
                <div className="about-feature-icon">
                  <CheckCircle size={16} />
                </div>
                <span className="about-feature-text">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
