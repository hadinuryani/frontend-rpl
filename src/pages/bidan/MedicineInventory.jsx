import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import LoadingAnimation from '../../components/LoadingAnimation';
import { IconArrowLeft, IconArrowRight, IconSearch, IconPlus, IconAlertTriangle, IconX, IconRefresh, IconTrash, IconEdit } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
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
  const { showAlert, showConfirm } = useAlert();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('search') || '';
  });
  const [filter, setFilter] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('filter') || 'Semua';
  });
  
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmittedOnce, setIsSubmittedOnce] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [criticalCount, setCriticalCount] = useState(0);
  const limit = 10;

  const [form, setForm] = useState({
    namaObat: '',
    kategori: 'Obat',
    jumlahStok: '',
    satuan: 'tablet',
    tanggalKadaluarsa: '',
    batasStokKritis: ''
  });

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.namaObat || !data.namaObat.trim()) {
      newErrors.namaObat = 'Nama obat wajib diisi';
    }
    if (!data.satuan || !data.satuan.trim()) {
      newErrors.satuan = 'Satuan obat wajib diisi';
    }
    if (!data.tanggalKadaluarsa) {
      newErrors.tanggalKadaluarsa = 'Tanggal kadaluarsa wajib diisi';
    }
    
    const jumlahStokInt = parseInt(data.jumlahStok);
    if (data.jumlahStok === '' || isNaN(jumlahStokInt) || jumlahStokInt < 0) {
      newErrors.jumlahStok = 'Jumlah stok wajib diisi dengan angka positif (minimal 0)';
    }

    const batasStokKritisInt = parseInt(data.batasStokKritis);
    if (data.batasStokKritis === '' || isNaN(batasStokKritisInt) || batasStokKritisInt < 0) {
      newErrors.batasStokKritis = 'Batas stok kritis wajib diisi dengan angka positif (minimal 0)';
    }
    return newErrors;
  };

  const handleInputChange = (field, value) => {
    const updatedForm = { ...form, [field]: value };
    setForm(updatedForm);
    if (isSubmittedOnce) {
      setErrors(validateForm(updatedForm));
    }
  };

  const fetchInventory = async (pageNumber = currentPage, searchVal = search, filterVal = filter) => {
    setIsLoading(true);
    try {
      let statusQueryParam = '';
      if (filterVal === 'Kritis') statusQueryParam = 'Kritis';
      else if (filterVal === 'Kadaluarsa') statusQueryParam = 'Kadaluarsa';

      const [res, notifRes] = await Promise.all([
        api.get(`/bidan/obat?page=${pageNumber}&limit=${limit}&search=${searchVal}&status=${statusQueryParam}`),
        api.get('/bidan/notifikasi')
      ]);
      
      // Calculate status based on stock and expiry
      const processed = (res.data || []).map(item => {
        let status = 'Stok Aman';
        
        // Expiry calculation — only if tanggal_kadaluarsa is not null
        if (item.tanggal_kadaluarsa) {
          const today = new Date();
          const expiry = new Date(item.tanggal_kadaluarsa);
          const daysToExpiry = (expiry - today) / (1000 * 60 * 60 * 24);
          
          if (daysToExpiry < 0) {
            status = 'Kadaluarsa';
          } else if (daysToExpiry <= 30) {
            status = 'Hampir Kadaluarsa';
          }
        }

        if (status === 'Stok Aman') {
          if (item.jumlah_stok === 0) {
            status = 'Stok Habis';
          } else if (item.batas_stok_kritis > 0 && item.jumlah_stok <= item.batas_stok_kritis) {
            status = 'Hampir Habis';
          }
        }
        
        return { ...item, status };
      });
      
      setInventory(processed);
      setCriticalCount((notifRes.data || []).length);
      if (res.meta) {
        setTotalPages(res.meta.total_pages || 1);
        setTotalItems(res.meta.total || 0);
      }
    } catch (err) {
      console.error("Gagal mengambil data inventori:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory(currentPage, search, filter);
  }, [currentPage]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    setCurrentPage(1);
    fetchInventory(1, val, filter);
  };

  const handleFilterChange = (e) => {
    const val = e.target.value;
    setFilter(val);
    setCurrentPage(1);
    fetchInventory(1, search, val);
  };

  const handleOpenModal = (obat = null) => {
    setErrors({});
    setIsSubmittedOnce(false);
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
    setErrors({});
    setIsSubmittedOnce(false);
  };

  const handleSubmit = async () => {
    setIsSubmittedOnce(true);
    const formErrors = validateForm(form);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

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
        await showAlert('Data obat berhasil diperbarui!', { variant: 'success', title: 'Sukses' });
      } else {
        await api.post('/bidan/obat', payload);
        await showAlert('Obat baru berhasil ditambahkan!', { variant: 'success', title: 'Sukses' });
      }
      
      handleCloseModal();
      fetchInventory();
    } catch (err) {
      await showAlert(err.message || 'Gagal menyimpan data obat', { variant: 'error', title: 'Gagal' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteObat = async (id, name) => {
    const isConfirmed = await showConfirm(`Apakah Anda yakin ingin menghapus obat "${name}"? Tindakan ini tidak dapat dibatalkan.`, {
      variant: 'warning',
      title: 'Hapus Obat'
    });
    if (isConfirmed) {
      try {
        await api.delete(`/bidan/obat/${id}`);
        await showAlert('Obat berhasil dihapus!', { variant: 'success', title: 'Sukses' });
        fetchInventory();
      } catch (err) {
        await showAlert(err.message || 'Gagal menghapus obat', { variant: 'error', title: 'Gagal' });
      }
    }
  };



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
              <input type="text" className="form-input" placeholder="Cari obat..." value={search} onChange={handleSearchChange} />
            </div>
            <select className="form-select" style={{ maxWidth: '180px' }} value={filter} onChange={handleFilterChange}>
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
                  <tr><td colSpan="7"><LoadingAnimation /></td></tr>
                ) : inventory.length === 0 ? (
                  <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>Data obat tidak ditemukan</td></tr>
                ) : inventory.map(m => (
                  <tr key={m.id} className={rowClass(m.status)}>
                    <td style={{ fontWeight: 500 }}>{m.nama_obat}</td>
                    <td>{m.kategori}</td>
                    <td style={{ fontWeight: 600, color: m.jumlah_stok === 0 ? 'var(--color-error)' : 'inherit' }}>{m.jumlah_stok}</td>
                    <td>{m.satuan}</td>
                    <td style={{ color: m.status.includes('Kadaluarsa') ? '#E65100' : 'inherit' }}>{m.tanggal_kadaluarsa ? new Date(m.tanggal_kadaluarsa).toLocaleDateString('id-ID') : '-'}</td>
                    <td><span className={`badge ${statusBadge(m.status)}`}>{m.status}</span></td>
                    <td style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-action-edit" onClick={() => handleOpenModal(m)} title="Edit Obat">
                        <IconEdit size={16} />
                      </button>
                      <button className="btn-action-delete" onClick={() => handleDeleteObat(m.id, m.nama_obat)} title="Hapus Obat">
                        <IconTrash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="hide-desktop" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {isLoading ? (
              <LoadingAnimation />
            ) : inventory.length === 0 ? (
              <div style={{textAlign: 'center', padding: '20px'}}>Data tidak ditemukan</div>
            ) : inventory.map(m => (
              <div 
                className="glass-card" 
                key={m.id} 
                style={{ padding: 'var(--space-4)', opacity: m.status === 'Kadaluarsa' ? 0.5 : 1, cursor: 'pointer' }}
                onClick={() => handleOpenModal(m)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong>{m.nama_obat}</strong>
                  <span className={`badge ${statusBadge(m.status)}`}>{m.status}</span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)' }}>
                  Stok: {m.jumlah_stok} {m.satuan} • Exp: {m.tanggal_kadaluarsa ? new Date(m.tanggal_kadaluarsa).toLocaleDateString('id-ID') : '-'}
                </div>
                <div className="action-btn-group">
                  <button className="btn-action-edit" onClick={(e) => { e.stopPropagation(); handleOpenModal(m); }} title="Edit Obat">
                    <IconEdit size={16} />
                  </button>
                  <button className="btn-action-delete" onClick={(e) => { e.stopPropagation(); handleDeleteObat(m.id, m.nama_obat); }} title="Hapus Obat">
                    <IconTrash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination UI */}
          {totalPages > 1 && (
            <div className="pagination-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
              <button 
                className="btn btn-secondary btn-sm btn-icon" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                title="Halaman Sebelumnya"
              >
                <IconArrowLeft size={16} />
              </button>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-light)' }}>
                Halaman {currentPage} dari {totalPages}
              </span>
              <button 
                className="btn btn-secondary btn-sm btn-icon" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                title="Halaman Selanjutnya"
              >
                <IconArrowRight size={16} />
              </button>
            </div>
          )}
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
                <input className={`form-input ${errors.namaObat ? 'error' : ''}`} placeholder="Nama obat" value={form.namaObat} onChange={e => handleInputChange('namaObat', e.target.value)} disabled={isSubmitting} />
                {errors.namaObat && <span className="form-error">{errors.namaObat}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Kategori</label>
                <select className="form-select" value={form.kategori} onChange={e => handleInputChange('kategori', e.target.value)} disabled={isSubmitting}>
                  <option value="Suplemen">Suplemen</option>
                  <option value="Obat">Obat</option>
                  <option value="Injeksi">Injeksi</option>
                  <option value="Antibiotik">Antibiotik</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Jumlah Stok <span style={{color: 'red'}}>*</span></label>
                  <input type="number" className={`form-input ${errors.jumlahStok ? 'error' : ''}`} placeholder="0" value={form.jumlahStok} onChange={e => handleInputChange('jumlahStok', e.target.value)} disabled={isSubmitting} />
                  {errors.jumlahStok && <span className="form-error">{errors.jumlahStok}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Satuan <span style={{color: 'red'}}>*</span></label>
                  <input className={`form-input ${errors.satuan ? 'error' : ''}`} placeholder="tablet/botol/ampul" value={form.satuan} onChange={e => handleInputChange('satuan', e.target.value)} disabled={isSubmitting} />
                  {errors.satuan && <span className="form-error">{errors.satuan}</span>}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Tanggal Kadaluarsa <span style={{color: 'red'}}>*</span></label>
                <input type="date" className={`form-input ${errors.tanggalKadaluarsa ? 'error' : ''}`} value={form.tanggalKadaluarsa} onChange={e => handleInputChange('tanggalKadaluarsa', e.target.value)} disabled={isSubmitting} />
                {errors.tanggalKadaluarsa && <span className="form-error">{errors.tanggalKadaluarsa}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Batas Stok Kritis <span style={{color: 'red'}}>*</span></label>
                <input type="number" className={`form-input ${errors.batasStokKritis ? 'error' : ''}`} placeholder="10" value={form.batasStokKritis} onChange={e => handleInputChange('batasStokKritis', e.target.value)} disabled={isSubmitting} />
                {errors.batasStokKritis && <span className="form-error">{errors.batasStokKritis}</span>}
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
