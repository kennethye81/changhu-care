// === 中国大陆地址 → lat/lng 地理编码 ===

import { type PatientSummary } from '../store/patientStore';

export const HK_GEO: Record<string, [number, number]> = {
  '江苏省苏州市吴中区木渎镇金山南路168号': [31.678, 119.535], // 常州金坛
};

export function getPatientCoords(p: PatientSummary): [number, number] {
  return HK_GEO[p.address] || [31.810, 119.970]; // fallback: 常州中心
}

/** 中国大陆默认视图 — 江苏省 */ 
export const HK_MAP_BOUNDS_SW: [number, number] = [30.5, 118.0];
export const HK_MAP_BOUNDS_NE: [number, number] = [33.0, 121.0];
export const HK_MAP_CENTER: [number, number] = [31.810, 119.970];

export const HK_MAP_DEFAULT_VIEW_SW: [number, number] = [30.8, 118.5];
export const HK_MAP_DEFAULT_VIEW_NE: [number, number] = [32.8, 120.8];
