import { CARE_TEAM } from '../data/careTeam';
import type { PatientFull } from '../data/patients';

export interface FamilyCareTeamMember {
  name: string;
  role: string;
  img: string;
  phone: string;
}

const STAFF_DEMO_PHONES: Record<string, string> = {
  '汤菊玲（照护师）': '0519-8888-1003',
  '李妍（评估员）': '0519-8888-1002',
  '姜珊（护士经理）': '0519-8888-1001',
  '待分配（康复师）': '0519-8888-1004',
  '姜珊（护士经理）': '0519-8888-1001',
  '待分配（营养师）': '0519-8888-1005',
  '李妍（评估员）': '0519-8888-1002',
  '汤菊玲（照护师）': '0519-8888-1003',
  '待分配（个案经理）': '0519-8888-1006',
  '系统管理员': '0519-8888-1000',
};

export function getStaffDemoPhone(name: string): string {
  return STAFF_DEMO_PHONES[name] ?? '0519-8888-1000';
}

function stripRole(name: string): string {
  return name.replace(/\s*\([^)]*\)\s*/g, '').trim();
}

function roleLabel(raw: string, fallback: string): string {
  const match = raw.match(/\(([^)]+)\)/);
  return match?.[1] ?? fallback;
}

export function getFamilyCareTeam(patient: PatientFull | undefined): FamilyCareTeamMember[] {
  const cp = patient?.carePlan;
  if (!cp) return [];

  const entries: { name: string; role: string }[] = [
    { name: stripRole(cp.assignedDoctor), role: roleLabel(cp.assignedDoctor, 'Attending Physician') },
    { name: stripRole(cp.assignedCaseManager), role: roleLabel(cp.assignedCaseManager, 'Case Manager') },
    { name: stripRole(cp.assignedNurse), role: roleLabel(cp.assignedNurse, 'Primary Nurse') },
  ];

  if (cp.assignedRehabTherapist) {
    entries.push({ name: stripRole(cp.assignedRehabTherapist), role: roleLabel(cp.assignedRehabTherapist, 'Rehab Therapist') });
  }

  if (cp.assignedCareWorker) {
    entries.push({ name: stripRole(cp.assignedCareWorker), role: roleLabel(cp.assignedCareWorker, 'Care Worker') });
  }

  return entries
    .filter(e => e.name)
    .map(({ name, role }) => ({
      name,
      role,
      img: CARE_TEAM[name]?.avatar ?? '/avatars/default-staff.png',
      phone: getStaffDemoPhone(name),
    }));
}
