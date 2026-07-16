import { z } from 'zod';

/**
 * The grammar's raw field shapes and cross-reference checks, exported so a
 * world-template FILL can embed a diagram's content fields (everything except
 * the `kind` discriminant, which the template injects) without re-declaring
 * bounds — one source of truth shared by `specs.ts` and every deck fill.
 */

export const id = z.string().min(1).max(40);
export const label = z.string().min(1).max(80);
export const detail = z.string().max(160);

export const FLOW_FIELDS = {
  title: label,
  nodes: z
    .array(z.object({ id, label, kind: z.enum(['start', 'process', 'decision', 'data', 'actor', 'end']) }))
    .min(3)
    .max(12),
  edges: z
    .array(z.object({ from: id, to: id, label: label.optional(), step: z.number().int().min(1).max(20).optional() }))
    .min(2)
    .max(16),
};

export function flowRefsResolve(v: {
  nodes: Array<{ id: string }>;
  edges: Array<{ from: string; to: string }>;
}): boolean {
  return v.edges.every((e) => v.nodes.some((n) => n.id === e.from) && v.nodes.some((n) => n.id === e.to));
}

export const SEQUENCE_FIELDS = {
  title: label,
  actors: z.array(z.object({ id, label, kind: z.enum(['user', 'service', 'store', 'external']) })).min(2).max(6),
  messages: z
    .array(z.object({ from: id, to: id, label, reply: z.boolean().optional(), note: detail.optional() }))
    .min(2)
    .max(14),
};

export function sequenceRefsResolve(v: {
  actors: Array<{ id: string }>;
  messages: Array<{ from: string; to: string }>;
}): boolean {
  return v.messages.every((m) => v.actors.some((a) => a.id === m.from) && v.actors.some((a) => a.id === m.to));
}

export const LAYERS_FIELDS = {
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
};

export const ZONES_FIELDS = {
  title: label,
  zones: z
    .array(z.object({ id, label, nodes: z.array(z.object({ id, label })).min(1).max(8) }))
    .min(2)
    .max(6),
  links: z.array(z.object({ from: id, to: id, label: label.optional() })).max(14),
};

export function zonesRefsResolve(v: {
  zones: Array<{ nodes: Array<{ id: string }> }>;
  links: Array<{ from: string; to: string }>;
}): boolean {
  const ids = new Set(v.zones.flatMap((zone) => zone.nodes.map((n) => n.id)));
  return v.links.every((l) => ids.has(l.from) && ids.has(l.to));
}

export const CYCLE_FIELDS = {
  title: label,
  stages: z.array(z.object({ id, label, detail: detail.optional() })).min(3).max(8),
  hubLabel: label.optional(),
};

export const COMPARE_FIELDS = {
  title: label,
  columns: z.array(z.object({ id, label, tone: z.enum(['base', 'accent']).optional() })).min(2).max(4),
  rows: z
    .array(z.object({ label, values: z.array(z.string().max(120)).min(2).max(4) }))
    .min(2)
    .max(8),
  verdict: detail.optional(),
};

export function compareRowsMatchColumns(v: {
  columns: Array<unknown>;
  rows: Array<{ values: Array<unknown> }>;
}): boolean {
  return v.rows.every((r) => r.values.length === v.columns.length);
}

export const CELLS_FIELDS = {
  title: label,
  cells: z
    .array(z.object({ id, label, detail: detail.optional(), badge: z.string().max(12).optional() }))
    .min(4)
    .max(12),
  columnsHint: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
};

export const TIMELINE_FIELDS = {
  title: label,
  eras: z
    .array(z.object({ id, label, detail: detail.optional(), marker: z.string().max(12).optional() }))
    .min(3)
    .max(8),
  nowIndex: z.number().int().nonnegative().optional(),
};

export function timelineNowInRange(v: { eras: Array<unknown>; nowIndex?: number }): boolean {
  return v.nowIndex === undefined || v.nowIndex < v.eras.length;
}
