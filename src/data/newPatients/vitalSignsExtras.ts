import { type VitalsThresholds } from '../vitalSigns';

export const NEW_PATIENT_THRESHOLDS: Record<number, { thresholds: VitalsThresholds; guidelines: string }> = {
  // P8: NSTEMI post-PCI + T2DM + HTN
  8: {
    thresholds: {
      hr: { green: [55, 90], amber: [90, 110] },
      bpSystolic: { green: [100, 140], amber: [140, 160] },
      bpDiastolic: { green: [60, 90], amber: [90, 100] },
      spo2: { green: [95, 100], amber: [92, 95] },
      temp: { green: [36.1, 37.2], amber: [37.2, 38.0] },
    },
    guidelines: 'ESC 2023 ACS · ESC 2021 HTN · ADA 2024 T2DM · Post-PCI RPM',
  },
  // P9: COPD GOLD3 + hypoxaemia
  9: {
    thresholds: {
      hr: { green: [60, 100], amber: [100, 120] },
      bpSystolic: { green: [110, 140], amber: [140, 160] },
      bpDiastolic: { green: [65, 90], amber: [90, 100] },
      spo2: { green: [88, 95], amber: [85, 88] },
      temp: { green: [36.1, 37.2], amber: [37.2, 38.0] },
    },
    guidelines: 'GOLD 2024 COPD Stage 3 · LTOT Assessment · Osteoporosis + Fall Risk',
  },
  // P10: Post-stroke + HTN
  10: {
    thresholds: {
      hr: { green: [60, 100], amber: [100, 120] },
      bpSystolic: { green: [120, 150], amber: [150, 170] },
      bpDiastolic: { green: [70, 95], amber: [95, 105] },
      spo2: { green: [95, 100], amber: [92, 95] },
      temp: { green: [36.1, 37.2], amber: [37.2, 38.0] },
    },
    guidelines: 'AHA/ASA 2021 Stroke Secondary Prevention · BP target <140/90 · NIHSS Monitoring',
  },
  // P11: Post-lumpectomy oncology
  11: {
    thresholds: {
      hr: { green: [60, 100], amber: [100, 110] },
      bpSystolic: { green: [100, 130], amber: [130, 150] },
      bpDiastolic: { green: [60, 85], amber: [85, 95] },
      spo2: { green: [96, 100], amber: [93, 96] },
      temp: { green: [36.1, 37.2], amber: [37.2, 38.3] },
    },
    guidelines: 'ASCO Post-Surgical Care · Infection surveillance · Wound healing',
  },
  // P12: HF NYHA III EF32% + AF + CKD3
  12: {
    thresholds: {
      hr: { green: [60, 100], amber: [100, 130] },
      bpSystolic: { green: [90, 130], amber: [130, 155] },
      bpDiastolic: { green: [55, 85], amber: [85, 95] },
      spo2: { green: [92, 100], amber: [88, 92] },
      temp: { green: [36.1, 37.2], amber: [37.2, 38.0] },
    },
    guidelines: 'ESC 2021 HF · KDIGO 2024 CKD3 · ESC 2020 AF · GDMT Monitoring',
  },
  // P13: T2DM post-DKA + nephropathy
  13: {
    thresholds: {
      hr: { green: [60, 100], amber: [100, 110] },
      bpSystolic: { green: [110, 140], amber: [140, 160] },
      bpDiastolic: { green: [65, 90], amber: [90, 100] },
      spo2: { green: [95, 100], amber: [92, 95] },
      temp: { green: [36.1, 37.0], amber: [37.0, 38.0] },
    },
    guidelines: 'ADA 2024 T2DM · KDIGO 2024 Diabetic Nephropathy · DKA Prevention',
  },
  // P14: CKD Stage 4
  14: {
    thresholds: {
      hr: { green: [55, 95], amber: [95, 110] },
      bpSystolic: { green: [110, 145], amber: [145, 165] },
      bpDiastolic: { green: [65, 95], amber: [95, 105] },
      spo2: { green: [93, 100], amber: [90, 93] },
      temp: { green: [36.1, 37.2], amber: [37.2, 38.0] },
    },
    guidelines: 'KDIGO 2024 CKD Stage 4 · K⁺/PO₄ Monitoring · Pre-dialysis Care',
  },
  // P15: Resistant HTN + OSA
  15: {
    thresholds: {
      hr: { green: [60, 90], amber: [90, 100] },
      bpSystolic: { green: [110, 140], amber: [140, 160] },
      bpDiastolic: { green: [70, 90], amber: [90, 100] },
      spo2: { green: [94, 100], amber: [90, 94] },
      temp: { green: [36.1, 37.2], amber: [37.2, 38.0] },
    },
    guidelines: 'ESC 2021 Resistant HTN · AASM OSA · CPAP Compliance Monitoring',
  },
  // P16: Post-ORIF hip fracture + frailty
  16: {
    thresholds: {
      hr: { green: [60, 100], amber: [100, 115] },
      bpSystolic: { green: [100, 140], amber: [140, 160] },
      bpDiastolic: { green: [60, 90], amber: [90, 100] },
      spo2: { green: [95, 100], amber: [92, 95] },
      temp: { green: [36.1, 37.2], amber: [37.2, 38.3] },
    },
    guidelines: 'NICE Hip Fracture · DVT Prophylaxis · Fall Prevention · Post-op Infection Watch',
  },
  // P17: CAP resolving + COPD GOLD2
  17: {
    thresholds: {
      hr: { green: [60, 100], amber: [100, 120] },
      bpSystolic: { green: [110, 140], amber: [140, 160] },
      bpDiastolic: { green: [65, 90], amber: [90, 100] },
      spo2: { green: [92, 96], amber: [88, 92] },
      temp: { green: [36.1, 37.2], amber: [37.2, 38.3] },
    },
    guidelines: 'IDSA/ATS 2019 CAP · GOLD 2024 COPD Stage 2 · Antibiotic Completion',
  },
  // P18: Post-VATS RUL Lobectomy — Adenocarcinoma + HTN
  18: {
    thresholds: {
      hr: { green: [51, 90], amber: [41, 50] },
      bpSystolic: { green: [100, 140], amber: [90, 100] },
      bpDiastolic: { green: [60, 90], amber: [55, 60] },
      spo2: { green: [96, 100], amber: [92, 96] },
      temp: { green: [36.1, 38.0], amber: [35.1, 36.1] },
    },
    guidelines: 'NEWS2 (NICE 2017) Scale 1 · ERAS Thoracic 2019 · NCCN NSCLC 2025',
  },
};

