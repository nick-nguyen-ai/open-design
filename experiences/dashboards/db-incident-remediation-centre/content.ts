/**
 * "The Triage Bay" — shipped content for `db-incident-remediation-centre`.
 *
 * Synthetic demonstration data for a fictional operations incident bay.
 * Every incident, vital, and intervention is invented.
 */

export type Lane = 'triage' | 'containment' | 'remediation' | 'review';
export type Severity = 'critical' | 'major' | 'minor';

export interface IncidentChart {
  id: string;
  ref: string;
  title: string;
  severity: Severity;
  lane: Lane;
  service: string;
  errRate: string;
  p95: string;
  inLane: string;
  owner: string;
}

export interface Intervention {
  id: string;
  at: string;
  label: string;
  detail: string;
  kind: 'action' | 'observation' | 'escalation';
}

export interface VitalPoint {
  x: string;
  y: number;
}

export const BAY = {
  masthead: 'MERIDIAN OPERATIONS · INCIDENT TRIAGE BAY',
  shift: 'NIGHT SHIFT · TUE 14 JUL 2026 · 03:20',
  standard: 'EVERY PATIENT HAS A CHART · EVERY INTERVENTION IS TIMED',
  provenance: 'SYNTHETIC DEMONSTRATION DATA · NOT A LIVE INCIDENT ROOM',
  kicker: 'THE BAY AT 03:20',
  statement: 'Five in the bay. One on the critical board.',
  subline:
    'INC-2214 — payment authorisation errors — is forty minutes into containment with error rate falling since the feature-flag rollback. The other four patients are stable, moving through their lanes on protocol. Nothing is waiting in triage unseen.',
  figures: [
    { label: 'IN THE BAY', value: '5' },
    { label: 'CRITICAL', value: '1' },
    { label: 'MEAN TIME IN BAY', value: '3.2h' },
    { label: 'DISCHARGED THIS WEEK', value: '11' },
  ],
} as const;

export const LANES: { id: Lane; label: string; note: string }[] = [
  { id: 'triage', label: 'TRIAGE', note: 'assess & assign' },
  { id: 'containment', label: 'CONTAINMENT', note: 'stop the bleeding' },
  { id: 'remediation', label: 'REMEDIATION', note: 'fix the cause' },
  { id: 'review', label: 'REVIEW', note: 'discharge & learn' },
];

export const WARD = {
  title: 'The bay',
  sub: 'Incidents move left to right · a chart never skips a lane',
} as const;

export const INCIDENTS: IncidentChart[] = [
  {
    id: 'i1',
    ref: 'INC-2214',
    title: 'Card authorisation error rate above 2%',
    severity: 'critical',
    lane: 'containment',
    service: 'PAYMENTS AUTH',
    errRate: '1.4% ↓',
    p95: '840ms',
    inLane: '00:42 IN LANE',
    owner: 'ON CALL · PAYMENTS CREW',
  },
  {
    id: 'i2',
    ref: 'INC-2215',
    title: 'Batch settlement file delayed at scheme gateway',
    severity: 'major',
    lane: 'triage',
    service: 'SETTLEMENT',
    errRate: '0.0%',
    p95: 'n/a',
    inLane: '00:08 IN LANE',
    owner: 'TRIAGE NURSE · OPS',
  },
  {
    id: 'i3',
    ref: 'INC-2211',
    title: 'Mobile login latency regression after release 44.2',
    severity: 'major',
    lane: 'remediation',
    service: 'IDENTITY',
    errRate: '0.2%',
    p95: '1.9s ↓',
    inLane: '02:10 IN LANE',
    owner: 'IDENTITY CREW',
  },
  {
    id: 'i4',
    ref: 'INC-2209',
    title: 'Duplicate notifications from campaign worker',
    severity: 'minor',
    lane: 'remediation',
    service: 'MESSAGING',
    errRate: '0.1%',
    p95: '220ms',
    inLane: '04:44 IN LANE',
    owner: 'CHANNELS CREW',
  },
  {
    id: 'i5',
    ref: 'INC-2206',
    title: 'Stale balances on the open-banking API (resolved)',
    severity: 'major',
    lane: 'review',
    service: 'OPEN BANKING',
    errRate: '0.0%',
    p95: '310ms',
    inLane: 'AWAITING REVIEW',
    owner: 'PLATFORM CREW',
  },
];

export const CASE = {
  title: 'The critical board: INC-2214',
  sub: 'Vitals and interventions for the one patient that matters most right now',
  vitalsHeading: 'ERROR RATE · LAST 4 HOURS',
  chartTitle: 'INC-2214 — card authorisation error rate, last four hours',
  chartSource: 'Per-five-minute authorisation error rate against the 0.5% discharge threshold. Synthetic demonstration data.',
  dischargeThreshold: 0.5,
  interventionsHeading: 'INTERVENTIONS · TIMED',
  interventions: [
    { id: 'v1', at: '02:38', label: 'Paged on the 2% breach', detail: 'Auto-page fired at 3 consecutive breaching windows; acknowledged in 90 seconds.', kind: 'escalation' },
    { id: 'v2', at: '02:47', label: 'Feature flag rollback', detail: 'Rolled back auth-retry-v2 flag to previous cohort; error rate began falling within two windows.', kind: 'action' },
    { id: 'v3', at: '03:05', label: 'Scheme confirmed healthy', detail: 'Counterparty status page and direct probe both clean — fault is ours, not the scheme’s.', kind: 'observation' },
    { id: 'v4', at: '03:15', label: 'Root-cause suspect isolated', detail: 'Retry storm from the new backoff curve under degraded issuer responses; fix drafted for review.', kind: 'action' },
  ] as Intervention[],
} as const;

/** Four hours of error-rate vitals, five-minute windows (percent). */
export const VITALS: VitalPoint[] = (() => {
  const points: VitalPoint[] = [];
  for (let i = 0; i < 48; i += 1) {
    const minutes = i * 5;
    const hh = String(Math.floor(minutes / 60) + 23).padStart(2, '0');
    const mm = String(minutes % 60).padStart(2, '0');
    const label = `${hh === '23' ? '23' : String(Number(hh) - 24 >= 0 ? Number(hh) - 24 : hh).padStart(2, '0')}:${mm}`;
    let y = 0.18 + 0.05 * Math.sin(i / 4);
    if (i >= 30 && i < 36) y = 0.4 + (i - 30) * 0.45; // the climb
    if (i >= 36 && i < 39) y = 2.6 - (i - 36) * 0.35; // peak & flag rollback
    if (i >= 39) y = Math.max(0.55, 1.55 - (i - 39) * 0.14); // falling since rollback
    points.push({ x: label, y: Math.round(y * 100) / 100 });
  }
  return points;
})();

export const PROTOCOL = {
  title: 'Discharge protocol',
  sub: 'A chart leaves the bay only when all three hold',
  items: [
    { id: 'p1', rule: 'Vitals under threshold for 60 minutes', note: 'For INC-2214: error rate < 0.5% sustained — currently 22 minutes and falling.' },
    { id: 'p2', rule: 'Root cause named, not guessed', note: 'A suspect is not a cause; the fix must reference the failing mechanism.' },
    { id: 'p3', rule: 'Review scheduled with the learning owner', note: 'Discharge books the postmortem before the chart closes, never after.' },
  ],
} as const;

export const FOOT = {
  note: 'The bay board is the single source of incident state; nothing moves lanes by chat message. Interventions are written as they happen, timed to the minute.',
  next: 'SHIFT HANDOVER 07:00',
} as const;
