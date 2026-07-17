/**
 * "The Lock Sequence" — shipped content for `exp-migration-plan`.
 *
 * A synthetic platform migration drawn as a canal lock sequence. The system,
 * chambers, gates, and passage log are invented.
 */

export type ChamberState = 'passed' | 'in-chamber' | 'ahead';

export interface Chamber {
  id: string;
  no: string;
  name: string;
  lift: string;
  moves: string;
  gateOpens: string;
  drainGate: string;
  state: ChamberState;
}

export interface PassageEntry {
  id: string;
  date: string;
  entry: string;
  kind: 'passage' | 'hold' | 'drain-test';
}

export const SEQUENCE = {
  masthead: 'NAVIGATION AUTHORITY · MIGRATION LOCK SEQUENCE',
  chartRef: 'CHART ML-7 · PAYMENTS PLATFORM PASSAGE · REVISED 14 JUL 2026',
  provenance: 'SYNTHETIC PLAN · A DEMONSTRATION PASSAGE, NOT A LIVE MIGRATION',
  kicker: 'FROM CURRENT WATER TO TARGET WATER',
  statement: 'Five chambers. A drain gate on every one.',
  subline:
    'The payments platform moves from the on-premise basin to the cloud basin the way a vessel climbs a canal: one lock chamber at a time, each with an entry gate that opens only on evidence, and a drain gate that can lower the vessel back to the previous chamber in under an hour. The vessel is currently in Chamber 2.',
  figures: [
    { label: 'CHAMBERS', value: '5' },
    { label: 'DRAIN GATES', value: '5' },
    { label: 'VESSEL POSITION', value: 'CH 2' },
    { label: 'TARGET WATER', value: 'Q4 2026' },
  ],
} as const;

export const SECTION = {
  title: 'The sectional elevation',
  sub: 'Read left to right, rising · the vessel never skips a chamber',
  caption:
    'Sectional elevation of the lock sequence: five chambers rise from the on-premise basin to the cloud basin — Shadow, Dual-Write, Read Cutover, Write Cutover, Decommission. The vessel sits in Chamber 2. Each chamber has a drain gate back to the previous water.',
} as const;

export const CHAMBERS: Chamber[] = [
  {
    id: 'ch1',
    no: 'CHAMBER 1',
    name: 'SHADOW',
    lift: 'Cloud replicas filled from on-prem · read-only',
    moves: 'Data replication, schema conversion, cloud read replicas standing.',
    gateOpens: 'Replica lag < 5s sustained 7 days; row-count parity 100% on all 34 tables.',
    drainGate: 'Stop replication; discard replicas. Nothing upstream notices. Drain time: minutes.',
    state: 'passed',
  },
  {
    id: 'ch2',
    no: 'CHAMBER 2',
    name: 'DUAL-WRITE',
    lift: 'Every write lands in both basins',
    moves: 'Write mirroring at the service layer; nightly parity reconciliation.',
    gateOpens: '14 consecutive clean parity runs; mirrored-write p95 overhead < 8ms.',
    drainGate: 'Feature-flag off the mirror; cloud basin drains to shadow. Drain time: < 10 min.',
    state: 'in-chamber',
  },
  {
    id: 'ch3',
    no: 'CHAMBER 3',
    name: 'READ CUTOVER',
    lift: 'Reads served from the cloud basin',
    moves: 'Read traffic shifts 1% → 10% → 50% → 100% behind the routing flag.',
    gateOpens: 'Error rate and p95 within corridor at each step for 48h; no parity drift.',
    drainGate: 'Routing flag back to on-prem reads. Drain time: < 5 min, no data movement.',
    state: 'ahead',
  },
  {
    id: 'ch4',
    no: 'CHAMBER 4',
    name: 'WRITE CUTOVER',
    lift: 'The cloud basin becomes the system of record',
    moves: 'Writes commit cloud-first; on-prem becomes the mirror.',
    gateOpens: 'Settlement window rehearsed twice clean; sign-off from risk and operations.',
    drainGate: 'Reverse the mirror direction — the rehearsed path, kept warm. Drain time: < 60 min.',
    state: 'ahead',
  },
  {
    id: 'ch5',
    no: 'CHAMBER 5',
    name: 'DECOMMISSION',
    lift: 'The on-premise basin is drained',
    moves: 'Mirror stopped; on-prem archived to cold storage; contracts wound down.',
    gateOpens: '90 days at target water with zero drain-gate pulls; archive restore tested.',
    drainGate: 'None beyond this point — the archive is the record. This gate is why the chamber waits 90 days.',
    state: 'ahead',
  },
];

export const DOCTRINE = {
  title: 'The drain-gate doctrine',
  sub: 'What makes this a lock sequence and not a leap',
  rules: [
    { id: 'd1', rule: 'A gate opens on evidence, never on schedule', note: 'Dates are targets; parity runs and rehearsals are the key. A chamber holds the vessel as long as it must.' },
    { id: 'd2', rule: 'Every drain gate is tested while it is not needed', note: 'Each chamber’s rollback is pulled once, deliberately, during quiet hours — a drain gate that has never been opened is a drawing, not a gate.' },
    { id: 'd3', rule: 'One vessel, one chamber', note: 'No parallel half-migrations: the whole platform is in exactly one chamber at all times, and everyone can name it.' },
  ],
} as const;

export const PASSAGE_LOG = {
  title: 'The passage log',
  sub: 'What the vessel has done so far · holds recorded as plainly as passages',
  entries: [
    { id: 'p1', date: '02 MAY', entry: 'Entered Chamber 1 (Shadow). Replication established across all 34 tables.', kind: 'passage' },
    { id: 'p2', date: '19 MAY', entry: 'Chamber 1 drain gate tested: replication stopped and re-established in 22 minutes.', kind: 'drain-test' },
    { id: 'p3', date: '09 JUN', entry: 'Gate 2 opened on evidence: 7 days lag < 5s, parity 100%. Entered Chamber 2 (Dual-Write).', kind: 'passage' },
    { id: 'p4', date: '24 JUN', entry: 'HOLD: parity run flagged a timezone defect in mirrored timestamps. Vessel held; defect fixed; parity streak reset to zero by the doctrine.', kind: 'hold' },
    { id: 'p5', date: '08 JUL', entry: 'Chamber 2 drain gate tested during quiet hours: mirror off and on in 6 minutes, clean.', kind: 'drain-test' },
    { id: 'p6', date: '14 JUL', entry: 'Parity streak at 11 of 14 required clean runs. Gate 3 forecast: week of 21 JUL.', kind: 'passage' },
  ] as PassageEntry[],
} as const;

export const FOOT = {
  note: 'The chart is the plan of record: chambers, gates, and drain gates change only by revision, and every revision is logged on the plate. If the passage and the chart disagree, the passage stops.',
  next: 'GATE 3 REVIEW · WEEK OF 21 JUL · EVIDENCE PACK IN PREPARATION',
} as const;
