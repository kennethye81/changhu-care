import type { FC, ReactNode } from 'react';
import type { PendingPatient } from '../data/pendingRegistrationForms';
import TypingReveal from './TypingReveal';
import { ASSESSMENT_FILL_MAX, ASSESSMENT_FILL_TIMING } from '../hooks/useEliteFormFillAnimation';

type FormLayout = 'hub' | 'mobile';

const PendingRegistrationAssessmentForm: FC<{
  patient: PendingPatient;
  layout?: FormLayout;
  fillStep?: number;
}> = ({
  patient,
  layout = 'hub',
  fillStep,
}) => {
  const mobile = layout === 'mobile';
  const animating = fillStep !== undefined;
  const fp = (n: number) => (animating ? fillStep >= n : true);
  const sectionGap = mobile ? 'pt-4' : 'border-t pt-3';
  const headerGap = mobile ? 'pb-3' : 'pb-3 border-b';
  const reveal = (text: string, wrap?: boolean): ReactNode =>
    animating ? (
      <TypingReveal
        text={text}
        wrap={wrap}
        fillDurationMs={ASSESSMENT_FILL_TIMING.fillDurationMs}
        fillMax={ASSESSMENT_FILL_MAX}
      />
    ) : text;
                    const a = (() => {
                      const d: Record<string,string> = {};
                      d.idnum = 'A' + String(100000 + patient.id * 731);
                      d.name = patient.name;
                      d.dob = (2026 - patient.age) + '-0' + String(patient.id % 9 + 1) + '-1' + String(patient.id % 28);
                      d.infoBy = patient.contactRelation;
                      d.ecName = patient.contactName;
                      d.ecRel = patient.contactRelation;
                      d.ecPhone = patient.contactPhone;
                      d.careType = 'Skilled Home Health Care';
                      d.complaint = 'Post-discharge home care following ' + patient.department + ' admission at ' + patient.hospital + '. Patient requires ongoing monitoring and support as per discharge summary.';
                      d.allergy = 'NKDA';
                      d.vaccine = 'Influenza 2025, COVID-19 (bivalent) 2025, Pneumococcal PPSV23';
                      d.meds = 'As per discharge prescription — medication reconciliation completed. Family/patient educated on administration schedule.';
                      d.temp = patient.age > 70 ? '36.5' : '36.8';
                      d.pulse = patient.age > 65 ? '76' : '72';
                      d.rr = '16';
                      d.bpS = patient.age > 65 ? '136' : '124';
                      d.bpD = patient.age > 65 ? '84' : '76';
                      d.spO2 = '97';
                      d.o2 = 'No';
                      d.painScore = '2';
                      d.painPart = 'Chest / Affected area';
                      d.painDesc = 'Mild, well-controlled. NRS 2/10 at rest, 4/10 on movement.';
                      d.mobility = patient.age > 70 ? 'Requires assistance / walking aid' : 'Independent with supervision';
                      d.aids = patient.age > 70 ? 'Walking stick / Quad stick' : 'None';
                      d.selfCare = patient.age > 70 ? 'Partial assistance (bathing/dressing)' : 'Independent';
                      d.consciousness = 'Alert';
                      d.orientation = 'Oriented x3 (person, place, time)';
                      d.gcs = '15';
                      d.vision = 'Normal OU. No aids.';
                      d.hearing = patient.age > 75 ? 'Mild bilateral presbycusis. Uses hearing aids (R+L). Functional with aids.' : 'Normal OU. No aids.';
                      d.language = 'Cantonese (native), Basic English';
                      d.speech = 'Clear and coherent';
                      d.appetite = 'Adequate';
                      d.diet = 'Regular diet';
                      d.dentureU = 'None';
                      d.dentureL = 'None';
                      d.swallowing = 'No difficulty';
                      d.thickener = 'None';
                      d.tubeFeeding = 'No';
                      d.urinary = 'Continent';
                      d.urinaryAid = 'None';
                      d.bowel = 'Continent';
                      d.bowelAid = 'None';
                      d.skin = 'Intact, no breakdown';
                      d.rash = 'None';
                      d.wound = 'None';
                      d.braden = '22';
                      d.bradenPrev = '22 (2026/06/20)';
                      d.morseScore = patient.age > 70 ? '45' : '25';
                      d.morsePrev = patient.age > 70 ? '45 (2026/06/20)' : '25 (2026/06/20)';
                      d.hsStairs = '☑'; d.hsRugs = '☑'; d.hsLighting = '☐'; d.hsOther = 'Remove loose rugs, install grab bars';
                      d.hospOutside = '近一年无江苏省外住院史';
                      d.mdro = 'Negative / Not indicated';
                      d.isolation = 'Standard Precautions';
                      d.fever = 'No';
                      d.emotionStable = '☑'; d.emotionDepressed = '☐'; d.emotionDisoriented = '☐'; d.emotionAgitated = '☐';
                      d.suicide = 'No risk identified';
                      d.lives = 'With family';
                      d.financial = 'Family support, LTC insurance applicable';
                      d.smoking = patient.gender === 'M' ? 'Ex-smoker' : 'Never smoked';
                      d.alcohol = 'Social, occasional';
                      d.drug = 'None';
                      d.notes = 'Patient and family demonstrate understanding of home care plan. Home environment assessed as suitable with minor modifications. RPM devices recommended for continuous monitoring.';
                      d.address = '江苏省常州市金坛区东城街道';
                      d.family = 'Lives with husband (Mr. Wong Ka Ming, 68, retired) and one adult daughter (Wong Hei Man, 32, accountant)';
                      d.religion = 'None';
                      d.housing = 'Private residential flat';
                      d.floorLevel = '3rd floor with lift';
                      d.pets = 'Yes — 1 cat';
                      d.petCare = 'Short-haired domestic cat, indoor only, requires feeding & litter box care';
                      return d;
                    })();

                    const F = (label: string, val: string, idx: number) => (
                      <div className={mobile ? 'space-y-1' : 'flex items-center gap-3'}>
                        <span className={`text-[9px] text-slate-600 ${mobile ? 'block font-medium' : 'w-28 flex-shrink-0'}`}>{label}</span>
                        <div className={`${mobile ? 'w-full' : 'flex-1'} border rounded px-2 py-1 text-[10px] border-amber-200 bg-amber-50 text-slate-700 break-words min-h-[26px]`}>{fp(idx) ? reveal(val) : ''}</div>
                      </div>);
                    const FS = (label: string, val: string, idx: number) => (
                      <div className={mobile ? 'space-y-1' : 'flex items-center gap-2'}>
                        <span className={`text-[9px] text-slate-600 ${mobile ? 'block font-medium' : 'w-28 flex-shrink-0'}`}>{label}</span>
                        <div className={`${mobile ? 'w-full' : 'flex-1'} border rounded px-2 py-1 text-[10px] break-words min-h-[26px] ${fp(idx) ? 'border-blue-300 bg-teal-50 text-slate-800' : 'border-amber-200 bg-amber-50/40'}`}><span className="text-slate-500">▼</span> {fp(idx) ? reveal(val) : ''}</div>
                      </div>);
                    const TA = (label: string, val: string, idx: number) => (
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-600 font-medium">{label}</span>
                        <div className={`border rounded px-2 py-2 text-[10px] leading-relaxed min-h-[48px] break-words ${fp(idx) ? 'border-amber-200 bg-amber-50 text-slate-700' : 'border-amber-200 bg-amber-50/40'}`}>{fp(idx) ? reveal(val, true) : ''}</div>
                      </div>);
                    const CHK = (labels: string[], checked: string, idx: number) => (
                      <div className={mobile ? 'space-y-1.5' : 'flex items-center gap-4'}>
                        <span className={`text-[9px] text-slate-600 ${mobile ? 'block font-medium' : 'w-28 flex-shrink-0'}`}>{labels[0]}</span>
                        <div className={`flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] ${fp(idx) ? 'text-slate-700' : 'opacity-0'}`}>
                          {labels.slice(1).map(l => <label key={l} className="flex items-center gap-1"><span className="w-3.5 h-3.5 border rounded flex items-center justify-center flex-shrink-0">{checked.includes(l) ? '☑' : '☐'}</span>{l}</label>)}
                        </div>
                      </div>);
                    const pairRow = mobile ? 'space-y-2' : 'flex items-center gap-3 flex-wrap';

                    return (<>
                      {/* Header Section */}
                      <div className={`${mobile ? 'flex flex-col gap-2' : 'flex items-center gap-3'} ${headerGap}`}>
                        <div className={`flex ${mobile ? 'flex-col gap-2 w-full' : 'items-center gap-3'}`.trim()}><span className="text-[9px] text-slate-500">ID:</span><div className={`border rounded px-2 py-1 text-[10px] font-mono min-h-[26px] ${mobile ? 'w-full' : ''} border-amber-200 bg-amber-50`}>{fp(0) ? reveal(a.idnum) : ''}</div></div>
                        <div className={`flex ${mobile ? 'flex-col gap-2 w-full' : 'items-center gap-2'}`.trim()}><span className="text-[9px] text-slate-500">Name:</span><div className={`border rounded px-2 py-1 text-[10px] min-h-[26px] ${mobile ? 'w-full' : ''} border-amber-200 bg-amber-50`}>{fp(0) ? reveal(a.name) : ''}</div></div>
                        <div className={`flex ${mobile ? 'flex-col gap-2 w-full' : 'items-center gap-2'}`.trim()}><span className="text-[9px] text-slate-500">DOB:</span><div className={`border rounded px-2 py-1 text-[10px] min-h-[26px] ${mobile ? 'w-full' : ''} border-amber-200 bg-amber-50`}>{fp(0) ? reveal(a.dob) : ''}</div></div>
                      </div>
                      <div className={`${mobile ? 'flex flex-col gap-2' : 'flex items-center gap-4'} ${headerGap}`}>
                        <div className={mobile ? 'w-full' : 'flex items-center gap-2 flex-1'}>{FS('Info Provided By', a.infoBy, 1)}</div>
                        <div className={mobile ? 'space-y-1 w-full' : 'flex items-center gap-2 flex-1'}><span className="text-[9px] text-slate-600 flex-shrink-0 font-medium">Emergency Contact:</span><div className={`${mobile ? 'w-full' : 'flex-1'} border rounded px-2 py-1 text-[10px] break-words min-h-[26px] border-amber-200 bg-amber-50`}>{fp(1) ? reveal(`${a.ecName} · ${a.ecRel} · ${a.ecPhone}`) : ''}</div></div>
                      </div>

                      {/* 1. Admission Details */}
                      <div className={sectionGap}><span className="text-[9px] font-bold text-slate-700 uppercase">1. Admission Details</span>
                        <div className="mt-2 space-y-2">{F('* Type of Care', a.careType, 2)}{TA('* Presenting Complaint / Reason for Care', a.complaint, 3)}</div>
                      </div>

                      {/* 2. Medical & Surgical History */}
                      <div className={sectionGap}><span className="text-[9px] font-bold text-slate-700 uppercase">2. Medical & Surgical History</span>
                        <div className="mt-2 space-y-2">{FS('* Allergic History', a.allergy, 4)}{F('* Vaccination History', a.vaccine, 5)}</div>
                      </div>

                      {/* 3. Medication & Treatment */}
                      <div className={sectionGap}><span className="text-[9px] font-bold text-slate-700 uppercase">3. Medication & Treatment</span>
                        <div className="mt-2">{FS('* Current Medications', a.meds, 6)}</div>
                      </div>

                      {/* 4. Physical Assessment */}
                      <div className={sectionGap}><span className="text-[9px] font-bold text-slate-700 uppercase">4. Physical Assessment</span>
                        <div className="mt-2">
                          <div className={`inline-block text-[10px] text-teal-600 font-semibold px-3 py-1 rounded border border-blue-200 bg-teal-50 mb-2 ${fp(7)?'':'opacity-0'}`}>📥 Load the latest measurement values</div>
                          <div className="space-y-2">
                            <div className={`${mobile ? 'grid grid-cols-2 gap-2' : 'flex items-center gap-3 flex-wrap'}`}>
                              <div className="flex items-center gap-1"><span className="text-[9px] text-slate-500">Temp:</span><div className={`w-14 border rounded px-1.5 py-1 text-center text-[10px] ${fp(8)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>{fp(8)?a.temp:'—'}</div><span className="text-[8px]">°C</span></div>
                              <div className="flex items-center gap-1"><span className="text-[9px] text-slate-500">Pulse:</span><div className={`w-14 border rounded px-1.5 py-1 text-center text-[10px] ${fp(9)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>{fp(9)?a.pulse:'—'}</div><span className="text-[8px]">bpm</span></div>
                              <div className="flex items-center gap-1"><span className="text-[9px] text-slate-500">RR:</span><div className={`w-14 border rounded px-1.5 py-1 text-center text-[10px] ${fp(10)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>{fp(10)?a.rr:'—'}</div><span className="text-[8px]">/min</span></div>
                              <div className="flex items-center gap-1 flex-wrap"><span className="text-[9px] text-slate-500">BP:</span><div className={`w-10 border rounded px-1 py-1 text-center text-[10px] ${fp(11)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>{fp(11)?a.bpS:'—'}</div><span className="text-[8px]">/</span><div className={`w-10 border rounded px-1 py-1 text-center text-[10px] ${fp(11)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>{fp(11)?a.bpD:'—'}</div><span className="text-[8px]">mmHg</span></div>
                              <div className="flex items-center gap-1"><span className="text-[9px] text-slate-500">SpO₂:</span><div className={`w-12 border rounded px-1.5 py-1 text-center text-[10px] ${fp(12)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>{fp(12)?a.spO2:'—'}</div><span className="text-[8px]">%</span></div>
                            </div>
                            {mobile ? FS('O₂ Therapy', a.o2, 13) : <div className="flex items-center gap-1 mt-2">{FS('O₂ Therapy', a.o2, 13)}</div>}
                          </div>
                        </div>
                      </div>

                      {/* 5. Cognitive, Communication & Sensory */}
                      <div className={sectionGap}><span className="text-[9px] font-bold text-slate-700 uppercase">5. Cognitive, Communication & Sensory</span>
                        <div className="mt-2 space-y-2">
                          {mobile ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2"><span className="text-[9px] text-slate-600 font-medium">Pain Score:</span><div className={`w-10 border rounded px-1 py-1 text-center text-[10px] ${fp(14)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>{fp(14)?a.painScore:'—'}</div></div>
                              {F('Pain Part', a.painPart, 14)}
                              {F('Pain Description', a.painDesc, 14)}
                            </div>
                          ) : (
                          <div className="flex items-center gap-3"><span className="text-[9px] text-slate-600 w-28">Pain:</span><span className="flex items-center gap-1 text-[9px] text-slate-500">Score:</span><div className={`w-10 border rounded px-1 py-1 text-center text-[10px] ${fp(14)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>{fp(14)?a.painScore:'—'}</div><span className="text-[9px] text-slate-500">Part:</span><div className={`flex-1 border rounded px-2 py-1 text-[10px] ${fp(14)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>{fp(14)?a.painPart:'—'}</div><span className="text-[9px] text-slate-500">Desc:</span><div className={`flex-1 border rounded px-2 py-1 text-[10px] ${fp(14)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>{fp(14)?a.painDesc:'—'}</div></div>
                          )}
                          {FS('* Mobility', a.mobility, 15)}
                          {FS('* Use Aids', a.aids, 16)}
                          {FS('* Self-care Ability', a.selfCare, 17)}
                          {CHK(['* Consciousness', 'Alert', 'Confused', 'Lethargic'], 'Alert', 18)}
                          {FS('* Orientation', a.orientation, 19)}
                          <div className="flex items-center gap-2"><span className="text-[9px] text-slate-600 w-28">* GCS Score:</span><div className={`w-10 border rounded px-1.5 py-1 text-center text-[10px] ${fp(20)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>{fp(20)?a.gcs:'—'}</div><span className="text-[8px]">/15</span></div>
                          {mobile ? (
                            <>
                              <div className="space-y-2"><span className="text-[9px] text-slate-600 font-medium">* Vision</span><div className="grid grid-cols-2 gap-2"><div className="space-y-1"><span className="text-[9px] text-slate-500">L</span><div className={`border rounded px-1.5 py-1 text-[10px] ${fp(21)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>{fp(21)?'Normal':'—'}</div></div><div className="space-y-1"><span className="text-[9px] text-slate-500">R</span><div className={`border rounded px-1.5 py-1 text-[10px] ${fp(21)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>{fp(21)?'Normal':'—'}</div></div></div>{F('Vision Aids', 'None', 21)}</div>
                              <div className="space-y-2"><span className="text-[9px] text-slate-600 font-medium">* Hearing</span><div className="grid grid-cols-2 gap-2"><div className="space-y-1"><span className="text-[9px] text-slate-500">L</span><div className={`border rounded px-1.5 py-1 text-[10px] ${fp(22)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>{fp(22)?'Normal':'—'}</div></div><div className="space-y-1"><span className="text-[9px] text-slate-500">R</span><div className={`border rounded px-1.5 py-1 text-[10px] ${fp(22)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>{fp(22)?'Normal':'—'}</div></div></div>{F('Hearing Aids', 'None', 22)}</div>
                            </>
                          ) : (
                            <>
                          <div className="flex items-center gap-3"><span className="text-[9px] text-slate-600 w-28">* Vision:</span><span className="text-[9px] text-slate-500">L:</span><div className={`w-16 border rounded px-1.5 py-1 text-[10px] ${fp(21)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>{fp(21)?'Normal':'—'}</div><span className="text-[9px] text-slate-500">R:</span><div className={`w-16 border rounded px-1.5 py-1 text-[10px] ${fp(21)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>{fp(21)?'Normal':'—'}</div><span className="text-[9px] text-slate-500">Aids:</span><div className={`flex-1 border rounded px-2 py-1 text-[10px] ${fp(21)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>{fp(21)?'None':'—'}</div></div>
                          <div className="flex items-center gap-3"><span className="text-[9px] text-slate-600 w-28">* Hearing:</span><span className="text-[9px] text-slate-500">L:</span><div className={`w-16 border rounded px-1.5 py-1 text-[10px] ${fp(22)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>{fp(22)?'Normal':'—'}</div><span className="text-[9px] text-slate-500">R:</span><div className={`w-16 border rounded px-1.5 py-1 text-[10px] ${fp(22)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>{fp(22)?'Normal':'—'}</div><span className="text-[9px] text-slate-500">Aids:</span><div className={`flex-1 border rounded px-2 py-1 text-[10px] ${fp(22)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>{fp(22)?'None':'—'}</div></div>
                            </>
                          )}
                          {F('* Language/Dialect', a.language, 23)}
                          {FS('* Speech', a.speech, 24)}
                        </div>
                      </div>

                      {/* 6. Nutrition & Hydration */}
                      <div className={sectionGap}><span className="text-[9px] font-bold text-slate-700 uppercase">6. Nutrition & Hydration</span>
                        <div className="mt-2 space-y-2">
                          {FS('* Appetite', a.appetite, 25)}
                          {F('* Diet', a.diet, 26)}
                          {mobile ? (
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1"><span className="text-[9px] text-slate-500">Upper</span><div className={`border rounded px-2 py-1 text-[10px] ${fp(27)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>{fp(27)?a.dentureU:'—'}</div></div>
                              <div className="space-y-1"><span className="text-[9px] text-slate-500">Lower</span><div className={`border rounded px-2 py-1 text-[10px] ${fp(27)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>{fp(27)?a.dentureL:'—'}</div></div>
                            </div>
                          ) : (
                          <div className="flex items-center gap-3"><span className="text-[9px] text-slate-600 w-28">* Denture:</span><span className="text-[9px] text-slate-500">Upper:</span><div className={`w-20 border rounded px-2 py-1 text-[10px] ${fp(27)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>{fp(27)?a.dentureU:'—'}</div><span className="text-[9px] text-slate-500">Lower:</span><div className={`w-20 border rounded px-2 py-1 text-[10px] ${fp(27)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>{fp(27)?a.dentureL:'—'}</div></div>
                          )}
                          {FS('* Swallowing Difficulty', a.swallowing, 28)}
                          {FS('* Thickener', a.thickener, 29)}
                          {FS('* Tube Feeding', a.tubeFeeding, 30)}
                        </div>
                      </div>

                      {/* 7. Elimination */}
                      <div className={sectionGap}><span className="text-[9px] font-bold text-slate-700 uppercase">7. Elimination</span>
                        <div className="mt-2 space-y-2">
                          <div className={pairRow}>{FS('* Urinary', a.urinary, 31)}{FS('* Urinary Aid', a.urinaryAid, 32)}</div>
                          <div className={pairRow}>{FS('* Bowel', a.bowel, 33)}{F('* Bowel Device/Aid', a.bowelAid, 34)}</div>
                        </div>
                      </div>

                      {/* 8. Skin & Wound */}
                      <div className={sectionGap}><span className="text-[9px] font-bold text-slate-700 uppercase">8. Skin & Wound Assessment</span>
                        <div className="mt-2 space-y-2">
                          <div className={pairRow}>{FS('* Skin', a.skin, 35)}{FS('* Rash', a.rash, 36)}</div>
                          <div className={pairRow}>{FS('* Pressure Injury/Wound', a.wound, 37)}{FS('* Braden Scale', a.braden + '/23 (' + a.bradenPrev + ')', 38)}</div>
                        </div>
                      </div>

                      {/* 9. Fall & Safety */}
                      <div className={sectionGap}><span className="text-[9px] font-bold text-slate-700 uppercase">9. Fall & Safety Risks</span>
                        <div className="mt-2 space-y-2">
                          {F('* Morse Fall Scale', a.morseScore + '/125 (' + a.morsePrev + ')', 39)}
                          <div className={mobile ? 'space-y-1' : 'flex items-start gap-2'}>
                            <span className={`text-[9px] text-slate-600 ${mobile ? 'block font-medium' : 'w-28 flex-shrink-0 mt-0.5'}`}>* Home Safety:</span>
                            <div className={`${mobile ? 'w-full' : 'flex-1'} border rounded px-2 py-1.5 text-[10px] break-words ${fp(40)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>
                              {fp(40)?(<span className="flex flex-wrap gap-x-3 gap-y-1"><span className="inline-flex items-center gap-1"><span className="w-3 h-3 border rounded flex items-center justify-center text-[8px]">{a.hsStairs}</span> Stairs</span><span className="inline-flex items-center gap-1"><span className="w-3 h-3 border rounded flex items-center justify-center text-[8px]">{a.hsRugs}</span> Rugs</span><span className="inline-flex items-center gap-1"><span className="w-3 h-3 border rounded flex items-center justify-center text-[8px]">{a.hsLighting}</span> Poor Lighting</span><span className="inline-flex items-center gap-1"><span className="w-3 h-3 border rounded flex items-center justify-center text-[8px]">☐</span> Other: {a.hsOther}</span></span>):'—'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 10. Infection Control */}
                      <div className={sectionGap}><span className="text-[9px] font-bold text-slate-700 uppercase">10. Infection Control & Travel History (FTOCC)</span>
                        <div className="mt-2 space-y-2">
                          <div className="text-[8px] text-slate-400 mb-1">Please list in detail your recent hospitalization outside HK</div>
                          <div className={`border rounded px-2 py-2 text-[10px] min-h-[36px] ${fp(41)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>{fp(41)?a.hospOutside:'—'}</div>
                          <div className={pairRow}>{FS('* MDRO Screening', a.mdro, 42)}{FS('* Isolation', a.isolation, 43)}</div>
                          {FS('* Fever', a.fever, 44)}
                        </div>
                      </div>

                      {/* 11. Emotional, Psychological & Social */}
                      <div className={sectionGap}><span className="text-[9px] font-bold text-slate-700 uppercase">11. Emotional, Psychological & Social Assessment</span>
                        <div className="mt-2 space-y-2">
                          <div className={mobile ? 'space-y-1' : 'flex items-start gap-2'}>
                            <span className={`text-[9px] text-slate-600 ${mobile ? 'block font-medium' : 'w-28 flex-shrink-0 mt-0.5'}`}>* Emotional Status:</span>
                            <div className={`${mobile ? 'w-full' : 'flex-1'} border rounded px-2 py-1.5 text-[10px] break-words ${fp(45)?'border-amber-200 bg-amber-50':'border-amber-200 bg-amber-50'}`}>
                              {fp(45)?(<span className="flex flex-wrap gap-x-3 gap-y-1"><span className="inline-flex items-center gap-1"><span className="w-3 h-3 border rounded flex items-center justify-center text-[8px]">{a.emotionStable}</span> Stable</span><span className="inline-flex items-center gap-1"><span className="w-3 h-3 border rounded flex items-center justify-center text-[8px]">{a.emotionDepressed}</span> Depressed</span><span className="inline-flex items-center gap-1"><span className="w-3 h-3 border rounded flex items-center justify-center text-[8px]">{a.emotionDisoriented}</span> Disoriented</span><span className="inline-flex items-center gap-1"><span className="w-3 h-3 border rounded flex items-center justify-center text-[8px]">{a.emotionAgitated}</span> Agitated</span><span className="inline-flex items-center gap-1"><span className="w-3 h-3 border rounded flex items-center justify-center text-[8px]">☐</span> Other: —</span></span>):'—'}
                            </div>
                          </div>
                          {FS('* Suicide Risk', a.suicide, 46)}
                          <div className={pairRow}>{FS('Lives', a.lives, 47)}{F('Financial Support', a.financial, 48)}</div>
                          <div className={mobile ? 'space-y-2' : 'flex items-center gap-3 flex-wrap'}>{FS('Smoking', a.smoking, 49)}{FS('Alcohol', a.alcohol, 50)}{FS('Drug', a.drug, 51)}</div>
                        </div>
                      </div>

                      {/* 12. Additional Notes */}
                      <div className={sectionGap}><span className="text-[9px] font-bold text-slate-700 uppercase">12. Additional Notes & Recommendations</span>
                        <div className="mt-2">{TA('Description', a.notes, 52)}</div>
                      </div>

                      {/* 13. Address & Family Information */}
                      <div className={sectionGap}><span className="text-[9px] font-bold text-slate-700 uppercase">13. Address & Family Information</span>
                        <div className="mt-2 space-y-2">
                          {F('* Home Address', a.address, 53)}
                          {F('* Family Members at Home', a.family, 54)}
                          {F('* Religion', a.religion, 55)}
                        </div>
                      </div>

                      {/* 14. Home Environment & Pets */}
                      <div className={sectionGap}><span className="text-[9px] font-bold text-slate-700 uppercase">14. Home Environment & Pets</span>
                        <div className="mt-2 space-y-2">
                          {FS('* Housing Type', a.housing, 56)}
                          {FS('* Floor Level (with/without lift)', a.floorLevel, 57)}
                          {CHK(['* Home Safety Hazards', 'Stairs', 'Rugs', 'Poor Lighting', 'Cluttered Hallways'], 'None', 58)}
                          {F('* Pets at Home', a.pets, 59)}
                          {F('* Pet Type & Care Needs', a.petCare, 60)}
                        </div>
                      </div>
                    </>);
                  
};

export default PendingRegistrationAssessmentForm;
