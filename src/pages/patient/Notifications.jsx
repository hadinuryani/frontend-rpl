import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import { IconArrowLeft, IconBell, IconCheckCircle, IconCalendar, IconHospital } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './PatientPages.css';

export default function Notifications() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('Semua');
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/pasien/jadwal-kontrol');
        const jadwals = res.data || [];
        
        let generatedNotifs = [];
        let idCounter = 1;
        const readKeys = JSON.parse(localStorage.getItem('read_notif_keys') || '[]');
        
        // Add welcome notif
        const welcomeKey = 'welcome-notif';
        generatedNotifs.push({
          id: idCounter++,
          key: welcomeKey,
          icon: <IconHospital size={24} color="var(--color-primary)"/>,
          title: 'Selamat Datang di Klinik IC+',
          body: 'Terima kasih telah bergabung. Anda dapat melakukan pendaftaran kunjungan dan melihat rekam medis melalui aplikasi ini.',
          time: 'Baru saja',
          read: readKeys.includes(welcomeKey)
        });

        const today = new Date();
        today.setHours(0,0,0,0);

        jadwals.forEach(j => {
          const tgl = new Date(j.tanggal_kontrol);
          const diffTime = tgl - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays >= 0 && diffDays <= 3) {
             const key = `schedule-warning-${j.id}-${j.tanggal_kontrol}`;
             generatedNotifs.unshift({
               id: idCounter++,
               key: key,
               icon: <IconBell size={24} color="var(--color-accent)"/>,
               title: 'Pengingat Jadwal Kontrol',
               body: `Anda memiliki jadwal kontrol pada ${tgl.toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long'})}. Jangan lupa hadir!`,
               time: diffDays === 0 ? 'Hari ini' : diffDays === 1 ? 'Besok' : `${diffDays} hari lagi`,
               read: readKeys.includes(key)
             });
          } else if (diffDays > 3) {
             const key = `schedule-set-${j.id}-${j.tanggal_kontrol}`;
             generatedNotifs.push({
               id: idCounter++,
               key: key,
               icon: <IconCalendar size={24} color="var(--color-primary)"/>,
               title: 'Jadwal Kontrol Ditetapkan',
               body: `Jadwal kontrol berikutnya telah ditetapkan pada ${tgl.toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}.`,
               time: '',
               read: readKeys.includes(key)
             });
          }
        });

        setNotifications(generatedNotifs);
      } catch (err) {
        console.error("Gagal mengambil notifikasi", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = (id) => {
    const notif = notifications.find(n => n.id === id);
    if (!notif || notif.read) return;

    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

    const readKeys = JSON.parse(localStorage.getItem('read_notif_keys') || '[]');
    const key = notif.key || `notif-${id}`;
    if (!readKeys.includes(key)) {
      readKeys.push(key);
      localStorage.setItem('read_notif_keys', JSON.stringify(readKeys));
      window.dispatchEvent(new Event('notifRead'));
    }
  };

  const handleMarkAllAsRead = () => {
    const readKeys = JSON.parse(localStorage.getItem('read_notif_keys') || '[]');
    notifications.forEach(n => {
      const key = n.key || `notif-${n.id}`;
      if (!readKeys.includes(key)) {
        readKeys.push(key);
      }
    });
    localStorage.setItem('read_notif_keys', JSON.stringify(readKeys));
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    window.dispatchEvent(new Event('notifRead'));
  };

  const filtered = filter === 'Semua' ? notifications : filter === 'Belum Dibaca' ? notifications.filter(n => !n.read) : notifications.filter(n => n.read);

  return (
    <div className="app-layout" id="patient-notifications">
      <Sidebar variant="patient" />
      <div className="main-content">
        <Navbar variant="patient" userName={user?.profile?.nama_lengkap || "Pasien"} />
        <div className="page-content">
          <div className="page-header">
            <div className="page-title">
              <Link to="/patient" className="back-btn"><IconArrowLeft size={18}/></Link>
              <h2>Notifikasi</h2>
            </div>
            {notifications.some(n => !n.read) && (
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={handleMarkAllAsRead}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <IconCheckCircle size={16}/> Tandai Semua Dibaca
              </button>
            )}
          </div>
          <div className="tab-group" style={{ marginBottom: 'var(--space-5)' }}>
            {['Semua', 'Belum Dibaca', 'Sudah Dibaca'].map(t => (
              <button key={t} className={`tab-item ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t}</button>
            ))}
          </div>
          {isLoading ? (
            <div style={{textAlign: 'center', padding: '40px'}}>Memuat notifikasi...</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><IconBell size={64} color="var(--color-text-muted)"/></div>
              <div className="empty-title">Tidak ada notifikasi</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {filtered.map(n => (
                <div 
                  key={n.id} 
                  className="glass-card" 
                  onClick={() => handleMarkAsRead(n.id)}
                  style={{
                    padding: 'var(--space-5)', 
                    borderLeft: n.read ? 'none' : '3px solid var(--color-accent)',
                    background: n.read ? 'var(--glass-bg)' : 'rgba(240, 228, 194, 0.15)', 
                    opacity: n.read ? 0.75 : 1,
                    display: 'flex', 
                    gap: 'var(--space-4)', 
                    alignItems: 'flex-start',
                    cursor: n.read ? 'default' : 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => { if (!n.read) e.currentTarget.style.background = 'rgba(240, 228, 194, 0.25)'; }}
                  onMouseLeave={(e) => { if (!n.read) e.currentTarget.style.background = 'rgba(240, 228, 194, 0.15)'; }}
                >
                  <span style={{ flexShrink: 0 }}>{n.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
                      <strong style={{ color: 'var(--color-dark)' }}>{n.title}</strong>
                      {!n.read && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent)', flexShrink: 0 }}></span>}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '4px' }}>{n.body}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav variant="patient" />
    </div>
  );
}
