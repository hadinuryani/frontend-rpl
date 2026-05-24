import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import { IconUser, IconClock, IconCheckCircle, IconAlertTriangle, IconQueue, IconCalendar, IconChart, IconUsers, IconPackage, IconTrendingUp, IconArrowRight, IconSettings, IconShield } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './BidanPages.css';

const quickNav = [
  { icon: <IconQueue size={24}/>, title: 'Kelola Antrian', desc: 'Atur antrian pasien hari ini', path: '/bidan/queue' },
  { icon: <IconCalendar size={24}/>, title: 'Jadwal Kontrol', desc: 'Tetapkan jadwal kontrol pasien', path: '/bidan/schedule' },
  { icon: <IconChart size={24}/>, title: 'Monitor Kunjungan', desc: 'Pantau data kunjungan pasien', path: '/bidan/monitor' },
  { icon: <IconUsers size={24}/>, title: 'Data Pasien', desc: 'Kelola data pasien terdaftar', path: '/bidan/patients' },
  { icon: <IconPackage size={24}/>, title: 'Inventori Obat', desc: 'Manajemen stok obat klinik', path: '/bidan/inventory' },
  { icon: <IconTrendingUp size={24}/>, title: 'Laporan', desc: 'Laporan klinik keseluruhan', path: '/bidan/monitor' },
];

