import type { DiagramSpec } from './specs.js';

/**
 * The textual mirror every collection must render alongside the SVG: a plain
 * ordered description carrying EVERY editorial string in the spec (labels,
 * details, values, markers, notes), so screen-reader and search access never
 * depends on the visual. Collections wrap these lines in a visually hidden
 * list; the grammar owns the wording so all five families agree.
 */
export function buildOutline(spec: DiagramSpec): string[] {
  switch (spec.kind) {
    case 'flow': {
      const labelById = new Map(spec.nodes.map((n) => [n.id, n.label]));
      return [
        `Flow: ${spec.title}`,
        ...spec.nodes.map((n) => `${n.label} (${n.kind})`),
        ...spec.edges.map((e) => {
          const from = labelById.get(e.from) ?? e.from;
          const to = labelById.get(e.to) ?? e.to;
          const step = e.step !== undefined ? `${e.step}. ` : '';
          return e.label ? `${step}${from} → ${to}: ${e.label}` : `${step}${from} → ${to}`;
        }),
      ];
    }
    case 'sequence': {
      const labelById = new Map(spec.actors.map((a) => [a.id, a.label]));
      return [
        `Sequence: ${spec.title}`,
        `Participants: ${spec.actors.map((a) => a.label).join(', ')}`,
        ...spec.messages.map((m, i) => {
          const from = labelById.get(m.from) ?? m.from;
          const to = labelById.get(m.to) ?? m.to;
          const note = m.note ? ` (note: ${m.note})` : '';
          return `${i + 1}. ${from} → ${to}: ${m.label}${note}`;
        }),
      ];
    }
    case 'layers':
      return [
        `Layers: ${spec.title}`,
        ...(spec.sideLabel ? [`Axis: ${spec.sideLabel}`] : []),
        ...spec.layers.map((l, i) => {
          const detail = l.detail ? ` — ${l.detail}` : '';
          const items = l.items && l.items.length > 0 ? ` [${l.items.join(', ')}]` : '';
          return `${i + 1}. ${l.label}${detail}${items}`;
        }),
      ];
    case 'zones': {
      const labelById = new Map(spec.zones.flatMap((z) => z.nodes.map((n) => [n.id, n.label] as const)));
      return [
        `Architecture: ${spec.title}`,
        ...spec.zones.map((z) => `Zone ${z.label}: ${z.nodes.map((n) => n.label).join(', ')}`),
        ...spec.links.map((l) => {
          const from = labelById.get(l.from) ?? l.from;
          const to = labelById.get(l.to) ?? l.to;
          return l.label ? `${from} → ${to}: ${l.label}` : `${from} → ${to}`;
        }),
      ];
    }
    case 'cycle':
      return [
        `Cycle: ${spec.title}`,
        ...(spec.hubLabel ? [`Hub: ${spec.hubLabel}`] : []),
        ...spec.stages.map((s, i) => `${i + 1}. ${s.label}${s.detail ? ` — ${s.detail}` : ''}`),
        `${spec.stages[spec.stages.length - 1]!.label} returns to ${spec.stages[0]!.label}.`,
      ];
    case 'compare':
      return [
        `Comparison: ${spec.title}`,
        `Compared: ${spec.columns.map((c) => c.label).join(' vs ')}`,
        ...spec.rows.map(
          (r) => `${r.label}: ${r.values.map((v, j) => `${spec.columns[j]!.label} = ${v}`).join('; ')}`,
        ),
        ...(spec.verdict ? [`Verdict: ${spec.verdict}`] : []),
      ];
    case 'cells':
      return [
        `Grid: ${spec.title}`,
        ...spec.cells.map((c, i) => {
          const badge = c.badge ? ` (${c.badge})` : '';
          return `${i + 1}. ${c.label}${badge}${c.detail ? ` — ${c.detail}` : ''}`;
        }),
      ];
    case 'timeline':
      return [
        `Timeline: ${spec.title}`,
        ...spec.eras.map((e, i) => {
          const marker = e.marker ? ` (${e.marker})` : '';
          return `${i + 1}. ${e.label}${marker}${e.detail ? ` — ${e.detail}` : ''}`;
        }),
        ...(spec.nowIndex !== undefined ? [`current: ${spec.eras[spec.nowIndex]!.label}`] : []),
      ];
  }
}
