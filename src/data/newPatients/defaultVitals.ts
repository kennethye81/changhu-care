import { type Vitals, type PatientSummary } from '../../store/patientStore';
import { normalizeVitals } from '../../utils/newsScore';

function dv(
  id: number, hr: number, sbp: number, dbp: number, spo2: number, temp: number, rr: number,
  bloodSugar = 110, diagnosis = '',
): [number, Vitals] {
  return [id, normalizeVitals({ hr, bpSystolic: sbp, bpDiastolic: dbp, spo2, temp, rr, bloodSugar }, diagnosis)];
}

const entries = [
  dv(8, 76, 128, 78, 96, 36.6, 16, 142, 'T2DM'),
  dv(9, 88, 132, 78, 87, 36.5, 20, 98, 'COPD'),
  dv(10, 82, 142, 86, 97, 36.7, 18),
  dv(11, 78, 118, 72, 98, 36.5, 16),
  dv(12, 84, 108, 68, 94, 36.6, 18),
  dv(13, 88, 138, 82, 97, 36.6, 16, 186, 'T2DM'),
  dv(14, 76, 142, 88, 95, 36.5, 16),
  dv(15, 72, 138, 86, 96, 36.5, 14, 168, 'T2DM'),
  dv(16, 80, 128, 74, 97, 36.6, 16),
  dv(17, 82, 134, 80, 94, 36.8, 20, 105, 'COPD'),
  dv(18, 78, 128, 82, 96, 36.8, 16),
] as const;

export const NEW_DEFAULT_VITALS: Record<number, Vitals> = Object.fromEntries(entries);

type SummaryBase = Omit<PatientSummary, 'newsScore' | 'newsTier' | 'rr' | 'bloodSugar'>;

