// === 长护险 (ChangHu Care) 病人就诊记录 ===
// 仅有患者1(沈国栋)，无历史香港病人数据
import type { PatientFull } from '../patients';

export interface VisitRecord {
  id: number;
  date: string;
  type: string;
  facility: string;
  department: string;
  physician: string;
  chiefComplaint: string;
  note?: string;
  followUp?: string;
}

export const NEW_PATIENT_VISITS: Record<number, VisitRecord[]> = {
  // 无历史就诊记录 — 长护险系统仅保留数据容器
};
