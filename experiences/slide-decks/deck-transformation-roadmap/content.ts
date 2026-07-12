/**
 * Content pack for "The River" — the live rendering of
 * `deck-transformation-roadmap`.
 *
 * A multi-year transformation told as one continuous waterway. A single
 * luminous ROUTE SPINE — one bespoke SVG river — persists across every slide
 * and PANS as the deck advances, so the audience always knows where on the
 * journey they stand. Three reaches (H1/H2/H3) are stretches of the river;
 * initiatives are stations on the spine; two confluences mark where
 * workstreams merge; and ONE narrows — flagged CAPACITY CONSTRAINT — is where
 * the feature-store build and the validation-automation build compete for the
 * same platform-engineering pool. The spine visibly thins there.
 *
 * Cross-references the platform universe by the programme code MVP-2026 (the
 * Validation Ledger / Lab Report worlds) — the river's estuary is where those
 * validated models reach production.
 *
 * Everything here is TYPED and DETERMINISTIC. No Math.random at render. All
 * magnitudes are synthetic demonstration data at realistic institutional
 * scale; the programme, stations and workstream names are credible inventions.
 */
import type { TrendChartSeriesInput } from '@enterprise-design/data-viz';

/* ------------------------------------------------------------------ */
/* Programme chrome                                                    */
/* ------------------------------------------------------------------ */

export const PROGRAMME = {
  name: 'THE CONFLUENCE PROGRAMME',
  ref: 'XP-2026-ROADMAP',
  horizon: 'FY26 — FY29',
  sponsor: 'GROUP DATA & AI TRANSFORMATION',
  dataNotice: 'SYNTHETIC DEMONSTRATION DATA · ROADMAP IS ILLUSTRATIVE',
  keyboardHint: '← → REACH · HOME/END SOURCE/SEA · N — THE NARROWS',
} as const;

/* ------------------------------------------------------------------ */
/* The river geometry — the commanding bespoke visual                  */
/* ------------------------------------------------------------------ */

export interface RiverNode {
  x: number;
  y: number;
  /** Half-width of the water body at this knot (SVG user units). */
  w: number;
}

export type StationStatus = 'complete' | 'in-progress' | 'at-risk' | 'planned';

export interface Station {
  ref: string;
  /** Index into the centreline knot array — the station sits ON the spine. */
  node: number;
  name: string;
  date: string;
  status: StationStatus;
  reach: 1 | 2 | 3;
  /** Where a workstream joins the main channel. */
  confluence?: string;
  /** The single flagged narrows — the capacity constraint. */
  narrows?: boolean;
  /** One-line detail shown when its reach is in focus. */
  note: string;
}

/**
 * The centreline knots, source (left) to sea (right). Widths taper to the
 * narrows at the capacity constraint (node 6) and open again downstream.
 * Stations reference these knots by index so markers always sit on the spine.
 */
export const RIVER_NODES: readonly RiverNode[] = [
  { x: 150, y: 300, w: 26 }, // 0 source
  { x: 330, y: 246, w: 32 }, // 1 S1
  { x: 520, y: 300, w: 33 }, // 2 S2
  { x: 700, y: 244, w: 33 }, // 3 S3 (confluence: risk)
  { x: 900, y: 292, w: 31 }, // 4 S4 (confluence: data+platform)
  { x: 1070, y: 250, w: 22 }, // 5 approach
  { x: 1210, y: 272, w: 10 }, // 6 S5 THE NARROWS
  { x: 1370, y: 300, w: 23 }, // 7 S6
  { x: 1560, y: 248, w: 31 }, // 8 S7
  { x: 1760, y: 300, w: 32 }, // 9 S8 (confluence: decisioning)
  { x: 1975, y: 258, w: 32 }, // 10 S9
  { x: 2200, y: 292, w: 30 }, // 11 sea / estuary
];

