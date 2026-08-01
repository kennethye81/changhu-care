// === Unified Data Store — Single Source of Truth for Desktop CC / Family / Elite ===
// All three apps read from and write to this store, ensuring perfect data sync.

import { create } from 'zustand';
import { PATIENTS_FULL, type PatientFull } from '../data/patients';
import { enrichAllPatientDevices } from '../data/iotDeviceCatalog';
import { CARE_TEAM, type TeamMember } from '../data/careTeam';
import { PATIENT_FAMILY } from '../data/careTeam';
import { TWO_WEEK_PLANS } from '../data/carePlans';
import { ALL_DEFAULT_VITALS } from '../data/allDefaultVitals';
import { useCollaborationStore } from './collaborationStore';
import {
  calculateNews,
  normalizeVitals,
  PATIENT1_ESCALATION_VITALS,
  type MonitoringInterval,
  type NewsTier,
} from '../utils/newsScore';
import { assessBpDiaHighlight, assessBpSysHighlight, type BpHighlightLevel } from '../utils/bpClinicalSeverity';

export type { NewsTier };

/* ──────────────────── Types ──────────────────── */

export interface Vitals {
  hr: number;
  bpSystolic: number;
  bpDiastolic: number;
  spo2: number;
  temp: number;
  rr: number;
  bloodSugar: number;
  avpu: 'A' | 'V' | 'P' | 'U';
  onSupplementalO2: boolean;
  spo2Scale: 1 | 2;
}

export interface Alert {
  id: string;
  patientId: number;
  type: 'critical' | 'attention' | 'info';
  message: string;
  timestamp: number;
  resolved: boolean;
  vital?: keyof Vitals;
}

export interface DeviceStatus {
  serial: string;
  status: 'Connected' | 'Syncing' | 'Disconnected';
  battery: number;
  lastSync: string;
}

/** Flat patient summary — used by Desktop CC, Family, and Elites */
export interface PatientSummary {
  id: number;
  name: string;
  gender: 'M' | 'F';
  age: number;
  diagnosis: string;
  temp: number;
  hr: number;
  bpSystolic: number;
  bpDiastolic: number;
  spo2: number;
  rr: number;
  bloodSugar: number;
  newsScore: number;
  newsTier: NewsTier;
  newsRedScore: boolean;
  newsMonitoringInterval: MonitoringInterval;
  newsMonitoringLabel: string;
  newsEscalation: string;
  alertVital?: ('rr' | 'hr' | 'bp' | 'bpSys' | 'bpDia' | 'spo2' | 'temp' | 'glucose')[];
  /** Per-vital CC badge severity — BP uses clinical thresholds + NEWS2 (SBP only). */
  vitalHighlight?: { bpSys?: BpHighlightLevel; bpDia?: BpHighlightLevel };
  alertMsg?: string;
  hospital: string;
  address: string;
  doctor: string;
  caseManager: string;
}

/* ──────────────────── Default Vitals ──────────────────── */

/* ──────────────────── Default Vitals ──────────────────── */

export const DEFAULT_VITALS: Record<number, Vitals> = ALL_DEFAULT_VITALS;

/* ──────────────────── Default Patient Summaries (from Desktop CC) ──────────────────── */

const DEFAULT_SUMMARIES_BASE: Omit<PatientSummary, 'newsScore' | 'newsTier' | 'rr' | 'bloodSugar'>[] = [
  { id: 1, name: '冯存富', gender: 'M', age: 77, diagnosis: '高血压 · 双侧肢体异常 · 压疮 · 中度失能', temp: 36.7, hr: 78, bpSystolic: 160, bpDiastolic: 82, spo2: 96, hospital: '易得康（常州金坛）', address: '江苏省常州市金坛区指前镇解放村接王家村3号', doctor: '社区医生（定期随访）', caseManager: '林晓东' },
];
  

/* ──────────────────── Build alerts from vitals ──────────────────── */

let alertCounter = 0;
const genAlertId = () => `alert-${++alertCounter}-${Date.now()}`;
const stableAlertId = (patientId: number, kind: string) => `alert-${patientId}-${kind}`;

