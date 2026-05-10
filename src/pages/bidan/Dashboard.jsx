import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import { IconUser, IconClock, IconCheckCircle, IconAlertTriangle, IconQueue, IconCalendar, IconChart, IconUsers, IconPackage, IconTrendingUp, IconArrowRight } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './BidanPages.css';

const quickNav = [
  { icon: <IconQueue size={24}/>, title: 'Kelola Antrian', desc: 'Atur antrian pasien hari ini', path: '/bidan/queue' },
  { icon: <IconCalendar size={24}/>, title: 'Jadwal Kontrol', desc: 'Tetapkan jadwal kontrol pasien', path: '/bidan/schedule' },
  { icon: <IconChart size={24}/>, title: 'Monitor Kunjungan', desc: 'Pantau data kunjungan pasien', path: '/bidan/monitor' },
  { icon: <IconUsers size={24}/>, title: 'Data Pasien', desc: 'Kelola data pasien terdaftar', path: '/bidan/patients' },
  { icon: <IconPackage size={24}/>, title: 'Inventori Obat', desc: 'Manajemen stok obat klinik', path: '/bidan/inventory' },
  { icon: <IconTrendingUp size={24}/>, title: 'Laporan', desc: 'Laporan klinik keseluruhan', path: '/bidan' },
];

export default function BidanDashboard() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [stats, setStats] = useState({
    total_pasien_hari_ini: 0,
    antrian_menunggu: 0,
    antrian_selesai: 0,
    stok_obat_kritis: 0
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
    { icon: <IconUser size={24}/>, value: stats.total_pasien_hari_ini, label: 'Total Pasien Hari Ini', color: 'var(--color-primary-light)', textColor: null },
    { icon: <IconClock size={24}/>, value: stats.antrian_menunggu, label: 'Antrian Menunggu', color: 'rgba(233,196,106,0.15)', textColor: null },
    { icon: <IconCheckCircle size={24}/>, value: stats.antrian_selesai, label: 'Antrian Selesai', color: 'var(--color-primary-light)', textColor: null },
    { icon: <IconAlertTriangle size={24}/>, value: stats.stok_obat_kritis, label: 'Stok Obat Kritis', color: 'rgba(224,92,92,0.1)', textColor: 'var(--color-error)' },
  ];

  return (
    <div className="app-layout" id="bidan-dashboard">
      <Sidebar variant="bidan" />
      <div className="main-content">
        <Navbar variant="bidan" userName={user?.profile?.nama_lengkap || 'Bidan Indah'} />
        <div className="page-content">
          <div className={`clinic-toggle-card ${isOpen ? 'is-open' : 'is-closed'} animate-fade-in`}>
            <div className="toggle-info">
              <h3>Status Klinik Hari Ini</h3>
              <div className="toggle-time">{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
            <div className="toggle-center">
              <span className="toggle-label">{isOpen ? 'BUKA' : 'TUTUP'}</span>
              <label className="toggle-switch toggle-lg">
                <input type="checkbox" checked={isOpen} onChange={toggleClinicStatus} id="clinic-toggle" />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="toggle-status-text">Klinik Sedang {isOpen ? 'BUKA' : 'TUTUP'}</div>
              <div className="toggle-updated">Diperbarui {lastUpdated || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>

          <div className="grid-4 stagger-children" style={{ marginBottom: 'var(--space-7)' }}>
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
        </div>
      </div>
      <BottomNav variant="bidan" />
    </div>
  );
}
