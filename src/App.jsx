import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import PatientDashboard from './pages/patient/Dashboard';
import VisitRegistration from './pages/patient/VisitRegistration';
import MedicalRecords from './pages/patient/MedicalRecords';
import Notifications from './pages/patient/Notifications';

import BidanDashboard from './pages/bidan/Dashboard';
import QueueManagement from './pages/bidan/QueueManagement';
import ExaminationForm from './pages/bidan/ExaminationForm';
import ControlSchedule from './pages/bidan/ControlSchedule';
import VisitMonitor from './pages/bidan/VisitMonitor';
import PatientData from './pages/bidan/PatientData';
import MedicineInventory from './pages/bidan/MedicineInventory';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
