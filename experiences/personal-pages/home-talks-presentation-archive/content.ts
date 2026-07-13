/**
 * Content pack for "The Playbill" — the live rendering of
 * `home-talks-presentation-archive`.
 *
 * A speaker's archive set as a theatre's season playbills. Talks are grouped by
 * SEASON (fiscal year) into playbill columns; each engagement is BILLED with
 * its title in display type, venue / month / house, a one-line NOTICE (a quoted
 * audience reaction), and a letterpress FORMAT badge. The top of the bill is
 * NOW SHOWING — the next scheduled talk as the marquee moment. One past
 * engagement is kept honestly on the bill marked CANCELLED (the anomaly).
 *
 * Stage-black field, warm marquee white, letterpress typography. Everything is
 * TYPED and DETERMINISTIC; the profile is ILLUSTRATIVE AND SYNTHETIC. No
 * Math.random at render.
 */

/* ------------------------------------------------------------------ */
/* The speaker's bill                                                  */
/* ------------------------------------------------------------------ */

export const PERSON = {
  name: 'Theo Ansah',
  role: 'Principal Engineer',
  team: 'Platform Reliability',
  location: 'Manchester',
  billedSince: 2016,
  syntheticMark: 'ILLUSTRATIVE PROFILE · SYNTHETIC',
} as const;

export const CHROME = {
  world: 'THE PLAYBILL · PERSONAL PAGE',
  house: 'THE SPEAKING SEASONS · SINCE 2016',
  synthetic: 'ILLUSTRATIVE PROFILE · SYNTHETIC',
} as const;

export const STATEMENT: readonly string[] = ['Every talk', 'is a house', 'to hold.'];

export const STATEMENT_SUBLINE =
  'Speaking is theatre held to bank restraint: a room, a running order, and a promise to earn the hour. These are the seasons I have played — the keynotes, the workshops, the lightning slots — billed honestly, including the night the house went dark.';

/* ------------------------------------------------------------------ */
/* Formats — letterpress badges                                        */
/* ------------------------------------------------------------------ */

export type Format = 'KEYNOTE' | 'WORKSHOP' | 'LIGHTNING';

export const FORMAT_LABEL: Record<Format, string> = {
  KEYNOTE: 'Keynote',
  WORKSHOP: 'Workshop',
  LIGHTNING: 'Lightning',
};

/* ------------------------------------------------------------------ */
/* NOW SHOWING — the next scheduled talk, the marquee moment           */
/* ------------------------------------------------------------------ */

export const NOW_SHOWING = {
  title: 'The Reliability of Small Promises',
  venue: 'PlatformConf Europe',
  month: 'NOVEMBER 2027',
  house: 'HOUSE OF 900',
  format: 'KEYNOTE' as Format,
  billing: 'THE CLOSING KEYNOTE',
  blurb:
    'Why the strongest reliability cultures are built from small, kept promises — and how to make an SLO a promise a team actually believes.',
} as const;

/* ------------------------------------------------------------------ */
/* The seasons — engagements grouped by fiscal year                    */
/* ------------------------------------------------------------------ */

export interface Engagement {
  id: string;
  title: string;
  venue: string;
  month: string;
  house: number;
  format: Format;
  /** A quoted audience reaction — synthetic. */
  notice: string;
  /** Present only on the cancelled engagement — the anomaly. */
  cancelled?: string;
}

export interface Season {
  id: string;
  label: string;
  /** A one-line season note in the playbill masthead. */
  note: string;
  engagements: readonly Engagement[];
}

