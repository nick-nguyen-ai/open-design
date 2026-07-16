import { z } from 'zod';

/**
 * The diagram grammar: eight bounded, JSON-serializable spec schemas — one per
 * canonical diagram kind distilled from the ByteByteGo corpus survey (see
 * docs/superpowers/specs/2026-07-16-diagram-collections-design.md). The grammar
 * carries MEANING only; every visual decision lives in a collection renderer.
 *
 * Bounds are part of the contract: any schema-valid spec must stay composed in
 * every collection, so node/edge/item counts and string lengths are capped here
 * rather than policed per renderer.
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

const id = z.string().min(1).max(40);
const label = z.string().min(1).max(80);
const detail = z.string().max(160);

/** Directed step-by-step flow: the "how it works" workhorse. */
export const FlowSpec = z
  .object({
    kind: z.literal('flow'),
    title: label,
    nodes: z
      .array(
        z.object({
          id,
          label,
          kind: z.enum(['start', 'process', 'decision', 'data', 'actor', 'end']),
        }),
      )
      .min(3)
      .max(12),
    edges: z
      .array(
        z.object({
          from: id,
          to: id,
          label: label.optional(),
          step: z.number().int().min(1).max(20).optional(),
        }),
      )
      .min(2)
      .max(16),
  })
  .refine(
    (s) => s.edges.every((e) => s.nodes.some((n) => n.id === e.from) && s.nodes.some((n) => n.id === e.to)),
    { message: 'every edge endpoint must be a node id' },
  );
export type FlowSpecT = z.infer<typeof FlowSpec>;

/** Lifelines and ordered messages: protocol walkthroughs. */
export const SequenceSpec = z
  .object({
    kind: z.literal('sequence'),
    title: label,
    actors: z
      .array(z.object({ id, label, kind: z.enum(['user', 'service', 'store', 'external']) }))
      .min(2)
      .max(6),
    messages: z
      .array(z.object({ from: id, to: id, label, reply: z.boolean().optional(), note: detail.optional() }))
      .min(2)
      .max(14),
  })
  .refine(
    (s) => s.messages.every((m) => s.actors.some((a) => a.id === m.from) && s.actors.some((a) => a.id === m.to)),
    { message: 'every message endpoint must be an actor id' },
  );
export type SequenceSpecT = z.infer<typeof SequenceSpec>;

/** Stacked horizontal bands: OSI-style level maps. */
export const LayersSpec = z.object({
  kind: z.literal('layers'),
  title: label,
  layers: z
    .array(
      z.object({
        id,
        label,
        detail: detail.optional(),
        items: z.array(label).max(6).optional(),
        tone: z.enum(['base', 'accent', 'alert']).optional(),
      }),
    )
    .min(3)
    .max(9),
  sideLabel: label.optional(),
});
export type LayersSpecT = z.infer<typeof LayersSpec>;

/** Clustered zones with cross-links: the architecture map. */
export const ZonesSpec = z
  .object({
    kind: z.literal('zones'),
    title: label,
    zones: z
      .array(z.object({ id, label, nodes: z.array(z.object({ id, label })).min(1).max(8) }))
      .min(2)
      .max(6),
    links: z.array(z.object({ from: id, to: id, label: label.optional() })).max(14),
  })
  .refine(
    (s) => {
      const ids = new Set(s.zones.flatMap((zone) => zone.nodes.map((n) => n.id)));
      return s.links.every((l) => ids.has(l.from) && ids.has(l.to));
    },
    { message: 'every link endpoint must be a zone-node id' },
  );
export type ZonesSpecT = z.infer<typeof ZonesSpec>;

/** Closed loop of stages: pipelines and feedback cycles. */
export const CycleSpec = z.object({
  kind: z.literal('cycle'),
  title: label,
  stages: z.array(z.object({ id, label, detail: detail.optional() })).min(3).max(8),
  hubLabel: label.optional(),
});
export type CycleSpecT = z.infer<typeof CycleSpec>;

/** Parallel columns contrasted row by row: the versus panel. */
export const CompareSpec = z
  .object({
    kind: z.literal('compare'),
    title: label,
    columns: z.array(z.object({ id, label, tone: z.enum(['base', 'accent']).optional() })).min(2).max(4),
    rows: z
      .array(z.object({ label, values: z.array(z.string().max(120)).min(2).max(4) }))
      .min(2)
      .max(8),
    verdict: detail.optional(),
  })
  .refine((s) => s.rows.every((r) => r.values.length === s.columns.length), {
    message: 'each row has exactly one value per column',
  });
export type CompareSpecT = z.infer<typeof CompareSpec>;

/** Numbered grid of concepts: the top-N celled panel. */
export const CellsSpec = z.object({
  kind: z.literal('cells'),
  title: label,
  cells: z
    .array(z.object({ id, label, detail: detail.optional(), badge: z.string().max(12).optional() }))
    .min(4)
    .max(12),
  columnsHint: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
});
export type CellsSpecT = z.infer<typeof CellsSpec>;

/** Eras along an axis: evolution stories. */
export const TimelineSpec = z
  .object({
    kind: z.literal('timeline'),
    title: label,
    eras: z
      .array(z.object({ id, label, detail: detail.optional(), marker: z.string().max(12).optional() }))
      .min(3)
      .max(8),
    nowIndex: z.number().int().nonnegative().optional(),
  })
  .refine((s) => s.nowIndex === undefined || s.nowIndex < s.eras.length, {
    message: 'nowIndex must index an era',
  });
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
