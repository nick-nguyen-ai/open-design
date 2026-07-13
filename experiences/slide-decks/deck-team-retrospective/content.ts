/**
 * Content pack for "The Whiteboard" — the live rendering of
 * `deck-team-retrospective`.
 *
 * THE WORLD: a sprint retrospective photographed mid-session as a whiteboard —
 * a marker-stroke frame drawn around each board, sticky notes in muted yellow
 * and pink (slightly rotated, drop-shadowed), hand-drawn arrows and dot-votes,
 * Caveat handwriting for the notes and Inter for structure. Distinct from The
 * Planning Wall (pencil-on-butcher-paper): this is MARKER-on-whiteboard — thick
 * felt strokes, four marker colours, stickies instead of taped cards, and no
 * milestone route.
 *
 * The excalidraw idiom (wobbly marker strokes, uneven sticky edges, dot-votes,
 * hand-drawn arrows) is BAKED here as deterministic path data — a seeded
 * generator runs once at module load, never at render.
 *
 * Anomaly: on the actions board, one action sticky is circled three times in
 * red marker — `CARRIED 3 SPRINTS — FLAKY E2E OWNERSHIP` — the item that keeps
 * coming back because it has never had an owner.
 *
 * All names and figures are a synthetic team (declared in DECK.dataNotice).
 */
import type { StatusListItemDatum } from '@enterprise-design/content-components';

export const DECK = {
  code: 'RETRO-05',
  world: 'THE WHITEBOARD',
  squad: 'PAYMENTS PLATFORM SQUAD',
  sprint: 'SPRINT 41 · RETROSPECTIVE',
  facilitator: 'FACILITATED BY R. OKORO',
  dataNotice: 'SYNTHETIC RETROSPECTIVE — NO REAL TEAM',
  keyboardHint: '← → NAVIGATE · HOME/END',
} as const;

/* ------------------------------------------------------------------ */
/* Deterministic hand-drawn stroke generator (runs once, at load)      */
/* ------------------------------------------------------------------ */

function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type Pt = readonly [number, number];

/** A hand-drawn marker polyline: quadratic hops with perpendicular jitter. */
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

/** A hand-drawn closed marker loop (reads as felt-tip). */
function roughCircle(cx: number, cy: number, rx: number, ry: number, seed: number, jitter = 3): string {
  const rnd = seeded(seed);
  const steps = 16;
  const pts: Pt[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const a = (i / steps) * Math.PI * 2 - 0.5;
    const jr = (rnd() - 0.5) * 2 * jitter;
    pts.push([cx + Math.cos(a) * (rx + jr), cy + Math.sin(a) * (ry + jr)]);
  }
  return roughLine(pts, seed + 5, jitter * 0.4);
}

/** A hand-drawn rectangle outline — the marker board frame / sticky edge. */
export function roughRect(w: number, h: number, seed: number, jitter = 3): string {
  const pts: Pt[] = [
    [3, 3],
    [w - 3, 4],
    [w - 4, h - 3],
    [4, h - 4],
    [3, 5],
  ];
  return roughLine(pts, seed, jitter);
}

/** A hand-drawn arrow from a→b with a two-stroke head. */
export function roughArrow(a: Pt, b: Pt, seed: number): { shaft: string; head: string } {
  const [ax, ay] = a;
  const [bx, by] = b;
  const midx = (ax + bx) / 2;
  const midy = (ay + by) / 2 + 10;
  const shaft = roughLine(
    [
      [ax, ay],
      [midx, midy],
      [bx, by],
    ],
    seed,
    2.4,
  );
  const ang = Math.atan2(by - midy, bx - midx);
  const hlen = 13;
  const spread = 0.5;
  const h1: Pt = [bx - Math.cos(ang - spread) * hlen, by - Math.sin(ang - spread) * hlen];
  const h2: Pt = [bx - Math.cos(ang + spread) * hlen, by - Math.sin(ang + spread) * hlen];
  const head = `${roughLine([h1, [bx, by]], seed + 3, 1.6)} ${roughLine([[bx, by], h2], seed + 4, 1.6)}`;
  return { shaft, head };
}

/** The marker board frame drawn around every slide. */
export const BOARD_FRAME = roughRect(1000, 620, 71, 3.4);
export const BOARD_FRAME_VIEW = '0 0 1000 620';

/* ------------------------------------------------------------------ */
/* How we felt — dot-vote mood scale                                   */
/* ------------------------------------------------------------------ */

