import type { LucideIcon } from 'lucide-react';
import { Activity, Droplets, Heart, Thermometer, Wind } from 'lucide-react';
import { DEFAULT_VITALS, type Vitals } from '../store/patientStore';
import { buildVitalParameterAssessment, formatP7AlertBanner } from './medicalHistoryNews';
import { buildVitalTrends } from './vitalTrendSeries';

export { formatP7AlertBanner };

export interface FamilyVitalTrendMeta {
  trend: number[];
  trendDir: 'up' | 'down' | 'flat';
  device: string;
  insight: string;
}

export interface FamilyVitalCard {
  label: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  textColor: string;
  abnormal: boolean;
  trend: number[];
  trendDir: 'up' | 'down' | 'flat';
  trendDia?: number[];
  dualLine?: boolean;
  device?: string;
  insight?: string;
}

// COPD clinical baseline for trend comparison — uses P7 (Chan Tai Ming, COPD GOLD 2) as reference.
// TODO: pass patient-specific DEFAULT_VITALS[patientId] instead of hardcoding P7.
const COPD_BASELINE = DEFAULT_VITALS[7];

function trends(vitals: Vitals, p7Alert: boolean) {
  return buildVitalTrends(vitals, p7Alert, COPD_BASELINE);
}

export function buildFamilyHomeVitalCards(vitals: Vitals, p7Alert: boolean): FamilyVitalCard[] {
  const t = trends(vitals, p7Alert);
  const abnormal = p7Alert;
  const glucoseAbnormal = vitals.bloodSugar < 80 || vitals.bloodSugar > 180;
  const card = (
    label: string,
    value: string,
    unit: string,
    icon: LucideIcon,
    trend: number[],
    trendDir: 'up' | 'down' | 'flat',
    isAbnormal: boolean,
    extra?: Partial<Pick<FamilyVitalCard, 'trendDia' | 'dualLine'>>,
  ): FamilyVitalCard => ({
    label,
    value,
    unit,
    icon,
    color: isAbnormal ? '#ef4444' : '#06B0EF',
    bg: isAbnormal ? 'bg-red-50' : 'bg-[#FFFFFF]',
    textColor: isAbnormal ? 'text-red-600' : 'text-[#06B0EF]',
    abnormal: isAbnormal,
    trend,
    trendDir,
    ...extra,
  });
  return [
    card('Resp Rate', String(vitals.rr), '/min', Wind, t.rr, abnormal ? 'up' : 'flat', abnormal),
    card('Pulse', String(vitals.hr), 'bpm', Heart, t.hr, abnormal ? 'up' : 'flat', abnormal),
    card(
      'Blood Pressure',
      `${vitals.bpSystolic}/${vitals.bpDiastolic}`,
      'mmHg',
      Activity,
      t.bpSys,
      abnormal ? 'up' : 'flat',
      abnormal,
      { trendDia: t.bpDia, dualLine: true },
    ),
    card('SpO₂', String(vitals.spo2), '%', Droplets, t.spo2, abnormal ? 'down' : 'flat', abnormal),
    card('Glucose', String(vitals.bloodSugar), 'mg/dL', Activity, t.glucose, 'flat', glucoseAbnormal),
    card('Temperature', vitals.temp.toFixed(1), '°C', Thermometer, t.temp, abnormal ? 'up' : 'flat', abnormal),
  ];
}

