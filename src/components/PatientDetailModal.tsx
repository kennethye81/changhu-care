import { useState, useMemo, type FC } from 'react';
import { useAuth } from '../auth/AuthContext';
import { canRead, can编辑, type TabKey, type Role } from '../auth/types';
import {
  X, Heart, Activity, FileText, Pill, ClipboardList,
  CalendarDays, Smartphone, PhoneCall, 编辑3, Plus,
  Users, Thermometer, Droplets, Wind,
} from 'lucide-react';
import { PATIENTS_FULL, type PatientFull } from '../data/patients';
import { usePatientStore, DEFAULT_VITALS } from '../store/patientStore';
import { calculateNews, formatNewsTierLabel } from '../utils/newsScore';
import { useCollaborationStore } from '../store/collaborationStore';
import { DEMO_CARE_PLAN_DATE, getTodayActivities } from '../utils/carePlanSync';
import { getDemoNow } from '../utils/demoClock';
import { CompactDualLineTrendSvg } from './BloodPressureCharts';

interface Patient {
  id: number; name: string; gender: string; age: number; diagnosis: string;
  temp: number; hr: number; bpSystolic: number; bpDiastolic: number; spo2: number;
}

interface PatientDetailModalProps {
  patient: Patient;
  onClose: () => void;
}

const TABS: { key: TabKey; label: string; icon: FC<{ className?: string }> }[] = [
  { key: 'vitals', label: '体征与趋势', icon: Activity },
  { key: 'history', label: '病史', icon: FileText },
  { key: 'medication', label: '用药', icon: Pill },
  { key: 'followup_logs', label: '随访记录', icon: ClipboardList },
  { key: 'care_plan', label: '照护计划', icon: CalendarDays },
  { key: 'devices', label: '设备', icon: Smartphone },
  { key: 'billing', label: '账单', icon: PhoneCall },
];

