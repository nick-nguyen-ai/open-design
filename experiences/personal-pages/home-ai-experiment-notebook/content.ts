/**
 * Content pack for "The Bench Journal" — the live rendering of
 * `home-ai-experiment-notebook`.
 *
 * A running lab notebook kept in public: a warm grid-paper field, two ink
 * colours, dated experiment entries stamped with a verdict, and taped-in
 * figure plates. Honesty is the design — one entry is struck through with a
 * ruled line but stays fully legible, with a margin note pointing to the
 * re-run that corrected it. Nothing is erased.
 *
 * Everything here is TYPED and DETERMINISTIC. The profile is ILLUSTRATIVE
 * AND SYNTHETIC (the page carries the mark). The bench belongs to the same
 * bank as the Studio and the Control Room — one practitioner's retrieval work.
 */
import type { TrendChartSeriesInput } from '@enterprise-design/data-viz';

/* ------------------------------------------------------------------ */
/* Identity                                                            */
/* ------------------------------------------------------------------ */

export const PERSON = {
  name: 'Sana Okonkwo',
  discipline: 'Applied ML · Retrieval',
  team: 'Knowledge & Search',
  notebook: 'NOTEBOOK 07 · OPEN',
  opened: 'OPENED 02 MAY 2026',
  syntheticMark: 'ILLUSTRATIVE PROFILE · SYNTHETIC',
} as const;

export const JOURNAL_STANDFIRST =
  'This is my bench, kept in the open. Every experiment gets a hypothesis, a method, a result, and a verdict stamped on it — confirmed, refuted, or still running. Nothing is erased; the one I got wrong is struck through and left legible, with a note to the re-run that fixed it.';

/* ------------------------------------------------------------------ */
/* The entries — reverse-chronological run                             */
/* ------------------------------------------------------------------ */

export type Verdict = 'confirmed' | 'refuted' | 'inconclusive';

export const VERDICT_LABEL: Record<Verdict, string> = {
  confirmed: 'CONFIRMED',
  refuted: 'REFUTED',
  inconclusive: 'INCONCLUSIVE — RERUNNING',
};

export interface JournalEntry {
  /** Entry number — monotonic with time; the run reads newest-first. */
  no: number;
  date: string;
  title: string;
  hypothesis: string;
  method: string;
  /** Plain-language result, carrying the number the sparkline traces. */
  result: string;
  verdict: Verdict;
  /** The small inline result trace (decorative; the number lives in `result`). */
  spark: readonly number[];
  /** Whether the sparkline trends up (good) — controls trace colour, never alone. */
  sparkGood: boolean;
  /** The struck-through entry: fully legible, corrected in the open. */
  struck?: boolean;
  /** Margin note (mono) — cross-reference to the correcting entry. */
  margin?: string;
}

export const ENTRIES: readonly JournalEntry[] = [
  {
    no: 47,
    date: '08 JUL 2026',
    title: 'Contrastive reranker on support tickets',
    hypothesis:
      'A small cross-encoder reranker over the top-50 lifts answer relevance on support tickets more than a bigger retriever would.',
    method:
      'Fine-tuned a 22M cross-encoder on painstakingly labelled ticket pairs; A/B against the production bi-encoder on a frozen 1,200-query holdout.',
    result: 'nDCG@10 +7.4 points (0.612 → 0.686). Held across three re-shuffles of the holdout.',
    verdict: 'confirmed',
    spark: [0.61, 0.62, 0.63, 0.64, 0.66, 0.67, 0.68, 0.686],
    sparkGood: true,
    margin: 'PROMOTED TO CANARY · P28',
  },
  {
    no: 46,
    date: '01 JUL 2026',
    title: 'Hard-negative mining from click logs',
    hypothesis:
      'Mining hard negatives from real no-click impressions teaches the retriever the distinctions users actually make.',
    method:
      'Sampled 40k impressions where a plausible doc was shown and not clicked; added as negatives; retrained the bi-encoder from the same seed.',
    result: 'recall@20 0.71 → 0.78. Biggest gains on short, ambiguous queries — exactly the failure mode.',
    verdict: 'confirmed',
    spark: [0.71, 0.72, 0.72, 0.74, 0.75, 0.76, 0.77, 0.78],
    sparkGood: true,
    margin: 'FOLDED INTO THE PIPELINE',
  },
  {
    no: 45,
    date: '23 JUN 2026',
    title: 'Query rewriting with a small LM',
    hypothesis:
      'Rewriting terse queries into fuller questions before retrieval recovers recall the embedder loses on two-word inputs.',
    method:
      'Prompted a 3B instruct model to expand queries; measured end-to-end nDCG with and without, same retriever, same holdout.',
    result: '+1.2 nDCG — inside the ±1.6 noise band. Latency cost is real; the lift is not yet.',
    verdict: 'inconclusive',
    spark: [0.66, 0.67, 0.66, 0.68, 0.67, 0.69, 0.68, 0.674],
    sparkGood: false,
    margin: 'RERUN WITH 5k QUERIES · P27',
  },
  {
    no: 44,
    date: '16 JUN 2026',
    title: 'Chunk size 512 vs 256 tokens',
    hypothesis: 'Larger chunks carry more context and should lift recall on multi-part policy answers.',
    method:
      'Re-indexed the policy corpus at 512 and 256 tokens; identical retriever and queries; measured recall@20 and index footprint.',
    result: 'No measurable recall lift (+0.3, within noise) for +38% index size. Not worth the storage.',
    verdict: 'refuted',
    spark: [0.69, 0.7, 0.69, 0.7, 0.69, 0.7, 0.69, 0.693],
    sparkGood: false,
    margin: 'STAYING AT 256',
  },
  {
    no: 41,
    date: '30 MAY 2026',
    title: 'Re-run: ensemble vs. a matched single model',
    hypothesis:
      'The apparent ensemble win in entry 38 was the control, not the ensemble. Test against a single model of the same total parameter budget.',
    method:
      'Rebuilt the comparison with a matched-capacity single encoder as the control, same data, same eval — the control entry 38 got wrong.',
    result: 'The ensemble lift vanished (+0.2 nDCG, noise). Entry 38’s +5 was the budget, not the ensembling.',
    verdict: 'confirmed',
    spark: [0.65, 0.66, 0.65, 0.66, 0.66, 0.65, 0.66, 0.658],
    sparkGood: true,
    margin: 'THIS CORRECTS ENTRY 38',
  },
  {
    no: 38,
    date: '12 MAY 2026',
    title: 'Embedding ensemble beats a single model',
    hypothesis: 'Averaging two embedding models gives a free accuracy lift over either alone.',
    method:
      'Compared a two-model ensemble against a single small model and called the +5 nDCG a win.',
    result: 'Reported nDCG@10 +5.0 — later shown to be a parameter-budget artefact, not the ensembling.',
    verdict: 'confirmed',
    spark: [0.6, 0.62, 0.63, 0.64, 0.64, 0.65, 0.65, 0.65],
    sparkGood: true,
    struck: true,
    margin: 'WRONG CONTROL GROUP — SEE ENTRY 41',
  },
];

