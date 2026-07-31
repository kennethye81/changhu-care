import { CARE_TEAM } from '../data/careTeam';
import type { PatientFull } from '../data/patients';

export interface FamilyCareTeamMember {
  name: string;
  role: string;
  img: string;
  phone: string;
}

const STAFF_DEMO_PHONES: Record<string, string> = {
  'Grace Tang': '+852 9123 4567',
  'Jenny Tam': '+852 9234 5678',
  'Dr. Lee Mei Ling': '+852 9345 6789',
  'David Chan': '+852 9456 7890',
  'Sarah Leung': '+852 9567 8901',
  'Peter Ho': '+852 9678 9012',
  'Dr. Chan Chi Keung': '+852 9789 0123',
  'Dr. Cheung Kwok Wai': '+852 9890 1234',
  'Raymond Wong': '+852 9901 2345',
  'Maggie Lam': '+852 9012 3456',
};

export function getStaffDemoPhone(name: string): string {
  return STAFF_DEMO_PHONES[name] ?? '+852 2595 6111';
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
