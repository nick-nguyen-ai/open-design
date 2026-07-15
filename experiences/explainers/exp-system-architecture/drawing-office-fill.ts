/**
 * The typed **fill** for "The Drawing Office" world-template — the first (and
 * currently only) TECHNICAL-EXPLAINER world-template the MCP can compose.
 *
 * The template (`DrawingOfficeTemplate.tsx`, with the bespoke
 * `ArchitectureDrawing.tsx` it imports) carries the whole craft — the signed
 * engineering-drawing conceit: the drafting-paper field, the hand-routed plan
 * with dimension lines, section cuts, zone boundaries and a hatched constraint,
 * the title block with its revision table, the schedule of parts, the general
 * notes, and the measured editorial narrative with mono margin annotations.
 * This file carries only the CONTENT contract: a Zod schema whose limits are
 * derived from the shipped instance's real magnitudes plus ~30% headroom, so
 * any schema-valid fill still yields a composed, non-broken sheet.
 *
 * THE DRAWING'S LAYOUT IS FIXED-SLOT. The plan placement of every part, the
 * orthogonal routing of every connection, and the position of every zone box
 * and dimension line are HAND-DRAFTED per shipped id and owned entirely by the
 * template. The fill therefore carries the drawing's CONTENT — part labels and
 * classes, connection endpoints and labels, zone and dimension captions — while
 * the schema PINS the node/edge/zone/dimension ID SETS to exactly the shipped
 * ids (and their counts to exactly the shipped counts). Honest bounds beat
 * pretend flexibility: a fill re-labels the as-built platform; it cannot add a
 * part the drawing has nowhere to place.
 *
 * Two craft slots are mandatory: exactly ONE part carries `emphasis:
 * 'constrained'` — the single hatched, NOTE-flagged capacity constraint that the
 * schedule, the drawing, and FIG 4.1 all point at — and the synthetic-data
 * provenance notice (`sheet.dataNotice`) printed in the footer.
 *
 * `DRAWING_OFFICE_SECTIONS` re-states the same slots as the registry-serializable
 * `SectionSpec[]` the world-template descriptor advertises.
 */
import { z } from 'zod';
import type { SectionSpec } from '@enterprise-design/contracts';

/* ------------------------------------------------------------------ */
/* Fixed-slot id vocabularies (template-owned geometry keys)           */
/*                                                                      */
/* The template's PLAN / ROUTES / zone / dimension geometry maps are    */
/* keyed by exactly these ids. The schema pins each collection's id set */
/* to its list so every hand-drafted slot is filled and no fill can     */
/* reference geometry the template has not drawn.                       */
/* ------------------------------------------------------------------ */

export const DRAWING_NODE_IDS = [
  'edge-gateway',
  'decision-api',
  'stream-ingest',
  'feature-store',
  'model-serving',
  'policy-engine',
  'decision-log',
  'drift-watch',
  'model-registry',
  'case-review',
] as const;

export const DRAWING_EDGE_IDS = [
  'e-edge-api',
  'e-edge-ingest',
  'e-ingest-fs',
  'e-api-serving',
  'e-fs-serving',
  'e-registry-serving',
  'e-serving-policy',
  'e-policy-log',
  'e-log-drift',
  'e-drift-case',
] as const;

export const DRAWING_ZONE_IDS = ['channel-dmz', 'core-zone', 'oversight'] as const;
export const DRAWING_DIMENSION_IDS = ['hot-path', 'durable-record'] as const;

/** Refine: the array's `id`s are exactly `ids` (order-independent, no dupes). */
function exactIdSet<T extends readonly string[]>(ids: T) {
  const want = [...ids].sort();
  return (rows: readonly { id: string }[]): boolean => {
    const got = rows.map((r) => r.id).sort();
    return got.length === want.length && got.every((id, i) => id === want[i]);
  };
}

/* ------------------------------------------------------------------ */
/* Shared vocabularies                                                 */
/* ------------------------------------------------------------------ */

