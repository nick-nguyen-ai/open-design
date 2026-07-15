/**
 * The typed **fill** for "The Validation Ledger" world-template — the first (and
 * currently only) PROJECT-PAGE world-template the MCP can compose.
 *
 * The template (`LedgerTemplate.tsx`) carries the whole craft — the programme
 * office in daylight: the bespoke pipeline ledger (nine models on the road from
 * intake to sign-off, revealed in reading order, with the one stalled item the
 * page is arranged around), the sticky office chrome with its letter-coded RAG
 * posture, the textual ledger mirror, the programme-posture band (KPI gauges +
 * throughput exhibit), the recent-outcomes evidence table, and the decision log
 * & programme wire. This file carries only the CONTENT contract: a Zod schema
 * whose limits are derived from the shipped instance's real magnitudes plus
 * ~30% headroom, so ANY schema-valid fill still yields a composed, non-broken
 * page (the display statement never overflows, the ledger track stays balanced,
 * the tables stay legible).
 *
 * THE PIPELINE IS FIXED-SLOT. The ledger track and the stage-head band are a
 * template-fixed four-column grid (`repeat(4, …)`), so the schema PINS the stage
 * id set to exactly the shipped four validation stages (intake, challenge,
 * independent review, sign-off) — a fill re-labels the stages and re-writes
 * their exit rules and flow captions, but cannot add a fifth column the grid has
 * nowhere to place. The throughput exhibit is likewise pinned to its two fixed
 * series ids (intake / signed-off) so the dashed-intake encoding always lands.
 * Honest bounds beat pretend flexibility.
 *
 * Two craft slots are mandatory: exactly ONE ledger model carries `status:
 * 'stalled'` — the single flagged item held past the stall threshold that the
 * whole page is arranged around (its stall note on the track, its flagged row in
 * the mirror table) — and the synthetic-data provenance notice
 * (`office.editionLine`) printed in the footer.
 *
 * `LEDGER_SECTIONS` re-states the same slots as the registry-serializable
 * `SectionSpec[]` the world-template descriptor advertises.
 */
import { z } from 'zod';
import type { SectionSpec } from '@enterprise-design/contracts';

/* ------------------------------------------------------------------ */
/* Fixed-slot id vocabularies (template-owned geometry keys)           */
/*                                                                      */
/* The ledger track + stage-head band are a fixed four-column grid and  */
/* the throughput exhibit a fixed two-series chart; the schema pins each */
/* collection's id set to its list so every fixed slot is filled and no  */
/* fill can reference geometry the template has not drawn.               */
/* ------------------------------------------------------------------ */

export const LEDGER_STAGE_IDS = ['intake', 'challenge', 'review', 'sign-off'] as const;
export const LEDGER_THROUGHPUT_IDS = ['intake', 'signed-off'] as const;

/** Refine: the array's `id`s are exactly `ids` (order-independent, no dupes). */
function exactIdSet<T extends readonly string[]>(ids: T) {
  const want = [...ids].sort();
  return (rows: readonly { id: string }[]): boolean => {
    const got = rows.map((r) => r.id).sort();
    return got.length === want.length && got.every((id, i) => id === want[i]);
  };
}

/* ------------------------------------------------------------------ */
/* Shared vocabularies                                                 */
/* ------------------------------------------------------------------ */

/** A ledger model's disposition — exactly one is the flagged `stalled` item. */
const LedgerStatus = z.enum(['moving', 'stalled']);
/** The flow-node kind each pipeline stage draws in the stage-key outline. */
const FlowKind = z.enum(['start', 'process', 'decision', 'data', 'end']);
/** A validation disposition — the recent-outcomes vocabulary. */
const Outcome = z.enum(['approved', 'approved-with-conditions', 'rejected']);
/** KpiTile status vocabulary (comp.kpi-tile). */
const KpiStatus = z.enum(['on-track', 'at-risk', 'off-track', 'neutral']);
/** KpiTile unit vocabulary — `percent` values are FRACTIONS (0.87 → 87.0%). */
const KpiUnit = z.enum(['currency', 'percent', 'count', 'ratio']);
/** StatusList status vocabulary (comp.status-list). */
const WireStatus = z.enum(['success', 'warning', 'danger', 'info', 'neutral']);
/** A model tier — 1 (highest scrutiny) to 3. */
const Tier = z.union([z.literal(1), z.literal(2), z.literal(3)]);

