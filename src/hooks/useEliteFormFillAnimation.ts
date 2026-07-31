import { useEffect, useRef, useState } from 'react';

/** Highest field index in PendingRegistrationAssessmentForm */
export const ASSESSMENT_FILL_MAX = 60;

/** Highest field index in PendingRegistrationCarePlanForm */
export const CARE_PLAN_FILL_MAX = 60;

export type EliteFormFillTiming = {
  /** Wait after page open before fill begins */
  delayMs: number;
  /** Fill duration once started — scroll ends at the same moment */
  fillDurationMs: number;
  /** Scroll starts this many ms after page open */
  scrollStartMs: number;
};

/** IA: 1s wait → 8s fill; scroll at 1.5s from page open; both finish at 9s */
export const ASSESSMENT_FILL_TIMING: EliteFormFillTiming = {
  delayMs: 1000,
  fillDurationMs: 8000,
  scrollStartMs: 1500,
};

/** CP: 1s wait → 8s fill; scroll at 1.5s from page open; both finish at 9s */
export const CARE_PLAN_FILL_TIMING: EliteFormFillTiming = {
  delayMs: 1000,
  fillDurationMs: 8000,
  scrollStartMs: 1500,
};

/** @deprecated use ASSESSMENT_FILL_TIMING.delayMs */
export const ASSESSMENT_FILL_DELAY_MS = ASSESSMENT_FILL_TIMING.delayMs;
/** @deprecated use ASSESSMENT_FILL_TIMING.fillDurationMs */
export const ASSESSMENT_FILL_DURATION_MS = ASSESSMENT_FILL_TIMING.fillDurationMs;

/** Map fill progress to scroll progress once scroll has started */
export function fillRatioToScrollRatio(
  fillRatio: number,
  scrollStartMs: number,
  delayMs: number,
  fillDurationMs: number,
): number {
  const fillAtScrollStart = Math.max(0, (scrollStartMs - delayMs) / fillDurationMs);
  if (fillRatio <= fillAtScrollStart) return 0;
  return (fillRatio - fillAtScrollStart) / (1 - fillAtScrollStart);
}

export function useEliteFormFillAnimation(
  maxStep = ASSESSMENT_FILL_MAX,
  enabled = true,
  timing: EliteFormFillTiming = ASSESSMENT_FILL_TIMING,
) {
  const [fillStep, setFillStep] = useState(enabled ? -1 : maxStep);
  const [fillProgress, setFillProgress] = useState(0);
  const [scrollComplete, setScrollComplete] = useState(!enabled);
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const { delayMs, fillDurationMs, scrollStartMs } = timing;

  useEffect(() => {
    if (!enabled) {
      setFillStep(maxStep);
      setFillProgress(1);
      setScrollComplete(true);
      return;
    }

    setFillStep(-1);
    setFillProgress(0);
    setScrollComplete(false);
    const pageStart = performance.now();

    const tick = (now: number) => {
      const elapsed = now - pageStart;

      if (elapsed < delayMs) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const animElapsed = elapsed - delayMs;
      const fillRatio = Math.min(animElapsed / fillDurationMs, 1);
      const scrollRatio = fillRatioToScrollRatio(fillRatio, scrollStartMs, delayMs, fillDurationMs);
      const step = fillRatio >= 1 ? maxStep : Math.floor(fillRatio * maxStep);

      setFillProgress(fillRatio);
      setFillStep(step);

      const el = scrollRef.current;
      if (el) {
        const maxScroll = el.scrollHeight - el.clientHeight;
        if (maxScroll > 0) {
          el.scrollTop = maxScroll * scrollRatio;
        }
      }

      if (fillRatio >= 1) {
        setScrollComplete(true);
        setFillStep(maxStep);
        setFillProgress(1);
        if (el) {
          const maxScroll = el.scrollHeight - el.clientHeight;
          if (maxScroll > 0) el.scrollTop = maxScroll;
        }
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [enabled, maxStep, delayMs, fillDurationMs, scrollStartMs]);

  const waiting = enabled && fillStep < 0;
  const fillComplete = !enabled || fillStep >= maxStep;
  const filling = enabled && fillStep >= 0 && !fillComplete;

  return { fillStep, fillProgress, scrollRef, fillComplete, scrollComplete, filling, waiting };
}
