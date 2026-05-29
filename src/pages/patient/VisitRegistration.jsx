import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import { IconArrowLeft, IconCheckCircle, IconCalendar, IconFileText } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import api from '../../services/api';
import './PatientPages.css';

export default function VisitRegistration() {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [isClinicOpen, setIsClinicOpen] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState('');
  const [complaint, setComplaint] = useState('');
  
  const [queueNumber, setQueueNumber] = useState('');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await api.get('/klinik/status');
        setIsClinicOpen(res.data?.status === 'buka' || false);
      } catch (err) {
        console.error("Gagal mengecek status klinik", err);
      } finally {
        setIsLoadingStatus(false);
      }
    };
    checkStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !complaint) return;

    setIsSubmitting(true);
    try {
      const res = await api.post('/pasien/antrian', {
        tanggal_kunjungan: date,
        keluhan: complaint
      });
      
      setQueueNumber(res.data?.no_antrian || 'Menunggu');
      setSubmitted(true);
    } catch (err) {
      await showAlert(err.message || 'Gagal mendaftar antrian. Pastikan jadwal tidak penuh atau coba lagi.', { variant: 'error', title: 'Gagal' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="app-layout" id="visit-success">
        <Sidebar variant="patient" />
        <div className="main-content">
          <Navbar variant="patient" userName={user?.profile?.nama_lengkap || "Pasien"} />
          <div className="page-content">
            <div className="success-state">
              <div className="success-icon"><IconCheckCircle size={80}/></div>
              <h2>Pendaftaran Berhasil!</h2>
              <div className="queue-ticket">
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '8px' }}>Nomor Antrian</div>
                <div className="queue-number">{queueNumber}</div>
                <div style={{ marginTop: '16px', fontSize: '0.875rem' }}>
                  <div><IconCalendar size={14} style={{display:'inline',verticalAlign:'middle',marginRight:'4px'}}/> Tanggal: <strong>{new Date(date).toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}</strong></div>
                  <div style={{ marginTop: '8px' }}>
                    Status: <span className="badge badge-waiting">Menunggu</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link to="/patient" className="btn btn-primary">Kembali ke Beranda</Link>
                <Link to="/patient/records" className="btn btn-jade">Lihat Rekam Medis</Link>
              </div>
            </div>
          </div>
        </div>
        <BottomNav variant="patient" />
      </div>
    );
  }

  return (
    <div className="app-layout" id="visit-registration">
      <Sidebar variant="patient" />
      <div className="main-content">
        <Navbar variant="patient" userName={user?.profile?.nama_lengkap || "Pasien"} />
        <div className="page-content">
          <div className="page-header">
            <div className="page-title">
              <Link to="/patient" className="back-btn"><IconArrowLeft size={18}/></Link>
              <h2>Daftar Kunjungan Baru</h2>
            </div>
          </div>

          {!isLoadingStatus && (
            <div className={`clinic-status-banner ${isClinicOpen ? 'status-open' : 'status-closed'}`}>
              <span className={`pulse-dot ${isClinicOpen ? '' : 'red'}`}></span>
              {isClinicOpen ? 'Klinik Sedang Buka — Pendaftaran Tersedia' : 'Klinik Sedang Tutup — Pendaftaran Tidak Tersedia'}
            </div>
          )}

          <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-7)' }}>
            <form onSubmit={handleSubmit} id="visit-form">
              <div className="form-group">
                <label className="form-label" htmlFor="visit-date">Tanggal Kunjungan <span className="required">*</span></label>
                <input type="date" id="visit-date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} required disabled={!isClinicOpen || isSubmitting} min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="visit-complaint">Keluhan / Keperluan <span className="required">*</span></label>
                <textarea id="visit-complaint" className="form-textarea" placeholder="Tuliskan keluhan atau keperluan kunjungan Anda..." value={complaint} onChange={(e) => setComplaint(e.target.value.slice(0, 300))} required disabled={!isClinicOpen || isSubmitting} rows="4"></textarea>
                <div className="char-counter">{complaint.length}/300</div>
              </div>
              {(date || complaint) && (
                <div className="info-card" style={{ marginBottom: 'var(--space-5)', background: 'var(--color-primary-light)' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>Preview Pendaftaran</div>
                  {date && <div style={{ fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '4px' }}><IconCalendar size={14}/> {new Date(date).toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}</div>}
                  {complaint && <div style={{ fontSize: '0.8125rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><IconFileText size={14}/> {complaint.slice(0, 100)}{complaint.length > 100 ? '...' : ''}</div>}
                </div>
              )}
              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={!isClinicOpen || isSubmitting || !date || !complaint} id="visit-submit">
                {isSubmitting ? 'Mendaftar...' : 'Konfirmasi Pendaftaran'}
              </button>
              <Link to="/patient" className="btn btn-ghost btn-full" style={{ marginTop: '8px' }}>Batal</Link>
            </form>
          </div>
        </div>
      </div>
      <BottomNav variant="patient" />
    </div>
  );
}
