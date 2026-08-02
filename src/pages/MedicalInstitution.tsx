import { type FC, useState, useMemo } from 'react';
import { Building2, MapPin, Phone, Users, ChevronRight, X } from 'lucide-react';
import { PageHeader } from './Pages';
import { usePatientStore } from '../store/patientStore';
import { PENDING_PATIENTS } from '../data/pendingPatients';

interface HospitalMeta {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  liaison: string;
  departments: string[];
  doctors: string[];
  completedPatients: number;
}

const HOSPITALS_META: HospitalMeta[] = [

  { id: 1, name: '常州市第一人民医院', address: '江苏省常州市天宁区局前街185号', phone: '0519-68871111', email: 'info@czdyyy.cn', liaison: '张主任', departments: ['心内科','神经外科','康复科','老年科'], doctors: ['王伟'], completedPatients: 12 },
  { id: 2, name: '台州恩泽医疗中心恩泽医院', address: '浙江省台州市路桥区桐屿街道', phone: '0576-88881111', email: 'info@ezyl.com', liaison: '陈主任', departments: ['神经外科','康复科','心内科'], doctors: ['黄碧'], completedPatients: 8 },
  { id: 3, name: '常州市金坛区护理站', address: '江苏省常州市金坛区', phone: '0519-82881111', email: 'service@jintan-care.cn', liaison: '林晓东', departments: ['居家护理','康复治疗'], doctors: [], completedPatients: 5 },
  { id: 4, name: '路桥区护理站', address: '浙江省台州市路桥区', phone: '0576-82441111', email: 'service@luqiao-care.cn', liaison: '张丽华', departments: ['居家护理','DVT管理'], doctors: [], completedPatients: 3 },
];

