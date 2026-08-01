import { useState, type FC, useMemo } from 'react';
import {
  Heart, BedDouble,
  GlassWater, Brain, ClipboardList, Pill, Smartphone, PhoneCall,
  AlertTriangle,
} from 'lucide-react';
import type { PatientFull } from '../data/patients';
import { DEFAULT_VITALS, usePatientStore } from '../store/patientStore';
import { generateBillingSummary } from '../utils/hubBillingSummary';
import { TIER_LABEL, normalizeVitals, calculateNews, formatNewsTierLabel, P7_NEWS_ESCALATION_VITALS } from '../utils/newsScore';
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

  const doctorName = assigned.assignedDoctor?.split(' (')[0] || 'Attending Physician';
  const nurseName = assigned.assignedNurse?.split(' (')[0] || 'Primary Nurse';
  const cmName = assigned.assignedCaseManager?.split(' (')[0] || 'Case Manager';

  // Check for escalated nursing records
  if (patient.riskLevel === 'Critical' || patient.riskLevel === 'High') {
    const recent = patient.nursingRecords.slice(-2);
    for (const rec of recent) {
      const note = rec.note.toLowerCase();
      if (note.includes('elevated') || note.includes('alert') || note.includes('notified') || note.includes('abnormal')) {
        items.push({ id: `escalate-${patient.id}-${rec.date}`, who: doctorName, action: '审阅升级护理记录并确认干预方案', deadline: '24小时内' });
        break;
      }
    }
  }

  // Risk-based interventions
  if (patient.riskLevel === 'Critical') {
    items.push({ id: `vitals-${patient.id}`, who: nurseName, action: '核实生命体征趋势 — 连续>2次异常则升级', deadline: '下次访视' });
    items.push({ id: `med-${patient.id}`, who: nurseName, action: '确认所有药物按时服用 — 检查漏服情况', deadline: '当日结束前' });
    items.push({ id: `family-${patient.id}`, who: cmName, action: '通知家属联系人任何偏离基线状态的情况', deadline: '4小时内' });
  } else if (patient.riskLevel === 'High') {
    items.push({ id: `vitals-${patient.id}`, who: nurseName, action: '密切监测生命体征趋势 — 及时报告异常', deadline: '每日' });
    items.push({ id: `followup-${patient.id}`, who: doctorName, action: '审阅近期检验结果并根据需要调整治疗方案', deadline: '48小时内' });
  } else {
    items.push({ id: `routine-${patient.id}`, who: nurseName, action: '按照护计划时间表继续常规监测', deadline: '按照护计划' });
  }

  // Device check if any offline or 电量低
  const offline = patient.iotDevices.filter(d => d.status === 'Disconnected');
  const lowBattery = patient.iotDevices.filter(d => d.battery < 25 && d.status !== 'Disconnected');
  if (offline.length > 0 || lowBattery.length > 0) {
    items.push({ id: `device-${patient.id}`, who: cmName, action: `处理 ${offline.length + lowBattery.length} IoT设备问题 — ${offline.length} 离线， ${lowBattery.length} 电量低`, deadline: '24小时内' });
  }

  // Medication stock check for critical meds
  const criticalMeds = patient.medications.filter(m => m.status === 'Active' && (
    m.purpose.toLowerCase().includes('antiplatelet') || m.purpose.toLowerCase().includes('anticoagulant') ||
    m.drug.toLowerCase().includes('apixaban') || m.drug.toLowerCase().includes('warfarin') ||
    m.drug.toLowerCase().includes('rivaroxaban') || m.purpose.toLowerCase().includes('chemotherapy')
  ));
  if (criticalMeds.length > 0) {
    items.push({ id: `stock-${patient.id}`, who: nurseName, action: `核实库存水平： ${criticalMeds.length} 关键药物`, deadline: '下次访视' });
  }

  return items;
}

function formatSevenVitalLineFromPartial(vitals: Partial<Vitals>, diagnosis: string): string {
  return formatSevenVitalLine(normalizeVitals(vitals, diagnosis));
}

