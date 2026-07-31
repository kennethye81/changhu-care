// === Unified Data Store — Single Source of Truth for Desktop CC / Family / Elite ===
// All three apps read from and write to this store, ensuring perfect data sync.

import { create } from 'zustand';
import { PATIENTS_FULL, type PatientFull } from '../data/patients';
import { enrichAllPatientDevices } from '../data/iotDeviceCatalog';
import { CARE_TEAM, type TeamMember } from '../data/careTeam';
import { PATIENT_FAMILY } from '../data/careTeam';
import { TWO_WEEK_PLANS } from '../data/carePlans';
import { ALL_DEFAULT_VITALS } from '../data/allDefaultVitals';
import { NEW_DEFAULT_SUMMARIES } from '../data/newPatients/defaultVitals';
import { useCollaborationStore } from './collaborationStore';
import {
  calculateNews,
  normalizeVitals,
  P7_NEWS_ESCALATION_VITALS,
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
  { id: 1, name: 'Cheung Wai Man', gender: 'M', age: 78, diagnosis: 'Heart Failure NYHA III · CKD Stage 3 · T2DM · Permanent AF', temp: 36.6, hr: 82, bpSystolic: 118, bpDiastolic: 72, spo2: 95, hospital: 'HK Sanatorium & Hospital', address: 'Flat 8B, Block 5, Laguna City, Cha Kwo Ling, Kowloon', doctor: 'Dr. Chan Chi Keung (Cardiology)', caseManager: 'Peter Ho (Case Mgr)' },
  { id: 2, name: 'Wong Chi Ming', gender: 'F', age: 74, diagnosis: 'COPD GOLD Stage 3 · HTN · Hyperlipidaemia', temp: 36.5, hr: 86, bpSystolic: 134, bpDiastolic: 80, spo2: 90, hospital: 'Queen Mary Hospital', address: 'Room 1805, Block 2, Whampoa Garden, Hung Hom, Kowloon', doctor: 'Dr. Lee Mei Ling (Respiratory)', caseManager: 'Grace Tang (Case Mgr)' },
  { id: 3, name: 'Lam Ka Chun', gender: 'M', age: 45, diagnosis: 'Community-Acquired Pneumonia', temp: 36.8, hr: 72, bpSystolic: 118, bpDiastolic: 74, spo2: 97, hospital: 'Gleneagles Hospital', address: 'Flat 22C, Block 6, Mei Foo Sun Chuen, Lai Chi Kok, Kowloon', doctor: 'Dr. Cheung Kwok Wai (ID/IM)', caseManager: 'Anna Leung (Case Mgr)' },
  { id: 4, name: 'Lau Suk Yee', gender: 'F', age: 81, diagnosis: 'Complicated UTI', temp: 36.7, hr: 88, bpSystolic: 138, bpDiastolic: 84, spo2: 96, hospital: 'HK Sanatorium & Hospital', address: 'Flat 3A, Block 1, Telford Gardens, Kowloon Bay, Kowloon', doctor: 'Dr. Chan Chi Keung (Internal Med)', caseManager: 'Tony Lam (Case Mgr)' },
  { id: 5, name: 'Ho Tai Wai', gender: 'M', age: 72, diagnosis: 'Cellulitis — Left Lower Limb', temp: 36.6, hr: 78, bpSystolic: 136, bpDiastolic: 82, spo2: 97, hospital: 'Queen Mary Hospital', address: 'Flat 15A, Block 2, Bel-Air Residence, Pok Fu Lam, HK Island', doctor: 'Dr. Lee Mei Ling (Internal Med)', caseManager: 'Grace Tang (Case Mgr)' },
  { id: 6, name: 'Ng Siu Wan', gender: 'F', age: 67, diagnosis: 'Deep Vein Thrombosis', temp: 36.5, hr: 74, bpSystolic: 132, bpDiastolic: 80, spo2: 97, hospital: 'Gleneagles Hospital', address: 'Flat 7B, Block 3, South Horizons, Ap Lei Chau, HK Island', doctor: 'Dr. Cheung Kwok Wai (Internal Med)', caseManager: 'Anna Leung (Case Mgr)' },
  { id: 7, name: 'Chan Tai Ming', gender: 'M', age: 82, diagnosis: 'COPD GOLD 2 + CAP', temp: 37.0, hr: 84, bpSystolic: 138, bpDiastolic: 84, spo2: 93, hospital: 'Prince of Wales Hospital', address: 'Flat 12B, Block 8, City One Shatin, Ngan Shing Street, Sha Tin, New Territories', doctor: 'Dr. Lee Mei Ling (Respiratory)', caseManager: 'Grace Tang (Case Mgr)' },
  ...NEW_DEFAULT_SUMMARIES,
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
  p7AlertActive = false,
  resolvedAlertIds: string[] = [],
): Alert[] {
  const alerts: Alert[] = [];
  const now = Date.now();
  const isResolved = (id: string) => resolvedAlertIds.includes(id);

  patients.forEach(p => {
    if (p.id === 7 && p7AlertActive) return;
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

  if (p7AlertActive) alerts.unshift(...buildP7Alerts(resolvedAlertIds));
  return alerts;
}

export const P7_ALERT_VITALS: Vitals = P7_NEWS_ESCALATION_VITALS;

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

function buildP7Summary(vitals: Vitals, alertActive: boolean): PatientSummary {
  const base = DEFAULT_SUMMARIES_BASE.find(s => s.id === 7)!;
  if (!alertActive) return summaryFromVitals(base, vitals);
  const escalated = normalizeVitals(P7_NEWS_ESCALATION_VITALS, base.diagnosis);
  const news = calculateNews(escalated, base.diagnosis);
  return {
    ...summaryFromVitals(base, escalated),
    alertMsg: `NEWS ${news.score} — High · ${news.monitoringLabel} · SpO₂ ${escalated.spo2}% (Scale 2) · Temp ${escalated.temp}°C · RR ${escalated.rr}`,
  };
}

function computePatientSummaries(vitals: Record<number, Vitals>, p7AlertActive = false, extraIds: Set<number> = new Set()): PatientSummary[] {
  const base = DEFAULT_SUMMARIES_BASE.map(s => {
    if (s.id === 7) return buildP7Summary(vitals[7] || DEFAULT_VITALS[7], p7AlertActive);
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
      hospital: patient.physician.split('(')[1]?.replace(')', '').trim() || 'Prince of Wales Hospital',
      address: patient.address, doctor: patient.physician,
      caseManager: patient.carePlan.assignedCaseManager || '[待分配]',
    } as any, v));
  }
  return base;
}

