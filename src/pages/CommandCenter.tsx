import { type FC, useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, Bell, Users, Heart, AlertTriangle, CheckCircle2, Smartphone,
  Filter, Plus, Thermometer, Wind, Droplets, Candy,
} from 'lucide-react';
import PatientAvatar from '../components/PatientAvatar';
import { usePatientStore, type PatientSummary } from '../store/patientStore';
import { PATIENTS_FULL } from '../data/patients';
import { useCollaborationStore } from '../store/collaborationStore';
import { useAuth } from '../auth/AuthContext';
import { getVisiblePatientIds } from '../auth/permissions';
import MapView from './MapView';
import AlertToggle from '../components/AlertToggle';
import { PENDING_PATIENTS } from '../data/pendingPatients';
import { buildP7HubBannerContent } from '../utils/medicalHistoryNews';
import { computeCareTeamStats, computeDeviceStats } from '../utils/hubDashboardStats';
import { P7_NEWS_ESCALATION_VITALS } from '../utils/newsScore';

const PENDING_REG_BANNER = PENDING_PATIENTS.find(p => p.id === 114) ?? PENDING_PATIENTS[0];

// ─── SUBCOMPONENTS ───

const VitalBadge: FC<{ label: string; value: string; unit: string; severity?: 'critical' | 'attention'; icon: FC<{ className?: string }> }> = ({ value, unit, severity, icon: Icon }) => {
  const isCrit = severity === 'critical';
  const isAttn = severity === 'attention';
  const bg = isCrit ? 'bg-red-50 border-l-4 border-l-red-500 shadow-[0_1px_3px_rgba(0,0,0,0.03)]' : isAttn ? 'bg-amber-50 border-l-4 border-l-amber-500 shadow-[0_1px_3px_rgba(0,0,0,0.03)]' : 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)]';
  const iconC = isCrit ? 'text-red-500' : isAttn ? 'text-amber-500' : 'text-slate-400';
  const valC = isCrit ? 'text-red-600' : isAttn ? 'text-amber-700' : 'text-slate-800';
  const unitC = isCrit ? 'text-red-500 font-semibold' : isAttn ? 'text-amber-600 font-semibold' : 'text-slate-400';
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-xl ${bg}`}>
      <Icon className={`w-3 h-3 flex-shrink-0 ${iconC}`} />
      <span className={`text-[11px] font-extrabold leading-none ${valC}`}>{value}</span>
      <span className={`text-[9px] leading-none ${unitC}`}>{unit}</span>
    </div>
  );
};

const STAT_COLORS: Record<string, { bg: string; badge: string; text: string; border: string }> = {
  gold:   { bg: 'bg-gold-50',   badge: 'bg-gold-500',    text: 'text-gold-700',   border: 'border-l-gold-500' },
  teal:   { bg: 'bg-teal-50',   badge: 'bg-teal-600',    text: 'text-teal-700',   border: 'border-l-teal-500' },
  red:    { bg: 'bg-red-50',    badge: 'bg-red-500',     text: 'text-red-700',    border: 'border-l-red-500' },
  green:  { bg: 'bg-emerald-50', badge: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-l-emerald-500' },
  indigo: { bg: 'bg-indigo-50', badge: 'bg-indigo-500',  text: 'text-indigo-700', border: 'border-l-indigo-500' },
  amber:  { bg: 'bg-amber-50',  badge: 'bg-amber-500',   text: 'text-amber-700',  border: 'border-l-amber-500' },
  purple: { bg: 'bg-purple-50', badge: 'bg-purple-500',  text: 'text-purple-700', border: 'border-l-purple-500' },
};

/** KPI cards — warm Family palette; semantic accents stay muted to match hub-shell */
const STAT_CARD_HOVER = 'hover:border-[#D4A87C]/55 hover:shadow-[0_4px_12px_rgba(122,92,50,0.08)]';

const STAT_CARD_THEMES: Record<string, { card: string; border: string; icon: string; iconColor: string; label: string; value: string; sub: string; hover: string }> = {
  gold: {
    card: 'glass-card',
    border: 'border-l-[#C49A6C] border border-[#E8D5B8]/80',
    icon: 'bg-[#FDF5E8] border border-[#E8D5B8]',
    iconColor: 'text-[#9C7A4E]',
    label: 'text-slate-600',
    value: 'text-[#7A5C32]',
    sub: 'text-slate-500',
    hover: STAT_CARD_HOVER,
  },
  red: {
    card: 'glass-card',
    border: 'border-l-[#C47070] border border-[#E8D5B8]/80',
    icon: 'bg-[#FCF6F5] border border-[#EDD8D5]',
    iconColor: 'text-[#B85C5C]',
    label: 'text-slate-600',
    value: 'text-[#A84848]',
    sub: 'text-slate-500',
    hover: STAT_CARD_HOVER,
  },
  amber: {
    card: 'glass-card',
    border: 'border-l-[#B8860B] border border-[#E8D5B8]/80',
    icon: 'bg-[#FDF5E8] border border-[#E8C97A]/60',
    iconColor: 'text-[#B8860B]',
    label: 'text-slate-600',
    value: 'text-[#9E6E10]',
    sub: 'text-slate-500',
    hover: STAT_CARD_HOVER,
  },
  green: {
    card: 'glass-card',
    border: 'border-l-[#7A9A72] border border-[#E8D5B8]/80',
    icon: 'bg-[#F4F7F3] border border-[#D5E0D2]',
    iconColor: 'text-[#6B8A62]',
    label: 'text-slate-600',
    value: 'text-[#5A7A52]',
    sub: 'text-slate-500',
    hover: STAT_CARD_HOVER,
  },
  teal: {
    card: 'glass-card',
    border: 'border-l-[#9C7A4E] border border-[#E8D5B8]/80',
    icon: 'bg-[#F5E6D0] border border-[#E8D5B8]',
    iconColor: 'text-[#9C7A4E]',
    label: 'text-slate-600',
    value: 'text-[#7A5C32]',
    sub: 'text-slate-500',
    hover: STAT_CARD_HOVER,
  },
  purple: {
    card: 'glass-card',
    border: 'border-l-[#A3998E] border border-[#E8D5B8]/80',
    icon: 'bg-[#F8F6F4] border border-[#E8E4DF]',
    iconColor: 'text-[#7A7168]',
    label: 'text-slate-600',
    value: 'text-[#5C544D]',
    sub: 'text-slate-500',
    hover: STAT_CARD_HOVER,
  },
};

const AlertOverlay: FC<{ msg: string; tier?: 'high' | 'medium' }> = ({ msg, tier }) => {
  const isHigh = tier === 'high';
  return (
    <div className={`absolute -top-2 -right-1 flex items-center gap-1 text-white text-[10px] px-2 py-0.5 rounded-full font-bold border-2 border-white z-10 max-w-[130px] blink-subtle ${isHigh ? 'bg-red-600 shadow-[0_3px_10px_rgba(239,68,68,0.4)]' : 'bg-amber-500 shadow-[0_3px_10px_rgba(245,158,11,0.4)]'}`}>
      <AlertTriangle className="w-3 h-3 flex-shrink-0" />
      <span className="truncate">{msg}</span>
    </div>
  );
};

function vitalSeverity(tier: PatientSummary['newsTier'], flagged?: boolean): 'critical' | 'attention' | undefined {
  if (!flagged) return undefined;
  return tier === 'high' ? 'critical' : 'attention';
}

const DIAGNOSIS_TAG: Record<string, string> = {
  'Heart Failure NYHA III':   'bg-amber-50 text-amber-700 border-amber-200',
  'COPD':                     'bg-amber-50 text-amber-700 border-amber-200',
  'Oncology — Breast Ca':     'bg-purple-50 text-purple-700 border-purple-200',
  'Oncology — Lung Ca':       'bg-purple-50 text-purple-700 border-purple-200',
  'Post-Stroke Rehab':        'bg-orange-50 text-orange-700 border-orange-200',
  'Heart Failure NYHA II':    'bg-red-50 text-red-700 border-red-200',
  'Type 2 Diabetes':          'bg-sky-50 text-sky-700 border-sky-200',
  'Hypertension':             'bg-blue-50 text-blue-700 border-blue-200',
  'CKD Stage 3':              'bg-teal-50 text-teal-700 border-teal-200',
  'HTN + CKD Stage 2':        'bg-cyan-50 text-cyan-700 border-cyan-200',
};

const PatientCard: FC<{ patient: PatientSummary; onSelect?: () => void }> = ({ patient: p, onSelect }) => {
  const full = PATIENTS_FULL.find(f => f.id === p.id);
  const barthelScore = full?.barthel?.score;
  const fallScore = full?.fallRisk?.score;
  const tier = p.newsTier;
  const isHigh = tier === 'high';
  const isMedium = tier === 'medium';
  const isRed = p.newsRedScore;
  const isAlert = isHigh || isMedium || isRed || !!p.alertMsg;
  const borderC = isHigh ? 'border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.15)] critical-pulse' : isMedium || isRed ? 'border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)] alert-pulse' : 'border-slate-200 shadow-sm hover:border-teal-300';
  const diagTag = DIAGNOSIS_TAG[p.diagnosis] ?? 'bg-slate-50 text-slate-600 border-slate-200';

  return (
    <div onClick={onSelect} className={`relative glass-card rounded-2xl p-4 transition-all duration-300 hover:shadow-[0_8px_20px_rgba(29,27,26,0.04)] hover:-translate-y-0.5 cursor-pointer overflow-visible ${borderC}`}>
      {isAlert && p.alertMsg && <AlertOverlay msg={p.alertMsg} tier={isHigh ? 'high' : 'medium'} />}
      <div className="flex items-center gap-2.5 mb-3">
        <PatientAvatar patientId={p.id} size={40} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-slate-900 truncate">{p.name}</p>
          <p className="text-[10px] font-semibold text-slate-500">{p.gender === 'M' ? '♂' : '♀'} {p.age} yrs</p>
        </div>
        {!isAlert && <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" title="稳定" />}
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-lg border ${diagTag} truncate max-w-full`}>{p.diagnosis}</span>
        {barthelScore != null && (
          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-lg border bg-teal-50 text-teal-700 border-teal-200 flex-shrink-0">
            Barthel {barthelScore}/60
          </span>
        )}
        {fallScore != null && fallScore > 35 && (
          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-lg border bg-red-50 text-red-700 border-red-200 flex-shrink-0">
            跌倒{fallScore}
          </span>
        )}
      </div>
      <div className="space-y-1.5">
        <div className="flex gap-1.5">
          <VitalBadge label="SBP" value={String(p.bpSystolic)} unit="mmHg" severity={p.vitalHighlight?.bpSys} icon={Activity} />
          <VitalBadge label="DBP" value={String(p.bpDiastolic)} unit="mmHg" severity={p.vitalHighlight?.bpDia} icon={Activity} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <VitalBadge label="RR" value={String(p.rr)} unit="/min" severity={vitalSeverity(tier, p.alertVital?.includes('rr'))} icon={Wind} />
          <VitalBadge label="Pulse" value={String(p.hr)} unit="bpm" severity={vitalSeverity(tier, p.alertVital?.includes('hr'))} icon={Heart} />
          <VitalBadge label="Temp" value={String(p.temp)} unit="°C" severity={vitalSeverity(tier, p.alertVital?.includes('temp'))} icon={Thermometer} />
          <VitalBadge label="SpO₂" value={String(p.spo2)} unit="%" severity={vitalSeverity(tier, p.alertVital?.includes('spo2'))} icon={Droplets} />
          <VitalBadge label="Glucose" value={String(p.bloodSugar)} unit="mg/dL" severity={vitalSeverity(tier, p.alertVital?.includes('glucose'))} icon={Candy} />
        </div>
      </div>
    </div>
  );
};

