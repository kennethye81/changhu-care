import { ALL_DEFAULT_VITALS } from '../data/allDefaultVitals';
import type { Vitals } from '../store/patientStore';
import {
  calculateNews,
  formatNewsHeadline,
  formatNewsTierLabel,
  isCopdDiagnosis,
  P7_NEWS_ESCALATION_VITALS,
  type NewsAssessment,
} from './newsScore';

export { formatNewsHeadline, formatNewsTierLabel };

const NEWS_SUMMARY_PATTERNS = [
  /NEWS (?:Low–Medium|Low|Medium|High)(?: \([^)]+\))?(?: — RED score)?/gi,
  /\(NEWS (?:Low–Medium|Low|Medium|High) \d+\)/gi,
  /\bNEWS (?:Low–Medium|Low|Medium|High) \d+\b/gi,
];

export type VitalParamKey = 'rr' | 'hr' | 'bpSystolic' | 'bpDiastolic' | 'spo2' | 'bloodSugar' | 'temp';

export function formatSevenVitalLine(v: Vitals): string {
  return `RR ${v.rr}/min · Pulse ${v.hr} bpm · BP ${v.bpSystolic}/${v.bpDiastolic} mmHg · SpO₂ ${v.spo2}%${v.onSupplementalO2 ? ' (Scale ' + v.spo2Scale + ' + O₂)' : ''} · Glucose ${v.bloodSugar} mg/dL · Temp ${v.temp}°C`;
}

