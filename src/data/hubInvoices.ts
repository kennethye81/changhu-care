export type InvoiceStatus = 'Paid' | 'Partial' | 'Unpaid';

import { NEW_HUB_INVOICE_TEMPLATES } from './newPatients/hubInvoicesExtras';

export interface HubInvoiceTemplate {
  id: string;
  patientId: number;
  total: number;
  status: InvoiceStatus;
  items: { desc: string; amount: number }[];
}

export const HUB_INVOICE_TEMPLATES: HubInvoiceTemplate[] = [
  {
    id: 'INV-2026-0142',
    patientId: 1,
    total: 4200,
    status: 'Paid',
    items: [
      { desc: 'HF NYHA III Home Care Package (7-day)', amount: 2800 },
      { desc: 'IV Diuresis Monitoring + Nurse Visit (x3)', amount: 900 },
      { desc: 'Remote Monitoring (Monthly)', amount: 500 },
    ],
  },
  {
    id: 'INV-2026-0141',
    patientId: 2,
    total: 2900,
    status: 'Partial',
    items: [
      { desc: 'COPD GOLD 3 Home Care Package', amount: 2000 },
      { desc: 'Pulmonary Rehab Session (x2)', amount: 900 },
    ],
  },
  {
    id: 'INV-2026-0140',
    patientId: 3,
    total: 3100,
    status: 'Unpaid',
    items: [
      { desc: 'CAP HaH Package (7-day oral Levofloxacin)', amount: 2200 },
      { desc: 'Teleconsult + SpO₂ Monitoring', amount: 900 },
    ],
  },
  {
    id: 'INV-2026-0139',
    patientId: 4,
    total: 3600,
    status: 'Paid',
    items: [
      { desc: 'Complicated UTI + CKD Care Package', amount: 2400 },
      { desc: 'IV Antibiotic Home Visit (x2)', amount: 800 },
      { desc: 'Renal Panel Monitoring', amount: 400 },
    ],
  },
  {
    id: 'INV-2026-0138',
    patientId: 5,
    total: 3400,
    status: 'Paid',
    items: [
      { desc: 'Cellulitis IV Home Care Package', amount: 2600 },
      { desc: 'Wound Imaging + Nurse Visit (x2)', amount: 800 },
    ],
  },
  {
    id: 'INV-2026-0137',
    patientId: 6,
    total: 2800,
    status: 'Paid',
    items: [
      { desc: 'DVT Anticoagulation Home Care', amount: 1800 },
      { desc: 'INR POCT Monitoring (x4)', amount: 1000 },
    ],
  },
  {
    id: 'INV-2026-0136',
    patientId: 7,
    total: 4200,
    status: 'Partial',
    items: [
      { desc: 'COPD + CAP HaH Package (7-day BID RN)', amount: 3200 },
      { desc: 'Pulmonary Rehab PT (x4)', amount: 1000 },
    ],
  },
  ...NEW_HUB_INVOICE_TEMPLATES,
];
