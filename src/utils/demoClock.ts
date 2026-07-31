import { DEMO_CARE_PLAN_DATE } from './carePlanSync';

/** Demo "now": fixed calendar date + live clock time (date never drifts to real today). */
export function getDemoNow(): Date {
  const live = new Date();
  const demo = new Date(`${DEMO_CARE_PLAN_DATE}T12:00:00`);
  demo.setHours(live.getHours(), live.getMinutes(), live.getSeconds(), 0);
  return demo;
}

export function getDemoClockTime(): string {
  const d = getDemoNow();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function getDemoTimeString(): string {
  return getDemoNow().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function getDemoTimestamp(): number {
  return getDemoNow().getTime();
}
