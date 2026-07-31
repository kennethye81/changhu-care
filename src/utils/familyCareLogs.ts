import type { FollowupLogEntry } from '../data/carePlans';
import type { FC } from 'react';
import {
  Activity, AlertTriangle, CheckCircle2, ClipboardList, Heart, Stethoscope,
} from 'lucide-react';
import { DEMO_CARE_PLAN_DATE } from './carePlanSync';
import { formatP7InfectionAlertDetail } from './medicalHistoryNews';
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
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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
  if (type.includes('Tele') || type.includes('MD')) return 'text-[#9C7A4E]';
  return 'text-[#C49A6C]';
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
  { title: 'RN — Initial HaH Assessment', detail: 'Primary nurse — baseline vitals recorded, caregiver trained on SpO₂/BP monitoring and escalation protocol. AMTS 10/10.', time: 'Thu 9:30 AM', icon: ClipboardList, color: 'text-[#9C7A4E]' },
  { title: 'Attending Physician Tele-consult', detail: 'Day 1 plan confirmed. Continue clinical protocol per care plan. Medication reconciliation completed.', time: 'Thu 9:38 AM', icon: Stethoscope, color: 'text-[#9C7A4E]' },
  { title: 'AM Medication', detail: 'Tiotropium 18mcg + Amlodipine 5mg — confirmed taken at 8:00 AM. Salbutamol PRN not needed this morning.', time: 'Thu 8:00 AM', icon: CheckCircle2, color: 'text-[#C49A6C]' },
  {
    title: 'Vitals + SpO₂ Check',
    detail: vitals
      ? `BP ${vitals.bpSystolic}/${vitals.bpDiastolic}, HR ${vitals.hr} sinus, SpO₂ ${vitals.spo2}% on room air, Temp ${vitals.temp}°C. Breath sounds: coarse rhonchi RLL, mild wheeze. Comfortable at rest.`
      : 'BP 138/84, HR 84 sinus, SpO₂ 93% on room air, Temp 37.0°C. Breath sounds: coarse rhonchi RLL, mild wheeze. Comfortable at rest.',
    time: 'Thu 9:30 AM',
    icon: Heart,
    color: 'text-[#C49A6C]',
  },
];

function buildP7RedAlertNote(vitals: Vitals): FamilyProgressNote {
  return {
    title: 'RN — RED Alert + POCT',
    detail: `SpO₂ ${vitals.spo2}%, Temp ${vitals.temp}°C, RR ${vitals.rr}, HR ${vitals.hr}. POCT: CRP 68, PCT 0.8. IV Ceftriaxone 2g started. O₂ at 2L/min.`,
    time: 'Thu 2:30 PM',
    icon: ClipboardList,
    color: 'text-red-600',
  };
}

export function getFamilyCareProgressNotes(
  logs: FollowupLogEntry[] | undefined,
  p7Alert: boolean,
  demoDate = DEMO_CARE_PLAN_DATE,
  limit = 6,
  vitals?: Vitals,
): FamilyProgressNote[] {
  const dated = (logs || []).filter(l => l.date <= demoDate);
  const fromStore = mapCarePlanLogsToFamilyNotes(dated.length ? dated : (logs || []), limit);
  if (fromStore.length > 0) return fromStore.slice(0, limit);
  const base = DAY1_FALLBACK_NOTES(vitals);
  if (p7Alert && vitals) {
    return [
      { title: '⚠ AI Infection Alert', detail: formatP7InfectionAlertDetail(), time: 'Thu 5:02 PM', icon: AlertTriangle, color: 'text-red-600' },
      buildP7RedAlertNote(vitals),
      ...base,
    ].slice(0, limit);
  }
  return base.slice(0, limit);
}
