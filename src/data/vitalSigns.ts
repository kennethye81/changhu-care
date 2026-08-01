// ─── Vital Sign Record — Data Generator & Clinical Thresholds ───
// 24h hourly readings (24 data points)
// Clinical thresholds per international guidelines, adjusted per patient condition

import {
  NEW_PATIENT_THRESHOLDS, NEW_PATIENT_START_DATES,
  NEW_VITALS_BASELINES, NEW_VITALS_CONTEXT,
} from './newPatients/vitalSignsExtras';

export const VITAL_RECORD_HOURS = 24;
export const VITAL_RECORD_INTERVAL_MIN = 60;

/** How to interpret green/amber bands when classifying a reading */
export type VitalRangeKind = 'bounded' | 'minimum' | 'maximum';

export const VITAL_RANGE_KIND: Record<string, VitalRangeKind> = {
  rr: 'bounded',
  hr: 'bounded',
  bpSystolic: 'bounded',
  bpDiastolic: 'bounded',
  spo2: 'minimum',      // SpO₂: only desaturation is abnormal (GOLD / IDSA)
  temp: 'bounded',
  bloodSugar: 'bounded',
};

export interface VitalsPoint {
  time: string;        // "HH:MM" format
  dateTime: string;    // "Jun 18 08:00" format for X-axis
  timestamp: number;   // minutes from start (0–2880)
  hr: number;
  bpSystolic: number;
  bpDiastolic: number;
  spo2: number;
  temp: number;
  rr: number;
  bloodSugar: number;
}

export interface VitalsThresholds {
  hr: { green: [number, number]; amber: [number, number] };
  bpSystolic: { green: [number, number]; amber: [number, number] };
  bpDiastolic: { green: [number, number]; amber: [number, number] };
  spo2: { green: [number, number]; amber: [number, number] };
  temp: { green: [number, number]; amber: [number, number] };
  rr?: { green: [number, number]; amber: [number, number] };
  bloodSugar?: { green: [number, number]; amber: [number, number] };
}

export const DEFAULT_RR_THRESHOLD = { green: [12, 20] as [number, number], amber: [8, 24] as [number, number] };
export const DEFAULT_GLUCOSE_THRESHOLD = { green: [80, 180] as [number, number], amber: [70, 250] as [number, number] };

export type ResolvedVitalsThresholds = VitalsThresholds & {
  rr: { green: [number, number]; amber: [number, number] };
  bloodSugar: { green: [number, number]; amber: [number, number] };
};

export function resolveThresholds(th: VitalsThresholds): ResolvedVitalsThresholds {
  return {
    ...th,
    rr: th.rr ?? DEFAULT_RR_THRESHOLD,
    bloodSugar: th.bloodSugar ?? DEFAULT_GLUCOSE_THRESHOLD,
  };
}

// ═══ Clinical Thresholds Per Patient (国际指南依据) ═══

