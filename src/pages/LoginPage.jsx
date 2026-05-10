import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { IconMail, IconLock, IconEye, IconEyeOff, IconLeaf, IconAlertTriangle } from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    return <Navigate to={user.role === 'bidan' ? '/bidan' : '/patient'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email) newErrors.email = 'Email wajib diisi';
    if (!password) newErrors.password = 'Password wajib diisi';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const loggedUser = await login(email, password);
        // Redirect based on role
        if (loggedUser.role === 'bidan') {
          navigate('/bidan', { replace: true });
        } else {
          navigate('/patient', { replace: true });
        }
      } catch (err) {
        setErrors({ general: err.message || 'Login gagal, periksa email dan password Anda.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="auth-layout" id="login-page">
      <div className="auth-panel-left hide-mobile">
        <div className="auth-logo">IC+</div>
        <p className="auth-tagline">Selamat Datang Kembali</p>
        <div className="auth-decoration"><IconLeaf size={120} color="rgba(240,228,194,0.15)"/></div>
      </div>

      <div className="auth-panel-right">
        <div className="auth-form-container animate-fade-in-up">
          <div className="auth-header">
            <div className="logo-text hide-desktop">
              <span className="logo-ic" style={{ fontSize: '2rem' }}>IC</span>
              <span className="logo-plus" style={{ fontSize: '2rem', color: '#B5943A' }}>+</span>
            </div>
            <h1>Masuk ke Akun Anda</h1>
            <p>Kelola layanan kesehatan Anda dengan mudah</p>
          </div>

          <form className="glass-card auth-card" onSubmit={handleSubmit} id="login-form">
            {errors.general && (
              <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconAlertTriangle size={18} />
                <span>{errors.general}</span>
              </div>
            )}
            
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email</label>
              <div className="input-wrapper">
                <span className="input-icon"><IconMail size={18}/></span>
                <input
                  type="email"
                  id="login-email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && <span className="form-error"><IconAlertTriangle size={14}/> {errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><IconLock size={18}/></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="input-action"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  disabled={isSubmitting}
                >
                  {showPassword ? <IconEyeOff size={18}/> : <IconEye size={18}/>}
                </button>
              </div>
              {errors.password && <span className="form-error"><IconAlertTriangle size={14}/> {errors.password}</span>}
            </div>

            <div style={{ textAlign: 'right', marginBottom: 'var(--space-5)' }}>
              <a href="#" className="forgot-link">Lupa password?</a>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" id="login-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Memproses...' : 'Masuk'}
            </button>

            <div className="divider"><span>atau</span></div>

            <p className="auth-link-text">
              Belum punya akun? <Link to="/register">Daftar di sini</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
