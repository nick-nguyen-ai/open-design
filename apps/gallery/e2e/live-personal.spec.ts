import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const DIR = resolve(process.cwd(), 'e2e/screenshots');
const shot = (name: string) => resolve(DIR, name);

/** Fonts loaded + every LedgerReveal item fully opaque + a beat. */
async function settleReveal(page: Page): Promise<void> {
  await page.waitForFunction(() => document.fonts.status === 'loaded');
  await page.waitForFunction(() => {
    const items = document.querySelectorAll('[data-testid^="ledger-reveal-item"]');
    return items.length > 0 && Array.from(items).every((el) => getComputedStyle(el).opacity === '1');
  });
  await page.waitForTimeout(700);
}

/** Fonts + every DataInkDraw group opaque + time for the vine stroke draw. */
async function settleGreenhouse(page: Page): Promise<void> {
  await page.waitForFunction(() => document.fonts.status === 'loaded');
  await page.waitForFunction(() => {
    const groups = document.querySelectorAll('[data-testid^="data-ink-draw-group"]');
    return groups.length > 0 && Array.from(groups).every((el) => getComputedStyle(el).opacity === '1');
  });
  await page.waitForTimeout(1400);
}

test.beforeEach(async ({ page }) => {
  mkdirSync(DIR, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 900 });
});

test('live personal: the Annual Letter engraves the tenure line and admits the correction', async ({
  page,
}) => {
  await page.goto('/live/home-technical-leadership-portfolio');

  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Balakrishnan');
  await expect(page.getByTestId('synthetic-mark')).toContainText('ILLUSTRATIVE PROFILE');

  // The commanding visual and its mirror both name the sunset system.
  await expect(page.getByTestId('tenure-engraving')).toBeVisible();
  const record = page.getByTestId('record-table');
  await expect(record.locator('tr[data-sunset="true"]')).toHaveCount(1);
  await expect(record).toContainText('Cost Governor');
  await expect(page.getByRole('heading', { name: /What I got wrong in FY26/ })).toBeVisible();

  await settleReveal(page);
  await page.screenshot({ path: shot('live-annual-letter.png'), fullPage: true });
});

test('live personal: the Bench Journal runs entries and keeps the struck one legible', async ({
  page,
}) => {
  await page.goto('/live/home-ai-experiment-notebook');

  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Sana Okonkwo');

  // The struck entry stays legible with its correcting margin note.
  const struck = page.locator('.bj-entry-struck');
  await expect(struck).toHaveCount(1);
  await expect(struck).toContainText('WRONG CONTROL GROUP — SEE ENTRY 41');
  await expect(page.getByTestId('index-card')).toBeVisible();

  // Both taped-in figure plates have painted.
  await page
    .locator('[data-testid="chart-mount"] canvas, [data-testid="chart-mount"] svg')
    .first()
    .waitFor();

  await settleReveal(page);
  await page.screenshot({ path: shot('live-bench-journal.png'), fullPage: true });
});

test('live personal: the Greenhouse grows the bench and wilts one specimen honestly', async ({
  page,
}) => {
  await page.goto('/live/home-internal-ai-tool-laboratory');

  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Elior Ashworth');

  // The wilting specimen is honestly labelled; the propagation log mirrors it.
  await expect(page.getByTestId('deprecation-flag')).toContainText(
    'DEPRECATION CANDIDATE · SUCCESSOR: review-copilot',
  );
  await expect(page.getByTestId('propagation-log')).toContainText('Knowledge & Search');

  await settleGreenhouse(page);
  await page.screenshot({ path: shot('live-greenhouse.png'), fullPage: true });
});
