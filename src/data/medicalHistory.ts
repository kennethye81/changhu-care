// === Medical History — 6 HaH Patients (NICE HaH + HK HA Protocols) ===

export interface HistoryEntry {
  date: string;
  type: 'outpatient' | 'admission' | 'er' | 'surgery' | 'followup' | 'discharge';
  facility: string;
  department: string;
  physician: string;
  chiefComplaint: string;
  diagnosis: string;
  labs?: string;
  imaging?: string;
  prescriptions?: string;
  procedures?: string;
  notes: string;
}

export interface PatientHistory {
  patientId: number;
  entries: HistoryEntry[];
  aiSummary: string;
}

export const MEDICAL_HISTORY: Record<number, PatientHistory> = {};

// ═══════════════════════════════════════════════════════════
// PATIENT 1 — CHEUNG WAI MAN — CHF NYHA III
// ═══════════════════════════════════════════════════════════
MEDICAL_HISTORY[1] = {
  patientId: 1,
  entries: [
    {
      date: '2026-06-18', type: 'discharge', facility: 'HK Sanatorium & Hospital', department: 'Cardiology',
      physician: 'Dr. Chan Chi Keung', chiefComplaint: 'ADHF — stabilised for HaH discharge',
      diagnosis: 'Acute Decompensated Heart Failure (NYHA III→IV); Ischaemic Cardiomyopathy (LVEF 30%); Permanent AF; CKD Stage 3 (eGFR 42); T2DM',
      labs: 'BNP 850 (↓ from 2,200), Cr 138, eGFR 42, K⁺ 3.9, Hb 11.2, HbA1c 7.4%',
      imaging: 'ECHO: LVEF 30%, dilated LV, moderate MR, LA enlargement. CXR: pulmonary congestion improved.',
      prescriptions: 'Sacubitril/Valsartan 97/103mg BID, Bisoprolol 5mg qd, Furosemide 40mg BID, Spironolactone 25mg qd, Apixaban 5mg BID, Metformin 500mg BID',
      procedures: 'IV Furosemide 80mg bolus → 10mg/h infusion. Net negative 3.2L in 48h.',
      notes: 'Decompensation triggered by dietary indiscretion (high-sodium meal) + missed Furosemide doses. Responded to IV diuresis. Weight from 69.9→68.0kg. Pedal oedema improved 3+→1+. Discharged home with daily HaH RN visits. GP followed up. Fluid restriction 1.5L/day, Na <2g/day.',
    },
    {
      date: '2026-06-14', type: 'admission', facility: 'HK Sanatorium & Hospital', department: 'Cardiology',
      physician: 'Dr. Chan Chi Keung', chiefComplaint: 'Progressive dyspnoea, orthopnoea, bilateral leg swelling × 5 days',
      diagnosis: 'Acute Decompensated Heart Failure (NYHA III→IV); AF with RVR; Acute-on-Chronic Kidney Injury',
      labs: 'BNP 2,200, Troponin I 0.06, K⁺ 5.1, Cr 188, eGFR 28. CXR: pulmonary oedema, pleural effusions.',
      imaging: 'ECHO: LVEF 30% (no change from prior). CXR: bilateral pulmonary oedema, small bilateral pleural effusions.',
      prescriptions: 'IV Furosemide 80mg bolus → 10mg/h infusion. O₂ 4L NC. Bisoprolol uptitrated.',
      notes: 'Decompensation triggered by dietary indiscretion + missed Furosemide × 2 days. AF with RVR on admission. Renal function acutely worsened (Cr 138→188) — likely pre-renal from congestion. Responded to IV diuresis: net -3.2L/48h. Renal function improving with decongestion.',
    },
    {
      date: '2026-01-10', type: 'outpatient', facility: 'HK Sanatorium & Hospital', department: 'Cardiology Clinic',
      physician: 'Dr. Chan Chi Keung', chiefComplaint: 'HF follow-up — mild DOE, stable weight',
      diagnosis: 'Heart Failure NYHA II-III; Ischaemic Cardiomyopathy (inferior MI 2023); AF; CKD Stage 3',
      labs: 'BNP 420, Cr 130, K⁺ 4.2. INR 2.1 (on Warfarin→switched to Apixaban). HbA1c 7.1%.',
      imaging: 'ECHO: LVEF 30% — no change from 6 months ago.',
      prescriptions: 'Sacubitril/Valsartan uptitrated 49/51→97/103mg BID. Warfarin→Apixaban 5mg BID. Furosemide 40mg qd→BID.',
      notes: 'Stable NYHA II-III. Entresto well-tolerated. Switched to Apixaban for convenience (no INR monitoring). HF nurse referred for home monitoring. T2DM control acceptable (HbA1c 7.1%).',
    },
    {
      date: '2023-08-22', type: 'admission', facility: 'United Christian Hospital', department: 'Cardiology',
      physician: 'Dr. Lee Chi Wai', chiefComplaint: 'Severe chest pain + diaphoresis — inferior STEMI',
      diagnosis: 'Inferior STEMI; Complete Heart Block (transient); HF with reduced EF (post-MI)',
      labs: 'Troponin I 45.6 (peak), CK-MB 128. K⁺ 4.0, Cr 95.',
      imaging: 'ECG: ST elevation II, III, aVF. Coronary Angiogram: 100% proximal RCA occlusion.',
      prescriptions: 'Loading: Aspirin 300mg + Ticagrelor 180mg. Post-PCI: Aspirin 100mg qd, Ticagrelor 90mg BID, Bisoprolol 2.5mg qd, Ramipril 2.5mg BID.',
      procedures: 'Primary PCI with DES to proximal RCA. Temporary pacing wire for CHB (resolved Day 2).',
      notes: 'Successful PCI. CHB resolved spontaneously. LVEF 35% post-MI on Day 3 ECHO. Discharged Day 8 with GDMT. Cardiac rehab referral placed.',
    },
    {
      date: '2023-02-15', type: 'outpatient', facility: 'Kwun Tong GOPC', department: 'Family Medicine',
      physician: 'Dr. Lam Wai Keung', chiefComplaint: 'Routine check-up — mild HTN, overweight',
      diagnosis: 'Essential HTN (Stage 1, 142/88); Overweight (BMI 27.6); Impaired Fasting Glucose (FPG 6.4 mmol/L)',
      labs: 'FPG 6.4, HbA1c 6.2%, Cr 88, Lipids: TC 5.6, LDL 3.4, HDL 1.0, TG 2.2.',
      imaging: 'ECG: NSR, no LVH. BMI 27.6.',
      prescriptions: 'Lifestyle modifications advised. No medication started at this visit.',
      notes: 'Pre-diabetic range. BP borderline. Advised weight loss, exercise, dietary changes. Follow-up in 6 months. No prior significant medical history.',
    },
  ],
  aiSummary: 'Cheung Wai Man\'s clinical trajectory shows progressive cardiovascular disease from pre-diabetes/HTN (Feb 2023) to inferior STEMI with PCI (Aug 2023) to advanced HFrEF (LVEF 30%) with permanent AF and CKD Stage 3. The rapid progression from pre-diabetes to STEMI within 6 months highlights aggressive underlying atherosclerosis. Recent ADHF hospitalisation (June 2026) triggered by medication non-adherence and dietary indiscretion underscores the critical importance of caregiver support and patient education in HF management. Key AI concerns: 1. NEWS Low (2) — highest HF vigilance in cohort due to advanced HF, recent decompensation, AF, CKD, and T2DM; 2. Weight trend positive (↓1.8kg) but strict I/O monitoring essential; 3. Renal function vulnerable — K⁺ and Cr monitoring with diuretic therapy; 4. GDMT optimisation ongoing — Entresto at target dose, Bisoprolol may be uptitrated if tolerated; 5. Caregiver support crucial for medication adherence, dietary compliance, and daily weight monitoring.',
};

