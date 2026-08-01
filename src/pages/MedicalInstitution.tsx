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
  { id: 1, name: 'Queen Mary Hospital', address: '102 Pok Fu Lam Road, Hong Kong', phone: '+852 2255 3838', email: 'info@qmf.org.hk', liaison: 'Iris Cheung (Clinical Liaison Officer)', departments: ['Cardiology', 'Respiratory Medicine', 'Neurology', 'Surgery', 'Internal Medicine'], doctors: ['Dr. Chan Chi Keung (Cardiology)', 'Dr. Lee Mei Ling (Respiratory)', 'Dr. Kevin Wong (Cardiology)'], completedPatients: 12 },
  { id: 2, name: 'HK Sanatorium & Hospital', address: '2 Village Road, Happy Valley, Hong Kong', phone: '+852 2835 8800', email: 'info@hksh-hospital.com', liaison: 'Catherine Yip (Private Patient Coordinator)', departments: ['Cardiology', 'Breast Surgery', 'Endocrinology', 'Nephrology', 'Internal Medicine'], doctors: ['Dr. Chan Chi Keung (Cardiology)', 'Dr. Margaret Chan (Breast Surgery)', 'Dr. Anthony Lam (Cardiology)'], completedPatients: 10 },
  { id: 3, name: 'Gleneagles Hospital', address: '1 Nam Fung Path, Wong Chuk Hang, Hong Kong', phone: '+852 3153 9000', email: 'info@gleneagles.hk', liaison: 'Samantha Lee (Patient Relations)', departments: ['Orthopaedics', 'Respiratory Medicine', 'Endocrinology', 'Neurology', 'Internal Medicine'], doctors: ['Dr. Cheung Kwok Wai (ID/IM)', 'Dr. Derek Yuen (Orthopaedics)', 'Dr. Stephen Ng (Respiratory)'], completedPatients: 6 },
  { id: 4, name: 'Prince of Wales Hospital', address: '30-32 Ngan Shing Street, Sha Tin, New Territories', phone: '+852 3505 2211', email: 'info@pwh.org.hk', liaison: 'Helen Fong (HaH Coordinator)', departments: ['Respiratory Medicine', 'Internal Medicine', 'Geriatrics'], doctors: ['Dr. Lee Mei Ling (Respiratory)', 'Dr. Peter Ho (Respiratory)'], completedPatients: 8 },
  { id: 5, name: 'Pamela Youde Nethersole Eastern Hospital', address: '3 Lok Man Road, Chai Wan, Hong Kong', phone: '+852 2595 6111', email: 'info@pyneh.org.hk', liaison: 'Winnie Cheung (Neurology Liaison)', departments: ['Neurology', 'Internal Medicine', 'Rehabilitation'], doctors: ['Dr. Chan Ka Wai (Neurology)', 'Dr. Cheung Kwok Wai (Neurology)'], completedPatients: 5 },
  { id: 6, name: 'Kwong Wah Hospital', address: '25 Waterloo Road, Kowloon', phone: '+852 3518 2000', email: 'info@kwh.org.hk', liaison: 'Connie Lam (Endocrinology Liaison)', departments: ['Endocrinology', 'Podiatry', 'Internal Medicine'], doctors: ['Dr. Leung Siu Keung (Endocrinology)'], completedPatients: 4 },
  { id: 7, name: 'Tuen Mun Hospital', address: '23 Tsing Chung Koon Road, Tuen Mun, New Territories', phone: '+852 2468 5111', email: 'info@tmh.org.hk', liaison: 'Raymond Ng (Nephrology Liaison)', departments: ['Nephrology', 'Internal Medicine'], doctors: ['Dr. Wong Kwok Ming (Nephrology)'], completedPatients: 3 },
  { id: 8, name: 'United Christian Hospital', address: '130 Hip Wo Street, Kwun Tong, Kowloon', phone: '+852 3513 4000', email: 'info@uch.org.hk', liaison: 'Karen Ho (Cardiology Liaison)', departments: ['Cardiology', 'Respiratory Medicine'], doctors: ['Dr. Kevin Wong (Cardiology)'], completedPatients: 2 },
  { id: 9, name: "St. Teresa's Hospital", address: '327 Prince Edward Road West, Kowloon', phone: '+852 2200 3111', email: 'info@stth.org.hk', liaison: 'Simon Yu (Orthopaedics Liaison)', departments: ['Orthopaedics', 'Geriatrics'], doctors: ['Dr. Raymond Li (Orthopaedics)'], completedPatients: 2 },
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
