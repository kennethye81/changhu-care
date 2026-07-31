export interface ClinicalDoc {
  id: string;
  patient: string;
  title: string;
  date: string;
  author: string;
  summary: string;
  content: string;
}

export const DISCHARGE_SUMMARIES: ClinicalDoc[] = [
  {
    id: 'DS-001', patient: 'Cheung Wai Man', title: 'Discharge Summary — ADHF NYHA III', date: '2026-06-15', author: 'Dr. Chan Chi Keung',
    summary: '78M with HFrEF NYHA III (LVEF 30%), CKD 3, T2DM, permanent AF. Discharged on GDMT with home monitoring.',
    content: 'Patient admitted with acute decompensation. GDMT optimized: Sacubitril/Valsartan, Bisoprolol, Furosemide, Spironolactone, Apixaban, Metformin. Discharge weight 68.0kg. Daily nurse HF assessments. Fluid restriction 1.5L/day. NEWS Low (2) at discharge — continue standard NEWS2 monitoring.',
  },
  {
    id: 'DS-002', patient: 'Wong Chi Ming', title: 'Discharge Summary — COPD Exacerbation', date: '2026-06-14', author: 'Dr. Lee Mei Ling',
    summary: '74F with COPD GOLD 3. Stabilized on LAMA/LABA. Home O₂ prn. Pulmonary rehab enrolled.',
    content: 'Acute COPD exacerbation treated with antibiotics, steroids taper, and bronchodilators. SpO₂ improved to 94% on 2L O₂. Discharged on Tiotropium/Olodaterol, Salbutamol PRN. Pulmonary rehab initiated. Nurse COPD checks 2x/week.',
  },
  {
    id: 'DS-003', patient: 'Lam Ka Chun', title: 'Discharge Summary — CAP to HaH', date: '2026-06-16', author: 'Dr. Cheung Kwok Wai',
    summary: '45M with CAP (penicillin allergy). Oral Levofloxacin 7-day course. SpO₂ 97%. Discharged to HaH monitoring.',
    content: 'Community-acquired pneumonia — H. influenzae on sputum culture. Penicillin allergy (rash) — Levofloxacin 750mg QD × 7 days chosen per IDSA. Afebrile × 48h, SpO₂ 97% RA, cough improving. HaH plan: SpO₂ q4h, teleconsult Day 3, nurse visit q48h.',
  },
  {
    id: 'DS-004', patient: 'Lau Suk Yee', title: 'Discharge Summary — Complicated UTI + CKD 3', date: '2026-06-13', author: 'Dr. Chan Chi Keung',
    summary: '81F with complicated UTI, CKD Stage 3, post-infectious delirium risk. IV Ciprofloxacin transitioned to oral.',
    content: 'Complicated UTI with E. coli (ESBL negative). AMTS 9/10 — monitor for confusion recurrence. Discharged on Ciprofloxacin BID × 7 days, Losartan, Dapagliflozin, Ferrous Sulfate. Hydration target 1.5L/day. Nurse visits 2x/week for AMTS + renal panel.',
  },
  {
    id: 'DS-005', patient: 'Ho Tai Wai', title: 'Discharge Summary — Cellulitis LLL', date: '2026-06-17', author: 'Dr. Lee Mei Ling',
    summary: '72M with Eron Class III cellulitis LLL + T2DM. IV Clindamycin → oral switch. Wound camera monitoring.',
    content: 'Left lower leg cellulitis with erythema and warmth. IV Clindamycin 600mg QID × 3 days, transitioned to oral. Infrared wound camera fitted for daily area tracking. Pain 2/10. Leg elevation + compression ordered. Nurse visits daily × 5 days then q48h.',
  },
  {
    id: 'DS-006', patient: 'Ng Siu Wan', title: 'Discharge Summary — DVT Left LL', date: '2026-06-18', author: 'Dr. Cheung Kwok Wai',
    summary: '67F with proximal left femoral DVT. Warfarin bridged — INR 2.1 therapeutic. HaH with daily POCT INR.',
    content: 'Acute proximal DVT — no PE on CTPA. LMWH bridging completed. Warfarin 5mg QD — INR 2.1 (target 2.0–3.0). Compression stockings Class II fitted. HaH: daily INR POCT, RN q2d, warfarin education completed. Anticoagulation 3–6 months.',
  },
  {
    id: 'DS-007', patient: 'Chan Tai Ming', title: 'Discharge Summary — COPD GOLD 2 + CAP (HaH)', date: '2026-06-18', author: 'Dr. Lee Mei Ling',
    summary: '82M with COPD GOLD 2 + CAP. IV Ceftriaxone+Azithromycin × 5d. Discharged to 7-day BID RN HaH.',
    content: 'CAP (H. influenzae) on moderate COPD background. IV antibiotics × 5 days — afebrile × 48h, SpO₂ 92% RA. Discharged to Hospital-at-Home: BID RN visits, O₂ standby, POCT escalation kit. Follow-up respiratory clinic 2026-07-09.',
  },
];

