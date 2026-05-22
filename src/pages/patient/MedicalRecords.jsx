import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import { IconArrowLeft, IconSearch, IconFolder, IconClipboard, IconPill, IconX } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './PatientPages.css';

export default function MedicalRecords() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await api.get('/pasien/rekam-medis');
        setRecords(res.data || []);
      } catch (err) {
        console.error("Gagal mengambil data rekam medis:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const filtered = records.filter(r => {
    const dateStr = new Date(r.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'});
    return dateStr.toLowerCase().includes(search.toLowerCase()) || 
           (r.keluhan_utama && r.keluhan_utama.toLowerCase().includes(search.toLowerCase()));
  });

  return (
    <div className="app-layout" id="medical-records">
      <Sidebar variant="patient" />
      <div className="main-content">
        <Navbar variant="patient" userName={user?.profile?.nama_lengkap || "Pasien"} />
        <div className="page-content">
          <div className="page-header">
            <div className="page-title">
              <Link to="/patient" className="back-btn"><IconArrowLeft size={18}/></Link>
              <h2>Riwayat Rekam Medis</h2>
            </div>
          </div>
          <div style={{ marginBottom: 'var(--space-5)', maxWidth: '400px' }}>
            <div className="input-wrapper">
              <span className="input-icon"><IconSearch size={18}/></span>
              <input type="text" className="form-input" placeholder="Cari berdasarkan tanggal atau keluhan..." value={search} onChange={(e) => setSearch(e.target.value)} id="records-search" />
            </div>
          </div>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Memuat data rekam medis...</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><IconFolder size={64} color="var(--color-text-muted)"/></div>
              <div className="empty-title">Belum ada riwayat pemeriksaan</div>
              <div className="empty-desc">Riwayat pemeriksaan Anda akan muncul di sini setelah kunjungan.</div>
            </div>
          ) : (
            <div className="timeline">
              {filtered.map((r) => (
                <div className="timeline-item" key={r.id}>
                  <div className="timeline-dot"></div>
                  <div className="glass-card" style={{ padding: 'var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <span className="badge badge-success" style={{ marginBottom: '8px' }}>{new Date(r.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</span>
                      <div style={{ fontSize: '0.9375rem', color: 'var(--color-dark)', fontWeight: 500, marginTop: '8px' }}>{r.keluhan_utama}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className="badge badge-success">Selesai</span>
                      <button className="btn btn-ghost btn-sm" onClick={() => setSelectedRecord(r)}>Lihat Detail →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav variant="patient" />

      {selectedRecord && (
        <div className="modal-overlay" onClick={() => setSelectedRecord(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>Detail Kunjungan — {new Date(selectedRecord.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</h3>
              <button className="modal-close" onClick={() => setSelectedRecord(null)}><IconX size={16}/></button>
            </div>
            <div className="modal-body">
              <h4 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}><IconClipboard size={20}/> Hasil Pemeriksaan</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px 16px', fontSize: '0.875rem', marginBottom: 'var(--space-6)' }}>
                <span style={{ color: 'var(--color-text-light)' }}>Keluhan</span><span style={{ fontWeight: 500 }}>{selectedRecord.keluhan_utama}</span>
                <span style={{ color: 'var(--color-text-light)' }}>Tekanan Darah</span><span style={{ fontWeight: 500 }}>{selectedRecord.tekanan_darah} mmHg</span>
                <span style={{ color: 'var(--color-text-light)' }}>Berat Badan</span><span style={{ fontWeight: 500 }}>{selectedRecord.berat_badan} kg</span>
                <span style={{ color: 'var(--color-text-light)' }}>Kondisi Janin</span><span style={{ fontWeight: 500 }}>{selectedRecord.kondisi_janin || '-'}</span>
                <span style={{ color: 'var(--color-text-light)' }}>Catatan Bidan</span><span style={{ fontWeight: 500 }}>{selectedRecord.catatan_bidan}</span>
              </div>
              {selectedRecord.resep && selectedRecord.resep.length > 0 && (
                <>
                  <div style={{ height: '1px', background: 'var(--color-border-light)', margin: 'var(--space-5) 0' }}></div>
                  <h4 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}><IconPill size={20}/> Resep Obat</h4>
                  {selectedRecord.resep.map((m, i) => (
                    <div className="medicine-row" key={i}>
                      <div className="medicine-info">
                        <div className="medicine-name">{m.nama_obat} (Jml: {m.jumlah})</div>
                        <div className="medicine-dose">{m.dosis} — {m.aturan_pakai}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
