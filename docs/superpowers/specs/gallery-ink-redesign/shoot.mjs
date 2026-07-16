/**
 * Gallery Ink redesign — evidence screenshots for the 2026-07-17 chrome
 * redesign (see ../2026-07-17-gallery-ink-redesign-design.md).
 *
 * Prereqs: gallery running (dev on 5173 or `vite preview` on 4318; pass BASE).
 * Run from repo root: node docs/superpowers/specs/gallery-ink-redesign/shoot.mjs
 */
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../../../..');

const requireFromGallery = createRequire(path.join(repoRoot, 'apps', 'gallery', 'package.json'));
const playwrightCoreEntry = createRequire(requireFromGallery.resolve('@playwright/test')).resolve('playwright-core');
const playwrightCore = await import(pathToFileURL(playwrightCoreEntry).href);
const chromium = playwrightCore.chromium ?? playwrightCore.default.chromium;

const BASE = process.env.BASE ?? 'http://localhost:5173';

const SHOTS = [
  { route: '/', file: 'landing-light.png', fullPage: true },
  { route: '/', file: 'landing-dark.png', theme: 'dark' },
  { route: '/showcase', file: 'showcase.png', fullPage: true },
  { route: '/make', file: 'make.png', fullPage: true },
  { route: '/contribute', file: 'contribute.png', fullPage: true },
  { route: '/templates/deck-cloud-migration', file: 'template-detail.png' },
];

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  try {
    for (const shot of SHOTS) {
      await page.goto(`${BASE}${shot.route}`, { waitUntil: 'networkidle' });
      if (shot.theme === 'dark') {
        const btn = page.getByRole('button', { name: /switch to dark theme/i });
        if (await btn.count()) await btn.click();
      }
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1200);
      const file = path.join(here, shot.file);
      await page.screenshot({ path: file, fullPage: Boolean(shot.fullPage) });
      console.log(`shot ${shot.route} → ${shot.file}`);
    }
  } finally {
    await browser.close();
  }
}

await main();
