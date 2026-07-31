import type { CollaborationSyncSlice } from '../store/collaborationStore';
import type { DeviceStatus, Vitals } from '../store/patientStore';
import type { PatientFull } from '../data/patients';

export const DEMO_SYNC_VERSION = 3;
export const DEMO_SYNC_CHANNEL = 'ihomecare-demo-sync';
export const DEMO_SYNC_STORAGE_KEY = 'ihomecare-demo-sync-state';

export interface DemoSyncPayload extends CollaborationSyncSlice {
  v: typeof DEMO_SYNC_VERSION;
  ts: number;
  p7AlertActive: boolean;
  vitals: Record<number, Vitals>;
  resolvedAlertIds: string[];
  iotDevicesByPatient?: Record<number, PatientFull['iotDevices']>;
  deviceStatuses?: Record<string, DeviceStatus>;
}

export interface DemoSyncMessage {
  type: 'sync';
  payload: DemoSyncPayload;
}

export function snapshotDemoSync(payload: Pick<DemoSyncPayload, 'p7AlertActive' | 'vitals' | keyof CollaborationSyncSlice>): string {
  return JSON.stringify(payload);
}

export function buildDemoSyncPayload(
  patient: {
    p7AlertActive: boolean;
    vitals: Record<number, Vitals>;
    resolvedAlertIds: string[];
    patients?: PatientFull[];
    deviceStatuses?: Record<string, DeviceStatus>;
  },
  collaboration: CollaborationSyncSlice,
  ts = Date.now(),
): DemoSyncPayload {
  const iotDevicesByPatient: Record<number, PatientFull['iotDevices']> = {};
  (patient.patients ?? []).forEach(p => {
    iotDevicesByPatient[p.id] = p.iotDevices;
  });
  return {
    v: DEMO_SYNC_VERSION,
    ts,
    p7AlertActive: patient.p7AlertActive,
    vitals: patient.vitals,
    resolvedAlertIds: patient.resolvedAlertIds,
    iotDevicesByPatient,
    deviceStatuses: patient.deviceStatuses,
    messagesByPatient: collaboration.messagesByPatient,
    eliteTaskTimes: collaboration.eliteTaskTimes,
    eliteCareLogs: collaboration.eliteCareLogs,
    eliteVoiceText: collaboration.eliteVoiceText,
    carePlanStatus: collaboration.carePlanStatus,
    submittedCareLogs: collaboration.submittedCareLogs,
    readUpToByPatient: collaboration.readUpToByPatient,
    demoMapVisitsByPatient: collaboration.demoMapVisitsByPatient,
  };
}

export function isDemoSyncPayload(value: unknown): value is DemoSyncPayload {
  if (!value || typeof value !== 'object') return false;
  const p = value as DemoSyncPayload;
  return (
    (p.v === 3 || p.v === 2 || p.v === 1) &&
    typeof p.p7AlertActive === 'boolean' &&
    typeof p.vitals === 'object'
  );
}

export function normalizeDemoSyncPayload(value: DemoSyncPayload): DemoSyncPayload {
  const normalized = value.v === 2 && value.messagesByPatient ? value : {
    v: DEMO_SYNC_VERSION,
    ts: value.ts || Date.now(),
    p7AlertActive: value.p7AlertActive,
    vitals: value.vitals,
    resolvedAlertIds: value.resolvedAlertIds || [],
    messagesByPatient: value.messagesByPatient || {},
    eliteTaskTimes: value.eliteTaskTimes || {},
    eliteCareLogs: value.eliteCareLogs || {},
    eliteVoiceText: value.eliteVoiceText || {},
    carePlanStatus: value.carePlanStatus || {},
    submittedCareLogs: value.submittedCareLogs || {},
    readUpToByPatient: value.readUpToByPatient || {},
    demoMapVisitsByPatient: value.demoMapVisitsByPatient || {},
  };
  return {
    ...normalized,
    submittedCareLogs: normalized.submittedCareLogs || {},
    readUpToByPatient: normalized.readUpToByPatient || {},
    demoMapVisitsByPatient: normalized.demoMapVisitsByPatient || {},
  };
}
