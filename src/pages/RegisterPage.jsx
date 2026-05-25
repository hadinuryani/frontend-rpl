import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { IconFlower, IconMessageCircle, IconFemale, IconMale, IconArrowRight, IconArrowLeft, IconAlertTriangle } from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import BidanAvatar from '../components/BidanAvatar';
import './AuthPages.css';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '',
    nama: '', tanggalLahir: '', jenisKelamin: 'perempuan',
    alamat: '', whatsapp: '', golDarah: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const { register, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    return <Navigate to={user.role === 'bidan' ? '/bidan' : '/patient'} replace />;
  }

  const update = (field, value) => {
    setForm({ ...form, [field]: value });
    // clear error for this field
    if (errors[field]) setErrors({ ...errors, [field]: null });
  };

  const handleNext = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.email) newErrors.email = 'Email wajib diisi';
    if (!form.password) newErrors.password = 'Password wajib diisi';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Password tidak cocok';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.nama) newErrors.nama = 'Nama wajib diisi';
    if (!form.tanggalLahir) newErrors.tanggalLahir = 'Tanggal lahir wajib diisi';
    if (!form.whatsapp) newErrors.whatsapp = 'No WhatsApp wajib diisi';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = {
        email: form.email,
        password: form.password,
        confirm_password: form.confirmPassword,
        nama_lengkap: form.nama,
        tanggal_lahir: form.tanggalLahir,
        jenis_kelamin: form.jenisKelamin,
        alamat: form.alamat || '-',
        no_wa: form.whatsapp,
        golongan_darah: form.golDarah && form.golDarah !== 'Tidak Tahu' ? form.golDarah : undefined
      };
      
      const loggedUser = await register(payload);
      if (loggedUser.role === 'bidan') {
        navigate('/bidan', { replace: true });
      } else {
        navigate('/patient', { replace: true });
      }
    } catch (err) {
      setErrors({ general: err.message || 'Gagal mendaftar, silakan coba lagi.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-layout" id="register-page">
      <div className="auth-panel-left hide-mobile">
        <div className="auth-logo">IC+</div>
        <p className="auth-tagline">Kesehatan Anda, Prioritas Kami</p>
        <div className="auth-decoration"><IconFlower size={120} color="rgba(240,228,194,0.15)"/></div>
      </div>

      <div className="auth-panel-right">
        <div className="auth-form-container register-container animate-fade-in-up">
          <div className="auth-header">
            <div className="logo-text hide-desktop">
              <span className="logo-ic" style={{ fontSize: '2rem' }}>IC</span>
              <span className="logo-plus" style={{ fontSize: '2rem', color: '#B5943A' }}>+</span>
            </div>
            <h1>{step === 1 ? 'Buat Akun Baru' : 'Lengkapi Data Diri'}</h1>
            <p>{step === 1 ? 'Daftarkan diri Anda untuk mengakses layanan IC+' : 'Informasi ini dibutuhkan untuk pelayanan kesehatan Anda'}</p>
          </div>

          <div className="step-indicator">
            <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
            <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
            <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
          </div>

          {errors.general && (
            <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconAlertTriangle size={18} />
              <span>{errors.general}</span>
            </div>
          )}

          {step === 1 ? (
            <div className="card uiverse-auth-card animate-fade-in-up">
              <input
                type="checkbox"
                className="blind-check"
                id="blind-input"
                checked={!showPassword}
                onChange={() => setShowPassword(!showPassword)}
                hidden
              />

              <form className="form" onSubmit={handleNext} id="register-step1">
                <div className="title">Daftar</div>

                <label className="label_input" htmlFor="reg-email">Email <span className="required">*</span></label>
                <input
                  spellCheck="false"
                  className={`input ${errors.email ? 'error' : ''}`}
                  type="email"
                  id="reg-email"
                  placeholder="nama@email.com"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  required
                />
                {errors.email && <span className="form-error" style={{ alignSelf: 'flex-start', color: '#b91c1c', fontSize: '0.75rem', marginTop: '-4px', marginBottom: '8px' }}>{errors.email}</span>}

                <label className="label_input" htmlFor="reg-password">Password <span className="required">*</span></label>
                <div className="password-wrapper" style={{ position: 'relative', width: '100%' }}>
                  <input
                    spellCheck="false"
                    className={`input ${errors.password ? 'error' : ''}`}
                    type={showPassword ? 'text' : 'password'}
                    id="reg-password"
                    placeholder="Minimal 8 karakter"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    required
                    minLength="8"
                    style={{ paddingRight: '80px' }}
                  />
                  <label htmlFor="blind-input" className="blind_input">
                    <span className="hide">Hide</span>
                    <span className="show">Show</span>
                  </label>
                </div>
                {errors.password && <span className="form-error" style={{ alignSelf: 'flex-start', color: '#b91c1c', fontSize: '0.75rem', marginTop: '4px', marginBottom: '8px' }}>{errors.password}</span>}

                <label className="label_input" htmlFor="reg-confirm">Konfirmasi Password <span className="required">*</span></label>
                <input
                  spellCheck="false"
                  className={`input ${errors.confirmPassword ? 'error' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  id="reg-confirm"
                  placeholder="Ulangi password"
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  required
                />
                {errors.confirmPassword && <span className="form-error" style={{ alignSelf: 'flex-start', color: '#b91c1c', fontSize: '0.75rem', marginTop: '-4px', marginBottom: '8px' }}>{errors.confirmPassword}</span>}

                <button className="submit" type="submit" id="register-next">
                  Lanjut <IconArrowRight size={18} style={{ marginLeft: '4px', verticalAlign: 'middle' }}/>
                </button>

                <p className="auth-link-text" style={{ marginTop: '1.5rem', fontSize: '0.875rem' }}>
                  Sudah punya akun? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Masuk di sini</Link>
                </p>
              </form>

              <label htmlFor="blind-input" className="avatar" ref={avatarRef}>
                <BidanAvatar mousePos={mousePos} showPassword={showPassword} />
              </label>
            </div>
          ) : (
            <form className="glass-card auth-card" onSubmit={handleSubmit} id="register-step2">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-nama">Nama Lengkap <span className="required">*</span></label>
                <input type="text" id="reg-nama" className={`form-input ${errors.nama ? 'error' : ''}`} placeholder="Nama lengkap Anda" value={form.nama} onChange={(e) => update('nama', e.target.value)} required disabled={isSubmitting} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-tglLahir">Tanggal Lahir <span className="required">*</span></label>
                <input type="date" id="reg-tglLahir" className={`form-input ${errors.tanggalLahir ? 'error' : ''}`} value={form.tanggalLahir} onChange={(e) => update('tanggalLahir', e.target.value)} required disabled={isSubmitting} />
              </div>
              <div className="form-group">
                <label className="form-label">Jenis Kelamin</label>
                <div className="gender-pills">
                  {['perempuan', 'laki-laki'].map((g) => (
                    <button key={g} type="button" className={`gender-pill ${form.jenisKelamin === g ? 'active' : ''}`} onClick={() => update('jenisKelamin', g)} disabled={isSubmitting}>
                      {g === 'perempuan' ? <IconFemale size={16}/> : <IconMale size={16}/>} {g === 'perempuan' ? 'Perempuan' : 'Laki-laki'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-alamat">Alamat</label>
                <textarea id="reg-alamat" className="form-textarea" placeholder="Alamat lengkap" rows="2" value={form.alamat} onChange={(e) => update('alamat', e.target.value)} disabled={isSubmitting}></textarea>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-wa">Nomor WhatsApp <span className="required">*</span></label>
                <div className="input-wrapper">
                  <span className="input-icon"><IconMessageCircle size={18}/></span>
                  <input type="tel" id="reg-wa" className={`form-input ${errors.whatsapp ? 'error' : ''}`} placeholder="08xxxxxxxxxx" value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} required disabled={isSubmitting} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-blood">Golongan Darah</label>
                <select id="reg-blood" className="form-select" value={form.golDarah} onChange={(e) => update('golDarah', e.target.value)} disabled={isSubmitting}>
                  <option value="">Pilih golongan darah</option>
                  <option value="A">A</option><option value="B">B</option><option value="AB">AB</option><option value="O">O</option><option value="Tidak Tahu">Tidak Tahu</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary btn-full btn-lg" id="register-finish" disabled={isSubmitting}>
                {isSubmitting ? 'Memproses...' : 'Selesai & Daftar'}
              </button>
              <button type="button" className="btn btn-ghost btn-full" onClick={() => setStep(1)} style={{ marginTop: '8px' }} disabled={isSubmitting}><IconArrowLeft size={16}/> Kembali ke Step 1</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
