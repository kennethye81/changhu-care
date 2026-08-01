import type { ChatMessage } from '../data/chatMessages';
import { FAMILY_SENDER_BY_PATIENT } from '../data/chatFamily';

export { FAMILY_SENDER_BY_PATIENT };

export const FAMILY_SENDER_P7 = FAMILY_SENDER_BY_PATIENT[7];

/** Primary RN per active demo patient (store ids 1–17). */
export const ASSIGNED_NURSE_BY_PATIENT: Record<number, string> = {
  1: '姜珊（护士经理）',
  2: '汤菊玲（照护师）',
  3: 'Connie Cheung (RN)',
  4: 'Vivian Lau (RN)',
  5: 'Angela Ng (RN)',
  6: '姜珊（护士经理）',
  7: '汤菊玲（照护师）',
  8: '姜珊（护士经理）',
  9: '汤菊玲（照护师）',
  10: 'Connie Cheung (RN)',
  11: 'Angela Ng (RN)',
  12: '姜珊（护士经理）',
  13: 'Vivian Lau (RN)',
  14: 'Connie Cheung (RN)',
  15: '姜珊（护士经理）',
  16: 'Angela Ng (RN)',
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
