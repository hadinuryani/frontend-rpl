import { Link, useLocation } from 'react-router-dom';
import { IconBell } from './Icons';
import './Navbar.css';

export default function Navbar({ variant = 'public', userName = '' }) {
  const location = useLocation();

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
          <button className="navbar-icon-btn" aria-label="Notifikasi" id="navbar-notification-btn">
            <IconBell size={18} />
            <span className="notif-dot"></span>
          </button>
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
