/**
 * Content pack for "The Gallery Floor" — the live rendering of
 * `deck-innovation-showcase`.
 *
 * The innovation portfolio as an EXHIBITION. Slides are positions on a gallery
 * FLOOR PLAN: a bespoke top-down SVG of numbered halls and plinths that
 * persists across the deck and pans/zooms across the floor as the audience
 * walks from exhibit to exhibit. Each exhibit is a piece — a real chart, a
 * monumental claim, or a row of measures — with a museum PLACARD (title, team,
 * year, materials, status) and a status band: IN PRODUCTION, PILOT, or the
 * anomaly, a celebrated RETIRED piece deliberately sunset. Warm charcoal
 * gallery dark, spotlight pools, museum-placard typography.
 *
 * Everything here is TYPED and DETERMINISTIC. No Math.random at render. All
 * figures are synthetic demonstration data at realistic magnitudes; the pieces,
 * teams and years are credible inventions — no real product or result implied.
 */
import type { TrendChartSeriesInput } from '@enterprise-design/data-viz';

/* ------------------------------------------------------------------ */
/* Exhibition chrome                                                   */
/* ------------------------------------------------------------------ */

export const EXHIBITION = {
  title: 'THE STANDING EXHIBITION',
  subtitle: 'A season of applied innovation',
  curator: 'OFFICE OF APPLIED RESEARCH',
  dataNotice: 'INTERNAL SHOWCASE · SYNTHETIC PORTFOLIO',
  keyboardHint: '← → WALK THE FLOOR · HOME/END PLAN/CLOSE · R — THE RETIRED PIECE',
} as const;

export type ExhibitStatus = 'production' | 'pilot' | 'retired';

export const STATUS_LABEL: Record<ExhibitStatus, string> = {
  production: 'IN PRODUCTION',
  pilot: 'PILOT',
  retired: 'RETIRED · DE-ACCESSIONED',
};

export const STATUS_SHORT: Record<ExhibitStatus, string> = {
  production: 'in production',
  pilot: 'pilot',
  retired: 'retired',
};

/* ------------------------------------------------------------------ */
/* The floor plan — the commanding bespoke visual                      */
/* ------------------------------------------------------------------ */

export interface Hall {
  id: string;
  label: string;
  no: string;
  /** Room rectangle in floor-plan user units. */
  rect: { x: number; y: number; w: number; h: number };
}

export const HALLS: readonly Hall[] = [
  { id: 'h1', label: 'FOUNDATIONS', no: 'HALL 1', rect: { x: 90, y: 150, w: 430, h: 700 } },
  { id: 'h2', label: 'DECISIONING', no: 'HALL 2', rect: { x: 560, y: 150, w: 560, h: 700 } },
  { id: 'h3', label: 'FRONTIER', no: 'HALL 3', rect: { x: 1160, y: 150, w: 350, h: 700 } },
];

export const FLOOR = {
  viewBox: '0 0 1600 1000',
  entrance: { x: 840, y: 928 },
} as const;

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

interface ClaimPiece {
  kind: 'claim';
  headline: string;
  unit?: string;
  caption: string;
}

interface MetricsPiece {
  kind: 'metrics';
  tiles: readonly { value: string; label: string }[];
}

interface ChartPiece {
  kind: 'chart';
  series: readonly TrendChartSeriesInput[];
  unit: string;
  caption: string;
  source: string;
}

export type Piece = ClaimPiece | MetricsPiece | ChartPiece;

export interface Placard {
  team: string;
  year: string;
  materials: string;
}

export interface Exhibit {
  id: string;
  /** Catalogue number, e.g. "04". */
  cat: string;
  hallId: string;
  hallNo: string;
  position: string;
  /** Plinth centre on the floor plan (user units). */
  plinth: { x: number; y: number };
  title: string;
  status: ExhibitStatus;
  /** Wall text — one editorial paragraph. */
  wall: string;
  placard: Placard;
  piece: Piece;
  /** The single celebrated retired piece — the deliberate anomaly. */
  anomaly?: boolean;
}

const FRAUD_VALUE = [4.1, 11.8, 21.4, 33.9, 47.2, 61.8] as const;
const FRAUD_QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'] as const;

