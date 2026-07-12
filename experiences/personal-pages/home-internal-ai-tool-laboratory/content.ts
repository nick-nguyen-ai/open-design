/**
 * Content pack for "The Greenhouse" — the live rendering of
 * `home-internal-ai-tool-laboratory`.
 *
 * A toolsmith's internal tools kept as living cultivars in a glasshouse at
 * dusk: deep botanical dark, luminous growth traces, brass label plates.
 * Each tool is a specimen with an adoption curve drawn as a climbing vine;
 * one specimen is wilting and honestly labelled a deprecation candidate; one
 * bed is empty with a seed packet for what gets planted next.
 *
 * Everything here is TYPED and DETERMINISTIC. The profile is ILLUSTRATIVE
 * AND SYNTHETIC (the page carries the mark). The tools serve the same bank
 * as the Studio, the Bench Journal and the Control Room.
 */

/* ------------------------------------------------------------------ */
/* Gardener                                                            */
/* ------------------------------------------------------------------ */

export const GARDENER = {
  name: 'Elior Ashworth',
  role: 'Staff Engineer · Toolsmith',
  team: 'Developer Experience',
  officeHours: 'THURSDAYS 15:00–16:30 · THE GLASSHOUSE, DESK L4-N',
  invitation: 'Bring me a broken workflow. If it wastes ten minutes a day for ten people, it is worth a cutting.',
  syntheticMark: 'ILLUSTRATIVE PROFILE · SYNTHETIC',
} as const;

export const STANDFIRST =
  'These are the internal tools I tend — grown from real broken workflows, not planned in a roadmap. Each one is a living thing with a growth stage and an honest curve. One is wilting, and it says so. A tool nobody waters should be allowed to die.';

/* ------------------------------------------------------------------ */
/* The bench — specimens                                               */
/* ------------------------------------------------------------------ */

export type Stage = 'seed' | 'cutting' | 'established' | 'production';

export const STAGE_LABEL: Record<Stage, string> = {
  seed: 'SEED',
  cutting: 'CUTTING',
  established: 'ESTABLISHED',
  production: 'PRODUCTION',
};

/** Ordered for the growth-stage legend. */
export const STAGE_ORDER: readonly Stage[] = ['seed', 'cutting', 'established', 'production'];

export interface Specimen {
  id: string;
  name: string;
  /** A mock-botanical binomial, engraved on the brass plate. */
  latin: string;
  stage: Stage;
  planted: string;
  weeklyUsers: number;
  /** What the tool actually does — one line. */
  oneLine: string;
  /** Weekly active users, ~12 weeks — the vine's climb. */
  adoption: readonly number[];
  /** The wilting specimen — declining usage, honestly labelled. */
  wilting?: boolean;
  /** Named successor for the deprecation candidate. */
  successor?: string;
}

export const SPECIMENS: readonly Specimen[] = [
  {
    id: 'promptlint',
    name: 'promptlint',
    latin: 'Lintus promptii',
    stage: 'production',
    planted: 'PLANTED FY24',
    weeklyUsers: 342,
    oneLine: 'Catches brittle prompts in code review before they reach a model.',
    adoption: [120, 160, 190, 220, 250, 275, 295, 310, 325, 335, 340, 342],
  },
  {
    id: 'evalbench',
    name: 'evalbench',
    latin: 'Harnessia robusta',
    stage: 'established',
    planted: 'PLANTED FY25',
    weeklyUsers: 208,
    oneLine: 'One command to run a model change against every regression suite the team owns.',
    adoption: [40, 60, 85, 110, 130, 150, 170, 185, 196, 204, 208, 208],
  },
  {
    id: 'recall',
    name: 'recall',
    latin: 'Radix retrieva',
    stage: 'cutting',
    planted: 'PLANTED P02 FY26',
    weeklyUsers: 71,
    oneLine: 'A retrieval debugger — shows why a document did or did not come back.',
    adoption: [4, 9, 16, 24, 33, 41, 49, 55, 60, 65, 69, 71],
  },
  {
    id: 'sprout',
    name: 'sprout',
    latin: 'Sproutus novus',
    stage: 'seed',
    planted: 'PLANTED P05 FY26',
    weeklyUsers: 19,
    oneLine: 'Scaffolds a new service with the platform’s defaults already wired in.',
    adoption: [0, 0, 0, 2, 5, 8, 11, 13, 15, 17, 18, 19],
  },
  {
    id: 'gitwatch',
    name: 'gitwatch',
    latin: 'Vetus reviewii',
    stage: 'production',
    planted: 'PLANTED FY23',
    weeklyUsers: 90,
    oneLine: 'Summarises long pull requests — now overtaken by the platform’s review copilot.',
    adoption: [258, 255, 248, 235, 214, 190, 168, 150, 132, 116, 101, 90],
    wilting: true,
    successor: 'review-copilot',
  },
];

