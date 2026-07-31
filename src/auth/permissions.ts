// Patient assignment by role user — 17 HaH patients
export const DOCTOR_PATIENTS: Record<string, number[]> = {
  'chan.chi.keung': [1, 4, 8, 11, 12, 14, 15],
  'cheung.kwok.wai': [3, 6, 10, 13],
  'lee.mei.ling': [2, 5, 7, 9, 16, 17],
  'wang.wei': [18],
};

export const CASE_MANAGER_PATIENTS: Record<string, number[]> = {
  'peter.ho': [1, 4, 8, 12, 14, 15],
  'grace.tang': [2, 5, 7, 9, 11, 17, 18],
  'anna.leung': [3, 6, 10, 13],
  'tony.lam': [4, 16],
};

export const NURSING_DIRECTOR_PATIENTS: Record<string, number[]> = {
  'sarah.leung': [1, 2, 4, 6, 7, 8, 9, 11, 12, 17, 18],
};

import type { Role } from './types';

/** Returns the list of patient IDs visible to this user */
export function getVisiblePatientIds(role: Role, account: string): number[] | null {
  if (role === 'admin' || role === 'finance') return null; // null = all patients
  if (role === 'doctor') return DOCTOR_PATIENTS[account] || [];
  if (role === 'case_manager') return CASE_MANAGER_PATIENTS[account] || [];
  if (role === 'nursing_director') return NURSING_DIRECTOR_PATIENTS[account] || [];
  return null;
}

/** Returns which sidebar nav items are visible */
export function getVisibleModules(role: Role): string[] {
  if (role === 'admin') return ['command_center', 'patient_registration', 'patient_records', 'medical_institution', 'care_elites', 'inventory', 'finance', 'messages'];
  if (role === 'doctor') return ['command_center', 'patient_records', 'care_elites', 'messages'];
  if (role === 'case_manager') return ['command_center', 'patient_registration', 'patient_records', 'medical_institution', 'care_elites', 'inventory', 'finance', 'messages'];
  if (role === 'nursing_director') return ['command_center', 'patient_registration', 'patient_records', 'medical_institution', 'care_elites', 'inventory', 'messages'];
  if (role === 'finance') return ['inventory', 'finance'];
  return [];
}
