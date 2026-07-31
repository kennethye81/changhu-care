import { type FC, useState, type ReactNode } from 'react';
import type { CarePlanData, PendingPatient } from '../data/pendingRegistrationForms';
import { getCarePlanDefaults } from '../data/pendingRegistrationForms';
import TypingReveal from './TypingReveal';
import { CARE_PLAN_FILL_MAX, CARE_PLAN_FILL_TIMING } from '../hooks/useEliteFormFillAnimation';

const CpInput: FC<{ val: string; onChange: (v: string) => void; placeholder?: string; className?: string }> = ({ val, onChange, placeholder, className }) => (
  <input type="text" value={val} onChange={e => onChange(e.target.value)} placeholder={placeholder || ''}
    className={'bg-amber-50 border border-amber-300 rounded-lg px-3 py-2 w-full text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 ' + (className || '')} />
);
const CpSelect: FC<{ val: string; onChange: (v: string) => void; options: string[]; className?: string }> = ({ val, onChange, options, className }) => (
  <select value={val} onChange={e => onChange(e.target.value)}
    className={'bg-blue-50 border border-blue-300 rounded-lg px-3 py-2 w-full text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ' + (className || '')}>
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);
const CpTextArea: FC<{ val: string; onChange: (v: string) => void; rows?: number; className?: string }> = ({ val, onChange, rows, className }) => (
  <textarea value={val} onChange={e => onChange(e.target.value)} rows={rows || 2}
    className={'bg-amber-50 border border-amber-300 rounded-lg px-3 py-2 w-full text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 ' + (className || '')} />
);

interface Props {
  patient: PendingPatient;
  data?: CarePlanData | null;
  onDataChange?: (data: CarePlanData) => void;
  layout?: 'hub' | 'mobile';
  fillStep?: number;
}

