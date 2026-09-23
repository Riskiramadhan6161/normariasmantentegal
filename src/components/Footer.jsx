import React from 'react';

const INSTAGRAM_URL = "https://www.instagram.com/normanorma81/";
const WHATSAPP_URL = "https://wa.me/62895379178780";

const InstagramIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const WhatsAppIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-card, #0f172a)', padding: '5rem 6% 3rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
        
        {/* Kolom 1: Brand */}
        <div>
          <h3 style={{ fontSize: '2rem', fontFamily: 'serif', color: 'var(--text)' }}>
            Norma<span style={{ color: 'var(--gold, #d4af37)' }}>Rias</span>
          </h3>
          <p style={{ fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold, #d4af37)', marginTop: '0.5rem' }}>
            Professional Makeup Artist
          </p>
          <p style={{ marginTop: '1.5rem', opacity: 0.8, lineHeight: 1.6 }}>
            Hadir untuk menyempurnakan penampilan kamu di setiap momen istimewa. Kepuasan klien adalah prioritas kami.
          </p>
        </div>

        {/* Kolom 2: Menu Cepat */}
        <div>
          <h4 style={{ fontSize: '1.2rem', color: 'var(--gold, #d4af37)', marginBottom: '1.5rem' }}>Menu Cepat</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <li><a href="#home" style={{ color: 'inherit', textDecoration: 'none' }}>Home</a></li>
            <li><a href="#about" style={{ color: 'inherit', textDecoration: 'none' }}>Tentang Kami</a></li>
            <li><a href="#services" style={{ color: 'inherit', textDecoration: 'none' }}>Layanan</a></li>
            <li><a href="#classes" style={{ color: 'inherit', textDecoration: 'none' }}>Kelas</a></li>
            <li><a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>Kontak</a></li>
          </ul>
        </div>

        {/* Kolom 3: Hubungi Kami */}
        <div>
          <h4 style={{ fontSize: '1.2rem', color: 'var(--gold, #d4af37)', marginBottom: '1.5rem' }}>Hubungi Kami</h4>
          <p style={{ marginBottom: '0.5rem', lineHeight: 1.5 }}>
            Jln Mbah Buka RT 04 / RW 01, Kabukan Tengah<br />
            Kec. Tarub, Kab. Tegal<br />
            <em style={{ color: 'var(--gold, #d4af37)', fontSize: '0.9rem' }}>(100m dari SD Kabukan 01)</em>
          </p>
          <p style={{ marginTop: '1rem', fontWeight: 600 }}>+62895379178780</p>

          {/* Tombol Sosial Media */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <a 
              href={WHATSAPP_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                border: '1px solid rgba(0, 200, 83, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#25D366',
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <WhatsAppIcon size={20} />
            </a>

            <a 
              href={INSTAGRAM_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Instagram"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                border: '1px solid rgba(225, 48, 108, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E1306C',
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <InstagramIcon size={20} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}