/** The flow-node kinds the drawing draws (mirrors diagrams' FlowNodeKind). */
const NodeKind = z.enum(['start', 'process', 'decision', 'data', 'end']);
/** A part's emphasis — exactly one part is the hatched capacity `constrained`. */
const NodeEmphasis = z.enum(['standard', 'constrained']);

/* ------------------------------------------------------------------ */
/* Fill schema — content slots only                                    */
/* ------------------------------------------------------------------ */

/** A revision-table row in the title block. */
const Revision = z.object({
  rev: z.string().min(1).max(6),
  date: z.string().min(1).max(14),
  description: z.string().min(1).max(40),
  by: z.string().min(1).max(6),
});

/** The sheet identity — chrome, title block, and the REQUIRED provenance notice. */
const Sheet = z.object({
  /** The document.title (assigned in JS); derived byte-identically from the fill. */
  pageTitle: z.string().min(1).max(70),
  office: z.string().min(1).max(24),
  project: z.string().min(1).max(42),
  title: z.string().min(1).max(60),
  drawingNo: z.string().min(1).max(18),
  sheet: z.string().min(1).max(18),
  scale: z.string().min(1).max(18),
  revision: z.string().min(1).max(10),
  classification: z.string().min(1).max(48),
  drawn: z.string().min(1).max(28),
  checked: z.string().min(1).max(28),
  approved: z.string().min(1).max(28),
  /** REQUIRED provenance notice: printed in the footer. */
  dataNotice: z.string().min(1).max(68),
  revisions: z.array(Revision).min(1).max(6),
});

const Masthead = z.object({
  kicker: z.string().min(1).max(48),
  /** The display statement — one line per array entry (rendered with line breaks). */
  displayLines: z.array(z.string().min(1).max(56)).min(1).max(3),
  /** The lede tail; the template prefixes the sheet title ("{title} — {lede}"). */
  lede: z.string().min(1).max(120),
});

/** A drawn part — a box on the plan and a row in the schedule of parts. */
const DrawingNode = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(28),
  kind: NodeKind,
  /** Exactly one part is `constrained` — the hatched, NOTE-flagged constraint. */
  emphasis: NodeEmphasis,
});

/** A drawn connection — a routed polyline between two parts. */
const DrawingEdge = z.object({
  id: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  label: z.string().min(1).max(28),
});

/** A zone box on the plan — its caption is content; its geometry is template-fixed. */
const DrawingZone = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(40),
});

/** A dimension line on the plan — its caption is content; its geometry is fixed. */
const DrawingDimension = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(60),
});

const Drawing = z.object({
  /** The a11y heading of the sheet region (visually hidden). */
  figureHeading: z.string().min(1).max(40),
  /** The full accessible caption of the aria-hidden drawing figure. */
  caption: z.string().min(1).max(270),
  /** The short flag label drawn beside the constrained part, e.g. "NOTE 3". */
  constraintFlag: z.string().min(1).max(12),
  /**
   * The ten drawn parts. FIXED-SLOT: ids must be exactly the shipped set (the
   * template's hand-drafted plan placement is keyed by id). Exactly ONE part
   * carries emphasis "constrained".
   */
  nodes: z
    .array(DrawingNode)
    .refine(exactIdSet(DRAWING_NODE_IDS), {
      message: `drawing.nodes ids must be exactly the fixed plan set: ${DRAWING_NODE_IDS.join(', ')}.`,
    })
    .refine((rows) => rows.filter((n) => n.emphasis === 'constrained').length === 1, {
      message: 'Exactly one part must carry emphasis "constrained" (the single hatched capacity constraint).',
    }),
  /** The ten drawn connections. FIXED-SLOT: ids must be exactly the shipped set. */
  edges: z.array(DrawingEdge).refine(exactIdSet(DRAWING_EDGE_IDS), {
    message: `drawing.edges ids must be exactly the fixed routing set: ${DRAWING_EDGE_IDS.join(', ')}.`,
  }),
  /** The three zone boxes. FIXED-SLOT: ids must be exactly the shipped set. */
  zones: z.array(DrawingZone).refine(exactIdSet(DRAWING_ZONE_IDS), {
    message: `drawing.zones ids must be exactly the fixed set: ${DRAWING_ZONE_IDS.join(', ')}.`,
  }),
  /** The two dimension lines. FIXED-SLOT: ids must be exactly the shipped set. */
  dimensions: z.array(DrawingDimension).refine(exactIdSet(DRAWING_DIMENSION_IDS), {
    message: `drawing.dimensions ids must be exactly the fixed set: ${DRAWING_DIMENSION_IDS.join(', ')}.`,
  }),
});

