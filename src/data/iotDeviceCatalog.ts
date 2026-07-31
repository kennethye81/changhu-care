// === 长护险 (ChangHu Care) IoT 设备目录 ===

import type { PatientFull } from './patients';

export type IotDevice = PatientFull['iotDevices'][number];
type DeviceTemplate = Omit<IotDevice, 'serial' | 'status' | 'battery' | 'lastSync'>;

const CORE_CHANGHU: DeviceTemplate[] = [
  { type: '血压监测仪', model: '欧姆龙 HEM-7361T', parameters: ['收缩压', '舒张压', '脉搏', '心律不齐检测'] },
  { type: '血氧仪', model: 'Nonin Bluetooth 3230', parameters: ['SpO₂', '心率', '灌注指数'] },
  { type: '体温计', model: 'Braun BNT400 Bluetooth', parameters: ['体温', '趋势', '发热提醒'] },
  { type: '跌倒检测手环', model: '智能守护 S2', parameters: ['跌倒检测', 'SOS呼叫', '心率', 'GPS定位'] },
  { type: '减压气垫床', model: '迈德康 防压疮型', parameters: ['压力交替周期', '使用时长', '气泵状态'] },
];

const GPS_TRACKER: DeviceTemplate = {
  type: 'GPS定位器',
  model: '守护星 Locator Pro',
  parameters: ['实时定位', '电子围栏', 'SOS按钮', '历史轨迹'],
};

const EMERGENCY_CALL: DeviceTemplate = {
  type: '床头呼叫铃',
  model: '康护通 CallBell S1',
  parameters: ['呼叫状态', '响应时间', '电池电量'],
};

function needsGps(patient: PatientFull): boolean {
  return (patient.fallRisk?.score ?? 0) > 35 || patient.careLevel === '重度';
}

function needsEmergencyCall(patient: PatientFull): boolean {
  return (patient.barthel?.score ?? 60) < 40;
}

function serialFor(patientId: number, type: string, index: number): string {
  const prefix = type.replace(/[^A-Za-z0-9\u4e00-\u9fff]/g, '').slice(0, 4).toUpperCase() || 'DEV';
  return `${prefix}-2026-${String(patientId).padStart(2, '0')}${String(index).padStart(2, '0')}`;
}

function mergeParameters(existing: string[], required: string[]): string[] {
  const out = [...existing];
  for (const p of required) {
    const key = p.slice(0, 4);
    if (!out.some(x => x.slice(0, 4) === key)) out.push(p);
  }
  return out;
}

function findByType(devices: IotDevice[], type: string): IotDevice | undefined {
  return devices.find(d => d.type === type);
}

export function ensureChangHuDevices(patient: PatientFull): IotDevice[] {
  const required: DeviceTemplate[] = [...CORE_CHANGHU];
  if (needsGps(patient)) required.push(GPS_TRACKER);
  if (needsEmergencyCall(patient)) required.push(EMERGENCY_CALL);

  const usedSerials = new Set<string>();
  const result: IotDevice[] = [];
  let idx = 0;

  for (const tmpl of required) {
    const existing = findByType(patient.iotDevices, tmpl.type);
    if (existing) {
      usedSerials.add(existing.serial);
      result.push({ ...existing, model: tmpl.model, parameters: mergeParameters(existing.parameters, tmpl.parameters) });
    } else {
      idx += 1;
      result.push({ ...tmpl, serial: serialFor(patient.id, tmpl.type, idx), status: 'Connected', battery: 88, lastSync: '30秒前' });
    }
  }

  for (const d of patient.iotDevices) {
    if (usedSerials.has(d.serial)) continue;
    if (required.some(t => t.type === d.type)) continue;
    result.push(d);
  }

  return result;
}

export function enrichAllPatientDevices(patients: PatientFull[]): PatientFull[] {
  return patients.map(p => ({ ...p, iotDevices: ensureChangHuDevices(p) }));
}
