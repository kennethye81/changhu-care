import type { PatientSummary, Vitals } from '../store/patientStore';
import { TIER_LABEL, calculateNews, normalizeVitals, P7_NEWS_ESCALATION_VITALS } from './newsScore';
import { formatNewsHeadline } from './medicalHistoryNews';

export function buildPatientAiBrief(
  summary: PatientSummary,
  vitals: Vitals | undefined,
  p7AlertActive = false,
): { summary: string; recommendations: string[] } {
  const v =
    summary.id === 7 && p7AlertActive
      ? P7_NEWS_ESCALATION_VITALS
      : normalizeVitals(vitals ?? {}, summary.diagnosis);
  const news = calculateNews(v, summary.diagnosis);
  const tierLabel = TIER_LABEL[news.tier];

  if (summary.id === 7 && p7AlertActive) {
    return {
      summary: `🚨 ${formatNewsHeadline(news)} — ${summary.name}. SpO₂ ${v.spo2}% Scale 2 + O₂, Temp ${v.temp}°C, HR ${v.hr}, RR ${v.rr}/min, BP ${v.bpSystolic}/${v.bpDiastolic}. ${news.escalation} ${news.monitoringLabel}.`,
      recommendations: [
        'Urgent nurse assessment — POCT CRP/PCT on arrival',
        'Start O₂ 2L/min via concentrator — titrate to SpO₂ ≥92%',
        'IV Ceftriaxone 2g if not given — per C&S (H. influenzae sensitive)',
        'Blood cultures ×2 + sputum C&S',
        `Monitor AVPU/AMTS — ${news.monitoringLabel}`,
        'Dr. Lee Mei Ling tele-review within 30 min',
      ],
    };
  }

  const base = `NEWS ${news.score} — ${tierLabel}. RR ${v.rr}/min · HR ${v.hr} · BP ${v.bpSystolic}/${v.bpDiastolic} · SpO₂ ${v.spo2}% · Temp ${v.temp}°C · Glucose ${v.bloodSugar} mg/dL (alert-only). ${summary.diagnosis}.`;

  const recs: string[] = [];
  if (news.tier === 'high') {
    recs.push('Emergency response — urgent senior clinician or critical care assessment per NEWS2');
    recs.push(`Increase monitoring — ${news.monitoringLabel}`);
  } else if (news.tier === 'medium') {
    recs.push('Urgent review by registered nurse or doctor — increase observation frequency');
    recs.push(`Monitoring frequency — ${news.monitoringLabel}`);
  } else if (news.redScore) {
    recs.push('RED score — urgent clinician review despite low aggregate NEWS total');
    recs.push(`Monitoring frequency — ${news.monitoringLabel}`);
  } else {
    recs.push('Routine NEWS monitoring — continue standard HaH visit schedule');
    recs.push(`Monitoring frequency — ${news.monitoringLabel}`);
  }

  if (news.breakdown.spo2 > 0 || news.breakdown.supplementalO2 > 0) {
    recs.push(`SpO₂ monitoring — Scale ${v.spo2Scale}; report desaturation per COPD/CAP protocol`);
  }
  if (news.glucoseAlert) {
    recs.push(`${news.glucoseMessage} — glucose alert protocol (excluded from NEWS score)`);
  }
  if (summary.diagnosis.toLowerCase().includes('copd')) {
    recs.push('COPD action plan review — inhaler technique + O₂ safety');
  }
  if (summary.diagnosis.toLowerCase().includes('heart failure') || summary.diagnosis.toLowerCase().includes('hf')) {
    recs.push('Daily weight + fluid restriction — GDMT compliance check');
  }
  recs.push('Document all vitals on IoT devices — verify NEWS-capable sensors connected');

  return { summary: base, recommendations: recs.slice(0, 6) };
}
