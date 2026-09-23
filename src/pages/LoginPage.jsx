import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../lib/supabase";
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.user) {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Gagal masuk. Periksa email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0d18 0%, #161b2e 100%)',
      padding: '2rem',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(212, 168, 67, 0.2)',
        borderRadius: '2rem',
        padding: '3.5rem 3rem',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Header Logo */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(212, 168, 67, 0.1)',
            border: '1px solid #d4a843',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: '#d4a843'
          }}>
            <ShieldCheck size={28} />
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2.6rem',
            color: '#ffffff',
            marginBottom: '0.6rem',
            fontWeight: 600
          }}>
            Norma<span style={{ color: '#d4a843' }}>Rias</span>
          </h1>
          <p style={{ color: '#8a94a6', fontSize: '1.3rem' }}>
            Masuk ke Panel Admin
          </p>
        </div>

        {/* Notifikasi Error */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            color: '#fca5a5',
            padding: '1rem 1.2rem',
            borderRadius: '0.8rem',
            fontSize: '1.2rem',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            {errorMsg}
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
          <div>
            <label style={{
              display: 'block',
              color: '#d1d5db',
              fontSize: '1.2rem',
              marginBottom: '0.6rem',
              fontWeight: 500
            }}>Email Admin</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{
                position: 'absolute',
                left: '1.4rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6b7280'
              }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@normarias.com"
                required
                style={{
                  width: '100%',
                  padding: '1.2rem 1.4rem 1.2rem 4.2rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '1rem',
                  color: '#ffffff',
                  fontSize: '1.4rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              color: '#d1d5db',
              fontSize: '1.2rem',
              marginBottom: '0.6rem',
              fontWeight: 500
            }}>Kata Sandi</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{
                position: 'absolute',
                left: '1.4rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6b7280'
              }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '1.2rem 1.4rem 1.2rem 4.2rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '1rem',
                  color: '#ffffff',
                  fontSize: '1.4rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '1rem',
              padding: '1.3rem',
              background: 'linear-gradient(135deg, #d4a843 0%, #b38728 100%)',
              border: 'none',
              borderRadius: '1rem',
              color: '#0a0d18',
              fontWeight: 700,
              fontSize: '1.4rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.8rem',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Memproses...' : (
              <>
                Masuk ke Admin <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button 
            onClick={() => navigate('/')} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#8a94a6', 
              fontSize: '1.2rem', 
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            ← Kembali ke Website Utama
          </button>
        </div>
      </div>
    </div>
  );
}