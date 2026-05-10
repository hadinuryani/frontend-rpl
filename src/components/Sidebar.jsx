import { NavLink, useNavigate } from 'react-router-dom';
import { IconHome, IconClipboard, IconFolder, IconPill, IconBell, IconSettings, IconLogout, IconQueue, IconCalendar, IconChart, IconUsers, IconPackage } from './Icons';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const patientMenu = [
  { icon: <IconHome size={20}/>, label: 'Beranda', path: '/patient' },
  { icon: <IconClipboard size={20}/>, label: 'Daftar Kunjungan', path: '/patient/visit' },
  { icon: <IconFolder size={20}/>, label: 'Rekam Medis', path: '/patient/records' },
  { icon: <IconPill size={20}/>, label: 'Resep Saya', path: '/patient/records' },
  { icon: <IconBell size={20}/>, label: 'Notifikasi', path: '/patient/notifications' },
  { icon: <IconSettings size={20}/>, label: 'Pengaturan', path: '/patient' },
];

const bidanMenu = [
  { icon: <IconHome size={20}/>, label: 'Beranda', path: '/bidan' },
  { icon: <IconQueue size={20}/>, label: 'Kelola Antrian', path: '/bidan/queue' },
  { icon: <IconCalendar size={20}/>, label: 'Jadwal Kontrol', path: '/bidan/schedule' },
  { icon: <IconChart size={20}/>, label: 'Monitor Kunjungan', path: '/bidan/monitor' },
  { icon: <IconUsers size={20}/>, label: 'Data Pasien', path: '/bidan/patients' },
  { icon: <IconPackage size={20}/>, label: 'Inventori Obat', path: '/bidan/inventory' },
  { icon: <IconSettings size={20}/>, label: 'Pengaturan', path: '/bidan' },
];

export default function Sidebar({ variant = 'patient' }) {
  const menu = variant === 'bidan' ? bidanMenu : patientMenu;
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar hide-mobile" id="app-sidebar">
      <div className="sidebar-logo">
        <span className="logo-ic">IC</span>
        <span className="logo-plus">+</span>
      </div>
      <nav className="sidebar-nav">
        {menu.map((item) => (
          <NavLink
            key={item.path + item.label}
            to={item.path}
            end={item.path === '/patient' || item.path === '/bidan'}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="sidebar-item sidebar-logout" type="button">
          <span className="sidebar-icon"><IconLogout size={20}/></span>
          <span className="sidebar-label">Keluar</span>
        </button>
      </div>
    </aside>
  );
}

