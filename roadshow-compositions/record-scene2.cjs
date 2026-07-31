const { chromium } = require('playwright');
const path = require('path');

const OUTDIR = '/Users/kenneth/Demo/ihomecare-latest/roadshow-compositions/videos';
const BASE = 'http://localhost:5173/elites';
const VIEWPORT = { width: 1720, height: 1118 };

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function record(name, action, duration = 5000) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    recordVideo: { dir: OUTDIR, size: { width: 1720, height: 1118 } },
  });
  const page = await ctx.newPage();

  // Add black overlay for smooth fade-in
  await page.evaluate(() => {
    const ov = document.createElement('div');
    ov.id = '__fade__';
    ov.style.cssText = 'position:fixed;inset:0;background:#000;z-index:99999';
    document.body.appendChild(ov);
  });

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);

  // Fade out black overlay
  await page.evaluate(() => {
    const ov = document.getElementById('__fade__');
    if (ov) ov.style.transition = 'opacity 0.5s', ov.style.opacity = '0';
  });
  await page.waitForTimeout(600);
  await page.evaluate(() => {
    const ov = document.getElementById('__fade__');
    if (ov) ov.remove();
  });

  // Run the frame-specific action
  await action(page);
  await page.waitForTimeout(500);

  await ctx.close();
  await browser.close();

  // Wait for video to flush, then rename
  await sleep(500);
  const fs = require('fs');
  const files = fs.readdirSync(OUTDIR).filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    const latest = files.sort().pop();
    const oldPath = path.join(OUTDIR, latest);
    const newPath = path.join(OUTDIR, name);
    fs.renameSync(oldPath, newPath);
    console.log(`Saved: ${newPath}`);
  }
  return `videos/${name}`;
}

async function main() {
  const fs = require('fs');
  if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });

  // === Frame 6: Dashboard (4s) ===
  console.log('\n=== Frame 6: Loading → Dashboard ===');
  await record('frame6-dashboard.webm', async (page) => {
    await page.waitForTimeout(2000); // Stay on dashboard
  }, 4000);

  // === Frame 7: Candidate (4s) ===
  console.log('\n=== Frame 7: Dashboard → Candidate ===');
  await record('frame7-candidate.webm', async (page) => {
    // Click Candidate tab
    await page.click('button:has-text("Candidate")');
    await page.waitForTimeout(2500);
  }, 4000);

  // === Frame 8: Initial Assessment auto-submit (6s) ===
  console.log('\n=== Frame 8: Initial Assessment → Done ===');
  await record('frame8-assessment.webm', async (page) => {
    // Click Candidate tab first
    await page.click('button:has-text("Candidate")');
    await page.waitForTimeout(500);
    // Click Zhang Jianguo's Initial Assessment button (first one)
    const buttons = await page.locator('button:has-text("Initial Assessment")').all();
    if (buttons.length > 0) {
      await buttons[0].click();
    }
    // Wait for auto-submit animation
    await page.waitForTimeout(4500);
  }, 6000);

  // === Frame 9: Care Plan auto-submit (6s) ===
  console.log('\n=== Frame 9: Care Plan → Done ===');
  await record('frame9-careplan.webm', async (page) => {
    // Click Candidate tab first
    await page.click('button:has-text("Candidate")');
    await page.waitForTimeout(500);
    // Click Zhang Jianguo's Care Plan button
    const buttons = await page.locator('button:has-text("Care Plan")').all();
    if (buttons.length > 0) {
      await buttons[0].click();
    }
    await page.waitForTimeout(4500);
  }, 6000);

  console.log('\n=== All done ===');
}

main().catch(e => { console.error(e); process.exit(1); });
