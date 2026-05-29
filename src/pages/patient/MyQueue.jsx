import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import LoadingAnimation from '../../components/LoadingAnimation';
import { IconArrowLeft, IconQueue, IconCalendar, IconRefresh } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './PatientPages.css';

export default function MyQueue() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('Semua');
  const [queueData, setQueueData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQueue = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/pasien/antrian?limit=50');
      setQueueData(res.data || []);
    } catch (err) {
      console.error("Gagal mengambil data antrian:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const filtered = filter === 'Semua'
    ? queueData
    : queueData.filter(q => q.status.toLowerCase() === filter.toLowerCase());

  const waiting = queueData.filter(q => q.status === 'menunggu').length;
  const done = queueData.filter(q => q.status === 'selesai').length;
  const cancelled = queueData.filter(q => q.status === 'batal').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'menunggu': return 'badge-waiting';
      case 'selesai': return 'badge-success';
      case 'batal': return 'badge-error';
      default: return '';
    }
  };

  return (
    <div className="app-layout" id="my-queue">
      <Sidebar variant="patient" />
      <div className="main-content">
        <Navbar variant="patient" userName={user?.profile?.nama_lengkap || "Pasien"} />
        <div className="page-content">
          <div className="page-header">
            <div className="page-title">
              <Link to="/patient" className="back-btn"><IconArrowLeft size={18}/></Link>
              <h2>Antrian Saya</h2>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={fetchQueue}><IconRefresh size={16}/> Refresh</button>
          </div>

          <div className="summary-row">
            <span>Total: {queueData.length}</span>
            <span>Menunggu: {waiting}</span>
            <span>Selesai: {done}</span>
            {cancelled > 0 && <span>Batal: {cancelled}</span>}
          </div>

          <div className="tab-group" style={{ marginBottom: 'var(--space-5)' }}>
            {['Semua', 'Menunggu', 'Selesai', 'Batal'].map(t => (
              <button key={t} className={`tab-item ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t}</button>
            ))}
          </div>

          {isLoading ? (
            <LoadingAnimation />
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><IconQueue size={64} color="var(--color-text-muted)"/></div>
              <div className="empty-title">Belum ada antrian</div>
              <div className="empty-desc">Antrian Anda akan muncul di sini setelah mendaftar kunjungan.</div>
              <Link to="/patient/visit" className="btn btn-primary" style={{ marginTop: 'var(--space-5)' }}>Daftar Kunjungan</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }} className="stagger-children">
              {filtered.map((q) => (
                <div className="glass-card" key={q.id} style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
                  <div className="queue-badge">{q.no_antrian}</div>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-dark)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <IconCalendar size={16}/> {new Date(q.tanggal_kunjungan).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', fontStyle: 'italic', marginTop: '6px' }}>
                      {q.keluhan || '-'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      Didaftarkan: {new Date(q.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <span className={`badge ${getStatusBadge(q.status)}`} style={{ textTransform: 'capitalize' }}>{q.status}</span>
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
