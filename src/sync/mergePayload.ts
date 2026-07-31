import type { ChatMessage } from '../data/chatMessages';
import type { FollowupLogEntry } from '../data/carePlans';
import type { CollaborationSyncSlice } from '../store/collaborationStore';
import type { DeviceStatus, Vitals } from '../store/patientStore';
import type { PatientFull } from '../data/patients';
import type { DemoSyncPayload } from './types';
import type { DemoMapVisitSeed } from '../utils/demoMapVisitAssignments';

const P7_ALERT_IDS = [7001, 7002, 7003, 7004, 7005];
const P7_DAY1_IDS = [7101, 7102, 7103, 7104, 7105];

function isP7Template(message: ChatMessage): boolean {
  return P7_ALERT_IDS.includes(message.id) || P7_DAY1_IDS.includes(message.id);
}

export function mergeMessageThreads(a: ChatMessage[], b: ChatMessage[]): ChatMessage[] {
  const byId = new Map<number, ChatMessage>();
  for (const message of [...a, ...b]) byId.set(message.id, message);
  return [...byId.values()].sort((x, y) => x.id - y.id);
}

function mergeP7Messages(local: ChatMessage[], remote: ChatMessage[], p7AlertActive: boolean): ChatMessage[] {
  const templateOrder = p7AlertActive ? P7_ALERT_IDS : P7_DAY1_IDS;
  const templateIdSet = new Set(templateOrder);
  const byId = new Map<number, ChatMessage>();
  for (const message of [...local, ...remote]) {
    if (!isP7Template(message) || templateIdSet.has(message.id)) {
      byId.set(message.id, message);
    }
  }
  const base = templateOrder
    .map(id => byId.get(id))
    .filter((message): message is ChatMessage => Boolean(message));
  const custom = [...byId.values()]
    .filter(message => !templateIdSet.has(message.id))
    .sort((a, b) => a.id - b.id);
  return [...base, ...custom];
}

export function mergeMessagesByPatient(
  local: Record<number, ChatMessage[]>,
  remote: Record<number, ChatMessage[]>,
  p7AlertActive: boolean,
): Record<number, ChatMessage[]> {
  const patientIds = new Set([
    ...Object.keys(local).map(Number),
    ...Object.keys(remote).map(Number),
  ]);
  const merged: Record<number, ChatMessage[]> = {};
  patientIds.forEach(patientId => {
    const a = local[patientId] || [];
    const b = remote[patientId] || [];
    merged[patientId] = patientId === 7
      ? mergeP7Messages(a, b, p7AlertActive)
      : mergeMessageThreads(a, b);
  });
  return merged;
}

function careLogKey(log: FollowupLogEntry): string {
  return `${log.date}|${log.time}|${log.type}|${log.author}|${log.detail}`;
}

