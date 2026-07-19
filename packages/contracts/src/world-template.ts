import { z } from 'zod';
import { Audience, SurfaceType, ThemeMode } from './enums.js';

/**
 * Phase B world-template descriptors. A shipped deck world, once templatized,
 * publishes a **descriptor**: the craft-carrying contract the registry compiles
 * to JSON and the MCP server hands back as a fill skeleton. The descriptor names
 * every content slot, its type, its limits (char caps + item counts derived from
 * the shipped instance + headroom), and the guidance that keeps a fill from
 * silently degrading the design.
 *
 * The whole tree is JSON-serializable by construction — only primitives, enums,
 * arrays, and plain objects. No functions, so Task 3 can compile a descriptor
 * straight into `packages/registry/generated/world-templates.json`.
 */

/** The kind of content a slot carries. Drives the fill-skeleton example the MCP emits. */
export const SlotType = z.enum([
  'text',
  'longtext',
  'number',
  'metric',
  'items',
  'tableRows',
  'nodes',
  'edges',
]);
export type SlotType = z.infer<typeof SlotType>;

/**
 * Per-slot limits derived from the shipped instance's real magnitudes plus ~30%
 * headroom. `maxChars` stops a headline overflowing its frame; `minItems`/
 * `maxItems` keep grids, tables, and numbered lists balanced. The object is
 * required (so every slot declares its bound envelope) but every field is
 * optional — a `number` slot needs no char cap, a `text` slot needs no counts.
 */
export const SlotLimits = z.object({
  maxChars: z.number().int().positive().optional(),
  minItems: z.number().int().nonnegative().optional(),
  maxItems: z.number().int().nonnegative().optional(),
});
export type SlotLimits = z.infer<typeof SlotLimits>;

/** A single content slot the consumer must fill. */
export const SlotSpec = z.object({
  name: z.string().min(1),
  type: SlotType,
  required: z.boolean(),
  limits: SlotLimits,
  guidance: z.string().min(1),
});
export type SlotSpec = z.infer<typeof SlotSpec>;

/**
 * Machine-checkable craft rules a template declares, parameterized so any
 * template can express its design-defining constraint without server changes.
 * `validate_fill` interprets them generically:
 * - `exactly-one`: the array at `path` has exactly one element whose `field`
 *   equals `equals` (the single flagged anomaly/blocker/tension).
 * - `required-nonempty`: the string at `path` is present and non-empty after
 *   trimming (the provenance notice).
 * - `no-back-edges`: the array at `path`, read as directed edges via literal
 *   `from`/`to` string fields, is acyclic. Declared by templates whose diagram
 *   auto-layout is designed around a DAG (a back-edge lays out as a stranded
 *   node with orphaned step markers). An empty/missing array passes — presence
 *   is the slot's `required` flag's job, not this rule's.
 * New kinds join the union only when a template needs one.
 */
export const CraftRule = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('exactly-one'),
    path: z.string().min(1),
    field: z.string().min(1),
    equals: z.string().min(1),
    description: z.string().min(1),
  }),
  z.object({
    kind: z.literal('required-nonempty'),
    path: z.string().min(1),
    description: z.string().min(1),
  }),
  z.object({
    kind: z.literal('no-back-edges'),
    path: z.string().min(1),
    description: z.string().min(1),
  }),
]);
export type CraftRule = z.infer<typeof CraftRule>;

/** How many times a section may repeat within a composed surface. */
export const SectionRepeats = z.object({
  min: z.number().int().nonnegative(),
  max: z.number().int().positive(),
});
export type SectionRepeats = z.infer<typeof SectionRepeats>;

/** One section anatomy (a deck slide kind, a page region) — purpose + slots. */
export const SectionSpec = z.object({
  kind: z.string().min(1),
  purpose: z.string().min(1),
  repeats: SectionRepeats.optional(),
  slots: z.array(SlotSpec).min(1),
});
export type SectionSpec = z.infer<typeof SectionSpec>;

/**
 * The full world-template descriptor. `style` records whether the template is an
 * art-directed world conceit or a deliberately conventional anatomy; `mood`
 * carries the locked theme mode. `guidance` is the craft-guarantee prose the MCP
 * echoes so a fill author knows what the template promises (the flagged anomaly,
 * the synthetic notice, the balanced grids).
 */
/**
 * Resolve a dot-path (e.g. `deck.notice`, `summary.sentences`) against a value.
 * Returns `undefined` at the first non-object hop, so a missing slot is
 * distinguishable from a present `null`/`false`. Shared by `validate_fill` (the
 * MCP tool) and the registry certifier so the two never diverge.
 */
