import { useState, type FC, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PATIENTS_FULL, type PatientFull } from '../data/patients';
import { CARE_TEAM, getPatientFamily, FAMILY_COMMS, type FamilyContact } from '../data/careTeam';
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
  Brain, BedDouble, GlassWater, AlertTriangle,
  Phone, Mail, Clock, Pill, Stethoscope, FlaskConical, Microscope, X, CheckCircle2,
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
    () => getTodayActivities(plan, patient.id, today, carePlanStatus),
    [plan, patient.id, today, carePlanStatus],
  );
  const cp = patient.carePlan;
  const teamMembers = [cp.assignedDoctor, cp.assignedCaseManager, cp.assignedNurse, ...(cp.assignedRehabTherapist ? [cp.assignedRehabTherapist] : []), ...(cp.assignedCareWorker ? [cp.assignedCareWorker] : [])].map(name => name?.replace(/\s*\([^)]*\)\s*/g, '').trim()).filter(Boolean);

  return (<>
    <div className="flex flex-1 min-h-0 overflow-hidden">
      <aside className="w-48 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <button onClick={() => navigate('/patient-records')} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-600 mb-3"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
          <div className="flex items-center gap-2">
            <PatientAvatar patientId={patient.id} size={40} />
            <div className="min-w-0"><p className="text-sm font-bold text-slate-800 truncate">{patient.name}</p><p className="text-[10px] text-slate-400">{patient.gender}, {patient.age}</p></div>
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
  const sectionTitle = 'text-sm font-semibold text-warm-900 font-display';
  const labelStyle = 'text-[10px] text-slate-400 font-medium';
  const assessDate = patient.nursingRecords?.[(patient.nursingRecords?.length ?? 1) - 1]?.date || '2026-06-16';
  const caseManager = patient.carePlan?.assignedCaseManager?.split(' (')[0] || '待分配';

  return (
    <div className="space-y-5">
      <ST title="评估情况" icon={ClipboardList} />

      {/* Patient Info + Assessment Meta */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className={`${sectionTitle} mb-3`}>综合初评信息</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className={labelStyle}>评估日期</span><p className="text-slate-700 font-medium">{assessDate}</p></div>
          <div><span className={labelStyle}>个案经理</span><p className="text-slate-700 font-medium">{caseManager}</p></div>
          <div><span className={labelStyle}>评估地点</span><p className="text-slate-700 font-medium">江苏省常州市金坛区指前镇解放村接王家村3号</p></div>
          <div><span className={labelStyle}>家属在场</span><p className="text-slate-700 font-medium">王小凤（配偶）</p></div>
        </div>
      </div>

      {/* Assessment Scales: Barthel + Braden + Fall Risk */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className={`${sectionTitle} mb-3`}>评估量表</h3>
        <div className="grid grid-cols-3 gap-4">
          {patient.barthel && (
            <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
              <p className="text-xs font-bold text-teal-700 mb-1">Barthel ADL</p>
              <p className="text-2xl font-extrabold text-teal-600">{patient.barthel.score}
                <span className="text-xs text-teal-400">/{patient.barthel.items.reduce((s,i) => s + i.maxScore, 0)}</span>
              </p>
              <p className="text-[10px] text-teal-500 mt-1">重度依赖</p>
              {/* Barthel item breakdown */}
              <div className="mt-3 space-y-1">
                {patient.barthel.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-[10px]">
                    <span className="text-slate-500">{item.name}</span>
                    <span className="font-semibold text-teal-700">{item.score}/{item.maxScore}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {patient.braden && (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <p className="text-xs font-bold text-amber-700 mb-1">Braden 压疮风险</p>
              <p className="text-2xl font-extrabold text-amber-600">{patient.braden.score}</p>
              <p className="text-[10px] text-amber-500 mt-1">{patient.braden.score <= 16 ? '有压疮风险' : '低风险'}</p>
              {/* Braden dimension breakdown */}
              <div className="mt-3 space-y-1">
                {patient.braden.dimensions.map((dim, i) => (
                  <div key={i} className="flex justify-between text-[10px]">
                    <span className="text-slate-500">{dim.name}</span>
                    <span className="font-semibold text-amber-700">{dim.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {patient.fallRisk && (
            <div className={`rounded-xl p-4 border ${patient.fallRisk.score > 35 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
              <p className={`text-xs font-bold ${patient.fallRisk.score > 35 ? 'text-red-700' : 'text-green-700'} mb-1`}>跌倒风险</p>
              <p className={`text-2xl font-extrabold ${patient.fallRisk.score > 35 ? 'text-red-600' : 'text-green-600'}`}>{patient.fallRisk.score}</p>
              <p className={`text-[10px] ${patient.fallRisk.score > 35 ? 'text-red-500' : 'text-green-500'} mt-1`}>
                {patient.fallRisk.score > 35 ? '极高危 ⚠️' : '正常'}
              </p>
              {patient.fallRisk.factors && (
                <div className="mt-3 space-y-1">
                  {patient.fallRisk.factors.map((f, i) => (
                    <div key={i} className="flex justify-between text-[10px]">
                      <span className="text-slate-500">{f.name}</span>
                      <span className="font-semibold text-slate-700">{f.score}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cognitive + Home Safety */}
      <div className="grid grid-cols-2 gap-4">
        {/* Cognitive */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className={`${sectionTitle} mb-2`}>认知能力</h3>
          <div className="text-sm text-slate-700 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">意识状态</span>
              <span className="font-semibold">清醒，定向力完整</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">沟通能力</span>
              <span className="font-semibold">正常，可自主表达</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">记忆力</span>
              <span className="font-semibold">轻度减退（符合年龄）</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-400">注：认知评估基于护理记录和家属反馈，非标准化MMSE。</span>
            </div>
          </div>
        </div>

        {/* Home Safety */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className={`${sectionTitle} mb-2`}>居家安全</h3>
          {(patient as any).homeSafety ? (
            <div className="text-sm text-slate-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">总体风险</span>
                <span className="font-semibold text-amber-600">{(patient as any).homeSafety.overallRisk}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">地面类型</span>
                <span className="font-semibold">{(patient as any).homeSafety.floorType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">照明</span>
                <span className="font-semibold">{(patient as any).homeSafety.lighting}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">卫生间</span>
                <span className="font-semibold">{(patient as any).homeSafety.bathroom}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">扶手/抓杆</span>
                <span className="font-semibold">{(patient as any).homeSafety.grabBars}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">紧急呼叫</span>
                <span className="font-semibold">{(patient as any).homeSafety.emergencyCall}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">暂无居家安全评估数据</p>
          )}
        </div>
      </div>

      {/* Key Indicators Table */}
      {patient.careType === '长护险' && patient.keyIndicators && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className={`${sectionTitle} mb-3`}>关键指标监测</h3>
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500">指标</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500">基线</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500">阈值</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500">触发行动</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patient.keyIndicators.map((ki, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-3 py-2 font-semibold text-slate-700">{ki.name}</td>
                    <td className="px-3 py-2 text-slate-500">{ki.baseline}</td>
                    <td className="px-3 py-2"><span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">{ki.threshold}</span></td>
                    <td className="px-3 py-2 text-slate-500 text-[10px]">{ki.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Outcome Targets */}
      {patient.careType === '长护险' && (patient as any).outcomeTargets && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className={`${sectionTitle} mb-3`}>转归目标</h3>
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-xs">
              <thead className="bg-emerald-50">
                <tr>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-emerald-700">指标</th>
                  <th className="text-center px-2 py-2 text-[10px] font-semibold text-emerald-700">基线</th>
                  <th className="text-center px-2 py-2 text-[10px] font-semibold text-emerald-700">30天</th>
                  <th className="text-center px-2 py-2 text-[10px] font-semibold text-emerald-700">90天</th>
                  <th className="text-center px-2 py-2 text-[10px] font-semibold text-emerald-700">180天</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(patient as any).outcomeTargets.map((ot: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-3 py-2 font-semibold text-slate-700">{ot.indicator}</td>
                    <td className="px-2 py-2 text-center text-slate-500">{ot.baseline}</td>
                    <td className="px-2 py-2 text-center"><span className="text-[10px] font-semibold text-emerald-600">{ot.day30}</span></td>
                    <td className="px-2 py-2 text-center"><span className="text-[10px] font-semibold text-emerald-600">{ot.day90}</span></td>
                    <td className="px-2 py-2 text-center"><span className="text-[10px] font-semibold text-emerald-600">{ot.day180}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
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

const CareInfoSection: FC<{ patient: PatientFull; teamMembers: string[]; todaySchedule: any[]; today: string }> = ({ patient, teamMembers, todaySchedule, today }) => (
  <div className="space-y-6">
    <CareTeamSection patient={patient} teamMembers={teamMembers} />
    <ServicesSection patient={patient} todaySchedule={todaySchedule} today={today} />
  </div>
);

const CareTeamSection: FC<{ patient: PatientFull; teamMembers: string[] }> = ({ teamMembers }) => (
  <div className="space-y-4"><ST title="Care Team" icon={Users}/>
    <div className="grid grid-cols-2 gap-4">
      {teamMembers.map((name,i)=>{const m=CARE_TEAM[name];if(!m)return null;
        const isImg = m.avatar.startsWith('/');
        return(<div key={i} className="glass-card rounded-xl border border-slate-200 p-4"><div className="flex items-start gap-3">{
          isImg
            ? <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 shadow-md"><img src={m.avatar} alt={m.name} className="w-full h-full object-cover" /></div>
            : <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow-md">{m.avatar}</div>
        }<div className="flex-1 min-w-0"><p className="text-sm font-bold text-slate-800">{m.name}</p><p className="text-[10px] text-teal-600 font-semibold">{m.role}{m.registrationNo ? <span className="ml-1 text-[9px] text-slate-400 font-mono">#{m.registrationNo}</span> : null}</p><p className="text-[10px] text-slate-400 mt-0.5">{m.gender}, {m.age} · {m.yearsExperience}yrs exp</p><p className="text-[10px] text-slate-500 mt-1"><strong>专科:</strong> {m.specialty}</p><p className="text-[10px] text-slate-500"><strong>机构:</strong> {m.institution}</p><p className="text-[10px] text-slate-500"><strong>健康教育:</strong> {m.education}</p><div className="flex flex-wrap gap-1 mt-2">{m.certifications.map((c,j)=>(<span key={j} className="text-[8px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded font-medium">{c}</span>))}</div><p className="text-[10px] text-slate-600 mt-2 leading-relaxed">{m.bio}</p></div></div></div>);
      })}
    </div>
  </div>
);

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
  const typeColor: Record<string, string> = {
    admission: 'border-l-red-400 bg-red-50/30',
    surgery: 'border-l-purple-400 bg-purple-50/30',
    discharge: 'border-l-emerald-400 bg-emerald-50/30',
    outpatient: 'border-l-blue-400 bg-teal-50/30',
    er: 'border-l-amber-400 bg-amber-50/30',
    followup: 'border-l-teal-400 bg-teal-50/30',
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
    <div className="sticky top-0 z-50 bg-white -mx-6 px-6 pt-6 pb-3 border-b border-slate-200 shadow-sm" style={{ isolation: 'isolate' }}>
      <ST title="病史档案" icon={FileText} />
    </div>
    {/* ─── 临床病史分类 ─── */}
    <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
      <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
        <Stethoscope className="w-4 h-4 text-teal-600" /> 临床病史
      </h3>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-50 rounded-lg p-3">
          <span className="text-[10px] text-slate-400 font-medium">基本信息</span>
          <p className="text-slate-700 font-medium mt-0.5">{patient.age}岁 男性 — 身高{patient.height || 164}cm / 体重{patient.weight || 70}kg</p>
        </div>
        <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
          <span className="text-[10px] text-teal-500 font-medium">主要诊断</span>
          <p className="text-teal-800 font-medium mt-0.5">{patient.diagnosis || '高血压'}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
          <span className="text-[10px] text-blue-500 font-medium">功能状态 · Barthel {patient.barthel?.score || 30}/100</span>
          <p className="text-slate-700 mt-0.5">重度依赖 — 双侧上下肢活动异常，需助行器辅助</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
          <span className="text-[10px] text-amber-600 font-medium">皮肤/压疮 · Braden {patient.braden?.score || 16}分</span>
          <p className="text-slate-700 mt-0.5">已有压疮，Braden 16分提示中度风险，需翻身q2h</p>
        </div>
        <div className="bg-red-50 rounded-lg p-3 border border-red-100">
          <span className="text-[10px] text-red-500 font-medium">跌倒风险 · Morse {patient.fallRisk?.score || 105}</span>
          <p className="text-slate-700 mt-0.5">极高危 — 近3月有跌倒史，步态异常，需持续防跌倒措施</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
          <span className="text-[10px] text-purple-500 font-medium">认知/意识</span>
          <p className="text-slate-700 mt-0.5">意识清醒，定向力完整；半自理，需部分生活协助</p>
        </div>
        <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100 col-span-2">
          <span className="text-[10px] text-emerald-600 font-medium">照护需求</span>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <span className="text-[10px] bg-white border border-emerald-200 rounded px-2 py-0.5 text-emerald-700">翻身 q2h</span>
            <span className="text-[10px] bg-white border border-emerald-200 rounded px-2 py-0.5 text-emerald-700">压疮护理</span>
            <span className="text-[10px] bg-white border border-emerald-200 rounded px-2 py-0.5 text-emerald-700">血压监测</span>
            <span className="text-[10px] bg-white border border-emerald-200 rounded px-2 py-0.5 text-emerald-700">防跌倒</span>
            <span className="text-[10px] bg-white border border-emerald-200 rounded px-2 py-0.5 text-emerald-700">助行器辅助</span>
          </div>
        </div>
        <div className="bg-slate-50 rounded-lg p-3 col-span-2 border border-dashed border-slate-200">
          <div className="flex items-start gap-2">
            <span className="text-[10px] text-slate-400 font-medium flex-shrink-0 mt-px">评估来源</span>
            <p className="text-slate-500 text-[11px]">易得康评估机构 · 评估者：李妍 · 评估日期：2026.04.01</p>
          </div>
          <div className="flex items-start gap-2 mt-1.5">
            <span className="text-[10px] text-amber-500 font-medium flex-shrink-0 mt-px">⚠ 待确认</span>
            <p className="text-amber-600 text-[11px]">Barthel ADL：手写总分=60 vs 勾选累加=30，差异待确认</p>
          </div>
        </div>
      </div>
    </div>
    {history?.aiSummary && (
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200 p-5 mb-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"><Brain className="w-5 h-5 text-white" /></div>
          <div>
            <div className="flex items-center gap-2"><span className="text-sm font-bold text-indigo-800">智能病史分析</span><span className="text-[9px] bg-indigo-200 text-indigo-700 px-1.5 py-0.5 rounded-full font-semibold">AI</span></div>
          </div>
        </div>
        <div className="ml-[52px]">
          {/* Overview */}
          <p className="text-xs text-slate-600 leading-relaxed mb-3 pb-3 border-b border-indigo-100">{overview}</p>
          {/* Concerns — categorized cards */}
          <h4 className="text-[10px] font-semibold text-indigo-500 mb-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> 核心关注点
          </h4>
          <div className="space-y-2">
            {concerns.map((c, i) => (
              <div key={i} className="bg-indigo-100/60 border border-indigo-200 rounded-lg px-3 py-2">
                <span className="text-[9px] text-indigo-400 font-semibold mr-1">{i + 1}.</span>
                <span className="text-[11px] text-indigo-800 leading-relaxed">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
    <div className="space-y-3 px-6 pb-6">
      {entries.map((entry, i) => (
        <div key={i} className={`glass-card rounded-xl border border-slate-200 border-l-4 ${typeColor[entry.type]} overflow-hidden`}>
          <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-warm-100 flex items-center justify-center">
                {(() => { const Icon = typeIcon[entry.type] || FileText; return <Icon className="w-4 h-4 text-slate-600" />; })()}
              </div>
              <div>
                <div className="flex items-center gap-2"><span className="text-xs font-bold text-slate-800">{typeLabel[entry.type]}</span><span className="text-[10px] text-slate-400">{entry.date}</span></div>
                <p className="text-[10px] text-slate-500">{entry.facility} · {entry.department}</p>
              </div>
            </div>
            <span className="text-[10px] text-slate-500">{entry.physician}</span>
          </div>
          <div className="px-5 py-3 space-y-2.5">
            <div><span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">主诉</span><p className="text-xs text-slate-700 mt-0.5">{entry.chiefComplaint}</p></div>
            <div><span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">诊断</span><p className="text-xs text-slate-700 mt-0.5 leading-relaxed">{entry.diagnosis}</p></div>
            {entry.labs && (
              <div className="flex items-start gap-2 cursor-pointer hover:bg-purple-50 rounded-lg p-1.5 -mx-1.5 transition-colors group" onClick={() => setReportModal(getReport(entry.labs!, 'lab'))}>
                <FlaskConical className="w-3.5 h-3.5 text-purple-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1"><span className="text-[10px] font-semibold text-purple-600">检验结果</span><button className="ml-2 text-[8px] text-purple-400 font-medium hover:text-purple-600 hover:underline group-hover:text-purple-600">查看完整报告 →</button><p className="text-[10px] text-slate-600 mt-0.5">{entry.labs}</p></div>
              </div>
            )}
            {entry.imaging && (
              <div className="flex items-start gap-2 cursor-pointer hover:bg-indigo-50 rounded-lg p-1.5 -mx-1.5 transition-colors group" onClick={() => setReportModal(getReport(entry.imaging!, 'imaging'))}>
                <Microscope className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1"><span className="text-[10px] font-semibold text-indigo-600">影像</span><button className="ml-2 text-[8px] text-indigo-400 font-medium hover:text-indigo-600 hover:underline group-hover:text-indigo-600">查看完整报告 →</button><p className="text-[10px] text-slate-600 mt-0.5">{entry.imaging}</p></div>
              </div>
            )}
            {entry.prescriptions && (<div className="flex items-start gap-2"><Pill className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" /><div><span className="text-[10px] font-semibold text-teal-600">处方</span><p className="text-[10px] text-slate-600 mt-0.5">{entry.prescriptions}</p></div></div>)}
            {entry.procedures && (<div className="flex items-start gap-2"><Activity className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" /><div><span className="text-[10px] font-semibold text-red-600">手术/操作</span><p className="text-[10px] text-slate-600 mt-0.5">{entry.procedures}</p></div></div>)}
            <div className="pt-2 border-t border-slate-50"><p className="text-[10px] text-slate-600 leading-relaxed italic">{entry.notes}</p></div>
          </div>
        </div>
      ))}
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
            <pre className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-wrap font-mono">{reportModal}</pre>
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




const ServicesSection: FC<{ patient: PatientFull; todaySchedule: any[]; today: string }> = ({ patient, todaySchedule, today }) => {
  const plan = usePatientStore(s => s.carePlans[patient.id]);
  const taskTimes = useCollaborationStore(s => s.eliteTaskTimes);
  const { completed, total, progressPct, missed } = useMemo(
    () => summarizeCarePlanProgress(todaySchedule),
    [todaySchedule],
  );
  const pendingCount = todaySchedule.filter(a => a.status === 'pending').length;
  const [carePlanModal, setCarePlanModal] = useState(false);
  const [medicationModal, setMedicationModal] = useState(false);
  const startDate = plan?.startDate || '2026-06-16';
  const endDate = plan?.endDate || '2026-06-29';
  const typeLabels: Record<string, string> = {
    medication: 'Med', monitoring: 'Monitor', therapy: 'Therapy',
    nurse_visit: 'Nurse', doctor_consult: 'Doctor', care_worker: 'Care Wkr', self_care: 'Self',
  };
  const typeBadgeColors: Record<string, string> = {
    medication: 'bg-gold-100 text-gold-800',
    nurse_visit: 'bg-teal-50 text-teal-700',
    doctor_consult: 'bg-teal-100 text-teal-800',
    therapy: 'bg-emerald-50 text-emerald-800',
    care_worker: 'bg-warm-200 text-warm-700',
    monitoring: 'bg-warm-100 text-warm-700',
    self_care: 'bg-warm-100 text-slate-600',
  };

  const sectionTitle = 'text-sm font-semibold text-warm-900 font-display flex items-center gap-2 flex-wrap';
  const sectionLink = 'text-[10px] font-medium text-teal-600 hover:text-teal-800 hover:underline font-body';
  const tableHead = 'text-[10px] font-semibold text-slate-500 uppercase tracking-wide font-display';
  const modalOverlay = 'fixed inset-0 z-[500] flex items-center justify-center bg-teal-900/40';
  const modalShell = 'bg-white rounded-lg border border-[#99E7FF] max-h-[85vh] overflow-y-auto m-4';
  const modalHeader = 'sticky top-0 bg-gradient-to-r from-teal-800 to-teal-900 px-5 py-4 flex items-center justify-between z-10 rounded-t-lg border-b border-teal-700/30';
  const modalTitle = 'text-sm font-semibold text-white font-display';
  const modalLabel = 'label-md text-slate-500';
  const modalBody = 'text-sm text-slate-700 leading-relaxed font-body';

  // Compute total prescribed days for each medication from start date
  const todayObj = new Date(today);
  const getTotalSupply = (startDate: string, remaining: number): number => {
    const start = new Date(startDate);
    const daysSince = Math.max(0, Math.floor((todayObj.getTime() - start.getTime()) / 86400000));
    // Chronic meds started > 90 days ago: assume current refill cycle
    if (daysSince > 90) return Math.max(remaining, 30);
    return remaining + daysSince;
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Sticky overall title */}
      <div className="flex-shrink-0 sticky top-0 z-10 bg-warm-50 pb-3 -mx-6 px-6">
        <ST title="照护信息" icon={CalendarDays} />
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto min-h-0 pr-1">

      {/* TOP ROW: Care Plan Summary + Medication Overview side-by-side */}
      <div className="grid grid-cols-2 gap-4">

      {/* ──────── Care Plan Summary ──────── */}
      <div className="glass-card rounded-lg border border-slate-200 overflow-hidden flex flex-col">
        <div className="flex-shrink-0 sticky top-0 z-[5] bg-white">
          <h3 className={`${sectionTitle} px-4 pt-4 pb-2`}>
            <ClipboardList className="w-4 h-4 text-teal-600 flex-shrink-0" /> Care Plan Summary
            <button onClick={() => setCarePlanModal(true)} className={sectionLink}>View full Care Plan →</button>
            <span className="inline-flex items-center gap-1 text-[10px] ml-auto font-body">
              <span className="bg-gold-100 text-gold-800 px-1.5 py-0.5 rounded-full font-semibold whitespace-nowrap">{startDate}</span>
              <span className="text-slate-300">→</span>
              <span className="bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded-full font-semibold whitespace-nowrap">{endDate}</span>
              <span className="text-slate-400 whitespace-nowrap ml-0.5">14-day</span>
            </span>
          </h3>
          <div className={`grid grid-cols-[80px_1fr_90px_80px] gap-2 px-4 pb-2 ${tableHead} border-b border-slate-100`}>
            <span className="text-left">角色</span>
            <span className="text-left">服务</span>
            <span className="text-left">频率</span>
            <span className="text-right">时长</span>
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {[
            { role: 'Physician', service: 'Remote ward rounds, clinical assessment, medication management, risk intervention', freq: '1-2x/wk', duration: '30 min', color: 'border-l-teal-800' },
            { role: 'Case Mgr', service: 'Patient onboarding, service coordination, progress tracking, family liaison', freq: 'Ongoing', duration: 'As needed', color: 'border-l-gold-600' },
            { role: 'Nurse', service: 'Home visits: vital assessment, medication compliance, wound care, education', freq: patient.carePlan.serviceFrequency, duration: patient.carePlan.visitDuration, color: 'border-l-teal-600' },
            ...(patient.carePlan.assignedCareWorker ? [{ role: 'Care Wkr', service: 'Meal preparation, medication prompting, light housekeeping, companionship', freq: '2-3x/wk', duration: '45 min', color: 'border-l-warm-600' }] : []),
            ...(patient.carePlan.assignedRehabTherapist ? [{ role: 'Rehab', service: 'Supervised exercise, gait training, functional mobility, equipment assessment', freq: '2x/wk', duration: '45 min', color: 'border-l-teal-700' }] : []),
          ].map((r, i) => (
            <div key={i} className={`grid grid-cols-[80px_1fr_90px_80px] gap-2 px-4 py-2.5 text-xs items-start min-h-[48px] border-l-2 ${r.color} bg-warm-50/50 border-b border-slate-100 hover:bg-warm-100 transition-colors font-body`}>
              <span className="font-semibold text-slate-700 whitespace-nowrap text-[11px] font-display">{r.role}</span>
              <span className="text-slate-600 text-[11px] leading-relaxed">{r.service}</span>
              <span className="text-[10px] text-slate-500 leading-relaxed text-left">{r.freq}</span>
              <span className="text-[10px] text-slate-400 whitespace-nowrap text-right">{r.duration}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ──────── Medication Overview ──────── */}
      <div className="glass-card rounded-lg border border-slate-200 overflow-hidden flex flex-col">
        <div className="flex-shrink-0 sticky top-0 z-[5] bg-white">
          <h3 className={`${sectionTitle} px-4 pt-4 pb-2`}>
            <Pill className="w-4 h-4 text-teal-600" /> Medication Summary
            <button onClick={() => setMedicationModal(true)} className={`ml-auto ${sectionLink}`}>View full Medication Info →</button>
          </h3>
          <div className={`grid grid-cols-[1fr_100px_100px_76px] gap-2 px-4 pb-2 ${tableHead} border-b border-slate-100`}>
            <span>药品</span>
            <span>剂量</span>
            <span>频率</span>
            <span className="text-right">库存</span>
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {patient.medications.map((med, i) => {
            const stockDays = med.status === 'Active' ? Math.floor(Math.random() * 25) + 5 : 0;
            const totalSupply = getTotalSupply(med.startDate, stockDays);
            const stockLow = stockDays <= 7;
            const stockWarn = !stockLow && stockDays <= 14;
            const stockColor = stockLow ? 'text-red-600' : stockWarn ? 'text-amber-600' : 'text-emerald-600';
            return (
              <div key={i} className="grid grid-cols-[1fr_100px_100px_76px] gap-2 px-4 py-2.5 text-xs items-start min-h-[48px] border-l-2 border-l-teal-300 bg-warm-50/50 border-b border-slate-100 hover:bg-warm-100 transition-colors font-body">
                <span className="font-semibold text-slate-700 text-[11px] leading-relaxed">{med.drug}</span>
                <span className="text-slate-500 text-[10px] leading-relaxed">{med.dose} · {med.route}</span>
                <span className="text-slate-500 text-[10px] leading-relaxed">{med.frequency}</span>
                <span className={`font-semibold whitespace-nowrap text-[10px] text-right ${stockColor} ${stockLow ? 'alert-blink' : ''}`}>{stockDays}/{totalSupply}d</span>
              </div>
            );
          })}
        </div>
      </div>

      </div>{/* end top row */}

      {/* ──────── BOTTOM: Today's Schedule ──────── */}
      <div className="glass-card rounded-lg border border-slate-200 overflow-hidden flex flex-col">
        <div className="flex-shrink-0 sticky top-0 z-[5] bg-white">
          <h3 className={`${sectionTitle} px-5 pt-4 pb-2`}>
            <Clock className="w-4 h-4 text-teal-600" /> Today's Schedule
          </h3>
          <div className={`grid grid-cols-[64px_0.9fr_1.2fr_0.9fr_70px] gap-2.5 px-5 pb-2 ${tableHead} border-b border-slate-100`}>
            <span>时间</span>
            <span>照护项</span>
            <span>详情</span>
            <span>实际</span>
            <span className="text-right">状态</span>
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {todaySchedule.length > 0 ? (
            todaySchedule.map((act: any, i: number) => {
              const displayStatus = act.status;
              const taskKey = eliteTaskKey(patient.id, act.time, act.activity);
              const times = taskTimes[taskKey] || {};
              const schedParts = act.time.split(':');
              const schedMin = parseInt(schedParts[0]) * 60 + parseInt(schedParts[1]);
              let lateMinutes = 0;
              if (times.clockIn) {
                const inParts = times.clockIn.split(':');
                lateMinutes = Math.max(0, parseInt(inParts[0]) * 60 + parseInt(inParts[1]) - schedMin);
              }
              const isLate = lateMinutes >= 5;
              const hasActual = !!times.clockIn;

              const statusColor = displayStatus === 'completed' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : displayStatus === 'in_progress' ? 'bg-gold-100 text-gold-800 border-[#99E7FF]' : displayStatus === 'missed' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-amber-50 text-amber-800 border-amber-200';
              const statusDot = displayStatus === 'completed' ? 'bg-emerald-600' : displayStatus === 'in_progress' ? 'bg-teal-600 animate-pulse' : displayStatus === 'missed' ? 'bg-red-600' : 'bg-amber-500';
              const statusLabel = displayStatus === 'completed' ? 'Done' : displayStatus === 'in_progress' ? 'Active' : displayStatus === 'missed' ? 'Missed' : 'Due';

              return (
              <div key={i} className="grid grid-cols-[64px_0.9fr_1.2fr_0.9fr_70px] gap-2.5 px-5 py-2.5 text-xs items-start border-b border-slate-50 hover:bg-warm-100 transition-colors">
                <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap pt-px">{act.time}</span>
                <div className="flex items-start gap-2 min-w-0">
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 mt-px ${typeBadgeColors[act.type] || 'bg-warm-100 text-slate-600'}`}>{typeLabels[act.type] || act.type}</span>
                  <span className="text-slate-700 font-medium text-[11px] leading-relaxed">{act.activity}</span>
                </div>
                <span className="text-[11px] text-slate-500 leading-relaxed">{act.detail}</span>
                <span className="text-[10px] text-slate-500 whitespace-nowrap font-mono pt-px">
                  {hasActual
                    ? `${times.clockIn}${times.clockOut ? `–${times.clockOut}` : '–...'}`
                    : '—:—'}
                </span>
                <div className="flex items-center gap-1 justify-end">
                  <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-1 rounded-full border whitespace-nowrap ${statusColor}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                    {statusLabel}
                  </span>
                  {isLate && hasActual && (
                    <span className="text-[9px] font-extrabold text-red-600 bg-red-100 px-1 py-0.5 rounded alert-blink whitespace-nowrap">+{lateMinutes}m</span>
                  )}
                </div>
              </div>
              );
            })
          ) : <p className="text-xs text-slate-400 px-5 py-4">今日暂无排程。</p>}
        </div>

        {/* AI Service Evaluation */}
        <div className="flex-shrink-0 border-t border-[#99E7FF] bg-warm-100 px-5 py-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-teal-800 rounded flex items-center justify-center flex-shrink-0">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-semibold text-teal-800 font-display">AI服务评估</span>
                <span className="text-[10px] bg-gold-100 text-gold-800 px-1.5 py-0.5 rounded-full font-semibold">实时</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] font-body">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">依从率:</span>
                  <span className="font-semibold text-emerald-700">{progressPct}%</span>
                  <span className="w-16 h-1.5 bg-warm-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${progressPct}%` }} />
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">已完成:</span>
                  <span className="font-semibold text-teal-700">{completed}/{total}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">待完成:</span>
                  <span className="font-semibold text-amber-700">{pendingCount}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">已错过:</span>
                  <span className="font-semibold text-red-700">{missed}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${missed > 0 || pendingCount > 3 ? 'bg-red-100 text-red-700 alert-blink' : pendingCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  <AlertTriangle className="w-3 h-3" />
                  {missed > 0
                    ? `${missed} missed task${missed > 1 ? 's' : ''}`
                    : pendingCount > 3
                      ? `${pendingCount} tasks still due`
                      : pendingCount > 0
                        ? 'On track with minor items pending'
                        : 'All tasks completed for today'}
                </span>
                <span className="text-[10px] text-slate-500">· Live sync from Elite clock-in/out across tabs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      </div>

      {/* ─── Assessment Modal ─── */}

      {/* ─── Care Plan Modal ─── */}
      {carePlanModal && (
        <div className={modalOverlay} onClick={() => setCarePlanModal(false)}>
          <div className={`${modalShell} w-[640px]`} onClick={e => e.stopPropagation()}>
            <div className={modalHeader}>
              <div className="flex items-center gap-2"><CalendarDays className="w-5 h-5 text-gold-200" /><span className={modalTitle}>Full Care Plan — {plan?.patientName || patient.name}</span></div>
              <button onClick={() => setCarePlanModal(false)} className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"><X className="w-3.5 h-3.5 text-white" /></button>
            </div>
            <div className="p-5 space-y-3 font-body">
              {plan && Object.entries(plan.schedule).sort().map(([date, acts]) => (
                <div key={date} className="bg-warm-50 rounded-lg border border-[#99E7FF] overflow-hidden">
                  <div className="bg-warm-100 px-4 py-2 flex items-center justify-between border-b border-[#99E7FF]"><span className="text-xs font-semibold text-slate-700 font-display">{new Date(date).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})}</span><span className="text-[10px] text-slate-500">{acts.length} activities</span></div>
                  <div className="divide-y divide-[#ede7e5]">
                    {acts.map((act: any, j: number) => (
                      <div key={j} className="px-4 py-2 flex items-center gap-3 text-sm">
                        <span className="font-semibold text-teal-700 w-10 flex-shrink-0 font-display">{act.time}</span>
                        <span className="text-slate-700 flex-1">{act.activity}</span>
                        <span className="text-xs text-slate-500 max-w-[45%] truncate">{act.detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Medication Modal ─── */}
      {medicationModal && (
        <div className={modalOverlay} onClick={() => setMedicationModal(false)}>
          <div className={`${modalShell} w-[580px]`} onClick={e => e.stopPropagation()}>
            <div className={modalHeader}>
              <div className="flex items-center gap-2"><Pill className="w-5 h-5 text-gold-200" /><span className={modalTitle}>Full Medication Information — {patient.name}</span></div>
              <button onClick={() => setMedicationModal(false)} className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"><X className="w-3.5 h-3.5 text-white" /></button>
            </div>
            <div className="p-5 font-body">
              <div className="rounded-lg border border-[#99E7FF] overflow-hidden bg-white">
                <div className={`grid grid-cols-[1fr_100px_100px_1fr_80px] gap-3 px-4 py-2 bg-warm-100 ${tableHead} border-b border-[#99E7FF]`}>
                  <span>药品</span><span>剂量</span><span>频率</span><span>用途</span><span className="text-right">状态</span>
                </div>
                {patient.medications.map((med,i) => (
                  <div key={i} className="grid grid-cols-[1fr_100px_100px_1fr_80px] gap-3 px-4 py-2.5 text-sm items-center border-b border-[#ede7e5] last:border-0 hover:bg-warm-50">
                    <span className="font-semibold text-slate-800 font-display">{med.drug}</span>
                    <span className="text-slate-600">{med.dose} · {med.route}</span>
                    <span className="text-slate-600">{med.frequency}</span>
                    <span className="text-slate-500">{med.purpose}</span>
                    <span className={`text-right font-semibold ${med.status==='Active'?'text-emerald-700':'text-red-600'}`}>{med.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const LogsSection: FC<{ patient: PatientFull; plan: any }> = ({ patient, plan }) => {
  const alertActive = usePatientStore(s => s.alertActive);
  const planLogs = plan?.logs || [];
  const wardRoundLogs = patient.wardRounds.map(wr => ({
    date: wr.date, time: '—', type: 'Physician Ward Round',
    detail: wr.note, author: wr.physician, role: 'Physician', status: 'completed',
  }));
  const alertLog = patient.id === 1 && alertActive ? [{
    date: '2026-06-20', time: '14:30', type: 'RED ALERT — Nursing Visit',
    detail: 'URGENT Day 2 PM. SpO₂ 90%, Temp 38.3, RR 26, HR 98. POCT: CRP 68, PCT 0.8. IV Ceftriaxone + Doxycycline started. O₂ 2L/min.',
    author: 'Jenny Tam', role: 'RN', vitals: 'SpO₂ 90% | Temp 38.3 | RR 26 | HR 98 | CRP 68 | PCT 0.8', status: 'critical',
  }] : [];
  const nursingRecordLogs = patient.nursingRecords.map(nr => ({
    date: nr.date, time: nr.time, type: 'Nursing Visit',
    detail: nr.note, author: nr.nurse, role: 'RN', vitals: nr.vitals, status: 'completed',
  }));
  const allLogs = [...alertLog, ...planLogs, ...wardRoundLogs, ...nursingRecordLogs];

  const isDoctorRole = (r: string) => /physician|cardiologist|doctor|internal medicine/i.test(r);
  const isNurseRole = (r: string) => /^(RN|Nurse)$/i.test(r);

  const doctorLogs = allLogs.filter((l: any) => isDoctorRole(l.role));
  const nurseLogs = allLogs.filter((l: any) => isNurseRole(l.role));
  const otherLogs = allLogs.filter((l: any) => !isDoctorRole(l.role) && !isNurseRole(l.role));
  const familyComms = FAMILY_COMMS[patient.id] || [];

  const LogItem: FC<{ log: any }> = ({ log }) => (
    <div className="border-l-2 border-blue-200 pl-3 text-xs py-1">
      <div className="flex items-center justify-between mb-0.5">
        <span className="font-semibold text-slate-700">{log.type}</span>
        <span className="text-[10px] text-slate-400">{log.date} · {log.time}</span>
      </div>
      <p className="text-slate-600">{log.detail}</p>
      <div className="flex items-center gap-2 mt-0.5">
        <span className="text-[10px] text-slate-400">— {log.author}</span>
        {log.vitals && <span className="text-[10px] text-slate-400">| {log.vitals}</span>}
        <span className={`text-[9px] font-semibold px-1 py-0 rounded ${log.status === 'completed' ? 'text-emerald-600' : 'text-red-600'}`}>{log.status}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <ST title="全部日志与记录" icon={ClipboardList} />

      {/* 1. Physician Follow-ups */}
      <div className="glass-card rounded-xl border border-slate-200 p-4">
        <h3 className="text-xs font-bold text-indigo-700 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500" /> Physician Follow-ups ({doctorLogs.length})
        </h3>
        <div className="space-y-2">
          {doctorLogs.map((log: any, i: number) => <LogItem key={i} log={log} />)}
          {doctorLogs.length === 0 && <p className="text-xs text-slate-400">暂无医生随访记录。</p>}
        </div>
      </div>

      {/* 2. 护理记录 */}
      <div className="glass-card rounded-xl border border-slate-200 p-4">
        <h3 className="text-xs font-bold text-emerald-700 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> 护理记录 ({nurseLogs.length})
        </h3>
        <div className="space-y-2">
          {nurseLogs.map((log: any, i: number) => <LogItem key={i} log={log} />)}
          {otherLogs.map((log: any, i: number) => <LogItem key={`o${i}`} log={log} />)}
          {nurseLogs.length === 0 && otherLogs.length === 0 && <p className="text-xs text-slate-400">暂无护理或照护记录。</p>}
        </div>
      </div>

      {/* 3. Medication Records */}
      <div className="glass-card rounded-xl border border-slate-200 p-4">
        <h3 className="text-xs font-bold text-purple-700 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500" /> Medication Records ({patient.medications.length} active)
        </h3>
        <div className="space-y-2">
          {patient.medications.map((med, i) => (
            <div key={i} className="flex items-center justify-between text-xs border-b border-slate-50 pb-2">
              <div className="flex-1">
                <span className="font-semibold text-slate-700">{med.drug}</span>
                <span className="text-slate-400 ml-2">{med.dose} · {med.route} · {med.frequency}</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Started: {med.startDate} · {med.purpose}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${med.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-warm-100 text-slate-500'}`}>{med.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Family Communication Records */}
      <div className="glass-card rounded-xl border border-slate-200 p-4">
        <h3 className="text-xs font-bold text-amber-700 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> Family Communications ({familyComms.length})
        </h3>
        <div className="space-y-2">
          {familyComms.map((comm, i) => (
            <div key={i} className="border-l-2 border-amber-200 pl-3 text-xs py-1">
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">{comm.contact}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${comm.method === 'Phone' ? 'bg-blue-100 text-teal-700' : comm.method === 'Message' ? 'bg-emerald-100 text-emerald-700' : comm.method === 'Video Call' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}`}>{comm.method}</span>
                  <span className={`text-[9px] ${comm.direction === 'incoming' ? 'text-blue-500' : 'text-emerald-500'}`}>{comm.direction === 'incoming' ? '↓ In' : '↑ Out'}</span>
                </div>
                <span className="text-[10px] text-slate-400">{comm.date} · {comm.time}</span>
              </div>
              <p className="text-slate-600">{comm.summary}</p>
              <p className="text-[10px] text-amber-600 mt-0.5"><strong>操作:</strong> {comm.actionItems}</p>
            </div>
          ))}
          {familyComms.length === 0 && <p className="text-xs text-slate-400">暂无家属沟通记录。</p>}
        </div>
      </div>
    </div>
  );
};

const IoTDevicesSection: FC<{ patient: PatientFull }> = ({ patient }) => {
  const [bpReading, setBpReading] = useState<{sys:number;dia:number;hr:number}|null>(null);
  const [measuring, setMeasuring] = useState(false);

  const startBpMeasure = () => {
    setMeasuring(true);
    setTimeout(() => {
      const baseline = patient.id === 1 ? [168,95,96] : patient.id === 5 ? [108,68,102] : patient.id === 9 ? [140,90,118] : [130,82,76];
      const sys = baseline[0] + Math.floor(Math.random()*8)-4;
      const dia = baseline[1] + Math.floor(Math.random()*6)-3;
      const hr = baseline[2] + Math.floor(Math.random()*6)-3;
      setBpReading({sys, dia, hr});
      setMeasuring(false);
    }, 2500);
  };

  return (
  <div className="space-y-4">
    <ST title="物联网设备" icon={Smartphone}/>
    {patient.iotDevices.map((dev,i) => {
      const isBP = dev.type === 'Blood Pressure Monitor';
      return (
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
              <p className="text-[10px] text-slate-400">{dev.model} · S/N:{dev.serial}</p>
            </div>
          </div>
          <span className={`flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-full ${dev.status==='Connected'?'bg-emerald-50 text-emerald-700':dev.status==='Syncing'?'bg-teal-50 text-teal-700':'bg-red-50 text-red-700'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${measuring ? 'bg-amber-500 animate-pulse' : dev.status==='Disconnected'?'bg-red-500':'bg-emerald-500'}`}/>
            {measuring ? 'Measuring...' : dev.status}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          <div className="bg-warm-50 rounded-lg p-2"><span className="text-slate-400">电量</span><p className="font-bold text-slate-700">{dev.battery}%</p></div>
          <div className="bg-warm-50 rounded-lg p-2"><span className="text-slate-400">上次同步</span><p className="font-bold text-slate-700">{isBP ? '30 sec ago' : dev.lastSync}</p></div>
        </div>
        {isBP && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg border border-red-100 p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-red-600 uppercase">实时血压读数</span>
              <button onClick={startBpMeasure} disabled={measuring} className="text-[9px] font-semibold bg-red-500 hover:bg-red-600 disabled:bg-slate-300 text-white px-3 py-1 rounded-full transition-colors">
                {measuring ? 'Measuring...' : bpReading ? 'Re-measure' : 'Take Reading'}
              </button>
            </div>
            {measuring ? (
              <div className="flex items-center gap-2 py-3">
                <span className="text-sm text-red-400 animate-pulse">袖带充气中...</span>
                <svg className="animate-spin h-4 w-4 text-red-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              </div>
            ) : bpReading ? (
              <div className="flex items-center gap-4">
                <div className="text-center"><span className="text-[10px] text-red-400 block">收缩压</span><span className="text-xl font-extrabold text-red-700">{bpReading.sys}</span><span className="text-[10px] text-red-400 ml-0.5">mmHg</span></div>
                <span className="text-red-300 text-lg">/</span>
                <div className="text-center"><span className="text-[10px] text-red-400 block">舒张压</span><span className="text-xl font-extrabold text-red-700">{bpReading.dia}</span><span className="text-[10px] text-red-400 ml-0.5">mmHg</span></div>
                <div className="w-px h-8 bg-red-200" />
                <div className="text-center"><span className="text-[10px] text-slate-400 block">脉搏</span><span className="text-xl font-extrabold text-slate-700">{bpReading.hr}</span><span className="text-[10px] text-slate-400 ml-0.5">bpm</span></div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${bpReading.sys>=140?'bg-red-100 text-red-700':bpReading.sys>=130?'bg-amber-100 text-amber-700':'bg-emerald-100 text-emerald-700'}`}>
                  {bpReading.sys>=140?'Stage 2 HTN':bpReading.sys>=130?'Stage 1 HTN':'Normal'}
                </span>
              </div>
            ) : (
              <p className="text-[10px] text-slate-400 py-2">Press "Take Reading" to measure via Bluetooth</p>
            )}
          </div>
        )}
        <p className="text-[10px] font-semibold text-slate-600 mb-1">参数:</p>
        <div className="flex flex-wrap gap-1">{dev.parameters.map((p,j)=>(<span key={j} className="text-[9px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">{p}</span>))}</div>
      </div>
    )})}
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
