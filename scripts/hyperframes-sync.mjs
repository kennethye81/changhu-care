#!/usr/bin/env node
/**
 * HyperFrames Sync Watcher
 * 
 * Monitors src/ for changes, extracts CSS vars + patient data,
 * and injects into roadshow-hyperframes.html.
 * 
 * Usage: node scripts/hyperframes-sync.mjs [--watch]
 */

import { watch, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const HF_HTML = resolve(ROOT, 'roadshow-hyperframes.html');
const SRC_INDEX_CSS = resolve(ROOT, 'src/index.css');
const SRC_PATIENTS = resolve(ROOT, 'src/data/patients.ts');
const SRC_FAMILY_TOKENS = resolve(ROOT, 'src/theme/familyTokens.ts');
const SRC_STORE = resolve(ROOT, 'src/store/patientStore.ts');

let debounceTimer = null;

// ─── CSS Variable Extraction ──────────────────────────────────────

function extractCssVars() {
  const css = readFileSync(SRC_INDEX_CSS, 'utf8');
  const vars = {};
  // Match :root { ... } block
  const rootBlock = css.match(/:root\s*\{([^}]+)\}/s);
  if (rootBlock) {
    const lines = rootBlock[1].split('\n');
    for (const line of lines) {
      const m = line.match(/--([\w-]+)\s*:\s*([^;]+);/);
      if (m) vars[`--${m[1]}`] = m[2].trim();
    }
  }
  // Also extract from @layer base blocks
  const layerBlocks = css.matchAll(/@layer\s+\w+\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/gs);
  for (const block of layerBlocks) {
    const lines = block[1].split('\n');
    for (const line of lines) {
      const m = line.match(/--([\w-]+)\s*:\s*([^;]+);/);
      if (m && !vars[`--${m[1]}`]) vars[`--${m[1]}`] = m[2].trim();
    }
  }
  return vars;
}

// ─── Patient Data Extraction ───────────────────────────────────────

