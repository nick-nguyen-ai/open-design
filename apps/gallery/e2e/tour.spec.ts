import { test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const DIR = resolve(process.cwd(), 'e2e/screenshots');
const shot = (name: string) => resolve(DIR, name);

async function settle(page: Page): Promise<void> {
  await page
    .waitForFunction(() => {
      const items = document.querySelectorAll(
        '[data-testid^="horizon-sweep-item"], [data-testid^="ledger-reveal-item"]',
      );
      return items.length === 0 || Array.from(items).every((el) => getComputedStyle(el).opacity === '1');
    })
    .catch(() => undefined);
  await page.waitForTimeout(400);
}

async function setLight(page: Page): Promise<void> {
  const btn = page.getByRole('button', { name: /switch to light theme/i });
  if (await btn.count()) await btn.click();
}

test.beforeEach(async ({ page }) => {
  mkdirSync(DIR, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 900 });
});

test('tour: hero (dark, above the fold)', async ({ page }) => {
  await page.goto('/');
  await settle(page);
  await page.screenshot({ path: shot('tour-hero-dark.png') });
});

test('tour: landing (light, full page)', async ({ page }) => {
  await page.goto('/');
  await setLight(page);
  await settle(page);
  await page.screenshot({ path: shot('tour-landing-light.png'), fullPage: true });
});

test('tour: template detail', async ({ page }) => {
  await page.goto('/templates/db-model-monitoring-cockpit');
  await settle(page);
  await page.screenshot({ path: shot('tour-template-detail.png'), fullPage: true });
});

test('tour: contribute (doctrine, components, grammars)', async ({ page }) => {
  await page.goto('/contribute');
  await settle(page);
  await page.screenshot({ path: shot('tour-contribute.png') });
});

test('tour: component detail with live chart', async ({ page }) => {
  await page.goto('/components/comp.trend-chart');
  await page.locator('svg, canvas').first().waitFor({ state: 'visible' }).catch(() => undefined);
  await settle(page);
  await page.screenshot({ path: shot('tour-component-detail.png'), fullPage: true });
});