function generateVitalSummary(
  patient: PatientFull,
  p7Alert = false,
  vitals?: Partial<Vitals>,
  news?: Pick<ResolvedPatientNews, 'score' | 'tier' | 'label' | 'monitoringLabel' | 'escalation' | 'redScore'>,
): string {
  if (vitals && news) {
    const line = formatSevenVitalLineFromPartial(vitals, patient.diagnosis);
    if (news.tier === 'high') {
      return `⚠ ${line}. ${news.escalation} ${news.monitoringLabel}. Glucose alert-only (not in NEWS score).`;
    }
    const redNote = news.redScore ? ' RED score — urgent clinician review.' : '';
    return `${line}. NEWS ${news.score} — ${news.label}.${redNote} ${news.monitoringLabel}. Glucose monitored separately for out-of-range alerts.`;
  }

  const fallbackVitals =
    patient.id === 7 && p7Alert ? P7_NEWS_ESCALATION_VITALS : DEFAULT_VITALS[patient.id];
  if (fallbackVitals) {
    const computed = calculateNews(fallbackVitals, patient.diagnosis);
    return generateVitalSummary(patient, p7Alert, fallbackVitals, {
      score: computed.score,
      tier: computed.tier,
      label: formatNewsTierLabel(computed),
      monitoringLabel: computed.monitoringLabel,
      escalation: computed.escalation,
      redScore: computed.redScore,
    });
  }

  const d = patient.diagnosis;

  if (d.includes('Heart Failure NYHA III')) {
    if (patient.id === 1) return 'Weight 68.0kg stable. BP 118/72, HR 82 in AF (rate-controlled on Bisoprolol 5mg), SpO₂ 95% on room air. Pedal oedema trace. I/O net -270mL with Furosemide 40mg BID. BNP 850 trending down. GDMT compliance 94%. Renal panel stable (Cr 138, K⁺ 3.9). Continue daily weight + strict I/O monitoring.';
    return 'HR 102 bpm in atrial fibrillation with controlled ventricular response. SpO₂ borderline at 89% on room air — requires 2L O₂ to maintain >94%. Bilateral pedal edema 1+ with fine crackles at lung bases suggest fluid overload. Weight trending warrants increased diuretic dosing. 每日 weight and strict I/O monitoring essential.';
  }

  if (d.includes('Heart Failure NYHA II')) {
    return 'BP excellent at 116/72. Weight stable at 58kg. No edema. Lungs clear. NT-proBNP trending down from 620 to 450 — positive response to therapy. Exercise tolerance improving. Continue current GDMT regimen with sodium restriction and daily weight monitoring.';
  }

  if (d.includes('COPD')) {
    const stage = d.includes('3') || patient.clinicalSummary?.includes('GOLD Stage 3') ? 'GOLD Stage 3' : 'GOLD Stage 2';
    if (stage === 'GOLD Stage 3') return `SpO₂ stable at 93% at rest — consistent with baseline for ${stage} COPD. Respiratory rate normal at 18/min. Inhaler technique confirmed correct. No signs of exacerbation. Continue bronchodilator therapy and monitor for any increase in dyspnea or sputum.`;
    return `SpO₂ 93% at rest, RR 16. Breath sounds clear, no wheeze. Sputum clear and minimal. ${stage} COPD well-controlled on LAMA monotherapy. Inhaler technique correct. No exacerbations in 6 months. Continue current management.`;
  }

  if (d.includes('CKD Stage 3')) {
    return 'BP elevated at 138/88 — above target of <130/80 for CKD. HR 118 bpm notable — may indicate volume overload or anemia-related compensatory tachycardia. Weight increased 0.5kg suggesting fluid retention. Recent Losartan increase to 100mg should show BP response within 1 week. Monitor potassium closely.';
  }

  if (d.includes('CKD Stage 2')) {
    return 'BP 140/82 — improving after Losartan increase to 100mg, approaching age-adjusted target. Orthostatic BP stable. Weight 54kg. eGFR 72 stable. No signs of accelerated renal decline. Continue antihypertensive optimisation with fall precautions in place.';
  }

  if (d.includes('Oncology') || d.includes('Breast Ca') || d.includes('Lung Ca') || d.includes('Adenocarcinoma')) {
    if (d.includes('Breast')) return 'Post-chemotherapy vitals stable. Temperature 37.4°C — within safe range. WBC 3.1 consistent with expected chemotherapy-induced myelosuppression. No signs of infection. Continue neutropenic precautions and G-CSF support.';
    if (d.includes('Post-VATS') || d.includes('Lobectomy')) return 'Post-VATS lobectomy recovery on track. SpO₂ 96% on room air. Wound sites clean/dry/intact. IS volume progressing. Pain well-controlled. VTE prophylaxis in place. Continue wound surveillance, incentive spirometry, and early mobilisation per ESTS ERAS protocol.';
    return 'Post-immunotherapy vitals stable (Day 7 post-Cycle 4). Temperature 37.5°C. HR 90. No respiratory symptoms or colitis signs. Fatigue 3/10. TSH trending up — Levothyroxine initiated. Continue immunotherapy and monitor for immune-related adverse events.';
  }

  if (d.includes('Post-Stroke')) {
    if (patient.id === 4) return 'BP well-controlled at 124/78 on Lisinopril. HR 78, regular. NIHSS stable at 3 — consistent with recovery 4 weeks post-stroke. No neurological deterioration. Continue medication and intensive rehab regimen.';
    return 'BP 122/76. HR 68 (AF, rate controlled). NIHSS 1 — excellent recovery at 6 weeks. Minimal residual left arm clumsiness. Independent ambulation. Anticoagulation with Apixaban for AF stroke prevention confirmed. Continue rehab with discharge planning.';
  }

  if (d.includes('Diabetes')) {
    if (patient.id === 6) return 'CBG 6.8 mmol/L — within fasting target range. BP 130/80 approaching goal. Foot exam unremarkable with intact sensation. Glucose log shows 80% readings within target. Continue SMBG and dietary modifications.';
    return 'CBG 7.0 mmol/L (2h post-prandial). BP 134/84 — mildly elevated. Weight 87.2kg (-0.8kg since starting Semaglutide). Foot exam: intact skin with decreased monofilament sensation bilaterally. Continue GLP-1 RA titration and lifestyle modifications.';
  }

  if (d.includes('Hypertension')) {
    return 'BP 136/84 — trending toward target of <130/80 on Amlodipine 5mg. No orthostatic symptoms. Weight down 1kg with lifestyle modifications. Exercise adherence improving. Continue current management.';
  }

  return 'Vital signs within expected range for clinical profile. No concerning trends detected in recent monitoring. Continue routine monitoring per care plan.';
}

