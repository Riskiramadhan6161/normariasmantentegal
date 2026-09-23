import React from 'react';
import { useStaggerReveal } from '../hooks/useReveal';

const InstagramIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

// Link Profil Instagram resmi
const INSTAGRAM_URL = "https://www.instagram.com/normanorma81/";

const galleryImages = [
  {
    img: '/img/ig1.jpeg',
    link: 'https://www.instagram.com/p/DC8pB8MTYDU/?stkn=MW9iNWY5dng5ZWh2MQ=='
  },
  {
    img: '/img/ig2.jpeg',
    link: 'https://www.instagram.com/p/DEwCdJwSHpK/?stkn=ZWo0ZjF0N21lMjAz'
  },
  {
    img: '/img/ig3.jpeg',
    link: 'https://www.instagram.com/p/DE3whblytIG/?stkn=eG1keHI5emszdWdj'
  },
  {
    img: '/img/ig4.jpeg',
    link: 'https://www.instagram.com/p/DMpwaAyzlrX/?stkn=NzFjZXp6a3ptOHIy'
  },
  {
    img: '/img/ig5.jpeg',
    link: 'https://www.instagram.com/p/DPyd68EkvIY/?stkn=ZGUxcHVjcGJhN2Jh'
  },
  {
    img: '/img/ig6.jpeg',
    link: 'https://www.instagram.com/p/DQLAKrGkv2D/?stkn=Y2RieDBsOHk2eXZn'
  },
  {
    img: '/img/ig7.jpeg',
    link: 'https://www.instagram.com/p/Dasr75vJnZY/?stkn=MXUwYzBmZHJpc2ZwbQ=='
  },
  {
    img : '/img/ig8.jpeg',
    link : 'https://www.instagram.com/p/Dcca6VVJq8P/?stkn=MTUzbmFpcjZ0dzYwMg=='
  },
];

export default function GallerySection() {
  useStaggerReveal([galleryImages]);

  return (
    <section className="gallery" id="gallery" style={{ padding: '10rem 6%', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        <h2 className="section-title reveal">Hasil <span>Karya</span></h2>
        <div className="gold-divider reveal">
          <span className="gold-divider-icon">✦</span>
        </div>
        <p className="section-sub reveal" style={{ marginTop: '-3rem' }}>
          Sentuhan magis di setiap wajah. Jelajahi portofolio riasan kami yang telah
          menjadi bagian dari momen bahagia para klien.
        </p>

        <div className="gallery-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(30rem, 1fr))',
          gap: '2rem',
          marginTop: '4rem'
        }}>
          {galleryImages.map((item, idx) => (
            <a 
              key={idx} 
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="gallery-item reveal reveal-stagger"
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                aspectRatio: idx % 3 === 0 ? '4/5' : '1/1',
                border: '1px solid var(--glass-border)',
                display: 'block',
                cursor: 'pointer'
              }}
            >
              <img 
                src={item.img} 
                alt={`Makeup Karya Norma Rias ${idx + 1}`} 
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.6s ease',
                  transform: 'translateZ(0)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateZ(0)'}
              />
              <div 
                className="gallery-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(7,9,15,0.85), rgba(7,9,15,0.2) 60%, transparent)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '2rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--gold)' }}>
                  <InstagramIcon size={20} />
                  <span style={{ fontSize: '1.4rem', fontWeight: 600, letterSpacing: '0.05em' }}>@normanorma81 ↗</span>
                </div>
              </div>
            </a>
          ))}
        </div>
        
        <div className="reveal" style={{ textAlign: 'center', marginTop: '5rem' }}>
          <a 
            href={INSTAGRAM_URL} 
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline" 
            style={{ borderRadius: '99px', padding: '1.2rem 3rem', display: 'inline-flex', alignItems: 'center', gap: '0.8rem' }}
          >
            <InstagramIcon size={16} /> Lihat Lebih Banyak di Instagram @normanorma81
          </a>
        </div>
      </div>
    </section>
  );
}