/* ------------------------------------------------------------------ */
/* Figure plates — the two fuller "taped-in" exhibits                  */
/* ------------------------------------------------------------------ */

const SPRINT_WEEKS = [
  '2026-05-04', '2026-05-11', '2026-05-18', '2026-05-25',
  '2026-06-01', '2026-06-08', '2026-06-15', '2026-06-22',
  '2026-06-29', '2026-07-06',
] as const;

export const PLATE_RECALL = {
  id: 'plate-recall',
  title: 'Plate I — recall@20 by reranker depth',
  caption:
    'Recall against the number of candidates the cross-encoder rescores. The knee sits at 50 — past it, latency climbs and recall does not.',
  source: 'Frozen 1,200-query holdout, three seeds averaged. Synthetic demonstration data.',
} as const;

const RERANK_DEPTHS = ['10', '20', '30', '50', '75', '100', '150', '200'] as const;
const RECALL_BY_DEPTH = [0.63, 0.7, 0.74, 0.78, 0.79, 0.795, 0.797, 0.798] as const;

export const PLATE_RECALL_SERIES: readonly TrendChartSeriesInput[] = [
  {
    id: 'recall',
    label: 'recall@20',
    points: RERANK_DEPTHS.map((x, i) => ({ x, y: RECALL_BY_DEPTH[i] as number })),
  },
];

export const PLATE_LATENCY = {
  id: 'plate-latency',
  title: 'Plate II — latency budget across the sprint',
  caption:
    'p50 and p95 end-to-end retrieval latency, weekly. The reranker landed in w/c 29 JUN — p95 rose but stayed under the 250 ms budget.',
  source: 'Weekly production percentiles, 10-week window. Budget line 250 ms. Synthetic demonstration data.',
} as const;

const LAT_P50 = [88, 90, 92, 95, 97, 96, 99, 104, 138, 142] as const;
const LAT_P95 = [150, 152, 158, 161, 165, 168, 170, 176, 232, 238] as const;
const LAT_BUDGET = 250;

export const PLATE_LATENCY_SERIES: readonly TrendChartSeriesInput[] = [
  {
    id: 'p50',
    label: 'p50 ms',
    points: SPRINT_WEEKS.map((x, i) => ({ x, y: LAT_P50[i] as number })),
  },
  {
    id: 'p95',
    label: 'p95 ms',
    points: SPRINT_WEEKS.map((x, i) => ({ x, y: LAT_P95[i] as number })),
  },
  {
    id: 'budget',
    label: 'budget 250 ms',
    points: SPRINT_WEEKS.map((x) => ({ x, y: LAT_BUDGET })),
  },
];

/* ------------------------------------------------------------------ */
/* The index card — topics → entries (accessible mirror)               */
/* ------------------------------------------------------------------ */

export interface IndexTopic {
  topic: string;
  entries: readonly number[];
  note: string;
}

export const INDEX: readonly IndexTopic[] = [
  { topic: 'Reranking', entries: [47, 41], note: 'Cross-encoders help most where the retriever is least sure.' },
  { topic: 'Retrieval / recall', entries: [46, 44], note: 'Hard negatives beat bigger chunks, every time so far.' },
  { topic: 'Query understanding', entries: [45], note: 'Rewriting is not yet paying for its latency.' },
  { topic: 'Embeddings & controls', entries: [41, 38], note: 'The correction that taught me to match the control.' },
];

/* ------------------------------------------------------------------ */
/* The current question — asked plainly                                */
/* ------------------------------------------------------------------ */

export const CURRENT_QUESTION = {
  heading: 'WHAT I AM STUCK ON RIGHT NOW',
  body:
    'Why does the reranker lift support tickets (+7.4 nDCG) but do nothing for policy documents (+0.4, noise)? Same model, same features, same training recipe. The only obvious difference is document length — but I cannot yet separate length from the vocabulary that comes with it. If you have seen this split before, my desk is L6 by the window.',
  ask: 'BRING ME A COUNTER-EXAMPLE',
} as const;

/* ------------------------------------------------------------------ */
/* Chrome                                                              */
/* ------------------------------------------------------------------ */

export const CHROME = {
  world: 'THE BENCH JOURNAL · PERSONAL PAGE',
  synthetic: 'ILLUSTRATIVE PROFILE · SYNTHETIC',
  status: 'NOTEBOOK 07 · OPEN',
} as const;
