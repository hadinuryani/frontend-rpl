import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

const PatientDashboard = lazy(() => import('./pages/patient/Dashboard'));
const VisitRegistration = lazy(() => import('./pages/patient/VisitRegistration'));
const MedicalRecords = lazy(() => import('./pages/patient/MedicalRecords'));
const Notifications = lazy(() => import('./pages/patient/Notifications'));
const MyQueue = lazy(() => import('./pages/patient/MyQueue'));

const BidanDashboard = lazy(() => import('./pages/bidan/Dashboard'));
const QueueManagement = lazy(() => import('./pages/bidan/QueueManagement'));
const ExaminationForm = lazy(() => import('./pages/bidan/ExaminationForm'));
const ControlSchedule = lazy(() => import('./pages/bidan/ControlSchedule'));
const VisitMonitor = lazy(() => import('./pages/bidan/VisitMonitor'));
const PatientData = lazy(() => import('./pages/bidan/PatientData'));
const MedicineInventory = lazy(() => import('./pages/bidan/MedicineInventory'));

function LoadingSpinner() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg)',
      fontFamily: 'var(--font-body)',
      color: 'var(--color-dark)',
      gap: 'var(--space-6)'
    }}>
      <div aria-label="Orange and tan hamster running in a metal wheel" role="img" className="wheel-and-hamster">
        <div className="wheel"></div>
        <div className="hamster">
          <div className="hamster__body">
            <div className="hamster__head">
              <div className="hamster__ear"></div>
              <div className="hamster__eye"></div>
              <div className="hamster__nose"></div>
            </div>
            <div className="hamster__limb hamster__limb--fr"></div>
            <div className="hamster__limb hamster__limb--fl"></div>
            <div className="hamster__limb hamster__limb--br"></div>
            <div className="hamster__limb hamster__limb--bl"></div>
            <div className="hamster__tail"></div>
          </div>
        </div>
        <div className="spoke"></div>
      </div>
      <p style={{
        fontSize: '1rem',
        fontWeight: '600',
        color: 'var(--color-primary-dark)',
        letterSpacing: '0.5px',
        animation: 'pulse 1.5s ease-in-out infinite',
        margin: 0
      }}>
        Memuat halaman... mohon tunggu sebentar
      </p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Patient Routes */}
            <Route element={<ProtectedRoute allowedRoles={['pasien']} />}>
              <Route path="/patient" element={<PatientDashboard />} />
              <Route path="/patient/visit" element={<VisitRegistration />} />
              <Route path="/patient/records" element={<MedicalRecords />} />
              <Route path="/patient/queue" element={<MyQueue />} />
              <Route path="/patient/notifications" element={<Notifications />} />
            </Route>

            {/* Bidan Routes */}
            <Route element={<ProtectedRoute allowedRoles={['bidan']} />}>
              <Route path="/bidan" element={<BidanDashboard />} />
              <Route path="/bidan/queue" element={<QueueManagement />} />
              <Route path="/bidan/examine" element={<ExaminationForm />} />
              <Route path="/bidan/schedule" element={<ControlSchedule />} />
              <Route path="/bidan/monitor" element={<VisitMonitor />} />
              <Route path="/bidan/patients" element={<PatientData />} />
              <Route path="/bidan/inventory" element={<MedicineInventory />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
