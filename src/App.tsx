// === iHomeCare App — Slim Routing Layer ===
// Desktop CC, Family App, Elites App extracted to separate files.

import { type FC, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { ViewProvider } from './auth/ViewContext';
import MainLayout from './layouts/MainLayout';
import {
  PatientRecords, Inventory, Finance,
  RiskAlerts, FollowupCalendar, CareElites,
} from './pages/Pages';
import MedicalInstitution from './pages/MedicalInstitution';
import Messages from './pages/Messages';
import PendingRegistration from './pages/PendingRegistration';
import AssignCareElite from './pages/AssignCareElite';
import PatientProfilePage from './pages/PatientProfilePage';
import CommandCenterPage from './pages/CommandCenterPage';
import FamilyStandalone from './pages/FamilyStandalone';
import ElitesStandalone from './pages/ElitesStandalone';
import YDCareLogo from './components/YDCareLogo';
import IHomeCareEliteLogoIcon from './components/IHomeCareEliteLogoIcon';
import IHomeCareFamilyLogoIcon from './components/IHomeCareFamilyLogoIcon';
import IHomeCareHubLogoIcon from './components/IHomeCareHubLogoIcon';
import TitleWidthMatchedText from './components/TitleWidthMatchedText';

/* ─────────────────────────────────────────────────────────── PROTECTED / LAYOUT ROUTE ─────────────────────────────────────────────────────────── */

const ProtectedRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const LayoutRoute: FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute>
    <MainLayout>{children}</MainLayout>
  </ProtectedRoute>
);

/* ─────────────────────────────────────────────────────────── HOME SCREEN ─────────────────────────────────────────────────────────── */

/** Platform mark — Family / Hub / home hero */
const IHomeCareLogoIcon: FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <circle cx="12" cy="12" r="2" fill="#FEB903" stroke="none" />
  </svg>
);

const IHomeCareLogoMark: FC<{ size?: 'lg' | 'md' }> = ({ size = 'lg' }) => (
  <div
    className={`rounded-3xl flex items-center justify-center shadow-lg backdrop-blur-xl bg-white/20 border border-white/30 bg-gradient-to-b from-[#0B3550] to-[#03304B] flex-shrink-0 ${
      size === 'lg' ? 'w-20 h-20' : 'w-16 h-16'
    }`}
  >
    <IHomeCareLogoIcon size={size === 'lg' ? 40 : 30} />
  </div>
);

const IHomeCareEliteLogoMark: FC<{ size?: 'lg' | 'md' }> = ({ size = 'lg' }) => (
  <div
    className={`rounded-3xl flex items-center justify-center shadow-lg backdrop-blur-xl bg-white/20 border border-white/30 bg-gradient-to-b from-[#0B3550] to-[#03304B] flex-shrink-0 ${
      size === 'lg' ? 'w-20 h-20' : 'w-16 h-16'
    }`}
  >
    <IHomeCareEliteLogoIcon size={size === 'lg' ? 40 : 34} />
  </div>
);

const IHomeCareFamilyLogoMark: FC<{ size?: 'lg' | 'md' }> = ({ size = 'lg' }) => (
  <div
    className={`rounded-3xl flex items-center justify-center shadow-lg backdrop-blur-xl bg-white/20 border border-white/30 bg-gradient-to-b from-[#0B3550] to-[#03304B] flex-shrink-0 ${
      size === 'lg' ? 'w-20 h-20' : 'w-16 h-16'
    }`}
  >
    <IHomeCareFamilyLogoIcon size={size === 'lg' ? 40 : 34} />
  </div>
);

const IHomeCareHubLogoMark: FC<{ size?: 'lg' | 'md' }> = ({ size = 'lg' }) => (
  <div
    className={`rounded-3xl flex items-center justify-center shadow-lg backdrop-blur-xl bg-white/20 border border-white/30 bg-gradient-to-b from-[#0B3550] to-[#03304B] flex-shrink-0 ${
      size === 'lg' ? 'w-20 h-20' : 'w-16 h-16'
    }`}
  >
    <IHomeCareHubLogoIcon size={size === 'lg' ? 40 : 34} />
  </div>
);

