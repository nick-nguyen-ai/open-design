/**
 * The typed **fill** for "The T-Minus" world-template.
 *
 * The template (`TMinusTemplate.tsx`) carries the whole craft — the countdown
 * sequence (the monumental T-minus stamp + the rising amber horizon that reaches
 * the top and turns GO-green at T-0), the day-0 runbook timeline (local SVG) with
 * its hidden ordered-list mirror, the readiness board, the motion, and the
 * chrome. This file carries only the CONTENT contract: a Zod schema whose limits
 * are derived from the shipped instance's real magnitudes plus ~30% headroom, so
 * that ANY schema-valid fill still yields a composed, non-broken deck (headlines
 * cannot overflow their frames; item counts keep the runbook rail, the price
 * grid, and the readiness board balanced).
 *
 * Two craft slots are mandatory: exactly one readiness gate carries the `warning`
 * status — the single flagged blocker still standing between the team and go, its
 * verbatim text echoed in `anomalyLabel` — and the synthetic-launch notice string.
 *
 * `TMINUS_SECTIONS` re-states the same slots as the registry-serializable
 * `SectionSpec[]` the world-template descriptor advertises.
 */
import { z } from 'zod';
import type { SectionSpec } from '@enterprise-design/contracts';

const KpiUnit = z.enum(['currency', 'percent', 'count', 'ratio']);
const KpiStatus = z.enum(['on-track', 'at-risk', 'off-track', 'neutral']);
const GateStatus = z.enum(['success', 'warning', 'danger', 'info', 'neutral']);

/* ------------------------------------------------------------------ */
/* Fill schema — content slots only                                    */
/* ------------------------------------------------------------------ */

/** Deck meta — the launch-control chrome and the required synthetic notice. */
const DeckMeta = z.object({
  code: z.string().min(1).max(24),
  world: z.string().min(1).max(24),
  product: z.string().min(1).max(28),
  programme: z.string().min(1).max(48),
  war: z.string().min(1).max(40),
  /** REQUIRED craft slot: the synthetic-launch notice printed on every slide foot. */
  notice: z.string().min(1).max(56),
});

const Fact = z.object({
  stat: z.string().min(1).max(16),
  cap: z.string().min(1).max(40),
});

/** A launch-readiness gate (comp.status-list item). Exactly one carries `warning`. */
const Gate = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(28),
  status: GateStatus,
  description: z.string().min(1).max(140),
});

const CommsLine = z.object({
  id: z.string().min(1),
  channel: z.string().min(1).max(28),
  moment: z.string().min(1).max(24),
  detail: z.string().min(1).max(96),
});

const PriceTier = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(20),
  price: z.string().min(1).max(16),
  unit: z.string().min(1).max(24),
  includes: z.string().min(1).max(78),
  feature: z.boolean(),
});

const RunStep = z.object({
  id: z.string().min(1),
  time: z.string().min(1).max(12),
  label: z.string().min(1).max(20),
  detail: z.string().min(1).max(72),
  /** The go/no-go gate step — rendered as the pivotal diamond marker. */
  gate: z.boolean().optional(),
});

const AbortTrigger = z.object({
  id: z.string().min(1),
  metric: z.string().min(1).max(44),
  threshold: z.string().min(1).max(32),
  action: z.string().min(1).max(80),
});

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

