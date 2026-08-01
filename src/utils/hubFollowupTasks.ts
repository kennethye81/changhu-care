import type { DailyActivity, TwoWeekCarePlan } from '../data/carePlans';
import type { PatientSummary } from '../store/patientStore';
import {
  carePlanTaskKey,
  DEMO_CARE_PLAN_DATE,
  getTodayActivities,
  type CarePlanTaskStatus,
} from './carePlanSync';

export type FollowupTaskPriority = 'Critical' | 'High' | 'Attention' | 'Normal';
export type FollowupTaskStatus = 'pending' | 'in_progress' | 'completed';

export interface FollowupTask {
  id: string;
  patientId: number;
  patient: string;
  task: string;
  priority: FollowupTaskPriority;
  due: string;
  assignee: string;
  status: FollowupTaskStatus;
}

const DEMO_PATIENT_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

function stripProvider(provider?: string): string {
  if (!provider) return 'Care Team';
  return provider.replace(/\s*\([^)]*\)\s*/g, '').trim();
}

function priorityFor(
  patient: PatientSummary,
  act: DailyActivity,
  alertActive: boolean,
): FollowupTaskPriority {
  if (patient.id === 1 && alertActive) {
    if (act.type === 'nurse_visit' || act.activity.includes('IV')) return 'Critical';
    return 'High';
  }
  if (patient.newsTier === 'high') return 'Critical';
  if (patient.newsTier === 'medium') return 'High';
  if (act.status === 'missed') return 'High';
  if (act.type === 'nurse_visit' || act.type === 'doctor_consult') return 'Attention';
  return 'Normal';
}

function mapStatus(status: CarePlanTaskStatus): FollowupTaskStatus {
  if (status === 'in_progress') return 'in_progress';
  if (status === 'completed') return 'completed';
  return 'pending';
}

export function buildFollowupTasks(
  patients: PatientSummary[],
  carePlans: Record<number, TwoWeekCarePlan | undefined>,
  carePlanStatus: Record<string, CarePlanTaskStatus>,
  alertActive: boolean,
  demoDate = DEMO_CARE_PLAN_DATE,
): FollowupTask[] {
  const byId = new Map(patients.map(p => [p.id, p]));
  const tasks: FollowupTask[] = [];

  for (const patientId of DEMO_PATIENT_IDS) {
    const patient = byId.get(patientId);
    const plan = carePlans[patientId];
    if (!patient || !plan) continue;

    const acts = getTodayActivities(plan, patientId, demoDate, carePlanStatus).filter(
      a => a.type !== 'self_care' && a.status !== 'completed',
    );

    for (const act of acts) {
      tasks.push({
        id: carePlanTaskKey(patientId, demoDate, act.time, act.activity),
        patientId,
        patient: patient.name,
        task: act.activity,
        priority: priorityFor(patient, act, alertActive),
        due: `Today ${act.time}`,
        assignee: stripProvider(act.provider) || patient.caseManager?.split('(')[0].trim() || 'Care Team',
        status: mapStatus(act.status),
      });
    }
  }

  const priOrder: Record<FollowupTaskPriority, number> = {
    Critical: 0,
    High: 1,
    Attention: 2,
    Normal: 3,
  };

  return tasks.sort(
    (a, b) => priOrder[a.priority] - priOrder[b.priority] || a.due.localeCompare(b.due),
  );
}
