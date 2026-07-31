import type { ChatMessage } from '../data/chatMessages';
import { FAMILY_SENDER_BY_PATIENT } from '../data/chatFamily';

export { FAMILY_SENDER_BY_PATIENT };

export const FAMILY_SENDER_P7 = FAMILY_SENDER_BY_PATIENT[7];

/** Primary RN per active demo patient (store ids 1–17). */
export const ASSIGNED_NURSE_BY_PATIENT: Record<number, string> = {
  1: 'Sarah Leung (RN)',
  2: 'Jenny Tam (RN)',
  3: 'Connie Cheung (RN)',
  4: 'Vivian Lau (RN)',
  5: 'Angela Ng (RN)',
  6: 'Sarah Leung (RN)',
  7: 'Jenny Tam (RN)',
  8: 'Sarah Leung (RN)',
  9: 'Jenny Tam (RN)',
  10: 'Connie Cheung (RN)',
  11: 'Angela Ng (RN)',
  12: 'Sarah Leung (RN)',
  13: 'Vivian Lau (RN)',
  14: 'Connie Cheung (RN)',
  15: 'Sarah Leung (RN)',
  16: 'Angela Ng (RN)',
  17: 'Jenny Tam (RN)',
};

export function getHubNurseSender(patientId: number, thread: ChatMessage[]): Pick<ChatMessage, 'from' | 'senderName'> {
  const nurseInThread = [...thread].reverse().find(m => m.from === 'nurse');
  return {
    from: 'nurse',
    senderName: nurseInThread?.senderName || ASSIGNED_NURSE_BY_PATIENT[patientId] || 'Sarah Leung (RN)',
  };
}

export function getFamilySender(patientId: number): string {
  return FAMILY_SENDER_BY_PATIENT[patientId] ?? 'Family Member';
}
