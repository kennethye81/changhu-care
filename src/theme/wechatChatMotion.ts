/** WeChat iOS–style chat reveal timing (shared across Hub / Family / Elite). */
export const WECHAT_CHAT_MOTION = {
  /** ms before the first bubble appears */
  initialDelayMs: 650,
  /** ms between each historical message */
  intervalMs: 480,
  /** single-bubble CSS duration — keep in sync with index.css */
  bubbleDurationMs: 520,
} as const;
