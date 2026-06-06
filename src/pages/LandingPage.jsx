import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import Navbar from '../components/Navbar';
import SplashCursor from '../components/SplashCursor';
import {
  IconPregnant,
  IconBaby,
  IconSyringe,
  IconPill,
  IconBottle,
  IconStethoscope,
  IconHospital,
  IconFlower,
  IconHeart,
  IconDoctor,
  IconShield,
  IconAward,
  IconCheckCircle,
  IconClipboard,
  IconMapPin,
  IconClock,
  IconWhatsApp,
} from '../components/Icons';

import api from '../services/api';
import './LandingPage.css';
import BidanAvatar from '../components/BidanAvatar';

const services = [
  {
    icon: <IconPregnant size={36} />,
    title: 'ANC / Pemeriksaan Kehamilan',
    desc: 'Pemantauan kesehatan ibu dan janin secara berkala dengan standar medis terbaik.',
  },
  {
    icon: <IconBaby size={36} />,
    title: 'Persalinan',
    desc: 'Pendampingan persalinan yang aman dan nyaman dengan tenaga profesional.',
  },
  {
    icon: <IconSyringe size={36} />,
    title: 'Imunisasi Bayi',
    desc: 'Program imunisasi lengkap untuk tumbuh kembang optimal buah hati Anda.',
  },
  {
    icon: <IconPill size={36} />,
    title: 'KB / Kontrasepsi',
    desc: 'Konsultasi dan layanan kontrasepsi yang tepat sesuai kebutuhan Anda.',
  },
  {
    icon: <IconBottle size={36} />,
    title: 'Nifas & Laktasi',
    desc: 'Perawatan pasca persalinan dan dukungan menyusui dari ahlinya.',
  },
  {
    icon: <IconStethoscope size={36} />,
    title: 'Konsultasi Kesehatan',
    desc: 'Konsultasi kesehatan reproduksi dan kebidanan secara komprehensif.',
  },
];

