#!/usr/bin/env node
/**
 * Deploy iHomeCare demo to Cloudflare Pages + sync Worker.
 *
 * Prerequisites:
 *   npm install
 *   npx wrangler login
 *
 * Optional env:
 *   CF_PAGES_PROJECT=ihomecare-v138
 *   VITE_SYNC_WS_URL=wss://ihomecare-demo-sync.<account>.workers.dev
 */
import { spawnSync } from 'node:child_process';

const PROJECT = process.env.CF_PAGES_PROJECT || 'ihomecare-v138';
const WRANGLER = process.platform === 'win32' ? 'npx.cmd' : 'npx';

function run(cmd, args, env = process.env) {
  const result = spawnSync(cmd, args, {
    stdio: 'inherit',
    env,
    cwd: process.cwd(),
    shell: process.platform === 'win32',
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function runCapture(cmd, args) {
  const result = spawnSync(cmd, args, {
    encoding: 'utf8',
    cwd: process.cwd(),
    shell: process.platform === 'win32',
  });
  if (result.status !== 0) {
    console.error(result.stderr || result.stdout);
    process.exit(result.status ?? 1);
  }
  return result.stdout.trim();
}

console.log('\n=== iHomeCare Cloudflare deploy ===\n');

console.log('1/3 Deploy sync Worker (Durable Objects)...');
const workerOut = runCapture(WRANGLER, [
  'wrangler',
  'deploy',
  '--config',
  'workers/demo-sync/wrangler.toml',
]);

const workerHttps = workerOut.match(/https:\/\/[^\s]+/)?.[0];
const syncWsUrl = process.env.VITE_SYNC_WS_URL
  || (workerHttps ? workerHttps.replace(/^https:\/\//, 'wss://') : '');
if (!syncWsUrl) {
  console.error('Could not detect Worker URL. Set VITE_SYNC_WS_URL and retry.');
  process.exit(1);
}
console.log(`   Sync WS: ${syncWsUrl}\n`);

console.log('2/3 Build Pages bundle...');
run(process.execPath, ['node_modules/vite/bin/vite.js', 'build'], {
  ...process.env,
  VITE_SYNC_WS_URL: syncWsUrl,
});

console.log('\n3/3 Deploy Cloudflare Pages...');
run(WRANGLER, [
  'wrangler',
  'pages',
  'deploy',
  'dist',
  `--project-name=${PROJECT}`,
  '--commit-dirty=true',
]);

console.log(`\nDone. Open your Pages URL from the output above.`);
console.log(`Three-end sync uses: ${syncWsUrl}\n`);
