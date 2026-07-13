/**
 * Content pack for "The Preprint" — the live rendering of
 * `deck-research-discussion`.
 *
 * THE WORLD: the deck is the pages of an annotated preprint under seminar
 * discussion. Typeset white-paper ground, two-column academic fragments, a
 * synthetic DOI in the footer, figure plates with serif captions — and a
 * SECOND VOICE in the margins: blue-pencil reviewer annotations, slightly
 * rotated, arguing back with the text. This is typeset paper, deliberately NOT
 * grid paper (the Bench Journal and Lab Report own that).
 *
 * The commanding visual is a bespoke confidence-interval dot-whisker plate
 * (Figure 3): point estimates with CI bars, drawn from the data below — one of
 * them crossing zero.
 *
 * Anomaly: finding F3 is stamped `DOES NOT REPLICATE (n=12)` and kept in the
 * paper anyway, with the reviewer's margin note "report it anyway."
 *
 * No real subjects; all figures synthetic (declared in PAPER.dataNotice).
 */
import type { CategoryBarDatum } from '@enterprise-design/data-viz';

export const PAPER = {
  code: 'PREPRINT-01',
  world: 'THE PREPRINT',
  venue: 'SUBMITTED · WORKING PAPER · UNDER DISCUSSION',
  doi: 'doi:10.48999/synthetic.2026.0142',
  dataNotice: 'SYNTHETIC STUDY — NO REAL SUBJECTS',
  keyboardHint: '← → NAVIGATE · HOME/END',
} as const;

export const TITLE = {
  headline: 'Retrieval grounding and unsupported claims in enterprise assistants',
  subtitle: 'A within-subjects study of analyst-facing LLM tools under source-constrained answering',
  authors: 'R. Almén · J. Okonkwo · P. Havlíček · S. Rao',
  affiliation: 'Institute for Applied Decision Systems (synthetic) · Working Paper 0142',
} as const;

/* ------------------------------------------------------------------ */
/* Abstract + the disagreeing margin note                             */
/* ------------------------------------------------------------------ */

export const ABSTRACT =
  'We test whether constraining an analyst-facing assistant to answer only from retrieved sources reduces unsupported claims without degrading task completion. Across 48 analysts and 1,240 research tasks, source-constrained answering cut unsupported claims by roughly two thirds (F1) at a measurable latency cost (F2). A pre-registered replication of the trust effect did not hold (F3). We argue the null is itself the finding, not a footnote.';

export interface MarginNote {
  id: string;
  text: string;
  /** slight hand rotation for the pinned-annotation feel */
  rot: number;
}

export const ABSTRACT_NOTE: MarginNote = {
  id: 'a1',
  text: '“roughly two thirds” — give the interval here, not just the point. The abstract is doing the arguing the figures should.',
  rot: -1.4,
};

/* ------------------------------------------------------------------ */
/* Hypothesis ladder H1 → H3                                          */
/* ------------------------------------------------------------------ */

export interface Hypothesis {
  id: string;
  label: string;
  claim: string;
  standing: 'supported' | 'supported-cost' | 'null';
}

export const HYPOTHESES: readonly Hypothesis[] = [
  {
    id: 'h1',
    label: 'H1',
    claim: 'Source-constrained answering reduces unsupported claims versus free answering.',
    standing: 'supported',
  },
  {
    id: 'h2',
    label: 'H2',
    claim: 'The reduction comes at a latency cost the analyst notices but tolerates.',
    standing: 'supported-cost',
  },
  {
    id: 'h3',
    label: 'H3',
    claim: 'Grounding raises analysts’ self-reported trust in the assistant’s output.',
    standing: 'null',
  },
];

/* ------------------------------------------------------------------ */
/* Method flow                                                        */
/* ------------------------------------------------------------------ */

export interface MethodStep {
  id: string;
  n: string;
  title: string;
  detail: string;
}