export function syncAiSummaryNews(patientId: number, diagnosis: string, aiSummary: string): string {
  const vitals = ALL_DEFAULT_VITALS[patientId];
  if (!vitals) return aiSummary;
  const news = calculateNews(vitals, diagnosis);
  const replacement = `NEWS ${formatNewsTierLabel(news)}`;
  let result = aiSummary;
  for (const pattern of NEWS_SUMMARY_PATTERNS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

export function buildClinicalAlertText(
  patientId: number,
  diagnosis: string,
  vitals: Vitals,
): string {
  const news = calculateNews(vitals, diagnosis);
  const vitalsLine = formatSevenVitalLine(vitals);
  if (news.tier === 'high') {
    return `⚠ ${formatNewsHeadline(news)} — ${vitalsLine}. ${news.escalation} ${news.monitoringLabel}.`;
  }
  if (news.redScore) {
    return `⚠ ${formatNewsHeadline(news)} — ${vitalsLine}. ${news.escalation} ${news.monitoringLabel}.`;
  }
  if (patientId === 7) {
    return `HaH Day 1 — ${formatNewsHeadline(news)}. ${vitalsLine}. ${news.monitoringLabel}. Family trained on SpO₂ monitoring and COPD action plan.`;
  }
  return `${formatNewsHeadline(news)} — ${news.monitoringLabel}. ${news.escalation}`;
}

export function formatNewsChatLine(
  patientId: number,
  diagnosis: string,
  prefix = '',
  suffix = '',
  vitals?: Vitals,
): string {
  const v = vitals ?? ALL_DEFAULT_VITALS[patientId];
  if (!v) return `${prefix}${suffix}`.trim();
  const news = calculateNews(v, diagnosis);
  const newsPart = `NEWS ${formatNewsTierLabel(news)} — ${news.monitoringLabel}`;
  return [prefix, newsPart, suffix].filter(Boolean).join('. ').replace(/\.\./g, '.');
}

export function formatP7EscalationChat(prefix: string, suffix = ''): string {
  const news = calculateNews(P7_NEWS_ESCALATION_VITALS, 'COPD');
  const line = formatSevenVitalLine(P7_NEWS_ESCALATION_VITALS);
  const newsPart = `${formatNewsHeadline(news)} — ${news.monitoringLabel}. ${news.escalation}`;
  return [prefix, line, newsPart, suffix].filter(Boolean).join('. ').replace(/\.\./g, '.');
}

export function formatP7BaselineChat(prefix: string, suffix = ''): string {
  const v = ALL_DEFAULT_VITALS[7];
  const news = calculateNews(v, 'COPD');
  const line = formatSevenVitalLine(v);
  const newsPart = `${formatNewsHeadline(news)} — ${news.monitoringLabel}`;
  return [prefix, line, newsPart, suffix].filter(Boolean).join('. ').replace(/\.\./g, '.');
}

export function formatP7AlertBanner(vitals: Vitals, diagnosis = 'COPD'): string {
  const news = calculateNews(vitals, diagnosis);
  return `${formatNewsHeadline(news)} — RR ${vitals.rr}/min, SpO₂ ${vitals.spo2}%${vitals.onSupplementalO2 ? ' (Scale ' + vitals.spo2Scale + ' + O₂)' : ''}, Temp ${vitals.temp.toFixed(1)}°C, HR ${vitals.hr}. ${news.escalation}`;
}

export function formatHubP7InboxPreview(): { subject: string; preview: string } {
  const v = P7_NEWS_ESCALATION_VITALS;
  const news = calculateNews(v, 'COPD');
  return {
    subject: `${formatNewsHeadline(news)} — 冯存富 SpO₂ drop`,
    preview: `${formatNewsHeadline(news)} — SpO₂ ${v.spo2}%, Temp ${v.temp}°C, HR ${v.hr}, RR ${v.rr}. ${news.escalation} Dr. Lee tele-review within 30 min.`,
  };
}

export function formatP7InfectionAlertDetail(): string {
  const v = P7_NEWS_ESCALATION_VITALS;
  const news = calculateNews(v, 'COPD');
  return `${formatNewsHeadline(news)} — SpO₂ ${v.spo2}%, Temp ${v.temp}°C, HR ${v.hr}, RR ${v.rr}. POCT CRP 68, PCT 0.8. HaH escalation protocol activated. ${news.monitoringLabel}.`;
}

function newsContributorLabel(score: number): string {
  if (score >= 3) return 'major NEWS contributor';
  if (score >= 2) return 'NEWS contributor';
  if (score >= 1) return 'minor NEWS contributor';
  return 'within NEWS target';
}

export function buildVitalParameterAssessment(
  param: VitalParamKey,
  vitals: Vitals,
  diagnosis: string,
  baseline?: Vitals,
): string {
  const news = calculateNews(vitals, diagnosis);
  const base = baseline ?? ALL_DEFAULT_VITALS[7];
  const copd = isCopdDiagnosis(diagnosis);
  const mon = news.monitoringLabel;

  switch (param) {
    case 'rr': {
      const score = news.breakdown.respiration;
      if (score >= 2) {
        const delta = base ? vitals.rr - base.rr : 0;
        const deltaText = delta > 0 ? `(↑${delta} from baseline)` : '';
        return `RR ${vitals.rr}/min — tachypnoeic ${deltaText}. ${newsContributorLabel(score)}. ${mon}.`;
      }
      return `RR ${vitals.rr}/min — ${copd ? 'COPD baseline' : 'stable'}. Stable respiratory pattern at rest.`;
    }
    case 'hr': {
      const score = news.breakdown.pulse;
      if (score >= 2) {
        const delta = base ? vitals.hr - base.hr : 0;
        return `HR ${vitals.hr} bpm — tachycardic${delta > 0 ? `(↑${delta} from baseline)` : ''}. Infection-driven sympathetic activation. ${newsContributorLabel(score)}. ${mon}.`;
      }
      return `HR ${vitals.hr} bpm sinus rhythm. On Amlodipine 5mg QD. ${copd ? 'Mild tachycardia — COPD baseline.' : ''} No arrhythmia. Continue current therapy.`;
    }
    case 'bpSystolic': {
      const score = news.breakdown.systolicBp;
      if (score >= 2) {
        return `SBP ${vitals.bpSystolic} mmHg — elevated, sympathetic surge consistent with acute infection. ${newsContributorLabel(score)}. ${mon}.`;
      }
      return `SBP ${vitals.bpSystolic} mmHg — borderline per ESC 2021 HTN. Amlodipine 5mg QD.`;
    }
    case 'bpDiastolic':
      return `DBP ${vitals.bpDiastolic} mmHg — ${news.breakdown.systolicBp >= 2 ? 'mildly elevated. Display-only for NEWS scoring.' : 'within acceptable range. Not scored in NEWS2.'} ${news.breakdown.systolicBp >= 2 ? mon + '.' : ''}`.trim();
    case 'spo2': {
      const score = news.breakdown.spo2 + news.breakdown.supplementalO2;
      const scaleNote = vitals.onSupplementalO2 ? `Scale ${vitals.spo2Scale} + O₂` : 'room air';
      if (score >= 2) {
        const delta = base ? vitals.spo2 - base.spo2 : 0;
        return `⚠ SpO₂ ${vitals.spo2}% (${scaleNote}) — hypoxaemia${delta < 0 ? ` (↓${Math.abs(delta)}% from baseline)` : ''}. ${copd ? 'GOLD 2024: COPD G2 critical threshold.' : ''} O₂ titration active. ${newsContributorLabel(score)}. ${mon}.`;
      }
      return `SpO₂ ${vitals.spo2}% — ${copd ? 'GOLD 2024: expected baseline for COPD GOLD 2 (FEV₁ 55%). O₂ concentrator on standby.' : 'within target range.'} No desaturation at rest.`;
    }
    case 'bloodSugar':
      if (vitals.bloodSugar < 80 || vitals.bloodSugar > 180) {
        return `Glucose ${vitals.bloodSugar} mg/dL — out of target. Alert-only (not in NEWS score). Notify HaH team if <70 or >250.`;
      }
      return `Glucose ${vitals.bloodSugar} mg/dL — within range. Monitored separately from NEWS scoring.`;
    case 'temp': {
      const score = news.breakdown.temperature;
      if (score >= 2) {
        const delta = base ? (vitals.temp - base.temp).toFixed(1) : '0';
        return `⚠ Temp ${vitals.temp}°C — febrile (↑${delta}°C). ${newsContributorLabel(score)}. Consistent with bacterial infection. IDSA CAP: repeat septic workup, blood cultures, CRP, PCT. ${mon}.`;
      }
      return `Temp ${vitals.temp}°C — upper normal range. CAP resolving per IDSA guidelines. Continue to monitor for fever spike (>38°C).`;
    }
    default:
      return '';
  }
}

export function buildOverallNewsAssessment(vitals: Vitals, diagnosis: string): string {
  const news = calculateNews(vitals, diagnosis);
  const line = formatSevenVitalLine(vitals);
  if (news.tier === 'high' || news.redScore) {
    return `⚠ ${formatNewsHeadline(news)}: ${line}. Pattern consistent with acute deterioration. ${news.escalation} ${news.monitoringLabel}.`;
  }
  return `${formatNewsHeadline(news)} — ${line}. ${news.monitoringLabel}. ${news.escalation}`;
}

export function buildP7ClinicalRecommendations(news: NewsAssessment): string[] {
  return [
    '1. Nurse Call — Immediate bedside assessment by 汤菊玲（照护师）',
    '2. POCT CRP/PCT — Rule out bacterial infection vs viral',
    '3. Doctor Review — 姜珊（护士经理） within 30 minutes',
    '4. Blood Cultures ×2 + Sputum C&S — Send to PWH lab',
    '5. O₂ 2L/min via concentrator — Titrate to SpO₂ ≥92%',
    `6. ${news.monitoringLabel} — document all scored parameters`,
  ];
}

export function buildFamilyInfectionFactor(p7Alert: boolean, vitals: Vitals, diagnosis: string): string {
  if (!p7Alert) {
    return `CAP Day 1 — IV Ceftriaxone scheduled from Day 2 per C&S. Afebrile baseline. SpO₂ ${vitals.spo2}% on room air.`;
  }
  const news = calculateNews(vitals, diagnosis);
  return `Temp ${vitals.temp}°C, CRP 68, PCT 0.8 — active infection per IDSA guidelines. ${formatNewsHeadline(news)} — ${news.escalation} Blood cultures pending.`;
}

export interface P7HubBannerContent {
  title: string;
  subtitle: string;
  headline: string;
  detail: string;
  vitals: { value: string; label: string; sub: string }[];
}

export function buildP7HubBannerContent(vitals: Vitals, diagnosis = 'COPD'): P7HubBannerContent {
  const news = calculateNews(vitals, diagnosis);
  return {
    title: `${formatNewsHeadline(news)} Escalation`,
    subtitle: `冯存富 · Score ${news.score}`,
    headline: `${formatNewsHeadline(news)} — ${news.escalation}`,
    detail: `Scale ${vitals.spo2Scale} SpO₂ ${vitals.spo2}%${vitals.onSupplementalO2 ? ' + O₂ on' : ''} · RR ${vitals.rr} · Temp ${vitals.temp}°C · HR ${vitals.hr} · ${news.monitoringLabel}`,
    vitals: [
      { value: String(vitals.rr), label: 'RR', sub: vitals.rr > 24 ? 'Tachy' : 'Normal' },
      { value: `${vitals.spo2}%`, label: 'SpO₂', sub: `Scale ${vitals.spo2Scale}` },
      { value: `${vitals.temp.toFixed(1)}°`, label: 'Temp', sub: vitals.temp >= 38 ? 'Fever' : 'Normal' },
      { value: String(vitals.hr), label: 'HR', sub: vitals.hr > 90 ? 'Tachy' : 'Normal' },
    ],
  };
}

export interface EliteVoiceBundle {
  phrases: string[];
  fields: Record<string, string>;
}

export function buildP7EliteVoiceBundle(alertActive: boolean): EliteVoiceBundle {
  const v = alertActive ? P7_NEWS_ESCALATION_VITALS : ALL_DEFAULT_VITALS[7];
  const news = calculateNews(v, 'COPD');
  const headline = formatNewsHeadline(news);
  const vitalsPhrase = `SpO₂ ${v.spo2}%${v.onSupplementalO2 ? ' on O₂ Scale ' + v.spo2Scale : ' RA'}, Temp ${v.temp}°C, HR ${v.hr}, BP ${v.bpSystolic}/${v.bpDiastolic}, RR ${v.rr}. `;

  if (alertActive) {
    return {
      phrases: [
        'Patient 冯存富, 82-year-old male, COPD GOLD 2 plus CAP. ',
        `${headline}. ${vitalsPhrase}`,
        'AMTS 7 out of 10 — intermittent confusion. Sputum green, increased volume. ',
        'POCT CRP 68, PCT 0.8 — confirms bacterial infection. ',
        'O₂ 2 litres per minute initiated via concentrator. ',
        'IV Ceftriaxone 2g started. Blood cultures sent. ',
        '王小凤 at bedside, calm and monitoring. ',
        `Urgent escalation per 姜珊（护士经理）. ${news.monitoringLabel}. End of report.`,
      ],
      fields: {
        condition: `${headline}. SpO₂ ${v.spo2}%${v.onSupplementalO2 ? ' on O₂' : ' RA'}, Temp ${v.temp}°C, RR ${v.rr}, HR ${v.hr}, BP ${v.bpSystolic}/${v.bpDiastolic}. Green sputum, increased volume. Crackles RLL. AMTS 7/10.`,
        meds: 'IV Ceftriaxone 2g started + Doxycycline 100mg PO BID. O₂ 2L/min via concentrator. Tiotropium + Salbutamol PRN continued. Amlodipine 5mg QD.',
        response: `Urgent assessment completed. POCT: CRP 68, PCT 0.8. O₂ 2L/min started. IV antibiotics initiated. Dr. Lee notified — review within 30 min. ${news.escalation}`,
        mental: `AMTS 7/10 — intermittent confusion likely hypoxic delirium. Mood anxious. Wife at bedside, trained on confusion assessment. ${news.monitoringLabel}.`,
        io: 'Intake reduced ~900mL. Output ~600mL. Encourage hydration. Net balance concerning in febrile state.',
        diet: 'Reduced appetite. Light congee offered. Encourage small frequent meals when afebrile.',
        incidents: `${headline} triggered. Infection Watch protocol activated. No falls. POCT kit deployed. Escalation to 姜珊（护士经理）. ${news.monitoringLabel}.`,
      },
    };
  }

  return {
    phrases: [
      'Patient 冯存富, 82-year-old male, COPD GOLD 2 plus CAP — HaH Day 1. ',
      `${headline}. Vitals: ${vitalsPhrase}`,
      'AMTS 10 out of 10. Initial respiratory assessment completed. ',
      'Baseline meds confirmed: Tiotropium + Amlodipine. O₂ concentrator tested on standby. ',
      '王小凤 trained on SpO₂ and escalation protocol. ',
      'Grab bars installation verified. ',
      `HaH Day 1 intake complete. ${news.monitoringLabel}. `,
      'No acute events. Continue current plan. End of report.',
    ],
    fields: {
      condition: `HaH Day 1 — ${headline}. SpO₂ ${v.spo2}% RA, Temp ${v.temp}°C, RR ${v.rr}, HR ${v.hr}, BP ${v.bpSystolic}/${v.bpDiastolic}. Breath sounds: coarse rhonchi RLL. Baseline assessment completed.`,
      meds: 'Tiotropium 18mcg QD + Amlodipine 5mg QD confirmed. CAP IV protocol from Day 2 per plan.',
      response: `Initial RN visit. Vitals stable. Family trained on monitoring + COPD action plan. O₂ concentrator checked — on standby. ${news.monitoringLabel}.`,
      mental: 'AMTS 10/10. Alert and oriented ×3. Mood calm. Wife demonstrated SpO₂ monitoring.',
      io: 'Intake ~1,200mL. Output ~900mL. Hydration encouraged.',
      diet: 'Regular diet tolerated. Breakfast: congee with vegetables.',
      incidents: 'No acute events. No falls. Day 1 intake criteria met. Family self-monitoring compliant.',
    },
  };
}