export const STATIONS: readonly Station[] = [
  {
    ref: 'S1',
    node: 1,
    name: 'Data platform consolidation',
    date: 'FY26 Q1',
    status: 'complete',
    reach: 1,
    note: 'Seventeen source stores collapsed to one governed lake. The headwater everything downstream draws from.',
  },
  {
    ref: 'S2',
    node: 2,
    name: 'Identity & access baseline',
    date: 'FY26 Q3',
    status: 'complete',
    reach: 1,
    note: 'One access model across the estate. Auditable, revocable, and the precondition for self-serve later.',
  },
  {
    ref: 'S3',
    node: 3,
    name: 'Model registry stand-up',
    date: 'FY27 Q1',
    status: 'in-progress',
    reach: 1,
    confluence: 'RISK WORKSTREAM JOINS',
    note: 'Lineage and approval state for every model. Where the Risk workstream first joins the main channel (programme MVP-2026).',
  },
  {
    ref: 'S4',
    node: 4,
    name: 'Unified feature store',
    date: 'FY27 Q2',
    status: 'in-progress',
    reach: 2,
    confluence: 'DATA + PLATFORM MERGE',
    note: 'The confluence: the Data and Platform workstreams become one channel. Everything narrows just after this join.',
  },
  {
    ref: 'S5',
    node: 6,
    name: 'Validation automation',
    date: 'FY27 Q4',
    status: 'at-risk',
    reach: 2,
    narrows: true,
    note: 'THE NARROWS. Validation automation and the feature-store build draw from the same platform-engineering pool. Only one can run at full width in H2.',
  },
  {
    ref: 'S6',
    node: 7,
    name: 'Legacy scoring decommission',
    date: 'FY28 Q2',
    status: 'planned',
    reach: 2,
    note: 'The old scoring service retired once validation automation carries the load. Frees the capacity the narrows costs us.',
  },
  {
    ref: 'S7',
    node: 8,
    name: 'Self-serve ML enablement',
    date: 'FY28 Q3',
    status: 'planned',
    reach: 3,
    note: 'Teams compose and ship models without central hand-holding. Only reachable once the registry and feature store are wide.',
  },
  {
    ref: 'S8',
    node: 9,
    name: 'Real-time decisioning',
    date: 'FY29 Q1',
    status: 'planned',
    reach: 3,
    confluence: 'DECISIONING WORKSTREAM JOINS',
    note: 'Sub-second scoring in the transaction path. The Decisioning workstream joins here, widening the river toward the sea.',
  },
  {
    ref: 'S9',
    node: 10,
    name: 'External model governance',
    date: 'FY29 Q3',
    status: 'planned',
    reach: 3,
    note: 'Third-party and generative models brought under the same lineage and controls as everything built in-house.',
  },
];

export interface Reach {
  id: string;
  label: string;
  horizon: string;
  theme: string;
  /** Slide index (1-based) for the reach detail slide. */
  focusNode: number;
  scale: number;
  standfirst: string;
  stationRefs: readonly string[];
}

export const REACHES: readonly Reach[] = [
  {
    id: 'reach-one',
    label: 'REACH ONE',
    horizon: 'H1 · FY26 – FY27',
    theme: 'Foundations',
    focusNode: 2,
    scale: 1.7,
    standfirst:
      'The headwaters. Consolidate the data estate, set one access model, and stand up the registry every later reach depends on. Slow water, load-bearing work.',
    stationRefs: ['S1', 'S2', 'S3'],
  },
  {
    id: 'reach-two',
    label: 'REACH TWO',
    horizon: 'H2 · FY27 – FY28',
    theme: 'Scale',
    focusNode: 6,
    scale: 1.9,
    standfirst:
      'The working reach, and the honest one. Two builds want the same engineers at the same time. The river narrows here — and we would rather name it than paint over it.',
    stationRefs: ['S4', 'S5', 'S6'],
  },
  {
    id: 'reach-three',
    label: 'REACH THREE',
    horizon: 'H3 · FY28 – FY29',
    theme: 'Compounding',
    focusNode: 9,
    scale: 1.7,
    standfirst:
      'The river widens toward the sea. Self-serve, real-time decisioning and external-model governance — the reach where the earlier work compounds instead of merely adding up.',
    stationRefs: ['S7', 'S8', 'S9'],
  },
];

