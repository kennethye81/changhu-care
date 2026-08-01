import { type FC, useState, useMemo, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, ClipboardCheck, X, ChevronRight, Calendar, Clock, Building2, Stethoscope, ArrowUpDown } from 'lucide-react';
import { DndContext, useDraggable, useDroppable, DragOverlay, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { CARE_TEAM } from '../data/careTeam';
import { usePatientStore } from '../store/patientStore';

export interface MedicalHistoryEntry {
  date: string; type: 'admission' | 'discharge' | 'surgery' | 'outpatient' | 'er' | 'followup';
  facility: string; department: string; physician: string;
  chiefComplaint: string; diagnosis: string;
  labs?: string; imaging?: string; prescriptions?: string; notes?: string;
}


import { PENDING_PATIENTS as _PENDING_FROM_DATA, type PendingPatientData } from '../data/pendingPatients';
import { getCarePlanDefaults, type CarePlanData } from '../data/pendingRegistrationForms';
import PendingRegistrationAssessmentForm from '../components/PendingRegistrationAssessmentForm';
import PendingRegistrationCarePlanForm from '../components/PendingRegistrationCarePlanForm';

export type PendingPatient = PendingPatientData;
export const PENDING_PATIENTS: PendingPatient[] = _PENDING_FROM_DATA;

const PendingRegistration: FC = () => {
  const { pid } = useParams<{ pid?: string }>();
  const [selectedPatient, setSelectedPatient] = useState<PendingPatient | null>(null);

  // Auto-select patient when navigating with pid in URL
  useEffect(() => {
    if (pid) {
      const patient = PENDING_PATIENTS.find(p => String(p.id) === pid);
      if (patient) setSelectedPatient(patient);
    }
  }, [pid]);

  const [historyModal, setHistoryModal] = useState<PendingPatient | null>(null);
  const [assessmentModal, setAssessmentModal] = useState<PendingPatient | null>(null);
  const [assessmentPhase, setAssessmentPhase] = useState<'filling' | 'complete' | 'ai_review' | 'nd_review' | 'approved'>('complete');
  const [carePlanPatient, setCarePlanPatient] = useState<PendingPatient | null>(null);
  const [carePlanPhase, setCarePlanPhase] = useState<'filling' | 'complete' | 'ai_review' | 'nd_review' | 'approved'>('filling');
  const [carePlanData, setCarePlanData] = useState<CarePlanData | null>(null);
  const [showVacantModal, setShowVacantModal] = useState(false);
  const [historyAtBottom, setHistoryAtBottom] = useState(false);
  const historyScrollRef = useRef<HTMLDivElement>(null);

  const [matchScores, setMatchScores] = useState<Record<string, number>>({});

  const [regStep, setRegStep] = useState(0);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const [assignedElites, setAssignedElites] = useState<Set<string>>(new Set());
  const [activeDragObj, setActiveDragObj] = useState<any>(null);
  const [matchingActive, setMatchingActive] = useState(false);
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [matchingDim, setMatchingDim] = useState(0);
  const [sortBy, setSortBy] = useState<'name' | 'discharge'>('discharge');
  const [dirs, setDirs] = useState({ name: 'asc', discharge: 'asc' });
  const [filterHospital, setFilterHospital] = useState('all');
  const [filterDoctor, setFilterDoctor] = useState('all');

  const hospitals = useMemo(() => [...new Set(PENDING_PATIENTS.map(p => p.hospital))].sort(), []);
  const doctors = useMemo(() => [...new Set(PENDING_PATIENTS.map(p => p.doctor))].sort(), []);

  const filteredPatients = useMemo(() => {
    let list = [...PENDING_PATIENTS];
    if (filterHospital !== 'all') list = list.filter(p => p.hospital === filterHospital);
    if (filterDoctor !== 'all') list = list.filter(p => p.doctor === filterDoctor);
    const dir = dirs[sortBy] === 'asc' ? 1 : -1;
    const sorted = list.sort((a, b) => {
      const cmp = sortBy === 'name'
        ? a.name.localeCompare(b.name, 'zh-Hant')
        : a.dischargeDate.localeCompare(b.dischargeDate);
      return cmp * dir;
    });
    return sorted;
  }, [sortBy, filterHospital, filterDoctor]);

  // Assessment opens immediately in complete state
  useEffect(() => {
    if (assessmentModal) {
      setAssessmentPhase('complete');
    }
  }, [assessmentModal]);

  const assessmentScrollRef = useRef<HTMLDivElement>(null);
  const careScrollRef = useRef<HTMLDivElement>(null);

  const startCarePlan = () => {
    setCarePlanPhase('complete');
  };
  // Initialize care plan data when patient is set
  useEffect(() => {
    if (carePlanPatient && !carePlanData) {
      setCarePlanData(getCarePlanDefaults(carePlanPatient));
    }
  }, [carePlanPatient]);

  // Medical History Modal — inline so it's accessible from both detail and card views
  const renderTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      admission: 'bg-teal-100 text-teal-700',
      discharge: 'bg-emerald-100 text-emerald-700',
      surgery: 'bg-red-100 text-red-700',
      outpatient: 'bg-amber-100 text-amber-700',
      er: 'bg-orange-100 text-orange-700',
      followup: 'bg-purple-100 text-purple-700',
    };
    return (
      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${colors[type] || 'bg-warm-100 text-slate-600'}`}>
        {type}
      </span>
    );
  };

  // Patient detail view
  if (selectedPatient) {
    const p = selectedPatient;
    return (
      <div className="p-6">
        <button onClick={() => setSelectedPatient(null)} className="text-xs text-teal-600 hover:text-teal-800 font-semibold mb-4 flex items-center gap-1">
          ← ← 返回患者登记
        </button>
        <div className="glass-card rounded-2xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-teal-800 px-6 py-4 flex justify-between items-start">
            <div>
              <h2 className="text-sm font-bold text-white">{p.name}</h2>
              <p className="text-[10px] text-teal-200">{p.gender}, {p.age} yrs · Referred {p.referralDate} · Expected D/C {p.dischargeDate}</p>
            </div>
            {registrationComplete && (
              <div className="bg-gold-600 text-white text-[9px] font-bold px-3 py-1.5 rounded-lg border border-gold-500 shadow-sm opacity-70 pointer-events-none select-none flex-shrink-0">
                登记完成 → 登记完成
              </div>
            )}
          </div>
          <div className="relative overflow-hidden">
          <div className="p-6 grid grid-cols-2 gap-5 text-xs">
            <div><span className="text-slate-400 block mb-0.5">医院</span><p className="font-semibold text-slate-800">{p.hospital}</p></div>
            <div><span className="text-slate-400 block mb-0.5">科室</span><p className="font-semibold text-slate-800">{p.department}</p></div>
            <div className="col-span-2"><span className="text-slate-400 block mb-0.5">诊断</span><p className="font-semibold text-slate-800">{p.diagnosis}</p></div>
            <div><span className="text-slate-400 block mb-0.5">主治医师</span><p className="font-semibold text-slate-800">{p.doctor}</p></div>
            <div><span className="text-slate-400 block mb-0.5">预计出院日期</span><p className="font-semibold text-slate-800">{p.dischargeDate}</p></div>
            <div className="col-span-2 border-t pt-4 mt-2">
              <span className="text-slate-400 block mb-1">推荐居家照护服务</span>
              <ul className="space-y-1">
                {p.services.split('·').map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-slate-700 text-[11px]">
                    <span className="text-amber-500 mt-0.5">•</span> {s.trim()}
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 border-t pt-4 mt-2">
              <span className="text-slate-400 block mb-2">联系人</span>
              <div className="bg-warm-50 rounded-xl p-4">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{p.contactName}</p>
                  <p className="text-[10px] text-slate-500">{p.contactRelation} · {p.contactPhone}</p>
                </div>
              </div>
            </div>
            <div className="col-span-2 border-t pt-4 mt-2">
              <div className="flex items-center gap-2">
                <button onClick={() => setHistoryModal(p)} className={`text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm ${regStep > 0 ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-teal-600 text-white hover:bg-teal-700'}`}>
                  {regStep > 0 ? '✓ ' : ''}查看病史档案
                </button>
                <button onClick={() => regStep >= 1 && setAssessmentModal(p)} className={`text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm ${regStep === 1 ? 'bg-teal-600 text-white hover:bg-teal-700' : regStep > 1 ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                  {regStep > 1 ? '✓ ' : ''}初始评估
                </button>
                <button onClick={() => regStep >= 2 && (setCarePlanPatient(p), startCarePlan())} className={`text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm ${regStep === 2 ? 'bg-gold-600 text-white hover:bg-gold-700' : regStep > 2 ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                  {regStep > 2 ? '✓ ' : ''}制定照护计划
                </button>
                <button onClick={() => regStep >= 3 && setShowVacantModal(true)} className={`text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm ${regStep === 3 ? 'bg-gold-600 text-white hover:bg-gold-700' : regStep > 3 ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                  {regStep > 3 ? '✓ ' : ''}分配照护专员
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Medical History Modal */}
        {historyModal && (
          <div className="fixed inset-0 z-[400] flex items-start justify-center pt-16 bg-black/40 backdrop-blur-sm" onClick={() => setHistoryModal(null)}>
            <div className="glass-card rounded-2xl shadow-2xl w-[750px] max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-teal-600 to-teal-800 rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-white" />
                  <span className="text-sm font-bold text-white">病史档案 — {historyModal.name}</span>
                </div>
                <button onClick={() => setHistoryModal(null)} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center"><X className="w-3.5 h-3.5 text-white" /></button>
              </div>
              <div ref={historyScrollRef} onScroll={() => {
                const el = historyScrollRef.current;
                if (el) setHistoryAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 30);
              }} className="overflow-y-auto p-5 space-y-3">
                {historyModal.medicalHistory.map((entry, i) => (
                  <div key={i} className="glass-card rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    {/* Card Header */}
                    <div className="bg-warm-50 px-4 py-2.5 flex items-center justify-between border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        {renderTypeBadge(entry.type)}
                        <span className="text-[10px] font-semibold text-slate-700">{entry.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[9px] text-slate-500">
                        <span className="text-slate-400">{entry.facility}</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-400">{entry.department}</span>
                        <span className="text-slate-300">|</span>
                        <span className="font-medium text-slate-600">{entry.physician}</span>
                      </div>
                    </div>
                    {/* Card Body */}
                    <div className="px-4 py-3 space-y-2">
                      <div>
                        <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide">主诉</span>
                        <p className="text-[11px] text-slate-700 mt-0.5 leading-relaxed">{entry.chiefComplaint}</p>
                      </div>
                      <div>
                        <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide">诊断</span>
                        <p className="text-[11px] text-slate-700 mt-0.5 leading-relaxed">{entry.diagnosis}</p>
                      </div>
                      {entry.labs && (
                        <div>
                          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide">检验</span>
                          <p className="text-[10px] text-slate-600 mt-0.5 leading-relaxed">{entry.labs}</p>
                        </div>
                      )}
                      {entry.imaging && (
                        <div>
                          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide">影像</span>
                          <p className="text-[10px] text-slate-600 mt-0.5 leading-relaxed">{entry.imaging}</p>
                        </div>
                      )}
                      {entry.prescriptions && (
                        <div>
                          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide">处方</span>
                          <p className="text-[10px] text-slate-600 mt-0.5 leading-relaxed">{entry.prescriptions}</p>
                        </div>
                      )}
                      {entry.notes && (
                        <div className="bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
                          <span className="text-[9px] font-semibold text-amber-600 uppercase tracking-wide">备注</span>
                          <p className="text-[10px] text-amber-800 mt-0.5 leading-relaxed">{entry.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end px-5 pb-4 pt-3 border-t mt-3">
                <button onClick={() => { if (historyAtBottom) { setHistoryModal(null); setRegStep(1); } }} className={`text-[10px] font-semibold px-4 py-1.5 rounded-lg transition-colors ${historyAtBottom ? 'text-white bg-teal-600 hover:bg-teal-700' : 'text-slate-400 bg-slate-200 cursor-not-allowed'}`}>已读</button>
              </div>
            </div>
          </div>
        )}

        {/* Assessment Modal */}
        {assessmentModal && (
          <div className="fixed inset-0 z-[400] flex items-start justify-center pt-10 bg-black/40 backdrop-blur-sm" onClick={() => assessmentPhase === 'filling' ? null : setAssessmentModal(null)}>
            <div className="glass-card rounded-2xl shadow-2xl w-[800px] max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-teal-600 to-teal-800 rounded-t-2xl flex-shrink-0">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-white" />
                  <span className="text-sm font-bold text-white">长护险综合初始评估表</span>
                </div>
                {assessmentPhase !== 'filling' && <button onClick={() => setAssessmentModal(null)} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center"><X className="w-3.5 h-3.5 text-white" /></button>}
              </div>
              <div ref={assessmentScrollRef} className="overflow-y-auto p-5 space-y-4">
              <div className="space-y-4 text-[10px]">
                <PendingRegistrationAssessmentForm patient={assessmentModal} />
              </div>
              <div className="flex justify-end pt-3 border-t px-5 pb-4">
                  <button onClick={() => { setAssessmentModal(null); setRegStep(2); }} className="bg-teal-600 text-white text-xs font-bold px-6 py-2 rounded-lg hover:bg-teal-700 shadow-sm">批准</button>
                </div>
              </div>
            </div>
          </div>
        )}

            {/* Care Plan Modal */}
            {carePlanPatient && (() => {
            const p = carePlanPatient;
            const cpd = carePlanData || getCarePlanDefaults(p);
            return (
            <div className="fixed inset-0 z-[400] flex items-start justify-center pt-6 bg-black/40 backdrop-blur-sm" onClick={() => carePlanPhase === 'filling' ? null : setCarePlanPatient(null)}>
              <div className="glass-card rounded-2xl shadow-2xl w-[860px] max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-teal-600 to-teal-800 rounded-t-2xl flex-shrink-0">
                  <div className="flex items-center gap-2"><ClipboardCheck className="w-5 h-5 text-white" /><span className="text-sm font-bold text-white">患者照护计划</span></div>
                  {carePlanPhase !== 'filling' && <button onClick={() => setCarePlanPatient(null)} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center"><X className="w-3.5 h-3.5 text-white" /></button>}
                </div>
                <div ref={careScrollRef} className="overflow-y-auto p-5 space-y-4 text-[11px]">
                  <PendingRegistrationCarePlanForm patient={p} data={cpd} onDataChange={setCarePlanData} />
                </div>
                <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200">
                  <div className="text-[9px] text-slate-400">* Required fields</div>
                  <div className="flex items-center gap-3">
                    {carePlanPhase === 'complete' && <button onClick={() => { setCarePlanData(cpd); setCarePlanPatient(null); setRegStep(3); }} className="bg-teal-600 text-white text-xs font-bold px-6 py-2 rounded-lg hover:bg-teal-700 shadow-sm">批准</button>}
                  </div>
                </div>
              </div>
            </div>
            );})()}

            {showVacantModal && (
              <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowVacantModal(false)}>
                <DndContext onDragStart={(event: DragStartEvent) => { setActiveDragObj(event.active.data.current as any); }} onDragEnd={(event: DragEndEvent) => {
                  setActiveDragObj(null);
                  if (event.over?.id === 'selected-pool') {
                    setAssignedElites(prev => { const s = new Set(prev); s.add(event.active.id as string); return s; });
                  }
                }}>
                <div className="glass-card rounded-2xl shadow-2xl w-[720px] h-[620px] flex flex-col overflow-clip" onClick={e => e.stopPropagation()}>
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-teal-600 to-teal-800 rounded-t-2xl flex-shrink-0">
                    <span className="text-sm font-bold text-white">分配照护专员s</span>
                    <button onClick={() => { setShowVacantModal(false); setAssignedElites(new Set()); setMatchScores({}); }} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"><X className="w-3.5 h-3.5 text-white" /></button>
                  </div>
                  {matchingActive && (
                    <div className="px-5 py-4 bg-warm-50 border-b border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-semibold text-teal-700">AI Matching in progress...</span>
                        <span className="text-[10px] font-bold text-gold-600">{matchingProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mb-3 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-gold-400 to-gold-600 rounded-full transition-all duration-500 ease-out" style={{ width: `${matchingProgress}%` }} />
                      </div>
                      <div className="space-y-1">
                        {['Diagnosis & Specialty Alignment', 'Medical History & Certifications', 'Services & Role Match', 'Experience & Seniority', 'Availability & Schedule'].map((d, i) => (
                          <div key={d} className={`flex items-center gap-2 text-[9px] transition-all duration-300 ${matchingDim > i ? 'text-teal-700 font-semibold' : matchingDim === i ? 'text-gold-600 font-semibold' : 'text-slate-300'}`}>
                            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${matchingDim > i ? 'bg-emerald-400 text-white' : matchingDim === i ? 'bg-gold-400 text-white animate-pulse' : 'bg-slate-200'}`}>
                              {matchingDim > i ? '✓' : matchingDim === i ? '◷' : i + 1}
                            </span>
                            {d}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Body: Left panel + Right panel */}
                  <div className="flex flex-1 min-h-0 overflow-hidden">
                    {/* Left Panel: Elite List */}
                    <div className="w-[55%] overflow-y-auto p-3 border-r border-slate-200 space-y-3 bg-white">
                      {[
                        { role: 'Case Manager', color: 'teal', staff: [
                          { id:'CM001', name:'Grace Tang', age:40, gender:'Female', role:'CM', spec:'Care Coordination & Discharge Planning', exp:12, avatar:'/avatars/grace-tang.png' },
                          { id:'CM002', name:'Tony Lam', age:43, gender:'Male', role:'CM', spec:'Complex Cases & Palliative Care', exp:15, avatar:'/avatars/tony-lam.png' },
                          { id:'CM003', name:'Anna Leung', age:38, gender:'Female', role:'CM', spec:'Elderly Home Care & Chronic Disease', exp:10, avatar:'/avatars/anna-leung.png' },
                        ]},
                        { role: 'Registered Nurse (RN)', color: 'amber', staff: [
                          { id:'N006', name:'Jessie Fong', age:34, gender:'Female', role:'RN', spec:'Geriatric & Chronic Disease', exp:7, avatar:'/avatars/rn-vacant-1.png' },
                          { id:'N007', name:'Maggie Cheung', age:41, gender:'Female', role:'RN', spec:'Post-Surgical & Palliative', exp:8, avatar:'/avatars/rn-vacant-2.png' },
                          { id:'N008', name:'Brian Ng', age:29, gender:'Male', role:'RN', spec:'Cardiac & Respiratory', exp:6, avatar:'/avatars/rn-vacant-3.png' },
                          { id:'N002', name:'Jenny Tam', age:29, gender:'Female', role:'RN', spec:'Home Care Nursing', exp:5, avatar:'/avatars/jenny-tam.png' },
                          { id:'N004', name:'Connie Cheung', age:42, gender:'Female', role:'RN', spec:'Wound Care & Medication', exp:14, avatar:'/avatars/connie-cheung.png' },
                        ]},
                        { role: 'Rehab Therapist (PT)', color: 'emerald', staff: [
                          { id:'R006', name:'Catherine Tsang', age:37, gender:'Female', role:'PT', spec:'Orthopedic & Neuro', exp:7, avatar:'/avatars/pt-vacant-1.png' },
                          { id:'R007', name:'Samson Hui', age:45, gender:'Male', role:'PT', spec:'Geriatric & Falls Prevention', exp:9, avatar:'/avatars/pt-vacant-2.png' },
                          { id:'R008', name:'Jason Chan', age:32, gender:'Male', role:'PT', spec:'Cardiac & Pulmonary', exp:5, avatar:'/avatars/pt-vacant-3.png' },
                          { id:'R003', name:'Raymond Wong', age:45, gender:'Male', role:'PT', spec:'Stroke Rehab & Mobility', exp:12, avatar:'/avatars/raymond-wong.png' },
                        ]},
                        { role: 'Care Worker', color: 'purple', staff: [
                          { id:'CW007', name:'Alice Ho', age:43, gender:'Female', role:'CW', spec:'Elderly Home Care', exp:6, avatar:'/avatars/cw-vacant-1.png' },
                          { id:'CW008', name:'Michelle Yuen', age:38, gender:'Female', role:'CW', spec:'Post-Stroke & Dementia', exp:8, avatar:'/avatars/cw-vacant-2.png' },
                          { id:'CW009', name:'Kenny Ma', age:48, gender:'Male', role:'CW', spec:'Post-Surgical & Wound', exp:5, avatar:'/avatars/cw-vacant-3.png' },
                          { id:'CW002', name:'Lisa Cheng', age:38, gender:'Female', role:'CW', spec:'Personal Care & Companionship', exp:7, avatar:'/avatars/lisa-cheng.png' },
                          { id:'CW003', name:'Carol Ng', age:45, gender:'Female', role:'CW', spec:'Dementia & Palliative Care', exp:10, avatar:'/avatars/carol-ng.png' },
                        ]},
                      ].map(group => (
                        <div key={group.role}>
                          <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block border-b border-teal-100 pb-1 mb-2">{group.role}</span>
                          <div className="space-y-1.5">
                            {[...group.staff].sort((a, b) => {
                              const sa = matchScores[a.id] ?? 0;
                              const sb = matchScores[b.id] ?? 0;
                              return sb - sa;
                            }).map(s => assignedElites.has(s.id) ? null : (
                              <DraggableCard key={s.id} s={s} score={matchScores[s.id]} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Right Panel: Selected Elites */}
                    <Pool assignedElites={assignedElites} setAssignedElites={setAssignedElites} matchScores={matchScores} p={p} />
                  </div>
                </div>
                <DragOverlay dropAnimation={null}>
                  {activeDragObj ? (
                    <div className="glass-card rounded-xl border border-[#C49A6C] p-2.5 bg-white shadow-2xl opacity-95 scale-105 z-[9999]">
                      <div className="flex items-center gap-2">
                        <img src={activeDragObj.avatar} alt={activeDragObj.name} className="w-9 h-9 rounded-full object-cover border-2 border-slate-100 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold text-slate-800 truncate">{activeDragObj.name}</p>
                          <p className="text-[8px] text-slate-400">{activeDragObj.role} · {activeDragObj.spec}</p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </DragOverlay>
                </DndContext>
              </div>
            )}
      </div>
    );
  }

  /* ────── Draggable Card ────── */
  function DraggableCard({ s, score }: { s: any; score?: number }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: s.id, data: s });
    const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 50, opacity: 0.9 } : undefined;
    return (
      <div ref={setNodeRef} {...listeners} {...attributes} style={style}
        className={`relative glass-card rounded-xl border p-2.5 cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-0' : 'hover:shadow-md transition-shadow'} ${score ? (score >= 70 ? 'border-teal-300' : score >= 40 ? 'border-gold-300' : 'border-slate-200') : 'border-slate-200'}`}>
        <div className="flex items-center gap-2">
          <img src={s.avatar} alt={s.name} className="w-9 h-9 rounded-full object-cover border-2 border-slate-100 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-slate-800 truncate">{s.name}</p>
            <p className="text-[8px] text-slate-400">{s.role} · {s.spec}</p>
          </div>
        </div>
        {/* Match % badge */}
        <div className="absolute bottom-2 right-2">
          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${score !== undefined ? (score >= 70 ? 'bg-emerald-100 text-emerald-700' : score >= 40 ? 'bg-gold-100 text-gold-700' : 'bg-slate-100 text-slate-500') : 'bg-slate-100 text-slate-300'}`}>
            {score !== undefined ? `${score}%` : '%'}
          </span>
        </div>
      </div>
    );
  };

  /* ────── Selected Pool ────── */
  function Pool({ assignedElites, setAssignedElites, matchScores, p }: { assignedElites: Set<string>; setAssignedElites: React.Dispatch<React.SetStateAction<Set<string>>>; matchScores: Record<string, number>; p: any }) {
    const { setNodeRef, isOver } = useDroppable({ id: 'selected-pool' });
    const assignedList = Array.from(assignedElites).map(id => {
      const groups = [
        { id:'CM001', name:'Grace Tang', role:'CM', avatar:'/avatars/grace-tang.png' },
        { id:'CM002', name:'Tony Lam', role:'CM', avatar:'/avatars/tony-lam.png' },
        { id:'CM003', name:'Anna Leung', role:'CM', avatar:'/avatars/anna-leung.png' },
        { id:'N006', name:'Jessie Fong', role:'RN', avatar:'/avatars/rn-vacant-1.png' },
        { id:'N007', name:'Maggie Cheung', role:'RN', avatar:'/avatars/rn-vacant-2.png' },
        { id:'N008', name:'Brian Ng', role:'RN', avatar:'/avatars/rn-vacant-3.png' },
        { id:'N002', name:'Jenny Tam', role:'RN', avatar:'/avatars/jenny-tam.png' },
        { id:'N004', name:'Connie Cheung', role:'RN', avatar:'/avatars/connie-cheung.png' },
        { id:'R006', name:'Catherine Tsang', role:'PT', avatar:'/avatars/pt-vacant-1.png' },
        { id:'R007', name:'Samson Hui', role:'PT', avatar:'/avatars/pt-vacant-2.png' },
        { id:'R008', name:'Jason Chan', role:'PT', avatar:'/avatars/pt-vacant-3.png' },
        { id:'R003', name:'Raymond Wong', role:'PT', avatar:'/avatars/raymond-wong.png' },
        { id:'CW007', name:'Alice Ho', role:'CW', avatar:'/avatars/cw-vacant-1.png' },
        { id:'CW008', name:'Michelle Yuen', role:'CW', avatar:'/avatars/cw-vacant-2.png' },
        { id:'CW009', name:'Kenny Ma', role:'CW', avatar:'/avatars/cw-vacant-3.png' },
        { id:'CW002', name:'Lisa Cheng', role:'CW', avatar:'/avatars/lisa-cheng.png' },
        { id:'CW003', name:'Carol Ng', role:'CW', avatar:'/avatars/carol-ng.png' },
      ];
      return groups.find(g => g.id === id) || { id, name: id, role: '?', avatar: '' };
    });

    return (
      <div ref={setNodeRef} className={`w-[45%] flex flex-col min-h-0 transition-colors ${isOver ? 'bg-[#FDF5E8]' : 'bg-slate-50'}`}>
        {/* Sticky Header */}
        <div className="flex-shrink-0 px-3 pt-3 pb-2 border-b border-slate-200 flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-600">Selected Elites ({assignedElites.size})</p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setAssignedElites(new Set())} className="text-[10px] font-semibold bg-teal-600 text-white px-2 py-0.5 rounded hover:bg-teal-700 transition-colors">清除</button>
            <button onClick={() => {
              const allElites = ['CM001','CM002','CM003','N006','N007','N008','N002','N004','R006','R007','R008','R003','CW007','CW008','CW009','CW002','CW003'];
              const best = allElites.filter(id => !assignedElites.has(id)).sort((a, b) => (matchScores[b] || 0) - (matchScores[a] || 0));
              const newSet = new Set(assignedElites);
              const cm = best.find(id => id.startsWith('CM')); if (cm) newSet.add(cm);
              const rn = best.find(id => id.startsWith('N')); if (rn) newSet.add(rn);
              const pt = best.find(id => id.startsWith('R')); if (pt) newSet.add(pt);
              const cw = best.find(id => id.startsWith('CW')); if (cw) newSet.add(cw);
              setAssignedElites(newSet);
            }} className={`text-[10px] font-semibold px-2 py-0.5 rounded transition-colors ${Object.keys(matchScores).length > 0 ? 'bg-[#C49A6C] text-white hover:bg-[#B8860B]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>自动分配</button>
          </div>
        </div>
        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 min-h-0">
          {assignedList.map(el => (
            <div key={el.id} className="flex items-center gap-2 bg-white rounded-lg border border-slate-100 p-2 group">
              <img src={el.avatar} alt={el.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0"><p className="text-[9px] font-bold text-slate-700 truncate">{el.name}</p><span className="text-[7px] text-slate-400">{el.role}</span></div>
              <span className="text-[8px] font-bold text-[#C49A6C] flex-shrink-0">{matchScores[el.id] || '-'}%</span>
              <button onClick={() => setAssignedElites(prev => { const s = new Set(prev); s.delete(el.id); return s; })} className="w-5 h-5 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center flex-shrink-0 transition-colors">
                <X className="w-3 h-3 text-red-400 hover:text-red-500" />
              </button>
            </div>
          ))}
          {assignedElites.size === 0 && <p className="text-[9px] text-slate-300 italic text-center py-8">拖拽照护人员到此分配</p>}
        </div>
        {/* Sticky Footer */}
        <div className="flex-shrink-0 border-t border-slate-200 px-3 py-2 space-y-2">
          {/* AI Progress or Summary */}
          {matchingActive && matchingProgress < 100 && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-semibold text-teal-700">AI Matching...</span>
                <span className="text-[9px] font-bold text-gold-600">{matchingProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-gold-400 to-gold-600 rounded-full transition-all duration-500" style={{ width: `${matchingProgress}%` }} />
              </div>
              <div className="space-y-0.5">
                {['Diagnosis & Specialty','Medical History','Services & Role','Experience','Availability'].map((d, i) => (
                  <div key={d} className={`text-[7px] transition-all duration-300 ${matchingDim > i ? 'text-teal-700' : matchingDim === i ? 'text-gold-600' : 'text-slate-300'}`}>
                    {matchingDim > i ? '\u2713' : matchingDim === i ? '\u25F7' : i+1} {d}
                  </div>
                ))}
              </div>
            </div>
          )}
          {(!matchingActive || matchingProgress >= 100) && Object.keys(matchScores).length > 0 && (
            <div className="pb-1">
              <p className="text-[9px] font-bold text-emerald-700 mb-1">{'\u2713'} AI Matching Complete</p>
              {[
                { cat:'Case Manager', ids:['CM001','CM002','CM003'], names:{CM001:'Grace Tang',CM002:'Tony Lam',CM003:'Anna Leung'} as any },
                { cat:'RN', ids:['N006','N007','N008','N002','N004'], names:{N006:'Jessie Fong',N007:'Maggie Cheung',N008:'Brian Ng',N002:'Jenny Tam',N004:'Connie Cheung'} as any },
                { cat:'PT', ids:['R006','R007','R008','R003'], names:{R006:'Catherine Tsang',R007:'Samson Hui',R008:'Jason Chan',R003:'Raymond Wong'} as any },
                { cat:'CW', ids:['CW007','CW008','CW009','CW002','CW003'], names:{CW007:'Alice Ho',CW008:'Michelle Yuen',CW009:'Kenny Ma',CW002:'Lisa Cheng',CW003:'Carol Ng'} as any },
              ].map(({cat, ids, names}) => {
                const top = ids.map(id => ({id, name:names[id], score:matchScores[id]||0})).sort((a,b)=>b.score-a.score)[0];
                return <div key={cat} className="text-[7px] text-slate-600 leading-relaxed"><b>{cat}:</b> {top.name} <span className="text-emerald-600 font-bold">{top.score}%</span> <span className="text-slate-400">— {top.score>=70?'Excellent alignment':'Good fit'}</span></div>;
              })}
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={() => { setMatchingActive(true); setMatchingProgress(0); setMatchingDim(0); setMatchScores({}); const dims = ['Diagnosis & Specialty','Medical History','Services & Role','Experience','Availability']; let step = 0; const t1 = setInterval(() => { step++; setMatchingDim(step); setMatchingProgress(prev => Math.min(prev + 20, 100)); if (step >= dims.length) { clearInterval(t1); const allStaff = [{id:'CM001',name:'Grace Tang',age:40,gender:'Female',role:'CM',spec:'Care Coordination & Discharge Planning',exp:12,avatar:'/avatars/grace-tang.png'},{id:'CM002',name:'Tony Lam',age:43,gender:'Male',role:'CM',spec:'Complex Cases & Palliative Care',exp:15,avatar:'/avatars/tony-lam.png'},{id:'CM003',name:'Anna Leung',age:38,gender:'Female',role:'CM',spec:'Elderly Home Care & Chronic Disease',exp:10,avatar:'/avatars/anna-leung.png'},{id:'N006',name:'Jessie Fong',age:34,gender:'Female',role:'RN',spec:'Geriatric & Chronic Disease',exp:7,avatar:'/avatars/rn-vacant-1.png'},{id:'N007',name:'Maggie Cheung',age:41,gender:'Female',role:'RN',spec:'Post-Surgical & Palliative',exp:8,avatar:'/avatars/rn-vacant-2.png'},{id:'N008',name:'Brian Ng',age:29,gender:'Male',role:'RN',spec:'Cardiac & Respiratory',exp:6,avatar:'/avatars/rn-vacant-3.png'},{id:'N002',name:'Jenny Tam',age:29,gender:'Female',role:'RN',spec:'Home Care Nursing',exp:5,avatar:'/avatars/jenny-tam.png'},{id:'N004',name:'Connie Cheung',age:42,gender:'Female',role:'RN',spec:'Wound Care & Medication',exp:14,avatar:'/avatars/connie-cheung.png'},{id:'R006',name:'Catherine Tsang',age:37,gender:'Female',role:'PT',spec:'Orthopedic & Neuro',exp:7,avatar:'/avatars/pt-vacant-1.png'},{id:'R007',name:'Samson Hui',age:45,gender:'Male',role:'PT',spec:'Geriatric & Falls Prevention',exp:9,avatar:'/avatars/pt-vacant-2.png'},{id:'R008',name:'Jason Chan',age:32,gender:'Male',role:'PT',spec:'Cardiac & Pulmonary',exp:5,avatar:'/avatars/pt-vacant-3.png'},{id:'R003',name:'Raymond Wong',age:45,gender:'Male',role:'PT',spec:'Stroke Rehab & Mobility',exp:12,avatar:'/avatars/raymond-wong.png'},{id:'CW007',name:'Alice Ho',age:43,gender:'Female',role:'CW',spec:'Elderly Home Care',exp:6,avatar:'/avatars/cw-vacant-1.png'},{id:'CW008',name:'Michelle Yuen',age:38,gender:'Female',role:'CW',spec:'Post-Stroke & Dementia',exp:8,avatar:'/avatars/cw-vacant-2.png'},{id:'CW009',name:'Kenny Ma',age:48,gender:'Male',role:'CW',spec:'Post-Surgical & Wound',exp:5,avatar:'/avatars/cw-vacant-3.png'},{id:'CW002',name:'Lisa Cheng',age:38,gender:'Female',role:'CW',spec:'Personal Care & Companionship',exp:7,avatar:'/avatars/lisa-cheng.png'},{id:'CW003',name:'Carol Ng',age:45,gender:'Female',role:'CW',spec:'Dementia & Palliative Care',exp:10,avatar:'/avatars/carol-ng.png'}]; const diag = (p?.diagnosis || '').toLowerCase(); const mhEntries = (p as any)?.medicalHistory || []; const mh = typeof mhEntries === 'string' ? mhEntries.toLowerCase() : mhEntries.map((e: any) => (e.diagnosis || '') + ' ' + (e.chiefComplaint || '')).join(' ').toLowerCase(); const svc = (p?.services || '').toLowerCase(); const diagWords = diag.split(/[\s,·]+/).filter((w:string) => w.length > 2); const mhWords = mh.split(/[\s,·]+/).filter((w:string) => w.length > 2); const svcWords = svc.split(/[\s,·]+/).filter((w:string) => w.length > 2); const scores: Record<string,number> = {}; allStaff.forEach(s => { const team = Object.values(CARE_TEAM).find(t => t.id === s.id); const certs = team?.certifications?.join(' ').toLowerCase() || ''; const bio = team?.bio?.toLowerCase() || ''; const specWords = (s.spec + ' ' + certs + ' ' + bio).toLowerCase().split(/[\s,&]+/); const diagMatch = diagWords.filter((w:string) => specWords.some(sw => sw.includes(w) || w.includes(sw))).length; const diagScore = Math.round((diagMatch / Math.max(diagWords.length, 1)) * 35); const mhMatch = mhWords.filter((w:string) => certs.includes(w)).length; const mhScore = Math.min(Math.round((mhMatch / Math.max(mhWords.length || 1, 1)) * 15), 15); const svcMatch = svcWords.filter((w:string) => specWords.some(sw => sw.includes(w))).length; const svcScore = Math.min(Math.round((svcMatch / Math.max(svcWords.length || 1, 1)) * 15), 15); const expScore = Math.min(s.exp * 2, 20); const availScore = Math.min(Math.floor(Math.random() * 6) + 5, 10); scores[s.id] = Math.min(diagScore + mhScore + svcScore + expScore + availScore, 98); }); setMatchScores(scores); setTimeout(() => { setMatchingActive(false); }, 400); } }, 700); }} className="flex-1 text-[9px] font-semibold bg-gold-500/20 text-gold-700 py-1.5 rounded-lg border border-gold-500/30 hover:bg-gold-500/30 transition-colors">{'\u2728'} AI Smart Matching</button>
            <button onClick={() => { if (Array.from(assignedElites).some((id: string) => id.startsWith('CM')) && Array.from(assignedElites).some((id: string) => /^[NRC]/.test(id))) { setShowVacantModal(false); setAssignedElites(new Set()); setMatchScores({}); setRegStep(4); setRegistrationComplete(true); if (p.id === 114) { usePatientStore.getState().promotePatient(18); } } }} className={`flex-1 text-[9px] font-semibold py-1.5 rounded-lg transition-colors ${Array.from(assignedElites).some(id => id.startsWith('CM')) && Array.from(assignedElites).some(id => /^[NRC]/.test(id)) ? 'bg-gold-600 text-white hover:bg-gold-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>完成</button>
          </div>
        </div>
      </div>
    );
  };

  // Card list view

  // Card list view
  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-600" />
          患者登记
        </h2>
        <p className="text-xs text-slate-500 mt-1">{PENDING_PATIENTS.length} patients · {filteredPatients.length} shown</p>
      </div>

      {/* Sort & Filter Bar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 text-[10px]"><ArrowUpDown className="w-3 h-3 text-slate-400" />
          <div className="flex items-center gap-0.5">
            <button onClick={() => { setSortBy('discharge'); setDirs(d => ({ ...d, discharge: 'asc' })); }} className={`px-2 py-1 rounded-l font-semibold ${sortBy === 'discharge' ? 'bg-amber-100 text-amber-700' : 'text-slate-500 hover:bg-warm-100'}`}>出院日期</button>
            <button onClick={() => { if (sortBy === 'discharge') setDirs(d => ({ ...d, discharge: d.discharge === 'asc' ? 'desc' : 'asc' })); else { setSortBy('discharge'); } }} className={`px-1 py-1 rounded-r ${sortBy === 'discharge' ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:bg-warm-100'} font-bold`}>
              {sortBy === 'discharge' ? (dirs.discharge === 'asc' ? '↑' : '↓') : '↕'}
            </button>
          </div>
          <div className="flex items-center gap-0.5">
            <button onClick={() => { setSortBy('name'); setDirs(d => ({ ...d, name: 'asc' })); }} className={`px-2 py-1 rounded-l font-semibold ${sortBy === 'name' ? 'bg-amber-100 text-amber-700' : 'text-slate-500 hover:bg-warm-100'}`}>姓名</button>
            <button onClick={() => { if (sortBy === 'name') setDirs(d => ({ ...d, name: d.name === 'asc' ? 'desc' : 'asc' })); else { setSortBy('name'); } }} className={`px-1 py-1 rounded-r ${sortBy === 'name' ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:bg-warm-100'} font-bold`}>
              {sortBy === 'name' ? (dirs.name === 'asc' ? '↑' : '↓') : '↕'}
            </button>
          </div>
        </div>
        <div className="w-px h-4 bg-warm-200" />
        <select value={filterHospital} onChange={e => setFilterHospital(e.target.value)} className="text-[10px] border border-slate-200 rounded px-2 py-1 text-slate-600 bg-white">
          <option value="all">全部医院</option>
          {hospitals.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
        <select value={filterDoctor} onChange={e => setFilterDoctor(e.target.value)} className="text-[10px] border border-slate-200 rounded px-2 py-1 text-slate-600 bg-white">
          <option value="all">全部医生</option>
          {doctors.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {filteredPatients.map((p) => {
          const diagStyle: Record<string, string> = {
            'Cardiology':    'bg-rose-50 text-rose-700 border-rose-200',
            'Geriatric':     'bg-amber-50 text-amber-700 border-amber-200',
            'Orthopaedic':   'bg-orange-50 text-orange-700 border-orange-200',
            'Neurology':     'bg-purple-50 text-purple-700 border-purple-200',
            'Renal':         'bg-cyan-50 text-cyan-700 border-cyan-200',
            'Respiratory':   'bg-sky-50 text-sky-700 border-sky-200',
            'Oncology':      'bg-indigo-50 text-indigo-700 border-indigo-200',
            'Surgical':      'bg-stone-50 text-stone-700 border-stone-200',
          };
          const deptColor = diagStyle[p.department] || 'bg-slate-50 text-slate-600 border-slate-200';
          return (
          <div key={p.id} className="glass-card rounded-xl border-2 border-slate-200 p-4 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 hover:border-teal-300 transition-all" onClick={() => setSelectedPatient(p)}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 shadow-sm border-2 border-white">
                <img src={`/avatars/patient-${p.id}.png`} alt={p.name} className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    target.parentElement!.className = `w-10 h-10 rounded-full bg-gradient-to-br ${p.gender === 'F' ? 'from-rose-400 to-rose-600' : 'from-sky-400 to-sky-600'} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`;
                    target.parentElement!.textContent = p.name.split(' ').map(n => n[0]).join('');
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">{p.name}</p>
                <p className="text-[10px] font-semibold text-slate-500">{p.gender === 'M' ? '♂' : '♀'} {p.age} yrs</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${deptColor} truncate max-w-full`}>
                {p.department}
              </span>
            </div>
            <div className="space-y-1 text-[10px]">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="truncate">{p.hospital}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <Stethoscope className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span>{p.doctor}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span>Referred: <span className="font-medium text-slate-700">{p.referralDate}</span></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span>Expected D/C: <span className="font-medium text-slate-700">{p.dischargeDate}</span></span>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );

}

export default PendingRegistration;
