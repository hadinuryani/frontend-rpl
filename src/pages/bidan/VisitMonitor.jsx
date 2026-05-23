import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import { IconArrowLeft, IconSearch, IconChart, IconTrendingUp, IconUsers, IconRefresh } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './BidanPages.css';

export default function VisitMonitor() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [visits, setVisits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVisits = async () => {
    setIsLoading(true);
    try {
      let url = '/bidan/monitor-kunjungan';
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const res = await api.get(url);
      setVisits(res.data || []);
    } catch (err) {
      console.error("Gagal mengambil data kunjungan:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const filtered = visits.filter(v => 
    v.nama_pasien.toLowerCase().includes(search.toLowerCase()) || 
    (v.keluhan && v.keluhan.toLowerCase().includes(search.toLowerCase()))
  );

  // Calculate stats
  const uniquePatients = new Set(filtered.map(v => v.pasien_id)).size;
  // Approximation of days:
  const days = startDate && endDate ? Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))) : 1;
  const avgPerDay = (filtered.length / days).toFixed(1);

  return (
    <div className="app-layout" id="visit-monitor">
      <Sidebar variant="bidan" />
      <div className="main-content">
        <Navbar variant="bidan" userName={user?.profile?.nama_lengkap || "Bidan Indah"} />
        <div className="page-content">
          <div className="page-header">
            <div className="page-title">
              <Link to="/bidan" className="back-btn"><IconArrowLeft size={18}/></Link>
              <h2>Monitor Kunjungan Pasien</h2>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={fetchVisits}><IconRefresh size={16}/> Refresh</button>
          </div>
          <div className="action-row" style={{ flexWrap: 'wrap', gap: '10px' }}>
            <input type="date" className="form-input" style={{ maxWidth: '160px' }} value={startDate} onChange={e => setStartDate(e.target.value)} />
            <span style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>—</span>
            <input type="date" className="form-input" style={{ maxWidth: '160px' }} value={endDate} onChange={e => setEndDate(e.target.value)} />
            <div className="input-wrapper search-input" style={{ flex: 1, minWidth: '200px' }}>
              <span className="input-icon"><IconSearch size={18}/></span>
              <input type="text" className="form-input" placeholder="Cari nama atau keluhan..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={fetchVisits}>Filter</button>
          </div>
          <div className="grid-3" style={{ marginBottom: 'var(--space-7)' }}>
            {[{ v: filtered.length, l: 'Total Kunjungan', i: <IconChart size={24}/> }, { v: avgPerDay, l: 'Rata-rata Per Hari', i: <IconTrendingUp size={24}/> }, { v: uniquePatients, l: 'Pasien Unik', i: <IconUsers size={24}/> }].map((s, i) => (
              <div className="stat-card" key={i}>
                <div className="stat-icon" style={{ background: 'var(--color-primary-light)' }}>{s.i}</div>
                <div className="stat-value">{s.v}</div>
                <div className="stat-label">{s.l}</div>
              </div>
            ))}
          </div>
          <div className="hide-mobile">
            <table className="data-table">
              <thead><tr><th>Tgl Daftar</th><th>Nama Pasien</th><th>Keluhan</th><th>Status Antrian</th><th>Rekam Medis</th></tr></thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Memuat data...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Data kunjungan tidak ditemukan</td></tr>
                ) : filtered.map(v => (
                  <tr key={v.id}>
                    <td>{new Date(v.tanggal_daftar).toLocaleDateString('id-ID')}</td>
                    <td style={{ fontWeight: 500 }}>{v.nama_pasien}</td>
                    <td>{v.keluhan || '-'}</td>
                    <td><span className={`badge ${v.status === 'selesai' ? 'badge-success' : 'badge-warning'}`} style={{ textTransform: 'capitalize' }}>{v.status}</span></td>
                    <td>{v.rekam_medis_id ? <span style={{color: 'var(--color-success)'}}>Ada</span> : <span style={{color: 'var(--color-text-muted)'}}>-</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="hide-desktop" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {isLoading ? (
              <div style={{textAlign: 'center', padding: '20px'}}>Memuat data...</div>
            ) : filtered.length === 0 ? (
              <div style={{textAlign: 'center', padding: '20px'}}>Data tidak ditemukan</div>
            ) : filtered.map(v => (
              <div className="glass-card" key={v.id} style={{ padding: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong>{v.nama_pasien}</strong>
                  <span className={`badge ${v.status === 'selesai' ? 'badge-success' : 'badge-warning'}`} style={{ textTransform: 'capitalize' }}>{v.status}</span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)' }}>{new Date(v.tanggal_daftar).toLocaleDateString('id-ID')} — {v.keluhan || '-'}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', borderTop: '1px solid var(--color-border-light)', paddingTop: '6px', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Rekam Medis:</span>
                  <span style={{ fontWeight: 600, color: v.rekam_medis_id ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                    {v.rekam_medis_id ? 'Tersedia' : 'Belum Ada'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav variant="bidan" />
    </div>
  );
}