export function buildFamilyDetailVitalCards(vitals: Vitals, p7Alert: boolean, diagnosis = 'COPD'): FamilyVitalCard[] {
  const t = trends(vitals, p7Alert);
  const glucoseAbnormal = vitals.bloodSugar < 80 || vitals.bloodSugar > 180;
  const baseline = COPD_BASELINE;
  const insight = (param: Parameters<typeof buildVitalParameterAssessment>[0]) =>
    buildVitalParameterAssessment(param, vitals, diagnosis, p7Alert ? baseline : undefined);
  const detailMeta = [
    {
      label: 'Respiratory Rate',
      value: String(vitals.rr),
      unit: '/min',
      icon: Wind,
      color: p7Alert ? '#ef4444' : '#0095D3',
      bg: p7Alert ? 'bg-red-50' : 'bg-amber-50',
      textColor: p7Alert ? 'text-red-600' : 'text-amber-600',
      trend: t.rr,
      trendDir: (p7Alert ? 'up' : 'flat') as 'up' | 'down' | 'flat',
      device: 'Smart Bed Sensor',
      insight: insight('rr'),
    },
    {
      label: 'Heart Rate',
      value: String(vitals.hr),
      unit: 'bpm',
      icon: Heart,
      color: p7Alert ? '#ef4444' : '#f59e0b',
      bg: p7Alert ? 'bg-red-50' : 'bg-amber-50',
      textColor: p7Alert ? 'text-red-600' : 'text-amber-600',
      trend: t.hr,
      trendDir: (p7Alert ? 'up' : 'flat') as 'up' | 'down' | 'flat',
      device: 'Smartwatch S3',
      insight: insight('hr'),
    },
    {
      label: 'Blood Pressure',
      value: `${vitals.bpSystolic}/${vitals.bpDiastolic}`,
      unit: 'mmHg',
      icon: Activity,
      color: p7Alert ? '#ef4444' : '#f59e0b',
      bg: p7Alert ? 'bg-red-50' : 'bg-amber-50',
      textColor: p7Alert ? 'text-red-600' : 'text-amber-600',
      trend: t.bpSys,
      trendDia: t.bpDia,
      dualLine: true,
      trendDir: (p7Alert ? 'up' : 'flat') as 'up' | 'down' | 'flat',
      device: 'Omron HEM-7361T',
      insight: `${insight('bpSystolic')} ${insight('bpDiastolic')}`,
      abnormal: p7Alert || vitals.bpSystolic >= 140 || vitals.bpDiastolic >= 90,
    },
    {
      label: 'SpO₂',
      value: String(vitals.spo2),
      unit: '%',
      icon: Droplets,
      color: '#ef4444',
      bg: p7Alert ? 'bg-red-50' : 'bg-amber-50',
      textColor: p7Alert ? 'text-red-600' : 'text-amber-600',
      trend: t.spo2,
      trendDir: (p7Alert ? 'down' : 'flat') as 'up' | 'down' | 'flat',
      device: 'Nonin Pulse Oximeter',
      insight: insight('spo2'),
    },
    {
      label: 'Blood Glucose',
      value: String(vitals.bloodSugar),
      unit: 'mg/dL',
      icon: Activity,
      color: glucoseAbnormal ? '#ef4444' : '#0095D3',
      bg: glucoseAbnormal ? 'bg-red-50' : 'bg-amber-50',
      textColor: glucoseAbnormal ? 'text-red-600' : 'text-amber-600',
      trend: t.glucose,
      trendDir: 'flat' as const,
      device: 'Accu-Chek Guide',
      insight: insight('bloodSugar'),
    },
    {
      label: 'Temperature',
      value: vitals.temp.toFixed(1),
      unit: '°C',
      icon: Thermometer,
      color: '#ef4444',
      bg: p7Alert ? 'bg-red-50' : 'bg-amber-50',
      textColor: p7Alert ? 'text-red-600' : 'text-amber-600',
      trend: t.temp,
      trendDir: (p7Alert ? 'up' : 'flat') as 'up' | 'down' | 'flat',
      device: 'Infrared Thermometer',
      insight: insight('temp'),
    },
  ];

  return detailMeta.map(item => ({
    ...item,
    abnormal: p7Alert
      || (item.label === 'Blood Glucose' && glucoseAbnormal)
      || (item.label === 'Blood Pressure' && (vitals.bpSystolic >= 140 || vitals.bpDiastolic >= 90)),
  }));
}

export interface FamilyMentalStatusRow {
  label: string;
  value: string;
  score: 'good' | 'warn' | 'bad';
}

export interface FamilyIoSnapshot {
  oralIntake: string;
  oralPct: number;
  urineOutput: string;
  urinePct: number;
  fluidBalance: string;
  fluidWarn: boolean;
  oralNote: string;
  urineNote: string;
  insight: string;
}

