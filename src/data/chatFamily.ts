/** Family caregiver metadata — gender/relationship drives avatar generation and display. */
export interface FamilyContact {
  name: string;
  gender: 'M' | 'F';
  relation: 'wife' | 'husband' | 'daughter' | 'son' | 'brother' | 'mother' | 'father';
  age: number;
}

function inferGenderFromLabel(label: string): 'M' | 'F' {
  const lower = label.toLowerCase();
  if (/(wife|daughter|mrs\.|mother|sister)/.test(lower)) return 'F';
  if (/(husband|son|brother|father|mr\.)/.test(lower)) return 'M';
  return 'F';
}

function inferRelation(label: string, gender: 'M' | 'F' = 'F'): FamilyContact['relation'] {
  const lower = label.toLowerCase();
  if (lower.includes('wife') || lower.includes('mrs.')) return 'wife';
  if (lower.includes('husband')) return 'husband';
  if (lower.includes('daughter')) return 'daughter';
  if (lower.includes('son')) return 'son';
  if (lower.includes('brother')) return 'brother';
  if (lower.includes('mother')) return 'mother';
  if (lower.includes('father')) return 'father';
  if (lower.includes('spouse')) return gender === 'M' ? 'husband' : 'wife';
  return gender === 'M' ? 'son' : 'daughter';
}

/** Parse "(Wife)" / "(Daughter)" suffix from display name. */
function parseFamilyEntry(name: string, age: number, gender?: 'M' | 'F'): FamilyContact {
  const g = gender ?? inferGenderFromLabel(name);
  return { name, gender: g, relation: inferRelation(name, g), age };
}

/** Ages aligned to patient age + relationship (see patients.ts / patientRecords). */
export const FAMILY_CONTACT_BY_PATIENT: Record<number, FamilyContact> = {
  1:  parseFamilyEntry('陈玉兰（配偶）', 78, 'F'),
  2:  parseFamilyEntry('周明辉（儿子）', 44, 'M'),
  3:  parseFamilyEntry('Lam Wai Leng (Spouse)', 43, 'F'),
  4:  parseFamilyEntry('Lau Wai Hung (Son)', 52, 'M'),
  5:  parseFamilyEntry('Mrs. Ho (Chan Siu Ling)', 70, 'F'),
  6:  parseFamilyEntry('Ng Ka Yan (Daughter)', 40, 'F'),
  7:  parseFamilyEntry('陈玉兰', 78, 'F'),
  8:  parseFamilyEntry('Chow Mei Ling (Daughter)', 45, 'F'),
  9:  parseFamilyEntry('Lam Ka Ho (Son)', 42, 'M'),
  10: parseFamilyEntry('Cheung Lai King (Wife)', 74, 'F'),
  11: parseFamilyEntry('Wong Ka Wai (Husband)', 64, 'M'),
  12: parseFamilyEntry('Fok Siu Ying (Daughter)', 42, 'F'),
  13: parseFamilyEntry('Lau Man Fai (Brother)', 52, 'M'),
  14: parseFamilyEntry('Tsang Mei Fong (Wife)', 78, 'F'),
  15: parseFamilyEntry('Mak Ching Yee (Wife)', 56, 'F'),
  16: parseFamilyEntry('Fung Wai Man (Son)', 56, 'M'),
  17: parseFamilyEntry('Chan Wai Keung (Husband)', 73, 'M'),
  18: parseFamilyEntry('Mrs. Zhang (Lin Xia)', 56, 'F'),
};

export const FAMILY_SENDER_BY_PATIENT: Record<number, string> = Object.fromEntries(
  Object.entries(FAMILY_CONTACT_BY_PATIENT).map(([id, c]) => [Number(id), c.name]),
);

/** Back-compat alias used in chatExtras seed data. */
export const NEW_CHAT_NAMES: Record<number, { name: string; familyName: string }> = Object.fromEntries(
  Object.entries(FAMILY_CONTACT_BY_PATIENT)
    .filter(([id]) => Number(id) >= 8)
    .map(([id, c]) => [Number(id), { name: '', familyName: c.name }]),
);

// Fill patient names for P8–17 from patient records
const PATIENT_NAMES_8_18: Record<number, string> = {
  8: 'Chow Kwok Fai', 9: 'Lam Siu Wan', 10: 'Cheung Siu Ming', 11: 'Wong Lai Chun',
  12: 'Fok Wai Keung', 13: 'Lau Wai Yin', 14: 'Tsang Kwok Hung', 15: 'Mak Ka Ming',
  16: 'Fung Kam Tong', 17: 'Chan Yuk Lin', 18: 'Zhang Jianguo',
};
for (const [id, patientName] of Object.entries(PATIENT_NAMES_8_18)) {
  const n = Number(id);
  if (NEW_CHAT_NAMES[n]) NEW_CHAT_NAMES[n].name = patientName;
}

/** Bump when regenerating PNGs so browsers drop stale cached images. */
export const FAMILY_AVATAR_VERSION = '3';

export function familyAvatarPath(patientId: number): string {
  return `/avatars/family-${patientId}.png?v=${FAMILY_AVATAR_VERSION}`;
}

export function parseSenderGender(senderName: string): 'M' | 'F' | null {
  const lower = senderName.toLowerCase();
  if (/(wife|daughter|mrs\.|mother|sister|spouse|mei ling|siu ming|wai leng|lai king|siu ying|mei fong|ching yee|siu ling)/.test(lower)) return 'F';
  if (/(husband|son|brother|mr\.|father|ka ho|wai hung|ka wai|wai man|wai keung|man fai)/.test(lower)) return 'M';
  return null;
}
