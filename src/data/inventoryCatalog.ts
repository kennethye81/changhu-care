export interface InventoryCatalogItem {
  id: string;
  name: string;
  model: string;
  supplier: string;
  stock: number;
  minStock: number;
  unit: string;
  category: string;
}

export const INVENTORY_DEVICE_CATALOG: InventoryCatalogItem[] = [
  { id: 'DEV-002', name: 'mmWave Radar Mattress', model: 'SenseLife Pro', supplier: 'SenseLife Medical', stock: 8, minStock: 3, unit: 'units', category: 'Sleep Monitor' },
  { id: 'DEV-003', name: 'Blood Pressure Monitor', model: 'Omron HEM-7361T', supplier: 'Omron Healthcare HK', stock: 3, minStock: 5, unit: 'units', category: 'Vital Signs' },
  { id: 'DEV-004', name: 'Pulse Oximeter', model: 'Nonin 3230', supplier: 'Nonin Medical', stock: 7, minStock: 5, unit: 'units', category: 'Vital Signs' },
  { id: 'DEV-005', name: 'Glucometer Kit', model: 'Accu-Chek Guide', supplier: 'Roche Diagnostics HK', stock: 4, minStock: 5, unit: 'kits', category: 'Vital Signs' },
  { id: 'DEV-006', name: 'ECG Patch Monitor', model: 'iRhythm Zio XT', supplier: 'iRhythm Technologies', stock: 1, minStock: 2, unit: 'units', category: 'Cardiac' },
  { id: 'DEV-007', name: 'Wearable ECG Holter', model: 'Philips BioTelemetry', supplier: 'Philips HK', stock: 2, minStock: 2, unit: 'units', category: 'Cardiac' },
  { id: 'DEV-008', name: 'Spirometer', model: 'MIR Spirobank Smart', supplier: 'MIR Medical', stock: 5, minStock: 3, unit: 'units', category: 'Respiratory' },
  { id: 'DEV-010', name: 'Smart Weight Scale', model: 'Withings Body Cardio', supplier: 'Withings HK', stock: 6, minStock: 4, unit: 'units', category: 'Vital Signs' },
];

export const INVENTORY_CONSUMABLES: InventoryCatalogItem[] = [
  { id: 'CON-001', name: 'ECG Electrodes (Pack 50)', model: '3M Red Dot 2660', supplier: '3M HK Ltd', stock: 2, minStock: 5, unit: 'packs', category: 'Electrodes' },
  { id: 'CON-002', name: 'BP Cuff — Adult (Medium)', model: 'Omron CL-24', supplier: 'Omron Healthcare HK', stock: 4, minStock: 5, unit: 'units', category: 'Cuffs' },
  { id: 'CON-003', name: 'SpO₂ Sensor — Finger Clip', model: 'Nonin 8000AA', supplier: 'Nonin Medical', stock: 6, minStock: 5, unit: 'units', category: 'Sensors' },
  { id: 'CON-004', name: 'Lancets (Box 100)', model: 'Accu-Chek Safe-T-Pro', supplier: 'Roche Diagnostics HK', stock: 3, minStock: 5, unit: 'boxes', category: 'Lancets' },
  { id: 'CON-005', name: 'Test Strips (Box 50)', model: 'Accu-Chek Guide', supplier: 'Roche Diagnostics HK', stock: 2, minStock: 5, unit: 'boxes', category: 'Strips' },
  { id: 'CON-006', name: 'Wound Dressing Kit', model: 'Mepilex Border 10×10', supplier: 'Molnlycke HK', stock: 8, minStock: 5, unit: 'kits', category: 'Wound Care' },
  { id: 'CON-007', name: 'Alcohol Swabs (Box 200)', model: 'BD Alcohol Prep', supplier: 'BD Medical HK', stock: 5, minStock: 5, unit: 'boxes', category: 'Disinfectant' },
  { id: 'CON-008', name: 'Nitrile Gloves (Box 100)', model: 'Ansell TouchNTuff M', supplier: 'Ansell Healthcare', stock: 1, minStock: 3, unit: 'boxes', category: 'PPE' },
  { id: 'CON-009', name: 'Sharps Container', model: 'BD 1.4L', supplier: 'BD Medical HK', stock: 4, minStock: 3, unit: 'units', category: 'Safety' },
  { id: 'CON-010', name: 'Inhaler Spacer Device', model: 'AeroChamber Plus', supplier: 'GSK HK', stock: 3, minStock: 3, unit: 'units', category: 'Respiratory' },
];