function generateSleepSummary(patient: PatientFull, p7Alert = false): string {
  if (patient.id === 7 && p7Alert) return 'Sleep disrupted — 4.2 hours with frequent awakenings due to dyspnea and fever. Nocturnal SpO₂ nadir 88% before O₂ initiation. Recommend continuous oximetry overnight.';
  if (patient.id === 7) return 'Sleep 6.8h uninterrupted. No nocturnal desaturation. Respiratory rate stable during sleep. Adequate for recovery.';
  const d = patient.diagnosis;
  if (d.includes('Heart Failure NYHA III')) return 'Sleep duration averaging 7.2 hours — adequate for recovery. Orthopnoea resolved with head-of-bed elevation. No nocturnal desaturation <92%. Sleep score 82/100 — good quality. Continue current sleep hygiene measures.';
  if (d.includes('Oncology — Breast')) return 'Sleep disrupted by chemotherapy-related fatigue and nausea — averaging 6.5 hours with frequent awakenings. Recommend daytime rest periods and antiemetics before bedtime during chemo cycles.';
  if (d.includes('Oncology — Lung')) return 'Sleep duration 7 hours. Mild disruption from immunotherapy-related fatigue. No significant sleep complaints. Continue activity pacing to preserve sleep quality.';
  if (d.includes('Post-Stroke')) return 'Sleep duration 7.5 hours — adequate for recovery. No significant disruptions. Consistent with post-stroke rehabilitation expectations. Continue sleep hygiene and regular sleep-wake schedule.';
  if (d.includes('CKD') || d.includes('Diabetes')) return 'Sleep duration within normal range. No significant disruptions detected. Continue regular sleep-wake schedule. Monitor for nocturia disrupting sleep if renal function changes.';
  if (d.includes('COPD')) return 'Sleep quality adequate. No nocturnal desaturation detected by oximetry. Respiratory rate stable during sleep. Continue current management.';
  return 'Sleep duration and quality within normal range. No significant disruptions detected. Adequate for recovery and daily functioning.';
}

