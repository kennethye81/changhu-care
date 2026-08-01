import { useState, useEffect, useRef, useMemo, useCallback, type FC } from 'react';
import {
  Activity, Heart, Thermometer, Droplets,
  MessageCircle,
  ClipboardList, ClipboardCheck, ChevronRight, Battery, Wifi,
  AlertTriangle, CheckCircle2, Pill,
  Send, Shield, Zap, FileText,
  Search, Users,
  Brain, GlassWater, CalendarDays, Clock, CloudSun, Star, Mic, MicOff, Apple
} from 'lucide-react';
import PatientAvatar from '../components/PatientAvatar';
import ChatBubbleAvatar from '../components/ChatBubbleAvatar';
import WeChatChatRow from '../components/WeChatChatRow';
import { useWeChatChatReveal } from '../hooks/useWeChatChatReveal';
import {
  formatChatDisplayName,
  getChatBubbleClasses,
  getChatSenderLabelClass,
  isOutgoingChatMessage,
} from '../utils/chatBubbleStyles';
import StaffAvatar from '../components/StaffAvatar';
import IHomeCareEliteLogoIcon from '../components/IHomeCareEliteLogoIcon';
import { useAuth } from '../auth/AuthContext';
import { getVisiblePatientIds } from '../auth/permissions';
import { usePatientStore } from '../store/patientStore';
import { EMPTY_CARE_LOG, useCollaborationStore } from '../store/collaborationStore';
import { carePlanTaskKey, DEMO_CARE_PLAN_DATE, formatDemoDateLabel, getTodayActivities } from '../utils/carePlanSync';
import { getDemoClockTime, getDemoTimeString } from '../utils/demoClock';
import { computeEliteWorkOrders } from '../utils/eliteWorkOrders';
import { deriveEliteChatMeta, mapHubMessagesToEliteDisplay } from '../utils/eliteChat';
import { getHubNurseSender } from '../utils/chatSenders';
import { normalizeChatMessage, type ChatMessage } from '../data/chatMessages';
import { buildPatientAiBrief } from '../utils/patientAiBrief';
import { buildPatient1EliteVoiceBundle, formatPatient1EscalationChat, formatNewsHeadline } from '../utils/medicalHistoryNews';
import { calculateNews, PATIENT1_ESCALATION_VITALS } from '../utils/newsScore';
import AlertToggle from '../components/AlertToggle';
import { PENDING_PATIENTS } from '../data/pendingPatients';
import PendingRegistrationAssessmentForm from '../components/PendingRegistrationAssessmentForm';
import PendingRegistrationCarePlanForm from '../components/PendingRegistrationCarePlanForm';
import EliteFormSubmitFooter from '../components/EliteFormSubmitFooter';
import { getCarePlanDefaults, type CarePlanData } from '../data/pendingRegistrationForms';
import { useEliteUploadSubmit } from '../hooks/useEliteUploadSubmit';
import {
  ASSESSMENT_FILL_MAX,
  ASSESSMENT_FILL_TIMING,
  CARE_PLAN_FILL_MAX,
  CARE_PLAN_FILL_TIMING,
  useEliteFormFillAnimation,
} from '../hooks/useEliteFormFillAnimation';
import { FAMILY_CLASS } from '../theme/familyTokens';

/* ─────────────── MOBILE ELITES APP ─────────────── */

type ElitesTab = 'today' | 'candidate' | 'patients' | 'chat';

const DIAGNOSIS_TAG: Record<string, string> = {
  'Post-PCI Recovery':     'bg-rose-50 text-rose-700 border-rose-200',
  'COPD':                   'bg-[#CCF0FE] text-[#006F80] border-[#99E7FF]',
  'Oncology — Breast Ca':  'bg-[#EBF5F9] text-[#006F80] border-[#E1FCFF]',
  'Oncology — Lung Ca':    'bg-[#EBF5F9] text-[#006F80] border-[#E1FCFF]',
  'Post-Stroke Rehab':     'bg-orange-50 text-orange-700 border-orange-200',
  'Heart Failure NYHA III': 'bg-red-50 text-red-700 border-red-200',
  'Heart Failure NYHA II': 'bg-rose-50 text-rose-700 border-rose-200',
  'Type 2 Diabetes':       'bg-[#EBF5F9] text-[#006F80] border-[#E1FCFF]',
  'Hypertension':          'bg-[#EBF5F9] text-[#006F80] border-[#E1FCFF]',
  'CKD Stage 3':           'bg-[#EBF5F9] text-[#006F80] border-[#E1FCFF]',
  'HTN + CKD Stage 2':     'bg-[#EBF5F9] text-[#006F80] border-[#E1FCFF]',
};