export const NARROWS_STATION = STATIONS.find((s) => s.narrows) as Station;

export const STATUS_GLYPH: Record<StationStatus, string> = {
  complete: '●',
  'in-progress': '◐',
  'at-risk': '▲',
  planned: '○',
};

export const STATUS_LABEL: Record<StationStatus, string> = {
  complete: 'Complete',
  'in-progress': 'In progress',
  'at-risk': 'At risk — capacity constrained',
  planned: 'Planned',
};

/* ------------------------------------------------------------------ */
/* Geometry: smooth centreline + tapering ribbon banks, computed once  */
/* ------------------------------------------------------------------ */

interface Pt {
  x: number;
  y: number;
}

function catmull(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
  );
}

interface SampledPoint extends Pt {
  w: number;
}

/** Sample the Catmull-Rom spline through the knots, carrying an interpolated width. */
function sampleSpline(nodes: readonly RiverNode[], perSegment = 20): SampledPoint[] {
  const out: SampledPoint[] = [];
  const n = nodes.length;
  for (let i = 0; i < n - 1; i += 1) {
    const p0 = nodes[Math.max(0, i - 1)] as RiverNode;
    const p1 = nodes[i] as RiverNode;
    const p2 = nodes[i + 1] as RiverNode;
    const p3 = nodes[Math.min(n - 1, i + 2)] as RiverNode;
    const steps = i === n - 2 ? perSegment : perSegment;
    for (let s = 0; s < steps; s += 1) {
      const t = s / steps;
      out.push({
        x: catmull(p0.x, p1.x, p2.x, p3.x, t),
        y: catmull(p0.y, p1.y, p2.y, p3.y, t),
        w: p1.w + (p2.w - p1.w) * t,
      });
    }
  }
  const last = nodes[n - 1] as RiverNode;
  out.push({ x: last.x, y: last.y, w: last.w });
  return out;
}

function toPath(points: readonly Pt[]): string {
  return points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');
}

interface RiverGeometry {
  /** The luminous centreline (the thalweg) — drawn in via dashoffset. */
  centrePath: string;
  /** Approximate centreline length for the draw-in dash animation. */
  centreLength: number;
  /** The filled, tapering water body. */
  ribbonPath: string;
  /** Per-station on-spine coordinates. */
  stationPoints: Record<string, Pt>;
  /** Node coordinates (for tributaries / confluences). */
  nodePoints: readonly Pt[];
  viewBox: string;
}

function buildRiverGeometry(): RiverGeometry {
  const samples = sampleSpline(RIVER_NODES);
  const top: Pt[] = [];
  const bottom: Pt[] = [];
  for (let i = 0; i < samples.length; i += 1) {
    const prev = samples[Math.max(0, i - 1)] as SampledPoint;
    const next = samples[Math.min(samples.length - 1, i + 1)] as SampledPoint;
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const cur = samples[i] as SampledPoint;
    top.push({ x: cur.x + nx * cur.w, y: cur.y + ny * cur.w });
    bottom.push({ x: cur.x - nx * cur.w, y: cur.y - ny * cur.w });
  }
  const ribbonPath = `${toPath(top)} ${toPath([...bottom].reverse()).replace(/^M/, 'L')} Z`;

  let centreLength = 0;
  for (let i = 1; i < samples.length; i += 1) {
    const a = samples[i - 1] as SampledPoint;
    const b = samples[i] as SampledPoint;
    centreLength += Math.hypot(b.x - a.x, b.y - a.y);
  }

  const stationPoints: Record<string, Pt> = {};
  for (const st of STATIONS) {
    const node = RIVER_NODES[st.node] as RiverNode;
    stationPoints[st.ref] = { x: node.x, y: node.y };
  }

  return {
    centrePath: toPath(samples),
    centreLength: Math.round(centreLength),
    ribbonPath,
    stationPoints,
    nodePoints: RIVER_NODES.map((n) => ({ x: n.x, y: n.y })),
    viewBox: '0 0 2350 540',
  };
}

export const RIVER = buildRiverGeometry();

