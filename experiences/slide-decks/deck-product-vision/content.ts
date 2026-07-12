/**
 * Content pack for "The Manifesto" — the live rendering of
 * `deck-product-vision`.
 *
 * A product vision set like letterpress poster art: the most extreme type
 * treatment in the catalogue. A near-white field, ink black, ONE electric
 * accent (signal red). No charts. Each slide is a POSTER — one line, sometimes
 * one word, at monumental scale, placed asymmetrically with genuine
 * typographic craft.
 *
 * Everything here is TYPED and DETERMINISTIC. All figures are synthetic
 * demonstration data — no real-institution claims anywhere. The one number that
 * indicts us (fourteen repeat identity asks) is the deliberate anomaly.
 */

/* ------------------------------------------------------------------ */
/* Deck chrome                                                         */
/* ------------------------------------------------------------------ */

export const MANIFESTO = {
  title: 'THE MANIFESTO',
  code: 'MANIFESTO',
  program: 'ONE-ASK IDENTITY · SYNTHETIC PRODUCT VISION',
  meetingLine: '09 JULY 2026 · PRODUCT VISION FORUM',
  presenter: 'OFFERED BY THE ONE-ASK PRODUCT TEAM',
  dataNotice: 'SYNTHETIC PRODUCT VISION · NOT A REAL PRODUCT COMMITMENT',
  keyboardHint: '← → NAVIGATE · HOME / END · I — INDEX',
} as const;

/* ------------------------------------------------------------------ */
/* Type model — a poster is built from weighted, optionally accented    */
/* segments so weight contrast and colour are set at the word level.    */
/* ------------------------------------------------------------------ */

/** Weight steps map to Inter Variable wght values in the stylesheet. */
export type Weight = 'thin' | 'reg' | 'mid' | 'black';

export interface Seg {
  t: string;
  /** Optical weight for this run of text (default 'black'). */
  w?: Weight;
  /** Paints this run in the single electric accent. */
  accent?: boolean;
}

/** A display line is an ordered run of weighted segments, set on one baseline. */
export type Line = readonly Seg[];

interface SlideBase {
  id: string;
  /** Short label for the folio + index (the accessible mirror row). */
  folio: string;
  /** Presenter-footer movement name. */
  movement: string;
}

export interface CoverSlide extends SlideBase {
  kind: 'cover';
  kicker: string;
  lines: readonly Line[];
  attribution: string;
  meta: readonly string[];
}

export interface PosterSlide extends SlideBase {
  kind: 'poster';
  kicker: string;
  lines: readonly Line[];
  /** Optical placement of the poster block within the sheet. */
  place: 'nw' | 'sw' | 'ne' | 'se' | 'center' | 'w';
  /** Display scale band. */
  scale: 'xl' | 'lg' | 'md';
  /** Letter-settle entrance (L3) — reduced motion renders it already set. */
  kinetic?: boolean;
  /** A small margin note set in mono microtype. */
  note?: string;
  /** The deliberate anomaly: the poster that indicts our own product. */
  anomaly?: boolean;
}

export interface MeasureSlide extends SlideBase {
  kind: 'measure';
  kicker: string;
  lead: readonly Line[];
  numeral: string;
  trail: readonly Line[];
  note: string;
  kinetic?: boolean;
}

export interface CloseSlide extends SlideBase {
  kind: 'close';
  lines: readonly Line[];
  sub: string;
  meta: readonly string[];
}

export type Slide = CoverSlide | PosterSlide | MeasureSlide | CloseSlide;

/* ------------------------------------------------------------------ */
/* The nine posters                                                    */
/* ------------------------------------------------------------------ */

const M1 = 'I · THE SENTENCE';
const M2 = 'II · THE BELIEF';
const M3 = 'III · THE PROMISE';

