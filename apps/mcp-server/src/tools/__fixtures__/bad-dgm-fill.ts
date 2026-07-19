/**
 * Committed NEGATIVE fixture for the fill-quality gates (never a catalogue
 * fill; `__fixtures__` is excluded from discovery and certification).
 *
 * `BAD_DGM_FILL` is the shipped Lit Board fill with EXACTLY THREE planted
 * defects — one per guard this repo added after the opendesign-intro pilot:
 *
 *   1. `cells.cells[0].detail` at 120 chars — inside the descriptor cap,
 *      far over the shipped ~37-char magnitude → `renderBudget`.
 *   2. `flow.edges` gains a loop-back edge (done → src of the chain) →
 *      the `no-back-edges` craft rule.
 *   3. `deck.notice` emptied → the `required-nonempty` craft rule.
 *
 * `GOOD_TWIN_FILL` is the same clone with no defects: the false-positive
 * guard. The tripwire test asserts the bad fill yields exactly the three
 * findings above BY PATH+RULE and the twin yields none — so any silently
 * regressed guard is named by the failing assertion.
 */
import { SHIPPED_FILL } from '../../../../../experiences/slide-decks/deck-dgm-circuit/content.js';

type MutableFill = {
  deck: { notice: string };
  flow: { edges: Array<{ from: string; to: string; label?: string; step?: number }> };
  cells: { cells: Array<{ id: string; label: string; detail?: string }> };
};

function clone(): MutableFill {
  return JSON.parse(JSON.stringify(SHIPPED_FILL)) as MutableFill;
}

/** The shipped fill, untouched — must validate clean (false-positive guard). */
export const GOOD_TWIN_FILL: unknown = clone();

/** The shipped fill with the three planted defects described above. */
export const BAD_DGM_FILL: unknown = (() => {
  const fill = clone();
  // Defect 1 — renderBudget: 120 chars in a field the shipped world renders at ~37.
  fill.cells.cells[0]!.detail = 'x'.repeat(120);
  // Defect 2 — no-back-edges: close the flow into a cycle.
  const firstFrom = fill.flow.edges[0]!.from;
  const lastTo = fill.flow.edges[fill.flow.edges.length - 1]!.to;
  fill.flow.edges.push({ from: lastTo, to: firstFrom, label: 'planted loop' });
  // Defect 3 — required-nonempty: blank the provenance notice.
  fill.deck.notice = '   ';
  return fill;
})();

/** The three planted defects as (path, rule) pairs — the tripwire's oracle. */
export const PLANTED_DEFECTS = [
  { path: 'cells.cells[0].detail', rule: 'renderBudget' },
  { path: 'flow.edges', rule: 'craft' },
  { path: 'deck.notice', rule: 'craft' },
] as const;
