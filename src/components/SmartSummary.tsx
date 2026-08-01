import { useState, type FC, useMemo } from 'react';
import {
  Heart, BedDouble,
  GlassWater, Brain, ClipboardList, Pill, Smartphone, PhoneCall,
  AlertTriangle,
} from 'lucide-react';
import type { PatientFull } from '../data/patients';
import { DEFAULT_VITALS, usePatientStore } from '../store/patientStore';
import { generateBillingSummary } from '../utils/hubBillingSummary';
import { TIER_LABEL, normalizeVitals, calculateNews, formatNewsTierLabel, PATIENT1_ESCALATION_VITALS } from '../utils/newsScore';
import { resolvePatientNews, type ResolvedPatientNews } from '../utils/patientNews';
import { formatSevenVitalLine } from '../utils/medicalHistoryNews';
import type { Vitals } from '../store/patientStore';

interface InterventionItem {
  id: string;
  who: string;
  action: string;
  deadline: string;
}

function deriveInterventions(patient: PatientFull): InterventionItem[] {
  const items: InterventionItem[] = [];
  const assigned = patient.carePlan;

  const nurseName = assigned.assignedNurse?.split(' (')[0] || '主管护士';
  const cmName = assigned.assignedCaseManager?.split(' (')[0] || '个案经理';
  const careWorker = assigned.assignedCareWorker || '护理员';
  const nutritionist = assigned.assignedNutritionist || '营养师';

  // ── 沈国栋专项干预 ──
  // 血压管理：基线160/82，目标<150/90
  items.push({
    id: `bp-${patient.id}`,
    who: nurseName,
    action: '血压监测每次访视必查 — 基线160/82，目标＜150/90 mmHg。连续2次≥160/100需通知家属就医',
    deadline: '每次访视',
  });

  // 压疮防控：Braden 16，已有压疮
  items.push({
    id: `wound-${patient.id}`,
    who: careWorker,
    action: '翻身q2h严格执行 + 减压气垫床持续使用 + 压疮部位皮肤观察记录',
    deadline: '每日',
  });

  // 跌倒防控：Morse 105极高危
  items.push({
    id: `fall-${patient.id}`,
    who: cmName,
    action: '助行器适配检查 + 居家安全巡查（地面防滑、夜间照明、无障碍通道）— Morse 105极高危',
    deadline: '每周',
  });

  // 用药依从性
  items.push({
    id: `med-${patient.id}`,
    who: nurseName,
    action: '硝苯地平30mg每日一次服药依从性核查 — 不规则服药史，需加强用药监督',
    deadline: '每次访视',
  });

  // 营养
  items.push({
    id: `nutrition-${patient.id}`,
    who: nutritionist,
    action: '营养评估 + 蛋白补充方案 + 低盐低脂饮食指导 — 压疮愈合需充足营养支持',
    deadline: '每周',
  });

  // IoT 设备检查
  const offline = patient.iotDevices.filter(d => d.status === 'Disconnected');
  const lowBattery = patient.iotDevices.filter(d => d.battery < 25 && d.status !== 'Disconnected');
  if (offline.length > 0 || lowBattery.length > 0) {
    items.push({
      id: `device-${patient.id}`,
      who: cmName,
      action: `处理 ${offline.length + lowBattery.length} 台IoT设备问题 — ${offline.length} 台离线，${lowBattery.length} 台电量低`,
      deadline: '24小时内',
    });
  }

  return items;
}

function formatSevenVitalLineFromPartial(vitals: Partial<Vitals>, diagnosis: string): string {
  return formatSevenVitalLine(normalizeVitals(vitals, diagnosis));
}