export function mergeSubmittedCareLogs(
  local: Record<number, FollowupLogEntry[]>,
  remote: Record<number, FollowupLogEntry[]>,
): Record<number, FollowupLogEntry[]> {
  const patientIds = new Set([
    ...Object.keys(local || {}).map(Number),
    ...Object.keys(remote || {}).map(Number),
  ]);
  const merged: Record<number, FollowupLogEntry[]> = {};
  patientIds.forEach(patientId => {
    const byKey = new Map<string, FollowupLogEntry>();
    [...(local?.[patientId] || []), ...(remote?.[patientId] || [])].forEach(log => {
      byKey.set(careLogKey(log), log);
    });
    merged[patientId] = [...byKey.values()].sort((a, b) =>
      `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
    );
  });
  return merged;
}

function mergeReadUpToByPatient(
  local: Record<number, number>,
  remote: Record<number, number>,
): Record<number, number> {
  const patientIds = new Set([
    ...Object.keys(local || {}).map(Number),
    ...Object.keys(remote || {}).map(Number),
  ]);
  const merged: Record<number, number> = {};
  patientIds.forEach(patientId => {
    merged[patientId] = Math.max(local?.[patientId] ?? 0, remote?.[patientId] ?? 0);
  });
  return merged;
}

function mergeDemoMapVisitsByPatient(
  local: Record<number, DemoMapVisitSeed>,
  remote: Record<number, DemoMapVisitSeed>,
): Record<number, DemoMapVisitSeed> {
  return { ...(local || {}), ...(remote || {}) };
}

export function mergeCollaborationSlice(
  local: CollaborationSyncSlice,
  remote: CollaborationSyncSlice,
  p7AlertActive: boolean,
): CollaborationSyncSlice {
  return {
    messagesByPatient: mergeMessagesByPatient(local.messagesByPatient, remote.messagesByPatient, p7AlertActive),
    eliteTaskTimes: { ...local.eliteTaskTimes, ...remote.eliteTaskTimes },
    eliteCareLogs: { ...local.eliteCareLogs, ...remote.eliteCareLogs },
    eliteVoiceText: { ...local.eliteVoiceText, ...remote.eliteVoiceText },
    carePlanStatus: { ...local.carePlanStatus, ...remote.carePlanStatus },
    submittedCareLogs: mergeSubmittedCareLogs(local.submittedCareLogs, remote.submittedCareLogs),
    readUpToByPatient: mergeReadUpToByPatient(local.readUpToByPatient, remote.readUpToByPatient),
    demoMapVisitsByPatient: mergeDemoMapVisitsByPatient(local.demoMapVisitsByPatient, remote.demoMapVisitsByPatient),
  };
}

export function mergeResolvedAlertIds(a: string[] = [], b: string[] = []): string[] {
  return [...new Set([...a, ...b])];
}

export function mergePatientSlice(
  local: {
    p7AlertActive: boolean;
    vitals: Record<number, Vitals>;
    resolvedAlertIds: string[];
    iotDevicesByPatient?: Record<number, PatientFull['iotDevices']>;
    deviceStatuses?: Record<string, DeviceStatus>;
    ts?: number;
  },
  remote: {
    p7AlertActive: boolean;
    vitals: Record<number, Vitals>;
    resolvedAlertIds: string[];
    iotDevicesByPatient?: Record<number, PatientFull['iotDevices']>;
    deviceStatuses?: Record<string, DeviceStatus>;
    ts: number;
  },
): {
  p7AlertActive: boolean;
  vitals: Record<number, Vitals>;
  resolvedAlertIds: string[];
  iotDevicesByPatient?: Record<number, PatientFull['iotDevices']>;
  deviceStatuses?: Record<string, DeviceStatus>;
} {
  const useRemotePatient = remote.ts >= (local.ts ?? 0);
  const base = useRemotePatient ? remote : local;
  const other = useRemotePatient ? local : remote;
  return {
    p7AlertActive: base.p7AlertActive,
    vitals: base.vitals,
    resolvedAlertIds: mergeResolvedAlertIds(local.resolvedAlertIds, remote.resolvedAlertIds),
    iotDevicesByPatient: { ...(other.iotDevicesByPatient ?? {}), ...(base.iotDevicesByPatient ?? {}) },
    deviceStatuses: { ...(other.deviceStatuses ?? {}), ...(base.deviceStatuses ?? {}) },
  };
}

export function mergeDemoSyncPayload(base: DemoSyncPayload | null, incoming: DemoSyncPayload): DemoSyncPayload {
  if (!base) return incoming;

  const p7AlertActive = incoming.ts >= base.ts ? incoming.p7AlertActive : base.p7AlertActive;
  const patient = mergePatientSlice(
    {
      p7AlertActive: base.p7AlertActive,
      vitals: base.vitals,
      resolvedAlertIds: base.resolvedAlertIds,
      iotDevicesByPatient: base.iotDevicesByPatient,
      deviceStatuses: base.deviceStatuses,
      ts: base.ts,
    },
    incoming,
  );
  const collaboration = mergeCollaborationSlice(base, incoming, p7AlertActive);

  return {
    v: incoming.v,
    ts: Math.max(base.ts, incoming.ts),
    ...patient,
    ...collaboration,
  };
}