/** Tributary channels feeding the confluence nodes (source point → join node). */
export const TRIBUTARIES: readonly { id: string; d: string; joinNode: number }[] = [
  { id: 'trib-risk', joinNode: 3, d: 'M700 244 C 640 150, 560 120, 470 92' },
  { id: 'trib-data', joinNode: 4, d: 'M900 292 C 850 400, 760 452, 660 486' },
  { id: 'trib-decisioning', joinNode: 9, d: 'M1760 300 C 1710 404, 1620 452, 1520 484' },
];

/* ------------------------------------------------------------------ */
/* Benefits evidence — cumulative benefit vs invest (TrendChart)       */
/* ------------------------------------------------------------------ */

// FY quarters across the horizon. ISO-ish ordered category labels.
const FY_QUARTERS = [
  'FY26 Q2',
  'FY26 Q4',
  'FY27 Q2',
  'FY27 Q4',
  'FY28 Q2',
  'FY28 Q4',
  'FY29 Q2',
  'FY29 Q4',
] as const;

// Cumulative invested capital (£m) — front-loaded, flattening as build completes.
const INVEST = [2.4, 6.1, 10.8, 15.9, 20.4, 23.6, 25.8, 27.1] as const;
// Cumulative realised benefit (£m) — slow, then compounding past the crossover.
const BENEFIT = [0.3, 1.6, 4.2, 9.7, 18.3, 29.6, 44.1, 61.8] as const;

/** Index where cumulative benefit first overtakes cumulative invest (crossover). */
export const BENEFIT_CROSSOVER_INDEX = BENEFIT.findIndex((b, i) => b > (INVEST[i] as number));

export const BENEFIT_SERIES: readonly TrendChartSeriesInput[] = [
  {
    id: 'invest',
    label: 'Cumulative invest (£m)',
    points: FY_QUARTERS.map((x, i) => ({ x, y: INVEST[i] as number })),
  },
  {
    id: 'benefit',
    label: 'Cumulative benefit (£m)',
    points: FY_QUARTERS.map((x, i) => ({ x, y: BENEFIT[i] as number })),
  },
];

/* ------------------------------------------------------------------ */
/* Slides                                                              */
/* ------------------------------------------------------------------ */

interface SlideBase {
  id: string;
  /** Short label for the index. */
  indexTitle: string;
  /** Running foot marker. */
  section: string;
  /** Chrome location label, e.g. "REACH TWO · FY27–FY28". */
  place: string;
  /** Focus for the spine pan (SVG user units) + zoom scale. */
  focus: { x: number; y: number; scale: number };
}

export interface ThesisSlide extends SlideBase {
  kind: 'thesis';
  eyebrow: string;
  titleLines: readonly string[];
  thesis: string;
  meta: readonly string[];
}

export interface OverviewSlide extends SlideBase {
  kind: 'overview';
  kicker: string;
  heading: string;
  standfirst: string;
}

export interface ReachSlide extends SlideBase {
  kind: 'reach';
  reachId: string;
}

export interface NarrowsSlide extends SlideBase {
  kind: 'narrows';
  kicker: string;
  heading: string;
  standfirst: string;
  points: readonly { label: string; value: string }[];
  resolution: string;
}

export interface ConfluenceSlide extends SlideBase {
  kind: 'confluence';
  kicker: string;
  heading: string;
  standfirst: string;
  joins: readonly { workstream: string; at: string; brings: string }[];
}

export interface BenefitsSlide extends SlideBase {
  kind: 'benefits';
  kicker: string;
  heading: string;
  reading: string;
  caption: string;
  source: string;
  crossover: string;
}

export interface CommitmentsSlide extends SlideBase {
  kind: 'commitments';
  kicker: string;
  titleLines: readonly string[];
  commitments: readonly { ref: string; text: string }[];
  meta: readonly string[];
}

export type Slide =
  | ThesisSlide
  | OverviewSlide
  | ReachSlide
  | NarrowsSlide
  | ConfluenceSlide
  | BenefitsSlide
  | CommitmentsSlide;

const node = (i: number): Pt => RIVER_NODES[i] as Pt;

