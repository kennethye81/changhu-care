import {
  PATIENT_THRESHOLDS,
  getVitalColor,
  VITAL_RANGE_KIND,
  type VitalsThresholds,
} from '../data/vitalSigns';

export type BpHighlightLevel = 'critical' | 'attention';

const DEFAULT_BP_SYS = { green: [110, 140] as [number, number], amber: [140, 160] as [number, number] };
const DEFAULT_BP_DIA = { green: [65, 90] as [number, number], amber: [90, 100] as [number, number] };

function resolveBpThresholds(patientId: number): Pick<VitalsThresholds, 'bpSystolic' | 'bpDiastolic'> {
  const th = PATIENT_THRESHOLDS[patientId]?.thresholds;
  return {
    bpSystolic: th?.bpSystolic ?? DEFAULT_BP_SYS,
    bpDiastolic: th?.bpDiastolic ?? DEFAULT_BP_DIA,
  };
}

function zoneToHighlight(zone: 'green' | 'amber' | 'red'): BpHighlightLevel | undefined {
  if (zone === 'amber') return 'attention';
  if (zone === 'red') return 'critical';
  return undefined;
}

function newsSbpHighlight(newsSbpScore: number): BpHighlightLevel | undefined {
  if (newsSbpScore >= 3) return 'critical';
  if (newsSbpScore >= 1) return 'attention';
  return undefined;
}

function maxHighlight(a?: BpHighlightLevel, b?: BpHighlightLevel): BpHighlightLevel | undefined {
  if (a === 'critical' || b === 'critical') return 'critical';
  if (a === 'attention' || b === 'attention') return 'attention';
  return undefined;
}

/** SBP: NEWS2 acute bands + patient-specific clinical target (ESC/KDIGO/COPD etc.). */
export function assessBpSysHighlight(
  patientId: number,
  bpSystolic: number,
  newsSbpScore: number,
): BpHighlightLevel | undefined {
  const { bpSystolic: th } = resolveBpThresholds(patientId);
  const clinical = zoneToHighlight(
    getVitalColor(bpSystolic, th, VITAL_RANGE_KIND.bpSystolic ?? 'bounded'),
  );
  return maxHighlight(newsSbpHighlight(newsSbpScore), clinical);
}

/** DBP: patient-specific clinical target only (not scored in NEWS2). */
export function assessBpDiaHighlight(
  patientId: number,
  bpDiastolic: number,
): BpHighlightLevel | undefined {
  const { bpDiastolic: th } = resolveBpThresholds(patientId);
  return zoneToHighlight(
    getVitalColor(bpDiastolic, th, VITAL_RANGE_KIND.bpDiastolic ?? 'bounded'),
  );
}

export function buildBpVitalHighlight(
  patientId: number,
  bpSystolic: number,
  bpDiastolic: number,
  newsSbpScore: number,
): { bpSys?: BpHighlightLevel; bpDia?: BpHighlightLevel } {
  const bpSys = assessBpSysHighlight(patientId, bpSystolic, newsSbpScore);
  const bpDia = assessBpDiaHighlight(patientId, bpDiastolic);
  const out: { bpSys?: BpHighlightLevel; bpDia?: BpHighlightLevel } = {};
  if (bpSys) out.bpSys = bpSys;
  if (bpDia) out.bpDia = bpDia;
  return out;
}
