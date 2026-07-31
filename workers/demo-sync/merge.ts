/** Port of scripts/sync-merge.mjs for the Cloudflare sync relay. */

const P7_ALERT_IDS = [7001, 7002, 7003, 7004, 7005];
const P7_DAY1_IDS = [7101, 7102, 7103, 7104, 7105];

type ChatMessage = { id: number; [key: string]: unknown };
type FollowupLogEntry = { date: string; time: string; type: string; author: string; detail: string };
export type DemoSyncPayload = {
  v: number;
  ts: number;
  p7AlertActive: boolean;
  vitals: Record<number, unknown>;
  resolvedAlertIds?: string[];
  messagesByPatient?: Record<number, ChatMessage[]>;
  eliteTaskTimes?: Record<string, unknown>;
  eliteCareLogs?: Record<number, unknown>;
  eliteVoiceText?: Record<number, unknown>;
  carePlanStatus?: Record<string, unknown>;
  submittedCareLogs?: Record<number, FollowupLogEntry[]>;
};

function isP7Template(message: ChatMessage) {
  return P7_ALERT_IDS.includes(message.id) || P7_DAY1_IDS.includes(message.id);
}

function mergeMessageThreads(a: ChatMessage[], b: ChatMessage[]) {
  const byId = new Map<number, ChatMessage>();
  for (const message of [...a, ...b]) byId.set(message.id, message);
  return [...byId.values()].sort((x, y) => x.id - y.id);
}

function mergeP7Messages(local: ChatMessage[], remote: ChatMessage[], p7AlertActive: boolean) {
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

function mergeMessagesByPatient(
  local: Record<number, ChatMessage[]>,
  remote: Record<number, ChatMessage[]>,
  p7AlertActive: boolean,
) {
  const patientIds = new Set([
    ...Object.keys(local || {}).map(Number),
    ...Object.keys(remote || {}).map(Number),
  ]);
  const merged: Record<number, ChatMessage[]> = {};
  for (const patientId of patientIds) {
    const a = local?.[patientId] || [];
    const b = remote?.[patientId] || [];
    merged[patientId] = patientId === 7
      ? mergeP7Messages(a, b, p7AlertActive)
      : mergeMessageThreads(a, b);
  }
  return merged;
}

function mergeResolvedAlertIds(a: string[] = [], b: string[] = []) {
  return [...new Set([...a, ...b])];
}

function careLogKey(log: FollowupLogEntry) {
  return `${log.date}|${log.time}|${log.type}|${log.author}|${log.detail}`;
}

function mergeSubmittedCareLogs(
  local: Record<number, FollowupLogEntry[]>,
  remote: Record<number, FollowupLogEntry[]>,
) {
  const patientIds = new Set([
    ...Object.keys(local || {}).map(Number),
    ...Object.keys(remote || {}).map(Number),
  ]);
  const merged: Record<number, FollowupLogEntry[]> = {};
  for (const patientId of patientIds) {
    const byKey = new Map<string, FollowupLogEntry>();
    for (const log of [...(local?.[patientId] || []), ...(remote?.[patientId] || [])]) {
      byKey.set(careLogKey(log), log);
    }
    merged[patientId] = [...byKey.values()].sort((a, b) =>
      `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
    );
  }
  return merged;
}

export function mergeDemoSyncPayload(
  base: DemoSyncPayload | null,
  incoming: DemoSyncPayload,
): DemoSyncPayload {
  if (!base) return incoming;

  const p7AlertActive = incoming.ts >= base.ts ? incoming.p7AlertActive : base.p7AlertActive;
  const useRemotePatient = incoming.ts >= base.ts;

  return {
    v: incoming.v,
    ts: Math.max(base.ts, incoming.ts),
    p7AlertActive,
    vitals: useRemotePatient ? incoming.vitals : base.vitals,
    resolvedAlertIds: mergeResolvedAlertIds(base.resolvedAlertIds, incoming.resolvedAlertIds),
    messagesByPatient: mergeMessagesByPatient(
      base.messagesByPatient || {},
      incoming.messagesByPatient || {},
      p7AlertActive,
    ),
    eliteTaskTimes: { ...(base.eliteTaskTimes || {}), ...(incoming.eliteTaskTimes || {}) },
    eliteCareLogs: { ...(base.eliteCareLogs || {}), ...(incoming.eliteCareLogs || {}) },
    eliteVoiceText: { ...(base.eliteVoiceText || {}), ...(incoming.eliteVoiceText || {}) },
    carePlanStatus: { ...(base.carePlanStatus || {}), ...(incoming.carePlanStatus || {}) },
    submittedCareLogs: mergeSubmittedCareLogs(
      base.submittedCareLogs || {},
      incoming.submittedCareLogs || {},
    ),
  };
}
