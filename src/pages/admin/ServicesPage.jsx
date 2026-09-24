import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';

export default function ServicesAdminPage() {
  const context = useApp() || {};
  const services = context.services || [];
  const addService = context.addService || (async () => ({ success: false }));
  const updateService = context.updateService || (async () => ({ success: false }));
  const deleteService = context.deleteService || (async () => ({ success: false }));

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [delConfirm, setDelConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    level: 'Pemula',
    quota: '',
    duration: '',
    schedule: '',
    image: null,
    imageFileName: '',
    facilities: '',
    description: ''
  });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      price: '',
      level: 'Pemula',
      quota: '',
      duration: '',
      schedule: '',
      image: null,
      imageFileName: '',
      facilities: '',
      description: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (srv) => {
    setEditingId(srv.id);
    setFormData({
      name: srv.name || '',
      price: srv.price || '',
      level: srv.level || 'Pemula',
      quota: srv.quota || '',
      duration: srv.duration || '',
      schedule: srv.schedule || '',
      image: srv.image || null,
      imageFileName: srv.imageFileName || (srv.image ? 'Gambar_Tersimpan.png' : ''),
      facilities: srv.facilities || '',
      description: srv.description || ''
    });
    setShowModal(true);
  };

  // PERBAIKAN 1: Mengubah file gambar ke Base64 Data URL agar bisa dirender & disimpan secara permanen di state
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Ukuran file maksimal 5MB!', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result, // Menyimpan string Base64 yang valid untuk <img src="..." />
          imageFileName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      showToast('Nama kelas dan harga wajib diisi!', 'error');
      return;
    }

    setLoading(true);
    let res;
    if (editingId) {
      res = await updateService(editingId, formData);
    } else {
      res = await addService(formData);
    }
    setLoading(false);

    if (res?.success) {
      showToast(editingId ? 'Kelas berhasil diperbarui!' : 'Kelas berhasil ditambahkan!');
      setShowModal(false);
    } else {
      showToast(res?.error || 'Gagal menyimpan data.', 'error');
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    const res = await deleteService(id);
    setLoading(false);

    if (res?.success) {
      setDelConfirm(null);
      showToast('Kelas berhasil dihapus!');
    } else {
      showToast(res?.error || 'Gagal menghapus kelas.', 'error');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          zIndex: 9999,
          background: toast.type === 'error' ? '#ef4444' : '#10b981',
          color: '#ffffff',
          padding: '1rem 1.8rem',
          borderRadius: '0.8rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          fontWeight: 600,
          fontSize: '1.2rem'
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', color: '#fff', marginBottom: '0.4rem' }}>
            Manajemen Kelas / Layanan
          </h1>
          <p style={{ color: '#8a94a6', fontSize: '1.4rem' }}>
            {services.length} kelas terdaftar
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          style={{
            background: 'linear-gradient(135deg, #d4a843 0%, #b38728 100%)',
            color: '#000',
            border: 'none',
            padding: '1rem 1.8rem',
            borderRadius: '0.8rem',
            fontWeight: 700,
            fontSize: '1.3rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}
        >
          <Plus size={18} /> Tambah Kelas
        </button>
      </div>

      {/* Table Data */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '1.5rem',
        padding: '1.5rem',
        overflow: 'hidden'
      }}>
        {services.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#8a94a6', padding: '3rem 0', fontSize: '1.4rem' }}>
            Belum ada data kelas.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ffffff', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#8a94a6', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1.2rem' }}>Foto</th>
                  <th style={{ padding: '1.2rem' }}>Nama Kelas</th>
                  <th style={{ padding: '1.2rem' }}>Level & Kuota</th>
                  <th style={{ padding: '1.2rem' }}>Jadwal / Durasi</th>
                  <th style={{ padding: '1.2rem' }}>Harga</th>
                  <th style={{ padding: '1.2rem', textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {services.map((srv) => (
                  <tr key={srv.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '1.2rem' }}>
                      {srv.image ? (
                        <img 
                          src={srv.image} 
                          alt={srv.name} 
                          style={{ width: '50px', height: '50px', borderRadius: '0.6rem', objectFit: 'cover' }} 
                        />
                      ) : (
                        <div style={{ width: '50px', height: '50px', borderRadius: '0.6rem', background: '#151a28', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8a94a6' }}>
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1.2rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '1.4rem', color: '#fff' }}>{srv.name}</div>
                      <div style={{ color: '#8a94a6', fontSize: '1.2rem', marginTop: '0.2rem' }}>
                        {srv.description || 'Tidak ada deskripsi'}
                      </div>
                    </td>
                    <td style={{ padding: '1.2rem' }}>
                      <span style={{
                        background: 'rgba(76, 175, 125, 0.15)',
                        color: '#4caf7d',
                        padding: '0.4rem 1rem',
                        borderRadius: '99px',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        marginRight: '0.5rem'
                      }}>
                        {srv.level || 'Pemula'}
                      </span>
                      <span style={{ color: '#8a94a6', fontSize: '1.1rem' }}>
                        Kuota: {srv.quota || '-'}
                      </span>
                    </td>
                    <td style={{ padding: '1.2rem', fontSize: '1.2rem', color: '#ccc' }}>
                      <div>{srv.schedule || '-'}</div>
                      <div style={{ fontSize: '1.1rem', color: '#8a94a6' }}>{srv.duration}</div>
                    </td>
                    <td style={{ padding: '1.2rem', fontWeight: 700, fontSize: '1.3rem' }}>
                      Rp {Number(srv.price || 0).toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleOpenEdit(srv)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#fff',
                            padding: '0.6rem',
                            borderRadius: '0.6rem',
                            cursor: 'pointer'
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDelConfirm(srv)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid #ef4444',
                            color: '#ef4444',
                            padding: '0.6rem',
                            borderRadius: '0.6rem',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form Tambah / Edit Kelas */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#0d111d',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '1.2rem',
            padding: '2.5rem',
            maxWidth: '650px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}>
            {/* Header Modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: '#ffffff', margin: 0, fontWeight: 600 }}>
                {editingId ? 'Edit Kelas' : 'Tambah Kelas'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: '#8a94a6', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* NAMA KELAS */}
              <div>
                <label style={{ display: 'block', color: '#8a94a6', fontSize: '1.1rem', marginBottom: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  NAMA KELAS *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Basic Makeup Class"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '1rem 1.2rem',
                    borderRadius: '0.8rem',
                    background: '#151a28',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '1.2rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* HARGA, LEVEL, KUOTA */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#8a94a6', fontSize: '1.1rem', marginBottom: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    HARGA (IDR) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="350000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '1rem 1.2rem',
                      borderRadius: '0.8rem',
                      background: '#151a28',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '1.2rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#8a94a6', fontSize: '1.1rem', marginBottom: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    LEVEL
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '1rem 1.2rem',
                      borderRadius: '0.8rem',
                      background: '#151a28',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '1.2rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Pemula">Pemula</option>
                    <option value="Menengah">Menengah</option>
                    <option value="Lanjutan">Lanjutan</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#8a94a6', fontSize: '1.1rem', marginBottom: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    KUOTA
                  </label>
                  <input
                    type="number"
                    placeholder="10"
                    value={formData.quota}
                    onChange={(e) => setFormData({ ...formData, quota: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '1rem 1.2rem',
                      borderRadius: '0.8rem',
                      background: '#151a28',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '1.2rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* DURASI, JADWAL */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#8a94a6', fontSize: '1.1rem', marginBottom: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    DURASI
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 3 Jam"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '1rem 1.2rem',
                      borderRadius: '0.8rem',
                      background: '#151a28',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '1.2rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#8a94a6', fontSize: '1.1rem', marginBottom: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    JADWAL
                  </label>
                  <input
                    type="text"
                    placeholder="Setiap Sabtu, 09.00 WIB"
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '1rem 1.2rem',
                      borderRadius: '0.8rem',
                      background: '#151a28',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '1.2rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* GAMBAR KELAS (Upload File Area + Preview) */}
              <div>
                <label style={{ display: 'block', color: '#8a94a6', fontSize: '1.1rem', marginBottom: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  GAMBAR KELAS *
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                  <label style={{
                    border: '1px dashed rgba(255, 255, 255, 0.3)',
                    borderRadius: '0.8rem',
                    padding: '1.2rem 1.8rem',
                    color: '#8a94a6',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    display: 'inline-block',
                    textAlign: 'center'
                  }}>
                    Pilih Foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                  
                  {/* Pratinjau Gambar di Modal */}
                  {formData.image && (
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      style={{ width: '60px', height: '60px', borderRadius: '0.8rem', objectFit: 'cover', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                    />
                  )}

                  <div style={{ color: '#8a94a6', fontSize: '1.1rem' }}>
                    <div style={{ color: '#fff', fontWeight: 500, marginBottom: '0.3rem' }}>
                      {formData.imageFileName || 'Belum ada file dipilih'}
                    </div>
                    Maksimal 5MB (JPG, PNG, WebP)
                  </div>
                </div>
              </div>

              {/* SUDAH TERMASUK (FASILITAS) */}
              <div>
                <label style={{ display: 'block', color: '#8a94a6', fontSize: '1.1rem', marginBottom: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  SUDAH TERMASUK (FASILITAS)
                </label>
                <input
                  type="text"
                  placeholder="Alat praktek, sertifikat, snack"
                  value={formData.facilities}
                  onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '1rem 1.2rem',
                    borderRadius: '0.8rem',
                    background: '#151a28',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '1.2rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* DESKRIPSI */}
              <div>
                <label style={{ display: 'block', color: '#8a94a6', fontSize: '1.1rem', marginBottom: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  DESKRIPSI
                </label>
                <textarea
                  rows="3"
                  placeholder="Deskripsi singkat kelas..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '1rem 1.2rem',
                    borderRadius: '0.8rem',
                    background: '#151a28',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '1.2rem',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '0.8rem 1.8rem',
                    borderRadius: '0.8rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'transparent',
                    color: '#ffffff',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '0.8rem 2.2rem',
                    borderRadius: '0.8rem',
                    border: 'none',
                    background: 'linear-gradient(135deg, #d4a843 0%, #b38728 100%)',
                    color: '#000000',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {delConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#0d111d',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '1.5rem',
            padding: '2.5rem',
            maxWidth: '400px',
            width: '100%'
          }}>
            <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1rem' }}>Hapus Kelas?</h2>
            <p style={{ color: '#8a94a6', fontSize: '1.3rem', marginBottom: '2rem' }}>
              Apakah kamu yakin ingin menghapus kelas <strong style={{ color: '#fff' }}>{delConfirm.name}</strong>?
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDelConfirm(null)}
                style={{
                  padding: '0.8rem 1.5rem',
                  borderRadius: '0.8rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'transparent',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(delConfirm.id)}
                disabled={loading}
                style={{
                  padding: '0.8rem 1.5rem',
                  borderRadius: '0.8rem',
                  border: 'none',
                  background: '#ef4444',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {loading ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}