function highlightVitals(
  news: ReturnType<typeof calculateNews>,
  v: Vitals,
  patientId: number,
): PatientSummary['alertVital'] {
  const out: NonNullable<PatientSummary['alertVital']> = [];
  const b = news.breakdown;
  if (b.respiration > 0) out.push('rr');
  if (b.pulse > 0) out.push('hr');
  const bpSys = assessBpSysHighlight(patientId, v.bpSystolic, b.systolicBp);
  const bpDia = assessBpDiaHighlight(patientId, v.bpDiastolic);
  if (bpSys) out.push('bpSys');
  if (bpDia) out.push('bpDia');
  if (bpSys || bpDia) out.push('bp');
  if (b.spo2 > 0 || b.supplementalO2 > 0) out.push('spo2');
  if (b.temperature > 0) out.push('temp');
  if (news.glucoseAlert) out.push('glucose');
  if (!out.length && v.rr >= 20) out.push('rr');
  return out.length ? out : undefined;
}

function buildAlertsFromVitals(
  patients: PatientFull[],
  vitals: Record<number, Vitals>,
  alertActive = false,
  resolvedAlertIds: string[] = [],
): Alert[] {
  const alerts: Alert[] = [];
  const now = Date.now();
  const isResolved = (id: string) => resolvedAlertIds.includes(id);

  patients.forEach(p => {
    if (p.id === 1 && alertActive) return;
    const raw = vitals[p.id];
    if (!raw) return;
    const v = normalizeVitals(raw, p.diagnosis);
    const news = calculateNews(v, p.diagnosis);

    if (news.tier === 'high') {
      alerts.push({
        id: stableAlertId(p.id, 'news-high'),
        patientId: p.id,
        type: 'critical',
        message: `NEWS ${news.score} — High (7+). ${news.escalation} ${news.monitoringLabel}.`,
        timestamp: now,
        resolved: isResolved(stableAlertId(p.id, 'news-high')),
      });
    } else if (news.tier === 'medium') {
      alerts.push({
        id: stableAlertId(p.id, 'news-medium'),
        patientId: p.id,
        type: 'attention',
        message: `NEWS ${news.score} — Medium (5–6). ${news.escalation} ${news.monitoringLabel}.`,
        timestamp: now,
        resolved: isResolved(stableAlertId(p.id, 'news-medium')),
      });
    } else if (news.redScore) {
      alerts.push({
        id: stableAlertId(p.id, 'news-red'),
        patientId: p.id,
        type: 'attention',
        message: `NEWS ${news.score} — RED score (single parameter 3). ${news.escalation} ${news.monitoringLabel}.`,
        timestamp: now,
        resolved: isResolved(stableAlertId(p.id, 'news-red')),
      });
    }

    if (news.glucoseAlert && news.glucoseMessage) {
      alerts.push({
        id: stableAlertId(p.id, `glucose-${news.glucoseAlert}`),
        patientId: p.id,
        type: news.glucoseAlert === 'critical' ? 'critical' : 'attention',
        message: news.glucoseMessage,
        timestamp: now,
        resolved: isResolved(stableAlertId(p.id, `glucose-${news.glucoseAlert}`)),
      });
    }
  });

  if (alertActive) alerts.unshift(...buildPatient1Alerts(resolvedAlertIds));
  return alerts;
}

export const PATIENT1_ALERT_VITALS: Vitals = PATIENT1_ESCALATION_VITALS;

