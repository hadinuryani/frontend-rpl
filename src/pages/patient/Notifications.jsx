import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import LoadingAnimation from '../../components/LoadingAnimation';
import { IconArrowLeft, IconBell, IconCheckCircle, IconCalendar, IconWhatsApp } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './PatientPages.css';

function formatTimeAgo(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHour < 24) return `${diffHour} jam lalu`;
  if (diffDay < 7) return `${diffDay} hari lalu`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getStatusBadge(status) {
  if (status === 'terkirim') return { className: 'badge-success', label: '✓ Terkirim via WA' };
  if (status === 'gagal') return { className: 'badge-critical', label: '✗ Gagal Terkirim' };
  return { className: 'badge-gray', label: status };
}

export default function Notifications() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('Semua');
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      // Fetch real notifications from backend (riwayat pengiriman WA)
      const [notifRes, jadwalRes] = await Promise.all([
        api.get('/pasien/notifikasi?limit=50'),
        api.get('/pasien/jadwal-kontrol?limit=20')
      ]);

      const backendNotifs = notifRes.data || [];
      const jadwals = jadwalRes.data || [];

      // Map backend notifications (real WA notifications from scheduler)
      const mappedNotifs = backendNotifs.map(n => ({
        id: n.id,
        source: 'backend',
        title: n.judul,
        body: n.pesan,
        read: n.is_read,
        status_kirim: n.status_kirim,
        time: formatTimeAgo(n.sent_at || n.created_at),
        created_at: n.sent_at || n.created_at,
        channel: n.channel || 'whatsapp',
      }));

      // Generate supplementary upcoming schedule notifications (for jadwal that
      // DON'T have a backend notification yet — e.g. still >1 day away)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Collect jadwal_kontrol_ids that already have backend notifs
      const notifiedJadwalIds = new Set(
        backendNotifs.filter(n => n.jadwal_kontrol_id).map(n => n.jadwal_kontrol_id)
      );

      const upcomingNotifs = [];
      jadwals.forEach(j => {
        // Skip jadwals that already have a real backend notification
        if (notifiedJadwalIds.has(j.id)) return;

        const tgl = new Date(j.tanggal_kontrol);
        const diffTime = tgl - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 0) {
          upcomingNotifs.push({
            id: `upcoming-${j.id}`,
            source: 'upcoming',
            title: 'Jadwal Kontrol Mendatang',
            body: `Anda memiliki jadwal kontrol pada ${tgl.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}. ${j.catatan ? `Catatan: ${j.catatan}` : ''}`,
            read: true, // upcoming info — always treated as read
            time: diffDays === 0 ? 'Hari ini' : diffDays === 1 ? 'Besok' : `${diffDays} hari lagi`,
            created_at: j.created_at || j.tanggal_kontrol,
            channel: 'info',
          });
        }
      });

      // Combine: real backend notifs first, then upcoming jadwal info
      setNotifications([...mappedNotifs, ...upcomingNotifs]);

    } catch (err) {
      console.error("Gagal mengambil notifikasi:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notif) => {
    if (!notif || notif.read) return;

    // Only call backend API for real backend notifications
    if (notif.source === 'backend') {
      try {
        await api.put(`/pasien/notifikasi/${notif.id}/read`);
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
        window.dispatchEvent(new Event('notifRead'));
      } catch (err) {
        console.error("Gagal menandai notifikasi:", err);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadBackendNotifs = notifications.filter(n => !n.read && n.source === 'backend');

    // Mark all unread backend notifications as read
    try {
      await Promise.all(
        unreadBackendNotifs.map(n => api.put(`/pasien/notifikasi/${n.id}/read`))
      );
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      window.dispatchEvent(new Event('notifRead'));
    } catch (err) {
      console.error("Gagal menandai semua notifikasi:", err);
    }
  };

  const filtered = filter === 'Semua'
    ? notifications
    : filter === 'Belum Dibaca'
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.read);

  const getNotifIcon = (n) => {
    if (n.source === 'upcoming') return <IconCalendar size={24} color="var(--color-primary)" />;
    if (n.status_kirim === 'gagal') return <IconBell size={24} color="var(--color-error)" />;
    return <IconWhatsApp size={24} color="#25D366" />;
  };

  return (
    <div className="app-layout" id="patient-notifications">
      <Sidebar variant="patient" />
      <div className="main-content">
        <Navbar variant="patient" userName={user?.profile?.nama_lengkap || "Pasien"} />
        <div className="page-content">
          <div className="page-header">
            <div className="page-title">
              <Link to="/patient" className="back-btn"><IconArrowLeft size={18} /></Link>
              <h2>Notifikasi</h2>
            </div>
            {notifications.some(n => !n.read && n.source === 'backend') && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleMarkAllAsRead}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <IconCheckCircle size={16} /> Tandai Semua Dibaca
              </button>
            )}
          </div>
          <div className="tab-group" style={{ marginBottom: 'var(--space-5)' }}>
            {['Semua', 'Belum Dibaca', 'Sudah Dibaca'].map(t => (
              <button key={t} className={`tab-item ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t}</button>
            ))}
          </div>
          {isLoading ? (
            <LoadingAnimation />
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><IconBell size={64} color="var(--color-text-muted)" /></div>
              <div className="empty-title">Tidak ada notifikasi</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                Pengingat jadwal kontrol akan muncul di sini setelah bidan menjadwalkan kontrol Anda.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {filtered.map(n => (
                <div
                  key={n.id}
                  className="glass-card"
                  onClick={() => handleMarkAsRead(n)}
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
                  <span style={{ flexShrink: 0 }}>{getNotifIcon(n)}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
                      <strong style={{ color: 'var(--color-dark)' }}>{n.title}</strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {n.status_kirim && (
                          <span className={`badge ${getStatusBadge(n.status_kirim).className}`} style={{ fontSize: '0.6875rem' }}>
                            {getStatusBadge(n.status_kirim).label}
                          </span>
                        )}
                        {n.source === 'upcoming' && (
                          <span className="badge badge-info" style={{ fontSize: '0.6875rem' }}>📅 Info Jadwal</span>
                        )}
                        {!n.read && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent)', flexShrink: 0 }}></span>}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '4px', whiteSpace: 'pre-line' }}>{n.body}</div>
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
