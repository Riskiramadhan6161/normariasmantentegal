import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, Scissors, ClipboardList,
  GraduationCap, Settings, LogOut, Home, ChevronRight,
} from 'lucide-react';
import { useEffect } from 'react';

const navGroups = [
  {
    label: 'Menu',
    items: [
      { path: '/admin/dashboard', icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
    ],
  },
  {
    label: 'Kelola Konten',
    items: [
      { path: '/admin/services',  icon: <Scissors size={17} />,       label: 'Manajemen Layanan' },
      { path: '/admin/classes',   icon: <GraduationCap size={17} />,  label: 'Manajemen Kelas' },
      { path: '/admin/orders',    icon: <ClipboardList size={17} />,  label: 'Manajemen Pesanan' },
    ],
  },
  {
    label: 'Pengaturan',
    items: [
      { path: '/admin/settings',  icon: <Settings size={17} />,       label: 'WhatsApp & Bisnis' },
    ],
  },
];

export default function AdminLayout() {
  const { isAdmin, loading, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Jika tidak loading dan user belum login ke Supabase, redirect ke halaman login
    if (!loading && !isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, loading, navigate]);

  // Tampilkan loading sebentar selagi Supabase mengecek token session
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0d18',
        color: '#d4a843',
        fontSize: '1.6rem',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        Memuat Panel Admin...
      </div>
    );
  }

  if (!isAdmin) return null;

  const handleLogout = async () => { 
    await logout(); 
    navigate('/admin/login'); 
  };

  const allItems = navGroups.flatMap((g) => g.items);
  const currentNav = allItems.find((n) => location.pathname === n.path);

  return (
    <div className="admin-layout">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <div className="admin-sidebar-brand">Norma<span>Rias</span></div>
          <div className="admin-sidebar-tag">✦ Admin Panel</div>
        </div>

        <nav className="admin-nav">
          {navGroups.map((group) => (
            <div key={group.label}>
              <div className="admin-nav-section">{group.label}</div>
              {group.items.map((item) => (
                <button
                  key={item.path}
                  className={`admin-nav-item${location.pathname === item.path ? ' active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          ))}

          <div className="admin-nav-sep" />

          <button className="admin-nav-item" onClick={() => navigate('/')}>
            <Home size={17} /> Lihat Website
          </button>
          <button
            className="admin-nav-item"
            onClick={handleLogout}
            style={{ color: 'var(--danger)' }}
          >
            <LogOut size={17} /> Keluar
          </button>
        </nav>
      </aside>

      {/* ── Main ── */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-breadcrumb">
            <span className="admin-breadcrumb-root">Admin</span>
            <ChevronRight size={14} color="var(--text-muted)" />
            <span className="admin-breadcrumb-cur">{currentNav?.label || '—'}</span>
          </div>
          <button className="btn btn-sm btn-ghost" onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LogOut size={14} /> Keluar
          </button>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}