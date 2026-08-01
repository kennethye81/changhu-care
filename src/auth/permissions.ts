// === 长护险 病人分配 ===
import type { Role } from './types';

export function getVisibleModules(role: Role): string[] {
  const nav = ['command_center', 'patient_registration', 'patient_records', 'care_elites', 'inventory', 'medical_institution', 'finance', 'messages'];
  return nav;
}
export function getVisiblePatientIds(role: Role, account: string): number[] {
  switch (role) {
    case 'admin': return [1, 10001];
    case 'nurse': return [1, 10001];
    case 'assessor': return [1, 10001];
    case 'care_worker': return [1, 10001];
    case 'family': return [1, 10001];
    case 'rehab_therapist': return [1, 10001];
    case 'dietitian': return [1, 10001];
    case 'case_manager': return [1, 10001];
    default: return [1, 10001];
  }
}
