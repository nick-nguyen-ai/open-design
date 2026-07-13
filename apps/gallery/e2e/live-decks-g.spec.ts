import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Batch-2 deck G — The Long Signal (deck-analytics-deep-dive): the interactive-
 * instrument hero of the batch. ONE 52-week checkout-conversion series threads
 * every slide as a persistent band; the hero slide is a keyboard-operable
 * instrument. The evidence screenshot is captured ON THE INSTRUMENT SLIDE.
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
  await page.waitForTimeout(800);
}

test.beforeEach(async ({ page }) => {
  mkdirSync(DIR, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 900 });
});

test('live long signal: the interactive instrument, week-37 regime change, screenshot', async ({
  page,
}) => {
  await page.goto('/live/deck-analytics-deep-dive');
  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByTestId('signal-counter')).toContainText('01 / 10');

  // The instrument slide (slide 4): the full-viewport interactive hero.
  await page.goto('/live/deck-analytics-deep-dive?slide=4');
  await expect(page.getByTestId('signal-counter')).toContainText('04 / 10');
  await expect(page.getByTestId('instrument')).toBeVisible();
  // The instrument opens reading the anomaly week.
  await expect(page.getByTestId('instrument-readout-panel')).toContainText('W37');

  await settleDeck(page, '.ls-slide');
  await page.screenshot({ path: shot('live-long-signal.png'), fullPage: true });

  // The instrument is keyboard-operable: focus it, walk a week, toggle baseline.
  await page.getByTestId('instrument').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByTestId('instrument-readout-panel')).toContainText('W38');
  // Week-walking is scoped to the SVG — the slide did not turn.
  await expect(page.getByTestId('signal-counter')).toContainText('04 / 10');
  await page.keyboard.press('b');
  await expect(page.getByTestId('baseline-overlay')).toBeVisible();

  // Deck mechanics still work once focus leaves the instrument.
  await page.getByRole('button', { name: 'Next slide' }).click();
  await expect(page.getByTestId('signal-counter')).toContainText('05 / 10');
});
