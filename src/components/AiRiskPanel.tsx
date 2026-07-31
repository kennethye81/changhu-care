import { type FC, useState } from 'react';
import { Brain, AlertTriangle, ChevronRight, X } from 'lucide-react';
import { usePatientStore, type Vitals } from '../store/patientStore';
import { calculateNews, TIER_LABEL, type NewsTier } from '../utils/newsScore';

interface RiskResult {
  score: number;
  tier: NewsTier;
  label: string;
  color: string;
  factors: string[];
  recommendation: string;
  monitoringLabel: string;
  redScore: boolean;
}

function tierColor(tier: NewsTier): string {
  if (tier === 'high') return 'text-red-600';
  if (tier === 'medium') return 'text-amber-600';
  return 'text-emerald-600';
}

function assessNewsRisk(v: Vitals, diagnosis: string): RiskResult {
  const news = calculateNews(v, diagnosis);
  const b = news.breakdown;
  const factors: string[] = [];

  if (b.respiration > 0) factors.push(`RR ${v.rr}/min — NEWS respiration +${b.respiration}`);
  if (b.spo2 > 0 || b.supplementalO2 > 0) {
    factors.push(`SpO₂ ${v.spo2}%${v.onSupplementalO2 ? ' on O₂' : ''} (Scale ${v.spo2Scale}) — NEWS +${b.spo2 + b.supplementalO2}`);
  }
  if (b.systolicBp > 0) factors.push(`SBP ${v.bpSystolic} mmHg — NEWS +${b.systolicBp}`);
  if (b.pulse > 0) factors.push(`Pulse ${v.hr} bpm — NEWS +${b.pulse}`);
  if (b.temperature > 0) factors.push(`Temp ${v.temp}°C — NEWS +${b.temperature}`);
  if (b.consciousness > 0) factors.push(`AVPU ${v.avpu} — NEWS +${b.consciousness}`);
  if (news.glucoseMessage) factors.push(`${news.glucoseMessage} (alert-only — not in NEWS score)`);

  if (factors.length === 0) {
    return {
      score: news.score,
      tier: news.tier,
      label: `NEWS ${news.score} — ${TIER_LABEL[news.tier]}`,
      color: 'text-emerald-600',
      factors: ['All NEWS2 parameters within Low tier (0–4)'],
      recommendation: news.escalation,
      monitoringLabel: news.monitoringLabel,
      redScore: news.redScore,
    };
  }

  return {
    score: news.score,
    tier: news.tier,
    label: news.redScore ? `NEWS ${news.score} — Low (RED score)` : `NEWS ${news.score} — ${TIER_LABEL[news.tier]}`,
    color: tierColor(news.tier),
    factors,
    recommendation: news.escalation,
    monitoringLabel: news.monitoringLabel,
    redScore: news.redScore,
  };
}

export const AiRiskPanel: FC<{ patientId: number; onClose?: () => void }> = ({ patientId, onClose }) => {
  const vitals = usePatientStore(s => s.vitals[patientId]);
  const patient = usePatientStore(s => s.patients.find(p => p.id === patientId));
  const [expanded, setExpanded] = useState(false);

  if (!vitals || !patient) return null;

  const result = assessNewsRisk(vitals, patient.diagnosis);
  const alertBg = result.tier === 'high' ? 'bg-red-50 border-red-200' :
    result.tier === 'medium' ? 'bg-amber-50 border-amber-200' :
    'bg-emerald-50 border-emerald-200';
  const iconColor = result.tier === 'high' ? 'text-red-500' :
    result.tier === 'medium' ? 'text-amber-500' :
    'text-emerald-500';

  return (
    <div className={`rounded-xl border ${alertBg} p-4 ${expanded ? '' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm ${iconColor}`}>
            {result.tier !== 'low' ? <AlertTriangle className="w-5 h-5" /> : <Brain className="w-5 h-5" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-sm font-extrabold ${result.color}`}>{result.label}</span>
              <span className="text-[10px] text-slate-400">NEWS2</span>
            </div>
            <p className="text-xs text-slate-600">{patient.name} · {patient.diagnosis}</p>
            <p className="text-[11px] text-slate-500 mt-1">{result.recommendation}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{result.monitoringLabel}{result.redScore ? ' · RED score' : ''}</p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-slate-400 hover:text-slate-600 p-1"
        >
          <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 ml-1">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-200/60">
          <p className="text-[10px] font-semibold text-slate-600 mb-2">NEWS2 Breakdown</p>
          <ul className="space-y-1">
            {result.factors.map((f, i) => (
              <li key={i} className="text-[10px] text-slate-600 flex items-start gap-1.5">
                <span className="text-slate-400 mt-0.5">•</span> {f}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AiRiskPanel;
