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
  if (/PRN/i.test(freq)) return { schedule: 'As needed (PRN)', freq: freq.replace(/^PRN\s*/i, 'Up to ') };
  if (/IV/i.test(route) || /IV/i.test(freq)) return { schedule: 'Morning', freq: freq };
  if (/BID/i.test(freq)) return { schedule: 'Morning + Evening', freq: freq };
  if (/QD|Once daily|daily/i.test(freq)) return { schedule: 'Morning', freq: 'Once daily' };
  return { schedule: 'Scheduled', freq: freq };
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
    aiSummary: p7Alert
      ? 'Medication adherence: 100% — all scheduled doses confirmed. IV Ceftriaxone 2g initiated for infection. Salbutamol PRN within safe range. Continue Amlodipine for HTN.'
      : `Medication adherence: 100% — ${activeCount} oral medications confirmed taken. IV Ceftriaxone scheduled from Day 2 per CAP protocol. Salbutamol PRN not needed this morning.`,
    refillSummary: p7Alert
      ? 'IV Ceftriaxone supply active. Tiotropium + Amlodipine oral: 14 days remaining. Jenny Tam to coordinate pharmacy if oral switch needed after afebrile period.'
      : 'Tiotropium + Amlodipine oral: 14 days remaining. IV antibiotics start Day 2 — pharmacy delivery confirmed for home visit.',
  };
}
