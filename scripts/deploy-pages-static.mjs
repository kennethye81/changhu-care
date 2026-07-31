#!/usr/bin/env node
/** Deploy static iHomeCare bundle to Cloudflare Pages (no sync Worker). */
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

console.log('\n=== iHomeCare static Pages deploy ===\n');
console.log('1/2 Build...');
run(process.execPath, ['node_modules/vite/bin/vite.js', 'build']);

console.log('\n2/2 Deploy to Cloudflare Pages...');
run(WRANGLER, [
  'wrangler',
  'pages',
  'deploy',
  'dist',
  `--project-name=${PROJECT}`,
  '--commit-dirty=true',
]);

console.log('\nDone. Static site only — same-browser tab sync still works.\n');
