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

// COPD clinical baseline for trend comparison — uses 患者1 (沈国栋, 高血压+压疮) as reference.
// TODO: pass patient-specific DEFAULT_VITALS[patientId] instead of hardcoding patient 1.
const COPD_BASELINE = DEFAULT_VITALS[1];

function trends(vitals: Vitals, alertActive: boolean, baseline: Vitals = COPD_BASELINE) {
  return buildVitalTrends(vitals, alertActive, baseline);
}

export function buildFamilyHomeVitalCards(vitals: Vitals, alertActive: boolean, patientId?: number): FamilyVitalCard[] {
  const baseline = DEFAULT_VITALS[patientId ?? 1] || DEFAULT_VITALS[1];
  const t = trends(vitals, alertActive, baseline);
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
      label: '意识状态',
      value: alertActive ? '清醒，间歇性意识模糊' : '清醒',
      score: alertActive ? 'warn' : 'good',
    },
    {
      label: '定向力',
      value: alertActive ? '认知评估 7–9/10' : '认知评估 10/10',
      score: alertActive ? 'warn' : 'good',
    },
    {
      label: '情绪',
      value: alertActive ? '焦虑' : '平静',
      score: alertActive ? 'warn' : 'good',
    },
    {
      label: '疼痛评分',
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
    oralNote: alertActive ? '↓ 摄入减少 — 鼓励少量多次饮水' : '无液体限制 — 鼓励多饮水',
    urineNote: alertActive ? '⚠↓ 排尿减少 — 监测感染相关的急性肾损伤' : '排尿量正常',
    insight: alertActive
      ? '⚠ 正平衡+600mL — 发热伴排尿减少。监测急性肾损伤。鼓励口服补液。下次即时检验查肌酐。'
      : '摄入充足约1,500mL。排尿约1,400mL。净平衡+100mL — 无液体超负荷风险。未使用利尿剂。继续鼓励饮水。',
  };
}

export function buildFamilySleepSnapshot(vitals: Vitals, alertActive: boolean): FamilySleepSnapshot {
  const rr = vitals.rr ?? (alertActive ? 26 : 20);
  return {
    duration: alertActive ? '5.8' : '6.8',
    respRate: String(rr),
    sleepScore: alertActive ? '58' : '76',
    durationSub: alertActive ? '↓ 血氧警报干扰睡眠' : '满足康复需求',
    respSub: alertActive ? '⚠ 呼吸急促' : '正常范围',
    scoreSub: alertActive ? '差 — 频繁觉醒' : '质量良好',
    insight: alertActive
      ? '⚠ 睡眠严重受损 — 仅5.8小时且因血氧警报频繁觉醒（血氧降至90%）。呼吸频率升高。睡眠评分58/100表示恢复不良。优先优化氧疗以改善休息。'
      : `睡眠6.8小时，呼吸频率${rr}/分钟（正常范围）。评分76/100 — 质量良好。无明显夜间血氧下降。`,
  };
}

export function buildFamilyMentalInsight(alertActive: boolean): string {
  return alertActive
    ? 'SpO₂下降期间AMTS从10→7 — 疑为低氧性谵妄。吸氧2L/min后恢复至9/10。每小时监测一次。配偶陈玉兰在床旁 — 已培训意识模糊评估。'
    : '认知评估10/10。清醒，定向力×3。情绪平稳。家属在场，已培训照护计划。无认知功能减退，与基线一致。';
}