/* ------------------------------------------------------------------ */
/* Fill schema — content slots only                                    */
/* ------------------------------------------------------------------ */

/** The programme office identity — sticky chrome, footer, and the REQUIRED notice. */
const Office = z.object({
  /** The document.title stem (assigned in JS); the template appends " — Live". */
  pageTitle: z.string().min(1).max(66),
  programmeCode: z.string().min(1).max(14),
  programmeName: z.string().min(1).max(34),
  reportingPeriod: z.string().min(1).max(42),
  /** RAG posture letter — the encoding is the letter, never colour alone. */
  rag: z.string().min(1).max(10),
  ragReason: z.string().min(1).max(50),
  /** REQUIRED provenance notice: printed in the footer edition line. */
  editionLine: z.string().min(1).max(60),
  director: z.string().min(1).max(40),
  issued: z.string().min(1).max(24),
});

/** A programme fact — a label/value pair in the hero definition list. */
const ProgrammeFact = z.object({
  label: z.string().min(1).max(24),
  value: z.string().min(1).max(16),
});

const Hero = z.object({
  /** The hero eyebrow stem; the template appends " · {office.reportingPeriod}". */
  kicker: z.string().min(1).max(30),
  /** The display statement — one line per array entry (rendered as broken lines). */
  statementLines: z.array(z.string().min(1).max(44)).min(2).max(4),
  subline: z.string().min(1).max(230),
  facts: z.array(ProgrammeFact).min(3).max(7),
});

/** A pipeline stage — a fixed track column and a stage-key outline node. */
const PipelineStage = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(28),
  /** What has to be true to leave this stage (rendered "EXIT — {exitRule}"). */
  exitRule: z.string().min(1).max(52),
  /** The stage's flow-node kind in the stage-key outline. */
  flowKind: FlowKind,
  /**
   * The label of the flow edge ENTERING this stage (the transition from the
   * previous stage). Required on every stage after the first; the first (intake)
   * stage has no inbound edge and omits it.
   */
  flowInboundLabel: z.string().min(1).max(32).optional(),
});

/** A ledger model — a track row and a row in the textual mirror table. */
const LedgerModel = z.object({
  id: z.string().min(1),
  model: z.string().min(1).max(34),
  version: z.string().min(1).max(16),
  tier: Tier,
  owner: z.string().min(1).max(40),
  /** The stage id the model currently sits in (one of the pinned stage ids). */
  stage: z.string().min(1),
  daysInStage: z.number().int().nonnegative().max(999),
  enteredStage: z.string().min(1).max(14),
  targetSignOff: z.string().min(1).max(14),
  /** STRUCTURAL flag: exactly one model is `stalled` (never a text match). */
  status: LedgerStatus,
  /** The stall detail — present iff status is `stalled`; drives the stall note. */
  stall: z
    .object({
      reason: z.string().min(1).max(100),
      escalation: z.string().min(1).max(104),
    })
    .optional(),
});

/** The pinned stage id set, for cross-field `model.stage` validation. */
const STAGE_ID_SET: ReadonlySet<string> = new Set(LEDGER_STAGE_IDS);

