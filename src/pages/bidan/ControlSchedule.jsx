import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import { IconArrowLeft, IconMessageCircle, IconCheckCircle, IconRefresh, IconSettings } from '../../components/Icons';
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

  const [waktuPengingat, setWaktuPengingat] = useState('08:00');
  const [namaKlinik, setNamaKlinik] = useState('Klinik Indah Care Plus (IC+)');
  const [alamatKlinik, setAlamatKlinik] = useState('Jl. Indah Care No. 45, Jakarta');
  const [jamKontrol, setJamKontrol] = useState('08:00 - selesai');
  const [isSavingSetting, setIsSavingSetting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [patientsRes, schedulesRes, settingRes] = await Promise.all([
        api.get('/bidan/pasien?limit=100'),
        api.get('/bidan/jadwal-kontrol'),
        api.get('/bidan/jadwal-kontrol/waktu-pengingat')
      ]);
      setPatients(patientsRes.data || []);
      setSchedules(schedulesRes.data || []);
      setWaktuPengingat(settingRes.data?.waktu_pengingat || '08:00');
      setNamaKlinik(settingRes.data?.nama_klinik || 'Klinik Indah Care Plus (IC+)');
      setAlamatKlinik(settingRes.data?.alamat_klinik || 'Jl. Indah Care No. 45, Jakarta');
      setJamKontrol(settingRes.data?.jam_kontrol || '08:00 - selesai');
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

  const handleSaveSetting = async () => {
    if (!waktuPengingat) return alert("Waktu pengingat wajib diisi");
    setIsSavingSetting(true);
    try {
      await api.put('/bidan/jadwal-kontrol/waktu-pengingat', {
        waktu_pengingat: waktuPengingat,
        nama_klinik: namaKlinik,
        alamat_klinik: alamatKlinik,
        jam_kontrol: jamKontrol
      });
      alert('Pengaturan WhatsApp berhasil diperbarui!');
    } catch (err) {
      alert(err.message || 'Gagal menyimpan pengaturan');
    } finally {
      setIsSavingSetting(false);
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

              {/* Setting reminder time card */}
              <div className="glass-card" style={{ padding: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', margin: '0 0 var(--space-4) 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', color: 'var(--color-text)' }}>
                  <IconSettings size={18} color="var(--color-primary)"/> Pengaturan Pengiriman WA & Info Klinik
                </h4>
                
                <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                  <label className="form-label" style={{ fontSize: '0.8125rem' }}>Nama Klinik</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={namaKlinik} 
                    onChange={(e) => setNamaKlinik(e.target.value)} 
                    disabled={isSavingSetting}
                    placeholder="Nama Klinik"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                  <label className="form-label" style={{ fontSize: '0.8125rem' }}>Alamat Klinik</label>
                  <textarea 
                    className="form-textarea" 
                    value={alamatKlinik} 
                    onChange={(e) => setAlamatKlinik(e.target.value)} 
                    disabled={isSavingSetting}
                    placeholder="Alamat Klinik"
                    rows="2"
                  ></textarea>
                </div>

                <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                  <label className="form-label" style={{ fontSize: '0.8125rem' }}>Jam Layanan Kontrol (Default)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={jamKontrol} 
                    onChange={(e) => setJamKontrol(e.target.value)} 
                    disabled={isSavingSetting}
                    placeholder="Contoh: 08:00 - selesai"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 'var(--space-5)' }}>
                  <label className="form-label" style={{ fontSize: '0.8125rem' }}>Jam Pengiriman Notifikasi (H-1)</label>
                  <input 
                    type="time" 
                    className="form-input" 
                    value={waktuPengingat} 
                    onChange={(e) => setWaktuPengingat(e.target.value)} 
                    disabled={isSavingSetting}
                    style={{ maxWidth: '140px' }}
                  />
                </div>

                <button 
                  className="btn btn-primary btn-full" 
                  onClick={handleSaveSetting} 
                  disabled={isSavingSetting}
                >
                  {isSavingSetting ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
                </button>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 'var(--space-3) 0 0 0', lineHeight: 1.4 }}>
                  Pasien akan mendapat notifikasi WhatsApp pada jam yang ditentukan satu hari sebelum tanggal kontrol mereka dengan template pesan yang telah disesuaikan.
                </p>
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
                          <span className={`badge ${s.status_notifikasi?.toLowerCase() === 'terkirim' ? 'badge-success' : s.status_notifikasi?.toLowerCase() === 'gagal' ? 'badge-danger' : 'badge-gray'}`}>
                            {s.status_notifikasi?.toLowerCase() === 'terkirim' ? (
                              <><IconCheckCircle size={12}/> WA Terkirim</>
                            ) : s.status_notifikasi?.toLowerCase() === 'gagal' ? (
                              'Gagal Kirim'
                            ) : (
                              s.status_notifikasi || 'Menunggu'
                            )}
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
