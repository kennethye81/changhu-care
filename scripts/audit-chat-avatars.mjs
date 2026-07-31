#!/usr/bin/env node
/**
 * Audit chat sender names vs avatar PNG files on disk.
 * Usage: node scripts/audit-chat-avatars.mjs
 */
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const AVATARS = join(ROOT, 'public', 'avatars');

const STAFF_MAP = {
  'Dr. Chan Chi Keung': 'dr-chan-chi-keung.png',
  'Dr. Lee Mei Ling': 'dr-lee-mei-ling.png',
  'Dr. Cheung Kwok Wai': 'dr-cheung-kwok-wai.png',
  'Peter Ho (Case Manager)': 'peter-ho.png',
  'Peter Ho': 'peter-ho.png',
  'Sarah Leung (RN)': 'sarah-leung.png',
  'Sarah Leung': 'sarah-leung.png',
  'Nurse Sarah': 'sarah-leung.png',
  'Nurse Sarah Leung': 'sarah-leung.png',
  'Jenny Tam (RN)': 'jenny-tam.png',
  'Grace Tang (Case Manager)': 'grace-tang.png',
  'Angela Ng (RN)': 'angela-ng.png',
  'Connie Cheung (RN)': 'connie-cheung.png',
  'Vivian Lau (RN)': 'vivian-lau.png',
  'Anna Leung (Case Manager)': 'anna-leung.png',
  'Tony Lam (Case Manager)': 'tony-lam.png',
  'Maggie Lam': 'maggie-lam.png',
};

function stripRole(name) {
  return name.replace(/\s*\([^)]+\)\s*$/g, '').trim();
}

function resolveStaffFile(name) {
  if (STAFF_MAP[name]) return STAFF_MAP[name];
  const stripped = stripRole(name);
  if (STAFF_MAP[stripped]) return STAFF_MAP[stripped];
  for (const [key, file] of Object.entries(STAFF_MAP)) {
    if (name.startsWith(key)) return file;
  }
  return null;
}

function extractSenders(src) {
  const senders = [];
  const re = /(?:senderName:\s*'([^']+)'|msg\('(?:doctor|nurse|caseManager|family|ai|system)',\s*'([^']+)'|from:\s*'(?:doctor|nurse|caseManager|family|ai|system)'[^}]*senderName:\s*'([^']+)'|msg\('family',\s*p\.familyName)/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    if (m[1]) senders.push(m[1]);
    if (m[2]) senders.push(m[2]);
    if (m[3]) senders.push(m[3]);
  }
  return senders;
}

async function main() {
  const chatFiles = [
    join(ROOT, 'src', 'data', 'chatMessages.ts'),
    join(ROOT, 'src', 'data', 'newPatients', 'chatExtras.ts'),
  ];
  const familyMeta = await readFile(join(ROOT, 'src', 'data', 'chatFamily.ts'), 'utf8');
  const familyIds = [...familyMeta.matchAll(/^\s*(\d+):\s*parseFamilyEntry\(/gm)].map(m => Number(m[1]));

  const staffSenders = new Set();
  for (const file of chatFiles) {
    const src = await readFile(file, 'utf8');
    for (const s of extractSenders(src)) {
      if (s.includes('🤖') || s === 'System' || s === 'p.familyName') continue;
      staffSenders.add(s);
    }
  }

  console.log('=== Family avatars (family-{id}.png) ===');
  const missingFamily = [];
  for (const id of familyIds.sort((a, b) => a - b)) {
    const file = `family-${id}.png`;
    const ok = existsSync(join(AVATARS, file));
    console.log(`${ok ? '✓' : '✗'} P${id} ${file}`);
    if (!ok) missingFamily.push(file);
  }

  console.log('\n=== Staff / doctor senders in chat ===');
  const missingStaff = [];
  const unmapped = [];
  for (const name of [...staffSenders].sort()) {
    const lower = name.toLowerCase();
    if (lower.includes('wife') || lower.includes('daughter') || lower.includes('husband') || lower.includes('son') || lower.includes('brother') || lower.includes('mrs.') || lower.includes('(wife)') || lower.includes('(daughter)')) {
      console.log(`· ${name} → family PNG by patientId`);
      continue;
    }
    const file = resolveStaffFile(name);
    if (!file) {
      unmapped.push(name);
      console.log(`? ${name} → no mapping`);
      continue;
    }
    const ok = existsSync(join(AVATARS, file));
    console.log(`${ok ? '✓' : '✗'} ${name} → ${file}`);
    if (!ok) missingStaff.push({ name, file });
  }

  console.log('\n=== Summary ===');
  console.log(`Family missing: ${missingFamily.length}`);
  console.log(`Staff PNG missing: ${missingStaff.length}`);
  console.log(`Unmapped senders: ${unmapped.length}`);
  if (missingFamily.length || missingStaff.length || unmapped.length) process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
