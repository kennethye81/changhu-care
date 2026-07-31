// === 17 Active HaH Patients — NICE HaH + HA HK Protocols ===
// Hospitals: Queen Mary Hospital (公立), HK Sanatorium & Hospital (私家), Gleneagles Hospital (私家)
// Coverage: Kowloon, Hong Kong Island, New Territories

import { NEW_PATIENTS } from './newPatients/patientRecords';

export interface PatientFull {
  address: string;
  id: number;
  name: string;
  gender: 'M' | 'F';
  age: number;
  diagnosis: string;
  diagnosisCodes: string[];
  allergies: string[];
  physician: string;
  admittingDiagnosis: string;
  clinicalSummary: string;
  wardRounds: { date: string; note: string; physician: string }[];
  carePlan: {
    serviceFrequency: string;
    visitDuration: string;
    goals: string[];
    precautions: string[];
    assignedDoctor: string;
    assignedNurse: string;
    assignedCaseManager: string;
    assignedCareWorker?: string;
    assignedRehabTherapist?: string;
  };
  nursingRecords: { date: string; time: string; note: string; nurse: string; vitals?: string }[];
  medications: { drug: string; dose: string; route: string; frequency: string; purpose: string; startDate: string; status: 'Active' | 'Discontinued' }[];
  iotDevices: { type: string; model: string; serial: string; status: 'Connected' | 'Syncing' | 'Disconnected'; battery: number; parameters: string[]; lastSync: string }[];
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  readmissionRisk: number;
}

