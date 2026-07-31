// === Role & Permission Definitions ===
export type Role = 'admin' | 'doctor' | 'nursing_director' | 'case_manager' | 'finance';

const ALL_TOP = ['command_center', 'patient_records', 'iot_devices', 'followup_workbench', 'clinical_reports', 'medication', 'billing', 'reports'];
const ALL_SIDE = ['risk_alerts', 'followup_calendar', 'chronic_care', 'messages', 'knowledge_base'];
const ALL_TABS: Record<TabKey, 'w'> = { vitals: 'w', history: 'w', medication: 'w', followup_logs: 'w', care_plan: 'w', devices: 'w', billing: 'w' };

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar: string;
  institutionId: string;
  account: string;
}

// Navigation visibility per role
export const ROLE_NAV: Record<Role, string[]> = {
  admin: ALL_TOP,
  doctor: ['command_center', 'patient_records', 'followup_workbench', 'clinical_reports', 'medication'],
  nursing_director: ['command_center', 'patient_records', 'iot_devices', 'followup_workbench', 'clinical_reports'],
  case_manager: ['command_center', 'patient_records', 'followup_workbench'],
  finance: ['billing', 'reports'],
};

export const ROLE_SIDE_NAV: Record<Role, string[]> = {
  admin: ALL_SIDE,
  doctor: ['risk_alerts', 'followup_calendar', 'messages', 'knowledge_base'],
  nursing_director: ['risk_alerts', 'followup_calendar', 'chronic_care', 'messages', 'knowledge_base'],
  case_manager: ['risk_alerts', 'followup_calendar', 'messages'],
  finance: ['messages'],
};

// Patient detail tab permissions: 'r' = read, 'w' = read+write, '-' = hidden
export type TabKey = 'vitals' | 'history' | 'medication' | 'followup_logs' | 'care_plan' | 'devices' | 'billing';
export const ROLE_TAB_PERMS: Record<Role, Record<TabKey, 'r' | 'w' | '-'>> = {
  admin:       ALL_TABS,
  doctor:      { vitals: 'r', history: 'r', medication: 'w', followup_logs: 'w', care_plan: 'r', devices: 'r', billing: '-' },
  nursing_director: { vitals: 'r', history: 'r', medication: 'r', followup_logs: 'w', care_plan: 'w', devices: 'r', billing: '-' },
  case_manager: { vitals: 'r', history: 'r', medication: '-', followup_logs: '-', care_plan: 'r', devices: '-', billing: '-' },
  finance:     { vitals: '-', history: '-', medication: '-', followup_logs: '-', care_plan: '-', devices: '-', billing: 'w' },
};

// Permission checks
export function canAccess(role: Role, feature: string, navType: 'top' | 'side'): boolean {
  const list = navType === 'top' ? ROLE_NAV[role] : ROLE_SIDE_NAV[role];
  return list.includes(feature);
}

export function canEdit(role: Role, tab: TabKey): boolean {
  return ROLE_TAB_PERMS[role][tab] === 'w';
}

export function canRead(role: Role, tab: TabKey): boolean {
  return ROLE_TAB_PERMS[role][tab] !== '-';
}

// Mock users for demo
export const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'chan.chi.keung': {
    password: '123456',
    user: { id: 'D001', name: 'Dr. Chan Chi Keung', role: 'doctor', avatar: 'KW', institutionId: 'HK-INST-001', account: 'chan.chi.keung' },
  },
  'peter.ho': {
    password: '123456',
    user: { id: 'C001', name: 'Peter Ho', role: 'case_manager', avatar: 'PH', institutionId: 'HK-INST-001', account: 'peter.ho' },
  },
  'sarah.leung': {
    password: '123456',
    user: { id: 'N001', name: 'Sarah Leung', role: 'nursing_director', avatar: 'SL', institutionId: 'HK-INST-001', account: 'sarah.leung' },
  },
  'admin': {
    password: '123456',
    user: { id: 'A001', name: 'System Admin', role: 'admin', avatar: 'SA', institutionId: 'HK-INST-001', account: 'admin' },
  },
  'finance': {
    password: '123456',
    user: { id: 'F001', name: 'Margaret Chan', role: 'finance', avatar: 'MC', institutionId: 'HK-INST-001', account: 'finance' },
  },
  'grace.tang': {
    password: '123456',
    user: { id: 'CM001', name: 'Grace Tang', role: 'case_manager', avatar: 'GT', institutionId: 'HK-INST-001', account: 'grace.tang' },
  },
  'tony.lam': {
    password: '123456',
    user: { id: 'CM002', name: 'Tony Lam', role: 'case_manager', avatar: 'TL', institutionId: 'HK-INST-001', account: 'tony.lam' },
  },
  'anna.leung': {
    password: '123456',
    user: { id: 'CM003', name: 'Anna Leung', role: 'case_manager', avatar: 'AL', institutionId: 'HK-INST-001', account: 'anna.leung' },
  },
};

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrator',
  doctor: 'Physician',
  nursing_director: 'Nursing Director',
  case_manager: 'Case Manager',
  finance: 'Finance',
};
