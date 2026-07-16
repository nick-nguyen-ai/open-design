import { z } from 'zod';
import {
  CELLS_FIELDS,
  COMPARE_FIELDS,
  CYCLE_FIELDS,
  FLOW_FIELDS,
  LAYERS_FIELDS,
  SEQUENCE_FIELDS,
  TIMELINE_FIELDS,
  ZONES_FIELDS,
  compareRowsMatchColumns,
  flowRefsResolve,
  sequenceRefsResolve,
  timelineNowInRange,
  zonesRefsResolve,
} from './fields.js';

/**
 * The diagram grammar: eight bounded, JSON-serializable spec schemas — one per
 * canonical diagram kind distilled from the ByteByteGo corpus survey (see
 * docs/superpowers/specs/2026-07-16-diagram-collections-design.md). The grammar
 * carries MEANING only; every visual decision lives in a collection renderer.
 *
 * Bounds are part of the contract: any schema-valid spec must stay composed in
 * every collection, so node/edge/item counts and string lengths are capped in
 * `fields.ts` (shared with world-template fills) rather than policed per
 * renderer.
 */

export const DiagramKind = z.enum([
  'flow',
  'sequence',
  'layers',
  'zones',
  'cycle',
  'compare',
  'cells',
  'timeline',
]);
export type DiagramKind = z.infer<typeof DiagramKind>;

/** Directed step-by-step flow: the "how it works" workhorse. */
export const FlowSpec = z
  .object({ kind: z.literal('flow'), ...FLOW_FIELDS })
  .refine(flowRefsResolve, { message: 'every edge endpoint must be a node id' });
export type FlowSpecT = z.infer<typeof FlowSpec>;

/** Lifelines and ordered messages: protocol walkthroughs. */
export const SequenceSpec = z
  .object({ kind: z.literal('sequence'), ...SEQUENCE_FIELDS })
  .refine(sequenceRefsResolve, { message: 'every message endpoint must be an actor id' });
export type SequenceSpecT = z.infer<typeof SequenceSpec>;

/** Stacked horizontal bands: OSI-style level maps. */
export const LayersSpec = z.object({ kind: z.literal('layers'), ...LAYERS_FIELDS });
export type LayersSpecT = z.infer<typeof LayersSpec>;

/** Clustered zones with cross-links: the architecture map. */
export const ZonesSpec = z
  .object({ kind: z.literal('zones'), ...ZONES_FIELDS })
  .refine(zonesRefsResolve, { message: 'every link endpoint must be a zone-node id' });
export type ZonesSpecT = z.infer<typeof ZonesSpec>;

/** Closed loop of stages: pipelines and feedback cycles. */
export const CycleSpec = z.object({ kind: z.literal('cycle'), ...CYCLE_FIELDS });
export type CycleSpecT = z.infer<typeof CycleSpec>;

/** Parallel columns contrasted row by row: the versus panel. */
export const CompareSpec = z
  .object({ kind: z.literal('compare'), ...COMPARE_FIELDS })
  .refine(compareRowsMatchColumns, { message: 'each row has exactly one value per column' });
export type CompareSpecT = z.infer<typeof CompareSpec>;

/** Numbered grid of concepts: the top-N celled panel. */
export const CellsSpec = z.object({ kind: z.literal('cells'), ...CELLS_FIELDS });
export type CellsSpecT = z.infer<typeof CellsSpec>;

/** Eras along an axis: evolution stories. */
export const TimelineSpec = z
  .object({ kind: z.literal('timeline'), ...TIMELINE_FIELDS })
  .refine(timelineNowInRange, { message: 'nowIndex must index an era' });
export type TimelineSpecT = z.infer<typeof TimelineSpec>;

/** Any diagram, discriminated on `kind`. */
export const DiagramSpec = z.discriminatedUnion('kind', [
  FlowSpec,
  SequenceSpec,
  LayersSpec,
  ZonesSpec,
  CycleSpec,
  CompareSpec,
  CellsSpec,
  TimelineSpec,
]);
export type DiagramSpec = z.infer<typeof DiagramSpec>;
