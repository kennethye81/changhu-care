import type { FollowupLogEntry } from '../data/carePlans';
import type { FC } from 'react';
import {
  Activity, AlertTriangle, CheckCircle2, ClipboardList, Heart, Stethoscope,
} from 'lucide-react';
import { DEMO_CARE_PLAN_DATE } from './carePlanSync';
import type { Vitals } from '../store/patientStore';

export interface FamilyProgressNote {
  title: string;
  detail: string;
  time: string;
  icon: FC<{ className?: string }>;
  color: string;
}

function formatLogTime(date: string, time: string): string {
  const d = new Date(`${date}T12:00:00`);
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return `${dayNames[d.getDay()]} ${time}`;
}

function pickIcon(type: string, status: FollowupLogEntry['status']): FC<{ className?: string }> {
  if (status === 'escalated' || type.includes('Alert') || type.includes('RED')) return AlertTriangle;
  if (type.includes('Tele') || type.includes('MD') || type.includes('Dr.')) return Stethoscope;
  if (type.includes('RN') || type.includes('Visit')) return ClipboardList;
  if (type.includes('PT')) return Activity;
  if (type.includes('Med')) return CheckCircle2;
  return Heart;
}

function pickColor(status: FollowupLogEntry['status'], type: string): string {
  if (status === 'escalated' || type.includes('RED') || type.includes('Alert')) return 'text-red-600';
  if (type.includes('Tele') || type.includes('MD')) return 'text-[#0095D3]';
  return 'text-[#06B0EF]';
}

export function mapCarePlanLogsToFamilyNotes(logs: FollowupLogEntry[], limit = 6): FamilyProgressNote[] {
  return [...logs]
    .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`))
    .slice(0, limit)
    .map((log) => ({
      title: log.type,
      detail: log.vitals ? `${log.detail} (${log.vitals})` : log.detail,
      time: formatLogTime(log.date, log.time),
      icon: pickIcon(log.type, log.status),
      color: pickColor(log.status, log.type),
    }));
}

const DAY1_FALLBACK_NOTES = (vitals?: Vitals): FamilyProgressNote[] => [
  { title: '护士刘敏 — 初始评估', detail: '长护险初次评估完成。Barthel 20/100（重度失能），Braden 14（高危），右下肢DVT（Caprini 7）。家属周明辉已培训翻身、ROM操作和血压监测。', time: '周五 10:00', icon: ClipboardList, color: 'text-[#0095D3]' },
  { title: '个案经理 — 方案确认', detail: '个案经理张丽华确认月度服务方案：20次/月上门，q2h翻身+被动ROM+二便管理+血压监测。家属签字确认。', time: '周五 10:15', icon: CheckCircle2, color: 'text-[#0095D3]' },
  { title: '护理员 — 首次访视', detail: '护理员王秀英完成床单位整理、面部清洁、口腔护理。家属满意。右下肢血栓观察要点已再次强调。', time: '周六 09:00', icon: Heart, color: 'text-[#06B0EF]' },
  {
    title: '生命体征监测',
    detail: vitals
      ? `血压 ${vitals.bpSystolic}/${vitals.bpDiastolic}，心率 ${vitals.hr}，血氧 ${vitals.spo2}%，体温 ${vitals.temp}°C。右侧偏瘫卧床，左肢正常。目前无压疮。`
      : '血压145/88，心率72，血氧97%，体温36.5°C。右侧偏瘫卧床，左肢正常。目前无压疮。',
    time: '周五 10:00',
    icon: Heart,
    color: 'text-[#06B0EF]',
  },
];

function buildAlertNote(vitals: Vitals): FamilyProgressNote {
  return {
    title: '护士刘敏 — 紧急访视',
    detail: `血压 ${vitals.bpSystolic}/${vitals.bpDiastolic}，血氧 ${vitals.spo2}%，心率 ${vitals.hr}，体温 ${vitals.temp}°C。血压异常，需立即评估。通知家属周明辉就医。`,
    time: '周五 14:30',
    icon: ClipboardList,
    color: 'text-red-600',
  };
}

export function getFamilyCareProgressNotes(
  logs: FollowupLogEntry[] | undefined,
  alertActive: boolean,
  demoDate = DEMO_CARE_PLAN_DATE,
  limit = 6,
  vitals?: Vitals,
): FamilyProgressNote[] {
  const dated = (logs || []).filter(l => l.date <= demoDate);
  const fromStore = mapCarePlanLogsToFamilyNotes(dated.length ? dated : (logs || []), limit);
  if (fromStore.length > 0) return fromStore.slice(0, limit);
  const base = DAY1_FALLBACK_NOTES(vitals);
  if (alertActive && vitals) {
    return [
      { title: '⚠ AI风险提醒', detail: 'AI检测到血压异常 — 需立即评估。通知护士刘敏。家属周明辉已收到短信提醒。', time: '周五 14:30', icon: AlertTriangle, color: 'text-red-600' },
      buildAlertNote(vitals),
      ...base,
    ].slice(0, limit);
  }
  return base.slice(0, limit);
}
