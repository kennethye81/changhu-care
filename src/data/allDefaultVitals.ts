import type { Vitals } from '../store/patientStore';
import { normalizeVitals } from '../utils/newsScore';

function v(
  hr: number, sbp: number, dbp: number, spo2: number, temp: number, rr: number,
  bloodSugar = 110, diagnosis = '',
): Vitals {
  return normalizeVitals({ hr, bpSystolic: sbp, bpDiastolic: dbp, spo2, temp, rr, bloodSugar }, diagnosis);
}

/** Canonical default vitals — 长护险 patients */
export const ALL_DEFAULT_VITALS: Record<number, Vitals> = {
  1: v(78, 160, 82, 96, 36.7, 17, 105, '高血压'),
};