function generateIntakeOutputSummary(patient: PatientFull, p7Alert = false): string {
  if (patient.id === 7 && p7Alert) return 'Oral intake reduced to ~900 mL (↓38%). Urine output ~600 mL. Net balance concerning in febrile state — encourage hydration if not contraindicated. Monitor for dehydration.';
  if (patient.id === 7) return 'Oral intake ~1,400 mL. Urine output ~1,100 mL. Net balance +300 mL — acceptable. Appetite fair, hydration adequate for sputum clearance.';
  const d = patient.diagnosis;
  if (d.includes('Heart Failure NYHA III')) return 'Fluid intake 1,200mL vs output 1,500mL — net negative 300mL consistent with diuretic therapy. Weight stable at 68.0kg. Strict I/O monitoring essential. Fluid restriction 1.5L/day should be reinforced. No signs of dehydration despite negative balance.';
  if (d.includes('Heart Failure NYHA II')) return 'Fluid balance well-maintained. Weight stable at 58kg. No edema. Furosemide used prn only — patient managing well on sodium restriction. Continue daily weight monitoring.';
  if (d.includes('CKD Stage 3')) return 'Oral intake adequate. Weight trending up 0.5kg — possible mild fluid retention. Urine output within expected range for CKD 3b. Reinforce fluid balance awareness and daily weight monitoring. Monitor for progressive volume overload.';
  if (d.includes('CKD Stage 2')) return 'Fluid balance normal. Adequate oral intake maintained. No edema or dehydration signs. Renal function stable — continue current fluid intake patterns.';
  return 'Fluid balance within normal range. Oral intake adequate. Urine output consistent with intake. No signs of dehydration or fluid overload.';
}

function generateMentalStatusSummary(patient: PatientFull, p7Alert = false): string {
  if (patient.id === 7 && p7Alert) return 'AMTS dropped 10→7 during SpO₂ desaturation — likely hypoxic delirium. Recovering to 9/10 on O₂ 2L/min. Mood anxious. Pain 3/10. Monitor q1h. Wife (Mrs. Chan) at bedside — trained on confusion assessment.';
  if (patient.id === 7) return 'AMTS 10/10. Alert and oriented ×3. Mood calm. Wife present and trained on COPD action plan. No cognitive decline. Consistent with baseline.';
  const d = patient.diagnosis;
  if (d.includes('Post-Stroke') && patient.id === 4) return 'Alert and oriented ×3. Speech improving — 90% intelligibility with mild residual expressive aphasia. Mood positive and motivated for rehabilitation. NIHSS stable at 3. No depression or cognitive decline. Continue SLP support.';
  if (d.includes('Post-Stroke') && patient.id === 12) return 'Alert and oriented ×3. NIHSS 1 — excellent recovery. Left arm fine motor improving. Mood positive with good insight. Discharge from intensive rehab anticipated in 2 weeks.';
  if (d.includes('Heart Failure NYHA III')) return 'Alert with occasional evening confusion — likely related to reduced cerebral perfusion in advanced HF. Mood mildly anxious. Pain controlled. Recommend cognitive screening and caregiver delirium education.';
  if (d.includes('Heart Failure NYHA II')) return 'Alert and oriented ×3. Mood calm and positive. Exercise tolerance improving — walking 15 min daily without dyspnea. Mental status consistent with stable HF management.';
  if (d.includes('Oncology')) return 'Alert and oriented. Mood stable with good coping strategies during active treatment. Fatigue managed with activity pacing. Emotional support provided. No signs of clinical anxiety or depression.';
  if (d.includes('CKD')) return 'Alert and oriented. Mood anxious regarding CKD trajectory and long-term prognosis. Recommend psychosocial support and education on disease management to reduce anxiety.';
  if (d.includes('Diabetes')) return 'Alert and oriented ×3. Mood calm and cooperative. Demonstrates good understanding of disease management. Pain well-controlled (mild neuropathy, no functional limitation).';
  return 'Alert and oriented ×3. Mood calm and cooperative. Pain well-controlled. No cognitive decline indicators. Consistent with baseline.';
}

