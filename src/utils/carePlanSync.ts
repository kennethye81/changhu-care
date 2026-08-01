import type { DailyActivity, TwoWeekCarePlan } from '../data/carePlans';

export const DEMO_CARE_PLAN_DATE = '2026-07-08';
/** HaH narrative day for 患者1 (start 2026-06-18) on DEMO_CARE_PLAN_DATE. */
export const DEMO_HAH_DAY = 21;

export function getDemoHahDay(planStartDate: string, date = DEMO_CARE_PLAN_DATE): number {
  const start = new Date(`${planStartDate}T12:00:00`);
  const cur = new Date(`${date}T12:00:00`);
  return Math.max(1, Math.round((cur.getTime() - start.getTime()) / 86400000) + 1);
}

export type CarePlanTaskStatus = DailyActivity['status'];

export function formatDemoDateLabel(): string {
  const d = new Date(`${DEMO_CARE_PLAN_DATE}T12:00:00`);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${dayNames[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDemoDateBadge(): string {
  const d = new Date(`${DEMO_CARE_PLAN_DATE}T12:00:00`);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return `${dayNames[d.getDay()]} ${d.getMonth() + 1}/${d.getDate()}`;
}

export function carePlanTaskKey(patientId: number, date: string, time: string, activity: string): string {
  return `${patientId}|${date}|${time}|${activity}`;
}

/** Family-activated COPD action plan — synced via carePlanStatus. */
export const COPD_PROTOCOL_TASK_KEY = carePlanTaskKey(7, DEMO_CARE_PLAN_DATE, 'protocol', 'COPD Care Protocol');

export function eliteTaskKey(patientId: number, time: string, activity: string): string {
  return `${patientId}-${time}-${activity}`;
}

export function getTodayActivities(
  plan: TwoWeekCarePlan | undefined,
  patientId: number,
  date: string,
  overrides: Record<string, CarePlanTaskStatus>,
): DailyActivity[] {
  const acts = plan?.schedule[date] || [];
  return acts.map((act) => ({
    ...act,
    status: overrides[carePlanTaskKey(patientId, date, act.time, act.activity)] ?? act.status,
  }));
}

export function summarizeCarePlanProgress(activities: DailyActivity[]) {
  const completed = activities.filter(a => a.status === 'completed').length;
  const missed = activities.filter(a => a.status === 'missed').length;
  const progressPct = activities.length ? Math.round((completed / activities.length) * 100) : 0;
  return { completed, missed, progressPct, total: activities.length };
}