// ─── DESKTOP COMMAND CENTER ───

const DesktopCommandCenter: FC = () => {
  const [view, setView] = useState<'patient' | 'map'>('patient');
  const isPatient = view === 'patient';
  const navigate = useNavigate();

  // Banner: Leung Pui Shan (#111) pending registration — slides in after 5s
  const [showBanner, setShowBanner] = useState(false);
  const bannerTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    bannerTimer.current = setTimeout(() => {
      setShowBanner(true);
      // Play notification chime — 2 tone alert
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const playTone = (freq: number, start: number, dur: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.3, start);
          gain.gain.exponentialRampToValueAtTime(0.01, start + dur);
          osc.connect(gain); gain.connect(ctx.destination);
          osc.start(start); osc.stop(start + dur);
        };
        playTone(880, 0, 0.5);      // A5
        playTone(1100, 0.5, 0.5);   // C#6
        playTone(1320, 1.0, 0.6);   // E6
      } catch {}
    }, 5000);
    return () => clearTimeout(bannerTimer.current);
  }, []);
  const dismissBanner = () => setShowBanner(false);

  const { user } = useAuth();
  const allPatients = usePatientStore(s => s.patientsSummary);
  const storePatients = usePatientStore(s => s.patients);
  const deviceStatuses = usePatientStore(s => s.deviceStatuses);
  const vitals7 = usePatientStore(s => s.vitals[7]);
  const eliteTaskTimes = useCollaborationStore(s => s.eliteTaskTimes);
  const p7AlertActive = usePatientStore(s => s.p7AlertActive);
  const triggerP7Alert = usePatientStore(s => s.triggerP7Alert);
  const deactivateP7Alert = usePatientStore(s => s.deactivateP7Alert);
  const [showP7Banner, setShowP7Banner] = useState(false);

  // Show banner when alert activates
  useEffect(() => { if (p7AlertActive) setShowP7Banner(true); else setShowP7Banner(false); }, [p7AlertActive]);

  const p7Banner = useMemo(
    () => buildP7HubBannerContent(vitals7 ?? P7_NEWS_ESCALATION_VITALS, 'COPD'),
    [vitals7],
  );


  const visibleIds = getVisiblePatientIds(user?.role || 'admin', user?.account || 'admin');
  const patientsSummary = visibleIds ? allPatients.filter(p => visibleIds.includes(p.id)) : allPatients;
  const visiblePatients = visibleIds ? storePatients.filter(p => visibleIds.includes(p.id)) : storePatients;
  const alertPatients = patientsSummary.filter(p => p.newsTier !== 'low' || p.newsRedScore || p.alertVital?.includes('glucose'));
  const highCount = patientsSummary.filter(p => p.newsTier === 'high').length;
  const mediumCount = patientsSummary.filter(p => p.newsTier === 'medium').length;
  const lowCount = patientsSummary.filter(p => p.newsTier === 'low' && !p.newsRedScore && !p.alertVital?.includes('glucose')).length;
  const careTeamStats = useMemo(
    () => computeCareTeamStats(visiblePatients, eliteTaskTimes),
    [visiblePatients, eliteTaskTimes],
  );
  const deviceStats = useMemo(
    () => computeDeviceStats(visiblePatients, deviceStatuses),
    [visiblePatients, deviceStatuses],
  );
  const careTeamTotal = careTeamStats.total;
  const careTeamOnDuty = careTeamStats.onDuty;
  const devicesTotal = deviceStats.total;
  const devicesOnline = deviceStats.online;
  const deviceOnlinePct = devicesTotal > 0 ? Math.round((devicesOnline / devicesTotal) * 100) : 0;

  return (
  <div className="bg-warm-50 min-h-full">
    {view === 'map' ? (
      <div className="h-[calc(100vh-56px)] relative">
      <div className="absolute top-4 left-4 z-[1000] flex items-center gap-1 bg-gold-100 rounded-xl p-1 border border-[#d2c4be]">
        <button onClick={() => setView('patient')} className={`px-3 py-1.5 text-[10px] font-semibold rounded-lg transition-colors ${isPatient ? 'bg-gold-600 text-white' : 'text-gold-700 hover:text-gold-900'}`}>Patient View</button>
        <button onClick={() => setView('map')} className={`px-3 py-1.5 text-[10px] font-semibold rounded-lg transition-colors ${!isPatient ? 'bg-gold-600 text-white' : 'text-gold-700 hover:text-gold-900'}`}>Map View</button>
      </div>
        <MapView patients={patientsSummary} />
      </div>
    ) : (
    <> 
    <div className="relative pt-12">
      <div className="absolute top-4 left-4 z-[1000] flex items-center gap-1 bg-gold-100 rounded-xl p-1 border border-[#d2c4be]">
        <button onClick={() => setView('patient')} className={`px-3 py-1.5 text-[10px] font-semibold rounded-lg transition-colors ${isPatient ? 'bg-gold-600 text-white' : 'text-gold-700 hover:text-gold-900'}`}>Patient View</button>
        <button onClick={() => setView('map')} className={`px-3 py-1.5 text-[10px] font-semibold rounded-lg transition-colors ${!isPatient ? 'bg-gold-600 text-white' : 'text-gold-700 hover:text-gold-900'}`}>Map View</button>
      </div>
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 pt-4 sm:pt-6 pb-2 sm:pb-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: '服务中患者', value: String(patientsSummary.length), sub: 'Active under care', icon: Users, color: 'gold' as const },
          { label: '跌倒高风险', value: String(highCount), sub: 'Fall risk >35', icon: AlertTriangle, color: 'red' as const },
          { label: '压疮风险', value: String(mediumCount), sub: 'Braden ≤16', icon: Bell, color: 'amber' as const },
          { label: '血压异常', value: String(lowCount), sub: 'BP >140/90', icon: CheckCircle2, color: 'green' as const },
          { label: '照护团队', value: `${careTeamOnDuty}/${careTeamTotal}`, sub: '今日在岗', icon: Heart, color: 'teal' as const },
          { label: '设备在线', value: `${devicesOnline}/${devicesTotal}`, sub: devicesTotal > 0 ? `${deviceOnlinePct}% 在线` : '无设备', icon: Smartphone, color: 'purple' as const },
        ].map((stat, i) => {
          const t = STAT_CARD_THEMES[stat.color];
          return (
            <div key={i} className={`rounded-2xl border-l-4 ${t.card} ${t.border} p-4 transition-all duration-300 ${t.hover} hover:-translate-y-0.5`}>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className={`text-[11px] font-bold font-display truncate ${t.label}`}>{stat.label}</span>
                <div className={`w-8 h-8 rounded-xl ${t.icon} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className={`w-4 h-4 ${t.iconColor}`} />
                </div>
              </div>
              <p className={`text-2xl font-extrabold leading-none tabular-nums font-display ${t.value}`}>{stat.value}</p>
              <p className={`text-[10px] font-semibold mt-1.5 font-body truncate ${t.sub}`}>{stat.sub}</p>
            </div>
          );
        })}
      </div>
    </div>
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 pb-6 sm:pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-5 pt-2 sm:pt-3 gap-2 sm:gap-0">
        <h2 className="text-sm sm:text-base font-semibold text-slate-800 flex items-center gap-2 font-display">
          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
          患者监控面板
          <span className="inline-flex items-center ml-2 px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full bg-gold-100 text-gold-800 text-[10px] sm:text-xs font-semibold">{patientsSummary.length} 在管</span>
        </h2>
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold text-slate-600 glass-card hover:bg-warm-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-colors"><Filter className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Filter Patients</button>
          <button className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold text-white bg-gold-600 hover:bg-gold-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-colors"><Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Add Patient</button>
        </div>
      </div>
      <div className="bento-grid">{patientsSummary.sort((a,b) => b.newsScore - a.newsScore).map(p => (<PatientCard key={p.id} patient={p} onSelect={() => navigate(`/patient/${p.id}`)} />))}</div>
    </div>
    </div>
    </>
    )}
    {(showBanner || showP7Banner) && (
      <div className="fixed bottom-12 right-4 z-[1990] flex flex-col-reverse gap-3 items-end pointer-events-none max-w-[calc(100vw-2rem)]">
        {showP7Banner && (
          <div className="pointer-events-auto w-80 bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 animate-alert-slide-in">
            <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-red-500/10 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold tracking-tight text-slate-900">{p7Banner.title}</p>
                  <p className="text-[10px] text-slate-500">{p7Banner.subtitle}</p>
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setShowP7Banner(false); }}
                className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                <span className="text-slate-400 text-[10px]">✕</span>
              </button>
            </div>
            <div className="px-4 pb-3.5 space-y-2">
              <div className="grid grid-cols-4 gap-1.5">
                {p7Banner.vitals.map((v, i) => (
                  <div key={i} className="bg-red-50 rounded-xl px-2 py-1.5 text-center">
                    <p className="text-[15px] font-bold leading-none text-red-600">{v.value}</p>
                    <p className="text-[9px] font-medium text-slate-400 mt-0.5">{v.label}</p>
                    <p className="text-[8px] text-red-400">{v.sub}</p>
                  </div>
                ))}
              </div>
              <div className="bg-red-50/60 rounded-xl px-3 py-2">
                <p className="text-[11px] font-semibold text-red-700 tracking-tight leading-snug">
                  {p7Banner.headline}
                </p>
                <p className="text-[10px] text-red-400 mt-0.5">
                  {p7Banner.detail}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl px-3 py-2">
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Recommended Actions</p>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-600 flex-wrap">
                  <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-semibold text-slate-500 flex-shrink-0">1</span> Nurse Call
                  <span className="text-slate-300">→</span>
                  <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-semibold text-slate-500 flex-shrink-0">2</span> Assessment
                  <span className="text-slate-300">→</span>
                  <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-semibold text-slate-500 flex-shrink-0">3</span> POCT CRP/PCT
                  <span className="text-slate-300">→</span>
                  <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-semibold text-slate-500 flex-shrink-0">4</span> Dr. Lee
                </div>
              </div>
            </div>
          </div>
        )}
        {showBanner && (
          <div
            className="pointer-events-auto w-80 bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 animate-pending-slide-in cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => { dismissBanner(); navigate('/pending-registration/114/medical-history'); }}
          >
            <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold tracking-tight text-slate-900 truncate">New Pending Registration</p>
                  <p className="text-[10px] text-slate-500 truncate">{PENDING_REG_BANNER.name}</p>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); dismissBanner(); }}
                className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <span className="text-slate-400 text-[10px]">✕</span>
              </button>
            </div>
            <div className="px-4 pb-3.5 space-y-2">
              <div className="bg-emerald-50/60 rounded-xl px-3 py-2">
                <p className="text-[11px] font-semibold text-emerald-700 tracking-tight leading-snug">
                  {PENDING_REG_BANNER.diagnosis}
                </p>
                <p className="text-[10px] text-emerald-600/80 mt-0.5">
                  Referred by {PENDING_REG_BANNER.doctor} · {PENDING_REG_BANNER.hospital}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="bg-slate-50 rounded-xl px-2.5 py-2">
                  <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wide">Date</p>
                  <p className="text-[11px] font-semibold text-slate-800 mt-0.5">{PENDING_REG_BANNER.referralDate}</p>
                </div>
                <div className="bg-slate-50 rounded-xl px-2.5 py-2">
                  <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wide">Gender / Age</p>
                  <p className="text-[11px] font-semibold text-slate-800 mt-0.5">{PENDING_REG_BANNER.gender === 'M' ? 'Male' : 'Female'}, {PENDING_REG_BANNER.age} yrs</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl px-3 py-2">
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Next Step</p>
                <p className="text-[10px] text-slate-600">Review medical history and complete registration intake.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )}
    <AlertToggle />
  </div>
  );
};

export { PatientCard, VitalBadge, AlertOverlay, DIAGNOSIS_TAG, STAT_COLORS };
export default DesktopCommandCenter;