function generateCarePlanExecutionSummary(patient: PatientFull): string {
  const r = patient.riskLevel;
  const freq = patient.carePlan.serviceFrequency;
  if (r === 'Critical') return `Care plan adherence strong at 94%. Given critical risk status, ${freq} visits are being conducted as prescribed. Timeliness at 85% — some visits started 10-15 minutes late. Recommend optimising morning slots for early vital assessment. Quality scores remain high across all service dimensions.`;
  if (r === 'High') return `Services delivered per ${freq} schedule. Adherence at 91% with minor scheduling variations. Patient engagement good — actively participating in care activities. Quality evaluations show positive clinical trajectory.`;
  if (patient.diagnosis.includes('Post-Stroke')) return `Rehab sessions (PT/OT/SLP at ${freq}) conducted as prescribed. Timeliness at 91% with minor delays. Quality evaluations show good functional recovery progress. Continue current intensity per rehabilitation plan.`;
  return `Services delivered per ${freq} schedule with good adherence and timeliness. Quality metrics within acceptable range. No deviations requiring escalation. Continue current service plan.`;
}

function generateMedicationSummary(patient: PatientFull): string {
  const activeMeds = patient.medications.filter(m => m.status === 'Active');
  const count = activeMeds.length;
  const d = patient.diagnosis;

  if (d.includes('Heart Failure NYHA III')) return `Complex ${count}-drug regimen for HFrEF and AF. GDMT compliance confirmed — Sacubitril/Valsartan, Bisoprolol, Spironolactone all on schedule. Apixaban critical for AF stroke prevention. Furosemide 40mg BID for fluid control. Pharmacy review recommended given polypharmacy risk.`;
  if (d.includes('Heart Failure NYHA II')) return `${count} active medications for HFpEF. Candesartan, Bisoprolol, and prn Furosemide all taken as prescribed. Medication burden low — good adherence. No side effects reported.`;
  if (d.includes('COPD')) return `Inhaler technique confirmed correct. ${patient.medications.filter(m => m.route?.includes('Inhal')).length} inhaled medications managed appropriately. Rescue use within expected range. No stock concerns.`;
  if (d.includes('Oncology — Breast')) return `Chemotherapy (AC regimen, Cycle 3 completed) administered per protocol via Port-a-cath. Antiemetic coverage adequate. G-CSF support ongoing. ${count} active medications with good adherence.`;
  if (d.includes('Oncology — Lung')) return `Immunotherapy (Durvalumab, Cycle 4/12) on schedule. Levothyroxine initiated for immunotherapy-induced hypothyroidism. Port site clean. ${count} active medications — minimal drug interaction risk.`;
  if (d.includes('Post-Stroke')) {
    if (patient.id === 4) return `${count} active medications for secondary stroke prevention. Aspirin, Atorvastatin, Lisinopril all on schedule. Good adherence with caregiver support.`;
    return `${count} active medications including Apixaban for AF stroke prevention and Aspirin. Bisoprolol for rate control. All taken on schedule. Anticoagulation compliance critical.`;
  }
  if (d.includes('CKD Stage 3')) return `Renal-adjusted medications verified. Losartan 100mg + Dapagliflozin for renoprotection. Iron supplementation for anemia of CKD. ${count} active medications — avoidance of nephrotoxic agents confirmed. K⁺ monitoring q2 weeks.`;
  if (d.includes('CKD Stage 2')) return `${count} active medications. Losartan increased to 100mg per plan. Ezetimibe for lipid management (statin-intolerant). Paracetamol prn for OA pain. All taken on schedule. No side effects.`;
  if (d.includes('Diabetes')) {
    if (patient.id === 6) return `${count} active medications. Empagliflozin added for glycemic + renal protection. Metformin and Lisinopril maintained. Recent regimen change well-tolerated.`;
    return `${count} active medications. Semaglutide 0.5mg weekly (GLP-1 RA) for glycemic + weight control. Metformin, Lisinopril, Atorvastatin all on schedule. Injection technique confirmed correct.`;
  }
  if (d.includes('Hypertension')) return `${count} active medications. Amlodipine 5mg and Rosuvastatin 10mg — simple regimen with excellent adherence. No side effects. Continue current management.`;

  return `All ${count} active medications taken on schedule with good adherence. No missed doses or stock concerns reported. Medication reconciliation completed at last visit.`;
}

