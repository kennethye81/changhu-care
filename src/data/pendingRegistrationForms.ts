import type { PendingPatientData } from './pendingPatients';

export type PendingPatient = PendingPatientData;

// === Care Plan Data Interface & Default Generator ===
export interface CarePlanMedication {
  drug: string; dosage: string; route: string; freq: string; duration: string; indication: string;
}
export interface CarePlanData {
  idnum: string; name: string; dob: string; gender: string; age: string; allergies: string;
  address: string; emergencyContact: string;
  primaryDx: string; secondary: string; surgery: string; biomarkers: string; riskLevel: string;
  complaint: string; vaccine: string;
  temp: string; pulse: string; rr: string; bpS: string; bpD: string; spO2: string; o2: string;
  medications: CarePlanMedication[];
  therapy: string; therapyFreq: string; otTherapy: string; otFreq: string;
  startDate: string; endDate: string;
  services: Record<string, boolean>;
  escalation: string; hotline: string; caseMgrContact: string; nurseContact: string; dnar: string;
  followUp: string; mdtReview: string;
}
export function getCarePlanDefaults(p: PendingPatient): CarePlanData {
  const isWong = p.diagnosis.toLowerCase().includes('foot ulcer') || p.diagnosis.toLowerCase().includes('dfu');
  const isZhang = p.id === 114;
  const startDate = p.dischargeDate;
  const endDate = new Date(new Date(startDate).getTime() + 90 * 86400000).toISOString().slice(0, 10);
  const serviceItems = p.services.split('·').map((s: string) => s.trim()).filter(Boolean);
  const services: Record<string, boolean> = {};
  serviceItems.forEach((s: string) => { services[s] = true; });
  const meds = isWong ? [
    { drug: 'Paracetamol', dosage: '1g', route: 'PO', freq: 'QID', duration: '06/29→07/13', indication: 'Post-op pain' },
    { drug: 'Tramadol', dosage: '50mg', route: 'PO', freq: 'PRN q6h', duration: '06/29→07/06', indication: 'Breakthrough pain' },
    { drug: 'Amlodipine', dosage: '5mg', route: 'PO', freq: 'qd', duration: 'Ongoing', indication: 'Hypertension' },
    { drug: 'Metoclopramide', dosage: '10mg', route: 'PO', freq: 'PRN', duration: '06/29→07/01', indication: 'Nausea' },
  ] : isZhang ? [
    { drug: 'Perindopril', dosage: '4mg', route: 'PO', freq: 'qd', duration: 'Ongoing — cough under evaluation, possible switch to ARB per thoracic team', indication: 'Hypertension — ACE inhibitor' },
    { drug: 'Atorvastatin', dosage: '20mg', route: 'PO', freq: 'qn', duration: 'Ongoing', indication: 'Hyperlipidemia — statin' },
    { drug: 'Tramadol', dosage: '50mg', route: 'PO', freq: 'q6h PRN (max 400mg/day)', duration: 'Per thoracic team order', indication: 'Pain control — VAS target ≤3' },
  ] : [
    { drug: 'As per discharge prescription', dosage: '—', route: '—', freq: '—', duration: 'Per MD order', indication: '—' },
  ];
  const temp = isWong ? '36.8' : isZhang ? '36.7' : p.age > 70 ? '36.5' : '36.8';
  const pulse = isWong ? '72' : isZhang ? '78' : p.age > 65 ? '76' : '72';
  const rr = '16';
  const bpS = isWong ? '124' : isZhang ? '128' : p.age > 65 ? '136' : '124';
  const bpD = isWong ? '76' : isZhang ? '82' : p.age > 65 ? '84' : '76';
  const spO2 = isZhang ? '96' : '97';
  const hasStroke = p.diagnosis.includes('Stroke') || p.diagnosis.includes('fracture');
  const therapy = isWong ? 'Gentle arm ROM exercises (affected side) — 10 min BID'
    : isZhang ? 'PT: pulmonary rehab — deep breathing exercises, effective coughing technique, shoulder ROM (target 180° flexion), progressive walking (5min ×3/day, +5min/week). SpO₂ monitoring throughout.'
    : hasStroke ? 'PT: gait training + strengthening (45 min), OT: ADL + home safety (45 min)'
    : 'PT: functional mobility + fall prevention (30 min)';
  const therapyFreq = isWong ? '2x/wk (30 min each)' : isZhang ? '2x/wk (30 min each)' : p.services.includes('3x') ? '3x/week (45 min)' : '2x/week (30 min)';
  const otTherapy = isWong ? 'ADL assessment · energy conservation · lymphedema prevention' : 'OT: ADL assessment · home safety evaluation';
  const otFreq = isWong ? '1x/wk (45 min)' : '1x/wk (30 min)';
  const esc = isWong ? 'Pain ≥7/10 · Temp >38.5°C · Wound purulent drainage · SOB · Active bleeding · Fall'
    : isZhang ? 'Frank haemoptysis (>50mL or sudden increase) · Progressive dyspnoea or SpO₂ <90% sustained · Persistent chest pain unrelieved by analgesia · Wound: redness, purulent exudate, or fever >38.3°C · Leg swelling/calf pain (VTE) · Rapid weight loss'
    : p.diagnosis.includes('NSTEMI') || p.diagnosis.includes('Cardiac') ? 'Chest pain · SOB · BP >180/100 · HR >120 or <50 · New arrhythmia'
    : p.diagnosis.includes('COPD') ? 'SpO2 <88% · RR >28 · Fever >38.5°C · Increased sputum purulence · Reduced consciousness'
    : p.diagnosis.includes('Stroke') ? 'New weakness · Speech difficulty · GCS drop · Fall · Fever'
    : 'Any acute deterioration · Fever >38.5°C · Severe pain · SOB · Fall';
  const hospPhone = p.hospital === 'Queen Mary Hospital' ? '+852 2255 3838'
    : p.hospital === 'Prince of Wales Hospital' ? '+852 3505 2111'
    : p.hospital === 'Kwong Wah Hospital' ? '+852 2332 2311' : '+852 999';
  return {
    idnum: 'A' + String(100000 + p.id * 731), name: p.name,
    dob: isWong ? '1961-06-20' : (2026 - p.age) + '-0' + String(p.id % 9 + 1) + '-1' + String(p.id % 28 + 1),
    gender: p.gender === 'M' ? 'Male' : 'Female', age: String(p.age) + ' yrs', allergies: 'NKDA',
    address: isWong ? 'Flat 7A, Block B, Kwun Lung Lau, Kennedy Town, HK' : p.hospital + ' District · HK',
    emergencyContact: p.contactName + ' · ' + p.contactRelation + ' · ' + p.contactPhone,
    primaryDx: p.diagnosis.split('·')[0]?.trim() || p.diagnosis,
    secondary: isWong ? 'Hypertension (HTN), Stage 1' : p.diagnosis.split('·').slice(1).join('·').trim() || '—',
    surgery: isWong ? 'Lumpectomy + SLNB (2026-06-25) · Margins clear' : p.medicalHistory.find((m: any) => m.type === 'surgery')?.diagnosis || '—',
    biomarkers: isWong ? 'ER+ 90%, PR+ 70%, HER2− (1+), Ki-67 25%' : p.medicalHistory[0]?.diagnosis?.match(/ER|PR|HER|Ki-67|Troponin|FEV1|HbA1c/) ? p.medicalHistory[0].diagnosis : '—',
    riskLevel: isWong ? 'Low — negative margins, -ve SLNB, no complications' : 'Moderate — requires ongoing monitoring',
    complaint: 'Post-discharge home care following ' + p.department + ' admission at ' + p.hospital + '. Patient requires ongoing monitoring and support as per discharge summary.',
    vaccine: isWong ? 'Influenza 2025, COVID-19 (bivalent) 2025, Pneumococcal PPSV23' : 'Influenza 2025, COVID-19 (bivalent) 2025',
    temp, pulse, rr, bpS, bpD, spO2, o2: isWong ? 'No' : p.diagnosis.includes('COPD') || p.diagnosis.includes('O₂') ? 'LTOT 1L/min NC' : 'No',
    medications: meds, therapy, therapyFreq, otTherapy, otFreq, startDate, endDate, services,
    escalation: esc, hotline: p.hospital + ' ' + hospPhone, caseMgrContact: 'Peter Ho +852 9876 5432',
    nurseContact: isWong ? 'Nurse Sarah +852 9123 4567' : 'Nurse on duty +852 9123 4567', dnar: 'Not discussed',
    followUp: isZhang ? 'Thoracic surgery clinic: 2 weeks, 6 weeks, 3 months post-op · Chest CT: ~3 months post-op · PFT: ~6 weeks post-op · Final pathology + molecular testing review (EGFR/ALK/PD-L1)' : 'Weekly telehealth check-in (15 min) · Monthly in-person MDT review (45 min)',
    mdtReview: 'Day 14: First MDT review — ' + endDate + ' · Reassess at Day 30 and Day 60',
  };
}

