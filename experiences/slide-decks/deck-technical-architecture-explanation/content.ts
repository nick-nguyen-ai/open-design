/**
 * Content pack for "The Sectional" — the live rendering of
 * `deck-technical-architecture-explanation`.
 *
 * An architecture explained the way engineers cut a building: sheet by sheet,
 * each cut deeper. True cyanotype — white and pale line work on saturated
 * Prussian blue, deliberately the INVERSE of the Drawing Office's pale
 * drafting paper (its drawing number EDI-ARCH-004 is cross-referenced in the
 * title block). The money sheet is the SECTION: one decision request cut open
 * vertically, storey by storey, with latency measure lines — and one storey
 * over budget, flagged in red pencil (the deliberate anomaly).
 *
 * Everything here is TYPED and DETERMINISTIC — synthetic demonstration data at
 * realistic institutional magnitudes; no real-institution claims.
 */
import type { CategoryBarDatum } from '@enterprise-design/data-viz';

/* ------------------------------------------------------------------ */
/* Set chrome                                                          */
/* ------------------------------------------------------------------ */

export const SET = {
  project: 'DECISION PLATFORM — SECTIONAL SET',
  setNo: 'EDI-SECT-011',
  crossRef: 'REF EDI-ARCH-004 · THE DRAWING OFFICE · GENERAL ARRANGEMENT',
  client: 'GROUP DECISIONING PROGRAMME',
  scale: 'NTS',
  drawn: 'R.OKAFOR',
  checked: 'M.VEGA',
  issue: 'ISSUE C · FOR EXPLANATION',
  dataNotice: 'SYNTHETIC DEMO · NOT A CONSTRUCTION SET',
  keyboardHint: '← → SHEETS · HOME / END · S — SECTION B–B',
} as const;

/* ------------------------------------------------------------------ */
/* Sheet model                                                         */
/* ------------------------------------------------------------------ */

export interface PartRow {
  mark: string;
  name: string;
  note: string;
}

interface SheetBase {
  id: string;
  /** Sheet number as it appears in the title block, e.g. `A-301`. */
  no: string;
  /** Sheet title, e.g. `SECTION B–B`. */
  title: string;
  /** Index (cover) description line. */
  indexLine: string;
  /** The schedule of parts — every sheet's accessible mirror. */
  parts: readonly PartRow[];
}

export interface CoverSheet extends SheetBase {
  kind: 'cover';
  kicker: string;
  displayLines: readonly string[];
  standfirst: string;
}

export interface NotesSheet extends SheetBase {
  kind: 'notes';
  notes: readonly { no: string; text: string }[];
  thesis: string;
}

export interface PlanSheet extends SheetBase {
  kind: 'plan';
}

export interface ElevationSheet extends SheetBase {
  kind: 'elevation';
}

export interface SectionSheet extends SheetBase {
  kind: 'section';
}

export interface DetailSheet extends SheetBase {
  kind: 'detail';
}

export interface ScheduleSheet extends SheetBase {
  kind: 'schedule';
}

export interface RevisionSheet extends SheetBase {
  kind: 'revisions';
  closingLine: string;
}

export type Sheet =
  | CoverSheet
  | NotesSheet
  | PlanSheet
  | ElevationSheet
  | SectionSheet
  | DetailSheet
  | ScheduleSheet
  | RevisionSheet;

/* ------------------------------------------------------------------ */
/* Site plan — systems as building masses                              */
/* ------------------------------------------------------------------ */

export interface Mass {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Hatched masses are third-party ground — outside our lot line. */
  external?: boolean;
}

export const MASSES: readonly Mass[] = [
  { id: 'channels', label: 'CHANNEL BLOCK', sub: 'WEB · APP · BRANCH', x: 60, y: 70, w: 250, h: 130, external: true },
  { id: 'edge', label: 'EDGE GATEWAY', sub: 'AUTH · SHAPING', x: 400, y: 70, w: 190, h: 130 },
  { id: 'decision', label: 'DECISION HALL', sub: 'POLICY + MODEL HOST', x: 400, y: 280, w: 330, h: 180 },
  { id: 'features', label: 'FEATURE STORE', sub: 'ONLINE SERVING', x: 60, y: 280, w: 250, h: 180 },
  { id: 'ledger', label: 'DECISION LEDGER', sub: 'IMMUTABLE RECORD', x: 400, y: 540, w: 330, h: 120 },
  { id: 'ops', label: 'OBSERVATORY', sub: 'DRIFT · MONITORING', x: 60, y: 540, w: 250, h: 120 },
  { id: 'bureau', label: 'BUREAU ANNEX', sub: 'EXTERNAL DATA', x: 830, y: 280, w: 180, h: 180, external: true },
];

