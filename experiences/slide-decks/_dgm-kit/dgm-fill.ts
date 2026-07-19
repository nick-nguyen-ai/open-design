import { z } from 'zod';
import type { SectionSpec } from '@enterprise-design/contracts';
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
} from '@enterprise-design/diagram-grammar';

/**
 * The shared content contract of the five "grammar tour" decks
 * (`deck-dgm-<family>`): one cover, eight diagram slides — one per diagram
 * kind, fields embedded straight from the diagram grammar so bounds and
 * cross-reference checks have one source of truth — and one close. The five
 * templates disagree completely on craft; they agree exactly on content shape,
 * so the schema, sections, and guidance live here once.
 *
 * Each `<family>-fill.ts` re-exports `FILL_SCHEMA` / `SECTIONS` from this
 * builder (certifier contract), and each template injects the `kind`
 * discriminant when handing a slide's fields to its family renderer.
 */

const heading = z.string().min(1).max(64);
const caption = z.string().min(1).max(220);

export const DgmFill = z.object({
  deck: z.object({
    code: z.string().min(1).max(24),
    world: z.string().min(1).max(24),
    title: z.string().min(1).max(60),
    standfirst: z.string().min(1).max(240),
    /** REQUIRED craft slot: data-provenance notice, printed in the deck chrome. */
    notice: z.string().min(1).max(56),
  }),
  flow: z.object({ heading, caption, ...FLOW_FIELDS }).refine(flowRefsResolve, {
    message: 'every flow edge endpoint must be a node id',
  }),
  sequence: z.object({ heading, caption, ...SEQUENCE_FIELDS }).refine(sequenceRefsResolve, {
    message: 'every message endpoint must be an actor id',
  }),
  layers: z.object({ heading, caption, ...LAYERS_FIELDS }),
  zones: z.object({ heading, caption, ...ZONES_FIELDS }).refine(zonesRefsResolve, {
    message: 'every link endpoint must be a zone-node id',
  }),
  cycle: z.object({ heading, caption, ...CYCLE_FIELDS }),
  compare: z.object({ heading, caption, ...COMPARE_FIELDS }).refine(compareRowsMatchColumns, {
    message: 'each compare row has exactly one value per column',
  }),
  cells: z.object({ heading, caption, ...CELLS_FIELDS }),
  timeline: z.object({ heading, caption, ...TIMELINE_FIELDS }).refine(timelineNowInRange, {
    message: 'timeline nowIndex must index an era',
  }),
  close: z.object({
    takeaways: z.array(z.string().min(1).max(120)).min(3).max(6),
    signoff: z.string().min(1).max(240),
  }),
});
export type DgmFillT = z.infer<typeof DgmFill>;

const slideSlots = (
  key: string,
  kindSlots: SectionSpec['slots'],
): SectionSpec['slots'] => [
  { name: `${key}.heading`, type: 'text', required: true, limits: { maxChars: 64 }, guidance: `Editorial headline over the ${key} slide — a claim the diagram then proves.` },
  { name: `${key}.caption`, type: 'longtext', required: true, limits: { maxChars: 220 }, guidance: `One paragraph under the headline: what to read in the ${key} diagram and why it matters.` },
  { name: `${key}.title`, type: 'text', required: true, limits: { maxChars: 48 }, guidance: `The diagram's own figure title, rendered by the ${key} component's frame.` },
  ...kindSlots,
];