/** The empty bed — what gets planted next. */
export const SEED_PACKET = {
  idea: 'flaky-test bisector',
  note: 'Bisects a flaky test to the commit that made it flaky. Sowing P09 — if three teams want it.',
  sowing: 'SOWING P09',
} as const;

/* ------------------------------------------------------------------ */
/* Propagation log — who adopted what, when (accessible mirror)        */
/* ------------------------------------------------------------------ */

export interface Propagation {
  team: string;
  tool: string;
  when: string;
  note: string;
}

export const PROPAGATION: readonly Propagation[] = [
  { team: 'Customer Decisioning', tool: 'promptlint', when: 'FEB 2026', note: 'First team outside DX to adopt; drove the rule-set overhaul.' },
  { team: 'Payments Platform', tool: 'promptlint', when: 'MAR 2026', note: 'Wired into their CI gate; now blocks merges on lint escapes.' },
  { team: 'Model Risk & Validation', tool: 'evalbench', when: 'APR 2026', note: 'Runs the validation regression suites nightly.' },
  { team: 'Knowledge & Search', tool: 'recall', when: 'MAY 2026', note: 'The retrieval team took the cutting and never gave it back.' },
  { team: 'Onboarding', tool: 'sprout', when: 'JUN 2026', note: 'Every new service in the guild starts from a sprout scaffold.' },
  { team: 'Fraud Platform', tool: 'gitwatch → review-copilot', when: 'JUN 2026', note: 'Migrated off gitwatch to the platform successor — the first to leave.' },
];

/* ------------------------------------------------------------------ */
/* Care notes — docs/runbooks as plant-care cards                      */
/* ------------------------------------------------------------------ */

export interface CareNote {
  id: string;
  kind: 'WATERING' | 'REPOTTING' | 'LIGHT' | 'PESTS';
  title: string;
  note: string;
  doc: string;
}

export const CARE_NOTES: readonly CareNote[] = [
  {
    id: 'water',
    kind: 'WATERING',
    title: 'promptlint — keep the rules fresh',
    note: 'Retrain the rule set monthly from the week’s lint escapes; a linter that never learns goes stale.',
    doc: 'RUNBOOK · promptlint/ops',
  },
  {
    id: 'repot',
    kind: 'REPOTTING',
    title: 'evalbench — moving to v2 config',
    note: 'Suites migrate to the declarative v2 format this quarter; the shim is temporary.',
    doc: 'GUIDE · evalbench/migrate',
  },
  {
    id: 'light',
    kind: 'LIGHT',
    title: 'recall — getting started',
    note: 'Point it at an index and a query; it explains the ranking. No setup beyond credentials.',
    doc: 'DOC · recall/quickstart',
  },
  {
    id: 'pests',
    kind: 'PESTS',
    title: 'gitwatch — deprecation notice',
    note: 'Frozen to new integrations. Migrate to review-copilot by P10; support ends P12.',
    doc: 'NOTICE · gitwatch/sunset',
  },
];

/* ------------------------------------------------------------------ */
/* Usage pulse — this week (static under reduced motion)               */
/* ------------------------------------------------------------------ */

export const PULSE = {
  heading: 'THIS WEEK IN THE GLASSHOUSE',
  weeklyActive: 612,
  delta: '+34 vs last week',
  /** Mon–Fri active users — the widget's living bars. */
  days: [
    { day: 'MON', value: 128 },
    { day: 'TUE', value: 141 },
    { day: 'WED', value: 156 },
    { day: 'THU', value: 149 },
    { day: 'FRI', value: 118 },
  ],
  note: 'Combined weekly active users across all living specimens. Updated each dawn.',
} as const;

/* ------------------------------------------------------------------ */
/* Chrome                                                              */
/* ------------------------------------------------------------------ */

export const CHROME = {
  world: 'THE GREENHOUSE · PERSONAL PAGE',
  synthetic: 'ILLUSTRATIVE PROFILE · SYNTHETIC',
  timeOfDay: 'DUSK · GLASSHOUSE WARM',
} as const;
