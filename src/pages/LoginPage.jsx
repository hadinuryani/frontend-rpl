import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { IconLock, IconEye, IconEyeOff, IconLeaf, IconAlertTriangle, IconMessageCircle, IconKey } from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import api from '../services/api';
import BidanAvatar from '../components/BidanAvatar';
import './AuthPages.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [view, setView] = useState('login'); // 'login' | 'forgot' | 'reset'
  const [otpNoWa, setOtpNoWa] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const avatarRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!avatarRef.current) return;
      const rect = avatarRef.current.getBoundingClientRect();
      const avatarCenterX = rect.left + rect.width / 2;
      const avatarCenterY = rect.top + rect.height / 2;
      
      const dx = e.clientX - avatarCenterX;
      const dy = e.clientY - avatarCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const maxMove = 12; 
      let moveX = 0;
      let moveY = 0;
      
      if (distance > 0) {
        moveX = (dx / distance) * Math.min(distance / 40, maxMove);
        moveY = (dy / distance) * Math.min(distance / 40, maxMove);
      }
      
      setMousePos({ x: moveX, y: moveY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const { login, user } = useAuth();
  const { showAlert } = useAlert();
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

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!otpNoWa) {
      setErrors({ forgotNoWa: 'Nomor WhatsApp wajib diisi' });
      return;
    }
    setIsSubmitting(true);
    setErrors({});
    try {
      await api.post('/auth/forgot-password', { no_wa: otpNoWa });
      await showAlert('Kode OTP berhasil dikirim ke nomor WhatsApp Anda!', { variant: 'success', title: 'Sukses' });
      setView('reset');
    } catch (err) {
      setErrors({ general: err.message || 'Gagal mengirim OTP. Pastikan nomor WhatsApp terdaftar.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!otpCode || otpCode.length !== 6) newErrors.otp = 'Kode OTP harus 6 digit';
    if (!newPassword || newPassword.length < 8) newErrors.newPassword = 'Password minimal 8 karakter';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await api.post('/auth/reset-password', {
        no_wa: otpNoWa,
        otp_code: otpCode,
        new_password: newPassword
      });
      await showAlert('Password Anda berhasil diubah! Silakan login kembali.', { variant: 'success', title: 'Sukses' });
      setView('login');
      setOtpCode('');
      setNewPassword('');
    } catch (err) {
      setErrors({ general: err.message || 'Gagal mereset password. Pastikan OTP valid.' });
    } finally {
      setIsSubmitting(false);
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
            {view === 'login' && (
              <>
                <h1>Masuk ke Akun Anda</h1>
                <p>Kelola layanan kesehatan Anda dengan mudah</p>
              </> 
            )}
            {view === 'forgot' && (
              <>
                <h1>Lupa Password</h1>
                <p>Masukkan nomor WhatsApp terdaftar untuk menerima kode OTP</p>
              </>
            )}
            {view === 'reset' && (
              <>
                <h1>Reset Password</h1>
                <p>Masukkan kode OTP dan password baru Anda</p>
              </>
            )}
          </div>

          {view === 'login' && (
            <div className="card uiverse-auth-card animate-fade-in-up">
              <input
                type="checkbox"
                className="blind-check"
                id="blind-input"
                checked={!showPassword}
                onChange={() => setShowPassword(!showPassword)}
                hidden
              />

              <form className="form" onSubmit={handleSubmit} id="login-form">
                <div className="title">Masuk</div>

                {errors.general && (
                  <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
                    <IconAlertTriangle size={18} />
                    <span style={{ fontSize: '0.875rem' }}>{errors.general}</span>
                  </div>
                )}

                <label className="label_input" htmlFor="login-email">Email</label>
                <input
                  spellCheck="false"
                  className={`input ${errors.email ? 'error' : ''}`}
                  type="email"
                  id="login-email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
                {errors.email && <span className="form-error" style={{ alignSelf: 'flex-start', color: '#b91c1c', fontSize: '0.75rem', marginTop: '-4px', marginBottom: '8px' }}>{errors.email}</span>}

                <div className="frg_pss">
                  <label className="label_input" htmlFor="login-password">Password</label>
                  <a href="#" onClick={(e) => { e.preventDefault(); setView('forgot'); setOtpNoWa(''); setErrors({}); }}>Lupa password?</a>
                </div>
                <div className="password-wrapper" style={{ position: 'relative', width: '100%' }}>
                  <input
                    spellCheck="false"
                    className={`input ${errors.password ? 'error' : ''}`}
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    required
                    style={{ paddingRight: '80px' }}
                  />
                  <label htmlFor="blind-input" className="blind_input">
                    <span className="hide">Hide</span>
                    <span className="show">Show</span>
                  </label>
                </div>
                {errors.password && <span className="form-error" style={{ alignSelf: 'flex-start', color: '#b91c1c', fontSize: '0.75rem', marginTop: '4px', marginBottom: '8px' }}>{errors.password}</span>}

                <button className="submit" type="submit" id="login-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Memproses...' : 'Masuk'}
                </button>

                <p className="auth-link-text" style={{ marginTop: '1.5rem', fontSize: '0.875rem' }}>
                  Belum punya akun? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Daftar di sini</Link>
                </p>
              </form>

              <label htmlFor="blind-input" className="avatar" ref={avatarRef}>
                <BidanAvatar mousePos={mousePos} showPassword={showPassword} />
              </label>
            </div>
          )}

          {view === 'forgot' && (
            <form className="glass-card auth-card" onSubmit={handleForgotSubmit} id="forgot-form">
              {errors.general && (
                <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IconAlertTriangle size={18} />
                  <span>{errors.general}</span>
                </div>
              )}
              
              <div className="form-group">
                <label className="form-label" htmlFor="forgot-nowa">Nomor WhatsApp Terdaftar</label>
                <div className="input-wrapper">
                  <span className="input-icon"><IconMessageCircle size={18}/></span>
                  <input
                    type="text"
                    id="forgot-nowa"
                    className={`form-input ${errors.forgotNoWa ? 'error' : ''}`}
                    placeholder="Contoh: 081259277769"
                    value={otpNoWa}
                    onChange={(e) => setOtpNoWa(e.target.value.replace(/\D/g, ''))}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                {errors.forgotNoWa && <span className="form-error"><IconAlertTriangle size={14}/> {errors.forgotNoWa}</span>}
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginBottom: '12px' }} disabled={isSubmitting}>
                {isSubmitting ? 'Mengirim...' : 'Kirim OTP ke WhatsApp'}
              </button>

              <button type="button" className="btn btn-secondary btn-full btn-lg" onClick={() => { setView('login'); setErrors({}); }} disabled={isSubmitting}>
                Kembali ke Login
              </button>
            </form>
          )}

          {view === 'reset' && (
            <form className="glass-card auth-card" onSubmit={handleResetSubmit} id="reset-form">
              {errors.general && (
                <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IconAlertTriangle size={18} />
                  <span>{errors.general}</span>
                </div>
              )}
              
              <div className="form-group">
                <label className="form-label">Nomor WhatsApp</label>
                <div className="input-wrapper">
                  <span className="input-icon"><IconMessageCircle size={18}/></span>
                  <input
                    type="text"
                    className="form-input"
                    value={otpNoWa}
                    disabled
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reset-otp">Kode OTP WhatsApp</label>
                <div className="input-wrapper">
                  <span className="input-icon"><IconKey size={18}/></span>
                  <input
                    type="text"
                    id="reset-otp"
                    className={`form-input ${errors.otp ? 'error' : ''}`}
                    placeholder="Masukkan 6 digit OTP"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                {errors.otp && <span className="form-error"><IconAlertTriangle size={14}/> {errors.otp}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reset-new-password">Password Baru</label>
                <div className="input-wrapper">
                  <span className="input-icon"><IconLock size={18}/></span>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    id="reset-new-password"
                    className={`form-input ${errors.newPassword ? 'error' : ''}`}
                    placeholder="Password baru minimal 8 karakter"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                  <button
                    type="button"
                    className="input-action"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={isSubmitting}
                  >
                    {showNewPassword ? <IconEyeOff size={18}/> : <IconEye size={18}/>}
                  </button>
                </div>
                {errors.newPassword && <span className="form-error"><IconAlertTriangle size={14}/> {errors.newPassword}</span>}
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginBottom: '12px' }} disabled={isSubmitting}>
                {isSubmitting ? 'Memproses...' : 'Ubah Password'}
              </button>

              <button type="button" className="btn btn-secondary btn-full btn-lg" onClick={() => { setView('login'); setErrors({}); }} disabled={isSubmitting}>
                Batal
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