export interface PlanRoute {
  from: string;
  to: string;
  label: string;
}

export const PLAN_ROUTES: readonly PlanRoute[] = [
  { from: 'channels', to: 'edge', label: 'REQ' },
  { from: 'edge', to: 'decision', label: 'DECIDE' },
  { from: 'features', to: 'decision', label: 'FEATURES' },
  { from: 'bureau', to: 'decision', label: 'BUREAU' },
  { from: 'decision', to: 'ledger', label: 'RECORD' },
  { from: 'features', to: 'ops', label: 'WINDOWS' },
];

/* ------------------------------------------------------------------ */
/* Elevation — the service topology, storeys visible from the street   */
/* ------------------------------------------------------------------ */

export interface ElevationBay {
  id: string;
  label: string;
  tech: string;
  /** Storey the bay sits on (0 = ground). */
  storey: number;
  x: number;
  w: number;
  replicas: number;
}

export const ELEVATION_BAYS: readonly ElevationBay[] = [
  { id: 'lb', label: 'INGRESS', tech: 'L7 LB · TLS', storey: 3, x: 60, w: 200, replicas: 2 },
  { id: 'gw', label: 'API GATEWAY', tech: 'authn · quota', storey: 3, x: 300, w: 240, replicas: 3 },
  { id: 'orch', label: 'DECISION ORCHESTRATOR', tech: 'saga · timeout 900ms', storey: 2, x: 180, w: 360, replicas: 4 },
  { id: 'model', label: 'MODEL HOST', tech: 'gRPC · 2 pools', storey: 1, x: 60, w: 280, replicas: 6 },
  { id: 'policy', label: 'POLICY ENGINE', tech: 'rules · versioned', storey: 1, x: 380, w: 240, replicas: 3 },
  { id: 'feat', label: 'FEATURE STORE', tech: 'online · p99 8ms', storey: 0, x: 60, w: 260, replicas: 3 },
  { id: 'ledger', label: 'DECISION LEDGER', tech: 'append-only', storey: 0, x: 360, w: 260, replicas: 3 },
];

/* ------------------------------------------------------------------ */
/* SECTION B–B — the money sheet. A request cut open vertically.       */
/* ------------------------------------------------------------------ */

export interface Storey {
  id: string;
  /** Storey mark on the section, top-down: S5 … S1. */
  mark: string;
  name: string;
  work: string;
  /** Latency budget for the storey, ms. */
  budgetMs: number;
  /** Measured p95, ms. */
  measuredMs: number;
  /** The one storey over budget — the deliberate anomaly. */
  over?: boolean;
}

/** Top-down: the request enters at the edge and descends to the ledger. */
export const STOREYS: readonly Storey[] = [
  { id: 'edge', mark: 'S5', name: 'EDGE', work: 'TLS · authn · shaping', budgetMs: 40, measuredMs: 31 },
  { id: 'orch', mark: 'S4', name: 'ORCHESTRATION', work: 'plan · fan-out · guard', budgetMs: 60, measuredMs: 47 },
  { id: 'features', mark: 'S3', name: 'FEATURE STORE', work: 'point-in-time joins', budgetMs: 45, measuredMs: 71, over: true },
  { id: 'model', mark: 'S2', name: 'MODEL HOST', work: 'score · explain', budgetMs: 120, measuredMs: 96 },
  { id: 'ledger', mark: 'S1', name: 'DECISION LEDGER', work: 'append · attest', budgetMs: 35, measuredMs: 22 },
];

export const SECTION_BUDGET_TOTAL_MS = STOREYS.reduce((sum, s) => sum + s.budgetMs, 0);
export const SECTION_MEASURED_TOTAL_MS = STOREYS.reduce((sum, s) => sum + s.measuredMs, 0);
export const OVER_STOREY = STOREYS.find((s) => s.over) as Storey;

/* ------------------------------------------------------------------ */
/* DETAIL — one interface magnified                                    */
/* ------------------------------------------------------------------ */