function generateVitalSummary(
  patient: PatientFull,
  alertActive = false,
  vitals?: Partial<Vitals>,
  news?: Pick<ResolvedPatientNews, 'score' | 'tier' | 'label' | 'monitoringLabel' | 'escalation' | 'redScore'>,
): string {
  if (vitals && news) {
    const line = formatSevenVitalLineFromPartial(vitals, patient.diagnosis);
    if (news.tier === 'high') {
      return `⚠ ${line}。${news.escalation} ${news.monitoringLabel}。血糖单独监测，不计入NEWS评分。`;
    }
    const redNote = news.redScore ? ' RED评分 — 需紧急临床复核。' : '';
    return `${line}。NEWS ${news.score} 分 — ${news.label}。${redNote}${news.monitoringLabel}。血糖单独监测预警。`;
  }

  const fallbackVitals =
    patient.id === 1 && alertActive ? PATIENT1_ESCALATION_VITALS : DEFAULT_VITALS[patient.id];
  if (fallbackVitals) {
    const computed = calculateNews(fallbackVitals, patient.diagnosis);
    return generateVitalSummary(patient, alertActive, fallbackVitals, {
      score: computed.score,
      tier: computed.tier,
      label: formatNewsTierLabel(computed),
      monitoringLabel: computed.monitoringLabel,
      escalation: computed.escalation,
      redScore: computed.redScore,
    });
  }

  // 沈国栋真实体征基线
  if (patient.id === 1) return 'BP 160/82 mmHg — 高于目标＜150/90，硝苯地平30mg qd方案下血压控制不充分。HR 78 bpm规律，SpO₂ 96%正常，体温36.7°C，呼吸17次/分。需优化降压方案并加强服药依从性监督。';
  // 周志强体征基线(脑出血术后偏瘫)
  if (patient.id === 10001) return 'BP 145/88 mmHg — 脑出血术后，降压方案待心内科确认。HR 72 bpm规律，SpO₂ 97%正常，体温36.5°C，呼吸18次/分。右侧偏瘫卧床，需注意体位性低血压风险。右下肢DVT(Caprini 7分)需持续观察。';
  return '生命体征数据待录入。';
}

function generateSleepSummary(patient: PatientFull, alertActive = false): string {
  // 沈国栋真实睡眠
  if (patient.id === 1 && alertActive) return '睡眠受扰 — 约5.2小时，因压疮不适及翻身中断2-3次。建议评估减压气垫床压力设置及睡前皮肤护理方案。';
  if (patient.id === 1) return '睡眠约6.5小时，基本连续。减压气垫床辅助下压疮部位不适减轻。配偶陈玉兰同室照护，夜间有异常可及时发现。睡眠质量尚可。';
  if (patient.id === 10001) return '睡眠约7小时，q2h翻身中断2-3次。减压气垫床辅助下无明显压疮不适。儿子周明辉同住，夜间有异常可及时发现。睡眠质量可，翻身中断影响轻微。';
  return '睡眠时长与质量在正常范围内。未见明显异常。';
}

function generateIntakeOutputSummary(patient: PatientFull, alertActive = false): string {
  // 沈国栋出入量
  if (patient.id === 1 && alertActive) return '经口摄入减少至约1,000mL（↓25%）。尿量约800mL。发热状态下出入量需密切监测。鼓励口服补液，必要时联系社区护士评估。';
  if (patient.id === 1) return '经口摄入约1,300mL/日。尿量约1,100mL。出入量基本平衡。食欲可，配偶协助备餐，低盐低脂饮食依从性良好。';
  if (patient.id === 10001) return '经口摄入约1,200mL/日。尿量约1,000mL（二便失禁，使用尿垫/纸尿裤）。出入量基本平衡。儿子周明辉协助进食，低盐低脂饮食。大便失禁需护理员按时更换护理。';
  return '出入量在正常范围。经口摄入充足，尿量与摄入匹配。未见脱水或液体负荷过重迹象。';
}

function generateMentalStatusSummary(patient: PatientFull, alertActive = false): string {
  // 沈国栋精神状态
  if (patient.id === 1 && alertActive) return '意识清楚但出现短暂焦虑 — 可能与血压波动或压疮疼痛有关。疼痛评分3/10。配偶陈玉兰在旁陪护，情绪已安抚。持续观察。';
  if (patient.id === 1) return '意识清醒，定向力完整×3。精神状态稳定，与基线一致。半自理状态，日常决策需配偶协助。无认知功能减退征象。';
  if (patient.id === 10001) return '意识清醒，对答切题，定向力完整。脑出血术后无认知功能减退征象。情绪平稳，配合照护。右侧偏瘫卧床，日常决策需儿子周明辉协助。Caprini 7分血栓风险需持续心理疏导。';
  return '意识清醒，定向力完整×3。情绪平稳，配合照护。疼痛控制良好。与基线一致。';
}

