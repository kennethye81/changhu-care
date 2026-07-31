#!/usr/bin/env node
/**
 * Generate IoT device product images via fal.ai (FLUX).
 *
 * Usage:
 *   FAL_KEY=your-key node scripts/generate-devices-fal.mjs
 *   node scripts/generate-devices-fal.mjs  # SVG placeholders if no FAL_KEY
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'devices');
const MODEL = process.env.FAL_MODEL ?? 'fal-ai/flux/dev';

const DEVICES = [
  { model: 'Omron HEM-7361T', slug: 'omron-hem-7361t' },
  { model: 'Nonin Bluetooth 3230', slug: 'nonin-3230' },
  { model: 'HK HealthTech S3', slug: 'hk-healthtech-s3' },
  { model: 'Braun BNT400 Bluetooth', slug: 'braun-bnt400' },
  { model: 'SenseLife Pro', slug: 'senselife-pro' },
  { model: 'Accu-Chek Guide', slug: 'accu-chek-guide' },
  { model: 'Philips EverFlo', slug: 'philips-everflo' },
  { model: 'Baxter Sigma Spectrum IQ', slug: 'baxter-sigma-spectrum' },
  { model: 'FoleyConnect UO-200', slug: 'foleyconnect-uo-200' },
  { model: 'Omron HN-290T', slug: 'omron-hn-290t' },
  { model: 'MolecuLight i:X', slug: 'moleculight-ix' },
  { model: 'Roche CoaguChek INRange', slug: 'coaguchek-inrange' },
  { model: 'Abbott i-STAT Alinity', slug: 'istat-alinity' },
  { model: 'KardiaMobile 6L', slug: 'kardiamobile-6l' },
  { model: 'GaitKeeper Pro', slug: 'gaitkeeper-pro' },
  { model: 'ResMed AirSense 11 AutoSet', slug: 'resmed-airsense-11' },
  { model: 'Abbott i-STAT CG4+', slug: 'istat-cg4' },
];

function buildPrompt(model) {
  return [
    `Professional product photograph of ${model} medical IoT device,`,
    'white background, studio lighting, front three-quarter angle,',
    'photorealistic, no text, no watermark, no people,',
    'healthcare RPM equipment for hospital-at-home monitoring',
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
      image_size: 'square',
      num_inference_steps: 28,
      enable_safety_checker: true,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`fal.ai ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  const url = data?.images?.[0]?.url;
  if (!url) throw new Error('No image URL in fal response');
  const imgRes = await fetch(url);
  if (!imgRes.ok) throw new Error(`Failed to download image: ${imgRes.status}`);
  return Buffer.from(await imgRes.arrayBuffer());
}

async function writePlaceholder({ model, slug }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><rect width="256" height="256" fill="#f8fafc"/><rect x="48" y="64" width="160" height="128" rx="16" fill="#e2e8f0" stroke="#94a3b8"/><text x="128" y="132" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#64748b">${model.replace(/&/g, '&amp;').slice(0, 28)}</text></svg>`;
  await writeFile(join(OUT_DIR, `${slug}.svg`), svg);
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const apiKey = process.env.FAL_KEY || process.env.FAL_API_KEY;
  await mkdir(OUT_DIR, { recursive: true });

  if (!apiKey || dryRun) {
    for (const d of DEVICES) {
      if (dryRun && apiKey) {
        console.log(`[dry-run] ${d.slug}`);
        continue;
      }
      await writePlaceholder(d);
      console.log(`placeholder  ${d.slug}.svg`);
    }
    if (!apiKey) return;
    if (dryRun) return;
  }

  for (const d of DEVICES) {
    console.log(`generating ${d.slug}...`);
    try {
      const buf = await falGenerate(buildPrompt(d.model), apiKey);
      await writeFile(join(OUT_DIR, `${d.slug}.webp`), buf);
      console.log(`  ✓ ${d.slug}.webp`);
    } catch (err) {
      console.warn(`  ✗ ${d.slug}: ${err.message} — SVG fallback`);
      await writePlaceholder(d);
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