const PendingRegistrationCarePlanForm: FC<Props> = ({ patient, data, onDataChange, layout = 'hub', fillStep }) => {
  const mobile = layout === 'mobile';
  const animating = fillStep !== undefined;
  const fp = (n: number) => (animating ? fillStep >= n : true);
  const sectionGap = mobile && animating ? 'pt-4' : '';
  const sectionRule = mobile && animating ? null : <div className="border-t border-slate-200" />;
  const reveal = (text: string, wrap?: boolean): ReactNode =>
    animating ? (
      <TypingReveal
        text={text}
        wrap={wrap}
        fillDurationMs={CARE_PLAN_FILL_TIMING.fillDurationMs}
        fillMax={CARE_PLAN_FILL_MAX}
      />
    ) : text;

  const cols2 = mobile ? 'grid-cols-1' : 'grid-cols-2';
  const cols4 = mobile ? 'grid-cols-2' : 'grid-cols-4';
  const cols3 = mobile ? 'grid-cols-1' : 'grid-cols-3';
  const [internal, setInternal] = useState<CarePlanData>(() => getCarePlanDefaults(patient));
  const cpd = data ?? internal;
  const setCpd = (next: CarePlanData) => {
    if (onDataChange) onDataChange(next);
    else setInternal(next);
  };
  const hc = (f: keyof CarePlanData, v: CarePlanData[keyof CarePlanData]) => setCpd({ ...cpd, [f]: v });
  const hcNest = (i: number, s: keyof CarePlanData['medications'][number], v: string) => {
    const items = [...cpd.medications];
    items[i] = { ...items[i], [s]: v };
    hc('medications', items);
  };
  const hcSvc = (k: string) => hc('services', { ...cpd.services, [k]: !cpd.services[k] });

  const F = (label: string, val: string, idx: number) => (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-medium text-slate-400">{label}</span>
      <div className={`rounded-lg px-3 py-2 text-xs min-h-[34px] break-words border ${
        fp(idx) ? 'border-amber-200 bg-amber-50 text-slate-800' : 'border-amber-200 bg-amber-50/40'
      }`}>
        {fp(idx) ? reveal(val) : ''}
      </div>
    </div>
  );

  const FS = (label: string, val: string, idx: number) => (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-medium text-slate-400">{label}</span>
      <div className={`rounded-lg px-3 py-2 text-xs min-h-[34px] break-words border ${
        fp(idx) ? 'border-blue-300 bg-teal-50 text-slate-800' : 'border-amber-200 bg-amber-50/40'
      }`}>
        {fp(idx) ? <><span className="text-slate-500">▼ </span>{reveal(val)}</> : ''}
      </div>
    </div>
  );

  const TA = (label: string, val: string, idx: number) => (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-medium text-slate-400">{label}</span>
      <div className={`rounded-lg px-3 py-2 text-xs min-h-[52px] break-words border ${
        fp(idx) ? 'border-amber-200 bg-amber-50 text-slate-800' : 'border-amber-200 bg-amber-50/40'
      }`}>
        {fp(idx) ? reveal(val, true) : ''}
      </div>
    </div>
  );

  const svcSummary = Object.entries(cpd.services)
    .filter(([, checked]) => checked)
    .map(([key]) => key)
    .join(' · ');

  const medLabels = ['Drug', 'Dosage', 'Route', 'Frequency', 'Duration', 'Indication'] as const;
  const medKeys = ['drug', 'dosage', 'route', 'freq', 'duration', 'indication'] as const;

  if (animating) {
    return (
      <div className="space-y-0">
        <div className={sectionGap}>
          <h3 className="text-xs font-bold text-slate-700 uppercase mb-3">1. Patient Demographics</h3>
          <div className={`grid ${cols2} gap-x-5 gap-y-2.5`}>
            {F('* ID', cpd.idnum, 0)}
            {F('* Name', cpd.name, 1)}
            {F('* DOB', cpd.dob, 2)}
            {FS('* Gender', cpd.gender, 3)}
            {F('* Age', cpd.age, 4)}
            {FS('* Allergies', cpd.allergies, 5)}
            {F('Address', cpd.address, 6)}
            {F('Emergency Contact', cpd.emergencyContact, 7)}
          </div>
        </div>

        <div className={sectionGap}>
          <h3 className="text-xs font-bold text-slate-700 uppercase mb-3">2. Clinical Summary</h3>
          <div className="space-y-2.5">
            {F('* Primary Diagnosis', cpd.primaryDx, 8)}
            {F('Secondary / Comorbidities', cpd.secondary, 9)}
            {F('Surgery / Procedure', cpd.surgery, 10)}
            {F('Biomarkers', cpd.biomarkers, 11)}
            {F('Risk Level', cpd.riskLevel, 12)}
            {TA('* Presenting Complaint', cpd.complaint, 13)}
            {F('Vaccination History', cpd.vaccine, 14)}
          </div>
        </div>

        <div className={sectionGap}>
          <h3 className="text-xs font-bold text-slate-700 uppercase mb-3">3. Vitals &amp; Monitoring Plan</h3>
          <div className={`grid ${cols4} gap-x-4 gap-y-2.5`}>
            {F('Temp (°C)', cpd.temp, 15)}
            {F('Pulse (bpm)', cpd.pulse, 16)}
            {F('RR (/min)', cpd.rr, 17)}
            {F('SpO₂ (%)', cpd.spO2, 18)}
            {F('BP Systolic', cpd.bpS, 19)}
            {F('BP Diastolic', cpd.bpD, 20)}
            {FS('O₂ Therapy', cpd.o2, 21)}
            {F('Monitor Freq', 'q visit', 22)}
          </div>
        </div>

        <div className={sectionGap}>
          <h3 className="text-xs font-bold text-slate-700 uppercase mb-3">4. Medication Plan</h3>
          <div className="space-y-3">
            {cpd.medications.map((med, i) => (
              <div key={i} className="rounded-lg border border-amber-100 bg-white p-2.5 space-y-2">
                <p className="text-[9px] font-bold text-slate-500 uppercase">Med {i + 1}</p>
                <div className={`grid ${cols2} gap-2`}>
                  {medKeys.map((key, j) => F(medLabels[j], med[key], 23 + i * 6 + j))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={sectionGap}>
          <h3 className="text-xs font-bold text-slate-700 uppercase mb-3">5. Therapy &amp; Rehab Plan</h3>
          <div className={`grid ${cols2} gap-x-5 gap-y-2.5`}>
            {TA('* Physiotherapy (PT)', cpd.therapy, 47)}
            {F('PT Frequency', cpd.therapyFreq, 48)}
            {TA('Occupational Therapy (OT)', cpd.otTherapy, 49)}
            {F('OT Frequency', cpd.otFreq, 50)}
          </div>
        </div>

        <div className={sectionGap}>
          <h3 className="text-xs font-bold text-slate-700 uppercase mb-3">6. Service Period &amp; Daily Schedule</h3>
          <div className={`grid ${cols2} gap-x-5 gap-y-2.5 mb-3`}>
            {F('* Start Date', cpd.startDate, 51)}
            {F('* End Date', cpd.endDate, 52)}
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <p className="text-[10px] font-semibold text-slate-500 uppercase mb-2">Daily Care Checklist</p>
            {F('Selected Services', svcSummary, 53)}
          </div>
        </div>

        <div className={sectionGap}>
          <h3 className="text-xs font-bold text-slate-700 uppercase mb-3">7. Emergency / Contingency Plan</h3>
          <div className="space-y-2.5">
            {TA('* Escalate if', cpd.escalation, 54)}
            <div className={`grid ${cols3} gap-x-4 gap-y-2.5`}>
              {F('24h Hotline', cpd.hotline, 55)}
              {F('Case Manager', cpd.caseMgrContact, 56)}
              {F('Nurse Contact', cpd.nurseContact, 57)}
            </div>
            {FS('DNAR Status', cpd.dnar, 58)}
          </div>
        </div>

        <div className={sectionGap}>
          <h3 className="text-xs font-bold text-slate-700 uppercase mb-3">8. Follow-up Schedule</h3>
          <div className="grid grid-cols-1 gap-2.5">
            {TA('Follow-up Plan', cpd.followUp, 59)}
            {F('MDT Review Schedule', cpd.mdtReview, 60)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={mobile ? 'space-y-4' : 'space-y-[14px]'}>
      <div>
        <h3 className="text-xs font-bold text-slate-700 uppercase mb-3">1. Patient Demographics</h3>
        <div className={`grid ${cols2} gap-x-5 gap-y-2.5`}>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">* ID</span><CpInput val={cpd.idnum} onChange={v => hc('idnum', v)} /></div>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">* Name</span><CpInput val={cpd.name} onChange={v => hc('name', v)} /></div>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">* DOB</span><CpInput val={cpd.dob} onChange={v => hc('dob', v)} /></div>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">* Gender</span><CpSelect val={cpd.gender} onChange={v => hc('gender', v)} options={['Female', 'Male']} /></div>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">* Age</span><CpInput val={cpd.age} onChange={v => hc('age', v)} /></div>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">* Allergies</span><CpSelect val={cpd.allergies} onChange={v => hc('allergies', v)} options={['NKDA', 'Penicillin', 'Sulfa', 'Latex', 'Other']} /></div>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">Address</span><CpInput val={cpd.address} onChange={v => hc('address', v)} /></div>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">Emergency Contact</span><CpInput val={cpd.emergencyContact} onChange={v => hc('emergencyContact', v)} /></div>
        </div>
      </div>
      {sectionRule}
      <div>
        <h3 className="text-xs font-bold text-slate-700 uppercase mb-3">2. Clinical Summary</h3>
        <div className="space-y-2.5">
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">* Primary Diagnosis</span><CpInput val={cpd.primaryDx} onChange={v => hc('primaryDx', v)} /></div>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">Secondary / Comorbidities</span><CpInput val={cpd.secondary} onChange={v => hc('secondary', v)} /></div>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">Surgery / Procedure</span><CpInput val={cpd.surgery} onChange={v => hc('surgery', v)} /></div>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">Biomarkers</span><CpInput val={cpd.biomarkers} onChange={v => hc('biomarkers', v)} /></div>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">Risk Level</span><CpInput val={cpd.riskLevel} onChange={v => hc('riskLevel', v)} /></div>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">* Presenting Complaint</span><CpTextArea val={cpd.complaint} onChange={v => hc('complaint', v)} rows={2} /></div>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">Vaccination History</span><CpInput val={cpd.vaccine} onChange={v => hc('vaccine', v)} /></div>
        </div>
      </div>
      {sectionRule}
      <div>
        <h3 className="text-xs font-bold text-slate-700 uppercase mb-3">3. Vitals &amp; Monitoring Plan</h3>
        <div className={`grid ${cols4} gap-x-4 gap-y-2.5`}>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">Temp (°C)</span><CpInput val={cpd.temp} onChange={v => hc('temp', v)} /></div>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">Pulse (bpm)</span><CpInput val={cpd.pulse} onChange={v => hc('pulse', v)} /></div>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">RR (/min)</span><CpInput val={cpd.rr} onChange={v => hc('rr', v)} /></div>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">SpO₂ (%)</span><CpInput val={cpd.spO2} onChange={v => hc('spO2', v)} /></div>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">BP Systolic</span><CpInput val={cpd.bpS} onChange={v => hc('bpS', v)} /></div>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">BP Diastolic</span><CpInput val={cpd.bpD} onChange={v => hc('bpD', v)} /></div>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">O₂ Therapy</span><CpSelect val={cpd.o2} onChange={v => hc('o2', v)} options={['No', 'LTOT 1L/min NC', 'LTOT 2L/min NC', 'PRN']} /></div>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">Monitor Freq</span><CpInput val="q visit" onChange={() => {}} /></div>
        </div>
      </div>
      {sectionRule}
      <div>
        <h3 className="text-xs font-bold text-slate-700 uppercase mb-3">4. Medication Plan</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] border-collapse">
            <thead><tr className="bg-slate-50 text-[9px] font-semibold text-slate-400 uppercase tracking-wider"><th className="px-2 py-1.5 text-left border border-slate-200">Drug</th><th className="px-2 py-1.5 text-left border border-slate-200">Dosage</th><th className="px-2 py-1.5 text-left border border-slate-200">Route</th><th className="px-2 py-1.5 text-left border border-slate-200">Frequency</th><th className="px-2 py-1.5 text-left border border-slate-200">Duration</th><th className="px-2 py-1.5 text-left border border-slate-200">Indication</th></tr></thead>
            <tbody>{cpd.medications.map((med, i) => (<tr key={i} className="hover:bg-amber-50/30"><td className="px-2 py-1 border border-slate-200"><CpInput val={med.drug} onChange={v => hcNest(i, 'drug', v)} className="!px-2 !py-1" /></td><td className="px-2 py-1 border border-slate-200"><CpInput val={med.dosage} onChange={v => hcNest(i, 'dosage', v)} className="!px-2 !py-1" /></td><td className="px-2 py-1 border border-slate-200"><CpInput val={med.route} onChange={v => hcNest(i, 'route', v)} className="!px-2 !py-1" /></td><td className="px-2 py-1 border border-slate-200"><CpInput val={med.freq} onChange={v => hcNest(i, 'freq', v)} className="!px-2 !py-1" /></td><td className="px-2 py-1 border border-slate-200"><CpInput val={med.duration} onChange={v => hcNest(i, 'duration', v)} className="!px-2 !py-1" /></td><td className="px-2 py-1 border border-slate-200"><CpInput val={med.indication} onChange={v => hcNest(i, 'indication', v)} className="!px-2 !py-1" /></td></tr>))}</tbody>
          </table>
        </div>
      </div>
      {sectionRule}
      <div>
        <h3 className="text-xs font-bold text-slate-700 uppercase mb-3">5. Therapy &amp; Rehab Plan</h3>
        <div className={`grid ${cols2} gap-x-5 gap-y-2.5`}>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">* Physiotherapy (PT)</span><CpTextArea val={cpd.therapy} onChange={v => hc('therapy', v)} rows={2} /></div>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">PT Frequency</span><CpInput val={cpd.therapyFreq} onChange={v => hc('therapyFreq', v)} /></div>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">Occupational Therapy (OT)</span><CpTextArea val={cpd.otTherapy} onChange={v => hc('otTherapy', v)} rows={2} /></div>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">OT Frequency</span><CpInput val={cpd.otFreq} onChange={v => hc('otFreq', v)} /></div>
        </div>
      </div>
      {sectionRule}
      <div>
        <h3 className="text-xs font-bold text-slate-700 uppercase mb-3">6. Service Period &amp; Daily Schedule</h3>
        <div className={`grid ${cols2} gap-x-5 gap-y-2.5 mb-3`}>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">* Start Date</span><CpInput val={cpd.startDate} onChange={v => hc('startDate', v)} /></div>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">* End Date</span><CpInput val={cpd.endDate} onChange={v => hc('endDate', v)} /></div>
        </div>
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <p className="text-[10px] font-semibold text-slate-500 uppercase mb-2">Daily Care Checklist</p>
          <div className={`grid ${mobile ? 'grid-cols-1' : 'grid-cols-2'} gap-x-5 gap-y-1.5`}>
            {Object.entries(cpd.services).map(([key, checked]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                <input type="checkbox" checked={checked} onChange={() => hcSvc(key)} className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                <span>{key}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      {sectionRule}
      <div>
        <h3 className="text-xs font-bold text-slate-700 uppercase mb-3">7. Emergency / Contingency Plan</h3>
        <div className="space-y-2.5">
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">* Escalate if</span><CpTextArea val={cpd.escalation} onChange={v => hc('escalation', v)} rows={2} /></div>
          <div className={`grid ${cols3} gap-x-4 gap-y-2.5`}>
            <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">24h Hotline</span><CpInput val={cpd.hotline} onChange={v => hc('hotline', v)} /></div>
            <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">Case Manager</span><CpInput val={cpd.caseMgrContact} onChange={v => hc('caseMgrContact', v)} /></div>
            <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">Nurse Contact</span><CpInput val={cpd.nurseContact} onChange={v => hc('nurseContact', v)} /></div>
          </div>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">DNAR Status</span><CpSelect val={cpd.dnar} onChange={v => hc('dnar', v)} options={['Not discussed', 'DNAR in place', 'Full code', 'Discussed — patient declines']} /></div>
        </div>
      </div>
      {sectionRule}
      <div>
        <h3 className="text-xs font-bold text-slate-700 uppercase mb-3">8. Follow-up Schedule</h3>
        <div className="grid grid-cols-1 gap-2.5">
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">Follow-up Plan</span><CpTextArea val={cpd.followUp} onChange={v => hc('followUp', v)} rows={2} /></div>
          <div className="flex flex-col gap-1"><span className="text-[10px] font-medium text-slate-400">MDT Review Schedule</span><CpInput val={cpd.mdtReview} onChange={v => hc('mdtReview', v)} /></div>
        </div>
      </div>
    </div>
  );
};

export default PendingRegistrationCarePlanForm;
