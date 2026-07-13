import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Batch-2 decks F — the PowerPoint-familiar three: The Quarter (QBR), The
 * Straight Pitch (sales), and The Allocation (budget). Deliberately conventional
 * slide anatomy, executed flawlessly. Each test lands on a commanding CONTENT
 * slide (never the title) via ?slide=, exercises the shared deck mechanics, and
 * captures the full-page evidence screenshot.
 */
const DIR = resolve(process.cwd(), 'e2e/screenshots');
const shot = (name: string) => resolve(DIR, name);

async function settleDeck(page: Page, slideSelector: string): Promise<void> {
  await page.waitForFunction(() => document.fonts.status === 'loaded');
  await page.waitForFunction((sel) => {
    if (document.querySelector(`${sel}[data-state="leaving"]`)) return false;
    const active = document.querySelector(`${sel}[data-state="active"]`);
    if (!active) return false;
    const builds = active.querySelectorAll('[class*="-build"]');
    if (builds.length === 0) return true;
    return Array.from(builds).every((el) => getComputedStyle(el).opacity === '1');
  }, slideSelector);
  await page.waitForTimeout(700);
}

test.beforeEach(async ({ page }) => {
  mkdirSync(DIR, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 900 });
});

test('live quarter: the KPI row, NRR below the floor, screenshot', async ({ page }) => {
  await page.goto('/live/deck-quarterly-business-review');
  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByTestId('quarter-counter')).toContainText('01 / 11');

  // The KPI slide (slide 4): the single red figure in a green row.
  await page.goto('/live/deck-quarterly-business-review?slide=4');
  await expect(page.getByTestId('quarter-counter')).toContainText('04 / 11');
  await expect(page.getByTestId('kpi-anomaly')).toContainText('NRR 96% — BELOW 100% FLOOR');

  await settleDeck(page, '.q-slide');
  await page.screenshot({ path: shot('live-quarter.png'), fullPage: true });

  // Keyboard mechanics: End reaches the appendix, Home returns to the title.
  await page.keyboard.press('End');
  await expect(page.getByTestId('quarter-counter')).toContainText('11 / 11');
  await page.keyboard.press('Home');
  await expect(page.getByTestId('quarter-counter')).toContainText('01 / 11');
});

test('live straight pitch: where we are not a fit, screenshot', async ({ page }) => {
  await page.goto('/live/deck-sales-pitch');
  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByTestId('pitch-counter')).toContainText('01 / 10');

  // The honest slide (slide 8): the candour that is the anomaly.
  await page.goto('/live/deck-sales-pitch?slide=8');
  await expect(page.getByTestId('pitch-counter')).toContainText('08 / 10');
  await expect(
    page.getByRole('heading', { name: 'WHERE WE ARE NOT A FIT', exact: true }),
  ).toBeVisible();

  await settleDeck(page, '.sp-slide');
  await page.screenshot({ path: shot('live-straight-pitch.png'), fullPage: true });

  // The N key jumps back to the honest slide; P jumps to the proof slide.
  await page.keyboard.press('p');
  await expect(page.getByTestId('pitch-counter')).toContainText('06 / 10');
  await expect(page.getByTestId('pitch-proof')).toBeVisible();
});

test('live allocation: the waterfall, cloud egress unresolved, screenshot', async ({ page }) => {
  await page.goto('/live/deck-budget-planning');
  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByTestId('allocation-counter')).toContainText('01 / 10');

  // The waterfall (slide 3): the commanding visual, egress bar in oxblood.
  await page.goto('/live/deck-budget-planning?slide=3');
  await expect(page.getByTestId('allocation-counter')).toContainText('03 / 10');
  await expect(page.getByTestId('allocation-waterfall')).toBeVisible();
  await expect(page.getByTestId('waterfall-readout')).toContainText('Cloud egress');

  await settleDeck(page, '.al-slide');
  await page.screenshot({ path: shot('live-allocation.png'), fullPage: true });

  // Pinning another bar updates the mono readout.
  await page.locator('[data-testid="waterfall-bar"][data-step="opening"]').focus();
  await expect(page.getByTestId('waterfall-readout')).toContainText('FY26 baseline');
});