function extractPatientData() {
  const src = readFileSync(SRC_PATIENTS, 'utf8');
  const patients = [];
  
  // Count patient blocks: each starts with `id: N, address:` pattern
  const count = (src.match(/\{\s*id:\s*\d+/g) || []).length;
  
  // Extract name from each patient - match `id: N,` ... `name: 'X'`
  const nameMatches = src.matchAll(/id:\s*(\d+).*?name:\s*['"]([^'"]+)['"]/gs);
  for (const m of nameMatches) {
    patients.push({ id: parseInt(m[1]), name: m[2] });
  }
  
  // Try to extract diagnosis and riskLevel from the same blocks
  const diagMatches = src.matchAll(/name:\s*['"][^'"]+['"].*?diagnosis:\s*['"]([^'"]+)['"].*?riskLevel:\s*['"](\w+)['"]/gs);
  let diagIdx = 0;
  for (const m of diagMatches) {
    if (patients[diagIdx]) {
      patients[diagIdx].diagnosis = m[1].substring(0, 60);
      patients[diagIdx].riskLevel = m[2];
    }
    diagIdx++;
  }
  
  return { patients, count };
}

function extractVitalsSummary() {
  try {
    const store = readFileSync(SRC_STORE, 'utf8');
    // Extract DEFAULT_VITALS to get counts
    const vitalsCount = (store.match(/\d+\s*:\s*\{/g) || []).length;
    
    // Try to extract some vitals ranges
    const bpValues = [];
    const bpMatches = store.matchAll(/bpSystolic\s*:\s*(\d+)/g);
    for (const m of bpMatches) bpValues.push(parseInt(m[1]));
    
    const avgBp = bpValues.length ? Math.round(bpValues.reduce((a,b)=>a+b,0) / bpValues.length) : 0;
    
    return { vitalsCount, avgBpSystolic: avgBp };
  } catch {
    return { vitalsCount: 0, avgBpSystolic: 0 };
  }
}

// ─── Family Tokens Extraction ──────────────────────────────────────

function extractDesignTokens() {
  try {
    const src = readFileSync(SRC_FAMILY_TOKENS, 'utf8');
    const tokens = {};
    
    // Extract FAMILY palette
    const familyBlock = src.match(/export const FAMILY = \{([^}]+)\}/s);
    if (familyBlock) {
      for (const line of familyBlock[1].split('\n')) {
        const m = line.match(/(\w+)\s*:\s*['"]([^'"]+)['"]/);
        if (m) tokens[`family-${m[1]}`] = m[2];
      }
    }
    return tokens;
  } catch {
    return {};
  }
}

// ─── HTML Injection ────────────────────────────────────────────────

function injectIntoHtml(vars, patients, tokens) {
  let html = readFileSync(HF_HTML, 'utf8');
  
  // Replace CSS variables block
  const cssVarsJson = JSON.stringify(vars, null, 2);
  html = html.replace(
    /\/\* HF_CSS_VARS_START \*\/(.*?)\/\* HF_CSS_VARS_END \*\//s,
    `/* HF_CSS_VARS_START */\nconst HF_CSS_VARS = ${cssVarsJson};\n/* HF_CSS_VARS_END */`
  );
  
  // Replace patient data block
  const patientJson = JSON.stringify(patients, null, 2);
  html = html.replace(
    /\/\* HF_PATIENTS_START \*\/(.*?)\/\* HF_PATIENTS_END \*\//s,
    `/* HF_PATIENTS_START */\nconst HF_PATIENTS = ${patientJson};\n/* HF_PATIENTS_END */`
  );
  
  // Replace design tokens block
  const tokensJson = JSON.stringify(tokens, null, 2);
  html = html.replace(
    /\/\* HF_TOKENS_START \*\/(.*?)\/\* HF_TOKENS_END \*\//s,
    `/* HF_TOKENS_START */\nconst HF_TOKENS = ${tokensJson};\n/* HF_TOKENS_END */`
  );
  
  // Replace timestamp
  html = html.replace(
    /\/\* HF_TIMESTAMP \*\//g,
    new Date().toISOString()
  );
  
  writeFileSync(HF_HTML, html, 'utf8');
}

// ─── Full Sync ────────────────────────────────────────────────────

function fullSync() {
  console.log('[hf-sync] Extracting source data...');
  
  const vars = extractCssVars();
  const { patients, count } = extractPatientData();
  const vitals = extractVitalsSummary();
  const tokens = extractDesignTokens();
  
  const data = {
    cssVars: vars,
    patients,
    patientCount: count,
    vitals,
    tokens,
  };
  
  if (existsSync(HF_HTML)) {
    injectIntoHtml(vars, patients, tokens);
    console.log(`[hf-sync] ✅ Injected: ${Object.keys(vars).length} CSS vars, ${count} patients, ${Object.keys(tokens).length} tokens`);
  } else {
    console.log('[hf-sync] ⚠️ roadshow-hyperframes.html not found — run init first');
  }
  
  return data;
}

// ─── Watch Mode ────────────────────────────────────────────────────

const WATCH_PATHS = [
  resolve(ROOT, 'src/index.css'),
  resolve(ROOT, 'src/data/patients.ts'),
  resolve(ROOT, 'src/store/patientStore.ts'),
  resolve(ROOT, 'src/theme/familyTokens.ts'),
  resolve(ROOT, 'src/data/careTeam.ts'),
  resolve(ROOT, 'src/data/carePlans.ts'),
  resolve(ROOT, 'src/data/vitalSigns.ts'),
];

function debouncedSync() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fullSync, 500);
}

// ─── Entry ────────────────────────────────────────────────────────

const isWatch = process.argv.includes('--watch');

if (isWatch) {
  console.log('[hf-sync] Watching src/ for changes...');
  
  // Watch specific files
  for (const file of WATCH_PATHS) {
    if (existsSync(file)) {
      watch(file, (eventType) => {
        console.log(`[hf-sync] ${eventType}: ${file.replace(ROOT + '/', '')}`);
        debouncedSync();
      });
    }
  }
  
  // Also watch entire src/ recursively for new files
  watch(resolve(ROOT, 'src'), { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    const ext = filename.split('.').pop();
    if (!['ts', 'tsx', 'css', 'js'].includes(ext)) return;
    console.log(`[hf-sync] ${eventType}: src/${filename}`);
    debouncedSync();
  });
  
  // Initial sync
  fullSync();
  
  // Keep alive
  process.stdin.resume();
} else {
  fullSync();
}
