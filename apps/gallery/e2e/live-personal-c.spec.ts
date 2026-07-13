import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const DIR = resolve(process.cwd(), 'e2e/screenshots');
const shot = (name: string) => resolve(DIR, name);

/** Fonts loaded + every HorizonSweep item fully opaque + a beat. */
async function settleSweep(page: Page): Promise<void> {
  await page.waitForFunction(() => document.fonts.status === 'loaded');
  await page.waitForFunction(() => {
    const items = document.querySelectorAll('[data-testid^="horizon-sweep-item"]');
    return items.length > 0 && Array.from(items).every((el) => getComputedStyle(el).opacity === '1');
  });
  await page.waitForTimeout(1200);
}

/** Fonts loaded + every LedgerReveal item fully opaque + a beat. */
async function settleReveal(page: Page): Promise<void> {
  await page.waitForFunction(() => document.fonts.status === 'loaded');
  await page.waitForFunction(() => {
    const items = document.querySelectorAll('[data-testid^="ledger-reveal-item"]');
    return items.length > 0 && Array.from(items).every((el) => getComputedStyle(el).opacity === '1');
  });
  await page.waitForTimeout(700);
}

test.beforeEach(async ({ page }) => {
  mkdirSync(DIR, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 900 });
});

test('live personal: The Atlas charts the territories and admits the uncharted gap', async ({
  page,
}) => {
  await page.goto('/live/home-knowledge-atlas');

  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('edges and all');
  await expect(page.getByTestId('synthetic-mark')).toContainText('ILLUSTRATIVE PROFILE');

  // The uncharted region — the anomaly — is drawn; the mirror table names it too.
  await expect(page.getByTestId('uncharted')).toContainText('HERE BE GAPS');
  await expect(page.getByTestId('gazetteer-table')).toContainText('left blank on purpose');

  // Focusing a territory raises its gazetteer entry.
  await page.getByRole('button', { name: /Distributed Systems/ }).focus();
  await expect(page.getByTestId('gazetteer-panel')).toContainText('Distributed Systems');

  await settleSweep(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: shot('live-atlas.png'), fullPage: true });
});

test('live personal: The Specimen Book sets each paper as a specimen and keeps the retraction', async ({
  page,
}) => {
  await page.goto('/live/home-research-publication-portfolio');

  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('earns its size');

  // The retracted specimen — the anomaly — is set with the same care, erratum shown.
  await expect(page.getByTestId('retracted-specimen')).toBeVisible();
  await expect(page.getByTestId('erratum')).toContainText('RETRACTED FY24');

  await settleReveal(page);
  await page.screenshot({ path: shot('live-specimen-book.png'), fullPage: true });
});

test('live personal: The Playbill bills the seasons and marquees the next talk', async ({
  page,
}) => {
  await page.goto('/live/home-talks-presentation-archive');

  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('house');
  await expect(page.getByTestId('now-showing')).toContainText('NOW SHOWING');

  // The cancelled engagement — the anomaly — is kept honestly on the bill.
  await expect(page.getByTestId('cancelled-mark')).toContainText('CANCELLED — SPEAKER ILLNESS');

  await settleReveal(page);
  await page.screenshot({ path: shot('live-playbill.png'), fullPage: true });
});
