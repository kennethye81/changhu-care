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
      serviceFrequency: '每周上门4次（隔日一次）',
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
      assignedDoctor: '—',
      assignedNurse: '姜珊',
      assignedCaseManager: '林晓东',
      assignedCareWorker: '汤菊玲',
      assignedRehabTherapist: '周明',
      assignedNutritionist: '陈雅文',
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
  // ═══════════════════════════════════════════════════════════
  // PATIENT 10001 — 李玉富 — Barthel 20分（重度依赖） · 脑出血术后 · 右侧偏瘫 · 右下肢DVT · 高血压
  // 台州路桥 | 金清镇上盟村 | 评估机构：路桥区长期护理保险失能等级评估委员会
  // ═══════════════════════════════════════════════════════════
  {
    id: 2,
    name: '李玉富',
    gender: 'M',
    age: 64,
    dateOfBirth: '1962-06-18',
    ethnicity: '汉',
    phone: '13486293959',
    address: '台州市路桥区金清镇上盟村6区25号',
    insuranceType: '城乡居民基本医疗保险',
    idCard: '332603196206187016',
    diagnosis: '左侧基底节脑出血术后 · 右侧偏瘫 · 右下肢深静脉血栓 · 高血压 · Barthel 20分（重度依赖）',
    diagnosisCodes: ['I61.0', 'I10', 'I80.2', 'G81.9'],
    allergies: ['无'],
    physician: '恩泽医疗中心恩泽医院神经外科',
    admittingDiagnosis: '64岁男性，2023年12月因"突发右侧肢体无力、言语含糊4小时"入院，诊断为左侧基底节脑出血。2023.12.21急诊全麻下行立体定向颅内血肿穿刺引流术。术后右侧偏瘫、右下肢深静脉血栓形成。高血压病史。2024.1.1出院转入康复科。2026.3.27长护险评估：Barthel 20/100（重度失能），Braden 14分（压疮高危），跌倒风险7分（高危）。意识清醒、对答切题，全部生活需他人照护。与儿子李小鹏同住。',
    clinicalSummary: '64岁男性。2023年12月左侧基底节脑出血，急诊开颅血肿穿刺引流术后。遗留右侧偏瘫，右侧肢体肌张力降低、刺痛无反应，右侧巴氏征(+)。右下肢肌层静脉血栓（部分型），Caprini评分7分高危。高血压病史，需长期血压管理。Barthel 20/100分——进食需部分帮助(5)、洗澡完全依赖(0)、修饰可自理(5)、穿衣完全依赖(0)、大小便失禁(0)、用厕需帮助(5)、床椅转移需2人协助(5)、平地行走不能(0)、上下楼梯不能(0)。Braden 14分（高危）：感觉2/湿度3/活动性2/移动能力2/营养3/摩擦剪切2，目前无压疮但必须预防。跌倒风险：跌倒史0/视力<0.3/年龄>60/血压异常/服用降压药。意识清醒，对答切题。全部生活自理能力需他人照护。儿子李小鹏同住为主要照护者。评估者黄碧，评估日期2026.3.27。',

    careType: '长护险',
    careLevel: '重度',
    assessmentDate: '2026-03-27',
    assessmentAgency: '路桥区长期护理保险失能等级评估委员会',
    assessor: '黄碧',
    applicationDate: '2026-03-02',
    isFirstApplication: true,
    applicationType: '初次评估',
    undergoingRehab: true,
    disabilityCert: null,
    actualCaregiver: '子女照顾',
    emergencyContact: { name: '李小鹏', phone: '13486293959', relation: '子女' },
    livingArrangement: '与子女同住',
    consciousness: '清醒，对答切题',
    limbStatus: '右侧偏瘫（肌张力降低、刺痛无反应） / 左侧正常',
    pressureUlcer: { has: false },

    // ── 评估量表 ──
    barthel: {
      score: 20,
      items: [
        { name: '进餐', score: 5, maxScore: 10 },
        { name: '洗澡', score: 0, maxScore: 5 },
        { name: '修饰', score: 5, maxScore: 5 },
        { name: '穿衣', score: 0, maxScore: 10 },
        { name: '大便', score: 0, maxScore: 10 },
        { name: '小便', score: 0, maxScore: 10 },
        { name: '用厕', score: 5, maxScore: 10 },
        { name: '床椅转移', score: 5, maxScore: 15 },
        { name: '平地行走', score: 0, maxScore: 15 },
        { name: '上下楼梯', score: 0, maxScore: 10 },
      ],
    },
    braden: {
      score: 14,
      dimensions: [
        { name: '感觉', score: 2 },
        { name: '湿度', score: 3 },
        { name: '活动性', score: 2 },
        { name: '移动能力', score: 2 },
        { name: '营养', score: 3 },
        { name: '摩擦/剪切', score: 2 },
      ],
    },
    fallRisk: {
      score: 85,
      factors: [
        { name: '最近3个月有跌倒史', score: 0 },
        { name: '有多于一个疾病诊断', score: 20 },
        { name: '接受药物治疗', score: 15 },
        { name: '步行需拐杖/助行器', score: 20 },
        { name: '步态异常', score: 25 },
        { name: '有自主行为能力', score: 5 },
      ],
    },

    // ── 居家环境 ──
    homeSafety: {
      overallRisk: '高危',
      floorType: '待评估',
      lighting: '待评估',
      bathroom: '待评估',
      grabBars: '待评估',
      obstacles: '待评估',
      emergencyCall: '待评估',
    },

    // ── 关键指标 ──
    keyIndicators: [
      { name: 'Braden评分', baseline: '14', threshold: '≤12', action: '升级重症压疮方案' },
      { name: '跌倒事件', baseline: '0次', threshold: '≥1次/季', action: '24h内上门+安全改造' },
      { name: '血栓症状', baseline: '右小腿血栓', threshold: '肿胀/疼痛/发热', action: '立即就医' },
      { name: 'Barthel ADL', baseline: '20', threshold: '↓≥5分', action: '重新评估' },
      { name: '血压', baseline: '监测中', threshold: '>160/95', action: '通知家属就医+心内科' },
      { name: 'Caprini', baseline: '7', threshold: '持续高危', action: '定期复查下肢血管超声' },
    ],

    wardRounds: [],
    carePlan: {
      serviceFrequency: '每月上门20次（生活照护+护理+康复）',
      visitDuration: '30-90分钟/次（依服务项目）',
      goals: [
        '无新发压疮（Braden维持≥14或改善）',
        '零跌倒事件',
        '右下肢血栓不进展，无DVT/PE',
        '血压控制在<150/90 mmHg',
        'Barthel ADL稳定或提升',
        '家属照护技能达标',
      ],
      precautions: [
        '🔴 压疮预防：减压气垫床必配、每2h翻身、每日皮肤检查、保持干燥（Braden 14高危）',
        '🟠 血栓安全管理：右下肢肌层静脉血栓——避免挤压、抬高患肢、每日观察肿胀/皮温/颜色变化',
        '🟡 跌倒预防：右侧偏瘫+视力<0.3+高血压→转移时双人协助、床旁护栏、防滑地面',
        '🟢 血压管理：每日监测BP、定期心内科随访、注意体位性低血压',
        '🔵 偏瘫康复：右侧肢体被动ROM锻炼（医嘱早期肘腕关节锻炼）、避免关节挛缩',
        '🟣 失禁护理：按时更换尿垫/纸尿裤、会阴清洁防感染、大便失禁管理',
      ],
      assignedDoctor: '—',
      assignedNurse: '刘敏',
      assignedCaseManager: '张丽华',
      assignedCareWorker: '王秀英',
      assignedRehabTherapist: '陈军',
      assignedNutritionist: '赵静',
    },

    nursingRecords: [
      {
        date: '2026-03-27',
        time: '10:00',
        note: '长护险初始评估。Barthel 20/100（重度失能）。Braden 14分高危，目前无压疮。右下肢DVT（Caprini 7分高危）。右侧偏瘫，左侧肢体正常。血压待监测。儿子李小鹏为主要照护者，同住。制定护理计划：q2h翻身、压疮预防、血栓观察、被动ROM、二便管理。',
        nurse: '刘敏',
        vitals: 'BP — | HR — | Temp — | RR —（待监测）',
      },
    ],

    medications: [
      { drug: '降压药（具体方案待心内科确认）', dose: '—', route: 'PO', frequency: '每日一次', purpose: '高血压控制', startDate: '2023-12', status: 'Active' },
    ],

    iotDevices: [
      { type: '跌倒检测手环', model: '智能守护 S2', serial: 'FD-2026-00002', status: 'Connected', battery: 82, parameters: ['跌倒检测', 'SOS呼叫', '心率', '定位'], lastSync: '1分钟前' },
      { type: '血压监测仪', model: '欧姆龙 HEM-7361T', serial: 'BP-2026-93020', status: 'Connected', battery: 95, parameters: ['收缩压', '舒张压', '脉搏'], lastSync: '3分钟前' },
      { type: '减压气垫床', model: '迈德康 防压疮型', serial: 'AM-2026-00002', status: 'Connected', battery: 100, parameters: ['压力交替周期', '使用时长', '气泵状态'], lastSync: '10分钟前' },
    ],

    riskLevel: '高',
    readmissionRisk: 45,

    // ── 增值服务 ──
    serviceTier: 'standard',
    serviceModules: [
      { id: 'M1', name: '护理升级', content: '频次升级至每日，偏瘫侧护理+二便管理+便秘干预', frequency: '30次/月' },
      { id: 'M2', name: '康复服务', content: '右侧被动ROM+翻身拍背+吞咽训练（防误吸）', frequency: '12次/月' },
      { id: 'M3', name: '营养支持', content: 'ONS补充+管饲方案优化+低盐膳食指导', frequency: '月度配送' },
      { id: 'M4', name: '居家安全', content: '减压床垫+床栏+扶手+防滑改造', frequency: '一次安装' },
      { id: 'M5', name: '照护者培训', content: '翻身/鼻饲管理/血栓护理/误吸急救', frequency: '4次/月' },
      { id: 'M6', name: '医疗协同', content: '护士月度评估+血压管理+抗凝监测', frequency: '月度' },
      { id: 'M7', name: '数据贡献（免责）', content: 'RWE/RWD数据贡献由服务商承担成本，不向客户收费。健康监测数据仅供参考，不构成临床诊疗建议。', frequency: '持续' },
    ],

    outcomeTargets: [
      { indicator: '压疮', baseline: 'Braden 14', day30: '无新发压疮', day90: 'Braden≥14', day180: 'Braden改善' },
      { indicator: '跌倒', baseline: '0次', day30: '0次', day90: '0次', day180: '0次' },
      { indicator: '血栓', baseline: 'Caprini 7', day30: '无新发DVT', day90: 'Caprini降低', day180: '血栓稳定' },
      { indicator: 'Barthel ADL', baseline: '20', day30: '维持', day90: '≥20', day180: '≥25' },
      { indicator: '照护者技能', baseline: '—', day30: '≥70分', day90: '≥80分', day180: '≥85分' },
    ],
  },
];
