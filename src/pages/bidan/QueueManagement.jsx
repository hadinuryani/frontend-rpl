import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import { IconArrowLeft, IconQueue, IconCheck, IconRefresh } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './BidanPages.css';

export default function QueueManagement() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('Semua');
  const [queueData, setQueueData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const fetchQueue = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/bidan/antrian');
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

  const filtered = filter === 'Semua' ? queueData : queueData.filter(q => q.status.toLowerCase() === filter.toLowerCase());
  const waiting = queueData.filter(q => q.status === 'menunggu').length;
  const done = queueData.filter(q => q.status === 'selesai' || q.status === 'dibatalkan').length;

  return (
    <div className="app-layout" id="queue-management">
      <Sidebar variant="bidan" />
      <div className="main-content">
        <Navbar variant="bidan" userName={user?.profile?.nama_lengkap || "Bidan Indah"} />
        <div className="page-content">
          <div className="page-header">
            <div className="page-title">
              <Link to="/bidan" className="back-btn"><IconArrowLeft size={18}/></Link>
              <h2>Antrian Pasien — {today}</h2>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={fetchQueue}><IconRefresh size={16}/> Refresh</button>
          </div>
          <div className="summary-row">
            <span>Total: {queueData.length}</span><span>Menunggu: {waiting}</span><span>Selesai/Batal: {done}</span>
          </div>
          <div className="tab-group" style={{ marginBottom: 'var(--space-5)' }}>
            {['Semua', 'Menunggu', 'Selesai'].map(t => (
              <button key={t} className={`tab-item ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t}</button>
            ))}
          </div>
          
          {isLoading ? (
            <div className="empty-state">
              <div className="empty-title">Memuat data antrian...</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><IconQueue size={64} color="var(--color-text-muted)"/></div>
              <div className="empty-title">Belum ada pasien dengan status ini hari ini</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }} className="stagger-children">
              {filtered.map((q) => (
                <div className="glass-card" key={q.id} style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
                  <div className="queue-badge">{q.no_antrian}</div>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-dark)', fontSize: '1rem' }}>{q.nama_pasien}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>Daftar pada {new Date(q.created_at).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', fontStyle: 'italic', marginTop: '4px' }}>{q.keluhan || '-'}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <span className={`badge ${q.status === 'menunggu' ? 'badge-waiting' : (q.status === 'dibatalkan' ? 'badge-error' : 'badge-success')}`} style={{ textTransform: 'capitalize' }}>{q.status}</span>
                    {q.status === 'menunggu' ? (
                      <Link to={`/bidan/examine?antrian_id=${q.id}`} className="btn btn-secondary btn-sm">Periksa Sekarang →</Link>
                    ) : (
                      <span style={{ color: 'var(--color-success)' }}><IconCheck size={24}/></span>
                    )}
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
