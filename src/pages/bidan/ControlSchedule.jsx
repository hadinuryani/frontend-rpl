import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import { IconArrowLeft, IconMessageCircle, IconCheckCircle, IconRefresh } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './BidanPages.css';

export default function ControlSchedule() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [tanggalKontrol, setTanggalKontrol] = useState('');
  const [catatan, setCatatan] = useState('');
  
  const [patients, setPatients] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [patientsRes, schedulesRes] = await Promise.all([
        api.get('/bidan/pasien?limit=100'),
        api.get('/bidan/jadwal-kontrol')
      ]);
      setPatients(patientsRes.data || []);
      setSchedules(schedulesRes.data || []);
    } catch (err) {
      console.error("Gagal mengambil data jadwal:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPatients = patients.filter(p => 
    p.nama_lengkap.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!selectedPatient) return alert("Pilih pasien terlebih dahulu");
    if (!tanggalKontrol) return alert("Tanggal kontrol wajib diisi");

    setIsSubmitting(true);
    try {
      await api.post('/bidan/jadwal-kontrol', {
        pasien_id: selectedPatient.id,
        tanggal_kontrol: tanggalKontrol,
        catatan: catatan
      });
      alert('Jadwal kontrol berhasil disimpan!');
      setSearch('');
      setSelectedPatient(null);
      setTanggalKontrol('');
      setCatatan('');
      fetchData(); // refresh list
    } catch (err) {
      alert(err.message || 'Gagal menyimpan jadwal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-layout" id="control-schedule">
      <Sidebar variant="bidan" />
      <div className="main-content">
        <Navbar variant="bidan" userName={user?.profile?.nama_lengkap || "Bidan Indah"} />
        <div className="page-content">
          <div className="page-header">
            <div className="page-title">
              <Link to="/bidan" className="back-btn"><IconArrowLeft size={18}/></Link>
              <h2>Kelola Jadwal Kontrol</h2>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={fetchData}><IconRefresh size={16}/> Refresh</button>
          </div>
          <div className="split-layout-equal">
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-5)' }}>Tetapkan Jadwal Kontrol</h3>
              <div className="glass-card" style={{ padding: 'var(--space-7)' }}>
                <div className="form-group" style={{ position: 'relative' }}>
                  <label className="form-label">Cari Pasien</label>
                  <input className="form-input" placeholder="Ketik nama pasien..." value={search}
                    onChange={(e) => { 
                      setSearch(e.target.value); 
                      setShowDropdown(true);
                      if (selectedPatient && e.target.value !== selectedPatient.nama_lengkap) {
                        setSelectedPatient(null);
                      }
                    }}
                    onFocus={() => setShowDropdown(true)} 
                    disabled={isSubmitting}
                  />
                  {showDropdown && search && !selectedPatient && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)', zIndex: 10, maxHeight: '160px', overflowY: 'auto' }}>
                      {filteredPatients.length === 0 ? (
                        <div style={{ padding: '10px 16px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Tidak ditemukan</div>
                      ) : filteredPatients.map(p => (
                        <div key={p.id} style={{ padding: '10px 16px', cursor: 'pointer', fontSize: '0.875rem', borderBottom: '1px solid var(--color-border-light)' }}
                          onClick={() => { setSelectedPatient(p); setSearch(p.nama_lengkap); setShowDropdown(false); }}
                          onMouseEnter={(e) => e.target.style.background = 'var(--color-primary-light)'}
                          onMouseLeave={(e) => e.target.style.background = 'transparent'}>{p.nama_lengkap}</div>
                      ))}
                    </div>
                  )}
                </div>
                {selectedPatient && (
                  <div style={{ padding: 'var(--space-4)', background: 'var(--color-primary-light)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div className="navbar-avatar" style={{ width: '36px', height: '36px', fontSize: '0.8125rem' }}>{selectedPatient.nama_lengkap.charAt(0)}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{selectedPatient.nama_lengkap}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{selectedPatient.umur || '-'} tahun • Gol. Darah {selectedPatient.golongan_darah || '-'}</div>
                    </div>
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Tanggal Kontrol Berikutnya</label>
                  <input type="date" className="form-input" value={tanggalKontrol} onChange={(e) => setTanggalKontrol(e.target.value)} disabled={isSubmitting} />
                </div>
                <div className="form-group">
                  <label className="form-label">Catatan / Pengingat <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(opsional)</span></label>
                  <textarea className="form-textarea" placeholder="Catatan khusus untuk pasien..." rows="3" value={catatan} onChange={(e) => setCatatan(e.target.value)} disabled={isSubmitting}></textarea>
                </div>
                <div className="info-box" style={{ marginBottom: 'var(--space-5)' }}>
                  <IconMessageCircle size={16}/> Pasien akan otomatis mendapat notifikasi WA H-1 sebelum jadwal kontrol
                </div>
                <button className="btn btn-primary btn-full btn-lg" onClick={handleSave} disabled={isSubmitting || !selectedPatient || !tanggalKontrol}>
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Jadwal Kontrol'}
                </button>
              </div>
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-5)' }}>Jadwal Kontrol Terdaftar</h3>
              <div className="data-table" style={{ fontSize: '0.875rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>
                    <th style={{ padding: '14px 16px', textAlign: 'left', background: 'var(--color-primary-light)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary-dark)', textTransform: 'uppercase' }}>Nama Pasien</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', background: 'var(--color-primary-light)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary-dark)', textTransform: 'uppercase' }}>Tanggal</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', background: 'var(--color-primary-light)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary-dark)', textTransform: 'uppercase' }}>Catatan</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', background: 'var(--color-primary-light)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary-dark)', textTransform: 'uppercase' }}>Notifikasi</th>
                  </tr></thead>
                  <tbody>
                    {isLoading ? (
                      <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Memuat data...</td></tr>
                    ) : schedules.length === 0 ? (
                      <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Belum ada jadwal kontrol terdaftar</td></tr>
                    ) : schedules.map((s) => (
                      <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 500 }}>{s.nama_pasien}</td>
                        <td style={{ padding: '12px 16px' }}>{new Date(s.tanggal_kontrol).toLocaleDateString('id-ID')}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontStyle: s.catatan ? 'normal' : 'italic' }}>{s.catatan || '-'}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span className={`badge ${s.status_notifikasi === 'Terkirim' ? 'badge-success' : 'badge-gray'}`}>
                            {s.status_notifikasi === 'Terkirim' ? <><IconCheckCircle size={12}/> WA Terkirim</> : s.status_notifikasi}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav variant="bidan" />
    </div>
  );
}
