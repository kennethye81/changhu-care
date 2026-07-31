import type { FC } from 'react';
import {
  ASSESSMENT_FILL_DURATION_MS,
  ASSESSMENT_FILL_MAX,
  ASSESSMENT_FILL_TIMING,
} from '../hooks/useEliteFormFillAnimation';

interface Props {
  text: string;
  wrap?: boolean;
  fillDurationMs?: number;
  fillMax?: number;
}

/** One row per step — left-to-right reveal within the fill window */
const TypingReveal: FC<Props> = ({
  text,
  wrap,
  fillDurationMs = ASSESSMENT_FILL_TIMING.fillDurationMs,
  fillMax = ASSESSMENT_FILL_MAX,
}) => {
  const stepMs = fillDurationMs / fillMax;
  const durationSec = Math.min((wrap ? stepMs * 2.4 : stepMs * 0.88) / 1000, 0.14);
  const charSteps = Math.max(Math.min(text.length, 40), 8);
  const cls = wrap ? 'typing-wrap typing-ltr' : 'typing typing-ltr';

  return (
    <span
      className={cls}
      style={{
        animationDuration: `${durationSec}s`,
        animationTimingFunction: `steps(${charSteps}, end)`,
      }}
    >
      {text}
    </span>
  );
};

export default TypingReveal;