export function resolveFillPath(root: unknown, path: string): unknown {
  let current: unknown = root;
  for (const part of path.split('.')) {
    if (current === null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

/**
 * Pure pass/fail evaluation of a single {@link CraftRule} against a fill — the
 * one interpreter both `validate_fill` and the certifier call, so the machine-
 * checkable craft guarantee is defined in exactly one place.
 * - `required-nonempty`: the string at `path` is present and non-empty (trimmed).
 * - `exactly-one`: the array at `path` has exactly one element whose `field`
 *   equals `equals`.
 * - `no-back-edges`: the `from`/`to` edge list at `path` forms no cycle.
 *   Malformed elements (missing/non-string endpoints) are skipped rather than
 *   failed — shape validation belongs to the world's Zod fill schema; a
 *   non-array value passes for the same reason.
 */
export function evaluateCraftRule(rule: CraftRule, fill: unknown): boolean {
  const value = resolveFillPath(fill, rule.path);
  if (rule.kind === 'required-nonempty') {
    return typeof value === 'string' && value.trim().length > 0;
  }
  if (rule.kind === 'no-back-edges') {
    return !hasCycle(value);
  }
  const count = Array.isArray(value)
    ? value.filter(
        (el) => typeof el === 'object' && el !== null && (el as Record<string, unknown>)[rule.field] === rule.equals,
      ).length
    : 0;
  return count === 1;
}

/** True when the `from`/`to` edge list contains a directed cycle (incl. self-loops). */
function hasCycle(edges: unknown): boolean {
  if (!Array.isArray(edges)) return false;
  const adjacency = new Map<string, string[]>();
  for (const edge of edges) {
    if (typeof edge !== 'object' || edge === null) continue;
    const { from, to } = edge as Record<string, unknown>;
    if (typeof from !== 'string' || typeof to !== 'string') continue;
    const targets = adjacency.get(from);
    if (targets) targets.push(to);
    else adjacency.set(from, [to]);
  }
  // Iterative DFS with a three-state visit map: absent = unvisited,
  // false = on the current path, true = fully explored.
  const state = new Map<string, boolean>();
  for (const start of adjacency.keys()) {
    if (state.get(start) === true) continue;
    const stack: Array<{ node: string; nextIndex: number }> = [{ node: start, nextIndex: 0 }];
    state.set(start, false);
    while (stack.length > 0) {
      const frame = stack[stack.length - 1]!;
      const targets = adjacency.get(frame.node) ?? [];
      if (frame.nextIndex >= targets.length) {
        state.set(frame.node, true);
        stack.pop();
        continue;
      }
      const next = targets[frame.nextIndex]!;
      frame.nextIndex += 1;
      const seen = state.get(next);
      if (seen === false) return true; // back-edge onto the current path
      if (seen === undefined) {
        state.set(next, false);
        stack.push({ node: next, nextIndex: 0 });
      }
    }
  }
  return false;
}

/**
 * Headroom factor `validate_fill` applies over a slot's SHIPPED magnitude: a
 * candidate value longer than `shipped × RENDER_BUDGET_HEADROOM` earns a
 * `renderBudget` finding even when it is inside the descriptor's `maxChars`.
 * The shipped world is the proven-to-render corpus; the descriptor cap is only
 * the hard envelope.
 */
export const RENDER_BUDGET_HEADROOM = 1.25;

/**
 * Drift factor the certifier applies between a slot's declared `maxChars` and
 * its shipped magnitude: a cap more than `shipped × MAXCHARS_DRIFT_FACTOR` is a
 * `budget-drift` finding — the contract has drifted from what the template
 * actually renders without ellipsis (maxChars is documented as shipped + ~30%).
 */
export const MAXCHARS_DRIFT_FACTOR = 4;

/**
 * Absolute slack that must ALSO be exceeded before `budget-drift` fires: tiny
 * slots (a 9-char deck code under a 24-char cap) trip a pure ratio test while
 * being harmless — drift is only worth a finding when the cap is both >factor×
 * shipped AND more than this many characters above it.
 */
export const MAXCHARS_DRIFT_SLACK = 40;

/**
 * The shipped magnitude of one slot, derived at registry build time from the
 * world's `SHIPPED_FILL` (never hand-authored):
 * - `chars` — length of a string slot's shipped value.
 * - `itemChars` — max element length of a string-array slot.
 * - `fields` — for object-array slots (`items`/`nodes`/`edges`/`tableRows`),
 *   max shipped length per string field across elements. Fields absent from
 *   every shipped element get no entry (and therefore no budget).
 */
export const SlotMagnitude = z.object({
  chars: z.number().int().nonnegative().optional(),
  itemChars: z.number().int().nonnegative().optional(),
  fields: z.record(z.string(), z.number().int().nonnegative()).optional(),
});
export type SlotMagnitude = z.infer<typeof SlotMagnitude>;

/**
 * templateId → slot dot-path → shipped magnitude. Compiled into
 * `generated/shipped-magnitudes.json` as a parallel artefact (NOT part of the
 * descriptor, so the SECTIONS⇄descriptor lockstep stays untouched) and loaded
 * by the MCP server to enforce render budgets in `validate_fill`.
 */
export const ShippedMagnitudes = z.record(z.string(), z.record(z.string(), SlotMagnitude));
export type ShippedMagnitudes = z.infer<typeof ShippedMagnitudes>;

export const WorldTemplateDescriptor = z.object({
  schemaVersion: z.literal('1.1'),
  id: z.string().min(1),
  experienceId: z.string().min(1),
  surface: SurfaceType,
  style: z.enum(['art-directed', 'conventional']),
  mood: ThemeMode,
  grammarId: z.string().min(1),
  audiences: z.array(Audience).min(1),
  businessIntents: z.array(z.string()).min(1),
  /**
   * Free-text keywords that bias template selection toward this world when a
   * brief mentions them (surface-neutral targeting metadata). Defaults to none.
   */
  briefKeywords: z.array(z.string().min(1)).default([]),
  componentsUsed: z.array(z.string()),
  sections: z.array(SectionSpec).min(1),
  guidance: z.array(z.string()),
  /**
   * The machine-checkable craft rules `validate_fill` enforces (beyond the slot
   * limits). Omitted defaults to none; each pilot template declares its
   * `exactly-one` anomaly rule plus a `required-nonempty` provenance notice.
   */
  craftRules: z.array(CraftRule).default([]),
});
export type WorldTemplateDescriptor = z.infer<typeof WorldTemplateDescriptor>;
