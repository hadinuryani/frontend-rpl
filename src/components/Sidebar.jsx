import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { IconHome, IconClipboard, IconFolder, IconPill, IconBell, IconSettings, IconLogout, IconQueue, IconCalendar, IconChart, IconUsers, IconPackage, IconUser } from './Icons';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const patientMenu = [
  { icon: <IconHome size={20}/>, label: 'Beranda', path: '/patient', tab: 'dashboard' },
  { icon: <IconClipboard size={20}/>, label: 'Pendaftaran Layanan', path: '/patient/visit' },
  { icon: <IconQueue size={20}/>, label: 'Antrian Saya', path: '/patient/queue' },
  { icon: <IconFolder size={20}/>, label: 'Rekam Medis', path: '/patient/records', tab: 'rekam' },
  { icon: <IconPill size={20}/>, label: 'Resep Saya', path: '/patient/records', tab: 'resep' },
  { icon: <IconBell size={20}/>, label: 'Notifikasi', path: '/patient/notifications' },
  { icon: <IconUser size={20}/>, label: 'Profil Saya', path: '/patient', tab: 'profile' },
];

const bidanMenu = [
  { icon: <IconHome size={20}/>, label: 'Beranda', path: '/bidan', tab: 'dashboard' },
  { icon: <IconQueue size={20}/>, label: 'Kelola Antrian', path: '/bidan/queue' },
  { icon: <IconCalendar size={20}/>, label: 'Jadwal Kontrol', path: '/bidan/schedule' },
  { icon: <IconChart size={20}/>, label: 'Monitor Kunjungan', path: '/bidan/monitor' },
  { icon: <IconUsers size={20}/>, label: 'Data Pasien', path: '/bidan/patients' },
  { icon: <IconPackage size={20}/>, label: 'Inventori Obat', path: '/bidan/inventory' },
  { icon: <IconUser size={20}/>, label: 'Profil Saya', path: '/bidan', tab: 'profile' },
];

export default function Sidebar({ variant = 'patient' }) {
  const menu = variant === 'bidan' ? bidanMenu : patientMenu;
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
        {menu.map((item) => {
          // Check active state including tab parameter if defined
          const searchParams = new URLSearchParams(location.search);
          const defaultTab = (location.pathname === '/patient' || location.pathname === '/bidan') ? 'dashboard' : 'rekam';
          const currentTab = searchParams.get('tab') || defaultTab;
          
          let isActive = location.pathname === item.path;
          if (item.tab) {
            isActive = location.pathname === item.path && currentTab === item.tab;
          }

          return (
            <NavLink
              key={item.path + item.label}
              to={item.tab ? `${item.path}?tab=${item.tab}` : item.path}
              end={item.path === '/patient' || item.path === '/bidan'}
              className={() => `sidebar-item ${isActive ? 'active' : ''}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          );
        })}
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

