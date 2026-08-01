import { PATIENTS_FULL } from './patients';

export type ChatMessage = {
  id: string;
  from: 'family' | 'nurse' | 'doctor' | 'system' | 'elite' | 'patient' | 'ai' | 'caseManager' | 'care_worker';
  senderName: string;
  text: string;
  time: string;
  patientId: number;
};

const CHAT_FROM_ALIASES: Record<string, ChatMessage['from']> = {
  doctor: 'doctor', nurse: 'nurse', casemanager: 'caseManager',
  case_manager: 'caseManager', family: 'family', ai: 'ai', system: 'system',
  care_worker: 'care_worker',
};

/** Coerce legacy / smoke-test payloads into ChatMessage shape. */
export function normalizeChatMessage(
  raw: Partial<ChatMessage> & Record<string, unknown>,
  fallbackPatientId = 1,
): ChatMessage {
  const legacy = raw as { sender?: string; role?: string };
  const fromKey = String(raw.from ?? legacy.role ?? 'system').toLowerCase().replace(/\s+/g, '');
  const from = CHAT_FROM_ALIASES[fromKey] ?? 'system';
  return {
    id: typeof raw.id === 'number' ? String(raw.id) : String(Date.now()),
    from,
    senderName: String(raw.senderName ?? legacy.sender ?? 'Care Team'),
    text: String(raw.text ?? ''),
    time: String(raw.time ?? '—'),
    patientId: typeof raw.patientId === 'number' ? raw.patientId : fallbackPatientId,
  };
}

/** Initial chat messages per patient — generated on first load */
export function buildInitialMessagesByPatient(): Record<number, ChatMessage[]> {
  const map: Record<number, ChatMessage[]> = {};

  for (const p of PATIENTS_FULL) {
    map[p.id] = [
      {
        id: `sys-${p.id}-1`,
        from: 'system',
        senderName: '长护险系统',
        text: `照护团队已分配：${p.name}。责任护士：${p.carePlan.assignedNurse}，护理员：${p.carePlan.assignedCareWorker || '待分配'}，评估机构：${p.assessmentAgency || '—'}。`,
        time: '2026-04-01 10:00',
        patientId: p.id,
      },
      {
        id: `nurse-${p.id}-1`,
        from: 'nurse',
        senderName: p.carePlan.assignedNurse,
        text: `${p.name}的初始评估已完成。Barthel ${p.barthel?.score ?? '—'}/100，${p.careLevel ?? '—'}依赖。血压${p.keyIndicators?.find(k=>k.name?.includes('血压'))?.baseline ?? '—'}。请按计划执行照护。`,
        time: '2026-04-01 10:15',
        patientId: p.id,
      },
    ];
  }

  // 周志强 (id:2) — 3轮家属+护理团队对话
  if (map[2]) {
    map[2] = [
      ...map[2],
      {
        id: 'family-2-1',
        from: 'family',
        senderName: '周明辉（儿子）',
        text: '刘护士你好，我爸今天血压量了是148/90，比上次高了点，要紧吗？他这两天说头有点晕。',
        time: '2026-04-05 08:30',
        patientId: 2,
      },
      {
        id: 'nurse-2-2',
        from: 'nurse',
        senderName: '刘敏',
        text: '148/90在可接受范围，脑出血术后目标<150/90。头晕可能与体位变化有关，注意让他起床时动作慢一点。今天我会来复查，如果持续头晕或血压>160/95，随时打我电话。',
        time: '2026-04-05 08:35',
        patientId: 2,
      },
      {
        id: 'family-2-2',
        from: 'family',
        senderName: '周志强（本人）',
        text: '小刘啊，我这右腿感觉有点胀，最近几天好像比左边粗一点，这个要不要紧？',
        time: '2026-04-05 14:20',
        patientId: 2,
      },
      {
        id: 'nurse-2-3',
        from: 'nurse',
        senderName: '刘敏',
        text: '周叔，右腿肿胀需要重视！您有右下肢深静脉血栓，肿胀可能是血栓进展的信号。我现在马上过来，您躺着别动，腿抬高，千万别让人按摩或者挤压右腿。让明辉准备好医保卡。',
        time: '2026-04-05 14:22',
        patientId: 2,
      },
      {
        id: 'careworker-2-1',
        from: 'care_worker',
        senderName: '王秀英',
        text: '今天上午完成了翻身护理+口腔清洁+会阴护理。血压146/88，体温36.4，右腿肿胀比上周减轻了，皮温正常。周叔今天精神不错，中午吃了一碗粥+蒸蛋。',
        time: '2026-04-06 11:30',
        patientId: 2,
      },
      {
        id: 'family-2-3',
        from: 'family',
        senderName: '周明辉（儿子）',
        text: '好的收到，辛苦了王姐！刘护士昨天来看过了，说血栓暂时稳定，继续观察就行。我爸今天胃口确实好了，谢谢你们照顾。',
        time: '2026-04-06 11:35',
        patientId: 2,
      },
    ];
  }

  return map;
}

export default buildInitialMessagesByPatient;
