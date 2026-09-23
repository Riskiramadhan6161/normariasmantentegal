import { useApp } from '../context/AppContext';
import { useStaggerReveal } from '../hooks/useReveal';

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(price);
}

export default function ServicesSection() {
  const { services } = useApp();
  useStaggerReveal([services]);

  const scrollToContact = () =>
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <section className="services" id="services">
      <div className="services-inner">
        <h2 className="section-title reveal">Layanan <span>Kami</span></h2>
        <div className="gold-divider reveal">
          <span className="gold-divider-icon">✦</span>
        </div>
        <p className="section-sub reveal" style={{ marginTop: '-3rem' }}>
          Pilihan riasan terbaik untuk hari istimewa kamu. Setiap sentuhan dikerjakan
          dengan penuh cinta dan keahlian profesional.
        </p>

        {services.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.5rem', paddingTop: '4rem' }}>
            Belum ada layanan tersedia.
          </p>
        ) : (
          <div className="services-grid">
            {services.map((service) => (
              <div className="service-card reveal reveal-stagger" key={service.id}>
                <div className="service-card-img-wrap">
                  <img
                    className="service-card-img"
                    src={service.image}
                    alt={service.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/400x300/0c1020/d4a843?text=NormaRias';
                    }}
                  />
                  <div className="service-card-overlay" />
                  <span className="service-card-cat">{service.category}</span>
                </div>
                <div className="service-card-body">
                  <h3 className="service-card-title">{service.name}</h3>
                  <p className="service-card-desc">{service.description}</p>
                  <div className="service-card-footer">
                    <span className="service-card-price">{formatPrice(service.price)}</span>
                    <button className="service-book-btn" onClick={scrollToContact}>
                      Pesan
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