const MobileElitesApp: FC<{ tab: ElitesTab; setTab: (t: ElitesTab) => void }> = ({ tab, setTab }) => {
  const [showApp, setShowApp] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => { setShowApp(true); setShowSplash(false); }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  const tabs: { key: ElitesTab; label: string; icon: FC<{ className?: string }> }[] = [
    { key: 'today', label: 'Dashboard', icon: CalendarDays },
    { key: 'candidate', label: '待入组', icon: ClipboardCheck },
    { key: 'patients', label: 'Patients', icon: Users },
    { key: 'chat', label: 'Chat', icon: MessageCircle },
  ];

  return (
    <div className="flex justify-center pt-4">
      <div className="relative bg-gradient-to-br from-[#3a3a40] via-[#2d2d35] to-[#252530] rounded-[60px] p-[8px] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_0_3px_#1a1a22,0_25px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)]">
        <div className="w-[402px] h-[874px] bg-slate-50 rounded-[52px] overflow-hidden flex flex-col relative ring-1 ring-white/10 shadow-[inset_0_0_40px_rgba(0,0,0,0.03),0_0_0_0.5px_rgba(0,0,0,0.2)]">

          {!showApp && !showSplash ? (
            <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
              <img src="/ios-wallpaper.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute top-0 left-0 right-0 h-[72px] bg-gradient-to-b from-black/40 via-black/20 to-transparent z-20 pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 z-30 px-10 pt-4 pb-2 flex items-center justify-between">
                <span className="text-white font-semibold text-[13px] drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">9:41</span>
                <div className="flex items-center gap-2 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                  <svg className="w-4 h-4" viewBox="0 0 16 12" fill="none"><rect x="0.5" y="3" width="2" height="8" rx="0.5" fill="currentColor"/><rect x="3.5" y="1.5" width="2" height="9.5" rx="0.5" fill="currentColor"/><rect x="6.5" y="0" width="2" height="11" rx="0.5" fill="currentColor"/><rect x="9.5" y="3.5" width="2" height="7.5" rx="0.5" fill="currentColor"/></svg>
                  <Wifi className="w-3.5 h-3.5" />
                  <Battery className="w-4 h-4" />
                </div>
              </div>
              <div className="flex-1 flex flex-col relative z-10 items-center justify-center">
                <button onClick={() => setShowSplash(true)}
                  className="w-[72px] h-[72px] rounded-[20px] flex items-center justify-center shadow-lg backdrop-blur-xl bg-white/20 border border-white/30 transition-transform active:scale-90">
                  <IHomeCareEliteLogoIcon size={36} />
                </button>
                <span className="text-white/95 font-bold text-sm mt-3 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" style={{ fontFamily: "'Space Grotesk','Inter',sans-serif" }}>易护照护端</span>
                <span className="text-white/60 text-[10px] mt-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]">照护团队平台</span>
              </div>
            </div>
          ) : showSplash ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-[#006F80] to-[#0B3550] min-h-0">
              <div className="zoom-in flex flex-col items-center">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg backdrop-blur-xl bg-white/20 border border-white/30 mb-6">
                  <IHomeCareEliteLogoIcon size={40} />
                </div>
                <p className="text-white text-2xl font-extrabold tracking-tight mb-8" style={{ fontFamily: "'Space Grotesk','Inter',sans-serif" }}>易护照护端</p>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            </div>
          ) : (
          <div className="flex-1 flex flex-col bg-slate-50 min-h-0">
            <div className="flex-shrink-0 px-10 pt-4 pb-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-900 bg-slate-50">
              <span className="tracking-tight">9:41</span>
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 12" fill="none"><rect x="0.5" y="3" width="2" height="8" rx="0.5" fill="currentColor"/><rect x="3.5" y="1.5" width="2" height="9.5" rx="0.5" fill="currentColor"/><rect x="6.5" y="0" width="2" height="11" rx="0.5" fill="currentColor"/><rect x="9.5" y="3.5" width="2" height="7.5" rx="0.5" fill="currentColor"/></svg>
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className={`flex-1 flex flex-col min-h-0 ${tab === 'today' || tab === 'patients' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
              {tab === 'today' && <ElitesDashboardTab />}
              {tab === 'candidate' && <Elites待入组Tab />}
              {tab === 'patients' && <ElitesPatientsTab />}
              {tab === 'chat' && <ElitesChatTab />}
            </div>
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
            <AlertToggle />
          </div>
          )}
        </div>
        <div className="absolute -right-[2px] top-44 w-[4px] h-24 bg-gradient-to-b from-[#1A2D3D] to-[#2a2a32] rounded-r-lg shadow-[inset_-1px_0_2px_rgba(0,0,0,0.3)]" />
        <div className="absolute -left-[2px] top-36 w-[4px] h-14 bg-gradient-to-b from-[#1A2D3D] to-[#2a2a32] rounded-l-lg shadow-[inset_1px_0_2px_rgba(0,0,0,0.3)]" />
        <div className="absolute -left-[2px] top-[172px] w-[4px] h-14 bg-gradient-to-b from-[#1A2D3D] to-[#2a2a32] rounded-l-lg shadow-[inset_1px_0_2px_rgba(0,0,0,0.3)]" />
        <div className="absolute -left-[2px] top-[120px] w-[4px] h-8 bg-gradient-to-b from-[#1A2D3D] to-[#2a2a32] rounded-l-lg shadow-[inset_1px_0_2px_rgba(0,0,0,0.3)]" />
      </div>
    </div>
  );
};

/* ─────────────── MOBILE ELITES SUB-TABS ─────────────── */

const ElitesDashboardTab: FC = () => {
  const { user } = useAuth();
  const alertActive = usePatientStore(s => s.alertActive);
  const carePlans = usePatientStore(s => s.carePlans);
  const carePlanStatus = useCollaborationStore(s => s.carePlanStatus);
  const visibleIds = user ? getVisiblePatientIds(user.role, user.account) : null;
  const patientIds = useMemo(
    () => visibleIds ?? Object.keys(carePlans).map(Number),
    [visibleIds, carePlans],
  );
  const workOrders = useMemo(
    () => computeEliteWorkOrders(patientIds, carePlans, carePlanStatus),
    [patientIds, carePlans, carePlanStatus],
  );
  const pct = (completed: number, total: number) => (total > 0 ? Math.round((completed / total) * 100) : 0);
  const todayPct = pct(workOrders.today.completed, workOrders.today.total);
  const weekPct = pct(workOrders.week.completed, workOrders.week.total);
  const monthPct = pct(workOrders.month.completed, workOrders.month.total);
  const caregiverName = user?.name ?? 'Sarah Leung';

  const aiQuality = {
    punctuality: 92,
    completionQuality: 88,
    clientSatisfaction: 4.6,
    ndFeedback: 'Sarah maintains high clinical standards. Documentation is thorough and submitted on time. One late arrival noted this week due to traffic — otherwise excellent.',
    cmFeedback: `Patients report positive experiences. Multiple families have praised ${caregiverName}’s attentive care and clinical documentation. No complaints received.`,
    summary: 'Overall performance: Strong. Punctuality slightly below target (92% vs 95%). Recommend planning 15-min buffer between home visits to account for HK traffic variability.',
  };

  return (
  <div className="flex-1 flex flex-col min-h-0">
    {/* Caregiver header — fixed while content scrolls */}
    <div className="flex-shrink-0 px-4 pt-4 pb-2 bg-slate-50 z-10">
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <StaffAvatar name={caregiverName} size={56} className="shadow-md border-2 border-[#99E7FF]" />
          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-900">{caregiverName}</h3>
            <p className="text-xs text-slate-400">Primary Nurse · 8 yrs exp</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="w-2 h-2 rounded-full bg-[#006F80]" />
              <span className="text-xs text-[#006F80] font-medium">在岗 · {workOrders.today.total} 次访视</span>
            </div>
          </div>
          <button className="bg-[#CCF0FE] text-[#006F80] text-[10px] font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Clock In
          </button>
        </div>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto min-h-0 px-4 pb-4 space-y-4">
    {alertActive && (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-3 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-red-700">{formatNewsHeadline(calculateNews(PATIENT1_ESCALATION_VITALS, 'COPD'))}</p>
          <p className="text-[10px] text-red-600 mt-0.5">{formatPatient1EscalationChat('Urgent clinical review required')}</p>
        </div>
      </div>
    )}

    {/* Date + Weather */}
    <div className={`${FAMILY_CLASS.heroGradient} rounded-2xl p-4 text-white shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold">{formatDemoDateLabel()}</p>
          <p className="text-[10px] text-[#99E7FF] mt-0.5">第25周 · 每日工作报告</p>
        </div>
        <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2">
          <CloudSun className="w-5 h-5 text-yellow-200" />
          <div>
            <p className="text-sm font-bold">28°C</p>
            <p className="text-[9px] text-[#99E7FF]">多云</p>
          </div>
        </div>
      </div>
    </div>

    {/* 工单 Summary */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-50">
        <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-[#006F80]" /> 工单
        </h3>
      </div>
      <div className="p-4 space-y-4">
        {/* Today / Week / Month counts */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Today', total: workOrders.today.total, completed: workOrders.today.completed, pct: todayPct, color: 'border-[#99E7FF] bg-[#CCF0FE]', bar: 'bg-[#006F80]', text: 'text-[#006F80]' },
            { label: '本周', total: workOrders.week.total, completed: workOrders.week.completed, pct: weekPct, color: 'border-[#06B0EF] bg-[#FAE8D0]', bar: 'bg-[#06B0EF]', text: 'text-[#0B3550]' },
            { label: '本月', total: workOrders.month.total, completed: workOrders.month.completed, pct: monthPct, color: 'border-[#006F80] bg-[#F0D5B0]', bar: 'bg-[#0B3550]', text: 'text-[#0B3550]' },
          ].map((col, i) => (
            <div key={i} className={`rounded-xl border ${col.color} p-3 text-center`}>
              <p className="text-[10px] font-semibold text-slate-500 mb-1">{col.label}</p>
              <p className={`text-xl font-extrabold ${col.text}`}>{col.total}</p>
              <p className="text-[9px] text-slate-400">pending</p>
              <div className="mt-2 flex items-center gap-1.5 justify-center">
                <CheckCircle2 className={`w-3 h-3 ${col.text}`} />
                <span className={`text-[10px] font-bold ${col.text}`}>{col.completed}</span>
                <span className="text-[9px] text-slate-400">done</span>
              </div>
            </div>
          ))}
        </div>

        {/* Overall progress bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold text-slate-500">今日完成</span>
            <span className="text-[10px] font-bold text-[#006F80]">{todayPct}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-[#06B0EF] to-[#006F80] h-2.5 rounded-full transition-all" style={{ width: `${todayPct}%` }} />
          </div>
          <p className="text-[9px] text-slate-400 mt-1">
            {workOrders.today.completed} of {workOrders.today.total} completed · {workOrders.today.total - workOrders.today.completed} remaining
          </p>
        </div>

        {/* Week + Month progress bars */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: '本周', completed: workOrders.week.completed, total: workOrders.week.total, pct: weekPct, color: 'bg-[#06B0EF]' },
            { label: '本月', completed: workOrders.month.completed, total: workOrders.month.total, pct: monthPct, color: 'bg-[#0B3550]' },
          ].map((bar, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-500">{bar.label}</span>
                <span className="text-[10px] font-bold text-slate-700">{bar.completed}/{bar.total} · {bar.pct}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className={`${bar.color} h-1.5 rounded-full`} style={{ width: `${bar.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* AI质量评估 */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-[#0B3550] to-[#00263F] px-4 py-3 flex items-center gap-2">
        <Brain className="w-4 h-4 text-white" />
        <span className="text-xs font-bold text-white">AI质量评估</span>
        <span className="text-[9px] text-[#99E7FF] ml-auto">实时</span>
      </div>
      <div className="p-4 space-y-3">
        {/* Metric bars */}
        {[
          { label: 'Punctuality', value: aiQuality.punctuality, unit: '%', color: aiQuality.punctuality >= 95 ? 'text-emerald-600 bg-emerald-500' : aiQuality.punctuality >= 90 ? 'text-amber-600 bg-amber-500' : 'text-red-600 bg-red-500' },
          { label: 'Completion Quality', value: aiQuality.completionQuality, unit: '%', color: aiQuality.completionQuality >= 90 ? 'text-emerald-600 bg-emerald-500' : aiQuality.completionQuality >= 80 ? 'text-amber-600 bg-amber-500' : 'text-red-600 bg-red-500' },
        ].map((m, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-medium text-slate-600">{m.label}</span>
              <span className={`text-[10px] font-bold ${m.color.split(' ')[0]}`}>{m.value}{m.unit}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className={`${m.color.split(' ')[1]} h-2 rounded-full`} style={{ width: `${m.value}%` }} />
            </div>
          </div>
        ))}

        {/* Client Satisfaction Stars */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium text-slate-600">客户满意度</span>
            <span className="text-[10px] font-bold text-amber-600">{aiQuality.clientSatisfaction}/5</span>
          </div>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} className={`w-3.5 h-3.5 ${n <= Math.floor(aiQuality.clientSatisfaction) ? 'text-amber-400 fill-amber-400' : n <= aiQuality.clientSatisfaction ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
            ))}
            <span className="text-[9px] text-slate-400 ml-1">4.6 avg</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 pt-3 space-y-2">
          {/* 护理主管 Feedback */}
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-[#CCF0FE] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Shield className="w-3 h-3 text-[#0B3550]" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-600">护理主管</p>
              <p className="text-[9px] text-slate-500 leading-relaxed">{aiQuality.ndFeedback}</p>
            </div>
          </div>

          {/* 个案管理 Feedback */}
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-[#99E7FF] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Users className="w-3 h-3 text-[#00263F]" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-600">个案管理</p>
              <p className="text-[9px] text-slate-500 leading-relaxed">{aiQuality.cmFeedback}</p>
            </div>
          </div>
        </div>

        {/* AI建议 */}
        <div className="bg-[#CCF0FE] rounded-xl p-3 border border-[#99E7FF] flex items-start gap-2">
          <Zap className="w-3.5 h-3.5 text-[#006F80] flex-shrink-0 mt-0.5 animate-pulse" />
          <div>
            <p className="text-[10px] font-bold text-[#0B3550] mb-0.5">AI建议</p>
            <p className="text-[9px] text-[#00263F] leading-relaxed">{aiQuality.summary}</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
  );
};

/* --------------- CANDIDATE TAB --------------- */

const CANDIDATE_IDS = [2];

const ELITE_GOLD_HEADER = 'bg-gradient-to-r from-[#006F80] to-[#0B3550]';

const InitialAssessmentPage = ({
  pid,
  onBack,
  onSubmitted,
}: {
  pid: number;
  onBack: () => void;
  onSubmitted: (pid: number) => void;
}) => {
  const p = PENDING_PATIENTS.find((x) => x.id === pid)!;
  const autoSubmittedRef = useRef(false);
  const handleComplete = useCallback(() => {
    onSubmitted(pid);
    onBack();
  }, [onSubmitted, onBack, pid]);
  const { uploading, uploadProgress, uploadStage, done, handleSubmit } = useEliteUploadSubmit(handleComplete);
  const { fillStep, scrollRef, scrollComplete, filling, waiting } = useEliteFormFillAnimation(
    ASSESSMENT_FILL_MAX,
    true,
    ASSESSMENT_FILL_TIMING,
  );

  useEffect(() => {
    if (!scrollComplete || uploading || done || autoSubmittedRef.current) return;
    autoSubmittedRef.current = true;
    const t = window.setTimeout(() => handleSubmit(), 180);
    return () => clearTimeout(t);
  }, [scrollComplete, uploading, done, handleSubmit]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
      <div className={`${ELITE_GOLD_HEADER} px-4 py-3 flex items-center gap-3 flex-shrink-0`}>
        <button onClick={onBack} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30">
          <ChevronRight className="w-4 h-4 text-white rotate-180" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white leading-snug">Initial 患者评估</p>
          <p className="text-[9px] text-[#99E7FF] truncate">{p.name} &middot; {p.hospital}</p>
        </div>
        {waiting && (
          <span className="text-[9px] text-white/80 font-medium flex-shrink-0">Preparing…</span>
        )}
        {filling && (
          <span className="text-[9px] text-white/80 font-medium flex-shrink-0">Filling…</span>
        )}
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 min-h-0">
        <div className="space-y-3 text-[10px]">
          <PendingRegistrationAssessmentForm patient={p} layout="mobile" fillStep={fillStep} />
        </div>
      </div>
      <EliteFormSubmitFooter
        uploading={uploading}
        uploadProgress={uploadProgress}
        uploadStage={uploadStage}
        done={done}
        doneLabel="Assessment Submitted"
        onSubmit={handleSubmit}
        disabled={!scrollComplete}
      />
    </div>
  );
};

const CarePlanPage = ({
  pid,
  onBack,
  onSubmitted,
}: {
  pid: number;
  onBack: () => void;
  onSubmitted: (pid: number) => void;
}) => {
  const p = PENDING_PATIENTS.find((x) => x.id === pid)!;
  const [carePlanData, setCarePlanData] = useState<CarePlanData>(() => getCarePlanDefaults(p));
  const autoSubmittedRef = useRef(false);
  const handleComplete = useCallback(() => {
    onSubmitted(pid);
    onBack();
  }, [onSubmitted, onBack, pid]);
  const { uploading, uploadProgress, uploadStage, done, handleSubmit } = useEliteUploadSubmit(handleComplete);
  const { fillStep, scrollRef, scrollComplete, filling, waiting } = useEliteFormFillAnimation(
    CARE_PLAN_FILL_MAX,
    true,
    CARE_PLAN_FILL_TIMING,
  );

  useEffect(() => {
    if (!scrollComplete || uploading || done || autoSubmittedRef.current) return;
    autoSubmittedRef.current = true;
    const t = window.setTimeout(() => handleSubmit(), 180);
    return () => clearTimeout(t);
  }, [scrollComplete, uploading, done, handleSubmit]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
      <div className={`${ELITE_GOLD_HEADER} px-4 py-3 flex items-center gap-3 flex-shrink-0`}>
        <button onClick={onBack} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30">
          <ChevronRight className="w-4 h-4 text-white rotate-180" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white">照护计划</p>
          <p className="text-[9px] text-[#99E7FF] truncate">{p.name} &middot; D/C {p.dischargeDate}</p>
        </div>
        {waiting && (
          <span className="text-[9px] text-white/80 font-medium flex-shrink-0">Preparing…</span>
        )}
        {filling && (
          <span className="text-[9px] text-white/80 font-medium flex-shrink-0">Filling…</span>
        )}
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 min-h-0">
        <div className="space-y-3 text-[10px]">
          <PendingRegistrationCarePlanForm
            patient={p}
            data={carePlanData}
            onDataChange={setCarePlanData}
            layout="mobile"
            fillStep={fillStep}
          />
        </div>
      </div>
      <EliteFormSubmitFooter
        uploading={uploading}
        uploadProgress={uploadProgress}
        uploadStage={uploadStage}
        done={done}
        doneLabel="Care Plan Submitted"
        onSubmit={handleSubmit}
        disabled={!scrollComplete}
      />
    </div>
  );
};

const Elites待入组Tab: FC = () => {
  const [pg, setPg] = useState("list");
  const [selPid, setSelPid] = useState<number | null>(null);
  const [submittedAssessments, setSubmittedAssessments] = useState<Set<number>>(() => new Set());
  const [submittedCarePlans, setSubmittedCarePlans] = useState<Set<number>>(() => new Set());

  const markAssessmentSubmitted = useCallback((pid: number) => {
    setSubmittedAssessments((prev) => new Set(prev).add(pid));
  }, []);

  const markCarePlanSubmitted = useCallback((pid: number) => {
    setSubmittedCarePlans((prev) => new Set(prev).add(pid));
  }, []);

  const candidates = CANDIDATE_IDS
    .map(id => PENDING_PATIENTS.find(p => p.id === id))
    .filter((x): x is NonNullable<typeof x> => x != null);

  if (pg === "assessment" && selPid) {
    return (
      <InitialAssessmentPage
        pid={selPid}
        onBack={() => { setPg("list"); setSelPid(null); }}
        onSubmitted={markAssessmentSubmitted}
      />
    );
  }
  if (pg === "careplan" && selPid) {
    return (
      <CarePlanPage
        pid={selPid}
        onBack={() => { setPg("list"); setSelPid(null); }}
        onSubmitted={markCarePlanSubmitted}
      />
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2"><ClipboardCheck className="w-4 h-4 text-[#006F80]" /> 待入组</h3>
        <span className="text-[10px] text-slate-400">{candidates.length} pending</span>
      </div>
      <div className="space-y-3">
        {candidates.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <PatientAvatar patientId={p.id} size={40} />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-bold text-slate-800">{p.name}</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{p.gender === "M" ? "\u2642" : "\u2640"} {p.age} yrs \u00b7 {p.hospital}</p>
                  <p className="text-[9px] font-semibold text-slate-600 mt-0.5 line-clamp-1">{p.diagnosis}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {(() => {
                  const iaSubmitted = submittedAssessments.has(p.id);
                  return (
                    <button
                      type="button"
                      disabled={iaSubmitted}
                      onClick={() => { if (!iaSubmitted) { setSelPid(p.id); setPg("assessment"); } }}
                      className={`flex-1 text-[10px] font-semibold py-2 rounded-xl transition-colors flex items-center justify-center gap-1 ${
                        iaSubmitted
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-[#006F80] text-white hover:bg-[#0B3550]'
                      }`}
                    >
                      <ClipboardList className="w-3.5 h-3.5" />
                      {iaSubmitted ? 'Assessment Done' : 'Initial Assessment'}
                    </button>
                  );
                })()}
                <button
                  type="button"
                  disabled={submittedCarePlans.has(p.id)}
                  onClick={() => { if (!submittedCarePlans.has(p.id)) { setSelPid(p.id); setPg("careplan"); } }}
                  className={`flex-1 text-[10px] font-semibold py-2 rounded-xl transition-colors flex items-center justify-center gap-1 ${
                    submittedCarePlans.has(p.id)
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-[#0B3550] text-white hover:bg-[#00263F]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  {submittedCarePlans.has(p.id) ? 'Care Plan Done' : 'Care Plan'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const ElitesPatientsTab: FC = () => {
  const { user } = useAuth();
  const visibleIds = user ? getVisiblePatientIds(user.role, user.account) : null;
  const patientsSummary = usePatientStore(s => s.patientsSummary);
  const alertActive = usePatientStore(s => s.alertActive);
  const myPatients = (visibleIds ? patientsSummary.filter(p => visibleIds.includes(p.id)) : patientsSummary).sort((a, b) => (a.id === 2 ? -1 : b.id === 2 ? 1 : a.id - b.id));
  const TODAY = DEMO_CARE_PLAN_DATE;
  const [selectedPid, setSelectedPid] = useState<number | null>(null);
  const carePlans = usePatientStore(s => s.carePlans);
  const taskTimes = useCollaborationStore(s => s.eliteTaskTimes);
  const carePlanStatus = useCollaborationStore(s => s.carePlanStatus);
  const setEliteTaskClockIn = useCollaborationStore(s => s.setEliteTaskClockIn);
  const setEliteTaskClockOut = useCollaborationStore(s => s.setEliteTaskClockOut);
  const setCarePlanTaskStatus = useCollaborationStore(s => s.setCarePlanTaskStatus);
  const setEliteCareLogFields = useCollaborationStore(s => s.setEliteCareLogFields);
  const setEliteVoiceText = useCollaborationStore(s => s.setEliteVoiceText);
  const appendSubmittedCareLog = useCollaborationStore(s => s.appendSubmittedCareLog);
  const careLogFields = useCollaborationStore(s => (selectedPid !== null ? (s.eliteCareLogs[selectedPid] ?? EMPTY_CARE_LOG) : EMPTY_CARE_LOG));
  const voiceText = useCollaborationStore(s => (selectedPid !== null ? (s.eliteVoiceText[selectedPid] ?? '') : ''));
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const voiceTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingDurationTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingStart = useRef<number>(0);

  const typeMap: Record<string, string> = {
    medication: 'med', monitoring: 'monitor', therapy: 'exercise',
    nurse_visit: 'visit', doctor_consult: 'visit', care_worker: 'visit',
  };
  const typeColor: Record<string, string> = {
    med: 'bg-[#CCF0FE] text-[#006F80]', monitor: 'bg-amber-100 text-amber-700',
    exercise: 'bg-[#CCF0FE] text-[#006F80]', visit: 'bg-[#99E7FF] text-[#00263F]',
  };

  const getTasks = (pid: number) =>
    getTodayActivities(carePlans[pid], pid, TODAY, carePlanStatus).filter(a => a.type !== 'self_care');

  const parseEliteTaskKey = (taskKey: string) => {
    const firstDash = taskKey.indexOf('-');
    const secondDash = taskKey.indexOf('-', firstDash + 1);
    if (firstDash <= 0 || secondDash <= firstDash) return null;
    return {
      patientId: parseInt(taskKey.slice(0, firstDash), 10),
      time: taskKey.slice(firstDash + 1, secondDash),
      activity: taskKey.slice(secondDash + 1),
    };
  };

  const vitals = usePatientStore(s => s.vitals);

  // ── 每位患者的AI建议 (NEWS2-driven, all visible patients) ──
  const patientAI = useMemo<Record<number, { summary: string; recommendations: string[] }>>(() => {
    const map: Record<number, { summary: string; recommendations: string[] }> = {};
    myPatients.forEach(p => {
      map[p.id] = buildPatientAiBrief(p, vitals[p.id], alertActive && p.id === 1);
    });
    return map;
  }, [myPatients, vitals, alertActive]);

  const handleClockIn = (taskKey: string) => {
    setEliteTaskClockIn(taskKey, getDemoClockTime());
    const parsed = parseEliteTaskKey(taskKey);
    if (parsed) {
      setCarePlanTaskStatus(carePlanTaskKey(parsed.patientId, TODAY, parsed.time, parsed.activity), 'in_progress');
    }
  };
  const handleClockOut = (taskKey: string) => {
    setEliteTaskClockOut(taskKey, getDemoClockTime());
    const parsed = parseEliteTaskKey(taskKey);
    if (parsed) {
      setCarePlanTaskStatus(carePlanTaskKey(parsed.patientId, TODAY, parsed.time, parsed.activity), 'completed');
    }
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState('');

  // ── Per-patient care log data ──
  type PatientLogFields = { condition: string; meds: string; response: string; mental: string; io: string; diet: string; incidents: string };
  type PatientLogData = { ttsSrc: string | null; phrases: string[]; fields: PatientLogFields };
  const patientLogData = useMemo<Record<number, PatientLogData>>(() => ({
    1: {
      ttsSrc: '/care-log-tts.mp3',
      phrases: ['Patient Cheung Wai Man, 78-year-old male, HF NYHA III · CKD 3 · T2DM · AF. ', 'Vitals: BP 118/72, HR 82 AF, SpO₂ 95% on room air, Temp 36.6°C. ', 'AM meds given at 8:02 — Sacubitril/Valsartan, Bisoprolol, Furosemide, Spironolactone, Apixaban, Metformin. Tolerated well. ', 'Daily weight 68.0kg — stable, within target range. Pedal oedema trace. ', 'Patient reports no orthopnoea, mild exertional dyspnoea. No chest pain. Pain 1/10. ', 'Mental: alert, oriented ×3. Mood calm. Wife present and engaged. ', 'I/O: intake 1,380mL, output 1,650mL — net negative 270mL. Fluid restriction 1.5L compliant. ', 'Renal panel: Cr 138, K⁺ 3.9. BNP 850 trending down. Continue GDMT. ', 'No acute events. Continue current plan. End of report.'],
      fields: { condition: 'HF assessment: bibasilar crackles improved. Pedal oedema trace bilaterally — significantly improved from 1+ at discharge. JVP 3cm. Weight 68.0kg stable. No orthopnoea. SpO₂ 95% on room air.', meds: 'Sacubitril/Valsartan 97/103mg BID, Bisoprolol 5mg daily, Furosemide 40mg BID, Spironolactone 25mg daily, Apixaban 5mg BID, Metformin 500mg BID — all 6 medications confirmed. No missed doses. Adherence 94%.', response: 'Full HF assessment completed. Vital signs stable: BP 118/72, HR 82 AF rate-controlled, SpO₂ 95%. I/O net negative (-270mL). Renal panel stable. Continue current GDMT per Dr. Chan Chi Keung.', mental: 'Alert and oriented ×3. GCS 15. Mood calm and positive. Wife (primary caregiver) demonstrated correct I/O tracking and daily weight measurement. Good understanding of fluid restriction and sodium limits.', io: '24h intake: 1,380mL (within 1.5L restriction). 24h output: 1,650mL. Net balance: -270mL — consistent with diuretic therapy. Weight 68.0kg. Continue daily weight + strict I/O.', diet: 'Low-sodium diet (<2g/day) adhered to. Breakfast: oatmeal with fruit. Lunch: steamed fish with vegetables. Appetite good. Using measured water bottle for fluid tracking — wife verified accurate.', incidents: 'No falls, no acute decompensation. No medication errors. No new arrhythmia symptoms. All HF monitoring per protocol. Renal panel q3d. BNP recheck in 48h.' },
    },
    2: {
      ttsSrc: '/care-log-tts-2.mp3',
      phrases: ['Patient Wong Chi Ming, 72-year-old male, COPD. ', 'Vitals: BP 134/84, HR 88, SpO₂ 94%, Temp 37.1°C. ', 'Inhaler Stiolto Respimat — 2 puffs administered, technique correct. ', 'Pursed-lip breathing exercises completed. Lungs clear bilaterally. ', 'No wheeze, no increased sputum. ', 'Patient reports mild dyspnea on exertion only. ', 'Mental: alert and oriented. Mood stable. ', 'I/O: intake adequate. Urine output normal. ', 'No acute events to report. Continue current plan.'],
      fields: { condition: 'Breath sounds clear bilaterally, no wheeze or crackles. Pursed-lip breathing technique demonstrated correctly. SpO₂ stable at 94% on room air. Mild exertional dyspnea reported — consistent with baseline.', meds: 'Stiolto Respimat (Tiotropium/Olodaterol) 2.5/2.5mcg — 2 puffs administered. Inhaler technique observed and confirmed correct. No rescue inhaler needed today.', response: 'Routine COPD monitoring visit. SpO₂ checked ×3 — all readings ≥93%. Breathing exercises supervised. No escalation needed. Patient independent with inhaler.', mental: 'Alert and oriented ×3. Mood euthymic. Engaged in conversation. No cognitive deficits noted. Good understanding of COPD self-management.', io: 'Oral intake adequate. Hydration encouraged — patient reports drinking ~1.2L. Urine output normal. No signs of fluid retention.', diet: 'Regular diet tolerated. Appetite good. Soft foods preferred due to dentition. No dietary restrictions beyond low-sodium preference.', incidents: 'No falls, no acute exacerbations. No medication errors. No equipment issues. All routine checks within expected parameters.' },
    },
    3: {
      ttsSrc: '/care-log-tts-3.mp3',
      phrases: ['Patient Lam Ka Chun, 45-year-old male, community-acquired pneumonia. ', 'Vitals: BP 118/74, HR 72, SpO₂ 97%, Temp 36.8°C. ', 'Breath sounds: crackles RLL improving. Cough productive — sputum decreasing. ', 'Oral Levofloxacin Day 3 tolerated without GI upset. ', 'Patient reports feeling much better than admission. ', 'Mental: alert and oriented. Mood positive. ', 'Hydration and appetite improving. ', 'No acute events. Continue current plan. End of report.'],
      fields: { condition: 'CAP Day 3 — afebrile x48h. SpO₂ 97% RA. RR 18. Crackles RLL improving. Cough improved.', meds: 'Levofloxacin 750mg PO daily — Day 3 of 7. Compliance confirmed. No adverse effects.', response: 'RN home visit completed. Vitals stable. Patient ambulating independently. Educated on completing full antibiotic course.', mental: 'Alert ×3. Mood improved. Good understanding of when to escalate.', io: 'Oral intake ~1.4L. Output normal. No dehydration signs.', diet: 'Regular diet tolerating well. Encouraged protein intake for recovery.', incidents: 'No desaturation. No acute events. Continue q2d RN visits per plan.' },
    },
    4: {
      ttsSrc: null,
      phrases: ['Patient Lau Suk Yee, 81-year-old female, complicated UTI. ', 'Vitals: BP 138/84, HR 88, SpO₂ 96%, Temp 36.7°C. ', 'AMTS 9/10 — improved from admission. Urinary symptoms minimal. ', 'Oral Ciprofloxacin Day 3 — tolerated. ', 'Family monitoring for confusion. Hydration encouraged. ', 'No acute events. End of report.'],
      fields: { condition: 'UTI Day 3 — afebrile. Dysuria resolved. No suprapubic tenderness. AMTS 9/10.', meds: 'Ciprofloxacin 500mg BID — Day 3 of 7. All doses confirmed.', response: 'Routine RN visit. Vitals stable. Mental status improved. Continue oral antibiotics.', mental: 'AMTS 9/10. Alert. Family monitoring for confusion per protocol.', io: 'Intake ~1.2L. Output adequate.', diet: 'Regular diet. Fluid targets explained.', incidents: 'No falls. No recurrence of confusion.' },
    },
    5: {
      ttsSrc: '/care-log-tts-5.mp3',
      phrases: ['Patient Ho Tai Wai, 72-year-old male, cellulitis left lower limb. ', 'Vitals: BP 136/82, HR 78, SpO₂ 97%, Temp 36.6°C. ', 'Erythema 18cm — down from 22cm. Pain 2/10. ', 'Oral Clindamycin Day 3. Leg elevated. ', 'Wife assisting with dressing changes. ', 'No acute events. End of report.'],
      fields: { condition: 'Cellulitis LLL — erythema improving. Pain 2/10. No streaking. Wound clean and dry.', meds: 'Clindamycin 300mg QID PO — Day 3 of 9. Adherence confirmed.', response: 'Wound care and vitals completed. Continue elevation and antibiotics.', mental: 'Alert ×3. Cooperative with care. Wife engaged.', io: 'Intake adequate. Output normal.', diet: 'High-protein diet for healing.', incidents: 'No spread. No systemic signs of infection.' },
    },
    6: {
      ttsSrc: null,
      phrases: ['Patient Ng Siu Wan, 68-year-old female, DVT left leg on Warfarin. ', 'Vitals: BP 132/80, HR 74, SpO₂ 97%, Temp 36.5°C. ', 'INR 2.1 — therapeutic. Calf 38cm. Pain 1/10. ', 'Compression stockings worn 18 hours yesterday. ', 'No bleeding signs. ', 'No acute events. End of report.'],
      fields: { condition: 'DVT — calf 38cm (↓). Pain 1/10. No PE symptoms. INR therapeutic at 2.1.', meds: 'Warfarin 5mg daily — INR 2.1. No missed doses.', response: 'POCT INR 2.1. Continue Warfarin. Reinforced compression stocking use and bleeding precautions.', mental: 'Alert ×3. Good anticoagulation education recall.', io: 'Intake/output normal.', diet: 'Consistent diet regarding vitamin K explained.', incidents: 'No bleeding. No falls.' },
    },
    7: (() => {
      const bundle = buildPatient1EliteVoiceBundle(alertActive);
      return { ttsSrc: null, phrases: bundle.phrases, fields: bundle.fields };
    })(),
  }), [alertActive]);

  const startRecording = () => {
    const data = patientLogData[selectedPid!];
    if (!data) return;
    setIsRecording(true);
    recordingStart.current = Date.now();
    recordingDurationTimer.current = setInterval(() => {
      setRecordingTime(Date.now() - recordingStart.current);
    }, 1000);
    if (selectedPid !== null) setEliteVoiceText(selectedPid, '');
    if (data.ttsSrc && audioRef.current) {
      audioRef.current.src = data.ttsSrc;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
    let phraseIdx = 0, charIdx = 0;
    voiceTimer.current = setInterval(() => {
      if (phraseIdx < data.phrases.length) {
        if (charIdx < data.phrases[phraseIdx].length) {
          const nextChar = data.phrases[phraseIdx][charIdx];
          if (selectedPid !== null) {
            setEliteVoiceText(selectedPid, `${useCollaborationStore.getState().eliteVoiceText[selectedPid] ?? ''}${nextChar}`);
          }
          charIdx++;
        } else { phraseIdx++; charIdx = 0; }
      } else { stopRecording(); }
    }, 22);
  };

  const stopRecording = () => {
    if (voiceTimer.current) { clearInterval(voiceTimer.current); voiceTimer.current = null; }
    if (recordingDurationTimer.current) { clearInterval(recordingDurationTimer.current); recordingDurationTimer.current = null; }
    if (audioRef.current) { audioRef.current.pause(); }
    setIsRecording(false);
    setRecordingTime(0);
  };

  // AI自动填充结构化字段 after recording
  useEffect(() => {
    if (!isRecording && voiceText && !uploading && selectedPid) {
      const data = patientLogData[selectedPid];
      if (!data) return;
      setTimeout(() => { if (selectedPid !== null) setEliteCareLogFields(selectedPid, data.fields); }, 600);
    }
  }, [isRecording, voiceText, uploading, selectedPid, patientLogData]);

  // Upload simulation
  const handleSubmitLogs = () => {
    if (selectedPid === null) return;
    const fields = careLogFields;
    const detailParts = [fields.condition, fields.meds, fields.response, fields.mental, fields.io, fields.diet, fields.incidents]
      .map(s => s.trim())
      .filter(Boolean);
    const detail = detailParts.join(' ') || voiceText.trim() || 'Care visit completed and documented.';
    const logTime = getDemoClockTime();
    const patientName = myPatients.find(p => p.id === selectedPid)?.name ?? `Patient ${selectedPid}`;

    setUploading(true);
    setUploadProgress(0);
    const stages = ['Encrypting data...', 'Uploading to HK health cloud...', 'Verifying against care plan...', '护理主管 review...', 'Sync complete ✓'];
    let p = 0;
    const iv = setInterval(() => {
      p += 2 + Math.floor(Math.random() * 7);
      if (p >= 100) { p = 100; clearInterval(iv); }
      setUploadProgress(p);
      setUploadStage(stages[Math.min(Math.floor(p / 20), 4)]);
      if (p >= 100) {
        appendSubmittedCareLog(selectedPid, {
          date: TODAY,
          time: logTime,
          type: 'Elite 照护记录',
          detail: `${patientName}: ${detail.slice(0, 480)}`,
          author: user?.name ?? 'Sarah Leung',
          role: 'RN',
          status: alertActive && selectedPid === 1 ? 'escalated' : 'completed',
        });
        setTimeout(() => { setSelectedPid(null); setUploading(false); }, 1200);
      }
    }, 180);
  };

  useEffect(() => () => { if (voiceTimer.current) clearInterval(voiceTimer.current); }, []);

  // Check if all tasks for selected patient are clocked in+out
  const selectedPatient = selectedPid !== null ? patientsSummary.find(p => p.id === selectedPid) : null;
  const tasks = selectedPid !== null ? getTasks(selectedPid) : [];
  const allTasksDone = tasks.length > 0 && tasks.every(t => {
    const key = `${selectedPid}-${t.time}-${t.activity}`;
    return taskTimes[key]?.clockIn && taskTimes[key]?.clockOut;
  });

  // Reset care logs state when modal opens
  useEffect(() => {
    if (allTasksDone && selectedPid !== null) {
      setEliteVoiceText(selectedPid, '');
      setEliteCareLogFields(selectedPid, EMPTY_CARE_LOG);
      setUploading(false);
      setUploadProgress(0);
      setUploadStage('');
    }
  }, [allTasksDone, selectedPid, setEliteCareLogFields, setEliteVoiceText]);

  // Patient list view
  if (selectedPid === null) {
    return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-shrink-0 px-4 pt-4 pb-2 bg-slate-50 z-10 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2"><Users className="w-4 h-4 text-[#006F80]" /> 我的患者</h3>
          <span className="text-[10px] text-slate-400">{myPatients.length} assigned</span>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-slate-200">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input type="text" placeholder="Search patients..." className="flex-1 text-xs text-slate-700 placeholder-slate-400 bg-transparent outline-none" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0 px-4 pb-4 space-y-3">
        {myPatients.map((p) => {
          const isAlert = !!p.alertVital && p.alertVital.length > 0;
          const sev = p.newsTier;
          const isCrit = sev === 'high';
          const isAttn = sev === 'medium' || p.newsRedScore;
          const patientTasks = getTasks(p.id);
          const diagTag = DIAGNOSIS_TAG[p.diagnosis] ?? 'bg-slate-50 text-slate-600 border-slate-200';
          const ai = patientAI[p.id];
          return (
          <div key={p.id} onClick={() => setSelectedPid(p.id)} className={`bg-white rounded-xl border shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${isCrit ? 'border-red-400 critical-pulse' : isAlert ? 'border-amber-400 alert-pulse' : 'border-slate-100'}`}>
            <div className="p-4 pb-3">
              <div className="flex items-center gap-3 mb-3">
                <PatientAvatar patientId={p.id} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">{p.name}</span>
                    {isAlert && <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full ${isCrit ? 'bg-red-100 text-red-600 alert-blink' : p.newsRedScore ? 'bg-orange-100 text-orange-600' : 'bg-amber-100 text-amber-600'}`}>{isCrit ? 'NEWS HIGH' : p.newsRedScore ? 'RED SCORE' : isAttn ? 'NEWS MED' : 'ALERT'}</span>}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-slate-400">{p.gender === 'M' ? '♂' : '♀'} {p.age} yrs</span>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${diagTag}`}>{p.diagnosis}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                {[{ icon: Thermometer, value: `${p.temp}°`, alert: p.alertVital?.includes('temp') }, { icon: Heart, value: `${p.hr}`, alert: p.alertVital?.includes('hr') }, { icon: Activity, value: `${p.bpSystolic}/${p.bpDiastolic}`, alert: p.alertVital?.includes('bp') }, { icon: Droplets, value: `${p.spo2}%`, alert: p.alertVital?.includes('spo2') }].map((v, vi) => (
                  <span key={vi} className={`inline-flex items-center gap-1 ${v.alert ? (isCrit ? 'text-red-600 font-extrabold' : 'text-amber-600 font-extrabold') : 'text-slate-600 font-medium'}`}>
                    <v.icon className={`w-3 h-3 ${v.alert ? (isCrit ? 'text-red-500' : 'text-amber-500') : 'text-slate-400'}`} />{v.value}
                  </span>
                ))}
              </div>
              <p className="text-[9px] text-slate-500 mt-2">NEWS {p.newsScore} · {p.newsMonitoringLabel}{p.newsRedScore ? ' · RED score' : ''}</p>
            </div>
            {patientTasks.length > 0 && (
              <div className="border-t border-slate-100 px-4 py-2.5 bg-slate-50/50">
                <div className="flex items-center gap-1.5 mb-1.5"><ClipboardList className="w-3 h-3 text-slate-400" /><span className="text-[10px] font-semibold text-slate-500">Today's Tasks</span><span className="text-[9px] text-slate-400">({patientTasks.length})</span></div>
                <div className="space-y-1">{patientTasks.slice(0, 3).map((t, j) => (<div key={j} className="flex items-center gap-2 text-[10px]"><span className="font-bold text-slate-400 w-10 flex-shrink-0">{t.time}</span><span className="text-slate-700 flex-1 truncate">{t.activity}</span><span className={`text-[8px] font-medium px-1 py-0.5 rounded ${typeColor[typeMap[t.type]] || 'bg-slate-100 text-slate-600'}`}>{typeMap[t.type]}</span></div>))}{patientTasks.length > 3 && <p className="text-[9px] text-slate-400 pl-12">+{patientTasks.length - 3} more</p>}</div>
              </div>
            )}
            {ai && (
              <div className="border-t border-slate-100 bg-gradient-to-r from-[#CCF0FE] to-[#CCF0FE] px-4 py-3">
                <div className="flex items-start gap-2 mb-2"><Brain className="w-3.5 h-3.5 text-[#006F80] flex-shrink-0 mt-0.5" /><div><p className="text-[9px] font-bold text-[#0B3550] mb-0.5">AI评估</p><p className="text-[9px] text-slate-600 leading-relaxed">{ai.summary}</p></div></div>
              </div>
            )}
          </div>
          );
        })}
      </div>
    </div>
    );
  }

  // ── Patient Task Detail View ──
  const p = selectedPatient!;
  const isAlert = !!p.alertVital && p.alertVital.length > 0;
  const isCrit = p.newsTier === 'high';
  const isAttn = p.newsTier === 'medium' || p.newsRedScore;
  const diagTag = DIAGNOSIS_TAG[p.diagnosis] ?? 'bg-slate-50 text-slate-600 border-slate-200';
  const doneCount = tasks.filter(t => { const k = `${selectedPid}-${t.time}-${t.activity}`; return taskTimes[k]?.clockIn && taskTimes[k]?.clockOut; }).length;

  return (
  <div className="flex-1 flex flex-col min-h-0">
    {/* Patient header + progress — fixed while tasks scroll */}
    <div className="flex-shrink-0 px-4 pt-4 pb-2 bg-slate-50 z-10 space-y-4">
      {/* Back + Patient header */}
      <div className="flex items-center gap-3">
        <button onClick={() => { setSelectedPid(null); }} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 hover:bg-slate-50">
          <ChevronRight className="w-4 h-4 text-slate-500 rotate-180" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2"><span className="text-sm font-bold text-slate-800">{p.name}</span>{isAlert && <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full ${isCrit ? 'bg-red-100 text-red-600 alert-blink' : p.newsRedScore ? 'bg-orange-100 text-orange-600' : 'bg-amber-100 text-amber-600'}`}>{isCrit ? 'NEWS HIGH' : p.newsRedScore ? 'RED SCORE' : 'NEWS MED'}</span>}</div>
          <div className="flex items-center gap-1.5 mt-0.5"><span className="text-[10px] text-slate-400">{p.gender === 'M' ? '♂' : '♀'} {p.age} yrs</span><span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${diagTag}`}>{p.diagnosis}</span></div>
          <p className="text-[9px] text-slate-500 mt-1">NEWS {p.newsScore} · {p.newsMonitoringLabel}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-1.5"><span className="text-[10px] font-semibold text-slate-500">任务进度</span><span className="text-[10px] font-bold text-[#006F80]">{doneCount}/{tasks.length}</span></div>
        <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-gradient-to-r from-[#06B0EF] to-[#006F80] h-2 rounded-full transition-all" style={{ width: `${tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0}%` }} /></div>
      </div>
    </div>

    {/* Scrollable task list */}
    <div className="flex-1 overflow-y-auto min-h-0 space-y-2">
      {tasks.map((t, i) => {
        const key = `${selectedPid}-${t.time}-${t.activity}`;
        const times = taskTimes[key] || {};
        const hasIn = !!times.clockIn;
        const hasOut = !!times.clockOut;
        const isComplete = hasIn && hasOut;
        const schedMin = parseInt(t.time.split(':')[0]) * 60 + parseInt(t.time.split(':')[1]);
        const inMin = times.clockIn ? parseInt(times.clockIn.split(':')[0]) * 60 + parseInt(times.clockIn.split(':')[1]) : 0;
        const isLate = hasIn && (inMin - schedMin) >= 5;
        return (
        <div key={i} className={`bg-white rounded-xl border shadow-sm overflow-hidden ${isComplete ? 'border-[#99E7FF]' : 'border-slate-100'}`}>
          <div className="p-3">
            <div className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${isComplete ? 'bg-[#006F80] text-white' : hasIn ? 'bg-[#06B0EF] text-white' : 'bg-slate-100 text-slate-400'}`}>
                {isComplete ? <CheckCircle2 className="w-4 h-4" /> : hasIn ? <Clock className="w-4 h-4" /> : <span className="text-[9px] font-bold">{i + 1}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold text-slate-800">{t.activity}</span>
                  <span className={`text-[8px] font-medium px-1.5 py-0.5 rounded ${typeColor[typeMap[t.type]] || 'bg-slate-100 text-slate-600'}`}>{typeMap[t.type]}</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">{t.detail}</p>
                {/* Timing row */}
                <div className="flex items-center gap-3 mt-2 text-[9px]">
                  <span className="text-slate-400 flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> Sched: {t.time}</span>
                  {hasIn && (
                    <span className={`flex items-center gap-1 font-semibold ${isLate ? 'text-red-600' : 'text-[#006F80]'}`}>
                      ▶ In: {times.clockIn}
                      {isLate && <span className="text-[8px] font-extrabold text-red-600 alert-blink">+{inMin - schedMin}m</span>}
                    </span>
                  )}
                  {hasOut && <span className="text-[#006F80] font-semibold flex items-center gap-1">✓ Done: {times.clockOut}</span>}
                </div>
              </div>
            </div>
          </div>
          {/* Action buttons */}
          {!isComplete && (
            <div className="border-t border-slate-50 px-3 py-2 bg-slate-50/50 flex items-center gap-2">
              {!hasIn ? (
                <button onClick={() => handleClockIn(key)} className="flex-1 text-[10px] font-semibold bg-[#006F80] text-white py-1.5 rounded-lg hover:bg-[#0B3550] transition-colors flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" /> Clock In
                </button>
              ) : (
                <button onClick={() => handleClockOut(key)} className="flex-1 text-[10px] font-semibold bg-[#006F80] text-white py-1.5 rounded-lg hover:bg-[#0B3550] transition-colors flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Mark Done
                </button>
              )}
            </div>
          )}
        </div>
        );
      })}

    {/* Auto-show 照护记录s modal when all tasks complete */}
    {allTasksDone && (
      <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => {}}>
        <div className="bg-white rounded-2xl shadow-2xl w-[380px] max-h-[85vh] overflow-y-auto m-2 relative" onClick={e => e.stopPropagation()}>
          {/* Modal header */}
          <div className="sticky top-0 bg-gradient-to-r from-[#006F80] to-[#0B3550] px-5 py-4 flex items-center justify-between z-10 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-white" />
              <div>
                <span className="text-sm font-bold text-white">照护记录s</span>
                <p className="text-[9px] text-[#99E7FF]">{p.name} · Wed 6/18</p>
              </div>
            </div>
            <button onClick={() => { setSelectedPid(null); }} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30">
              <span className="text-white text-sm font-bold">✕</span>
            </button>
          </div>

          <div className="p-5 space-y-4">
            {/* Voice-to-Text — realistic animation */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-[#006F80]" /> NLP语音转文字
                </span>
                {isRecording && (
                  <span className="text-[9px] text-red-500 font-semibold animate-pulse flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500" /> Recording...
                  </span>
                )}
              </div>

              {/* Recording waveform animation */}
              {isRecording && (
                <div className="flex items-center justify-center gap-[2px] h-10 mb-3">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-[3px] bg-[#06B0EF] rounded-full"
                      style={{
                        animation: `waveform 0.6s ease-in-out infinite`,
                        animationDelay: `${i * 0.05}s`,
                        height: `${14 + Math.abs(Math.sin(i * 0.7)) * 20}px`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Text area with typing animation */}
              <div className="relative">
                <div className={`rounded-xl p-4 min-h-[100px] border-2 transition-colors ${isRecording ? 'border-[#06B0EF] bg-[#CCF0FE]/50' : voiceText ? 'border-slate-200 bg-slate-50' : 'border-slate-200 bg-slate-50'}`}>
                  {isRecording && !voiceText ? (
                    <div className="flex items-center gap-2 h-full">
                      <span className="w-2 h-2 bg-[#006F80] rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <span className="w-2 h-2 bg-[#006F80] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                      <span className="w-2 h-2 bg-[#006F80] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                      <span className="text-[10px] text-[#006F80] ml-2 font-medium">聆听中...</span>
                    </div>
                  ) : voiceText ? (
                    <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {voiceText}
                      {isRecording && <span className="inline-block w-[2px] h-[14px] bg-[#006F80] ml-0.5 animate-pulse align-middle" />}
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">Tap the microphone to start dictating your care report...</p>
                  )}
                </div>

                {/* Mic button */}
                <button
                  onClick={() => isRecording ? stopRecording() : startRecording()}
                  className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse shadow-red-300'
                      : 'bg-[#006F80] text-white hover:bg-[#0B3550] shadow-[#99E7FF]'
                  }`}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              </div>

              {isRecording && (
                <div className="mt-3 flex items-center gap-2 px-1">
                  <div className="flex-1 bg-slate-200 rounded-full h-1 overflow-hidden">
                    <div className="bg-[#006F80] h-1 animate-pulse" style={{ width: '100%' }} />
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono">
                    {String(Math.floor(recordingTime / 60000)).padStart(2,'0')}:{String(Math.floor((recordingTime % 60000) / 1000)).padStart(2,'0')}
                  </span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">结构化字段</span>
              {[
                { key: 'condition', label: 'Physical Condition', icon: Heart },
                { key: 'meds', label: 'Medication Status', icon: Pill },
                { key: 'response', label: 'Nursing Response', icon: Shield },
                { key: 'mental', label: 'Mental Status', icon: Brain },
                { key: 'io', label: 'Intake / Output', icon: GlassWater },
                { key: 'diet', label: 'Diet & Nutrition', icon: Apple },
                { key: 'incidents', label: 'Incidents', icon: AlertTriangle },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-[10px] font-semibold text-slate-600 flex items-center gap-1.5 mb-1">
                    <f.icon className="w-3 h-3 text-[#006F80]" /> {f.label}
                  </label>
                  <input
                    type="text"
                    value={careLogFields[f.key as keyof typeof careLogFields]}
                    onChange={e => selectedPid !== null && setEliteCareLogFields(selectedPid, { ...careLogFields, [f.key]: e.target.value })}
                    className="w-full bg-slate-50 rounded-lg px-3 py-2 text-[10px] text-slate-700 placeholder-slate-400 border border-slate-200 outline-none focus:border-[#06B0EF]"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmitLogs}
              disabled={uploading}
              className="w-full py-2.5 bg-[#006F80] text-white text-xs font-bold rounded-xl hover:bg-[#0B3550] transition-colors shadow-md shadow-[#99E7FF] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" /> Submit 照护记录s
            </button>

            {/* Hidden TTS audio */}
            <audio ref={audioRef} src="/care-log-tts.mp3" preload="auto" />

            {/* Upload progress overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center z-20">
                <div className="w-16 h-16 rounded-full border-4 border-[#CCF0FE] border-t-[#006F80] animate-spin mb-4" />
                <p className="text-sm font-bold text-slate-700 mb-1">{uploadProgress}%</p>
                <div className="w-48 bg-slate-100 rounded-full h-2 mb-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#06B0EF] to-[#006F80] h-2 rounded-full transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="text-[10px] text-slate-500">{uploadStage}</p>
                {uploadProgress >= 100 && (
                  <div className="flex items-center gap-2 mt-3 text-[#006F80] animate-[slideUp_0.3s_ease-out]">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-xs font-bold">照护记录 Synced</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )}

    {/* AI评估 */}
    {patientAI[p.id] && (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#0B3550] to-[#00263F] px-4 py-3 flex items-center gap-2">
          <Brain className="w-4 h-4 text-white" /><span className="text-xs font-bold text-white">AI评估</span>
        </div>
        <div className="p-4 space-y-2">
          <p className="text-[10px] text-slate-600 leading-relaxed">{patientAI[p.id].summary}</p>
          <div className="space-y-0.5">
            {patientAI[p.id].recommendations.map((rec, j) => (
              <div key={j} className="flex items-start gap-1.5"><span className="text-[8px] text-[#006F80] font-bold flex-shrink-0 mt-0.5">•</span><span className="text-[8px] text-slate-500 leading-relaxed">{rec}</span></div>
            ))}
          </div>
        </div>
      </div>
    )}
    </div>
  </div>
  );
};

const ElitesChatTab: FC = () => {
  const { user } = useAuth();
  const visibleIds = user ? getVisiblePatientIds(user.role, user.account) : null;
  const patientsSummary = usePatientStore(s => s.patientsSummary);
  const alertActive = usePatientStore(s => s.alertActive);
  const messagesByPatient = useCollaborationStore(s => s.messagesByPatient);
  const appendMessage = useCollaborationStore(s => s.appendMessage);
  const myPatients = (visibleIds ? patientsSummary.filter(p => visibleIds.includes(p.id)) : patientsSummary).sort((a, b) => (a.id === 2 ? -1 : b.id === 2 ? 1 : a.id - b.id));
  const [selectedChatPid, setSelectedChatPid] = useState<number | null>(null);
  const [inputText, setInputText] = useState('');
  const msgEndRef = useRef<HTMLDivElement>(null);

  interface ChatMsg { from: string; role: string; text: string; time: string; isAi?: boolean; isLog?: boolean; }

  const patientChats = useMemo(() => {
    const result: Record<number, { lastMsg: string; lastTime: string; aiAlert?: string; messages: ChatMsg[] }> = {};
    for (const p of myPatients) {
      const msgs = messagesByPatient[p.id] || [];
      if (msgs.length === 0) continue;
      result[p.id] = {
        ...deriveEliteChatMeta(p.id, msgs, alertActive),
        messages: mapHubMessagesToEliteDisplay(msgs),
      };
    }
    return result;
  }, [myPatients, messagesByPatient, alertActive]);

  const chatMessages = selectedChatPid != null ? (patientChats[selectedChatPid]?.messages ?? []) : [];
  const threadKey = selectedChatPid != null
    ? `${selectedChatPid}-${alertActive ? 'alert' : 'stable'}`
    : null;
  const visibleCount = useWeChatChatReveal(chatMessages.length, threadKey);

  useEffect(() => {
    if (selectedChatPid !== null) msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleCount, selectedChatPid]);

  const handleSend = () => {
    if (!inputText.trim() || selectedChatPid === null) return;
    const thread = messagesByPatient[selectedChatPid] ?? [];
    const { from, senderName } = getHubNurseSender(selectedChatPid, thread);
    appendMessage(selectedChatPid, {
      id: Date.now(),
      from,
      senderName,
      text: inputText.trim(),
      time: getDemoTimeString(),
      patientId: selectedChatPid,
    });
    setInputText('');
  };

  // ── Patient list view ──
  if (selectedChatPid === null) {
    return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2"><MessageCircle className="w-4 h-4 text-[#006F80]" /> 患者对话</h3>
      <div className="space-y-2">
        {myPatients.map((p) => {
          const chat = patientChats[p.id];
          if (!chat) return null;
          return (
          <div key={p.id} onClick={() => setSelectedChatPid(p.id)} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <PatientAvatar patientId={p.id} size={40} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">{p.name}</span>
                  {chat.aiAlert && <span className="text-[8px] font-extrabold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full alert-blink truncate max-w-[140px]">{chat.aiAlert}</span>}
                </div>
                <p className="text-[9px] text-slate-400 mt-0.5">{p.diagnosis}</p>
              </div>
              <span className="text-[9px] text-slate-400 flex-shrink-0">{chat.lastTime}</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2 ml-[52px]">{chat.lastMsg}</p>
            <div className="flex items-center gap-2 mt-2 ml-[52px]">
              {chat.aiAlert && <span className="text-[8px] text-red-500 font-semibold flex items-center gap-1"><AlertTriangle className="w-2.5 h-2.5" /> AI告警活跃</span>}
              <span className="text-[8px] text-slate-400">{chat.messages.length} messages</span>
            </div>
          </div>
          );
        })}
      </div>
    </div>
    );
  }

  // ── Patient conversation detail ──
  const pChat = myPatients.find(pt => pt.id === selectedChatPid)!;
  const chat = patientChats[selectedChatPid!];
  const rawThread: ChatMessage[] = messagesByPatient[selectedChatPid!] ?? [];
  if (!chat) return null;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center gap-3 flex-shrink-0">
        <button onClick={() => setSelectedChatPid(null)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 hover:bg-slate-200">
          <ChevronRight className="w-4 h-4 text-slate-500 rotate-180" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800">{pChat.name}</p>
          <p className="text-[9px] text-slate-400">{pChat.diagnosis} · Care Team Chat</p>
        </div>
        {chat.aiAlert && (
          <span className="text-[8px] font-extrabold text-red-600 bg-red-50 px-2 py-1 rounded-full alert-blink flex items-center gap-1">
            <AlertTriangle className="w-2.5 h-2.5" /> AI Alert
          </span>
        )}
      </div>

      {/* AI预警横幅 */}
      {chat.aiAlert && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 px-4 py-2 border-b border-red-100 flex items-start gap-2 flex-shrink-0">
          <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[9px] font-bold text-red-700">活跃AI警报</p>
            <p className="text-[8px] text-red-600 leading-relaxed">{chat.aiAlert}</p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-3 bg-slate-50 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-3 w-full">
        {chat.messages.map((msg, i) => {
          if (i >= visibleCount) return null;
          const raw = rawThread[i] ?? normalizeChatMessage({ ...msg, from: 'nurse', senderName: msg.from, patientId: selectedChatPid! }, selectedChatPid!);
          const isMe = isOutgoingChatMessage(raw.from, 'elite');
          const isLog = msg.isLog;
          return (
          <WeChatChatRow
            key={raw.id ?? i}
            isMe={isMe}
            fullWidth={isLog}
            avatar={<ChatBubbleAvatar msg={raw} size={28} />}
            header={
              <div className={`flex items-center gap-1.5 mb-0.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                <span className={`text-[8px] font-medium ${getChatSenderLabelClass(raw.from, alertActive)}`}>
                  {formatChatDisplayName(msg.from)}
                </span>
                <span className="text-[7px] text-slate-300">{msg.time}</span>
              </div>
            }
          >
            <div className={getChatBubbleClasses(raw.from, { isMe, alertActive: alertActive, isLog, textClass: 'text-[10px]' })}>
              <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
              {isLog && (
                <div className="mt-2 pt-2 border-t border-[#99E7FF] flex items-center gap-1.5 text-[8px] text-[#006F80]">
                  <CheckCircle2 className="w-3 h-3" />
                  Auto-generated from NLP voice-to-text · Verified by 护理主管
                </div>
              )}
            </div>
          </WeChatChatRow>
          );
        })}
        <div ref={msgEndRef} />
        </div>
      </div>

      {/* Quick reply */}
      <div className="bg-white px-4 py-3 border-t border-slate-100 flex items-center gap-2 flex-shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          placeholder="Type a message..."
          className="flex-1 bg-slate-50 rounded-full px-4 py-2 text-[10px] text-slate-700 placeholder-slate-400 outline-none border border-slate-100 focus:border-[#06B0EF]"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!inputText.trim()}
          className="w-8 h-8 rounded-full bg-[#006F80] flex items-center justify-center hover:bg-[#0B3550] transition-colors flex-shrink-0 disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </div>
  );
};


export default MobileElitesApp;
export { ElitesDashboardTab, ElitesPatientsTab, ElitesChatTab, type ElitesTab };
