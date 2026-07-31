import { create } from 'zustand';
import { buildInitialMessagesByPatient, type ChatMessage } from '../data/chatMessages';

import type { CarePlanTaskStatus } from '../utils/carePlanSync';
import type { FollowupLogEntry } from '../data/carePlans';
import type { DemoMapVisitSeed } from '../utils/demoMapVisitAssignments';
import { mergeCollaborationSlice } from '../sync/mergePayload';
import { buildInitialReadCursors } from '../utils/hubNotifications';
import { buildDemoMapActiveVisits } from '../utils/demoMapActiveVisits';

const initialMessages = buildInitialMessagesByPatient(false);
const demoActiveVisits = buildDemoMapActiveVisits();

export interface EliteCareLogFields {
  condition: string;
  meds: string;
  response: string;
  mental: string;
  io: string;
  diet: string;
  incidents: string;
}

export const EMPTY_CARE_LOG: EliteCareLogFields = {
  condition: '',
  meds: '',
  response: '',
  mental: '',
  io: '',
  diet: '',
  incidents: '',
};

export interface EliteTaskTimes {
  clockIn?: string;
  clockOut?: string;
}

export interface CollaborationStore {
  messagesByPatient: Record<number, ChatMessage[]>;
  readUpToByPatient: Record<number, number>;
  eliteTaskTimes: Record<string, EliteTaskTimes>;
  eliteCareLogs: Record<number, EliteCareLogFields>;
  eliteVoiceText: Record<number, string>;
  carePlanStatus: Record<string, CarePlanTaskStatus>;
  demoMapVisitsByPatient: Record<number, DemoMapVisitSeed>;
  submittedCareLogs: Record<number, FollowupLogEntry[]>;

  setMessagesByPatient: (messages: Record<number, ChatMessage[]>) => void;
  appendMessage: (patientId: number, message: ChatMessage) => void;
  markPatientMessagesRead: (patientId: number) => void;
  refreshP7Messages: (p7AlertActive: boolean) => void;
  setEliteTaskClockIn: (taskKey: string, time: string) => void;
  setEliteTaskClockOut: (taskKey: string, time: string) => void;
  setEliteCareLogFields: (patientId: number, fields: EliteCareLogFields) => void;
  setEliteVoiceText: (patientId: number, text: string) => void;
  setCarePlanTaskStatus: (taskKey: string, status: CarePlanTaskStatus) => void;
  appendSubmittedCareLog: (patientId: number, log: FollowupLogEntry) => void;
  applyCollaborationSync: (payload: CollaborationSyncSlice, p7AlertActive: boolean) => void;
}

export interface CollaborationSyncSlice {
  messagesByPatient: Record<number, ChatMessage[]>;
  eliteTaskTimes: Record<string, EliteTaskTimes>;
  eliteCareLogs: Record<number, EliteCareLogFields>;
  eliteVoiceText: Record<number, string>;
  carePlanStatus: Record<string, CarePlanTaskStatus>;
  submittedCareLogs: Record<number, FollowupLogEntry[]>;
  readUpToByPatient: Record<number, number>;
  demoMapVisitsByPatient: Record<number, DemoMapVisitSeed>;
}

export const useCollaborationStore = create<CollaborationStore>((set, get) => ({
  messagesByPatient: initialMessages,
  readUpToByPatient: buildInitialReadCursors(initialMessages),
  eliteTaskTimes: demoActiveVisits.eliteTaskTimes,
  eliteCareLogs: {},
  eliteVoiceText: {},
  carePlanStatus: demoActiveVisits.carePlanStatus,
  demoMapVisitsByPatient: demoActiveVisits.visitByPatient,
  submittedCareLogs: {},

  setMessagesByPatient: (messagesByPatient) => set({ messagesByPatient }),

  appendMessage: (patientId, message) => {
    set(state => ({
      messagesByPatient: {
        ...state.messagesByPatient,
        [patientId]: [...(state.messagesByPatient[patientId] || []), message],
      },
    }));
  },

  markPatientMessagesRead: (patientId) => {
    const thread = get().messagesByPatient[patientId] || [];
    const last = thread[thread.length - 1];
    if (!last) return;
    set(state => ({
      readUpToByPatient: { ...state.readUpToByPatient, [patientId]: last.id },
    }));
  },

  refreshP7Messages: (_p7AlertActive: boolean) => {
    // P7 alert system removed — 长护险 no longer uses this
  },

  setEliteTaskClockIn: (taskKey, time) => {
    set(state => ({
      eliteTaskTimes: {
        ...state.eliteTaskTimes,
        [taskKey]: { ...state.eliteTaskTimes[taskKey], clockIn: time },
      },
    }));
  },

  setEliteTaskClockOut: (taskKey, time) => {
    set(state => ({
      eliteTaskTimes: {
        ...state.eliteTaskTimes,
        [taskKey]: { ...state.eliteTaskTimes[taskKey], clockOut: time },
      },
    }));
  },

  setEliteCareLogFields: (patientId, fields) => {
    set(state => ({
      eliteCareLogs: { ...state.eliteCareLogs, [patientId]: fields },
    }));
  },

  setEliteVoiceText: (patientId, text) => {
    set(state => ({
      eliteVoiceText: { ...state.eliteVoiceText, [patientId]: text },
    }));
  },

  setCarePlanTaskStatus: (taskKey, status) => {
    set(state => ({
      carePlanStatus: { ...state.carePlanStatus, [taskKey]: status },
    }));
  },

  appendSubmittedCareLog: (patientId, log) => {
    set(state => ({
      submittedCareLogs: {
        ...state.submittedCareLogs,
        [patientId]: [...(state.submittedCareLogs[patientId] || []), log],
      },
    }));
  },

  applyCollaborationSync: (payload, p7AlertActive) => {
    set(state => mergeCollaborationSlice(state, payload, p7AlertActive));
  },
}));

export function getCollaborationSyncSlice(state: CollaborationStore): CollaborationSyncSlice {
  return {
    messagesByPatient: state.messagesByPatient,
    eliteTaskTimes: state.eliteTaskTimes,
    eliteCareLogs: state.eliteCareLogs,
    eliteVoiceText: state.eliteVoiceText,
    carePlanStatus: state.carePlanStatus,
    submittedCareLogs: state.submittedCareLogs,
    readUpToByPatient: state.readUpToByPatient,
    demoMapVisitsByPatient: state.demoMapVisitsByPatient,
  };
}
