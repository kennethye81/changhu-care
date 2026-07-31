import type { PatientFull } from '../data/patients';

function stripRole(name: string): string {
  return name.replace(/\s*\([^)]*\)\s*/g, '').trim();
}

export function buildPidToName(patients: PatientFull[]): Record<number, string> {
  const map: Record<number, string> = {};
  patients.forEach(p => { map[p.id] = p.name; });
  return map;
}

export function buildPidToNurse(patients: PatientFull[]): Record<number, string> {
  const map: Record<number, string> = {};
  patients.forEach(p => {
    if (p.carePlan?.assignedNurse) map[p.id] = stripRole(p.carePlan.assignedNurse);
  });
  return map;
}

export function buildPidToTherapist(patients: PatientFull[]): Record<number, string> {
  const map: Record<number, string> = {};
  patients.forEach(p => {
    if (p.carePlan?.assignedRehabTherapist) map[p.id] = stripRole(p.carePlan.assignedRehabTherapist);
  });
  return map;
}

export function buildPidToCareWorker(patients: PatientFull[]): Record<number, string> {
  const map: Record<number, string> = {};
  patients.forEach(p => {
    if (p.carePlan?.assignedCareWorker) map[p.id] = p.carePlan.assignedCareWorker;
  });
  return map;
}
