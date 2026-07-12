/**
 * Content pack for "The Morning Board Pack" — the live rendering of
 * `deck-ai-strategy`.
 *
 * A browser-native board presentation: twelve full-viewport slides arguing
 * the bank's FY27–FY29 AI strategy as a small number of committed choices.
 * Monumental typography carries the argument; the one chart is evidence,
 * not decoration.
 *
 * Everything here is TYPED and DETERMINISTIC. All figures are synthetic
 * demonstration data at realistic institutional magnitudes — no real CBA
 * claims anywhere.
 */
import type { TrendChartSeriesInput } from '@enterprise-design/data-viz';

/* ------------------------------------------------------------------ */
/* Deck chrome                                                         */
/* ------------------------------------------------------------------ */

export const DECK = {
  paper: 'PAPER 4 · FY27–FY29 AI STRATEGY',
  counterTitle: 'AI STRATEGY',
  audience: 'BOARD OF DIRECTORS',
  horizon: 'FY27',
  meetingLine: '12 JULY 2026 · 07:00 · BOARD ROOM 1',
  presenter: 'PRESENTED BY THE GROUP CHIEF DATA & AI OFFICER',
  dataNotice: 'SYNTHETIC BOARD PAPER · NOT CBA MATERIAL',
  keyboardHint: '← → NAVIGATE · HOME/END FIRST/LAST · A — AGENDA',
} as const;

/* ------------------------------------------------------------------ */
/* Slide model                                                         */
/* ------------------------------------------------------------------ */

export interface SlideFact {
  label: string;
  value: string;
}

interface SlideBase {
  /** Stable slug — also the accessible name of the slide. */
  id: string;
  /** Presenter-footer section name. */
  section: string;
  /** Short title for the agenda index. */
  agendaTitle: string;
}

export interface TitleSlide extends SlideBase {
  kind: 'title';
  kicker: string;
  lines: readonly string[];
  meta: readonly string[];
}

export interface SectionSlide extends SlideBase {
  kind: 'section';
  numeral: string;
  title: string;
  whisper: string;
}

export interface StatementSlide extends SlideBase {
  kind: 'statement';
  kicker: string;
  lines: readonly string[];
  sub: string;
  facts?: readonly SlideFact[];
}

export interface SummarySlide extends SlideBase {
  kind: 'summary';
  kicker: string;
  heading: string;
  commitments: readonly { no: string; title: string; line: string }[];
  test: string;
}

export interface EvidenceSlide extends SlideBase {
  kind: 'evidence';
  kicker: string;
  heading: string;
  sub: string;
}

export interface EnvelopeSlide extends SlideBase {
  kind: 'envelope';
  kicker: string;
  figure: string;
  figureLine: string;
  splits: readonly { label: string; amount: string; note: string }[];
  footline: string;
}

export interface MilestonesSlide extends SlideBase {
  kind: 'milestones';
  kicker: string;
  heading: string;
  rows: readonly { q: string; line: string }[];
}

export interface ResolutionSlide extends SlideBase {
  kind: 'resolution';
  kicker: string;
  heading: string;
  items: readonly { letter: string; text: string }[];
  carryLine: string;
}

export interface ClosingSlide extends SlideBase {
  kind: 'closing';
  lines: readonly string[];
  sub: string;
  meta: readonly string[];
}

export type Slide =
  | TitleSlide
  | SectionSlide
  | StatementSlide
  | SummarySlide
  | EvidenceSlide
  | EnvelopeSlide
  | MilestonesSlide
  | ResolutionSlide
  | ClosingSlide;

/* ------------------------------------------------------------------ */
/* The twelve slides                                                   */
/* ------------------------------------------------------------------ */

const S1 = 'I · WHERE WE STAND';
const S2 = 'II · THE EVIDENCE';
const S3 = 'III · THE ASK';