export default function BidanDashboard() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';

  const [isOpen, setIsOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [stats, setStats] = useState({
    total_pasien_hari_ini: 0,
    antrian_menunggu: 0,
    antrian_selesai: 0,
    stok_obat_kritis: 0,
    total_pasien_terdaftar: 0
  });

  const fetchDashboardData = async () => {
    try {
      const statusRes = await api.get('/klinik/status');
      setIsOpen(statusRes.data.status === 'buka');
      if (statusRes.data.updated_at) {
        const d = new Date(statusRes.data.updated_at);
        setLastUpdated(d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      }

      const statsRes = await api.get('/bidan/dashboard');
      setStats(statsRes.data);
    } catch (err) {
      console.error("Gagal mengambil data dashboard:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const toggleClinicStatus = async () => {
    try {
      const newStatus = isOpen ? 'tutup' : 'buka';
      await api.put('/bidan/klinik/status', { status: newStatus });
      setIsOpen(!isOpen);
      setLastUpdated(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      alert(err.message || 'Gagal mengubah status klinik');
    }
  };

  const statCards = [
    { icon: <IconUser size={24}/>, value: stats.total_pasien_hari_ini, label: 'Pasien Hari Ini', color: 'var(--color-primary-light)', textColor: null },
    { icon: <IconClock size={24}/>, value: stats.antrian_menunggu, label: 'Antrian Menunggu', color: 'rgba(233,196,106,0.15)', textColor: null },
    { icon: <IconCheckCircle size={24}/>, value: stats.antrian_selesai, label: 'Antrian Selesai', color: 'var(--color-primary-light)', textColor: null },
    { icon: <IconAlertTriangle size={24}/>, value: stats.stok_obat_kritis, label: 'Stok Obat Kritis', color: 'rgba(224,92,92,0.1)', textColor: 'var(--color-error)' },
    { icon: <IconUsers size={24}/>, value: stats.total_pasien_terdaftar, label: 'Total Pasien Terdaftar', color: 'rgba(26,178,149,0.15)', textColor: null },
  ];

  return (
    <div className="app-layout" id="bidan-dashboard">
      <Sidebar variant="bidan" />
      <div className="main-content">
        <Navbar variant="bidan" userName={user?.profile?.nama_lengkap || 'Bidan Indah'} />
        <div className="page-content">
          {activeTab === 'profile' ? (
            <div className="glass-card animate-fade-in" style={{ padding: 'var(--space-6)', maxWidth: '600px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-border-light)', paddingBottom: 'var(--space-4)' }}>
                <div style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '10px', borderRadius: '50%', display: 'flex' }}>
                  <IconUser size={24}/>
                </div>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--color-dark)' }}>Profil Saya</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8125rem', color: 'var(--color-text-light)' }}>Informasi akun dan profil bidan klinik</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(26,178,149,0.03)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(26,178,149,0.06)' }}>
                  <div style={{ background: 'var(--color-primary)', color: 'white', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>
                    {user?.profile?.nama_lengkap ? user.profile.nama_lengkap.substring(0, 1).toUpperCase() : 'B'}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.125rem', color: 'var(--color-dark)' }}>{user?.profile?.nama_lengkap || 'Bidan Klinik'}</h4>
                    <span className="badge badge-success" style={{ marginTop: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <IconShield size={12}/> Bidan Utama
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '16px', fontSize: '0.9375rem', padding: '0 8px' }}>
                  <span style={{ color: 'var(--color-text-light)' }}>Email Login</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-dark)' }}>{user?.email || 'bidan@ic-plus.com'}</span>
                  
                  <span style={{ color: 'var(--color-text-light)' }}>Nama Lengkap</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-dark)' }}>{user?.profile?.nama_lengkap || 'Bidan Klinik'}</span>

                  <span style={{ color: 'var(--color-text-light)' }}>Nomor WhatsApp</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-dark)' }}>{user?.profile?.no_wa || '08123456789'}</span>

                  <span style={{ color: 'var(--color-text-light)' }}>Alamat</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-dark)' }}>{user?.profile?.alamat || 'Klinik Bersalin IC+'}</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className={`clinic-toggle-card ${isOpen ? 'is-open' : 'is-closed'} animate-fade-in`}>
                <div className="toggle-info">
                  <h3>Status Klinik Hari Ini</h3>
                  <div className="toggle-time">{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div className="toggle-center">
                  <div className="power-toggle-container">
                    <input 
                      type="checkbox" 
                      id="clinic-toggle" 
                      checked={isOpen} 
                      onChange={toggleClinicStatus} 
                    />
                    <label htmlFor="clinic-toggle" className="power-toggle-button">
                      <span className="power-toggle-icon">
                        <svg
                          viewBox="0 0 30.143 30.143"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g>
                            <path d="M20.034,2.357v3.824c3.482,1.798,5.869,5.427,5.869,9.619c0,5.98-4.848,10.83-10.828,10.83 c-5.982,0-10.832-4.85-10.832-10.83c0-3.844,2.012-7.215,5.029-9.136V2.689C4.245,4.918,0.731,9.945,0.731,15.801 c0,7.921,6.42,14.342,14.34,14.342c7.924,0,14.342-6.421,14.342-14.342C29.412,9.624,25.501,4.379,20.034,2.357z"></path>
                            <path d="M14.795,17.652c1.576,0,1.736-0.931,1.736-2.076V2.08c0-1.148-0.16-2.08-1.736-2.08 c-1.57,0-1.732,0.932-1.732,2.08v13.496C13.062,16.722,13.225,17.652,14.795,17.652z"></path>
                          </g>
                        </svg>
                      </span>
                    </label>
                  </div>
                  <span className="toggle-label">{isOpen ? 'BUKA' : 'TUTUP'}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="toggle-status-text">Klinik Sedang {isOpen ? 'BUKA' : 'TUTUP'}</div>
                  <div className="toggle-updated">Diperbarui {lastUpdated || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>

              <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-5)', marginBottom: 'var(--space-7)' }}>
                {statCards.map((s, i) => (
                  <div className="stat-card" key={i} style={{ position: 'relative' }}>
                    <div className="stat-icon" style={{ background: s.color }}>{s.icon}</div>
                    <div className="stat-value" style={s.textColor ? { color: s.textColor } : {}}>{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                    {i === 3 && s.value > 0 && <span className="pulse-dot red" style={{ position: 'absolute', top: '16px', right: '16px' }}></span>}
                  </div>
                ))}
              </div>

              <div className="section-title"><h3>Menu Cepat</h3></div>
              <div className="grid-2x3 stagger-children">
                {quickNav.map((n, i) => (
                  <Link to={n.path} className="action-card" key={i} style={{ textAlign: 'left', flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <div className="action-icon"><span>{n.icon}</span></div>
                    <div>
                      <div className="action-title">{n.title}</div>
                      <div className="action-desc">{n.desc}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', color: 'var(--color-text-muted)' }}><IconArrowRight size={20}/></span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <BottomNav variant="bidan" />
    </div>
  );
}
