/**
 * "The Test Stand" — shipped content for `exp-testing-validation-strategy`.
 *
 * A synthetic testing strategy for a payments decision service, staged as
 * three glass panes of evidence. All suites, claims, and runs are invented.
 */

export interface PaneClaim {
  id: string;
  claim: string;
  lit: boolean;
  evidence: string;
}

export interface GlassPane {
  id: string;
  layer: string;
  name: string;
  proves: string;
  cadence: string;
  volume: string;
  claims: PaneClaim[];
}

export const STAND = {
  masthead: 'THE TEST STAND · EVIDENCE OF COVERAGE',
  system: 'PAYMENTS DECISION SERVICE · MERIDIAN ENGINEERING',
  provenance: 'SYNTHETIC STRATEGY · A DEMONSTRATION STAND, NOT A LIVE SERVICE',
  kicker: 'CLAIMS ARE LIT BY EVIDENCE, NOT BY ASSERTION',
  statement: 'Look through the layers. A claim is lit or it is not.',
  subline:
    'Coverage claims usually arrive as adjectives — “well tested”, “fully covered”. This stand replaces the adjectives with lamps: twelve concrete claims across three panes of glass, each lamp lit only by a named suite and its latest run. Two lamps are honestly dark, and what would light them is written next to them.',
  figures: [
    { label: 'GLASS PANES', value: '3' },
    { label: 'CLAIMS ON THE STAND', value: '12' },
    { label: 'LIT BY EVIDENCE', value: '10' },
    { label: 'HONESTLY DARK', value: '2' },
  ],
} as const;

export const PANES_BAND = {
  title: 'The glass stack',
  sub: 'Unit at the bottom, validation at the top · each pane trusts the one below only through its lamps',
} as const;

export const PANES: GlassPane[] = [
  {
    id: 'unit',
    layer: 'PANE 1 · BOTTOM',
    name: 'UNIT',
    proves: 'Each decision rule computes what its specification says, in isolation.',
    cadence: 'Every commit · ~40s',
    volume: '1,214 tests',
    claims: [
      { id: 'u1', claim: 'Every fee rule matches the published fee schedule', lit: true, evidence: 'suite fees.spec · run #8812 · 214/214' },
      { id: 'u2', claim: 'Limit checks reject at exactly the boundary', lit: true, evidence: 'suite limits.spec · run #8812 · boundary matrix 48/48' },
      { id: 'u3', claim: 'Currency rounding follows the scheme rulebook', lit: true, evidence: 'suite rounding.spec · run #8812 · 96 golden cases' },
      { id: 'u4', claim: 'Malformed inputs never reach a decision', lit: true, evidence: 'suite guards.spec · fuzz corpus 50k · 0 escapes' },
    ],
  },
  {
    id: 'integration',
    layer: 'PANE 2 · MIDDLE',
    name: 'INTEGRATION',
    proves: 'The service and its real neighbours agree — contracts, queues, and stores.',
    cadence: 'Every merge · ~6 min',
    volume: '183 tests',
    claims: [
      { id: 'i1', claim: 'The published API contract is honoured byte-for-byte', lit: true, evidence: 'contract pack v3.2 · run #4118 · all consumers green' },
      { id: 'i2', claim: 'Decisions survive a broker restart without loss', lit: true, evidence: 'suite chaos-broker · run #4110 · 3/3 drills' },
      { id: 'i3', claim: 'The decision store round-trips every field', lit: true, evidence: 'suite store-roundtrip · run #4118 · schema v12' },
      { id: 'i4', claim: 'Downstream timeouts degrade to the documented fallback', lit: false, evidence: 'DARK — fallback path exists; the timeout drill is written but not yet wired into CI (TS-141)' },
    ],
  },
  {
    id: 'validation',
    layer: 'PANE 3 · TOP',
    name: 'VALIDATION',
    proves: 'The whole service behaves correctly against business reality, over time.',
    cadence: 'Nightly · ~40 min',
    volume: '31 scenarios',
    claims: [
      { id: 'v1', claim: 'A day of production traffic replays to identical decisions', lit: true, evidence: 'replay pack 2026-07-13 · 1.9m decisions · 0 diffs' },
      { id: 'v2', claim: 'Decision latency holds its budget at 3× peak', lit: true, evidence: 'load rig run L-88 · p95 41ms vs 60ms budget' },
      { id: 'v3', claim: 'Declined customers can always be told why', lit: true, evidence: 'reason-code audit · nightly · 100% mapped' },
      { id: 'v4', claim: 'Rule changes cannot ship without a replayed shadow run', lit: false, evidence: 'DARK — enforced by convention today; the pipeline gate lands with TS-139' },
    ],
  },
];

export const DARK_CLAIMS = {
  title: 'The two dark lamps',
  sub: 'Named, owned, and dated — dark is a state, not a secret',
  items: [
    {
      id: 'd1',
      ref: 'TS-141',
      pane: 'INTEGRATION',
      claim: 'Downstream timeouts degrade to the documented fallback',
      lightsWhen: 'The timeout drill joins the merge pipeline and passes three consecutive runs.',
      owner: 'Payments Crew',
      due: '31 JUL',
    },
    {
      id: 'd2',
      ref: 'TS-139',
      pane: 'VALIDATION',
      claim: 'Rule changes cannot ship without a replayed shadow run',
      lightsWhen: 'The shadow-replay gate blocks a deliberately un-replayed change in a fire-drill.',
      owner: 'Platform Crew',
      due: '14 AUG',
    },
  ],
} as const;

export const DOCTRINE = {
  title: 'The stand doctrine',
  sub: 'How the panes relate',
  rules: [
    { id: 'r1', rule: 'A layer trusts the layer below only through its lamps', note: 'Integration tests assume unit-proven rules; they re-test none of them. No layer re-litigates another’s claims.' },
    { id: 'r2', rule: 'A dark lamp blocks the adjective, not the release', note: 'The service ships with two dark lamps — but nobody may say “fully tested” while they are dark. Language follows the lamps.' },
    { id: 'r3', rule: 'Evidence expires', note: 'A lamp goes dark automatically if its suite has not run green in 7 days. Old evidence is not evidence.' },
  ],
} as const;

export const FOOT = {
  note: 'The stand is generated from CI metadata nightly; lamps cannot be lit by hand. An auditor starts from any lamp and pulls its run — the chain from claim to evidence is one click, not one meeting.',
  next: 'TS-141 DRILL REVIEW · 31 JUL',
} as const;
