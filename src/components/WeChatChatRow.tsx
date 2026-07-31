import type { FC, ReactNode } from 'react';

interface WeChatChatRowProps {
  isMe: boolean;
  avatar: ReactNode;
  header: ReactNode;
  children: ReactNode;
  fullWidth?: boolean;
}

/**
 * WeChat-style chat row: others left, self right.
 * Animation on the bubble group only (not the full-width shell).
 */
const WeChatChatRow: FC<WeChatChatRowProps> = ({ isMe, avatar, header, children, fullWidth }) => (
  <div className="w-full block">
    <div
      className={`flex gap-2 ${isMe ? 'ml-auto flex-row-reverse wechat-msg-enter-right' : 'mr-auto flex-row wechat-msg-enter-left'} ${fullWidth ? 'w-full max-w-full' : 'max-w-[82%]'}`}
    >
      <div className="flex-shrink-0 self-end">{avatar}</div>
      <div className={`min-w-0 flex flex-col ${fullWidth ? 'flex-1' : ''} ${isMe ? 'items-end' : 'items-start'}`}>
        {header}
        {children}
      </div>
    </div>
  </div>
);

export default WeChatChatRow;
