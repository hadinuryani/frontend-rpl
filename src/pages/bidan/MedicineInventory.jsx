import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import { IconArrowLeft, IconSearch, IconPlus, IconAlertTriangle, IconX, IconRefresh } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './BidanPages.css';

const statusBadge = (s) => {
  if (s === 'Stok Aman') return 'badge-success';
  if (s === 'Hampir Habis') return 'badge-warning';
  if (s === 'Stok Habis') return 'badge-critical';
  if (s === 'Hampir Kadaluarsa') return 'badge-orange';
  if (s === 'Kadaluarsa') return 'badge-danger';
  return 'badge-gray';
};

const rowClass = (s) => {
  if (s === 'Stok Habis') return 'row-critical';
  if (s === 'Hampir Habis') return 'row-warning';
  if (s === 'Kadaluarsa') return 'row-expired';
  return '';
};

export default function MedicineInventory() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Semua');
  
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    namaObat: '',
    kategori: 'Obat',
    jumlahStok: '',
    satuan: 'tablet',
    tanggalKadaluarsa: '',
    batasStokKritis: ''
  });

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/bidan/obat?limit=200');
      
      // Calculate status based on stock and expiry
      const processed = (res.data || []).map(item => {
        let status = 'Stok Aman';
        
        // Expiry calculation
        const today = new Date();
        const expiry = new Date(item.tanggal_kadaluarsa);
        const daysToExpiry = (expiry - today) / (1000 * 60 * 60 * 24);
        
        if (daysToExpiry < 0) {
          status = 'Kadaluarsa';
        } else if (daysToExpiry <= 30) {
          status = 'Hampir Kadaluarsa';
        } else if (item.jumlah_stok === 0) {
          status = 'Stok Habis';
        } else if (item.jumlah_stok <= item.batas_stok_kritis) {
          status = 'Hampir Habis';
        }
        
        return { ...item, status };
      });
      
      setInventory(processed);
    } catch (err) {
      console.error("Gagal mengambil data inventori:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleOpenModal = (obat = null) => {
    if (obat) {
      setEditId(obat.id);
      setForm({
        namaObat: obat.nama_obat || '',
        kategori: obat.kategori || 'Obat',
        jumlahStok: obat.jumlah_stok !== undefined ? obat.jumlah_stok : '',
        satuan: obat.satuan || 'tablet',
        tanggalKadaluarsa: obat.tanggal_kadaluarsa ? new Date(obat.tanggal_kadaluarsa).toISOString().split('T')[0] : '',
        batasStokKritis: obat.batas_stok_kritis !== undefined ? obat.batas_stok_kritis : 10
      });
    } else {
      setEditId(null);
      setForm({
        namaObat: '',
        kategori: 'Obat',
        jumlahStok: '',
        satuan: 'tablet',
        tanggalKadaluarsa: '',
        batasStokKritis: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditId(null);
  };

  const handleSubmit = async () => {
    if (!form.namaObat) return alert("Nama obat wajib diisi");

    setIsSubmitting(true);
    try {
      const payload = {
        nama_obat: form.namaObat,
        kategori: form.kategori,
        jumlah_stok: parseInt(form.jumlahStok) || 0,
        satuan: form.satuan,
        tanggal_kadaluarsa: form.tanggalKadaluarsa ? new Date(form.tanggalKadaluarsa).toISOString() : undefined,
        batas_stok_kritis: parseInt(form.batasStokKritis) || 0
      };

      if (editId) {
        await api.put(`/bidan/obat/${editId}`, payload);
        alert('Data obat berhasil diperbarui!');
      } else {
        await api.post('/bidan/obat', payload);
        alert('Obat baru berhasil ditambahkan!');
      }
      
      handleCloseModal();
      fetchInventory();
    } catch (err) {
      alert(err.message || 'Gagal menyimpan data obat');
    } finally {
      setIsSubmitting(false);
    }
  };

  const criticalCount = inventory.filter(i => i.status === 'Stok Habis' || i.status === 'Hampir Kadaluarsa').length;
  
  const filtered = inventory.filter(i => {
    const matchSearch = i.nama_obat.toLowerCase().includes(search.toLowerCase());
    if (filter === 'Semua') return matchSearch;
    if (filter === 'Kritis') return matchSearch && (i.status === 'Stok Habis' || i.status === 'Hampir Habis');
    if (filter === 'Kadaluarsa') return matchSearch && (i.status === 'Kadaluarsa' || i.status === 'Hampir Kadaluarsa');
    return matchSearch;
  });

  return (
    <div className="app-layout" id="medicine-inventory">
      <Sidebar variant="bidan" />
      <div className="main-content">
        <Navbar variant="bidan" userName={user?.profile?.nama_lengkap || "Bidan Indah"} />
        <div className="page-content">
          <div className="page-header">
            <div className="page-title">
              <Link to="/bidan" className="back-btn"><IconArrowLeft size={18}/></Link>
              <h2>Inventori Obat</h2>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={fetchInventory}><IconRefresh size={16}/> Refresh</button>
          </div>
          {criticalCount > 0 && (
            <div className="warning-banner">
              <IconAlertTriangle size={18}/> {criticalCount} Obat Membutuhkan Perhatian: stok kritis / hampir kadaluarsa
            </div>
          )}
          <div className="action-row">
            <div className="input-wrapper search-input" style={{ flex: 1 }}>
              <span className="input-icon"><IconSearch size={18}/></span>
              <input type="text" className="form-input" placeholder="Cari obat..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="form-select" style={{ maxWidth: '180px' }} value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="Semua">Semua</option>
              <option value="Kritis">Kritis</option>
              <option value="Kadaluarsa">Kadaluarsa</option>
            </select>
            <button className="btn btn-primary hide-mobile" onClick={() => handleOpenModal()}><IconPlus size={16}/> Tambah Obat</button>
          </div>
          <div className="hide-mobile">
            <table className="data-table">
              <thead><tr><th>Nama Obat</th><th>Kategori</th><th>Stok</th><th>Satuan</th><th>Kadaluarsa</th><th>Status</th><th>Aksi</th></tr></thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>Memuat data...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>Data obat tidak ditemukan</td></tr>
                ) : filtered.map(m => (
                  <tr key={m.id} className={rowClass(m.status)}>
                    <td style={{ fontWeight: 500 }}>{m.nama_obat}</td>
                    <td>{m.kategori}</td>
                    <td style={{ fontWeight: 600, color: m.jumlah_stok === 0 ? 'var(--color-error)' : 'inherit' }}>{m.jumlah_stok}</td>
                    <td>{m.satuan}</td>
                    <td style={{ color: m.status.includes('Kadaluarsa') ? '#E65100' : 'inherit' }}>{new Date(m.tanggal_kadaluarsa).toLocaleDateString('id-ID')}</td>
                    <td><span className={`badge ${statusBadge(m.status)}`}>{m.status}</span></td>
                    <td style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleOpenModal(m)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="hide-desktop" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {isLoading ? (
              <div style={{textAlign: 'center', padding: '20px'}}>Memuat data...</div>
            ) : filtered.length === 0 ? (
              <div style={{textAlign: 'center', padding: '20px'}}>Data tidak ditemukan</div>
            ) : filtered.map(m => (
              <div className="glass-card" key={m.id} style={{ padding: 'var(--space-4)', opacity: m.status === 'Kadaluarsa' ? 0.5 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong>{m.nama_obat}</strong>
                  <span className={`badge ${statusBadge(m.status)}`}>{m.status}</span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)' }}>
                  Stok: {m.jumlah_stok} {m.satuan} • Exp: {new Date(m.tanggal_kadaluarsa).toLocaleDateString('id-ID')}
                </div>
              </div>
            ))}
          </div>
          <button className="fab hide-desktop" onClick={() => handleOpenModal()} aria-label="Tambah Obat"><IconPlus size={24}/></button>
        </div>
      </div>
      <BottomNav variant="bidan" />
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0', padding: 'var(--space-5) var(--space-6)' }}>
              <h3 style={{ color: 'white' }}>{editId ? 'Edit Obat' : 'Tambah Obat Baru'}</h3>
              <button className="modal-close" onClick={handleCloseModal} style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}><IconX size={16}/></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nama Obat <span style={{color: 'red'}}>*</span></label>
                <input className="form-input" placeholder="Nama obat" value={form.namaObat} onChange={e => setForm({...form, namaObat: e.target.value})} disabled={isSubmitting} />
              </div>
              <div className="form-group">
                <label className="form-label">Kategori</label>
                <select className="form-select" value={form.kategori} onChange={e => setForm({...form, kategori: e.target.value})} disabled={isSubmitting}>
                  <option value="Suplemen">Suplemen</option>
                  <option value="Obat">Obat</option>
                  <option value="Injeksi">Injeksi</option>
                  <option value="Antibiotik">Antibiotik</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Jumlah Stok</label>
                  <input type="number" className="form-input" placeholder="0" value={form.jumlahStok} onChange={e => setForm({...form, jumlahStok: e.target.value})} disabled={isSubmitting} />
                </div>
                <div className="form-group">
                  <label className="form-label">Satuan</label>
                  <input className="form-input" placeholder="tablet/botol/ampul" value={form.satuan} onChange={e => setForm({...form, satuan: e.target.value})} disabled={isSubmitting} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Tanggal Kadaluarsa <span style={{color: 'red'}}>*</span></label>
                <input type="date" className="form-input" value={form.tanggalKadaluarsa} onChange={e => setForm({...form, tanggalKadaluarsa: e.target.value})} disabled={isSubmitting} />
              </div>
              <div className="form-group">
                <label className="form-label">Batas Stok Kritis</label>
                <input type="number" className="form-input" placeholder="10" value={form.batasStokKritis} onChange={e => setForm({...form, batasStokKritis: e.target.value})} disabled={isSubmitting} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={handleCloseModal} disabled={isSubmitting}>Batal</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
