import { type FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { PENDING_PATIENTS } from './PendingRegistration';

interface VacantStaff {
  id: string;
  name: string;
  age: number;
  gender: string;
  spec: string;
  exp: number;
  avatar: string;
}

interface StaffGroup {
  role: string;
  staff: VacantStaff[];
}

const VACANT_BY_ROLE: StaffGroup[] = [
  { role: 'Registered Nurse (RN)', staff: [
    { id:'N006', name:'Jessie Fong', age:34, gender:'Female', spec:'Geriatric & Chronic Disease', exp:7, avatar:'/avatars/rn-vacant-1.png' },
    { id:'N007', name:'Maggie Cheung', age:41, gender:'Female', spec:'Post-Surgical & Palliative', exp:8, avatar:'/avatars/rn-vacant-2.png' },
    { id:'N008', name:'Brian Ng', age:29, gender:'Male', spec:'Cardiac & Respiratory', exp:6, avatar:'/avatars/rn-vacant-3.png' },
  ]},
  { role: 'Rehab Therapist (PT)', staff: [
    { id:'R006', name:'Catherine Tsang', age:37, gender:'Female', spec:'Orthopedic & Neuro', exp:7, avatar:'/avatars/pt-vacant-1.png' },
    { id:'R007', name:'Samson Hui', age:45, gender:'Male', spec:'Geriatric & Falls Prevention', exp:9, avatar:'/avatars/pt-vacant-2.png' },
    { id:'R008', name:'Jason Chan', age:32, gender:'Male', spec:'Cardiac & Pulmonary', exp:5, avatar:'/avatars/pt-vacant-3.png' },
  ]},
  { role: 'Care Worker (HCA)', staff: [
    { id:'CW007', name:'Alice Ho', age:43, gender:'Female', spec:'Elderly Home Care', exp:6, avatar:'/avatars/cw-vacant-1.png' },
    { id:'CW008', name:'Michelle Yuen', age:38, gender:'Female', spec:'Post-Stroke & Dementia', exp:8, avatar:'/avatars/cw-vacant-2.png' },
    { id:'CW009', name:'Kenny Ma', age:48, gender:'Male', spec:'Post-Surgical & Wound', exp:5, avatar:'/avatars/cw-vacant-3.png' },
  ]},
];

const AssignCareElite: FC = () => {
  const { pid } = useParams<{ pid: string }>();
  const navigate = useNavigate();
  const p = PENDING_PATIENTS.find(pat => pat.id === Number(pid));

  if (!p) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500 text-sm">Patient not found.</p>
        <button onClick={() => navigate('/pending-registration')} className="mt-4 text-xs text-teal-600 hover:text-blue-800 font-semibold">← Back to Pending Registration</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Back Navigation */}
      <button
        onClick={() => navigate(-1)}
        className="text-xs text-teal-600 hover:text-blue-800 font-semibold mb-4 flex items-center gap-1"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Patient
      </button>

      {/* Patient Summary Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl px-6 py-4 mb-6 shadow-md">
        <h1 className="text-lg font-bold text-white">Assign Care Elite</h1>
        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-orange-100">
          <span className="font-semibold text-white">{p.name}</span>
          <span>{p.gender}, {p.age} yrs</span>
          <span>·</span>
          <span>{p.hospital}</span>
          <span>·</span>
          <span>Dr. {p.doctor.split('. ')[1] || p.doctor}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {p.services.split('·').map((s, i) => (
            <span key={i} className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full">
              {s.trim()}
            </span>
          ))}
        </div>
      </div>

      {/* Staff Grid by Role */}
      <div className="space-y-6">
        {VACANT_BY_ROLE.map(group => (
          <div key={group.role}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-orange-400 rounded-full" />
              <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wide">{group.role}</h2>
              <span className="text-[10px] text-slate-400">({group.staff.length} available)</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {group.staff.map(s => (
                <div
                  key={s.id}
                  className="glass-card rounded-xl border border-slate-200 p-4 hover:shadow-lg hover:border-orange-300 hover:-translate-y-0.5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={s.avatar}
                      alt={s.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-orange-200 group-hover:border-orange-400 transition-colors"
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-800 truncate">{s.name}</p>
                      <p className="text-[9px] text-slate-400">{s.gender} · {s.age}y · {s.exp}yr exp</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed mb-3 min-h-[2.5em]">{s.spec}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 text-[10px] font-semibold bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg py-2 hover:from-orange-600 hover:to-amber-700 transition-all shadow-sm">
                      Assign
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); }}
                      className="w-8 h-8 flex items-center justify-center text-[10px] text-slate-400 hover:text-slate-600 hover:bg-warm-100 rounded-lg transition-colors"
                      title="View Profile"
                    >
                      <User className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignCareElite;