const PatientDetailModal: FC<PatientDetailModalProps> = ({ patient, onClose }) => {
  const { user } = useAuth();
  const role = user?.role as Role;
  const [activeTab, setActiveTab] = useState<TabKey>('vitals');
  const fullPatient = PATIENTS_FULL.find(p => p.id === patient.id);

  // Get visible tabs based on role
  const visibleTabs = TABS.filter(t => canRead(role, t.key));
  if (visibleTabs.length > 0 && !visibleTabs.find(t => t.key === activeTab)) {
    setActiveTab(visibleTabs[0].key);
  }

  const editable = can编辑(role, activeTab);

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-10 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-lg font-bold shadow-md">
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{patient.name}</h2>
              <p className="text-xs text-slate-500">{patient.gender}, {patient.age} yrs · {patient.diagnosis}</p>
            </div>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">实时监测</span>
          </div>
          <div className="flex items-center gap-3">
            {editable && (
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                <编辑3 className="w-3.5 h-3.5" /> 编辑
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6 gap-1 bg-white flex-shrink-0">
          {visibleTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            const is编辑 = can编辑(role, tab.key);
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {is编辑 && <span className="text-[9px] bg-blue-100 text-blue-600 px-1 rounded font-bold">编辑</span>}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'vitals' && <VitalsTab patient={patient} />}
          {activeTab === 'history' && <HistoryTab patient={patient} />}
          {activeTab === 'medication' && fullPatient && <用药Tab patient={fullPatient} editable={can编辑(role, 'medication')} />}
          {activeTab === 'followup_logs' && fullPatient && <FollowupLogsTab patient={fullPatient} editable={can编辑(role, 'followup_logs')} />}
          {activeTab === 'care_plan' && fullPatient && <CarePlanTab editable={can编辑(role, 'care_plan')} role={role} patient={fullPatient} />}
          {activeTab === 'devices' && <设备Tab patient={patient} />}
          {activeTab === 'billing' && <账单Tab editable={can编辑(role, 'billing')} />}
        </div>
      </div>
    </div>
  );
};

/* ─────────────── Tab Contents ─────────────── */

const VitalsTab: FC<{ patient: Patient }> = ({ patient: p }) => {
  const v = usePatientStore(s => s.vitals[p.id] || DEFAULT_VITALS[p.id] || DEFAULT_VITALS[1]);
  const fullPatient = PATIENTS_FULL.find(fp => fp.id === p.id);
  const diagnosis = fullPatient?.diagnosis ?? p.diagnosis;
  const news = calculateNews(v, diagnosis);
  const overall状态 = news.tier === 'high' ? 'critical' : news.tier === 'medium' || news.redScore ? 'attention' : 'stable';
  const now = getDemoNow();
  const timeLabels: string[] = [];
  for (let i = 8; i >= 0; i--) {
    const t = new 日期(now.getTime() - i * 15 * 60000);
    timeLabels.push(`${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}`);
  }

  const genTrend = (base: number, range: number, len: number): number[] => {
    const vals: number[] = [];
    for (let i = 0; i < len; i++) {
      vals.push(+(base + (Math.sin(i * 0.8) * range * 0.3 + Math.cos(i * 0.5) * range * 0.2 + (Math.random() - 0.5) * range * 0.3)).toFixed(1));
    }
    return vals;
  };

  const vitals: Array<{
    label: string;
    value: string;
    unit: string;
    icon: typeof Activity;
    color: string;
    trend: number[];
    trendDia?: number[];
    dualLine?: boolean;
    alert: boolean;
    refRange: string;
  }> = [
    { label: '呼吸频率', value: String(v.rr), unit: '/min', icon: Wind, color: '#14b8a6', trend: genTrend(v.rr, 4, 9), alert: v.rr > 24 || v.rr < 8, refRange: '12–20 /min' },
    { label: '心率', value: String(v.hr), unit: 'bpm', icon: Heart, color: '#ef4444', trend: genTrend(v.hr, 10, 9), alert: v.hr > 90, refRange: '60–100 bpm' },
    {
      label: '血压',
      value: `${v.bpSystolic}/${v.bpDiastolic}`,
      unit: 'mmHg',
      icon: Activity,
      color: '#ef4444',
      trend: genTrend(v.bpSystolic, 14, 9),
      trendDia: genTrend(v.bpDiastolic, 8, 9),
      dualLine: true,
      alert: v.bpSystolic > 140 || v.bpDiastolic > 90,
      refRange: '<140/<90 mmHg',
    },
    { label: 'SpO₂', value: String(v.spo2), unit: '%', icon: Droplets, color: '#06b6d4', trend: genTrend(v.spo2, 2.5, 9), alert: v.spo2 < 92, refRange: '≥92%' },
    { label: '血糖', value: String(v.bloodSugar), unit: 'mg/dL', icon: Activity, color: '#a855f7', trend: genTrend(v.bloodSugar, 20, 9), alert: v.bloodSugar < 80 || v.bloodSugar > 180, refRange: '80–180 mg/dL' },
    { label: '体温', value: String(v.temp), unit: '°C', icon: Thermometer, color: '#f59e0b', trend: genTrend(v.temp, 0.4, 9), alert: v.temp > 37.5, refRange: '36.1–37.2°C' },
  ];

  const buildSmoothPath = (pts: number[], w: number, h: number): string => {
    if (pts.length < 2) return '';
    const min = Math.min(...pts), max = Math.max(...pts);
    const range = max - min || 1, pad = range * 0.1;
    const xStep = w / (pts.length - 1);
    const getX = (i: number) => i * xStep;
    const getY = (v: number) => h - ((v - (min - pad)) / (range + pad * 2)) * h;
    let d = `M ${getX(0)} ${getY(pts[0])}`;
    for (let i = 1; i < pts.length; i++) {
      const cx = (getX(i - 1) + getX(i)) / 2;
      d += ` C ${cx} ${getY(pts[i - 1])}, ${cx} ${getY(pts[i])}, ${getX(i)} ${getY(pts[i])}`;
    }
    return d;
  };

  const W = 480, H = 80, PAD = 40;

  const statusStyle = overall状态 === 'critical'
    ? { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', badge: '危重', badgeC: 'bg-red-500' }
    : overall状态 === 'attention'
    ? { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', badge: '需关注', badgeC: 'bg-amber-500' }
    : { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', badge: '稳定', badgeC: 'bg-emerald-500' };

  const newsLabel = formatNewsTierLabel(news);
  const interventionText = `${news.escalation} ${news.monitoringLabel}.`;

  const aiSummaries = {
    critical: {
      rr: 'RR trending above target — tachypnoea pattern detected. Correlate with SpO₂ and infection markers.',
      hr: 'HR trending above target with ↑ trajectory over past 30 min. Tachycardia pattern detected — possible AF or compensatory response.',
      bp: 'BP Stage 2 hypertensive range persisting. Morning trajectory flat — no downward trend indicating inadequate pharmacotherapy.',
      temp: 'Low-grade fever pattern emerging. Gradual ↑ over 2h suggests early inflammatory or infectious process.',
      spo2: 'SpO₂ borderline low with brief desaturation dips. Consider O₂ supplementation or positioning adjustment.',
      glucose: 'Blood glucose excursions detected — alert-only metric. Recheck capillary glucose and review diabetic regimen if applicable.',
      intervention: interventionText,
      newsLabel,
    },
    attention: {
      rr: 'RR mildly elevated but stable. Monitor with full six-parameter review.',
      hr: 'HR mildly elevated but stable trajectory. No progressive tachycardia pattern. Consistent with baseline.',
      bp: 'BP mildly elevated, flat trajectory. No acute escalation. Continue current regimen with scheduled recheck.',
      temp: '体温 within acceptable range. Stable readings across 2h window. No febrile pattern.',
      spo2: 'SpO₂ within normal range. Minor fluctuations consistent with activity and position changes.',
      glucose: 'Glucose intermittently outside ideal range — separate alert protocol applies; not scored in NEWS.',
      intervention: interventionText,
      newsLabel,
    },
    stable: {
      rr: 'RR within target range. Stable respiratory pattern across monitoring window.',
      hr: 'HR well-controlled within target range. Consistent sinusoidal pattern — normal autonomic variation.',
      bp: 'BP within target. Smooth flat trajectory across 2h window indicating pharmacotherapy effectiveness.',
      temp: 'Normothermic throughout monitoring period. No concern.',
      spo2: 'SpO₂ excellent. No desaturation episodes detected.',
      glucose: 'Blood glucose within acceptable range. Alert-only monitoring — excluded from NEWS score.',
      intervention: interventionText,
      newsLabel,
    },
  };

  const vitalKey = (label: string) => {
    if (label === '呼吸频率') return 'rr';
    if (label === '心率') return 'hr';
    if (label === '血压') return 'bp';
    if (label === '体温') return 'temp';
    if (label === '血糖') return 'glucose';
    return 'spo2';
  };

  const s = aiSummaries[overall状态];
  const summary = vitals.filter(v => v.alert).length > 0
    ? vitals.filter(v => v.alert).map(v => (s as Record<string, string>)[vitalKey(v.label)]).join(' ')
    : (s as Record<string, string>).hr;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-700">Real-Time Vitals (6 Parameters) &amp; 2-Hour Trend</h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {vitals.map((v, i) => (
          <div key={i} className={`bg-white rounded-xl border ${v.alert ? 'border-red-300 bg-red-50/50' : 'border-slate-200'} overflow-hidden`}>
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-9 h-9 rounded-lg ${v.alert ? 'bg-red-100' : 'bg-slate-100'} flex items-center justify-center flex-shrink-0`}>
                  <v.icon className="w-4 h-4" style={{ color: v.color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-slate-700 truncate">{v.label}</p>
                  <p className="text-[9px] text-slate-400">Ref: {v.refRange}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <p className="text-xl font-bold" style={{ color: v.color }}>{v.value}<span className="text-[10px] font-normal text-slate-400 ml-0.5">{v.unit}</span></p>
              </div>
            </div>
            <div className="px-4 pb-4">
              {v.dualLine && v.trendDia ? (
                <CompactDualLineTrendSvg
                  sys={v.trend}
                  dia={v.trendDia}
                  sysColor={v.color}
                  width={W}
                  height={H}
                  padTop={PAD}
                  timeLabels={timeLabels}
                  idSuffix={`${i}`}
                />
              ) : (
                <svg viewBox={`0 0 ${W} ${H + PAD + 12}`} className="w-full h-20">
                  {[0, 1].map((gi) => (
                    <line key={gi} x1={0} y1={PAD + gi * H} x2={W} y2={PAD + gi * H} stroke="#f1f5f9" strokeWidth="1" />
                  ))}
                  <defs>
                    <linearGradient id={`gradv-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={v.color} stopOpacity="0.12" />
                      <stop offset="100%" stopColor={v.color} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={buildSmoothPath(v.trend, W, H)} fill="none" stroke={v.color} strokeWidth="2" strokeLinecap="round" vector-effect="non-scaling-stroke" transform={`translate(0,${PAD})`} />
                  <path d={`${buildSmoothPath(v.trend, W, H)} V ${H} H 0 Z`} fill={`url(#gradv-${i})`} transform={`translate(0,${PAD})`} />
                  {[0,2,4,6,8].map((ti) => (
                    <text key={ti} x={(ti / 8) * W} y={H + PAD + 12} textAnchor="middle" className="text-[8px]" fill="#94a3b8">{timeLabels[ti]}</text>
                  ))}
                  {v.trend.map((val, di) => {
                    const min = Math.min(...v.trend), max = Math.max(...v.trend);
                    const range = max - min || 1, p2 = range * 0.1;
                    const x = di * (W / (v.trend.length - 1));
                    const y = PAD + H - ((val - (min - p2)) / (range + p2 * 2)) * H;
                    return <circle key={di} cx={x} cy={y} r="2" fill={v.color} />;
                  })}
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className={`${statusStyle.bg} border ${statusStyle.border} rounded-xl p-4 text-xs`}>
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${statusStyle.badgeC} animate-pulse`} />
          <strong className={statusStyle.text}>AI洞察 · {statusStyle.badge}</strong>
          <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded ${overall状态 === 'critical' ? 'text-red-600 bg-red-100' : overall状态 === 'attention' ? 'text-amber-600 bg-amber-100' : 'text-emerald-600 bg-emerald-100'}`}>NEWS Tier: {s.newsLabel}</span>
        </div>
        <p className={`${statusStyle.text} leading-relaxed mb-2`}>{summary}</p>
        <div className={`mt-2 pt-2 border-t ${overall状态 === 'critical' ? 'border-red-200' : overall状态 === 'attention' ? 'border-amber-200' : 'border-emerald-200'}`}>
          <p className="text-[10px] font-semibold mb-1">Recommended Interventions:</p>
          <p className="text-[10px] leading-relaxed opacity-80">{s.intervention}</p>
        </div>
      </div>
    </div>
  );
};

const 用药Tab: FC<{ patient: PatientFull; editable: boolean }> = ({ patient: p, editable }) => {
  const meds = p.medications;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-700">Current 用药s</h3>
        {editable && (
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700">
            <Plus className="w-3.5 h-3.5" /> Add 用药
          </button>
        )}
      </div>
      <div className="space-y-2">
        {meds.map((med, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-800">{med.drug}</p>
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${med.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{med.status}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">{med.dose} · {med.route} · {med.frequency}</p>
              <p className="text-[10px] text-slate-400">Started: {med.start日期} · {med.purpose}</p>
            </div>
            <div className="flex items-center gap-2 ml-3">
              {editable && <button className="text-[10px] text-blue-600 font-medium hover:underline whitespace-nowrap">编辑</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CarePlanTab: FC<{ editable: boolean; role: Role; patient: PatientFull }> = ({ editable, role, patient: p }) => {
  const cp = p.carePlan;
  const carePlans = usePatientStore(s => s.carePlans);
  const carePlan状态 = useCollaborationStore(s => s.carePlan状态);
  const plan = carePlans[p.id];
  const today = DEMO_CARE_PLAN_DATE;
  const todaySchedule = useMemo(
    () => getTodayActivities(plan, p.id, today, carePlan状态),
    [plan, p.id, today, carePlan状态],
  );
  const recentLogs = plan?.logs || [];
  
  return (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-bold text-slate-700">Home 照护计划</h3>
      {editable && (
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700">
            <编辑3 className="w-3.5 h-3.5" /> 编辑 照护计划
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700">
            <Users className="w-3.5 h-3.5" /> Assign Staff
          </button>
        </div>
      )}
    </div>

    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <h4 className="text-xs font-bold text-slate-600 mb-3">照护计划 Summary</h4>
      <div className="grid grid-cols-2 gap-3 text-xs">
        {[
          { label: '服务频率', value: cp.serviceFrequency },
          { label: '访视时长', value: cp.visitDuration },
          { label: '责任医生', value: cp.assignedDoctor },
          { label: 'Case Manager', value: cp.assignedCaseManager || '—' },
          { label: '责任护士', value: cp.assignedNurse },
          { label: '康复治疗师', value: cp.assignedRehabTherapist || '—' },
          { label: '照护师', value: cp.assignedCareWorker || '—' },
        ].map((item, i) => (
          <div key={i} className="flex justify-between bg-slate-50 rounded-lg px-3 py-2">
            <span className="text-slate-500">{item.label}</span>
            <span className="font-semibold text-slate-700 text-right ml-2">{item.value}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <h4 className="text-xs font-bold text-slate-600 mb-2">照护目标</h4>
        <div className="space-y-1">
          {cp.goals.map((g, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
              <span className="text-emerald-500 mt-0.5">✓</span> {g}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-xs font-bold text-slate-600 mb-2">注意事项</h4>
        <div className="space-y-1">
          {cp.precautions.map((p, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-amber-700">
              <span className="text-amber-500 mt-0.5">⚠</span> {p}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Today's Schedule */}
    {todaySchedule.length > 0 && (
      <div className="bg-white border border-blue-200 rounded-xl p-4">
        <h4 className="text-xs font-bold text-blue-700 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" /> Today's Schedule ({today})
        </h4>
        <div className="space-y-2">
          {todaySchedule.map((act, i) => {
            const typeC: Record<string, string> = {
              medication: 'bg-purple-100 text-purple-700', monitoring: 'bg-cyan-100 text-cyan-700',
              therapy: 'bg-emerald-100 text-emerald-700', nurse_visit: 'bg-blue-100 text-blue-700',
              doctor_consult: 'bg-indigo-100 text-indigo-700', care_worker: 'bg-amber-100 text-amber-700',
              self_care: 'bg-slate-100 text-slate-600',
            };
            const statusC: Record<string, string> = {
              completed: 'text-emerald-600', pending: 'text-amber-600', missed: 'text-red-600', in_progress: 'text-blue-600',
            };
            return (
              <div key={i} className={`flex items-center gap-3 text-xs py-1.5 px-2 rounded-lg ${act.status === 'completed' ? 'bg-slate-50' : 'bg-white'}`}>
                <span className="w-12 text-[10px] font-bold text-slate-400 flex-shrink-0">{act.time}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold flex-shrink-0 ${typeC[act.type]}`}>{act.type.replace('_', ' ')}</span>
                <span className="flex-1 text-slate-700 truncate">{act.detail}</span>
                <span className={`text-[10px] font-semibold flex-shrink-0 ${statusC[act.status]}`}>{act.status}</span>
              </div>
            );
          })}
        </div>
      </div>
    )}

    {/* Recent 随访记录 */}
    {recentLogs.length > 0 && (
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <h4 className="text-xs font-bold text-slate-600 mb-3">Recent 随访记录</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {recentLogs.slice(0, 5).map((log, i) => (
            <div key={i} className="border-l-2 border-blue-200 pl-3 text-xs">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-semibold text-slate-700">{log.type}</span>
                <span className="text-[10px] text-slate-400">{log.date} · {log.time}</span>
              </div>
              <p className="text-slate-600">{log.detail}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-slate-400">— {log.author} ({log.role})</span>
                {log.vitals && <span className="text-[10px] text-slate-400">| {log.vitals}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {role === 'doctor' && (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
        <strong>Physician Note:</strong> You have read-only access to the 照护计划. The Nursing Director manages plan creation and staff assignment.
      </div>
    )}
    {role === 'nurse' && (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-700">
        <strong>Nursing Director:</strong> You have full edit rights. Adjust frequency, assign staff, and set care priorities based on physician orders.
      </div>
    )}
    {role === 'case_manager' && (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
        <strong>Case Manager:</strong> Read-only access. Monitor care plan execution progress and coordinate with the care team.
      </div>
    )}
  </div>
  );
};

const 账单Tab: FC<{ editable: boolean }> = ({ editable }) => (
  <div className="space-y-4">
    <h3 className="text-sm font-bold text-slate-700">服务 & 账单 Records</h3>
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <table className="w-full text-xs">
        <thead className="bg-slate-50">
          <tr>
            <th className="text-left px-4 py-2 font-semibold text-slate-600">日期</th>
            <th className="text-left px-4 py-2 font-semibold text-slate-600">服务</th>
            <th className="text-right px-4 py-2 font-semibold text-slate-600">金额(元)</th>
            <th className="text-center px-4 py-2 font-semibold text-slate-600">状态</th>
          </tr>
        </thead>
        <tbody>
          {[
            { date: '2026-06-18', service: '护士上门访视', amount: '1,200', status: '已付' },
            { date: '2026-06-15', service: '远程查房', amount: '800', status: '已付' },
            { date: '2026-06-12', service: '设备监测(月度)', amount: '500', status: '待付' },
            { date: '2026-06-10', service: '用药 Delivery', amount: '350', status: '已付' },
          ].map((row, i) => (
            <tr key={i} className="border-t border-slate-100">
              <td className="px-4 py-2 text-slate-600">{row.date}</td>
              <td className="px-4 py-2 font-medium text-slate-700">{row.service}</td>
              <td className="px-4 py-2 text-right font-semibold text-slate-800">{row.amount}</td>
              <td className="px-4 py-2 text-center">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${row.status === '已付' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {editable && (
      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700">
        <Plus className="w-3.5 h-3.5" /> Add 账单 Entry
      </button>
    )}
  </div>
);

/* ─────────────── History Tab ─────────────── */

const HistoryTab: FC<{ patient: Patient }> = () => {
  const events = [
    { date: '2026-06-19', type: '入院', detail: 'Admitted via A&E with acute decompensated HF NYHA III. Orthopnea, pedal oedema 2+, BNP 1,200. IV Furosemide initiated. Echo: LVEF 30%, moderate MR.', provider: '常州市第一人民医院' },
    { date: '2026-06-14', type: '入院', detail: 'Admitted with worsening dyspnoea, weight +3kg in 5 days. CXR: pulmonary congestion, small bilateral pleural effusions. GDMT optimised: Sacubitril/Valsartan initiated.', provider: '姜珊' },
    { date: '2024-01-15', type: 'Diagnosis', detail: 'Type 2 Diabetes Mellitus diagnosed. HbA1c: 8.2%. Started on Metformin 500mg BID.', provider: '姜珊' },
    { date: '2023-03-10', type: 'Diagnosis', detail: 'CKD Stage 3 diagnosed. eGFR 42 mL/min. UACR 850 mg/g. Losartan initiated for renoprotection — stopped due to ACEi cough. Switched to ARB (Candesartan→Losartan).', provider: '姜珊' },
    { date: '2021-08-22', type: 'Diagnosis', detail: 'Permanent Atrial Fibrillation diagnosed. CHA₂DS₂-VASc 4. Anticoagulation initiated (Warfarin→Apixaban). Rate control with Bisoprolol.', provider: '姜珊' },
    { date: '2018-05-10', type: 'Diagnosis', detail: 'Hypertension diagnosed. BP 158/96. Started on antihypertensive therapy (Ramipril→Candesartan→Losartan).', provider: '待分配' },
    { date: '2016-01-20', type: 'Diagnosis', detail: 'Heart Failure diagnosed (initial presentation). NYHA II. Echo: LVEF 40%. Started on ACEi + BB.', provider: '待分配' },
  ];
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-700">病史 Timeline</h3>
      <div className="relative pl-6 border-l-2 border-slate-200 space-y-4">
        {events.map((e, i) => {
          const typeColors: Record<string, string> = {
            操作/手术: 'bg-blue-100 text-blue-700 border-blue-200',
            入院: 'bg-red-100 text-red-700 border-red-200',
            Diagnosis: 'bg-amber-100 text-amber-700 border-amber-200',
          };
          return (
            <div key={i} className="relative">
              <div className={`absolute -left-[25px] top-1 w-3 h-3 rounded-full border-2 border-white ${e.type === '操作/手术' ? 'bg-blue-500' : e.type === '入院' ? 'bg-red-500' : 'bg-amber-500'}`} />
              <div className="bg-white border border-slate-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${typeColors[e.type]}`}>{e.type}</span>
                  <span className="text-[10px] text-slate-400">{e.date}</span>
                </div>
                <p className="text-xs text-slate-700">{e.detail}</p>
                <p className="text-[10px] text-slate-400 mt-1">Provider: {e.provider}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─────────────── 随访记录 Tab ─────────────── */

const FollowupLogsTab: FC<{ patient: PatientFull; editable: boolean }> = ({ patient: p, editable }) => {
  const plan = usePatientStore(s => s.carePlans[p.id]);
  const logs = plan?.logs || [];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-700">随访干预记录</h3>
        {editable && (
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700">
            <Plus className="w-3.5 h-3.5" /> Add Entry
          </button>
        )}
      </div>
      <div className="space-y-2">
        {logs.map((log, i) => {
          const statusColors: Record<string, string> = {
            completed: 'bg-emerald-100 text-emerald-700',
            escalated: 'bg-red-100 text-red-700',
            pending: 'bg-amber-100 text-amber-700',
          };
          return (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{log.type}</span>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${statusColors[log.status]}`}>{log.status}</span>
                </div>
                <span className="text-[10px] text-slate-400">{log.date} · {log.time}</span>
              </div>
              <p className="text-xs text-slate-700">{log.detail}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-slate-400">— {log.author} ({log.role})</span>
                {log.vitals && <span className="text-[10px] text-slate-400">| {log.vitals}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─────────────── 设备 Tab ─────────────── */

const 设备Tab: FC<{ patient: Patient }> = () => (
  <div className="space-y-4">
    <h3 className="text-sm font-bold text-slate-700">Bound Monitoring 设备</h3>
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md">
            <BedDoubleIcon />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">mmWave Radar Mattress</p>
            <p className="text-[10px] text-slate-400">SenseLife · Sleep Monitor Pro · S/N: SL-2026-00178</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Syncing
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <p className="text-slate-400">睡眠评分</p>
          <p className="font-bold text-indigo-600">82/100</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <p className="text-slate-400">呼吸频率</p>
          <p className="font-bold text-slate-700">16/min</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <p className="text-slate-400">Data (24h)</p>
          <p className="font-bold text-purple-600">14,280 pts</p>
        </div>
      </div>
    </div>

    <div className="bg-slate-900 rounded-xl p-4">
      <p className="text-xs font-semibold text-white mb-3">Data Flow — End-to-End 加密</p>
      <div className="flex items-center justify-between text-[10px]">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-1">
            <WatchIcon small />
          </div>
          <p className="text-slate-400">设备</p>
        </div>
        <span className="text-emerald-400 text-lg">→</span>
        <div className="text-center">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-1">
            <span className="text-white text-[10px] font-bold">TLS</span>
          </div>
          <p className="text-slate-400">加密</p>
        </div>
        <span className="text-emerald-400 text-lg">→</span>
        <div className="text-center">
          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center mx-auto mb-1">
            <span className="text-white text-[10px] font-bold">HK</span>
          </div>
          <p className="text-slate-400">照护团队</p>
        </div>
      </div>
      <p className="text-[9px] text-slate-500 text-center mt-3">All data stored in 常州 · HIPAA compliant · 256-bit AES encryption</p>
    </div>
  </div>
);

// Mini icons for device tab
const WatchIcon: FC<{ small?: boolean }> = ({ small }) => (
  <svg viewBox="0 0 24 24" className={small ? 'w-4 h-4 text-white' : 'w-6 h-6 text-white'} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="7" y="4" width="10" height="16" rx="4" />
    <circle cx="12" cy="9" r="2" />
    <line x1="12" y1="11" x2="12" y2="14" />
  </svg>
);
const BedDoubleIcon: FC = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 7v11" /><path d="M21 7v11" />
    <path d="M3 12h18" /><path d="M5 7L5 5a2 2 0 012-2h10a2 2 0 012 2v2" />
  </svg>
);

export default PatientDetailModal;
