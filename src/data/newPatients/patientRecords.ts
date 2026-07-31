import { type PatientFull } from '../patients';

export const NEW_PATIENTS: PatientFull[] = [
  // ═══════════════════════════════════════════════════════════
  // PATIENT 8 — CHOW KWOK FAI — NSTEMI post-PCI ×2
  // Queen Mary Hospital (公立) | Kowloon Bay | Dr. Chan Chi Keung
  // ═══════════════════════════════════════════════════════════
  {
    id: 8, address: 'Flat 6C, Block 3, Telford Gardens, Kowloon Bay, Kowloon', name: 'Chow Kwok Fai', gender: 'M', age: 72,
    diagnosis: 'NSTEMI post-PCI ×2 (LAD, RCA) · Type 2 DM · HTN',
    diagnosisCodes: ['I21.4', 'Z95.5', 'E11.9', 'I10'],
    allergies: ['NKDA'],
    physician: 'Dr. Chan Chi Keung (Cardiologist)',
    admittingDiagnosis: 'Non-ST Elevation Myocardial Infarction (NSTEMI). 72-year-old male with T2DM and HTN. Presented with acute crushing chest pain radiating to left arm ×3h, diaphoresis, nausea. ECG: ST elevation V1-V4. Troponin I peak 12.4 ng/mL. Echo: anterior hypokinesis, LVEF 48%. Coronary angiography: 85% mid-LAD, 90% proximal RCA — PCI ×2 with drug-eluting stents, TIMI 3 flow. CCU 48h, uncomplicated. No arrhythmias. Discharged Day 12 post-PCI for HaH cardiac RPM and Phase II rehab.',
    clinicalSummary: '72-year-old male post-NSTEMI with dual-vessel PCI (LAD + RCA), EF 50% (improved from 48%). On DAPT (Aspirin 100mg + Clopidogrel 75mg ×12 months), Metoprolol 37.5mg BID, Atorvastatin 40mg, Lisinopril 5mg, Metformin 500mg BID. HbA1c 7.9% — SMBG qid essential. PCI site healed, no haematoma. BP 128/78, HR 76, SpO₂ 96%. Remote ECG via KardiaMobile — NSR. Cardiac rehab Phase II initiated Day 3 HaH. Key concerns: DAPT bleeding vs stent thrombosis balance, glycaemic optimisation, secondary prevention adherence. Daughter manages medication box and SMBG log.',
    wardRounds: [
      { date: '2026-07-03', note: 'Virtual ward round HaH Day 3. Pain-free. PCI site clean. BP 128/78, HR 76, SpO₂ 96%. DAPT compliance 100%. SMBG 5.8-8.2 mmol/L. Remote ECG NSR, no ST changes. Troponin cleared. Cardiac rehab Day 1 tolerated — walked 120m, HR peak 98, no angina. Continue current regimen. Lipids recheck Week 2. Cardiology clinic 2026-07-14.', physician: 'Dr. Chan Chi Keung' },
      { date: '2026-07-01', note: 'Discharge assessment for HaH enrolment post-PCI. Mobilising independently. PCI radial site intact, no haematoma or oozing. BP 130/80, HR 78, SpO₂ 95%. HaH plan: RN 3×/week, cardiac RPM (smartwatch + BP + KardiaMobile ECG q2w), teleconsult q48h, PT cardiac rehab 2×/week. DAPT education completed — report bleeding, chest pain, SOB immediately. Wife and daughter trained on PCI site monitoring and emergency numbers.', physician: 'Dr. Chan Chi Keung' },
    ],
    carePlan: {
      serviceFrequency: 'RN 3×/week (Mon/Wed/Fri), PT cardiac rehab 2×/week (Tue/Thu), Teleconsult q48h, Remote ECG q2w',
      visitDuration: '45 minutes (RN) · 60 minutes (PT)',
      goals: [
        'DAPT compliance 100% ×12 months — zero missed doses',
        'No stent thrombosis, reinfarction, or unplanned revascularisation × 6 months',
        'SMBG fasting 4-7 mmol/L, pre-meal <10 mmol/L',
        'HbA1c <7.5% by 3 months',
        'Complete 8-session cardiac rehab Phase II programme',
        'LDL <1.8 mmol/L on high-intensity statin',
        'BP <130/80 mmHg on current antihypertensive regimen',
        'Patient/caregiver demonstrates PCI site check + bleeding precautions + KardiaMobile ECG'
      ],
      precautions: [
        'DAPT: report gum bleeding, easy bruising, melena, haematuria, or prolonged bleeding immediately',
        'NO NSAIDs (Ibuprofen, Diclofenac) — paracetamol only for pain',
        'PCI arm precautions ×7 days — no heavy lifting >5kg with affected arm',
        'Call 999 for chest pain >5min, SOB, palpitations with dizziness, or suspected stroke',
        'SMBG qid — report hypoglycaemia <4 or hyperglycaemia >12 mmol/L',
        'Low sodium diet <2g/day, heart-healthy meals',
        'Remote ECG q2w — report new palpitations or syncope',
        'Escalation: chest pain, ST changes on ECG, HR >120 or <50, SpO₂ <92% → urgent teleconsult'
      ],
      assignedDoctor: 'Dr. Chan Chi Keung (Cardiology)',
      assignedNurse: 'Sarah Leung (RN)',
      assignedCaseManager: 'Peter Ho (Case Manager)',
      assignedRehabTherapist: 'David Chan (PT)',
    },
    nursingRecords: [
      { date: '2026-07-03', time: '08:30', note: 'HaH Day 3 — cardiac visit. PCI site R) radial: healed, no haematoma, full ROM. BP 128/78, HR 76, SpO₂ 96%, Temp 36.6. Cardiac auscultation: S1S2 normal, no murmur, no S3. DAPT taken AM — compliance confirmed. SMBG fasting 6.4 mmol/L. Remote ECG uploaded — NSR, no ST changes. Bleeding check: gums, skin, urine clear. Daughter present — reviewed DAPT schedule and emergency action plan. KardiaMobile functioning. Next cardiac rehab tomorrow with David Chan PT.', nurse: 'Sarah Leung', vitals: 'BP 128/78 | HR 76 | SpO₂ 96% | SMBG 6.4 | Temp 36.6' },
      { date: '2026-07-02', time: '08:30', note: 'HaH Day 2. PCI site clean, no haematoma. BP 128/78, HR 76, SpO₂ 96%. DAPT compliance 100%. SMBG range 5.8-8.2. Remote ECG NSR. Daughter trained on bleeding precautions (gums, bruising, dark stools). Medication reconciliation: all 6 cardiac meds confirmed. Low-sodium meal plan reviewed with wife.', nurse: 'Sarah Leung', vitals: 'BP 128/78 | HR 76 | SpO₂ 96% | SMBG 6.8' },
      { date: '2026-07-01', time: '09:00', note: 'Initial HaH assessment Day 1 post-discharge. Post-PCI ×2 (LAD, RCA). PCI site intact — dressing removed, clean dry intact. BP 130/80, HR 78, SpO₂ 95%. KardiaMobile paired and tested — single-lead ECG successful. DAPT education: Aspirin + Clopidogrel timing, never skip, bleeding signs. SMBG technique reviewed — qid log started. Smartwatch + BP cuff RPM sync confirmed. Wife and daughter present. Home environment: lift access, emergency numbers on fridge.', nurse: 'Sarah Leung', vitals: 'BP 130/80 | HR 78 | SpO₂ 95% | Temp 36.7' },
      { date: '2026-07-02', time: '15:00', note: 'Teleconsult support — vitals stable pre-consult. Patient reports no chest pain, slept well. SMBG log reviewed — all readings documented. Confirmed teleconsult with Dr. Chan at 15:00 completed — troponin clearance discussed, continue DAPT.', nurse: 'Sarah Leung', vitals: 'BP 128/78 | HR 76 | SpO₂ 96%' },
    ],
    medications: [
      { drug: 'Aspirin', dose: '100mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'Antiplatelet — DAPT component, secondary prevention post-PCI', startDate: '2026-06-18', status: 'Active' },
      { drug: 'Clopidogrel (Plavix)', dose: '75mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'P2Y12 inhibitor — DAPT ×12 months post-PCI', startDate: '2026-06-18', status: 'Active' },
      { drug: 'Metoprolol', dose: '37.5mg', route: 'PO', frequency: 'Twice daily (AM + PM)', purpose: 'Beta-blocker — post-MI, HR/BP control', startDate: '2026-06-18', status: 'Active' },
      { drug: 'Atorvastatin', dose: '40mg', route: 'PO', frequency: 'Once daily (PM)', purpose: 'High-intensity statin — LDL target <1.8 post-ACS', startDate: '2026-06-18', status: 'Active' },
      { drug: 'Lisinopril', dose: '5mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'ACE inhibitor — post-MI LV remodelling, HTN', startDate: '2026-06-18', status: 'Active' },
      { drug: 'Metformin', dose: '500mg', route: 'PO', frequency: 'Twice daily (AM + PM)', purpose: 'Type 2 DM — glycaemic control', startDate: '2023-05-10', status: 'Active' },
    ],
    iotDevices: [
      { type: 'Blood Pressure Monitor', model: 'Omron HEM-7361T', serial: 'BP-2026-93008', status: 'Connected', battery: 94, parameters: ['Systolic', 'Diastolic', 'Pulse Rate', 'Irregular HB Detection', 'AFib Screening'], lastSync: '25 sec ago' },
      { type: 'Single-Lead ECG', model: 'KardiaMobile 6L', serial: 'ECG-2026-00008', status: 'Connected', battery: 100, parameters: ['Single-Lead ECG', 'NSR Detection', 'ST Change Alert', 'Auto-Upload'], lastSync: '1 min ago' },
      { type: 'Glucometer', model: 'Accu-Chek Guide', serial: 'GL-2026-01008', status: 'Connected', battery: 92, parameters: ['Capillary Glucose (qid)', 'Trend', '7-Day Average', 'Hypo Alert'], lastSync: '45 sec ago' },
    ],
    riskLevel: 'Moderate', readmissionRisk: 18,
  },

  // ═══════════════════════════════════════════════════════════
  // PATIENT 9 — LAM SIU WAN — COPD GOLD Stage 3
  // Prince of Wales Hospital (公立) | Hung Hom | Dr. Lee Mei Ling
  // ═══════════════════════════════════════════════════════════
  {
    id: 9, address: 'Flat 21A, Block 7, Laguna Verde, Hung Hom, Kowloon', name: 'Lam Siu Wan', gender: 'F', age: 68,
    diagnosis: 'COPD GOLD Stage 3 · Chronic Hypoxaemia · Osteoporosis',
    diagnosisCodes: ['J44.1', 'J96.11', 'M81.0', 'I10'],
    allergies: ['Sulfa drugs (rash)'],
    physician: 'Dr. Lee Mei Ling (Respiratory Physician)',
    admittingDiagnosis: 'Acute COPD exacerbation (infective), GOLD Stage 3. 68-year-old female, 40 pack-year smoking history (quit 2022). FEV₁ 36% predicted. Presented with increasing dyspnoea ×3 days, purulent sputum, SpO₂ 88% on room air. ABG: pH 7.34, PaCO₂ 52, PaO₂ 58. Sputum culture: H. influenzae. Treated with IV Ceftriaxone ×5d, Azithromycin ×3d, Prednisolone 40mg taper. Improved Day 4 — SpO₂ 94% on 2L O₂. Chronic hypoxaemia and osteoporosis (T-score -2.8) as comorbidities. Discharged for HaH with home O₂ and pulmonary rehab.',
    clinicalSummary: '68-year-old female with advanced COPD (GOLD 3, FEV₁ 36%), chronic hypoxaemia, and osteoporosis. Post-exacerbation Day 5 HaH. On LAMA/LABA (Tiotropium/Olodaterol Stiolto 2 puffs qd), Salbutamol MDI prn, Prednisolone taper (20mg today), Amoxicillin-clavulanate completing 7-day course. Home O₂ 2L/min prn when SpO₂ <90%. Baseline SpO₂ 92-93% RA, desaturates on exertion. CAT score 22, mMRC Grade 3. Alendronate 70mg weekly for osteoporosis. Son manages O₂ concentrator and action plan. Fall risk elevated — OT assessment scheduled.',
    wardRounds: [
      { date: '2026-07-05', note: 'Virtual ward round HaH Day 3. SpO₂ 93% RA at rest, 91% on 2L with exertion. RR 18. Wheeze improved, sputum mucoid not purulent. Prednisolone 20mg Day 5 of taper. CAT 22. Inhaler technique correct. O₂ concentrator functioning. Continue steroid taper → 10mg tomorrow → stop Day 7. Pulmonary rehab progressing — walked 80m, SpO₂ nadir 89%. LTOT assessment in 2 weeks if SpO₂ persistently <88%.', physician: 'Dr. Lee Mei Ling' },
      { date: '2026-07-03', note: 'Discharge assessment for HaH. SpO₂ 92% RA at rest. ABG compensated. CXR: hyperinflation, no infiltrate. FEV₁ 36% stable. Discharge criteria met: no hypoxia at rest, oral antibiotics ongoing, steroid taper in place. HaH: RN 2×/week, PT pulmonary rehab 2×/week, teleconsult q48h. Home O₂ concentrator delivered and tested. Exacerbation action plan reviewed with son. Alendronate continued — fall prevention OT referral.', physician: 'Dr. Lee Mei Ling' },
    ],
    carePlan: {
      serviceFrequency: 'RN 2×/week (Tue/Fri), PT pulmonary rehab 2×/week (Wed/Sat), Care worker ADL support PRN, Teleconsult q48h',
      visitDuration: '45 minutes (RN) · 50 minutes (PT)',
      goals: [
        'SpO₂ >90% at rest on room air or documented O₂ requirement',
        'Complete Prednisolone taper without rebound exacerbation',
        'Complete 7-day Amoxicillin-clavulanate course',
        'No COPD hospitalisation × 6 months',
        'CAT score <18 by Week 4',
        'Increase 6MWT distance by 30m in 4 weeks',
        'Inhaler technique maintained — correct Stiolto Respimat use',
        'Alendronate compliance + fall prevention measures in place'
      ],
      precautions: [
        'Monitor SpO₂ during all activity — stop if <88%, apply O₂ 2L/min',
        'Home O₂ safety: no smoking, no open flames, secure tubing',
        'Prednisolone taper: do NOT stop abruptly — follow taper schedule',
        'Avoid respiratory irritants (smoke, strong perfumes, cleaning chemicals)',
        'Pursed-lip breathing during exertion',
        'Osteoporosis fall risk — clear pathways, non-slip footwear, grab bars',
        'Annual influenza + pneumococcal vaccines due',
        'Escalation: SpO₂ <88% despite O₂, purulent sputum, fever >38°C, new confusion, RR >30 → call 999'
      ],
      assignedDoctor: 'Dr. Lee Mei Ling (Respiratory Medicine)',
      assignedNurse: 'Jenny Tam (RN)',
      assignedCaseManager: 'Grace Tang (Case Manager)',
      assignedRehabTherapist: 'Raymond Wong (PT)',
      assignedCareWorker: 'Carol Ng',
    },
    nursingRecords: [
      { date: '2026-07-05', time: '09:00', note: 'HaH Day 3 COPD visit. SpO₂ 93% RA, RR 18, HR 86, BP 132/78, Temp 36.5. Breath sounds: decreased bilaterally, mild expiratory wheeze — improving. Sputum mucoid, small volume, not purulent. Prednisolone 20mg taken (taper Day 5). Stiolto Respimat technique correct. O₂ concentrator flow 2L/min verified. Incentive spirometry 10× tolerated. Son present — SpO₂ log reviewed. Care worker Carol Ng assisting with meal prep. PT session yesterday: walked 80m, SpO₂ nadir 89%.', nurse: 'Jenny Tam', vitals: 'SpO₂ 93% | RR 18 | HR 86 | BP 132/78 | Temp 36.5' },
      { date: '2026-07-04', time: '09:00', note: 'HaH Day 2. SpO₂ 93% RA, 91% on 2L O₂ during PT. RR 18. Wheeze improved. Prednisolone 20mg. Amox-clav Day 3 of 7 — no GI upset. O₂ concentrator functioning. Son trained on action plan and O₂ safety checklist posted on fridge. CAT score 22 documented.', nurse: 'Jenny Tam', vitals: 'SpO₂ 93% | RR 18 | HR 86 | BP 132/78' },
      { date: '2026-07-03', time: '10:00', note: 'Initial HaH visit Day 1. SpO₂ 92% RA, RR 20, HR 88, BP 132/78, Temp 36.6. Breath sounds: decreased bilaterally, scattered expiratory wheeze. Home O₂ concentrator installed and tested — 2L/min. Medication reconciliation: Stiolto, Salbutamol, Prednisolone 30mg, Amox-clav confirmed. Alendronate weekly dose due Sunday. Home environment: 21st floor, lift access. Son lives nearby — primary caregiver. Exacerbation action plan posted. Fall risk discussed — OT referral sent.', nurse: 'Jenny Tam', vitals: 'SpO₂ 92% | RR 20 | HR 88 | BP 132/78 | Temp 36.6' },
      { date: '2026-07-04', time: '15:00', note: 'Teleconsult prep — vitals stable. Dr. Lee reviewed SpO₂ trend, steroid taper on track. Continue current plan. Pulmonary rehab re-enrolled.', nurse: 'Jenny Tam', vitals: 'SpO₂ 93% | RR 18 | HR 86' },
    ],
    medications: [
      { drug: 'Tiotropium/Olodaterol (Stiolto Respimat)', dose: '2.5/2.5mcg', route: 'Inhalation', frequency: '2 puffs once daily (AM)', purpose: 'LAMA/LABA — COPD maintenance bronchodilation', startDate: '2022-01-18', status: 'Active' },
      { drug: 'Salbutamol (Ventolin MDI)', dose: '100mcg', route: 'Inhalation', frequency: 'PRN q4-6h for dyspnoea (max 8 puffs/day)', purpose: 'SABA — rescue bronchodilator', startDate: '2022-01-18', status: 'Active' },
      { drug: 'Prednisolone', dose: '40mg → 30mg → 20mg → 10mg → stop', route: 'PO', frequency: 'Once daily (AM) — tapering course (7 days)', purpose: 'Systemic corticosteroid — post-exacerbation taper', startDate: '2026-06-28', status: 'Active' },
      { drug: 'Amoxicillin-clavulanate (Augmentin)', dose: '875/125mg', route: 'PO', frequency: 'Twice daily (AM + PM) — 7-day course', purpose: 'Oral antibiotic — post-IV Ceftriaxone step-down', startDate: '2026-07-01', status: 'Active' },
      { drug: 'Oxygen Therapy', dose: '2L/min', route: 'Nasal cannula', frequency: 'PRN when SpO₂ <90%', purpose: 'Supplemental O₂ — chronic hypoxaemia, LTOT assessment pending', startDate: '2026-07-03', status: 'Active' },
      { drug: 'Alendronate (Fosamax)', dose: '70mg', route: 'PO', frequency: 'Once weekly (Sunday AM, empty stomach)', purpose: 'Bisphosphonate — osteoporosis T-score -2.8', startDate: '2025-11-05', status: 'Active' },
    ],
    iotDevices: [
      { type: 'Pulse Oximeter', model: 'Nonin Bluetooth 3230', serial: 'SP-2026-01009', status: 'Connected', battery: 78, parameters: ['SpO₂ (continuous)', 'HR', 'Perfusion Index'], lastSync: '10 sec ago' },
      { type: 'O₂ Concentrator', model: 'Philips EverFlo', serial: 'O2-2026-01009', status: 'Connected', battery: 100, parameters: ['Flow Rate (L/min)', 'FiO₂', 'Hours Used', 'SpO₂ Feedback'], lastSync: '2 min ago' },
      { type: 'Blood Pressure Monitor', model: 'Omron HEM-7361T', serial: 'BP-2026-93009', status: 'Connected', battery: 90, parameters: ['Systolic', 'Diastolic', 'Pulse Rate'], lastSync: '30 sec ago' },
    ],
    riskLevel: 'High', readmissionRisk: 15,
  },

  // ═══════════════════════════════════════════════════════════
  // PATIENT 10 — CHEUNG SIU MING — Acute Ischaemic Stroke L MCA
  // PYNEH (公立) | Chai Wan | Dr. Cheung Kwok Wai
  // ═══════════════════════════════════════════════════════════
  {
    id: 10, address: 'Flat 9D, Block 2, Heng Fa Chuen, Chai Wan, Hong Kong Island', name: 'Cheung Siu Ming', gender: 'M', age: 76,
    diagnosis: 'Acute Ischaemic Stroke (L MCA) · Right Hemiparesis · Dysphagia Resolving · HTN',
    diagnosisCodes: ['I63.512', 'I69.351', 'R13.10', 'I10'],
    allergies: ['NKDA'],
    physician: 'Dr. Cheung Kwok Wai (Neurologist)',
    admittingDiagnosis: 'Acute ischaemic stroke — left MCA territory. 76-year-old male with HTN. Witnessed onset: acute right-sided weakness, facial droop, slurred speech ×2h. NIHSS 10 on admission. CT: no haemorrhage. CTA: L MCA M1 occlusion. CTP: penumbra 42mL, core 18mL. IV Alteplase 0.9mg/kg (door-to-needle 38min). NIHSS improved to 6 at 24h, 4 at discharge. Right hemiparesis RUE 3+/5, RLE 4-/5. Dysphagia — IDDSI Level 5 minced moist. mRS 3. DAPT bridging ×21 days. Discharged Day 10 for HaH intensive rehab.',
    clinicalSummary: '76-year-old male post-L MCA stroke (thrombolysed), NIHSS 4 stable. Right hemiparesis improving with PT — RUE 3+/5, RLE 4-/5. Speech 85% intelligible, dysarthria mild. IDDSI Level 5 diet tolerated, no aspiration on water test. On Aspirin 100mg + Clopidogrel 75mg (DAPT ×21d), Atorvastatin 40mg, Perindopril 4mg, Amlodipine 5mg. BP 142/86 — target <140/90 for secondary prevention. Wife primary caregiver, trained on transfers and NIHSS observation. Fall risk HIGH — walker for ambulation, grab bars installed. Key concerns: DAPT bleeding, fall prevention, aspiration risk, caregiver fatigue.',
    wardRounds: [
      { date: '2026-07-08', note: 'Virtual ward round HaH Day 3. NIHSS 4 stable (facial droop 1, R arm 1, dysarthria 1, extinction 1). RUE 3+/5 improving. Speech 85% intelligible. IDDSI 5 tolerated — no coughing. BP 142/86. DAPT Day 8 — no bleeding. PT: walked 15m with walker + assist ×2. OT: ADL assessment progressing. ST: word-finding exercises. Continue current plan. Neuro clinic F/U 4 weeks. Repeat NIHSS weekly.', physician: 'Dr. Cheung Kwok Wai' },
      { date: '2026-07-06', note: 'Discharge assessment for HaH. NIHSS 4. Mobilising with walker and supervision. Dysphagia improved — IDDSI 5 safe. BP 138/84. Discharge criteria met: medically stable, caregiver trained, home safe. HaH: RN 3×/week, PT 3×/week, ST 2×/week, teleconsult q48h. DAPT education, stroke warning signs (FAST), fall prevention. Home modifications: grab bars, bedside commode, fall alarm on smartwatch.', physician: 'Dr. Cheung Kwok Wai' },
    ],
    carePlan: {
      serviceFrequency: 'RN 3×/week (Mon/Wed/Fri), PT 3×/week, ST 2×/week, Care worker ADL 2×/day, Teleconsult q48h',
      visitDuration: '60 minutes (RN/PT) · 45 minutes (ST)',
      goals: [
        'NIHSS ≤3 by Week 4 — functional recovery',
        'RUE strength 4/5, independent transfers with walker by Week 6',
        'Speech intelligibility >90% — return to conversation level',
        'IDDSI Level 7 (regular) diet by Week 4 if swallow safe',
        'Zero falls during HaH period',
        'DAPT compliance ×21 days then transition to ASA monotherapy',
        'BP <140/90 consistently',
        'Caregiver demonstrates safe transfer technique + NIHSS observation + FAST signs'
      ],
      precautions: [
        'Fall risk HIGH — walker for ALL ambulation, never unsupervised walking',
        'DAPT: report bleeding, gum bleeding, easy bruising immediately',
        'Aspiration precautions — upright 30 min post-meal, IDDSI 5 only until ST clearance',
        'BP monitoring BID — avoid hypotension (cerebral perfusion)',
        'NO NSAIDs — paracetamol only',
        'Report new weakness, speech change, vision loss, severe headache (FAST+) → call 999',
        'Enforce medication timing — Perindopril AM, DAPT with meals',
        'Escalation: NIHSS increase ≥2 points, fall with head strike, aspiration event → urgent review'
      ],
      assignedDoctor: 'Dr. Cheung Kwok Wai (Neurology)',
      assignedNurse: 'Sarah Leung (RN)',
      assignedCaseManager: 'Anna Leung (Case Manager)',
      assignedRehabTherapist: 'Michael Kwok (PT)',
      assignedCareWorker: 'Peter Kwan',
    },
    nursingRecords: [
      { date: '2026-07-08', time: '09:00', note: 'HaH Day 3 stroke visit. NIHSS 4 stable. BP 142/86, HR 82, SpO₂ 97%, Temp 36.7. RUE 3+/5, RLE 4-/5. Facial droop mild. Speech 85% intelligible. IDDSI 5 lunch tolerated — no coughing, no wet voice. DAPT taken — no bleeding signs (gums, skin, urine clear). Walker ambulation 15m ×2 with wife assist — steady gait, no near-falls. Grab bars secure. Fall alarm on smartwatch active. Medication reconciliation complete. Care worker Peter Kwan assisting PM ADLs.', nurse: 'Sarah Leung', vitals: 'BP 142/86 | HR 82 | SpO₂ 97% | NIHSS 4 | Temp 36.7' },
      { date: '2026-07-07', time: '09:30', note: 'HaH Day 2. NIHSS 4. BP 140/84, HR 84. PT session: sit-to-stand ×10, balance exercises. RUE improving. Wife demonstrated correct transfer technique — praised. Swallow: no issues with IDDSI 5 meals. DAPT compliance confirmed.', nurse: 'Sarah Leung', vitals: 'BP 140/84 | HR 84 | SpO₂ 97% | NIHSS 4' },
      { date: '2026-07-06', time: '10:00', note: 'Initial HaH assessment Day 1. NIHSS 4. BP 142/86, HR 82, SpO₂ 97%. Home safety: grab bars installed, pathways clear, bedside commode in place. DAPT education completed. FAST stroke warning signs reviewed with wife. Walker fitted — proper height confirmed. Medication reconciliation: ASA, Clopidogrel, Atorvastatin, Perindopril, Amlodipine. Fall alarm paired on smartwatch.', nurse: 'Sarah Leung', vitals: 'BP 142/86 | HR 82 | SpO₂ 97% | NIHSS 4 | Temp 36.7' },
      { date: '2026-07-07', time: '14:00', note: 'ST session support — speech improving. Word-finding exercises 30min. Wife present for communication strategies training. No aspiration signs during session.', nurse: 'Sarah Leung', vitals: 'SpO₂ 97% | HR 80' },
    ],
    medications: [
      { drug: 'Aspirin', dose: '100mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'Antiplatelet — DAPT component, secondary stroke prevention', startDate: '2026-06-25', status: 'Active' },
      { drug: 'Clopidogrel (Plavix)', dose: '75mg', route: 'PO', frequency: 'Once daily (AM) — ×21 days then stop', purpose: 'P2Y12 inhibitor — early secondary prevention post-stroke', startDate: '2026-06-25', status: 'Active' },
      { drug: 'Atorvastatin', dose: '40mg', route: 'PO', frequency: 'Once daily (PM)', purpose: 'High-intensity statin — LDL target <1.8 post-stroke', startDate: '2026-06-25', status: 'Active' },
      { drug: 'Perindopril', dose: '4mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'ACE inhibitor — BP control, stroke secondary prevention', startDate: '2023-08-12', status: 'Active' },
      { drug: 'Amlodipine', dose: '5mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'CCB — HTN', startDate: '2023-08-12', status: 'Active' },
    ],
    iotDevices: [
      { type: 'Blood Pressure Monitor', model: 'Omron HEM-7361T', serial: 'BP-2026-93010', status: 'Connected', battery: 91, parameters: ['Systolic', 'Diastolic', 'Pulse Rate', 'Irregular HB Detection'], lastSync: '28 sec ago' },
      { type: 'Gait Analysis Sensor', model: 'GaitKeeper Pro', serial: 'GK-2026-01010', status: 'Connected', battery: 76, parameters: ['Step Symmetry', 'Cadence', 'Walk Distance', 'Fall Risk Score'], lastSync: '1 min ago' },
      { type: 'mmWave Radar Mattress', model: 'SenseLife Pro', serial: 'SL-2026-01010', status: 'Syncing', battery: 100, parameters: ['Respiratory Rate', 'Sleep Duration', 'Bed Exit Alerts', 'Night Movement'], lastSync: '8 sec ago' },
    ],
    riskLevel: 'High', readmissionRisk: 20,
  },

  // ═══════════════════════════════════════════════════════════
  // PATIENT 11 — WONG LAI CHUN — Breast Ca post-lumpectomy
  // HK Sanatorium & Hospital (私家) | Kennedy Town | Dr. Chan Chi Keung
  // ═══════════════════════════════════════════════════════════
  {
    id: 11, address: 'Flat 2F, Tower 5, The Belcher\'s, Kennedy Town, Hong Kong Island', name: 'Wong Lai Chun', gender: 'F', age: 62,
    diagnosis: 'Invasive Ductal Carcinoma (L) Stage IIB · Post-lumpectomy + SLNB · Adjuvant Chemo Pending',
    diagnosisCodes: ['C50.912', 'Z90.13', 'Z85.3'],
    allergies: ['NKDA'],
    physician: 'Dr. Chan Chi Keung (Breast Surgery / Oncology Liaison)',
    admittingDiagnosis: 'Post-operative recovery — left breast lumpectomy + sentinel lymph node biopsy for invasive ductal carcinoma. 62-year-old female. Pathology: IDC 2.4cm Grade 2, ER+/PR+/HER2- (Luminal A), clear margins 3mm, SLNB 0/3 positive. pT2N0M0 Stage IIB. POD3 at discharge. Jackson-Pratt drain in situ, output decreasing (35mL/day). Wound clean, no haematoma. Hb 11.2 post-op. Pain NRS 2/10 on paracetamol. Adjuvant AC-T chemotherapy ×8 cycles planned — port-a-cath before Cycle 1. Discharged for HaH wound and drain management.',
    clinicalSummary: '62-year-old female post-lumpectomy for ER+/PR+/HER2- IDC Stage IIB, node-negative — excellent prognosis (Luminal A). POD5 HaH. Wound clean, drain output 28mL/day (approaching removal threshold <30mL). Pain NRS 2/10, controlled on paracetamol PRN. Hb 11.2 — mild post-op anaemia, tolerating activity. Husband primary caregiver, trained on drain care and dressing. Oncology appointment 2026-07-10 for chemo planning (AC-T ×8). Psychological support resources provided. Key concerns: drain removal timing, wound infection prevention, chemo preparation (port-a-cath), emotional wellbeing during cancer journey.',
    wardRounds: [
      { date: '2026-07-04', note: 'Virtual ward round HaH Day 3. POD5. Wound clean, no erythema or discharge. Drain output 28mL/24h — approaching removal criteria (<30mL ×2 consecutive days). Pain NRS 2/10. Afebrile. Arm ROM exercises tolerated — no lymphoedema signs. Continue wound care BID. Plan drain removal when output <30mL tomorrow. Oncology appointment confirmed 2026-07-10. Port-a-cath scheduling discussed. Husband coping well — psychological support number provided.', physician: 'Dr. Chan Chi Keung' },
      { date: '2026-07-02', note: 'Discharge assessment for HaH. POD3. Drain output 35mL/day, decreasing. Wound intact, steri-strips in place. Pain controlled. Afebrile. Discharge criteria met: stable vitals, oral analgesia effective, caregiver trained on drain care. HaH: oncology nurse weekly, wound care RN 2×/week, teleconsult q48h. Return precautions: fever, increasing drain output, wound redness/swelling, arm swelling. Photograph wound daily.', physician: 'Dr. Chan Chi Keung' },
    ],
    carePlan: {
      serviceFrequency: 'RN wound care 2×/week (Mon/Thu), Oncology nurse weekly, PT arm mobility 1×/week, Teleconsult q48h',
      visitDuration: '45 minutes (RN) · 30 minutes (PT)',
      goals: [
        'Drain removed when output <30mL/24h ×2 consecutive days',
        'Wound healed, steri-strips off by Week 2',
        'Pain NRS 0/10 by Week 2',
        'No surgical site infection throughout HaH period',
        'Arm ROM full — no lymphoedema development',
        'Oncology appointment attended — chemo plan confirmed',
        'Port-a-cath placed before Cycle 1 chemotherapy',
        'Patient/caregiver demonstrates drain care + wound assessment + return precautions'
      ],
      precautions: [
        'Drain care: measure output q12h, record in log — report sudden increase or purulent fluid',
        'Wound care BID: inspect for erythema, warmth, swelling, discharge',
        'Photograph wound daily for comparison',
        'No heavy lifting >2kg with affected arm ×2 weeks',
        'Arm exercises as per PT — pendulum, wall walk, no overhead until cleared',
        'Report fever >38°C, increasing pain, arm swelling immediately',
        'No blood draws or BP on affected arm',
        'Escalation: fever, wound dehiscence, drain output >50mL sudden increase, lymphoedema → call 999 if systemic'
      ],
      assignedDoctor: 'Dr. Chan Chi Keung (Breast Surgery)',
      assignedNurse: 'Angela Ng (RN)',
      assignedCaseManager: 'Grace Tang (Case Manager)',
      assignedRehabTherapist: 'Shirley Fong (PT)',
    },
    nursingRecords: [
      { date: '2026-07-04', time: '11:00', note: 'HaH Day 3 wound visit POD5. Wound clean, steri-strips intact, no erythema. Drain output 28mL/24h (↓ from 35mL). Pain NRS 2/10 — paracetamol 1g taken AM. BP 118/72, HR 78, SpO₂ 98%, Temp 36.5. Arm ROM: forward flexion 140°, abduction 120° — improving. No lymphoedema, no cording. Dressing changed — saline cleanse, dry sterile gauze. Husband demonstrated correct drain measurement — accurate. Wound photo taken (comparison: stable). Oncology appt 2026-07-10 confirmed. Emotional check-in: patient anxious about chemo — support group info given.', nurse: 'Angela Ng', vitals: 'BP 118/72 | HR 78 | SpO₂ 98% | Temp 36.5 | Drain 28mL | Pain 2/10' },
      { date: '2026-07-03', time: '11:00', note: 'HaH Day 2. Drain output 32mL/24h. Wound clean. Pain NRS 2/10. Husband trained on dressing change technique — competent. Arm exercises reviewed with Shirley Fong PT referral note. Afebrile.', nurse: 'Angela Ng', vitals: 'BP 120/74 | HR 76 | SpO₂ 98% | Temp 36.5 | Drain 32mL' },
      { date: '2026-07-02', time: '10:00', note: 'Initial HaH wound nurse visit Day 1 POD3. Drain output 35mL. Wound intact, minimal serous drainage. BP 118/72, HR 78, Temp 36.5. Medication reconciliation: paracetamol PRN only. Drain care education: measurement, emptying, signs of infection. Husband trained — confident. Low-effort meal plan discussed. Return precautions posted on fridge.', nurse: 'Angela Ng', vitals: 'BP 118/72 | HR 78 | SpO₂ 98% | Temp 36.5 | Drain 35mL' },
      { date: '2026-07-04', time: '15:00', note: 'Teleconsult support — Dr. Chan reviewed wound photo. Drain likely removable tomorrow if output <30mL. Continue current care plan.', nurse: 'Angela Ng', vitals: 'Temp 36.5 | Pain 2/10' },
    ],
    medications: [
      { drug: 'Paracetamol', dose: '1g', route: 'PO', frequency: 'PRN q6h for pain (max 4g/day)', purpose: 'Analgesic — post-operative pain control', startDate: '2026-06-28', status: 'Active' },
      { drug: 'Cephalexin', dose: '500mg', route: 'PO', frequency: 'Three times daily — completed 5-day course', purpose: 'Prophylactic antibiotic — post-surgical', startDate: '2026-06-28', status: 'Discontinued' },
      { drug: 'Ondansetron', dose: '4mg', route: 'PO', frequency: 'PRN q8h for nausea (max 3 doses/day)', purpose: 'Antiemetic — post-op and pre-chemo symptom relief', startDate: '2026-06-28', status: 'Active' },
      { drug: 'Lorazepam', dose: '0.5mg', route: 'PO', frequency: 'PRN at bedtime for anxiety/sleep', purpose: 'Anxiolytic — pre-chemo anxiety management', startDate: '2026-07-02', status: 'Active' },
      { drug: 'Calcium + Vitamin D', dose: '600mg + 400 IU', route: 'PO', frequency: 'Twice daily (AM + PM)', purpose: 'Bone health — osteoporosis prevention during endocrine therapy planning', startDate: '2026-06-15', status: 'Active' },
    ],
    iotDevices: [
      { type: 'Infrared Wound Camera', model: 'MolecuLight i:X', serial: 'WC-2026-01011', status: 'Connected', battery: 90, parameters: ['Wound Size (cm)', 'Fluorescence Imaging', 'Area Tracking', 'Healing Progress'], lastSync: '2 min ago' },
      { type: 'Infrared Thermometer', model: 'Braun BNT400 Bluetooth', serial: 'TH-2026-01011', status: 'Connected', battery: 93, parameters: ['Temperature', 'Trend', 'Fever Alert'], lastSync: '3 min ago' },
      { type: 'Blood Pressure Monitor', model: 'Omron HEM-7361T', serial: 'BP-2026-93011', status: 'Connected', battery: 95, parameters: ['Systolic', 'Diastolic', 'Pulse Rate'], lastSync: '30 sec ago' },
    ],
    riskLevel: 'Moderate', readmissionRisk: 12,
  },

  // ═══════════════════════════════════════════════════════════
  // PATIENT 12 — FOK WAI KEUNG — Heart Failure NYHA III EF 32%
  // Queen Mary Hospital (公立) | Tseung Kwan O | Dr. Chan Chi Keung
  // ═══════════════════════════════════════════════════════════
  {
    id: 12, address: 'Flat 11B, Block 4, Metro City Phase 2, Tseung Kwan O, New Territories', name: 'Fok Wai Keung', gender: 'M', age: 69,
    diagnosis: 'Heart Failure NYHA III · Ischemic Cardiomyopathy · EF 32% · AF Rate Controlled · CKD Stage 3',
    diagnosisCodes: ['I50.22', 'I48.91', 'N18.3', 'I25.10'],
    allergies: ['ACE Inhibitors (dry cough — prior trial)'],
    physician: 'Dr. Chan Chi Keung (Cardiologist)',
    admittingDiagnosis: 'Acute decompensated heart failure NYHA III. 69-year-old male with ischemic cardiomyopathy post-anterior STEMI 2024 (EF 35%→32%), permanent AF, CKD Stage 3. Presented with progressive dyspnoea, orthopnoea, bilateral pedal oedema ×1 week, weight gain 3kg. BNP 1850. Echo: EF 32%, severe anterior hypokinesis, moderate MR, dilated LA. CXR: pulmonary congestion, Kerley B lines, small pleural effusions. IV Furosemide 80mg BID ×3 days — net -3.2L/72h. Weight 72→68kg. Oedema 2+→trace. Transitioned to oral Furosemide 40mg. Discharged euvolemic for HaH HF monitoring.',
    clinicalSummary: '69-year-old male with HFrEF (EF 32%) post-STEMI, permanent AF on Apixaban, CKD3 (eGFR 48). Recently decompensated — now euvolemic at 68.2kg (dry weight target 67-68kg). GDMT: Entresto 97/103mg BID, Bisoprolol 5mg, Spironolactone 25mg, Empagliflozin 10mg, Apixaban 5mg BID, Furosemide 40mg flexible. BNP 620 (↓ from 1850). BP 108/68 — orthostatic precautions. SpO₂ 94%. Daughter manages daily weight log and fluid restriction (1.5L/day). Highest NEWS vigilance in cardiac cohort (NEWS Low 1). Key: daily weight, strict I/O, renal panel q2w, K⁺ monitoring with MRA + Entresto.',
    wardRounds: [
      { date: '2026-07-06', note: 'Virtual ward round HaH Day 3. Weight 68.2kg stable (target <68.5). No orthopnoea. Pedal oedema trace. BP 108/68, HR 84 AF, SpO₂ 94%. BNP trending down. Breath sounds: clear bases. Cr 124, K⁺ 4.6 — stable. Continue GDMT. Fluid 1.5L/day. Daily weight essential. Renal panel Wednesday. Daughter reports excellent compliance. Cardiac rehab modified programme — seated exercises only.', physician: 'Dr. Chan Chi Keung' },
      { date: '2026-07-04', note: 'Discharge assessment for HaH. Euvolemic at 68kg. No DOE at rest. Oedema trace. Oral Furosemide 40mg. GDMT at target doses. Discharge criteria met: decongested, stable renal function, oral diuretic responsive. HaH: RN 3×/week, daily weight telehealth, teleconsult q48h, PT modified cardiac rehab. Fluid 1.5L, Na<2g. Cardiology clinic 2 weeks. NEWS Low (1) — highest HF vigilance in cohort.', physician: 'Dr. Chan Chi Keung' },
    ],
    carePlan: {
      serviceFrequency: 'RN 3×/week (Mon/Wed/Fri), Daily weight telehealth upload, PT modified cardiac rehab 2×/week, Care worker PM support, Teleconsult q48h',
      visitDuration: '50 minutes (RN) · 45 minutes (PT)',
      goals: [
        'Maintain dry weight 67-68kg — report gain >1kg/24h immediately',
        'No hospital readmission for HF decompensation × 6 months',
        'BNP <500 by Week 4',
        'SpO₂ >92% at rest on room air',
        'Renal function stable: Cr <140, K⁺ 3.5-5.0, eGFR >40',
        'GDMT compliance 100% — zero missed doses',
        'Orthostatic BP stable — no symptomatic hypotension',
        'Patient/caregiver demonstrates daily weight log + fluid restriction + escalation criteria'
      ],
      precautions: [
        'Daily weight same time, same scale, same clothing — report gain >1kg/24h or >2kg/72h',
        'Fluid restriction 1.5L/day — measured water bottle',
        'Low sodium diet <2g/day',
        'Monitor for orthostatic hypotension — assist with ambulation',
        'Fall risk HIGH — Morse Fall Scale qvisit',
        'Renal panel + K⁺ q2w (Monday schedule)',
        'AF rate control — report HR >110 or <50',
        'Escalation: SpO₂ <90%, weight gain >2kg/24h, new orthopnoea, chest pain, confusion → call 999'
      ],
      assignedDoctor: 'Dr. Chan Chi Keung (Cardiology)',
      assignedNurse: 'Sarah Leung (RN)',
      assignedCaseManager: 'Peter Ho (Case Manager)',
      assignedRehabTherapist: 'David Chan (PT)',
      assignedCareWorker: 'Lisa Cheng',
    },
    nursingRecords: [
      { date: '2026-07-06', time: '09:00', note: 'HaH Day 3 HF visit. Weight 68.2kg (stable, target <68.5). BP 108/68, HR 84 AF, SpO₂ 94%, RR 18, Temp 36.6. Pedal oedema: trace. JVP not elevated. Breath sounds: clear bases, no crackles. GDMT administered — Entresto, Bisoprolol, Spironolactone, Empagliflozin, Apixaban confirmed. I/O review: intake 1,420mL, output 1,580mL — net -160mL. Daughter weight log accurate — praised. Orthostatic check: lying 108/68 → standing 102/64 (6mmHg drop, no symptoms). Renal panel due Wednesday. Care worker Lisa Cheng PM visit for meal prep.', nurse: 'Sarah Leung', vitals: 'Weight 68.2kg | BP 108/68 | HR 84 | SpO₂ 94% | Net -160mL' },
      { date: '2026-07-05', time: '09:30', note: 'HaH Day 2. Weight 68.0kg (↓0.2kg). BP 110/70, HR 82 AF, SpO₂ 94%. Oedema trace. GDMT compliance 100%. Daughter trained on fluid restriction (1.5L measured bottle). Smart scale telehealth upload confirmed. Low-sodium meal examples provided.', nurse: 'Sarah Leung', vitals: 'Weight 68.0kg | BP 110/70 | HR 82 | SpO₂ 94%' },
      { date: '2026-07-04', time: '10:00', note: 'Initial HaH assessment Day 1. Weight 68.0kg post-discharge. BP 108/68, HR 84, SpO₂ 94%. Medication reconciliation: 6 GDMT drugs confirmed. Daughter present — trained on weight scale, I/O chart, emergency escalation. Fluid restriction education. Home environment: recliner for leg elevation. Fall precautions discussed.', nurse: 'Sarah Leung', vitals: 'Weight 68.0kg | BP 108/68 | HR 84 | SpO₂ 94% | Temp 36.6' },
      { date: '2026-07-05', time: '16:00', note: 'Teleconsult prep — weight stable, no orthopnoea. Dr. Chan reviewed — continue current regimen. BNP recheck Week 2.', nurse: 'Sarah Leung', vitals: 'Weight 68.0kg | BP 110/70 | SpO₂ 94%' },
    ],
    medications: [
      { drug: 'Sacubitril/Valsartan (Entresto)', dose: '97/103mg', route: 'PO', frequency: 'Twice daily (AM + PM)', purpose: 'ARNI — HFrEF GDMT, mortality reduction', startDate: '2024-09-10', status: 'Active' },
      { drug: 'Bisoprolol', dose: '5mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'Beta-blocker — HFrEF, AF rate control', startDate: '2024-09-10', status: 'Active' },
      { drug: 'Spironolactone', dose: '25mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'MRA — HFrEF GDMT, monitor K⁺', startDate: '2024-09-10', status: 'Active' },
      { drug: 'Empagliflozin (Jardiance)', dose: '10mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'SGLT2i — HFrEF + CKD benefit', startDate: '2026-06-28', status: 'Active' },
      { drug: 'Apixaban (Eliquis)', dose: '5mg', route: 'PO', frequency: 'Twice daily (AM + PM)', purpose: 'DOAC — stroke prevention in AF', startDate: '2024-09-10', status: 'Active' },
      { drug: 'Furosemide (Lasix)', dose: '40mg', route: 'PO', frequency: 'Once daily (AM) — flexible per weight', purpose: 'Loop diuretic — maintain euvolemia', startDate: '2026-07-03', status: 'Active' },
    ],
    iotDevices: [
      { type: 'Smart Weight Scale', model: 'Omron HN-290T', serial: 'WS-2026-01012', status: 'Connected', battery: 96, parameters: ['Weight (kg)', 'BMI', 'Trend', 'Telehealth Upload'], lastSync: '30 sec ago' },
      { type: 'Blood Pressure Monitor', model: 'Omron HEM-7361T', serial: 'BP-2026-93012', status: 'Connected', battery: 92, parameters: ['Systolic', 'Diastolic', 'Pulse Rate', 'Irregular HB Detection', 'AFib Screening'], lastSync: '25 sec ago' },
      { type: 'Urine Output Monitor', model: 'FoleyConnect UO-200', serial: 'UO-2026-01012', status: 'Connected', battery: 94, parameters: ['24h Total Output', 'I/O Balance', 'Trend'], lastSync: '1 min ago' },
      { type: 'mmWave Radar Mattress', model: 'SenseLife Pro', serial: 'SL-2026-01012', status: 'Syncing', battery: 100, parameters: ['Respiratory Rate', 'Sleep Duration', 'Orthopnoea Detection', 'Bed Exit Alerts'], lastSync: '5 sec ago' },
    ],
    riskLevel: 'High', readmissionRisk: 28,
  },

  // ═══════════════════════════════════════════════════════════
  // PATIENT 13 — LAU WAI YIN — T2DM / Nephropathy / NPDR
  // Kwong Wah Hospital (公立) | Wong Tai Sin | Dr. Cheung Kwok Wai
  // ═══════════════════════════════════════════════════════════
  {
    id: 13, address: 'Flat 5A, Block 8, Choi Hung Estate, Wong Tai Sin, Kowloon', name: 'Lau Wai Yin', gender: 'F', age: 55,
    diagnosis: 'Type 2 DM · Diabetic Nephropathy · Mild NPDR · Obesity BMI 32',
    diagnosisCodes: ['E11.22', 'E11.319', 'E66.01', 'N18.2'],
    allergies: ['NKDA'],
    physician: 'Dr. Cheung Kwok Wai (Endocrinologist)',
    admittingDiagnosis: 'Mild diabetic ketoacidosis (DKA) on background of poorly controlled T2DM. 55-year-old female. Presented with polyuria, polydipsia, blurred vision ×1 week. CBG 18.6 mmol/L, ketones 2.8, pH 7.31, HCO₃ 18, anion gap 16. HbA1c 9.2%. Diabetic nephropathy UACR 320, eGFR 72. Mild NPDR on fundoscopy. Obesity BMI 32 (82kg). DKA resolved in 12h with IV insulin infusion → transitioned to SC basal-bolus (Glargine 20u + Lispro 6u AC). Discharged on Day 8 with improving glycaemic control CBG 6-10.',
    clinicalSummary: '55-year-old female post-DKA with T2DM (HbA1c 9.2%), diabetic nephropathy (UACR 320), mild NPDR, obesity BMI 32. HaH Day 3. Basal-bolus insulin: Glargine 20u hs + Lispro 6u AC. CBG range 6-10 mmol/L, no hypoglycaemia. Ketones negative. On Metformin 1g BID, Empagliflozin 10mg, Lisinopril 10mg (renoprotection), Atorvastatin 20mg. Brother supervises insulin and SMBG qid. Foot monofilament 8/10 — protective sensation intact. Target HbA1c <7.0% in 3 months. Renal dietitian, podiatry monthly, retinal q6m. Weight management programme enrolled.',
    wardRounds: [
      { date: '2026-07-07', note: 'Virtual ward round HaH Day 3. CBG 6.2-9.8 mmol/L on basal-bolus. No hypoglycaemia. Ketones negative. BP 138/82. UACR 320 — nephrology F/U scheduled. Foot check: no ulcers, monofilament 8/10. Weight 81.5kg (↓0.5kg). Insulin technique verified by RN. Continue current regimen. DM educator visit Friday. HbA1c recheck 3 months. Sick day rules reviewed.', physician: 'Dr. Cheung Kwok Wai' },
      { date: '2026-07-05', note: 'Discharge assessment for HaH. CBG 6-10 on basal-bolus. No hypos. Ketones negative. DKA fully resolved. Discharge criteria met: stable glycaemic control, insulin tolerated, caregiver trained. HaH: DM educator weekly, RN q2d ×1 week then 2×/week, SMBG qid telehealth, teleconsult q48h. Renal dietitian, podiatry monthly. Brother as caregiver — insulin supervision.', physician: 'Dr. Cheung Kwok Wai' },
    ],
    carePlan: {
      serviceFrequency: 'RN 2×/week, DM educator weekly, Care worker meal prep support, Teleconsult q48h, Podiatry monthly',
      visitDuration: '45 minutes (RN) · 60 minutes (DM educator)',
      goals: [
        'CBG fasting 4-7 mmol/L, pre-meal 4-10 mmol/L, bedtime 5-8 mmol/L',
        'HbA1c <7.0% by 3 months (from 9.2%)',
        'Zero DKA recurrence — ketones check when unwell',
        'No severe hypoglycaemia (<3.0 mmol/L)',
        'Weight reduction 0.5-1kg/week — target BMI <30',
        'UACR stable or improving on Lisinopril + Empagliflozin',
        'Foot inspection daily — no new ulcers',
        'Patient/caregiver demonstrates insulin technique + SMBG + sick day rules'
      ],
      precautions: [
        'SMBG qid — fasting, pre-lunch, pre-dinner, bedtime — upload to telehealth',
        'Insulin storage: fridge 2-8°C, room temp ×28 days once opened',
        'Hypoglycaemia kit: glucose tablets, juice — treat <4 mmol/L immediately',
        'Sick day rules: never stop insulin, check ketones if unwell, hydrate, contact HaH team',
        'Renal diet: protein moderation, Na<2g, avoid nephrotoxic agents (NSAIDs)',
        'Foot inspection daily — report any break in skin immediately',
        'Empagliflozin: genital hygiene, report UTI symptoms, hold if dehydrated',
        'Escalation: CBG >15, ketones positive, vomiting, confusion → call 999'
      ],
      assignedDoctor: 'Dr. Cheung Kwok Wai (Endocrinology)',
      assignedNurse: 'Connie Cheung (RN)',
      assignedCaseManager: 'Anna Leung (Case Manager)',
      assignedCareWorker: 'Derek Ho',
    },
    nursingRecords: [
      { date: '2026-07-07', time: '10:00', note: 'HaH Day 3 DM visit. CBG fasting 6.2, pre-lunch 8.4 mmol/L. No hypoglycaemia episodes. Ketones negative (urine dipstick). BP 138/82, HR 88, SpO₂ 97%, Temp 36.6. Weight 81.5kg (↓0.5kg). Insulin technique verified — Glargine 20u hs, Lispro 6u AC correct. Foot inspection: no ulcers, monofilament 8/10 intact, pulses palpable. Brother present — SMBG log reviewed, all qid readings documented. Sick day rules card on fridge. Care worker Derek Ho assisting renal-friendly meal prep.', nurse: 'Connie Cheung', vitals: 'CBG 6.2-8.4 | BP 138/82 | HR 88 | Weight 81.5kg | Ketones neg' },
      { date: '2026-07-06', time: '10:00', note: 'HaH Day 2. CBG 6.8-9.2 range. Insulin administration supervised — brother competent. Renal dietitian meal plan reviewed. UACR 320 discussed — Lisinopril for renoprotection. Foot monofilament test 8/10.', nurse: 'Connie Cheung', vitals: 'CBG 6.8-9.2 | BP 136/80 | HR 86 | SpO₂ 97%' },
      { date: '2026-07-05', time: '11:00', note: 'Initial HaH assessment Day 1 post-DKA. CBG 7.2 fasting. BP 138/82, HR 88. Medication reconciliation: Glargine, Lispro, Metformin, Empagliflozin, Lisinopril, Atorvastatin. Brother trained on insulin pen technique, SMBG, hypoglycaemia treatment. Insulin stored correctly in fridge. Sharps container provided.', nurse: 'Connie Cheung', vitals: 'CBG 7.2 | BP 138/82 | HR 88 | SpO₂ 97% | Temp 36.6' },
      { date: '2026-07-06', time: '14:00', note: 'Teleconsult support — glycaemic control improving. Dr. Cheung reviewed SMBG log — continue current insulin doses. DM educator Friday confirmed.', nurse: 'Connie Cheung', vitals: 'CBG 7.4 | BP 136/80' },
    ],
    medications: [
      { drug: 'Insulin Glargine (Lantus)', dose: '20 units', route: 'SC', frequency: 'Once daily at bedtime (hs)', purpose: 'Basal insulin — glycaemic control post-DKA', startDate: '2026-07-04', status: 'Active' },
      { drug: 'Insulin Lispro (Humalog)', dose: '6 units', route: 'SC', frequency: 'Before each main meal (AC)', purpose: 'Bolus insulin — prandial glucose control', startDate: '2026-07-04', status: 'Active' },
      { drug: 'Metformin', dose: '1g', route: 'PO', frequency: 'Twice daily (AM + PM)', purpose: 'Oral antidiabetic — insulin sensitiser', startDate: '2024-06-10', status: 'Active' },
      { drug: 'Empagliflozin (Jardiance)', dose: '10mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'SGLT2i — glycaemic control + renoprotection', startDate: '2024-06-10', status: 'Active' },
      { drug: 'Lisinopril', dose: '10mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'ACE inhibitor — diabetic nephropathy renoprotection', startDate: '2026-06-26', status: 'Active' },
      { drug: 'Atorvastatin', dose: '20mg', route: 'PO', frequency: 'Once daily (PM)', purpose: 'Statin — CV risk reduction in DM', startDate: '2024-06-10', status: 'Active' },
    ],
    iotDevices: [
      { type: 'Glucometer', model: 'Accu-Chek Guide', serial: 'GL-2026-01013', status: 'Connected', battery: 94, parameters: ['Capillary Glucose (qid)', 'Trend', '7-Day Average', 'Telehealth Upload', 'Hypo Alert'], lastSync: '20 sec ago' },
      { type: 'Smart Weight Scale', model: 'Omron HN-290T', serial: 'WS-2026-01013', status: 'Connected', battery: 91, parameters: ['Weight (kg)', 'BMI', 'Body Fat %', 'Trend'], lastSync: '1 min ago' },
      { type: 'Blood Pressure Monitor', model: 'Omron HEM-7361T', serial: 'BP-2026-93013', status: 'Connected', battery: 93, parameters: ['Systolic', 'Diastolic', 'Pulse Rate'], lastSync: '30 sec ago' },
    ],
    riskLevel: 'Moderate', readmissionRisk: 10,
  },

  // ═══════════════════════════════════════════════════════════
  // PATIENT 14 — TSANG KWOK HUNG — CKD Stage 4
  // Tuen Mun Hospital (公立) | Tuen Mun | Dr. Chan Chi Keung
  // ═══════════════════════════════════════════════════════════
  {
    id: 14, address: 'Flat 18C, Block 12, Yau Oi Court, Tuen Mun, New Territories', name: 'Tsang Kwok Hung', gender: 'M', age: 80,
    diagnosis: 'CKD Stage 4 · Hypertensive Nephrosclerosis · Anaemia of CKD · Secondary Hyperparathyroidism',
    diagnosisCodes: ['N18.4', 'I12.9', 'D63.1', 'E21.1'],
    allergies: ['NKDA'],
    physician: 'Dr. Chan Chi Keung (Nephrologist)',
    admittingDiagnosis: 'CKD Stage 4 decompensation with uraemic symptoms. 80-year-old male with progressive CKD (Stage 3b→4 over 3 years) from hypertensive nephrosclerosis. Presented with fatigue, pruritus, nausea, anorexia ×2 months, weight loss 3kg. eGFR 22 (decline from 28/6 months). Cr 265, K⁺ 5.6, HCO₃ 19, Hb 9.8, PTH 185, PO₄ 1.8. Renal US: bilateral small kidneys (R 8.2, L 8.5cm), increased echogenicity. Treated with bicarbonate, sevelamer, ESA initiation, iron sucrose. Improved — K⁺ 4.8, Hb 10.2, nausea resolved. AVF planning in 4 weeks. Discharged for HaH renal monitoring.',
    clinicalSummary: '80-year-old male with CKD Stage 4 (eGFR 22), hypertensive nephrosclerosis, anaemia of CKD (Hb 10.2 on ESA), secondary hyperparathyroidism (PTH 165, improving). HaH Day 2. On sodium bicarbonate 650mg TID, sevelamer 800mg TID with meals, epoetin 4000u SC weekly, losartan 50mg, furosemide 40mg, allopurinol 100mg. K⁺ 4.8 (was 5.6). Strict renal diet: K⁺ 2-3g, PO₄ 800-1000mg, Na<2g, protein 0.6-0.8g/kg. Wife trained on ESA SC injection. AVF left radiocephalic planned 4 weeks — pre-dialysis education started. BP 142/88 — target <130/80. RRT planning when eGFR <15.',
    wardRounds: [
      { date: '2026-07-08', note: 'Virtual ward round HaH Day 2. K⁺ 4.8 stable. Hb 10.2 post-ESA. Cr 258, eGFR 23 — stable. Nausea resolved, appetite improving. BP 142/88. Pruritus mild — emollients helping. ESA injection technique verified — wife competent. Continue renal diet. Fluid balance chart reviewed — net even. AVF pre-op education booklet provided. Nephrology telehealth monthly. Report K⁺ symptoms (weakness, palpitations).', physician: 'Dr. Chan Chi Keung' },
      { date: '2026-07-07', note: 'Discharge assessment for HaH. Uraemic symptoms improved. K⁺ 4.8, Hb 10.2. Nausea resolved. Discharge criteria met: electrolytes stable, ESA initiated, caregiver trained on injection. HaH: RN 2×/week, home BP daily, fluid balance chart, renal dietitian monthly, nephrology telehealth monthly. AVF surgery in 4 weeks. Avoid NSAIDs, contrast, nephrotoxins.', physician: 'Dr. Chan Chi Keung' },
    ],
    carePlan: {
      serviceFrequency: 'RN 2×/week (Tue/Fri), Home BP daily, Renal dietitian monthly, Nephrology telehealth monthly, Care worker ADL support',
      visitDuration: '50 minutes (RN)',
      goals: [
        'K⁺ maintained 3.5-5.0 — no hyperkalaemia episodes',
        'Hb 10-12 on ESA weekly — target CKD anaemia range',
        'BP <130/80 on current antihypertensive regimen',
        'PTH <300 with sevelamer + active vitamin D',
        'eGFR decline <5 mL/min/year — preserve residual function',
        'ESA injection independence — wife demonstrates SC technique',
        'AVF placed successfully in 4 weeks — pre-op education complete',
        'No hospitalisation for electrolyte emergency × 6 months'
      ],
      precautions: [
        'Renal diet STRICT: K⁺ 2-3g/day, PO₄ 800-1000mg, Na<2g, protein 0.6-0.8g/kg',
        'Sevelamer with ALL meals — binds dietary phosphate',
        'ESA weekly SC injection — rotate sites, pre-injection Hb/BP check',
        'Home BP BID — report >160/100 or <100/60',
        'Fluid balance chart daily — avoid overload and dehydration',
        'NEVER NSAIDs (Ibuprofen, Diclofenac) — paracetamol only',
        'Avoid potassium-rich foods (banana, orange, potato, tomato)',
        'Escalation: K⁺ symptoms (weakness, palpitations, paralysis), chest pain, SOB, confusion → call 999'
      ],
      assignedDoctor: 'Dr. Chan Chi Keung (Nephrology)',
      assignedNurse: 'Vivian Lau (RN)',
      assignedCaseManager: 'Peter Ho (Case Manager)',
      assignedCareWorker: 'Fanny Yip',
    },
    nursingRecords: [
      { date: '2026-07-08', time: '09:00', note: 'HaH Day 2 renal visit. BP 142/88, HR 76, SpO₂ 95%, Temp 36.5. K⁺ 4.8 (capillary POCT + lab confirm pending). Hb 10.2. Weight stable. Pruritus mild — emollient applied. Appetite improved — ate full breakfast. ESA 4000u SC administered R) abdomen — wife observed, technique competent for next week. Sevelamer with meals confirmed. Fluid balance: intake 1,350mL, output 1,320mL — net +30mL. Renal diet compliance good. Care worker Fanny Yip assisting with low-K⁺ meal prep. AVF education booklet reviewed.', nurse: 'Vivian Lau', vitals: 'BP 142/88 | HR 76 | SpO₂ 95% | K⁺ 4.8 | Hb 10.2 | Temp 36.5' },
      { date: '2026-07-07', time: '09:00', note: 'HaH Day 1 initial assessment. BP 144/90, HR 78, SpO₂ 95%. Medication reconciliation: bicarbonate, sevelamer, ESA, losartan, furosemide, allopurinol. Wife trained on ESA SC injection — first dose supervised successfully. Fluid balance chart started. Home BP monitor paired. Renal diet handout provided. Avoid NSAIDs reinforced strongly.', nurse: 'Vivian Lau', vitals: 'BP 144/90 | HR 78 | SpO₂ 95% | Temp 36.5' },
      { date: '2026-07-08', time: '14:00', note: 'Teleconsult support — Dr. Chan reviewed labs. K⁺ stable. Continue ESA weekly. AVF pre-op labs ordered for next week. Wife questions about dialysis timeline answered — RRT when eGFR <15 or symptomatic.', nurse: 'Vivian Lau', vitals: 'BP 142/88 | K⁺ 4.8' },
      { date: '2026-07-07', time: '15:00', note: 'Discharge follow-up call. Wife confirms home prepared — renal diet groceries stocked, sharps container for ESA. Fluid balance chart on bedside table. Emergency numbers confirmed.', nurse: 'Vivian Lau', vitals: 'BP 144/90' },
    ],
    medications: [
      { drug: 'Sodium Bicarbonate', dose: '650mg', route: 'PO', frequency: 'Three times daily (with meals)', purpose: 'Correct metabolic acidosis — HCO₃ target >22', startDate: '2026-06-30', status: 'Active' },
      { drug: 'Sevelamer (Renvela)', dose: '800mg', route: 'PO', frequency: 'Three times daily (with each meal)', purpose: 'Phosphate binder — control hyperphosphataemia in CKD4', startDate: '2026-06-30', status: 'Active' },
      { drug: 'Epoetin Alfa (Eprex)', dose: '4000 units', route: 'SC', frequency: 'Once weekly (Wednesday AM)', purpose: 'ESA — anaemia of CKD, target Hb 10-12', startDate: '2026-07-02', status: 'Active' },
      { drug: 'Losartan', dose: '50mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'ARB — BP control + renoprotection', startDate: '2023-02-15', status: 'Active' },
      { drug: 'Furosemide (Lasix)', dose: '40mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'Loop diuretic — fluid management in CKD4', startDate: '2026-06-30', status: 'Active' },
      { drug: 'Allopurinol', dose: '100mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'Urate lowering — CKD-adjusted dose', startDate: '2023-02-15', status: 'Active' },
    ],
    iotDevices: [
      { type: 'Blood Pressure Monitor', model: 'Omron HEM-7361T', serial: 'BP-2026-93014', status: 'Connected', battery: 92, parameters: ['Systolic', 'Diastolic', 'Pulse Rate', 'Morning/Evening Trend'], lastSync: '25 sec ago' },
      { type: 'Smart Weight Scale', model: 'Omron HN-290T', serial: 'WS-2026-01014', status: 'Connected', battery: 95, parameters: ['Weight (kg)', 'BMI', 'Fluid Trend'], lastSync: '1 min ago' },
      { type: 'Electrolyte POCT', model: 'Abbott i-STAT CG4+', serial: 'POCT-2026-01014', status: 'Connected', battery: 88, parameters: ['Potassium (K⁺)', 'BUN', 'Creatinine', 'HCO₃'], lastSync: '2 min ago' },
    ],
    riskLevel: 'High', readmissionRisk: 20,
  },

  // ═══════════════════════════════════════════════════════════
  // PATIENT 15 — MAK KA MING — Resistant HTN / OSA
  // United Christian Hospital (公立) | To Kwa Wan | Dr. Chan Chi Keung
  // ═══════════════════════════════════════════════════════════
  {
    id: 15, address: 'Flat 3D, Block 1, Grand Waterfront, To Kwa Wan, Kowloon', name: 'Mak Ka Ming', gender: 'M', age: 58,
    diagnosis: 'Resistant Hypertension · Obstructive Sleep Apnoea · LVH · Obesity BMI 34',
    diagnosisCodes: ['I10', 'G47.33', 'I51.7', 'E66.01'],
    allergies: ['NKDA'],
    physician: 'Dr. Chan Chi Keung (Cardiologist)',
    admittingDiagnosis: 'Resistant hypertension despite triple therapy. 58-year-old male. Home BP 156/94 on Amlodipine 10mg + Losartan 100mg + Chlorthalidone 25mg. Morning headaches, snoring, daytime somnolence. 24h ABPM: daytime 156/94, nighttime 148/88 (non-dipper). Workup: aldosterone/renin ratio normal, metanephrines normal, renal Doppler no RAS. Echo: concentric LVH (IVS 13mm), EF 62%, LA dilated 38mL/m². PSG: severe OSA AHI 32, ODI 28, nadir SpO₂ 82%. Started 4th agent (Spironolactone 25mg) + CPAP 10cmH₂O. BP improved to 138/86. CPAP compliance 6.2h/night. Discharged for HaH BP and CPAP monitoring.',
    clinicalSummary: '58-year-old male with resistant HTN now controlled on 4-drug regimen + CPAP. BP 138/86 (home), HR 72. CPAP AHI reduced from 32→4 on treatment. Compliance 6.2h/night (target ≥4h). Concentric LVH stable. Obesity BMI 34 — weight loss target BMI<30. On Amlodipine 10mg, Losartan 100mg, Chlorthalidone 25mg, Spironolactone 25mg, Atorvastatin 20mg. Wife monitors home BP BID and CPAP compliance dashboard. Lowest NEWS vigilance cohort (NEWS Low 0). DASH diet Na<2g, exercise 150min/wk. 24h ABPM repeat in 3 months. Cardiology echo at 3 months.',
    wardRounds: [
      { date: '2026-07-02', note: 'Virtual ward round HaH Day 4. Home BP 136/84 (7-day average). CPAP 6.2h last night, AHI 4 on download. No morning headaches. Weight ↓0.5kg this week (BMI 33.8). Spironolactone tolerated — K⁺ 4.0. Continue 4-drug + CPAP. DASH diet reinforced. Exercise prescription: brisk walk 30min ×5/week. 24h ABPM scheduled Week 2. Echo at 3 months. Excellent response to OSA treatment.', physician: 'Dr. Chan Chi Keung' },
      { date: '2026-06-30', note: 'Discharge assessment for HaH. BP 138/86 on 4-drug + CPAP. CPAP compliant. No headaches. Discharge criteria met. HaH: RN BP check weekly, home BP BID telehealth, CPAP remote compliance monitoring, teleconsult q48h, PT exercise prescription 1×/week. Weight management programme. Cardiology 3-month follow-up with echo.', physician: 'Dr. Chan Chi Keung' },
    ],
    carePlan: {
      serviceFrequency: 'RN weekly (BP check), Home BP BID telehealth, CPAP remote monitoring daily, PT exercise 1×/week, Teleconsult q48h',
      visitDuration: '35 minutes (RN) · 45 minutes (PT)',
      goals: [
        'Home BP average <130/80 mmHg on 4-drug + CPAP regimen',
        'CPAP compliance ≥4h/night ×90% of nights',
        'Weight loss 0.5-1kg/week — target BMI <30',
        'Exercise 150min/week moderate intensity',
        'No morning headaches — OSA symptoms resolved',
        'K⁺ 3.5-5.0 on Spironolactone — monitor q4w',
        '24h ABPM non-dipper pattern improved at 3 months',
        'Patient demonstrates home BP technique + CPAP mask care'
      ],
      precautions: [
        'Home BP BID — same arm, seated, rested 5min, record in log',
        'CPAP: clean mask weekly, check for air leak >24L/min',
        'DASH diet Na<2g/day — wife assists meal preparation',
        'Spironolactone: monitor K⁺ — report muscle weakness, palpitations',
        'Avoid alcohol — worsens OSA and HTN',
        'Exercise: target HR 60-75% max — monitor BP pre/post',
        'No OTC decongestants (pseudoephedrine) — raise BP',
        'Escalation: BP >180/110, CPAP intolerance, chest pain, severe headache → call 999'
      ],
      assignedDoctor: 'Dr. Chan Chi Keung (Cardiology)',
      assignedNurse: 'Sarah Leung (RN)',
      assignedCaseManager: 'Peter Ho (Case Manager)',
      assignedRehabTherapist: 'David Chan (PT)',
    },
    nursingRecords: [
      { date: '2026-07-02', time: '10:00', note: 'HaH Day 4 weekly BP visit. Home BP AM 136/84, PM 134/82 (7-day avg 137/85). HR 72, SpO₂ 96%, Temp 36.5. CPAP download: 6.2h usage, AHI 4, leak 18L/min (acceptable). Weight 96.5kg (↓0.5kg). No morning headaches. Spironolactone 25mg taken — K⁺ 4.0 last check. 4-drug regimen compliance 100%. Wife BP log accurate. CPAP mask fit good — no pressure marks. Exercise: walked 25min yesterday, HR peak 110. DASH meal plan reviewed.', nurse: 'Sarah Leung', vitals: 'BP 136/84 | HR 72 | SpO₂ 96% | Weight 96.5kg | CPAP 6.2h AHI 4' },
      { date: '2026-07-01', time: '10:00', note: 'HaH Day 3. Home BP 138/86. CPAP 5.8h. Weight stable. PT session: 30min brisk walk, BP pre 140/88 post 136/84. No adverse effects from exercise.', nurse: 'Sarah Leung', vitals: 'BP 138/86 | HR 74 | CPAP 5.8h' },
      { date: '2026-06-30', time: '10:00', note: 'Initial HaH assessment Day 1. BP 138/86, HR 72, SpO₂ 96%. 24h ABPM device fitted — return in 24h. CPAP remote dashboard paired — wife trained on compliance review. Home BP monitor technique verified BID. 4-drug reconciliation confirmed. Weight 97kg BMI 34. Exercise prescription provided.', nurse: 'Sarah Leung', vitals: 'BP 138/86 | HR 72 | SpO₂ 96% | Weight 97kg' },
      { date: '2026-07-02', time: '15:00', note: 'Teleconsult — Dr. Chan reviewed BP trend and CPAP data. Excellent response. Continue current plan. 24h ABPM Week 2.', nurse: 'Sarah Leung', vitals: 'BP 136/84 | CPAP AHI 4' },
    ],
    medications: [
      { drug: 'Amlodipine', dose: '10mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'CCB — resistant HTN 4-drug regimen', startDate: '2025-06-01', status: 'Active' },
      { drug: 'Losartan', dose: '100mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'ARB — resistant HTN, max dose', startDate: '2025-06-01', status: 'Active' },
      { drug: 'Chlorthalidone', dose: '25mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'Thiazide-like diuretic — resistant HTN', startDate: '2026-06-22', status: 'Active' },
      { drug: 'Spironolactone', dose: '25mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'MRA — 4th-line agent for resistant HTN', startDate: '2026-06-22', status: 'Active' },
      { drug: 'Atorvastatin', dose: '20mg', route: 'PO', frequency: 'Once daily (PM)', purpose: 'Statin — hyperlipidaemia LDL 3.6', startDate: '2025-06-01', status: 'Active' },
    ],
    iotDevices: [
      { type: 'Blood Pressure Monitor', model: 'Omron HEM-7361T', serial: 'BP-2026-93015', status: 'Connected', battery: 96, parameters: ['Systolic', 'Diastolic', 'Pulse Rate', 'Morning/Evening Trend', 'Telehealth Upload'], lastSync: '20 sec ago' },
      { type: 'CPAP Compliance Monitor', model: 'ResMed AirSense 11 AutoSet', serial: 'CPAP-2026-01015', status: 'Connected', battery: 100, parameters: ['Usage Hours', 'AHI', 'Mask Leak (L/min)', 'Pressure (cmH₂O)'], lastSync: '1 min ago' },
      { type: 'Smart Weight Scale', model: 'Omron HN-290T', serial: 'WS-2026-01015', status: 'Connected', battery: 93, parameters: ['Weight (kg)', 'BMI', 'Body Fat %', 'Trend'], lastSync: '45 sec ago' },
    ],
    riskLevel: 'Low', readmissionRisk: 5,
  },

  // ═══════════════════════════════════════════════════════════
  // PATIENT 16 — FUNG KAM TONG — Hip Fracture post-ORIF
  // St. Teresa's Hospital (私家) | Tsing Yi | Dr. Lee Mei Ling
  // ═══════════════════════════════════════════════════════════
  {
    id: 16, address: 'Flat 7A, Block 6, Villa Esplanada, Tsing Yi, New Territories', name: 'Fung Kam Tong', gender: 'M', age: 83,
    diagnosis: 'Right Hip Fracture post-ORIF · Osteoporosis · Frailty · Recurrent Falls',
    diagnosisCodes: ['S72.141A', 'M81.0', 'R29.6', 'W19.XXXA'],
    allergies: ['NKDA'],
    physician: 'Dr. Lee Mei Ling (Internal Medicine / Orthogeriatrics)',
    admittingDiagnosis: 'Right intertrochanteric hip fracture post-mechanical fall. 83-year-old male, frailty CFS 6, osteoporosis T-score -3.2, 3 falls in past year. Presented unable to bear weight, severe pain NRS 8, leg shortened and externally rotated. X-ray: displaced R intertrochanteric fracture AO/OTA 31-A2. ORIF with DHS 135° 4-hole within 24h. POD8 at discharge. Wound clean, pain NRS 2/10. NWB R leg ×6 weeks. DVT prophylaxis Enoxaparin 40mg SC. Hb 9.8 post-op — iron supplementation started. Discharged for HaH PT/OT and fall prevention.',
    clinicalSummary: '83-year-old frail male POD10 post-ORIF R intertrochanteric hip fracture. Osteoporosis T-3.2 on Alendronate + Ca/VitD. NWB R leg ×6 weeks (4 weeks remaining). Pain NRS 2/10 on paracetamol PRN. Transfers with sliding board + assist ×2. PT gait training progressing — non-weight-bearing exercises tolerated. Enoxaparin 40mg SC until Day 14 then ASA 100mg. Hb 9.8 — ferrous sulfate ongoing. Fall risk HIGH — grab bars, raised toilet seat, night lights installed. Son visits daily for transfers. Care worker May Wong 3×/week ADLs. CFS 6 — orthogeriatric approach.',
    wardRounds: [
      { date: '2026-07-10', note: 'Virtual ward round HaH Day 3 POD10. Wound clean, no erythema. Pain NRS 2/10. Transfers sliding board — steady. PT: NWB exercises, upper body strengthening. Enoxaparin Day 10 — continue to Day 14. Hb recheck 4 weeks. NWB ×4 weeks remaining → PWB at 6-8 weeks. XR follow-up 4 weeks. Osteoporosis: Alendronate + Ca/VitD. Fall prevention: home OT modifications complete. Ortho clinic 2026-08-04.', physician: 'Dr. Lee Mei Ling' },
      { date: '2026-07-08', note: 'Discharge assessment for HaH. POD8. Wound clean. Pain controlled. Transfers with assist. Discharge criteria met: medically stable, NWB instructions clear, caregiver trained. HaH: PT 3×/week gait/strengthening, OT home safety, care worker 3×/week ADLs, teleconsult q48h. DVT ppx education. WC + walker delivered. Ortho XR 4 weeks.', physician: 'Dr. Lee Mei Ling' },
    ],
    carePlan: {
      serviceFrequency: 'PT 3×/week (Mon/Wed/Fri), OT home safety 1×/week, Care worker 3×/week ADLs, RN 2×/week, Teleconsult q48h',
      visitDuration: '60 minutes (PT) · 45 minutes (RN/CW)',
      goals: [
        'NWB R leg strictly ×6 weeks — zero weight-bearing violations',
        'Pain NRS 0/10 by Week 3',
        'Independent transfers with sliding board + assist ×1 by Week 4',
        'No falls during HaH period',
        'Wound healed, sutures/clips removed by Week 3',
        'DVT prophylaxis complete ×14 days — transition to ASA',
        'Hb >11 by 4 weeks on iron supplementation',
        'Home safety score improved — all OT recommendations implemented'
      ],
      precautions: [
        'NWB R leg STRICT ×6 weeks — NO weight bearing, use WC/walker only',
        'Enoxaparin 40mg SC daily until Day 14 — son trained on injection',
        'Fall risk HIGH — never ambulate alone, call bell within reach',
        'Wound check daily — report redness, discharge, increased pain',
        'Pain: paracetamol first line, oxycodone PRN if NRS >4',
        'Osteoporosis: Alendronate weekly empty stomach, Ca/VitD daily',
        'Hydration + fibre to prevent constipation (opioid + immobility)',
        'Escalation: fall, wound dehiscence, sudden severe pain, calf swelling (DVT), SOB (PE) → call 999'
      ],
      assignedDoctor: 'Dr. Lee Mei Ling (Internal Medicine)',
      assignedNurse: 'Angela Ng (RN)',
      assignedCaseManager: 'Tony Lam (Case Manager)',
      assignedRehabTherapist: 'David Chan (PT)',
      assignedCareWorker: 'May Wong',
    },
    nursingRecords: [
      { date: '2026-07-10', time: '09:00', note: 'HaH Day 3 POD10 ortho visit. Wound clean, dry, intact — no erythema. Pain NRS 2/10 — paracetamol 1g taken AM. BP 128/74, HR 80, SpO₂ 97%, Temp 36.6. NWB R leg confirmed — patient using WC, no weight-bearing attempts. Enoxaparin 40mg SC R) abdomen administered — son observed for independence Day 14. Transfer sliding board technique reviewed — steady with son assist. PT yesterday: seated exercises 20min tolerated. Hb 9.8 — ferrous sulfate 325mg taken. Care worker May Wong assisting with bathing. Home safety: grab bars, night light, clear pathways confirmed.', nurse: 'Angela Ng', vitals: 'BP 128/74 | HR 80 | SpO₂ 97% | Pain 2/10 | Temp 36.6' },
      { date: '2026-07-09', time: '09:30', note: 'HaH Day 2. Wound stable. Pain NRS 2/10. Enoxaparin Day 9. PT session: upper body strengthening, NWB leg exercises. Son competent with sliding board transfer. OT home assessment completed — all modifications in place.', nurse: 'Angela Ng', vitals: 'BP 130/76 | HR 82 | SpO₂ 97% | Pain 2/10' },
      { date: '2026-07-08', time: '11:00', note: 'Initial HaH assessment Day 1 POD8. Wound clean. BP 128/74, HR 80. Medication reconciliation: paracetamol, enoxaparin, alendronate, Ca/VitD, ferrous sulfate. Son trained on Enoxaparin SC injection, NWB precautions, fall prevention. WC and walker delivered — height adjusted. Emergency numbers confirmed.', nurse: 'Angela Ng', vitals: 'BP 128/74 | HR 80 | SpO₂ 97% | Pain 2/10 | Temp 36.6' },
      { date: '2026-07-09', time: '14:00', note: 'PT session with David Chan — NWB exercises, transfer practice ×5 repetitions. Patient motivated. No pain increase post-session.', nurse: 'Angela Ng', vitals: 'HR 84 | Pain 2/10 post-PT' },
    ],
    medications: [
      { drug: 'Enoxaparin (Clexane)', dose: '40mg', route: 'SC', frequency: 'Once daily (AM) — ×14 days post-op DVT prophylaxis', purpose: 'LMWH — DVT/PE prevention post-hip fracture', startDate: '2026-06-30', status: 'Active' },
      { drug: 'Paracetamol', dose: '1g', route: 'PO', frequency: 'PRN q6h for pain (max 4g/day)', purpose: 'First-line analgesic — post-operative pain', startDate: '2026-06-29', status: 'Active' },
      { drug: 'Oxycodone', dose: '5mg', route: 'PO', frequency: 'PRN q4-6h if NRS >4 (max 20mg/day)', purpose: 'Opioid analgesic — breakthrough pain', startDate: '2026-06-29', status: 'Active' },
      { drug: 'Alendronate (Fosamax)', dose: '70mg', route: 'PO', frequency: 'Once weekly (Sunday AM, empty stomach)', purpose: 'Bisphosphonate — osteoporosis T-3.2', startDate: '2025-10-05', status: 'Active' },
      { drug: 'Calcium + Vitamin D', dose: '1200mg + 800 IU', route: 'PO', frequency: 'Once daily (PM)', purpose: 'Bone health — osteoporosis management', startDate: '2025-10-05', status: 'Active' },
      { drug: 'Ferrous Sulfate', dose: '325mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'Iron supplementation — post-op anaemia Hb 9.8', startDate: '2026-06-30', status: 'Active' },
    ],
    iotDevices: [
      { type: 'Gait Analysis Sensor', model: 'GaitKeeper Pro', serial: 'GK-2026-01016', status: 'Connected', battery: 72, parameters: ['Transfer Count', 'NWB Compliance', 'Fall Risk Score', 'Activity Level'], lastSync: '1 min ago' },
      { type: 'Blood Pressure Monitor', model: 'Omron HEM-7361T', serial: 'BP-2026-93016', status: 'Connected', battery: 91, parameters: ['Systolic', 'Diastolic', 'Pulse Rate'], lastSync: '30 sec ago' },
      { type: 'mmWave Radar Mattress', model: 'SenseLife Pro', serial: 'SL-2026-01016', status: 'Syncing', battery: 100, parameters: ['Bed Exit Alerts', 'Sleep Duration', 'Night Movement', 'Respiratory Rate'], lastSync: '8 sec ago' },
    ],
    riskLevel: 'High', readmissionRisk: 18,
  },

  // ═══════════════════════════════════════════════════════════
  // PATIENT 17 — CHAN YUK LIN — CAP + COPD GOLD 2
  // Prince of Wales Hospital (公立) | Ma On Shan | Dr. Lee Mei Ling
  // ═══════════════════════════════════════════════════════════
  {
    id: 17, address: 'Flat 14B, Block 3, Kam Fung Court, Ma On Shan, New Territories', name: 'Chan Yuk Lin', gender: 'F', age: 71,
    diagnosis: 'Community-Acquired Pneumonia (RLL resolving) · COPD GOLD Stage 2 · HTN',
    diagnosisCodes: ['J18.1', 'J44.9', 'I10'],
    allergies: ['Penicillin (rash)'],
    physician: 'Dr. Lee Mei Ling (Respiratory Physician)',
    admittingDiagnosis: 'Community-acquired pneumonia RLL with COPD GOLD 2 background. 71-year-old female, ex-smoker 30 pack-years (quit 2 years). Productive cough with green sputum ×4 days, fever 38.5°C, pleuritic right chest pain, SOB on exertion. CURB-65: 2 (age + urea 7.8). CXR: dense RLL consolidation with air bronchograms. WBC 15.2, CRP 156. Sputum GPC. Treated IV Ceftriaxone 2g + Azithromycin 500mg ×3d, transitioned to Amoxicillin-clavulanate PO. Improved Day 3 — afebrile, WBC normalising. SpO₂ 94% RA. Discharged completing 7-day oral antibiotic course.',
    clinicalSummary: '71-year-old female with resolving CAP (RLL) on COPD GOLD 2 background (FEV₁ 62%). HaH Day 3. Afebrile ×72h. SpO₂ 94% RA, RR 20. Cough improving, sputum decreasing. Amox-clav Day 5 of 7 — complete course. On Tiotropium/Olodaterol 2 puffs qd, Salbutamol prn, Amlodipine 5mg. Incentive spirometry 10×/day. Husband assists SpO₂ monitoring and antibiotic schedule. CURB-65 now 1 (age only). mMRC 2, CAT 16. Pulmonary rehab referral sent. GP follow-up 1 week. NEWS Low (1) — uncomplicated CAP in stable COPD patient.',
    wardRounds: [
      { date: '2026-07-04', note: 'Virtual ward round HaH Day 3. Afebrile ×72h (Temp 36.8). SpO₂ 94% RA, RR 20. Cough improving — sputum scant, mucoid. Amox-clav Day 5 of 7 — complete 2 more days. Lung auscultation: RLL crackles resolving. Incentive spirometry compliance good (10×/day). COPD inhaler technique correct. No O₂ required. Continue antibiotics. Pulm rehab referral sent. GP F/U 2026-07-08. Repeat CXR if symptoms persist at 4 weeks.', physician: 'Dr. Lee Mei Ling' },
      { date: '2026-07-02', note: 'Discharge assessment for HaH. Afebrile ×48h. SpO₂ 94% RA. Cough resolving. Discharge criteria met: clinically improving, oral antibiotics tolerated, no hypoxia at rest. HaH: RN 2×/week, teleconsult q48h, incentive spirometry, antibiotic completion monitoring. Husband trained on SpO₂, antibiotics, inhalers. Escalation criteria reviewed.', physician: 'Dr. Lee Mei Ling' },
    ],
    carePlan: {
      serviceFrequency: 'RN 2×/week (Mon/Thu), PT pulmonary rehab 1×/week, Teleconsult q48h',
      visitDuration: '40 minutes (RN) · 45 minutes (PT)',
      goals: [
        'Complete 7-day Amoxicillin-clavulanate course without interruption',
        'Afebrile throughout HaH period',
        'SpO₂ >92% at rest on room air',
        'Cough resolved by Day 7',
        'CRP <10 by Day 7 (if rechecked)',
        'Incentive spirometry 10 breaths q4h while awake',
        'COPD inhaler technique maintained',
        'Pulmonary rehab referral completed — enrol by Week 2'
      ],
      precautions: [
        'Penicillin allergy documented (rash) — Amox-clav safe (prior tolerance confirmed inpatient)',
        'Complete full antibiotic course despite feeling better',
        'Monitor SpO₂ BID — report if <92%',
        'Incentive spirometry 10× q4h — prevents atelectasis post-pneumonia',
        'Report fever recurrence >38°C, increased sputum purulence, worsening SOB',
        'COPD: avoid respiratory irritants, continue LAMA/LABA',
        'Adequate hydration — minimum 1.5L/day',
        'Escalation: SpO₂ <90%, Temp >38.5°C, RR >25, confusion → call 999'
      ],
      assignedDoctor: 'Dr. Lee Mei Ling (Respiratory Medicine)',
      assignedNurse: 'Jenny Tam (RN)',
      assignedCaseManager: 'Grace Tang (Case Manager)',
      assignedRehabTherapist: 'Raymond Wong (PT)',
    },
    nursingRecords: [
      { date: '2026-07-04', time: '10:00', note: 'HaH Day 3 CAP/COPD visit. Temp 36.8, SpO₂ 94% RA, RR 20, HR 82, BP 134/80. Lung auscultation: RLL crackles resolving — much improved from admission. Cough occasional, dry-moist, non-purulent. Amox-clav 875/125mg Day 5 taken — no GI upset. Incentive spirometry 10× completed AM — peak flow 750mL (improving). Stiolto Respimat technique correct. Salbutamol not needed today. Husband SpO₂ log reviewed — BID readings documented. Afebrile ×72h. Energy improving — walked to kitchen independently.', nurse: 'Jenny Tam', vitals: 'Temp 36.8 | SpO₂ 94% | RR 20 | HR 82 | BP 134/80' },
      { date: '2026-07-03', time: '10:00', note: 'HaH Day 2. Temp 37.0, SpO₂ 93% RA, RR 22. Cough improving. Amox-clav Day 4. Incentive spirometry compliance confirmed. Husband trained on escalation criteria — poster on fridge.', nurse: 'Jenny Tam', vitals: 'Temp 37.0 | SpO₂ 93% | RR 22 | HR 84 | BP 136/82' },
      { date: '2026-07-02', time: '10:00', note: 'Initial HaH assessment Day 1. Temp 37.1, SpO₂ 94% RA, RR 20, HR 82, BP 134/80. Medication reconciliation: Amox-clav, Stiolto, Salbutamol, Amlodipine. Penicillin allergy alert confirmed — rash only, Amox-clav tolerated inpatient. Husband trained on SpO₂ monitoring, antibiotic schedule, incentive spirometry. Pulmonary rehab referral discussed.', nurse: 'Jenny Tam', vitals: 'Temp 37.1 | SpO₂ 94% | RR 20 | HR 82 | BP 134/80' },
      { date: '2026-07-04', time: '15:00', note: 'Teleconsult support — Dr. Lee reviewed progress. Afebrile, improving. Complete antibiotics ×2 more days. GP F/U next week.', nurse: 'Jenny Tam', vitals: 'Temp 36.8 | SpO₂ 94%' },
    ],
    medications: [
      { drug: 'Amoxicillin-clavulanate (Augmentin)', dose: '875/125mg', route: 'PO', frequency: 'Twice daily (AM + PM) — 7-day course', purpose: 'Oral antibiotic — CAP step-down post-IV Ceftriaxone', startDate: '2026-06-30', status: 'Active' },
      { drug: 'Tiotropium/Olodaterol (Stiolto Respimat)', dose: '2.5/2.5mcg', route: 'Inhalation', frequency: '2 puffs once daily (AM)', purpose: 'LAMA/LABA — COPD GOLD 2 maintenance', startDate: '2023-04-20', status: 'Active' },
      { drug: 'Salbutamol (Ventolin MDI)', dose: '100mcg', route: 'Inhalation', frequency: 'PRN q4-6h for dyspnoea', purpose: 'SABA — COPD rescue bronchodilator', startDate: '2023-04-20', status: 'Active' },
      { drug: 'Amlodipine', dose: '5mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'CCB — HTN', startDate: '2024-01-10', status: 'Active' },
      { drug: 'Paracetamol', dose: '1g', route: 'PO', frequency: 'PRN q6h for pleuritic pain/fever (max 4g/day)', purpose: 'Analgesic/antipyretic — post-pneumonia symptom relief', startDate: '2026-06-27', status: 'Active' },
    ],
    iotDevices: [
      { type: 'Pulse Oximeter', model: 'Nonin Bluetooth 3230', serial: 'SP-2026-01017', status: 'Connected', battery: 85, parameters: ['SpO₂ (continuous)', 'HR', 'Perfusion Index'], lastSync: '10 sec ago' },
      { type: 'Infrared Thermometer', model: 'Braun BNT400 Bluetooth', serial: 'TH-2026-01017', status: 'Connected', battery: 92, parameters: ['Temperature', 'Trend', 'Fever Alert'], lastSync: '2 min ago' },
      { type: 'Blood Pressure Monitor', model: 'Omron HEM-7361T', serial: 'BP-2026-93017', status: 'Connected', battery: 94, parameters: ['Systolic', 'Diastolic', 'Pulse Rate'], lastSync: '28 sec ago' },
    ],
    riskLevel: 'Moderate', readmissionRisk: 8,
  },
  // ═══════════════════════════════════════════════════════════
  // PATIENT 18 — ZHANG JIANGUO — Post-VATS RUL Lobectomy (Adenocarcinoma)
  // Shanghai United Family Hospital | Thoracic Surgery | Dr. Wang Wei (Thoracic Surgeon)
  // ═══════════════════════════════════════════════════════════
  {
    id: 18, address: 'Room 1502, Building 3, Lianyang Intl Community, 1888 Biyun Rd, Pudong, Shanghai', name: 'Zhang Jianguo', gender: 'M', age: 58,
    diagnosis: 'Right Upper Lobe Adenocarcinoma — Post-VATS RUL Lobectomy + Mediastinal LN Sampling · HTN · Hyperlipidemia',
    diagnosisCodes: ['C34.1', 'I10', 'E78.5'],
    allergies: ['Penicillin (rash)'],
    physician: 'Dr. Wang Wei (Thoracic Surgeon)',
    admittingDiagnosis: 'Right-upper-lobe part-solid pulmonary nodule — malignancy to be excluded. CT-guided biopsy: adenocarcinoma confirmed. VATS right upper lobectomy + mediastinal lymph node sampling performed. Delayed discharge (POD 7) due to persistent air leak — resolved POD 5, chest tube removed POD 6, discharged POD 7. Final surgical pathology + molecular testing pending. Comorbidities: Essential hypertension (Perindopril 4mg qd), Hyperlipidemia (Atorvastatin 20mg qn). Perindopril-related cough under evaluation — possible ARB switch per thoracic team decision.',
    clinicalSummary: '58-year-old male, ex-smoker (quit 2 weeks pre-op, cessation support ongoing), post-VATS RUL lobectomy for biopsy-confirmed lung adenocarcinoma. Delayed discharge due to persistent air leak (resolved). Hypertension on Perindopril — cough evaluation pending (drug-related vs. post-operative). Key monitoring: wound healing (R thoracoscopic ports ×3), respiratory function (incentive spirometry, SpO₂ trend), pain control (VAS/NRS), VTE prevention (early mobilisation), air leak recurrence surveillance. Final pathology awaited for definitive staging and adjuvant therapy decision.',
    wardRounds: [
      { date: '2026-06-29', note: 'Discharge assessment for HaH enrolment. VATS RUL lobectomy POD 7. Air leak resolved POD 5, chest tube removed POD 6 without complication. Wound: 3 thoracoscopic ports clean/dry/intact. SpO₂ 96% RA, RR 16, HR 78, BP 128/82, Temp 36.8. Incentive spirometry 900mL. Pain VAS 3/10. Perindopril 4mg qd + Atorvastatin 20mg qn continued. Cough diary initiated per thoracic team. Wife trained on wound inspection, VTE warning signs, spirometry. Community nurse visit scheduled POD 8 (post-discharge Day 1). Final pathology pending — review at 2-week clinic.', physician: 'Dr. Wang Wei (Thoracic Surgeon)' },
    ],
    carePlan: {
      serviceFrequency: 'Community RN 3×/wk wound + respiratory assessment — Initial visit within 24h post-discharge per ESTS ERAS',
      visitDuration: '60-90 min per RN visit',
      goals: [
        'SpO₂ ≥94% at rest on room air — no desaturation on ambulation',
        'Wound healing without SSI — all 3 thoracoscopic ports clean/dry/intact',
        'VAS pain ≤3/10 at rest, ≤5/10 with cough/movement by Week 2',
        'Incentive spirometry ≥ predicted volume by Week 2',
        'Independent ADLs + ambulation ≥200m by Week 2',
        'Smoking cessation maintained — zero relapse',
        'No VTE event — active ankle exercises + early mobilisation',
        'Perindopril cough pattern documented — ARB switch decision per thoracic team',
        'Final pathology received and reviewed by thoracic team',
      ],
      precautions: [
        'Frank haemoptysis (>50mL or sudden increase) → contact thoracic team immediately',
        'Progressive dyspnoea or SpO₂ <90% sustained >5min → contact thoracic team / 999',
        'Persistent chest pain unrelieved by analgesia → same-day teleconsult',
        'Wound: redness, purulent exudate, or fever >38.3°C → nurse assessment within 24h',
        'Leg swelling / calf pain / unilateral oedema → urgent VTE assessment',
        'Weight loss >2kg/week or sustained poor appetite → nutrition referral',
        'Do NOT self-medicate with antibiotics — may mask symptoms',
        'Perindopril: record cough frequency/character daily — do NOT stop or switch without doctor order',
        'Incentive spirometry q2h while awake — record best of 3 attempts',
      ],
      assignedDoctor: 'Dr. Wang Wei (Thoracic Surgeon)',
      assignedNurse: 'Jenny Tam (RN)',
      assignedCaseManager: 'Grace Tang (Case Manager)',
      assignedRehabTherapist: 'Raymond Wong (PT)',
    },
    nursingRecords: [
      { date: '2026-07-01', time: '09:00', note: 'Initial post-discharge HaH assessment. Wound: (R) thoracoscopic ports ×3 — clean, dry, intact, no erythema/drainage. Respiratory: breath sounds clear bilaterally, no subcutaneous emphysema. SpO₂ 96% RA. IS volume 900mL (target). Pain: VAS 3/10 at rest, 5/10 with cough — analgesia adequate. VTE: no calf tenderness/swelling, active ankle exercises demonstrated. Perindopril continuing — cough diary initiated per thoracic team. Wife trained on wound inspection + VTE warning signs.', nurse: 'Jenny Tam (RN)', vitals: 'BP 128/82 | HR 78 | SpO₂ 96% | RR 16 | Temp 36.8 | VAS 3' },
      { date: '2026-07-03', time: '09:15', note: 'PDD3 assessment. Wound: healing well, no SSI signs. SpO₂ 97% RA — no desaturation with 100m walk. IS volume 1100mL (↑). Pain VAS 2/10 — Tramadol use decreasing. Cough: 2-3 episodes/day, dry, non-productive. Teleconsult with thoracic surgeon completed — progress reviewed, continue current plan, await final pathology. Weight 66.5kg stable.', nurse: 'Jenny Tam (RN)', vitals: 'BP 124/80 | HR 72 | SpO₂ 97% | RR 15 | Temp 36.6 | VAS 2' },
      { date: '2026-07-05', time: '09:30', note: 'PDD5 wound check: all 3 ports healing well, no erythema/drainage. IS now 1200mL. Pain VAS 2 — Tramadol reduced to once yesterday. Cough stable — dry, 1-2 episodes/day. Weight 66.3kg. VTE: negative.', nurse: 'Jenny Tam (RN)', vitals: 'BP 122/78 | HR 70 | SpO₂ 97% | RR 14 | Temp 36.7 | VAS 2' },
    ],
    medications: [
      { drug: 'Perindopril', dose: '4mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'Antihypertensive — ACE inhibitor. Cough under evaluation — possible switch to ARB per thoracic team decision.', startDate: '2022-01-15', status: 'Active' },
      { drug: 'Atorvastatin', dose: '20mg', route: 'PO', frequency: 'Once daily (PM)', purpose: 'Lipid-lowering — statin', startDate: '2022-01-15', status: 'Active' },
      { drug: 'Tramadol', dose: '50mg', route: 'PO', frequency: 'q6h PRN (max 400mg/day)', purpose: 'Pain control — VAS target ≤3. Post-thoracoscopy multimodal analgesia.', startDate: '2026-06-22', status: 'Active' },
    ],
    iotDevices: [
      { type: 'Pulse Oximeter', model: 'Nonin Bluetooth 3230', serial: 'SP-2026-01018', status: 'Connected', battery: 90, parameters: ['SpO₂ (continuous)', 'HR', 'Perfusion Index'], lastSync: '10 sec ago' },
      { type: 'Blood Pressure Monitor', model: 'Omron HEM-7361T', serial: 'BP-2026-93018', status: 'Connected', battery: 93, parameters: ['Systolic', 'Diastolic', 'Pulse Rate'], lastSync: '25 sec ago' },
      { type: 'Health Smartwatch S3', model: 'HK HealthTech S3', serial: 'HW-2026-01018', status: 'Connected', battery: 88, parameters: ['HR (continuous)', 'SpO₂ (continuous)', 'Step Count', 'Sleep', 'Fall Detection'], lastSync: '12 sec ago' },
      { type: 'Infrared Thermometer', model: 'Braun BNT400 Bluetooth', serial: 'TH-2026-01018', status: 'Connected', battery: 95, parameters: ['Temperature', 'Trend', 'Fever Alert'], lastSync: '1 min ago' },
      { type: 'mmWave Radar Mattress', model: 'SenseLife Pro', serial: 'SL-2026-01018', status: 'Syncing', battery: 100, parameters: ['Respiratory Rate', 'Sleep Duration', 'Bed Exit Alerts', 'Respiratory Effort'], lastSync: '8 sec ago' },
    ],
    riskLevel: 'Moderate', readmissionRisk: 22,
  },
];

import { syncAiSummaryNews } from '../../utils/medicalHistoryNews';

for (const patient of NEW_PATIENTS) {
  if (patient.clinicalSummary) {
    patient.clinicalSummary = syncAiSummaryNews(patient.id, patient.diagnosis, patient.clinicalSummary);
  }
  for (const record of patient.nursingRecords) {
    if (record.note) {
      record.note = syncAiSummaryNews(patient.id, patient.diagnosis, record.note);
    }
  }
}
