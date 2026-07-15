/**
 * The typed **fill** for "The Cockpit" world-template — the first NON-DECK
 * (dashboard) world-template the MCP can compose.
 *
 * The template (`CockpitTemplate.tsx`, with the bespoke `DriftScope.tsx` it
 * imports) carries the whole craft — the radial DRIFT SCOPE instrument (the
 * commanding visual: every model placed at its drift-severity radius inside its
 * business-line sector, threshold rings, a phosphor sweep, the single breaching
 * contact with its crosshair + callout), the dealing-floor chrome (watch clock,
 * hold-sweep control), the detail band beneath (the watchlist table that mirrors
 * the scope, the breaching model's dossier, the overnight log, the fleet gauges),
 * the motion, and the locked dark theme. This file carries only the CONTENT
 * contract: a Zod schema whose limits are derived from the shipped instance's
 * real magnitudes plus ~30% headroom, so that ANY schema-valid fill still yields
 * a composed, non-broken cockpit (statements never overflow, the watchlist and
 * the scope stay balanced, the dossier panels stay legible).
 *
 * Two craft slots are mandatory: exactly ONE fleet model carries the `breach`
 * status — the single flagged contact past its limit that "is why this room is
 * lit" — and the synthetic-data provenance notice (`watch.dataNotice`) printed
 * in the hero and the footer.
 *
 * `COCKPIT_SECTIONS` re-states the same slots as the registry-serializable
 * `SectionSpec[]` the world-template descriptor advertises.
 */
import { z } from 'zod';
import type { SectionSpec } from '@enterprise-design/contracts';

/* ------------------------------------------------------------------ */
/* Shared vocabularies                                                 */
/* ------------------------------------------------------------------ */

/** A contact's drift status — the scope's shape-coded state (never colour alone). */
const ContactStatus = z.enum(['stable', 'watch', 'breach']);
/** KpiTile status vocabulary (comp.kpi-tile). */
const KpiStatus = z.enum(['on-track', 'at-risk', 'off-track', 'neutral']);
/** KpiTile unit vocabulary — `percent` values are FRACTIONS (0.992 → 99.2%). */
const KpiUnit = z.enum(['currency', 'percent', 'count', 'ratio']);
/** StatusList status vocabulary (comp.status-list). */
const LogStatus = z.enum(['success', 'warning', 'danger', 'info', 'neutral']);

/**
 * The instrument's fixed PSI scale. The DriftScope maps PSI onto a graticule
 * whose outer ring is 0.34 and the trend chart's y-axis tops out at 0.35 —
 * both template-fixed geometry. Every PSI-valued slot is bounded to the scale
 * so a schema-valid fill can never pin contacts to the rim or clip the trend.
 */
const SCOPE_PSI_MAX = 0.34;
const TREND_PSI_MAX = 0.35;

/** A PSI value on the fixed 0–0.34 instrument scale. */
const ScopePsi = z.number().min(0).max(SCOPE_PSI_MAX);

/* ------------------------------------------------------------------ */
/* Fill schema — content slots only                                    */
/* ------------------------------------------------------------------ */

/** The watch chrome + the REQUIRED synthetic-data provenance notice. */
const Watch = z.object({
  /** The browser-tab title stem; the template appends the fixed " — Live" suffix. */
  pageTitle: z.string().min(1).max(46),
  commandLine: z.string().min(1).max(58),
  environment: z.string().min(1).max(12),
  refreshCadence: z.string().min(1).max(16),
  lastRefresh: z.string().min(1).max(28),
  nextRefresh: z.string().min(1).max(20),
  timezone: z.string().min(1).max(12),
  /** HH:MM:SS — the fixed instant the watch clock starts ticking from. */
  clockLabel: z.string().min(1).max(12),
  sweepCadence: z.string().min(1).max(16),
  /** REQUIRED provenance notice: printed in the hero and the footer. */
  dataNotice: z.string().min(1).max(60),
  keyboardHint: z.string().min(1).max(44),
});

const Statement = z.object({
  kicker: z.string().min(1).max(46),
  /** The narrative display statement — one line per array entry. */
  lines: z.array(z.string().min(1).max(52)).min(2).max(4),
  subline: z.string().min(1).max(100),
});

