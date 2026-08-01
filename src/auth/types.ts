// === 长护险 角色与权限定义 ===
export type Role = 'admin' | 'doctor' | 'nurse' | 'case_manager' | 'assessor' | 'care_worker' | 'rehab_therapist' | 'dietitian' | 'family' | 'finance';

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

export const ROLE_NAV: Record<Role, string[]> = {
  admin: ALL_TOP,
  doctor: ['command_center', 'patient_records', 'followup_workbench', 'clinical_reports', 'medication'],
  nurse: ['command_center', 'patient_records', 'iot_devices', 'followup_workbench', 'clinical_reports'],
  case_manager: ['command_center', 'patient_records', 'followup_workbench'],
  assessor: ['command_center', 'patient_records', 'followup_workbench'],
  care_worker: ['command_center', 'patient_records'],
  rehab_therapist: ['command_center', 'patient_records'],
  dietitian: ['command_center', 'patient_records'],
  family: ['patient_records'],
  finance: ['billing', 'reports'],
};

export const ROLE_SIDE_NAV: Record<Role, string[]> = {
  admin: ALL_SIDE,
  doctor: ['risk_alerts', 'followup_calendar', 'messages', 'knowledge_base'],
  nurse: ['risk_alerts', 'followup_calendar', 'chronic_care', 'messages', 'knowledge_base'],
  case_manager: ['risk_alerts', 'followup_calendar', 'messages'],
  assessor: ['risk_alerts', 'messages'],
  care_worker: ['messages'],
  rehab_therapist: ['messages'],
  dietitian: ['messages'],
  family: ['messages'],
  finance: ['messages'],
};

export type TabKey = 'vitals' | 'history' | 'medication' | 'followup_logs' | 'care_plan' | 'devices' | 'billing';
export const ROLE_TAB_PERMS: Record<Role, Record<TabKey, 'r' | 'w' | '-'>> = {
  admin:       ALL_TABS,
  doctor:      { vitals: 'r', history: 'r', medication: 'w', followup_logs: 'w', care_plan: 'r', devices: 'r', billing: '-' },
  nurse:       { vitals: 'r', history: 'r', medication: 'r', followup_logs: 'w', care_plan: 'w', devices: 'r', billing: '-' },
  case_manager: { vitals: 'r', history: 'r', medication: '-', followup_logs: '-', care_plan: 'r', devices: '-', billing: '-' },
  assessor:    { vitals: 'r', history: 'w', medication: '-', followup_logs: 'w', care_plan: 'w', devices: '-', billing: '-' },
  care_worker: { vitals: 'r', history: 'r', medication: '-', followup_logs: 'w', care_plan: 'r', devices: '-', billing: '-' },
  rehab_therapist: { vitals: 'r', history: 'r', medication: '-', followup_logs: 'w', care_plan: 'r', devices: '-', billing: '-' },
  dietitian:   { vitals: '-', history: 'r', medication: '-', followup_logs: 'w', care_plan: 'r', devices: '-', billing: '-' },
  family:      { vitals: 'r', history: 'r', medication: '-', followup_logs: '-', care_plan: 'r', devices: '-', billing: '-' },
  finance:     { vitals: '-', history: '-', medication: '-', followup_logs: '-', care_plan: '-', devices: '-', billing: 'w' },
};

export function canAccess(role: Role, feature: string, navType: 'top' | 'side'): boolean {
  const list = navType === 'top' ? ROLE_NAV[role] : ROLE_SIDE_NAV[role];
  return list.includes(feature);
}
export function canEdit(role: Role, tab: TabKey): boolean { return ROLE_TAB_PERMS[role][tab] === 'w'; }
export function canRead(role: Role, tab: TabKey): boolean { return ROLE_TAB_PERMS[role][tab] !== '-'; }

// 长护险 Mock Users
export const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin': {
    password: '123456',
    user: { id: 'A001', name: '系统管理员', role: 'admin', avatar: 'SA', institutionId: 'CH-001', account: 'admin' },
  },
  'li.yan': {
    password: '123456',
    user: { id: 'CM001', name: '李妍', role: 'case_manager', avatar: 'LY', institutionId: 'CH-001', account: 'li.yan' },
  },
  'jiang.shan': {
    password: '123456',
    user: { id: 'N001', name: '姜珊', role: 'nurse', avatar: 'JS', institutionId: 'CH-001', account: 'jiang.shan' },
  },
  // 照护团队成员（非Hub登录用户）
  'tang.juling': {
    password: '123456',
    user: { id: 'CW001', name: '汤菊玲', role: 'care_worker', avatar: 'TJL', institutionId: 'CH-001', account: 'tang.juling' },
  },
  'wang.xiaofeng': {
    password: '123456',
    user: { id: 'FM001', name: '王小凤', role: 'family', avatar: 'WXF', institutionId: 'CH-001', account: 'wang.xiaofeng' },
  },
  'rehab.pt': {
    password: '123456',
    user: { id: 'PT001', name: '康复师（待分配）', role: 'rehab_therapist', avatar: 'PT', institutionId: 'CH-001', account: 'rehab.pt' },
  },
  'dietitian': {
    password: '123456',
    user: { id: 'DT001', name: '营养师（待分配）', role: 'dietitian', avatar: 'DT', institutionId: 'CH-001', account: 'dietitian' },
  },
};

export const ROLE_LABELS: Record<Role, string> = {
  admin: '系统管理员',
  doctor: '社区医生',
  nurse: '护士经理',
  case_manager: '个案经理',
  assessor: '评估员',
  care_worker: '长期照护师',
  rehab_therapist: '康复治疗师',
  dietitian: '营养师',
  family: '家属',
  finance: '财务',
};