// ═══════════════════════════════════════════════════════════
// PATIENT 2 — WONG CHI MING — COPD GOLD Stage 3
// ═══════════════════════════════════════════════════════════
MEDICAL_HISTORY[2] = {
  patientId: 2,
  entries: [
    {
      date: '2026-06-18', type: 'discharge', facility: 'Queen Mary Hospital', department: 'Respiratory Medicine',
      physician: 'Dr. Lee Mei Ling', chiefComplaint: 'COPD exacerbation — stabilised for HaH discharge',
      diagnosis: 'Acute COPD Exacerbation (infective — H. influenzae); COPD GOLD Stage 3 (FEV₁ 36%); Chronic Hypoxaemia',
      labs: 'ABG: pH 7.37, PaCO₂ 48, PaO₂ 70, HCO₃ 28. CBC: WBC 9.8 (↓ from 14.5). CRP 38 (↓ from 112). Sputum culture: H. influenzae, sensitive to Amoxicillin.',
      imaging: 'CXR: hyperinflation, no new infiltrate. Previous CXR comparison: stable emphysematous changes.',
      prescriptions: 'Stiolto Respimat 2.5/2.5mcg 2 puffs qd, Salbutamol MDI 100mcg prn, Prednisolone 40mg taper (7 days), O₂ 2L/min prn, Perindopril 4mg qd, Atorvastatin 20mg qd',
      notes: 'Exacerbation managed with IV Ceftriaxone × 3 days + Prednisolone. Oral switch to Amoxicillin 500mg TID completed. Steroid taper ongoing. Home O₂ concentrator delivered. Pulmonary rehab enrolled. Discharged to HaH with RN visits 3×/week + PT 2×/week.',
    },
    {
      date: '2026-06-14', type: 'admission', facility: 'Queen Mary Hospital', department: 'Respiratory Medicine',
      physician: 'Dr. Lee Mei Ling', chiefComplaint: 'Acute COPD exacerbation — increased SOB, purulent sputum, wheeze × 3 days',
      diagnosis: 'COPD Exacerbation (infective — H. influenzae); Community-Acquired Pneumonia ruled out',
      labs: 'CRP 112, WBC 14.5. ABG: pH 7.33, PaCO₂ 52, PaO₂ 58 (on RA). Blood cultures: no growth. Sputum: H. influenzae.',
      imaging: 'CXR: hyperinflated lungs, flat diaphragms, no focal infiltrate. CT chest (2025): diffuse centrilobular emphysema.',
      prescriptions: 'IV Ceftriaxone 1g qd × 3 days, Prednisolone 40mg PO qd, O₂ 2L NC, Salbutamol neb q4h prn',
      notes: 'Admitted via ER. SpO₂ 85% on room air → 93% on 2L O₂. IV antibiotics started. Responded well: afebrile by Day 3, sputum clearing. Steroid taper initiated. Suitable for HaH discharge on Day 5.',
    },
    {
      date: '2026-02-01', type: 'admission', facility: 'Prince of Wales Hospital', department: 'Respiratory Medicine',
      physician: 'Dr. Peter Ho', chiefComplaint: 'Acute COPD exacerbation — increased SOB, purulent sputum × 3 days',
      diagnosis: 'COPD Exacerbation (infective); Community-Acquired Pneumonia (right lower lobe)',
      labs: 'CRP 86, WBC 13.2. ABG: pH 7.33, PaCO₂ 55, PaO₂ 58 (RA). Sputum culture: H. influenzae.',
      imaging: 'CXR: RLL consolidation, hyperinflation.',
      prescriptions: 'Ceftriaxone 1g IV qd × 5 days, Prednisolone 40mg × 7 days (taper), Doxycycline 100mg BID × 7 days',
      notes: 'Second exacerbation in 12 months. Admitted via ER. Required IV antibiotics + O₂. Discharged Day 7. Referred to Queen Mary Hospital respiratory clinic for ongoing care (patient relocation to Kowloon).',
    },
    {
      date: '2025-09-18', type: 'outpatient', facility: 'Prince of Wales Hospital', department: 'Respiratory Clinic',
      physician: 'Dr. Peter Ho', chiefComplaint: 'Annual COPD review — stable',
      diagnosis: 'COPD GOLD Stage 3 — FEV₁ 36% predicted, stable',
      labs: 'Spirometry: FEV₁ 36% pred, FVC 58%, FEV₁/FVC 0.47. ABG: compensated respiratory acidosis. 6MWT: 280m.',
      imaging: 'CXR: stable hyperinflation, no new changes.',
      prescriptions: 'Tiotropium 18mcg HandiHaler qd → changed to Stiolto Respimat for better drug delivery',
      notes: 'Upgraded inhaler therapy to Stiolto Respimat. Pulmonary rehab renewed. Smoking cessation maintained × 4 years. Influenza + pneumococcal vaccines updated.',
    },
    {
      date: '2024-05-10', type: 'outpatient', facility: 'Tuen Mun Hospital', department: 'Respiratory Clinic',
      physician: 'Dr. Leung Kwok Ho', chiefComplaint: 'Initial COPD workup — chronic cough, SOB on exertion × 1 year',
      diagnosis: 'COPD GOLD Stage 2 (FEV₁ 52%) — progressing; 40 pack-year smoking history (quit 2020)',
      labs: 'Spirometry: FEV₁ 52%, FEV₁/FVC 0.58. Post-bronchodilator: FEV₁ 55% (+3%).',
      imaging: 'CXR: emphysematous changes, flat diaphragms, increased AP diameter.',
      prescriptions: 'Tiotropium 18mcg HandiHaler qd, Salbutamol MDI prn',
      notes: 'First COPD diagnosis. 40 pack-year history. Referred for smoking cessation (already quit 2020 — maintained). Pulmonary rehab referral. Spirometry shows moderate obstruction with progression over 1 year.',
    },
  ],
  aiSummary: 'Wong Chi Ming has advanced COPD (GOLD Stage 3, FEV₁ 36%) with a significant disease trajectory from initial diagnosis at FEV₁ 52% (2024) to 36% (2025), now stabilised on dual bronchodilator therapy. Two hospitalisations for infective exacerbations in the past 18 months (Feb 2026 with CAP, Jun 2026 without pneumonia). Key risk factors: 40 pack-year smoking history (quit 2020 — maintained 6 years), chronic hypoxaemia (PaO₂ 70), and recurrent H. influenzae infections. AI assessment: 1. Stable currently but exacerbation risk remains — early recognition of increased sputum/dyspnoea critical; 2. SpO₂ at lower threshold of acceptable — daily home oximetry; 3. Pulmonary rehab engagement (2/8 sessions completed) — key to functional improvement; 4. Vaccination status current — influenza/pneumococcal; 5. LTOT assessment pending — may qualify if SpO₂ <88% on exertion. NEWS Low (1) — COPD exacerbation vigilance reflects recent exacerbation history and moderate disease severity. The transition from Prince of Wales Hospital to Queen Mary Hospital care reflects patient relocation to Kowloon.',
};