const MedicalInstitution: FC = () => {
  const [selectedHospital, setSelectedHospital] = useState<(HospitalMeta & { activePatients: number; pendingPatients: number }) | null>(null);
  const summaries = usePatientStore(s => s.patientsSummary);

  const hospitals = useMemo(() => {
    const activeCounts: Record<string, number> = {};
    summaries.forEach(s => { activeCounts[s.hospital] = (activeCounts[s.hospital] || 0) + 1; });
    const pendingCounts: Record<string, number> = {};
    PENDING_PATIENTS.forEach(p => { pendingCounts[p.hospital] = (pendingCounts[p.hospital] || 0) + 1; });
    return HOSPITALS_META.map(h => ({
      ...h,
      activePatients: activeCounts[h.name] || 0,
      pendingPatients: pendingCounts[h.name] || 0,
    }));
  }, [summaries]);

  const totalActive = useMemo(() => hospitals.reduce((s, h) => s + h.activePatients, 0), [hospitals]);
  const totalPending = useMemo(() => hospitals.reduce((s, h) => s + h.pendingPatients, 0), [hospitals]);
  const totalCompleted = useMemo(() => hospitals.reduce((s, h) => s + h.completedPatients, 0), [hospitals]);

  return (
    <div className="p-6">
      <PageHeader title="Medical Institution" icon={Building2} subtitle={`${hospitals.length} partner hospitals · ${totalActive} active patients`} />
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-emerald-50 rounded-xl border border-slate-200 p-4">
          <p className="text-2xl font-extrabold text-emerald-600">{totalActive}</p>
          <p className="text-xs text-slate-500 mt-1">在管病人</p>
        </div>
        {totalPending > 0 ? (
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-4" style={{ animation: 'pending-glow 2s ease-in-out infinite' }}>
            <p className="text-2xl font-extrabold text-amber-600">{totalPending}</p>
            <p className="text-xs text-amber-500 mt-1">待登记</p>
          </div>
        ) : (
          <div className="bg-warm-50 rounded-xl border border-slate-200 p-4">
            <p className="text-2xl font-extrabold text-slate-600">{totalPending}</p>
            <p className="text-xs text-slate-500 mt-1">待登记</p>
          </div>
        )}
        <div className="bg-warm-50 rounded-xl border border-slate-200 p-4">
          <p className="text-2xl font-extrabold text-slate-600">{totalCompleted}</p>
          <p className="text-xs text-slate-500 mt-1">已完成</p>
        </div>
      </div>
      <style>{`
        @keyframes pending-glow {
          0%, 100% { background-color: #fef3c7; color: #d97706; }
          50% { background-color: #fde68a; color: #b45309; }
        }
      `}</style>
      <div className="grid grid-cols-2 gap-4">
        {hospitals.map(h => (
          <div key={h.id}
            className="glass-card rounded-xl border border-slate-200 p-5 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all"
            onClick={() => setSelectedHospital(h)}>
            <div className="flex items-start justify-between mb-3">
              <div><h3 className="text-sm font-bold text-slate-800">{h.name}</h3><p className="text-[10px] text-slate-400 mt-0.5">{h.departments.join(', ')}</p></div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${h.activePatients > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-warm-100 text-slate-500'}`}>{h.activePatients > 0 ? `${h.activePatients} active` : 'No active'}</span>
            </div>
            <div className="space-y-1 text-[10px] text-slate-500">
              <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 flex-shrink-0" /> {h.address}</div>
              <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 flex-shrink-0" /> {h.phone}</div>
              <div className="flex items-center gap-1.5"><Users className="w-3 h-3 flex-shrink-0" /> Liaison: {h.liaison}</div>
            </div>
            <div className="mt-3 flex items-center gap-3 text-[10px]">
              <span className="text-emerald-600 font-semibold">{h.activePatients} active</span>
              {h.pendingPatients > 0 ? (
                <span className="font-bold text-amber-600 px-2 py-0.5 rounded" style={{ animation: 'pending-glow 1.5s ease-in-out infinite' }}>{h.pendingPatients} pending</span>
              ) : (
                <span className="text-slate-300">{h.pendingPatients} pending</span>
              )}
              <span className="text-slate-400">{h.completedPatients} completed</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 ml-auto" />
            </div>
          </div>
        ))}
      </div>
      {selectedHospital && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-teal-900/30 backdrop-blur-md" onClick={() => setSelectedHospital(null)}>
          <div className="glass-card rounded-2xl shadow-2xl w-[520px] max-h-[85vh] overflow-y-auto m-4" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-4 flex items-center justify-between z-10 rounded-t-2xl">
              <div className="flex items-center gap-2"><Building2 className="w-5 h-5 text-white" /><span className="text-sm font-bold text-white">{selectedHospital.name}</span></div>
              <button onClick={() => setSelectedHospital(null)} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center"><X className="w-3.5 h-3.5 text-white" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="text-xs"><span className="text-slate-400">地址</span><p className="font-semibold text-slate-800 mt-0.5">{selectedHospital.address}</p></div>
              <div className="grid grid-cols-2 gap-3 text-xs"><div><span className="text-slate-400">电话</span><p className="font-semibold text-slate-800">{selectedHospital.phone}</p></div><div><span className="text-slate-400">邮箱</span><p className="font-semibold text-slate-800">{selectedHospital.email}</p></div></div>
              <div className="text-xs"><span className="text-slate-400">联络官</span><p className="font-semibold text-slate-800 mt-0.5">{selectedHospital.liaison}</p></div>
              <div className="text-xs"><span className="text-slate-400">科室</span><div className="flex flex-wrap gap-1 mt-1">{selectedHospital.departments.map(d => (<span key={d} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{d}</span>))}</div></div>
              <div className="text-xs"><span className="text-slate-400">合作医生</span><div className="mt-1 space-y-0.5">{selectedHospital.doctors.map(d => (<p key={d} className="text-slate-700">{'\u2022'} {d}</p>))}</div></div>
              <div className="border-t pt-3"><span className="text-xs font-semibold text-slate-600 uppercase">病人统计</span>
                <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                  <div className="bg-emerald-50 rounded-lg p-3"><p className="text-lg font-extrabold text-emerald-600">{selectedHospital.activePatients}</p><p className="text-[10px] text-emerald-500">活跃</p></div>
                  <div className="bg-amber-50 rounded-lg p-3"><p className="text-lg font-extrabold text-amber-600">{selectedHospital.pendingPatients}</p><p className="text-[10px] text-amber-500">待定</p></div>
                  <div className="bg-warm-50 rounded-lg p-3"><p className="text-lg font-extrabold text-slate-600">{selectedHospital.completedPatients}</p><p className="text-[10px] text-slate-400">已完成</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalInstitution;