const SEC_SET = 'THE SETTING';
const SEC_COURSE = 'THE COURSE';
const SEC_EVIDENCE = 'THE EVIDENCE';
const SEC_CLOSE = 'THE COMMITMENT';

export const SLIDES: readonly Slide[] = [
  {
    kind: 'thesis',
    id: 'thesis',
    indexTitle: 'Opening — one continuous river',
    section: SEC_SET,
    place: 'SOURCE · FY26',
    focus: { x: 1175, y: 270, scale: 1 },
    eyebrow: `${PROGRAMME.name} · ${PROGRAMME.horizon}`,
    titleLines: ['A transformation', 'is not a stack', 'of phases.', 'It is one river.'],
    thesis:
      'Swimlanes let everyone pretend the phases are independent. They are not. Water that leaves the headwaters wrong arrives at the sea wrong. This roadmap is drawn as a single continuous course — one spine, three reaches — so the dependencies are impossible to look away from, including the one place the river runs too thin.',
    meta: [
      `PROGRAMME ${PROGRAMME.ref} · SPONSOR ${PROGRAMME.sponsor}`,
      `HORIZON ${PROGRAMME.horizon} · NINE STATIONS · THREE CONFLUENCES · ONE NARROWS`,
      'READS WITH THE VALIDATION LEDGER (MVP-2026) DOWNSTREAM',
    ],
  },
  {
    kind: 'overview',
    id: 'overview',
    indexTitle: 'The whole river',
    section: SEC_SET,
    place: 'FULL COURSE · FY26–FY29',
    focus: { x: 1175, y: 270, scale: 1 },
    kicker: 'THE WHOLE COURSE',
    heading: 'Source to sea, drawn once',
    standfirst:
      'Nine stations along one spine. Three reaches — Foundations, Scale, Compounding. Where a tributary meets the channel, a workstream has merged. Where the channel pinches, we are short of hands. The route ledger to the right is the same river, read as a list.',
  },
  {
    kind: 'reach',
    id: 'reach-one',
    indexTitle: 'Reach one — Foundations',
    section: SEC_COURSE,
    place: 'REACH ONE · FY26–FY27',
    focus: { x: node(2).x, y: node(2).y, scale: 1.7 },
    reachId: 'reach-one',
  },
  {
    kind: 'reach',
    id: 'reach-two',
    indexTitle: 'Reach two — Scale',
    section: SEC_COURSE,
    place: 'REACH TWO · FY27–FY28',
    focus: { x: node(4).x + 60, y: node(5).y, scale: 1.55 },
    reachId: 'reach-two',
  },
  {
    kind: 'narrows',
    id: 'narrows',
    indexTitle: 'The narrows — capacity constraint',
    section: SEC_COURSE,
    place: 'THE NARROWS · FY27 Q4',
    focus: { x: node(6).x, y: node(6).y, scale: 2.5 },
    kicker: 'THE HONEST CONVERSATION',
    heading: 'Where the river runs thin',
    standfirst:
      'One platform-engineering pool. Two builds that both need it in the same two quarters. We will not pretend both run at full width — the spine is drawn thin here on purpose. This is the decision the roadmap exists to surface.',
    points: [
      { label: 'CONTESTED RESOURCE', value: 'Platform engineering · 6 FTE effective' },
      { label: 'DEMAND, FEATURE STORE', value: '4.5 FTE · FY27 Q2 – FY28 Q1' },
      { label: 'DEMAND, VALIDATION AUTOMATION', value: '4.0 FTE · FY27 Q3 – FY28 Q1' },
      { label: 'PEAK OVERLAP', value: '2.5 FTE short across FY27 Q4' },
    ],
    resolution:
      'Decision on the table: sequence validation automation one quarter behind the feature store and hold real-time decisioning (S8) at FY29 Q1, OR fund a third platform squad from Q3. The river reaches the sea either way — but not at the same width, and not on the same date.',
  },
  {
    kind: 'reach',
    id: 'reach-three',
    indexTitle: 'Reach three — Compounding',
    section: SEC_COURSE,
    place: 'REACH THREE · FY28–FY29',
    focus: { x: node(9).x, y: node(9).y, scale: 1.7 },
    reachId: 'reach-three',
  },
  {
    kind: 'confluence',
    id: 'confluences',
    indexTitle: 'The confluences — where workstreams merge',
    section: SEC_COURSE,
    place: 'CONFLUENCES · FY27–FY29',
    focus: { x: node(4).x, y: node(4).y - 40, scale: 1.6 },
    kicker: 'THE CROSSINGS',
    heading: 'Three workstreams, one channel',
    standfirst:
      'The roadmap is not one team. Three workstreams run their own tributaries and join the main channel at named points. A confluence is a commitment: after it, there is no separate stream to blame.',
    joins: [
      {
        workstream: 'RISK WORKSTREAM',
        at: 'S3 · Model registry · FY27 Q1',
        brings: 'Lineage, approval state and the sign-off discipline of programme MVP-2026.',
      },
      {
        workstream: 'DATA + PLATFORM',
        at: 'S4 · Unified feature store · FY27 Q2',
        brings: 'The two build teams become one channel — and immediately hit the narrows below.',
      },
      {
        workstream: 'DECISIONING WORKSTREAM',
        at: 'S8 · Real-time decisioning · FY29 Q1',
        brings: 'Sub-second scoring in the transaction path; the river at its widest before the sea.',
      },
    ],
  },
  {
    kind: 'benefits',
    id: 'benefits',
    indexTitle: 'The evidence — benefit vs invest',
    section: SEC_EVIDENCE,
    place: 'THE ECONOMICS · FY26–FY29',
    focus: { x: 1760, y: 300, scale: 1.15 },
    kicker: 'THE ECONOMICS',
    heading: 'When the river starts paying back',
    reading:
      'Invest leads; benefit lags, then compounds. Cumulative benefit overtakes cumulative invest in FY28 Q2 — the crossover — and keeps widening. Everything before the crossover is the price of the headwaters; everything after is the reach that compounds. Delay the narrows and this whole curve slides right.',
    caption: 'Cumulative realised benefit against cumulative invest, £m, across the FY26–FY29 horizon',
    source:
      'Cumulative figures, £m. Invest is committed programme spend; benefit is realised run-rate saving and uplift, finance-attested at quarter close. Synthetic demonstration data (XP-2026-ROADMAP).',
    crossover: 'CROSSOVER · FY28 Q2 — benefit overtakes invest',
  },
  {
    kind: 'commitments',
    id: 'commitments',
    indexTitle: 'The commitment — what we sign to',
    section: SEC_CLOSE,
    place: 'THE SEA · FY29',
    focus: { x: 2180, y: 285, scale: 1.7 },
    kicker: 'WHAT WE ARE ASKING FOR',
    titleLines: ['We commit to the', 'course — and to', 'naming the narrows', 'out loud.'],
    commitments: [
      { ref: 'C1', text: 'Fund the six foundations stations (S1–S3) to completion before opening Reach Two.' },
      { ref: 'C2', text: 'Decide the narrows at FY27 Q2 board: sequence-and-hold, or fund a third squad.' },
      { ref: 'C3', text: 'Hold real-time decisioning (S8) at FY29 Q1 unless the narrows is funded away.' },
      { ref: 'C4', text: 'Report benefit against this curve at every quarter close, crossover included.' },
    ],
    meta: [
      `PROGRAMME ${PROGRAMME.ref} · SPONSOR ${PROGRAMME.sponsor}`,
      'BENEFIT CROSSOVER FY28 Q2 · FULL COURSE FY29 Q4',
    ],
  },
];

export const SLIDE_COUNT = SLIDES.length;

/** 1-based slide index for a slug, or null. */
export function slideNumberForId(id: string): number | null {
  const index = SLIDES.findIndex((slide) => slide.id === id);
  return index === -1 ? null : index + 1;
}

export function reachById(id: string): Reach {
  return REACHES.find((r) => r.id === id) as Reach;
}

export function stationsForRefs(refs: readonly string[]): Station[] {
  return refs.map((ref) => STATIONS.find((s) => s.ref === ref) as Station);
}
