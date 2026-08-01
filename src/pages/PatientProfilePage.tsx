import { useState, type FC, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PATIENTS_FULL, type PatientFull } from '../data/patients';
import { MONTHLY_SCHEDULE, getDailyActivitiesFromSchedule } from '../data/monthlySchedule';
import { CARE_TEAM, getPatientFamily, FAMILY_COMMS, CN_CARE_TEAM, type FamilyContact } from '../data/careTeam';
import { MEDICAL_HISTORY } from '../data/medicalHistory';
import { DEFAULT_VITALS } from '../store/patientStore';
import { usePatientStore } from '../store/patientStore';
import { syncAiSummaryNews, buildClinicalAlertText } from '../utils/medicalHistoryNews';
import { resolvePatientNews } from '../utils/patientNews';
import { deviceImageUrl } from '../data/deviceImages';
import { useCollaborationStore } from '../store/collaborationStore';
import { DEMO_CARE_PLAN_DATE, eliteTaskKey, getTodayActivities, summarizeCarePlanProgress } from '../utils/carePlanSync';
import PatientAvatar from '../components/PatientAvatar';
import SmartSummary from '../components/SmartSummary';
import VitalSignRecord from '../components/VitalSignRecord';
import AlertToggle from '../components/AlertToggle';
import { buildPatientBillingRows, getPatientInvoiceMeta, type PatientBillingRow } from '../utils/hubBillingSummary';
import type { InvoiceStatus } from '../data/hubInvoices';
import {
  ArrowLeft, User, Users, FileText, CalendarDays, ClipboardList,
  Smartphone, PhoneCall, Heart, Activity, Thermometer, Droplets,
  Brain, BedDouble, GlassWater, AlertTriangle, Eye, FileCheck,
  Phone, Mail, Clock, Pill, Stethoscope, FlaskConical, Microscope, X, CheckCircle2, Sparkles,
  Shield, Apple, BarChart3,
} from 'lucide-react';

type ProfileSection = 'smart_summary' | 'assessment' | 'medical' | 'vitals' | 'care_info' | 'logs' | 'iot' | 'billing';

const SECTIONS: { key: ProfileSection; label: string; icon: FC<{ className?: string }> }[] = [
  { key: 'smart_summary', label: '智能摘要', icon: Brain },
  { key: 'assessment', label: '评估情况', icon: ClipboardList },
  { key: 'medical', label: '病史档案', icon: FileText },
  { key: 'vitals', label: '体征记录', icon: Heart },
  { key: 'care_info', label: '照护信息', icon: Users },
  { key: 'logs', label: '照护记录', icon: CalendarDays },
  { key: 'iot', label: '设备串联', icon: Smartphone },
  { key: 'billing', label: '客户账单', icon: PhoneCall },
];

const PatientProfilePage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [section, setSection] = useState<ProfileSection>('smart_summary');
  
  const patient = PATIENTS_FULL.find(p => p.id === Number(id));
  const storePatient = usePatientStore(s => s.patients.find(p => p.id === Number(id)));
  const alertActive = usePatientStore(s => s.alertActive);
  const storeVitals = usePatientStore(s => s.vitals);
  const isCrit = alertActive && Number(id) === 7;
  if (!patient) return <div className="p-6 text-slate-500">未找到病人</div>;
  const displayPatient = storePatient || patient;

  const carePlans = usePatientStore(s => s.carePlans);
  const carePlanStatus = useCollaborationStore(s => s.carePlanStatus);
  const plan = carePlans[patient.id];
  const family = getPatientFamily(patient.id);
  const today = DEMO_CARE_PLAN_DATE;
  const todaySchedule = useMemo(
    () => {
      const monthlyActs = getDailyActivitiesFromSchedule(today);
      if (monthlyActs.length > 0) return monthlyActs;
      // fallback to old plan system for non-Aug dates
      return getTodayActivities(plan, patient.id, today, carePlanStatus);
    },
    [plan, patient.id, today, carePlanStatus],
  );
  const cp = patient.carePlan;
  const teamMembers = [
    cp.assignedCaseManager,
    cp.assignedNurse,
    cp.assignedRehabTherapist,
    cp.assignedNutritionist,
    cp.assignedCareWorker,
  ].filter((name): name is string => !!name && name !== '—');

  return (<>
    <div className="flex flex-1 min-h-0 overflow-hidden">
      <aside className="w-48 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <button onClick={() => navigate('/patient-records')} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-600 mb-3"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
          <div className="flex items-center gap-2">
            <PatientAvatar patientId={patient.id} size={40} />
            <div className="min-w-0"><p className="text-sm font-bold text-slate-800 truncate">{patient.name} <span className="text-[10px] font-normal text-slate-400 ml-1">#{String(patient.id).padStart(5,'0')}</span></p><p className="text-[10px] text-slate-400">{patient.gender}, {patient.age}</p></div>
          </div>
          <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[9px] font-bold ${isCrit?'bg-red-100 text-red-700':displayPatient.riskLevel==='High'?'bg-amber-100 text-amber-700':'bg-emerald-100 text-emerald-700'}`}>{isCrit?'Critical':displayPatient.riskLevel==='High'&&patient.id===7?'Stable':displayPatient.riskLevel} Risk</span>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {SECTIONS.map(s => { const Icon=s.icon; const isActive=section===s.key;
            return (<button key={s.key} onClick={()=>setSection(s.key)} className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium transition-all ${isActive?'bg-gold-100 text-gold-800':'text-slate-500 hover:bg-warm-100'}`}><Icon className="w-4 h-4"/>{s.label}</button>);
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto bg-warm-50 p-6">
        {section==='smart_summary'&&<SmartSummary patient={patient}/>}
        {section==='assessment'&&<AssessmentSection patient={patient} family={family}/>}
        {section==='medical'&&<MedicalSection patient={patient}/>}
        {section==='vitals'&&<VitalSignRecord patient={patient}/>}
        {section==='care_info'&&<CareInfoSection patient={patient} teamMembers={teamMembers} todaySchedule={todaySchedule} today={today}/>}
        {section==='logs'&&<LogsSection patient={displayPatient} plan={plan}/>}
        {section==='iot'&&<IoTDevicesSection patient={displayPatient}/>}
        {section==='billing'&&<BillingSection patientId={patient.id}/>}
      </main>
    </div>
    <AlertToggle />
  </>);
};

const ST: FC<{ title: string; icon: FC<{ className?: string }> }> = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-4"><Icon className="w-5 h-5 text-teal-600"/><h2 className="text-base font-semibold text-slate-800 font-display">{title}</h2></div>
);