function summaryFromVitals(base: Omit<PatientSummary, 'newsScore' | 'newsTier' | 'rr' | 'bloodSugar'>, v: Vitals): PatientSummary {
  const normalized = normalizeVitals(v, base.diagnosis);
  const news = calculateNews(normalized, base.diagnosis);
  const bpSys = assessBpSysHighlight(base.id, normalized.bpSystolic, news.breakdown.systolicBp);
  const bpDia = assessBpDiaHighlight(base.id, normalized.bpDiastolic);
  const vitalHighlight: PatientSummary['vitalHighlight'] = {};
  if (bpSys) vitalHighlight.bpSys = bpSys;
  if (bpDia) vitalHighlight.bpDia = bpDia;

  return {
    ...base,
    temp: normalized.temp,
    hr: normalized.hr,
    bpSystolic: normalized.bpSystolic,
    bpDiastolic: normalized.bpDiastolic,
    spo2: normalized.spo2,
    rr: normalized.rr,
    bloodSugar: normalized.bloodSugar,
    newsScore: news.score,
    newsTier: news.tier,
    newsRedScore: news.redScore,
    newsMonitoringInterval: news.monitoringInterval,
    newsMonitoringLabel: news.monitoringLabel,
    newsEscalation: news.escalation,
    alertVital: highlightVitals(news, normalized, base.id),
    vitalHighlight: Object.keys(vitalHighlight).length ? vitalHighlight : undefined,
    alertMsg: news.tier === 'high'
      ? `NEWS ${news.score} — High · ${news.monitoringLabel}`
      : news.tier === 'medium'
        ? `NEWS ${news.score} — Medium · ${news.monitoringLabel}`
        : news.redScore
          ? `NEWS ${news.score} — RED score · ${news.monitoringLabel}`
          : news.glucoseAlert
            ? news.glucoseMessage
            : undefined,
  };
}

function buildPatient1Summary(vitals: Vitals, alertActive: boolean): PatientSummary {
  const base = DEFAULT_SUMMARIES_BASE.find(s => s.id === 1)!;
  if (!alertActive) return summaryFromVitals(base, vitals);
  const escalated = normalizeVitals(PATIENT1_ESCALATION_VITALS, base.diagnosis);
  const news = calculateNews(escalated, base.diagnosis);
  return {
    ...summaryFromVitals(base, escalated),
    alertMsg: `NEWS ${news.score} — High · ${news.monitoringLabel} · SpO₂ ${escalated.spo2}% (Scale 2) · Temp ${escalated.temp}°C · RR ${escalated.rr}`,
  };
}

function computePatientSummaries(vitals: Record<number, Vitals>, alertActive = false, extraIds: Set<number> = new Set()): PatientSummary[] {
  const base = DEFAULT_SUMMARIES_BASE.map(s => {
    if (s.id === 1) return buildPatient1Summary(vitals[1] || DEFAULT_VITALS[1], alertActive);
    const v = vitals[s.id];
    if (!v) {
      const normalized = normalizeVitals(DEFAULT_VITALS[s.id] ?? {}, s.diagnosis);
      return summaryFromVitals(s, normalized);
    }
    return summaryFromVitals(s, v);
  });
  for (const id of extraIds) {
    const patient = PATIENTS_FULL.find(p => p.id === id);
    if (!patient) continue;
    const v = normalizeVitals((vitals[id] ?? DEFAULT_VITALS[id]) ?? {}, patient.diagnosis);
    base.push(summaryFromVitals({
      id: patient.id, name: patient.name, gender: patient.gender, age: patient.age,
      diagnosis: patient.diagnosis, temp: v.temp, hr: v.hr, bpSystolic: v.bpSystolic,
      bpDiastolic: v.bpDiastolic, spo2: v.spo2,
      hospital: patient.physician.split('(')[1]?.replace(')', '').trim() || '常州市金坛区人民医院',
      address: patient.address, doctor: patient.physician,
      caseManager: patient.carePlan.assignedCaseManager || '[待分配]',
    } as any, v));
  }
  return base;
}

function buildPatient1Alerts(resolvedAlertIds: string[] = []): Alert[] {
  const now = Date.now();
  const isResolved = (id: string) => resolvedAlertIds.includes(id);
  const news = calculateNews(PATIENT1_ESCALATION_VITALS, 'COPD');
  return [
    {
      id: stableAlertId(7, 'news-high'),
      patientId: 7,
      type: 'critical',
      message: `NEWS ${news.score} — High (7+). ${news.escalation} ${news.monitoringLabel}.`,
      timestamp: now,
      resolved: isResolved(stableAlertId(7, 'news-high')),
    },
  ];
}

function buildDeviceStatuses(patients: PatientFull[]): Record<string, DeviceStatus> {
  const map: Record<string, DeviceStatus> = {};
  patients.forEach(p => p.iotDevices.forEach(d => { map[d.serial] = { serial: d.serial, status: d.status, battery: d.battery, lastSync: d.lastSync }; }));
  return map;
}

/* ──────────────────── Store Interface ──────────────────── */