export interface MoodLevel {
  id: string;
  label: string;
  votes: number;
  /** precomputed dot offsets so the cluster never re-randomises */
  dots: readonly Pt[];
}

function dotCluster(n: number, seed: number): Pt[] {
  const rnd = seeded(seed);
  const out: Pt[] = [];
  const cols = 4;
  for (let i = 0; i < n; i += 1) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    out.push([col * 22 + (rnd() - 0.5) * 8, row * 22 + (rnd() - 0.5) * 8]);
  }
  return out;
}

export const MOOD: readonly MoodLevel[] = [
  { id: 'm5', label: 'Best sprint in a while', votes: 3, dots: dotCluster(3, 201) },
  { id: 'm4', label: 'Good, we shipped', votes: 5, dots: dotCluster(5, 202) },
  { id: 'm3', label: 'Fine, a bit flat', votes: 2, dots: dotCluster(2, 203) },
  { id: 'm2', label: 'Rough — too much firefighting', votes: 4, dots: dotCluster(4, 204) },
  { id: 'm1', label: 'Burned out', votes: 1, dots: dotCluster(1, 205) },
];
export const MOOD_TOTAL = MOOD.reduce((s, m) => s + m.votes, 0);

/* ------------------------------------------------------------------ */
/* Sticky walls — what went well / what didn't                         */
/* ------------------------------------------------------------------ */

export interface Sticky {
  id: string;
  text: string;
  by: string;
  colour: 'yellow' | 'pink';
  rot: number;
}

export const WENT_WELL: readonly Sticky[] = [
  { id: 'w1', text: 'Instant-payments spike came in a day early', by: 'PJ', colour: 'yellow', rot: -2.4 },
  { id: 'w2', text: 'Pairing on the ledger refactor really worked', by: 'AM', colour: 'yellow', rot: 1.8 },
  { id: 'w3', text: 'On-call was quiet — the new alerts are good', by: 'RO', colour: 'pink', rot: -1.2 },
  { id: 'w4', text: 'Design + eng in the same standup finally', by: 'TS', colour: 'yellow', rot: 2.6 },
  { id: 'w5', text: 'Shipped the reconciliation report to ops', by: 'KD', colour: 'pink', rot: -2.9 },
];

export const WENT_BADLY: readonly Sticky[] = [
  { id: 'b1', text: 'E2E suite flaked all week, nobody owns it', by: 'AM', colour: 'pink', rot: 2.2 },
  { id: 'b2', text: 'Two prod pushes blocked on a slow review', by: 'PJ', colour: 'yellow', rot: -1.7 },
  { id: 'b3', text: 'Scope crept mid-sprint — added the CSV export', by: 'TS', colour: 'pink', rot: 1.4 },
  { id: 'b4', text: 'Staging matched prod for about two hours total', by: 'KD', colour: 'yellow', rot: -2.5 },
];

/* ------------------------------------------------------------------ */
/* The one big thing — monumental marker statement                     */
/* ------------------------------------------------------------------ */

export const BIG_THING = {
  line1: 'We keep shipping',
  line2: 'around the tests.',
  note: 'Every rough sprint this quarter traces back to the same flaky end-to-end suite that nobody owns. We route around it, it rots, and it bites the next release. This retro, we give it a name and an owner.',
} as const;

/* ------------------------------------------------------------------ */
/* Actions board — comp.status-list, the "only typed thing"            */
/* ------------------------------------------------------------------ */

export const ACTIONS: readonly StatusListItemDatum[] = [
  {
    id: 'act-e2e',
    label: 'Give the E2E suite an owner',
    status: 'danger',
    description: 'CARRIED 3 SPRINTS — FLAKY E2E OWNERSHIP. Assign a named owner this sprint; stabilise the top five flaky specs before adding any new ones.',
  },
  {
    id: 'act-review',
    label: 'Two-hour review SLA on prod changes',
    status: 'warning',
    description: 'Reviews stalled two releases. Trial a two-hour first-response target for production PRs.',
  },
  {
    id: 'act-scope',
    label: 'Freeze scope after day two',
    status: 'info',
    description: 'Mid-sprint additions hurt again. Anything new after day two goes to the next sprint by default.',
  },
  {
    id: 'act-staging',
    label: 'Nightly staging parity check',
    status: 'success',
    description: 'Already in progress — a nightly job that diffs staging against prod config and posts to the channel.',
  },
];
export const ANOMALY_TEXT = 'CARRIED 3 SPRINTS — FLAKY E2E OWNERSHIP';
export const ACTIONS_SLIDE_NUMBER = 6;

