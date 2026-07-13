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
 * Machine-checkable craft rules a template declares. The descriptor carries only
 * the rule IDs (JSON-serializable); the MCP `validate_fill` tool knows how to
 * enforce each against a fill's slot values. This is what lets the tool guarantee
 * the design-defining constraints (the single flagged anomaly, the required
 * synthetic notice) WITHOUT importing the world-specific Zod fill schema — the
 * full Zod validation remains a client-side step.
 *
 * - `exactly-one-anomaly-kpi`: `fill.kpis` is an array with exactly one entry
 *   whose `status === 'off-track'`.
 * - `exactly-one-stays-node`: `fill.nodes` is an array with exactly one entry
 *   whose `disposition === 'stays'`.
 * - `notice-required`: `fill.deck.notice` is a present, non-empty string.
 */
export const CraftRuleId = z.enum([
  'exactly-one-anomaly-kpi',
  'exactly-one-stays-node',
  'notice-required',
]);
export type CraftRuleId = z.infer<typeof CraftRuleId>;

/** How many times a slide kind may repeat within a composed deck. */
export const SlideKindRepeats = z.object({
  min: z.number().int().nonnegative(),
  max: z.number().int().positive(),
});
export type SlideKindRepeats = z.infer<typeof SlideKindRepeats>;

/** One slide anatomy in the template — its purpose and the slots it consumes. */
export const SlideKindSpec = z.object({
  kind: z.string().min(1),
  purpose: z.string().min(1),
  repeats: SlideKindRepeats.optional(),
  slots: z.array(SlotSpec).min(1),
});
export type SlideKindSpec = z.infer<typeof SlideKindSpec>;

/**
 * The full world-template descriptor. `style` records whether the template is an
 * art-directed world conceit or a deliberately conventional anatomy; `mood`
 * carries the locked theme mode. `guidance` is the craft-guarantee prose the MCP
 * echoes so a fill author knows what the template promises (the flagged anomaly,
 * the synthetic notice, the balanced grids).
 */
export const WorldTemplateDescriptor = z.object({
  schemaVersion: z.literal('1.0'),
  id: z.string().min(1),
  experienceId: z.string().min(1),
  surface: SurfaceType,
  style: z.enum(['art-directed', 'conventional']),
  mood: ThemeMode,
  grammarId: z.string().min(1),
  audiences: z.array(Audience).min(1),
  businessIntents: z.array(z.string()).min(1),
  componentsUsed: z.array(z.string()),
  slideKinds: z.array(SlideKindSpec).min(1),
  guidance: z.array(z.string()),
  /**
   * The machine-checkable craft rules `validate_fill` enforces (beyond the slot
   * limits). Omitted defaults to none; the two pilot templates declare their
   * anomaly rule plus `notice-required`.
   */
  craftRules: z.array(CraftRuleId).default([]),
});
export type WorldTemplateDescriptor = z.infer<typeof WorldTemplateDescriptor>;
