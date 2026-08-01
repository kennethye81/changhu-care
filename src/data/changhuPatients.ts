// === 长护险 (ChangHu Care) 病人档案 — 中国大陆 ===
// 评估机构：易得康 | 地区：江苏常州金坛

import type { PatientFull } from '../patients';

export const CHANGHU_PATIENTS: PatientFull[] = [
  // ═══════════════════════════════════════════════════════════
  // PATIENT 1 — 冯存富 — Barthel 30分（重度依赖） · 高血压 · 压疮 · 极高跌倒风险
  // 常州金坛 | 指前镇解放村 | 评估机构：易得康
  // ═══════════════════════════════════════════════════════════
  {
    id: 1,
    name: '冯存富',
    gender: 'M',
    age: 77,
    address: '江苏省常州市金坛区指前镇解放村接王家村3号',
    diagnosis: '高血压2级 · 双侧肢体活动异常 · 压疮 · Barthel 30分（重度依赖）',
    diagnosisCodes: ['I10', 'L89', 'R26.8'],
    allergies: ['无'],
    physician: '—（社区医生定期随访）',
    admittingDiagnosis: '长护险中度等级评估。77岁男性，高血压病史，血压160/82mmHg。双侧肢体活动异常，Barthel ADL 30/100（重度依赖），重度依赖。Braden 16分，有压疮风险。跌倒风险评估105分（极高危，自制量表非Morse标准），有跌倒史。意识清醒，半自理状态。配偶同住为主要照护者。',
    clinicalSummary: '77岁男性，身高164cm，体重70kg。高血压患者，Barthel 30分（重度依赖）。双侧上下肢活动异常，需助行器辅助。已有压疮（部位待确认），Braden 16分提示压疮风险。跌倒风险极高（105分），有近3月跌倒史。意识清醒，半自理。需持续照护：翻身q2h、压疮护理、血压监测、防跌倒措施。评估机构：易得康，评估者李妍，评估日期2026.4.1。⚠️ Barthel ADL：手写总分=60 vs 勾选位置累加=30，差异待确认。',

    careType: '长护险',
    careLevel: '中度',
    assessmentDate: '2026-04-01',
    assessmentAgency: '易得康',
    assessor: '李妍',
    idCard: '320402194907134932',
    emergencyContact: { name: '王小凤', phone: '13092427015', relation: '配偶' },
    livingArrangement: '仅与配偶/伴侣同住',
    consciousness: '清醒',
    limbStatus: '左侧异常 / 右侧异常',
    pressureUlcer: { has: true },

    // ── 评估量表 ──
    barthel: {
      score: 30,
      items: [
        { name: '进餐', score: 5, maxScore: 10 },
        { name: '洗澡', score: 5, maxScore: 5 },
        { name: '修饰', score: 5, maxScore: 5 },
        { name: '穿衣', score: 5, maxScore: 10 },
        { name: '大便', score: 10, maxScore: 10 },
        { name: '小便', score: 0, maxScore: 10 },
        { name: '用厕', score: 0, maxScore: 10 },
        { name: '床椅转移', score: 0, maxScore: 15 },
        { name: '平地行走', score: 0, maxScore: 15 },
        { name: '上下楼梯', score: 0, maxScore: 10 },
      ],
    },
    braden: {
      score: 16,
      dimensions: [
        { name: '感觉', score: 3 },
        { name: '湿度', score: 3 },
        { name: '活动性', score: 2 },
        { name: '移动能力', score: 2 },
        { name: '营养', score: 3 },
        { name: '摩擦/剪切', score: 3 },
      ],
    },
    fallRisk: {
      score: 105,
      factors: [
        { name: '最近3个月有跌倒史', score: 20 },
        { name: '有多于一个疾病诊断', score: 20 },
        { name: '接受药物治疗', score: 15 },
        { name: '步行需拐杖/助行器', score: 20 },
        { name: '步态异常', score: 30 },
        { name: '有自主行为能力', score: 0 },
      ],
    },

    // ── 居家环境 ──
    homeSafety: {
      overallRisk: '待评估',
      floorType: '待评估',
      lighting: '待评估',
      bathroom: '待评估',
      grabBars: '待评估',
      obstacles: '待评估',
      emergencyCall: '待评估',
    },

    // ── 关键指标 ──
    keyIndicators: [
      { name: '跌倒事件', baseline: '已有跌倒史', threshold: '再次发生', action: '24h内上门+安全改造' },
      { name: '血压 | 160/82 | ≥160/100 | 通知家属就医' },
      { name: 'Braden评分 | 16 | ≤16=加强预防，≤12=升级高风险' },
      { name: 'Barthel ADL', baseline: '30/100', threshold: '↓≥10分', action: '重新评估' },
    ],

    wardRounds: [],
    carePlan: {
      serviceFrequency: '护理员日常照护（每日） + 护士定期访视（月度）',
      visitDuration: '60-90分钟/次',
      goals: [
        '零跌倒事件',
        '血压控制在<150/90 mmHg',
        '压疮不恶化，90天内改善',
        'Barthel ADL稳定或提升',
      ],
      precautions: [
        '禁止单独外出——跌倒105分极高危',
        '每2小时翻身——压疮护理+减压气垫',
        '低盐低脂饮食——定期监测血压',
        '助行器+地面防滑+夜间照明',
        '保持身体清洁，适当按摩',
      ],
      assignedDoctor: '社区医生（定期随访）',
      assignedNurse: '姜珊（护士经理）',
      assignedCaseManager: '李妍（个案经理）',
      assignedCareWorker: '汤菊玲',
      assignedRehabTherapist: '—',
    },

    nursingRecords: [
      {
        date: '2026-04-01',
        time: '10:00',
        note: '长护险初始评估。Barthel 30/100（重度依赖）。血压160/82，双侧肢体异常，已有压疮。跌倒风险105分极高危。配偶王小凤为紧急联系人。制定护理计划：q2h翻身、压疮护理、防跌倒措施、血压监测。',
        nurse: '姜珊',
        vitals: 'BP 160/82 | HR 78 | Temp 36.7 | RR 17',
      },
      {
        date: '2026-04-15',
        time: '09:30',
        note: '半月随访。血压158/84，略有下降。压疮未恶化，Braden维持16。跌倒0次。配偶报告患者配合翻身，饮食低盐低脂依从性良好。',
        nurse: '姜珊',
        vitals: 'BP 158/84 | HR 76 | Temp 36.6 | RR 17',
      },
    ],

    medications: [
      { drug: '硝苯地平（Nifedipine）', dose: '30mg', route: 'PO', frequency: '每日一次（AM）', purpose: 'CCB — 高血压控制', startDate: '2023-06-01', status: 'Active' },
    ],

    iotDevices: [
      { type: '跌倒检测手环', model: '智能守护 S2', serial: 'FD-2026-00001', status: 'Connected', battery: 85, parameters: ['跌倒检测', 'SOS呼叫', '心率', '定位'], lastSync: '30秒前' },
      { type: '血压监测仪', model: '欧姆龙 HEM-7361T', serial: 'BP-2026-93019', status: 'Connected', battery: 92, parameters: ['收缩压', '舒张压', '脉搏'], lastSync: '1分钟前' },
      { type: '减压气垫床', model: '迈德康 防压疮型', serial: 'AM-2026-00001', status: 'Connected', battery: 100, parameters: ['压力交替周期', '使用时长', '气泵状态'], lastSync: '5分钟前' },
    ],

    riskLevel: '中',
    readmissionRisk: 30,

    // ── 增值服务 ──
    serviceTier: 'standard',
    serviceModules: [
      { id: 'M1', name: '护理升级', content: '每2h翻身 + 压疮护理 + 减压气垫床 + 皮肤检查', frequency: '持续' },
      { id: 'M2', name: '跌倒防控', content: '居家安全改造 + 助行器适配 + 环境评估 + 禁止单独外出', frequency: '一次性+持续' },
      { id: 'M3', name: '康复理疗', content: '被动关节活动 + 按摩 + 床上活动训练', frequency: '3次/周' },
      { id: 'M4', name: '血压管理', content: '血压监测 + 低盐低脂饮食指导 + 用药提醒', frequency: '持续' },
      { id: 'M5', name: '营养干预', content: '营养评估 + 蛋白补充 + 饮食指导', frequency: '每周' },
      { id: 'M6', name: '医疗协同', content: '护士月度评估 + 压疮复查 + 用药审查', frequency: '月度' },
      { id: 'M7', name: '数据贡献（免责）', content: 'RWE/RWD数据贡献由服务商承担成本，不向客户收费。健康监测数据仅供参考，不构成临床诊疗建议。', frequency: '持续' },
    ],

    outcomeTargets: [
      { indicator: '跌倒事件', baseline: '已有史', day30: '0次', day90: '0次', day180: '0次' },
      { indicator: '血压', baseline: '160/82', day30: '<150/90', day90: '<140/85', day180: '<140/85' },
      { indicator: '压疮', baseline: '已有', day30: '不恶化', day90: '改善', day180: '愈合' },
      { indicator: '照护者技能', baseline: '—', day30: '≥70分', day90: '≥80分', day180: '≥85分' },
    ],
  },
];