function generateCarePlanExecutionSummary(patient: PatientFull): string {
  // 沈国栋照护计划 — 每周4次上门（隔日），60-90分钟/次
  const d = patient.diagnosis;
  if (patient.id === 1) return '每周上门4次（隔日一次），每次60-90分钟。8月份排程含16次服务，覆盖翻身护理、压疮评估、血压监测、营养筛查、康复训练及居家安全巡查。服务团队5人协同（护士姜珊/个案经理林晓东/护理员汤菊玲/康复师周明/营养师陈雅文）。8月16日当日5项任务中4项已完成，营养风险筛查因营养师迟到45分钟标记为异常。整体照护执行率良好。';
  if (patient.id === 10001) return '每月上门20次，每次30-90分钟（依服务项目）。覆盖20项生活照护（翻身拍背/口腔护理/面部清洁/会阴护理/压疮预防/生命体征监测等）+ 被动ROM康复 + 营养支持 + 家属培训。服务团队5人协同（护士刘敏/个案经理张丽华/护理员王秀英/康复师陈军/营养师赵静）。3月27日初评后启动服务，家属周明辉已培训翻身和ROM操作。整体照护执行率良好。';
  return '照护计划执行中。服务频率与安排符合临床要求。';
}

function generateMedicationSummary(patient: PatientFull): string {
  const activeMeds = patient.medications.filter(m => m.status === 'Active');
  const count = activeMeds.length;
  // 沈国栋用药
  if (patient.id === 1) return `${count}种药物：硝苯地平30mg每日一次（CCB — 高血压控制）。不规则服药史，需持续用药依从性监督。血压基线160/82，目标＜150/90 mmHg，当前控制不充分，需考虑剂量优化或联合用药（血管紧张素受体阻滞剂）。低盐低脂饮食辅助管理。药物库存充足（30天量），下次复诊2026年8月底。`;
  if (patient.id === 10001) return `${count}种药物：降压药（具体方案待心内科确认）。脑出血术后，血压管理方案需心内科专科随访后制定。目前每日一次口服降压药，方案可能包括CCB/ACEI/ARB单药或联合。注意右下肢DVT — 抗凝方案需根据Caprini 7分高危评估，避免挤压右下肢。家属周明辉负责用药监督。`;
  return `${count}种药物：当前用药方案待完善。`;
}

function generateIoTDeviceSummary(patient: PatientFull): string {
  const devices = patient.iotDevices;
  const total = devices.length;
  const online = devices.filter(d => d.status === 'Connected');

  // 沈国栋3台设备
  const names = devices.map(d => d.type).join('、');
  const details = devices.map(d => {
    const bat = d.battery != null ? `电量${d.battery}%` : '';
    const sync = d.lastSync || '';
    return `${d.type}（${d.model}，${bat}${bat && sync ? '，' : ''}${sync}同步）`;
  }).join('；');

  if (online.length === total) {
    return `全部${total}台IoT设备在线：${details}。数据传输正常，满足监测要求。`;
  }
  return `${total}台IoT设备（${names}），${online.length}台在线，${total - online.length}台离线。需排查离线设备。`;
}

function generateBillingSummaryForPatient(patient: PatientFull, alertActive: boolean): string {
  // 返回中文账单摘要
  const raw = generateBillingSummary(patient, alertActive);
  // 中文化常用术语
  return raw
    .replace(/Total due/gi, '应付总额')
    .replace(/This Month/gi, '本月')
    .replace(/Last Month/gi, '上月')
    .replace(/Paid/gi, '已付')
    .replace(/Pending/gi, '待付')
    .replace(/Overdue/gi, '逾期')
    .replace(/Invoice/gi, '账单')
    .replace(/Service Fee/gi, '服务费')
    .replace(/Insurance/gi, '长护险')
    .replace(/Out of Pocket/gi, '个人自付');
}

const ST: FC<{ title: string; icon: FC<{ className?: string }> }> = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-4"><Icon className="w-5 h-5 text-teal-600"/><h2 className="text-base font-bold text-slate-800">{title}</h2></div>
);