export const DGM_SECTIONS: SectionSpec[] = [
  {
    kind: 'cover',
    purpose: 'The tour cover — deck identity, thesis standfirst, and the provenance notice.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'deck.code', type: 'text', required: true, limits: { maxChars: 24 }, guidance: 'Short deck code shown in the chrome, e.g. "DGM-01".' },
      { name: 'deck.world', type: 'text', required: true, limits: { maxChars: 24 }, guidance: 'The world name paired with the code in the chrome.' },
      { name: 'deck.title', type: 'text', required: true, limits: { maxChars: 60 }, guidance: 'The deck title set large on the cover.' },
      { name: 'deck.standfirst', type: 'longtext', required: true, limits: { maxChars: 240 }, guidance: 'One paragraph framing the whole story the eight diagrams tell.' },
      { name: 'deck.notice', type: 'text', required: true, limits: { maxChars: 56 }, guidance: 'REQUIRED data-provenance notice (synthetic or sourced), shown in the deck chrome.' },
    ],
  },
  {
    kind: 'flow-slide',
    purpose: 'The step-by-step flow — how the thing actually works, in order.',
    repeats: { min: 1, max: 1 },
    slots: slideSlots('flow', [
      { name: 'flow.nodes', type: 'nodes', required: true, limits: { minItems: 3, maxItems: 12 }, guidance: 'Flow nodes (id, label, kind start|process|decision|data|actor|end). Kind drives the silhouette.' },
      { name: 'flow.edges', type: 'edges', required: true, limits: { minItems: 2, maxItems: 16 }, guidance: 'Directed edges (from/to node ids, optional label, optional step number for the numbered walkthrough).' },
    ]),
  },
  {
    kind: 'sequence-slide',
    purpose: 'The protocol walkthrough — who says what to whom, in order.',
    repeats: { min: 1, max: 1 },
    slots: slideSlots('sequence', [
      { name: 'sequence.actors', type: 'nodes', required: true, limits: { minItems: 2, maxItems: 6 }, guidance: 'Participants (id, label, kind user|service|store|external).' },
      { name: 'sequence.messages', type: 'edges', required: true, limits: { minItems: 2, maxItems: 14 }, guidance: 'Ordered messages (from/to actor ids, label; reply:true for returns; optional note).' },
    ]),
  },
  {
    kind: 'layers-slide',
    purpose: 'The level map — the stack from edge to metal (or equivalent).',
    repeats: { min: 1, max: 1 },
    slots: slideSlots('layers', [
      { name: 'layers.layers', type: 'items', required: true, limits: { minItems: 3, maxItems: 9 }, guidance: 'Top-to-bottom layers (id, label, optional detail, optional items ≤6, optional tone base|accent|alert).' },
      { name: 'layers.sideLabel', type: 'text', required: true, limits: { maxChars: 32 }, guidance: 'The rotated axis caption beside the stack, e.g. "request path".' },
    ]),
  },
  {
    kind: 'zones-slide',
    purpose: 'The estate map — where things run and what talks to what.',
    repeats: { min: 1, max: 1 },
    slots: slideSlots('zones', [
      { name: 'zones.zones', type: 'items', required: true, limits: { minItems: 2, maxItems: 6 }, guidance: 'Zones (id, label, nodes[] of {id,label}, 1–8 nodes each).' },
      { name: 'zones.links', type: 'edges', required: true, limits: { minItems: 1, maxItems: 14 }, guidance: 'Cross-zone links (from/to node ids, optional label such as a protocol or latency).' },
    ]),
  },
  {
    kind: 'cycle-slide',
    purpose: 'The loop — the feedback cycle that keeps the system honest.',
    repeats: { min: 1, max: 1 },
    slots: slideSlots('cycle', [
      { name: 'cycle.stages', type: 'items', required: true, limits: { minItems: 3, maxItems: 8 }, guidance: 'Clockwise stages (id, label, optional detail).' },
      { name: 'cycle.hubLabel', type: 'text', required: true, limits: { maxChars: 14 }, guidance: 'The hub label at the centre of the ring, e.g. the loop\'s owner or engine.' },
    ]),
  },
  {
    kind: 'compare-slide',
    purpose: 'The versus panel — the trade-off, contrasted row by row.',
    repeats: { min: 1, max: 1 },
    slots: slideSlots('compare', [
      { name: 'compare.columns', type: 'items', required: true, limits: { minItems: 2, maxItems: 4 }, guidance: 'Compared options (id, label, optional tone accent for the favoured one).' },
      { name: 'compare.rows', type: 'tableRows', required: true, limits: { minItems: 2, maxItems: 8 }, guidance: 'Contrast rows (label + one value per column, values ≤120 chars).' },
      { name: 'compare.verdict', type: 'longtext', required: true, limits: { maxChars: 160 }, guidance: 'The honest verdict strip under the table.' },
    ]),
  },
  {
    kind: 'cells-slide',
    purpose: 'The concept grid — the catalogue of named ideas.',
    repeats: { min: 1, max: 1 },
    slots: slideSlots('cells', [
      { name: 'cells.cells', type: 'items', required: true, limits: { minItems: 4, maxItems: 12 }, guidance: 'Grid entries (id, label, optional detail ≤160, optional short badge).' },
    ]),
  },
  {
    kind: 'timeline-slide',
    purpose: 'The evolution story — how we got here, era by era.',
    repeats: { min: 1, max: 1 },
    slots: slideSlots('timeline', [
      { name: 'timeline.eras', type: 'items', required: true, limits: { minItems: 3, maxItems: 8 }, guidance: 'Eras in order (id, label, optional detail, optional short marker like a year). Set nowIndex on the fill to flag the current era.' },
    ]),
  },
  {
    kind: 'close',
    purpose: 'The close — takeaways and the sign-off ask.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'close.takeaways', type: 'items', required: true, limits: { minItems: 3, maxItems: 6 }, guidance: 'Three-to-six one-line takeaways, each earned by a diagram in the deck.' },
      { name: 'close.signoff', type: 'longtext', required: true, limits: { maxChars: 240 }, guidance: 'One paragraph: what the reader should do or decide next.' },
    ],
  },
];

export const DGM_GUIDANCE: string[] = [
  'The deck is a grammar tour: cover, then EIGHT diagram slides (flow, sequence, layers, zones, cycle, compare, cells, timeline), then the close. Author every slide from one coherent topic so the deck reads as one story, not eight samples.',
  'Diagram fields embed the diagram grammar directly: node/edge/item ids must cross-resolve (flow edges → node ids; messages → actor ids; zone links → zone-node ids; compare rows match column count; nowIndex inside eras).',
  'Headings are claims, captions are the reading instructions, the diagram is the proof. Never caption a diagram with a restatement of its title.',
  'deck.notice must state data provenance (synthetic or sourced) — it renders in the chrome on every slide.',
  'timeline.nowIndex is optional in the schema but strongly encouraged: flag where the story stands today.',
];
