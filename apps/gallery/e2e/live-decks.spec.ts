import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * The task-15 deck batch: three live slide-deck worlds, each structurally and
 * atmospherically distinct from the Morning Board Pack and from each other.
 * Each test lands on a CONTENT slide (never the title), exercises the deck
 * mechanics (keyboard, ?slide=, deep link) the worlds share, and captures the
 * full-page evidence screenshot.
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
  await page.waitForTimeout(450);
}

test.beforeEach(async ({ page }) => {
  mkdirSync(DIR, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 900 });
});

test('live committee paper: recommendation-first clauses, the struck option, screenshot', async ({
  page,
}) => {
  await page.goto('/live/deck-executive-decision-proposal');
  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByTestId('clause-counter')).toContainText('01 / 10');

  // Deep-link straight to the options clause (a content slide): the committee's
  // own preferred Option 4 is struck, declined by Model Risk — the anomaly.
  await page.goto('/live/deck-executive-decision-proposal?slide=4');
  await expect(page.getByTestId('clause-counter')).toContainText('04 / 10 · CLAUSE 3 OF 9');
  const options = page.getByTestId('options-table');
  await expect(options.locator('tr[data-struck="true"]')).toContainText('Defer decision to FY28');
  await expect(options.locator('tr[data-recommended="true"]')).toContainText(
    'Governed champion–challenger',
  );

  await settleDeck(page, '.cp-sheet');
  await page.screenshot({ path: shot('live-committee-paper.png'), fullPage: true });

  // Keyboard mechanics: End lands on the resolution, Home returns to the cover.
  await page.keyboard.press('End');
  await expect(page.getByTestId('clause-counter')).toContainText('10 / 10 · CLAUSE 9 OF 9');
  await page.keyboard.press('Home');
  await expect(page.getByTestId('clause-counter')).toContainText('01 / 10');
});

test('live lab report: evidence plates, the open critical finding, screenshot', async ({ page }) => {
  await page.goto('/live/deck-genai-model-validation-report');
  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByTestId('plate-counter')).toContainText('01 / 08');

  // Deep-link to FIG 1 (a content evidence plate): the adversarial class breaches
  // the validation appetite — the bar the whole report turns on.
  await page.goto('/live/deck-genai-model-validation-report?slide=4');
  await expect(page.getByTestId('plate-counter')).toContainText(
    '04 / 08 · PLATE 03 OF 7 · VALIDATION OF llm-doc-triage-v2',
  );
  await page
    .locator('[data-testid="chart-mount"] canvas, [data-testid="chart-mount"] svg')
    .first()
    .waitFor();

  await settleDeck(page, '.lr-plate');
  await page.screenshot({ path: shot('live-lab-report.png'), fullPage: true });

  // The R key jumps to the findings register — the open CRITICAL VF-07 anomaly.
  await page.keyboard.press('r');
  await expect(page.getByTestId('plate-counter')).toContainText('06 / 08 · PLATE 05 OF 7');
  await expect(
    page.getByTestId('findings-register').locator('tr[data-open="true"]'),
  ).toContainText('VF-07');
});

test('live control frame: the control matrix, the acknowledged gap, screenshot', async ({
  page,
}) => {
  // Deep-link to the matrix frame (the commanding content visual): a real table
  // of 30 controls with one dashed GAP cell — the anomaly.
  await page.goto('/live/deck-ai-governance-and-controls?slide=3');
  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByTestId('frame-counter')).toContainText('03 / 08');
  await expect(page.getByTestId('frame-counter')).toContainText('1 GAP');

  const matrix = page.getByTestId('control-matrix');
  await expect(matrix.locator('td[data-gap="true"]')).toContainText(
    'Fairness monitoring in production',
  );
  await expect(matrix.locator('td[data-status="certified"]').first()).toBeVisible();

  await settleDeck(page, '.cf-frame');
  await page.screenshot({ path: shot('live-control-frame.png'), fullPage: true });

  // The M key returns to the matrix from anywhere; End reaches the closing frame.
  await page.keyboard.press('End');
  await expect(page.getByTestId('frame-counter')).toContainText('08 / 08');
  await page.keyboard.press('m');
  await expect(page.getByTestId('frame-counter')).toContainText('03 / 08');
});