// ═══════════════════════════════════════════════════════════
// PATIENT 3 — LAM KA CHUN — CAP
// ═══════════════════════════════════════════════════════════
MEDICAL_HISTORY[3] = {
  patientId: 3,
  entries: [
    {
      date: '2026-06-18', type: 'discharge', facility: 'Gleneagles Hospital', department: 'Infectious Disease / Internal Medicine',
      physician: 'Dr. Cheung Kwok Wai', chiefComplaint: 'CAP — stabilised for HaH discharge',
      diagnosis: 'Community-Acquired Pneumonia (RLL) — Streptococcus pneumoniae (penicillin-resistant); CURB-65: 1; Penicillin allergy (anaphylaxis)',
      labs: 'WBC 10.5 (↓ from 16.8), CRP 48 (↓ from 156). Blood cultures: no growth. Sputum: S. pneumoniae (penicillin-resistant).',
      imaging: 'CXR: dense RLL consolidation — resolving. No pleural effusion.',
      prescriptions: 'Levofloxacin 750mg qd (7-day course, 3 days remaining), Paracetamol 1g prn',
      notes: 'IV Levofloxacin × 3 days → oral switch. Clinically improved: afebrile × 48h, SpO₂ 96% RA. Discharged to HaH. Complete 7-day antibiotic course. Penicillin allergy (anaphylaxis) documented prominently. Return to work (remote) anticipated Day 7.',
    },
    {
      date: '2026-06-14', type: 'admission', facility: 'Gleneagles Hospital', department: 'Internal Medicine',
      physician: 'Dr. Cheung Kwok Wai', chiefComplaint: 'Productive cough, fever (Tmax 39.2°C), rigors, pleuritic chest pain × 5 days',
      diagnosis: 'Community-Acquired Pneumonia (RLL), moderate severity; CURB-65: 1; Penicillin allergy (anaphylaxis)',
      labs: 'WBC 16.8, CRP 156, PCT 4.2. Sputum: Gram-positive diplococci. Blood cultures: pending. Renal/LFT normal.',
      imaging: 'CXR: dense RLL consolidation. No pleural effusion.',
      prescriptions: 'IV Levofloxacin 750mg qd (penicillin-allergic patient). Paracetamol 1g prn.',
      notes: 'Moderate CAP. Penicillin allergy precludes beta-lactam therapy. Levofloxacin chosen per IDSA guidelines for penicillin-allergic CAP patients. Afebrile by Day 3. IV→oral switch Day 4. Clinically stable for HaH.',
    },
    {
      date: '2018-07-22', type: 'er', facility: 'Queen Mary Hospital', department: 'Emergency',
      physician: 'Dr. Chan Tai Ming', chiefComplaint: 'Anaphylaxis — airway swelling, urticaria, hypotension after Amoxicillin',
      diagnosis: 'Anaphylactic Reaction to Amoxicillin (Penicillin) — confirmed IgE-mediated',
      labs: 'Tryptase: 24.5 (elevated — confirms anaphylaxis).',
      imaging: 'N/A',
      prescriptions: 'IM Adrenaline 0.5mg, IV Hydrocortisone 200mg, IV Chlorpheniramine 10mg. Discharged with Adrenaline auto-injector (EpiPen) prescription.',
      notes: 'Anaphylaxis within 15 minutes of first Amoxicillin dose for dental infection. Confirmed penicillin allergy — Type I IgE-mediated. All beta-lactams contraindicated. Allergy alert bracelet recommended. Patient educated on avoidance.',
    },
    {
      date: '2018-07-15', type: 'outpatient', facility: 'Gleneagles Hospital', department: 'Dental',
      physician: 'Dr. Wong Siu Ming', chiefComplaint: 'Dental abscess — right lower molar, pain × 3 days',
      diagnosis: 'Periapical Abscess — tooth 46',
      labs: 'N/A',
      imaging: 'Dental XR: periapical radiolucency tooth 46.',
      prescriptions: 'Amoxicillin 500mg TID × 7 days, Paracetamol 1g q6h prn',
      notes: 'Dental abscess requiring antibiotics. Amoxicillin prescribed. Patient had no prior known drug allergies. Anaphylaxis occurred on first dose (see Jul 22 ER visit). Allergy now documented permanently.',
    },
    {
      date: '2023-06-10', type: 'outpatient', facility: 'Gleneagles Hospital', department: 'Health Screening',
      physician: 'Dr. Emily Wong', chiefComplaint: 'Annual health check — no complaints',
      diagnosis: 'Healthy; No chronic conditions; BMI 24; Non-smoker; Moderate alcohol; Active lifestyle',
      labs: 'CBC normal, FPG 5.1, HbA1c 5.2%, Lipids: TC 4.8, LDL 2.6, HDL 1.4, TG 1.1. LFT normal. Cr 78.',
      imaging: 'CXR: clear lung fields, normal heart size. ECG: NSR, normal.',
      prescriptions: 'None.',
      notes: 'Healthy 42-year-old. No chronic conditions. Non-smoker. Jogs 3×/week. Penicillin allergy alert reconfirmed. Up to date on vaccinations. No other significant medical history.',
    },
  ],
  aiSummary: 'Lam Ka Chun is a 45-year-old previously healthy male with community-acquired pneumonia (RLL, S. pneumoniae, penicillin-resistant). CURB-65 1 indicates low mortality risk. The most significant clinical feature is SEVERE PENICILLIN ALLERGY (anaphylaxis, 2018) — this constrains antibiotic choice to non-beta-lactam agents (fluoroquinolone used). No comorbidities, non-smoker, active lifestyle. Expected full recovery within 2 weeks. AI assessment: 1. NEWS Low (0) — young, healthy, single-organ infection, excellent response to treatment; 2. Complete 7-day Levofloxacin course — despite feeling better, full course essential for eradication; 3. Monitor for fluoroquinolone side effects (tendonitis, rare in this age group); 4. Penicillin allergy documentation critical — all future healthcare encounters must flag this; 5. Return to exercise gradual after 2 weeks. Prognosis: excellent.',
};

