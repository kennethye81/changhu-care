#!/usr/bin/env node
/**
 * Generate patient / family / staff avatar headshots via fal.ai (FLUX).
 *
 * Usage:
 *   FAL_KEY=your-key node scripts/generate-avatars-fal.mjs --group=family
 *   FAL_KEY=your-key node scripts/generate-avatars-fal.mjs --group=patients --ids=1,7
 *   FAL_KEY=your-key node scripts/generate-avatars-fal.mjs --group=staff
 *   FAL_KEY=your-key node scripts/generate-avatars-fal.mjs --group=all
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'public', 'avatars');
const MODEL = process.env.FAL_MODEL ?? 'fal-ai/flux/dev';

const PATIENTS = [
  { id: 1, name: 'Cheung Wai Man', gender: 'M', age: 78, condition: 'heart failure patient' },
  { id: 2, name: 'Wong Chi Ming', gender: 'F', age: 74, condition: 'COPD patient' },
  { id: 3, name: 'Lam Ka Chun', gender: 'M', age: 45, condition: 'pneumonia recovery patient' },
  { id: 4, name: 'Lau Suk Yee', gender: 'F', age: 81, condition: 'elderly UTI recovery patient' },
  { id: 5, name: 'Ho Tai Wai', gender: 'M', age: 72, condition: 'cellulitis recovery patient' },
  { id: 6, name: 'Ng Siu Wan', gender: 'F', age: 67, condition: 'DVT anticoagulation patient' },
  { id: 7, name: 'Chan Tai Ming', gender: 'M', age: 82, condition: 'COPD and pneumonia recovery patient' },
  { id: 8, name: 'Chow Kwok Fai', gender: 'M', age: 72, condition: 'post-PCI cardiac patient' },
  { id: 9, name: 'Lam Siu Wan', gender: 'F', age: 68, condition: 'COPD patient on oxygen' },
  { id: 10, name: 'Cheung Siu Ming', gender: 'M', age: 76, condition: 'stroke recovery patient' },
  { id: 11, name: 'Wong Lai Chun', gender: 'F', age: 62, condition: 'post-surgery oncology patient' },
  { id: 12, name: 'Fok Wai Keung', gender: 'M', age: 69, condition: 'heart failure patient' },
  { id: 13, name: 'Lau Wai Yin', gender: 'F', age: 55, condition: 'diabetes patient' },
  { id: 14, name: 'Tsang Kwok Hung', gender: 'M', age: 80, condition: 'chronic kidney disease patient' },
  { id: 15, name: 'Mak Ka Ming', gender: 'M', age: 58, condition: 'hypertension and sleep apnea patient' },
  { id: 16, name: 'Fung Kam Tong', gender: 'M', age: 83, condition: 'hip fracture recovery patient' },
  { id: 17, name: 'Chan Yuk Lin', gender: 'F', age: 71, condition: 'respiratory infection recovery patient' },
];

/** Must match src/data/chatFamily.ts FAMILY_CONTACT_BY_PATIENT — gender from relationship, NOT patient id. */
const FAMILY = [
  { id: 1, gender: 'F', age: 76, relation: 'wife of heart failure patient' },
  { id: 2, gender: 'F', age: 45, relation: 'adult daughter caring for COPD mother' },
  { id: 3, gender: 'F', age: 43, relation: 'wife of pneumonia recovery patient' },
  { id: 4, gender: 'M', age: 52, relation: 'adult son caring for elderly mother with UTI' },
  { id: 5, gender: 'F', age: 70, relation: 'wife of cellulitis recovery patient' },
  { id: 6, gender: 'F', age: 40, relation: 'adult daughter caring for mother on warfarin' },
  { id: 7, gender: 'F', age: 78, relation: 'wife of elderly COPD patient' },
  { id: 8, gender: 'F', age: 45, relation: 'adult daughter caring for post-PCI father' },
  { id: 9, gender: 'M', age: 42, relation: 'adult son caring for COPD mother' },
  { id: 10, gender: 'F', age: 74, relation: 'wife of stroke recovery patient' },
  { id: 11, gender: 'M', age: 64, relation: 'husband caring for post-surgery wife' },
  { id: 12, gender: 'F', age: 42, relation: 'adult daughter caring for heart failure father' },
  { id: 13, gender: 'M', age: 52, relation: 'brother caring for diabetic sister' },
  { id: 14, gender: 'F', age: 78, relation: 'wife of CKD patient' },
  { id: 15, gender: 'F', age: 56, relation: 'wife of hypertension patient' },
  { id: 16, gender: 'M', age: 56, relation: 'adult son caring for hip fracture father' },
  { id: 17, gender: 'M', age: 73, relation: 'husband caring for wife with pneumonia' },
];

