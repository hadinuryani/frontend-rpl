import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import { IconClipboard, IconFolder, IconPill, IconBell, IconCalendar, IconCheckCircle, IconArrowRight } from '../../components/Icons';
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
  const [klinikStatus, setKlinikStatus] = useState(null);
  const [jadwalKontrol, setJadwalKontrol] = useState([]);
  const [rekamMedis, setRekamMedis] = useState([]);
  
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

  const nextJadwal = jadwalKontrol.length > 0 ? jadwalKontrol[0] : null;

  return (
    <div className="app-layout" id="patient-dashboard">
      <Sidebar variant="patient" />
      <div className="main-content">
        <Navbar variant="patient" userName={user?.profile?.nama_lengkap || "Pasien"} />
        <div className="page-content">
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
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
        </div>
      </div>
      <BottomNav variant="patient" />
    </div>
  );
}
