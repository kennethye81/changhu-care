#!/usr/bin/env node
/**
 * Three-end demo smoke test: HTTP routes + WS sync (Hub / Family / Elite simulation).
 * Run with dev:demo active: npm run dev:demo
 */
import WebSocket from 'ws';

const WS_URL = process.env.IHOMECARE_SYNC_WS_URL || 'ws://localhost:5199';
const VITE_PORT = process.env.SMOKE_VITE_PORT || '5174';
const BASE = `http://localhost:${VITE_PORT}`;

const P7_DAY1_IDS = [7101, 7102, 7103, 7104, 7105];
const P7_ALERT_IDS = [7001, 7002, 7003, 7004, 7005];

const results = [];

function record(name, ok, detail = '') {
  results.push({ name, ok, detail });
  const mark = ok ? 'PASS' : 'FAIL';
  console.log(`${mark}  ${name}${detail ? ` — ${detail}` : ''}`);
}

function baseVitals(alert = false) {
  return {
    7: alert
      ? { hr: 98, bpSystolic: 140, bpDiastolic: 86, spo2: 90, temp: 38.3, rr: 26, bloodSugar: 118, avpu: 'A', onSupplementalO2: true, spo2Scale: 2 }
      : { hr: 84, bpSystolic: 138, bpDiastolic: 84, spo2: 93, temp: 37.0, rr: 20, bloodSugar: 110, avpu: 'A', onSupplementalO2: false, spo2Scale: 2 },
  };
}

function p7TemplateMessages(alert) {
  const ids = alert ? P7_ALERT_IDS : P7_DAY1_IDS;
  return ids.map((id, i) => ({
    id,
    from: 'system',
    senderName: 'System',
    text: `template-${id}`,
    time: `10:0${i}`,
    patientId: 7,
  }));
}

function makePayload(overrides = {}) {
  const p7AlertActive = overrides.p7AlertActive ?? false;
  return {
    v: 3,
    ts: overrides.ts ?? Date.now(),
    p7AlertActive,
    vitals: overrides.vitals ?? baseVitals(p7AlertActive),
    resolvedAlertIds: overrides.resolvedAlertIds ?? [],
    iotDevicesByPatient: overrides.iotDevicesByPatient ?? {},
    deviceStatuses: overrides.deviceStatuses ?? {},
    messagesByPatient: overrides.messagesByPatient ?? { 7: p7TemplateMessages(p7AlertActive) },
    eliteTaskTimes: overrides.eliteTaskTimes ?? {},
    eliteCareLogs: overrides.eliteCareLogs ?? {},
    eliteVoiceText: overrides.eliteVoiceText ?? {},
    carePlanStatus: overrides.carePlanStatus ?? {},
    submittedCareLogs: overrides.submittedCareLogs ?? {},
  };
}

async function checkHttp(path, label) {
  try {
    const res = await fetch(`${BASE}${path}`);
    record(`HTTP ${label}`, res.ok, `${res.status} ${BASE}${path}`);
  } catch (err) {
    record(`HTTP ${label}`, false, String(err.message || err));
  }
}

function connectClient(label) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(WS_URL);
    const inbox = [];

    ws.on('message', (raw) => {
      try {
        inbox.push(JSON.parse(String(raw)));
      } catch {
        // ignore
      }
    });

    ws.on('open', () => {
      resolve({
        label,
        ws,
        inbox,
        send(payload) {
          ws.send(JSON.stringify({ type: 'sync', payload }));
        },
        waitFor(predicate, timeoutMs = 5000) {
          return new Promise((res, rej) => {
            const started = Date.now();
            const tick = () => {
              const hit = inbox.find(predicate);
              if (hit) return res(hit);
              if (Date.now() - started > timeoutMs) {
                return rej(new Error(`${label}: timeout waiting for sync message`));
              }
              setTimeout(tick, 50);
            };
            tick();
          });
        },
        close() {
          ws.close();
        },
      });
    });

    ws.on('error', reject);
  });
}

