import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import LoadingAnimation from '../../components/LoadingAnimation';
import { IconClipboard, IconFolder, IconPill, IconBell, IconCalendar, IconCheckCircle, IconArrowRight, IconUser, IconSettings } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './PatientPages.css';

const quickActions = [
  { icon: <IconClipboard size={28}/>, title: 'Daftar Kunjungan', desc: 'Buat janji temu baru', path: '/patient/visit' },
  { icon: <IconFolder size={28}/>, title: 'Rekam Medis', desc: 'Lihat riwayat pemeriksaan', path: '/patient/records' },
  { icon: <IconPill size={28}/>, title: 'Resep Saya', desc: 'Lihat resep dari bidan', path: '/patient/records' },
  { icon: <IconBell size={28}/>, title: 'Notifikasi', desc: 'Pengingat jadwal kontrol', path: '/patient/notifications' },
];

export default function PatientDashboard() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';

  const [klinikStatus, setKlinikStatus] = useState(null);
  const [jadwalKontrol, setJadwalKontrol] = useState([]);
  const [rekamMedis, setRekamMedis] = useState([]);
  const [notifikasi, setNotifikasi] = useState([]);
  
  const [profileData, setProfileData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusRes, jadwalRes, rmRes, profileRes, notifRes] = await Promise.all([
          api.get('/klinik/status'),
          api.get('/pasien/jadwal-kontrol'),
          api.get('/pasien/rekam-medis?limit=3'),
          api.get('/pasien/profile'),
          api.get('/pasien/notifikasi?limit=100')
        ]);
        setKlinikStatus(statusRes.data);
        
        // Find upcoming schedule
        const upcoming = (jadwalRes.data || []).filter(j => new Date(j.tanggal_kontrol) >= new Date(new Date().setHours(0,0,0,0)));
        // Sort by closest date
        upcoming.sort((a, b) => new Date(a.tanggal_kontrol) - new Date(b.tanggal_kontrol));
        setJadwalKontrol(upcoming);

        setRekamMedis(rmRes.data || []);
        setProfileData(profileRes.data);
        setNotifikasi(notifRes.data || []);
      } catch (err) {
        console.error("Gagal mengambil data dashboard pasien:", err);
      }
    };
    fetchData();
  }, []);

  const nextJadwal = jadwalKontrol.length > 0 ? jadwalKontrol[0] : null;

  return (
    <div className="app-layout" id="patient-dashboard">
      <Sidebar variant="patient" />
      <div className="main-content">
        <Navbar variant="patient" userName={user?.profile?.nama_lengkap || "Pasien"} />
        <div className="page-content">
          {activeTab === 'profile' ? (
            <div className="glass-card animate-fade-in" style={{ padding: 'var(--space-6)', maxWidth: '600px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-border-light)', paddingBottom: 'var(--space-4)' }}>
                <div style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '10px', borderRadius: '50%', display: 'flex' }}>
                  <IconUser size={24}/>
                </div>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--color-dark)' }}>Profil Saya</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8125rem', color: 'var(--color-text-light)' }}>Data pribadi terdaftar Anda di klinik IC+</p>
                </div>
              </div>
              {isLoadingProfile ? (
                <LoadingAnimation />
              ) : profileData ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(26,178,149,0.03)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(26,178,149,0.06)' }}>
                    <div style={{ background: 'var(--color-primary)', color: 'white', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>
                      {profileData.nama_lengkap ? profileData.nama_lengkap.substring(0, 1).toUpperCase() : 'P'}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.125rem', color: 'var(--color-dark)' }}>{profileData.nama_lengkap}</h4>
                      <span className="badge badge-success" style={{ marginTop: '6px' }}>Pasien Terdaftar</span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '16px', fontSize: '0.9375rem', padding: '0 8px' }}>
                    <span style={{ color: 'var(--color-text-light)' }}>Email</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-dark)' }}>{user?.email || '-'}</span>
                    
                    <span style={{ color: 'var(--color-text-light)' }}>Tanggal Lahir</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-dark)' }}>
                      {profileData.tanggal_lahir ? new Date(profileData.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                    </span>

                    <span style={{ color: 'var(--color-text-light)' }}>Jenis Kelamin</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-dark)', textTransform: 'capitalize' }}>{profileData.jenis_kelamin || '-'}</span>

                    <span style={{ color: 'var(--color-text-light)' }}>Nomor WhatsApp</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-dark)' }}>{profileData.no_wa || '-'}</span>

                    <span style={{ color: 'var(--color-text-light)' }}>Golongan Darah</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-dark)' }}>{profileData.golongan_darah || 'Tidak Tahu'}</span>

                    <span style={{ color: 'var(--color-text-light)' }}>Alamat</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-dark)' }}>{profileData.alamat || '-'}</span>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Gagal memuat data profil.</div>
              )}
            </div>
          ) : (
            <>
              <div className={`greeting-banner animate-fade-in ${klinikStatus && klinikStatus.status !== 'buka' ? 'clinic-closed' : ''}`}>
                <div>
                  <h2>Selamat Datang, {profileData?.nama_lengkap || user?.profile?.nama_lengkap || "Pasien"}</h2>
                  {klinikStatus && (
                    <div className={`clinic-status-pill ${klinikStatus.status === 'buka' ? 'status-open' : 'status-closed'}`} style={{ marginTop: '8px' }}>
                      <div className="dots-border"></div>
                      <span className={`pulse-dot ${klinikStatus.status === 'buka' ? '' : 'red'}`} style={{ marginRight: '8px' }}></span>
                      <span>
                        {klinikStatus.status === 'buka' ? 'Klinik Sedang Buka' : 'Klinik Sedang Tutup'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="greeting-date">{today}</div>
              </div>

              {/* 2-Column Dashboard Layout */}
              <div className="dashboard-container-2col animate-fade-in">
                {/* Left Column (Main / Operasional) */}
                <div className="dashboard-main-col">
                  {/* Stats Cards (3 Columns) */}
                  <div className="dashboard-stats-grid">
                    <div className="luxury-stat-card stat-pasien">
                      <div className="luxury-stat-icon-wrapper">
                        <IconFolder size={22} />
                      </div>
                      <div>
                        <div className="luxury-stat-value">{rekamMedis.length}</div>
                        <div className="luxury-stat-label">Total Kunjungan</div>
                      </div>
                    </div>
                    
                    <div className="luxury-stat-card stat-menunggu">
                      <div className="luxury-stat-icon-wrapper">
                        <IconCalendar size={22} />
                      </div>
                      <div>
                        <div className="luxury-stat-value">
                          {nextJadwal ? "1" : "0"}
                        </div>
                        <div className="luxury-stat-label">Jadwal Kontrol</div>
                      </div>
                    </div>

                    <div className="luxury-stat-card stat-selesai">
                      <div className="luxury-stat-icon-wrapper">
                        <IconBell size={22} />
                      </div>
                      <div>
                        <div className="luxury-stat-value">
                          {notifikasi.filter(n => !n.is_read).length}
                        </div>
                        <div className="luxury-stat-label">Notifikasi Baru</div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions (2x2 Grid) */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)' }}>
                    {quickActions.map((a, i) => (
                      <Link to={a.path} className="action-card-redesigned" key={i}>
                        <div className="action-icon-wrapper">
                          {a.icon}
                        </div>
                        <div className="action-card-text">
                          <div className="action-card-title">{a.title}</div>
                          <div className="action-card-desc">{a.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Control Schedule Banner */}
                  <div className="info-card-container">
                    <div className="info-card-inner">
                      <div>
                        <div className="info-card-label"><IconCalendar size={16}/> Jadwal Kontrol Berikutnya</div>
                        <div className="info-card-value">
                          {nextJadwal ? new Date(nextJadwal.tanggal_kontrol).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Tidak ada jadwal kontrol terdekat'}
                        </div>
                        {nextJadwal?.catatan && (
                          <div className="info-card-note">Keperluan: {nextJadwal.catatan}</div>
                        )}
                      </div>
                      {nextJadwal && (
                        <span className="badge badge-success badge-lg"><IconCheckCircle size={14}/> Pengingat Aktif</span>
                      )}
                    </div>
                  </div>

                  {/* Kunjungan Terakhir */}
                  <div>
                    <div className="section-header-redesigned">
                      <h3>Kunjungan Terakhir</h3>
                      <Link to="/patient/records" className="view-all">Lihat Semua <IconArrowRight size={16}/></Link>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                      {rekamMedis.length === 0 ? (
                        <div className="glass-card" style={{ padding: 'var(--space-5)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                          Belum ada riwayat kunjungan.
                        </div>
                      ) : rekamMedis.map((rm) => (
                        <div className="glass-card last-visit-item" key={rm.id}>
                          <div>
                            <div className="visit-date">{new Date(rm.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</div>
                            <div className="visit-complaint">{rm.keluhan_utama}</div>
                          </div>
                          <span className="badge badge-success">Selesai</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column (Sidebar / Dynamic Health Details) */}
                <div className="dashboard-side-col">
                  {rekamMedis.length > 0 ? (
                    (() => {
                      const rm = rekamMedis[0]; // Latest medical record
                      
                      // Calculate blood pressure status dynamically
                      let bpStatus = { text: 'Normal', color: 'var(--color-primary)' };
                      if (rm.tekanan_darah) {
                        const parts = rm.tekanan_darah.split('/');
                        if (parts.length === 2) {
                          const systol = parseInt(parts[0]);
                          const diastol = parseInt(parts[1]);
                          if (systol >= 140 || diastol >= 90) {
                            bpStatus = { text: 'Tinggi', color: 'var(--color-error)' };
                          } else if (systol >= 120 || diastol >= 80) {
                            bpStatus = { text: 'Pre-Hipertensi', color: 'var(--color-warning)' };
                          }
                        }
                      }

                      return (
                        <div className="glass-card patient-side-card health-summary-card">
                          <h4 className="side-card-title">
                            <span className="side-card-icon"><IconClipboard size={18} color="var(--color-primary)" /></span>
                            Kondisi Medis Terakhir
                          </h4>
                          <div className="visit-date-badge">Pemeriksaan: {new Date(rm.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                          
                          <div className="medical-vitals-grid">
                            <div className="vital-metric-item">
                              <span className="vital-label">Tekanan Darah</span>
                              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', flexWrap: 'wrap' }}>
                                <span className="vital-value">{rm.tekanan_darah || '-'}</span>
                                <span className="vital-unit">mmHg</span>
                              </div>
                              {rm.tekanan_darah && (
                                <div style={{ marginTop: '6px' }}>
                                  <span className="vital-badge-inline" style={{ backgroundColor: `${bpStatus.color}15`, color: bpStatus.color }}>
                                    {bpStatus.text}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="vital-metric-item">
                              <span className="vital-label">Berat Badan</span>
                              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                <span className="vital-value">{rm.berat_badan ? `${rm.berat_badan}` : '-'}</span>
                                <span className="vital-unit">kg</span>
                              </div>
                            </div>

                            {profileData?.jenis_kelamin === 'perempuan' && profileData?.is_hamil && rm.tinggi_fundus_uteri && (
                              <div className="vital-metric-item pregnancy-theme-border">
                                <span className="vital-label">Tinggi Fundus</span>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                  <span className="vital-value">{rm.tinggi_fundus_uteri}</span>
                                  <span className="vital-unit">cm</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {profileData?.jenis_kelamin === 'perempuan' && profileData?.is_hamil && rm.kondisi_janin && (
                            <div className="vital-full-width-box pregnancy-theme-bg">
                              <span className="vital-box-label">Kondisi Janin</span>
                              <p className="vital-box-text">{rm.kondisi_janin}</p>
                            </div>
                          )}

                          {rm.catatan_tambahan && (
                            <div className="vital-full-width-box">
                              <span className="vital-box-label">Catatan Bidan</span>
                              <p className="vital-box-text">{rm.catatan_tambahan}</p>
                            </div>
                          )}

                          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
                            <Link to="/patient/records" className="btn btn-ghost btn-sm" style={{ width: '100%', fontSize: '0.8125rem' }}>
                              Lihat Riwayat Lengkap <IconArrowRight size={14} />
                            </Link>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    /* If no medical records: display patient demographic health profile card */
                    <div className="glass-card patient-side-card health-profile-card">
                      <h4 className="side-card-title">
                        <span className="side-card-icon"><IconUser size={18} color="var(--color-primary)" /></span>
                        Profil Kesehatan
                      </h4>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)', margin: '0 0 16px 0', lineHeight: '1.4' }}>
                        Berikut adalah rangkuman data klinis terdaftar Anda di sistem Indah Care Plus.
                      </p>
                      
                      <div className="profile-details-grid">
                        <div className="profile-detail-item">
                          <span className="detail-label">Golongan Darah</span>
                          <span className="detail-value">{profileData?.golongan_darah || 'Tidak Tahu'}</span>
                        </div>
                        <div className="profile-detail-item">
                          <span className="detail-label">Usia</span>
                          <span className="detail-value">{profileData?.umur ? `${profileData.umur} Tahun` : '-'}</span>
                        </div>
                        <div className="profile-detail-item">
                          <span className="detail-label">Gender</span>
                          <span className="detail-value" style={{ textTransform: 'capitalize' }}>{profileData?.jenis_kelamin || '-'}</span>
                        </div>
                        <div className="profile-detail-item">
                          <span className="detail-label">Status Kehamilan</span>
                          <span className="detail-value">
                            {profileData?.jenis_kelamin === 'perempuan' && profileData?.is_hamil ? 'Hamil' : 'Tidak Hamil'}
                          </span>
                        </div>
                      </div>

                      <div className="no-records-alert-box">
                        <p style={{ margin: 0, fontWeight: 600 }}>Belum Ada Catatan Pemeriksaan</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', opacity: 0.85 }}>
                          Lakukan pendaftaran antrian untuk melakukan pemeriksaan pertama dengan Bidan.
                        </p>
                        <Link to="/patient/visit" className="btn btn-secondary btn-sm" style={{ marginTop: '12px', width: '100%', border: 'none', background: 'white', color: 'var(--color-primary-dark)', fontWeight: 700 }}>
                          Daftar Kunjungan Baru
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <BottomNav variant="patient" />
    </div>
  );
}