export const SEASONS: readonly Season[] = [
  {
    id: 'fy26',
    label: 'SEASON FY26',
    note: 'The season of fewer, larger houses.',
    engagements: [
      {
        id: 'e-26-1',
        title: 'Postmortems Without Blame, in Practice',
        venue: 'AI Guild',
        month: 'MARCH',
        house: 240,
        format: 'KEYNOTE',
        notice: '“The first postmortem talk that didn’t make me feel lectured at.”',
      },
      {
        id: 'e-26-2',
        title: 'Running the Error Budget Meeting',
        venue: 'SRECon EMEA',
        month: 'MAY',
        house: 380,
        format: 'WORKSHOP',
        notice: '“I rewrote our whole ritual on the train home.”',
      },
      {
        id: 'e-26-3',
        title: 'Three Graphs I Trust',
        venue: 'Observability Day',
        month: 'JUNE',
        house: 120,
        format: 'LIGHTNING',
        notice: '“Ten minutes, zero fat. Rare.”',
      },
    ],
  },
  {
    id: 'fy25',
    label: 'SEASON FY25',
    note: 'The season I learned to cut a talk in half.',
    engagements: [
      {
        id: 'e-25-1',
        title: 'What On-Call Owes You',
        venue: 'DevOps North',
        month: 'OCTOBER',
        house: 300,
        format: 'KEYNOTE',
        notice: '“Passed it to my whole leadership chain.”',
      },
      {
        id: 'e-25-2',
        title: 'Designing the Paging Path',
        venue: 'Reliability Summit',
        month: 'FEBRUARY',
        house: 210,
        format: 'WORKSHOP',
        notice: '“Hands-on and humane. My team stopped drowning in alerts.”',
      },
      {
        id: 'e-25-3',
        title: 'The Migration We Rolled Back',
        venue: 'Platform Meetup',
        month: 'APRIL',
        house: 90,
        format: 'LIGHTNING',
        cancelled: 'CANCELLED — SPEAKER ILLNESS · RESCHEDULED SEASON LATER',
        notice: '(Rebilled as the FY26 error-budget workshop, kept honestly on the bill.)',
      },
    ],
  },
  {
    id: 'fy24',
    label: 'SEASON FY24',
    note: 'The first season on the big stages.',
    engagements: [
      {
        id: 'e-24-1',
        title: 'Reliability Is a Product Feature',
        venue: 'PlatformConf',
        month: 'SEPTEMBER',
        house: 520,
        format: 'KEYNOTE',
        notice: '“Changed how our PMs write acceptance criteria.”',
      },
      {
        id: 'e-24-2',
        title: 'From Dashboards to Decisions',
        venue: 'Monitoring & Co',
        month: 'JANUARY',
        house: 160,
        format: 'WORKSHOP',
        notice: '“The only workshop where I built something I still use.”',
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* The repertoire — talks given on request, abstracts as disclosures   */
/* ------------------------------------------------------------------ */

export interface RepertoireItem {
  id: string;
  title: string;
  format: Format;
  runtime: string;
  abstract: string;
}

export const REPERTOIRE: readonly RepertoireItem[] = [
  {
    id: 'rep-1',
    title: 'The Reliability of Small Promises',
    format: 'KEYNOTE',
    runtime: '45 min',
    abstract:
      'A keynote on building reliability culture from small, kept promises. Works for engineering all-hands and mixed leadership audiences; needs a projector and a room that can go quiet.',
  },
  {
    id: 'rep-2',
    title: 'Running a Blameless Postmortem',
    format: 'WORKSHOP',
    runtime: '90 min',
    abstract:
      'A hands-on workshop that walks a real (sanitised) incident end to end. Caps at 40 participants, needs tables, and produces a postmortem the group actually wrote together.',
  },
  {
    id: 'rep-3',
    title: 'The Error Budget Meeting',
    format: 'WORKSHOP',
    runtime: '60 min',
    abstract:
      'How to run the monthly error-budget meeting so it changes decisions instead of theatre. Includes the agenda, the failure modes, and the one slide that matters.',
  },
  {
    id: 'rep-4',
    title: 'Three Graphs I Trust',
    format: 'LIGHTNING',
    runtime: '10 min',
    abstract:
      'A tight lightning talk on the three signals worth paging a human for, and the dozens that are not. Good opener or closer; travels well to any conference.',
  },
];

export const REPERTOIRE_NOTE =
  'Available on request. Tell me the house and the hour; I will tell you which of these fits, honestly.';

/* ------------------------------------------------------------------ */
/* Materials counter — box-office stubs                                */
/* ------------------------------------------------------------------ */

export interface MaterialStub {
  id: string;
  label: string;
  count: number;
  note: string;
}

export const MATERIALS: readonly MaterialStub[] = [
  { id: 'm-decks', label: 'Decks', count: 22, note: 'Slides, released after each talk.' },
  { id: 'm-recordings', label: 'Recordings', count: 14, note: 'Where the venue filmed and permitted it.' },
  { id: 'm-transcripts', label: 'Transcripts', count: 9, note: 'Captioned; for the ones worth reading.' },
];

export const MATERIALS_NOTE =
  'Held at the box office. Every released talk leaves its materials behind — counted here, not paywalled.';

/* ------------------------------------------------------------------ */
/* Stagecraft notes — the craft made visible                          */
/* ------------------------------------------------------------------ */

export interface StagecraftNote {
  id: string;
  figure: string;
  label: string;
  detail: string;
}

export const STAGECRAFT: readonly StagecraftNote[] = [
  {
    id: 'sc-1',
    figure: '30 : 1',
    label: 'Hours prepared per keynote hour',
    detail: 'Roughly thirty hours of writing, cutting and rehearsal for every hour on a keynote stage. The talk you see is the tenth version.',
  },
  {
    id: 'sc-2',
    figure: '3',
    label: 'Full runs before opening night',
    detail: 'At least three complete run-throughs out loud, timed, at least one to a live human who is allowed to look bored.',
  },
  {
    id: 'sc-3',
    figure: '50%',
    label: 'Of the first draft, cut',
    detail: 'The first draft is always twice too long. Half of preparing is deciding what the room does not need to hear.',
  },
];

export const STAGECRAFT_NOTE = 'How I prepare, stated plainly. Craft is not talent; it is the hours nobody sees.';