const Pipeline = z.object({
  bandTitle: z.string().min(1).max(28),
  bandSub: z.string().min(1).max(78),
  /** The stage-head lead label above the model column, e.g. "MODEL · TIER · OWNER". */
  rowLegend: z.string().min(1).max(28),
  /** Days-in-stage beyond which the office calls a model stalled. */
  stallThresholdDays: z.number().int().positive().max(365),
  /** The full accessible caption of the aria-hidden pipeline ledger. */
  a11yCaption: z.string().min(1).max(360),
  /** The stage-key note stem; the template appends " {stallThresholdDays} DAYS". */
  stageKeyNote: z.string().min(1).max(130),
  /**
   * The four validation stages. FIXED-SLOT: ids must be exactly the shipped set
   * (the ledger track is a template-fixed four-column grid). Read left-to-right
   * in array order; every stage after the first carries a flowInboundLabel.
   */
  stages: z
    .array(PipelineStage)
    .refine(exactIdSet(LEDGER_STAGE_IDS), {
      message: `pipeline.stages ids must be exactly the fixed pipeline set: ${LEDGER_STAGE_IDS.join(', ')}.`,
    })
    .superRefine((rows, ctx) => {
      rows.forEach((stage, i) => {
        if (i > 0 && !stage.flowInboundLabel) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `pipeline.stages "${stage.id}": every stage after the first must carry a flowInboundLabel (the entering transition label).`,
          });
        }
      });
    }),
  /**
   * The models in flight. Exactly ONE carries status "stalled" — the single
   * flagged item held past the stall threshold that the page is arranged around.
   * Each model's `stage` must be one of the pinned stage ids.
   */
  models: z
    .array(LedgerModel)
    .min(6)
    .max(12)
    .refine((rows) => rows.filter((m) => m.status === 'stalled').length === 1, {
      message: 'Exactly one ledger model must carry status "stalled" (the single flagged item the page is arranged around).',
    })
    .superRefine((rows, ctx) => {
      for (const model of rows) {
        if (!STAGE_ID_SET.has(model.stage)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `pipeline.models "${model.id}": stage "${model.stage}" is not one of the fixed pipeline stage ids (${LEDGER_STAGE_IDS.join(', ')}).`,
          });
        }
        if (model.status === 'stalled' && !model.stall) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `pipeline.models "${model.id}": a stalled model must carry a stall note (reason + escalation).`,
          });
        }
      }
    }),
});

/** The §2 textual ledger mirror — band furniture + accessible caption only. */
const LedgerTable = z.object({
  bandTitle: z.string().min(1).max(32),
  bandSub: z.string().min(1).max(36),
  caption: z.string().min(1).max(200),
});

/** A daily/periodic throughput series — a fixed-id line on the exhibit. */
const ThroughputSeries = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(34),
  points: z.array(z.object({ x: z.string().min(1).max(12), y: z.number().nonnegative().max(1000) })).min(8).max(16),
});

/** A programme KPI gauge (comp.kpi-tile). */
const Kpi = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(44),
  value: z.number(),
  unit: KpiUnit.optional(),
  delta: z.number().optional(),
  deltaGoodDirection: z.enum(['up', 'down']).optional(),
  target: z.number().optional(),
  status: KpiStatus,
});

const Exhibit = z.object({
  number: z.string().min(1).max(14),
  title: z.string().min(1).max(74),
  source: z.string().min(1).max(140),
  caption: z.string().min(1).max(200),
});

const Posture = z.object({
  bandTitle: z.string().min(1).max(26),
  bandSub: z.string().min(1).max(60),
  /** The KPI tile's accessible title. */
  kpiTitle: z.string().min(1).max(26),
  kpis: z.array(Kpi).min(3).max(6),
  exhibit: Exhibit,
  /**
   * The throughput exhibit's two lines. FIXED-SLOT: ids must be exactly the
   * shipped set (intake, signed-off) — the intake line draws dashed by id.
   */
  throughput: z
    .array(ThroughputSeries)
    .refine(exactIdSet(LEDGER_THROUGHPUT_IDS), {
      message: `posture.throughput ids must be exactly the fixed series set: ${LEDGER_THROUGHPUT_IDS.join(', ')}.`,
    }),
});

/** A recent validation outcome — a row in the evidence table. */
const ValidationOutcome = z.object({
  ref: z.string().min(1).max(12),
  date: z.string().min(1).max(14),
  model: z.string().min(1).max(34),
  tier: Tier,
  outcome: Outcome,
  findings: z.number().int().nonnegative().max(99),
  validator: z.string().min(1).max(14),
});

const Outcomes = z.object({
  bandTitle: z.string().min(1).max(24),
  bandSub: z.string().min(1).max(54),
  caption: z.string().min(1).max(180),
  rows: z.array(ValidationOutcome).min(3).max(8),
});

/** A decision-log entry. */
const DecisionEntry = z.object({
  date: z.string().min(1).max(14),
  decision: z.string().min(1).max(104),
  owner: z.string().min(1).max(32),
  disposition: z.string().min(1).max(32),
});