export const NEW_PATIENT_START_DATES: Record<number, string> = {
  8: '2026-07-01',
  9: '2026-07-03',
  10: '2026-07-06',
  11: '2026-07-02',
  12: '2026-07-04',
  13: '2026-07-05',
  14: '2026-07-07',
  15: '2026-06-30',
  16: '2026-07-08',
  17: '2026-07-02',
  18: '2026-08-14',
};

export const NEW_VITALS_BASELINES: Record<number, { hr: number; bpS: number; bpD: number; spo2: number; temp: number; rr: number }> = {
  8:  { hr: 76, bpS: 128, bpD: 78, spo2: 96, temp: 36.6, rr: 16 },
  9:  { hr: 88, bpS: 132, bpD: 78, spo2: 92, temp: 36.5, rr: 20 },
  10: { hr: 82, bpS: 142, bpD: 86, spo2: 97, temp: 36.7, rr: 18 },
  11: { hr: 78, bpS: 118, bpD: 72, spo2: 98, temp: 36.5, rr: 16 },
  12: { hr: 84, bpS: 108, bpD: 68, spo2: 94, temp: 36.6, rr: 18 },
  13: { hr: 88, bpS: 138, bpD: 82, spo2: 97, temp: 36.6, rr: 16 },
  14: { hr: 76, bpS: 142, bpD: 88, spo2: 95, temp: 36.5, rr: 16 },
  15: { hr: 72, bpS: 138, bpD: 86, spo2: 96, temp: 36.5, rr: 14 },
  16: { hr: 80, bpS: 128, bpD: 74, spo2: 97, temp: 36.6, rr: 16 },
  17: { hr: 82, bpS: 134, bpD: 80, spo2: 94, temp: 36.8, rr: 20 },
  18: { hr: 72, bpS: 122, bpD: 78, spo2: 97, temp: 36.7, rr: 15 },
};

