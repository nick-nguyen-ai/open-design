/**
 * Content pack for "The Planning Wall" — the live rendering of
 * `deck-project-kickoff`.
 *
 * THE WORLD: a project kickoff staged as a physical planning wall. Warm
 * butcher paper, taped index-card slides, and — pinned across every slide as a
 * persistent band — a hand-sketched milestone route drawn as ONE continuous
 * pencil line from M0 to M5. The route blows up to fill the wall on its own
 * slide (the commanding visual); everywhere else it runs as a quiet strip so
 * the plan is always something you can point at.
 *
 * The excalidraw idiom (imperfect strokes, uneven rounded rectangles,
 * hand-drawn arrowheads) is BAKED here as deterministic path data — a seeded
 * generator runs once at module load, never at render, so the wobble is
 * identical on every paint and stable for visual-regression tests.
 *
 * Anomaly: milestone M3 is circled in red pencil and annotated
 * `DEPENDENCY UNCONFIRMED — DATA PLATFORM SIGN-OFF` — the one place the plan
 * admits it is not yet load-bearing.
 *
 * All figures are a synthetic programme (declared in DECK.dataNotice).
 */
import type { StatusListItemDatum } from '@enterprise-design/content-components';

export const DECK = {
  code: 'KICKOFF-01',
  world: 'THE PLANNING WALL',
  programme: 'ATLAS · UNDERWRITING DECISION PLATFORM',
  cadre: 'PMO · WORKING SESSION 01',
  dataNotice: 'SYNTHETIC PROGRAMME — DEMONSTRATION ONLY',
  keyboardHint: '← → NAVIGATE · HOME/END',
} as const;

/* ------------------------------------------------------------------ */
/* Deterministic hand-drawn stroke generator (runs once, at load)      */
/* ------------------------------------------------------------------ */

/** Small seeded LCG — deterministic, so the wobble never changes per paint. */
function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type Pt = readonly [number, number];

/** A hand-drawn polyline: quadratic hops with perpendicular jitter baked in. */
function roughLine(points: readonly Pt[], seed: number, jitter = 4): string {
  const rnd = seeded(seed);
  const j = () => (rnd() - 0.5) * 2 * jitter;
  let d = '';
  points.forEach(([x, y], i) => {
    const px = (x + j()).toFixed(1);
    const py = (y + j()).toFixed(1);
    if (i === 0) {
      d += `M ${px} ${py}`;
    } else {
      const [prevX, prevY] = points[i - 1] as Pt;
      const cx = ((prevX + x) / 2 + j() * 2).toFixed(1);
      const cy = ((prevY + y) / 2 + j() * 2).toFixed(1);
      d += ` Q ${cx} ${cy} ${px} ${py}`;
    }
  });
  return d;
}

/** A hand-drawn closed circle (two overlapping loops read as pencil). */
function roughCircle(
  cx: number,
  cy: number,
  r: number,
  seed: number,
  jitter = 3,
  squash = 0.82,
): string {
  const rnd = seeded(seed);
  const steps = 14;
  const pts: Pt[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const a = (i / steps) * Math.PI * 2 - 0.4;
    const rr = r + (rnd() - 0.5) * 2 * jitter;
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * squash]);
  }
  return roughLine(pts, seed + 7, jitter * 0.5);
}

/**
 * Sample a jittered polyline THROUGH a set of anchor points: each straight
 * segment is broken into sub-points nudged along its perpendicular, with the
 * wobble tapering to almost nothing at the anchors so the stroke still meets
 * each milestone cleanly. Deterministic (seeded) — runs once at module load.
 */
function jitteredThrough(points: readonly Pt[], seed: number, jitter = 4.5): Pt[] {
  const rnd = seeded(seed);
  const out: Pt[] = [];
  for (let s = 0; s < points.length - 1; s += 1) {
    const [ax, ay] = points[s] as Pt;
    const [bx, by] = points[s + 1] as Pt;
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len; // unit perpendicular
    const ny = dx / len;
    const sub = 5;
    const start = s === 0 ? 0 : 1; // avoid duplicating the shared anchor
    for (let k = start; k <= sub; k += 1) {
      const t = k / sub;
      // taper the perpendicular offset to ~0 at the anchors (t=0, t=1)
      const ease = 0.32 + 0.68 * Math.sin(t * Math.PI);
      const off = (rnd() - 0.5) * 2 * jitter * ease;
      out.push([ax + dx * t + nx * off, ay + dy * t + ny * off]);
    }
  }
  return out;
}

