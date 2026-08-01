import { type DailyActivity, type TwoWeekCarePlan } from '../data/carePlans';
import { PATIENTS_FULL } from '../data/patients';
import { DEMO_CARE_PLAN_DATE } from './carePlanSync';

export type DemoMapVisitRole = 'nurse' | 'therapy' | 'care_worker';

export interface DemoMapVisitSeed {
  time: string;
  activity: string;
  type: DailyActivity['type'];
  provider?: string;
}

const ROLE_TO_TYPE: Record<DemoMapVisitRole, DailyActivity['type']> = {
  nurse: 'nurse_visit',
  therapy: 'therapy',
  care_worker: 'care_worker',
};

/** Fixed map demo mix: 7 nurses · 5 rehab PT · 5 care workers (17 patients). */
export const DEMO_MAP_VISIT_ROLES: Record<number, DemoMapVisitRole> = {
  1: 'nurse',
  2: 'nurse',
  3: 'nurse',
  7: 'nurse',
  8: 'nurse',
  11: 'nurse',
  14: 'nurse',
  5: 'therapy',
  6: 'therapy',
  10: 'therapy',
  15: 'therapy',
  17: 'therapy',
  4: 'care_worker',
  9: 'care_worker',
  12: 'care_worker',
  13: 'care_worker',
  16: 'care_worker',
};

const ELITE_TYPES = new Set<DailyActivity['type']>(['nurse_visit', 'therapy', 'care_worker']);

function patientRecord(patientId: number) {
  return PATIENTS_FULL.find(p => p.id === patientId);
}

function syntheticVisit(patientId: number, role: DemoMapVisitRole): DailyActivity {
  const patient = patientRecord(patientId);
  const cp = patient?.carePlan;

  if (role === 'nurse') {
    return {
      time: '09:00',
      activity: 'RN Maintenance Visit',
      type: 'nurse_visit',
      detail: 'Maintenance home nursing visit per assigned care team.',
      status: 'pending',
      provider: cp?.assignedNurse ?? '姜珊（护士经理）',
    };
  }

  if (role === 'therapy') {
    return {
      time: '10:30',
      activity: 'Rehab Therapy Session',
      type: 'therapy',
      detail: 'Scheduled rehabilitation therapy session.',
      status: 'pending',
      provider: cp?.assignedRehabTherapist ?? 'David Chan (PT)',
    };
  }

  return {
    time: '11:00',
    activity: 'Care Worker ADL Support',
    type: 'care_worker',
    detail: 'Activities of daily living support at home.',
    status: 'pending',
    provider: cp?.assignedCareWorker ?? 'Lisa Cheng',
  };
}

function findEliteByRole(activities: DailyActivity[], role: DemoMapVisitRole): DailyActivity | undefined {
  const type = ROLE_TO_TYPE[role];
  return activities.find(a => a.type === type);
}

/** Resolve the elite visit that should be in-progress for map + elite apps. */
export function resolveDemoMapVisitActivity(
  patientId: number,
  role: DemoMapVisitRole,
  plans: Record<number, TwoWeekCarePlan>,
): DailyActivity {
  const plan = plans[patientId];
  const onDemoDate = plan?.schedule[DEMO_CARE_PLAN_DATE]?.filter(a => ELITE_TYPES.has(a.type)) ?? [];
  const onDateMatch = findEliteByRole(onDemoDate, role);
  if (onDateMatch) return onDateMatch;

  if (plan) {
    const dates = Object.keys(plan.schedule).sort();
    for (let i = dates.length - 1; i >= 0; i--) {
      const match = findEliteByRole(plan.schedule[dates[i]].filter(a => ELITE_TYPES.has(a.type)), role);
      if (match) return { ...match, status: 'pending' };
    }
  }

  return syntheticVisit(patientId, role);
}

/** Ensure every patient has their assigned elite visit on the demo date in TWO_WEEK_PLANS. */
export function syncDemoMapCarePlanSchedule(plans: Record<number, TwoWeekCarePlan>): void {
  for (const [id, role] of Object.entries(DEMO_MAP_VISIT_ROLES)) {
    const patientId = Number(id);
    const plan = plans[patientId];
    if (!plan) continue;

    const visit = resolveDemoMapVisitActivity(patientId, role, plans);
    if (!plan.schedule[DEMO_CARE_PLAN_DATE]) plan.schedule[DEMO_CARE_PLAN_DATE] = [];

    const dayActs = plan.schedule[DEMO_CARE_PLAN_DATE];
    const idx = dayActs.findIndex(
      a => a.time === visit.time && a.activity === visit.activity,
    );

    if (idx >= 0) {
      dayActs[idx] = { ...dayActs[idx], type: visit.type, provider: visit.provider, status: 'pending' };
    } else {
      dayActs.push({ ...visit, status: 'pending' });
      dayActs.sort((a, b) => a.time.localeCompare(b.time));
    }
  }
}

export function countDemoMapRoles(): Record<DemoMapVisitRole, number> {
  const counts: Record<DemoMapVisitRole, number> = { nurse: 0, therapy: 0, care_worker: 0 };
  for (const role of Object.values(DEMO_MAP_VISIT_ROLES)) counts[role] += 1;
  return counts;
}
