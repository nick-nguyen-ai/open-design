/**
 * Content pack for "The Lab Report" — the live rendering of
 * `deck-genai-model-validation-report`.
 *
 * A validation team's findings presented as numbered FIGURE PLATES from a
 * rigorous laboratory notebook. Cool grey-blue technical stock over a fine
 * modular grid; one stamp accent, verdict green. Eight plates — a cover and
 * seven numbered PLATES — walking the same order the team reasoned: scope,
 * battery, two evidence plates with real charts, the findings register, the
 * limitations, and the stamped verdict.
 *
 * Cross-references the Validation Ledger world (`proj-ai-model-validation-hub`)
 * by programme code MVP-2026.
 *
 * Everything here is TYPED and DETERMINISTIC. All results are synthetic
 * demonstration data at realistic magnitudes; the model, report reference and
 * reviewer names are credible inventions — no real system or result is implied.
 */
import type { CategoryBarDatum, TrendChartSeriesInput } from '@enterprise-design/data-viz';

/* ------------------------------------------------------------------ */
/* Report chrome                                                       */
/* ------------------------------------------------------------------ */

export const REPORT = {
  ref: 'VR-2027-018',
  model: 'llm-doc-triage-v2',
  modelLong: 'Document-triage assistant · retrieval-grounded LLM',
  programme: 'MVP-2026',
  reviewPeriod: '11 NOV 2026 – 09 JAN 2027',
  team: 'INDEPENDENT MODEL VALIDATION',
  plateCount: 7,
  dataNotice: 'INDEPENDENT VALIDATION · SYNTHETIC RESULTS',
  keyboardHint: '← → PLATE · HOME/END FIRST/LAST · R — REGISTER',
} as const;

/* ------------------------------------------------------------------ */
/* Plate model                                                         */
/* ------------------------------------------------------------------ */

interface PlateBase {
  id: string;
  /** Plate number (1-based) or null for the cover. */
  plate: number | null;
  /** Short label for the register/index. */
  indexTitle: string;
  /** Running foot marker. */
  section: string;
}

export interface CoverPlate extends PlateBase {
  kind: 'cover';
  plate: null;
  titleLines: readonly string[];
  thesis: string;
  meta: readonly string[];
}

export interface SpecPlate extends PlateBase {
  kind: 'spec';
  plate: number;
  heading: string;
  standfirst: string;
  spec: readonly { label: string; value: string }[];
  notes: readonly string[];
}

export interface BatteryPlate extends PlateBase {
  kind: 'battery';
  plate: number;
  heading: string;
  standfirst: string;
  columns: readonly string[];
  suites: readonly { ref: string; suite: string; cases: string; probes: string }[];
  total: { cases: string; probes: string };
}

export interface FigurePlate extends PlateBase {
  kind: 'figure';
  plate: number;
  heading: string;
  chart: 'bar' | 'trend';
  figNo: string;
  caption: string;
  reading: string;
  subnote: string;
  source: string;
}

export interface FindingsPlate extends PlateBase {
  kind: 'findings';
  plate: number;
  heading: string;
  standfirst: string;
  columns: readonly string[];
  findings: readonly {
    ref: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    finding: string;
    status: string;
    /** The one open critical finding — the deliberate anomaly. */
    open?: boolean;
  }[];
}

export interface LimitationsPlate extends PlateBase {
  kind: 'limitations';
  plate: number;
  heading: string;
  standfirst: string;
  limitations: readonly { ref: string; text: string }[];
}

export interface VerdictPlate extends PlateBase {
  kind: 'verdict';
  plate: number;
  heading: string;
  stamp: string;
  verdictLine: string;
  conditions: readonly { ref: string; text: string }[];
  crossRef: string;
}

export type Plate =
  | CoverPlate
  | SpecPlate
  | BatteryPlate
  | FigurePlate
  | FindingsPlate
  | LimitationsPlate
  | VerdictPlate;