export function getAssessmentDefaults(p: PendingPatient): Record<string, string> {
  const isWong = p.diagnosis.toLowerCase().includes('foot ulcer') || p.diagnosis.toLowerCase().includes('dfu');
  const isZhang = p.id === 114;
  const d: Record<string, string> = {};
  d.idnum = 'A' + String(100000 + p.id * 731);
  d.name = p.name;
  d.dob = (2026 - p.age) + '-0' + String(p.id % 9 + 1) + '-1' + String(p.id % 28);
  d.infoBy = p.contactRelation;
  d.ecName = p.contactName;
  d.ecRel = p.contactRelation;
  d.ecPhone = p.contactPhone;
  d.careType = 'Skilled Home Health Care';
  d.complaint = 'Post-discharge home care following ' + p.department + ' admission at ' + p.hospital + '. Patient requires ongoing monitoring and support as per discharge summary.';
  d.allergy = 'NKDA';
  d.vaccine = 'Influenza 2025, COVID-19 (bivalent) 2025, Pneumococcal PPSV23';
  d.meds = isZhang ? 'Perindopril 4mg qd (hypertension — cough under evaluation, possible switch to ARB per thoracic team). Atorvastatin 20mg qn (hyperlipidemia). Post-operative analgesia — Tramadol 50mg PO q6h PRN (max 400mg/day) per thoracic team. Do NOT self-medicate with antibiotics.' : 'As per discharge prescription — medication reconciliation completed. Family/patient educated on administration schedule.';
  d.temp = p.age > 70 ? '36.5' : isZhang ? '36.7' : '36.8';
  d.pulse = p.age > 65 ? '76' : isZhang ? '78' : '72';
  d.rr = isZhang ? '16' : '16';
  d.bpS = p.age > 65 ? '136' : isZhang ? '128' : '124';
  d.bpD = p.age > 65 ? '84' : isZhang ? '82' : '76';
  d.spO2 = isZhang ? '96' : '97';
  d.o2 = 'No';
  d.painScore = isZhang ? '3' : '2';
  d.painPart = isZhang ? 'Right chest — VATS port sites (×3)' : 'Chest / Affected area';
  d.painDesc = isZhang ? 'VAS 3/10 at rest, 5/10 with cough. Well-controlled with analgesia. Incentive spirometry assistance required for pain-limited inspiration.' : 'Mild, well-controlled. NRS 2/10 at rest, 4/10 on movement.';
  d.mobility = p.age > 70 ? 'Requires assistance / walking aid' : isZhang ? 'Independent — walking 100m with supervision. Progressive ambulation per PT pulmonary rehab plan.' : 'Independent with supervision';
  d.aids = p.age > 70 ? 'Walking stick / Quad stick' : isZhang ? 'None — incentive spirometer at bedside' : 'None';
  d.selfCare = p.age > 70 ? 'Partial assistance (bathing/dressing)' : isZhang ? 'Independent with supervision — wife assists with wound inspection and medication box' : 'Independent';
  d.consciousness = 'Alert';
  d.orientation = 'Oriented x3 (person, place, time)';
  d.gcs = '15';
  d.vision = 'Normal OU. No aids.';
  d.hearing = p.age > 75 ? 'Mild bilateral presbycusis. Uses hearing aids (R+L). Functional with aids.' : 'Normal OU. No aids.';
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
  d.skin = isZhang ? '3 VATS thoracoscopic ports (R) — clean, dry, intact. No erythema, drainage, or subcutaneous emphysema.' : 'Intact, no breakdown';
  d.rash = 'None';
  d.wound = isZhang ? '3 VATS thoracoscopic port sites (R chest) — healing well. Port 1 (camera): 12mm, Port 2 (working): 12mm, Port 3 (assistant): 5mm. Clean, dry, intact. No SSI signs. Air leak resolved POD5.' : 'None';
  d.braden = '22';
  d.bradenPrev = '22 (2026/06/20)';
  d.morseScore = p.age > 70 ? '45' : isZhang ? '25' : '25';
  d.morsePrev = p.age > 70 ? '45 (2026/06/20)' : isZhang ? '25 (2026/08/13)' : '25 (2026/06/20)';
  d.hsStairs = '☑';
  d.hsRugs = '☑';
  d.hsLighting = '☐';
  d.hsOther = isZhang ? 'VTE warning signs poster on fridge. Incentive spirometer + cough diary at bedside. Emergency numbers posted.' : 'Remove loose rugs, install grab bars';
  d.hospOutside = 'No recent hospitalization outside Hong Kong';
  d.mdro = 'Negative / Not indicated';
  d.isolation = 'Standard Precautions';
  d.fever = 'No';
  d.emotionStable = '☑';
  d.emotionDepressed = '☐';
  d.emotionDisoriented = '☐';
  d.emotionAgitated = '☐';
  d.suicide = 'No risk identified';
  d.lives = isZhang ? 'With wife (Lin Xia, 56, primary caregiver)' : 'With family';
  d.financial = 'Family support, LTC insurance applicable';
  d.smoking = isZhang ? 'Ex-smoker — quit 3 weeks pre-op. Cessation support ongoing. Avoid dust and secondhand smoke.' : (p.gender === 'M' ? 'Ex-smoker' : 'Never smoked');
  d.alcohol = 'Social, occasional';
  d.drug = 'None';
  d.notes = isZhang ? 'Patient and family demonstrate good understanding of post-thoracic surgery home care plan. Wife trained on wound inspection, VTE warning signs, and incentive spirometry. Home environment suitable. RPM devices for continuous SpO₂/HR/BP monitoring. Perindopril cough diary initiated — thoracic team to evaluate possible ARB switch. Final surgical pathology + molecular testing (EGFR/ALK/PD-L1) pending. Do NOT self-medicate with antibiotics.' : 'Patient and family demonstrate understanding of home care plan. Home environment assessed as suitable with minor modifications. RPM devices recommended for continuous monitoring.';
  d.address = isZhang ? 'Room 1502, Building 3, Lianyang Intl Community, 1888 Biyun Rd, Pudong, Shanghai' : "Flat 3A, 28 Queen's Road Central, Hong Kong";
  d.family = isZhang ? 'Lives with wife (Mrs. Zhang / Lin Xia, 56, primary caregiver). No children at home. Wife manages medication box, incentive spirometry log, and wound inspection.' : 'Lives with husband (Mr. Wong Ka Ming, 68, retired) and one adult daughter (Wong Hei Man, 32, accountant)';
  d.religion = 'None';
  d.housing = 'Private residential flat';
  d.floorLevel = '3rd floor with lift';
  d.pets = isZhang ? 'No pets' : 'Yes — 1 cat';
  d.petCare = isZhang ? 'N/A' : 'Short-haired domestic cat, indoor only, requires feeding & litter box care';
  return d;
}
