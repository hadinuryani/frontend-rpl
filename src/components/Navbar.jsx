import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IconBell, IconMenuFold, IconMenuUnfold } from './Icons';
import api from '../services/api';
import GooeyNav from './GooeyNav';
import './Navbar.css';

export default function Navbar({ variant = 'public', userName = '' }) {
  const location = useLocation();
  const [hasUnread, setHasUnread] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });

  useEffect(() => {
    if (variant === 'public') return;
    if (isSidebarCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  }, [isSidebarCollapsed, variant]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', String(next));
      return next;
    });
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  const navItems = [
    { label: 'Beranda', href: '#beranda' },
    { label: 'Layanan', href: '#layanan' },
    { label: 'Tentang', href: '#tentang' }
  ];

  const handleNavClick = (index) => {
    isScrollingRef.current = true;
    setActiveIndex(index);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 1000);
  };

  useEffect(() => {
    if (variant !== 'public') return;

    const sections = ['beranda', 'layanan', 'tentang'];
    const handleScroll = () => {
      if (isScrollingRef.current) return;
      
      const scrollPosition = window.scrollY + 160; // offset for header

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && scrollPosition >= el.offsetTop) {
          setActiveIndex(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [variant]);


  useEffect(() => {
    if (variant !== 'patient') return;

    const checkNotifications = async () => {
      try {
        // Check unread notifications from backend
        const res = await api.get('/pasien/notifikasi?limit=50');
        const notifs = res.data || [];
        const hasUnreadNotif = notifs.some(n => !n.is_read);
        setHasUnread(hasUnreadNotif);
      } catch (err) {
        console.error("Gagal memeriksa notifikasi:", err);
      }
    };

    checkNotifications();
    
    // Re-check when a notification is marked as read from the Notifications page
    const handleNotifRead = () => checkNotifications();
    window.addEventListener('notifRead', handleNotifRead);

    return () => {
      window.removeEventListener('notifRead', handleNotifRead);
    };
  }, [variant]);

  useEffect(() => {
    if (variant !== 'bidan') return;

    const checkBidanNotifications = async () => {
      try {
        const res = await api.get('/bidan/notifikasi');
        const notifs = res.data || [];
        setHasUnread(notifs.length > 0);
      } catch (err) {
        console.error("Gagal memeriksa notifikasi bidan:", err);
      }
    };

    checkBidanNotifications();

    const handleNotifRead = () => checkBidanNotifications();
    window.addEventListener('notifRead', handleNotifRead);
    window.addEventListener('bidanNotifRead', handleNotifRead);

    return () => {
      window.removeEventListener('notifRead', handleNotifRead);
      window.removeEventListener('bidanNotifRead', handleNotifRead);
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
            <GooeyNav
              items={navItems}
              activeIndex={activeIndex}
              onChange={handleNavClick}
            />
          </div>
          <div className="navbar-actions">
            <Link to="/login" className="btn btn-ghost btn-sm">Masuk</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Daftar</Link>
          </div>
        </div>
      </nav>
    );
  }

  const targetPath = variant === 'bidan' ? '/bidan/notifications' : '/patient/notifications';

  return (
    <nav className="navbar navbar-auth" id="dashboard-navbar">
      <div className="navbar-inner">
        <div className="navbar-left-group">
          <div className="hamburger-toggle-container hide-mobile">
            <input 
              type="checkbox" 
              className="hamburger-check-input"
              id="sidebar-hamburger-checkbox" 
              checked={!isSidebarCollapsed} 
              onChange={toggleSidebar} 
            />
            <label htmlFor="sidebar-hamburger-checkbox" className="sidebar-hamburger-btn">
              <div className="hamburger-line-1"></div>
              <div className="hamburger-line-2"></div>
              <div className="hamburger-line-3"></div>
            </label>
          </div>
          <Link to="/" className="navbar-logo">
            <span className="logo-ic">IC</span>
            <span className="logo-plus">+</span>
          </Link>
        </div>
        <div className="navbar-center hide-mobile">
          <span className="navbar-title">
            {variant === 'bidan' ? 'Dashboard Bidan' : ''}
          </span>
        </div>
        <div className="navbar-actions">
          {(variant === 'patient' || variant === 'bidan') && (
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