/** A general note; exactly one shipped note is `critical` (the constraint note). */
const DrawingNoteItem = z.object({
  no: z.number().int().positive(),
  text: z.string().min(1).max(150),
  critical: z.boolean().optional(),
});

const Notes = z.object({
  items: z.array(DrawingNoteItem).min(2).max(8),
  legend: z.string().min(1).max(170),
});

/** A narrative section — a numbered chapter with a mono margin annotation. */
const NarrativeSection = z.object({
  no: z.string().min(1).max(6),
  title: z.string().min(1).max(28),
  annotation: z.string().min(1).max(52),
  paragraphs: z.array(z.string().min(1).max(400)).min(1).max(3),
});

const Narrative = z.object({
  sections: z.array(NarrativeSection).min(3).max(7),
});

/** A capacity-headroom datum — remaining throughput headroom, percent of rated. */
const HeadroomDatum = z.object({
  id: z.string().min(1),
  category: z.string().min(1).max(28),
  /** Percent of rated capacity (0–100); tiers below `floorPct` draw in the red ink. */
  value: z.number().min(0).max(100),
  /** The review-board floor, echoed per-bar as the diamond target marker. */
  target: z.number().min(0).max(100),
});

const Figure = z.object({
  number: z.string().min(1).max(12),
  title: z.string().min(1).max(40),
  /** The chart's accessible title (assigned via prop), derived from the fill. */
  chartTitle: z.string().min(1).max(54),
  caption: z.string().min(1).max(300),
  source: z.string().min(1).max(80),
  /** The headroom floor the review board requires, percent (0–100). */
  floorPct: z.number().min(0).max(100),
  headroom: z.array(HeadroomDatum).min(4).max(8),
});

export const DrawingOfficeFill = z.object({
  sheet: Sheet,
  masthead: Masthead,
  drawing: Drawing,
  notes: Notes,
  narrative: Narrative,
  figure: Figure,
});

export type DrawingOfficeFill = z.infer<typeof DrawingOfficeFill>;
export type DrawingOfficeNode = z.infer<typeof DrawingNode>;
export type DrawingOfficeEdge = z.infer<typeof DrawingEdge>;
export type DrawingOfficeZone = z.infer<typeof DrawingZone>;
export type DrawingOfficeDimension = z.infer<typeof DrawingDimension>;
export type DrawingOfficeNodeKind = z.infer<typeof NodeKind>;

/* ------------------------------------------------------------------ */
/* Slot specs — the registry-serializable descriptor view             */
/* ------------------------------------------------------------------ */