export const SLIDES: readonly Slide[] = [
  {
    kind: 'cover',
    id: 'sentence',
    folio: 'The sentence we are building toward',
    movement: M1,
    kicker: 'A PRODUCT VISION',
    lines: [
      [{ t: 'She should', w: 'thin' }],
      [{ t: 'never have to', w: 'reg' }],
      [
        { t: 'explain herself ', w: 'mid' },
        { t: 'twice', w: 'black', accent: true },
      ],
      [{ t: 'to her bank.', w: 'black' }],
    ],
    attribution: 'THE ONE SENTENCE THIS PRODUCT HAS TO EARN',
    meta: [MANIFESTO.program, MANIFESTO.meetingLine, MANIFESTO.presenter],
  },
  {
    kind: 'poster',
    id: 'fourteen',
    folio: 'Our own systems ask her fourteen times — the indictment',
    movement: M1,
    kicker: 'AN HONEST ACCOUNTING',
    place: 'sw',
    scale: 'md',
    anomaly: true,
    lines: [
      [{ t: 'Our own systems', w: 'thin' }],
      [
        { t: 'ask her ', w: 'thin' },
        { t: 'fourteen', w: 'black', accent: true },
      ],
      [{ t: 'times.', w: 'black', accent: true }],
    ],
    note: 'COUNTED ACROSS ONE SYNTHETIC ONBOARDING JOURNEY · 14 SEPARATE IDENTITY ASKS · WE BUILT EVERY ONE',
  },
  {
    kind: 'poster',
    id: 'belief',
    folio: 'A customer is not a case to be reopened',
    movement: M2,
    kicker: 'WHAT WE BELIEVE',
    place: 'nw',
    scale: 'md',
    lines: [
      [{ t: 'A customer is not', w: 'thin' }],
      [
        { t: 'a ', w: 'reg' },
        { t: 'case', w: 'black' },
        { t: ' to be', w: 'reg' },
      ],
      [{ t: 'reopened.', w: 'black' }],
    ],
    note: 'IDENTITY IS SOMETHING WE HOLD FOR HER — NOT SOMETHING WE MAKE HER FETCH AGAIN',
  },
  {
    kind: 'poster',
    id: 'principle-one',
    folio: 'Principle one — Ask once',
    movement: M2,
    kicker: 'PRINCIPLE ONE',
    place: 'w',
    scale: 'xl',
    kinetic: true,
    lines: [[{ t: 'ASK', w: 'thin' }], [{ t: 'ONCE.', w: 'black' }]],
    note: 'ONE VERIFIED ANSWER, WRITTEN DOWN, TRUSTED ACROSS EVERY CHANNEL',
  },
  {
    kind: 'poster',
    id: 'principle-two',
    folio: 'Principle two — Remember her',
    movement: M2,
    kicker: 'PRINCIPLE TWO',
    place: 'se',
    scale: 'xl',
    kinetic: true,
    lines: [[{ t: 'REMEMBER', w: 'black' }], [{ t: 'HER.', w: 'black', accent: true }]],
    note: 'THE SECOND DOOR OPENS ONTO WHAT THE FIRST ONE ALREADY LEARNED',
  },
  {
    kind: 'poster',
    id: 'principle-three',
    folio: 'Principle three — Prove it, do not ask it',
    movement: M2,
    kicker: 'PRINCIPLE THREE',
    place: 'nw',
    scale: 'lg',
    lines: [
      [{ t: 'Prove it.', w: 'black' }],
      [
        { t: 'Don’t ', w: 'thin' },
        { t: 'ask', w: 'black', accent: true },
        { t: ' it.', w: 'thin' },
      ],
    ],
    note: 'WHERE EVIDENCE ALREADY EXISTS, VERIFY IN THE BACKGROUND — NEVER RE-INTERROGATE',
  },
  {
    kind: 'poster',
    id: 'promise',
    folio: 'The promise — by March 2027, once is enough',
    movement: M3,
    kicker: 'THE PROMISE',
    place: 'sw',
    scale: 'md',
    lines: [
      [{ t: 'By ', w: 'thin' }, { t: 'March 2027', w: 'black', accent: true }, { t: ',', w: 'thin' }],
      [{ t: 'once', w: 'black' }, { t: ' is', w: 'reg' }],
      [{ t: 'enough.', w: 'black' }],
    ],
    note: 'A DATE WE ARE WILLING TO BE HELD TO · GATED ON THE MEASURE OVERLEAF',
  },
  {
    kind: 'measure',
    id: 'measure',
    folio: 'We will know it worked when the fourteen becomes one',
    movement: M3,
    kicker: 'WE WILL KNOW IT WORKED WHEN —',
    lead: [[{ t: 'the ', w: 'thin' }, { t: 'fourteen', w: 'mid', accent: true }, { t: ' becomes', w: 'thin' }]],
    numeral: '1',
    trail: [[{ t: 'one ask, carried across every door.', w: 'reg' }]],
    note: 'PRIMARY MEASURE · REPEAT IDENTITY ASKS PER ONBOARDING JOURNEY · TARGET 1 · SYNTHETIC',
    kinetic: true,
  },
  {
    kind: 'close',
    id: 'close',
    folio: 'Ask once — then get out of her way',
    movement: 'CODA',
    lines: [[{ t: 'Ask once.', w: 'black' }], [{ t: 'Then get out', w: 'thin' }], [{ t: 'of her way.', w: 'thin' }]],
    sub: 'The manifesto is short on purpose. Everything else is delivery detail — and the delivery detail is where we will prove we meant it.',
    meta: ['END OF THE MANIFESTO · ONE-ASK IDENTITY', MANIFESTO.dataNotice],
  },
];

export const SLIDE_COUNT = SLIDES.length;

/** 1-based slide number for a slug, or null. */
export function slideNumberForId(id: string): number | null {
  const index = SLIDES.findIndex((slide) => slide.id === id);
  return index === -1 ? null : index + 1;
}

/** The deliberate anomaly slide — the poster that indicts our own product. */
export const ANOMALY_SLIDE = SLIDES.find(
  (s): s is PosterSlide => s.kind === 'poster' && s.anomaly === true,
) as PosterSlide;

/** Plain-text of a line, for the index / accessible mirror and screen readers. */
export function lineText(line: Line): string {
  return line.map((seg) => seg.t).join('');
}
