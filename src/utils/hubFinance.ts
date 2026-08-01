import { HUB_INVOICE_TEMPLATES, type HubInvoiceTemplate, type InvoiceStatus } from '../data/hubInvoices';
import type { PatientFull } from '../data/patients';

export interface HubFinanceInvoice extends HubInvoiceTemplate {
  patient: string;
}

export function buildFinanceInvoices(
  patients: PatientFull[],
  alertActive: boolean,
): HubFinanceInvoice[] {
  return HUB_INVOICE_TEMPLATES.map((template) => {
    const patient = patients.find(p => p.id === template.patientId);
    let status: InvoiceStatus = template.status;
    if (template.patientId === 1 && alertActive) {
      status = 'Unpaid';
    }
    return {
      ...template,
      status,
      patient: patient?.name ?? `Patient ${template.patientId}`,
    };
  });
}

export function summarizeFinance(invoices: HubFinanceInvoice[], patientCount: number) {
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const outstanding = invoices.filter(inv => inv.status !== 'Paid').reduce((sum, inv) => sum + inv.total, 0);
  const paidCount = invoices.filter(inv => inv.status === 'Paid').length;
  const avgPerPatient = patientCount > 0 ? Math.round(totalRevenue / patientCount) : 0;
  return { totalRevenue, outstanding, paidCount, avgPerPatient };
}