const STAFF = [
  { file: 'sarah-leung.png', gender: 'F', age: 34, role: 'Hong Kong Chinese registered nurse, female' },
  { file: 'jenny-tam.png', gender: 'F', age: 29, role: 'Hong Kong Chinese home care nurse, female' },
  { file: 'grace-tang.png', gender: 'F', age: 40, role: 'Hong Kong Chinese case manager nurse, female' },
  { file: 'peter-ho.png', gender: 'M', age: 40, role: 'Hong Kong Chinese healthcare case manager, male' },
  { file: 'angela-ng.png', gender: 'F', age: 35, role: 'Hong Kong Chinese palliative care nurse, female' },
  { file: 'connie-cheung.png', gender: 'F', age: 42, role: 'Hong Kong Chinese chronic disease nurse, female' },
  { file: 'vivian-lau.png', gender: 'F', age: 28, role: 'Hong Kong Chinese wound care nurse, female' },
  { file: 'dr-chan-chi-keung.png', gender: 'M', age: 46, role: 'Hong Kong Chinese cardiologist physician, male' },
  { file: 'dr-lee-mei-ling.png', gender: 'F', age: 42, role: 'Hong Kong Chinese respiratory physician, female' },
  { file: 'dr-cheung-kwok-wai.png', gender: 'M', age: 50, role: 'Hong Kong Chinese internal medicine physician, male' },
  { file: 'anna-leung.png', gender: 'F', age: 38, role: 'Hong Kong Chinese case manager nurse, female' },
  { file: 'tony-lam.png', gender: 'M', age: 43, role: 'Hong Kong Chinese case manager nurse, male' },
  { file: 'david-chan.png', gender: 'M', age: 38, role: 'Hong Kong Chinese physiotherapist, male' },
  { file: 'michael-kwok.png', gender: 'M', age: 32, role: 'Hong Kong Chinese physiotherapist, male' },
  { file: 'eric-chan.png', gender: 'M', age: 37, role: 'Hong Kong Chinese physiotherapist, male' },
  { file: 'raymond-wong.png', gender: 'M', age: 45, role: 'Hong Kong Chinese physiotherapist, male' },
  { file: 'maggie-lam.png', gender: 'F', age: 48, role: 'Hong Kong Chinese nursing director APN, female' },
];

function parseArgs(argv) {
  const dryRun = argv.includes('--dry-run');
  const groupArg = argv.find(a => a.startsWith('--group='));
  const group = groupArg?.slice('--group='.length) ?? 'family';
  const idsArg = argv.find(a => a.startsWith('--ids='));
  const ids = idsArg
    ? idsArg.slice('--ids='.length).split(',').map(Number).filter(Boolean)
    : null;
  const onlyArg = argv.find(a => a.startsWith('--only='));
  const only = onlyArg
    ? onlyArg.slice('--only='.length).split(',').map(s => s.trim()).filter(Boolean)
    : null;
  return { dryRun, group, ids, only };
}

function genderLabel(gender) {
  return gender === 'F' ? 'woman' : 'man';
}

function buildPatientPrompt(p) {
  const subject = `${p.age}-year-old Hong Kong Chinese ${genderLabel(p.gender)}`;
  return [
    `Professional medical chart headshot portrait of a ${subject}, ${p.condition},`,
    'passport photo style, centered face, shoulders visible, neutral soft gray background,',
    'natural Hong Kong clinic lighting, photorealistic, warm skin tone, authentic Cantonese appearance,',
    'modest everyday clothing, calm expression, sharp focus, no text, no watermark',
  ].join(' ');
}