export const EXHIBITS: readonly Exhibit[] = [
  {
    id: 'feature-cache',
    cat: '01',
    hallId: 'h1',
    hallNo: 'HALL 1',
    position: 'POSITION 01',
    plinth: { x: 300, y: 330 },
    title: 'The Streaming Feature Cache',
    status: 'production',
    wall: 'Fresh features at the moment of decision. What began as a latency fix turned out to move the number everyone actually cared about — it now feeds every scoring surface on the floor.',
    placard: {
      team: '3 engineers · 1 data scientist',
      year: 'Commissioned FY26 · installed FY27',
      materials: 'materials: a streaming join, a cache, and the courage to delete a nightly batch',
    },
    piece: {
      kind: 'metrics',
      tiles: [
        { value: '−48%', label: 'p99 scoring latency' },
        { value: '+2.9%', label: 'checkout conversion' },
        { value: '5', label: 'surfaces served' },
      ],
    },
  },
  {
    id: 'synthetic-foundry',
    cat: '02',
    hallId: 'h1',
    hallNo: 'HALL 1',
    position: 'POSITION 02',
    plinth: { x: 300, y: 670 },
    title: 'The Synthetic Data Foundry',
    status: 'pilot',
    wall: 'Privacy-safe training data cast to order. Still on the plinth as a pilot — the fidelity is there, the governance sign-off is not yet. Shown because a portfolio that hides its pilots is a brochure.',
    placard: {
      team: '2 engineers · 1 privacy counsel',
      year: 'Commissioned FY27',
      materials: 'materials: a generative model, a differential-privacy budget, and one very patient reviewer',
    },
    piece: {
      kind: 'claim',
      headline: '1.4M',
      unit: 'privacy-safe records cast',
      caption: 'Across four regulated domains, none traceable to a real customer. Pilot pending governance sign-off.',
    },
  },
  {
    id: 'fraud-scoring',
    cat: '03',
    hallId: 'h2',
    hallNo: 'HALL 2',
    position: 'POSITION 03',
    plinth: { x: 720, y: 310 },
    title: 'Real-time Fraud Scoring',
    status: 'production',
    wall: 'Sub-second scoring in the transaction path. The quiet workhorse of the floor: it does not surprise anyone any more, which is exactly the compliment an operational model wants.',
    placard: {
      team: '4 engineers · 2 fraud analysts',
      year: 'Commissioned FY25 · in production since FY26',
      materials: 'materials: a gradient-boosted ensemble, a feature store, and six quarters of adversaries',
    },
    piece: {
      kind: 'chart',
      unit: '£m',
      series: [
        {
          id: 'protected',
          label: 'Cumulative value protected (£m)',
          points: FRAUD_QUARTERS.map((x, i) => ({ x, y: FRAUD_VALUE[i] as number })),
        },
      ],
      caption: 'Cumulative fraud value protected since commissioning, £m, by quarter in production',
      source:
        'Cumulative value of blocked fraudulent transactions attributable to the model above the prior rules baseline. Synthetic demonstration data (THE STANDING EXHIBITION).',
    },
  },
  {
    id: 'adaptive-queue',
    cat: '04',
    hallId: 'h2',
    hallNo: 'HALL 2',
    position: 'POSITION 04',
    plinth: { x: 960, y: 520 },
    title: 'The Adaptive Queue',
    status: 'retired',
    anomaly: true,
    wall: 'The piece we are proudest to have retired. It shipped, it worked, and it taught the whole floor that queueing theory beats hand-tuned heuristics. Then the platform learned the lesson so thoroughly that the queue became a standard primitive — and a standing exhibit is no place for a solved problem. De-accessioned with honours.',
    placard: {
      team: '2 engineers · 11 weeks',
      year: 'Commissioned FY25 · retired FY27, with honours',
      materials: 'materials: 2 engineers, 11 weeks, one obsolete process, and a lesson the platform kept',
    },
    piece: {
      kind: 'claim',
      headline: '19',
      unit: 'months in production, then deliberately sunset',
      caption: 'Retired not because it failed but because it succeeded into the platform. The lesson outlived the code.',
    },
  },
  {
    id: 'ops-copilot',
    cat: '05',
    hallId: 'h2',
    hallNo: 'HALL 2',
    position: 'POSITION 05',
    plinth: { x: 720, y: 750 },
    title: 'The Operations Copilot',
    status: 'pilot',
    wall: 'A grounded assistant for the operations desk — it reads the runbooks so the on-call engineer does not have to at 3am. In pilot with two desks; expansion gated on the same guardrails as any model that talks to people.',
    placard: {
      team: '3 engineers · 1 ops lead',
      year: 'Commissioned FY27',
      materials: 'materials: a retrieval index, a narrow toolset, and a firm refusal to let it act unsupervised',
    },
    piece: {
      kind: 'metrics',
      tiles: [
        { value: '2', label: 'desks piloting' },
        { value: '−34%', label: 'time-to-first-action' },
        { value: '100%', label: 'actions human-approved' },
      ],
    },
  },
  {
    id: 'on-device',
    cat: '06',
    hallId: 'h3',
    hallNo: 'HALL 3',
    position: 'POSITION 06',
    plinth: { x: 1330, y: 470 },
    title: 'On-device Personalisation',
    status: 'pilot',
    wall: 'Personalisation that never leaves the handset. The frontier piece of the season — the model ships to the device, the data never ships anywhere. Early, expensive, and the most interesting thing on the floor.',
    placard: {
      team: '2 engineers · 1 mobile specialist',
      year: 'Commissioned FY27',
      materials: 'materials: a quantised model, an on-device runtime, and a privacy promise kept by construction',
    },
    piece: {
      kind: 'claim',
      headline: '0',
      unit: 'personal features sent to the server',
      caption: 'Inference runs entirely on the device. The frontier of the portfolio, shown as an early pilot.',
    },
  },
];

export const RETIRED_EXHIBIT = EXHIBITS.find((e) => e.anomaly) as Exhibit;

