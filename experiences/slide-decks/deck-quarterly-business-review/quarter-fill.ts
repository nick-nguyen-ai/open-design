/**
 * The typed **fill** for "The Quarter" world-template.
 *
 * The template (`QuarterTemplate.tsx`) carries the whole craft — the conventional
 * slide anatomy, the navy art layer, the charts, the motion, the chrome. This
 * file carries only the CONTENT contract: a Zod schema whose limits are derived
 * from the shipped instance's real magnitudes plus ~30% headroom, so that ANY
 * schema-valid fill still yields a composed, non-broken deck (headlines cannot
 * overflow their frames; item counts keep the grids, tables, and numbered lists
 * balanced). Two craft slots are mandatory: exactly one flagged-anomaly KPI
 * (`status: 'off-track'`) and the synthetic-notice string.
 *
 * `QUARTER_SLIDE_KINDS` re-states the same slots as the registry-serializable
 * `SlideKindSpec[]` the world-template descriptor advertises.
 */
import { z } from 'zod';
import type { SlideKindSpec } from '@enterprise-design/contracts';

const KpiUnit = z.enum(['currency', 'percent', 'count', 'ratio']);
const KpiStatus = z.enum(['on-track', 'at-risk', 'off-track', 'neutral']);

/* ------------------------------------------------------------------ */
/* Fill schema — content slots only                                    */
/* ------------------------------------------------------------------ */

/** Deck meta — title bar, cover, and the required synthetic notice. */
const DeckMeta = z.object({
  title: z.string().min(1).max(30),
  org: z.string().min(1).max(30),
  period: z.string().min(1).max(48),
  confidentiality: z.string().min(1).max(48),
  /** REQUIRED craft slot: the synthetic-data notice printed on the footer rule. */
  notice: z.string().min(1).max(52),
});

const AgendaEntry = z.object({
  no: z.string().min(1).max(4),
  title: z.string().min(1).max(20),
  detail: z.string().min(1).max(90),
});

const Kpi = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(32),
  value: z.number(),
  unit: KpiUnit.optional(),
  delta: z.number().optional(),
  deltaGoodDirection: z.enum(['up', 'down']).optional(),
  target: z.number().optional(),
  status: KpiStatus,
});

const KpiVsPlanRow = z.object({
  metric: z.string().min(1).max(32),
  actual: z.string().min(1).max(16),
  plan: z.string().min(1).max(16),
  delta: z.string().min(1).max(16),
});

const TrendPoint = z.object({
  x: z.string().min(1).max(16),
  y: z.number().nullable(),
});

const RevenueSeries = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(24),
  points: z.array(TrendPoint).min(6).max(10),
});

const Segment = z.object({
  id: z.string().min(1),
  category: z.string().min(1).max(24),
  value: z.number(),
  target: z.number().optional(),
});

const Deal = z.object({
  name: z.string().min(1).max(32),
  value: z.string().min(1).max(16),
  note: z.string().min(1).max(90),
});

const PipelineRow = z.object({
  stage: z.string().min(1).max(20),
  deals: z.number().int().nonnegative(),
  value: z.string().min(1).max(12),
  coverage: z.string().min(1).max(10),
});

const RiskRow = z.object({
  risk: z.string().min(1).max(44),
  severity: z.enum(['High', 'Medium', 'Low']),
  mitigation: z.string().min(1).max(130),
});

const Priority = z.object({
  no: z.string().min(1).max(4),
  title: z.string().min(1).max(40),
  detail: z.string().min(1).max(160),
});