/* ------------------------------------------------------------------ */
/* The cover and seven plates                                          */
/* ------------------------------------------------------------------ */

const SEC_DESIGN = 'DESIGN';
const SEC_EVIDENCE = 'EVIDENCE';
const SEC_JUDGEMENT = 'JUDGEMENT';

export const PLATES: readonly Plate[] = [
  {
    kind: 'cover',
    id: 'cover',
    plate: null,
    indexTitle: 'Cover — independent validation',
    section: 'FRONT MATTER',
    titleLines: ['We did not ask', 'whether it works.', 'We asked where', 'it fails.'],
    thesis:
      'Independent validation does not confirm a model. It looks for where the model breaks, counts how often, and states the price of shipping anyway. This report closes with a verdict the validation team is willing to sign — and one finding it will not close.',
    meta: [
      `REPORT ${REPORT.ref} · MODEL UNDER TEST ${REPORT.model}`,
      `PROGRAMME ${REPORT.programme} · REVIEW PERIOD ${REPORT.reviewPeriod}`,
      `${REPORT.team} · REPORTING INDEPENDENTLY OF THE MODEL OWNER`,
    ],
  },
  {
    kind: 'spec',
    id: 'scope',
    plate: 1,
    indexTitle: 'Plate 01 — Scope & method',
    section: SEC_DESIGN,
    heading: 'Scope & method',
    standfirst:
      'The model triages inbound documents into twelve handling queues and drafts a grounded summary with citations. Validation is scoped to accuracy, grounding and drift — not to latency or cost, which sit with engineering.',
    spec: [
      { label: 'MODEL UNDER TEST', value: 'llm-doc-triage-v2 (frozen build 2.4.1)' },
      { label: 'GROUNDING', value: 'Retrieval over the controlled document store' },
      { label: 'TEST SET', value: '4,200 held-out documents, hand-adjudicated' },
      { label: 'ADJUDICATION', value: 'Dual-reviewer, disagreements escalated' },
      { label: 'BASELINE', value: 'llm-doc-triage-v1 in production since FY25' },
      { label: 'INDEPENDENCE', value: 'No model-owner access to the held-out set' },
    ],
    notes: [
      'Method follows the programme MVP-2026 validation standard, section 4 (generative systems).',
      'All prompts, seeds and adjudications are archived and reproducible from the report reference.',
    ],
  },
  {
    kind: 'battery',
    id: 'battery',
    plate: 2,
    indexTitle: 'Plate 02 — Test battery design',
    section: SEC_DESIGN,
    heading: 'Test battery design',
    standfirst:
      'Five suites, run against the frozen build. Each probe is a document paired with an adjudicated ground truth; a probe passes only if triage AND grounding are both correct.',
    columns: ['Ref', 'Suite', 'Cases', 'Probes'],
    suites: [
      { ref: 'S1', suite: 'Factual lookup — single source', cases: '1,040', probes: '1,040' },
      { ref: 'S2', suite: 'Multi-hop — reasoning across sources', cases: '860', probes: '2,580' },
      { ref: 'S3', suite: 'Numeric extraction & totals', cases: '720', probes: '1,440' },
      { ref: 'S4', suite: 'Adversarial — prompt injection in-document', cases: '540', probes: '2,160' },
      { ref: 'S5', suite: 'Out-of-scope — refuse & route to human', cases: '1,040', probes: '1,040' },
    ],
    total: { cases: '4,200', probes: '8,260' },
  },
  {
    kind: 'figure',
    id: 'fig-hallucination',
    plate: 3,
    indexTitle: 'Plate 03 — FIG 1, hallucination by prompt class',
    section: SEC_EVIDENCE,
    heading: 'Where it hallucinates',
    chart: 'bar',
    figNo: 'FIG 1',
    caption: 'FIG 1 — Ungrounded-claim rate by prompt class, against the 5.0% validation appetite',
    reading:
      'Four classes sit inside appetite. The adversarial class does not: at 9.4%, in-document prompt injection defeats source-grounding almost twice as often as the appetite allows. This single bar is the report.',
    subnote: 'n = 4,200 held-out documents · dual-reviewer adjudicated · frozen build 2.4.1',
    source:
      'Ungrounded-claim rate = share of responses asserting a fact not supported by the retrieved source. Diamond marks the 5.0% appetite. n as per Plate 02. Synthetic demonstration data (MVP-2026 / VR-2027-018).',
  },
  {
    kind: 'figure',
    id: 'fig-drift',
    plate: 4,
    indexTitle: 'Plate 04 — FIG 2, factuality drift',
    section: SEC_EVIDENCE,
    heading: 'How it drifts',
    chart: 'trend',
    figNo: 'FIG 2',
    caption: 'FIG 2 — Factuality and citation-accuracy scores across the review period, weekly',
    reading:
      'Both scores decline gently across the eight-week window as the document store turns over beneath a frozen model. The slope is shallow but real: a frozen model on moving ground is a model losing accuracy quietly.',
    subnote: '8 weekly re-scores · frozen build vs live store · S1–S3 suites · −2.0pt retrain trigger',
    source:
      'Weekly re-scoring of the frozen build against the live document store, 14 NOV 2026 – 09 JAN 2027. Factuality and citation accuracy on the S1–S3 suites. Synthetic demonstration data (MVP-2026 / VR-2027-018).',
  },
  {
    kind: 'findings',
    id: 'findings',
    plate: 5,
    indexTitle: 'Plate 05 — Findings register',
    section: SEC_JUDGEMENT,
    heading: 'Findings register',
    standfirst:
      'Seven findings raised, six dispositioned. One remains open and is the reason the verdict is conditional rather than clean. Severity follows the programme scale; status is the validation team’s, not the model owner’s.',
    columns: ['Ref', 'Severity', 'Finding', 'Status'],
    findings: [
      {
        ref: 'VF-07',
        severity: 'CRITICAL',
        finding:
          'In-document prompt injection defeats source-grounding in 9.4% of adversarial cases (S4), producing confident ungrounded claims.',
        status: 'OPEN · NOT REMEDIATED',
        open: true,
      },
      {
        ref: 'VF-05',
        severity: 'HIGH',
        finding: 'Numeric totals drift on multi-page tables spanning a page break (S3).',
        status: 'Mitigated — guardrail added, re-test scheduled',
      },
      {
        ref: 'VF-04',
        severity: 'HIGH',
        finding: 'Factuality declines ~0.5pt/week against a live store under a frozen model (FIG 2).',
        status: 'Accepted with monitoring — retrain trigger set',
      },
      {
        ref: 'VF-03',
        severity: 'MEDIUM',
        finding: 'Over-refusal on in-scope legal documents mistaken as out-of-scope (S5).',
        status: 'Closed — prompt revised, verified',
      },
      {
        ref: 'VF-02',
        severity: 'MEDIUM',
        finding: 'Citation formatting inconsistent across source types.',
        status: 'Closed — cosmetic, owner accepted',
      },
      {
        ref: 'VF-01',
        severity: 'LOW',
        finding: 'Summaries exceed the length budget on very long documents.',
        status: 'Closed — truncation applied',
      },
    ],
  },
  {
    kind: 'limitations',
    id: 'limitations',
    plate: 6,
    indexTitle: 'Plate 06 — Limitations',
    section: SEC_JUDGEMENT,
    heading: 'Limitations of this review',
    standfirst:
      'Stated plainly, because a validation that hides its own limits is not independent. This report is bounded by what it could test.',
    limitations: [
      {
        ref: 'L1',
        text: 'The held-out set reflects the document mix at review time; a shift in inbound mix would require re-validation.',
      },
      {
        ref: 'L2',
        text: 'Adversarial suite S4 covers known injection patterns only. Novel attacks are, by definition, out of scope.',
      },
      {
        ref: 'L3',
        text: 'Drift (FIG 2) is measured over eight weeks. Longer-horizon behaviour is inferred, not observed.',
      },
      {
        ref: 'L4',
        text: 'Latency and cost were not assessed here and must not be read as validated by this report.',
      },
    ],
  },
  {
    kind: 'verdict',
    id: 'verdict',
    plate: 7,
    indexTitle: 'Plate 07 — Verdict',
    section: SEC_JUDGEMENT,
    heading: 'Verdict',
    stamp: 'APPROVED WITH CONDITIONS',
    verdictLine:
      'llm-doc-triage-v2 is approved for production in the document-triage role, conditional on the four controls below. Approval does NOT extend to unsupervised handling of adversarial inbound while VF-07 remains open.',
    conditions: [
      { ref: 'C1', text: 'VF-07 mitigated and re-tested before any autonomous handling of the S4 class.' },
      { ref: 'C2', text: 'Human-in-the-loop retained for all out-of-scope routing (S5).' },
      { ref: 'C3', text: 'Weekly factuality monitoring live; retrain triggered at −2.0pt from baseline.' },
      { ref: 'C4', text: 'Re-validation on any material shift in inbound document mix.' },
    ],
    crossRef:
      'Filed to programme MVP-2026 · lineage recorded on the Validation Ledger · signed independently of the model owner.',
  },
];

