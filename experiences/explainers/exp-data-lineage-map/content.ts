/**
 * "The River Atlas" — shipped content for `exp-data-lineage-map`.
 *
 * A synthetic finance-lineage watershed: where the annual-report revenue
 * figure actually comes from, drawn as an atlas plate. All systems and
 * figures are invented.
 */

export type ReachKind = 'spring' | 'lock' | 'reach' | 'delta';

export interface Waterway {
  id: string;
  /** SVG path for the waterway. */
  path: string;
  /** Stroke width — flow volume. */
  width: number;
}

export interface PlaceLabel {
  id: string;
  name: string;
  kind: ReachKind;
  x: number;
  y: number;
  anchor?: 'start' | 'middle' | 'end';
}

export interface GazetteerEntry {
  id: string;
  name: string;
  kind: ReachKind;
  steward: string;
  freshness: string;
  certified: boolean;
  note: string;
}

export interface TraceStep {
  id: string;
  step: string;
  place: string;
  finding: string;
}

export const ATLAS = {
  masthead: 'THE RIVER ATLAS · DATA LINEAGE SURVEY',
  plateRef: 'PLATE IV · THE REVENUE WATERSHED · SURVEYED 14 JUL 2026',
  provenance: 'SYNTHETIC SURVEY · A DEMONSTRATION WATERSHED, NOT LIVE LINEAGE',
  kicker: 'EVERY FIGURE HAS A WATERSHED',
  statement: 'Trace the number upstream until you reach a spring.',
  subline:
    'The £4.2bn revenue line in the annual report is the mouth of a river. This plate maps its whole watershed — three springs, two locks where the water is treated, one confluence, and the delta where it reaches its readers. A provenance question is answered by walking upstream, and the walk is printed below.',
  figures: [
    { label: 'SPRINGS (SOURCES)', value: '3' },
    { label: 'LOCKS (TRANSFORMS)', value: '2' },
    { label: 'NAMED REACHES', value: '9' },
    { label: 'DELTA MOUTHS', value: '3' },
  ],
} as const;

export const PLATE = {
  title: 'Plate IV — the revenue watershed',
  sub: 'Springs feed tributaries · locks treat the water · the delta serves the readers',
  caption:
    'Watershed map: the Trading Ledger and Retail Billing springs feed tributaries that pass the Conformance Lock, join at Group Confluence with the FX Rates tributary, pass the Eliminations Lock, and flow down the Finance River to a delta with three mouths: the Annual Report, the Regulator Return, and the Executive Dashboard. The gazetteer below lists every reach with its steward.',
} as const;

/** Waterways drawn upstream → downstream (so widths can grow). */
export const WATERWAYS: Waterway[] = [
  // Trading tributary: spring (110,90) → conformance lock → confluence (520,230)
  { id: 'w-trading', path: 'M 110 90 C 200 100, 260 130, 330 160 S 460 205, 520 230', width: 5 },
  // Billing tributary: spring (90,330) → conformance lock → confluence
  { id: 'w-billing', path: 'M 90 330 C 190 320, 280 300, 360 275 S 470 242, 520 230', width: 6 },
  // FX tributary: spring (300,40) → joins main just after confluence
  { id: 'w-fx', path: 'M 300 40 C 380 70, 470 140, 560 218', width: 2.5 },
  // Main river: confluence → eliminations lock → delta head (860,260)
  { id: 'w-main', path: 'M 520 230 C 620 250, 720 258, 860 260', width: 10 },
  // Delta mouths
  { id: 'w-delta-1', path: 'M 860 260 C 910 220, 950 190, 1000 170', width: 5 },
  { id: 'w-delta-2', path: 'M 860 260 C 920 262, 960 264, 1005 265', width: 4 },
  { id: 'w-delta-3', path: 'M 860 260 C 910 300, 950 330, 1000 355', width: 4 },
];

export const SPRINGS: PlaceLabel[] = [
  { id: 's-trading', name: 'TRADING LEDGER SPRING', kind: 'spring', x: 110, y: 90 },
  { id: 's-billing', name: 'RETAIL BILLING SPRING', kind: 'spring', x: 90, y: 330 },
  { id: 's-fx', name: 'FX RATES SPRING', kind: 'spring', x: 300, y: 40 },
];

export const LOCKS: PlaceLabel[] = [
  { id: 'l-conform', name: 'CONFORMANCE LOCK', kind: 'lock', x: 350, y: 208 },
  { id: 'l-elim', name: 'ELIMINATIONS LOCK', kind: 'lock', x: 700, y: 258 },
];

