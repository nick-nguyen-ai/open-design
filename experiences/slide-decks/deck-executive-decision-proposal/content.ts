/**
 * Content pack for "The Committee Paper" — the live rendering of
 * `deck-executive-decision-proposal`.
 *
 * A formal credit-committee paper that learned to present itself. Ten
 * full-viewport sheets: a cover and nine numbered CLAUSES, argued the way a
 * bank actually decides — the recommendation FIRST, the reasoning after. The
 * institutional register of a paper submitted for decision: ivory laid paper,
 * ink-dark serif, a single wax-seal red reserved for the decision itself.
 *
 * Everything here is TYPED and DETERMINISTIC. Every figure is synthetic
 * demonstration data at realistic institutional magnitudes; the committee,
 * the paper number and the model names are credible inventions — no real
 * institution is referenced or implied.
 */
import type { TrendChartSeriesInput } from '@enterprise-design/data-viz';

/* ------------------------------------------------------------------ */
/* Paper chrome                                                        */
/* ------------------------------------------------------------------ */

export const PAPER = {
  ref: 'PAPER 2027-041',
  committee: 'GROUP MODEL RISK COMMITTEE',
  committeeShort: 'MODEL RISK COMMITTEE',
  classification: 'FOR DECISION',
  subject: 'Small-business lending decision engine — production adoption',
  sitting: '14 JANUARY 2027 · 09:30 · COMMITTEE ROOM C',
  author: 'TABLED BY THE HEAD OF CREDIT DECISION SCIENCE',
  clauseCount: 9,
  dataNotice: 'FOR DECISION · SYNTHETIC DEMONSTRATION PAPER',
  keyboardHint: '← → LEAF · HOME/END FIRST/LAST · C — CONTENTS',
} as const;

/* ------------------------------------------------------------------ */
/* Slide model                                                         */
/* ------------------------------------------------------------------ */

interface SheetBase {
  /** Stable slug — the accessible name of the sheet. */
  id: string;
  /** Clause number (1-based) or null for front matter. */
  clause: number | null;
  /** Short label for the contents index. */
  contentsTitle: string;
  /** Running foot / section marker. */
  section: string;
}

export interface CoverSheet extends SheetBase {
  kind: 'cover';
  clause: null;
  subjectLines: readonly string[];
  thesis: string;
  meta: readonly string[];
}

export interface RecommendationSheet extends SheetBase {
  kind: 'recommendation';
  clause: number;
  heading: string;
  lead: string;
  recommended: string;
  terms: readonly { label: string; value: string }[];
  standfirst: string;
}

export interface ProseSheet extends SheetBase {
  kind: 'prose';
  clause: number;
  heading: string;
  paragraphs: readonly string[];
  pull?: string;
  /** Right-margin cross-reference notes, as a committee paper carries. */
  marginNotes?: readonly { ref: string; note: string }[];
}

export interface OptionsSheet extends SheetBase {
  kind: 'options';
  clause: number;
  heading: string;
  standfirst: string;
  columns: readonly string[];
  rows: readonly {
    ref: string;
    option: string;
    cost: string;
    verdict: string;
    /** The struck option — the committee's own preference, declined by Risk. */
    struck?: boolean;
    recommended?: boolean;
  }[];
  footnote: string;
}

export interface EnvelopeSheet extends SheetBase {
  kind: 'envelope';
  clause: number;
  heading: string;
  standfirst: string;
  figure: string;
  figureNote: string;
}

export interface ConditionsSheet extends SheetBase {
  kind: 'conditions';
  clause: number;
  heading: string;
  standfirst: string;
  conditions: readonly { ref: string; text: string }[];
}

export interface ResolutionSheet extends SheetBase {
  kind: 'resolution';
  clause: number;
  heading: string;
  resolutionRef: string;
  resolutionText: string;
  options: readonly string[];
  signatories: readonly { role: string; name: string; line: string }[];
  minute: string;
}

export type Sheet =
  | CoverSheet
  | RecommendationSheet
  | ProseSheet
  | OptionsSheet
  | EnvelopeSheet
  | ConditionsSheet
  | ResolutionSheet;

/* ------------------------------------------------------------------ */
/* The cover and nine clauses                                          */
/* ------------------------------------------------------------------ */