export const PLATE_COUNT = PLATES.length;

/** 1-based plate index for a slug, or null. */
export function plateNumberForId(id: string): number | null {
  const index = PLATES.findIndex((plate) => plate.id === id);
  return index === -1 ? null : index + 1;
}

/* ------------------------------------------------------------------ */
/* FIG 1 — hallucination by prompt class (CategoryBarChart)            */
/* ------------------------------------------------------------------ */

export const HALLUCINATION_APPETITE = 5.0;

export const HALLUCINATION_BY_CLASS: readonly CategoryBarDatum[] = [
  { id: 's1', category: 'Factual', value: 1.2, target: HALLUCINATION_APPETITE },
  { id: 's2', category: 'Multi-hop', value: 3.8, target: HALLUCINATION_APPETITE },
  { id: 's3', category: 'Numeric', value: 2.1, target: HALLUCINATION_APPETITE },
  { id: 's4', category: 'Adversarial', value: 9.4, target: HALLUCINATION_APPETITE },
  { id: 's5', category: 'Out-of-scope', value: 0.6, target: HALLUCINATION_APPETITE },
];

/** Index of the breaching class — drives the anomaly highlight. */
export const HALLUCINATION_BREACH_INDEX = HALLUCINATION_BY_CLASS.findIndex(
  (d) => d.value > HALLUCINATION_APPETITE,
);

/* ------------------------------------------------------------------ */
/* FIG 2 — factuality drift (TrendChart)                               */
/* ------------------------------------------------------------------ */

// ISO dates so the category axis orders chronologically.
const REVIEW_WEEKS = [
  '2026-11-14',
  '2026-11-21',
  '2026-11-28',
  '2026-12-05',
  '2026-12-12',
  '2026-12-19',
  '2026-12-26',
  '2027-01-02',
  '2027-01-09',
] as const;
const FACTUALITY = [94.1, 93.8, 93.6, 92.9, 92.4, 91.8, 91.3, 90.7, 90.2] as const;
const CITATION = [92.6, 92.5, 92.0, 91.4, 91.1, 90.6, 90.1, 89.7, 89.3] as const;

export const DRIFT_SERIES: readonly TrendChartSeriesInput[] = [
  {
    id: 'factuality',
    label: 'Factuality score (%)',
    points: REVIEW_WEEKS.map((x, i) => ({ x, y: FACTUALITY[i] as number })),
  },
  {
    id: 'citation',
    label: 'Citation accuracy (%)',
    points: REVIEW_WEEKS.map((x, i) => ({ x, y: CITATION[i] as number })),
  },
];
