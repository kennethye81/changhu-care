import type { LucideIcon } from 'lucide-react';
import { Activity, Droplets, Heart, Thermometer, Wind } from 'lucide-react';
import { DEFAULT_VITALS, type Vitals } from '../store/patientStore';
import { buildVitalParameterAssessment, formatPatient1AlertBanner } from './medicalHistoryNews';
import { buildVitalTrends } from './vitalTrendSeries';

export { formatPatient1AlertBanner };

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

// COPD clinical baseline for trend comparison — uses 患者1 (冯存富, 高血压+压疮) as reference.
// TODO: pass patient-specific DEFAULT_VITALS[patientId] instead of hardcoding patient 1.
const COPD_BASELINE = DEFAULT_VITALS[7];

function trends(vitals: Vitals, alertActive: boolean) {
  return buildVitalTrends(vitals, alertActive, COPD_BASELINE);
}

export function buildFamilyHomeVitalCards(vitals: Vitals, alertActive: boolean): FamilyVitalCard[] {
  const t = trends(vitals, alertActive);
  const abnormal = alertActive;
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

export function buildFamilyDetailVitalCards(vitals: Vitals, alertActive: boolean, diagnosis = 'COPD'): FamilyVitalCard[] {
  const t = trends(vitals, alertActive);
  const glucoseAbnormal = vitals.bloodSugar < 80 || vitals.bloodSugar > 180;
  const baseline = COPD_BASELINE;
  const insight = (param: Parameters<typeof buildVitalParameterAssessment>[0]) =>
    buildVitalParameterAssessment(param, vitals, diagnosis, alertActive ? baseline : undefined);
  const detailMeta = [
    {
      label: 'Respiratory Rate',
      value: String(vitals.rr),
      unit: '/min',
      icon: Wind,
      color: alertActive ? '#ef4444' : '#0095D3',
      bg: alertActive ? 'bg-red-50' : 'bg-amber-50',
      textColor: alertActive ? 'text-red-600' : 'text-amber-600',
      trend: t.rr,
      trendDir: (alertActive ? 'up' : 'flat') as 'up' | 'down' | 'flat',
      device: 'Smart Bed Sensor',
      insight: insight('rr'),
    },
    {
      label: 'Heart Rate',
      value: String(vitals.hr),
      unit: 'bpm',
      icon: Heart,
      color: alertActive ? '#ef4444' : '#f59e0b',
      bg: alertActive ? 'bg-red-50' : 'bg-amber-50',
      textColor: alertActive ? 'text-red-600' : 'text-amber-600',
      trend: t.hr,
      trendDir: (alertActive ? 'up' : 'flat') as 'up' | 'down' | 'flat',
      device: 'Smartwatch S3',
      insight: insight('hr'),
    },
    {
      label: 'Blood Pressure',
      value: `${vitals.bpSystolic}/${vitals.bpDiastolic}`,
      unit: 'mmHg',
      icon: Activity,
      color: alertActive ? '#ef4444' : '#f59e0b',
      bg: alertActive ? 'bg-red-50' : 'bg-amber-50',
      textColor: alertActive ? 'text-red-600' : 'text-amber-600',
      trend: t.bpSys,
      trendDia: t.bpDia,
      dualLine: true,
      trendDir: (alertActive ? 'up' : 'flat') as 'up' | 'down' | 'flat',
      device: 'Omron HEM-7361T',
      insight: `${insight('bpSystolic')} ${insight('bpDiastolic')}`,
      abnormal: alertActive || vitals.bpSystolic >= 140 || vitals.bpDiastolic >= 90,
    },
    {
      label: 'SpO₂',
      value: String(vitals.spo2),
      unit: '%',
      icon: Droplets,
      color: '#ef4444',
      bg: alertActive ? 'bg-red-50' : 'bg-amber-50',
      textColor: alertActive ? 'text-red-600' : 'text-amber-600',
      trend: t.spo2,
      trendDir: (alertActive ? 'down' : 'flat') as 'up' | 'down' | 'flat',
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
      bg: alertActive ? 'bg-red-50' : 'bg-amber-50',
      textColor: alertActive ? 'text-red-600' : 'text-amber-600',
      trend: t.temp,
      trendDir: (alertActive ? 'up' : 'flat') as 'up' | 'down' | 'flat',
      device: 'Infrared Thermometer',
      insight: insight('temp'),
    },
  ];

  return detailMeta.map(item => ({
    ...item,
    abnormal: alertActive
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

export function buildFamilyMentalStatus(vitals: Vitals, alertActive: boolean): FamilyMentalStatusRow[] {
  const rr = vitals.rr ?? (alertActive ? 26 : 20);
  void rr;
  return [
    {
      label: 'Alertness',
      value: alertActive ? 'Alert, intermittent confusion' : 'Alert',
      score: alertActive ? 'warn' : 'good',
    },
    {
      label: 'Orientation',
      value: alertActive ? 'AMTS 7–9/10' : 'AMTS 10/10',
      score: alertActive ? 'warn' : 'good',
    },
    {
      label: 'Mood',
      value: alertActive ? 'Anxious' : 'Calm',
      score: alertActive ? 'warn' : 'good',
    },
    {
      label: 'Pain Level',
      value: alertActive ? '3/10' : '2/10',
      score: alertActive ? 'warn' : 'good',
    },
  ];
}

export function buildFamilyIoSnapshot(vitals: Vitals, alertActive: boolean): FamilyIoSnapshot {
  return {
    oralIntake: alertActive ? '~1,200 mL' : '~1,500 mL',
    oralPct: alertActive ? 60 : 75,
    urineOutput: alertActive ? '~900 mL' : '~1,400 mL',
    urinePct: alertActive ? 45 : 70,
    fluidBalance: alertActive ? '+600 mL' : '+100 mL',
    fluidWarn: alertActive,
    oralNote: alertActive ? '↓ Reduced intake — encourage small frequent sips' : 'No fluid restriction — encourage hydration',
    urineNote: alertActive ? '⚠↓ Reduced — monitor for AKI with infection' : 'Adequate urine output',
    insight: alertActive
      ? '⚠ Positive balance +600mL — febrile patient with reduced urine output. Monitor for AKI (KDIGO 2024). Encourage oral fluids. Check creatinine at next POCT.'
      : 'Adequate intake ~1,500mL. Urine output ~1,400mL. Net +100mL — no fluid overload concern. No diuretic therapy. Continue encouraging hydration for sputum clearance.',
  };
}

export function buildFamilySleepSnapshot(vitals: Vitals, alertActive: boolean): FamilySleepSnapshot {
  const rr = vitals.rr ?? (alertActive ? 26 : 20);
  return {
    duration: alertActive ? '5.8' : '6.8',
    respRate: String(rr),
    sleepScore: alertActive ? '58' : '76',
    durationSub: alertActive ? '↓ Disrupted by SpO₂ alarms' : 'Adequate for recovery',
    respSub: alertActive ? '⚠ Tachypneic' : 'COPD baseline',
    scoreSub: alertActive ? 'Poor — frequent arousals' : 'Fair quality',
    insight: alertActive
      ? '⚠ Sleep severely disrupted — only 5.8h with frequent arousals from SpO₂ alarms (O₂ desat to 90%). RR elevated. Sleep score 58/100 indicates poor recovery. Prioritise O₂ optimization to improve rest.'
      : `Sleep 6.8h, RR ${rr}/min (COPD baseline — GOLD 2024: tachypnea expected). Score 76/100 — fair quality. No significant nocturnal desaturation. O₂ concentrator on standby.`,
  };
}

export function buildFamilyMentalInsight(alertActive: boolean): string {
  return alertActive
    ? 'SpO₂下降期间AMTS从10→7 — 疑为低氧性谵妄。吸氧2L/min后恢复至9/10。每小时监测一次。配偶王小凤在床旁 — 已培训意识模糊评估。'
    : 'AMTS 10/10。清醒，定向力×3。情绪平稳。配偶在场，已培训COPD行动计划。 No cognitive decline. Consistent with baseline.';
}
