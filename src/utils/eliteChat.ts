import { normalizeChatMessage, type ChatMessage } from '../data/chatMessages';
import { formatNewsHeadline } from './medicalHistoryNews';
import { calculateNews, P7_NEWS_ESCALATION_VITALS } from './newsScore';

export interface EliteChatMessage {
  from: string;
  role: string;
  text: string;
  time: string;
  isAi?: boolean;
  isLog?: boolean;
}

function displayFrom(msg: ChatMessage): string {
  if (msg.from === 'ai') return '🤖 AI';
  if (msg.from === 'system') return '📋 System';
  return msg.senderName
    .replace(' (RN)', '')
    .replace(' (Respiratory)', '')
    .replace(' (Case Manager)', '');
}

function displayRole(msg: ChatMessage): string {
  if (msg.from === 'ai') return 'AI Monitor';
  if (msg.from === 'system') return 'System';
  if (msg.from === 'nurse') return 'Nurse';
  if (msg.from === 'doctor') return 'Physician';
  if (msg.from === 'caseManager') return 'Case Manager';
  if (msg.from === 'family') return 'Family';
  return 'Care Team';
}

export function mapHubMessagesToEliteDisplay(messages: ChatMessage[]): EliteChatMessage[] {
  return messages.map((raw) => {
    const msg = normalizeChatMessage(raw, raw.patientId ?? 7);
    return {
      from: displayFrom(msg),
      role: displayRole(msg),
      text: msg.text,
      time: msg.time,
      isAi: msg.from === 'ai',
      isLog: msg.from === 'system' && msg.text.includes('CARE LOG'),
    };
  });
}

export function deriveEliteChatMeta(
  patientId: number,
  messages: ChatMessage[],
  p7AlertActive: boolean,
): { lastMsg: string; lastTime: string; aiAlert?: string } {
  const last = messages[messages.length - 1];
  const aiAlert =
    patientId === 7 && p7AlertActive
      ? `🚨 ${formatNewsHeadline(calculateNews(P7_NEWS_ESCALATION_VITALS, 'COPD'))} — Infection deterioration`
      : messages.find((m) => m.from === 'ai' && (m.text.includes('⚠') || m.text.includes('🚨')))?.text.slice(0, 60);

  return {
    lastMsg: last?.text ?? 'No messages yet',
    lastTime: last?.time ?? '—',
    aiAlert: aiAlert || undefined,
  };
}