export interface FamilySleepSnapshot {
  duration: string;
  respRate: string;
  sleepScore: string;
  durationSub: string;
  respSub: string;
  scoreSub: string;
  insight: string;
}

export function buildFamilyMentalStatus(vitals: Vitals, p7Alert: boolean): FamilyMentalStatusRow[] {
  const rr = vitals.rr ?? (p7Alert ? 26 : 20);
  void rr;
  return [
    {
      label: 'Alertness',
      value: p7Alert ? 'Alert, intermittent confusion' : 'Alert',
      score: p7Alert ? 'warn' : 'good',
    },
    {
      label: 'Orientation',
      value: p7Alert ? 'AMTS 7–9/10' : 'AMTS 10/10',
      score: p7Alert ? 'warn' : 'good',
    },
    {
      label: 'Mood',
      value: p7Alert ? 'Anxious' : 'Calm',
      score: p7Alert ? 'warn' : 'good',
    },
    {
      label: 'Pain Level',
      value: p7Alert ? '3/10' : '2/10',
      score: p7Alert ? 'warn' : 'good',
    },
  ];
}

export function buildFamilyIoSnapshot(vitals: Vitals, p7Alert: boolean): FamilyIoSnapshot {
  return {
    oralIntake: p7Alert ? '~1,200 mL' : '~1,500 mL',
    oralPct: p7Alert ? 60 : 75,
    urineOutput: p7Alert ? '~900 mL' : '~1,400 mL',
    urinePct: p7Alert ? 45 : 70,
    fluidBalance: p7Alert ? '+600 mL' : '+100 mL',
    fluidWarn: p7Alert,
    oralNote: p7Alert ? '↓ Reduced intake — encourage small frequent sips' : 'No fluid restriction — encourage hydration',
    urineNote: p7Alert ? '⚠↓ Reduced — monitor for AKI with infection' : 'Adequate urine output',
    insight: p7Alert
      ? '⚠ Positive balance +600mL — febrile patient with reduced urine output. Monitor for AKI (KDIGO 2024). Encourage oral fluids. Check creatinine at next POCT.'
      : 'Adequate intake ~1,500mL. Urine output ~1,400mL. Net +100mL — no fluid overload concern. No diuretic therapy. Continue encouraging hydration for sputum clearance.',
  };
}

export function buildFamilySleepSnapshot(vitals: Vitals, p7Alert: boolean): FamilySleepSnapshot {
  const rr = vitals.rr ?? (p7Alert ? 26 : 20);
  return {
    duration: p7Alert ? '5.8' : '6.8',
    respRate: String(rr),
    sleepScore: p7Alert ? '58' : '76',
    durationSub: p7Alert ? '↓ Disrupted by SpO₂ alarms' : 'Adequate for recovery',
    respSub: p7Alert ? '⚠ Tachypneic' : 'COPD baseline',
    scoreSub: p7Alert ? 'Poor — frequent arousals' : 'Fair quality',
    insight: p7Alert
      ? '⚠ Sleep severely disrupted — only 5.8h with frequent arousals from SpO₂ alarms (O₂ desat to 90%). RR elevated. Sleep score 58/100 indicates poor recovery. Prioritise O₂ optimization to improve rest.'
      : `Sleep 6.8h, RR ${rr}/min (COPD baseline — GOLD 2024: tachypnea expected). Score 76/100 — fair quality. No significant nocturnal desaturation. O₂ concentrator on standby.`,
  };
}

export function buildFamilyMentalInsight(p7Alert: boolean): string {
  return p7Alert
    ? 'AMTS dropped from 10→7 during SpO₂ desaturation — likely hypoxic delirium. Recovering to 9/10 on O₂ 2L/min. Monitor q1h. Wife (Mrs. Chan) at bedside — trained on confusion assessment.'
    : 'AMTS 10/10. Alert and oriented ×3. Mood calm. Wife present and trained on COPD action plan. No cognitive decline. Consistent with baseline.';
}
