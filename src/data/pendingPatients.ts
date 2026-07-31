export interface MedicalHistoryEntry {
  date: string; type: 'admission' | 'discharge' | 'surgery' | 'outpatient' | 'er' | 'followup';
  facility: string; department: string; physician: string;
  chiefComplaint: string; diagnosis: string;
  labs?: string; imaging?: string; prescriptions?: string; notes?: string;
}

export interface PendingPatientData {
  id: number; name: string; gender: string; age: number;
  hospital: string; department: string; diagnosis: string;
  doctor: string; dischargeDate: string; referralDate: string;
  services: string; contactName: string; contactRelation: string; contactPhone: string;
  medicalHistory: MedicalHistoryEntry[];
}

/** Remaining pending registrations after promoting 101–110 to formal patients 8–17 */
export const PENDING_PATIENTS: PendingPatientData[] = [
  {
    id: 111, name: 'Leung Pui Shan', gender: 'F', age: 67,
    hospital: 'Kwong Wah Hospital', department: 'Endocrinology',
    diagnosis: 'Type 2 DM · Diabetic foot ulcer Wagner Grade 2 R foot · Peripheral neuropathy · PAD ABI 0.7 · CKD Stage 3',
    doctor: 'Dr. Leung Siu Keung', dischargeDate: '2026-07-08', referralDate: '2026-06-30',
    services: 'Wound care nurse 3x/wk · Off-loading footwear · Podiatry monthly · Diabetes educator weekly · Vascular surveillance',
    contactName: 'Leung Chi Wai', contactRelation: 'Son', contactPhone: '+852 6134 5678',
    medicalHistory: [
      { date:'2026-06-30',type:'admission',facility:'Kwong Wah Hospital',department:'Endocrinology',physician:'Dr. Leung Siu Keung',chiefComplaint:'Non-healing R foot plantar ulcer x2wk. Increasing size depth. No systemic symptoms.',diagnosis:'DFU R foot plantar 1st MTP. Wagner 2 subcutaneous no OM on XR. 2.5x1.8cm depth 4mm. PN loss protective sensation 2/10. PAD ABI 0.7. CKD3 eGFR 52.',labs:'HbA1c 8.8% WBC 9.2 CRP 28. Wound MSSA. BC negative. Cr 118 eGFR 52.',imaging:'XR soft tissue swelling no bony erosion no gas. Doppler ABI R 0.7 L 0.85. Toe pressure 45mmHg.',prescriptions:'Clindamycin 300mg TID x14d. Debridement TCC off-loading. Saline dressings. SMBG qid. Insulin adjustment.',notes:'Podiatry wound protocol. Vascular referral revascularization. DM educator foot care. Off-loading footwear. Weekly wound measurement.' },
      { date:'2026-07-08',type:'discharge',facility:'Kwong Wah Hospital',department:'Endocrinology',physician:'Dr. Leung Siu Keung',chiefComplaint:'Wound improving granulation present. No infection. Pain controlled.',diagnosis:'Healing DFU Wagner 2. PN. PAD. CKD3. T2DM insulin.',prescriptions:'Complete Clindamycin. Daily saline dressings TCC weekly change. Glargine+Lispro. Metformin 1g hold if eGFR<45. Lisinopril 5mg. ASA 100mg.',notes:'iHomeCare wound nurse 3x dressing wound assessment. Weekly podiatry. Monthly vascular. DM educator weekly. Renal F/U. Readmit 15%.' },
      { date:'2025-08-15',type:'outpatient',facility:'Kwong Wah Hospital',department:'Podiatry',physician:'Podiatry Clinic',chiefComplaint:'Annual DM foot screening. PN numbness tingling both feet.',diagnosis:'Diabetic PN loss protective sensation. Moderate risk foot.',labs:'HbA1c 8.2% Monofilament 3/10 Vibration absent hallux. Pedal pulses weakly palpable.',prescriptions:'Custom footwear. Emollient dry skin. Daily foot inspection.',notes:'Quarterly podiatry. Smoking cessation. Glucose optimization.' },
    ],
  },
  {
    id: 112, name: 'Yuen Wai Hung', gender: 'M', age: 65,
    hospital: 'Pamela Youde Nethersole Eastern Hospital', department: 'Neurology',
    diagnosis: 'Parkinson\'s Disease H&Y Stage 3 · Motor fluctuations wearing-off · Orthostatic hypotension · Mild cognitive impairment',
    doctor: 'Dr. Chan Ka Wai', dischargeDate: '2026-07-03', referralDate: '2026-06-27',
    services: 'Home PT/OT 2x/wk mobility ADL · Speech therapy 1x/wk · Medication optimization Levodopa · Fall prevention · Home safety modifications · Caregiver training',
    contactName: 'Yuen Siu Kwan', contactRelation: 'Daughter', contactPhone: '+852 6234 5679',
    medicalHistory: [
      { date:'2026-06-28',type:'admission',facility:'PYNEH',department:'Neurology',physician:'Dr. Chan Ka Wai',chiefComplaint:'2 falls in 1wk. Freezing episodes walking. Wearing-off before next Levodopa. Wife reports increased confusion.',diagnosis:'PD H&Y3 motor fluctuations wearing-off. Orthostatic hypotension supine 128/78→stand 106/56 drop 22mmHg. MCI MOCA 22/30 executive recall deficits.',labs:'CBC Chem7 TSH B12 folate normal. No infection. VitD 18 insufficient.',imaging:'MRI brain 2025 no structural lesions mild atrophy. DATscan 2022 markedly reduced putamen bilateral R>L PD pattern.',prescriptions:'Sinemet CR 200/50 QID (0600 1000 1400 1800). Entacapone 200mg with each dose. Midodrine 2.5mg TID. VitD 1000 IU.',notes:'Med timing optimized. On time 50%→75% waking day. Orthostatic BP improved. Falls risk high PT gait balance. OT home safety. Caregiver train.' },
      { date:'2026-07-03',type:'discharge',facility:'PYNEH',department:'Neurology',physician:'Dr. Chan Ka Wai',chiefComplaint:'Motor improved optimized timing. No further falls. Orthostatic BP improved.',diagnosis:'Stabilized PD H&Y3. Motor fluctuations improved. OH compensated. MCI stable.',prescriptions:'Sinemet CR 200/50 QID Entacapone 200 QID Midodrine 2.5 TID VitD 1000.',notes:'iHomeCare. PT/OT 2x mobility ADL fall prevention. ST 1x. Home safety. Caregiver training. Neuro telehealth monthly. Readmit 12%.' },
      { date:'2022-04-10',type:'outpatient',facility:'PYNEH',department:'Neurology',physician:'Dr. Chan Ka Wai',chiefComplaint:'Unilateral R hand resting tremor noted by family. Bradykinesia slow arm swing. Mild rigidity RUE.',diagnosis:'PD H&Y2 at diagnosis. R-sided tremor-dominant.',labs:'DATscan markedly reduced striatal bilateral R>L. Levodopa challenge UPDRS III +35%.',imaging:'DATscan abnormal neurodegenerative Parkinsonism.',prescriptions:'Sinemet 100/25 TID.',notes:'Excellent Levodopa response. PD nurse specialist. Exercise tai chi walking. Annual neuro F/U. Support group.' },
    ],
  },
  {
    id: 113, name: 'Chan Tai Ming', gender: 'M', age: 82,
    hospital: 'Prince of Wales Hospital', department: 'Respiratory Medicine',
    diagnosis: 'COPD GOLD Stage 2 · CAP (resolving) · HTN',
    doctor: 'Dr. Lee Mei Ling', dischargeDate: '2026-06-25', referralDate: '2026-06-18',
    services: 'Home O₂ standby · POCT CRP/PCT · RN BID 3h/visit (6h/day) · PT 2x/wk · Pulmonary rehab · Teleconsult q48h',
    contactName: 'Mrs. Chan (Chan Siu Ling)', contactRelation: 'Wife', contactPhone: '+852 9123 7890',
    medicalHistory: [
      { date:'2026-06-14',type:'admission',facility:'Prince of Wales Hospital',department:'Respiratory Medicine',physician:'Dr. Lee Mei Ling',chiefComplaint:'Productive cough with green sputum x5d, fever 38.5°C, worsening SOB on exertion. COPD GOLD 2 baseline. Ex-smoker 30 pk-yr quit 2yr ago.',diagnosis:'Community-acquired pneumonia (CAP) with RLL consolidation. COPD GOLD Stage 2 (FEV₁ 55%) exacerbation triggered by infection. HTN. CURB-65: 2. Penicillin allergy — rash documented.',labs:'WBC 14.2, Neutrophils 11.5, CRP 156 mg/L at admission. Urea 7.8, Cr 82.',imaging:'CXR: dense RLL consolidation with air bronchograms. No pleural effusion.',prescriptions:'IV Ceftriaxone 2g QD. Doxycycline 100mg PO BID. Salbutamol PRN. Tiotropium 18mcg QD continue.',notes:'Assessed for HaH discharge Day 5.' },
      { date:'2026-06-18',type:'discharge',facility:'Prince of Wales Hospital',department:'Respiratory Medicine',physician:'Dr. Lee Mei Ling',chiefComplaint:'Clinically stable. Afebrile x48h. SpO₂ 92% on RA at rest.',diagnosis:'CAP (RLL consolidation) resolving. COPD GOLD Stage 2 stable. HTN controlled.',prescriptions:'Continue IV Ceftriaxone via HaH RN. PO Amoxicillin-clavulanate Days 8-10. Continue Tiotropium + Salbutamol PRN.',notes:'iHomeCare HaH referral. Family trained on SpO₂/BP/Temp monitoring. NEWS Low (1) at discharge — routine NEWS2 monitoring.' },
    ],
  },
  {
    id: 114, name: 'Zhang Jianguo', gender: 'M', age: 58,
    hospital: 'Shanghai United Family Hospital', department: 'Thoracic Surgery',
    diagnosis: 'RUL Adenocarcinoma post-VATS Lobectomy · Persistent air leak (resolved POD5) · HTN · Hyperlipidemia',
    doctor: 'Dr. Wang Wei (Thoracic Surgeon)', dischargeDate: '2026-08-13', referralDate: '2026-08-13',
    services: 'Community RN 3×/wk wound + respiratory assessment · PT pulmonary rehab 2×/wk · Teleconsult q3d · Incentive spirometry · Smoking cessation support · BP Monitor (Omron HEM-7361T) daily · Pulse Oximeter (Nonin 3230) qid · Thermometer (Braun BNT400) BID · Smart Scale (Omron HN-290T) daily weight',
    contactName: 'Mrs. Zhang (Lin Xia)', contactRelation: 'Wife', contactPhone: '+86 138 1792 3456',
    medicalHistory: [
      { date: '2026-07-10', type: 'outpatient', facility: 'Shanghai United Family Hospital', department: 'Health Check', physician: 'Dr. Li Wei (Radiologist)', chiefComplaint: 'Screening CT.', diagnosis: 'RUL part-solid pulmonary nodule detected on screening CT.', imaging: 'CT chest: RUL part-solid nodule, suspicious features.', notes: 'Referred to thoracic surgery. Fleischner guidelines applied.' },
      { date: '2026-07-15', type: 'outpatient', facility: 'Shanghai United Family Hospital', department: 'Thoracic Surgery', physician: 'Dr. Wang Wei', chiefComplaint: 'RUL nodule evaluation.', diagnosis: 'RUL part-solid nodule — follow-up per thoracic team. PFT ordered. Smoking cessation initiated.', notes: 'Initial thoracic surgery evaluation.' },
      { date: '2026-07-22', type: 'outpatient', facility: 'Shanghai United Family Hospital', department: 'Radiology', physician: 'Dr. Li Wei (Radiologist)', chiefComplaint: 'CT-guided biopsy.', diagnosis: 'CT-guided core needle biopsy — adenocarcinoma confirmed.', notes: 'CT-guided percutaneous biopsy RUL nodule. No pneumothorax. Referred to MDT for surgical planning.' },
      { date: '2026-07-29', type: 'followup', facility: 'Shanghai United Family Hospital', department: 'Thoracic Surgery MDT', physician: 'Dr. Wang Wei', chiefComplaint: 'MDT — RUL adenocarcinoma.', diagnosis: 'MDT consensus: VATS RUL lobectomy + mediastinal LN sampling.', notes: 'PFT adequate. Pre-op workup initiated.' },
      { date: '2026-08-06', type: 'surgery', facility: 'Shanghai United Family Hospital', department: 'Thoracic Surgery', physician: 'Dr. Wang Wei', chiefComplaint: 'VATS RUL lobectomy.', diagnosis: 'VATS RUL lobectomy + mediastinal LN sampling. Frozen section: clear margins.', notes: 'VATS RUL lobectomy. 3-port technique. Chest tube ×1. EBL minimal. Procedure uncomplicated.' },
      { date: '2026-08-13', type: 'discharge', facility: 'Shanghai United Family Hospital', department: 'Thoracic Surgery', physician: 'Dr. Wang Wei', chiefComplaint: 'POD 7 — discharge for HaH.', diagnosis: 'Post-VATS RUL lobectomy Day 7. Persistent air leak (POD 1-5) — resolved POD5. Chest tube removed POD6. Wound clean. Final pathology + molecular testing pending.', labs: 'Final surgical pathology + molecular testing (EGFR/ALK/PD-L1) pending.', notes: 'Delayed discharge due to persistent air leak (resolved). HaH enrolment. Perindopril 4mg + Atorvastatin 20mg continued. Cough diary initiated (Perindopril-related cough under evaluation). Incentive spirometry 900mL. Smoking cessation ×3 weeks. 2-week thoracic clinic follow-up. Wife trained on wound inspection + VTE warning signs.' },
    ],
  },
];

import { syncAiSummaryNews } from '../utils/medicalHistoryNews';

for (const patient of PENDING_PATIENTS) {
  const vitalsPatientId = patient.id === 113 ? 7 : null;
  if (!vitalsPatientId) continue;
  for (const entry of patient.medicalHistory) {
    if (entry.notes) {
      entry.notes = syncAiSummaryNews(vitalsPatientId, patient.diagnosis, entry.notes);
    }
  }
}