async function runSyncTests() {
  const hub = await connectClient('Hub');
  const family = await connectClient('Family');
  const elite = await connectClient('Elite');

  try {
    // 1) P7 alert ON — Hub toggles, all clients receive alert vitals
    const t1 = Date.now();
    hub.send(makePayload({ ts: t1, p7AlertActive: true, vitals: baseVitals(true) }));

    const hubAlert = await hub.waitFor(m => m?.payload?.p7AlertActive === true);
    const familyAlert = await family.waitFor(m => m?.payload?.p7AlertActive === true);
    const eliteAlert = await elite.waitFor(m => m?.payload?.p7AlertActive === true);

    const vitalsOk = [hubAlert, familyAlert, eliteAlert].every(
      m => m.payload.vitals?.[7]?.spo2 === 90 && m.payload.vitals?.[7]?.temp === 38.3 && m.payload.vitals?.[7]?.rr === 26,
    );
    record('P7 alert ON sync (3 clients)', vitalsOk, vitalsOk ? 'SpO₂ 90%, Temp 38.3°C, RR 26' : 'vitals mismatch');

    // 1b) NEWS High fields present
    const newsFieldsOk = [hubAlert, familyAlert, eliteAlert].every(
      m => m.payload.vitals?.[7]?.onSupplementalO2 === true && m.payload.vitals?.[7]?.spo2Scale === 2,
    );
    record('P7 NEWS escalation vitals (O₂ + Scale 2)', newsFieldsOk);

    // 2) Family chat — custom message survives Hub stale full payload (merge fix)
    const familyMsg = {
      id: 72001,
      from: 'family',
      senderName: 'Mrs. Chan (Chan Siu Ling)',
      text: 'Smoke test — Family message must not be lost.',
      time: '17:05',
      patientId: 7,
    };
    const t2 = Date.now() + 1;
    family.send(makePayload({
      ts: t2,
      p7AlertActive: true,
      vitals: baseVitals(true),
      messagesByPatient: {
        7: [...p7TemplateMessages(true), familyMsg],
      },
    }));

    await family.waitFor(m => (m.payload.messagesByPatient?.[7] || []).some(x => x.id === 72001));

    const t3 = Date.now() + 2;
    hub.send(makePayload({
      ts: t3,
      p7AlertActive: true,
      vitals: baseVitals(true),
      messagesByPatient: { 7: p7TemplateMessages(true) },
    }));

    const merged = await hub.waitFor(
      m => (m.payload.messagesByPatient?.[7] || []).some(x => x.id === 72001),
    );
    record(
      'Chat merge (Family msg + Hub stale payload)',
      (merged.payload.messagesByPatient[7] || []).some(x => x.id === 72001),
      'custom id 72001 preserved',
    );

    // 3) Hub reply visible on Family
    const hubReply = {
      id: 72002,
      from: 'nurse',
      senderName: 'Jenny Tam (RN)',
      text: 'Smoke test — Hub reply synced to all tabs.',
      time: '17:06',
      patientId: 7,
    };
    const t4 = Date.now() + 3;
    hub.send(makePayload({
      ts: t4,
      p7AlertActive: true,
      vitals: baseVitals(true),
      messagesByPatient: {
        7: [...p7TemplateMessages(true), familyMsg, hubReply],
      },
    }));

    const familyMerged = await family.waitFor(
      m => (m.payload.messagesByPatient?.[7] || []).some(x => x.id === 72002),
    );
    const bothMsgs = (familyMerged.payload.messagesByPatient[7] || []).filter(
      x => x.id === 72001 || x.id === 72002,
    ).length === 2;
    record('Chat merge (Hub reply → Family)', bothMsgs, '72001 + 72002 on Family');

    // 4) Elite care log submit → merged submittedCareLogs
    const careLog = {
      date: '2026-06-18',
      time: '17:10',
      type: 'Elite Care Log',
      detail: 'Smoke test care log entry.',
      author: 'Sarah Leung',
      role: 'RN',
      status: 'escalated',
    };
    const t5 = Date.now() + 4;
    elite.send(makePayload({
      ts: t5,
      p7AlertActive: true,
      vitals: baseVitals(true),
      messagesByPatient: merged.payload.messagesByPatient,
      submittedCareLogs: { 7: [careLog] },
    }));

    const familyLogs = await family.waitFor(
      m => (m.payload.submittedCareLogs?.[7] || []).some(
        l => l.detail === 'Smoke test care log entry.',
      ),
    );
    record(
      'Elite care log → Family (submittedCareLogs)',
      Boolean(familyLogs.payload.submittedCareLogs?.[7]?.length),
      'log visible on Family client',
    );

    // 5) P7 alert OFF — deactivate sync
    const t6 = Date.now() + 5;
    hub.send(makePayload({
      ts: t6,
      p7AlertActive: false,
      vitals: baseVitals(false),
      messagesByPatient: familyMerged.payload.messagesByPatient,
      submittedCareLogs: familyLogs.payload.submittedCareLogs,
    }));

    const off = await elite.waitFor(m => m.payload.p7AlertActive === false);
    const offVitals = off.payload.vitals?.[7]?.spo2 === 93;
    record('P7 alert OFF sync', offVitals, offVitals ? 'SpO₂ back to 93%' : 'vitals not restored');

    // 6) IoT devices sync payload (v3)
    const sampleDevices = [
      { type: 'Pulse Oximeter', model: 'Nonin Bluetooth 3230', serial: 'SP-SMOKE-07', status: 'Connected', battery: 88, parameters: ['SpO₂ (NEWS)'], lastSync: 'now' },
    ];
    const t7 = Date.now() + 6;
    hub.send(makePayload({
      ts: t7,
      p7AlertActive: false,
      vitals: baseVitals(false),
      iotDevicesByPatient: { 7: sampleDevices },
      messagesByPatient: familyMerged.payload.messagesByPatient,
      submittedCareLogs: familyLogs.payload.submittedCareLogs,
    }));
    const iotSync = await family.waitFor(
      m => (m.payload.iotDevicesByPatient?.[7] || []).some(d => d.serial === 'SP-SMOKE-07'),
    );
    record('IoT devices sync (Hub → Family)', Boolean(iotSync.payload.iotDevicesByPatient?.[7]?.length), 'v3 iotDevicesByPatient');
  } finally {
    hub.close();
    family.close();
    elite.close();
  }
}

async function main() {
  console.log(`\n=== iHomeCare demo smoke test ===`);
  console.log(`Vite: ${BASE}  |  WS: ${WS_URL}\n`);

  await checkHttp('/', 'Hub');
  await checkHttp('/family', 'Family');
  await checkHttp('/elites', 'Elite');

  try {
    await runSyncTests();
  } catch (err) {
    record('WS sync suite', false, String(err.message || err));
  }

  const passed = results.filter(r => r.ok).length;
  const failed = results.filter(r => !r.ok);
  console.log(`\n=== Summary: ${passed}/${results.length} passed ===`);
  if (failed.length) {
    failed.forEach(f => console.log(`  ✗ ${f.name}: ${f.detail}`));
    process.exit(1);
  }
  console.log('All smoke checks passed.\n');
}

main();