export const PROGRESS_NOTES: ClinicalDoc[] = [
  {
    id: 'PN-001', patient: 'Cheung Wai Man', title: 'Progress Note — HF GDMT Week 1', date: '2026-06-18', author: 'Dr. Chan Chi Keung',
    summary: 'BP 118/72, weight 68.0kg stable. BNP 850 trending down. GDMT compliance 94%.',
    content: 'Tele-consult Day 3. Pedal oedema trace. I/O net -270mL. Renal panel stable (Cr 138, K⁺ 3.9). Continue daily weight + strict I/O. Repeat BNP in 48h.',
  },
  {
    id: 'PN-002', patient: 'Wong Chi Ming', title: 'Progress Note — COPD Pulmonary Rehab Session 1', date: '2026-06-17', author: 'Raymond Wong',
    summary: '6MWT 310m baseline. SpO₂ maintained >91%. Pursed-lip breathing effective.',
    content: 'Initial pulmonary rehab. Cycle ergometer 5 min at 25 watts tolerated. Home exercise program prescribed. Target: +20m 6MWT in 4 weeks.',
  },
  {
    id: 'PN-003', patient: 'Lam Ka Chun', title: 'Progress Note — CAP Day 3 Teleconsult', date: '2026-06-18', author: 'Dr. Cheung Kwok Wai',
    summary: 'Afebrile × 72h. SpO₂ 97%. Cough improving. Levofloxacin tolerated — no QT concerns.',
    content: 'Day 3 CAP review. Temp 36.8°C, RR 18, HR 78, SpO₂ 97% RA. Sputum decreasing, colour improving. Continue oral Levofloxacin to Day 7. Nurse visit tomorrow for SpO₂ check.',
  },
  {
    id: 'PN-004', patient: 'Lau Suk Yee', title: 'Progress Note — CKD + UTI Review', date: '2026-06-20', author: 'Dr. Chan Chi Keung',
    summary: 'eGFR 47 stable. UACR 275. AMTS 9/10. Ciprofloxacin Day 4 — no confusion recurrence.',
    content: 'Monthly CKD review during UTI treatment. K⁺ 4.3, Hb 10.6. Oral antibiotics tolerated. Family performing AMTS checks daily. Continue hydration + renal diet.',
  },
  {
    id: 'PN-005', patient: 'Ho Tai Wai', title: 'Progress Note — Wound Assessment Day 2', date: '2026-06-19', author: 'Angela Ng',
    summary: 'Erythema improving. Wound camera: area ↓12%. Pain 1/10. IV site clean.',
    content: 'Cellulitis Day 2 RN visit. Temp 37.1°C, HR 82. Wound imaging shows reduced fluorescence — responding to Clindamycin. Leg elevation compliance good. Continue oral switch plan Day 4.',
  },
  {
    id: 'PN-006', patient: 'Ng Siu Wan', title: 'Progress Note — INR Monitoring Day 2', date: '2026-06-20', author: 'Sarah Leung',
    summary: 'INR 2.1 therapeutic. Calf girth 38cm (↓). No bleeding. Compression stockings compliant.',
    content: 'Daily POCT INR in range. Warfarin education completed — patient verbalised 5 safety points. Left leg swelling improving. Next INR tomorrow 08:00.',
  },
  {
    id: 'PN-007', patient: 'Chan Tai Ming', title: 'Progress Note — HaH Day 1 Assessment', date: '2026-06-18', author: 'Jenny Tam',
    summary: 'Baseline SpO₂ 93%, Temp 37.0, AMTS 10/10. Wife trained on monitoring + escalation.',
    content: 'Initial HaH RN assessment. Morse 55 (HIGH). Spiriva technique corrected. O₂ concentrator on standby. IV Ceftriaxone scheduled from Day 2 per C&S. BID RN visits per HIGH-risk triage.',
  },
];