const SmartSummary: FC<{ patient: PatientFull }> = ({ patient }) => {
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const toggleItem = (id: string) => setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  const alertActive = usePatientStore(s => s.alertActive);
  const patientsSummary = usePatientStore(s => s.patientsSummary);
  const storeVitals = usePatientStore(s => s.vitals[patient.id] ?? DEFAULT_VITALS[patient.id]);
  const summary = patientsSummary.find(p => p.id === patient.id);
  const news = resolvePatientNews(
    patient.id,
    patient.diagnosis,
    storeVitals,
    summary,
    alertActive && patient.id === 1,
  );
  const effectivePatient = alertActive && patient.id === 1 ? { ...patient, riskLevel: 'Critical' as const } : patient;
  const interventions = useMemo(() => deriveInterventions(effectivePatient), [effectivePatient]);
  const isCritical = news.tier === 'high';
  const p7 = patient.id === 1 && alertActive;
  const vitalSummaryText = useMemo(
    () => generateVitalSummary(effectivePatient, p7, storeVitals, news),
    [effectivePatient, p7, storeVitals, news],
  );

  const alertBorder = isCritical ? 'border-red-300' : 'border-amber-200';
  const alertBg = isCritical ? 'bg-red-50' : 'bg-amber-50';

  const summaryCards = [
    { icon: AlertTriangle, title: '升级干预事项',
      color: isCritical ? 'text-red-500' : 'text-amber-500',
      render: () => (
        <div>
          <p className="text-[10px] text-slate-500 mb-3">
            AI已识别 {interventions.length} 项需要注意的事项，基于{effectivePatient.name}的当前临床状态（NEWS {news.score} 分 — {news.label}。{news.monitoringLabel}）。
          </p>
          <div className="space-y-2">
            {interventions.map(item => (
              <label key={item.id} className="flex items-start gap-2.5 p-2.5 bg-white rounded-lg border border-slate-200 hover:border-teal-300 cursor-pointer transition-colors">
                <input type="checkbox" checked={!!checklist[item.id]} onChange={() => toggleItem(item.id)}
                  className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                <span className="text-[11px] text-slate-700 leading-relaxed">
                  <span className="font-semibold text-teal-700">{item.who}</span> — {item.action} <span className="text-amber-600 font-medium">（{item.deadline}）</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      ),
    },
    { icon: Heart, title: '生命体征（6项参数）', color: 'text-red-500',
      render: () => <p className="text-[11px] text-slate-700 leading-relaxed">{vitalSummaryText}</p>,
    },
    { icon: BedDouble, title: '睡眠', color: 'text-indigo-500',
      render: () => <p className="text-[11px] text-slate-700 leading-relaxed">{generateSleepSummary(effectivePatient, p7)}</p>,
    },
    { icon: GlassWater, title: '出入量', color: 'text-cyan-500',
      render: () => <p className="text-[11px] text-slate-700 leading-relaxed">{generateIntakeOutputSummary(effectivePatient, p7)}</p>,
    },
    { icon: Brain, title: '精神状态', color: 'text-purple-500',
      render: () => <p className="text-[11px] text-slate-700 leading-relaxed">{generateMentalStatusSummary(effectivePatient, p7)}</p>,
    },
    { icon: ClipboardList, title: '照护计划执行', color: 'text-emerald-500',
      render: () => <p className="text-[11px] text-slate-700 leading-relaxed">{generateCarePlanExecutionSummary(effectivePatient)}</p>,
    },
    { icon: Pill, title: '用药执行', color: 'text-purple-500',
      render: () => <p className="text-[11px] text-slate-700 leading-relaxed">{generateMedicationSummary(patient)}</p>,
    },
    { icon: Smartphone, title: 'IoT设备', color: 'text-purple-500',
      render: () => <p className="text-[11px] text-slate-700 leading-relaxed">{generateIoTDeviceSummary(patient)}</p>,
    },
    { icon: PhoneCall, title: '账单概览', color: 'text-teal-500',
      render: () => <p className="text-[11px] text-slate-700 leading-relaxed">{generateBillingSummaryForPatient(patient, alertActive)}</p>,
    },
  ];

  return (
    <div>
      <div className="sticky top-0 z-10 bg-warm-50 -mx-6 px-6 pt-6 pb-3">
        <ST title="智能摘要" icon={Brain} />
        <p className="text-[10px] text-slate-400 mt-0.5">
          基于 {patient.nursingRecords.length} 条护理记录、{patient.iotDevices.length} 台IoT设备数据流和 {patient.medications.filter(m => m.status === 'Active').length} 种在用药物，AI综合分析生成
        </p>
      </div>
      <div className="space-y-3 px-6 pb-6">
        {summaryCards.map((card, idx) => (
          <div key={idx} className={`glass-card rounded-xl border border-slate-200 p-4 ${idx === 0 ? `border-2 ${alertBorder} ${alertBg}` : ''}`}>
            <div className="flex items-center gap-2 mb-2.5">
              <card.icon className={`w-4 h-4 ${card.color}`} />
              <h3 className="text-xs font-bold text-slate-700">{card.title}</h3>
              {idx === 0 && isCritical && (
                <span className="text-[9px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">需处理</span>
              )}
            </div>
            {card.render()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartSummary;