// ═══════════════════════════════════════════════════════════
// PATIENT 4 — LAU SUK YEE — UTI
// ═══════════════════════════════════════════════════════════
MEDICAL_HISTORY[4] = {
  patientId: 4,
  entries: [
    {
      date: '2026-06-18', type: 'discharge', facility: 'HK Sanatorium & Hospital', department: 'Internal Medicine',
      physician: 'Dr. Chan Chi Keung', chiefComplaint: 'Complicated UTI — stabilised for HaH discharge',
      diagnosis: 'Complicated UTI (E. coli, ESBL-negative); Acute confusional state (resolved); T2DM; CKD Stage 3 (eGFR 48); HTN',
      labs: 'Cr 146, eGFR 48, K⁺ 4.6. Urine culture: E. coli >10⁵ CFU/mL, sensitive to Nitrofurantoin, Cephalexin, Ciprofloxacin. Blood cultures: no growth.',
      imaging: 'Renal US: bilateral medical renal disease, no hydronephrosis.',
      prescriptions: 'Ciprofloxacin 500mg BID (7-day course, 4 days remaining), Losartan 100mg qd, Dapagliflozin 10mg qd, Ferrous Sulfate 325mg qd',
      notes: 'IV Ceftriaxone × 2 days → oral Ciprofloxacin switch. Confusion fully resolved (AMTS 9/10). Afebrile × 36h. Urinary symptoms improving. Discharged to HaH. Complete 7-day antibiotic course. Renal function stable. Monitor for C. difficile.',
    },
    {
      date: '2026-06-15', type: 'admission', facility: 'HK Sanatorium & Hospital', department: 'Internal Medicine',
      physician: 'Dr. Chan Chi Keung', chiefComplaint: 'Dysuria, frequency, suprapubic pain, new-onset confusion × 3 days',
      diagnosis: 'Complicated UTI (E. coli); Acute confusional state (infection-related delirium); T2DM; CKD Stage 3; HTN',
      labs: 'WBC 13.5, CRP 86. Urine: nitrite +, leukocyte esterase 3+, blood 2+. Cr 150, eGFR 46. AMTS 6/10 on admission.',
      imaging: 'Renal US (previous): bilateral medical renal disease, cortical thinning.',
      prescriptions: 'IV Ceftriaxone 1g qd, IV fluids, Ciprofloxacin 500mg BID started Day 3',
      notes: 'Complicated UTI in elderly diabetic patient with CKD. Acute confusion (AMTS 6/10) — likely infection-related delirium. IV antibiotics started. Confusion resolving by Day 3 (AMTS 8/10). IV→oral switch Day 3. Stable for HaH.',
    },
    {
      date: '2026-03-10', type: 'outpatient', facility: 'Tuen Mun Hospital', department: 'Nephrology',
      physician: 'Dr. Wong Kwok Ming', chiefComplaint: 'CKD follow-up — stable',
      diagnosis: 'CKD Stage 3 (eGFR 48); HTN; Anaemia of CKD (mild); T2DM',
      labs: 'Cr 146, eGFR 48, K⁺ 4.8, Hb 10.8, Ferritin 45, TSAT 18%. Urine PCR 0.8. HbA1c 7.2%.',
      imaging: 'Renal US: bilateral medical renal disease, no hydronephrosis, cortical thinning.',
      prescriptions: 'Losartan 100mg qd, Dapagliflozin 10mg qd, Ferrous Sulfate 325mg qd, Atorvastatin 20mg qd',
      notes: 'CKD stable — eGFR decline 2mL/min/year. BP 140/90 at upper target. Iron deficiency anaemia — oral iron continued. Renal diet reviewed. Avoid NSAIDs. Next labs in 3 months.',
    },
    {
      date: '2025-06-05', type: 'outpatient', facility: 'Kwong Wah Hospital', department: 'General Medicine',
      physician: 'Dr. Leung Siu Keung', chiefComplaint: 'New CKD diagnosis — elevated Cr found on routine labs',
      diagnosis: 'CKD Stage 3 (eGFR 50); HTN (long-standing, poorly controlled); Iron Deficiency; T2DM',
      labs: 'Cr 142, eGFR 50, Hb 10.5, Ferritin 22. Urine: protein 1+. HbA1c 7.8%.',
      imaging: 'Renal US: small echogenic kidneys — chronic changes.',
      prescriptions: 'Losartan 50mg qd started, Iron supplements, Metformin 500mg BID',
      notes: 'CKD likely due to long-standing poorly controlled HTN + T2DM. Referred to nephrology. Iron deficiency likely nutritional + CKD-related. Avoid nephrotoxins. Renal diet counselling.',
    },
    {
      date: '2023-09-12', type: 'outpatient', facility: 'Kwun Tong GOPC', department: 'Family Medicine',
      physician: 'Dr. Lam Wai Keung', chiefComplaint: 'Routine DM follow-up — suboptimal control',
      diagnosis: 'Type 2 DM (HbA1c 8.2%); HTN (148/90); Overweight (BMI 28.1)',
      labs: 'HbA1c 8.2%, FPG 7.8, Cr 88, eGFR 68. Lipids: TC 5.8, LDL 3.6.',
      imaging: 'ECG: NSR, no LVH.',
      prescriptions: 'Metformin 500mg BID started, Amlodipine 5mg qd',
      notes: 'DM and HTN both above target. Lifestyle modifications reinforced. Metformin + Amlodipine started. Renal function borderline — monitor. Follow-up in 3 months.',
    },
  ],
  aiSummary: 'Lau Suk Yee is an 81-year-old female with multiple comorbidities (T2DM, CKD Stage 3, HTN, anaemia of CKD) who presented with complicated UTI causing acute confusional state (infection-related delirium). The delirium resolved with antibiotic treatment — a classic presentation in elderly patients where UTI manifests as confusion rather than classic urinary symptoms. CKD Stage 3 (eGFR 48) is stable with slow progression (2mL/min/year). AI assessment: 1. NEWS Low–Medium (3) — driven by age, CKD, DM, and recent delirium; 2. Ciprofloxacin + Losartan interaction — monitor for hypotension; 3. C. difficile risk with fluoroquinolone in elderly — monitor for diarrhoea; 4. Cognitive baseline AMTS 9/10 — return to baseline expected; 5. UTI prevention: hydration, regular voiding, proper hygiene. Prognosis: good recovery expected; CKD management is the long-term priority.',
};

