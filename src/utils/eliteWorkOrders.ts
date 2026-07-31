import type { TwoWeekCarePlan } from '../data/carePlans';
import { DEMO_CARE_PLAN_DATE, getTodayActivities, type CarePlanTaskStatus } from './carePlanSync';

export interface WorkOrderBucket {
  total: number;
  completed: number;
}

export interface EliteWorkOrderStats {
  today: WorkOrderBucket;
  week: WorkOrderBucket;
  month: WorkOrderBucket;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function countTasks(
  patientIds: number[],
  carePlans: Record<number, TwoWeekCarePlan | undefined>,
  carePlanStatus: Record<string, CarePlanTaskStatus>,
  startDate: string,
  endDate: string,
): WorkOrderBucket {
  let total = 0;
  let completed = 0;
  patientIds.forEach(patientId => {
    const plan = carePlans[patientId];
    if (!plan) return;
    Object.keys(plan.schedule).forEach(date => {
      if (date < startDate || date > endDate) return;
      const acts = getTodayActivities(plan, patientId, date, carePlanStatus)
        .filter(a => a.type !== 'self_care');
      total += acts.length;
      completed += acts.filter(a => a.status === 'completed').length;
    });
  });
  return { total, completed };
}

export function computeEliteWorkOrders(
  patientIds: number[],
  carePlans: Record<number, TwoWeekCarePlan | undefined>,
  carePlanStatus: Record<string, CarePlanTaskStatus>,
  demoDate = DEMO_CARE_PLAN_DATE,
): EliteWorkOrderStats {
  const weekEnd = addDays(demoDate, 6);
  const monthEnd = addDays(demoDate, 29);

  return {
    today: countTasks(patientIds, carePlans, carePlanStatus, demoDate, demoDate),
    week: countTasks(patientIds, carePlans, carePlanStatus, demoDate, weekEnd),
    month: countTasks(patientIds, carePlans, carePlanStatus, demoDate, monthEnd),
  };
}
