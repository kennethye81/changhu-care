import { getCollaborationSyncSlice, useCollaborationStore } from '../store/collaborationStore';
import { usePatientStore } from '../store/patientStore';
import {
  buildDemoSyncPayload,
  DEMO_SYNC_CHANNEL,
  DEMO_SYNC_STORAGE_KEY,
  isDemoSyncPayload,
  normalizeDemoSyncPayload,
  snapshotDemoSync,
  type DemoSyncMessage,
  type DemoSyncPayload,
} from './types';
import { mergeDemoSyncPayload } from './mergePayload';

let applyingRemote = false;
let lastPublishedSnapshot = '';
/** Monotonic sync clock — must not refresh to Date.now() on every merge read. */
let lastSyncTs = Date.now();
let broadcastChannel: BroadcastChannel | null = null;
let ws: WebSocket | null = null;
let wsReconnectTimer: ReturnType<typeof setTimeout> | null = null;
let patientUnsubscribe: (() => void) | null = null;
let collaborationUnsubscribe: (() => void) | null = null;

function resolveSyncWsUrl(): string {
  const env = import.meta.env.VITE_SYNC_WS_URL as string | undefined;
  if (env) {
    if (env.startsWith('/')) {
      const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${proto}//${window.location.host}${env}`;
    }
    return env;
  }

  if (import.meta.env.PROD) {
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${proto}//${window.location.host}/api/demo-sync`;
  }

  const host = window.location.hostname || 'localhost';
  return `ws://${host}:5199`;
}

function readLocalPayload(ts = lastSyncTs): DemoSyncPayload {
  const patient = usePatientStore.getState();
  const collaboration = getCollaborationSyncSlice(useCollaborationStore.getState());
  return buildDemoSyncPayload(patient, collaboration, ts);
}

function persistPayload(payload: DemoSyncPayload) {
  try {
    const message: DemoSyncMessage = { type: 'sync', payload };
    localStorage.setItem(DEMO_SYNC_STORAGE_KEY, JSON.stringify(message));
  } catch {
    // ignore quota / private mode
  }
}

function readPersistedPayload(): DemoSyncPayload | null {
  try {
    const raw = localStorage.getItem(DEMO_SYNC_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DemoSyncMessage | DemoSyncPayload;
    const payload = 'type' in parsed && parsed.type === 'sync' ? parsed.payload : parsed;
    return isDemoSyncPayload(payload) ? normalizeDemoSyncPayload(payload) : null;
  } catch {
    return null;
  }
}

function publishLocal() {
  if (applyingRemote) return;

  const ts = Date.now();
  lastSyncTs = ts;
  const payload = readLocalPayload(ts);
  const snapshot = snapshotDemoSync(payload);
  if (snapshot === lastPublishedSnapshot) return;
  lastPublishedSnapshot = snapshot;

  const message: DemoSyncMessage = { type: 'sync', payload };
  persistPayload(payload);
  broadcastChannel?.postMessage(message);
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

function applyRemotePayload(raw: DemoSyncPayload) {
  const incoming = normalizeDemoSyncPayload(raw);
  const merged = mergeDemoSyncPayload(readLocalPayload(), incoming);
  const snapshot = snapshotDemoSync(merged);
  if (snapshot === lastPublishedSnapshot) return;

  applyingRemote = true;
  try {
    const prevAlert = usePatientStore.getState().alertActive;
    usePatientStore.getState().applyDemoSync(merged);
    if (merged.alertActive !== prevAlert) {
      useCollaborationStore.getState().refreshAlertMessages(merged.alertActive);
    }
    if (merged.v >= 2) {
      useCollaborationStore.getState().applyCollaborationSync(merged, merged.alertActive);
    }
    lastSyncTs = merged.ts;
    lastPublishedSnapshot = snapshot;
  } finally {
    applyingRemote = false;
  }
}

function handleIncomingMessage(raw: unknown) {
  if (!raw || typeof raw !== 'object') return;
  const message = raw as DemoSyncMessage | DemoSyncPayload;
  const payload = 'type' in message && message.type === 'sync' ? message.payload : message;
  if (!isDemoSyncPayload(payload)) return;
  applyRemotePayload(payload);
}

function hydrateFromStorage() {
  const persisted = readPersistedPayload();
  if (persisted) {
    lastSyncTs = persisted.ts;
    applyRemotePayload(persisted);
  }
}

function bindStorageListener() {
  window.addEventListener('storage', (event) => {
    if (event.key !== DEMO_SYNC_STORAGE_KEY || !event.newValue) return;
    try {
      handleIncomingMessage(JSON.parse(event.newValue));
    } catch {
      // ignore malformed payloads
    }
  });
}

function shouldUseWebSocket() {
  if (import.meta.env.VITE_SYNC_WS_URL) return true;
  return import.meta.env.DEV;
}

function connectWebSocket() {
  if (!shouldUseWebSocket()) return;
  if (wsReconnectTimer) {
    clearTimeout(wsReconnectTimer);
    wsReconnectTimer = null;
  }

  const url = resolveSyncWsUrl();
  const socket = new WebSocket(url);
  ws = socket;

  socket.addEventListener('open', () => {
    // Server replays currentState on connect — never push bootstrap state here.
  });

  socket.addEventListener('message', (event) => {
    try {
      handleIncomingMessage(JSON.parse(String(event.data)));
    } catch {
      // ignore malformed payloads
    }
  });

  socket.addEventListener('close', () => {
    if (ws === socket) ws = null;
    wsReconnectTimer = setTimeout(connectWebSocket, 2000);
  });

  socket.addEventListener('error', () => {
    socket.close();
  });
}

function bindBroadcastChannel() {
  if (typeof BroadcastChannel === 'undefined') return;
  broadcastChannel = new BroadcastChannel(DEMO_SYNC_CHANNEL);
  broadcastChannel.onmessage = (event) => handleIncomingMessage(event.data);
}

function bindStorePublishers() {
  lastPublishedSnapshot = snapshotDemoSync(readLocalPayload());
  patientUnsubscribe = usePatientStore.subscribe(() => publishLocal());
  collaborationUnsubscribe = useCollaborationStore.subscribe(() => publishLocal());
}

export function initDemoSync() {
  if (typeof window === 'undefined' || patientUnsubscribe) return;

  bindBroadcastChannel();
  bindStorageListener();
  hydrateFromStorage();
  connectWebSocket();
  bindStorePublishers();
}

export function teardownDemoSync() {
  patientUnsubscribe?.();
  collaborationUnsubscribe?.();
  patientUnsubscribe = null;
  collaborationUnsubscribe = null;
  broadcastChannel?.close();
  broadcastChannel = null;
  ws?.close();
  ws = null;
  if (wsReconnectTimer) clearTimeout(wsReconnectTimer);
}
