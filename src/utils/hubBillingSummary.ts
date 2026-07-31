import { HUB_INVOICE_TEMPLATES, type InvoiceStatus } from '../data/hubInvoices';
import type { PatientFull } from '../data/patients';

export function generateBillingSummary(patient: PatientFull, p7Alert = false): string {
  const template = HUB_INVOICE_TEMPLATES.find(t => t.patientId === patient.id);
  if (!template) return 'No billing records on file for this patient.';

  const status = effectiveInvoiceStatus(patient.id, template.status, p7Alert);
  const amount = `HK$${template.total.toLocaleString()}`;

  if (status === 'Paid') {
    return `All invoices paid. Latest ${template.id} (${amount}) settled on schedule. Billing cycle running normally.`;
  }
  if (status === 'Partial') {
    return `Partial payment on ${template.id} (${amount}). Balance outstanding — recommend gentle follow-up with family. No service disruption planned.`;
  }
  if (patient.id === 3) {
    return `Outstanding ${template.id} (${amount}) — CAP HaH package. Oral Levofloxacin course in progress. Payment reminder recommended; payment plans available.`;
  }
  if (patient.id === 7) {
    return `Outstanding ${template.id} (${amount}) — COPD+CAP HaH escalation billing pending. P7 alert active; finance review recommended within 24h.`;
  }
  return `Outstanding invoice ${template.id} (${amount}). Payment follow-up needed.`;
}

export function effectiveInvoiceStatus(patientId: number, base: InvoiceStatus, p7Alert: boolean): InvoiceStatus {
  if (patientId === 7 && p7Alert) return 'Unpaid';
  return base;
}

export interface PatientBillingRow {
  date: string;
  service: string;
  amount: string;
  status: InvoiceStatus;
}

const PROFILE_BILLING_DATES = ['2026-06-18', '2026-06-15', '2026-06-12', '2026-06-10'];

export function buildPatientBillingRows(patientId: number, p7Alert = false): PatientBillingRow[] {
  const template = HUB_INVOICE_TEMPLATES.find(t => t.patientId === patientId);
  if (!template) return [];

  const status = effectiveInvoiceStatus(patientId, template.status, p7Alert);
  return template.items.map((item, index) => ({
    date: PROFILE_BILLING_DATES[index] ?? '2026-06-18',
    service: item.desc,
    amount: item.amount.toLocaleString(),
    status,
  }));
}

export function getPatientInvoiceMeta(patientId: number, p7Alert = false) {
  const template = HUB_INVOICE_TEMPLATES.find(t => t.patientId === patientId);
  if (!template) return null;
  return {
    id: template.id,
    total: template.total,
    status: effectiveInvoiceStatus(patientId, template.status, p7Alert),
  };
}
