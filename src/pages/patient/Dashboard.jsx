import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
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
  
  const [profileData, setProfileData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusRes, jadwalRes, rmRes] = await Promise.all([
          api.get('/klinik/status'),
          api.get('/pasien/jadwal-kontrol'),
          api.get('/pasien/rekam-medis?limit=3')
        ]);
        setKlinikStatus(statusRes.data);
        
        // Find upcoming schedule
        const upcoming = (jadwalRes.data || []).filter(j => new Date(j.tanggal_kontrol) >= new Date(new Date().setHours(0,0,0,0)));
        // Sort by closest date
        upcoming.sort((a, b) => new Date(a.tanggal_kontrol) - new Date(b.tanggal_kontrol));
        setJadwalKontrol(upcoming);

        setRekamMedis(rmRes.data || []);
      } catch (err) {
        console.error("Gagal mengambil data dashboard pasien:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === 'profile') {
      const fetchProfile = async () => {
        setIsLoadingProfile(true);
        try {
          const res = await api.get('/pasien/profile');
          setProfileData(res.data);
        } catch (err) {
          console.error("Gagal mengambil data profil:", err);
        } finally {
          setIsLoadingProfile(false);
        }
      };
      fetchProfile();
    }
  }, [activeTab]);

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
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Memuat data profil...</div>
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
              <div className="greeting-banner animate-fade-in">
                <div>
                  <h2>Selamat Datang, {user?.profile?.nama_lengkap || "Sari Indah"}</h2>
                  {klinikStatus && (
                    <div className="clinic-status-pill" style={{ background: klinikStatus.status === 'buka' ? 'rgba(255,255,255,0.2)' : 'rgba(200,50,50,0.5)', color: 'white', display: 'inline-flex', marginTop: '8px' }}>
                      <span className="pulse-dot" style={{ background: klinikStatus.status === 'buka' ? 'white' : '#ffcccc' }}></span>
                      {klinikStatus.status === 'buka' ? 'Klinik Sedang Buka' : 'Klinik Sedang Tutup'}
                    </div>
                  )}
                </div>
                <div className="greeting-date">{today}</div>
              </div>

              <div className="grid-4 stagger-children" style={{ marginBottom: 'var(--space-7)' }}>
                {quickActions.map((a, i) => (
                  <Link to={a.path} className="action-card" key={i}>
                    <div className="action-icon"><span>{a.icon}</span></div>
                    <div className="action-title">{a.title}</div>
                    <div className="action-desc">{a.desc}</div>
                  </Link>
                ))}
              </div>

              <div className="info-card" style={{ marginBottom: 'var(--space-7)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}><IconCalendar size={16}/> Jadwal Kontrol Berikutnya</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-dark)' }}>
                      {nextJadwal ? new Date(nextJadwal.tanggal_kontrol).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Tidak ada jadwal kontrol terdekat'}
                    </div>
                  </div>
                  {nextJadwal && (
                    <span className="badge badge-success badge-lg"><IconCheckCircle size={14}/> H-1 Pengingat Aktif</span>
                  )}
                </div>
              </div>

              <div className="section-title">
                <h3>Kunjungan Terakhir</h3>
                <Link to="/patient/records" className="view-all">Lihat Semua <IconArrowRight size={16}/></Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {rekamMedis.length === 0 ? (
                  <div className="glass-card" style={{ padding: 'var(--space-5)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Belum ada riwayat kunjungan.
                  </div>
                ) : rekamMedis.map((rm) => (
                  <div className="glass-card" key={rm.id} style={{ padding: 'var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--color-dark)', marginBottom: '4px' }}>{new Date(rm.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>{rm.keluhan_utama}</div>
                    </div>
                    <span className="badge badge-success">Selesai</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <BottomNav variant="patient" />
    </div>
  );
}
