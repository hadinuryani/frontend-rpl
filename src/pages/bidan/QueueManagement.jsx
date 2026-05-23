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
  const [isClinicOpen, setIsClinicOpen] = useState(true);
  
  const getTodayISO = () => new Date().toLocaleDateString('sv-SE');
  const [selectedDate, setSelectedDate] = useState(getTodayISO());

  const fetchQueue = async () => {
    setIsLoading(true);
    try {
      const [queueRes, statusRes] = await Promise.all([
        api.get(`/bidan/antrian?tanggal=${selectedDate}&limit=100`),
        api.get('/klinik/status')
      ]);
      setQueueData(queueRes.data || []);
      setIsClinicOpen(statusRes.data.status === 'buka');
    } catch (err) {
      console.error("Gagal mengambil data antrian:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [selectedDate]);

  const filtered = filter === 'Semua' ? queueData : queueData.filter(q => q.status.toLowerCase() === filter.toLowerCase());
  const waiting = queueData.filter(q => q.status === 'menunggu').length;
  const done = queueData.filter(q => q.status === 'selesai' || q.status === 'dibatalkan').length;

  return (
    <div className="app-layout" id="queue-management">
      <Sidebar variant="bidan" />
      <div className="main-content">
        <Navbar variant="bidan" userName={user?.profile?.nama_lengkap || "Bidan Indah"} />
        <div className="page-content">
          <div className="page-header" style={{ flexWrap: 'wrap', gap: '15px' }}>
            <div className="page-title">
              <Link to="/bidan" className="back-btn"><IconArrowLeft size={18}/></Link>
              <h2>Kelola Antrian Pasien</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input 
                type="date" 
                className="form-input" 
                style={{ width: '160px', margin: 0 }} 
                value={selectedDate} 
                onChange={e => setSelectedDate(e.target.value)} 
              />
              <button className="btn btn-secondary btn-sm" onClick={fetchQueue}><IconRefresh size={16}/> Refresh</button>
            </div>
          </div>
          <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ color: 'var(--color-text-light)', fontWeight: 500 }}>
              Tanggal: <strong>{new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <span>Total: {queueData.length}</span><span>Menunggu: {waiting}</span><span>Selesai/Batal: {done}</span>
            </div>
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
                      isClinicOpen ? (
                        <Link to={`/bidan/examine?antrian_id=${q.id}`} className="btn btn-secondary btn-sm">Periksa Sekarang →</Link>
                      ) : (
                        <button 
                          className="btn btn-secondary btn-sm" 
                          style={{ opacity: 0.6, cursor: 'not-allowed' }} 
                          onClick={() => alert('Klinik sedang tutup. Silakan buka status klinik di Dashboard terlebih dahulu.')}
                        >
                          Periksa Sekarang →
                        </button>
                      )
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
