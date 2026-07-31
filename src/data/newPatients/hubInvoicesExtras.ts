import { type HubInvoiceTemplate } from '../hubInvoices';

export const NEW_HUB_INVOICE_TEMPLATES: HubInvoiceTemplate[] = [
  {
    id: 'INV-2026-0152', patientId: 8, total: 3800, status: 'Paid',
    items: [
      { desc: 'Post-PCI Cardiac RPM Package (14-day)', amount: 2400 },
      { desc: 'Nurse Visit ×6 + ECG Remote Monitoring', amount: 900 },
      { desc: 'Cardiac Rehab Phase 2 (×2 sessions)', amount: 500 },
    ],
  },
  {
    id: 'INV-2026-0151', patientId: 9, total: 3200, status: 'Partial',
    items: [
      { desc: 'COPD GOLD 3 Home O₂ + Nurse Package', amount: 2200 },
      { desc: 'Pulmonary Rehab + Fall Prevention OT', amount: 1000 },
    ],
  },
  {
    id: 'INV-2026-0150', patientId: 10, total: 4500, status: 'Unpaid',
    items: [
      { desc: 'Post-Stroke HaH Package (PT/OT/ST)', amount: 3200 },
      { desc: 'NIHSS Monitoring + Nurse ×8', amount: 1300 },
    ],
  },
  {
    id: 'INV-2026-0149', patientId: 11, total: 3600, status: 'Paid',
    items: [
      { desc: 'Post-lumpectomy Wound Care Package', amount: 2400 },
      { desc: 'Oncology Nurse Weekly ×2 + Drain Mgmt', amount: 1200 },
    ],
  },
  {
    id: 'INV-2026-0148', patientId: 12, total: 4800, status: 'Partial',
    items: [
      { desc: 'HF NYHA III Daily Weight + GDMT Package', amount: 3200 },
      { desc: 'HF Nurse ×10 + Telehealth Monitoring', amount: 1600 },
    ],
  },
  {
    id: 'INV-2026-0147', patientId: 13, total: 3400, status: 'Paid',
    items: [
      { desc: 'T2DM Basal-Bolus + DM Educator Package', amount: 2200 },
      { desc: 'SMBG Kit + Podiatry + Renal Dietitian', amount: 1200 },
    ],
  },
  {
    id: 'INV-2026-0146', patientId: 14, total: 3900, status: 'Unpaid',
    items: [
      { desc: 'CKD Stage 4 Renal Home Care Package', amount: 2600 },
      { desc: 'ESA Injection Training + Monthly Nephrology', amount: 1300 },
    ],
  },
  {
    id: 'INV-2026-0145', patientId: 15, total: 2800, status: 'Paid',
    items: [
      { desc: 'Resistant HTN + CPAP Compliance Package', amount: 1800 },
      { desc: '24h ABPM + Weekly BP Nurse Visits', amount: 1000 },
    ],
  },
  {
    id: 'INV-2026-0144', patientId: 16, total: 4200, status: 'Partial',
    items: [
      { desc: 'Post-ORIF Hip Fracture Rehab Package', amount: 2800 },
      { desc: 'PT ×6 + Care Worker ADL Support ×6', amount: 1400 },
    ],
  },
  {
    id: 'INV-2026-0143', patientId: 17, total: 3100, status: 'Paid',
    items: [
      { desc: 'CAP + COPD GOLD 2 HaH Package (10-day)', amount: 2200 },
      { desc: 'Respiratory Nurse ×4 + Incentive Spirometry', amount: 900 },
    ],
  },
];
