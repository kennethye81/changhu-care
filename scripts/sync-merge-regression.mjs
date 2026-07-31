#!/usr/bin/env node
/** Regression: Hub publish (ts=1000) must apply on tab whose lastSyncTs=500. */
import { mergeDemoSyncPayload } from '../src/sync/mergePayload.ts';

const baseVitals = {
  7: { hr: 84, bpSystolic: 138, bpDiastolic: 84, spo2: 93, temp: 37.0, rr: 20, bloodSugar: 110, avpu: 'A', onSupplementalO2: false, spo2Scale: 2 },
};

const alertVitals = {
  7: { hr: 98, bpSystolic: 140, bpDiastolic: 86, spo2: 90, temp: 38.3, rr: 26, bloodSugar: 118, avpu: 'A', onSupplementalO2: true, spo2Scale: 2 },
};

const localTab = {
  v: 2,
  ts: 500,
  p7AlertActive: false,
  vitals: baseVitals,
  resolvedAlertIds: [],
  messagesByPatient: {},
  eliteTaskTimes: {},
  eliteCareLogs: {},
  eliteVoiceText: {},
  carePlanStatus: {},
  submittedCareLogs: {},
};

const hubPublish = {
  ...localTab,
  ts: 1000,
  p7AlertActive: true,
  vitals: alertVitals,
};

const merged = mergeDemoSyncPayload(localTab, hubPublish);

if (merged.p7AlertActive !== true || merged.vitals[7].spo2 !== 90) {
  console.error('FAIL: Hub publish did not merge into Family tab state');
  process.exit(1);
}

// Broken behaviour we fixed: merge read used Date.now() (~999999) as local ts
const brokenLocal = { ...localTab, ts: 999999 };
const brokenMerge = mergeDemoSyncPayload(brokenLocal, hubPublish);
if (brokenMerge.p7AlertActive === true) {
  console.error('FAIL: sanity check — high local ts should block remote (this is why Date.now() merge read was wrong)');
  process.exit(1);
}

console.log('PASS: sync merge ts semantics OK');

const readLocal = {
  ...localTab,
  ts: 600,
  readUpToByPatient: { 7: 7103 },
  demoMapVisitsByPatient: { 3: { time: '09:00', activity: 'RN Visit', type: 'nurse_visit', provider: 'Sarah Leung' } },
};

const readRemote = {
  ...localTab,
  ts: 800,
  readUpToByPatient: { 7: 7101, 3: 3001 },
  demoMapVisitsByPatient: { 7: { time: '14:00', activity: 'POCT', type: 'monitoring', provider: 'Jenny Tam' } },
};

const readMerged = mergeDemoSyncPayload(readLocal, readRemote);
if (readMerged.readUpToByPatient[7] !== 7103 || readMerged.readUpToByPatient[3] !== 3001) {
  console.error('FAIL: readUpToByPatient should merge by max id per patient');
  process.exit(1);
}
if (!readMerged.demoMapVisitsByPatient[7] || !readMerged.demoMapVisitsByPatient[3]) {
  console.error('FAIL: demoMapVisitsByPatient should merge both patient seeds');
  process.exit(1);
}

console.log('PASS: collaboration cursor + map visit merge OK');
