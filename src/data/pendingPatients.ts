import type { MedicalHistoryEntry, PendingPatientData } from './pendingPatients';

/** 待登记病人 — 长护险 仅保留中国大陆病例 */
export const PENDING_PATIENTS: PendingPatientData[] = [
  {
    id: 114, name: '张建国', gender: 'M', age: 58,
    hospital: '上海和睦家医院', department: '胸外科',
    diagnosis: '右肺上叶腺癌 VATS术后 · 持续性气胸（POD5已吸收） · 高血压 · 高脂血症',
    doctor: '王伟（胸外科主任）', dischargeDate: '2026-08-13', referralDate: '2026-08-13',
    services: '社区护士 3次/周 伤口+呼吸评估 · PT肺康复 2次/周 · 电话问诊每3天1次 · 激励式肺量计 · 戒烟支持 · 血压计（欧姆龙）每日 · 血氧仪（Nonin）qid · 体温计 BID · 智能秤（欧姆龙）每日体重',
    contactName: '林霞', contactRelation: '配偶', contactPhone: '+86 138 1792 3456',
    medicalHistory: [
      { date: '2026-07-10', type: 'outpatient', facility: '上海和睦家医院', department: '体检中心', physician: '李伟（放射科）', chiefComplaint: '筛查CT发现右肺上叶结节', diagnosis: 'CT示右肺上叶部分实性结节，可疑恶变', imaging: 'CT：右肺上叶部分实性结节，需进一步评估', notes: '转诊胸外科。依据Fleischner指南管理。' },
      { date: '2026-07-15', type: 'outpatient', facility: '上海和睦家医院', department: '胸外科', physician: '王伟', chiefComplaint: '右肺上叶结节评估', diagnosis: '右肺上叶部分实性结节 — 胸外科随访。肺功能检查已安排。开始戒烟。', notes: '首次胸外科评估。' },
      { date: '2026-07-22', type: 'outpatient', facility: '上海和睦家医院', department: '放射科', physician: '李伟（放射科）', chiefComplaint: 'CT引导下穿刺活检', diagnosis: 'CT引导下针芯穿刺活检 — 腺癌确诊', notes: 'CT引导下经皮穿刺右肺上叶结节。无气胸。转MDT行手术方案讨论。' },
      { date: '2026-07-29', type: 'followup', facility: '上海和睦家医院', department: '胸外科MDT', physician: '王伟', chiefComplaint: 'MDT讨论 — 右肺上叶腺癌', diagnosis: 'MDT共识：VATS右肺上叶切除术 + 纵隔淋巴结采样', notes: '肺功能可耐受。术前检查已启动。' },
      { date: '2026-08-06', type: 'surgery', facility: '上海和睦家医院', department: '胸外科', physician: '王伟', chiefComplaint: 'VATS右肺上叶切除术', diagnosis: 'VATS右肺上叶切除术 + 纵隔淋巴结采样。冰冻切片：切缘阴性', notes: 'VATS右肺上叶切除。三孔法。胸管×1。失血量少。手术顺利。' },
      { date: '2026-08-13', type: 'discharge', facility: '上海和睦家医院', department: '胸外科', physician: '王伟', chiefComplaint: '术后第7天 — 出院转居家护理', diagnosis: 'VATS右肺上叶切除术后第7天。持续性气胸（POD1-5）— POD5已吸收。POD6拔除胸管。切口干净。最终病理和基因检测待出。', labs: '最终手术病理+基因检测（EGFR/ALK/PD-L1）待出。', notes: '因气胸延长住院（已恢复）。居家护理入组。继续培哚普利4mg + 阿托伐他汀20mg。咳嗽日志已启动（排查培哚普利相关咳嗽）。激励式肺量计900mL。戒烟第3周。2周后胸外科门诊复查。配偶已培训切口观察+静脉血栓栓塞症警示体征。' },
    ],
  },
];