function generateIoTDeviceSummary(patient: PatientFull): string {
  const devices = patient.iotDevices;
  const total = devices.length;
  const offline = devices.filter(d => d.status === 'Disconnected');
  const lowBattery = devices.filter(d => d.battery < 25 && d.status !== 'Disconnected');

  if (offline.length > 0) {
    const names = offline.map(d => d.type).join(', ');
    let msg = `${offline.length} of ${total} device(s) offline: ${names}. `;
    msg += `Other ${total - offline.length} device(s) transmitting normally.`;
    if (lowBattery.length > 0) msg += ` Additionally, ${lowBattery.map(d => d.type).join(', ')} has 电量低.`;
    return msg;
  }

  if (lowBattery.length > 0) {
    const names = lowBattery.map(d => `${d.type} (${d.battery}%)`).join(', ');
    return `All ${total} devices online but ${names} has 电量低 — recommend charging within 24 hours.`;
  }

  // Check for devices that haven't synced in >1 hour
  const stale = devices.filter(d => {
    const sync = d.lastSync;
    return sync.includes('hour') || sync.includes('day');
  });
  if (stale.length > 0) {
    return `All ${total} devices online. However, ${stale.length} device(s) have sync delays >1 hour — may indicate connectivity or usage gaps. Verify device placement and patient compliance.`;
  }

  return `All ${total} IoT devices online and transmitting at expected intervals. Battery levels adequate. No connectivity issues in the last 24 hours. Data quality meets monitoring requirements.`;
}

function generateBillingSummaryForPatient(patient: PatientFull, p7Alert: boolean): string {
  return generateBillingSummary(patient, p7Alert);
}

const ST: FC<{ title: string; icon: FC<{ className?: string }> }> = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-4"><Icon className="w-5 h-5 text-teal-600"/><h2 className="text-base font-bold text-slate-800">{title}</h2></div>
);

