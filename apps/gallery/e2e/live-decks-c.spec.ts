import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * The task-17 deck batch — the three worlds that complete the ten decks: The
 * Manifesto (a product vision as letterpress posters), The Sectional (an
 * architecture cut sheet by sheet in cyanotype blueprint), and The Field Manual
 * (internal training as a beloved aviation-ops manual). Each test lands on a
 * CONTENT slide (never the title), exercises the shared deck mechanics
 * (keyboard, ?slide= deep link), and captures the full-page evidence
 * screenshot.
 */
const DIR = resolve(process.cwd(), 'e2e/screenshots');
const shot = (name: string) => resolve(DIR, name);

/** A deck settles when the active slide's build lines and any kinetic letters have landed opaque. */
async function settleDeck(page: Page, slideSelector: string): Promise<void> {
  await page.waitForFunction(() => document.fonts.status === 'loaded');
  await page.waitForFunction((sel) => {
    if (document.querySelector(`${sel}[data-state="leaving"]`)) return false;
    const active = document.querySelector(`${sel}[data-state="active"]`);
    if (!active) return false;
    const marks = active.querySelectorAll('[class*="-build"], .mf-kin-letter');
    if (marks.length === 0) return true;
    return Array.from(marks).every((el) => getComputedStyle(el).opacity === '1');
  }, slideSelector);
  await page.waitForTimeout(600);
}

test.beforeEach(async ({ page }) => {
  mkdirSync(DIR, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 900 });
});

test('live manifesto: the indictment poster, the letter-settle principle, screenshot', async ({
  page,
}) => {
  await page.goto('/live/deck-product-vision');
  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByTestId('poster-counter')).toContainText('01 / 09');

  // Deep-link to the indictment (a content poster): the anomaly that indicts our
  // own product — "Our own systems ask her fourteen times."
  await page.goto('/live/deck-product-vision?slide=2');
  await expect(page.getByTestId('poster-counter')).toContainText('02 / 09');
  const indictment = page.getByTestId('indictment');
  await expect(indictment).toContainText('fourteen');
  await expect(indictment).toContainText('14 SEPARATE IDENTITY ASKS');

  await settleDeck(page, '.mf-slide');
  await page.screenshot({ path: shot('live-manifesto.png'), fullPage: true });

  // Keyboard mechanics: X jumps to the indictment from anywhere; End reaches the coda.
  await page.keyboard.press('End');
  await expect(page.getByTestId('poster-counter')).toContainText('09 / 09');
  await page.keyboard.press('x');
  await expect(page.getByTestId('poster-counter')).toContainText('02 / 09');
});

test('live sectional: section B–B, the red-pencilled storey, screenshot', async ({ page }) => {
  await page.goto('/live/deck-technical-architecture-explanation');
  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByTestId('sheet-counter')).toContainText('01 / 08');

  // Deep-link to SHT A-301 (the money sheet): one request cut open, the
  // feature-store storey over its drawn latency budget — the anomaly.
  await page.goto('/live/deck-technical-architecture-explanation?slide=5');
  await expect(page.getByTestId('sheet-counter')).toContainText('05 / 08 · SHT A-301 · SECTION B–B');
  const parts = page.getByTestId('parts-section');
  await expect(parts.locator('li[data-over="true"]')).toContainText('FEATURE STORE');
  await expect(parts.locator('li[data-over="true"]')).toContainText('OVER BUDGET — RFI-114');

  await settleDeck(page, '.sc-sheet');
  await page.screenshot({ path: shot('live-sectional.png'), fullPage: true });

  // Keyboard mechanics: End reaches the revision history; S returns to the section.
  await page.keyboard.press('End');
  await expect(page.getByTestId('sheet-counter')).toContainText('08 / 08');
  await page.keyboard.press('s');
  await expect(page.getByTestId('sheet-counter')).toContainText('05 / 08');
});

test('live field manual: PROC 3.2, the revised step, screenshot', async ({ page }) => {
  await page.goto('/live/deck-technical-training');
  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByTestId('page-counter')).toContainText('01 / 09');

  // Deep-link to PROC 3.2 (a content page): step 4 is stamped REVISED AFTER
  // INCIDENT IR-2214 with a terse margin note — the anomaly.
  await page.goto('/live/deck-technical-training?slide=4');
  await expect(page.getByTestId('page-counter')).toContainText('04 / 09 · PROC 3.2');
  const revised = page.getByTestId('revised-step');
  await expect(revised).toContainText('REVISED AFTER INCIDENT IR-2214');
  await expect(revised).toContainText('The pin moved from checklist to build gate.');
  await expect(page.getByTestId('warning-proc-3-2')).toContainText('NEVER RETRAIN ON PRODUCTION LABELS');

  await settleDeck(page, '.fm-page');
  await page.screenshot({ path: shot('live-field-manual.png'), fullPage: true });

  // Keyboard mechanics: C jumps to the checkpoint; End reaches the sign-off.
  await page.keyboard.press('End');
  await expect(page.getByTestId('page-counter')).toContainText('09 / 09');
  await page.keyboard.press('c');
  await expect(page.getByTestId('page-counter')).toContainText('05 / 09 · CHECKPOINT');
});
