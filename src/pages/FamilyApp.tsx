import { useState, useEffect, useRef, useMemo, type FC, type ReactNode } from 'react';
import {
  Activity, Heart, Thermometer, Droplets, Stethoscope,
  Bell, Phone, MessageCircle, Home,
  ClipboardList, Plus, ChevronRight, Battery, Wifi,
  AlertTriangle, CheckCircle2, Pill,
  Smartphone, TrendingUp, TrendingDown,
  Minus, Send, Shield, Zap,
  Search, Users,
  BedDouble, Watch, Apple, Sun,
  Moon, Hospital, ArrowRight, Info,
  Brain, GlassWater, CalendarDays, Footprints, Clock
} from 'lucide-react';
import PatientAvatar from '../components/PatientAvatar';
import ChatBubbleAvatar from '../components/ChatBubbleAvatar';
import StaffAvatar from '../components/StaffAvatar';
import IHomeCareFamilyLogoIcon from '../components/IHomeCareFamilyLogoIcon';
import AlertToggle from '../components/AlertToggle';
import WeChatChatRow from '../components/WeChatChatRow';
import { useWeChatChatReveal } from '../hooks/useWeChatChatReveal';
import {
  formatChatDisplayName,
  getChatBubbleClasses,
  getChatSenderLabelClass,
  isOutgoingChatMessage,
} from '../utils/chatBubbleStyles';
import { usePatientStore, DEFAULT_VITALS } from '../store/patientStore';
import { useCollaborationStore } from '../store/collaborationStore';
import { buildFamilyHomeVitalCards, buildFamilyDetailVitalCards, formatPatient1AlertBanner, buildFamilyMentalStatus, buildFamilyIoSnapshot, buildFamilySleepSnapshot, buildFamilyMentalInsight } from '../utils/familyVitals';
import { FamilyBloodPressureSparkline, FamilyBloodPressureTrendChart } from '../components/BloodPressureCharts';
import { FAMILY_SENDER_BY_PATIENT } from '../utils/chatSenders';
import { getDemoTimeString, getDemoTimestamp } from '../utils/demoClock';
import { DEMO_CARE_PLAN_DATE, DEMO_HAH_DAY, formatDemoDateBadge, formatDemoDateLabel, getTodayActivities, summarizeCarePlanProgress, COPD_PROTOCOL_TASK_KEY } from '../utils/carePlanSync';
import { getFamilyCareProgressNotes } from '../utils/familyCareLogs';
import { getFamilyMedications, getFamilyMedSummary } from '../utils/familyMeds';
import { resolvePatientNews } from '../utils/patientNews';
import { buildFamilyInfectionFactor, formatNewsHeadline } from '../utils/medicalHistoryNews';
import { deviceImageUrl } from '../data/deviceImages';
import { getFamilyCareTeam } from '../utils/familyCareTeam';
import { FAMILY_CLASS } from '../theme/familyTokens';
import type { FollowupLogEntry } from '../data/carePlans';
import type { ChatMessage } from '../data/chatMessages';
import { PATIENTS_FULL } from '../data/patients';

const EMPTY_SUBMITTED_LOGS: FollowupLogEntry[] = [];
const EMPTY_CHAT_MESSAGES: ChatMessage[] = [];

/* ───────────────────── TYPES ──────────────────── */

type MobileTab = 'home' | 'vitals' | 'care' | 'chat';
type CareSubTab = 'plan' | 'meds' | 'devices' | 'logs';

const TYPE_BADGE: Record<string, string> = {
  medication: 'bg-[#CCF0FE] text-[#006F80]', med: 'bg-[#CCF0FE] text-[#006F80]',
  therapy: 'bg-[#CCF0FE] text-[#0B3550]', exercise: 'bg-[#CCF0FE] text-[#006F80]',
  nurse_visit: 'bg-[#99E7FF] text-[#00263F]', visit: 'bg-[#99E7FF] text-[#00263F]',
  doctor_consult: 'bg-[#CCF0FE] text-[#0B3550]', consult: 'bg-[#CCF0FE] text-[#0B3550]',
  monitoring: 'bg-amber-100 text-amber-700', monitor: 'bg-amber-100 text-amber-700',
  self_care: 'bg-slate-100 text-slate-500', care_worker: 'bg-[#CCF0FE] text-[#006F80]',
};

const SectionHeader: FC<{ icon: FC<{ className?: string }>; title: string; right?: ReactNode }> = ({ icon: Icon, title, right }) => (
  <div className={`${FAMILY_CLASS.sectionGradient} px-4 py-3 flex items-center justify-between`}>
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-white" />
      <span className="text-xs font-bold text-white">{title}</span>
    </div>
    {right}
  </div>
);

const AiInsight: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="mt-2 pt-2 border-t border-[#99E7FF] bg-gradient-to-r from-[#CCF0FE] to-[#CCF0FE] rounded-lg px-2.5 py-2 flex items-start gap-1.5">
    <Brain className="w-3 h-3 text-[#006F80] flex-shrink-0 mt-0.5" />
    <div>
      <p className="text-[8px] font-bold text-[#0B3550] mb-0.5">AI洞察</p>
      <p className="text-[9px] text-slate-600 leading-relaxed font-medium">{children}</p>
    </div>
  </div>
);

/* ───────────────────── MOBILE FAMILY APP ──────────────────── */

