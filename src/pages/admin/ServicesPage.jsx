import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Pencil, Trash2, X, Image } from 'lucide-react';

const EMPTY_FORM = { name: '', price: '', description: '', image: '', category: 'Tradisional' };
const CATEGORIES = ['Tradisional', 'Internasional', 'Modern', 'Glamor'];

function formatPrice(p) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p || 0);
}

export default function ServicesPage() {
  const { services, addService, updateService, deleteService } = useApp();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [delConfirm, setDelConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModal(true);
  };

  const openEdit = (svc) => {
    setEditing(svc);
    setForm({
      name: svc.nama_layanan || svc.name || '',
      price: svc.harga || svc.price || '',
      description: svc.deskripsi || svc.description || '',
      image: svc.gambar || svc.image || '',
      category: svc.kategori || svc.category || 'Tradisional'
    });
    setModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    setSubmitting(true);

    const payload = { ...form, price: Number(form.price) };

    try {
      if (editing) {
        const res = await updateService(editing.id, payload);
        if (res?.success !== false) {
          showToast('Layanan berhasil diperbarui!');
          setModal(false);
        } else {
          showToast('Gagal memperbarui layanan!', 'error');
        }
      } else {
        const res = await addService(payload);
        if (res?.success !== false) {
          showToast('Layanan berhasil ditambahkan!');
          setModal(false);
        } else {
          showToast('Gagal menambahkan layanan!', 'error');
        }
      }
    } catch (err) {
      showToast('Terjadi kesalahan sistem!', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteService(id);
      setDelConfirm(null);
      if (res?.success !== false) {
        showToast('Layanan berhasil dihapus!', 'error');
      } else {
        showToast('Gagal menghapus layanan!', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan sistem!', 'error');
    }
  };

  return (
    <div>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

      <div className="admin-section-header" style={{ marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '3rem', marginBottom: '0.4rem' }}>
            Manajemen Layanan
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.4rem' }}>
            {services.length} layanan terdaftar
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={18} /> Tambah Layanan
        </button>
      </div>

      <div className="glass-card" style={{ padding: 0 }}>
        {services.length === 0 ? (
          <div style={{ padding: '5rem', textAlign: 'center' }}>
            <Image size={48} color="var(--text-muted)" style={{ margin: '0 auto 1.5rem' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '1.5rem' }}>Belum ada layanan. Tambahkan sekarang!</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Nama Layanan</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {services.map((svc) => {
                  const name = svc.nama_layanan || svc.name;
                  const price = svc.harga || svc.price;
                  const description = svc.deskripsi || svc.description;
                  const category = svc.kategori || svc.category;
                  const image = svc.gambar || svc.image;

                  return (
                    <tr key={svc.id}>
                      <td>
                        <img
                          src={image}
                          alt={name}
                          style={{ width: '5.5rem', height: '5.5rem', objectFit: 'cover', borderRadius: '0.6rem' }}
                          onError={(e) => { e.target.src = 'https://placehold.co/60x60/0f1525/c9a84c?text=?'; }}
                        />
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '1.4rem' }}>{name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '0.2rem', maxWidth: '30rem' }}>
                          {description?.substring(0, 80)}...
                        </div>
                      </td>
                      <td><span className="badge badge-process">{category}</span></td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.4rem' }}>{formatPrice(price)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                          <button className="btn btn-sm btn-outline btn-icon" onClick={() => openEdit(svc)} title="Edit">
                            <Pencil size={15} />
                          </button>
                          <button className="btn btn-sm btn-danger btn-icon" onClick={() => setDelConfirm(svc)} title="Hapus">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Add/Edit */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editing ? 'Edit Layanan' : 'Tambah Layanan'}</h2>
              <button className="modal-close" onClick={() => setModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
              <div className="form-group">
                <label className="form-label">Nama Layanan *</label>
                <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Contoh: Jawa Tengah MakeUp" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Harga (IDR) *</label>
                  <input className="form-input" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="500000" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Kategori</label>
                  <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Gambar Layanan *</label>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  {form.image ? (
                    <img
                      src={form.image}
                      alt="Preview"
                      style={{ width: '8rem', height: '8rem', objectFit: 'cover', borderRadius: '0.8rem', border: '2px solid var(--gold)' }}
                    />
                  ) : (
                    <div style={{ width: '8rem', height: '8rem', borderRadius: '0.8rem', border: '1px dashed var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '1.1rem', textAlign: 'center', padding: '0.5rem' }}>
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
                <label className="form-label">Deskripsi</label>
                <textarea className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi singkat layanan..." />
              </div>
              <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Menyimpan...' : (editing ? 'Simpan Perubahan' : 'Tambah Layanan')}
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
              <h2 className="modal-title">Hapus Layanan?</h2>
              <button className="modal-close" onClick={() => setDelConfirm(null)}><X size={18} /></button>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.4rem', marginBottom: '2.5rem' }}>
              Kamu yakin ingin menghapus layanan <strong style={{ color: 'var(--text)' }}>{delConfirm.nama_layanan || delConfirm.name}</strong>? Tindakan ini tidak bisa dibatalkan.
            </p>
            <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setDelConfirm(null)}>Batal</button>
              <button className="btn btn-danger" onClick={() => handleDelete(delConfirm.id)}><Trash2 size={16} />Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}