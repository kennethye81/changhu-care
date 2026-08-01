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
  return `RR ${v.rr}次/分 · 脉搏 ${v.hr} bpm · BP ${v.bpSystolic}/${v.bpDiastolic} mmHg · SpO₂ ${v.spo2}%${v.onSupplementalO2 ? ' (量表' + v.spo2Scale + ' + 吸氧)' : ''} · 血糖 ${v.bloodSugar} mg/dL · 体温 ${v.temp}°C`;
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
    return `⚠ ${formatNewsHeadline(news)} — ${vitalsLine}。${news.escalation} ${news.monitoringLabel}。`;
  }
  if (news.redScore) {
    return `⚠ ${formatNewsHeadline(news)} — ${vitalsLine}。${news.escalation} ${news.monitoringLabel}。`;
  }
  if (patientId === 7) {
    return `居家照护第1天 — ${formatNewsHeadline(news)}。${vitalsLine}。${news.monitoringLabel}。家属已培训血氧监测和COPD行动计划。`;
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
  const newsPart = `${formatNewsHeadline(news)} — ${news.monitoringLabel}。${news.escalation}`;
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
  return `${formatNewsHeadline(news)} — RR ${vitals.rr}次/分, SpO₂ ${vitals.spo2}%${vitals.onSupplementalO2 ? ' (量表' + vitals.spo2Scale + ' + 吸氧)' : ''}, 体温 ${vitals.temp.toFixed(1)}°C, HR ${vitals.hr}。${news.escalation}`;
}

export function formatHubP7InboxPreview(): { subject: string; preview: string } {
  const v = P7_NEWS_ESCALATION_VITALS;
  const news = calculateNews(v, 'COPD');
  return {
    subject: `${formatNewsHeadline(news)} — 冯存富 SpO₂ 下降`,
    preview: `${formatNewsHeadline(news)} — SpO₂ ${v.spo2}%, 体温 ${v.temp}°C, HR ${v.hr}, RR ${v.rr}。${news.escalation} 姜珊30分钟内远程复评。`,
  };
}

export function formatP7InfectionAlertDetail(): string {
  const v = P7_NEWS_ESCALATION_VITALS;
  const news = calculateNews(v, 'COPD');
  return `${formatNewsHeadline(news)} — SpO₂ ${v.spo2}%，体温 ${v.temp}°C，HR ${v.hr}，RR ${v.rr}。POCT CRP 68，PCT 0.8。居家照护升级预案已启动。${news.monitoringLabel}。`;
}

