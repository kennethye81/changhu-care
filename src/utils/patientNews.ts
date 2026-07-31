import type { PatientSummary, Vitals } from '../store/patientStore';
import {
  calculateNews,
  formatNewsTierLabel,
  normalizeVitals,
  P7_NEWS_ESCALATION_VITALS,
  type NewsAssessment,
  type NewsTier,
} from './newsScore';

export type ResolvedPatientNews = Pick<
  NewsAssessment,
  'score' | 'tier' | 'redScore' | 'monitoringInterval' | 'monitoringLabel' | 'escalation'
> & {
  label: string;
};

export function resolvePatientNews(
  patientId: number,
  diagnosis: string,
  vitals: Vitals | undefined,
  summary?: PatientSummary | null,
  p7AlertActive = false,
): ResolvedPatientNews {
  if (summary?.id === patientId && !p7AlertActive) {
    return {
      score: summary.newsScore,
      tier: summary.newsTier,
      redScore: summary.newsRedScore ?? false,
      monitoringInterval: summary.newsMonitoringInterval ?? '4-6h',
      monitoringLabel: summary.newsMonitoringLabel ?? 'Minimum every 4–6 hours',
      escalation: summary.newsEscalation ?? '',
      label: summary.newsRedScore
        ? `Low (${summary.newsScore}) — RED score`
        : formatNewsTierLabel({ score: summary.newsScore, tier: summary.newsTier, redScore: false }),
    };
  }
  const v =
    patientId === 7 && p7AlertActive
      ? P7_NEWS_ESCALATION_VITALS
      : normalizeVitals(vitals ?? {}, diagnosis);
  const news = calculateNews(v, diagnosis);
  return {
    score: news.score,
    tier: news.tier,
    redScore: news.redScore,
    monitoringInterval: news.monitoringInterval,
    monitoringLabel: news.monitoringLabel,
    escalation: news.escalation,
    label: formatNewsTierLabel(news),
  };
}