export const LABELS: PlaceLabel[] = [
  { id: 'lb-confluence', name: 'GROUP CONFLUENCE', kind: 'reach', x: 520, y: 210, anchor: 'middle' },
  { id: 'lb-river', name: 'THE FINANCE RIVER', kind: 'reach', x: 790, y: 242, anchor: 'middle' },
  { id: 'lb-annual', name: 'ANNUAL REPORT', kind: 'delta', x: 1008, y: 165, anchor: 'start' },
  { id: 'lb-reg', name: 'REGULATOR RETURN', kind: 'delta', x: 1012, y: 268, anchor: 'start' },
  { id: 'lb-exec', name: 'EXEC DASHBOARD', kind: 'delta', x: 1008, y: 362, anchor: 'start' },
];

export const GAZETTEER = {
  title: 'The gazetteer',
  sub: 'Every reach on the plate, with its steward and its certification',
  caption:
    'Gazetteer of the revenue watershed — name, kind, steward, freshness, and certification state for each of the nine reaches.',
  entries: [
    { id: 'g1', name: 'Trading Ledger Spring', kind: 'spring', steward: 'Markets Finance', freshness: 'T+0 · intraday', certified: true, note: 'System of record for markets revenue; the water is raw here.' },
    { id: 'g2', name: 'Retail Billing Spring', kind: 'spring', steward: 'Retail Finance', freshness: 'T+1 · nightly', certified: true, note: 'Fee and interest billing; the widest spring by volume.' },
    { id: 'g3', name: 'FX Rates Spring', kind: 'spring', steward: 'Treasury', freshness: 'T+0 · 16:00 fix', certified: true, note: 'External tributary — the day’s closing fixes, licensed feed.' },
    { id: 'g4', name: 'Conformance Lock', kind: 'lock', steward: 'Finance Data Crew', freshness: 'nightly gate', certified: true, note: 'Types conformed, currencies normalised; water leaves this lock in group schema.' },
    { id: 'g5', name: 'Group Confluence', kind: 'reach', steward: 'Finance Data Crew', freshness: 'nightly', certified: true, note: 'Trading and retail waters meet; FX joins just downstream.' },
    { id: 'g6', name: 'Eliminations Lock', kind: 'lock', steward: 'Group Reporting', freshness: 'nightly gate', certified: true, note: 'Intercompany flows removed — the river narrows honestly here.' },
    { id: 'g7', name: 'The Finance River', kind: 'reach', steward: 'Group Reporting', freshness: 'nightly', certified: true, note: 'The certified warehouse reach; every mouth downstream drinks only from here.' },
    { id: 'g8', name: 'Annual Report mouth', kind: 'delta', steward: 'External Reporting', freshness: 'annual', certified: true, note: 'The £4.2bn line; audited against this plate.' },
    { id: 'g9', name: 'Exec Dashboard mouth', kind: 'delta', steward: 'Finance BI', freshness: 'daily 06:00', certified: false, note: 'Convenience mouth — certified for direction, not for statutory use.' },
  ] as GazetteerEntry[],
} as const;

export const TRACE = {
  title: 'The walk upstream',
  sub: 'An auditor’s question, answered by walking the plate: “where does the £4.2bn come from?”',
  steps: [
    { id: 't1', step: 'START', place: 'Annual Report mouth', finding: 'The £4.2bn revenue line cites river snapshot FIN-2026-Q2-CLOSE — a named, immutable reach of the Finance River.' },
    { id: 't2', step: 'REACH 1', place: 'The Finance River', finding: 'The snapshot decomposes to 61% retail water, 38% trading water, 1% FX effects — proportions carried by the river’s manifest.' },
    { id: 't3', step: 'LOCK 1', place: 'Eliminations Lock', finding: '£0.31bn of intercompany flow was removed here; the lock’s log names every eliminated pair.' },
    { id: 't4', step: 'LOCK 2', place: 'Conformance Lock', finding: 'Currencies normalised at the 30-Jun 16:00 fixes from the FX spring; conversion table pinned to the lock log.' },
    { id: 't5', step: 'SPRINGS', place: 'Trading Ledger + Retail Billing', finding: 'Source extracts reconcile to their ledgers penny-perfect (reconciliation refs REC-8841, REC-8842). The walk ends at water we can taste.' },
  ] as TraceStep[],
} as const;

export const FOOT = {
  note: 'The plate is re-surveyed nightly from the lineage graph; a reach that cannot be walked upstream to a spring is marked uncertified until it can. Maps that flatter are worse than no maps.',
  next: 'NEXT SURVEY 02:00 · PLATE V (COSTS WATERSHED) IN PREPARATION',
} as const;