const PortalCard: FC<{
  title: string;
  buttonClass: string;
  onClick: () => void;
  logo?: 'platform' | 'family' | 'hub' | 'elite';
}> = ({ title, buttonClass, onClick, logo = 'platform' }) => (
  <button
    onClick={onClick}
    className="group flex flex-col items-center text-center rounded-2xl border border-[#E1FCFF]/80 bg-white p-6 h-full min-h-[220px] transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_16px_rgba(122,92,50,0.06)] hover:shadow-[0_8px_24px_rgba(122,92,50,0.1)]"
  >
    <div className="mb-4 flex-shrink-0">
      {logo === 'elite' ? (
        <IHomeCareEliteLogoMark size="md" />
      ) : logo === 'family' ? (
        <IHomeCareFamilyLogoMark size="md" />
      ) : logo === 'hub' ? (
        <IHomeCareHubLogoMark size="md" />
      ) : (
        <IHomeCareLogoMark size="md" />
      )}
    </div>
    <h2 className="text-base font-bold text-[#0B3550] font-display">{title}</h2>
    <span className={`mt-auto w-full py-2.5 rounded-xl text-xs font-semibold text-white transition-colors flex-shrink-0 ${buttonClass}`}>
      Enter
    </span>
  </button>
);

const HomeScreen: FC = () => {
  const navigate = useNavigate();
  const titleRef = useRef<HTMLHeadingElement>(null);
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#FFFFFF] via-[#FAF7F2] to-[#F3EBE0] flex flex-col items-center justify-center p-6 sm:p-10 font-body">
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10">
        <YDCareLogo height={48} />
      </div>

      <div className="flex items-center gap-4 mb-10 sm:mb-14">
        <IHomeCareLogoMark size="lg" />
        <div>
          <h1 ref={titleRef} className="text-2xl sm:text-3xl font-extrabold text-[#0B3550] font-display tracking-tight whitespace-nowrap">YDiCare 易护</h1>
          <TitleWidthMatchedText titleRef={titleRef}>综合管理平台</TitleWidthMatchedText>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 w-full max-w-5xl items-stretch">
        <PortalCard
          title="易护家属端"
          buttonClass="bg-gradient-to-r from-[#4DCEFF] to-[#0B3550] group-hover:from-[#FEB903] group-hover:to-[#4DCEFF]"
          logo="family"
          onClick={() => navigate('/family')}
        />
        <PortalCard
          title="易护机构端"
          buttonClass="bg-gradient-to-r from-[#03304B] to-[#0B3550] group-hover:from-[#0B3550] group-hover:to-[#03304B]"
          logo="hub"
          onClick={() => navigate('/command-center')}
        />
        <PortalCard
          title="易护照护端"
          buttonClass="bg-gradient-to-r from-[#4DCEFF] to-[#0B3550] group-hover:from-[#FEB903] group-hover:to-[#4DCEFF]"
          logo="elite"
          onClick={() => navigate('/elites')}
        />
      </div>

      <p className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 text-[10px] text-slate-400">YDiCare 易护 v1.0</p>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────── ROUTES ─────────────────────────────────────────────────────────── */

const AppRoutes: FC = () => (
  <Routes>
    <Route path="/" element={<HomeScreen />} />
    <Route path="/family" element={<FamilyStandalone />} />
    <Route path="/elites" element={<ElitesStandalone />} />
    <Route path="/command-center" element={<LayoutRoute><CommandCenterPage /></LayoutRoute>} />
    <Route path="/patient-records" element={<LayoutRoute><PatientRecords /></LayoutRoute>} />
    <Route path="/patient/:id" element={<LayoutRoute><PatientProfilePage /></LayoutRoute>} />
    <Route path="/medical-institution" element={<LayoutRoute><MedicalInstitution /></LayoutRoute>} />
    <Route path="/pending-registration" element={<LayoutRoute><PendingRegistration /></LayoutRoute>} />
    <Route path="/pending-registration/:pid/medical-history" element={<LayoutRoute><PendingRegistration /></LayoutRoute>} />
    <Route path="/pending-registration/:pid/initial-assessment" element={<LayoutRoute><PendingRegistration /></LayoutRoute>} />
    <Route path="/pending-registration/:pid/care-plan" element={<LayoutRoute><PendingRegistration /></LayoutRoute>} />
    <Route path="/pending-registration/:pid/assign-elite" element={<LayoutRoute><AssignCareElite /></LayoutRoute>} />
    <Route path="/iot-devices" element={<LayoutRoute><Inventory /></LayoutRoute>} />
    <Route path="/billing" element={<LayoutRoute><Finance /></LayoutRoute>} />
    <Route path="/risk-alerts" element={<LayoutRoute><RiskAlerts /></LayoutRoute>} />
    <Route path="/followup-calendar" element={<LayoutRoute><FollowupCalendar /></LayoutRoute>} />
    <Route path="/care-elites" element={<LayoutRoute><CareElites /></LayoutRoute>} />
    <Route path="/messages" element={<LayoutRoute><Messages /></LayoutRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

/* ─────────────────────────────────────────────────────────── APP ─────────────────────────────────────────────────────────── */

const App: FC = () => (
  <AuthProvider>
    <ViewProvider>
      <AppRoutes />
    </ViewProvider>
  </AuthProvider>
);

export default App;
