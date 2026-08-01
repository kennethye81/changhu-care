import type { Vitals } from '../store/patientStore';

export type AvpuLevel = 'A' | 'V' | 'P' | 'U';
export type NewsTier = 'low' | 'medium' | 'high';
export type Spo2Scale = 1 | 2;
export type MonitoringInterval = '12h' | '4-6h' | '1h' | 'continuous';

export interface NewsAssessment {
  score: number;
  tier: NewsTier;
  breakdown: {
    respiration: number;
    spo2: number;
    supplementalO2: number;
    systolicBp: number;
    pulse: number;
    consciousness: number;
    temperature: number;
  };
  hasSingleParameterScore3: boolean;
  redScore: boolean;
  monitoringInterval: MonitoringInterval;
  monitoringLabel: string;
  escalation: string;
  glucoseAlert?: 'attention' | 'critical';
  glucoseMessage?: string;
}

export const MONITORING_LABEL: Record<MonitoringInterval, string> = {
  '12h': '至少每12小时',
  '4-6h': '至少每4–6小时',
  '1h': '至少每小时',
  continuous: '持续监测',
};

const TIER_ESCALATION: Record<NewsTier, string> = {
  low: '常规监测 — 继续标准观察。',
  medium: '紧急复查（注册护士或医生）— 提高监测频率。',
  high: '应急响应 — 由高年资医生或急救团队紧急评估。',
};

const RED_SCORE_ESCALATION =
  '紧急复查（注册护士或医生）— 低总分下单参数评分3分。';

export function isCopdDiagnosis(diagnosis: string): boolean {
  return diagnosis.toLowerCase().includes('copd');
}

export function defaultSpo2Scale(diagnosis: string): Spo2Scale {
  return isCopdDiagnosis(diagnosis) ? 2 : 1;
}

export function normalizeVitals(v: Partial<Vitals>, diagnosis = ''): Vitals {
  return {
    hr: v.hr ?? 80,
    bpSystolic: v.bpSystolic ?? 120,
    bpDiastolic: v.bpDiastolic ?? 80,
    spo2: v.spo2 ?? 96,
    temp: v.temp ?? 36.6,
    rr: v.rr ?? 16,
    bloodSugar: v.bloodSugar ?? 110,
    avpu: v.avpu ?? 'A',
    onSupplementalO2: v.onSupplementalO2 ?? false,
    spo2Scale: v.spo2Scale ?? defaultSpo2Scale(diagnosis),
  };
}

function scoreRespiration(rr: number): number {
  if (rr <= 8) return 3;
  if (rr <= 11) return 1;
  if (rr <= 20) return 0;
  if (rr <= 24) return 2;
  return 3;
}

function scoreSpo2Scale1(spo2: number): number {
  if (spo2 <= 91) return 3;
  if (spo2 <= 93) return 2;
  if (spo2 <= 95) return 1;
  return 0;
}

function scoreSpo2Scale2(spo2: number): number {
  if (spo2 <= 83) return 3;
  if (spo2 <= 85) return 2;
  if (spo2 <= 87) return 1;
  if (spo2 <= 92) return 0;
  if (spo2 <= 94) return 1;
  if (spo2 <= 96) return 2;
  return 3;
}

function scoreSupplementalO2(onO2: boolean): number {
  return onO2 ? 2 : 0;
}

function scoreSystolicBp(sbp: number): number {
  if (sbp <= 90) return 3;
  if (sbp <= 100) return 2;
  if (sbp <= 110) return 1;
  if (sbp <= 219) return 0;
  return 3;
}

function scorePulse(hr: number): number {
  if (hr <= 40) return 3;
  if (hr <= 50) return 1;
  if (hr <= 90) return 0;
  if (hr <= 110) return 1;
  if (hr <= 130) return 2;
  return 3;
}

function scoreConsciousness(avpu: AvpuLevel): number {
  return avpu === 'A' ? 0 : 3;
}

function scoreTemperature(temp: number): number {
  if (temp <= 35.0) return 3;
  if (temp <= 36.0) return 1;
  if (temp <= 38.0) return 0;
  if (temp <= 39.0) return 1;
  return 2;
}