const MobileFamilyApp: FC<{ tab: MobileTab; setTab: (t: MobileTab) => void; careSub: CareSubTab; setCareSub: (s: CareSubTab) => void }> = ({ tab, setTab, careSub, setCareSub }) => {
  const [showApp, setShowApp] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [familyPatientId, setFamilyPatientId] = useState<number>(2);

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => { setShowApp(true); setShowSplash(false); }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  // Initialize store connection for real-time family data
  usePatientStore(state => state.patients);
  const tabs: { key: MobileTab; label: string; icon: FC<{ className?: string }> }[] = [
    { key: 'home', label: '首页', icon: Home },
    { key: 'vitals', label: '体征', icon: Heart },
    { key: 'care', label: '照护', icon: ClipboardList },
    { key: 'chat', label: '消息', icon: MessageCircle },
  ];

  return (
    <div className="flex justify-center pt-4">
      {/* iOS 26 Device Frame — Liquid Titanium */}
      <div className="relative bg-gradient-to-br from-[#3a3a40] via-[#2d2d35] to-[#252530] rounded-[60px] p-[8px] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_0_3px_#1a1a22,0_25px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)]">
        {/* Screen with micro-bezel glow */}
        <div className="w-[402px] h-[874px] bg-slate-50 rounded-[52px] overflow-hidden flex flex-col relative ring-1 ring-white/10 shadow-[inset_0_0_40px_rgba(0,0,0,0.03),0_0_0_0.5px_rgba(0,0,0,0.2)]">

          {!showApp && !showSplash ? (
            <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
              {/* Wallpaper Background */}
              <img src="/ios-wallpaper.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
              
              {/* Dark overlay for status bar readability */}
              <div className="absolute top-0 left-0 right-0 h-[72px] bg-gradient-to-b from-black/40 via-black/20 to-transparent z-20 pointer-events-none" />

              {/* iOS Status Bar — overlaid on wallpaper */}
              <div className="absolute top-0 left-0 right-0 z-30 px-10 pt-4 pb-2 flex items-center justify-between">
                <span className="text-white font-semibold text-[13px] drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">9:41</span>
                <div className="flex items-center gap-2 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                  <svg className="w-4 h-4" viewBox="0 0 16 12" fill="none"><rect x="0.5" y="3" width="2" height="8" rx="0.5" fill="currentColor"/><rect x="3.5" y="1.5" width="2" height="9.5" rx="0.5" fill="currentColor"/><rect x="6.5" y="0" width="2" height="11" rx="0.5" fill="currentColor"/><rect x="9.5" y="3.5" width="2" height="7.5" rx="0.5" fill="currentColor"/></svg>
                  <Wifi className="w-3.5 h-3.5" />
                  <Battery className="w-4 h-4" />
                </div>
              </div>
              
              {/* iOS 26 Home Screen content */}
              <div className="flex-1 flex flex-col relative z-10">
                <div className="flex-1 overflow-y-auto px-5 pt-16">
                  {/* Spotlight */}
                  <div className="flex items-center gap-2 bg-black/15 backdrop-blur-xl rounded-2xl px-3 py-1.5 mb-6 border border-white/10">
                    <Search className="w-3.5 h-3.5 text-white/60" />
                    <span className="text-[12px] text-white/50">搜索</span>
                  </div>

                  {/* App Icons Grid — iOS 26 Dark Mode style */}
                  <div className="grid grid-cols-4 gap-y-8 mb-6">
                    {[
                      // === Row 1 ===
                      { name: 'FaceTime', color: 'bg-[#1B5E20]', icon: () => (<svg viewBox="0 0 30 30" className="w-[30px] h-[30px]"><rect x="5" y="8" width="14" height="14" rx="3" fill="#81C784"/><polygon points="19,12 26,7 26,23 19,18" fill="#81C784"/></svg>) },
                      { name: 'Calendar', color: 'bg-[#2C2C2E]', icon: () => (<svg viewBox="0 0 30 30" className="w-[30px] h-[30px]"><rect x="4" y="4" width="22" height="22" rx="4" fill="#3A3A3C"/><rect x="4" y="4" width="22" height="8" rx="4" fill="#FF453A"/><text x="15" y="22" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#E5E5EA">18</text></svg>) },
                      { name: 'Photos', color: 'bg-[#2C2C2E]', icon: () => (<svg viewBox="0 0 30 30" className="w-[30px] h-[30px]"><circle cx="10" cy="10" r="4" fill="#FF9F0A"/><circle cx="22" cy="8" r="4.5" fill="#30D158"/><circle cx="8" cy="22" r="4.5" fill="#0A84FF"/><circle cx="22" cy="22" r="4" fill="#BF5AF2"/></svg>) },
                      { name: 'Camera', color: 'bg-[#3A3A3C]', icon: () => (<svg viewBox="0 0 30 30" className="w-[30px] h-[30px]"><rect x="5" y="8" width="20" height="15" rx="4" fill="#8E8E93"/><circle cx="15" cy="15.5" r="4.5" fill="#3A3A3C"/></svg>) },
                      // === Row 2 ===
                      { name: 'Clock', color: 'bg-[#1C1C1E]', icon: () => (<svg viewBox="0 0 30 30" className="w-[30px] h-[30px]"><circle cx="15" cy="15" r="12" fill="none" stroke="#E5E5EA" strokeWidth="2"/><line x1="15" y1="15" x2="15" y2="7" stroke="#E5E5EA" strokeWidth="2" strokeLinecap="round"/><line x1="15" y1="15" x2="20" y2="18" stroke="#E5E5EA" strokeWidth="2" strokeLinecap="round"/></svg>) },
                      { name: 'Maps', color: 'bg-[#1B5E20]', icon: () => (<svg viewBox="0 0 30 30" className="w-[30px] h-[30px]"><circle cx="15" cy="9" r="2.5" fill="#FF453A"/><path d="M15 28C15 28 23 17 23 11C23 6.5 19.5 3 15 3S7 6.5 7 11C7 17 15 28 15 28Z" fill="#30D158"/></svg>) },
                      { name: 'Weather', color: 'bg-[#0A84FF]', icon: () => (<svg viewBox="0 0 30 30" className="w-[30px] h-[30px]"><circle cx="11" cy="17" r="5" fill="#E5E5EA"/><circle cx="20" cy="13" r="4.5" fill="#E5E5EA"/><circle cx="23" cy="17" r="5.5" fill="#E5E5EA"/><path d="M8 22h18a2 2 0 002-2v-0.5H4V20a2 2 0 002 2z" fill="#FFD60A"/></svg>) },
                      { name: 'Notes', color: 'bg-[#5C4A00]', icon: () => (<svg viewBox="0 0 30 30" className="w-[30px] h-[30px]"><rect x="5" y="1" width="20" height="28" rx="3" fill="#3A3A3C"/><line x1="9" y1="8" x2="23" y2="8" stroke="#FFD60A" strokeWidth="1.5"/><line x1="9" y1="12" x2="23" y2="12" stroke="#FFD60A" strokeWidth="1.5"/><line x1="9" y1="16" x2="18" y2="16" stroke="#FFD60A" strokeWidth="1.5"/></svg>) },
                      // === Row 3 ===
                      { name: 'Reminders', color: 'bg-[#2C2C2E]', icon: () => (<svg viewBox="0 0 30 30" className="w-[30px] h-[30px]"><circle cx="15" cy="6" r="2.5" fill="#0A84FF"/><circle cx="15" cy="15" r="2.5" fill="#FF453A"/><circle cx="15" cy="24" r="2.5" fill="#30D158"/><line x1="15" y1="8.5" x2="15" y2="12.5" stroke="#0A84FF" strokeWidth="1.5"/><line x1="15" y1="17.5" x2="15" y2="21.5" stroke="#FF453A" strokeWidth="1.5"/></svg>) },
                      { name: 'Wallet', color: 'bg-[#1C1C1E]', icon: () => (<svg viewBox="0 0 30 30" className="w-[30px] h-[30px]"><rect x="4" y="8" width="22" height="15" rx="3" fill="#3A3A3C"/><rect x="13" y="12" width="11" height="7" rx="1.5" fill="#30D158"/><rect x="7" y="14" width="4" height="3" rx="0.5" fill="#0A84FF"/></svg>) },
                      { name: 'Settings', color: 'bg-[#3A3A3C]', icon: () => (<svg viewBox="0 0 30 30" className="w-[30px] h-[30px]"><circle cx="15" cy="15" r="8" fill="none" stroke="#E5E5EA" strokeWidth="2.5"/><circle cx="15" cy="15" r="3.5" fill="#E5E5EA"/></svg>) },
                      { name: 'Health', color: 'bg-[#2C2C2E]', icon: () => (<svg viewBox="0 0 30 30" className="w-[30px] h-[30px]"><path d="M15 26L5 16C1 12 3 6 8 6C10 6 12 7 15 9C18 7 20 6 22 6C27 6 29 12 25 16L15 26Z" fill="#FF453A"/></svg>) },
                      // === Row 4 ===
                      { name: 'App Store', color: 'bg-[#0A84FF]', icon: () => (<svg viewBox="0 0 30 30" className="w-[30px] h-[30px]"><line x1="15" y1="3" x2="15" y2="27" stroke="white" strokeWidth="3.5" strokeLinecap="round"/><line x1="3" y1="15" x2="27" y2="15" stroke="white" strokeWidth="3.5" strokeLinecap="round"/></svg>) },
                      { name: 'Stocks', color: 'bg-[#1C1C1E]', icon: () => (<svg viewBox="0 0 30 30" className="w-[30px] h-[30px]"><polyline points="4,20 10,14 15,18 22,6 26,10" fill="none" stroke="#30D158" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>) },
                      { name: 'Music', color: 'bg-[#2C2C2E]', icon: () => (<svg viewBox="0 0 30 30" className="w-[30px] h-[30px]"><path d="M11 23V9l15-4v15" fill="none" stroke="#FF375F" strokeWidth="2.5" strokeLinecap="round"/><circle cx="8" cy="23" r="4" fill="#FF375F"/><circle cx="23" cy="20" r="4" fill="#FF453A"/></svg>) },
                    ].map((app, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className={`w-[60px] h-[60px] ${app.color} rounded-[16px] flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.3)]`}>
                          <app.icon />
                        </div>
                        <span className="text-[9px] text-white/95 font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">{app.name}</span>
                      </div>
                    ))}
                      {/* iHomeCare — custom icon with badge */}
                      <div key="ihc" className="flex flex-col items-center gap-1">
                        <button onClick={() => setShowSplash(true)} className="w-[60px] h-[60px] rounded-[16px] flex items-center justify-center shadow-[0_2px_12px_rgba(196,154,108,0.5)] bg-[#006F80] transition-transform active:scale-90 relative">
                          <IHomeCareFamilyLogoIcon size={30} />
                          <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] bg-[#FF453A] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-md">3</span>
                        </button>
                        <span className="text-[9px] text-white/95 font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">易护家属端</span>
                      </div>
                  </div>

                  {/* Page Dots */}
                  <div className="flex justify-center gap-1.5 mb-2">
                    <div className="w-[6px] h-[6px] rounded-full bg-white shadow-[0_0_2px_rgba(0,0,0,0.3)]" />
                    <div className="w-[6px] h-[6px] rounded-full bg-white/25" />
                  </div>
                </div>

                {/* Dock — iOS 26 frosted glass dark */}
                <div className="flex-shrink-0 px-3 pb-5">
                  <div className="bg-black/20 backdrop-blur-2xl rounded-[34px] px-4 py-2.5 flex items-center justify-around border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_-1px_4px_rgba(0,0,0,0.3)]">
                    {[
                      { name: 'Phone', color: 'bg-[#30D158]', icon: () => (<svg viewBox="0 0 30 30" className="w-[28px] h-[28px]"><rect x="7" y="3" width="16" height="24" rx="4" fill="white"/><circle cx="15" cy="7" r="1.5" fill="#30D158"/></svg>) },
                      { name: 'Safari', color: 'bg-[#2C2C2E]', icon: () => (<svg viewBox="0 0 30 30" className="w-[28px] h-[28px]"><circle cx="15" cy="15" r="12" fill="#0A84FF"/><circle cx="15" cy="15" r="12" fill="none" stroke="white" strokeWidth="2"/><line x1="5" y1="15" x2="25" y2="15" stroke="white" strokeWidth="2"/><line x1="11" y1="5" x2="19" y2="25" stroke="white" strokeWidth="2"/><line x1="19" y1="5" x2="11" y2="25" stroke="white" strokeWidth="2"/></svg>) },
                      { name: 'Messages', color: 'bg-[#30D158]', icon: () => (<svg viewBox="0 0 30 30" className="w-[28px] h-[28px]"><path d="M4 6a2 2 0 012-2h18a2 2 0 012 2v14a2 2 0 01-2 2h-14l-6 5v-21z" fill="white"/></svg>) },
                      { name: 'Music', color: 'bg-[#FF375F]', icon: () => (<svg viewBox="0 0 30 30" className="w-[28px] h-[28px]"><path d="M10 24V8l16-4v16" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"/><circle cx="7" cy="24" r="4" fill="white"/><circle cx="23" cy="20" r="4" fill="white"/></svg>) },
                    ].map((app, i) => (
                      <div key={i} className="flex flex-col items-center gap-0.5">
                        <div className={`w-[52px] h-[52px] ${app.color} rounded-[14px] flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.3)]`}>
                          {app.icon()}
                        </div>
                        <span className="text-[8px] text-white/85 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">{app.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Home Indicator */}
                <div className="flex justify-center pb-2 flex-shrink-0">
                  <div className="w-[120px] h-[4px] bg-white/30 rounded-full" />
                </div>
              </div>
            </div>
          ) : showSplash ? (
            /* Splash Screen */
            <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-[#006F80] to-[#0B3550] min-h-0" onClick={() => { setShowApp(true); setShowSplash(false); }}>
              <div className="zoom-in flex flex-col items-center">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg backdrop-blur-xl bg-white/20 border border-white/30 mb-6">
                  <IHomeCareFamilyLogoIcon size={40} />
                </div>
                <p className="text-white text-2xl font-extrabold tracking-tight mb-8" style={{ fontFamily: "'Space Grotesk','Inter',sans-serif" }}>易护家属端</p>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            </div>
          ) : (
          <div className="flex-1 flex flex-col bg-slate-50 min-h-0">
            {/* iOS Status Bar — app view */}
            <div className="flex-shrink-0 px-10 pt-4 pb-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-900 bg-slate-50">
              <span className="tracking-tight">9:41</span>
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 12" fill="none"><rect x="0.5" y="3" width="2" height="8" rx="0.5" fill="currentColor"/><rect x="3.5" y="1.5" width="2" height="9.5" rx="0.5" fill="currentColor"/><rect x="6.5" y="0" width="2" height="11" rx="0.5" fill="currentColor"/><rect x="9.5" y="3.5" width="2" height="7.5" rx="0.5" fill="currentColor"/></svg>
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>
            {/* Scrollable Tab Content */}
            <div className={`flex-1 flex flex-col min-h-0 ${tab === 'care' || tab === 'vitals' || tab === 'chat' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
              {tab === 'home' && <HomeTab onAlertClick={() => { setTab('care'); setCareSub('logs'); }} onCarePlanClick={() => { setTab('care'); setCareSub('plan'); }} familyPatientId={familyPatientId} setFamilyPatientId={setFamilyPatientId} />}
              {tab === 'vitals' && <VitalsTab familyPatientId={familyPatientId} />}
              {tab === 'care' && <CareTab sub={careSub} setSub={setCareSub} familyPatientId={familyPatientId} />}
              {tab === 'chat' && <ChatTab familyPatientId={familyPatientId} />}
            </div>

            {/* Bottom Tab Bar — fixed outside scroll area */}
            <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-around flex-shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
              {tabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${tab === key ? 'text-[#006F80]' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[9px] font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
          )}

        </div>
        {/* iOS 26 Side Button — right side */}
        <div className="absolute -right-[2px] top-44 w-[4px] h-24 bg-gradient-to-b from-[#1A2D3D] to-[#2a2a32] rounded-r-lg shadow-[inset_-1px_0_2px_rgba(0,0,0,0.3)]" />
        {/* iOS 26 Volume — left side */}
        <div className="absolute -left-[2px] top-36 w-[4px] h-14 bg-gradient-to-b from-[#1A2D3D] to-[#2a2a32] rounded-l-lg shadow-[inset_1px_0_2px_rgba(0,0,0,0.3)]" />
        <div className="absolute -left-[2px] top-[172px] w-[4px] h-14 bg-gradient-to-b from-[#1A2D3D] to-[#2a2a32] rounded-l-lg shadow-[inset_1px_0_2px_rgba(0,0,0,0.3)]" />
        {/* Action Button — left side top */}
        <div className="absolute -left-[2px] top-[120px] w-[4px] h-8 bg-gradient-to-b from-[#1A2D3D] to-[#2a2a32] rounded-l-lg shadow-[inset_1px_0_2px_rgba(0,0,0,0.3)]" />
      </div>
    </div>
  );
};

const VITALS_TREND_HOURS = 72;
const VITALS_TREND_INTERVAL = 4;
const VITALS_TREND_POINTS = VITALS_TREND_HOURS / VITALS_TREND_INTERVAL + 1; // 19
const VITALS_DEMO_END = new Date('2026-06-18T08:00:00');

function expandTrendData(data: number[], targetCount: number): number[] {
  if (data.length === targetCount) return data;
  if (data.length === 1) return Array(targetCount).fill(data[0]);
  return Array.from({ length: targetCount }, (_, i) => {
    const t = (i / (targetCount - 1)) * (data.length - 1);
    const i0 = Math.floor(t);
    const i1 = Math.min(i0 + 1, data.length - 1);
    const frac = t - i0;
    return data[i0] * (1 - frac) + data[i1] * frac;
  });
}

function buildVitalTimeLabels(count: number, intervalHours: number, end: Date) {
  const start = new Date(end);
  start.setHours(start.getHours() - (count - 1) * intervalHours);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start);
    d.setHours(d.getHours() + i * intervalHours);
    const prev = i > 0 ? new Date(start.getTime() + (i - 1) * intervalHours * 3600000) : null;
    const dayChanged = !prev || d.getDate() !== prev.getDate() || d.getMonth() !== prev.getMonth();
    return {
      date: `${String(d.getDate()).padStart(2, '0')}/${d.getMonth() + 1}`,
      time: `${String(d.getHours()).padStart(2, '0')}:00`,
      showDate: dayChanged || i === 0,
    };
  });
}

function smoothLinePath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}

const VITALS_X_LABEL_EVERY = 3; // show label every 12h (3 × 4h)

function formatYValue(v: number, unit: string): string {
  if (unit === '°C') return v.toFixed(1);
  return String(Math.round(v));
}

function buildYScale(min: number, max: number, unit: string) {
  const span = max - min || (unit === '°C' ? 0.5 : 4);
  const pad = span * 0.15;
  const yMin = min - pad;
  const yMax = max + pad;
  const mid = (yMin + yMax) / 2;
  return {
    yMin,
    yMax,
    ticks: [yMax, mid, yMin],
  };
}

const VitalTrendChart: FC<{ data: number[]; color: string; trend: 'up' | 'down' | 'flat'; unit: string; compact?: boolean }> = ({ data, color, trend, unit, compact }) => {
  const plotW = 280;
  const plotH = compact ? 48 : 62;
  const padTop = 2;
  const series = expandTrendData(data, VITALS_TREND_POINTS);
  const labels = buildVitalTimeLabels(VITALS_TREND_POINTS, VITALS_TREND_INTERVAL, VITALS_DEMO_END);
  const { yMin, yMax, ticks: yTicks } = buildYScale(Math.min(...series), Math.max(...series), unit);
  const yRange = yMax - yMin || 1;

  const coords = series.map((v, i) => ({
    x: (i / (series.length - 1)) * plotW,
    y: padTop + (plotH * (1 - (v - yMin) / yRange)),
  }));

  const linePath = smoothLinePath(coords);
  const areaPath = `${linePath} L ${plotW},${padTop + plotH} L 0,${padTop + plotH} Z`;
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-amber-500' : trend === 'down' ? 'text-red-500' : 'text-slate-400';

  const xLabelIndices = labels
    .map((_, i) => i)
    .filter(i => i % VITALS_X_LABEL_EVERY === 0 || i === labels.length - 1);

  return (
    <div className={`relative w-full ${compact ? 'pt-1.5 mt-1.5 border-t border-slate-100' : 'pt-2 border-t border-slate-50'}`}>
      <div className="flex items-center justify-between mb-1.5 pr-0.5">
        <span className="text-[9px] font-semibold text-slate-500">72-Hour Trend</span>
        <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} />
      </div>

      <div className="flex gap-1.5">
        {/* Y-axis */}
        <div className="flex flex-col justify-between w-7 flex-shrink-0 text-right" style={{ height: plotH, paddingTop: 2 }}>
          {yTicks.map((v, i) => (
            <span key={i} className="text-[7px] leading-none text-slate-400 tabular-nums">
              {formatYValue(v, unit)}
            </span>
          ))}
        </div>

        <div className="flex-1 min-w-0">
          <svg viewBox={`0 0 ${plotW} ${plotH + padTop}`} className="w-full" style={{ height: plotH }} preserveAspectRatio="none">
            {yTicks.map((v, i) => {
              const y = padTop + plotH * (1 - (v - yMin) / yRange);
              return (
                <line key={`ygrid-${i}`} x1={0} y1={y} x2={plotW} y2={y} stroke="#f1f5f9" strokeWidth={0.75} />
              );
            })}

            {labels.map((_, i) => {
              const x = (i / (labels.length - 1)) * plotW;
              return (
                <line
                  key={`grid-${i}`}
                  x1={x}
                  y1={padTop}
                  x2={x}
                  y2={padTop + plotH}
                  stroke="#e2e8f0"
                  strokeWidth={0.5}
                  strokeDasharray={i % VITALS_X_LABEL_EVERY === 0 ? undefined : '2 3'}
                  opacity={i % VITALS_X_LABEL_EVERY === 0 ? 0.9 : 0.45}
                />
              );
            })}

            <path d={areaPath} fill={`${color}18`} />
            <path d={linePath} fill="none" stroke={color} strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r={2.75} fill={color} />
          </svg>

          {/* X-axis — every 12h */}
          <div className="relative h-7 mt-0.5">
            {xLabelIndices.map(i => {
              const lbl = labels[i];
              const pct = (i / (labels.length - 1)) * 100;
              const align = i === 0 ? 'left' : i === labels.length - 1 ? 'right' : 'center';
              return (
                <div
                  key={`x-${i}`}
                  className="absolute top-0 whitespace-nowrap"
                  style={{
                    left: `${pct}%`,
                    transform: align === 'center' ? 'translateX(-50%)' : align === 'right' ? 'translateX(-100%)' : undefined,
                  }}
                >
                  <p className="text-[7px] leading-tight text-slate-400">{lbl.date}</p>
                  <p className="text-[7px] leading-tight text-slate-500">{lbl.time}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const VitalSparkline: FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const w = 64;
  const h = 32;
  const series = expandTrendData(data, Math.min(data.length, 8));
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;
  const coords = series.map((v, i) => ({
    x: (i / (series.length - 1)) * w,
    y: 2 + (h - 4) * (1 - (v - min) / range),
  }));
  const linePath = smoothLinePath(coords);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-16 h-8 flex-shrink-0" aria-hidden>
      <path d={`${linePath} L ${w},${h} L 0,${h} Z`} fill={`${color}14`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r={2.25} fill={color} />
    </svg>
  );
};

function getHomeVitalStats(vitals: typeof DEFAULT_VITALS[number], alertActive: boolean) {
  return buildFamilyHomeVitalCards(vitals, alertActive);
}

/* ─────────────── MOBILE SUB-TABS ─────────────── */

const CARE_PLAN_TYPE_LABEL: Record<string, string> = {
  medication: '用药', therapy: '康复', nurse_visit: '访视',
  doctor_consult: '会诊', monitoring: '监测', self_care: '自理', care_worker: '照护',
};

const HomeTab: FC<{ onAlertClick?: () => void; onCarePlanClick?: () => void; familyPatientId: number; setFamilyPatientId: (id: number) => void }> = ({ onAlertClick, onCarePlanClick, familyPatientId, setFamilyPatientId }) => {
  const isAlertPatient = familyPatientId === 2;
  const alertActive = usePatientStore(s => isAlertPatient ? s.alertActive : false);
  const vitals = usePatientStore(s => s.vitals[familyPatientId] ?? DEFAULT_VITALS[familyPatientId]);
  const patient = usePatientStore(s => s.patients.find(p => p.id === familyPatientId));
  const summary = usePatientStore(s => s.patientsSummary.find(p => p.id === familyPatientId));
  const news = resolvePatientNews(familyPatientId, summary?.diagnosis ?? patient?.diagnosis ?? '', vitals, summary, alertActive);
  const newsHeadline = formatNewsHeadline({ score: news.score, tier: news.tier, redScore: news.redScore });
  const newsAction = news.tier === 'high' ? '需处理' : news.redScore ? '临床复核' : `${news.monitoringLabel}`;
  const carePlans = usePatientStore(s => s.carePlans);
  const carePlanStatus = useCollaborationStore(s => s.carePlanStatus);
  const careTeam = useMemo(() => getFamilyCareTeam(patient), [patient]);
  const vitalStats = useMemo(() => getHomeVitalStats(vitals, alertActive), [vitals, alertActive]);
  const todayActs = useMemo(
    () => getTodayActivities(carePlans[familyPatientId], familyPatientId, DEMO_CARE_PLAN_DATE, carePlanStatus).filter(a => a.type !== 'self_care'),
    [carePlans, carePlanStatus, familyPatientId],
  );
  const previewActs = todayActs.slice(0, 3);
  const [callTarget, setCallTarget] = useState<string | null>(null);

  useEffect(() => {
    if (!callTarget) return;
    const timer = setTimeout(() => setCallTarget(null), 2500);
    return () => clearTimeout(timer);
  }, [callTarget]);

  return (
  <div className="p-4 space-y-4 w-full">
    {news.tier === 'high' && isAlertPatient && (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-3 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-red-700">{newsHeadline} — {patient?.name ?? '患者'}</p>
          <p className="text-[10px] text-red-600 mt-0.5">{formatPatient1AlertBanner(vitals, summary?.diagnosis ?? '')}</p>
        </div>
      </div>
    )}
    {/* Patient Profile Card */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <SectionHeader icon={Heart} title="患者概览" />
      <div className="p-4">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 shadow-md border-2 border-[#99E7FF]">
          <PatientAvatar patientId={familyPatientId} size={64} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">{patient?.name ?? '患者'}</h3>
          </div>
          <p className="text-xs text-slate-400">{patient?.gender ?? ''}, {patient?.age ?? ''} 岁 · {patient?.diagnosis ?? ''}</p>
          <div className="flex items-center gap-1.5 mt-1.5">
          <div className={`w-2 h-2 rounded-full ${news.tier === 'high' ? 'bg-red-500 animate-pulse' : news.tier === 'medium' ? 'bg-amber-500' : news.redScore ? 'bg-orange-500' : 'bg-[#006F80]'}`} />
          <span className={`text-xs font-medium ${news.tier === 'high' ? 'text-red-600' : news.tier === 'medium' ? 'text-amber-600' : news.redScore ? 'text-orange-600' : 'text-[#006F80]'}`}>{newsHeadline}</span>
          </div>
        </div>
        <button onClick={onAlertClick} className="relative flex-shrink-0 group">
          {news.tier === 'high' && (
            <>
              <div className="absolute inset-0 w-10 h-10 -m-2 bg-red-500/20 rounded-full animate-ping" />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 text-white text-[8px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-md animate-pulse">!</span>
            </>
          )}
          <Bell className={`w-6 h-6 ${news.tier === 'high' ? 'text-red-600 bell-ring drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]' : news.tier === 'medium' ? 'text-amber-500' : 'text-slate-400'}`} />
        </button>
      </div>
      </div>
    </div>

    {/* Vital Stats */}
    <div className="grid grid-cols-2 gap-3">
      {vitalStats.map((stat, i) => (
        <div key={i} className={`bg-white rounded-xl p-3 shadow-sm transition-all ${stat.abnormal ? 'border-2 border-red-400 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.25)]' : 'border border-slate-100'}`}>
          <div className="flex items-center gap-1.5 mb-2">
            <div className={`w-7 h-7 rounded-lg ${stat.bg} flex items-center justify-center flex-shrink-0`}>
              <stat.icon className={`w-3.5 h-3.5 ${stat.textColor}`} />
            </div>
            <p className={`text-[9px] font-medium truncate ${stat.abnormal ? 'text-red-500' : 'text-slate-500'}`}>{stat.label}</p>
          </div>
          <div className="flex items-end justify-between gap-1.5">
            <div className="min-w-0">
              <p className={`text-lg font-bold leading-none ${stat.abnormal ? 'text-red-600' : 'text-slate-900'}`}>{stat.value}</p>
              <p className={`text-[9px] mt-0.5 ${stat.abnormal ? 'text-red-400 font-semibold' : 'text-slate-400'}`}>{stat.unit}</p>
            </div>
            {stat.dualLine && stat.trendDia ? (
              <FamilyBloodPressureSparkline sys={stat.trend} dia={stat.trendDia} sysColor={stat.color} />
            ) : (
              <VitalSparkline data={stat.trend} color={stat.color} />
            )}
          </div>
        </div>
      ))}
    </div>

    {/* 今日照护计划 */}
    <div onClick={onCarePlanClick} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
      <SectionHeader
        icon={CalendarDays}
        title="今日照护计划"
        right={<span className="text-[9px] font-bold text-white/90 bg-white/20 px-2 py-0.5 rounded-md">{formatDemoDateBadge()}</span>}
      />
      <div className="divide-y divide-slate-50">
        {previewActs.map((item, i) => (
          <div key={i} className="px-4 py-2.5 flex items-center gap-3">
            <span className="text-[10px] font-bold text-slate-400 w-9 flex-shrink-0">{item.time}</span>
            <div className="flex-1 min-w-0 flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-800">{item.activity}</span>
              <span className={`text-[8px] font-medium px-1.5 py-0.5 rounded ${TYPE_BADGE[item.type] || 'bg-slate-100 text-slate-600'}`}>{CARE_PLAN_TYPE_LABEL[item.type] || item.type}</span>
            </div>
            <p className="text-[9px] text-slate-400 max-w-[45%] truncate text-right">{item.detail}</p>
          </div>
        ))}
      </div>
      <div className="px-4 py-2 bg-[#CCF0FE] border-t border-[#99E7FF] flex items-center justify-end gap-1">
        <span className="text-[9px] text-[#0B3550] font-medium">查看完整计划</span>
        <ChevronRight className="w-3.5 h-3.5 text-[#006F80]" />
      </div>
    </div>

    
{/* Care Team */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <SectionHeader icon={Users} title="照护团队" />
      <div className="p-4 space-y-3">
        {careTeam.map((member) => (
          <div key={member.name} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-[#99E7FF]">
              <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">{member.name}</p>
              <p className="text-[10px] text-slate-400">{member.role}</p>
            </div>
            <button
              type="button"
              onClick={() => setCallTarget(`${member.name} · ${member.phone}`)}
              className="flex items-center gap-1 text-[10px] text-[#006F80] font-medium bg-[#CCF0FE] px-2.5 py-1 rounded-lg hover:bg-[#99E7FF] transition-colors"
            >
              <Phone className="w-3 h-3" /> Call
            </button>
          </div>
        ))}
      </div>
    </div>

    {callTarget && (
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in">
        <Phone className="w-3.5 h-3.5 text-[#006F80]" />
        <span>正在呼叫 {callTarget}</span>
      </div>
    )}

    {/* Floating patient switch button — bottom right */}
    <button
      onClick={() => setFamilyPatientId(familyPatientId === 18 ? 7 : 18)}
      className="fixed bottom-6 right-6 z-50 bg-[#006F80] hover:bg-[#B0895E] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg transition-all flex items-center gap-2"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
      切换到 {PATIENTS_FULL.find(p => p.id === familyPatientId)?.name ?? 'other patient'}
    </button>

  </div>
  );
};

const VitalsTab: FC<{ familyPatientId: number }> = ({ familyPatientId }) => {
  const isAlertPatient = familyPatientId === 2;
  const alertActive = usePatientStore(s => isAlertPatient ? s.alertActive : false);
  const vitals = usePatientStore(s => s.vitals[familyPatientId] ?? DEFAULT_VITALS[familyPatientId]);
  const summary = usePatientStore(s => s.patientsSummary.find(p => p.id === familyPatientId));
  const patient = usePatientStore(s => s.patients.find(p => p.id === familyPatientId));
  const diagnosis = summary?.diagnosis ?? patient?.diagnosis ?? '';
  const vitalCards = useMemo(() => buildFamilyDetailVitalCards(vitals, alertActive, diagnosis), [vitals, alertActive, diagnosis]);
  const mentalRows = useMemo(() => buildFamilyMentalStatus(vitals, alertActive), [vitals, alertActive]);
  const ioSnapshot = useMemo(() => buildFamilyIoSnapshot(vitals, alertActive), [vitals, alertActive]);
  const sleepSnapshot = useMemo(() => buildFamilySleepSnapshot(vitals, alertActive), [vitals, alertActive]);
  const mentalInsight = useMemo(() => buildFamilyMentalInsight(alertActive), [alertActive]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Real-Time Vitals header — fixed while content scrolls */}
      <div className="flex-shrink-0 px-4 pt-4 pb-2 bg-slate-50 z-10">
        <div className={`${FAMILY_CLASS.heroGradient} rounded-2xl p-4 text-white shadow-md`}>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            <div>
              <h3 className="text-sm font-bold">实时体征</h3>
              <p className="text-[10px] text-[#99E7FF]">{patient?.name ?? '患者'} · Live device sync</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 px-4 pb-4 space-y-4">
      {vitalCards.map((v, i) => (
        <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg ${v.bg} flex items-center justify-center`}>
                <v.icon className={`w-4 h-4 ${v.textColor}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-700">{v.label}</p>
                <p className="text-[9px] text-slate-400">via {v.device}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-xl font-bold ${v.textColor}`}>{v.value}</p>
              <p className="text-[10px] text-slate-400">{v.unit}</p>
            </div>
          </div>
          {v.dualLine && v.trendDia ? (
            <FamilyBloodPressureTrendChart
              sys={expandTrendData(v.trend, VITALS_TREND_POINTS)}
              dia={expandTrendData(v.trendDia, VITALS_TREND_POINTS)}
              sysColor={v.color}
              labels={buildVitalTimeLabels(VITALS_TREND_POINTS, VITALS_TREND_INTERVAL, VITALS_DEMO_END)}
              xLabelEvery={VITALS_X_LABEL_EVERY}
            />
          ) : (
            <VitalTrendChart data={v.trend} color={v.color} trend={v.trendDir} unit={v.unit} />
          )}
          <AiInsight>{v.insight}</AiInsight>
        </div>
      ))}

      {/* Mental Status + I/O */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <SectionHeader icon={Brain} title="Mental Status & I/O" />
        <div className="grid grid-cols-2 divide-x divide-slate-100">
          {/* Mental Status */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                <Brain className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <h4 className="text-xs font-semibold text-slate-700">Mental Status</h4>
            </div>
            <div className="space-y-2.5">
              {mentalRows.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 flex-shrink-0">{item.label}</span>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[11px] font-semibold text-slate-800 text-right truncate">{item.value}</span>
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.score === 'good' ? 'bg-emerald-400' : item.score === 'warn' ? 'bg-amber-400' : 'bg-red-400'}`} />
                  </div>
                </div>
              ))}
            </div>
            {/* AI Mental Insight */}
            <AiInsight>{mentalInsight}</AiInsight>
          </div>

          {/* I/O */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-cyan-50 flex items-center justify-center">
                <GlassWater className="w-3.5 h-3.5 text-cyan-600" />
              </div>
              <h4 className="text-xs font-semibold text-slate-700">Intake / Output</h4>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400">口服摄入</span>
                  <span className="text-[11px] font-bold text-[#006F80]">{ioSnapshot.oralIntake}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-[#06B0EF] to-[#006F80] h-1.5 rounded-full" style={{ width: `${ioSnapshot.oralPct}%` }} />
                </div>
                <p className="text-[8px] text-slate-400 mt-0.5">{ioSnapshot.oralNote}</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400">排尿量</span>
                  <span className={`text-[11px] font-bold ${ioSnapshot.fluidWarn ? 'text-red-600' : 'text-cyan-600'}`}>{ioSnapshot.urineOutput}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${ioSnapshot.fluidWarn ? 'bg-red-500' : 'bg-cyan-500'}`} style={{ width: `${ioSnapshot.urinePct}%` }} />
                </div>
                <p className="text-[8px] text-slate-400 mt-0.5">{ioSnapshot.urineNote}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                <span className="text-[10px] font-semibold text-slate-600">体液平衡</span>
                <span className={`text-[11px] font-extrabold ${ioSnapshot.fluidWarn ? 'text-red-600' : 'text-[#006F80]'}`}>{ioSnapshot.fluidBalance}</span>
              </div>
            </div>
            <AiInsight>{ioSnapshot.insight}</AiInsight>
          </div>
        </div>
      </div>

      {/* Sleep Data from mmWave */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <SectionHeader icon={BedDouble} title="Sleep Data (mmWave Radar)" />
        <div className="p-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Sleep Duration', value: sleepSnapshot.duration, unit: 'hrs', sub: sleepSnapshot.durationSub },
            { label: 'Resp Rate', value: sleepSnapshot.respRate, unit: '/min', sub: sleepSnapshot.respSub },
            { label: 'Sleep Score', value: sleepSnapshot.sleepScore, unit: '/100', sub: sleepSnapshot.scoreSub },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-lg font-bold text-slate-900">{s.value}</p>
              <p className="text-[8px] text-slate-400">{s.label}</p>
              <p className="text-[9px] text-slate-400 mt-0.5">{s.unit}</p>
              <p className={`text-[8px] mt-0.5 ${alertActive ? 'text-red-500' : 'text-[#006F80]'}`}>{s.sub}</p>
            </div>
          ))}
        </div>
        {/* AI Sleep Insight */}
        <AiInsight>{sleepSnapshot.insight}</AiInsight>
        </div>
      </div>
      </div>
    </div>
  );
};

const CareTab: FC<{ sub: CareSubTab; setSub: (s: CareSubTab) => void; familyPatientId: number }> = ({ sub, setSub, familyPatientId }) => {
  const subTabs: { key: CareSubTab; label: string; icon: FC<{ className?: string }> }[] = [
    { key: 'plan', label: '照护计划', icon: CalendarDays },
    { key: 'logs', label: 'Care Logs', icon: ClipboardList },
    { key: 'meds', label: 'Meds', icon: Pill },
    { key: 'devices', label: 'Devices', icon: Smartphone },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Sub Tab Pills — fixed while content scrolls */}
      <div className="flex-shrink-0 px-4 pt-4 pb-2 bg-slate-50 z-10">
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          {subTabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSub(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${sub === key ? 'bg-white text-[#006F80] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 px-4 pb-4 space-y-4">
        {sub === 'plan' && <CarePlanTab familyPatientId={familyPatientId} />}
        {sub === 'logs' && <CareLogsTab familyPatientId={familyPatientId} />}
        {sub === 'meds' && <MedsTab familyPatientId={familyPatientId} />}
        {sub === 'devices' && <DevicesTab familyPatientId={familyPatientId} />}
      </div>
    </div>
  );
};

const CarePlanTab: FC<{ familyPatientId: number }> = ({ familyPatientId }) => {
  const carePlans = usePatientStore(s => s.carePlans);
  const carePlanStatus = useCollaborationStore(s => s.carePlanStatus);
  const acts = useMemo(
    () => getTodayActivities(carePlans[familyPatientId], familyPatientId, DEMO_CARE_PLAN_DATE, carePlanStatus),
    [carePlans, carePlanStatus, familyPatientId],
  );
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const d = new Date(DEMO_CARE_PLAN_DATE);
  const dayLabel = `${dayNames[d.getDay()]} ${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;

  const typeLabel: Record<string, string> = {
    medication: 'med', therapy: 'exercise', nurse_visit: 'visit',
    doctor_consult: 'consult', monitoring: 'monitor', self_care: 'self', care_worker: 'care',
  };

  const { completed, missed, progressPct } = summarizeCarePlanProgress(acts);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <SectionHeader
          icon={CalendarDays}
          title={dayLabel}
          right={<span className="text-[9px] font-semibold text-white/90 bg-white/20 px-2 py-0.5 rounded-full">Today</span>}
        />
        <div className="px-4 py-3 bg-[#CCF0FE] border-b border-[#99E7FF]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold text-[#0B3550]">每日进度</span>
            <span className="text-[10px] font-bold text-[#006F80]">{completed}/{acts.length} · {progressPct}%</span>
          </div>
          <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-[#99E7FF]">
            <div className="bg-gradient-to-r from-[#06B0EF] to-[#006F80] h-2 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="text-[9px] text-[#0B3550] mt-1">{acts.length} activities{missed > 0 ? ` · ${missed} missed` : ''}</p>
        </div>
        <div className="divide-y divide-slate-50">
          {acts.map((act: any, j: number) => {
            const isCompleted = act.status === 'completed';
            const isMissed = act.status === 'missed';
            const isInProgress = act.status === 'in_progress';
            return (
            <div key={j} className="px-3 py-2 flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-400 w-9 flex-shrink-0">{act.time}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-800">{act.activity}</span>
                  <span className={`text-[8px] font-medium px-1.5 py-0.5 rounded ${TYPE_BADGE[act.type] || 'bg-slate-100 text-slate-600'}`}>{typeLabel[act.type] || act.type}</span>
                </div>
                <p className="text-[9px] text-slate-400 mt-0.5">{act.detail}</p>
              </div>
              <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                isCompleted ? 'bg-[#CCF0FE] text-[#006F80]' :
                isMissed ? 'bg-red-50 text-red-600 alert-blink' :
                isInProgress ? 'bg-[#CCF0FE] text-[#0B3550]' :
                'bg-amber-50 text-amber-700'
              }`}>
                {isCompleted ? '✓ Done' : isMissed ? '✗ Missed' : isInProgress ? '◷ Active' : '○ Due'}
              </span>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CareLogsTab: FC<{ familyPatientId: number }> = ({ familyPatientId }) => {
  const isAlertPatient = familyPatientId === 2;
  const alertActive = usePatientStore(s => isAlertPatient ? s.alertActive : false);
  const vitals = usePatientStore(s => s.vitals[familyPatientId]);
  const patientsSummary = usePatientStore(s => s.patientsSummary);
  const summary = patientsSummary.find(p => p.id === familyPatientId);
  const { score: newsScore, tier: newsTier, escalation, monitoringLabel, redScore, label } = resolvePatientNews(familyPatientId, summary?.diagnosis ?? '', vitals, summary, alertActive);
  const effectiveVitals = vitals ?? DEFAULT_VITALS[familyPatientId];
  const baseline = DEFAULT_VITALS[familyPatientId];
  const contributingFactors = useMemo(() => [
    {
      vital: alertActive ? '血氧异常' : '血氧基线',
      risk: alertActive
        ? `SpO₂从${baseline.spo2}%降至${effectiveVitals.spo2}%。脑出血术后需维持SpO₂≥95%。${monitoringLabel}。`
        : `SpO₂ ${effectiveVitals.spo2}%静息稳定。右侧偏瘫卧床，呼吸功能正常。目标≥95%。`,
      icon: Activity,
    },
    {
      vital: alertActive ? '血栓预警' : '血压管理',
      risk: `血压${effectiveVitals.bpSystolic}/${effectiveVitals.bpDiastolic} mmHg。脑出血术后目标<150/90。` + (alertActive ? `血压升高需立即复查。${monitoringLabel}` : '降压药每日一次确认服用。注意体位性低血压。'),
      icon: Droplets,
    },
    {
      vital: alertActive ? '意识变化' : 'DVT监测',
      risk: alertActive
        ? `意识状态变化需紧急评估。${monitoringLabel}。照护者已接受紧急联络培训。`
        : '右下肢DVT（Caprini 7分高危）。避免挤压、抬高患肢、每日观察肿胀/皮温/颜色。',
      icon: Heart,
    },
    { vital: '照护者支持', risk: '儿子周明辉同住为主要照护者。已培训翻身护理+ROM操作+血压监测+血栓观察+紧急联络流程。', icon: MessageCircle },
  ], [alertActive, effectiveVitals, monitoringLabel, summary?.diagnosis]);
  const careLogs = usePatientStore(s => s.carePlans[familyPatientId]?.logs);
  const submitted = useCollaborationStore(s => s.submittedCareLogs[familyPatientId]) ?? EMPTY_SUBMITTED_LOGS;
  const carePlanStatus = useCollaborationStore(s => s.carePlanStatus);
  const setCarePlanTaskStatus = useCollaborationStore(s => s.setCarePlanTaskStatus);
  const appendMessage = useCollaborationStore(s => s.appendMessage);
  const appendSubmittedCareLog = useCollaborationStore(s => s.appendSubmittedCareLog);
  const protocolActive = carePlanStatus[COPD_PROTOCOL_TASK_KEY] === 'completed';
  const mergedLogs = useMemo(
    () => [...(careLogs || []), ...submitted],
    [careLogs, submitted],
  );
  const progressNotes = useMemo(
    () => getFamilyCareProgressNotes(mergedLogs, alertActive, DEMO_CARE_PLAN_DATE, 6, vitals ?? DEFAULT_VITALS[familyPatientId]),
    [mergedLogs, alertActive, vitals, familyPatientId],
  );

  const handleActivateProtocol = () => {
    if (protocolActive || !isAlertPatient) return;
    const time = getDemoTimeString();
    setCarePlanTaskStatus(COPD_PROTOCOL_TASK_KEY, 'completed');
    appendMessage(familyPatientId, {
      id: getDemoTimestamp(),
      from: 'family',
      senderName: 'Mrs. Chan (Chan Siu Ling)',
      text: '照护协议已激活 — 家属已确认紧急联络流程和血压监测要求。护士刘敏将立即上门评估。',
      time,
      patientId: familyPatientId,
    });
    appendSubmittedCareLog(familyPatientId, {
      date: DEMO_CARE_PLAN_DATE,
      time,
      type: 'Family Action',
      detail: '照护协议已激活 — 由家属周明辉确认。',
      author: 'Mrs. Chan',
      role: 'Family',
      status: 'completed',
    });
  };
  return (
  <div className="space-y-3">
    {/* NEWS Score + Interventions */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className={`px-4 py-3 flex items-center justify-between ${newsTier === 'high' ? 'bg-gradient-to-r from-red-500 to-red-600' : newsTier === 'medium' ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 'bg-gradient-to-r from-emerald-500 to-emerald-600'}`}>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-white" />
          <span className="text-xs font-bold text-white">风险评估</span>
        </div>
        <span className="text-[10px] font-semibold text-white/90 bg-black/20 px-2 py-0.5 rounded-full">
          {label}
        </span>
      </div>

      <div className="px-4 py-3">
        <p className="text-[10px] text-slate-500 mb-2">National Early Warning Score (NEWS2)</p>
        <div className="flex items-center gap-4">
          <div className={`text-3xl font-extrabold ${newsTier === 'high' ? 'text-red-600' : newsTier === 'medium' ? 'text-amber-600' : redScore ? 'text-orange-600' : 'text-emerald-600'}`}>{newsScore}</div>
          <div className="flex-1">
            <p className="text-[10px] font-semibold text-slate-700">{escalation}</p>
            <p className="text-[9px] text-slate-500 mt-0.5">{monitoringLabel}{redScore ? ' · RED score' : ''}</p>
            {vitals && (
              <p className="text-[9px] text-slate-400 mt-1">
                RR {vitals.rr}/min · SpO₂ {vitals.spo2}% Scale {vitals.spo2Scale ?? 2}{vitals.onSupplementalO2 ? ' + O₂' : ''} · AVPU {vitals.avpu ?? 'A'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Clinical Factors */}
      <div className="border-t border-slate-100 px-4 py-3">
        <p className="text-[10px] font-semibold text-slate-600 mb-2">促成因素</p>
        <div className="space-y-1.5">
          {contributingFactors.map((f, i) => (
            <div key={i} className="flex items-start gap-2">
              <f.icon className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-red-600">{f.vital}</span>
                <span className="text-[9px] text-slate-500 ml-1">{f.risk}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI干预建议 */}
      <div className="border-t border-slate-100 px-4 py-3 bg-amber-50/50">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <p className="text-[10px] font-bold text-amber-800">AI推荐干预</p>
          <span className="text-[8px] text-amber-500 ml-auto">24h window</span>
        </div>
        <div className="space-y-2">
          {[
            { num: '1', action: '压疮护理：每2h翻身+检查皮肤+减压气垫床。Braden≤16需重点关注。', icon: BedDouble },
            { num: '2', action: alertActive ? `监测全部7项NEWS参数 — ${monitoringLabel}。O₂ 2L/min，目标SpO₂≥92%。` : `血压监测每日2次，目标<150/90 mmHg。通知 ${PATIENTS_FULL.find(p=>p.id===familyPatientId)?.carePlan?.assignedNurse?.split(' (')[0] ?? '护士'} 若>160/95。`, icon: Heart },
            { num: '3', action: newsTier === 'high' || redScore ? '跌倒防控：检查助行器+地面防滑+夜间照明。有跌倒史需24h内上门。' : '跌倒防控：检查助行器+地面防滑+夜间照明。定期评估Barthel ADL。', icon: Footprints },
            { num: '4', action: `确保每日饮水~1,500 mL + 低盐低脂饮食。${PATIENTS_FULL.find(p=>p.id===familyPatientId)?.carePlan?.assignedCareWorker?.split(' (')[0] ?? '护理员'}定期访视。`, icon: GlassWater },
          ].map((rec, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">{rec.num}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <rec.icon className="w-3 h-3 text-amber-600 flex-shrink-0" />
                  <p className="text-[9px] text-slate-700 leading-relaxed">{rec.action}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expected Outcome */}
      <div className="border-t border-slate-100 px-4 py-3 bg-gradient-to-r from-[#CCF0FE] to-[#CCF0FE]">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#006F80] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-bold text-[#0B3550]">预期结果（30–90天）</p>
            <p className="text-[9px] text-slate-600 mt-0.5">{alertActive ? `若全部4项干预完成：SpO₂≥92%，体温≤37.5°C，${escalation}` : `若全部4项干预完成：跌倒0次，血压<150/90，压疮改善。${monitoringLabel}。`}</p>
            {isAlertPatient && (
            <button
              type="button"
              onClick={handleActivateProtocol}
              disabled={protocolActive}
              className={`mt-2 text-[9px] font-semibold px-3 py-1.5 rounded-lg inline-flex items-center gap-1 transition-colors ${
                protocolActive
                  ? 'bg-emerald-100 text-emerald-700 cursor-default'
                  : 'text-white bg-[#006F80] hover:bg-[#0B3550]'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              {protocolActive ? '照护协议已激活' : '激活易护照护端协议'}
            </button>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Progress Notes */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <SectionHeader icon={ClipboardList} title="照护记录" />
      <div className="p-4 space-y-3">
        {progressNotes.map((note, i) => (
          <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
            <div className="w-8 h-8 rounded-full bg-[#CCF0FE] flex items-center justify-center flex-shrink-0">
              <note.icon className={`w-4 h-4 ${note.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-800">{note.title}</p>
              <p className="text-[10px] text-slate-500">{note.detail}</p>
            </div>
            <span className="text-[9px] text-slate-400 flex-shrink-0">{note.time}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

const MedsTab: FC<{ familyPatientId: number }> = ({ familyPatientId }) => {
  const isAlertPatient = familyPatientId === 2;
  const alertActive = usePatientStore(s => isAlertPatient ? s.alertActive : false);
  const patient = usePatientStore(s => s.patients.find(p => p.id === familyPatientId));
  const meds = useMemo(() => getFamilyMedications(patient, alertActive), [patient, alertActive]);
  const summary = useMemo(() => getFamilyMedSummary(patient, alertActive), [patient, alertActive]);

  return (
  <div className="space-y-3">
    {/* Missed Medication AI Alert */}
    <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-4 border border-red-200">
    <div className="flex items-start gap-3">
    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5 animate-pulse" />
    <div>
      <p className="text-xs font-semibold text-red-700">AI提醒：感染风险 — 用药审查</p>
      <p className="text-[10px] text-[#006F80] mt-0.5">{summary.aiSummary}</p>
    </div>
    </div>
    </div>

    {/* Medication List */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <SectionHeader icon={Pill} title="当前用药" right={<span className="text-[10px] text-white/80">{summary.activeCount}种在用 · {summary.missedCount}种遗漏</span>} />
    <div>
    {meds.map((med, i) => (
        <div key={i} className={`px-4 py-3 border-b border-slate-50 last:border-0 ${med.adherent ? 'bg-white' : 'bg-red-50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className={`text-xs font-semibold ${med.adherent ? 'text-slate-800' : 'text-red-700'}`}>{med.name}</p>
                {!med.adherent && (
                  <span className="text-[8px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">已错过</span>
                )}
              </div>
              <p className="text-[9px] text-slate-500">{med.dose} · {med.purpose}</p>
            </div>
            <div className="text-right">
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${med.adherent ? 'text-slate-600 bg-slate-100' : 'text-red-600 bg-red-100'}`}>{med.schedule}</span>
              <p className={`text-[8px] mt-0.5 ${med.adherent ? 'text-[#006F80]' : 'text-red-500 font-semibold'}`}>{med.adherence}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>

    {/* AI续药提醒 */}
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-amber-800">AI提醒：补充+依从</p>
          <p className="text-[10px] text-amber-700 mt-0.5">{summary.refillSummary}</p>
          <button className="mt-2 text-[10px] font-semibold text-white bg-amber-600 hover:bg-amber-700 px-3 py-1.5 rounded-lg inline-flex items-center gap-1">
          <Send className="w-3 h-3" /> 申请续药
          </button>
        </div>
      </div>
    </div>

    {/* Schedule Summary */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <SectionHeader icon={Sun} title="今日用药时间表" />
      <div className="p-4 grid grid-cols-2 gap-2">
        <div className="bg-[#CCF0FE] rounded-xl p-3 border border-[#99E7FF]">
          <div className="flex items-center gap-1.5 mb-1">
            <Sun className="w-3 h-3 text-amber-500" />
            <span className="text-[10px] font-semibold text-slate-700">早晨（8点）</span>
            <CheckCircle2 className="w-3 h-3 text-[#006F80] ml-auto" />
          </div>
          <p className="text-[9px] text-slate-600">硝苯地平缓释片 30mg · 阿司匹林 100mg</p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 border border-red-100">
          <div className="flex items-center gap-1.5 mb-1">
            <Moon className="w-3 h-3 text-indigo-500" />
            <span className="text-[10px] font-semibold text-slate-700">按需（PRN）</span>
            <AlertTriangle className="w-3 h-3 text-amber-400 ml-auto" />
          </div>
          <p className="text-[9px] text-amber-600 font-medium">硝苯地平 30mg — 每日一次 · 监测血压＜150/90</p>
        </div>
      </div>
    </div>

    {/* Adherence Trend */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <SectionHeader icon={CheckCircle2} title="7天用药依从趋势" right={<span className="text-[10px] font-bold text-[#006F80]">{summary.adherencePct}%</span>} />
      <div className="p-4 flex gap-2">
        {[
          { day: '一', ok: true }, { day: '二', ok: true }, { day: '三', ok: true }, 
          { day: '四', ok: true }, { day: '五', ok: true }, { day: '六', ok: true }, { day: '日', ok: true },
        ].map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${d.ok ? 'bg-[#CCF0FE] text-[#006F80]' : 'bg-red-100 text-red-600'}`}>
              {d.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            </div>
            <span className="text-[9px] text-slate-400">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

const DevicesTab: FC<{ familyPatientId: number }> = ({ familyPatientId }) => {
  const isAlertPatient = familyPatientId === 2;
  const alertActive = usePatientStore(s => isAlertPatient ? s.alertActive : false);
  const vitals = usePatientStore(s => s.vitals[familyPatientId] ?? DEFAULT_VITALS[familyPatientId]);
  const patient = usePatientStore(s => s.patients.find(p => p.id === familyPatientId));
  const devices = patient?.iotDevices ?? [];
  const bpBorderline = vitals.bpSystolic >= 135 || vitals.bpDiastolic >= 85;

  return (
  <div className="space-y-3">
    {devices.map((dev, i) => {
      const img = deviceImageUrl(dev.model);
      const isBP = dev.type === 'Blood Pressure Monitor';
      const statusClass = dev.status === 'Connected'
        ? 'bg-green-50 text-green-700'
        : dev.status === 'Syncing'
          ? 'bg-[#CCF0FE] text-[#0B3550]'
          : 'bg-slate-100 text-slate-600';
      return (
        <div key={`${dev.serial}-${i}`} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3 gap-2">
            <div className="flex items-center gap-3 min-w-0">
              {img ? (
                <img src={img} alt={dev.model} className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-100 flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-[#06B0EF] to-[#006F80] rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Watch className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{dev.type}</p>
                <p className="text-[10px] text-slate-400 truncate">{dev.model}</p>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-full flex-shrink-0 ${statusClass}`}>
              <Wifi className="w-3 h-3" /> {dev.status}
            </div>
          </div>
          {isBP && (
            <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-3 mb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold text-red-600 uppercase">最新血压</span>
                <span className="text-[9px] text-slate-400">{dev.lastSync}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center"><span className="text-[9px] text-amber-400 block">SYS</span><span className={`text-lg font-extrabold ${bpBorderline ? 'text-amber-700' : 'text-slate-700'}`}>{vitals.bpSystolic}</span></div>
                <span className="text-slate-300">/</span>
                <div className="text-center"><span className="text-[9px] text-amber-400 block">DIA</span><span className={`text-lg font-extrabold ${bpBorderline ? 'text-amber-700' : 'text-slate-700'}`}>{vitals.bpDiastolic}</span></div>
                <div className="w-px h-7 bg-amber-200" />
                <div className="text-center"><span className="text-[9px] text-slate-400 block">Pulse</span><span className="text-lg font-extrabold text-slate-700">{vitals.hr}</span></div>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">电量</span>
              <span className="font-semibold text-[#006F80]">{dev.battery}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div className="bg-gradient-to-r from-[#06B0EF] to-[#006F80] h-1.5 rounded-full" style={{ width: `${dev.battery}%` }} />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">上次同步</span>
              <span className="text-slate-600">{dev.lastSync}</span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {dev.parameters.slice(0, 4).map((p, j) => (
              <span key={j} className="text-[8px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded-full">{p}</span>
            ))}
          </div>
          {dev.type === 'O₂ Concentrator' && alertActive && (
            <div className="mt-2 p-2 bg-red-50 rounded-xl flex items-start gap-2">
              <AlertTriangle className="w-3 h-3 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-red-700">Active — O₂ 2L/min. NEWS supplemental O₂ +2 applied.</p>
            </div>
          )}
        </div>
      );
    })}

    {/* Data Flow */}
    <div className="bg-slate-900 rounded-2xl p-4 text-white">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-4 h-4 text-[#006F80]" />
        <p className="text-xs font-semibold">数据流状态</p>
      </div>
      <div className="flex items-center justify-between text-[10px]">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full bg-[#006F80] flex items-center justify-center mx-auto mb-1">
            <Watch className="w-4 h-4 text-white" />
          </div>
          <p className="text-slate-300">设备</p>
        </div>
        <ArrowRight className="w-3 h-3 text-[#006F80]" />
        <div className="text-center">
          <div className="w-8 h-8 rounded-full bg-[#0B3550] flex items-center justify-center mx-auto mb-1">
            <Wifi className="w-4 h-4 text-white" />
          </div>
          <p className="text-slate-300">加密</p>
        </div>
        <ArrowRight className="w-3 h-3 text-[#006F80]" />
        <div className="text-center">
          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center mx-auto mb-1">
            <Hospital className="w-4 h-4 text-white" />
          </div>
          <p className="text-slate-300">照护团队</p>
        </div>
      </div>
      <p className="text-[9px] text-slate-400 text-center mt-3">端到端加密 · 数据存储于中国大陆 · 仅供健康监测参考</p>
    </div>
  </div>
  );
};

const ChatTab: FC<{ familyPatientId: number }> = ({ familyPatientId }) => {
  const [inputText, setInputText] = useState('');
  const msgEndRef = useRef<HTMLDivElement>(null);
  const isAlertPatient = familyPatientId === 2;
  const alertActive = usePatientStore(s => isAlertPatient ? s.alertActive : false);
  const hubMessages = useCollaborationStore(s => s.messagesByPatient[familyPatientId]) ?? EMPTY_CHAT_MESSAGES;
  const appendMessage = useCollaborationStore(s => s.appendMessage);
  const messages = hubMessages;
  const threadKey = `${alertActive ? 'alert' : 'stable'}-${messages[0]?.id ?? 0}`;
  const visibleCount = useWeChatChatReveal(messages.length, threadKey);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleCount]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    appendMessage(familyPatientId, {
      id: getDemoTimestamp(),
      from: 'family',
      senderName: FAMILY_SENDER_BY_PATIENT[familyPatientId],
      text: inputText.trim(),
      time: getDemoTimeString(),
      patientId: familyPatientId,
    });
    setInputText('');
  };

  const renderMessage = (msg: typeof hubMessages[0], i: number) => {
    const isMe = isOutgoingChatMessage(msg.from, 'family');
    return (
      <WeChatChatRow
        key={msg.id ?? i}
        isMe={isMe}
        avatar={<ChatBubbleAvatar msg={msg} size={28} />}
        header={
          <div className={`flex items-center gap-1.5 mb-0.5 ${isMe ? 'flex-row-reverse' : ''}`}>
            <span className={`text-[9px] font-medium ${getChatSenderLabelClass(msg.from, alertActive)}`}>
              {formatChatDisplayName(msg.senderName)}
            </span>
            <span className="text-[8px] text-slate-300">{msg.time}</span>
          </div>
        }
      >
        <div className={getChatBubbleClasses(msg.from, { isMe, alertActive })}>
          {msg.text}
        </div>
      </WeChatChatRow>
    );
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-[#006F80] to-[#0B3550] px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <div className="flex -space-x-2">
          <StaffAvatar name={PATIENTS_FULL.find(p=>p.id===familyPatientId)?.carePlan?.assignedNurse ?? 'RN'} size={32} className="ring-2 ring-white/40" />
          <StaffAvatar name={PATIENTS_FULL.find(p=>p.id===familyPatientId)?.carePlan?.assignedCaseManager ?? '个案经理'} size={32} className="ring-2 ring-white/40" />
          <PatientAvatar patientId={familyPatientId} size={32} className="ring-2 ring-white/40" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">照护消息</p>
          <p className="text-[9px] text-[#99E7FF] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#99E7FF]" /> 在线 — AI监护 · {PATIENTS_FULL.find(p=>p.id===familyPatientId)?.carePlan?.assignedNurse?.split(' (')[0] ?? 'RN'} · {PATIENTS_FULL.find(p=>p.id===familyPatientId)?.carePlan?.assignedCaseManager?.split(' (')[0] ?? '个案经理'}
          </p>
        </div>
        <Phone className="w-4 h-4 text-white/90" />
      </div>

      {/* Messages — scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-3 bg-slate-50 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-3 w-full">
        {messages.map((msg, i) => (
          i < visibleCount ? renderMessage(msg, i) : null
        ))}
        </div>

        <div ref={msgEndRef} />
      </div>

      {/* Chat Input — fixed bottom */}
      <div className="bg-white px-4 py-3 border-t border-slate-100 flex items-center gap-2 flex-shrink-0">
        <button type="button" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
          <Plus className="w-4 h-4 text-slate-500" />
        </button>
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          placeholder="Type a message..."
          className="flex-1 bg-slate-50 rounded-full px-4 py-2 text-xs text-slate-700 placeholder-slate-400 outline-none border border-slate-100 focus:border-[#06B0EF]"
        />
        <button type="button" onClick={handleSend} disabled={!inputText.trim()} className="w-9 h-9 rounded-full bg-[#006F80] flex items-center justify-center hover:bg-[#0B3550] transition-colors disabled:opacity-40">
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
      {isAlertPatient && <AlertToggle />}
    </div>
  );
};

export default MobileFamilyApp;