const SmartSummary: FC<{ patient: PatientFull }> = ({ patient }) => {
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const toggleItem = (id: string) => setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  const p7Alert = usePatientStore(s => s.p7AlertActive);
  const patientsSummary = usePatientStore(s => s.patientsSummary);
  const storeVitals = usePatientStore(s => s.vitals[patient.id] ?? DEFAULT_VITALS[patient.id]);
  const summary = patientsSummary.find(p => p.id === patient.id);
  const news = resolvePatientNews(
    patient.id,
    patient.diagnosis,
    storeVitals,
    summary,
    p7Alert && patient.id === 7,
  );
  const effectivePatient = p7Alert && patient.id === 7 ? { ...patient, riskLevel: 'Critical' as const } : patient;
  const interventions = useMemo(() => deriveInterventions(effectivePatient), [effectivePatient]);
  const isCritical = news.tier === 'high';
  const p7 = patient.id === 7 && p7Alert;
  const vitalSummaryText = useMemo(
    () => generateVitalSummary(effectivePatient, p7, storeVitals, news),
    [effectivePatient, p7, storeVitals, news],
  );

  const alertBorder = isCritical ? 'border-red-300' : 'border-amber-200';
  const alertBg = isCritical ? 'bg-red-50' : 'bg-amber-50';

  const summaryCards = [
    { icon: AlertTriangle, title: 'Escalation & Intervention Items',
      color: isCritical ? 'text-red-500' : 'text-amber-500',
      render: () => (
        <div>
          <p className="text-[10px] text-slate-500 mb-3">
            AI已识别 {interventions.length} 项 需要注意 基于 {effectivePatient.name}&apos;的当前临床状态 (NEWS {news.score} — {news.label}. {news.monitoringLabel}).
          </p>
          <div className="space-y-2">
            {interventions.map(item => (
              <label key={item.id} className="flex items-start gap-2.5 p-2.5 bg-white rounded-lg border border-slate-200 hover:border-teal-300 cursor-pointer transition-colors">
                <input type="checkbox" checked={!!checklist[item.id]} onChange={() => toggleItem(item.id)}
                  className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                <span className="text-[11px] text-slate-700 leading-relaxed">
                  <span className="font-semibold text-teal-700">{item.who}</span> — {item.action} <span className="text-amber-600 font-medium">({item.deadline})</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      ),
    },
    { icon: Heart, title: 'Vital Signs (6 Parameters)', color: 'text-red-500',
      render: () => <p className="text-[11px] text-slate-700 leading-relaxed">{vitalSummaryText}</p>,
    },
    { icon: BedDouble, title: 'Sleep', color: 'text-indigo-500',
      render: () => <p className="text-[11px] text-slate-700 leading-relaxed">{generateSleepSummary(effectivePatient, p7)}</p>,
    },
    { icon: GlassWater, title: 'Intake / Output', color: 'text-cyan-500',
      render: () => <p className="text-[11px] text-slate-700 leading-relaxed">{generateIntakeOutputSummary(effectivePatient, p7)}</p>,
    },
    { icon: Brain, title: 'Mental Status', color: 'text-purple-500',
      render: () => <p className="text-[11px] text-slate-700 leading-relaxed">{generateMentalStatusSummary(effectivePatient, p7)}</p>,
    },
    { icon: ClipboardList, title: 'Care Plan Execution', color: 'text-emerald-500',
      render: () => <p className="text-[11px] text-slate-700 leading-relaxed">{generateCarePlanExecutionSummary(effectivePatient)}</p>,
    },
    { icon: Pill, title: 'Medication Execution', color: 'text-purple-500',
      render: () => <p className="text-[11px] text-slate-700 leading-relaxed">{generateMedicationSummary(patient)}</p>,
    },
    { icon: Smartphone, title: 'IoT Devices', color: 'text-purple-500',
      render: () => <p className="text-[11px] text-slate-700 leading-relaxed">{generateIoTDeviceSummary(patient)}</p>,
    },
    { icon: PhoneCall, title: 'Billing', color: 'text-teal-500',
      render: () => <p className="text-[11px] text-slate-700 leading-relaxed">{generateBillingSummaryForPatient(patient, p7Alert)}</p>,
    },
  ];

  return (
    <div>
      <div className="sticky top-0 z-10 bg-warm-50 -mx-6 px-6 pt-6 pb-3">
        <ST title="Smart Summary" icon={Brain} />
        <p className="text-[10px] text-slate-400 mt-0.5">
          AI-powered care status analysis — generated from {patient.nursingRecords.length} nursing records, {patient.iotDevices.length} IoT streams, and {patient.medications.filter(m => m.status === 'Active').length} active medications
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
