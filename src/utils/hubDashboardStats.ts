import type { PatientFull } from '../data/patients';
import type { DeviceStatus } from '../store/patientStore';
import type { EliteTaskTimes } from '../store/collaborationStore';

function staffKey(name: string | undefined): string | null {
  if (!name) return null;
  return name.split(' (')[0].trim();
}

export function computeCareTeamStats(
  patients: PatientFull[],
  eliteTaskTimes: Record<string, EliteTaskTimes>,
): { total: number; onDuty: number } {
  const assigned = new Set<string>();
  for (const patient of patients) {
    const cp = patient.carePlan;
    [
      cp.assignedDoctor,
      cp.assignedNurse,
      cp.assignedCaseManager,
      cp.assignedCareWorker,
      cp.assignedRehabTherapist,
    ]
      .map(staffKey)
      .filter(Boolean)
      .forEach(name => assigned.add(name!));
  }

  const onDutyKeys = Object.entries(eliteTaskTimes).filter(
    ([, times]) => Boolean(times.clockIn) && !times.clockOut,
  );

  return {
    total: assigned.size,
    onDuty: onDutyKeys.length,
  };
}

export function computeDeviceStats(
  patients: PatientFull[],
  deviceStatuses: Record<string, DeviceStatus>,
): { total: number; online: number } {
  let total = 0;
  let online = 0;

  for (const patient of patients) {
    for (const device of patient.iotDevices) {
      total += 1;
      const status = deviceStatuses[device.serial]?.status ?? device.status;
      if (status === 'Connected') online += 1;
    }
  }

  return { total, online };
}