function buildP7Alerts(resolvedAlertIds: string[] = []): Alert[] {
  const now = Date.now();
  const isResolved = (id: string) => resolvedAlertIds.includes(id);
  const news = calculateNews(P7_NEWS_ESCALATION_VITALS, 'COPD');
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
  p7AlertActive: boolean;
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
  triggerP7Alert: () => void;
  deactivateP7Alert: () => void;
  promotePatient: (id: number) => void;
  applyDemoSync: (payload: {
    p7AlertActive: boolean;
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
    p7AlertActive: boolean,
    patients = state.patients,
    resolvedAlertIds = state.resolvedAlertIds,
  ) => ({
    vitals: newVitals,
    patients,
    alerts: buildAlertsFromVitals(patients, newVitals, p7AlertActive, resolvedAlertIds),
    patientsSummary: computePatientSummaries(newVitals, p7AlertActive, state.promotedPatientIds),
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
    p7AlertActive: false,
    resolvedAlertIds: [],
    promotedPatientIds: new Set(),

    updateVitals: (patientId, partial) => {
      set(state => {
        const newVitals = { ...state.vitals, [patientId]: { ...state.vitals[patientId], ...partial } as Vitals };
        return syncDerivedState(state, newVitals, state.p7AlertActive);
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
          ...syncDerivedState(state, state.vitals, state.p7AlertActive, state.patients, resolvedAlertIds),
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
        set(syncDerivedState(state, newVitals, state.p7AlertActive));
      }, 5000);
      set({ simulationActive: true });
      return () => {
        clearInterval(interval);
        set({ simulationActive: false });
      };
    },

    stopSimulation: () => set({ simulationActive: false }),

    triggerP7Alert: () => {
      if (get().p7AlertActive) return;
      const state = get();
      const newVitals = { ...state.vitals, 7: P7_NEWS_ESCALATION_VITALS };
      const patients = patchP7Patient(state.patients, true);
      set({ p7AlertActive: true, ...syncDerivedState(state, newVitals, true, patients) });
      useCollaborationStore.getState().refreshP7Messages(true);
    },

    deactivateP7Alert: () => {
      if (!get().p7AlertActive) return;
      const state = get();
      const newVitals = { ...state.vitals, 7: DEFAULT_VITALS[7] };
      const patients = patchP7Patient(state.patients, false);
      set({ p7AlertActive: false, ...syncDerivedState(state, newVitals, false, patients) });
      useCollaborationStore.getState().refreshP7Messages(false);
    },

    promotePatient: (id) => set(state => {
      const promoted = new Set(state.promotedPatientIds);
      promoted.add(id);
      return {
        promotedPatientIds: promoted,
        patientsSummary: computePatientSummaries(state.vitals, state.p7AlertActive, promoted),
      };
    }),

    applyDemoSync: (payload) => {
      const state = get();
      let patients = patchP7Patient(state.patients, payload.p7AlertActive);
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
        p7AlertActive: payload.p7AlertActive,
        resolvedAlertIds,
        deviceStatuses,
        ...syncDerivedState(state, payload.vitals, payload.p7AlertActive, patients, resolvedAlertIds),
      });
    },
  };
});
