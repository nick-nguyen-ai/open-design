/**
 * Content pack for "The Line" — the live rendering of
 * `home-career-project-timeline`.
 *
 * A career drawn as ONE continuous survey line running down the page through
 * the years: projects are STATIONS, promotions are GAUGE CHANGES where the
 * line visibly thickens, side-projects are BRANCH lines that either terminate
 * or rejoin carrying something back, and one honest SWITCHBACK records a
 * two-year detour that was reversed out of — the anomaly the eye goes to.
 *
 * Everything here is TYPED and DETERMINISTIC. The profile is ILLUSTRATIVE AND
 * SYNTHETIC (the page carries the mark); the institution is unnamed and the
 * magnitudes are credible but invented. No Math.random at render.
 */

/* ------------------------------------------------------------------ */
/* Identity — the head of the line                                     */
/* ------------------------------------------------------------------ */

export const PERSON = {
  name: 'Marcus Adeyemi',
  role: 'Principal ML Engineer',
  team: 'Decisioning Platform',
  location: 'Melbourne',
  lineOpened: 2014,
  syntheticMark: 'ILLUSTRATIVE PROFILE · SYNTHETIC',
} as const;

export const CHROME = {
  world: 'THE LINE · PERSONAL PAGE',
  service: 'SERVICE · LINE OPEN 2014 · STILL RUNNING',
  synthetic: 'ILLUSTRATIVE PROFILE · SYNTHETIC',
} as const;

export const STATEMENT: readonly string[] = ['One line,', 'twelve years,', 'no gaps hidden.'];

export const STATEMENT_SUBLINE =
  'A career is not a list of job titles — it is a single line that thickens where I grew, branches where I gambled, and once doubled back on itself. This is that line, drawn honestly, with the detour left in.';

export interface IdentityFact {
  label: string;
  value: string;
}

export const IDENTITY_FACTS: readonly IdentityFact[] = [
  { label: 'LINE OPENED', value: '2014' },
  { label: 'STATIONS', value: '9 shipped' },
  { label: 'GAUGE', value: 'analyst → principal' },
  { label: 'STILL RUNNING', value: 'yes' },
];

/* ------------------------------------------------------------------ */
/* The line itself — a sequence of nodes, top (2014) → bottom (now)     */
/* ------------------------------------------------------------------ */

/** Line weight at a point — grade as gauge; the line thickens as it climbs. */
export type Gauge = 1 | 2 | 3 | 4;

export const GAUGE_ROLE: Record<Gauge, string> = {
  1: 'Analyst',
  2: 'Senior Analyst',
  3: 'Lead',
  4: 'Principal',
};

export type NodeKind = 'station' | 'gauge-change' | 'switchback' | 'branch';

/** A branch either dead-ends (marked) or comes back carrying something. */
export type BranchFate = 'terminated' | 'rejoined';

export interface LineNode {
  id: string;
  kind: NodeKind;
  /** Transit-style station code, mono. */
  code: string;
  year: string;
  name: string;
  /** The gauge in force AT and BELOW this node (grade after any change here). */
  gauge: Gauge;
  /** One-line outcome — always carries a real number. */
  outcome: string;
  /** Present on gauge-change nodes: the promotion recorded at the station. */
  promotion?: string;
  /** Present on branch nodes. */
  branch?: {
    fate: BranchFate;
    /** What the branch dead-ended as, or what it carried back on rejoining. */
    carried: string;
  };
  /** Present on the switchback — what the detour taught. */
  detour?: {
    span: string;
    lesson: string;
  };
}

