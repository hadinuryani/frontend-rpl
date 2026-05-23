import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IconBell } from './Icons';
import api from '../services/api';
import './Navbar.css';

export default function Navbar({ variant = 'public', userName = '' }) {
  const location = useLocation();
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (variant !== 'patient') return;

    const checkNotifications = async () => {
      try {
        const res = await api.get('/pasien/jadwal-kontrol');
        const jadwals = res.data || [];
        const readKeys = JSON.parse(localStorage.getItem('read_notif_keys') || '[]');

        // Check welcome notif
        const welcomeKey = 'welcome-notif';
        if (!readKeys.includes(welcomeKey)) {
          setHasUnread(true);
          return;
        }

        const today = new Date();
        today.setHours(0,0,0,0);

        for (const j of jadwals) {
          const tgl = new Date(j.tanggal_kontrol);
          const diffTime = tgl - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays >= 0 && diffDays <= 3) {
             const key = `schedule-warning-${j.id}-${j.tanggal_kontrol}`;
             if (!readKeys.includes(key)) {
               setHasUnread(true);
               return;
             }
          } else if (diffDays > 3) {
             const key = `schedule-set-${j.id}-${j.tanggal_kontrol}`;
             if (!readKeys.includes(key)) {
               setHasUnread(true);
               return;
             }
          }
        }

        setHasUnread(false);
      } catch (err) {
        console.error("Gagal memeriksa notifikasi:", err);
      }
    };

    checkNotifications();
    
    const handleStorageChange = () => checkNotifications();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('notifRead', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('notifRead', handleStorageChange);
    };
  }, [variant]);

  if (variant === 'public') {
    return (
      <nav className="navbar navbar-public" id="main-navbar">
        <div className="navbar-inner container">
          <Link to="/" className="navbar-logo">
            <span className="logo-ic">IC</span>
            <span className="logo-plus">+</span>
          </Link>
          <div className="navbar-links hide-mobile">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Beranda</Link>
            <a href="#layanan">Layanan</a>
            <a href="#tentang">Tentang</a>
          </div>
          <div className="navbar-actions">
            <Link to="/login" className="btn btn-ghost btn-sm">Masuk</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Daftar</Link>
          </div>
        </div>
      </nav>
    );
  }

  const targetPath = variant === 'bidan' ? '/bidan/control-schedule' : '/patient/notifications';

  return (
    <nav className="navbar navbar-auth" id="dashboard-navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-ic">IC</span>
          <span className="logo-plus">+</span>
        </Link>
        <div className="navbar-center hide-mobile">
          <span className="navbar-title">
            {variant === 'bidan' ? 'Dashboard Bidan' : ''}
          </span>
        </div>
        <div className="navbar-actions">
          {variant === 'patient' && (
            <Link to={targetPath} className="navbar-icon-btn" aria-label="Notifikasi" id="navbar-notification-btn">
              <IconBell size={18} />
              {hasUnread && <span className="notif-dot"></span>}
            </Link>
          )}
          <div className="navbar-user">
            <div className="navbar-avatar">{userName?.charAt(0) || 'U'}</div>
            <span className="navbar-username hide-mobile">
              Halo, {userName || 'User'}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