export const PATIENT_THRESHOLDS: Record<number, { thresholds: VitalsThresholds; guidelines: string }> = {
  // P1: 冯存富 — HF NYHA III + CKD3 + T2DM + AF (78M, 常州)
  // ESC 2021 HF guidelines: HR target <70 in AF; BP target <130/80; SpO₂ ≥95%
  1: {
    thresholds: {
      hr:       { green: [60,100],   amber: [100,130] },     // AF: irregular, target <100 (ESC 2021 HF)
      bpSystolic:{ green: [100,130], amber: [130,155] },     // ESC 2021 HF: SBP 100-130 optimal
      bpDiastolic:{ green: [60,85],  amber: [85,95] },
      spo2:     { green: [95,100],   amber: [90,95] },       // HF: pulmonary congestion risk if <95%
      temp:     { green: [36.1,37.2],amber: [37.2,38.0] },   // NEWS2 temperature band
    },
    guidelines: 'ESC 2021 Heart Failure · KDIGO 2024 CKD3 · ESC 2020 AF',
  },
  // P2: 待录入 — COPD GOLD 3 + HTN + Dyslipid (72M, 常州)
  // GOLD 2024: COPD G3 FEV1 30-50%, baseline SpO₂ 88-92%
  2: {
    thresholds: {
      hr:       { green: [60,100],   amber: [100,120] },     // GOLD 2024: tachycardia >120 in AECOPD
      bpSystolic:{ green: [110,140], amber: [140,160] },     // ESC 2021 HTN: target <140 elderly
      bpDiastolic:{ green: [65,90],  amber: [90,100] },
      spo2:     { green: [88,95],    amber: [85,88] },       // GOLD 2024 COPD G3 baseline 88-92%
      temp:     { green: [36.1,37.2],amber: [37.2,38.0] },
    },
    guidelines: 'GOLD 2024 COPD Stage 3 · ESC 2021 HTN · ESC 2019 Dyslipidaemia',
  },
  // P3: 待录入 — CAP (resolving) + Penicillin anaphylaxis (45M, 常州)
  // IDSA 2019 CAP: CURB-65 1, outpatient management criteria
  3: {
    thresholds: {
      hr:       { green: [60,100],   amber: [100,110] },     // IDSA CAP: tachycardia early sign
      bpSystolic:{ green: [100,130], amber: [90,100] },       // IDSA CAP: hypotension = NEWS escalation
      bpDiastolic:{ green: [60,85],  amber: [50,60] },
      spo2:     { green: [95,100],   amber: [92,95] },       // IDSA CAP: SpO₂ <92% = severe
      temp:     { green: [36.1,37.0],amber: [37.0,38.3] },   // Afebrile resolving
    },
    guidelines: 'IDSA/ATS 2019 CAP · Penicillin Anaphylaxis (contraindication)',
  },
  // P4: 待录入 — UTI + CKD3 + T2DM + HTN + Delirium (76F, 常州)
  // IDSA 2024 UTI: complicated UTI in elderly female
  4: {
    thresholds: {
      hr:       { green: [60,100],   amber: [100,110] },
      bpSystolic:{ green: [110,140], amber: [140,160] },     // CKD+HTN: target <140 (KDIGO 2024)
      bpDiastolic:{ green: [65,90],  amber: [90,100] },
      spo2:     { green: [95,100],   amber: [90,95] },
      temp:     { green: [36.1,37.2],amber: [37.2,38.0] },   // Febrile watch — NEWS temp scoring (IDSA 2024 UTI)
    },
    guidelines: 'IDSA 2024 UTI · KDIGO 2024 CKD3 · ESC 2021 HTN · ADA 2024 T2DM',
  },
  // P5: 待录入 — Cellulitis Eron III + T2DM + HTN (68M, 常州)
  // IDSA 2014 SSTI: Eron Class III (systemic signs)
  5: {
    thresholds: {
      hr:       { green: [60,100],   amber: [100,110] },
      bpSystolic:{ green: [110,140], amber: [140,160] },
      bpDiastolic:{ green: [65,90],  amber: [90,100] },
      spo2:     { green: [95,100],   amber: [90,95] },
      temp:     { green: [36.1,37.2],amber: [37.2,38.0] },   // IDSA SSTI: systemic response
    },
    guidelines: 'IDSA 2014 SSTI · ESC 2021 HTN · ADA 2024 T2DM',
  },
  // P6: 待录入 — DVT LL + HTN + Dyslipid + Warfarin (58F, 常州)
  // ACCP CHEST 2021: DVT anticoagulation, INR target 2.0-3.0
  6: {
    thresholds: {
      hr:       { green: [60,100],   amber: [100,120] },     // ACCP: PE watch (tachycardia)
      bpSystolic:{ green: [110,140], amber: [140,160] },
      bpDiastolic:{ green: [65,90],  amber: [90,100] },
      spo2:     { green: [95,100],   amber: [92,95] },       // ACCP CHEST 2021: PE exclusion
      temp:     { green: [36.1,37.2],amber: [37.2,38.0] },
    },
    guidelines: 'ACCP CHEST 2021 DVT · ESC 2021 HTN · ACC/AHA Warfarin Management',
  },
  // P7: 待录入 — COPD GOLD 2 + CAP (resolving) + HTN (82M, PWH)
  // GOLD 2024 COPD G2 FEV1 55%, IDSA CAP resolving
  7: {
    thresholds: {
      hr:       { green: [60,100],   amber: [100,120] },
      bpSystolic:{ green: [110,140], amber: [140,160] },
      bpDiastolic:{ green: [65,90],  amber: [90,100] },
      spo2:     { green: [92,100],   amber: [88,92] },       // GOLD 2024 Scale 2: target ≥92%, no upper limit
      temp:     { green: [36.1,37.2],amber: [37.2,38.3] },   // CAP resolving (IDSA)
    },
    guidelines: 'GOLD 2024 COPD Stage 2 · IDSA/ATS 2019 CAP · ESC 2021 HTN',
  },
  ...NEW_PATIENT_THRESHOLDS,
};

