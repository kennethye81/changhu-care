import { useEffect, useState } from 'react';
import { WECHAT_CHAT_MOTION } from '../theme/wechatChatMotion';

interface WeChatChatRevealOptions {
  /** ms between each historical message */
  intervalMs?: number;
  /** delay before the first bubble */
  initialDelayMs?: number;
}

/**
 * Reveal chat messages one-by-one (WeChat-style stagger).
 * Resets when `resetKey` changes (thread / patient switch).
 */
export function useWeChatChatReveal(
  messageCount: number,
  resetKey: string | number | null | undefined,
  options: WeChatChatRevealOptions = {},
): number {
  const {
    intervalMs = WECHAT_CHAT_MOTION.intervalMs,
    initialDelayMs = WECHAT_CHAT_MOTION.initialDelayMs,
  } = options;
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
  }, [resetKey]);

  useEffect(() => {
    if (messageCount <= 0) {
      setVisibleCount(0);
      return;
    }
    if (visibleCount >= messageCount) return;

    const delay = visibleCount === 0 ? initialDelayMs : intervalMs;
    const timer = window.setTimeout(() => {
      setVisibleCount(c => Math.min(c + 1, messageCount));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [messageCount, visibleCount, resetKey, intervalMs, initialDelayMs]);

  return visibleCount;
}
