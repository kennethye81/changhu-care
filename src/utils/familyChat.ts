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
    .replace('Mrs. Chan (Chan Siu Ling)', 'Mrs. Chan (Siu Ling)');
}

function avatarMeta(from: ChatMessage['from'], senderName: string): Pick<FamilyChatMessage, 'avatar' | 'color' | 'img'> {
  if (from === 'ai') return { avatar: 'AI', color: 'bg-red-500' };
  if (from === 'system') return { avatar: 'SYS', color: 'bg-slate-500' };
  if (from === 'family') return { avatar: 'FC', color: 'bg-[#C49A6C]' };
  if (senderName.includes('Jenny Tam')) return { avatar: 'JT', color: 'bg-[#C49A6C]', img: '/avatars/jenny-tam.png' };
  if (senderName.includes('Dr. Lee')) return { avatar: 'LM', color: 'bg-[#7A5C32]', img: '/avatars/dr-lee-mei-ling.png' };
  if (senderName.includes('Grace Tang')) return { avatar: 'GT', color: 'bg-[#9C7A4E]', img: '/avatars/grace-tang.png' };
  return { avatar: from.slice(0, 2).toUpperCase(), color: 'bg-[#C49A6C]' };
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
