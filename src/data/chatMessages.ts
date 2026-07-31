import { PATIENTS_FULL } from './patients';

export type ChatMessage = {
  id: string;
  from: 'family' | 'nurse' | 'doctor' | 'system' | 'elite' | 'patient' | 'ai' | 'caseManager';
  senderName: string;
  text: string;
  time: string;
  patientId: number;
};

const CHAT_FROM_ALIASES: Record<string, ChatMessage['from']> = {
  doctor: 'doctor', nurse: 'nurse', casemanager: 'caseManager',
  case_manager: 'caseManager', family: 'family', ai: 'ai', system: 'system',
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
        text: `${p.name}的初始评估已完成。Barthel ${p.barthel?.score ?? '—'}/60，${p.careLevel ?? '—'}依赖。血压${p.keyIndicators?.find(k=>k.name==='血压')?.baseline ?? '—'}。请按计划执行照护。`,
        time: '2026-04-01 10:15',
        patientId: p.id,
      },
    ];
  }
  return map;
}

export default buildInitialMessagesByPatient;