// ═══ Color classification ═══

export function getVitalColor(
  value: number,
  range: { green: [number, number]; amber: [number, number] },
  kind: VitalRangeKind = 'bounded',
): 'green' | 'amber' | 'red' {
  const { green, amber } = range;
  if (value >= green[0] && value <= green[1]) return 'green';

  if (kind === 'minimum') {
    // SpO₂ etc.: higher than target is still acceptable
    if (value > green[1]) return 'green';
    if (value >= amber[0]) return 'amber';
    return 'red';
  }

  if (kind === 'maximum') {
    if (value < green[0]) return 'green';
    if (value <= amber[1]) return 'amber';
    return 'red';
  }

  // bounded: both tails
  const [aLo, aHi] = amber[0] <= amber[1] ? amber : [amber[1], amber[0]];
  if (value >= aLo && value <= aHi) return 'amber';
  return 'red';
}

// ═══ Patient admission dates (for X-axis labeling) ═══

const PATIENT_START_DATES: Record<number, string> = {
  1: '2026-06-18',  // Cheung Wai Man — HF admission
  2: '2026-06-18',  // Wong Chi Ming — COPD assessment
  3: '2026-06-19',  // Lam Ka Chun — CAP admission
  4: '2026-06-19',  // Lau Suk Yee — UTI admission
  5: '2026-06-20',  // Ho Tai Wai — Cellulitis
  6: '2026-06-20',  // Ng Siu Wan — DVT
  7: '2026-06-18',  // Chan Tai Ming — COPD+CAP HaH Day 1
  ...NEW_PATIENT_START_DATES,
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatDateTime(startDateStr: string, totalMinutes: number): string {
  const start = new Date(startDateStr + 'T08:00:00');
  const d = new Date(start.getTime() + totalMinutes * 60000);
  const month = MONTHS[d.getMonth()];
  const day = d.getDate();
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${month} ${day} ${h}:${m}`;
}

// ═══ Deterministic PRNG (Mulberry32) ═══

function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/** Hourly clinical perturbations (0–23h from monitoring start 08:00) */
type HourlyEffect = Partial<Record<'hr' | 'bpS' | 'bpD' | 'spo2' | 'temp' | 'rr' | 'bloodSugar', number>>;
type HourlyEvent = { startHour: number; durationHours: number; effects: HourlyEffect };

const HOURLY_CLINICAL_EVENTS: Record<number, HourlyEvent[]> = {
  1: [
    { startHour: 10, durationHours: 2, effects: { bpS: -6, hr: +4, spo2: -1 } },
    { startHour: 15, durationHours: 1, effects: { spo2: -2, hr: +6, rr: +2 } },
  ],
  2: [
    { startHour: 9, durationHours: 1, effects: { spo2: -4, hr: +8, rr: +3 } },
    { startHour: 14, durationHours: 1, effects: { spo2: -5, hr: +10, rr: +4 } },
  ],
  3: [
    { startHour: 0, durationHours: 6, effects: { temp: +0.5, hr: +6, rr: +2 } },
    { startHour: 8, durationHours: 4, effects: { temp: +0.2, hr: +2 } },
  ],
  4: [
    { startHour: 6, durationHours: 2, effects: { temp: +0.8, hr: +8, rr: +2 } },
    { startHour: 16, durationHours: 2, effects: { temp: +0.4, hr: +4 } },
  ],
  5: [
    { startHour: 8, durationHours: 3, effects: { temp: +0.7, hr: +6, rr: +1 } },
  ],
  6: [
    { startHour: 10, durationHours: 2, effects: { hr: +6, rr: +1 } },
  ],
  7: [
    { startHour: 17, durationHours: 2, effects: { spo2: -2, temp: +0.5, hr: +4, rr: +2 } },
    { startHour: 19, durationHours: 3, effects: { spo2: -4, temp: +1.0, hr: +10, rr: +4 } },
    { startHour: 22, durationHours: 2, effects: { spo2: -1, temp: +0.3, hr: +3, rr: +1 } },
  ],
};

function hourlyEventFactor(hour: number, startHour: number, durationHours: number): number {
  if (hour < startHour || hour >= startHour + durationHours) return 0;
  const progress = (hour - startHour + 0.5) / durationHours;
  return 1 - 4 * (progress - 0.5) * (progress - 0.5);
}

function smoothHourlyInt(values: number[], alpha = 0.45): number[] {
  if (values.length === 0) return values;
  const out = [values[0]];
  for (let i = 1; i < values.length; i++) {
    out.push(Math.round(out[i - 1] * (1 - alpha) + values[i] * alpha));
  }
  return out;
}

function smoothHourlyDec(values: number[], alpha = 0.45, decimals = 1): number[] {
  if (values.length === 0) return values;
  const out = [values[0]];
  for (let i = 1; i < values.length; i++) {
    const next = out[i - 1] * (1 - alpha) + values[i] * alpha;
    out.push(Math.round(next * 10 ** decimals) / 10 ** decimals);
  }
  return out;
}

// ═══ Vital Signs Generator ═══

export function generateVitalSigns(patientId: number): VitalsPoint[] {
  const rawTh = PATIENT_THRESHOLDS[patientId]?.thresholds;
  if (!rawTh) return [];
  const th = resolveThresholds(rawTh);
  const rng = mulberry32(patientId * 7919 + 12345);
  const points: VitalsPoint[] = [];
  
  // Baseline vitals per patient (from DEFAULT_VITALS + clinical condition)
  const baselines: Record<number, { hr: number; bpS: number; bpD: number; spo2: number; temp: number; rr: number; bloodSugar: number }> = {
    1: { hr:82,  bpS:118, bpD:72, spo2:95, temp:36.6, rr:18, bloodSugar: 128 },
    2: { hr:86,  bpS:134, bpD:80, spo2:90, temp:36.5, rr:20, bloodSugar: 105 },
    3: { hr:72,  bpS:118, bpD:74, spo2:97, temp:36.8, rr:16, bloodSugar: 102 },
    4: { hr:88,  bpS:138, bpD:84, spo2:96, temp:36.7, rr:18, bloodSugar: 132 },
    5: { hr:78,  bpS:136, bpD:82, spo2:97, temp:36.6, rr:16, bloodSugar: 138 },
    6: { hr:74,  bpS:132, bpD:80, spo2:97, temp:36.5, rr:15, bloodSugar: 108 },
    7: { hr:84,  bpS:138, bpD:84, spo2:93, temp:37.0, rr:20, bloodSugar: 110 },
    ...Object.fromEntries(
      Object.entries(NEW_VITALS_BASELINES).map(([id, b]) => [
        id,
        { ...b, bloodSugar: (b as { bloodSugar?: number }).bloodSugar ?? (Number(id) === 13 ? 142 : 110) },
      ]),
    ),
  };
  const bl = baselines[patientId] || baselines[1];
  const startDateStr = PATIENT_START_DATES[patientId] || '2026-06-18';
  const patientEvents = HOURLY_CLINICAL_EVENTS[patientId] ?? [];

  const rawHr: number[] = [];
  const rawBpS: number[] = [];
  const rawBpD: number[] = [];
  const rawSpo2: number[] = [];
  const rawTemp: number[] = [];
  const rawRr: number[] = [];
  const rawGlucose: number[] = [];

  for (let hour = 0; hour < VITAL_RECORD_HOURS; hour++) {
    const circadian = Math.sin((hour / VITAL_RECORD_HOURS) * 2 * Math.PI - Math.PI / 2);
    const noiseHR = (rng() - 0.5) * 3;
    const noiseBPS = (rng() - 0.5) * 3;
    const noiseBPD = (rng() - 0.5) * 2;
    const noiseSpO2 = (rng() - 0.5) * 0.8;
    const noiseTemp = (rng() - 0.5) * 0.08;
    const noiseRR = (rng() - 0.5) * 1;
    const noiseGlucose = (rng() - 0.5) * 4;

    let eventEffect: HourlyEffect = {};
    for (const ev of patientEvents) {
      const factor = hourlyEventFactor(hour, ev.startHour, ev.durationHours);
      if (factor <= 0) continue;
      for (const [k, delta] of Object.entries(ev.effects) as [keyof HourlyEffect, number][]) {
        eventEffect[k] = (eventEffect[k] ?? 0) + delta * factor;
      }
    }

    rawHr.push(bl.hr + noiseHR + circadian * 2 + (eventEffect.hr ?? 0));
    rawBpS.push(bl.bpS + noiseBPS + circadian * 1.5 + (eventEffect.bpS ?? 0));
    rawBpD.push(bl.bpD + noiseBPD + circadian * 0.8 + (eventEffect.bpD ?? 0));
    rawSpo2.push(bl.spo2 + noiseSpO2 + (eventEffect.spo2 ?? 0));
    rawTemp.push(bl.temp + noiseTemp + circadian * 0.08 + (eventEffect.temp ?? 0));
    rawRr.push(bl.rr + noiseRR + circadian * 0.6 + (eventEffect.rr ?? 0));
    rawGlucose.push(bl.bloodSugar + noiseGlucose + (eventEffect.bloodSugar ?? 0));
  }

  const hrSeries = smoothHourlyInt(rawHr.map(v => Math.max(45, Math.min(140, v))));
  const bpSSeries = smoothHourlyInt(rawBpS.map(v => Math.max(85, Math.min(180, v))));
  const bpDSeries = smoothHourlyInt(rawBpD.map(v => Math.max(45, Math.min(110, v))));
  const spo2Series = smoothHourlyInt(rawSpo2.map(v => Math.max(80, Math.min(100, v))));
  const tempSeries = smoothHourlyDec(rawTemp.map(v => Math.max(35.5, Math.min(39.5, v))), 0.45, 1);
  const rrSeries = smoothHourlyInt(rawRr.map(v => Math.max(10, Math.min(35, v))));
  const glucoseSeries = smoothHourlyInt(rawGlucose.map(v => Math.max(54, Math.min(400, v))));

  for (let hour = 0; hour < VITAL_RECORD_HOURS; hour++) {
    const t = hour * VITAL_RECORD_INTERVAL_MIN;
    const clock = new Date(new Date(startDateStr + 'T08:00:00').getTime() + t * 60000);
    const timeLabel = `${String(clock.getHours()).padStart(2, '0')}:00`;

    points.push({
      time: timeLabel,
      dateTime: formatDateTime(startDateStr, t),
      timestamp: t,
      hr: hrSeries[hour],
      bpSystolic: bpSSeries[hour],
      bpDiastolic: bpDSeries[hour],
      spo2: spo2Series[hour],
      temp: tempSeries[hour],
      rr: rrSeries[hour],
      bloodSugar: glucoseSeries[hour],
    });
  }

  return points;
}

// ═══ AI Summary Generator ═══

export interface VitalsSummary {
  rr: { mean: number; min: number; max: number; pctAmber: number; pctRed: number; trend: string; assessment: string };
  hr: { mean: number; min: number; max: number; pctAmber: number; pctRed: number; trend: string; assessment: string };
  bp: { sysMean: number; sysMin: number; sysMax: number; diaMean: number; pctAmber: number; pctRed: number; trend: string; assessment: string };
  spo2: { mean: number; min: number; max: number; pctAmber: number; pctRed: number; trend: string; assessment: string };
  bloodSugar: { mean: number; min: number; max: number; pctAmber: number; pctRed: number; trend: string; assessment: string };
  temp: { mean: number; min: number; max: number; pctAmber: number; pctRed: number; trend: string; assessment: string };
  overall: string;
  recommendations: string[];
}

export function generateVitalsSummary(patientId: number, data: VitalsPoint[]): VitalsSummary {
  const rawTh = PATIENT_THRESHOLDS[patientId]?.thresholds;
  if (!rawTh || data.length === 0) return {} as VitalsSummary;
  const th = resolveThresholds(rawTh);
  const n = data.length;
  const half = Math.floor(n / 2);

  const calc = (key: keyof VitalsPoint, thr: { green: [number,number]; amber: [number,number] }) => {
    const vals = data.map(d => d[key] as number);
    const firstHalf = vals.slice(0, half);
    const secondHalf = vals.slice(half);
    const mean = Math.round(vals.reduce((a,b) => a + b, 0) / n * 10) / 10;
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const firstMean = firstHalf.reduce((a,b) => a + b, 0) / half;
    const secondMean = secondHalf.reduce((a,b) => a + b, 0) / half;
    const trend = secondMean > firstMean + 1 ? '↑ 升高' : secondMean < firstMean - 1 ? '↓ 下降' : '→ 平稳';
    const ambers = vals.filter(v => getVitalColor(v, thr, VITAL_RANGE_KIND[key as string] ?? 'bounded') === 'amber').length;
    const reds = vals.filter(v => getVitalColor(v, thr, VITAL_RANGE_KIND[key as string] ?? 'bounded') === 'red').length;
    return { mean, min, max, firstMean, secondMean, trend, pctAmber: Math.round(ambers/n*100), pctRed: Math.round(reds/n*100) };
  };

  const rrStats = calc('rr', th.rr);
  const hrStats = calc('hr', th.hr);
  const sysStats = calc('bpSystolic', th.bpSystolic);
  const diaStats = calc('bpDiastolic', th.bpDiastolic);
  const spo2Stats = calc('spo2', th.spo2);
  const glucoseStats = calc('bloodSugar', th.bloodSugar);
  const tempStats = calc('temp', th.temp);

  // Per-patient clinical context
  const context: Record<number, { name: string; conditions: string }> = {
    1: { name: '冯存富', conditions: '高血压3级, 压疮II期, 极高跌倒风险' },
    2: { name: '待录入', conditions: 'COPD GOLD 3, HTN, Dyslipidaemia' },
    3: { name: '待录入', conditions: 'CAP (resolving), Penicillin anaphylaxis' },
    4: { name: '待录入', conditions: 'UTI, CKD3, T2DM, HTN, Delirium' },
    5: { name: '待录入', conditions: 'Cellulitis Eron III, T2DM, HTN' },
    6: { name: '待录入', conditions: 'DVT LL, HTN, Dyslipidaemia, Warfarin' },
    7: { name: 'Chan Tai Ming', conditions: 'COPD GOLD 2, CAP (resolving), HTN' },
    ...NEW_VITALS_CONTEXT,
  };
  const ctx = context[patientId] || { name: 'Unknown', conditions: '' };

  // Assess each vital sign
  const assessRR = () => {
    if (rrStats.pctRed > 5) return `呼吸急促发作 — ${rrStats.pctRed}%读数处于红色区域（最高${rrStats.max}次/分，${rrStats.trend}）。${ctx.conditions.includes('COPD') || ctx.conditions.includes('CAP') ? '依据GOLD 2024 / IDSA CAP，RR>24伴低氧血症提示急性恶化 — 需结合SpO₂和感染标志物综合判断。' : '需结合临床判断呼吸性或代谢性病因。'}`;
    if (rrStats.pctAmber > 10) return `呼吸频率在${rrStats.pctAmber}%读数中轻度升高（均值${rrStats.mean}次/分，${rrStats.trend}）。持续监测趋势并行完整NEWS评估。`;
    return `呼吸频率${rrStats.trend} — 均值${rrStats.mean}次/分。${Math.round(100 - rrStats.pctAmber - rrStats.pctRed)}%时间处于绿色区域。`;
  };
  const assessHR = () => {
    if (hrStats.pctRed > 5) return `检测到明显心动过速发作 — ${hrStats.pctRed}%读数处于红色区域（${hrStats.trend}）。${ctx.conditions.includes('HF') ? '依据ESC 2021指南，心衰患者需警惕 — 可能提示失代偿或房颤心率控制不足。' : ctx.conditions.includes('COPD') ? '依据GOLD 2024，可能反映COPD低氧驱动的交感神经激活。' : '需结合临床判断。'}`;
    if (hrStats.pctAmber > 10) return `轻度心动过速，${hrStats.pctAmber}%读数出现（${hrStats.trend}）。在当前临床状态下可接受范围内。`;
    return `心率监测期间${hrStats.trend}（均值${hrStats.mean} bpm）。${Math.round(100 - hrStats.pctAmber - hrStats.pctRed)}%时间处于绿色区域。`;
  };
  const assessBP = () => {
    if (sysStats.pctRed > 3) return `检测到高血压波动（收缩压最高${sysStats.max} mmHg）— ${sysStats.pctRed}%读数处于红色区域。${ctx.conditions.includes('CKD') ? '依据KDIGO 2024，血压控制对CKD3期肾脏保护至关重要。' : '中国高血压防治指南2024推荐目标<140/90。'}`;
    if (sysStats.pctAmber > 15) return `血压在${sysStats.pctAmber}%读数中中度升高（收缩压均值${sysStats.mean} mmHg，${sysStats.trend}）。监测恶化趋势。`;
    return `血压控制良好 — 均值${sysStats.mean}/${diaStats.mean} mmHg，${sysStats.trend}。${Math.round(100 - sysStats.pctAmber - sysStats.pctRed)}%处于绿色区域。`;
  };
  const assessSpO2 = () => {
    if (spo2Stats.pctRed > 5) return `⚠️ 显著低氧发作 — ${spo2Stats.pctRed}%读数处于红色区域（最低${spo2Stats.min}%）。${ctx.conditions.includes('COPD') ? '依据GOLD 2024，COPD GOLD 2级SpO₂ <88%提示严重低氧血症，需氧疗和紧急临床复审。排除感染性急性加重。' : ctx.conditions.includes('CAP') ? '依据IDSA CAP指南，SpO₂ <92%定义为重症CAP。肺炎后低氧可能提示未完全缓解。' : '低氧需紧急评估肺源性或心源性病因。'}`;
    if (spo2Stats.pctAmber > 10) return `轻度间歇性低氧（${spo2Stats.pctAmber}%黄色区域，最低${spo2Stats.min}%）。${ctx.conditions.includes('COPD') ? '符合COPD GOLD分级基线 — 按GOLD 2024监测下降趋势。' : '监测进展情况。'}`;
    return `血氧饱和度${spo2Stats.trend} — 均值${spo2Stats.mean}%，${Math.round(100 - spo2Stats.pctAmber - spo2Stats.pctRed)}%处于绿色区域。`;
  };
  const assessGlucose = () => {
    if (glucoseStats.pctRed > 3) return `⚠️ 血糖超出安全范围 — ${glucoseStats.pctRed}%读数处于危急值（${glucoseStats.min}–${glucoseStats.max} mg/dL）。${ctx.conditions.includes('T2DM') || ctx.conditions.includes('Diabetes') ? '依据ADA 2024，复查胰岛素/口服降糖方案并排查感染相关性高血糖。' : '未纳入NEWS评分 — 适用独立血糖预警协议（<70或>250为危急值）。立即复阅。'}`;
    if (glucoseStats.pctAmber > 10) return `血糖间歇超出目标范围，${glucoseStats.pctAmber}%读数异常（均值${glucoseStats.mean} mg/dL）。仅预警指标 — 不计入NEWS评分。建议饮食评估和自我血糖监测日志。`;
    return `血糖${glucoseStats.trend} — 均值${glucoseStats.mean} mg/dL，在可接受范围内。仅供参考显示；不计入NEWS评分。`;
  };
  const assessTemp = () => {
    if (tempStats.pctRed > 3) return `⚠️ 检测到发热发作（最高${tempStats.max}°C）— ${tempStats.pctRed}%读数处于红色区域。${ctx.conditions.includes('UTI') ? '依据IDSA 2024，复杂性UTI发热 — 查尿培养、CRP、PCT。确保静脉抗生素依从性。如NEWS2 ≥5分升级。' : ctx.conditions.includes('CAP') || ctx.conditions.includes('Cellulitis') ? '依据IDSA指南，发热可能反映持续感染过程 — 确认抗生素敏感性，考虑感染源控制。监测NEWS2趋势。' : '构成NEWS升级因素 — 居家照护预案：血培养、CRP、PCT，NEWS ≥5时查乳酸。'}`;
    if (tempStats.pctAmber > 15) return `${tempStats.pctAmber}%读数出现低度体温升高（${tempStats.trend}）。符合感染缓解过程。`;
    return `体温${tempStats.trend} — 均值${tempStats.mean}°C，监测期间无发热。感染正在缓解。`;
  };

  // Overall assessment
  const reds = [rrStats.pctRed, hrStats.pctRed, sysStats.pctRed, spo2Stats.pctRed, glucoseStats.pctRed, tempStats.pctRed];
  const maxRed = Math.max(...reds);
  const overallRisk = maxRed > 5 ? '高危 — 建议立即临床复审' : maxRed > 0 ? '中危 — 建议择期复审' : '低危 — 常规监测即可';

  const overall = maxRed > 5
    ? `⚠️ 七参数生命体征回顾显示过去24小时临床不稳定。RR均值${rrStats.mean}次/分，HR ${hrStats.mean} bpm，BP ${sysStats.mean}/${diaStats.mean} mmHg，SpO₂ ${spo2Stats.mean}%，血糖${glucoseStats.mean} mg/dL，体温${tempStats.mean}°C。${spo2Stats.pctRed > 5 ? '显著低氧血症需紧急评估。' : ''}${rrStats.pctRed > 5 ? '呼吸急促需关注。' : ''}${tempStats.pctRed > 3 ? '发热提示持续感染。' : ''}${glucoseStats.pctRed > 3 ? '血糖波动需独立预警复核。' : ''}建议立即医生复审。`
    : maxRed > 0
    ? `七参数每小时监测（24次读数）显示RR（${rrStats.mean}次/分）、HR（${hrStats.mean} bpm）、BP（${sysStats.mean}/${diaStats.mean} mmHg）、SpO₂（${spo2Stats.mean}%）、血糖（${glucoseStats.mean} mg/dL）、体温（${tempStats.mean}°C）存在轻度异常 — 与${ctx.conditions}表现一致。继续居家照护监测并行NEWS分级评估。`
    : `24小时每小时监测中，全部七项生命体征参数均在${ctx.conditions}可接受范围内。RR ${rrStats.mean}次/分，HR ${hrStats.mean} bpm，BP ${sysStats.mean}/${diaStats.mean} mmHg，SpO₂ ${spo2Stats.mean}%，血糖${glucoseStats.mean} mg/dL（仅预警），体温${tempStats.mean}°C。患者临床状态稳定。`;

  const recommendations = [
    rrStats.pctRed > 5 ? '升级呼吸监测 — 如SpO₂持续<88%查动脉血气；疑似新浸润者查胸部影像' : null,
    hrStats.pctRed > 5 ? '提高心率监测频率至持续监测；如HR>120持续>30分钟通知医生' : null,
    spo2Stats.pctRed > 5 ? '按COPD方案升级氧疗；如SpO₂持续<88%复查动脉血气；考虑胸片排除新浸润' : null,
    tempStats.pctRed > 3 ? '复查感染指标（血常规、CRP、PCT、血培养×2）；按药敏结果评估抗生素方案' : null,
    glucoseStats.pctRed > 3 ? '血糖预警预案 — 复测末梢血糖，复查降糖药物，有症状者考虑DKA/HHS筛查' : null,
    sysStats.pctRed > 3 ? '优化降压方案；家庭血压日志bid；按KDIGO CKD方案监测肾功能' : null,
    '继续当前居家照护护士访视计划，每次访视记录全部七项生命体征',
    '持续家属教育：升级标准和设备使用',
    '48小时内安排多学科团队复评照护计划和NEWS分级',
  ].filter(Boolean) as string[];

  return {
    rr: { ...rrStats, assessment: assessRR() },
    hr: { ...hrStats, assessment: assessHR() },
    bp: { sysMean: sysStats.mean, sysMin: sysStats.min, sysMax: sysStats.max, diaMean: diaStats.mean, pctAmber: sysStats.pctAmber, pctRed: sysStats.pctRed, trend: sysStats.trend, assessment: assessBP() },
    spo2: { ...spo2Stats, assessment: assessSpO2() },
    bloodSugar: { ...glucoseStats, assessment: assessGlucose() },
    temp: { ...tempStats, assessment: assessTemp() },
    overall: `${overall}\n\n风险等级：${overallRisk}`,
    recommendations,
  };
}
