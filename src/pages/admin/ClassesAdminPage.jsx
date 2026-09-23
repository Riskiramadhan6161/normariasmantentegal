import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Pencil, Trash2, X, GraduationCap } from 'lucide-react';

const EMPTY_FORM = {
  name: '', price: '', duration: '', schedule: '', quota: 10,
  description: '', image: '', level: 'Pemula', includes: '',
};
const LEVELS = ['Pemula', 'Menengah', 'Lanjutan'];

function formatPrice(p) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);
}

export default function ClassesAdminPage() {
  const { classes, addClass, updateClass, deleteClass } = useApp();
  const [modal, setModal]         = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [delConfirm, setDelConfirm] = useState(null);
  const [toast, setToast]         = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setModal(true); };
  const openEdit = (cls) => {
    setEditing(cls);
    setForm({ 
      name: cls.name, 
      price: cls.price, 
      duration: cls.duration, 
      schedule: cls.schedule,
      quota: cls.quota, 
      description: cls.description, 
      image: cls.image, 
      level: cls.level, 
      includes: cls.includes || '' 
    });
    setModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { ...form, price: Number(form.price), quota: Number(form.quota) };

    if (editing) { 
      const res = await updateClass(editing.id, payload); 
      if (res?.success) showToast('Kelas berhasil diperbarui!');
      else showToast('Gagal memperbarui kelas!', 'error');
    } else { 
      const res = await addClass(payload); 
      if (res?.success) showToast('Kelas berhasil ditambahkan!');
      else showToast('Gagal menambahkan kelas!', 'error');
    }

    setSubmitting(false);
    setModal(false);
  };

  const handleDelete = async (id) => { 
    const res = await deleteClass(id); 
    setDelConfirm(null); 
    if (res?.success) {
      showToast('Kelas berhasil dihapus!', 'error');
    } else {
      showToast('Gagal menghapus kelas!', 'error');
    }
  };

  const f = (field, val) => setForm({ ...form, [field]: val });

  return (
    <div>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

      <div className="admin-section-header" style={{ marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '3rem', marginBottom: '0.4rem' }}>
            Manajemen Kelas
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.4rem' }}>
            {classes.length} kelas terdaftar
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={18} /> Tambah Kelas
        </button>
      </div>

      <div className="glass-card" style={{ padding: 0 }}>
        {classes.length === 0 ? (
          <div style={{ padding: '5rem', textAlign: 'center' }}>
            <GraduationCap size={48} color="var(--text-muted)" style={{ margin: '0 auto 1.5rem' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '1.5rem' }}>Belum ada kelas. Tambahkan sekarang!</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nama Kelas</th>
                  <th>Level</th>
                  <th>Durasi</th>
                  <th>Jadwal</th>
                  <th>Kuota</th>
                  <th>Harga</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => (
                  <tr key={cls.id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '1.4rem' }}>{cls.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '0.2rem', maxWidth: '28rem' }}>
                        {cls.description?.substring(0, 70)}...
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{
                        background: cls.level === 'Pemula' ? 'rgba(76,175,125,0.15)' : cls.level === 'Menengah' ? 'rgba(240,160,64,0.15)' : 'rgba(131,153,230,0.15)',
                        color: cls.level === 'Pemula' ? '#4caf7d' : cls.level === 'Menengah' ? '#f0a040' : '#8399e6',
                      }}>{cls.level}</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{cls.duration}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '20rem' }}>{cls.schedule}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{cls.quota} org</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatPrice(cls.price)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.8rem' }}>
                        <button className="btn btn-sm btn-outline btn-icon" onClick={() => openEdit(cls)}><Pencil size={15} /></button>
                        <button className="btn btn-sm btn-danger btn-icon" onClick={() => setDelConfirm(cls)}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" style={{ maxWidth: '60rem' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editing ? 'Edit Kelas' : 'Tambah Kelas'}</h2>
              <button className="modal-close" onClick={() => setModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem', maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
              <div className="form-group">
                <label className="form-label">Nama Kelas *</label>
                <input className="form-input" value={form.name} onChange={(e) => f('name', e.target.value)} placeholder="Contoh: Basic Makeup Class" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.2rem' }}>
                <div className="form-group">
                  <label className="form-label">Harga (IDR) *</label>
                  <input className="form-input" type="number" value={form.price} onChange={(e) => f('price', e.target.value)} placeholder="350000" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Level</label>
                  <select className="form-select" value={form.level} onChange={(e) => f('level', e.target.value)}>
                    {LEVELS.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Kuota</label>
                  <input className="form-input" type="number" value={form.quota} onChange={(e) => f('quota', e.target.value)} min="1" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                <div className="form-group">
                  <label className="form-label">Durasi</label>
                  <input className="form-input" value={form.duration} onChange={(e) => f('duration', e.target.value)} placeholder="Contoh: 3 Jam" />
                </div>
                <div className="form-group">
                  <label className="form-label">Jadwal</label>
                  <input className="form-input" value={form.schedule} onChange={(e) => f('schedule', e.target.value)} placeholder="Setiap Sabtu, 09.00 WIB" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Gambar Kelas *</label>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  {form.image ? (
                    <img 
                      src={form.image} 
                      alt="Preview" 
                      style={{ width: '9rem', height: '6rem', objectFit: 'cover', borderRadius: '0.8rem', border: '2px solid var(--gold)' }} 
                    />
                  ) : (
                    <div style={{ width: '9rem', height: '6rem', borderRadius: '0.8rem', border: '1px dashed var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '1.1rem', textAlign: 'center', padding: '0.5rem' }}>
                      Pilih Foto
                    </div>
                  )}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      style={{ fontSize: '1.3rem', color: 'var(--text)' }}
                    />
                    <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Maksimal ukuran file disarankan: 2MB (jpg, png, webp)</span>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Sudah Termasuk (Fasilitas)</label>
                <input className="form-input" value={form.includes} onChange={(e) => f('includes', e.target.value)} placeholder="Alat praktek, sertifikat, snack" />
              </div>
              <div className="form-group">
                <label className="form-label">Deskripsi</label>
                <textarea className="form-textarea" value={form.description} onChange={(e) => f('description', e.target.value)} placeholder="Deskripsi singkat kelas..." rows={3} />
              </div>
              <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Menyimpan...' : (editing ? 'Simpan Perubahan' : 'Tambah Kelas')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {delConfirm && (
        <div className="modal-overlay" onClick={() => setDelConfirm(null)}>
          <div className="modal" style={{ maxWidth: '42rem' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Hapus Kelas?</h2>
              <button className="modal-close" onClick={() => setDelConfirm(null)}><X size={18} /></button>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.4rem', marginBottom: '2.5rem' }}>
              Yakin hapus kelas <strong style={{ color: 'var(--text)' }}>{delConfirm.name}</strong>?
            </p>
            <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setDelConfirm(null)}>Batal</button>
              <button className="btn btn-danger" onClick={() => handleDelete(delConfirm.id)}><Trash2 size={16} /> Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}