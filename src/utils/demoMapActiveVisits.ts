import { TWO_WEEK_PLANS } from '../data/carePlans';
import { PATIENTS_FULL } from '../data/patients';
import {
  carePlanTaskKey,
  DEMO_CARE_PLAN_DATE,
  eliteTaskKey,
  type CarePlanTaskStatus,
} from './carePlanSync';
import {
  DEMO_MAP_VISIT_ROLES,
  resolveDemoMapVisitActivity,
  type DemoMapVisitSeed,
} from './demoMapVisitAssignments';

export type { DemoMapVisitSeed };

export function buildDemoMapActiveVisits(): {
  carePlanStatus: Record<string, CarePlanTaskStatus>;
  eliteTaskTimes: Record<string, { clockIn?: string; clockOut?: string }>;
  visitByPatient: Record<number, DemoMapVisitSeed>;
} {
  const carePlanStatus: Record<string, CarePlanTaskStatus> = {};
  const eliteTaskTimes: Record<string, { clockIn?: string; clockOut?: string }> = {};
  const visitByPatient: Record<number, DemoMapVisitSeed> = {};

  for (const patient of PATIENTS_FULL) {
    const role = DEMO_MAP_VISIT_ROLES[patient.id];
    if (!role) continue;

    const act = resolveDemoMapVisitActivity(patient.id, role, TWO_WEEK_PLANS);

    visitByPatient[patient.id] = {
      time: act.time,
      activity: act.activity,
      type: act.type,
      provider: act.provider,
    };

    const cpKey = carePlanTaskKey(patient.id, DEMO_CARE_PLAN_DATE, act.time, act.activity);
    carePlanStatus[cpKey] = 'in_progress';

    const eliteKey = eliteTaskKey(patient.id, act.time, act.activity);
    eliteTaskTimes[eliteKey] = { clockIn: act.time };
  }

  return { carePlanStatus, eliteTaskTimes, visitByPatient };
}

/** Re-export for tests / debugging. */
export { DEMO_MAP_VISIT_ROLES, countDemoMapRoles } from './demoMapVisitAssignments';
