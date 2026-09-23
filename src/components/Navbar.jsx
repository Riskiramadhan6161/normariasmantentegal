import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const navLinks = [
    { href: '#home',    label: 'Home' },
    { href: '#about',   label: 'Tentang Kami' },
    { href: '#gallery', label: 'Galeri' },
    { href: '#services',label: 'Layanan' },
    { href: '#classes', label: 'Kelas' },
    { href: '#reviews', label: 'Ulasan' },
    { href: '#contact', label: 'Kontak' },
  ];

  const handleNavClick = (href) => {
    setMenuOpen(false);
    // small timeout lets the mobile menu close first
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <a
        href="#home"
        className="navbar-logo"
        onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
      >
        Norma<span>Rias</span>
      </a>

      <div className={`navbar-nav${menuOpen ? ' open' : ''}`}>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={location.hash === link.href ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="navbar-extra">
        <Link to="/admin" className="navbar-admin-btn">
          <Settings size={14} />
          Admin
        </Link>
        <button
          className="hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </nav>
  );
}