export const SLIDES: readonly Slide[] = [
  {
    kind: 'title',
    id: 'title',
    section: 'PRELIMS',
    agendaTitle: 'Title — We will bank on models we can prove',
    kicker: 'BOARD OF DIRECTORS · STRATEGY SESSION · PAPER 4',
    lines: ['We will bank on', 'models we can prove.'],
    meta: ['FY27–FY29 ARTIFICIAL INTELLIGENCE STRATEGY', DECK.meetingLine, DECK.presenter],
  },
  {
    kind: 'section',
    id: 'section-1',
    section: S1,
    agendaTitle: 'Section I — Where we stand',
    numeral: 'I',
    title: 'WHERE WE STAND',
    whisper: 'THREE FACTS · NO ADJECTIVES',
  },
  {
    kind: 'statement',
    id: 'estate',
    section: S1,
    agendaTitle: 'The estate — 92 million decisions a day',
    kicker: 'THE ESTATE',
    lines: ['Ninety-two million decisions', 'ran through our models', 'yesterday.'],
    sub: 'Most were invisible. Every one carried the bank’s name. This paper governs that estate — not the next demonstration.',
    facts: [
      { label: 'MODELS IN PRODUCTION', value: '214' },
      { label: 'DECISIONS / DAY', value: '92M' },
      { label: 'CERTIFIED TO STANDARD', value: '61%' },
    ],
  },
  {
    kind: 'summary',
    id: 'summary',
    section: S1,
    agendaTitle: 'Executive summary — four commitments, one test',
    kicker: 'EXECUTIVE SUMMARY',
    heading: 'Four commitments, one test.',
    commitments: [
      {
        no: '01',
        title: 'ONE DECISION PLATFORM',
        line: 'Every model ships onto one platform, one control plane. Projects stop building their own plumbing.',
      },
      {
        no: '02',
        title: 'A MODEL FACTORY WITH A GATE',
        line: 'Models are certified by measurement before they touch a customer — and re-certified while they do.',
      },
      {
        no: '03',
        title: 'ASSURANCE THAT SCALES WITH AUTONOMY',
        line: 'The more a model may decide, the more instrumented it becomes. Autonomy is graduated, never granted.',
      },
      {
        no: '04',
        title: 'TALENT WHERE MODELS MEET MONEY',
        line: 'Scarce practitioners sit inside the five decision domains that move the P&L — not in a central pool.',
      },
    ],
    test: 'The test for every dollar that follows: does it move a measured decision?',
  },
  {
    kind: 'section',
    id: 'section-2',
    section: S2,
    agendaTitle: 'Section II — The evidence',
    numeral: 'II',
    title: 'THE EVIDENCE',
    whisper: 'ONE CHART · DRAWN FROM THE LEDGER',
  },
  {
    kind: 'evidence',
    id: 'evidence',
    section: S2,
    agendaTitle: 'Evidence — certification is compounding',
    kicker: 'FIG 1 · FIVE YEARS, TWO LINES',
    heading: 'Certification is compounding.',
    sub: 'As the certified share of daily decision volume rose, releases we had to take back collapsed. The gate pays for itself in decisions we never have to unwind.',
  },
  {
    kind: 'statement',
    id: 'risk-posture',
    section: S2,
    agendaTitle: 'Risk posture — autonomy earned in bands',
    kicker: 'RISK POSTURE',
    lines: ['Autonomy is earned in bands,', 'and revoked by evidence.'],
    sub: 'Assist, recommend, decide: three bands, each with its own instrumentation floor. A model moves up on measured performance and moves down the moment the measurements say so — the control room pages us long before anything pages the regulator.',
    facts: [
      { label: 'AUTONOMY BANDS', value: '3' },
      { label: 'TIER-1 MODELS ON 24/7 WATCH', value: '100%' },
      { label: 'REVOKE-ON-BREACH SLA', value: '≤ 72 H' },
    ],
  },
  {
    kind: 'section',
    id: 'section-3',
    section: S3,
    agendaTitle: 'Section III — The ask',
    numeral: 'III',
    title: 'THE ASK',
    whisper: 'ONE ENVELOPE · FOUR QUARTERS · ONE RESOLUTION',
  },
  {
    kind: 'envelope',
    id: 'envelope',
    section: S3,
    agendaTitle: 'Investment envelope — $285M over three years',
    kicker: 'INVESTMENT ENVELOPE · FY27–FY29',
    figure: '$285M',
    figureLine: 'Three years. Three lines. Gated at every certification milestone.',
    splits: [
      { label: 'PLATFORM & CONTROL PLANE', amount: '$150M', note: 'One decision fabric, hardened.' },
      { label: 'MODEL FACTORY', amount: '$85M', note: 'The certification gate, tooling, retraining.' },
      { label: 'ASSURANCE & PEOPLE', amount: '$50M', note: 'Independent validation — and talent that can face it.' },
    ],
    footline: 'RELEASED QUARTERLY AGAINST EVIDENCE · UNSPENT GATES RETURN TO GROUP',
  },
  {
    kind: 'milestones',
    id: 'milestones',
    section: S3,
    agendaTitle: 'Milestones — the first four quarters',
    kicker: 'THE FIRST FOUR QUARTERS',
    heading: 'What this board will see, and when.',
    rows: [
      { q: 'Q1', line: 'Certification gate live. No model enters production around it.' },
      { q: 'Q2', line: 'First tier-1 decision certified end to end: card fraud.' },
      { q: 'Q3', line: 'Drift control room at 24/7 — every tier-1 model on the scope.' },
      { q: 'Q4', line: 'Half the tier-1 estate certified; first annual evidence pack tabled here.' },
    ],
  },
  {
    kind: 'resolution',
    id: 'resolution',
    section: S3,
    agendaTitle: 'Resolution 2026/14 — for decision',
    kicker: 'RESOLUTION 2026/14 · FOR DECISION',
    heading: 'The Board resolves —',
    items: [
      {
        letter: 'a',
        text: 'to approve an investment envelope of $285M across FY27–FY29, released quarterly against certification evidence;',
      },
      {
        letter: 'b',
        text: 'to appoint the Group Chief Data & AI Officer as the single accountable executive, tabling a measured evidence pack at every scheduled meeting;',
      },
      {
        letter: 'c',
        text: 'to adopt the Model Certification Standard as a condition of production for any model that touches a customer or the balance sheet.',
      },
    ],
    carryLine: 'THE BOARD IS ASKED TO CARRY THE RESOLUTION AS DRAFTED.',
  },
  {
    kind: 'closing',
    id: 'closing',
    section: 'CLOSE',
    agendaTitle: 'Close — measured, not mythic',
    lines: ['Measured,', 'not mythic.'],
    sub: 'The paper closes; the ledger stays open. The first evidence pack returns to this table in September.',
    meta: ['END OF PAPER 4 · AI STRATEGY · BOARD OF DIRECTORS', DECK.dataNotice],
  },
];