/** A programme-wire item (comp.status-list). */
const WireItem = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(72),
  status: WireStatus,
  description: z.string().min(1).max(120).optional(),
  timestamp: z.string().min(1).max(32).optional(),
});

const Decisions = z.object({
  bandTitle: z.string().min(1).max(38),
  bandSub: z.string().min(1).max(60),
  decisionLogHeading: z.string().min(1).max(20),
  wireHeading: z.string().min(1).max(22),
  /** The status-list's accessible title. */
  wireTitle: z.string().min(1).max(22),
  log: z.array(DecisionEntry).min(3).max(7),
  wire: z.array(WireItem).min(3).max(7),
});

export const LedgerFill = z.object({
  office: Office,
  hero: Hero,
  pipeline: Pipeline,
  table: LedgerTable,
  posture: Posture,
  outcomes: Outcomes,
  decisions: Decisions,
});

export type LedgerFill = z.infer<typeof LedgerFill>;
export type LedgerModel = z.infer<typeof LedgerModel>;
export type LedgerStage = z.infer<typeof PipelineStage>;
export type LedgerOutcome = z.infer<typeof Outcome>;
export type LedgerTier = z.infer<typeof Tier>;

/* ------------------------------------------------------------------ */
/* Slot specs — the registry-serializable descriptor view             */
/* ------------------------------------------------------------------ */