export default function LandingPage() {
  const [klinikStatus, setKlinikStatus] = useState(null);

  // Avatar animation
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const avatarRef = useRef(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get('/klinik/status');
        setKlinikStatus(res.data);
      } catch (err) {
        console.error('Gagal mengambil status klinik:', err);
      }
    };

    fetchStatus();
  }, []);

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

      setMousePos({
        x: moveX,
        y: moveY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="landing-page">
      <SplashCursor
        SIM_RESOLUTION={128}
        DYE_RESOLUTION={1440}
        DENSITY_DISSIPATION={4}
        VELOCITY_DISSIPATION={5}
        PRESSURE={0.1}
        CURL={3}
        SPLAT_RADIUS={0.2}
        SPLAT_FORCE={6000}
        COLOR_UPDATE_SPEED={19}
      />
      <Navbar variant="public" />

      {/* Hero Section */}
      <section className="hero-section" id="beranda">
        <div className="container hero-content">
          <div className="hero-text animate-fade-in-up">
            {klinikStatus && (
              <div className={`clinic-status-pill ${klinikStatus.status === 'buka' ? 'status-open' : 'status-closed'}`}>
                <div className="dots-border"></div>
                <span className={`pulse-dot ${klinikStatus.status === 'buka' ? 'green' : 'red'}`}></span>
                <span>
                  {klinikStatus.status === 'buka'
                    ? 'Klinik Buka • Siap Melayani'
                    : 'Klinik Tutup • Di Luar Jam Kerja'}
                </span>
              </div>
            )}

            {!klinikStatus && (
              <div className="clinic-status-pill status-loading">
                <div className="dots-border"></div>
                <span
                  className="pulse-dot"
                  style={{
                    animation: 'none',
                    backgroundColor: '#ccc',
                  }}
                ></span>
                <span>Memeriksa Status...</span>
              </div>
            )}

            <h1>
              Layanan Kebidanan Terpercaya,{' '}
              <span className="text-accent-gold">
                Kini Hadir Digital
              </span>
            </h1>

            <p className="hero-subtitle">
              Nikmati kemudahan akses layanan kebidanan profesional
              melalui platform digital Indah Care Plus. Pendampingan kehamilan yang aman, nyaman, dan praktis dari rumah Anda.
            </p>

            <div className="hero-stats-strip animate-fade-in-up">
              <div className="stat-item">
                <span className="stat-num">15+</span>
                <span className="stat-label">Tahun Pengalaman</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-num">1K+</span>
                <span className="stat-label">Ibu Terbantu</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-num">100%</span>
                <span className="stat-label">STR Terakreditasi</span>
              </div>
            </div>

            <div className="hero-ctas">
              <Link
                to="/register"
                className="btn btn-primary btn-lg"
              >
                Daftar Sekarang
              </Link>

              <Link
                to="/login"
                className="btn btn-secondary btn-lg"
              >
                Masuk ke Sistem
              </Link>
            </div>
          </div>

          <div className="hero-visual animate-fade-in">
            <div className="hero-illustration">
              {/* <div className="hero-shape shape-1"></div>
              <div className="hero-shape shape-2"></div>
              <div className="hero-shape shape-3"></div>

              <div className="hero-icon-float icon-1">
                <IconFlower size={32} color="#B5943A" />
              </div>

              <div className="hero-icon-float icon-2">
                <IconHeart size={32} color="#40916C" />
              </div>

              <div className="hero-icon-float icon-3">
                <IconPregnant size={32} color="#B5943A" />
              </div> */}

              {/* Avatar Interactive */}
              <div
                  ref={avatarRef}
                  
                >
                  <BidanAvatar
                    mousePos={mousePos}
                    showPassword={false}
                  />
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section" id="layanan">
        <div className="container">
          <div className="section-header text-center">
            <h2>Layanan Kami</h2>

            <p className="text-accent">
              Pelayanan kesehatan ibu dan anak yang komprehensif
            </p>
          </div>

          <div className="services-grid stagger-children">
            {services.map((s, i) => (
              <div className="service-card glass-card" key={i}>
                <div className="service-icon">{s.icon}</div>

                <h4>{s.title}</h4>

                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section: Mengapa Memilih Kami */}
      <section className="trust-section">
        <div className="container">
          <div className="section-header text-center">
            <h2>Mengapa Memilih Indah Care Plus?</h2>
            <p className="text-accent">
              Keunggulan layanan kebidanan modern berstandar klinik profesional
            </p>
          </div>
          
          <div className="trust-grid stagger-children">
            <div className="trust-card glass-card">
              <div className="trust-icon-wrapper">
                <IconShield size={28} />
              </div>
              <h4>Bidan STR-Verified</h4>
              <p>Didampingi oleh bidan profesional berlisensi STR aktif dan berpengalaman lebih dari 15 tahun.</p>
            </div>
            
            <div className="trust-card glass-card">
              <div className="trust-icon-wrapper">
                <IconClipboard size={28} />
              </div>
              <h4>Registrasi Antrean Digital</h4>
              <p>Tidak perlu antre lama di klinik. Lakukan pendaftaran dan pantau status antrean secara real-time.</p>
            </div>
            
            <div className="trust-card glass-card">
              <div className="trust-icon-wrapper">
                <IconHeart size={28} />
              </div>
              <h4>Pelayanan Ramah & Nyaman</h4>
              <p>Perawatan komprehensif yang mengutamakan kenyamanan fisik dan psikologis ibu serta sang buah hati.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="tentang">
        <div className="container about-content">
          <div className="about-avatar">
            <div className="avatar-circle">
              <IconDoctor size={80} color="#40916C" />
            </div>

            <div className="avatar-badge">
              <IconShield size={14} />
              {' '}STR Verified
            </div>
          </div>

          <div className="about-text">
            <h2>Tentang Bidan Kami</h2>

            <p className="text-accent">
              Profesional, berpengalaman, dan penuh dedikasi
            </p>

            <p>
              Bidan Indah adalah tenaga kesehatan profesional
              dengan pengalaman lebih dari 15 tahun dalam bidang
              kebidanan. Telah menangani ribuan persalinan dan
              pemeriksaan kehamilan dengan standar pelayanan terbaik.
            </p>

            <div className="credential-badges">
              <span className="badge badge-info badge-lg">
                <IconClipboard size={14} />
                {' '}STR Aktif
              </span>

              <span className="badge badge-info badge-lg">
                <IconAward size={14} />
                {' '}S1 Kebidanan
              </span>

              <span className="badge badge-info badge-lg">
                <IconCheckCircle size={14} />
                {' '}Profesi Bidan
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-banner-section">
        <div className="container">
          <div className="cta-banner-content glass-card dark-green-gradient">
            <div className="cta-text-wrapper">
              <h2>Kesehatan Ibu & Anak Adalah Prioritas Utama Kami</h2>
              <p>Mulai perjalanan kehamilan sehat dan persalinan aman dengan layanan digital Indah Care Plus.</p>
            </div>
            <div className="cta-action-wrapper">
              <Link to="/register" className="btn btn-gold btn-lg">
                Daftar Akun Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer" id="footer">
        <div className="container footer-content">
          <div className="footer-brand">
            <div
              className="navbar-logo"
              style={{ marginBottom: '12px' }}
            >
              <span className="logo-ic">IC</span>
              <span className="logo-plus">+</span>
            </div>

            <p
              className="text-accent"
              style={{ fontSize: '0.9375rem' }}
            >
              Kesehatan Anda, Prioritas Kami
            </p>
          </div>

          <div className="footer-info">
            <p>
              <IconMapPin
                size={14}
                style={{
                  display: 'inline',
                  verticalAlign: 'middle',
                  marginRight: '6px',
                }}
              />

              Jl. Kesehatan No. 12, Kota Sehat, Indonesia
            </p>

            <p>
              <IconClock
                size={14}
                style={{
                  display: 'inline',
                  verticalAlign: 'middle',
                  marginRight: '6px',
                }}
              />

              Senin - Sabtu, 08:00 - 17:00 WIB
            </p>
          </div>

          <div className="footer-contact">
            <a
              href="https://wa.me/6285556050556"
              className="btn btn-sm whatsapp-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconWhatsApp size={16} />
              {' '}Hubungi via WhatsApp
            </a>
          </div>

          <div className="footer-bottom">
            <p>
              © 2026 Indah Care Plus (IC+). All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}