export interface PatientStore {
  patients: PatientFull[];
  patientsSummary: PatientSummary[];
  vitals: Record<number, Vitals>;
  alerts: Alert[];
  careTeam: Record<string, TeamMember>;
  familyContacts: Record<number, any[]>;
  carePlans: Record<number, any>;
  deviceStatuses: Record<string, DeviceStatus>;

  simulationActive: boolean;
  selectedPatientId: number | null;
  sidebarCollapsed: boolean;
  alertActive: boolean;
  resolvedAlertIds: string[];
  promotedPatientIds: Set<number>;

  updateVitals: (patientId: number, vitals: Partial<Vitals>) => void;
  updatePatient: (patientId: number, data: Partial<PatientFull>) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  resolveAlert: (alertId: string) => void;
  setSelectedPatient: (id: number | null) => void;
  setSidebarCollapsed: (v: boolean) => void;
  setDeviceStatus: (serial: string, status: Partial<DeviceStatus>) => void;
  startSimulation: () => () => void;
  stopSimulation: () => void;
  triggerAlert: () => void;
  deactivateAlert: () => void;
  promotePatient: (id: number) => void;
  applyDemoSync: (payload: {
    alertActive: boolean;
    vitals: Record<number, Vitals>;
    resolvedAlertIds?: string[];
    iotDevicesByPatient?: Record<number, PatientFull['iotDevices']>;
    deviceStatuses?: Record<string, DeviceStatus>;
  }) => void;
}

/* ──────────────────── Create Store ──────────────────── */