export const LAB_REPORTS: ClinicalDoc[] = [
  {
    id: 'LR-001', patient: 'Cheung Wai Man', title: 'Lab Report — Renal Panel + BNP', date: '2026-06-19', author: 'HK Sanatorium Lab',
    summary: 'NT-proBNP 2,850 (↓ from 4,200). Cr 102, K⁺ 4.1. Hb 12.1.',
    content: 'HF panel: NT-proBNP trending down on GDMT. Electrolytes stable on Spironolactone + Furosemide. Continue current regimen; repeat in 2 weeks.',
  },
  {
    id: 'LR-002', patient: 'Wong Chi Ming', title: 'Lab Report — COPD Monitoring Panel', date: '2026-06-18', author: 'HK Sanatorium Lab',
    summary: 'WBC 7.8. CRP 8. Eosinophils 180. SpO₂ trend stable on home log.',
    content: 'No active infection markers. Eosinophil count supports ICS/LABA maintenance. Continue current inhaler regimen. Pulmonary function stable.',
  },
  {
    id: 'LR-003', patient: 'Lam Ka Chun', title: 'Lab Report — CAP Follow-up', date: '2026-06-18', author: 'Gleneagles Lab',
    summary: 'WBC 9.2 (↓ from 14.5). CRP 18 (↓ from 86). Procalcitonin 0.1.',
    content: 'Inflammatory markers improving on Levofloxacin Day 3. Blood cultures negative. Sputum C&S: H. influenzae — sensitive to fluoroquinolone. Continue 7-day course.',
  },
  {
    id: 'LR-004', patient: 'Lau Suk Yee', title: 'Lab Report — Renal + UTI Panel', date: '2026-06-19', author: 'HK Sanatorium Lab',
    summary: 'eGFR 47. UACR 275. K⁺ 4.3. Urine culture: E. coli, ESBL negative.',
    content: 'CKD Stage 3 stable. UTI organism sensitive to Ciprofloxacin. Phosphate 1.42 — dietary counseling reinforced. Repeat renal panel in 4 weeks.',
  },
  {
    id: 'LR-005', patient: 'Ho Tai Wai', title: 'Lab Report — Infection + Glycemic Panel', date: '2026-06-19', author: 'Queen Mary Lab',
    summary: 'CRP 42 (↓ from 98). WBC 10.1. CBG 8.2. Wound swab: Strep pyogenes.',
    content: 'Cellulitis responding to Clindamycin. CBG mildly elevated — Metformin continued. Wound culture guides oral antibiotic completion. Repeat CRP in 48h.',
  },
  {
    id: 'LR-006', patient: 'Ng Siu Wan', title: 'Lab Report — INR + Coagulation Panel', date: '2026-06-20', author: 'Gleneagles Lab',
    summary: 'INR 2.1 (POCT confirmed). D-dimer 890 (↓ from 3,200). Hb 12.4.',
    content: 'INR therapeutic on Warfarin 5mg QD. No bleeding markers. D-dimer falling — clot resolving. Continue daily INR until stable × 3 days.',
  },
  {
    id: 'LR-007', patient: 'Chan Tai Ming', title: 'Lab Report — Baseline POCT Panel', date: '2026-06-18', author: 'PWH POCT Lab',
    summary: 'CRP 12. PCT 0.05. WBC 9.8. SpO₂ 93% on RA.',
    content: 'Day 1 CAP baseline — low-grade inflammation only. POCT kit on standby for escalation. Blood cultures sent if fever develops. Repeat POCT if SpO₂ <92%.',
  },
];

