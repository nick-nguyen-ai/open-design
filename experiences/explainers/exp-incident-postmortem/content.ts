/**
 * "The Inquiry" — shipped content for `exp-incident-postmortem`.
 *
 * A synthetic incident postmortem written as an accident-investigation
 * dossier. The incident, findings, and actions are invented.
 */

export type TraceBand = 'nominal' | 'degraded' | 'outage';

export interface TraceSegment {
  id: string;
  from: string;
  to: string;
  band: TraceBand;
  /** Segment width as a percentage of the recorder strip. */
  pct: number;
}

export interface TimelineEntry {
  id: string;
  at: string;
  entry: string;
  source: string;
}

export interface Finding {
  id: string;
  no: string;
  kind: 'root-cause' | 'contributing' | 'mitigating';
  finding: string;
  evidence: string;
}

export interface ActionItem {
  id: string;
  ref: string;
  action: string;
  owner: string;
  due: string;
  state: 'open' | 'in-review' | 'closed';
}

export const INQUIRY = {
  masthead: 'BOARD OF INQUIRY · INCIDENT INV-2214',
  office: 'CONVENED BY THE RELIABILITY OFFICE · MERIDIAN OPERATIONS',
  provenance: 'SYNTHETIC DOSSIER · A DEMONSTRATION INQUIRY, NOT A REAL INCIDENT',
  kicker: 'REPORT OF THE INQUIRY INTO',
  title: 'The payments authorisation outage of 02 July 2026',
  standfirst:
    '41 minutes of degraded authorisation, 12 of them full outage. No data was lost and no customer was double-charged. The inquiry finds one root cause, two contributing factors, and one mitigation that worked exactly as designed — each finding attributable to evidence a reader can pull.',
  facts: [
    { label: 'DURATION', value: '41 MIN' },
    { label: 'FULL OUTAGE', value: '12 MIN' },
    { label: 'FINDINGS', value: '4' },
    { label: 'ACTIONS RAISED', value: '5' },
  ],
} as const;

export const RECORDER = {
  title: 'Exhibit A — the recorder trace',
  sub: 'Service state, 13:00–14:20 · reconstructed from the golden signals',
  caption:
    'Recorder trace of the incident: nominal until 13:12, degraded from 13:12 to 13:31, full outage 13:31 to 13:43, degraded recovery until 13:53, nominal thereafter.',
  segments: [
    { id: 'sg1', from: '13:00', to: '13:12', band: 'nominal', pct: 15 },
    { id: 'sg2', from: '13:12', to: '13:31', band: 'degraded', pct: 24 },
    { id: 'sg3', from: '13:31', to: '13:43', band: 'outage', pct: 15 },
    { id: 'sg4', from: '13:43', to: '13:53', band: 'degraded', pct: 12 },
    { id: 'sg5', from: '13:53', to: '14:20', band: 'nominal', pct: 34 },
  ] as TraceSegment[],
} as const;

export const TIMELINE = {
  title: 'Exhibit B — the timeline',
  sub: 'Every entry carries its source · times from the recorder, not memory',
  entries: [
    { id: 'tl1', at: '13:07', entry: 'Routine certificate rotation begins on the auth-gateway fleet, one node at a time.', source: 'change log CH-8817' },
    { id: 'tl2', at: '13:12', entry: 'First node completes rotation and starts rejecting scheme responses: intermediate CA missing from its new bundle. Error rate 0.4% → 2.1%.', source: 'gateway logs · metric auth_reject_total' },
    { id: 'tl3', at: '13:19', entry: 'On-call paged on the 2% threshold. Rotation continues automatically — the rollout gate reads node health, not fleet error rate.', source: 'pager record P-3311 · finding F-2' },
    { id: 'tl4', at: '13:31', entry: 'Seventh of ten nodes rotated; healthy capacity below quorum. Full authorisation outage.', source: 'load-balancer state dump' },
    { id: 'tl5', at: '13:36', entry: 'Store-and-forward engages: incoming authorisations queue durably instead of failing. No customer transaction lost from this point.', source: 'queue depth metric · finding F-4' },
    { id: 'tl6', at: '13:39', entry: 'Root cause identified from a single node diff: the new bundle omits the scheme’s intermediate CA.', source: 'incident channel, timestamped' },
    { id: 'tl7', at: '13:43', entry: 'Rotation halted; three un-rotated nodes restored to the pool. Partial service resumes.', source: 'change log CH-8818' },
    { id: 'tl8', at: '13:53', entry: 'Corrected bundle deployed fleet-wide; queue drains in four minutes; service nominal.', source: 'gateway logs · queue metric' },
  ] as TimelineEntry[],
} as const;