export const DRAWING_OFFICE_SECTIONS: SectionSpec[] = [
  {
    kind: 'sheet',
    purpose:
      'The sheet identity — the drafting chrome, the title block, its revision table, and the required provenance notice.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'sheet.pageTitle', type: 'text', required: true, limits: { maxChars: 70 }, guidance: 'The browser-tab title (assigned in JS, derived byte-identically from the fill), e.g. "The Drawing Office — Model Decision Platform, As Built".' },
      { name: 'sheet.office', type: 'text', required: true, limits: { maxChars: 24 }, guidance: 'The drawing-office name on the top chrome, e.g. "THE DRAWING OFFICE".' },
      { name: 'sheet.project', type: 'text', required: true, limits: { maxChars: 42 }, guidance: 'The programme/project name on the chrome and title block, e.g. "ENTERPRISE DECISION INTELLIGENCE".' },
      { name: 'sheet.title', type: 'text', required: true, limits: { maxChars: 60 }, guidance: 'The sheet title on the title block (and the lede prefix), e.g. "MODEL DECISION PLATFORM — GENERAL ARRANGEMENT".' },
      { name: 'sheet.drawingNo', type: 'text', required: true, limits: { maxChars: 18 }, guidance: 'The drawing number, e.g. "EDI-ARCH-004".' },
      { name: 'sheet.sheet', type: 'text', required: true, limits: { maxChars: 18 }, guidance: 'The sheet-of count, e.g. "SHEET 1 OF 1".' },
      { name: 'sheet.scale', type: 'text', required: true, limits: { maxChars: 18 }, guidance: 'The scale note, e.g. "SCALE N.T.S.".' },
      { name: 'sheet.revision', type: 'text', required: true, limits: { maxChars: 10 }, guidance: 'The current revision tag, e.g. "REV A".' },
      { name: 'sheet.classification', type: 'text', required: true, limits: { maxChars: 48 }, guidance: 'The classification stamp in the title block; state the demonstration nature, e.g. "SYNTHETIC DEMO — NOT FOR CONSTRUCTION".' },
      { name: 'sheet.drawn', type: 'text', required: true, limits: { maxChars: 28 }, guidance: 'The DRAWN-BY name, e.g. "S. NARAYANAN".' },
      { name: 'sheet.checked', type: 'text', required: true, limits: { maxChars: 28 }, guidance: 'The CHECKED-BY name, e.g. "M. OKAFOR".' },
      { name: 'sheet.approved', type: 'text', required: true, limits: { maxChars: 28 }, guidance: 'The APPROVED-BY authority, e.g. "PLATFORM REVIEW BOARD".' },
      { name: 'sheet.dataNotice', type: 'text', required: true, limits: { maxChars: 68 }, guidance: 'REQUIRED provenance notice printed in the footer; must state the data is synthetic/sourced, e.g. "SYNTHETIC DEMONSTRATION DATA · NOT A PRODUCTION RECORD".' },
      { name: 'sheet.revisions', type: 'tableRows', required: true, limits: { minItems: 1, maxItems: 6 }, guidance: 'One-to-six revision rows (rev, date, description, by), oldest first, e.g. { rev: "A", date: "2026-07-04", description: "ISSUED AS BUILT", by: "MO" }.' },
    ],
  },
  {
    kind: 'masthead',
    purpose: 'The editorial hero — the kicker, the multi-line display statement, and the one-line lede.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'masthead.kicker', type: 'text', required: true, limits: { maxChars: 48 }, guidance: 'The eyebrow above the display statement, e.g. "AS-BUILT RECORD · CHECKED AND SIGNED".' },
      { name: 'masthead.displayLines', type: 'items', required: true, limits: { minItems: 1, maxItems: 3, maxChars: 56 }, guidance: 'One-to-three display lines (one per array entry, rendered as broken lines), e.g. "An architecture is a promise written down.".' },
      { name: 'masthead.lede', type: 'text', required: true, limits: { maxChars: 120 }, guidance: 'The lede tail; the template prefixes the sheet title ("{title} — {lede}"), e.g. "the decision fabric behind ninety million daily answers, drawn the way it actually runs.".' },
    ],
  },
  {
    kind: 'drawing',
    purpose:
      'The general-arrangement drawing — the drawn parts, their connections, the zone boxes and dimension lines. The plan placement and routing are template-fixed; the fill carries the content and pins the id sets.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'drawing.figureHeading', type: 'text', required: true, limits: { maxChars: 40 }, guidance: 'The visually-hidden heading of the sheet region, e.g. "The general-arrangement drawing".' },
      { name: 'drawing.caption', type: 'longtext', required: true, limits: { maxChars: 270 }, guidance: 'The full accessible caption of the aria-hidden drawing, naming the parts, zones, and pointing to the schedule, e.g. "General-arrangement drawing of the model decision platform: ten parts across a channel DMZ, a restricted core zone, and an overnight oversight band…".' },
      { name: 'drawing.constraintFlag', type: 'text', required: true, limits: { maxChars: 12 }, guidance: 'The short flag label drawn beside the constrained part, e.g. "NOTE 3".' },
      { name: 'drawing.nodes', type: 'nodes', required: true, limits: { minItems: 10, maxItems: 10 }, guidance: `Exactly ten parts. FIXED-SLOT: ids must be exactly the shipped plan set (${DRAWING_NODE_IDS.join(', ')}) — the template's hand-drafted placement is keyed by id. Each: id, label, kind (start|process|data|decision|end), emphasis (standard|constrained). Exactly ONE part is "constrained" — the hatched capacity constraint, e.g. { id: "feature-store", label: "FEATURE STORE", kind: "data", emphasis: "constrained" }.` },
      { name: 'drawing.edges', type: 'edges', required: true, limits: { minItems: 10, maxItems: 10 }, guidance: `Exactly ten connections. FIXED-SLOT: ids must be exactly the shipped routing set (${DRAWING_EDGE_IDS.join(', ')}). Each: id, from (node id), to (node id), label, e.g. { id: "e-fs-serving", from: "feature-store", to: "model-serving", label: "≤ 12 ms p50 read" }.` },
      { name: 'drawing.zones', type: 'items', required: true, limits: { minItems: 3, maxItems: 3 }, guidance: `Exactly three zone boxes (id, label). FIXED-SLOT ids (${DRAWING_ZONE_IDS.join(', ')}); geometry is template-fixed, e.g. { id: "core-zone", label: "CORE ZONE — RESTRICTED · NOTE 1" }.` },
      { name: 'drawing.dimensions', type: 'items', required: true, limits: { minItems: 2, maxItems: 2 }, guidance: `Exactly two dimension lines (id, label). FIXED-SLOT ids (${DRAWING_DIMENSION_IDS.join(', ')}); geometry is template-fixed, e.g. { id: "hot-path", label: "HOT PATH TRAVERSE ≤ 180 MS P99 · EDGE TO ANSWER" }.` },
    ],
  },
  {
    kind: 'notes',
    purpose: 'The general notes and the drawing legend — the constraint note is the single critical entry.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'notes.items', type: 'items', required: true, limits: { minItems: 2, maxItems: 8 }, guidance: 'Two-to-eight numbered general notes (no, text, optional critical flag). Mark the capacity-constraint note critical, e.g. { no: 3, text: "FEATURE-STORE READ REPLICAS AT 78% OF RATED THROUGHPUT…", critical: true }.' },
      { name: 'notes.legend', type: 'longtext', required: true, limits: { maxChars: 170 }, guidance: 'The drawing legend line explaining the encoding, e.g. "LEGEND — DOUBLE LINE: PART · DASH: ZONE BOUNDARY · HATCH: CONSTRAINED PART · A–A / B–B: SECTION CUTS · DIM LINES CARRY LATENCY BUDGETS".' },
    ],
  },
  {
    kind: 'narrative',
    purpose: 'The measured editorial narrative — numbered sections with mono margin annotations.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'narrative.sections', type: 'items', required: true, limits: { minItems: 3, maxItems: 7 }, guidance: 'Three-to-seven narrative sections (no, title, annotation, paragraphs 1–3). Section "04" hosts FIG 4.1, e.g. { no: "02", title: "The decision path", annotation: "SECTION A–A · ≤ 180 MS END TO END", paragraphs: ["The hot path reads left to right…"] }.' },
    ],
  },
  {
    kind: 'figure',
    purpose: 'FIG 4.1 — the capacity-headroom bar chart embedded in the capacity section; the constraint tier draws below the floor.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'figure.number', type: 'text', required: true, limits: { maxChars: 12 }, guidance: 'The figure number, e.g. "FIG 4.1".' },
      { name: 'figure.title', type: 'text', required: true, limits: { maxChars: 40 }, guidance: 'The figure title, e.g. "CAPACITY HEADROOM BY COMPONENT".' },
      { name: 'figure.chartTitle', type: 'text', required: true, limits: { maxChars: 54 }, guidance: 'The chart\'s accessible title (assigned via prop), e.g. "FIG 4.1 — Capacity headroom by component".' },
      { name: 'figure.caption', type: 'longtext', required: true, limits: { maxChars: 300 }, guidance: 'The figure caption; state synthetic provenance and the floor, e.g. "Remaining throughput headroom, percent of rated capacity… Diamond marks the 25% floor…".' },
      { name: 'figure.source', type: 'text', required: true, limits: { maxChars: 80 }, guidance: 'The chart source note; state synthetic provenance, e.g. "SOURCE: CAPACITY REVIEW 2026-06 · SYNTHETIC DEMONSTRATION DATA".' },
      { name: 'figure.floorPct', type: 'number', required: true, limits: {}, guidance: 'The headroom floor the review board requires, percent 0–100; tiers below it draw in the red ink, e.g. 25.' },
      { name: 'figure.headroom', type: 'metric', required: true, limits: { minItems: 4, maxItems: 8 }, guidance: 'Four-to-eight capacity tiers (id, category, value percent 0–100, target = floorPct). Tiers whose value is below floorPct are the constraint, e.g. { category: "Feature store (read)", value: 22, target: 25 }.' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Standard certifier aliases (Task 5)                                 */
/* ------------------------------------------------------------------ */

/** The world's fill Zod schema, by the certifier's standard name. */
export const FILL_SCHEMA = DrawingOfficeFill;
/** The registry-serializable section specs, by the certifier's standard name. */
export const SECTIONS = DRAWING_OFFICE_SECTIONS;

/** The craft guarantees the template makes and the descriptor advertises. */
export const DRAWING_OFFICE_GUIDANCE: string[] = [
  'A platform architecture staged as a SIGNED ENGINEERING DRAWING: the commanding visual is a hand-drafted general-arrangement plan — parts as double-lined boxes on a drafting-grid field, orthogonally routed connections, dimension lines carrying latency budgets, section cuts, zone boundaries, and a proper title block with a revision table.',
  'THE LAYOUT IS FIXED-SLOT. The plan placement of every part, the routing of every connection, and the position of every zone box and dimension line are hand-drafted per shipped id and owned by the template. The fill re-labels the drawing (part labels/classes, connection endpoints/labels, zone and dimension captions); the schema pins the node, edge, zone, and dimension ID SETS to exactly the shipped ids, so a fill can never add a part the drawing has nowhere to place. Any schema-valid fill renders composed.',
  'Exactly one part carries emphasis "constrained": the single hatched, flag-marked capacity constraint — echoed as the highlighted row of the schedule of parts, the critical general note, and the sub-floor tier of FIG 4.1.',
  'The drawing SVG is decorative (aria-hidden); the REAL content is the visible SCHEDULE OF PARTS table and CONNECTIONS list (derived from the same nodes/edges) plus the title block — so the world is fully legible without the drawing.',
  'The synthetic-data provenance notice (sheet.dataNotice) is required and prints in the footer; the title-block classification reinforces it.',
  'FIG 4.1 colours any tier whose headroom is below the review-board floor (figure.floorPct) in the drawing\'s red ink — the encoding is derived from the data, never hardcoded to a tier id.',
  'Slot char caps and item counts are sized so any schema-valid fill stays composed — the display statement never overflows, the schedule and notes stay balanced, and the narrative paragraphs stay legible. Motion level 2 (data-ink-draw); the mood is locked light.',
];