// ═══════════════════════════════════════════════════════════
// PATIENT 5 — HO TAI WAI — Cellulitis
// ═══════════════════════════════════════════════════════════
MEDICAL_HISTORY[5] = {
  patientId: 5,
  entries: [
    {
      date: '2026-06-18', type: 'discharge', facility: 'Queen Mary Hospital', department: 'Internal Medicine',
      physician: 'Dr. Lee Mei Ling', chiefComplaint: 'Cellulitis — stabilised for HaH discharge',
      diagnosis: 'Moderate Cellulitis (Eron Class III) — left lower limb, likely streptococcal; T2DM (HbA1c 7.8%); HTN',
      labs: 'WBC 10.5 (↓ from 14.2), CRP 48 (↓ from 128). Blood cultures: no growth. Wound swab: no growth.',
      imaging: 'No imaging required. Clinical assessment: erythema 15cm diameter (↓ from 25cm), well-demarcated.',
      prescriptions: 'Clindamycin 450mg q6h (9-day course, 5 days remaining), Metformin 500mg BID, Amlodipine 5mg qd',
      notes: 'IV Clindamycin × 2 days → oral switch. Erythema reduced from 25→15cm. Afebrile × 36h. Pain 2/10. Discharged to HaH with daily RN for wound care. Complete 9-day antibiotic course. Leg elevation. Mark erythema margins daily.',
    },
    {
      date: '2026-06-15', type: 'admission', facility: 'Queen Mary Hospital', department: 'Internal Medicine',
      physician: 'Dr. Lee Mei Ling', chiefComplaint: 'Progressive left leg erythema, swelling, warmth, pain × 4 days',
      diagnosis: 'Cellulitis (Eron Class III) — left lower limb; T2DM (HbA1c 7.8%); HTN; Portal of entry: shin abrasion from gardening',
      labs: 'WBC 14.2, CRP 128. Blood cultures: no growth. Wound swab: pending. HbA1c 7.8%.',
      imaging: 'No DVT — Doppler US negative. No gas on XR — necrotising fasciitis ruled out.',
      prescriptions: 'IV Clindamycin 600mg q8h. Paracetamol 1g q6h prn.',
      notes: 'Moderate cellulitis (Eron Class III) with systemic symptoms (Temp 38.4°C, HR 96). Erythema 25cm diameter. No abscess, no tracking. IV Clindamycin started — good response within 48h. DM control suboptimal (HbA1c 7.8%). Wound care education initiated.',
    },
    {
      date: '2025-09-20', type: 'outpatient', facility: 'Kwun Tong GOPC', department: 'Family Medicine',
      physician: 'Dr. Lam Wai Keung', chiefComplaint: 'DM follow-up — suboptimal control',
      diagnosis: 'Type 2 DM (HbA1c 7.8%); HTN (suboptimal); Hyperlipidaemia',
      labs: 'HbA1c 7.8%, FPG 7.2, Cr 90, eGFR 65. Lipids: LDL 3.2.',
      imaging: 'Foot exam: normal sensation, no ulcers. Retinal screen: no retinopathy.',
      prescriptions: 'Metformin increased 500mg→1g BID, Amlodipine 5mg qd, Atorvastatin 20mg qd started',
      notes: 'HbA1c above target. Metformin dose increased. Statin started for primary prevention. Foot care education provided. Lifestyle: reduce refined carbs, increase activity.',
    },
    {
      date: '2024-06-02', type: 'outpatient', facility: 'Kwun Tong GOPC', department: 'Family Medicine',
      physician: 'Dr. Lam Wai Keung', chiefComplaint: 'Routine check-up — elevated glucose',
      diagnosis: 'Type 2 DM (newly diagnosed, HbA1c 7.5%); Pre-HTN (138/86); Overweight (BMI 28.4)',
      labs: 'HbA1c 7.5%, FPG 7.8, Cr 85. Lipids: TC 5.8, LDL 3.8.',
      imaging: 'ECG: normal. BMI 28.4.',
      prescriptions: 'Metformin 500mg BID started',
      notes: 'New DM diagnosis. Overweight. Diabetes education provided. Self-monitoring of blood glucose. Lifestyle modifications. Follow-up in 3 months.',
    },
  ],
  aiSummary: 'Ho Tai Wai is a 72-year-old male with T2DM (HbA1c 7.8% — suboptimal control) and HTN who developed moderate cellulitis (Eron Class III) of the left lower limb following a minor gardening abrasion. The combination of diabetes and age increases risk of skin infections, impaired wound healing, and potential for complications. Significant improvement with IV→oral Clindamycin transition. AI assessment: 1. NEWS Low–Medium (3) — driven by DM, age, and infection severity; 2. Clindamycin q6h dosing — adherence critical for full 9-day course; 3. C. difficile risk — monitor for diarrhoea; 4. DM control needs optimisation — HbA1c 7.8% above target; 5. Diabetic foot care education essential for prevention; 6. Wound healing expected within 14 days — daily monitoring for abscess formation. Prognosis: good with appropriate antibiotic therapy and wound care.',
};