export const LEDGER_SECTIONS: SectionSpec[] = [
  {
    kind: 'office',
    purpose:
      'The programme-office identity — the sticky top chrome, the letter-coded RAG posture, the footer edition line, and the required provenance notice.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'office.pageTitle', type: 'text', required: true, limits: { maxChars: 66 }, guidance: 'The browser-tab title stem (assigned in JS, derived byte-identically; the template appends " — Live"), e.g. "The Validation Ledger — Model Validation Programme".' },
      { name: 'office.programmeCode', type: 'text', required: true, limits: { maxChars: 14 }, guidance: 'The programme code on the top chrome, e.g. "MVP-2026".' },
      { name: 'office.programmeName', type: 'text', required: true, limits: { maxChars: 34 }, guidance: 'The programme name on the top chrome, e.g. "MODEL VALIDATION PROGRAMME".' },
      { name: 'office.reportingPeriod', type: 'text', required: true, limits: { maxChars: 42 }, guidance: 'The reporting period on the chrome and hero kicker, e.g. "PERIOD 07 · 29 JUN – 12 JUL 2026".' },
      { name: 'office.rag', type: 'text', required: true, limits: { maxChars: 10 }, guidance: 'The RAG posture letter (the encoding is the letter, never colour alone), e.g. "AMBER".' },
      { name: 'office.ragReason', type: 'text', required: true, limits: { maxChars: 50 }, guidance: 'The one-line reason for the RAG posture, e.g. "ONE ITEM STALLED IN INDEPENDENT REVIEW".' },
      { name: 'office.editionLine', type: 'text', required: true, limits: { maxChars: 60 }, guidance: 'REQUIRED provenance notice printed in the footer; must state the data is synthetic/sourced, e.g. "PROGRAMME OFFICE · SYNTHETIC DEMONSTRATION DATA".' },
      { name: 'office.director', type: 'text', required: true, limits: { maxChars: 40 }, guidance: 'The signing programme director in the footer, e.g. "H. NGUYEN, PROGRAMME DIRECTOR".' },
      { name: 'office.issued', type: 'text', required: true, limits: { maxChars: 24 }, guidance: 'The issue stamp in the footer, e.g. "ISSUED 2026-07-12".' },
    ],
  },
  {
    kind: 'hero',
    purpose: 'The editorial hero — the kicker, the multi-line display statement, the one-line subline, and the programme facts.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'hero.kicker', type: 'text', required: true, limits: { maxChars: 30 }, guidance: 'The hero eyebrow stem; the template appends " · {office.reportingPeriod}", e.g. "THE VALIDATION LEDGER".' },
      { name: 'hero.statementLines', type: 'items', required: true, limits: { minItems: 2, maxItems: 4, maxChars: 44 }, guidance: 'Two-to-four display lines (one per array entry, rendered as broken lines) building the programme thesis, e.g. "A model is an opinion" / "until the ledger says otherwise.".' },
      { name: 'hero.subline', type: 'longtext', required: true, limits: { maxChars: 230 }, guidance: 'One reading of the period under the statement, naming the stalled item, e.g. "Twenty-eight models pass through this office in FY26. Nine are on the ledger this period. Eight are moving. One has stopped — and the whole page is arranged so you cannot miss it.".' },
      { name: 'hero.facts', type: 'items', required: true, limits: { minItems: 3, maxItems: 7 }, guidance: 'Three-to-seven programme facts (label, value) in the hero definition list, e.g. { label: "ON THE LEDGER", value: "9" }.' },
    ],
  },
  {
    kind: 'pipeline',
    purpose:
      'The commanding pipeline ledger — the four fixed validation stages and the models in flight, with the one stalled item flagged. The track and stage-head are a template-fixed four-column grid; the fill carries the content and pins the stage id set.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'pipeline.bandTitle', type: 'text', required: true, limits: { maxChars: 28 }, guidance: 'The §1 band heading, e.g. "THE PIPELINE LEDGER".' },
      { name: 'pipeline.bandSub', type: 'text', required: true, limits: { maxChars: 78 }, guidance: 'The §1 band sub-line, true of the ledger you supply, e.g. "NINE MODELS IN FLIGHT · READ LEFT TO RIGHT · ONE ITEM STALLED".' },
      { name: 'pipeline.rowLegend', type: 'text', required: true, limits: { maxChars: 28 }, guidance: 'The stage-head lead label above the model column, e.g. "MODEL · TIER · OWNER".' },
      { name: 'pipeline.stallThresholdDays', type: 'number', required: true, limits: {}, guidance: 'Days-in-stage beyond which the office calls a model stalled; drives the stall note and the over-threshold table mark, e.g. 25.' },
      { name: 'pipeline.a11yCaption', type: 'longtext', required: true, limits: { maxChars: 360 }, guidance: 'The full accessible caption of the aria-hidden ledger, naming the stalled model and pointing to the mirror table, e.g. "The pipeline ledger plots nine in-flight models across four validation stages … wholesale-credit-pd has been in independent review for 41 days against a 25-day stall threshold and is flagged as stalled. The table in section 2 carries every entry.".' },
      { name: 'pipeline.stageKeyNote', type: 'longtext', required: true, limits: { maxChars: 130 }, guidance: 'The stage-key note stem; the template appends " {stallThresholdDays} DAYS", e.g. "TRAIL = STAGES CLEARED · SQUARE = CURRENT STAGE, DAYS IN STAGE · HATCH + STALLED STAMP = CLOCK HELD BEYOND".' },
      { name: 'pipeline.stages', type: 'items', required: true, limits: { minItems: 4, maxItems: 4 }, guidance: `Exactly four validation stages, read left-to-right. FIXED-SLOT: ids must be exactly the shipped set (${LEDGER_STAGE_IDS.join(', ')}). Each: id, label, exitRule, flowKind (start|process|decision|data|end), and flowInboundLabel on every stage after the first, e.g. { id: "review", label: "INDEPENDENT REVIEW", exitRule: "All findings closed or accepted", flowKind: "decision", flowInboundLabel: "challenger result filed" }.` },
      { name: 'pipeline.models', type: 'tableRows', required: true, limits: { minItems: 6, maxItems: 12 }, guidance: 'Six-to-twelve models in flight (id, model, version, tier 1|2|3, owner, stage = one of the pinned stage ids, daysInStage, enteredStage, targetSignOff, status moving|stalled, and stall {reason, escalation} on the stalled model). Exactly ONE model is "stalled" — the single flagged item held past the threshold, e.g. wholesale-credit-pd in review at 41 days.' },
    ],
  },
  {
    kind: 'table',
    purpose: 'The §2 textual ledger mirror — the pipeline as a table (rendered from pipeline.models); this section carries only its band furniture and accessible caption.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'table.bandTitle', type: 'text', required: true, limits: { maxChars: 32 }, guidance: 'The §2 band heading, e.g. "THE LEDGER, LINE BY LINE".' },
      { name: 'table.bandSub', type: 'text', required: true, limits: { maxChars: 36 }, guidance: 'The §2 band sub-line, true of the ledger, e.g. "TEXTUAL MIRROR · 9 ENTRIES".' },
      { name: 'table.caption', type: 'longtext', required: true, limits: { maxChars: 200 }, guidance: 'The accessible caption of the mirror table naming its columns, e.g. "The pipeline ledger as a table: nine models with version, tier, owner, current stage, days in stage, date entered, target sign-off, and any stall note.".' },
    ],
  },
  {
    kind: 'posture',
    purpose: 'The §3 programme-posture band — the KPI gauges and the throughput exhibit, subordinate to the ledger.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'posture.bandTitle', type: 'text', required: true, limits: { maxChars: 26 }, guidance: 'The §3 band heading, e.g. "PROGRAMME POSTURE".' },
      { name: 'posture.bandSub', type: 'text', required: true, limits: { maxChars: 60 }, guidance: 'The §3 band sub-line, e.g. "PROGRESS & STATUS · SUBORDINATE TO THE LEDGER".' },
      { name: 'posture.kpiTitle', type: 'text', required: true, limits: { maxChars: 26 }, guidance: 'The KPI tile\'s accessible title, e.g. "Programme measures".' },
      { name: 'posture.kpis', type: 'metric', required: true, limits: { minItems: 3, maxItems: 6 }, guidance: 'Three-to-six programme gauges (id, label, value, unit currency|percent|count|ratio, optional target, status on-track|at-risk|off-track|neutral). Values with unit "percent" are FRACTIONS: 0.87 renders as 87.0%.' },
      { name: 'posture.exhibit.number', type: 'text', required: true, limits: { maxChars: 14 }, guidance: 'The exhibit label, e.g. "EXHIBIT A".' },
      { name: 'posture.exhibit.title', type: 'text', required: true, limits: { maxChars: 74 }, guidance: 'The exhibit title (chart accessible title stem), e.g. "Validation throughput against intake, last twelve periods".' },
      { name: 'posture.exhibit.source', type: 'longtext', required: true, limits: { maxChars: 140 }, guidance: 'The chart source note; state synthetic provenance, e.g. "Models entering the pipeline vs models signed off, per four-week reporting period. Synthetic demonstration data.".' },
      { name: 'posture.exhibit.caption', type: 'longtext', required: true, limits: { maxChars: 200 }, guidance: 'The exhibit figcaption reading the chart, e.g. "Sign-off throughput has closed most of the gap intake opened in the autumn; the backlog the office carries is the area between the lines.".' },
      { name: 'posture.throughput', type: 'items', required: true, limits: { minItems: 2, maxItems: 2 }, guidance: `The two throughput lines. FIXED-SLOT: ids must be exactly the shipped set (${LEDGER_THROUGHPUT_IDS.join(', ')}) — the "intake" line draws dashed by id. Each: id, label, points (8–16 { x period, y count }), e.g. { id: "signed-off", label: "Models signed off", points: [{ x: "2026·P07", y: 3 }] }.` },
    ],
  },
  {
    kind: 'outcomes',
    purpose: 'The §4 recent-outcomes evidence table — the last dispositions on file.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'outcomes.bandTitle', type: 'text', required: true, limits: { maxChars: 24 }, guidance: 'The §4 band heading, e.g. "RECENT OUTCOMES".' },
      { name: 'outcomes.bandSub', type: 'text', required: true, limits: { maxChars: 54 }, guidance: 'The §4 band sub-line, e.g. "LAST SIX DISPOSITIONS · EVIDENCE ON FILE".' },
      { name: 'outcomes.caption', type: 'longtext', required: true, limits: { maxChars: 180 }, guidance: 'The accessible caption of the outcomes table naming its columns, e.g. "Recent validation outcomes: reference, date, model, tier, outcome, findings raised, and validator.".' },
      { name: 'outcomes.rows', type: 'tableRows', required: true, limits: { minItems: 3, maxItems: 8 }, guidance: 'Three-to-eight outcome rows (ref, date, model, tier 1|2|3, outcome approved|approved-with-conditions|rejected, findings count, validator), newest first, e.g. { ref: "MV-26-081", date: "2026-07-04", model: "complaint-triage-nlp v2", tier: 3, outcome: "approved", findings: 2, validator: "R. OKONJO" }.' },
    ],
  },
  {
    kind: 'decisions',
    purpose: 'The §5 decision log & programme wire — what the office decided, and what the office heard.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'decisions.bandTitle', type: 'text', required: true, limits: { maxChars: 38 }, guidance: 'The §5 band heading, e.g. "DECISION LOG & PROGRAMME WIRE".' },
      { name: 'decisions.bandSub', type: 'text', required: true, limits: { maxChars: 60 }, guidance: 'The §5 band sub-line, e.g. "WHAT THE OFFICE DECIDED · WHAT THE OFFICE HEARD".' },
      { name: 'decisions.decisionLogHeading', type: 'text', required: true, limits: { maxChars: 20 }, guidance: 'The decision-log panel heading, e.g. "DECISION LOG".' },
      { name: 'decisions.wireHeading', type: 'text', required: true, limits: { maxChars: 22 }, guidance: 'The programme-wire panel heading, e.g. "PROGRAMME WIRE".' },
      { name: 'decisions.wireTitle', type: 'text', required: true, limits: { maxChars: 22 }, guidance: 'The programme-wire status-list accessible title, e.g. "Programme wire".' },
      { name: 'decisions.log', type: 'items', required: true, limits: { minItems: 3, maxItems: 7 }, guidance: 'Three-to-seven decision entries (date, decision, owner, disposition), newest first, e.g. { date: "2026-07-08", decision: "Escalate wholesale-credit-pd lineage gap to programme sponsor; hold review clock.", owner: "H. NGUYEN", disposition: "ESCALATED · OPEN" }.' },
      { name: 'decisions.wire', type: 'items', required: true, limits: { minItems: 3, maxItems: 7 }, guidance: 'Three-to-seven programme-wire items (id, label, status success|warning|danger|info|neutral, optional description, optional ISO timestamp), newest first.' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Standard certifier aliases (Task 5)                                 */
/* ------------------------------------------------------------------ */

/** The world's fill Zod schema, by the certifier's standard name. */
export const FILL_SCHEMA = LedgerFill;
/** The registry-serializable section specs, by the certifier's standard name. */
export const SECTIONS = LEDGER_SECTIONS;

/** The craft guarantees the template makes and the descriptor advertises. */
export const LEDGER_GUIDANCE: string[] = [
  'A model-validation programme hub staged as a PROGRAMME OFFICE IN DAYLIGHT — a well-edited board paper crossed with a working ledger: cool porcelain paper, near-black ink, hairline rules, tabular numerals, one registrar\'s green for progress and one dry sienna reserved for the stalled item alone.',
  'The commanding visual is the PIPELINE LEDGER: every in-flight model placed on the road from intake to sign-off across four validation stages, revealed in reading order. THE PIPELINE IS FIXED-SLOT — the track and stage-head are a template-fixed four-column grid, so the schema pins the stage id set to exactly the four shipped stages (intake, challenge, independent review, sign-off); a fill re-labels the stages and rewrites their exit rules and flow captions but cannot add a column the grid has nowhere to place. Any schema-valid fill renders composed.',
  'Exactly one ledger model carries status "stalled": the single flagged item held past the stall threshold that the whole page is arranged around — marked with the sienna stall stamp and stall note on the track, and the flagged row of the textual mirror table. The flag is STRUCTURAL (a status field the schema requires exactly one of), never a match on free-form text.',
  'The pipeline ledger is decorative (aria-hidden); the REAL content is the visible §2 mirror TABLE — the ledger line by line — so the world is fully legible without the track. The stage-key outline and the accessible caption name the stalled model and point to the table.',
  'The synthetic-data provenance notice (office.editionLine) is required and prints in the footer edition line; the hero subline and chart sources reinforce the synthetic magnitudes.',
  'The RAG posture is letter-coded (the letter is the encoding, never colour alone). The throughput exhibit is pinned to its two fixed series ids (intake, signed-off) so the dashed-intake line always lands; percent KPI values are fractions (0.87 → 87.0%).',
  'Slot char caps and item counts are sized so any schema-valid fill stays composed — the display statement never overflows, the ledger track and the mirror table stay balanced, and the decision log and wire stay legible. Motion level 1 (LedgerReveal in reading order); the mood is locked light.',
];
