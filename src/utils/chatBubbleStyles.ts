import type { ChatMessage } from '../data/chatMessages';

export type ChatAppPerspective = 'family' | 'hub' | 'elite';

/** Whether the bubble sits on the right (current app user). */
export function isOutgoingChatMessage(from: ChatMessage['from'], app: ChatAppPerspective): boolean {
  switch (app) {
    case 'family':
      return from === 'family';
    case 'hub':
      return from === 'nurse' || from === 'doctor' || from === 'caseManager';
    case 'elite':
      // Elite view: family on the right, care team + AI on the left
      return from === 'family';
    default:
      return false;
  }
}

export function formatChatDisplayName(name: string): string {
  return name
    .replace(' (RN)', '')
    .replace(' (Respiratory)', '')
    .replace(' (Case Manager)', '');
}

interface BubbleStyleOptions {
  isMe: boolean;
  p7Alert?: boolean;
  isLog?: boolean;
  textClass?: string;
}

/**
 * Role-based bubble colours:
 * - doctor → blue
 * - nurse / case manager → light gold
 * - family → white
 */
export function getChatBubbleClasses(
  from: ChatMessage['from'],
  { isMe, p7Alert, isLog, textClass = 'text-xs' }: BubbleStyleOptions,
): string {
  const corner = isMe ? 'rounded-tr-sm' : 'rounded-tl-sm';
  const base = `rounded-2xl px-3 py-2 ${textClass} leading-relaxed`;

  if (isLog) {
    return `${base} bg-gradient-to-r from-[#FFFFFF] to-[#EBF5F9] border-2 border-[#E1FCFF] text-slate-700 rounded-tl-sm w-full`;
  }

  if (from === 'ai') {
    return p7Alert
      ? `${base} bg-red-50 border border-red-200 text-red-800 ${corner}`
      : `${base} bg-gradient-to-r from-[#FFFFFF] to-[#EBF5F9] border border-[#E1FCFF] text-slate-700 ${corner}`;
  }

  if (from === 'system') {
    return `${base} bg-slate-50 border border-slate-200 text-slate-600 italic ${corner}`;
  }

  if (from === 'doctor') {
    return `${base} bg-blue-500 text-white shadow-sm ${corner}`;
  }

  if (from === 'nurse' || from === 'caseManager') {
    return `${base} bg-gradient-to-r from-[#FFFFFF] to-[#EBF5F9] border border-[#E1FCFF] text-slate-800 ${corner}`;
  }

  if (from === 'family') {
    return `${base} bg-white border border-slate-200 text-slate-700 shadow-sm ${corner}`;
  }

  return `${base} bg-white border border-slate-100 text-slate-700 shadow-sm ${corner}`;
}

export function getChatSenderLabelClass(from: ChatMessage['from'], p7Alert?: boolean): string {
  if (from === 'doctor') return 'text-blue-600';
  if (from === 'nurse' || from === 'caseManager') return 'text-[#03304B]';
  if (from === 'family') return 'text-slate-600';
  if (from === 'ai') return p7Alert ? 'text-red-500' : 'text-[#0B3550]';
  return 'text-slate-500';
}