export const usePatientStore = create<PatientStore>((set, get) => {
  const initialVitals = { ...DEFAULT_VITALS };

  const syncDerivedState = (
    state: PatientStore,
    newVitals: Record<number, Vitals>,
    alertActive: boolean,
    patients = state.patients,
    resolvedAlertIds = state.resolvedAlertIds,
  ) => ({
    vitals: newVitals,
    patients,
    alerts: buildAlertsFromVitals(patients, newVitals, alertActive, resolvedAlertIds),
    patientsSummary: computePatientSummaries(newVitals, alertActive, state.promotedPatientIds),
    deviceStatuses: buildDeviceStatuses(patients),
  });

  const patchP7Patient = (patients: PatientFull[], alertActive: boolean): PatientFull[] =>
    patients.map(p => {
      if (p.id !== 7) return p;
      return {
        ...p,
        riskLevel: alertActive ? 'Critical' : 'High',
        iotDevices: p.iotDevices.map(d =>
          d.type === 'O₂ Concentrator'
            ? { ...d, status: (alertActive ? 'Connected' : 'Standby') as typeof d.status, lastSync: alertActive ? 'Active — 2L/min' : '5 min ago' }
            : d,
        ),
      };
    });

  const enrichedPatients = enrichAllPatientDevices([...PATIENTS_FULL]);

  return {
    patients: enrichedPatients,
    patientsSummary: computePatientSummaries(initialVitals),
    vitals: initialVitals,
    alerts: buildAlertsFromVitals(enrichedPatients, initialVitals),
    careTeam: CARE_TEAM,
    familyContacts: PATIENT_FAMILY,
    carePlans: TWO_WEEK_PLANS,
    deviceStatuses: buildDeviceStatuses(enrichedPatients),

    simulationActive: false,
    selectedPatientId: null,
    sidebarCollapsed: false,
    alertActive: false,
    resolvedAlertIds: [],
    promotedPatientIds: new Set(),

    updateVitals: (patientId, partial) => {
      set(state => {
        const newVitals = { ...state.vitals, [patientId]: { ...state.vitals[patientId], ...partial } as Vitals };
        return syncDerivedState(state, newVitals, state.alertActive);
      });
    },

    updatePatient: (patientId, data) => {
      set(state => {
        const patients = state.patients.map(p => p.id === patientId ? { ...p, ...data } : p);
        return { patients, deviceStatuses: buildDeviceStatuses(patients) };
      });
    },

    addAlert: (alert) => {
      set(state => ({
        alerts: [{ ...alert, id: genAlertId(), timestamp: Date.now() } as Alert, ...state.alerts],
      }));
    },

    resolveAlert: (alertId) => {
      set(state => {
        const resolvedAlertIds = state.resolvedAlertIds.includes(alertId)
          ? state.resolvedAlertIds
          : [...state.resolvedAlertIds, alertId];
        return {
          resolvedAlertIds,
          ...syncDerivedState(state, state.vitals, state.alertActive, state.patients, resolvedAlertIds),
        };
      });
    },

    setSelectedPatient: (id) => set({ selectedPatientId: id }),
    setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

    setDeviceStatus: (serial, partial) => {
      set(state => ({
        deviceStatuses: { ...state.deviceStatuses, [serial]: { ...state.deviceStatuses[serial], ...partial } as DeviceStatus },
      }));
    },

    startSimulation: () => {
      const interval = setInterval(() => {
        const state = get();
        if (!state.simulationActive) return;
        const newVitals = { ...state.vitals };
        state.patients.forEach(p => {
          const v = newVitals[p.id];
          if (!v) return;
          newVitals[p.id] = normalizeVitals({
            ...v,
            hr: Math.round(v.hr + (Math.random() - 0.5) * 8),
            bpSystolic: Math.round(v.bpSystolic + (Math.random() - 0.5) * 10),
            bpDiastolic: Math.round(v.bpDiastolic + (Math.random() - 0.5) * 6),
            spo2: Math.min(100, Math.max(85, Math.round(v.spo2 + (Math.random() - 0.5) * 2))),
            temp: Math.round((v.temp + (Math.random() - 0.5) * 0.4) * 10) / 10,
            rr: Math.round(v.rr + (Math.random() - 0.5) * 3),
            bloodSugar: Math.round(v.bloodSugar + (Math.random() - 0.5) * 12),
          }, p.diagnosis);
        });
        if (Math.random() < 0.15) {
          const targetId = Math.random() < 0.5 ? 1 : 5;
          newVitals[targetId].bpSystolic = Math.round(160 + Math.random() * 25);
          newVitals[targetId].hr = Math.round(100 + Math.random() * 20);
        }
        set(syncDerivedState(state, newVitals, state.alertActive));
      }, 5000);
      set({ simulationActive: true });
      return () => {
        clearInterval(interval);
        set({ simulationActive: false });
      };
    },

    stopSimulation: () => set({ simulationActive: false }),

    triggerAlert: () => {
      if (get().alertActive) return;
      const state = get();
      const newVitals = { ...state.vitals, 7: PATIENT1_ESCALATION_VITALS };
      const patients = patchP7Patient(state.patients, true);
      set({ alertActive: true, ...syncDerivedState(state, newVitals, true, patients) });
      useCollaborationStore.getState().refreshAlertMessages(true);
    },

    deactivateAlert: () => {
      if (!get().alertActive) return;
      const state = get();
      const newVitals = { ...state.vitals, 7: DEFAULT_VITALS[1] };
      const patients = patchP7Patient(state.patients, false);
      set({ alertActive: false, ...syncDerivedState(state, newVitals, false, patients) });
      useCollaborationStore.getState().refreshAlertMessages(false);
    },

    promotePatient: (id) => set(state => {
      const promoted = new Set(state.promotedPatientIds);
      promoted.add(id);
      return {
        promotedPatientIds: promoted,
        patientsSummary: computePatientSummaries(state.vitals, state.alertActive, promoted),
      };
    }),

    applyDemoSync: (payload) => {
      const state = get();
      let patients = patchP7Patient(state.patients, payload.alertActive);
      if (payload.iotDevicesByPatient) {
        patients = patients.map(p => {
          const devices = payload.iotDevicesByPatient?.[p.id];
          return devices ? { ...p, iotDevices: devices } : p;
        });
      }
      const resolvedAlertIds = payload.resolvedAlertIds ?? state.resolvedAlertIds;
      const deviceStatuses = payload.deviceStatuses
        ? { ...buildDeviceStatuses(patients), ...payload.deviceStatuses }
        : buildDeviceStatuses(patients);
      set({
        alertActive: payload.alertActive,
        resolvedAlertIds,
        deviceStatuses,
        ...syncDerivedState(state, payload.vitals, payload.alertActive, patients, resolvedAlertIds),
      });
    },
  };
});