function newsContributorLabel(score: number): string {
  if (score >= 3) return '主要NEWS贡献因子';
  if (score >= 2) return 'NEWS贡献因子';
  if (score >= 1) return '次要NEWS贡献因子';
  return 'NEWS目标范围内';
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
        return `RR ${vitals.rr}次/分 — 呼吸急促${deltaText}。${newsContributorLabel(score)}。${mon}。`;
      }
      return `RR ${vitals.rr}次/分 — ${copd ? 'COPD基础水平' : '稳定'}。静息呼吸模式平稳。`;
    }
    case 'hr': {
      const score = news.breakdown.pulse;
      if (score >= 2) {
        const delta = base ? vitals.hr - base.hr : 0;
        return `HR ${vitals.hr} bpm — 心动过速${delta > 0 ? `(较基线↑${delta})` : ''}。感染驱动交感神经激活。${newsContributorLabel(score)}。${mon}。`;
      }
      return `HR ${vitals.hr} bpm 窦性心律。氨氯地平5mg qd。${copd ? '轻度心动过速 — COPD基础水平。' : ''}无心律失常。继续当前治疗。`;
    }
    case 'bpSystolic': {
      const score = news.breakdown.systolicBp;
      if (score >= 2) {
        return `SBP ${vitals.bpSystolic} mmHg — 升高，交感神经激增，与急性感染一致。${newsContributorLabel(score)}。${mon}。`;
      }
      return `SBP ${vitals.bpSystolic} mmHg — 临界高血压（中国指南2024）。氨氯地平5mg qd。`;
    }
    case 'bpDiastolic':
      return `DBP ${vitals.bpDiastolic} mmHg — ${news.breakdown.systolicBp >= 2 ? '轻度升高。仅作NEWS评分参考显示。' : '在可接受范围内。未纳入NEWS2评分。'} ${news.breakdown.systolicBp >= 2 ? mon : ''}`.trim();
    case 'spo2': {
      const score = news.breakdown.spo2 + news.breakdown.supplementalO2;
      const scaleNote = vitals.onSupplementalO2 ? `量表${vitals.spo2Scale} + 吸氧` : '室内空气';
      if (score >= 2) {
        const delta = base ? vitals.spo2 - base.spo2 : 0;
        return `⚠ SpO₂ ${vitals.spo2}% (${scaleNote}) — 低氧血症${delta < 0 ? ` (较基线↓${Math.abs(delta)}%)` : ''}。${copd ? 'GOLD 2024: COPD G2关键阈值。' : ''}氧疗滴定进行中。${newsContributorLabel(score)}。${mon}。`;
      }
      return `SpO₂ ${vitals.spo2}% — ${copd ? 'GOLD 2024: COPD GOLD 2预期基线（FEV₁ 55%）。制氧机待命。' : '在目标范围内。'}静息无下降。`;
    }
    case 'bloodSugar':
      if (vitals.bloodSugar < 80 || vitals.bloodSugar > 180) {
        return `血糖 ${vitals.bloodSugar} mg/dL — 超出目标。仅预警（不计入NEWS评分）。如<70或>250通知照护团队。`;
      }
      return `血糖 ${vitals.bloodSugar} mg/dL — 在范围内。独立于NEWS评分监测。`;
    case 'temp': {
      const score = news.breakdown.temperature;
      if (score >= 2) {
        const delta = base ? (vitals.temp - base.temp).toFixed(1) : '0';
        return `⚠ 体温 ${vitals.temp}°C — 发热 (↑${delta}°C)。${newsContributorLabel(score)}。符合细菌感染表现。IDSA CAP指南：重复感染检查、血培养、CRP、PCT。${mon}。`;
      }
      return `体温 ${vitals.temp}°C — 正常值上限。CAP按IDSA指南缓解中。继续监测发热峰值(>38°C)。`;
    }
    default:
      return '';
  }
}

export function buildOverallNewsAssessment(vitals: Vitals, diagnosis: string): string {
  const news = calculateNews(vitals, diagnosis);
  const line = formatSevenVitalLine(vitals);
  if (news.tier === 'high' || news.redScore) {
    return `⚠ ${formatNewsHeadline(news)}：${line}。模式符合急性恶化。${news.escalation} ${news.monitoringLabel}。`;
  }
  return `${formatNewsHeadline(news)} — ${line}。${news.monitoringLabel}。${news.escalation}`;
}

export function buildP7ClinicalRecommendations(news: NewsAssessment): string[] {
  return [
    '1. 护士评估 — 汤菊玲（照护师）立即床旁评估',
    '2. POCT CRP/PCT — 排除细菌感染vs病毒感染',
    '3. 医生复评 — 姜珊（护士经理）30分钟内',
    '4. 血培养×2 + 痰培养+药敏 — 送检验科',
    '5. O₂ 2L/min经制氧机 — 滴定至SpO₂ ≥92%',
    `6. ${news.monitoringLabel} — 记录全部评分参数`,
  ];
}

