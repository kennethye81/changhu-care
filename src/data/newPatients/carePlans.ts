import type { DailyActivity, FollowupLogEntry, TwoWeekCarePlan } from '../carePlans';

function makeDates(start: string, days: number): string[] {
  const d = new Date(start);
  return Array.from({ length: days }, (_, i) => {
    const nd = new Date(d);
    nd.setDate(d.getDate() + i);
    return nd.toISOString().slice(0, 10);
  });
}

function buildNSTEMIPlan(): TwoWeekCarePlan {
  const dates = makeDates('2026-07-01', 14);
  const s: Record<string, DailyActivity[]> = {};
  dates.forEach((d, i) => {
    const day = i + 1;
    const isRNday = day <= 5 || day % 2 === 1;
    const isRehabDay = day >= 3 && day % 2 === 1;
    const isConsultDay = day <= 3 || day % 3 === 1;
    s[d] = [
      { time: '06:30', activity: 'Cardiac RPM Sync', type: 'monitoring', detail: 'Smartwatch + BP cuff auto-upload: HR, BP, SpO₂. PCI site photo if any concern. Report chest pain immediately.', status: i < 3 ? 'completed' : 'pending' },
      { time: '07:00', activity: 'AM DAPT + Cardiac Meds', type: 'medication', detail: 'Aspirin 100mg + Ticagrelor 90mg BID + Atorvastatin 80mg + Bisoprolol 2.5mg + Ramipril 5mg. DO NOT skip antiplatelets.', status: i < 3 ? 'completed' : 'pending' },
      { time: '07:30', activity: 'SMBG Fasting', type: 'monitoring', detail: 'Capillary glucose fasting. Target 4-7 mmol/L. Record in SMBG log (qid schedule).', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:00', activity: 'Breakfast', type: 'self_care', detail: 'Heart-healthy low-sodium meal. Fluid counted. Daughter reviews DAPT compliance.', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:30', activity: 'RN Cardiac Visit', type: 'nurse_visit', detail: 'PCI site assessment, cardiac auscultation, BP/HR/SpO₂, DAPT education, bleeding check (gums, bruising), SMBG review, ECG remote sync check.', status: isRNday ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Sarah Leung (RN)' },
      { time: '10:00', activity: 'SMBG Pre-Lunch', type: 'monitoring', detail: 'Capillary glucose pre-lunch. Adjust meal if >10 mmol/L.', status: i < 3 ? 'completed' : 'pending' },
      { time: '10:30', activity: 'Cardiac Rehab (PT)', type: 'therapy', detail: 'Phase II cardiac rehab: seated exercises, gentle walking 10-15min, HR target 60-80% max. Monitor for angina.', status: isRehabDay ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'David Chan (PT)' },
      { time: '12:00', activity: 'Lunch + Rest', type: 'self_care', detail: 'Low sodium (<2g/day). Avoid heavy lifting — PCI arm precautions ×7 days.', status: i < 3 ? 'completed' : 'pending' },
      { time: '14:00', activity: 'Remote ECG Review', type: 'monitoring', detail: 'Single-lead ECG via KardiaMobile. Auto-upload to HaH dashboard. Report palpitations or dizziness.', status: day % 2 === 0 ? (i < 3 ? 'completed' : 'pending') : 'pending' },
      { time: '15:00', activity: 'Teleconsult (q48h)', type: 'doctor_consult', detail: 'Dr. Chan Chi Keung — review RPM trends, troponin clearance, DAPT tolerance, SMBG, cardiac rehab progress.', status: isConsultDay ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Dr. Chan Chi Keung' },
      { time: '16:00', activity: 'SMBG Pre-Dinner', type: 'monitoring', detail: 'Capillary glucose pre-dinner. Metformin 500mg with meal if indicated.', status: i < 3 ? 'completed' : 'pending' },
      { time: '17:00', activity: 'PM Ticagrelor', type: 'medication', detail: 'Ticagrelor 90mg (2nd daily dose). Take with food to reduce dyspnoea side effect.', status: i < 3 ? 'completed' : 'pending' },
      { time: '18:00', activity: 'Dinner', type: 'self_care', detail: 'Heart-healthy meal. No alcohol (DAPT bleeding risk).', status: i < 3 ? 'completed' : 'pending' },
      { time: '20:00', activity: 'SMBG Bedtime', type: 'monitoring', detail: 'Capillary glucose bedtime. Target 5-8 mmol/L. Report if <4 or >12.', status: i < 3 ? 'completed' : 'pending' },
      { time: '21:00', activity: 'PCI Site Check', type: 'self_care', detail: 'Inspect radial/groin site. Report haematoma, oozing, or increasing pain.', status: i < 3 ? 'completed' : 'pending' },
    ];
  });
  return {
    patientName: 'Chow Kwok Fai',
    startDate: dates[0],
    endDate: dates[13],
    schedule: s,
    logs: [
      { date: '2026-07-02', time: '08:30', type: 'RN Visit', detail: 'Day 2 post-PCI. PCI site clean, no haematoma. BP 128/78, HR 76, SpO₂ 96%. DAPT compliance 100%. SMBG 5.8-8.2 range. Remote ECG NSR. Daughter trained on bleeding precautions.', author: 'Sarah Leung', role: 'RN', vitals: 'BP 128/78 | HR 76 | SpO₂ 96% | SMBG 6.4', status: 'completed' },
      { date: '2026-07-01', time: '09:00', type: 'RN — Initial Assessment', detail: 'HaH Day 1. Post-PCI ×2 (LAD, LCx). PCI site intact. BP 130/80, HR 78, SpO₂ 95%. KardiaMobile paired. DAPT education completed. Cardiac rehab referral activated.', author: 'Sarah Leung', role: 'RN', vitals: 'BP 130/80 | HR 78 | SpO₂ 95%', status: 'completed' },
      { date: '2026-07-02', time: '15:00', type: 'Teleconsult', detail: 'Day 2 review. Troponin cleared. No chest pain. RPM data stable. Continue DAPT ×12 months. Cardiac rehab Day 1 tolerated. Recheck lipids Week 2.', author: 'Dr. Chan Chi Keung', role: 'Cardiologist', vitals: 'BP 128/78 | HR 76', status: 'completed' },
      { date: '2026-07-03', time: '10:30', type: 'Cardiac Rehab PT', detail: 'Phase II Day 1. Seated exercises 15min, walked 120m indoors. HR peak 98 (target zone). No angina. SpO₂ maintained >95%. Daughter present.', author: 'David Chan', role: 'PT', vitals: 'HR peak 98 | SpO₂ 96%', status: 'completed' },
    ],
  };
}

function buildCOPDGold3Plan(): TwoWeekCarePlan {
  const dates = makeDates('2026-07-03', 14);
  const s: Record<string, DailyActivity[]> = {};
  dates.forEach((d, i) => {
    const day = i + 1;
    const steroidDose = day <= 3 ? '30mg' : day <= 5 ? '20mg' : day <= 7 ? '10mg' : 'stop';
    const isRNday = day <= 5 || day % 2 === 1;
    const isPTday = day >= 2 && day % 3 !== 2;
    const isConsultDay = day <= 3 || day % 2 === 1;
    s[d] = [
      { time: '07:00', activity: 'AM Inhalers + Steroid', type: 'medication', detail: `Tiotropium/Olodaterol 2 puffs. Prednisolone ${steroidDose}. Salbutamol MDI prn.`, status: i < 3 ? 'completed' : 'pending' },
      { time: '07:30', activity: 'Morning SpO₂ Check', type: 'monitoring', detail: 'SpO₂ at rest via pulse oximeter. Start O₂ 2L/min if <88%. Record baseline.', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:00', activity: 'Breakfast', type: 'self_care', detail: 'High-protein small meal. Sit upright. Pursed-lip breathing if dyspnoeic.', status: i < 3 ? 'completed' : 'pending' },
      { time: '09:00', activity: 'RN Respiratory Visit', type: 'nurse_visit', detail: 'SpO₂ rest + exertion, lung auscultation, inhaler technique, O₂ concentrator check, steroid taper review, sputum colour/volume.', status: isRNday ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Jenny Tam (RN)' },
      { time: '10:00', activity: 'Supplemental O₂', type: 'monitoring', detail: 'O₂ 2L/min via nasal cannula if SpO₂ <90% at rest. Minimum 15h/day for chronic hypoxaemia.', status: i < 3 ? 'completed' : 'pending' },
      { time: '10:30', activity: 'Pulmonary Rehab (PT)', type: 'therapy', detail: 'Pursed-lip + diaphragmatic breathing, upper body strengthening, 30m walk tolerance with SpO₂ monitoring. Stop if SpO₂ <85%.', status: isPTday ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Raymond Wong (PT)' },
      { time: '12:00', activity: 'Lunch', type: 'self_care', detail: 'Avoid gas-forming foods. Small frequent meals to reduce diaphragm compression.', status: i < 3 ? 'completed' : 'pending' },
      { time: '14:00', activity: 'Afternoon SpO₂ Check', type: 'monitoring', detail: 'SpO₂ at rest. Son records in log. Report if <88% or increased dyspnoea.', status: i < 3 ? 'completed' : 'pending' },
      { time: '15:00', activity: 'Teleconsult (q48h)', type: 'doctor_consult', detail: 'Dr. Lee Mei Ling — review SpO₂ trend, CAT score, steroid taper, O₂ requirement, pulmonary rehab tolerance.', status: isConsultDay ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Dr. Lee Mei Ling' },
      { time: '16:00', activity: 'Incentive Spirometry', type: 'therapy', detail: '10 breaths q4h while awake. Hold 3 sec. Target 750mL inspiratory volume.', status: i < 3 ? 'completed' : 'pending' },
      { time: '18:00', activity: 'Dinner', type: 'self_care', detail: 'Light meal. Sit upright 1h post-meal. O₂ prn.', status: i < 3 ? 'completed' : 'pending' },
      { time: '20:00', activity: 'Evening SpO₂ + O₂', type: 'monitoring', detail: 'SpO₂ check. Continue O₂ overnight if baseline <88%. Record hours on O₂.', status: i < 3 ? 'completed' : 'pending' },
      { time: '21:00', activity: 'Bedtime', type: 'self_care', detail: 'Head elevated 30-45°. O₂ concentrator on standby. Emergency action plan visible.', status: i < 3 ? 'completed' : 'pending' },
    ];
  });
  return {
    patientName: 'Lam Siu Wan',
    startDate: dates[0],
    endDate: dates[13],
    schedule: s,
    logs: [
      { date: '2026-07-04', time: '09:00', type: 'RN Visit', detail: 'Day 2. SpO₂ 93% RA, 91% on 2L O₂. RR 18. Wheeze improved. Prednisolone 20mg Day 5. Inhaler technique correct. O₂ concentrator functioning. Son trained on action plan.', author: 'Jenny Tam', role: 'RN', vitals: 'SpO₂ 93% | RR 18 | HR 86 | BP 132/78', status: 'completed' },
      { date: '2026-07-03', time: '10:00', type: 'RN — Initial Assessment', detail: 'HaH Day 1. GOLD3 exacerbation. SpO₂ 92% RA. FEV₁ 36%. O₂ concentrator installed. Prednisolone 30mg started. Med reconciliation. Osteoporosis + fall risk noted.', author: 'Jenny Tam', role: 'RN', vitals: 'SpO₂ 92% | RR 20 | HR 88 | BP 132/78', status: 'completed' },
      { date: '2026-07-04', time: '15:00', type: 'Teleconsult', detail: 'Day 2 review. SpO₂ improving on O₂. Steroid taper on track. Continue LAMA/LABA. Pulmonary rehab re-enrolled. LTOT assessment in 2 weeks if SpO₂ persistently <88%.', author: 'Dr. Lee Mei Ling', role: 'Respiratory Physician', vitals: 'SpO₂ 93% | RR 18', status: 'completed' },
      { date: '2026-07-05', time: '10:30', type: 'Pulmonary Rehab PT', detail: 'Day 1 PT. Pursed-lip breathing 10min, seated exercises tolerated. Walked 80m — SpO₂ nadir 89%, recovered to 92% in 2min. No desaturation event.', author: 'Raymond Wong', role: 'PT', vitals: 'SpO₂ 89-93% | HR 92', status: 'completed' },
    ],
  };
}

function buildStrokePlan(): TwoWeekCarePlan {
  const dates = makeDates('2026-07-06', 14);
  const s: Record<string, DailyActivity[]> = {};
  dates.forEach((d, i) => {
    const day = i + 1;
    const isPTday = day % 2 === 1;
    const isOTday = day % 3 === 0;
    const isSTday = day % 2 === 0;
    const isRNday = day <= 5 || day % 2 === 1;
    s[d] = [
      { time: '07:00', activity: 'AM Stroke Meds', type: 'medication', detail: 'Aspirin 100mg + Atorvastatin 40mg + Amlodipine 5mg + Perindopril 4mg. Wife confirms administration.', status: i < 3 ? 'completed' : 'pending' },
      { time: '07:30', activity: 'NIHSS Home Check', type: 'monitoring', detail: 'Wife performs simplified NIHSS: LOC, gaze, facial droop, arm/leg drift, speech. Report any score increase.', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:00', activity: 'IDDSI Level 5 Breakfast', type: 'self_care', detail: 'Minced & moist diet. Upright 30° minimum. Supervised feeding. Aspiration precautions.', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:30', activity: 'RN Neuro Visit', type: 'nurse_visit', detail: 'NIHSS assessment, BP, neuro exam, fall risk (Morse), skin integrity, DVT check, medication review, caregiver education.', status: isRNday ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Connie Cheung (RN)' },
      { time: '09:30', activity: 'PT — Hemiparesis Rehab', type: 'therapy', detail: 'RUE/RLE strengthening, balance training, gait with walker, transfer practice. Monitor BP during exertion.', status: isPTday ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Michael Kwok (PT)' },
      { time: '10:30', activity: 'OT — ADL Training', type: 'therapy', detail: 'Dressing, grooming, one-handed techniques, adaptive equipment use, bathroom safety.', status: isOTday ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Helen Yip (OT)' },
      { time: '11:30', activity: 'Speech Therapy', type: 'therapy', detail: 'Swallowing exercises, word-finding drills, communication strategies. IDDSI progression assessment.', status: isSTday ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Karen Lam (ST)' },
      { time: '12:00', activity: 'IDDSI Level 5 Lunch', type: 'self_care', detail: 'Supervised meal. Thickened fluids Level 1 if indicated. Upright 30min post-meal.', status: i < 3 ? 'completed' : 'pending' },
      { time: '14:00', activity: 'Fall Prevention Check', type: 'self_care', detail: 'Clear pathways, non-slip mats, grab bars, walker within reach. Bed alarm active overnight.', status: i < 3 ? 'completed' : 'pending' },
      { time: '15:00', activity: 'Teleconsult (q48h)', type: 'doctor_consult', detail: 'Dr. Cheung Kwok Wai — review NIHSS trend, BP control, therapy progress, swallow safety, secondary prevention.', status: day % 2 === 1 ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Dr. Cheung Kwok Wai' },
      { time: '16:00', activity: 'Afternoon Rest', type: 'self_care', detail: 'Leg elevation. Avoid unsupervised ambulation. Call bell within reach.', status: i < 3 ? 'completed' : 'pending' },
      { time: '18:00', activity: 'IDDSI Level 5 Dinner', type: 'self_care', detail: 'Supervised meal. Monitor for coughing/choking during swallow.', status: i < 3 ? 'completed' : 'pending' },
      { time: '20:00', activity: 'Evening Vitals + NIHSS', type: 'monitoring', detail: 'BP, HR. Simplified NIHSS. Report new weakness, speech change, or fall.', status: i < 3 ? 'completed' : 'pending' },
      { time: '21:00', activity: 'Bedtime Safety', type: 'self_care', detail: 'Bedside commode. Night light on. Fall alarm armed. Head of bed 30°.', status: i < 3 ? 'completed' : 'pending' },
    ];
  });
  return {
    patientName: 'Cheung Siu Ming',
    startDate: dates[0],
    endDate: dates[13],
    schedule: s,
    logs: [
      { date: '2026-07-07', time: '08:30', type: 'RN Visit', detail: 'Day 2. NIHSS 4 (stable). RUE 3+/5, RLE 4/5. BP 140/84. Speech 85% intelligible. IDDSI 5 tolerated — no aspiration signs. Morse 55 (HIGH). Wife competent with transfers.', author: 'Connie Cheung', role: 'RN', vitals: 'NIHSS 4 | BP 140/84 | HR 80 | SpO₂ 97%', status: 'completed' },
      { date: '2026-07-06', time: '09:00', type: 'RN — Initial Assessment', detail: 'HaH Day 1 post L MCA stroke. NIHSS 5. R hemiparesis. Home safety: grab bars installed. IDDSI 5 diet confirmed. DAPT education. Fall alarm activated.', author: 'Connie Cheung', role: 'RN', vitals: 'NIHSS 5 | BP 142/86 | HR 82', status: 'completed' },
      { date: '2026-07-07', time: '09:30', type: 'PT Session', detail: 'Day 1 PT. Transfers bed↔chair with walker. RUE active-assisted ROM. Gait 15m with standby assist. BP stable during session. No falls.', author: 'Michael Kwok', role: 'PT', vitals: 'BP 138/82 | HR 88', status: 'completed' },
      { date: '2026-07-07', time: '15:00', type: 'Teleconsult', detail: 'Day 2 review. NIHSS improving 5→4. BP target <140/90. Continue PT/OT/ST 3×/wk. Swallow reassessment Day 5. No haemorrhagic conversion on repeat CT.', author: 'Dr. Cheung Kwok Wai', role: 'Neurologist', vitals: 'NIHSS 4 | BP 140/84', status: 'completed' },
    ],
  };
}

function buildOncologyPlan(): TwoWeekCarePlan {
  const dates = makeDates('2026-07-02', 14);
  const s: Record<string, DailyActivity[]> = {};
  dates.forEach((d, i) => {
    const day = i + 1;
    const isRNday = day <= 7 || day % 2 === 1;
    s[d] = [
      { time: '07:00', activity: 'AM Analgesia', type: 'medication', detail: 'Paracetamol 1g q6h scheduled. Tramadol 50mg q6h prn (max 400mg/day). Take before pain escalates.', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:00', activity: 'Light Breakfast', type: 'self_care', detail: 'Small frequent meals. Anti-emetics 30min before if nausea. Rest between activities.', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:30', activity: 'RN Wound Care Visit', type: 'nurse_visit', detail: 'Surgical site assessment, photo documentation, saline irrigation, non-adherent dressing. Drain output measurement + character. Infection screen.', status: isRNday ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Angela Ng (RN)' },
      { time: '09:30', activity: 'Drain Management', type: 'monitoring', detail: 'Record drain output (mL), colour, odour. Mark fluid level. Report if >50mL/24h increase or purulent.', status: i < 3 ? 'completed' : 'pending' },
      { time: '10:00', activity: 'Rest Period', type: 'self_care', detail: 'Mandatory rest 30-60min post wound care. Avoid heavy lifting affected arm.', status: i < 3 ? 'completed' : 'pending' },
      { time: '12:00', activity: 'Lunch', type: 'self_care', detail: 'High-protein soft diet. Hydration 1.5L. Husband assists with meal prep.', status: i < 3 ? 'completed' : 'pending' },
      { time: '14:00', activity: 'Pain Assessment', type: 'monitoring', detail: 'NRS 0-10 pain score. Document location, character, relief from analgesia. Report NRS >4 unrelieved.', status: i < 3 ? 'completed' : 'pending' },
      { time: '15:00', activity: 'Teleconsult (q48h)', type: 'doctor_consult', detail: 'Dr. Chan Chi Keung — review wound healing, drain output trend, pain control, chemo planning readiness.', status: day % 2 === 1 ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Dr. Chan Chi Keung' },
      { time: '16:00', activity: 'Gentle Mobility', type: 'self_care', detail: 'Short indoor walk 5-10min. Arm exercises per physio protocol — no lifting >2kg.', status: i < 3 ? 'completed' : 'pending' },
      { time: '18:00', activity: 'Dinner + PM Analgesia', type: 'medication', detail: 'Evening meal. Scheduled Paracetamol. Tramadol prn if needed.', status: i < 3 ? 'completed' : 'pending' },
      { time: '20:00', activity: 'Evening Wound Check', type: 'monitoring', detail: 'Husband inspects dressing integrity. Photo if any concern. Temp check — report fever >38°C.', status: i < 3 ? 'completed' : 'pending' },
      { time: '21:00', activity: 'Bedtime Rest', type: 'self_care', detail: 'Sleep on back or unaffected side. Extra pillows for comfort. Call HaH if uncontrolled pain or fever.', status: i < 3 ? 'completed' : 'pending' },
    ];
  });
  return {
    patientName: 'Wong Lai Chun',
    startDate: dates[0],
    endDate: dates[13],
    schedule: s,
    logs: [
      { date: '2026-07-03', time: '08:30', type: 'RN Wound Care', detail: 'POD5. Wound clean, no erythema. Drain output 28mL/24h (↓ from 35mL). Pain NRS 2/10. Dressing changed. Husband demonstrates correct technique.', author: 'Angela Ng', role: 'RN', vitals: 'Temp 36.5 | Pain 2/10 | Drain 28mL', status: 'completed' },
      { date: '2026-07-02', time: '09:00', type: 'RN — Initial Assessment', detail: 'HaH Day 1 post-lumpectomy + SLNB. Surgical site intact. Drain patent, output 35mL serous. Pain NRS 3/10. Psychosocial support offered. Return precautions reviewed.', author: 'Angela Ng', role: 'RN', vitals: 'Temp 36.5 | Pain 3/10 | Drain 35mL', status: 'completed' },
      { date: '2026-07-03', time: '15:00', type: 'Teleconsult', detail: 'POD5 review. Wound healing well. Drain likely removable when <30mL ×2 days. Pain controlled on PRN regimen. Oncology appointment 2026-07-10 for adjuvant chemo planning.', author: 'Dr. Chan Chi Keung', role: 'Breast/Oncology', vitals: 'Pain 2/10 | Drain 28mL', status: 'completed' },
      { date: '2026-07-04', time: '08:30', type: 'RN Wound Care', detail: 'POD6. Drain output 22mL. Approaching removal threshold. No signs of seroma or infection. Patient resting well between activities.', author: 'Angela Ng', role: 'RN', vitals: 'Temp 36.5 | Drain 22mL | Pain 1/10', status: 'completed' },
    ],
  };
}

function buildHFPlan(): TwoWeekCarePlan {
  const dates = makeDates('2026-07-04', 14);
  const s: Record<string, DailyActivity[]> = {};
  dates.forEach((d, i) => {
    const day = i + 1;
    const isRNday = day <= 5 || day % 2 === 1;
    s[d] = [
      { time: '06:30', activity: 'Daily Weight + AM Vitals', type: 'monitoring', detail: 'Weight, BP, HR, SpO₂. Same scale, same time, post-void, minimal clothing. Report gain >1kg/24h or >2kg/week.', status: i < 3 ? 'completed' : 'pending' },
      { time: '07:00', activity: 'AM GDMT', type: 'medication', detail: 'Entresto 49/51mg BID + Bisoprolol 2.5mg + Furosemide 40mg + Spironolactone 25mg + Apixaban 2.5mg BID', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:00', activity: 'Low-Sodium Breakfast', type: 'self_care', detail: 'Sodium <2g/day. Fluid counted towards 1.5L daily limit.', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:30', activity: 'RN HF Visit', type: 'nurse_visit', detail: 'Vitals, JVP, pedal oedema, lung auscultation, I/O review, weight trend, GDMT tolerance, renal function monitoring.', status: isRNday ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Sarah Leung (RN)' },
      { time: '10:00', activity: 'Fluid Intake Log', type: 'monitoring', detail: 'Mid-morning fluid check. Cumulative intake recorded. Target max 1,500mL/24h.', status: i < 3 ? 'completed' : 'pending' },
      { time: '10:30', activity: 'Cardiac Rehab (PT)', type: 'therapy', detail: 'Seated exercises, gentle walking 10min. Monitor HR/SpO₂. Stop if orthopnoea or weight gain.', status: day % 2 === 0 ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'David Chan (PT)' },
      { time: '12:00', activity: 'Lunch + I/O', type: 'self_care', detail: 'Low sodium meal. Record intake. Urine output measured.', status: i < 3 ? 'completed' : 'pending' },
      { time: '14:00', activity: 'PM Furosemide', type: 'medication', detail: 'Furosemide 40mg (2nd dose if prescribed). Monitor urine output response.', status: i < 3 ? 'completed' : 'pending' },
      { time: '15:00', activity: 'Teleconsult (q48h)', type: 'doctor_consult', detail: 'Dr. Chan Chi Keung — review weight trend, I/O balance, BNP, GDMT uptitration, renal panel.', status: day % 2 === 1 ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Dr. Chan Chi Keung' },
      { time: '16:00', activity: 'Leg Elevation', type: 'self_care', detail: 'Elevate legs 30min. Daughter reviews daily weight log and fluid compliance.', status: i < 3 ? 'completed' : 'pending' },
      { time: '18:00', activity: 'Dinner', type: 'self_care', detail: 'Low sodium. Final fluid tally for day.', status: i < 3 ? 'completed' : 'pending' },
      { time: '19:00', activity: 'PM GDMT', type: 'medication', detail: 'Entresto 49/51mg + Apixaban 2.5mg', status: i < 3 ? 'completed' : 'pending' },
      { time: '20:00', activity: 'Evening Weight Check', type: 'monitoring', detail: 'PM weight (compare to AM). I/O summary for 24h period.', status: i < 3 ? 'completed' : 'pending' },
      { time: '21:00', activity: 'Bedtime', type: 'self_care', detail: 'Head elevated 30°. No fluids 1h before bed. Smartwatch sleep monitoring.', status: i < 3 ? 'completed' : 'pending' },
    ];
  });
  return {
    patientName: 'Fok Wai Keung',
    startDate: dates[0],
    endDate: dates[13],
    schedule: s,
    logs: [
      { date: '2026-07-05', time: '08:30', type: 'RN Visit', detail: 'Day 2. Weight 68.2kg stable (target <68.5). BP 108/68. HR 84 AF. SpO₂ 94%. Pedal oedema trace. I/O: net -320mL. GDMT tolerated. Daughter managing fluid log well.', author: 'Sarah Leung', role: 'RN', vitals: 'BP 108/68 | HR 84 | SpO₂ 94% | Wt 68.2kg', status: 'completed' },
      { date: '2026-07-04', time: '09:00', type: 'RN — Initial Assessment', detail: 'HaH Day 1. NYHA III, EF 32%. Weight 68.5kg baseline. JVP 5cm. Pedal oedema 1+. GDMT reconciliation. Smart scale paired. Fluid restriction 1.5L education.', author: 'Sarah Leung', role: 'RN', vitals: 'BP 110/70 | HR 86 | SpO₂ 93% | Wt 68.5kg', status: 'completed' },
      { date: '2026-07-05', time: '15:00', type: 'Teleconsult', detail: 'Day 2 review. Euvolemic at 68.2kg. BNP 920 (↓ from 1,800). Renal stable Cr 156. Continue GDMT. Recheck renal panel Day 5.', author: 'Dr. Chan Chi Keung', role: 'Cardiologist', vitals: 'Wt 68.2kg | BNP 920', status: 'completed' },
      { date: '2026-07-06', time: '08:30', type: 'RN Visit', detail: 'Day 3. Weight 68.0kg (↓0.2). No orthopnoea. I/O net negative. GDMT compliance 100%. Daughter reports improved appetite.', author: 'Sarah Leung', role: 'RN', vitals: 'BP 106/66 | HR 82 | Wt 68.0kg', status: 'completed' },
    ],
  };
}

function buildDMPlan(): TwoWeekCarePlan {
  const dates = makeDates('2026-07-05', 14);
  const s: Record<string, DailyActivity[]> = {};
  dates.forEach((d, i) => {
    const day = i + 1;
    const isRNday = day <= 5 || day % 2 === 1;
    const isEducatorDay = day === 2 || day === 4 || day === 7;
    s[d] = [
      { time: '06:30', activity: 'SMBG Fasting', type: 'monitoring', detail: 'Capillary glucose fasting. Target 4-7 mmol/L. Record in qid log.', status: i < 3 ? 'completed' : 'pending' },
      { time: '07:00', activity: 'AM Basal Insulin', type: 'medication', detail: 'Insulin glargine 22 units SC. Rotate injection sites (abdomen/thigh). Brother supervises.', status: i < 3 ? 'completed' : 'pending' },
      { time: '07:30', activity: 'Breakfast + Bolus', type: 'medication', detail: 'Insulin lispro 6u with breakfast (carb ratio 1:10). SMBG pre-meal confirmed.', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:30', activity: 'RN Diabetes Visit', type: 'nurse_visit', detail: 'SMBG log review, insulin technique, injection site inspection, foot check (monofilament), hypoglycaemia education, sick day rules.', status: isRNday ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Vivian Lau (RN)' },
      { time: '10:00', activity: 'SMBG Pre-Lunch', type: 'monitoring', detail: 'Pre-lunch glucose. Adjust bolus per correction factor if >10 mmol/L.', status: i < 3 ? 'completed' : 'pending' },
      { time: '11:00', activity: 'DM Educator Session', type: 'care_worker', detail: 'Carb counting, insulin adjustment, sick day management, ketone testing protocol.', status: isEducatorDay ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Dr. Leung Siu Keung (Diabetes Educator)' },
      { time: '12:00', activity: 'Lunch + Bolus', type: 'medication', detail: 'Renal-friendly meal (UACR 320). Insulin lispro with meal. Metformin 1g BID.', status: i < 3 ? 'completed' : 'pending' },
      { time: '14:00', activity: 'Daily Foot Check', type: 'monitoring', detail: 'Inspect feet: skin integrity, ulcers, calluses, temperature difference. Monofilament test weekly.', status: i < 3 ? 'completed' : 'pending' },
      { time: '15:00', activity: 'Teleconsult (q48h)', type: 'doctor_consult', detail: 'Dr. Cheung Kwok Wai — review HbA1c trend, SMBG variability, insulin dosing, nephropathy monitoring.', status: day % 2 === 1 ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Dr. Cheung Kwok Wai' },
      { time: '16:00', activity: 'SMBG Pre-Dinner', type: 'monitoring', detail: 'Pre-dinner glucose. Empagliflozin 10mg with evening meal.', status: i < 3 ? 'completed' : 'pending' },
      { time: '18:00', activity: 'Dinner + Bolus', type: 'medication', detail: 'Insulin lispro with dinner. Low GI meal plan.', status: i < 3 ? 'completed' : 'pending' },
      { time: '20:00', activity: 'SMBG Bedtime', type: 'monitoring', detail: 'Bedtime glucose. Target 5-8 mmol/L. Snack if <5 mmol/L.', status: i < 3 ? 'completed' : 'pending' },
      { time: '21:00', activity: 'Foot Care Routine', type: 'self_care', detail: 'Wash/dry feet, moisturise (not between toes). Inspect shoes. Report any breaks in skin.', status: i < 3 ? 'completed' : 'pending' },
    ];
  });
  return {
    patientName: 'Lau Wai Yin',
    startDate: dates[0],
    endDate: dates[13],
    schedule: s,
    logs: [
      { date: '2026-07-06', time: '08:30', type: 'RN Visit', detail: 'Day 2. SMBG range 5.8-10.2 mmol/L. No hypoglycaemia. Insulin technique correct. Foot monofilament 8/10. Injection sites rotating well. Ketones negative.', author: 'Vivian Lau', role: 'RN', vitals: 'SMBG 6.4-9.8 | HbA1c pending', status: 'completed' },
      { date: '2026-07-05', time: '09:00', type: 'RN — Initial Assessment', detail: 'HaH Day 1. T2DM on basal-bolus. HbA1c 8.1%. UACR 320. NPDR mild. Insulin storage verified. Brother trained on glucagon kit.', author: 'Vivian Lau', role: 'RN', vitals: 'SMBG 7.2 fasting | BP 138/82', status: 'completed' },
      { date: '2026-07-06', time: '11:00', type: 'DM Educator', detail: 'Day 2 education. Carb counting mastered. Sick day rules card posted. Ketone strips demonstrated. Podiatry referral confirmed.', author: 'Dr. Leung Siu Keung', role: 'Diabetes Educator', vitals: '', status: 'completed' },
      { date: '2026-07-06', time: '15:00', type: 'Teleconsult', detail: 'Day 2 review. SMBG improving. Continue basal-bolus. Empagliflozin for renoprotection. Target HbA1c <7%. Nephrology F/U in 4 weeks.', author: 'Dr. Cheung Kwok Wai', role: 'Endocrinologist', vitals: 'SMBG avg 7.8', status: 'completed' },
    ],
  };
}

function buildCKD4Plan(): TwoWeekCarePlan {
  const dates = makeDates('2026-07-07', 14);
  const s: Record<string, DailyActivity[]> = {};
  dates.forEach((d, i) => {
    const day = i + 1;
    const isRNday = day <= 5 || day % 2 === 1;
    const isESADay = day === 1 || day === 8;
    s[d] = [
      { time: '06:30', activity: 'AM BP Check', type: 'monitoring', detail: 'Home BP BID. Target <130/80. Sit 5min before measurement. Same arm each time.', status: i < 3 ? 'completed' : 'pending' },
      { time: '07:00', activity: 'AM Renal Meds', type: 'medication', detail: 'Losartan 100mg + Amlodipine 10mg + Sodium Bicarbonate 1g + Sevelamer 800mg with breakfast', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:00', activity: 'Renal Diet Breakfast', type: 'self_care', detail: 'Low K⁺ (<2g/day), low PO₄, protein 0.8g/kg. Fluid 1.2L if not overloaded.', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:30', activity: 'RN Renal Visit', type: 'nurse_visit', detail: 'BP, weight, fluid balance, oedema, pruritus score, medication review, renal diet compliance, AVF planning education.', status: isRNday ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Connie Cheung (RN)' },
      { time: '10:00', activity: 'Fluid Balance Chart', type: 'monitoring', detail: 'Record intake/output. Weigh daily. Report ankle swelling or weight gain >1kg.', status: i < 3 ? 'completed' : 'pending' },
      { time: '11:00', activity: 'ESA Injection', type: 'medication', detail: 'Darbepoetin alfa 40mcg SC (weekly). Wife administers after RN training. Rotate sites.', status: isESADay ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Connie Cheung (RN)' },
      { time: '12:00', activity: 'Renal Diet Lunch', type: 'self_care', detail: 'PO₄ binders with meal. Avoid high-K⁺ foods (banana, orange, potato).', status: i < 3 ? 'completed' : 'pending' },
      { time: '14:00', activity: 'Afternoon Rest', type: 'self_care', detail: 'Fatigue management. Avoid NSAIDs absolutely.', status: i < 3 ? 'completed' : 'pending' },
      { time: '15:00', activity: 'Teleconsult (q48h)', type: 'doctor_consult', detail: 'Dr. Chan Chi Keung — review eGFR trend, K⁺/PO₄, Hb, BP control, ESA response, AVF timing.', status: day % 2 === 1 ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Dr. Chan Chi Keung' },
      { time: '17:00', activity: 'PM BP Check', type: 'monitoring', detail: 'Evening BP. Record in log. Report if >160/100 or symptomatic.', status: i < 3 ? 'completed' : 'pending' },
      { time: '18:00', activity: 'Renal Diet Dinner', type: 'self_care', detail: 'Low K⁺/PO₄ meal. Sevelamer with dinner if PO₄-rich foods.', status: i < 3 ? 'completed' : 'pending' },
      { time: '20:00', activity: 'Daily Weight', type: 'monitoring', detail: 'Evening weight. Compare to AM. Fluid status assessment.', status: i < 3 ? 'completed' : 'pending' },
      { time: '21:00', activity: 'Bedtime', type: 'self_care', detail: 'Pruritus management (emollients). AVF arm protection education.', status: i < 3 ? 'completed' : 'pending' },
    ];
  });
  return {
    patientName: 'Tsang Kwok Hung',
    startDate: dates[0],
    endDate: dates[13],
    schedule: s,
    logs: [
      { date: '2026-07-08', time: '08:30', type: 'RN Visit', detail: 'Day 2. BP 142/88. Weight stable. K⁺ 4.8 (last lab). Hb 10.2 post-ESA. No oedema. Pruritus mild. Wife demonstrates ESA SC technique correctly.', author: 'Connie Cheung', role: 'RN', vitals: 'BP 142/88 | K⁺ 4.8 | Hb 10.2 | Wt stable', status: 'completed' },
      { date: '2026-07-07', time: '09:00', type: 'RN — Initial Assessment', detail: 'HaH Day 1. CKD4 eGFR 22. HTN nephrosclerosis. ESA injection training completed. Renal diet handout reviewed. AVF planning in 4 weeks.', author: 'Connie Cheung', role: 'RN', vitals: 'BP 144/90 | eGFR 22 | Hb 9.8', status: 'completed' },
      { date: '2026-07-08', time: '11:00', type: 'ESA Administration', detail: 'First home ESA injection supervised. Darbepoetin 40mcg SC left thigh. No reaction. Wife confident to continue weekly.', author: 'Connie Cheung', role: 'RN', vitals: 'Injection site clean', status: 'completed' },
      { date: '2026-07-08', time: '15:00', type: 'Teleconsult', detail: 'Day 2 review. Uraemic symptoms improved. Continue renal diet + ESA. Avoid nephrotoxins. AVF referral submitted. Nephrology monthly telehealth.', author: 'Dr. Chan Chi Keung', role: 'Nephrologist', vitals: 'BP 142/88 | Hb 10.2', status: 'completed' },
    ],
  };
}

function buildHTNOSAPlan(): TwoWeekCarePlan {
  const dates = makeDates('2026-06-30', 14);
  const s: Record<string, DailyActivity[]> = {};
  dates.forEach((d, i) => {
    const day = i + 1;
    const isRNday = day <= 3 || day % 3 === 1;
    s[d] = [
      { time: '06:30', activity: 'AM BP Check', type: 'monitoring', detail: 'Home BP before medications. Target <130/80. Sit quietly 5min. Record in BID log.', status: i < 3 ? 'completed' : 'pending' },
      { time: '07:00', activity: 'AM Antihypertensives', type: 'medication', detail: 'Amlodipine 10mg + Lisinopril 20mg + Indapamide 2.5mg + Doxazosin 4mg (4-drug regimen)', status: i < 3 ? 'completed' : 'pending' },
      { time: '07:30', activity: 'CPAP Compliance Review', type: 'monitoring', detail: 'Check CPAP data: hours used, AHI residual, mask leak. Target ≥4h/night, AHI <5.', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:00', activity: 'DASH Breakfast', type: 'self_care', detail: 'Low sodium (<2g/day). High fruits/vegetables. Wife monitors meal prep.', status: i < 3 ? 'completed' : 'pending' },
      { time: '09:00', activity: 'RN Visit', type: 'nurse_visit', detail: 'BP review, CPAP compliance data download, weight, medication side effects (orthostatic hypotension), exercise tolerance.', status: isRNday ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Sarah Leung (RN)' },
      { time: '10:00', activity: 'Weight Check', type: 'monitoring', detail: 'Weekly weight (same day). Target BMI reduction 5% over 3 months.', status: day % 7 === 1 ? (i < 3 ? 'completed' : 'pending') : 'pending' },
      { time: '10:30', activity: 'Exercise Session', type: 'therapy', detail: 'Brisk walk 20-30min or stationary bike. Target 150min/week moderate activity.', status: day % 2 === 0 ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'David Chan (PT)' },
      { time: '12:00', activity: 'Lunch', type: 'self_care', detail: 'DASH meal plan. No added salt.', status: i < 3 ? 'completed' : 'pending' },
      { time: '17:00', activity: 'PM BP Check', type: 'monitoring', detail: 'Evening BP before dinner. Compare to AM reading.', status: i < 3 ? 'completed' : 'pending' },
      { time: '18:00', activity: 'Dinner', type: 'self_care', detail: 'Low sodium meal. Avoid alcohol (BP + OSA worsening).', status: i < 3 ? 'completed' : 'pending' },
      { time: '20:00', activity: 'CPAP Setup', type: 'self_care', detail: 'Clean mask. Check hose. Humidifier filled. Target bedtime CPAP use.', status: i < 3 ? 'completed' : 'pending' },
      { time: '21:00', activity: 'CPAP On', type: 'monitoring', detail: 'CPAP at 12cmH₂O. Auto-upload compliance data. Report morning headaches or excessive sleepiness.', status: i < 3 ? 'completed' : 'pending' },
      { time: '22:00', activity: 'Bedtime', type: 'self_care', detail: 'Side sleeping preferred. CPAP compliance tracked remotely.', status: i < 3 ? 'completed' : 'pending' },
    ];
  });
  return {
    patientName: 'Mak Ka Ming',
    startDate: dates[0],
    endDate: dates[13],
    schedule: s,
    logs: [
      { date: '2026-07-01', time: '09:00', type: 'RN Visit', detail: 'Day 2. Home BP 136/84 (AM), 128/80 (PM). CPAP 6.2h last night, AHI residual 3.2. Weight ↓0.5kg. No orthostatic symptoms. 4-drug regimen tolerated.', author: 'Sarah Leung', role: 'RN', vitals: 'BP 136/84 | CPAP 6.2h | AHI 3.2', status: 'completed' },
      { date: '2026-06-30', time: '10:00', type: 'RN — Initial Assessment', detail: 'HaH Day 1. Resistant HTN on 4 drugs. OSA on CPAP. 24h ABPM device fitted. CPAP remote dashboard paired. DASH diet education. LVH on echo — stable.', author: 'Sarah Leung', role: 'RN', vitals: 'BP 138/86 | CPAP 5.8h | BMI 32.1', status: 'completed' },
      { date: '2026-07-01', time: '15:00', type: 'Teleconsult', detail: 'Day 2 review. BP improving. CPAP compliance excellent. Continue 4-drug + CPAP. Weight management programme. Cardiology echo in 3 months.', author: 'Dr. Chan Chi Keung', role: 'Cardiologist', vitals: 'BP 136/84 | CPAP 6.2h', status: 'completed' },
      { date: '2026-07-02', time: '10:30', type: 'Exercise PT', detail: 'Day 1 exercise session. Walked 25min at moderate pace. BP post-exercise 142/88. No symptoms. Weekly target 150min discussed.', author: 'David Chan', role: 'PT', vitals: 'BP post-ex 142/88 | HR 92', status: 'completed' },
    ],
  };
}

function buildOrthoPlan(): TwoWeekCarePlan {
  const dates = makeDates('2026-07-08', 14);
  const s: Record<string, DailyActivity[]> = {};
  dates.forEach((d, i) => {
    const day = i + 1;
    const isRNday = day <= 7 || day % 2 === 1;
    const isPTday = day >= 2 && day % 2 === 0;
    s[d] = [
      { time: '07:00', activity: 'AM Analgesia', type: 'medication', detail: 'Paracetamol 1g + Celecoxib 200mg. Tramadol 50mg prn if NRS >4.', status: i < 3 ? 'completed' : 'pending' },
      { time: '07:30', activity: 'DVT Prophylaxis', type: 'medication', detail: 'Enoxaparin 40mg SC (until Day 14 post-op or ambulatory). Son assists with injection if needed.', status: day <= 6 ? (i < 3 ? 'completed' : 'pending') : 'pending' },
      { time: '08:00', activity: 'NWB Transfer Training', type: 'self_care', detail: 'Non-weight-bearing R hip. Sliding board transfers bed↔wheelchair. Call for assist always.', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:30', activity: 'RN Ortho Visit', type: 'nurse_visit', detail: 'Surgical wound check, DVT signs (calf swelling, pain), pain score, NWB compliance, fall risk, enoxaparin site rotation.', status: isRNday ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Angela Ng (RN)' },
      { time: '09:30', activity: 'PT Gait Training', type: 'therapy', detail: 'NWB gait with walker/crutches, weight-shifting, balance, stair technique (when cleared). Partial weight-bearing from Week 6.', status: isPTday ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Eric Chan (PT)' },
      { time: '10:30', activity: 'Pain Assessment', type: 'monitoring', detail: 'NRS 0-10 at rest and with movement. Pre-medicate before PT.', status: i < 3 ? 'completed' : 'pending' },
      { time: '11:00', activity: 'Care Worker ADL Support', type: 'care_worker', detail: 'Meal prep, transfers, companionship, bathroom assistance. NWB hip precautions reinforced.', status: i < 3 ? 'completed' : 'pending', provider: 'Carol Ng (Care Worker)' },
      { time: '12:00', activity: 'Lunch + Rest', type: 'self_care', detail: 'High-calcium, high-protein for bone healing. Elevate operative leg.', status: i < 3 ? 'completed' : 'pending' },
      { time: '14:00', activity: 'Leg Elevation', type: 'self_care', detail: 'Elevate operative leg above heart level 2h. Ice pack 20min if swelling.', status: i < 3 ? 'completed' : 'pending' },
      { time: '15:00', activity: 'Teleconsult (q48h)', type: 'doctor_consult', detail: 'Dr. Lee Mei Ling — review wound healing, pain control, DVT prophylaxis, PT progress, XR schedule.', status: day % 2 === 1 ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Dr. Lee Mei Ling' },
      { time: '16:00', activity: 'Transfer Practice', type: 'therapy', detail: 'Son assists with toilet transfers using raised seat + grab bars. NWB maintained.', status: i < 3 ? 'completed' : 'pending' },
      { time: '18:00', activity: 'PM Analgesia + Enoxaparin', type: 'medication', detail: 'Evening Paracetamol. Enoxaparin if not given AM.', status: i < 3 ? 'completed' : 'pending' },
      { time: '20:00', activity: 'Evening Wound Check', type: 'monitoring', detail: 'Inspect dressing. Report increased drainage, redness, or fever >38°C.', status: i < 3 ? 'completed' : 'pending' },
      { time: '21:00', activity: 'Bedtime Safety', type: 'self_care', detail: 'Night light on. Walker at bedside. NWB reminder sign posted.', status: i < 3 ? 'completed' : 'pending' },
    ];
  });
  return {
    patientName: 'Fung Kam Tong',
    startDate: dates[0],
    endDate: dates[13],
    schedule: s,
    logs: [
      { date: '2026-07-09', time: '08:30', type: 'RN Visit', detail: 'POD10. Wound clean, staples intact. NRS 2/10 at rest. No calf swelling. Enoxaparin Day 10. NWB compliance good. Transfers with sliding board improving.', author: 'Angela Ng', role: 'RN', vitals: 'Pain 2/10 | No DVT signs | Wound clean', status: 'completed' },
      { date: '2026-07-08', time: '09:00', type: 'RN — Initial Assessment', detail: 'HaH Day 1 post R hip ORIF. POD9. Wound dry. NWB ×6 weeks confirmed. Enoxaparin started. Home OT: grab bars, raised toilet seat. Fall risk HIGH.', author: 'Angela Ng', role: 'RN', vitals: 'Pain 3/10 | Morse 65', status: 'completed' },
      { date: '2026-07-09', time: '09:30', type: 'PT Session', detail: 'Day 1 PT. NWB gait 20m with walker. Weight-shifting exercises. Balance tolerated. Pain NRS 3/10 during session — pre-medicated.', author: 'Eric Chan', role: 'PT', vitals: 'Pain 3/10 | Gait 20m NWB', status: 'completed' },
      { date: '2026-07-09', time: '15:00', type: 'Teleconsult', detail: 'POD10 review. Wound healing on track. Continue NWB ×6 weeks. Enoxaparin until Day 14. XR follow-up 4 weeks. PT 3×/wk.', author: 'Dr. Lee Mei Ling', role: 'Internal Medicine', vitals: 'Pain 2/10 | Wound clean', status: 'completed' },
    ],
  };
}

function buildCAPCOPDPlan(): TwoWeekCarePlan {
  const dates = makeDates('2026-07-02', 14);
  const s: Record<string, DailyActivity[]> = {};
  dates.forEach((d, i) => {
    const day = i + 1;
    const abxDay = day + 2;
    const isRNday = day <= 5 || day % 2 === 1;
    s[d] = [
      { time: '07:00', activity: 'AM Antibiotic + Inhaler', type: 'medication', detail: `Amoxicillin-Clavulanate 625mg BID (Day ${abxDay} of 7). Tiotropium 18mcg HandiHaler.`, status: i < 3 ? 'completed' : 'pending' },
      { time: '07:30', activity: 'Morning SpO₂ + Temp', type: 'monitoring', detail: 'SpO₂ at rest, temp, HR. Report fever >38°C or SpO₂ <92%.', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:00', activity: 'Breakfast', type: 'self_care', detail: 'Light meal. Sit upright. Hydration 2L/day during antibiotic course.', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:30', activity: 'RN Visit', type: 'nurse_visit', detail: 'Vitals, lung auscultation, cough/sputum assessment, antibiotic tolerance, inhaler technique, CAP response monitoring.', status: isRNday ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Jenny Tam (RN)' },
      { time: '09:30', activity: 'Incentive Spirometry', type: 'therapy', detail: '10 deep breaths q2h while awake. Hold 3 sec. Target 500mL. Essential for COPD + CAP recovery.', status: i < 3 ? 'completed' : 'pending' },
      { time: '10:00', activity: 'Salbutamol Nebulizer', type: 'medication', detail: 'Salbutamol 2.5mg nebulizer if wheeze or SpO₂ <93%. Max q4h.', status: i < 3 ? 'completed' : 'pending' },
      { time: '12:00', activity: 'Lunch + Rest', type: 'self_care', detail: 'Nutritious meal. Rest 1h post-meal. No strenuous activity.', status: i < 3 ? 'completed' : 'pending' },
      { time: '14:00', activity: 'PM Antibiotic', type: 'medication', detail: `Amoxicillin-Clavulanate 625mg (2nd daily dose, Day ${abxDay} of 7).`, status: i < 3 ? 'completed' : 'pending' },
      { time: '15:00', activity: 'Teleconsult (q48h)', type: 'doctor_consult', detail: 'Dr. Lee Mei Ling — review temp/SpO₂ trend, sputum improvement, antibiotic response, COPD stability.', status: day % 2 === 1 ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Dr. Lee Mei Ling' },
      { time: '16:00', activity: 'Gentle Activity', type: 'self_care', detail: 'Short indoor walk. Incentive spirometry. Husband monitors SpO₂.', status: i < 3 ? 'completed' : 'pending' },
      { time: '18:00', activity: 'Dinner', type: 'self_care', detail: 'Light meal. Continue hydration.', status: i < 3 ? 'completed' : 'pending' },
      { time: '20:00', activity: 'Evening SpO₂ + Temp', type: 'monitoring', detail: 'SpO₂ at rest. Temp check. Report any deterioration.', status: i < 3 ? 'completed' : 'pending' },
      { time: '21:00', activity: 'Bedtime', type: 'self_care', detail: 'Head elevated. Inhaler + action plan visible. Emergency numbers posted.', status: i < 3 ? 'completed' : 'pending' },
    ];
  });
  return {
    patientName: 'Chan Yuk Lin',
    startDate: dates[0],
    endDate: dates[13],
    schedule: s,
    logs: [
      { date: '2026-07-03', time: '08:30', type: 'RN Visit', detail: 'Day 2. Temp 36.8. SpO₂ 95% RA. RR 18. RLL crackles resolving. Cough productive, yellow→white sputum. Amox-Clav Day 4 tolerated. Incentive spirometry compliance good.', author: 'Jenny Tam', role: 'RN', vitals: 'Temp 36.8 | SpO₂ 95% | RR 18 | HR 80', status: 'completed' },
      { date: '2026-07-02', time: '09:00', type: 'RN — Initial Assessment', detail: 'HaH Day 1. CAP RLL resolving + COPD GOLD2. Temp 37.0. SpO₂ 94%. Amox-Clav Day 3. Inhaler technique reviewed. Husband trained on escalation criteria.', author: 'Jenny Tam', role: 'RN', vitals: 'Temp 37.0 | SpO₂ 94% | RR 20 | HR 82', status: 'completed' },
      { date: '2026-07-03', time: '15:00', type: 'Teleconsult', detail: 'Day 2 review. Afebrile. SpO₂ improved. CRP trending down. Complete 7-day Amox-Clav. Continue Tiotropium. RTC CXR Week 4.', author: 'Dr. Lee Mei Ling', role: 'Respiratory Physician', vitals: 'Temp 36.8 | SpO₂ 95%', status: 'completed' },
      { date: '2026-07-04', time: '08:30', type: 'RN Visit', detail: 'Day 3. Temp 36.6. SpO₂ 96%. Appetite returned. Incentive spirometry 520mL peak. Patient feels "much better". Husband confident with monitoring.', author: 'Jenny Tam', role: 'RN', vitals: 'Temp 36.6 | SpO₂ 96% | RR 16', status: 'completed' },
    ],
  };
}

function buildThoracicSurgeryPlan(): TwoWeekCarePlan {
  const dates = makeDates('2026-06-30', 14);
  const s: Record<string, DailyActivity[]> = {};
  dates.forEach((d, i) => {
    const day = i + 1;
    const isRNday = day <= 7 && day % 2 === 1;
    const isPTday = day % 2 === 1;
    const isConsultDay = day === 1 || day === 3 || day === 6 || day === 9 || day === 12;
    s[d] = [
      { time: '07:00', activity: 'AM Vitals + Analgesia', type: 'monitoring', detail: 'BP, SpO₂, HR, Temp, Weight. Pain VAS self-assessment. AM analgesia. Record cough frequency/character in diary (Perindopril monitoring).', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:00', activity: 'Breakfast + Nutrition Log', type: 'self_care', detail: 'High-protein meal for wound healing. Record intake. Weight tracking — report loss >1kg from prior day.', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:30', activity: 'RN Visit', type: 'nurse_visit', detail: 'Wound assessment (3 thoracoscopic ports), breath sounds, VAS pain, SpO₂ at rest + exertion, incentive spirometry best-of-3, VTE check (calf tenderness/swelling), cough diary review, Perindopril monitoring.', status: isRNday ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Jenny Tam (RN)' },
      { time: '10:00', activity: 'Smoking Cessation + Airway Care', type: 'self_care', detail: 'Smoking cessation support — zero relapse. Avoid dust and secondhand smoke. Incentive spirometry q2h while awake.', status: i < 3 ? 'completed' : 'pending' },
      { time: '10:30', activity: 'PT Pulmonary Rehab', type: 'therapy', detail: 'Deep breathing exercises, effective coughing technique, shoulder ROM (target 180° flexion), progressive walking (5min ×3/day, +5min/week). SpO₂ monitoring throughout.', status: isPTday ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Raymond Wong (PT)' },
      { time: '12:00', activity: 'Lunch + Rest', type: 'self_care', detail: 'High-protein lunch. Rest 1h. Leg elevation for VTE prevention.', status: i < 3 ? 'completed' : 'pending' },
      { time: '14:00', activity: 'PM Analgesia + VAS Check', type: 'medication', detail: 'Afternoon analgesia. VAS self-rating. Report pain >5/10 unrelieved by medication.', status: i < 3 ? 'completed' : 'pending' },
      { time: '15:00', activity: 'Teleconsult (q3d)', type: 'doctor_consult', detail: 'Dr. Wang Wei (Thoracic Surgeon) — review wound healing, air leak surveillance, pain control, IS progress, cough pattern, VTE signs.', status: isConsultDay ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Dr. Wang Wei (Thoracic Surgeon)' },
      { time: '17:00', activity: 'Independent Activity + Family Education', type: 'self_care', detail: 'Gentle ambulation. Wife reviews VTE warning signs, wound inspection, smoking cessation support. Cough diary update.', status: i < 3 ? 'completed' : 'pending' },
      { time: '19:00', activity: 'Dinner + PM Atorvastatin', type: 'medication', detail: 'High-protein dinner. Atorvastatin 20mg qn. Do NOT self-medicate with antibiotics.', status: i < 3 ? 'completed' : 'pending' },
      { time: '20:00', activity: 'Evening SpO₂ Check', type: 'monitoring', detail: 'SpO₂ at rest. Report <92% sustained or progressive dyspnoea immediately. Weight check — compare to AM.', status: i < 3 ? 'completed' : 'pending' },
    ];
  });
  return {
    patientName: 'Zhang Jianguo',
    startDate: dates[0],
    endDate: dates[13],
    schedule: s,
    logs: [
      { date: '2026-07-01', time: '09:00', type: 'RN Visit', detail: 'Initial post-discharge HaH assessment. Wound: (R) thoracoscopic ports ×3 — clean, dry, intact, no erythema/drainage. Respiratory: breath sounds clear bilaterally, no subcutaneous emphysema. SpO₂ 96% RA. IS volume 900mL (target). Pain: VAS 3/10 at rest, 5/10 with cough — analgesia adequate. VTE: no calf tenderness/swelling. Perindopril continuing — cough diary initiated. Wife trained on wound inspection + VTE warning signs.', author: 'Jenny Tam', role: 'RN', vitals: 'BP 128/82 | HR 78 | SpO₂ 96% | RR 16 | Temp 36.8 | VAS 3', status: 'completed' },
      { date: '2026-07-02', time: '15:00', type: 'Teleconsult', detail: 'PDD2 review. Wound clean. IS 950mL. Pain VAS 3. Cough dry, 2-3 episodes/day. Continue current plan. Await final pathology.', author: 'Dr. Wang Wei', role: 'Thoracic Surgeon', vitals: 'SpO₂ 96% | Pain VAS 3', status: 'completed' },
      { date: '2026-07-03', time: '09:15', type: 'RN Visit', detail: 'PDD3 assessment. Wound: healing well, no SSI signs. SpO₂ 97% RA — no desaturation with 100m walk. IS volume 1100mL (↑). Pain VAS 2/10 — Tramadol use decreasing. Cough: 2-3 episodes/day, dry, non-productive. Weight 66.5kg stable.', author: 'Jenny Tam', role: 'RN', vitals: 'BP 124/80 | HR 72 | SpO₂ 97% | RR 15 | Temp 36.6 | VAS 2', status: 'completed' },
      { date: '2026-07-05', time: '09:30', type: 'RN Visit', detail: 'PDD5 wound check: all 3 ports healing well, no erythema/drainage. IS now 1200mL. Pain VAS 2 — Tramadol reduced to once yesterday. Cough stable — dry, 1-2 episodes/day. Weight 66.3kg. VTE: negative.', author: 'Jenny Tam', role: 'RN', vitals: 'BP 122/78 | HR 70 | SpO₂ 97% | RR 14 | Temp 36.7 | VAS 2', status: 'completed' },
    ],
  };
}

/** Merge 14-day diagnosis-specific care plans for promoted patients 8–17 into target map. */
export function mergeNewPatientCarePlans(target: Record<number, TwoWeekCarePlan>): void {
  target[8] = buildNSTEMIPlan();
  target[9] = buildCOPDGold3Plan();
  target[10] = buildStrokePlan();
  target[11] = buildOncologyPlan();
  target[12] = buildHFPlan();
  target[13] = buildDMPlan();
  target[14] = buildCKD4Plan();
  target[15] = buildHTNOSAPlan();
  target[16] = buildOrthoPlan();
  target[17] = buildCAPCOPDPlan();
  target[18] = buildThoracicSurgeryPlan();
}