export const NEW_DEFAULT_SUMMARIES: SummaryBase[] = [
  { id: 8, name: 'Chow Kwok Fai', gender: 'M', age: 72, diagnosis: 'NSTEMI post-PCI ×2 · T2DM · HTN', temp: 36.6, hr: 76, bpSystolic: 128, bpDiastolic: 78, spo2: 96, hospital: 'Queen Mary Hospital', address: 'Flat 6C, Block 3, Telford Gardens, Kowloon Bay, Kowloon', doctor: 'Dr. Chan Chi Keung (Cardiology)', caseManager: 'Peter Ho (Case Mgr)' },
  { id: 9, name: 'Lam Siu Wan', gender: 'F', age: 68, diagnosis: 'COPD GOLD Stage 3 · Chronic Hypoxaemia · Osteoporosis', temp: 36.5, hr: 88, bpSystolic: 132, bpDiastolic: 78, spo2: 87, hospital: 'Prince of Wales Hospital', address: 'Flat 21A, Block 7, Laguna Verde, Hung Hom, Kowloon', doctor: 'Dr. Lee Mei Ling (Respiratory)', caseManager: 'Grace Tang (Case Mgr)' },
  { id: 10, name: 'Cheung Siu Ming', gender: 'M', age: 76, diagnosis: 'Acute Ischaemic Stroke (L MCA) · R Hemiparesis · HTN', temp: 36.7, hr: 82, bpSystolic: 142, bpDiastolic: 86, spo2: 97, hospital: 'Pamela Youde Nethersole Eastern Hospital', address: 'Flat 9D, Block 2, Heng Fa Chuen, Chai Wan, Hong Kong Island', doctor: 'Dr. Cheung Kwok Wai (Neurology)', caseManager: 'Anna Leung (Case Mgr)' },
  { id: 11, name: 'Wong Lai Chun', gender: 'F', age: 62, diagnosis: 'Invasive Ductal Carcinoma (L) Stage IIB · Post-lumpectomy', temp: 36.5, hr: 78, bpSystolic: 118, bpDiastolic: 72, spo2: 98, hospital: 'HK Sanatorium & Hospital', address: 'Flat 2F, Tower 5, The Belcher\'s, Kennedy Town, Hong Kong Island', doctor: 'Dr. Chan Chi Keung (Breast/Oncology)', caseManager: 'Grace Tang (Case Mgr)' },
  { id: 12, name: 'Fok Wai Keung', gender: 'M', age: 69, diagnosis: 'Heart Failure NYHA III · Ischemic CMP · EF 32% · AF · CKD3', temp: 36.6, hr: 84, bpSystolic: 108, bpDiastolic: 68, spo2: 94, hospital: 'Queen Mary Hospital', address: 'Flat 11B, Block 4, Metro City Phase 2, Tseung Kwan O, New Territories', doctor: 'Dr. Chan Chi Keung (Cardiology)', caseManager: 'Peter Ho (Case Mgr)' },
  { id: 13, name: 'Lau Wai Yin', gender: 'F', age: 55, diagnosis: 'T2DM · Diabetic Nephropathy · Mild NPDR · Obesity', temp: 36.6, hr: 88, bpSystolic: 138, bpDiastolic: 82, spo2: 97, hospital: 'Kwong Wah Hospital', address: 'Flat 5A, Block 8, Choi Hung Estate, Wong Tai Sin, Kowloon', doctor: 'Dr. Cheung Kwok Wai (Endocrinology)', caseManager: 'Anna Leung (Case Mgr)' },
  { id: 14, name: 'Tsang Kwok Hung', gender: 'M', age: 80, diagnosis: 'CKD Stage 4 · HTN Nephrosclerosis · Anaemia of CKD', temp: 36.5, hr: 76, bpSystolic: 142, bpDiastolic: 88, spo2: 95, hospital: 'Tuen Mun Hospital', address: 'Flat 18C, Block 12, Yau Oi Court, Tuen Mun, New Territories', doctor: 'Dr. Chan Chi Keung (Nephrology)', caseManager: 'Peter Ho (Case Mgr)' },
  { id: 15, name: 'Mak Ka Ming', gender: 'M', age: 58, diagnosis: 'Resistant HTN · OSA · LVH · Obesity', temp: 36.5, hr: 72, bpSystolic: 138, bpDiastolic: 86, spo2: 96, hospital: 'United Christian Hospital', address: 'Flat 3D, Block 1, Grand Waterfront, To Kwa Wan, Kowloon', doctor: 'Dr. Chan Chi Keung (Cardiology)', caseManager: 'Peter Ho (Case Mgr)' },
  { id: 16, name: 'Fung Kam Tong', gender: 'M', age: 83, diagnosis: 'R Hip Fracture post-ORIF · Osteoporosis · Frailty', temp: 36.6, hr: 80, bpSystolic: 128, bpDiastolic: 74, spo2: 97, hospital: 'St. Teresa\'s Hospital', address: 'Flat 7A, Block 6, Villa Esplanada, Tsing Yi, New Territories', doctor: 'Dr. Lee Mei Ling (Internal Med)', caseManager: 'Tony Lam (Case Mgr)' },
  { id: 17, name: 'Chan Yuk Lin', gender: 'F', age: 71, diagnosis: 'CAP (RLL resolving) · COPD GOLD Stage 2 · HTN', temp: 36.8, hr: 82, bpSystolic: 134, bpDiastolic: 80, spo2: 94, hospital: 'Prince of Wales Hospital', address: 'Flat 14B, Block 3, Kam Fung Court, Ma On Shan, New Territories', doctor: 'Dr. Lee Mei Ling (Respiratory)', caseManager: 'Grace Tang (Case Mgr)' },
  { id: 18, name: 'Zhang Jianguo', gender: 'M', age: 58, diagnosis: 'Post-VATS RUL Lobectomy · Adenocarcinoma · HTN · Hyperlipidemia', temp: 36.8, hr: 78, bpSystolic: 128, bpDiastolic: 82, spo2: 96, hospital: 'Shanghai United Family Hospital', address: 'Room 1502, Building 3, Lianyang Intl Community, 1888 Biyun Rd, Pudong, Shanghai', doctor: 'Dr. Wang Wei (Thoracic Surgeon)', caseManager: 'Grace Tang (Case Mgr)' },
];
