import type { Vitals } from '../store/patientStore';
import { NEW_DEFAULT_VITALS } from './newPatients/defaultVitals';
import { normalizeVitals } from '../utils/newsScore';

function v(
  hr: number, sbp: number, dbp: number, spo2: number, temp: number, rr: number,
  bloodSugar = 110, diagnosis = '',
): Vitals {
  return normalizeVitals({ hr, bpSystolic: sbp, bpDiastolic: dbp, spo2, temp, rr, bloodSugar }, diagnosis);
}

/** Canonical default vitals map — kept out of patientStore to avoid import cycles with data patches. */
export const ALL_DEFAULT_VITALS: Record<number, Vitals> = {
  1: v(82, 118, 72, 95, 36.6, 18, 128, 'T2DM'),
  2: v(86, 134, 80, 90, 36.5, 20, 102, 'COPD'),
  3: v(72, 118, 74, 97, 36.8, 16),
  4: v(88, 138, 84, 96, 36.7, 18),
  5: v(78, 136, 82, 97, 36.6, 16),
  6: v(74, 132, 80, 97, 36.5, 15),
  7: v(84, 138, 84, 93, 37.0, 20, 118, 'COPD'),
  ...NEW_DEFAULT_VITALS,
};