const PATIENTS_BASE: PatientFull[] = [
  // ═══════════════════════════════════════════════════════════
  // PATIENT 1 — CHEUNG WAI MAN — CHF NYHA III
  // HK Sanatorium & Hospital (私家) | 九龙区 | Dr. 陈志强
  // ═══════════════════════════════════════════════════════════
  {
    id: 1, address: 'Flat 8B, Block 5, Laguna City, Cha Kwo Ling, Kowloon', name: 'Cheung Wai Man', gender: 'M', age: 78,
    diagnosis: 'Heart Failure NYHA III · CKD Stage 3 · T2DM · Permanent AF',
    diagnosisCodes: ['I50.0', 'I48.91', 'I10', 'N18.3', 'E11.9'],
    allergies: ['ACE Inhibitors (dry cough)'],
    physician: 'Dr. Chan Chi Keung (Cardiologist)',
    admittingDiagnosis: 'Acute Decompensated Heart Failure (ADHF) — NYHA Class III→IV. Ischemic cardiomyopathy (inferior STEMI 2023, LVEF 30%). Permanent Atrial Fibrillation. CKD Stage 3 (eGFR 42). Type 2 DM. Presented with progressive dyspnoea, orthopnoea, bilateral pedal oedema × 5 days. Trigger: dietary indiscretion (high-sodium meal) + missed Furosemide doses. Responded to IV diuresis (net -3.2L in 48h). Stabilised for HaH discharge.',
    clinicalSummary: '78-year-old male with advanced HFrEF (LVEF 30%) post-inferior STEMI, permanent AF, CKD Stage 3, and T2DM. Currently on GDMT: Sacubitril/Valsartan 97/103mg BID, Bisoprolol 5mg qd, Furosemide 40mg BID, Spironolactone 25mg qd, Apixaban 5mg BID. Weight trend: 69.9kg→68.0kg with diuresis. Pedal oedema improved from 3+→1+. JVP not elevated. Daily weight monitoring essential. Fluid restriction 1.5L/day. Sodium <2g/day. BNP 850 (down from 2,200). Cr 138, eGFR 42, K⁺ 3.9. Plan: titrate GDMT as tolerated, strict I/O monitoring, weekly renal panel, cardiac rehab referral.',
    wardRounds: [
      { date: '2026-06-20', note: 'Virtual ward round Day 2 post-discharge. Weight 68.0kg stable. Pedal oedema 1+. No orthopnoea. Breath sounds: fine bibasilar crackles improving. JVP 3cm. BNP 850 ↓ from 2,200. Renal function stable (Cr 138, K⁺ 3.9). Continue current regimen. Strict I/O. Recheck renal panel in 48h. Wife reports good compliance with fluid restriction.', physician: 'Dr. Chan Chi Keung' },
      { date: '2026-06-18', note: 'Discharge assessment for HaH enrolment. Weight 69.0kg (↓3.2kg from admission). Oedema 1+. SpO₂ 95% on room air. HR 78 (AF, rate-controlled). BP 118/72. GDMT: Sacubitril/Valsartan 97/103mg BID, Bisoprolol 5mg qd, Furosemide 40mg BID, Spironolactone 25mg qd, Apixaban 5mg BID. Metformin 500mg BID for T2DM. Discharge criteria met: decongested, stable renal function, oral diuretic responsive. HaH with daily RN visits + teleconsult q48h.', physician: 'Dr. Chan Chi Keung' },
    ],
    carePlan: {
      serviceFrequency: 'RN BID (AM 08:00 + PM 16:00), 2.5h/visit = 5h/day (Mon-Sat), Teleconsult q48h',
      visitDuration: '2.5 hours per visit × 2/day (5h total)',
      goals: [
        'Achieve dry weight 67-68kg via IV diuresis — net negative >500mL/24h',
        'IV Furosemide 60mg BID → transition to PO 40mg BID when weight stable ×3 days',
        'No hospital readmission for HF decompensation × 6 months',
        'SpO₂ >92% at rest on room air',
        'Orthostatic BP stable — no drop >20mmHg systolic',
        'Renal panel + K⁺ q48h — Cr target <150, K⁺ 3.5-5.0',
        'BNP <500 by Week 4',
        'Patient/caregiver demonstrates daily weight log + fluid restriction + IV site assessment'
      ],
      precautions: [
        'IV Furosemide 60mg in 50mL NS over 15min BID — monitor BP pre/post infusion',
        'Daily weight — report gain >1kg/24h or >2kg/72h immediately',
        'Fluid restriction 1.5L/day — use measured water bottle',
        'Low sodium diet <2g/day — no added salt, avoid processed foods',
        'Monitor for orthostatic hypotension (BP drop >20mmHg systolic) — check pre-ambulation',
        'Fall risk HIGH — assess daily (Morse Fall Scale), assist with all ambulation during IV therapy',
        'Renal function + K⁺ monitoring q48h (Monday/Wednesday/Friday)',
        'IV site assessment qshift — rotate every 72h per HK HA IV Therapy Guideline',
        'AF rate control — report HR >110 or <50',
        'Escalation criteria: SpO₂ <90%, RR >25, new confusion, weight gain >2kg/24h, chest pain, IV site phlebitis → call 999'
      ],
      assignedDoctor: 'Dr. Chan Chi Keung (Cardiology)',
      assignedNurse: 'Sarah Leung (RN)',
      assignedCaseManager: 'Peter Ho (Case Manager)',
      assignedRehabTherapist: 'David Chan (PT)',
      assignedCareWorker: 'Lisa Cheng',
    },

    medications: [
      { drug: 'Furosemide (Lasix) — IV', dose: '60mg in 50mL NS', route: 'IV over 15min', frequency: 'Twice daily (AM 08:00 + PM 16:00)', purpose: 'IV loop diuretic — aggressive decongestion, transition to PO when dry weight achieved', startDate: '2026-06-19', status: 'Active' },
      { drug: 'Sacubitril/Valsartan (Entresto)', dose: '97/103mg', route: 'PO', frequency: 'Twice daily (AM + PM)', purpose: 'ARNI — HFrEF GDMT, mortality reduction', startDate: '2026-01-10', status: 'Active' },
      { drug: 'Bisoprolol', dose: '5mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'Beta-blocker — HFrEF, AF rate control', startDate: '2026-01-10', status: 'Active' },
      { drug: 'Spironolactone', dose: '25mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'MRA — HFrEF GDMT, K⁺-sparing', startDate: '2026-01-10', status: 'Active' },
      { drug: 'Apixaban (Eliquis)', dose: '5mg', route: 'PO', frequency: 'Twice daily (AM + PM)', purpose: 'DOAC — stroke prevention in AF', startDate: '2026-01-10', status: 'Active' },
      { drug: 'Metformin', dose: '500mg', route: 'PO', frequency: 'Twice daily (AM + PM)', purpose: 'Type 2 DM — glycaemic control', startDate: '2024-01-15', status: 'Active' },
    ],
    iotDevices: [
      { type: 'Smart IV Infusion Pump', model: 'Baxter Sigma Spectrum IQ', serial: 'IV-2026-00801', status: 'Connected', battery: 100, parameters: ['Infusion Rate (mL/h)', 'Volume Delivered', 'Air-in-Line Detection', 'Occlusion Alarm', 'Dose Error Reduction'], lastSync: '5 sec ago' },
      { type: 'Urine Output Monitor', model: 'FoleyConnect UO-200', serial: 'UO-2026-00103', status: 'Connected', battery: 95, parameters: ['Urine Output (mL/h)', '24h Total', 'Temperature', 'Specific Gravity'], lastSync: '1 min ago' },
      { type: 'Blood Pressure Monitor', model: 'Omron HEM-7361T', serial: 'BP-2026-93001', status: 'Connected', battery: 92, parameters: ['Systolic', 'Diastolic', 'Pulse Rate', 'Irregular HB Detection', 'AFib Screening'], lastSync: '30 sec ago' },
      { type: 'Smart Weight Scale', model: 'Omron HN-290T', serial: 'WS-2026-00101', status: 'Connected', battery: 95, parameters: ['Weight (kg)', 'BMI', 'Body Fat %'], lastSync: '1 min ago' },
      { type: 'mmWave Radar Mattress', model: 'SenseLife Pro', serial: 'SL-2026-00178', status: 'Syncing', battery: 100, parameters: ['Respiratory Rate', 'Sleep Duration', 'Sleep Stages', 'Bed Exit Alerts', 'Heart Rate Variability'], lastSync: '5 sec ago' },
    ],
    nursingRecords: [
      { date: '2026-06-20', time: '08:00', note: 'AM visit — IV Furosemide Day 2. Pre-infusion vitals: BP 118/72, HR 82 AF, SpO₂ 95%, RR 18, Temp 36.6. Weight 68.0kg (↓0.5kg from yesterday). Pedal oedema: trace. Breath sounds: clear bases. IV site L) forearm: no signs of phlebitis, patent, flushes easily. Furosemide 60mg in 50mL NS infused over 15min per Baxter pump — no adverse reactions. Post-infusion BP 112/70 (orthostatic check: lying 118/72 → standing 110/68 — 8mmHg drop, no symptoms). I/O review: 24h intake 1,380mL, output 1,850mL (incl. diuretic response) — net -470mL. Renal panel: Cr 135, K⁺ 4.0. AM PO meds (Sacubitril/Valsartan, Bisoprolol, Spironolactone, Apixaban) administered. Wife reports good night — orthopnoea absent, slept 7.2h. UO monitor: 320mL since 06:00 — brisk diuresis.', nurse: 'Sarah Leung', vitals: 'Pre-IV BP 118/72 | Post-IV BP 112/70 | HR 82 | SpO₂ 95% | Weight 68.0kg | Net -470mL' },
      { date: '2026-06-20', time: '16:00', note: 'PM visit — IV Furosemide Day 2. Pre-infusion vitals: BP 114/70, HR 80 AF, SpO₂ 95%, RR 16. Weight 67.8kg (further ↓0.2kg — total -0.7kg today). Pedal oedema: resolved. Lungs clear. IV site: clean, no redness. Furosemide 60mg IV over 15min — tolerated. Post-infusion BP 108/66 (orthostatic: 114→104 sitting→standing — 10mmHg, patient steady with assistance). UO monitor: 540mL since AM (total 860mL today). PO meds: Apixaban + Metformin PM confirmed. Wife recorded I/O accurately — praised for diligence. Fall risk discussed — recliner chair repositioned. Evening care worker (Lisa Cheng) will stay until 20:00. Overnight: leg elevation, call button within reach. Next AM visit: 08:00 tomorrow.', nurse: 'Sarah Leung', vitals: 'Pre-IV BP 114/70 | Post-IV BP 108/66 | HR 80 | SpO₂ 95% | Weight 67.8kg | UO 860mL/24h' },
      { date: '2026-06-19', time: '08:30', note: 'AM visit — IV Furosemide Day 1 (initiation). Weight 68.5kg. Pre-IV BP 122/76, HR 78 AF, SpO₂ 94%, RR 20. Pedal oedema 1+. IV access established: 22G in L) forearm — good blood return. Furosemide 60mg IVPB over 15min per Baxter pump protocol. Post-IV BP 118/72 — 4mmHg drop, no symptoms. Medication reconciliation: all 6 drugs confirmed. Wife present — trained on IV site monitoring (redness, swelling, pain = call RN). UO monitor connected — baseline output established. Fluid restriction education reinforced (1.5L max). Orthostatic precautions taught.', nurse: 'Sarah Leung', vitals: 'Pre-IV BP 122/76 | Post-IV BP 118/72 | HR 78 | SpO₂ 94% | Weight 68.5kg' },
      { date: '2026-06-19', time: '16:30', note: 'PM visit — IV Furosemide Day 1. Weight 68.2kg (↓0.3kg from AM). Pre-IV BP 116/72, HR 76 AF. IV site patent, no phlebitis. Furosemide 60mg IV over 15min. Post-IV BP 112/70. UO monitor: 420mL since AM. PO meds given — Apixaban PM + Metformin PM. Wife demonstrated correct IV site check technique. Home environment: recliner chair with pillows for leg elevation set up. Fall precautions: non-slip socks, clear pathways.', nurse: 'Sarah Leung', vitals: 'Pre-IV BP 116/72 | Post-IV BP 112/70 | HR 76 | SpO₂ 94% | Weight 68.2kg | UO 420mL' },
    ],
    riskLevel: 'High', readmissionRisk: 28,
  },

  // ═══════════════════════════════════════════════════════════
  // PATIENT 2 — WONG CHI MING — COPD GOLD Stage 3
  // Queen Mary Hospital (公立) | 九龙区 | Dr. 李美玲
  // ═══════════════════════════════════════════════════════════
  {
    id: 2, address: 'Room 1805, Block 2, Whampoa Garden, Hung Hom, Kowloon', name: 'Wong Chi Ming', gender: 'F', age: 74,
    diagnosis: 'COPD GOLD Stage 3 · HTN · Hyperlipidaemia',
    diagnosisCodes: ['J44.9', 'I10', 'E78.5'],
    allergies: ['Sulfa drugs (rash)'],
    physician: 'Dr. Lee Mei Ling (Respiratory Physician)',
    admittingDiagnosis: 'Acute COPD exacerbation (infective). COPD GOLD Stage 3 (FEV₁ 36% predicted, post-bronchodilator). Chronic hypoxaemia. 40 pack-year smoking history (quit 2020). 2 exacerbations in past 12 months requiring hospitalisation. Presented with increased dyspnoea, purulent sputum, wheeze × 3 days. SpO₂ 85% on room air. CXR: hyperinflation, no new infiltrate. Sputum culture: H. influenzae. Treated with IV Ceftriaxone + oral Prednisolone 40mg taper. Stabilised for HaH discharge on Day 5.',
    clinicalSummary: '74-year-old female with advanced COPD (GOLD Stage 3, FEV₁ 36%) with chronic hypoxaemia. Current therapy: LAMA/LABA (Tiotropium/Olodaterol Stiolto Respimat 2.5/2.5mcg 2 puffs qd), SABA (Salbutamol MDI 100mcg prn), home O₂ at 2L/min prn when SpO₂ <90%. Baseline SpO₂ 92-94% on room air, desaturates to 88-89% on exertion. 6MWT: 280m. LTOT assessment pending. Pulmonary rehab: recently enrolled, 2 sessions completed. Smoking cessation maintained × 6 years. Exacerbation action plan in place. COPD Assessment Test (CAT) score: 22. mMRC Dyspnoea Scale: Grade 3.',
    wardRounds: [
      { date: '2026-06-20', note: 'Virtual ward round Day 2. SpO₂ 93% at rest, 89% after 50m walk. RR 20. Breath sounds: decreased bilaterally, mild expiratory wheeze — improved. No increase in sputum purulence. CAT score 22. Inhaler technique reviewed — correct Respimat use. Pulmonary rehab PT visited yesterday — light breathing exercises tolerated. Continue O₂ prn. Prednisolone taper: 20mg today → 10mg tomorrow → stop. Recheck SpO₂ on exertion in 3 days.', physician: 'Dr. Lee Mei Ling' },
      { date: '2026-06-18', note: 'Discharge assessment for HaH. SpO₂ 94% on room air at rest. ABG: pH 7.37, PaCO₂ 48, PaO₂ 70, HCO₃ 28. CXR: hyperinflation, no infiltrate. FEV₁ 36% (stable). Discharge criteria met: no hypoxia at rest, oral antibiotics completed, steroid taper ongoing. HaH plan: RN visits 3×/week, PT 2×/week (pulmonary rehab), teleconsult q48h. Home O₂ concentrator delivered and tested. Exacerbation action plan reviewed with patient and daughter.', physician: 'Dr. Lee Mei Ling' },
    ],
    carePlan: {
      serviceFrequency: 'RN 3x/week (Mon/Wed/Fri), PT 2x/week (Tue/Thu), Teleconsult q48h',
      visitDuration: '45 minutes',
      goals: [
        'SpO₂ >90% at rest on room air',
        'Increase 6MWT distance by 30m in 4 weeks',
        'No COPD exacerbations requiring hospitalisation x 6 months',
        'Inhaler technique maintained (correct Respimat use)',
        'Smoking abstinence maintained',
        'CAT score <18 by Week 4',
        'Complete 8-session pulmonary rehab programme',
        'Patient/caregiver demonstrates correct O₂ therapy use + safety'
      ],
      precautions: [
        'Monitor SpO₂ during all activity — stop if <88%',
        'Avoid respiratory irritants (smoke, strong perfumes, cleaning chemicals)',
        'Home O₂ safety: no smoking, no open flames, secure cylinder',
        'Pursed-lip breathing during exertion',
        'Annual influenza + pneumococcal vaccines',
        'Escalation criteria: SpO₂ <88% despite O₂, increased sputum purulence, new confusion, RR >30 → call 999',
        'Prednisolone taper: complete course — do not stop abruptly'
      ],
      assignedDoctor: 'Dr. Lee Mei Ling (Respiratory Medicine)',
      assignedNurse: 'Jenny Tam (RN)',
      assignedCaseManager: 'Grace Tang (Case Manager)',
      assignedRehabTherapist: 'Raymond Wong (PT)',
      assignedCareWorker: 'Carol Ng',
    },
    nursingRecords: [
      { date: '2026-06-20', time: '10:00', note: 'COPD visit Day 2. SpO₂ 93% at rest, RR 18. Breath sounds: decreased bilaterally, mild expiratory wheeze — improving. No increase in sputum. CAT score 22. Inhaler technique: correct Respimat use confirmed. Prednisolone 20mg taken (taper day 3 of 7). O₂ concentrator functioning — flow rate 2L/min verified. Daughter (primary caregiver) present — demonstrated correct O₂ setup and safety. Encouraged pursed-lip breathing during activity. PT session scheduled for tomorrow.', nurse: 'Jenny Tam', vitals: 'SpO₂ 93% | RR 18 | HR 86 | BP 134/80 | Temp 36.5' },
      { date: '2026-06-19', time: '11:00', note: 'Initial HaH home visit Day 1. SpO₂ 92% at rest, RR 20. Breath sounds: decreased bilaterally, scattered expiratory wheeze. Sputum: mucoid, small amount. Home O₂ concentrator delivered and tested — flow rate 2L/min verified. Medication reconciliation: Stiolto Respimat + Salbutamol MDI confirmed. Prednisolone taper day 2 — 30mg taken. Home environment: 18th floor, lift access. Daughter lives nearby — visits daily. O₂ safety education completed. Exacerbation action plan posted on fridge.', nurse: 'Jenny Tam', vitals: 'SpO₂ 92% | RR 20 | HR 90 | BP 138/84 | Temp 36.8' },
    ],
    medications: [
      { drug: 'Tiotropium/Olodaterol (Stiolto Respimat)', dose: '2.5/2.5mcg', route: 'Inhalation', frequency: '2 puffs once daily (AM)', purpose: 'LAMA/LABA — bronchodilation, COPD maintenance', startDate: '2025-09-18', status: 'Active' },
      { drug: 'Salbutamol (Ventolin MDI)', dose: '100mcg', route: 'Inhalation', frequency: 'PRN q4-6h for dyspnoea (max 8 puffs/day)', purpose: 'SABA — rescue bronchodilator', startDate: '2024-03-12', status: 'Active' },
      { drug: 'Prednisolone', dose: '40mg → 20mg → 10mg → stop', route: 'PO', frequency: 'Once daily (AM) — tapering course (7 days)', purpose: 'Systemic corticosteroid — acute exacerbation', startDate: '2026-06-16', status: 'Active' },
      { drug: 'Oxygen Therapy', dose: '2L/min', route: 'Nasal cannula', frequency: 'PRN when SpO₂ <90%', purpose: 'Long-term oxygen therapy (LTOT assessment pending)', startDate: '2025-06-01', status: 'Active' },
      { drug: 'Perindopril', dose: '4mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'ACE inhibitor — HTN', startDate: '2024-06-01', status: 'Active' },
      { drug: 'Atorvastatin', dose: '20mg', route: 'PO', frequency: 'Once daily (PM)', purpose: 'Statin — hyperlipidaemia', startDate: '2024-06-01', status: 'Active' },
    ],
    iotDevices: [
      { type: 'Pulse Oximeter', model: 'Nonin Bluetooth 3230', serial: 'SP-2026-00089', status: 'Connected', battery: 75, parameters: ['SpO₂ (continuous)', 'HR', 'Perfusion Index'], lastSync: '10 sec ago' },
      { type: 'Blood Pressure Monitor', model: 'Omron HEM-7361T', serial: 'BP-2026-93002', status: 'Connected', battery: 92, parameters: ['Systolic', 'Diastolic', 'Pulse Rate', 'Irregular HB Detection', 'AFib Screening'], lastSync: '30 sec ago' },
    ],
    riskLevel: 'High', readmissionRisk: 22,
  },

  // ═══════════════════════════════════════════════════════════
  // PATIENT 3 — LAM KA CHUN — Community-Acquired Pneumonia
  // Gleneagles Hospital (私家) | 九龙区 | Dr. 张国伟
  // Penicillin allergy | 45yr Male (younger demo diversity)
  // ═══════════════════════════════════════════════════════════
  {
    id: 3, address: 'Flat 22C, Block 6, Mei Foo Sun Chuen, Lai Chi Kok, Kowloon', name: 'Lam Ka Chun', gender: 'M', age: 45,
    diagnosis: 'Community-Acquired Pneumonia (CAP)',
    diagnosisCodes: ['J18.9', 'J15.7', 'Z88.0'],
    allergies: ['Penicillin (anaphylaxis — airway swelling, urticaria, 2018)'],
    physician: 'Dr. Cheung Kwok Wai (Infectious Disease / Internal Medicine)',
    admittingDiagnosis: 'Moderate-severity Community-Acquired Pneumonia (CAP), right lower lobe. CURB-65 score: 1 (age 45, no confusion, BUN normal, RR 24, BP 118/72). 5-day history of productive cough with green sputum, fever (Tmax 39.2°C), rigors, pleuritic chest pain, and malaise. CXR: dense RLL consolidation. Sputum culture: Streptococcus pneumoniae (penicillin-resistant). Blood cultures: no growth. Treated with IV Levofloxacin 750mg qd × 3 days, then transitioned to oral Levofloxacin for completion. Clinically improved: afebrile × 48h, SpO₂ 96% on room air, WBC normalising. Suitable for HaH with IV→oral switch completed.',
    clinicalSummary: '45-year-old male with moderate CAP (RLL), CURB-65 1. Notable for severe penicillin allergy (anaphylaxis, 2018) — all beta-lactams contraindicated. Treated with Levofloxacin (respiratory fluoroquinolone) per IDSA CAP guidelines for penicillin-allergic patients. Afebrile × 48h. SpO₂ 96% on room air. WBC 10.2 (↓ from 16.8). CRP 28 (↓ from 156). CXR showing resolving RLL consolidation. Plan: complete 7-day Levofloxacin course (3 days remaining), monitor for clinical deterioration, repeat CXR at Week 4. No significant comorbidities. Non-smoker. BMI 24. Active lifestyle (jogs 3×/week). Expected full recovery within 2 weeks.',
    wardRounds: [
      { date: '2026-06-20', note: 'Virtual ward round Day 2. Afebrile × 72h (Temp 36.8). SpO₂ 97% on room air. RR 16. Cough: dry, occasional — much improved. Appetite returning. Levofloxacin Day 5 of 7 — no GI side effects. WBC 10.2 (↓ from 16.8), CRP 28 (↓ from 156). Plan: complete 2 more days Levofloxacin. Return to work (desk job) from home Day 7. Gradual return to exercise after 2 weeks. Repeat CXR in 4 weeks. No further IV needed.', physician: 'Dr. Cheung Kwok Wai' },
      { date: '2026-06-18', note: 'Discharge assessment for HaH. Afebrile × 48h. SpO₂ 96% on room air. RR 18. CXR: resolving RLL consolidation. IV Levofloxacin Day 3 → oral switch (bioequivalent). Discharge criteria met: clinically stable, oral antibiotics tolerated, no hypoxia, no complicated pleural effusion. HaH plan: RN visits every other day × 3 visits, teleconsult Day 3. Complete 7-day antibiotic course. Return precautions: fever recurrence, increased dyspnoea, purulent sputum → return to hospital.', physician: 'Dr. Cheung Kwok Wai' },
    ],
    carePlan: {
      serviceFrequency: 'RN visits q2d (Day 1/3/5), Teleconsult Day 3, Discharge assessment Day 7',
      visitDuration: '30 minutes',
      goals: [
        'Complete 7-day Levofloxacin course without interruption',
        'Afebrile throughout HaH period',
        'SpO₂ >95% on room air',
        'Cough resolved by Day 7',
        'Return to work (remote) by Day 7',
        'CRP <10 by Day 7',
        'Gradual return to exercise by Week 3',
        'Repeat CXR at Week 4 — complete resolution'
      ],
      precautions: [
        'NO penicillin, amoxicillin, cephalosporins, or any beta-lactam antibiotic — allergy alert on all records',
        'Monitor for fever recurrence — if Temp >38.0°C, contact HaH team immediately',
        'Levofloxacin: take with plenty of water, avoid dairy/antacids within 2h',
        'Report any tendon pain (fluoroquinolone side effect)',
        'Adequate hydration — minimum 2L water/day',
        'Escalation criteria: fever >38.5°C, SpO₂ <92%, RR >25, new confusion, pleuritic pain worsening → call 999',
        'Isolation: wear mask if family visits, separate utensils for 5 days'
      ],
      assignedDoctor: 'Dr. Cheung Kwok Wai (Infectious Disease)',
      assignedNurse: 'Connie Cheung (RN)',
      assignedCaseManager: 'Anna Leung (Case Manager)',
      assignedCareWorker: 'Derek Ho',
    },
    nursingRecords: [
      { date: '2026-06-20', time: '09:00', note: 'Day 2 RN visit. Temp 36.8, SpO₂ 97%, RR 16, HR 72, BP 118/74. Lung auscultation: RLL crackles resolving — significantly improved. Cough: dry, occasional. No pleuritic pain. Levofloxacin Day 5 taken — no GI upset. Appetite: eating full meals today. Patient reports feeling "80% back to normal". Reviewed return precautions. Reminded to complete full 7-day antibiotic course despite feeling better. Spouse trained on temperature monitoring.', nurse: 'Connie Cheung', vitals: 'Temp 36.8 | SpO₂ 97% | RR 16 | HR 72 | BP 118/74' },
      { date: '2026-06-19', time: '10:30', note: 'Initial HaH home visit Day 1. Temp 37.0, SpO₂ 96%, RR 18, HR 76, BP 120/76. Lung auscultation: RLL crackles — improving. Oral Levofloxacin 750mg Day 4 taken. Medication reconciliation: Levofloxacin only (no other regular meds). Allergy alert: PENICILLIN ANAPHYLAXIS — confirmed and documented in red on all charts. Home environment: 22nd floor, good ventilation. Spouse works from home — available as caregiver. Hydration: encouraged 2L water/day. Return precautions reviewed. Next visit: Day 3.', nurse: 'Connie Cheung', vitals: 'Temp 37.0 | SpO₂ 96% | RR 18 | HR 76 | BP 120/76' },
    ],
    medications: [
      { drug: 'Levofloxacin', dose: '750mg', route: 'PO', frequency: 'Once daily (AM) — 7-day course', purpose: 'Respiratory fluoroquinolone — CAP treatment (penicillin-allergic patient)', startDate: '2026-06-16', status: 'Active' },
      { drug: 'Paracetamol', dose: '1g', route: 'PO', frequency: 'PRN q6h for fever/pain (max 4g/day)', purpose: 'Antipyretic / analgesic', startDate: '2026-06-14', status: 'Active' },
    ],
    iotDevices: [
      { type: 'Pulse Oximeter', model: 'Nonin Bluetooth 3230', serial: 'SP-2026-00112', status: 'Connected', battery: 88, parameters: ['SpO₂ (continuous)', 'HR', 'Perfusion Index'], lastSync: '10 sec ago' },
      { type: 'Blood Pressure Monitor', model: 'Omron HEM-7361T', serial: 'BP-2026-93003', status: 'Connected', battery: 92, parameters: ['Systolic', 'Diastolic', 'Pulse Rate'], lastSync: '30 sec ago' },
    ],
    riskLevel: 'Low', readmissionRisk: 6,
  },

  // ═══════════════════════════════════════════════════════════
  // PATIENT 4 — LAU SUK YEE — Urinary Tract Infection
  // HK Sanatorium & Hospital (私家) | 九龙区 | Dr. 陈志强
  // ═══════════════════════════════════════════════════════════
  {
    id: 4, address: 'Flat 3A, Block 1, Telford Gardens, Kowloon Bay, Kowloon', name: 'Lau Suk Yee', gender: 'F', age: 81,
    diagnosis: 'Complicated UTI (MDR risk) · CKD Stage 3 · Post-infectious Delirium · T2DM · HTN',
    diagnosisCodes: ['N39.0', 'N18.3', 'I10', 'E11.9'],
    allergies: ['NKDA'],
    physician: 'Dr. Chan Chi Keung (Cardiologist / Internal Medicine)',
    admittingDiagnosis: 'Complicated UTI with systemic symptoms. 81-year-old female with T2DM, CKD Stage 3 (eGFR 48), HTN. Presented with 3-day history of dysuria, frequency, suprapubic pain, and new-onset confusion (acute confusional state). Temp 38.6°C, HR 102. Urine dipstick: nitrite positive, leukocyte esterase 3+, blood 2+. Urine culture: E. coli (ESBL-negative), >10⁵ CFU/mL, sensitive to Nitrofurantoin, Cephalexin, Ciprofloxacin. Treated with IV Ceftriaxone 1g qd × 2 days, then oral Ciprofloxacin 500mg BID. Confusion resolved with treatment. Renal function stable. Suitable for HaH with oral antibiotics.',
    clinicalSummary: '81-year-old female with complicated UTI (E. coli, ESBL-negative) in the setting of T2DM, CKD Stage 3, and HTN. Acute confusion resolved with antibiotic treatment — likely infection-related delirium in elderly patient. Currently on Ciprofloxacin 500mg BID (Day 3 of 7). Renal function stable (Cr 146, eGFR 48). BP 140/88 (on Losartan 100mg + Dapagliflozin 10mg). Urine output adequate. Key concern: elderly patient with multiple comorbidities — monitor for antibiotic-related C. difficile, renal function, and drug interactions (Ciprofloxacin + Losartan can cause hypotension). Plan: complete 7-day antibiotic course, repeat urine culture 1 week post-treatment, cognitive assessment (AMTS) at discharge.',
    wardRounds: [
      { date: '2026-06-20', note: 'Virtual ward round Day 2. Afebrile (Temp 36.7). AMTS 9/10 (improved from 6/10 on admission). Dysuria resolved. Frequency much improved. Urine output: 1,500mL/24h — adequate. Renal function: Cr 148, eGFR 47 — stable. BP 138/84. Ciprofloxacin Day 4 of 7 — no GI side effects. Continue current regimen. Repeat urine culture 1 week after antibiotic completion. Monitor for diarrhoea (C. difficile risk).', physician: 'Dr. Chan Chi Keung' },
      { date: '2026-06-18', note: 'Discharge assessment for HaH. Afebrile × 36h. AMTS 9/10 — confusion fully resolved. Urinary symptoms: mild frequency only, no dysuria. IV Ceftriaxone Day 2 → oral Ciprofloxacin switch. Renal function stable (Cr 146, eGFR 48). Discharge criteria met: clinically improved, oral antibiotics tolerated, confusion resolved, no urinary retention. HaH plan: RN visits q2d, teleconsult Day 3. Complete 7-day antibiotic course. Family educated on UTI prevention (hydration, hygiene, cranberry not evidence-based — omitted).', physician: 'Dr. Chan Chi Keung' },
    ],
    carePlan: {
      serviceFrequency: 'RN BID (AM 09:00 + PM 18:00), 2.5h/visit = 5h/day (Mon-Sun), Teleconsult q48h',
      visitDuration: '2.5 hours per visit × 2/day (5h total)',
      goals: [
        'Complete 7-day IV Ciprofloxacin 400mg BID course → transition to PO on Day 4 if afebrile + AMTS 10/10',
        'AMTS return to 10/10 (baseline cognition) by Day 4',
        'Afebrile × 72h (Temp <37.5°C)',
        'Urinary symptoms fully resolved by Day 5',
        'Urine output >1.5L/day (CKD-adjusted hydration target)',
        'Renal function stable: Cr <160, eGFR >40',
        'No drug interaction events: Cipro + Losartan → BP stable, Cipro + Dapagliflozin → no hypoglycaemia',
        'No falls during IV therapy period (Morse Fall Scale qshift)',
        'No diarrhoea / C. difficile symptoms throughout course'
      ],
      precautions: [
        'IV Ciprofloxacin 400mg in 200mL NS over 60min BID — CKD dose adjustment (CrCl 35mL/min)',
        'QT interval monitoring: Ciprofloxacin can prolong QT in elderly — ECG if HR >100 or palpitations',
        'AMTS cognitive assessment qshift (08:00, 16:00) — report any decline ≥2 points',
        'Hydration: minimum 1.5L fluid/day — use marked water bottle (CKD, avoid overload)',
        'Strict I/O monitoring — report urine output <30mL/h or <1L/24h',
        'BP monitoring pre/post IV infusion — Ciprofloxacin potentiates Losartan',
        'Fall risk HIGH — assess daily (Morse Fall Scale >35), assist with ALL ambulation during IV therapy',
        'Monitor for tendon pain (fluoroquinolone AE in elderly) — report any calf/Achilles pain immediately',
        'C. difficile monitoring: bowel diary, report >3 loose stools/day → hold Cipro, stool sample',
        'Cr + K⁺ q48h — dose adjust Ciprofloxacin if CrCl drops <30mL/min per HK HA guidelines',
        'Escalation criteria: fever >38.0°C, confusion recurrence (AMTS drop ≥2), flank pain, decreased urine output <500mL/12h, fall → call 999'
      ],
      assignedDoctor: 'Dr. Chan Chi Keung (Internal Medicine)',
      assignedNurse: 'Vivian Lau (RN)',
      assignedCaseManager: 'Tony Lam (Case Manager)',
      assignedCareWorker: 'Fanny Yip',
    },
    nursingRecords: [
      { date: '2026-06-20', time: '09:00', note: 'AM visit — IV Ciprofloxacin Day 2. Pre-IV: Temp 36.7, BP 138/84, HR 88, AMTS 9/10 (missed 1 recall item only — improving). Urinary symptoms: frequency mild, no dysuria. I/O: 24h intake 1,550mL, output 1,480mL — net positive 70mL. IV site R) forearm: patent, no phlebitis. Ciprofloxacin 400mg in 200mL NS over 60min per Baxter pump — no adverse reactions. Post-IV BP 134/80 (4mmHg drop — expected). Renal panel: Cr 148, K⁺ 4.6 — stable. PO meds: Losartan 100mg + Dapagliflozin 10mg + Ferrous Sulfate given. Son visited — reviewed AMTS assessment technique. Bowel: formed ×1, no diarrhoea. Fall risk: Morse 35, grab bars + non-slip mat in place.', nurse: 'Vivian Lau', vitals: 'Pre-IV BP 138/84 | Post-IV BP 134/80 | HR 88 | Temp 36.7 | AMTS 9/10 | I/O 1550/1480mL | Cr 148' },
      { date: '2026-06-20', time: '18:00', note: 'PM visit — IV Ciprofloxacin Day 2. Pre-IV: Temp 36.5, BP 136/82, HR 84, AMTS 10/10 (full score — excellent!). Urinary symptoms: frequency normal, no dysuria. I/O since AM: intake 780mL, output 620mL. IV site clean, patent. Ciprofloxacin 400mg over 60min — well tolerated, Post-IV BP 130/76. Son reports patient walked to kitchen independently (with walker) — gait steady. Legs: no tendon tenderness palpated. Bowel: formed ×1. Overnight plan: urinal at bedside, call bell within reach. AMTS 10/10 is very reassuring — confusion fully resolved.', nurse: 'Vivian Lau', vitals: 'Pre-IV BP 136/82 | Post-IV BP 130/76 | HR 84 | Temp 36.5 | AMTS 10/10 | UO 620mL' },
      { date: '2026-06-19', time: '09:30', note: 'AM visit — IV Ciprofloxacin Day 1 (initiation). Pre-IV: Temp 37.2, BP 142/86, HR 92, AMTS 8/10 (mild inattention). IV access: 22G R) forearm — good return. Ciprofloxacin 400mg IVPB over 60min per CKD dosing protocol. Post-IV BP 136/82 (6mmHg drop). Medication reconciliation: Ciprofloxacin 400mg IV BID + Losartan 100mg PO + Dapagliflozin 10mg PO + Ferrous Sulfate 325mg PO. Son trained on AMTS assessment and fall precautions. Home environment: walker available, pathways clear, night lights installed. I/O log established — son will track.', nurse: 'Vivian Lau', vitals: 'Pre-IV BP 142/86 | Post-IV BP 136/82 | HR 92 | Temp 37.2 | AMTS 8/10' },
      { date: '2026-06-19', time: '18:30', note: 'PM visit — IV Ciprofloxacin Day 1. Pre-IV: Temp 36.9, BP 138/80, HR 88, AMTS 8/10. I/O since AM: intake 720mL, output 550mL. IV site patent. Ciprofloxacin 400mg over 60min — Post-IV BP 132/74. Dapagliflozin PM given. Son reports patient ate full dinner. No nausea. Bowel not yet today — monitor. Fall risk reassessed: Morse 35, patient steady with walker, son staying overnight. Cognitive status: AMTS improving from admission baseline (6→8) — encouraging trend.', nurse: 'Vivian Lau', vitals: 'Pre-IV BP 138/80 | Post-IV BP 132/74 | HR 88 | Temp 36.9 | AMTS 8/10 | UO 550mL' },
    ],
    medications: [
      { drug: 'Ciprofloxacin — IV', dose: '400mg in 200mL NS', route: 'IV over 60min', frequency: 'Twice daily (AM 09:00 + PM 18:00) — 7-day course, CKD dose-adjusted', purpose: 'IV fluoroquinolone — complicated UTI (E. coli ESBL-neg), CKD 3: 400mg BID per HA Renal Dosing Guideline', startDate: '2026-06-19', status: 'Active' },
      { drug: 'Losartan', dose: '100mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'ARB — HTN, CKD renoprotection', startDate: '2025-06-05', status: 'Active' },
      { drug: 'Dapagliflozin (Forxiga)', dose: '10mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'SGLT2i — CKD renoprotection, T2DM', startDate: '2025-12-10', status: 'Active' },
      { drug: 'Ferrous Sulfate', dose: '325mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'Iron supplementation — anaemia of CKD', startDate: '2025-06-05', status: 'Active' },
    ],
    iotDevices: [
      { type: 'Smart IV Infusion Pump', model: 'Baxter Sigma Spectrum IQ', serial: 'IV-2026-00803', status: 'Connected', battery: 100, parameters: ['Infusion Rate (mL/h)', 'Volume Delivered', 'Air-in-Line Detection', 'Occlusion Alarm', 'Dose Error Reduction'], lastSync: '5 sec ago' },
      { type: 'Pulse Oximeter', model: 'Nonin Bluetooth 3230', serial: 'SP-2026-00110', status: 'Connected', battery: 82, parameters: ['SpO₂ (continuous)', 'HR', 'Perfusion Index'], lastSync: '10 sec ago' },
      { type: 'Blood Pressure Monitor', model: 'Omron HEM-7361T', serial: 'BP-2026-93004', status: 'Connected', battery: 92, parameters: ['Systolic', 'Diastolic', 'Pulse Rate'], lastSync: '30 sec ago' },
    ],
    riskLevel: 'Moderate', readmissionRisk: 20,
  },

  // ═══════════════════════════════════════════════════════════
  // PATIENT 5 — HO TAI WAI — Cellulitis / Soft Tissue Infection
  // Queen Mary Hospital (公立) | 港岛区 | Dr. 李美玲
  // ═══════════════════════════════════════════════════════════
  {
    id: 5, address: 'Flat 15A, Block 2, Bel-Air Residence, Pok Fu Lam, Hong Kong Island', name: 'Ho Tai Wai', gender: 'M', age: 72,
    diagnosis: 'Cellulitis LLL (Eron Class III) · T2DM · HTN',
    diagnosisCodes: ['L03.9', 'E11.9', 'I10'],
    allergies: ['NKDA'],
    physician: 'Dr. Lee Mei Ling (Respiratory / Internal Medicine)',
    admittingDiagnosis: 'Moderate-severity cellulitis of left lower limb. 72-year-old male with T2DM (HbA1c 7.8%) and HTN. Presented with 4-day history of progressive left leg erythema, swelling, warmth, and pain. Portal of entry: minor abrasion on left shin from gardening. Eron Class III (systemic symptoms: Temp 38.4°C, HR 96, WBC 14.2). Blood cultures: no growth. Wound swab: no growth (likely streptococcal). Treated with IV Clindamycin 600mg q8h × 2 days + oral Clindamycin 450mg q6h for completion. Leg elevated, marked improvement. Suitable for HaH with oral antibiotics + daily wound care.',
    clinicalSummary: '72-year-old male with moderate cellulitis (Eron Class III) of left lower limb, likely streptococcal. T2DM (HbA1c 7.8% — suboptimal control) and HTN as comorbidities. Significant improvement after 2 days IV Clindamycin: erythema reduced from 25cm→15cm diameter, pain 2/10 (from 7/10), afebrile × 36h. Oral Clindamycin 450mg q6h for 7 more days. Daily wound care: saline irrigation, non-adherent dressing, elevation. Mark erythema margins daily. Key concern: diabetic patient — poor wound healing, monitor for abscess formation or progression to necrotising fasciitis. Plan: daily RN visits for wound assessment + dressing, PT for mobility, HbA1c optimisation.',
    wardRounds: [
      { date: '2026-06-20', note: 'Virtual ward round Day 2. Afebrile (Temp 36.6). Erythema: 12cm diameter (↓ from 15cm yesterday, 25cm at admission). Pain 1/10. Wound: clean, granulating, no pus. Clindamycin Day 4 of 9 — tolerating well, no GI side effects. WBC 9.8 (↓ from 14.2). CRP 32 (↓ from 128). Leg elevation maintained. Continue daily dressing. Mark erythema margins. PT to assess mobility tomorrow.', physician: 'Dr. Lee Mei Ling' },
      { date: '2026-06-18', note: 'Discharge assessment for HaH. Afebrile × 36h. Erythema: 15cm diameter (↓ from 25cm). Pain 2/10. Wound: clean, no pus. WBC 10.5, CRP 48. IV Clindamycin Day 2 → oral switch (bioequivalent). Discharge criteria met: clinically improving, oral antibiotics tolerated, afebrile, infection localised. HaH plan: daily RN for wound care + dressing, teleconsult q48h. Complete 9-day total antibiotic course. Wound photo documentation daily. PT referral for mobility (leg elevation + walking).', physician: 'Dr. Lee Mei Ling' },
    ],
    carePlan: {
      serviceFrequency: 'RN q6h (06:00, 10:00, 14:00, 18:00, 22:00), 60min/visit = 5h/day (Mon-Sun), Teleconsult q48h, PT 2x/week',
      visitDuration: '60 minutes per visit × 5/day (5h total)',
      goals: [
        'Complete 9-day IV Clindamycin 600mg q6h course → transition to PO on Day 5 if afebrile + CRP <20',
        'Erythema <5cm by Day 7, wound closed by Day 14',
        'Pain score 0/10 by Day 5',
        'Afebrile (Temp <37.5°C) × 72h before PO conversion',
        'Capillary glucose <10 mmol/L (maintain during infection stress)',
        'No abscess formation, lymphangitic tracking, or necrotising progression',
        'IV site assessment qshift — rotate per HA guideline q72h',
        'Independent ambulation maintained (leg elevation breaks)'
      ],
      precautions: [
        'IV Clindamycin 600mg in 100mL NS over 30min q6h — monitor for hypotension, taste disturbance, diarrhoea',
        'C. difficile risk: report >3 loose stools/day immediately — hold Clindamycin, notify physician',
        'Leg elevation: above heart level when sitting, minimum 6h/day',
        'Mark erythema margins BID with skin marker + photograph for documentation',
        'Wound care BID: saline irrigation + non-adherent silicone dressing',
        'Temperature q4h — if >38.0°C, notify Dr. Lee Mei Ling immediately',
        'Capillary glucose q4h (T2DM + acute infection → insulin resistance)',
        'Diabetic foot check: inspect both feet at every visit',
        'IV site: inspect qshift, rotate every 72h per HK HA IV Guideline',
        'Escalation criteria: erythema spreading beyond marked margin, new fever >38.5°C, increasing pain >5/10, skin blistering/necrosis → call 999'
      ],
      assignedDoctor: 'Dr. Lee Mei Ling (Internal Medicine)',
      assignedNurse: 'Angela Ng (RN)',
      assignedCaseManager: 'Grace Tang (Case Manager)',
      assignedRehabTherapist: 'Eric Chan (PT)',
      assignedCareWorker: 'Peter Kwan',
    },
    nursingRecords: [
      { date: '2026-06-20', time: '06:00', note: 'AM IV Clindamycin Day 2. Pre-infusion: Temp 36.5, BP 134/78, HR 76, CapGluc 7.8. Wound: erythema 10cm (↓ from 12cm), clean, granulating. IV site L) forearm: patent, no phlebitis. Clindamycin 600mg in 100mL NS over 30min per Baxter pump — no adverse reactions. Post-infusion BP 130/74. Diabetic foot check: no new wounds. Wife reports good night, pain 0/10. Early morning leg elevation confirmed.', nurse: 'Angela Ng', vitals: 'Temp 36.5 | BP 134/78 | HR 76 | Erythema 10cm | CapGluc 7.8' },
      { date: '2026-06-20', time: '10:00', note: 'Mid-morning visit. Temp 36.7, HR 78, CapGluc 8.2. IV Clindamycin 600mg over 30min — tolerated. Post-IV BP 132/74. Wound: erythema stable 10cm, dressing clean. Wound photo taken (comparison: ↓2cm from yesterday). Leg elevated. Patient walking to bathroom independently — gait steady. Wife reminded: elevate leg when sitting.', nurse: 'Angela Ng', vitals: 'Temp 36.7 | BP 132/74 | HR 78 | Erythema 10cm | CapGluc 8.2' },
      { date: '2026-06-20', time: '14:00', note: 'Afternoon visit. Temp 36.6, HR 74, CapGluc 8.5. Wound assessment: erythema still 10cm, no fluctuation, no tracking. Dressing changed: saline irrigation + non-adherent silicone. New erythema margin marked. IV Clindamycin 600mg over 30min — Post-IV BP 130/72. Metformin administered with lunch. Patient reports slight metallic taste (Clindamycin SE) — tolerable. Bowel normal ×1 today (no diarrhoea). Wife doing excellent wound photo log.', nurse: 'Angela Ng', vitals: 'Temp 36.6 | BP 130/72 | HR 74 | Erythema 10cm | CapGluc 8.5' },
      { date: '2026-06-20', time: '18:00', note: 'Evening visit. Temp 36.8 — slight increase from PM, HR 78. IV Clindamycin 600mg over 30min — well tolerated, Post-IV BP 128/70. Wound stable. CapGluc 7.6 (↓ from PM — good). PM meds: Metformin given. Leg elevation maintained (patient resting on recliner). Bowel: formed stool ×1. C. difficile education reinforced. Next visit: 22:00.', nurse: 'Angela Ng', vitals: 'Temp 36.8 | BP 128/70 | HR 78 | CapGluc 7.6 | Bowels normal' },
      { date: '2026-06-20', time: '22:00', note: 'Night visit. Temp 36.5 — afebrile. HR 72. CapGluc 7.2. IV Clindamycin 600mg over 30min (last dose today) — Post-IV BP 124/68. Wound check: erythema stable, dressing dry, no new drainage. IV site clean, patent. Patient comfortable, watching TV. Wife present. Overnight plan: leg elevation during sleep (pillow under calf, not knee). Emergency contact numbers confirmed. Next AM visit: 06:00. Sleep environment safe.', nurse: 'Angela Ng', vitals: 'Temp 36.5 | BP 124/68 | HR 72 | CapGluc 7.2 | IV site clear' },
      { date: '2026-06-19', time: '08:30', note: 'Initial HaH IV Day 1. Temp 37.0, BP 140/86, HR 84. Wound: erythema 15cm (↓ from 25cm at admission). IV access: 22G R) forearm — good blood return. Clindamycin 600mg IVPB over 30min per protocol. Post-IV BP 136/82. Medication reconciliation: Clindamycin 600mg IV q6h + Metformin 500mg PO BID + Amlodipine 5mg PO qd confirmed. Wife trained on glucometer (CapGluc q4h protocol). Home environment: spacious, lift access. Recliner chair + pillows for leg elevation. Wound care supplies stocked. Photo documentation workflow established. C. difficile signs + escalation criteria reviewed with wife.', nurse: 'Angela Ng', vitals: 'Temp 37.0 | BP 140→136/82 | HR 84 | Erythema 15cm | IV site L)}forearm' },
    ],
    medications: [
      { drug: 'Clindamycin — IV', dose: '600mg in 100mL NS', route: 'IV over 30min', frequency: 'Every 6 hours (06:00, 10:00, 14:00, 18:00, 22:00) — 9-day course', purpose: 'IV lincosamide — Eron Class III cellulitis (streptococcal), transition to PO Day 5 if afebrile + CRP <20', startDate: '2026-06-19', status: 'Active' },
      { drug: 'Metformin', dose: '500mg', route: 'PO', frequency: 'Twice daily (AM + PM)', purpose: 'Type 2 DM — glycaemic control', startDate: '2024-06-02', status: 'Active' },
      { drug: 'Amlodipine', dose: '5mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'CCB — HTN', startDate: '2024-06-02', status: 'Active' },
    ],
    iotDevices: [
      { type: 'Smart IV Infusion Pump', model: 'Baxter Sigma Spectrum IQ', serial: 'IV-2026-00802', status: 'Connected', battery: 100, parameters: ['Infusion Rate (mL/h)', 'Volume Delivered', 'Air-in-Line', 'Occlusion Alarm', 'Dose Error Reduction'], lastSync: '5 sec ago' },
      { type: 'Infrared Wound Camera', model: 'MolecuLight i:X', serial: 'WC-2026-00105', status: 'Connected', battery: 88, parameters: ['Wound Size (cm)', 'Fluorescence Imaging', 'Temperature Mapping', 'Area Tracking'], lastSync: '2 min ago' },
      { type: 'Infrared Thermometer', model: 'Braun BNT400 Bluetooth', serial: 'TH-2026-00210', status: 'Connected', battery: 95, parameters: ['Temperature', 'Trend'], lastSync: '5 min ago' },
      { type: 'Glucometer', model: 'Accu-Chek Guide', serial: 'GL-2026-00555', status: 'Connected', battery: 90, parameters: ['Capillary Glucose (q4h)', 'Trend', '7-Day Average'], lastSync: '30 sec ago' },
      { type: 'Blood Pressure Monitor', model: 'Omron HEM-7361T', serial: 'BP-2026-93005', status: 'Connected', battery: 92, parameters: ['Systolic', 'Diastolic', 'Pulse Rate'], lastSync: '30 sec ago' },
    ],
    riskLevel: 'Moderate', readmissionRisk: 15,
  },
  // PATIENT 6 — Ng Siu Wan
  // Gleneagles Hospital (私家) | 港岛区 | Dr. 张国伟
  // Warfarin + INR monitoring
  // ═══════════════════════════════════════════════════════════
  {
    id: 6, address: 'Flat 7B, Block 3, South Horizons, Ap Lei Chau, Hong Kong Island', name: 'Ng Siu Wan', gender: 'F', age: 67,
    diagnosis: 'Deep Vein Thrombosis (DVT) — Left Lower Limb',
    diagnosisCodes: ['I80.2', 'Z92.1', 'I10', 'E78.5'],
    allergies: ['NKDA'],
    physician: 'Dr. Cheung Kwok Wai (Infectious Disease / Internal Medicine)',
    admittingDiagnosis: 'Acute proximal DVT — left femoral vein. 67-year-old female with history of HTN and hyperlipidaemia. Presented with 3-day history of progressive left leg swelling, calf pain, and erythema. No history of recent surgery, trauma, or prolonged travel. No known thrombophilia. Wells Score: 3 (moderate probability). D-dimer: 3,200 (elevated). Doppler US: acute non-occlusive thrombus in left femoral vein extending to proximal popliteal vein. No iliac vein involvement. CTPA: no PE. Started on therapeutic LMWH (Enoxaparin 1mg/kg BID) + Warfarin 5mg qd bridging. INR 2.1 on Day 4 (target 2.0-3.0). Transitioned to Warfarin monotherapy. Suitable for HaH with daily INR monitoring + compression stockings.',
    clinicalSummary: '67-year-old female with acute proximal DVT (left femoral + popliteal). No PE on CTPA. Warfarin bridging completed — INR 2.1 (target 2.0-3.0). LMWH discontinued. Warfarin 5mg qd current dose. Requires daily INR monitoring via POCT (CoaguChek) until stable in range × 3 consecutive days, then q2-3 days. Key concern: warfarin management — narrow therapeutic index, multiple drug and food interactions. Patient education critical: consistent vitamin K intake, avoid NSAIDs, report any bleeding/bruising. Compression stockings (Class II, 23-32mmHg) fitted. Plan: anticoagulation 3-6 months, repeat Doppler US at 3 months, thrombophilia screen if recurrent. Leg elevation + early ambulation.',
    wardRounds: [
      { date: '2026-06-20', note: 'Virtual ward round Day 2. INR 2.1 (in range). No bleeding, no bruising. Left leg swelling: calf circumference 38cm (↓ from 40cm at admission). Pain 1/10. Compression stockings worn × 18h yesterday. Warfarin 5mg qd continued. No new medications. Vitamin K intake consistent — reviewed food diary. Plan: continue daily INR, target 2.0-3.0. Warfarin education session tomorrow with RN. Repeat INR tomorrow. Consider reducing INR frequency to q2d if stable × 3 days.', physician: 'Dr. Cheung Kwok Wai' },
      { date: '2026-06-18', note: 'Discharge assessment for HaH. INR 2.1 — therapeutic. LMWH Day 4 → discontinued (bridging complete). Left leg swelling: calf circumference 39cm (↓ from 41cm). Pain 2/10. No PE symptoms. Compression stockings fitted. Discharge criteria met: therapeutic INR, no bleeding, leg improving, oral Warfarin tolerated. HaH plan: daily INR via POCT, RN visits q2d, teleconsult q48h. Warfarin education: diet, drug interactions, bleeding precautions. Compression stocking compliance. Follow-up Doppler US at 3 months.', physician: 'Dr. Cheung Kwok Wai' },
    ],
    carePlan: {
      serviceFrequency: 'Daily INR POCT + RN visits q2d, Teleconsult q48h, PT 1x/week',
      visitDuration: '35 minutes',
      goals: [
        'INR stable in therapeutic range 2.0-3.0',
        'No bleeding events (major or minor)',
        'Left leg swelling resolved — calf circumference <36cm',
        'Pain score 0/10 by Day 7',
        'Compression stocking compliance >12h/day',
        'Patient demonstrates correct Warfarin self-administration',
        'Patient verbalises 5 key Warfarin safety points',
        'No PE development during HaH period'
      ],
      precautions: [
        'Warfarin: take at SAME TIME daily (6PM) — use pill box with alarm',
        'INR monitoring: daily POCT until stable × 3 days, then q2-3 days',
        'Consistent vitamin K intake: do NOT suddenly change leafy green consumption',
        'Avoid NSAIDs (Ibuprofen, Diclofenac, Aspirin) — paracetamol only for pain',
        'Report any bleeding: gums when brushing, nosebleeds, easy bruising, blood in urine/stool, heavy menses',
        'Compression stockings: wear during daytime, remove at night, inspect skin daily',
        'Leg elevation when sitting, avoid prolonged standing',
        'Escalation criteria: sudden chest pain, SOB, haemoptysis (PE), severe bleeding, INR >4.0 → call 999'
      ],
      assignedDoctor: 'Dr. Cheung Kwok Wai (Internal Medicine)',
      assignedNurse: 'Sarah Leung (RN)',
      assignedCaseManager: 'Anna Leung (Case Manager)',
      assignedRehabTherapist: 'Michael Kwok (PT)',
      assignedCareWorker: 'May Wong',
    },
    nursingRecords: [
      { date: '2026-06-20', time: '08:00', note: 'INR check + RN visit Day 2. INR 2.1 (POCT CoaguChek) — in range. BP 132/80, HR 74. No bleeding: gums, skin, urine all clear. Left leg: calf circumference 38cm (↓ from 39cm), minimal swelling, pain 1/10. Compression stockings: worn 18h yesterday, skin intact. Warfarin 5mg PM dose confirmed taken. Warfarin education session completed: 1. consistent vitamin K 2. avoid NSAIDs 3. bleeding signs 4. INR monitoring schedule 5. alcohol limit. Patient demonstrated correct self-administration. Food diary reviewed — consistent greens intake. Next INR: tomorrow 08:00.', nurse: 'Sarah Leung', vitals: 'INR 2.1 | BP 132/80 | HR 74 | Calf 38cm | Pain 1/10' },
      { date: '2026-06-19', time: '09:00', note: 'Initial HaH home visit Day 1. INR 2.3 (POCT) — slightly above target, Warfarin dose held per protocol → recheck tomorrow. BP 136/84, HR 78. Left leg: calf circumference 39cm (↓ from 41cm), moderate swelling, pain 2/10. Compression stockings fitted and worn — Class II, 23-32mmHg. Medication reconciliation: Warfarin 5mg qd + Perindopril 4mg qd + Atorvastatin 20mg qd confirmed. Home environment: 7th floor, lift access. Daughter (primary caregiver) lives in same building. Warfarin education: initial session — diet, drug interactions, bleeding signs. Pill box with alarm set up. Anticoagulation alert card provided. Next INR: tomorrow 08:00.', nurse: 'Sarah Leung', vitals: 'INR 2.3 | BP 136/84 | HR 78 | Calf 39cm | Pain 2/10' },
    ],
    medications: [
      { drug: 'Warfarin', dose: '5mg', route: 'PO', frequency: 'Once daily (6PM) — dose adjusted per INR', purpose: 'Vitamin K antagonist — DVT anticoagulation (target INR 2.0-3.0)', startDate: '2026-06-15', status: 'Active' },
      { drug: 'Perindopril', dose: '4mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'ACE inhibitor — HTN', startDate: '2024-03-01', status: 'Active' },
      { drug: 'Atorvastatin', dose: '20mg', route: 'PO', frequency: 'Once daily (PM)', purpose: 'Statin — hyperlipidaemia', startDate: '2024-03-01', status: 'Active' },
    ],
    iotDevices: [
      { type: 'Blood Pressure Monitor', model: 'Omron HEM-7361T', serial: 'BP-2026-93006', status: 'Connected', battery: 92, parameters: ['Systolic', 'Diastolic', 'Pulse Rate', 'Irregular HB Detection', 'AFib Screening'], lastSync: '30 sec ago' },
      { type: 'Coagulation Monitor (POCT)', model: 'Roche CoaguChek INRange', serial: 'CG-2026-00045', status: 'Connected', battery: 90, parameters: ['INR', 'PT (seconds)'], lastSync: '1 min ago' },
    ],
    riskLevel: 'High', readmissionRisk: 12,
  },

  // ═══════════════════════════════════════════════════════════
  // PATIENT 7 — CHAN TAI MING — COPD GOLD 2 + CAP (resolving)
  // Prince of Wales Hospital (公立) | 新界东 | Dr. 李美玲
  // ═══════════════════════════════════════════════════════════
  {
    id: 7, address: 'Flat 12B, Block 8, City One Shatin, Ngan Shing Street, Sha Tin, New Territories', name: 'Chan Tai Ming', gender: 'M', age: 82,
    diagnosis: 'COPD GOLD Stage 2 · CAP (resolving) · HTN',
    diagnosisCodes: ['J44.9', 'J15.9', 'I10'],
    allergies: ['Penicillin (rash)'],
    physician: 'Dr. Lee Mei Ling (Respiratory Physician)',
    admittingDiagnosis: 'COPD GOLD Stage 2, recent CAP (IV Ceftriaxone+Azithromycin x5d), HTN. 82yo M discharged PWH. CURB-65: 2. Afebrile x48h.',
    clinicalSummary: '82yo M with moderate COPD (GOLD 2, FEV1 55%), recent CAP resolved as inpatient. SpO2 92% RA baseline, desaturates to 88% on 30m walk. mMRC 2, CAT 18. O2 standby. HTN on Amlodipine. Ex-smoker. Key concern: post-pneumonia instability in elderly COPD.',
    wardRounds: [
      { date: '2026-06-25', note: 'DISCHARGE SIGN-OFF. 7-day HaH completed. SpO₂ 96% RA, afebrile × 96h, all vitals normalised. CRP 8, WBC 8.4, PCT <0.05. IV Ceftriaxone Day 7 completed → PO Augmentin Day 8-10. No complications, no ADRs, no hospital readmission. COPD action plan updated. Follow-up: respiratory clinic 2026-07-09.', physician: 'Dr. Lee Mei Ling' },
      { date: '2026-06-23', note: 'C&S RESULTS REVIEW. Blood culture: H. influenzae (Ampicillin-S, Ceftriaxone-S). Sputum: H. influenzae 3+, same antibiogram. CRP 12 (↓ from 86), PCT <0.05 (normalised), WBC 9.8 (↓ from 14.2). Renal function normal. Clinically: SpO₂ 95% RA, afebrile × 48h. Plan: continue IV Ceftriaxone (sensitive), STOP Doxycycline, ADD Azithromycin 500mg PO QD × 3 days for anti-inflammatory effect in COPD. RN frequency reduced to once daily from Day 6.', physician: 'Dr. Lee Mei Ling' },
      { date: '2026-06-20', note: 'URGENT REVIEW — RED ALERT. SpO₂ 90% on RA, Temp 38.3°C, RR 26, HR 98, AMTS 7/10. Sputum changed to green, increased volume. POCT: CRP 68 mg/L, PCT 0.8 ng/mL — confirms bacterial infection with systemic involvement. Plan: 1. start IV Ceftriaxone 2g QD (penicillin allergy → cephalosporin safe) 2. add Doxycycline 100mg PO BID for atypical coverage 3. send formal blood (CBC, CRP, PCT, BC ×2, renal/liver) + sputum C&S to PWH 4. O₂ 2L/min via nasal cannula 5. continue BID RN 6. review with C&S results Day 5. Family updated — wife and daughter informed of escalation.', physician: 'Dr. Lee Mei Ling' },
      { date: '2026-06-18', note: 'Discharge assessment for HaH. Afebrile ×48h (Temp 37.2). SpO₂ 92% on RA at rest, 88% on 30m walk. RR 22. CURB-65: 2 at admission → now 1 (age only, confusion resolved). Discharge criteria met per HA HaH guideline. HaH plan: BID RN visits (Maggie Lam triage → HIGH risk), teleconsult q48h, O₂ concentrator on standby. POCT CRP/PCT kit on standby for escalation.', physician: 'Dr. Lee Mei Ling' },
    ],
    carePlan: {
      serviceFrequency: 'RN BID (08:00+17:00), 3h/visit = 6h/day, Teleconsult q48h, PT 2x/week',
      visitDuration: '3h x 2/day (6h total)',
      goals: ['SpO2 >=92% RA by Day 3', 'Afebrile x72h by Day 4', 'RR <=18 by Day 5', 'Complete COPD inhaler education', 'Morse <=45 by Day 7', 'Grab bars installed Day 3', 'Family demonstrates monitoring + escalation'],
      precautions: ['Infection Watch: SpO2<92%+Temp>38→POCT CRP/PCT', 'NEWS High: SpO2<88% or RR>30 or SBP<100→999', 'Fall HIGH (Morse 55)', 'O2 PRN 2L/min', 'COPD Exacerbation→Dr Lee within 2h'],
      assignedDoctor: 'Dr. Lee Mei Ling (Respiratory)',
      assignedNurse: 'Jenny Tam (RN)',
      assignedCaseManager: 'Grace Tang (Case Manager)',
      assignedRehabTherapist: 'David Chan (PT)',
      assignedCareWorker: 'May Wong',
    },
    nursingRecords: [
      { date: '2026-06-25', time: '08:00', note: 'DISCHARGE DAY 7. SpO₂ 96% RA, Temp 36.5, RR 15, HR 78, BP 124/72. All criteria met — HOSPITAL READMISSION AVOIDED.', nurse: 'Jenny Tam', vitals: 'SpO₂ 96% | Temp 36.5 | RR 15 | HR 78 | BP 124/72 | Discharge ✅' },
      { date: '2026-06-24', time: '08:30', note: 'Day 6 AM. SpO₂ 95% RA, Temp 36.6, RR 16, HR 80, BP 126/74. RN once daily. IV Ceftriaxone Day 5.', nurse: 'Jenny Tam', vitals: 'SpO₂ 95% | Temp 36.6 | RR 16 | HR 80 | BP 126/74' },
      { date: '2026-06-23', time: '09:00', note: 'Day 5. C&S: H. influenzae, Ceftriaxone-sensitive. CRP 12, PCT <0.05, WBC 9.8. Stop Doxycycline, add Azithromycin.', nurse: 'Jenny Tam', vitals: 'SpO₂ 95% | CRP 12 | PCT <0.05 | WBC 9.8 | C&S: H. influenzae' },
      { date: '2026-06-22', time: '08:00', note: 'Day 4. SpO₂ 94% RA, Temp 37.1, RR 18, HR 84. Crackles resolved. IV Ceftriaxone Day 3. Morse 45.', nurse: 'Jenny Tam', vitals: 'SpO₂ 94% | Temp 37.1 | RR 18 | HR 84 | Morse 45' },
      { date: '2026-06-21', time: '08:30', note: 'Day 3. 16h post-IV antibiotics. SpO₂ 93% RA (O₂ weaned). Temp 37.5, RR 20, HR 88. CRP 42, PCT 0.3.', nurse: 'Jenny Tam', vitals: 'SpO₂ 93% | Temp 37.5 | RR 20 | HR 88 | CRP 42 | PCT 0.3' },
      { date: '2026-06-20', time: '14:30', note: 'URGENT Day 2 PM. RED ALERT. SpO₂ 90%, Temp 38.3, RR 26, HR 98. POCT: CRP 68, PCT 0.8. IV Ceftriaxone + Doxycycline started.', nurse: 'Jenny Tam', vitals: 'SpO₂ 90% | Temp 38.3 | RR 26 | HR 98 | CRP 68 | PCT 0.8' },
      { date: '2026-06-20', time: '08:00', note: 'Day 2 AM. SpO₂ 91% ⚠️, Temp 37.8, RR 24, HR 94. Sputum green. Infection Watch → notify Maggie Lam + Dr. Lee.', nurse: 'Jenny Tam', vitals: 'SpO₂ 91% | Temp 37.8 | RR 24 | HR 94' },
      { date: '2026-06-19', time: '17:00', note: 'Day 1 PM. SpO₂ 93%, Temp 37.1, stable. Wife checked SpO₂ correctly. PT referral + grab bars ordered.', nurse: 'Jenny Tam', vitals: 'SpO₂ 93% | Temp 37.1 | RR 18 | HR 82' },
      { date: '2026-06-19', time: '08:30', note: 'Day 1 AM — Initial HaH assessment. SpO₂ 93% RA, Temp 37.0, RR 20, HR 84, BP 138/84. Morse 55. Wife trained.', nurse: 'Jenny Tam', vitals: 'SpO₂ 93% | Temp 37.0 | RR 20 | HR 84 | BP 138/84 | Morse 55' },
    ],
    medications: [
      { drug: 'Ceftriaxone — IV', dose: '2g in 100mL NS', route: 'IV over 30min', frequency: 'QD AM — Days 2-7', purpose: 'IV cephalosporin — CAP (H. influenzae, sensitive per C&S)', startDate: '2026-06-20', status: 'Active' },
      { drug: 'Amoxicillin-clavulanate', dose: '875/125mg', route: 'PO', frequency: 'BID — Days 8-10', purpose: 'Oral step-down to complete 10-day CAP course', startDate: '2026-06-26', status: 'Planned' },
      { drug: 'Tiotropium (Spiriva)', dose: '18mcg', route: 'Inhalation', frequency: 'QD AM', purpose: 'LAMA — COPD maintenance bronchodilation', startDate: '2025-03-15', status: 'Active' },
      { drug: 'Salbutamol (Ventolin MDI)', dose: '100mcg', route: 'Inhalation', frequency: 'PRN q4-6h', purpose: 'SABA — rescue bronchodilator', startDate: '2025-03-15', status: 'Active' },
      { drug: 'Amlodipine', dose: '5mg', route: 'PO', frequency: 'QD AM', purpose: 'CCB — HTN', startDate: '2024-01-10', status: 'Active' },
      { drug: 'Oxygen Therapy', dose: '2L/min', route: 'Nasal cannula', frequency: 'PRN when SpO₂ <90%', purpose: 'Supplemental O₂ — standby for COPD exacerbation/CAP desaturation', startDate: '2026-06-18', status: 'Active' },
    ],
    iotDevices: [
      { type: 'Pulse Oximeter', model: 'Nonin Bluetooth 3230', serial: 'SP-2026-00111', status: 'Connected', battery: 88, parameters: ['SpO₂ (continuous)', 'HR', 'Perfusion Index'], lastSync: '5 sec ago' },
      { type: 'Blood Pressure Monitor', model: 'Omron HEM-7361T', serial: 'BP-2026-93007', status: 'Connected', battery: 95, parameters: ['Systolic', 'Diastolic', 'Pulse Rate'], lastSync: '30 sec ago' },
      { type: 'Infrared Thermometer', model: 'Braun BNT400 Bluetooth', serial: 'TH-2026-00211', status: 'Connected', battery: 92, parameters: ['Temperature', 'Trend'], lastSync: '2 min ago' },
      { type: 'O₂ Concentrator', model: 'Philips EverFlo', serial: 'O2-2026-00088', status: 'Standby', battery: 100, parameters: ['Flow Rate (L/min)', 'FiO₂', 'SpO₂ Feedback'], lastSync: '5 min ago' },
      { type: 'POCT Kit (Standby)', model: 'Abbott i-STAT Alinity', serial: 'POCT-2026-00033', status: 'Standby', battery: 100, parameters: ['CRP (rapid)', 'PCT (rapid)'], lastSync: 'On standby' },
    ],
    riskLevel: 'High', readmissionRisk: 22,
  },
];

export const PATIENTS_FULL: PatientFull[] = [...PATIENTS_BASE, ...NEW_PATIENTS];
