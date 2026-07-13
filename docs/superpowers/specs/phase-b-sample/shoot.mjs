/**
 * Phase B Task 4 (ledger T30) — screenshot every slide of the MCP-generated
 * sample deck as committed evidence.
 *
 * Loops `?slide=1..N` against the BUILT gallery served by `vite preview`, at
 * 1440x900, waiting for fonts to load and the deck's stable `live-cutover`
 * testid before shooting each slide to `slide-NN.png` in this directory.
 *
 * Prereqs (the reproducible chain): `corepack pnpm --filter gallery build`,
 * then a `vite preview --port 4318` serving that build (this script assumes the
 * server is already up on PORT).
 *
 * Run from repo root: `node docs/superpowers/specs/phase-b-sample/shoot.mjs`
 */
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chromium } from '@playwright/test';

const PORT = Number(process.env.PORT ?? 4318);
const BASE = `http://localhost:${PORT}`;
const ROUTE = '/demo/mcp-sample';
const SLIDE_COUNT = 10;
const here = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  try {
    for (let n = 1; n <= SLIDE_COUNT; n += 1) {
      await page.goto(`${BASE}${ROUTE}?slide=${n}`, { waitUntil: 'networkidle' });
      await page.waitForSelector('[data-testid="live-cutover"]', { timeout: 15_000 });
      await page.evaluate(() => document.fonts.ready);
      // Let the signature entrance sequence settle before shooting.
      await page.waitForTimeout(900);
      const file = path.join(here, `slide-${String(n).padStart(2, '0')}.png`);
      await page.screenshot({ path: file });
      console.log(`shot slide ${n} → ${file}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
