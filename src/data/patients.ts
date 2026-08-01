// === Patient Data Model — HaH (HK) + 长护险 (Mainland China) ===

import { CHANGHU_PATIENTS } from './changhuPatients';

export interface PatientFull {
  // ── 基础信息 ──
  address: string;
  id: number;
  name: string;
  gender: 'M' | 'F';
  age: number;
  diagnosis: string;
  diagnosisCodes: string[];
  allergies: string[];
  physician: string;
  admittingDiagnosis: string;
  clinicalSummary: string;
  
  // ── HaH 住院相关 ──
  wardRounds: { date: string; note: string; physician: string }[];
  carePlan: {
    serviceFrequency: string;
    visitDuration: string;
    goals: string[];
    precautions: string[];
    assignedDoctor: string;
    assignedNurse: string;
    assignedCaseManager: string;
    assignedCareWorker?: string;
    assignedRehabTherapist?: string;
    assignedNutritionist?: string;
  };
  nursingRecords: { date: string; time: string; note: string; nurse: string; vitals?: string }[];
  medications: { drug: string; dose: string; route: string; frequency: string; purpose: string; startDate: string; status: 'Active' | 'Discontinued' }[];
  iotDevices: { type: string; model: string; serial: string; status: 'Connected' | 'Syncing' | 'Disconnected'; battery: number; parameters: string[]; lastSync: string }[];
  riskLevel: '低' | '中' | '高' | '危重';
  readmissionRisk: number;

  // ── 长护险 (ChangHu Care) 专用字段 ──
  careType?: 'HaH' | '长护险';
  careLevel?: '轻度' | '中度' | '重度';
  assessmentDate?: string;
  assessmentAgency?: string;
  assessor?: string;
  idCard?: string;
  emergencyContact?: { name: string; phone: string; relation: string };
  livingArrangement?: string;
  // 评估量表
  barthel?: { score: number; items: { name: string; score: number; maxScore: number }[] };
  braden?: { score: number; dimensions: { name: string; score: number }[] };
  fallRisk?: { score: number; factors: { name: string; score: number }[] };
  // 临床
  pressureUlcer?: { has: boolean; site?: string };
  limbStatus?: string;
  consciousness?: string;
  // 居家环境
  homeSafety?: {
    floorType?: string;
    lighting?: string;
    bathroom?: string;
    grabBars?: string;
    obstacles?: string;
    emergencyCall?: string;
    overallRisk?: string;
  };
  // 增值服务
  serviceTier?: 'basic' | 'standard' | 'premium';
  serviceModules?: { id: string; name: string; content: string; frequency: string }[];
  outcomeTargets?: { indicator: string; baseline: string; day30: string; day90: string; day180: string }[];
  keyIndicators?: { name: string; baseline: string; threshold: string; action: string }[];
}

export const PATIENTS_FULL: PatientFull[] = CHANGHU_PATIENTS;