export const SLIDE_COUNT = SLIDES.length;

/** 1-based slide number for a slug, or null. */
export function slideNumberForId(id: string): number | null {
  const index = SLIDES.findIndex((slide) => slide.id === id);
  return index === -1 ? null : index + 1;
}

/* ------------------------------------------------------------------ */
/* FIG 1 — the evidence chart                                          */
/* ------------------------------------------------------------------ */

export const FIG1 = {
  title: 'FIG 1 — Certified decision share vs releases taken back, FY23–FY27F',
  source:
    'Certified share of daily decision volume and model releases rolled back within 30 days of ship. FY27 forecast. Synthetic demonstration data.',
  caption:
    'Certified share of decision volume (rising) against releases rolled back within 30 days (collapsing). FY27 is forecast at committed funding.',
} as const;

const FISCAL_YEARS = ['FY23', 'FY24', 'FY25', 'FY26', 'FY27F'] as const;
const CERTIFIED_SHARE = [8, 19, 37, 61, 84] as const;
const ROLLBACK_SHARE = [22, 16, 11, 6, 4] as const;

export const EVIDENCE_SERIES: readonly TrendChartSeriesInput[] = [
  {
    id: 'certified',
    label: 'Decisions on certified models (%)',
    points: FISCAL_YEARS.map((x, i) => ({ x, y: CERTIFIED_SHARE[i] as number })),
  },
  {
    id: 'rollbacks',
    label: 'Releases rolled back ≤ 30 days (%)',
    points: FISCAL_YEARS.map((x, i) => ({ x, y: ROLLBACK_SHARE[i] as number })),
  },
];