const SEC_DECISION = 'THE DECISION';
const SEC_CASE = 'THE CASE';
const SEC_TERMS = 'THE TERMS';

export const SHEETS: readonly Sheet[] = [
  {
    kind: 'cover',
    id: 'cover',
    clause: null,
    contentsTitle: 'Cover — for decision',
    section: 'FRONT MATTER',
    subjectLines: ['A model kept past its', 'evidence has already', 'made the decision.'],
    thesis:
      'The incumbent scorecard does not pause while the Committee deliberates. It declined 6,120 applicants last quarter on a calibration the bank no longer stands behind. This paper asks for a decision because deferral is itself a decision — taken quietly, at a worse price.',
    meta: [
      `${PAPER.ref} · ${PAPER.classification}`,
      PAPER.committee,
      PAPER.sitting,
      PAPER.author,
    ],
  },
  {
    kind: 'recommendation',
    id: 'recommendation',
    clause: 1,
    contentsTitle: 'Clause 1 — Recommendation',
    section: SEC_DECISION,
    heading: 'Recommendation',
    lead: 'The Committee is asked to approve, without deferral —',
    recommended:
      'a governed champion–challenger adoption of the SBL-DE/2 decision engine: it runs in shadow against the incumbent from Q2, and graduates to live decisioning only by measured evidence, one credit band at a time.',
    terms: [
      { label: 'RECOMMENDED OPTION', value: 'OPTION 3' },
      { label: 'FIRST LIVE BAND', value: 'Q3 FY27' },
      { label: 'DECISION AUTHORITY RETAINED', value: 'THIS COMMITTEE' },
    ],
    standfirst:
      'Clauses 2 to 8 set out the case, the options, the risk opinion and the terms. The resolution is at Clause 9. The recommendation is stated first because the Committee decides first.',
  },
  {
    kind: 'prose',
    id: 'background',
    clause: 2,
    contentsTitle: 'Clause 2 — Background',
    section: SEC_CASE,
    heading: 'Background',
    paragraphs: [
      'The incumbent scorecard, SBL-SCORE/7, has adjudicated unsecured small-business lending since 2019. It is stable, explainable and — on the segment that has changed least — still accurate. It is also eight years old.',
      'Independent validation (programme MVP-2026, ref MVP-2026-SBL-014) reports that the incumbent’s decline rate for newly-formed businesses under two years old has drifted 4.1 percentage points beyond risk appetite. The drift is not fraud and not error; it is the world moving while a fixed model did not. Every quarter it persists, the bank declines applicants it would, on current evidence, have banked.',
      'SBL-DE/2 is the proposed successor: a hybrid engine pairing the incumbent’s scorecard features with a supervised model retrained on four fresh data vintages. It is not autonomous and it is not generative at the point of decision. This paper concerns how — and how carefully — it should replace what is there.',
    ],
    pull: 'The question before the Committee is not whether the incumbent is wrong. It is how long the bank keeps deciding as if it were right.',
    marginNotes: [
      { ref: 'ANNEXE A', note: 'Validation summary, programme MVP-2026, ref MVP-2026-SBL-014.' },
      { ref: 'PRIOR', note: 'Incumbent SBL-SCORE/7 recertified 2024; no full revalidation since.' },
    ],
  },
  {
    kind: 'options',
    id: 'options',
    clause: 3,
    contentsTitle: 'Clause 3 — Options considered',
    section: SEC_CASE,
    heading: 'Options considered',
    standfirst:
      'Four courses were assessed against cost, customer impact and residual model risk. Option 4 was the course preferred in Committee discussion; it is struck because the Model Risk function has formally declined to support it. The paper records the objection plainly rather than soften it.',
    columns: ['', 'Course', 'Three-year cost', 'Disposition'],
    rows: [
      {
        ref: '1',
        option: 'Retain the incumbent unchanged — no adoption',
        cost: 'A$0.0m',
        verdict: 'Rejected — perpetuates the known drift',
      },
      {
        ref: '2',
        option: 'Full cutover to SBL-DE/2 at a single release',
        cost: 'A$4.9m',
        verdict: 'Rejected — unbounded change risk',
      },
      {
        ref: '3',
        option: 'Governed champion–challenger, graduated by band',
        cost: 'A$5.0m',
        verdict: 'RECOMMENDED',
        recommended: true,
      },
      {
        ref: '4',
        option: 'Defer decision to FY28 pending a second data vintage',
        cost: 'A$1.2m',
        verdict: 'Declined by Model Risk — see Clause 4',
        struck: true,
      },
    ],
    footnote:
      'Cost is three-year fully-loaded programme spend, synthetic. Option 4’s low cost is precisely why it appealed — and precisely what Clause 4 argues the bank cannot afford.',
  },
  {
    kind: 'prose',
    id: 'risk-opinion',
    clause: 4,
    contentsTitle: 'Clause 4 — Risk opinion on deferral',
    section: SEC_CASE,
    heading: 'Risk opinion on deferral',
    paragraphs: [
      'The Model Risk function was asked whether deferring the decision to FY28 (Option 4) was a prudent, conservative course. It has advised, on the record, that it is not.',
      'Deferral does not hold the position steady. It leaves the incumbent live, and the incumbent’s drift is not stationary — it widens. On the validated trajectory, a further four quarters of deferral declines an estimated 5,900 additional applicants outside appetite and accrues A$16.4m in modelled customer redress and lost margin, against A$5.0m to adopt now under governance.',
      'The conservative-seeming option is therefore the expensive one, and it carries the higher residual risk. Model Risk’s objection is recorded in full at Annexe B and is the reason Option 4 is struck rather than tabled as a live choice.',
    ],
    pull: 'A decision deferred here is not caution. It is the incumbent’s decision, renewed for another year, on numbers the bank has already disowned.',
    marginNotes: [
      { ref: 'ANNEXE B', note: 'Model Risk objection to Option 4, in full. Tabled independently of the sponsor.' },
      { ref: 'APPETITE', note: 'Decline-rate drift 4.1pp beyond the Board-set fairness appetite for the cohort.' },
    ],
  },
  {
    kind: 'envelope',
    id: 'envelope',
    clause: 5,
    contentsTitle: 'Clause 5 — Financial envelope',
    section: SEC_TERMS,
    heading: 'Financial envelope',
    standfirst:
      'The single chart the paper rests on. It plots the cost of the recommended governed adoption against the modelled cost of leaving the incumbent to run — redress, remediation and foregone margin. The lines cross inside the first quarter.',
    figure: 'A$5.0m',
    figureNote:
      'Three-year fully-loaded envelope for Option 3, released against graduation evidence at each band. Unspent gates return to Group.',
  },
  {
    kind: 'conditions',
    id: 'conditions',
    clause: 6,
    contentsTitle: 'Clause 6 — Conditions precedent',
    section: SEC_TERMS,
    heading: 'Conditions precedent',
    standfirst:
      'Approval, if granted, is conditional. No band graduates to live decisioning until its condition is met and evidenced to this Committee.',
    conditions: [
      {
        ref: 'CP-1',
        text: 'Independent validation (MVP-2026) signs off SBL-DE/2 on each band before that band graduates — sign-off is per band, never blanket.',
      },
      {
        ref: 'CP-2',
        text: 'Adverse-action reason codes are human-readable and reviewed by Conduct before the first live decision.',
      },
      {
        ref: 'CP-3',
        text: 'A monitored fairness floor for under-two-year businesses is instrumented, with automatic reversion to the incumbent on breach.',
      },
      {
        ref: 'CP-4',
        text: 'The incumbent is retained warm as fallback for two full quarters after the final band graduates.',
      },
    ],
  },
  {
    kind: 'prose',
    id: 'implementation',
    clause: 7,
    contentsTitle: 'Clause 7 — Implementation & oversight',
    section: SEC_TERMS,
    heading: 'Implementation & oversight',
    paragraphs: [
      'Q2 FY27 — SBL-DE/2 runs in shadow across all bands, deciding nothing, logging what it would have decided against the incumbent’s live outcomes.',
      'Q3 FY27 — the first band (established businesses, lowest change risk) graduates to live decisioning under CP-1 to CP-3, with the incumbent held warm.',
      'Q4 FY27 — the drifted band (under-two-year businesses) graduates, the fairness floor of CP-3 live and paged to the control room.',
      'Oversight returns to this Committee at every sitting as a standing item, with a measured evidence pack per graduated band. Authority to pause or revert remains with the Committee and with Model Risk independently.',
    ],
  },
  {
    kind: 'prose',
    id: 'accountability',
    clause: 8,
    contentsTitle: 'Clause 8 — Accountability',
    section: SEC_TERMS,
    heading: 'Accountability',
    paragraphs: [
      'The accountable executive for SBL-DE/2 in production is the Chief Credit Officer, supported by the Head of Credit Decision Science as model owner and by an independent validation lead reporting to the Chief Risk Officer.',
      'No single individual may both own the model and sign its validation. The separation is a condition of the framework, not a courtesy, and it is why the resolution at Clause 9 names the roles rather than the people.',
    ],
    pull: 'The bank is not asked to trust the model. It is asked to trust the gate the model must pass, again, at every band.',
  },
  {
    kind: 'resolution',
    id: 'resolution',
    clause: 9,
    contentsTitle: 'Clause 9 — Resolution',
    section: SEC_DECISION,
    heading: 'Resolution',
    resolutionRef: 'RESOLUTION MRC 2027/03 · FOR DECISION',
    resolutionText:
      'The Group Model Risk Committee, having considered Paper 2027-041 in full, RESOLVES to approve Option 3 — the governed champion–challenger adoption of SBL-DE/2 — subject to Conditions Precedent CP-1 to CP-4, and declines Option 4 (deferral) consistent with the Model Risk opinion recorded at Clause 4.',
    options: ['CARRIED', 'DECLINED', 'CARRIED AS AMENDED'],
    signatories: [
      { role: 'CHAIR, MODEL RISK COMMITTEE', name: 'M. OKONKWO-REID', line: '2027-01-14' },
      { role: 'CHIEF RISK OFFICER', name: 'D. VASQUEZ', line: '2027-01-14' },
      { role: 'CHIEF CREDIT OFFICER', name: 'A. LINDQVIST', line: '2027-01-14' },
      { role: 'COMMITTEE SECRETARY', name: 'R. BHATT', line: 'MINUTED' },
    ],
    minute:
      'To be minuted as carried, declined, or carried as amended. Dissents recorded against name. Annexes A (validation summary) and B (Model Risk objection) form part of this resolution.',
  },
];

