// 长护险临床文档 — 沈国栋 + 周志强
export interface ClinicalDoc {
  id: string; patient: string; title: string; date: string; author: string;
  type: 'discharge' | 'progress_note' | 'lab' | 'referral'; content?: string;
}

// 出院小结
export const DISCHARGE_SUMMARIES: ClinicalDoc[] = [
  { id: 'DS-001', patient: '沈国栋', title: '出院小结 — 高血压3级极高危·心力衰竭', date: '2026-03-15', author: '常州市第一人民医院', type: 'discharge' },
  { id: 'DS-002', patient: '周志强', title: '出院小结 — 左侧基底节脑出血术后', date: '2024-01-01', author: '台州恩泽医疗中心恩泽医院', type: 'discharge' },
];

// 护理记录
export const PROGRESS_NOTES: ClinicalDoc[] = [
  { id: 'PN-001', patient: '沈国栋', title: '护理记录 — 压疮评估+血压管理', date: '2026-08-16', author: '姜珊', type: 'progress_note' },
  { id: 'PN-002', patient: '周志强', title: '护理记录 — DVT观察+偏瘫护理', date: '2026-08-16', author: '刘敏', type: 'progress_note' },
];

// 检验报告
export const LAB_REPORTS: ClinicalDoc[] = [
  { id: 'LR-001', patient: '沈国栋', title: '检验报告 — 肾功能+电解质', date: '2026-03-14', author: '常州市第一人民医院检验科', type: 'lab' },
];

// 转介信
export const REFERRAL_LETTERS: ClinicalDoc[] = [
  { id: 'RL-001', patient: '周志强', title: '转介 — 神经康复门诊随访', date: '2024-01-05', author: '台州恩泽医疗中心恩泽医院康复科', type: 'referral' },
];

// 向后兼容：联合导出
export const HUB_CLINICAL_DOCS: ClinicalDoc[] = [
  ...DISCHARGE_SUMMARIES, ...PROGRESS_NOTES, ...LAB_REPORTS, ...REFERRAL_LETTERS,
];
