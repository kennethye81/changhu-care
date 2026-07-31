import type { ChatMessage } from '../data/chatMessages';
import { PENDING_PATIENTS } from '../data/pendingPatients';

const INCOMING_FROM = new Set<ChatMessage['from']>(['family', 'ai', 'doctor', 'nurse', 'caseManager']);

export function countPendingRegistrations(): number {
  return PENDING_PATIENTS.length;
}

export function countUnreadForPatient(thread: ChatMessage[], readUpTo = 0): number {
  return thread.filter(m => m.id > readUpTo && INCOMING_FROM.has(m.from)).length;
}

export function countUnreadMessages(
  messagesByPatient: Record<number, ChatMessage[]>,
  readUpToByPatient: Record<number, number>,
): number {
  return Object.entries(messagesByPatient).reduce((sum, [pidStr, thread]) => {
    const pid = Number(pidStr);
    return sum + countUnreadForPatient(thread, readUpToByPatient[pid] ?? 0);
  }, 0);
}

export function getLatestUnreadPreview(thread: ChatMessage[], readUpTo = 0): string | null {
  const unread = thread.filter(m => m.id > readUpTo && INCOMING_FROM.has(m.from));
  if (!unread.length) return null;
  const text = unread[unread.length - 1].text;
  return text.length > 72 ? `${text.slice(0, 72)}...` : text;
}

/** Seed read cursors so only the latest incoming message per thread starts unread. */
export function buildInitialReadCursors(
  messagesByPatient: Record<number, ChatMessage[]>,
): Record<number, number> {
  const cursors: Record<number, number> = {};
  for (const [pidStr, thread] of Object.entries(messagesByPatient)) {
    const pid = Number(pidStr);
    if (!thread.length) continue;
    const last = thread[thread.length - 1];
    if (INCOMING_FROM.has(last.from)) {
      cursors[pid] = thread.length >= 2 ? thread[thread.length - 2].id : 0;
    } else {
      cursors[pid] = last.id;
    }
  }
  return cursors;
}
