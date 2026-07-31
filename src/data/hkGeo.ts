// === Hong Kong address → lat/lng geocoding ===

import { type PatientSummary } from '../store/patientStore';
import { NEW_HK_GEO } from './newPatients/hkGeoExtras';

export const HK_GEO: Record<string, [number, number]> = {
  'Flat 8B, Block 5, Laguna City, Cha Kwo Ling, Kowloon': [22.3083, 114.2238],
  'Room 1805, Block 2, Whampoa Garden, Hung Hom, Kowloon': [22.3047, 114.1892],
  'Flat 22C, Block 6, Mei Foo Sun Chuen, Lai Chi Kok, Kowloon': [22.3374, 114.1380],
  'Flat 3A, Block 1, Telford Gardens, Kowloon Bay, Kowloon': [22.3235, 114.2090],
  'Flat 15A, Block 2, Bel-Air Residence, Pok Fu Lam, HK Island': [22.2578, 114.1302],
  'Flat 7B, Block 3, South Horizons, Ap Lei Chau, HK Island': [22.2412, 114.1528],
  'Flat 12B, Block 8, City One Shatin, Ngan Shing Street, Sha Tin, New Territories': [22.3845, 114.2017],
  ...NEW_HK_GEO,
};

export function getPatientCoords(p: PatientSummary): [number, number] {
  return HK_GEO[p.address] || [22.3193, 114.1694]; // fallback: HK center
}

/** Hong Kong SAR bounding box — map pan/zoom limits. */
export const HK_MAP_BOUNDS_SW: [number, number] = [22.153, 113.834];
export const HK_MAP_BOUNDS_NE: [number, number] = [22.561, 114.441];
export const HK_MAP_CENTER: [number, number] = [22.352, 114.127];

/** Default MapView frame on open — full urban HK (matches Command Center screenshot). */
export const HK_MAP_DEFAULT_VIEW_SW: [number, number] = [22.18, 113.90];
export const HK_MAP_DEFAULT_VIEW_NE: [number, number] = [22.48, 114.30];
