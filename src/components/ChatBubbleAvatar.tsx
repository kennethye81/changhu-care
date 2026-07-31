import { type FC } from 'react';
import type { ChatMessage } from '../data/chatMessages';
import FamilyAvatar from './FamilyAvatar';
import StaffAvatar from './StaffAvatar';

interface Props {
  msg: Pick<ChatMessage, 'from' | 'senderName' | 'patientId'>;
  size?: number;
  className?: string;
}

const ChatBubbleAvatar: FC<Props> = ({ msg, size = 28, className = '' }) => {
  if (msg.from === 'family') {
    return <FamilyAvatar patientId={msg.patientId} senderName={msg.senderName} size={size} className={className} />;
  }
  if (msg.from === 'ai') {
    return (
      <div
        className={`rounded-full bg-red-500 flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}
        style={{ width: size, height: size, fontSize: Math.max(8, size * 0.32) }}
        aria-label="AI Monitor"
      >
        AI
      </div>
    );
  }
  if (msg.from === 'system') {
    return (
      <div
        className={`rounded-full bg-slate-500 flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}
        style={{ width: size, height: size, fontSize: Math.max(8, size * 0.28) }}
        aria-label="System"
      >
        SYS
      </div>
    );
  }
  return <StaffAvatar name={msg.senderName} size={size} className={className} />;
};

export default ChatBubbleAvatar;