export const SHEET_COUNT = SHEETS.length;

/** 1-based sheet number for a slug, or null. */
export function sheetNumberForId(id: string): number | null {
  const index = SHEETS.findIndex((sheet) => sheet.id === id);
  return index === -1 ? null : index + 1;
}

/* ------------------------------------------------------------------ */
/* The evidence chart (Clause 5)                                       */
/* ------------------------------------------------------------------ */

export const FIG = {
  title: 'FIGURE 1 — Cost of the recommended path vs cost of the incumbent left to run, A$m cumulative',
  source:
    'Fully-loaded programme cost of Option 3 against modelled customer redress, remediation and foregone margin from the incumbent’s validated drift. FY27 quarterly, extended one quarter into FY28. Synthetic demonstration data (MVP-2026-SBL-014).',
} as const;

// Labels are FY-first so they sort chronologically — the chart's category
// axis orders lexically, and "Q1 FY28" would otherwise fall between Q1 and Q2.
const QUARTERS = ['FY27 Q1', 'FY27 Q2', 'FY27 Q3', 'FY27 Q4', 'FY28 Q1'] as const;
const COST_OF_ADOPTION = [3.2, 4.0, 4.5, 4.8, 5.0] as const;
const COST_OF_DEFERRAL = [2.1, 4.6, 7.8, 11.9, 16.4] as const;

export const EVIDENCE_SERIES: readonly TrendChartSeriesInput[] = [
  {
    id: 'adoption',
    label: 'Cost of the recommended path (A$m)',
    points: QUARTERS.map((x, i) => ({ x, y: COST_OF_ADOPTION[i] as number })),
  },
  {
    id: 'deferral',
    label: 'Cost of the incumbent left to run (A$m)',
    points: QUARTERS.map((x, i) => ({ x, y: COST_OF_DEFERRAL[i] as number })),
  },
];