export const REFERRAL_LETTERS: ClinicalDoc[] = [
  {
    id: 'RL-001', patient: 'Cheung Wai Man', title: 'Referral — Cardiac Rehabilitation (HF)', date: '2026-06-16', author: 'Dr. Chan Chi Keung',
    summary: 'Phase 2 Cardiac Rehab post-ADHF. Exercise prescription with telemetry.',
    content: 'Referring Mr. Cheung Wai Man (78M) for Phase 2 cardiac rehabilitation. Stable on GDMT. Treadmill walking 2.0 km/h × 10 min progressing to 20 min BID. RPE 11–13.',
  },
  {
    id: 'RL-002', patient: 'Wong Chi Ming', title: 'Referral — Pulmonary Rehabilitation Program', date: '2026-06-16', author: 'Dr. Lee Mei Ling',
    summary: 'COPD GOLD 3 pulmonary rehab. 6MWT 310m baseline.',
    content: 'Referring Ms. Wong Chi Ming (74F) for pulmonary rehabilitation. Endurance + breathing retraining. Smoking cessation maintained × 4 years.',
  },
  {
    id: 'RL-003', patient: 'Lam Ka Chun', title: 'Referral — Infectious Disease Follow-up', date: '2026-06-17', author: 'Dr. Cheung Kwok Wai',
    summary: 'CAP Day 7 review. Penicillin allergy documented. Oral switch assessment.',
    content: 'Referring Mr. Lam Ka Chun (45M) for ID clinic follow-up post-CAP. Levofloxacin course completing Day 7. Assess need for repeat CXR if symptoms persist.',
  },
  {
    id: 'RL-004', patient: 'Lau Suk Yee', title: 'Referral — Renal Dietitian Consultation', date: '2026-06-17', author: 'Dr. Chan Chi Keung',
    summary: 'CKD Stage 3 dietary counseling. Phosphate borderline.',
    content: 'Referring Ms. Lau Suk Yee (81F) for renal dietitian consultation. Low phosphate + low sodium diet. Practical meal planning for traditional Chinese diet.',
  },
  {
    id: 'RL-005', patient: 'Ng Siu Wan', title: 'Referral — Anticoagulation Clinic', date: '2026-06-18', author: 'Dr. Cheung Kwok Wai',
    summary: 'Warfarin maintenance after DVT. Target INR 2.0–3.0.',
    content: 'Referring Ms. Ng Siu Wan (67F) for anticoagulation clinic after HaH transition. Warfarin 5mg QD current dose. Thrombophilia screen if recurrent.',
  },
  {
    id: 'RL-006', patient: 'Chan Tai Ming', title: 'Referral — Respiratory Clinic Follow-up', date: '2026-06-18', author: 'Dr. Lee Mei Ling',
    summary: 'COPD GOLD 2 + CAP. Review post-HaH at 2 weeks.',
    content: 'Referring Mr. Chan Tai Ming (82M) for respiratory clinic 2026-07-09. COPD action plan update + CAP resolution assessment. Oral antibiotic switch planning Day 7–10.',
  },
];

import { syncAiSummaryNews } from '../utils/medicalHistoryNews';
import { PATIENTS_FULL } from './patients';

const PATIENT_NAME_TO_ID = Object.fromEntries(PATIENTS_FULL.map(p => [p.name, p.id]));

function syncClinicalDocNews(docs: ClinicalDoc[]) {
  for (const doc of docs) {
    const patientId = PATIENT_NAME_TO_ID[doc.patient];
    const patient = PATIENTS_FULL.find(p => p.id === patientId);
    if (!patient) continue;
    doc.summary = syncAiSummaryNews(patientId, patient.diagnosis, doc.summary);
    doc.content = syncAiSummaryNews(patientId, patient.diagnosis, doc.content);
  }
}

syncClinicalDocNews(DISCHARGE_SUMMARIES);
syncClinicalDocNews(PROGRESS_NOTES);
syncClinicalDocNews(LAB_REPORTS);
syncClinicalDocNews(REFERRAL_LETTERS);
