import type { ChatMessage } from '../data/chatMessages';
import { FAMILY_SENDER_BY_PATIENT } from '../data/chatFamily';

export { FAMILY_SENDER_BY_PATIENT };

export const FAMILY_SENDER_P7 = FAMILY_SENDER_BY_PATIENT[7];

/** Primary RN per active demo patient (store ids 1–17). */
export const ASSIGNED_NURSE_BY_PATIENT: Record<number, string> = {
  1: '姜珊（护士经理）',
  2: '汤菊玲（照护师）',
  3: '张丽华（个案经理）',
  4: '陈雅文（营养师）',
  5: '王秀英（护理员）',
  6: '姜珊（护士经理）',
  7: '汤菊玲（照护师）',
  8: '姜珊（护士经理）',
  9: '汤菊玲（照护师）',
  10: '张丽华（个案经理）',
  11: '王秀英（护理员）',
  12: '姜珊（护士经理）',
  13: '陈雅文（营养师）',
  14: '张丽华（个案经理）',
  15: '姜珊（护士经理）',
  16: '王秀英（护理员）',
  17: '汤菊玲（照护师）',
};

export function getHubNurseSender(patientId: number, thread: ChatMessage[]): Pick<ChatMessage, 'from' | 'senderName'> {
  const nurseInThread = [...thread].reverse().find(m => m.from === 'nurse');
  return {
    from: 'nurse',
    senderName: nurseInThread?.senderName || ASSIGNED_NURSE_BY_PATIENT[patientId] || '姜珊（护士经理）',
  };
}

export function getFamilySender(patientId: number): string {
  return FAMILY_SENDER_BY_PATIENT[patientId] ?? 'Family Member';
}
