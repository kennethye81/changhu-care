import { normalizeChatMessage, type ChatMessage } from '../data/chatMessages';

export interface FamilyChatMessage {
  from: ChatMessage['from'];
  name: string;
  text: string;
  time: string;
  avatar: string;
  color: string;
  img?: string;
}

function senderDisplayName(senderName: string): string {
  return senderName
    .replace(' (RN)', '')
    .replace(' (Respiratory)', '')
    .replace(' (Case Manager)', '')
    .replace('陈玉兰', '陈玉兰');
}

function avatarMeta(from: ChatMessage['from'], senderName: string): Pick<FamilyChatMessage, 'avatar' | 'color' | 'img'> {
  if (from === 'ai') return { avatar: 'AI', color: 'bg-red-500' };
  if (from === 'system') return { avatar: 'SYS', color: 'bg-slate-500' };
  if (from === 'family') return { avatar: 'FC', color: 'bg-[#06B0EF]' };
  if (senderName.includes('Jenny Tam')) return { avatar: 'JT', color: 'bg-[#06B0EF]', img: '/avatars/jenny-tam.png' };
  if (senderName.includes('姜珊')) return { avatar: 'LM', color: 'bg-[#0B3550]', img: '/avatars/nurse-manager.png' };
  if (senderName.includes('汤菊玲')) return { avatar: 'TJ', color: 'bg-[#0095D3]', img: '/avatars/care-worker.png' };
  return { avatar: from.slice(0, 2).toUpperCase(), color: 'bg-[#06B0EF]' };
}

export function mapHubMessagesToFamilyDisplay(messages: ChatMessage[]): FamilyChatMessage[] {
  return messages.map((raw) => {
    const msg = normalizeChatMessage(raw, raw.patientId ?? 7);
    return {
      from: msg.from,
      name: senderDisplayName(msg.senderName),
      text: msg.text,
      time: msg.time,
      ...avatarMeta(msg.from, msg.senderName),
    };
  });
}
