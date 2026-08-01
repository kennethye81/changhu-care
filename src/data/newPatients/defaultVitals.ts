// === 长护险 默认体征 — 仅患者1(沈国栋) ===
import type { Vitals } from '../../store/patientStore';

export const NEW_DEFAULT_VITALS: Record<number, Vitals> = {
  // 患者1 沈国栋 — 高血压+压疮+极高跌倒风险
  1: {
    hr: 78, bpSystolic: 160, bpDiastolic: 82, spo2: 96,
    temp: 36.7, rr: 17, bloodSugar: 105,
    avpu: 'A', onSupplementalO2: false, spo2Scale: 1,
  },
};