export const NODES: readonly LineNode[] = [
  {
    id: 'n-2014',
    kind: 'station',
    code: 'DP-01',
    year: '2014',
    name: 'Graduate intake — fraud rules desk',
    gauge: 1,
    outcome: 'First model in production; rule-set false positives down 18%.',
  },
  {
    id: 'n-2016',
    kind: 'station',
    code: 'DP-02',
    year: '2016',
    name: 'Risk data mart consolidation',
    gauge: 1,
    outcome: 'Nine source systems folded into one governed mart.',
  },
  {
    id: 'n-2017',
    kind: 'gauge-change',
    code: 'DP-03',
    year: '2017',
    name: 'Credit scorecard rebuild',
    gauge: 2,
    promotion: 'GAUGE CHANGE · ANALYST → SENIOR',
    outcome: 'Median approval time 6 days → 2 days on 40k applications/mo.',
  },
  {
    id: 'n-2018',
    kind: 'branch',
    code: 'DP-B1',
    year: '2018',
    name: 'Hack-week anomaly detector',
    gauge: 2,
    outcome: 'Prototype flagged 3 live incidents in a fortnight.',
    branch: {
      fate: 'terminated',
      carried: 'Shelved — no owner, no on-call. Terminated honestly rather than left to rot.',
    },
  },
  {
    id: 'n-2019',
    kind: 'switchback',
    code: 'DP-XX',
    year: '2019–2021',
    name: 'The Northbridge migration',
    gauge: 2,
    outcome: 'Two years in; reversed out at 70% cutover.',
    detour: {
      span: 'TWO-YEAR DETOUR · REVERSED OUT',
      lesson:
        'A doomed platform migration I backed and could not save. We rolled the whole thing back. It taught me to demand a rollback plan before the first commit — a rule I have never broken since.',
    },
  },
  {
    id: 'n-2021',
    kind: 'station',
    code: 'DP-05',
    year: '2021',
    name: 'Model risk monitoring platform',
    gauge: 2,
    outcome: 'Twelve production models under one drift watch.',
  },
  {
    id: 'n-2022',
    kind: 'gauge-change',
    code: 'DP-06',
    year: '2022',
    name: 'Decisioning ML guild',
    gauge: 3,
    promotion: 'GAUGE CHANGE · SENIOR → LEAD',
    outcome: 'Stood up a practice of 24 engineers across 5 squads.',
  },
  {
    id: 'n-2023',
    kind: 'branch',
    code: 'DP-B2',
    year: '2023',
    name: 'Feature store spike',
    gauge: 3,
    outcome: 'Weekend spike → serves 40 features to 6 teams.',
    branch: {
      fate: 'rejoined',
      carried: 'Rejoined the main line as shared infrastructure — the side-bet that paid its way back.',
    },
  },
  {
    id: 'n-2024',
    kind: 'station',
    code: 'DP-08',
    year: '2024',
    name: 'Real-time fraud, second generation',
    gauge: 3,
    outcome: 'Caught $4.2M in attempted fraud at 40ms p99 decision latency.',
  },
  {
    id: 'n-2025',
    kind: 'gauge-change',
    code: 'DP-09',
    year: '2025',
    name: 'Validation partnership',
    gauge: 4,
    promotion: 'GAUGE CHANGE · LEAD → PRINCIPAL',
    outcome: 'Median model approval 9 days → 4 days across the fleet.',
  },
];

/* ------------------------------------------------------------------ */
/* The terminus — next station under survey                            */
/* ------------------------------------------------------------------ */

export const TERMINUS = {
  code: 'DP-10',
  label: 'NEXT STATION · UNDER SURVEY',
  name: 'Causal decisioning',
  intent:
    'Moving the bank from prediction to intervention — decisions that change outcomes, not just forecast them. Surveyed, not yet cut. Stated as intent, not as a promise.',
} as const;

/* ------------------------------------------------------------------ */
/* Interchange — where the line crossed other people's lines           */
/* ------------------------------------------------------------------ */

export interface Interchange {
  id: string;
  code: string;
  station: string;
  crossedWith: string;
  note: string;
}

export const INTERCHANGES: readonly Interchange[] = [
  {
    id: 'x-1',
    code: 'IX-A',
    station: 'DP-05 · Model risk platform',
    crossedWith: 'Model Validation office',
    note: 'Two years of monthly read-outs turned an audit relationship into a design partnership.',
  },
  {
    id: 'x-2',
    code: 'IX-B',
    station: 'DP-06 · ML guild',
    crossedWith: 'Priya Menon — Streaming Platform',
    note: 'Her pipelines under my models; we shared an on-call rotation for a year.',
  },
  {
    id: 'x-3',
    code: 'IX-C',
    station: 'DP-08 · Real-time fraud',
    crossedWith: 'Financial Crime operations',
    note: 'Ops analysts sat with us for the whole build — the line runs through their floor now.',
  },
  {
    id: 'x-4',
    code: 'IX-D',
    station: 'DP-B2 · Feature store',
    crossedWith: 'Six adopting squads',
    note: 'The branch that rejoined carried their requirements back onto the main line.',
  },
];
