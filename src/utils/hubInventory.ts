import type { InventoryCatalogItem } from '../data/inventoryCatalog';
import type { PatientFull } from '../data/patients';

export interface HubInventoryDevice extends InventoryCatalogItem {
  assigned: string;
}

const CATALOG_MATCHERS: { catalogId: string; test: (type: string, model: string) => boolean }[] = [
  { catalogId: 'DEV-002', test: (type) => /mmWave|Mattress|SenseLife/i.test(type) },
  { catalogId: 'DEV-003', test: (type) => /Blood Pressure/i.test(type) },
  { catalogId: 'DEV-004', test: (type) => /Pulse Oximeter/i.test(type) },
  { catalogId: 'DEV-005', test: (type) => /Glucometer/i.test(type) },
  { catalogId: 'DEV-006', test: (type) => /ECG Patch|Zio/i.test(type) },
  { catalogId: 'DEV-007', test: (type) => /Holter|BioTelemetry/i.test(type) },
  { catalogId: 'DEV-008', test: (type) => /Spirometer|Spirobank/i.test(type) },
  { catalogId: 'DEV-010', test: (type) => /Weight Scale|Body Cardio|HN-290/i.test(type) },
];

const FALLBACK_ASSIGNMENTS: Record<string, string> = {
  'DEV-006': '冯存富',
  'DEV-007': 'On-demand',
  'DEV-008': '冯存富',
};

function formatAssignedNames(names: string[], patientCount: number): string {
  if (names.length === 0) return 'Warehouse stock';
  if (names.length === patientCount) return `All ${patientCount} patients`;
  return names.join(', ');
}

export function buildInventoryDevices(
  catalog: InventoryCatalogItem[],
  patients: PatientFull[],
): HubInventoryDevice[] {
  const assignments = new Map<string, Set<string>>();

  patients.forEach(patient => {
    patient.iotDevices.forEach(device => {
      CATALOG_MATCHERS.forEach(({ catalogId, test }) => {
        if (!test(device.type, device.model)) return;
        const set = assignments.get(catalogId) ?? new Set<string>();
        set.add(patient.name);
        assignments.set(catalogId, set);
      });
    });
  });

  return catalog.map(item => {
    const names = [...(assignments.get(item.id) ?? [])].sort();
    const assigned = names.length > 0
      ? formatAssignedNames(names, patients.length)
      : (FALLBACK_ASSIGNMENTS[item.id] ?? 'Warehouse stock');
    return { ...item, assigned };
  });
}

export function countLowStock(items: InventoryCatalogItem[]): number {
  return items.filter(item => item.stock < item.minStock).length;
}

export function countUniqueSuppliers(...groups: InventoryCatalogItem[][]): number {
  return new Set(groups.flat().map(item => item.supplier)).size;
}
