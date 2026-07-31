import type { PatientFull } from './patients';

export type IotDevice = PatientFull['iotDevices'][number];

type DeviceTemplate = Omit<IotDevice, 'serial' | 'status' | 'battery' | 'lastSync'>;

const CORE_NEWS: DeviceTemplate[] = [
  {
    type: 'Blood Pressure Monitor',
    model: 'Omron HEM-7361T',
    parameters: ['Systolic BP (NEWS)', 'Diastolic BP', 'Pulse Rate (NEWS)', 'Irregular HB Detection'],
  },
  {
    type: 'Pulse Oximeter',
    model: 'Nonin Bluetooth 3230',
    parameters: ['SpO₂ (NEWS Scale 1/2)', 'HR (NEWS)', 'Perfusion Index'],
  },
  {
    type: 'Infrared Thermometer',
    model: 'Braun BNT400 Bluetooth',
    parameters: ['Temperature (NEWS)', 'Trend'],
  },
  {
    type: 'mmWave Radar Mattress',
    model: 'SenseLife Pro',
    parameters: ['Respiratory Rate (NEWS)', 'Sleep Duration', 'Bed Exit Alerts', 'HR Variability'],
  },
];

const GLUCOSE: DeviceTemplate = {
  type: 'Glucometer',
  model: 'Accu-Chek Guide',
  parameters: ['Blood Glucose (alert-only — excluded from NEWS)', 'Trend', '7-Day Average'],
};

const O2_CONCENTRATOR: DeviceTemplate = {
  type: 'O₂ Concentrator',
  model: 'Philips EverFlo',
  parameters: ['Flow Rate (L/min)', 'Supplemental O₂ (NEWS +2 if active)', 'SpO₂ Feedback'],
};

const INFUSION_PUMP: DeviceTemplate = {
  type: 'Smart IV Infusion Pump',
  model: 'Baxter Sigma Spectrum IQ',
  parameters: ['Infusion Rate (mL/h)', 'Volume Delivered', 'Air-in-Line Detection', 'Occlusion Alarm', 'Dose Error Reduction'],
};

function needsGlucose(diagnosis: string): boolean {
  const d = diagnosis.toLowerCase();
  return d.includes('t2dm') || d.includes('type 2 dm') || d.includes('diabetes') || d.includes('dka');
}

function needsO2(patient: PatientFull): boolean {
  const d = patient.diagnosis.toLowerCase();
  const hasHypoxaemia = d.includes('hypoxaemia') || d.includes('hypoxemia');
  const onOxygen = patient.medications.some(
    m => m.status === 'Active' && /oxygen/i.test(m.drug),
  );
  return hasHypoxaemia || onOxygen;
}

function needsInfusion(patient: PatientFull): boolean {
  return patient.medications.some(
    m => m.status === 'Active' && m.route.toLowerCase().includes('iv'),
  );
}

function serialFor(patientId: number, type: string, index: number): string {
  const prefix = type.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase() || 'DEV';
  return `${prefix}-2026-${String(patientId).padStart(2, '0')}${String(index).padStart(2, '0')}`;
}

function mergeParameters(existing: string[], required: string[]): string[] {
  const out = [...existing];
  for (const p of required) {
    const key = p.split('(')[0].trim().toLowerCase();
    if (!out.some(x => x.toLowerCase().includes(key.slice(0, 8)))) {
      out.push(p);
    }
  }
  return out;
}

function findByType(devices: IotDevice[], type: string): IotDevice | undefined {
  return devices.find(d => d.type === type);
}

/** Ensure every HaH patient has NEWS2-monitoring IoT coverage; preserve condition-specific devices. */
export function ensureNewsIotDevices(patient: PatientFull): IotDevice[] {
  const required: DeviceTemplate[] = [...CORE_NEWS];
  if (needsGlucose(patient.diagnosis)) required.push(GLUCOSE);
  if (needsO2(patient)) required.push(O2_CONCENTRATOR);
  if (needsInfusion(patient)) required.push(INFUSION_PUMP);

  const usedSerials = new Set<string>();
  const result: IotDevice[] = [];
  let idx = 0;

  for (const tmpl of required) {
    const existing = findByType(patient.iotDevices, tmpl.type);
    if (existing) {
      usedSerials.add(existing.serial);
      result.push({
        ...existing,
        model: tmpl.model,
        parameters: mergeParameters(existing.parameters, tmpl.parameters),
      });
    } else {
      idx += 1;
      result.push({
        ...tmpl,
        serial: serialFor(patient.id, tmpl.type, idx),
        status: 'Connected',
        battery: 88,
        lastSync: '30 sec ago',
      });
    }
  }

  for (const d of patient.iotDevices) {
    if (usedSerials.has(d.serial)) continue;
    if (required.some(t => t.type === d.type)) continue;
    result.push(d);
  }

  if (patient.id === 7) {
    return result.map(d =>
      d.type === 'O₂ Concentrator' && d.status !== 'Connected'
        ? { ...d, status: 'Standby' as const, lastSync: '5 min ago' }
        : d,
    );
  }

  return result;
}

export function enrichAllPatientDevices(patients: PatientFull[]): PatientFull[] {
  return patients.map(p => ({
    ...p,
    iotDevices: ensureNewsIotDevices(p),
  }));
}