export function exhibitById(id: string): Exhibit {
  return EXHIBITS.find((e) => e.id === id) as Exhibit;
}

/* ------------------------------------------------------------------ */
/* Slides                                                              */
/* ------------------------------------------------------------------ */

interface SlideBase {
  id: string;
  indexTitle: string;
  section: string;
  place: string;
  focus: { x: number; y: number; scale: number };
}

export interface CoverSlide extends SlideBase {
  kind: 'cover';
  eyebrow: string;
  titleLines: readonly string[];
  thesis: string;
  meta: readonly string[];
}

export interface PlanSlide extends SlideBase {
  kind: 'plan';
  kicker: string;
  heading: string;
  standfirst: string;
}

export interface ExhibitSlide extends SlideBase {
  kind: 'exhibit';
  exhibitId: string;
}

export interface CloseSlide extends SlideBase {
  kind: 'close';
  kicker: string;
  titleLines: readonly string[];
  commissions: readonly { ref: string; text: string }[];
  meta: readonly string[];
}

export type Slide = CoverSlide | PlanSlide | ExhibitSlide | CloseSlide;

const SEC_ENTRANCE = 'ENTRANCE';
const SEC_FLOOR = 'THE FLOOR';
const SEC_NEXT = 'NEXT SEASON';

const FLOOR_CENTRE = { x: 800, y: 500, scale: 1 } as const;

function exhibitFocus(e: Exhibit) {
  // Zoom in enough that the plinth reads as "the stand this piece is on", but
  // wide enough that the spotlight pool spreads into the open channel between
  // the piece and its placard and neighbouring plinths give context.
  return { x: e.plinth.x, y: e.plinth.y - 40, scale: 1.7 };
}

export const SLIDES: readonly Slide[] = [
  {
    kind: 'cover',
    id: 'cover',
    indexTitle: 'Entrance — the standing exhibition',
    section: SEC_ENTRANCE,
    place: 'ENTRANCE',
    focus: { x: 800, y: 720, scale: 1.15 },
    eyebrow: `${EXHIBITION.title} · ${EXHIBITION.curator}`,
    titleLines: ['A portfolio is not', 'a slide of logos.', 'It is a floor', 'you can walk.'],
    thesis:
      'We hang the innovation portfolio the way a gallery hangs a collection: on a floor, with plinths, placards and pride — including for the piece we chose to retire. Walk it in order, or jump to any hall. Every exhibit states what it cost, what it moved, and whether it still stands.',
    meta: [
      `${EXHIBITION.subtitle.toUpperCase()} · ${EXHIBITION.curator}`,
      'THREE HALLS · SIX EXHIBITS · TWO IN PRODUCTION · THREE PILOTS · ONE RETIRED',
      'THE FLOOR PLAN IS THE MAP AND THE CATALOGUE',
    ],
  },
  {
    kind: 'plan',
    id: 'floor-plan',
    indexTitle: 'The floor plan',
    section: SEC_ENTRANCE,
    place: 'FLOOR PLAN',
    focus: { ...FLOOR_CENTRE },
    kicker: 'THE FLOOR PLAN',
    heading: 'Three halls, six plinths',
    standfirst:
      'Foundations, Decisioning, Frontier. The plan is also the catalogue: every plinth is numbered, every exhibit is listed to the right with its hall and its standing. The retired piece keeps its place at the centre of Hall 2.',
  },
  ...EXHIBITS.map((e) => ({
    kind: 'exhibit' as const,
    id: e.id,
    indexTitle: `${e.cat} · ${e.title} — ${STATUS_SHORT[e.status]}`,
    section: SEC_FLOOR,
    place: `${e.hallNo} · ${e.position}`,
    focus: exhibitFocus(e),
    exhibitId: e.id,
  })),
  {
    kind: 'close',
    id: 'next-season',
    indexTitle: 'Next season — the commissions',
    section: SEC_NEXT,
    place: 'NEXT SEASON',
    focus: { x: 800, y: 300, scale: 1.1 },
    kicker: 'NEXT SEASON · NOW COMMISSIONING',
    titleLines: ['What we hang', 'next depends on', 'what this floor', 'taught us.'],
    commissions: [
      { ref: 'N1', text: 'Promote the Synthetic Data Foundry (02) from pilot to production once governance signs.' },
      { ref: 'N2', text: 'Commission a second-generation On-device model (06) — the frontier worth the spend.' },
      { ref: 'N3', text: 'Keep one plinth in every hall empty. A full floor is a floor that stopped trying.' },
      { ref: 'N4', text: 'Retire with honours, not silence. The Adaptive Queue (04) is how we want to sunset.' },
    ],
    meta: [
      `${EXHIBITION.title} · ${EXHIBITION.curator}`,
      'SIX EXHIBITS STANDING · ONE RETIRED WITH HONOURS · PLINTHS OPEN FOR NEXT SEASON',
    ],
  },
];

export const SLIDE_COUNT = SLIDES.length;

export function slideNumberForId(id: string): number | null {
  const index = SLIDES.findIndex((slide) => slide.id === id);
  return index === -1 ? null : index + 1;
}