export function buildFamilyInfectionFactor(p7Alert: boolean, vitals: Vitals, diagnosis: string): string {
  if (!p7Alert) {
    return `CAP第1天 — 头孢曲松按药敏计划第2天起。基础无发热。SpO₂ ${vitals.spo2}%（室内空气）。`;
  }
  const news = calculateNews(vitals, diagnosis);
  return `体温 ${vitals.temp}°C，CRP 68，PCT 0.8 — IDSA指南标准下活动性感染。${formatNewsHeadline(news)} — ${news.escalation} 血培养待回报。`;
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
    title: `${formatNewsHeadline(news)} 升级`,
    subtitle: `冯存富 · Score ${news.score}`,
    headline: `${formatNewsHeadline(news)} — ${news.escalation}`,
    detail: `量表${vitals.spo2Scale} SpO₂ ${vitals.spo2}%${vitals.onSupplementalO2 ? ' + 吸氧' : ''} · RR ${vitals.rr} · 体温 ${vitals.temp}°C · HR ${vitals.hr} · ${news.monitoringLabel}`,
    vitals: [
      { value: String(vitals.rr), label: 'RR', sub: vitals.rr > 24 ? '过速' : '正常' },
      { value: `${vitals.spo2}%`, label: 'SpO₂', sub: `量表${vitals.spo2Scale}` },
      { value: `${vitals.temp.toFixed(1)}°`, label: '体温', sub: vitals.temp >= 38 ? '发热' : '正常' },
      { value: String(vitals.hr), label: 'HR', sub: vitals.hr > 90 ? '过速' : '正常' },
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
  const vitalsPhrase = `SpO₂ ${v.spo2}%${v.onSupplementalO2 ? ' 吸氧 量表' + v.spo2Scale : ' 室内空气'}, 体温 ${v.temp}°C, HR ${v.hr}, BP ${v.bpSystolic}/${v.bpDiastolic}, RR ${v.rr}。`;

  if (alertActive) {
    return {
      phrases: [
        '患者冯存富，82岁男性，COPD GOLD 2级合并CAP。',
        `${headline}. ${vitalsPhrase}`,
        'AMTS 7/10 — 间歇性意识模糊。痰绿色，量增加。',
        'POCT CRP 68，PCT 0.8 — 确认细菌感染。',
        '已启动制氧机2升/分吸氧。',
        '已开始静注头孢曲松2g。血培养已送检。',
        '王小凤在床旁，情绪平稳并持续监测。',
        `紧急升级，执行人：姜珊（护士经理）。${news.monitoringLabel}。报告结束。`
      ],
      fields: {
        condition: `${headline}。SpO₂ ${v.spo2}%${v.onSupplementalO2 ? ' 吸氧' : ' 室内空气'}，体温 ${v.temp}°C，RR ${v.rr}，HR ${v.hr}，BP ${v.bpSystolic}/${v.bpDiastolic}。痰绿色，量增加。右肺底湿啰音。AMTS 7/10。`,
        meds: '静注头孢曲松2g已开始 + 多西环素100mg口服bid。O₂ 2L/min经制氧机。噻托溴铵 + 沙丁胺醇prn继续。氨氯地平5mg qd。',
        response: `紧急评估完成。POCT：CRP 68，PCT 0.8。O₂ 2L/min已开始。静注抗生素已启动。已通知姜珊 — 30分钟内复评。${news.escalation}`,
        mental: `AMTS 7/10 — 间歇性意识模糊，可能为缺氧性谵妄。情绪焦虑。妻子在床旁，已培训意识评估。${news.monitoringLabel}。`,
        io: '摄入减少约900mL。排出约600mL。鼓励补液。发热状态下出入量平衡需关注。',
        diet: '食欲减退。已提供稀粥。鼓励退热后少量多餐。',
        incidents: `${headline} 已触发。感染监测预案已启动。无跌倒。POCT试剂盒已部署。升级至姜珊（护士经理）。${news.monitoringLabel}。`,
      },
    };
  }

  return {
    phrases: [
      '患者冯存富，82岁男性，COPD GOLD 2级合并CAP — 居家照护第1天。',
      `${headline}. Vitals: ${vitalsPhrase}`,
      'AMTS 10/10。初始呼吸评估已完成。',
      '基线用药已确认：噻托溴铵 + 氨氯地平。制氧机待命测试通过。',
      '王小凤已完成血氧监测和升级预案培训。',
      '扶手安装已确认。',
      `居家照护第1天接收完成。${news.monitoringLabel}。`,
      '无急性事件。继续当前计划。报告结束。',
    ],
    fields: {
      condition: `居家照护第1天 — ${headline}。SpO₂ ${v.spo2}% 室内空气，体温 ${v.temp}°C，RR ${v.rr}，HR ${v.hr}，BP ${v.bpSystolic}/${v.bpDiastolic}。呼吸音：右下肺粗啰音。基线评估已完成。`,
      meds: '噻托溴铵18mcg qd + 氨氯地平5mg qd已确认。CAP静脉用药按计划第2天起。',
      response: `初始护士访视。生命体征稳定。家属已完成监测+COPD行动计划培训。制氧机已检查 — 待命。${news.monitoringLabel}。`,
      mental: 'AMTS 10/10。神志清醒定向力完整。情绪平稳。妻子已演示血氧监测操作。',
      io: '摄入约1,200mL。排出约900mL。鼓励饮水。',
      diet: '常规饮食耐受良好。早餐：蔬菜粥。',
      incidents: '无急性事件。无跌倒。第1天接收标准已满足。家庭自我监测依从。',
    },
  };
}