export function scoreNewsTier(total: number): NewsTier {
  if (total >= 7) return 'high';
  if (total >= 5) return 'medium';
  return 'low';
}

function hasSingleParameterScore3(breakdown: NewsAssessment['breakdown'], total: number): boolean {
  if (total > 4) return false;
  return Object.values(breakdown).some(n => n === 3);
}

export function resolveMonitoringInterval(
  score: number,
  tier: NewsTier,
  redScore: boolean,
): MonitoringInterval {
  if (tier === 'high') return 'continuous';
  if (tier === 'medium' || redScore) return '1h';
  if (score === 0) return '12h';
  return '4-6h';
}

export function resolveEscalation(tier: NewsTier, redScore: boolean): string {
  if (redScore && tier === 'low') return RED_SCORE_ESCALATION;
  return TIER_ESCALATION[tier];
}

export function assessGlucose(mgDl: number): { alert?: 'attention' | 'critical'; message?: string } {
  if (mgDl < 54 || mgDl > 400) {
    return { alert: 'critical', message: `Blood sugar ${mgDl} mg/dL — critical hypoglycaemia/hyperglycaemia` };
  }
  if (mgDl < 70 || mgDl > 250) {
    return { alert: 'critical', message: `Blood sugar ${mgDl} mg/dL — out of safe range` };
  }
  if (mgDl < 80 || mgDl > 180) {
    return { alert: 'attention', message: `Blood sugar ${mgDl} mg/dL — elevated, review required` };
  }
  return {};
}

export function calculateNews(vitals: Partial<Vitals>, diagnosis = ''): NewsAssessment {
  const v = normalizeVitals(vitals, diagnosis);
  const breakdown = {
    respiration: scoreRespiration(v.rr),
    spo2: v.spo2Scale === 2 ? scoreSpo2Scale2(v.spo2) : scoreSpo2Scale1(v.spo2),
    supplementalO2: scoreSupplementalO2(v.onSupplementalO2),
    systolicBp: scoreSystolicBp(v.bpSystolic),
    pulse: scorePulse(v.hr),
    consciousness: scoreConsciousness(v.avpu),
    temperature: scoreTemperature(v.temp),
  };
  const score = Object.values(breakdown).reduce((sum, n) => sum + n, 0);
  const tier = scoreNewsTier(score);
  const singleParam3 = hasSingleParameterScore3(breakdown, score);
  const redScore = singleParam3;
  const monitoringInterval = resolveMonitoringInterval(score, tier, redScore);
  const glucose = assessGlucose(v.bloodSugar);
  return {
    score,
    tier,
    breakdown,
    hasSingleParameterScore3: singleParam3,
    redScore,
    monitoringInterval,
    monitoringLabel: MONITORING_LABEL[monitoringInterval],
    escalation: resolveEscalation(tier, redScore),
    ...glucose,
  };
}

export const TIER_LABEL: Record<NewsTier, string> = {
  low: '低危 (0–4)',
  medium: '中危 (5–6)',
  high: '高危 (7+)',
};

export const TIER_SHORT: Record<NewsTier, string> = {
  low: '低危',
  medium: '中危',
  high: '高危',
};

export function newsTierLabel(tier: NewsTier): string {
  return TIER_LABEL[tier];
}

export function formatNewsTierLabel(news: Pick<NewsAssessment, 'score' | 'tier' | 'redScore'>): string {
  if (news.redScore) return `低危 (${news.score}) — RED评分`;
  return TIER_LABEL[news.tier];
}

export function formatNewsHeadline(news: Pick<NewsAssessment, 'score' | 'tier' | 'redScore'>): string {
  if (news.redScore) return `NEWS ${news.score} — 低危 (RED评分)`;
  return `NEWS ${news.score} — ${TIER_LABEL[news.tier]}`;
}

/** 演示升级体征（患者1 沈国栋）— NEWS 中高危 量表1 */
export const PATIENT1_ESCALATION_VITALS: Vitals = {
  hr: 98,
  bpSystolic: 140,
  bpDiastolic: 86,
  spo2: 90,
  temp: 38.3,
  rr: 26,
  bloodSugar: 118,
  avpu: 'A',
  onSupplementalO2: true,
  spo2Scale: 2,
};
