/**
 * "The Work Order" — shipped content for
 * `exp-coding-agent-implementation-plan`.
 *
 * A synthetic implementation plan for a coding agent, written as a
 * manufacturing traveler. The job, operations, and stamps are invented.
 */

export type OpState = 'stamped' | 'in-progress' | 'queued';

export interface Operation {
  id: string;
  op: string;
  task: string;
  files: string;
  acceptance: string[];
  evidence: string;
  state: OpState;
  stamp?: string;
}

export interface Tolerance {
  id: string;
  rule: string;
  why: string;
}

export const ORDER = {
  masthead: 'WORK ORDER WO-2026-0714 · TRAVELER',
  shop: 'MERIDIAN ENGINEERING · AGENT WORKSHOP',
  provenance: 'SYNTHETIC PLAN · A DEMONSTRATION JOB, NOT A LIVE CHANGE',
  kicker: 'JOB CARD',
  job: 'Add per-client rate limiting to the public payments API',
  jobNote:
    'One traveler, seven operations. The agent executes the operations in routing order; a reviewer can verify any operation independently from its acceptance criteria and evidence line — the same card, read by both.',
  facts: [
    { label: 'REQUESTED BY', value: 'Payments Platform Lead' },
    { label: 'ASSIGNED TO', value: 'Coding agent · sonnet-4.5 lane' },
    { label: 'ROUTING', value: '7 OPERATIONS · SEQUENTIAL' },
    { label: 'STATUS', value: 'OP 040 IN PROGRESS' },
  ],
} as const;

export const ROUTING = {
  title: 'Routing',
  sub: 'The card moves through the shop in this order · no operation is skipped',
} as const;

export const OPERATIONS: Operation[] = [
  {
    id: 'op010',
    op: 'OP 010',
    task: 'Pin the current behaviour with characterisation tests',
    files: 'apps/api/test/rate-limit.spec.ts (new)',
    acceptance: [
      'Tests capture today’s unthrottled behaviour at 3 request volumes',
      'Suite runs green against unmodified main',
    ],
    evidence: 'CI run #4102 attached to the card',
    state: 'stamped',
    stamp: 'QA PASS · 12 JUL',
  },
  {
    id: 'op020',
    op: 'OP 020',
    task: 'Introduce the token-bucket limiter behind a disabled flag',
    files: 'apps/api/src/middleware/rate-limit.ts (new) · flags.ts',
    acceptance: [
      'Limiter unit tests cover refill, burst, and clock-skew cases',
      'Flag OFF → byte-identical responses (characterisation suite green)',
    ],
    evidence: 'CI run #4108 · flag audit log entry',
    state: 'stamped',
    stamp: 'QA PASS · 12 JUL',
  },
  {
    id: 'op030',
    op: 'OP 030',
    task: 'Wire per-client limits from the client registry',
    files: 'rate-limit.ts · client-registry.ts · config/limits.yaml (new)',
    acceptance: [
      'Unknown clients receive the default tier limit',
      'Limit changes in limits.yaml apply without redeploy (hot reload test)',
    ],
    evidence: 'CI run #4113 · hot-reload demo recording',
    state: 'stamped',
    stamp: 'QA PASS · 13 JUL',
  },
  {
    id: 'op040',
    op: 'OP 040',
    task: 'Return contract-correct 429s with Retry-After',
    files: 'rate-limit.ts · errors.ts · openapi.yaml',
    acceptance: [
      '429 body matches the published error schema exactly',
      'Retry-After honours the bucket refill time, never a constant',
      'OpenAPI diff shows only the documented addition',
    ],
    evidence: 'Contract-test suite + schema diff, pending',
    state: 'in-progress',
  },
  {
    id: 'op050',
    op: 'OP 050',
    task: 'Emit limiter metrics and wire the operations dashboard',
    files: 'rate-limit.ts · metrics.ts · dashboards/api-limits.json (new)',
    acceptance: [
      'throttle_total and near_limit_ratio exported per client tier',
      'Dashboard shows top-10 throttled clients over 24h',
    ],
    evidence: 'Dashboard screenshot + metric names in the card',
    state: 'queued',
  },
  {
    id: 'op060',
    op: 'OP 060',
    task: 'Canary: enable for internal clients at 10% traffic',
    files: 'flags.ts (flag ON for canary cohort)',
    acceptance: [
      '48h canary with zero unexpected 429s for compliant clients',
      'p95 latency delta < 2ms through the limiter path',
    ],
    evidence: 'Canary report generated from the dashboard',
    state: 'queued',
  },
  {
    id: 'op070',
    op: 'OP 070',
    task: 'General enablement and traveler close-out',
    files: 'flags.ts · CHANGELOG.md · this traveler',
    acceptance: [
      'Flag ON for all clients; characterisation suite retired or updated',
      'Close-out note links every stamped operation’s evidence',
    ],
    evidence: 'Final QA stamp closes the card',
    state: 'queued',
  },
];

export const TOLERANCES = {
  title: 'Materials & tolerances',
  sub: 'Constraints the job must hold · out-of-tolerance work is rejected at QA regardless of tests',
  items: [
    { id: 't1', rule: 'Do not modify the authentication middleware', why: 'Out of scope; it carries its own review chain and a separate traveler.' },
    { id: 't2', rule: 'Public API contract changes must be additive', why: 'Existing consumers may not be broken; the 429 addition is documented in OP 040.' },
    { id: 't3', rule: 'Latency budget: ≤ 2ms p95 through the limiter', why: 'The payments path carries a hard end-to-end budget; this job’s share is 2ms.' },
    { id: 't4', rule: 'Every operation lands as its own reviewable merge', why: 'A reviewer verifies one operation at a time — no combined mega-change.' },
  ] as Tolerance[],
} as const;

export const SIGNOFF = {
  title: 'Sign-off chain',
  sub: 'The card closes only when every box is stamped',
  chain: [
    { id: 's1', role: 'AGENT', name: 'Executes operations in routing order', done: true },
    { id: 's2', role: 'REVIEWER', name: 'Stamps each operation against its criteria', done: false },
    { id: 's3', role: 'PLATFORM LEAD', name: 'Approves canary and general enablement', done: false },
  ],
} as const;

export const FOOT = {
  note: 'A traveler is exact on purpose: if the agent and the reviewer read the same card differently, the card is wrong and gets fixed before the work continues.',
  next: 'CARD REVIEWED AT SHOP STAND-UP · DAILY 09:15',
} as const;
