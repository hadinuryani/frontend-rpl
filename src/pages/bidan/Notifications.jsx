import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import { IconArrowLeft, IconBell, IconAlertTriangle, IconPackage, IconRefresh } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './BidanPages.css';

function getStatusBadge(status) {
  if (status === 'kadaluarsa') return { className: 'badge-danger', label: 'Kadaluarsa' };
  if (status === 'hampir_kadaluarsa') return { className: 'badge-orange', label: 'Hampir Kadaluarsa' };
  if (status === 'habis') return { className: 'badge-critical', label: 'Stok Habis' };
  if (status === 'hampir_habis') return { className: 'badge-warning', label: 'Hampir Habis' };
  return { className: 'badge-gray', label: status };
}

export default function BidanNotifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Semua');
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/bidan/notifikasi');
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Gagal mengambil notifikasi bidan:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filtered = notifications.filter(n => {
    if (filter === 'Semua') return true;
    if (filter === 'Kritis') return n.status_stok === 'habis' || n.status_stok === 'hampir_habis';
    if (filter === 'Kadaluarsa') return n.status_stok === 'kadaluarsa' || n.status_stok === 'hampir_kadaluarsa';
    return true;
  });

  const getNotifIcon = (status) => {
    if (status === 'kadaluarsa' || status === 'habis') {
      return <IconAlertTriangle size={24} color="var(--color-error)" />;
    }
    return <IconAlertTriangle size={24} color="var(--color-warning)" />;
  };

  const getNotifMessage = (n) => {
    const expDate = n.tanggal_kadaluarsa ? new Date(n.tanggal_kadaluarsa).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
    if (n.status_stok === 'kadaluarsa') {
      return `Obat ${n.nama_obat} telah kadaluarsa pada tanggal ${expDate}. Segera pisahkan dan musnahkan sesuai prosedur!`;
    }
    if (n.status_stok === 'hampir_kadaluarsa') {
      return `Obat ${n.nama_obat} mendekati tanggal kadaluarsa (${expDate}). Prioritaskan penggunaan obat ini!`;
    }
    if (n.status_stok === 'habis') {
      return `Stok obat ${n.nama_obat} telah habis! Segera lakukan pemesanan atau pengisian stok baru.`;
    }
    if (n.status_stok === 'hampir_habis') {
      return `Stok obat ${n.nama_obat} hampir habis. Sisa stok saat ini: ${n.jumlah_stok} ${n.satuan} (Batas minimum: ${n.stok_minimum} ${n.satuan}).`;
    }
    return `Periksa obat ${n.nama_obat}.`;
  };

  return (
    <div className="app-layout" id="bidan-notifications">
      <Sidebar variant="bidan" />
      <div className="main-content">
        <Navbar variant="bidan" userName={user?.profile?.nama_lengkap || "Bidan Indah"} />
        <div className="page-content">
          <div className="page-header">
            <div className="page-title">
              <Link to="/bidan" className="back-btn"><IconArrowLeft size={18} /></Link>
              <h2>Notifikasi Inventori</h2>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={fetchNotifications}><IconRefresh size={16}/> Refresh</button>
          </div>
          <div className="tab-group" style={{ marginBottom: 'var(--space-5)' }}>
            {['Semua', 'Kritis', 'Kadaluarsa'].map(t => (
              <button key={t} className={`tab-item ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t}</button>
            ))}
          </div>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Memuat notifikasi...</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><IconPackage size={64} color="var(--color-text-muted)" /></div>
              <div className="empty-title">Semua obat aman</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                Tidak ada obat yang stoknya habis, kritis, atau kadaluarsa saat ini.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {filtered.map(n => (
                <div
                  key={n.id}
                  className="glass-card"
                  style={{
                    padding: 'var(--space-5)',
                    borderLeft: `4px solid ${n.status_stok.includes('kadaluarsa') || n.status_stok === 'habis' ? 'var(--color-error)' : 'var(--color-warning)'}`,
                    background: 'var(--glass-bg)',
                    display: 'flex',
                    gap: 'var(--space-4)',
                    alignItems: 'flex-start',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <span style={{ flexShrink: 0 }}>{getNotifIcon(n.status_stok)}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
                      <strong style={{ color: 'var(--color-dark)' }}>Peringatan: {n.nama_obat}</strong>
                      <span className={`badge ${getStatusBadge(n.status_stok).className}`} style={{ fontSize: '0.6875rem' }}>
                        {getStatusBadge(n.status_stok).label}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '12px', whiteSpace: 'pre-line' }}>
                      {getNotifMessage(n)}
                    </div>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate(`/bidan/inventory?search=${n.nama_obat}`)}
                    >
                      Atur Stok
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav variant="bidan" />
    </div>
  );
}