/** Smooth a point list into one continuous cubic path (Catmull-Rom → Bézier). */
function smoothPath(pts: readonly Pt[]): string {
  if (pts.length === 0) return '';
  const f = (n: number) => n.toFixed(1);
  const [x0, y0] = pts[0] as Pt;
  let d = `M ${f(x0)} ${f(y0)}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const [p0x, p0y] = (pts[i - 1] ?? pts[i]) as Pt;
    const [p1x, p1y] = pts[i] as Pt;
    const [p2x, p2y] = pts[i + 1] as Pt;
    const [p3x, p3y] = (pts[i + 2] ?? pts[i + 1]) as Pt;
    const c1x = p1x + (p2x - p0x) / 6;
    const c1y = p1y + (p2y - p0y) / 6;
    const c2x = p2x - (p3x - p1x) / 6;
    const c2y = p2y - (p3y - p1y) / 6;
    d += ` C ${f(c1x)} ${f(c1y)}, ${f(c2x)} ${f(c2y)}, ${f(p2x)} ${f(p2y)}`;
  }
  return d;
}

/** A hand-drawn rectangle outline (uneven, slightly open corners). */
export function roughRect(w: number, h: number, seed: number, jitter = 2.5): string {
  const pts: Pt[] = [
    [2, 2],
    [w - 2, 3],
    [w - 3, h - 2],
    [3, h - 3],
    [2, 4],
  ];
  return roughLine(pts, seed, jitter);
}

/* ------------------------------------------------------------------ */
/* The milestone route — THE commanding visual, persistent band        */
/* ------------------------------------------------------------------ */

export interface Milestone {
  id: string;
  index: number;
  /** Point on the route in the 1200×420 drawing space. */
  x: number;
  y: number;
  label: string;
  date: string;
  detail: string;
  /** The one red-circled dependency risk. */
  flagged?: boolean;
}

export const MILESTONES: readonly Milestone[] = [
  { id: 'm0', index: 0, x: 96, y: 300, label: 'Mobilise', date: 'WK 0', detail: 'Team stood up, environments requested.' },
  { id: 'm1', index: 1, x: 320, y: 168, label: 'Discovery signed', date: 'WK 6', detail: 'Underwriting rules mapped with the business.' },
  { id: 'm2', index: 2, x: 540, y: 250, label: 'Thin slice live', date: 'WK 12', detail: 'One product line scored end to end in staging.' },
  {
    id: 'm3',
    index: 3,
    x: 760,
    y: 132,
    label: 'Platform cutover',
    date: 'WK 20',
    detail: 'Decision service moves onto the shared data platform.',
    flagged: true,
  },
  { id: 'm4', index: 4, x: 968, y: 236, label: 'Pilot underwriting', date: 'WK 28', detail: 'Two branches decision live with a human in the loop.' },
  { id: 'm5', index: 5, x: 1136, y: 150, label: 'Scaled rollout', date: 'WK 36', detail: 'All lines, all regions, monitored in production.' },
];

/**
 * The one continuous pencil line through every milestone — precomputed as a
 * hand-sketched stroke (wobbly cubic segments) plus a second, slightly offset
 * pencil pass so the route reads as a real graphite line, not a chart series.
 */
const ROUTE_ANCHORS: readonly Pt[] = MILESTONES.map((m) => [m.x, m.y] as Pt);
export const ROUTE_PATH = smoothPath(jitteredThrough(ROUTE_ANCHORS, 91, 4.6));
/** The doubled offset pass — a lighter second graphite stroke over the first. */
export const ROUTE_PATH_2 = smoothPath(jitteredThrough(ROUTE_ANCHORS, 138, 5.4));

/**
 * Hand-drawn milestone rings — imperfect pencil circles (like the red anomaly
 * loop), one per milestone, replacing the geometric dots. Precomputed.
 */
export const NODE_CIRCLES: readonly string[] = MILESTONES.map((m, i) =>
  roughCircle(m.x, m.y, 13, 460 + i * 29, 2, 0.96),
);

/**
 * A quiet hand-annotated week scale, tucked into the empty top-right of the
 * route slide (WK 0 → WK 36 ≈ nine months). Pencil voice, not decoration.
 */
export const SCALE = {
  x1: 1052,
  x2: 1216,
  y: 84,
  ticks: [1052, 1134, 1216] as const,
  line: roughLine(
    [
      [1052, 85],
      [1134, 82],
      [1216, 84],
    ],
    617,
    1.6,
  ),
  startLabel: 'WK 0',
  endLabel: 'WK 36',
  caption: 'nine months, end to end',
} as const;

/** The red-pencil circle around the flagged milestone — precomputed. */
const FLAGGED = MILESTONES.find((m) => m.flagged) as Milestone;
export const FLAG_CIRCLE = roughCircle(FLAGGED.x, FLAGGED.y, 62, 204, 4);
export const FLAG_CIRCLE_2 = roughCircle(FLAGGED.x, FLAGGED.y, 66, 331, 5);
export const ANOMALY_TEXT = 'DEPENDENCY UNCONFIRMED — DATA PLATFORM SIGN-OFF';

/* ------------------------------------------------------------------ */
/* Scope — two taped lists                                             */
/* ------------------------------------------------------------------ */

export const SCOPE_IN: readonly string[] = [
  'Automated decisioning for new-business underwriting',
  'Rules engine + model score, one governed pipeline',
  'Human-in-the-loop review queue for edge cases',
  'Full decision audit trail for model risk',
];

export const SCOPE_OUT: readonly string[] = [
  'Renewals and mid-term adjustments (Phase 2)',
  'Claims triage — a separate programme owns this',
  'Replacing the policy admin system of record',
  'Customer-facing quote UX changes',
];

/* ------------------------------------------------------------------ */
/* RACI grid                                                          */
/* ------------------------------------------------------------------ */

export type RaciMark = 'R' | 'A' | 'C' | 'I' | '';
export interface RaciRow {
  activity: string;
  marks: readonly RaciMark[];
}
export const RACI_ROLES = ['Product', 'Eng lead', 'Model risk', 'Data platform', 'Sponsor'] as const;
export const RACI_ROWS: readonly RaciRow[] = [
  { activity: 'Underwriting rule sign-off', marks: ['A', 'C', 'C', 'I', 'R'] },
  { activity: 'Model build & validation', marks: ['C', 'R', 'A', 'C', 'I'] },
  { activity: 'Platform cutover', marks: ['I', 'C', 'C', 'R', 'A'] },
  { activity: 'Go / no-go for pilot', marks: ['C', 'C', 'A', 'I', 'R'] },
];

/* ------------------------------------------------------------------ */
/* Workstreams — comp.status-list on a taped panel                    */
/* ------------------------------------------------------------------ */

export const WORKSTREAMS: readonly StatusListItemDatum[] = [
  {
    id: 'ws1',
    label: 'Decision service',
    status: 'success',
    description: 'Owns the scoring pipeline. Thin slice already runs in staging.',
  },
  {
    id: 'ws2',
    label: 'Data platform migration',
    status: 'warning',
    description: 'Cutover date depends on a sign-off outside this programme — see M3.',
  },
  {
    id: 'ws3',
    label: 'Model risk & validation',
    status: 'info',
    description: 'Validator engaged; independent review booked for week 16.',
  },
  {
    id: 'ws4',
    label: 'Change & operating model',
    status: 'success',
    description: 'Branch pilot playbook drafted with the two pilot sites.',
  },
];

/* ------------------------------------------------------------------ */
/* Risk wall — red-circled index cards                                */
/* ------------------------------------------------------------------ */

export interface Risk {
  id: string;
  title: string;
  note: string;
  severity: 'high' | 'medium';
  /** slight tape rotation, precomputed for a pinned-card feel */
  rot: number;
}
export const RISKS: readonly Risk[] = [
  { id: 'r1', title: 'Platform sign-off', note: 'M3 cutover blocked until data platform confirms capacity.', severity: 'high', rot: -1.6 },
  { id: 'r2', title: 'Validator lead time', note: 'Independent validation is 4 weeks; book before build finishes.', severity: 'medium', rot: 1.2 },
  { id: 'r3', title: 'Rule ambiguity', note: 'Three underwriting rules still read two ways with the business.', severity: 'medium', rot: -0.8 },
  { id: 'r4', title: 'Branch capacity', note: 'Pilot sites lose two reviewers to renewals in week 30.', severity: 'medium', rot: 2.0 },
];

/* ------------------------------------------------------------------ */
/* Resourcing                                                         */
/* ------------------------------------------------------------------ */

export interface ResourceLine {
  team: string;
  fte: number;
  note: string;
}
export const RESOURCING: readonly ResourceLine[] = [
  { team: 'Engineering', fte: 6, note: '2 backend · 2 platform · 1 ML eng · 1 lead' },
  { team: 'Data science', fte: 2, note: 'Model build + monitoring design' },
  { team: 'Product & design', fte: 2, note: 'PO + service designer for the review queue' },
  { team: 'Model risk (shared)', fte: 1, note: 'Independent validator, part-time' },
];
export const RESOURCING_TOTAL = RESOURCING.reduce((sum, r) => sum + r.fte, 0);

/* ------------------------------------------------------------------ */
/* First 90 days — calendar strip                                     */
/* ------------------------------------------------------------------ */

export interface CalendarWeek {
  week: string;
  focus: string;
  milestone?: string;
}
export const FIRST_90: readonly CalendarWeek[] = [
  { week: 'WK 1–2', focus: 'Mobilise · environments · rule workshops', milestone: 'M0' },
  { week: 'WK 3–5', focus: 'Discovery: map underwriting decisions with the business' },
  { week: 'WK 6', focus: 'Discovery sign-off', milestone: 'M1' },
  { week: 'WK 7–10', focus: 'Build thin slice · validator engaged' },
  { week: 'WK 11–12', focus: 'Thin slice live in staging', milestone: 'M2' },
];

/* ------------------------------------------------------------------ */
/* Closing ask                                                        */
/* ------------------------------------------------------------------ */

export const ASK = {
  statement: 'A plan you can point at.',
  detail:
    'We are asking for three decisions today: confirm the week-20 platform cutover date, release the two pilot branches, and stand the independent validator up now — not after the build.',
  decisions: [
    'Confirm the data-platform cutover for week 20 (unblocks M3).',
    'Release the two pilot branches for the week-28 underwriting pilot.',
    'Start independent model validation in week 16, in parallel with build.',
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Slide model                                                        */
/* ------------------------------------------------------------------ */

export type SlideKind =
  | 'title'
  | 'why-now'
  | 'scope'
  | 'route'
  | 'raci'
  | 'workstreams'
  | 'risks'
  | 'resourcing'
  | 'calendar'
  | 'closing';

export interface Slide {
  id: string;
  kind: SlideKind;
  section: string;
  kicker: string;
  /** Which milestone the persistent band highlights on this slide (-1 = whole route). */
  focus: number;
}

export const SLIDES: readonly Slide[] = [
  { id: 'title', kind: 'title', section: 'Kickoff', kicker: 'PROJECT KICKOFF', focus: 0 },
  { id: 'why-now', kind: 'why-now', section: 'Why now', kicker: '01 · WHY NOW', focus: 0 },
  { id: 'scope', kind: 'scope', section: 'Scope', kicker: '02 · IN & OUT', focus: 1 },
  { id: 'route', kind: 'route', section: 'The route', kicker: '03 · THE ROUTE', focus: -1 },
  { id: 'raci', kind: 'raci', section: 'Who owns what', kicker: '04 · RACI', focus: 2 },
  { id: 'workstreams', kind: 'workstreams', section: 'Workstreams', kicker: '05 · WORKSTREAMS', focus: 2 },
  { id: 'risks', kind: 'risks', section: 'Risk wall', kicker: '06 · RISK WALL', focus: 3 },
  { id: 'resourcing', kind: 'resourcing', section: 'Resourcing', kicker: '07 · RESOURCING', focus: 4 },
  { id: 'calendar', kind: 'calendar', section: 'First 90 days', kicker: '08 · FIRST 90 DAYS', focus: 1 },
  { id: 'closing', kind: 'closing', section: 'The ask', kicker: '09 · THE ASK', focus: 5 },
];

export const SLIDE_COUNT = SLIDES.length;
export const ROUTE_SLIDE_NUMBER = SLIDES.findIndex((s) => s.kind === 'route') + 1;