export const METHOD: readonly MethodStep[] = [
  { id: 's1', n: '01', title: 'Recruit', detail: '48 analysts, two desks, blocked by seniority.' },
  { id: 's2', n: '02', title: 'Assign', detail: 'Within-subjects: each analyst sees both conditions, order counterbalanced.' },
  { id: 's3', n: '03', title: 'Task', detail: '1,240 real research questions drawn from a desk backlog, de-identified.' },
  { id: 's4', n: '04', title: 'Score', detail: 'Two blind raters flag unsupported claims; disagreements adjudicated.' },
  { id: 's5', n: '05', title: 'Model', detail: 'Mixed-effects logistic on claim support; random intercepts per analyst and task.' },
];

export const METHOD_NOTE: MarginNote = {
  id: 'm1',
  text: 'Counterbalanced — good. But state the washout between conditions; carry-over is exactly where H3 could leak.',
  rot: 1.6,
};

/* ------------------------------------------------------------------ */
/* Results — Figure 2 (effect sizes, comp.category-bar-chart)         */
/* ------------------------------------------------------------------ */

/** Standardised effect sizes (Cohen's d) per outcome, with the pre-registered
 * minimum meaningful effect as the target diamond. */
export const EFFECT_SIZES: readonly CategoryBarDatum[] = [
  { id: 'e1', category: 'Unsupported claims ↓', value: 0.82, target: 0.2 },
  { id: 'e2', category: 'Latency (cost) ↑', value: 0.44, target: 0.2 },
  { id: 'e3', category: 'Trust (replication)', value: 0.06, target: 0.2 },
  { id: 'e4', category: 'Task completion', value: 0.11, target: 0.2 },
];

export const FIG2 = {
  ref: 'FIGURE 2',
  title: 'Standardised effect sizes by outcome',
  source:
    'Cohen’s d, source-constrained vs free answering. Diamonds mark the pre-registered minimum meaningful effect (d = 0.20). Synthetic study.',
} as const;

/* ------------------------------------------------------------------ */
/* Figure 3 — bespoke CI dot-whisker plate (THE commanding visual)    */
/* ------------------------------------------------------------------ */

export interface Finding {
  id: string;
  code: string;
  label: string;
  /** point estimate of the standardised effect */
  estimate: number;
  low: number;
  high: number;
  n: number;
  /** the one finding that does not replicate: CI crosses zero */
  anomaly?: boolean;
}

export const FINDINGS: readonly Finding[] = [
  { id: 'f1', code: 'F1', label: 'Unsupported claims reduced', estimate: 0.82, low: 0.61, high: 1.03, n: 48 },
  { id: 'f2', code: 'F2', label: 'Latency cost, tolerated', estimate: 0.44, low: 0.27, high: 0.61, n: 48 },
  {
    id: 'f3',
    code: 'F3',
    label: 'Trust effect (replication)',
    estimate: 0.06,
    low: -0.19,
    high: 0.31,
    n: 12,
    anomaly: true,
  },
  { id: 'f4', code: 'F4', label: 'Task completion held', estimate: 0.11, low: 0.02, high: 0.2, n: 48 },
  { id: 'f5', code: 'F5', label: 'Citation rate increased', estimate: 0.58, low: 0.39, high: 0.77, n: 48 },
];

export const FIG3 = {
  ref: 'FIGURE 3',
  title: 'Effect estimates with 95% confidence intervals',
  source:
    'Standardised effects with 95% CIs. F3’s interval crosses zero — the pre-registered trust replication does not hold at n = 12. Synthetic study.',
} as const;

export const ANOMALY_TEXT = 'DOES NOT REPLICATE (n=12)';
export const ANOMALY_NOTE: MarginNote = {
  id: 'r1',
  text: 'report it anyway.',
  rot: -2.2,
};

/* ------------------------------------------------------------------ */
/* Replication slide                                                  */
/* ------------------------------------------------------------------ */

export const REPLICATION = {
  lead: 'The trust effect did not replicate.',
  body: 'H3 held in the pilot (n = 12) and we pre-registered it as confirmatory. In the full sample the interval widened and crossed zero. We report the null in the body of the paper, not an appendix: a trust gain we cannot reproduce is a claim the assistant should not make on our behalf either.',
  stat: 'd = 0.06',
  statCaption: '95% CI [−0.19, 0.31] · n = 12',
} as const;