export const TMinusFill = z.object({
  deck: DeckMeta,
  /** The cover framing — the two-line display and the launch standfirst. */
  cover: z.object({
    line1: z.string().min(1).max(32),
    line2: z.string().min(1).max(32),
    standfirst: z.string().min(1).max(200),
  }),
  /** The product in one sentence, plus three proof facts. */
  oneSentence: z.object({
    lead: z.string().min(1).max(32),
    sentence: z.string().min(1).max(208),
    facts: z.array(Fact).min(2).max(4),
  }),
  /** The launch thesis — two display lines and a paragraph. */
  thesis: z.object({
    line1: z.string().min(1).max(24),
    line2: z.string().min(1).max(24),
    standfirst: z.string().min(1).max(350),
  }),
  /**
   * The editorial slide headlines — the deck's voice, one per content slide.
   * These are CONTENT (they assert things about the fill's facts — gate
   * counts, price shape, metric counts), so they live in the fill, not the
   * template.
   */
  headlines: z.object({
    readiness: z.string().min(1).max(64),
    comms: z.string().min(1).max(64),
    pricing: z.string().min(1).max(64),
    runbook: z.string().min(1).max(64),
    risk: z.string().min(1).max(64),
    metrics: z.string().min(1).max(64),
  }),
  /**
   * The readiness board (comp.status-list). Exactly one gate carries the
   * `warning` status — the single flagged blocker still holding the clock.
   */
  gates: z
    .array(Gate)
    .min(3)
    .max(7)
    .refine((rows) => rows.filter((g) => g.status === 'warning').length === 1, {
      message: 'Exactly one readiness gate must carry the "warning" flagged-blocker status.',
    }),
  /** REQUIRED verbatim flag, echoed on the readiness board and in the a11y summary. */
  anomalyLabel: z.string().min(1).max(48),
  /** Continues the HOLD callout after the flag: what unblocks the amber gate. */
  anomalyNote: z.string().min(1).max(120),
  comms: z.array(CommsLine).min(3).max(7),
  pricing: z.array(PriceTier).min(2).max(4),
  /** The day-0 runbook — the commanding horizontal sequence. */
  runbook: z.array(RunStep).min(5).max(12),
  /** The paragraph under the rail — the day read as one story. */
  runbookNote: z.string().min(1).max(300),
  aborts: z.array(AbortTrigger).min(2).max(6),
  rollbackNote: z.string().min(1).max(260),
  metrics: z.array(Kpi).min(3).max(6),
  metricsNote: z.string().min(1).max(220),
  /** The closing T-0 GO slide. */
  closing: z.object({
    word: z.string().min(1).max(8),
    line: z.string().min(1).max(60),
    detail: z.string().min(1).max(184),
    decisions: z.array(z.string().min(1).max(90)).min(2).max(5),
  }),
});

export type TMinusFill = z.infer<typeof TMinusFill>;
export type TMinusGate = z.infer<typeof Gate>;
export type TMinusRunStep = z.infer<typeof RunStep>;

/* ------------------------------------------------------------------ */
/* Slot specs — the registry-serializable descriptor view             */
/* ------------------------------------------------------------------ */

