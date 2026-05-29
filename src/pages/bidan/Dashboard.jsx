import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import { IconUser, IconUsers, IconClock, IconCheckCircle, IconAlertTriangle, IconCalendar, IconArrowRight, IconShield } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import api from '../../services/api';
import './BidanPages.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import LoadingAnimation from '../../components/LoadingAnimation';

// Custom Tooltip for the Patient Visit Bar Chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-chart-tooltip">
        <p className="tooltip-label">{label}</p>
        <p className="tooltip-value">
          <span className="tooltip-dot"></span>
          Kunjungan: <strong>{payload[0].value}</strong> pasien
        </p>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for the Stock Donut Chart
const CustomDonutTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-chart-tooltip" style={{ borderLeftColor: data.color }}>
        <p className="tooltip-label" style={{ color: data.color }}>{data.name}</p>
        <p className="tooltip-value">
          Jumlah: <strong>{data.value}</strong> jenis obat
        </p>
      </div>
    );
  }
  return null;
};

export default function BidanDashboard() {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';

  const [isOpen, setIsOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [stats, setStats] = useState({
    total_pasien_hari_ini: 0,
    antrian_menunggu: 0,
    antrian_selesai: 0,
    stok_obat_kritis: 0
  });

  const [chartKunjungan, setChartKunjungan] = useState([]);
  const [chartObat, setChartObat] = useState(null);
  const [alerts, setAlerts] = useState({
    obat_kritis: [],
    jadwal_hari_ini: []
  });
  const [loadingCharts, setLoadingCharts] = useState(true);

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

  const fetchChartAndAlertData = async () => {
    setLoadingCharts(true);
    try {
      const kunjunganRes = await api.get('/bidan/dashboard/chart-kunjungan');
      setChartKunjungan(kunjunganRes.data || []);

      const obatRes = await api.get('/bidan/dashboard/chart-obat');
      setChartObat(obatRes.data || null);

      const alertsRes = await api.get('/bidan/dashboard/alerts');
      const data = alertsRes.data || {};
      setAlerts({
        obat_kritis: data.obat_kritis || [],
        jadwal_hari_ini: data.jadwal_hari_ini || []
      });
    } catch (err) {
      console.error("Gagal mengambil data chart/alert dashboard:", err);
    } finally {
      setLoadingCharts(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchChartAndAlertData();
  }, []);

  const toggleClinicStatus = async () => {
    try {
      const newStatus = isOpen ? 'tutup' : 'buka';
      await api.put('/bidan/klinik/status', { status: newStatus });
      setIsOpen(!isOpen);
      setLastUpdated(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      await showAlert(err.message || 'Gagal mengubah status klinik', { variant: 'error', title: 'Gagal' });
    }
  };

  const statCards = [
    { icon: <IconUsers size={22} />, value: stats.total_pasien_hari_ini, label: 'Pasien Hari Ini' },
    { icon: <IconClock size={22} />, value: stats.antrian_menunggu, label: 'Antrian Menunggu' },
    { icon: <IconCheckCircle size={22} />, value: stats.antrian_selesai, label: 'Antrian Selesai' },
  ];

  const donutData = chartObat ? [
    { name: 'Stok Aman', value: chartObat.stok_aman, color: '#40916c', gradient: 'url(#donutAman)' },
    { name: 'Hampir Habis', value: chartObat.hampir_habis, color: '#e9c46a', gradient: 'url(#donutHampirHabis)' },
    { name: 'Stok Habis', value: chartObat.stok_habis, color: '#e05c5c', gradient: 'url(#donutStokHabis)' },
    { name: 'Hampir Kadaluarsa', value: chartObat.hampir_kadaluarsa, color: '#b5943a', gradient: 'url(#donutHampirKadaluarsa)' },
    { name: 'Kadaluarsa', value: chartObat.kadaluarsa, color: '#708298', gradient: 'url(#donutKadaluarsa)' },
  ].filter(item => item.value > 0) : [];

  const totalObat = chartObat ? (chartObat.stok_aman + chartObat.hampir_habis + chartObat.stok_habis + chartObat.hampir_kadaluarsa + chartObat.kadaluarsa) : 0;

  const getObatStatusLabel = (item) => {
    switch (item.status_stok) {
      case 'habis':
        return { text: 'Stok Habis', class: 'danger' };
      case 'kadaluarsa':
        return { text: 'Kadaluarsa', class: 'danger' };
      case 'hampir_kadaluarsa':
        return { text: 'Hampir Kadaluarsa', class: 'warning' };
      case 'hampir_habis':
        return { text: `Stok Kritis: ${item.jumlah_stok} ${item.satuan}`, class: 'warning' };
      default:
        return { text: 'Aman', class: 'info' };
    }
  };

  const formatTimeOnly = (dateStr) => {
    try {
      const d = new Date(dateStr);
      if (d.getHours() === 0 && d.getMinutes() === 0) {
        return '08:00 - selesai';
      }
      return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    } catch (e) {
      return 'Hari Ini';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) {
      return 'Selamat Pagi';
    } else if (hour >= 11 && hour < 15) {
      return 'Selamat Siang';
    } else if (hour >= 15 && hour < 18) {
      return 'Selamat Sore';
    } else {
      return 'Selamat Malam';
    }
  };

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
              {/* Redesigned Welcome Header & Status Klinik Toggle Banner */}
              <div className="clinic-toggle-banner animate-fade-in">
                <div className="clinic-banner-greeting">
                  <h3>{getGreeting()}, Bidan {user?.profile?.nama_lengkap ? user.profile.nama_lengkap.split(' ')[0] : 'Indah'}!</h3>
                  <p>Hari ini ada {stats.total_pasien_hari_ini} kunjungan terdaftar ({stats.antrian_menunggu} antrean menunggu).</p>
                </div>
                <div className="clinic-banner-control">
                  <div className={`clinic-status-pill ${isOpen ? 'status-open' : 'status-closed'}`}>
                    <div className="dots-border"></div>
                    <span className={`pulse-dot ${isOpen ? '' : 'red'}`} style={{ marginRight: '8px' }}></span>
                    <span>
                      KLINIK {isOpen ? 'BUKA' : 'TUTUP'}
                    </span>
                  </div>
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
                </div>
              </div>

              {loadingCharts ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', background: 'var(--glass-bg)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', border: '1px solid var(--color-border-light)' }}>
                  <LoadingAnimation />
                  <p style={{ color: 'var(--color-text-light)', fontSize: '0.875rem', marginTop: 'var(--space-2)' }}>Memuat data dashboard...</p>
                </div>
              ) : (
                /* 2-Column Container */
                <div className="dashboard-container-2col animate-fade-in">
                  
                  {/* Left Column (Main / Operasional) */}
                  <div className="dashboard-main-col">
                    {/* Stat Cards (3 Columns) */}
                    <div className="dashboard-stats-grid">
                      {statCards.map((s, i) => {
                        const classes = [
                          'luxury-stat-card',
                          i === 0 ? 'stat-pasien' : i === 1 ? 'stat-menunggu' : 'stat-selesai'
                        ].join(' ');
                        
                        return (
                          <div className={classes} key={i}>
                            <div className="luxury-stat-icon-wrapper">
                              {s.icon}
                            </div>
                            <div>
                              <div className="luxury-stat-value">{s.value}</div>
                              <div className="luxury-stat-label">{s.label}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bar Chart Card */}
                    <div className="glass-card main-chart-card">
                      <h4 style={{ margin: '0 0 var(--space-4) 0', fontSize: '1.0625rem', fontFamily: 'var(--font-heading)', color: 'var(--color-dark)', fontWeight: 700 }}>
                        Tren Kunjungan Pasien (7 Hari Terakhir)
                      </h4>
                      <div className="chart-container">
                        {chartKunjungan.length === 0 ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                            Tidak ada data kunjungan.
                          </div>
                        ) : (
                          <div className="bar-chart-wrapper">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={chartKunjungan} margin={{ top: 15, right: 10, left: -25, bottom: 0 }}>
                                <defs>
                                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={1} />
                                    <stop offset="100%" stopColor="var(--color-primary-light)" stopOpacity={0.4} />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(200, 230, 214, 0.4)" />
                                <XAxis dataKey="hari" tickLine={false} axisLine={false} tick={{ fill: 'var(--color-text-light)', fontSize: 11, fontWeight: 500 }} />
                                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: 'var(--color-text-light)', fontSize: 11, fontWeight: 500 }} />
                                <Tooltip 
                                  content={<CustomTooltip />}
                                  cursor={{ fill: 'rgba(64,145,108,0.04)', radius: [6, 6, 0, 0] }}
                                />
                                <Bar 
                                  dataKey="jumlah" 
                                  name="Kunjungan" 
                                  fill="url(#barGradient)" 
                                  radius={[6, 6, 0, 0]} 
                                  barSize={36} 
                                  background={{ fill: 'rgba(64, 145, 108, 0.04)', radius: [6, 6, 0, 0] }}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Today's Schedules (List) */}
                    <div className="glass-card alert-section-card" style={{ minHeight: 'auto' }}>
                      <h4 style={{ margin: '0 0 var(--space-4) 0', fontSize: '1.0625rem', fontFamily: 'var(--font-heading)', color: 'var(--color-dark)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <IconCalendar size={18} style={{ color: 'var(--color-accent)' }} />
                        Jadwal Kontrol Pasien Hari Ini
                      </h4>
                      <div className="alert-list" style={{ maxHeight: '260px' }}>
                        {!alerts.jadwal_hari_ini || alerts.jadwal_hari_ini.length === 0 ? (
                          <div className="alert-empty-state" style={{ height: '120px' }}>
                            <IconCheckCircle size={28} style={{ color: 'var(--color-primary)', opacity: 0.7 }} />
                            <span>Tidak ada jadwal kontrol pasien untuk hari ini.</span>
                          </div>
                        ) : (
                          alerts.jadwal_hari_ini.slice(0, 5).map((item) => (
                            <div key={item.id} className="alert-item info" style={{ padding: 'var(--space-3)' }}>
                              <div className="alert-item-content">
                                <div className="alert-item-title" style={{ fontSize: '0.875rem' }}>{item.nama_pasien}</div>
                                <div className="alert-item-desc" style={{ fontSize: '0.75rem' }}>
                                  {formatTimeOnly(item.tanggal_kontrol)} {item.catatan ? `• ${item.catatan}` : ''}
                                </div>
                              </div>
                              <Link to="/bidan/schedule" className="alert-item-action" title="Buka jadwal kontrol" style={{ fontSize: '0.75rem' }}>
                                Detail <IconArrowRight size={12} />
                              </Link>
                            </div>
                          ))
                        )}
                      </div>
                      {alerts.jadwal_hari_ini && alerts.jadwal_hari_ini.length > 0 && (
                        <Link to="/bidan/schedule" className="card-footer-link" style={{ marginTop: 'var(--space-3)' }}>
                          Lihat Semua Jadwal Kontrol <IconArrowRight size={12} />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Right Column (Sidebar / Logistik Obat) */}
                  <div className="dashboard-side-col">
                    {/* Donut Chart Card */}
                    <div className="glass-card side-chart-card" style={{ height: 'auto' }}>
                      <h4 style={{ margin: '0 0 var(--space-3) 0', fontSize: '1.0625rem', fontFamily: 'var(--font-heading)', color: 'var(--color-dark)', fontWeight: 700 }}>
                        Status Stok Obat
                      </h4>
                      <div className="chart-container" style={{ position: 'relative', height: '180px' }}>
                        {donutData.length === 0 ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                            Semua stok aman atau data kosong.
                          </div>
                        ) : (
                          <>
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <defs>
                                  {/* Gradient for Stok Aman */}
                                  <linearGradient id="donutAman" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#40916c" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#74c69d" stopOpacity={1} />
                                  </linearGradient>
                                  {/* Gradient for Hampir Habis */}
                                  <linearGradient id="donutHampirHabis" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#e9c46a" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#f4a261" stopOpacity={1} />
                                  </linearGradient>
                                  {/* Gradient for Stok Habis */}
                                  <linearGradient id="donutStokHabis" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#e05c5c" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#f28f8f" stopOpacity={1} />
                                  </linearGradient>
                                  {/* Gradient for Hampir Kadaluarsa */}
                                  <linearGradient id="donutHampirKadaluarsa" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#b5943a" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#d4af37" stopOpacity={1} />
                                  </linearGradient>
                                  {/* Gradient for Kadaluarsa */}
                                  <linearGradient id="donutKadaluarsa" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#708298" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#a0b2c6" stopOpacity={1} />
                                  </linearGradient>
                                </defs>
                                {/* Subtle background track for the donut */}
                                <Pie
                                  data={[{ value: 1 }]}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={42}
                                  outerRadius={66}
                                  fill="rgba(200, 230, 214, 0.12)"
                                  isAnimationActive={false}
                                  dataKey="value"
                                />
                                <Pie
                                  data={donutData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={42}
                                  outerRadius={66}
                                  paddingAngle={3}
                                  cornerRadius={5}
                                  dataKey="value"
                                >
                                  {donutData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.gradient} />
                                  ))}
                                </Pie>
                                <Tooltip content={<CustomDonutTooltip />} />
                              </PieChart>
                            </ResponsiveContainer>
                            
                            {/* Centered Total Label inside Donut Hole */}
                            <div className="donut-center-label">
                              <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-dark)', display: 'block', lineHeight: 1 }}>{totalObat}</span>
                              <span style={{ fontSize: '0.6rem', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 'bold' }}>Jenis Obat</span>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {/* Premium Custom HTML Legend */}
                      {donutData.length > 0 && (
                        <div className="donut-legend-grid">
                          {donutData.map((entry, index) => (
                            <div key={index} className="donut-legend-item">
                              <span className="legend-dot" style={{ backgroundColor: entry.color }}></span>
                              <span className="legend-label">{entry.name}</span>
                              <span className="legend-value" style={{ backgroundColor: `${entry.color}15`, color: entry.color }}>{entry.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Critical Meds Alert Card */}
                    <div className="glass-card side-alert-card" style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 var(--space-3) 0', fontSize: '1.0625rem', fontFamily: 'var(--font-heading)', color: 'var(--color-dark)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <IconAlertTriangle size={18} style={{ color: 'var(--color-error)' }} />
                        Obat Butuh Perhatian
                      </h4>
                      <div className="alert-list" style={{ maxHeight: '250px' }}>
                        {!alerts.obat_kritis || alerts.obat_kritis.length === 0 ? (
                          <div className="alert-empty-state" style={{ height: '150px' }}>
                            <IconCheckCircle size={28} style={{ color: 'var(--color-primary)', opacity: 0.7 }} />
                            <span>Semua stok obat aman & terkendali.</span>
                          </div>
                        ) : (
                          alerts.obat_kritis.slice(0, 4).map((item) => {
                            const statusInfo = getObatStatusLabel(item);
                            return (
                              <div key={item.id} className={`alert-item ${statusInfo.class}`} style={{ padding: 'var(--space-3)' }}>
                                <div className="alert-item-content">
                                  <div className="alert-item-title" style={{ fontSize: '0.8125rem' }}>{item.nama_obat}</div>
                                  <div className="alert-item-desc" style={{ fontSize: '0.75rem' }}>{statusInfo.text}</div>
                                </div>
                                <Link to="/bidan/inventory" className="alert-item-action" title="Kelola stok obat" style={{ fontSize: '0.75rem' }}>
                                  Atur <IconArrowRight size={12} />
                                </Link>
                              </div>
                            );
                          })
                        )}
                      </div>
                      {alerts.obat_kritis && alerts.obat_kritis.length > 0 && (
                        <Link to="/bidan/inventory" className="card-footer-link" style={{ marginTop: 'var(--space-2)' }}>
                          Kelola Semua Obat <IconArrowRight size={12} />
                        </Link>
                      )}
                    </div>
                  </div>

                </div>
              )}
            </>
          )}
        </div>
      </div>
      <BottomNav variant="bidan" />
    </div>
  );
}
