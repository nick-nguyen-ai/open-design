/**
 * Content pack for "The Reading Room" — the live rendering of
 * `home-mentoring-tutorial-hub`.
 *
 * A mentor's page as a quiet reading room — the STILLEST world in the
 * catalogue. Mentoring paths are bound volumes on a bespoke syllabus shelf;
 * each opens (native disclosure, no modal) to its session contents. One volume
 * is retired and honestly labelled superseded — curricula age and the room
 * says so (the anomaly). Warm lamplit paper, deep green leather, library
 * typography.
 *
 * Everything TYPED and DETERMINISTIC. The profile is ILLUSTRATIVE AND
 * SYNTHETIC; facts are separated from sample content. Accessibility is the
 * design here — the structure is built to be flawless under a screen reader.
 */

/* ------------------------------------------------------------------ */
/* Chrome + mentor                                                     */
/* ------------------------------------------------------------------ */

export const CHROME = {
  world: 'THE READING ROOM · PERSONAL PAGE',
  hours: 'OPEN · TUE & THU AFTERNOONS',
  synthetic: 'ILLUSTRATIVE PROFILE · SYNTHETIC',
} as const;

export const MENTOR = {
  name: 'Dr. Iris Fenwick',
  role: 'Staff Data Scientist',
  title: 'Mentor in Residence',
  team: 'Decisioning Platform',
  since: 'MENTORING SINCE 2019',
  synthetic: 'ILLUSTRATIVE PROFILE · SYNTHETIC',
} as const;

export const STATEMENT: readonly string[] = ['Pull up a chair.', 'Everything here', 'can be read.'];

export const STATEMENT_SUBLINE =
  'A reading room, not a course catalogue. The mentoring paths are bound on the shelf; take one down and it opens to its contents. Nothing flashes, nothing autoplays — the quiet is the point. Bring the error message; no question is too small.';

/* ------------------------------------------------------------------ */
/* The syllabus shelf — mentoring paths as bound volumes               */
/* ------------------------------------------------------------------ */

export type Level = 'FOUNDATION' | 'INTERMEDIATE' | 'ADVANCED';

export interface Volume {
  id: string;
  title: string;
  level: Level;
  sessions: number;
  graduates: number;
  /** Spine colour band — a leather hue (experience-local). */
  spine: 'green' | 'oxblood' | 'navy' | 'tan';
  blurb: string;
  /** The table of contents disclosed when the volume is opened. */
  contents: readonly string[];
  /** Set only on the retired volume — the anomaly. */
  retired?: {
    supersededBy: string;
    reason: string;
  };
}

export const VOLUMES: readonly Volume[] = [
  {
    id: 'vol-notebook',
    title: 'From Notebook to Production',
    level: 'FOUNDATION',
    sessions: 12,
    graduates: 9,
    spine: 'green',
    blurb: 'The path most people start on: how a model leaves your laptop and survives contact with real traffic.',
    contents: [
      'What "in production" actually means',
      'Packaging a model without tears',
      'Feature parity: train vs serve',
      'Your first deployment, reviewed live',
      'Monitoring: what to watch and why',
      'Rollbacks before you need one',
      'On-call for the model you shipped',
      'Reading a latency budget',
      'Cost is a feature',
      'Retraining without breaking things',
      'Deprecating your own work gracefully',
      'Graduation: ship something small, end to end',
    ],
  },
  {
    id: 'vol-prose',
    title: 'Reading Models Like Prose',
    level: 'INTERMEDIATE',
    sessions: 10,
    graduates: 7,
    spine: 'oxblood',
    blurb: 'Interpretability as literacy — learning to read what a model is actually saying before you defend it.',
    contents: [
      'Feature importance, and its lies',
      'Partial dependence, honestly',
      'SHAP without the hand-waving',
      'When the explanation is the bug',
      'Calibration: does 0.7 mean 0.7?',
      'Slices: where the average hides harm',
      'Counterfactuals you can act on',
      'Writing an interpretability memo',
      'Presenting to people who distrust models',
      'Graduation: explain a live model to its owner',
    ],
  },
  {
    id: 'vol-validation',
    title: 'The Validation Conversation',
    level: 'ADVANCED',
    sessions: 8,
    graduates: 5,
    spine: 'navy',
    blurb: 'How to walk into the validation office with evidence, not vibes — and walk out approved.',
    contents: [
      'What the validation office is actually for',
      'Building an evidence pack that reads itself',
      'Challenger design that survives scrutiny',
      'Documenting assumptions you would rather hide',
      'The findings register, and how to close one',
      'Negotiating scope without cutting corners',
      'When "no" is the right answer',
      'Graduation: take a real model through intake',
    ],
  },
  {
    id: 'vol-incident',
    title: 'Owning an Incident',
    level: 'INTERMEDIATE',
    sessions: 9,
    graduates: 11,
    spine: 'tan',
    blurb: 'The most-requested path: what to do at 2am when the model you shipped is the incident.',
    contents: [
      'The first five minutes',
      'Communicating while you dig',
      'Mitigate first, understand second',
      'Reading the dashboards under pressure',
      'When to roll back and when to hold',
      'Writing the timeline as you go',
      'The blameless write-up, drafted together',
      'Turning a finding into a fix that ships',
      'Graduation: run a game-day as incident lead',
    ],
  },
  {
    id: 'vol-hadoop',
    title: 'Big Data on the Cluster',
    level: 'INTERMEDIATE',
    sessions: 10,
    graduates: 14,
    spine: 'tan',
    blurb: 'The batch-cluster path that taught a generation — kept on the shelf for its history, no longer taught.',
    contents: [
      'The cluster mental model',
      'Partitions, shuffles and grief',
      'Writing jobs that finish',
      'Debugging a stage that hangs',
    ],
    retired: {
      supersededBy: 'Streaming for Humans',
      reason: 'The bank moved off nightly batch in 2024. The lessons live on in the streaming path; the volume stays shelved so the history is honest.',
    },
  },
];