// ═══════════════════════════════════════════════════════════
// PATIENT 6 — NG SIU WAN — DVT
// ═══════════════════════════════════════════════════════════
MEDICAL_HISTORY[6] = {
  patientId: 6,
  entries: [
    {
      date: '2026-06-18', type: 'discharge', facility: 'Gleneagles Hospital', department: 'Internal Medicine',
      physician: 'Dr. Cheung Kwok Wai', chiefComplaint: 'DVT — stabilised for HaH discharge',
      diagnosis: 'Acute Proximal DVT — left femoral + popliteal vein; No PE; HTN; Hyperlipidaemia',
      labs: 'INR 2.1 (therapeutic, target 2.0-3.0). D-dimer: 3,200 (elevated). Cr 78, Hb 13.2. Thrombophilia screen: pending (outpatient).',
      imaging: 'Doppler US: acute non-occlusive thrombus left femoral vein extending to proximal popliteal vein. CTPA: no PE. No iliac vein involvement.',
      prescriptions: 'Warfarin 5mg qd (dose adjusted per INR), Perindopril 4mg qd, Atorvastatin 20mg qd',
      procedures: 'LMWH (Enoxaparin 1mg/kg BID) bridging × 4 days → discontinued. Warfarin 5mg qd started Day 1. INR 2.1 on Day 4 — therapeutic.',
      notes: 'LMWH bridging completed. Warfarin monotherapy — INR 2.1 (target 2.0-3.0). Compression stockings (Class II, 23-32mmHg) fitted. No bleeding. Discharged to HaH with daily INR via POCT. Warfarin education provided. Anticoagulation 3-6 months planned. Follow-up Doppler US at 3 months.',
    },
    {
      date: '2026-06-14', type: 'admission', facility: 'Gleneagles Hospital', department: 'Internal Medicine',
      physician: 'Dr. Cheung Kwok Wai', chiefComplaint: 'Progressive left leg swelling, calf pain, mild erythema × 3 days',
      diagnosis: 'Acute Proximal DVT — left femoral + popliteal vein; Wells Score 3 (moderate probability); No PE',
      labs: 'D-dimer: 3,200 (elevated). CBC: normal. Coagulation: PT 12.8, aPTT 28. CT pulmonary angiogram: no PE.',
      imaging: 'Doppler US: acute non-occlusive thrombus in left femoral vein extending to proximal popliteal vein. No iliac vein involvement. CTPA: no PE.',
      prescriptions: 'LMWH (Enoxaparin 1mg/kg BID) started. Warfarin 5mg qd bridging started Day 1.',
      notes: 'Provoked DVT — no clear provoking factor identified (no recent surgery, trauma, travel, or OCP use). Wells Score 3. D-dimer elevated. Doppler US confirmed proximal DVT. CTPA negative for PE. LMWH + Warfarin bridging initiated. Thrombophilia screen ordered (outpatient).',
    },
    {
      date: '2025-08-15', type: 'outpatient', facility: 'Gleneagles Hospital', department: 'Health Screening',
      physician: 'Dr. Emily Wong', chiefComplaint: 'Annual health check — no complaints',
      diagnosis: 'HTN (Stage 1, 140/86); Hyperlipidaemia (LDL 3.6); Post-menopausal; BMI 25.2',
      labs: 'CBC normal, FPG 5.4, HbA1c 5.3%. Lipids: TC 5.6, LDL 3.6, HDL 1.3, TG 1.8. Cr 72, eGFR 82.',
      imaging: 'CXR: clear. ECG: NSR, normal. Mammogram: normal. Bone density: mild osteopenia L-spine T-score -1.4.',
      prescriptions: 'Perindopril 4mg qd started, Atorvastatin 20mg qd started, Calcium 600mg + Vitamin D 800IU qd',
      notes: 'New HTN and hyperlipidaemia diagnosis. Cardiovascular risk factors identified. ACEi + statin started. Lifestyle modifications. Osteopenia — calcium + vitamin D supplementation. Regular exercise encouraged.',
    },
    {
      date: '2022-03-20', type: 'outpatient', facility: 'Gleneagles Hospital', department: 'Health Screening',
      physician: 'Dr. Emily Wong', chiefComplaint: 'Annual health check — no complaints',
      diagnosis: 'Healthy; Perimenopausal; No chronic conditions; BMI 24.8',
      labs: 'All within normal limits. FPG 5.1, Lipids: TC 4.8, LDL 2.8. Cr 68.',
      imaging: 'CXR: clear. ECG: normal. Mammogram: normal.',
      prescriptions: 'None.',
      notes: 'Healthy 63-year-old. No chronic conditions. Active lifestyle — walks daily. No significant medical history. Family history: father had DVT at age 72 (post-hip surgery). Mother HTN. Advised to maintain active lifestyle.',
    },
  ],
  aiSummary: 'Ng Siu Wan is a 67-year-old female with previously well-controlled HTN and hyperlipidaemia who developed acute proximal DVT (left femoral + popliteal) without clear provoking factor. No PE on CTPA. Family history notable for father\'s DVT at age 72 (post-surgical). Currently on Warfarin (INR 2.1, target 2.0-3.0) with LMWH bridging completed. AI assessment: 1. NEWS Medium (4) — driven by anticoagulation management (bleeding risk, INR instability), potential for thrombus extension, and PE risk; 2. Daily INR monitoring via POCT until stable × 3 days — critical for Warfarin safety; 3. Patient education paramount — Warfarin has narrow therapeutic index, multiple drug/food interactions; 4. Consistent vitamin K intake essential — avoid sudden dietary changes; 5. Compression stockings for post-thrombotic syndrome prevention; 6. Thrombophilia screen pending — may determine duration of anticoagulation (3 months vs indefinite); 7. Family history of DVT — possible genetic predisposition. Prognosis: good with therapeutic anticoagulation; key risk is bleeding or recurrent thrombosis if INR subtherapeutic.',
};

