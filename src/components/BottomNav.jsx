import { NavLink } from 'react-router-dom';
import { IconHome, IconClipboard, IconFolder, IconBell, IconQueue, IconUsers, IconPackage } from './Icons';
import './BottomNav.css';

const patientItems = [
  { icon: <IconHome size={22}/>, label: 'Beranda', path: '/patient' },
  { icon: <IconClipboard size={22}/>, label: 'Kunjungan', path: '/patient/visit' },
  { icon: <IconFolder size={22}/>, label: 'Rekam Medis', path: '/patient/records' },
  { icon: <IconBell size={22}/>, label: 'Notifikasi', path: '/patient/notifications' },
];

const bidanItems = [
  { icon: <IconHome size={22}/>, label: 'Beranda', path: '/bidan' },
  { icon: <IconQueue size={22}/>, label: 'Antrian', path: '/bidan/queue' },
  { icon: <IconUsers size={22}/>, label: 'Pasien', path: '/bidan/patients' },
  { icon: <IconPackage size={22}/>, label: 'Inventori', path: '/bidan/inventory' },
];

export default function BottomNav({ variant = 'patient' }) {
  const items = variant === 'bidan' ? bidanItems : patientItems;

  return (
    <nav className="bottom-nav hide-desktop" id="bottom-navigation">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/patient' || item.path === '/bidan'}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="bottom-nav-icon">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