export const QuarterFill = z
  .object({
    deck: DeckMeta,
    agenda: z.array(AgendaEntry).min(3).max(7),
    summary: z.object({
      lead: z.string().min(1).max(110),
      sentences: z.array(z.string().min(1).max(240)).min(3).max(5),
    }),
    /** REQUIRED craft slot: the single verbatim flag echoed on KPI + summary slides. */
    anomalyLabel: z.string().min(1).max(40),
    kpis: z
      .array(Kpi)
      .min(4)
      .max(4)
      .refine((rows) => rows.filter((r) => r.status === 'off-track').length === 1, {
        message: 'Exactly one KPI must carry the off-track anomaly status.',
      }),
    kpiNote: z.string().min(1).max(120),
    kpiVsPlan: z.array(KpiVsPlanRow).min(4).max(4),
    revenueSeries: RevenueSeries,
    revenueNote: z.string().min(1).max(140),
    segments: z.array(Segment).min(3).max(6),
    segmentNote: z.string().min(1).max(180),
    wins: z.array(Deal).min(2).max(4),
    losses: z.array(Deal).min(2).max(4),
    pipeline: z.array(PipelineRow).min(3).max(6),
    pipelineNote: z.string().min(1).max(140),
    risks: z.array(RiskRow).min(3).max(6),
    priorities: z.array(Priority).min(3).max(5),
    dataNotes: z.array(z.string().min(1).max(180)).min(2).max(6),
  })
  .refine((fill) => fill.summary.sentences.length >= 3, {
    message: 'The executive summary needs at least three sentences.',
    path: ['summary', 'sentences'],
  });

export type QuarterFill = z.infer<typeof QuarterFill>;

/* ------------------------------------------------------------------ */
/* Slot specs — the registry-serializable descriptor view             */
/* ------------------------------------------------------------------ */