const Thresholds = z
  .object({
    /** Watch band starts here (the scope's inner ring). PSI on the fixed 0–0.34 scale. */
    watch: ScopePsi,
    /** Breach limit — the scope's outer ring; crossing it wakes people up. PSI on the fixed 0–0.34 scale. */
    breach: ScopePsi,
  })
  .refine((t) => t.watch < t.breach, {
    message: 'thresholds.watch must be strictly below thresholds.breach (inner ring inside outer ring).',
  });

const Scope = z.object({
  /** The full accessible caption of the aria-hidden scope figure. */
  caption: z.string().min(1).max(300),
  /** How to read the instrument — the scope's encoding legend line. */
  encodingNote: z.string().min(1).max(58),
  /** The breach callout's continuation line under the derived PSI/limit row. */
  breachCalloutNote: z.string().min(1).max(42),
});

const Sector = z.object({
  id: z.string().min(1).max(24),
  label: z.string().min(1).max(24),
});

/** A production model — a contact on the scope and a row in the watchlist. */
const FleetModel = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(32),
  sectorId: z.string().min(1).max(24),
  /** 30-day population stability index — the scope's radial coordinate, on the fixed 0–0.34 instrument scale. */
  psi: ScopePsi,
  status: ContactStatus,
  owner: z.string().min(1).max(40),
  lastRetrain: z.string().min(1).max(14),
});

const Fleet = z.object({
  bandTitle: z.string().min(1).max(24),
  bandSub: z.string().min(1).max(54),
  /** Accessible caption of the watchlist table (the scope's textual mirror). */
  tableCaption: z.string().min(1).max(180),
  sectors: z.array(Sector).min(2).max(6),
  /**
   * The model fleet. Exactly ONE model carries the `breach` status — the single
   * flagged contact past its limit, its dossier the reason the room is lit.
   */
  models: z
    .array(FleetModel)
    .min(6)
    .max(16)
    .refine((rows) => rows.filter((m) => m.status === 'breach').length === 1, {
      message: 'Exactly one fleet model must carry the "breach" status (the single flagged contact).',
    }),
});

/** A daily PSI reading; y is bounded to the trend chart's fixed 0–0.35 axis. */
const TrendPoint = z.object({ x: z.string().min(1).max(12), y: z.number().min(0).max(TREND_PSI_MAX) });
const FeatureDatum = z.object({
  id: z.string().min(1),
  category: z.string().min(1).max(40),
  value: z.number(),
});
const DossierFact = z.object({
  label: z.string().min(1).max(24),
  value: z.string().min(1).max(64),
});

const Dossier = z.object({
  bandTitle: z.string().min(1).max(20),
  bandSub: z.string().min(1).max(42),
  trendHeading: z.string().min(1).max(32),
  trendChartTitle: z.string().min(1).max(68),
  trendChartSource: z.string().min(1).max(100),
  /** Daily 30-day-window PSI for the breaching model — the drift history. */
  trendPoints: z.array(TrendPoint).min(30).max(120),
  featureHeading: z.string().min(1).max(40),
  featureChartTitle: z.string().min(1).max(60),
  featureChartSource: z.string().min(1).max(104),
  featureDrift: z.array(FeatureDatum).min(3).max(8),
  registerHeading: z.string().min(1).max(24),
  facts: z.array(DossierFact).min(5).max(12),
});

const LogItem = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(64),
  status: LogStatus,
  description: z.string().min(1).max(80).optional(),
  timestamp: z.string().min(1).max(32).optional(),
});

