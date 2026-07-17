/**
 * "The Departures Board" — shipped content for `db-delivery-control-tower`.
 *
 * Synthetic demonstration data for a fictional bank-wide payments
 * modernisation programme ("Atlas"). Every flight, blocker, and figure is
 * invented.
 */

export type FlightStatus = 'on-time' | 'boarding' | 'delayed' | 'holding' | 'ground-stop';

export interface Flight {
  id: string;
  code: string;
  destination: string;
  gate: string;
  sched: string;
  status: FlightStatus;
  remark: string;
  /** Delivery confidence 0–1 for the confidence meters. */
  confidence: number;
}

export interface GroundStop {
  id: string;
  flightCode: string;
  title: string;
  owner: string;
  since: string;
  impact: string;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  note: string;
}

export const TOWER = {
  masthead: 'MERIDIAN GROUP · PROGRAMME CONTROL TOWER',
  programme: 'ATLAS · PAYMENTS MODERNISATION',
  watch: 'TOWER WATCH · TUE 14 JUL 2026 · 07:30 LOCAL',
  provenance: 'SYNTHETIC DEMONSTRATION DATA · NOT A LIVE PROGRAMME',
  kicker: 'ALL WORKSTREAMS · NEXT 2 QUARTERS',
  statementTop: 'Eleven flights moving.',
  statementBottom: 'One ground stop, and it is named.',
  subline:
    'Delivery confidence across the Atlas programme at this morning’s tower watch: nine workstreams on time, one boarding early, one delayed on a vendor contract, and settlement-engine cutover held on the ground until the clearing-house certificate lands.',
  figures: [
    { label: 'FLIGHTS TRACKED', value: '12' },
    { label: 'ON TIME', value: '09' },
    { label: 'DELAYED / HOLDING', value: '02' },
    { label: 'GROUND STOPS', value: '01' },
  ],
} as const;

export const BOARD = {
  title: 'Departures',
  sub: 'Workstreams by next milestone · updated at tower watch',
  caption:
    'Departures board — twelve Atlas workstreams with code, next milestone, owning team, scheduled date, and status.',
} as const;

export const FLIGHTS: Flight[] = [
  { id: 'f1', code: 'PAY-201', destination: 'INSTANT RAILS · LIVE TRAFFIC 10%', gate: 'RAILS CREW', sched: '28 JUL', status: 'boarding', remark: 'CANARY COHORT LOADING', confidence: 0.92 },
  { id: 'f2', code: 'PAY-114', destination: 'SETTLEMENT ENGINE · CUTOVER REHEARSAL', gate: 'CORE TEAM', sched: '31 JUL', status: 'ground-stop', remark: 'AWAITING CLEARING-HOUSE CERT', confidence: 0.48 },
  { id: 'f3', code: 'PAY-090', destination: 'CARD AUTH · REGION B MIGRATION', gate: 'AUTH CREW', sched: '04 AUG', status: 'on-time', remark: 'DRY RUN CLEAN 12 JUL', confidence: 0.88 },
  { id: 'f4', code: 'DATA-33', destination: 'PAYMENTS LAKE · DUAL-WRITE OFF', gate: 'DATA CREW', sched: '08 AUG', status: 'on-time', remark: 'PARITY 99.98%', confidence: 0.9 },
  { id: 'f5', code: 'PAY-160', destination: 'DISPUTES WORKBENCH · PILOT EXIT', gate: 'SERVICING', sched: '11 AUG', status: 'on-time', remark: 'PILOT NPS +41', confidence: 0.86 },
  { id: 'f6', code: 'RSK-021', destination: 'SANCTIONS SCREEN · MODEL SWAP', gate: 'FIN-CRIME', sched: '15 AUG', status: 'on-time', remark: 'CHALLENGER PARITY MET', confidence: 0.84 },
  { id: 'f7', code: 'PAY-233', destination: 'VENDOR GATEWAY · CONTRACT SIGNING', gate: 'COMMERCIAL', sched: '18 AUG', status: 'delayed', remark: 'LEGAL REDLINES ROUND 3', confidence: 0.55 },
  { id: 'f8', code: 'OPS-077', destination: 'RUNBOOK DRILLS · WAVE 2 COMPLETE', gate: 'OPS CREW', sched: '22 AUG', status: 'on-time', remark: 'WAVE 1 PASSED 9/9', confidence: 0.91 },
  { id: 'f9', code: 'PAY-301', destination: 'FEES ENGINE · SHADOW BILLING', gate: 'BILLING', sched: '29 AUG', status: 'on-time', remark: 'SHADOW DELTA < 0.1%', confidence: 0.87 },
  { id: 'f10', code: 'TEC-410', destination: 'OBSERVABILITY · GOLDEN SIGNALS', gate: 'PLATFORM', sched: '02 SEP', status: 'on-time', remark: 'DASHBOARDS SIGNED OFF', confidence: 0.93 },
  { id: 'f11', code: 'PAY-188', destination: 'CORPORATE PORTAL · BETA INVITE', gate: 'CHANNELS', sched: '09 SEP', status: 'holding', remark: 'WAITS ON PAY-201 CANARY', confidence: 0.68 },
  { id: 'f12', code: 'ORG-012', destination: 'SUPPORT MODEL · HANDOVER SIGNED', gate: 'SERVICE MGMT', sched: '16 SEP', status: 'on-time', remark: 'TRAINING 78% COMPLETE', confidence: 0.82 },
];

export const STOPS = {
  title: 'Ground stops',
  sub: 'Blockers that hold a flight at the gate · owner answers daily',
  items: [
    {
      id: 'gs1',
      flightCode: 'PAY-114',
      title: 'Clearing-house connectivity certificate not yet countersigned',
      owner: 'Head of Core Payments',
      since: 'HELD SINCE 08 JUL',
      impact: 'Cutover rehearsal cannot enter the settlement window without it; every downstream wave shifts day-for-day.',
    },
  ] as GroundStop[],
} as const;

export const CONNECTIONS = {
  title: 'Connections',
  sub: 'Flights that wait on another flight landing first',
  items: [
    { id: 'c1', from: 'PAY-201', to: 'PAY-188', note: 'Portal beta invites only after the instant-rails canary holds one clean week.' },
    { id: 'c2', from: 'PAY-114', to: 'PAY-090', note: 'Region B auth migration books the same settlement window; rehearsal must land first.' },
    { id: 'c3', from: 'PAY-233', to: 'PAY-301', note: 'Shadow billing needs the vendor gateway rate card from the signed contract.' },
  ] as Connection[],
} as const;

export const CONFIDENCE = {
  title: 'Delivery confidence',
  sub: 'Tower estimate per flight · brief threshold at 70%',
  threshold: 0.7,
  note: 'Confidence is the tower’s composite of schedule float, open blockers, and rehearsal evidence — not a promise. Anything under the line is briefed by name.',
} as const;

export const FOOT = {
  note: 'The board restates at every tower watch. Between watches, statuses change only by exception call from the workstream gate.',
  provenance: TOWER.provenance,
  next: 'NEXT TOWER WATCH WED 15 JUL · 07:30',
} as const;