function buildFamilyPrompt(f) {
  const subject = `${f.age}-year-old Hong Kong Chinese ${genderLabel(f.gender)}`;
  const genderCue = f.gender === 'F'
    ? 'clearly female, feminine facial features, short neat hair typical of Hong Kong middle-aged woman'
    : 'clearly male, masculine facial features, short neat hair typical of Hong Kong middle-aged man';
  return [
    `Professional headshot portrait of a ${subject}, ${f.relation},`,
    genderCue + ',',
    'passport photo style, centered face, caring family caregiver expression, neutral soft background,',
    'photorealistic, authentic Cantonese appearance, modest casual clothing,',
    `looks ${f.age} years old, no text, no watermark`,
  ].join(' ');
}

function buildStaffPrompt(s) {
  const subject = `${s.age}-year-old ${s.role}`;
  return [
    `Professional headshot portrait of a ${subject},`,
    'white clinical coat or smart professional attire, passport photo style,',
    'neutral hospital background, photorealistic, trustworthy expression,',
    'no text, no watermark',
  ].join(' ');
}

async function falGenerate(prompt, apiKey) {
  const res = await fetch(`https://fal.run/${MODEL}`, {
    method: 'POST',
    headers: {
      Authorization: `Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      image_size: 'square_hd',
      num_inference_steps: 28,
      guidance_scale: 3.5,
      num_images: 1,
      enable_safety_checker: true,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`fal.ai ${res.status}: ${text.slice(0, 400)}`);
  }
  const data = await res.json();
  const url = data?.images?.[0]?.url;
  if (!url) throw new Error(`Unexpected fal.ai response: ${JSON.stringify(data).slice(0, 300)}`);
  return url;
}

async function downloadPng(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const { dryRun, group, ids, only } = parseArgs(process.argv.slice(2));
  const apiKey = process.env.FAL_KEY ?? process.env.FAL_API_KEY;

  const jobs = [];
  if (group === 'patients' || group === 'all') {
    const list = ids ? PATIENTS.filter(p => ids.includes(p.id)) : PATIENTS;
    for (const p of list) {
      jobs.push({ out: `patient-${p.id}.png`, prompt: buildPatientPrompt(p), label: p.name });
    }
  }
  if (group === 'family' || group === 'all') {
    const list = ids ? FAMILY.filter(f => ids.includes(f.id)) : FAMILY;
    for (const f of list) {
      jobs.push({ out: `family-${f.id}.png`, prompt: buildFamilyPrompt(f), label: `family-${f.id} (${f.gender}, ${f.age}y)` });
    }
  }
  if (group === 'staff' || group === 'all') {
    for (const s of STAFF) {
      jobs.push({ out: s.file, prompt: buildStaffPrompt(s), label: s.file });
    }
  }

  const filtered = only?.length
    ? jobs.filter(j => only.some(o => j.out === o || j.out.endsWith(`/${o}`) || j.out.includes(o)))
    : jobs;

  if (filtered.length === 0) {
    console.error('No jobs — use --group=patients|family|staff|all [--ids=1,2] [--only=file.png]');
    process.exit(1);
  }

  if (dryRun) {
    filtered.forEach(j => {
      console.log(`\n${j.out} (${j.label})`);
      console.log(j.prompt);
    });
    return;
  }

  if (!apiKey) {
    console.error('Missing FAL_KEY. Run: FAL_KEY=your-key node scripts/generate-avatars-fal.mjs --group=family');
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });
  const results = [];

  for (const job of filtered) {
    const outPath = join(OUT_DIR, job.out);
    process.stdout.write(`Generating ${job.out} (${job.label})… `);
    try {
      const imageUrl = await falGenerate(job.prompt, apiKey);
      await writeFile(outPath, await downloadPng(imageUrl));
      console.log('ok');
      results.push({ out: job.out, ok: true });
    } catch (err) {
      console.log('failed');
      console.error(`  ${err.message}`);
      results.push({ out: job.out, ok: false });
    }
    if (job !== filtered[filtered.length - 1]) await sleep(1200);
  }

  const ok = results.filter(r => r.ok).length;
  console.log(`\nDone: ${ok}/${results.length}`);
  if (ok < results.length) process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