export const FINDINGS = {
  title: 'The findings',
  sub: 'One root cause · two contributing · one mitigating — numbered, attributable, no blame theatre',
  items: [
    {
      id: 'f1',
      no: 'F-1',
      kind: 'root-cause',
      finding: 'The certificate bundle built for rotation omitted the scheme’s intermediate CA. The build script silently dropped chain entries it could not order.',
      evidence: 'Bundle diff attached; reproducible from build #2241.',
    },
    {
      id: 'f2',
      no: 'F-2',
      kind: 'contributing',
      finding: 'The rollout gate evaluated per-node health (process up, port open) but not fleet-level error rate, so the rotation marched on while rejections climbed.',
      evidence: 'Rollout policy file, version of 02 Jul; pager timeline.',
    },
    {
      id: 'f3',
      no: 'F-3',
      kind: 'contributing',
      finding: 'Certificate-chain validation existed in staging but ran against the staging scheme endpoint, whose trust store differs from production’s.',
      evidence: 'Staging pipeline config; trust-store comparison in the appendix.',
    },
    {
      id: 'f4',
      no: 'F-4',
      kind: 'mitigating',
      finding: 'Store-and-forward held every authorisation received during the outage and replayed them in order. Designed limit 20 minutes; used 12. Zero transactions lost.',
      evidence: 'Queue metrics; replay reconciliation REC-9034 (penny-perfect).',
    },
  ] as Finding[],
} as const;

export const CHAIN = {
  title: 'Exhibit C — the causal chain',
  sub: 'Read left to right · severing any link would have stopped the outage',
  links: [
    { id: 'c1', label: 'Build script drops CA silently', ref: 'F-1' },
    { id: 'c2', label: 'Staging validates the wrong trust store', ref: 'F-3' },
    { id: 'c3', label: 'Rotation gate blind to fleet error rate', ref: 'F-2' },
    { id: 'c4', label: 'Quorum lost → outage', ref: 'TRACE' },
  ],
} as const;

export const ACTIONS = {
  title: 'The action register',
  sub: 'Five actions · named owners · the register outlives the memory of the incident',
  items: [
    { id: 'a1', ref: 'ACT-118', action: 'Bundle build fails loudly on any unresolvable chain entry', owner: 'Platform Security', due: '24 JUL', state: 'in-review' },
    { id: 'a2', ref: 'ACT-119', action: 'Rollout gate adds fleet error-rate circuit breaker (halt at 1%)', owner: 'SRE Crew', due: '31 JUL', state: 'open' },
    { id: 'a3', ref: 'ACT-120', action: 'Staging validates against a production-mirrored trust store', owner: 'Platform Security', due: '07 AUG', state: 'open' },
    { id: 'a4', ref: 'ACT-121', action: 'Store-and-forward limit reviewed against peak-hour volumes', owner: 'Payments Crew', due: '14 AUG', state: 'open' },
    { id: 'a5', ref: 'ACT-117', action: 'Certificate rotations move to the change calendar’s guarded window', owner: 'Release Mgmt', due: 'DONE 10 JUL', state: 'closed' },
  ] as ActionItem[],
} as const;

export const FOOT = {
  note: 'This dossier is written for a reader who was not in the room. Findings cite evidence, not recollection; actions carry owners, not teams-in-general. The register is reviewed until every line closes.',
  next: 'REGISTER REVIEW · FORTNIGHTLY UNTIL CLOSED · NEXT 28 JUL',
} as const;