const AssessmentSection: FC<{ patient: PatientFull; family: FamilyContact[] }> = ({ patient }) => {
  const sectionTitle = 'text-xs font-bold text-slate-700 flex items-center gap-2';
  const dotStyle = 'w-1.5 h-1.5 rounded-full flex-shrink-0';
  const labelStyle = 'text-[10px] text-slate-400 font-medium';
  const assessDate = patient.nursingRecords?.[(patient.nursingRecords?.length ?? 1) - 1]?.date || '2026-06-16';
  const caseManager = patient.carePlan?.assignedCaseManager?.split(' (')[0] || '待分配';

  return (
    <div className="space-y-5">
      <ST title="评估情况" icon={ClipboardList} />

      {/* 综合初评信息 */}
      <div className="glass-card rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-2.5">
          <ClipboardList className="w-4 h-4 text-teal-600" />
          <h3 className="text-xs font-bold text-slate-700">基础信息</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2.5 bg-white rounded-lg border border-slate-100">
            <span className={labelStyle}>评估日期</span>
            <p className="text-xs text-slate-700 font-medium">{assessDate}</p>
          </div>
          <div className="p-2.5 bg-white rounded-lg border border-slate-100">
            <span className={labelStyle}>评估地点</span>
            <p className="text-xs text-slate-700 font-medium">江苏省常州市金坛区指前镇解放村接王家村3号</p>
          </div>
          <div className="p-2.5 bg-white rounded-lg border border-slate-100">
            <span className={labelStyle}>评估人员</span>
            <p className="text-xs text-slate-700 font-medium">李妍</p>
          </div>
          <div className="p-2.5 bg-white rounded-lg border border-slate-100">
            <span className={labelStyle}>家属在场</span>
            <p className="text-xs text-slate-700 font-medium">王小凤（配偶）</p>
          </div>
        </div>
      </div>

      {/* 评估量表 — 仅总分，无细项 */}
      <div className="glass-card rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-2.5">
          <FileCheck className="w-4 h-4 text-teal-600" />
          <h3 className="text-xs font-bold text-slate-700">评估量表</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-3">
          {patient.barthel && (
            <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardList className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-bold text-slate-700">Barthel ADL</span>
              </div>
              <p className="text-2xl font-extrabold text-teal-600">{patient.barthel.score}
                <span className="text-xs text-teal-400">/{patient.barthel.items.reduce((s,i) => s + i.maxScore, 0)}</span>
              </p>
              <p className="text-[10px] text-teal-500 mt-1 font-medium">重度依赖</p>
            </div>
          )}
          {patient.braden && (
            <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-slate-700">Braden 压疮</span>
              </div>
              <p className="text-2xl font-extrabold text-amber-600">{patient.braden.score}<span className="text-xs text-amber-400">/23</span></p>
              <p className="text-[10px] text-amber-500 mt-1 font-medium">{patient.braden.score <= 16 ? '有压疮风险' : '低风险'}</p>
            </div>
          )}
          {patient.fallRisk && (
            <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Activity className={`w-4 h-4 ${patient.fallRisk.score > 35 ? 'text-red-600' : 'text-green-600'}`} />
                <span className="text-xs font-bold text-slate-700">跌倒风险</span>
              </div>
              <p className={`text-2xl font-extrabold ${patient.fallRisk.score > 35 ? 'text-red-600' : 'text-green-600'}`}>{patient.fallRisk.score}</p>
              <p className={`text-[10px] mt-1 font-medium ${patient.fallRisk.score > 35 ? 'text-red-500' : 'text-green-500'}`}>
                {patient.fallRisk.score > 35 ? '极高危' : '正常'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 认知能力 + 居家安全 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <Brain className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-700">认知能力</h3>
          </div>
          <div className="space-y-2">
            {[
              { dot: 'bg-blue-500', label: '意识状态', value: '清醒，定向力完整' },
              { dot: 'bg-blue-500', label: '沟通能力', value: '正常，可自主表达' },
              { dot: 'bg-blue-500', label: '记忆力', value: '轻度减退（符合年龄）' },
            ].map((r, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 bg-white rounded-lg border border-slate-100">
                <span className={`${dotStyle} ${r.dot} mt-1.5`} />
                <div className="flex-1 min-w-0 flex justify-between items-center">
                  <span className={labelStyle}>{r.label}</span>
                  <span className="text-xs text-slate-700 font-semibold">{r.value}</span>
                </div>
              </div>
            ))}
            <div className="mt-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-400">注：认知评估基于护理记录和家属反馈，非标准化MMSE。</span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <Shield className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold text-slate-700">居家安全</h3>
          </div>
          {(patient as any).homeSafety ? (
            <div className="space-y-2">
              {[
                { dot: 'bg-amber-500', label: '总体风险', value: (patient as any).homeSafety.overallRisk, valColor: 'text-amber-600' },
                { dot: 'bg-amber-500', label: '地面类型', value: (patient as any).homeSafety.floorType },
                { dot: 'bg-amber-500', label: '照明', value: (patient as any).homeSafety.lighting },
                { dot: 'bg-amber-500', label: '卫生间', value: (patient as any).homeSafety.bathroom },
                { dot: 'bg-amber-500', label: '扶手/抓杆', value: (patient as any).homeSafety.grabBars },
                { dot: 'bg-amber-500', label: '紧急呼叫', value: (patient as any).homeSafety.emergencyCall },
              ].map((r, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 bg-white rounded-lg border border-slate-100">
                  <span className={`${dotStyle} ${r.dot} mt-1.5`} />
                  <div className="flex-1 min-w-0 flex justify-between items-center">
                    <span className={labelStyle}>{r.label}</span>
                    <span className={`text-xs font-semibold ${r.valColor ?? 'text-slate-700'}`}>{r.value}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 mt-3">暂无居家安全评估数据</p>
          )}
        </div>
      </div>

      {/* 转归目标 */}
      {patient.careType === '长护险' && (patient as any).outcomeTargets && (
        <div className="glass-card rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-700">转归目标</h3>
          </div>
          <div className="space-y-2">
            {(patient as any).outcomeTargets.map((ot: any, i: number) => (
              <div key={i} className="flex items-start gap-2.5 p-3 bg-white rounded-lg border border-slate-100">
                <span className={`${dotStyle} bg-emerald-500 mt-1.5`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">{ot.indicator}</span>
                    <span className="text-[9px] text-slate-400">基线：{ot.baseline}</span>
                  </div>
                  <div className="flex gap-3 mt-1.5">
                    {[
                      { label: '30天', val: ot.day30 },
                      { label: '90天', val: ot.day90 },
                      { label: '180天', val: ot.day180 },
                    ].map((d, j) => (
                      <span key={j} className="text-[10px]">
                        <span className="text-slate-400">{d.label}</span>{' '}
                        <span className="font-bold text-emerald-600">{d.val}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Overview: FC<{ patient: PatientFull; family: FamilyContact[]; isCrit: boolean; displayPatient: PatientFull }> = ({ patient, family, isCrit, displayPatient }) => {
  const storeVitals = usePatientStore(s => s.vitals);
  const patientsSummary = usePatientStore(s => s.patientsSummary);
  const summary = patientsSummary.find(p => p.id === patient.id);
  const v = storeVitals[patient.id] || DEFAULT_VITALS[patient.id] || DEFAULT_VITALS[1];
  const alertActive = usePatientStore(s => s.alertActive);
  const { score: newsScore, tier: newsTier, label: newsLabel, monitoringLabel, escalation, redScore } = resolvePatientNews(
    patient.id,
    patient.diagnosis,
    v,
    summary,
    alertActive && patient.id === 1,
  );
  const sleepData = isCrit ? [{l:'Duration',v:'4.2 hrs'},{l:'Resp Rate',v:'24/min'},{l:'Score',v:'58/100'}] : [{l:'Duration',v:'6.8 hrs'},{l:'Resp Rate',v:'18/min'},{l:'Score',v:'82/100'}];
  const ioData = isCrit ? [{l:'Oral',v:'~900 mL'},{l:'Urine',v:'~600 mL'},{l:'Balance',v:'+300 mL'}] : [{l:'Oral',v:'~1,400 mL'},{l:'Urine',v:'~1,100 mL'},{l:'Balance',v:'+300 mL'}];
  const mentalData = isCrit
    ? [{l:'Alertness',v:'Intermittent confusion'},{l:'Orientation',v:'AMTS 7–9/10'},{l:'Mood',v:'Anxious'},{l:'Pain',v:'3/10'}]
    : [{l:'Alertness',v:'Alert'},{l:'Orientation',v:'AMTS 10/10'},{l:'Mood',v:'Calm'},{l:'Pain',v:'2/10'}];
  const clinicalAlertText = buildClinicalAlertText(patient.id, patient.diagnosis, v);
  const alertTone = newsTier === 'high' ? 'crit' : newsTier === 'medium' || redScore ? 'warn' : 'stable';
  return (<div className="space-y-4"><ST title="患者概览" icon={User}/>
    <div className="grid grid-cols-4 gap-3">
      {[{label:'RR',value:String(v.rr),unit:'/min',icon:Activity,c:'text-teal-500'},{label:'Pulse',value:String(v.hr),unit:'bpm',icon:Heart,c:'text-red-500'},{label:'SBP',value:String(v.bpSystolic),unit:'mmHg',icon:Activity,c:'text-blue-500'},{label:'DBP',value:String(v.bpDiastolic),unit:'mmHg',icon:Activity,c:'text-blue-400'},{label:'SpO₂',value:String(v.spo2),unit:'%',icon:Droplets,c:'text-cyan-500'},{label:'Glucose',value:String(v.bloodSugar),unit:'mg/dL',icon:Activity,c:'text-purple-500'},{label:'Temp',value:String(v.temp),unit:'°C',icon:Thermometer,c:'text-amber-500'}].map((v2,i)=>(<div key={i} className="glass-card rounded-xl border border-slate-200 p-3"><div className="flex items-center gap-2 mb-2"><v2.icon className={`w-4 h-4 ${v2.c}`}/><span className="text-[10px] text-slate-400">{v2.label}</span></div><p className="text-lg font-bold text-slate-800">{v2.value}<span className="text-xs text-slate-400 ml-1">{v2.unit}</span></p></div>))}
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="glass-card rounded-xl border border-slate-200 p-4"><h3 className="text-xs font-bold text-slate-600 mb-3">基本信息</h3>
        <div className="space-y-2 text-xs">{[{l:'姓名',v:patient.name},{l:'性别',v:patient.gender},{l:'年龄',v:`${patient.age} years`},{l:'诊断',v:patient.diagnosis},{l:'ICD-10',v:patient.diagnosisCodes.join(', ')},{l:'过敏史',v:patient.allergies.join(', ')||'None'},{l:'风险评分',v:`${newsScore} (${newsLabel})`},{l:'监测频率',v:monitoringLabel},{l:'升级方案',v:escalation},{l:'意识',v:v.avpu ?? 'A'},{l:'血氧等级',v:String(v.spo2Scale ?? 2)}].map((r,i)=>(<div key={i} className="flex justify-between gap-3"><span className="text-slate-400 flex-shrink-0">{r.l}</span><span className="font-semibold text-slate-700 text-right">{r.v}</span></div>))}</div>
      </div>
      <div className="glass-card rounded-xl border border-slate-200 p-4"><h3 className="text-xs font-bold text-slate-600 mb-3">家庭联系人</h3>
        {family.length === 0 ? (
          <p className="text-xs text-slate-400">未登记家属联系方式。</p>
        ) : family.map((f,i)=>(<div key={i} className={`pb-3 mb-3 ${i<family.length-1?'border-b border-slate-100':''}`}><div className="flex items-center gap-2 mb-1"><span className="text-xs font-bold text-slate-700">{f.name}</span>{f.isPrimary&&<span className="text-[9px] bg-blue-100 text-teal-700 px-1.5 py-0.5 rounded-full font-bold">主要</span>}{f.livingWith&&<span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">同住</span>}</div><p className="text-[10px] text-slate-400">{f.relationship}</p><div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500"><span className="flex items-center gap-1"><Phone className="w-3 h-3"/>{f.phone}</span>{f.email&&<span className="flex items-center gap-1"><Mail className="w-3 h-3"/>{f.email}</span>}</div>{f.notes&&<p className="text-[10px] text-slate-400 mt-1">{f.notes}</p>}</div>))}
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div className="glass-card rounded-xl border border-slate-200 p-4"><h3 className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1.5"><BedDouble className="w-3.5 h-3.5 text-indigo-500"/>睡眠</h3><div className="space-y-1.5 text-xs">{sleepData.map((s,i)=>(<div key={i} className="flex justify-between"><span className="text-slate-400">{s.l}</span><span className="font-semibold text-slate-700">{s.v}</span></div>))}</div></div>
      <div className="glass-card rounded-xl border border-slate-200 p-4"><h3 className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1.5"><GlassWater className="w-3.5 h-3.5 text-cyan-500"/>出入量</h3><div className="space-y-1.5 text-xs">{ioData.map((s,i)=>(<div key={i} className="flex justify-between"><span className="text-slate-400">{s.l}</span><span className="font-semibold text-slate-700">{s.v}</span></div>))}</div></div>
      <div className="glass-card rounded-xl border border-slate-200 p-4"><h3 className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1.5"><Brain className="w-3.5 h-3.5 text-purple-500"/>精神状态</h3><div className="space-y-1.5 text-xs">{mentalData.map((s,i)=>(<div key={i} className="flex justify-between"><span className="text-slate-400">{s.l}</span><span className="font-semibold text-slate-700">{s.v}</span></div>))}</div></div>
    </div>
    <div className={`rounded-xl p-4 ${alertTone === 'crit' ? 'bg-red-50 border border-red-200' : alertTone === 'warn' ? 'bg-amber-50 border border-amber-200' : 'bg-emerald-50 border border-emerald-200'}`}><div className="flex items-start gap-2"><AlertTriangle className={`w-4 h-4 mt-0.5 ${alertTone === 'crit' ? 'text-red-500' : alertTone === 'warn' ? 'text-amber-500' : 'text-emerald-500'}`}/><div className="text-xs"><p className="font-bold text-slate-700">AI临床提醒</p><p className="text-slate-600 mt-0.5">{clinicalAlertText}</p></div></div></div>
  </div>);}

const CareInfoSection: FC<{ patient: PatientFull; teamMembers: string[]; todaySchedule: any[]; today: string }> = ({ patient, teamMembers, todaySchedule, today }) => {
  const plan = usePatientStore(s => s.carePlans[patient.id]);
  const taskTimes = useCollaborationStore(s => s.eliteTaskTimes);
  const { completed, total, missed } = useMemo(
    () => summarizeCarePlanProgress(todaySchedule),
    [todaySchedule],
  );
  const [carePlanModal, setCarePlanModal] = useState(false);
  const [cvMember, setCvMember] = useState<any>(null);

  const statusDot = (status: string) => {
    switch (status) {
      case 'completed': return { color: 'bg-emerald-500', text: '已完成', pulse: true };
      case 'in_progress': return { color: 'bg-teal-500', text: '进行中', pulse: true };
      case 'missed': return { color: 'bg-red-500', text: '异常', pulse: true };
      default: return { color: 'bg-amber-400', text: '待完成', pulse: false };
    }
  };

  return (
    <div className="-mt-6">
      <div className="sticky top-0 z-10 bg-warm-50 -mx-6 px-6 pt-6 pb-3">
        <ST title="照护信息" icon={Brain} />
      </div>
      <div className="space-y-4 mt-1">

        {/* ━━━ 1. 护理团队 ━━━ */}
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-600" />
            护理团队
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {teamMembers.map((name, i) => {
              const m = CN_CARE_TEAM[name];
              if (!m) return null;
              return (
                <div key={i} className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 cursor-pointer hover:shadow-md hover:border-teal-300 transition-all group" onClick={() => setCvMember(m)}>
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                      <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-teal-700">{m.name}</p>
                      <p className="text-[10px] font-medium text-teal-600">
                        {m.role}{m.registrationNo ? <span className="ml-1 text-[9px] text-slate-400">#{m.registrationNo}</span> : null}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{m.specialty}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{m.institution}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {m.certifications.slice(0, 2).map((c: string, j: number) => (
                          <span key={j} className="text-[9px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded font-medium">{c}</span>
                        ))}
                        {m.certifications.length > 2 && <span className="text-[9px] text-teal-400">+{m.certifications.length - 2}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ━━━ 2. 护理概览 ━━━ */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-teal-600" />
              护理概览
            </h3>
            <button onClick={() => setCarePlanModal(true)} className="text-[10px] font-medium text-teal-600 hover:text-teal-800">查看完整计划 →</button>
          </div>
          <div className="border-b border-slate-100 grid grid-cols-[80px_1fr_88px_72px] gap-2 px-5 pb-2">
            <span className="text-[10px] font-semibold text-slate-400">角色</span>
            <span className="text-[10px] font-semibold text-slate-400">服务内容</span>
            <span className="text-[10px] font-semibold text-slate-400">频次</span>
            <span className="text-[10px] font-semibold text-slate-400 text-right">时长</span>
          </div>
          <div>
            {[
              { role: '个案经理', service: '服务协调、进度跟踪、家属沟通、长护险对接', freq: '持续', duration: '按需', color: 'border-l-teal-600' },
              { role: '护理员', service: '助餐、助浴、助行、用药提醒、翻身、压疮护理', freq: patient.carePlan.serviceFrequency, duration: patient.carePlan.visitDuration, color: 'border-l-amber-500' },
              { role: '护士', service: '生命体征监测、压疮评估、用药依从性检查、健康教育', freq: '每周1次', duration: '45 min', color: 'border-l-teal-500' },
              ...(patient.carePlan.assignedRehabTherapist && patient.carePlan.assignedRehabTherapist !== '—' ? [{ role: '康复师', service: '被动关节活动、肌力训练、助行器训练', freq: '2次/周', duration: '45 min', color: 'border-l-purple-500' }] : []),
              ...(patient.carePlan.assignedNutritionist && patient.carePlan.assignedNutritionist !== '—' ? [{ role: '营养师', service: '营养评估、膳食指导、蛋白补充方案', freq: '每月1次', duration: '30 min', color: 'border-l-emerald-500' }] : []),
            ].map((r, i) => (
              <div key={i} className={`grid grid-cols-[80px_1fr_88px_72px] gap-2 px-5 py-2.5 text-xs items-start border-l-2 ${r.color} bg-slate-50/50 border-b border-slate-100`}>
                <span className="font-semibold text-slate-700 text-[10px]">{r.role}</span>
                <span className="text-slate-600 text-[10px] leading-relaxed">{r.service}</span>
                <span className="text-[10px] text-slate-500">{r.freq}</span>
                <span className="text-[10px] text-slate-400 text-right">{r.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ━━━ 3. 用药概览 ━━━ */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <Pill className="w-4 h-4 text-teal-600" />
              用药概览
            </h3>
          </div>
          <div className="border-b border-slate-100 grid grid-cols-[1fr_80px_80px_60px] gap-2 px-5 pb-2">
            <span className="text-[10px] font-semibold text-slate-400">药品</span>
            <span className="text-[10px] font-semibold text-slate-400">剂量</span>
            <span className="text-[10px] font-semibold text-slate-400">频率</span>
            <span className="text-[10px] font-semibold text-slate-400 text-right">库存</span>
          </div>
          <div>
            {patient.medications.map((med, i) => {
              const todayObj = new Date(today);
              const start = new Date(med.startDate);
              const daysSince = Math.max(0, Math.floor((todayObj.getTime() - start.getTime()) / 86400000));
              const stockDays = med.status === 'Active' ? Math.max(1, 30 - (daysSince % 30)) : 0;
              const stockLow = stockDays <= 7;
              const stockWarn = !stockLow && stockDays <= 14;
              const stockColor = stockLow ? 'text-red-600' : stockWarn ? 'text-amber-600' : 'text-emerald-600';
              return (
                <div key={i} className="grid grid-cols-[1fr_80px_80px_60px] gap-2 px-5 py-2.5 text-xs items-start border-b border-slate-100 bg-slate-50/50">
                  <span className="font-semibold text-slate-700 text-[10px]">{med.drug}</span>
                  <span className="text-slate-500 text-[10px]">{med.dose}·{med.route}</span>
                  <span className="text-slate-500 text-[10px]">{med.frequency}</span>
                  <span className={`font-semibold text-[10px] text-right ${stockColor} ${stockLow ? 'animate-pulse' : ''}`}>{stockDays}/30d</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ━━━ 4. 增值服务 ━━━ */}
        {patient.serviceModules && patient.serviceModules.length > 0 && (
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              增值服务
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {patient.serviceModules.map((m: any) => {
                const iconMap: Record<string, { icon: typeof BedDouble; color: string }> = {
                  M1: { icon: BedDouble, color: 'text-teal-500' },
                  M2: { icon: Shield, color: 'text-amber-500' },
                  M3: { icon: Activity, color: 'text-indigo-500' },
                  M4: { icon: Heart, color: 'text-red-500' },
                  M5: { icon: Apple, color: 'text-emerald-500' },
                  M6: { icon: Stethoscope, color: 'text-purple-500' },
                  M7: { icon: BarChart3, color: 'text-cyan-500' },
                };
                const entry = iconMap[m.id] || { icon: Sparkles, color: 'text-slate-400' };
                const Icon = entry.icon;
                return (
                  <div key={m.id} className="bg-white border border-slate-100 rounded-xl px-3 py-2.5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Icon className={`w-4 h-4 ${entry.color}`} />
                      <span className="text-[10px] font-bold text-slate-800">{m.name}</span>
                      <span className="text-[9px] text-slate-400 bg-slate-100 px-1 py-0.5 rounded ml-auto">{m.frequency}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">{m.content}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ━━━ 5. 当日完成情况 ━━━ */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            当日完成情况
            <span className="text-[10px] font-normal text-slate-400 ml-1">8月16日（周日）</span>
            </h3>
          </div>
          <div className="border-b border-slate-100 grid grid-cols-[1fr_1.2fr_1fr_1fr_80px] gap-2 px-5 pb-2">
            <span className="text-[10px] font-semibold text-slate-400">项目</span>
            <span className="text-[10px] font-semibold text-slate-400">详情</span>
            <span className="text-[10px] font-semibold text-slate-400">计划时段</span>
            <span className="text-[10px] font-semibold text-slate-400">实际时段</span>
            <span className="text-[10px] font-semibold text-slate-400 text-center">状态</span>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {todaySchedule.length > 0 ? todaySchedule.map((act: any, i: number) => {
              const taskKey = eliteTaskKey(patient.id, act.time, act.activity);
              const times = taskTimes[taskKey] || {};
              const sd = statusDot(act.status);
              return (
                <div key={i} className={`grid grid-cols-[1fr_1.2fr_1fr_1fr_80px] gap-2 px-5 py-2.5 text-xs items-start border-b border-slate-50 hover:bg-slate-50/50 ${act.status === 'missed' ? 'bg-red-50/50' : ''}`}>
                  <span className="text-slate-700 font-medium text-[10px] leading-relaxed">{act.activity}</span>
                  <span className="text-[10px] text-slate-500 leading-relaxed">{act.detail}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{act.scheduled || '—'}</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {times.clockIn ? `${times.clockIn}${times.clockOut ? ` – ${times.clockOut}` : ''}` : act.clockIn ? `${act.clockIn}${act.clockOut ? ` – ${act.clockOut}` : ''}` : '—'}
                  </span>
                  <div className="flex items-center gap-1.5 justify-center">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${sd.color} ${sd.pulse ? 'animate-pulse' : ''}`} />
                    <span className="text-[10px] text-slate-500">{sd.text}</span>
                  </div>
                </div>
              );
            }) : <p className="text-xs text-slate-400 px-5 py-4 text-center">今日暂无排程</p>}
          </div>
        </div>

      </div>

      {/* ── 团队简历弹窗 ── */}
      {cvMember && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/30" onClick={() => setCvMember(null)}>
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-h-[80vh] overflow-y-auto m-4 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-teal-800 px-5 py-4 flex items-center justify-between z-10 rounded-t-2xl">
              <h3 className="text-sm font-semibold text-white">团队成员简历</h3>
              <button onClick={() => setCvMember(null)} className="text-white/80 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              {/* Header with avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md border-2 border-teal-100">
                  <img src={cvMember.avatar} alt={cvMember.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{cvMember.name}</p>
                  <p className="text-xs text-teal-600 font-medium">{cvMember.role} · {cvMember.registrationNo}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{cvMember.institution}</p>
                </div>
              </div>
              {/* Basic info */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '性别', value: cvMember.gender },
                  { label: '年龄', value: `${cvMember.age}岁` },
                  { label: '从业年限', value: `${cvMember.yearsExperience}年` },
                ].map((f, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg px-3 py-2 text-center">
                    <p className="text-[9px] text-slate-400">{f.label}</p>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">{f.value}</p>
                  </div>
                ))}
              </div>
              {/* Education */}
              <div>
                <p className="text-[10px] font-semibold text-slate-400 mb-1">教育经历</p>
                <p className="text-xs text-slate-700 bg-slate-50 rounded-lg px-3 py-2">{cvMember.education}</p>
              </div>
              {/* Certifications */}
              <div>
                <p className="text-[10px] font-semibold text-slate-400 mb-1">资质证书</p>
                <div className="flex flex-wrap gap-1.5">
                  {cvMember.certifications.map((c: string, j: number) => (
                    <span key={j} className="text-[10px] bg-teal-50 text-teal-700 px-2 py-1 rounded-full font-medium border border-teal-100">{c}</span>
                  ))}
                </div>
              </div>
              {/* Specialty */}
              <div>
                <p className="text-[10px] font-semibold text-slate-400 mb-1">专业方向</p>
                <p className="text-xs text-slate-700 bg-slate-50 rounded-lg px-3 py-2">{cvMember.specialty}</p>
              </div>
              {/* Bio */}
              <div>
                <p className="text-[10px] font-semibold text-slate-400 mb-1">从业经验</p>
                <p className="text-xs text-slate-700 bg-slate-50 rounded-lg px-3 py-2 leading-relaxed">{cvMember.bio}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {carePlanModal && (
      <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/30" onClick={() => setCarePlanModal(false)}>
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-h-[80vh] overflow-y-auto m-4 w-full max-w-lg" onClick={e => e.stopPropagation()}>
          <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-teal-800 px-5 py-4 flex items-center justify-between z-10 rounded-t-2xl">
            <h3 className="text-sm font-semibold text-white">完整护理计划</h3>
            <button onClick={() => setCarePlanModal(false)} className="text-white/80 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <div className="p-5 space-y-4">
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-3">
              <p className="text-[10px] text-teal-700 font-semibold mb-1">📋 月度排程概览</p>
              <p className="text-xs text-teal-600">{patient.carePlan.serviceFrequency} · 每次{patient.carePlan.visitDuration} · 共{MONTHLY_SCHEDULE.length}次上门</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium mb-2">2026年8月 详细排程（周一/周三/周五/周日 · 每周4次）</p>
              <div className="overflow-x-auto -mx-1">
                <table className="w-full text-[10px] border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-500">
                      <th className="text-left px-2 py-1.5 w-[24px]">#</th>
                      <th className="text-left px-2 py-1.5 w-[44px]">日期</th>
                      <th className="text-left px-2 py-1.5 w-[66px]">时段</th>
                      <th className="text-left px-2 py-1.5 w-[58px]">角色</th>
                      <th className="text-left px-2 py-1.5">服务内容</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {MONTHLY_SCHEDULE.map((row, i) => (
                      <tr key={i} className={`hover:bg-slate-50 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                        <td className="px-2 py-1.5 text-slate-400">{i + 1}</td>
                        <td className="px-2 py-1.5 font-semibold text-slate-700 whitespace-nowrap">{row.d}</td>
                        <td className="px-2 py-1.5 text-teal-600 font-medium whitespace-nowrap">{row.t}</td>
                        <td className="px-2 py-1.5 text-slate-600 whitespace-nowrap">{row.r}</td>
                        <td className="px-2 py-1.5 text-slate-600 leading-relaxed">
                          {row.c}
                          <div className="text-[9px] text-slate-400 mt-0.5 italic">{row.ref}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium mb-2">照护目标（30天）</p>
              <ul className="space-y-1">
                {patient.carePlan.goals.map((g, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />{g}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium mb-2">注意事项</p>
              <ul className="space-y-1">
                {patient.carePlan.precautions.map((p, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />{p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};


const MedicalSection: FC<{ patient: PatientFull }> = ({ patient }) => {
  const history = MEDICAL_HISTORY[patient.id];
  const entries = Array.isArray(history) ? history : (history?.entries || []);
  const [reportModal, setReportModal] = useState<string | null>(null);

  const typeIcon: Record<string, FC<{ className?: string }>> = {
    admission: Stethoscope, discharge: FileText, surgery: Heart,
    outpatient: User, er: AlertTriangle, followup: CalendarDays,
  };
  const typeLabel: Record<string, string> = {
    admission: '入院', discharge: '出院', surgery: '手术',
    outpatient: '门诊', er: '急诊', followup: '复诊',
  };

  const getReport = (text: string, type: 'lab' | 'imaging') => {
    const lines = text.split('. ');
    if (type === 'lab') {
    return '═══ LABORATORY REPORT ═══\n\n'
      + 'Patient: ' + patient.name + '\n'
      + 'DOB: ' + (2026 - patient.age) + ' | Gender: ' + patient.gender + '\n'
      + 'Facility: ' + (entries[0]?.facility || 'N/A') + '\n'
      + 'Ordering Physician: ' + (entries[0]?.physician || 'N/A') + '\n'
      + 'Collection Date: ' + (entries[0]?.date || 'N/A') + '\n'
      + 'Reported Date: ' + (entries[0]?.date || 'N/A') + '\n\n'
      + '━━━ RESULTS ━━━\n\n'
      + 'HEMATOLOGY\n' + lines.slice(0, 5).map(l => '  ' + l).join('\n') + '\n\n'
      + 'CHEMISTRY\n' + lines.slice(5, 10).map(l => '  ' + l).join('\n') + '\n\n'
      + '━━━ REFERENCE RANGES ━━━\n'
      + 'WBC: 4.0-11.0 | Hb: 11.5-16.0 | Plt: 150-400\n'
      + 'Cr: 50-110 | eGFR: >60 | K+: 3.5-5.0\n\n'
      + '━━━ INTERPRETATION ━━━\n'
      + 'Results verified by clinical laboratory.\n'
      + 'Abnormal values flagged per protocol.\n\n'
      + 'Signed: Clinical Lab · HOKLAS 015';
    } else {
    return '═══ IMAGING REPORT ═══\n\n'
      + 'Patient: ' + patient.name + '\n'
      + 'DOB: ' + (2026 - patient.age) + ' | Gender: ' + patient.gender + '\n'
      + 'Facility: ' + (entries[0]?.facility || 'N/A') + '\n'
      + 'Referring: ' + (entries[0]?.physician || 'N/A') + '\n'
      + 'Study Date: ' + (entries[0]?.date || 'N/A') + '\n'
      + 'Modality: ' + ('CXR/CT/ECHO/MRI based on study') + '\n\n'
      + '━━━ FINDINGS ━━━\n\n'
      + text.split(', ').map(l => '  • ' + l).join('\n') + '\n\n'
      + '━━━ IMPRESSION ━━━\n'
      + 'As described. Clinical correlation recommended.\n\n'
      + 'Signed: Radiology Dept · Board Certified';
    }
  };

  const aiSummaryData = history?.aiSummary
    ? syncAiSummaryNews(patient.id, patient.diagnosis, history.aiSummary)
    : null;
  const { overview = '', concerns = [] } = aiSummaryData || {};

  return (
  <div>
    <div className="sticky top-0 z-10 bg-warm-50 -mx-6 px-6 pt-6 pb-3">
    <ST title="病史档案" icon={FileText} />
    <p className="text-[10px] text-slate-400 mt-0.5">
      基于 {entries.length} 条临床记录、AI智能分析及评估量表数据生成
    </p>
    </div>
    <div className="space-y-3 px-6 pb-6">
    {/* ─── 临床病史摘要 ─── */}
    <div className="glass-card rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-2 mb-2.5">
        <Stethoscope className="w-4 h-4 text-teal-600" />
        <h3 className="text-xs font-bold text-slate-700">临床病史摘要</h3>
      </div>
      <div className="space-y-2.5">
        <div className="flex items-center gap-2.5">
          <User className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-px" />
          <div>
            <span className="text-[10px] text-slate-400 font-medium">基本信息</span>
            <p className="text-xs text-slate-700 font-medium">{patient.age}岁 男性 · 身高{patient.height || 164}cm · 体重{patient.weight || 70}kg · 配偶照护</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Activity className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-px" />
          <div>
            <span className="text-[10px] text-slate-400 font-medium">主要诊断</span>
            <p className="text-xs text-slate-700 font-medium">{patient.diagnosis || '高血压2级 · 双侧肢体活动异常 · 压疮 · Barthel 30分（重度依赖）'}</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Heart className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] text-slate-400 font-medium">Barthel · {patient.barthel?.score || 30}/100（重度依赖）</span>
            <p className="text-xs text-slate-700">双侧上下肢活动异常，需助行器辅助，日常生活完全依赖</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Shield className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] text-slate-400 font-medium">Braden · {patient.braden?.score || 16}分（中度风险）</span>
            <p className="text-xs text-slate-700">已有压疮，Braden 16分提示中度风险，需翻身q2h</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] text-slate-400 font-medium">Morse · {patient.fallRisk?.score || 105}（极高危）</span>
            <p className="text-xs text-slate-700">近3月有跌倒史，步态异常，需持续防跌倒措施</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Eye className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-px" />
          <div>
            <span className="text-[10px] text-slate-400 font-medium">认知/意识</span>
            <p className="text-xs text-slate-700 font-medium">意识清醒，定向力完整；半自理，需部分生活协助</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <ClipboardList className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-px" />
          <div className="flex-1">
            <span className="text-[10px] text-slate-400 font-medium">照护需求</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              <span className="text-[10px] bg-slate-100 border border-slate-200 rounded px-2 py-0.5 text-slate-600">翻身 q2h</span>
              <span className="text-[10px] bg-slate-100 border border-slate-200 rounded px-2 py-0.5 text-slate-600">压疮护理</span>
              <span className="text-[10px] bg-slate-100 border border-slate-200 rounded px-2 py-0.5 text-slate-600">血压监测</span>
              <span className="text-[10px] bg-slate-100 border border-slate-200 rounded px-2 py-0.5 text-slate-600">防跌倒</span>
              <span className="text-[10px] bg-slate-100 border border-slate-200 rounded px-2 py-0.5 text-slate-600">助行器辅助</span>
            </div>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-100 flex items-start gap-2.5">
          <FileCheck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] text-slate-400 font-medium">评估来源</span>
            <p className="text-[10px] text-slate-500">易得康评估机构 · 评估者：李妍 · 评估日期：2026.04.01</p>
            <p className="text-[10px] text-amber-500 mt-0.5">⚠ 待确认：Barthel ADL 手写总分=60 vs 勾选累加=30，差异待确认</p>
          </div>
        </div>
      </div>
    </div>
    {history?.aiSummary && (
      <div className="glass-card rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-violet-500" />
          <h3 className="text-xs font-bold text-slate-700">智能病史分析</h3>
          <span className="text-[9px] bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-md font-semibold tracking-wide">AI</span>
        </div>

        {/* Overview */}
        <p className="text-xs text-slate-600 leading-relaxed mb-3">{overview}</p>

        {/* Divider */}
        <div className="h-px bg-slate-100 mb-3" />

        {/* 核心关注点 */}
        <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">核心关注点</h4>
        <div className="space-y-2">
          {concerns.map((c, i) => {
            const dots: { color: string; label: string }[] = [
              { color: '#E11D48', label: '血压管理' },    // rose
              { color: '#D97706', label: '压疮防控' },    // amber
              { color: '#DC2626', label: '跌倒风险' },    // red
              { color: '#7C3AED', label: '功能康复' },    // purple
              { color: '#0D9488', label: '照护支持' },    // teal
            ];
            const d = dots[i] || dots[0];
            return (
              <div key={i} className="bg-white rounded-lg border border-slate-200 px-3 py-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <p className="text-[10px] text-slate-700 leading-relaxed">{c}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )}
    {entries.length > 0 && (
    <div className="glass-card rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-4 h-4 text-teal-600" />
        <h3 className="text-xs font-bold text-slate-700">临床记录 · {entries.length}条</h3>
      </div>
      <div className="space-y-3">
    {entries.map((entry, i) => (
      <div key={i} className="bg-white rounded-lg border border-slate-200 p-3">
        <div className="flex items-center gap-2 mb-2">
          {(() => { const Icon = typeIcon[entry.type] || FileText; return <Icon className="w-3.5 h-3.5 text-teal-600" />; })()}
          <span className="text-xs font-bold text-slate-700">{typeLabel[entry.type]}</span>
          <span className="text-[10px] text-slate-400">{entry.date} · {entry.facility}</span>
          <span className="text-[10px] text-slate-400 ml-auto">{entry.physician}</span>
        </div>
          <div><span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">主诉</span><p className="text-xs text-slate-700 mt-0.5">{entry.chiefComplaint}</p></div>
          <div><span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">诊断</span><p className="text-xs text-slate-700 mt-0.5 leading-relaxed">{entry.diagnosis}</p></div>
          {entry.labs && (
            <div className="flex items-start gap-2 cursor-pointer hover:bg-purple-50 rounded-lg p-1.5 -mx-1.5 transition-colors group" onClick={() => setReportModal(getReport(entry.labs!, 'lab'))}>
              <FlaskConical className="w-3.5 h-3.5 text-purple-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1"><span className="text-[10px] font-semibold text-purple-600">检验结果</span><button className="ml-2 text-[9px] text-purple-400 font-medium hover:text-purple-600 hover:underline group-hover:text-purple-600">查看完整报告 →</button><p className="text-[10px] text-slate-600 mt-0.5">{entry.labs}</p></div>
            </div>
          )}
          {entry.imaging && (
            <div className="flex items-start gap-2 cursor-pointer hover:bg-indigo-50 rounded-lg p-1.5 -mx-1.5 transition-colors group" onClick={() => setReportModal(getReport(entry.imaging!, 'imaging'))}>
              <Microscope className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1"><span className="text-[10px] font-semibold text-indigo-600">影像</span><button className="ml-2 text-[9px] text-indigo-400 font-medium hover:text-indigo-600 hover:underline group-hover:text-indigo-600">查看完整报告 →</button><p className="text-[10px] text-slate-600 mt-0.5">{entry.imaging}</p></div>
            </div>
          )}
          {entry.prescriptions && (<div className="flex items-start gap-2"><Pill className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" /><div><span className="text-[10px] font-semibold text-teal-600">处方</span><p className="text-[10px] text-slate-600 mt-0.5">{entry.prescriptions}</p></div></div>)}
          {entry.procedures && (<div className="flex items-start gap-2"><Activity className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" /><div><span className="text-[10px] font-semibold text-red-600">手术/操作</span><p className="text-[10px] text-slate-600 mt-0.5">{entry.procedures}</p></div></div>)}
          <div className="pt-2 border-t border-slate-50"><p className="text-[10px] text-slate-600 leading-relaxed italic">{entry.notes}</p></div>
      </div>
    ))}
      </div>
    </div>
    )}
    </div>

    {reportModal && (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setReportModal(null)}>
      <div className="glass-card rounded-2xl shadow-2xl w-[520px] max-h-[80vh] overflow-y-auto m-4" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white px-5 py-4 flex items-center justify-between border-b z-10 rounded-t-2xl">
          <div className="flex items-center gap-2">
            {reportModal.includes('LABORATORY') ? <FlaskConical className="w-4 h-4 text-purple-500" /> : <Microscope className="w-4 h-4 text-indigo-500" />}
            <span className="text-sm font-bold text-slate-800">{reportModal.includes('LABORATORY') ? '检验报告' : '影像报告'}</span>
          </div>
          <button onClick={() => setReportModal(null)} className="w-7 h-7 rounded-full bg-warm-100 flex items-center justify-center hover:bg-warm-200"><X className="w-3.5 h-3.5 text-slate-500" /></button>
        </div>
        <div className="p-6">
          <pre className="text-[10px] text-slate-700 leading-relaxed whitespace-pre-wrap font-mono">{reportModal}</pre>
        </div>
        <div className="border-t px-5 py-3 flex items-center gap-2 text-[9px] text-slate-400">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          电子病历已验证 · 常州市卫健委
        </div>
      </div>
    </div>
    )}
  </div>
);};





const LogsSection: FC<{ patient: PatientFull; plan: any }> = ({ patient, plan }) => {
  const alertActive = usePatientStore(s => s.alertActive);

  // 冯存富血压预警场景（替代HK RED ALERT）
  const alertLog = patient.id === 1 && alertActive ? [{
    date: '2026-08-14', time: '09:30', type: '⚠ 血压预警 — 护理访视',
    detail: '血压168/95 mmHg（基线160/82），连续2次访视超标。HR 82，SpO₂ 96%，无头晕心悸。个案经理林晓东已通知社区医生，建议硝苯地平剂量优化或加用血管紧张素受体阻滞剂。配偶王小凤在场，情绪平稳。下次访视（8/16）复查血压。',
    author: '姜珊', role: '护士', vitals: 'BP 168/95 | HR 82 | SpO₂ 96% | Temp 36.8', status: '预警',
  }] : [];

  // 8月份新增护理记录（补充nursingRecords中的4月和8月数据）
  const augNursingLogs = patient.id === 1 ? [
    { date: '2026-08-16', time: '08:30', type: '翻身护理', detail: '08:28早到2分钟。q2h标准翻身完成，压疮部位皮肤检查：无恶化，边缘开始缩小。减压气垫床压力交替周期正常。配偶协助体位调整，操作规范。', author: '汤菊玲', role: '护理员', vitals: 'Braden 16 | 压疮稳定', status: '已完成' },
    { date: '2026-08-16', time: '09:15', type: '膳食调查', detail: '正在执行。配偶报告近3日饮食：早餐粥+鸡蛋，午餐米饭+蔬菜+少量瘦肉，晚餐面条+豆腐。低盐低脂依从性良好。蛋白摄入约45g/日，略低于压疮愈合推荐量（1.2-1.5g/kg）。', author: '陈雅文', role: '营养师', vitals: '蛋白摄入45g/日 | 推荐84-105g/日', status: '进行中' },
    { date: '2026-08-16', time: '10:00', type: '安全巡查', detail: '居家安全全面检查：地面防滑良好、夜间照明正常、通道无障碍物。助行器轮胎磨损检查通过。紧急呼叫铃测试正常。配偶安全培训抽查：回答正确率100%。', author: '周明', role: '康复师', vitals: '安全评分合格 | Morse 105', status: '已完成' },
    { date: '2026-08-16', time: '14:00', type: '营养风险筛查', detail: '计划14:00开始，实际15:30开始（迟到45分钟）。MNA-SF筛查评分8/14（有营养不良风险）。蛋白摄入不足，建议添加蛋白粉补充。低盐饮食执行良好。已通知个案经理协调后续排程。', author: '陈雅文', role: '营养师', vitals: 'MNA-SF 8/14 | 迟到45min', status: '异常' },
    { date: '2026-08-16', time: '16:30', type: '个案总结', detail: '当日5项任务完成4项。营养筛查迟到45分钟已标记异常并与家属沟通。血压158/86较前略降但未达标。压疮稳定。8月份累计上门7次，执行率良好。下次访视8/17（周日营养师+康复师联合访视）。', author: '林晓东', role: '个案经理', vitals: '当日完成率80% | 月累计7次', status: '已完成' },
  ] : [];

  const nursingRecordLogs = patient.nursingRecords.map(nr => ({
    date: nr.date, time: nr.time, type: '护理访视',
    detail: nr.note, author: nr.nurse, role: '护士', vitals: nr.vitals, status: '已完成',
  }));

  const allLogs = [...alertLog, ...augNursingLogs, ...nursingRecordLogs];
  const familyComms = FAMILY_COMMS[patient.id] || [];

  const statusCN = (s: string) => {
    if (s === '已完成' || s === 'completed') return '已完成';
    if (s === '进行中' || s === 'in_progress') return '进行中';
    if (s === '预警' || s === 'critical') return '预警';
    if (s === '异常') return '异常';
    return s;
  };
  const statusColor = (s: string) => {
    if (s === '已完成' || s === 'completed') return 'text-emerald-600';
    if (s === '进行中' || s === 'in_progress') return 'text-teal-600';
    return 'text-red-600';
  };

  const methodCN = (m: string) => {
    if (m === '电话' || m === 'Phone') return 'bg-blue-100 text-teal-700';
    if (m === '信息' || m === 'Message') return 'bg-emerald-100 text-emerald-700';
    if (m === '视频通话' || m === 'Video Call') return 'bg-purple-100 text-purple-700';
    return 'bg-amber-100 text-amber-700';
  };

  const LogItem: FC<{ log: any }> = ({ log }) => (
    <div className="border-l-2 border-blue-200 pl-3 text-xs py-1">
    <div className="flex items-center justify-between mb-0.5">
      <span className="font-semibold text-slate-700">{log.type}</span>
      <span className="text-[10px] text-slate-400">{log.date} · {log.time}</span>
    </div>
    <p className="text-slate-600">{log.detail}</p>
    <div className="flex items-center gap-2 mt-0.5">
      <span className="text-[10px] text-slate-400">— {log.author}（{log.role}）</span>
      {log.vitals && <span className="text-[10px] text-slate-400">| {log.vitals}</span>}
      <span className={`text-[9px] font-semibold px-1 py-0 rounded ${statusColor(log.status)}`}>{statusCN(log.status)}</span>
    </div>
    </div>
  );

  return (
    <div className="space-y-4">
    <ST title="照护记录" icon={ClipboardList} />

    {/* 1. 护理访视记录 */}
    <div className="glass-card rounded-xl border border-slate-200 p-4">
      <h3 className="text-xs font-bold text-emerald-700 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500" /> 护理访视记录（{allLogs.length}）
      </h3>
      <div className="space-y-2">
        {allLogs.map((log: any, i: number) => <LogItem key={i} log={log} />)}
        {allLogs.length === 0 && <p className="text-xs text-slate-400">暂无护理访视记录。</p>}
      </div>
    </div>

    {/* 2. 用药记录 */}
    <div className="glass-card rounded-xl border border-slate-200 p-4">
      <h3 className="text-xs font-bold text-purple-700 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-purple-500" /> 用药记录（{patient.medications.length} 种在用）
      </h3>
      <div className="space-y-2">
        {patient.medications.map((med, i) => (
          <div key={i} className="flex items-center justify-between text-xs border-b border-slate-50 pb-2">
            <div className="flex-1">
              <span className="font-semibold text-slate-700">{med.drug}</span>
              <span className="text-slate-400 ml-2">{med.dose} · {med.route} · {med.frequency}</span>
              <p className="text-[10px] text-slate-400 mt-0.5">起始日期：{med.startDate} · {med.purpose}</p>
            </div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${med.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-warm-100 text-slate-500'}`}>{med.status === 'Active' ? '在用' : med.status}</span>
          </div>
        ))}
      </div>
    </div>

    {/* 3. 家属沟通记录 */}
    <div className="glass-card rounded-xl border border-slate-200 p-4">
      <h3 className="text-xs font-bold text-amber-700 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-500" /> 家属沟通记录（{familyComms.length}）
      </h3>
      <div className="space-y-2">
        {familyComms.map((comm, i) => (
          <div key={i} className="border-l-2 border-amber-200 pl-3 text-xs py-1">
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">{comm.contact}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${methodCN(comm.method)}`}>{comm.method}</span>
                <span className={`text-[9px] ${comm.direction === 'incoming' || comm.direction === '来电' ? 'text-blue-500' : 'text-emerald-500'}`}>{comm.direction === 'incoming' ? '↓ 来电' : comm.direction === '去电' || comm.direction === 'outgoing' ? '↑ 去电' : comm.direction}</span>
              </div>
              <span className="text-[10px] text-slate-400">{comm.date} · {comm.time}</span>
            </div>
            <p className="text-slate-600">{comm.summary}</p>
            <p className="text-[10px] text-amber-600 mt-0.5"><strong>待办:</strong> {comm.actionItems}</p>
          </div>
        ))}
        {familyComms.length === 0 && <p className="text-xs text-slate-400">暂无家属沟通记录。</p>}
      </div>
    </div>
    </div>
  );
};

const IoTDevicesSection: FC<{ patient: PatientFull }> = ({ patient }) => {
  const cnStatus = (s: string) => s === 'Connected' ? '在线' : s === 'Disconnected' ? '离线' : s === 'Syncing' ? '同步中' : s;

  return (
  <div className="space-y-4">
    <ST title="设备串联" icon={Smartphone}/>
    {patient.iotDevices.map((dev,i) => (
    <div key={i} className="glass-card rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {deviceImageUrl(dev.model) ? (
            <img
              src={deviceImageUrl(dev.model)}
              alt={dev.model}
              className="w-14 h-14 rounded-lg object-contain bg-white border border-slate-100 flex-shrink-0"
            />
          ) : null}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800">{dev.type}</p>
            <p className="text-[10px] text-slate-400">{dev.model} · 序列号：{dev.serial}</p>
          </div>
        </div>
        <span className={`flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-full ${dev.status==='Connected'?'bg-emerald-50 text-emerald-700':dev.status==='Syncing'?'bg-teal-50 text-teal-700':'bg-red-50 text-red-700'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dev.status==='Disconnected'?'bg-red-500':'bg-emerald-500'}`}/>
          {cnStatus(dev.status)}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="bg-warm-50 rounded-lg p-2"><span className="text-slate-400">电量</span><p className="font-bold text-slate-700">{dev.battery}%</p></div>
        <div className="bg-warm-50 rounded-lg p-2"><span className="text-slate-400">上次同步</span><p className="font-bold text-slate-700">{dev.lastSync}</p></div>
      </div>
      <p className="text-[10px] font-semibold text-slate-600 mb-1">监测参数：</p>
      <div className="flex flex-wrap gap-1">{dev.parameters.map((p,j)=>(<span key={j} className="text-[9px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">{p}</span>))}</div>
    </div>
    ))}
  </div>
);};

const billingStatusClass = (status: InvoiceStatus) => {
  if (status === 'Paid') return 'bg-emerald-100 text-emerald-700';
  if (status === 'Partial') return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
};

const BillingSection: FC<{ patientId: number }> = ({ patientId }) => {
  const alertActive = usePatientStore(s => s.alertActive);
  const rows = useMemo(() => buildPatientBillingRows(patientId, alertActive), [patientId, alertActive]);
  const meta = useMemo(() => getPatientInvoiceMeta(patientId, alertActive), [patientId, alertActive]);

  return (
    <div className="space-y-4">
    <ST title="账单" icon={PhoneCall}/>
    {meta && (
      <div className="glass-card rounded-xl border border-slate-200 p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-teal-600">{meta.id}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">当前居家照护账单</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-extrabold text-slate-800">HK$ {meta.total.toLocaleString()}</p>
          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${billingStatusClass(meta.status)}`}>{meta.status}</span>
        </div>
      </div>
    )}
    <div className="glass-card rounded-xl border border-slate-200 overflow-hidden">
      {rows.length === 0 ? (
        <p className="px-4 py-6 text-xs text-slate-400 text-center">此病人暂无账单记录。</p>
      ) : (
        <table className="w-full text-xs">
          <thead className="bg-warm-50">
            <tr>
              <th className="text-left px-4 py-2 font-semibold text-slate-600">日期</th>
              <th className="text-left px-4 py-2 font-semibold text-slate-600">服务</th>
              <th className="text-right px-4 py-2 font-semibold text-slate-600">金额</th>
              <th className="text-center px-4 py-2 font-semibold text-slate-600">状态</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r: PatientBillingRow, i: number) => (
              <tr key={i} className="border-t border-slate-50">
                <td className="px-4 py-2 text-slate-600">{r.date}</td>
                <td className="px-4 py-2 font-medium text-slate-700">{r.service}</td>
                <td className="px-4 py-2 text-right font-semibold text-slate-800">{r.amount}</td>
                <td className="px-4 py-2 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${billingStatusClass(r.status)}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div>
  );
};

export default PatientProfilePage;