/** Precomputed red triple-circle around the anomaly action sticky. */
export const ANOMALY_CIRCLES: readonly string[] = [
  roughCircle(150, 60, 138, 52, 311, 4),
  roughCircle(150, 60, 146, 58, 331, 5),
  roughCircle(150, 60, 154, 64, 353, 6),
];
export const ANOMALY_CIRCLE_VIEW = '0 0 320 130';

/* ------------------------------------------------------------------ */
/* Ownership map — hand-drawn arrows stickies → names                  */
/* ------------------------------------------------------------------ */

export interface OwnerLink {
  id: string;
  action: string;
  owner: string;
  /** action node + owner node positions in a 1000×520 space */
  ax: number;
  ay: number;
  ox: number;
  oy: number;
  flagged?: boolean;
}

const OWNER_LINKS_RAW: readonly Omit<OwnerLink, 'id'>[] = [
  { action: 'E2E suite owner', owner: 'Amara M.', ax: 150, ay: 120, ox: 760, oy: 90, flagged: true },
  { action: 'Review SLA', owner: 'Priya J.', ax: 150, ay: 250, ox: 760, oy: 220 },
  { action: 'Scope freeze', owner: 'Tomas S.', ax: 150, ay: 380, ox: 760, oy: 350 },
  { action: 'Staging parity', owner: 'Kofi D.', ax: 150, ay: 470, ox: 760, oy: 440 },
];

export const OWNER_LINKS: readonly OwnerLink[] = OWNER_LINKS_RAW.map((l, i) => ({ id: `own${i}`, ...l }));
export const OWNER_ARROWS = OWNER_LINKS.map((l, i) =>
  roughArrow([l.ax + 130, l.ay] as Pt, [l.ox - 12, l.oy] as Pt, 411 + i * 17),
);
export const OWNER_VIEW = '0 0 1000 520';

/* ------------------------------------------------------------------ */
/* Experiment for next sprint                                          */
/* ------------------------------------------------------------------ */

export const EXPERIMENT = {
  hypothesis: 'If one person owns test health for the sprint, flaky failures stop leaking into everyone else’s day.',
  we: 'Rotate a “test steward” each sprint — one name on the board, protected time, empowered to quarantine flakes.',
  measure: 'Green-build rate on main and the count of reruns-to-pass, reviewed at the next retro.',
  duration: 'One sprint. Keep it, change it, or drop it — decided with data, not vibes.',
} as const;

/* ------------------------------------------------------------------ */
/* Closing                                                             */
/* ------------------------------------------------------------------ */

export const CLOSING = {
  marker: 'Same time in two weeks.',
  note: 'Four actions, four owners, one experiment. The board photo goes in the channel; the red circle stays until the E2E suite has a name against it.',
} as const;

/* ------------------------------------------------------------------ */
/* Slide model                                                         */
/* ------------------------------------------------------------------ */

export type SlideKind =
  | 'title'
  | 'mood'
  | 'well'
  | 'badly'
  | 'big'
  | 'actions'
  | 'ownership'
  | 'experiment'
  | 'closing';

export interface Slide {
  id: string;
  kind: SlideKind;
  section: string;
  kicker: string;
}

export const SLIDES: readonly Slide[] = [
  { id: 'title', kind: 'title', section: 'Retro', kicker: 'SPRINT RETRO' },
  { id: 'mood', kind: 'mood', section: 'How we felt', kicker: '01 · HOW WE FELT' },
  { id: 'well', kind: 'well', section: 'What went well', kicker: '02 · WHAT WENT WELL' },
  { id: 'badly', kind: 'badly', section: "What didn't", kicker: "03 · WHAT DIDN'T" },
  { id: 'big', kind: 'big', section: 'The one big thing', kicker: '04 · THE ONE BIG THING' },
  { id: 'actions', kind: 'actions', section: 'Actions', kicker: '05 · ACTIONS' },
  { id: 'ownership', kind: 'ownership', section: 'Who owns what', kicker: '06 · OWNERSHIP' },
  { id: 'experiment', kind: 'experiment', section: 'Experiment', kicker: '07 · NEXT-SPRINT EXPERIMENT' },
  { id: 'closing', kind: 'closing', section: 'Close', kicker: '08 · CLOSE' },
];

export const SLIDE_COUNT = SLIDES.length;