export const QUARTER_SLIDE_KINDS: SlideKindSpec[] = [
  {
    kind: 'title',
    purpose: 'The cover — org, period, the one-line lead, confidentiality, and the synthetic notice.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'deck.org', type: 'text', required: true, limits: { maxChars: 30 }, guidance: 'Organisation name, set in mono small-caps above the cover title.' },
      { name: 'deck.period', type: 'text', required: true, limits: { maxChars: 48 }, guidance: 'The reporting period and deck kind, e.g. "Q3 FY26 · Quarterly Business Review".' },
      { name: 'deck.confidentiality', type: 'text', required: true, limits: { maxChars: 48 }, guidance: 'Distribution line, e.g. "CONFIDENTIAL — BOARD DISTRIBUTION".' },
      { name: 'deck.notice', type: 'text', required: true, limits: { maxChars: 52 }, guidance: 'REQUIRED synthetic-data notice printed on every footer rule.' },
      { name: 'summary.lead', type: 'longtext', required: true, limits: { maxChars: 110 }, guidance: 'One sentence framing the quarter — the honest through-line, shown on the cover.' },
    ],
  },
  {
    kind: 'agenda',
    purpose: 'The numbered agenda — the five sections the deck will walk.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'agenda', type: 'items', required: true, limits: { minItems: 3, maxItems: 7 }, guidance: 'Numbered sections; each has a short title (≤20 chars) and a one-line detail (≤90 chars).' },
    ],
  },
  {
    kind: 'summary',
    purpose: 'The executive summary — three-to-five sentences, one of them naming the anomaly.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'summary.sentences', type: 'items', required: true, limits: { minItems: 3, maxItems: 5, maxChars: 240 }, guidance: 'Numbered summary sentences; one should name the flagged metric so the flag is not a surprise.' },
      { name: 'anomalyLabel', type: 'text', required: true, limits: { maxChars: 40 }, guidance: 'REQUIRED verbatim flag, echoed here and on the KPI slide, e.g. "NRR 96% — BELOW 100% FLOOR".' },
    ],
  },
  {
    kind: 'kpi',
    purpose: 'The four headline metrics with a vs-plan mini-table; exactly one is flagged.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'kpis', type: 'metric', required: true, limits: { minItems: 4, maxItems: 4 }, guidance: 'Exactly four KPI tiles; exactly one carries status "off-track" — the single red figure in a green row.' },
      { name: 'kpiVsPlan', type: 'tableRows', required: true, limits: { minItems: 4, maxItems: 4 }, guidance: 'One vs-plan row per KPI: metric, actual, plan, delta — neutral ink so the flag stays the only red element.' },
      { name: 'kpiNote', type: 'text', required: true, limits: { maxChars: 120 }, guidance: 'One-line reading of the row, e.g. "Three are on track; net revenue retention is not.".' },
      { name: 'anomalyLabel', type: 'text', required: true, limits: { maxChars: 40 }, guidance: 'REQUIRED verbatim flag shown in the pinned strip under the tiles.' },
    ],
  },
  {
    kind: 'trend',
    purpose: 'The multi-quarter revenue trend (comp.trend-chart).',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'revenueSeries', type: 'number', required: true, limits: { minItems: 6, maxItems: 10 }, guidance: 'Six-to-ten period points (label + value); the last point is the reporting quarter.' },
      { name: 'revenueNote', type: 'text', required: true, limits: { maxChars: 140 }, guidance: 'Source note explaining the trend and any step, shown under the chart.' },
    ],
  },
  {
    kind: 'segment',
    purpose: 'Revenue by segment against plan (comp.category-bar-chart).',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'segments', type: 'items', required: true, limits: { minItems: 3, maxItems: 6 }, guidance: 'Three-to-six segments; each a value with an optional plan target (diamond marker).' },
      { name: 'segmentNote', type: 'text', required: true, limits: { maxChars: 180 }, guidance: 'Which segments beat, which missed, and how that ties to the flag.' },
    ],
  },
  {
    kind: 'winsLosses',
    purpose: 'Two columns — deals won and deals lost.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'wins', type: 'items', required: true, limits: { minItems: 2, maxItems: 4 }, guidance: 'Deals won; each has a name, a value, and a one-line note.' },
      { name: 'losses', type: 'items', required: true, limits: { minItems: 2, maxItems: 4 }, guidance: 'Deals lost; keep the count matched to wins so the two columns balance.' },
    ],
  },
  {
    kind: 'pipeline',
    purpose: 'The weighted pipeline table by stage.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'pipeline', type: 'tableRows', required: true, limits: { minItems: 3, maxItems: 6 }, guidance: 'Pipeline stages: stage, deal count, weighted value, coverage multiple.' },
      { name: 'pipelineNote', type: 'text', required: true, limits: { maxChars: 140 }, guidance: 'Coverage reading against the next-quarter target.' },
    ],
  },
  {
    kind: 'risks',
    purpose: 'Risks and mitigations table.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'risks', type: 'tableRows', required: true, limits: { minItems: 3, maxItems: 6 }, guidance: 'Each risk: a name, a severity (High | Medium | Low), and a mitigation.' },
    ],
  },
  {
    kind: 'priorities',
    purpose: 'The numbered next-quarter priorities.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'priorities', type: 'items', required: true, limits: { minItems: 3, maxItems: 5 }, guidance: 'Numbered priorities; each a short title (≤40 chars) and a one-line detail (≤160 chars).' },
    ],
  },
  {
    kind: 'appendix',
    purpose: 'The data-notes appendix declaring the figures synthetic.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'dataNotes', type: 'items', required: true, limits: { minItems: 2, maxItems: 6 }, guidance: 'Method notes; the first should declare every figure synthetic and illustrative.' },
    ],
  },
];

/** The craft guarantees the template makes and the descriptor advertises. */
export const QUARTER_GUIDANCE: string[] = [
  'Deliberately conventional slide anatomy: a persistent navy title bar, a 12-column content grid, a numbered agenda, and a footer rule — executed flawlessly, no world conceit.',
  'Exactly one KPI carries the off-track anomaly status: the single red figure in an otherwise green row, echoed verbatim in the executive summary.',
  'The synthetic-data notice is required and prints on the footer rule of every slide.',
  'Restrained single fade/rise motion (motionLevel 1); the mood is locked light.',
  'Slot char caps and item counts are sized so any schema-valid fill stays composed — headlines never overflow and grids stay balanced.',
];