export const NEW_CLINICAL_EVENTS: Record<number, { time: number; duration: number; effects: Partial<Record<'hr' | 'bpS' | 'bpD' | 'spo2' | 'temp' | 'rr', number>> }[]> = {
  8: [
    { time: 480, duration: 120, effects: { hr: +8, bpS: -6 } },
    { time: 1200, duration: 90, effects: { hr: +12, bpS: +10 } },
    { time: 1920, duration: 180, effects: { hr: +6, spo2: -2 } },
  ],
  9: [
    { time: 360, duration: 90, effects: { spo2: -5, hr: +14, rr: +6 } },
    { time: 1080, duration: 90, effects: { spo2: -6, hr: +12, rr: +7 } },
    { time: 2040, duration: 90, effects: { spo2: -4, hr: +10, rr: +5 } },
  ],
  10: [
    { time: 600, duration: 120, effects: { hr: +10, bpS: +8 } },
    { time: 1440, duration: 180, effects: { hr: +8, bpS: +6, rr: +2 } },
    { time: 2280, duration: 90, effects: { hr: +6 } },
  ],
  11: [
    { time: 720, duration: 180, effects: { temp: +0.4, hr: +6 } },
    { time: 1680, duration: 120, effects: { temp: +0.2, hr: +4 } },
  ],
  12: [
    { time: 120, duration: 180, effects: { bpS: -8, bpD: -5, hr: +6, spo2: -2 } },
    { time: 840, duration: 180, effects: { bpS: -6, hr: +8, spo2: -2 } },
    { time: 1560, duration: 240, effects: { hr: +10, bpS: -4 } },
  ],
  13: [
    { time: 0, duration: 360, effects: { hr: +8, temp: +0.3 } },
    { time: 960, duration: 120, effects: { hr: +6, bpS: +6 } },
    { time: 2160, duration: 180, effects: { hr: -4, temp: -0.2 } },
  ],
  14: [
    { time: 480, duration: 240, effects: { bpS: +8, hr: +6 } },
    { time: 1440, duration: 180, effects: { bpS: +6, hr: +4, spo2: -1 } },
  ],
  15: [
    { time: 360, duration: 120, effects: { bpS: +6, hr: +4 } },
    { time: 1800, duration: 240, effects: { bpS: -8, spo2: +2 } },
  ],
  16: [
    { time: 300, duration: 180, effects: { hr: +10, bpS: +8 } },
    { time: 1200, duration: 120, effects: { hr: +8, temp: +0.3 } },
    { time: 2400, duration: 90, effects: { hr: +6 } },
  ],
  17: [
    { time: 0, duration: 480, effects: { temp: +0.6, hr: +8, rr: +4 } },
    { time: 720, duration: 360, effects: { temp: +0.3, hr: +4, rr: +2 } },
    { time: 1680, duration: 240, effects: { temp: -0.2, hr: -2, rr: -1 } },
  ],
  18: [
    { time: 0, duration: 240, effects: { hr: +8, rr: +4, bpS: +10 } },
    { time: 360, duration: 120, effects: { hr: +6, rr: +2 } },
    { time: 720, duration: 480, effects: { temp: +0.3, hr: +4 } },
    { time: 1920, duration: 180, effects: { hr: +6, bpS: +8 } },
  ],
};

export const NEW_VITALS_CONTEXT: Record<number, { name: string; conditions: string }> = {
  8:  { name: '待录入', conditions: 'NSTEMI post-PCI, T2DM, HTN' },
  9:  { name: '待录入', conditions: 'COPD GOLD 3, chronic hypoxaemia, osteoporosis' },
  10: { name: '待录入', conditions: 'Post-stroke L MCA, hemiparesis, HTN' },
  11: { name: '待录入', conditions: 'Post-lumpectomy breast cancer, adjuvant chemo pending' },
  12: { name: '待录入', conditions: 'HF NYHA III EF 32%, AF, CKD3' },
  13: { name: '待录入', conditions: 'T2DM post-DKA, nephropathy, NPDR' },
  14: { name: '待录入', conditions: 'CKD Stage 4, anaemia, 2°HPT' },
  15: { name: '待录入', conditions: 'Resistant HTN, OSA on CPAP, LVH' },
  16: { name: '待录入', conditions: 'Post-ORIF hip fracture, osteoporosis, frailty' },
  17: { name: '待录入', conditions: 'CAP resolving, COPD GOLD 2' },
  18: { name: '待录入', conditions: 'Post-VATS RUL lobectomy, HTN, hyperlipidemia' },
};
