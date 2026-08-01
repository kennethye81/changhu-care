import type { PatientFull } from '../data/patients';

export interface FamilyMedRow {
  name: string;
  dose: string;
  schedule: string;
  freq: string;
  purpose: string;
  adherence: string;
  adherent: boolean;
}

function formatMedName(drug: string): string {
  const match = drug.match(/^(.+?)\s*[—–-]\s*/);
  return match ? match[1].trim() : drug;
}

function mapFrequency(freq: string, route: string): { schedule: string; freq: string } {
  if (/PRN/i.test(freq)) return { schedule: '必要时', freq: freq.replace(/^PRN\s*/i, 'Up to ') };
  if (/IV/i.test(route) || /IV/i.test(freq)) return { schedule: '早晨', freq: freq };
  if (/BID/i.test(freq)) return { schedule: '早+晚', freq: freq };
  if (/QD|Once daily|daily/i.test(freq)) return { schedule: '早晨', freq: '每日一次' };
  return { schedule: '按时', freq: freq };
}

export function getFamilyMedications(patient: PatientFull | undefined, alertActive: boolean): FamilyMedRow[] {
  if (!patient) return [];

  return patient.medications
    .filter(med => {
      if (med.status !== 'Active') return false;
      if (/Ceftriaxone/i.test(med.drug) && !alertActive) {
        const enrollmentDate = patient.nursingRecords?.[patient.nursingRecords.length - 1]?.date;
        if (enrollmentDate && med.startDate > enrollmentDate) return false;
      }
      return true;
    })
    .map(med => {
      const { schedule, freq } = mapFrequency(med.frequency, med.route);
      return {
        name: formatMedName(med.drug),
        dose: med.dose,
        schedule,
        freq,
        purpose: med.purpose,
        adherence: '✓ Taken',
        adherent: true,
      };
    });
}

export function getFamilyMedSummary(patient: PatientFull | undefined, alertActive: boolean) {
  const meds = getFamilyMedications(patient, alertActive);
  const activeCount = meds.length;
  return {
    activeCount,
    missedCount: 0,
    adherencePct: 100,
    aiSummary: alertActive
      ? '降压药每日一次确认服用。血压145/88 mmHg（脑出血术后，降压方案待心内科确认）。家属负责用药监督，依从性良好。右下肢DVT — 避免挤压，持续观察。'
      : `Medication adherence: 100% — ${activeCount} oral medications confirmed taken. IV Ceftriaxone scheduled from Day 2 per CAP protocol. Salbutamol PRN not needed this morning.`,
    refillSummary: alertActive
      ? '降压药口服: 30天库存。社区药房定期配送。家属可联系护士刘敏咨询用药调整。'
      : '降压药口服: 30天库存。药房配送已确认。',
  };
}
