// === 长护险 病史记录 — 仅患者1(冯存富) ===
import type { MedicalEntry } from '../medicalHistory';

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
};
