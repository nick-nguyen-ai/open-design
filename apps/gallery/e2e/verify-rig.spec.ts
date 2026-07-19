/**
 * The verify rig's committed negative test (GUIDANCE §3c: a guard that has
 * never fired is a hope). Loads the skill's planted fixture over file:// —
 * no dev server, no rig spawn — and runs the probe functions the rig injects,
 * asserting each planted defect is flagged by the RIGHT probe and the clean
 * region flags nothing.
 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { expect, test } from '@playwright/test';
import {
  probeContrast,
  probeRootOverflow,
  probeTextOverflow,
  probeTextOverlap,
} from '../../../.claude/skills/open-design/scripts/probes.mjs';

interface ProbeFinding {
  probe: string;
  selector: string;
  detail: string;
}

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = pathToFileURL(
  path.resolve(here, '../../../.claude/skills/open-design/scripts/fixtures/probe-fixture.html'),
).href;

test('the DOM probes flag each planted defect and nothing in the clean region', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(fixture);

  const rootOverflow = (await page.evaluate(probeRootOverflow)) as ProbeFinding[];
  const textOverflow = (await page.evaluate(probeTextOverflow)) as ProbeFinding[];
  const textOverlap = (await page.evaluate(probeTextOverlap)) as ProbeFinding[];
  const contrast = (await page.evaluate(probeContrast)) as ProbeFinding[];

  // Defect 1 — the 3000px strip forces horizontal scroll.
  expect(rootOverflow).toHaveLength(1);
  expect(rootOverflow[0]?.detail).toContain('scrollWidth');

  // Defect 2 — the ellipsized paragraph is the only text-overflow finding
  // (the deliberate overflow-x:auto scroller must NOT appear).
  expect(textOverflow).toHaveLength(1);
  expect(textOverflow[0]?.selector).toContain('defect-ellipsis');
  expect(textOverflow[0]?.detail).toContain('ellipsized');

  // Defect 3 — exactly the two absolutely-positioned lines overlap.
  expect(textOverlap).toHaveLength(1);
  expect(textOverlap[0]?.selector).toContain('defect-overlap-a');
  expect(textOverlap[0]?.selector).toContain('defect-overlap-b');

  // Defect 4 — the grey-on-grey paragraph fails 4.5:1; nothing else does.
  expect(contrast).toHaveLength(1);
  expect(contrast[0]?.selector).toContain('defect-contrast');
  expect(contrast[0]?.detail).toContain('below 4.5:1');
});