/* ------------------------------------------------------------------ */
/* Office hours card                                                   */
/* ------------------------------------------------------------------ */

export const OFFICE_HOURS = {
  days: 'Tuesdays & Thursdays',
  time: '2:00 – 4:00 pm',
  room: 'Reading Room · L9 West · desk by the window',
  invitation: 'No question is too small. Bring the error message, bring the half-formed idea, bring the thing you are embarrassed not to know.',
  booking: 'Drop in, or hold a slot in the #mentoring channel.',
} as const;

/* ------------------------------------------------------------------ */
/* The register — past mentees by cohort, and where they went          */
/* ------------------------------------------------------------------ */

export interface Cohort {
  year: string;
  mentees: readonly { name: string; wentTo: string }[];
}

export const REGISTER: readonly Cohort[] = [
  {
    year: '2021',
    mentees: [
      { name: 'Nadia Osei', wentTo: 'now leads Fraud ML' },
      { name: 'Ben Tran', wentTo: 'Staff Engineer, Serving' },
      { name: 'Leah Mwangi', wentTo: 'founded the Experimentation guild' },
    ],
  },
  {
    year: '2023',
    mentees: [
      { name: 'Kofi Adjei', wentTo: 'Senior DS, Credit Risk' },
      { name: 'Sara Lindqvist', wentTo: 'mentors the Notebook path herself now' },
      { name: 'Diego Ramos', wentTo: 'Platform, real-time decisioning' },
    ],
  },
  {
    year: '2025',
    mentees: [
      { name: 'Yuki Tanaka', wentTo: 'first model in production this quarter' },
      { name: 'Amara Nwosu', wentTo: 'took the Validation path onward' },
    ],
  },
] as const;

/* ------------------------------------------------------------------ */
/* Margin notes — the mentor's few rules                               */
/* ------------------------------------------------------------------ */

export const MARGIN_NOTES: readonly string[] = [
  'I don’t answer what I can teach you to find.',
  'The stupid question was asked by four people before you, silently.',
  'We read the error message together, out loud, every time.',
  'You graduate when you mentor someone else — not before.',
  'If a path stops being true, it comes off the shelf.',
];

/* ------------------------------------------------------------------ */
/* Tutorial catalogue — honest staleness dates                         */
/* ------------------------------------------------------------------ */

export type TutorialFormat = 'WRITTEN' | 'NOTEBOOK' | 'RECORDING' | 'CHECKLIST';

export interface Tutorial {
  id: string;
  title: string;
  format: TutorialFormat;
  lastRevised: string;
  /** True when the revision date is old enough to warn about. */
  stale?: boolean;
  note: string;
}

export const TUTORIALS: readonly Tutorial[] = [
  {
    id: 't-monitoring',
    title: 'A monitoring starter kit',
    format: 'CHECKLIST',
    lastRevised: 'MAY 2026',
    note: 'PSI, latency, cost — the three dashboards to stand up first.',
  },
  {
    id: 't-evidence',
    title: 'The evidence-pack template',
    format: 'WRITTEN',
    lastRevised: 'APR 2026',
    note: 'The skeleton the validation office likes to read.',
  },
  {
    id: 't-shap',
    title: 'SHAP without the hand-waving',
    format: 'NOTEBOOK',
    lastRevised: 'NOV 2025',
    note: 'Runs end to end; the plots still render.',
  },
  {
    id: 't-oncall',
    title: 'Your first on-call week',
    format: 'RECORDING',
    lastRevised: 'FEB 2024',
    stale: true,
    note: 'Honestly stale — the runbook links moved. Kept until the re-record lands.',
  },
];

export const FORMAT_LABEL: Record<TutorialFormat, string> = {
  WRITTEN: 'Written',
  NOTEBOOK: 'Notebook',
  RECORDING: 'Recording',
  CHECKLIST: 'Checklist',
};
