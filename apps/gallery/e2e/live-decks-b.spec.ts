import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * The task-16 deck batch: three live slide-deck worlds — The River (a
 * transformation as one panning waterway), The Readout (a quarter of
 * experiment results as a bench oscilloscope), and The Gallery Floor (the
 * innovation portfolio as an exhibition on a floor plan). Each test lands on a
 * CONTENT slide (never the title), exercises the shared deck mechanics
 * (keyboard, ?slide= deep link), and captures the full-page evidence
 * screenshot.
 */
const DIR = resolve(process.cwd(), 'e2e/screenshots');
const shot = (name: string) => resolve(DIR, name);

/** A deck settles when the active slide's build lines have all landed opaque. */
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
  await page.waitForTimeout(600);
}

test.beforeEach(async ({ page }) => {
  mkdirSync(DIR, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 900 });
});

test('live river: the narrows capacity constraint, the panning spine, screenshot', async ({
  page,
}) => {
  await page.goto('/live/deck-transformation-roadmap');
  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByTestId('river-counter')).toContainText('01 / 09');

  // Deep-link to the narrows (a content slide): the honest conversation where
  // two builds compete for the same engineering pool — the anomaly.
  await page.goto('/live/deck-transformation-roadmap?slide=5');
  await expect(page.getByTestId('river-counter')).toContainText('05 / 09 · THE NARROWS');
  const points = page.getByTestId('narrows-points');
  await expect(points).toContainText('CONTESTED RESOURCE');
  await expect(points).toContainText('Platform engineering');

  await settleDeck(page, '.rv-slide');
  await page.screenshot({ path: shot('live-river.png'), fullPage: true });

  // Keyboard mechanics: N jumps to the narrows from anywhere; End reaches the close.
  await page.keyboard.press('End');
  await expect(page.getByTestId('river-counter')).toContainText('09 / 09');
  await page.keyboard.press('n');
  await expect(page.getByTestId('river-counter')).toContainText('05 / 09');
});

test('live readout: the withheld reading, the result numeral, screenshot', async ({ page }) => {
  await page.goto('/live/deck-experiment-results');
  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByTestId('reading-counter')).toContainText('01 / 08');

  // Deep-link to Reading 03 (a content reading): the significant win they chose
  // NOT to ship because a guardrail regressed — the anomaly.
  await page.goto('/live/deck-experiment-results?slide=5');
  await expect(page.getByTestId('reading-counter')).toContainText('05 / 08 · READING 03 · WITHHELD');
  await page
    .locator('.rd-slide[data-state="active"] [data-testid="chart-mount"] canvas, .rd-slide[data-state="active"] [data-testid="chart-mount"] svg')
    .first()
    .waitFor();
  await expect(
    page.locator('.rd-slide[data-state="active"]').getByTestId('verdict-plate'),
  ).toContainText('WITHHELD');

  await settleDeck(page, '.rd-slide');
  await page.screenshot({ path: shot('live-readout.png'), fullPage: true });

  // The W key jumps to the withheld reading from anywhere.
  await page.keyboard.press('Home');
  await expect(page.getByTestId('reading-counter')).toContainText('01 / 08');
  await page.keyboard.press('w');
  await expect(page.getByTestId('reading-counter')).toContainText('05 / 08');
});

test('live gallery floor: the retired exhibit, the floor plan pan, screenshot', async ({ page }) => {
  await page.goto('/live/deck-innovation-showcase');
  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByTestId('floor-counter')).toContainText('01 / 09');

  // Deep-link to exhibit 04 (a content exhibit): the celebrated RETIRED piece,
  // deliberately sunset with honours — the anomaly.
  await page.goto('/live/deck-innovation-showcase?slide=6');
  await expect(page.getByTestId('floor-counter')).toContainText('06 / 09 · HALL 2 · POSITION 04');
  const placard = page.getByTestId('retired-placard');
  await expect(placard).toContainText('The Adaptive Queue');
  await expect(placard).toContainText('RETIRED');

  await settleDeck(page, '.gf-slide');
  await page.screenshot({ path: shot('live-gallery-floor.png'), fullPage: true });

  // The R key jumps to the retired piece from anywhere; End reaches the close.
  await page.keyboard.press('End');
  await expect(page.getByTestId('floor-counter')).toContainText('09 / 09');
  await page.keyboard.press('r');
  await expect(page.getByTestId('floor-counter')).toContainText('06 / 09');
});
