import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconArrowLeft, IconHome, IconStethoscope, IconPregnant, IconBaby, IconHeart, IconAlertTriangle } from '../components/Icons';
import './NotFound.css';

export default function NotFound() {
  const { user } = useAuth();

  // Determine back path based on user role
  const getHomePath = () => {
    if (!user) return '/';
    if (user.role === 'pasien') return '/patient';
    if (user.role === 'bidan') return '/bidan';
    return '/';
  };

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-visual">
          <div className="shapes-container">
            <div className="floating-shape shape-large"></div>
            <div className="floating-shape shape-medium"></div>
            <div className="floating-shape shape-small"></div>
            
            {/* Health/midwifery related floating items */}
            <div className="floating-icon f-icon-1"><IconStethoscope size={28} color="var(--color-primary)" /></div>
            <div className="floating-icon f-icon-2"><IconPregnant size={28} color="var(--color-accent)" /></div>
            <div className="floating-icon f-icon-3"><IconBaby size={28} color="var(--color-primary-dark)" /></div>
            <div className="floating-icon f-icon-4"><IconHeart size={24} color="var(--color-error)" /></div>
          </div>
          
          <div className="error-code-container">
            <h1 className="error-code animate-float">404</h1>
            <div className="pulse-circle"></div>
            <div className="pulse-circle-outer"></div>
          </div>
        </div>

        <div className="not-found-content stagger-children">
          <div className="error-badge">
            <IconAlertTriangle size={16} />
            <span>Halaman Tidak Ditemukan</span>
          </div>
          
          <h2 className="error-title">Ups! Halaman Hilang dari Catatan Medis</h2>
          <p className="error-description">
            Sepertinya halaman yang Anda tuju telah berpindah alamat, dihapus, atau tidak pernah ada dalam sistem kami. 
            Mari kembali ke jalur pemeriksaan yang aman.
          </p>

          <div className="error-actions">
            <Link to={getHomePath()} className="btn btn-primary btn-lg back-btn">
              <IconHome size={18} />
              <span>Kembali ke Beranda</span>
            </Link>
            <button onClick={() => window.history.back()} className="btn btn-secondary btn-lg back-btn">
              <IconArrowLeft size={18} />
              <span>Kembali Sebelumnya</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