export default MEDICAL_HISTORY;

export const PATIENT_7_HISTORY = {
  patientId: 7,
  events: [
    {
      date: '2026-06-14', type: 'admission', facility: 'Prince of Wales Hospital', department: 'Respiratory Medicine',
      physician: 'Dr. Wong Kwok Ming', chiefComplaint: 'Fever × 3 days, productive cough, increasing dyspnoea',
      diagnosis: 'Community-Acquired Pneumonia (CURB-65: 2 — age + confusion on admission). COPD GOLD Stage 2 exacerbation.',
      labs: 'WBC 15.2, Neutrophils 84%, CRP 156, PCT 3.2. ABG: pH 7.36, PaO₂ 8.2, PaCO₂ 6.8. Sputum culture pending.',
      imaging: 'CXR: right lower lobe consolidation + bibasilar atelectasis. No pleural effusion.',
      prescriptions: 'IV Ceftriaxone 2g QD + IV Azithromycin 500mg QD × 5 days. Salbutamol neb PRN. Prednisolone 40mg PO × 5 days (taper). O₂ 2L/min via NC.',
      notes: 'Admitted via A&E with CAP + COPD exacerbation. Initial confusion (AMTS 6/10) resolved within 24h. Responded well to IV antibiotics — afebrile by Day 3. O₂ weaned to RA by Day 4. CURB-65 downgraded to 1 (age only). Discharge planned Day 6 to HaH for ongoing monitoring. Penicillin allergy (rash) documented — Ceftriaxone chosen due to low cross-reactivity.',
    },
    {
      date: '2025-08-10', type: 'outpatient', facility: 'Prince of Wales Hospital', department: 'Respiratory Clinic',
      physician: 'Dr. Wong Kwok Ming', chiefComplaint: 'Routine COPD follow-up — increased dyspnoea',
      diagnosis: 'COPD GOLD Stage 2 progress review. mMRC 2→3 (deterioration). Exacerbation-free × 12 months prior.',
      labs: 'Spirometry: FEV₁ 55% predicted (stable from 2024 — 57%). FEV₁/FVC 0.62. Post-bronchodilator: FEV₁ 58% (+3%). CAT score: 18 (↑ from 14).',
      imaging: 'CXR: hyperinflation, flattened diaphragms — consistent with COPD. No acute infiltrate.',
      prescriptions: 'Continue Spiriva 18mcg QD. Salbutamol MDI PRN. Pulmonary rehab referral (PWH programme — 8 sessions). Influenza + pneumococcal vaccines updated.',
      notes: 'COPD stable but mild functional decline — mMRC increase likely due to deconditioning. Smoking cessation maintained (quit 2015, 30 pack-year history). Pulmonary rehab programme initiated — 2 sessions/week at PWH. O₂ not required at rest but desaturates on walking 30m → O₂ concentrator on standby for future.',
    },
    {
      date: '2024-03-05', type: 'outpatient', facility: 'Prince of Wales Hospital', department: 'Respiratory Clinic',
      physician: 'Dr. Wong Kwok Ming', chiefComplaint: 'Annual COPD review — no complaints',
      diagnosis: 'COPD GOLD Stage 2 (FEV₁ 55%). Well-controlled. No exacerbations in past 12 months.',
      labs: 'Spirometry: FEV₁ 57% predicted, FEV₁/FVC 0.64. CAT score: 14. mMRC: 2.',
      imaging: 'CXR: hyperinflation, no interval change. No acute findings.',
      prescriptions: 'Spiriva 18mcg QD. Salbutamol MDI PRN. Continue smoking cessation. Annual flu vaccine.',
      notes: 'COPD well-managed. No exacerbations since diagnosis. Adherent to Spiriva. Exercise tolerance: walks 20-30 min/day with one rest stop. No oxygen desaturation at rest. Continue current management.',
    },
    {
      date: '2022-06-18', type: 'outpatient', facility: 'Prince of Wales Hospital', department: 'Respiratory Clinic',
      physician: 'Dr. Wong Kwok Ming', chiefComplaint: 'New patient — dyspnoea on exertion, chronic cough',
      diagnosis: 'COPD diagnosed — GOLD Stage 2. FEV₁ 58% predicted. mMRC 2.',
      labs: 'Spirometry: FEV₁ 58% predicted, FEV₁/FVC 0.64. Post-bronchodilator: FEV₁ 62% (+4%) — positive reversibility. CAT score: 12.',
      imaging: 'CXR: hyperinflated lung fields, flattened diaphragms. No focal lesion. ECG: normal.',
      prescriptions: 'Spiriva 18mcg QD. Salbutamol MDI PRN. Smoking cessation programme (quit 2015 — maintain). Annual flu + pneumococcal vaccines. Pulmonary rehab programme referral.',
      notes: 'COPD GOLD 2 diagnosed on spirometry. Long smoking history (30 pack-years, quit 2015) — likely tobacco-related COPD. No prior hospitalisations for respiratory issues. Good candidate for HaH if needed — strong family support, non-smoker environment. Penicillin allergy noted.',
    },
    {
      date: '2019-04-10', type: 'outpatient', facility: 'Prince of Wales Hospital', department: 'Family Medicine',
      physician: 'Dr. Lam Wai Keung', chiefComplaint: 'Routine check-up — elevated BP',
      diagnosis: 'Hypertension Stage 1 (BP 150/92). Ex-smoker.',
      labs: 'FPG 5.6, HbA1c 5.7% (pre-diabetic). Lipids: TC 5.4, LDL 3.2. Cr 88, eGFR 72. ECG: normal.',
      prescriptions: 'Amlodipine 5mg QD started. Lifestyle: low-salt diet, regular walking.',
      notes: 'New HTN diagnosis. Pre-diabetic — diet and exercise counselling provided. Good baseline health for 75yo. No chronic medications prior.',
    },
    {
      date: '2015-06-01', type: 'outpatient', facility: 'Prince of Wales Hospital', department: 'Smoking Cessation',
      physician: 'Counsellor', chiefComplaint: 'Smoking cessation — quit programme',
      diagnosis: 'Tobacco dependence (30 pack-year). Quit smoking programme completed.',
      labs: 'Exhaled CO at programme completion: 2 ppm (non-smoker range).',
      prescriptions: 'None. Smoking cessation maintained.',
      notes: 'Successful smoking cessation. Quit at age 71 after 50+ years of smoking. Strong family support. Maintains smoke-free home environment.',
    },
  ],
  aiSummary: 'Chan Tai Ming is an 82-year-old male with moderate COPD (GOLD Stage 2, FEV₁ 55%, diagnosed 2022) complicated by recent community-acquired pneumonia (June 2026, CURB-65: 2). Significant history: 30 pack-year smoking (quit 2015), penicillin allergy (rash), HTN (diagnosed 2019, controlled on Amlodipine 5mg). AI assessment: 1. COPD well-controlled prior to June 2026 CAP — no exacerbations in 12 months pre-admission; 2. Post-pneumonia clinical instability is highest risk — elderly COPD after CAP need vigilant NEWS2 monitoring (target NEWS Low 0–2); 3. Infection recurrence risk elevated due to COPD structural lung changes + impaired mucociliary clearance; 4. Penicillin allergy limits empirical antibiotic choices — Ceftriaxone has <1% cross-reactivity, safe for use; 5. Vaccination status current (influenza + pneumococcal); 6. Home environment favourable — wife caregiver, elevator access, non-smoking home; 7. GOLD 2024 recommends: LAMA for maintenance, SABA for rescue, pulmonary rehab for functional status, and prompt recognition/treatment of exacerbations. Prognosis: good with vigilant monitoring — key to avoid recurrent infection is early detection (SpO₂ trend + POCT escalation) rather than waiting for clinical deterioration.',
};


// ═══════════════════════════════════════════════════════════
// PATIENT 7 — CHAN TAI MING
// ═══════════════════════════════════════════════════════════
MEDICAL_HISTORY[7] = {
  patientId: 7,
  entries: PATIENT_7_HISTORY.events,
  aiSummary: PATIENT_7_HISTORY.aiSummary,
};

import { NEW_MEDICAL_HISTORY } from './newPatients/medicalHistory';
Object.assign(MEDICAL_HISTORY, NEW_MEDICAL_HISTORY);

import { syncAiSummaryNews } from '../utils/medicalHistoryNews';
import { PATIENTS_FULL } from './patients';

for (const patient of PATIENTS_FULL) {
  const history = MEDICAL_HISTORY[patient.id];
  if (history?.aiSummary) {
    history.aiSummary = syncAiSummaryNews(patient.id, patient.diagnosis, history.aiSummary);
  }
}
