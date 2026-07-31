import { CARE_TEAM } from './careTeam';

/** Bump when regenerating staff PNGs — appended as ?v= query on avatar URLs. */
export const STAFF_AVATAR_VERSION = '4';

/** Explicit staff avatar paths — longest / most specific names first for lookup. */
export const STAFF_AVATAR_BY_NAME: Record<string, string> = {
  'Dr. Chan Chi Keung': '/avatars/dr-chan-chi-keung.png',
  'Dr. Lee Mei Ling': '/avatars/dr-lee-mei-ling.png',
  'Dr. Cheung Kwok Wai': '/avatars/dr-cheung-kwok-wai.png',
  'Dr. Wang Wei': '/avatars/dr-wang-wei.png',
  'Dr. Wang Wei (Thoracic Surgeon)': '/avatars/dr-wang-wei.png',
  'Peter Ho (Case Manager)': '/avatars/peter-ho.png',
  'Peter Ho': '/avatars/peter-ho.png',
  'Sarah Leung (RN)': '/avatars/sarah-leung.png',
  'Sarah Leung': '/avatars/sarah-leung.png',
  'Nurse Sarah': '/avatars/sarah-leung.png',
  'Nurse Sarah Leung': '/avatars/sarah-leung.png',
  'Jenny Tam (RN)': '/avatars/jenny-tam.png',
  'Jenny Tam': '/avatars/jenny-tam.png',
  'Grace Tang (Case Manager)': '/avatars/grace-tang.png',
  'Grace Tang': '/avatars/grace-tang.png',
  'Angela Ng (RN)': '/avatars/angela-ng.png',
  'Angela Ng': '/avatars/angela-ng.png',
  'Connie Cheung (RN)': '/avatars/connie-cheung.png',
  'Connie Cheung': '/avatars/connie-cheung.png',
  'Vivian Lau (RN)': '/avatars/vivian-lau.png',
  'Vivian Lau': '/avatars/vivian-lau.png',
  'Anna Leung (Case Manager)': '/avatars/anna-leung.png',
  'Anna Leung': '/avatars/anna-leung.png',
  'Tony Lam (Case Manager)': '/avatars/tony-lam.png',
  'Tony Lam': '/avatars/tony-lam.png',
  'David Chan': '/avatars/david-chan.png',
  'Michael Kwok': '/avatars/michael-kwok.png',
  'Eric Chan': '/avatars/eric-chan.png',
  'Raymond Wong': '/avatars/raymond-wong.png',
  'Lisa Cheng': '/avatars/lisa-cheng.png',
  'Maggie Lam': '/avatars/maggie-lam.png',
};

const STAFF_KEYS_BY_LENGTH = Object.keys(STAFF_AVATAR_BY_NAME).sort((a, b) => b.length - a.length);

export function normalizeStaffSenderName(name: string): string {
  return name
    .replace(/^🤖\s*iHomeCare AI\s*$/i, '')
    .replace(/^AI Monitor\s*$/i, '')
    .replace(/^Nurse Sarah Leung$/i, 'Sarah Leung')
    .replace(/^Nurse Sarah$/i, 'Sarah Leung')
    .trim();
}

export function resolveStaffAvatarPath(senderName: string): string | null {
  const raw = normalizeStaffSenderName(senderName);
  if (!raw || raw === 'System') return null;

  if (STAFF_AVATAR_BY_NAME[raw]) return withVersion(STAFF_AVATAR_BY_NAME[raw]);

  // Strip trailing role suffix: "(RN)", "(Case Manager)", "(Respiratory)"
  const stripped = raw.replace(/\s*\([^)]+\)\s*$/g, '').trim();
  if (STAFF_AVATAR_BY_NAME[stripped]) return withVersion(STAFF_AVATAR_BY_NAME[stripped]);

  for (const key of STAFF_KEYS_BY_LENGTH) {
    if (raw === key || raw.startsWith(`${key} `)) return withVersion(STAFF_AVATAR_BY_NAME[key]);
  }

  for (const [key, member] of Object.entries(CARE_TEAM)) {
    if (raw === key || raw.startsWith(`${key} `)) {
      if (member.avatar?.startsWith('/')) return withVersion(member.avatar);
    }
  }

  return null;
}

function withVersion(path: string): string {
  return `${path}?v=${STAFF_AVATAR_VERSION}`;
}

export function staffInitials(senderName: string): string {
  const name = normalizeStaffSenderName(senderName)
    .replace(/\s*\([^)]+\)\s*$/g, '')
    .replace(/^Dr\.\s*/, '');
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';
}
