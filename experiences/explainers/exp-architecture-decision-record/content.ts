/**
 * "The Minute Book" — shipped content for `exp-architecture-decision-record`.
 *
 * A synthetic architecture decision recorded as council minutes. The system,
 * options, votes, and dissent are invented.
 */

export type OptionOutcome = 'carried' | 'not-carried';

export interface ConsideredOption {
  id: string;
  letter: string;
  title: string;
  summary: string;
  strengths: string;
  weaknesses: string;
  outcome: OptionOutcome;
  outcomeNote: string;
}

export interface Consequence {
  id: string;
  text: string;
  owner: string;
  review: string;
}

export const BOOK = {
  masthead: 'MINUTE BOOK · ARCHITECTURE COUNCIL',
  sitting: 'MINUTES OF THE 14TH SITTING · 09 JUL 2026 · RECORD ADR-031',
  provenance: 'SYNTHETIC RECORD · A DEMONSTRATION DECISION, NOT A LIVE SYSTEM',
  kicker: 'IN THE MATTER OF',
  title: 'Selecting the event backbone for the payments estate',
  present:
    'PRESENT: the Chief Architect (chair) · Payments Platform Lead · Data Platform Lead · Head of SRE · Model Risk Observer',
  status: 'STATUS: ADOPTED · REVIEW BOOKED JAN 2027',
} as const;

export const CONTEXT = {
  minute: 'MINUTE 1 · CONTEXT READ INTO THE RECORD',
  paragraphs: [
    'The payments estate currently integrates through a mixture of point-to-point REST calls and a legacy message broker approaching end of support in March 2027. Twelve services publish state changes; nineteen consume them. Three incidents in the last two quarters trace to consumers polling stale state, and every new integration currently requires a bilateral design conversation.',
    'The council was asked to decide the estate’s event backbone before the Q4 build window, with the legacy broker’s sunset as the forcing date. The decision was taken with the whole council present, on the evidence appended to this record — two proofs of concept, one load test at 3× peak, and the SRE operability review.',
  ],
} as const;

export const OPTIONS = {
  minute: 'MINUTE 2 · OPTIONS CONSIDERED',
  note: 'Rejected options remain in the record, struck through but legible — a year from now the question will be “did we consider X?”, and the answer must be on this page.',
  items: [
    {
      id: 'opt-a',
      letter: 'A',
      title: 'Managed Kafka (cloud provider)',
      summary: 'The de-facto standard log, operated by the cloud provider, with the payments schema registry alongside.',
      strengths: 'Ecosystem, ordered replay, provider operates the hard parts; both PoCs passed; 3× load test clean.',
      weaknesses: 'Per-partition cost discipline needed; consumer lag monitoring is ours to build.',
      outcome: 'carried',
      outcomeNote: 'CARRIED 4–1 · ONE DISSENT MINUTED BELOW',
    },
    {
      id: 'opt-b',
      letter: 'B',
      title: 'Self-hosted NATS JetStream',
      summary: 'Lightweight streaming self-operated on the platform Kubernetes estate.',
      strengths: 'Operationally simple per node; excellent latency in the PoC.',
      weaknesses: 'We become the operator of record for a Tier-1 dependency; on-call maturity for it does not exist today; hiring for it is a bet.',
      outcome: 'not-carried',
      outcomeNote: 'NOT CARRIED · OPERABILITY REVIEW RATED IT AMBER-RED',
    },
    {
      id: 'opt-c',
      letter: 'C',
      title: 'Extend the legacy broker contract',
      summary: 'Negotiate extended support and defer the decision two years.',
      strengths: 'Zero migration cost this year.',
      weaknesses: 'Prices the estate’s three polling incidents at zero; extended support quote exceeds option A’s two-year run cost; defers, does not decide.',
      outcome: 'not-carried',
      outcomeNote: 'NOT CARRIED · UNANIMOUS',
    },
  ] as ConsideredOption[],
} as const;

export const RESOLUTION = {
  minute: 'MINUTE 3 · THE RESOLUTION',
  text: 'RESOLVED that the payments estate adopts managed Kafka as its event backbone; that all new integrations from 01 September 2026 publish and subscribe through it under the payments schema registry; that the legacy broker is drained by 28 February 2027, one month ahead of sunset; and that no service may consume another’s database as an integration path from the date of this record.',
} as const;

export const CONSEQUENCES = {
  minute: 'MINUTE 4 · CONSEQUENCES MINUTED',
  items: [
    { id: 'c1', text: 'A consumer-lag SLO and dashboard exist before the first production topic.', owner: 'Head of SRE', review: 'AUG 2026' },
    { id: 'c2', text: 'The schema registry gates breaking changes in CI across all twelve publishers.', owner: 'Payments Platform Lead', review: 'SEP 2026' },
    { id: 'c3', text: 'Partition cost review runs quarterly; the first one calibrates the budget alarms.', owner: 'Data Platform Lead', review: 'OCT 2026' },
    { id: 'c4', text: 'Migration order for the nineteen consumers is published as ADR-031a.', owner: 'Chief Architect', review: 'AUG 2026' },
  ] as Consequence[],
} as const;

export const DISSENT = {
  minute: 'MINUTE 5 · DISSENT RECORDED',
  text: 'The Head of SRE dissented from the choice of option A on the narrow ground that consumer-lag operability should have been a precondition, not a consequence; the dissent is recorded with the majority’s undertaking that consequence 4.1 lands before first production traffic. The dissent does not block adoption.',
} as const;

export const CLOSING = {
  confirmLine: 'Confirmed as a true record of the 14th sitting.',
  chair: 'THE CHAIR · ARCHITECTURE COUNCIL',
  date: '09 JUL 2026',
  nextReview: 'This record is re-read at the January 2027 sitting; if reality has diverged, the divergence is minuted, not hidden.',
} as const;

export const FOOT = {
  note: 'Minutes are append-only: later sittings may supersede this record with a new ADR, but no line of this page is ever edited after confirmation.',
  next: 'NEXT SITTING · 15TH · 06 AUG 2026',
} as const;