const Log = z.object({
  heading: z.string().min(1).max(24),
  listTitle: z.string().min(1).max(28),
  items: z.array(LogItem).min(3).max(8),
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

const Instruments = z.object({
  bandTitle: z.string().min(1).max(36),
  bandSub: z.string().min(1).max(58),
  kpiTitle: z.string().min(1).max(20),
  kpis: z.array(Kpi).min(3).max(6),
});

export const CockpitFill = z.object({
  watch: Watch,
  statement: Statement,
  thresholds: Thresholds,
  scope: Scope,
  fleet: Fleet,
  dossier: Dossier,
  log: Log,
  instruments: Instruments,
});

export type CockpitFill = z.infer<typeof CockpitFill>;
export type CockpitSector = z.infer<typeof Sector>;
export type CockpitFleetModel = z.infer<typeof FleetModel>;
export type CockpitContactStatus = z.infer<typeof ContactStatus>;

/* ------------------------------------------------------------------ */
/* Slot specs — the registry-serializable descriptor view             */
/* ------------------------------------------------------------------ */

export const COCKPIT_SECTIONS: SectionSpec[] = [
  {
    kind: 'watch',
    purpose: 'The dealing-floor chrome — command line, environment, the watch clock start, and the required provenance notice.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'watch.pageTitle', type: 'text', required: true, limits: { maxChars: 46 }, guidance: 'The browser-tab title stem (the template appends " — Live"), e.g. "The Model Risk Control Room, 02:47".' },
      { name: 'watch.commandLine', type: 'text', required: true, limits: { maxChars: 58 }, guidance: 'The command-room line on the top chrome, e.g. "MODEL RISK COMMAND · NIGHT WATCH · EST. 2021".' },
      { name: 'watch.environment', type: 'text', required: true, limits: { maxChars: 12 }, guidance: 'The environment flag shown after "ENV", e.g. "PROD".' },
      { name: 'watch.refreshCadence', type: 'text', required: true, limits: { maxChars: 16 }, guidance: 'The refresh cadence on the chrome, e.g. "REFRESH 60S".' },
      { name: 'watch.lastRefresh', type: 'text', required: true, limits: { maxChars: 28 }, guidance: 'The last-sweep stamp in the footer, e.g. "LAST SWEEP 02:47:12".' },
      { name: 'watch.nextRefresh', type: 'text', required: true, limits: { maxChars: 20 }, guidance: 'The next-sweep stamp in the footer, e.g. "NEXT 02:48:12".' },
      { name: 'watch.timezone', type: 'text', required: true, limits: { maxChars: 12 }, guidance: 'The clock timezone suffix, e.g. "AEST".' },
      { name: 'watch.clockLabel', type: 'text', required: true, limits: { maxChars: 12 }, guidance: 'HH:MM:SS instant the watch clock starts ticking from, e.g. "02:47:12".' },
      { name: 'watch.sweepCadence', type: 'text', required: true, limits: { maxChars: 16 }, guidance: 'The scope sweep rate shown on the readout and footer, e.g. "9 S / REV".' },
      { name: 'watch.dataNotice', type: 'text', required: true, limits: { maxChars: 60 }, guidance: 'REQUIRED provenance notice printed in the hero and footer; must state the data is synthetic/sourced, e.g. "SYNTHETIC DEMONSTRATION DATA · NOT CBA FIGURES".' },
      { name: 'watch.keyboardHint', type: 'text', required: true, limits: { maxChars: 44 }, guidance: 'The keyboard-affordance hint in the hero notice, e.g. "TAB — INSTRUMENTS · P — HOLD SWEEP".' },
    ],
  },
  {
    kind: 'statement',
    purpose: 'The hero narrative — the kicker, the multi-line display statement, and the one-line breach subline.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'statement.kicker', type: 'text', required: true, limits: { maxChars: 46 }, guidance: 'The hero eyebrow above the statement, e.g. "THE MODEL RISK CONTROL ROOM · 02:47".' },
      { name: 'statement.lines', type: 'items', required: true, limits: { minItems: 2, maxItems: 4, maxChars: 52 }, guidance: 'Two-to-four display lines (one per array entry) building to the flagged model, e.g. "The twelfth is why this room is lit.".' },
      { name: 'statement.subline', type: 'text', required: true, limits: { maxChars: 100 }, guidance: 'One-line reading of the breach under the statement, e.g. "CARD-FRAUD-V4 CROSSED PSI 0.250 AT 09:41 THU · 41 H IN BREACH · RETRAIN QUEUED".' },
    ],
  },
  {
    kind: 'scope',
    purpose: 'The drift-scope instrument — the drift thresholds it rings, its accessible caption and encoding legend.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'thresholds.watch', type: 'number', required: true, limits: {}, guidance: 'The watch-band PSI threshold (the inner ring), on the fixed 0–0.34 instrument scale and strictly below thresholds.breach, e.g. 0.1.' },
      { name: 'thresholds.breach', type: 'number', required: true, limits: {}, guidance: 'The breach-limit PSI threshold (the outer ring), on the fixed 0–0.34 instrument scale and strictly above thresholds.watch, e.g. 0.25.' },
      { name: 'scope.caption', type: 'longtext', required: true, limits: { maxChars: 300 }, guidance: 'The full accessible caption of the aria-hidden scope, naming the breaching model and pointing to the watchlist table, e.g. "Fleet drift scope: twelve production models plotted by 30-day population stability index …".' },
      { name: 'scope.encodingNote', type: 'text', required: true, limits: { maxChars: 58 }, guidance: 'How to read the instrument — its encoding legend line, e.g. "RADIUS = 30-DAY PSI · SECTOR = BUSINESS LINE".' },
      { name: 'scope.breachCalloutNote', type: 'text', required: true, limits: { maxChars: 42 }, guidance: 'The breach callout continuation under the derived PSI/limit row, e.g. "41 H IN BREACH · RETRAIN QUEUED".' },
    ],
  },
  {
    kind: 'fleet',
    purpose: 'The fleet watchlist — the scope\'s textual mirror; exactly one model is flagged in breach.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'fleet.bandTitle', type: 'text', required: true, limits: { maxChars: 24 }, guidance: 'The band heading for the watchlist, e.g. "FLEET WATCHLIST".' },
      { name: 'fleet.bandSub', type: 'text', required: true, limits: { maxChars: 54 }, guidance: 'The band sub-line, true of the fleet you supply, e.g. "TEXTUAL MIRROR OF THE SCOPE · 12 CONTACTS".' },
      { name: 'fleet.tableCaption', type: 'longtext', required: true, limits: { maxChars: 180 }, guidance: 'The accessible caption of the watchlist table naming its columns, e.g. "Fleet watchlist — the drift scope\'s contents as a table. Twelve models with sector, 30-day PSI, limit, status, owner, and last retrain date.".' },
      { name: 'fleet.sectors', type: 'items', required: true, limits: { minItems: 2, maxItems: 6 }, guidance: 'Two-to-six business-line sectors (id, label); each becomes a quadrant of the scope, e.g. { id: "fraud", label: "FRAUD & FIN-CRIME" }.' },
      { name: 'fleet.models', type: 'tableRows', required: true, limits: { minItems: 6, maxItems: 16 }, guidance: 'Six-to-sixteen models (id, name, sectorId, psi, status stable|watch|breach, owner, lastRetrain). psi is on the fixed 0–0.34 instrument scale. Exactly ONE carries status "breach" — the single flagged contact past its limit, e.g. card-fraud-v4 at psi 0.312.' },
    ],
  },
  {
    kind: 'dossier',
    purpose: 'The breaching model\'s dossier — why the scope is pointing at it: drift trend, feature contributions, and register entry.',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'dossier.bandTitle', type: 'text', required: true, limits: { maxChars: 20 }, guidance: 'The dossier band heading stem; the breaching model name is appended, e.g. "THE DOSSIER".' },
      { name: 'dossier.bandSub', type: 'text', required: true, limits: { maxChars: 42 }, guidance: 'The dossier band sub-line stem; the breach limit is appended, e.g. "WHY THE SCOPE IS POINTING AT IT".' },
      { name: 'dossier.trendHeading', type: 'text', required: true, limits: { maxChars: 32 }, guidance: 'The drift-trend panel heading, e.g. "DRIFT · 90 DAYS VS LIMIT".' },
      { name: 'dossier.trendChartTitle', type: 'text', required: true, limits: { maxChars: 68 }, guidance: 'The trend chart\'s accessible title, e.g. "card-fraud-v4 — population stability index, 90 days".' },
      { name: 'dossier.trendChartSource', type: 'text', required: true, limits: { maxChars: 100 }, guidance: 'The trend chart source note; state synthetic provenance, e.g. "Daily 30-day-window PSI vs the 0.25 breach limit. Synthetic demonstration data.".' },
      { name: 'dossier.trendPoints', type: 'items', required: true, limits: { minItems: 30, maxItems: 120 }, guidance: 'Daily 30-day-window PSI points (x ISO date, y PSI on the fixed 0–0.35 trend axis) for the breaching model — the drift history the trend line draws.' },
      { name: 'dossier.featureHeading', type: 'text', required: true, limits: { maxChars: 40 }, guidance: 'The feature-drift panel heading, e.g. "FEATURE CONTRIBUTIONS TO DRIFT".' },
      { name: 'dossier.featureChartTitle', type: 'text', required: true, limits: { maxChars: 60 }, guidance: 'The feature-bar chart\'s accessible title, e.g. "card-fraud-v4 — feature-level PSI contribution".' },
      { name: 'dossier.featureChartSource', type: 'text', required: true, limits: { maxChars: 104 }, guidance: 'The feature-bar source note; state synthetic provenance, e.g. "Top six features by contribution to composite PSI. Synthetic demonstration data.".' },
      { name: 'dossier.featureDrift', type: 'items', required: true, limits: { minItems: 3, maxItems: 8 }, guidance: 'Three-to-eight features by contribution to composite PSI (id, category, value), e.g. { category: "txn_amount_zscore", value: 0.084 }.' },
      { name: 'dossier.registerHeading', type: 'text', required: true, limits: { maxChars: 24 }, guidance: 'The register-entry panel heading, e.g. "REGISTER ENTRY".' },
      { name: 'dossier.facts', type: 'items', required: true, limits: { minItems: 5, maxItems: 12 }, guidance: 'Five-to-twelve register facts (label, value) about the breaching model, e.g. { label: "SLA", value: "RESTORE ≤ 72 H · 31 H REMAINING" }.' },
    ],
  },
  {
    kind: 'log',
    purpose: 'The overnight event log — the incident feed of the night watch (comp.status-list).',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'log.heading', type: 'text', required: true, limits: { maxChars: 24 }, guidance: 'The log panel heading, e.g. "OVERNIGHT LOG".' },
      { name: 'log.listTitle', type: 'text', required: true, limits: { maxChars: 28 }, guidance: 'The status-list accessible title, e.g. "Overnight event log".' },
      { name: 'log.items', type: 'items', required: true, limits: { minItems: 3, maxItems: 8 }, guidance: 'Three-to-eight overnight events (id, label, status success|warning|danger|info|neutral, description, ISO timestamp), newest first.' },
    ],
  },
  {
    kind: 'instruments',
    purpose: 'The supporting instrumentation — fleet-level gauges subordinate to the scope (comp.kpi-tile).',
    repeats: { min: 1, max: 1 },
    slots: [
      { name: 'instruments.bandTitle', type: 'text', required: true, limits: { maxChars: 36 }, guidance: 'The instruments band heading, e.g. "SUPPORTING INSTRUMENTATION".' },
      { name: 'instruments.bandSub', type: 'text', required: true, limits: { maxChars: 58 }, guidance: 'The instruments band sub-line, e.g. "FLEET-LEVEL GAUGES · SUBORDINATE TO THE SCOPE".' },
      { name: 'instruments.kpiTitle', type: 'text', required: true, limits: { maxChars: 20 }, guidance: 'The KPI tile\'s accessible title, e.g. "Fleet gauges".' },
      { name: 'instruments.kpis', type: 'metric', required: true, limits: { minItems: 3, maxItems: 6 }, guidance: 'Three-to-six fleet gauges (label, value, unit, status). Values with unit "percent" are FRACTIONS: 0.992 renders as 99.2%, never 99.' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Standard certifier aliases (Task 5)                                 */
/* ------------------------------------------------------------------ */

/** The world's fill Zod schema, by the certifier's standard name. */
export const FILL_SCHEMA = CockpitFill;
/** The registry-serializable section specs, by the certifier's standard name. */
export const SECTIONS = COCKPIT_SECTIONS;

/** The craft guarantees the template makes and the descriptor advertises. */
export const COCKPIT_GUIDANCE: string[] = [
  'A model-risk night watch staged as a DEALING-FLOOR INSTRUMENT: the commanding visual is a radial DRIFT SCOPE — every production model is a contact placed at its 30-day-PSI radius inside its business-line sector, with threshold rings at the watch and breach limits and a slow phosphor sweep that holds on demand and never renders under reduced motion.',
  'Exactly one fleet model carries the "breach" status: the single contact past the limit ring, marked with a crosshair + halo and a callout, echoed as the breach row of the watchlist and as the climax of the hero statement.',
  'The synthetic-data provenance notice (watch.dataNotice) is required and prints in the hero and the footer.',
  'The scope is decorative (aria-hidden); the REAL content is the fleet watchlist table — the scope\'s textual mirror — so the world is fully legible without the instrument.',
  'The dossier auto-titles the breaching model and derives its breach callout, trend series labels, and ring labels from the fleet + thresholds, so the diagnosis always names whichever model is flagged.',
  'Slot char caps and item counts are sized so any schema-valid fill stays composed — the statement never overflows, the watchlist and scope stay balanced, and the dossier panels stay legible. Every PSI value is bounded to the instrument\'s fixed scale (contacts and thresholds 0–0.34, trend points 0–0.35, watch strictly below breach), so no fill can pin a contact to the rim or clip the trend.',
  'Motion level 1 (data-ink-draw + phosphor sweep); the mood is locked dark.',
];