export const TMINUS_SECTIONS: SectionSpec[] = [
  {
    kind: 'title',
    purpose: 'The countdown cover — product, programme, the two-line launch display, and the notice.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'deck.code', type: 'text', required: true, limits: { maxChars: 24 }, guidance: 'The short launch code shown first on the chrome, e.g. "LAUNCH-04".' },
      { name: 'deck.world', type: 'text', required: true, limits: { maxChars: 24 }, guidance: 'The world name paired with the code on the chrome and browser title, e.g. "T-MINUS".' },
      { name: 'deck.product', type: 'text', required: true, limits: { maxChars: 28 }, guidance: 'The product being launched, set large on the cover, e.g. "MERIDIAN INSTANT".' },
      { name: 'deck.programme', type: 'text', required: true, limits: { maxChars: 48 }, guidance: 'The programme line above the cover title, e.g. "REAL-TIME BUSINESS PAYMENTS · GO-LIVE".' },
      { name: 'deck.war', type: 'text', required: true, limits: { maxChars: 40 }, guidance: 'The launch-control room line shown on kicker rows, e.g. "LAUNCH CONTROL · SEQUENCE 04".' },
      { name: 'deck.notice', type: 'text', required: true, limits: { maxChars: 56 }, guidance: 'REQUIRED synthetic-launch notice printed on every slide foot and the footer, e.g. "SYNTHETIC LAUNCH PLAN — DEMONSTRATION ONLY".' },
      { name: 'cover.line1', type: 'text', required: true, limits: { maxChars: 32 }, guidance: 'First display line of the cover thesis, e.g. "A launch is a".' },
      { name: 'cover.line2', type: 'text', required: true, limits: { maxChars: 32 }, guidance: 'Second display line — the accented turn, e.g. "countdown, not a date.".' },
      { name: 'cover.standfirst', type: 'longtext', required: true, limits: { maxChars: 200 }, guidance: 'One paragraph framing the countdown to go-live and the one gate still standing amber.' },
    ],
  },
  {
    kind: 'one-sentence',
    purpose: 'The product in one sentence, with three proof facts.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'oneSentence.lead', type: 'text', required: true, limits: { maxChars: 32 }, guidance: 'The eyebrow above the one-liner, e.g. "What we are launching".' },
      { name: 'oneSentence.sentence', type: 'longtext', required: true, limits: { maxChars: 208 }, guidance: 'The whole product in one sentence — the promise the launch has to keep.' },
      { name: 'oneSentence.facts', type: 'items', required: true, limits: { minItems: 2, maxItems: 4 }, guidance: 'Two-to-four proof facts; each a short stat (≤16 chars) and a caption (≤40 chars).' },
    ],
  },
  {
    kind: 'thesis',
    purpose: 'The launch thesis — a monumental two-line statement and a paragraph.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'thesis.line1', type: 'text', required: true, limits: { maxChars: 24 }, guidance: 'First display line of the thesis, e.g. "Speed is the".' },
      { name: 'thesis.line2', type: 'text', required: true, limits: { maxChars: 24 }, guidance: 'Second, accented display line, e.g. "whole product.".' },
      { name: 'thesis.standfirst', type: 'longtext', required: true, limits: { maxChars: 350 }, guidance: 'One paragraph on the single promise the launch protects on day zero.' },
    ],
  },
  {
    kind: 'readiness',
    purpose: 'The launch-readiness board (comp.status-list); exactly one gate is flagged.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'headlines.readiness', type: 'text', required: true, limits: { maxChars: 64 }, guidance: 'Editorial headline for the readiness board; must be true of the gates you supply, e.g. "Five gates. Four are green.".' },
      { name: 'gates', type: 'items', required: true, limits: { minItems: 3, maxItems: 7 }, guidance: 'Three-to-seven readiness gates (id, label, status success|warning|danger|info|neutral, description). Exactly ONE carries status "warning" — the single flagged blocker still standing between the team and go.' },
      { name: 'anomalyLabel', type: 'text', required: true, limits: { maxChars: 48 }, guidance: 'REQUIRED verbatim flag for the blocked gate, echoed under the board, e.g. "SECURITY REVIEW PENDING — BLOCKS T-7".' },
      { name: 'anomalyNote', type: 'text', required: true, limits: { maxChars: 120 }, guidance: 'Continues the HOLD callout after the flag: what unblocks the amber gate, e.g. "the retest is booked; sign-off is the single thing between amber and go.".' },
    ],
  },
  {
    kind: 'comms',
    purpose: 'The comms & channel plan — who hears the launch, and when.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'headlines.comms', type: 'text', required: true, limits: { maxChars: 64 }, guidance: 'Editorial headline for the comms plan, e.g. "Nobody hears it before the right people do.".' },
      { name: 'comms', type: 'items', required: true, limits: { minItems: 3, maxItems: 7 }, guidance: 'Three-to-seven comms lines; each a channel, a moment (e.g. "T-0, at GA"), and a one-line detail.' },
    ],
  },
  {
    kind: 'pricing',
    purpose: 'Pricing & packaging — the tiers, one flagged as the launch focus.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'headlines.pricing', type: 'text', required: true, limits: { maxChars: 64 }, guidance: 'Editorial headline for pricing & packaging; must match the tier shape you supply, e.g. "One flat price does most of the selling.".' },
      { name: 'pricing', type: 'items', required: true, limits: { minItems: 2, maxItems: 4 }, guidance: 'Two-to-four price tiers; each a name, price, unit, an includes line, and a boolean "feature" (the launch-focus card).' },
    ],
  },
  {
    kind: 'runbook',
    purpose: 'The day-0 runbook — the commanding horizontal sequence with a go/no-go gate.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'headlines.runbook', type: 'text', required: true, limits: { maxChars: 64 }, guidance: 'Editorial headline for the day-0 sequence, e.g. "Launch day, hour by hour.".' },
      { name: 'runbook', type: 'items', required: true, limits: { minItems: 5, maxItems: 12 }, guidance: 'Five-to-twelve ordered runbook steps (id, time, label, detail); mark exactly the go/no-go step with gate:true so it renders as the pivotal diamond. The slide kicker derives from these: "ONE DAY · {first step time} → {last step label}".' },
      { name: 'runbookNote', type: 'longtext', required: true, limits: { maxChars: 300 }, guidance: 'The paragraph under the rail — the day read as one story: the single go/no-go, what is reversible, and until when.' },
    ],
  },
  {
    kind: 'risk',
    purpose: 'Abort triggers and the one-switch rollback.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'headlines.risk', type: 'text', required: true, limits: { maxChars: 64 }, guidance: 'Editorial headline for risk & rollback, e.g. "What stops the clock — and how fast we’re back.".' },
      { name: 'aborts', type: 'tableRows', required: true, limits: { minItems: 2, maxItems: 6 }, guidance: 'Abort-trigger rows: a signal metric, an abort threshold, and the action taken.' },
      { name: 'rollbackNote', type: 'longtext', required: true, limits: { maxChars: 260 }, guidance: 'One paragraph on how fast the one-switch rollback returns to today’s rails.' },
    ],
  },
  {
    kind: 'metrics',
    purpose: 'The launch metrics row (comp.kpi-tile) — day 7 and day 30.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'headlines.metrics', type: 'text', required: true, limits: { maxChars: 64 }, guidance: 'Editorial headline for the metrics row; must be true of the KPIs you supply, e.g. "Four numbers tell us it worked.".' },
      { name: 'metrics', type: 'metric', required: true, limits: { minItems: 3, maxItems: 6 }, guidance: 'Three-to-six launch KPIs (day-7 / day-30); each a label, value, unit, and status. Values with unit "percent" are FRACTIONS: 0.8 renders as 80.0%, never 80.' },
      { name: 'metricsNote', type: 'text', required: true, limits: { maxChars: 220 }, guidance: 'One-line reading of the metrics row — the committed targets and the trailing figure.' },
    ],
  },
  {
    kind: 'closing',
    purpose: 'The T-0 GO slide — the word, the line, and the decisions needed today.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'closing.word', type: 'text', required: true, limits: { maxChars: 8 }, guidance: 'The monumental closing word, e.g. "GO".' },
      { name: 'closing.line', type: 'text', required: true, limits: { maxChars: 60 }, guidance: 'The closing headline, e.g. "On the readiness board, one gate stays amber.".' },
      { name: 'closing.detail', type: 'longtext', required: true, limits: { maxChars: 184 }, guidance: 'One paragraph stating what clears the last gate and unblocks go.' },
      { name: 'closing.decisions', type: 'items', required: true, limits: { minItems: 2, maxItems: 5 }, guidance: 'Two-to-five decisions the go/no-go needs today; each ≤90 chars.' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Standard certifier aliases (Task 5)                                 */
/*                                                                     */
/* The data-driven certifier resolves a world's contract by these      */
/* convention names, so no per-world test boilerplate is needed.       */
/* ------------------------------------------------------------------ */

/** The world's fill Zod schema, by the certifier's standard name. */
export const FILL_SCHEMA = TMinusFill;
/** The registry-serializable section specs, by the certifier's standard name. */
export const SECTIONS = TMINUS_SECTIONS;

/** The craft guarantees the template makes and the descriptor advertises. */
export const TMINUS_GUIDANCE: string[] = [
  'A launch plan staged as a COUNTDOWN SEQUENCE: every slide carries a monumental T-minus stamp (T-30 → T-0) over a midnight field, with a single thin amber horizon line that RISES slide by slide and, at T-0, reaches the top as the field turns GO-green.',
  'Exactly one readiness gate carries the "warning" flagged-blocker status: the single amber square in an otherwise green board, its verbatim text echoed in anomalyLabel under the board and in the accessible summary.',
  'The synthetic-launch notice is required and prints on every slide’s print foot and the footer.',
  'The day-0 runbook is the commanding bespoke visual — a local SVG rail with a go/no-go diamond gate — and exposes a hidden ordered-list mirror derived from the same runbook data.',
  'Slot char caps and item counts are sized so any schema-valid fill stays composed — the runbook rail, the price grid, and the readiness board stay balanced and headlines never overflow.',
  'Motion level 2 (staggered build + horizon-sweep); the mood is locked dark.',
];
