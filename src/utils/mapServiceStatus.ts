import type { TwoWeekCarePlan } from '../data/carePlans';
import { carePlanTaskKey, DEMO_CARE_PLAN_DATE, getTodayActivities, type CarePlanTaskStatus } from './carePlanSync';
import type { DemoMapVisitSeed } from './demoMapActiveVisits';

/** Map pin service-dot status derived from in-progress elite tasks today. */
export type MapServiceStatus = 'nurse' | 'therapy' | 'care_worker' | 'none';

export const MAP_SERVICE_LEGEND: {
  status: MapServiceStatus;
  color: string;
  label: string;
}[] = [
  { status: 'nurse', color: '#22c55e', label: 'Nurse on visit' },
  { status: 'therapy', color: '#3b82f6', label: 'Rehab therapist on visit' },
  { status: 'care_worker', color: '#ec4899', label: 'Care worker on visit' },
  { status: 'none', color: '#94a3b8', label: 'No active visit' },
];

const STATUS_PRIORITY: MapServiceStatus[] = ['nurse', 'therapy', 'care_worker'];

const TYPE_TO_STATUS: Partial<Record<string, MapServiceStatus>> = {
  nurse_visit: 'nurse',
  therapy: 'therapy',
  care_worker: 'care_worker',
};

export interface MapActiveVisit {
  status: MapServiceStatus;
  provider?: string;
  activity: string;
  time: string;
}

export function getMapActiveVisit(
  plan: TwoWeekCarePlan | undefined,
  patientId: number,
  carePlanStatus: Record<string, CarePlanTaskStatus>,
  demoVisitsByPatient: Record<number, DemoMapVisitSeed> = {},
  date = DEMO_CARE_PLAN_DATE,
): MapActiveVisit | null {
  const inProgress = getTodayActivities(plan, patientId, date, carePlanStatus)
    .filter(a => a.status === 'in_progress' && TYPE_TO_STATUS[a.type]);

  for (const status of STATUS_PRIORITY) {
    const act = inProgress.find(a => TYPE_TO_STATUS[a.type] === status);
    if (act) {
      return {
        status,
        provider: act.provider,
        activity: act.activity,
        time: act.time,
      };
    }
  }

  const seed = demoVisitsByPatient[patientId];
  if (!seed) return null;

  const key = carePlanTaskKey(patientId, date, seed.time, seed.activity);
  if (carePlanStatus[key] !== 'in_progress') return null;

  const status = TYPE_TO_STATUS[seed.type];
  if (!status) return null;

  return {
    status,
    provider: seed.provider,
    activity: seed.activity,
    time: seed.time,
  };
}

export function getMapServiceStatus(
  plan: TwoWeekCarePlan | undefined,
  patientId: number,
  carePlanStatus: Record<string, CarePlanTaskStatus>,
  demoVisitsByPatient: Record<number, DemoMapVisitSeed> = {},
  date = DEMO_CARE_PLAN_DATE,
): MapServiceStatus {
  return getMapActiveVisit(plan, patientId, carePlanStatus, demoVisitsByPatient, date)?.status ?? 'none';
}

export function getMapServiceDotColor(status: MapServiceStatus): string {
  return MAP_SERVICE_LEGEND.find(item => item.status === status)?.color ?? '#94a3b8';
}
