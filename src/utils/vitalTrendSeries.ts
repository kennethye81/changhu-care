import type { Vitals } from '../store/patientStore';

function roundValue(value: number, decimals = 0): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/** Build a 7-point trend ending at `end`, drifting from `start` (matches current vitals). */
export function buildTrendSeries(start: number, end: number, points = 7, decimals = 0): number[] {
  if (points <= 1) return [roundValue(end, decimals)];
  return Array.from({ length: points }, (_, index) => {
    if (index === points - 1) return roundValue(end, decimals);
    const progress = index / (points - 1);
    const base = start + (end - start) * progress;
    const wobble =
      index > 0 && index < points - 1
        ? Math.sin((index + 1) * 1.7 + start * 0.1 + end * 0.1) * 0.15 * (Math.abs(end - start) || 1)
        : 0;
    return roundValue(base + wobble, decimals);
  });
}

export interface VitalTrendBundle {
  rr: number[];
  hr: number[];
  bpSys: number[];
  bpDia: number[];
  spo2: number[];
  temp: number[];
  glucose: number[];
}

export function buildVitalTrends(vitals: Vitals, p7Alert: boolean, baseline: Vitals): VitalTrendBundle {
  if (p7Alert) {
    return {
      rr: buildTrendSeries(baseline.rr, vitals.rr),
      hr: buildTrendSeries(baseline.hr, vitals.hr),
      bpSys: buildTrendSeries(baseline.bpSystolic, vitals.bpSystolic),
      bpDia: buildTrendSeries(baseline.bpDiastolic, vitals.bpDiastolic),
      spo2: buildTrendSeries(baseline.spo2, vitals.spo2),
      temp: buildTrendSeries(baseline.temp, vitals.temp, 7, 1),
      glucose: buildTrendSeries(baseline.bloodSugar, vitals.bloodSugar),
    };
  }

  return {
    rr: buildTrendSeries(vitals.rr - 1, vitals.rr),
    hr: buildTrendSeries(vitals.hr - 2, vitals.hr),
    bpSys: buildTrendSeries(vitals.bpSystolic - 2, vitals.bpSystolic),
    bpDia: buildTrendSeries(vitals.bpDiastolic - 2, vitals.bpDiastolic),
    spo2: buildTrendSeries(Math.min(100, vitals.spo2 + 1), vitals.spo2),
    temp: buildTrendSeries(vitals.temp - 0.2, vitals.temp, 7, 1),
    glucose: buildTrendSeries(vitals.bloodSugar - 2, vitals.bloodSugar),
  };
}
