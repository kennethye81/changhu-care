// === GSAP Animation Hooks for iHomeCare ===
// Lightweight integration — use for stat counters, page transitions, card entrances.

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/* ─── Animate number from 0 to target (for stat cards) ─── */

export function useCountUp(ref: React.RefObject<HTMLSpanElement | null>, target: number, duration = 1.2) {
  useEffect(() => {
    if (!ref.current) return;
    const el = { value: 0 };
    gsap.to(el, {
      value: target,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        if (ref.current) ref.current.textContent = Math.round(el.value).toString();
      },
    });
  }, [target, duration, ref]);
}

/* ─── Stagger entrance animation for cards ─── */

export function useStaggerEntrance(ref: React.RefObject<HTMLDivElement | null>, stagger = 0.06) {
  useEffect(() => {
    if (!ref.current) return;
    const cards = ref.current.querySelectorAll('.stagger-item');
    if (cards.length === 0) return;
    gsap.fromTo(cards,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger, ease: 'power2.out' }
    );
  }, [ref, stagger]);
}

/* ─── Pulse attention effect ─── */

export function useAttentionPulse(ref: React.RefObject<HTMLDivElement | null>, active: boolean) {
  useEffect(() => {
    if (!ref.current) return;
    if (active) {
      gsap.to(ref.current, {
        scale: 1.03,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    } else {
      gsap.killTweensOf(ref.current);
      gsap.to(ref.current, { scale: 1, duration: 0.3 });
    }
  }, [active, ref]);
}

/* ─── Fade in on mount ─── */

export function useFadeIn(ref: React.RefObject<HTMLDivElement | null>, delay = 0) {
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, delay, ease: 'power2.out' });
  }, [delay, ref]);
}

/* ─── Animated number display hook — returns ref ─── */

export function useCountUpRef(target: number, duration = 1.2) {
  const ref = useRef<HTMLSpanElement>(null);
  useCountUp(ref, target, duration);
  return ref;
}
