import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const DIR = resolve(process.cwd(), 'e2e/screenshots');
const shot = (name: string) => resolve(DIR, name);

/** Fonts loaded + any signature-sequence items fully opaque + a beat. */
async function settleWorld(page: Page): Promise<void> {
  await page.waitForFunction(() => document.fonts.status === 'loaded');
  await page.waitForFunction(() => {
    const items = document.querySelectorAll(
      '[data-testid^="ledger-reveal-item"], [data-testid^="horizon-sweep-item"]',
    );
    return Array.from(items).every((el) => getComputedStyle(el).opacity === '1');
  });
  await page.waitForTimeout(700);
}

/** The deck settles when the active slide's build lines have all landed. */
async function settleDeck(page: Page): Promise<void> {
  await page.waitForFunction(() => document.fonts.status === 'loaded');
  await page.waitForFunction(() => {
    if (document.querySelector('.bd-slide[data-state="leaving"]')) return false;
    const builds = document.querySelectorAll('.bd-slide[data-state="active"] .bd-build');
    if (builds.length === 0) return false;
    return Array.from(builds).every((el) => getComputedStyle(el).opacity === '1');
  });
  await page.waitForTimeout(400);
}

test.beforeEach(async ({ page }) => {
  mkdirSync(DIR, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 900 });
});

test('live deck: keyboard-driven board pack, deep links, monumental slide screenshot', async ({
  page,
}) => {
  await page.goto('/live/deck-ai-strategy');

  // The deck owns the viewport; slide 1 of 12 with the counter chrome.
  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByTestId('slide-counter')).toContainText(
    '01 / 12 · AI STRATEGY · BOARD OF DIRECTORS · FY27',
  );
  await expect(page.locator('.bd-slide[data-state="active"]')).toHaveAttribute(
    'data-slide-id',
    'title',
  );

  // Arrow keys advance and the URL tracks the slide.
  await settleDeck(page);
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByTestId('slide-counter')).toContainText('03 / 12');
  await expect(page).toHaveURL(/slide=3/);
  await expect(page.locator('.bd-slide[data-state="active"]')).toHaveAttribute(
    'data-slide-id',
    'estate',
  );

  // The monumental content slide is the evidence for the world.
  await settleDeck(page);
  await page.screenshot({ path: shot('live-deck.png'), fullPage: true });

  // Home/End and ArrowLeft complete the contract.
  await page.keyboard.press('End');
  await expect(page.getByTestId('slide-counter')).toContainText('12 / 12');
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByTestId('slide-counter')).toContainText('11 / 12');
  await page.keyboard.press('Home');
  await expect(page.getByTestId('slide-counter')).toContainText('01 / 12');

  // A ?slide= deep link lands mid-deck.
  await page.goto('/live/deck-ai-strategy?slide=9');
  await expect(page.getByTestId('slide-counter')).toContainText('09 / 12');
  await expect(page.locator('.bd-slide[data-state="active"]')).toContainText('$285M');
});

test('live programme: the validation ledger renders, flags the stall, screenshots', async ({
  page,
}) => {
  await page.goto('/live/proj-ai-model-validation-hub');

  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'until the ledger says otherwise',
  );

  // The stalled item is flagged in the bespoke ledger and mirrored in the table.
  const table = page.getByTestId('ledger-table');
  await expect(table).toContainText('wholesale-credit-pd');
  await expect(table.locator('tr[data-stalled]')).toHaveCount(1);
  await expect(page.getByTestId('rag-posture')).toContainText('RAG AMBER');

  // Exhibit A has painted.
  await page
    .locator('[data-testid="chart-mount"] canvas, [data-testid="chart-mount"] svg')
    .first()
    .waitFor();

  await settleWorld(page);
  await page.screenshot({ path: shot('live-programme.png'), fullPage: true });
});

test('live studio: signal glass, the kept failure, the synthetic mark, screenshots', async ({
  page,
}) => {
  await page.goto('/live/home-data-scientist-studio');

  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('measured in public');
  await expect(page.getByTestId('synthetic-mark')).toContainText('ILLUSTRATIVE PROFILE');

  const shelf = page.getByTestId('experiment-shelf');
  await expect(shelf).toContainText('FAILED · KEPT');
  await expect(page.getByTestId('skills-constellation')).toBeVisible();

  // The personal drift widget has painted.
  await page
    .locator('[data-testid="chart-mount"] canvas, [data-testid="chart-mount"] svg')
    .first()
    .waitFor();

  await settleWorld(page);
  await page.screenshot({ path: shot('live-studio.png'), fullPage: true });
});
