import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import { IconArrowLeft, IconSearch, IconPlus, IconX, IconRefresh } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './BidanPages.css';

export default function PatientData() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    namaLengkap: '',
    tanggalLahir: '',
    jenisKelamin: 'Perempuan',
    alamat: '',
    noWa: '',
    golonganDarah: ''
  });

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/bidan/pasien?limit=100');
      setPatients(res.data || []);
    } catch (err) {
      console.error("Gagal mengambil data pasien:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleOpenDrawer = (patient = null) => {
    if (patient) {
      setEditId(patient.id);
      setForm({
        namaLengkap: patient.nama_lengkap || '',
        tanggalLahir: patient.tanggal_lahir ? new Date(patient.tanggal_lahir).toISOString().split('T')[0] : '',
        jenisKelamin: patient.jenis_kelamin || 'Perempuan',
        alamat: patient.alamat || '',
        noWa: patient.no_wa || '',
        golonganDarah: patient.golongan_darah || ''
      });
    } else {
      setEditId(null);
      setForm({
        namaLengkap: '',
        tanggalLahir: '',
        jenisKelamin: 'Perempuan',
        alamat: '',
        noWa: '',
        golonganDarah: ''
      });
    }
    setShowDrawer(true);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setEditId(null);
  };

  const handleSubmit = async () => {
    if (!form.namaLengkap) return alert("Nama lengkap wajib diisi");

    setIsSubmitting(true);
    try {
      const payload = {
        nama_lengkap: form.namaLengkap,
        tanggal_lahir: form.tanggalLahir || undefined,
        jenis_kelamin: form.jenisKelamin,
        alamat: form.alamat || undefined,
        no_wa: form.noWa || undefined,
        golongan_darah: form.golonganDarah || undefined,
      };

      if (editId) {
        await api.put(`/bidan/pasien/${editId}`, payload);
        alert('Data pasien berhasil diperbarui!');
      } else {
        await api.post('/bidan/pasien', payload);
        alert('Pasien baru berhasil ditambahkan!');
      }
      
      handleCloseDrawer();
      fetchPatients();
    } catch (err) {
      alert(err.message || 'Gagal menyimpan data pasien');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = patients.filter(p => 
    p.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
    (p.no_wa && p.no_wa.includes(search))
  );

  return (
    <div className="app-layout" id="patient-data">
      <Sidebar variant="bidan" />
      <div className="main-content">
        <Navbar variant="bidan" userName={user?.profile?.nama_lengkap || "Bidan Indah"} />
        <div className="page-content">
          <div className="page-header">
            <div className="page-title">
              <Link to="/bidan" className="back-btn"><IconArrowLeft size={18}/></Link>
              <h2>Data Pasien</h2>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={fetchPatients}><IconRefresh size={16}/> Refresh</button>
          </div>
          <div className="action-row">
            <div className="input-wrapper search-input" style={{ flex: 1 }}>
              <span className="input-icon"><IconSearch size={18}/></span>
              <input type="text" className="form-input" placeholder="Cari nama atau No. WhatsApp..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <button className="btn btn-primary hide-mobile" onClick={() => handleOpenDrawer()}><IconPlus size={16}/> Tambah Pasien</button>
          </div>
          <div className="hide-mobile">
            <table className="data-table">
              <thead><tr><th>Nama</th><th>Usia</th><th>No. WhatsApp</th><th>Tanggal Daftar</th><th>Aksi</th></tr></thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Memuat data...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Data pasien tidak ditemukan</td></tr>
                ) : filtered.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500 }}>{p.nama_lengkap}</td>
                    <td>{p.umur ? `${p.umur} th` : '-'}</td>
                    <td>{p.no_wa || '-'}</td>
                    <td>{new Date(p.created_at).toLocaleDateString('id-ID')}</td>
                    <td style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleOpenDrawer(p)}>Edit</button>
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
            ) : filtered.map(p => (
              <div className="glass-card" key={p.id} style={{ padding: 'var(--space-4)' }} onClick={() => handleOpenDrawer(p)}>
                <div style={{ fontWeight: 600, color: 'var(--color-dark)', marginBottom: '4px' }}>{p.nama_lengkap}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)' }}>{p.umur ? `${p.umur} tahun` : 'Usia belum diatur'} • {p.no_wa || 'No WA belum diatur'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Daftar: {new Date(p.created_at).toLocaleDateString('id-ID')}</div>
              </div>
            ))}
          </div>
          <button className="fab hide-desktop" onClick={() => handleOpenDrawer()} aria-label="Tambah Pasien"><IconPlus size={24}/></button>
        </div>
      </div>
      <BottomNav variant="bidan" />
      {showDrawer && (
        <>
          <div className="drawer-overlay" onClick={handleCloseDrawer}></div>
          <div className="side-drawer">
            <div className="drawer-header">
              <h3>{editId ? 'Edit Data Pasien' : 'Tambah Pasien Baru'}</h3>
              <button className="modal-close" onClick={handleCloseDrawer}><IconX size={16}/></button>
            </div>
            <div className="drawer-body">
              <div className="form-group">
                <label className="form-label">Nama Lengkap <span style={{color: 'red'}}>*</span></label>
                <input className="form-input" placeholder="Nama lengkap" value={form.namaLengkap} onChange={e => setForm({...form, namaLengkap: e.target.value})} disabled={isSubmitting} />
              </div>
              <div className="form-group">
                <label className="form-label">Tanggal Lahir</label>
                <input type="date" className="form-input" value={form.tanggalLahir} onChange={e => setForm({...form, tanggalLahir: e.target.value})} disabled={isSubmitting} />
              </div>
              <div className="form-group">
                <label className="form-label">Jenis Kelamin</label>
                <select className="form-select" value={form.jenisKelamin} onChange={e => setForm({...form, jenisKelamin: e.target.value})} disabled={isSubmitting}>
                  <option value="Perempuan">Perempuan</option>
                  <option value="Laki-laki">Laki-laki</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Alamat</label>
                <textarea className="form-textarea" rows="2" placeholder="Alamat lengkap" value={form.alamat} onChange={e => setForm({...form, alamat: e.target.value})} disabled={isSubmitting}></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">No. WhatsApp</label>
                <input className="form-input" placeholder="08xxxxxxxxxx" value={form.noWa} onChange={e => setForm({...form, noWa: e.target.value})} disabled={isSubmitting} />
              </div>
              <div className="form-group">
                <label className="form-label">Golongan Darah</label>
                <select className="form-select" value={form.golonganDarah} onChange={e => setForm({...form, golonganDarah: e.target.value})} disabled={isSubmitting}>
                  <option value="">Pilih</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                  <option value="Tidak Tahu">Tidak Tahu</option>
                </select>
              </div>
            </div>
            <div className="drawer-footer">
              <button className="btn btn-primary btn-full" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button className="btn btn-ghost" onClick={handleCloseDrawer} disabled={isSubmitting}>Batal</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
