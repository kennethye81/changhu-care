// === 长护险 病史记录 — 患者1(冯存富) + 患者10001(李玉富) ===
import type { HistoryEntry as MedicalEntry } from '../medicalHistory';

export const NEW_MEDICAL_HISTORY: Record<number, MedicalEntry[]> = {
  1: [
    {
      date: '2025-11-15', type: 'admission',
      facility: '常州市金坛区人民医院', department: '内科',
      physician: '王医生',
      chiefComplaint: '高血压3级 极高危组 — 头晕伴双下肢乏力1月，Barthel 30分',
      note: 'BP 172/95，心率82，心电图示左室高电压。既往高血压史10年，不规则服药。压疮高危（Braden 10分）。',
      followUp: '2周后复诊，社区护士每周访视',
    },
    {
      date: '2025-12-02', type: 'follow-up',
      facility: '常州市金坛区人民医院', department: '内科',
      physician: '王医生',
      chiefComplaint: '高血压复诊 — 头晕好转，BP 155/88',
      note: '氨氯地平5mg qd+厄贝沙坦150mg qd。血压部分控制。压疮预防宣教。跌倒风险评估：极高危。',
      followUp: '1个月复诊',
    },
    {
      date: '2026-03-10', type: 'admission',
      facility: '常州市金坛区人民医院', department: '老年科',
      physician: '李医生',
      chiefComplaint: '骶尾部压疮II期 — 3cm×4cm，红润基底，少量渗液',
      note: '高龄+长期卧床+营养不良。Barthel 30分，Braden 10分。予清创+泡沫敷料。翻身q2h。',
      followUp: '每周换药，社区护士监督', 
    },
  ],
  10001: [
    {
      date: '2023-12-18', type: 'admission',
      facility: '台州恩泽医疗中心恩泽医院', department: '神经外科',
      physician: '李烨 主任医师',
      chiefComplaint: '突发右侧肢体无力、言语含糊4小时 — GCS评分3+3+5，神志模糊',
      note: '左侧基底节脑出血，右侧偏瘫。高血压病史。入院查体：右侧肢肌张力降低，右侧肢体刺痛无反应，右侧巴氏征(+)。头颅CT：左侧基底节区血肿约30ml。既往：右基底节区及桥脑陈旧性腔隙性脑梗塞。',
      followUp: '急诊手术',
    },
    {
      date: '2023-12-21', type: 'surgery',
      facility: '台州恩泽医疗中心恩泽医院', department: '神经外科',
      physician: '李烨 主任医师',
      chiefComplaint: '立体定向颅内血肿穿刺引流术（左侧）— 急诊全麻',
      note: '手术顺利，术后予监控血压、护脑、护胃及补液等对症治疗。术后CT示血肿较前范围增大（正常术后反应）。',
      followUp: '转入病房监护',
    },
    {
      date: '2024-01-01', type: 'discharge',
      facility: '台州恩泽医疗中心恩泽医院', department: '神经外科',
      physician: '李烨 主任医师',
      chiefComplaint: '脑出血术后出院 — 住院14天，病情稳定，转康复科行后续康复锻炼',
      note: '出院体格检查：瞳孔直径2mm，对光反射灵敏。左侧肢体能遵医嘱活动，右侧肢体刺痛无反应。右下肢肌层静脉血栓形成（Caprini 7分高危），避免挤压右下肢。Barthel约20分（全部需他人照护）。出院带药：无。复诊：出院后2周门诊复查头颅胸部CT及血常规生化。心内科随访血压管理。',
      followUp: '2周后复查+康复科门诊',
    },
    {
      date: '2026-03-27', type: 'followup',
      facility: '路桥区长期护理保险失能等级评估委员会', department: '失能评估',
      physician: '黄碧 评估员',
      chiefComplaint: '长护险初次评估 — 脑出血术后2年余，右侧偏瘫，全部生活需他人照护',
      note: '评估结论：重度失能。Barthel 20/100（重度依赖），Braden 14（压疮高危，目前无压疮），跌倒风险7分（高危）。右下肢肌层静脉血栓需持续观察。意识清醒、对答切题。与儿子李小鹏同住，子女为主要照护者。建议：减压气垫床、q2h翻身、被动ROM康复、二便管理、血压监测。',
      followUp: '月度护理计划执行',
    },
  ],
};