export const DETAIL = {
  callout: 'DETAIL 1 · FROM SHT A-301 · ORCHESTRATOR ⟶ FEATURE STORE',
  interfaceName: 'GetFeatureVector v3',
  facts: [
    { mark: 'D1', term: 'CONTRACT', text: 'gRPC GetFeatureVector v3 — entity keys in, point-in-time vector out. Schema pinned per model release; additive evolution only.' },
    { mark: 'D2', term: 'RETRY', text: 'One retry at 25ms hedge, then degrade: orchestrator substitutes point-in-time defaults and stamps the decision DEGRADED-F.' },
    { mark: 'D3', term: 'IDEMPOTENCY', text: 'Request key = (entity, decision-id, feature-set version). Replays return the recorded vector — never a fresh read.' },
    { mark: 'D4', term: 'BUDGET', text: 'p95 45ms allocated on SHT A-301. Measured 71ms — see RED-PENCIL note; remediation tracked as RFI-114.' },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* LOAD SCHEDULE — FIG A-401.2, drafted exhibit                        */
/* ------------------------------------------------------------------ */

export const FIG_A4012 = {
  ref: 'FIG A-401.2',
  title: 'FIG A-401.2 — Feature store p95 read latency by call type, ms (measured vs budget)',
  source: 'Seven-day p95 by call type against the SHT A-301 storey budget. Synthetic demonstration data.',
} as const;

export const LOAD_ROWS: readonly CategoryBarDatum[] = [
  { id: 'single', category: 'Single entity', value: 34, target: 45 },
  { id: 'joined', category: 'Point-in-time join', value: 71, target: 45 },
  { id: 'batchof8', category: 'Vector batch ×8', value: 52, target: 60 },
  { id: 'fallback', category: 'Default fallback', value: 6, target: 45 },
];

/* ------------------------------------------------------------------ */
/* Revision history                                                    */
/* ------------------------------------------------------------------ */

export interface RevisionRow {
  rev: string;
  date: string;
  note: string;
  by: string;
}

export const REVISIONS: readonly RevisionRow[] = [
  { rev: 'A', date: '2026-03-02', note: 'First issue — site plan and elevation only.', by: 'R.O' },
  { rev: 'B', date: '2026-05-11', note: 'Section B–B added after the latency review; storey budgets drawn.', by: 'R.O' },
  { rev: 'C', date: '2026-07-06', note: 'Feature-store storey RED-PENCILLED over budget; detail A-401 and load schedule added. RFI-114 open.', by: 'M.V' },
];

/* ------------------------------------------------------------------ */
/* The eight sheets                                                    */
/* ------------------------------------------------------------------ */

export const SHEETS: readonly Sheet[] = [
  {
    kind: 'cover',
    id: 'cover',
    no: 'A-000',
    title: 'COVER SHEET',
    indexLine: 'Set title, drawing index, references',
    kicker: `${SET.setNo} · ${SET.issue}`,
    displayLines: ['A system is a building.', 'We cut it open', 'sheet by sheet.'],
    standfirst:
      'Eight sheets, each cut deeper than the last: the lot, the street face, then straight down through one decision request — until a single interface fills the sheet.',
    parts: [
      { mark: 'A-000', name: 'COVER SHEET', note: 'This sheet' },
      { mark: 'A-100', name: 'GENERAL NOTES', note: 'How to read the set' },
      { mark: 'A-101', name: 'SITE PLAN', note: 'Systems as masses on the lot' },
      { mark: 'A-201', name: 'ELEVATION', note: 'The service topology, street face' },
      { mark: 'A-301', name: 'SECTION B–B', note: 'One request cut open · red pencil' },
      { mark: 'A-401', name: 'DETAIL 1', note: 'Orchestrator ⟶ feature store' },
      { mark: 'A-402', name: 'LOAD SCHEDULE', note: 'FIG A-401.2 · measured vs budget' },
      { mark: 'A-901', name: 'REVISION HISTORY', note: 'Issues A–C' },
    ],
  },
  {
    kind: 'notes',
    id: 'notes',
    no: 'A-100',
    title: 'GENERAL NOTES',
    indexLine: 'Reading order, conventions, references',
    thesis: 'Plans tell you what exists. Sections tell you what it costs.',
    notes: [
      { no: '1', text: 'READ IN ORDER. Each sheet cuts deeper than the one before: lot → street face → section → detail. Do not skip to the detail without the section above it.' },
      { no: '2', text: `THIS SET IS THE INVERSE OF ${'EDI-ARCH-004'}. The Drawing Office drew the general arrangement on pale paper; this set prints the same estate as a cyanotype and cuts it.` },
      { no: '3', text: 'ALL DIMENSIONS ARE LATENCY. Measure lines carry milliseconds, not millimetres. Budgets are drawn; measured values are pencilled against them.' },
      { no: '4', text: 'RED PENCIL IS LIVE. One storey on SHT A-301 exceeds its drawn budget. The mark stays on the set until RFI-114 closes — a set with no red pencil is a set nobody is reading.' },
      { no: '5', text: 'SYNTHETIC DEMO. Names, figures and vendors are demonstration data at realistic magnitudes; this is not a real institution’s construction set.' },
    ],
    parts: [
      { mark: 'N1', name: 'Reading order', note: 'Lot → face → cut → detail' },
      { mark: 'N2', name: 'Cross-reference', note: 'EDI-ARCH-004 · Drawing Office' },
      { mark: 'N3', name: 'Dimension convention', note: 'Milliseconds throughout' },
      { mark: 'N4', name: 'Red pencil', note: 'RFI-114 open on SHT A-301' },
      { mark: 'N5', name: 'Provenance', note: 'Synthetic demonstration set' },
    ],
  },
  {
    kind: 'plan',
    id: 'site-plan',
    no: 'A-101',
    title: 'SITE PLAN',
    indexLine: 'Systems as building masses on the lot',
    parts: [
      { mark: 'M1', name: 'CHANNEL BLOCK', note: 'Web, app, branch — third-party ground, hatched' },
      { mark: 'M2', name: 'EDGE GATEWAY', note: 'Authentication and shaping at the lot line' },
      { mark: 'M3', name: 'DECISION HALL', note: 'Policy engine and model host share one hall' },
      { mark: 'M4', name: 'FEATURE STORE', note: 'Online serving, north of the hall' },
      { mark: 'M5', name: 'DECISION LEDGER', note: 'Immutable record, south elevation' },
      { mark: 'M6', name: 'OBSERVATORY', note: 'Drift and monitoring, fed by nightly windows' },
      { mark: 'M7', name: 'BUREAU ANNEX', note: 'External data — outside the lot line, hatched' },
    ],
  },
  {
    kind: 'elevation',
    id: 'elevation',
    no: 'A-201',
    title: 'ELEVATION',
    indexLine: 'The service topology, seen from the street',
    parts: [
      { mark: 'E1', name: 'INGRESS', note: 'Storey 3 · L7 load balancer, TLS · ×2' },
      { mark: 'E2', name: 'API GATEWAY', note: 'Storey 3 · authn, quota · ×3' },
      { mark: 'E3', name: 'DECISION ORCHESTRATOR', note: 'Storey 2 · saga, 900ms ceiling · ×4' },
      { mark: 'E4', name: 'MODEL HOST', note: 'Storey 1 · gRPC, two pools · ×6' },
      { mark: 'E5', name: 'POLICY ENGINE', note: 'Storey 1 · versioned rules · ×3' },
      { mark: 'E6', name: 'FEATURE STORE', note: 'Ground · online reads · ×3' },
      { mark: 'E7', name: 'DECISION LEDGER', note: 'Ground · append-only · ×3' },
    ],
  },
  {
    kind: 'section',
    id: 'section',
    no: 'A-301',
    title: 'SECTION B–B',
    indexLine: 'One request cut open · latency storeys · RED PENCIL',
    parts: STOREYS.map((s) => ({
      mark: s.mark,
      name: s.name,
      note: `${s.work} · budget ${s.budgetMs}ms · measured p95 ${s.measuredMs}ms${s.over ? ' · OVER BUDGET — RFI-114' : ''}`,
    })),
  },
  {
    kind: 'detail',
    id: 'detail',
    no: 'A-401',
    title: 'DETAIL 1',
    indexLine: 'Orchestrator ⟶ feature store, magnified',
    parts: DETAIL.facts.map((f) => ({ mark: f.mark, name: f.term, note: f.text })),
  },
  {
    kind: 'schedule',
    id: 'load-schedule',
    no: 'A-402',
    title: 'LOAD SCHEDULE',
    indexLine: 'FIG A-401.2 · p95 by call type vs budget',
    parts: LOAD_ROWS.map((r) => ({
      mark: r.id.toUpperCase(),
      name: r.category,
      note: `p95 ${r.value}ms against budget ${r.target}ms${r.value > (r.target ?? Infinity) ? ' · over' : ''}`,
    })),
  },
  {
    kind: 'revisions',
    id: 'revisions',
    no: 'A-901',
    title: 'REVISION HISTORY',
    indexLine: 'Issues A–C · what changed and why',
    closingLine: 'A drawing set is finished when it stops changing. A living system’s set never is.',
    parts: REVISIONS.map((r) => ({ mark: r.rev, name: r.date, note: `${r.note} (${r.by})` })),
  },
];

export const SHEET_COUNT = SHEETS.length;

/** 1-based sheet number for a slug, or null. */
export function sheetNumberForId(id: string): number | null {
  const index = SHEETS.findIndex((sheet) => sheet.id === id);
  return index === -1 ? null : index + 1;
}

export const SECTION_SHEET_NUMBER = sheetNumberForId('section') as number;
