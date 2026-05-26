import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconArrowLeft, IconHome, IconAlertTriangle } from '../components/Icons';
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
          </div>
          
          <div className="illustration-wrapper">
            <svg className="medical-error-svg" viewBox="0 0 300 300" width="300" height="300" xmlns="http://www.w3.org/2000/svg">
              {/* EKG heartbeat wave on the left */}
              <path d="M 10,150 L 40,150 L 45,145 L 50,150 L 55,150 L 60,110 L 65,185 L 70,150 L 75,150 L 83,140 L 90,150 L 125,150" fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" opacity="0.65" />
              
              {/* Severed/Broken Connection Point in the center */}
              <path d="M 125,150 Q 130,120 140,140" fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeDasharray="4,2" />
              
              {/* Flat-lined EKG on the right */}
              <path d="M 160,150 L 290,150" fill="none" stroke="var(--color-error)" strokeWidth="3" strokeLinecap="round" opacity="0.65" />

              {/* IV Infusion Pole */}
              <path d="M 90,40 L 90,260 M 90,50 L 65,65 M 90,50 L 115,65" stroke="var(--color-border)" strokeWidth="4.5" strokeLinecap="round" />

              {/* IV Drip Bag */}
              <g transform="translate(48, 60)">
                <path d="M 17,0 C 17,-5 23,-5 23,0" fill="none" stroke="var(--color-text-light)" strokeWidth="2.5" />
                <line x1="20" y1="0" x2="20" y2="12" stroke="var(--color-text-light)" strokeWidth="2.5" />
                <rect x="5" y="12" width="30" height="52" rx="8" fill="rgba(255, 255, 255, 0.9)" stroke="var(--color-primary)" strokeWidth="2.5" />
                <rect x="7" y="24" width="26" height="38" rx="5" fill="rgba(215, 245, 233, 0.7)" />
                <path d="M 7,24 Q 13,22 20,24 T 33,24 L 33,28 L 7,28 Z" fill="rgba(148, 216, 185, 0.8)" />
                <line x1="9" y1="30" x2="13" y2="30" stroke="var(--color-primary-dark)" strokeWidth="1.5" />
                <line x1="9" y1="40" x2="13" y2="40" stroke="var(--color-primary-dark)" strokeWidth="1.5" />
                <line x1="9" y1="50" x2="13" y2="50" stroke="var(--color-primary-dark)" strokeWidth="1.5" />
                <rect x="16" y="64" width="8" height="18" rx="2" fill="rgba(255, 255, 255, 0.95)" stroke="var(--color-primary)" strokeWidth="2" />
                <circle cx="20" cy="71" r="1.5" fill="var(--color-primary)" />
              </g>

              {/* Severed/Disconnected Infusion Tube */}
              <path d="M 68,142 Q 68,180 130,180" fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" />
              
              <circle cx="130" cy="180" r="3" fill="var(--color-primary)">
                <animate attributeName="cy" values="180;225" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0" dur="1.6s" repeatCount="indefinite" />
              </circle>
              
              <path d="M 160,180 Q 165,210 215,210 T 250,240" fill="none" stroke="var(--color-text-muted)" strokeWidth="3" strokeLinecap="round" />
              
              <g transform="translate(145, 180)">
                <circle cx="0" cy="0" r="10" fill="none" stroke="var(--color-error)" strokeWidth="1.5">
                  <animate attributeName="r" values="5;18;5" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
                </circle>
                <path d="M -4,-4 L 4,4 M 4,-4 L -4,4" stroke="var(--color-error)" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* Floating icons inside SVG */}
              <g transform="translate(230, 45)">
                <rect x="0" y="0" width="32" height="32" rx="8" fill="var(--color-white)" stroke="rgba(224, 92, 92, 0.15)" strokeWidth="1.5" />
                <path d="M 16,8 L 16,24 M 8,16 L 24,16" stroke="var(--color-error)" strokeWidth="4.5" strokeLinecap="round" />
              </g>

              <g transform="translate(20, 20)">
                <circle cx="15" cy="15" r="15" fill="var(--color-white)" stroke="rgba(64, 145, 108, 0.15)" strokeWidth="1.5" />
                <path d="M 10,12 C 10,8 20,8 20,12 C 20,17 12,19 12,23" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="24" r="2" fill="var(--color-primary)" />
              </g>
            </svg>
            <h1 className="error-code-overlay animate-float">404</h1>
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