/* ------------------------------------------------------------------ */
/* Limitations — heavily annotated                                    */
/* ------------------------------------------------------------------ */

export interface Limitation {
  id: string;
  text: string;
  note?: MarginNote;
}

export const LIMITATIONS: readonly Limitation[] = [
  {
    id: 'l1',
    text: 'Two desks at one institution; the retrieval corpus is not generalisable to other domains.',
    note: { id: 'ln1', text: 'This is the real ceiling on external validity — lead with it.', rot: 1.2 },
  },
  {
    id: 'l2',
    text: 'Unsupported-claim scoring is rater-mediated; κ = 0.79 is good, not perfect.',
  },
  {
    id: 'l3',
    text: 'The replication sub-sample (n = 12) is under-powered for the trust effect by design.',
    note: { id: 'ln2', text: 'Then don’t call it a replication — call it what it is: an under-powered re-test.', rot: -1.8 },
  },
  {
    id: 'l4',
    text: 'Latency was instrumented server-side; perceived latency may differ from measured.',
  },
];

/* ------------------------------------------------------------------ */
/* Discussion questions                                               */
/* ------------------------------------------------------------------ */

export const DISCUSSION: readonly string[] = [
  'If grounding cuts unsupported claims but not trust, what were analysts trusting before?',
  'Is a two-thirds reduction in unsupported claims worth a 44% latency cost on a trading desk?',
  'Should a null trust effect change how we deploy — or only how we describe — the assistant?',
];

/* ------------------------------------------------------------------ */
/* Citation / closing                                                 */
/* ------------------------------------------------------------------ */

export const CLOSING = {
  statement: 'The null is the finding.',
  citation:
    'Almén R., Okonkwo J., Havlíček P., Rao S. (2026). Retrieval grounding and unsupported claims in enterprise assistants. Working Paper 0142 (synthetic). ' +
    PAPER.doi,
} as const;

/* ------------------------------------------------------------------ */
/* Slide model                                                        */
/* ------------------------------------------------------------------ */

export type SlideKind =
  | 'title'
  | 'abstract'
  | 'hypotheses'
  | 'method'
  | 'results'
  | 'ci-plate'
  | 'replication'
  | 'limitations'
  | 'discussion'
  | 'closing';

export interface Slide {
  id: string;
  kind: SlideKind;
  section: string;
  /** running page folio, typeset-paper style */
  folio: string;
  kicker: string;
}

export const SLIDES: readonly Slide[] = [
  { id: 'title', kind: 'title', section: 'Title page', folio: 'p. 1', kicker: 'PREPRINT' },
  { id: 'abstract', kind: 'abstract', section: 'Abstract', folio: 'p. 1', kicker: 'ABSTRACT' },
  { id: 'hypotheses', kind: 'hypotheses', section: 'Hypotheses', folio: 'p. 2', kicker: '§1 · HYPOTHESES' },
  { id: 'method', kind: 'method', section: 'Method', folio: 'p. 3', kicker: '§2 · METHOD' },
  { id: 'results', kind: 'results', section: 'Results · Fig. 2', folio: 'p. 4', kicker: '§3 · RESULTS' },
  { id: 'ci-plate', kind: 'ci-plate', section: 'Results · Fig. 3', folio: 'p. 5', kicker: '§3 · RESULTS' },
  { id: 'replication', kind: 'replication', section: 'Replication', folio: 'p. 6', kicker: '§4 · REPLICATION' },
  { id: 'limitations', kind: 'limitations', section: 'Limitations', folio: 'p. 7', kicker: '§5 · LIMITATIONS' },
  { id: 'discussion', kind: 'discussion', section: 'Discussion', folio: 'p. 8', kicker: '§6 · DISCUSSION' },
  { id: 'closing', kind: 'closing', section: 'Conclusion', folio: 'p. 8', kicker: '§7 · CONCLUSION' },
];

export const SLIDE_COUNT = SLIDES.length;
export const REPLICATION_SLIDE_NUMBER = SLIDES.findIndex((s) => s.kind === 'replication') + 1;
export const CI_PLATE_SLIDE_NUMBER = SLIDES.findIndex((s) => s.kind === 'ci-plate') + 1;
